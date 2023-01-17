import { homedir } from 'node:os'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'

import { readJsonFile, writeJsonFile } from './base'

export interface LnpmConfigType {
  pkgManager: 'npm' | 'yarn' | 'pnpm'
  storeDir: string
}

/**
 * Returns the global config if it already exists.
 * Else creates a new default global config and returns it.
 */
export async function getGlobalConfig(): Promise<LnpmConfigType> {
  const homeLocalDir = resolve(homedir(), 'AppData', 'Local')
  const lnpmGlobalDir = resolve(homeLocalDir, 'lnpm')
  const globalConfigPath = resolve(lnpmGlobalDir, 'lnpm.config.json')

  if (!existsSync(lnpmGlobalDir)) {
    await mkdir(lnpmGlobalDir)
  }
  if (existsSync(globalConfigPath)) {
    return readJsonFile(globalConfigPath)
  } else {
    const lnpmStorePath = resolve(lnpmGlobalDir, 'store')
    const defaultConfig: LnpmConfigType = {
      pkgManager: 'npm',
      storeDir: lnpmStorePath,
    }
    // Create the default store-dir if it doesn't exist
    if (!existsSync(lnpmStorePath)) await mkdir(lnpmStorePath)

    await writeJsonFile(globalConfigPath, defaultConfig)
    return defaultConfig
  }
}
