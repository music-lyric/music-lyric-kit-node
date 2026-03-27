import type { DeepPartial } from '@music-lyric-kit/utils'
import type { Line } from '@music-lyric-kit/lyric'
import type { CleanConfig } from './config'

import { DEFAULT_CONFIG } from './config'
import { DEFAULT_RULES } from './constants'

import { ConfigManager } from '@music-lyric-kit/utils'
import { Matcher } from '@root/utils/match'

import { ParserPlugin, ParserStage, ParserContext } from '@music-lyric-kit/core'
import { LineType } from '@music-lyric-kit/lyric'

import { cleanText } from './utils'

export class CleanPlugin extends ParserPlugin {
  private matcher: Matcher

  override config = new ConfigManager<CleanConfig, DeepPartial<CleanConfig>>(DEFAULT_CONFIG)

  override get priority() {
    return 50
  }

  override get id() {
    return 'TRANSFORM-PURE-CLEAN'
  }

  override get name() {
    return 'TRANSFORM-PURE-CLEAN'
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
    const linesLength = lines.length
    if (!linesLength) {
      return
    }

    const newLines: Line[] = []

    for (let i = 0; i < linesLength; i++) {
      const line = lines[i]
      if (line.type !== LineType.Normal) {
        newLines.push(line)
        continue
      }

      const musicInfo = ctx.params.musicInfo
      const extra = []

      if (i === 0 && musicInfo && this.config.current.firstLineWithMusicInfo) {
        const name = cleanText(musicInfo.name || '')
        if (name) {
          extra.push(name)
        }
        const singer = musicInfo.singer?.map((item) => cleanText(item))
        if (singer) {
          extra.push(...singer)
        }
      }

      const clean = extra.length ? cleanText(line.content.original) : line.content.original
      const result = this.matcher.match(clean, extra)
      if (!result) {
        newLines.push(line)
      }
    }

    ctx.result.lines = newLines
  }
}

export type { CleanConfig }
