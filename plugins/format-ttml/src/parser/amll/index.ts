import { ParserPlugin, ParserContext, PluginStage } from '@music-lyric-kit/core'
import { Lyric } from '@music-lyric-kit/lyric'
import { Xml } from '@music-lyric-kit/utils'

import { parseDocument } from '@root/parser/itunes/core'
import { getAttributeByName } from '@root/utils'

const CHECK_REGEXP = /xmlns:amll=["'][^"']+["']|amll:meta/iu

const parseMetaItem = (element: Xml.XmlElement): Lyric.MetaItem | undefined => {
  const key = getAttributeByName(element, 'key', true)
  const value = getAttributeByName(element, 'value', true)

  if (!key || !value) {
    return undefined
  }

  switch (key) {
    case 'musicName':
      return Lyric.createMetaItem(Lyric.MetaType.Title, key, value.trim())
    case 'artists':
      return Lyric.createMetaItem(Lyric.MetaType.Singer, key, value.trim())
    case 'album':
      return Lyric.createMetaItem(Lyric.MetaType.Album, key, value.trim())
    case 'isrc':
      return Lyric.createMetaItem(Lyric.MetaType.Isrc, key, value.trim())
    case 'ttmlAuthorGithubLogin':
      return Lyric.createMetaItem(Lyric.MetaType.Author, key, value.trim())
    default:
      // keep every other amll:meta (platform ids, github id, ...) under its original key for round-trip
      return Lyric.createMetaItem(Lyric.MetaType.Unknown, key, value.trim())
  }
}

const parseMetas = (metas: Xml.XmlElement[]) => {
  const result: Lyric.MetaItem[] = []

  for (const element of metas) {
    const item = parseMetaItem(element)
    if (item) {
      result.push(item)
    }
  }

  return result
}

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
    // invalid xml parses to null; leave the result untouched.
    if (!root) {
      return
    }

    const { lines, metas, agents, timing, groups } = parseDocument(root)

    // amll is itunes plus its own amll:meta layered on top.
    ctx.result.type = Lyric.InfoType.Normal
    ctx.result.timing = timing
    ctx.result.lines = lines
    ctx.result.meta.list = [...metas, ...parseMetas(groups.get('meta') ?? [])]
    ctx.result.agents = agents
  }
}
