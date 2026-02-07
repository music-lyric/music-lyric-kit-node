import { Time } from './time'
import { WordNormal, WordSpace, WordType } from './word'
import { Extended, ExtendedType } from './extended'
import { Line, LineType, LineInterlude, LineNormal, LineNormalContent } from './line'

import type { Word } from './word'

const Version = '0.1.0' as const

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
  version = Version

  type: Type = Type.Incorrect

  lines: Line[] = []

  toJSON() {
    return {
      version: this.version,
      type: this.type,
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
  // version
  Version,
  // info
  Info,
  Type,
}

export type { Word, Line }

export default {
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
  // version
  Version,
  // info
  Info,
  Type,
}
