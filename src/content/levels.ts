/**
 * The curriculum: center-outward, accuracy-first stages (spec §2.3). Levels are
 * ordered; each unlocks when the previous is cleared at ≥70% accuracy. Words are
 * ASCII (diacritic-free) so they're typeable on QWERTY without an IME; the Telex
 * "superpower" and full toned words arrive in M5.
 */
import type { LevelDef } from './types'

const HOME = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';']

export const LEVELS: LevelDef[] = [
  // ── Stage 1 · Jungle · home row ──
  {
    id: 'l1', stage: 1, world: 'jungle', mode: 'abc',
    title: { vi: 'Phím nhà F & J', en: 'Home keys F & J' }, keySet: ['f', 'j'],
  },
  {
    id: 'l2', stage: 1, world: 'jungle', mode: 'abc',
    title: { vi: 'D & K', en: 'D & K' }, keySet: ['f', 'j', 'd', 'k'],
  },
  {
    id: 'l3', stage: 1, world: 'jungle', mode: 'abc',
    title: { vi: 'Cả hàng cơ sở', en: 'Whole home row' },
    keySet: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
  },
  {
    id: 'l4', stage: 1, world: 'jungle', mode: 'abc',
    title: { vi: 'Với G & H', en: 'With G & H' }, keySet: HOME,
  },
  {
    id: 'l5', stage: 1, world: 'jungle', mode: 'word',
    title: { vi: 'Từ hàng cơ sở', en: 'Home-row words' }, keySet: HOME,
    words: {
      vi: ['la', 'da', 'sa', 'ga'],
      en: ['as', 'add', 'dad', 'sad', 'lad', 'ask', 'gas', 'fall', 'glad', 'half', 'flag', 'dash', 'flask', 'salad'],
    },
  },
  // ── Stage 2 · Desert · top row ──
  {
    id: 'l6', stage: 2, world: 'desert', mode: 'abc',
    title: { vi: 'E I R U', en: 'E I R U' }, keySet: [...HOME, 'e', 'i', 'r', 'u'],
  },
  {
    id: 'l7', stage: 2, world: 'desert', mode: 'abc',
    title: { vi: 'Hết hàng trên', en: 'Rest of top row' },
    keySet: [...HOME, 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  },
  {
    id: 'l8', stage: 2, world: 'desert', mode: 'word',
    title: { vi: 'Từ hàng trên', en: 'Top-row words' },
    keySet: [...HOME, 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    words: {
      vi: ['to', 'do', 'so', 'lo', 'go', 'ho', 'hoa', 'gao', 'tay', 'hay', 'dao', 'sao', 'yeu', 'gio'],
      en: ['set', 'let', 'red', 'try', 'your', 'rest', 'star', 'tree', 'great', 'quiet'],
    },
  },
  // ── Stage 3 · Ocean · bottom row ──
  {
    id: 'l9', stage: 3, world: 'ocean', mode: 'abc',
    title: { vi: 'V M B N', en: 'V M B N' }, keySet: [...HOME, 'v', 'm', 'b', 'n'],
  },
  {
    id: 'l10', stage: 3, world: 'ocean', mode: 'abc',
    title: { vi: 'Hết hàng dưới', en: 'Rest of bottom row' },
    keySet: [...HOME, 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
  },
  {
    id: 'l11', stage: 3, world: 'ocean', mode: 'word',
    title: { vi: 'Từ đầy đủ', en: 'Full-alphabet words' },
    keySet: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
    words: {
      vi: ['meo', 'cho', 'ca', 'nha', 'me', 'ba', 'ga', 'bo', 'con', 'sao', 'chim', 'mua', 'nang', 'troi', 'banh', 'keo', 'vui', 'hoa'],
      en: ['cat', 'dog', 'fish', 'bird', 'jump', 'play', 'happy', 'monkey', 'banana', 'school'],
    },
  },
  // ── Stage 4 · Space · fluency ──
  {
    id: 'l12', stage: 4, world: 'space', mode: 'word',
    title: { vi: 'Trôi chảy', en: 'Fluency' },
    keySet: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
    words: {
      vi: ['chuoi', 'khi', 'vui', 'choi', 'hoc', 'banh', 'keo', 'nuoc', 'sach', 'but'],
      en: ['monkey', 'banana', 'jungle', 'typing', 'rocket', 'planet', 'ocean', 'desert'],
    },
  },
]

export const LEVEL_IDS = LEVELS.map((l) => l.id)

export function levelById(id: string): LevelDef | undefined {
  return LEVELS.find((l) => l.id === id)
}

/** The level after `id` in curriculum order, or undefined if last. */
export function nextLevelId(id: string): string | undefined {
  const i = LEVELS.findIndex((l) => l.id === id)
  return i >= 0 && i < LEVELS.length - 1 ? LEVELS[i + 1]!.id : undefined
}
