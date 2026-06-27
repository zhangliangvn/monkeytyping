import { describe, it, expect } from 'vitest'
import { Tts } from './tts'

describe('Tts safety', () => {
  it('never throws when speech synthesis is unavailable (jsdom)', () => {
    const t = new Tts()
    expect(() => { t.speak('hello'); t.speak('mèo', 'vi'); t.cancel() }).not.toThrow()
  })

  it('does nothing for empty text or when muted', () => {
    const t = new Tts({ muted: true })
    expect(() => t.speak('hello')).not.toThrow()
    expect(t.muted).toBe(true)
    const t2 = new Tts()
    expect(() => t2.speak('')).not.toThrow()
  })
})
