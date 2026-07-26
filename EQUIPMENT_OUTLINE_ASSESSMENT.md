# Equipment Outline Assessment And Plan

Status: historical assessment, reconciled against the current branch on
2026-07-26. It is not the active implementation plan.

This document records the evidence that led to the current equipment-readability plan. Its earlier recommendation to continue with an outline-algorithm pilot has been completed and is now superseded by `EQUIPMENT_READABILITY_PLAN.md`. The outline implementation above the safe committed checkpoint is frozen while the remaining problems are handled according to their actual cause.

Historical checkpoints: `674d926` introduced the optional outline implementation
and `aaa7a89` recorded this assessment. Both precede the pushed shield
hand/facing checkpoint `f21cbe3` and the later local enemy-outline branch.

## Assessment Scope

The audit rendered every equipped family at every tier, direction, animation, and frame:

- 15 weapon families x 5 tiers x 48 directional animation frames = 3,600 weapon frames
- 8 shield families x 5 tiers x 48 directional animation frames = 1,920 shield frames for the single-build historical review
- 5,520 total equipment frames in that historical review; the current validator expands shield coverage across all four body builds for 7,680 shield cases and 11,280 weapon-plus-shield cases
- None, Complete B, and Selective C comparisons on deterministic visual matrices
- native 24x24 construction plus enlarged nearest-neighbor review

The measurements are diagnostic signals, not automatic art verdicts. Small readable items naturally have a high outline-to-source ratio, detached pixels may be intentional motion effects, and expression overlaps may be correct depth composition. Every metric was checked against rendered characters.

## Main Finding

This is not one universal failure and should not receive one universal fix.

1. The current outline system is a usable baseline and should be frozen during the first source-art prototypes.
2. Fourteen weapon families remain acceptable as the current baseline.
3. Crossbow T5 has a source-silhouette problem even without a shield; more outline cannot make it read reliably as a crossbow.
4. Crossbow T2 reads in isolation but can fail beside dense shields; that belongs to a later composition review.
5. Bone T3-T5, Arcane T3-T5, and Buckler T4-T5 need more coherent shield structure rather than more general outline.

## Weapon Reassessment

| Verdict | Families / tiers | Treatment |
| --- | --- | --- |
| Accept source silhouette as current baseline | Sword, Greatsword, Scimitar, Rapier, Dagger, Axe, Mace, Warhammer, Spear, Club, Bow, Staff, Wand, Spellbook | Protect their source identities. Animation frame-safety is assessed separately in `EQUIPMENT_READABILITY_PLAN.md`. |
| Iterate source art | Crossbow T5 | Prototype only this tier while preserving every anchor, pose, direction, frame, and renderer rule. |
| Later composition review | Crossbow T2 with a shield | Keep separate from source-art and outline work; do not move equipment without explicit approval. |
| Local monitoring | Mace/Warhammer protrusions; thin Staff/Wand/Dagger/Rapier frames | Inspect individual failures only. Do not create a global thickness or outline rule. |

The regenerated audit produced 37 review sheets for all 15 families, 75 family/tier variants, and 3,600 assembled frames. Every weapon family/tier source layer remained a single connected component in the audit (`maxComponents=1`). This is useful mechanical evidence, not a substitute for the visual verdict. A later instrumented frame-safety audit proved that some attack geometry is discarded outside the 24x24 canvas; source-silhouette acceptance does not override that animation defect.

## Shield Assessment

| Group | Families / tiers | Assessment | Planned treatment |
| --- | --- | --- | --- |
| Stable controls | Tower, Kite | Strong continuous shield faces and recognizable silhouettes. | Preserve as controls. |
| Secondary review | Heater, Round, Oval | Core shield identity survives; late-tier detail may create local noise. | Reassess only after the primary prototypes. |
| Source-structure prototype | Bone T3-T5 | Front views can read as ladders or cages. | Begin with Bone T3 and build a continuous bone rim or plate. |
| Source-structure prototype | Arcane T3-T5 | Pieces can split into a magical device rather than a held shield. | Unite the crystal/rune pieces around one coherent shield mass. |
| Source-structure prototype | Buckler T4-T5 | Interior gaps and spokes create excessive visual fragmentation. | Begin with T4 and retain a compact continuous disk or rim. |

## Rules For Any Source-Art Rework

- Preserve every existing hand/grip anchor, directional placement, animation motion, and 24x24 frame contract.
- Do not move arms, bodies, heads, weapons, shields, or the assembled character rig.
- Change one named family/tier prototype at a time.
- Keep the family identity and existing gameplay-scale proportions.
- Judge the composed character as well as the isolated equipment layer.
- Compare None, Complete B, and Selective C without changing the outline algorithm.
- Stop for visual approval before extending a prototype to another tier.

## Validation And Stop Conditions

For every approved prototype:

- render every affected direction, animation, and frame;
- verify untouched assets and character pixels are unchanged;
- run `npm run review:outlines`, `npm run review:weapons -- --all-frames`, `npm run check`, and `npm run build`;
- present before/after evidence and the exact changed files before requesting approval.

Stop if work changes character anatomy or placement, mixes source-art and outline changes, solves only one screenshot, makes a stable control worse, or expands beyond the approved family/tier.

## Historical Outcome And Deferred Continuation

The Crossbow T5 source-art prototype, animation frame-safety correction, and shield hand/facing checkpoint were completed after this assessment. The remaining Bone, Arcane, Buckler, and dense-equipment notes are diagnostic history, not permission to redesign those assets.

The default assembler combat-effect preview interacting incorrectly with
approved shield pixels remains unresolved, but it is deferred rather than the
active lane. The complete enemy-outline rollout is approved at `ac860aa`; the
next planned feature is `SHADE_RENDERING_PLAN.md`, which explicitly excludes
effect/shield compositing. If equipment work resumes, follow `HANDOFF.md`,
reproduce the effect-enabled UI state, change compositor/occlusion behavior
rather than approved shield art, and obtain visual approval before returning
to Bone T3 or broader redesigns.
