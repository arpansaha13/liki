import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { rm } from 'node:fs/promises'

import mri from 'mri'

import createLogger from '~/logger'
import { getGlobalConfig } from '~/utils/config'
import { isNullOrUndefined } from '~/utils/base'

const logger = createLogger()
/**
 * ## lnpm store remove
 *
 * ### Usage
 *
 * To remove a particular version of a package from store:
 *
 * ```bash
 *  lnpm store remove <pkg-name> --version=<version>
 * ```
 *
 * To remove all versions of a given package from store:
 *
 * ```bash
 *  lnpm store remove <pkg-name> --remove-all
 * ```
 */

export default async function storeRemove() {
  const args = mri(process.argv.slice(2))
  const pkgName = args._[2]

  if (isNullOrUndefined(pkgName)) {
    logger.error('No package name provided')
    process.exit(1)
  }
  const removeAllVersions: boolean | undefined = args['remove-all']
  const pkgVersionToRemove: string | undefined = args.version

  if (isNullOrUndefined(pkgVersionToRemove) && !removeAllVersions) {
    logger.error(
      'No version number provided. Specify a version number with the "--version=<version>" option. If you want to remove all versions of this package then use the "--remove-all" flag.'
    )
    process.exit(1)
  }

  const globalConfig = await getGlobalConfig()
  if (!existsSync(globalConfig.storeDir)) {
    logger.error(`Could not resolve global store path: ${globalConfig.storeDir}`)
    process.exit(1)
  }
  const pkgDirName = pkgName.replace('/', '+')
  const pkgDirPath = resolve(globalConfig.storeDir, pkgDirName)

  if (!existsSync(pkgDirPath)) {
    logger.error(`No such tarball file "${pkgName}" found in global store.`)
    process.exit(1)
  }

  if (removeAllVersions) {
    await rm(pkgDirPath, { recursive: true })
    logger.success(`Package "${pkgName}" has been removed from store`)
  } else {
    await rm(resolve(pkgDirPath, `v${pkgVersionToRemove}`), { recursive: true })
    logger.success(`Version "${pkgVersionToRemove}" of package "${pkgName}" has been removed from store`)
  }
}
