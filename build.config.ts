import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  rollup: {
    inlineDependencies: true,
  },
  entries: ['src/cli'],
  externals: ['node:url', 'node:path', 'node:child_process', 'node:process', 'node:os'],
})
