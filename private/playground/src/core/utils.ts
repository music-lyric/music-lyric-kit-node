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

export const getAgentColor = (index: number): string => {
  return AGENT_COLORS[index % AGENT_COLORS.length]
}

/**
 * Format a byte count into a human-readable size string with a B/KB/MB/GB unit.
 */
export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB']
  let value = bytes
  let index = -1
  do {
    value /= 1024
    index++
  } while (value >= 1024 && index < units.length - 1)
  return `${value.toFixed(2)} ${units[index]}`
}
