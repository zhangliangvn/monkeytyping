/**
 * The 14 unlockable characters — a cohesive cast of original, kawaii-style cute
 * animals (bunnies, cats, puppies, a frog, a panda, and friends), all drawn
 * procedurally on canvas (see render/cuteFaces.ts) via each character's `cute`
 * spec. Designs are original cartoon art, not reproductions of any branded
 * character. Banana/donut costs rise so the next silhouette is always reachable;
 * characters are grouped into the four scene-worlds.
 */
import type { CharacterDef } from './types'

export const CHARACTERS: CharacterDef[] = [
  // ── Jungle 🌴 ──
  {
    id: 'cinnamoroll', name: { vi: 'Cinnamoroll', en: 'Cinnamoroll' },
    ability: 'fly', abilityName: { vi: 'Bay lượn', en: 'Fly' },
    colors: ['#ffffff', '#bfe0ff', '#ffd6e6'], unlockCostBananas: 0, world: 'jungle',
    emoji: '🐶', accent: '#7fb2ff',
    cute: { face: '#ffffff', ear: 'puppy', earColor: '#ffffff', innerEar: '#bcdcff', accessory: 'curl', cheeks: '#ffc2d6' },
  },
  {
    id: 'bunny-pink', name: { vi: 'Thỏ Hồng', en: 'Pink Bunny' },
    ability: 'hop', abilityName: { vi: 'Nhảy', en: 'Hop' },
    colors: ['#ffffff', '#ffb6d5'], unlockCostBananas: 40, world: 'jungle',
    emoji: '🐰', accent: '#ff9ec0',
    cute: { face: '#ffffff', ear: 'bunny', earColor: '#ffffff', innerEar: '#ffb6d5', accessory: 'flower', accessoryColor: '#ff7eb6', cheeks: '#ffc2d6' },
  },
  {
    id: 'frog-green', name: { vi: 'Ếch Xanh', en: 'Green Frog' },
    ability: 'splash', abilityName: { vi: 'Bắn nước', en: 'Splash' },
    colors: ['#8bd45a', '#5aa838'], unlockCostBananas: 120, world: 'jungle',
    emoji: '🐸', accent: '#8bd45a',
    cute: { face: '#8bd45a', edge: '#5aa838', ear: 'frog', cheeks: '#ffc2d6' },
  },
  // ── Desert 🏜 ──
  {
    id: 'bunny-purple', name: { vi: 'Thỏ Tím', en: 'Purple Bunny' },
    ability: 'dash', abilityName: { vi: 'Lao nhanh', en: 'Dash' },
    colors: ['#efeaf5', '#c9a7f0'], unlockCostBananas: 200, world: 'desert',
    emoji: '🐰', accent: '#b388ff',
    cute: { face: '#efeaf5', edge: '#c9bfe0', ear: 'bunny', earColor: '#efeaf5', innerEar: '#c9a7f0', accessory: 'horn', accessoryColor: '#7b4fb0', cheeks: '#ffc2d6' },
  },
  {
    id: 'cat-white', name: { vi: 'Mèo Trắng', en: 'White Cat' },
    ability: 'pounce', abilityName: { vi: 'Vồ mồi', en: 'Pounce' },
    colors: ['#ffffff', '#ff5a76'], unlockCostBananas: 320, world: 'desert',
    emoji: '🐱', accent: '#ff6b8a',
    cute: { face: '#ffffff', ear: 'cat', earColor: '#ffffff', innerEar: '#ffb6d5', accessory: 'bow', accessoryColor: '#ff5a76', cheeks: '#ffc2d6', nose: '#ffce5a' },
  },
  {
    id: 'fox-orange', name: { vi: 'Cáo Cam', en: 'Orange Fox' },
    ability: 'dig', abilityName: { vi: 'Đào hang', en: 'Dig' },
    colors: ['#f0894b', '#c96a30'], unlockCostBananas: 460, world: 'desert',
    emoji: '🦊', accent: '#f0894b',
    cute: { face: '#f0894b', edge: '#c96a30', ear: 'fox', earColor: '#f0894b', snout: '#fff3e6', nose: '#3a2a1a', cheeks: '#ffb38a' },
  },
  // ── Ocean 🌊 ──
  {
    id: 'pup-pudding', name: { vi: 'Cún Bánh Flan', en: 'Pudding Pup' },
    ability: 'hug', abilityName: { vi: 'Ôm ấm', en: 'Hug' },
    colors: ['#ffe6a8', '#f3c869'], unlockCostBananas: 620, world: 'ocean',
    emoji: '🐶', accent: '#f6c453',
    cute: { face: '#ffe6a8', edge: '#e0b86a', ear: 'puppy', earColor: '#f3c869', accessory: 'beret', accessoryColor: '#8a5a2b', snout: '#fff4d6', nose: '#6b4226', cheeks: '#ffcaa8' },
  },
  {
    id: 'chick-yellow', name: { vi: 'Gà Con', en: 'Little Chick' },
    ability: 'glide', abilityName: { vi: 'Lượn', en: 'Glide' },
    colors: ['#ffe45e', '#e8c23a'], unlockCostBananas: 800, world: 'ocean',
    emoji: '🐥', accent: '#ffd54f',
    cute: { face: '#ffe45e', edge: '#e0bb33', ear: 'none', beak: '#ff9e3d', cheeks: '#ffb84d' },
  },
  {
    id: 'koala-grey', name: { vi: 'Gấu Túi', en: 'Koala' },
    ability: 'hug', abilityName: { vi: 'Ôm ấm', en: 'Hug' },
    colors: ['#b8c0c8', '#9aa4ad'], unlockCostBananas: 1000, world: 'ocean',
    emoji: '🐨', accent: '#aab4bd',
    cute: { face: '#b8c0c8', edge: '#8b96a0', ear: 'round', earColor: '#aab4bd', innerEar: '#e0b0c0', snout: '#cdd4da', nose: '#2b2b2b', cheeks: '#f0a0b0' },
  },
  // ── Space 🚀 ──
  {
    id: 'bear-brown', name: { vi: 'Gấu Nâu', en: 'Brown Bear' },
    ability: 'hug', abilityName: { vi: 'Ôm ấm', en: 'Hug' },
    colors: ['#c79a6b', '#9c7344'], unlockCostBananas: 1240, world: 'space',
    emoji: '🐻', accent: '#c79a6b',
    cute: { face: '#c79a6b', edge: '#9c7344', ear: 'bear', earColor: '#b07d4f', snout: '#ecd9bf', nose: '#5d3720', cheeks: '#f0a07a' },
  },
  {
    id: 'panda', name: { vi: 'Gấu Trúc', en: 'Panda' },
    ability: 'roll', abilityName: { vi: 'Lăn tròn', en: 'Roll' },
    colors: ['#ffffff', '#2b2b2b'], unlockCostBananas: 1500, world: 'space',
    emoji: '🐼', accent: '#cfd8dc',
    cute: { face: '#ffffff', edge: '#cdd4e0', ear: 'round', earColor: '#2b2b2b', eyePatch: '#2b2b2b', snout: '#ffffff', nose: '#2b2b2b', cheeks: '#ffc2d6' },
  },
  {
    id: 'pig-pink', name: { vi: 'Heo Hồng', en: 'Pink Pig' },
    ability: 'dash', abilityName: { vi: 'Lao nhanh', en: 'Dash' },
    colors: ['#ffc2d6', '#f7a8c4'], unlockCostBananas: 1780, world: 'space',
    emoji: '🐷', accent: '#ff9ec0',
    cute: { face: '#ffc2d6', edge: '#e892b0', ear: 'pig', earColor: '#f7a8c4', snout: '#ffd6e6', cheeks: '#ff9ec0' },
  },
  {
    id: 'pup-brown', name: { vi: 'Cún Nâu', en: 'Brown Puppy' },
    ability: 'fly', abilityName: { vi: 'Bay lượn', en: 'Fly' },
    colors: ['#d9a86b', '#b07d4f'], unlockCostBananas: 2080, world: 'space',
    emoji: '🐕', accent: '#d9a86b',
    cute: { face: '#d9a86b', edge: '#a87f4f', ear: 'puppy', earColor: '#b07d4f', snout: '#f0dcc0', nose: '#5d3720', cheeks: '#ffb38a' },
  },
  {
    id: 'bunny-mint', name: { vi: 'Thỏ Mint', en: 'Mint Bunny' },
    ability: 'hop', abilityName: { vi: 'Nhảy', en: 'Hop' },
    colors: ['#dff7ea', '#a0e0c0'], unlockCostBananas: 2400, world: 'space',
    emoji: '🐰', accent: '#6cc9a0',
    cute: { face: '#dff7ea', edge: '#a8d8c0', ear: 'bunny', earColor: '#dff7ea', innerEar: '#a0e0c0', accessory: 'leaf', accessoryColor: '#6cc070', cheeks: '#ffc2d6' },
  },
]

export const CHARACTER_IDS = CHARACTERS.map((c) => c.id)

export function characterById(id: string): CharacterDef | undefined {
  return CHARACTERS.find((c) => c.id === id)
}
