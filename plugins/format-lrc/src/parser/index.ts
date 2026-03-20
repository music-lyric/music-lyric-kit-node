import type { ParserContentType, ParserContentObject } from './interface'

import { ParserPlugin, ParserStage, ParserContext } from '@music-lyric-kit/core'

import { processLyric } from './core'

const CHECK_REGEXP = /\[(?:\d{1,3}:)?(?:\d{1,2}:)?\d{1,2}\.\d{3}\]/

const processInput = (input: any) => {
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

  override check(ctx: ParserContext) {
    const input = processInput(ctx.params.content)

    if (!input?.original) {
      return false
    }

    return CHECK_REGEXP.test(input.original)
  }

  override exec(ctx: ParserContext) {
    const input = processInput(ctx.params.content)
    if (!input) {
      return
    }

    const { type, lines, metas } = processLyric(input)

    ctx.result.type = type
    ctx.result.lines = lines
    ctx.result.metas = metas
  }
}

export type { ParserContentType, ParserContentObject }
