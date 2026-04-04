import { spawn, type SpawnOptions } from 'node:child_process'

export const exec = (command: string, args: string[], options?: SpawnOptions) => {
  return new Promise<{ ok: boolean; code: number | null; stderr: string; stdout: string }>((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      ...options,
      shell: process.platform === 'win32',
    })

    const stderrChunks: Buffer[] = []
    child.stderr?.on('data', (chunk) => {
      stderrChunks.push(chunk)
    })

    const stdoutChunks: Buffer[] = []
    child.stdout?.on('data', (chunk) => {
      stdoutChunks.push(chunk)
    })

    child.on('error', (error) => {
      reject(error)
    })

    child.on('exit', (code) => {
      const ok = code === 0
      const stderr = Buffer.concat(stderrChunks).toString().trim()
      const stdout = Buffer.concat(stdoutChunks).toString().trim()

      if (ok) {
        resolve({ ok, code, stderr, stdout })
      } else {
        reject(new Error(`Failed to execute command=${command} args=${args.join(' ')} err=${stderr}`))
      }
    })
  })
}

export const formatDate = (date: string | number | Date, format: string = 'YYYY-MM-DD'): string => {
  const d = new Date(date)

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')

  return format.replace('YYYY', String(year)).replace('MM', month).replace('DD', day)
}
