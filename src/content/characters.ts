/**
 * The 14 unlockable monkey characters. Each is a meaningful unlock (unique
 * ability + accent + celebration), not a palette swap (spec §4). Banana costs
 * rise so the "next silhouette" is always visible and reachable; characters are
 * grouped into the four scene-worlds.
 *
 * Art is a placeholder emoji for now; the hybrid procedural/image art hook lands
 * in M6 (the user can later swap in drawn sprites).
 */
import type { CharacterDef } from './types'

export const CHARACTERS: CharacterDef[] = [
  // ── Jungle 🌴 ──
  {
    id: 'classic', name: { vi: 'Khỉ Cơ Bản', en: 'Classic Monkey' },
    ability: 'banana-throw', abilityName: { vi: 'Ném chuối', en: 'Banana Throw' },
    colors: ['#8b5e3c', '#a9744f', '#6b4226'], unlockCostBananas: 0, world: 'jungle',
    emoji: '🐵', accent: '#c79a6b',
  },
  {
    id: 'kitty', name: { vi: 'Khỉ Mèo', en: 'Kitty Monkey' },
    ability: 'pounce', abilityName: { vi: 'Vồ mồi', en: 'Pounce' },
    colors: ['#f5c6d0', '#ffd9e1', '#e79bb0'], unlockCostBananas: 40, world: 'jungle',
    emoji: '🐱', accent: '#f5a3bd',
  },
  {
    id: 'ninja', name: { vi: 'Khỉ Ninja', en: 'Ninja Monkey' },
    ability: 'shuriken', abilityName: { vi: 'Phi tiêu', en: 'Shuriken' },
    colors: ['#2b2b3a', '#3d3d52', '#1a1a28'], unlockCostBananas: 120, world: 'jungle',
    emoji: '🥷', accent: '#5b5b7a',
  },
  // ── Desert 🏜 ──
  {
    id: 'pirate', name: { vi: 'Khỉ Cướp Biển', en: 'Pirate Monkey' },
    ability: 'cannon', abilityName: { vi: 'Đại bác', en: 'Cannon' },
    colors: ['#7a4a2b', '#9c603a', '#5d3720'], unlockCostBananas: 200, world: 'desert',
    emoji: '🏴‍☠️', accent: '#d98e3a',
  },
  {
    id: 'princess', name: { vi: 'Khỉ Công Chúa', en: 'Princess Monkey' },
    ability: 'sparkle', abilityName: { vi: 'Lấp lánh', en: 'Sparkle Shield' },
    colors: ['#f6b9d6', '#ffd1e8', '#e98fc0'], unlockCostBananas: 320, world: 'desert',
    emoji: '👸', accent: '#f49ad0',
  },
  {
    id: 'ballerina', name: { vi: 'Khỉ Múa', en: 'Ballerina Monkey' },
    ability: 'spin', abilityName: { vi: 'Xoay né', en: 'Spin Dodge' },
    colors: ['#f7d6e0', '#f0bcd0', '#e8a8c4'], unlockCostBananas: 460, world: 'desert',
    emoji: '🩰', accent: '#eeaecb',
  },
  // ── Ocean 🌊 ──
  {
    id: 'mermaid', name: { vi: 'Khỉ Tiên Cá', en: 'Mermaid Monkey' },
    ability: 'bubble', abilityName: { vi: 'Bong bóng', en: 'Bubble' },
    colors: ['#3fc1c9', '#5bd6dd', '#2aa6ad'], unlockCostBananas: 620, world: 'ocean',
    emoji: '🧜', accent: '#4fd0d8',
  },
  {
    id: 'fairy', name: { vi: 'Khỉ Tiên', en: 'Fairy Monkey' },
    ability: 'fireworks', abilityName: { vi: 'Pháo hoa', en: 'Fireworks' },
    colors: ['#c9a7f0', '#dcc2fb', '#b48fe0'], unlockCostBananas: 800, world: 'ocean',
    emoji: '🧚', accent: '#cda8f5',
  },
  {
    id: 'spiderman', name: { vi: 'Khỉ Nhện', en: 'Spider Monkey' },
    ability: 'web', abilityName: { vi: 'Tơ nhện', en: 'Web' },
    colors: ['#d32f2f', '#2196f3', '#b71c1c'], unlockCostBananas: 1000, world: 'ocean',
    emoji: '🕷️', accent: '#e1483f',
  },
  // ── Space 🚀 ──
  {
    id: 'astronaut', name: { vi: 'Khỉ Phi Hành Gia', en: 'Astronaut Monkey' },
    ability: 'rocket', abilityName: { vi: 'Tên lửa', en: 'Rocket' },
    colors: ['#e0e0e0', '#ffffff', '#b0bec5'], unlockCostBananas: 1240, world: 'space',
    emoji: '🧑‍🚀', accent: '#cfd8dc',
  },
  {
    id: 'superman', name: { vi: 'Khỉ Siêu Nhân', en: 'Super Monkey' },
    ability: 'laser', abilityName: { vi: 'Tia laze', en: 'Laser' },
    colors: ['#1565c0', '#e53935', '#0d47a1'], unlockCostBananas: 1500, world: 'space',
    emoji: '🦸', accent: '#3b82f6',
  },
  {
    id: 'ironman', name: { vi: 'Khỉ Người Sắt', en: 'Iron Monkey' },
    ability: 'repulsor', abilityName: { vi: 'Súng tay', en: 'Repulsor' },
    colors: ['#c62828', '#ffd700', '#8b0000'], unlockCostBananas: 1780, world: 'space',
    emoji: '🤖', accent: '#ffce3a',
  },
  {
    id: 'hulk', name: { vi: 'Khỉ Khổng Lồ', en: 'Hulk Monkey' },
    ability: 'smash', abilityName: { vi: 'Đập tan', en: 'Smash' },
    colors: ['#4caf50', '#66bb6a', '#2e7d32'], unlockCostBananas: 2080, world: 'space',
    emoji: '🦍', accent: '#5cb85c',
  },
  {
    id: 'frozen', name: { vi: 'Khỉ Băng Giá', en: 'Frozen Monkey' },
    ability: 'freeze', abilityName: { vi: 'Đóng băng', en: 'Freeze' },
    colors: ['#81d4fa', '#b3e5fc', '#4fc3f7'], unlockCostBananas: 2400, world: 'space',
    emoji: '☃️', accent: '#8fd8fb',
  },
]

export const CHARACTER_IDS = CHARACTERS.map((c) => c.id)

export function characterById(id: string): CharacterDef | undefined {
  return CHARACTERS.find((c) => c.id === id)
}
