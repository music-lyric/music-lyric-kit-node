import type { UserConfig } from 'vite'

import { join } from 'node:path'

import PluginDts from 'vite-plugin-dts'

import { buildConfig } from '../../private/config/vite'

// lyric re-exports the whole `music-lyric-model` surface via `export *`.
// The api-extractor dts rollup cannot expand an external `export *` into the
// `export * as Lyric` namespace, so emit unbundled declarations with tsc instead.
const custom: UserConfig = {
  plugins: [PluginDts({ rollupTypes: false, include: ['src'], entryRoot: join(process.cwd(), 'src') })],
}

export default buildConfig({ withDts: false, custom })
