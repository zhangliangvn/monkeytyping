/**
 * Combo escalation for game juice. A new tier every `tierEvery` cleared words,
 * capped at `maxTier` so the audio pitch never gets shrill for children
 * (spec §3.3). A typo resets the streak to zero.
 */
export interface ComboOpts {
  maxTier?: number
  tierEvery?: number
}

export class Combo {
  readonly maxTier: number
  private readonly tierEvery: number
  private _count = 0

  constructor(opts: ComboOpts = {}) {
    this.maxTier = opts.maxTier ?? 6
    this.tierEvery = opts.tierEvery ?? 3
  }

  wordCleared(): void { this._count += 1 }
  typo(): void { this._count = 0 }

  get count(): number { return this._count }

  /** 0-based escalation tier, capped at maxTier. */
  get tier(): number {
    return Math.min(this.maxTier, Math.floor(this._count / this.tierEvery))
  }

  /** Audio pitch multiplier (1.06^tier ≈ one semitone/tier), capped by tier. */
  pitchMultiplier(): number {
    return Math.pow(1.06, this.tier)
  }
}
