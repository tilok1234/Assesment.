# 8-bit Sprite Assembler

A browser-based procedural sprite creator for building 24x24 player characters, enemies, and synchronized combat effects, previewing four-direction animations, and exporting game-ready PNG sprite sheets.

## Current capabilities

- Player assembly across Human, Elf, Orc, Goblin, Tiefling, Celestial, Dwarf, Undead, Lizardfolk, and Beastkin species; Classic, Lean, Sturdy, and Heroic body builds; plus skin, 11 hairstyles, six expressions, eight facial details, 12 headgear choices, nine outfits across five armor tiers, weapon type and tier, shield, the Lantern utility off-hand, and palette choices
- 57 enemy families with 202 predefined variants
- 24 transparent combat-effect overlays across weapon trails, projectiles, impacts, and status effects
- A Combat Loadout Builder that previews those overlays on players and enemies, supplies automatic weapon-aware defaults, supports per-slot overrides, saves named recipes, and exports game-ready JSON
- An Equipment Variant Batch Builder that turns one character identity into bounded weapon, armor, shield, utility-off-hand, or 121-sheet RPG equipment collections with per-variant loadouts and only the combat effects they actually reference
- A Class Pack Builder with ten focused templates—Warrior, Guardian, Ranger, Rogue, Mage, Cleric, Barbarian, Necromancer, Paladin, and Druid—that preserves one character identity while exporting only the outfit, weapon, shield, utility-off-hand, armor-tier, and equipment-tier combinations appropriate to that RPG role
- Four directions: down, left, right, and up
- Idle, walk, attack, cast, hurt, and death animations
- Transparent PNG sprite-sheet export at native 1x, 4x, 8x, or 12x scale
- Persistent named sprite packs that collect player, enemy, and combat-effect designs and download as a ZIP with full PNG sheets and `manifest.json`
- One-click Complete Character Packs combining up to 24 assembled native sheets, matching recipes, 1912 content-unique atomic component sheets, all 202 enemy variations, and all 24 combat effects at native 1x
- A validated asset pack containing 232 exported sheets
- Local browser persistence for the current configuration
- Versioned, named player and enemy presets stored on the current device
- Sprite-only undo and redo through the header controls or `Ctrl+Z` / `Ctrl+Y`
- Explicit Production Roll and Wildcard Roll whole-character actions, thirteen
  Production-compatible Player category actions, and unrestricted
  per-category Wildcard rerolls with undo support
- Persistent character names, live preview labels, and Windows-safe custom PNG filenames
- Editable skin, hair, and outfit tone pairs with a reusable local palette library
- Full-sheet, selected-animation, and selected-direction PNG export scopes
- Play/pause, 0.5x/1x/2x playback speeds, frame stepping, and direct frame inspection with sheet-column metadata
- Optional assembled-sprite outlines with None, Complete B, and Selective C
  modes for players and all 57 enemy families; effects, source art, floor
  shadows, and atomic component sheets remain untreated
- Optional assembled-sprite shading with None and the approved material-aware
  Form mode for players and all 57 enemy families; the selector participates in
  undo/redo, comparisons, presets, packs, recipes, previews, and assembled
  exports while effects and atomic component sheets remain untreated
- Undoable player/enemy reset plus a persistent saved copy for animated side-by-side A/B comparison
- Facial detail choices for none, beard, mustache, scar, eyepatch, glasses, blush, and war paint; details follow character colors, respect rear views, and hide beneath full helmets
- Six modular expressions—Neutral, Happy, Angry, Sad, Surprised, and Determined—that animate in every visible direction, remain readable beneath glasses, and hide beneath full helmets
- Eleven animated hairstyles, including Braids, Afro, Topknot, and Messy, with fitted or deliberately visible under-headgear variants
- Twelve direction-aware headgear choices, including Bandana, Circlet, Plumed Helm, and Skull Mask, with intentional expression visibility and face coverage
- Nine direction-aware outfit families, including Barbarian Furs, Ranger Coat, Cleric Vestments, and Necromancer Robes, with distinct front, profile, and rear silhouettes across all four body builds
- Five named armor tiers for every outfit: reinforced Tier 2, crested Tier 3, mythic Tier 4 pauldrons, and luminous Tier 5 apex forms that follow all body animations
- Fifteen equipped weapon choices spanning blades, blunt weapons, polearms, ranged weapons, and magic focuses, each with standard Tier 1, named RPG-style Tier 2, legendary Tier 3, oversized mythic Tier 4, and final artifact Tier 5 forms; all 75 variants use hand-anchored motion and preserve front- and side-face clearance
- Eight equipped shield choices—round, kite, buckler, heater, tower, oval, bone, and arcane—with five named tiers culminating in Worldsun Disc, Voidwyrm Aegis, Paradox Star, Throneheart Aegis, The Unbroken Gate, Imperial Eternity, Deathking's Reliquary, and Event Horizon; every facing reuses the unchanged broad shield face, the equipment grip owns the animated shield-hand socket instead of leaving ordinary hand pixels visible, and near/far body occlusion is split around the reusable body layer
- One approved non-shield off-hand item, Lantern, with its own public field, direction-aware back/front passes, mutual exclusion with shields, and animated hand attachment across every body build and frame

## Current integration status

The complete enemy-outline rollout is visually approved at local checkpoint
`ac860aa` on `codex/enemy-outlines`. All 57 families / 202 variants pass the
9,696-frame source audit and the 29,088-case None-B-C lane with zero source-edge
frames and zero out-of-bounds writes. This branch has not been pushed.

The optional shared assembled-sprite shade pass in
[SHADE_RENDERING_PLAN.md](SHADE_RENDERING_PLAN.md) has an explicitly approved
Form algorithm and approved live-editor integration. Shared pixel
buffers, immutable shade modes, normalization, and one assembled-output
coordinator apply the deterministic material-aware treatment to complete
players and enemies. Protected dark features, exact white, tiny accents, floor
shadows, effects, approved outlines, contact separators, generic thumbnails,
and atomic component sheets remain untreated. Form is the default for new and
reset Player/Enemy editor documents; None remains the engine compatibility mode
and the fallback for versioned legacy artwork.

The Player/Enemy selector now participates in history, comparisons, presets,
ordinary packs, previews, assembled sheets, and export recipes; it is hidden in
Effects mode. Missing or invalid shade fields migrate to None. The earlier enemy
outline preset/ordinary-pack persistence gap remains repaired. The integrated
editor surface was visually approved on 2026-07-26. The safe shade checkpoint
does not accept new fixtures or baselines and does not rebuild executables.
Combat Loadout overlays are now disabled by default and return to Off whenever
the editor starts. They remain available as an explicit preview toggle, but the
optional legacy preview still draws effects after the complete character and
can look cluttered or overwrite foreground details. Its final occlusion rule is
on ice as a separate deferred integration problem and is explicitly excluded
from approved shade work. See [HANDOFF.md](HANDOFF.md) for the exact
continuation state.

The first fresh Phase 5 content slice adds the visually approved Lantern as a
separate non-shield `offhand` option. Selecting it clears the shield slot;
selecting a shield clears it; malformed specifications preserve the shield.
The field participates in randomization, history, comparisons, presets,
ordinary packs, equipment batches, compatible class packs, assembled exports,
and Complete Kit recipes. Presets are now v12, ordinary packs v3, Equipment
Variant Batch and Class Pack v3, Master Character Kit/Roster Kit v2, and
Complete Character Kit/Pack v12. Legacy specifications safely default to no
utility off-hand. Effects remain Off, only shields resolve shield-block
behavior, and no fixture, baseline, or release artifact changed.

Production Roll v1 is approved and integrated beside the renamed Wildcard
Roll. Production uses a portable seed stream, selects one of the ten existing
class archetypes, keeps one coherent equipment tier and fixed catalog palette
family, normalizes hidden identity choices, and enforces a bounded silhouette
budget. The result is still an ordinary editable player specification:
presets, packs, batches, class packs, kits, and exports store the resolved
character without its seed or audit trail. Production applies Form shading and
Effects Off in one undoable action while preserving the current outline;
Wildcard retains the former unrestricted `randomPlayer()` behavior.

After a Production Roll, supported Player categories expose a secondary `C`
button that selects only Production-compatible alternatives under the known
class, power-tier, and palette-family context. The existing arrow remains an
unrestricted Wildcard reroll. Armor's compatible action changes equipped
armor, weapon, and shield tiers as one coherent power-tier choice; unsupported
or coupled categories do not receive misleading controls. Context is
history-only and never enters presets, packs, recipes, exports, or schemas. If
no compatible alternative exists, the editor reports that result without
changing the player.

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

Node.js 18 or newer is required for development. Run `npm install` once before using the native Tauri workflow.

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

The validator checks JavaScript syntax, the engine-to-manifest contract, every referenced asset, unexpected PNG files, exact native export dimensions, character-pack ZIP structure, Master Character Kit coverage and layer order, the dimensions of all committed sheets, zero out-of-canvas writes across all 3,600 weapon animation cases, 7,680 shield cases across all four body builds, 192 Lantern utility-off-hand cases, and 528 equipped-headgear cases. The shade gate adds 288 broad player None-parity cases, all 9,696 enemy None-parity frames, 1,616 sampled enemy None/outline parity cases, 1,728 deterministic Form pilot cases, an exhaustive 9,696-frame enemy Form audit, 1,616 enemy Form/outline integration cases, and assembled full/direction/animation export forwarding checks. These cases verify source ownership, protected pixels, unchanged outline/contact geometry, finite colors, floor-shadow parity, visible changes, and 21,086 material-aware differences from a silhouette-only control without accepting a visual baseline.

The same command also audits 1,000 deterministic Production v1 seeds,
catalog/class freeze drift, invalid seeds, bounded retries and fallbacks,
ordinary-player copy safety, Wildcard compatibility, all ten classes, every
power tier and palette family, 48 deterministic assembled export frames, and
resolved-player compatibility with existing class, batch, Complete Kit,
preset, pack, and schema boundaries.

Run `npm run review:shades` to regenerate the ignored interactive Form pilot
beneath `shade-review/`. It compares untreated output, a silhouette-only
control, Form without outlines, Form with Complete B, and Form with Selective C
for 12 diverse specimens across all directions, animations, and frames on
dark and parchment review backgrounds, with parchment selected by default.
Effects stay Off. The algorithm is approved, but the generated review remains
evidence rather than a committed baseline.

Run `npm run review:offhands` to regenerate the ignored Lantern integration
review beneath `offhand-review/`. It covers three representative bearers,
every direction, animation, and frame, None/Complete B/Selective C outlines,
approved Form shading, exact back/body/front recomposition, shield precedence,
and absent-field parity. The Lantern art was visually approved on 2026-07-26;
the review remains evidence rather than a committed baseline.

Run `npm run review:production-rolls` to regenerate the ignored balanced
Production-versus-Wildcard review beneath `production-roll-review/`. It
contains 120 fixed Production results and 120 Wildcard controls, with 12
Production seeds per class, all 11,520 source frames, 34,560 Form/outline
cases, deterministic replay, attachment checks, and the approved corpus digest
`af9b620e5ce87f6febf5983487fc163e8b5a4495fb37ced3653e8b5bbbc4ba3f`.
The corpus and Form/Effects Off presentation were approved on 2026-07-26; the
generated page remains review evidence rather than a committed baseline.

Run `npm run review:weapons -- --all-frames` to regenerate the 37 weapon review sheets and the exhaustive 3,600-row CSV/JSON audit. Add `--tier-sheets` to emit four labeled all-weapon/all-frame SVG review sheets per tier plus lightweight PNG inspection grids. The audit records ordinary edge contact separately from discarded pixels, so touching `x=0` or `x=23` remains advisory while attempting to draw outside the 24x24 canvas is a hard failure.

Run `npm run review:outlines` for the outline-specific regression gate. It verifies anchored safe-baseline hashes, 6,000 pixel-exact None-mode parity cases, 2,000 deterministic randomized integrity cases, 11,040 exhaustive outlined equipment cases, and 10,656 exhaustive headgear-preservation cases. The gate covers restrained cardinal equipment halos, silhouette-defining cavities of at least five logical pixels, the explicit equipment pilot, depth-aware equipment/body separators, feature-preserving equipment-side fallbacks, equipment-side front-equipment/headgear separators, foreground headgear and non-contact equipment pixel protection, non-contact body protection, ownership isolation, neck-cavity completion, and review examples. See [OUTLINE_RENDERING_PLAN.md](OUTLINE_RENDERING_PLAN.md) for the supported modes and scope boundary.

Run `npm run review:enemy-outlines` for the complete 57-family source
assessment, and `npm run review:enemy-outline-pilots` for the full approved
outline lane. The final lane verifies 9,696 None-mode parity cases, 29,088
None-B-C cases, mode distinction in every frame, zero source-edge frames, and
zero out-of-bounds writes. See [ENEMY_OUTLINE_PLAN.md](ENEMY_OUTLINE_PLAN.md)
for the chronological repair and approval record.

Contact separators remain one pixel thick: pixels converted into separators are prevented from casting a redundant exterior halo, while legitimate interior equipment openings remain outlined. When a foreground weapon or shield directly touches headgear, only the touching equipment pixel becomes the separator; the hat artwork is preserved exactly. If a normal body-side separator would visually lengthen an adjacent dark eye, mouth, or other body feature, that character pixel is preserved and the separator moves onto the touching equipment pixel.

## Build the Windows application

Windows development requires Node.js, Rust, Microsoft C++ Build Tools, and WebView2. After installing those prerequisites, run:

```powershell
npm install
npm run tauri:dev
```

Create an optimized current-user NSIS installer with:

```powershell
npm run tauri:build
```

The setup executable is written beneath `src-tauri/target/release/bundle/nsis/`. Installed builds use native Save dialogs for PNG, JSON, and ZIP exports while browser builds keep normal browser downloads. Use `npm run tauri:build:exe` for the faster standalone proof executable, and see [WINDOWS_RELEASE.md](WINDOWS_RELEASE.md) for release validation, packaged smoke tests, GitHub draft releases, and signing status.

## Sprite-sheet contract

- Logical frame: 24x24 pixels
- Grid: 20 columns by 4 rows
- Rows: down, left, right, up
- Columns: idle x2, walk x4, attack x4, cast x4, hurt x2, death x4
- Animation export: selected animation frames across four direction rows
- Direction export: all 20 animation frames across one selected direction row
- Native 1x export sizes: full sheet 480x96, direction sheet 480x24, and animation sheet 48x96 or 96x96 pixels
- Committed fixture pack scale: 4x
- Committed legacy fixture sheet size: 1152x384 pixels (the preserved pre-Cast 12-column contract)
- Transparent background with no baked shadow

## Equipment variant batches

Use **Equipment variant batch** in Player mode when the game needs ready-made full sheets instead of runtime paperdoll composition. The current skin, hair, face, headgear, outfit family, colors, custom palette, and combat overrides stay fixed while the selected equipment axis expands:

- **Weapon families**: unarmed plus all 15 weapons at the current weapon tier (16 sheets)
- **Current weapon tiers**: Tier 1 through Tier 5 for the equipped weapon (up to 5 sheets)
- **Complete weapon arsenal**: unarmed plus all 15 weapons at every tier (76 sheets)
- **Armor progression**: the current outfit at all five armor tiers (5 sheets)
- **Complete shield armory**: no shield plus all eight shields at every tier (41 sheets)
- **Utility off-hand items**: no utility item plus the Lantern (2 sheets)
- **RPG equipment collection**: the weapon arsenal, armor progression, shield armory, and utility off-hands merged into 121 unique sheets

The ZIP uses the selected Export PNG scale and contains `manifest.json`, `README.txt`, one ready character sheet per unique specification, and one copy of every combat-effect sheet referenced by those variants. Automatic loadouts are resolved separately per weapon, explicit overrides are preserved, and effects remain modular instead of being baked into the character PNGs. Choose **1x Native** for exact `480x96` sheets.

## RPG class packs

Use **Class pack builder** in Player mode when one character should be ready to play as a focused RPG class instead of receiving the entire 121-sheet equipment collection. Pick a template, then either apply its Tier 1 defaults to the editor or download the full class ZIP immediately:

- **Warrior**: plate armor, six melee weapon families, and four martial shield families (54 unique sheets)
- **Guardian**: plate armor, four defensive weapon families, and six shield families (54 unique sheets)
- **Ranger**: Ranger Coat, dagger, spear, bow, crossbow, buckler, and Lantern options (30 unique sheets)
- **Rogue**: leather armor, scimitar, rapier, dagger, crossbow, and buckler options (29 unique sheets)
- **Mage**: robes, staff, wand, spellbook, arcane shield, and Lantern options (25 unique sheets)
- **Cleric**: Cleric Vestments, mace, warhammer, staff, wand, three holy or defensive shield families, and the Lantern (40 unique sheets)
- **Barbarian**: Barbarian Furs with greatsword, axe, spear, and club progression but no shields (24 unique sheets)
- **Necromancer**: Necromancer Robes with dagger, staff, wand, spellbook, bone shield, arcane shield, and Lantern progression (35 unique sheets)
- **Paladin**: plate armor with sword, greatsword, mace, warhammer, and three heavy shield families (39 unique sheets)
- **Druid**: Ranger Coat with dagger, spear, staff, wand, round shield, bone shield, and Lantern progression (35 unique sheets)

Applying a template changes only the class outfit and Tier 1 starting equipment; skin, hair, facial detail, headgear, colors, and custom palette stay intact, and the change can be undone. Export expands every permitted weapon through Tiers 1-5, the class outfit through all five armor tiers, no shield plus every permitted shield through Tiers 1-5, and each permitted non-shield off-hand. Identical complete specifications are deduplicated.

Each schema-v3 ZIP contains complete character sheets at the selected PNG scale, a resolved combat-loadout recipe for every variant, only the modular effect sheets those loadouts reference, `manifest.json`, and `README.txt`. Files live beneath `classes/<class-id>/characters/<character>/`, so several class archives can be added to a game without path collisions. Choose **1x Native** for exact `480x96` game sheets.

## Character packs

1. Give the pack a name, create a player or enemy, and give the character a name.
2. Select **Add current**, then repeat for as many characters as needed.
3. Use **Load** to keep editing an entry or **Remove** to take it out of the pack.
4. Choose an export scale, including **1x Native**, then select **Download pack ZIP**.

The working pack stays on the current device. Each downloaded ZIP contains one complete full sheet per sprite plus a versioned `manifest.json` with the exact specifications, animation contract, dimensions, file paths, and the saved combat-loadout recipe for every player or enemy.

For a reusable game asset pack, add up to 24 player characters and select **Download Complete Pack**. That single ZIP combines every assembled native character sheet, the matching lightweight recipes and combat loadouts, the full deduplicated component library, all 57 enemy families with all 202 variations in `enemies/<family>/<variation>.png`, and all 24 synchronized overlays in `effects/<category>/<effect>.png`. Enemy and effect sheets in the Complete Pack are always native 1x, independently of the regular pack export-scale selector.

A 24-player Complete Pack contains 1912 shared component sheets, 202 ready enemy sheets, 24 combat-effect sheets, and 24 ready character sheets: 2162 native `480x96` PNGs. The first ready character also serves as the manifest reference preview, so no extra duplicate reference PNG is added.

### Wildshot game-pack status

A separate deterministic `wildshot-assembler` game-pack profile is being
implemented under [GAME_PACK_EXPORT_PLAN.md](GAME_PACK_EXPORT_PLAN.md). This
profile is locked to native **1x** with 24x24 cells; it will never use the
general export-scale selector.

The pure manifest and refusal contract exists, but there is no game-pack
button or CLI yet. The approved Player Cast and Death animations are public,
generated sheets are 480x96 (20 columns), and the v1 runtime animation audit
passes. Every Enemy aliases its matching Attack frame during Cast and uses Hurt
frames 1, 2, 2, 2 during Death. Approved license text and the compact per-effect
frame/anchor/direction contract are still required before the first valid game
pack can be emitted.

## Complete Character Kits

Use **Download Complete Character Kit** in Player mode to export one `8-bit-sprite-assembler-complete-character-kit` archive containing the entire reusable player library:

- Six animated skin-body layers and 12 normal/shaded head layers
- Six expression layers covering Neutral, Happy, Angry, Sad, Surprised, and Determined
- 119 hair layers covering all 11 styles, seven colors, and headgear fits; identical short, spiky, bowl, and topknot fitted art shares one file
- 30 facial-detail layers containing only the color-dependent variants each detail actually needs
- 60 direction-aware species layers split into 20 back and 40 front passes: skin-matched ears, tusks, Dwarf features, Lizardfolk scales and tails; hair-matched Beastkin ears, muzzles, and tails; plus fixed-color Tiefling horns, Celestial wings and halos, and Undead skulls and bone hands
- 1020 outfit-front layers plus 140 cape-back layers covering all nine outfit families, four body builds, and five armor tiers; fixed-color leather and plate art is stored once per build and tier
- 41 headgear layers covering all 12 choices; fixed-color gear is stored once, while cap, hood, wizard hat, bandana, and plumed helm receive the seven catalog outfit colors
- 150 weapon layers covering all 15 families at Tiers 1-5 in back/front passes
- 326 shield layers covering all eight families at Tiers 1-5; a pass gets color variants only when color changes its pixels, including Tier 5 artifact passes that fully replace the underlying accent
- Two Lantern utility-off-hand layers split into direction-aware back and front passes
- 202 complete enemy sheets covering every variation in all 57 enemy families, organized beneath `enemies/`
- 24 transparent combat-effect sheets covering trails, projectiles, impacts, and statuses, organized beneath `effects/`
- One assembled reference sheet, `manifest.json`, and `README.txt`

The standalone kit contains 1912 content-unique component sheets, 202 ready enemy sheets, 24 combat-effect sheets, and one reference preview: 2139 native `480x96` PNGs total. The combined Complete Pack instead adds one ready sheet per saved player and reuses its first character as the reference.

Draw the non-null component paths from a recipe in this order:

`weapon-back` → `shield-back` → `offhand-back` → `species-back` → `outfit-back` → `outfit` → `skin-body` → `head` → `expression` → `species-front` → `face-detail` → `hair` → `headgear` → `shield-front` → `offhand-front` → `weapon-front`

Each schema-v12 recipe records the selected species, body build, expression, hairstyle, headgear, expanded outfit family, and optional utility off-hand, and may include a combat loadout with explicit selections, weapon-aware automatic defaults, resolved effect files, and the current draw order. Build-specific outfit and cape paths keep the silhouette modular while skin, head, expression, hair, species, headgear, weapon, shield, and utility-off-hand layers stay shared. Effect sheets remain separate and use the same animation column, direction row, and 24x24 source rectangle; status effects animate across every animation, while trails, projectiles, and impacts are transparent outside attack. The existing recipe order places effects after the assembled sprite, but that is the current compatibility contract, not a resolved equipment-occlusion rule. Consumers should keep the sheets modular; the optional legacy effect compositor remains on ice and its current preview order must not be treated as final guidance.

Every component shares the same animation grid and has been validated to recompose the complete renderer pixel-for-pixel across all directions and frames. To craft a new character in a game, copy a recipe and change its component paths; no art needs to be duplicated.

## Project layout

- `index.html` - standard application entry point
- `styles.css` - desktop-style responsive interface
- `app.js` - editor state, Production/Wildcard actions, sprite history, reset and comparison workflows, presets, combat loadouts, equipment-batch, class-pack, and character-pack exports, Complete Character Kit rendering, naming, playback and frame inspection, and downloads
- `character-kit.js` - deterministic component coverage, paths, recipe mapping, counts, and layer-order planning
- `zip.js` - dependency-free ZIP archive writer used by character-pack and Master Character Kit export
- `sprite-engine.js` - stable public engine API
- `engine/` - focused animation, palette, player-option, enemy, production-roll, Wildshot game-pack contract, combat-loadout and combat-effect rendering, equipment-variant and RPG-class planning, humanoid weapon, shield, and utility-off-hand renderers, shared pixel-buffer, assembled-output shade/outline coordination, sheet, and generator modules
- `asset-pack/` - validated enemy and example player sheets
- `tools/dev-server.mjs` - dependency-free local development server
- `tools/build.mjs` - dependency-free production build
- `tools/check-project.mjs` - project and asset validator
- `tools/production-roll-review.mjs` - deterministic balanced Production/Wildcard review and audit generator
- `src-tauri/` - Tauri 2 Windows wrapper, permissions, CSP, and icon resources
- `ARCHITECTURE.md` - engine boundaries, dependency direction, and safe extension points
- `ROADMAP.md` - agreed development and Windows release order
- `HANDOFF.md` - exact branch, validation, known gaps, and continuation state
- `ENEMY_OUTLINE_PLAN.md` - completed 57-family outline rollout record
- `SHADE_RENDERING_PLAN.md` - canonical completed shade design and approval gates
- `OFFHAND_ITEMS_PLAN.md` - approved Lantern pilot, public contract, validation, and future off-hand boundaries
- `PRODUCTION_ROLL_PLAN.md` - completed Production-versus-Wildcard policy, review, approval, editor integration, and compatibility gates

## Direction

The project will preserve the sprite-sheet contract while moving toward an app-ready frontend, a small Tauri Windows proof, expanded editor functionality and content, and finally a polished Windows installer. See [ROADMAP.md](ROADMAP.md).
