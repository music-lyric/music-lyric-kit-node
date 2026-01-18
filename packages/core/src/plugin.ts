export interface BaseContext {
  params: any

  result: any
}

export interface BasePlugin<Context extends BaseContext = BaseContext> {
  name: string

  exec: (ctx: Context) => void
}
