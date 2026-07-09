import type { ElementGroups } from '@root/utils'
import type { ParseSpanOptions } from './line'

import { Lyric } from '@music-lyric-kit/lyric'
import { Xml } from '@music-lyric-kit/utils'

import { hasWordTiming, findElementsByLocalName, collectElementsByLocalName } from '@root/utils'
import { parseLines } from './line'
import { parseAgents, applyItunesMetas } from './meta'
import { attachHeadAnnotations } from './attach'

// head element local names collected in one pass and reused by every consumer.
const HEAD_BLOCKS = ['songwriter', 'agent', 'translation', 'transliteration', 'meta']

export interface TtmlDocument {
  /**
   * Parsed lines, with head iTunesMetadata annotations already attached.
   */
  lines: Lyric.Runtime.Proto.Line[]
  /**
   * Structured meta read from the iTunesMetadata head.
   */
  meta: Lyric.Runtime.Proto.Meta
  /**
   * Performing agents declared in the head.
   */
  agents: Lyric.Runtime.Proto.AgentItem[]
  /**
   * Whether the lines carry per-word timing.
   */
  timing: Lyric.Common.Proto.Timing
  /**
   * Head elements grouped by local name, for dialects that read further from them.
   */
  groups: ElementGroups
}

export const parseDocument = (root: Xml.XmlElement, options?: ParseSpanOptions): TtmlDocument => {
  const body = findElementsByLocalName(root, 'body', true)[0]
  const metadata = findElementsByLocalName(root, 'metadata', true)[0]

  const { lines, lineMap, backgroundMap } = parseLines(body, options)

  const groups = metadata ? collectElementsByLocalName(metadata, HEAD_BLOCKS) : (new Map() as ElementGroups)
  attachHeadAnnotations(groups, lineMap, backgroundMap)

  const meta = Lyric.Runtime.makeMeta()
  applyItunesMetas(meta, groups.get('songwriter') ?? [])

  return {
    lines,
    meta,
    agents: parseAgents(groups.get('agent') ?? []),
    timing: hasWordTiming(lines[0]) ? Lyric.Common.Proto.Timing.WORD : Lyric.Common.Proto.Timing.LINE,
    groups,
  }
}
