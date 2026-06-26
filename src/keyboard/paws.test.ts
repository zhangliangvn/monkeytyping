import { describe, it, expect } from 'vitest'
import { HOME_KEY, handForFinger, activeFinger, homeKeyForChar } from './paws'
import type { Finger } from '../content/fingerMap'

const ALL_FINGERS: Finger[] = [
  'L-pinky', 'L-ring', 'L-middle', 'L-index',
  'R-index', 'R-middle', 'R-ring', 'R-pinky', 'thumb',
]

describe('paws', () => {
  it('every finger has a home key', () => {
    for (const f of ALL_FINGERS) {
      expect(HOME_KEY[f], f).toBeDefined()
    }
  })

  it('home-row anchors are correct', () => {
    expect(HOME_KEY['L-index']).toBe('f')
    expect(HOME_KEY['R-index']).toBe('j')
    expect(HOME_KEY['L-pinky']).toBe('a')
    expect(HOME_KEY['R-pinky']).toBe(';')
    expect(HOME_KEY.thumb).toBe('space')
  })

  it('resolves the active finger and its home key for a target char', () => {
    expect(activeFinger('g')).toBe('L-index')
    expect(homeKeyForChar('g')).toBe('f') // index reaches g, rests on f
    expect(activeFinger('o')).toBe('R-ring')
    expect(homeKeyForChar('o')).toBe('l')
    expect(homeKeyForChar(' ')).toBe('space')
  })

  it('maps fingers to the correct hand', () => {
    expect(handForFinger('L-middle')).toBe('L')
    expect(handForFinger('R-ring')).toBe('R')
    expect(handForFinger('thumb')).toBe('both')
  })
})
