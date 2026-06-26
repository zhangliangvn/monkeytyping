/** Small canvas drawing helpers shared across renderers. */
import type { Rect } from '../keyboard/layout'

export function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
): void {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}

export function fillRoundRect(
  ctx: CanvasRenderingContext2D, rect: Rect, r: number, fill: string,
): void {
  roundRectPath(ctx, rect.x, rect.y, rect.w, rect.h, r)
  ctx.fillStyle = fill
  ctx.fill()
}

export function strokeRoundRect(
  ctx: CanvasRenderingContext2D, rect: Rect, r: number, stroke: string, width: number,
): void {
  roundRectPath(ctx, rect.x, rect.y, rect.w, rect.h, r)
  ctx.strokeStyle = stroke
  ctx.lineWidth = width
  ctx.stroke()
}

export function centeredText(
  ctx: CanvasRenderingContext2D,
  text: string, cx: number, cy: number, font: string, fill: string,
): void {
  ctx.font = font
  ctx.fillStyle = fill
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, cx, cy)
}

/** Hex (#rrggbb) + alpha 0..1 → rgba() string. */
export function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const n = h.length === 3
    ? h.split('').map((c) => c + c).join('')
    : h
  const r = parseInt(n.slice(0, 2), 16)
  const g = parseInt(n.slice(2, 4), 16)
  const b = parseInt(n.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/** Linear interpolation. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}
