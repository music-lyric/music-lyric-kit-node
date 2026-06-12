import { Lyric } from '@music-lyric-kit/lyric'
import { formatTime } from '@music-lyric-kit/utils'

const renderItem = (key: string, content: string) => {
  return `[${key}:${content}]`
}

export const exportMeta = (info: Lyric.Info) => {
  const result: string[] = []

  for (const item of info.metas) {
    switch (item.type) {
      case Lyric.MetaType.Offset:
        result.push(renderItem('offset', item.content.toString()))
        break
      case Lyric.MetaType.Title:
        result.push(renderItem('ti', item.content))
        break
      case Lyric.MetaType.Singer:
        result.push(renderItem('ar', item.content))
        break
      case Lyric.MetaType.Album:
        result.push(renderItem('al', item.content))
        break
      case Lyric.MetaType.Duration:
        result.push(renderItem('length', formatTime(item.content)))
        break
    }
  }

  return result
}
