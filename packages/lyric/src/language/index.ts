import type { LanguageItem } from './content'

export class Language {
  /**
   * All languages with their shares.
   */
  list: LanguageItem[] = []

  /**
   * The language with the highest share.
   */
  get primary(): LanguageItem | undefined {
    let result: LanguageItem | undefined
    for (let i = 0, len = this.list.length; i < len; i++) {
      if (!result || this.list[i].percent > result.percent) {
        result = this.list[i]
      }
    }
    return result
  }
}

export * from './content'
