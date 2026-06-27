/**
 * UI strings (Vietnamese + English). The UI/voice stays fully Vietnamese-capable
 * from stage 1 even while practice words are ASCII. CN/JP/KR existed in the
 * original and can be re-added here as data later.
 */
import type { Lang } from '../content/types'

type Key =
  | 'app_title' | 'menu_play' | 'menu_arcade' | 'menu_shark' | 'menu_character' | 'menu_scene' | 'menu_level'
  | 'menu_settings' | 'menu_back' | 'select_character' | 'select_scene' | 'select_level'
  | 'locked' | 'bananas' | 'accuracy' | 'combo' | 'words' | 'round'
  | 'mode_abc' | 'mode_word' | 'switch_mode' | 'nav_hint' | 'play_hint'
  | 'level_complete' | 'try_again' | 'continue' | 'new_unlock'

const STRINGS: Record<Key, Record<Lang, string>> = {
  app_title: { vi: 'Cinnamoroll Tập Gõ', en: 'Cinnamoroll Typing' },
  menu_play: { vi: '▶ Chơi', en: '▶ Play' },
  menu_arcade: { vi: '🚀 Bắn chữ', en: '🚀 Arcade' },
  menu_shark: { vi: '🦈 Cá mập', en: '🦈 Shark' },
  menu_character: { vi: '🐵 Nhân vật', en: '🐵 Character' },
  menu_scene: { vi: '🌴 Cảnh', en: '🌴 Scene' },
  menu_level: { vi: '🎯 Chọn Level', en: '🎯 Level Select' },
  menu_settings: { vi: '⚙ Cài đặt', en: '⚙ Settings' },
  menu_back: { vi: '↩ Quay lại', en: '↩ Back' },
  select_character: { vi: 'Chọn Nhân Vật', en: 'Choose Your Monkey' },
  select_scene: { vi: 'Chọn Cảnh', en: 'Choose Your Scene' },
  select_level: { vi: 'Chọn Level', en: 'Choose Level' },
  locked: { vi: 'Khóa', en: 'Locked' },
  bananas: { vi: 'Donut', en: 'Donuts' },
  accuracy: { vi: 'Chính xác', en: 'Accuracy' },
  combo: { vi: 'Combo', en: 'Combo' },
  words: { vi: 'Từ', en: 'Words' },
  round: { vi: 'Vòng', en: 'Round' },
  mode_abc: { vi: '🔤 ABC', en: '🔤 ABC' },
  mode_word: { vi: '📝 Từ', en: '📝 Word' },
  switch_mode: { vi: 'Tab: đổi chế độ', en: 'Tab: switch mode' },
  nav_hint: { vi: '← → ↑ ↓ chọn · Enter xác nhận · Esc quay lại', en: '← → ↑ ↓ move · Enter select · Esc back' },
  play_hint: { vi: 'Gõ chữ hiện trên màn hình · Esc về menu', en: 'Type what you see · Esc for menu' },
  level_complete: { vi: '🎉 Hoàn thành!', en: '🎉 Complete!' },
  try_again: { vi: '🔄 Thử lại', en: '🔄 Try again' },
  continue: { vi: '➡ Tiếp tục', en: '➡ Continue' },
  new_unlock: { vi: '🎁 Mở khóa mới!', en: '🎁 New unlock!' },
}

let current: Lang = 'vi'
export function setLang(l: Lang): void { current = l }
export function getLang(): Lang { return current }
export function t(key: Key, lang: Lang = current): string {
  return STRINGS[key][lang]
}
