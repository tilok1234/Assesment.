# Project Handoff

Date: 2026-07-28

## Purpose

This is the canonical next-chat continuation for the 8-bit Sprite Assembler.
It records the live Git state, the completed documentation audit, the current
uncommitted Bosses workspace, its validation evidence, and the approval
boundary. Historical plan measurements remain in their plan files and are
explicitly labeled as historical where the public animation contract later
expanded.

## Canonical Workspace And Git State

- Worktree:
  `C:\Users\headc\.codex\worktrees\9f24\8-bit sprite assembler`
- Branch: `codex/form-shading`
- Local HEAD: `08d1ef78f4c7011f57e23801f91bd30176527121`
  (`Checkpoint 48x48 boss direction pilots`)
- Upstream: `origin/codex/form-shading`
- Upstream commit: `d6a56c10ae028e95c1aba09c0dba6d1c3449766b`
  (`Add Wildshot game-pack Cast and Death`)
- The local branch is one commit ahead of upstream.
- The worktree is intentionally dirty with the Bosses editor/animation lane
  and this documentation audit.
- Nothing in the current dirty lane has been committed or pushed.
- No Windows artifact has been built for this state.

Before making any claim or edit, rerun:

```powershell
git status --short --branch
git rev-parse HEAD
git rev-parse '@{upstream}'
git log -3 --oneline --decorate
```

Do not switch to the similarly named checkout beneath `Documents`. Continue
only in the isolated worktree above, and preserve all intentional dirty work.

## Required Reading

Read these completely before implementation:

1. `README.md`
2. `ARCHITECTURE.md`
3. `HANDOFF.md`
4. `ROADMAP.md`
5. `PRODUCTION_ROLL_PLAN.md`
6. `COMPATIBLE_REROLL_PLAN.md`
7. `OFFHAND_ITEMS_PLAN.md`
8. `OUTLINE_RENDERING_PLAN.md`
9. `ENEMY_OUTLINE_PLAN.md`
10. `SHADE_RENDERING_PLAN.md`
11. `GAME_PACK_EXPORT_PLAN.md`
12. `DEATH_ANIMATION_PLAN.md`
13. `WINDOWS_RELEASE.md`
14. `death-review/boss-48-drafts/README.md`

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
- The legacy effect-after-character compositor remains available only as an
  explicit preview and remains on ice for foreground shield/equipment
  occlusion.

The checked-in 232 PNG fixtures are still the legacy 12-column baseline. Their
unchanged dimensions are intentional and are not evidence that the public
runtime contract is still 12 columns.

## Completed Pushed Work

The upstream checkpoint `d6a56c1` contains:

- approved Form shading and Effects-Off default;
- the approved Lantern utility off-hand;
- Production Roll v1 beside the unchanged `randomPlayer()` Wildcard Roll;
- compatible Production category rerolls;
- the pure Wildshot game-pack v1 contract/refusal boundary;
- approved public Player Cast and Death motion;
- deterministic Enemy Cast and Death aliases;
- the 20-column / `480x96` actor contract.

The Wildshot game-pack is not ready to emit. It still refuses without approved
license text and a compact effect-pack contract. The deterministic writer,
editor action, and consumer handoff slices also remain pending.

## Local Boss Direction Checkpoint

Local commit `08d1ef7` contains nine approved 48x48 direction pilots:

1. Ancient Mirejaw
2. Bone Reliquary King
3. Scorpion Empress
4. Cyclops Forge-Titan
5. Pit-Fiend Juggernaut
6. Goblin War-Crown
7. Lava-Core Colossus
8. Abyssal Crown-Kraken
9. Sun-Crown Griffin

Each direction pilot has checkpoint-exact Down/Left/Right/Up frames and a
native `48x192` hard-alpha direction sheet. This commit is local and has not
been pushed.

## Current Uncommitted Bosses Workspace

Six pilots now have complete review-only animation corpora:

- Ancient Mirejaw
- Bone Reliquary King
- Scorpion Empress
- Cyclops Forge-Titan
- Pit-Fiend Juggernaut
- Goblin War-Crown

Each animated pilot contains:

- 80 distinct 48x48 frames;
- four directions in Down/Left/Right/Up order;
- Idle x2, Walk x4, Attack x4, Cast x4, Hurt x2, Death x4;
- one native `960x192` full sheet;
- four native `960x48` direction sheets;
- six native animation sheets;
- exact Idle-frame-1 parity with the approved direction pilot;
- hard alpha and a safe transparent frame border.

Lava-Core Colossus, Abyssal Crown-Kraken, and Sun-Crown Griffin remain explicit
static four-direction fallbacks.

The Bosses UI mirrors useful Player review controls without creating a fourth
persisted document kind:

- pilot and direction selection;
- animation selection for the six animated pilots;
- play/pause, frame stepping, 0.5x/1x/2x speed, and Cycle all;
- native 1x full-sheet, current-animation, and current-direction downloads;
- static all-direction display/download for the three fallbacks.

Boss state is ephemeral. It does not enter history, presets, persistence,
Production/Wildcard rolls, ordinary packs, Complete Kits, Wildshot game packs,
fixtures, baselines, effects, the 24x24 procedural renderer, release artifacts,
or Windows builds.

## Visual Review State

- Ancient Mirejaw, Bone Reliquary King, Scorpion Empress, and Cyclops
  Forge-Titan were accepted after focused live review.
- Pit-Fiend Juggernaut was repaired after review with continuous body motion
  and a non-destructive tower-shield bash.
- Goblin War-Crown is the current visual-review candidate.
- Do not describe Goblin War-Crown or the six-boss batch as finally visually
  approved until the user explicitly accepts that current candidate.
- Do not begin Lava-Core Colossus, Abyssal Crown-Kraken, or Sun-Crown Griffin
  animation work without a new one-at-a-time approval.

## Structural Validation

The focused Bosses gates pass:

```powershell
node tools/check-boss-directions.mjs
node tools/check-boss-animations.mjs
```

Current focused totals:

- nine direction catalogs;
- 36 checkpoint-exact 48x48 direction frames;
- nine checkpoint-exact `48x192` direction sheets;
- six animation catalogs;
- 480 distinct animated 48x48 frames;
- 66 native full/scoped animation sheets;
- exact control-frame parity;
- hard alpha, transparent safety borders, immutable facade exports, UI wiring,
  and dependency isolation.

The full structural gate passes:

```powershell
npm.cmd run check
```

Important current 20-column totals:

- 6,000 weapon cases
- 12,800 shield cases
- 320 Lantern cases
- 880 equipped-headgear cases
- 480 broad Player shade-None parity cases
- 16,160 Enemy shade-None parity cases
- 1,616 sampled Enemy outline-parity cases
- 2,880 Form pilot cases
- 158,872 changed Form pixels
- 164,685 protected source pixels
- 35,333 material/control differences
- 16,160 exhaustive Enemy Form cases
- 1,616 Enemy Form/outline integration cases
- 1,000 Production policy cases
- 29 bounded Production fallbacks
- 80 deterministic Production assembled-render cases
- 4,200 compatible-reroll cases
- 555 explicit no-compatible-alternative cases
- 232 committed legacy fixture sheets, all still `1152x384`

The current balanced Production review geometry is 19,200 source frames /
57,600 Form-outline cases. The frozen selection corpus remains 120 Production
results plus 120 paired Wildcard controls and retains the approved digest
`af9b620e5ce87f6febf5983487fc163e8b5a4495fb37ced3653e8b5bbbc4ba3f`.

Ignored review pages generated before Cast/Death may still embed their
historical 12-column report totals. They are disposable evidence, not source
documentation or accepted baselines. Regenerate them only in a writable
review-output directory; do not rewrite fixtures or accept new baselines.

Also run before any proposed checkpoint:

```powershell
git diff --check
git status --short --branch
```

## Documentation Audit Result

The 2026-07-28 audit corrected current-facing drift in:

- `README.md`
- `ARCHITECTURE.md`
- `HANDOFF.md`
- `ROADMAP.md`
- `PRODUCTION_ROLL_PLAN.md`
- `COMPATIBLE_REROLL_PLAN.md`
- `OFFHAND_ITEMS_PLAN.md`
- `OUTLINE_RENDERING_PLAN.md`
- `ENEMY_OUTLINE_PLAN.md`
- `SHADE_RENDERING_PLAN.md`
- `GAME_PACK_EXPORT_PLAN.md`
- `DEATH_ANIMATION_PLAN.md`
- `WINDOWS_RELEASE.md`

The audit deliberately did not erase chronological evidence. Historical
9,696 / 29,088 enemy-outline totals, 12-column shade/off-hand measurements,
Cast-only 16-column dimensions, and earlier release checkpoints remain where
they are clearly labeled as historical.

`death-review/boss-48-drafts/README.md` was checked and already describes the
six animated / three static split and the isolation boundary.

## Frozen Boundaries

Unless the user explicitly changes scope:

- do not commit or push;
- do not build or update the executable or installer;
- do not accept or rewrite fixtures or visual baselines;
- do not change effects or resume the effect compositor;
- do not route bosses through Enemy mode or the 24x24 procedural renderer;
- do not add Boss persistence, schemas, presets, packs, recipes, Production
  rolls, provenance, or game-pack export;
- do not change actor geometry, component paths, stable catalog ids, animation
  timing, or public sheet order;
- do not start another boss animation in parallel.

## Exact Next Step

1. Refresh the live assembler and review Goblin War-Crown through every
   direction and animation at native and enlarged scale with Effects Off.
2. If the user requests a repair, change only that candidate and rerun both
   boss gates plus `npm.cmd run check`.
3. If the user explicitly accepts the candidate, ask whether to:
   - create a commit/push checkpoint for the complete six-boss workspace and
     documentation audit; or
   - keep the work uncommitted and begin exactly one of the three static
     bosses as a separate animation candidate.
4. Do not infer approval from structural tests or from acceptance of an older
   frame.

## Current Dirty Scope

The intended dirty source scope consists of:

- Bosses UI/state/styles in `index.html`, `app.js`, and `styles.css`;
- stable boss facade/catalog wiring in `sprite-engine.js`,
  `engine/catalogs.js`, `engine/catalogs/boss-directions.js`, and
  `engine/catalogs/boss-animations.js`;
- runtime boss assets beneath `engine/assets/bosses/`;
- focused boss validators and deterministic generators beneath `tools/`;
- current-state documentation listed in the audit section.

Treat any additional path as unexpected until explained by a fresh
`git status` and diff.
