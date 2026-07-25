# Enemy Outline Plan

Status: exhaustive assessment complete; three-family pilot visually approved.

Date: 2026-07-25
User visual approval: 2026-07-25

This lane is isolated on `codex/enemy-outlines` from approved player checkpoint `690aec0`. It does not contain the original worktree's uncommitted attack-animation, effect-direction, or effect-compositor experiments.

## Goal

Add optional None, Complete B, and Selective C treatments to assembled enemies without changing None-mode pixels, filling intentional openings, clipping contours, or silently redrawing the full roster.

Enemy outlines are not player outlines with different input. Player rendering uses body, headgear, weapon, and shield ownership. Enemies are rendered as final monolithic or deliberately disconnected silhouettes, so the enemy treatment uses an exterior-only contour around the exact shadow-free source frame.

## Assessment Baseline

`npm.cmd run review:enemy-outlines` covers:

- 57 enemy families;
- 202 variants;
- all four directions;
- all 12 idle, walk, attack, and hurt frames;
- 9,696 rendered frames total;
- source edge contact, attempted out-of-bounds writes, disconnected components, enclosed openings, and projected None/B/C contour sizes.

Measured baseline:

- 538 frames / 1,882 source pixels already touch the 24x24 edge;
- 132 frames attempt 280 writes outside the frame;
- 5,034 frames contain deliberately disconnected source components;
- 2,218 frames contain 2,966 enclosed transparent components;
- only 14 families currently leave outline-safe source margins in every frame.

The 11 families with actual out-of-bounds source writes are Drake, Frog, Jellyfish, Centipede, Carnivorous Plant, Mantis, Moth, Octopus, Mole, Scarecrow, and Haunted Puppet. These failures predate enemy outlines and must be repaired and visually approved before those families can enter the outline lane.

## Pilot

The first pilot is deliberately limited to three frame-safe families:

- Bandit: compact layered humanoid;
- Scorpion: wide multi-part physical silhouette;
- Elemental: detached magical components.

All pilot variants, directions, animations, and frames must:

- keep None pixel-identical to the direct renderer;
- preserve every colored source pixel in Complete B and Selective C;
- use only `#1a1c2c` for added contour pixels;
- leave no source pixel on the frame edge;
- attempt no out-of-bounds writes;
- keep Complete B and Selective C visibly distinct.

The pilot does not enable outlines for the other 54 families. Unsupported enemies continue to delegate directly to the original renderer in every mode.

## Treatment

- None: direct renderer delegation.
- Complete B: exterior-only eight-neighbor contour.
- Selective C: exterior-only four-neighbor contour.
- Enclosed transparent areas remain transparent.
- Shadows are excluded from the contour source and then composited normally.
- Detached source components remain detached; each receives only its own exterior contour.

## Approval Gate

Approved for Bandit, Scorpion, and Elemental after live comparison of None,
Complete B, and Selective C. This approval does not extend to the remaining
54 enemy families or to the pre-existing frame-edge failures.

Run:

```powershell
npm.cmd run review:enemy-outlines
npm.cmd run review:enemy-outline-pilots
npm.cmd run check
npm.cmd run build
git diff --check
```

Then inspect the three pilot families at native size and enlarged nearest-neighbor scale through every direction and animation. Do not commit, push, enable the remaining roster, or repair frame-edge families until the user explicitly approves the pilot.

## After Pilot Approval

1. Checkpoint the generic enemy contour and pilot evidence.
2. Repair the 11 out-of-bounds families one shared animation signature at a time.
3. Reassess the remaining 43 edge-contact families for one-cell outline room.
4. Add families in small silhouette groups with explicit visual approval.
5. Extend preset/pack persistence only when the enemy outline contract is accepted; the pilot intentionally keeps that schema work out of scope.
