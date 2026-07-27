# Wildshot Game-Pack Export Plan

Date: 2026-07-27

## Status

Implementation is active, but `wildshot-assembler` manifest v1 is **not ready
to emit yet**.

The attached Wildshot Adventures export proposal is accepted as the product
direction for a new focused game-pack lane. This plan records the assembler
side of that contract. It does not amend or implement a separate game
repository.

The approved stable assembler animation contract is now Idle 2, Walk 4,
Attack 4, Cast 4, Hurt 2, Death 4 (20 columns / 480x96 native). Players use the
authored four-frame Cast and Death motions. Every Enemy aliases its matching
Attack frame during Cast and uses Hurt frames 1, 2, 2, 2 during Death.

The repository still has no license file or approved license text to place in
the required `LICENSE` entry.

The effect library also needs a focused packing decision. Existing effect
sheets are synchronized four-direction, full-animation overlays. The proposed
game pack uses compact per-effect frame counts, anchors, and directional flags.
The exporter must not guess how to collapse those contracts.

## Binding assembler-side decisions

- Game-pack sprites are always native **1x**.
- One cell is 24x24 pixels.
- The game-pack UI and CLI expose no scale selector.
- The general sprite, ordinary pack, batch, class, and Complete Kit exporters
  retain their existing scale behavior.
- Manifest and ZIP/file ordering are deterministic.
- Identical committed inputs, generation date, tool commit, license text, and
  roster produce byte-identical output.
- Actor specifications remain ordinary complete Player or Enemy
  specifications capable of regenerating their sheets.
- IDs and filenames are lower-kebab and stable once v1 ships.
- A v1 exporter refuses invalid dimensions, required empty actor frames,
  non-binary alpha, missing/orphan files, invalid UTF-8 JSON, a BOM, a missing
  license, or any scale other than 1x.
- The consumer derives dimensions from `frame_contract`; it does not hardcode
  12, 16, or 20 columns.

## Target folder

```text
assembler-pack/
  manifest.json
  players/<id>.png
  enemies/<id>.png
  effects/projectiles/<id>.png
  effects/impacts/<id>.png
  effects/trails/<id>.png
  effects/statuses/<id>.png
  LICENSE
```

The intended consumer installation location is
`assets/assembler-pack/`. Copying into a game repository and changing that
repository remain separate consumer-side actions.

## Frozen v1 manifest identity

```json
{
  "pack": "wildshot-assembler",
  "version": 1,
  "cell": 24,
  "export_scale": 1
}
```

The complete required animation order is:

1. Idle: 2 frames at 420 ms;
2. Walk: 4 frames at 150 ms;
3. Attack: 4 frames at 115 ms;
4. Cast: 4 frames at 130 ms;
5. Hurt: 2 frames at 140 ms.

Rows are Down, Left, Right, Up. Columns are animations in the order above,
with each animation's frames from left to right.

## Architecture

`engine/game-pack.js` owns only the portable contract, deterministic manifest
construction, readiness audit, and export validation. It may import stable
catalog data, but it must not import DOM, canvas, storage, ZIP, filesystem,
Tauri, or renderer modules.

The editor continues to import engine APIs through `sprite-engine.js`.

A later focused packaging adapter will:

1. receive an explicit roster, generation date, tool commit, and approved
   license text;
2. render native 1x sheets;
3. collect validation evidence while pixels are still available;
4. call the pure validator;
5. refuse packaging on any issue;
6. write the deterministic folder or stored ZIP only after validation passes.

## Slices

### Slice 1 - pure contract and refusal skeleton

Status: complete and uncommitted on 2026-07-27.

- add immutable v1 policy identity;
- lock 1x, 24px, direction order, animation order, timing, and layout;
- add deterministic manifest construction with stable sorting;
- add lower-kebab paths for players, enemies, and effects;
- require complete catalog-valid ordinary Player/Enemy specifications;
- add validation for dimensions, required frame-zero content, binary alpha,
  file parity, UTF-8 JSON without BOM, and non-empty license content;
- add a live-runtime audit that initially reports the missing Cast contract
  and passes once Slice 2 promotes it;
- expose the pure API through the stable engine facade;
- add direct tests;
- do not change renderers, geometry, current sheets, existing exporters,
  effects, fixtures, baselines, schemas, or release artifacts.

Gate: the structural suite passes and the audit honestly remains blocked only
by work outside this slice.

### Slice 2 - Cast animation design and visual approval

Status: complete and visually approved on 2026-07-27.

- define a distinct four-frame Player Cast pose in all directions;
- decide whether every Enemy aliases Attack or whether selected families need
  authored Cast motion;
- update component/equipment ownership and recomposition for the appended
  animation;
- review all Player equipment classes and representative enemies at native
  and enlarged scale with effects Off;
- update the animation contract only after explicit visual approval.

`engine/cast-animation.js` owns the immutable Player motion and public `ANIMS`
places it before Hurt. At this checkpoint generated full and direction sheets
were 384x96 and 384x24 at native 1x. The review covers six representative Players, all four
directions, four distinct frames, source/Form/Complete B/Selective C, layer
recomposition, equipment attachment, deterministic replay, and frame bounds
with Effects Off. The full validator covers every equipment catalog and
asserts every Enemy Cast frame is pixel-identical to Attack. The checked-in
4x asset pack remains an explicit legacy 12-column fixture; no fixture,
baseline, effect behavior, schema version, release, or Windows build changed.

This is a renderer and sprite-geometry lane. It must not be bundled into the
exporter merely to make validation green.

### Slice 2b - Death animation design and visual approval

Status: complete and visually approved on 2026-07-27.

`engine/death-animation.js` owns the immutable four-frame
Stagger/Buckle/Fall/Still Player motion. Public `ANIMS` appends Death after
Hurt, producing 20-column 480x96 full sheets and 480x24 direction sheets at
native 1x. Every Enemy explicitly aliases Death to Hurt frames 1, 2, 2, 2; no
unreviewed Enemy death art was invented.

The dedicated review covers six representative Players, all four directions,
all four frames, native and enlarged display, source/Form/Complete B/Selective
C, exact recomposition, equipment attachment, deterministic replay, and frame
bounds with Effects Off. The exhaustive validator covers every public export
path and every Enemy alias. Fixtures, baselines, schemas, effect behavior,
release artifacts, and Windows builds remain unchanged.

### Slice 3 - compact effect-pack contract

- classify each curated effect as projectile, impact, trail, or status;
- approve its frame count, timing, anchor, and directional behavior;
- define deterministic extraction from the existing synchronized effect
  renderer or author a separate explicit compact-sheet adapter;
- verify transparent padding, binary alpha, dimensions, and in-game anchor
  behavior.

The existing effect compositor remains unchanged.

### Slice 4 - deterministic pack writer

- add one focused CLI accepting an explicit roster recipe;
- render actors/effects at native 1x;
- obtain `tool_commit` from the exact checked-out commit;
- accept an explicit generation date so rebuilds are reproducible;
- require approved license text;
- produce the exact folder tree and optionally a stored ZIP;
- prove byte-identical repeated exports.

### Slice 5 - editor action

- add one **Export game pack (1x)** action for the working roster;
- show validation failures without producing a partial archive;
- expose no scale choice;
- keep ordinary and Complete Pack actions unchanged;
- browser-smoke cancellation, successful download/save, and restored state.

### Slice 6 - consumer handoff

- generate the approved Phase A roster;
- copy or unzip only after the user selects the target game worktree;
- add the separately approved game-repository importer amendment;
- run its slice test and manual player/enemy smoke.

## Explicitly deferred

- Windows builds and release artifacts;
- accepted sprite fixtures or baselines;
- changes to current general-purpose export schemas;
- automatic writes into an unspecified game repository;
- game-side importer, player swap, and encounter implementation;
- new effect-compositor behavior.
