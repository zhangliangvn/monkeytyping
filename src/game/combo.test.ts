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
    for (let i = 0; i < 3; i++) c.wordCleared()
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
