// @ts-check

import { createRequire } from 'node:module'
import { spawn } from 'node:child_process'

import moment from 'moment'

export const require = createRequire(import.meta.url)

/**
 * @param {string} command
 * @param {Array<string>} args
 * @param {import('node:child_process').SpawnOptions} [options]
 */
export const exec = (command, args, options) => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      ...options,
      shell: process.platform === 'win32',
    })

    /**
     * @type {Buffer[]}
     */
    const stderrChunks = []
    child.stderr?.on('data', (chunk) => {
      stderrChunks.push(chunk)
    })

    /**
     * @type {Buffer[]}
     */
    const stdoutChunks = []
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
        const result = { ok, code, stderr, stdout }
        resolve(result)
      } else {
        reject(new Error(`Failed to execute command=${command} args=${args.join(' ')} err=${stderr}`))
      }
    })
  })
}

/**
 * @param {string | number | Date} date
 * @param {string} format
 */
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  return moment(date).format(format)
}
