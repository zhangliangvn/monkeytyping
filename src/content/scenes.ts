/** The 4 scene-worlds. Completing a world unlocks the next (spec §4). */
import type { SceneDef } from './types'

export const SCENES: SceneDef[] = [
  {
    id: 'jungle', name: { vi: 'Rừng Rậm', en: 'Jungle' }, emoji: '🌴', order: 0,
    palette: { skyTop: '#1e3a1e', skyBottom: '#0e2a14', ground: '#3a5a1c', accent: '#8bc34a' },
  },
  {
    id: 'desert', name: { vi: 'Sa Mạc', en: 'Desert' }, emoji: '🏜️', order: 1,
    palette: { skyTop: '#caa15a', skyBottom: '#7a4a2b', ground: '#c2a04e', accent: '#ffd166' },
  },
  {
    id: 'ocean', name: { vi: 'Đại Dương', en: 'Ocean' }, emoji: '🌊', order: 2,
    palette: { skyTop: '#0a3d6b', skyBottom: '#062544', ground: '#1a6fa0', accent: '#4dd0e1' },
  },
  {
    id: 'space', name: { vi: 'Vũ Trụ', en: 'Space' }, emoji: '🚀', order: 3,
    palette: { skyTop: '#1a0a3e', skyBottom: '#0a0a2e', ground: '#2d1b69', accent: '#b388ff' },
  },
]

export const SCENE_IDS = SCENES.map((s) => s.id)

export function sceneById(id: string): SceneDef | undefined {
  return SCENES.find((s) => s.id === id)
}
