import type { Init } from '@root/init'

export enum LanguageType {
  /**
   * Simplified Chinese.
   */
  ChineseSimplified = 'zh-hans',
  /**
   * Traditional Chinese.
   */
  ChineseTraditional = 'zh-hant',
  /**
   * English.
   */
  English = 'en',
  /**
   * Japanese.
   */
  Japanese = 'ja',
  /**
   * Korean.
   */
  Korean = 'ko',
  /**
   * Russian.
   */
  Russian = 'ru',
  /**
   * French.
   */
  French = 'fr',
  /**
   * German.
   */
  German = 'de',
  /**
   * Spanish.
   */
  Spanish = 'es',
  /**
   * Italian.
   */
  Italian = 'it',
  /**
   * Portuguese.
   */
  Portuguese = 'pt',
}

export type LanguageTag = LanguageType | (string & {})

export class LanguageItem {
  /**
   * Language tag.
   */
  tag: LanguageTag

  /**
   * Share within the lyric, ranging from 0 to 100.
   * Recommended to be computed from word-level language counts.
   */
  percent: number

  constructor(init: Init<LanguageItem> = {}) {
    this.tag = init.tag ?? ''
    this.percent = init.percent ?? 0
  }
}
