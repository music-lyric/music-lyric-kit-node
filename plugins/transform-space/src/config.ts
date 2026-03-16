import type { InsertTextSpaceTypes } from './constants'
import { INSERT_TEXT_SPACE_TYPES } from './constants'

export interface SpaceConfig {
  types: InsertTextSpaceTypes[]
}

export const DEFAULT_CONFIG: SpaceConfig = {
  types: [INSERT_TEXT_SPACE_TYPES.ALL],
}
