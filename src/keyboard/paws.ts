/**
 * Finger ↔ paw mapping for the monkey-hands guide. Each of the 8 fingers rests
 * on a home key (A-S-D-F / J-K-L-;); thumbs rest on space. When a target key is
 * shown, the responsible finger lifts from its home key toward the target and
 * settles back — the "return to home row" habit the spec mandates (§2.2).
 */
import { fingerForChar, type Finger } from '../content/fingerMap'

export const HOME_KEY: Record<Finger, string> = {
  'L-pinky': 'a',
  'L-ring': 's',
  'L-middle': 'd',
  'L-index': 'f',
  'R-index': 'j',
  'R-middle': 'k',
  'R-ring': 'l',
  'R-pinky': ';',
  thumb: 'space',
}

/** Which monkey paw owns a finger. */
export function handForFinger(finger: Finger): 'L' | 'R' | 'both' {
  if (finger === 'thumb') return 'both'
  return finger.startsWith('L-') ? 'L' : 'R'
}

/** The finger that should press a given character, if any. */
export function activeFinger(ch: string): Finger | undefined {
  return fingerForChar(ch)?.finger
}

/** The home (rest) key label for the finger that presses `ch`. */
export function homeKeyForChar(ch: string): string | undefined {
  const f = activeFinger(ch)
  return f ? HOME_KEY[f] : undefined
}
