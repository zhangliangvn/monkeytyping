import { describe, it, expect } from 'vitest'
import { EASY, MEDIUM, HARD, ALL_WORDS, rampedPool, wordsByDifficulty } from './words'

describe('word bank', () => {
  it('is large and split into three tiers', () => {
    expect(EASY.length).toBeGreaterThan(80)
    expect(MEDIUM.length).toBeGreaterThan(80)
    expect(HARD.length).toBeGreaterThan(80)
    expect(ALL_WORDS.length).toBe(EASY.length + MEDIUM.length + HARD.length)
  })

  it('contains only lowercase ASCII letters', () => {
    for (const w of ALL_WORDS) expect(w, w).toMatch(/^[a-z]+$/)
  })

  it('buckets words by length (2-4 / 5-6 / 7-12)', () => {
    for (const w of EASY) expect(w.length, w).toBeLessThanOrEqual(4)
    for (const w of EASY) expect(w.length, w).toBeGreaterThanOrEqual(2)
    for (const w of MEDIUM) { expect(w.length, w).toBeGreaterThanOrEqual(5); expect(w.length, w).toBeLessThanOrEqual(6) }
    for (const w of HARD) { expect(w.length, w).toBeGreaterThanOrEqual(7); expect(w.length, w).toBeLessThanOrEqual(12) }
  })

  it('has no duplicates across the whole bank', () => {
    expect(new Set(ALL_WORDS).size).toBe(ALL_WORDS.length)
  })

  it('rampedPool ramps from easy to hard and is never empty', () => {
    expect(rampedPool(0).length).toBeGreaterThan(0)
    expect(rampedPool(0.5).length).toBeGreaterThan(0)
    expect(rampedPool(1).length).toBeGreaterThan(0)
    // late game includes hard words, early game does not
    expect(rampedPool(1).some((w) => HARD.includes(w))).toBe(true)
    expect(rampedPool(0).every((w) => !HARD.includes(w))).toBe(true)
  })

  it('wordsByDifficulty returns the right tier', () => {
    expect(wordsByDifficulty('easy')).toBe(EASY)
    expect(wordsByDifficulty('hard')).toBe(HARD)
  })
})
