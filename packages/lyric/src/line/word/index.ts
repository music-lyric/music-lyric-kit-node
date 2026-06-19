import type { LanguageTag } from '@root/language'
import type { WordAnnotation } from './annotation'

import { Time } from '@root/time'

import { createRandomString } from '@music-lyric-kit/utils'

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
   * Unique identifier of the word.
   */
  readonly id: string = createRandomString(6).toUpperCase()

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
  content: string = ''

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
  stress: boolean = false
}

export class WordSpace {
  /**
   * Discriminant marking this as a space.
   */
  readonly type = WordType.Space

  /**
   * Number of consecutive space characters.
   */
  count: number = 1
}

export type Word = WordNormal | WordSpace

export * from './annotation'
