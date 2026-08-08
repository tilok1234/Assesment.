---
name: add-enemy
description: Runbook for adding an enemy variant or a new enemy family to the sprite assembler — catalog entry, draw function, outline registration, fixture export, and the right-sized checks. Use whenever asked to add, recolor, or extend enemies.
---

# Add an enemy (variant or family)

This is CONTENT AUTHORING, not forge engineering. Do not modify schemas, shared
renderer interfaces, exporters, validators, or the frame contract. If the sprite
cannot be expressed with existing capabilities, STOP and report the smallest
missing capability instead of implementing it here.

## A. New variant of an existing family (~5 minutes)

1. `engine/catalogs/enemies.js` — add ONE line under the family, copying a
   sibling variant's shape (palette keys differ per family: `c`, `skin`+`outfit`,
   `fur`/`wing`, etc. — match the siblings).
2. Renderer edits are NOT normally needed. Only if the variant needs bespoke
   geometry does `engine/renderer.js` get a `V.id === '...'` special case
   (existing examples near L3084-3138) — avoid if possible.
3. `npm run export:fixtures -- --family <family>` — writes the legacy
   1152x384 fixture PNG(s) into `asset-pack/enemies/` and regenerates
   `asset-pack/manifest.json` from the catalog. Never hand-edit either.
4. `npm run check:fast` (~2 min). Golden counts derive from the catalog — no
   checker edits.
5. Show the designer ONLY this variant (app preview or the new fixture). Do not
   generate whole-roster review packs.

## B. New family (new body shape)

1. Family block (5-9 lines) in `engine/catalogs/enemies.js`.
2. Draw function in `engine/renderer.js`:
   - Humanoid? Add the id to `HUMANOID_FAMS` (L~3195) and `HUM_FACE` (L~3108) —
     `drawHumanoid` does the rest.
   - Creature? Copy the closest existing `draw<Family>` (bodies run 23-88
     lines; section banners group quadrupeds/bugs/etc.) and add ONE dispatch
     line to the if-chain at L~3205.
   - Non-default ground shadow → `shadowFor` branch (L~3151).
3. Outline support (only if the designer approved outlines for it):
   - Append the id to `ENEMY_OUTLINE_PILOT_FAMILIES` in `engine/outline-renderer.js`
     and classify it in the relevant registry sets there (L22-190).
   - Append the same id to `tools/fixtures/approved-outline-families.json`.
   - Detached pixels (wings, floating parts)? Also add its minimum-component
     tuning in `outline-renderer.js` — copy a similar family's entry.
4. `npm run export:fixtures -- --family <id>` then `npm run check:fast`.
5. One four-direction Idle review sheet for the designer for THIS family only.
   Batch approvals per slice, not per variant.
6. Before commit (not per iteration): `npm run check`.

## Never

- Never hand-produce fixture PNGs or hand-edit `asset-pack/manifest.json`.
- Never bump counts inside `tools/check-project.mjs` — they derive from the catalog.
- Never run `review:enemy-outlines`/`review:outlines` for a single-family change.
- Never read `docs/archive/*` to figure out this workflow — this file is current.
