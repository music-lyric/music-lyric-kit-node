export class Time {
  /**
   * Start time in milliseconds.
   */
  start: number

  /**
   * End time in milliseconds.
   */
  end: number

  constructor(start = 0, end = 0) {
    this.start = start
    this.end = end
  }

  /**
   * Duration in milliseconds, derived from end minus start.
   */
  get duration(): number {
    return this.end - this.start
  }
}
