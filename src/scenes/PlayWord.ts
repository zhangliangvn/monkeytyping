/**
 * Word practice scene: type whole ASCII words built from taught keys. Renders
 * the current word with Monkeytype-style per-character coloring (typed=bright,
 * current=caret in finger color, untyped=dim), a finger hint for the next key,
 * a hop-along progress monkey, and the keyboard guide.
 *
 * The falling-enemy arcade layer (lock-on, jump/attack/dodge) builds on this.
 */
import type { Scene, PlayOpts } from './Scene'
import { Round } from '../game/round'
import { fingerForChar, type Finger } from '../content/fingerMap'
import { KeyboardGuide, type GuideState } from '../keyboard/KeyboardGuide'
import { centeredText, withAlpha } from '../render/draw'

const FINGER_VI: Record<Finger, string> = {
  'L-pinky': 'ngón út trái', 'L-ring': 'ngón áp út trái', 'L-middle': 'ngón giữa trái',
  'L-index': 'ngón trỏ trái', 'R-index': 'ngón trỏ phải', 'R-middle': 'ngón giữa phải',
  'R-ring': 'ngón áp út phải', 'R-pinky': 'ngón út phải', thumb: 'ngón cái',
}

// Home-row + reach ASCII words (diacritic-free), per pedagogy research.
const STARTER_WORDS = [
  'as', 'sad', 'dad', 'fad', 'add', 'lad', 'ask', 'gas',
  'fall', 'glad', 'half', 'flag', 'dash', 'gall', 'lash', 'flask', 'salad',
]

function makeDrill(words: string[], count: number): string[] {
  const out: string[] = []
  let i = 3
  for (let n = 0; n < count; n++) {
    i = (i * 7 + 5) % words.length
    out.push(words[i]!)
  }
  return out
}

export class PlayWord implements Scene {
  private readonly total = 10
  private round = new Round(makeDrill(STARTER_WORDS, this.total))
  private guide = new KeyboardGuide()
  private timeMs = 0
  private pawT = 0
  private pulse = 0
  private wrongFlash = 0
  private hop = 0
  private monkeyX = 0

  constructor(private readonly opts: PlayOpts = {}) {}

  onKey(key: string): void {
    if (key === 'Escape') this.opts.onExit?.()
  }

  handleChar(ch: string): void {
    if (this.round.finished) return
    const res = this.round.press(ch, this.timeMs)
    if (!res.correct) {
      this.wrongFlash = 1
    } else {
      this.pawT = 0
    }
    if (res.wordCompleted) {
      this.hop = 1
      if (this.round.finished) {
        const out = this.round.result(this.timeMs)
        this.opts.onRoundComplete?.({
          levelId: this.opts.levelId ?? 'practice-word',
          stars: out.stars, accuracy: out.accuracy, cleared: out.cleared,
        })
      }
    }
  }

  update(dtMs: number): void {
    this.timeMs += dtMs
    this.pawT += (1 - this.pawT) * Math.min(1, dtMs / 140)
    this.pulse = (Math.sin(this.timeMs / 280) + 1) / 2
    this.wrongFlash = Math.max(0, this.wrongFlash - dtMs / 260)
    this.hop = Math.max(0, this.hop - dtMs / 320)
    const targetX = this.round.cleared / this.total
    this.monkeyX += (targetX - this.monkeyX) * Math.min(1, dtMs / 200)
  }

  render(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    const grad = ctx.createLinearGradient(0, 0, 0, h)
    grad.addColorStop(0, '#16213e')
    grad.addColorStop(1, '#0e1530')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)

    // progress track + hopping monkey
    const trackY = h * 0.16
    const x0 = w * 0.12
    const x1 = w * 0.88
    ctx.strokeStyle = withAlpha('#ffffff', 0.12)
    ctx.lineWidth = 4
    ctx.beginPath(); ctx.moveTo(x0, trackY); ctx.lineTo(x1, trackY); ctx.stroke()
    const mx = x0 + (x1 - x0) * this.monkeyX
    const hopY = Math.sin(this.hop * Math.PI) * h * 0.04
    centeredText(ctx, this.opts.characterEmoji ?? '🐵', mx, trackY - h * 0.03 - hopY, `${Math.round(h * 0.07)}px serif`, '#fff')
    centeredText(ctx, '🏁', x1, trackY - h * 0.03, `${Math.round(h * 0.05)}px serif`, '#fff')

    // current word with per-char caret coloring
    const word = this.round.currentWord ?? ''
    const caret = this.round.caretIndex
    this.drawWord(ctx, word, caret, w / 2, h * 0.4, Math.round(h * 0.12))

    // finger hint for next char
    const next = this.round.nextChar
    const def = next ? fingerForChar(next) : undefined
    if (def) {
      centeredText(ctx, `Dùng ${FINGER_VI[def.finger]}`, w / 2, h * 0.52,
        `600 ${Math.round(h * 0.032)}px 'Segoe UI', sans-serif`, '#cdd2ff')
    }

    // HUD
    const acc = Math.round(this.round.accuracy * 100)
    centeredText(ctx, `🎯 ${acc}%`, w * 0.1, h * 0.06, `600 ${Math.round(h * 0.03)}px 'Segoe UI'`, '#9ef0a0')
    centeredText(ctx, `🔥 ${this.round.comboCount}`, w * 0.9, h * 0.06, `600 ${Math.round(h * 0.03)}px 'Segoe UI'`, '#ffd166')
    centeredText(ctx, `Từ ${this.round.cleared}/${this.total}`, w / 2, h * 0.06,
      `600 ${Math.round(h * 0.028)}px 'Segoe UI'`, withAlpha('#ffffff', 0.7))

    // keyboard guide
    const kb = { x: w * 0.06, y: h * 0.58, w: w * 0.88, h: h * 0.36 }
    const state: GuideState = {
      nextChar: next, pawT: this.pawT, pulse: this.pulse,
      showColors: true, showPaws: true, wrongFlash: this.wrongFlash,
    }
    this.guide.render(ctx, kb, state)
  }

  private drawWord(
    ctx: CanvasRenderingContext2D, word: string, caret: number,
    cx: number, cy: number, fontPx: number,
  ): void {
    ctx.font = `800 ${fontPx}px 'Consolas', 'Segoe UI', monospace`
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'left'
    const widths = [...word].map((c) => ctx.measureText(c.toUpperCase()).width)
    const gap = fontPx * 0.08
    const totalW = widths.reduce((s, x) => s + x, 0) + gap * Math.max(0, word.length - 1)
    let x = cx - totalW / 2
    for (let i = 0; i < word.length; i++) {
      const ch = word[i]!
      const def = fingerForChar(ch)
      const isCaret = i === caret
      const color = i < caret ? '#ffffff'
        : isCaret ? (def?.color ?? '#ffd166')
          : withAlpha('#ffffff', 0.28)
      ctx.fillStyle = color
      ctx.fillText(ch.toUpperCase(), x, cy)
      if (isCaret) {
        ctx.fillStyle = def?.color ?? '#ffd166'
        ctx.fillRect(x, cy + fontPx * 0.42, widths[i]!, Math.max(3, fontPx * 0.06))
      }
      x += widths[i]! + gap
    }
  }
}
