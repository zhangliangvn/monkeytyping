/** Character select: a banana-map grid of all 14 monkeys; locked ones show a
 *  silhouette + their banana cost. Arrow keys navigate, Enter selects unlocked,
 *  Esc returns to the menu. */
import type { Scene } from './Scene'
import type { GameCtx } from '../app/Game'
import { CHARACTERS } from '../content/characters'
import { t } from '../i18n/strings'
import { fillRoundRect, centeredText, withAlpha } from '../render/draw'
import { drawCharacterFace } from '../render/characterArt'

const COLS = 5

export class CharacterSelectScene implements Scene {
  private sel = 0
  private timeMs = 0

  constructor(private readonly ctx: GameCtx) {
    const i = CHARACTERS.findIndex((c) => c.id === this.ctx.progress.state.selectedChar)
    this.sel = i >= 0 ? i : 0
  }

  onKey(key: string): void {
    const n = CHARACTERS.length
    if (key === 'ArrowRight') this.sel = Math.min(this.sel + 1, n - 1)
    else if (key === 'ArrowLeft') this.sel = Math.max(this.sel - 1, 0)
    else if (key === 'ArrowDown') this.sel = Math.min(this.sel + COLS, n - 1)
    else if (key === 'ArrowUp') this.sel = Math.max(this.sel - COLS, 0)
    else if (key === 'Escape') this.ctx.go('menu')
    else if (key === 'Enter') {
      const c = CHARACTERS[this.sel]!
      if (this.ctx.progress.selectChar(c.id)) {
        this.ctx.save()
        this.ctx.go('menu')
      }
    }
  }

  update(dt: number): void { this.timeMs += dt }

  render(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    const grad = ctx.createLinearGradient(0, 0, 0, h)
    grad.addColorStop(0, '#161a33'); grad.addColorStop(1, '#0e1430')
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h)
    const lang = this.ctx.lang

    centeredText(ctx, t('select_character', lang), w / 2, h * 0.1,
      `800 ${Math.round(h * 0.05)}px 'Segoe UI'`, '#ffd166')
    centeredText(ctx, `🍌 ${this.ctx.progress.bananas}`, w * 0.9, h * 0.06,
      `600 ${Math.round(h * 0.03)}px 'Segoe UI'`, '#ffe08a')

    const gridX = w * 0.08, gridW = w * 0.84
    const top = h * 0.2, rowH = h * 0.22
    const cellW = gridW / COLS
    const cardW = cellW * 0.84, cardH = rowH * 0.82

    CHARACTERS.forEach((c, i) => {
      const col = i % COLS, row = Math.floor(i / COLS)
      const cx = gridX + col * cellW + cellW / 2
      const cy = top + row * rowH + cardH / 2
      const rect = { x: cx - cardW / 2, y: cy - cardH / 2, w: cardW, h: cardH }
      const unlocked = this.ctx.progress.isCharUnlocked(c.id)
      const isSel = i === this.sel
      const isCurrent = c.id === this.ctx.progress.state.selectedChar

      fillRoundRect(ctx, rect, 14, unlocked ? withAlpha(c.accent, 0.18) : withAlpha('#ffffff', 0.05))
      if (isCurrent) fillRoundRect(ctx, rect, 14, withAlpha(c.accent, 0.16))
      if (isSel) {
        const pulse = (Math.sin(this.timeMs / 220) + 1) / 2
        ctx.save(); ctx.shadowColor = c.accent; ctx.shadowBlur = 12 + pulse * 14
        ctx.strokeStyle = c.accent; ctx.lineWidth = 3
        ctx.strokeRect(rect.x, rect.y, rect.w, rect.h); ctx.restore()
      }

      if (unlocked) {
        drawCharacterFace(ctx, c, cx, cy - cardH * 0.1, cardH * 0.44)
      } else {
        centeredText(ctx, '❔', cx, cy - cardH * 0.12, `${Math.round(cardH * 0.42)}px serif`,
          withAlpha('#ffffff', 0.5))
      }
      const nameColor = unlocked ? '#fff' : withAlpha('#ffffff', 0.5)
      centeredText(ctx, unlocked ? c.name[lang] : `🔒 ${c.unlockCostBananas}🍌`,
        cx, cy + cardH * 0.32, `600 ${Math.round(cardH * 0.16)}px 'Segoe UI'`, nameColor)
      if (isCurrent) {
        centeredText(ctx, '✓', rect.x + rect.w - cardW * 0.12, rect.y + cardH * 0.16,
          `700 ${Math.round(cardH * 0.18)}px 'Segoe UI'`, c.accent)
      }
    })

    centeredText(ctx, t('nav_hint', lang), w / 2, h * 0.96,
      `500 ${Math.round(h * 0.024)}px 'Segoe UI'`, withAlpha('#ffffff', 0.45))
  }
}
