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
approved; Bandit and Kobold hybrid component-aware outlines visually approved.

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
