import type { LanguageTag } from '@root/language'
import type { Word } from '../word'

import { Time } from '@root/time'
import { LineAgent } from '@root/agent'
import { WordType } from '../word'
import { LineAnnotation } from './annotation'

import { createRandomString } from '@music-lyric-kit/utils'

export enum LineType {
  /**
   * Normal lyric line carrying content.
   */
  Normal = 'Normal',
  /**
   * Interlude gap between lyric lines.
   */
  Interlude = 'Interlude',
}

class LineBase {
  /**
   * Unique identifier of the line.
   */
  readonly id: string = createRandomString(6).toUpperCase()

  /**
   * Time range of the line.
   */
  time: Time = new Time()
}

export class LineNormalBase extends LineBase {
  /**
   * Discriminant marking this as a normal line.
   */
  readonly type = LineType.Normal

  /**
   * Performing agent of this line.
   */
  agent?: LineAgent

  /**
   * Words composing the line in order.
   */
  words: Word[] = []

  /**
   * Plain text of the line joined from every word.
   */
  get original(): string {
    let result = ''
    for (let i = 0, len = this.words.length; i < len; i++) {
      const word = this.words[i]
      result += word.type === WordType.Normal ? word.content : ' '.repeat(word.count)
    }
    return result
  }

  /**
   * Annotations applied to the whole line, derived from words unless set explicitly.
   */
  annotation: LineAnnotation = new LineAnnotation(this)

  #languages?: LanguageTag[]
  /**
   * Language tags of this line: the value set explicitly, otherwise collected from words.
   */
  get languages(): LanguageTag[] {
    if (this.#languages?.length) {
      return this.#languages
    }
    const result = new Set<LanguageTag>()
    for (let i = 0, len = this.words.length; i < len; i++) {
      const word = this.words[i]
      if (word.type === WordType.Normal && word.language) {
        result.add(word.language)
      }
    }
    return [...result]
  }
  /**
   * Override the words-derived languages with explicit tags.
   */
  set languages(value: LanguageTag[]) {
    this.#languages = value
  }
}

export class LineNormal extends LineNormalBase {
  /**
   * Background lines attached to this line.
   */
  background?: LineNormalBase[]
}

export class LineInterlude extends LineBase {
  /**
   * Discriminant marking this as an interlude line.
   */
  readonly type = LineType.Interlude
}

export type Line = LineInterlude | LineNormal

export * from './annotation'
