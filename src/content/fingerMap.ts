/**
 * The single source of truth for touch-typing finger guidance.
 *
 * Every typeable key maps to exactly one finger, one hand, one row, and one
 * color. This data drives the on-screen keyboard tint, the monkey-paw fingertip
 * highlight, the falling-target tint, and the legend — all from one place.
 *
 * Colors follow the widely recognized Typing.com convention so parents/teachers
 * recognize them. Color is NEVER the only cue (see spec §2.2): the keyboard
 * widget always pairs color with the paw graphic and key position.
 */
export type Finger =
  | 'L-pinky' | 'L-ring' | 'L-middle' | 'L-index'
  | 'R-index' | 'R-middle' | 'R-ring' | 'R-pinky'
  | 'thumb'

export type KeyRow = 'number' | 'top' | 'home' | 'bottom' | 'space'

export interface KeyDef {
  code: string
  label: string
  finger: Finger
  hand: 'L' | 'R' | 'both'
  row: KeyRow
  color: string
  isReach: boolean
  hasBump: boolean
}

export const FINGER_COLORS: Record<Finger, string> = {
  'L-pinky': '#a855f7',
  'L-ring': '#3b82f6',
  'L-middle': '#ef4444',
  'L-index': '#22c55e',
  'R-index': '#22c55e',
  'R-middle': '#ef4444',
  'R-ring': '#3b82f6',
  'R-pinky': '#a855f7',
  thumb: '#9ca3af',
}

/** Index-stretch / reach keys get their own warning color. */
export const REACH_COLOR = '#eab308'

// [label, finger, hand, row, isReach, hasBump]
type Raw = [string, Finger, 'L' | 'R' | 'both', KeyRow, boolean, boolean]

const RAW: Raw[] = [
  // number row
  ['1', 'L-pinky', 'L', 'number', false, false], ['2', 'L-ring', 'L', 'number', false, false],
  ['3', 'L-middle', 'L', 'number', false, false], ['4', 'L-index', 'L', 'number', true, false],
  ['5', 'L-index', 'L', 'number', true, false], ['6', 'R-index', 'R', 'number', true, false],
  ['7', 'R-index', 'R', 'number', true, false], ['8', 'R-middle', 'R', 'number', false, false],
  ['9', 'R-ring', 'R', 'number', false, false], ['0', 'R-pinky', 'R', 'number', false, false],
  // top row
  ['q', 'L-pinky', 'L', 'top', false, false], ['w', 'L-ring', 'L', 'top', false, false],
  ['e', 'L-middle', 'L', 'top', false, false], ['r', 'L-index', 'L', 'top', false, false],
  ['t', 'L-index', 'L', 'top', true, false], ['y', 'R-index', 'R', 'top', true, false],
  ['u', 'R-index', 'R', 'top', false, false], ['i', 'R-middle', 'R', 'top', false, false],
  ['o', 'R-ring', 'R', 'top', false, false], ['p', 'R-pinky', 'R', 'top', false, false],
  // home row
  ['a', 'L-pinky', 'L', 'home', false, false], ['s', 'L-ring', 'L', 'home', false, false],
  ['d', 'L-middle', 'L', 'home', false, false], ['f', 'L-index', 'L', 'home', false, true],
  ['g', 'L-index', 'L', 'home', true, false], ['h', 'R-index', 'R', 'home', true, false],
  ['j', 'R-index', 'R', 'home', false, true], ['k', 'R-middle', 'R', 'home', false, false],
  ['l', 'R-ring', 'R', 'home', false, false], [';', 'R-pinky', 'R', 'home', false, false],
  // bottom row
  ['z', 'L-pinky', 'L', 'bottom', false, false], ['x', 'L-ring', 'L', 'bottom', false, false],
  ['c', 'L-middle', 'L', 'bottom', false, false], ['v', 'L-index', 'L', 'bottom', false, false],
  ['b', 'L-index', 'L', 'bottom', true, false], ['n', 'R-index', 'R', 'bottom', true, false],
  ['m', 'R-index', 'R', 'bottom', false, false], [',', 'R-middle', 'R', 'bottom', false, false],
  ['.', 'R-ring', 'R', 'bottom', false, false], ['/', 'R-pinky', 'R', 'bottom', false, false],
]

function build(): Record<string, KeyDef> {
  const map: Record<string, KeyDef> = {}
  for (const [label, finger, hand, row, isReach, hasBump] of RAW) {
    map[label] = {
      code: label,
      label,
      finger,
      hand,
      row,
      color: isReach ? REACH_COLOR : FINGER_COLORS[finger],
      isReach,
      hasBump,
    }
  }
  map['space'] = {
    code: 'space', label: '␣', finger: 'thumb', hand: 'both', row: 'space',
    color: FINGER_COLORS.thumb, isReach: false, hasBump: false,
  }
  return map
}

export const KEY_MAP: Record<string, KeyDef> = build()

/** Resolve the key definition for a typed character (case-insensitive; ' ' → space). */
export function fingerForChar(ch: string): KeyDef | undefined {
  if (ch === ' ') return KEY_MAP['space']
  return KEY_MAP[ch.toLowerCase()]
}
