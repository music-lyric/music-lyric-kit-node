// @ts-check

export * from './git.js'

export * from './parser.js'

/**
 * @param {string} content
 */
export const formatResult = (content) => {
  return content.replace(/(\n\s*){2,}/g, '\n\n').trim() + '\n'
}
