import mri from 'mri'
import { homedir } from 'node:os'
import { resolve } from 'node:path'

import { writeJsonFile } from '~/utils/base'
import { getGlobalConfig, type LikiConfigType } from '~/utils/config'

/**
 * ### set &lt;key&gt; &lt;value&gt;
 * Set the config key to the value provided.
 */
export default async function setConfig() {
  const args = mri(process.argv.slice(2))

  const homeLocalDir = resolve(homedir(), 'AppData', 'Local')
  const likiGlobalDir = resolve(homeLocalDir, 'liki')
  const globalConfigPath = resolve(likiGlobalDir, 'liki.config.json')

  const globalConfig = await getGlobalConfig()
  const globalConfigOptions = new Set<keyof LikiConfigType>(['pkgManager', 'storeDir'])

  // args._[0] is `config` and args._[1] is `set`
  const [, , key, value] = args._ // TODO: add validation for new values

  if (globalConfigOptions.has(key as keyof LikiConfigType)) {
    globalConfig[key as keyof LikiConfigType] = value as any
  }
  await writeJsonFile(globalConfigPath, globalConfig)
}
