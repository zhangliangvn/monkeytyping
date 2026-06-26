/**
 * Pure keyboard geometry. Defines an ANSI-style key grid in "units" and lays it
 * out into pixel rects inside a bounding box. No canvas here — this is testable
 * geometry that the KeyboardGuide renderer consumes.
 *
 * Every row totals the same number of units (ROW_UNITS) so rows align edge to
 * edge. Letter/`;,./` keys use their plain label; special keys use names.
 */
export interface Rect { x: number; y: number; w: number; h: number }
export interface KeyCap { label: string; units: number }

export const ROW_UNITS = 15

export const KEYBOARD_ROWS: KeyCap[][] = [
  // number row (total 15)
  [
    { label: '`', units: 1 }, { label: '1', units: 1 }, { label: '2', units: 1 },
    { label: '3', units: 1 }, { label: '4', units: 1 }, { label: '5', units: 1 },
    { label: '6', units: 1 }, { label: '7', units: 1 }, { label: '8', units: 1 },
    { label: '9', units: 1 }, { label: '0', units: 1 }, { label: '-', units: 1 },
    { label: '=', units: 1 }, { label: 'Backspace', units: 2 },
  ],
  // top row (1.5 + 12 + 1.5 = 15)
  [
    { label: 'Tab', units: 1.5 }, { label: 'q', units: 1 }, { label: 'w', units: 1 },
    { label: 'e', units: 1 }, { label: 'r', units: 1 }, { label: 't', units: 1 },
    { label: 'y', units: 1 }, { label: 'u', units: 1 }, { label: 'i', units: 1 },
    { label: 'o', units: 1 }, { label: 'p', units: 1 }, { label: '[', units: 1 },
    { label: ']', units: 1 }, { label: '\\', units: 1.5 },
  ],
  // home row (1.75 + 11 + 2.25 = 15)
  [
    { label: 'Caps', units: 1.75 }, { label: 'a', units: 1 }, { label: 's', units: 1 },
    { label: 'd', units: 1 }, { label: 'f', units: 1 }, { label: 'g', units: 1 },
    { label: 'h', units: 1 }, { label: 'j', units: 1 }, { label: 'k', units: 1 },
    { label: 'l', units: 1 }, { label: ';', units: 1 }, { label: "'", units: 1 },
    { label: 'Enter', units: 2.25 },
  ],
  // bottom row (2.25 + 10 + 2.75 = 15)
  [
    { label: 'ShiftL', units: 2.25 }, { label: 'z', units: 1 }, { label: 'x', units: 1 },
    { label: 'c', units: 1 }, { label: 'v', units: 1 }, { label: 'b', units: 1 },
    { label: 'n', units: 1 }, { label: 'm', units: 1 }, { label: ',', units: 1 },
    { label: '.', units: 1 }, { label: '/', units: 1 }, { label: 'ShiftR', units: 2.75 },
  ],
  // space row (1.5 + 1.5 + 9 + 1.5 + 1.5 = 15)
  [
    { label: 'CtrlL', units: 1.5 }, { label: 'AltL', units: 1.5 }, { label: 'space', units: 9 },
    { label: 'AltR', units: 1.5 }, { label: 'CtrlR', units: 1.5 },
  ],
]

/**
 * Lay the keyboard out inside `bounds`. Each row fills the full width; rows are
 * stacked top→bottom with `gap` between keys and rows. Returns a map from label
 * to pixel rect.
 */
export function layoutKeyboard(bounds: Rect, gap = 6): Map<string, Rect> {
  const out = new Map<string, Rect>()
  const rows = KEYBOARD_ROWS
  const rowH = (bounds.h - gap * (rows.length - 1)) / rows.length

  rows.forEach((row, ri) => {
    const n = row.length
    const unitW = (bounds.w - gap * (n - 1)) / ROW_UNITS
    const y = bounds.y + ri * (rowH + gap)
    let x = bounds.x
    for (const cap of row) {
      const w = unitW * cap.units
      out.set(cap.label, { x, y, w, h: rowH })
      x += w + gap
    }
  })
  return out
}
