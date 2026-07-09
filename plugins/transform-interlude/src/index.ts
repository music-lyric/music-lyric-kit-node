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

    const newLines: Lyric.Runtime.Proto.Line[] = []

    const firstStart = Lyric.Runtime.getLineTime(lines[0])?.start ?? 0
    if (firstStart > firstThreshold) {
      const start = 500
      const end = firstStart
      if (end > start) {
        newLines.push(Lyric.Runtime.makeLineInterlude({ start, end }))
      }
    }

    for (let i = 0; i < length - 1; i++) {
      const current = lines[i]
      const next = lines[i + 1]

      newLines.push(current)

      const currentEnd = Lyric.Runtime.getLineTime(current)?.end ?? 0
      const nextStart = Lyric.Runtime.getLineTime(next)?.start ?? 0
      const start = currentEnd + 100
      const duration = nextStart - start

      if (duration > normalThreshold) {
        newLines.push(Lyric.Runtime.makeLineInterlude({ start, end: nextStart }))
      }
    }

    newLines.push(lines[length - 1])

    ctx.result.lines = newLines
  }
}

export type { InsertConfig }
