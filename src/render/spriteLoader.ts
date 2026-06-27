/**
 * Loads per-character image sprites (the user-provided art under
 * public/characters/<id>.png) and draws them on the canvas, fit to a target
 * size with correct aspect ratio. Until an image is ready (or if it is missing),
 * callers fall back to the procedural kawaii art — so the game never shows a
 * blank.
 */
const images = new Map<string, HTMLImageElement>()
const ready = new Set<string>()

const base = (import.meta.env.BASE_URL ?? '/')

/** Begin loading sprites for the given character ids (idempotent). */
export function preloadCharacterSprites(ids: readonly string[]): void {
  if (typeof Image === 'undefined') return
  for (const id of ids) {
    if (images.has(id)) continue
    const img = new Image()
    img.onload = () => ready.add(id)
    img.onerror = () => { /* fall back to procedural art */ }
    img.src = `${base}characters/${id}.png`
    images.set(id, img)
  }
}

/** A loaded sprite for `id`, or undefined if not ready / missing. */
export function characterSprite(id: string): HTMLImageElement | undefined {
  return ready.has(id) ? images.get(id) : undefined
}

/** Draw an image centered at (cx, cy), scaled to fit a `size`-tall-ish box. */
export function drawSpriteFit(
  ctx: CanvasRenderingContext2D, img: HTMLImageElement, cx: number, cy: number, size: number,
): void {
  const box = size * 1.6
  const scale = Math.min(box / img.width, box / img.height)
  const w = img.width * scale, h = img.height * scale
  ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h)
}
