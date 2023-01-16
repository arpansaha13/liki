import mri from 'mri'
import { commands } from './commands/index'

export default function main() {
  const args = mri(process.argv.slice(2))
  const cmd = args._[0]

  switch (cmd) {
    case 'store':
      return commands.store()
    case 'config':
      return commands.config()
    case 'i':
    case 'add':
    case 'install':
      return commands.install()
    default:
      throw new Error(`Invalid command ${cmd}`)
  }
}
