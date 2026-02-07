export interface BaseContext {
  params: any

  result: any
}

export interface BasePlugin<Context extends BaseContext = BaseContext> {
  meta: {
    name: string
    priority?: number
  }

  exec: (ctx: Context) => void
}
