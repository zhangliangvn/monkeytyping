# Monkey Typing — Locked Decisions & Original-App Inventory

> Reference doc. Captures (a) the decisions the user confirmed during brainstorming, and
> (b) facts reverse-engineered from the original app at https://monkeytyping.pixelz-lab.com/.
> The full design spec is built on top of this once the research workflow completes.

## 1. Project goal (user, 2026-06-27)

Build a **professional, polished, complete** 10-finger touch-typing GAME for children — **better than the
original** Monkey Typing. The original still has bugs and, crucially, **does not teach which finger goes on
which key**. Ours must:

- Teach correct **finger-to-key** placement, visually and intuitively.
- Be **fun and motivating** for kids so they want to practice.
- Be **visual, intuitive, easy to use**.
- Reference the best 10-finger typing games/tutors, then optimize and surpass them.

## 2. Locked decisions (from brainstorming)

| Decision | Choice |
|---|---|
| Fidelity | Clean, faithful **rebuild** optimized for extensibility (not a 1:1 copy of minified code) |
| Content scope (v1) | **Full like original**: all 14 characters, 4 scenes, full level system |
| Languages | **Vietnamese + English** (i18n structured to add more later) |
| Art style | **Hybrid**: procedural code-drawn characters first, with a hook to swap in user-drawn images later |
| Deployment | **Web** (build to static files, host on Netlify/Vercel/GitHub Pages) |
| Tech stack (recommended) | **TypeScript + Vite + Canvas 2D**, data-driven architecture |
| Method | Superpowers: brainstorm → spec → plan → TDD implementation → review |

## 3. Original app — reverse-engineered inventory

Source: host HTML (3.7 KB) + single Vite bundle `/assets/index-Bwqg6FtV.js` (667 KB).
Site note: the original's TLS certificate is **expired** (had to bypass to fetch). Desktop-only (blocks mobile).

### Rendering
- HTML5 **Canvas 2D** (`getContext("2d")`, `fillText`, `fillRect`) on `<canvas id="game-canvas" width=800 height=600>`,
  resized via `visualViewport`. Background `#1a1a2e`.
- Characters drawn **procedurally** (200+ hardcoded hex colors) + **emoji** rendered as text.
- Three.js / WebGLRenderer is bundled but appears incidental (game render path is 2D). We will NOT carry this.

### Concept / gameplay
- Type words/letters to make a **Monkey** perform actions: **🦘 JUMP**, **⚔ ATTACK**, **dodge**.
- Live HUD: **Score**, **Combo**, **Level**.
- Combo system; **Accuracy**; **Max Combo** shown on results.

### Modes
- `word` — 📝 type whole words.
- `alphabet` — 🔤 ABC — type single letters / 2-letter combos (for youngest learners).

### Characters (14 "monkey types")
`classic, ninja, pirate, astronaut, superman, hulk, spiderman, ironman, princess, fairy, mermaid, ballerina, kitty, frozen`
- Character colors include: `brown, golden, gray, white, pink` (+ themed).
- Abilities/effects present: `shield, smash, laser, freeze, web, fireworks, combo, celebration`
  (likely mapped e.g. hulk→smash, spiderman→web, ironman/superman→laser, frozen→freeze).

### Scenes (4)
`🌴 jungle, desert, ocean, space`

### Word lists (touch-typing pedagogy already present!)
- Built from **keyboard rows**: home row `a s d f g h j k l`, top row `q w e r t y u i o p`, bottom row `z x c v b n m`.
- Example home-row words found: `as, sa, add, ads, aff, ass, dad, daf, fad, fas, sad, saf, dash, fall, glad, half, hall, lads, lash, lass, flag, fads, gash, gall, jags, shag, slag`.
- ABC mode uses letter pairs `aa, ab, ac … ff`.

### Progression
- **Level select**; next level unlocks at **≥ 70% accuracy**.
- "Level Complete!" / "Game Over" screens with Score, Accuracy, Max Combo.
- Continue / New Game (progress persisted locally). "New Game" resets all progress.

### Reward / effect emoji
`🍌 ⭐ 💫 🌟 ✨ 🎮 🐵 🎯 🏆 💎` (rewards) and `🍌 🌀 💣 🪐 ❄️ …` (obstacles/projectiles).

### i18n (already 5 languages in original — full strings extracted)
`en, vi (Tiếng Việt), cn (中文), jp (日本語), kr (한국어)`. Full UI string tables captured for all 5.
Key UI areas: main menu (Continue, New Game, Level Select, Character, Scene, Settings),
settings (Music, SFX, Language), pause, level-complete/game-over, HUD (Score/Combo/Level/ATTACK/JUMP),
3-step tutorial, character select (type + color, arrow-key nav), scene select, level select,
mode toggle (Word/ABC), confirm-new-game dialog.

### Controls
- Keyboard-driven. Menus: ← → ↑ ↓ to navigate, Enter to confirm, Esc to back.

## 4. Known weaknesses to BEAT (initial; refined by research)
- ❌ **No finger-placement guidance** — does not show which finger presses which key. (Our #1 differentiator.)
- ❌ No on-screen keyboard guide / next-key highlight / hand visualization (to confirm via RE).
- ⚠️ Reported bugs / unpolished feel (user-observed).
- ⚠️ Expired TLS cert; desktop-only with no graceful path.
- ⚠️ Vietnamese practice with diacritics is impractical for QWERTY beginners — strategy needed.

## 5. Pending (filled after research workflow `wf_95319f4d-31c`)
- Authoritative finger→key mapping + per-finger color convention.
- Lesson/curriculum progression order for kids.
- Finger-guidance UI design (on-screen keyboard + hands + next-key highlight).
- Kid engagement & juice patterns; visual/UX/accessibility direction.
- Vietnamese word-list & curriculum strategy (ASCII-first vs diacritics).
- Exact original constants (scoring/combo/physics/level configs) from deep RE.
