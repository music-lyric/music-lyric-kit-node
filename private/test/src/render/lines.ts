import { Lyric } from 'music-lyric-kit'

import { esc, formatTime, getAgentColor } from '../utils'

const renderWords = (words: Lyric.Word[]): string => {
  return words
    .map((word) => {
      if (word.type === Lyric.WordType.Space) {
        return ' '.repeat((word as Lyric.WordSpace).count)
      }
      const w = word as Lyric.WordNormal
      const hasTime = w.time.start > 0 || w.time.end > 0
      const stressClass = w.config.stress ? ' stress' : ''
      const timeClass = hasTime ? ' has-time' : ''
      const title = hasTime ? ` title="${formatTime(w.time.start)} ~ ${formatTime(w.time.end)}"` : ''
      return `<span class="line-word${timeClass}${stressClass}"${title}>${esc(w.content)}</span>`
    })
    .join('')
}

const renderExtended = (extended: Lyric.Extended[]): string => {
  if (extended.length === 0) return ''

  const items = extended.map((ext) => {
    const typeClass = ext.type === Lyric.ExtendedType.Translate ? 'translate' : ext.type === Lyric.ExtendedType.Roman ? 'roman' : ''
    const prefix = ext.type === Lyric.ExtendedType.Translate ? '' : ext.type === Lyric.ExtendedType.Roman ? '' : `[${ext.type}] `
    return `<span class="extended-item ${typeClass}">${esc(prefix + ext.content)}</span>`
  })

  return `<div class="line-extended">${items.join('')}</div>`
}

const renderNormalLine = (
  line: Lyric.LineNormal,
  agents: Lyric.Agent[],
  isBg = false,
): string => {
  const timeStr = `${formatTime(line.time.start)} ~ ${formatTime(line.time.end)}`

  let agentBadge = ''
  if (line.agent) {
    const agentIndex = agents.findIndex((a) => a.id === line.agent!.id)
    const agent = agents[agentIndex]
    if (agent) {
      const color = getAgentColor(agentIndex)
      agentBadge = `<span class="line-agent-badge" style="background:${color}">${esc(agent.name)}</span>`
    }
  }

  const wordsHtml = renderWords(line.content.words)
  const extendedHtml = renderExtended(line.content.extended)

  let bgHtml = ''
  if (!isBg && line.background && line.background.length > 0) {
    const bgLines = line.background
      .map((bg) => renderNormalLine(bg, agents, true))
      .join('')
    bgHtml = `<div class="line-background"><div class="bg-label">Background</div>${bgLines}</div>`
  }

  return `
    <div class="line-row">
      <span class="line-time">${timeStr}</span>
      ${agentBadge}
      <div class="line-content">
        <div class="line-words">${wordsHtml}</div>
        ${extendedHtml}
      </div>
    </div>
    ${bgHtml}
  `
}

export const renderLines = (lines: Lyric.Line[], agents: Lyric.Agent[]): string => {
  if (lines.length === 0) return '<div class="result-empty">No lyric lines</div>'

  const items = lines.map((line) => {
    if (line.type === Lyric.LineType.Interlude) {
      const interlude = line as Lyric.LineInterlude
      const timeStr = `${formatTime(interlude.time.start)} ~ ${formatTime(interlude.time.end)}`
      return `
        <div class="line-interlude">
          <span class="line-time">${timeStr}</span>
          <span class="interlude-label">Interlude</span>
          <span class="interlude-dots"></span>
        </div>
      `
    }
    return renderNormalLine(line as Lyric.LineNormal, agents)
  })

  return `
    <div class="result-section">
      <div class="section-title">Lines <span style="font-weight:400;color:#bbb">(${lines.length})</span></div>
      <div class="lines-list">${items.join('')}</div>
    </div>
  `
}
