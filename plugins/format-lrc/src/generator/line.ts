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

    if (info.timing === Lyric.InfoTiming.Syllable) {
      const content = line.words
      const items = content.map((item) => {
        if (item.type === Lyric.WordType.Space) {
          return ' '.repeat(item.count)
        }
        const time = formatTime(item.time?.start ?? 0)
        return `<${time}>${item.content}`
      })

      const syllableLine = `${lineTime}${items.join('')}`
      syllable.push(syllableLine)

      const originalLine = `${lineTime}${line.original}`
      original.push(originalLine)
    } else {
      const target = `${lineTime}${line.original}`
      original.push(target)
    }

    for (const item of line.annotation.all(Lyric.LineAnnotationKind.Translate)) {
      translate.push(`${lineTime}${item.content}`)
    }
    for (const item of line.annotation.all(Lyric.LineAnnotationKind.Roman)) {
      roman.push(`${lineTime}${item.content}`)
    }
  }

  return {
    original,
    syllable,
    translate,
    roman,
  }
}
