/**
 * WebAudio sound effects — synthesized (no asset downloads). Each correct
 * keystroke is a tiny "impact" whose pitch rises toward word completion; word
 * completion, combo tiers, banana pickups, typos, and unlocks each get a
 * distinct, gentle cue (spec §10). Bass-light and capped so it never gets
 * shrill for children.
 *
 * The pure note/frequency math is exported for testing; playback is a thin
 * wrapper that no-ops when WebAudio is unavailable or muted.
 */

/** Semitones above A4 (440Hz) → frequency. */
export function noteFreq(semitonesFromA4: number): number {
  return 440 * Math.pow(2, semitonesFromA4 / 12)
}

/** A pentatonic-ish rising pitch for the n-th correct char in a word (capped). */
export function keyClickFreq(charIndex: number): number {
  const step = Math.min(charIndex, 8) // cap so long words don't get shrill
  return noteFreq(-9 + step * 2) // start ~C4, rise by whole tones
}

export interface SfxOptions { muted?: boolean; volume?: number }

type Ctor = typeof AudioContext
function getAudioCtor(): Ctor | undefined {
  const w = globalThis as unknown as { AudioContext?: Ctor; webkitAudioContext?: Ctor }
  return w.AudioContext ?? w.webkitAudioContext
}

export class Sfx {
  private ctx?: AudioContext
  muted: boolean
  volume: number

  constructor(opts: SfxOptions = {}) {
    this.muted = opts.muted ?? false
    this.volume = opts.volume ?? 0.5
  }

  /** Lazily create/resume the AudioContext (must follow a user gesture). */
  private audio(): AudioContext | undefined {
    if (this.muted) return undefined
    if (!this.ctx) {
      const Ctor = getAudioCtor()
      if (!Ctor) return undefined
      try { this.ctx = new Ctor() } catch { return undefined }
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume()
    return this.ctx
  }

  private tone(freq: number, durMs: number, type: OscillatorType = 'sine', gain = 1): void {
    const ac = this.audio()
    if (!ac) return
    const osc = ac.createOscillator()
    const g = ac.createGain()
    osc.type = type
    osc.frequency.value = freq
    const now = ac.currentTime
    const vol = this.volume * gain
    g.gain.setValueAtTime(0.0001, now)
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), now + 0.008)
    g.gain.exponentialRampToValueAtTime(0.0001, now + durMs / 1000)
    osc.connect(g).connect(ac.destination)
    osc.start(now)
    osc.stop(now + durMs / 1000 + 0.02)
  }

  keyOk(charIndex: number): void { this.tone(keyClickFreq(charIndex), 70, 'triangle', 0.35) }
  keyWrong(): void { this.tone(noteFreq(-16), 120, 'sawtooth', 0.18) }
  wordDone(): void { this.tone(noteFreq(3), 90, 'triangle', 0.5); this.tone(noteFreq(7), 140, 'sine', 0.4) }
  banana(): void { this.tone(noteFreq(12), 80, 'sine', 0.4) }
  combo(tier: number): void { this.tone(noteFreq(Math.min(12, tier * 1)), 90, 'square', 0.25) }
  unlock(): void {
    [0, 4, 7, 12].forEach((s, i) => {
      const ac = this.audio(); if (!ac) return
      const osc = ac.createOscillator(); const g = ac.createGain()
      osc.type = 'triangle'; osc.frequency.value = noteFreq(s)
      const t = ac.currentTime + i * 0.1
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(this.volume * 0.5, t + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25)
      osc.connect(g).connect(ac.destination); osc.start(t); osc.stop(t + 0.3)
    })
  }
}
