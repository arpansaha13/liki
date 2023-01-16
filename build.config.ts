import { resolve } from 'node:path'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  rollup: {
    inlineDependencies: true,
  },
  alias: {
    '~': resolve(process.cwd(), 'src'),
  },
  entries: ['src/cli'],
  externals: ['node:url', 'node:path', 'node:fs', 'node:fs/promises', 'node:child_process', 'node:process', 'node:os'],
})
