import { AGENT_COLORS } from './constants'

export const formatTime = (ms: number): string => {
  if (ms <= 0) return '0:00.000'
  const min = Math.floor(ms / 60000)
  const sec = Math.floor((ms % 60000) / 1000)
  const millis = Math.floor(ms % 1000)
  return `${min}:${sec.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`
}

export const formatDuration = (ms: number): string => {
  const min = Math.floor(ms / 60000)
  const sec = Math.floor((ms % 60000) / 1000)
  return `${min}:${sec.toString().padStart(2, '0')}`
}

export const esc = (str: string): string => {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

export const getAgentColor = (index: number): string => {
  return AGENT_COLORS[index % AGENT_COLORS.length]
}
