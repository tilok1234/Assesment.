# Project Handoff

Date: 2026-07-20
Workspace: `C:\Users\headc\Documents\8-bit sprite assembler`
Repository: `tilok1234/8-bit-sprite-assembler`

## Current State

- Branch: `codex/optional-sprite-outlines`
- Current committed checkpoint: `aaa7a89` (`Checkpoint equipment outline assessment`), local only
- Remote branch point: `674d926` on `origin/codex/optional-sprite-outlines`
- The local branch is one commit ahead of its upstream.
- The working tree contains reviewed but uncommitted outline/readability implementation and documentation.
- No weapon or shield source artwork has changed in this worktree.
- Do not reset, restore, stash, commit, push, or merge without first showing the exact scope and obtaining approval.

Current changed-file scope before final validation:

- `ARCHITECTURE.md`
- `EQUIPMENT_OUTLINE_ASSESSMENT.md`
- `EQUIPMENT_READABILITY_PLAN.md` (new)
- `HANDOFF.md`
- `OUTLINE_RENDERING_PLAN.md`
- `README.md`
- `WEAPON_READABILITY_PLAN.md`
- `engine/outline-renderer.js`
- `tools/outline-review.mjs`

## Outline Baseline

The current outline implementation is active and is no longer the abandoned experiment described by the old handoff.

- Player modes: None, Complete B, and Selective C.
- None delegates directly to the original renderer and remains the compatibility baseline.
- Equipment uses restrained cardinal contouring, filtered interior cavities, and depth-aware contact separation.
- Front equipment preserves dark facial features by moving a necessary separator to the equipment side.
- Front equipment/headgear contact also places the separator on equipment so headgear pixels remain unchanged.
- Converted contact-separator pixels do not cast a redundant second halo.
- The algorithm is frozen while source-art prototypes are reviewed.

The implementation details and regression contract are in `OUTLINE_RENDERING_PLAN.md`.

## Weapon Reassessment

The full weapon audit was regenerated on 2026-07-20:

- 15 families x 5 tiers = 75 family/tier variants
- 3,600 assembled direction/animation/frame cases
- 37 enlarged and true-native review sheets
- every family/tier source layer remained single-component (`maxComponents=1`)

Visual verdict:

- Current baseline accepted: Sword, Greatsword, Scimitar, Rapier, Dagger, Axe, Mace, Warhammer, Spear, Club, Bow, Staff, Wand, and Spellbook.
- Source-art iteration required: Crossbow T5. It can read like a compact firearm even without a shield.
- Separate later composition issue: Crossbow T2 with a shield.
- Local monitoring only: Mace/Warhammer protrusions and thin Staff/Wand/Dagger/Rapier frames.

Mechanical audit values such as detached distance, expression overlap, and edge contact are diagnostic signals, not automatic art failures.

The canonical sequence is `EQUIPMENT_READABILITY_PLAN.md`. Historical assessment evidence is retained in `EQUIPMENT_OUTLINE_ASSESSMENT.md`.

## Animation Frame-Safety Correction

The user's report that weapon attacks and some hats cut out of the frame was confirmed and corrected on 2026-07-20. Pre-repair evidence:

- 259 of 3,600 weapon frames discard 915 pixels, all during attacks.
- The affected weapon families are Warhammer, Club, Mace, Staff, Axe, Wand, Spellbook, Greatsword, Rapier, Sword, Scimitar, and Spear.
- Dagger, Bow, and Crossbow produced no discarded weapon pixels.
- 37 of 528 headgear cases discard 101 pixels: Wizard hat (33 cases), Plumed helm (3), and Horned helm (1).
- A diagnostic probe without the shared whole-character attack/hurt translation reduced weapon cropping to zero and removed Plumed/Horned helm cropping.
- Wizard hat still cropped because its tip geometry began above the canvas.

Implemented result:

- the pixel buffer exposes an optional diagnostic callback for attempted out-of-canvas writes;
- humanoid attacks keep body, shield, and headgear registered while weapon follow-through/recoil moves one pixel on the safe perpendicular axis;
- Wizard hat tip geometry is fully in-frame; Plumed and Horned helms needed no direct art edit;
- all 3,600 weapon cases and all 528 headgear cases report zero discarded pixels;
- the full project validator, weapon audit, outline review, and browser playback inspection pass;
- an Arcane T5 shield orbit rune uncovered by the new pose tests was moved one pixel clear of the face.

## Runtime Evidence

The existing executable was older than the current source, so `npm.cmd run tauri:build:exe` rebuilt `src-tauri\target\release\sprite-assembler.exe` successfully on 2026-07-20.

The rebuilt executable was tested with the actual selectors and modes. Crossbow T5 remained firearm-like in None, Complete B, and Selective C, including right-facing and down-facing attack views. A non-intrusive in-app browser review reproduced the same result without taking over the Windows desktop. This confirms the outline makes separation clearer but cannot repair the source silhouette.

After the frame-safety correction, `npm.cmd run tauri:build:exe` rebuilt the release executable again at `src-tauri\target\release\sprite-assembler.exe`. The stale earlier process that locked that exact file was closed first; the corrected executable was not launched, because browser playback supplied the requested non-intrusive visual QA.

## Validation Commands

Use the following before proposing another checkpoint:

```powershell
npm.cmd run check
npm.cmd run review:outlines
npm.cmd run review:weapons -- --all-frames
npm.cmd run build
git diff --check
```

The generated `weapon-review/` and `outline-review/` artifacts are review outputs and are intentionally ignored by Git.

## Next Action

1. Preserve local checkpoint `6667c8f`; it was approved and created without pushing.
2. Keep the completed frame-safety implementation separate from weapon source-identity work.
3. Begin the Crossbow T5 source-art prototype only after the user accepts this completed frame-safety pass.
4. Preserve the 24x24 contract, hand attachment, direction mirroring, timing, and unrelated renderer logic.
5. Stop after the Crossbow prototype before considering another tier or shield work.
