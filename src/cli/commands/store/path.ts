import { getGlobalConfig } from '~/utils/config'

/** Returns the path to the global store. */
export default async function storePath() {
  const globalConfig = await getGlobalConfig()
  console.log(globalConfig.storeDir)
}
