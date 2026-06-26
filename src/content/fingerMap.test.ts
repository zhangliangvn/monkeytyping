import { describe, it, expect } from 'vitest'
import { KEY_MAP, FINGER_COLORS, fingerForChar } from './fingerMap'

const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('')
const REACH = '#eab308'

describe('fingerMap', () => {
  it('maps every letter to exactly one finger', () => {
    for (const ch of LETTERS) {
      const k = fingerForChar(ch)
      expect(k, `missing ${ch}`).toBeDefined()
    }
  })

  it('non-reach keys use their finger color; reach keys use yellow', () => {
    for (const ch of LETTERS) {
      const k = fingerForChar(ch)!
      const expected = k.isReach ? REACH : FINGER_COLORS[k.finger]
      expect(k.color, `color for ${ch}`).toBe(expected)
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
      expect(fingerForChar(ch)!.color, ch).toBe(REACH)
    }
  })

  it('assigns correct hands', () => {
    expect(fingerForChar('q')!.hand).toBe('L')
    expect(fingerForChar('p')!.hand).toBe('R')
    expect(KEY_MAP['space']?.hand).toBe('both')
  })

  it('is case-insensitive for letters and handles space', () => {
    expect(fingerForChar('A')!.finger).toBe(fingerForChar('a')!.finger)
    expect(fingerForChar(' ')!.finger).toBe('thumb')
  })
})
