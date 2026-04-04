import { Info, LineType, WordType, Line, LineNormal, WordNormal } from '@music-lyric-kit/lyric'

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

  /**
   * Sort all lines and their background lines by start time in ascending order.
   */
  sort() {
    const lines = this.result?.lines
    if (!lines?.length) {
      return
    }

    const compare = (a: Line, b: Line) => a.time.start - b.time.start
    lines.sort(compare)

    for (let i = 0, len = lines.length; i < len; i++) {
      const line = lines[i]
      if (line.type !== LineType.Normal || !line.background?.length) {
        continue
      }
      line.background.sort(compare)
    }
  }

  /**
   * Sync each line's start/end time to match the time range of its first and last normal word.
   */
  syncLineTimeWithWord(lines?: Line[]) {
    const result = this.result
    for (const line of lines || result.lines || []) {
      if (line.type !== LineType.Normal) {
        continue
      }

      if (line.background) {
        this.syncLineTimeWithWord(line.background)
      }

      const words = line.content.words

      let first: WordNormal | null = null
      let last: WordNormal | null = null
      for (let i = 0, len = words.length; i < len; i++) {
        const word = words[i]
        if (word.type !== WordType.Normal) {
          continue
        }
        if (!first) {
          first = word
        }
        last = word
      }

      if (!first || !last) {
        continue
      }

      const startTime = first.time?.start || 0
      const endTime = last.time?.end || 0
      if (startTime <= 0 || endTime <= 0) {
        continue
      }

      line.time.start = startTime
      line.time.end = endTime
    }
  }

  /**
   * Extend each line end time to cover the end time of its last background line, ensuring the line duration fully encompasses all background content.
   */
  syncLineTimeWithBackground() {
    for (const line of this.result.lines) {
      if (line.type !== LineType.Normal) {
        continue
      }

      if (!line.background?.length) {
        continue
      }

      const last = line.background[line.background.length - 1]
      if (!last) {
        continue
      }

      line.time.end = Math.max(line.time.end, last.time.end)
    }
  }

  /**
   * Remove leading and trailing space words from each line's word list.
   */
  cleanWord(lines?: Line[]) {
    const result = this.result
    for (const line of lines || result?.lines || []) {
      if (line.type !== LineType.Normal) {
        continue
      }

      if (line.background) {
        this.cleanWord(line.background)
      }

      const words = line.content.words
      if (!words.length) {
        continue
      }

      while (words.length > 0 && words[words.length - 1].type === WordType.Space) {
        words.pop()
      }

      let startCount = 0
      while (startCount < words.length && words[startCount].type === WordType.Space) {
        startCount++
      }
      if (startCount > 0) {
        words.splice(0, startCount)
      }
    }
  }

  /**
   * Calculate global index, block index for each line's agent, and total line count for each agent.
   */
  calcAgentIndex() {
    const result = this.result
    if (!Array.isArray(result?.lines) || !Array.isArray(result?.agents)) {
      return
    }

    const globalIndex = new Map<string, number>()
    const idIndex = new Map<string, number>()

    let id: string | null = null
    let blockIndex = 0

    for (const line of result.lines) {
      if (line.type !== LineType.Normal || !line.agent) {
        continue
      }

      const current = line.agent.id

      const gi = globalIndex.get(current) ?? 0
      line.agent.index.global = gi
      globalIndex.set(current, gi + 1)

      if (current !== id) {
        blockIndex = 0
        id = current
      }
      line.agent.index.block = blockIndex++

      idIndex.set(current, (idIndex.get(current) ?? 0) + 1)
    }

    for (const agent of result.agents) {
      agent.count = idIndex.get(agent.id) ?? 0
    }
  }
}
