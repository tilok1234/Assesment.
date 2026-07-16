# 8-bit Sprite Assembler

A browser-based procedural sprite creator for building 24x24 player characters and enemies, previewing four-direction animations, and exporting game-ready PNG sprite sheets.

## Current capabilities

- Player assembly from skin, hair, headgear, outfit, weapon, shield, and palette choices
- 41 enemy families with 138 predefined variants
- Four directions: down, left, right, and up
- Idle, walk, attack, and hurt animations
- Transparent PNG sprite-sheet export at 4x, 8x, or 12x scale
- A validated asset pack containing 144 exported sheets
- Local browser persistence for the current configuration

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
- Pack export scale: 4x
- Pack sheet size: 1152x384 pixels
- Transparent background with no baked shadow

## Project layout

- `index.html` - standard application entry point
- `styles.css` - desktop-style responsive interface
- `app.js` - editor state, controls, animation preview, persistence, and downloads
- `sprite-engine.js` - procedural sprite definitions, rendering, animation, and export
- `asset-pack/` - validated enemy and example player sheets
- `tools/dev-server.mjs` - dependency-free local development server
- `tools/build.mjs` - dependency-free production build
- `tools/check-project.mjs` - project and asset validator
- `src-tauri/` - Tauri 2 Windows wrapper, permissions, CSP, and icon resources
- `ROADMAP.md` - agreed development and Windows release order

## Direction

The project will preserve the sprite-sheet contract while moving toward an app-ready frontend, a small Tauri Windows proof, expanded editor functionality and content, and finally a polished Windows installer. See [ROADMAP.md](ROADMAP.md).
