import { ParserContext, ParserPlugin, PluginStage } from '@music-lyric-kit/core'
import { Lyric } from '@music-lyric-kit/lyric'

import { alignNumberArray } from '@music-lyric-kit/utils'
import { matchLyric } from './utils'
import { processLines, checkIsSyllable } from './line'
import { processMetas } from './meta'

const CHECK_REGEXP = /\[(?:\d+:)?(?:\d+:)?\d+\.\d+\]/

export interface ParserInput {
  original: string
  translate?: string
  roman?: string
}

export type ParserInputFull = string | ParserInput

export class Parser extends ParserPlugin {
  override get id() {
    return 'LRC-PARSER'
  }

  override get stage() {
    return PluginStage.Process
  }

  override get format() {
    return 'lrc'
  }

  private processInput(input: any) {
    const content = input as ParserInputFull

    const result: ParserInput | null =
      typeof content === 'string'
        ? {
            original: content,
          }
        : typeof content === 'object'
          ? content
          : null

    return result
  }

  private processExtended(lines: Lyric.Line[], inputTranslate: string, inputRoman: string) {
    const lineMap: Map<number, Lyric.LineNormal> = new Map()
    const translateMap: Map<number, Lyric.LineAnnotationTranslate[]> = new Map()
    const romanMap: Map<number, Lyric.LineAnnotationRoman[]> = new Map()

    for (const line of lines) {
      if (!Lyric.isLineNormal(line) || !line.time) {
        continue
      }
      lineMap.set(line.time.start, line.body.value)
    }

    const translate = processLines(matchLyric(inputTranslate).line, true)
    for (const item of translate) {
      if (!Lyric.isLineNormal(item) || !item.time) {
        continue
      }
      const current = translateMap.get(item.time.start) || []
      current.push(Lyric.makeLineAnnotationTranslate({ content: Lyric.getLineText(item) }))
      translateMap.set(item.time.start, current)
    }

    const roman = processLines(matchLyric(inputRoman).line, true) || []
    for (const item of roman) {
      if (!Lyric.isLineNormal(item) || !item.time) {
        continue
      }
      const current = romanMap.get(item.time.start) || []
      current.push(Lyric.makeLineAnnotationRoman({ content: Lyric.getLineText(item) }))
      romanMap.set(item.time.start, current)
    }

    const targets = [...new Set([...translateMap.keys(), ...romanMap.keys()])]
    const result = alignNumberArray([...lineMap.keys()], targets)
    for (const item of result) {
      const line = lineMap.get(item.base)
      if (!line) {
        continue
      }

      const translates: Lyric.LineAnnotationTranslate[] = []
      const romans: Lyric.LineAnnotationRoman[] = []
      for (const target of item.targets) {
        translates.push(...(translateMap.get(target.value) || []))
        romans.push(...(romanMap.get(target.value) || []))
      }

      if (!translates.length && !romans.length) {
        continue
      }

      const content = line.content ?? (line.content = Lyric.makeLineContent())
      const annotation = content.annotation ?? (content.annotation = Lyric.makeLineAnnotation())
      annotation.translates.push(...translates)
      annotation.romans.push(...romans)
    }
  }

  override check(ctx: ParserContext) {
    const input = this.processInput(ctx.params.content)

    if (!input?.original) {
      return false
    }

    return CHECK_REGEXP.test(input.original)
  }

  override exec(ctx: ParserContext) {
    const input = this.processInput(ctx.params.content)
    if (!input) {
      return
    }

    const match = matchLyric(input.original)
    if (!match.line.length) {
      return
    }

    const lines = processLines(match.line)
    if (!lines.length) {
      ctx.result.type = Lyric.InfoType.VALID
      return
    }

    this.processExtended(lines, input.translate || '', input.roman || '')

    ctx.result.lines = lines
    ctx.result.type = Lyric.InfoType.VALID
    if (checkIsSyllable(match.line)) {
      ctx.result.timing = Lyric.InfoTiming.WORD
    } else {
      ctx.result.timing = Lyric.InfoTiming.LINE
    }

    ctx.result.meta = processMetas(match.meta)
  }
}
