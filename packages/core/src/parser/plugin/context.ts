import { Info, Extended, Time } from '@music-lyric-kit/lyric'

import type { BaseContext, BasePlugin as _BasePlugin } from '@root/plugin'

export interface ParserParams {
  content: any
  musicInfo?: {
    name?: string
    singer?: string[]
  }
}

export interface ParserRuntime {
  extendeds: [Time, Extended][]
}

export class ParserContext implements BaseContext {
  private readonly current: {
    params: ParserParams
    result: Info
    runtime: ParserRuntime
    needAlignExtended: boolean
  }

  constructor(params: ParserParams) {
    this.current = {
      params,
      result: new Info(),
      runtime: {
        extendeds: [],
      },
      needAlignExtended: false,
    }
  }

  get params() {
    return this.current.params
  }

  get result() {
    return this.current.result
  }

  get runtime() {
    return this.current.runtime
  }

  get needAlignExtended() {
    return this.current.needAlignExtended
  }

  set needAlignExtended(need: boolean) {
    this.current.needAlignExtended = need
  }

  // sort lyric lines
  sort() {
    if (!Array.isArray(this.result?.lines)) {
      return
    }
    this.result.lines.sort((a, b) => a.time.start - b.time.start)
  }
}
