/** Scene-world select: jungle → desert → ocean → space. Locked worlds (not yet
 *  unlocked by clearing the previous) are dimmed. Enter selects, Esc back. */
import type { Scene } from './Scene'
import type { GameCtx } from '../app/Game'
import { SCENES } from '../content/scenes'
import { t } from '../i18n/strings'
import { roundRectPath, centeredText, withAlpha } from '../render/draw'

export class SceneSelectScene implements Scene {
  private sel = 0
  private timeMs = 0
  private scenes = [...SCENES].sort((a, b) => a.order - b.order)

  constructor(private readonly ctx: GameCtx) {
    const i = this.scenes.findIndex((s) => s.id === this.ctx.progress.state.selectedScene)
    this.sel = i >= 0 ? i : 0
  }

  onKey(key: string): void {
    const n = this.scenes.length
    if (key === 'ArrowRight') this.sel = Math.min(this.sel + 1, n - 1)
    else if (key === 'ArrowLeft') this.sel = Math.max(this.sel - 1, 0)
    else if (key === 'Escape') this.ctx.go('menu')
    else if (key === 'Enter') {
      const s = this.scenes[this.sel]!
      if (this.ctx.progress.selectScene(s.id)) { this.ctx.save(); this.ctx.go('menu') }
    }
  }

  update(dt: number): void { this.timeMs += dt }

  render(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#0e1430'; ctx.fillRect(0, 0, w, h)
    const lang = this.ctx.lang
    centeredText(ctx, t('select_scene', lang), w / 2, h * 0.12,
      `800 ${Math.round(h * 0.05)}px 'Segoe UI'`, '#ffd166')

    const n = this.scenes.length
    const cellW = (w * 0.86) / n
    const startX = w * 0.07
    const cardW = cellW * 0.88, cardH = h * 0.42
    const cy = h * 0.5

    this.scenes.forEach((s, i) => {
      const cx = startX + i * cellW + cellW / 2
      const rect = { x: cx - cardW / 2, y: cy - cardH / 2, w: cardW, h: cardH }
      const open = this.ctx.progress.isSceneUnlocked(s.id)
      const isSel = i === this.sel
      const isCurrent = s.id === this.ctx.progress.state.selectedScene

      // scene palette preview
      const g = ctx.createLinearGradient(0, rect.y, 0, rect.y + rect.h)
      g.addColorStop(0, open ? s.palette.skyTop : '#20243f')
      g.addColorStop(1, open ? s.palette.skyBottom : '#161a2e')
      ctx.save()
      ctx.globalAlpha = open ? 1 : 0.55
      roundRectPath(ctx, rect.x, rect.y, rect.w, rect.h, 16)
      ctx.fillStyle = g
      ctx.fill()
      ctx.restore()

      if (isSel) {
        const pulse = (Math.sin(this.timeMs / 220) + 1) / 2
        ctx.save(); ctx.shadowColor = s.palette.accent; ctx.shadowBlur = 12 + pulse * 16
        ctx.strokeStyle = s.palette.accent; ctx.lineWidth = 3
        ctx.strokeRect(rect.x, rect.y, rect.w, rect.h); ctx.restore()
      }

      centeredText(ctx, open ? s.emoji : '🔒', cx, cy - cardH * 0.12,
        `${Math.round(cardH * 0.3)}px serif`, '#fff')
      centeredText(ctx, s.name[lang], cx, cy + cardH * 0.3,
        `700 ${Math.round(cardH * 0.1)}px 'Segoe UI'`, open ? '#fff' : withAlpha('#fff', 0.5))
      if (isCurrent) centeredText(ctx, '✓', rect.x + rect.w - cardW * 0.1, rect.y + cardH * 0.1,
        `700 ${Math.round(cardH * 0.12)}px 'Segoe UI'`, s.palette.accent)
    })

    centeredText(ctx, t('nav_hint', lang), w / 2, h * 0.95,
      `500 ${Math.round(h * 0.024)}px 'Segoe UI'`, withAlpha('#ffffff', 0.45))
  }
}
