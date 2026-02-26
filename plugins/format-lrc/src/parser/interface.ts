export interface ParserContentObject {
  original: string
  translate?: string
  roman?: string
  syllable?: string
}

export type ParserContentType = string | ParserContentObject
