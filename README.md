# 8-bit Sprite Assembler

A browser-based procedural sprite creator for building 24x24 player characters and enemies, previewing four-direction animations, and exporting game-ready PNG sprite sheets.

## Current capabilities

- Player assembly from skin, hair, eight facial details, headgear, outfit, weapon type and tier, shield, and palette choices
- 41 enemy families with 138 predefined variants
- Four directions: down, left, right, and up
- Idle, walk, attack, and hurt animations
- Transparent PNG sprite-sheet export at native 1x, 4x, 8x, or 12x scale
- Persistent named character packs that collect player and enemy designs and download as a ZIP with full PNG sheets and `manifest.json`
- One-click native Master Character Kits that lock one player identity and export every armor color, headgear, weapon tier, and color-aware shield tier as game-composable layers
- A validated asset pack containing 144 exported sheets
- Local browser persistence for the current configuration
- Versioned, named player and enemy presets stored on the current device
- Sprite-only undo and redo through the header controls or `Ctrl+Z` / `Ctrl+Y`
- Whole-sprite and per-category randomization with undo support
- Persistent character names, live preview labels, and Windows-safe custom PNG filenames
- Editable skin, hair, and outfit tone pairs with a reusable local palette library
- Full-sheet, selected-animation, and selected-direction PNG export scopes
- Play/pause, 0.5x/1x/2x playback speeds, frame stepping, and direct frame inspection with sheet-column metadata
- Undoable player/enemy reset plus a persistent saved copy for animated side-by-side A/B comparison
- Facial detail choices for none, beard, mustache, scar, eyepatch, glasses, blush, and war paint; details follow character colors, respect rear views, and hide beneath full helmets
- Fifteen equipped weapon choices spanning blades, blunt weapons, polearms, ranged weapons, and magic focuses, each with standard Tier 1, named RPG-style Tier 2, legendary Tier 3, oversized mythic Tier 4, and final artifact Tier 5 forms; all 75 variants use hand-anchored motion and preserve front- and side-face clearance
- Eight equipped shield choices—round, kite, buckler, heater, tower, oval, bone, and arcane—each with a standard Tier 1, named reinforced Tier 2, legendary Tier 3, and oversized mythic Tier 4 form; all use distinct front and profile silhouettes, direction-aware layering, off-hand walk motion, and attack bracing

## Preview controls

- `Space` plays or pauses the selected animation.
- `[` and `]` inspect the previous or next frame and pause playback.
- Arrow keys change direction without changing the inspected frame.
- `Cycle all` resumes playback and visits every animation and direction.

## Compare variants

1. Select **Duplicate** to preserve the current sprite as copy A.
2. Keep editing the live sprite, then select **Compare** to inspect A and B on the same animation frame.
3. Keep the current version, restore the saved copy as one undoable edit, or replace/remove the saved copy.

The saved comparison copy stays on the current device until it is replaced or removed.

## Run it on Windows

Double-click `start-dev.bat`. It starts the local development server and opens the assembler in your default browser.

Node.js 18 or newer is required for development. No npm packages need to be installed.

You can also run it from a terminal:

```powershell
npm run dev:open
```

Keep the terminal window open while using the assembler. Press `Ctrl+C` to stop the server.

To build and preview the exact production files:

```powershell
npm run build
npm run preview
```

## Validate the project

Double-click `check-project.bat`, or run:

```powershell
npm run check
```

The validator checks JavaScript syntax, the engine-to-manifest contract, every referenced asset, unexpected PNG files, exact native export dimensions, character-pack ZIP structure, Master Character Kit coverage and layer order, and the dimensions of all committed sheets.

## Build the Windows application

Windows development requires Node.js, Rust, Microsoft C++ Build Tools, and WebView2. After installing those prerequisites, run:

```powershell
npm install
npm run tauri:dev
```

Create an optimized standalone executable with:

```powershell
npm run tauri:build
```

The proof build is written to `src-tauri/target/release/sprite-assembler.exe`. The installer targets remain configured for the later release phase, but this command intentionally skips installer generation while the product is still evolving.

## Sprite-sheet contract

- Logical frame: 24x24 pixels
- Grid: 12 columns by 4 rows
- Rows: down, left, right, up
- Columns: idle x2, walk x4, attack x4, hurt x2
- Animation export: selected animation frames across four direction rows
- Direction export: all 12 animation frames across one selected direction row
- Native 1x export sizes: full sheet 288x96, direction sheet 288x24, and animation sheet 48x96 or 96x96 pixels
- Committed fixture pack scale: 4x
- Committed fixture sheet size: 1152x384 pixels
- Transparent background with no baked shadow

## Character packs

1. Give the pack a name, create a player or enemy, and give the character a name.
2. Select **Add current**, then repeat for as many characters as needed.
3. Use **Load** to keep editing an entry or **Remove** to take it out of the pack.
4. Choose an export scale, including **1x Native**, then select **Download pack ZIP**.

The working pack stays on the current device. Each downloaded ZIP contains one complete full sheet per character plus a versioned `manifest.json` with the exact character specifications, animation contract, dimensions, and file paths.

For a reusable game asset pack, add up to 24 player characters and select **Download Pack Master Kit**. That export treats the saved players as identities rather than fixed loadouts: every identity receives all compatible outfit, color, and headgear body sheets, while one shared weapon and shield library can be equipped by the entire roster. Enemy entries remain available in the regular character-pack ZIP but are not included in the player-only Pack Master Kit.

## Master Character Kits

Use **Download Master Character Kit** in Player mode when a game needs to change one character's equipment at runtime. The current skin, hair, facial detail, and custom identity colors stay locked while the kit exports:

- Every outfit, catalog outfit color, and headgear combination as a complete body layer
- All 15 weapons at Tiers 1-5 as separate back/front layers
- All eight shields at Tiers 1-4 in every outfit color as separate back/front layers
- The current custom outfit color as an additional option when it is not already in the catalog
- One assembled reference sheet, `manifest.json`, and `README.txt`

A standard kit contains 879 native `288x96` PNGs. Draw the same animation frame from `weapon-back`, `shield-back`, the selected body, `shield-front`, and `weapon-front`, in that order. Empty equipment pixels are intentional; they preserve direction-aware occlusion.

### Pack Master Kits

The Character Pack panel can combine 1-24 saved player identities into one `8-bit-sprite-assembler-master-roster-kit` archive. A standard 24-character roster contains:

- 6,720 character-specific body sheets: 280 outfit, color, and headgear choices for each identity
- 150 shared weapon layers: all 15 families at Tiers 1-5, split into back/front passes
- 448 shared shield layers: all eight families at Tiers 1-4 and all seven catalog colors, split into back/front passes
- 24 assembled reference sheets
- One manifest and README describing character roots, shared paths, animation timing, and runtime draw order

That is 7,342 native PNGs instead of 24 duplicated 879-file kits. Body sheets stay identity-specific so faces, hair, skin, hands, armor, and headgear retain exact pixels; weapon and shield layers are stored once and work across the roster.

## Project layout

- `index.html` - standard application entry point
- `styles.css` - desktop-style responsive interface
- `app.js` - editor state, sprite history, reset and comparison workflows, presets, character packs, Master Character Kit rendering, naming, playback and frame inspection, and downloads
- `character-kit.js` - deterministic Master Character Kit coverage, paths, identity, and equipment-layer planning
- `zip.js` - dependency-free ZIP archive writer used by character-pack and Master Character Kit export
- `sprite-engine.js` - stable public engine API
- `engine/` - focused animation, palette, player-option, enemy, humanoid weapon and shield, renderer, sheet, and generator modules
- `asset-pack/` - validated enemy and example player sheets
- `tools/dev-server.mjs` - dependency-free local development server
- `tools/build.mjs` - dependency-free production build
- `tools/check-project.mjs` - project and asset validator
- `src-tauri/` - Tauri 2 Windows wrapper, permissions, CSP, and icon resources
- `ARCHITECTURE.md` - engine boundaries, dependency direction, and safe extension points
- `ROADMAP.md` - agreed development and Windows release order

## Direction

The project will preserve the sprite-sheet contract while moving toward an app-ready frontend, a small Tauri Windows proof, expanded editor functionality and content, and finally a polished Windows installer. See [ROADMAP.md](ROADMAP.md).
