# Shared Assembled-Sprite Shade Pass

Status: canonical next-phase plan; implementation has not started. The
enemy-outline prerequisite is complete and visually approved. Shade mode must
default to None, and no fixture, baseline, executable, published asset, or
existing output may change before its explicit visual approval gate.

Date: 2026-07-26

## Goal

Add one optional engine-level shade treatment for complete assembled players and
enemies. Form mode should give material masses a consistent top-biased light,
cooler lower/right shade, and better separation on both dark and light
backgrounds without redrawing procedural source geometry.

The pass must:

- run after the existing procedural renderer has produced a complete 24x24
  sprite;
- alter only visible source-sprite pixels;
- leave floor shadows, combat effects, outline pixels, atomic component sheets,
  animation timing, frame layout, and source geometry unchanged;
- combine deterministically with None, Complete B, and Selective C outlines;
- keep None mode on the original direct-render path.

## Non-goals

- Redesigning individual player or enemy artwork.
- Changing enemy or player catalogs' existing ids.
- Baking combat effects into assembled character sheets.
- Shading atomic Complete Character Kit component sheets.
- Changing the 24x24 frame or 12-column sheet contract.
- Accepting new fixture hashes or visual baselines automatically.
- Correcting unrelated effect/shield compositing behavior.

## Prerequisite

The enemy-outline lane is complete at local checkpoint `ac860aa` on
`codex/enemy-outlines`: all 57 families / 202 variants, 9,696 source frames,
and 29,088 None-B-C cases pass with zero source-edge frames and zero
out-of-bounds writes. Anglerfish, Snail, and Porcupine are approved; no enemy
family remains unsupported.

Create the implementation on a fresh branch or isolated worktree from the clean
documentation checkpoint that follows `ac860aa`. Preserve the current no-push
approval workflow. Before changing persistence schemas, explicitly resolve or
carry forward the known pre-shade gap where saved enemy preset/pack entries
reload their outline mode as None even though live enemy previews and sheets
support all three modes.

## Modes

- `SHADE_MODE_NONE = 'none'`
  - compatibility default;
  - sanitization target for missing or invalid values;
  - delegates directly to the existing assembled renderer when outline mode is
    also None;
  - must remain pixel-identical to the pre-shade checkpoint.
- `SHADE_MODE_FORM = 'form'`
  - applies the approved material-aware Form treatment to complete assembled
    player and enemy source pixels.

Expose an immutable `SHADE_MODES` catalog and `normalizeShadeMode()` through
`sprite-engine.js`.

## Rendering Architecture

### Shared pixel-buffer helpers

The outline renderer currently owns private string-pixel capture and paint
helpers. Do not duplicate that fake canvas in the shade module. Extract the
generic pieces into a small internal module such as
`engine/pixel-buffer.js`:

- render a sprite or registered layer into a 24x24 array of color strings;
- test transparent cells;
- paint color runs back to a canvas context;
- preserve the renderer's `onOutOfBounds`, `clear`, `shadow`, and `layer`
  behavior.

The internal module is not a new public import path.

### Shade module

Add `engine/shade-renderer.js` for:

- shade mode constants and normalization;
- color parsing, clamping, and deterministic color conversion;
- resolved material-ramp construction;
- protected-color and protected-pixel decisions;
- pure `shadePixels()` transformation;
- focused shade-specific exports needed by validation.

The module must not touch DOM state, browser persistence, exports, or catalogs'
existing definitions.

### One assembled-output entry point

Add one engine-level assembled output coordinator, for example
`drawAssembledSprite()`, and export it through `sprite-engine.js`. Previews,
comparisons, thumbnails that represent complete assembled output, sheet
builders, and exports must use this same coordinator.

Keep `drawSprite()` as the procedural source renderer and keep the existing
outline API available for its direct regression tests.

The coordinator owns this order:

1. Render the original complete sprite without its floor shadow.
2. Preserve that unshaded source buffer for occupancy, ownership, outline, and
   regression decisions.
3. If Form is enabled, shade eligible source pixels.
4. Generate outline contours and contact separators from the original
   unshaded ownership/occupancy buffers.
5. Paint the existing floor shadow unchanged.
6. Paint outline pixels only where the outline system currently authorizes
   them.
7. Paint the shaded source sprite over transparent-space contours.
8. Paint authorized direct-contact outline separators last, exactly as the
   current outline contract requires.

An equivalent internal composition is acceptable if tests prove identical
ordering. In particular, applying a shade transform to final source-owned
pixels inside the existing outline compositor is valid. Shading must never use
an outline pixel as input, and outline geometry must not depend on shaded color.

### Direct delegation

When shade mode and outline mode are both None, call `drawSprite()` directly
with the original options. Do not capture and repaint a nominally untreated
frame.

When shade mode is None and an outline is enabled, the output must remain
pixel-identical to the approved outline checkpoint.

Effects and any non-`complete` atomic layer always delegate directly to
`drawSprite()`, regardless of shade mode.

## Form Algorithm

### Material regions, not only alpha silhouette

Transparency-only exposure would shade only the outer silhouette and cannot
satisfy the goal that armor, skin, clothing, and equipment read as separate
masses. Form mode therefore evaluates exposure against resolved material
regions:

- colors belonging to one known base/shadow/highlight ramp share one material
  id;
- a cardinal neighbor is outside the current mass when it is transparent or
  belongs to a different material id;
- base and existing shadow/highlight colors in the same ramp do not create a
  false internal boundary;
- unknown colors receive a deterministic per-color fallback ramp and material
  id.

The first pilot must compare this material-region rule against a
silhouette-only control. If the material-region result creates noisy seams at
24x24, stop and revise the rule rather than silently weakening acceptance.

### Edge precedence

Use a fixed top-biased light model:

1. top edge exposed: highlight;
2. otherwise bottom edge exposed: core shadow;
3. otherwise right edge exposed: side shade;
4. otherwise leave the source color unchanged.

If a one-pixel-thick feature is exposed on both top and bottom, highlight wins.
Each pixel receives at most one treatment. There is no randomness and no
frame-to-frame sampling.

The first implementation should not add a separate left-edge highlight. That
can be considered only if the pilot shows that top exposure alone fails to
communicate the intended light direction.

### Ramp behavior

Build one resolved color-to-material lookup per sanitized specification.

Known three-color ramps use explicit roles:

- base -> authored highlight for top exposure;
- base -> authored shadow for bottom exposure;
- base -> deterministic midpoint toward authored shadow for right exposure;
- authored highlight -> remains highlight at the top and may step back only to
  base on lower/right exposure;
- authored shadow -> may step toward base at the top but is never darkened
  beyond the authored shadow at the bottom/right.

Known two-color ramps:

- use the authored base and shadow;
- derive one warm highlight from the base;
- derive side shade between base and authored shadow;
- do not darken an authored shadow a second time.

Known ramps include:

- `METAL`, `GOLD`, `WOOD`, `BONE`, `CREAM`, `BOOTS`, `PANTS`, and
  `IRONPANTS`;
- player skin, hair, and outfit catalog pairs;
- valid custom player skin, hair, and outfit pairs;
- material-like ordered pairs/triples resolved from the selected enemy variant;
- selected weapon and shield material ramps when they are available as stable
  engine data.

Do not move hundreds of source colors into one monolithic global palette merely
to satisfy this pass. Extract or export stable ramp metadata only where the
pilot proves it is necessary.

### Unknown-color fallback

Unknown colors use a deterministic bounded conversion:

- highlight: approximately 12-15% lighter with a small warm shift;
- core shadow: approximately 12-18% darker with a restrained cool shift and
  saturation increase;
- side shade: approximately 6-8% darker with a smaller cool shift;
- clamp every channel and reject non-finite conversion results;
- preserve alpha;
- keep the result a safe distance from `INK`.

Use a clearly named sRGB relative-luminance calculation. Do not call a 0..1
threshold `L*`, because CIE L* uses a different scale.

### Protected pixels

Form mode must leave these exact:

- transparent cells;
- the existing floor shadow;
- `INK` and every source color below the approved dark-feature luminance
  threshold;
- exact `#ffffff` hurt-flash pixels;
- outline pixels and contact separators;
- pixels from effects or atomic component-layer renders.

The pilot must also assess colored eyes, irises, mouths, teeth, runes, sparks,
and other tiny accents. A luminance threshold alone cannot guarantee that every
colored feature remains unchanged.

Before full rollout, choose and test one explicit policy:

1. protect semantic feature colors/masks resolved from the selected spec; or
2. protect bounded tiny accent components that are not registered materials.

Do not claim "faces unchanged" until the selected policy has direct player and
enemy regressions. If exact semantic protection would require broad enemy
source-geometry rewrites, narrow the acceptance claim instead of hiding that
cost.

## Included Surfaces

After their respective approval gates:

- assembled player stage and all-directions previews;
- assembled enemy stage and all-directions previews;
- saved comparisons and undo/redo state;
- full, direction, and animation sheet previews;
- full, direction, and animation PNG exports;
- player and enemy presets;
- ready player/enemy entries in ordinary character packs;
- assembled player sheets in equipment batches and class packs;
- assembled reference/ready sheets in Complete Character Kits and Packs.

## Explicitly Excluded

- recoloring combat-effect pixels or effect exports;
- changing the current effect-overlay draw order or occlusion behavior in the
  combined preview;
- atomic Complete Character Kit component sheets;
- generic source-option thumbnails;
- procedural source geometry and catalog ids;
- floor-shadow recoloring;
- any unsupported experimental compositor.

Atomic component sheets must continue to recompose the untreated procedural
renderer pixel-for-pixel. Form shading belongs only to the assembled output
stage.

## Editor State and Persistence

Add `shadeMode` to:

- default state;
- state loading and sanitization;
- history snapshots and comparisons;
- reset behavior;
- cache keys;
- player and enemy presets;
- player and enemy pack entries;
- export recipes and manifests for assembled outputs;
- equipment-batch and class-pack assembled-output recipes;
- Complete Character Kit/Pack assembled-reference metadata.

The shade selector is visible for Player and Enemies and hidden for Effects.
None remains the default for all missing legacy fields.

Version each affected format deliberately:

- preset library: v10 -> v11, accepting and migrating v1 through v10;
- ordinary character-pack storage: decide and test v1 -> v2 migration rather
  than silently rejecting old packs;
- equipment-batch and class-pack schemas: bump only if `shadeMode` enters their
  serialized recipes;
- Complete Character Kit/Pack: bump only if their recipe/manifest contract
  changes;
- combat-loadout schema: no bump, because shading is not a combat-loadout
  concern.

Document the final version table in `ARCHITECTURE.md`. Do not use one generic
"schema v10" statement for these separate formats.

## Validation

### Core invariants

Extend `npm.cmd run check` with:

- invalid/missing shade ids sanitize to None;
- direct delegation when shade and outline are both None;
- large sampled player None parity against `drawSprite()`;
- exhaustive enemy None parity across all 9,696 enemy source frames;
- shade None plus each outline mode matches the approved outline checkpoint;
- deterministic Form output;
- no out-of-canvas writes introduced by the post-pass;
- transparent cells remain transparent;
- floor shadows remain exact;
- protected dark/INK pixels remain exact;
- exact white hurt flashes remain exact;
- no NaN, infinite, malformed, or out-of-gamut channels;
- one-pixel features receive at most one treatment;
- no Form output color collapses to `INK`;
- atomic kit layer recomposition remains pixel-identical to the untreated
  renderer.

### Combined shade and outline invariants

For Form combined with Complete B and Selective C:

- outline masks and contact-separator coordinates equal the unshaded outline
  result;
- every outline pixel remains `OUTLINE_COLOR`;
- shading changes only original source-owned pixels;
- no shaded pixel is replaced by a transparent-space contour;
- no outline pixel is used as input to the shade algorithm;
- all existing outline gates still pass in shade None;
- a new combined gate covers all approved enemy-outline families plus a broad
  player/equipment matrix.

### Review generator

Add `tools/shade-review.mjs` and `npm.cmd run review:shades`.

Write ignored artifacts beneath `shade-review/`:

- native-size and nearest-neighbor sheets;
- before/Form pairs;
- None, Complete B, and Selective C columns;
- all four directions;
- idle, walk, attack, and hurt frames;
- dark `#191b22` and parchment `#e8ddc4` review backgrounds;
- machine-readable changed-pixel, protected-pixel, palette, and determinism
  summaries.

Background colors are review presentation only and must not be baked into PNG
exports.

## Pilot Matrix

The first visual gate should be deliberately small but materially diverse.

Players:

- silver plate knight with shield and a thin weapon;
- pale-skin wizard with visible face and magic equipment;
- skeleton/bone equipment case;
- dark hair and dark outfit case;
- custom skin/hair/outfit palette case;
- one high-tier weapon and one high-tier shield with unusual ramps.

Enemies:

- Dire Wolf for dark-tile readability;
- one bright saturated Slime or Elemental;
- one humanoid enemy with visible colored eyes;
- Drake for several adjacent material masses;
- Anglerfish for detached components and tiny lure/fin accents;
- one silver/stone Golem.

Review every selected specimen through all directions, animations, and frames in
Form x None/B/C. Do not expand the enemy roster until the user approves this
pilot.

## Implementation and Commit Sequence

1. **Core/None checkpoint**
   - shared pixel-buffer helpers;
   - shade mode catalog and normalization;
   - public facade exports;
   - direct-delegation and None-parity tests;
   - no UI and no Form color changes.
2. **Form algorithm pilot**
   - pure material lookup and shade transformation;
   - protection rules;
   - pilot review generator and focused regressions;
   - visual approval required.
3. **Unified assembled player surfaces**
   - one assembled coordinator;
   - preview, comparison, sheets, exports, undo/redo;
   - player persistence and migration;
   - visual approval required.
4. **Enemy pilot and rollout**
   - representative pilot first;
   - full 9,696-frame structural audit;
   - expand in manageable material/silhouette batches;
   - avoid another one-family-at-a-time process unless a family is an actual
     outlier.
5. **Pack and recipe integration**
   - ordinary packs, batches, class packs, and complete assembled references;
   - explicit schema/version updates;
   - atomic components remain untreated.
6. **Documentation**
   - update `README.md`, `ARCHITECTURE.md`, and the handoff with the accepted
     scope, ordering, version table, exclusions, and rollback boundary.
7. **Fixtures**
   - only after final visual approval;
   - decide whether committed fixtures stay None or gain separate Form
     fixtures;
   - update `asset-pack/manifest.json` only for deliberately added/changed
     files;
   - never rewrite the existing fixture corpus merely because Form exists.

Keep these as focused commits. Do not combine implementation, schema migration,
enemy rollout, and fixture acceptance in one checkpoint.

## Acceptance

The feature is complete only when:

- None is pixel-identical everywhere it is supported;
- Form is deterministic and frame-safe;
- material masses read consistently without salmon skin, pink silver, dark
  detail loss, or noisy one-pixel zebra patterns;
- the silver plate, wizard skin, bone, custom palette, Dire Wolf, Drake, and
  Anglerfish pilots are visually accepted;
- all three outline modes retain their approved geometry and colors;
- effects, floor shadows, atomic layers, animation timing, and sheet contracts
  remain unchanged;
- presets and every affected pack/recipe format migrate safely to None;
- project checks, outline checks, shade checks, production build, and browser
  smoke tests pass;
- no baseline, fixture, executable, commit, or push is presented as accepted
  without its corresponding explicit approval.

## Rollback Boundary

The feature should remain isolated behind:

- `engine/shade-renderer.js`;
- shared internal pixel-buffer helpers;
- one assembled-output coordinator;
- `shadeMode` state/UI/persistence wiring;
- shade-specific checks and review tooling.

Removing those paths and returning complete assembled call sites to the
approved outline renderer must restore the exact pre-shade output. Procedural
source geometry and atomic component assets must require no rollback.
