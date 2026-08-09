# 8-Bit Sprite Assembler — session guide

Procedural 24x24 pixel-art sprite forge (vanilla JS + Tauri). Players and enemies
render procedurally from `engine/` catalogs; bosses are pre-baked 48x48 PNGs
authored by Python generators. Other repos consume `asset-pack/` and boss packs.

**This file is the session entry point. Do NOT read the archived plan docs in
`docs/archive/` unless researching how a feature was built — they are completed
historical records (~230KB). Live docs: this file, README.md, ARCHITECTURE.md,
HANDOFF.md (state), ENEMY_EXPANSION_PLAN.md + GAME_PACK_EXPORT_PLAN.md (active plans).**

## File map

| Path | Owns | Size warning |
|---|---|---|
| `engine/catalogs/enemies.js` | LEGACY enemy family/variant data (~1 line per variant) | small |
| `engine/enemy-expansion*.js` | EN-expansion facade: registry, slices, repairs, `PUBLIC_ENEMIES` composed catalog | small each |
| `engine/catalogs/player-options.js` | player option catalogs | small |
| `engine/catalogs/animation.js` | frozen frame contract: 24px, 4 dirs, 20 cols (idle2/walk4/attack4/cast4/hurt2/death4) | small |
| `engine/renderer.js` | per-family draw functions + dispatch if-chain (L~3205) + HUMANOID_FAMS (L~3195) | 141KB — read sections, not whole |
| `engine/outline-renderer.js` | outline registries: 8 per-family sets (L22-190) | 36KB |
| `engine/shade-renderer.js` | Form shading (derives from catalog colors — no per-family edits) | 12KB |
| `engine/sheets.js` | sheet builders (browser-only, 20-col contract) | small |
| `app.js` | entire editor UI (catalog-driven — no per-enemy edits) | 168KB — grep, don't read |
| `tools/check-project.mjs` | the master gate | 322KB — never read whole |
| `tools/export-enemy-fixtures.mjs` | headless legacy fixture exporter + manifest regen | small |
| `tools/fixtures/*.json` | approval rosters the checkers compare against | small |
| `asset-pack/` | published legacy pack: 12-col 4x 1152x384 fixtures (frozen LEGACY format — the engine's live format is 20-col; do not "fix" this) | binary |
| `engine/assets/bosses/` | 980 committed boss PNGs (runtime) | binary — don't list casually |
| `death-review/boss-48-drafts/` | boss checkpoint corpus + LIVE boss source .py modules (gitignored-but-tracked; only partially committed) | mixed |

## Verification tiers — run the cheapest sufficient check

| Change | Command | Cost |
|---|---|---|
| One enemy variant/family iteration | `npm run check:fast` | ~1 min recent |
| Boss catalog/asset work | `npm run check:bosses` | ~3s |
| Fixture export sanity | `npm run export:fixtures -- --verify --family <id>` | seconds |
| Pre-commit / checkpoint | `npm run check` (full) | ~2 min recent |
| Release | `npm run check && npm run check:release` | full |

`npm run check` passes on a fresh clone; missing boss review checkpoints are
WARNINGS (byte-parity runs only where the corpus exists — complete corpus lives
on the designer's machine; `check:bosses:strict` enforces it there).

## Add an enemy variant (~5 min)

1. Add one variant line under the family in `engine/catalogs/enemies.js`.
2. `npm run export:fixtures -- --family <family> --variant <new-id>` — renders
   the new fixture PNG and updates `asset-pack/manifest.json` from the catalog.
   (The exporter never overwrites existing published fixtures whose pixels
   differ from the current engine; that needs `--accept-drift`, which is a
   designer decision — see Known state.)
3. `npm run check:fast`. Done. (Golden counts derive from the catalog now.)

## Add an enemy family

1. Family block in `engine/catalogs/enemies.js`.
2. Draw function in `engine/renderer.js` (median ~47 lines — copy the closest
   body shape; humanoids share `drawHumanoid`) + one dispatch line (L~3205);
   humanoids also append to `HUMANOID_FAMS` (L~3195) and `HUM_FACE` (L~3108).
3. If outline support is approved: append the id to
   `engine/outline-renderer.js` registries AND `tools/fixtures/approved-outline-families.json`.
4. `npm run export:fixtures -- --family <id>`, then `npm run check:fast`.
5. Generate the review sheet for designer approval only for the changed family.

## Add a boss (see .claude/skills/add-boss for the full runbook)

style .py → review → directions .py → catalog `boss-directions.js` + `tools/fixtures/boss-roster.json`
→ animation .py (import `tools/boss_animation_authoring_v1.py` — never copy-paste the old 500-line scripts)
→ catalog `boss-animations.js` + roster JSON (incl. generator filename) → `npm run check:bosses`.
Python needs `pip install -r requirements.txt` (Pillow ≥11.3) and Node on PATH.

## Hard rules

- Frame contract is frozen: 24px cell, Down/Left/Right/Up rows, 20 columns,
  binary alpha, no antialiasing/scaling/cropping. Bosses: 48px, 2px safety border.
- `asset-pack/` PNGs must stay 1152x384 legacy 12-col format (the exporter does this).
- Boss runtime assets live flat in `engine/assets/bosses/` with frozen naming.
- Imports from outside the engine go through `sprite-engine.js` only.
- Never run `export:bosses:13` — its frozen roster currently lacks four
  direction and seven animation catalog entries.
- Don't edit checker roster literals — they live in `tools/fixtures/*.json`.
- Scope reviews to the changed family/boss; whole-roster review packets are
  release-time only.

## Known state (2026-08-09)

- Legacy catalog: 57 families / 202 variants (engine/catalogs/enemies.js, feeds
  asset-pack). The stable expansion registry contains 17 families / 43 variants
  across approved EN-E01, EN-E02, EN-E04, and EN-E05. The separately
  authorized assembler consumer registry now reuses that exact 17-family /
  43-variant registry, so `engine.PUBLIC_ENEMIES` is 74 families / 245
  variants. EN-E03 remains isolated historical evidence and is not registered.
- The EN-E05 registration gate
  `en-e05-five-undead-registration-v1` is published on
  `codex/en-e05-registration` at `7d273ef`. It registers exact approved
  `mummy/tomb-walker`, `vampire/night-noble`,
  `revenant/grave-oathkeeper`, and `lich/soul-regent` families plus one
  separate internal `ghoul-upgrade/ghoul` replacement record targeting legacy
  `zombie/ghoul`. All 400 source/registered frames and 320 composed-stable
  frames match; aggregate digest is
  `732c6097b237131e85bdf435112c2bed7ec1f8bf8317dee4e42605f0c1730d32`.
  That checkpoint was stable-only; the later consumer gate below exposes only
  the four new families. Do not replace public Ghoul, regenerate fixtures, or
  begin Wave 2 without another explicit gate.
- The separate EN-E05 consumer gate `en-e05-assembler-consumers-v1` is
  published on `codex/en-e05-assembler-integration` at `773cfad`. It exposes
  exact `mummy/tomb-walker`, `vampire/night-noble`,
  `revenant/grave-oathkeeper`, and `lich/soul-regent` through the existing
  generic selectors, randomization, persistence, dispatcher, sheet,
  thumbnail, pack, Complete Kit, and Wildshot routes. All 320 public frames
  match the registered sources at digest
  `947cec4df921761cd5eba378991d7a35b3d773d7e5c0e7c80526ecc6a846a46f`;
  the Complete Kit is 74 families / 245 enemy sheets / 2,182 PNGs. This gate
  creates no new sprite pixels and does not alter fixtures.
- EN-E05's first isolated, visually approved lane is the full-suite Ghoul
  upgrade lane on `codex/en-e05-ghoul-upgrade`, committed and pushed at
  `88d32e9`. Approval applies only to the exact hash-frozen 80-frame candidate
  and bounded branch publication. The later registration gate records it only
  in a separate internal replacement registry. Public `zombie/ghoul`, all
  Zombie siblings, and the frozen legacy fixture remain unchanged; public
  replacement and fixture regeneration require separate gates.
- The approved second EN-E05 lane is one full-suite Mummy Tomb
  Walker on `codex/en-e05-mummy`, based exactly on the published Ghoul handoff
  `1aa733c`, committed and pushed at `85f1ed7`. It is internal and non-public;
  its 80 frames, paired raw and Complete B + Form evidence, and approved-Ghoul
  comparison are hash-frozen. Its exact approved variant is registered and now
  exposed through the generic EN-E05 consumer layer; fixtures remain gated.
- The approved third EN-E05 lane is one full-suite Vampire
  Night Noble on `codex/en-e05-vampire`, based exactly on reconciled Mummy
  handoff `3387bf2`, committed and pushed at `6a7cce2`. It is internal and
  non-public; its 80 frames, paired raw and Complete B + Form evidence, and
  approved-Mummy comparison are hash-frozen. Its exact approved variant is
  registered and now exposed through the generic EN-E05 consumer layer;
  fixtures remain gated.
- The approved fourth EN-E05 lane is one full-suite Revenant
  Grave Oathkeeper on `codex/en-e05-revenant`, based exactly on reconciled
  Vampire handoff `16f5876`, committed and pushed at `7434578`. It is internal
  and non-public; its 80 frames, paired raw and Complete B + Form evidence, and
  approved-Vampire comparison are hash-frozen. Its exact approved variant is
  registered and now exposed through the generic EN-E05 consumer layer;
  fixtures remain gated.
- The approved fifth EN-E05 lane is one full-suite elite Lich
  Soul Regent on `codex/en-e05-lich`, based exactly on clean reconciled
  Revenant handoff `97db37e`, committed and pushed at `4cebc7b`. Its 80
  connected and bounded frames, approved-Revenant comparison, raw/no-outline
  board and GIF, and Complete B + Form board and GIF are hash-frozen. Its exact
  approved variant is registered and now exposed through the generic EN-E05
  consumer layer; fixtures, effects, and Wave 2 remain gated.
- 166 of 202 committed asset-pack fixtures are STALE vs the current engine
  (approved repair waves were never re-exported). `npm run export:fixtures -- --verify`
  lists them. The exporter refuses to overwrite them without `--accept-drift`;
  regenerating is a designer decision (downstream repos consume the pack) —
  never pass `--accept-drift` on your own initiative.
- `review:outlines` is stale (expects 240/720 cases, actual 400/1200) — do not
  trust its 31 errors until its counts and baseline hashes are recaptured.
