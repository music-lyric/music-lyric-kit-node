export class Time {
  start: number = 0

  end: number = 0

  get duration(): number {
    return this.end - this.start
  }

  toJSON() {
    return {
      start: this.start,
      end: this.end,
      duration: this.duration,
    }
  }
}
