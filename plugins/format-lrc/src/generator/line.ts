import { Lyric } from '@music-lyric-kit/lyric'

import { formatTime } from '@music-lyric-kit/utils'

export const exportLines = (info: Lyric.Info) => {
  const original = []
  const syllable = []
  const translate = []
  const roman = []

  for (const line of info.lines) {
    if (line.type !== Lyric.LineType.Normal) {
      continue
    }

    const lineTime = `[${formatTime(line.time.start)}]`

    if (info.type === Lyric.Type.Syllable) {
      const content = line.content.words
      const items = content.map((item) => {
        if (item.type === Lyric.WordType.Space) {
          return ' '.repeat(item.count)
        }
        const time = formatTime(item.time.start)
        return `<${time}>${item.content}`
      })

      const syllableLine = `${lineTime}${items.join('')}`
      syllable.push(syllableLine)

      const originalLine = `${lineTime}${line.content.original}`
      original.push(originalLine)
    } else {
      const target = `${lineTime}${line.content.original}`
      original.push(target)
    }

    for (const item of line.content.extended || []) {
      const target = `${lineTime}${item.content}`
      switch (item.type) {
        case Lyric.ExtendedType.Translate:
          translate.push(target)
          break
        case Lyric.ExtendedType.Roman:
          roman.push(target)
          break
      }
    }
  }

  return {
    original,
    syllable,
    translate,
    roman,
  }
}
