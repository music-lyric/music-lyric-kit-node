import { Info } from '@music-lyric-kit/lyric'

import type { BaseContext, BasePlugin as _BasePlugin } from '@root/plugin'

export interface GeneratorParams {
  content: Info
}

export class GeneratorContext implements BaseContext {
  private readonly current: {
    params: GeneratorParams
    result: string | Uint8Array | Object
  }

  constructor(params: GeneratorParams) {
    this.current = {
      params,
      result: '',
    }
  }

  get params() {
    return this.current.params
  }

  get result() {
    return this.current.result
  }

  set result(content: string | Uint8Array | Object) {
    this.current.result = content
  }
}
