import type { DeepPartial } from '@music-lyric-kit/utils'
import type { MarkConfig } from './config'

import { DEFAULT_CONFIG } from './config'
import { ConfigManager } from '@music-lyric-kit/utils'

import { ParserPlugin, ParserStage, ParserContext } from '@music-lyric-kit/core'
import { LineNormal, LineType, WordType } from '@music-lyric-kit/lyric'

export class MarkPlugin extends ParserPlugin {
  override config = new ConfigManager<MarkConfig, DeepPartial<MarkConfig>>(DEFAULT_CONFIG)

  override get id() {
    return 'TRANSFORM-STRESS-MARK'
  }

  override get name() {
    return 'TRANSFORM-STRESS-MARK'
  }

  override get stage() {
    return ParserStage.Transform
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

    const handleMark = (line: LineNormal) => {
      for (const word of line.content.words) {
        if (word.type !== WordType.Normal) {
          continue
        }
        if (word.time.duration > this.config.current.checkTime) {
          word.config.stress = true
        }
      }
    }

    for (const line of lines) {
      if (line.type !== LineType.Normal) {
        continue
      }

      handleMark(line)
      for (const background of line.background || []) {
        handleMark(background)
      }
    }

    ctx.result.lines = lines
  }
}

export type { MarkConfig }
