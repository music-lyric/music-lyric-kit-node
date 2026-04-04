export * from './git'

export * from './parser'

export const formatResult = (content: string): string => {
  return content.replace(/(\n\s*){2,}/g, '\n\n').trim() + '\n'
}
