import type { DeepPartial } from '@music-lyric-kit/utils'
import type { InsertConfig } from './config'

import { DEFAULT_CONFIG } from './config'
import { ConfigManager } from '@music-lyric-kit/utils'

import { ParserPlugin, ParserContext, PluginStage } from '@music-lyric-kit/core'
import { Lyric } from '@music-lyric-kit/lyric'

export class Insert extends ParserPlugin {
  override config = new ConfigManager<InsertConfig, DeepPartial<InsertConfig>>(DEFAULT_CONFIG)

  override get priority() {
    return 500
  }

  override get id() {
    return 'TRANSFORM-INTERLUDE-INSERT'
  }

  override get stage() {
    return PluginStage.Transform
  }

  override check(ctx: ParserContext) {
    return true
  }

  override exec(ctx: ParserContext) {
    const lines = ctx.result.lines
    const length = lines.length

    if (!length) {
      return
    }

    const { first: firstThreshold, normal: normalThreshold } = this.config.current.checkTime

    const newLines: Lyric.Line[] = []

    const firstLine = lines[0]
    if (firstLine.time.start > firstThreshold) {
      const start = 500
      const end = firstLine.time.start
      if (end > start) {
        newLines.push(new Lyric.LineInterlude({ time: new Lyric.Time(start, end) }))
      }
    }

    for (let i = 0; i < length - 1; i++) {
      const current = lines[i]
      const next = lines[i + 1]

      newLines.push(current)

      const start = current.time.end + 100
      const duration = next.time.start - start

      if (duration > normalThreshold) {
        newLines.push(new Lyric.LineInterlude({ time: new Lyric.Time(start, next.time.start) }))
      }
    }

    newLines.push(lines[length - 1])

    ctx.result.lines = newLines
  }
}

export type { InsertConfig }
