# Equipment Outline Assessment And Plan

Status: assessment complete; no outline implementation or sprite artwork was changed during this audit.

Safe committed recovery point: `674d926`.

The current outline experiments remain uncommitted. `HANDOFF.md` was already modified before this assessment and remains outside this plan's ownership.

## Assessment Scope

The audit rendered every equipped family at every tier, direction, animation, and frame:

- 15 weapon families × 5 tiers × 48 directional animation frames = 3,600 weapon frames
- 8 shield families × 5 tiers × 48 directional animation frames = 1,920 shield frames
- 5,520 total equipment frames
- None, Complete B, and Selective C comparisons on deterministic visual matrices
- Native 24×24 construction plus enlarged nearest-neighbor review

The measurements are diagnostic signals, not automatic art verdicts. Small readable items naturally have a high outline-to-source ratio, so every metric ranking was checked against the rendered matrices.

## Main Finding

This is not one universal failure and should not receive one universal fix.

1. Some families already work and should be protected as controls.
2. Some weapons have good source silhouettes but receive too much outline around cavities or very thin parts.
3. Some shields are too fragmented or transparent for any generic outline pass to make consistently readable.
4. A few families have mixed problems and need the algorithm stabilized before deciding how much artwork must change.

## Weapon Assessment

| Group | Families | Assessment | Planned treatment |
| --- | --- | --- | --- |
| Stable controls | Sword, Greatsword, Scimitar, Axe, Mace, Warhammer, Spear, Club, Spellbook | Generally readable in front and profile samples. Some frames touch the cell edge, but the silhouettes survive. | Preserve; use these as regression controls. |
| Interior-cavity priority | Bow, Crossbow | Bow has by far the highest interior-outline load; Crossbow has the lowest fill density and becomes crowded across the torso. | Fix outline policy first. Do not redesign the source art until the pilot is reviewed. |
| Thin-shaft priority | Staff | Lowest-density long weapon and the most frequent cell-edge contact. Side attacks can reduce to a dark shaft plus a tiny colored head. | Test a lighter thin-form outline rule while preserving anchors and reach. |
| Small-item outline pressure | Dagger, Rapier, Wand | Their source art can be readable, but a one-pixel halo is enormous relative to the item and can dominate the colored core. | Test scale-aware restraint; do not enlarge or move the items in the first pass. |

Important measurements:

- Bow interior-outline load: 72.0 interior contour pixels per 100 equipment pixels across the full matrix.
- Crossbow fill density: 0.289, the lowest weapon-family density.
- Staff edge contact: 80 of 240 family frames, the highest weapon-family total.
- Dagger and Wand have the highest total outline-to-equipment ratios, but visual inspection shows this is primarily a tiny-item halo problem rather than proof that their source silhouettes are invalid.

## Shield Assessment

| Group | Families / tiers | Assessment | Planned treatment |
| --- | --- | --- | --- |
| Stable controls | Tower, Kite | The strongest continuous shield faces. Tower remains readable even when large and ornate; Kite keeps a recognizable shield silhouette. | Preserve as controls. |
| Usable with targeted cleanup | Heater, Round, Oval | Core shield identity survives, but late-tier ornaments and disconnected accents create avoidable outline noise. | Reassess after the algorithm pilot; only simplify the offending late-tier clusters if still needed. |
| Definite source-silhouette rework | Bone, especially T3–T5 | Front views read as ladders or cages. Bone has fragmented output in 144 of 240 family frames and substantial interior-outline load. | Build a continuous bone rim/plate while preserving the bone identity and existing grip anchors. |
| Definite late-tier rework | Arcane T3–T5 | The colored pieces split into a magical star/device rather than a held shield. T3–T5 are multi-component in every frame. | Unite the crystal/rune pieces around one continuous shield mass. |
| Definite late-tier rework | Buckler T4–T5 | Interior gaps and spokes create the highest shield interior-outline pressure. | Replace transparent spokes with a compact continuous disk/rim and colored construction bands. |

Important measurements:

- Bone and Arcane are fragmented in 144 of 240 frames each.
- Buckler has the highest shield interior-outline load at 9.85 per 100 equipment pixels; T4 alone reaches 20.69.
- Tower has a much higher fill density (0.686) than every other shield family and is the clearest control proving that a continuous main face improves readability.
- Solidity alone is not sufficient: the large item must still have a recognizable rim, face, grip relationship, and value hierarchy.

## Rules For Any Shield Rework

- Preserve every existing hand/grip anchor, directional placement, animation motion, and 24×24 frame contract.
- Do not move arms, bodies, heads, weapons, or the complete character rig.
- Give the shield one continuous primary face or rim.
- Replace repeated one-pixel holes and disconnected spokes with material pixels or value bands.
- Keep at most one or two deliberate silhouette-defining openings.
- Preserve the family identity: bone must still read as bone, Arcane as a magical shield, and Buckler as a small hand shield.
- Judge the composed character, not an isolated layer alone.

## Implementation Plan

### Stage 0 — Explicit checkpoint

Before any new implementation, ask for approval to create a labeled checkpoint of the currently accepted uncommitted outline work. Exclude the pre-existing `HANDOFF.md` change. Do not reset, revert, stash, commit, or push without explicit approval.

### Stage 1 — Algorithm-only pilot

Change only outline composition and its tests. Do not edit renderer geometry or sprite art.

Pilot set:

- Tower T3: solid shield control
- Sword T3: ordinary weapon control
- Bow T3 and T5: large intentional cavity
- Crossbow T5: compact low-density cavity
- Staff T3: thin-shaft case
- Dagger T1: tiny-item halo case
- Bone T3: known source-art failure used to prove the algorithm does not pretend to solve everything

Goals:

- Keep a clean exterior silhouette around all equipment.
- Stop treating every tiny transparent pocket as equally important.
- Preserve large intentional openings when they define the item, especially bows.
- Limit direct-contact separators to the minimum pixels needed for depth readability.
- Never replace foreground equipment pixels.
- Never replace visible headgear pixels.
- Keep None mode pixel-identical.

Stop after the pilot and obtain visual approval. Do not continue into artwork changes automatically.

### Stage 2 — Shield-art pilot

Only after Stage 1 is approved, rework one representative shield family while preserving all anchors and motion:

1. Bone T3 as the first source-art pilot.
2. Compare every direction, animation, and frame in None and both outline modes.
3. Obtain approval before applying the construction pattern to Bone T1–T5.
4. Repeat separately for Arcane T3–T5 and Buckler T4–T5.

Round, Oval, and Heater remain untouched until the primary failures are solved and reassessed.

### Stage 3 — Full regression and random-pool review

- Re-render all 5,520 equipment frames.
- Verify None-mode parity for every algorithm-only change.
- Verify foreground equipment and headgear preservation.
- Check every family at native 24×24 and enlarged nearest-neighbor scale.
- Run deterministic random composed characters across body builds, species, headgear, outfits, directions, and animation frames.
- Run `npm run review:outlines`, `npm run review:weapons -- --all-frames`, `npm run check`, and `npm run build`.
- Present the Forge result for approval before commit or push.

## Stop Conditions

Stop and return to the last approved checkpoint if any stage:

- edits body, arm, head, or equipment placement without explicit approval;
- removes existing foreground equipment or headgear pixels;
- makes a stable control family less readable;
- fixes only named screenshots instead of the family-wide matrix;
- changes sprite art during the algorithm-only stage;
- broadens shield rework beyond the approved family/tier pilot.

## Recommended Next Action

Review and approve this assessment. If approved, create the explicit checkpoint described in Stage 0, then implement only the seven-case algorithm pilot from Stage 1.
