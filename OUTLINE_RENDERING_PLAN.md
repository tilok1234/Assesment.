# Optional Assembled-Sprite Outlines

Status: implemented and visually approved for assembled players and all 57
enemy families. The player implementation began at `674d926`; the enemy
rollout completed at historical 12-column checkpoint `ac860aa` on
`codex/enemy-outlines`. The current 20-column public contract extends that
approved lane through Cast and Death. Combat effects, atomic component sheets,
and procedural source art remain outside the treatment. The deferred
effect/shield preview issue is tracked in `HANDOFF.md` and is not an outline
defect.

## Goal

Restore optional outlines without repeating the reverted flattened-character approach. The outline pass must keep the body readable, preserve deliberate internal artwork, separate weapons and shields from the character at direct contact, and make None mode pixel-identical to the safe baseline.

## Modes

- **None**: calls the original renderer directly. This is the compatibility default for existing saved state and presets.
- **Complete B**: adds an eight-neighbor contour around each assembled ownership group.
- **Selective C**: adds a lighter four-neighbor contour around each assembled ownership group.

Both outline modes use `#1a1c2c`. The body keeps an exterior-only contour plus the narrow neck-cavity repair. Equipment uses a restrained cardinal contour in both modes so one-pixel shafts and tiny held items retain more colored core. Weapon and shield owners contour only enclosed transparent components of at least five logical pixels: large silhouette-defining openings such as bows remain readable, while one-to-four-pixel construction pockets in bone lattices, crossbows, staff heads, and ornaments do not become dark mazes. When equipment directly shares an up/down/left/right edge with the body and no transparent cell exists between them, the separator follows the renderer's concrete depth pass: back-pass equipment receives the separator on its equipment-side edge, while front-pass equipment normally stays intact and receives the separator on the adjacent character-side edge. If replacing that character pixel would lengthen a cardinally adjacent dark body feature such as an eye or mouth, the body pixel stays unchanged and the separator moves onto the touching front-equipment pixel. If front-pass equipment directly touches the concrete headgear layer, the separator also uses the touching equipment-side pixel while every headgear pixel stays unchanged. At three-way equipment/headgear/body junctions, the equipment-side headgear contour remains continuous while the feature-preserving rule still controls whether the adjacent body-side pixel may change. Diagonal-only proximity never triggers this pixel-replacing contact pass, preventing clipped corners and endcaps.

A source pixel converted into a one-pixel equipment/body contact separator does not cast an additional exterior halo. This prevents body and equipment contours from fusing into thick shelves while preserving the separator itself and legitimate interior equipment openings.

Enemies use the same public modes with approval-gated family routing. Connected
silhouettes receive an exterior contour; layered humanoids use component-aware
body/equipment ownership; and disconnected creatures use family-specific
separated-component thresholds so meaningful anatomy is contoured without
boxing one-pixel sparks, legs, droplets, or quills. Selected cavity-sensitive
families preserve or deliberately contour authored internal openings according
to the approved family contract in `ENEMY_OUTLINE_PLAN.md`.

## Rendering boundary

The implementation uses the renderer's existing ownership layers in this order:

1. `weapon-back`
2. `shield-back`
3. `offhand-back`
4. `body`
5. `headgear`
6. `shield-front`
7. `offhand-front`
8. `weapon-front`

The back/front equipment passes are merged into four logical owners: body,
weapon, shield, and utility off-hand. Shield and utility off-hand remain
mutually exclusive. Headgear remains inside the body owner so its contact with
the head cannot create an internal outline or replace colored head pixels.
Transparent contour candidates are the union of all owners wherever the final
assembled pixel is transparent. The untouched final assembled frame is then
composited above that contour. A second layer-aware contact pass retains the
concrete back/body/headgear/front identity of every visible pixel. At direct
equipment/body contact, it places the separator on the visually rear object's
boundary: the equipment edge for back passes and normally the character edge
for front passes. When that front character-side replacement would merge with
an existing dark body feature, the separator moves to the touching equipment
edge instead. Direct front-equipment/headgear contact also uses the touching
equipment pixel so the inner held-item edge reads without cutting the hat.
This changes no procedural source geometry, assets, headgear pixels, facial
features, or None-mode output.

Front/back humanoid frames also receive an additive neck-cavity completion pass. It locates the vertically moving transition between the shared eight-pixel head base and two-pixel neck, then adds outline only to transparent cells directly beneath the full head base. The repair is ORed into the completed owner contour: it cannot clear an existing outline pixel or replace assembled artwork.

Enemy routing captures the complete shadowless source frame, generates either
the connected exterior mask or the approved component-aware/separated mask,
then paints the untouched source sprite above that contour. Family-specific
source-geometry repairs live in `engine/renderer.js`; they are independently
covered by the one-cell frame-margin regression and are not hidden by the
outline pass.

## Included surfaces

- Player stage preview and direction/animation preview
- Enemy stage preview and direction/animation preview
- Full-sheet preview and full, direction, and animation PNG exports
- Live player/enemy state, undo/redo, saved comparisons, and browser persistence
- Saved player pack entries and their assembled thumbnails
- Equipment batches and class-pack assembled player sheets
- Complete Character Kit reference preview
- Complete Character Pack assembled player sheets

## Explicitly excluded

- Combat-effect rendering and effect exports
- Procedural source artwork and catalogs
- Atomic Complete Character Kit component sheets
- Generic option thumbnails

These exclusions keep the behavior isolated to complete assembled player/enemy
output and preserve runtime-composable component assets.

## Persistence and compatibility

- Outline mode is stored as editor state and as part of saved player and enemy
  configurations.
- Character preset schema v10 migrates older schemas to None.
- Preset v10 and ordinary character-pack v1 already contain the field, so
  preserving valid enemy values requires no schema bump.
- Invalid or missing outline ids sanitize to None.
- Effects sanitize to None and remain untreated.
- None uses direct delegation rather than running a nominally disabled post-process.

## Regression gates

Run:

```powershell
npm run review:outlines
npm run review:enemy-outlines
npm run review:enemy-outline-pilots
npm run check
npm run build
```

The outline review command verifies 6,000 None-mode direct-render parity cases, 2,000 deterministic randomized integrity cases, 11,040 exhaustive outlined equipment cases, 10,656 exhaustive headgear-preservation cases, representative hashes anchored at the safe baseline, cardinal equipment halos, filtered silhouette-defining cavities, the explicit Sword/Tower/Bow/Crossbow/Staff/Dagger/Bone pilot, depth-aware equipment/body separators, feature-preserving equipment-side fallbacks, equipment-side front-equipment/headgear separators, foreground headgear pixel preservation, non-contact body and equipment pixel preservation, randomized neck-cavity completion, ownership isolation, mode distinction, and review examples. `npm run check` covers source contracts and existing project invariants. The browser smoke test must also confirm the selector is available for assembled players and enemies but hidden for effects, modes visibly change both stage and sheet preview, foreground player equipment reads at direct body and headgear contact without cutting headgear or extending facial features, random characters retain their artwork, switching back to None restores the untreated result, and saved enemy modes reload correctly.

The historical approval assessment covers all 57 families / 202 variants /
9,696 source frames under the 12-column contract. The current 20-column gate
passes 16,160 None-mode parity cases and 48,480 None-B-C cases, keeps Complete
B and Selective C distinct in every frame, and reports zero source-edge frames
and zero out-of-bounds writes. The Core/None
validator additionally proves every enemy source frame remains identical
through the assembled coordinator and directly tests valid, missing, invalid,
and effect-only persistence normalization. The browser smoke test must confirm
the selector appears for Player and Enemies, stays hidden for Effects,
restores saved enemy modes, and preserves every approved component/cavity
treatment.

## Rollback boundary

The feature is isolated behind `engine/outline-renderer.js`, outline options
threaded through `engine/sheets.js`, and outline state/UI/export wiring in
`app.js`. Removing those option paths and the assembled-sprite selector returns
render callers to their original direct-render behavior. The approved
family-specific frame-safety repairs in `engine/renderer.js` are source
corrections and have their own regression boundary; source assets and committed
fixture sheets require no automatic rollback or baseline rewrite.
