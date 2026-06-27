/**
 * Character art. Prefers the user-provided image sprite for a character; falls
 * back to the procedural kawaii art (its `cute` spec) while the image loads or
 * if it is missing, and finally to an emoji.
 */
import type { CharacterDef } from '../content/types'
import { centeredText } from './draw'
import { drawCute } from './cuteFaces'
import { characterSprite, drawSpriteFit } from './spriteLoader'

/** Draw a character's face/mascot centered at (cx, cy), roughly `size` px tall. */
export function drawCharacterFace(
  ctx: CanvasRenderingContext2D,
  char: CharacterDef | undefined,
  cx: number, cy: number, size: number,
): void {
  if (char) {
    const img = characterSprite(char.id)
    if (img) { drawSpriteFit(ctx, img, cx, cy, size); return }
    if (char.cute) { drawCute(ctx, cx, cy, size, char.cute); return }
  }
  centeredText(ctx, char?.emoji ?? '🐶', cx, cy, `${Math.round(size * 0.92)}px serif`, '#fff')
}
