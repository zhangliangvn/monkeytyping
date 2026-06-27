/** Shared content types — the data-driven extension surface (spec §9). */
export interface I18nText { vi: string; en: string }

export type SceneId = 'jungle' | 'desert' | 'ocean' | 'space'

export type AbilityId =
  | 'banana-throw' | 'shuriken' | 'cannon' | 'rocket' | 'laser' | 'smash'
  | 'web' | 'repulsor' | 'sparkle' | 'fireworks' | 'bubble' | 'spin'
  | 'pounce' | 'freeze' | 'fly'
  | 'hop' | 'splash' | 'dash' | 'dig' | 'hug' | 'glide' | 'roll'

// ── Procedural "kawaii" art spec (drawn on canvas; see render/cuteFaces.ts) ──
export type EarType = 'puppy' | 'bunny' | 'cat' | 'bear' | 'round' | 'fox' | 'pig' | 'none' | 'frog' | 'deer'
export type Accessory = 'curl' | 'bow' | 'beret' | 'horn' | 'flower' | 'crown' | 'leaf' | 'none'

export interface CuteSpec {
  face: string
  edge?: string
  ear?: EarType
  earColor?: string
  innerEar?: string
  cheeks?: string
  accessory?: Accessory
  accessoryColor?: string
  snout?: string
  nose?: string
  beak?: string
  eyePatch?: string
  /** A feather crest/tuft on top (birds). */
  crest?: string
  /** Big round owl eyes. */
  bigEyes?: boolean
  /** A wide flat duck bill (instead of a pointed beak). */
  bill?: string
  /** Antlers (deer). */
  antlers?: string
  /** Light spots on the face (fawn). */
  spots?: string
  /** Whole-body special creatures with their own drawer. */
  kind?: 'fish' | 'snail'
}

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
  /** Emoji fallback (used in inline text like the unlock banner). */
  emoji: string
  /** Accent color for UI cards/celebrations. */
  accent: string
  /** Procedural canvas art spec (drawn by render/cuteFaces.ts). */
  cute?: CuteSpec
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
