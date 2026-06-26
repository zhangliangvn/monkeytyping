/**
 * IME-safe keyboard input. We resolve characters from `event.code` (the
 * physical key) first, so an active Vietnamese Telex/VNI IME can never silently
 * transform s/f/r/x/j/w/z during ASCII practice (spec §5, R5). `event.key` is
 * only a fallback for keys not in the physical map.
 */
export type CharListener = (ch: string) => void

const CODE_TO_CHAR: Record<string, string> = (() => {
  const m: Record<string, string> = {}
  for (const c of 'abcdefghijklmnopqrstuvwxyz') m[`Key${c.toUpperCase()}`] = c
  for (let d = 0; d <= 9; d++) m[`Digit${d}`] = String(d)
  m['Space'] = ' '
  m['Semicolon'] = ';'
  m['Comma'] = ','
  m['Period'] = '.'
  m['Slash'] = '/'
  m['Minus'] = '-'
  m['Equal'] = '='
  m['BracketLeft'] = '['
  m['BracketRight'] = ']'
  m['Backslash'] = '\\'
  m['Quote'] = "'"
  m['Backquote'] = '`'
  return m
})()

/** Resolve a printable character from a keydown event, IME-safe. */
export function charFromEvent(e: KeyboardEvent): string | undefined {
  if (e.ctrlKey || e.metaKey || e.altKey) return undefined
  const byCode = CODE_TO_CHAR[e.code]
  if (byCode) return byCode
  if (e.key.length === 1) return e.key.toLowerCase()
  return undefined
}

export class KeyboardInput {
  private listeners = new Set<CharListener>()
  private target: Window | HTMLElement | null = null
  private readonly handler = (ev: Event): void => {
    const e = ev as KeyboardEvent
    if (e.repeat) return
    const ch = charFromEvent(e)
    if (ch === undefined) return
    if (ch === ' ') e.preventDefault()
    for (const fn of this.listeners) fn(ch)
  }

  attach(target: Window | HTMLElement = window): void {
    this.target = target
    target.addEventListener('keydown', this.handler)
  }

  detach(): void {
    this.target?.removeEventListener('keydown', this.handler)
    this.target = null
  }

  onChar(fn: CharListener): () => void {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }
}
