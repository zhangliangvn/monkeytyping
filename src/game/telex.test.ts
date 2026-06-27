import { describe, it, expect } from 'vitest'
import { buildTelexTarget, telexForChar } from './telex'

describe('telex decomposition', () => {
  it('maps modified vowels and đ', () => {
    expect(telexForChar('â')).toBe('aa')
    expect(telexForChar('ê')).toBe('ee')
    expect(telexForChar('ô')).toBe('oo')
    expect(telexForChar('ă')).toBe('aw')
    expect(telexForChar('ơ')).toBe('ow')
    expect(telexForChar('ư')).toBe('uw')
    expect(telexForChar('đ')).toBe('dd')
  })

  it('maps toned vowels (vowel then tone trigger)', () => {
    expect(telexForChar('è')).toBe('ef') // e + huyền
    expect(telexForChar('á')).toBe('as') // a + sắc
    expect(telexForChar('ẻ')).toBe('er') // e + hỏi
    expect(telexForChar('ẽ')).toBe('ex') // e + ngã
    expect(telexForChar('ẹ')).toBe('ej') // e + nặng
    expect(telexForChar('ớ')).toBe('ows') // ơ + sắc
    expect(telexForChar('ề')).toBe('eef') // ê + huyền
  })

  it('builds the keystroke sequence for whole words', () => {
    expect(buildTelexTarget('mèo').telex).toBe('mefo')
    expect(buildTelexTarget('chó').telex).toBe('chos')
    expect(buildTelexTarget('cá').telex).toBe('cas')
    expect(buildTelexTarget('nhà').telex).toBe('nhaf')
    expect(buildTelexTarget('nắng').telex).toBe('nawsng')
    expect(buildTelexTarget('trời').telex).toBe('trowfi')
    expect(buildTelexTarget('nước').telex).toBe('nuwowsc')
    expect(buildTelexTarget('đi').telex).toBe('ddi')
  })

  it('keeps a display mapping aligned to the typed keys', () => {
    const t = buildTelexTarget('mèo')
    expect(t.display).toBe('mèo')
    expect(t.displayTelex).toEqual(['m', 'ef', 'o'])
    // m(0) e(1) f(1) o(2)
    expect(t.telexToDisplay).toEqual([0, 1, 1, 2])
    expect(t.telex.length).toBe(t.telexToDisplay.length)
  })

  it('round-trips: every telex key belongs to a display character', () => {
    for (const w of ['mèo', 'chó', 'bánh', 'kẹo', 'mưa', 'sách']) {
      const t = buildTelexTarget(w)
      expect(Math.max(...t.telexToDisplay)).toBe(t.display.length - 1)
      expect(t.displayTelex.join('')).toBe(t.telex)
    }
  })
})
