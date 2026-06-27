/** Common shape for a screen driven by the loop + input. */
export interface Scene {
  /** Printable character typed (gameplay). */
  handleChar?(ch: string): void
  /** Navigation key (ArrowUp/Down/Left/Right, Enter, Escape, Tab, Backspace). */
  onKey?(key: string): void
  update(dtMs: number): void
  render(ctx: CanvasRenderingContext2D, w: number, h: number): void
}

/** Result reported when a practice round finishes. */
export interface RoundOutcome {
  levelId: string
  stars: 0 | 1 | 2 | 3
  accuracy: number
  cleared: number
}

import type { Sfx } from '../audio/sfx'
import type { Tts } from '../audio/tts'

/** Options for the practice scenes (wired by the app shell). */
export interface PlayOpts {
  onExit?: () => void
  onRoundComplete?: (o: RoundOutcome) => void
  characterId?: string
  levelId?: string
  /** Override the drill content for a specific level. */
  keys?: string[]
  words?: string[]
  title?: string
  sfx?: Sfx
  tts?: Tts
  speakLang?: 'en' | 'vi'
}
