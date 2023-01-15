import { rDefault } from '~/utils/base'

export const commands = {
  config: () => import('./config').then(rDefault),
}
