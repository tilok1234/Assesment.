> **STATUS: HISTORICAL — completed/closed record.** Do not read as part of session orientation;
> consult only when researching how this feature was built. Live guidance lives in `CLAUDE.md`.

# Transparent Tile Repair Plan

Status: first implementation slice visually accepted and checkpointed at
`690aec0`; remaining advisory classification and mixed-owner work are deferred.
This is no longer the active continuation plan.

Date: 2026-07-25

This is the retained plan for repairing unintended transparent checkerboard
cells inside assembled player sprites. It covers body construction,
equipment-to-body contact, and the interaction with None, Complete B, and
Selective C. The former shade phase later completed. The current continuation
is the approval-gated enemy-expansion lane in `HANDOFF.md` and
`ENEMY_EXPANSION_PLAN.md`; it does not authorize another transparency slice.

The audit that produced this plan was read-only. The first repair slice was subsequently implemented and explicitly approved on 2026-07-25. The existing dirty attack-animation, effect-direction, and effect-compositor work predates that slice and remains separately reviewable.

## Accepted First Slice - 2026-07-25

The user explicitly approved the browser candidate containing:

- lean and heroic up/down arm-to-torso connections that follow the arm pose without moving weapon or shield sockets;
- stable left/right side-cape attachment with the outer edge still swaying and tapering;
- a recessed backing behind every Bone-shield tier, preserving the rib-cage silhouette while removing visible checkerboard pockets;
- a repository-owned `review:transparency` command.

The dedicated audit passed:

- 8,640 body frames;
- 2,890 intentional leg-separation controls preserved in the exact clean checkpoint;
- 960 Bone-shield direction/animation/frame checks;
- 0 persistent mid-body tunnels that remain transparent in None, Complete B, and Selective C;
- 0 enclosed Bone-shield checkerboard components;
- 1,660 single-mode or outline-resolved notches retained as advisory candidates for classification.

The exact approved browser state was Goblin / Heroic / Deep / Spiky Black / Happy / Scar / Skull mask / Cleric T3 Teal, weapon None, Bone shield T2, Walk, Right, frame 1, Complete B, Effects Off, 20x. The same roll was exercised through all 144 outline-mode, animation, direction, and frame states before approval.

Project check, build, the 3,600-frame weapon review, syntax checks, and `git diff --check` passed. The outline review remains intentionally unaccepted: it reports 428 existing edge-touch cases / 760 pixels and eight renderer-dependent hash changes. No golden files were rewritten.

This is an accepted local checkpoint, not completion of the whole plan. Effects-On integration remains blocked by the independently unapproved effect compositor, and the remaining advisory/body, mixed-owner, and optional openwork lanes still require classification and review.

## Goal

Remove unintended internal transparent tunnels without flattening intentional negative space, widening every silhouette, weakening animation, moving equipment anchors, or using the outline renderer as a blanket fill operation.

The finished result must:

- contain no unapproved mid-body checkerboard tunnels in any direction or animation frame;
- keep deliberate leg separation and recognizable equipment openings;
- remain readable in None, Complete B, and Selective C;
- preserve all approved weapon, shield, hand-socket, frame-safety, and outline behavior;
- work with combat effects both Off and On;
- pass automated full-library checks and explicit browser review before acceptance.

## Audit Baseline

The 2026-07-25 reassessment used two complementary detectors.

### Broad coverage pass

- 90,336 rendered frame checks.
- All four body builds, body/outfit combinations, directions, animations, and frames.
- All 75 weapon family/tier variants.
- All 40 shield family/tier variants.
- Weapon-and-shield attack combinations.
- None, Complete B, and Selective C.

This pass intentionally over-reports normal negative space. Its findings are diagnostic candidates, not automatic defects.

### Strict persistent-tunnel pass

- 62,256 rendered frame checks.
- 211,747 bridge/tunnel candidates.
- 7,140 groups remained transparent in all three outline modes.
- 1,180 repeated mid-body body-tunnel groups are high-confidence construction defects.
- 242 mixed-owner groups remain at body/equipment contact points.
- 1,060 groups are deliberate leg separation.
- 134 weapon and 2,264 shield groups are known ornamental or functional openwork.

The remaining persistent groups include collar and neck breathing space that requires visual judgment. They must not be counted as failures merely because they are transparent.

Audit evidence is stored outside the repository at:

`C:\Users\headc\.codex\visualizations\2026\07\22\019f8b5b-58c9-7711-8dd8-6548ea4568f1\transparent-tile-audit`

Important artifacts:

- `persistent-transparency.json`
- `transparent-tile-audit.json`
- `systemic-candidates-none-b-c.png`
- `enclosed-hole-candidates-owner-none-b-c.png`
- `top-issues.csv`

## Confirmed Root Causes

### 1. Front/back arm-to-torso channels

Lean and heroic bodies use a torso that is narrower than the fixed hand and arm sockets. In up and down views this can leave transparent cells around `x=8` or `x=15`, especially near `y=16..17`. The repeated vertical strip is the belt or waist defect visible in the supplied screenshots.

An in-progress shoulder connector exists in the dirty `engine/renderer.js`, but the current regression only proves that at least one pixel exists somewhere in a six-row span. It can therefore pass while a smaller internal tunnel remains. This work is not complete.

### 2. Side-view cape separation

Cape sway shifts the cape horizontally when the legs move. In some side frames the shifted cape loses its body attachment and exposes a vertical checkerboard channel. The animation should retain its sway; the cape needs a stable attachment bridge or pivot.

### 3. Outfit-specific body construction

Some cape, robe, and dense costume combinations contain additional isolated body-layer holes. These must be repaired at their source layer rather than painted over after assembly.

### 4. Mixed-owner contact gaps

Some transparent cells sit between body, weapon, shield, or headgear ownership layers. A global fill cannot determine which object should own these cells and could fuse equipment to the character. These cases require family-specific registration or contact geometry.

### 5. Intentional equipment openwork

Bows, crossbows, shield spokes, bone or arcane frames, staff heads, and Warhammer ornaments deliberately contain openings. Their checkerboard background is not renderer corruption. If a particular ornate item is visually rejected, it should receive a separate source-art redesign with its own approval.

## Classification Contract

Every candidate must be assigned one of these outcomes before it is changed:

| Class | Meaning | Required treatment |
| --- | --- | --- |
| Structural body defect | A transparent tunnel unintentionally splits one body or outfit mass | Repair the owning body/outfit geometry |
| Mixed-owner contact defect | A gap appears only where independently owned layers should meet | Correct the responsible attachment or registration |
| Intentional articulation | Leg, arm, neck, or animation breathing space needed for a readable pose | Preserve and record as intentional |
| Intentional equipment openwork | A designed opening that carries item identity | Preserve |
| Style-review candidate | Technically intentional but visually too checkerboard-heavy | Present separately; do not silently fill |
| Detector noise | A geometrically reported space that is visibly unrelated | Exclude from acceptance metrics |

## Protected Behavior

The repair must not:

- move approved weapon or shield hand sockets;
- reintroduce out-of-frame weapon or headgear writes;
- flatten walk or attack body motion;
- merge body, weapon, and shield into one outlined silhouette;
- alter None-mode pixels outside the named repair;
- change the meanings of None, Complete B, or Selective C;
- fill every enclosed transparent component;
- redesign approved equipment while claiming to fix body construction;
- rewrite outline goldens or accept baseline drift automatically;
- mix the unapproved effect-direction/compositor work into a transparency commit.

## Phase 0 - Preserve And Prove The Baseline

Status: strict body-tunnel and Bone-shield regressions implemented; broader mixed-owner and equipment-openwork controls remain pending.

1. Preserve the current branch and dirty files exactly.
2. Promote the minimum strict detector needed for regression into a repository-owned tool or test.
3. Add explicit fixtures for:
   - lean up/down waist channels;
   - heroic up/down waist channels;
   - a side-view moving cape;
   - a representative mixed body/weapon contact;
   - a representative mixed body/shield contact;
   - deliberate leg separation;
   - representative bow, staff, Warhammer, and ornate-shield openwork.
4. Replace the current loose "some pixel in this span" assertion with a check that proves the unwanted connected transparent tunnel is gone.
5. Record the pre-fix counts without accepting them as a golden visual baseline.

Exit gate:

- a deliberately reintroduced waist or cape tunnel fails the test;
- deliberate leg separation and equipment openings pass;
- the test reports owner, direction, animation, frame, and coordinates for every failure.

## Phase 1 - Repair Body Geometry

Work in small independently reviewable slices.

### Phase 1A - Up/down torso attachment

Status: accepted on 2026-07-25.

1. Repair lean up/down joins.
2. Verify all outfits, animations, and frames.
3. Repair heroic up/down joins.
4. Verify all outfits, animations, and frames.
5. Confirm the fix does not widen classic or broad bodies.

The connector must follow the arm pose and outfit owner. It must not move the hand socket or paint over equipment.

### Phase 1B - Side cape attachment

Status: accepted on 2026-07-25.

1. Give the cape a stable body-side attachment while retaining sway.
2. Check left and right views separately; mirroring assumptions are not sufficient.
3. Check idle, walk, attack, and hurt at every frame.
4. Confirm the cape does not become a rigid rectangle or fuse to the legs.

### Phase 1C - Remaining outfit-specific gaps

Status: pending. The clean checkpoint audit reports 1,660 single-mode or outline-resolved advisory notches; these are not automatic defects.

1. Rerun the strict owner audit after 1A and 1B.
2. Group remaining body holes by shared source signature.
3. Repair one outfit/build signature at a time.
4. Keep collar and neck spaces in a separate visual-review lane rather than auto-filling them.

Phase 1 automated exit gate:

- zero persistent high-confidence mid-body body tunnels across None, Complete B, and Selective C;
- deliberate leg separation remains present;
- no new out-of-bounds writes;
- no unrelated body or outfit signatures change.

Phase 1 visual exit gate:

- native 24x and enlarged review accepted for all four directions;
- walk and attack still show readable foot and body motion;
- repaired joins look intentional rather than like rectangular patches.

## Phase 2 - Repair Mixed-Owner Contacts

Start only after the body-only count is clean.

1. Recalculate the current 242 persistent mixed-owner groups.
2. Cluster them by owner pair:
   - body and weapon;
   - body and shield;
   - body and headgear;
   - weapon and shield;
   - three-way contacts.
3. Within each cluster, group by equipment family, tier, direction, and animation signature.
4. Choose which owner should occupy or border the gap according to the established depth pass.
5. Fix one family/signature at a time.
6. Review it in isolation and in the assembled character.

Do not solve mixed-owner gaps by expanding the global outline contour. If no owner should occupy a cell, classify the gap as intentional instead.

Phase 2 exit gate:

- all persistent mixed-owner groups are either removed or explicitly classified;
- no approved equipment anchor or facing rule changes;
- direct-contact separators remain one pixel and owner-aware;
- equipment remains visually distinct from the body in Complete B and Selective C.

## Phase 3 - Equipment Openwork Review

This phase is a visual style decision, not part of the mandatory structural repair.

The user specifically rejected the visible checkerboard inside the Bone-shield ribs. A recessed backing for all Bone tiers was accepted in the first slice. Other weapon and shield openings remain preserved by default.

1. Preserve the known 134 weapon and 2,264 shield openwork groups by default.
2. Present a focused native/enlarged sheet for any item that still looks accidentally transparent.
3. If the user rejects an item, open a separate named family/tier source-art task.
4. Redesign the smallest possible source silhouette while preserving anchors, frame safety, and item identity.
5. Stop for approval before applying the design to neighboring tiers.

There is no target of "zero equipment holes." The target is zero unclassified or visually accidental holes.

## Phase 4 - Full Validation

Automated checks:

```powershell
node tools/transparent-tile-review.mjs
npm.cmd run review:outlines
npm.cmd run review:weapons -- --all-frames --tier-sheets
npm.cmd run check
npm.cmd run build
git diff --check
```

The exact transparent-tile command may be added under an npm script when the repository-owned audit tool is implemented.

Required coverage:

- all body builds and outfits;
- all directions, animations, and frames;
- all 75 weapon family/tier variants;
- all 40 shield family/tier variants;
- representative and high-risk weapon/shield combinations;
- None, Complete B, and Selective C;
- effects Off for clean geometry inspection;
- effects On for the final integrated preview;
- out-of-frame instrumentation for weapons, shields, headgear, and repaired body layers.

Required browser review:

1. Start with deterministic presets, not random rolls.
2. Review None first so source geometry is visible.
3. Compare the same frame in Complete B and Selective C.
4. Inspect up/down waist joins.
5. Inspect both side cape views through complete walk and attack cycles.
6. Inspect representative weapon and shield contacts.
7. Toggle effects On and repeat the high-risk attack frames.
8. Leave the exact final candidate open for user inspection.

## Phase 5 - Approval, Documentation, And Checkpoints

1. Show the exact changed files and generated evidence.
2. Obtain explicit visual approval for each repair slice.
3. Update this plan with measured before/after counts.
4. Update `HANDOFF.md` with the exact last reviewed preset, direction, animation, frame, outline mode, and effects state.
5. Keep regression/tooling, body geometry, mixed-owner repairs, and optional equipment redesigns in separate commits where practical.
6. Ask before staging, committing, pushing, or accepting any visual baseline.

Suggested checkpoint boundaries:

1. strict transparency regression and documentation;
2. approved body-only geometry repair;
3. approved mixed-owner contact repair;
4. any separately approved equipment openwork redesign.

## Stop Conditions

Stop and return to diagnosis if a proposed repair:

- fills a bow, shield, staff, or ornament opening without item-specific approval;
- changes equipment sockets, reach, facing, or layer order;
- creates a new frame-edge contact or out-of-bounds write;
- makes animation visibly stiffer;
- changes a large number of unrelated None-mode pixels;
- relies on Complete B or Selective C to hide broken source geometry;
- causes body and equipment outlines to fuse;
- cannot be explained as one named source or contact correction;
- requires accepting new goldens before visual review.

## Deferred Resume Action

If transparency work resumes, continue Phase 1C by grouping the 1,660 advisory
notches by shared outfit/build signature and reviewing one deterministic slice
at a time. Preserve leg separation, collar/neck breathing space, and equipment
openings unless a specific visual candidate is rejected. Do not fold this work
into the current enemy-expansion lane, the deferred effect compositor, or a
release checkpoint; do not begin the broad mixed-owner pass or accept outline
goldens until the body-only classifications are complete and reviewed.
