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

The ninth content slice extends all eight shield families with cumulative legendary Tier 3 forms: Sunforged Aegis, Dragoncrest Bulwark, Starsteel Counterguard, Crowned Lion Aegis, Citadel of Kings, Imperial Scutum, Graveking Carapace, and Astral Ward. Each adds family-specific crown, crest, point, heraldry, antler, or astral geometry to both the full shield and its edge-on profile while retaining the Tier 2 reinforcement beneath it. The existing schema-v5 field carries Tier 3 through editor selection, naming, randomization, history, comparison, persistence, presets, and exports without a migration. Automated checks prove every Tier 3 frame differs from Tier 2, each directional idle silhouette grows, all eight families remain distinct, the legendary layer follows walk and attack motion, and all additions preserve face clearance.

The tenth content slice adds oversized mythic Tier 4 forms for every shield family: Aegis of the Solar Titan, Worldwyrm Bulwark, Empyrean Starshield, Lion Throne Bastion, Fortress of Eternity, Imperator's Warwall, Ossuary of the Colossus, and Barrier of the Firmament. Tier 4 cumulatively preserves the Tier 2 reinforcement and Tier 3 identity while adding bright mythic cores, wider solar rays and dragon wings, larger star points, taller crowns, fortress rails, imperial bands, colossal bone spines, and expanded arcane projections. Both full and edge-on silhouettes grow while following the existing off-hand rig. Exhaustive validation proves every Tier 4 frame differs from Tier 3, every directional idle silhouette expands, all eight families remain distinct, walk and attack poses move the mythic geometry correctly, and the protected face area stays clear. Live A/B and contact-sheet review also confirm that the larger forms remain recognizable at exact 24x24 scale.

The eleventh content slice completes shield progression with eight artifact Tier 5 forms: Worldsun Disc, Voidwyrm Aegis, Paradox Star, Throneheart Aegis, The Unbroken Gate, Imperial Eternity, Deathking's Reliquary, and Event Horizon. Like the rebuilt Tier 5 weapons, these shields branch from the cleaner Tier 3 foundation instead of stacking more decoration onto Tier 4. Each family gains its own apex silhouette and material language—solar corona, void dragon, paradox star, royal heart, fortress gate, victory laurel, soul reliquary, or arcane singularity—in both full and edge-on views. Exhaustive validation covers every direction, animation, and frame; proves all eight artifact families remain distinct; confirms their walk and attack motion; preserves the protected face area; and expands the Complete Character Kit to 769 unique component sheets after visually identical Tier 5 color passes are collapsed.

The twelfth content slice makes the Complete Character Kit a broader game-asset package by adding all 41 enemy families and 138 variations as ready-to-use native `288x96` sheets. Enemy files live at stable `enemies/<family>/<variation>.png` paths, remain independent from the regular 1x/2x/3x/4x manual export selector, and appear in both standalone Complete Character Kits and combined Complete Packs. Schema v2 publishes the enemy library and its counts in `manifest.json`; a full 24-player Complete Pack contained 931 PNGs at this milestone.

The thirteenth content slice expands biome coverage with a swamp-and-shoreline roster: frogs, crocodiles, turtles, and jellyfish. Each new family has four palette-and-marking variants plus a dedicated silhouette and animation language—hopping and tongue lashes, low armored crawls and bites, shell-first trudges and head extensions, or floating bell pulses and tentacle whips. This raises the roster to 45 families and 154 variants, the standalone Complete Character Kit to 924 PNGs, and a full 24-player Complete Pack to 947 PNGs.

The fourteenth content slice adds four further silhouette families in one batch: centipedes, carnivorous plants, anglerfish, and griffins. Sixteen variants introduce segmented many-leg scuttles and venom strikes, rooted bloom snaps and vine lashes, swimming lure pulses and oversized bites, plus winged quadruped flaps and claw dives. The roster reaches 49 families and 170 variants, the standalone Complete Character Kit reaches 940 PNGs, and a full 24-player Complete Pack reaches 963 PNGs.

The fifteenth content slice is the Strange Wilds expansion: mantises, moths, octopuses, and moles add sixteen variants with scissor-blade rushes, four-pose wing flutter and dust bursts, tentacle crawls and ink lashes, plus grounded burrow-and-erupt attacks. The roster reaches 53 families and 186 variants, the standalone Complete Character Kit reaches 956 PNGs, and a full 24-player Complete Pack reaches 979 PNGs.

The sixteenth content slice is the Cursed Frontier expansion: scarecrows, snails, porcupines, and haunted puppets add sixteen variants with spinning straw arms, shell retreats and rolling charges, expanding quill bursts, and unnatural jointed marionette attacks. The roster reaches 57 families and 202 variants, the standalone Complete Character Kit reaches 972 PNGs, and a full 24-player Complete Pack reaches 995 PNGs.

The seventeenth content slice adds a modular Combat Effects library: five direction-aware weapon trails, seven projectiles, six impacts, and six persistent status overlays. Every effect uses the full transparent `288x96` sheet contract, reads the same attack column and direction row as its wielder, and can be layered after either a player or enemy without rebaking character art. Non-status effects stay transparent outside attack frames, while status overlays animate throughout idle, walk, attack, and hurt. Complete Kit and Complete Pack schema v3 add stable `effects/<category>/<effect>.png` paths; the standalone kit reaches 996 PNGs, the 24-player Complete Pack reaches 1019 PNGs, and the bundled asset pack reaches 232 exported sheets.

The eighteenth content slice turns those modular effects into game-ready Combat Loadouts. Player weapons and enemy attack styles now resolve automatic trail, projectile, and impact defaults, while every slot—including an optional status overlay—can be overridden or disabled. The editor previews the synchronized result without baking effects into the base sprite, saves up to 100 named recipes locally, and exports a standalone schema-v1 JSON contract with base specification, selections, resolved stable paths, zero-based attack columns, timing, and draw order. Regular packs retain each entry's recipe, while Complete Kit and Complete Pack schema v4 attach combat loadouts to their matching character recipes and keep all artwork deduplicated.

The nineteenth content slice adds the Equipment Variant Batch Builder for games that prefer ready-made sheets over runtime component composition. One player identity can expand into 16 weapon families at the current tier, up to five tiers of the current weapon, the complete 76-state weapon arsenal, five armor tiers, the 41-state shield armory, or a deduplicated 120-sheet RPG equipment collection. Schema v1 records the source identity, stable batch definition, complete specifications, animation contract, selected scale, and a resolved combat loadout for every variant. Only referenced combat effects are included once, explicit loadout overrides are preserved, and character PNGs remain effect-free. The production proof archive contains 120 unique native character sheets plus 16 native effects, with 136 unique `288x96` PNGs, no missing references, and no duplicate file content.

The twentieth content slice adds focused RPG Class Packs for Warrior, Guardian, Ranger, Rogue, Mage, and Cleric roles. A class definition chooses its outfit family, Tier 1 starting loadout, allowed weapons, and allowed shields while preserving the source character's identity, colors, and custom palette. Applying a class is undoable; exporting expands every allowed weapon, the class armor, and every allowed shield through all five tiers, then deduplicates complete specifications into bounded collections of 54, 54, 29, 29, 24, and 39 ready sheets respectively. Class Pack schema v1 records the complete class definition, source character, class base, animation and scale contract, every complete variant specification, and a resolved modular combat loadout for every sheet while including referenced effects only once beneath stable game-facing paths. The native Mage production proof contains 24 ready character sheets plus six referenced effects, including all three magic projectile families and a preserved Frozen override; all 30 PNGs are unique `288x96` files with no missing, duplicate, or unreferenced content.

The twenty-first content slice adds six stable player species: Human, Elf, Orc, Goblin, Tiefling, and Celestial. Human is the exact legacy-compatible default; the other species add direction-aware ears, tusks, horns, animated tails, wings, and halos while reusing the proven humanoid body, equipment, and animation rig. Front traits hide beneath full helmets, back traits retain correct occlusion, presets migrate to schema v7, and class and equipment planners preserve species as part of character identity. Complete Kit and Complete Pack schema v5 add 27 deduplicated species sheets in separate back/front passes, raising the component library to 796 PNGs, the standalone kit to 1023 PNGs, and a 24-player Complete Pack to 1046 PNGs. Exhaustive validation proves Human parity, all six complete animation signatures, visible directional traits, full-helmet behavior, and pixel-exact recipe recomposition.

The twenty-second content slice adds four stable player body builds: Classic, Lean, Sturdy, and Heroic. Classic is pixel-identical to every legacy or missing-build specification; Lean narrows the torso, Sturdy broadens it, and Heroic creates a readable shoulder-to-waist taper while preserving the established hand, weapon, shield, species, and animation anchors. Presets migrate to schema v8, randomization and naming understand builds, and class and equipment planners preserve them as part of character identity. Complete Kit and Complete Pack schema v6 expand only the build-dependent outfit and cape passes to 460 fronts and 140 backs, raising the shared component library to 1246 PNGs, the standalone kit to 1473 PNGs, and a 24-player Complete Pack to 1496 PNGs. Exhaustive validation proves Classic parity, distinct silhouettes in every direction, animation, and frame, build-specific outfit and cape content across all five armor tiers, and pixel-exact recipe recomposition.

The twenty-third content slice adds six stable player expressions: Neutral, Happy, Angry, Sad, Surprised, and Determined. Neutral is pixel-identical to every legacy or missing-expression specification, while the five new moods remain distinct across every visible direction, animation, and frame. Expressions render as their own component between the head and front species traits, remain visible through redesigned open-lens glasses, and hide completely beneath full helmets; established humanoid enemy faces remain unchanged. Presets migrate to schema v9, randomization and filenames understand expressions, and class and equipment planners preserve them as part of character identity. Complete Kit and Complete Pack schema v7 add six expression sheets, raising the shared component library to 1252 PNGs, the standalone kit to 1479 PNGs, and a 24-player Complete Pack to 1502 PNGs. Exhaustive validation proves Neutral parity, six distinct animation signatures, directional visibility and helmet occlusion, stable recipe paths, and pixel-exact recomposition.

The twenty-fourth content slice expands player customization with four direction-aware hairstyles—Braids, Afro, Topknot, and Messy—and four headgear choices—Bandana, Circlet, Plumed Helm, and Skull Mask—without changing the stable ids of the original seven hairstyles or eight headgear entries. All 11 hairstyles animate through front, side, and rear views. Braids, Afro, and Messy retain readable lower details under fitted gear, while Topknot intentionally shares the compact short/spiky/bowl fit; Bandana and Plumed Helm use outfit colors, Circlet and Skull Mask remain fixed-color components, and expression visibility follows each silhouette, including complete Skull Mask coverage. Complete Kit and Complete Pack schema v8 add 119 deduplicated hair sheets and 41 headgear sheets, raising the shared component library to 1317 PNGs, the standalone kit to 1544 PNGs, and a 24-player Complete Pack to 1567 PNGs. Exhaustive validation proves catalog stability, distinct animation signatures, fitted-hair behavior, expression visibility and coverage, outfit-color behavior, and pixel-exact recipe recomposition.

Candidate additions:

- More body types beyond the completed four-build silhouette foundation
- More facial details and expressions beyond the completed eight-detail and six-expression foundations
- More hairstyles and headgear beyond the completed 11-style and 12-choice foundation
- Armor layers, outfits, robes, capes, and accessories
- More melee, ranged, and magical weapons (first eight-weapon expansion and complete Tier 2/Tier 3/Tier 4/Tier 5 progression finished)
- Additional off-hand items such as spell foci, lanterns, and quivers (eight-family shield progression through Tier 5 complete)
- More species-specific features beyond the completed six-species ears, tusks, horns, wings, halo, and tail foundation
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
