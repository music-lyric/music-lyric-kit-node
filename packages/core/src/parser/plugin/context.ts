import { Info, LineType, WordType, Line } from '@music-lyric-kit/lyric'

import type { BaseContext, BasePlugin as _BasePlugin } from '@root/plugin'

export interface ParserParams {
  content: any
  musicInfo?: {
    name?: string
    singer?: string[]
  }
}

export interface ParserRuntime {}

export class ParserContext implements BaseContext {
  private readonly current: {
    result: Info
    params: ParserParams
    runtime: ParserRuntime
  }

  constructor(params: ParserParams) {
    this.current = {
      result: new Info(),
      params,
      runtime: {},
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

  handleSort() {
    if (!Array.isArray(this.result?.lines)) {
      return
    }
    this.result.lines.sort((a, b) => a.time.start - b.time.start)
  }

  handleSyncLineTime(lines?: Line[]) {
    for (const line of lines || this.result.lines || []) {
      if (line.type !== LineType.Normal) {
        continue
      }

      if (line.background) {
        this.handleSyncLineTime(line.background)
      }

      const words = line.content.words.filter((item) => item.type === WordType.Normal)
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
    for (const line of lines || this.result.lines || []) {
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
