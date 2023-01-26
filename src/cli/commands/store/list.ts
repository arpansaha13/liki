import { readdir } from 'node:fs/promises'
import { resolve } from 'node:path'

import type SemVer from 'semver/classes/semver'
import semverCoerce from 'semver/functions/coerce'

import createLogger from '~/logger'
import { isNullOrUndefined } from '~/utils/base'
import { getGlobalConfig, type LikiConfigType } from '~/utils/config'

let globalConfig: LikiConfigType = null!
const logger = createLogger()

/** Returns the path to the global store. */
export default async function storeList() {
  globalConfig = await getGlobalConfig()
  const dirents = await readdir(globalConfig.storeDir, { withFileTypes: true })

  const pkgDirs = dirents.filter(dirent => dirent.isDirectory())

  if (pkgDirs.length == 0) {
    logger.info('No packages found in store.')
    return
  }

  for (const pkgDir of pkgDirs) {
    const pkgDirName = pkgDir.name
    const versions = await getVersions(pkgDirName)
    for (const version of versions) {
      logger.info(`${pkgDirName.replace('+', '/')}@${version}`)
    }
  }
}

async function getVersions(pkgDirName: string): Promise<SemVer[]> {
  const sourcePath = resolve(globalConfig.storeDir, pkgDirName)
  const dirents = await readdir(sourcePath, { withFileTypes: true })

  const versions = dirents
    .filter(dirent => dirent.isDirectory())
    .map(dirent => {
      const version = semverCoerce(dirent.name)
      if (version === null) logger.warn(`Internal Error: Invalid version directory name "${dirent.name}"`)
      return version
    })
    .filter(v => !isNullOrUndefined(v)) as SemVer[]

  return versions
}
