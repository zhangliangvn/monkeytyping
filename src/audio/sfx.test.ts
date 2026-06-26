import { describe, it, expect } from 'vitest'
import { noteFreq, keyClickFreq, Sfx } from './sfx'

describe('sfx note math', () => {
  it('noteFreq(0) is A4 = 440Hz', () => {
    expect(noteFreq(0)).toBeCloseTo(440, 5)
    expect(noteFreq(12)).toBeCloseTo(880, 5) // one octave up
  })

  it('keyClickFreq rises with char index then caps', () => {
    expect(keyClickFreq(1)).toBeGreaterThan(keyClickFreq(0))
    expect(keyClickFreq(20)).toBe(keyClickFreq(8)) // capped at index 8
  })
})

describe('Sfx safety', () => {
  it('never throws when WebAudio is unavailable (jsdom)', () => {
    const s = new Sfx({ volume: 0.5 })
    expect(() => { s.keyOk(0); s.keyWrong(); s.wordDone(); s.banana(); s.combo(3); s.unlock() }).not.toThrow()
  })

  it('does nothing when muted', () => {
    const s = new Sfx({ muted: true })
    expect(() => s.keyOk(0)).not.toThrow()
    expect(s.muted).toBe(true)
  })
})
