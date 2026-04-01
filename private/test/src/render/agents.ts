import { Lyric } from 'music-lyric-kit'

import { esc, getAgentColor } from '../utils'

export const renderAgents = (agents: Lyric.Agent[]): string => {
  if (agents.length === 0) return ''

  const tags = agents.map((agent, i) => {
    const color = getAgentColor(i)
    return `<span class="agent-tag"><span class="agent-dot" style="background:${color}"></span>${esc(agent.name)}<span class="agent-count">${agent.count} lines</span></span>`
  })

  return `
    <div class="result-section">
      <div class="section-title">Agents</div>
      <div class="agent-list">${tags.join('')}</div>
    </div>
  `
}
