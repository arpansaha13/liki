import mri from 'mri'
import { homedir } from 'node:os'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'

import { readJsonFile } from '~/utils/base'
import { createDefaultConfig, type LnpmConfigType } from '~/utils/config'

export default async function setConfig() {
  const args = mri(process.argv.slice(2))

  const homeLocalDir = resolve(homedir(), 'AppData', 'Local')
  const lnpmGlobalDir = resolve(homeLocalDir, 'lnpm')
  const globalConfigPath = resolve(lnpmGlobalDir, 'lnpm.config.json')

  if (!existsSync(lnpmGlobalDir) || !existsSync(globalConfigPath)) {
    await createDefaultConfig()
  }
  const partialGlobalConfig: Partial<LnpmConfigType> = {}
  const globalConfigOptions = new Set<keyof LnpmConfigType>(['pkg-manager', 'store-dir'])

  for (const option of Object.keys(args)) {
    if (globalConfigOptions.has(option as keyof LnpmConfigType))
      partialGlobalConfig[option as keyof LnpmConfigType] = args[option]
  }
  updateGlobalConfig(globalConfigPath, partialGlobalConfig)
}

export async function updateGlobalConfig(globalConfigPath: string, partialGlobalConfig: Partial<LnpmConfigType>) {
  // TODO: add validation for new values
  const globalConfig: LnpmConfigType = await readJsonFile(globalConfigPath)
  const newGlobalConfig = { ...globalConfig, ...partialGlobalConfig }
  await writeFile(globalConfigPath, JSON.stringify(newGlobalConfig))
}
