import { Info } from '@music-lyric-kit/lyric'

import type { BaseContext } from '@root/plugin'

export type GeneratorResult = string | Object | Uint8Array

export interface GeneratorParams {
  content: Info
}

export class GeneratorContext implements BaseContext {
  private readonly current: {
    params: GeneratorParams
    result: GeneratorResult
  }

  constructor(params: GeneratorParams, init: GeneratorResult) {
    this.current = {
      params,
      result: init,
    }
  }

  get params(): GeneratorParams {
    return this.current.params
  }

  get result(): GeneratorResult {
    return this.current.result
  }

  set result(value: GeneratorResult) {
    this.result = value
  }
}
