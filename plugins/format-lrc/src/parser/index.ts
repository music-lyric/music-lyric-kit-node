import type { ParserContentType, ParserContentObject } from './interface'

import { ParserPlugin, ParserStage, ParserContext } from '@music-lyric-kit/core'
import { Extended, ExtendedType, LineNormal, Type } from '@music-lyric-kit/lyric'

import { alignNumberArray } from '@music-lyric-kit/utils'
import { matchLyric } from './utils'
import { processLines, checkIsSyllable } from './line'
import { processMetas } from './meta'

const CHECK_REGEXP = /\[(?:\d{1,3}:)?(?:\d{1,2}:)?\d{1,2}\.\d{3}\]/

export class Parser extends ParserPlugin {
  override get id() {
    return 'LRC-PARSER'
  }

  override get name() {
    return 'LRC-PARSER'
  }

  override get stage() {
    return ParserStage.Parse
  }

  override get format() {
    return 'lrc'
  }

  private processInput(input: any) {
    const content = input as ParserContentType

    const result: ParserContentObject | null =
      typeof content === 'string'
        ? {
            original: content,
          }
        : typeof content === 'object'
          ? content
          : null

    return result
  }

  private processExtended(lines: LineNormal[], inputTranslate: string, inputRoman: string) {
    const lineMap: Map<number, LineNormal> = new Map()
    const extendedMap: Map<number, Extended[]> = new Map()

    for (const line of lines) {
      lineMap.set(line.time.start, line)
    }

    const translate = processLines(matchLyric(inputTranslate).line, true)
    for (const item of translate) {
      const current = extendedMap.get(item.time.start) || []
      const extended = new Extended()
      extended.type = ExtendedType.Translate
      extended.content = item.content.original
      current.push(extended)
      extendedMap.set(item.time.start, current)
    }

    const roman = processLines(matchLyric(inputRoman).line, true) || []
    for (const item of roman) {
      const current = extendedMap.get(item.time.start) || []
      const extended = new Extended()
      extended.type = ExtendedType.Roman
      extended.content = item.content.original
      current.push(extended)
      extendedMap.set(item.time.start, current)
    }

    const result = alignNumberArray([...lineMap.keys()], [...extendedMap.keys()])
    for (const item of result) {
      const line = lineMap.get(item.base)
      if (!line) {
        continue
      }

      if (!line.content.extended) {
        line.content.extended = []
      }

      for (const target of item.targets) {
        const extended = extendedMap.get(target.value)
        if (!extended) {
          continue
        }
        line.content.extended.push(...extended)
      }
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
      ctx.result.type = Type.Empty
      return
    }

    this.processExtended(lines, input.translate || '', input.roman || '')

    ctx.result.lines = lines
    if (checkIsSyllable(match.line)) {
      ctx.result.type = Type.Syllable
    } else {
      ctx.result.type = Type.Normal
    }

    const metas = processMetas(match.meta)
    ctx.result.metas = metas
  }
}

export type { ParserContentType, ParserContentObject }
