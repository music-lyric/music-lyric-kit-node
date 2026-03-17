export const createHash = (str: string): string => {
  let hash = 0

  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }

  return (hash >>> 0).toString(16).padStart(8, '0').toUpperCase()
}
