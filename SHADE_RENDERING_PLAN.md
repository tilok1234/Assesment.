# Shared Assembled-Sprite Shade Pass

Status: canonical shade-phase authority. The Form algorithm was explicitly
visually approved on 2026-07-26. Unified Player/Enemy editor state, history,
previews, persistence, assembled exports, and recipe metadata are implemented
in the approved shade checkpoint and pass structural validation. The live
editor integration was explicitly approved on 2026-07-26, and Form is now the
default for new and reset Player/Enemy editor documents. None remains the
engine/API compatibility mode and the migration fallback for versioned legacy
artwork; fixtures, baselines, and release artifacts remain separately
approval-gated.

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
- Changing the 24x24 frame or the then-current 12-column sheet contract. Cast
  and Death later expanded the public contract to 20 columns without changing
  the shade algorithm.
- Accepting new fixture hashes or visual baselines automatically.
- Correcting unrelated effect/shield compositing behavior.

## Prerequisite

The historical pre-shade enemy-outline lane is complete at local checkpoint
`ac860aa` on `codex/enemy-outlines`: all 57 families / 202 variants, 9,696
source frames, and 29,088 None-B-C cases passed with zero source-edge frames
and zero out-of-bounds writes. Anglerfish, Snail, and Porcupine are approved;
no enemy family remains unsupported.

The implementation began in the supplied isolated Codex worktree from clean
documentation checkpoint `630ddf7`, immediately after `ac860aa`. The
approval-gated workflow was preserved until the user authorized the
`codex/form-shading` safe checkpoint and push.

The pre-shade enemy preset/ordinary-pack gap is resolved without a schema bump:
preset v10 and ordinary-pack v1 already stored `outlineMode`; valid enemy values
now survive sanitization and loading, missing or invalid legacy values migrate
to None, and effects remain untreated. Direct compatibility assertions cover
all four cases.

## Core/None Checkpoint

The completed infrastructure slice contains:

- `engine/pixel-buffer.js` for shared internal color-string capture,
  transparency, and run painting;
- immutable None/Form ids and `normalizeShadeMode()` in
  `engine/shade-renderer.js`;
- `drawAssembledSprite()` as the shared assembled-output coordinator;
- direct `drawSprite()` delegation when shade and outline are both None;
- unchanged routing through the approved outline renderer for Complete B and
  Selective C;
- no shade state, UI, persistence, Form color algorithm, or visual candidate.

Under the current 20-column contract, `npm.cmd run check` passes 480 broad
player parity cases, all 16,160 enemy source frames, and 1,616 sampled enemy
outline-combination cases in addition to the existing project gates.

## Approved Form Algorithm Checkpoint

The approved pilot introduced:

- deterministic known-material lookup from resolved player and enemy palettes;
- a bounded fallback for unknown hex colors;
- top-biased highlights with cooler lower/right shade;
- exact protection for transparency, INK, exact white, very dark features, and
  connected one- or two-pixel accents;
- unchanged effects, floor shadows, atomic layers, approved contours, and
  direct-contact separators;
- `tools/shade-pilots.mjs` with six player and six enemy specimens;
- `tools/shade-review.mjs` and `npm.cmd run review:shades`;
- an explicit silhouette-only comparison control.

`npm.cmd run check` passes 2,880 Form/outline pilot cases with deterministic
output, source-ownership enforcement, protected-pixel parity, unchanged
outline/contact geometry, finite non-INK output colors, exact transparent
cells and floor shadows, 158,872 visible changes, 164,685 protected pixels,
and 35,333
material-aware pixel differences from the silhouette-only control.

`npm.cmd run review:shades` validates 960 source frames and generates the
ignored interactive review beneath `shade-review/`. It shows untreated,
silhouette-control, Form/None, Form/Complete B, and Form/Selective C columns at
native and enlarged size on both required backgrounds, with parchment selected
by default following user review. Effects remain Off. The Form algorithm is
approved; this generated material remains review evidence, not an accepted
fixture or baseline.

## Modes

- `SHADE_MODE_NONE = 'none'`
  - engine/API compatibility mode;
  - sanitization target for missing or invalid values;
  - delegates directly to the existing assembled renderer when outline mode is
    also None;
  - must remain pixel-identical to the pre-shade checkpoint.
- `SHADE_MODE_FORM = 'form'`
  - applies the approved material-aware Form treatment to complete assembled
    player and enemy source pixels;
  - default for new and reset Player/Enemy editor documents.

Expose an immutable `SHADE_MODES` catalog and `normalizeShadeMode()` through
`sprite-engine.js`.

## Rendering Architecture

### Shared pixel-buffer helpers

The Core/None checkpoint extracts the outline renderer's former private
string-pixel capture and paint helpers into `engine/pixel-buffer.js`:

- render a sprite or registered layer into a 24x24 array of color strings;
- test transparent cells;
- paint color runs back to a canvas context;
- preserve the renderer's `onOutOfBounds`, `clear`, `shadow`, and `layer`
  behavior.

The internal module is not a new public import path.

### Shade module

Continue `engine/shade-renderer.js` with the Form pilot's:

- shade mode constants and normalization;
- color parsing, clamping, and deterministic color conversion;
- resolved material-ramp construction;
- protected-color and protected-pixel decisions;
- pure `shadePixels()` transformation;
- focused shade-specific exports needed by validation.

The module must not touch DOM state, browser persistence, exports, or catalogs'
existing definitions.

### One assembled-output entry point

`drawAssembledSprite()` now exists as the engine-level assembled output
coordinator and is exported through `sprite-engine.js`. Existing assembled
previews and sheet builders use it while the engine-level option continues to
default to None. Editor state passes its explicit Form default through the same
coordinator for comparisons, complete assembled thumbnails, and exports.

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

The approved integration adds `shadeMode` to:

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
Form is the default for new/reset editor documents and pre-shade unversioned
editor state. None remains the fallback for missing fields in versioned legacy
presets, packs, and recipes so stored artwork does not silently change.

The implemented format versions are:

- preset library v11, accepting and migrating v1 through v10;
- ordinary character-pack storage v2, accepting and migrating v1;
- equipment Variant Batch v2;
- Class Pack v2;
- Complete Character Kit v11;
- Complete Character Pack v11;
- combat-loadout schema v1 unchanged; assembled `baseSprite` metadata records
  the shade mode without changing combat-loadout semantics;
- palette library, Master Character Kit, and Master Roster Kit remain v1.

Missing or invalid legacy shade ids sanitize to None. Effects remain untreated
and do not replace the current Player/Enemy shade selection when loaded.

## Validation

### Core invariants

Extend `npm.cmd run check` with:

- invalid/missing shade ids sanitize to None;
- direct delegation when shade and outline are both None;
- large sampled player None parity against `drawSprite()`;
- exhaustive enemy None parity across all 16,160 current enemy source frames;
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
- idle, walk, attack, cast, hurt, and death frames;
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

1. **Core/None checkpoint — implemented and checkpointed**
   - shared pixel-buffer helpers;
   - shade mode catalog and normalization;
   - public facade exports and assembled-output coordinator;
   - direct-delegation and None-parity tests;
   - no UI and no Form color changes.
2. **Form algorithm pilot — implemented, visually approved, and checkpointed**
   - pure material lookup and shade transformation;
   - protection rules;
   - pilot review generator and focused regressions;
   - approved on parchment and dark review backgrounds on 2026-07-26.
3. **Unified assembled player surfaces — implemented and visually approved**
   - one assembled coordinator;
   - preview, comparison, sheets, exports, undo/redo;
   - player persistence and migration;
   - live-editor visual check approved on 2026-07-26.
4. **Enemy pilot and rollout — implemented and approved**
   - the approved representative pilot precedes the full audit;
   - all 16,160 current enemy source frames pass the Form audit;
   - all 1,616 enemy Form/outline integration cases preserve approved outline
     and contact geometry.
5. **Pack and recipe integration — implemented and checkpointed**
   - ordinary packs, batches, class packs, and complete assembled references;
   - explicit schema/version updates;
   - atomic components remain untreated.
6. **Documentation — updated for the integration checkpoint**
   - update `README.md`, `ARCHITECTURE.md`, and the handoff with the accepted
     scope, ordering, version table, exclusions, and rollback boundary.
7. **Fixtures — deliberately unchanged**
   - the approved safe checkpoint keeps committed fixtures on the existing
     None baseline;
   - separate Form fixtures remain optional future work;
   - update `asset-pack/manifest.json` only for deliberately added/changed
     files;
   - never rewrite the existing fixture corpus merely because Form exists.

Keep these as focused commits. Do not combine implementation, schema migration,
enemy rollout, and fixture acceptance in one checkpoint.

The current full validator also proves assembled full-sheet, direction-sheet,
and animation-sheet forwarding for Form with None, Complete B, and Selective C
on representative Player and Enemy cases. The browser smoke proves the selector
is visible for Player/Enemies, hidden for Effects, persists across mode changes,
and participates in undo/redo. A production build remains intentionally
deferred with release artifacts.

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
- project, outline, shade, and browser smoke checks pass;
- production/release builds remain a separate release checkpoint;
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
