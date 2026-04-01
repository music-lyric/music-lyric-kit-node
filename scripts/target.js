// @ts-check

import { readdirSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'

import { require } from './utils.js'

export const root = process.cwd()

export const rootVersion = require(join(process.cwd(), 'package.json')).version

/**
 * @param {string} dir
 */
const handleFindTarget = (dir) => {
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

  const pkg = require(join(dir, 'package.json'))
  if (pkg.private) {
    return null
  }

  const name = pkg.name
  const version = pkg.version
  const id = name === 'music-lyric-kit' ? 'main' : name.replace('@music-lyric-kit/', '')

  return {
    id,
    name,
    version,
    root: dir,
  }
}

/**
 * @param {string} root
 */
const handleFindTargets = (root) => {
  return readdirSync(root)
    .map((item) => {
      const path = join(root, item)

      return handleFindTarget(path)
    })
    .filter((item) => !!item)
}

const packagesRoot = join(root, 'packages')
const pluginsRoot = join(root, 'plugins')

export const targets = [...handleFindTargets(packagesRoot), ...handleFindTargets(pluginsRoot)].filter((item) => !!item)
