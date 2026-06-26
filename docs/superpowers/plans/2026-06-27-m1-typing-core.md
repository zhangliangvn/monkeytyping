# M1 — Typing Core Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the pure, canvas-free typing engine — finger map, typing resolver, stats (accuracy/WPM), and combo — fully unit-tested, so all later visual/gameplay milestones sit on a verified core.

**Architecture:** All logic lives in `src/game/` and `src/content/` as deterministic, DOM-free modules. Rendering never imports these; these never import rendering. Each module is small and single-purpose. TDD red→green→refactor, commit per task.

**Tech Stack:** TypeScript (strict), Vitest. No new runtime deps.

## Global Constraints

- US-QWERTY finger map is the single source of truth; every letter/number/`;`/`,`/`.`/`/` key maps to exactly one finger + one color.
- Finger colors (Typing.com convention): index=`#22c55e` (green), middle=`#ef4444` (red), ring=`#3b82f6` (blue), pinky=`#a855f7` (purple), reach/stretch=`#eab308` (yellow), thumb=`#9ca3af` (neutral).
- Accuracy is `correctKeystrokes / totalKeystrokes`. WPM uses 5 chars = 1 word: gross = `(correctChars/5) / minutes`.
- On a wrong key the caret does NOT advance (Monkeytype convention).
- Combo increments per fully-correct word; resets to 0 on any typo; sound-tier escalation is capped (logic exposes a capped tier number).
- All modules pure & deterministic (no `Date.now()` inside logic — time is passed in).
- `npm run typecheck` and `npm test` must be green at the end of every task.

---

### Task 1: Finger map (single source of truth)

**Files:**
- Create: `src/content/fingerMap.ts`
- Test: `src/content/fingerMap.test.ts`

**Interfaces:**
- Produces:
  - `type Finger = 'L-pinky'|'L-ring'|'L-middle'|'L-index'|'R-index'|'R-middle'|'R-ring'|'R-pinky'|'thumb'`
  - `type KeyRow = 'number'|'top'|'home'|'bottom'|'space'`
  - `interface KeyDef { code: string; label: string; finger: Finger; hand: 'L'|'R'|'both'; row: KeyRow; color: string; isReach: boolean; hasBump: boolean }`
  - `const FINGER_COLORS: Record<Finger,string>`
  - `const KEY_MAP: Record<string, KeyDef>` keyed by lowercase label for letters/`;,./` and digit chars.
  - `function fingerForChar(ch: string): KeyDef | undefined`

- [ ] **Step 1: Write the failing test** — `src/content/fingerMap.test.ts`

```ts
import { describe, it, expect } from 'vitest'
import { KEY_MAP, FINGER_COLORS, fingerForChar } from './fingerMap'

const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('')

describe('fingerMap', () => {
  it('maps every letter to exactly one finger + matching color', () => {
    for (const ch of LETTERS) {
      const k = fingerForChar(ch)
      expect(k, `missing ${ch}`).toBeDefined()
      expect(k!.color).toBe(FINGER_COLORS[k!.finger])
    }
  })

  it('uses the standard home-row anchors and bumps', () => {
    expect(fingerForChar('f')!.finger).toBe('L-index')
    expect(fingerForChar('j')!.finger).toBe('R-index')
    expect(fingerForChar('f')!.hasBump).toBe(true)
    expect(fingerForChar('j')!.hasBump).toBe(true)
    expect(fingerForChar('a')!.finger).toBe('L-pinky')
    expect(fingerForChar(';')!.finger).toBe('R-pinky')
    expect(fingerForChar('a')!.row).toBe('home')
  })

  it('marks index-stretch keys g h t y as reach + yellow', () => {
    for (const ch of ['g', 'h', 't', 'y']) {
      expect(fingerForChar(ch)!.isReach, ch).toBe(true)
      expect(fingerForChar(ch)!.color).toBe(FINGER_COLORS.thumb === fingerForChar(ch)!.color ? '' : '#eab308')
    }
    expect(fingerForChar('g')!.color).toBe('#eab308')
  })

  it('assigns correct hands', () => {
    expect(fingerForChar('q')!.hand).toBe('L')
    expect(fingerForChar('p')!.hand).toBe('R')
    expect(KEY_MAP['space']?.hand).toBe('both')
  })

  it('is case-insensitive for letters', () => {
    expect(fingerForChar('A')!.finger).toBe(fingerForChar('a')!.finger)
  })
})
```

- [ ] **Step 2: Run to verify it fails** — `npm test -- fingerMap` → FAIL (module missing).

- [ ] **Step 3: Implement `src/content/fingerMap.ts`** — full per-key data:

```ts
export type Finger = 'L-pinky'|'L-ring'|'L-middle'|'L-index'|'R-index'|'R-middle'|'R-ring'|'R-pinky'|'thumb'
export type KeyRow = 'number'|'top'|'home'|'bottom'|'space'
export interface KeyDef { code: string; label: string; finger: Finger; hand: 'L'|'R'|'both'; row: KeyRow; color: string; isReach: boolean; hasBump: boolean }

export const FINGER_COLORS: Record<Finger, string> = {
  'L-pinky': '#a855f7', 'L-ring': '#3b82f6', 'L-middle': '#ef4444', 'L-index': '#22c55e',
  'R-index': '#22c55e', 'R-middle': '#ef4444', 'R-ring': '#3b82f6', 'R-pinky': '#a855f7',
  thumb: '#9ca3af',
}
const REACH = '#eab308'

// label, finger, hand, row, isReach, hasBump
const RAW: Array<[string, Finger, 'L'|'R'|'both', KeyRow, boolean, boolean]> = [
  // number row
  ['1','L-pinky','L','number',false,false],['2','L-ring','L','number',false,false],
  ['3','L-middle','L','number',false,false],['4','L-index','L','number',true,false],
  ['5','L-index','L','number',true,false],['6','R-index','R','number',true,false],
  ['7','R-index','R','number',true,false],['8','R-middle','R','number',false,false],
  ['9','R-ring','R','number',false,false],['0','R-pinky','R','number',false,false],
  // top row
  ['q','L-pinky','L','top',false,false],['w','L-ring','L','top',false,false],
  ['e','L-middle','L','top',false,false],['r','L-index','L','top',false,false],
  ['t','L-index','L','top',true,false],['y','R-index','R','top',true,false],
  ['u','R-index','R','top',false,false],['i','R-middle','R','top',false,false],
  ['o','R-ring','R','top',false,false],['p','R-pinky','R','top',false,false],
  // home row
  ['a','L-pinky','L','home',false,false],['s','L-ring','L','home',false,false],
  ['d','L-middle','L','home',false,false],['f','L-index','L','home',false,true],
  ['g','L-index','L','home',true,false],['h','R-index','R','home',true,false],
  ['j','R-index','R','home',false,true],['k','R-middle','R','home',false,false],
  ['l','R-ring','R','home',false,false],[';','R-pinky','R','home',false,false],
  // bottom row
  ['z','L-pinky','L','bottom',false,false],['x','L-ring','L','bottom',false,false],
  ['c','L-middle','L','bottom',false,false],['v','L-index','L','bottom',false,false],
  ['b','L-index','L','bottom',true,false],['n','R-index','R','bottom',true,false],
  ['m','R-index','R','bottom',false,false],[',','R-middle','R','bottom',false,false],
  ['.','R-ring','R','bottom',false,false],['/','R-pinky','R','bottom',false,false],
]

function build(): Record<string, KeyDef> {
  const map: Record<string, KeyDef> = {}
  for (const [label, finger, hand, row, isReach, hasBump] of RAW) {
    map[label] = { code: label, label, finger, hand, row,
      color: isReach ? REACH : FINGER_COLORS[finger], isReach, hasBump }
  }
  map['space'] = { code: 'space', label: '␣', finger: 'thumb', hand: 'both', row: 'space',
    color: FINGER_COLORS.thumb, isReach: false, hasBump: false }
  return map
}

export const KEY_MAP: Record<string, KeyDef> = build()

export function fingerForChar(ch: string): KeyDef | undefined {
  if (ch === ' ') return KEY_MAP['space']
  return KEY_MAP[ch.toLowerCase()]
}
```

- [ ] **Step 4: Run to verify pass** — `npm test -- fingerMap` → PASS. Then `npm run typecheck` → clean.

- [ ] **Step 5: Commit** — `feat(content): finger->key map as single source of truth`.

---

### Task 2: Typing resolver (per-target state machine)

**Files:**
- Create: `src/game/typing.ts`
- Test: `src/game/typing.test.ts`

**Interfaces:**
- Produces:
  - `interface TypingTarget { text: string }`
  - `interface KeyResult { correct: boolean; completed: boolean; index: number; expected: string }`
  - `class TypingSession` with: `constructor(text: string)`, `get index(): number`, `get done(): boolean`, `get typed(): string`, `press(ch: string): KeyResult`, `reset(): void`. The resolver tracks the caret; `press` with the expected char advances and may set `completed` when the last char is typed; a wrong char returns `correct:false` and does NOT advance.

- [ ] **Step 1: Write the failing test** — `src/game/typing.test.ts`

```ts
import { describe, it, expect } from 'vitest'
import { TypingSession } from './typing'

describe('TypingSession', () => {
  it('advances on correct chars and completes on the last', () => {
    const s = new TypingSession('cat')
    expect(s.press('c')).toMatchObject({ correct: true, completed: false, index: 1 })
    expect(s.press('a')).toMatchObject({ correct: true, completed: false, index: 2 })
    const r = s.press('t')
    expect(r).toMatchObject({ correct: true, completed: true, index: 3 })
    expect(s.done).toBe(true)
    expect(s.typed).toBe('cat')
  })

  it('does NOT advance the caret on a wrong key', () => {
    const s = new TypingSession('cat')
    const r = s.press('x')
    expect(r.correct).toBe(false)
    expect(r.expected).toBe('c')
    expect(s.index).toBe(0)
    expect(s.press('c').correct).toBe(true)
    expect(s.index).toBe(1)
  })

  it('ignores presses after completion', () => {
    const s = new TypingSession('hi')
    s.press('h'); s.press('i')
    const r = s.press('x')
    expect(r.completed).toBe(true)
    expect(s.index).toBe(2)
  })

  it('reset returns to the start', () => {
    const s = new TypingSession('hi')
    s.press('h'); s.reset()
    expect(s.index).toBe(0)
    expect(s.done).toBe(false)
  })
})
```

- [ ] **Step 2: Run to verify it fails** — `npm test -- typing` → FAIL.

- [ ] **Step 3: Implement `src/game/typing.ts`**

```ts
export interface KeyResult { correct: boolean; completed: boolean; index: number; expected: string }

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
```

- [ ] **Step 4: Run to verify pass** — `npm test -- typing` → PASS; `npm run typecheck` clean.

- [ ] **Step 5: Commit** — `feat(game): typing resolver with no-advance-on-error caret`.

---

### Task 3: Stats — accuracy + WPM

**Files:**
- Create: `src/game/stats.ts`
- Test: `src/game/stats.test.ts`

**Interfaces:**
- Produces:
  - `class Stats` with `record(correct: boolean): void`, `get correct(): number`, `get total(): number`, `get accuracy(): number` (0..1, returns 1 when no keystrokes), `wpm(elapsedMs: number): number` (gross, 5 chars/word, 0 when elapsed<=0), `reset(): void`.

- [ ] **Step 1: Write the failing test** — `src/game/stats.test.ts`

```ts
import { describe, it, expect } from 'vitest'
import { Stats } from './stats'

describe('Stats', () => {
  it('accuracy is correct/total, 1.0 when empty', () => {
    const s = new Stats()
    expect(s.accuracy).toBe(1)
    s.record(true); s.record(true); s.record(false)
    expect(s.correct).toBe(2)
    expect(s.total).toBe(3)
    expect(s.accuracy).toBeCloseTo(2 / 3, 5)
  })

  it('gross WPM = (correctChars/5)/minutes', () => {
    const s = new Stats()
    for (let i = 0; i < 25; i++) s.record(true) // 25 correct chars = 5 words
    expect(s.wpm(60_000)).toBeCloseTo(5, 5)     // in 1 minute => 5 wpm
    expect(s.wpm(30_000)).toBeCloseTo(10, 5)
  })

  it('wpm is 0 for non-positive elapsed', () => {
    const s = new Stats(); s.record(true)
    expect(s.wpm(0)).toBe(0)
  })
})
```

- [ ] **Step 2: Run to verify it fails** — `npm test -- stats` → FAIL.

- [ ] **Step 3: Implement `src/game/stats.ts`**

```ts
export class Stats {
  private _correct = 0
  private _total = 0
  record(correct: boolean): void { this._total += 1; if (correct) this._correct += 1 }
  get correct(): number { return this._correct }
  get total(): number { return this._total }
  get accuracy(): number { return this._total === 0 ? 1 : this._correct / this._total }
  wpm(elapsedMs: number): number {
    if (elapsedMs <= 0) return 0
    return (this._correct / 5) / (elapsedMs / 60_000)
  }
  reset(): void { this._correct = 0; this._total = 0 }
}
```

- [ ] **Step 4: Run to verify pass** — `npm test -- stats` → PASS; typecheck clean.

- [ ] **Step 5: Commit** — `feat(game): accuracy + gross WPM stats`.

---

### Task 4: Combo system (capped escalation)

**Files:**
- Create: `src/game/combo.ts`
- Test: `src/game/combo.test.ts`

**Interfaces:**
- Produces:
  - `class Combo` with `wordCleared(): void` (increment), `typo(): void` (reset to 0), `get count(): number`, `get tier(): number` (0-based escalation tier, capped at `maxTier`), `readonly maxTier: number` (default 6), `pitchMultiplier(): number` (1.06^tier, so capped). Constructor accepts optional `{ maxTier?: number; tierEvery?: number }` where a new tier starts every `tierEvery` words (default 3).

- [ ] **Step 1: Write the failing test** — `src/game/combo.test.ts`

```ts
import { describe, it, expect } from 'vitest'
import { Combo } from './combo'

describe('Combo', () => {
  it('counts cleared words and resets on typo', () => {
    const c = new Combo()
    c.wordCleared(); c.wordCleared()
    expect(c.count).toBe(2)
    c.typo()
    expect(c.count).toBe(0)
  })

  it('tier rises every `tierEvery` words and caps at maxTier', () => {
    const c = new Combo({ maxTier: 2, tierEvery: 3 })
    expect(c.tier).toBe(0)
    for (let i = 0; i < 3; i++) c.wordCleared() // 3 words => tier 1
    expect(c.tier).toBe(1)
    for (let i = 0; i < 100; i++) c.wordCleared()
    expect(c.tier).toBe(2) // capped
  })

  it('pitch multiplier is capped with the tier', () => {
    const c = new Combo({ maxTier: 2, tierEvery: 1 })
    c.wordCleared(); c.wordCleared(); c.wordCleared(); c.wordCleared()
    expect(c.tier).toBe(2)
    expect(c.pitchMultiplier()).toBeCloseTo(Math.pow(1.06, 2), 5)
  })
})
```

- [ ] **Step 2: Run to verify it fails** — `npm test -- combo` → FAIL.

- [ ] **Step 3: Implement `src/game/combo.ts`**

```ts
export interface ComboOpts { maxTier?: number; tierEvery?: number }
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
  get tier(): number { return Math.min(this.maxTier, Math.floor(this._count / this.tierEvery)) }
  pitchMultiplier(): number { return Math.pow(1.06, this.tier) }
}
```

- [ ] **Step 4: Run to verify pass** — `npm test -- combo` → PASS; typecheck clean.

- [ ] **Step 5: Commit** — `feat(game): capped combo escalation`.

---

### Task 5: Round controller (ties resolver + stats + combo over a word queue)

**Files:**
- Create: `src/game/round.ts`
- Test: `src/game/round.test.ts`

**Interfaces:**
- Consumes: `TypingSession` (Task 2), `Stats` (Task 3), `Combo` (Task 4).
- Produces:
  - `interface RoundResult { accuracy: number; wpm: number; maxCombo: number; cleared: number; stars: 0|1|2|3 }`
  - `class Round` with `constructor(words: string[])`, `get currentWord(): string | undefined`, `press(ch: string, nowMs: number): { correct: boolean; wordCompleted: boolean }`, `get finished(): boolean`, `result(nowMs: number): RoundResult`. Stars: 3 if accuracy>=0.95, 2 if >=0.85, 1 if >=0.70, else 0. Tracks max combo seen. Timer starts on first press.

- [ ] **Step 1: Write the failing test** — `src/game/round.test.ts`

```ts
import { describe, it, expect } from 'vitest'
import { Round } from './round'

describe('Round', () => {
  it('walks through the word queue and finishes', () => {
    const r = new Round(['hi', 'go'])
    expect(r.currentWord).toBe('hi')
    r.press('h', 0); const a = r.press('i', 10)
    expect(a.wordCompleted).toBe(true)
    expect(r.currentWord).toBe('go')
    r.press('g', 20); r.press('o', 30)
    expect(r.finished).toBe(true)
  })

  it('computes accuracy, stars, and max combo', () => {
    const r = new Round(['hi'])
    r.press('x', 0)          // wrong
    r.press('h', 10); r.press('i', 20)
    const res = r.result(60_000)
    expect(res.cleared).toBe(1)
    expect(res.accuracy).toBeCloseTo(2 / 3, 5)
    expect(res.stars).toBe(0) // 0.66 < 0.70
    expect(res.maxCombo).toBe(1)
  })

  it('awards 3 stars for a perfect round', () => {
    const r = new Round(['ab'])
    r.press('a', 0); r.press('b', 10)
    expect(r.result(60_000).stars).toBe(3)
  })
})
```

- [ ] **Step 2: Run to verify it fails** — `npm test -- round` → FAIL.

- [ ] **Step 3: Implement `src/game/round.ts`**

```ts
import { TypingSession } from './typing'
import { Stats } from './stats'
import { Combo } from './combo'

export interface RoundResult { accuracy: number; wpm: number; maxCombo: number; cleared: number; stars: 0|1|2|3 }

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
    const stars: 0|1|2|3 = accuracy >= 0.95 ? 3 : accuracy >= 0.85 ? 2 : accuracy >= 0.70 ? 1 : 0
    return { accuracy, wpm: this.stats.wpm(elapsed), maxCombo: this._maxCombo, cleared: this._cleared, stars }
  }
}
```

- [ ] **Step 4: Run to verify pass** — `npm test -- round` → PASS; `npm test` (all) green; `npm run typecheck` clean.

- [ ] **Step 5: Commit** — `feat(game): round controller (resolver+stats+combo, stars)`.

---

## Self-Review

- **Spec coverage (M1 slice):** finger map ✓ (Task 1), typing resolver/caret-no-advance ✓ (Task 2), accuracy+WPM ✓ (Task 3), combo cap ✓ (Task 4), round/stars/≥70% gate ✓ (Task 5). Adaptive engine, Telex, progression persistence are later milestones (M4–M5), intentionally out of M1.
- **Placeholder scan:** none — every step has full code.
- **Type consistency:** `TypingSession.press`→`KeyResult` used by `Round`; `Stats.wpm(elapsedMs)`, `Combo.wordCleared/typo/count` names consistent across Tasks 2–5.
