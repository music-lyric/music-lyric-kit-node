import { ParserPlugin, ParserContext, PluginStage } from '@music-lyric-kit/core'

import { Xml } from '@music-lyric-kit/utils'
import { Lyric } from '@music-lyric-kit/lyric'

import { checkIsSyllable, findElementsByLocalName } from '@root/utils'

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

    const body = findElementsByLocalName(root, 'body', true)[0]
    const metadata = findElementsByLocalName(root, 'metadata', true)[0]

    const lines = processLines(body)
    const isSyllable = checkIsSyllable(lines[0])
    ctx.result.type = isSyllable ? Lyric.InfoType.Syllable : Lyric.InfoType.Normal
    ctx.result.lines = lines

    const metas = processMetas(metadata)
    ctx.result.metas = metas

    const agents = processAgents(metadata)
    ctx.result.agents = agents
  }
}
