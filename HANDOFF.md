# Project Handoff

Date: 2026-07-22
Workspace: `C:\Users\headc\Documents\8-bit sprite assembler`
Repository: `tilok1234/8-bit-sprite-assembler`

## Read This First

The active problem is **not approved shield artwork and not a weapon/shield hand conflict**. The user reports that shields look wrong in the assembler because the default combat-effect preview interacts with them incorrectly.

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
- The branch has one later local-only documentation/review-tooling checkpoint. It is not pushed and deliberately excludes the unapproved effect-direction experiment and generated review artifacts.
- `f21cbe3` remains the safe pushed checkpoint containing the user-approved shield hand attachment/facing work.
- Earlier relevant commits:
  - `f27c63f` (`Improve Crossbow T5 silhouette`)
  - `220c92a` (`Fix equipment animation frame safety`)

Do not reset, restore, stash, commit, push, merge, or accept visual baselines without first showing the exact scope and obtaining approval.

## Current Working Tree

The local-only documentation/review-tooling checkpoint contains:

- all ten repository Markdown documents, reconciled to the current checkpoint, validation counts, release state, object-space shield rule, and unresolved effect/shield integration problem;
- `tools/weapon-readability-audit.mjs`, adding the verified `--tier-sheets` review output;
- `tools/generate-bone-tier3-review.mjs`, preserving the source-only Bone T3 review generator without accepting or publishing its generated candidate images.

Remaining tracked modifications after that checkpoint:

- `engine/effect-renderer.js` - unapproved two-line direction experiment described below.
- `tools/check-project.mjs` - regression checks for that direction experiment.

Remaining untracked generated review artifacts:

- `shield-review/`
- `weapon-review-tier1-focus/`

These 101 generated files are intentional prior work/review artifacts. Preserve them. The `shield-review/` tree includes placement audits, combined-loadout reviews, tier sheets, and Bone T3 candidate sheets.

The mistaken post-checkpoint changes previously made to `engine/renderer.js` and `engine/shield-renderer.js` were fully removed. Both files are clean relative to `f21cbe3`.

## Unapproved Effect-Direction Experiment

There is a current uncommitted change in `engine/effect-renderer.js`:

- left-facing directional effects get their own transform instead of sharing the up-facing transform;
- left-facing impact centers use `[8, 12]` instead of the up-facing `[12, 8]`.

`tools/check-project.mjs` contains 38 added lines asserting that trails and impacts occupy the expected side for all four directions.

This direction correction passes validation and may be independently useful, but it **does not implement the user-requested effect-versus-shield compositing fix**. It was incorrectly presented as though it solved the reported problem. Treat it as an unapproved experiment: inspect it separately and either keep it as a separate scoped fix with approval or remove it. Do not commit it as the shield/effect solution.

## Actual Combined-Preview Problem

The relevant compositor is `drawCompositeFrame` in `app.js`.

Its current order is:

1. draw the complete outlined character with `E.drawOutlinedSprite(...)`;
2. resolve the combat-effect specs;
3. draw every effect afterward with `E.drawSprite(..., { shadow: false, clear: false })`.

Consequently, trails, projectiles, impacts, and status effects can paint directly over the body, headgear, weapon, and shield. The default state is `previewEffects: true`, so this is what the user sees when opening the assembler. `README.md`, `ARCHITECTURE.md`, and `ROADMAP.md` now identify the effects-after-character order as the unresolved compatibility behavior rather than final occlusion guidance; update them again if the compositor contract changes.

The original reported screenshot is:

`C:\Users\headc\AppData\Local\Temp\codex-clipboard-9faa9391-4da7-4521-a3ac-3f93d9d36f2b.png`

It shows `ATTACK - UP` with equipment and effect pixels producing an unacceptable combined result. The user explicitly clarified that the shield is interacting with the **effect**, not the weapon.

The later review image:

`C:\Users\headc\AppData\Local\Temp\sprite-assembler-effects-default-view-fixed.png`

only demonstrates the unapproved left/up direction experiment. It is **not** approval evidence for the compositor issue and must not be presented as the requested fix.

## Correct Next Investigation

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

## Broader Planned Work

Before the combined-preview issue interrupted the sequence, the project had already:

- reassessed all weapon families and tiers;
- corrected weapon/headgear frame clipping;
- reviewed and approved the shield hand/facing work now in `f21cbe3`;
- planned to continue weapon/equipment assessment one item at a time after the assembler integration was trustworthy.

Do not resume the broader weapon sequence until the user-visible default assembler preview is correctly reproduced, fixed, verified, and approved.
