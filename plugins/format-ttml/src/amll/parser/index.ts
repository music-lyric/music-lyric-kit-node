import { ParserPlugin, ParserContext, PluginStage } from '@music-lyric-kit/core'

import { Xml } from '@music-lyric-kit/utils'
import { Lyric } from '@music-lyric-kit/lyric'

import { checkIsSyllable } from '@root/utils'

import { processLines } from './line'
import { processMetas } from './meta'
import { processAgents } from './agent'

const CHECK_REGEXP = /xmlns:amll=["'][^"']+["']|amll:meta/iu

export class AmllParser extends ParserPlugin {
  private parser = new Xml.Parser()

  override get id() {
    return 'TTML-AMLL-PARSER'
  }

  override get stage() {
    return PluginStage.Process
  }

  override get format() {
    return 'ttml-amll'
  }

  override check(ctx: ParserContext) {
    const input = ctx.params.content
    if (typeof input !== 'string') {
      return false
    }

    return CHECK_REGEXP.test(input)
  }

  override exec(ctx: ParserContext) {
    const input = ctx.params.content
    if (typeof input !== 'string') {
      return
    }

    const root = this.parser.parse(input)

    const lines = processLines(root)
    const isSyllable = checkIsSyllable(lines[0])
    ctx.result.type = isSyllable ? Lyric.Type.Syllable : Lyric.Type.Normal
    ctx.result.lines = lines

    const metas = processMetas(root)
    ctx.result.metas = metas

    const agents = processAgents(root)
    ctx.result.agents = agents
  }
}
