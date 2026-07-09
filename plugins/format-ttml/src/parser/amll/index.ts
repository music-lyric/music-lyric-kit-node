import { ParserPlugin, ParserContext, PluginStage } from '@music-lyric-kit/core'
import { Lyric } from '@music-lyric-kit/lyric'
import { Xml } from '@music-lyric-kit/utils'

import { parseDocument } from '@root/parser/itunes/core'
import { getAttributeByName } from '@root/utils'
import { interceptRubySpan } from './ruby'

const CHECK_REGEXP = /xmlns:amll=["'][^"']+["']|amll:meta/iu

const applyAmllMeta = (meta: Lyric.Runtime.Proto.Meta, element: Xml.XmlElement) => {
  const key = getAttributeByName(element, 'key', true)
  const value = getAttributeByName(element, 'value', true)

  if (!key || !value) {
    return
  }

  const text = value.trim()
  switch (key) {
    case 'musicName':
      meta.titles.push(Lyric.Runtime.makeMetaText({ content: text }))
      return
    case 'artists':
      meta.artists.push(Lyric.Runtime.makeMetaText({ content: text }))
      return
    case 'album':
      meta.albums.push(Lyric.Runtime.makeMetaText({ content: text }))
      return
    case 'isrc':
      meta.isrcs.push(text)
      return
    case 'ttmlAuthorGithubLogin':
      meta.authors.push(Lyric.Runtime.makeMetaText({ content: text }))
      return
    default:
      // keep every other amll:meta (platform ids, github id, ...) under its original key for round-trip
      meta.unknowns.push(Lyric.Runtime.makeMetaUnknown({ key, value: text }))
  }
}

const applyAmllMetas = (meta: Lyric.Runtime.Proto.Meta, metas: Xml.XmlElement[]) => {
  for (const element of metas) {
    applyAmllMeta(meta, element)
  }
}

export class AmllParser extends ParserPlugin {
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

    const root = new Xml.Parser().parse(input)
    // invalid xml parses to null; leave the result untouched.
    if (!root) {
      return
    }

    const { lines, meta, agents, timing, groups } = parseDocument(root, { onSpan: interceptRubySpan })

    // amll is itunes plus its own amll:meta layered on top.
    applyAmllMetas(meta, groups.get('meta') ?? [])

    ctx.result.type = Lyric.Runtime.Proto.InfoType.VALID
    ctx.result.timing = timing
    ctx.result.lines = lines
    ctx.result.meta = meta
    ctx.result.agents = agents
  }
}
