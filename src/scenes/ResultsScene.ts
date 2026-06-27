/** Results after a round: stars, accuracy, bananas earned, and a celebration
 *  for any newly unlocked character/scene. Continue or Retry. Kind framing —
 *  earned bananas are never lost (spec §3.4). */
import type { Scene, RoundOutcome } from './Scene'
import type { GameCtx } from '../app/Game'
import type { ResultOutcome } from '../state/progress'
import { t } from '../i18n/strings'
import { characterById } from '../content/characters'
import { sceneById } from '../content/scenes'
import { fillRoundRect, centeredText, withAlpha } from '../render/draw'

export interface ResultsData { round: RoundOutcome; reward: ResultOutcome }

export class ResultsScene implements Scene {
  private items: Array<'continue' | 'retry'> = ['continue', 'retry']
  private sel = 0
  private timeMs = 0

  constructor(private readonly ctx: GameCtx, private readonly data: ResultsData) {}

  onKey(key: string): void {
    if (key === 'ArrowUp' || key === 'ArrowDown') this.sel = (this.sel + 1) % this.items.length
    else if (key === 'Escape') this.ctx.go('menu')
    else if (key === 'Enter') {
      if (this.items[this.sel] === 'retry') this.ctx.go('play')
      else this.ctx.continueNext()
    }
  }

  update(dt: number): void { this.timeMs += dt }

  render(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    const grad = ctx.createLinearGradient(0, 0, 0, h)
    grad.addColorStop(0, '#15213e'); grad.addColorStop(1, '#0c1430')
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h)
    const lang = this.ctx.lang
    const { round, reward } = this.data

    centeredText(ctx, t('level_complete', lang), w / 2, h * 0.14,
      `800 ${Math.round(h * 0.06)}px 'Segoe UI'`, '#ffd166')

    // stars
    const starY = h * 0.27
    const sz = Math.round(h * 0.09)
    for (let i = 0; i < 3; i++) {
      const filled = i < round.stars
      const pop = filled ? 1 + Math.sin(Math.min(1, this.timeMs / 400 - i * 0.2) * Math.PI) * 0.12 : 1
      centeredText(ctx, filled ? '⭐' : '☆', w / 2 + (i - 1) * sz * 1.4, starY,
        `${Math.round(sz * pop)}px serif`, filled ? '#ffd166' : withAlpha('#ffffff', 0.3))
    }

    centeredText(ctx, `🎯 ${t('accuracy', lang)}: ${Math.round(round.accuracy * 100)}%`, w / 2, h * 0.42,
      `600 ${Math.round(h * 0.04)}px 'Segoe UI'`, '#9ef0a0')
    centeredText(ctx, `🍩 +${reward.bananasEarned}`, w / 2, h * 0.5,
      `700 ${Math.round(h * 0.045)}px 'Segoe UI'`, '#ffe08a')

    // unlock celebration
    const unlocks: string[] = [
      ...reward.newChars.map((id) => { const c = characterById(id); return c ? `${c.emoji} ${c.name[lang]}` : id }),
      ...reward.newScenes.map((id) => { const s = sceneById(id); return s ? `${s.emoji} ${s.name[lang]}` : id }),
    ]
    if (unlocks.length > 0) {
      const glow = (Math.sin(this.timeMs / 200) + 1) / 2
      ctx.save(); ctx.shadowColor = '#ffd166'; ctx.shadowBlur = 10 + glow * 16
      centeredText(ctx, `${t('new_unlock', lang)} ${unlocks.join('  ·  ')}`, w / 2, h * 0.59,
        `700 ${Math.round(h * 0.034)}px 'Segoe UI'`, '#ffd166')
      ctx.restore()
    }

    // buttons
    const labels: Record<'continue' | 'retry', string> = {
      continue: t('continue', lang), retry: t('try_again', lang),
    }
    const startY = h * 0.72, gap = h * 0.1
    this.items.forEach((item, i) => {
      const y = startY + i * gap
      const selected = i === this.sel
      const bw = w * 0.3, bh = h * 0.075
      const rect = { x: w / 2 - bw / 2, y: y - bh / 2, w: bw, h: bh }
      fillRoundRect(ctx, rect, 14, selected ? withAlpha('#ffd166', 0.22) : withAlpha('#ffffff', 0.06))
      if (selected) { ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 2; ctx.strokeRect(rect.x, rect.y, rect.w, rect.h) }
      centeredText(ctx, labels[item], w / 2, y, `600 ${Math.round(h * 0.032)}px 'Segoe UI'`,
        selected ? '#fff' : withAlpha('#ffffff', 0.7))
    })
  }
}
