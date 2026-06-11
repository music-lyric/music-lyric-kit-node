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

/**
 * Run a git command and resolve with its stdout.
 */
export const runGitCommand = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, { maxBuffer: 64 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        return reject(new Error(`failed: ${command}\n${error.message}${stderr ? `\nstderr: ${stderr}` : ''}`))
      }
      resolve(stdout)
    })
  })
}

const COMMIT_MESSAGE_REGEXP = /^(feat|fix|perf|chore|docs|revert|refactor|test|release)(\([a-zA-Z0-9-_]+\))?:\s(.*)$/

/**
 * Parse a commit subject into type, scope and message.
 */
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

/**
 * Resolve the GitHub repo owner and name from the origin remote url.
 */
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

/**
 * Parse the NUL-separated git log output into commit records.
 */
const parseCommitRecords = (text: string): CommitInfo[] => {
  const commits: CommitInfo[] = []

  // -z separates commits with NUL and %n separates fields, body is collected via rest spread
  const records = text.split('\0').filter((r) => r.length > 0)

  for (const record of records) {
    const lines = record.split('\n')
    const [shortHash, fullHash, author, date, subject, ...bodyLines] = lines
    if (!shortHash || !subject) {
      continue
    }

    const parsed = parseCommitMessage(subject)
    if (!parsed) {
      continue
    }

    commits.push({
      hash: { short: shortHash, full: fullHash ?? '' },
      author: author ?? '',
      date: date ?? '',
      subject,
      body: bodyLines.join('\n').trim(),
      ...parsed,
    })
  }

  return commits
}

/**
 * Get commit info for the given range.
 */
export const getCommitInfo = async (start: string, end: string = 'HEAD'): Promise<CommitInfo[]> => {
  try {
    const range = !start && end ? `${end}` : start || end ? `${start}..${end}` : ''
    const command = `git log ${range} -z --pretty=format:"%h%n%H%n%an%n%ad%n%s%n%b" --date=short`

    const result = await runGitCommand(command)
    if (!result?.length) {
      return []
    }

    return parseCommitRecords(result)
  } catch (err) {
    console.error('Error getting commit info:', err)
    return []
  }
}

/**
 * Get the most recent tag.
 */
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

/**
 * Get all tags sorted by version number in descending order.
 */
export const getAllTags = async (): Promise<string[]> => {
  try {
    // Sort by version number (descending), so v0.10.0 correctly outranks v0.9.0.
    const command = 'git tag --sort=-version:refname'

    const result = await runGitCommand(command)
    if (!result) {
      return []
    }

    return result.split('\n').filter((item) => !!item)
  } catch (err) {
    console.error('Error getting tags:', err)
    return []
  }
}
