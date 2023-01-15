import { homedir } from 'node:os'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'

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
    await writeFile(lnpmGlobalConfigPath, getDefaultConfig())
  } else {
    // TODO: prompt for overwriting existing file with default one
    console.log('A config file already exists.')
    process.exit(1)
  }
}
function getDefaultConfig() {
  const lnpmStoreDirPath = resolve(homedir(), 'AppData', 'Local', 'lnpm', 'store')

  const defaultConfig: LnpmConfigType = {
    'pkg-manager': 'npm',
    'store-dir': lnpmStoreDirPath,
  }

  return JSON.stringify(defaultConfig)
}
