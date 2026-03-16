import type { DeepPartial } from '@music-lyric-kit/utils'
import type { Line } from '@music-lyric-kit/lyric'
import type { CleanConfig } from './config'

import { DEFAULT_CONFIG } from './config'
import { DEFAULT_RULES } from './constants'

import { ConfigManager } from '@music-lyric-kit/utils'
import { Matcher } from '@root/utils/match'

import { ParserPlugin, ParserStage, ParserContext } from '@music-lyric-kit/core'
import { LineType } from '@music-lyric-kit/lyric'

export class CleanPlugin extends ParserPlugin {
  private matcher: Matcher

  override config = new ConfigManager<CleanConfig, DeepPartial<CleanConfig>>(DEFAULT_CONFIG)

  override get id() {
    return 'TRANSFORM-CLEAN'
  }

  override get name() {
    return 'TRANSFORM-CLEAN'
  }

  override get stage() {
    return ParserStage.Transform
  }

  constructor() {
    super()
    this.matcher = new Matcher(this.config.current, DEFAULT_RULES)
    this.config.on((opt) => {
      this.matcher.update(opt)
    })
  }

  override check(ctx: ParserContext) {
    return true
  }

  override exec(ctx: ParserContext) {
    const lines = ctx.result.lines
    if (!lines.length) {
      return
    }

    const newLines: Line[] = []

    for (const line of lines) {
      if (line.type == LineType.Normal) {
        const result = this.matcher.match(line.content.original)
        if (result) {
          continue
        }
      }
      newLines.push(line)
    }

    ctx.result.lines = newLines
  }
}

export type { CleanConfig }
