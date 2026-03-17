import { removeTextSpaceAll } from '@music-lyric-kit/utils'

const CLEAN_REGEXP = /[^\u4E00-\u9FFF\u3400-\u4DBF\u3040-\u309F\u30A0-\u30FF\uAC00-\uD7AFa-zA-Z0-9\s]/g

export const cleanText = (text: string) => {
  if (!text.trim()) {
    return ''
  }
  return removeTextSpaceAll(text.replace(CLEAN_REGEXP, ''))
}
