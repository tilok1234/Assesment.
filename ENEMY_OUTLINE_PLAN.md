# Enemy Outline Plan

Status: exhaustive assessment complete; three-family pilot visually approved;
Frog, Jellyfish, Mole, Scarecrow, and Drake frame-safety repairs visually
approved; Centipede frame-safety repair visually approved; Carnivorous Plant
frame-safety repair visually approved; Mantis frame-safety repair visually
approved; Moth frame-safety repair visually approved; Octopus frame-safety
repair visually approved; Haunted Puppet frame-safety repair visually
approved; shared quadruped frame-safety repair visually approved; shared
quadruped outline expansion visually approved; Crocodile, Turtle, and Griffin
frame-safety repair visually approved; armored beast outline expansion visually
approved; Slime and Shroom frame-safety repair visually approved; Slime and
Shroom outline expansion visually approved; shared enemy-staff frame-safety
repair visually approved; Golem frame-safety repair visually approved; Treant
frame-safety repair visually approved; Worm frame-safety repair visually
approved; Beetle frame-safety and directional silhouette repair visually
approved; Bandit, Kobold, Skeleton, Ratfolk, Elf, and Gnoll hybrid
component-aware outlines visually approved; Harpy exterior outline expansion
visually approved; Eye Monster separated-component outline expansion visually
approved; Crab separated-component outline expansion visually approved;
Beetle separated-component outline expansion visually approved; Wasp
separated-component outline expansion visually approved; Mimic exterior
outline expansion visually approved; Drake outline-native source rework and
outline expansion visually approved; Bat, Ghost, Golem, and Snake clean
exterior outline batch visually approved; Frog, Jellyfish, Scarecrow, and
Gargoyle separated-component outline batch visually approved; Worm, Mantis,
Moth, and Haunted Puppet tiny-accent outline batch visually approved; Spider
and Treant separated-anatomy outline batch visually approved. Centipede and
Mole cavity-preserving separated-component outline batch visually approved.
Carnivorous Plant outline-native neck repair and cavity-preserving outline
expansion visually approved. Octopus separated-component, full-tentacle outline
expansion visually approved. Cyclops vertical-strike frame-safety repair and
exterior outline expansion are visually approved. Troll vertical-strike
frame-safety repair and exterior outline expansion are visually approved.
Dwarf vertical-strike frame-safety repair and cavity-preserving
component-aware outline expansion are visually approved. Ogre vertical-strike
frame-safety repair and cavity-preserving component-aware outline expansion
are visually approved. Goblin vertical-strike frame-safety repair and
cavity-preserving component-aware outline expansion are visually approved.
Orc Berserker vertical-strike and Warlord horned-helm frame-safety repairs with
cavity-preserving component-aware outlines are visually approved. Lizardfolk
Marsh vertical-strike repair and segmented-tail-aware, cavity-preserving
component outlines are visually approved.
Zombie vertical-strike frame-safety repair and cavity-preserving
component-aware outline expansion are visually approved. Imp vertical-strike
frame-safety repair and cavity-preserving component-aware outline expansion
are visually approved. Cultist Oracle headgear frame-safety repair and
cavity-preserving component-aware outline expansion are visually approved.

Date: 2026-07-25
User visual approval: 2026-07-25
Frame-safety group 1 visual approval: 2026-07-25
Frame-safety group 2 visual approval: 2026-07-25
Frame-safety group 3 visual approval: 2026-07-25
Frame-safety group 4 visual approval: 2026-07-25
Frame-safety group 5 visual approval: 2026-07-25
Frame-safety group 6 visual approval: 2026-07-25
Frame-safety group 7 visual approval: 2026-07-25
Frame-safety group 8 visual approval: 2026-07-25
Frame-safety group 9 visual approval: 2026-07-25
Frame-safety group 10 visual approval: 2026-07-25
Frame-safety group 11 visual approval: 2026-07-25
Outline rollout group 1 visual approval: 2026-07-25
Frame-safety group 12 visual approval: 2026-07-25
Outline rollout group 2 visual approval: 2026-07-25
Frame-safety group 13 visual approval: 2026-07-25
Outline rollout group 3 visual approval: 2026-07-25
Frame-safety group 14 visual approval: 2026-07-25
Frame-safety group 15 visual approval: 2026-07-25
Frame-safety group 16 visual approval: 2026-07-25
Frame-safety group 17 visual approval: 2026-07-25
Beetle down-view visual approval: 2026-07-25
Frame-safety group 18 visual approval: 2026-07-25
Hybrid outline group 1 visual approval: 2026-07-25
Hybrid outline group 2 visual approval: 2026-07-25
Hybrid outline group 3 visual approval: 2026-07-25
Hybrid outline group 4 visual approval: 2026-07-25
Hybrid outline group 5 visual approval: 2026-07-25
Hybrid outline group 6 visual approval: 2026-07-25
Outline rollout group 4 visual approval: 2026-07-25
Outline rollout group 5 visual approval: 2026-07-25
Outline rollout group 6 visual approval: 2026-07-25
Outline rollout group 7 visual approval: 2026-07-25
Outline rollout group 8 visual approval: 2026-07-25
Outline rollout group 9 visual approval: 2026-07-25
Outline rollout group 10 visual approval: 2026-07-26
Outline rollout group 11 visual approval: 2026-07-26
Outline rollout group 12 visual approval: 2026-07-26
Outline rollout group 13 visual approval: 2026-07-26
Outline rollout group 14 visual approval: 2026-07-26
Outline rollout group 15 visual approval: 2026-07-26
Outline rollout group 16 visual approval: 2026-07-26
Outline rollout group 17 visual approval: 2026-07-26
Outline rollout group 18 visual approval: 2026-07-26
Outline rollout group 19 visual approval: 2026-07-26
Outline rollout group 20 visual approval: 2026-07-26
Outline rollout group 21 visual approval: 2026-07-26
Outline rollout group 22 visual approval: 2026-07-26
Outline rollout group 23 visual approval: 2026-07-26
Outline rollout group 24 visual approval: 2026-07-26
Outline rollout group 25 visual approval: 2026-07-26
Outline rollout group 26 visual approval: 2026-07-26
Outline rollout group 27 visual approval: 2026-07-26

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

## Frame-Safety Repair Group 8

Approved after contact-sheet review of all four variants covering both side
strike frames, mirrored dust, downward and upward attacks, both widest vertical
walking poses, and the hurt flash.

Moth's generic two-pixel strike discarded detached side-view dust, put its
upward antennae on the top row, and pushed one downward dust mote onto the
bottom row. Its widest vertical walking pose also placed the two detached wing
tips on the left and right edges even though the wing bodies remained safe.

The candidate repair:

- uses a one-pixel strike followed by a centered recoil in every direction;
- folds only the side-attack dust positions inward while preserving five
  visibly detached motes;
- preserves the complete four-frame wing spread and moves only the two
  detached peak-spread tips inward;
- restores all previously discarded dust pixels without creating cavities;
- reserves at least one transparent cell on every side in every frame;
- keeps Moth outline enablement as a separate approval gate.

Measured candidate result across all 192 Moth frames:

- zero source-edge contacts;
- zero out-of-bounds writes;
- zero enclosed openings before and after the repair;
- all 24 previously discarded detached dust pixels are now visible;
- minimum margins: top 1, right 1, bottom 1, left 1.

The exhaustive roster total falls from 371 to 339 edge-contact frames and from
52 to 36 out-of-bounds frames. The remaining failures belong to Octopus and
Haunted Puppet.

## Frame-Safety Repair Group 9

Approved after focused contact-sheet review of all four variants covering both
side strike frames, mirrored strike, both downward strike frames, and the
upward hurt flash.

Octopus's generic side strike discarded the reaching tentacle cap and nearest
ink mote in both strike frames. Its first downward strike discarded four
bottom tips and placed twelve more pixels on the bottom row; the recoil and
first upward hurt pose also consumed the bottom margin.

The candidate repair:

- uses a one-pixel strike followed by a centered recoil in every direction;
- folds only the side strike cap and nearest ink mote inward while preserving
  all three detached ink motes;
- lifts only the four bottom tips during the first downward strike and the two
  central tips during the first upward hurt pose;
- preserves the complete walking gait, multi-tentacle silhouette, all 80
  intentional enclosed openings, and every variant palette;
- reserves at least one transparent cell on every side in every frame;
- keeps Octopus outline enablement as a separate approval gate.

Measured candidate result across all 192 Octopus frames:

- zero source-edge contacts;
- zero out-of-bounds writes;
- enclosed openings unchanged at 72 frames / 80 components, maximum area 8;
- all 48 previously discarded draw operations now resolve inside the frame;
- minimum margins: top 4, right 1, bottom 1, left 1.

The exhaustive roster total falls from 339 to 311 edge-contact frames and from
36 to 16 out-of-bounds frames. The only remaining out-of-bounds family is
Haunted Puppet.

## Frame-Safety Repair Group 10

Approved after contact-sheet review of all four variants covering both side
strike frames, mirrored strike, both downward strike frames, upward strike, and
both hurt directions.

Haunted Puppet's generic whole-rig translation discarded the side hand tip,
pushed both wooden feet outside the first downward strike, and pulled both
suspension lights above the first upward strike. The recoil and opposite hurt
poses also consumed the top or bottom outline margin.

The candidate repair:

- uses a one-pixel strike followed by a centered recoil in every direction;
- folds only the side strike hand tip inward;
- lowers only the two suspension lights during the first upward strike and
  downward hurt recoil;
- lifts only the two wooden feet during the first downward strike and upward
  hurt recoil;
- preserves the alternating arm slash, complete walking gait, detached strings
  and joints, and all four variant palettes;
- reserves at least one transparent cell on every side in every frame;
- keeps Haunted Puppet outline enablement as a separate approval gate.

Measured candidate result across all 192 Haunted Puppet frames:

- zero source-edge contacts;
- zero out-of-bounds writes;
- zero enclosed openings before and after the repair;
- all 40 previously discarded draw operations now resolve inside the frame;
- minimum margins: top 1, right 1, bottom 1, left 1.

The exhaustive roster total falls from 311 to 275 edge-contact frames and from
16 to zero out-of-bounds frames. No enemy family now attempts to draw outside
the 24x24 source cell.

## Frame-Safety Repair Group 11

Approved after live review of Wolf, Boar, Bear, and Big Cat attack motion.

These four families share `drawQuad`. Their only remaining frame-edge contacts
occur in the first attack strike:

- Wolf: 9 frames / 30 edge pixels;
- Boar: 9 frames / 30 edge pixels;
- Bear: 9 frames / 36 edge pixels;
- Big Cat: 4 frames / 16 edge pixels.

The generic first-strike two-pixel lunge places the front paws on the bottom
edge in the down view and the longer Wolf, Boar, and Bear snouts on the side
edge. Big Cat already has a shorter side silhouette.

The candidate repair:

- retains a one-pixel forward first strike;
- centers the second strike as a visible recoil;
- leaves the authored body, legs, snouts, tails, markings, and all non-attack
  frames unchanged;
- reserves at least one transparent cell on every side in all four families;
- does not enable their outlines before visual approval.

Measured candidate result across all 624 shared-quadruped frames:

- zero source-edge contacts;
- zero out-of-bounds writes;
- minimum margins: Wolf, Boar, and Bear top 6, right 1, bottom 1, left 1;
- minimum margins: Big Cat top 5, right 2, bottom 1, left 2;
- every variant and direction retains distinct first-strike and recoil frames.

The exhaustive roster total falls from 275 to 244 edge-contact frames,
with out-of-bounds writes remaining at zero.

## Outline Rollout Group 1

Approved after live comparison of None, Complete B, and Selective C for Wolf,
Boar, Bear, and Big Cat.

Following approval of their frame-safety repair, these four shared quadruped
families are the first expansion beyond the original three-family outline
pilot. Across all 624 quadruped frames, the candidate must:

- keep None pixel-identical to the direct renderer;
- preserve every colored source pixel in Complete B and Selective C;
- add only `#1a1c2c` contour pixels;
- keep enclosed transparency transparent;
- leave no source or contour pixel outside the 24x24 frame;
- keep Complete B and Selective C visibly distinct.

Measured candidate result:

- 624 None-mode parity checks pass;
- all 1,872 None/B/C mode cases preserve their source pixels;
- Complete B and Selective C differ in all 624 frames;
- zero source-edge frames and zero out-of-bounds writes.

This candidate does not enable outlines for any of the remaining 50 enemy
families.

## Frame-Safety Repair Group 12

Approved after live review of Crocodile, Turtle, and Griffin attack motion.

These three dedicated renderers share the same remaining contact signature:
their first two-pixel attack strike reaches the side edge with the forward
snout or head and the bottom edge with the down-facing feet.

The candidate repair:

- retains a one-pixel first strike followed by a centered recoil;
- preserves the authored bite, shell, wing, leg, and walk animation geometry;
- changes no idle, walk, or hurt frame;
- reserves at least one transparent cell on every side in all three families;
- leaves their outline enablement for a separate approval gate.

Measured result across all 576 Crocodile, Turtle, and Griffin frames:

- zero source-edge contacts;
- zero out-of-bounds writes;
- minimum margins: Crocodile top 4, right 1, bottom 1, left 1;
- minimum margins: Turtle and Griffin top 5, right 1, bottom 1, left 1;
- distinct first-strike and recoil frames in every variant and direction;
- exhaustive roster contacts fall from 244 frames / 920 pixels to
  208 frames / 776 pixels.

## Outline Rollout Group 2

Approved after live comparison of None, Complete B, and Selective C for
Crocodile, Turtle, and Griffin.

Following approval of their frame-safety repair, these three dedicated families
are the second expansion beyond the original outline pilot. Across all 576
frames, the candidate must:

- keep None pixel-identical to the direct renderer;
- preserve every colored source pixel in Complete B and Selective C;
- add only `#1a1c2c` contour pixels;
- keep enclosed transparency transparent;
- leave no source or contour pixel outside the 24x24 frame;
- keep Complete B and Selective C visibly distinct.

Measured candidate result:

- 576 None-mode parity checks pass;
- all 1,728 None/B/C mode cases preserve their source pixels;
- Complete B and Selective C differ in all 576 frames;
- zero source-edge frames and zero out-of-bounds writes.

This candidate does not enable outlines for any of the remaining 47 enemy
families.

## Frame-Safety Repair Group 13

Approved after live review of Slime and Shroom down-facing attack motion.

These two grounded families have the smallest remaining vertical contact
signature. Only their first down-facing attack strike touches the bottom edge:
7 Slime frames / 56 pixels and 4 Shroom frames / 16 pixels.

The candidate repair:

- retains a one-pixel downward first strike followed by a centered recoil;
- changes no side or up attack translation;
- preserves Slime deformation and Shroom gait, cap, face, and spore geometry;
- changes no idle, walk, or hurt frame;
- reserves at least one transparent cell on every side in both families;
- leaves their outline enablement for a separate approval gate.

Measured result across all 528 Slime and Shroom frames:

- zero source-edge contacts;
- zero out-of-bounds writes;
- minimum margins: Slime top 9, right 5, bottom 1, left 5;
- minimum margins: Shroom top 2, right 5, bottom 1, left 5;
- distinct first-strike and recoil frames in every variant and direction;
- exhaustive roster contacts fall from 208 frames / 776 pixels to
  197 frames / 704 pixels.

## Outline Rollout Group 3

Approved after live comparison of None, Complete B, and Selective C for Slime
and Shroom.

Following approval of their frame-safety repair, these two compact grounded
families are the third expansion beyond the original outline pilot. Across all
528 frames, the candidate must:

- keep None pixel-identical to the direct renderer;
- preserve every colored source pixel in Complete B and Selective C;
- add only `#1a1c2c` contour pixels;
- keep enclosed transparency transparent;
- leave no source or contour pixel outside the 24x24 frame;
- keep Complete B and Selective C visibly distinct.

Measured approved result:

- 528 None-mode parity checks pass;
- all 1,584 None/B/C mode cases preserve their source pixels;
- Complete B and Selective C differ in all 528 frames;
- zero source-edge frames and zero out-of-bounds writes.

This candidate does not enable outlines for any of the remaining 45 enemy
families.

## Frame-Safety Repair Group 14

Approved after live review of the shared up-facing enemy-staff strike used by
Elf Mage, Skeleton Mage, Kobold Sorcerer, and Ratfolk Plague.

These four families had the smallest remaining edge signature: only the two
raised-staff strike frames touched the top source row, at two pixels per frame.
The shared compatibility staff focus now sits one cell lower while retaining
the full shaft, focus, sparks, and two-frame attack motion.

The same shared geometry also improves the staff variants in Goblin, Imp,
Cultist, Ogre, Lizardfolk, and Demon without claiming those families as
outline-safe; their unrelated head, horn, or foot contacts remain for later
passes.

Measured result:

- all 720 frames across Elf, Skeleton, Kobold, and Ratfolk reserve one
  transparent source cell on every side;
- their minimum margins are top 1, right 1, bottom 2, left 1;
- all 22 up-facing staff strike layers across the eleven staff-bearing enemy
  variants reserve the top outline row;
- zero out-of-bounds writes across the 9,696-frame enemy roster;
- exhaustive roster contacts fall from 197 frames / 704 pixels to
  177 frames / 660 pixels.

This approved repair does not enable outlines for these four families.

## Frame-Safety Repair Group 15

Approved after live review of Golem's down-facing first attack strike and
centered recoil across Stone, Lava, and Ice variants.

Golem's heavy arm swing already carries the attack. Only the generic
two-pixel whole-rig lunge placed its six foot pixels on the bottom source row.
The candidate keeps a one-pixel first strike, centers the recoil, and changes
no authored body, arm, crack, eye, idle, walk, or hurt geometry.

Measured result across all 144 Golem frames:

- zero source-edge contacts;
- zero out-of-bounds writes;
- minimum margins: top 4, right 4, bottom 1, left 4;
- distinct first-strike and recoil frames in every direction and variant;
- exhaustive roster contacts fall from 177 frames / 660 pixels to
  174 frames / 642 pixels.

This approved repair does not enable Golem outlines.

## Frame-Safety Repair Group 16

Approved after live review of Treant's down-facing first attack strike and
centered recoil across Oak, Willow, and Blighted variants.

Treant's broad branch sweep already supplies the attack motion. Only the
generic two-pixel whole-rig lunge placed eight root pixels on the bottom source
row. The candidate keeps a one-pixel first strike, centers the recoil, and
changes no authored canopy, branch, root, face, idle, walk, or hurt geometry.

Measured result across all 144 Treant frames:

- zero source-edge contacts;
- zero out-of-bounds writes;
- minimum margins: top 2, right 3, bottom 1, left 3;
- distinct first-strike and recoil frames in every direction and variant;
- exhaustive roster contacts fall from 174 frames / 642 pixels to
  171 frames / 618 pixels.

This approved repair does not enable Treant outlines.

## Frame-Safety Repair Group 17

Approved after live review of Worm's down-facing first attack strike and
centered recoil across Dirt, Frost, and Magma variants.

Worm's body wiggle and open maw already distinguish its attack frames. Only the
generic two-pixel whole-rig lunge placed ten ground and body pixels on the
bottom source row. The candidate keeps a one-pixel first strike, centers the
recoil, and changes no authored body, maw, soil, idle, walk, or hurt geometry.

Measured result across all 144 Worm frames:

- zero source-edge contacts;
- zero out-of-bounds writes;
- minimum margins: top 7, right 5, bottom 1, left 5;
- distinct first-strike and recoil frames in every direction and variant;
- exhaustive roster contacts fall from 171 frames / 618 pixels to
  168 frames / 588 pixels.

This approved repair does not enable Worm outlines.

## Frame-Safety Repair Group 18

Approved after live review of Beetle's mirrored side strike, foreshortened
front/down silhouette, and matching back/up silhouette across Scarab, Stag, and
Bomber variants.

Beetle's horn extension and alternating legs already distinguish its attack
frames. Only the generic two-pixel whole-rig lunge placed the horn tip on the
left or right source edge, one pixel per side-facing strike per variant. The
candidate keeps a one-pixel first strike, centers the recoil, and uses each
variant's own highlight for the front strike antennae. The down view now turns
the same shell, smaller eye-bearing head, antenna, and three leg pairs toward
the camera with a foreshortened frontal game-sprite angle instead of a literal
top-down rotation or the old rear-facing pear silhouette.
The up view now mirrors that depth from behind: the broad rear shell overlaps
the smaller eye-free head and its paired antennae recede away from the viewer.
Both corrected vertical silhouettes are shared consistently by idle, walk,
attack, and hurt while the approved side views remain unchanged.

Measured result across all 144 Beetle frames:

- zero source-edge contacts;
- zero out-of-bounds writes;
- minimum margins: top 3, right 1, bottom 1, left 1;
- distinct first-strike and recoil frames in every direction and variant;
- a side-consistent down silhouette with two visible eyes and palette-colored
  forward antennae in both strike frames;
- a matching back silhouette with an eye-free recessed head and two receding
  palette-colored antennae;
- exhaustive roster contacts fall from 168 frames / 588 pixels to
  162 frames / 582 pixels.

This approved repair does not enable Beetle outlines.

## Hybrid Outline Rollout Group 1

Approved after live comparison of None, Complete B, and Selective C across
Bandit's Thug, Brigand, and Sniper variants, including front, side, and rear
equipment contacts.

The current enemy treatment remains appropriate for monolithic beasts and
detached magical creatures, but a single exterior contour flattens layered
humanoids into one owner. Bandit is the narrow proof that humanoid enemies can
reuse the renderer's existing body, headgear, weapon, and shield ownership
passes without changing their source art or enabling another family.

The candidate:

- keeps None as direct, pixel-identical renderer delegation;
- retains exterior-only contours for every other approved enemy;
- contours Bandit's body and held weapon as separate logical owners;
- adds a one-pixel separator on the body/headgear side of direct foreground
  equipment contact while preserving the weapon's colored core;
- keeps back-pass equipment separated by its authored occlusion instead of
  consuming thin weapon pixels;
- preserves Complete B as the stronger eight-neighbor exterior treatment and
  Selective C as the lighter four-neighbor treatment;
- changes no Bandit geometry, palette, animation, equipment placement, catalog,
  saved state, or export schema.

Measured candidate result across the full twelve-family approved outline lane:

- 2,160 None-mode parity checks pass;
- all 6,480 None/B/C cases remain frame-safe;
- Complete B and Selective C differ in all 2,160 frames;
- 962 validated body-side Bandit equipment-contact separator pixels across the
  two outlined modes;
- zero source-edge frames and zero out-of-bounds writes.

This approved group remains limited to Bandit. Another humanoid family still
requires its own frame-safety evidence, exhaustive regression pass, and live
visual approval.

## Hybrid Outline Rollout Group 2

Approved after live comparison of None, Complete B, and Selective C across
Kobold's Skirmisher, Trapper, and Sorcerer variants, including the raised
up-facing staff and side-facing spear strike.

Kobold is the next component-aware stress test because its compact shared
humanoid rig combines a projecting snout with Spear, Dagger, and Staff
equipment. Its previously approved frame-safety repair already reserves one
transparent source cell on every side, including the Sorcerer's raised
up-facing staff strikes.

The candidate:

- enables None, Complete B, and Selective C for Kobold without changing another
  previously unsupported enemy;
- reuses the approved Bandit body/headgear/weapon ownership treatment;
- keeps the Skirmisher's spear, Trapper's dagger, and Sorcerer's staff colored
  cores intact at direct front contacts;
- preserves authored rear-equipment occlusion in up and mirrored side views;
- changes no Kobold geometry, snout, palette, animation, equipment placement,
  catalog, saved state, or export schema.

Measured candidate result across the thirteen-family outline lane:

- 2,304 None-mode parity checks pass;
- all 6,912 None/B/C cases remain frame-safe;
- Complete B and Selective C differ in all 2,304 frames;
- 1,558 validated Kobold body-side equipment-contact separator pixels across
  the two outlined modes, in addition to Bandit's approved 962;
- zero source-edge frames and zero out-of-bounds writes.

This approved group remains limited to Kobold. Another humanoid family still
requires its own frame-safety evidence, exhaustive regression pass, and live
visual approval.

## Hybrid Outline Rollout Group 3

Approved after live comparison of None, Complete B, and Selective C across all
five Skeleton variants, including the unequipped Grunt and Bone Lord's dense
Axe/Round shield attack.

Skeleton is the first component-aware enemy stress test with both deliberately
open body construction and equipped shields. Its Grunt control has no
equipment, while Knight, Mage, Archer, and Bone Lord cover Sword/Kite,
Staff, Bow, and Axe/Round combinations. The previously approved shared staff
repair already reserves the outline margin in Mage's raised up-facing strike.

The candidate:

- enables None, Complete B, and Selective C for Skeleton without changing
  another previously unsupported enemy;
- preserves every unequipped Grunt bone/body source pixel and all authored
  rib, skull, limb, and leg openings;
- separates Knight and Bone Lord shields from the body using the existing
  front/back ownership passes without consuming the colored shield face;
- keeps Sword, Staff, Bow, and Axe cores intact at direct front contacts;
- preserves rear equipment occlusion and the lighter Selective C treatment;
- changes no Skeleton geometry, palette, animation, equipment placement,
  catalog, saved state, or export schema.

Measured candidate result across the fourteen-family outline lane:

- 2,544 None-mode parity checks pass;
- all 7,632 None/B/C cases remain frame-safe;
- Complete B and Selective C differ in all 2,544 frames;
- 1,724 validated Skeleton body-side equipment-contact separator pixels across
  the two outlined modes;
- zero source-edge frames and zero out-of-bounds writes.

This approved group remains limited to Skeleton. Another humanoid family still
requires its own frame-safety evidence, exhaustive regression pass, and live
visual approval.

## Hybrid Outline Rollout Group 4

Approved after live comparison of None, Complete B, and Selective C across
Ratfolk's Skulker, Plague, and Blade variants, including the raised staff,
mirrored side weapon strikes, and independently contoured tail.

Ratfolk adds a new ownership risk: its three-pixel tail belongs to the body
silhouette while Dagger, Staff, and Sword belong to the weapon owner. The
Skulker, Plague, and Blade variants all use the compact humanoid rig, and the
previously approved shared staff repair already reserves the top outline row in
Plague's raised up-facing attack.

The candidate:

- enables None, Complete B, and Selective C for Ratfolk without changing
  another previously unsupported enemy;
- preserves and independently contours every authored tail pixel in front,
  rear, and mirrored side views;
- keeps Dagger, Staff, and Sword colored cores intact at direct body/headgear
  contacts;
- preserves the Plague hood, snout, eye, rear weapon occlusion, and Selective C
  breathing room;
- changes no Ratfolk geometry, palette, animation, equipment placement,
  catalog, saved state, or export schema.

Measured candidate result across the fifteen-family outline lane:

- 2,688 None-mode parity checks pass;
- all 8,064 None/B/C cases remain frame-safe;
- Complete B and Selective C differ in all 2,688 frames;
- 1,582 validated Ratfolk body-side equipment-contact separator pixels across
  the two outlined modes;
- zero source-edge frames and zero out-of-bounds writes.

This approved group remains limited to Ratfolk. Another humanoid family still
requires its own frame-safety evidence, exhaustive regression pass, and live
visual approval.

## Hybrid Outline Rollout Approved Group 5

Live visual approval received for Elf.

Elf is the first component-aware family whose head silhouette depends on both
pointed ears and long or ponytail hair. Ranger, Mage, Duelist, and Dark Elf
cover Bow, Staff, Sword, and Dagger contacts, while Ranger's hood and Mage's
raised up-facing staff exercise the existing headgear and repaired frame-margin
rules.

The approved rollout:

- enables None, Complete B, and Selective C for Elf without changing another
  previously unsupported enemy;
- preserves both two-pixel pointed-ear cores and all non-contact hair/headgear
  source pixels;
- keeps Bow, Staff, Sword, and Dagger colored cores intact at direct
  body/headgear contacts;
- preserves rear weapon occlusion, ponytail/long-hair silhouettes, and
  Selective C breathing room;
- changes no Elf geometry, palette, animation, equipment placement, catalog,
  saved state, or export schema.

Measured candidate result across the sixteen-family outline lane:

- 2,880 None-mode parity checks pass;
- all 8,640 None/B/C cases remain frame-safe;
- Complete B and Selective C differ in all 2,880 frames;
- 1,712 validated Elf body-side equipment-contact separator pixels across the
  two outlined modes;
- zero source-edge frames and zero out-of-bounds writes.

This approved group remains limited to Elf. Another family still requires its
own frame-safety evidence, exhaustive regression pass, and live visual
approval.

## Hybrid Outline Rollout Approved Group 6

Live visual approval received for Gnoll.

Gnoll is the next frame-safe unsupported humanoid family in the current
assessment. Raider, Hunter, and Alpha cover Axe, Bow, and Sword contacts while
the shared spiky hair, paired beast ears, projecting muzzle, and bright Alpha
eyes make facial-detail preservation directly reviewable.

The approved rollout:

- enables None, Complete B, and Selective C for Gnoll without changing another
  previously unsupported enemy;
- preserves both paired beast ears and the two-pixel muzzle core in both
  outlined modes;
- keeps Axe, Bow, and Sword colored cores intact at direct body contacts;
- preserves spiky-hair silhouettes, rear weapon occlusion, and Selective C
  breathing room;
- changes no Gnoll geometry, palette, animation, equipment placement, catalog,
  saved state, or export schema.

Measured candidate result across the seventeen-family outline lane:

- 3,024 None-mode parity checks pass;
- all 9,072 None/B/C cases remain frame-safe;
- Complete B and Selective C differ in all 3,024 frames;
- 1,208 validated Gnoll body-side equipment-contact separator pixels across the
  two outlined modes;
- zero source-edge frames and zero out-of-bounds writes.

This approved group remains limited to Gnoll. Another family still requires
its own frame-safety evidence, exhaustive regression pass, and live visual
approval.

## Outline Rollout Approved Group 4

Live visual approval received for Harpy.

Harpy is the last frame-safe unsupported humanoid family in the current
assessment, but it does not carry held equipment. Screecher, Storm, and Blood
instead stress a single exterior contour around long hair, paired wings, arms,
and legs without introducing interior ownership separators.

The approved rollout:

- enables None, Complete B, and Selective C for Harpy without changing another
  previously unsupported enemy;
- preserves every authored source pixel, including all wing tips and long-hair
  ends, in both outlined modes;
- contours both outer wing edges while leaving the wing/body join free of
  artificial interior seams;
- keeps Complete B and Selective C visibly distinct across every Harpy frame;
- changes no Harpy geometry, palette, animation, catalog, saved state, or
  export schema.

Measured candidate result across the eighteen-family outline lane:

- 3,168 None-mode parity checks pass;
- all 9,504 None/B/C cases remain frame-safe;
- Complete B and Selective C differ in all 3,168 frames;
- Harpy contributes 11,739 Complete B and 10,053 Selective C exterior-outline
  pixels across its 144 source frames;
- zero source-edge frames and zero out-of-bounds writes.

This approved group remains limited to Harpy. Another family still requires its
own frame-safety evidence, exhaustive regression pass, and live visual
approval.

## Outline Rollout Approved Group 5

Live visual approval received for Eye Monster.

Eye Monster is the first outline candidate whose main body is accompanied by
three one-pixel orbiting source components in every frame. The first generic
contour attempt visually welded those orbitals back onto the eye, so this
candidate uses a family-gated separated-component contour that removes only
cross-owner outline bridges while leaving all previously approved families
pixel-identical.

The approved rollout:

- enables None, Complete B, and Selective C for Watcher, Doom, and Void without
  changing another previously unsupported enemy;
- preserves the main eye and all three orbiting source cores in every frame;
- keeps all four cardinally disconnected source components disconnected after
  both outline modes;
- preserves the one-cell breathing gaps instead of filling them with shared
  outline bridges;
- changes no Eye Monster geometry, palette, animation, catalog, saved state,
  or export schema.

Measured candidate result across the nineteen-family outline lane:

- 3,312 None-mode parity checks pass;
- all 9,936 None/B/C cases remain frame-safe;
- Complete B and Selective C differ in all 3,312 frames;
- 288 exhaustive Eye Monster outlined-frame component checks preserve the
  source component count;
- Eye Monster contributes 6,048 Complete B and 3,744 Selective C outline pixels
  across its 144 source frames;
- zero source-edge frames and zero out-of-bounds writes.

This approved group remains limited to Eye Monster. Another family still
requires its own frame-safety evidence, exhaustive regression pass, and live
visual approval.

## Outline Rollout Group 6

Approved after live comparison of Crab's revised front and side outlines in
Complete B and Selective C across Shore, Rock, and Sapphire.

Crab is the next unsupported family after the already approved Scorpion in
roster order. Its front/back frames contain nine authored components and its
side frames contain five. The generic contour collapsed every one of the 144
Crab frames into a single mass, so this candidate extends the approved
separated-component path to Crab and removes any outline islands stranded by
bridge suppression. Live review of the first candidate found that surrounding
each one-pixel leg segment with its own halo made the diagonal legs read as
blocky black feet. The revised candidate contours only the connected shell and
claw mass while leaving those authored leg pixels unchanged.

The candidate:

- enables None, Complete B, and Selective C for Shore, Rock, and Sapphire
  without changing another previously unsupported enemy;
- preserves all five-to-nine authored body, claw, and leg components in every
  direction, animation, and frame;
- keeps both body/leg gaps transparent while retaining outer claw-tip contours;
- leaves every one-pixel leg segment unhaloed in both outline modes so the
  diagonal leg rhythm remains thin and readable;
- removes separated outline pixels that are no longer connected to their own
  source component;
- changes no Crab geometry, palette, animation, catalog, saved state, or export
  schema.

Measured candidate result across the twenty-family outline lane:

- 3,456 None-mode parity checks pass;
- all 10,368 None/B/C cases remain frame-safe;
- Complete B and Selective C differ in all 3,456 frames;
- 288 exhaustive Crab outlined-frame component checks preserve each frame's
  five-to-nine source components;
- 288 additional outlined-frame checks prove that every one-pixel Crab leg
  segment remains unhaloed;
- Crab contributes 6,972 Complete B and 5,172 Selective C outline pixels across
  its 144 source frames;
- zero source-edge frames and zero out-of-bounds writes.

This approved group remains limited to Crab. Another family still requires its
own frame-safety evidence, exhaustive regression pass, and live visual approval.

## Outline Rollout Group 7

Approved after live front, back, and side comparison of Beetle's revised
outlines in Complete B and Selective C across Scarab, Stag, and Bomber.

Beetle is the next unsupported family after Crab in roster order. Its repaired
front/back and side silhouettes contain three-to-six authored components. The
generic contour collapsed every one of the 144 Beetle frames into a single
mass, which made the thin legs and attack antennae read as black blocks instead
of separated appendages.

The candidate:

- enables None, Complete B, and Selective C for Scarab, Stag, and Bomber
  without changing another previously unsupported enemy;
- preserves the already approved front, back, and mirrored side geometry;
- contours the connected shell plus the meaningful three-pixel attack
  antenna/horn-tip components;
- leaves every one- and two-pixel leg component unhaloed so the legs remain
  thin and visually separated;
- preserves each frame's original three-to-six connected source components;
- changes no Beetle geometry, palette, animation, catalog, saved state, or
  export schema.

Measured candidate result across the twenty-one-family outline lane:

- 3,600 None-mode parity checks pass;
- all 10,800 None/B/C cases remain frame-safe;
- Complete B and Selective C differ in all 3,600 frames;
- 288 exhaustive Beetle outlined-frame component checks preserve each frame's
  three-to-six source components;
- 288 additional outlined-frame checks prove that every one- or two-pixel
  Beetle leg component remains unhaloed;
- Beetle contributes 6,432 Complete B and 4,620 Selective C outline pixels
  across its 144 source frames;
- zero source-edge frames and zero out-of-bounds writes.

The approved treatment was reviewed structurally and directionally in the live
assembler across front, back, and side attacks.

## Outline Rollout Group 8

Approved after live front, back, and side comparison of Wasp's revised outlines
in Complete B and Selective C across Yellowjacket, Hornet, and Royal.

Wasp is the next unsupported family after Beetle in roster order. Half of its
144 source frames contain detached geometry: the raised side-view wing is an
eleven-pixel component, while the stinger chain uses deliberately separated
one-pixel tips. Treating the whole frame as one contour risks visually welding
the raised wing back onto the body or turning each stinger pixel into a black
block.

The candidate:

- enables None, Complete B, and Selective C for Yellowjacket, Hornet, and Royal
  without changing another previously unsupported enemy;
- contours the connected body and every meaningful detached wing component;
- preserves the transparent breathing room below the raised side-view wing;
- leaves every one-pixel stinger segment unhaloed so the attack tip remains
  narrow and directional;
- preserves each frame's original one-to-four connected source components;
- changes no Wasp geometry, palette, animation, catalog, saved state, or export
  schema.

Measured candidate result across the twenty-two-family outline lane:

- 3,744 None-mode parity checks pass;
- all 11,232 None/B/C cases remain frame-safe;
- Complete B and Selective C differ in all 3,744 frames;
- 288 exhaustive Wasp outlined-frame component checks preserve each frame's
  one-to-four source components;
- 288 additional outlined-frame checks prove that every one-pixel Wasp stinger
  component remains unhaloed;
- Wasp contributes 8,088 Complete B and 6,180 Selective C outline pixels across
  its 144 source frames;
- zero source-edge frames and zero out-of-bounds writes.

The approved treatment was reviewed structurally and directionally in the live
assembler across front, back, and side attacks.

## Outline Rollout Group 9

Approved after live closed and open front, rear, and side comparison of Mimic's
outlines in Complete B and Selective C across Wooden, Royal, and Cursed.

Mimic is the next unsupported family after Wasp in roster order. All 144 source
frames form one connected silhouette with no enclosed transparent cavities,
source-edge contact, or out-of-bounds writes. Even the furthest down-facing
attack retains one source pixel of bottom margin, which leaves exactly enough
room for its exterior contour.

The candidate:

- enables None, Complete B, and Selective C for Wooden, Royal, and Cursed
  without changing another previously unsupported enemy;
- uses the normal exterior-only contour because every closed and open chest
  frame is a single connected source component;
- preserves the closed lid and latch, the raised attack lid, the front teeth
  and tongue, and the featureless rear interior;
- keeps the front, back, and mirrored side silhouettes distinct;
- changes no Mimic geometry, palette, animation, catalog, saved state, or
  export schema.

Measured candidate result across the twenty-three-family outline lane:

- 3,888 None-mode parity checks pass;
- all 11,664 None/B/C cases remain frame-safe;
- Complete B and Selective C differ in all 3,888 frames;
- 288 exhaustive Mimic outlined-frame component checks preserve one connected
  chest silhouette in every direction, animation, and frame;
- Mimic contributes 6,648 Complete B and 5,424 Selective C outline pixels
  across its 144 source frames;
- zero source-edge frames and zero out-of-bounds writes.

The approved treatment was reviewed structurally and directionally in the live
assembler across closed idle frames and open front, back, and side attacks.

## Outline Rollout Candidate Group 10

Visually approved after separate live review of the rebuilt side source and the
front/rear spread- and folded-wing attack frames.

Drake is the next unsupported family after Mimic in roster order. Its earlier
frame-safety repair already reserves at least one transparent source cell on
every side. A fresh post-repair audit confirms zero source-edge contacts, zero
out-of-bounds writes, zero enclosed transparent pockets, and minimum margins
of top 4, right 1, bottom 1, and left 1 across all 144 source frames.

Every front/rear Drake frame now uses one cardinally connected physical source
component. Both horns have authored bases attached to the head, and a two-pixel
neck joins the head to the torso through every wing pose. This replaces the
floating head, detached one-pixel horns, shared-outline bridges, and the
outline-only neck-corner repair that caused visible contour flicker between
spread and folded attack frames.

The side source required a real geometry rework rather than another outline
exception. Its tail was split into diagonal two-pixel and one-pixel components,
its horn tip was diagonally detached, and its head floated above the torso.
Partially outlining those pieces produced checkerboard gaps; outlining every
piece produced a chunky black knot. The rebuilt side source uses a cardinal
staircase from tail into torso, fills the enclosed tail/wing pocket, connects an
L-shaped horn to the head, and joins the head to the body with a two-pixel
neck. Body, tail, wing, neck, head, and horn are consequently one physical
component in every side frame, so both outline modes can contour the authored
silhouette directly.

The candidate:

- enables None, Complete B, and Selective C for Ember, Frost, and Verdant
  without changing another previously unsupported enemy;
- rebuilds the front/rear horn bases and neck as connected source geometry;
- rebuilds the left/right tail, horn, and neck as connected source geometry
  with no enclosed transparent pocket;
- contours every physical Drake pose as one normal source component with no
  component bridge or family-specific contour repair;
- leaves only the deliberate one-pixel side breath spark unhaloed;
- keeps None as a direct render of the intentionally rebuilt source;
- derives both front/rear neck-corner outlines naturally from the connected
  source in matching spread and folded attack frames;
- gives both side directions a normal continuous B/C contour without a
  family-specific side repair mask;
- retains the repaired one-pixel strike, centered recoil, and full side-breath
  contour without reaching outside the 24x24 frame;
- preserves every rendered source pixel in both outline modes;
- changes no Drake palette, animation timing, catalog, saved state, or export
  schema.

Measured candidate result across the twenty-four-family outline lane:

- 4,032 None-mode parity checks pass;
- all 12,096 None/B/C cases remain frame-safe;
- Complete B and Selective C differ in all 4,032 frames;
- 144 exhaustive Drake source-frame checks prove that every physical pose is
  one cardinal component; only 12 side-attack frames retain the deliberate
  detached breath spark;
- 288 exhaustive Drake outlined-frame checks prove that no outline component
  bridge is needed and that the detached spark remains unhaloed;
- 48 targeted natural neck-corner assertions cover both outlined modes, both
  front/rear directions, both spread frames, both corner pixels, and all three
  variants;
- 72 exhaustive side-frame checks prove that body, tail, wing, neck, head, and
  horn remain one physical source component across both mirrored directions,
  all twelve animation frames, and all three variants;
- 12 targeted side-idle checks prove the exact rebuilt structural cells and
  single-component silhouette in both mirrored directions and all variants;
- Drake contributes 12,837 Complete B and 10,308 Selective C outline pixels
  across its 144 source frames;
- zero source-edge frames, zero out-of-bounds writes, and zero enclosed source
  cavities.

The completed source rework was reviewed structurally and directionally in the
live assembler across front, rear, and side attacks. The stable neck contour,
connected horn bases, side silhouette, and frame-to-frame outline continuity
are approved.

## Outline Rollout Candidate Group 11

Visually approved as one focused batch covering Bat, Ghost, Golem, and Snake.

These four families are the clean fast-path group from the remaining roster.
Across their fourteen variants and 672 source frames, every pose is already one
cardinally connected component, no source pixel touches the frame edge, no
write leaves the 24x24 frame, and no enclosed transparent cavity is present.
They therefore use the normal exterior-only contour without component
ownership, minimum-size filtering, bridge pixels, repair masks, or source-art
changes.

The candidate:

- enables None, Complete B, and Selective C for all Bat, Ghost, Golem, and
  Snake variants without changing another unsupported family;
- preserves every None-mode pixel and all existing palette, direction,
  animation, catalog, saved-state, and export behavior;
- adds no family-specific renderer or outline exception;
- validates all 672 source frames as a single connected silhouette;
- adds a focused `--families` filter to the existing review generator so future
  clean batches can be approved from one compact comparison sheet while the
  unfiltered exhaustive review continues to protect the complete accepted
  outline lane.

Measured candidate result across the twenty-eight-family outline lane:

- 4,704 None-mode parity checks pass;
- all 14,112 None/B/C cases remain frame-safe;
- Complete B and Selective C differ in all 4,704 frames;
- 1,344 batch-specific outlined-frame checks retain one connected silhouette;
- the focused four-family review covers 672 source frames / 2,016 mode cases
  and adds 39,616 Complete B plus 31,020 Selective C contour pixels;
- zero source-edge frames and zero out-of-bounds writes.

The focused comparison sheet covers every variant in the batch across front,
back, left, and right attack poses. Its connected silhouettes and both outline
modes are approved.

## Outline Rollout Approved Group 12

Visually approved as one focused batch covering Frog, Jellyfish, Scarecrow,
and Gargoyle.

These four families are frame-safe and cavity-free, but some attack poses
contain deliberately detached source components. A single generic contour
would either halo tiny attack accents into black blocks or weld physically
separate anatomy back onto the body. The candidate therefore reuses the
approved separated-component contour with a minimum meaningful component size
chosen from the authored geometry of each family.

The candidate:

- enables None, Complete B, and Selective C for all Frog, Jellyfish,
  Scarecrow, and Gargoyle variants without changing another unsupported
  family;
- leaves Frog's detached two-pixel tongue tip unhaloed while contouring every
  component of three pixels or more;
- leaves Jellyfish's one-pixel attack sparks and Scarecrow's one-pixel straw
  flecks unhaloed while contouring components of two pixels or more;
- outlines Gargoyle's detached eleven-to-seventeen-pixel wings as meaningful
  anatomy without bridging them onto the body;
- preserves every authored source component and every None-mode pixel;
- changes no source art, palette, animation, catalog, saved state, or export
  schema;
- adds a focused attack-frame selector to the review generator so frame 3
  exposes all three tiny-accent cases and the Gargoyle wing separation in one
  compact comparison sheet.

Measured candidate result across the thirty-two-family outline lane:

- 5,424 None-mode parity checks pass;
- all 16,272 None/B/C cases remain frame-safe;
- Complete B and Selective C differ in all 5,424 frames;
- 1,440 batch-specific outlined-frame checks preserve authored component
  separation and apply each family's minimum-size rule;
- the focused four-family review covers 720 source frames / 2,160 mode cases
  and adds 57,304 Complete B plus 45,944 Selective C contour pixels;
- zero source-edge frames, zero out-of-bounds writes, and zero enclosed source
  cavities.

The focused comparison sheet uses attack frame 3 across front, back, left, and
right directions. The detached attack accents, separated Gargoyle wings, and
both outline modes are approved.

## Outline Rollout Approved Group 13

Visually approved as one focused batch covering Worm, Mantis, Moth, and
Haunted Puppet.

These four families are frame-safe and cavity-free, but their silhouettes use
one-pixel source components for dirt, feet, blades, antennae, dust, strings,
lights, and joints. Haloing those accents would turn the animation's thinnest
details into black blocks. The candidate reuses the separated-component
contour while reserving normal outlines for the main body and Puppet's
meaningful detached attack arm.

The candidate:

- enables None, Complete B, and Selective C for all Worm, Mantis, Moth, and
  Haunted Puppet variants without changing another unsupported family;
- leaves Worm's two one-pixel dirt specks unhaloed in every frame;
- leaves Mantis's one- and two-pixel detached extremities unhaloed while
  contouring its connected physical body;
- leaves Moth's one-pixel antenna, foot, and attack-dust components unhaloed;
- leaves Puppet's one-pixel strings, lights, joints, and slash accents
  unhaloed while contouring its detached eleven-pixel attack arm;
- preserves every authored source component and every None-mode pixel;
- changes no source art, palette, animation, catalog, saved state, or export
  schema.

Measured candidate result across the thirty-six-family outline lane:

- 6,144 None-mode parity checks pass;
- all 18,432 None/B/C cases remain frame-safe;
- Complete B and Selective C differ in all 6,144 frames;
- 1,440 batch-specific outlined-frame checks preserve authored component
  separation and apply each family's minimum-size rule;
- the focused four-family review covers 720 source frames / 2,160 mode cases
  and adds 52,088 Complete B plus 41,064 Selective C contour pixels;
- zero source-edge frames, zero out-of-bounds writes, and zero enclosed source
  cavities.

The focused comparison sheet uses attack frame 2 across front, back, left, and
right directions. The thin source accents, Puppet's detached attack arm, and
both outline modes are approved.

## Outline Rollout Approved Group 14

Visually approved as one focused batch covering Spider and Treant.

These are the final unsupported families with zero source-edge contact, zero
out-of-bounds writes, and zero enclosed transparent cavities. Both use
meaningful disconnected anatomy, but at opposite scales: Spider alternates
between many tiny detached leg clusters, while Treant carries a large detached
canopy plus one-pixel branch and leaf tips.

The candidate:

- enables None, Complete B, and Selective C for all Spider and Treant variants
  without changing another unsupported family;
- contours Spider's connected body while leaving every detached one-to-eight
  pixel leg, fang, and appendage component unhaloed;
- uses the same nine-pixel Spider threshold through all four attack frames so
  the alternating two- and eight-pixel leg clusters do not gain and lose
  halos between poses;
- contours Treant's detached forty-eight-to-fifty-four-pixel canopy as
  meaningful anatomy while leaving one-pixel leaf tips unhaloed;
- preserves every authored source component and every None-mode pixel;
- changes no source art, palette, animation, catalog, saved state, or export
  schema.

Measured candidate result across the thirty-eight-family outline lane:

- 6,480 None-mode parity checks pass;
- all 19,440 None/B/C cases remain frame-safe;
- Complete B and Selective C differ in all 6,480 frames;
- 672 batch-specific outlined-frame checks preserve authored component
  separation and apply each family's minimum-size rule;
- the focused two-family review covers 336 source frames / 1,008 mode cases
  and adds 19,972 Complete B plus 16,418 Selective C contour pixels;
- zero source-edge frames, zero out-of-bounds writes, and zero enclosed source
  cavities.

All four Spider attack frames received a separate visual continuity pass. The
focused handoff sheet uses attack frame 2 across front, back, left, and right
directions. Spider's thin-leg continuity, Treant's separated canopy, and both
outline modes are approved.

## Outline Rollout Approved Group 15

Visually approved as one focused batch covering Centipede and Mole.

These are the smallest remaining cavity-bearing families. Both are frame-safe
after their approved source repairs, but their silhouettes combine a connected
body with one-pixel detached legs, dirt, or motion accents. Their authored
transparent holes are sometimes enclosed by more than one source component, so
per-component contouring must explicitly preserve the combined silhouette's
cavities.

The candidate:

- enables None, Complete B, and Selective C for all Centipede and Mole variants
  without changing another unsupported family;
- contours components of two pixels or more while leaving all one-pixel leg,
  dirt, and motion accents unhaloed;
- contours Mole's meaningful detached thirteen-pixel attack claws;
- preserves all 192 two-pixel Centipede cavities and all 376 one-to-three-pixel
  Mole cavities in both outline modes;
- preserves every authored source component and every None-mode pixel;
- changes no source art, palette, animation, catalog, saved state, or export
  schema.

Measured candidate result across the forty-family outline lane:

- 6,864 None-mode parity checks pass;
- all 20,592 None/B/C cases remain frame-safe;
- Complete B and Selective C differ in all 6,864 frames;
- 768 batch-specific outlined-frame checks preserve authored component
  separation, minimum-size rules, and source cavities;
- the focused two-family review covers 384 source frames / 1,152 mode cases
  and adds 20,208 Complete B plus 16,032 Selective C contour pixels;
- zero source-edge frames and zero out-of-bounds writes.

The focused handoff sheet uses attack frame 3 across front, back, left, and
right directions so Centipede's repeated openings and Mole's detached attack
claws can be reviewed together. Their cavity continuity, thin detached accents,
meaningful attack-claw contours, and both outline modes are approved.

## Outline Rollout Approved Group 16

Visually approved as a single-family Carnivorous Plant pass.

Carnivorous Plant is the smaller of the two frame-safe families left after
Group 15. Its source uses one-pixel pollen and root tips, meaningful
three-to-four-pixel stepping roots, and sixteen walk frames with an enclosed
three-pixel opening. The original bob also moved the center stalk down while
keeping the flower base stationary, detaching the full head from the body for
one idle frame and two walk frames per variant/direction. Per-component
outlining made that neck break visibly blink.

The candidate:

- keeps the flower's vertical bob but extends the root-anchored center stalk to
  row 15, adding four connecting stem pixels in each of the 48 affected source
  frames;
- enables None, Complete B, and Selective C for all four Carnivorous Plant
  variants without changing another unsupported family;
- contours components of three pixels or more, including meaningful stepping
  roots, and also contours low one-pixel root tips so the side-view legs do not
  look truncated, while leaving one-pixel pollen unhaloed;
- preserves all sixteen authored three-pixel walk cavities in both outline
  modes;
- adds a regression that prevents the plant's head and body from becoming
  separate large components again;
- adds an optional comparison-animation selector to the review generator so
  idle frame 2 and walk frame 4 can be inspected directly instead of relying
  only on attack poses;
- changes no palette, catalog, saved state, or export schema.

Measured candidate result across the forty-one-family outline lane:

- 7,056 None-mode parity checks pass against the corrected source renderer;
- all 21,168 None/B/C cases remain frame-safe;
- Complete B and Selective C differ in all 7,056 frames;
- 384 batch-specific outlined-frame checks preserve authored component
  separation, the three-pixel minimum-size rule plus the low root-tip
  exception, source cavities, and the connected physical body;
- the focused single-family review covers 192 source frames / 576 mode cases
  and adds 15,232 Complete B plus 11,080 Selective C contour pixels;
- zero source-edge frames and zero out-of-bounds writes.

Three focused handoff sheets cover idle frame 2 for neck continuity, walk frame
4 for the enclosed opening and stepping roots, and attack frame 2 for the open
maw and pollen accents. The corrected neck continuity, complete side-view root
outlines, preserved cavities, pollen restraint, and both outline modes are
approved.

## Outline Rollout Approved Group 17

Visually approved as a single-family Octopus pass.

Octopus is the final unsupported family whose corrected source is already
frame-safe. Its animation deliberately separates broad tentacles, tiny low
tentacle tips, and one-to-two-pixel ink droplets. It also contains eighty
narrow transparent tentacle gaps across seventy-two frames. The first
candidate preserved those gaps, but visual review requested a fuller tentacle
outline, so the revised candidate treats the gaps as internal contour channels.

The candidate:

- enables None, Complete B, and Selective C for all four Octopus variants
  without changing another unsupported family;
- contours detached components of ten pixels or more so meaningful exterior
  tentacle groups receive complete per-component outlines;
- also contours low one-pixel components at row 19 or below so physical
  tentacle tips remain readable, while leaving the upper one-to-two-pixel ink
  droplets unhaloed;
- fills every two-, five-, and eight-pixel tentacle gap with the selected
  outline color so the tentacles receive continuous internal borders in both
  outline modes;
- adds regressions for detached-part coverage, the ten-pixel threshold, the
  low tentacle-tip exception, ink restraint, complete tentacle-gap contouring,
  None parity, and frame safety;
- changes no source art, palette, catalog, saved state, or export schema.

Measured candidate result across the forty-two-family outline lane:

- 7,248 None-mode parity checks pass against the corrected source renderer;
- all 21,744 None/B/C cases remain frame-safe;
- Complete B and Selective C differ in all 7,248 frames;
- 384 Octopus-specific outlined-frame checks enforce the ten-pixel
  detached-part rule, the low tentacle-tip exception, ink restraint, and full
  contours through every narrow tentacle gap;
- the focused single-family review covers 192 source frames / 576 mode cases
  and adds 15,608 Complete B plus 12,008 Selective C contour pixels;
- the complete lane adds 505,658 Complete B plus 398,815 Selective C contour
  pixels;
- zero source-edge frames and zero out-of-bounds writes.

Four focused handoff sheets cover idle frame 1 for the broad underside gap,
walk frame 1 for detached tentacle groups, walk frame 4 for the narrow
side-view opening, and attack frame 2 for low tentacle tips and loose ink.
Their separated contours, complete internal tentacle borders, restrained
droplets, and both outline modes are approved.

## Outline Rollout Approved Group 18

Visually approved as a single-family Cyclops pass.

After Octopus approval, fifteen enemy families remained outside the outline
lane. A fresh assessment ranked Cyclops as the smallest clean repair: all 144
source frames form one connected component, but the Shepherd's club touched
the bottom or top canvas row in down/up attack frames 2 and 3. Those four
frames contributed eight edge pixels and had no out-of-bounds writes.

The candidate:

- gives only the Cyclops Shepherd's vertical club strike a one-pixel inset,
  moving the down strike upward and the up strike downward while preserving
  distinct strike and recoil frames;
- reduces the full enemy corpus from 162 to 158 source-edge frames and from
  582 to 574 source-edge pixels, with out-of-bounds writes remaining zero;
- enables None, Complete B, and Selective C for all three Cyclops variants
  without changing another unsupported family;
- uses the exterior-only outline path because every Cyclops source frame is
  connected; an attempted humanoid component-outline treatment was rejected
  after it recolored non-contact source pixels;
- preserves every authored source pixel in both outline modes, including all
  96 enclosed openings across 91 frames;
- adds all 144 Cyclops frames to the source-margin regression plus focused
  weapon-layer checks for both repaired directions and strike phases;
- changes no palette, catalog, saved state, or export schema.

Measured candidate result across the forty-three-family outline lane:

- 7,392 None-mode parity checks pass against the corrected source renderer;
- all 22,176 None/B/C cases remain frame-safe;
- Complete B and Selective C differ in all 7,392 frames;
- the focused single-family review covers 144 source frames / 432 mode cases
  and adds 10,621 Complete B plus 9,164 Selective C contour pixels;
- the complete lane adds 516,279 Complete B plus 407,979 Selective C contour
  pixels;
- zero source-edge frames and zero out-of-bounds writes.

Two focused handoff sheets cover attack frames 2 and 3 across front, back,
left, and right directions. They expose the repaired Shepherd club margins,
the distinct strike/recoil poses, all three Cyclops silhouettes, and both
outline modes. The repaired margins and exterior outline treatment are
approved.

## Outline Rollout Approved Group 19

Visually approved as a single-family Troll pass.

After Cyclops approval, fourteen enemy families remained outside the outline
lane. Troll is the next smallest clean repair: all 144 source frames form one
connected component, but the Cave Troll's club touches the bottom or top
canvas row in down/up attack frames 2 and 3. Those four frames contribute
eight edge pixels and have no out-of-bounds writes.

The approved pass:

- gives only the Cave Troll's vertical club strike the same one-pixel inset as
  the approved Cyclops Shepherd repair, moving the down strike upward and the
  up strike downward while preserving distinct strike and recoil frames;
- reduces the full enemy corpus from 158 to 154 source-edge frames and from
  574 to 566 source-edge pixels, with out-of-bounds writes remaining zero;
- enables None, Complete B, and Selective C for all three Troll variants
  without changing another unsupported family;
- uses the exterior-only outline path because every Troll source frame is
  connected;
- preserves every authored source pixel in both outline modes, including all
  149 enclosed openings across 118 frames;
- adds all 144 Troll frames to the source-margin regression plus focused
  weapon-layer checks for both repaired directions and strike phases;
- changes no palette, catalog, saved state, or export schema.

Measured result across the forty-four-family outline lane:

- 7,536 None-mode parity checks pass against the corrected source renderer;
- all 22,608 None/B/C cases remain frame-safe;
- Complete B and Selective C differ in all 7,536 frames;
- the focused single-family review covers 144 source frames / 432 mode cases
  and adds 11,587 Complete B plus 9,419 Selective C contour pixels;
- the complete lane adds 527,866 Complete B plus 417,398 Selective C contour
  pixels;
- zero source-edge frames and zero out-of-bounds writes.

Two focused handoff sheets cover attack frames 2 and 3 across front, back,
left, and right directions. They expose the repaired Cave Troll club margins,
the distinct strike/recoil poses, all three Troll silhouettes, and both
outline modes. The repaired margins and exterior outline treatment are
approved.

## Outline Rollout Approved Group 20

Visually approved as a single-family Dwarf pass.

After Troll approval, thirteen enemy families remained outside the outline lane.
Dwarf is the next smallest repair: its 144-frame family has only four
source-edge frames, all from the Miner's club touching the bottom or top
canvas row in down/up attack frames 2 and 3. Those frames contribute eight
edge pixels and have no out-of-bounds writes.

The approved pass:

- gives only the Dwarf Miner's vertical club strike the approved one-pixel
  inset, moving the down strike upward and the up strike downward while
  preserving distinct strike and recoil frames;
- reduces the full enemy corpus from 154 to 150 source-edge frames and from
  566 to 558 source-edge pixels, with out-of-bounds writes remaining zero;
- enables None, Complete B, and Selective C for all three Dwarf variants
  without changing another unsupported family;
- uses the component-aware humanoid path so axes, the Miner club, and shields
  retain readable body-side seams instead of merging into the short body;
- preserves the two authored detached recoil-weapon frames and all 24 enclosed
  one-to-three-pixel source openings across 24 frames;
- adds all 144 Dwarf frames to the source-margin regression plus focused
  vertical-club, component-separator, detached-source, and cavity checks;
- changes no palette, catalog, saved state, or export schema.

Measured result across the forty-five-family outline lane:

- 7,680 None-mode parity checks pass against the corrected source renderer;
- all 23,040 None/B/C cases remain frame-safe;
- Complete B and Selective C differ in all 7,680 frames;
- the focused single-family review covers 144 source frames / 432 mode cases,
  adds 11,028 Complete B plus 9,167 Selective C contour pixels, and retains
  1,762 body-side equipment separator pixels;
- the complete lane adds 538,894 Complete B plus 426,565 Selective C contour
  pixels and retains 10,508 component-contact separator pixels;
- zero source-edge frames and zero out-of-bounds writes.

Three focused handoff sheets cover idle frame 1 and attack frames 2 and 3
across all four directions. They expose the held-equipment seams, the repaired
Miner club margins, the distinct strike/recoil poses, every preserved source
opening, all three Dwarf silhouettes, and both outline modes. The repaired
margins and cavity-preserving component-aware treatment are approved.

## Outline Rollout Approved Group 21

Visually approved as a single-family Ogre pass.

After Dwarf approval, twelve enemy families remained outside the outline lane.
Ogre is the next smallest repair: its 144-frame family has only four
source-edge frames, all from the Brute's club touching the bottom or top
canvas row in down/up attack frames 2 and 3. Those frames contribute eight
edge pixels and have no out-of-bounds writes.

The approved pass:

- gives only the Ogre Brute's vertical club strike the approved one-pixel
  inset, moving the down strike upward and the up strike downward while
  preserving distinct strike and recoil frames;
- reduces the full enemy corpus from 150 to 146 source-edge frames and from
  558 to 550 source-edge pixels, with out-of-bounds writes remaining zero;
- enables None, Complete B, and Selective C for all three Ogre variants
  without changing another unsupported family;
- uses the cavity-preserving component-aware humanoid path so the Brute club,
  Crusher axe, and Magi staff retain readable body-side seams;
- preserves all 139 enclosed openings across 116 corrected source frames and
  all ten detached spark pixels across the Magi's six multi-component attack
  frames;
- excludes the Magi's one-pixel spell sparks from casting their own halos,
  while allowing nearby staff/body contours to remain intact so the sparks
  stay thin and unboxed;
- adds all 144 Ogre frames to the source-margin regression plus focused club,
  component-separator, detached-spark, spark-halo, and cavity checks;
- changes no palette, catalog, saved state, or export schema.

Measured result across the forty-six-family outline lane:

- 7,824 None-mode parity checks pass against the corrected source renderer;
- all 23,472 None/B/C cases remain frame-safe;
- Complete B and Selective C differ in all 7,824 frames;
- the focused single-family review covers 144 source frames / 432 mode cases,
  adds 11,694 Complete B plus 9,814 Selective C contour pixels, and retains
  1,530 body-side equipment separator pixels;
- the complete lane adds 550,588 Complete B plus 436,379 Selective C contour
  pixels and retains 12,038 component-contact separator pixels;
- zero source-edge frames and zero out-of-bounds writes.

Three focused handoff sheets cover idle frame 1 and attack frames 2 and 3
across all four directions. They expose the held-equipment seams, repaired
Brute club margins, Magi sparks, every preserved source opening, all three
Ogre silhouettes, and both outline modes. The repaired margins,
cavity-preserving component treatment, and restrained spark treatment are
approved.

## Outline Rollout Approved Group 22

Visually approved as a single-family Goblin pass.

After Ogre approval, eleven enemy families remained outside the outline lane.
Goblin is the next smallest repair: its 240-frame family has only four
source-edge frames, all from the Brute's club touching the bottom or top canvas
row in down/up attack frames 2 and 3. Those frames contribute eight edge pixels
and have no out-of-bounds writes.

The candidate:

- gives only the Goblin Brute's vertical club strike the approved one-pixel
  inset, moving the down strike upward and the up strike downward while
  preserving distinct strike and recoil frames;
- reduces the full enemy corpus from 146 to 142 source-edge frames and from
  550 to 542 source-edge pixels, with out-of-bounds writes remaining zero;
- enables None, Complete B, and Selective C for Scout, Brute, Shaman, Archer,
  and Chief without changing another unsupported family;
- uses the cavity-preserving component-aware humanoid path so each variant's
  held equipment retains a readable body-side seam;
- preserves all 212 enclosed openings across 149 corrected source frames and
  all 56 multi-component frames, including the Archer's detached bow geometry
  and the Shaman's one-pixel spell sparks;
- excludes the Shaman's one-pixel spell sparks from casting their own halos,
  while allowing nearby staff/body contours to remain intact so the sparks
  stay thin and unboxed;
- adds all 240 Goblin frames to the source-margin regression plus focused club,
  equipment-separator, Archer component, Shaman spark, spark-halo, and cavity
  checks;
- changes no palette, catalog, saved state, or export schema.

Measured candidate result across the forty-seven-family outline lane:

- 8,064 None-mode parity checks pass against the corrected source renderer;
- all 24,192 None/B/C cases remain frame-safe;
- Complete B and Selective C differ in all 8,064 frames;
- the focused single-family review covers 240 source frames / 720 mode cases,
  adds 19,292 Complete B plus 15,871 Selective C contour pixels, and retains
  2,552 body-side equipment separator pixels;
- the complete lane adds 569,880 Complete B plus 452,250 Selective C contour
  pixels and retains 14,590 component-contact separator pixels;
- zero source-edge frames and zero out-of-bounds writes.

Three focused handoff sheets cover idle frame 1 and attack frames 2 and 3
across all four directions. They expose the held-equipment seams, repaired
Brute club margins, Shaman sparks, Archer bow separation, every preserved
source opening, all five Goblin silhouettes, and both outline modes. The
repaired margins, cavity-preserving component treatment, detached bow
separation, and restrained spark treatment are approved.

## Outline Rollout Approved Group 23

Visually approved as a single-family Zombie pass.

After Goblin approval, ten enemy families remained outside the outline lane.
Zombie is the next unsupported family in catalog order. Its 192-frame family
has only eight source-edge frames: the Rotter and Brute clubs touch the bottom
or top canvas row in down/up attack frames 2 and 3. Those frames contribute
sixteen edge pixels and have no out-of-bounds writes.

The candidate:

- gives only the Zombie Rotter and Brute vertical club strikes the approved
  one-pixel inset, moving down strikes upward and up strikes downward while
  preserving distinct strike and recoil frames;
- reduces the full enemy corpus from 142 to 134 source-edge frames and from
  542 to 526 source-edge pixels, with out-of-bounds writes remaining zero;
- enables None, Complete B, and Selective C for Shambler, Ghoul, Rotter, and
  Brute without changing another unsupported family;
- uses the cavity-preserving component-aware humanoid path so the Ghoul
  dagger and both clubs retain readable body-side seams;
- preserves all 114 enclosed openings across 104 corrected source frames;
- preserves the single connected source silhouette in all 192 frames, with no
  detached source components requiring special halo treatment;
- adds all 192 Zombie frames to the source-margin regression plus focused
  vertical-club, equipment-separator, and exhaustive cavity checks;
- changes no palette, catalog, saved state, or export schema.

Measured candidate result across the forty-eight-family outline lane:

- 8,256 None-mode parity checks pass against the corrected source renderer;
- all 24,768 None/B/C cases remain frame-safe;
- Complete B and Selective C differ in all 8,256 frames;
- the focused single-family review covers 192 source frames / 576 mode cases,
  adds 14,337 Complete B plus 12,451 Selective C contour pixels, and retains
  1,280 body-side equipment separator pixels;
- the complete lane adds 584,217 Complete B plus 464,701 Selective C contour
  pixels and retains 15,870 component-contact separator pixels;
- zero source-edge frames and zero out-of-bounds writes.

Three focused handoff sheets cover idle frame 1 and attack frames 2 and 3
across all four directions. They expose the repaired Rotter and Brute club
margins, held-equipment seams, every preserved source opening, all four Zombie
silhouettes, and both outline modes. The repaired margins,
cavity-preserving component treatment, and held-equipment separators are
approved.

## Outline Rollout Approved Group 24

Visually approved as a single-family Imp pass.

After Zombie approval, nine enemy families remained outside the outline lane.
Imp is the next unsupported family in catalog order. Its 144-frame family has
only four source-edge frames, all from the Fiend's club touching the bottom or
top canvas row in down/up attack frames 2 and 3. Those frames contribute eight
edge pixels and have no out-of-bounds writes.

Every Imp frame also contains detached one-pixel anatomy: the diagonal horn
tips are deliberately separated from the head, and the Pyro adds detached
one-pixel staff sparks during the middle attack frames. Giving each singleton
a normal eight-neighbor halo would replace their thin read with black boxes.

The candidate:

- gives only the Imp Fiend's vertical club strike the approved one-pixel
  inset, moving the down strike upward and the up strike downward while
  preserving distinct strike and recoil frames;
- reduces the full enemy corpus from 134 to 130 source-edge frames and from
  526 to 518 source-edge pixels, with out-of-bounds writes remaining zero;
- enables None, Complete B, and Selective C for Sprite, Pyro, and Fiend
  without changing another unsupported family;
- uses the cavity-preserving component-aware humanoid path so the spear,
  staff, and club retain readable body-side seams;
- preserves all 81 enclosed openings across 66 corrected source frames and all
  144 multi-component frames / 231 detached source pixels;
- leaves detached one-pixel body tips and Pyro staff sparks unhaloed while
  retaining nearby body, weapon, and contact contours, so none becomes a boxed
  black block or disappears under an equipment separator;
- adds all 144 Imp frames to the source-margin regression plus focused Fiend
  club, equipment-separator, horn-tip, Pyro spark, halo, and exhaustive cavity
  checks;
- changes no palette, catalog, saved state, or export schema.

Measured candidate result across the forty-nine-family outline lane:

- 8,400 None-mode parity checks pass against the corrected source renderer;
- all 25,200 None/B/C cases remain frame-safe;
- Complete B and Selective C differ in all 8,400 frames;
- the focused single-family review covers 144 source frames / 432 mode cases,
  adds 10,712 Complete B plus 9,037 Selective C contour pixels, and retains
  1,718 body-side equipment separator pixels;
- the complete lane adds 594,929 Complete B plus 473,738 Selective C contour
  pixels and retains 17,588 component-contact separator pixels;
- zero source-edge frames and zero out-of-bounds writes.

Three focused handoff sheets cover idle frame 1 and attack frames 2 and 3
across all four directions. They expose the repaired Fiend club margins,
detached horn tips, Pyro sparks, held-equipment seams, every preserved source
opening, all three Imp silhouettes, and both outline modes. The repaired
margins, cavity-preserving component treatment, thin horn tips, and restrained
spark treatment are approved.

## Outline Rollout Approved Group 25

Visually approved as a single-family Cultist pass.

After Imp approval, eight enemy families remained outside the outline lane.
Cultist is the next unsupported family in catalog order. Its only frame-edge
contact was the Oracle wizard hat: two tip pixels touched the top source row in
36 idle, walk, attack, and hurt frames, for 72 edge pixels total. No Cultist
frame attempted an out-of-bounds write.

The Zealot and Oracle staff strikes also carry deliberately detached one-pixel
spell sparks. Giving those singletons a normal eight-neighbor halo would turn
their thin magical accents into black boxes.

The candidate:

- gives only the Cultist Oracle's headgear a one-pixel vertical inset, retaining
  the complete brim, crown, highlight, bob, and attack motion while reserving
  the top outline row;
- reduces the full enemy corpus from 130 to 94 source-edge frames and from 518
  to 446 source-edge pixels, with out-of-bounds writes remaining zero;
- enables None, Complete B, and Selective C for Acolyte, Zealot, and Oracle
  without changing another unsupported family;
- uses the cavity-preserving component-aware humanoid path so the dagger and
  staffs retain readable body-side seams;
- preserves all 122 enclosed openings across 96 source frames and all 13
  multi-component frames / 30 detached source pixels;
- leaves the Zealot and Oracle's detached one-pixel staff sparks unhaloed while
  retaining nearby body, weapon, and contact contours;
- adds all 144 Cultist frames to the source-margin regression plus focused
  equipment-separator, staff-spark, halo, and exhaustive cavity checks;
- changes no palette, catalog, saved state, or export schema.

Measured candidate result across the fifty-family outline lane:

- 8,544 None-mode parity checks pass against the corrected source renderer;
- all 25,632 None/B/C cases remain frame-safe;
- Complete B and Selective C differ in all 8,544 frames;
- the focused single-family review covers 144 source frames / 432 mode cases,
  adds 11,440 Complete B plus 9,455 Selective C contour pixels, and retains
  1,520 body-side equipment separator pixels;
- the complete lane adds 606,369 Complete B plus 483,193 Selective C contour
  pixels and retains 19,108 component-contact separator pixels;
- zero source-edge frames and zero out-of-bounds writes.

Three focused handoff sheets cover idle frame 1 and attack frames 2 and 3
across all four directions. They expose the repaired Oracle hat margin, the
Zealot and Oracle spell sparks, held-equipment seams, every preserved source
opening, all three Cultist silhouettes, and both outline modes. The candidate
is visually approved.

## Outline Rollout Approved Group 26

Visually approved as a single-family Orc pass.

After Cultist approval, seven enemy families remained outside the outline lane.
Orc is the next unsupported family in catalog order. Its 144-frame family had
22 source-edge frames / 26 edge pixels: the Berserker club supplied eight
bottom/top pixels across down/up attack frames 2 and 3, while the Warlord's
detached side-view horn tip supplied one top-row pixel in each of 18 idle,
walk, attack, and hurt frames. No Orc frame attempted an out-of-bounds write.

The candidate:

- gives only the Orc Berserker's vertical club strike the approved one-pixel
  inset, retaining distinct strike and recoil frames;
- lowers only the Orc Warlord's complete horned helm by one pixel, preserving
  the helmet proportions and original detached horn-tip topology while
  reserving the top outline row;
- reduces the full enemy corpus from 94 to 72 source-edge frames and from 446
  to 420 source-edge pixels, with out-of-bounds writes remaining zero;
- enables None, Complete B, and Selective C for Grunt, Berserker, and Warlord
  without changing another unsupported family;
- uses the cavity-preserving component-aware humanoid path so the axe, club,
  sword, and Warlord shield retain readable body-side seams;
- preserves all 181 enclosed openings across 117 source frames and all 48
  multi-component frames / 72 detached source pixels;
- leaves detached Warlord horn tips unhaloed while retaining the nearby helmet,
  weapon, shield, and contact contours;
- adds all 144 Orc frames to the source-margin regression plus focused
  Berserker-club, equipment-separator, Warlord horn-tip, halo, and exhaustive
  cavity checks;
- changes no palette, catalog, saved state, or export schema.

Measured candidate result across the fifty-one-family outline lane:

- 8,688 None-mode parity checks pass against the corrected source renderer;
- all 26,064 None/B/C cases remain frame-safe;
- Complete B and Selective C differ in all 8,688 frames;
- the focused single-family review covers 144 source frames / 432 mode cases,
  adds 12,136 Complete B plus 10,180 Selective C contour pixels, and retains
  1,680 body-side equipment separator pixels;
- the complete lane adds 618,505 Complete B plus 493,373 Selective C contour
  pixels and retains 20,788 component-contact separator pixels;
- zero source-edge frames and zero out-of-bounds writes.

Three focused handoff sheets cover idle frame 1 and attack frames 2 and 3
across all four directions. They expose the repaired Berserker club margins,
the lowered Warlord horned helm and detached tips, held-equipment seams, every
preserved source opening, all three Orc silhouettes, and both outline modes.
The candidate is visually approved.

## Outline Rollout Approved Group 27

Visually approved as a single-family Lizardfolk pass.

After Orc approval, six enemy families remained outside the outline lane.
Lizardfolk is the next unsupported family in catalog order. Its only source-edge
contact was the Marsh club: two pixels touched the bottom/top source row across
down/up attack frames 2 and 3, for four frames / eight edge pixels total. No
Lizardfolk frame attempted an out-of-bounds write.

The family is otherwise topology-heavy. Its segmented three-pixel tail produces
140 multi-component frames / 426 detached source pixels, and the Chromatic's
middle staff strikes add detached one-pixel sparks. In the down strike, the
visible cyan spark crosses one hidden authored tail pixel, so ordinary
per-owner contouring nearly boxed the spark with the covered tail's halo.

The candidate:

- gives only the Lizardfolk Marsh's vertical club strike the approved one-pixel
  inset, retaining distinct strike and recoil frames;
- reduces the full enemy corpus from 72 to 68 source-edge frames and from 420
  to 412 source-edge pixels, with out-of-bounds writes remaining zero;
- enables None, Complete B, and Selective C for Saurian, Marsh, and Chromatic
  without changing another unsupported family;
- uses the cavity-preserving component-aware humanoid path so the spear, club,
  and staff retain readable body-side seams;
- preserves all 129 enclosed openings across 112 source frames and all 140
  multi-component frames / 426 detached source pixels;
- protects every visible tail-core color from equipment-contact replacement
  and contours each separated tail segment in both outline modes;
- isolates Chromatic staff sparks from the weapon layer, leaves their
  single-pixel source unhaloed, and opens only the two upper contour cells where
  the down-facing spark crosses the hidden tail pixel;
- adds all 144 Lizardfolk frames to the source-margin regression plus focused
  Marsh-club, equipment-separator, segmented-tail, staff-spark, halo, and
  exhaustive cavity checks;
- changes no palette, catalog, saved state, or export schema.

Measured candidate result across the fifty-two-family outline lane:

- 8,832 None-mode parity checks pass against the corrected source renderer;
- all 26,496 None/B/C cases remain frame-safe;
- Complete B and Selective C differ in all 8,832 frames;
- the focused single-family review covers 144 source frames / 432 mode cases,
  adds 13,386 Complete B plus 10,735 Selective C contour pixels, and retains
  1,746 body-side equipment separator pixels;
- the complete lane adds 631,891 Complete B plus 504,108 Selective C contour
  pixels and retains 22,534 component-contact separator pixels;
- zero source-edge frames and zero out-of-bounds writes.

Three focused handoff sheets cover idle frame 1 and attack frames 2 and 3
across all four directions. They expose the repaired Marsh club margins,
segmented tail treatment, Chromatic staff sparks, held-equipment seams, every
preserved source opening, all three Lizardfolk silhouettes, and both outline
modes. The candidate is visually approved.

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
