# Optional Player Outlines

Status: implemented on `codex/optional-sprite-outlines` from safe baseline `4d26784b16d945b04aca9ff4f7a15b5435ab82ff`.

## Goal

Restore optional outlines without repeating the reverted flattened-character approach. The outline pass must preserve internal transparency, avoid welding adjacent equipment into the body, and make None mode pixel-identical to the safe baseline.

## Modes

- **None**: calls the original renderer directly. This is the compatibility default for existing saved state and presets.
- **Complete B**: adds an eight-neighbor exterior contour around each assembled ownership group.
- **Selective C**: adds a lighter four-neighbor exterior contour around each assembled ownership group.

Both outline modes use `#1a1c2c`. Closed transparent cavities are excluded because only transparency connected to the outside of the 24x24 frame may produce a contour.

## Rendering boundary

The implementation uses the renderer's existing ownership layers in this order:

1. `weapon-back`
2. `shield-back`
3. `body`
4. `shield-front`
5. `weapon-front`

The back/front passes are merged into three logical owners: body, weapon, and shield. The complete contour is the union of all three owners wherever the final assembled pixel is transparent. Shared body/equipment contour candidates are retained rather than deleted, so contact areas do not lose pieces of their outline. The untouched final assembled frame is composited above the accepted contour, so an outline can never replace a body, weapon, shield, or shadow pixel.

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

The outline review command verifies 6,000 None-mode direct-render parity cases, 2,000 deterministic randomized assembled-art integrity cases, representative hashes anchored at the safe baseline, every full-contour candidate surviving the additive neck pass, randomized neck-cavity completion, source-pixel preservation, ownership isolation, exterior-only ordinary cavity behavior, mode distinction, and review examples. `npm run check` covers source contracts and existing project invariants. The browser smoke test must also confirm the selector is Player-only, modes visibly change both stage and sheet preview, selection survives reload, random characters retain all internal artwork, and switching back to None restores the untreated result.

## Rollback boundary

The feature is isolated behind `engine/outline-renderer.js`, outline options threaded through `engine/sheets.js`, and outline state/UI/export wiring in `app.js`. Removing those option paths and the Player-only selector returns all render callers to their original direct-render behavior; source artwork and committed fixture assets require no rollback.
