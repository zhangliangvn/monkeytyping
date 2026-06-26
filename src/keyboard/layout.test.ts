import { describe, it, expect } from 'vitest'
import { layoutKeyboard, KEYBOARD_ROWS, ROW_UNITS } from './layout'

describe('keyboard layout', () => {
  it('every row totals ROW_UNITS so rows align', () => {
    for (const row of KEYBOARD_ROWS) {
      const total = row.reduce((s, k) => s + k.units, 0)
      expect(total).toBeCloseTo(ROW_UNITS, 5)
    }
  })

  it('places all letter keys, space, f and j inside the bounds', () => {
    const bounds = { x: 0, y: 0, w: 1000, h: 320 }
    const map = layoutKeyboard(bounds)
    for (const ch of 'abcdefghijklmnopqrstuvwxyz'.split('')) {
      const r = map.get(ch)
      expect(r, `missing ${ch}`).toBeDefined()
      expect(r!.x).toBeGreaterThanOrEqual(bounds.x - 0.001)
      expect(r!.x + r!.w).toBeLessThanOrEqual(bounds.x + bounds.w + 0.5)
      expect(r!.w).toBeGreaterThan(0)
      expect(r!.h).toBeGreaterThan(0)
    }
    expect(map.get('space')).toBeDefined()
    expect(map.get('Backspace')).toBeDefined()
  })

  it('stacks rows top→bottom (home row below top row, above bottom row)', () => {
    const map = layoutKeyboard({ x: 0, y: 0, w: 1000, h: 320 })
    const e = map.get('e')!   // top row
    const d = map.get('d')!   // home row
    const c = map.get('c')!   // bottom row
    const space = map.get('space')!
    expect(d.y).toBeGreaterThan(e.y)
    expect(c.y).toBeGreaterThan(d.y)
    expect(space.y).toBeGreaterThan(c.y)
  })

  it('keys in a row do not overlap horizontally', () => {
    const map = layoutKeyboard({ x: 0, y: 0, w: 1000, h: 320 })
    const home = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'].map((l) => map.get(l)!)
    for (let i = 1; i < home.length; i++) {
      expect(home[i]!.x).toBeGreaterThanOrEqual(home[i - 1]!.x + home[i - 1]!.w)
    }
  })

  it('the wider space key is wider than a letter key', () => {
    const map = layoutKeyboard({ x: 0, y: 0, w: 1000, h: 320 })
    expect(map.get('space')!.w).toBeGreaterThan(map.get('a')!.w * 3)
  })
})
