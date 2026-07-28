# Phase 5 Off-Hand Items Plan

Status: complete, visually approved, integrated, validated, and checkpointed
on 2026-07-26. The later Cast/Death extension is also covered by the current
20-column gate.

This is the first focused Phase 5 content slice after the approved Form-shading
checkpoint. It adds non-shield items carried in the character's left hand
without weakening the stable shield, outline, shade, preset, pack, or Complete
Kit contracts.

## Approved scope decision

The first item is the **Lantern**.

- It reuses the proven animated shield-hand socket and front/back occlusion
  behavior.
- It has a strong 24x24 identity without requiring combat effects or an
  external glow.
- It does not pretend to be a shield or inherit five shield progression tiers.
- It exercises all four directions and every existing animation before more
  held utility art is added.

The isolated all-direction, all-animation Lantern review was visually approved
by the user on 2026-07-26. The lighter parchment review background was also
preferred. The generated `offhand-review/` directory remains disposable review
evidence, not an accepted baseline.

Spell foci are a later held-off-hand family. Quivers are a separate back-slot
problem and must not be forced through a hand-held renderer.

## Public contract

The approved integration adds a separate non-shield `offhand` field:

- `OFFHANDS` contains stable `none` and `lantern` ids;
- `shield` and `shieldTier` remain unchanged and retain all five tiers;
- selecting an equipped shield clears `offhand`;
- selecting an equipped utility off-hand clears `shield` and resets
  `shieldTier` to Tier 1;
- missing or invalid legacy `offhand` values migrate to `none`;
- if malformed input supplies both, the shield wins and the utility item is
  discarded;
- only an equipped shield can trigger shield-block combat behavior;
- effects remain Off by default and are not required to make the Lantern read.

This is intentionally a non-shield catalog. No migration treats lanterns or
future spell foci as shield families.

## Renderer and ownership contract

`engine/offhand-renderer.js` owns held utility-item pixels. The Lantern:

- attaches to the animated left-hand socket;
- hangs below and outside the body instead of covering the face or torso;
- uses direction-aware `offhand-back` and `offhand-front` passes;
- shares the logical off-hand equipment owner with the mutually exclusive
  shield passes for component-aware outlining;
- remains inside the 24x24 frame in every direction, animation, and frame;
- remains deterministic and preserves pixel-identical output when absent;
- preserves shield precedence;
- recomposes exactly through the published layer order;
- remains legible with None, Complete B, and Selective C outlines and approved
  Form shading.

## Persistence and export integration

The public field participates in editor controls, naming, randomization,
history, comparison, presets, ordinary packs, class packs, equipment batches,
assembled exports, and the stable engine facade.

Version changes:

- named preset library: v12, accepting v1-v11;
- ordinary sprite pack: v3, accepting v1-v2;
- Equipment Variant Batch and Class Pack: v3;
- Master Character Kit and Master Roster Kit: v2;
- Complete Character Kit and Complete Character Pack: v12.

Complete Kit components use:

- `components/offhands/lantern/back.png`;
- `components/offhands/lantern/front.png`.

The two new atomic sheets raise the shared component library from 1910 to 1912
PNGs, the standalone Complete Character Kit from 2137 to 2139 PNGs, and a
24-player Complete Pack from 2160 to 2162 PNGs.

## Validation gate

The current hard validation matrix covers 320 equipped-Lantern cases:

- four body builds;
- four directions;
- every idle, walk, attack, cast, hurt, and death frame;
- zero out-of-bounds writes;
- hand attachment and face-clearance checks;
- direction-aware front/back routing;
- visible difference from the unequipped body;
- exact recomposition from `offhand-back`, body, and `offhand-front`.

The interactive review covers three representative weapon/bearer combinations,
all four directions, all animations and frames, all three outline treatments,
and approved Form shading. A public integration is not a fixture or release
approval: release artifacts and approved visual baselines remain unchanged.

## Later candidates

1. Spell focus: a held orb, tome, or crystal family using the approved
   hand-held topology.
2. Quiver: a back-slot item with its own body/equipment ownership and
   direction-aware occlusion plan.
3. Additional utility items only after a fresh focused plan and visual approval
   gate.
