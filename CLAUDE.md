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

## Known state (2026-08-11)

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
- Current approved art publication checkpoint:
  `codex/en-e07-changeling-mirrorfold-harrier`, based exactly on clean
  published Veilskin Foundling reconciliation
  `5eabfecc08f992db675b64ea3317eb59f67d737c`, contains one private specialist
  Changeling Mirrorfold Harrier candidate. Its frozen 80-frame digest is
  `be3e4d03263929ce9677fcf15b742cde769271d037160cd6461b45ea389660f2`.
  The compact grounded form uses one connected stepped diamond mantle, angular
  shoulders, one centered readable face, plum-copper pinched folds, paired long
  ordinary forearms, bent separated legs, and narrow wedge feet. All 80 frames
  are connected, bounded, grounded, hard-alpha, retain the diamond shoulder
  span and narrow paired-leg row, and differ in pixels and alpha from approved
  Veilskin Foundling, Pale Echo, and Falseface Adept. The packet passes 72/72
  colored frames, 8/8 exact white flashes, 54/54 expected eye-bearing views,
  54/54 readable face-feature views, exact Cast/Death aliases, side mirrors,
  public 80/259, unchanged fixtures, `check:fast` in 56.7s, and full `check` in
  106.1s. Run
  `npm.cmd run review:enemy-expansion-en-e07-changeling-mirrorfold-harrier`
  and
  `npm.cmd run check:enemy-expansion-en-e07-changeling-mirrorfold-harrier`.
  The exact raw, Complete B + Form, and comparison PNGs are open together in
  responsive Aseprite 1.3.17.2 process 40804, whose command line names all
  three paths. The designer replied `approved lets do next` on 2026-08-11;
  exact implementation `ab72a9c0600f016439a5351f363b3b34348dc4b1` is
  remote-verified, with approval-record revalidation and reconciliation in
  progress. After that bounded tuple is reconciled, the same reply opens only
  one private elite Changeling candidate. Registration, fixtures, runtime
  copying, effects, Kelpie, release, and EN-E08 remain separate gates.
- Approved preceding isolated art checkpoint:
  `codex/en-e07-changeling-veilskin-foundling`, based exactly on clean
  published Mirecrown Beacon reconciliation
  `4ee32622ec2984ac805ac345b854f23584fda3c3`, contains one private common
  Changeling Veilskin Foundling candidate. Its frozen 80-frame digest is
  `e472931d214d369331d6cb750619471d9234ab11561233e700facab6ea4f0126`.
  The small grounded fey form uses one connected pear-shaped living veil, one
  centered face, a narrow ochre-coral folded torso, paired short ordinary
  arms, bowed separated legs, and broad splayed feet. The first digest
  `1a852ef46dcaa7fee5779379cb9eda9acd79e67cd53dd469ff9cfae9dc18844d`
  is superseded after the designer said `could need a more readable face`.
  The repair adds connected dark eye sockets, retained amber glints, and a
  tiny mouth mark only; silhouette, body, and motion remain unchanged. All 80 frames are
  connected, one-cell-bounded, grounded, hard-alpha, and pixel/alpha distinct
  from approved Pale Echo, public Goblin Scout, and public Imp Sprite. The
  packet passes 72/72 colored frames, 8/8 exact white flashes, 54/54 expected
  eye-bearing views, 54/54 readable face-feature views, exact Cast/Death aliases, side mirrors, public 80/259,
  approved Mirecrown and Pale Echo protection, and unchanged fixtures. Run
  `npm.cmd run review:enemy-expansion-en-e07-changeling-veilskin-foundling`
  and
  `npm.cmd run check:enemy-expansion-en-e07-changeling-veilskin-foundling`.
  The revised ten-gate EN-E07 protection matrix passes in 6.3s, `check:fast`
  in 58.3s, and full `check` in 107.1s before approval and 109.0s against
  approval-local metadata, then 119.8s against the final published tuple, with
  all 232 fixtures exact.
  The three exact frozen PNG boards are open together in responsive Aseprite
  1.3.17.2, and its live command line names all three paths.
  The designer replied `approved` on 2026-08-11. Exact implementation
  `2a295aa70c8a6680ffb85881efa4ccd927a50979` and approval record
  `7d064226d9a0096f8b276f5b0bd30be93435962b`, plus initial published handoff
  `0dcd15249d97b3e24bf174b014885fa2c8b6177c`, are published and remote-verified
  on the isolated branch. This reconciliation records the completed bounded
  publication tuple. The packet is not registered or fixture-generated.
  Runtime actor copying, alternate
  bodies, detached masks or veil pieces, effects, specialist/elite Changeling,
  Kelpie, release, and EN-E08 remain separate gates; another candidate requires
  a separate `lets do next`.
- Earlier approved preceding isolated art checkpoint:
  `codex/en-e07-will-o-wisp-mirecrown-beacon`, based exactly on clean
  published Fenbell Shepherd reconciliation
  `8b0754c9594ad91fe378ba11d4f43d7b2a558145`, contains one private elite
  Will-o-Wisp Mirecrown Beacon candidate. Its frozen 80-frame digest is
  `5fbd53af9fb461717a8bd90698a0b2f7f81f8fdd55fee42fbca5254738654d81`.
  The broad sovereign-beacon form uses one connected three-prong crown-wick,
  a wide double-tiered ribbed cage, one central eye, paired connected
  buttresses, a deep living core, broad basin, and four connected lower flame
  tines in the approved family palette. All 80 frames are connected,
  one-cell-bounded, genuinely hovering, hard-alpha, and pixel/alpha distinct
  from approved Fenbell Shepherd, approved Lantern Mote, public Spectral
  Ghost, and public Flame Elemental. The packet passes 72/72 colored frames,
  8/8 white flashes, 54/54 required single-eye views, and an opaque range of
  243-254. A first A3/C3 detached-beam read was repaired before freeze into an
  enclosed cage/core expansion. One post-freeze package build reproduces the
  exact five-artifact packet. All boards and phase sheets were inspected at
  original detail. The protected 26-command matrix passes in 19.0s,
  `check:fast` in 60.4s, and full `check` in 111.2s with the approved
  integration digest and all 232 fixtures exact. The three frozen PNG hashes
  were reverified and those exact files are open together in responsive
  Aseprite 1.3.17.2; its live command line names all three paths. The designer
  replied `approved lets do next` on 2026-08-11; implementation
  `72925cd8d8ea1a3ae47a45601607a1a5853decb3` and approval record
  `6448bb49e16679b94fcc402166b089b6b6ca7174` plus initial handoff
  `72b529bcdd19bd0d3018f2b03ceabcb29a809015` are published and remote
  verified, and full `check` passes in 110.9s against the published tuple. The
  same reply opens only one private common Changeling candidate from this clean
  publication reconciliation. Do not register Will-o-Wisp, generate fixtures,
  add effects, start another role or family beyond that candidate, release, or
  advance EN-E08.
- Approved preceding isolated art checkpoint:
  `codex/en-e07-will-o-wisp-fenbell-shepherd`, based exactly on clean
  published Lantern Mote reconciliation
  `d734846067b3bf9dd05cadffef440ead1f6c6d3a`, contains one private specialist
  Will-o-Wisp Fenbell Shepherd candidate. Its frozen 80-frame digest is
  `0a8000e33705967089ae66c98486eb701da88bfacd9f5adc38a47bbb62f5a46b`.
  All frames are connected, one-cell-bounded, genuinely hovering, hard-alpha,
  and pixel/alpha distinct from approved Lantern Mote, public Spectral Ghost,
  and public Flame Elemental. It uses one connected hooked wick, a tall
  bell-shaped ribbed cage, one guiding core eye, asymmetric connected side
  shutters, an elongated core, a broad lip, and three connected lower flame
  tines. Detached wisps/embers/sparks, sound rings, aura, glow, smoke,
  afterimages, trails, floor light, projectiles, impacts, and illumination
  remain external. The 202-210-pixel packet reproduces all five artifacts
  byte-for-byte twice; 80/80 predecessor/comparison pixel and alpha
  distinctions, 72/72 colored frames, 8/8 white flashes, and 54/54 one-eye
  views pass. All three boards and all eight raw/effects-enabled phase boards
  have been inspected at original detail. The protected 25-command matrix
  passes in 16.8s, `check:fast` in 57.6s, and full `check` in 111.7s with the
  approved integration digest and all 232 fixtures exact. The three frozen PNG
  hashes were reverified and those exact files are open together in responsive
  Aseprite 1.3.17.2. The designer replied `approved` on 2026-08-11;
  implementation `04f113d6e2b95f290925eba040659b441e3cfcd1` and approval
  record `89e2e2cb271dc9af60dd4dce6fba3bccd03cd9d7` plus initial handoff
  `462e7e5123d96f3ff928cd6ff908267cd313570b` are published and remote
  verified, and full `check` passes in 108.7s against the published tuple. Do
  not register Will-o-Wisp, generate fixtures, add effects, start another
  family, release, or advance EN-E08. The designer's later `lets do next`
  reply opened only the private Mirecrown Beacon candidate above.
- Approved preceding art checkpoint (Lantern Mote):
  `codex/en-e07-will-o-wisp-lantern-mote`, based exactly on clean published
  Grand Pretender reconciliation `3ddbe159360f16844d167ecc753d6b767b7e5549`,
  contains one private common Will-o-Wisp Lantern Mote candidate. Its frozen
  80-frame digest is
  `f50a0c6f08b63dde7bad06542140123c5d6bb7fb419b7df2789cffa441a9ebb8`.
  All frames are connected, one-cell-bounded, genuinely hovering, hard-alpha,
  and pixel/alpha distinct from public Spectral Ghost, Shadow Slime, and Flame
  Elemental. It uses one connected stepped wick, broad ribbed cage, single
  visible core eye, tapered inner flame, and two connected lower flame prongs;
  aura, bloom, detached particles, smoke, trails, projectiles, impacts, floor
  light, and illumination remain external. An initial focused check caught and
  repaired one detached lower-prong pixel and duplicate eye pixels before
  freeze. The repaired 146-154-pixel packet reproduces all five artifacts
  byte-for-byte twice. The 24-command protected matrix passed in 16.0s,
  `check:fast` in 55.6s, and full `check` in 108.4s with the approved
  1,200-frame integration digest and all 232 fixtures exact. Both full boards,
  the comparison, and all eight raw/effects-enabled phase boards were
  inspected; the three exact frozen PNGs were opened together in responsive
  Aseprite. The designer replied `approved lets do next` on 2026-08-11;
  implementation `96907f552a06ba3865e25a46f881af5add2237ee` and approval
  record `878e4969de59c500de342555e9b136e3d8cde2de` plus initial handoff
  `71f0fbc07f088d6c366f11dc462856e79e3fde8b` are published and remote
  verified; final publication reconciliation
  `d734846067b3bf9dd05cadffef440ead1f6c6d3a` is remote exact. Do not register
  Will-o-Wisp, generate fixtures, add effects, start the elite or another
  family, release, or advance EN-E08. The same reply opened only the Fenbell
  Shepherd candidate above.
- Approved preceding art checkpoint (Grand Pretender):
  `codex/en-e07-doppelganger-grand-pretender`, based exactly on clean published
  Falseface Adept reconciliation `b16b7d2c8cd91ffbf31e0c9ac55d392c53a4b64c`,
  contains one private elite Doppelganger Grand Pretender. Its approved frozen
  80-frame digest is
  `03ca03ade7be4efcb2e69aafe3400cf6a452d26f1ddbaccca2b561374c172dcb`.
  All frames are connected, one-cell-bounded, grounded, hard-alpha, and
  pixel/alpha distinct from approved Pale Echo, approved Falseface Adept, and
  public Cultist Zealot. It uses one fused three-panel visage, a continuous
  right-swept crest, asymmetric connected mantle, layered split formal coat,
  paired connected claiming hands, separated legs, and grounded broad boots.
  The first packet was rejected before freeze because A1 erased the face under
  a pale hand cap and the inherited fringe made the crest read as horns; the
  repaired 217-273-pixel version restores the face and replaces the fringe
  with one occluding swept hair mass. All five artifacts reproduce
  byte-for-byte twice. The 23-command protected matrix passed in 15.0s,
  `check:fast` in 56.4s, and full `check` in 107.2s with the approved
  1,200-frame integration digest and all 232 fixtures exact. All raw and
  effects-enabled phase boards were inspected, and the three exact frozen
  PNGs were opened together in responsive Aseprite. The designer replied
  `Approved lets do next`; implementation
  `0a8d5094d5e5de575f1966db30fc01d093a866c3` and approval record
  `0c54731d5fc1a14495d13ebb4c2accd98ba8b8a3` plus initial handoff
  `c551799f585df2643f83a605279cda06cc629e45` are published and remote
  verified. The same response opens only one private common Will-o-Wisp
  candidate from the clean publication reconciliation. Do not register Doppelganger, generate
  fixtures, implement runtime copying, add effects, start another
  Will-o-Wisp role or later family, release, or advance EN-E08.
- Approved preceding art checkpoint (Falseface Adept):
  `codex/en-e07-doppelganger-falseface-adept`, based exactly on clean published
  Pale Echo reconciliation `e18a51207868cbcf5b01f55e1c04a50cac43bdcc`,
  contains one private specialist Doppelganger Falseface Adept. Its repaired
  frozen 80-frame digest is
  `16289e68776f0f93d8238d19a3538c4e92e77e108686f8ddfec01b1a783080c6`.
  All frames are connected, one-cell-bounded, grounded, hard-alpha, and
  pixel/alpha distinct from approved Pale Echo, public Cultist Zealot, and
  public Dark Elf. It retains the authored default form and family palette with
  a fused diagonal visage seam, swept fringe, asymmetric high collar,
  cross-seamed short coat, paired connected molding hands, separated legs, and
  grounded boots. The first diagnostic packet was rejected before freeze
  because its colored brace collapsed into a squat block and its attack press
  overfilled the face; the repaired version restores a readable head and split
  legs at 203-261 opaque pixels. All five repaired review artifacts reproduce
  byte-for-byte. The 22-command protected matrix, `check:fast`, and full
  `check` pass with the approved 1,200-frame integration digest and all 232
  fixtures exact. The three exact repaired PNGs were opened together in
  Aseprite, both GIFs were presented, and the designer replied `approved lets
  do next`. Implementation `c415620c2f7f95b98c8b8563a2c1d6e39abb4a73`
  and approval record `cb68ec7e861f7130aafb6c60b1e4b4a16676e9cb` plus initial
  handoff `a215f091022537644a4616e8b0977f12d972eb6d` are published and remote
  verified, with final reconciliation
  `b16b7d2c8cd91ffbf31e0c9ac55d392c53a4b64c`. The same reply opened only the
  private elite Doppelganger candidate above.
- Approved preceding art checkpoint:
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
  approved 1,200-frame integration digest and all 232 fixtures exact. The three
  exact repaired PNGs were opened together in Aseprite, both GIFs were
  presented, and the designer replied `approved lets do next`. Implementation
  `0628135b84725836c552e13db797540a965854cb` and approval record
  `182938381ac39812434518d0216e6e9796367bbb` plus initial handoff
  `1e6e8d8bb01de97ca4e1373b62b461e40b1aa239` are published and remote
  verified. The same response opens only one private specialist Doppelganger
  candidate from the clean publication reconciliation. Do not register
  Doppelganger, generate fixtures, implement runtime copying, add effects,
  start the elite or another family beyond that candidate, release, or advance
  EN-E08.
- Earlier approved Living Shadow checkpoint:
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
