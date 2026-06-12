import { ParserPlugin, ParserContext, PluginStage } from '@music-lyric-kit/core'
import { LineType } from '@music-lyric-kit/lyric'

import { removeBrackets } from './core'

export class Clean extends ParserPlugin {
  override get id() {
    return 'TRANSFORM-BACKGROUND-CLEAN'
  }

  override get stage() {
    return PluginStage.Post
  }

  override check(ctx: ParserContext) {
    return true
  }

  override exec(ctx: ParserContext) {
    const lines = ctx.result.lines
    if (!lines.length) {
      return
    }

    for (const line of lines) {
      if (line.type !== LineType.Normal) {
        continue
      }

      if (!line.background?.length) {
        continue
      }

      for (const item of line.background) {
        removeBrackets(item)
      }
    }

    ctx.result.lines = lines
  }
}
