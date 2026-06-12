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

export class LineNormal {
  id: string = createRandomHex(4).toUpperCase()

  readonly type = LineType.Normal

  time: Time = new Time()

  content: LineNormalContent = new LineNormalContent()

  agent?: LineAgent

  background?: LineNormal[]
}

export type Line = LineInterlude | LineNormal
