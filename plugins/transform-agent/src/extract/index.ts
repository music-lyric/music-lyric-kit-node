import type { DeepPartial } from '@music-lyric-kit/utils'
import type { ExtractConfig } from './config'

import { DEFAULT_CONFIG } from './config'

import { ConfigManager } from '@music-lyric-kit/utils'
import { ParserPlugin, ParserContext, PluginStage } from '@music-lyric-kit/core'
import { Lyric } from '@music-lyric-kit/lyric'

import { createHash } from './utils'

export class Extract extends ParserPlugin {
  override config = new ConfigManager<ExtractConfig, DeepPartial<ExtractConfig>>(DEFAULT_CONFIG)

  override get id() {
    return 'TRANSFORM-AGENT-EXTRACT'
  }

  override get stage() {
    return PluginStage.Transform
  }

  override check(ctx: ParserContext) {
    return true
  }

  override exec(ctx: ParserContext) {
    const lines = ctx.result.lines
    if (!lines.length) {
      return
    }

    const newLines: Lyric.Line[] = []

    const agentMap = new Map<string, Lyric.Agent>()
    for (const item of ctx.result.agents) {
      agentMap.set(item.id, item)
    }

    let currentId: string | null = null
    for (const line of lines) {
      if (line.type !== Lyric.LineType.Normal) {
        currentId = null
        newLines.push(line)
        continue
      }

      const words = line.content.words
      const trimmed = line.content.original.trim()

      if (!trimmed) {
        currentId = null
        newLines.push(line)
        continue
      }

      const colonWordIndex = words.findIndex((item) => {
        if (item.type !== Lyric.WordType.Normal) {
          return false
        }

        const text = item.content.trim()
        return text.includes('：') || text.includes(':')
      })

      if (colonWordIndex !== -1) {
        const colonWord = words[colonWordIndex] as Lyric.WordNormal
        const colonText = colonWord.content.trim()

        const colonIndex1 = colonText.indexOf('：')
        const colonIndex2 = colonText.indexOf(':')
        const colonIndex = colonIndex1 !== -1 ? colonIndex1 : colonIndex2
        if (colonIndex === -1) {
          newLines.push(line)
          continue
        }

        const beforeColon = colonText.slice(0, colonIndex)
        const afterColon = colonText.slice(colonIndex + 1).trim()

        const nameParts = words.slice(0, colonWordIndex).map((item) => {
          return item.type === Lyric.WordType.Space ? ' '.repeat(item.count) : item.content
        })

        if (beforeColon) {
          nameParts.push(beforeColon)
        }

        const name = nameParts.join('').trim()

        if (!name) {
          currentId = null
          newLines.push(line)
          continue
        }

        if (this.config.current.replace) {
          if (afterColon) {
            colonWord.content = afterColon
            line.content.words = words.slice(colonWordIndex)
          } else {
            line.content.words = words.slice(colonWordIndex + 1)
          }
        }

        const id = createHash(name)
        currentId = id

        if (!agentMap.has(id)) {
          const agent = new Lyric.Agent()
          agent.id = id
          agent.name = name
          agentMap.set(id, agent)
        } else {
          const exist = agentMap.get(id)!
          if (!exist.name) {
            exist.name = name
          }
        }

        if (!line.content.words.length) {
          continue
        }
      } else {
        if (!currentId) {
          newLines.push(line)
          continue
        }
      }

      const agent = new Lyric.LineAgent()
      agent.id = currentId

      line.agent = agent
      newLines.push(line)
    }

    ctx.result.lines = newLines
    ctx.result.agents = [...agentMap.values()]

    ctx.syncLineTimeWithWord()
  }
}

export type { ExtractConfig }
