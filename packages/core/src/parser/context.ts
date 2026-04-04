import { Info, LineType, WordType, Line } from '@music-lyric-kit/lyric'

import type { BaseContext } from '@root/plugin'

export type ParserResult = Info

export interface ParserParams {
  content: any
  musicInfo?: {
    name?: string
    singer?: string[]
  }
}

export class ParserContext implements BaseContext {
  private readonly current: {
    params: ParserParams
    result: ParserResult
    runtime: Record<string, any>
  }

  constructor(params: ParserParams, init: ParserResult) {
    this.current = {
      params,
      result: init,
      runtime: {},
    }
  }

  get params(): ParserParams {
    return this.current.params
  }

  get result(): ParserResult {
    return this.current.result
  }

  get runtime(): Record<string, any> {
    return this.current.runtime
  }

  handleSort() {
    const result = this.result as any
    if (!Array.isArray(result?.lines)) {
      return
    }
    result.lines.sort((a: any, b: any) => a.time.start - b.time.start)
  }

  handleSyncLineTime(lines?: Line[]) {
    const result = this.result as any
    for (const line of lines || result?.lines || []) {
      if (line.type !== LineType.Normal) {
        continue
      }

      if (line.background) {
        this.handleSyncLineTime(line.background)
      }

      const words = line.content.words.filter((item: any) => item.type === WordType.Normal)
      if (!words.length) {
        continue
      }

      const wordStartTime = words[0]?.time?.start || 0
      const wordEndTime = words[words.length - 1]?.time?.end || 0
      if (wordStartTime <= 0 || wordEndTime <= 0) {
        continue
      }

      line.time.start = wordStartTime
      line.time.end = wordEndTime
    }
  }

  handleCleanWords(lines?: Line[]) {
    const result = this.result as any
    for (const line of lines || result?.lines || []) {
      if (line.type !== LineType.Normal) {
        continue
      }

      if (line.background) {
        this.handleCleanWords(line.background)
      }

      const words = line.content.words
      if (!words.length) {
        continue
      }

      if (words[words.length - 1].type === WordType.Space) {
        words.pop()
      }
      if (words.length > 0 && words[0].type === WordType.Space) {
        words.shift()
      }
    }
  }

  handleCalcAgentIndex() {
    const result = this.result as any
    if (!Array.isArray(result?.lines) || !Array.isArray(result?.agents)) {
      return
    }

    const globalIndex: Record<string, number> = {}
    const idIndex: Record<string, number> = {}

    let id: string | null = null
    let blockIndex = 0

    for (const line of result.lines) {
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

    for (const agent of result.agents) {
      agent.count = idIndex[agent.id] ?? 0
    }
  }
}
