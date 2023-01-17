import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { rm } from 'node:fs/promises'

import mri from 'mri'

import { getGlobalConfig } from '~/utils/config'
import { isNullOrUndefined } from '~/utils/base'

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
    console.error('No package name provided')
    process.exit(1)
  }
  const removeAllVersions: boolean | undefined = args['remove-all']
  const pkgVersionToRemove: string | undefined = args.version

  if (isNullOrUndefined(pkgVersionToRemove) && !removeAllVersions) {
    console.error(
      'No version number provided. Specify a version number with the "--version=<version>" option. If you want to remove all versions of this package then use the "--remove-all" flag.'
    )
    process.exit(1)
  }

  const globalConfig = await getGlobalConfig()
  if (!existsSync(globalConfig.storeDir)) {
    console.error(`Could not resolve global store path: ${globalConfig.storeDir}`)
    process.exit(1)
  }
  const pkgDirName = pkgName.replace('/', '+')
  const pkgDirPath = resolve(globalConfig.storeDir, pkgDirName)

  if (!existsSync(pkgDirPath)) {
    console.error(`No such tarball file "${pkgName}" found in global store.`)
    process.exit(1)
  }

  if (removeAllVersions) {
    await rm(pkgDirPath, { recursive: true })
    console.log(`Package "${pkgName}" has been removed from store`)
  } else {
    await rm(resolve(pkgDirPath, `v${pkgVersionToRemove}`), { recursive: true })
    console.log(`Version "${pkgVersionToRemove}" of package "${pkgName}" has been removed from store`)
  }
}
