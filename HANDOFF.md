# Project Handoff

Date: 2026-07-26

## Canonical Continuation

The enemy-outline, Form-shading, Lantern, and Production Roll v1 phases are
complete. Their rendering, editor, persistence/export compatibility, review,
and validation boundaries are approved on `codex/form-shading`.

The user explicitly approved both the Form algorithm and live integration on
2026-07-26, then selected Form as the new/reset Player/Enemy editor default.
The integration adds shade state, history, comparisons, live previews,
persistence migrations, assembled exports, and pack/recipe metadata. None
remains the engine compatibility mode and versioned legacy-artwork fallback.
No new fixture or baseline was accepted, and no release artifact was rebuilt.

The Lantern Phase 5 content slice is complete at pushed checkpoint
`01b3f1a` (`Add approved Lantern off-hand and production roll plan`). It adds
the visually approved Lantern and its authorized public non-shield `offhand`
integration. The art review and lighter parchment background were approved on
2026-07-26. Presets, ordinary packs, class/equipment planners, complete kits,
the public engine facade, and exact layer recomposition carry the field.

Production Roll Slices 1-5 are complete at pushed checkpoint `aa77666` (`Add
production roll workflow`). The user approved the balanced 120-pair corpus,
Form/Effects Off presentation, no Production-specific outline default, and the
live split-action editor integration on 2026-07-26. `production-v1` is a pure
seeded, deterministic, bounded, immutable policy with catalog/class freeze
guards. The editor exposes **Production Roll** beside **Wildcard Roll**,
applies the resolved player/Form/Effects Off state as one undoable action,
preserves the current outline, and keeps archetype/tier status ephemeral.
Resolved players remain ordinary specifications without stored seed,
archetype, policy, palette-family, or decision metadata.

Slice 6 integration validation and documentation is complete. All automated
and live technical gates pass, and the user gave final integration approval on
2026-07-27. The checkpoint containing this handoff follows `aa77666`.

Do not resume old weapon, shield, transparency, effect-compositor, executable,
or enemy-outline work unless the user explicitly changes priority. Additional
off-hand art also requires a new focused plan and visual approval gate.

## First Actions In The Next Task

1. Verify the supplied workspace instead of assuming the old temporary path:

   ```powershell
   git status --short
   git branch --show-current
   git log -5 --oneline
   ```

2. Confirm `codex/form-shading` contains pushed Production checkpoint
   `aa77666`, based on Lantern/plan checkpoint `01b3f1a`, approved Form
   checkpoint `a4310ec`, and effects-default checkpoint `2a1111f`.
3. Read `README.md`, `ARCHITECTURE.md`, this file,
   `PRODUCTION_ROLL_PLAN.md`,
   `OUTLINE_RENDERING_PLAN.md`, `ENEMY_OUTLINE_PLAN.md`, and
   `SHADE_RENDERING_PLAN.md`.
4. Confirm the Slice 6 checkpoint containing this handoff follows `aa77666`
   and is aligned with its upstream before making new changes.
5. Wait for a new explicit priority. Do not start deferred compatible rerolls,
   provenance, enemy Production rolls, effect-compositor, fixture/baseline,
   release, or Windows-build work.

## Git State At Handoff

- Completed outline branch: `codex/enemy-outlines`
- Approved shade, Lantern, and Production Roll branch:
  `codex/form-shading`
- Approved Production Roll policy/review/editor checkpoint: `aa77666`
  (`Add production roll workflow`)
- `aa77666` is pushed to `origin/codex/form-shading`; Slice 6 starts from that
  clean remote-aligned checkpoint.
- Approved Lantern/plan checkpoint: `01b3f1a`
  (`Add approved Lantern off-hand and production roll plan`)
- `01b3f1a` is an ancestor of `aa77666`.
- Approved Form commit: `a4310ec` (`Add approved Form shading`)
- Final approved enemy-outline commit: `ac860aa`
  (`Add approved Porcupine outlines`)
- Parent transparency checkpoint: `690aec0`
  (`Fix transparent body and Bone shield gaps`)
- `codex/enemy-outlines` is 57 commits ahead of the local
  `codex/optional-sprite-outlines` branch at `690aec0`.
- Compared with `origin/codex/optional-sprite-outlines` at `f21cbe3`, the
  outline branch is 61 commits ahead and has no remote-only commits.
- The outline branch has no configured upstream and has not been pushed.
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

## Approved Lantern Phase 5 Slice

`OFFHAND_ITEMS_PLAN.md` is the authority for the current content slice. The
Lantern is a separate non-shield utility item:

- public `OFFHANDS` ids are `none` and `lantern`;
- shields and utility off-hands are mutually exclusive, with shields winning
  malformed dual-equipped specifications;
- only shields trigger shield-block combat behavior;
- missing or invalid legacy fields migrate to `none`;
- direction-aware `offhand-back` and `offhand-front` passes follow the
  animated left-hand socket;
- outline ownership treats mutually exclusive shield/off-hand passes as one
  logical equipment owner;
- Complete Kit components live at
  `components/offhands/lantern/back.png` and
  `components/offhands/lantern/front.png`.

Format versions are now preset v12, ordinary pack v3, Equipment Variant Batch
and Class Pack v3, Master Character Kit/Roster Kit v2, and Complete Character
Kit/Pack v12. The shared component library is 1912 PNGs, the standalone
Complete Kit is 2139 PNGs, and a 24-player Complete Pack is 2162 PNGs.

The project validator passes all 192 equipped-Lantern
body-build/direction/animation/frame cases with zero out-of-bounds writes,
hand attachment, face clearance, front/back routing, visible difference, and
exact recomposition checks. The interactive review covers three representative
bearers, all four directions, every animation and frame, all outline modes, and
approved Form shading. The review output is ignored evidence, not a baseline.

## Approved Production Roll Phase 5 Slice

`PRODUCTION_ROLL_PLAN.md` is the authority for the completed Production v1
lane:

- immutable profile identity is `{ id: 'production-v1', version: 1 }`;
- portable normalized seeds drive a deterministic PRNG with at most 24
  attempts and one deterministic safe fallback;
- ten existing class templates own outfit and equipment pools;
- one coherent power tier applies to equipped armor, weapon, and shield;
- seven frozen catalog palette families replace independent color selection;
- hidden face/hair choices, head-based species identity, mutually exclusive
  left-hand equipment, and silhouette complexity are validated with stable
  reason codes;
- new catalog or class ids fail freeze audits until explicitly classified;
- `randomPlayer()` remains the unrestricted Wildcard path.

The accepted review contains 120 fixed Production results (12 per class) and
120 same-label Wildcard controls. It audits 11,520 source frames, 34,560
Form/outline cases, deterministic replay, attachment, frame bounds, and zero
discarded writes. The frozen digest is
`af9b620e5ce87f6febf5983487fc163e8b5a4495fb37ced3653e8b5bbbc4ba3f`.
Generated HTML/JSON remains ignored evidence, not a committed fixture or
baseline.

Production editor integration is Player-only. It applies the resolved player,
Form shading, and Effects Off in one history entry while preserving the
current outline. Wildcard and per-category randomizers retain their existing
behavior. Preset v12, ordinary pack v3, Equipment Variant Batch/Class Pack v3,
Master Kit v2, and Complete Kit/Pack v12 remain unchanged; all receive only the
resolved ordinary player specification.

Slice 6 adds the package review command plus focused persistence-boundary,
class-pack, equipment-batch, Complete Kit, Wildcard, schema-version, and 48
assembled-render compatibility guards. The full validator passes 1,000 policy
cases and 29 bounded-fallback cases. The balanced review passes its frozen
120-pair digest. Live browser smoke passes Production/Wildcard history,
preset/pack round-trips, category locality, Player-only mode isolation, and
export-action smoke with no console warnings or errors. The temporary preset
and pack entry were removed, and the original Player document plus all 16
pre-existing enemy pack entries were restored exactly.

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

The approved shade checkpoint originally established:

- preset library v11 migrating v1-v10;
- ordinary pack v2 migrating v1;
- Equipment Variant Batch and Class Pack v2;
- Complete Character Kit and Complete Character Pack v11;
- combat-loadout and palette v1;
- missing/invalid shade values migrate to None;
- atomic component sheets remain untreated and still recompose the original
  renderer pixel-for-pixel.

The later Lantern integration advances only the formats listed in
**Approved Lantern Phase 5 Slice**. It does not change shade semantics.

`npm.cmd run check` passes the full project gate, including assembled
full-sheet, direction-sheet, and animation-sheet shade forwarding and all 192
Lantern cases. The production build was intentionally not run because release
artifacts remain outside the approved scope.

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
- The Lantern art and public integration were explicitly authorized on
  2026-07-26; no additional off-hand family is implied by that approval.
- The Production/Wildcard corpus, Form/Effects Off presentation,
  no-outline-default decision, and live editor integration were explicitly
  authorized on 2026-07-26. Final Slice 6 documentation/compatibility approval
  was explicitly received on 2026-07-27.

## Deferred Independent Lanes

These remain real but are not shade work:

### Effect/shield compositor

This lane is explicitly on ice as of 2026-07-26. Combat overlays are disabled
by default and return to Off whenever the editor starts; users may still enable
the legacy preview manually. That optional path draws resolved effects after
the complete character, so it can look cluttered and can overwrite foreground
shield, equipment, body, or headgear pixels.

A foreground-safe effects-first candidate passed exhaustive automated coverage
and an all-direction pilot review, but it was not visually approved and was
removed from the live worktree rather than promoted into schemas or
documentation as final behavior. Resume only if the user explicitly reopens
the effects lane. Any future attempt still requires an effect-enabled,
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
- `SHADE_RENDERING_PLAN.md`: canonical completed shade design and gates.
- `OFFHAND_ITEMS_PLAN.md`: current approved Lantern contract and future
  off-hand boundaries.
- `PRODUCTION_ROLL_PLAN.md`: completed Production v1 product contract,
  architecture, policy/review/editor slices, and final Slice 6 gate.
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
