import type { DeepRequired } from '@music-lyric-kit/utils'

export interface Options {
  align?: {
    fuzzyThreshold?: number
  }
}

export type OptionsRequired = DeepRequired<Options>

export const DEFAULT_OPTIONS: OptionsRequired = {
  align: {
    fuzzyThreshold: 100,
  },
}
