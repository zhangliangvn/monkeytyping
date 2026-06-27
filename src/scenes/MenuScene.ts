/** Main menu: Play, Character, Language. Arrow keys + Enter. */
import type { Scene } from './Scene'
import type { GameCtx } from '../app/Game'
import { t } from '../i18n/strings'
import { characterById } from '../content/characters'
import { fillRoundRect, centeredText, withAlpha } from '../render/draw'
import { drawCharacterFace } from '../render/characterArt'

type Item = 'play' | 'arcade' | 'shark' | 'level' | 'character' | 'scene' | 'sound' | 'lang'

export class MenuScene implements Scene {
  private items: Item[] = ['play', 'arcade', 'shark', 'level', 'character', 'scene', 'sound', 'lang']
  private sel = 0
  private timeMs = 0

  constructor(private readonly ctx: GameCtx) {}

  onKey(key: string): void {
    if (key === 'ArrowUp') this.sel = (this.sel + this.items.length - 1) % this.items.length
    else if (key === 'ArrowDown') this.sel = (this.sel + 1) % this.items.length
    else if (key === 'Enter') this.activate()
  }

  private activate(): void {
    const item = this.items[this.sel]!
    if (item === 'play') this.ctx.go('play')
    else if (item === 'arcade') this.ctx.go('arcade')
    else if (item === 'shark') this.ctx.go('shark')
    else if (item === 'level') this.ctx.go('level')
    else if (item === 'character') this.ctx.go('character')
    else if (item === 'scene') this.ctx.go('scene')
    else if (item === 'sound') this.ctx.toggleMute()
    else {
      this.ctx.setLanguage(this.ctx.lang === 'vi' ? 'en' : 'vi')
      this.ctx.save()
    }
  }

  update(dt: number): void { this.timeMs += dt }

  render(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    const grad = ctx.createLinearGradient(0, 0, 0, h)
    grad.addColorStop(0, '#1a1a2e'); grad.addColorStop(1, '#10162e')
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h)

    const lang = this.ctx.lang
    const char = characterById(this.ctx.progress.state.selectedChar)
    const bob = Math.sin(this.timeMs / 500) * h * 0.012
    drawCharacterFace(ctx, char, w / 2, h * 0.125 + bob, h * 0.12)
    centeredText(ctx, t('app_title', lang), w / 2, h * 0.245, `800 ${Math.round(h * 0.055)}px 'Segoe UI', sans-serif`, '#ffd166')

    // banana + selected character
    centeredText(ctx, `🍩 ${this.ctx.progress.bananas}`, w / 2, h * 0.305,
      `600 ${Math.round(h * 0.028)}px 'Segoe UI'`, '#ffe08a')
    if (char) {
      centeredText(ctx, `${char.emoji} ${char.name[lang]}`, w / 2, h * 0.345,
        `500 ${Math.round(h * 0.024)}px 'Segoe UI'`, withAlpha('#ffffff', 0.75))
    }

    // menu items
    const labels: Record<Item, string> = {
      play: t('menu_play', lang),
      arcade: t('menu_arcade', lang),
      shark: t('menu_shark', lang),
      level: t('menu_level', lang),
      character: t('menu_character', lang),
      scene: t('menu_scene', lang),
      sound: this.ctx.isMuted() ? (lang === 'vi' ? '🔇 Tắt tiếng' : '🔇 Sound off') : (lang === 'vi' ? '🔊 Bật tiếng' : '🔊 Sound on'),
      lang: `🌐 ${lang === 'vi' ? 'Tiếng Việt' : 'English'}`,
    }
    const startY = h * 0.42
    const gap = h * 0.062
    this.items.forEach((item, i) => {
      const y = startY + i * gap
      const selected = i === this.sel
      const bw = w * 0.32, bh = h * 0.048
      const rect = { x: w / 2 - bw / 2, y: y - bh / 2, w: bw, h: bh }
      fillRoundRect(ctx, rect, 14, selected ? withAlpha('#ffd166', 0.22) : withAlpha('#ffffff', 0.06))
      if (selected) {
        ctx.save(); ctx.shadowColor = '#ffd166'; ctx.shadowBlur = 18
        fillRoundRect(ctx, rect, 14, withAlpha('#ffd166', 0.0001)); ctx.restore()
        ctx.strokeStyle = '#ffd166'; ctx.lineWidth = 2
        ctx.strokeRect(rect.x, rect.y, rect.w, rect.h)
      }
      centeredText(ctx, labels[item], w / 2, y, `600 ${Math.round(h * 0.034)}px 'Segoe UI'`,
        selected ? '#ffffff' : withAlpha('#ffffff', 0.7))
    })

    centeredText(ctx, t('nav_hint', lang), w / 2, h * 0.95,
      `500 ${Math.round(h * 0.024)}px 'Segoe UI'`, withAlpha('#ffffff', 0.45))
  }
}
