import { Time } from './time'
import { WordNormal, WordSpace, WordType } from './word'
import { Extended, ExtendedType } from './extended'
import { LineType, LineInterlude, LineNormal, LineNormalContent } from './line'
import { MetaType, MetaOffset, MetaDuration, MetaTitle, MetaSinger, MetaAlbum, MetaCreator, MetaUnKnown } from './meta'

import type { Word } from './word'
import type { Line } from './line'
import type { Meta } from './meta'

const Version = '0.2.0' as const

enum Type {
  // parse lyric failed
  Incorrect = 'Incorrect',
  // normal lyric (line by line)
  Normal = 'Normal',
  // syllable lyric
  Syllable = 'Syllable',
  // pure music
  Pure = 'Pure',
  // empty lyric (no lyric line)
  Empty = 'Empty',
  // no time flag, but has lyric line
  NoTime = 'NoTime',
}

class Info {
  get version() {
    return Version
  }

  type: Type = Type.Incorrect

  metas: Meta[] = []

  lines: Line[] = []

  toJSON() {
    return {
      version: this.version,
      type: this.type,
      metas: this.metas,
      lines: this.lines,
    }
  }
}

export {
  // time
  Time,
  // word
  WordNormal,
  WordSpace,
  WordType,
  // extended
  Extended,
  ExtendedType,
  // line
  LineInterlude,
  LineNormal,
  LineNormalContent,
  LineType,
  // meta
  MetaOffset,
  MetaDuration,
  MetaTitle,
  MetaSinger,
  MetaAlbum,
  MetaCreator,
  MetaUnKnown,
  MetaType,
  // version
  Version,
  // info
  Info,
  Type,
}

export type { Word, Line, Meta }
