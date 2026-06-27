/**
 * Parametric "kawaii" face renderer. Every character is an original cartoon
 * design described by a small spec (face color, ear shape, cheeks, accessory,
 * snout, eyes). One renderer draws them all on the canvas — no image assets — so
 * the whole cast is cohesive and easy to extend with a few lines of data.
 */
import type { CuteSpec, EarType } from '../content/types'
export type { CuteSpec } from '../content/types'

function circle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, fill: string, stroke?: string, lw = 1): void {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fillStyle = fill
  ctx.fill()
  if (stroke) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.stroke() }
}

function ell(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, fill: string, rot = 0, stroke?: string, lw = 1): void {
  ctx.beginPath()
  ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2)
  ctx.fillStyle = fill
  ctx.fill()
  if (stroke) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.stroke() }
}

export function drawCute(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, s: CuteSpec): void {
  const r = size * 0.34
  const edge = s.edge ?? '#cdd4e0'
  const lw = Math.max(1.2, r * 0.05)
  const earColor = s.earColor ?? s.face
  ctx.save()
  ctx.lineJoin = 'round'

  if (s.ear === 'frog') { drawFrog(ctx, cx, cy, r, s, edge, lw); ctx.restore(); return }

  drawEars(ctx, cx, cy, r, s.ear, earColor, s.innerEar, edge, lw)

  // head
  circle(ctx, cx, cy, r, s.face, edge, lw)

  // eye patches (panda)
  if (s.eyePatch) {
    ell(ctx, cx - r * 0.34, cy - r * 0.02, r * 0.22, r * 0.3, s.eyePatch, 0.25)
    ell(ctx, cx + r * 0.34, cy - r * 0.02, r * 0.22, r * 0.3, s.eyePatch, -0.25)
  }

  // cheeks
  if (s.cheeks) {
    ctx.globalAlpha = 0.7
    circle(ctx, cx - r * 0.52, cy + r * 0.26, r * 0.17, s.cheeks)
    circle(ctx, cx + r * 0.52, cy + r * 0.26, r * 0.17, s.cheeks)
    ctx.globalAlpha = 1
  }

  // snout (dogs/bears/fox/koala)
  let mouthY = cy + r * 0.34
  if (s.snout) {
    ell(ctx, cx, cy + r * 0.28, r * 0.42, r * 0.32, s.snout, 0, edge, lw * 0.8)
    mouthY = cy + r * 0.34
  }

  // eyes
  const eyeY = cy - r * 0.02
  const eyeColor = '#34406b'
  ell(ctx, cx - r * 0.3, eyeY, r * 0.11, r * 0.21, eyeColor)
  ell(ctx, cx + r * 0.3, eyeY, r * 0.11, r * 0.21, eyeColor)
  circle(ctx, cx - r * 0.27, eyeY - r * 0.08, r * 0.04, '#ffffff')
  circle(ctx, cx + r * 0.33, eyeY - r * 0.08, r * 0.04, '#ffffff')

  // nose / beak
  if (s.beak) {
    ctx.beginPath()
    ctx.moveTo(cx - r * 0.13, cy + r * 0.14)
    ctx.lineTo(cx + r * 0.13, cy + r * 0.14)
    ctx.lineTo(cx, cy + r * 0.34)
    ctx.closePath()
    ctx.fillStyle = s.beak
    ctx.fill()
    mouthY = cy + r * 0.4
  } else if (s.ear === 'pig') {
    // pig snout
    ell(ctx, cx, cy + r * 0.22, r * 0.22, r * 0.16, s.snout ?? '#ffd0e0', 0, edge, lw * 0.6)
    circle(ctx, cx - r * 0.07, cy + r * 0.22, r * 0.035, '#d98aa8')
    circle(ctx, cx + r * 0.07, cy + r * 0.22, r * 0.035, '#d98aa8')
    mouthY = cy + r * 0.42
  } else {
    const nose = s.nose ?? '#ffb0c6'
    ell(ctx, cx, cy + (s.snout ? r * 0.16 : r * 0.17), r * 0.08, r * 0.06, nose)
  }

  // mouth
  if (!s.beak) {
    ctx.strokeStyle = s.snout ? '#a9805e' : '#c894a8'
    ctx.lineWidth = Math.max(1, r * 0.035)
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(cx - r * 0.12, mouthY)
    ctx.quadraticCurveTo(cx, mouthY + r * 0.1, cx + r * 0.12, mouthY)
    ctx.stroke()
  }

  drawAccessory(ctx, cx, cy, r, s)
  ctx.restore()
}

function drawEars(
  ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number,
  ear: EarType, color: string, inner: string | undefined, edge: string, lw: number,
): void {
  const side = (sign: number, fn: () => void): void => { ctx.save(); fn(); ctx.restore(); void sign }
  switch (ear) {
    case 'puppy':
      for (const sign of [-1, 1]) side(sign, () => {
        ctx.translate(cx + sign * r * 0.78, cy - r * 0.28); ctx.rotate(sign * 1.25)
        ell(ctx, 0, r * 1.0, r * 0.33, r * 1.12, color, 0, edge, lw)
        if (inner) { ctx.globalAlpha = 0.5; ell(ctx, 0, r * 1.25, r * 0.16, r * 0.6, inner); ctx.globalAlpha = 1 }
      })
      break
    case 'bunny':
      for (const sign of [-1, 1]) side(sign, () => {
        ctx.translate(cx + sign * r * 0.42, cy - r * 0.72); ctx.rotate(sign * 0.18)
        ell(ctx, 0, -r * 0.55, r * 0.26, r * 0.95, color, 0, edge, lw)
        if (inner) { ctx.globalAlpha = 0.6; ell(ctx, 0, -r * 0.55, r * 0.13, r * 0.66, inner); ctx.globalAlpha = 1 }
      })
      break
    case 'cat':
    case 'fox':
      for (const sign of [-1, 1]) {
        const h = ear === 'fox' ? r * 0.95 : r * 0.7
        const bx = cx + sign * r * 0.58
        ctx.beginPath()
        ctx.moveTo(bx - r * 0.3, cy - r * 0.6)
        ctx.lineTo(bx + r * 0.3, cy - r * 0.55)
        ctx.lineTo(bx + sign * r * 0.05, cy - r * 0.6 - h)
        ctx.closePath()
        ctx.fillStyle = color; ctx.fill(); ctx.lineWidth = lw; ctx.strokeStyle = edge; ctx.stroke()
      }
      break
    case 'bear':
    case 'round':
      for (const sign of [-1, 1]) {
        const rr = ear === 'round' ? r * 0.42 : r * 0.34
        const ex = cx + sign * r * 0.7
        const ey = cy - r * 0.72
        circle(ctx, ex, ey, rr, color, edge, lw)
        if (inner) circle(ctx, ex, ey, rr * 0.55, inner)
      }
      break
    case 'pig':
      for (const sign of [-1, 1]) {
        const bx = cx + sign * r * 0.6
        ctx.beginPath()
        ctx.moveTo(bx - r * 0.22, cy - r * 0.62)
        ctx.lineTo(bx + r * 0.26, cy - r * 0.6)
        ctx.lineTo(bx + sign * r * 0.1, cy - r * 0.3)
        ctx.closePath()
        ctx.fillStyle = color; ctx.fill(); ctx.lineWidth = lw; ctx.strokeStyle = edge; ctx.stroke()
      }
      break
    case 'none':
    case 'frog':
      break
  }
}

function drawFrog(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, s: CuteSpec, edge: string, lw: number): void {
  // head
  circle(ctx, cx, cy + r * 0.08, r, s.face, edge, lw)
  // bulging eyes on top
  for (const sign of [-1, 1]) {
    const ex = cx + sign * r * 0.5
    const ey = cy - r * 0.62
    circle(ctx, ex, ey, r * 0.4, s.face, edge, lw)
    circle(ctx, ex, ey, r * 0.22, '#ffffff')
    circle(ctx, ex + sign * r * 0.02, ey + r * 0.02, r * 0.1, '#222')
    circle(ctx, ex - sign * r * 0.04, ey - r * 0.04, r * 0.035, '#fff')
  }
  // cheeks
  if (s.cheeks) {
    ctx.globalAlpha = 0.7
    circle(ctx, cx - r * 0.55, cy + r * 0.2, r * 0.16, s.cheeks)
    circle(ctx, cx + r * 0.55, cy + r * 0.2, r * 0.16, s.cheeks)
    ctx.globalAlpha = 1
  }
  // big smile
  ctx.strokeStyle = '#2e6b2e'
  ctx.lineWidth = Math.max(1.5, r * 0.05)
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.arc(cx, cy + r * 0.1, r * 0.55, Math.PI * 0.12, Math.PI * 0.88)
  ctx.stroke()
}

function drawAccessory(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, s: CuteSpec): void {
  const col = s.accessoryColor ?? '#ff7eb6'
  switch (s.accessory) {
    case 'curl':
      ctx.save(); ctx.lineCap = 'round'
      ctx.beginPath(); ctx.arc(cx + r * 0.04, cy - r * 1.04, r * 0.2, Math.PI * 0.15, Math.PI * 1.7)
      ctx.lineWidth = r * 0.16; ctx.strokeStyle = s.face; ctx.stroke()
      ctx.lineWidth = Math.max(1, r * 0.045); ctx.strokeStyle = s.edge ?? '#cdd4e0'; ctx.stroke()
      ctx.restore(); break
    case 'bow': {
      const bx = cx + r * 0.62, by = cy - r * 0.72
      for (const sign of [-1, 1]) { ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + sign * r * 0.34, by - r * 0.22); ctx.lineTo(bx + sign * r * 0.34, by + r * 0.22); ctx.closePath(); ctx.fillStyle = col; ctx.fill() }
      circle(ctx, bx, by, r * 0.1, col); break
    }
    case 'beret':
      ell(ctx, cx, cy - r * 0.92, r * 0.6, r * 0.3, col, -0.12)
      circle(ctx, cx + r * 0.5, cy - r * 1.12, r * 0.07, col); break
    case 'horn':
      for (const sign of [-1, 1]) { ctx.beginPath(); ctx.moveTo(cx + sign * r * 0.18, cy - r * 0.95); ctx.lineTo(cx + sign * r * 0.42, cy - r * 0.98); ctx.lineTo(cx + sign * r * 0.26, cy - r * 1.28); ctx.closePath(); ctx.fillStyle = col; ctx.fill() }
      break
    case 'flower': {
      const fx = cx + r * 0.66, fy = cy - r * 0.66
      for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; circle(ctx, fx + Math.cos(a) * r * 0.16, fy + Math.sin(a) * r * 0.16, r * 0.11, col) }
      circle(ctx, fx, fy, r * 0.1, '#ffe08a'); break
    }
    case 'crown': {
      ctx.beginPath()
      ctx.moveTo(cx - r * 0.4, cy - r * 0.86)
      ctx.lineTo(cx - r * 0.4, cy - r * 1.06); ctx.lineTo(cx - r * 0.2, cy - r * 0.9)
      ctx.lineTo(cx, cy - r * 1.16); ctx.lineTo(cx + r * 0.2, cy - r * 0.9)
      ctx.lineTo(cx + r * 0.4, cy - r * 1.06); ctx.lineTo(cx + r * 0.4, cy - r * 0.86)
      ctx.closePath(); ctx.fillStyle = col; ctx.fill(); break
    }
    case 'leaf':
      ctx.strokeStyle = '#4a9d4a'; ctx.lineWidth = Math.max(1.5, r * 0.05); ctx.lineCap = 'round'
      ctx.beginPath(); ctx.moveTo(cx, cy - r * 0.95); ctx.lineTo(cx, cy - r * 1.2); ctx.stroke()
      ell(ctx, cx - r * 0.14, cy - r * 1.16, r * 0.14, r * 0.08, col, -0.5)
      ell(ctx, cx + r * 0.14, cy - r * 1.16, r * 0.14, r * 0.08, col, 0.5); break
    case 'none':
    case undefined:
      break
  }
}
