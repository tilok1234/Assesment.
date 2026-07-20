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
- Pass 7 (superseded by stronger instrumentation): all 3,600 family/tier/direction/animation frames passed the original pixel and motion checks, but those checks did not record pixels discarded before the final canvas write.
- Pass 8 (complete, 2026-07-20): durable out-of-canvas instrumentation exposed 259 cropped frames and 915 lost pixels in the prior attack pose. The shared in-frame correction now leaves all 3,600 cases at zero discarded pixels while preserving motion phases, routing, mirroring, connectivity, and native export parity.

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

The pre-repair instrumented audit confirmed that 259 of the 3,600 weapon frames attempted to draw 915 pixels outside the 24x24 canvas. Every failure occurred during `attack`. The affected families were Warhammer, Club, Mace, Staff, Axe, Wand, Spellbook, Greatsword, Rapier, Sword, Scimitar, and Spear; Dagger, Bow, and Crossbow had no discarded weapon pixels.

This was a shared pose problem rather than twelve independent source-art failures. Attack geometry already reached the safe frame limits, then the humanoid rig applied another directional two-pixel lunge.

Completed correction:

1. `drawSprite` accepts an optional out-of-bounds diagnostic callback;
2. humanoid body, shield, and headgear stay on their registered anchor during attacks;
3. the weapon keeps an in-frame one-pixel perpendicular follow-through/recoil so strike and hurt phases remain distinct;
4. all 3,600 weapon frames now report zero discarded pixels and passed enlarged browser review;
5. no weapon source identity changed, so Crossbow T5 remains the next independent art prototype.

Edge contact remains advisory. Attempted writes beyond `x=0..23` or `y=0..23` are contract failures.
