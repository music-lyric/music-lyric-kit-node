import { Lyric } from 'music-lyric-kit'

import { esc, formatDuration } from '../utils'

export const renderMetas = (metas: Lyric.Meta[]): string => {
  if (metas.length === 0) return ''

  const tags = metas.map((meta) => {
    let label = meta.type
    let value = ''

    switch (meta.type) {
      case Lyric.MetaType.Title:
      case Lyric.MetaType.Singer:
      case Lyric.MetaType.Album:
        value = esc(String(meta.content))
        break
      case Lyric.MetaType.Duration:
        value = formatDuration(meta.content as number)
        break
      case Lyric.MetaType.Offset:
        value = `${meta.content}ms`
        break
      case Lyric.MetaType.Creator: {
        const c = meta.content as { role: string; name: string[] }
        label = c.role || 'Creator'
        value = esc(c.name.join(', '))
        break
      }
      default:
        value = esc(String(meta.content))
    }

    return `<span class="meta-tag"><span class="meta-label">${esc(label)}</span><span class="meta-value">${value}</span></span>`
  })

  return `
    <div class="result-section">
      <div class="section-title">Metadata</div>
      <div class="meta-grid">${tags.join('')}</div>
    </div>
  `
}
