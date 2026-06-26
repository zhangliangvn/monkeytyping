/**
 * Bootstrap: size the canvas to the viewport (DPR-aware), wire IME-safe input,
 * and run the ABC practice scene through the game loop.
 */
import { Loop } from './engine/loop'
import { KeyboardInput } from './engine/input'
import { PlayAbc } from './scenes/PlayAbc'

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement | null

function fit(c: HTMLCanvasElement, ctx: CanvasRenderingContext2D): { w: number; h: number } {
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  const vv = window.visualViewport
  const w = Math.floor(vv?.width ?? window.innerWidth)
  const h = Math.floor(vv?.height ?? window.innerHeight)
  c.width = Math.floor(w * dpr)
  c.height = Math.floor(h * dpr)
  c.style.width = `${w}px`
  c.style.height = `${h}px`
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  return { w, h }
}

function main(c: HTMLCanvasElement): void {
  const ctx = c.getContext('2d')
  if (!ctx) return
  let size = fit(c, ctx)
  window.addEventListener('resize', () => { size = fit(c, ctx) })

  const scene = new PlayAbc()
  const input = new KeyboardInput()
  input.attach(window)
  input.onChar((ch) => scene.handleChar(ch))

  const loop = new Loop()
  loop.start((dt) => {
    scene.update(dt)
    scene.render(ctx, size.w, size.h)
  })
}

if (canvas) main(canvas)
