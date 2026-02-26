import type { DeepRequired } from '@music-lyric-kit/utils'

import type { AlignPluginConfig } from './built'

export interface Options {
  align?: AlignPluginConfig
}

export type OptionsRequired = DeepRequired<Options>

export const DEFAULT_OPTIONS: OptionsRequired = {
  align: {
    fuzzyThreshold: 0,
  },
}
