# Project Handoff

Date: 2026-07-26

## Canonical Continuation

The enemy-outline phase is complete. Its persistence prerequisite, shade
Core/None infrastructure, approved Form algorithm, and unified Player/Enemy
integration are approved in the safe shade checkpoint on
`codex/form-shading`, based on documentation checkpoint `630ddf7`.

The user explicitly approved both the Form algorithm and live integration on
2026-07-26, then selected Form as the new/reset Player/Enemy editor default.
The integration adds shade state, history, comparisons, live previews,
persistence migrations, assembled exports, and pack/recipe metadata. None
remains the engine compatibility mode and versioned legacy-artwork fallback.
No new fixture or baseline was accepted, and no release artifact was rebuilt.

Do not resume old weapon, shield, transparency, effect-compositor, executable,
or enemy-outline work unless the user explicitly changes priority.

## First Actions In The Next Task

1. Verify the supplied workspace instead of assuming the old temporary path:

   ```powershell
   git status --short
   git branch --show-current
   git log -5 --oneline
   ```

2. Confirm `codex/form-shading` still contains the safe shade checkpoint based
   on documentation checkpoint `630ddf7`, immediately after `ac860aa`
   (`Add approved Porcupine outlines`).
3. Read `README.md`, `ARCHITECTURE.md`, this file,
   `OUTLINE_RENDERING_PLAN.md`, `ENEMY_OUTLINE_PLAN.md`, and
   `SHADE_RENDERING_PLAN.md`.
4. Inspect the current diff before editing. Do not reset, restore, stash,
   merge, push, accept baselines, or rebuild release artifacts automatically.
5. Confirm the next requested scope. The shade lane is approved and
   checkpointed. Recommended next work is the independent effect/shield
   compositor lane; fixture/baseline or release work still requires separate
   authorization.

## Git State At Handoff

- Completed outline branch: `codex/enemy-outlines`
- Approved shade checkpoint branch: `codex/form-shading`
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
- The shade branch was created from detached documentation checkpoint
  `630ddf7` because `codex/enemy-outlines` remained attached to its isolated
  temporary worktree. Core/None, Form, persistence, UI, export, schema,
  validation, and documentation are contained in the shade checkpoint.

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

## Resolved Pre-Shade Integration Gap

Enemy outline persistence is now integrated across live state, previews,
comparisons, sheets, presets, and ordinary character packs:

- `normalizeAssembledOutlineMode()` accepts valid modes only for assembled
  players and approved enemies;
- `sanitizePreset()` and `sanitizePackEntry()` preserve valid enemy
  `outlineMode` values;
- enemy preset and ordinary-pack load paths restore the saved mode;
- missing or invalid legacy values migrate to None;
- effects remain untreated.

Preset v10 and ordinary-pack v1 already stored `outlineMode`, so this
compatibility repair changes no serialized structure and requires no schema
bump. Direct compatibility assertions cover valid, missing, invalid, and
effect cases.

## Shade Plan Boundary

`SHADE_RENDERING_PLAN.md` remains the canonical authority. Core/None, the
visually approved Form algorithm, review tooling, and unified Player/Enemy
integration are implemented and visually approved. Form is the new/reset
editor default. Fixtures, baselines, and release work remain separately
approval-gated.

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
- no automatic fixture, baseline, manifest, or executable change;
- review effects Off so the deferred effect compositor cannot contaminate the
  visual decision.

## Shade Implementation Sequence

Follow the commit sequence in `SHADE_RENDERING_PLAN.md`.

### 1. Core/None checkpoint

- complete: shared internal pixel-buffer helpers;
- complete: shade mode catalog and normalization;
- complete: public facade entries and assembled-output coordinator;
- complete: direct delegation and broad None parity;
- complete: no visible Form change and no UI.

Current validation passes 288 broad player parity cases, all 9,696 enemy
source frames, and 1,616 sampled enemy outline-combination cases, in addition
to the existing full project validator.

### 2. Form algorithm pilot

- complete and visually approved: pure deterministic material-aware shade
  transform;
- complete: INK, exact white hurt flashes, floor shadows, effects, outlines,
  contact separators, and approved tiny accents are protected;
- complete: `tools/shade-review.mjs` and `npm.cmd run review:shades`;
- complete: 12-specimen material-region comparison against the silhouette-only
  control;
- approved by the user on 2026-07-26; parchment is now the default review
  background while dark remains selectable.

The validator passes 1,728 deterministic Form cases with 94,463 changed
source-owned pixels, 100,335 protected-pixel checks across the three outline
modes, and 21,086 material/control pixel differences. The generated review
covers 576 source frames; `shade-review/` is ignored and is not a baseline.

### 3. Unified player surfaces

Implemented, approved, and checkpointed:

- new/reset Player/Enemy editor documents default to Form;
- versioned legacy preset/pack/recipe fields still sanitize missing or invalid
  shade values to None;
- Player/Enemy selector, comparisons, history, resets, caches, previews, and
  assembled exports preserve Form;
- Effects hides the selector and always delegates untreated;
- undo/redo and cross-mode retention pass browser smoke;
- the live Player + Form surface was visually approved on 2026-07-26.

### 4. Enemy pilot and rollout

Implemented, approved, and checkpointed. All 9,696 enemy source frames pass the full Form
audit, and all 1,616 Form/outline integration cases preserve approved outline
and direct-contact geometry. The live Enemies selector passes browser smoke.

### 5. Packs and schemas

Implemented, approved, and checkpointed:

- preset library v11 migrates v1-v10;
- ordinary pack v2 migrates v1;
- Equipment Variant Batch and Class Pack are v2;
- Complete Character Kit and Complete Character Pack are v11;
- combat-loadout, palette, Master Character Kit, and Master Roster Kit remain
  v1;
- missing/invalid shade values migrate to None;
- atomic component sheets remain untreated and still recompose the original
  renderer pixel-for-pixel.

`npm.cmd run check` passes the full project gate, including assembled
full-sheet, direction-sheet, and animation-sheet shade forwarding. The
production build was intentionally not run because release artifacts remain
outside the approved scope.

## Visual Approval Workflow

- Use the isolated in-app browser for review.
- Keep effects Off during shade comparisons.
- Show native and enlarged nearest-neighbor output.
- Include None, Complete B, and Selective C.
- Review all directions, animations, and frames for the selected pilot.
- Use both dark and parchment review backgrounds without baking either into
  exports.
- Record explicit approval before accepting any visual change.
- The Form algorithm, integration, editor default, commit, and push were
  explicitly authorized on 2026-07-26.

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
