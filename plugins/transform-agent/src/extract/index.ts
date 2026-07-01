import type { DeepPartial } from '@music-lyric-kit/utils'
import type { ExtractConfig } from './config'

import { DEFAULT_CONFIG } from './config'

import { ConfigManager } from '@music-lyric-kit/utils'
import { ParserPlugin, ParserContext, PluginStage } from '@music-lyric-kit/core'
import { Lyric } from '@music-lyric-kit/lyric'

import { createHash, isClockTimeColon } from './utils'

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

    const agentMap = new Map<string, Lyric.AgentItem>()
    for (const item of ctx.result.agents) {
      agentMap.set(item.id, item)
    }

    let currentId: string | null = null
    for (const line of lines) {
      if (!Lyric.isLineNormal(line)) {
        currentId = null
        newLines.push(line)
        continue
      }

      const body = line.body.value
      const content = body.content ?? (body.content = Lyric.makeLineContent())
      const words = content.words
      const trimmed = Lyric.getLineText(line).trim()

      if (!trimmed) {
        currentId = null
        newLines.push(line)
        continue
      }

      // a clock time like 10:30 is not an agent separator; judged from the full line text since syllable splitting can scatter the digits and colon across words.
      const colonPos = trimmed.search(/[:：]/u)
      if (colonPos !== -1 && isClockTimeColon(trimmed.slice(0, colonPos), trimmed.slice(colonPos + 1))) {
        if (currentId) {
          content.agent = Lyric.makeLineAgent({ id: currentId })
        }
        newLines.push(line)
        continue
      }

      const colonWordIndex = words.findIndex((item) => {
        if (!Lyric.isWordNormal(item)) {
          return false
        }

        const text = item.body.value.content.trim()
        return text.includes('：') || text.includes(':')
      })

      if (colonWordIndex !== -1) {
        const colonItem = words[colonWordIndex]
        if (!Lyric.isWordNormal(colonItem)) {
          newLines.push(line)
          continue
        }
        const colonWord = colonItem.body.value
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

        const nameParts = words.slice(0, colonWordIndex).map((item) => Lyric.getWordText(item))

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
            content.words = words.slice(colonWordIndex)
          } else {
            content.words = words.slice(colonWordIndex + 1)
          }
        }

        const id = createHash(name)
        currentId = id

        if (!agentMap.has(id)) {
          agentMap.set(id, Lyric.makeAgentItem({ id, names: [name] }))
        } else {
          const exist = agentMap.get(id)!
          if (!exist.names.includes(name)) {
            exist.names.push(name)
          }
        }

        if (!content.words.length) {
          continue
        }
      } else {
        if (!currentId) {
          newLines.push(line)
          continue
        }
      }

      content.agent = Lyric.makeLineAgent({ id: currentId })
      newLines.push(line)
    }

    ctx.result.lines = newLines
    ctx.result.agents = [...agentMap.values()]

    ctx.syncLineTimeWithWord()
  }
}

export type { ExtractConfig }
