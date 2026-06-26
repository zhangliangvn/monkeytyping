import { TypingSession } from './typing'
import { Stats } from './stats'
import { Combo } from './combo'

/**
 * Drives one round: a queue of words typed in order, wiring the typing
 * resolver, stats, and combo together and producing a kid-friendly result.
 *
 * Star tiers (spec §2.5): 3★ ≥95%, 2★ ≥85%, 1★ ≥70% accuracy, else 0.
 * The ≥70% floor is the unlock gate kept from the original.
 */
export interface RoundResult {
  accuracy: number
  wpm: number
  maxCombo: number
  cleared: number
  stars: 0 | 1 | 2 | 3
}

export class Round {
  private session: TypingSession
  private stats = new Stats()
  private combo = new Combo()
  private wi = 0
  private _cleared = 0
  private _maxCombo = 0
  private startMs: number | null = null

  constructor(private readonly words: string[]) {
    this.session = new TypingSession(words[0] ?? '')
  }

  get currentWord(): string | undefined { return this.words[this.wi] }
  get finished(): boolean { return this.wi >= this.words.length }

  /** Live accuracy (0..1) so far. */
  get accuracy(): number { return this.stats.accuracy }
  /** Current combo streak (resets to 0 on a typo). */
  get comboCount(): number { return this.combo.count }
  /** Number of words cleared so far. */
  get cleared(): number { return this._cleared }

  /** Caret position within the current word. */
  get caretIndex(): number { return this.session.index }
  /** The already-typed prefix of the current word. */
  get typedPrefix(): string { return this.session.typed }
  /** The next character to press (for the keyboard guide), or undefined. */
  get nextChar(): string | undefined {
    const w = this.currentWord
    return w === undefined ? undefined : w[this.session.index]
  }

  press(ch: string, nowMs: number): { correct: boolean; wordCompleted: boolean } {
    if (this.finished) return { correct: false, wordCompleted: false }
    if (this.startMs === null) this.startMs = nowMs

    const res = this.session.press(ch)
    this.stats.record(res.correct)
    if (!res.correct) this.combo.typo()

    let wordCompleted = false
    if (res.completed) {
      this.combo.wordCleared()
      this._maxCombo = Math.max(this._maxCombo, this.combo.count)
      this._cleared += 1
      this.wi += 1
      wordCompleted = true
      if (!this.finished) this.session = new TypingSession(this.words[this.wi]!)
    }
    return { correct: res.correct, wordCompleted }
  }

  result(nowMs: number): RoundResult {
    const elapsed = this.startMs === null ? 0 : nowMs - this.startMs
    const accuracy = this.stats.accuracy
    const stars: 0 | 1 | 2 | 3 =
      accuracy >= 0.95 ? 3 : accuracy >= 0.85 ? 2 : accuracy >= 0.70 ? 1 : 0
    return {
      accuracy,
      wpm: this.stats.wpm(elapsed),
      maxCombo: this._maxCombo,
      cleared: this._cleared,
      stars,
    }
  }
}
