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
      -> engine/outline-renderer.js
      -> engine/weapon-renderer.js
      -> engine/shield-renderer.js
      -> engine/effect-renderer.js
      -> engine/combat-loadouts.js
      -> engine/sheets.js
      -> engine/generators.js
      -> engine/variant-batches.js
      -> engine/class-templates.js
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
- `engine/catalogs/player-options.js` owns stable player-facing species, body-build, expression, appearance, and equipment choices.
- `engine/catalogs/enemies.js` owns enemy families and variants.
- `engine/catalogs.js` is the internal catalog facade used by the renderer and helpers.

Catalog files describe content. They do not touch the DOM, canvas, editor state, or persistence.

Weapon entries include a broad content category (`blade`, `blunt`, `polearm`, `ranged`, or `magic`) plus player-facing Tier 2 through Tier 5 names. The separate stable `WEAPON_TIERS` catalog keeps progression independent from weapon type, producing 76 meaningful equipment states: none plus 15 weapons at five tiers. The UI, randomizer, presets, and exports consume both catalogs generically.

Shield entries likewise keep family and progression independent. `SHIELD_TIERS` exposes stable Tier 1 through Tier 5 ids, producing 41 meaningful off-hand states: none plus eight equipped shields at five tiers. Selecting no shield normalizes the tier to Tier 1, while old saved state and presets gain the backward-compatible Tier 1 default.

Outfit entries carry player-facing Tier 2 through Tier 5 armor names, while the stable `OUTFIT_TIERS` catalog keeps armor progression independent from outfit family. The catalog now contains nine stable families; Barbarian Furs, Ranger Coat, Cleric Vestments, and Necromancer Robes append to the original five ids without reordering them. Every tier is cumulative inside the animated outfit pass: Tier 2 reinforces shoulders and waist, Tier 3 adds a readable crest, Tier 4 expands the pauldron silhouette, and Tier 5 adds an apex crown and luminous sigil. Legacy state defaults safely to Tier 1.

### Renderer

`engine/renderer.js` converts a sprite specification, direction, animation, and frame into pixels on a 24x24 canvas context. Its pixel buffer can optionally report every attempted out-of-canvas write, which lets validators distinguish real cropping from harmless edge contact. Humanoid body, shield, and headgear remain on their registered anchor during attacks, while the weapon uses a one-pixel perpendicular follow-through/recoil to preserve motion phases without leaving the cell. It owns procedural shapes, body-build silhouettes, armor-tier overlays, species traits, expressions, hairstyles, headgear, and family-specific drawing dispatch. Player specifications may include validated optional base/shadow overrides for skin, hair, and outfit; absent or invalid pairs fall back to the selected catalog colors. Classic is the pixel-identical legacy body default; Lean narrows the torso, Sturdy broadens it, and Heroic uses a wide-shouldered tapered profile. All four builds keep the established hand and equipment anchors, direction rows, and animation timing. Human remains the pixel-identical species compatibility default. Elf ears, Orc ears and tusks, Goblin ears, Tiefling horns and tails, Celestial wings and halos, broad Dwarf features, fixed-color Undead skulls and bone hands, Lizardfolk scales and tails, and Beastkin ears, muzzles, and tails follow the shared humanoid direction and animation rig through separate `species-back` and `species-front` passes. Skin-dependent traits use the resolved skin pair, Beastkin fur uses the resolved hair pair, and the two new tail families follow walk and attack motion. Full helmets suppress front traits while tails and wings remain available behind the body. Neutral is the pixel-identical legacy face default; Happy, Angry, Sad, Surprised, and Determined are drawn through a separate expression pass in every visible direction. Player glasses use open lenses so expressions remain visible, while full helmets suppress the entire expression pass. The 11 hairstyles include direction-aware Braids, Afro, Topknot, and Messy silhouettes; fitted headgear either preserves deliberate lower hair details or uses the shared compact short/spiky/bowl/topknot pass. The 12 headgear choices include outfit-colored Bandana and Plumed Helm art plus fixed-color Circlet and Skull Mask art. Open gear preserves expression pixels, while the Skull Mask intentionally covers them in visible directions. Humanoid enemies retain their established neutral faces independently. Optional facial details are layered only on visible faces, use the resolved player palettes where appropriate, mirror with the existing left/right renderer, and defer to headgear visibility rules.

The four expanded outfit families add direction-aware fur, coat-tail, vestment, and deathshroud identity passes plus family-specific tier materials while preserving the shared humanoid rig and the original five families pixel-for-pixel.

`engine/outline-renderer.js` owns the optional assembled-player outline treatment. It requests the renderer's existing body, headgear, back/front weapon, and back/front shield layers and merges them into three logical owners: body, weapon, and shield. Headgear remains inside the body owner, while its concrete foreground layer is retained so contact logic can preserve every visible hat pixel. The body receives its mode-specific exterior contour. Equipment uses a cardinal exterior contour in both modes and admits an enclosed transparent component only when its area is at least five logical pixels, preserving large silhouette-defining openings while suppressing tiny construction pockets. A front/back humanoid neck-cavity pass finds the moving eight-pixel head-base/two-pixel-neck transition and ORs outline into only transparent cells directly beneath that head base. The untouched final renderer result is composited above those transparent-space contours, after which a layer-aware contact pass uses each concrete pass identity to place separators on the protected side of direct edge-sharing contact. Back-pass equipment receives an equipment-side separator; at body contact, front-pass equipment normally remains intact while the adjacent character-side boundary receives the separator. If that replacement would cardinally extend an existing dark body feature, the character pixel is preserved and the separator moves to the touching front-equipment pixel. At headgear contact, front-pass equipment receives an equipment-side separator while the hat stays unchanged. Three-way equipment/headgear/body contacts retain the continuous equipment-side headgear edge, with the feature-preserving rule independently deciding whether the body-side candidate remains. Diagonal-only proximity is left to the transparent-space contour so the contact pass cannot clip corners or endcaps. The contact pass does not change procedural source geometry or assets. None mode delegates directly to the original renderer so its pixels remain identical to the safe baseline. Enemies, combat effects, source assets, and atomic component sheets do not pass through this treatment.

Contact-converted source pixels are excluded only from casting a redundant exterior halo, so the separator stays one pixel thick without removing legitimate interior equipment contours.

`engine/weapon-renderer.js` owns humanoid weapon pixels, reusable blade-hilt primitives, shared down, up, and side pose anchors, and the weapon progression layers. Existing enemy-used weapon ids retain their original coordinates and Tier 1 pixels. Tier 2 adds stronger silhouettes and materials; Tier 3 builds on that geometry with legendary ornaments and effects; Tier 4 deliberately extends reach toward the safe frame limits. Tier 5 branches from the proven Tier 3 foundation instead of inheriting Tier 4's oversized overlay, then builds a purpose-made artifact silhouette with a weapon-specific palette, readable physical parts, restrained supporting effects, and distinct front, profile, and strike shapes. Staff, wand, and spellbook use separate player-only readable paths: the staff preserves a long counterweighted shaft and connected crown, the wand stays compact through every tier, and the book keeps a connected cover, spine, and page spread instead of detached casting particles or slab-like overlays; legacy enemy staves remain on their established renderer. All player tiers use the face-safe side offset and follow the animated hand's idle bob, walk swing, attack pose, and lunge through rig transforms supplied by the humanoid configuration.

`engine/shield-renderer.js` owns humanoid shield pixels, eight player shield silhouettes, direction-aware face depth, an equipment-owned hand grip, and shield progression layers. Equipment uses an object-space attachment rule: turning the character never applies a second relative turn to the shield. Every direction reuses the same broad-face artwork attached to the animated shield-hand socket. The ordinary two-by-two hand is replaced by a material-appropriate grip in the front equipment pass; a far shield face can therefore remain behind the reusable body without allowing skin pixels to reappear between arm and shield. The original facing direction survives the renderer's left/right mirror so only screen position and near/far torso occlusion change. Tier growth retains a fixed face origin extending outward from that grip instead of moving the attachment point. Tier 2 expands every Tier 1 silhouette with family-specific reinforcement, ornament, or magic rather than recoloring the base. Tier 3 builds cumulatively on those forms with readable legendary crowns, crests, points, royal bands, antlers, and astral ornaments in the unchanged broad-face view. Tier 4 deliberately expands every family toward the safe frame limits with mythic cores, wider wings and star points, taller crowns, fortress rails, longer fangs, and larger magical projections while retaining the underlying shield identity. Tier 5 branches from the cleaner Tier 3 foundation into eight independent artifact designs, each with a dedicated silhouette and material language rather than stacking another dense overlay on Tier 4. Player shields follow the exact hand socket through idle, walk, attack, recovery, and hurt while preserving visible face features. Humanoid enemies stay on the legacy shield path so expanding player content does not silently redraw established enemy sheets.

`engine/effect-renderer.js` owns the transparent 24x24 trail, projectile, impact, and status geometry. `engine/combat-loadouts.js` maps player equipment and enemy attack styles to those modular effects without baking them into character art. The current editor compositor in `app.js` draws the complete character first and then draws every resolved effect with `clear: false`; `previewEffects` defaults to true. That existing order can overwrite foreground shield, equipment, body, or headgear pixels and is the active unresolved integration issue recorded in `HANDOFF.md`. It is not a reason to redraw approved shield source art, and it must not be documented as the final occlusion rule until an effect-enabled all-direction/all-attack-frame review is approved.

### Sheets and thumbnails

`engine/sheets.js` assembles renderer frames into the stable 12-column by 4-row full sheet, selected-animation sheets with four direction rows, selected-direction sheets with all 12 frame columns, and UI thumbnails. Its option-aware player sheet paths accept the selected outline mode; ordinary thumbnails retain the original direct-render path.

### Generators

`engine/generators.js` creates random valid specifications and safe default export names.

### Equipment variant batches

`engine/variant-batches.js` is the pure, deterministic planner for ready-made equipment collections. It preserves one player identity while expanding weapon families, weapon tiers, armor tiers, or shield families and tiers, then deduplicates identical complete specifications. Stable preset ids produce bounded collections of 16 weapon families, up to five current-weapon tiers, 76 weapon-arsenal states, five armor tiers, 41 shield-armory states, or one 120-sheet RPG equipment collection. It imports only catalogs and does not render, package files, access editor state, or touch the DOM.

### RPG class templates

`engine/class-templates.js` owns ten stable definitions: Warrior, Guardian, Ranger, Rogue, Mage, Cleric, Barbarian, Necromancer, Paladin, and Druid. The four expanded roles append after the original six ids. Each definition selects one outfit family, Tier 1 editor defaults, permitted weapon families, and permitted shield families. Its pure planner preserves character identity and custom colors, expands permitted weapons, armor, and shields through all five tiers, deduplicates complete specifications, records series membership, and assigns stable variant ids. The bounded results are 54 Warrior, 54 Guardian, 29 Ranger, 29 Rogue, 24 Mage, 39 Cleric, 24 Barbarian, 34 Necromancer, 39 Paladin, and 34 Druid sheets. It imports only public catalog data and does not render, package files, access editor state, or touch the DOM.

### Complete character kits

`character-kit.js` deterministically expands the player catalogs into one deduplicated component plan: skin-body, head, expression, hair, face-detail, species-back, species-front, outfit-back, outfit, headgear, weapon, and shield passes. It stores 119 hair sheets, six expression sheets, 60 content-unique species passes, and 41 headgear sheets beneath stable component paths. Species paths expand only on the palette axis that changes their pixels: skin for Dwarf and Lizardfolk traits, hair for Beastkin fur, and one fixed path for Undead traits. Short, spiky, bowl, and topknot share one pixel-identical fitted hair path, while outfit-colored headgear expands only the variants whose pixels actually change. Outfit and cape paths include the body-build id because those pixels define the silhouette; all other compatible layers remain shared. The resulting library contains 1020 outfit fronts, 140 cape backs, and 1910 component sheets total. It also expands every enemy family and variation into stable `enemies/<family>/<variation>.png` paths and every combat effect into stable `effects/<category>/<effect>.png` paths for complete native sheets. Up to 24 named players are mapped to lightweight recipes that reference the shared character paths and carry their modular combat-loadout recipes. The standalone kit adds no per-recipe PNGs; the combined Complete Pack adds one assembled native sheet per player for immediate use. The planner owns stable paths, counts, recipe limits, the native export scale, compatibility variants, and the runtime layer order. It imports catalogs only through `sprite-engine.js` and does not access the DOM, canvas, editor state, persistence, or ZIP implementation.

### Archive packaging

`zip.js` builds stored ZIP archives with UTF-8 paths and CRC-32 checksums. It accepts already-rendered files and has no knowledge of editor state, sprite specifications, or rendering internals.

### Editor

`app.js` owns UI state, controls, animation playback and frame inspection, reset and comparison workflows, browser persistence, editable-document history, versioned named presets, character/export naming, reusable palette presets, combat-loadout recipes, equipment-batch, class-pack, and sprite-pack exports, Complete Character Kit rendering, and download behavior. It consumes sprite behavior only through the public engine facade, uses `character-kit.js` for deterministic component, enemy, effect, species, body-build, expression, hairstyle, headgear, and outfit coverage plus recipe mapping, and uses `zip.js` for packaging. History snapshots contain the active mode, active player outline treatment, player/enemy/effect specifications, active combat loadout, optional player palette, and document names, so preset loads, resets, and saved-copy restores undo coherently while preview frame, direction, animation, cycle, speed, export-view, comparison-copy choices remain independent. The optional sanitized comparison snapshot persists locally with editor state but does not enter document history unless it is restored into the editor. Character preset schema v10 adds optional assembled-player outlines and migrates v1 through v9 libraries; schema v9 added expressions, schema v8 added body builds, schema v7 added species, schema v6 added the armor tier, schema v5 added shield tiers, and schema v4 introduced weapon tiers. The independent palette-library schema stores reusable six-tone player palettes. Combat Loadout schema v1 stores automatic or overridden trail, projectile, impact, and status selections and resolves stable overlay paths without flattening them into the base artwork. Equipment Variant Batch schema v1 stores one source identity, one stable batch definition, ready-sheet paths, every complete variant specification, per-variant combat loadouts, referenced effect files, animation timing, scale, and layering instructions. Class Pack schema v1 stores the complete stable class definition, preserved source identity including species, body build, expression, and outline treatment, applied class base, bounded ready-sheet variants, per-variant combat loadouts, referenced effects, scale, animation timing, and layering instructions beneath a class-specific path. Sprite-pack schema v1 stores named player, enemy, and effect specifications independently from editor history and produces full-sheet ZIP archives with a versioned manifest. Complete Character Kit schema v10 exports 1910 content-unique atomic component sheets, all 202 enemy variations, all 24 combat effects, one outlined or unoutlined reference preview, up to 24 artwork-free recipes, and their combat loadouts. Complete Character Pack schema v10 combines the same shared libraries and recipes with one assembled native sheet per saved player while preserving each saved player's outline treatment.

### Windows wrapper

`src-tauri/` owns the native window, application metadata, permissions, content-security policy, native file-dialog/file-write plugins, and packaging. `app.js` routes the shared PNG, JSON, and ZIP export helper through a native Save dialog when the Tauri APIs are present and retains browser downloads otherwise. The dialog-selected path dynamically scopes the narrowly permitted write; the application does not receive unrestricted file-system access. The wrapper does not contain a second renderer or editor implementation.

## Stable invariants

- Logical frame size is 24x24 pixels.
- Directions are ordered down, left, right, up.
- Each row contains idle x2, walk x4, attack x4, hurt x2.
- Full sheets are 288x96 logical pixels before export scaling.
- Export scale 1x preserves those logical pixels exactly; full, animation, and direction exports also support 4x, 8x, and 12x nearest-neighbor scaling.
- Exported sheets have a transparent background and no baked shadow.
- Character-pack archives always contain complete full sheets at the selected scale plus a manifest that records their logical and actual dimensions.
- Class-pack archives preserve one character identity, contain only equipment permitted by their stable class definition, deduplicate complete specifications, and include one resolved modular combat loadout per ready sheet.
- Complete Character Kits always use native 1x sheets and the draw order `weapon-back`, `shield-back`, `species-back`, `outfit-back`, `outfit`, `skin-body`, `head`, `expression`, `species-front`, `face-detail`, `hair`, `headgear`, `shield-front`, `weapon-front`.
- Combat-effect sheets remain modular and unbaked. The current effects-after-character preview/recipe order is a compatibility fact, not a finalized foreground-equipment occlusion invariant.
- Complete Character Kit recipes support at most 24 saved players, reference only shared paths, add no PNGs, and must recompose the complete renderer pixel-for-pixel.
- Combined Complete Character Packs include one assembled native sheet per recipe and reuse the first assembled sheet as the reference preview instead of exporting a duplicate reference PNG.
- `sprite-engine.js` remains the public import path.
- Browser and Windows builds use identical production files.

`npm run check` enforces these invariants against the native export contract, class and equipment planner counts, character-pack ZIP format, Complete Character Kit component matrix, recipe paths, exact pixel recomposition, `asset-pack/manifest.json`, and all 232 committed PNG fixtures. Weapon validation also enforces one connected silhouette in every frame, family and tier distinction, casting-family proportions, global Tier 5 pixel-density and bounds budgets relative to Tier 4, exact left/right mirroring, direction-aware front/back layer routing and recomposition, animation-phase diversity, front-view identity retention, catastrophic-detachment protection, zero discarded pixels across all 3,600 weapon frames, all 7,680 shield cases across four body builds, and 528 equipped-headgear cases, plus pixel/order parity for native full, direction, and animation sheet exports. These structural checks do not replace the unresolved combined effect/shield visual gate.

`tools/weapon-readability-audit.mjs` complements those hard checks with visual evidence. Its standard review matrices are joined by a 3,600-row CSV/JSON audit recording bounds, connected components, edge sides, character distance, expression overlap, discarded-frame count, and discarded-pixel count for every family, tier, direction, animation, and frame. The optional `--all-frames` mode also emits one enlarged and one true-native assembled all-frame sheet per weapon, while `--tier-sheets` emits four labeled all-weapon/all-frame SVG sheets per tier with lightweight PNG inspection grids. Frame-edge contact remains advisory, while any attempted write beyond `x=0..23` or `y=0..23` is a hard frame-contract failure.

`tools/outline-review.mjs` is the outline-specific regression and visual-review gate. It anchors representative None-mode sheets to the safe baseline, exercises 6,000 direct-render parity cases, 2,000 deterministic randomized outline cases, 11,040 exhaustive outlined equipment cases, and 10,656 exhaustive headgear-preservation cases. It proves that contact separators change only authorized body-side or equipment-side pixels, protects every visible headgear pixel and all non-contact equipment pixels, verifies cardinal equipment halos, filtered large cavities, the explicit equipment pilot, and neck-cavity repair, and writes ignored review artifacts beneath `outline-review/`.

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
