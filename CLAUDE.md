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

## Known state (2026-08-10)

- Legacy catalog: 57 families / 202 variants (engine/catalogs/enemies.js, feeds
  the frozen asset pack). The stable and consumer expansion registries now
  contain 23 families / 57 variants across approved EN-E01 through EN-E06, so
  `engine.PUBLIC_ENEMIES` is 80 families / 259 variants. EN-E03 contributes
  only its six completed full suites; Boulder Hurler, Storm-Clan Jarl, and Sun
  Lancer remain internal Idle-only evidence.
- Current integration gate: `codex/approved-enemy-assembler-integration`
  registers all eight completed EN-E06 suites, adopts the six completed EN-E03
  suites, and routes public `zombie/ghoul` through the approved Ghoul Upgrade
  without adding a duplicate selector family. Focused digest:
  `74953d1b8531be86bf3f551b15fc70aa4ff142d954763ad4183eb36e06fd6497`.
  The Complete Kit is 80 families / 259 enemy sheets / 2,196 PNGs; the
  24-player Complete Pack maximum is 2,219 PNGs. All 232 legacy fixtures stay
  byte-unchanged, including the intentionally historical Ghoul fixture. Source
  and documentation are committed and pushed at
  `90ac018923fbaa9906cd47cdc9ef22f0db77336a`.
- Publication permission: after explicit approval of an exact artifact or
  digest, the designer authorizes its bounded implementation, approval-record,
  reconciliation commits, and branch push. Never infer approval for
  registration, fixtures, effects, later roles/families, release, or another
  gate.
- Current isolated art candidate:
  `codex/en-e07-doppelganger-pale-echo`, based exactly on clean published
  Hollowcrown reconciliation `6ff54c3a926436083675ec8f7e2d0230cc073ac5`,
  contains one private common Doppelganger Pale Echo. Its repaired frozen
  80-frame digest is
  `c3fa12cb4bb0be432e955adfc32f331286e55c65cbd7a38250bdf0d120fa6596`.
  All frames are connected, one-cell-bounded, grounded, hard-alpha, and
  pixel/alpha distinct from public Bandit Thug, Cultist Acolyte, and Dark Elf.
  The authored default form uses pale gray-rose skin, uneven charcoal-violet
  fringe, offset eyes, mismatched shoulders, split slate/wine short tunic, one
  ordinary hand, one connected long-finger mimic hand, separated legs, and
  grounded boots. The initial 218-271-pixel diagnostic silhouette was rejected
  before freeze; the repaired public-humanoid-scale version is 186-245 opaque
  pixels. The five exact review artifacts reproduce byte-for-byte, and the
  protected 21-gate matrix, `check:fast`, and full `check` pass with the
  approved 1,200-frame integration digest and all 232 fixtures exact. The
  candidate is not visually approved, committed, or published. Do not
  register Doppelganger, generate fixtures, implement runtime copying, add
  effects, start another role or family, release, or advance EN-E08. Do not
  commit or push this candidate before explicit approval of the exact digest.
- Approved preceding art checkpoint:
  `codex/en-e07-living-shadow-hollowcrown-regent`, based exactly on clean
  published Nightglass reconciliation `46ad4e7759a1ef3a096ba326d96cdef44d1ee3b1`,
  contains one private elite Living Shadow Hollowcrown Regent. Its frozen
  80-frame digest is
  `657e4071ab8432387f7c8b6ecff8650f3f7a63bf7dc8f4b68564373a5e450991`.
  All frames are connected, one-cell-bounded, grounded, hard-alpha, and
  pixel/alpha distinct from public Cursed Ghost, public Shadow Slime, approved
  Mist Weaver, Gloam Walker, and Nightglass Seer. The approved family ramp is
  carried by a connected three-prong crown, high mantle, paired narrow eye
  slits, diamond void-heart, command bracers, armored split legs, and broad
  throne-step feet. The five exact review artifacts reproduce byte-for-byte,
  and the protected 20-gate matrix, `check:fast`, and full `check` pass with the
  approved 1,200-frame integration digest and all 232 fixtures exact. The exact
  packet was opened in Aseprite and the designer replied `approved lets do
  next`; implementation `ffe5f574ab9f06ecfaad83c50a7980254eea7211` and
  approval record `90a06bd34e1bae29becdc380b01895825cf4a969` plus initial
  handoff `0c3d671bee3013413291170e127d3820cdcaff95` are published and remote
  verified. The same response opens only one private common Doppelganger
  candidate from the clean publication reconciliation. Do not register Living
  Shadow, generate fixtures, add effects, start another role or family beyond
  that candidate, release, or advance EN-E08.
- Earlier approved art checkpoint:
  `codex/en-e07-living-shadow-nightglass-seer`, based exactly on clean
  published Gloam Walker reconciliation `98d3781b81c8c7ff615ad3cd6562efe12ce63d94`,
  contains one private specialist Living Shadow Nightglass Seer. Its frozen
  80-frame digest is
  `07909fa9b74df6dd386ca3f6186fe4da26e8d088af99ad7e2dfa2bcdeb10d3fa`.
  All frames are connected, one-cell-bounded, grounded, hard-alpha, and
  pixel/alpha distinct from public Cursed Ghost, public Shadow Slime, approved
  Mist Weaver, and approved Gloam Walker. The approved violet-black family ramp
  is carried by a broad faceted mask, one true vertical eye, a connected
  shoulder yoke, squared sight-frame arms, a narrow chest aperture, bent split
  legs, and planted wedge feet. The five exact review artifacts reproduce
  byte-for-byte. The exact packet was opened in Aseprite and the designer
  replied `approved lets do next`; implementation
  `325a6f4cfa1418383c93510262a631358add1d5f` and approval record
  `d50f3af5da0578edf66a5b2f156744c576427b9c` plus initial handoff
  `71d36ef48a55a7f1d49e1e6649a33eb945c9667c` are published and remote
  verified. The protected 19-gate matrix, `check:fast`, and full `check` all
  pass; the approved 1,200-frame integration digest and all 232 fixtures remain
  exact. The same response opens only the Hollowcrown Regent gate above. Do not
  register Living Shadow, generate fixtures, add effects, start another EN-E07
  family, release, or advance EN-E08.
- Earlier approved art checkpoint:
  `codex/en-e07-living-shadow-gloam-walker` contains exactly one private common
  Living Shadow Gloam Walker. The frozen
  80-frame digest is
  `131a95a106a36dea2f6879611c8e14e3aa077012dcbd1bd32e111c45658ca3f9`;
  all frames are connected, one-cell-bounded, grounded, hard-alpha, and
  pixel/alpha distinct from public Cursed Ghost, public Shadow Slime, and
  approved Mist Weaver. The style contract requires chunky one-to-three-pixel
  forms, a tight dark-violet ramp, connected hollow face/torso negative space,
  and clearly split planted legs. The exact raw, Complete B + Form, comparison,
  and paired GIF evidence was presented and the three exact PNGs were opened
  together in Aseprite; the designer replied `aaprovced` on 2026-08-10.
  Implementation `a46f59c1cb0bb751760f2776fe60b5c489806c94` and approval
  record `848c7192b6dc2cac8b7ab2dc8725d3859447715d`, and initial handoff
  `00d5b436c7398312a5f3a05a482b4cf34cee9ba5` are committed and pushed.
  Rivercrown reconciliation `d785fe5` is also pushed. That approval did not
  register Living Shadow, generate fixtures, add effects, release, or open
  another family; the later `lets do next` opens only the Nightglass Seer gate
  above.
- Approved EN-E06 predecessor: `codex/en-e06-nymph-rivercrown-muse`,
  based exactly on clean published Mist Weaver handoff `983b76a`, contains one
  complete approved elite Nymph. Its 80 frames pass connected, one-cell-bounded, grounded,
  hard-alpha, alias, mirror, and 80/80 pixel plus alpha-silhouette distinctions
  from public Elf Mage, approved Spring Dancer, and approved Mist Weaver at
  digest `4917d42fd0b480e4c2635ba4c96725e6b68afec1075dacb8acee2f70dc886bcd`.
  The exact five-artifact packet was opened together in Aseprite and visually
  approved on 2026-08-10. Frozen implementation `39bd065` and approval record
  `ca82f07` are committed and pushed. Full post-approval validation passes in
  111.7s with all 232 fixtures valid. Public Nymph remains absent within 80/259.
  That approval itself stopped before registration, fixtures, EN-E07, effects,
  or release; the later `lets do next` opens only the Gloam Walker gate above.
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
  the four new families. At the registration checkpoint, public Ghoul,
  fixtures, and Wave 2 were still separate closed gates.
- The separate EN-E05 consumer gate `en-e05-assembler-consumers-v1` is
  published on `codex/en-e05-assembler-integration` at `773cfad`. It exposes
  exact `mummy/tomb-walker`, `vampire/night-noble`,
  `revenant/grave-oathkeeper`, and `lich/soul-regent` through the existing
  generic selectors, randomization, persistence, dispatcher, sheet,
  thumbnail, pack, Complete Kit, and Wildshot routes. All 320 public frames
  match the registered sources at digest
  `947cec4df921761cd5eba378991d7a35b3d773d7e5c0e7c80526ecc6a846a46f`;
  at that checkpoint the Complete Kit was 74 families / 245 enemy sheets /
  2,182 PNGs. This historical gate
  creates no new sprite pixels and does not alter fixtures.
- Historical Wave 2 source checkpoint: the work was once active only through private Hag gate
  `en-e06-hag-mire-crone-full-v1` on `codex/en-e06-hag-mire-crone`, based
  exactly on clean Petalcrown publication record `5c9363e`. Approved
  Bramblewing Scout, Thistle Hexer, and Petalcrown Duelist remain exact and
  published at `cc92ca9`, `3dc68cb`, and `b265e97`. After Petalcrown
  publication, the designer said `lets do nextr`, authorizing only one complete
  common Mire Crone. Its private 80-frame suite passes 80/80 connected,
  bounded, grounded frames; all 80 pixel frames and alpha silhouettes differ
  from public Witch/Hexer; candidate digest is
  `f35512e73fd7b2308bf408f11c2d21a30631361214a372df7bef2e8fc4e6478d`.
  The exact Mire Crone boards and paired GIFs were approved on 2026-08-09 and
  its bounded implementation is published at `25f67d4`. The later designer
  `next` opens only private specialist Cauldron Hexer on
  `codex/en-e06-hag-cauldron-hexer`, based at `b4ad5cd`. Its 80-frame candidate
  passes connected, bounded, grounded, alias, mirror, and 80/80 Mire alpha-
  distinction gates at digest
  `17f40220730fe4e83be26156d73e0599235be66a9290284b37cb9c8282c7a1a6`.
  Its exact packet was approved on 2026-08-09 and the bounded implementation is
  published at `4b59b40`, with clean handoff `0a096fa`. It remains absent from
  the public facade, catalog, and fixtures. The approval reply opened only one
  complete Blackthorn Matron lane on
  `codex/en-e06-hag-blackthorn-matron`. Its private 80-frame candidate passes
  80/80 connected, bounded, grounded frames and differs from both approved
  Hags in every pixel frame and alpha silhouette at digest
  `d4588d754e01dbb4916949f27b801342a310706890a0532a0133216d7cb0c7a9`.
  Its exact boards and GIFs were visually approved on 2026-08-09 and the
  bounded implementation is published at `8ce2f2a`, with clean handoff
  `8e56ec2`. The later `cool next please` opened only common Dryad Grove Tender
  on `codex/en-e06-dryad-grove-tender`. Its private 80-frame suite passes
  80/80 connected, bounded, grounded frames and differs from public Treant and
  approved Blackthorn in every pixel frame and alpha silhouette at digest
  `18fedaf06c457c8a280b3c5518b0763be48de3b3cb5bd29113f0fd5d183e3a21`.
  The exact boards and GIFs were visually approved on 2026-08-09 and the
  bounded implementation is recorded at `3d96fed`, with published approval
  handoff `4c49f27`. The approved private Spore Cantor suite on
  `codex/en-e06-dryad-spore-cantor` passes 80/80 connected, bounded, grounded,
  Treant-distinct, and Grove-distinct frames at digest
  `b22585e7b055f4ae43eb1293741967c1d76ec9bd3b842320880f2038c0cf62ef`.
  Its fungal crown, gills, shelves, and fruiting bodies remain connected while
  spore clouds and motes stay external. The exact raw and outlined review
  packet was visually approved on 2026-08-09; implementation `46d1dc9` and
  approval record `61d1fa4` are published. At that historical checkpoint,
  registration, fixtures, Heartwood Warden, effects, and broader Wave 2 work
  remained closed; the later current gate above authorizes Heartwood separately.
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
  consumer layer. At that checkpoint fixtures, effects, and Wave 2 remained
  gated; at that historical checkpoint, approved Bramblewing and Thistle plus
  the then-unapproved Petalcrown candidate were the only Wave 2 work. Current
  EN-E06 state is governed by the published Fairy, Hag, and Dryad records above.
- 166 of 202 committed asset-pack fixtures are STALE vs the current engine
  (approved repair waves were never re-exported). `npm run export:fixtures -- --verify`
  lists them. The exporter refuses to overwrite them without `--accept-drift`;
  regenerating is a designer decision (downstream repos consume the pack) —
  never pass `--accept-drift` on your own initiative.
- `review:outlines` is stale (expects 240/720 cases, actual 400/1200) — do not
  trust its 31 errors until its counts and baseline hashes are recaptured.
