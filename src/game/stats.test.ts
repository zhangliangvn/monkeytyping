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
    expect(s.wpm(60_000)).toBeCloseTo(5, 5)
    expect(s.wpm(30_000)).toBeCloseTo(10, 5)
  })

  it('wpm is 0 for non-positive elapsed', () => {
    const s = new Stats(); s.record(true)
    expect(s.wpm(0)).toBe(0)
  })

  it('reset clears counters', () => {
    const s = new Stats(); s.record(true); s.record(false); s.reset()
    expect(s.total).toBe(0)
    expect(s.accuracy).toBe(1)
  })
})
