/**
 * ABC practice scene: type single letters to learn finger placement. Shows the
 * big target letter (tinted by its finger), a Vietnamese finger hint, a live
 * HUD, and the keyboard guide with monkey paws.
 *
 * This is the first runnable vertical slice that demonstrates the differentiator.
 */
import type { Scene, PlayOpts } from './Scene'
import { Round } from '../game/round'
import { fingerForChar, type Finger } from '../content/fingerMap'
import { characterById } from '../content/characters'
import { KeyboardGuide, type GuideState } from '../keyboard/KeyboardGuide'
import { centeredText, withAlpha } from '../render/draw'
import { drawCharacterFace } from '../render/characterArt'

const FINGER_VI: Record<Finger, string> = {
  'L-pinky': 'ngón út trái',
  'L-ring': 'ngón áp út trái',
  'L-middle': 'ngón giữa trái',
  'L-index': 'ngón trỏ trái',
  'R-index': 'ngón trỏ phải',
  'R-middle': 'ngón giữa phải',
  'R-ring': 'ngón áp út phải',
  'R-pinky': 'ngón út phải',
  thumb: 'ngón cái',
}

/** Home-row-first key set for the starter drill. */
const STARTER_KEYS = ['f', 'j', 'd', 'k', 's', 'l', 'a', ';', 'g', 'h']

function makeDrill(keys: string[], length: number): string[] {
  // simple pseudo-shuffle without Math.random (deterministic, varied enough)
  const out: string[] = []
  let i = 7
  for (let n = 0; n < length; n++) {
    i = (i * 5 + 3) % keys.length
    out.push(keys[i]!)
  }
  return out
}

export class PlayAbc implements Scene {
  private readonly total = 20
  private round: Round
  private guide = new KeyboardGuide()
  private timeMs = 0
  private pawT = 0
  private pulse = 0
  private wrongFlash = 0
  private monkeyBounce = 0

  constructor(private readonly opts: PlayOpts = {}) {
    this.round = new Round(makeDrill(opts.keys ?? STARTER_KEYS, this.total))
  }

  onKey(key: string): void {
    if (key === 'Escape') this.opts.onExit?.()
  }

  handleChar(ch: string): void {
    if (this.round.finished) return
    const res = this.round.press(ch, this.timeMs)
    if (!res.correct) {
      this.wrongFlash = 1
      this.opts.sfx?.keyWrong()
    } else {
      this.monkeyBounce = 1
      this.pawT = 0
      this.opts.sfx?.keyOk(0)
      this.opts.sfx?.banana()
    }
    if (res.wordCompleted && this.round.finished) {
      const out = this.round.result(this.timeMs)
      this.opts.onRoundComplete?.({
        levelId: this.opts.levelId ?? 'practice-abc',
        stars: out.stars, accuracy: out.accuracy, cleared: out.cleared,
      })
    }
  }

  update(dtMs: number): void {
    this.timeMs += dtMs
    this.pawT += (1 - this.pawT) * Math.min(1, dtMs / 140)
    this.pulse = (Math.sin(this.timeMs / 280) + 1) / 2
    this.wrongFlash = Math.max(0, this.wrongFlash - dtMs / 260)
    this.monkeyBounce = Math.max(0, this.monkeyBounce - dtMs / 220)
  }

  render(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    // background
    const grad = ctx.createLinearGradient(0, 0, 0, h)
    grad.addColorStop(0, '#1a1a2e')
    grad.addColorStop(1, '#10162e')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)

    const next = this.round.currentWord
    const def = next ? fingerForChar(next) : undefined

    // monkey mascot
    const bounce = Math.sin(this.monkeyBounce * Math.PI) * h * 0.02
    drawCharacterFace(ctx, characterById(this.opts.characterId ?? ''), w / 2, h * 0.16 - bounce, h * 0.12)

    // big target letter
    if (next && def) {
      centeredText(
        ctx, next.toUpperCase(), w / 2, h * 0.34,
        `800 ${Math.round(h * 0.18)}px 'Segoe UI', sans-serif`, def.color,
      )
      // finger hint
      centeredText(
        ctx, `Dùng ${FINGER_VI[def.finger]}`, w / 2, h * 0.47,
        `600 ${Math.round(h * 0.035)}px 'Segoe UI', sans-serif`, '#cdd2ff',
      )
    }

    // HUD
    const acc = Math.round(this.round.accuracy * 100)
    centeredText(ctx, `🎯 ${acc}%`, w * 0.1, h * 0.06, `600 ${Math.round(h * 0.03)}px 'Segoe UI'`, '#9ef0a0')
    centeredText(ctx, `🔥 ${this.round.comboCount}`, w * 0.9, h * 0.06, `600 ${Math.round(h * 0.03)}px 'Segoe UI'`, '#ffd166')
    centeredText(ctx, `${this.round.cleared}/${this.total}`, w / 2, h * 0.06, `600 ${Math.round(h * 0.028)}px 'Segoe UI'`, withAlpha('#ffffff', 0.7))

    // keyboard guide
    const kb = { x: w * 0.06, y: h * 0.56, w: w * 0.88, h: h * 0.38 }
    const state: GuideState = {
      nextChar: next,
      pawT: this.pawT,
      pulse: this.pulse,
      showColors: true,
      showPaws: true,
      wrongFlash: this.wrongFlash,
    }
    this.guide.render(ctx, kb, state)
  }
}
