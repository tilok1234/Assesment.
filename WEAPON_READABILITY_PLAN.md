# Weapon Readability Plan

The weapon library contains 15 families and five RPG tiers per family. Work proceeds in three-family passes so every redraw can be reviewed at native scale before the next group changes.

## Readability contract

Every weapon pass must satisfy these checks:

1. The family is recognizable from its silhouette before color or particles are considered.
2. The grip is visibly anchored to the animated hand in hold, wind-up, strike, and recovery frames.
3. Front, back, and profile views describe the same object; left and right remain exact mirrors.
4. Tier 2 reinforces the base, Tier 3 adds a signature feature, Tier 4 establishes a relic form, and Tier 5 refines that relic into an apex form without shrinking or losing the core silhouette.
5. Runes and energy remain connected to, or clearly subordinate to, the physical weapon. Detached pixels are reserved for deliberate motion effects.
6. No pixel is accidentally clipped. Intentional frame-edge contact is reviewed in every direction.
7. The result is checked as a weapon-only layer and on the assembled character at 1x and enlarged scale.

Run `npm run review:weapons` to generate the review dashboard, SVG contact sheets, summary metrics, and the exhaustive frame audit in `weapon-review/`. Add `-- --all-frames` for enlarged and true-native assembled sheets covering all 12 animation frames in every tier and direction. Use `npm run review:weapons -- --focus sword,greatsword,dagger` to isolate a pass.

## Passes

- Pass 1 (complete): sword, greatsword, dagger; establish the straight-blade length, width, hilt, and tier language.
- Pass 2 (complete): scimitar, rapier, axe; preserve curve, guard, and weighted-head identities.
- Pass 3 (complete): mace, warhammer, club; separate blunt head shapes and replace slab-like upper tiers.
- Pass 4 (complete and user-approved): spear, bow, crossbow; strengthen tips, limbs, strings, stocks, and profile views.
- Pass 5 (complete and user-approved): staff, wand, spellbook; the staff keeps a long connected shaft and crown, the wand remains a compact casting focus, and the spellbook preserves a readable cover, spine, and widening page spread without detached effects.
- Pass 6 (complete): all 15 Tier 4 and Tier 5 families were compared assembled and weapon-only at native and enlarged scale. The review accepted the current physical silhouettes without forced pixel removal; global Tier 5 density and bounds budgets now prevent future ornament growth beyond the accepted library.
- Pass 7 (complete): all 3,600 family/tier/direction/animation frames passed exact left/right mirroring, direction-aware front/back layer routing and recomposition, motion-phase diversity, front-view identity retention, detachment, connectivity, and native export pixel/order checks. Enlarged and true-native visual audits confirmed that reported frame-edge contacts preserve complete contours, so no evidence-backed renderer correction was required.

After each family pass, compare the focused review dashboard with the full-library dashboard before continuing.

## 2026-07-20 Reassessment

The completed overhaul remains the source-identity baseline, but earlier pass approval is not a permanent blanket approval when new composed-character or animation evidence exposes a problem.

The exhaustive review was regenerated across all 15 families, 5 tiers, 4 directions, 4 animations, and 3 frames: 3,600 assembled frames and 37 native/enlarged review sheets. All 75 family/tier source layers remained single-component in the audit (`maxComponents=1`). Mechanical signals remain diagnostic and were checked visually rather than treated as automatic failures.

Current verdict:

- Accept as the current baseline: sword, greatsword, scimitar, rapier, dagger, axe, mace, warhammer, spear, club, bow, staff, wand, and spellbook.
- Iterate: Crossbow T5. Its front/down and assembled silhouettes can read like a compact firearm or horizontal bar even with no shield. This is a source-art problem.
- Defer to composition review: Crossbow T2 with a shield. It reads as a crossbow in isolation, so this must not be mixed into the T5 source-art prototype.
- Monitor individual frames only: mace/warhammer protrusions and very thin staff/wand/dagger/rapier shapes.

The Crossbow T5 prototype must preserve the existing 24x24 frame contract, anchors, animation poses, directional placement, scale, timing, and renderer behavior. It may clarify only the bow limbs, stock, grip, firing axis, and their color grouping. It must be reviewed in every direction and animation with None, Complete B, and Selective C before any other tier is considered.

### Animation frame-safety correction

An instrumented audit confirmed that 259 of the 3,600 weapon frames attempt to draw 915 pixels outside the 24x24 canvas. Every failure occurs during `attack`. The affected families are Warhammer, Club, Mace, Staff, Axe, Wand, Spellbook, Greatsword, Rapier, Sword, Scimitar, and Spear; Dagger, Bow, and Crossbow have no discarded weapon pixels.

This is primarily a shared pose problem rather than twelve independent source-art failures. Attack geometry already reaches the safe frame limits, then the humanoid rig applies another directional two-pixel lunge. A read-only probe without that global translation produced zero weapon crop cases.

Before the Crossbow T5 source-art prototype:

1. add a validator for attempted out-of-canvas writes;
2. prototype an in-frame attack motion that keeps hand/weapon attachment and impact without translating the complete character outside its cell;
3. verify all 3,600 weapon frames and compare animation playback at native and enlarged scale;
4. stop for approval before changing any weapon source identity.

Edge contact remains advisory. Attempted writes beyond `x=0..23` or `y=0..23` are contract failures.
