import { rDefault } from '~/utils/base'

export const commands = {
  store: () => import('./store').then(rDefault),
  config: () => import('./config').then(rDefault),
}
