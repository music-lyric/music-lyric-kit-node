import { createRandomHex } from '@music-lyric-kit/utils'

import { Time } from '../time'
import { Extended } from '../extended'
import { WordType } from '../word'
import { LineAgent } from '../agent'

import type { Word } from '../word'

export enum LineType {
  Normal = 'Normal',
  Interlude = 'Interlude',
}

export class LineInterlude {
  id: string = createRandomHex(4).toUpperCase()

  readonly type = LineType.Interlude

  time: Time = new Time()
}

export class LineNormalContent {
  words: Word[] = []

  extended: Extended[] = []

  get original(): string {
    return this.words
      .map((word) => {
        return word.type === WordType.Normal ? word.content : ' '.repeat(word.count)
      })
      .join('')
  }

  toJSON() {
    return {
      words: this.words,
      extended: this.extended,
      original: this.original,
    }
  }
}

abstract class LineNormalBase {
  readonly type = LineType.Normal

  id: string = createRandomHex(4).toUpperCase()

  time: Time = new Time()

  content: LineNormalContent = new LineNormalContent()

  agent?: LineAgent
}

export class LineNormalBackground extends LineNormalBase {}

export class LineNormal extends LineNormalBase {
  background?: LineNormalBackground[]
}

export type Line = LineInterlude | LineNormal
