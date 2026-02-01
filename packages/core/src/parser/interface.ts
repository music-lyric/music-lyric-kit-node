import type { Info, Extended, Time } from '@music-lyric-kit/lyric'

import type { BaseContext, BasePlugin as _BasePlugin } from '../plugin'

export interface Params {
  content: any
  musicInfo?: {
    name?: string
    singer?: string[]
  }
}

export interface Context extends BaseContext {
  // input
  params: Params

  // runtime data
  runtime: {
    extendeds: [Time, Extended][]
  }

  // result lyric info
  result: Info | null
}
