import { Lyric } from 'music-lyric-kit'

import { renderMetas } from './metas'
import { renderAgents } from './agents'
import { renderLines } from './lines'

export const renderResult = (result: Lyric.Info): string => {
  const badge = document.getElementById('result-type-badge')!
  badge.textContent = `${result.type} / v${result.version}`
  badge.style.display = ''

  return `
    ${renderMetas(result.metas)}
    ${renderAgents(result.agents)}
    ${renderLines(result.lines, result.agents)}
  `
}
