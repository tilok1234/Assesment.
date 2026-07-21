# Optional Player Outlines

Status: implemented and committed on `codex/optional-sprite-outlines`. The original outline implementation is `674d926`, the historical assessment checkpoint is `aaa7a89`, and the current committed and pushed branch checkpoint is `f21cbe3`. Combat effects remain explicitly outside the outline treatment; the unresolved default effect/shield preview issue is tracked in `HANDOFF.md` and must not be treated as an outline defect.

## Goal

Restore optional outlines without repeating the reverted flattened-character approach. The outline pass must keep the body readable, preserve deliberate internal artwork, separate weapons and shields from the character at direct contact, and make None mode pixel-identical to the safe baseline.

## Modes

- **None**: calls the original renderer directly. This is the compatibility default for existing saved state and presets.
- **Complete B**: adds an eight-neighbor contour around each assembled ownership group.
- **Selective C**: adds a lighter four-neighbor contour around each assembled ownership group.

Both outline modes use `#1a1c2c`. The body keeps an exterior-only contour plus the narrow neck-cavity repair. Equipment uses a restrained cardinal contour in both modes so one-pixel shafts and tiny held items retain more colored core. Weapon and shield owners contour only enclosed transparent components of at least five logical pixels: large silhouette-defining openings such as bows remain readable, while one-to-four-pixel construction pockets in bone lattices, crossbows, staff heads, and ornaments do not become dark mazes. When equipment directly shares an up/down/left/right edge with the body and no transparent cell exists between them, the separator follows the renderer's concrete depth pass: back-pass equipment receives the separator on its equipment-side edge, while front-pass equipment normally stays intact and receives the separator on the adjacent character-side edge. If replacing that character pixel would lengthen a cardinally adjacent dark body feature such as an eye or mouth, the body pixel stays unchanged and the separator moves onto the touching front-equipment pixel. If front-pass equipment directly touches the concrete headgear layer, the separator also uses the touching equipment-side pixel while every headgear pixel stays unchanged. At three-way equipment/headgear/body junctions, the equipment-side headgear contour remains continuous while the feature-preserving rule still controls whether the adjacent body-side pixel may change. Diagonal-only proximity never triggers this pixel-replacing contact pass, preventing clipped corners and endcaps.

A source pixel converted into a one-pixel equipment/body contact separator does not cast an additional exterior halo. This prevents body and equipment contours from fusing into thick shelves while preserving the separator itself and legitimate interior equipment openings.

## Rendering boundary

The implementation uses the renderer's existing ownership layers in this order:

1. `weapon-back`
2. `shield-back`
3. `body`
4. `headgear`
5. `shield-front`
6. `weapon-front`

The back/front equipment passes are merged into three logical owners: body, weapon, and shield. Headgear remains inside the body owner so its contact with the head cannot create an internal outline or replace colored head pixels. Transparent contour candidates are the union of all three owners wherever the final assembled pixel is transparent. The untouched final assembled frame is then composited above that contour. A second layer-aware contact pass retains the concrete `weapon-back`, `shield-back`, `body`, `headgear`, `shield-front`, and `weapon-front` identity of every visible pixel. At direct equipment/body contact, it places the separator on the visually rear object's boundary: the equipment edge for back passes and normally the character edge for front passes. When that front character-side replacement would merge with an existing dark body feature, the separator moves to the touching equipment edge instead. Direct front-equipment/headgear contact also uses the touching equipment pixel so the inner held-item edge reads without cutting the hat. This changes no procedural source geometry, assets, headgear pixels, facial features, or None-mode output.

Front/back humanoid frames also receive an additive neck-cavity completion pass. It locates the vertically moving transition between the shared eight-pixel head base and two-pixel neck, then adds outline only to transparent cells directly beneath the full head base. The repair is ORed into the completed owner contour: it cannot clear an existing outline pixel or replace assembled artwork.

## Included surfaces

- Player stage preview and direction/animation preview
- Full-sheet preview and full, direction, and animation PNG exports
- Player presets, undo/redo, saved comparisons, and browser persistence
- Saved player pack entries and their assembled thumbnails
- Equipment batches and class-pack assembled player sheets
- Complete Character Kit reference preview
- Complete Character Pack assembled player sheets

## Explicitly excluded

- Enemy rendering and enemy exports
- Combat-effect rendering and effect exports
- Procedural source artwork and catalogs
- Atomic Complete Character Kit component sheets
- Generic option thumbnails

These exclusions keep the new behavior isolated to assembled player output and preserve runtime-composable component assets.

## Persistence and compatibility

- Outline mode is stored as editor state and as part of saved player configurations.
- Character preset schema v10 migrates older schemas to None.
- Invalid or missing outline ids sanitize to None.
- None uses direct delegation rather than running a nominally disabled post-process.

## Regression gates

Run:

```powershell
npm run review:outlines
npm run check
npm run build
```

The outline review command verifies 6,000 None-mode direct-render parity cases, 2,000 deterministic randomized integrity cases, 11,040 exhaustive outlined equipment cases, 10,656 exhaustive headgear-preservation cases, representative hashes anchored at the safe baseline, cardinal equipment halos, filtered silhouette-defining cavities, the explicit Sword/Tower/Bow/Crossbow/Staff/Dagger/Bone pilot, depth-aware equipment/body separators, feature-preserving equipment-side fallbacks, equipment-side front-equipment/headgear separators, foreground headgear pixel preservation, non-contact body and equipment pixel preservation, randomized neck-cavity completion, ownership isolation, mode distinction, and review examples. `npm run check` covers source contracts and existing project invariants. The browser smoke test must also confirm the selector is Player-only, modes visibly change both stage and sheet preview, selection survives reload, foreground equipment reads at direct body and headgear contact without cutting headgear or extending facial features, random characters retain their artwork, and switching back to None restores the untreated result.

## Rollback boundary

The feature is isolated behind `engine/outline-renderer.js`, outline options threaded through `engine/sheets.js`, and outline state/UI/export wiring in `app.js`. Removing those option paths and the Player-only selector returns all render callers to their original direct-render behavior; source artwork and committed fixture assets require no rollback.
