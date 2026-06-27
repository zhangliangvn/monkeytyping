/**
 * Arcade mode — falling-word enemies the monkey attacks (spec §3, "game juice").
 *
 * ZType-style lock-on: the first correct key locks onto one enemy; type its word
 * to make the monkey blast it (beam + particle burst + sound). Words on screen
 * never share a first letter, so a keypress is never ambiguous. Kind failure: an
 * enemy reaching the bottom costs a heart (no harsh "Game Over"); when hearts run
 * out the round ends with a positive results screen. The keyboard guide still
 * shows the next finger, so finger-teaching continues even in the fun mode.
 */
import type { Scene, PlayOpts, RoundOutcome } from './Scene'
import { Combo } from '../game/combo'
import { fingerForChar } from '../content/fingerMap'
import { characterById } from '../content/characters'
import { KeyboardGuide, type GuideState } from '../keyboard/KeyboardGuide'
import { centeredText, withAlpha } from '../render/draw'
import { drawCharacterFace } from '../render/characterArt'
import { rampedPool } from '../content/words'

const ENEMY_EMOJI = ['👾', '🦇', '🐛', '🌀', '👻', '🦅', '🐍', '🪨']

/** Pick a word whose first letter is not already used by an active enemy. */
export function pickWord(pool: string[], usedFirstLetters: Set<string>, seed: number): string | undefined {
  const avail = pool.filter((w) => !usedFirstLetters.has(w[0]!))
  if (avail.length === 0) return undefined
  return avail[seed % avail.length]
}

interface Enemy { id: number; word: string; typed: number; x: number; y: number; vy: number; emoji: string }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; max: number; color: string }
interface Beam { x1: number; y1: number; x2: number; y2: number; life: number }

export class PlayArcade implements Scene {
  private enemies: Enemy[] = []
  private particles: Particle[] = []
  private beams: Beam[] = []
  private lockedId: number | null = null
  private nextId = 1
  private spawnTimer = 600
  private spawnEvery = 2200
  private hearts = 3
  private destroyed = 0
  private readonly target = 12
  private score = 0
  private correctKeys = 0
  private totalKeys = 0
  private combo = new Combo()
  private maxCombo = 0
  private timeMs = 0
  private monkeyBounce = 0
  private wrongFlash = 0
  private ended = false
  private guide = new KeyboardGuide()

  constructor(private readonly opts: PlayOpts = {}) {}

  onKey(key: string): void {
    if (key === 'Escape') this.opts.onExit?.()
  }

  private get locked(): Enemy | undefined {
    return this.lockedId === null ? undefined : this.enemies.find((e) => e.id === this.lockedId)
  }

  handleChar(ch: string): void {
    if (this.ended) return
    let enemy = this.locked
    if (!enemy) {
      // lock onto the lowest enemy whose next letter matches
      const matches = this.enemies.filter((e) => e.word[e.typed] === ch)
      enemy = matches.sort((a, b) => b.y - a.y)[0]
      if (enemy) {
        this.lockedId = enemy.id
        this.opts.tts?.speak(enemy.word, this.opts.speakLang ?? 'en')
      }
    }
    this.totalKeys += 1
    if (enemy && enemy.word[enemy.typed] === ch) {
      enemy.typed += 1
      this.correctKeys += 1
      this.opts.sfx?.keyOk(enemy.typed - 1)
      if (enemy.typed >= enemy.word.length) this.destroy(enemy)
    } else {
      this.wrongFlash = 1
      this.combo.typo()
      this.opts.sfx?.keyWrong()
    }
  }

  private destroy(enemy: Enemy): void {
    this.combo.wordCleared()
    this.maxCombo = Math.max(this.maxCombo, this.combo.count)
    this.score += enemy.word.length * 10 * (1 + this.combo.tier)
    this.destroyed += 1
    this.monkeyBounce = 1
    this.opts.sfx?.wordDone()
    this.opts.sfx?.combo(this.combo.tier)
    this.spawnBurst(enemy.x, enemy.y, '#ffd166')
    this.beams.push({ x1: this.monkeyX(), y1: this.monkeyY(), x2: enemy.x, y2: enemy.y, life: 180 })
    this.enemies = this.enemies.filter((e) => e.id !== enemy.id)
    this.lockedId = null
    if (this.destroyed >= this.target) this.finish()
  }

  private spawnBurst(x: number, y: number, color: string): void {
    for (let i = 0; i < 14; i++) {
      const a = (Math.PI * 2 * i) / 14
      const sp = 0.06 + Math.random() * 0.12
      this.particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 520, max: 520, color })
    }
  }

  private monkeyX(): number { return this.lastW / 2 }
  private monkeyY(): number { return this.lastH * 0.6 }
  private groundY(): number { return this.lastH * 0.66 }

  private lastW = 1280
  private lastH = 720

  update(dtMs: number): void {
    this.timeMs += dtMs
    this.monkeyBounce = Math.max(0, this.monkeyBounce - dtMs / 240)
    this.wrongFlash = Math.max(0, this.wrongFlash - dtMs / 260)

    // particles & beams
    for (const p of this.particles) { p.x += p.vx * dtMs; p.y += p.vy * dtMs; p.vy += 0.0004 * dtMs; p.life -= dtMs }
    this.particles = this.particles.filter((p) => p.life > 0)
    for (const b of this.beams) b.life -= dtMs
    this.beams = this.beams.filter((b) => b.life > 0)

    if (this.ended) return

    // spawn
    this.spawnTimer -= dtMs
    if (this.spawnTimer <= 0 && this.enemies.length < 5) {
      this.spawnTimer = this.spawnEvery
      this.spawnEvery = Math.max(1100, this.spawnEvery - 60)
      const used = new Set(this.enemies.map((e) => e.word[0]!))
      const pool = rampedPool(this.destroyed / this.target)
      const word = pickWord(pool, used, Math.floor(Math.random() * 1_000_000))
      if (word) {
        const x = this.lastW * (0.12 + Math.random() * 0.76)
        this.enemies.push({
          id: this.nextId++, word, typed: 0, x, y: this.lastH * 0.06,
          vy: (this.lastH * (0.05 + this.destroyed * 0.004)) / 1000,
          emoji: ENEMY_EMOJI[Math.floor(Math.random() * ENEMY_EMOJI.length)]!,
        })
      }
    }

    // move enemies; ground hit costs a heart
    const ground = this.groundY()
    for (const e of this.enemies) e.y += e.vy * dtMs
    const landed = this.enemies.filter((e) => e.y >= ground)
    if (landed.length > 0) {
      this.enemies = this.enemies.filter((e) => e.y < ground)
      for (const e of landed) {
        this.hearts -= 1
        this.combo.typo()
        this.spawnBurst(e.x, ground, '#ff6b6b')
        if (this.lockedId === e.id) this.lockedId = null
      }
      if (this.hearts <= 0) this.finish()
    }
  }

  private finish(): void {
    if (this.ended) return
    this.ended = true
    const accuracy = this.totalKeys === 0 ? 1 : this.correctKeys / this.totalKeys
    const stars: 0 | 1 | 2 | 3 = accuracy >= 0.95 ? 3 : accuracy >= 0.85 ? 2 : accuracy >= 0.7 ? 1 : 0
    const out: RoundOutcome = {
      levelId: this.opts.levelId ?? 'arcade', stars, accuracy, cleared: this.destroyed,
    }
    // brief delay handled by caller; report immediately
    this.opts.onRoundComplete?.(out)
  }

  render(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    this.lastW = w; this.lastH = h
    const grad = ctx.createLinearGradient(0, 0, 0, h)
    grad.addColorStop(0, '#0a0a2e'); grad.addColorStop(1, '#161a33')
    ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h)

    // beams (monkey blasts)
    for (const b of this.beams) {
      ctx.save()
      ctx.globalAlpha = Math.min(1, b.life / 180)
      ctx.strokeStyle = '#ffe08a'; ctx.lineWidth = 4; ctx.lineCap = 'round'
      ctx.shadowColor = '#ffd166'; ctx.shadowBlur = 14
      ctx.beginPath(); ctx.moveTo(b.x1, b.y1); ctx.lineTo(b.x2, b.y2); ctx.stroke()
      ctx.restore()
    }

    // enemies
    for (const e of this.enemies) {
      const locked = e.id === this.lockedId
      centeredText(ctx, e.emoji, e.x, e.y, `${Math.round(h * 0.05)}px serif`, '#fff')
      this.drawEnemyWord(ctx, e, locked, h)
    }

    // particles
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.life / p.max)
      ctx.fillStyle = p.color
      ctx.beginPath(); ctx.arc(p.x, p.y, h * 0.006, 0, Math.PI * 2); ctx.fill()
    }
    ctx.globalAlpha = 1

    // monkey
    const bounce = Math.sin(this.monkeyBounce * Math.PI) * h * 0.025
    drawCharacterFace(ctx, characterById(this.opts.characterId ?? ''), this.monkeyX(), this.monkeyY() - bounce, h * 0.1)

    // HUD
    centeredText(ctx, `⭐ ${this.score}`, w * 0.12, h * 0.06, `700 ${Math.round(h * 0.032)}px 'Segoe UI'`, '#ffd166')
    centeredText(ctx, `${'❤️'.repeat(this.hearts)}${'🖤'.repeat(Math.max(0, 3 - this.hearts))}`, w * 0.5, h * 0.06, `${Math.round(h * 0.03)}px serif`, '#fff')
    centeredText(ctx, `💥 ${this.destroyed}/${this.target}`, w * 0.88, h * 0.06, `700 ${Math.round(h * 0.03)}px 'Segoe UI'`, '#9ef0a0')

    // keyboard guide (next key of the locked word)
    const locked = this.locked
    const nextKey = locked ? locked.word[locked.typed] : undefined
    const kb = { x: w * 0.07, y: h * 0.71, w: w * 0.86, h: h * 0.26 }
    const state: GuideState = {
      nextChar: nextKey, pawT: 1, pulse: (Math.sin(this.timeMs / 280) + 1) / 2,
      showColors: true, showPaws: true, wrongFlash: this.wrongFlash,
    }
    this.guide.render(ctx, kb, state)
  }

  private drawEnemyWord(ctx: CanvasRenderingContext2D, e: Enemy, locked: boolean, h: number): void {
    const fontPx = Math.round(h * 0.03)
    ctx.font = `700 ${fontPx}px 'Consolas', monospace`
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'left'
    const widths = [...e.word].map((c) => ctx.measureText(c.toUpperCase()).width)
    const totalW = widths.reduce((s, x) => s + x, 0)
    const y = e.y + h * 0.045
    let x = e.x - totalW / 2
    if (locked) {
      ctx.save()
      ctx.strokeStyle = withAlpha('#ffd166', 0.8); ctx.lineWidth = 2
      ctx.strokeRect(x - 6, y - fontPx * 0.7, totalW + 12, fontPx * 1.5)
      ctx.restore()
    }
    for (let i = 0; i < e.word.length; i++) {
      const ch = e.word[i]!
      const def = fingerForChar(ch)
      const color = i < e.typed ? '#ffffff'
        : i === e.typed && locked ? (def?.color ?? '#ffd166')
          : withAlpha('#ffffff', locked ? 0.55 : 0.4)
      ctx.fillStyle = color
      ctx.fillText(ch.toUpperCase(), x, y)
      x += widths[i]!
    }
  }
}
