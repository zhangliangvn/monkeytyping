/** Level map: the 12-level curriculum in order. A level unlocks when the
 *  previous one earns ≥1 star. Shows stars earned + world accent. Enter plays an
 *  unlocked level, Esc returns to the menu. */
import type { Scene } from './Scene'
import type { GameCtx } from '../app/Game'
import { LEVELS } from '../content/levels'
import { sceneById } from '../content/scenes'
import { t } from '../i18n/strings'
import { fillRoundRect, centeredText, withAlpha } from '../render/draw'

const COLS = 4

export class LevelSelectScene implements Scene {
  private sel = 0
  private timeMs = 0

  constructor(private readonly ctx: GameCtx) {}

  private unlocked(i: number): boolean {
    if (i === 0) return true
    return this.ctx.progress.starsFor(LEVELS[i - 1]!.id) >= 1
  }

  onKey(key: string): void {
    const n = LEVELS.length
    if (key === 'ArrowRight') this.sel = Math.min(this.sel + 1, n - 1)
    else if (key === 'ArrowLeft') this.sel = Math.max(this.sel - 1, 0)
    else if (key === 'ArrowDown') this.sel = Math.min(this.sel + COLS, n - 1)
    else if (key === 'ArrowUp') this.sel = Math.max(this.sel - COLS, 0)
    else if (key === 'Escape') this.ctx.go('menu')
    else if (key === 'Enter' && this.unlocked(this.sel)) {
      this.ctx.startLevel(LEVELS[this.sel]!.id)
    }
  }

  update(dt: number): void { this.timeMs += dt }

  render(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    const grad = ctx.createLinearGradient(0, 0, 0, h)
    grad.addColorStop(0, '#161a33'); grad.addColorStop(1, '#0e1430')
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h)
    const lang = this.ctx.lang

    centeredText(ctx, t('select_level', lang), w / 2, h * 0.1,
      `800 ${Math.round(h * 0.05)}px 'Segoe UI'`, '#ffd166')

    const gridX = w * 0.1, gridW = w * 0.8
    const top = h * 0.2, rowH = h * 0.23
    const cellW = gridW / COLS
    const cardW = cellW * 0.86, cardH = rowH * 0.8

    LEVELS.forEach((lvl, i) => {
      const col = i % COLS, row = Math.floor(i / COLS)
      const cx = gridX + col * cellW + cellW / 2
      const cy = top + row * rowH + cardH / 2
      const rect = { x: cx - cardW / 2, y: cy - cardH / 2, w: cardW, h: cardH }
      const accent = sceneById(lvl.world)?.palette.accent ?? '#ffd166'
      const open = this.unlocked(i)
      const stars = this.ctx.progress.starsFor(lvl.id)
      const isSel = i === this.sel

      fillRoundRect(ctx, rect, 14, open ? withAlpha(accent, 0.16) : withAlpha('#ffffff', 0.05))
      if (isSel) {
        const pulse = (Math.sin(this.timeMs / 220) + 1) / 2
        ctx.save(); ctx.shadowColor = accent; ctx.shadowBlur = 10 + pulse * 14
        ctx.strokeStyle = accent; ctx.lineWidth = 3
        ctx.strokeRect(rect.x, rect.y, rect.w, rect.h); ctx.restore()
      }

      const icon = lvl.mode === 'abc' ? '🔤' : '📝'
      centeredText(ctx, open ? `${icon} ${i + 1}` : '🔒', cx, cy - cardH * 0.18,
        `700 ${Math.round(cardH * 0.26)}px 'Segoe UI'`, open ? '#fff' : withAlpha('#fff', 0.5))
      centeredText(ctx, lvl.title[lang], cx, cy + cardH * 0.12,
        `600 ${Math.round(cardH * 0.13)}px 'Segoe UI'`, open ? withAlpha('#fff', 0.85) : withAlpha('#fff', 0.4))
      // stars
      const starStr = '★★★'.slice(0, stars) + '☆☆☆'.slice(0, 3 - stars)
      centeredText(ctx, starStr, cx, cy + cardH * 0.34,
        `${Math.round(cardH * 0.16)}px serif`, '#ffd166')
    })

    centeredText(ctx, t('nav_hint', lang), w / 2, h * 0.96,
      `500 ${Math.round(h * 0.024)}px 'Segoe UI'`, withAlpha('#ffffff', 0.45))
  }
}
