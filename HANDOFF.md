# Project Handoff

Date: 2026-07-30

## Purpose

This is the canonical next-chat continuation for the 8-bit Sprite Assembler.
The next chat should continue making review-only bosses from the exact
isolated worktree below. It records the pushed Bosses checkpoint, the
intentional nineteen-boss continuation, the reproducible pack-publish guard,
current validation evidence, and the remaining visual-approval boundary.
Historical plan measurements remain in their plan files and are explicitly
labeled as historical where the public animation contract later expanded.

## Canonical Workspace And Git State

- Worktree:
  `C:\Users\headc\.codex\worktrees\9f24\8-bit sprite assembler`
- Branch: `codex/form-shading`
- HEAD: `64efee04154cf3f654e1894dfbdcd4fc66cdd372`
- The former `origin/codex/form-shading` branch was removed during the
  ecosystem janitor pass. This local branch therefore reports a gone
  upstream, but the exact HEAD is contained in `origin/main`.
- Pushed direction-pilot checkpoint: `08d1ef7`
  (`Checkpoint 48x48 boss direction pilots`)
- Pushed animated-workspace checkpoint: `f15a9cf`
  (`Add animated boss review workspace`)
- Pushed documentation reconciliation: `64efee0`
  (`Refresh pushed boss handoff`)
- Current live state: 1,402 modified/untracked paths, intentionally preserved;
  zero staged files.
- The uncommitted continuation promotes bosses 7-9 to full animation corpora,
  adds bosses 10-19, and contains their deterministic generators,
  review/runtime PNGs, nineteen-boss UI/catalog/check updates, current
  documentation, and the pack-publish guard.
- No commit, push, tag, GitHub release, Windows artifact, or installer was
  created for this continuation.

Before making any claim or edit, rerun:

```powershell
git status --short --branch
git rev-parse HEAD
git branch -r --contains HEAD
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

## New Chat Start Here

The user wants to continue creating new bosses in the same native pixel-art
style and six-animation contract. Chad the Fantastic Guard is boss 19 and the
newest completed technical candidate. Its four-direction pilot, 80 animation
frames, 11 animation sheets, runtime/review assets, catalog wiring, and
deterministic generator are complete. Chad has not received a separate
explicit visual-acceptance statement; the user's latest “cool” referred to the
publish-gate maintenance result, so do not silently mark Chad accepted.

The local preview server was stopped at the end of the prior session. Start it
from this exact worktree when visual work resumes:

```powershell
npm.cmd run dev
```

Then use the already-open `http://127.0.0.1:4173/` assembler tab, select
Bosses, and review at 20x. The next boss concept is not chosen yet; let the
user name boss 20, then extend the established direction, animation,
generator, catalog, validator, UI, review-asset, and documentation pattern
without changing the frozen 13-boss export roster.

## Pack Publish Gate And GitHub Release Contract

`npm run export:bosses:13` is now a publish command, not an unchecked local
ZIP builder. Before it reads or writes pack assets, it:

- refuses a non-empty `git status --porcelain`, including untracked files;
- refreshes the GitHub remote and requires at least one remote branch to
  contain the exact local `HEAD`;
- requires working GitHub CLI authentication; and
- refuses to reuse the immutable `established-boss-pack-13-v1` artifact tag.

After those checks pass, the exporter records the exact `sourceCommit`,
repository, containing remote branches, and SHA-256 content hashes in the pack
manifest. It writes the ZIP plus an external manifest containing the archive
SHA-256, then publishes both files in a GitHub release whose tag is the
artifact id without replacing the application's Latest release. The release
notes repeat the source commit and archive hash.
Failure to upload keeps the command non-zero and identifies any unpublished
local candidate.

The present nineteen-boss continuation is intentionally dirty and therefore
must not be exported or released. Do not bypass the guard. Commit and push a
deliberate reproducible checkpoint first, then run the command from that clean
pushed commit. `npm run check:pack-publish` exercises the dirty-tree,
unpushed-HEAD, existing-tag, and release-command paths without network writes.

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
- exact Idle-frame-1 parity with the approved direction pilot;
- hard alpha and a safe transparent frame border.

The current uncommitted continuation promotes Lava-Core Colossus, Abyssal
Crown-Kraken, and Sun-Crown Griffin from static fallbacks to complete
review-animation candidates, then adds Royal Night Elf Prince as a tenth
direction-and-animation candidate, followed by The Living Pyre as an eleventh
direction-and-animation candidate, Tide Man the Blue as a twelfth, and The
Dryad of Nature as a thirteenth, followed by Fierce Void Dragon as a
fourteenth, the unmounted Dragon Rider of the Fallen as a fifteenth, Ogre
Brute King as a sixteenth, Mecha Deathbot as a seventeenth, Flowered Jungle
Tribe Beast-Man as an eighteenth, and Chad the Fantastic Guard as a
nineteenth. This expands the live catalog to nineteen
while preserving the pushed nine-direction and six-animation checkpoints
above as historical evidence.

The Bosses UI mirrors useful Player review controls without creating a fourth
persisted document kind:

- pilot and direction selection;
- animation selection for all nineteen pilots;
- play/pause, frame stepping, 0.5x/1x/2x speed, and Cycle all;
- native 1x full-sheet, current-animation, and current-direction downloads;

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
- The 2026-07-29 shared Idle pass changed frame 2 for all six of those bosses.
  Their earlier review state still documents the other animation work, but the
  revised Idle loops need fresh explicit visual acceptance.
- The user explicitly authorized Lava-Core Colossus, Abyssal Crown-Kraken, and
  Sun-Crown Griffin together in the 2026-07-29 continuation. Their
  deterministic corpora are current review candidates, not accepted visual
  baselines.
- Royal Night Elf Prince was explicitly authorized as a new tenth boss on
  2026-07-29. Its silver-haired lunar-duelist direction set and complete
  animation corpus were accepted after its Walk gained stronger full-body
  contact dips.
- The Living Pyre was explicitly authorized as an eleventh boss on 2026-07-29.
  Its scorched-human direction set and complete fire animation corpus were
  accepted after the eyes gained the requested redder glow.
- Tide Man the Blue was explicitly authorized as a twelfth boss on 2026-07-29.
  His oceanic humanoid direction set and complete tide animation corpus are
  a current review candidate, not an accepted visual baseline.
- The Dryad of Nature was explicitly authorized as a thirteenth boss on
  2026-07-29. Her branch-crowned forest-guardian direction set and complete
  nature animation corpus were accepted after the first complete live review.
- Fierce Void Dragon was explicitly authorized as a fourteenth boss on
  2026-07-29. Its horned quadruped direction set and complete void animation
  corpus were accepted after the full anatomy rebuild.
- Dragon Rider of the Fallen was explicitly authorized as a fifteenth,
  unmounted boss on 2026-07-29. Its dragon-skull helm, broken lance, separate
  armored legs, torn wing-cloak, and complete spectral-bond animation corpus
  were accepted after the first complete live review.
- Ogre Brute King was explicitly authorized as a sixteenth boss on 2026-07-29.
  Its battered crown, tusks, fur-and-chain mantle, huge free fist, ironwood
  maul, and complete brute animation corpus remain a visual-review candidate,
  not an accepted baseline.
- Mecha Deathbot was explicitly authorized as a seventeenth boss on
  2026-07-29. Its black-steel chassis, red sensor visor, reactor chest, piston
  limbs, shoulder cannon, crusher claw, and complete mechanical animation
  corpus were accepted after the completed live review and the reactor cast
  was refined into outward arcs that preserve the chassis read.
- Flowered Jungle Tribe Beast-Man was explicitly authorized as an eighteenth
  boss on 2026-07-29. Its tawny feline-ape body, flower-and-vine headdress,
  tusked muzzle, leaf-fiber armor, clawed feet, thornwood spear, and complete
  jungle animation corpus were accepted when the next-boss continuation began
  on 2026-07-30.
- Chad the Fantastic Guard was explicitly authorized as a nineteenth boss on
  2026-07-30. His blond pompadour, square jaw, cobalt-and-gold plate, crimson
  cape, radiant star shield, ceremonial halberd, and complete heroic guard
  animation corpus are the newest visual-review candidate, not an accepted
  baseline.
- All nineteen bosses now share the same planted Idle treatment: frame 1 remains
  the exact direction pilot, while frame 2 translates the connected
  body mass down one logical pixel and retains the ground-contact rows as an
  anchor. The result is a visible whole-character bob without palette flashing,
  whole-sprite squash, or a partial rectangular body band. The thirteen newest
  bosses also keep their repaired Walks, where stone feet, tentacle banks,
  griffin paws, duelist boots, charred human legs, tide boots, or root-feet
  and void-dragon claws, fallen-rider sabatons, ogre feet, deathbot pistons, or
  beast-man claws, or Chad's plated parade boots alternate beneath a planted
  upper mass.

## Structural Validation

The focused Bosses gates pass:

```powershell
node tools/check-boss-directions.mjs
node tools/check-boss-animations.mjs
```

Current focused totals:

- nineteen direction catalogs;
- 76 checkpoint-exact 48x48 direction frames;
- nineteen checkpoint-exact `48x192` direction sheets;
- nineteen animation catalogs;
- 1520 distinct animated 48x48 frames;
- 209 native full/scoped animation sheets;
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

`death-review/boss-48-drafts/README.md` now describes the nineteen animated
candidate sets and the unchanged isolation boundary.

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

1. Open this worktree, read the required documents, and verify the live Git
   state without cleaning, stashing, staging, committing, or switching
   checkouts.
2. Start `npm.cmd run dev`; confirm the Bosses workspace still shows all
   nineteen pilots and Chad the Fantastic Guard as the newest candidate.
3. Let the user name boss 20. Build its four-direction 48x48 pilot first,
   visually verify the silhouette/palette, then create the complete
   Idle/Walk/Attack/Cast/Hurt/Death corpus using the shared boss animation
   builder.
4. Keep Idle as the shared planted whole-body one-pixel bob and give Walk
   readable alternating contact dips. Preserve a transparent safety border,
   hard alpha, direction order Down/Left/Right/Up, and distinct action
   silhouettes.
5. Integrate boss 20 into both catalogs, the Bosses UI, deterministic
   generators, runtime/review assets, structural validators, and current
   documentation. The expected new totals are 20 direction catalogs,
   80 direction frames, 20 direction sheets, 20 animation catalogs,
   1,600 distinct animation frames, and 220 native animation sheets.
6. Review Idle, Walk, Attack, and Cast at 20x, then run:

   ```powershell
   node tools/check-boss-directions.mjs
   node tools/check-boss-animations.mjs
   npm.cmd run check
   git diff --check
   ```

7. Do not run `npm run export:bosses:13` from the dirty continuation, do not
   add newer bosses to its frozen roster, and do not commit or push without
   explicit user authorization.

## Expected Worktree State

The worktree is intentionally dirty with 1,402 current status entries and no
staged files. The pushed Bosses scope consists of UI and styles, stable
facade/catalog wiring, runtime assets beneath `engine/assets/bosses/`, focused
validators, deterministic generators, and audited documentation. The
uncommitted continuation adds the remaining thirteen bosses through Chad plus
the guarded GitHub-release pack publisher. Preserve every existing dirty path
and explain any additional file through a fresh `git status` and diff.

The latest completed validation evidence is:

- 19 pilots / 76 direction frames / 19 direction sheets;
- 1,520 distinct animation frames / 209 native animation sheets;
- focused pack-publisher checks passed;
- the real dirty-tree export refusal exited non-zero and left the existing ZIP
  byte-unchanged;
- `npm.cmd run check` passed after the final publisher change;
- planning sync-log entry `sl-0014` records the assembler publish-gate work;
- `git diff --check` passed, and nothing was staged, committed, pushed, tagged,
  or released.
