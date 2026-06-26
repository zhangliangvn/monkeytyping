/**
 * Bootstrap: size the canvas to the viewport (DPR-aware), wire IME-safe input,
 * and run the active practice scene through the game loop. Tab toggles between
 * ABC and Word practice (a real menu lands in M4).
 */
import { Loop } from './engine/loop'
import { KeyboardInput } from './engine/input'
import { PlayAbc } from './scenes/PlayAbc'
import { PlayWord } from './scenes/PlayWord'
import type { Scene } from './scenes/Scene'
import { centeredText, withAlpha } from './render/draw'

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

  const scenes: Record<'abc' | 'word', Scene> = { abc: new PlayAbc(), word: new PlayWord() }
  let mode: 'abc' | 'word' = 'abc'

  const input = new KeyboardInput()
  input.attach(window)
  input.onChar((ch) => scenes[mode].handleChar(ch))

  // Tab toggles mode (not a typeable char, handled here directly).
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      mode = mode === 'abc' ? 'word' : 'abc'
    }
  }, true)

  // Expose mode for e2e/debugging.
  ;(window as unknown as { getMode?: () => string }).getMode = () => mode

  const loop = new Loop()
  loop.start((dt) => {
    const scene = scenes[mode]
    scene.update(dt)
    scene.render(ctx, size.w, size.h)
    const label = mode === 'abc' ? '🔤 ABC' : '📝 Từ'
    centeredText(
      ctx, `${label}   ·   Tab: đổi chế độ`, size.w / 2, size.h * 0.975,
      `600 ${Math.round(size.h * 0.024)}px 'Segoe UI', sans-serif`, withAlpha('#ffffff', 0.55),
    )
  })
}

if (canvas) main(canvas)
