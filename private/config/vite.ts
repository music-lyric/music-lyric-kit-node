import type { UserConfig } from 'vite'

import { join } from 'node:path'
import { defineConfig, mergeConfig } from 'vite'

import PluginDts from 'vite-plugin-dts'

const root = join(process.cwd())
const src = join(root, 'src')

const external: string[] = []

const formatMap: Record<string, string> = {
  cjs: 'comm',
  es: 'ecma',
}

const common = defineConfig({
  root,
  build: {
    lib: {
      entry: join(src, 'index.ts'),
      formats: ['es', 'cjs'],
      fileName(format, entryName) {
        const target = formatMap[format] || format
        return `index.${target}.js`
      },
    },
    rollupOptions: {
      external(source, importer, isResolved) {
        for (const name of external) {
          if (source.includes(name)) {
            return true
          }
        }
        return false
      },
    },
    outDir: join(root, 'dist'),
    minify: 'esbuild',
    reportCompressedSize: false,
    emptyOutDir: true,
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@root': src,
    },
  },
})

const dts = defineConfig({
  plugins: [
    PluginDts({
      rollupTypes: true,
    }),
  ],
})

interface Params {
  custom?: UserConfig
  withDts?: boolean
  withCommon?: boolean
}

export const buildConfig = ({ custom = {}, withDts = true, withCommon = true }: Params) => {
  let result = defineConfig({})

  if (withCommon) {
    result = mergeConfig(result, common)
  }

  if (withDts) {
    result = mergeConfig(result, dts)
  }

  if (custom) {
    result = mergeConfig(result, custom)
  }

  return result
}
