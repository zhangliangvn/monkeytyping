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
import { MenuScene } from '../scenes/MenuScene'
import { CharacterSelectScene } from '../scenes/CharacterSelectScene'
import { SceneSelectScene } from '../scenes/SceneSelectScene'
import { LevelSelectScene } from '../scenes/LevelSelectScene'
import { ResultsScene } from '../scenes/ResultsScene'
import { PlayWord } from '../scenes/PlayWord'
import { PlayAbc } from '../scenes/PlayAbc'
import { PlayTelex } from '../scenes/PlayTelex'
import { PlayArcade } from '../scenes/PlayArcade'
import { PlayShark } from '../scenes/PlayShark'
import { levelById } from '../content/levels'
import type { LevelDef } from '../content/types'
import { Sfx } from '../audio/sfx'

export type ScreenId = 'menu' | 'character' | 'scene' | 'level' | 'play' | 'arcade' | 'shark' | 'results'

export interface GameCtx {
  progress: ProgressStore
  lang: Lang
  go(id: ScreenId): void
  startLevel(levelId: string): void
  save(): void
  setLanguage(l: Lang): void
  toggleMute(): void
  isMuted(): boolean
}

export class Game {
  private progress: ProgressStore = loadProgress()
  private lang: Lang = 'vi'
  private playMode: 'abc' | 'word' = 'word'
  private screen: Scene
  private sfx = new Sfx({ volume: 0.45 })
  private lastResult?: { round: RoundOutcome; reward: ResultOutcome }
  private currentLevel?: LevelDef

  private readonly ctx: GameCtx = {
    progress: this.progress,
    lang: this.lang,
    go: (id) => this.go(id),
    startLevel: (id) => this.startLevel(id),
    save: () => saveProgress(this.progress),
    setLanguage: (l) => { this.lang = l; this.ctx.lang = l; setLang(l) },
    toggleMute: () => { this.sfx.muted = !this.sfx.muted },
    isMuted: () => this.sfx.muted,
  }

  constructor() {
    setLang(this.lang)
    this.screen = new MenuScene(this.ctx)
  }

  go(id: ScreenId): void {
    if (id === 'menu') { this.currentLevel = undefined; this.screen = new MenuScene(this.ctx) }
    else if (id === 'character') this.screen = new CharacterSelectScene(this.ctx)
    else if (id === 'scene') this.screen = new SceneSelectScene(this.ctx)
    else if (id === 'level') this.screen = new LevelSelectScene(this.ctx)
    else if (id === 'arcade') this.screen = this.makeArcade()
    else if (id === 'shark') this.screen = this.makeShark()
    else if (id === 'results' && this.lastResult) this.screen = new ResultsScene(this.ctx, this.lastResult)
    else this.screen = this.makePlay()
  }

  private startLevel(levelId: string): void {
    this.currentLevel = levelById(levelId)
    this.go('play')
  }

  private onRoundComplete(o: RoundOutcome): void {
    const reward = this.progress.recordResult(o.levelId, {
      stars: o.stars, accuracy: o.accuracy, cleared: o.cleared,
    })
    saveProgress(this.progress)
    if (reward.newChars.length > 0 || reward.newScenes.length > 0) this.sfx.unlock()
    this.lastResult = { round: o, reward }
    this.go('results')
  }

  private makeArcade(): Scene {
    return new PlayArcade({
      characterId: this.progress.state.selectedChar,
      sfx: this.sfx,
      levelId: 'arcade',
      onExit: () => this.go('menu'),
      onRoundComplete: (o) => this.onRoundComplete(o),
    })
  }

  private makeShark(): Scene {
    return new PlayShark({
      characterId: this.progress.state.selectedChar,
      sfx: this.sfx,
      levelId: 'shark',
      onExit: () => this.go('menu'),
      onRoundComplete: (o) => this.onRoundComplete(o),
    })
  }

  private makePlay(): Scene {
    const lvl = this.currentLevel
    const base = {
      characterId: this.progress.state.selectedChar,
      sfx: this.sfx,
      onExit: () => this.go(lvl ? 'level' : 'menu'),
      onRoundComplete: (o: RoundOutcome) => this.onRoundComplete(o),
    }
    if (lvl) {
      const words = lvl.mode === 'telex' ? lvl.words?.vi : lvl.words?.[this.lang]
      const opts = { ...base, levelId: lvl.id, title: lvl.title[this.lang], keys: lvl.keySet, words }
      if (lvl.mode === 'telex') return new PlayTelex(opts)
      return lvl.mode === 'word' ? new PlayWord(opts) : new PlayAbc(opts)
    }
    const opts = { ...base, levelId: `practice-${this.playMode}` }
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
