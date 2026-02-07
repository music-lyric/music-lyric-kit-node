export interface ContentTypeObject {
  original: string
  translate?: string
  roman?: string
  syllable?: string
}

export type ContentType = string | ContentTypeObject
