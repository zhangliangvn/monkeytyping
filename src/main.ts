/**
 * Entry point. For now: bootstrap the canvas and draw a placeholder so the
 * scaffold is verifiably working. Real engine/scenes land after the spec.
 */
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement | null

function resize(c: HTMLCanvasElement): void {
  const vv = window.visualViewport
  c.width = Math.floor(vv?.width ?? window.innerWidth)
  c.height = Math.floor(vv?.height ?? window.innerHeight)
}

function boot(c: HTMLCanvasElement): void {
  const ctx = c.getContext('2d')
  if (!ctx) return
  resize(c)
  window.addEventListener('resize', () => {
    resize(c)
    draw(ctx, c)
  })
  draw(ctx, c)
}

function draw(ctx: CanvasRenderingContext2D, c: HTMLCanvasElement): void {
  ctx.fillStyle = '#1a1a2e'
  ctx.fillRect(0, 0, c.width, c.height)
  ctx.fillStyle = '#ffd166'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '48px Segoe UI, sans-serif'
  ctx.fillText('🐒 Monkey Typing', c.width / 2, c.height / 2 - 30)
  ctx.fillStyle = '#cccccc'
  ctx.font = '20px Segoe UI, sans-serif'
  ctx.fillText('Đang khởi tạo…', c.width / 2, c.height / 2 + 30)
}

if (canvas) boot(canvas)
