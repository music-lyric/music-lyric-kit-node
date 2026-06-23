import type { Init } from '@root/init'
import type { LanguageTag } from '@root/language'
import type { WordAnnotation } from './annotation'

import { Time } from '@root/time'

export enum WordType {
  /**
   * A normal word carrying text.
   */
  Normal = 'Normal',
  /**
   * A run of whitespace between words.
   */
  Space = 'Space',
}

export class WordNormal {
  /**
   * Discriminant marking this as a normal word.
   */
  readonly type = WordType.Normal

  /**
   * Time range of the word.
   */
  time?: Time

  /**
   * Text content of the word.
   */
  content: string

  /**
   * Language of this word.
   */
  language?: LanguageTag

  /**
   * Annotations attached to this word.
   */
  annotation?: WordAnnotation

  /**
   * Whether the word is stressed.
   */
  stress: boolean

  constructor(init: Init<WordNormal> = {}) {
    this.time = init.time
    this.content = init.content ?? ''
    this.language = init.language
    this.annotation = init.annotation
    this.stress = init.stress ?? false
  }
}

export class WordSpace {
  /**
   * Discriminant marking this as a space.
   */
  readonly type = WordType.Space

  /**
   * Number of consecutive space characters.
   */
  count: number

  constructor(init: Init<WordSpace> = {}) {
    this.count = init.count ?? 1
  }
}

export type Word = WordNormal | WordSpace

export * from './annotation'
