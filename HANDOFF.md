# Project Handoff

Date: 2026-07-30

## Purpose

This is the canonical next-chat continuation for the 8-bit Sprite Assembler.
It records the ruled `main` mainline, the normal-work worktree, the parked
19-boss review state, the pushed Bosses checkpoint, the completed documentation
audit, its validation evidence, and the remaining visual-approval boundary.
Historical plan measurements remain in their plan files and are explicitly
labeled as historical where the public animation contract later expanded.

## Canonical Workspace And Git State

- Normal-work worktree:
  `C:\Users\headc\Documents\8-bit-sprite-assembler-main`
- Mainline branch: `main`
- Upstream: `origin/main`
- Current synchronized main checkpoint when this correction began: `e5ecdea`
  (`Sync-log hook in the README (doc 18 accepted 2026-07-30)`).
- Consolidation checkpoint: `c6dcdc5`. It contains all four former Codex
  development lines, including the game-pack source commit `b7eae05f`.
- `codex/form-shading` is fully merged and archive-tagged as
  `archive/codex/form-shading`; its deleted remote branch is not a continuation
  target.
- The archived checkout at
  `C:\Users\headc\Documents\8-bit sprite assembler` is review-only. Its entire
  former dirty state is parked on local branch `wip/19-boss-review` at
  `fb4b664` (`Park 19-boss review state`), branched from unchanged archived
  checkpoint `9b7f4bf`.
- That parked commit contains the five tracked modifications,
  `engine/effect-compositor.js`, and both generated review directories. The
  branch remains local because the parked review payload is about 60.9 MB.
- Pushed direction-pilot checkpoint: `08d1ef7`
  (`Checkpoint 48x48 boss direction pilots`).
- Pushed animated-workspace checkpoint: `f15a9cf`
  (`Add animated boss review workspace`).
- No Windows artifact has been built for this state.

Before making any claim or normal edit in the main worktree, rerun:

```powershell
git status --short --branch
git rev-parse HEAD
git rev-parse '@{upstream}'
git log -3 --oneline --decorate
```

Normal work happens only in the `main` worktree above. Do not modify, clean,
reset, rebase, or repurpose the archived review checkout unless the designer
first resolves its open review call.

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

## Pushed Boss Direction Checkpoint

Pushed commit `08d1ef7` contains nine approved 48x48 direction pilots:

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
native `48x192` hard-alpha direction sheet.

The current main worktree appends the user-approved Cruel Catgirl Templar of
the Brutes as the tenth direction pilot, followed by the user-approved Divine
Armored Templar Astro Knight as the eleventh and the user-approved Gunslinger
Boar Rider as the thirteenth. Furious Depraved Rhino was previously approved
as the twelfth, but its new low quadruped redesign remains a four-direction
candidate. Eclipse Unicorn Sovereign is the fourteenth entry and a second
four-direction candidate.

## Pushed Bosses Workspace

Pushed technical checkpoint `f15a9cf` adds complete review-only animation
corpora for six pilots:

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
- exact Idle-frame-1 parity with the current direction control;
- hard alpha and a safe transparent frame border.

The current main worktree appends Cruel Catgirl Templar of the Brutes as the
seventh 80-frame animation corpus and Divine Armored Templar Astro Knight as
the eighth. Both are visually accepted. Furious Depraved Rhino is the ninth
80-frame corpus and Gunslinger Boar Rider is the tenth; both are explicit
animation candidates awaiting live visual review. Lava-Core Colossus, Abyssal
Crown-Kraken, and Sun-Crown Griffin remain the three approved static
four-direction fallbacks. Eclipse Unicorn Sovereign remains static until its
direction design is approved.

The Bosses UI mirrors useful Player review controls without creating a fourth
persisted document kind:

- pilot and direction selection;
- animation selection for the ten animated pilots;
- play/pause, frame stepping, 0.5x/1x/2x speed, and Cycle all;
- native 1x full-sheet, current-animation, and current-direction downloads;
- static all-direction display/download for the three approved fallbacks.

Boss state is ephemeral. It does not enter history, presets, persistence,
Production/Wildcard rolls, ordinary packs, Complete Kits, Wildshot game packs,
fixtures, baselines, effects, the 24x24 procedural renderer, release artifacts,
or Windows builds.

## Visual Review State

- Ancient Mirejaw, Bone Reliquary King, Scorpion Empress, and Cyclops
  Forge-Titan were accepted after focused live review.
- Pit-Fiend Juggernaut was repaired after review with continuous body motion
  and a non-destructive tower-shield bash.
- Goblin War-Crown's animation checkpoint does not gain implicit visual
  approval from later work.
- Cruel Catgirl Templar of the Brutes has an explicitly approved
  four-direction design and its repaired full animation was accepted when the
  user responded "awesome" and moved to the next boss.
- Its weapon-depth repair keeps the ready hammer and visible gauntlet grip in
  front; attack lifts split the hammer head behind the body while the near shaft
  and grip stay visible in front, then the full hammer comes forward for the slam.
- Divine Armored Templar Astro Knight has an explicitly approved
  four-direction design: sealed celestial plate, a distinct domed helm with
  narrow radiant T-visor, astrolabe halo, star-lance, constellation cloak, and
  orbit shield.
- Its isolated 80-frame animation corpus uses armored idle, heavy march,
  shield-braced star-lance thrust, astral halo cast, radiant recoil, and staged
  celestial collapse motion while keeping both relics in the foreground.
- The Astro Knight animation was explicitly accepted when the user responded
  "very good!" and moved to the next boss.
- Furious Depraved Rhino's earlier upright brute design was accepted when the
  user responded "very good", then explicitly reopened when the user requested
  a more readable quadruped rhino.
- Its current repaired direction candidate is a low, long four-legged charge
  beast with a shoulder hump, separated front/rear hoof columns, a forward
  head, dominant nasal horn, scarred grey hide, broken restraints, crimson
  rage brand, and corrupted flesh patches.
- The follow-up side-view repair reduces the profile head to the front third,
  extends a clean shoulder/ribcage/rump and belly line, and places two
  forelegs plus two hindlegs at four distinct horizontal positions; Right
  remains the exact mirror of Left.
- Gunslinger Boar Rider has an explicitly approved four-direction design: a
  wide-brim outlaw with foregrounded twin revolvers, red bandana, split duster,
  armored saddle, and a massive bristled boar with red eyes and paired tusks.
- The Boar Rider directions were explicitly accepted when the user responded
  "nice" and requested animation for the last bosses.
- The regenerated Rhino animation candidate applies heavy breathing,
  four-legged stamp/charge motion, a horn-led lunge, corruption roar, bright
  recoil, and staged collapse to the quadruped controls.
- The Boar Rider animation candidate uses mounted breathing, gallop motion,
  dual-revolver fire/recoil, a Deadeye powder-sigil cast, mounted hurt recoil,
  and a staged rider-and-boar collapse.
- Eclipse Unicorn Sovereign is a new four-direction candidate: a pearl-white
  war-unicorn with a long striped sunhorn, luminous cyan eyes, flowing violet
  eclipse mane and tail, crescent barding, and four separated hoof columns.
  Right is the exact horizontal mirror of Left; animation is not yet
  authorized.
- Both new 80-frame animation corpora are structurally integrated but remain
  visual candidates. Goblin War-Crown also retains its unresolved
  animation-candidate status.
- Do not begin Lava-Core Colossus, Abyssal Crown-Kraken, or Sun-Crown Griffin
  animation work without a new one-at-a-time approval.

## Structural Validation

The focused Bosses gates pass:

```powershell
node tools/check-boss-directions.mjs
node tools/check-boss-animations.mjs
```

Current focused totals:

- twelve approved direction catalogs plus Rhino and Unicorn candidates;
- 56 checkpoint-exact 48x48 direction frames;
- fourteen checkpoint-exact `48x192` direction sheets;
- ten animation catalogs;
- 800 distinct animated 48x48 frames;
- 110 native full/scoped animation sheets;
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

`death-review/boss-48-drafts/README.md` describes the ten animated entries,
three approved static fallbacks, the Unicorn direction candidate, the Rhino,
Boar Rider, and Goblin animation candidates, and the isolation boundary.

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

1. Refresh the live assembler and review Eclipse Unicorn Sovereign across
   Down/Left/Right/Up at native and enlarged scale with Effects Off.
2. If the user requests a repair, change only the Unicorn direction candidate
   and rerun both boss gates plus `npm.cmd run check`.
3. Do not begin its 80-frame animation corpus before explicit direction
   approval, and do not infer approval from structural tests.

## Expected Worktree State

The normal-work `main` worktree is expected to be clean at the local
crash-safe Bosses checkpoint created from base `origin/main` at `e5ecdea`. That
checkpoint contains the approved Catgirl and Astro Knight direction/animation
work, the repaired quadruped Furious Depraved Rhino direction/animation
candidates, the approved Gunslinger Boar Rider directions plus animation
candidate, and the Eclipse Unicorn Sovereign direction candidate. It is local
until the designer separately authorizes a push.

The parked checkout is expected to remain clean on `wip/19-boss-review` at
`fb4b664`.

The pushed Bosses scope consists of UI and styles, stable facade/catalog
wiring, runtime assets beneath `engine/assets/bosses/`, focused validators and
deterministic generators, and the audited documentation. Treat any other new
dirty path as unexpected until explained by a fresh `git status` and diff.
