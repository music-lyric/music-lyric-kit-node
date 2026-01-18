import type { ValueOf } from '../types'

export const removeTextSpaceAll = (content: string) => {
  return content.replaceAll(/\s+/g, '').trim()
}

export const removeTextSpaceToOne = (content: string) => {
  return content.replaceAll(/[ ]{2,}/g, ' ').trim()
}

export const INSERT_TEXT_SPACE_TYPES = {
  ALL: 'ALL',
  PUNCTUATION: 'PUNCTUATION',
  BRACKET: 'BRACKET',
  QUOTE: 'QUOTE',
  OPERATOR: 'OPERATOR',
  CJK_WITH_ENGLISH_NUMBER: 'CJK_WITH_ENGLISH_NUMBER',
  HYPHEN_SLASH: 'HYPHEN_SLASH',
} as const

export type InsertTextSpaceTypes = ValueOf<typeof INSERT_TEXT_SPACE_TYPES>

const INSERT_TEXT_SPACE_TYPES_VALUE = Object.values(INSERT_TEXT_SPACE_TYPES) as InsertTextSpaceTypes[]

// rules
const CJK_RANGE = '\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff' as const

const ENGLISH_RANGE = 'A-Za-z' as const
const NUMBER_RANGE = '0-9' as const
const SYMBOL_RANGE = '!@#$%^&+\\-=/|<>' as const

const ENGLISH_NUMBER_RANGE = `${ENGLISH_RANGE}${NUMBER_RANGE}` as const

const ALL_RANGE = `${ENGLISH_NUMBER_RANGE}${SYMBOL_RANGE}${CJK_RANGE}` as const

const TRIM_INSIDE_SYMBOLS_RULE = /([<\[\{\("“‘])\s*([^<>\[\]\{\}\(\)"“‘”’]*?)\s*([>\]\}\)"”’])/gu

const HYPHEN_RULE = new RegExp(`([${ENGLISH_NUMBER_RANGE}${CJK_RANGE}])(-)([${ENGLISH_NUMBER_RANGE}${CJK_RANGE}])`, 'gu')
const SLASH_RULE = new RegExp(`([${ENGLISH_NUMBER_RANGE}${CJK_RANGE}])(/)([${ENGLISH_NUMBER_RANGE}${CJK_RANGE}])`, 'gu')
const HYPHEN_EDGE_RULE = new RegExp(`(\\s|^)(-)(?=[${ENGLISH_NUMBER_RANGE}${CJK_RANGE}])|([${ENGLISH_NUMBER_RANGE}${CJK_RANGE}])(-)(?=\\s|$)`, 'gu')

const CJK_WITH_EN_RULE = new RegExp(`([${CJK_RANGE}])([${ENGLISH_NUMBER_RANGE}])`, 'gu')
const EN_WITH_CJK_RULE = new RegExp(`([${ENGLISH_NUMBER_RANGE}])([${CJK_RANGE}])`, 'gu')

const QUOTE_BEFORE_RULE = new RegExp(`([${CJK_RANGE}${ENGLISH_NUMBER_RANGE}])(["\`“‘])`, 'gu')
const QUOTE_AFTER_RULE = new RegExp(`(["\`”’])([${CJK_RANGE}${ENGLISH_NUMBER_RANGE}])`, 'gu')

const PUNCTUATION_RULE = new RegExp(`([${ALL_RANGE}])([!;,\\?:])(?=[${ALL_RANGE}])`, 'gu')
const OPERATOR_RULE = new RegExp(`([${ALL_RANGE}])([+\\-*/=&])([${ALL_RANGE}])`, 'gu')
const BRACKET_OUTSIDE_BEFORE_RULE = new RegExp(`([${ENGLISH_NUMBER_RANGE}${CJK_RANGE}])([\\[({<])`, 'gu')
const BRACKET_OUTSIDE_AFTER_RULE = new RegExp(`([\\])}>])([${ENGLISH_NUMBER_RANGE}${CJK_RANGE}])`, 'gu')
const BRACKET_INSIDE_OPERATOR_RULE = new RegExp(`([${ENGLISH_NUMBER_RANGE}${CJK_RANGE}])([+\\-*/=&])([${ENGLISH_NUMBER_RANGE}${CJK_RANGE}])`, 'gu')

const trimInsideSymbols = (text: string): string => {
  return text.replace(TRIM_INSIDE_SYMBOLS_RULE, (_, left, inner, right) => {
    return `${left.trim()}${inner.trim()}${right.trim()}`
  })
}

const processBracketContent = (content: string): string => {
  if (!content) return content
  return content.replace(BRACKET_INSIDE_OPERATOR_RULE, '$1 $2 $3').replace(HYPHEN_RULE, '$1 $2 $3').replace(SLASH_RULE, '$1 $2 $3')
}

const applyPunctuationRules = (text: string) => {
  return text.replace(PUNCTUATION_RULE, '$1$2 ')
}

const applyQuoteRules = (text: string) => {
  return text.replace(QUOTE_BEFORE_RULE, '$1 $2').replace(QUOTE_AFTER_RULE, '$1 $2')
}

const applyBracketRules = (text: string) => {
  let result = text

  result = result.replace(BRACKET_OUTSIDE_BEFORE_RULE, '$1 $2')
  result = result.replace(BRACKET_OUTSIDE_AFTER_RULE, '$1 $2')
  result = result.replace(TRIM_INSIDE_SYMBOLS_RULE, (_, l, inner, r) => l + processBracketContent(inner.trim()) + r)

  return result
}

const applyOperatorRules = (text: string) => {
  return text.replace(OPERATOR_RULE, '$1 $2 $3')
}

const applyHyphenSlashRules = (text: string) => {
  const result = text.replace(HYPHEN_RULE, '$1 $2 $3').replace(SLASH_RULE, '$1 $2 $3')
  return result.replace(HYPHEN_EDGE_RULE, (m, g1, g2, g3, g4) => {
    if (g1 !== undefined) {
      return `${g1}${g2} `
    }
    return `${g3} ${g4}`
  })
}

const applyCjkWithEnglishNumber = (text: string) => {
  return text.replace(CJK_WITH_EN_RULE, '$1 $2').replace(EN_WITH_CJK_RULE, '$1 $2')
}

const applyMultipleSpace = (text: string) => {
  return removeTextSpaceToOne(text)
}

const handleProcessTypes = (types?: InsertTextSpaceTypes[]) => {
  const target = types || [INSERT_TEXT_SPACE_TYPES.ALL]
  return new Set<InsertTextSpaceTypes>(target.includes(INSERT_TEXT_SPACE_TYPES.ALL) ? INSERT_TEXT_SPACE_TYPES_VALUE : target)
}

export const insertTextSpace = (text: string, types?: InsertTextSpaceTypes[]) => {
  if (typeof text !== 'string' || text.trim().length === 0) return text

  const processTypes = handleProcessTypes(types)

  let result = text

  if (processTypes.has(INSERT_TEXT_SPACE_TYPES.BRACKET)) {
    result = applyBracketRules(result)
  }
  if (processTypes.has(INSERT_TEXT_SPACE_TYPES.QUOTE)) {
    result = applyQuoteRules(result)
  }
  if (processTypes.has(INSERT_TEXT_SPACE_TYPES.PUNCTUATION)) {
    result = applyPunctuationRules(result)
  }
  if (processTypes.has(INSERT_TEXT_SPACE_TYPES.OPERATOR)) {
    result = applyOperatorRules(result)
  }
  if (processTypes.has(INSERT_TEXT_SPACE_TYPES.HYPHEN_SLASH)) {
    result = applyHyphenSlashRules(result)
  }
  if (processTypes.has(INSERT_TEXT_SPACE_TYPES.CJK_WITH_ENGLISH_NUMBER)) {
    result = applyCjkWithEnglishNumber(result)
  }

  result = applyMultipleSpace(result)

  result = trimInsideSymbols(result)

  result = result.trim()

  return result
}

export const insertSpaceBatch = (list: string[], types?: InsertTextSpaceTypes[]) => {
  return list.length ? list.map((item) => insertTextSpace(item, types)) : list
}

interface WordElementInfo {
  original: string
  nonSpaceChars: string
  startIndex: number
  endIndex: number
  isSpaceOnly: boolean
}

export const insertTextSpaceWithWords = (array: string[], types?: InsertTextSpaceTypes[]): string[] => {
  if (!array || array.length === 0) return array

  const full = array.join('')
  const processed = insertTextSpace(full, types)

  const infos: WordElementInfo[] = []

  let currentIndex = 0
  for (const element of array) {
    const nonSpaceChars = element.replace(/\s/g, '')
    const isSpaceOnly = nonSpaceChars.length === 0

    if (!isSpaceOnly) {
      infos.push({
        original: element,
        nonSpaceChars,
        startIndex: currentIndex,
        endIndex: currentIndex + element.length - 1,
        isSpaceOnly,
      })
    }

    currentIndex += element.length
  }

  const result: string[] = []
  let processedIndex = 0
  let spaceCount = 0

  while (processedIndex < processed.length && processed[processedIndex] === ' ') {
    result.push(' ')
    processedIndex++
  }

  for (const info of infos) {
    let matchStart = -1
    let matchEnd = -1
    let searchIndex = processedIndex
    let originalCharIndex = 0

    while (searchIndex < processed.length && originalCharIndex < info.nonSpaceChars.length) {
      if (processed[searchIndex] === ' ') {
        searchIndex++
        continue
      }

      if (processed[searchIndex] === info.nonSpaceChars[originalCharIndex]) {
        if (originalCharIndex === 0) {
          matchStart = searchIndex
        }

        originalCharIndex++
        searchIndex++

        if (originalCharIndex === info.nonSpaceChars.length) {
          matchEnd = searchIndex - 1
          break
        }
      } else {
        if (matchStart !== -1) {
          originalCharIndex = 0
          matchStart = -1
        } else {
          searchIndex++
        }
      }
    }

    if (matchStart === -1 || matchEnd === -1) {
      result.push(info.nonSpaceChars)
      processedIndex += info.original.length
    } else {
      const matchedText = processed.substring(matchStart, matchEnd + 1)

      if (matchStart > processedIndex) {
        for (let i = processedIndex; i < matchStart; i++) {
          if (processed[i] === ' ') {
            result.push(' ')
          }
        }
      }

      result.push(matchedText)
      processedIndex = matchEnd + 1

      while (processedIndex < processed.length && processed[processedIndex] === ' ') {
        result.push(' ')
        processedIndex++
      }
    }
  }

  while (processedIndex < processed.length) {
    if (processed[processedIndex] === ' ') {
      result.push(' ')
    }
    processedIndex++
  }

  return result
}
