export class Time {
  /**
   * Start time in milliseconds.
   */
  start: number = 0

  /**
   * End time in milliseconds.
   */
  end: number = 0

  /**
   * Duration in milliseconds, derived from end minus start.
   */
  get duration(): number {
    return this.end - this.start
  }
}
