import { Info, Extended, Time, LineType } from '@music-lyric-kit/lyric'

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

  handleSort() {
    if (!Array.isArray(this.result?.lines)) {
      return
    }
    this.result.lines.sort((a, b) => a.time.start - b.time.start)
  }

  handleCalcAgentIndex() {
    const globalIndex: Record<string, number> = {}
    const idIndex: Record<string, number> = {}

    let id: string | null = null
    let blockIndex = 0

    for (const line of this.result.lines) {
      if (line.type !== LineType.Normal || !line.agent) {
        continue
      }

      const current = line.agent.id

      if (!globalIndex[current]) {
        globalIndex[current] = 0
      }
      line.agent.index.global = globalIndex[current]++

      if (current !== id) {
        blockIndex = 0
        id = current
      }
      line.agent.index.block = blockIndex++

      if (!idIndex[current]) {
        idIndex[current] = 0
      }
      idIndex[current]++
    }

    for (const agent of this.result.agents) {
      agent.count = idIndex[agent.id] ?? 0
    }
  }
}
