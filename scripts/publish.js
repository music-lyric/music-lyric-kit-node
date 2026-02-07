// @ts-check

import { exec } from './utils.js'
import { rootVersion, targets } from './target.js'

const main = async () => {
  let releaseTag = null
  if (rootVersion.includes('alpha')) {
    releaseTag = 'alpha'
  } else if (rootVersion.includes('beta')) {
    releaseTag = 'beta'
  }

  for (const target of targets) {
    try {
      console.log(`try publish for ${target.id}`)

      const args = ['publish', '--no-git-checks', '--access', 'public', ...(releaseTag ? ['--tag', releaseTag] : [])]
      await exec('pnpm', args, {
        stdio: 'inherit',
        cwd: target.root,
      })

      console.log(`publish success for ${target.id}`)
    } catch (err) {
      console.log(`publish for ${target.id}`)
    }
  }
}

main()
