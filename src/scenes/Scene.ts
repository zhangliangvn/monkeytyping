/** Common shape for a playable scene driven by the loop + input. */
export interface Scene {
  handleChar(ch: string): void
  update(dtMs: number): void
  render(ctx: CanvasRenderingContext2D, w: number, h: number): void
}
