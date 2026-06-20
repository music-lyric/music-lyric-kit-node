import { ParserPlugin, ParserContext, PluginStage } from '@music-lyric-kit/core'
import { Xml } from '@music-lyric-kit/utils'
import { Lyric } from '@music-lyric-kit/lyric'

import { checkIsSyllable, findElementsByLocalName, getAttributeByName } from '@root/utils'
import { processLine, processAgents } from '@root/common'
import { processMetas } from './meta'
import { attachTranslate } from './translate'
import { attachRoman } from './roman'

const CHECK_REGEXP = /iTunesMetadata|itunes:timing=/iu

const AMLL_HINT_REGEXP = /xmlns:amll|amll:meta/iu

export class AmParser extends ParserPlugin {
  private parser = new Xml.Parser()

  override get id() {
    return 'TTML-AM-PARSER'
  }

  override get stage() {
    return PluginStage.Process
  }

  override get format() {
    return 'ttml-am'
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

    const body = findElementsByLocalName(root, 'body', true)[0]
    const metadata = findElementsByLocalName(root, 'metadata', true)[0]

    // collect lines and index them by itunes:key so head translations can be attached
    const lines: Lyric.LineNormal[] = []
    const keyMap = new Map<string, Lyric.LineNormal>()
    if (body) {
      const elements = findElementsByLocalName(body, 'p')
      for (const element of elements) {
        const line = processLine(element)
        if (!line) {
          continue
        }
        lines.push(line)
        const key = getAttributeByName(element, 'key', true)
        if (key) {
          keyMap.set(key, line)
        }
      }
    }

    attachTranslate(root, keyMap)
    attachRoman(root, keyMap)

    const isSyllable = checkIsSyllable(lines[0])
    ctx.result.type = Lyric.InfoType.Normal
    ctx.result.timing = isSyllable ? Lyric.InfoTiming.Syllable : Lyric.InfoTiming.Line
    ctx.result.lines = lines

    ctx.result.meta.list = processMetas(metadata)
    ctx.result.agents = processAgents(metadata)
  }
}
