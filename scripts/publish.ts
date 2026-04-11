import { exec, sleep } from './utils'
import { mainVersion, targets } from './target'

const main = async () => {
  let releaseTag: string | null = null
  if (mainVersion.includes('alpha')) {
    releaseTag = 'alpha'
  } else if (mainVersion.includes('beta')) {
    releaseTag = 'beta'
  }

  for (const target of targets) {
    try {
      console.log(`publish id=${target.id}`)

      const args = ['publish', '--no-git-checks', '--access', 'public', ...(releaseTag ? ['--tag', releaseTag] : [])]
      await exec('pnpm', args, {
        stdio: 'inherit',
        cwd: target.root,
      })

      console.log(`publish success id=${target.id}`)
    } catch (err) {
      console.log(`publish failed id=${target.id} err=${err}`)
    } finally {
      await sleep(3000)
    }
  }
}

main()
