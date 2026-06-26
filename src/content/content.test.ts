import { describe, it, expect } from 'vitest'
import { CHARACTERS, CHARACTER_IDS, characterById } from './characters'
import { SCENES, SCENE_IDS } from './scenes'
import { LEVELS, nextLevelId } from './levels'
import { fingerForChar } from './fingerMap'

describe('characters', () => {
  it('has 14 with unique ids', () => {
    expect(CHARACTERS).toHaveLength(14)
    expect(new Set(CHARACTER_IDS).size).toBe(14)
  })

  it('classic is free and costs only rise from there', () => {
    expect(characterById('classic')!.unlockCostBananas).toBe(0)
    const costs = CHARACTERS.map((c) => c.unlockCostBananas)
    for (let i = 1; i < costs.length; i++) {
      expect(costs[i]!).toBeGreaterThan(costs[i - 1]!)
    }
  })

  it('every character belongs to a real scene-world and has colors + ability', () => {
    for (const c of CHARACTERS) {
      expect(SCENE_IDS, c.id).toContain(c.world)
      expect(c.colors.length, c.id).toBeGreaterThan(0)
      expect(c.name.vi.length, c.id).toBeGreaterThan(0)
      expect(c.name.en.length, c.id).toBeGreaterThan(0)
      expect(c.ability.length, c.id).toBeGreaterThan(0)
    }
  })

  it('covers all four worlds', () => {
    const worlds = new Set(CHARACTERS.map((c) => c.world))
    expect([...worlds].sort()).toEqual(['desert', 'jungle', 'ocean', 'space'])
  })
})

describe('scenes', () => {
  it('has 4 with orders 0..3', () => {
    expect(SCENES).toHaveLength(4)
    expect(SCENES.map((s) => s.order).sort()).toEqual([0, 1, 2, 3])
  })
})

describe('levels', () => {
  it('have unique ids and a sensible chain', () => {
    const ids = LEVELS.map((l) => l.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(nextLevelId(ids[0]!)).toBe(ids[1])
    expect(nextLevelId(ids[ids.length - 1]!)).toBeUndefined()
  })

  it('keySet chars are all typeable on the finger map', () => {
    for (const l of LEVELS) {
      expect(l.keySet.length, l.id).toBeGreaterThan(0)
      for (const k of l.keySet) {
        expect(fingerForChar(k), `${l.id}:${k}`).toBeDefined()
      }
    }
  })

  it('word levels only use keys taught up to that level (ASCII, no diacritics)', () => {
    for (const l of LEVELS.filter((x) => x.mode === 'word')) {
      expect(l.words, l.id).toBeDefined()
      const allowed = new Set(l.keySet)
      for (const lang of ['vi', 'en'] as const) {
        for (const word of l.words![lang]) {
          for (const ch of word) {
            expect(fingerForChar(ch), `${l.id} ${lang} "${word}" char "${ch}" typeable`).toBeDefined()
            expect(allowed.has(ch), `${l.id} ${lang} "${word}" uses untaught key "${ch}"`).toBe(true)
          }
        }
      }
    }
  })
})
