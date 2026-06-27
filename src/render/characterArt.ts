/**
 * Character art. Each character carries a `cute` spec (face/ears/cheeks/
 * accessory) and is drawn procedurally on the canvas by the kawaii renderer —
 * no external image assets — so the cast is cohesive and easy to extend. An
 * emoji is used only as a fallback for characters without a spec.
 */
import type { CharacterDef } from '../content/types'
import { centeredText } from './draw'
import { drawCute } from './cuteFaces'

/** Draw a character's face/mascot centered at (cx, cy), roughly `size` px tall. */
export function drawCharacterFace(
  ctx: CanvasRenderingContext2D,
  char: CharacterDef | undefined,
  cx: number, cy: number, size: number,
): void {
  if (char?.cute) {
    drawCute(ctx, cx, cy, size, char.cute)
    return
  }
  centeredText(ctx, char?.emoji ?? '🐶', cx, cy, `${Math.round(size * 0.92)}px serif`, '#fff')
}
