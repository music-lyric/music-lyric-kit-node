import type { Line } from './line'
import type { Agent } from './agent'

import { Meta } from './meta'
import { Language } from './language'

export const Version = '0.8.0' as const

export enum InfoType {
  /**
   * Parsing the lyric failed.
   */
  Invalid = 'Invalid',
  /**
   * Has no lyric line.
   */
  Empty = 'Empty',
  /**
   * Has lyric content.
   */
  Normal = 'Normal',
}

export enum InfoTiming {
  /**
   * No time flag.
   */
  None = 'None',
  /**
   * Timed at line level.
   */
  Line = 'Line',
  /**
   * Timed at word level.
   */
  Syllable = 'Syllable',
}

export class Info {
  /**
   * Schema version of this data model.
   */
  readonly version = Version

  /**
   * Overall classification of the lyric.
   */
  type: InfoType = InfoType.Invalid

  /**
   * Timing precision of the lyric.
   */
  timing: InfoTiming = InfoTiming.None

  /**
   * Metadata of the lyric.
   */
  meta: Meta = new Meta()

  /**
   * Language distribution of the lyric.
   */
  language: Language = new Language()

  /**
   * Performing agents referenced by lines.
   */
  agents: Agent[] = []

  /**
   * Lyric lines in order.
   */
  lines: Line[] = []
}
