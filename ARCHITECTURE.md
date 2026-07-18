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
      -> engine/weapon-renderer.js
      -> engine/shield-renderer.js
      -> engine/sheets.js
      -> engine/generators.js
    -> character-kit.js
      -> sprite-engine.js (catalogs through the public facade)
    -> zip.js (standalone archive writer)
```

Sprite-rendering consumers import `sprite-engine.js`. Internal engine module paths are deliberately not part of the public API. `zip.js` is a packaging-only utility and does not depend on engine internals.

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

Weapon entries include a broad content category (`blade`, `blunt`, `polearm`, `ranged`, or `magic`) plus player-facing Tier 2 through Tier 5 names. The separate stable `WEAPON_TIERS` catalog keeps progression independent from weapon type, producing 76 meaningful equipment states: none plus 15 weapons at five tiers. The UI, randomizer, presets, and exports consume both catalogs generically.

Shield entries likewise keep family and progression independent. `SHIELD_TIERS` exposes stable Tier 1 through Tier 5 ids, producing 41 meaningful off-hand states: none plus eight equipped shields at five tiers. Selecting no shield normalizes the tier to Tier 1, while old saved state and presets gain the backward-compatible Tier 1 default.

Outfit entries carry player-facing Tier 2 through Tier 5 armor names, while the stable `OUTFIT_TIERS` catalog keeps armor progression independent from outfit family. Every tier is cumulative inside the animated outfit pass: Tier 2 reinforces shoulders and waist, Tier 3 adds a readable crest, Tier 4 expands the pauldron silhouette, and Tier 5 adds an apex crown and luminous sigil. Legacy state defaults safely to Tier 1.

### Renderer

`engine/renderer.js` converts a sprite specification, direction, animation, and frame into pixels on a 24x24 canvas context. It owns procedural shapes, armor-tier overlays, and family-specific drawing dispatch. Player specifications may include validated optional base/shadow overrides for skin, hair, and outfit; absent or invalid pairs fall back to the selected catalog colors. Optional facial details are layered only on visible human faces, use the resolved player palettes where appropriate, mirror with the existing left/right renderer, and defer to headgear visibility rules.

`engine/weapon-renderer.js` owns humanoid weapon pixels, reusable blade-hilt primitives, shared down, up, and side pose anchors, and the weapon progression layers. Existing enemy-used weapon ids retain their original coordinates and Tier 1 pixels. Tier 2 adds stronger silhouettes and materials; Tier 3 builds on that geometry with legendary ornaments and effects; Tier 4 deliberately extends reach toward the safe frame limits. Tier 5 branches from the proven Tier 3 foundation instead of inheriting Tier 4's oversized overlay, then builds a purpose-made artifact silhouette with a weapon-specific palette, readable physical parts, restrained supporting effects, and distinct front, profile, and strike shapes. All player tiers use the face-safe side offset and follow the animated hand's idle bob, walk swing, attack pose, and lunge through rig transforms supplied by the humanoid configuration.

`engine/shield-renderer.js` owns humanoid shield pixels, eight player shield silhouettes, edge-on side profiles, direction-aware front/behind layering, the independent off-hand pose transform, and shield progression layers. Tier 2 expands every Tier 1 silhouette with family-specific reinforcement, ornament, or magic rather than recoloring the base. Tier 3 builds cumulatively on those forms with readable legendary crowns, crests, points, royal bands, antlers, and astral ornaments in both full and profile views. Tier 4 deliberately expands every family toward the safe frame limits with mythic cores, wider wings and star points, taller crowns, fortress rails, longer fangs, and larger magical projections while retaining the underlying shield identity. Tier 5 branches from the cleaner Tier 3 foundation into eight independent artifact designs, each with a dedicated silhouette and material language rather than stacking another dense overlay on Tier 4. Player shields follow the opposite walk swing, brace through attack and recovery, and inherit body lunges while preserving the protected face area. Humanoid enemies stay on the legacy shield path so expanding player content does not silently redraw established enemy sheets.

### Sheets and thumbnails

`engine/sheets.js` assembles renderer frames into the stable 12-column by 4-row full sheet, selected-animation sheets with four direction rows, selected-direction sheets with all 12 frame columns, and UI thumbnails.

### Generators

`engine/generators.js` creates random valid specifications and safe default export names.

### Complete character kits

`character-kit.js` deterministically expands the player catalogs into one deduplicated component plan: skin-body, head, hair, face-detail, outfit-back, outfit, headgear, weapon, and shield passes. It also expands every enemy family and variation into stable `enemies/<family>/<variation>.png` paths and every combat effect into stable `effects/<category>/<effect>.png` paths for complete native sheets. Up to 24 named players are mapped to lightweight recipes that reference the shared character paths. The standalone kit adds no per-recipe PNGs; the combined Complete Pack adds one assembled native sheet per player for immediate use. The planner owns stable paths, counts, recipe limits, the native export scale, compatibility variants, and the runtime layer order. It imports catalogs only through `sprite-engine.js` and does not access the DOM, canvas, editor state, persistence, or ZIP implementation.

### Archive packaging

`zip.js` builds stored ZIP archives with UTF-8 paths and CRC-32 checksums. It accepts already-rendered files and has no knowledge of editor state, sprite specifications, or rendering internals.

### Editor

`app.js` owns UI state, controls, animation playback and frame inspection, reset and comparison workflows, browser persistence, editable-document history, versioned named presets, character/export naming, reusable palette presets, sprite packs, Complete Character Kit rendering, and download behavior. It consumes sprite behavior only through the public engine facade, uses `character-kit.js` for deterministic component, enemy, and effect coverage plus recipe mapping, and uses `zip.js` for packaging. History snapshots contain the active mode, player/enemy/effect specifications, optional player palette, and document names, so preset loads, resets, and saved-copy restores undo coherently while preview frame, direction, animation, cycle, speed, export-view, comparison-copy choices remain independent. The optional sanitized comparison snapshot persists locally with editor state but does not enter document history unless it is restored into the editor. Character preset schema v6 adds the armor tier and migrates v1 through v5 libraries; schema v5 added shield tiers and schema v4 introduced weapon tiers. The independent palette-library schema stores reusable six-tone player palettes. Sprite-pack schema v1 stores named player, enemy, and effect specifications independently from editor history and produces full-sheet ZIP archives with a versioned manifest. Complete Character Kit schema v3 exports 769 content-unique atomic component sheets, all 202 enemy variations, all 24 combat effects, one reference preview, and up to 24 artwork-free recipes. Complete Character Pack schema v3 combines the same shared libraries and recipes with one assembled native sheet per saved player.

### Windows wrapper

`src-tauri/` owns the native window, application metadata, permissions, content-security policy, and packaging. It does not contain a second renderer or editor implementation.

## Stable invariants

- Logical frame size is 24x24 pixels.
- Directions are ordered down, left, right, up.
- Each row contains idle x2, walk x4, attack x4, hurt x2.
- Full sheets are 288x96 logical pixels before export scaling.
- Export scale 1x preserves those logical pixels exactly; full, animation, and direction exports also support 4x, 8x, and 12x nearest-neighbor scaling.
- Exported sheets have a transparent background and no baked shadow.
- Character-pack archives always contain complete full sheets at the selected scale plus a manifest that records their logical and actual dimensions.
- Complete Character Kits always use native 1x sheets and the draw order `weapon-back`, `shield-back`, `outfit-back`, `outfit`, `skin-body`, `head`, `face-detail`, `hair`, `headgear`, `shield-front`, `weapon-front`.
- Complete Character Kit recipes support at most 24 saved players, reference only shared paths, add no PNGs, and must recompose the complete renderer pixel-for-pixel.
- Combined Complete Character Packs include one assembled native sheet per recipe and reuse the first assembled sheet as the reference preview instead of exporting a duplicate reference PNG.
- `sprite-engine.js` remains the public import path.
- Browser and Windows builds use identical production files.

`npm run check` enforces these invariants against the native export contract, character-pack ZIP format, Complete Character Kit component matrix, recipe paths, exact pixel recomposition, `asset-pack/manifest.json`, and all 144 committed PNG fixtures.

## Adding content safely

### Add a player option

1. Add the option to `engine/catalogs/player-options.js`.
2. Add or update renderer behavior only if the option introduces a new shape rather than a palette variant.
3. If it belongs to an existing category, its control is populated from that catalog. If it creates a new category, add the validated state field and one `playerGroups()` entry in `app.js`.
4. Preserve a backward-compatible default so old saved state and presets still sanitize safely.
5. Run `npm run check`, `npm run build`, and the browser smoke test.

For face-bound content, verify front and both side views, confirm the rear view stays anatomically correct, and test every face-hiding headgear option.

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
