/**
 * Resolve to `A` when `X` and `Y` are exactly equal, otherwise to `B`.
 * Used to detect whether a property is writable or readonly.
 */
type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? A : B

/**
 * Collect the writable keys of `T`, excluding readonly fields and getter only accessors.
 */
type WritableKeys<T> = {
  [K in keyof T]-?: IfEquals<{ [Q in K]: T[K] }, { -readonly [Q in K]: T[K] }, K>
}[keyof T]

/**
 * Constructor init shape: every writable field made optional.
 * `AgentItem` / `LineAgent` carry a writable `id`, so it flows in here too.
 */
export type Init<T> = Partial<Pick<T, WritableKeys<T>>>
