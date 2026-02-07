import { createRandomHex } from '@music-lyric-kit/utils'

import { Time } from '../time'
import { Extended } from '../extended'
import { WordType } from '../word'

import type { Word } from '../word'

export enum LineType {
  Normal = 'Normal',
  Interlude = 'Interlude',
}

export class LineInterlude {
  get type() {
    return LineType.Interlude as const
  }

  id: string = createRandomHex(4).toUpperCase()

  time: Time = new Time()

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      time: this.time,
    }
  }
}

export class LineNormalContent {
  words: Word[] = []

  extended: Extended[] = []

  get original(): string {
    return this.words
      .map((word) => {
        return word.type === WordType.Normal ? word.content : new Array(word.count).fill(' ').join('')
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
  get type() {
    return LineType.Normal as const
  }

  id: string = createRandomHex(4).toUpperCase()

  time: Time = new Time()

  content: LineNormalContent = new LineNormalContent()

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      time: this.time,
      content: this.content,
    }
  }
}

export type Line = LineInterlude | LineNormal
