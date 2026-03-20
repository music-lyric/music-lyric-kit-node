import type { DeepPartial } from '@music-lyric-kit/utils'
import type { Line, WordNormal } from '@music-lyric-kit/lyric'
import type { ExtractConfig } from './config'

import { DEFAULT_CONFIG } from './config'

import { ConfigManager } from '@music-lyric-kit/utils'

import { ParserPlugin, ParserStage, ParserContext } from '@music-lyric-kit/core'
import { LineType, Agent, AgentLine, WordType } from '@music-lyric-kit/lyric'

import { createHash } from './utils'

export class ExtractPlugin extends ParserPlugin {
  override config = new ConfigManager<ExtractConfig, DeepPartial<ExtractConfig>>(DEFAULT_CONFIG)

  override get id() {
    return 'TRANSFORM-AGENT-EXTRACT'
  }

  override get name() {
    return 'TRANSFORM-AGENT-EXTRACT'
  }

  override get stage() {
    return ParserStage.Transform
  }

  override check(ctx: ParserContext) {
    return true
  }

  override exec(ctx: ParserContext) {
    const lines = ctx.result.lines
    if (!lines.length) {
      return
    }

    const newLines: Line[] = []

    const agentMap = new Map<string, Agent>()

    let currentId: string | null = null

    for (const line of lines) {
      if (line.type != LineType.Normal) {
        newLines.push(line)
        continue
      }

      const words = line.content.words

      const trimmed = line.content.original.trim()
      if (!trimmed) {
        newLines.push(line)
        continue
      }

      const colonWordIndex = words.findIndex((item) => {
        if (item.type !== WordType.Normal) {
          return false
        }
        const text = item.content.trim()
        return text.includes('：') || text.includes(':')
      })

      if (colonWordIndex !== -1) {
        const colonWord = words[colonWordIndex] as WordNormal
        const colonText = colonWord.content.trim()

        const colonIndex = Math.max(colonText.indexOf('：'), colonText.indexOf(':'))
        const beforeColon = colonText.slice(0, colonIndex)
        const afterColon = colonText.slice(colonIndex + 1).trim()

        const nameParts = words.slice(0, colonWordIndex).map((item) => (item.type === WordType.Space ? ' '.repeat(item.count) : item.content))
        if (beforeColon) {
          nameParts.push(beforeColon)
        }
        const name = nameParts.join('').trim()

        if (this.config.current.replace) {
          if (afterColon) {
            // ":abc"
            colonWord.content = afterColon
            line.content.words = words.slice(colonWordIndex)
          } else {
            // "abc:" ?? ":"
            line.content.words = words.slice(colonWordIndex + 1)
          }
        }

        const id = createHash(name)
        currentId = id

        if (!agentMap.has(id)) {
          const agent = new Agent()
          agent.id = id
          agent.name = name
          agentMap.set(id, agent)
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

      const agent = new AgentLine()
      agent.id = currentId

      line.agent = agent
      newLines.push(line)
    }

    ctx.result.lines = newLines
    ctx.result.agents = [...ctx.result.agents, ...agentMap.values()]
  }
}

export type { ExtractConfig }
