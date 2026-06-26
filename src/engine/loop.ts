/**
 * requestAnimationFrame game loop. Calls `update(dtMs, nowMs)` each frame with a
 * clamped delta (so tab-switches don't produce huge jumps). Rendering happens
 * inside the same update callback for simplicity.
 */
export type UpdateFn = (dtMs: number, nowMs: number) => void

export class Loop {
  private rafId = 0
  private last = 0
  private running = false
  private update: UpdateFn = () => {}

  start(update: UpdateFn): void {
    this.update = update
    this.running = true
    this.last = 0
    const tick = (t: number): void => {
      if (!this.running) return
      if (this.last === 0) this.last = t
      const dt = Math.min(50, t - this.last)
      this.last = t
      this.update(dt, t)
      this.rafId = requestAnimationFrame(tick)
    }
    this.rafId = requestAnimationFrame(tick)
  }

  stop(): void {
    this.running = false
    cancelAnimationFrame(this.rafId)
  }
}
