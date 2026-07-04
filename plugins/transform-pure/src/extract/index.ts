import type { DeepPartial } from '@music-lyric-kit/utils'
import type { ExtractCreatorConfig } from './config'

import { DEFAULT_CREATOR_CONFIG } from './config'
import { DEFAULT_CREATOR_RULES_FULL } from './constants'

import { ConfigManager, removeTextSpaceAll } from '@music-lyric-kit/utils'
import { Matcher } from '@root/utils/match'

import { ParserPlugin, ParserContext, PluginStage } from '@music-lyric-kit/core'
import { Lyric } from '@music-lyric-kit/lyric'
import { extractCreator, splitNameWithRule } from './utils'

export class ExtractCreator extends ParserPlugin {
  private matcher: Matcher

  override config = new ConfigManager<ExtractCreatorConfig, DeepPartial<ExtractCreatorConfig>>(DEFAULT_CREATOR_CONFIG)

  override get priority() {
    return 40
  }

  override get id() {
    return 'TRANSFORM-PURE-EXTRACT'
  }

  override get stage() {
    return PluginStage.Transform
  }

  constructor() {
    super()
    this.matcher = new Matcher(this.config.current.match, DEFAULT_CREATOR_RULES_FULL)
    this.config.event.add('update', (keys, opt) => {
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

    const meta = ctx.result.meta ?? (ctx.result.meta = Lyric.Runtime.makeMeta())
    const newLines: Lyric.Runtime.Line[] = []

    for (const line of lines) {
      if (!Lyric.Runtime.isLineNormal(line)) {
        newLines.push(line)
        continue
      }

      const target = extractCreator(Lyric.Runtime.getLineText(line))
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

      if (name) {
        const names = splitNameWithRule(name, this.config.current.split)
        if (names.length > 0) {
          meta.credits.push(
            Lyric.Runtime.makeMetaCredit({
              role,
              names: names.map((item) => Lyric.Runtime.makeMetaText({ content: item })),
            }),
          )
        }
      }

      if (!this.config.current.replace) {
        newLines.push(line)
      }
    }

    ctx.result.lines = newLines
  }
}

export type { ExtractCreatorConfig }
