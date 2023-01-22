import { existsSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { copyFile, mkdir, rm } from 'node:fs/promises'

import mri from 'mri'
import { extract } from 'tar' // 'tar' is probably not tree-shakable

import createLogger from '~/logger'
import { isNullOrUndefined, readJsonFile } from '~/utils/base'
import { getGlobalConfig, type LikiConfigType } from '~/utils/config'

const logger = createLogger()

/**
 * ## liki store add
 *
 * ### Usage
 *
 * ```bash
 *  liki store add <absolute-path-to-pkg>
 * ```
 */

export default async function storeAdd() {
  const args = mri(process.argv.slice(2))
  const pathToTarball = args._[2]

  if (isNullOrUndefined(pathToTarball)) {
    logger.error(`No path to tarball file provided`)
    process.exit(1)
  }
  if (!existsSync(pathToTarball)) {
    logger.error(`No tarball file found with the given path: ${pathToTarball}`)
    process.exit(1)
  }
  const globalConfig = await getGlobalConfig()

  if (!existsSync(globalConfig.storeDir)) {
    logger.error(`Could not resolve global store path: ${globalConfig.storeDir}`)
    process.exit(1)
  }
  await doAdd(pathToTarball, globalConfig)
}

async function doAdd(pathToTarball: string, globalConfig: Readonly<LikiConfigType>) {
  const tarballName = basename(pathToTarball)
  const { name: pkgName, version: pkgVersion } = await extractPkgNameAndVersion(pathToTarball, globalConfig)
  const pkgDirPath = resolve(globalConfig.storeDir, pkgName.replace('/', '+'), `v${pkgVersion}`)
  const destPath = resolve(pkgDirPath, tarballName)
  const logger = createLogger()

  // TODO: support relative paths from process.cwd()
  // TODO: add validation for tarball filename - should be of the form "<name>-<version>.tgz"

  if (!existsSync(pkgDirPath)) await mkdir(pkgDirPath, { recursive: true })

  if (existsSync(destPath)) {
    // TODO: prompt for overwriting if it already exists
    logger.warn(`"${tarballName}" already exists in store. Overwriting the existing tarball`)
  }
  await copyFile(pathToTarball, destPath)
  logger.success(`"${tarballName}" added to store`)
}

async function extractPkgNameAndVersion(
  pathToTarball: string,
  globalConfig: Readonly<LikiConfigType>
): Promise<{
  name: string
  version: string
}> {
  /** A dir to store temporary files. */
  const tempDir = resolve(globalConfig.storeDir, '__temp__')

  if (!existsSync(tempDir)) await mkdir(tempDir)

  await extract({ file: pathToTarball, cwd: tempDir }, ['package/package.json'])
  const pkgJson = await readJsonFile(resolve(tempDir, 'package', 'package.json'))
  await rm(resolve(tempDir, 'package'), { recursive: true })

  return {
    name: pkgJson.name,
    version: pkgJson.version,
  }
}
