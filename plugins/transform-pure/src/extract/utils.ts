export const extractCreator = (line: string): [string, string] | null => {
  if (!line) {
    return null
  }

  const enColonIdx = line.indexOf(':')
  const cnColonIdx = line.indexOf('：')

  if (enColonIdx === -1 && cnColonIdx === -1) {
    return null
  }

  let splitIdx = -1
  if (enColonIdx !== -1 && cnColonIdx !== -1) {
    splitIdx = Math.min(enColonIdx, cnColonIdx)
  } else {
    splitIdx = enColonIdx !== -1 ? enColonIdx : cnColonIdx
  }

  const role = line.substring(0, splitIdx).trim()
  const name = line.substring(splitIdx + 1).trim()

  if (!role) {
    return null
  }

  return [role, name]
}

export const splitNameWithRule = (name: string, rule: string | RegExp) => {
  return name
    .split(rule)
    .map((item) => item.trim())
    .filter((item) => !!item)
}
