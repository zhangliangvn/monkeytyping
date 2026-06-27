/**
 * Shark mode — classic "type fast or the shark gets you" time pressure.
 *
 * A shark steadily swims toward the monkey: its position IS the countdown.
 * Typing pushes it back a little per correct key and a lot per finished word, so
 * staying alive means typing quickly. If it reaches the monkey it bites — you
 * lose a heart and it resets (kind failure, no harsh Game Over). It swims faster
 * the more words you clear. The keyboard guide + finger paw stay on, so the time
 * pressure still reinforces correct finger placement.
 *
 * Danger is tracked as a 0..1 fraction (1 = far/safe, 0 = bite) so the mechanic
 * is resolution-independent; render maps it to the shark's x position.
 */
import type { Scene, PlayOpts, RoundOutcome } from './Scene'
import { TypingSession } from '../game/typing'
import { Stats } from '../game/stats'
import { Combo } from '../game/combo'
import { fingerForChar } from '../content/fingerMap'
import { characterById } from '../content/characters'
import { KeyboardGuide, type GuideState } from '../keyboard/KeyboardGuide'
import { centeredText, withAlpha } from '../render/draw'
import { drawCharacterFace } from '../render/characterArt'

const POOL = [
  'cat', 'dog', 'sun', 'fish', 'jump', 'star', 'swim', 'wave', 'boat', 'crab',
  'fast', 'type', 'blue', 'sea', 'run', 'win', 'gold', 'duck', 'frog', 'ship',
]

const PUSH_PER_CHAR = 0.04
const PUSH_PER_WORD = 0.45

export class PlayShark implements Scene {
  private pool: string[]
  private session: TypingSession
  private stats = new Stats()
  private combo = new Combo()
  private maxCombo = 0
  private cleared = 0
  private readonly target = 15
  private hearts = 3
  private score = 0
  private danger = 1 // 1 = safe (far), 0 = bite
  private invuln = 0
  private ended = false

  private wordSeed = 5
  private timeMs = 0
  private pawT = 0
  private pulse = 0
  private wrongFlash = 0
  private biteFlash = 0
  private guide = new KeyboardGuide()

  constructor(private readonly opts: PlayOpts = {}) {
    this.pool = (opts.words && opts.words.length >= 6) ? opts.words : POOL
    this.session = new TypingSession(this.nextWord())
  }

  private nextWord(): string {
    this.wordSeed = (this.wordSeed * 7 + 11) % 100000
    return this.pool[this.wordSeed % this.pool.length]!
  }

  private get drainPerSec(): number { return 0.12 + this.cleared * 0.006 }

  onKey(key: string): void {
    if (key === 'Escape') this.opts.onExit?.()
  }

  handleChar(ch: string): void {
    if (this.ended) return
    const idx = this.session.index
    const res = this.session.press(ch)
    this.stats.record(res.correct)
    if (!res.correct) {
      this.wrongFlash = 1
      this.combo.typo()
      this.opts.sfx?.keyWrong()
      return
    }
    this.pawT = 0
    this.opts.sfx?.keyOk(idx)
    this.danger = Math.min(1, this.danger + PUSH_PER_CHAR)
    if (res.completed) {
      this.combo.wordCleared()
      this.maxCombo = Math.max(this.maxCombo, this.combo.count)
      this.cleared += 1
      this.score += this.session.text.length * 10 * (1 + this.combo.tier)
      this.danger = Math.min(1, this.danger + PUSH_PER_WORD)
      this.opts.sfx?.wordDone()
      this.opts.sfx?.banana()
      if (this.cleared >= this.target) { this.finish(); return }
      this.session = new TypingSession(this.nextWord())
    }
  }

  update(dtMs: number): void {
    this.timeMs += dtMs
    this.pawT += (1 - this.pawT) * Math.min(1, dtMs / 140)
    this.pulse = (Math.sin(this.timeMs / 280) + 1) / 2
    this.wrongFlash = Math.max(0, this.wrongFlash - dtMs / 260)
    this.biteFlash = Math.max(0, this.biteFlash - dtMs / 400)
    this.invuln = Math.max(0, this.invuln - dtMs)
    if (this.ended) return

    this.danger -= (this.drainPerSec * dtMs) / 1000
    if (this.danger <= 0) {
      this.hearts -= 1
      this.danger = 1
      this.invuln = 800
      this.biteFlash = 1
      this.combo.typo()
      this.opts.sfx?.keyWrong()
      if (this.hearts <= 0) this.finish()
    }
  }

  private finish(): void {
    if (this.ended) return
    this.ended = true
    const accuracy = this.stats.accuracy
    const stars: 0 | 1 | 2 | 3 = accuracy >= 0.95 ? 3 : accuracy >= 0.85 ? 2 : accuracy >= 0.7 ? 1 : 0
    const out: RoundOutcome = {
      levelId: this.opts.levelId ?? 'shark', stars, accuracy, cleared: this.cleared,
    }
    this.opts.onRoundComplete?.(out)
  }

  render(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    // sea
    const grad = ctx.createLinearGradient(0, 0, 0, h)
    grad.addColorStop(0, '#0a3d6b'); grad.addColorStop(0.55, '#0e5a86'); grad.addColorStop(1, '#062544')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)

    const waterY = h * 0.42
    const monkeyX = w * 0.16
    const biteX = w * 0.28
    const startX = w * 0.95
    const sharkX = biteX + this.danger * (startX - biteX)

    // danger vignette when the shark is close
    if (this.danger < 0.34) {
      const a = (0.34 - this.danger) / 0.34
      ctx.fillStyle = withAlpha('#ff2b2b', 0.18 * a * (0.6 + 0.4 * this.pulse))
      ctx.fillRect(0, 0, w, h)
    }
    if (this.biteFlash > 0) {
      ctx.fillStyle = withAlpha('#ff0000', 0.4 * this.biteFlash)
      ctx.fillRect(0, 0, w, h)
    }

    // monkey on a little raft
    centeredText(ctx, '🛟', monkeyX, waterY + h * 0.05, `${Math.round(h * 0.07)}px serif`, '#fff')
    const blink = this.invuln > 0 && Math.floor(this.timeMs / 100) % 2 === 0
    if (!blink) drawCharacterFace(ctx, characterById(this.opts.characterId ?? ''), monkeyX, waterY - h * 0.01, h * 0.1)

    // shark (faces left toward the monkey)
    ctx.save()
    ctx.translate(sharkX, waterY)
    ctx.scale(-1, 1) // flip emoji to face left
    centeredText(ctx, '🦈', 0, 0, `${Math.round(h * 0.1)}px serif`, '#fff')
    ctx.restore()

    // danger meter bar
    const barW = w * 0.5, barX = w / 2 - barW / 2, barY = h * 0.14
    ctx.fillStyle = withAlpha('#000000', 0.35)
    ctx.fillRect(barX, barY, barW, h * 0.018)
    const dColor = this.danger > 0.5 ? '#4caf50' : this.danger > 0.25 ? '#ffd166' : '#ff4d4d'
    ctx.fillStyle = dColor
    ctx.fillRect(barX, barY, barW * this.danger, h * 0.018)

    // current word with caret coloring
    const word = this.session.text
    const caret = this.session.index
    const nextDef = caret < word.length ? fingerForChar(word[caret]!) : undefined
    this.drawWord(ctx, word, caret, nextDef?.color ?? '#ffd166', w / 2, h * 0.27, Math.round(h * 0.085))

    if (nextDef) {
      centeredText(ctx, `phím ${word[caret]!.toUpperCase()}`, w / 2, h * 0.36,
        `600 ${Math.round(h * 0.028)}px 'Segoe UI'`, withAlpha('#ffffff', 0.8))
    }

    // HUD
    centeredText(ctx, `⭐ ${this.score}`, w * 0.12, h * 0.06, `700 ${Math.round(h * 0.03)}px 'Segoe UI'`, '#ffd166')
    centeredText(ctx, `${'❤️'.repeat(this.hearts)}${'🖤'.repeat(Math.max(0, 3 - this.hearts))}`, w * 0.5, h * 0.06, `${Math.round(h * 0.028)}px serif`, '#fff')
    centeredText(ctx, `🐟 ${this.cleared}/${this.target}`, w * 0.88, h * 0.06, `700 ${Math.round(h * 0.03)}px 'Segoe UI'`, '#9ef0a0')

    // keyboard guide
    const kb = { x: w * 0.07, y: h * 0.6, w: w * 0.86, h: h * 0.34 }
    const state: GuideState = {
      nextChar: caret < word.length ? word[caret] : undefined,
      pawT: this.pawT, pulse: this.pulse, showColors: true, showPaws: true, wrongFlash: this.wrongFlash,
    }
    this.guide.render(ctx, kb, state)
  }

  private drawWord(
    ctx: CanvasRenderingContext2D, word: string, caret: number,
    caretColor: string, cx: number, cy: number, fontPx: number,
  ): void {
    ctx.font = `800 ${fontPx}px 'Consolas', 'Segoe UI', monospace`
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'left'
    const widths = [...word].map((c) => ctx.measureText(c.toUpperCase()).width)
    const gap = fontPx * 0.08
    const totalW = widths.reduce((s, x) => s + x, 0) + gap * Math.max(0, word.length - 1)
    let x = cx - totalW / 2
    for (let i = 0; i < word.length; i++) {
      const isCaret = i === caret
      const color = i < caret ? '#ffffff' : isCaret ? caretColor : withAlpha('#ffffff', 0.3)
      ctx.fillStyle = color
      ctx.fillText(word[i]!.toUpperCase(), x, cy)
      if (isCaret) {
        ctx.fillStyle = caretColor
        ctx.fillRect(x, cy + fontPx * 0.42, widths[i]!, Math.max(3, fontPx * 0.06))
      }
      x += widths[i]! + gap
    }
  }
}
