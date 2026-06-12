import { ref, type Ref } from 'vue'

import enUs from '@root/language/en-us.json'
import zhCn from '@root/language/zh-cn.json'

export type LocaleKey = 'en-us' | 'zh-cn'

type Messages = Record<string, string>

const MESSAGES: Record<LocaleKey, Messages> = {
  'en-us': enUs as Messages,
  'zh-cn': zhCn as Messages,
}

const DEFAULT_LOCALE: LocaleKey = 'en-us'
const STORAGE_KEY = 'lyric_parser_locale'

const readStoredLocale = (): LocaleKey => {
  const stored = localStorage.getItem(STORAGE_KEY) as LocaleKey | null
  return stored && stored in MESSAGES ? stored : DEFAULT_LOCALE
}

let localeRef: Ref<LocaleKey> | null = null

const ensureRef = (): Ref<LocaleKey> => {
  if (!localeRef) {
    localeRef = ref(readStoredLocale())
  }
  return localeRef
}

export interface I18n {
  locale: Ref<LocaleKey>
  t: (key: string) => string
  setLocale: (locale: LocaleKey) => void
  available: LocaleKey[]
}

export const useI18n = (): I18n => {
  const locale = ensureRef()

  // Fall back to the default locale, then the raw key, so untranslated text still renders.
  const t = (key: string) => {
    const current = MESSAGES[locale.value][key]
    if (typeof current === 'string' && current.length > 0) return current
    const fallback = MESSAGES[DEFAULT_LOCALE][key]
    return typeof fallback === 'string' ? fallback : key
  }

  const setLocale = (next: LocaleKey) => {
    if (!(next in MESSAGES)) return
    locale.value = next
    localStorage.setItem(STORAGE_KEY, next)
  }

  return {
    locale,
    t,
    setLocale,
    available: Object.keys(MESSAGES) as LocaleKey[],
  }
}
