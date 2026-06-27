import { describe, it, expect } from 'vitest'
import { ProgressStore, defaultProgress, bananasFor } from './progress'
import { LEVELS } from '../content/levels'

describe('progress: rewards & unlocks', () => {
  it('starts with only cinnamoroll + jungle', () => {
    const p = new ProgressStore()
    expect(p.isCharUnlocked('cinnamoroll')).toBe(true)
    expect(p.isCharUnlocked('bunny-pink')).toBe(false)
    expect(p.isSceneUnlocked('jungle')).toBe(true)
    expect(p.isSceneUnlocked('desert')).toBe(false)
  })

  it('keeps the best stars per level', () => {
    const p = new ProgressStore()
    p.recordResult('l1', { stars: 1, accuracy: 0.7, cleared: 5 })
    p.recordResult('l1', { stars: 3, accuracy: 0.99, cleared: 5 })
    p.recordResult('l1', { stars: 2, accuracy: 0.88, cleared: 5 })
    expect(p.starsFor('l1')).toBe(3)
  })

  it('unlocks characters by cumulative bananas and never deducts', () => {
    const p = new ProgressStore()
    // bunny-pink costs 40 cumulative bananas
    const before = p.bananas
    const r = p.recordResult('l1', { stars: 3, accuracy: 1, cleared: 6 }) // 6*5*1.5 + 30 = 75
    expect(r.bananasEarned).toBe(bananasFor({ stars: 3, accuracy: 1, cleared: 6 }))
    expect(p.bananas).toBe(before + r.bananasEarned)
    expect(p.bananas).toBeGreaterThanOrEqual(40)
    expect(r.newChars).toContain('bunny-pink')
    expect(p.isCharUnlocked('bunny-pink')).toBe(true)
    // bananas are NOT spent on unlock
    const after = p.bananas
    p.selectChar('bunny-pink')
    expect(p.bananas).toBe(after)
  })

  it('unlocks the next scene when a world is fully cleared', () => {
    const p = new ProgressStore()
    const jungleLevels = LEVELS.filter((l) => l.world === 'jungle')
    let newScenes: string[] = []
    for (const l of jungleLevels) {
      newScenes = p.recordResult(l.id, { stars: 1, accuracy: 0.75, cleared: 4 }).newScenes
    }
    expect(p.isSceneUnlocked('desert')).toBe(true)
    expect(newScenes).toContain('desert')
  })

  it('refuses to select a locked character or scene', () => {
    const p = new ProgressStore()
    expect(p.selectChar('pup-brown')).toBe(false)
    expect(p.selectScene('space')).toBe(false)
    expect(p.selectChar('cinnamoroll')).toBe(true)
  })

  it('updates per-key confidence toward 1 on correct, 0 on wrong', () => {
    const p = new ProgressStore()
    expect(p.keyConfidence('f')).toBe(0.5)
    p.recordKey('f', true)
    expect(p.keyConfidence('f')).toBeGreaterThan(0.5)
    p.recordKey('f', false); p.recordKey('f', false)
    expect(p.keyConfidence('f')).toBeLessThan(0.5)
  })
})

describe('progress: persistence', () => {
  it('round-trips through serialize/deserialize', () => {
    const p = new ProgressStore()
    p.recordResult('l1', { stars: 2, accuracy: 0.9, cleared: 5 })
    const restored = ProgressStore.deserialize(p.serialize())
    expect(restored.bananas).toBe(p.bananas)
    expect(restored.starsFor('l1')).toBe(2)
  })

  it('falls back to defaults on bad JSON', () => {
    const p = ProgressStore.deserialize('not json{')
    expect(p.state).toEqual(defaultProgress())
  })
})
