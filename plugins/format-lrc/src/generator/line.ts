import { Lyric } from '@music-lyric-kit/lyric'

import { formatTime } from '@music-lyric-kit/utils'

export const exportLines = (info: Lyric.Info) => {
  const original = []
  const syllable = []
  const translate = []
  const roman = []

  for (const line of info.lines) {
    if (!Lyric.isLineNormal(line)) {
      continue
    }
    const body = line.body.value

    const lineTime = `[${formatTime(line.time?.start ?? 0)}]`

    if (info.timing === Lyric.InfoTiming.WORD) {
      const items = (body.content?.words ?? []).map((item) => {
        if (Lyric.isWordNormal(item)) {
          const time = formatTime(item.body.value.time?.start ?? 0)
          return `<${time}>${item.body.value.content}`
        }
        if (Lyric.isWordSpace(item)) {
          return ' '.repeat(item.body.value.count)
        }
        return ''
      })

      const syllableLine = `${lineTime}${items.join('')}`
      syllable.push(syllableLine)

      const originalLine = `${lineTime}${Lyric.getLineText(line)}`
      original.push(originalLine)
    } else {
      const target = `${lineTime}${Lyric.getLineText(line)}`
      original.push(target)
    }

    const annotation = body.content?.annotation
    for (const item of annotation?.translates ?? []) {
      translate.push(`${lineTime}${item.content}`)
    }
    for (const item of annotation?.romans ?? []) {
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
