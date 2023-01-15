import mri from 'mri'
import { isNullOrUndefined, rDefault } from '~/utils/base'

export default async function store() {
  const args = mri(process.argv.slice(2))
  const cmd = args._[1]

  if (isNullOrUndefined(cmd)) throw new Error('No command provided after "lnpm store".')

  switch (cmd) {
    case 'add':
      return import('./add').then(rDefault)
    case 'remove':
      return import('./remove').then(rDefault)
    default:
      throw new Error(`Invalid command ${cmd}`)
  }
}
