import type { DeepPartial } from '@music-lyric-kit/utils'
import type { Line, Meta } from '@music-lyric-kit/lyric'
import type { ExtractCreatorConfig } from './config'

import { DEFAULT_CREATOR_CONFIG } from './config'
import { DEFAULT_CREATOR_RULES } from './constants'

import { ConfigManager, removeTextSpaceAll } from '@music-lyric-kit/utils'
import { Matcher } from '@root/utils/match'

import { ParserPlugin, ParserStage, ParserContext } from '@music-lyric-kit/core'
import { LineType, MetaCreator } from '@music-lyric-kit/lyric'
import { extractCreator, splitNameWithRule } from './utils'

export class ExtractCreatorPlugin extends ParserPlugin {
  private matcher: Matcher

  override config = new ConfigManager<ExtractCreatorConfig, DeepPartial<ExtractCreatorConfig>>(DEFAULT_CREATOR_CONFIG)

  override get priority() {
    return 40
  }

  override get id() {
    return 'TRANSFORM-EXTRACT'
  }

  override get name() {
    return 'TRANSFORM-EXTRACT'
  }

  override get stage() {
    return ParserStage.Transform
  }

  constructor() {
    super()
    this.matcher = new Matcher(this.config.current.match, DEFAULT_CREATOR_RULES)
    this.config.on((opt) => {
      this.matcher.update(opt.match)
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

    const newMetas: Meta[] = [...ctx.result.metas]
    const newLines: Line[] = []

    for (const line of lines) {
      if (line.type != LineType.Normal) {
        newLines.push(line)
        continue
      }

      const target = extractCreator(line.content.original)
      if (!target) {
        newLines.push(line)
        continue
      }

      const [role, name] = target
      const result = this.matcher.match(removeTextSpaceAll(role))
      if (!result) {
        newLines.push(line)
        continue
      }

      const meta = new MetaCreator()
      meta.content.role = role
      meta.content.name = splitNameWithRule(name, this.config.current.split)

      if (!this.config.current.replace) {
        newLines.push(line)
      }
      newMetas.push(meta)
    }

    ctx.result.lines = newLines
    ctx.result.metas = newMetas
  }
}

export type { ExtractCreatorConfig }
