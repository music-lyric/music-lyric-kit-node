import type { ContentType, ContentTypeObject } from './interface'

import { Parser } from '@music-lyric-kit/core'

import { processLyric } from './core'

const CHECK_REGEXP = /\[(?:\d{1,3}:)?(?:\d{1,2}:)?\d{1,2}\.\d{3}\]/

export const Plugin = (): Parser.Plugin.FormatParser => {
  const processInput = (input: any) => {
    const content = input as ContentType

    const result: ContentTypeObject | null =
      typeof content === 'string'
        ? {
            original: content,
          }
        : typeof content === 'object'
          ? content
          : null

    return result
  }

  return {
    meta: {
      name: 'lrc-parser',
      stage: Parser.Stage.FormatParser,
      priority: 100,
      format: 'lrc',
      config: {
        needAlignExtended: true,
      },
    },
    check(ctx) {
      const input = processInput(ctx.params.content)

      if (!input) {
        return false
      }

      if (!input.original) {
        return false
      }

      return CHECK_REGEXP.test(input.original)
    },
    exec(ctx) {
      const input = processInput(ctx.params.content)
      if (!input) {
        return
      }

      const { type, lines, extendeds } = processLyric(input)

      ctx.result.type = type
      ctx.result.lines = lines
      ctx.runtime.extendeds = extendeds
    },
  }
}

export type { ContentType, ContentTypeObject }
