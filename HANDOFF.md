# Project Handoff

Date: 2026-08-03

## Purpose

This is the canonical new-chat continuation for the 8-bit Sprite Assembler.
EN-E01's completed-slice review and bounded public registration are complete;
its explicitly authorized consumer integration and outline/Form presentation
are also complete. EN-E02's common Idle, completed slice, registration at
`7b6e448`, and consumer integration at `8ab1837` are complete. On 2026-08-03 the
designer reopened seven family presentations for narrow walk/seam corrections:
Catfolk, Desert Raider, Fallen Knight, Fanatic Monk, Goatfolk, Necromancer, and
Witch. The stable approved registry remains exact historical evidence; the live
consumer path now carries an isolated repair candidate awaiting explicit visual
approval. No later production lane starts implicitly. This handoff records the
accepted EN-F00 foundation, ten approved EN-E01/EN-E02 families / 30 variants,
the unchanged 67-family / 232-variant public catalog, the separated repair lane,
unchanged legacy Enemy corpus, frozen pre-registration evidence, shipped NPC
artifact, local Windows proof, and unresolved Boss and publisher boundaries.

## Canonical Workspace And Git State

- Normal-work worktree:
  `C:\Users\headc\Documents\8-bit-sprite-assembler-main`
- Mainline branch: `main`
- Upstream: `origin/main`
- Isolated EN-F00 implementation worktree:
  `C:\tmp\8-bit-sprite-assembler-en-f00`
- Accepted EN-F00 branch: `codex/en-f00` at
  `73ad73a354738d21e8d3f33f2cbbc50315f64050`.
- Isolated EN-E01 candidate worktree:
  `C:\tmp\8-bit-sprite-assembler-en-e01`
- EN-E01 review/registration branch: `codex/en-e01`, based exactly on accepted
  EN-F00 `73ad73a`.
- EN-E01 consumer-integration branch: `codex/en-e01-consumers`, based exactly
  on synchronized public-registration/docs checkpoint `b368f80`.
- Approved EN-E01 Idle checkpoint: `73dbec9`.
- Complete private EN-E01 implementation checkpoint: `230a9a3`.
- Approved EN-E01 public-registration checkpoint: `b43ed6a`.
- Approved EN-E01 consumer implementation checkpoint: `e0be273`.
- Approved EN-E01 presentation checkpoint: `5196c0a`.
- Isolated EN-E02 candidate worktree:
  `C:\tmp\8-bit-sprite-assembler-en-e02`
- EN-E02 approval/registration branch: `codex/en-e02`, based exactly on
  approved EN-E01 presentation checkpoint `5196c0a`.
- Reviewed EN-E02 full-candidate implementation checkpoint:
  `b2c1283c33dbfd6b2c307fc4d2288877a149c9df`.
- Approved EN-E02 registration code checkpoint:
  `7b6e448fb1d44176bbf9ecee6798c52abb6e914e`.
- Clean-clone-safe registration artifact-gate checkpoint:
  `be44af7b52d199befab3689450c44bc34665dd67`.
- EN-E02 consumer implementation checkpoint:
  `8ab1837` (`Integrate approved EN-E02 consumers`).
- Seven-family repair-candidate implementation checkpoint:
  `6400dd5` (`Create enemy walk and seam repair candidate`).
- Verified synchronized base before EN-F00:
  `f5476a2c962fde1fa9e736aafce4ad01fae0ef99`
  (`Document enemy expansion and refresh handoff`).
- EN-F00 follows synchronized main `f5476a2`; EN-E01 follows EN-F00. Always
  verify the live HEAD, branch, and upstream rather than copying a
  self-referential hash from this file.
- The planning repository's `tools/ecosystem.lock.json` rules the assembler
  mainline as `main`.
- `codex/form-shading` is fully merged and archive-tagged as
  `archive/codex/form-shading`; its deleted remote branch is not a continuation
  target.
- The archived checkout at
  `C:\Users\headc\Documents\8-bit sprite assembler` remains review-only on
  local `wip/19-boss-review` at `fb4b664`. Its 60.9 MB review payload is parked
  safely and was intentionally not pushed.
- The older `codex/clean-clone-check` and `salvage/19-boss-continuation`
  worktrees are historical/support lanes, not normal implementation targets.

Before making a claim or edit in a new chat, run:

```powershell
git status --short --branch
git rev-parse HEAD
git rev-parse '@{upstream}'
git log -5 --oneline --decorate
```

Expected state around this checkpoint: clean `codex/en-f00` at `73ad73a`;
`codex/en-e01` containing the approved review and public-registration history;
`codex/en-e01-consumers` containing approved presentation checkpoint `5196c0a`;
`codex/en-e02` containing the approved common-Idle/completed-slice evidence,
the frozen 15-variant candidate snapshot, registration checkpoint `7b6e448`,
clone-safe artifact gate `be44af7`, and consumer implementation checkpoint
`8ab1837`, plus pending repair-candidate checkpoint `6400dd5`;
and `main` still equal to `origin/main` at
verified base `f5476a2`. Do not modify, clean, reset, rebase, or repurpose the
archived review checkout.

## Exact Next Lane

`ENEMY_EXPANSION_PLAN.md` remains the accepted decomposition of the designer's
80 additional proposals. It resolves them into:

- EN-F00, one renderer/registry foundation slice with no new family art;
- EN-E01 through EN-E18, eighteen standard 24x24 Enemy slices;
- EN-B01 through EN-B03, isolated 48x48 Hydra, Chimera, and Roc direction
  pilots; and
- 75 new standard families, one Ghoul upgrade, one two-proposal Armor merge,
  and three Boss candidates.

The current stop point is explicit designer acceptance of the seven-family
EN-E01/EN-E02 repair candidate. The previously approved common Idle and
completed-slice pixels remain exact in `ENEMY_EXPANSION_REGISTRY`. The isolated
consumer candidate changes 18 renderer-data records to add real foot strides,
replace Catfolk's white pseudo-transparent mouth band, and close the reported
Desert Raider, Fallen Knight, and Goatfolk checkerboard seams. Separate effects,
release, approved-registry promotion, and later slices remain unauthorized.

The designer accepted EN-F00, approved EN-E01's exact common-baseline Idle
artifact, authorized its full private production, accepted the completed-slice
review, authorized bounded public registration, and then explicitly authorized
legacy consumer integration on 2026-08-02.
EN-E01 now contains five immutable contract cards and all 15 common,
specialist, and elite briefs for Witch, Fallen Knight, Pirate, Necromancer, and
Alchemist. All variants render through one shared humanoid handler and implement
the standard 20-column Enemy contract in Down, Left, Right, and Up. The EN-E01
slice registry contains all five families / 15 variants. The cumulative stable
approved registry now contains EN-E01 plus EN-E02 at ten families / 30 variants.
The consumer catalog retains those exact IDs and counts, but this isolated
branch routes the pending repair registry for live review while keeping the
approved registry separately addressable.

The designer approved exact Idle PNG SHA-256
`2d710ab54a845c4805d428c428cfa9e1cda09f4adee886c5deafbafee831b7ee`
and 40-frame digest
`339c5ff809d3b17aec20b3ec953c8217470cde026fc743cde0cd3854ed5c3323`.
Those approved Idle pixels remain exact. Walk/Attack/Hurt, Enemy Cast/Death
aliases, all specialist/elite briefs, exhaustive structural checks, and focused
review evidence are complete. The public registry is pixel-identical to the
reviewed candidate across all 1,200 frames. Consumer checkpoint `e0be273`
publishes immutable `PUBLIC_ENEMIES`: the unchanged 57-family / 202-variant
legacy entries followed by the five approved families / 15 variants. Editor
selectors and sanitization, persisted Enemy specs, randomization, combat
defaults, thumbnails, ordinary/Wildshot packs, full/animation/direction
exports, and Complete Kits first consumed 62 families / 217 variants at that
historical checkpoint. EN-E02 consumer checkpoint `8ab1837` extends those same
generic paths to 67 families / 232 variants. The legacy `ENEMIES` array and all
16,160 locked legacy frames remain unchanged.
Optional assembled EN-E01 output now supports Complete B, Selective C, and Form
using each variant's published renderer palette ramps. Raw/None output remains
pixel-identical to the approved registry. The focused consumer gate exhausts
3,600 outline and 3,600 Form/outline cases across all 1,200 frames; it records
74,029 source-owned Form changes while preserving 69,090 protected pixels and
all added outline geometry. The designer accepted the live Witch/Hexer
Complete B + Form result on 2026-08-02 before authorizing continuation.

EN-E01 does not authorize all later waves. The three new Boss proposals remain
blocked behind the current Boss review queue unless the designer explicitly
changes priority.

## Required Reading

Read these completely before implementation:

1. `README.md`
2. `ARCHITECTURE.md`
3. `HANDOFF.md`
4. `ROADMAP.md`
5. `ENEMY_EXPANSION_PLAN.md`
6. `ENEMY_OUTLINE_PLAN.md`
7. `OUTLINE_RENDERING_PLAN.md`
8. `SHADE_RENDERING_PLAN.md`
9. `PRODUCTION_ROLL_PLAN.md`
10. `COMPATIBLE_REROLL_PLAN.md`
11. `OFFHAND_ITEMS_PLAN.md`
12. `GAME_PACK_EXPORT_PLAN.md`
13. `DEATH_ANIMATION_PLAN.md`
14. `WINDOWS_RELEASE.md`
15. `death-review/boss-48-drafts/README.md`

The order deliberately puts the active expansion authority before the
chronological completed-lane records.

## Stable Public Actor Contract

- Logical actor cell: 24x24.
- Direction rows: Down, Left, Right, Up.
- Animation columns:
  - Idle x2 at 420 ms
  - Walk x4 at 150 ms
  - Attack x4 at 115 ms
  - Cast x4 at 130 ms
  - Hurt x2 at 140 ms
  - Death x4 at 160 ms
- Full assembled actor sheet: 20 columns / `480x96` at native 1x.
- Players use authored Cast and Death motion.
- Enemy Cast aliases the matching Attack frame.
- Enemy Death aliases Hurt frames 1, 2, 2, 2.
- Effects start Off.
- The legacy effect-after-character compositor remains an explicit optional
  preview only; its foreground equipment occlusion rule remains on ice.

The 232 committed PNG fixtures are a deliberate legacy 12-column baseline.
Their `1152x384` 4x dimensions do not change the current public 20-column
runtime contract and must not be rewritten merely to match it.

## Current Enemy And Expansion State

- Locked legacy catalog: 57 families / 202 variants.
- Live public consumer catalog: 67 families / 232 variants.
- Current locked legacy audit: 16,160 source frames.
- Legacy None/Complete B/Selective C outline gate: 48,480 cases; the cumulative
  EN-E01/EN-E02 extension adds 7,200 source-preserving outline cases.
- All 67 public families support Form shading and all three outline modes at the
  assembled-output boundary with no source ownership or outline-geometry
  failures. EN-E01/EN-E02 consumer integration is accepted historically; the
  later seven-family repair presentation awaits designer acceptance.
- The expansion projection is approximately 132 standard Enemy families / 427
  variants if every planned slice is later approved and completed.
- The frozen EN-E01 candidate registry retains five internal families / 15
  reviewed variants as pre-registration evidence.
- The stable approved expansion registry exposes exactly ten EN-E01/EN-E02
  families / 30 variants.
- The live consumer expansion registry currently uses the isolated ten-family /
  30-variant repair candidate; the stable approved registry remains immutable
  comparison evidence with exact historical pixels.
- The frozen EN-E02 Idle registry retains five approved common baselines / 40
  exact Idle frames; the separate pre-registration candidate registry contains
  five immutable implemented-snapshot families / 15 variants / 1,200 frames.
  Its five approved records live separately in the registered slice boundary.
- Current lifecycle ledger: three approved slices, zero implemented slices, and
  nineteen planned slices.
- The immutable `PUBLIC_ENEMIES` catalog appends the consumer-integrated
  EN-E01/EN-E02 families to the unchanged legacy entries and is the source for
  editor selectors, randomization, kits, packs, thumbnails, and exports.
- Approved EN-E01/EN-E02 frames retain their reviewed raw pixels in the stable
  registry. The repair candidate is separate and the assembled-output boundary
  applies the same shared Form/outline algorithms to either registry.
- The complete legacy 20-column corpus retains SHA-256 pixel digest
  `190a0f32b961b23fe0207c5a53fc005f9761666d27b15b98c0030325a10bef0c`.
- Effects, projectiles, summons, telegraphs, attachments, and environment
  states remain separate asset/runtime contracts; they are not baked into new
  actors to make a proposal appear complete.

## Current Boss Review State

The isolated Bosses workspace contains fourteen direction entries:

- twelve approved direction designs;
- Furious Depraved Rhino's repaired quadruped direction candidate; and
- Eclipse Unicorn Sovereign's direction candidate.

Ten entries have full 80-frame animation corpora. Seven are reviewed/accepted:

- Ancient Mirejaw
- Bone Reliquary King
- Scorpion Empress
- Cyclops Forge-Titan
- Pit-Fiend Juggernaut
- Cruel Catgirl Templar of the Brutes
- Divine Armored Templar Astro Knight

Three animation corpora remain candidates:

- Goblin War-Crown
- Furious Depraved Rhino
- Gunslinger Boar Rider

Lava-Core Colossus, Abyssal Crown-Kraken, and Sun-Crown Griffin remain approved
static fallbacks; Unicorn remains a static candidate. Do not start another Boss
animation or treat structural checks as visual acceptance. Boss state remains
ephemeral and outside Enemy mode, the 24x24 renderer, persistence, ordinary
packs, schemas, Production rolls, fixtures, and Windows builds.

## Delivered Wildshot NPC Slice

The completed `wildshot-npc-slice-v1@bf6269c` delivery contains 32 Player-built
NPC looks:

- 13 named roles;
- 10 zone quest-givers; and
- nine ambient villagers.

Artifact facts:

- native 1x `480x96` sheets using the public 20-column contract;
- 2,560 runtime frames across 32 full sheets;
- Form shading, no outline, Effects Off, no baked shadow, and binary alpha;
- 70 ZIP entries / 301,736 bytes;
- SHA-256
  `548e0c9608a190983ac9705b6e1c9c36f29c2390022ebe55d85dc74919c23607`;
- consumer intake was verified and recorded by planning; and
- manifest marks `publicGamePackRelease: false`.

The local ignored archive, contact sheet, and archive record remain under
`dist/`. This is a delivered NPC intake artifact, not 32 new assembler catalog
options and not the still-blocked `wildshot-assembler` public game pack.

## Pack-Publish Gate And Known Compatibility Gap

Pushed checkpoint `bf6269c` adds:

- `tools/pack-publisher.mjs`;
- `tools/export-established-boss-pack.mjs`;
- `tools/check-pack-publisher.mjs`;
- `npm run check:pack-publish`; and
- the frozen `established-boss-pack-13-v1` release identity.

The safety harness correctly tests dirty-tree refusal, pushed-HEAD discovery,
remote/auth/tag readiness, and GitHub release invocation. It does **not** prove
that the frozen roster exists in the current Boss catalogs.

The live compatibility audit found:

- missing direction entries: Royal Night Elf Prince, Living Pyre, Tide Man the
  Blue, and Dryad of Nature; and
- missing animation entries: those four plus Lava-Core Colossus, Abyssal
  Crown-Kraken, and Sun-Crown Griffin.

Therefore `npm run check:pack-publish` passing does not make
`npm run export:bosses:13` runnable or publishable. Do not invoke the publish
command until the roster contract is reconciled and a direct roster/asset gate
is added and passes. The already-delivered external Boss pack does not prove
reproducibility from this mainline command.

## Wildshot Public Game-Pack Boundary

The pure `wildshot-assembler` v1 actor contract and Cast/Death audit are
complete at `d6a56c1`, but the public game pack still refuses emission. It
requires:

- approved license text;
- the compact effect frame/anchor/direction contract;
- a deterministic writer;
- an editor action; and
- a consumer handoff slice.

The NPC slice and frozen Boss transport do not satisfy or bypass these refusal
conditions.

## Windows Artifact State

A local standalone proof executable exists at:

`src-tauri/target/release/sprite-assembler.exe`

It was built on 2026-08-01 from the `bf6269c` worktree state, is 5,306,880
bytes, and has SHA-256
`f2186000a911dff55495915c00a22df0098900b5ef491da2d489c1f92142bbd7`.

It is ignored, uncommitted, not an NSIS installer, and has no recorded packaged
smoke-test or release approval. No setup executable exists beneath
`src-tauri/target/release/bundle/nsis/`; there is no approved Windows release
candidate. `npm run check:release -- --require-artifact` intentionally requires
the NSIS installer and is not satisfied by the standalone proof.

## Validation Evidence For This Handoff

Run from the canonical main worktree on 2026-08-02:

```powershell
npm.cmd run check
npm.cmd run check:pack-publish
npm.cmd run check:release
git diff --check
```

Recorded results before commit:

- full project validation passed;
- 57 Enemy families / 202 variants;
- 16,160 Enemy None-parity cases;
- 3,232 Enemy Cast aliases and 3,232 Enemy Death aliases;
- 16,160 exhaustive Enemy Form cases;
- 12,560 repaired-Enemy frame-safety cases;
- 232 legacy fixture sheets validated;
- pack publisher harness passed eight assertion groups; and
- Windows release configuration passed 35 assertions, with no NSIS installer
  artifact found or claimed.

The documentation audit additionally verifies:

- all 80 proposals occur exactly once in the expansion accounting;
- EN-F00, EN-E01 through EN-E18, and EN-B01 through EN-B03 are present;
- the handoff names the expansion plan as the active lane authority;
- current Boss counts match the live catalogs;
- the NPC archive hash matches its archive record; and
- the standalone executable hash matches the recorded value.

Run from the isolated EN-E02 worktree on 2026-08-02:

```powershell
npm.cmd run check:enemy-expansion
npm.cmd run check:enemy-expansion-en-e01
npm.cmd run check:enemy-expansion-en-e01-full
npm.cmd run check:enemy-expansion-en-e01-registration
npm.cmd run check:enemy-expansion-en-e01-consumers
npm.cmd run check:enemy-expansion-en-e02
npm.cmd run check:enemy-expansion-en-e02-full
npm.cmd run check:enemy-expansion-en-e02-registration
npm.cmd run check:enemy-expansion-en-e02-registration:artifacts
npm.cmd run check:enemy-expansion-en-e02-consumers
npm.cmd run review:enemy-expansion-en-e01
npm.cmd run review:enemy-expansion-en-e01-full
npm.cmd run review:enemy-expansion-en-e02
npm.cmd run review:enemy-expansion-en-e02-full
npm.cmd run check
git diff --check
```

Recorded EN-F00, EN-E01, and current EN-E02 results:

- the focused foundation gate passes its registry, ledger, renderer-key,
  review-targeting, sheet-contract, and negative-path assertions;
- all 57 legacy families / 202 sheets / 16,160 frames match the locked pixel
  digest above;
- EN-E01's frozen pre-registration Idle gate passes five immutable contract cards, five internal
  common baselines, 40 deterministic Idle frames, four-direction/two-frame
  ordering, hard alpha, one-cell margins, no clipping, distinct silhouettes,
  and zero public-family exposure;
- candidate frame digest:
  `339c5ff809d3b17aec20b3ec953c8217470cde026fc743cde0cd3854ed5c3323`;
- exact review PNG SHA-256:
  `2d710ab54a845c4805d428c428cfa9e1cda09f4adee886c5deafbafee831b7ee`;
- EN-E02's approved common-only Idle gate passes five immutable cards, five
  internal variants / 40 deterministic Idle frames, four-direction ordering,
  hard alpha, one-cell margins, distinct silhouettes, mirrored side occupancy,
  and zero EN-E02 consumer exposure from the frozen snapshot;
- EN-E02 candidate frame digest:
  `00d71d7e8f1904c275bfe84ec6cec746fb314fab4d27ce182d72e286a846d02b`;
- EN-E02 review PNG SHA-256:
  `c224258139c7c810c7a122ea9e95061f3dd1697864913765fe9d11e09f4eca50`;
- EN-E02's full private gate passes five implemented families / 15 variants, 15
  complete `480x96` sheets, all 1,200 frames, deterministic full motion,
  Cast-to-Attack and Death-to-Hurt aliases, hard alpha, strict margins,
  within-family silhouette distinction, exact approved-Idle preservation, and
  zero approved families in the frozen pre-registration candidate view;
- the private presentation proof passes 2,400 Complete B/Selective C outline
  cases and 3,600 Form-with-None/B/C cases, adding 103,077 Complete B and 81,840
  Selective C pixels while preserving 77,597 protected pixels;
- EN-E02 full candidate frame digest:
  `f4667a1ccefb3026c6df3604e114393fdaae619dab0c68bec969203986cb35bf`;
- EN-E02 full overview PNG SHA-256:
  `21f3175600377eaf75206f9fcb65856731da28eafb6715687821f782f41da6a8`;
- EN-E02 Complete B/Form presentation PNG SHA-256:
  `211e9ace3eb965f243724249c73927567568e2f22f181f5448ba398ddab4a094`;
- EN-E02 motion-board SHA-256 values: Catfolk
  `c73d0b7b2ffea9c8a5aa061460403b4cfa66099b3ed66baef950872bf4bd8c2c`,
  Desert Raider
  `a5102c40d41c9bd69aecc9940f5ac42e208fdfc9a215ea8998c73010ebe523e9`,
  Fanatic Monk
  `d248943af3fe590a396de3610891f494da2ee3ed79b1d29f48140595a0549441`,
  Goatfolk
  `ea3348595aa761695e2419b6656631e2f760c81948aa1c481f0999455e423e83`,
  and Plague Doctor
  `039efe503a31888ec23a0855838f6a46deb79ddc0676befaca4f2bbb6fac7c5b`;
- EN-E02 review JSON SHA-256:
  `0a135fbed3eeeaf69400a3700d113af67a0c2a75043f95ab2a392711cd6b0afa`;
- the designer approved that exact completed-slice evidence and bounded
  registration checkpoint `7b6e448` composes ten approved EN-E01/EN-E02
  families / 30 variants through the stable registry;
- the EN-E02 registration gate locks the overview, Complete B/Form
  presentation, review manifest, reviewed implementation commit, Idle digest,
  and full digest; verifies 15 registered `480x96` sheets and exact
  candidate/registered parity across all 1,200 frames. At registration checkpoint
  `7b6e448`, the consumer registry remained EN-E01-only and `PUBLIC_ENEMIES`
  remained 62/217; that is preserved as historical gate evidence;
- clone-safety checkpoint `be44af7` passes the default registration gate in a
  fresh detached worktree without ignored artifacts, while strict artifact mode
  correctly rejects their absence; the local strict run re-hashes all three
  reviewed files successfully;
- the frozen EN-E01 pre-registration full gate passes five internal families / 15 variants, 15 complete
  `480x96` sheets, all 1,200 frames, deterministic direction and motion,
  Cast-to-Attack and Death-to-Hurt aliases, hard alpha, strict margins, and zero
  public families;
- full candidate frame digest:
  `addcf8055a80a0a6266be0eff8cd6b8235092c6ba366bc9c020bd5feb90ae173`;
- full overview PNG SHA-256:
  `0b38f2737b5215d37a08e0ae3f7e25f82e88bb17a97641e33b0ee9ef9c0e8fb7`;
- motion-board SHA-256 values: Witch
  `a6a15cba3fbbcf342533491836a700fdbb5965301e6872d2e07c9535c249c0a9`,
  Fallen Knight
  `6e688f2f3da3781608d555510d85be08b3df6b7a8e06cdc4e48937247de186b5`,
  Pirate
  `4aa570b3f52866d42814950677ca6c65346f4a458552041e021ec1b6c16ab81a`,
  Necromancer
  `379efc15f29ed991ac307308038bbcdbf2802e6cdc12015a8be3668413379abe`,
  and Alchemist
  `c07fe982683926583336062a5a97040cf038b6d592bccf9aafeb390bb2010056`;
- review JSON SHA-256:
  `129f3f2b81318df08edf2b0b1dc2183fc8494450027e91ceea04a2248208e398`;
- all review artifacts are ignored evidence; internal native/4x/Aseprite
  inspection accepted the candidate and the designer approved the completed
  slice;
- the registration gate passes five approved/public families, 15 variants, 15
  complete `480x96` sheets, stable-facade routing, current
  three-approved/zero-implemented/nineteen-planned lifecycle counts, and exact
  public/candidate parity across all 1,200 frames;
- the cumulative EN-E01/EN-E02 consumer gate passes unchanged 57/202 legacy
  locks, immutable 67/232 public composition, editor persistence/selectors,
  randomization, combat defaults, Complete Kits, Wildshot validation,
  thumbnails, all export scopes, 2,400/2,400 adapter frames, 30/30 native full
  sheets, 7,200 source-preserving None/B/C outline cases, and 7,200
  deterministic Form/outline cases with all 180 renderer palette colors
  resolved. The stable approved aggregate remains 207,162 Complete B pixels,
  164,487 Selective C pixels, 174,917 source-owned Form changes, and 146,687
  protected pixels. The repair consumer aggregate is 207,356 Complete B,
  163,843 Selective C, 175,878 Form changes, and 145,528 protected pixels;
- `check:enemy-expansion-repairs` passes 1,680 affected-family frames, exactly
  18 authorized renderer-data changes, alternating stride extremes, at least
  three distinct foot-contact silhouettes per Walk direction, binary alpha,
  one-cell margins, zero clipping, and every reported seam coordinate;
- repair motion boards and native sheets exist under
  `enemy-expansion-review/repair-candidate/`; affected-family digest
  `c24f36eac5dedd10a1c931b7d59b52f379c3113e4c80fb8aa73bc71514e1e7c8`;
- live browser smoke advances Walk frames 1-4 for all seven reported baseline
  variants at 20x with Complete B and Form active;
- the full project validator passes with all existing catalog, renderer,
  outline, Form-shade, Cast/Death alias, equipment, Boss, 232-fixture, pack,
  and release-configuration gates unchanged; and
- no legacy fixture, approved visual baseline, schema version, Boss asset,
  release artifact, archived review payload, or stable approved EN-E01/EN-E02
  source pixel is modified; the repair remains a separate consumer candidate.

## Documentation Audit Result

The 2026-08-02 audit covered all Required Reading documents and reconciled
current state against Git, live catalogs, package scripts, local artifacts,
and the planning mainline ruling.

Current-facing drift was corrected in:

- `README.md`;
- `ARCHITECTURE.md`;
- `HANDOFF.md`;
- `ROADMAP.md`;
- `PRODUCTION_ROLL_PLAN.md`;
- `DEATH_ANIMATION_PLAN.md`;
- `WINDOWS_RELEASE.md`; and
- `death-review/boss-48-drafts/README.md`.

`ENEMY_EXPANSION_PLAN.md` is added as the new active planning authority. The
remaining audited plans retain accurate completion/refusal state and clearly
label their older branch names, 12-column measurements, or release exclusions
as historical evidence rather than live continuation instructions.

## Frozen Boundaries

Unless the designer explicitly changes scope:

- preserve the exact approved common-baseline Idle and completed-slice pixels in
  the stable registry;
- preserve the merged 67-family / 232-variant `PUBLIC_ENEMIES` consumer
  boundary without mutating the locked legacy `ENEMIES` array;
- do not pre-register unfinished families, IDs, variants, selectors, or packs;
- do not promote or record acceptance of the seven-family repair candidate, or
  advance to EN-E03, without an explicit designer response to the live review;
- do not modify the archived `wip/19-boss-review` checkout;
- do not accept the Rhino/Unicorn direction candidates or the three animation
  candidates without direct visual review;
- do not start Hydra, Chimera, Roc, or another Boss animation in parallel;
- do not resume or alter the legacy effect compositor;
- do not bake effects, projectiles, summons, or environment states into actor
  sheets;
- do not rewrite fixtures or visual baselines;
- do not invoke the incompatible 13-Boss publish command;
- do not call the standalone executable a release candidate; and
- do not change actor geometry, animation timing/order, stable IDs, public
  schemas, or the 20-column sheet contract incidentally.

## New-Chat Opening

The safest opening request for the next chat is:

> EN-E01 and EN-E02 are approved, registered, and consumer-integrated. A
> 2026-08-03 repair candidate corrects Catfolk, Desert Raider, Fallen Knight,
> Fanatic Monk, Goatfolk, Necromancer, and Witch while preserving the exact
> stable approved registry. Verify the clean synced branch and 67/232 public
> boundary, then open the repair boards/live Walk preview with Complete B + Form
> and wait for explicit designer acceptance before promotion or EN-E03.

EN-F00, EN-E01, and EN-E02 are approved. The stable registry contains ten
EN-E01/EN-E02 families / 30 variants with exact reviewed pixels. The live
consumer registry carries an isolated repair of the same IDs/counts through 67
public families / 232 variants. Repair acceptance, effects, release, and EN-E03
are not authorized implicitly.
