import { describe, it, expect } from 'vitest'
import { TypingSession } from './typing'

describe('TypingSession', () => {
  it('advances on correct chars and completes on the last', () => {
    const s = new TypingSession('cat')
    expect(s.press('c')).toMatchObject({ correct: true, completed: false, index: 1 })
    expect(s.press('a')).toMatchObject({ correct: true, completed: false, index: 2 })
    expect(s.press('t')).toMatchObject({ correct: true, completed: true, index: 3 })
    expect(s.done).toBe(true)
    expect(s.typed).toBe('cat')
  })

  it('does NOT advance the caret on a wrong key', () => {
    const s = new TypingSession('cat')
    const r = s.press('x')
    expect(r.correct).toBe(false)
    expect(r.expected).toBe('c')
    expect(s.index).toBe(0)
    expect(s.press('c').correct).toBe(true)
    expect(s.index).toBe(1)
  })

  it('ignores presses after completion', () => {
    const s = new TypingSession('hi')
    s.press('h'); s.press('i')
    const r = s.press('x')
    expect(r.completed).toBe(true)
    expect(s.index).toBe(2)
  })

  it('reset returns to the start', () => {
    const s = new TypingSession('hi')
    s.press('h'); s.reset()
    expect(s.index).toBe(0)
    expect(s.done).toBe(false)
  })
})
