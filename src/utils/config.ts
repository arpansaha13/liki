import { homedir } from 'node:os'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'

import { readJsonFile, writeJsonFile } from './base'

export interface LikiConfigType {
  pkgManager: 'npm' | 'yarn' | 'pnpm'
  storeDir: string
}

/**
 * Returns the global config if it already exists.
 * Else creates a new default global config and returns it.
 */
export async function getGlobalConfig(): Promise<LikiConfigType> {
  const homeLocalDir = resolve(homedir(), 'AppData', 'Local')
  const likiGlobalDir = resolve(homeLocalDir, 'liki')
  const globalConfigPath = resolve(likiGlobalDir, 'liki.config.json')

  if (!existsSync(likiGlobalDir)) {
    await mkdir(likiGlobalDir)
  }
  if (existsSync(globalConfigPath)) {
    return readJsonFile(globalConfigPath)
  } else {
    const likiStorePath = resolve(likiGlobalDir, 'store')
    const defaultConfig: LikiConfigType = {
      pkgManager: 'npm',
      storeDir: likiStorePath,
    }
    // Create the default store-dir if it doesn't exist
    if (!existsSync(likiStorePath)) await mkdir(likiStorePath)

    await writeJsonFile(globalConfigPath, defaultConfig)
    return defaultConfig
  }
}
