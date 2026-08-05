# Enemy Expansion Plan

- Status: approved plan; EN-F00 checkpoint `73ad73a` is accepted; EN-E01 and
  EN-E02 are approved, registered, and consumer-integrated. Registration
  checkpoint `7b6e448` composes both slices into the stable ten-family /
  30-variant approved registry, and consumer checkpoint `8ab1837` established
  the 67-family / 232-variant public catalog. On 2026-08-03 the designer
  reopened seven specific family presentations for walk/seam repair. The exact
  repair candidate at checkpoint `6400dd5` was visually approved on 2026-08-03
  and promoted without further pixel changes at checkpoint `8eb0f99`; the
  pre-repair registry remains immutable comparison evidence. The designer
  rejected EN-E03 v1 for using a visual language unlike the approved roster and
  then rejected replacement checkpoint `6104eae` as still far from that style.
  Both Giant/Centaur/Satyr common-only Idle implementations are non-public
  historical evidence. A later reference-first Hill Breaker F1 study was
  visually approved on 2026-08-03; its bounded F2-only continuation was then
  approved as the exact internal two-frame Idle baseline. The next explicitly
  authorized Steppe Hunter F1-only gate was also visually approved across four
  directions and remains non-public. Its separately authorized F2-only
  continuation was approved on its exact boards with `Approved lets keep going.`
  Only Briar Reveler F1 across four directions was authorized next; its exact
  raw and Complete B + Form boards were approved with `looks good.` The designer
  then authorized only Briar Reveler F2 with `lets go next`; its exact F1/F2
  boards were visually approved on 2026-08-04 with `approved`. They are now the
  third exact internal two-frame Idle baseline; no later EN-E03 gate is active
- Recorded: 2026-08-04
- Assessment baseline: clean synchronized `main` at `f5476a2`
- Source: the designer's 2026-08-02 intake of 80 additional enemy proposals

## Purpose

This document turns the 80-proposal intake into bounded production slices for
the 8-bit Sprite Assembler. It fixes the accounting, collision rulings,
production order, review gates, and technical boundaries before any new family
is registered.

The designer explicitly authorized EN-F00 and then separately authorized the
EN-E01 common-baseline Idle gate on 2026-08-02. After approving its exact Idle
artifact, the designer separately authorized full three-variant animation
production plus normal commit/push handling. The designer then accepted the
completed-slice review, public registration, consumer integration, and the live
outline/Form presentation. The designer next authorized the EN-E02 contract
cards and common-only Idle gate. That Idle authorization did **not** include
specialist/elite renderer data, Walk/Attack/Hurt production, public
registration, consumer exposure, separate effect assets, a release, or any
later slice.

The designer approved the exact EN-E02 common-only Idle artifact on 2026-08-02,
then separately authorized full three-variant standard-animation production.
That production authorization included the ten specialist/elite renderer payloads,
Walk/Attack/Hurt, and standard Enemy Cast/Death aliases. It does **not** include
public registration, consumer exposure, separate effect assets, a release, or
any later slice.

After reviewing the exact completed-slice overview and the outline/Form
presentation, the designer approved the EN-E02 slice and explicitly authorized
the next bounded registration gate on 2026-08-02. That registration does **not**
authorize editor selectors, randomization, packs, exports, outline/Form consumer
routing, separate effects, release, EN-E03, or any other later slice.

The designer then separately authorized the bounded EN-E02 consumer step on
2026-08-02. That scope includes the existing generic editor, persistence,
randomizer, kit, pack, thumbnail, export, outline, and Form paths for the five
approved families / 15 variants. It does **not** authorize new effect assets, a
release, EN-E03, or a later slice. Checkpoint `8ab1837` implements that bounded
scope; exhaustive technical validation and the live Plague Doctor / Field
Chirurgeon Complete B + Form smoke passed and the designer continued. On
2026-08-03 the designer reported narrow defects in Catfolk, Desert Raider,
Fallen Knight, Fanatic Monk, Goatfolk, Necromancer, and Witch. That report
authorized only the bounded repair candidate described below. The designer then
accepted the exact live candidate with “nice thats better” and authorized the
next documented step. That continuation authorizes EN-E03 contract cards plus
common-only Idle, not later motion, variants, registration, effects, or release.
The first bounded EN-E03 implementation was rejected visually. Its v2
replacement is complete and technically validated, but the designer also
rejected the exact rebuilt artifacts. A later reference-first Hill Breaker F1
calibration and its F2-only continuation were separately authorized and
visually approved. Steppe Hunter F1/F2 and Briar Reveler F1/F2 were then
separately authorized and visually approved as exact internal two-frame Idle
baselines. No later EN-E03 implementation gate is active.

## Intake Assessment

The live Enemy catalog at the assessment baseline contains 57 families and 202
variants. The 80 submitted proposals resolve to:

- 75 new standard 24x24 Enemy families;
- one upgrade to the existing `zombie/ghoul` material;
- one consolidation of Haunted Armor and Animated Armor into a single
  `animated-armor` family;
- three isolated 48x48 Boss candidates: Hydra, Chimera, and Roc; and
- 225 new standard Enemy variants at the default three-variant budget.

If every standard slice is approved and completed, the projected Enemy catalog
is approximately 132 families and 427 variants. The three Boss candidates are
not included in those Enemy totals.

The supplied intake ended abruptly after `Families that may wor...`, so any
missing closing qualifications must be recovered from the designer before they
are treated as requirements. The proposal roster itself is fully accounted for
below.

## Status Vocabulary

- `implementation-candidate`: recommended next work after explicit approval;
  it is not authorization by itself.
- `acceptance-candidate`: the bounded implementation is complete and
  technically validated, but explicit designer acceptance is still pending.
- `rejected`: retained for exact technical/history evidence but explicitly not
  accepted as a visual baseline or public content.
- `paused`: no implementation candidate is active; a newly bounded gate needs
  explicit authorization before work resumes.
- `queued`: sequenced behind the current active lane or next authorized gate.
- `architecture-gated`: requires a contract decision before sprite production.
- `boss-review-blocked`: cannot enter the isolated Boss lane while its current
  review call remains unresolved, unless the designer explicitly reprioritizes.
- `complete`: art, animation, validation, and visual approval are all done.

EN-E01 and EN-E02 remain complete through their accepted consumer presentations.
Their isolated seven-family walk/seam correction is also approved and promoted;
the pre-repair registry remains available only as immutable comparison evidence.
EN-E03 v1 and v2 common-only Idle are rejected historical evidence. The EN-E03
lane now has three visually approved internal two-frame Idle baselines across
four directions: Hill Breaker, Steppe Hunter, and Briar Reveler. Every later
pose, variant, animation, consumer, effect, and release step remains gated; a
new explicitly bounded designer authorization is required before continuation.

## Non-Negotiable Production Contract

Standard Enemy additions must preserve the current public actor contract:

- logical cell: 24x24;
- direction rows: Down, Left, Right, Up;
- animation columns: Idle x2, Walk x4, Attack x4, Cast x4, Hurt x2, Death x4;
- assembled sheet: 20 columns / `480x96` at native 1x;
- Enemy Cast aliases the matching Attack frame;
- Enemy Death aliases Hurt frames 1, 2, 2, 2;
- Effects start Off; projectiles, telegraphs, trails, summoning circles, and
  similar effects are separate future assets and are not baked into actors;
- no family enters the runtime catalog before its baseline four-direction Idle
  silhouette is visually approved; and
- no slice may introduce private column counts or a family-specific sheet
  version.

Hydra, Chimera, and Roc are 48x48 Boss candidates. They stay outside Enemy
mode, Enemy randomization, Enemy packs, Enemy persistence, and the standard
24x24 contract.

## Collision And Identity Rulings

These rulings prevent accidental duplicates while preserving useful gameplay
identities:

| Proposal | Ruling |
| --- | --- |
| Ghoul | Upgrade the existing `zombie/ghoul` presentation; do not register a second Ghoul family. |
| Haunted Armor + Animated Armor | Merge into one `animated-armor` family; use haunted and constructed identities as variants. |
| Vampire | Add a humanoid Vampire family while retaining the existing `bat/vampire` variant. |
| Rhino | Keep as an ordinary quadruped Enemy only if its silhouette and scale remain distinct from the approved Furious Depraved Rhino Boss. |
| Birdfolk + Harpy | Birdfolk is an upright avian people chassis; Harpy remains the taloned winged-monster identity. |
| Witch + Hag | Witch uses an equipped humanoid caster read; Hag uses a feral fey/monster read. |
| Pirate + Desert Raider + Bandit | Reuse humanoid construction where useful, but keep all three as visually distinct family identities. |
| Changeling + Doppelganger | Keep separate gameplay identities while sharing morph-language research; true copying belongs to runtime gameplay, not the sprite sheet. |
| Dryad + Treant | Dryad is humanoid/fey scale; Treant remains the large tree-creature identity. |
| Nymph + Elemental | Nymph is a character silhouette; Elemental remains an embodied mass/material silhouette. |

## Standard Slice Workflow

Every standard Enemy slice follows the same stop-and-review loop:

1. Write one contract card per family: stable ID, intended scale, locomotion,
   attack tell, three variant briefs, and any external effects or mechanics.
2. Build only the baseline variant first.
3. Produce a four-direction Idle review PNG at a readable review scale while
   retaining native-pixel inspection.
4. Stop for explicit visual approval.
5. After approval, add Walk, Attack, and Hurt motion under the existing contract;
   Cast and Death remain the standard Enemy aliases.
6. Add no more than three initial variants: common, specialist, and elite.
7. Generate the focused slice review sheet and inspect every direction and
   required animation.
8. Run focused checks, the full repository check, and deterministic export
   comparison.
9. Reach a clean, documented checkpoint before starting another slice.

The designer should never need to review all 20 raw columns for every variant.
Review surfaces should foreground silhouette, four-direction consistency,
attack readability, and variant distinction.

## Foundation Slice

### EN-F00 - Expansion renderer foundation

- Status: `approved`; accepted checkpoint `73ad73a` retains passing focused and
  full structural gates
- Contains no new family art

Before adding 75 families, introduce the smallest data-driven expansion facade
that can register a family ID, renderer/chassis key, variant briefs, and review
metadata without rewriting the 57-family legacy catalog. Avoid growing another
75-family chain of family-specific conditionals.

Required outcomes:

- legacy 202 Enemy sheets remain byte- or pixel-equivalent;
- unfinished families are not pre-registered in public selectors or packs;
- review generation can target one family or one slice deterministically;
- the checker rejects duplicate IDs, absent renderers, empty frames,
  out-of-bounds drawing, non-binary alpha, wrong direction order, and dimensions
  other than `480x96` for completed standard Enemy sheets; and
- the expansion ledger can report planned, implemented, and approved states
  without presenting plans as shipped content.

EN-F00 must pass independently before EN-E01 begins.

Implemented evidence:

- `engine/enemy-expansion.js` owns the immutable profile, 22-slice/80-proposal
  ledger, lifecycle states, renderer/chassis registration contract, family and
  variant normalization, deterministic family/slice Idle review plans, renderer
  dispatch facade, and completed-sheet validator;
- the isolated EN-F00 foundation registry contains zero families; the stable
  public composition registry now contains approved EN-E01 plus EN-E02, while
  the unchanged `ENEMIES` array remains the locked legacy catalog and immutable
  `PUBLIC_ENEMIES` appends only the ten separately consumer-authorized expansion
  families;
- planned families cannot be registered; implemented families remain internal;
  only explicitly approved registrations can enter the registry's public view;
- `npm.cmd run check:enemy-expansion` rejects duplicate/colliding ids, missing
  renderers, planned-family pre-registration, empty frames, out-of-bounds
  writes, non-binary alpha, wrong direction/frame order, and dimensions other
  than `480x96`;
- all 57 legacy families / 202 sheets / 16,160 frames retain SHA-256 pixel
  digest `190a0f32b961b23fe0207c5a53fc005f9761666d27b15b98c0030325a10bef0c`;
  and
- the complete existing `npm.cmd run check` matrix passes unchanged.

## Wave 1 - Highest Reuse And Fastest Learning

Wave 1 establishes the shared humanoid, large-body, serpentine, and undead
chassis needed by many later proposals. Complete only one slice at a time.

### EN-E01 - Humanoid threat pilot

- Status: `approved-consumer-integrated`; four-direction common-baseline Idle
  and the complete 15-variant slice are visually approved, registered through
  the stable public expansion boundary at `b43ed6a`, and integrated into public
  consumers at `e0be273`
- Families: Witch, Fallen Knight, Pirate, Necromancer, Alchemist
- Priority-first: Witch, Fallen Knight, Pirate

Shared leverage: humanoid anatomy, held-item anchors, robes/coats, hats/helms,
one-handed weapons, thrown-object poses, and readable off-hand silhouettes.

Initial variant briefs:

| Family | Common | Specialist | Elite |
| --- | --- | --- | --- |
| Witch | Hexer | Familiar-Keeper | Cauldron Brewer |
| Fallen Knight | Shieldbearer | Banner Lancer | Blackguard |
| Pirate | Deckhand | Gunner | Bomb-Bosun |
| Necromancer | Bone Caller | Grave Binder | Ossuary Master |
| Alchemist | Flask Thrower | Smoke Brewer | Mutagenist |

Attack tells must remain readable without baked muzzle flashes, bombs, potion
splashes, familiars, skeletons, or spell effects. Those are separate effect or
child-asset contracts.

Approved implementation and registration evidence:

- five immutable contract cards record stable ID, 24x24 scale, locomotion,
  attack tell, three variant briefs, and external effect/mechanic boundaries;
- all 15 common/specialist/elite briefs are implemented through the private
  `humanoid-threat-v1` renderer on `humanoid-v1`, with identity overlays
  selected from renderer data rather than family-ID branches;
- every variant supplies Idle x2, Walk x4, Attack x4, Hurt x2, pixel-identical
  Enemy Cast-to-Attack aliases, and Death-to-Hurt 1, 2, 2, 2 aliases;
- implementation checkpoint `230a9a3` freezes five internal families / 15
  reviewed variants before registration;
- completed-slice approval records the exact overview and review-manifest
  SHA-256 values plus the reviewed implementation commit;
- registration checkpoint `b43ed6a` exposes five approved/public families / 15
  variants through `ENEMY_EXPANSION_REGISTRY`, while the legacy `ENEMIES`
  catalog remains unchanged;
- `npm.cmd run check:enemy-expansion-en-e01` validates 40 deterministic Idle
  frames with hard alpha, one-cell margins, no out-of-bounds writes, distinct
  silhouettes, correct direction/frame ordering, and the locked digest;
- `npm.cmd run review:enemy-expansion-en-e01` generates the exact enlarged and
  native-size review PNG. The designer approved exact PNG SHA-256
  `2d710ab54a845c4805d428c428cfa9e1cda09f4adee886c5deafbafee831b7ee`
  and 40-frame digest
  `339c5ff809d3b17aec20b3ec953c8217470cde026fc743cde0cd3854ed5c3323`
  on 2026-08-02;
- `npm.cmd run check:enemy-expansion-en-e01-full` exhausts 15 complete
  `480x96` sheets / 1,200 frames, hard alpha, strict margins, deterministic
  motion, direction/variant distinction, aliases, and zero public exposure;
- the full candidate frame digest is
  `addcf8055a80a0a6266be0eff8cd6b8235092c6ba366bc9c020bd5feb90ae173`;
  and
- `npm.cmd run review:enemy-expansion-en-e01-full` generates the all-variant
  overview, five all-motion family boards, 15 native sheets, and review JSON.
  The overview SHA-256 is
  `0b38f2737b5215d37a08e0ae3f7e25f82e88bb17a97641e33b0ee9ef9c0e8fb7`.
  Internal native/4x inspection accepted the completed slice at that checkpoint;
  later live review reopened Witch, Fallen Knight, and Necromancer for the
  now-approved bounded repair without rewriting this historical artifact; and
- `npm.cmd run check:enemy-expansion-en-e01-registration` proves five approved
  families / 15 public variants, 15 complete sheets, stable-facade routing,
  the current three-approved/zero-implemented/nineteen-planned ledger state,
  unchanged 57-family / 202-variant legacy catalog, and exact candidate/public
  parity across all 1,200 frames.
- at checkpoint `e0be273`, the EN-E01 consumer gate proved the then-current
  immutable 62-family / 217-variant public composition, unchanged legacy
  pixels, generic editor/persistence/randomizer/kit/pack/thumbnail/export
  routing, 1,200-frame adapter parity, and all 15 native `480x96` sheet exports.
  Its authorized presentation extension exhausted 3,600 None/B/C outline cases
  and 3,600 Form-with-outline cases, resolved all 90 EN-E01 renderer palette
  colors, recorded 74,029 source-owned shade changes, and preserved 69,090
  protected pixels plus all outline geometry. The designer accepted the exact
  live Witch/Hexer Complete B + Form presentation on 2026-08-02 and then
  authorized continuation into the next contract-first step.

### EN-E02 - Humanoid culture variants

- Status: `approved-consumer-integrated`; common-only Idle and exact
  completed-slice artifacts are visually approved, bounded registration
  completed at `7b6e448`, and consumer integration is implemented at `8ab1837`.
  The later seven-family correction spanning EN-E01/EN-E02 is visually approved
  and promoted at the stable/public boundary
- Families: Plague Doctor, Desert Raider, Fanatic Monk, Catfolk, Goatfolk

Shared leverage: EN-E01 humanoid poses plus masks, wrapped cloth, martial robes,
ears, tails, horns, and altered leg/foot silhouettes. This slice tests how far
the humanoid chassis can flex before species anatomy needs its own renderer.

Authorized variant briefs:

| Family | Common baseline | Specialist | Elite |
| --- | --- | --- | --- |
| Plague Doctor | Field Chirurgeon | Leech Warden | Pestilent Magister |
| Desert Raider | Dune Reaver | Sandbow Stalker | Sunscar Captain |
| Fanatic Monk | Ash Disciple | Chain Penitent | Bell Abbot |
| Catfolk | Alley Prowler | Moonclaw Duelist | Pride Champion |
| Goatfolk | Crag Skirmisher | Horn-Seer | Ramguard Chieftain |

Approved Idle evidence:

- `engine/enemy-expansion-en-e02.js` freezes five contract cards, all 15 briefs,
  and only the five common baseline renderer payloads;
- the internal registry reuses `humanoid-threat-v1` / `humanoid-v1` and remains
  implemented rather than approved, with five internal families and zero
  approved/public families in that frozen snapshot;
- five data-selected identity treatments provide the Plague Doctor beak/hood,
  Desert Raider wraps, Fanatic Monk beads/plain quarterstaff, Catfolk
  ears/tail/paws, and Goatfolk horns/ears/hooves;
- effects and mechanics remain external: miasma/vials, sand/dust, sacred or
  bell waves, pounce/claw trails, and charge/seer effects are not baked in;
- `npm.cmd run check:enemy-expansion-en-e02` validates five immutable cards,
  five common-only variants, 40 deterministic Idle frames, hard alpha,
  one-cell margins, distinct front/profile/rear silhouettes, mirrored side
  occupancy, and zero public-catalog exposure;
- candidate frame digest:
  `00d71d7e8f1904c275bfe84ec6cec746fb314fab4d27ce182d72e286a846d02b`;
- `npm.cmd run review:enemy-expansion-en-e02` generates the ignored exact
  `1528x1340` labeled/native review surface at
  `enemy-expansion-review/en-e02/en-e02-idle-review.png`, SHA-256
  `c224258139c7c810c7a122ea9e95061f3dd1697864913765fe9d11e09f4eca50`;
  and
- internal visual inspection replaced the Ash Disciple's inherited crystal
  focus with a plain wooden quarterstaff before presenting the candidate.

Full private candidate evidence:

- all ten specialist/elite renderer payloads are implemented alongside the five
  exact approved common baselines in a separate immutable candidate registry;
- all 15 variants supply Idle x2, Walk x4, Attack x4, Hurt x2, pixel-identical
  Cast-to-Attack aliases, and Death-to-Hurt 1, 2, 2, 2 aliases;
- `npm.cmd run check:enemy-expansion-en-e02-full` validates 15 complete
  `480x96` sheets / 1,200 deterministic frames, hard alpha, one-cell margins,
  three-direction readability, within-family common/specialist/elite silhouette
  distinction, zero approved/public families in the candidate snapshot, the
  unchanged approved Idle digest, 2,400
  private Complete B/Selective C cases, and 3,600 private Form-with-outline cases;
- full candidate frame digest:
  `f4667a1ccefb3026c6df3604e114393fdaae619dab0c68bec969203986cb35bf`;
- `npm.cmd run review:enemy-expansion-en-e02-full` generates the ignored exact
  `1148x1984` overview, `1124x1992` Complete B/Form presentation board, five
  family motion boards, 15 native sheets, and review manifest under
  `enemy-expansion-review/en-e02-full/`; overview PNG SHA-256:
  `21f3175600377eaf75206f9fcb65856731da28eafb6715687821f782f41da6a8`,
  `1124x1992` Complete B/Form presentation PNG SHA-256:
  `211e9ace3eb965f243724249c73927567568e2f22f181f5448ba398ddab4a094`,
  review JSON SHA-256:
  `0a135fbed3eeeaf69400a3700d113af67a0c2a75043f95ab2a392711cd6b0afa`;
- internal visual inspection added Attack-only staff motion without changing the
  approved Ash Disciple Idle pixels and replaced Sandbow Stalker's stock released
  arrow with an actor-owned bow/string treatment so projectiles remain external.

Completed-slice approval and registration evidence:

- `EN_E02_COMPLETED_SLICE_GATE` locks reviewed implementation commit
  `b2c1283c33dbfd6b2c307fc4d2288877a149c9df`, the exact overview,
  Complete B/Form presentation, review manifest, approved Idle digest, and full
  1,200-frame digest;
- `EN_E02_PUBLIC_REGISTRY` contains five approved families / 15 variants while
  the separate candidate registry remains immutable `implemented` evidence;
- cumulative `ENEMY_EXPANSION_REGISTRY` composition is ten approved families /
  30 variants across EN-E01 and EN-E02;
- at registration checkpoint `7b6e448`, `ENEMY_EXPANSION_CONSUMER_REGISTRY`
  remained exactly EN-E01 and `PUBLIC_ENEMIES` remained 62 families / 217
  variants; that is historical registration evidence rather than the current
  post-authorization consumer boundary; and
- `npm.cmd run check:enemy-expansion-en-e02-registration` verifies the exact
  artifact hashes, three-approved/zero-implemented/nineteen-planned ledger,
  all 15 registered sheets, and candidate/registered parity across 1,200 frames.
- checkpoint `be44af7` makes ignored-artifact verification clean-clone safe by
  default while
  `check:enemy-expansion-en-e02-registration:artifacts` strictly requires and
  re-hashes all three local review files.

Authorized consumer-integration evidence:

- immutable `EN_E02_CONSUMER_INTEGRATION_GATE` records the designer's
  2026-08-02 authorization, registration/artifact checkpoints, exact generic
  consumer scope, exclusions, and next acceptance gate;
- checkpoint `8ab1837` makes `ENEMY_EXPANSION_CONSUMER_REGISTRY` reuse the exact
  cumulative approved registry, producing 67 public families / 232 variants
  without changing the locked 57/202 legacy catalog;
- `npm.cmd run check:enemy-expansion-en-e02-consumers` verifies selectors,
  persistence, randomization, combat defaults, Complete Kits, Wildshot packs,
  thumbnails, all export scopes, all 2,400 dispatcher frames, all 30 native
  sheets, 7,200 None/B/C outline cases, 7,200 Form/outline cases, all 180
  published palette colors, 174,917 source-owned Form changes, and 146,687
  protected pixels; and
- live browser smoke exposes all 67 selector families and renders Plague Doctor
  / Field Chirurgeon with Complete B + Form, the expected export filename, and
  no console errors.

Isolated repair-candidate evidence (2026-08-03):

- implementation checkpoint `6400dd5` (`Create enemy walk and seam repair
  candidate`) contains the bounded candidate and its regression harness;
- approval-promotion checkpoint `8eb0f99` routes that exact reviewed object
  through both stable and consumer boundaries;
- the internal `ENEMY_EXPANSION_PRE_REPAIR_REGISTRY` retains the exact prior
  EN-E01/EN-E02 pixels and both locked 1,200-frame digests;
- `ENEMY_EXPANSION_REPAIR_CANDIDATE_REGISTRY` changes exactly 18 renderer-data
  records across the seven reported families while leaving Alchemist, Pirate,
  and Plague Doctor pixel-identical across all 720 unaffected frames;
- Catfolk and Goatfolk receive four-phase paw/hoof contacts; Witch,
  Necromancer, Ash Disciple, and Bell Abbot receive opt-in robe-foot strides;
- Catfolk's white pseudo-transparent mouth band is replaced by a fur muzzle,
  and the reported Desert Raider, Shieldbearer, and Goatfolk checkerboard seams
  are filled through data-selected repair overlays;
- `npm.cmd run check:enemy-expansion-repairs` validates 1,680 affected-family
  frames, binary alpha, one-cell margins, zero clipping, deterministic output,
  alternating stride extremes, and the exact reported seam coordinates;
- repair review evidence lives under
  `enemy-expansion-review/repair-candidate/`, with EN-E01/EN-E02 repair digests
  `48e2f05ec345f5680305019827b2ad6d7dff1bc506b109ab101b92975ef96916`
  and `50310c36ca165cf7ccd941183a5e087cec2fcb5140068e99ab7e24633d6096d5`;
  and
- the live assembler exercises all four Walk frames at 20x with Complete B
  outline and Form shading for every reported family; and
- the designer accepted that exact live candidate with “nice thats better” and
  authorized continuation. The exact reviewed object is now both the stable and
  consumer registry; the pre-repair registry remains internal.

The repair gate is complete. Its continuation authorization produced the EN-E03
contract cards and two common-only Idle attempts below; both were visually
rejected. The later smaller reference-calibration gate was explicitly authorized
and its Hill Breaker first pose and bounded F2 continuation were visually
approved. The later Steppe Hunter F1 calibration was also visually approved.
The designer then explicitly authorized its F2-only continuation and approved
the exact resulting F1/F2 boards with `Approved lets keep going.` That approval
authorized only Briar Reveler F1 across four directions. The designer approved
that exact F1 raw and Complete B + Form pair with `looks good.`, then authorized
only its F2 continuation with `lets go next`. The designer approved the exact
resulting F1/F2 boards on 2026-08-04 with `approved`. Do not implement
specialist/elite variants, Walk/Attack/Hurt, registration, consumer routing,
separate effects, release work, or any later EN-E03 step without another
authorization.

### EN-E03 - Large and hybrid walkers

- Status: v1/v2 `rejected`; Hill Breaker, Steppe Hunter, and Briar Reveler
  two-frame Idle baselines `approved` and internal; all later production gated
- Families: Giant, Centaur, Satyr
- Active gate: none; a new explicitly bounded designer authorization is required

Shared leverage: large-body scale studies, long strides, hoof contacts, and
front/back torso-to-leg alignment. Centaur is the four-legged hybrid pilot;
approval must prove readable front, back, and side joins before animation.

Initial variant briefs:

| Family | Common | Specialist | Elite |
| --- | --- | --- | --- |
| Giant | Hill Breaker | Boulder Hurler | Storm-Clan Jarl |
| Centaur | Steppe Hunter | Sun Lancer | Banner Khan |
| Satyr | Briar Reveler | Reed Charmer | Wildwood Hornlord |

Current common-only Idle evidence:

- v1 implementation checkpoint `50ad516bdf338842e47ae9c22cd7cd293adef498`
  is rejected historical evidence. The designer found that its large boxed
  shapes, baked silhouette ink, proportions, and directional construction did
  not look like the approved Enemy roster;
- v2 implementation checkpoint `6104eaedce62c4514cdd5061bd58c8c79eeb0341`
  (`Rebuild EN-E03 Idle candidate in roster style`) freezes the second rejected
  implementation. The designer found the resulting boards still far from the
  established Enemy style; its technical improvements did not close the visual
  gap;
- three immutable contract cards define 24x24 scale, distinct large-bipedal /
  hybrid-quadrupedal / digitigrade locomotion, attack tells, variant briefs,
  and external effect/mechanic boundaries;
- one data-driven `large-hybrid-v2` renderer implements only Hill Breaker,
  Steppe Hunter, and Briar Reveler through separate Giant, Centaur, and Satyr
  archetype data. It uses palette-first source clusters and leaves the exterior
  contour to Complete B instead of baking an ink cage into raw pixels; non-Idle
  rendering remains rejected at this gate;
- the Centaur uses a true four-hoof body with readable torso-to-horse joins in
  front, rear, and exact-mirrored side views; Giant remains a near-full-cell
  heavy biped; Satyr keeps horns, tail, hocks, and split hooves distinct;
- `npm.cmd run check:enemy-expansion-en-e03` validates all 24 Idle frames,
  deterministic pixels, binary alpha, one-cell margins, zero clipping, exact
  side mirroring, one connected silhouette per frame, direction/family
  distinction, 2,916 Complete B outline pixels, and 2,579 Form-shaded pixels;
- raw artifact `enemy-expansion-review/en-e03/en-e03-idle-review.png` is
  `1528x880`, SHA-256
  `059f7c4945cffacf4e53e2d9435566479adf08ec754ed8f0faca520958908aa2`;
- assembled Complete B + Form artifact
  `enemy-expansion-review/en-e03/en-e03-idle-complete-b-form-review.png` is
  `1528x880`, SHA-256
  `2835b044868cd948fbb7327675f5821adfe499507a08d0e8350f83cff5e2ab89`;
  and
- the 24-frame candidate digest is
  `8339d3d4a2380f8e9d9bf6ecb3fa1a5f0faddafc0bf6ce43c3ce12c515a1a059`.

Those exact rebuilt EN-E03 Idle artifacts are rejected. Preserve v1 and v2 only
as historical/diagnostic evidence; neither is an approved seed for later work.
The separately authorized reference-first study rebuilt Hill Breaker's first
Idle pose on the approved humanoid roster chassis and compared all four
directions raw and with Complete B + Form against exact accepted EN-E01/EN-E02
references. The designer approved those exact boards on 2026-08-03 with
`much better lets move onm`. Their raw SHA-256 is
`4dae138234132d6249f36783dcb753716e6556791051c60c7ef92d6e73956e95`,
assembled SHA-256 is
`70fce189859c2c86d102b2db9f3b3ea5bac47b9f5f32c172adc70a612eafa605`,
and four-frame digest is
`019ec9d11daac3d626d1c33693dc707ba98c6ade1c7647f82a5dc5a5a7fa2602`.

The bounded F2 gate added only Hill Breaker F2 across the same directions. The
designer approved those exact F1/F2 boards on 2026-08-03 with `approved`. Their
raw SHA-256 is
`21cb2a314b6fa5866ea4d708570513506c69c02befca739338df1b908fefc686`,
assembled SHA-256 is
`2bcad3208b2571764f1938f0be52383d1cb4128a191b74ed7d669fd8e8c48faf`,
and eight-frame digest is
`2ae3904669508afbabed0742d72d4d334f37cdee360ba4f4d1a11767d22ee5ab`.
That exact two-frame Hill Breaker Idle baseline is approved and remains
internal. The separately authorized reference-first Steppe Hunter gate contains
only F1 across Down, Left, Right, and Up. The designer approved those exact raw
and Complete B + Form boards on 2026-08-03 with `Approved`. Their raw SHA-256 is
`f4c462ffd9242684d7335c28c238db0fb59cecd5e168f069da03cc6f40753480`,
its Complete B + Form SHA-256 is
`dc7ccd766c736dcb1581b817f950b6be8541bacb26411c2281a42535bbf82f52`,
and its four-frame digest is
`53ea78549da26eccc2b8292672f693384d8551660d68bdd5e3827bb1d21f55cb`.
That exact Steppe Hunter F1 seed is approved and remains internal. The designer
then authorized only F2 across those same four directions. The internal registry
delegates F1 to the frozen calibration renderer and adds a planted-hoof F2 with
a one-pixel rider/spear dip plus direction-aware tail motion. The focused gate
validates eight connected hybrid silhouettes, four separated hoof contacts in
every frame, exact preservation of the four approved F1 records and bottom three
contact rows, exact mirrored profiles, hard alpha, one-cell margins, 1,016
Complete B additions, 1,068 Form-shaded source pixels, and zero public families.
The raw F1/F2 board SHA-256 is
`256b9be67407ada1caad58b6dc68d426ecbeb73b5f2032f13187e337d900c235`,
its Complete B + Form SHA-256 is
`e98d2e7d570c8777238cb187caaac15caff9c9000af0b322c651623e8e0ff7dd`,
and its eight-frame digest is
`3c88471b25fc27397a0a11d6495cd27c641a6715ff33429f5d0d2c81f184ae49`.
The designer approved those exact boards on 2026-08-03 with
`Approved lets keep going.` They are now the accepted internal Steppe Hunter
two-frame Idle baseline.

That approval authorized only a reference-first Briar Reveler F1 study across
Down, Left, Right, and Up. Its isolated one-family registry reuses the approved
lean humanoid chassis and Goatfolk horn/ear grammar, replaces the lower stance
with digitigrade legs and four split-hoof contact tips, and adds a
direction-aware tail plus crooked staff. The focused gate validates four
connected hard-alpha horned silhouettes, exact mirrored profiles, one-cell
margins, four distinct directions, 559 Complete B additions, 535 Form-shaded
source pixels, and zero public families. The raw F1 board SHA-256 is
`1272f52186c4f0df8666e845392eec6338d31aa161222d2064ed27625acc4405`,
its Complete B + Form SHA-256 is
`aa516c5d4e53b7d89b8dc2a935f7d41c8e36260950b771b8f094093e4fd9a5a1`,
and its four-frame digest is
`b8335de4e6794e84de0be10a3c437fab024db8310262e1c1deb484bd6b9add6b`.
The designer approved those exact boards on 2026-08-03 with `looks good.` This
exact F1 seed is visually approved and remains internal. The designer then
authorized only F2 across the same directions with `lets go next`. The new
internal registry delegates F1 to the frozen calibration renderer and adds an
F2 idle settle with inward hock motion, a direction-aware tail flick, and a
one-pixel staff dip. The focused gate validates eight connected hard-alpha
horned digitigrade silhouettes, exact preservation of all four approved F1
frames, four split-hoof contact tips in every frame, exact mirrored profiles,
one-cell margins, 356 changed F2 alpha pixels, 1,026 Complete B additions, 1,072
Form-shaded source pixels, and zero public families. The raw F1/F2 board SHA-256
is `8d3a960d62683e19694e28572f15117314fde9ccb7dd898ea9065d64da058204`,
its Complete B + Form SHA-256 is
`4257e63a25a23631ff861b3752e03da0897a6ceaf5ef8cef6efccbd575f6b51e`,
and its eight-frame digest is
`0d5599dcd452351903e5d56289596d2e75f59caf5c0b7a5525c7e375c39b36fa`.
The designer approved those exact F1/F2 boards on 2026-08-04 with `approved`.
They are now the accepted internal Briar Reveler two-frame Idle baseline. Do
not implement specialist/elite variants, Walk/Attack/Hurt, Cast/Death aliases,
registration, consumer routing, effects, release, or any later EN-E03 step
without another explicitly bounded authorization.

### EN-E04 - Serpentine and aquatic peoples

- Status: `queued`
- Families: Naga, Merfolk, Birdfolk
- Priority-first: Naga

Shared leverage: non-human lower bodies and upright equipment anchors. Naga and
Merfolk must not fake ordinary feet in side views. Birdfolk must remain an
upright avian person rather than collapse into the existing Harpy identity.

### EN-E05 - Undead humanoids

- Status: `queued`
- Families/proposal work: existing Ghoul upgrade, Mummy, Vampire, Revenant, Lich
- Priority-first: Ghoul upgrade, Mummy, Vampire

Shared leverage: broken posture, wrappings, capes, exposed bone, floating hems,
and necrotic palette families. The Ghoul change is an explicit upgrade to the
existing material and requires a before/after regression review; it must not
silently alter unrelated Zombie variants.

Wave 1 exit gate: EN-F00 and EN-E01 through EN-E05 are individually approved,
all existing legacy families still validate, and the humanoid renderer has not
become a catch-all that erases species silhouettes.

## Wave 2 - Fey, Spectral, Possessed, And Constructed

Wave 2 exercises transparency, hovering, asymmetry, detached components, and
stateful identities while effects remain outside the base actor.

### EN-E06 - Fey and folklore

- Status: `queued`
- Families: Fairy, Hag, Dryad, Redcap, Nymph
- Priority-first: Fairy, Hag

Shared leverage: small bodies, wings, plant anatomy, exaggerated hats, and
hovering poses. Fairy wings are body parts; glow and particle trails are effects.
Dryad must remain humanoid/fey scale rather than overlap Treant.

### EN-E07 - Shapeshifters and apparitions

- Status: `queued`
- Families: Living Shadow, Doppelganger, Will-o'-Wisp, Changeling, Kelpie
- Priority-first: Living Shadow, Doppelganger

Shared leverage: controlled negative space, unstable edges, silhouette swaps,
and spectral motion. Doppelganger and Changeling receive authored default forms;
copying another actor is a runtime/gameplay feature and is not promised by the
assembler.

### EN-E08 - Possessed equipment

- Status: `architecture-gated`
- Families/proposals: Haunted Armor + Animated Armor merged as
  `animated-armor`, Headless Rider, Possessed Mask, Living Weapon
- Priority-first: `animated-armor`

Shared leverage: hollow silhouettes, floating components, rider/mount joins,
and equipment acting as a body. Before art begins, decide whether the head,
mount, mask, or weapon is baked into one actor or exported as a deterministic
child/state asset. Do not solve that decision with incidental per-frame offsets.

### EN-E09 - Arcane constructs

- Status: `queued`
- Families: Clockwork Automaton, Living Book, Runic Idol, Crystal Beast
- Priority-first: Clockwork Automaton, Living Book

Shared leverage: rigid rotations, hinges, page motion, rune-bearing surfaces,
and faceted masses. Gear sparks, loose pages, rune flares, and crystal volleys
remain effects rather than permanent body pixels.

Wave 2 exit gate: transparency and detached-part policy are documented, each
family remains legible with Effects Off, and EN-E08's child/state contract is
settled before its animation phase.

## Wave 3 - Beasts, Avians, And Mythic Scale

Wave 3 builds quadruped and bird motion deliberately before proposing any new
Boss animation.

### EN-E10 - Heavy quadrupeds

- Status: `queued`
- Families: Hyena, Ram, Stag, Mammoth, Rhino
- Priority-first: Rhino only after its Boss distinction is approved

Shared leverage: four-foot contact timing, side-view body length, horn/tusk
anchors, and weight shifts. Front and back views must still show four-footed
stance. Ordinary Rhino must not read as a reduced copy of the Furious Depraved
Rhino Boss.

### EN-E11 - Birds

- Status: `queued`
- Families: Peacock, Cockatrice, Raven, Owl, Phoenix
- Priority-first: Peacock

Shared leverage: folded-wing bodies, wing attacks, tail fans, beaks, and talon
contacts. Phoenix egg/ash resurrection art, if desired, requires a separate
state-asset decision; fire and embers remain effects.

### EN-E12 - Mythic composite creatures

- Status: `queued`
- Families: Basilisk, Manticore, Sphinx
- Priority-first: Basilisk

Shared leverage: composite anatomy and long-body directional readability. This
slice is the final standard-size proof before the isolated 48x48 Boss pilots.
If a family cannot remain readable at 24x24, stop and request a scale ruling
rather than quietly moving it into the Boss lane.

### EN-B01 - Hydra direction pilot

- Status: `boss-review-blocked`
- Scope: one 48x48 four-direction Idle design review only

### EN-B02 - Chimera direction pilot

- Status: `boss-review-blocked`
- Scope: one 48x48 four-direction Idle design review only

### EN-B03 - Roc direction pilot

- Status: `boss-review-blocked`
- Scope: one 48x48 four-direction Idle design review only

Each Boss micro-slice follows: directions only, designer approval, separate
animation authorization, validation, then stop. The three Bosses are never
treated as one batch. They remain blocked while the existing Boss review queue
is unresolved unless the designer explicitly changes priority.

Wave 3 exit gate: the standard quadruped and avian chassis are approved; each
Boss direction pilot, if separately authorized, has its own review and decision.

## Wave 4 - Swarms, Aquatics, And Environmental Creatures

Wave 4 comes last because its small silhouettes, attachment mechanics, and
environmental states need the strongest review tooling and clearest child-asset
rules.

### EN-E13 - Ground insects

- Status: `queued`
- Families: Ant, Termite, Fly, Locust
- Priority-first: Ant

Shared leverage: tiny multi-leg bodies, wing/no-wing variants, swarm-ready
silhouettes, and restrained motion. Termite-built walls are environment assets,
not actor frames.

### EN-E14 - Parasites and wetland insects

- Status: `queued`
- Families: Mosquito, Dragonfly, Tick, Leech
- Priority-first: Mosquito

Shared leverage: hovering insects and small elongated bodies. Tick attachment
to another actor requires a runtime overlay/attachment contract; the base Tick
sheet only supplies its independent form.

### EN-E15 - Fast aquatic predators

- Status: `queued`
- Families: Shark, Eel, Piranha, Swordfish
- Priority-first: Shark

Shared leverage: swimming direction language, long bodies, fins, and bite/thrust
attacks. Water wake, bubbles, and impact splashes remain effects.

### EN-E16 - Benthic and unusual aquatics

- Status: `queued`
- Families: Stingray, Clam, Lamprey, Sea Urchin
- Priority-first: Stingray, Clam

Shared leverage: flat, radial, hinged, and suction-based silhouettes. The Clam
must have a readable open/close attack without changing the public frame count.

### EN-E17 - Dry-land plant creatures

- Status: `queued`
- Families: Mandrake, Bramble Beast, Cactus, Tumbleweed
- Priority-first: Mandrake

Shared leverage: root contacts, thorny masses, rolling motion, and plant
asymmetry. Projected thorns and dust clouds are effects.

### EN-E18 - Seasonal and wet plant creatures

- Status: `queued`
- Families: Pumpkin Monster, Moss Beast, Kelp Beast, Coral Colony

Shared leverage: squat plant bodies, trailing fronds, soft masses, and colony
silhouettes. Coral growth stages or spawned polyps require a separate state or
child-asset contract rather than hidden sheet extensions.

Wave 4 exit gate: small-form silhouettes survive native-size review, all
attachment and colony behavior is owned by explicit runtime contracts, and no
environmental effect has leaked into the actor sheets.

## Stateful And Multi-Asset Architecture Gates

The following ideas may proceed only after their asset ownership is explicit:

- EN-E08: head, rider/mount, mask, and living-weapon child assets;
- Phoenix: egg, ash, or resurrection state;
- Tick: attachment overlay and host anchoring;
- Coral Colony: growth stages or spawned colony pieces;
- Changeling/Doppelganger: runtime copying or disguise selection;
- Termite: constructed walls or mounds; and
- thrown heads, summoned creatures, projectiles, telegraphs, glow, trails,
  splashes, and impact effects across any family.

Until those contracts exist, create only the self-contained base actor and note
the deferred mechanic. Effects remain separate from character rendering.

## Validation And Review Gates

A slice can advance only when all applicable gates pass:

- the exact four-direction review PNG is inspected at native and readable zoom;
- baseline and variants have distinct silhouettes, not palette-only differences;
- Attack has a readable wind-up and release in all four directions;
- held items and body parts preserve intended front/behind layering;
- no projectile, telegraph, aura, trail, impact, or environmental effect is
  baked into the actor;
- drawing remains within the 24x24 cell;
- output uses hard/binary alpha;
- the completed standard sheet is exactly `480x96`;
- identical seeds produce identical output;
- the pre-expansion 202-sheet corpus remains unchanged except for the explicitly
  approved Ghoul upgrade;
- the focused slice checker passes;
- `npm.cmd run check` passes;
- `git diff --check` passes; and
- family/variant counts and pack manifests are reconciled at every wave boundary.

Structural checks are necessary but are not visual approval. No slice is
accepted, merged, published, or used as the basis for the next slice until its
required designer review is explicit.

## Scale And Capacity Forecast

| Measure | Current baseline | Full standard expansion projection |
| --- | ---: | ---: |
| Enemy families | 57 | approximately 132 |
| Enemy variants | 202 | approximately 427 |
| Actor cells at 80 cells/sheet | 16,160 | approximately 34,160 |

The Enemy export and test corpus will roughly double. Record full-pack duration,
archive size, deterministic digest, and manifest counts at every wave boundary.
The initial budget is three variants per new standard family; queens, admirals,
named champions, and other exceptional identities should be proposed later as
elite or Boss work instead of silently expanding these slices.

## Proposal Accounting

All 80 submitted proposals appear exactly once in the accounting below. The
merged Armor pair counts as two intake proposals but one planned family; Ghoul
counts as an upgrade; the three Boss candidates do not enter the Enemy totals.

| Slice | Intake proposals | Count |
| --- | --- | ---: |
| EN-E01 | Witch; Fallen Knight; Pirate; Necromancer; Alchemist | 5 |
| EN-E02 | Plague Doctor; Desert Raider; Fanatic Monk; Catfolk; Goatfolk | 5 |
| EN-E03 | Giant; Centaur; Satyr | 3 |
| EN-E04 | Naga; Merfolk; Birdfolk | 3 |
| EN-E05 | Ghoul; Mummy; Vampire; Revenant; Lich | 5 |
| EN-E06 | Fairy; Hag; Dryad; Redcap; Nymph | 5 |
| EN-E07 | Living Shadow; Doppelganger; Will-o'-Wisp; Changeling; Kelpie | 5 |
| EN-E08 | Haunted Armor; Animated Armor; Headless Rider; Possessed Mask; Living Weapon | 5 |
| EN-E09 | Clockwork Automaton; Living Book; Runic Idol; Crystal Beast | 4 |
| EN-E10 | Hyena; Ram; Stag; Mammoth; Rhino | 5 |
| EN-E11 | Peacock; Cockatrice; Raven; Owl; Phoenix | 5 |
| EN-E12 | Basilisk; Manticore; Sphinx | 3 |
| EN-B01 | Hydra | 1 |
| EN-B02 | Chimera | 1 |
| EN-B03 | Roc | 1 |
| EN-E13 | Ant; Termite; Fly; Locust | 4 |
| EN-E14 | Mosquito; Dragonfly; Tick; Leech | 4 |
| EN-E15 | Shark; Eel; Piranha; Swordfish | 4 |
| EN-E16 | Stingray; Clam; Lamprey; Sea Urchin | 4 |
| EN-E17 | Mandrake; Bramble Beast; Cactus; Tumbleweed | 4 |
| EN-E18 | Pumpkin Monster; Moss Beast; Kelp Beast; Coral Colony | 4 |
| **Total** |  | **80** |

## Next Authorization Boundary

The EN-E01 authorized production sequence is complete:

1. the approved common-baseline Idle pixels remain exact;
2. Walk/Attack/Hurt plus Enemy Cast/Death aliases are implemented;
3. every specialist and elite brief uses the same shared renderer and external-
   effect boundaries; and
4. focused all-variant/all-animation evidence has been generated and inspected.

EN-E01/EN-E02 completed-slice approval, bounded registration, consumer
integration, and the later seven-family repair approval are recorded.
Registration checkpoint `7b6e448` and consumer checkpoint `8ab1837` established
the generic 67/232 boundary; the exact repair pixels from `6400dd5` are now the
stable/public result, with the pre-repair registry retained internally. The
  exact rebuilt EN-E03 v2 raw and Complete B + Form common-only Idle artifacts for
  Giant, Centaur, and Satyr are rejected. The separate Hill Breaker F1
  reference-calibration study and its F2-only continuation are now visually
  approved as an exact internal two-frame Idle baseline. The later Steppe Hunter
  F1 calibration and bounded F2-only continuation are also visually approved as
  an exact internal two-frame Idle baseline. The separately authorized Briar
  Reveler F1 calibration and bounded F2-only continuation are also visually
  approved as an exact internal two-frame Idle baseline. Do not begin later
  motion, variants, registration, separate effect assets, release work, or any
  later EN-E03 step without a new explicit gate.

EN-E01 is the strongest first art slice because it yields five recognizable
families while stress-testing reusable humanoid equipment, held-item layering,
and non-baked attack tells. The largest unresolved risks are multi-form assets,
stateful attachments, and Boss-scale direction/animation work; those stay later
and separately gated.

There is no current EN-E03 implementation authorization. The exact Hill Breaker,
Steppe Hunter, and Briar Reveler F1/F2 baselines are approved and internal; any
continuation requires a new explicitly bounded designer authorization.
