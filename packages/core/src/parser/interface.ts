import type { Info } from '@music-lyric-kit/lyric'

import type { BaseContext, BasePlugin } from '../plugin'

export interface Params {
  content: any
  musicInfo?: {
    name?: string
    singer?: string[]
  }
}

export interface Context extends BaseContext {
  params: Params
  result: Info | null
}

export type Plugin = BasePlugin<Context>
