import { mergeObject, cloneObjectDeep } from '@root/object'

type Listener<Full> = (newConfig: Full) => void

export class ConfigManager<Full, Init> {
  private def: Full
  private now: Full

  private listeners: Listener<Full>[] = []

  constructor(def: Full, init?: Init) {
    this.def = def
    this.now = cloneObjectDeep(def)
    if (init) {
      this.now = mergeObject(this.now, init)
      this.emit()
    }
  }

  update(target: Init) {
    if (!target) {
      return
    }
    this.now = mergeObject(this.now, target)
    this.emit()
  }

  reset() {
    this.now = cloneObjectDeep(this.def)
    this.emit()
  }

  get current() {
    return this.now
  }

  on(listener: Listener<Full>) {
    this.listeners.push(listener)
  }

  off(listener: Listener<Full>) {
    this.listeners = this.listeners.filter((l) => l !== listener)
  }

  private emit() {
    for (const listener of this.listeners) {
      listener(this.now)
    }
  }
}
