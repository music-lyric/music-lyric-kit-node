import { Format, Plugin } from './interface'

export class FormatLoader {
  private current: Map<string, Format> = new Map()

  add(format: string, content: Format, overwrite: boolean = false) {
    const has = this.current.has(format)
    if (has && !overwrite) {
      return
    }
    this.current.set(format, content)
  }

  get(format: string) {
    return this.current.get(format)
  }

  delete(format: string) {
    return this.current.delete(format)
  }

  clear() {
    return this.current.clear()
  }

  keys() {
    return this.current.keys()
  }

  updatePlugin(format: string, plugins: Plugin[]) {
    const now = this.current.get(format)
    if (!now) {
      return false
    }

    now.plugins = plugins
    this.current.set(format, now)

    return true
  }
}

export class CommonLoader {
  before: Plugin[] = []

  after: Plugin[] = []
}
