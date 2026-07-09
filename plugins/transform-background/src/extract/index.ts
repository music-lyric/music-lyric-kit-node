import type { DeepPartial } from '@music-lyric-kit/utils'
import type { ExtractConfig } from './config'

import { DEFAULT_CONFIG } from './config'

import { ConfigManager } from '@music-lyric-kit/utils'
import { ParserPlugin, ParserContext, PluginStage } from '@music-lyric-kit/core'
import { Lyric } from '@music-lyric-kit/lyric'

import { addBackground, assignBackgroundAnnotation, extractCrossLine, extractInLine, isFullLine, toBackground } from './core'

export class Extract extends ParserPlugin {
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

    const result: Lyric.Runtime.Proto.Line[] = []

    const processed = this.config.current.crossLine ? extractCrossLine(lines) : lines
    for (let i = 0; i < processed.length; i++) {
      const line = processed[i]

      if (!Lyric.Runtime.isLineNormal(line)) {
        result.push(line)
        continue
      }

      if (this.config.current.fullLine && isFullLine(line.body.value)) {
        const prev = result.length > 0 ? result[result.length - 1] : null
        if (prev && Lyric.Runtime.isLineNormal(prev)) {
          // @ts-expect-error
          addBackground(prev.body.value, toBackground(line.body.value))
          continue
        }
      }

      if (this.config.current.inLine) {
        extractInLine(line.body.value)
      }

      assignBackgroundAnnotation(line.body.value)

      result.push(line)
    }

    ctx.result.lines = result
  }
}

export type { ExtractConfig }
