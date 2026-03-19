import type { DeepPartial } from '@music-lyric-kit/utils'
import type { Line } from '@music-lyric-kit/lyric'
import type { ExtractConfig } from './config'

import { DEFAULT_CONFIG } from './config'

import { ConfigManager } from '@music-lyric-kit/utils'

import { ParserPlugin, ParserStage, ParserContext } from '@music-lyric-kit/core'
import { LineType } from '@music-lyric-kit/lyric'

import { addBackground, extractInLine, isFullLine, removeBrackets } from './core'

export class ExtractPlugin extends ParserPlugin {
  override config = new ConfigManager<ExtractConfig, DeepPartial<ExtractConfig>>(DEFAULT_CONFIG)

  override get id() {
    return 'TRANSFORM-BACKGROUND-EXTRACT'
  }

  override get name() {
    return 'TRANSFORM-BACKGROUND-EXTRACT'
  }

  override get stage() {
    return ParserStage.Transform
  }

  override check(ctx: ParserContext) {
    return true
  }

  override exec(ctx: ParserContext) {
    const lines = ctx.result.lines
    if (!lines.length) {
      return
    }

    const result: Line[] = []
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      if (line.type !== LineType.Normal) {
        result.push(line)
        continue
      }

      if (this.config.current.fullLine && isFullLine(line)) {
        const prev = result.length > 0 ? result[result.length - 1] : null
        if (prev && prev.type === LineType.Normal) {
          if (this.config.current.removeBrackets) {
            removeBrackets(line)
          }
          addBackground(prev, line)
          continue
        }
      }

      if (this.config.current.inLine) {
        extractInLine(line)
      }

      result.push(line)
    }

    ctx.result.lines = result
  }
}

export type { ExtractConfig }
