import { Time } from './time'
import { Word, WordNormal, WordSpace, WordType } from './word'
import { Extended, ExtendedType } from './extended'
import { Line, LineContent, LineType } from './line'

const Version = '0.1.0' as const

class Config {
  /** is instrumental music (may) */
  isInsturmental: boolean = false

  /** can syllable */
  isSyllable: boolean = false

  /** is support auto scroll lyric (no lyric time info) */
  canAutoScroll: boolean = false

  toJSON() {
    return {
      isInsturmental: this.isInsturmental,
      isSyllable: this.isSyllable,
      canAutoScroll: this.canAutoScroll,
    }
  }
}

class Info {
  version = Version

  lines: Line[] = []

  config: Config = new Config()
}

export {
  // time
  Time,
  // word
  Word,
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
  // config
  Config,
  // info
  Info,
}

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
  // config
  Config,
  // info
  Info,
}
