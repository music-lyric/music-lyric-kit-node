import type { DeepPartial } from '@music-lyric-kit/utils'
import type { MarkConfig } from './config'

import { DEFAULT_CONFIG } from './config'
import { ConfigManager } from '@music-lyric-kit/utils'

import { ParserPlugin, ParserContext, PluginStage } from '@music-lyric-kit/core'
import { Lyric } from '@music-lyric-kit/lyric'

export class Mark extends ParserPlugin {
  override config = new ConfigManager<MarkConfig, DeepPartial<MarkConfig>>(DEFAULT_CONFIG)

  override get id() {
    return 'TRANSFORM-STRESS-MARK'
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

    const handleMark = (line: Lyric.Runtime.LineNormal | Lyric.Runtime.LineBackground) => {
      for (const word of line.content?.words || []) {
        if (!Lyric.Runtime.isWordNormal(word)) {
          continue
        }
        const value = word.body.value
        if (value.time && Lyric.Common.getTimeDuration(value.time) > this.config.current.checkTime) {
          value.stress = true
        }
      }
    }

    for (const line of lines) {
      if (!Lyric.Runtime.isLineNormal(line)) {
        continue
      }

      const body = line.body.value
      handleMark(body)
      for (const background of body.backgrounds) {
        handleMark(background)
      }
    }

    ctx.result.lines = lines
  }
}

export type { MarkConfig }
