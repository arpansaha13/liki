import { getGlobalConfig } from '~/utils/config'

export default async function getConfig() {
  const globalConfig = await getGlobalConfig()
  console.log(globalConfig)
}
