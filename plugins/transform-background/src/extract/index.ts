import type { DeepPartial } from '@music-lyric-kit/utils'
import type { Line } from '@music-lyric-kit/lyric'
import type { ExtractConfig } from './config'

import { DEFAULT_CONFIG } from './config'

import { ConfigManager } from '@music-lyric-kit/utils'
import { ParserPlugin, ParserContext, PluginStage } from '@music-lyric-kit/core'
import { LineType } from '@music-lyric-kit/lyric'

import { addBackground, extractCrossLine, extractInLine, isFullLine } from './core'

export class ExtractPlugin extends ParserPlugin {
  override config = new ConfigManager<ExtractConfig, DeepPartial<ExtractConfig>>(DEFAULT_CONFIG)

  override get id() {
    return 'TRANSFORM-BACKGROUND-EXTRACT'
  }

  override get stage() {
    return PluginStage.Transform
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

    const processed = this.config.current.crossLine ? extractCrossLine(lines) : lines
    for (let i = 0; i < processed.length; i++) {
      const line = processed[i]

      if (line.type !== LineType.Normal) {
        result.push(line)
        continue
      }

      if (this.config.current.fullLine && isFullLine(line)) {
        const prev = result.length > 0 ? result[result.length - 1] : null
        if (prev && prev.type === LineType.Normal) {
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
