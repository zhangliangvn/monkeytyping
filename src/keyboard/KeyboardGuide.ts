/**
 * Renders the on-screen keyboard guide — the game's #1 differentiator.
 *
 * Three redundant guidance channels (never color alone; spec §2.2):
 *   1. Color  — each key tinted by the finger that presses it.
 *   2. Paw    — two translucent monkey paws; the correct finger reaches the key.
 *   3. Position — left/right tint + G/H divider + F/J bumps.
 *
 * Pure geometry comes from layout.ts; this module only draws.
 */
import { layoutKeyboard, type Rect } from './layout'
import { KEY_MAP } from '../content/fingerMap'
import { HOME_KEY, activeFinger } from './paws'
import type { Finger } from '../content/fingerMap'
import { fillRoundRect, strokeRoundRect, centeredText, withAlpha, lerp } from '../render/draw'

export interface GuideState {
  /** Char to press next: a single lowercase letter, punctuation, or ' '. */
  nextChar?: string
  /** Paw strike animation, 0 = resting on home key, 1 = on the target key. */
  pawT: number
  /** Glow pulse 0..1 for the next-key highlight. */
  pulse: number
  showColors: boolean
  showPaws: boolean
  /** Red flash 0..1 on a wrong key press. */
  wrongFlash: number
}

const KEY_RADIUS = 8
const PANEL_BG = '#0f1024'
const KEY_BG_L = '#262c52'
const KEY_BG_R = '#222a4e'
const LABEL = '#e7e9ff'
const BROWN = '#6b4226'

const LEFT_FINGERS: Finger[] = ['L-pinky', 'L-ring', 'L-middle', 'L-index']
const RIGHT_FINGERS: Finger[] = ['R-index', 'R-middle', 'R-ring', 'R-pinky']

export class KeyboardGuide {
  render(ctx: CanvasRenderingContext2D, bounds: Rect, state: GuideState): void {
    fillRoundRect(ctx, bounds, 16, PANEL_BG)

    const pad = Math.round(bounds.h * 0.06)
    const inner: Rect = {
      x: bounds.x + pad, y: bounds.y + pad,
      w: bounds.w - pad * 2, h: bounds.h - pad * 2,
    }
    const map = layoutKeyboard(inner)
    const next = normalize(state.nextChar)

    for (const [label, rect] of map) this.drawKey(ctx, label, rect, next, state, inner)
    this.drawGHDivider(ctx, map)
    if (state.showPaws) this.drawPaws(ctx, map, next, state)
  }

  private drawKey(
    ctx: CanvasRenderingContext2D, label: string, rect: Rect,
    next: string | undefined, state: GuideState, inner: Rect,
  ): void {
    const def = KEY_MAP[label]
    const isNext = next !== undefined && label === next
    const sideLeft = def ? def.hand === 'L' : rect.x + rect.w / 2 < inner.x + inner.w / 2

    // base
    fillRoundRect(ctx, rect, KEY_RADIUS, sideLeft ? KEY_BG_L : KEY_BG_R)

    // finger color
    if (def && state.showColors) {
      fillRoundRect(ctx, rect, KEY_RADIUS, withAlpha(def.color, isNext ? 0.32 : 0.16))
      // bottom finger stripe
      const stripeH = Math.max(3, rect.h * 0.12)
      fillRoundRect(
        ctx,
        { x: rect.x, y: rect.y + rect.h - stripeH, w: rect.w, h: stripeH },
        3, withAlpha(def.color, isNext ? 1 : 0.85),
      )
    } else {
      strokeRoundRect(ctx, rect, KEY_RADIUS, '#3a4166', 1)
    }

    // next-key glow
    if (isNext) {
      const glow = def ? def.color : '#ffd166'
      ctx.save()
      ctx.shadowColor = glow
      ctx.shadowBlur = lerp(10, 28, state.pulse)
      strokeRoundRect(ctx, rect, KEY_RADIUS, glow, lerp(2.5, 4.5, state.pulse))
      ctx.restore()
      if (state.wrongFlash > 0) {
        fillRoundRect(ctx, rect, KEY_RADIUS, withAlpha('#ff3b3b', 0.5 * state.wrongFlash))
      }
    }

    // F / J bumps
    if (def?.hasBump) {
      const by = rect.y + rect.h - Math.max(6, rect.h * 0.2)
      const bw = rect.w * 0.34
      fillRoundRect(
        ctx, { x: rect.x + rect.w / 2 - bw / 2, y: by, w: bw, h: 3 }, 2,
        withAlpha(LABEL, 0.9),
      )
    }

    // label
    const fontPx = Math.round(Math.min(rect.h * 0.42, rect.w * 0.5))
    const text = label.length === 1 ? label.toUpperCase() : shortLabel(label)
    centeredText(
      ctx, text, rect.x + rect.w / 2, rect.y + rect.h * 0.42,
      `600 ${fontPx}px 'Segoe UI', sans-serif`, isNext ? '#ffffff' : LABEL,
    )
  }

  private drawGHDivider(ctx: CanvasRenderingContext2D, map: Map<string, Rect>): void {
    const g = map.get('g')
    const h = map.get('h')
    if (!g || !h) return
    const x = (g.x + g.w + h.x) / 2
    const top = map.get('5')?.y ?? g.y
    const bottom = (map.get('b')?.y ?? g.y + g.h) + g.h
    ctx.save()
    ctx.strokeStyle = withAlpha('#ffffff', 0.10)
    ctx.lineWidth = 2
    ctx.setLineDash([6, 6])
    ctx.beginPath()
    ctx.moveTo(x, top)
    ctx.lineTo(x, bottom)
    ctx.stroke()
    ctx.restore()
  }

  private drawPaws(
    ctx: CanvasRenderingContext2D, map: Map<string, Rect>,
    next: string | undefined, state: GuideState,
  ): void {
    const activeF = next !== undefined ? activeFinger(next) : undefined
    this.drawHand(ctx, map, LEFT_FINGERS, 'L', next, activeF, state)
    this.drawHand(ctx, map, RIGHT_FINGERS, 'R', next, activeF, state)
  }

  private drawHand(
    ctx: CanvasRenderingContext2D, map: Map<string, Rect>,
    fingers: Finger[], hand: 'L' | 'R',
    next: string | undefined, activeF: Finger | undefined, state: GuideState,
  ): void {
    const homeRects = fingers.map((f) => map.get(HOME_KEY[f])).filter(Boolean) as Rect[]
    if (homeRects.length === 0) return

    const homeRow = homeRects[0]!
    const minX = Math.min(...homeRects.map((r) => r.x))
    const maxX = Math.max(...homeRects.map((r) => r.x + r.w))
    // palm sits below the keyboard, fingers reach up
    const palmCx = (minX + maxX) / 2
    const palmTop = homeRow.y + homeRow.h * 2.6
    const palmW = (maxX - minX) * 1.05
    const palmH = homeRow.h * 1.1

    ctx.save()
    // palm
    fillRoundRect(
      ctx, { x: palmCx - palmW / 2, y: palmTop, w: palmW, h: palmH },
      palmH / 2, withAlpha(BROWN, 0.45),
    )

    for (const f of fingers) {
      const homeR = map.get(HOME_KEY[f])
      if (!homeR) continue
      const homeCx = homeR.x + homeR.w / 2
      const homeCy = homeR.y + homeR.h / 2
      const isActive = f === activeF && next !== undefined
      let tipX = homeCx
      let tipY = homeCy
      if (isActive) {
        const target = map.get(next!)
        if (target) {
          tipX = lerp(homeCx, target.x + target.w / 2, state.pawT)
          tipY = lerp(homeCy, target.y + target.h / 2, state.pawT)
        }
      }
      const knuckleX = lerp(palmCx, homeCx, 0.55)
      const knuckleY = palmTop
      const fingerColor = isActive
        ? (KEY_MAP[next!]?.color ?? '#ffd166')
        : BROWN
      const alpha = isActive ? 0.95 : 0.5
      // finger as a thick capsule
      ctx.strokeStyle = withAlpha(fingerColor, alpha)
      ctx.lineCap = 'round'
      ctx.lineWidth = Math.max(8, homeR.w * 0.42)
      if (isActive) { ctx.shadowColor = fingerColor; ctx.shadowBlur = 16 }
      ctx.beginPath()
      ctx.moveTo(knuckleX, knuckleY)
      ctx.lineTo(tipX, tipY)
      ctx.stroke()
      ctx.shadowBlur = 0
      // fingertip
      ctx.fillStyle = withAlpha(isActive ? fingerColor : BROWN, isActive ? 1 : 0.6)
      ctx.beginPath()
      ctx.arc(tipX, tipY, Math.max(6, homeR.w * 0.26), 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
    void hand
  }
}

function normalize(ch: string | undefined): string | undefined {
  if (ch === undefined) return undefined
  if (ch === ' ') return 'space'
  return ch.toLowerCase()
}

function shortLabel(label: string): string {
  switch (label) {
    case 'space': return '␣'
    case 'Backspace': return '⌫'
    case 'Enter': return '⏎'
    case 'ShiftL':
    case 'ShiftR': return '⇧'
    case 'Caps': return '⇪'
    case 'Tab': return '⇥'
    case 'CtrlL':
    case 'CtrlR': return 'Ctrl'
    case 'AltL':
    case 'AltR': return 'Alt'
    default: return label
  }
}
