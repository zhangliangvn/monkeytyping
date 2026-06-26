import { describe, it, expect } from 'vitest'
import { Round } from './round'

describe('Round', () => {
  it('walks through the word queue and finishes', () => {
    const r = new Round(['hi', 'go'])
    expect(r.currentWord).toBe('hi')
    r.press('h', 0)
    const a = r.press('i', 10)
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

  it('exposes live accuracy, current combo, and cleared count', () => {
    const r = new Round(['ab', 'cd'])
    r.press('a', 0); r.press('b', 10)
    expect(r.comboCount).toBe(1)
    expect(r.cleared).toBe(1)
    expect(r.accuracy).toBe(1)
    r.press('x', 20) // typo resets combo
    expect(r.comboCount).toBe(0)
    expect(r.accuracy).toBeCloseTo(2 / 3, 5)
  })

  it('ignores presses after the round is finished', () => {
    const r = new Round(['a'])
    r.press('a', 0)
    expect(r.finished).toBe(true)
    expect(r.press('b', 10)).toMatchObject({ correct: false, wordCompleted: false })
  })
})
