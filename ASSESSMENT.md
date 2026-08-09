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
implementation is committed at `98865936244b94860985210fcaf9a044b0ca228a`;
only bounded approval-record publication is authorized.
Fixture regeneration, later Redcaps/Nymph, the legacy renderer split, boss
consolidation, and the Wildshot writer remain separate decisions.

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
