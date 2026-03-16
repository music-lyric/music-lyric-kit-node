import type { MatchOptions } from '@root/utils/match'

export interface CleanConfig extends MatchOptions {}

export const DEFAULT_CONFIG: CleanConfig = {
  mode: 'fuzzy',
  fuzzy: {},
  exact: {
    check: 50,
  },
  rule: {
    useDefault: true,
    custom: [],
  },
}
