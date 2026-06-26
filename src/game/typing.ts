/**
 * Per-target typing state machine. Tracks the caret through one word/letter.
 *
 * Monkeytype convention: a wrong key flags the error in place and does NOT
 * advance the caret, so the learner sees exactly where the mistake is.
 */
export interface KeyResult {
  correct: boolean
  completed: boolean
  index: number
  expected: string
}

export class TypingSession {
  private i = 0
  constructor(public readonly text: string) {}

  get index(): number { return this.i }
  get done(): boolean { return this.i >= this.text.length }
  get typed(): string { return this.text.slice(0, this.i) }

  reset(): void { this.i = 0 }

  press(ch: string): KeyResult {
    if (this.done) return { correct: false, completed: true, index: this.i, expected: '' }
    const expected = this.text[this.i]!
    if (ch === expected) {
      this.i += 1
      return { correct: true, completed: this.done, index: this.i, expected }
    }
    return { correct: false, completed: false, index: this.i, expected }
  }
}
