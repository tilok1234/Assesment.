# Project Handoff

Date: 2026-07-26

## Canonical Continuation

The enemy-outline phase is complete. The next planned phase is the optional
shared assembled-sprite shade pass in `SHADE_RENDERING_PLAN.md`.

No shade code exists yet. Start from the clean documentation checkpoint after
`ac860aa`, read this handoff and the shade plan completely, verify the live
worktree, and keep the first shade checkpoint pixel-identical.

Do not resume old weapon, shield, transparency, effect-compositor, executable,
or enemy-outline work unless the user explicitly changes priority.

## First Actions In The Next Task

1. Verify the supplied workspace instead of assuming the old temporary path:

   ```powershell
   git status --short
   git branch --show-current
   git log -5 --oneline
   ```

2. Confirm the branch is based on the documentation checkpoint immediately
   after `ac860aa` (`Add approved Porcupine outlines`).
3. Read `README.md`, `ARCHITECTURE.md`, this file,
   `OUTLINE_RENDERING_PLAN.md`, `ENEMY_OUTLINE_PLAN.md`, and
   `SHADE_RENDERING_PLAN.md`.
4. Preserve a clean worktree. Do not reset, restore, stash, merge, push, accept
   baselines, or rebuild release artifacts automatically.
5. Before implementation, tell the user that the first shade step is the
   Core/None checkpoint and contains no visible color change.

## Git State At Handoff

- Completed outline branch: `codex/enemy-outlines`
- Final approved enemy-outline commit: `ac860aa`
  (`Add approved Porcupine outlines`)
- Parent transparency checkpoint: `690aec0`
  (`Fix transparent body and Bone shield gaps`)
- `codex/enemy-outlines` is 57 commits ahead of the local
  `codex/optional-sprite-outlines` branch at `690aec0`.
- Compared with `origin/codex/optional-sprite-outlines` at `f21cbe3`, the
  outline branch is 61 commits ahead and has no remote-only commits.
- The outline branch has no configured upstream and has not been pushed.
- The documentation checkpoint containing this handoff and
  `SHADE_RENDERING_PLAN.md` should be the clean base for the next worktree.
  Verify its exact HEAD rather than copying a hash from chat.

## Completed Enemy-Outline State

All 57 enemy families and 202 variants are visually approved in None,
Complete B, and Selective C.

Final structural evidence:

- 9,696 enemy source frames;
- 9,696 None-mode parity cases;
- 29,088 total None/B/C cases;
- Complete B and Selective C differ in all 9,696 frames;
- zero source-edge frames / zero source-edge pixels;
- zero out-of-bounds frames / zero out-of-bounds writes;
- 7,536 frame-safe repaired-enemy regression cases;
- `npm.cmd run check` passed;
- `npm.cmd run review:enemy-outlines` passed;
- the complete `tools/enemy-outline-pilot-review.mjs` lane passed;
- `npm.cmd run build` passed;
- `git diff --check` passed.

The last approved groups were:

- Anglerfish: `b34185e`
- Snail: `e2c1f2a`
- Porcupine: `ac860aa`

`ENEMY_OUTLINE_PLAN.md` is the chronological evidence record. Intermediate
"remaining family" counts in that file are historical snapshots; its top and
final-status sections describe the completed state.

## Approved Outline Contract

- None delegates to the untreated source renderer.
- Complete B is the stronger eight-neighbor treatment.
- Selective C is the lighter four-neighbor treatment.
- Player and layered humanoid equipment use component ownership and
  contact-separator rules.
- Connected enemies use exterior contours.
- Disconnected enemies use approved family-specific component thresholds and
  cavity policies.
- Effects, floor shadows, source art, catalogs, and atomic component sheets are
  not outlined.
- Do not change outline geometry as part of the shade algorithm.

## Known Pre-Shade Integration Gap

Enemy outlines are complete in live rendering, previews, comparisons, and
sheet generation, but persistence is not fully integrated:

- `app.js` exposes the selector for Player and Enemies;
- live enemy rendering honors the active outline mode;
- `sanitizePreset()` and `sanitizePackEntry()` currently preserve
  `outlineMode` only for player entries;
- loading an enemy preset or ordinary pack entry therefore restores its
  outline treatment as None.

Do not describe enemy outline persistence as complete. Decide explicitly
whether to fix this as a small prerequisite checkpoint or migrate it alongside
shade persistence. Do not silently change schema behavior without direct
migration tests.

## Shade Plan Boundary

`SHADE_RENDERING_PLAN.md` is planning-only at this checkpoint. The intended
feature is one optional `Form` treatment for complete assembled players and
enemies.

The required rendering order is:

1. render the original complete source sprite without its floor shadow;
2. preserve unshaded source and ownership buffers;
3. shade eligible source-owned pixels only when Form is enabled;
4. derive outline geometry from the original unshaded buffers;
5. paint the unchanged floor shadow;
6. paint approved contours and contact separators;
7. paint shaded source pixels;
8. preserve authorized direct-contact separators exactly.

Hard requirements:

- shade None plus outline None directly delegates to `drawSprite()`;
- shade None plus Complete B/Selective C is pixel-identical to `ac860aa`;
- effects and non-complete atomic layers always delegate untreated;
- no procedural geometry, animation, frame layout, floor shadow, outline
  pixel, contact separator, or atomic component changes;
- no automatic fixture, baseline, manifest, executable, commit, or push;
- review effects Off so the deferred effect compositor cannot contaminate the
  visual decision.

## Shade Implementation Sequence

Follow the commit sequence in `SHADE_RENDERING_PLAN.md`.

### 1. Core/None checkpoint

- extract shared internal pixel-buffer helpers;
- add the shade mode catalog and normalization;
- expose only the required public facade entries;
- prove direct delegation and broad None parity;
- make no visible Form change and add no UI.

This is the safest first implementation slice.

### 2. Form algorithm pilot

- implement a pure deterministic material-aware shade transform;
- protect INK, exact white hurt flashes, floor shadows, effects, outlines, and
  approved tiny accents;
- add `tools/shade-review.mjs`;
- compare material-region behavior against the silhouette-only control;
- stop for visual approval.

### 3. Unified player surfaces

Only after the algorithm pilot is approved, route assembled player previews,
comparisons, sheets, exports, history, and persistence through one coordinator.

### 4. Enemy pilot and rollout

Use the small diverse matrix in the shade plan. Do not repeat the
one-family-at-a-time outline rollout unless a family is a genuine visual
outlier.

### 5. Packs and schemas

Version each affected format deliberately. Atomic component sheets remain
untreated and must still recompose the original renderer pixel-for-pixel.

## Visual Approval Workflow

- Use the isolated in-app browser for review.
- Keep effects Off during shade comparisons.
- Show native and enlarged nearest-neighbor output.
- Include None, Complete B, and Selective C.
- Review all directions, animations, and frames for the selected pilot.
- Use both dark and parchment review backgrounds without baking either into
  exports.
- Leave the actual candidate open and wait for explicit user approval.
- Keep unapproved candidates uncommitted unless the user authorizes a safe
  non-visual checkpoint.

## Deferred Independent Lanes

These remain real but are not shade work:

### Effect/shield compositor

The editor still draws resolved effects after the complete character when
effects are enabled. Effect pixels can overwrite foreground shield, equipment,
body, or headgear pixels. Fixing that requires an effect-enabled,
all-direction/all-attack-frame compositor review. Do not redesign approved
shield art or mix this into shade.

### Transparency follow-up

The accepted `690aec0` slice repaired the proven body/cape and Bone-shield
gaps. `TRANSPARENT_TILE_REPAIR_PLAN.md` retains 1,660 advisory notches and
later mixed-owner/openwork phases for a future dedicated review. Do not blanket
fill them during shade work.

### Equipment source art

Weapon frame safety, Crossbow T5, and shield hand/facing work are accepted.
Bone/Arcane/Buckler redesign notes and Crossbow T2 dense composition remain
deferred diagnostics. See the equipment and weapon plans.

### Windows release

The current web build passes. The existing standalone executable and July 19
NSIS installer predate the final `ac860aa` outline state. Neither is the current
outline/shade release candidate. Do not rebuild or distribute Windows artifacts
until a deliberate approved release checkpoint.

## Documentation Authority

- `HANDOFF.md`: exact continuation and known gaps.
- `SHADE_RENDERING_PLAN.md`: canonical next-phase design and gates.
- `ENEMY_OUTLINE_PLAN.md`: completed enemy rollout evidence.
- `OUTLINE_RENDERING_PLAN.md`: current player/enemy outline contract.
- `README.md`: user-facing capabilities and validation commands.
- `ARCHITECTURE.md`: engine boundaries and persistence caveat.
- `ROADMAP.md`: product phase history and current visual checkpoint.
- Equipment, weapon, and transparency plans: retained historical/deferred
  lanes, not current authority.
- `WINDOWS_RELEASE.md`: release procedure and artifact freshness warning.

If documentation and live code disagree, verify the code and tests, update the
handoff, and do not infer approval from an older plan.
