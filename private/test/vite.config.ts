import { join } from 'node:path'

import { buildConfig } from '../config/vite'

const src = join(process.cwd(), 'src')

export default buildConfig({
  custom: {
    root: src,
    build: {
      minify: false,
      reportCompressedSize: false,
    },
    server: {
      port: 9090,
      strictPort: false,
    },
  },
  withDts: false,
})
