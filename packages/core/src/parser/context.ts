import { Lyric } from '@music-lyric-kit/lyric'

import type { BaseContext } from '@root/plugin'

export type ParserResult = Lyric.Runtime.Proto.Info

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
    Lyric.Runtime.sortLinesByTime(this.result)
  }

  /**
   * Sync each line's start/end time to match the time range of its first and last normal word.
   */
  syncLineTimeWithWord() {
    for (const line of this.result.lines) {
      if (!Lyric.Runtime.isLineNormal(line)) {
        continue
      }
      const body = line.body.value
      this.syncTimeWithWord(line, body.content?.words ?? [])
      for (const background of body.backgrounds) {
        this.syncTimeWithWord(background, background.content?.words ?? [])
      }
    }
  }

  /**
   * Sync a time holder's range to the first and last normal word of the given words.
   */
  private syncTimeWithWord(holder: { time?: Lyric.Common.Proto.Time }, words: Lyric.Runtime.Proto.Word[]) {
    let first: Lyric.Runtime.Proto.WordNormal | null = null
    let last: Lyric.Runtime.Proto.WordNormal | null = null
    for (let i = 0, len = words.length; i < len; i++) {
      const word = words[i]
      if (!Lyric.Runtime.isWordNormal(word)) {
        continue
      }
      if (!first) {
        first = word.body.value
      }
      last = word.body.value
    }

    if (!first || !last) {
      return
    }

    const startTime = first.time?.start || 0
    const endTime = last.time?.end || 0
    if (startTime <= 0 || endTime <= 0) {
      return
    }

    if (holder.time) {
      holder.time.start = startTime
      holder.time.end = endTime
    } else {
      holder.time = Lyric.Common.makeTime({ start: startTime, end: endTime })
    }
  }

  /**
   * Extend each line end time to cover the end time of its last background line, ensuring the line duration fully encompasses all background content.
   */
  syncLineTimeWithBackground() {
    for (const line of this.result.lines) {
      if (!Lyric.Runtime.isLineNormal(line)) {
        continue
      }
      const body = line.body.value
      if (!body.backgrounds.length || !line.time) {
        continue
      }

      const last = body.backgrounds[body.backgrounds.length - 1]
      if (!last?.time) {
        continue
      }

      line.time.end = Math.max(line.time.end, last.time.end)
    }
  }

  /**
   * Remove leading and trailing space words from each line's word list.
   */
  cleanWord() {
    for (const line of this.result.lines) {
      if (!Lyric.Runtime.isLineNormal(line)) {
        continue
      }
      const body = line.body.value
      this.cleanContentWord(body.content)
      for (const background of body.backgrounds) {
        this.cleanContentWord(background.content)
      }
    }
  }

  /**
   * Trim leading and trailing space words of one line content.
   */
  private cleanContentWord(content: Lyric.Runtime.Proto.LineContent | undefined) {
    if (!content) {
      return
    }
    const words = content.words
    if (!words.length) {
      return
    }

    while (words.length > 0 && Lyric.Runtime.isWordSpace(words[words.length - 1])) {
      words.pop()
    }

    let startCount = 0
    while (startCount < words.length && Lyric.Runtime.isWordSpace(words[startCount])) {
      startCount++
    }
    if (startCount > 0) {
      words.splice(0, startCount)
    }
  }

  /**
   * Build line annotations from words for every line and its background lines.
   */
  finalizeAnnotation() {
    for (const line of this.result.lines) {
      if (!Lyric.Runtime.isLineNormal(line)) {
        continue
      }
      const body = line.body.value
      Lyric.refreshLineAnnotation(body)
      for (const background of body.backgrounds) {
        Lyric.refreshLineAnnotation(background)
      }
    }
  }
}
