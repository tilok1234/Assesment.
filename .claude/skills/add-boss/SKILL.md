---
name: add-boss
description: Runbook for authoring a new 48x48 boss (style, directions, full animation set) in the sprite assembler — Python generators, catalogs, roster JSON, and targeted boss gates. Use whenever asked to add or animate a boss.
---

# Add a boss

Environment: `pip install -r requirements.txt` (Pillow ≥11.3) and Node on PATH.
Boss source modules live in `death-review/boss-48-drafts/` (gitignored-but-tracked:
**always `git add -f`** new files there, or gates on other machines lose checkpoints).

## Pipeline (style → directions → animation)

1. **Style** — `death-review/boss-48-drafts/generate_<boss>_style_v1.py`:
   copy the most recent style script (~220 lines), define OUTLINE + material
   ramps and the 24x24 down-facing pose (rect/poly calls). Run it; iterate with
   the designer as vN versions until the down frame is approved.
2. **Directions** — `death-review/boss-48-drafts/generate_<boss>_directions_v1.py`:
   author `left_source()` / `up_source()` (right auto-mirrors). It byte-locks the
   Down frame to the approved style and writes 5 runtime PNGs into
   `engine/assets/bosses/`.
3. Register in `engine/catalogs/boss-directions.js` (one `boss(...)` entry,
   status `'candidate'`) AND append the id to the matching list in
   `tools/fixtures/boss-roster.json`. Run `node tools/check-boss-directions.mjs` (~1s).
4. **Animation** — `tools/generate-<boss>-animation-v1.py`: import the shared
   library like `generate-furious-depraved-rhino-animation-v1.py` does
   (`from boss_animation_authoring_v1 import ...`). NEVER copy one of the eight
   old 500-line scripts — the library owns the plumbing (batched engine
   treatment: one Node spawn per build, ~0.7s for all 80 frames). You author
   only the per-animation pose functions (~150-330 lines).
5. Register in `engine/catalogs/boss-animations.js` (one `animationPilot(...)`
   entry) AND update `tools/fixtures/boss-roster.json`: append to
   `animations.pilots`, `animations.candidates`, `animations.silhouetteStrict`,
   and add the `animations.generators` entry (script filename + direction module).
6. `npm run check:bosses` (~3s) — validates ALL boss invariants (dims, binary
   alpha, 2px safety border, sheet-cell equality, mirror symmetry, distinct
   silhouettes). Missing review checkpoints on this machine are warnings only.
7. Designer reviews in the app's Bosses tab. On approval flip the catalog
   `reviewStatus` and move the id between the roster JSON lists — no checker edits.
8. Commit: the ~96 runtime PNGs, catalogs, roster JSON, and `git add -f` the
   checkpoint copies + source .py under `death-review/boss-48-drafts/`.

## Frozen contract (do not renegotiate per boss)

48x48 frames, rows Down/Left/Right/Up, 20 columns (idle2/walk4/attack4/cast4/
hurt2/death4), binary alpha, 2px safety border, right = mirrored left,
Idle frame 1 byte-equals the approved static direction frame.

## Cleaning up after test builds

A build writes checkpoint copies into the gitignored drafts directory, where
they are INVISIBLE to `git status` and survive plain `git clean -f`. Stray
copies from a machine with a different Pillow version make the byte-parity
gate fail confusingly. Remove them with
`git clean -fx death-review/boss-48-drafts/` — the tracked corpus is safe;
only untracked leftovers go.

## Never

- Never edit count/name literals in `tools/check-boss-*.mjs` — rosters live in
  `tools/fixtures/boss-roster.json`.
- Never run `npm run export:bosses:13` (frozen against a partly nonexistent roster).
- Never run the full `npm run check` per iteration — `check:bosses` is the loop
  gate; run the full check once before commit.
