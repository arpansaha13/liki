import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { relative, resolve } from 'node:path'

import mri from 'mri'
import { parse } from 'parse-package-name'
import semverGt from 'semver/functions/gt'
import type SemVer from 'semver/classes/semver'
import semverCoerce from 'semver/functions/coerce'

import createLogger from '~/logger'
import { isNullOrUndefined } from '~/utils/base'
import { getGlobalConfig, type LnpmConfigType } from '~/utils/config'

let globalConfig: LnpmConfigType = null!
const logger = createLogger()

export default async function install() {
  const args = mri(process.argv.slice(2), {
    alias: { P: 'save-prod', D: 'save-dev', O: 'save-optional', g: 'global' },
    boolean: ['save-prod', 'save-dev', 'save-optional', 'global'],
  })
  const pkgNameAndVersion = args._[1]

  if (isNullOrUndefined(pkgNameAndVersion)) {
    logger.error('No package name provided')
    process.exit(1)
  }

  globalConfig = await getGlobalConfig()
  if (!existsSync(globalConfig.storeDir)) {
    logger.error(`Could not resolve global store path: ${globalConfig.storeDir}`)
    process.exit(1)
  }

  await doInstall(args)
}

async function doInstall(args: mri.Argv) {
  let command = `${globalConfig.pkgManager} add`
  if (args.D) command += ' -D'
  else if (args.P) command += ' -P'
  else if (args.O) command += ' -O'
  else if (args.g) command += ' -g'

  for (let i = 1; i < args._.length; i++) {
    const pkgNameAndVersion = args._[i]

    const { pkgName, pkgVersion } = await getPkgNameAndVersion(pkgNameAndVersion)

    const pkgDirPath = resolve(globalConfig.storeDir, pkgName.replace('/', '+'), `v${pkgVersion}`)
    const tarballName = await getTarballName(pkgDirPath)
    const installPath = resolve(pkgDirPath, tarballName)
    const installPathRelative = relative(process.cwd(), installPath).replaceAll('\\', '/')

    command += ` "${installPathRelative}"`
  }

  spawn(command, { cwd: process.cwd(), shell: true, stdio: 'inherit' })
}

async function getPkgNameAndVersion(pkgNameAndVersion: string) {
  const parsed = parse(pkgNameAndVersion)
  const pkgVersion = parsed.version === 'latest' ? await getLatestVersion(parsed.name) : semverCoerce(parsed.version)
  if (pkgVersion === null) {
    logger.error('Internal Error: Invalid version')
    process.exit(1)
  }
  return { pkgName: parsed.name, pkgVersion }
}

/** Find latest version of package. */
async function getLatestVersion(pkgName: string): Promise<SemVer> {
  const sourcePath = resolve(globalConfig.storeDir, pkgName.replace('/', '+'))
  const dirents = await readdir(sourcePath, { withFileTypes: true })

  const versions = dirents
    .filter(dirent => dirent.isDirectory())
    .map(dirent => {
      const version = semverCoerce(dirent.name)
      if (version === null) logger.warn(`Internal Error: Invalid version directory name "${dirent.name}"`)
      return version
    })
    .filter(v => !isNullOrUndefined(v)) as SemVer[]

  let maxVersion = versions[0]
  for (const version of versions) {
    if (semverGt(version, maxVersion)) maxVersion = version
  }
  return maxVersion
}
async function getTarballName(pkgDirPath: string): Promise<string> {
  const dirents = await readdir(pkgDirPath, { withFileTypes: true })

  if (dirents.length > 1) {
    logger.warn(
      `Internal Error: There should be only one tarball file in a pkg-version directory - found ${dirents.length} at ${pkgDirPath}`
    )
  }
  const tarballNames = dirents.filter(dirent => dirent.isFile()).map(dirent => dirent.name)
  return tarballNames[0]
}
