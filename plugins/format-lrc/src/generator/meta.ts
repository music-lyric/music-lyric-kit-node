import { Lyric } from '@music-lyric-kit/lyric'
import { formatTime } from '@music-lyric-kit/utils'

const renderItem = (key: string, content: string) => {
  return `[${key}:${content}]`
}

export const exportMeta = (info: Lyric.Info) => {
  const result: string[] = []

  for (const item of info.meta.list) {
    switch (item.type) {
      case Lyric.MetaType.Offset:
        result.push(renderItem('offset', item.value.toString()))
        break
      case Lyric.MetaType.Title:
        result.push(renderItem('ti', item.value))
        break
      case Lyric.MetaType.Singer:
        result.push(renderItem('ar', item.value))
        break
      case Lyric.MetaType.Album:
        result.push(renderItem('al', item.value))
        break
      case Lyric.MetaType.Duration:
        result.push(renderItem('length', formatTime(item.value)))
        break
    }
  }

  return result
}
