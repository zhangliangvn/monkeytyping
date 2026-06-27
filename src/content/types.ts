/** Shared content types — the data-driven extension surface (spec §9). */
export interface I18nText { vi: string; en: string }

export type SceneId = 'jungle' | 'desert' | 'ocean' | 'space'

export type AbilityId =
  | 'banana-throw' | 'shuriken' | 'cannon' | 'rocket' | 'laser' | 'smash'
  | 'web' | 'repulsor' | 'sparkle' | 'fireworks' | 'bubble' | 'spin'
  | 'pounce' | 'freeze' | 'fly'

export interface CharacterDef {
  id: string
  name: I18nText
  ability: AbilityId
  abilityName: I18nText
  /** Selectable body colors (hex). */
  colors: string[]
  /** Bananas needed to unlock (0 = free from the start). */
  unlockCostBananas: number
  /** The scene-world this character belongs to. */
  world: SceneId
  /** Placeholder art until procedural/image art lands (M6). */
  emoji: string
  /** Accent color for UI cards/celebrations. */
  accent: string
}

export interface ScenePalette {
  /** Vertical background gradient. */
  skyTop: string
  skyBottom: string
  ground: string
  accent: string
}

export interface SceneDef {
  id: SceneId
  name: I18nText
  emoji: string
  order: number
  palette: ScenePalette
}

export type GameMode = 'abc' | 'word' | 'telex'
export type Lang = 'vi' | 'en'

export interface LevelDef {
  id: string
  /** Curriculum stage index (spec §2.3). */
  stage: number
  title: I18nText
  mode: GameMode
  /** Keys active/introduced at this level (drives the adaptive set + drills). */
  keySet: string[]
  /** Word pool for word levels (ASCII), per language. */
  words?: { vi: string[]; en: string[] }
  world: SceneId
}
