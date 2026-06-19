import { ParserPlugin, ParserContext, PluginStage } from '@music-lyric-kit/core'
import { Lyric } from '@music-lyric-kit/lyric'

export class CalculatePercent extends ParserPlugin {
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

    const counts = new Map<Lyric.LanguageTag, number>()
    let total = 0

    // weight by character count so the share is stable across tokenization granularity
    const handleLine = (line: Lyric.LineNormalBase) => {
      for (const word of line.words) {
        if (word.type !== Lyric.WordType.Normal || !word.language) {
          continue
        }
        const length = word.content.length
        counts.set(word.language, (counts.get(word.language) ?? 0) + length)
        total += length
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

    if (!total) {
      return
    }

    const list: Lyric.LanguageItem[] = []
    for (const [tag, count] of counts) {
      const item = new Lyric.LanguageItem()
      item.tag = tag
      item.percent = Math.round((count / total) * 10000) / 100
      list.push(item)
    }
    list.sort((a, b) => b.percent - a.percent)

    ctx.result.language.list = list
  }
}
