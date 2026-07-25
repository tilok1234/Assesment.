# Enemy Outline Plan

Status: exhaustive assessment complete; three-family pilot visually approved;
Frog, Jellyfish, Mole, Scarecrow, and Drake frame-safety repairs visually
approved; Centipede frame-safety repair visually approved; Carnivorous Plant
frame-safety repair visually approved; Mantis frame-safety repair visually
approved.

Date: 2026-07-25
User visual approval: 2026-07-25
Frame-safety group 1 visual approval: 2026-07-25
Frame-safety group 2 visual approval: 2026-07-25
Frame-safety group 3 visual approval: 2026-07-25
Frame-safety group 4 visual approval: 2026-07-25
Frame-safety group 5 visual approval: 2026-07-25
Frame-safety group 6 visual approval: 2026-07-25
Frame-safety group 7 visual approval: 2026-07-25

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

## Frame-Safety Repair Group 1

Approved after live review of Frog and Jellyfish side/front attack motion.

Frog and Jellyfish share the smallest out-of-bounds signature in the audit:
their second side-attack frame used the generic two-pixel lunge and discarded
one active-tip pixel in every variant and side direction. Their front-facing
attack also touched the bottom cell edge.

The candidate repair:

- caps attack translation at one pixel while preserving visible forward motion;
- reshapes the Frog tongue inward so its longest frame still reads as longer;
- pulls the Jellyfish attack sparks inward without merging its detached glow;
- reserves at least one transparent cell on every side in every frame;
- does not enable outlines for either family before visual approval.

Measured candidate result across all 384 Frog/Jellyfish frames:

- zero source-edge contacts;
- zero out-of-bounds writes;
- Frog minimum margins: top 5, right 1, bottom 1, left 1;
- Jellyfish minimum margins: top 2, right 1, bottom 1, left 1.

The exhaustive roster total falls from 538 to 506 edge-contact frames and from
132 to 116 out-of-bounds frames. The remaining failures belong to the other
nine repair families and remain out of scope for this approval gate.

## Frame-Safety Repair Group 2

Approved after live review of Mole's buried attack, eruption follow-through,
and shifted hurt pose.

Mole is the smallest remaining out-of-bounds family. Its buried front attack
wrote an intended eight-pixel mound row below the canvas in all four variants.
The same family also had eight later attack/hurt frames whose rear claws touched
the bottom edge.

The candidate repair:

- keeps one pixel of downward impact in the buried attack;
- places the complete mound row inside the frame instead of discarding it;
- moves only the edge-touching rear claws inward when the pose shifts down;
- preserves at least one transparent cell on every side in every Mole frame;
- does not enable Mole outlines before visual approval.

Measured candidate result across all 192 Mole frames:

- zero source-edge contacts;
- zero out-of-bounds writes;
- minimum margins: top 3, right 1, bottom 1, left 1.

The exhaustive roster total falls again from 506 to 494 edge-contact frames and
from 116 to 112 out-of-bounds frames. The remaining failures belong to Drake,
Centipede, Carnivorous Plant, Mantis, Moth, Octopus, Scarecrow, and Haunted
Puppet.

## Frame-Safety Repair Group 3

Approved after live review of Scarecrow's side-view spinning attack and both
vertical strike poses.

Scarecrow's spinning attack combined its wide arm sweep with the generic
two-pixel attack translation. Across all four variants, this discarded the
side-view hand tip and touched the left/right edge, pushed front-view feet onto
the bottom row, and pulled the back-view hat onto the top row.

The candidate repair:

- caps attack translation at one pixel in all four directions;
- pulls only the side-view spinning hand endpoint inward;
- preserves the full windmill arm sweep and its alternating height;
- reserves one transparent cell on every side in every Scarecrow frame;
- keeps Scarecrow outline enablement as a separate approval gate.

Measured candidate result across all 192 Scarecrow frames:

- zero source-edge contacts;
- zero out-of-bounds writes;
- minimum margins: top 1, right 1, bottom 1, left 1.

The exhaustive roster total falls from 494 to 470 edge-contact frames and from
112 to 104 out-of-bounds frames. The remaining failures belong to Drake,
Centipede, Carnivorous Plant, Mantis, Moth, Octopus, and Haunted Puppet.

## Frame-Safety Repair Group 4

Approved after live review of Drake's full side-view breath, shorter recoil
plume, and front-facing strike.

Drake's side-view fire breath combined with the generic two-pixel attack
translation, discarding the active plume beyond the canvas in both strike
frames. The same translation pushed the front-view feet onto the bottom row.
Its longer surviving breath pose also enclosed a one-cell transparent pocket.

The candidate repair:

- uses a one-pixel strike followed by a centered recoil in all four directions;
- tightens the side-view breath cluster inward and shortens its recoil pose;
- closes the one-cell flame pocket while retaining a detached spark;
- reserves at least one transparent cell on every side in every Drake frame;
- keeps Drake outline enablement as a separate approval gate.

Measured candidate result across all 144 Drake frames:

- zero source-edge contacts;
- zero out-of-bounds writes;
- zero enclosed transparent pockets;
- minimum margins: top 4, right 1, bottom 1, left 1.

The exhaustive roster total falls from 470 to 455 edge-contact frames and from
104 to 92 out-of-bounds frames. The remaining failures belong to Centipede,
Carnivorous Plant, Mantis, Moth, Octopus, and Haunted Puppet.

## Frame-Safety Repair Group 5

Approved after contact-sheet review of Centipede's side strike/recoil, mirrored
attack, vertical attack/idle poses, hurt flash, and walking silhouette across
all four variants.

Centipede's long vertical rig already used nearly the full cell height. Its
idle bob reached the bottom row, its upward hurt recoil touched it again, and
the generic attack translation discarded downward legs and side-view venom.

The candidate repair:

- shifts the complete vertical rig up one cell without shortening any segment;
- uses a one-pixel strike followed by a centered recoil in all directions;
- pulls only the side-view venom tips inward;
- preserves all detached legs and intentional two-cell segment openings;
- reserves at least one transparent cell on every side in every frame;
- keeps Centipede outline enablement as a separate approval gate.

Measured candidate result across all 192 Centipede frames:

- zero source-edge contacts;
- zero out-of-bounds writes;
- detached-component and enclosed-opening counts unchanged;
- minimum margins: top 2, right 1, bottom 1, left 1.

The exhaustive roster total falls from 455 to 419 edge-contact frames and from
92 to 80 out-of-bounds frames. The remaining failures belong to Carnivorous
Plant, Mantis, Moth, Octopus, and Haunted Puppet.

## Frame-Safety Repair Group 6

Approved after contact-sheet review of all four variants covering the side
strike/recoil, mirrored strike, downward strike and idle roots, upward attack
and hurt flash, and walking-root gait.

Carnivorous Plant's generic side/down attack translation discarded one pollen
mote in each side strike and both root tips in each downward strike. Its
centered recoil still touched the edge, and the upward hurt recoil pushed the
roots onto the bottom row.

The candidate repair:

- uses a one-pixel bite followed by a centered recoil in all directions;
- lifts roots only in the downward strike and upward hurt poses that require it;
- leaves the authored four-frame walking-root gait unchanged;
- pulls the side pollen pair inward while preserving two detached diagonal motes;
- preserves the maw, bloom, cavities, and total occupied-pixel count;
- reserves at least one transparent cell on every side in every frame;
- keeps Carnivorous Plant outline enablement as a separate approval gate.

Measured candidate result across all 192 Carnivorous Plant frames:

- zero source-edge contacts;
- zero out-of-bounds writes;
- enclosed-opening counts unchanged;
- minimum margins: top 4, right 1, bottom 1, left 1.

The exhaustive roster total falls from 419 to 391 edge-contact frames and from
80 to 68 out-of-bounds frames. The remaining failures belong to Mantis, Moth,
Octopus, and Haunted Puppet.

## Frame-Safety Repair Group 7

Approved after contact-sheet review of all four variants covering both side
strike frames, mirroring, the downward strike and idle stance, upward strike,
hurt flash, and walking silhouette.

Mantis's generic two-pixel side strike discarded three pixels from each paired
forearm blade, while its recoil discarded one more. The same first-strike
translation put six front-view foot pixels on the bottom row.

The candidate repair:

- uses a one-pixel strike followed by a centered recoil in every direction;
- turns only the upper side blade into a two-pixel cap and folds the lower blade
  diagonally inward;
- keeps the open space between the two forearm scythes connected to the
  exterior instead of creating a new enclosed cavity;
- preserves walking stride, antenna sweep, detached limb pixels, and all four
  variant palettes;
- reserves at least one transparent cell on every side in every frame;
- keeps Mantis outline enablement as a separate approval gate.

Measured candidate result across all 192 Mantis frames:

- zero source-edge contacts;
- zero out-of-bounds writes;
- detached-component and enclosed-opening counts unchanged;
- minimum margins: top 2, right 1, bottom 1, left 1.

The exhaustive roster total falls from 391 to 371 edge-contact frames and from
68 to 52 out-of-bounds frames. The remaining failures belong to Moth, Octopus,
and Haunted Puppet.

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
