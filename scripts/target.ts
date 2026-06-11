import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

export interface Target {
  id: string
  name: string
  version: string
  root: string
  private: boolean
}

export const root = process.cwd()

const handleFindTarget = (dir: string): Target | null => {
  if (!existsSync(dir)) {
    return null
  }
  if (!statSync(dir).isDirectory()) {
    return null
  }

  const pkgPath = join(dir, 'package.json')
  if (!existsSync(pkgPath)) {
    return null
  }

  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))

  const name: string = pkg.name || ''
  const version: string = pkg.version
  const id = name === 'music-lyric-kit' ? 'main' : name.replace('@music-lyric-kit/', '')

  return { id, name, version, root: dir, private: !!pkg.private }
}

const handleFindTargets = (root: string): Target[] => {
  return readdirSync(root)
    .map((item) => handleFindTarget(join(root, item)))
    .filter((item): item is Target => !!item)
}

const mainRoot = join(root, 'main')
const mainPackge = handleFindTarget(mainRoot)
if (!mainPackge) {
  console.log('main package not found')
  process.exit(1)
}

const rootPackage = handleFindTarget(root)
if (!rootPackage) {
  console.log('root package not found')
  process.exit(1)
}

export const rootVersion = rootPackage.version

export const mainVersion = mainPackge.version

export const targets: Target[] = [
  ...handleFindTargets(join(root, 'packages')),
  ...handleFindTargets(join(root, 'plugins')),
  ...handleFindTargets(join(root, 'private')),
  mainPackge,
]
