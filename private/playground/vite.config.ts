import type { Plugin } from 'vite'

import { join } from 'node:path'
import { readFileSync } from 'node:fs'

import VuePlugin from '@vitejs/plugin-vue'
import PathPlugin from 'vite-tsconfig-paths'

import { buildConfig } from '../config/vite'

const cwd = process.cwd()
const src = join(cwd, 'src')
const root = join(cwd, '..', '..')

const rootPkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf-8')) as { version: string }

// Rewrite the playground's own `@root/` imports, including .vue virtual modules that vite-tsconfig-paths skips.
const RootAlias = (): Plugin => {
  const playgroundSrc = src.replace(/\\/g, '/')
  return {
    name: 'playground-root-alias',
    enforce: 'pre',
    async resolveId(source, importer, options) {
      if (!source.startsWith('@root/') || !importer) return null
      const normalized = importer.replace(/\\/g, '/')
      if (!normalized.startsWith(playgroundSrc + '/')) return null
      const rewritten = join(src, source.slice('@root/'.length))
      const result = await this.resolve(rewritten, importer, { ...options, skipSelf: true })
      return result?.id ?? null
    },
  }
}

export default buildConfig({
  withCommon: false,
  withDts: false,
  custom: {
    root: src,
    base: './',
    plugins: [VuePlugin(), RootAlias(), PathPlugin({ root })],
    resolve: {
      conditions: ['dev'],
    },
    define: {
      __APP_VERSION__: JSON.stringify(rootPkg.version),
    },
    build: {
      outDir: join(cwd, 'dist'),
      target: 'esnext',
      emptyOutDir: true,
      minify: false,
      reportCompressedSize: false,
      sourcemap: true,
    },
    server: {
      port: 9090,
      strictPort: false,
    },
  },
})
