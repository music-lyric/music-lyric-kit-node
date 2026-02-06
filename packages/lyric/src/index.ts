import { Time } from './time'
import { WordNormal, WordSpace, WordType } from './word'
import { Extended, ExtendedType } from './extended'
import { Line, LineContent, LineType } from './line'

import type { Word } from './word'

const Version = '0.1.0' as const

enum Type {
  // parse lyric failed
  Incorrect = 'Incorrect',
  // normal lyric (line by line)
  Normal = 'Normal',
  // syllable lyric
  Syllable = 'Syllable',
  // pure music (no lyric line)
  Pure = 'Pure',
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
  Line,
  LineContent,
  LineType,
  // version
  Version,
  // info
  Info,
}

export type { Word }

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
  Line,
  LineContent,
  LineType,
  // version
  Version,
  // info
  Info,
}
