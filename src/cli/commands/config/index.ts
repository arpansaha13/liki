import mri from 'mri'
import { isNullOrUndefined, rDefault } from '~/utils/base'

export default async function store() {
  const args = mri(process.argv.slice(2))
  const cmd = args._[1]

  if (isNullOrUndefined(cmd)) throw new Error('No command provided after "liki config".')

  switch (cmd) {
    case 'get':
      return import('./get').then(rDefault)
    case 'set':
      return import('./set').then(rDefault)
    default:
      throw new Error(`Invalid command ${cmd}`)
  }
}
