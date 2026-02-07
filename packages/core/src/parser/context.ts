import { Info, Extended, Time } from '@music-lyric-kit/lyric'

import type { BaseContext, BasePlugin as _BasePlugin } from '../plugin'

export interface Params {
  content: any
  musicInfo?: {
    name?: string
    singer?: string[]
  }
}

export class Context implements BaseContext {
  private readonly current: {
    params: Params
    result: Info
    runtime: {
      extendeds: [Time, Extended][]
    }
  }

  constructor(params: Params) {
    this.current = {
      params,
      result: new Info(),
      runtime: {
        extendeds: [],
      },
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

  // sort lyric lines
  sort() {
    if (!Array.isArray(this.result?.lines)) {
      return
    }
    this.result.lines.sort((a, b) => a.time.start - b.time.start)
  }
}
