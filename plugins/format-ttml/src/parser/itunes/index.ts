import { ParserPlugin, ParserContext, PluginStage } from '@music-lyric-kit/core'
import { Lyric } from '@music-lyric-kit/lyric'
import { Xml } from '@music-lyric-kit/utils'

import { parseDocument } from './core'

const CHECK_REGEXP = /xmlns:itunes|iTunesMetadata|itunes:timing=/iu

const AMLL_HINT_REGEXP = /xmlns:amll|amll:meta/iu

export class ItunesParser extends ParserPlugin {
  private parser = new Xml.Parser()

  override get id() {
    return 'TTML-ITUNES-PARSER'
  }

  override get stage() {
    return PluginStage.Process
  }

  override get format() {
    return 'ttml-itunes'
  }

  override check(ctx: ParserContext) {
    const input = ctx.params.content
    if (typeof input !== 'string') {
      return false
    }

    return CHECK_REGEXP.test(input) && !AMLL_HINT_REGEXP.test(input)
  }

  override exec(ctx: ParserContext) {
    const input = ctx.params.content
    if (typeof input !== 'string') {
      return
    }

    const root = this.parser.parse(input)
    // invalid xml parses to null; leave the result untouched.
    if (!root) {
      return
    }

    const { lines, metas, agents, timing } = parseDocument(root)

    ctx.result.type = Lyric.InfoType.Normal
    ctx.result.timing = timing
    ctx.result.lines = lines
    ctx.result.meta.list = metas
    ctx.result.agent.list = agents
  }
}
