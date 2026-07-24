# Project Handoff

Date: 2026-07-25
Workspace: `C:\Users\headc\Documents\8-bit sprite assembler`
Repository: `tilok1234/8-bit-sprite-assembler`

## 2026-07-25 Current Continuation

The current priority is the newly confirmed systemic transparent-tile problem inside assembled player sprites. The user reported repeated checkerboard strips at the belt/waist in up views and larger vertical gaps in side views, including equipped attack poses.

A read-only reassessment covered 90,336 broad rendered checks and a stricter 62,256-frame persistent-tunnel pass across all directions, animations, frames, body builds, outline modes, weapon tiers, shield tiers, and representative combined equipment. It identified:

- 1,180 high-confidence persistent mid-body body tunnels;
- 242 persistent mixed body/equipment contact groups;
- deliberate leg separation and thousands of intentional weapon/shield openings that must not be blanket-filled.

The canonical implementation sequence, acceptance metrics, protected behavior, and visual gates are in `TRANSPARENT_TILE_REPAIR_PLAN.md`.

The reassessment itself did not modify repository source, accept a baseline, commit, or push. Existing uncommitted renderer, animation, effect-direction, and effect-compositor changes predate the audit and remain unapproved as a combined checkpoint. In particular, the current shoulder connector and loose regression do not eliminate or reliably detect every reported waist tunnel.

Immediate next action after approval: implement the strict repository regression in Phase 0, then produce only the lean up/down torso-attachment candidate from Phase 1A for full None/Complete B/Selective C review.

The older effect/shield investigation below remains relevant history and its dirty files must be preserved, but it is no longer the only active continuation lane.

## Prior Effect/Shield Lane (Preserve)

Before the transparent-tile audit became the current lane, the active problem was **not approved shield artwork and not a weapon/shield hand conflict**. The user reported that shields looked wrong in the assembler because the default combat-effect preview interacted with them incorrectly. The following reproduction rules still apply whenever that dirty compositor candidate is reviewed:

Always reproduce and review this in the same state the user sees by default:

- use the assembler UI, preferably through the isolated in-app browser;
- leave `Overlay preview` **On**;
- use the actual selected weapon, shield, tiers, effect loadout, direction, animation, and frame;
- compare the same frame with effects On and Off only to isolate the cause;
- do not treat an effects-Off review as validation of the reported combined-preview problem.

Do not change already approved shield artwork merely to compensate for a preview-compositor issue.

## Git Checkpoint

- Branch: `codex/optional-sprite-outlines`
- Last pushed checkpoint: `f21cbe3` (`Fix shield hand attachment and facing`).
- Upstream: `origin/codex/optional-sprite-outlines` at `f21cbe3`.
- The branch has two later local-only checkpoints and is currently two commits ahead of upstream:
  - `bc912e4` (`Reconcile docs and preserve review tooling`)
  - `a6b0db1` (`Checkpoint approved weapon and outline pass`)
- Neither local checkpoint is pushed.
- `f21cbe3` remains the safe pushed checkpoint containing the user-approved shield hand attachment/facing work.
- Earlier relevant commits:
  - `f27c63f` (`Improve Crossbow T5 silhouette`)
  - `220c92a` (`Fix equipment animation frame safety`)

Do not reset, restore, stash, commit, push, merge, or accept visual baselines without first showing the exact scope and obtaining approval.

## Current Working Tree

Tracked modifications after `a6b0db1`:

- `app.js` - routes combined effect previews through the uncommitted occlusion compositor.
- `engine/effect-renderer.js` - the unapproved left-facing direction correction described below.
- `engine/renderer.js` - in-progress attack body/foot motion and shoulder-connector work; the transparent-tile audit proves the connector is incomplete.
- `sprite-engine.js` - exports the uncommitted effect compositor.
- `tools/check-project.mjs` - effect, animation, shield, and loose shoulder-gap regressions associated with the dirty experiments.

Untracked source and generated artifacts:

- `engine/effect-compositor.js`
- `shield-review/`
- `weapon-review-tier1-focus/`

The new transparency plan and this handoff update are documentation-only additions. Preserve all pre-existing dirty files and generated review artifacts. Do not reset, restore, stash, commit, or push them as part of the plan-writing task.

## Unapproved Effect-Direction Experiment

There is a current uncommitted change in `engine/effect-renderer.js`:

- left-facing directional effects get their own transform instead of sharing the up-facing transform;
- left-facing impact centers use `[8, 12]` instead of the up-facing `[12, 8]`.

`tools/check-project.mjs` contains 38 added lines asserting that trails and impacts occupy the expected side for all four directions.

This direction correction passes validation and may be independently useful, but it **does not implement the user-requested effect-versus-shield compositing fix**. It was incorrectly presented as though it solved the reported problem. Treat it as an unapproved experiment: inspect it separately and either keep it as a separate scoped fix with approval or remove it. Do not commit it as the shield/effect solution.

## Prior Combined-Preview Problem And Current Dirty Candidate

The relevant compositor is `drawCompositeFrame` in `app.js`.

At the committed checkpoint its order is:

1. draw the complete outlined character with `E.drawOutlinedSprite(...)`;
2. resolve the combat-effect specs;
3. draw every effect afterward with `E.drawSprite(..., { shadow: false, clear: false })`.

Consequently, trails, projectiles, impacts, and status effects can paint directly over the body, headgear, weapon, and shield.

The current dirty candidate changes step 3: transient effects route through `engine/effect-compositor.js`, which masks pixels owned by the foreground or background shield layers, while status effects remain a foreground overlay. This candidate is present in `app.js`, `sprite-engine.js`, `engine/effect-compositor.js`, and associated `tools/check-project.mjs` checks. It is not part of the transparent-tile plan and must remain independently reviewable.

The default state is `previewEffects: true`. `README.md`, `ARCHITECTURE.md`, and `ROADMAP.md` still describe the committed effects-after-character behavior; update them only if the dirty compositor contract is separately approved.

The original reported screenshot is:

`C:\Users\headc\AppData\Local\Temp\codex-clipboard-9faa9391-4da7-4521-a3ac-3f93d9d36f2b.png`

It shows `ATTACK - UP` with equipment and effect pixels producing an unacceptable combined result. The user explicitly clarified that the shield is interacting with the **effect**, not the weapon.

The later review image:

`C:\Users\headc\AppData\Local\Temp\sprite-assembler-effects-default-view-fixed.png`

only demonstrates the unapproved left/up direction experiment. It is **not** approval evidence for the compositor issue and must not be presented as the requested fix.

## Prior Effect/Shield Investigation Sequence

Work one small verified step at a time:

1. Start from `f21cbe3` plus the preserved dirty files above.
2. Open the built assembler in the isolated browser with its default effect overlay On.
3. Reproduce the original problem using the exact loadout visible in the screenshot or the user's current selection. Inspect every attack frame in all four directions.
4. Toggle effects Off only for a direct same-frame comparison. Confirm which pixels belong to the approved shield and which belong to the effect.
5. Decide the required component-aware draw order or occlusion rule before editing. Do not assume that moving every effect behind the whole character is correct: trails, projectiles, impacts, and status effects may need different ownership/front-back behavior.
6. Apply the narrow compositor/effect change. Do not redesign the shield or alter approved shield silhouettes.
7. Add a regression that exercises the combined preview behavior, not merely the standalone effect sheet. At minimum, prove that the intended foreground shield pixels are not incorrectly overwritten in the affected frames while the effect remains visible in its intended area.
8. Run the browser review again with effects On by default. Check all four attack frames in down, left, right, and up views. Show the result and wait for explicit visual approval.
9. Only after approval: rebuild the standalone executable, verify hashes/release checks, then ask before committing and pushing.

The user prefers isolated browser verification because launching or controlling the desktop executable disrupts their computer. Do not use desktop control unless explicitly requested.

## Current Executable

The standalone executable was rebuilt after the direction-only experiment:

- Path: `src-tauri\target\release\sprite-assembler.exe`
- Last write: `2026-07-22 00:08:39` local time
- Size: `3,689,984` bytes
- SHA-256: `6D2B3674C87005E6D9FF27FBA29521D236B08FBC719A060E32FDB9CA4F02DFE2`

It contains the unapproved direction experiment but **not** the requested effect/shield compositor fix. The NSIS installer was not rebuilt for this state. Do not describe the current executable as containing the requested fix.

## Latest Validation Evidence

After the direction-only experiment:

- `npm.cmd run check` passed.
- `npm.cmd run check:release` passed 37 assertions against the available release artifacts.
- `git diff --check` passed.
- `engine/effect-renderer.js` and `dist/engine/effect-renderer.js` were byte-identical after the build.

These structural checks do not constitute visual approval of the combined effect/shield result.

## Documentation Audit

All ten project Markdown documents were read and reconciled on 2026-07-22:

- `README.md`
- `ARCHITECTURE.md`
- `ROADMAP.md`
- `HANDOFF.md`
- `OUTLINE_RENDERING_PLAN.md`
- `EQUIPMENT_OUTLINE_ASSESSMENT.md`
- `EQUIPMENT_READABILITY_PLAN.md`
- `WEAPON_READABILITY_PLAN.md`
- `WINDOWS_RELEASE.md`
- `asset-pack/README.md`

The audit removed stale local-only checkpoint claims, replaced Bone T3 as the immediate priority with the actual effect/shield integration blocker, corrected the historical 5,520-case gate to the current 11,280 weapon-plus-shield validation scope, replaced obsolete edge-on shield language with the approved object-space broad-face rule, distinguished standalone and installer artifacts, and marked effects-after-character compositing as unresolved rather than approved guidance.

Recommended commands after the actual compositor fix:

```powershell
npm.cmd run check
npm.cmd run build
git diff --check
npm.cmd run tauri:build:exe
npm.cmd run check:release
```

Do not run outline-baseline acceptance or rewrite golden files automatically. Existing outline baseline drift remains an approval gate.

## Earlier Broader Planned Work

Before the combined-preview issue interrupted the sequence, the project had already:

- reassessed all weapon families and tiers;
- corrected weapon/headgear frame clipping;
- reviewed and approved the shield hand/facing work now in `f21cbe3`;
- planned to continue weapon/equipment assessment one item at a time after the assembler integration was trustworthy.

The weapon and outline pass was later checkpointed locally at `a6b0db1`. The current continuation is now the transparent-tile repair plan at the top of this handoff. Do not restart deferred shield source-art redesigns or merge them into the transparency work.
