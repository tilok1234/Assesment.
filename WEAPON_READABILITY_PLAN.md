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
