/**
 * App shell / screen state machine. Owns progress, language, and the active
 * screen, and routes input + the loop to it. Screens navigate via the shared
 * GameCtx. (Menus are canvas-rendered with arrow-key nav for now; a DOM/a11y
 * overlay is M6.)
 */
import type { Scene, RoundOutcome } from '../scenes/Scene'
import type { Lang } from '../content/types'
import { ProgressStore, type ResultOutcome } from '../state/progress'
import { loadProgress, saveProgress } from '../state/persistence'
import { setLang } from '../i18n/strings'
import { characterById } from '../content/characters'
import { MenuScene } from '../scenes/MenuScene'
import { CharacterSelectScene } from '../scenes/CharacterSelectScene'
import { ResultsScene } from '../scenes/ResultsScene'
import { PlayWord } from '../scenes/PlayWord'
import { PlayAbc } from '../scenes/PlayAbc'

export type ScreenId = 'menu' | 'character' | 'play' | 'results'

export interface GameCtx {
  progress: ProgressStore
  lang: Lang
  go(id: ScreenId): void
  save(): void
  setLanguage(l: Lang): void
}

export class Game {
  private progress: ProgressStore = loadProgress()
  private lang: Lang = 'vi'
  private playMode: 'abc' | 'word' = 'word'
  private screen: Scene
  private lastResult?: { round: RoundOutcome; reward: ResultOutcome }

  private readonly ctx: GameCtx = {
    progress: this.progress,
    lang: this.lang,
    go: (id) => this.go(id),
    save: () => saveProgress(this.progress),
    setLanguage: (l) => { this.lang = l; this.ctx.lang = l; setLang(l) },
  }

  constructor() {
    setLang(this.lang)
    this.screen = new MenuScene(this.ctx)
  }

  private selectedEmoji(): string {
    return characterById(this.progress.state.selectedChar)?.emoji ?? '🐵'
  }

  go(id: ScreenId): void {
    if (id === 'menu') this.screen = new MenuScene(this.ctx)
    else if (id === 'character') this.screen = new CharacterSelectScene(this.ctx)
    else if (id === 'results' && this.lastResult) this.screen = new ResultsScene(this.ctx, this.lastResult)
    else this.screen = this.makePlay()
  }

  private makePlay(): Scene {
    const opts = {
      characterEmoji: this.selectedEmoji(),
      levelId: `practice-${this.playMode}`,
      onExit: () => this.go('menu'),
      onRoundComplete: (o: RoundOutcome) => {
        const reward = this.progress.recordResult(o.levelId, {
          stars: o.stars, accuracy: o.accuracy, cleared: o.cleared,
        })
        saveProgress(this.progress)
        this.lastResult = { round: o, reward }
        this.go('results')
      },
    }
    return this.playMode === 'word' ? new PlayWord(opts) : new PlayAbc(opts)
  }

  onChar(ch: string): void { this.screen.handleChar?.(ch) }

  onKey(key: string): void {
    // Tab toggles ABC/Word while playing.
    if (key === 'Tab' && (this.screen instanceof PlayWord || this.screen instanceof PlayAbc)) {
      this.playMode = this.playMode === 'word' ? 'abc' : 'word'
      this.screen = this.makePlay()
      return
    }
    this.screen.onKey?.(key)
  }

  update(dt: number): void { this.screen.update(dt) }
  render(ctx: CanvasRenderingContext2D, w: number, h: number): void { this.screen.render(ctx, w, h) }
}
