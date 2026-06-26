/**
 * Accuracy + WPM tracking. Accuracy-first by design (spec §2.5): WPM is
 * informational; accuracy is what gates progression elsewhere.
 *
 * WPM uses the standard "5 characters = 1 word" gross formula. Time is passed
 * in (elapsedMs) so the module stays pure/deterministic.
 */
export class Stats {
  private _correct = 0
  private _total = 0

  record(correct: boolean): void {
    this._total += 1
    if (correct) this._correct += 1
  }

  get correct(): number { return this._correct }
  get total(): number { return this._total }

  /** 0..1; 1.0 when no keystrokes recorded yet. */
  get accuracy(): number {
    return this._total === 0 ? 1 : this._correct / this._total
  }

  /** Gross WPM = (correctChars / 5) / minutes. 0 for non-positive elapsed. */
  wpm(elapsedMs: number): number {
    if (elapsedMs <= 0) return 0
    return this._correct / 5 / (elapsedMs / 60_000)
  }

  reset(): void {
    this._correct = 0
    this._total = 0
  }
}
