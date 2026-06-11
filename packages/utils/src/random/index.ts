/**
 * Generate a random hex string.
 * Uses crypto.getRandomValues when available, otherwise falls back to Math.random.
 * @param length number of random bytes to generate, the returned string length is length * 2.
 */
export const createRandomHex = (length: number = 8) => {
  const bytes = new Uint8Array(length)

  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    crypto.getRandomValues(bytes)
  } else {
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256)
    }
  }

  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
