import type { InsertTextSpaceTypes } from './constants'
import { INSERT_TEXT_SPACE_TYPES } from './constants'

export interface TransformSpaceConfig {
  types: InsertTextSpaceTypes[]
}

export const DEFAULT_CONFIG: TransformSpaceConfig = {
  types: [INSERT_TEXT_SPACE_TYPES.ALL],
}
