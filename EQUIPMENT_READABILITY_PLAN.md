# Equipment Readability Plan

Status: canonical asset-readability history and rules, reconciled on
2026-07-26. Source-art work is paused. The unresolved default
combat-effect/shield preview remains a deferred independent lane; it is not a
prerequisite for the next planned shade pass.

This plan supersedes any earlier recommendation to keep expanding the general outline algorithm. The current outline work is the baseline. The next problems must be handled according to their actual cause: source art, composition/placement, or a narrowly proven outline defect.

## Non-Negotiable Rules

- Do not change bodies, heads, hair, outfits, limbs, animation poses, anchors, equipment offsets, or layer order unless the user separately approves that exact change.
- Do not remove existing outline pixels as a general cleanup technique.
- Do not modify source art while claiming to make an outline-only change.
- Do not modify the outline algorithm while claiming to revise one equipment asset.
- Work on one named family/tier prototype at a time, then stop for visual review.
- Examples supplied by the user are symptoms, not the complete test set. Every accepted change must be checked across all relevant directions, animations, and frames.
- Do not reset, revert, restore, or discard work without first explaining the exact operation and receiving approval.
- Do not commit, push, or merge without approval.

## Current Verdict

The outline system is a usable baseline and is frozen for the first asset passes.

- Crossbow T2 reads as a crossbow in isolation but becomes difficult to read when it overlaps another dense piece of equipment. That is primarily a composition problem.
- Crossbow T5's source-art correction is accepted: brighter connected recurved limbs now carry the silhouette while the darker stock, grip, string, and firing axis remain secondary.
- Tower and Kite shields provide the clearest shield silhouettes and are the control references.
- Bone T3-T5, Arcane T3-T5, and Buckler T4-T5 do not provide enough solid shield structure. More outline would mostly add clutter.
- Heater, Round, and Oval are secondary review candidates, not first-pass failures.
- Mace/Warhammer protrusions and very thin Staff/Wand/Dagger/Rapier shapes require local review. They do not justify a global outline rule.

## 2026-07-20 Full Weapon Reassessment

The complete weapon review was regenerated and inspected before choosing a prototype:

- 15 weapon families and 5 tiers each: 75 family/tier variants;
- 3,600 assembled direction/animation/frame cases;
- 37 enlarged and native-scale review sheets;
- every family/tier source layer remained a single connected component (`maxComponents=1`);
- the rebuilt Windows executable and the non-intrusive in-app browser both reproduced the same Crossbow T5 silhouette problem.

Current art verdict:

- Accept their source identities as the current baseline: Sword, Greatsword, Scimitar, Rapier, Dagger, Axe, Mace, Warhammer, Spear, Club, Bow, Crossbow, Staff, Wand, and Spellbook. Crossbow T5 includes the accepted source-art correction below. Animation frame-safety is a separate gate below.
- Defer to the separate composition phase: Crossbow T2 combined with a shield.
- Monitor locally rather than applying a global rule: Mace/Warhammer protrusions and thin Staff/Wand/Dagger/Rapier frames.

Audit signals such as edge contact, character distance, and expression overlap remain diagnostics. They are not automatic failures without a matching visual defect.

## 2026-07-20 Animation Frame-Safety Audit

The user's report of weapons and hats cutting out during animations was confirmed as real cropping, not merely intentional boundary contact. A read-only instrumented render recorded every pixel the renderer attempted to place outside the fixed 24x24 canvas.

Weapon results:

- 259 of 3,600 weapon frames discard pixels, totaling 915 lost pixels.
- Every confirmed weapon crop occurs during `attack`; idle, walk, and hurt weapon frames produced no discarded pixels.
- Affected families: Warhammer, Club, Mace, Staff, Axe, Wand, Spellbook, Greatsword, Rapier, Sword, Scimitar, and Spear.
- Dagger, Bow, and Crossbow produced no out-of-canvas weapon writes.
- Warhammer is the worst case: 40 clipped frames and 364 discarded pixels, with as many as 15 missing pixels in one strike frame.
- Club is next: 26 clipped frames and 146 discarded pixels.

Headgear results:

- 37 of 528 headgear animation cases discard pixels, totaling 101 lost pixels.
- Wizard hat: 33 clipped cases and 85 discarded pixels across idle, walk, attack, and hurt.
- Plumed helm: 3 clipped cases and 14 discarded pixels during hurt/down and attack/up.
- Horned helm: 1 clipped case and 2 discarded pixels during attack/up.
- The other eight equipped headgear families produced no out-of-canvas writes.

Root-cause probe:

- The shared pose applies a directional two-pixel attack lunge to the complete humanoid after weapon attack geometry has already been placed near the safe canvas limits.
- A no-write in-memory probe with the global attack/hurt translation disabled reduced weapon cropping from 915 pixels to zero and removed all Plumed/Horned helm cropping.
- The Wizard hat still lost 72 pixels in 36 cases during that probe because its base tip geometry begins at `y=-1`; it needs its own source-geometry correction.

Those figures are the pre-repair baseline. The approved implementation below now preserves them as regression evidence.

## Phase 0 - Establish a Safe Baseline

Status: complete. The approved checkpoint is commit `6667c8f`
(`Checkpoint equipment readability baseline`), preserved before the pushed
shield hand/facing checkpoint `f21cbe3` and later local outline work.

1. Inspect the current branch, working tree, and existing checkpoint without changing them.
2. Separate pre-existing user work from the outline/readability work.
3. Run the current validation suite and record its results.
4. Show the exact files proposed for a checkpoint.
5. Create the checkpoint only after approval.

The checkpoint is a safety boundary, not permission to reset to it automatically.

## Phase 1 - Animation Frame-Safety Prototype

Status: complete and browser-reviewed on 2026-07-20.

The renderer now reports attempted out-of-canvas writes through an optional diagnostic callback. Humanoid attacks keep the body, shield, and headgear on their registered anchor while the weapon uses a one-pixel perpendicular follow-through/recoil for phase clarity. The Wizard hat tip was moved into the canvas without shortening unrelated hats. A validator-discovered Arcane T5 shield rune was also moved one pixel clear of the face during its strike cycle.

Verified result:

- all 3,600 weapon family/tier/direction/animation frames produce zero discarded pixels;
- all 528 equipped-headgear animation cases produce zero discarded pixels;
- attack and hurt phase diversity, hand/weapon routing, exact left/right mirroring, native export parity, and shield face clearance still pass;
- Plumed and Horned helms required no source-art changes after the shared pose correction;
- browser playback review accepted Warhammer T5 with Wizard hat, Plumed hurt, Horned attack, and the outline showcase matrix.

Implementation steps retained for history:

1. Add a durable validator that records attempted out-of-canvas writes separately from ordinary edge contact.
2. Prototype replacing the shared whole-character directional attack translation with in-frame strike motion while preserving the four attack phases, hand/weapon attachment, direction mirroring, and perceived impact.
3. Review every player direction and attack frame before applying the pose correction as a shared rule.
4. Correct the Wizard hat's always-too-high tip geometry separately; do not shorten every hat.
5. Verify Plumed and Horned helms after the shared pose correction before changing their art.

The frame-safety prototype and Wizard correction were visually accepted together. Crossbow T5 source art and outline logic remain separate work.

## Phase 2 - Crossbow Source-Art Prototype

Prototype: Crossbow T5.

Status: complete and user-approved on 2026-07-20.

Goal: make the object read as a crossbow before outline or shield context is added.

Allowed changes:

- pixels belonging only to the Crossbow T5 source art;
- silhouette clarification around the bow arms, stock, grip, and firing axis;
- color grouping needed to distinguish those parts.

Forbidden changes:

- equipment position, anchor, scale, pose, layer order, animation timing, body, outfit, arm, or shield;
- other crossbow tiers;
- outline-renderer logic.

Acceptance check:

- all four directions;
- walk, attack, hurt, and idle frames;
- outline None, Complete B, and Selective C;
- without a shield first, then with representative Tower/Kite cases;
- no regression outside Crossbow T5.

Stop after the prototype and request visual approval. Extend the approach to another crossbow tier only if the prototype is accepted and that tier independently needs it.

Accepted result:

- Crossbow T5 alone received a tier-specific palette and connected recurved limb structure, plus a reinforced stock and grip;
- tiers 1-4, anchors, equipment placement, animation poses, timing, layer order, and outline logic stayed unchanged;
- front/down, back/up, left, and right views read as a crossbow through idle, walk, attack, and hurt;
- None, Complete B, and Selective C passed without a shield and with a representative Tower shield;
- all 3,600 weapon-frame cases remained inside the 24x24 canvas with zero discarded pixels;
- project, weapon, outline, build, and diff validation passed before approval.

## Phase 3 - Shield Structure Prototypes

The shield work is source-art work. It must not be mixed with outline-algorithm changes.

Status: deferred. A Bone T3 review candidate exists under `shield-review/`,
but it is not the active lane and must not advance without a separate
effect-enabled assembler review and explicit approval.

Order:

1. Bone T3 prototype.
2. If accepted, evaluate Bone T4 and T5 individually.
3. Arcane T3 prototype, then T4 and T5 individually if accepted.
4. Buckler T4 prototype, then T5 if accepted.

Each prototype must preserve its theme while gaining one coherent shield mass or frame. Decorative gaps may remain, but they cannot be the only thing defining the shield.

Tower and Kite are controls. Do not redesign them during these phases.

## Phase 4 - Secondary Asset Review

Only after the primary prototypes are resolved:

- review Heater, Round, and Oval at their worst tiers;
- review Mace and Warhammer protrusions as local source-art issues;
- review Staff, Wand, Dagger, and Rapier only where their silhouettes fail at actual gameplay scale;
- leave acceptable thin equipment alone rather than thickening every item.

Every item remains an individual decision. No family-wide or global change is allowed merely because one example fails.

## Phase 5 - Composition And Placement Review

This is a separate phase and requires separate approval.

Only after the source art reads correctly in isolation should dense combinations such as Crossbow plus Kite be evaluated for composition changes.

Possible subjects for discussion, not pre-approved actions:

- whether some weapon/shield combinations should be visually restricted;
- whether a shield belongs behind a weapon for a specific direction/pose;
- whether equipment needs a narrowly scoped pose or offset adjustment.

No equipment, hand, or arm movement is allowed during the source-art phases.

## Validation Gate For Every Prototype

- inspect every affected direction, animation, and frame;
- compare outline None, Complete B, and Selective C;
- compare isolated equipment and representative full characters;
- verify untouched assets and character pixels are unchanged;
- run the outline validation suite;
- run the equipment readability review;
- run the project build/check commands;
- present before/after examples and the exact changed files;
- stop for user approval before expanding scope.

## Final Full-Suite Gate

Before any completed readability batch is proposed for commit:

- rerun all 3,600 weapon cases and all 7,680 current shield cases (11,280 combined equipment cases);
- rerun all outline ownership and preservation checks;
- review representative light, dark, complex, and simple characters;
- verify no body, outfit, hair, animation, placement, anchor, or unrelated equipment changes entered the diff;
- document any intentionally unresolved combinations;
- obtain approval before committing or pushing.

## Stop Conditions

Stop immediately if a change:

- alters a body or unrelated asset;
- moves equipment without explicit placement approval;
- solves one screenshot while breaking other frames;
- requires removing unrelated outline pixels;
- mixes source-art, outline, and placement changes in one prototype;
- cannot be demonstrated cleanly against the safe baseline.

## Deferred Resume Action

The safe-baseline checkpoint, animation frame-safety correction, Crossbow T5
source-art prototype, and shield hand/facing checkpoint are complete. No
equipment redesign is currently authorized. If this lane resumes, first
resolve the user-visible default combat-effect/shield preview problem described
in `HANDOFF.md`:

1. reproduce the exact assembler state with `Overlay preview` On;
2. compare the same frames with effects Off only to isolate effect pixels;
3. change the compositor/effect occlusion, not approved shield source art;
4. verify all four attack frames in all four directions in the packaged browser build;
5. stop for explicit visual approval before rebuilding or committing.
