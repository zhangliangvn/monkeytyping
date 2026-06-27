import { describe, it, expect } from 'vitest'
import { pickWord } from './PlayArcade'

describe('arcade pickWord (lock-on disambiguation)', () => {
  it('never returns a word whose first letter is already on screen', () => {
    const pool = ['cat', 'cup', 'dog', 'sun']
    const used = new Set(['c', 'd'])
    for (let seed = 0; seed < 10; seed++) {
      const w = pickWord(pool, used, seed)
      expect(w).toBe('sun') // only "sun" has an unused first letter
    }
  })

  it('returns undefined when every first letter is taken', () => {
    expect(pickWord(['cat', 'dog'], new Set(['c', 'd']), 3)).toBeUndefined()
  })

  it('picks deterministically from the available set by seed', () => {
    const pool = ['cat', 'dog', 'sun']
    expect(pickWord(pool, new Set(), 0)).toBe('cat')
    expect(pickWord(pool, new Set(), 1)).toBe('dog')
    expect(pickWord(pool, new Set(), 2)).toBe('sun')
  })
})
