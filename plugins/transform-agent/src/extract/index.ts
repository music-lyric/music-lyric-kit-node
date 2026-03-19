import type { DeepPartial } from '@music-lyric-kit/utils'
import type { Line } from '@music-lyric-kit/lyric'
import type { ExtractConfig } from './config'

import { DEFAULT_CONFIG } from './config'

import { ConfigManager } from '@music-lyric-kit/utils'

import { ParserPlugin, ParserStage, ParserContext } from '@music-lyric-kit/core'
import { LineType, Agent, AgentLine } from '@music-lyric-kit/lyric'

import { createHash } from './utils'

const SINGER_LINE_REGEXP = /^(.+?)\s*[:：]\s*(.*)$/

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

      const trimmed = line.content.original.trim()
      if (!trimmed) {
        newLines.push(line)
        continue
      }

      const match = trimmed.match(SINGER_LINE_REGEXP)

      if (match) {
        const name = match[1].trim()
        const content = match[2].trim()

        const id = createHash(name)
        currentId = id

        if (!agentMap.has(id)) {
          const agent = new Agent()
          agent.id = id
          agent.name = name
          agentMap.set(id, agent)
        }

        if (!content) {
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
