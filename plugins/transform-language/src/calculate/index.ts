import type { DeepPartial } from '@music-lyric-kit/utils'
import type { CalculateConfig } from './config'

import { DEFAULT_CONFIG } from './config'
import { ConfigManager } from '@music-lyric-kit/utils'
import { ParserPlugin, ParserContext, PluginStage } from '@music-lyric-kit/core'
import { Lyric } from '@music-lyric-kit/lyric'

import { isCjkLanguage, countCjkChars, countLatinWords } from '../utils'

export class CalculatePercent extends ParserPlugin {
  override config = new ConfigManager<CalculateConfig, DeepPartial<CalculateConfig>>(DEFAULT_CONFIG)

  override get id() {
    return 'TRANSFORM-LANGUAGE-CALCULATE-PERCENT'
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

    const includeBackground = this.config.current.background

    const counts = new Map<Lyric.LanguageTag, number>()
    let total = 0

    // CJK weighs per character while Latin and Cyrillic weigh per word, so letter-rich scripts do not inflate their share
    const handleLine = (line: Lyric.LineNormalBase) => {
      for (const word of line.words) {
        if (word.type !== Lyric.WordType.Normal || !word.language) {
          continue
        }

        const unit = isCjkLanguage(word.language) ? countCjkChars(word.content) : countLatinWords(word.content)
        if (unit <= 0) {
          continue
        }

        counts.set(word.language, (counts.get(word.language) ?? 0) + unit)
        total += unit
      }
    }

    // background vocals are ad-libs by default, so they stay out of the language share unless opted in
    for (const line of lines) {
      if (line.type !== Lyric.LineType.Normal) {
        continue
      }
      handleLine(line)
      if (includeBackground) {
        for (const background of line.background || []) {
          handleLine(background)
        }
      }
    }

    if (!total) {
      return
    }

    const list: Lyric.LanguageItem[] = []
    for (const [tag, count] of counts) {
      list.push(new Lyric.LanguageItem({ tag, percent: Math.round((count / total) * 10000) / 100 }))
    }
    list.sort((a, b) => b.percent - a.percent)

    ctx.result.language.list = list
  }
}

export type { CalculateConfig }
