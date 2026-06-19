import type { DeepPartial } from '@music-lyric-kit/utils'
import type { InferConfig } from './config'

import { DEFAULT_CONFIG } from './config'

import { ConfigManager } from '@music-lyric-kit/utils'
import { ParserPlugin, ParserContext, PluginStage } from '@music-lyric-kit/core'
import { Lyric } from '@music-lyric-kit/lyric'

import { detectScript, detectChineseVariant } from './core'

export class Infer extends ParserPlugin {
  override config = new ConfigManager<InferConfig, DeepPartial<InferConfig>>(DEFAULT_CONFIG)

  override get id() {
    return 'TRANSFORM-LANGUAGE-INFER'
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

    const override = this.config.current.override

    const hanWords: Lyric.WordNormal[] = []
    let hanText = ''

    const handleLine = (line: Lyric.LineNormalBase) => {
      for (const word of line.words) {
        if (word.type !== Lyric.WordType.Normal) {
          continue
        }
        if (word.language && !override) {
          continue
        }

        const script = detectScript(word.content)
        switch (script) {
          case 'kana':
            word.language = Lyric.LanguageType.Japanese
            break
          case 'hangul':
            word.language = Lyric.LanguageType.Korean
            break
          case 'cyrillic':
            word.language = Lyric.LanguageType.Russian
            break
          case 'latin':
            word.language = Lyric.LanguageType.English
            break
          case 'han':
            hanWords.push(word)
            hanText += word.content
            break
        }
      }
    }

    for (const line of lines) {
      if (line.type !== Lyric.LineType.Normal) {
        continue
      }
      handleLine(line)
      for (const background of line.background || []) {
        handleLine(background)
      }
    }

    // simplified vs traditional needs document scope, single words carry too little signal
    const chinese = detectChineseVariant(hanText) ?? Lyric.LanguageType.ChineseSimplified
    for (const word of hanWords) {
      word.language = chinese
    }

    ctx.result.lines = lines
  }
}

export type { InferConfig }
