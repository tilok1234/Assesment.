# 8-bit Sprite Assembler

A browser-based procedural sprite creator for building 24x24 player characters and enemies, previewing four-direction animations, and exporting game-ready PNG sprite sheets.

## Current capabilities

- Player assembly from skin, hair, eight facial details, headgear, outfit, weapon type and tier, shield, and palette choices
- 41 enemy families with 138 predefined variants
- Four directions: down, left, right, and up
- Idle, walk, attack, and hurt animations
- Transparent PNG sprite-sheet export at 4x, 8x, or 12x scale
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

The validator checks JavaScript syntax, the engine-to-manifest contract, every referenced asset, unexpected PNG files, and the exact dimensions of all exported sheets.

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
- Pack export scale: 4x
- Pack sheet size: 1152x384 pixels
- Transparent background with no baked shadow

## Project layout

- `index.html` - standard application entry point
- `styles.css` - desktop-style responsive interface
- `app.js` - editor state, sprite history, reset and comparison workflows, character and palette presets, migration, naming, playback and frame inspection, persistence, and downloads
- `sprite-engine.js` - stable public engine API
- `engine/` - focused animation, palette, player-option, enemy, humanoid weapon, renderer, sheet, and generator modules
- `asset-pack/` - validated enemy and example player sheets
- `tools/dev-server.mjs` - dependency-free local development server
- `tools/build.mjs` - dependency-free production build
- `tools/check-project.mjs` - project and asset validator
- `src-tauri/` - Tauri 2 Windows wrapper, permissions, CSP, and icon resources
- `ARCHITECTURE.md` - engine boundaries, dependency direction, and safe extension points
- `ROADMAP.md` - agreed development and Windows release order

## Direction

The project will preserve the sprite-sheet contract while moving toward an app-ready frontend, a small Tauri Windows proof, expanded editor functionality and content, and finally a polished Windows installer. See [ROADMAP.md](ROADMAP.md).
