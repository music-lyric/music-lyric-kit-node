import type { GeneratorResult } from './interface'

import { GeneratorPlugin, GeneratorStage, GeneratorContext } from '@music-lyric-kit/core'

import { exportLines } from './line'
import { exportMeta } from './meta'

export class Generator extends GeneratorPlugin {
  override get id() {
    return 'LRC-GENERATOR'
  }

  override get name() {
    return 'LRC-GENERATOR'
  }

  override get stage() {
    return GeneratorStage.Generate
  }

  override get format() {
    return 'lrc'
  }

  override check(ctx: GeneratorContext) {
    return true
  }

  override exec(ctx: GeneratorContext) {
    const { original, syllable, translate, roman } = exportLines(ctx.params.content)

    const meta = exportMeta(ctx.params.content)

    const targetOriginal = [meta.join('\n'), '\n', '\n', original.join('\n')]
    const targetSyllable = [meta.join('\n'), '\n', '\n', syllable.join('\n')]

    const result: GeneratorResult = {
      original: targetOriginal.join('').trim(),
      syllable: targetSyllable.join('\n').trim(),
      translate: translate.join('\n').trim(),
      roman: roman.join('\n').trim(),
    }
    ctx.result = result
  }
}

export type { GeneratorResult }
