# Architecture

The Sprite Assembler keeps its browser and Windows builds on the same frontend and procedural engine. Tauri packages the production web build without duplicating editor or rendering logic.

## Dependency direction

```text
index.html
  -> app.js
    -> sprite-engine.js (stable public facade)
      -> engine/catalogs.js
        -> engine/catalogs/animation.js
        -> engine/catalogs/palettes.js
        -> engine/catalogs/player-options.js
        -> engine/catalogs/enemies.js
      -> engine/renderer.js
      -> engine/sheets.js
      -> engine/generators.js
```

Consumers import `sprite-engine.js`. Internal module paths are deliberately not part of the public API.

## Module responsibilities

### Public facade

`sprite-engine.js` re-exports the supported engine API. It stays small so internal files can move without forcing UI or integration changes.

### Catalogs

- `engine/catalogs/animation.js` owns frame size, directions, animation timing, and sheet layout.
- `engine/catalogs/palettes.js` owns shared material and renderer colors.
- `engine/catalogs/player-options.js` owns player-facing appearance and equipment choices.
- `engine/catalogs/enemies.js` owns enemy families and variants.
- `engine/catalogs.js` is the internal catalog facade used by the renderer and helpers.

Catalog files describe content. They do not touch the DOM, canvas, editor state, or persistence.

### Renderer

`engine/renderer.js` converts a sprite specification, direction, animation, and frame into pixels on a 24x24 canvas context. It owns procedural shapes and family-specific drawing dispatch. Player specifications may include validated optional base/shadow overrides for skin, hair, and outfit; absent or invalid pairs fall back to the selected catalog colors.

### Sheets and thumbnails

`engine/sheets.js` assembles renderer frames into the stable 12-column by 4-row full sheet, selected-animation sheets with four direction rows, selected-direction sheets with all 12 frame columns, and UI thumbnails.

### Generators

`engine/generators.js` creates random valid specifications and safe default export names.

### Editor

`app.js` owns UI state, controls, animation playback and frame inspection, reset and comparison workflows, browser persistence, editable-document history, versioned named presets, character/export naming, reusable palette presets, and download behavior. It consumes only the public engine facade. History snapshots contain the active mode, player/enemy specifications, optional player palette, and document names, so preset loads, resets, and saved-copy restores undo coherently while preview frame, direction, animation, cycle, speed, export-view, and comparison-copy choices remain independent. The optional sanitized comparison snapshot persists locally with editor state but does not enter document history unless it is restored into the editor. Character preset schema v3 migrates v1 and v2 libraries; the independent palette-library schema stores reusable six-tone player palettes.

### Windows wrapper

`src-tauri/` owns the native window, application metadata, permissions, content-security policy, and packaging. It does not contain a second renderer or editor implementation.

## Stable invariants

- Logical frame size is 24x24 pixels.
- Directions are ordered down, left, right, up.
- Each row contains idle x2, walk x4, attack x4, hurt x2.
- Full sheets are 288x96 logical pixels before export scaling.
- Exported sheets have a transparent background and no baked shadow.
- `sprite-engine.js` remains the public import path.
- Browser and Windows builds use identical production files.

`npm run check` enforces these invariants against `asset-pack/manifest.json` and all 144 committed PNG fixtures.

## Adding content safely

### Add a player option

1. Add the option to `engine/catalogs/player-options.js`.
2. Add or update renderer behavior only if the option introduces a new shape rather than a palette variant.
3. Run `npm run check`, `npm run build`, and the browser smoke test.

Existing UI categories populate automatically from their catalog arrays.

### Add an enemy variant

1. Add the variant beneath its family in `engine/catalogs/enemies.js`.
2. Re-export its fixture into `asset-pack/enemies/`.
3. Register the file in `asset-pack/manifest.json`.
4. Run `npm run check` to catch definition, registration, or dimension drift.

### Add an enemy family

1. Add the family and variants in `engine/catalogs/enemies.js`.
2. Add its procedural drawing function and dispatch in `engine/renderer.js`.
3. Export and register every fixture.
4. Verify all directions and animations before publishing.

### Change the sheet contract

Treat frame size, direction order, animation counts, or row/column layout changes as a versioned format migration. Update the animation catalog, renderer, sheet builder, manifest, fixtures, validator, documentation, and consuming game integrations together.
