# Workflow Assessment — 8-Bit Sprite Assembler

> **Historical snapshot:** this assessment was written against pre-adoption
> `main` (57/202, no EN work) and first published on an EN-E02 checkout. The
> current repository has since integrated 23 expansion families / 57 variants
> across EN-E01 through EN-E06, producing 80 public families / 259 variants;
> public `zombie/ghoul` uses the approved replacement renderer while the legacy
> fixture remains frozen. Measurements and branch
> wording below describe the 2026-08-08 assessment point unless a later update
> is explicitly noted; they are evidence, not the current handoff.

**Date:** 2026-08-08 · **Scope:** why adding sprites is slow, where Claude Code tokens go, and what to change.
**Method:** six parallel analysis agents read the full repo (evidence cited as `file:line`), every load-bearing claim was re-verified by executing the actual tools, and the highest-leverage fixes are already implemented on this branch.

---

## TL;DR

The two pains have concrete, mostly mechanical causes — and the biggest ones are now fixed on this branch:

| Bottleneck (measured) | Before | After (this branch) |
|---|---|---|
| Verification per iteration | `npm run check` 6m39s, all-or-nothing, **crashes on every fresh clone** | full check ~4.5 min and **green on a fresh clone**; `check:fast` **1m55s**; `check:bosses` **~3s** |
| Producing an enemy fixture | impossible headlessly (app export + hand-crop + hand-edit 1,358-line manifest) | `npm run export:fixtures -- --family <id>` — pixel-exact, regenerates manifest |
| Adding a variant | edits golden literals inside the 319KB checker (4 places) + manifest by hand | catalog line + one command; counts derive from the catalog |
| Adding a boss (checker side) | ~10 hand edits across 2 checker scripts | 0 checker edits — rosters live in `tools/fixtures/boss-roster.json` |
| Boss build overhead | ~84 Node process spawns per build | 1 spawn; full 80-frame build measured **0.69s** |
| Session orientation | HANDOFF mandated 15 docs ≈ 360KB (~90K tokens), 11 of them historical | `CLAUDE.md` (~6KB) + archived plans; README/HANDOFF point to it |

Everything below is the evidence and the remaining roadmap.

---

## Part 1 — Why adding a sprite took so long

### 1. The safety net was broken and unpriceable (fixed)

`tools/check-project.mjs` (319KB, 6,761 lines, 781 checks) was the only gate: no flags, no
tiers, 6m39s measured — and it **failed on every fresh clone** because the boss gates
byte-compare runtime PNGs against a checkpoint corpus in gitignored `death-review/boss-48-drafts/`
that was never fully committed (0 of ~910 animation checkpoints, 45 of 70 direction checkpoints).
Every iteration cost 6.6 minutes and ended in a crash unrelated to your change
(`check-boss-directions.mjs:146`, unhandled ENOENT), which also means the Windows-release CI
(`windows-release.yml` runs `npm run check`) could never pass.

75% of the runtime (286s of 381s, measured with an instrumented copy) was one export-parity
section re-rendering all 202 variants × 2 outline modes — with `buildAnimationSheet` rebuilt
inside the direction loop, 4× redundantly.

**Fixed here:** missing checkpoints are now explicit warnings (byte-parity still enforced where
the corpus exists; `check:bosses:strict` restores hard mode for the machine that has it), boss
gate failures print immediately instead of after 6 minutes, the redundant sheet builds are
hoisted, and the gate grew tiers: `check:fast` (1m55s), `check:bosses` (~3s), full `check` for
pre-commit/release.

### 2. The documented enemy workflow was literally impossible (fixed)

`ARCHITECTURE.md` says "re-export its fixture into asset-pack/enemies/" — but the committed
pack is a frozen **legacy 12-column 4× format** (1152×384) that no tool could produce: the only
sheet builder is browser-DOM-bound and hardcodes the current 20-column contract
(`engine/sheets.js:13`, `engine/catalogs/animation.js:17`). So every variant meant exporting from
the app UI, hand-cropping 1920→1152, and hand-editing the 32KB manifest in exact catalog order.

**Fixed here:** `tools/export-enemy-fixtures.mjs` renders any variant headlessly to the exact
legacy contract — validated **pixel-identical** against the non-drifted committed corpus — and
regenerates `manifest.json` from `engine/catalogs/enemies.js` when its content actually changes.
`--verify` doubles as a drift detector, up-to-date fixtures are left byte-untouched, and
overwriting a stale published fixture requires an explicit `--accept-drift` (adversarially
reviewed: the first version would have let the documented runbook silently rewrite published art).

### 3. Discovered along the way: 166 of 202 published fixtures are stale

Running `--verify` against the whole pack revealed that only 36 fixtures match the current
engine. The approved repair waves (frame-safety, outline work) changed the engine's rendering
after the pack was generated (2026-07-18), and with no exporter the pack was never re-exported —
the checker validates only dimensions, never pixels. Example: `slime-lime` differs in exactly
its two down-attack frames (40px each). **Your game repos are consuming pre-repair sprites for
46 of 57 families.** Regenerating is one command (`npm run export:fixtures -- --all`) but it
changes published art, so it's your call — the tool and the drift list are ready.

### 4. Checker rosters were hand-maintained mirrors of the catalogs (fixed)

Adding boss #11 required ~10 coordinated edits across the two boss checkers (exact counts, exact
id arrays, generator-filename map, prose messages) — each miss costing a 6.6-minute run to
discover. Enemy work similarly meant bumping `57/202/2139` golden literals and a duplicated
57-family list inside the 319KB checker.

**Fixed here:** rosters and approval lists now live in `tools/fixtures/boss-roster.json` and
`tools/fixtures/approved-outline-families.json`; counts derive from the catalogs. Registering or
promoting a sprite = catalog edit + one small JSON edit. The checkers' intent (catching
unauthorized roster changes) is preserved.

### 5. Boss authoring is 42-59% copy-paste Python (partially fixed)

Adding one boss today: 3 new Python scripts (~790-1,010 lines, only ~450-550 unique), ~96 PNGs
written twice, 2 catalog entries, checker edits (now: none), doc-count updates in 6+ files.
A 274-line shared library exists (`tools/boss_animation_authoring_v1.py`) but only 2 of 10
animation generators import it — the other 8 inline 219-254 identical lines each (~1,866
duplicated lines total). Each build also spawned one Node process **per frame** (~84 spawns).

**Fixed here:** the treatment bridge is batched (1 spawn per build; full rhino rebuild measured
0.69s, output verified pixel-identical), and the library's final drift-gate works on fresh
clones. **Still to do:** migrate the 8 legacy generators onto the library (byte-parity is
verifiable via the existing gates), then make it spec-driven so a boss is ~150 lines of pose
data. The `add-boss` skill now forbids copying the legacy scripts for new bosses.

### 6. Process weight (your call, now documented as policy)

The docs institutionalized whole-roster review packets and full re-verification per tiny change
("npm run check" prescribed 34 times across 12 docs; 168 "visually approved" mentions; the
outline feature alone went through 64 approval groups). `CLAUDE.md` now states the bounded
policy: review packets cover only the changed family/slice, approvals batch at slice boundaries,
full check runs at commit time — not per iteration. Adjust the wording there if you want
different bounds.

---

## Part 2 — Where the Claude Code tokens went

Measured per-task reading bills at HEAD (4 chars ≈ 1 token):

| Task as done today | Bill |
|---|---|
| Add enemy variant | ~46K tokens |
| Add enemy family | ~69K tokens |
| Add a boss | ~55K read + ~5K generated |
| Renderer bug fix | ~25K tokens |
| Session that obeys HANDOFF's "Required Reading" | **111-130K tokens before the first edit** |

Top sinks, ranked:

1. **HANDOFF.md:148 mandated reading 15 docs (360KB ≈ 90K tokens) "completely before
   implementation"** — and 11 of the 15 are self-declared completed/historical records (233KB),
   led by the 118KB `ENEMY_OUTLINE_PLAN.md` changelog. → **Fixed:** archived to `docs/archive/`
   with STATUS banners; HANDOFF's list replaced with a lean policy; `CLAUDE.md` (~6KB) is the
   entry point. Orientation drops ~95%.
2. **No CLAUDE.md / .claude/ anywhere** — every session re-derived the workflow from prose.
   → **Fixed:** `CLAUDE.md` + two on-demand skills (`/add-enemy`, `/add-boss`) that load only
   when used.
3. **Monoliths:** `check-project.mjs` 319KB (~80K tokens, unreadable in one pass), `app.js`
   168KB with zero section markers, `renderer.js` 141KB (but with clean per-family seams).
   → Mitigated by runbooks that point at exact line regions; real splits are next-steps below.
4. **HANDOFF self-contradictions** (57/202 vs 67/232; "not pushed" vs "pushed"; claims about
   branches/artifacts that don't exist in a fresh clone) force reconciliation reading and dead
   git probing. → Partially fixed (superseded-reading note); a full rewrite as a <100-line STATE
   doc is recommended below.
5. **1,359 tracked PNGs, 980 in one flat directory** — one accidental `ls` ≈ 11K tokens; plus
   `death-review/` being gitignored-yet-tracked breaks glob heuristics and caused the missing-
   checkpoint corpus in the first place (`git add .` silently skips it). → Documented + deny
   rules for the noisiest intermediates in `.claude/settings.json`; restructuring is a next-step.
6. **Same volatile facts duplicated in up to 8 docs** (their own 2026-08-02 audit had to correct
   8 files for one status change). → Policy in CLAUDE.md; dedup pass recommended.

---

## Part 3 — What was on the assessed branch (all verified then)

| Change | Proof |
|---|---|
| Boss gates clone-safe + roster-driven (`check-boss-directions.mjs`, `check-boss-animations.mjs`, `tools/fixtures/boss-roster.json`) | both pass on this fresh clone in 0.4s / 2.6s with honest warnings (25 / 910 missing checkpoints) |
| `check-project.mjs`: `--fast` / `--skip-bosses` tiers, fail-fast boss gates, catalog-derived goldens, outline list from JSON, hoisted sheet builds | `check:fast` 1m55s green; full check green (see run log); syntax-checked |
| `tools/export-enemy-fixtures.mjs` (+ `npm run export:fixtures`) | `--verify` reproduces 36/202 committed fixtures pixel-exact and correctly flags the 166 stale ones; slime spot-render matches committed art exactly |
| Batched engine treatment (`apply_engine_treatment.mjs --batch`, `boss_animation_authoring_v1.py`) | full rhino animation rebuild: **0.69s**, 91/91 outputs pixel-identical to committed assets |
| `CLAUDE.md`, archived plans, README/HANDOFF pointers, `requirements.txt`, `.claude/skills/{add-enemy,add-boss}`, `.claude/settings.json` | root .md surface: 18 files/400KB → 8 files/~170KB; skills load on demand |

Not changed (deliberately): sprite art, the frame contract, the app, the legacy pack's pixels,
anything the six sibling repos consume. The full `npm run check` still validates everything the
old one did — minus nothing — it just also passes from a clean checkout.

## Part 4 — Historical recommendations and current status

Update for 2026-08-09: the approved backlog integration now composes 23
expansion families / 57 variants and a live 80/259 public catalog. It includes
the six completed EN-E03 suites, all eight completed EN-E06 suites, and the
Ghoul Upgrade replacement route; the focused, fast, and full gates pass without
fixture or sprite-art changes. The production chronology below records the
earlier private source checkpoints. Approved EN-E06 Fairies Bramblewing Scout,
Thistle Hexer, and Petalcrown Duelist remain exact and were originally
published at `cc92ca9`, `3dc68cb`, and `b265e97`.
After Petalcrown publication, the designer said `lets do nextr`, opening only
common Hag Mire Crone. Its private 80-frame candidate passes connected,
bounded, grounded, alias, mirror, public-Witch distinction, and approved-Fairy
preservation gates at digest
`f35512e73fd7b2308bf408f11c2d21a30631361214a372df7bef2e8fc4e6478d`.
The exact Mire Crone boards and paired GIFs were approved on 2026-08-09 and its
bounded implementation is published at `25f67d4`. The subsequent `next` opens
only specialist Cauldron Hexer. Its private 80-frame candidate passes all
structural gates and differs from Mire Crone in every pixel frame and alpha
silhouette at digest
`17f40220730fe4e83be26156d73e0599235be66a9290284b37cb9c8282c7a1a6`.
The exact Cauldron Hexer packet was approved on 2026-08-09 and its bounded
implementation is published at `4b59b40`, with clean handoff `0a096fa`. The
same reply opened only one complete Blackthorn Matron lane. Its private
80-frame candidate passes 80/80 connected, bounded, grounded structure and
80/80 pixel plus alpha-silhouette distinctions from both approved Hags at
digest `d4588d754e01dbb4916949f27b801342a310706890a0532a0133216d7cb0c7a9`.
The exact packet was visually approved on 2026-08-09 and its bounded
implementation is published at `8ce2f2a`, with clean handoff `8e56ec2`. The
later `cool next please` opened only common Dryad Grove Tender. Its private
80-frame suite passes 80/80 connected, bounded, grounded structure and
80/80 pixel plus alpha-silhouette distinctions from public Treant and approved
Blackthorn at digest
`18fedaf06c457c8a280b3c5518b0763be48de3b3cb5bd29113f0fd5d183e3a21`.
The exact boards and GIFs were visually approved on 2026-08-09 and the bounded
implementation is recorded at `3d96fed`, with published approval handoff
`4c49f27`. The approved private Spore Cantor suite on
`codex/en-e06-dryad-spore-cantor` passes 80/80 connected, bounded, grounded,
Treant-distinct, and Grove-distinct frames at digest
`b22585e7b055f4ae43eb1293741967c1d76ec9bd3b842320880f2038c0cf62ef`.
Its crown, gills, shelves, and fruiting bodies remain connected while spore
clouds and motes stay external. The exact raw and outlined review packet was
visually approved on 2026-08-09; implementation `46d1dc9` and approval record
`61d1fa4` are published. The later isolated Heartwood Warden elite Dryad suite
on `codex/en-e06-dryad-heartwood-warden` passes 80/80 connected,
bounded, grounded, hard-alpha, Treant/Grove/Spore pixel, and Treant/Grove/Spore
alpha-silhouette distinction gates at digest
`fb7b50a0fefda66995c5e81f3e07c0c080893902a33d304066e79fb8181cd97c`.
Its exact raw, Complete B + Form, four-way comparison, and paired GIF evidence
was visually approved on 2026-08-09. The frozen implementation
`8a790e3f0d02cf64763733f83d17890c79ce83fc` and approval record
`d8c13bb008e3a186daa73a37eec87c707f30365f` are committed and pushed on the
tracked branch. The later isolated common Redcap Barrow Stalker candidate on
`codex/en-e06-redcap-barrow-stalker` passes 80/80 connected, bounded, grounded,
hard-alpha, Goblin Scout/Hobgoblin/Mire pixel, and alpha-silhouette distinction
gates at digest
`1719f8611f212cfbacf041fc8459d3f52390b05aa73e0a1d50203554845051f1`.
Its exact raw, Complete B + Form, four-way comparison, and paired GIF evidence
was visually approved on 2026-08-10. The frozen implementation
`c3544dc4ec06e06afb15ea699333119342a8946f` and approval record
`8e2054236a49ab06b7cac404cda8b12bb440085c` are committed and pushed on the
tracked branch. The later authorized specialist Redcap Ironboot Trapper
candidate on `codex/en-e06-redcap-ironboot-trapper` passes 80/80 connected,
bounded, grounded, hard-alpha, Goblin Scout/Hobgoblin/Barrow pixel, and
alpha-silhouette distinction gates at digest
`31c37fd25d688bd295c2fb84bdb437141149cf43986b6edcc4141467bc32bdf1`.
Its exact raw, Complete B + Form, four-way comparison, and paired GIF evidence
was opened together in Aseprite and visually approved on 2026-08-10. The frozen
implementation `98865936244b94860985210fcaf9a044b0ca228a` and approval record
`00a9876f963522c88b9cd77f809bec3674d72b19` are committed and pushed on the
  tracked branch. The later authorized elite Redcap Bloodcap Reaver candidate
  on `codex/en-e06-redcap-bloodcap-reaver` passes 80/80 connected, bounded,
  grounded, hard-alpha, Goblin Scout/Hobgoblin/Barrow/Ironboot pixel, and
  alpha-silhouette distinction gates at digest
  `e9a41fd37e19d96911cfffee3bd89e3859f9cbb95099996632f877da2dbdabff`.
  Its exact raw, Complete B + Form, four-way comparison, and paired GIF evidence
  was opened together in Aseprite and visually approved on 2026-08-10. The
  frozen implementation `1a1ba00ea1edfa6e8bd946e95f5e35c6080ce73a` and approval
  record `5c55af26481f9a79988382df3d67b8ff33b765a4` are committed and pushed on the
  tracked branch. The later common Nymph Spring Dancer on
  `codex/en-e06-nymph-spring-dancer` passes 80/80 connected, bounded, grounded,
  hard-alpha, Elf/Fairy/Grove pixel, and alpha-silhouette distinction gates at
  digest `b68906d962e16611384e419610324c6a9934d63ab329963f0734e83255dabe8c`.
  Its exact five-artifact packet was opened together in Aseprite and visually
  approved on 2026-08-10. Frozen implementation
  `9d6366b0c5456704137aadfbbec9a67eccb5fd7c` and approval record
  `eae49376fd7bc4dd315168cb2989293de4a73f55` are committed and pushed on the
  tracked branch. The later specialist Nymph Mist Weaver on
  `codex/en-e06-nymph-mist-weaver` passes 80/80 connected, bounded, grounded,
  hard-alpha, Elf/Spring/Spore pixel, and alpha-silhouette distinction gates at
  digest `e57a0af441f895fe376f2696d859a97d84564ddf034235d3b237b2cf637520da`.
  Its exact five-artifact packet was opened together in Aseprite and visually
  approved on 2026-08-10. Frozen implementation
  `682f99a581e70ee1c985257e0c122d75c7add6f9` and approval record
  `07a673df462cdb651673fd042fb92965da624faf` are committed and pushed on the
  tracked branch. The later elite Nymph Rivercrown Muse on
  `codex/en-e06-nymph-rivercrown-muse` passes 80/80 connected, bounded,
  grounded, hard-alpha, Elf/Spring/Mist pixel, and alpha-silhouette distinction
  gates at digest
  `4917d42fd0b480e4c2635ba4c96725e6b68afec1075dacb8acee2f70dc886bcd`.
  Its exact five-artifact packet was opened together in Aseprite and visually
  approved on 2026-08-10. Frozen implementation
  `39bd0658d53acbfe7aa4484e14f6518551720142` and approval record
  `ca82f079ff84934edc4ab51a8d406050b9083d2a` are committed and pushed on the
  tracked branch. It remains private. The designer's later `lets do next`
  opens exactly one private common EN-E07 Living Shadow Gloam Walker. Its
  hash-frozen 80-frame suite uses connected hollow face/torso negative
  space and clearly split planted legs; all frames pass connected, bounded,
  grounded, hard-alpha, Cursed Ghost/Shadow Slime/Mist Weaver pixel and alpha
  distinctions at digest
  `131a95a106a36dea2f6879611c8e14e3aa077012dcbd1bd32e111c45658ca3f9`.
  The exact packet was opened in Aseprite and the designer replied `aaprovced`
  on 2026-08-10. Implementation `a46f59c1cb0bb751760f2776fe60b5c489806c94`
  and approval record `848c7192b6dc2cac8b7ab2dc8725d3859447715d` plus initial
  handoff `00d5b436c7398312a5f3a05a482b4cf34cee9ba5` are committed and pushed.
  The private review branch is published, while the family remains absent from
  the public catalog. Rivercrown reconciliation `d785fe5` is published too.
  The designer's subsequent `lets do next` opens only one private specialist
  Living Shadow Nightglass Seer on
  `codex/en-e07-living-shadow-nightglass-seer`. Its frozen 80-frame candidate
  uses the same chunky violet-black family ramp with a broad faceted mask,
  vertical eye, connected shoulder yoke and sight-frame arms, narrow chest
  aperture, bent split legs, and planted wedge feet. It passes 80/80 connected,
  bounded, grounded, hard-alpha, Cursed Ghost/Shadow Slime/Mist Weaver/Gloam
  Walker pixel and alpha distinctions at digest
  `07909fa9b74df6dd386ca3f6186fe4da26e8d088af99ad7e2dfa2bcdeb10d3fa`.
  The exact review packet is reproducible and was visually approved when the
  designer replied `approved lets do next`. Implementation
  `325a6f4cfa1418383c93510262a631358add1d5f` and approval record
  `d50f3af5da0578edf66a5b2f156744c576427b9c` plus initial handoff
  `71d36ef48a55a7f1d49e1e6649a33eb945c9667c` are published. The protected
  19-gate matrix, fast suite, and full suite pass;
  the approved 1,200-frame integration digest and all 232 fixtures remain
  exact.
  The same approval response opens only one private elite Living Shadow
  Hollowcrown Regent on
  `codex/en-e07-living-shadow-hollowcrown-regent`. Its frozen 80-frame
  candidate uses the same chunky violet-black family ramp with a connected
  three-prong crown, high mantle, paired eye slits, diamond void-heart, command
  bracers, armored split legs, and broad throne-step feet. It passes 80/80
  connected, bounded, grounded, hard-alpha,
  Cursed Ghost/Shadow Slime/Mist Weaver/Gloam Walker/Nightglass Seer pixel and
  alpha distinctions at digest
  `657e4071ab8432387f7c8b6ecff8650f3f7a63bf7dc8f4b68564373a5e450991`.
  The exact review packet is reproducible and was visually approved when the
  designer replied `approved lets do next`. Implementation
  `ffe5f574ab9f06ecfaad83c50a7980254eea7211` and approval record
  `90a06bd34e1bae29becdc380b01895825cf4a969` plus initial handoff
  `0c3d671bee3013413291170e127d3820cdcaff95` are published and remote
  verified. The protected 20-gate matrix, fast suite, and full suite pass; the
  approved 1,200-frame integration digest and all 232 fixtures remain exact.
  Only one private common Doppelganger candidate opens from the clean
  publication reconciliation.
  That active candidate is Pale Echo on
  `codex/en-e07-doppelganger-pale-echo`, based exactly on published
  Hollowcrown reconciliation `6ff54c3a926436083675ec8f7e2d0230cc073ac5`.
  Its authored default form uses public-humanoid-scale pale gray-rose skin,
  uneven charcoal-violet fringe, offset eyes, mismatched shoulders, a split
  slate/wine tunic, one ordinary hand, one connected long-finger mimic hand,
  separated legs, and grounded boots. The oversized 218-271-pixel diagnostic
  packet was rejected before freeze; the repaired 186-245-pixel candidate
  passes 80/80 connected, bounded, grounded, hard-alpha Bandit/Cultist/Dark Elf
  pixel and alpha distinctions at digest
  `c3fa12cb4bb0be432e955adfc32f331286e55c65cbd7a38250bdf0d120fa6596`.
  Its exact five-artifact packet reproduces byte-for-byte and was visually
  approved after the three exact repaired PNGs were opened together in
  Aseprite and the designer replied `approved lets do next`. Implementation
  `0628135b84725836c552e13db797540a965854cb` and approval record
  `182938381ac39812434518d0216e6e9796367bbb` plus initial handoff
  `1e6e8d8bb01de97ca4e1373b62b461e40b1aa239` are published and remote
  verified. The same response opens only one private specialist Doppelganger
  candidate from the clean publication reconciliation.
  The 21-gate protected matrix, fast suite, and full suite pass; the approved
  1,200-frame integration digest and all 232 fixtures remain exact.
  The next historical continuation was one private specialist Doppelganger Falseface
  Adept on `codex/en-e07-doppelganger-falseface-adept`, based exactly on clean
  published Pale Echo reconciliation
  `e18a51207868cbcf5b01f55e1c04a50cac43bdcc`. It keeps the authored default
  form and family palette while adding a fused diagonal visage seam, asymmetric
  high collar, fitted cross-seamed coat, and two connected molding hands. The
  first diagnostic review was rejected before freeze because the colored brace
  read as a squat block and the face press was overfilled; the repaired
  203-261-pixel candidate restores readable head/leg separation. It passes
  80/80 connected, bounded, grounded, hard-alpha pixel and alpha distinctions
  from Pale Echo, Cultist Zealot, and Dark Elf at digest
  `16289e68776f0f93d8238d19a3538c4e92e77e108686f8ddfec01b1a783080c6`.
  Its exact repaired five-artifact packet reproduces byte-for-byte. The
  22-command protected matrix passed in 7.6s, `check:fast` in 52.3s, and full
  `check` most recently in 107.4s; the approved 1,200-frame integration digest
  and all 232 fixtures remain exact. The three exact repaired PNGs were opened
  together in Aseprite, both GIFs were presented, and the designer replied
  `approved lets do next`. Implementation
  `c415620c2f7f95b98c8b8563a2c1d6e39abb4a73` and approval record
  `cb68ec7e861f7130aafb6c60b1e4b4a16676e9cb` plus initial handoff
  `a215f091022537644a4616e8b0977f12d972eb6d` are published and remote
  verified, with final reconciliation
  `b16b7d2c8cd91ffbf31e0c9ac55d392c53a4b64c`. The same response opens only one
  private elite Doppelganger candidate from that clean checkpoint.
  The active continuation is Grand Pretender on
  `codex/en-e07-doppelganger-grand-pretender`. Its authored default form uses a
  fused three-panel visage, one continuous right-swept crest, asymmetric
  connected mantle wings, a layered split formal coat, paired connected
  claiming hands, separated legs, and grounded broad boots. The first packet
  was rejected before freeze because A1 erased the face under a pale hand cap
  and the inherited fringe read as horns; the repair restores the expected
  eyes/tri-seam and replaces the fringe with one occluding swept hair mass.
  The frozen digest is
  `03ca03ade7be4efcb2e69aafe3400cf6a452d26f1ddbaccca2b561374c172dcb`:
  80/80 frames are connected, bounded, grounded, and pixel/alpha distinct from
  Pale Echo, Falseface Adept, and Cultist Zealot; 72/72 colored frames and 8/8
  white flashes are exact; opaque range is 217-273. All five artifacts
  reproduce byte-for-byte twice. The comparison, both full boards, and all
  eight raw/effects-enabled phase boards were inspected; the three exact PNGs
  are open together in responsive Aseprite. The 23-command matrix passed in
  15.0s, `check:fast` in 56.4s, and full `check` in 107.2s with the integration
  digest and all 232 fixtures exact. The designer replied `Approved lets do
  next`; implementation `0a8d5094d5e5de575f1966db30fc01d093a866c3`
  and approval record `0c54731d5fc1a14495d13ebb4c2accd98ba8b8a3` plus initial
  handoff `c551799f585df2643f83a605279cda06cc629e45` are published and remote
  verified. Grand Pretender remains private, unregistered, and fixture-free.
  The same response opened only one private common Will-o-Wisp candidate from
  the clean publication reconciliation.
  The approved preceding continuation was Lantern Mote on
  `codex/en-e07-will-o-wisp-lantern-mote`, based exactly on Grand Pretender
  reconciliation `3ddbe159360f16844d167ecc753d6b767b7e5549`. Its authored
  hovering form uses a connected stepped wick, broad ribbed cage, single
  visible core eye, tapered inner flame, and two connected lower flame prongs.
  The first focused run caught and repaired one detached lower-prong pixel and
  duplicate eye pixels before freeze. The frozen digest is
  `f50a0c6f08b63dde7bad06542140123c5d6bb7fb419b7df2789cffa441a9ebb8`:
  80/80 frames are connected, bounded, hovering, and pixel/alpha distinct from
  Spectral Ghost, Shadow Slime, and Flame Elemental; 72/72 colored frames and
  8/8 white flashes are exact; 54/54 expected views expose one eye; opaque
  range is 146-154. All five artifacts reproduce byte-for-byte twice. The
  comparison, both full boards, and all eight raw/effects-enabled phase boards
  were inspected; the three exact PNGs are open together in responsive
  Aseprite. The 24-command matrix passed in 16.0s, `check:fast` in 55.6s, and
  full `check` in 108.4s with the integration digest and all 232 fixtures
  exact. The designer replied `approved lets do next` on 2026-08-11;
  implementation `96907f552a06ba3865e25a46f881af5add2237ee` and approval
  record `878e4969de59c500de342555e9b136e3d8cde2de` plus initial handoff
  `71f0fbc07f088d6c366f11dc462856e79e3fde8b` are published and remote
  verified, and full `check` passes against the published metadata. Final
  Lantern publication reconciliation
  `d734846067b3bf9dd05cadffef440ead1f6c6d3a` is remote exact; Lantern Mote
  remains private and unregistered. That approval reply opened only the active
  Fenbell Shepherd candidate below.
  The active continuation is private specialist Will-o-Wisp Fenbell Shepherd
  on `codex/en-e07-will-o-wisp-fenbell-shepherd`, based exactly on the clean
  Lantern reconciliation above. Its taller ritual-lantern form uses one
  connected hooked wick, a tall bell-shaped ribbed cage, one guiding core eye,
  asymmetric connected side shutters, an elongated core, a broad lip, and
  three connected lower flame tines. The frozen digest is
  `0a8000e33705967089ae66c98486eb701da88bfacd9f5adc38a47bbb62f5a46b`:
  80/80 frames are connected, bounded, hovering, and pixel/alpha distinct from
  approved Lantern Mote, public Spectral Ghost, and public Flame Elemental;
  72/72 colored frames and 8/8 white flashes are exact; 54/54 expected views
  expose one eye; opaque range is 202-210. All five artifacts reproduce
  byte-for-byte twice. The comparison, both full boards, and all eight
  raw/effects-enabled phase boards have been inspected at original detail.
  The protected 25-command matrix passes in 16.8s, `check:fast` in 57.6s, and
  full `check` in 111.7s with the integration digest and all 232 fixtures exact.
  The three frozen PNG hashes were reverified and those exact files are open
  together in responsive Aseprite 1.3.17.2. The designer replied `approved` on
  2026-08-11; implementation `04f113d6e2b95f290925eba040659b441e3cfcd1`
  and approval record `89e2e2cb271dc9af60dd4dce6fba3bccd03cd9d7` plus initial
  handoff `462e7e5123d96f3ff928cd6ff908267cd313570b` are published and remote
  verified, and full `check` passes in 108.7s against the published tuple.
  Fenbell Shepherd remains private and unregistered. The designer's later
  `lets do next` reply opened only the private elite Mirecrown Beacon
  candidate below; registration, fixtures, effects, another family, release,
  and EN-E08 stay closed.
  The active continuation is private elite Will-o-Wisp Mirecrown Beacon on
  `codex/en-e07-will-o-wisp-mirecrown-beacon`, based exactly on clean Fenbell
  reconciliation `8b0754c9594ad91fe378ba11d4f43d7b2a558145`. Its broad
  sovereign-beacon form uses one connected three-prong crown-wick, a wide
  double-tiered ribbed cage, one central eye, paired connected buttresses, a
  deep living core, a broad basin, and four connected lower flame tines. The
  frozen digest is
  `5fbd53af9fb461717a8bd90698a0b2f7f81f8fdd55fee42fbca5254738654d81`:
  80/80 frames are connected, bounded, hovering, hard-alpha, and pixel/alpha
  distinct from approved Fenbell Shepherd, approved Lantern Mote, public
  Spectral Ghost, and public Flame Elemental; 72/72 colored frames and 8/8
  white flashes are exact; 54/54 expected views expose one eye; opaque range
  is 243-254. The initial A3/C3 detached-beam read was repaired before freeze
  into an enclosed cage/core expansion. One post-freeze build reproduces the
  exact five-artifact packet, and all boards and phase sheets were inspected
  at original detail. The protected 26-command matrix passes in 19.0s,
  `check:fast` in 60.4s, and full `check` in 111.2s with the integration digest
  and all 232 fixtures exact. The three frozen PNG hashes were reverified and
  those exact files were opened together in responsive Aseprite 1.3.17.2; its
  live command line names all three paths. The designer replied `approved lets
  do next` on 2026-08-11; implementation
  `72925cd8d8ea1a3ae47a45601607a1a5853decb3` and approval record
  `6448bb49e16679b94fcc402166b089b6b6ca7174` plus initial handoff
  `72b529bcdd19bd0d3018f2b03ceabcb29a809015` are published and remote
  verified, and full `check` passes in 110.9s against the published tuple.
  Mirecrown Beacon remains private, unregistered, fixture-free, and non-public.
  The same reply opens only one private common Changeling candidate from this
  clean publication reconciliation; registration, fixtures, effects, later
  roles or families, release, and EN-E08 remain closed.
  The current private prototype is elite Possessed Mask Threnecrown Hierophant
  on `codex/en-e08-possessed-mask-threnecrown-hierophant`, based on clean
  published Mournseal reconciliation
  `4f7a1146f1b90c8e70b819461d29a4be72cb379a`. It is one connected baked 24x24
  crown-mask/tiered-mantle/gold-tab actor with zero child assets, frozen at
  digest `51ca678e1dee5e086d0fa439686c0e699b857b2ab00dfa4ab7a963546c11c81f`.
  All 80 frames pass focused connected, bounded, hovering, face-readability,
  alias, mirror, predecessor, and comparison checks. Fast/full validation passes
  in 57.0s/107.1s before approval metadata and 62.0s/119.1s approval-local,
  preserving public 80/259 and all 232 fixtures. The designer replied `approved
  lets ddo next`; implementation
  `4bf12351ebe643520f052c08bacd385141231a3f` records the accepted pixels. It is
  approved and awaiting bounded publication, unregistered, fixture-free,
  effect-free, and non-public.
  The approved preceding private checkpoint is specialist Possessed Mask Mournseal Cantor
  on `codex/en-e08-possessed-mask-mournseal-cantor`, based on clean published
  Whisperveil reconciliation `2ab49dc879a852d8a3c1a5f14de93345b32d490a`.
  It is one connected baked 24x24 tall-mask/fan-shroud/braided-cord actor with
  zero child assets, frozen at digest
  `5f54d5f716a11e42e813c7f09c1031d7090b1ac51a9cd93f93f6e0df08ac4e55`.
  All 80 frames pass focused connected, bounded, hovering, face-readability,
  alias, mirror, predecessor, and comparison checks. Fast validation passes in
  56.2s and full validation in 109.0s, preserving public 80/259 and all 232
  fixtures. The designer replied `approved lets do next`; implementation
  `b1fd09ab0b04128330178a99c0379783621e478f` records the accepted pixels.
  Approval record `ae364550cf2ecfece032098800b2c1df018ee2a5` and the
  implementation are remote verified. Initial handoff
  `0309590d9d025e8cdfa960131a3d7835730c3f7b` is also remote verified, completing
  the bounded publication tuple. It remains unregistered, fixture-free,
  effect-free, and private.
  The approved preceding private checkpoint is common Possessed Mask Whisperveil Visage on
  `codex/en-e08-possessed-mask-whisperveil-visage`, based on clean published
  Crownvault reconciliation `42156250f24d03b7e81a29e14cec75c25528cde4`.
  It is one connected baked 24x24 mask/shroud/ribbon actor with zero child
  assets, frozen at digest
  `c0fac02331632e028b73a21cadd4b472b1bdc18f7d4915b814e9a872dbc0b098`.
  All 80 frames pass focused connected, bounded, hovering, face-readability,
  alias, mirror, and comparison checks. Fast validation passes in 59.2s and
  full validation in 106.4s, preserving public 80/259 and all 232 fixtures.
  The designer replied `approved`; implementation
  `78f5446c7821bd751c3562d0a18056a64c0e00c6` records the accepted pixels.
  Approval record `c27435976f03a4f9263f6f4bbc4b46dc275b19a7` and the
  implementation are remote verified. Initial published handoff
  `29316d8c0c2cbaa900d34cf6b372679dc447ef2e` is also remote verified, completing
  the bounded publication tuple. It remains unregistered, fixture-free,
  effect-free, and private.
  The current approved published private checkpoint
  is elite Animated Armor Crownvault
  Castellan on `codex/en-e08-animated-armor-crownvault-castellan`, based exactly
  on clean published Runeforge Custodian reconciliation
  `700f2cedb1d3104369931a97bfec31a3b49fff93`. Its independently authored royal
  fortress 80-frame baked actor is frozen at digest
  `112feaad57ce04cb2dae15f5bd33f2e7e4fd3418cd3aece68aeb345ff1dc9039`.
  The focused gate passes 80/80 connected, bounded, grounded, split-plinth,
  broad-fortress, topology, and comparison distinctions, with 54/54 expected
  readable T-seal views. Fast validation passes in 56.4s and full validation in
  105.6s, preserving public 80/259 and all 232 fixtures. The designer replied
  `approved`; implementation `46d09a4e16a11f9c622cb698ff30055bb9bcb877`
  records the accepted pixels. Approval record
  `9c21f92aed06a66092279e8d53db6cb9a289cbd9` and the implementation are
  remote verified. Initial published handoff
  `9aea250a9a509a27a233d27633e6f7cf9bb759a2` is also remote verified; this
  reconciliation completes the bounded publication tuple. Registration,
  fixtures, effects, later EN-E08
  families, release, accepted drift, and a PR remain closed.
  The approved preceding private checkpoint is specialist Animated Armor
  Runeforge Custodian on `codex/en-e08-animated-armor-runeforge-custodian`,
  based exactly on clean published Hollow Sentry reconciliation
  `dc86bb65053564c76b18e848933ab4c2d318bfde`. Its independently authored
  constructed-rune-lock 80-frame baked actor is frozen at digest
  `629930688cca04f3d714e12225ab8c3db7c494c5fbaf027d65ec7f8d530ccf85`.
  The focused gate passes 80/80 connected, bounded, grounded, split-wedge,
  tall-square, topology, and comparison distinctions, with 54/54 expected
  readable rune-lock views. Frozen review + focused + fast pass together in
  59.6s and full validation passes in 113.1s, preserving public 80/259 and all
  232 fixtures. The designer replied `accepted`; implementation
  `d73ca9334640384d9b531c0d8375c1a42e459212` and approval record
  `717b4f7f735984550f44ce90d0bba58cfd6e1762` plus initial handoff
  `054b100cbf9edc8e13facb5f8a312c03b9a7bdd9` are remote verified. This
  reconciliation completes the bounded publication tuple, while the
  candidate remains unregistered, fixture-free, effect-free, and private.
  The approved preceding private checkpoint is common Animated Armor Hollow
  Sentry on `codex/en-e08-animated-armor-architecture`, based exactly on clean
  published Blackwake reconciliation
  `defc9b8cab1226610da6cf2b17951c8b5815499e`. The designer selected the
  recommended baked single-actor topology after the explicit architecture
  choice: helmet, plate body, gauntlets, bindings, greaves, and sabatons are one
  deterministic 24x24 actor and every frame reports zero child assets. Haunted
  Armor and Animated Armor remain one `animated-armor` family; Hollow Sentry is
  the haunted-default common identity. The frozen digest is
  `f6e7cbf25692b08e2e4dfccef149662c18d195e4cf615185f7a38e4874e2b9ac`:
  80/80 frames are connected, bounded, grounded, preserve split sabatons and
  broad plate spans, carry the baked-topology metadata, and differ in pixels
  and alpha from Fallen Knight Shieldbearer, Grave Oathkeeper Revenant, and
  Gloam Walker. The opaque range is 219-306, with 72/72 colored frames, 8/8
  exact white flashes, and 54/54 readable visor views. `check:fast` passes in
  62.3s and full `check` in 121.5s before approval, then in 61.5s and 107.7s
  against approved-local metadata, with public 80/259 and all 232 fixtures
  exact. The exact raw, Complete B + Form, and comparison PNGs are open
  together in responsive Aseprite 1.3.17.2 process 6832. Status is
  `approved`: the designer replied `apprvoed`, approving only the exact digest
  above. Implementation `914aa700b82469dbb22ca1600f1bc7ad6dbecff7` and
  approval record `6a577566766afc66aa01cdf1c7ebd1430aad425d` plus initial handoff
  `e12ff211dda002ac1c089eaedc0ff369d1e432e0` are remote verified. Status is
  `approved` and `published`; this reconciliation completes the bounded tuple.
  It remains unregistered, fixture-free, and non-public;
  child/state assets, effects, later roles/families, release, accepted drift,
  and a PR remain closed. Another art candidate requires a separate `lets do
  next` from this clean published reconciliation.
  The approved preceding publication checkpoint is elite Kelpie Blackwake Dreadmare on
  `codex/en-e07-kelpie-blackwake-dreadmare`, based exactly on clean published
  Drownbridle Stalker reconciliation
  `f9928aed53cd842b937d396e29ec8d6a7aaa8120`. Its broad rear-heavy silhouette
  uses a tall arched neck, long blunt readable muzzle, connected breaker mane,
  massive barrel and sternum, four thick separated legs over broad grounded
  dark hooves, and a connected hooked blackwake tail. The frozen digest is
  `be29daec400cffca3f5822aec3bd6ca37c8139a8783f51c7238b47aa37001172`:
  80/80 frames are connected, bounded, grounded, preserve four separated hoof
  runs and broad tall elite spans, and differ in pixels and alpha from approved
  Drownbridle Stalker, Miremane Courser, and Steppe Hunter. The opaque range is
  255-319, with 72/72 colored frames, 8/8 exact white flashes, 54/54 expected
  eye-bearing views, and 54/54 readable muzzle views. `check:fast` passes in
  62.9s and full `check` in 121.9s before approval and 112.2s against
  approval-local metadata, with public 80/259 and all 232 fixtures exact. The exact raw, Complete B
  + Form, and comparison PNGs are open together in Aseprite process 27380. The
  designer replied `approved lets do next`; approval applies only to the frozen
  digest above. Exact implementation
  `3a3ffce6997a6cc9735b818e13573b9085229555` and approval record
  `a397f3034b9ce894dd7caf971d4b3c1fbc9cb2e6` plus initial handoff
  `d4cfd72229355ccb6024e676562303bc6d633f98` are published and remote-verified.
  This reconciliation completes the bounded tuple. Its later architecture
  decision is resolved only as the private baked Hollow Sentry gate above. The
  candidate remains unregistered, fixture-free, and non-public; runtime
  copying, water effects, release, and accepted drift remain closed.
  The approved preceding publication checkpoint is specialist Kelpie Drownbridle Stalker
  on `codex/en-e07-kelpie-drownbridle-stalker`, based exactly on clean
  published Miremane Courser reconciliation
  `f143de1fadf3b812f3968d930acf6451e926388d`. Its forward-heavy high-crested
  equine silhouette uses a hooked readable muzzle, connected block crest and
  ochre reed bridle, deep chest, short barrel, four separated fetlocked legs
  over dark grounded hooves, and a connected ropeweed tail. The frozen digest
  is `d8cbbfef97b63590e6a63335a6b241e742d87f4df5e7443933c5484ef849224b`:
  80/80 frames are connected, bounded, grounded, preserve four separated hoof
  runs and specialist spans, and differ in pixels and alpha from approved
  Miremane Courser and Steppe Hunter plus public Dire Wolf. The opaque range is
  203-274, with 72/72 colored frames, 8/8 exact white flashes, 54/54 expected
  eye-bearing views, and 54/54 readable muzzle views. The focused gate passes
  in 0.7s, `check:fast` in 53.2s, and full `check` in 104.7s before approval
  and 110.3s against approval-local metadata, with public 80/259 and all 232
  fixtures exact. The exact raw, Complete B
  + Form, and comparison PNGs are open together in Aseprite at IDs 19, 23, and
  27. The designer replied `approved lets do next`; approval applies only to
  the frozen digest above. Exact implementation
  `c34b3b9564df683900ff3846d692970faca53ff5` and approval record
  `b5a9011b37dc9a3e0db7c371fa168e589665a127` are published and
  remote-verified. Initial handoff
  `1ba57fefe52398c2c007c01adfde6384c327e6f8` is published and remote-verified.
  This reconciliation completes the bounded tuple. The same reply opens only
  one private elite Kelpie candidate; registration, fixtures, runtime copying,
  effects, release, and EN-E08 remain closed.
  The approved preceding publication checkpoint is common Kelpie Miremane Courser on
  `codex/en-e07-kelpie-miremane-courser`, based exactly on clean published
  Manyfold Usurper reconciliation
  `6ddef83e03e983672bee39b6b484dd1c1bfcba01`. Its low lean waterlogged equine
  silhouette uses a bowed wet neck, long readable muzzle, connected dripping
  mane, long ribbed barrel, four separated legs and dark grounded hooves, and a
  connected drowned-weed tail. The frozen digest is
  `6efd596731a468be7647ee37f048046072bad289f209926e4db862cb63b01f32`:
  80/80 frames are connected, bounded, grounded, preserve four separated hoof
  contacts and long equine spans, and differ in pixels and alpha from approved
  Steppe Hunter plus public Dire Wolf and Marsh Crocodile. The opaque range is
  166-221, with 72/72 colored frames, 8/8 exact white flashes, 54/54 expected
  eye-bearing views, and 54/54 readable muzzle views. `check:fast` passes in
  66.0s and full `check` in 110.4s before approval and 120.2s immediately
  before the implementation commit, 102.4s against approval-local metadata,
  and 110.8s against the final published tuple, with public 80/259 and all 232
  fixtures exact. The exact raw, Complete B + Form, and comparison PNGs are open together
  in Aseprite. The front/rear equine read, tail color, hoof separation, and two
  detached walk legs were corrected before freeze. The designer replied
  `approved` on 2026-08-11; approval applies only to the frozen digest above.
  Exact implementation `74463a2b1944b7d3a6d412923c205a0c9cc648f1` and approval record
  `8fb53e961247da875814593feb132182648f9e48` plus initial handoff
  `ae532a17e92c3a7b0b99ccd3c938f8174f102dd6` are published and remote-verified.
  This reconciliation completes the bounded tuple. The candidate
  remains unregistered, fixture-free, and non-public. The designer's later
  `lets do next` opened only the private Drownbridle Stalker checkpoint above;
  runtime copying, effects, release, and EN-E08 remain closed.
  The approved preceding publication checkpoint is elite Changeling Manyfold Usurper on
  `codex/en-e07-changeling-manyfold-usurper`, based exactly on clean published
  Mirrorfold Harrier reconciliation
  `fdbb4cf04048a819b9cbe1655146842835b86a73`. Its broad tall grounded authored
  silhouette uses one connected three-tier fan mantle, deep side drapes, one
  centered readable face, ink-teal/wine/old-gold folds, paired heavy ordinary
  forearms, a pinched middle, wide separated pillar legs, and broad slab feet.
  The frozen digest is
  `f3ed9a91cb01746fc7467e59c92335778a85b476495f5772ac81cf2a6cbda246`:
  80/80 frames are connected, bounded, grounded, preserve the broad-three-tier
  and wide-pillar silhouette, and differ in pixels and alpha from approved
  Mirrorfold Harrier, Veilskin Foundling, and Grand Pretender. The opaque range
  is 276-330, with 72/72 colored frames, 8/8 exact white flashes, 54/54 expected
  eye-bearing views, and 54/54 readable face-feature views. `check:fast` passes
  in 48.5s and full `check` in 93.1s before approval, 104.1s immediately before
  implementation publication, 112.9s against approval-local metadata, and
  113.4s against the final published tuple, with public 80/259 and all 232
  fixtures exact. The three frozen PNGs are open
  together in responsive Aseprite 1.3.17.2 process 39276. The designer replied
  `approved lets do next` on 2026-08-11; exact implementation
  `38f9d7f9b3ac5a34bdff91be1fd878e158d26bfe` and approval record
  `306aa3ac1ba658cb48e223651410a7df494e7b9e` plus initial handoff
  `0d2f5ce3665f848633b4f7a1596356659d720afe` are published and remote-verified.
  This reconciliation completes the bounded tuple; the same reply opens only
  one private common Kelpie candidate.
  Registration, fixtures, runtime copying, effects, later Kelpie
  roles, release, and EN-E08 remain closed.
  The approved preceding specialist Changeling is Mirrorfold Harrier on
  `codex/en-e07-changeling-mirrorfold-harrier`, based exactly on clean
  published Veilskin Foundling reconciliation
  `5eabfecc08f992db675b64ea3317eb59f67d737c`. Its compact grounded authored
  silhouette uses one connected stepped diamond mantle, angular shoulders,
  one centered readable face, plum-copper pinched folds, paired long ordinary
  forearms, bent separated legs, and narrow wedge feet. The frozen digest is
  `be3e4d03263929ce9677fcf15b742cde769271d037160cd6461b45ea389660f2`:
  80/80 frames are connected, bounded, grounded, preserve the stepped-diamond
  and narrow-leg silhouette, and differ in pixels and alpha from approved
  Veilskin Foundling, Pale Echo, and Falseface Adept. The opaque range is
  202-248, with 72/72 colored frames, 8/8 exact white flashes, 54/54 expected
  eye-bearing views, and 54/54 readable face-feature views. `check:fast` passes
  in 56.7s and full `check` in 106.1s before approval, 138.6s against
  approval-local metadata, and 95.2s against the final published tuple, with
  public 80/259 and all 232 fixtures exact. The
  three frozen PNGs are open together in responsive Aseprite
  1.3.17.2 process 40804. The designer replied `approved lets do next` on
  2026-08-11; exact implementation
  `ab72a9c0600f016439a5351f363b3b34348dc4b1` and approval record
  `e976ca5fc5c249af4e727fb3bff7d58fd541a932` plus initial handoff
  `4ed366a39165660096306cbb327315b211639e3d` are published and remote-verified.
  This reconciliation completes the bounded tuple; the same reply opened only
  the private Manyfold Usurper elite checkpoint above. Registration,
  fixtures, runtime copying, effects, Kelpie,
  release, and EN-E08 remain closed.
  The approved preceding common Changeling is Veilskin Foundling on
  `codex/en-e07-changeling-veilskin-foundling`, based exactly on clean
  Mirecrown reconciliation `4ee32622ec2984ac805ac345b854f23584fda3c3`.
  Its small grounded authored fey silhouette uses one connected pear-shaped
  living veil, one centered face with dark eye sockets, amber glints, and a
  tiny mouth mark, ochre-coral folds, paired short ordinary
  arms, bowed legs, and broad splayed feet. The frozen digest is
  `e472931d214d369331d6cb750619471d9234ab11561233e700facab6ea4f0126`:
  80/80 frames are connected, bounded, grounded, hard-alpha, and pixel/alpha
  distinct from approved Pale Echo, public Goblin Scout, and public Imp Sprite;
  the opaque range is 201-267, with 72/72 colored frames, 8/8 exact white
  flashes, 54/54 expected eye-bearing views, and 54/54 readable face-feature
  views. The first digest
  `1a852ef46dcaa7fee5779379cb9eda9acd79e67cd53dd469ff9cfae9dc18844d`
  is superseded by this face-only repair. The revised ten-gate EN-E07 matrix
  passes in 6.3s, `check:fast` in 58.3s, and full `check` in 107.1s with all
  232 fixtures exact; full `check` also passes in 109.0s against approval-local
  metadata and 119.8s against the final published tuple. The designer replied
  `approved` on 2026-08-11; exact
  implementation `2a295aa70c8a6680ffb85881efa4ccd927a50979` and approval record
  `7d064226d9a0096f8b276f5b0bd30be93435962b`, plus initial published handoff
  `0dcd15249d97b3e24bf174b014885fa2c8b6177c`, form the completed remote-verified
  publication tuple. The packet remains unregistered and fixture-free. Runtime
  actor copying, effects,
  specialist/elite Changeling, Kelpie, release, and EN-E08 remain closed;
  another candidate needs a separate `lets do next`.
Fixture regeneration, remaining EN-E07 families, the
legacy renderer split, boss consolidation, and the Wildshot writer remain
separate decisions.

1. **Decide on the stale fixtures** (5 min decision): `npm run export:fixtures -- --verify`
   lists the 166 stale sheets. If downstream should get the repaired art: `--all` + commit.
2. **Migrate the 8 legacy boss generators onto the shared library** (small): mechanical, and the
   checkpoint gates verify byte-parity. Deletes ~1,900 duplicated lines; new bosses then copy a
   ~330-line exemplar instead of ~680.
3. **Make the boss library spec-driven** (medium): the 10 scripts encode the same motion grammar
   (squash cycles, palette glow, white-flash hurt, rotate+dim death) with different constants —
   turn a boss into ~150 lines of spec + optional custom poses. Biggest per-boss cut remaining.
4. **EN adoption completed; legacy renderer split remains optional** (medium):
   EN-F00 plus EN-E01/EN-E02/EN-E04/EN-E05 now provide the accepted expansion
   facade at 17 expansion families / 43 variants. Splitting the legacy
   `renderer.js` along its existing section banners remains a separate forge-
   engineering decision, not an enemy-content prerequisite.
5. **Keep the active HANDOFF entry concise** (completed 2026-08-09): the top
   now contains only the authoritative current/preceding checkpoints, and the
   long consolidation narrative is explicitly scoped beneath a historical-
   archive heading so it cannot be mistaken for the next lane.
6. **Split `check-project.mjs` into per-domain modules with data files** (medium): enables
   `--family <id>` targeted audits (seconds per family) and makes failures navigable.
7. **Boss asset diet** (medium): for bosses #11+, commit only the full sheet + manifest and derive
   the 95 recut PNGs at load/export; move the checkpoint corpus out of `death-review/` into a
   tracked path. Stops the 980-file flat directory from growing ~190 files per boss.
8. **Replace the frozen `export:bosses:13`** (small): catalog-driven roster file + per-boss
   artifacts so publishing boss #15 doesn't re-ship 1,248 PNGs. Then implement the wildshot v1
   writer (Slice 4) when you've settled LICENSE + the effect contract — that's the real fix for
   "no path from forge to game".
9. **Archive the dead review tooling** (small): 9 of 12 review scripts are zero-assertion image
   generators for already-approved plans; `outline-review.mjs` currently emits 31 false errors
   (its hardcoded 240/720 counts predate the 5-tier expansion). Move to `tools/archive/`, fold
   its live assertions into the tiered gate, recapture baselines.
10. **Add a 2-minute push CI** (trivial): `check:fast` + `check:bosses` on every push, full gate
    on release tags — regressions surface the day they land, not at release time.

## Part 5 — Claude Code setup (verified against current docs)

What changed in this repo already follows these; for your other projects:

- **CLAUDE.md loads fully at startup (including `@imports`) — keep it under ~200 lines** and put
  procedures in `.claude/skills/` instead: skills cost ~nothing until invoked (only name +
  description load) and can be called as `/add-enemy` style commands. That's the mechanism doing
  the heavy lifting here.
- **`.claudeignore` does not exist.** The real mechanism is permission deny rules —
  `"deny": ["Read(path/**)"]` in `.claude/settings.json` — used here for the noisiest
  intermediates.
- **Effort levels persist across sessions** (`low`→`xhigh`; `max`/`ultracode` are session-only) —
  so if a heavy effort was ever set, every later session inherits it until changed. For routine
  authoring passes: Sonnet at medium effort is the right default, and `/status`, `/context`,
  `/usage`, `/doctor` show what a session is actually carrying. `--safe-mode` exists for
  diagnosing plugin/hook overhead.
- **Auto-memory is real and on by default** — sessions accumulate project notes in
  `~/.claude/projects/<project>/memory/`; worth a periodic skim for stale "facts" in a
  fast-moving repo.
- The pasted GPT analysis was directionally right (over-verification, monoliths, doc bloat) but
  the dominant causes here were repo-specific and fixable: a broken 6.6-minute gate, a dead
  export path, and a 90K-token reading mandate. No prompt technique compensates for those;
  tooling fixes do.
