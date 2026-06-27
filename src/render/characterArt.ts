/**
 * Character art. Most characters use an emoji placeholder; the headline
 * character is drawn procedurally on the canvas. The art is original cartoon
 * vector work (a friendly white puppy with long ears) — no external image
 * assets — so it scales crisply and can later be swapped for user-drawn sprites.
 */
import type { CharacterDef } from '../content/types'
import { centeredText } from './draw'

/** Draw a character's face/mascot centered at (cx, cy), roughly `size` px tall. */
export function drawCharacterFace(
  ctx: CanvasRenderingContext2D,
  char: CharacterDef | undefined,
  cx: number, cy: number, size: number,
): void {
  if (char?.id === 'cinnamoroll') {
    drawWhitePuppy(ctx, cx, cy, size)
    return
  }
  centeredText(ctx, char?.emoji ?? '🐵', cx, cy, `${Math.round(size * 0.92)}px serif`, '#fff')
}

/** A cute white puppy with long droopy ears, a head-curl, blue eyes and pink cheeks. */
function drawWhitePuppy(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number): void {
  const r = size * 0.34
  const WHITE = '#ffffff'
  const OUTLINE = '#cdd9f0'
  const lw = Math.max(1.2, r * 0.05)

  ctx.save()
  ctx.lineJoin = 'round'

  // ── ears (behind head): long, droopy, sweeping down and OUT past the head ──
  const drawEar = (sign: number): void => {
    ctx.save()
    ctx.translate(cx + sign * r * 0.78, cy - r * 0.28)
    ctx.rotate(sign * 1.25)
    // long rounded ear extending well beyond the head silhouette
    ctx.beginPath()
    ctx.ellipse(0, r * 1.0, r * 0.33, r * 1.12, 0, 0, Math.PI * 2)
    ctx.fillStyle = WHITE
    ctx.fill()
    ctx.lineWidth = lw
    ctx.strokeStyle = OUTLINE
    ctx.stroke()
    // soft blue inner-ear tint near the tip
    ctx.beginPath()
    ctx.ellipse(0, r * 1.25, r * 0.16, r * 0.6, 0, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(150,195,255,0.4)'
    ctx.fill()
    ctx.restore()
  }
  drawEar(-1)
  drawEar(1)

  // ── head ──
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fillStyle = WHITE
  ctx.fill()
  ctx.lineWidth = lw
  ctx.strokeStyle = OUTLINE
  ctx.stroke()

  // ── signature top curl ──
  ctx.save()
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.arc(cx + r * 0.04, cy - r * 1.04, r * 0.2, Math.PI * 0.15, Math.PI * 1.7)
  ctx.lineWidth = r * 0.16
  ctx.strokeStyle = WHITE
  ctx.stroke()
  ctx.lineWidth = lw
  ctx.strokeStyle = OUTLINE
  ctx.stroke()
  ctx.restore()

  // ── cheeks ──
  ctx.fillStyle = 'rgba(255,170,200,0.6)'
  ctx.beginPath(); ctx.arc(cx - r * 0.52, cy + r * 0.24, r * 0.18, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(cx + r * 0.52, cy + r * 0.24, r * 0.18, 0, Math.PI * 2); ctx.fill()

  // ── eyes (with shine) ──
  ctx.fillStyle = '#34406b'
  ctx.beginPath(); ctx.ellipse(cx - r * 0.32, cy - r * 0.02, r * 0.11, r * 0.21, 0, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(cx + r * 0.32, cy - r * 0.02, r * 0.11, r * 0.21, 0, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.beginPath(); ctx.arc(cx - r * 0.29, cy - r * 0.1, r * 0.04, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(cx + r * 0.35, cy - r * 0.1, r * 0.04, 0, Math.PI * 2); ctx.fill()

  // ── nose + mouth ──
  ctx.fillStyle = '#ffb0c6'
  ctx.beginPath(); ctx.ellipse(cx, cy + r * 0.16, r * 0.08, r * 0.055, 0, 0, Math.PI * 2); ctx.fill()
  ctx.strokeStyle = '#c894a8'
  ctx.lineWidth = Math.max(1, r * 0.035)
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(cx - r * 0.13, cy + r * 0.33)
  ctx.quadraticCurveTo(cx, cy + r * 0.44, cx + r * 0.13, cy + r * 0.33)
  ctx.stroke()

  ctx.restore()
}
