/**
 * Telex practice scene — the "Vietnamese superpower". Shows a real Vietnamese
 * word (with diacritics) and teaches the learner to type it on QWERTY via Telex.
 * The on-screen word colors per character as you type; a hint shows how the
 * current diacritic is made (e.g. "è = e ▸ f"); the keyboard guide + monkey paw
 * point at the next key. Built on the tested Telex engine.
 */
import type { Scene, PlayOpts, RoundOutcome } from './Scene'
import { TypingSession } from '../game/typing'
import { Stats } from '../game/stats'
import { Combo } from '../game/combo'
import { buildTelexTarget, type TelexTarget } from '../game/telex'
import { fingerForChar, type Finger } from '../content/fingerMap'
import { characterById } from '../content/characters'
import { KeyboardGuide, type GuideState } from '../keyboard/KeyboardGuide'
import { centeredText, withAlpha } from '../render/draw'
import { drawCharacterFace } from '../render/characterArt'

const FINGER_VI: Record<Finger, string> = {
  'L-pinky': 'ngón út trái', 'L-ring': 'ngón áp út trái', 'L-middle': 'ngón giữa trái',
  'L-index': 'ngón trỏ trái', 'R-index': 'ngón trỏ phải', 'R-middle': 'ngón giữa phải',
  'R-ring': 'ngón áp út phải', 'R-pinky': 'ngón út phải', thumb: 'ngón cái',
}

const FALLBACK_WORDS = ['mèo', 'chó', 'cá', 'nhà', 'mẹ', 'bà', 'gà', 'bút', 'mưa', 'kẹo']

export class PlayTelex implements Scene {
  private readonly total: number
  private targets: TelexTarget[]
  private wi = 0
  private session: TypingSession
  private stats = new Stats()
  private combo = new Combo()
  private startMs: number | null = null
  private cleared = 0
  private maxCombo = 0

  private guide = new KeyboardGuide()
  private timeMs = 0
  private pawT = 0
  private pulse = 0
  private wrongFlash = 0
  private hop = 0

  constructor(private readonly opts: PlayOpts = {}) {
    const words = (opts.words && opts.words.length > 0) ? opts.words : FALLBACK_WORDS
    this.total = Math.min(10, words.length)
    this.targets = words.slice(0, this.total).map(buildTelexTarget)
    this.session = new TypingSession(this.targets[0]!.telex)
    this.opts.tts?.speak(this.targets[0]!.display, 'vi')
  }

  private get current(): TelexTarget { return this.targets[this.wi]! }
  private get nextKey(): string | undefined {
    return this.session.done ? undefined : this.session.text[this.session.index]
  }

  onKey(key: string): void {
    if (key === 'Escape') this.opts.onExit?.()
  }

  handleChar(ch: string): void {
    if (this.wi >= this.targets.length) return
    if (this.startMs === null) this.startMs = this.timeMs
    const idx = this.session.index
    const res = this.session.press(ch)
    this.stats.record(res.correct)
    if (!res.correct) {
      this.wrongFlash = 1
      this.combo.typo()
      this.opts.sfx?.keyWrong()
    } else {
      this.pawT = 0
      this.opts.sfx?.keyOk(idx)
    }
    if (res.completed) {
      this.combo.wordCleared()
      this.maxCombo = Math.max(this.maxCombo, this.combo.count)
      this.cleared += 1
      this.hop = 1
      this.opts.sfx?.wordDone()
      this.opts.sfx?.banana()
      this.wi += 1
      if (this.wi < this.targets.length) {
        this.session = new TypingSession(this.targets[this.wi]!.telex)
        this.opts.tts?.speak(this.current.display, 'vi')
      } else {
        const accuracy = this.stats.accuracy
        const stars: 0 | 1 | 2 | 3 = accuracy >= 0.95 ? 3 : accuracy >= 0.85 ? 2 : accuracy >= 0.7 ? 1 : 0
        const out: RoundOutcome = {
          levelId: this.opts.levelId ?? 'practice-telex',
          stars, accuracy, cleared: this.cleared,
        }
        this.opts.onRoundComplete?.(out)
      }
    }
  }

  update(dtMs: number): void {
    this.timeMs += dtMs
    this.pawT += (1 - this.pawT) * Math.min(1, dtMs / 140)
    this.pulse = (Math.sin(this.timeMs / 280) + 1) / 2
    this.wrongFlash = Math.max(0, this.wrongFlash - dtMs / 260)
    this.hop = Math.max(0, this.hop - dtMs / 320)
  }

  render(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    const grad = ctx.createLinearGradient(0, 0, 0, h)
    grad.addColorStop(0, '#1b1635'); grad.addColorStop(1, '#0e1030')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)

    // mascot (hops on word complete)
    const hopY = Math.sin(this.hop * Math.PI) * h * 0.02
    drawCharacterFace(ctx, characterById(this.opts.characterId ?? ''), w / 2, h * 0.15 - hopY, h * 0.1)

    // Vietnamese word with per-character caret coloring
    const cur = this.current
    const caretTelex = this.session.index
    const currentDisplay = this.session.done ? cur.display.length : cur.telexToDisplay[caretTelex]!
    const nextDef = this.nextKey ? fingerForChar(this.nextKey) : undefined
    this.drawVietWord(ctx, cur, currentDisplay, nextDef?.color ?? '#ffd166', w / 2, h * 0.36, Math.round(h * 0.13))

    // telex hint: how to make the current character
    const seq = cur.displayTelex[currentDisplay]
    if (seq && seq.length > 1) {
      const chDisplay = cur.display[currentDisplay] ?? ''
      centeredText(ctx, `${chDisplay} = ${seq.split('').join(' ▸ ')}`, w / 2, h * 0.49,
        `700 ${Math.round(h * 0.034)}px 'Segoe UI'`, '#ffd166')
    }

    // finger hint for the next key
    if (nextDef) {
      centeredText(ctx, `Dùng ${FINGER_VI[nextDef.finger]} — phím ${this.nextKey!.toUpperCase()}`,
        w / 2, h * 0.545, `600 ${Math.round(h * 0.03)}px 'Segoe UI'`, '#cdd2ff')
    }

    // HUD
    const acc = Math.round(this.stats.accuracy * 100)
    centeredText(ctx, `🎯 ${acc}%`, w * 0.1, h * 0.06, `600 ${Math.round(h * 0.03)}px 'Segoe UI'`, '#9ef0a0')
    centeredText(ctx, `🔥 ${this.combo.count}`, w * 0.9, h * 0.06, `600 ${Math.round(h * 0.03)}px 'Segoe UI'`, '#ffd166')
    centeredText(ctx, `🇻🇳 Telex ${this.cleared}/${this.total}`, w / 2, h * 0.06,
      `600 ${Math.round(h * 0.028)}px 'Segoe UI'`, withAlpha('#ffffff', 0.7))

    // keyboard guide
    const kb = { x: w * 0.06, y: h * 0.58, w: w * 0.88, h: h * 0.36 }
    const state: GuideState = {
      nextChar: this.nextKey, pawT: this.pawT, pulse: this.pulse,
      showColors: true, showPaws: true, wrongFlash: this.wrongFlash,
    }
    this.guide.render(ctx, kb, state)
  }

  private drawVietWord(
    ctx: CanvasRenderingContext2D, target: TelexTarget, currentDisplay: number,
    caretColor: string, cx: number, cy: number, fontPx: number,
  ): void {
    const word = target.display
    ctx.font = `800 ${fontPx}px 'Segoe UI', sans-serif`
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'left'
    const widths = [...word].map((c) => ctx.measureText(c).width)
    const gap = fontPx * 0.06
    const totalW = widths.reduce((s, x) => s + x, 0) + gap * Math.max(0, word.length - 1)
    let x = cx - totalW / 2
    for (let i = 0; i < word.length; i++) {
      const isCaret = i === currentDisplay
      const color = i < currentDisplay ? '#ffffff'
        : isCaret ? caretColor
          : withAlpha('#ffffff', 0.28)
      ctx.fillStyle = color
      ctx.fillText(word[i]!, x, cy)
      if (isCaret) {
        ctx.fillStyle = caretColor
        ctx.fillRect(x, cy + fontPx * 0.42, widths[i]!, Math.max(3, fontPx * 0.06))
      }
      x += widths[i]! + gap
    }
  }
}
