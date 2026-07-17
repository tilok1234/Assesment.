# Product and Windows Roadmap

This roadmap records the agreed order for turning the current Sprite Assembler into a maintainable editor and, ultimately, a proper Windows application.

## Guiding decision

Do not spend the next major phase polishing an installer, and do not add a large amount of hard-coded content to the current monolithic engine.

The order is:

1. Preserve and validate the baseline.
2. Make the frontend and content model app-ready.
3. Prove Windows packaging with a minimal Tauri build.
4. Add the highest-value editor features and establish the content workflow.
5. Expand content through that stable workflow.
6. Finish and distribute the Windows application.

The procedural rendering and exported sprite-sheet contract remain stable throughout these phases.

## Phase 1 - Clean development baseline

Goals:

- Place the existing project under Git on the `main` branch.
- Connect it to the `tilok1234/8-bit-sprite-assembler` GitHub repository.
- Document how to run and validate it.
- Provide a one-click Windows development launcher.
- Validate JavaScript, manifest references, engine definitions, and every PNG dimension.
- Publish the first known-good baseline commit.

Exit criteria:

- The live UI renders without browser errors.
- All project checks pass from one command.
- A fresh checkout can be started without installing project dependencies.
- Generated and user-local files are not committed accidentally.

## Phase 2 - App-ready frontend and content foundation

Progress: complete for the current engine contract. The standard frontend, restrictive-CSP-compatible runtime, dependency-free production build, stable public engine facade, focused catalogs, renderer, sheet/export, and generator modules are all in place and parity-verified.

Goals:

- Replace the exported runtime-driven page with a standard bundled frontend entry point.
- Remove runtime code generation so the desktop application can use a restrictive content-security policy.
- Split the engine into clear boundaries:
  - player and enemy definitions
  - palettes and equipment catalogs
  - procedural renderers
  - animation definitions
  - sprite-sheet generation and export
  - editor state and persistence
- Make content definitions easy to extend without editing unrelated rendering code.
- Preserve every existing character option, enemy, animation, and exported sheet layout.

Exit criteria:

- The editor behaves like the current baseline.
- Existing asset and engine validators still pass.
- The new frontend runs through a normal `index.html` development/build flow.
- No `eval` or `new Function` requirement remains in application code.

## Phase 3 - Minimal Windows packaging proof

Progress: the Tauri 2 wrapper is configured and the first optimized Windows executable has been compiled and visually verified under the production content-security policy. The proof executable is intentionally built without an installer while editor development continues.

Goals:

- Add a small Tauri 2 wrapper around the app-ready frontend.
- Produce a development executable on Windows.
- Verify preview animation, local settings, and PNG export inside WebView2.
- Keep native permissions minimal.

This phase is deliberately a proof, not the final installer or release design.

Exit criteria:

- A local Windows executable launches successfully.
- The core editor works without a separate web server.
- Exported PNGs match browser output.
- The app uses a restrictive content-security policy.

## Phase 4 - Core editor features

Progress: complete. Named player and enemy presets use a sanitized, versioned local format shared by the browser and Windows builds; schema v3 carries character names, export names, and optional player palette overrides while migrating existing v1 and v2 libraries. Bounded undo/redo tracks editable sprite documents without rewinding preview-only direction, animation, zoom, cycle, playback, frame, speed, export, or comparison choices. Header controls and `Ctrl+Z`, `Ctrl+Y`, and `Ctrl+Shift+Z` are supported. Every player and enemy option group has an undoable randomize control that always selects a different valid value. Character names appear in the live preview, and exports support persistent Windows-safe filename overrides with an automatic fallback. Players can override base/shadow tones for skin, hair, and outfit, then save those six tones in a separate versioned reusable palette library. PNG export can target the full sheet, one selected animation across all directions, or one selected direction across all animations, with adaptive previews, filenames, and dimensions. Preview playback supports play/pause, 0.5x/1x/2x speeds, wrapping frame steps, direct frame selection, and animation-frame-to-sheet-column metadata. Player and enemy resets are single undoable edits; Duplicate preserves a persistent local copy that can be animated beside the current editor, restored through history, replaced, or removed. These workflows are production-smoke-tested.

Priority order:

1. Save and load named character presets. Complete.
2. Undo and redo. Complete.
3. Randomize individual categories as well as the whole character. Complete.
4. Custom character and export names. Complete.
5. Palette editing and reusable palette presets. Complete.
6. Export a selected animation or direction in addition to the full sheet. Complete.
7. Improved playback controls and frame inspection. Complete.
8. Reset, duplicate, and compare workflows. Complete.

Exit criteria:

- The editor supports a complete create, revise, save, reopen, and export workflow.
- Preset data has a versioned format.
- Browser and Windows builds share the same editor logic.

## Phase 5 - Content expansion

Progress: underway. The first validated content slice adds eight facial-detail choices—none, beard, mustache, scar, eyepatch, glasses, blush, and war paint—without changing the 24x24 frame or sheet contract. Old state and presets migrate to `none`; facial hair follows the selected hair tones, war paint follows the outfit palette, rear views remain unmarked, and full helmets suppress face details. The controls participate in thumbnails, whole-character and per-category randomization, presets, reset, undo/redo, comparison, persistence, naming, and every export scope.

The second content slice extracts humanoid weapons into a focused renderer with shared direction and pose anchors, while retaining byte-for-byte output for all existing enemy-used weapons. The player catalog grows from eight to sixteen choices with greatsword, scimitar, rapier, mace, warhammer, crossbow, wand, and spellbook additions. Each new weapon is verified across four directions and every animation, follows the animated player hand through idle, walk, attack, and lunge poses, has a distinct side strike, and observes the player face-clearance rule. Player blades also use readable style-specific hilts: compact dagger grips, sword crossguards, broad greatsword guards, scimitar knuckle guards, and rapier baskets.

The third content slice adds an independent two-level weapon progression system without duplicating the weapon-type catalog. Every equipped weapon has a named Tier 2 form with a stronger silhouette and material treatment, including double axe heads, spiked mace and club profiles, reinforced ranged limbs, expanded arcane focuses, and gilded spellbooks. `None` normalizes to Tier 1, old state and preset schemas migrate safely, Tier 2 participates in thumbnails, per-category and whole-character randomization, undo/redo, comparison, persistence, naming, and every export scope, and all 15 upgrades remain distinct in every direction, animation, and frame while following the hand rig and clearing side faces.

The fourth content slice extends that same progression field with legendary Tier 3 forms such as Starforged Blade, Worldsplitter, Stormcleaver, Dragonfire Ballista, Astral Scepter, and Codex Eternal. Tier 3 builds on the Tier 2 geometry with astral metals, larger structural ornaments, celestial edges, elemental flares, and expanded magic orbits. All 15 legendary forms are distinct from Tier 2 in every rendered frame, remain mutually distinct as complete sheets, inherit the full animation rig, preserve side-face clearance, and work through the existing schema-v4 preset, randomization, history, comparison, persistence, and export paths.

The fifth content slice adds oversized mythic Tier 4 forms such as Dawnreaver, Colossus Edge, Tempest Executioner, World Serpent Pike, Seraphim Greatbow, Wyrmfire Repeater, Staff of the Firmament, and Omniscient Codex. Tier 4 cumulatively preserves the earlier materials and ornaments while deliberately extending blade reach, pole and haft length, bow limbs, stocks, barrels, and magical projections toward the safe 24x24 frame limits. Every Tier 4 weapon expands beyond its Tier 3 idle silhouette in all four directions, remains readable in every animation frame, follows the hand rig without clipping, and clears the protected side-face area.

The sixth content slice completes the progression with final artifact Tier 5 forms such as Eternity's End, The Last Horizon, Heavenrend, Supernova, Axis of Creation, Wings of Genesis, Apocalypse Engine, Pillar of Eternity, and The Final Testament. After visual review, Tier 5 was rebuilt as an independent artifact silhouette over the Tier 3 foundation rather than a dense overlay on Tier 4. Each weapon now has its own material palette and keeps its blade, head, handle, shaft, limbs, mechanism, focus, or book cover readable, with restrained crowns, runes, star points, wing tips, multi-bolts, orbiting shards, page lights, and magic accents supporting the physical form. All 15 artifacts establish a distinct silhouette in every idle direction, differ from Tier 4 in every animation frame, follow the animated hand without edge-sticking, preserve both front eyes and the side face, and use the existing preset, randomization, history, persistence, and export paths without a schema migration.

The seventh content slice establishes the shield foundation. Humanoid shield drawing now lives in a focused renderer with a player-only off-hand rig and a legacy-compatible enemy path. Round, kite, and buckler have been rebuilt, while heater, tower, oval, bone, and arcane bring the equipped catalog to eight distinct shield families. Front, back, and profile views use direction-aware layering; shields follow the opposite walk swing, brace through attack and recovery poses, inherit lunges, mirror cleanly, and stay outside the protected face area. An exhaustive validator covers all 384 equipped-shield direction, animation, and frame combinations, providing a stable base for shield progression without first having to repair animation or layering.

The eighth content slice adds independent Tier 2 progression for all eight equipped shield families. Ironbound Roundshield, Knight's Bulwark, Duelist's Guard, Lionheart Heater, Bastion Wall, Legionnaire Scutum, Ossuary Aegis, and Runebound Ward each expand beyond the Tier 1 silhouette with family-specific bracing, flares, battlements, bands, bone crowns, or floating runes. The schema-v5 `shieldTier` field participates in the editor, named selections, whole-character and per-category randomization, reset, undo/redo, comparison, persistence, presets, and exports; old v1 through v4 presets migrate to Tier 1, and `None` always normalizes to Tier 1. Automated checks prove Tier 2 differs from Tier 1 in every direction, animation, and frame, grows every idle silhouette, remains mutually distinct, follows the off-hand rig, and preserves face clearance.

Candidate additions:

- Body types and silhouettes
- Facial details and expressions (first facial-detail set complete; expressions remain a future option)
- More hairstyles and headgear
- Armor layers, outfits, robes, capes, and accessories
- More melee, ranged, and magical weapons (first eight-weapon expansion and complete Tier 2/Tier 3/Tier 4/Tier 5 progression finished)
- Shield Tier 3 through Tier 5 progression, followed by additional off-hand items (eight-family Tier 2 progression complete)
- Species-specific features such as ears, horns, wings, and tails
- Additional enemy families and variants
- Optional new animations after the existing sheet contract has a versioning plan

Content is added through the stable definition and validation workflow established in Phases 2 and 4.

## Phase 6 - Windows release

Goals:

- Native save and open dialogs where they improve the workflow.
- Final application icon, product metadata, and window behavior.
- NSIS setup executable and/or MSI packaging.
- Versioned release builds through GitHub.
- Code signing and automatic updates when distribution warrants them.
- Release notes, migration checks, and packaged smoke tests.

Exit criteria:

- A signed, versioned Windows installer can be distributed confidently.
- Installation, launch, export, update, and uninstall are verified.
- A release can be reproduced from the repository.
