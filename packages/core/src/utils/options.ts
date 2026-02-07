import { mergeObject, cloneObjectDeep } from '@music-lyric-kit/utils'

export class OptionsManager<Full, Init> {
  private def: Full
  private now: Full

  constructor(def: Full, init?: Init) {
    this.def = def
    this.now = cloneObjectDeep(def)
    if (init) {
      this.now = mergeObject(this.now, init)
    }
  }

  update(target: Init) {
    if (!target) {
      return
    }
    this.now = mergeObject(this.now, target)
  }

  reset() {
    this.now = cloneObjectDeep(this.def)
  }

  get current() {
    return this.now
  }
}
