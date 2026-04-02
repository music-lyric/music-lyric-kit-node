export interface ParserContentObject {
  original: string
  translate?: string
  roman?: string
}

export type ParserContentType = string | ParserContentObject
