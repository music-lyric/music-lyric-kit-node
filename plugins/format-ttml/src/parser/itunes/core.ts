import type { ElementGroups } from '@root/utils'
import type { ParseSpanOptions } from './line'

import { Lyric } from '@music-lyric-kit/lyric'
import { Xml } from '@music-lyric-kit/utils'

import { hasWordTiming, findElementsByLocalName, collectElementsByLocalName } from '@root/utils'
import { parseLines } from './line'
import { parseAgents, parseItunesMetas } from './meta'
import { attachHeadAnnotations } from './attach'

// head element local names collected in one pass and reused by every consumer.
const HEAD_BLOCKS = ['songwriter', 'agent', 'translation', 'transliteration', 'meta']

export interface TtmlDocument {
  /**
   * Parsed lines, with head iTunesMetadata annotations already attached.
   */
  lines: Lyric.LineNormal[]
  /**
   * Metas read from the iTunesMetadata head.
   */
  metas: Lyric.MetaItem[]
  /**
   * Performing agents declared in the head.
   */
  agents: Lyric.AgentItem[]
  /**
   * Whether the lines carry per-word timing.
   */
  timing: Lyric.InfoTiming
  /**
   * Head elements grouped by local name, for dialects that read further from them.
   */
  groups: ElementGroups
}

/**
 * Parse a TTML document tree into the base result.
 *
 * A dialect layers its own content on top of the returned base.
 */
export const parseDocument = (root: Xml.XmlElement, options?: ParseSpanOptions): TtmlDocument => {
  const body = findElementsByLocalName(root, 'body', true)[0]
  const metadata = findElementsByLocalName(root, 'metadata', true)[0]

  const { lines, lineMap } = parseLines(body, options)

  const groups = metadata ? collectElementsByLocalName(metadata, HEAD_BLOCKS) : (new Map() as ElementGroups)
  attachHeadAnnotations(groups, lineMap)

  return {
    lines,
    metas: parseItunesMetas(groups.get('songwriter') ?? []),
    agents: parseAgents(groups.get('agent') ?? []),
    timing: hasWordTiming(lines[0]) ? Lyric.InfoTiming.Syllable : Lyric.InfoTiming.Line,
    groups,
  }
}
