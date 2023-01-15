import { homedir } from 'node:os'
import { resolve } from 'node:path'
import { existsSync } from 'node:fs'

import { readJsonFile } from '~/utils/base'

export default async function getConfig() {
  const homeLocalDir = resolve(homedir(), 'AppData', 'Local')
  const lnpmGlobalDir = resolve(homeLocalDir, 'lnpm')
  const globalConfigPath = resolve(lnpmGlobalDir, 'lnpm.config.json')

  if (!existsSync(lnpmGlobalDir) || !existsSync(globalConfigPath)) {
    console.log('No global config found.')
    process.exit()
  }

  const globalConfig = await readJsonFile(globalConfigPath)

  console.log(globalConfig)
}
