# Monkey Typing — Game Design Spec

> Status: **Design (v1)**. Built on research workflow `wf_95319f4d-31c` (8 agents: touch-typing
> pedagogy, finger-guidance UI, kids engagement, arcade juice, visual/UX/accessibility, Vietnamese
> typing, deep reverse-engineering) and the locked decisions + original inventory in
> [2026-06-27-monkey-typing-decisions-and-original-inventory.md](./2026-06-27-monkey-typing-decisions-and-original-inventory.md).

## 1. Vision

A **professional, polished, kid-delighting 10-finger touch-typing game** starring a monkey, in
**Vietnamese + English**, that is measurably **better than the original** at https://monkeytyping.pixelz-lab.com/.
The wedge the original entirely lacks: **it teaches which finger presses which key** — visually,
redundantly, and always-on during play. Everything else (juice, kindness, adaptivity, a real reward
economy, accessibility) is built to a higher standard than a hobby clone.

**Design principles**
1. **Accuracy before speed.** Progression gates on accuracy, never raw WPM.
2. **Eyes on screen.** Guidance lives on-screen (keyboard + paws), pulling eyes up, with an off-ramp.
3. **Kindness over punishment.** No buzzers, no "Game Over" wall, never lose earned rewards.
4. **Redundant guidance.** Never color alone — color + monkey-paw + key position together (colorblind-safe).
5. **Data, not code.** Finger map, words, characters, scenes, i18n are swappable data → easy to extend.
6. **Short daily play.** Levels sized to young attention spans (~3–7 min), with streaks.

## 2. Pedagogy foundation (the differentiator)

### 2.1 Finger → key map (single source of truth)
Standard US-QWERTY touch-typing assignment. Stored as **per-key data** that drives the keyboard tint,
the monkey-paw fingertip highlight, the falling-target tint, and the legend — all at once.

| Finger | Keys |
|---|---|
| Left pinky | `` ` `` 1 Q A Z (+ Tab, Caps, LShift) |
| Left ring | 2 W S X |
| Left middle | 3 E D C |
| Left index | 4 5 R T **F**(home/bump) G V B |
| Right index | 6 7 Y U H **J**(home/bump) N M |
| Right middle | 8 I K , |
| Right ring | 9 O L . |
| Right pinky | 0 - = P [ ] \\ ; ' / (+ RShift, Enter, Backspace) |
| Thumbs | Space |

Home rest: **A S D F** / **J K L ;**. Index fingers own two columns; others one diagonal column.

### 2.2 Color coding (Typing.com convention — recognizable; always paired with paw + position)
- **Index = Green**, **Middle = Red**, **Ring = Blue**, **Pinky = Purple**, **Yellow = index-stretch/reach** (G H T Y 4 5 6 7), Space (thumbs) = neutral/green.
- Same color for the mirror finger on the other hand. **Never rely on color alone** (1‑in‑12 boys are red‑green colorblind): every cue also carries the paw graphic + key position; a "shapes/patterns" colorblind-safe palette toggle is available.
- **F and J carry a visible bump/notch.** A subtle divider sits between **G** and **H**; left/right halves are faintly tinted so kids know which paw owns a key before reading color.

### 2.3 Curriculum (lesson/stage order — center-outward, accuracy-first)
0. **Home-row anchor** (recurring before every round): "rest on ASDF JKL;, find the F/J bumps".
1. **Home row**: F/J anchors → D/K → S/L → A/; → index reach G/H. ASCII drills + syllables (la da sa as ad).
2. **Common reaches**: E/I then R/U.
3. **Rest of top row**: T/Y → W/O → Q/P.
4. **Bottom row**: V/M → B/N → C/, → X/Z.
5. **ASCII real words**: diacritic-free Vietnamese CV words (ba, me, nha, ca, bo, na, to) + parallel English; length 2–3 → 4 → 5+.
6. **Numbers row** (only after all letters solid).
7. **Capitals via Shift.**
8. **Punctuation.**
9. **Telex "superpower"** (Vietnamese diacritics): aa=â ee=ê oo=ô aw=ă ow=ơ uw=ư dd=đ; tones s=sắc f=huyền r=hỏi x=ngã j=nặng z=clear; the "double the trigger to escape" rule; animated morph.
10. **Full Vietnamese** words with tones + short sentences (mèo, chó, cá, nhà, mẹ, bà, gà, bút, sách, mưa, nắng, trời, nước, bánh, kẹo).

### 2.4 Adaptive engine (Keybr-style, behind the scenes)
- Per-key **confidence score** = f(accuracy, speed). Introduce the next key only when current keys clear a threshold; re-inject any key whose accuracy drops or that is hit slowly.
- If accuracy falls below a floor mid-round: auto-slow spawn/fall speed and shrink the active key set, then ramp back up. **No manual difficulty wall.**

### 2.5 Success criteria (praise, not punishment)
- Unlock floor **≥70% accuracy** (kept from original) + **star tiers**: 1★ 70%, 2★ 85%, 3★ 95%.
- WPM shown as **age-scaled praise only** (~5 WPM/grade rule of thumb); never blocks progress.

## 3. Gameplay

### 3.1 Modes
- **ABC (🔤)** — single letters / 2-letter combos. Youngest learners; pure finger-placement drilling.
- **Word (📝)** — whole words; the action/arcade layer.
- (Internally both share the same input + guidance core; Word adds the side-scrolling action.)

### 3.2 Core loop (Word mode — side-scrolling monkey)
Incoming **word-enemies / banana targets** approach the monkey's lane. Typing resolves them into monkey
actions: **🦘 jump**, **⚔ attack**, **dodge**.
- **ZType lock-on**: first correct keystroke locks exactly one target (bright outline; others dimmed); progress stays bound until cleared. On-screen targets never share a first letter (else auto-lock nearest threat).
- **Monkeytype caret coloring** inside a word: untyped = dim, typed-correct = bright, current expected char marked by an animated caret. **Wrong key** → flash that char red + soft miss sound, **caret does NOT advance** (kid sees exactly where the error is).
- **Word outcome → action mapping** (teaches which words do what): attack-word → monkey swings, enemy bursts (particles + lingering smoke); dodge-word → slide with afterimage + whoosh; typo near a threat → stumble (recoverable hit).

### 3.3 Juice (capped; legibility is sacred)
- Every correct keystroke = micro-hit: small particle pop at caret, key-click whose pitch rises slightly toward word completion, tiny monkey wind-up tick.
- Big payoff reserved for **word completion**: jump-attack, **hit-pause ~2–4 frames**, capped screenshake, banana/coin burst.
- **Combos**: consecutive no-typo words raise a visible meter; reward sound rises ~1 semitone/tier **with a hard cap** (never shrill); monkey gains a glow/aura; music layers intensify. A typo/hit resets combo with a soft "aww", not a buzzer.
- Guardrails: never shake or cover the word being typed; particles behind/around glyphs only; high text-bg contrast; screenshake only on big payoffs.

### 3.4 Kind failure
- No "Game Over" buzzer. Enemy reaching the monkey = screen flash + light shake + lose a banana/heart + **brief invulnerability**; keep typing.
- End-of-round framing is positive ("Almost! The monkey ate 7 bananas — try again?"). **Never deduct earned bananas/stars.**

### 3.5 HUD
Kid-friendly: a simple **speed bar** + big **accuracy star/%**, **combo meter**, **banana count**, current **stage/level**. Precise WPM/Net-WPM computed internally, shown on the results screen. (WPM = (correct chars/5)/min; accuracy = correct/total keystrokes.)

## 4. Reward economy & progression

- **Banana map / sticker album**: the 14 characters shown as **silhouettes with a visible cost**, always "next and reachable". Bananas/stars earned by **accuracy + stage completion** (never by speed alone).
- **14 characters**, each a *meaningful* unlock — unique **signature ability** + **unlock celebration** + **jingle** (not palette swaps). Provisional ability mapping (finalized in content phase):
  `classic(banana-throw), ninja(shuriken), pirate(cannon), astronaut(rocket), superman(laser), hulk(smash), spiderman(web), ironman(repulsor), princess(sparkle-shield), fairy(fireworks), mermaid(bubble), ballerina(spin-dodge), kitty(pounce), frozen(freeze)` — 14 unique. Effects available in original: smash, web, laser, freeze, shield, fireworks, combo, celebration.
- **Character colors** (per character): brown, golden, gray, white, pink, themed.
- **4 scenes as world-progression**: 🌴 jungle → desert → ocean → space. Finishing a world unlocks the next scene + its themed characters.
- **Streaks**: "come back tomorrow" reward; meaningful reward paced ~1 per few effort moments (avoid reward fatigue).
- **Optional arcade/race mode** for older kids (8–12) reusing falling-word mechanics, **default to personal-best framing** ("beat your own banana record"), no global leaderboard by default.

## 5. Languages, i18n & Vietnamese strategy

- **Vietnamese + English** at launch; i18n table structured so CN/JP/KR (already translated in the original) can be re-added as data. UI/voice **fully Vietnamese from Stage 1** even while practice words are ASCII.
- **Phased VN curriculum** (see §2.3): ASCII-first → ASCII real words → Telex superpower → full toned words.
- **ENGINEERING-CRITICAL — IME safety**: ASCII stages capture **raw keyboard events** (`KeyboardEvent.code`/`key`) and compare to target ASCII letters, so the OS **Telex/VNI IME never silently transforms** s/f/r/x/j/w/z. Do **not** assume the child's IME is off. Only the Telex stage interprets diacritic sequences — via **our own Telex engine** (vowel + tone composition, last-tone-wins, z-clears, double-letter escape). The Telex engine gets its own TDD test suite.
- **Voice/TTS**: Web Speech API, default **Northern (Hanoi)** accent (all six tones distinct); slower-playback option; speaks the **diacritic pronunciation** even when the on-screen token is ASCII. Southern accent offered only as an option. Graceful fallback when no vi-VN voice is installed.

## 6. Accessibility & UX

- **Progressively removable scaffolding**: *Training wheels* (paws + colors + sound on) → *Confident* (paws off) → *Touch typist* (colors off). Weans kids off looking down.
- **Pre-reader support**: every menu item + prompt has an **icon + spoken label**; character/scene select navigable by big pictures + sound (arrow keys + Enter, as original).
- **Colorblind-safe**: redundant paw + position cues always; optional pattern/shape palette; high contrast.
- **Reduced-motion** option (caps/ff disables screenshake & heavy particles).
- **Child-friendly typography**: large, clear, well-spaced glyphs for the word being typed; dyslexia-friendly font option.
- **Responsive / graceful device handling**: desktop-first (physical keyboard required), but a friendly explainer on mobile/touch instead of a hard block; on-screen keyboard remains visible.
- **Printable "color the keyboard" worksheet** matching in-game finger colors (parent trust + off-screen reinforcement).

## 7. Visual design direction

- Polished, warm, high-contrast kids' palette; dark playful backdrop (`#1a1a2e` base, per original) with vibrant scene themes. Finger colors reserved for the guidance system (not decoration) so they stay meaningful.
- Clear visual hierarchy: **play area** (top/center) → **word/caret** (center, biggest, most legible) → **on-screen keyboard + monkey paws** (lower third) → **HUD** (corners).
- Procedural pixel/vector monkey art now, with a documented **art hook** to swap in user-drawn sprites later (per "hybrid" decision).

## 8. Technical architecture

**Stack**: TypeScript (strict) + Vite + **Canvas 2D** for the game world/keyboard/HUD; a thin **DOM overlay** layer for menus/dialogs/settings (accessible, focusable, easy to style + voice). Vitest for tests.

**Rendering model**: fixed **logical resolution** (1280×720, 16:9) drawn to a backing canvas, scaled to fit the viewport (letterboxed), DPR-aware for crispness. Single `requestAnimationFrame` loop with fixed-timestep update + interpolated render.

**Module layout** (`src/`)
```
engine/      loop (fixed timestep), canvas/viewport scaling, input (raw key capture), audio bus, rng
render/      draw primitives, sprite/paw drawing, particles, camera (shake), text/caret
game/        pure logic (no canvas): typing resolver, scoring, combo, accuracy, adaptive engine,
             telex engine, progression/unlock rules, save/load model
content/     DATA (the extension surface): fingerMap.ts, characters.ts, scenes.ts, levels.ts,
             words/ (per-stage VN + EN lists), abilities.ts
scenes/      state machine screens: Boot, MainMenu, CharacterSelect, SceneSelect, LevelSelect,
             Tutorial, Play(ABC|Word), Results, Pause, Settings
keyboard/    the differentiator: on-screen keyboard widget + monkey-paw hands + next-key highlight
i18n/        vi + en string tables, t(key, params), language store
state/       persistence (localStorage), progress/unlocks, settings, profiles
ui/          DOM overlay menus/dialogs (accessible), bound to i18n + TTS
audio/       WebAudio SFX synth (clicks/dings/combo pitch), TTS wrapper, music
app/         wiring: scene manager, service container, main bootstrap
```

**Key boundary rule**: everything in `game/` and `content/` is **pure, canvas-free, deterministic** → unit-testable without a DOM. Rendering observes state; logic never imports rendering.

## 9. Core data schemas (the extension surface)

```ts
type Finger = 'L-pinky'|'L-ring'|'L-middle'|'L-index'|'R-index'|'R-middle'|'R-ring'|'R-pinky'|'thumb'
interface KeyDef { code: string; label: string; finger: Finger; hand: 'L'|'R'|'both';
                   row: 'number'|'top'|'home'|'bottom'|'space'; color: string;
                   isReach?: boolean; hasBump?: boolean }

interface CharacterDef { id: string; name: I18n; ability: AbilityId; colors: string[];
                         unlockCostBananas: number; world: SceneId;
                         art: { kind: 'code'; draw: PawAndBodyDrawer } | { kind: 'image'; src: string };
                         celebration: CelebrationId; jingle: JingleId }

interface SceneDef { id: SceneId; name: I18n; palette: ScenePalette; order: number;
                     parallaxLayers: LayerSpec[] }

interface LevelDef { id: string; stage: number; mode: 'abc'|'word'; lang: 'vi'|'en';
                     keySet: string[];            // keys active this level (drives adaptive set)
                     words?: string[];            // resolved from words/ lists
                     unlockStars: { one: 70; two: 85; three: 95 };
                     spawn: { baseSpeed: number; rampPerWord: number } }

interface SaveState { profiles: Profile[]; settings: Settings }
interface Profile { name: string; bananas: number; unlockedChars: string[];
                    unlockedScenes: SceneId[]; levelStars: Record<string, 1|2|3>;
                    keyConfidence: Record<string, number>; streak: { count: number; lastPlayedISO: string } }
```

## 10. Audio

- **SFX**: WebAudio-synthesized (no asset downloads needed) — soft key-click (pitch rises toward word end), bright word-complete ding, banana-collect, combo-tier chime (+1 semitone capped), gentle whiff on typo, fanfare on stage complete. Master + SFX + music volume; mute toggles.
- **Voice**: Web Speech API TTS (Northern VN default, EN voice for English track) — names the next key, reads the target word, cheers; reads diacritic pronunciation on ASCII tokens.
- **Music**: looped, low-key background per scene; intensity layers tied to combo. (Simple/synth first; swappable files later.)

## 11. Testing strategy (TDD)

Pure `game/` + `content/` logic is tested first, red→green→refactor:
- **Typing resolver**: lock-on, per-char correctness, caret behavior (no advance on error), partial progress.
- **Scoring/accuracy/WPM**: formulas, edge cases (0 chars, all-wrong, corrections).
- **Combo**: escalation tiers, cap, reset on typo/hit.
- **Adaptive engine**: confidence updates, next-key introduction threshold, weak-key re-injection, auto-slowdown.
- **Telex engine**: aa→â, tones, last-tone-wins, z-clear, double-letter escape, ASCII passthrough — dedicated suite.
- **Progression/unlocks**: star tiers, ≥70% gate, banana economy, scene/world unlocks, never-deduct rule.
- **Finger map integrity**: every QWERTY key has exactly one finger + color; F/J bumps; reach keys = yellow.
- **i18n**: every key present in vi + en; param interpolation.
- **Persistence**: save/load round-trip, migration safety.
Rendering/scene smoke tests via jsdom where feasible; manual verify in browser for feel.

## 12. Build & deployment

- `npm run build` → static `dist/` (Vite, `base: './'` so it works on any host/subpath).
- Deploy targets: Netlify / Vercel / GitHub Pages (all free). Provide a one-command deploy doc.
- Offline: the built `dist/` also opens locally; no server APIs.
- Fix original's defects: valid hosting/TLS, no hard mobile block, no console errors.

## 13. Phased delivery (milestones)

- **M0 — Foundation** ✅: Vite+TS+Vitest scaffold (done).
- **M1 — Typing core (logic, TDD)**: finger map, typing resolver, scoring/accuracy/WPM, combo. No graphics.
- **M2 — Keyboard guide + paws (the differentiator)**: on-screen keyboard, finger colors, next-key glow, monkey-paw hands with finger animation + home-row settle, F/J bumps. ABC mode playable.
- **M3 — Word mode action layer**: lock-on, caret coloring, monkey jump/attack/dodge, juice, kind failure.
- **M4 — Progression & content**: levels/curriculum, adaptive engine, 14 characters + abilities, 4 scenes, banana map, stars, persistence.
- **M5 — Vietnamese**: phased curriculum, IME-safe raw capture, Telex engine + stage, VN/EN i18n, TTS.
- **M6 — Polish & accessibility**: scaffolding toggles, reduced-motion, colorblind palette, audio pass, results/menus beauty, worksheet, responsive handling.
- **M7 — Ship**: build, deploy doc, final verification.

Each milestone: brainstorm-if-needed → plan → TDD → review (Superpowers loop).

## 14. Out of scope (v1) / risks

- Out of scope v1: online accounts/cloud sync, multiplayer racing servers, CN/JP/KR UI (data kept), full recorded voice-over (TTS first), native mobile app.
- Risks: non‑US keyboard layouts (F/J anchor assumes US QWERTY) — detect + warn; Telex engine complexity — isolated + heavily tested; TTS voice availability varies by OS — graceful fallback; finger-color convention is a deliberate choice, not a universal standard — colorblind-safe redundancy mandatory.
