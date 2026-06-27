/**
 * Progression & reward economy (spec §4, §2.4). Bananas are a *cumulative*
 * milestone counter — characters unlock when total bananas earned reaches their
 * cost, so earned bananas are NEVER deducted (kind design, R12). Stars keep the
 * best result per level. Completing all of a world's levels unlocks the next
 * scene. A per-key confidence score feeds the adaptive engine.
 */
import type { SceneId } from '../content/types'
import { CHARACTERS } from '../content/characters'
import { SCENES } from '../content/scenes'
import { LEVELS } from '../content/levels'

export interface ProgressState {
  totalBananas: number
  unlockedChars: string[]
  unlockedScenes: SceneId[]
  levelStars: Record<string, 1 | 2 | 3>
  keyConfidence: Record<string, number>
  selectedChar: string
  selectedScene: SceneId
}

export interface ResultInput { stars: 0 | 1 | 2 | 3; accuracy: number; cleared: number }
export interface ResultOutcome { bananasEarned: number; newChars: string[]; newScenes: SceneId[] }

export function defaultProgress(): ProgressState {
  return {
    totalBananas: 0,
    unlockedChars: ['cinnamoroll'],
    unlockedScenes: ['jungle'],
    levelStars: {},
    keyConfidence: {},
    selectedChar: 'cinnamoroll',
    selectedScene: 'jungle',
  }
}

/** Bananas awarded for a round: rewards effort (cleared words) weighted by accuracy, plus a star bonus. */
export function bananasFor(input: ResultInput): number {
  return Math.round(input.cleared * 5 * (0.5 + input.accuracy)) + input.stars * 10
}

export class ProgressStore {
  constructor(private s: ProgressState = defaultProgress()) {}

  get state(): ProgressState { return this.s }
  get bananas(): number { return this.s.totalBananas }

  isCharUnlocked(id: string): boolean {
    return this.s.unlockedChars.includes(id)
  }
  isSceneUnlocked(id: SceneId): boolean {
    return this.s.unlockedScenes.includes(id)
  }
  starsFor(levelId: string): 0 | 1 | 2 | 3 {
    return this.s.levelStars[levelId] ?? 0
  }

  /** Record a level result: best stars, award bananas, unlock chars + scenes. */
  recordResult(levelId: string, input: ResultInput): ResultOutcome {
    // keep best stars
    if (input.stars > 0) {
      const stars = input.stars as 1 | 2 | 3
      const prev = this.s.levelStars[levelId] ?? 0
      if (stars > prev) this.s.levelStars[levelId] = stars
    }

    const bananasEarned = bananasFor(input)
    this.s.totalBananas += bananasEarned

    const newChars = this.syncCharacterUnlocks()
    const newScenes = this.syncSceneUnlocks()
    return { bananasEarned, newChars, newScenes }
  }

  /** Unlock any character whose cumulative cost is now met. Returns new ids. */
  private syncCharacterUnlocks(): string[] {
    const fresh: string[] = []
    for (const c of CHARACTERS) {
      if (c.unlockCostBananas <= this.s.totalBananas && !this.s.unlockedChars.includes(c.id)) {
        this.s.unlockedChars.push(c.id)
        fresh.push(c.id)
      }
    }
    return fresh
  }

  /** A world is complete when all its levels have ≥1 star → unlock the next scene. */
  private syncSceneUnlocks(): SceneId[] {
    const fresh: SceneId[] = []
    const ordered = [...SCENES].sort((a, b) => a.order - b.order)
    for (let i = 0; i < ordered.length - 1; i++) {
      const world = ordered[i]!
      const worldLevels = LEVELS.filter((l) => l.world === world.id)
      const complete = worldLevels.length > 0 && worldLevels.every((l) => (this.s.levelStars[l.id] ?? 0) >= 1)
      const nextScene = ordered[i + 1]!.id
      if (complete && !this.s.unlockedScenes.includes(nextScene)) {
        this.s.unlockedScenes.push(nextScene)
        fresh.push(nextScene)
      }
    }
    return fresh
  }

  /** Update a key's confidence (0..1) from a keystroke outcome (adaptive engine). */
  recordKey(ch: string, correct: boolean): void {
    const key = ch.toLowerCase()
    const cur = this.s.keyConfidence[key] ?? 0.5
    const target = correct ? 1 : 0
    this.s.keyConfidence[key] = +(cur + (target - cur) * 0.2).toFixed(4)
  }
  keyConfidence(ch: string): number {
    return this.s.keyConfidence[ch.toLowerCase()] ?? 0.5
  }

  selectChar(id: string): boolean {
    if (!this.isCharUnlocked(id)) return false
    this.s.selectedChar = id
    return true
  }
  selectScene(id: SceneId): boolean {
    if (!this.isSceneUnlocked(id)) return false
    this.s.selectedScene = id
    return true
  }

  serialize(): string { return JSON.stringify(this.s) }
  static deserialize(json: string): ProgressStore {
    try {
      const parsed = JSON.parse(json) as Partial<ProgressState>
      return new ProgressStore({ ...defaultProgress(), ...parsed })
    } catch {
      return new ProgressStore()
    }
  }
}
