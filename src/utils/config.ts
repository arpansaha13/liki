import { homedir } from 'node:os'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'

import { readJsonFile, writeJsonFile } from './base'

export interface LnpmConfigType {
  'pkg-manager': 'npm' | 'yarn' | 'pnpm'
  'store-dir': string
}

export async function createDefaultConfig() {
  const homeLocalDirPath = resolve(homedir(), 'AppData', 'Local')
  const lnpmGlobalDirPath = resolve(homeLocalDirPath, 'lnpm')
  const lnpmGlobalConfigPath = resolve(lnpmGlobalDirPath, 'lnpm.config.json')

  if (!existsSync(lnpmGlobalDirPath)) {
    await mkdir(lnpmGlobalDirPath)
  }
  if (!existsSync(lnpmGlobalConfigPath)) {
    const lnpmStorePath = resolve(lnpmGlobalDirPath, 'store')
    const defaultConfig: LnpmConfigType = {
      'pkg-manager': 'npm',
      'store-dir': lnpmStorePath,
    }
    await writeJsonFile(lnpmGlobalConfigPath, defaultConfig)
  } else {
    // TODO: prompt for overwriting existing file with default one
    console.log('A config file already exists.')
    process.exit(1)
  }
}
export async function getGlobalConfig(): Promise<LnpmConfigType> {
  const homeLocalDir = resolve(homedir(), 'AppData', 'Local')
  const lnpmGlobalDir = resolve(homeLocalDir, 'lnpm')
  const globalConfigPath = resolve(lnpmGlobalDir, 'lnpm.config.json')

  if (!existsSync(lnpmGlobalDir) || !existsSync(globalConfigPath)) {
    console.log('No global config found.')
    process.exit()
  }
  return readJsonFile(globalConfigPath)
}
