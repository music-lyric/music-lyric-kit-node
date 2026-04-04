import { exec } from 'node:child_process'

export interface CommitHash {
  short: string
  full: string
}

export interface ParsedCommit {
  type: string
  scope: string | null
  message: string
}

export interface CommitInfo extends ParsedCommit {
  hash: CommitHash
  author: string
  date: string
  subject: string
  body: string
}

export const runGitCommand = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${error.message}`)
      }
      if (stderr) {
        reject(`stderr: ${stderr}`)
      }
      resolve(stdout)
    })
  })
}

const COMMIT_MESSAGE_REGEXP = /^(feat|fix|chore|docs|revert|refactor|test|release)(\([a-zA-Z0-9-_]+\))?:\s(.*)$/

export const parseCommitMessage = (message: string): ParsedCommit | null => {
  const match = message?.match(COMMIT_MESSAGE_REGEXP)
  if (!match) {
    return null
  }

  return {
    type: match[1],
    scope: match[2] ? match[2].slice(1, -1) : null,
    message: match[3],
  }
}

export const getRepoInfo = async (): Promise<{ owner: string; name: string } | null> => {
  try {
    const remoteUrl = await runGitCommand('git remote get-url origin')
    if (!remoteUrl) {
      return null
    }

    const trimed = remoteUrl.trim()
    if (!trimed) {
      return null
    }

    const regex = /(?:github\.com[:/])(.+?)\/(.+?)(\.git)?$/
    const match = trimed.match(regex)

    if (match) {
      const owner = match[1]
      const name = match[2]
      return { owner, name }
    } else {
      throw new Error('Not a GitHub repository')
    }
  } catch (err) {
    console.error('Error getting repository info:', err)
    return null
  }
}

const COMMIT_BLOCK_REGEXP = /---block---\s*([\s\S]*?)\s*---block---/g

const parseCommitBlocks = (text: string): CommitInfo[] => {
  const commits: CommitInfo[] = []

  let match
  while ((match = COMMIT_BLOCK_REGEXP.exec(text)) !== null) {
    const block = match[1].trim()

    const lines = block.split('\n').map((line) => line.trim())

    const [shortHash, fullHash, author, date, subject, ...bodyLines] = lines
    const body = bodyLines?.join('\n').trim()

    const result = parseCommitMessage(subject)
    if (!result) {
      continue
    }

    const commit: CommitInfo = {
      hash: {
        short: shortHash,
        full: fullHash,
      },
      author,
      date,
      subject,
      body,
      ...result,
    }

    commits.push(commit)
  }

  return commits
}

export const getCommitInfo = async (start: string, end: string = 'HEAD'): Promise<CommitInfo[]> => {
  try {
    const range = !start && end ? `${end}` : start || end ? `${start}..${end}` : ''
    const command = `git log ${range} --pretty=format:"---block---%n %h%n %H%n %an%n %ad%n %s%n %b%n ---block---%n" --date=short`

    const result = await runGitCommand(command)
    const trimed = result?.trim()
    if (!trimed) {
      return []
    }

    return parseCommitBlocks(trimed).filter((item) => !!item)
  } catch (err) {
    console.error('Error getting commit info:', err)
    return []
  }
}

export const getLatestTag = async (): Promise<string | null> => {
  try {
    const command = 'git describe --tags --abbrev=0'

    const tag = await runGitCommand(command)
    if (!tag) {
      return null
    }

    return tag.trim()
  } catch (err) {
    console.error('Error getting the latest tag:', err)
    return null
  }
}

export const getAllTags = async (): Promise<string[]> => {
  try {
    const command = 'git tag'

    const result = await runGitCommand(command)
    if (!result) {
      return []
    }

    return result
      .split('\n')
      .filter((item) => !!item)
      .reverse()
  } catch (err) {
    console.error('Error getting tags:', err)
    return []
  }
}
