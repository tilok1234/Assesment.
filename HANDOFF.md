# Project Handoff

Date: 2026-08-02

## Purpose

This is the canonical new-chat continuation for the 8-bit Sprite Assembler.
The active lane is the isolated EN-F00 Enemy-expansion foundation, not a
continuation of the long Boss-production conversation. This handoff records the
live mainline, implemented-but-not-final-approved foundation, unchanged legacy
Enemy corpus, shipped NPC artifact, local Windows proof, unresolved Boss and
publisher boundaries, and the separate gate before EN-E01 can begin.

## Canonical Workspace And Git State

- Normal-work worktree:
  `C:\Users\headc\Documents\8-bit-sprite-assembler-main`
- Mainline branch: `main`
- Upstream: `origin/main`
- Isolated EN-F00 implementation worktree:
  `C:\tmp\8-bit-sprite-assembler-en-f00`
- EN-F00 branch: `codex/en-f00`, based on synchronized `main` at `f5476a2`.
- Verified synchronized base before EN-F00:
  `f5476a2c962fde1fa9e736aafce4ad01fae0ef99`
  (`Document enemy expansion and refresh handoff`).
- The isolated EN-F00 checkpoint follows `f5476a2`; always verify the live HEAD,
  branch, and upstream rather than copying a self-referential hash from this
  file.
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

Expected state after the local EN-F00 checkpoint: clean `codex/en-f00`, with
`main` still equal to `origin/main` at the verified base. Push, merge, and
EN-E01 remain separate approvals. Do not modify, clean, reset, rebase, or
repurpose the archived review checkout.

## Exact Next Lane

`ENEMY_EXPANSION_PLAN.md` remains the accepted decomposition of the designer's
80 additional proposals. It resolves them into:

- EN-F00, one renderer/registry foundation slice with no new family art;
- EN-E01 through EN-E18, eighteen standard 24x24 Enemy slices;
- EN-B01 through EN-B03, isolated 48x48 Hydra, Chimera, and Roc direction
  pilots; and
- 75 new standard families, one Ghoul upgrade, one two-proposal Armor merge,
  and three Boss candidates.

The designer explicitly authorized EN-F00 on 2026-08-02. Its isolated
implementation now provides the immutable expansion profile and ledger,
renderer/chassis registration contract, deterministic family/slice review
planning, renderer dispatch facade, completed-sheet validator, and focused
legacy-equivalence gate. It contains no family art, no registered expansion
families, and no public selector or pack additions.

The next gate is:

1. review and explicitly accept the isolated EN-F00 checkpoint;
2. keep the existing 57 families / 202 variants unchanged;
3. begin EN-E01 only after a separate go-ahead;
4. build baseline variants before full animation/variant expansion; and
5. stop at the four-direction Idle visual gate before registering or advancing
   a family.

EN-E01 contains Witch, Fallen Knight, Pirate, Necromancer, and Alchemist. It
does not authorize all later waves. The three new Boss proposals remain blocked
behind the current Boss review queue unless the designer explicitly changes
priority.

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

- Live catalog: 57 families / 202 variants.
- Current full public audit: 16,160 source frames.
- None/Complete B/Selective C outline gate: 48,480 cases.
- All existing families support approved Form shading and all three outline
  modes with no source-edge or out-of-bounds failures.
- The expansion projection is approximately 132 standard Enemy families / 427
  variants if every planned slice is later approved and completed.
- No proposed expansion family or runtime ID is currently registered.
- The EN-F00 built-in expansion registry and public-family view are both empty.
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

Run from the isolated EN-F00 worktree on 2026-08-02:

```powershell
npm.cmd run check:enemy-expansion
npm.cmd run check
git diff --check
```

Recorded EN-F00 results:

- the focused foundation gate passes its registry, ledger, renderer-key,
  review-targeting, sheet-contract, and negative-path assertions;
- all 57 legacy families / 202 sheets / 16,160 frames match the locked pixel
  digest above;
- zero expansion families are registered or public;
- the full project validator passes with all existing catalog, renderer,
  outline, shade, equipment, Boss, fixture, pack, and release-configuration
  counts unchanged; and
- no fixture, baseline, schema, UI, family art, Boss asset, release artifact,
  or archived review payload is modified.

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

- do not extend EN-F00 or begin EN-E01/Enemy art from this implementation alone;
- do not pre-register unfinished families, IDs, variants, selectors, or packs;
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

> Review the isolated EN-F00 checkpoint and its validation evidence, verify the
> legacy Enemy corpus is unchanged, and wait for my explicit approval before
> beginning EN-E01.

EN-F00 implementation does not authorize EN-E01. After EN-F00 checkpoint
acceptance, EN-E01 still requires its own explicit go-ahead and must stop at
the four-direction Idle visual gate.
