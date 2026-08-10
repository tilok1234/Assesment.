# 8-bit Sprite Assembler

> **AI / Claude Code sessions: start at [`CLAUDE.md`](CLAUDE.md).** It holds the
> file map, the add-a-sprite runbooks, and the verification tiers. Orientation
> does not require the archived plans in `docs/archive/`.

> **ECOSYSTEM POINTER (2026-07-29, designer-accepted doc 16).** This
> repo is one of seven in the Wildshot project (it produces the game's
> actor packs; the binding pack spec is planning docs/14). The shared
> map — repo ownership, authority docs, hard cross-repo rules — lives
> at `Wildshot_adventure_final_planning/docs/16-ECOSYSTEM_MAP.md`.
> Read your repo's row before working here — when that planning repo is
> present beside this checkout. Skip both planning-repo hooks when it is
> absent (e.g. a cloud session on this repo alone).

> **SYNC-LOG HOOK (doc 18, ACCEPTED 2026-07-30).** At session end, append
> a line to planning `tools/sync_log.json` for every cross-repo event this
> session caused (pack delivered or intaken, ask opened/resolved, incident,
> pin change). No event, no entry. Protocol: planning
> `docs/18-AGENT_SYNC_PROTOCOL.md`.

A browser-based procedural sprite creator for building 24x24 player characters, enemies, and synchronized combat effects, previewing four-direction animations, and exporting game-ready PNG sprite sheets.

## Current capabilities

- Player assembly across Human, Elf, Orc, Goblin, Tiefling, Celestial, Dwarf, Undead, Lizardfolk, and Beastkin species; Classic, Lean, Sturdy, and Heroic body builds; plus skin, 11 hairstyles, six expressions, eight facial details, 12 headgear choices, nine outfits across five armor tiers, weapon type and tier, shield, the Lantern utility off-hand, and palette choices
- 80 selectable public enemy families with 259 predefined variants: the locked
  57-family / 202-variant legacy catalog plus 23 approved expansion families /
  57 variants across EN-E01 through EN-E06; public `zombie/ghoul` uses the
  approved Ghoul Upgrade renderer without adding a duplicate family
- EN-E03 evidence containing two visually rejected
  common-only Idle attempts, three separately approved internal F1/F2 Idle
  baselines for Hill Breaker, Steppe Hunter, and Briar Reveler, the approved
  internal Hill Breaker, Steppe Hunter, and Briar Reveler four-frame Walks, plus
  the approved Hill Breaker, Steppe Hunter, and Briar Reveler common Attack
  A1-A4 baselines, and the approved Hill Breaker, Steppe Hunter, and Briar
  Reveler Hurt H1-H2 baselines, plus the approved common Cast/Death aliases for
  those three variants, and the approved Boulder Hurler specialist Idle F1-F2
  baseline. The six completed full suites are selectable consumer content;
  Boulder Hurler, Storm-Clan Jarl, and Sun Lancer remain internal Idle-only work
- A separate Bosses tab with twelve approved 48x48 direction pilots plus
  repaired quadruped Rhino and Eclipse Unicorn Sovereign direction candidates; ten
  bosses have full Idle/Walk/Attack/Cast/Hurt/Death animation workspaces and
  native 1x animation-sheet download. Cruel Catgirl Templar of the Brutes and
  Divine Armored Templar Astro Knight are accepted, while Goblin War-Crown,
  Furious Depraved Rhino, and Gunslinger Boar Rider retain separate
  animation-candidate status
- 24 transparent combat-effect overlays across weapon trails, projectiles, impacts, and status effects
- A Combat Loadout Builder that previews those overlays on players and enemies, supplies automatic weapon-aware defaults, supports per-slot overrides, saves named recipes, and exports game-ready JSON
- An Equipment Variant Batch Builder that turns one character identity into bounded weapon, armor, shield, utility-off-hand, or 121-sheet RPG equipment collections with per-variant loadouts and only the combat effects they actually reference
- A Class Pack Builder with ten focused templates—Warrior, Guardian, Ranger, Rogue, Mage, Cleric, Barbarian, Necromancer, Paladin, and Druid—that preserves one character identity while exporting only the outfit, weapon, shield, utility-off-hand, armor-tier, and equipment-tier combinations appropriate to that RPG role
- Four directions: down, left, right, and up
- Idle, walk, attack, cast, hurt, and death animations
- Transparent PNG sprite-sheet export at native 1x, 4x, 8x, or 12x scale
- Persistent named sprite packs that collect player, enemy, and combat-effect designs and download as a ZIP with full PNG sheets and `manifest.json`
- One-click Complete Character Packs combining up to 24 assembled native sheets, matching recipes, 1912 content-unique atomic component sheets, all 259 public enemy variations, and all 24 combat effects at native 1x
- A validated frozen legacy fixture pack containing 232 exported sheets
- Local browser persistence for the current configuration
- Versioned, named player and enemy presets stored on the current device
- Sprite-only undo and redo through the header controls or `Ctrl+Z` / `Ctrl+Y`
- Explicit Production Roll and Wildcard Roll whole-character actions, thirteen
  Production-compatible Player category actions, and unrestricted
  per-category Wildcard rerolls with undo support
- Persistent character names, live preview labels, and Windows-safe custom PNG filenames
- Editable skin, hair, and outfit tone pairs with a reusable local palette library
- Full-sheet, selected-animation, and selected-direction PNG export scopes
- Play/pause, 0.5x/1x/2x playback speeds, frame stepping, and direct frame inspection with sheet-column metadata
- Optional assembled-sprite outlines with None, Complete B, and Selective C
  modes for players and all 80 public enemy families; the 57 approved
  expansion variants retain their reviewed raw pixels and gain
  outlines only in assembled output, while effects, source art, floor shadows,
  and atomic component sheets remain untreated
- Optional assembled-sprite shading with None and the approved material-aware
  Form mode for players and all 80 public enemy families; approved expansion
  variants resolve their own published renderer palette
  ramps rather than a legacy-family fallback. The selector participates in undo/redo,
  comparisons, presets, packs, recipes, previews, and assembled exports, while
  raw source pixels, effects, and atomic component sheets remain untreated
- A validated local full-public-Enemy exporter with three top-level treatment
  folders: Form + Complete B, Form + Selective C, and Form + None. Its current
  catalog target is 259 native complete sheets per folder / 777 PNGs total plus
  a manifest, README, stored ZIP, and SHA-256 sidecar
- Undoable player/enemy reset plus a persistent saved copy for animated side-by-side A/B comparison
- Facial detail choices for none, beard, mustache, scar, eyepatch, glasses, blush, and war paint; details follow character colors, respect rear views, and hide beneath full helmets
- Six modular expressions—Neutral, Happy, Angry, Sad, Surprised, and Determined—that animate in every visible direction, remain readable beneath glasses, and hide beneath full helmets
- Eleven animated hairstyles, including Braids, Afro, Topknot, and Messy, with fitted or deliberately visible under-headgear variants
- Twelve direction-aware headgear choices, including Bandana, Circlet, Plumed Helm, and Skull Mask, with intentional expression visibility and face coverage
- Nine direction-aware outfit families, including Barbarian Furs, Ranger Coat, Cleric Vestments, and Necromancer Robes, with distinct front, profile, and rear silhouettes across all four body builds
- Five named armor tiers for every outfit: reinforced Tier 2, crested Tier 3, mythic Tier 4 pauldrons, and luminous Tier 5 apex forms that follow all body animations
- Fifteen equipped weapon choices spanning blades, blunt weapons, polearms, ranged weapons, and magic focuses, each with standard Tier 1, named RPG-style Tier 2, legendary Tier 3, oversized mythic Tier 4, and final artifact Tier 5 forms; all 75 variants use hand-anchored motion and preserve front- and side-face clearance
- Eight equipped shield choices—round, kite, buckler, heater, tower, oval, bone, and arcane—with five named tiers culminating in Worldsun Disc, Voidwyrm Aegis, Paradox Star, Throneheart Aegis, The Unbroken Gate, Imperial Eternity, Deathking's Reliquary, and Event Horizon; every facing reuses the unchanged broad shield face, the equipment grip owns the animated shield-hand socket instead of leaving ordinary hand pixels visible, and near/far body occlusion is split around the reusable body layer
- One approved non-shield off-hand item, Lantern, with its own public field, direction-aware back/front passes, mutual exclusion with shields, and animated hand attachment across every body build and frame

## Complete B actor package

Run `npm.cmd run export:actors:complete-b` to create the deterministic local
package at `dist/8-bit-sprite-assembler-complete-b-actor-pack-v1/` and its
matching `.zip` plus `.zip.sha256` sidecar. The package contains 16 distinct
playable heroes, 96 Player-assembler-derived NPCs across 16 recognizable roles,
all 259 public enemy variations across 80 families, and all 10 bosses with a
complete 20-column animation suite: 381 transparent native full-sheet PNGs.

Players, NPCs, and enemies use Form shading plus the Complete B outline. Bosses
retain their approved source colors and receive a per-frame Complete B exterior
contour. Standard actor sheets are `480x96` with `24x24` cells; boss sheets are
`960x192` with `48x48` cells. All use Down/Left/Right/Up rows and
Idle/Walk/Attack/Cast/Hurt/Death columns, hard alpha, no floor shadow, and no
baked combat effects. Candidate-status bosses are included because they have
complete animation suites; their review status is preserved in `manifest.json`
rather than being promoted by the export.

Run `npm.cmd run check:export:actors:complete-b` to reopen and validate every
PNG, exact roster, dimensions, hard alpha, outline evidence, per-cell content,
file hashes, directory contents, ZIP hash, and checksum sidecar.

## Visual review presentation contract

Unless the designer explicitly requests a narrow inspection, every sprite or
actor review shown for approval must display all four labeled directionsâ€”Down,
Left, Right, and Upâ€”and include both the raw/no-outline animation and the
outlined project presentation (currently Complete B + Form in this lane) in the
same review response. Do not send side-only, unlabeled, or single-mode evidence
as a normal approval surface. Reviews may be narrower only when the requested
scope is a specific direction, frame, layer, outline mode, or isolated defect;
name that exception explicitly.

Approval publication rule: after the designer explicitly approves the exact
review surface, stage only that bounded approval lane, commit it, and push its
branch before beginning another gate. Do not publish an unapproved lane; an
explicit hold instruction overrides this default.

## Current integration status

The EN-F00 Enemy-expansion foundation is accepted at isolated checkpoint
`73ad73a` on `codex/en-f00`. The separately authorized `codex/en-e01` branch
passed its four-direction Idle and completed-slice visual gates on 2026-08-02.
The reviewed implementation is checkpoint `230a9a3`; public registration is
checkpoint `b43ed6a`. Five immutable contract cards produce 15 approved variants
(common, specialist, and elite for Witch, Fallen Knight, Pirate, Necromancer,
and Alchemist) through one data-driven humanoid chassis. Every variant has the
standard 20-column Idle/Walk/Attack/Cast/Hurt/Death sheet; Enemy Cast aliases
Attack and Death aliases Hurt 1, 2, 2, 2. The EN-E01 slice registry exposes all
five families / 15 variants through `renderEnemyExpansionFrame()`. The approved
common Idle PNG remains
locked at SHA-256
`2d710ab54a845c4805d428c428cfa9e1cda09f4adee886c5deafbafee831b7ee`
and its 40-frame digest remains
`339c5ff809d3b17aec20b3ec953c8217470cde026fc743cde0cd3854ed5c3323`.
The reviewed and registered 1,200-frame digest is
`addcf8055a80a0a6266be0eff8cd6b8235092c6ba366bc9c020bd5feb90ae173`.
Consumer checkpoint `e0be273` first established an immutable `PUBLIC_ENEMIES`
catalog without changing the legacy `ENEMIES` entries. EN-E02 consumer
checkpoint `8ab1837` extended that generic boundary, and the separately
authorized EN-E04 consumer gate first reused the exact 13-family / 39-variant
approved registry. The later EN-E05, EN-E06, and EN-E03 adoption gates now
reuse the exact 23-family / 57-variant registry. Editor sanitization and
selectors, persistence, Enemy randomization, thumbnails,
full/animation/direction exports, ordinary packs, Wildshot manifest validation,
combat defaults, and Complete Kits now consume 80 families / 259 variants
through the same public dispatcher. The dedicated Ghoul replacement route maps
`zombie/ghoul` to the approved upgrade without a duplicate selector family.
All 4,560 approved expansion frames and all 57 native sheets remain pixel-identical to their
registries when assembled presentation is None. Optional assembled output
supports both approved enemy outline modes and material-aware Form shading
without changing that raw dispatcher boundary. No schema version changed
because Enemy specs retain the existing `{ kind, family, variant }` shape.

The separately authorized `codex/en-e02` branch now records exact completed-
slice approval and bounded registration at checkpoint `7b6e448`. Five immutable
EN-E02 contract cards retain the frozen approved common-Idle registry and a
separate pre-registration candidate snapshot with all 15
common/specialist/elite variants. The exact
40-frame Idle artifact remains locked at SHA-256
`c224258139c7c810c7a122ea9e95061f3dd1697864913765fe9d11e09f4eca50`
and frame digest
`00d71d7e8f1904c275bfe84ec6cec746fb314fab4d27ce182d72e286a846d02b`.
The full candidate supplies Walk/Attack/Hurt motion plus exact Enemy Cast/Death
aliases across 15 complete `480x96` sheets / 1,200 frames. Its frame digest is
`f4667a1ccefb3026c6df3604e114393fdaae619dab0c68bec969203986cb35bf`,
and its exact `1148x1984` overview PNG SHA-256 is
`21f3175600377eaf75206f9fcb65856731da28eafb6715687821f782f41da6a8`.
The private `1124x1992` Complete B/Form presentation board is SHA-256
`211e9ace3eb965f243724249c73927567568e2f22f181f5448ba398ddab4a094`.
The designer approved the exact completed-slice overview, authorized bounded
registration, and then separately authorized EN-E02 consumer integration on
2026-08-02. At that checkpoint, the cumulative stable
`ENEMY_EXPANSION_REGISTRY` and separately authorized
`ENEMY_EXPANSION_CONSUMER_REGISTRY` exposed the same ten approved EN-E01/EN-E02
families / 30 variants, producing the immutable 67-family / 232-variant
`PUBLIC_ENEMIES` catalog. The cumulative consumer gate exhausts all
2,400 approved frames, 30 sheets, 7,200 None/B/C outline cases, and 7,200
Form-with-outline cases. A live Plague Doctor / Field Chirurgeon smoke test
confirmed Complete B + Form, the exact export name, all 67 selector entries,
and a clean console. The designer accepted that consumer presentation and later
approved the exact seven-family walk/seam repair for Catfolk, Desert Raider,
Fallen Knight, Fanatic Monk, Goatfolk, Necromancer, and Witch. That repaired
ten-family registry remains the immutable EN-E01/EN-E02 comparison source. The
current stable and consumer registries additionally compose the approved
EN-E03, EN-E04, EN-E05, and EN-E06 registrations, reaching 23 families / 57
variants and an 80/259 public catalog.

The isolated `codex/en-e03` branch first produced checkpoint `50ad516`, but the
designer rejected those Giant, Centaur, and Satyr common Idle boards because
their boxed construction and baked silhouette ink did not match the approved
Enemy roster. Replacement checkpoint `6104eae` keeps the same immutable
contract cards and common-only scope while rebuilding Hill Breaker, Steppe
Hunter, and Briar Reveler with a palette-first source treatment. All 24 v2
frames pass the focused structural gate and have exact raw plus Complete B +
Form presentation boards, but on 2026-08-03 the designer rejected that pass as
still far from the established roster style. A later smaller reference-first
Hill Breaker F1 study reused the approved humanoid chassis and was visually
approved on 2026-08-03. The bounded F2-only continuation was then approved on
the same date; those eight exact frames form the accepted Hill Breaker Idle
baseline. The later reference-first Steppe Hunter F1 gate was also visually
approved on the exact four-direction raw and Complete B + Form boards. The
designer then authorized only Steppe Hunter F2 across those same directions and
approved the resulting exact eight-frame F1/F2 boards on 2026-08-03 with
`Approved lets keep going.` Those frames now form the accepted internal Steppe
Hunter Idle baseline. That approval authorized only a reference-first Briar
Reveler F1 gate across Down, Left, Right, and Up. The designer approved its exact
raw and Complete B + Form boards on 2026-08-03 with `looks good.` Those four
frames are now the accepted internal Briar Reveler F1 seed. The designer then
said `lets go next`, authorizing only Briar Reveler F2 across the same four
directions. The designer approved the exact F1/F2 raw and Complete B + Form
boards on 2026-08-04 with `approved`. Those eight frames now form the accepted
internal Briar Reveler Idle baseline. The designer then said `lets do next`,
authorizing only Hill Breaker common Walk W1-W4 across Down, Left, Right, and
Up while preserving the approved Idle frames exactly. Preservation checkpoint
`8ea019b` preserves those exact candidate pixels. The designer reviewed the
exact raw and Complete B + Form boards and approved Hill Breaker Walk on
2026-08-06 with `yes sir seems fine to me approved`. That approval authorized
only Steppe Hunter common Walk W1-W4 across the same directions. Its isolated
implementation delegates all eight approved Idle frames byte-for-byte and
passes its 16-frame focused gate with zero public exposure. The designer
reviewed the exact raw and Complete B + Form animations and approved them on
2026-08-06 with `approved`. The designer then said `awesome lets do next`,
authorizing only Briar Reveler common Walk W1-W4. That isolated candidate now
passes its focused 16-frame gate while preserving all eight approved Idle
frames and zero public exposure. Its Up frames explicitly suppress the shared
front-expression pixel so the rear head does not show a side eye. The designer
reviewed the corrected raw and Complete B + Form animations and approved them
on 2026-08-06 with `greeat lets move on`. That approval authorizes only Hill
Breaker common Attack A1-A4 across the same four directions while preserving
its approved Idle and Walk frames byte-for-byte. The isolated Attack baseline
now exists with 16 connected, distinct four-direction poses, planted contact,
one-cell margins, exact approved Idle/Walk delegation, and zero public exposure.
After review feedback that more of the body should move, A1 now braces the
torso. The resulting overlay-only slide was explicitly rejected as `not a good
animation`, so it was discarded. The replacement privately composes the full
upper body, Giant identity, and front/back club layers: A1 coils backward, A2
releases from center, A3 moves forward and drops into impact, and A4 recovers
over anchored legs and feet. After the follow-up request to use front and back
too, the Down/Up poses now carry that motion through the hips and upper legs;
both foot anchors remain exact through all four phases. The designer reviewed
the exact labeled four-direction raw and Complete B + Form animations and said
`Very good approved` on 2026-08-07. Hill Breaker Attack is now an approved
internal baseline. The designer then said `Cool let's keep going`, authorizing
only Steppe Hunter common Attack A1-A4 across Down, Left, Right, and Up while
preserving its approved Idle and Walk frames byte-for-byte. That isolated
baseline passes its focused 16-frame gate with connected
horse-rider-spear silhouettes, planted hoof contact, four distinct poses and at
least three horse-body weight phases per direction, true Down/Up attacks, exact
side mirroring, frozen raw and Complete B + Form evidence, and zero public
exposure. The designer reviewed both exact labeled four-direction GIFs together
and said `Approved` on 2026-08-07. Steppe Hunter Attack is now an approved
internal baseline and its branch is committed and pushed. The designer then
said `lets keep going`, authorizing only Briar Reveler common Attack A1-A4 across
Down, Left, Right, and Up while preserving approved Idle and Walk byte-for-byte.
That isolated review candidate passes its focused 16-frame gate with connected
body-and-staff silhouettes, planted split hooves, four distinct phases per
direction, full torso/hock/tail/staff motion, exact side mirroring, distinct
front/back depth, frozen dual-presentation evidence, and zero public exposure.
The designer reviewed both exact labeled all-four-direction raw and Complete B
+ Form animations together and said `very good! approved` on 2026-08-07. Briar
Reveler Attack is now an approved internal baseline and its matching branch is
committed and pushed under the approval-publication contract. The designer then
accepted the explicitly proposed Hill Breaker Hurt H1-H2 gate with `lets go for
it`. Its isolated eight-frame candidate preserves all approved Idle, Walk, and
Attack frames byte-for-byte, passes its focused structural gate, and has both
required labeled all-four-direction raw and Complete B + Form GIFs ready for
direct review. The designer reviewed both exact GIFs together and said
`approved` on 2026-08-07. Hill Breaker Hurt is now an approved internal
baseline and its bounded branch is committed and pushed. The designer then
said `nice lets do nexrt`; Codex explicitly bounded only Steppe Hunter Hurt
H1-H2 across all four directions. That isolated candidate preserves all 40
approved Steppe Idle/Walk/Attack frames byte-for-byte and passes eight-frame
connected-hybrid, fixed-four-hoof-anchor, mirror, hard-alpha, one-cell-margin,
frozen-evidence, Complete B/Form, and zero-public-exposure checks. Both exact
labeled all-four-direction raw and Complete B + Form GIFs are ready together,
and the designer reviewed both exact GIFs together and said `approved` on
2026-08-07. Steppe Hunter Hurt is now an approved internal baseline and its
bounded branch is committed and pushed under the approval-publication contract.
The designer then said `awesome lets do next`; Codex explicitly bounded the
continuation as Briar Reveler Hurt H1-H2 across all four directions, preserving
all 40 approved Briar Idle/Walk/Attack frames and stopping before commit or
push for the mandatory paired review. That isolated candidate now passes its
focused eight-frame gate with connected full-body horned goatfolk/staff
silhouettes, four fixed split-hoof tips, exact side mirrors, true Down/Up depth,
one-cell margins, hard alpha, a rear-facing Up head with no side eye, frozen
raw and Complete B + Form evidence, and zero public exposure. The designer
reviewed both exact GIFs together and said `approved lets do next` on
2026-08-07. Briar Reveler Hurt is now an approved internal baseline and its
bounded branch is committed and pushed under the publication contract. With
the 965 missing ignored Boss checkpoints copied from the approved Steppe lane,
the complete 1,064-file local corpus also passes the full `npm.cmd run check`;
all 232 public fixture sheets remain unchanged. The separately isolated common
Cast/Death alias gate for the three approved EN-E03 common variants now passes
its focused gate: all 144
approved Idle/Walk/Attack/Hurt context frames remain exact, 48 Cast frames
alias Attack frame-for-frame, 48 Death frames alias Hurt H1,H2,H2,H2, no new
sprite pixels exist, and all three families remain internal. Its four labeled
three-family/all-four-direction review GIFs are ready together in raw and
Complete B + Form modes. With the complete 1,064-file local Boss corpus, the
full `npm.cmd run check` also passes and all 232 public sheets remain unchanged.
The designer reviewed all four exact GIFs together and said `approved` on
2026-08-07; the bounded branch is committed and pushed under the publication
contract. The designer then said `good lets do next`; only a Boulder Hurler
two-frame Idle baseline across four directions was authorized at that
checkpoint, with its boulder/projectile kept external. It is now approved and
published. No EN-E03 family is selectable or public.

The isolated Boulder Hurler baseline implements only specialist Idle F1-F2
across Down, Left, Right, and Up. Its long bare throwing arms, wrist wraps,
diagonal sling harness, and cool slate hide palette distinguish it from the
approved Hill Breaker common baseline; the boulder remains an external
projectile and contributes zero actor pixels. Its revised `480ms` Idle loop
uses a grounded shoulder drop, lagging inward hands, and a bent throwing-ready
side pose instead of translating the whole overlay together. Its focused gate preserves all
8/8 approved Hill Breaker Idle frames, validates 8/8 connected hard-alpha
candidate frames, four exact side mirrors, one-cell margins, frozen raw and
Complete B + Form boards/GIFs, and zero public families. The designer reviewed
both exact improved labeled all-four-direction GIFs together and said
`approved` on 2026-08-07; the bounded branch is committed and pushed under the
publication contract. With
the complete local Boss checkpoint corpus present, the full `npm.cmd run check`
also passes and all 232 public fixture sheets remain unchanged.

## Full public-Enemy three-treatment export

Run `npm.cmd run export:enemies:all-outlines` to generate one local package for
all 80 complete public Enemy families / 259 variants. The package has exactly
three top-level art folders:

- `outlined/<family>/<variant>.png` for Form + Complete B;
- `semi-outlined/<family>/<variant>.png` for Form + Selective C; and
- `without-outlines/<family>/<variant>.png` for Form + None.

Every file is a native `480x96` hard-alpha sheet containing all four directions
and the 20-column Idle/Walk/Attack/Cast/Hurt/Death contract. The current package
target is 259 sheets in each folder / 777 PNGs total. `manifest.json` records the catalog,
frame contract, treatment mapping, per-file dimensions, opaque-pixel counts,
byte sizes, and SHA-256 hashes. `README.md`, the deterministic stored ZIP, and a
ZIP SHA-256 sidecar are included.

Run `npm.cmd run check:export:enemies:all-outlines` to verify every PNG, every
non-empty actor cell, binary alpha, treatment distinction, directory contents,
manifest hashes, ZIP entry bytes, and sidecar. The previous approved delivery
is a historical 67-family / 232-variant package with 696 PNGs. Its exact ZIP is
2,440,823 bytes with SHA-256
`fd03895d8657b96293be14fbddbdb193ce62678c068023b58015410fc7f92b9c`.
The designer accepted that delivered package with `awesome lets do next in
plan` on 2026-08-07. The approved exporter/checker and documentation are
committed and pushed at `71fb59479626b757f112be3f9e56b92f24085208`.

This local package intentionally excludes incomplete/non-public EN-E03 work,
Bosses, players, effects, floor shadows, projectiles, release binaries, and
invented license text. It is not the separately gated Wildshot game-pack
release. That bounded continuation is now complete: Storm-Clan Jarl elite Idle
F1-F2 is visually approved, internal, non-public, and effect-free after its
side-pauldron repair. Other EN-E03 motion, variants, registration, consumers,
effects, release, and later work remain gated.

## Approved Storm-Clan Jarl elite Idle baseline

Run `npm.cmd run review:enemy-expansion-en-e03-storm-clan-jarl-idle` to
reproduce the exact corrected raw/no-outline and Complete B + Form review
boards and the two labeled all-four-direction `192x224` GIFs. Run
`npm.cmd run check:enemy-expansion-en-e03-storm-clan-jarl-idle` to verify the
approved evidence hashes, all eight connected hard-alpha candidate frames,
exact side mirrors, one-cell margins, preserved Hill Breaker and Boulder Hurler
Idle baselines, zero baked storm/lightning/impact pixels, and zero public
EN-E03 families. The designer reviewed both corrected GIFs together and said
`approved` on 2026-08-07; the bounded implementation is committed and pushed at
`d9c3dedf521a1a1a6ad0b82f458bf38cf8fa9533`. This approval does not authorize
another animation, variant, registration, consumer integration, effect,
release, or later gate.

## Approved Sun Lancer specialist Idle baseline

Run `npm.cmd run review:enemy-expansion-en-e03-sun-lancer-idle` to reproduce
the exact raw/no-outline and Complete B + Form comparison boards and two
labeled all-four-direction `192x224` GIFs. Run
`npm.cmd run check:enemy-expansion-en-e03-sun-lancer-idle` to verify the frozen
candidate hashes, all eight connected hard-alpha Centaur frames, four fixed
hoof contacts, exact side mirrors, preserved Steppe Hunter and Storm-Clan Jarl
baselines, zero baked charge/trail/shock effects, and zero public exposure. The
candidate uses sun-gold rider armor, a red-gold saddle cloth, and a bright lance
pennant over the approved chestnut Steppe Hunter chassis. The designer approved
both exact GIFs together on 2026-08-07. The bounded approval implementation is
committed and pushed at `f5057497bc0b9ee62b79c5d8a94efecfd49c0ec9`; no
other animation, variant, registration, consumer integration, effect, release,
or later gate is authorized.

## Approved Banner Khan elite Idle baseline

Run `npm.cmd run review:enemy-expansion-en-e03-banner-khan-idle` to reproduce
the exact raw/no-outline and Complete B + Form comparison boards and two
labeled all-four-direction `192x224` GIFs. Run
`npm.cmd run check:enemy-expansion-en-e03-banner-khan-idle` to verify the frozen
candidate hashes, all eight connected hard-alpha Centaur frames, four fixed
hoof contacts, exact side mirrors, preserved Steppe Hunter and Sun Lancer
baselines, zero baked command-aura/banner-flare/shock effects, and zero public
exposure. The first blocky overlay and its targeted repair are both rejected.
The from-scratch candidate delegates only the approved Steppe Hunter chassis
and redraws the elite identity with a visible face, compact conical steel helm,
segmented blue-steel lamellar armor, crimson command cloth, limited saddle
drape, and a separated tapered war standard. After the side face was rejected
as straight lines, only its exact mirrored Left/Right profiles were rebuilt with
a stepped forehead, protruding nose, visible eye, cheek, and tapered jaw; Down,
Up and the approved chassis were unchanged by that face repair. The follow-up
mouth correction reduces it to one front pixel and separates it from the shaded
cheek. The later pale horizontal side-profile streak was the light fur collar
rather than the mouth; only that mirrored collar now uses a compact stepped
two-tone shape with a two-pixel pale highlight. The latest revision adds a
Banner Khan-only planted horse-torso shift in F2 while every leg and hoof pixel
remains byte-exact. The designer reviewed both exact labeled all-four-direction
r3 GIFs together and said `approved` on 2026-08-07. The internal, non-public
baseline is committed and pushed at
`55143049b4153e34fcdaad0ea434932ba0f2d0fd`; no other animation, variant,
registration, consumer integration, effect, release, or later gate is
authorized.

## Approved Banner Khan grouped motion

After the published Idle handoff, the designer said `lets keep going`,
authorizing the documented grouped Banner Khan Walk/Attack/Hurt/Cast/Death
follow-up. Run `npm.cmd run review:enemy-expansion-en-e03-banner-khan-motion`
to reproduce the exact raw/no-outline and Complete B + Form `1428x760` boards
and paired labeled all-four-direction `640x672` motion-suite GIFs. Run
`npm.cmd run check:enemy-expansion-en-e03-banner-khan-motion` to verify all 80
suite frames, byte-exact approved Idle and Steppe motion sources, connected
hard-alpha silhouettes, exact side mirrors, alternating horse-torso response,
four distinct spear Attack phases, fixed Hurt anchors, exact Cast/Death aliases,
frozen hashes, and zero public exposure. Walk, Attack, Cast, Hurt, and Death are
shown simultaneously across four GIF phases; approved Idle is included only as
frozen context. Command aura, banner flare, hoof shock rings, and all other
effects remain external. Focused validation and the full `npm.cmd run check`
pass, with all 232 public fixture sheets unchanged. The designer reviewed both
exact labeled all-four-direction GIFs together and said `approved` on
2026-08-08. The internal, non-public motion lane is committed and pushed at
`8e73cd038d50037a40cad27ee9f2e37b6e363b69`; no other variant, registration,
consumer integration, effect, release, or later gate is authorized.

## Reed Charmer specialist Idle approved

After the published Banner Khan motion handoff, the designer said
`cool lets do next`, advancing the documented EN-E03 family/role order only to
Reed Charmer Idle F1-F2. The designer reviewed the exact paired labeled
all-four-direction raw/no-outline and Complete B + Form GIFs together and said
`Approved` on 2026-08-08. Run
`npm.cmd run review:enemy-expansion-en-e03-reed-charmer-idle` to reproduce the
exact raw/no-outline and Complete B + Form `1528x650` comparison boards plus
paired labeled all-four-direction `192x224` GIFs. Run
`npm.cmd run check:enemy-expansion-en-e03-reed-charmer-idle` to verify the
frozen hashes, all eight connected hard-alpha specialist frames, exact approved
Briar Reveler preservation, four split-hoof contact rows, exact side mirrors,
visible F1/F2 playing motion, and zero public exposure. The focused gate and
full `npm.cmd run check` pass; the full gate finished in `184` seconds with
all 232 public fixture sheets unchanged. Reed Charmer preserves
the approved horns, tail, digitigrade legs, and hooves, replaces the crooked
staff with a compact panpipe and connected hands, and adds a teal woven vest
with gold sash. Music notes, pollen, charm rings, and all other control effects
remain external. The approved internal lane is committed and pushed at
`070f85b20c4ea77a75e35eb6d9eefd697f4b0b47`; Wildwood Hornlord, later motion,
registration, consumer integration, effects, release, and later gates remain
unauthorized.

## Reed Charmer complete motion suite approved

The designer authorized one safe larger slice with `Sure lets go for it one
complete motion suite we can try atleast`. Run
`npm.cmd run review:enemy-expansion-en-e03-reed-charmer-motion` to reproduce the
exact raw/no-outline and Complete B + Form `1428x760` boards plus paired labeled
`640x672`, four-phase GIFs. Run
`npm.cmd run check:enemy-expansion-en-e03-reed-charmer-motion` to verify all 80
Idle/Walk/Attack/Cast/Hurt/Death frames, exact approved Idle and Briar source
preservation, connected hard alpha, exact side mirrors, full-body movement,
Cast-to-Attack and Death-to-Hurt aliases, frozen hashes, external effects, and
zero public exposure. The full repository gate also passes in `187.1s`, with
all 232 validated PNG sheets unchanged. The designer reviewed both exact paired
GIFs and said `Approved` on 2026-08-08. The internal, non-public bounded
implementation is committed and pushed at `f77c8a88b25cb59f5bdbe82708a620e5cae3fe9d`.
That Reed approval did not authorize Wildwood Hornlord, registration,
integration, effects, release, or later work; the separate Wildwood Idle gate
is recorded below.

## Wildwood Hornlord elite Idle approved

After the published Reed Charmer suite, the designer said `Awesome let's do
next`. Following the documented Satyr role order, the bounded internal candidate
implements only Wildwood Hornlord Idle F1-F2 across four directions. Run
`npm.cmd run review:enemy-expansion-en-e03-wildwood-hornlord-idle` to reproduce
the exact paired raw/no-outline and Complete B + Form `1548x650` boards and
labeled `192x224` two-frame GIFs. Run
`npm.cmd run check:enemy-expansion-en-e03-wildwood-hornlord-idle` to verify all
eight connected frames, exact Briar hoof-contact rows, side mirrors, the
branching antler/bark/moss identity, frozen hashes, external thorn/leaf/root
effects, and zero public exposure. The full repository gate passes in `187.6s`
with all 232 validated PNG sheets unchanged. The designer reviewed both exact
paired GIFs together and said `Approved lets do next` on 2026-08-08. The
internal, non-public lane is committed and pushed at
`aa96e170c41cbcb49c7ac1bd979114b3b5bfa7e4`; the same message requests the next
isolated Wildwood art gate. Registration, integration, baked effects, release,
and broader EN-E03 work remain unauthorized.

## Wildwood Hornlord complete motion approved

After the approved Idle pair, `Approved lets do next` activates one complete
Wildwood Hornlord suite only. Run
`npm.cmd run review:enemy-expansion-en-e03-wildwood-hornlord-motion` to
reproduce the exact paired raw/no-outline and Complete B + Form `1428x760`
boards plus labeled `640x672`, four-phase GIFs. Run
`npm.cmd run check:enemy-expansion-en-e03-wildwood-hornlord-motion` to verify
exact approved Idle delegation, all 80 connected frames, side mirrors,
full-body Walk/Attack/Hurt motion, exact Cast/Death aliases, frozen hashes,
external thorn/leaf/root effects, and zero public exposure. The full repository
gate passes in `203.7s` with all 232 validated PNG sheets unchanged. The
designer reviewed both exact paired GIFs and said `Approved` on 2026-08-08.
The internal, non-public implementation is committed and pushed at
`d9cb0faa3dff204106598876fe38db5f4ee3237a`. Registration, integration, effects,
release, and later work remain unauthorized.

## Naga Coilguard common Idle approved

After the approved Wildwood Hornlord suite was published and reconciled, the
designer said `Let's do next`. EN-E04 lists Naga priority-first, so the isolated
candidate implements only Coilguard common Idle F1-F2 across Down, Left, Right,
and Up. Run `npm.cmd run review:enemy-expansion-en-e04-naga-idle` to reproduce
the exact raw/no-outline and Complete B + Form `1548x420` boards and paired
labeled `192x224`, two-frame GIFs. Run
`npm.cmd run check:enemy-expansion-en-e04-naga-idle` to verify all eight
connected hard-alpha frames, 64 continuous lower-body scanlines, broad
single-coil ground contacts, exact side mirrors, the cobra-hood/belly-plate
identity, frozen hashes, external venom/miasma/coil-impact effects, and zero
public exposure.

The F2 breathing pose lowers the hood and torso one row and compresses the
direction-aware serpent coil without introducing ordinary legs, paired feet,
or a body-to-tail seam. Coilguard remains the only implemented role inside this
approved source module; the separate private Venom Oracle candidate is described
below, while Temple Rajah, Merfolk, and Birdfolk remain untouched. The focused gate passes, and post-approval full
`npm.cmd run check` passes in `241s` with all 232 public PNG sheets unchanged. Both exact frozen
boards were opened in Aseprite at original resolution. The designer reviewed
both exact paired GIFs together and said `Approved` on 2026-08-08. The
internal, non-public lane is committed and pushed at
`bd920c206d692bcc5e7b043614dcf6a03db2174c`. At that publication checkpoint no
art gate was active. The later explicit checkout-and-continue request activates
only the bounded Coilguard complete-motion lane below.

## Naga Coilguard complete motion approved

On `codex/en-e04-naga-motion`, the current v2 workflow now owns one internal,
non-public Coilguard motion suite. Approved Idle F1-F2 delegates byte-for-byte;
the approved suite adds four-frame Walk and Attack, two-frame Hurt,
Cast as an exact Attack alias, and Death as exact Hurt aliases `H1,H2,H2,H2`
across all four directions. Venom Oracle, Temple Rajah, Merfolk, Birdfolk,
registration, consumers, effects, and release remain outside this gate.

Run `npm.cmd run review:enemy-expansion-en-e04-naga-motion` to reproduce the
paired raw/no-outline and Complete B + Form `1428x760` boards and labeled
`640x672`, four-phase GIFs. Run
`npm.cmd run check:enemy-expansion-en-e04-naga-motion` to verify all 80 frames,
approved Idle delegation, one connected hard-alpha serpent silhouette per
frame, all 640 continuous lower-body rows, exact side mirrors, exact
Cast/Death aliases, frozen evidence hashes, external effects, and zero public
exposure. The focused and cleaned v2 fast gates pass; full `npm.cmd run check`
also passes in `121.9s` with all 232 public PNG sheets unchanged. Both exact
boards were opened in Aseprite at original resolution.

The designer reviewed both exact paired presentations together and said
`approved` on 2026-08-08. Gate `en-e04-naga-coilguard-motion-v1` is now
`approved`; the internal implementation is committed and pushed at
`f47e1691208236f5d245a1f3b9b15355ad479790`. Its approval does not authorize
registration, integration, effects, release, or broader EN-E04 work. The later
`lets do next` activates only the specialist Idle gate below.

## Naga Venom Oracle specialist Idle approved and published

Branch `codex/en-e04-venom-oracle-idle` owns one approved internal, non-public
baseline: Venom Oracle Idle F1-F2 across Down, Left, Right, and Up.
It preserves the approved Naga hood and continuous planted coil, including the
Coilguard tail region from rows 17-23 byte-for-byte, then adds a connected
ritual crown/jewel, violet mantle, gold sigil, and venom-bright eyes/sigil. Venom
spit, miasma, ritual circles, prophecy marks, impacts, and other effects remain
external.

Run `npm.cmd run review:enemy-expansion-en-e04-venom-oracle-idle` to reproduce
the raw/no-outline and Complete B + Form `1548x420` boards and paired labeled
`192x224`, two-frame GIFs. Run
`npm.cmd run check:enemy-expansion-en-e04-venom-oracle-idle` to verify all eight
connected hard-alpha frames, 64 continuous lower-body rows, approved-tail
preservation, exact side mirrors, specialist identity pixels, frozen hashes,
external effects, and zero public exposure. The candidate digest is
`2df5c53f3b6636f2918d4620a3419ee0465ecc57f68d5f8506b5c9e79e862228`.

The candidate and both protected Coilguard gates pass. The cleaned v2 fast gate
passes in `67.1s`, and final pre-commit `npm.cmd run check` passes in `148.4s`
with all 232
public PNG sheets unchanged. Both exact boards were opened in Aseprite and both
GIF phases were inspected directly. The designer reviewed both exact paired
presentations and said `ye approved` on 2026-08-08. Gate
`en-e04-venom-oracle-idle-v1` is `approved`; bounded publication is complete at
`3365d9915ed0ac1e506470604ed1e83c84606181`.
The later `sure lets do that` activates only the combined larger slice below.

## Expanded Naga Venom motion plus Temple Rajah Idle approved and published

Branch `codex/en-e04-venom-motion-rajah-idle` owns one internal, non-public,
approved 88-frame review implementation committed and pushed at
`4fd887f0a174169d47f9f3bee3f98d92c2ffaf30`. It preserves all eight approved
Venom Oracle Idle frames exactly, completes the 80-frame specialist suite with
Walk, Attack, Hurt, exact Cast aliases, and exact Death aliases, and adds only
Temple Rajah Idle F1-F2 across four directions. Rajah motion, Merfolk,
Birdfolk, registration, integration, effects, release, and later work remain
outside.

Run `npm.cmd run review:enemy-expansion-en-e04-venom-motion-rajah-idle` to
reproduce paired raw/no-outline and Complete B + Form `1428x868` boards and
paired labeled `640x776`, four-phase GIFs. Run
`npm.cmd run check:enemy-expansion-en-e04-venom-motion-rajah-idle` to verify all
88 connected hard-alpha frames, 704 continuous no-feet rows, 22 exact side
mirrors, exact Cast/Death aliases, approved Venom Idle delegation, Rajah tail
preservation, frozen evidence, external effects, and zero public exposure. The
candidate digest is
`81a087b81df560f7676024484114b550d02ce5c6424f040f4c1765f2231a4e77`.

Venom carries its violet mantle, jewel, crown, and sigil through the approved
planted Naga choreography; upward phases brace the tall crown at the one-cell
ceiling. Temple Rajah adds a crimson-and-gold crown, gilded pauldrons, ivory
chest plate, and royal sash jewel over the approved planted coil. The focused
and all three protected Naga gates pass; the v2 fast gate passes in `65s`, and
full `npm.cmd run check` passes in `153.2s` with all 232 public PNG sheets
unchanged. Both exact boards were opened in Aseprite and all four phases were
inspected in raw and Complete B + Form. Gate
`en-e04-venom-motion-rajah-idle-v1` is `approved` after the designer located
Rajah in the bottom `R IDLE` row and said
`oh right sorry i had to scroll down approved` on 2026-08-08. Bounded
publication is complete at `4fd887f0a174169d47f9f3bee3f98d92c2ffaf30`.

## Temple Rajah complete motion approved and published

Branch `codex/en-e04-rajah-motion` owns one internal, non-public, approved
80-frame Temple Rajah motion implementation committed and pushed at
`38b56f316a3fa12443b5b9fb003e74dc7e8059aa`. It is based exactly on clean
combined-slice handoff `c92ee12`. The eight approved Idle frames delegate byte-for-byte. Walk,
Attack, and Hurt inherit the approved planted Naga choreography while the tall
crimson-and-gold crown, broad gilded pauldrons, ivory chest plate, and royal
sash move through every phase. Cast aliases Attack exactly; Death aliases Hurt
as `H1,H2,H2,H2`. Merfolk, Birdfolk, registration, integration, effects,
release, and later work remain outside.

Run `npm.cmd run review:enemy-expansion-en-e04-rajah-motion` to reproduce paired
raw/no-outline and Complete B + Form `1428x760` boards plus paired labeled
`640x672`, four-phase GIFs. Run
`npm.cmd run check:enemy-expansion-en-e04-rajah-motion` to verify all 80
connected hard-alpha frames, 640 continuous no-feet rows, 20 exact side
mirrors, exact Cast/Death aliases, approved Rajah Idle delegation, approved
Naga tail preservation, frozen evidence, external effects, and zero public
exposure. The candidate digest is
`9f240fde4224597a94146448a698a57e573eebf966165fddbf2bd51c6d39fe2f`.

Gate `en-e04-temple-rajah-motion-v1` is `approved` after the designer reviewed
the exact raw and Complete B + Form GIF pair and said `approved, lets keep going
with slices like this,, maybe a full enemy with all its animations is a good
spot` on 2026-08-08. Focused, all four protected EN-E04 gates, and the v2
fast/full gates pass with all 232 public PNG sheets unchanged. Bounded
publication is complete at `38b56f316a3fa12443b5b9fb003e74dc7e8059aa`;
the same approval separately authorizes one complete enemy with all standard
animations as the next slice.

## Merfolk Tideguard full enemy approved and published

Branch `codex/en-e04-merfolk-tideguard` owns the resulting isolated full-enemy
slice. It is based exactly on clean Rajah handoff `b9e597fa` and contains one
internal, non-public common Merfolk Tideguard: 80 frames spanning Idle, Walk,
Attack, Cast, Hurt, and Death in all four directions. The silhouette replaces
ordinary legs and paired feet with one continuous scaled tail and one broad
connected fluke. Sea-green scales, dark-blue tide armor, coral knots, bronze
shell fittings, pale belly plates, finned ears, and a pearl highlight carry
through the full motion suite. Water bolts, tide arcs, bubbles, foam, splashes,
undertow rings, and impacts remain external.

Run `npm.cmd run review:enemy-expansion-en-e04-merfolk-tideguard` to reproduce
the paired raw/no-outline and Complete B + Form `1428x760` boards and labeled
`640x672`, four-phase GIFs. Run
`npm.cmd run check:enemy-expansion-en-e04-merfolk-tideguard` to verify the
exact 80-frame digest, 80 connected hard-alpha silhouettes, 640 continuous
fused-tail rows, 80 broad flukes, 20 exact side mirrors, exact Cast/Death
aliases, bounded presentation changes, external effects, and zero public
exposure. The frozen digest is
`a0ebbb04e5d9a47959be09231fe2ac37e8c5ec0ec278d6434b1732d712eaac90`.
All five protected predecessor gates, the fast gate, and full
`npm.cmd run check` pass with all 232 public PNG sheets unchanged.

Gate `en-e04-merfolk-tideguard-full-v1` is `approved`: the designer reviewed
the exact raw plus Complete B + Form GIF pair together and said `approved` on
2026-08-09. Bounded publication of the exact ten-file lane is complete at
`622b00f0c40eed552f61b30bd207b5ad8478836e`. Merfolk specialist/elite,
Birdfolk, registration, integration, effects, release, and broader multi-enemy
work remain outside.

## Merfolk Reefcaller full specialist approved and published

Branch `codex/en-e04-merfolk-reefcaller` owns the next isolated full-enemy
slice, based exactly on clean Tideguard handoff `6594b2e`. It contains one
internal, non-public Merfolk specialist: Reefcaller, with all 80 standard
Idle/Walk/Attack/Cast/Hurt/Death frames across four directions. Every frame
delegates approved Tideguard motion and preserves tail rows 16-23 exactly.
A connected coral crown, violet reef mantle, pearl sigil, gold shell clasps,
and luminous aqua fin marks distinguish the specialist. All 36 colored side
frames retain both visible eye pixels in coral red (`72/72` eye pixels), while
all healing, reef, bubble, coral-growth, and water effects remain external.

Run `npm.cmd run review:enemy-expansion-en-e04-merfolk-reefcaller` to
reproduce paired raw/no-outline and Complete B + Form `1428x760` boards and
labeled `640x672`, four-phase GIFs. Run
`npm.cmd run check:enemy-expansion-en-e04-merfolk-reefcaller` to verify the
frozen 80-frame digest, 80 connected hard-alpha silhouettes, 640 continuous
tail rows, 80 approved Tideguard tail locks, 20 exact side mirrors, exact
Cast/Death aliases, both coral-red side eyes in 36/36 colored side frames,
bounded presentation changes, external effects, and zero public exposure. The
frozen digest is
`fc223d0b944152c18481acfe4a775936b5da5659666edb0d35726eef5c6228f7`.
All six protected predecessor gates, the fast gate, and full
`npm.cmd run check` pass with all 232 public PNG sheets unchanged.

Gate `en-e04-merfolk-reefcaller-full-v1` is `approved`: after requiring both
visible side-eye pixels to be coral-red, the designer reviewed the final exact
raw plus Complete B + Form pair and said `approved` on 2026-08-09. Bounded
publication of this exact ten-file lane is complete at
`b315a32aa48d8881efe23e9d5b8553e6c0fb6b79`. Merfolk elite, Birdfolk,
registration, integration, effects, release, and broader work remain outside.

## Merfolk Pearl Regent full elite approved and published

Branch `codex/en-e04-merfolk-pearl-regent` owns the next isolated full-enemy
slice, based exactly on clean Reefcaller handoff `e54807b`. It contains one
internal, non-public Merfolk elite: Pearl Regent, with all 80 standard
Idle/Walk/Attack/Cast/Hurt/Death frames across four directions. Every frame
delegates approved Reefcaller motion and preserves tail rows 16-23 exactly.
A connected pearl-and-gold diadem, broad shell pauldrons, deep-crimson royal
mantle, nacre breastplate, luminous aqua regalia marks, and twin coral-red side
eyes distinguish the elite while all royal tide effects remain external.

Run `npm.cmd run review:enemy-expansion-en-e04-merfolk-pearl-regent` to
reproduce paired raw/no-outline and Complete B + Form `1428x760` boards and
labeled `640x672`, four-phase GIFs. Run
`npm.cmd run check:enemy-expansion-en-e04-merfolk-pearl-regent` to verify the
frozen 80-frame digest, 80 connected hard-alpha silhouettes, 640 continuous
tail rows, 80 approved Reefcaller tail locks, 20 exact side mirrors, exact
Cast/Death aliases, both red side-eye pixels in 36/36 colored side frames,
bounded presentation changes, external effects, and zero public exposure. The
frozen digest is
`30f2e8e40db3fc39b60351c350d58e841a4f2a87d7f57e914ea86a60375cd0b6`.
All seven protected predecessor gates, the fast gate, and full
`npm.cmd run check` pass with all 232 public PNG sheets unchanged.

Gate `en-e04-merfolk-pearl-regent-full-v1` is `approved`: the designer reviewed
the exact hash-frozen raw plus Complete B + Form GIF pair with both visible
side-eye pixels coral-red and said `approved` on 2026-08-09. Bounded
publication of this exact ten-file lane is complete at
`ef0ab54b73718b62f8db99f601020f7ef14090f8`. Birdfolk, additional Merfolk
variants, registration, integration, effects, release, and broader work remain
outside.

## Birdfolk Aerie Scout full common approved and published

Branch `codex/en-e04-birdfolk-aerie-scout` owns the next isolated full-enemy
slice, based exactly on clean Pearl Regent handoff `3a5ff4f`. Because the live
plan defines Birdfolk anatomy without pre-naming its roles, this lane names and
contains one internal, non-public common: Aerie Scout, with all 80 standard
Idle/Walk/Attack/Cast/Hurt/Death frames across four directions.

Aerie Scout is an upright avian person rather than an exposed-human Harpy: a
beaked crested head, shoulder-rooted wing-arms, slate-and-cream plumage, rust
flight-feather tips, bronze harness, teal sash, two digitigrade talon legs, and
a connected tail fan remain one silhouette in every frame. All wind, feather,
dust, dive, gust, air-blade, and impact effects remain external.

Run `npm.cmd run review:enemy-expansion-en-e04-birdfolk-aerie-scout` to
reproduce paired raw/no-outline and Complete B + Form `1428x760` boards and
labeled `640x672`, four-phase GIFs. Run
`npm.cmd run check:enemy-expansion-en-e04-birdfolk-aerie-scout` to verify the
frozen 80-frame digest, connected hard-alpha anatomy, one-cell margins, exact
side mirrors and aliases, readable crest/wing-arm/talon/tail identity, 36/36
colored side-eye frames, 18/18 eye-free colored rear frames, external effects,
and zero public exposure. The frozen digest is
`afff790c5f60684561752ff7fe9f8f4312c5b46679477cc88d29764379ca41c8`.
The focused gate and all eight protected predecessors pass. The final
post-reconciliation v2 fast gate passes in `54.5s`; full `npm.cmd run check`
passes in `106.3s`, with all 232 public PNG sheets unchanged.

Gate `en-e04-birdfolk-aerie-scout-full-v1` is `approved`: the designer reviewed
the exact hash-frozen raw plus Complete B + Form GIF pair and said `very good
approved` on 2026-08-09. After the requested Codex/MCP restart, both exact
`1428x760` boards were opened successfully through Aseprite MCP and the designer
said `ok lets keep going`. Bounded commit/push of this exact ten-file lane is
complete at `a0910312e510ee57b603ee981a279c1f372d6fad` on the tracked origin
branch. Birdfolk specialist/elite roles, additional variants, registration,
integration, effects, release, and broader work remain outside.

## Birdfolk Gale Augur full specialist approved and published

Branch `codex/en-e04-birdfolk-gale-augur` owns the next isolated full-enemy
slice, based exactly on clean Aerie Scout handoff `60df011`. Because the live
plan did not pre-name the Birdfolk specialist, this lane names and contains one
internal, non-public Gale Augur with all 80 standard
Idle/Walk/Attack/Cast/Hurt/Death frames across four directions.

Gale Augur preserves every approved Aerie Scout alpha footprint and the full
upright avian motion suite, then remaps the plumage to indigo/midnight and adds
a connected storm cowl, shoulder mantle, silver circlet and forewing bands,
cyan sky rune, and ice-blue eyes. All wind glyphs, omen rings, feather spirals,
pressure waves, lightning, dust, air blades, and impacts remain external.

Run `npm.cmd run review:enemy-expansion-en-e04-birdfolk-gale-augur` to
reproduce paired raw/no-outline and Complete B + Form `1428x760` boards and
labeled `640x672`, four-phase GIFs. Run
`npm.cmd run check:enemy-expansion-en-e04-birdfolk-gale-augur` to verify the
frozen 80-frame digest, approved-source alpha locks, connected hard-alpha
anatomy, one-cell margins, exact mirrors and aliases, 72/72 colored specialist
identity frames, 36/36 colored side-eye frames, 18/18 eye-free colored rear
frames, external effects, and zero public exposure. The frozen digest is
`4495c4f91c77f411a7b0639ac68e3b8bf94318632d0191f0034a4373f32de9d4`.
Focused validation and all nine protected predecessor gates pass. The final
post-reconciliation v2 fast gate passes in `49.3s`; full `npm.cmd run check`
passes in `98.0s`, with all 232 public PNG sheets unchanged.

Gate `en-e04-birdfolk-gale-augur-full-v1` is `approved`: the designer reviewed
the exact hash-frozen raw plus Complete B + Form GIF pair and said `awesome
looks good approved` on 2026-08-09. Bounded commit/push of this exact ten-file
lane is complete at `ad57f25d47415625540ea36ff16d2a884a421576` on the
tracked origin branch. Birdfolk elite, additional variants, registration,
integration, effects, release, and broader work remain outside.

## EN-E04 nine-enemy stable registration implemented

Branch `codex/en-e04-registration` composes the nine approved EN-E04 enemies
into three stable families without changing their reviewed pixels. Naga,
Merfolk, and Birdfolk each retain common, specialist, and elite variants through
one family-local dispatcher in `engine/enemy-expansion-en-e04.js`. The bounded
registration checkpoint is published at `6f228fb`.

Run `npm.cmd run check:enemy-expansion-en-e04-registration` to exhaust all nine
native `480x96` sheets and 720 candidate/registered frames. The frozen aggregate
digest is `137d044a55dd41d612a8b41958029e41ef39fb75ccf58de9b46d6c4328c91459`.
At the registration checkpoint, the stable registry was 13 families / 39
variants while the separately gated consumer registry remained the repaired
EN-E01/EN-E02 ten-family boundary. That firewall was historical to `6f228fb`;
the later authorized assembler integration below now exposes the same exact
13-family / 39-variant registry.

## EN-E04 assembler consumer integration implemented

Branch `codex/en-e04-assembler-integration` activates gate
`en-e04-assembler-consumers-v1`. At that checkpoint,
`ENEMY_EXPANSION_CONSUMER_REGISTRY` aliased the exact 13-family stable registry,
so the generic public catalog became 70 families / 241 variants and added Naga,
Merfolk, and Birdfolk without family-specific editor or export branches.
Selectors, sanitization, persistence, randomization,
thumbnails, full/animation/direction sheets, ordinary packs, Complete Kits and
Packs, Wildshot validation, None/Complete B/Selective C outlines, and Form
shading all consume the same public facade.

Run `npm.cmd run check:enemy-expansion-en-e04-consumers` to exhaust all 720
public dispatcher frames, nine complete native sheets, the direction,
animation, thumbnail, pack, Kit, and Wildshot routes, plus the exact approved
aggregate digest
`137d044a55dd41d612a8b41958029e41ef39fb75ccf58de9b46d6c4328c91459`.
The gate records 67,440 Complete B additions, 64,380 Form-changed source pixels,
2,178 Complete Kit PNGs, and all nine EN-E04 Wildshot specs accepted. The public
render bridge suppresses only a renderer's full-frame reset and forwards
deliberate regional clears, preserving the approved Merfolk and Temple Rajah
lower-body pixels during generic assembled rendering. The frozen 232-sheet
legacy `asset-pack/` remains unchanged.
The bounded implementation is committed and pushed at `cedc774` on
`codex/en-e04-assembler-integration`.

The EN-E05 stable-registration checkpoint deliberately separated the
boundaries again: assembler consumers stayed on the exact 13-family /
39-variant EN-E04 registry while stable registration advanced independently to
17/43. The later consumer checkpoint below closes only that separation.

## EN-E05 stable registration checkpoint

Branch `codex/en-e05-registration`, based exactly on clean Lich handoff
`c0e438b`, activates `en-e05-five-undead-registration-v1`. It registers the
exact approved Mummy Tomb Walker, Vampire Night Noble, Revenant Grave
Oathkeeper, and Lich Soul Regent as four stable one-variant families. The
approved Ghoul upgrade is recorded separately as an internal replacement record
targeting legacy `zombie/ghoul`; it is not exposed as a duplicate public family.

Run `npm.cmd run check:enemy-expansion-en-e05-registration` to validate five
complete 80-frame sheets, all 400 candidate/registered parity frames, and all
320 new-family frames through the composed stable registry. The frozen
aggregate digest is
`732c6097b237131e85bdf435112c2bed7ec1f8bf8317dee4e42605f0c1730d32`.
At that checkpoint, stable expansion state became 17 families / 43 variants,
while the assembler consumer registry remained 13/39 and the generic public
catalog remained 70/241.
Public `zombie/ghoul`, its 80-frame pixels, Zombie siblings, and the frozen
Ghoul fixture SHA-256
`a6f69caac95fad855db65ae787ceac0e9333f9013ee3882a13b6ccab57a7edc2`
remain exact. Fast validation passes in `51.6s`; full validation passes in
`101.2s`; all 232 frozen PNG fixtures remain unchanged. The implementation is
committed and pushed at `7d273ef`.

That registration checkpoint excluded assembler consumers. The separate gate
below later exposes only the four new families; at that point public Ghoul
replacement, fixture work, effects, release, EN-E03 adoption, and Wave 2 were
still closed.

## EN-E06 approved Fairies, Mire Crone, and Cauldron Hexer

Approved common Fairy Bramblewing Scout and specialist Thistle Hexer remain
internal, non-public, exact, and published at `cc92ca9` and `3dc68cb`. After
Thistle publication, the designer said `lets do next`, opening only one complete
  elite Petalcrown Duelist lane. The active branch is
`codex/en-e06-fairy-petalcrown-duelist`, based exactly on clean published
  Thistle reconciliation `581bff9`. Petalcrown is technically validated,
  internal, and non-public. Its exact hash-frozen review surfaces were opened
  directly in Aseprite, and the designer approved the three PNG boards plus
  paired GIFs on 2026-08-09. The bounded implementation is published at
  `b265e97`.

The approved compact Bramblewing Fairy has plum hair, pointed ears, a leaf-green dress, gold
fasteners, and paired pale-mint open-lattice wings. The wings are connected
body parts, and every frame remains visibly above the ground. Binary alpha is
exact: translucent wing character comes from opaque rims and veins surrounding
transparent negative-space windows, never partial-alpha membrane pixels. Glow,
pollen, sparkles, trails, and impact light remain external effects. Thistle
Hexer instead has rose skin, dark-violet hair, a tall green-and-lilac thorn
crown, a long violet robe, narrow folded thistle wings, bronze fasteners, and
an attached thorn focus. Every one of its 80 pixel frames and alpha silhouettes
differs from Bramblewing. Curse motes, projectiles, thorn trails, impact flashes,
and summoned briars remain external effects. Petalcrown is a wider, denser
elite with dark-teal hair, rose petal armor, a broad pale-pink crown-wing
mantle, green leaf joints, gold clasps, and one connected silver-blue petal
rapier. All 80 pixel frames and alpha silhouettes differ from Thistle and again
from Bramblewing. Dash trails, petal motes, wind arcs, detached blade glints,
impact flashes, and detached petals remain external.

Run `npm.cmd run review:enemy-expansion-en-e06-fairy-petalcrown-duelist` to
reproduce its exact raw/no-outline and Complete B + Form `1428x760` boards,
`1192x548` three-Fairy comparison board, and paired `640x672` four-phase GIFs.
Run `npm.cmd run check:enemy-expansion-en-e06-fairy-petalcrown-duelist` to
validate all 80 frames, binary alpha, connected ground-clear silhouettes,
crown-wing negative space, exact mirrors and aliases, two-way predecessor distinction,
deterministic hashes, and the public/fixture firewall. Raw / Complete B + Form
board hashes are
`74b6b4935ef9708c13396104d80589f67c9de5b189f44dac5c455ea33c45c7cc` /
`784cfcd2041c8851491ebf38112b48b03d45d48715199907923950022b6f00ff`;
comparison hash is
`693a6fcdf88a96be3e6d14b55cd65286eb71aa1015934b5b2fef02272cc40b42`;
raw / Complete B + Form GIF hashes are
`e98a5427e67d7abc15467cb630634ce57b63f3f6541aa0abb3bc73c19bd673c6` /
`f11e102b7846f3d3ee2b47f1c56493493906fd6e0364046d8ae5964ea8c5ba10`;
candidate digest is
`69de53e0b10aa80ef10afa7e3e8b6a9d913af81a365535f52e3f4be71945bd5c`.

Petalcrown focused validation passes 80/80 connected, bounded, ground-clear
frames at opaque range 193-236, with 6,266 Complete B additions and 9,279 Form
changes. All 80 pixel frames and alpha silhouettes differ from both approved
Fairies; 72/72 colored frames and 8/8 white alias flashes pass. Approved
Bramblewing full/Idle and Thistle full gates remain exact. Protected EN-E05
consumers at that historical source checkpoint remained 74/245 and 320/320; candidate-state fast validation passes in
`50.4s`, full validation passes in `106.2s`, and all 232 fixtures remain
unchanged. Petalcrown was subsequently approved and published at `b265e97`.

After that publication, the designer said `lets do nextr`, opening only the
common Hag Mire Crone on `codex/en-e06-hag-mire-crone`. The private candidate
uses moss skin, amber eyes, rope-gray hair, a hooked nose, long claws, mud-dark
shawl, bowed torso, and planted splayed feet. It has no staff, hat, robe,
familiar, or cauldron, and all 80 pixel frames and alpha silhouettes differ
from public Witch/Hexer. Hexes, charms, fumes, familiars, auras, trails, and
impact flashes remain external.

Run `npm.cmd run review:enemy-expansion-en-e06-hag-mire-crone` to reproduce the
raw/no-outline and Complete B + Form `1428x760` boards, `910x548` Witch
comparison, and paired `640x672` GIFs. Run
`npm.cmd run check:enemy-expansion-en-e06-hag-mire-crone` to validate all 80
frames, connected grounded hard-alpha silhouettes, exact mirrors and aliases,
Witch distinction, approved-Fairy preservation, frozen hashes, and the public
and fixture firewall. Candidate digest:
`f35512e73fd7b2308bf408f11c2d21a30631361214a372df7bef2e8fc4e6478d`.
The exact boards and GIFs were approved on 2026-08-09 and the bounded
implementation is published at `25f67d4`. Do not begin another Hag, Dryad,
registration, fixtures, effects, or later Wave 2 work without a separate gate.

The subsequent `next` opens only specialist Hag Cauldron Hexer on
`codex/en-e06-hag-cauldron-hexer`. It adds a connected copper hooked ladle,
luminous bottle belt, teal brewer apron, plum shawl, moss-gold skin, and
charcoal rope hair while keeping the cauldron, fumes, thrown brews, liquid arcs,
projectiles, and other effects external. Run
`npm.cmd run review:enemy-expansion-en-e06-hag-cauldron-hexer` for its exact
three boards and paired GIFs, and run
`npm.cmd run check:enemy-expansion-en-e06-hag-cauldron-hexer` for the complete
80-frame structural, Mire-distinction, predecessor, public, and fixture gates.
Candidate digest: `17f40220730fe4e83be26156d73e0599235be66a9290284b37cb9c8282c7a1a6`.
The exact packet was approved on 2026-08-09 and the bounded implementation is
published at `4b59b40`. The approval reply also opens only the next one-sprite
Blackthorn Matron lane; Dryad, registration, fixtures, effects, and broader
Wave 2 work remain closed.

That authorized elite lane now exists only on
`codex/en-e06-hag-blackthorn-matron`. It adds a body-connected asymmetrical
blackthorn crown, broad briar pauldrons, plated shawl mass, ember eyes, and
reinforced bone claws while detached thorns, briar trails, curse motes, and
other effects remain external. Run
`npm.cmd run review:enemy-expansion-en-e06-hag-blackthorn-matron` for the raw,
Complete B + Form, three-Hag comparison boards and paired GIFs; run
`npm.cmd run check:enemy-expansion-en-e06-hag-blackthorn-matron` for all 80
frames, both approved-Hag distinctions, predecessor preservation, and public
and fixture firewalls. Candidate digest:
`d4588d754e01dbb4916949f27b801342a310706890a0532a0133216d7cb0c7a9`.
The exact boards and paired GIFs were visually approved on 2026-08-09 and the
bounded implementation is published at `8ce2f2a`. Do not register Hag,
regenerate fixtures, or add effects without a separate continuation. The later
`cool next please` opened only common Dryad Grove Tender on
`codex/en-e06-dryad-grove-tender`.

Grove Tender is a slim ordinary-height living-wood fey with a connected leaf
mantle, narrow heartwood torso, sapwood joints, blossoms, root hems, and one
visibly forked branch arm. It remains distinct from the broad public Treant and
upright against the stooped Hag. Run
`npm.cmd run review:enemy-expansion-en-e06-dryad-grove-tender` for the raw,
Complete B + Form, Treant/Blackthorn/Grove comparison boards and paired GIFs;
run `npm.cmd run check:enemy-expansion-en-e06-dryad-grove-tender` for all 80
frames, comparison distinctions, approved-lane preservation, and public and
fixture firewalls. Approved implementation digest:
`18fedaf06c457c8a280b3c5518b0763be48de3b3cb5bd29113f0fd5d183e3a21`.
The exact boards and GIFs were visually approved on 2026-08-09 and the bounded
implementation is recorded at `3d96fed`, with published approval handoff
`4c49f27`.

Spore Cantor is a slim specialist Dryad with a connected violet fungal crown,
pale gill collar, teal mycelium, asymmetric shelf fungi, connected fruiting
bodies, and a canting branch attack. Run
`npm.cmd run review:enemy-expansion-en-e06-dryad-spore-cantor` for the raw,
Complete B + Form, and Treant/Grove/Spore comparison boards plus paired GIFs;
run `npm.cmd run check:enemy-expansion-en-e06-dryad-spore-cantor` for all 80
frames, predecessor preservation, and public/fixture firewalls. Approved suite
digest: `b22585e7b055f4ae43eb1293741967c1d76ec9bd3b842320880f2038c0cf62ef`.
The exact raw and Complete B + Form presentations were visually approved on
2026-08-09. Implementation `46d1dc9` and approval record `61d1fa4` are
published. Spore clouds and motes remain external; Dryad registration, fixture
regeneration, Heartwood Warden, effects, and broader Wave 2 work were not
authorized by that approval. The designer's later `hey lets keep going with the
80 enemies plan` opens the separate Heartwood Warden gate below.

Heartwood Warden is the dense elite Dryad: an ordinary-height living-wood fey
with connected branch pauldrons, a ringed heartwood breastplate, short crown
prongs, reinforced root greaves, and one visibly forking warding arm. Protective
auras, sap glow, bark shards, detached leaves, acorns, vines, root eruptions,
shield blooms, summoned plants, trails, projectiles, impacts, and ground cracks
remain external. Run
`npm.cmd run review:enemy-expansion-en-e06-dryad-heartwood-warden` for the raw,
Complete B + Form, four-way Treant/Grove/Spore/Heartwood comparison board, and
paired GIFs; run
`npm.cmd run check:enemy-expansion-en-e06-dryad-heartwood-warden` for all 80
frames, approved-source preservation, and the public/fixture firewall. The
focused gate passes 80/80 connected, bounded, grounded frames and 80/80 pixel
plus alpha distinctions from all three comparison actors at candidate digest
`fb7b50a0fefda66995c5e81f3e07c0c080893902a33d304066e79fb8181cd97c`.
The exact packet was visually approved on 2026-08-09. Its frozen implementation
`8a790e3f0d02cf64763733f83d17890c79ce83fc` and approval record
`d8c13bb008e3a186daa73a37eec87c707f30365f` are committed and pushed on the
tracked branch. The later `cool lets do next` opens only the private common
Redcap Barrow Stalker candidate below.

Barrow Stalker is a very short broad grave-ambusher with an oversized drooping
blood-red cap, long fey ears, a compact brown coat, connected hooked hand bill,
and massive planted iron boots. Blood spray, ground chips, weapon trails, trap
markers, snare lines, grave dust, impact flashes, and detached hook glints
remain external. Run
`npm.cmd run review:enemy-expansion-en-e06-redcap-barrow-stalker` for the raw,
Complete B + Form, Goblin Scout/Hobgoblin/Mire/Barrow comparison, and paired
GIFs; run `npm.cmd run check:enemy-expansion-en-e06-redcap-barrow-stalker` for
the 80-frame structural, distinction, predecessor, artifact, and public/
fixture firewalls. The focused gate passes at digest
`1719f8611f212cfbacf041fc8459d3f52390b05aa73e0a1d50203554845051f1`.
The exact packet was visually approved on 2026-08-10. Its frozen implementation
`c3544dc4ec06e06afb15ea699333119342a8946f` and approval record
`8e2054236a49ab06b7cac404cda8b12bb440085c` are committed and pushed on the
tracked branch. At that published checkpoint Ironboot Trapper, Bloodcap Reaver,
Nymph, EN-E07, registration changes, fixtures, effects, and release remained
closed.

The separately authorized Ironboot Trapper specialist is a short broad Redcap
with a flat riveted rust-red cap, long ears, moss coat, asymmetric buckle
harness, leather apron, connected trap-setting tongs, and enormous square iron
boots. Placed traps, trap markers, snares, chains, blood, trails, chips, dust,
flashes, and detached glints remain external. Run
`npm.cmd run review:enemy-expansion-en-e06-redcap-ironboot-trapper` for the raw,
Complete B + Form, Goblin Scout/Hobgoblin/Barrow/Ironboot comparison, and paired
GIFs; run `npm.cmd run check:enemy-expansion-en-e06-redcap-ironboot-trapper` for
the 80-frame structural, distinction, predecessor, artifact, and public/fixture
firewalls. The focused gate passes at digest
`31c37fd25d688bd295c2fb84bdb437141149cf43986b6edcc4141467bc32bdf1`.
The exact packet was opened together in Aseprite and visually approved on
2026-08-10. Its frozen implementation is committed at
`98865936244b94860985210fcaf9a044b0ca228a`, and approval record
`00a9876f963522c88b9cd77f809bec3674d72b19` is committed and pushed on the
tracked branch. At that published checkpoint Bloodcap Reaver, Nymph, EN-E07,
registration changes, fixtures, effects, and release remained closed.

The separately authorized Bloodcap Reaver elite is the final private Redcap
role: a short heavy raider with a high torn blood-crimson cap, long ears,
layered blackened-steel shoulder and chest armor, reinforced boots, and a
connected broad cleaver. Blood, trails, chips, dust, flashes, and detached
glints remain external. Run
`npm.cmd run review:enemy-expansion-en-e06-redcap-bloodcap-reaver` for the raw,
Complete B + Form, Hobgoblin/Barrow/Ironboot/Reaver comparison, and paired GIFs;
run `npm.cmd run check:enemy-expansion-en-e06-redcap-bloodcap-reaver` for the
80-frame structural, four-actor distinction, predecessor, artifact, and public/
fixture firewalls. The focused gate passes at digest
`e9a41fd37e19d96911cfffee3bd89e3859f9cbb95099996632f877da2dbdabff`,
with 80/80 connected, bounded, grounded frames, 72/72 colored identity frames,
8/8 exact white flashes, and opaque range 300-338. The exact five-artifact
packet was opened together in Aseprite and visually approved on 2026-08-10. The
frozen implementation `1a1ba00ea1edfa6e8bd946e95f5e35c6080ce73a` and approval
record `5c55af26481f9a79988382df3d67b8ff33b765a4` are committed and pushed on the
tracked branch. No subsequent art gate is active; Nymph, EN-E07, registration
changes, fixtures, effects, and release remained closed until the separately
authorized Spring Dancer gate below.

The separately authorized Spring Dancer is the first private Nymph: a slender
humanoid fey with flowing willow hair, pointed ears, a leaf-fastened spring
dress, connected rose ribbon hem, and light dance steps. Petals, mist, water
ribbons, sparkles, and detached trails remain external. Run
`npm.cmd run review:enemy-expansion-en-e06-nymph-spring-dancer` for the raw,
Complete B + Form, Elf/Fairy/Grove/Dancer comparison, and paired GIFs; run
`npm.cmd run check:enemy-expansion-en-e06-nymph-spring-dancer` for the 80-frame
structural and firewall gate. It passes at digest
`b68906d962e16611384e419610324c6a9934d63ab329963f0734e83255dabe8c`,
with 80/80 connected, bounded, grounded frames and 72/72 colored identity
frames. The exact packet was opened together in Aseprite and visually approved
on 2026-08-10. Frozen implementation
`9d6366b0c5456704137aadfbbec9a67eccb5fd7c` and approval record
`eae49376fd7bc4dd315168cb2989293de4a73f55` are committed and pushed on the
tracked branch. It remains private. No registration, later Nymph, fixture,
effect, release, or EN-E07 work was opened by that publication.

The separately authorized Mist Weaver is the private specialist Nymph: a
slender veiled fey with a crescent cowl, horizontal face veil, broad layered
mantle, connected bell sleeves, woven sash, silver clasps, and grounded divided
robe. Mist, fog, water arcs, ripples, particles, and detached trails remain
external. Run `npm.cmd run review:enemy-expansion-en-e06-nymph-mist-weaver` for
the raw, Complete B + Form, Elf/Dancer/Spore/Mist comparison, and paired GIFs;
run `npm.cmd run check:enemy-expansion-en-e06-nymph-mist-weaver` for its 80-frame
structural and firewall gate. It passes at digest
`e57a0af441f895fe376f2696d859a97d84564ddf034235d3b237b2cf637520da`,
with 80/80 connected, bounded, grounded frames and 72/72 colored identity
frames. The exact packet was opened together in Aseprite and visually approved
on 2026-08-10. Frozen implementation
`682f99a581e70ee1c985257e0c122d75c7add6f9` and approval record
`07a673df462cdb651673fd042fb92965da624faf` are committed and pushed on the
tracked branch. It remains private. No registration, Rivercrown Muse, fixture,
effect, release, or EN-E07 work is open.

The separately authorized Rivercrown Muse is the private elite Nymph: a tall,
light fey with a vertical three-point diadem, clear hair-framed face, long
asymmetric river hair, open shoulders, pearl collar, diagonal violet sash,
ceremonial sleeves, flared blue-green gown, and visible split-foot sandals.
Water, foam, currents, ripples, glow, particles, and detached trails remain
external. Run `npm.cmd run review:enemy-expansion-en-e06-nymph-rivercrown-muse`
for the raw, Complete B + Form, Elf/Dancer/Mist/Muse comparison, and paired GIFs;
run `npm.cmd run check:enemy-expansion-en-e06-nymph-rivercrown-muse` for its
80-frame structural and firewall gate. It passes at digest
`4917d42fd0b480e4c2635ba4c96725e6b68afec1075dacb8acee2f70dc886bcd`,
with 80/80 connected, bounded, grounded frames and 72/72 colored identity
frames. The exact packet was opened together in Aseprite and visually approved
on 2026-08-10. Frozen implementation
`39bd0658d53acbfe7aa4484e14f6518551720142` and approval record
`ca82f079ff84934edc4ab51a8d406050b9083d2a` are committed and pushed on the
tracked branch. It remains private. No registration, fixture, effect, release,
or EN-E07 work was opened by that approval alone.

The designer's later `lets do next` advances the frozen plan to exactly one
private common EN-E07 Living Shadow Gloam Walker on
`codex/en-e07-living-shadow-gloam-walker`. It uses a chunky dark-violet ramp,
connected hollow face and torso negative space, angular shoulders, long
connected claws, a pinched waist, clearly split legs, and broad planted feet;
detached wisps, pools, smoke, afterimages, projectiles, claw trails, glow, and
impacts remain external. Run
`npm.cmd run review:enemy-expansion-en-e07-living-shadow-gloam-walker` for the
raw, Complete B + Form, Ghost/Slime/Mist/Gloam comparison, and paired GIFs; run
`npm.cmd run check:enemy-expansion-en-e07-living-shadow-gloam-walker` for the
80-frame structural, style, predecessor, artifact, and public/fixture
firewalls. The frozen candidate digest is
`131a95a106a36dea2f6879611c8e14e3aa077012dcbd1bd32e111c45658ca3f9`:
80/80 frames are connected, bounded, grounded, and pixel/alpha distinct from
Cursed Ghost, Shadow Slime, and Mist Weaver; 72/72 colored frames preserve the
four-part style ramp; 8/8 flashes are exact white; opaque range is 208-242.
The exact five-artifact packet is technically reproducible, was opened in
Aseprite, and was approved when the designer replied `aaprovced` on 2026-08-10.
Implementation `a46f59c1cb0bb751760f2776fe60b5c489806c94` and approval record
`848c7192b6dc2cac8b7ab2dc8725d3859447715d` plus initial handoff
`00d5b436c7398312a5f3a05a482b4cf34cee9ba5` are committed and pushed.
Rivercrown docs reconciliation `d785fe5` is pushed too. Living Shadow is not
registered, fixture-backed, or public;
that approval alone did not open later Living Shadow roles, remaining EN-E07
families, effects, release, or EN-E08.

The designer's subsequent `lets do next` opens exactly one private specialist
Living Shadow Nightglass Seer on
`codex/en-e07-living-shadow-nightglass-seer`, based on clean published Gloam
reconciliation `98d3781b81c8c7ff615ad3cd6562efe12ce63d94`. The same chunky
violet-black family ramp now carries a broad faceted mask, one vertical eye,
connected shoulder yoke, squared sight-frame forearms, a narrow transparent
chest aperture, bent split legs, and planted wedge feet. Eye beams, gaze cones,
portals, runes, floor sigils, glow, afterimages, loose shards, trails,
projectiles, and impacts remain external. Run
`npm.cmd run review:enemy-expansion-en-e07-living-shadow-nightglass-seer` for
the raw, Complete B + Form, Ghost/Slime/Mist/Gloam/Seer comparison, and paired
GIFs; run
`npm.cmd run check:enemy-expansion-en-e07-living-shadow-nightglass-seer` for
its focused structural, style, predecessor, artifact, and exposure firewalls.
The frozen candidate digest is
`07909fa9b74df6dd386ca3f6186fe4da26e8d088af99ad7e2dfa2bcdeb10d3fa`:
80/80 frames are connected, bounded, grounded, and pixel/alpha distinct from
Cursed Ghost, Shadow Slime, Mist Weaver, and Gloam Walker; 72/72 colored frames
preserve the family ramp; 8/8 flashes are exact white; opaque range is 228-265.
The exact five-artifact packet reproduces byte-for-byte and was visually
approved when the designer replied `approved lets do next`. Implementation
`325a6f4cfa1418383c93510262a631358add1d5f` and approval record
`d50f3af5da0578edf66a5b2f156744c576427b9c` plus initial handoff
`71d36ef48a55a7f1d49e1e6649a33eb945c9667c` are published. The protected 19-gate
matrix, fast suite, and full suite pass; the approved 1,200-frame integration
digest and all 232 fixtures remain exact. Only elite
Living Shadow opens. Registration, fixtures, effects, another EN-E07 family,
release, and EN-E08 remain closed.

That same `approved lets do next` response opens exactly one private elite
Living Shadow Hollowcrown Regent on
`codex/en-e07-living-shadow-hollowcrown-regent`, based on clean published
Nightglass reconciliation `46ad4e7759a1ef3a096ba326d96cdef44d1ee3b1`.
The approved chunky violet-black family ramp now carries a connected
three-prong crown, high angular mantle, paired narrow face slits, a transparent
diamond void-heart, command bracers, armored split legs, and broad throne-step
feet. Crown halos, eclipse rings, throne shapes, banners, void rays, portals,
floor seals, shadow doubles, detached mantle trails, glow, particles,
projectiles, and impacts remain external. Run
`npm.cmd run review:enemy-expansion-en-e07-living-shadow-hollowcrown-regent`
for the raw, Complete B + Form, Ghost/Slime/Mist/Gloam/Seer/Regent comparison,
and paired GIFs; run
`npm.cmd run check:enemy-expansion-en-e07-living-shadow-hollowcrown-regent`
for its focused structural, style, predecessor, artifact, and exposure
firewalls. The frozen candidate digest is
`657e4071ab8432387f7c8b6ecff8650f3f7a63bf7dc8f4b68564373a5e450991`:
80/80 frames are connected, bounded, grounded, and pixel/alpha distinct from
Cursed Ghost, Shadow Slime, Mist Weaver, Gloam Walker, and Nightglass Seer;
72/72 colored frames preserve the family ramp; 8/8 flashes are exact white;
opaque range is 244-283. The exact five-artifact packet reproduces
byte-for-byte. The protected 20-gate matrix, fast suite, and full suite pass;
the approved 1,200-frame integration digest and all 232 fixtures remain exact.
The exact packet was opened in Aseprite and visually approved when the designer
replied `approved lets do next`. Implementation
`ffe5f574ab9f06ecfaad83c50a7980254eea7211` and approval record
`90a06bd34e1bae29becdc380b01895825cf4a969` plus initial handoff
`0c3d671bee3013413291170e127d3820cdcaff95` are published and remote verified.
Only one private common Doppelganger candidate opens from the clean publication
reconciliation. Registration, fixtures, effects, other EN-E07 family artwork,
release, and EN-E08 remain closed.

That response opens exactly one private common Doppelganger Pale Echo on
`codex/en-e07-doppelganger-pale-echo`, based on clean published Hollowcrown
reconciliation `6ff54c3a926436083675ec8f7e2d0230cc073ac5`. The assembler
authors a neutral default form rather than copying a player or public enemy:
pale gray-rose skin, uneven charcoal-violet fringe, offset paired eyes,
mismatched shoulders, split slate/wine short tunic, one ordinary hand, one
connected long-finger mimic hand, separated legs, and grounded boots. The
initial diagnostic packet was rejected before freeze for excessive 218-271
opaque-pixel bulk; the repaired public-humanoid-scale candidate is 186-245.
Copied silhouettes, mirror doubles, reflection planes, peeling faces, loose
skin ribbons, afterimages, glow, particles, projectiles, and impacts remain
external. Run
`npm.cmd run review:enemy-expansion-en-e07-doppelganger-pale-echo` for the raw,
Complete B + Form, Bandit/Cultist/Dark Elf/Pale Echo comparison, and paired
GIFs; run `npm.cmd run check:enemy-expansion-en-e07-doppelganger-pale-echo` for
its focused structural, scale, predecessor, artifact, and exposure firewalls.
The frozen candidate digest is
`c3fa12cb4bb0be432e955adfc32f331286e55c65cbd7a38250bdf0d120fa6596`:
80/80 frames are connected, bounded, grounded, and pixel/alpha distinct from
all three public comparisons; 72/72 colored frames preserve its palette; 8/8
flashes are exact white. The exact five-artifact packet reproduces
byte-for-byte. The protected 21-gate matrix, fast suite, and full suite pass;
the approved 1,200-frame integration digest and all 232 fixtures remain exact.
The three exact repaired PNGs were opened together in Aseprite, both GIFs were
presented, and the designer replied `approved lets do next`. Implementation
`0628135b84725836c552e13db797540a965854cb` and approval record
`182938381ac39812434518d0216e6e9796367bbb` plus initial handoff
`1e6e8d8bb01de97ca4e1373b62b461e40b1aa239` are published and remote
verified. The same response opens only one private specialist Doppelganger
candidate from the clean publication reconciliation. Registration, fixtures,
runtime copying, effects, the elite and later families, release, and EN-E08
remain closed.

## Approved enemy backlog integration published

Branch `codex/approved-enemy-assembler-integration` composes three explicit
lanes without changing reviewed sprite pixels: all eight completed EN-E06
suites, the six completed full EN-E03 suites, and the approved Ghoul Upgrade as
the public `zombie/ghoul` renderer. The stable and consumer expansion registries
are the same 23 families / 57 variants; legacy remains 57/202; the merged
public catalog is 80/259. Boulder Hurler, Storm-Clan Jarl, and Sun Lancer remain
internal Idle-only evidence, and Heartwood Warden, Redcap, Nymph, EN-E07,
effects, fixture regeneration, and release remain outside this gate.

`npm run check:approved-enemy-assembler-integration` exhausts 15 suites / 1,200
source-parity frames and 1,200 None/Complete B/Form presentation triplets. The
frozen integration digest is
`74953d1b8531be86bf3f551b15fc70aa4ff142d954763ad4183eb36e06fd6497`.
The standalone Complete Kit is 2,196 PNGs and the 24-player Complete Pack
maximum is 2,219 PNGs. The committed 232-file legacy fixture pack remains
untouched; its `zombie-ghoul.png` intentionally stays the historical sprite
until a separate fixture-regeneration approval. Source and documentation are
committed and pushed at `90ac018923fbaa9906cd47cdc9ef22f0db77336a`.

## EN-E05 assembler consumer integration implemented

Branch `codex/en-e05-assembler-integration`, based exactly on clean published
registration handoff `59a6941`, activates
`en-e05-assembler-consumers-v1` at implementation `773cfad`. The designer's
`cool lets do next` authorizes generic assembler integration only for exact
`mummy/tomb-walker`, `vampire/night-noble`,
`revenant/grave-oathkeeper`, and `lich/soul-regent`.

Run `npm.cmd run check:enemy-expansion-en-e05-consumers` to prove the stable
and consumer expansion registries are the same exact 17 families / 43 variants,
legacy remains 57/202, and `PUBLIC_ENEMIES` is 74 families / 245 variants. The
gate exhausts all 320 new public dispatcher frames, four native sheets,
direction/animation/thumbnail exports, selectors, persistence, randomization,
ordinary packs, Complete Kit, and all four Wildshot specs without adding
family-specific routes. Frozen consumer digest:
`947cec4df921761cd5eba378991d7a35b3d773d7e5c0e7c80526ecc6a846a46f`.
Complete B adds 29,795 pixels and Form changes 27,338 source pixels across the
320 cases. Complete Kit is 74 families / 245 enemy sheets / 2,182 total PNGs.

Public `zombie/ghoul` retains exact object and 80-frame pixel identity, the
frozen Ghoul fixture remains SHA-256
`a6f69caac95fad855db65ae787ceac0e9333f9013ee3882a13b6ccab57a7edc2`,
and all 232 committed PNG fixtures remain untouched. Fast validation passes in
`52.7s`; full validation passes in `103.1s`. This integration needs no new
visual approval because it reuses exact approved and registered pixels. At
that checkpoint public Ghoul replacement, fixture generation, regeneration or
acceptance, effects, release, EN-E03 adoption, and Wave 2 still required later
explicit authorization. Wave 2 was subsequently opened through the bounded
  EN-E06 Fairy lane. Approved Bramblewing Scout and Thistle Hexer are now followed
  by the approved internal Petalcrown Duelist lane above.

## EN-E05 Lich Soul Regent full-suite approved internal lane

Branch `codex/en-e05-lich` contains one visually approved isolated elite Lich
named Soul Regent, based exactly on reconciled Revenant handoff `97db37e`. It
remains internal and non-public. The sprite uses a jagged reliquary crown,
exposed skull mask, wide ritual mantle,
cold ivory bone, deep violet split robes, teal lining, oxidized gold, mint
oathfire eyes, a sea-green soul gem, and one connected ritual staff. Soul
flame, orbiting runes, spectral chains, projectiles, aura rings, teleport
afterimages, grave fog, staff trails, impacts, floating pages, and detached
robe wisps remain external.

Run `npm.cmd run review:enemy-expansion-en-e05-lich` to reproduce the exact
approved-Revenant comparison, raw/no-outline and Complete B + Form `1428x760`
full-suite boards, and paired `640x672` four-phase GIFs. Run
`npm.cmd run check:enemy-expansion-en-e05-lich` to exhaust all 80 frames,
approved-Revenant distinction, connected hard-alpha anatomy, one-cell margins,
directional eyes, mirrors, aliases, motion phases, presentation treatment, and
public/fixture firewalls. Candidate digest:
`236afeccc237ba347a8f4929ac5743d3275abf60defb86d2705f39475bde2a01`.
Raw / Complete B + Form board hashes are
`d1b59e29d6881c2556a786cd0c4bd8017c34a5076a6b687798cef6cd7045519e` /
`137c89638cb4d23de02de5fe7f72b8fddddf8cdad1f707d91812a79686e928b6`;
the Revenant comparison is
`c9ead47d3bf489ed0cc4af38e8c75d5eacf74c75f3628876fa70901e9d755fa9`;
raw / Complete B + Form GIF hashes are
`0a851b281dc3a59bd888000dac8f4389d3a0b7ea9163df7157d64b94a23d11bf` /
`3d72223b59b9ec670809bca358b5d8f697e49d75315c0daf91b0da4526d10280`.
The protected Revenant, Vampire, Mummy, Ghoul, and EN-E04 gates pass; fast
validation passes in `52.4s` and full validation passes in `104.7s`, with
the public 70/241 catalog and all 232 fixtures unchanged. After requesting that
the repeated square lower-robe panels be replaced with tapered folds, the
designer reviewed the regenerated exact comparison and paired labeled surfaces
and replied `approved` on 2026-08-09. That lane authorized only bounded
publication of the hash-frozen internal candidate. The later separate
registration checkpoint above now registers its exact pixels stable-only;
consumer exposure, fixture generation, Wave 2, effects, and broader work remain
excluded. The exact approved Lich implementation is committed and pushed at
`4cebc7b`.

## EN-E05 Revenant Grave Oathkeeper full-suite approved internal lane

Branch `codex/en-e05-revenant` contains one visually approved isolated common
Revenant named Grave Oathkeeper, based exactly on reconciled Vampire handoff
`16f5876`. It remains internal and non-public. The sprite uses a split-crested dented helm,
broad mismatched pauldrons, battered cold-blue plate, exposed corpse-gray
hands, a faded oath-red tabard, old rust, brass fasteners, cyan oathfire eyes,
heavy boots, and a connected broken greatblade. Soul flame, grave mist,
spectral chains, rune glow, trails, sparks, dust, blood, afterimages, ground
cracks, and detached debris remain external.

Run `npm.cmd run review:enemy-expansion-en-e05-revenant` to reproduce the exact
approved-Vampire comparison, raw/no-outline and Complete B + Form `1428x760`
full-suite boards, and paired `640x672` four-phase GIFs. Run
`npm.cmd run check:enemy-expansion-en-e05-revenant` to exhaust all 80 frames,
approved-Vampire distinction, connected hard-alpha anatomy, one-cell margins,
directional eyes, mirrors, aliases, motion phases, presentation treatment, and
public/fixture firewalls. Candidate digest:
`f53fa853e7fb7aebc232e3ca1903d8a4d1d717de02576c51fe81f4c4d5b90079`.
Raw / Complete B + Form board hashes are
`010fc811c0495406025a6f3efd4e6f97393f9e6e0ccc64e92ce8dcd610063afe` /
`037ffb153c64f2542f42377ec70222947149d2d46205605728f3004dc41eb3c6`;
the Vampire comparison is
`ba4debce379e44e6d7c5d5e865a3cf06f029efafba4bdf928174c111d2294d96`;
raw / Complete B + Form GIF hashes are
`41154eb09cd907b1fd128673dcc9baff5f947990641f2c1a42010fa7ac6f7920` /
`58d05f0640b94b3e55c5b16d92e785d4637a24664bec3f7a004e364e3b5c860a`.
The protected Vampire, Mummy, Ghoul, and EN-E04 gates pass; fast validation
passes in `46.6s` and full validation passes in `98s`, with the public 70/241
catalog and all 232 fixtures unchanged. After the exact approved-Vampire
comparison and paired labeled review surfaces were presented together, the
designer replied `awesome very good approved` on 2026-08-09. This authorizes
only bounded publication of the hash-frozen internal lane. Revenant
registration, fixtures, Lich, and broader EN-E05 work remain excluded. The
exact approved implementation is committed and pushed at `7434578`.

## EN-E05 Vampire Night Noble full-suite approved internal lane

Branch `codex/en-e05-vampire` contains one visually approved isolated common
Vampire named Night Noble, based exactly on reconciled Mummy handoff `3387bf2`.
It remains internal and non-public. The sprite uses an upright widow-peaked head,
connected wing collar, black-violet coat and cape, blood-crimson lining,
ivory formal shirt, antique-gold clasp, pallid claw hands, ember-red eyes,
split tailcoat, and long booted legs. Bats, blood, charm motes, shadow mist,
afterimages, auras, projectiles, impacts, and ground fog remain external.

Run `npm.cmd run review:enemy-expansion-en-e05-vampire` to reproduce the exact
approved-Mummy comparison, raw/no-outline and Complete B + Form `1428x760`
full-suite boards, and paired `640x672` four-phase GIFs. Run
`npm.cmd run check:enemy-expansion-en-e05-vampire` to exhaust all 80 frames,
approved-Mummy distinction, connected hard-alpha anatomy, one-cell margins,
directional eyes, mirrors, aliases, motion phases, presentation treatment, and
public/fixture firewalls. Candidate digest:
`b3943802e450e454d707f118a58fb81cdf43b3869d02da999b7232d8a0aab4ba`.
Raw / Complete B + Form board hashes are
`25a6944fa51889c6a09735ef47530a31591610b3c4ef4260aa88318d42d6239e` /
`02bb524d6ef49a52026037a7f5ef1faf66d0f987c7e792c3b0599d7eb79776d0`;
the Mummy comparison is
`2862b5d4601eaef873a723100f5b462db1d6d0714fdf61b974bb2bc1b3c4fcb8`;
raw / Complete B + Form GIF hashes are
`7075df50690e8a00ed5f599a4b28f9095d5f010708d2dff269b9d4b5ed691101` /
`d7c01c725c8d91896791bbe3a0144f597f27827e4f856824023f4dfcd0f69b22`.
The protected Mummy, Ghoul, and EN-E04 gates pass; fast validation passes in
`52.5s` and full validation passes in `102.6s`, with the public 70/241 catalog
and all 232 fixtures unchanged.
After the exact approved-Mummy comparison and paired labeled review surfaces
were presented together, the designer replied `approved` on 2026-08-09. This
authorizes only bounded publication of the hash-frozen internal lane. Vampire
registration, fixtures, Revenant, Lich, and broader EN-E05 work remain excluded.
The exact approved implementation is committed and pushed at `6a7cce2`.

## EN-E05 Mummy Tomb Walker full-suite approved internal lane

Branch `codex/en-e05-mummy` contains one visually approved isolated common
Mummy named Tomb Walker, based exactly on the published Ghoul handoff
`1aa733c`. It remains internal and non-public. The sprite uses a coffin-stiff wrapped head,
asymmetric bound arms, a narrow linen waist and connected torn skirt, dragging
block feet, parchment/sepia wrappings, embalmed umber gaps, aged-gold bindings,
and turquoise curse eyes. Sand, curse wisps, detached ribbons, scarabs, dust,
impacts, glyphs, and auras remain external.

Run `npm.cmd run review:enemy-expansion-en-e05-mummy` to reproduce the exact
approved-Ghoul comparison, raw/no-outline and Complete B + Form `1428x760`
full-suite boards, and paired `640x672` four-phase GIFs. Run
`npm.cmd run check:enemy-expansion-en-e05-mummy` to exhaust all 80 frames,
approved-Ghoul distinction, connected hard-alpha anatomy, one-cell margins,
directional eyes, mirrors, aliases, motion phases, presentation treatment, and
public/fixture firewalls. Candidate digest:
`321c5c7f05a55a6502b03d3876521c3b799c8156c2197efc3833c4af68a556fd`.
Raw / Complete B + Form board hashes are
`6d652c60c88c8b892eaf6c6f70db03c1f1642f2df8ba35aa2a68c2b1645d891f` /
`67e36714906f6898381e74504b2e97ac2873e76828adc30b9b683ac0493aad3a`;
the Ghoul comparison is
`0ccf489dfa662e9d61f9d2adc19d5de342ccedff12d37a6fd99cfd0e629c2ab4`;
raw / Complete B + Form GIF hashes are
`df6e0a9319e510049f6e6fa11f267cbd42980fb45a3f8c1147c95a869e3fd194` /
`72279b6d39630d67264a901e9835013ba99470af3c139296ac28d56c68440b04`.
The protected Ghoul and EN-E04 gates pass; fast validation passes in `55.4s`
and full validation passes in `107.2s`, with the public 70/241 catalog and all
232 fixtures unchanged.
After the exact comparison and paired review surfaces were presented, the
designer replied `lets do nextg` on 2026-08-09; in its direct context this is
recorded as approval plus authorization to publish Mummy before beginning one
separate Vampire candidate. Mummy registration, fixtures, and broader EN-E05
work remain excluded from this lane. The exact approved implementation is
committed and pushed at `85f1ed7`.

## EN-E05 Ghoul full-suite upgrade approved internal lane

Branch `codex/en-e05-ghoul-upgrade` contains one visually approved isolated
replacement candidate
for existing `zombie/ghoul`. It does not add a second Ghoul family and does not
change the current public catalog, legacy renderer, Zombie siblings, or frozen
fixture. The candidate replaces the generic dagger humanoid read with a
weaponless hunched corpse predator: long connected claw arms, a hooked side
jaw, exposed rear spine and bone, torn grave leathers, ash-green flesh,
corpse-yellow eyes, and a four-step stalking gait.

Run `npm.cmd run review:enemy-expansion-en-e05-ghoul-upgrade` to reproduce the
exact `910x548` before/after board, paired raw/no-outline and Complete B + Form
`1428x760` full-suite boards, and paired `640x672` four-phase GIFs. Run
`npm.cmd run check:enemy-expansion-en-e05-ghoul-upgrade` to exhaust all 80
frames, exact side mirrors and aliases, connected hard-alpha anatomy, one-cell
margins, identity colors, legacy/public isolation, Zombie sibling locks, Form
and Complete B treatment, and artifact hashes. The approved frame digest is
`9f24d575dd7685afd0ca6411f23d6de2b05f90634ef9802d431881d046394477`.
The protected EN-E04 gate, fast project gate, and full `npm.cmd run check` all
pass with the public 70/241 catalog and 232 frozen fixtures unchanged.
After the exact before/after plus labeled all-four-direction raw/no-outline and
Complete B + Form evidence was presented together, the designer said
`approved` on 2026-08-09. That approval authorizes bounded publication of this
isolated lane only. The exact implementation is committed and pushed at
`88d32e9`. Replacing public `zombie/ghoul`, regenerating any fixture, or
starting Mummy requires a later explicit gate.

## Birdfolk Stormcrown Exarch full elite approved and published

Branch `codex/en-e04-birdfolk-stormcrown-exarch` owns the next isolated
full-enemy slice, based exactly on clean Gale Augur handoff `aaf59df`. Because
the live plan did not pre-name the Birdfolk elite, this lane names and contains
one internal, non-public Stormcrown Exarch with all 80 standard
Idle/Walk/Attack/Cast/Hurt/Death frames across four directions.

Stormcrown Exarch preserves every approved Gale Augur alpha footprint and the
full upright avian motion suite, then remaps the specialist into iron-slate and
near-black plumage beneath a crimson royal mantle, connected gold three-point
storm crown and brow guard, armored forewing bands, cyan lightning sigil, and
white-blue eyes. Lightning coronas, thunder halos, storm arcs, pressure waves,
feather spirals, dust, air blades, and impacts remain external.

Run `npm.cmd run review:enemy-expansion-en-e04-birdfolk-stormcrown-exarch` to
reproduce paired raw/no-outline and Complete B + Form `1428x760` boards and
labeled `640x672`, four-phase GIFs. Run
`npm.cmd run check:enemy-expansion-en-e04-birdfolk-stormcrown-exarch` to verify
the frozen 80-frame digest, approved-source alpha locks, connected hard-alpha
anatomy, one-cell margins, exact mirrors and aliases, 72/72 colored elite
identity frames, 36/36 colored side-eye frames, 18/18 eye-free colored rear
frames, external effects, and zero public exposure. The frozen digest is
`9e7a7c5e29e1918bf1078bcd4823680ff4243beeaa2e90b8d27689d0c3af9fa1`.
Focused validation and all ten protected predecessor gates pass. The v2 fast
gate passes in `50.4s`; full `npm.cmd run check` passes in `103.0s`, with all
232 public PNG sheets unchanged.

Gate `en-e04-birdfolk-stormcrown-exarch-full-v1` is `approved`: after reviewing
the exact raw plus Complete B + Form GIF pair, the designer said `sure lets do
123` on 2026-08-09. Bounded publication is complete at `da8c089` on the
tracked origin branch. One complete EN-E04 registration checkpoint and one
assembler consumer-integration checkpoint are separately authorized to follow.
Additional Birdfolk variants, effects, release, and broader work remain outside.

The complete enemy-outline rollout was visually approved at historical
12-column checkpoint `ac860aa` on `codex/enemy-outlines`. That checkpoint
covered 9,696 source frames / 29,088 None-B-C cases with zero source-edge
frames and zero out-of-bounds writes. The current public 20-column
Idle/Walk/Attack/Cast/Hurt/Death contract extends the same approved lane to
16,160 source frames / 48,480 None-B-C cases.
The cumulative EN-E01/EN-E02 presentation gate adds 2,400 raw source frames /
7,200 None-B-C outline cases. The designer accepted both live consumer
presentations and the later seven-family repair. The accepted repaired aggregate
adds 207,356 Complete B and 163,843 Selective C contour pixels, records 175,878
source-owned Form changes, and preserves 145,528 protected pixels without
changing the raw registry contract. EN-E03 uses the same presentation
algorithms only inside its isolated review evidence and has not entered the
public boundary. The approved Hill Breaker F1/F2 and Steppe Hunter F1/F2 Idle
boards use those same presentation algorithms in separate internal registries.
The approved Briar Reveler F1 seed and approved F1/F2 Idle baseline are isolated
in two Satyr-only registries.

The optional shared assembled-sprite shade pass in
[docs/archive/SHADE_RENDERING_PLAN.md](docs/archive/SHADE_RENDERING_PLAN.md) has an explicitly approved
Form algorithm and approved live-editor integration. Shared pixel
buffers, immutable shade modes, normalization, and one assembled-output
coordinator apply the deterministic material-aware treatment to complete
players and enemies. Protected dark features, exact white, tiny accents, floor
shadows, effects, approved outlines, contact separators, generic thumbnails,
and atomic component sheets remain untreated. Form is the default for new and
reset Player/Enemy editor documents; None remains the engine compatibility mode
and the fallback for versioned legacy artwork.
Approved expansion variants participate through their nested renderer palette
ramps. The cumulative consumer gate exercises 7,200 Form/outline combinations,
changes 174,917 source-owned pixels, preserves 146,687 protected pixels, and
resolves all 180 published EN-E01/EN-E02 palette colors without accepting a new
visual baseline.

The Player/Enemy selector now participates in history, comparisons, presets,
ordinary packs, previews, assembled sheets, and export recipes; it is hidden in
Effects mode. Missing or invalid shade fields migrate to None. The earlier enemy
outline preset/ordinary-pack persistence gap remains repaired. The integrated
editor surface was visually approved on 2026-07-26. The safe shade checkpoint
does not accept new fixtures or baselines and does not rebuild executables.
Combat Loadout overlays are now disabled by default and return to Off whenever
the editor starts. They remain available as an explicit preview toggle, but the
optional legacy preview still draws effects after the complete character and
can look cluttered or overwrite foreground details. Its final occlusion rule is
on ice as a separate deferred integration problem and is explicitly excluded
from approved shade work. See [HANDOFF.md](HANDOFF.md) for the exact
continuation state.

The first fresh Phase 5 content slice adds the visually approved Lantern as a
separate non-shield `offhand` option. Selecting it clears the shield slot;
selecting a shield clears it; malformed specifications preserve the shield.
The field participates in randomization, history, comparisons, presets,
ordinary packs, equipment batches, compatible class packs, assembled exports,
and Complete Kit recipes. Presets are now v12, ordinary packs v3, Equipment
Variant Batch and Class Pack v3, Master Character Kit/Roster Kit v2, and
Complete Character Kit/Pack v12. Legacy specifications safely default to no
utility off-hand. Effects remain Off, only shields resolve shield-block
behavior, and no fixture, baseline, or release artifact changed.

Production Roll v1 is approved and integrated beside the renamed Wildcard
Roll. Production uses a portable seed stream, selects one of the ten existing
class archetypes, keeps one coherent equipment tier and fixed catalog palette
family, normalizes hidden identity choices, and enforces a bounded silhouette
budget. The result is still an ordinary editable player specification:
presets, packs, batches, class packs, kits, and exports store the resolved
character without its seed or audit trail. Production applies Form shading and
Effects Off in one undoable action while preserving the current outline;
Wildcard retains the former unrestricted `randomPlayer()` behavior.

After a Production Roll, supported Player categories expose a secondary `C`
button that selects only Production-compatible alternatives under the known
class, power-tier, and palette-family context. The existing arrow remains an
unrestricted Wildcard reroll. Armor's compatible action changes equipped
armor, weapon, and shield tiers as one coherent power-tier choice; unsupported
or coupled categories do not receive misleading controls. Context is
history-only and never enters presets, packs, recipes, exports, or schemas. If
no compatible alternative exists, the editor reports that result without
changing the player.

The Bosses tab is a deliberately isolated game-test surface for twelve
approved 48x48 direction pilots plus repaired quadruped Rhino and Eclipse
Unicorn Sovereign direction candidates. Ten pilots—Ancient Mirejaw, Bone Reliquary
King, Scorpion Empress, Cyclops Forge-Titan, Pit-Fiend Juggernaut, Goblin
War-Crown, Cruel Catgirl Templar of the Brutes, Divine Armored Templar Astro
Knight, Furious Depraved Rhino, and Gunslinger Boar Rider—also expose the full
20-column animation contract, playback/frame inspection, and native
full/direction/animation downloads. Lava-Core Colossus, Abyssal Crown-Kraken,
and Sun-Crown Griffin remain approved static four-direction fallbacks. Eclipse
Unicorn Sovereign is a static four-direction candidate. Goblin
War-Crown, Furious Depraved Rhino, and Gunslinger Boar Rider remain animation
visual candidates; the Rhino's repaired direction controls also await visual
approval. The repaired catgirl-templar and Astro Knight animations are
accepted. Boss selection, direction, animation, frame, and speed are
ephemeral: they do not enter current-document persistence, history, presets,
Production/Wildcard rolls, ordinary packs, Complete Kits, game-pack exports,
effects, or the 24x24 procedural renderer.

## Preview controls

- `Space` plays or pauses the selected animation.
- `[` and `]` inspect the previous or next frame and pause playback.
- Arrow keys change direction without changing the inspected frame.
- `Cycle all` resumes playback and visits every animation and direction.

## Compare variants

1. Select **Duplicate** to preserve the current sprite as copy A.
2. Keep editing the live sprite, then select **Compare** to inspect A and B on the same animation frame.
3. Keep the current version, restore the saved copy as one undoable edit, or replace/remove the saved copy.

The saved comparison copy stays on the current device until it is replaced or removed.

## Run it on Windows

Double-click `start-dev.bat`. It starts the local development server and opens the assembler in your default browser.

Node.js 18 or newer is required for development. Run `npm install` once before using the native Tauri workflow.

You can also run it from a terminal:

```powershell
npm run dev:open
```

Keep the terminal window open while using the assembler. Press `Ctrl+C` to stop the server.

To build and preview the exact production files:

```powershell
npm run build
npm run preview
```

## Validate the project

Double-click `check-project.bat`, or run:

```powershell
npm run check
```

On the approved Hill Breaker, Steppe Hunter Attack, and Briar Reveler Attack
branches, the full command passes when the complete local Boss
review-checkpoint corpus is present. A fresh worktree lacks 965 ignored
checkpoint PNGs and stops only in the Boss direction and animation subprocesses;
copying only those missing ignored files from the preserved corpus brings the
temporary worktree to 1,064 PNGs and makes the full gate pass.
`codex/clean-clone-check` at `125b0b3` is a separately preserved, explicitly
unvalidated fix candidate; it is not part of the active EN-E03 lane. See
`HANDOFF.md` for the exact 2026-08-06 evidence.

Run `npm run check:enemy-expansion` for the focused EN-F00 gate. It locks all
57 legacy families / 202 sheets / 16,160 frames to their synchronized-main
pixel digest, checks the 22-slice/80-proposal ledger, exercises deterministic
family/slice review targeting and renderer-key dispatch, and proves malformed
registrations or completed sheets are rejected without exposing planned
families as shipped content.

Run `npm run check:enemy-expansion-en-e01` for the private 40-frame EN-E01
approved-Idle evidence gate. Run `npm run review:enemy-expansion-en-e01` to
regenerate its exact ignored review PNG and JSON under
`enemy-expansion-review/en-e01/`. This frozen baseline-only lane proves the
approved common pixels remain deterministic, with four-direction geometry,
two-frame Idle motion, one-cell margins, hard alpha, distinct silhouettes,
absent clipping, and zero public-family exposure.

Run `npm run check:enemy-expansion-en-e02-consumers` for the protected
EN-E01/EN-E02 consumer matrix. The historical EN-E01 command intentionally
reaches the same matrix. It proves the 57/202 legacy catalog is unchanged, the
current immutable public catalog is 80/259, and all 2,400 EN-E01/EN-E02
dispatcher/editor frames and all 30 native full sheets still match the approved
registry in raw/None mode. It also
exhausts 7,200 None/B/C outline cases and 7,200 Form-with-outline cases while
checking deterministic shading, all 180 expansion palette colors, protected
features, source ownership, and unchanged outline geometry.

Run `npm run check:enemy-expansion-en-e04-consumers` for the historical EN-E04
consumer slice within the current public boundary. It proves generic selectors,
persistence, randomization,
thumbnails, all export scopes, Complete Kits, combat defaults, and Wildshot
validation accept Naga, Merfolk, and Birdfolk; checks public parity for all 720
EN-E04 frames and nine native sheets; and locks the 80/259 catalog, 2,196-file
Complete Kit, outline/Form metrics, and approved aggregate digest.

Run `npm run check:enemy-expansion-en-e05-consumers` for the historical EN-E05
consumer slice within the current public boundary. It proves the exact four EN-E05 new families remain generic
across selectors, persistence, randomization, dispatcher and export routes,
Complete Kit, and Wildshot; exhausts all 320 public frames; and locks the
23/57 stable/consumer registry, 80/259 public catalog, 2,196-file Complete Kit,
outline/Form metrics, unchanged public Ghoul, and unchanged fixtures.

Run `npm run check:approved-enemy-assembler-integration` for the current
integration boundary. It verifies the exact six completed EN-E03 suites, all
eight approved EN-E06 suites, and the EN-E05 Ghoul replacement across 1,200
source-parity frames and 1,200 None/Complete B/Form presentation triplets. It
also proves the three EN-E03 Idle-only variants remain excluded, no duplicate
Ghoul family enters selectors, all other Zombie pixels remain legacy-exact,
the frozen Ghoul fixture is unchanged, Complete Kit is 80/259/2,196, and all
15 integrated specs pass Wildshot manifest validation.

Run `npm run check:enemy-expansion-en-e01-full` for the complete private
candidate gate and `npm run review:enemy-expansion-en-e01-full` for the ignored
overview, five family motion boards, 15 native `480x96` sheets, and JSON review
manifest under `enemy-expansion-review/en-e01-full/`. The full gate exhausts
all 1,200 frames, validates each complete sheet, checks deterministic motion
and direction reads, proves Cast/Death alias pixels, preserves the approved
Idle digest, and preserves the exact reviewed pre-registration candidate.

Run `npm run check:enemy-expansion-en-e01-registration` for the approved public
boundary. It verifies the immutable completed-slice approval record, five
approved families, 15 variants, the current seven-approved/zero-implemented/
fifteen-planned ledger, stable-facade routing, 15 complete sheets, and pixel
parity for every one of the 1,200 candidate/public frames while keeping the
legacy catalog unchanged.

Run `npm run check:enemy-expansion-en-e02` for the authorized common-baseline
gate and `npm run review:enemy-expansion-en-e02` to regenerate its exact ignored
PNG/JSON under `enemy-expansion-review/en-e02/`. The gate covers five internal
common variants with 40 approved Idle frames, four-direction ordering, hard alpha,
one-cell margins, deterministic rendering, distinct silhouettes, mirrored side
occupancy, and zero EN-E02 consumer exposure from the frozen Idle snapshot.

Run `npm run check:enemy-expansion-en-e02-full` for the separately authorized
private production gate and `npm run review:enemy-expansion-en-e02-full` to
regenerate its ignored overview, five family motion boards, 15 native sheets,
the Complete B/Form presentation board, and JSON manifest under
`enemy-expansion-review/en-e02-full/`. The full gate
proves 15 variants / 1,200 deterministic frames, complete standard motion,
Cast-to-Attack and Death-to-Hurt aliases, hard alpha, one-cell margins, distinct
family-variant silhouettes, exact approved-Idle preservation, 2,400 private
Complete B/Selective C cases, 3,600 private Form-with-outline cases, and zero
consumer exposure in its frozen candidate snapshot.

Run `npm run check:enemy-expansion-en-e02-registration` for the approved
registration boundary. It locks the exact overview, Complete B/Form
presentation, review manifest, reviewed implementation commit, Idle digest, and
full 1,200-frame digest; proves candidate/registered parity across all 15
`480x96` sheets; composes the ten-family / 30-variant approved registry; and at
its historical consumer checkpoint exposed those two slices at 67 families /
232 variants. The current head additionally composes separately authorized
EN-E03 through EN-E06, so `PUBLIC_ENEMIES` is now 80/259. Effects and release
remain separate gates. Only the six completed EN-E03 suites are adopted; its
rejected studies and three Idle-only variants remain internal evidence.

The default registration command is clean-clone safe because the review bundle
is intentionally ignored. When the local review bundle is present it re-hashes
all three files; use
`npm run check:enemy-expansion-en-e02-registration:artifacts` to require those
files and fail if any are absent. Clone-safety checkpoint `be44af7` proves the
default mode passes in a fresh detached worktree while strict mode rejects the
missing ignored artifacts.

Run `npm run check:enemy-expansion-repairs` to validate the exact approved
seven-family renderer-data delta, pre-repair comparison boundary, Walk contact
motion, hard alpha, margins, clipping, and reported seam coordinates.

Run `npm run check:enemy-expansion-en-e03` for the isolated Giant, Centaur, and
Satyr common-only Idle evidence. It validates three immutable contract cards, 24
deterministic frames, one connected silhouette per frame, exact side mirroring,
binary alpha, one-cell margins, Complete B/Form behavior, rejection of non-Idle
or unimplemented variants, and zero public EN-E03 families. Run
`npm run review:enemy-expansion-en-e03` to reproduce the exact ignored raw and
Complete B + Form boards beneath `enemy-expansion-review/en-e03/`. Passing this
gate proves reproducibility and isolation only; both rendered art attempts are
visually rejected.

Run `npm run check:enemy-expansion-en-e03-calibration` and
`npm run review:enemy-expansion-en-e03-calibration` to reproduce the exact
visually approved Hill Breaker F1 seed. Run
`npm run check:enemy-expansion-en-e03-giant-idle` and
`npm run review:enemy-expansion-en-e03-giant-idle` for the approved F1/F2 gate.
That check preserves all four approved F1 frames and their planted contact rows,
validates four approved F2 frames, and keeps Giant absent from public consumers.
Run `npm run check:enemy-expansion-en-e03-giant-walk` and
`npm run review:enemy-expansion-en-e03-giant-walk` for the approved, internal
Hill Breaker Walk baseline. The checker validates 16
connected hard-alpha frames, three distinct foot-contact silhouettes per
direction with only W2/W4 shared, exact delegation of all eight approved Idle
frames, frozen PNG/digest values, and zero public exposure. Passing it proves
structure and reproducibility; the separate gate metadata records the direct
2026-08-06 designer approval.
Run `npm run check:enemy-expansion-en-e03-giant-attack` and
`npm run review:enemy-expansion-en-e03-giant-attack` for the approved internal
Hill Breaker Attack baseline. The checker preserves all 8 approved Idle and 16
approved Walk frames byte-for-byte, validates 16 connected hard-alpha Attack
poses with distinct silhouettes, planted contacts and one-cell margins, freezes
the exact raw/Complete B + Form boards and frame digest, requires at least three
torso-and-hip motion phases per direction, proves that the approved shared
humanoid renderer remains unchanged, requires at least three Down/Up hip-and-
upper-leg phases with exact foot anchors, and keeps Giant absent from public
consumers. Passing proves structure and reproducibility; separate gate metadata
records the exact labeled four-direction raw and Complete B + Form approval on
2026-08-07.
Run `npm run check:enemy-expansion-en-e03-giant-hurt` and
`npm run review:enemy-expansion-en-e03-giant-hurt` for the approved internal
Hill Breaker Hurt H1-H2 baseline. The checker preserves all 8 approved Idle,
16 approved Walk, and 16 approved Attack frames byte-for-byte; validates eight
connected, distinct hard-alpha Hurt silhouettes with planted contact, one-cell
margins, exact side visual weight and exact Down/Up foot anchors; freezes the
raw/Complete B + Form boards, dual labeled GIFs, and eight-frame digest; and
keeps Giant absent from public consumers. H1 is the bright unified recoil and
H2 the colored braced recovery. Passing proves structure and reproducibility,
while gate metadata records direct approval of both exact all-four-direction
GIFs together on 2026-08-07.
Run `npm run check:enemy-expansion-en-e03-centaur-calibration` and
`npm run review:enemy-expansion-en-e03-centaur-calibration` for the approved
Steppe Hunter F1 seed. Its checker requires four connected hybrid
silhouettes, four separated hoof contacts per direction, exact mirrored side
profiles, one-cell margins, and zero public exposure. Run
`npm run check:enemy-expansion-en-e03-centaur-idle` and
`npm run review:enemy-expansion-en-e03-centaur-idle` for the approved F1/F2
baseline. That checker preserves all four approved F1 frames, validates the
four approved F2 poses with exact planted contact rows, requires eight connected
four-hoof silhouettes, and keeps Centaur absent from public consumers. Run
`npm run check:enemy-expansion-en-e03-centaur-walk` and
`npm run review:enemy-expansion-en-e03-centaur-walk` for the approved, internal
Steppe Hunter Walk baseline. The checker validates 16
connected hard-alpha hybrid frames, two planted hoof contacts, three distinct
hoof-contact silhouettes per direction with only W2/W4 shared, exact side
mirroring, exact delegation of all eight approved Idle frames, frozen
PNG/digest values, and zero public exposure. Passing it proves structure and
reproducibility; separate gate metadata records the designer's exact raw and
Complete B + Form animation approval on 2026-08-06. Run
`npm run check:enemy-expansion-en-e03-centaur-attack` and
`npm run review:enemy-expansion-en-e03-centaur-attack` for the approved internal
Steppe Hunter Attack baseline. The checker preserves all 8 approved Idle and
16 approved Walk frames byte-for-byte, validates 16 connected hard-alpha
horse-rider-spear silhouettes with planted contacts, four distinct poses and at
least three horse-body weight phases per direction, exact side mirroring, true
Down/Up attacks, one-cell margins, frozen evidence hashes, and zero facade or
public exposure. Passing proves structure and reproducibility; separate gate
metadata records the exact labeled Down, Left, Right, and Up raw/no-outline and
Complete B + Form approval on 2026-08-07. Run
`npm run check:enemy-expansion-en-e03-centaur-hurt` and
`npm run review:enemy-expansion-en-e03-centaur-hurt` for the approved internal
Steppe Hunter Hurt H1-H2 baseline. The checker preserves all 8 approved Idle,
16 approved Walk, and 16 approved Attack frames byte-for-byte; validates eight
connected, distinct hard-alpha horse-rider-spear silhouettes, fixed four-hoof
anchors, exact Left/Right mirroring, true Down/Up depth, one-cell margins,
frozen board/GIF hashes, Complete B/Form behavior, and zero facade/public
exposure. H1 is the full white hybrid recoil and H2 the colored braced spear
recovery. Passing is technical evidence only; both exact labeled
all-four-direction raw/no-outline and Complete B + Form GIFs were directly
approved together on 2026-08-07, as recorded by separate gate metadata. Run
`npm run check:enemy-expansion-en-e03-satyr-calibration` and
`npm run review:enemy-expansion-en-e03-satyr-calibration` for the Briar Reveler
F1 approved seed. Its checker requires four connected horned
digitigrade silhouettes, four split-hoof contact tips per direction, exact
mirrored side profiles, one-cell margins, Complete B/Form behavior, and zero
public exposure while freezing the exact approval evidence and artifact hashes.
Run `npm run check:enemy-expansion-en-e03-satyr-idle` and
`npm run review:enemy-expansion-en-e03-satyr-idle` for the approved F1/F2
baseline. That checker freezes the approval metadata and exact artifact hashes,
preserves all four approved F1 frames, validates the four approved F2 poses,
requires eight connected horned digitigrade silhouettes and four split-hoof
contact tips per frame, and keeps Satyr absent from public consumers.
Run `npm run check:enemy-expansion-en-e03-satyr-walk` and
`npm run review:enemy-expansion-en-e03-satyr-walk` for the approved internal
Briar Reveler Walk baseline. The checker validates 16 connected hard-alpha
horned frames, split-hoof contacts, three distinct contact/silhouette poses per
direction with only W2/W4 shared, exact side mirroring, exact delegation of all
eight approved Idle frames, the no-eye rear-head pixel in all four Up frames,
frozen PNG/digest values, and zero public exposure. Its gate metadata records
the corrected animation approval on 2026-08-06. Run
`npm run check:enemy-expansion-en-e03-satyr-attack` and
`npm run review:enemy-expansion-en-e03-satyr-attack` for the approved internal
Briar Reveler Attack baseline. It preserves all 8 approved Idle and 16
approved Walk frames byte-for-byte, validates 16 connected hard-alpha
body-and-staff silhouettes with planted split-hoof anchors, four distinct poses
per direction, exact side mirroring, distinct Down/Up depth, frozen board/GIF
hashes, and zero facade or public exposure. Passing proves structure and
reproducibility; its gate metadata separately freezes the direct designer
approval of both exact labeled all-four-direction raw and Complete B + Form
GIFs on 2026-08-07.

The validator checks JavaScript syntax, the engine-to-manifest contract, every referenced asset, unexpected PNG files, exact native export dimensions, character-pack ZIP structure, Master Character Kit coverage and layer order, the dimensions of all committed sheets, zero out-of-canvas writes across all 6,000 weapon animation cases, 12,800 shield cases across all four body builds, 320 Lantern utility-off-hand cases, and 880 equipped-headgear cases. The shade gate adds 480 broad player None-parity cases, all 16,160 enemy None-parity frames, 1,616 sampled enemy None/outline parity cases, 2,880 deterministic Form pilot cases, an exhaustive 16,160-frame enemy Form audit, 1,616 enemy Form/outline integration cases, and assembled full/direction/animation export forwarding checks. These cases verify source ownership, 164,685 protected pixels, unchanged outline/contact geometry, finite colors, floor-shadow parity, 158,872 visible Form changes, and 35,333 material-aware differences from a silhouette-only control without accepting a visual baseline.

The cumulative EN-E01/EN-E02 consumer extension adds exhaustive checks for all
2,400 approved raw frames, 7,200 outline cases, and 7,200 Form/outline cases. It
records 174,917 source-owned Form changes while preserving 146,687 protected
pixels and all added outline geometry.

The same command also audits 1,000 deterministic Production v1 seeds,
catalog/class freeze drift, invalid seeds, bounded retries and fallbacks,
ordinary-player copy safety, Wildcard compatibility, all ten classes, every
power tier and palette family, 80 deterministic assembled export frames, and
resolved-player compatibility with existing class, batch, Complete Kit,
preset, pack, and schema boundaries.

Run `npm run check:pack-publish` separately for the GitHub release-transport
safety harness. It proves clean-tree, pushed-HEAD, remote, authentication, tag,
and release-call behavior; it does not validate the frozen 13-Boss roster or
make that currently incompatible export command release-ready.

Run `npm run review:shades` to regenerate the ignored interactive Form pilot
beneath `shade-review/`. It compares untreated output, a silhouette-only
control, Form without outlines, Form with Complete B, and Form with Selective C
for 12 diverse specimens across all directions, animations, and frames on
dark and parchment review backgrounds, with parchment selected by default.
Effects stay Off. The algorithm is approved, but the generated review remains
evidence rather than a committed baseline.

Run `npm run review:offhands` to regenerate the ignored Lantern integration
review beneath `offhand-review/`. It covers three representative bearers,
every direction, animation, and frame, None/Complete B/Selective C outlines,
approved Form shading, exact back/body/front recomposition, shield precedence,
and absent-field parity. The Lantern art was visually approved on 2026-07-26;
the review remains evidence rather than a committed baseline.

Run `npm run review:production-rolls` to regenerate the ignored balanced
Production-versus-Wildcard review beneath `production-roll-review/`. It
contains 120 fixed Production results and 120 Wildcard controls, with 12
Production seeds per class, all 19,200 source frames, 57,600 Form/outline
cases, deterministic replay, attachment checks, and the approved corpus digest
`af9b620e5ce87f6febf5983487fc163e8b5a4495fb37ced3653e8b5bbbc4ba3f`.
The corpus and Form/Effects Off presentation were approved on 2026-07-26; the
generated page remains review evidence rather than a committed baseline.

Run `npm run review:weapons -- --all-frames` to regenerate the 37 weapon review sheets and the exhaustive 6,000-row CSV/JSON audit. Add `--tier-sheets` to emit four labeled all-weapon/all-frame SVG review sheets per tier plus lightweight PNG inspection grids. The audit records ordinary edge contact separately from discarded pixels, so touching `x=0` or `x=23` remains advisory while attempting to draw outside the 24x24 canvas is a hard failure.

Run `npm run review:outlines` for the outline-specific regression gate. It verifies anchored safe-baseline hashes, 6,000 pixel-exact None-mode parity cases, 2,000 deterministic randomized integrity cases, 11,040 exhaustive outlined equipment cases, and 10,656 exhaustive headgear-preservation cases. The gate covers restrained cardinal equipment halos, silhouette-defining cavities of at least five logical pixels, the explicit equipment pilot, depth-aware equipment/body separators, feature-preserving equipment-side fallbacks, equipment-side front-equipment/headgear separators, foreground headgear and non-contact equipment pixel protection, non-contact body protection, ownership isolation, neck-cavity completion, and review examples. See [docs/archive/OUTLINE_RENDERING_PLAN.md](docs/archive/OUTLINE_RENDERING_PLAN.md) for the supported modes and scope boundary.

Run `npm run review:enemy-outlines` for the complete 57-family source
assessment, and `npm run review:enemy-outline-pilots` for the full approved
outline lane. The chronological approval record ends at 9,696 source frames /
29,088 None-B-C cases under the historical 12-column contract; the current
20-column regression gate verifies 16,160 None-mode parity cases and 48,480
None-B-C cases, mode distinction in every frame, zero source-edge frames, and
zero out-of-bounds writes. See
[docs/archive/ENEMY_OUTLINE_PLAN.md](docs/archive/ENEMY_OUTLINE_PLAN.md) for the chronological repair
and approval record.

Contact separators remain one pixel thick: pixels converted into separators are prevented from casting a redundant exterior halo, while legitimate interior equipment openings remain outlined. When a foreground weapon or shield directly touches headgear, only the touching equipment pixel becomes the separator; the hat artwork is preserved exactly. If a normal body-side separator would visually lengthen an adjacent dark eye, mouth, or other body feature, that character pixel is preserved and the separator moves onto the touching equipment pixel.

## Build the Windows application

Windows development requires Node.js, Rust, Microsoft C++ Build Tools, and WebView2. After installing those prerequisites, run:

```powershell
npm install
npm run tauri:dev
```

Create an optimized current-user NSIS installer with:

```powershell
npm run tauri:build
```

The setup executable is written beneath `src-tauri/target/release/bundle/nsis/`. Installed builds use native Save dialogs for PNG, JSON, and ZIP exports while browser builds keep normal browser downloads. Use `npm run tauri:build:exe` for the faster standalone proof executable, and see [WINDOWS_RELEASE.md](WINDOWS_RELEASE.md) for release validation, packaged smoke tests, GitHub draft releases, and signing status.

## Sprite-sheet contract

- Logical frame: 24x24 pixels
- Grid: 20 columns by 4 rows
- Rows: down, left, right, up
- Columns: idle x2, walk x4, attack x4, cast x4, hurt x2, death x4
- Animation export: selected animation frames across four direction rows
- Direction export: all 20 animation frames across one selected direction row
- Native 1x export sizes: full sheet 480x96, direction sheet 480x24, and animation sheet 48x96 or 96x96 pixels
- Committed fixture pack scale: 4x
- Committed legacy fixture sheet size: 1152x384 pixels (the preserved pre-Cast 12-column contract)
- Transparent background with no baked shadow

## Equipment variant batches

Use **Equipment variant batch** in Player mode when the game needs ready-made full sheets instead of runtime paperdoll composition. The current skin, hair, face, headgear, outfit family, colors, custom palette, and combat overrides stay fixed while the selected equipment axis expands:

- **Weapon families**: unarmed plus all 15 weapons at the current weapon tier (16 sheets)
- **Current weapon tiers**: Tier 1 through Tier 5 for the equipped weapon (up to 5 sheets)
- **Complete weapon arsenal**: unarmed plus all 15 weapons at every tier (76 sheets)
- **Armor progression**: the current outfit at all five armor tiers (5 sheets)
- **Complete shield armory**: no shield plus all eight shields at every tier (41 sheets)
- **Utility off-hand items**: no utility item plus the Lantern (2 sheets)
- **RPG equipment collection**: the weapon arsenal, armor progression, shield armory, and utility off-hands merged into 121 unique sheets

The ZIP uses the selected Export PNG scale and contains `manifest.json`, `README.txt`, one ready character sheet per unique specification, and one copy of every combat-effect sheet referenced by those variants. Automatic loadouts are resolved separately per weapon, explicit overrides are preserved, and effects remain modular instead of being baked into the character PNGs. Choose **1x Native** for exact `480x96` sheets.

## RPG class packs

Use **Class pack builder** in Player mode when one character should be ready to play as a focused RPG class instead of receiving the entire 121-sheet equipment collection. Pick a template, then either apply its Tier 1 defaults to the editor or download the full class ZIP immediately:

- **Warrior**: plate armor, six melee weapon families, and four martial shield families (54 unique sheets)
- **Guardian**: plate armor, four defensive weapon families, and six shield families (54 unique sheets)
- **Ranger**: Ranger Coat, dagger, spear, bow, crossbow, buckler, and Lantern options (30 unique sheets)
- **Rogue**: leather armor, scimitar, rapier, dagger, crossbow, and buckler options (29 unique sheets)
- **Mage**: robes, staff, wand, spellbook, arcane shield, and Lantern options (25 unique sheets)
- **Cleric**: Cleric Vestments, mace, warhammer, staff, wand, three holy or defensive shield families, and the Lantern (40 unique sheets)
- **Barbarian**: Barbarian Furs with greatsword, axe, spear, and club progression but no shields (24 unique sheets)
- **Necromancer**: Necromancer Robes with dagger, staff, wand, spellbook, bone shield, arcane shield, and Lantern progression (35 unique sheets)
- **Paladin**: plate armor with sword, greatsword, mace, warhammer, and three heavy shield families (39 unique sheets)
- **Druid**: Ranger Coat with dagger, spear, staff, wand, round shield, bone shield, and Lantern progression (35 unique sheets)

Applying a template changes only the class outfit and Tier 1 starting equipment; skin, hair, facial detail, headgear, colors, and custom palette stay intact, and the change can be undone. Export expands every permitted weapon through Tiers 1-5, the class outfit through all five armor tiers, no shield plus every permitted shield through Tiers 1-5, and each permitted non-shield off-hand. Identical complete specifications are deduplicated.

Each schema-v3 ZIP contains complete character sheets at the selected PNG scale, a resolved combat-loadout recipe for every variant, only the modular effect sheets those loadouts reference, `manifest.json`, and `README.txt`. Files live beneath `classes/<class-id>/characters/<character>/`, so several class archives can be added to a game without path collisions. Choose **1x Native** for exact `480x96` game sheets.

## Character packs

1. Give the pack a name, create a player or enemy, and give the character a name.
2. Select **Add current**, then repeat for as many characters as needed.
3. Use **Load** to keep editing an entry or **Remove** to take it out of the pack.
4. Choose an export scale, including **1x Native**, then select **Download pack ZIP**.

The working pack stays on the current device. Each downloaded ZIP contains one complete full sheet per sprite plus a versioned `manifest.json` with the exact specifications, animation contract, dimensions, file paths, and the saved combat-loadout recipe for every player or enemy.

For a reusable game asset pack, add up to 24 player characters and select **Download Complete Pack**. That single ZIP combines every assembled native character sheet, the matching lightweight recipes and combat loadouts, the full deduplicated component library, all 80 public enemy families with all 259 variations in `enemies/<family>/<variation>.png`, and all 24 synchronized overlays in `effects/<category>/<effect>.png`. Enemy and effect sheets in the Complete Pack are always native 1x, independently of the regular pack export-scale selector.

A 24-player Complete Pack contains 1912 shared component sheets, 259 ready enemy sheets, 24 combat-effect sheets, and 24 ready character sheets: 2219 native `480x96` PNGs. The first ready character also serves as the manifest reference preview, so no extra duplicate reference PNG is added.

### Wildshot game-pack status

A separate deterministic `wildshot-assembler` game-pack profile is being
implemented under [GAME_PACK_EXPORT_PLAN.md](GAME_PACK_EXPORT_PLAN.md). This
profile is locked to native **1x** with 24x24 cells; it will never use the
general export-scale selector.

The pure manifest and refusal contract exists, but there is no game-pack
button or CLI yet. The approved Player Cast and Death animations are public,
generated sheets are 480x96 (20 columns), and the v1 runtime animation audit
passes. Every Enemy aliases its matching Attack frame during Cast and uses Hurt
frames 1, 2, 2, 2 during Death. Approved license text and the compact per-effect
frame/anchor/direction contract are still required before the first valid game
pack can be emitted.

### Wildshot NPC slice status

The separately delivered `wildshot-npc-slice-v1@bf6269c` contains 32
Player-built NPC looks: 13 named roles, 10 zone quest-givers, and nine ambient
villagers. Its native 1x sheets use Form, no outline, Effects Off, hard alpha,
and the public 20-column `480x96` actor contract. The deterministic archive has
SHA-256
`548e0c9608a190983ac9705b6e1c9c36f29c2390022ebe55d85dc74919c23607`.
It is an NPC intake artifact, not 32 new Player catalog options and not the
still-blocked public `wildshot-assembler` game pack.

## Complete Character Kits

Use **Download Complete Character Kit** in Player mode to export one `8-bit-sprite-assembler-complete-character-kit` archive containing the entire reusable player library:

- Six animated skin-body layers and 12 normal/shaded head layers
- Six expression layers covering Neutral, Happy, Angry, Sad, Surprised, and Determined
- 119 hair layers covering all 11 styles, seven colors, and headgear fits; identical short, spiky, bowl, and topknot fitted art shares one file
- 30 facial-detail layers containing only the color-dependent variants each detail actually needs
- 60 direction-aware species layers split into 20 back and 40 front passes: skin-matched ears, tusks, Dwarf features, Lizardfolk scales and tails; hair-matched Beastkin ears, muzzles, and tails; plus fixed-color Tiefling horns, Celestial wings and halos, and Undead skulls and bone hands
- 1020 outfit-front layers plus 140 cape-back layers covering all nine outfit families, four body builds, and five armor tiers; fixed-color leather and plate art is stored once per build and tier
- 41 headgear layers covering all 12 choices; fixed-color gear is stored once, while cap, hood, wizard hat, bandana, and plumed helm receive the seven catalog outfit colors
- 150 weapon layers covering all 15 families at Tiers 1-5 in back/front passes
- 326 shield layers covering all eight families at Tiers 1-5; a pass gets color variants only when color changes its pixels, including Tier 5 artifact passes that fully replace the underlying accent
- Two Lantern utility-off-hand layers split into direction-aware back and front passes
- 259 complete enemy sheets covering every variation in all 80 public enemy families, organized beneath `enemies/`
- 24 transparent combat-effect sheets covering trails, projectiles, impacts, and statuses, organized beneath `effects/`
- One assembled reference sheet, `manifest.json`, and `README.txt`

The standalone kit contains 1912 content-unique component sheets, 259 ready enemy sheets, 24 combat-effect sheets, and one reference preview: 2196 native `480x96` PNGs total. The combined Complete Pack instead adds one ready sheet per saved player and reuses its first character as the reference.

Draw the non-null component paths from a recipe in this order:

`weapon-back` → `shield-back` → `offhand-back` → `species-back` → `outfit-back` → `outfit` → `skin-body` → `head` → `expression` → `species-front` → `face-detail` → `hair` → `headgear` → `shield-front` → `offhand-front` → `weapon-front`

Each schema-v12 recipe records the selected species, body build, expression, hairstyle, headgear, expanded outfit family, and optional utility off-hand, and may include a combat loadout with explicit selections, weapon-aware automatic defaults, resolved effect files, and the current draw order. Build-specific outfit and cape paths keep the silhouette modular while skin, head, expression, hair, species, headgear, weapon, shield, and utility-off-hand layers stay shared. Effect sheets remain separate and use the same animation column, direction row, and 24x24 source rectangle; status effects animate across every animation, while trails, projectiles, and impacts are transparent outside attack. The existing recipe order places effects after the assembled sprite, but that is the current compatibility contract, not a resolved equipment-occlusion rule. Consumers should keep the sheets modular; the optional legacy effect compositor remains on ice and its current preview order must not be treated as final guidance.

Every component shares the same animation grid and has been validated to recompose the complete renderer pixel-for-pixel across all directions and frames. To craft a new character in a game, copy a recipe and change its component paths; no art needs to be duplicated.

## Boss animation pilot

The review-only **Bosses** workspace now exposes Ancient Mirejaw, Bone
Reliquary King, Scorpion Empress, Cyclops Forge-Titan, Pit-Fiend Juggernaut,
Goblin War-Crown, Cruel Catgirl Templar of the Brutes, Divine Armored Templar
Astro Knight, Furious Depraved Rhino, and Gunslinger Boar Rider as ten complete
48x48 animation pilots. All ten use the Player-facing animation names and
counts (Idle x2, Walk x4, Attack x4, Cast x4,
Hurt x2, Death x4), four direction rows, and native 20-column `960x192` full
sheets. Playback, frame inspection, speed, Cycle all, direction controls, and
native full/current animation/current direction downloads are available
without adding Boss to the persisted sprite document.

The other three approved bosses and the Eclipse Unicorn Sovereign candidate
remain static four-direction entries. All boss assets remain effects-off and
outside Enemy mode, procedural renderers, production rolls, presets,
ordinary character/game packs, fixtures, baselines, and Windows builds.
The separately frozen `established-boss-pack-13-v1` transport is the only
exception, and it does not authorize ordinary Boss integration. At `bf6269c`,
its clean-tree/pushed-HEAD/GitHub-release gate is tested, but the command is not
ready to run against `main`: four frozen roster ids lack direction catalogs and
seven lack animation catalogs. Do not publish it until roster compatibility is
reconciled and directly tested. Ancient Mirejaw, Bone Reliquary King,
Scorpion Empress, and Cyclops Forge-Titan were accepted in live review;
Pit-Fiend Juggernaut was repaired
after live review. Cruel Catgirl Templar of the Brutes is accepted after its
foreground-grip and attack-lift depth repair. Divine Armored Templar Astro
Knight is accepted after its sealed-helmet direction repair and full motion
review. Goblin War-Crown, Furious Depraved Rhino, and Gunslinger Boar Rider
remain full-animation visual candidates; the Rhino's low quadruped direction
redesign is also a visual candidate.

All ten Idle loops use authored breathing or weight-shift silhouettes rather
than palette-only flashing. Scorpion Empress additionally uses a blink and
stinger-flick Idle, stable-body leg scuttling, a tail-led strike, stinger
casting, impact squash, and a weighted armored collapse so each action frame
changes her readable outline.

Cyclops Forge-Titan uses a weighted upper-body/hammer settle, planted-foot
stomp cycle, hammer wind-up/slam, furnace-core channel, bright Hurt recoil, and
four-stage armored fall.

Pit-Fiend Juggernaut uses a wing-and-shield weight shift, alternating armored
steps, a tower-shield bash, infernal wing flare, bright Hurt recoil, and a
four-stage wing-folded collapse.

Goblin War-Crown uses a compact commander weight shift, planted march, royal
shield bash, crown-command pulse, bright Hurt recoil, and banner-led collapse.

Cruel Catgirl Templar of the Brutes uses an armored weight shift, planted
march, foreground-held execution-hammer wind-up and ground slam, crimson
templar-sigil cast, bright recoil, and a four-stage directional collapse.

Divine Armored Templar Astro Knight uses armored idle, heavy march,
shield-braced star-lance thrust, astral halo cast, radiant recoil, and staged
celestial collapse motion while keeping its lance and orbit shield in front.

Furious Depraved Rhino now has repaired quadruped direction controls and a
regenerated 80-frame animation corpus. Both remain explicit visual candidates.

Gunslinger Boar Rider has approved direction controls and a full mounted
gallop/dual-revolver animation corpus that remains an explicit visual
candidate.

Eclipse Unicorn Sovereign is direction-only: a pearl-white war-unicorn with a
long striped sunhorn, luminous cyan eyes, flowing violet eclipse mane and tail,
crescent barding, and four separated hoof columns. Its four-direction design
awaits explicit visual approval before any animation work.

## Project layout

- `index.html` - standard application entry point
- `styles.css` - desktop-style responsive interface
- `app.js` - editor state, Production/Wildcard actions, sprite history, reset and comparison workflows, presets, combat loadouts, equipment-batch, class-pack, and character-pack exports, Complete Character Kit rendering, naming, playback and frame inspection, and downloads
- `character-kit.js` - deterministic component coverage, paths, recipe mapping, counts, and layer-order planning
- `zip.js` - dependency-free ZIP archive writer used by character-pack and Master Character Kit export
- `sprite-engine.js` - stable public engine API
- `engine/` - focused animation, palette, player-option, enemy, production-roll, Wildshot game-pack contract, combat-loadout and combat-effect rendering, equipment-variant and RPG-class planning, humanoid weapon, shield, and utility-off-hand renderers, shared pixel-buffer, assembled-output shade/outline coordination, sheet, and generator modules
- `engine/enemy-expansion.js` - pure EN-F00 registry/renderer facade, lifecycle
  ledger, deterministic review planning, and completed standard-sheet contract
- `engine/enemy-expansion-public.js` and `engine/enemy-expansion-repairs.js` -
  stable/public composition through the approved repaired registry, immutable
  pre-repair comparison evidence, and the current-ledger default
- `engine/enemy-expansion-en-e01.js`, `engine/enemy-expansion-en-e02.js`, and
  `engine/enemy-expansion-humanoid.js` - EN-E01/EN-E02 approval and registration
  evidence plus the shared data-selected standard-animation humanoid renderer
- `engine/enemy-expansion-en-e03.js` and
  `engine/enemy-expansion-large-hybrid.js` - isolated, non-public EN-E03
  common-Idle contract cards and rejected Idle-only Giant/Centaur/Satyr
  implementation evidence
- `engine/enemy-expansion-en-e03-calibration.js`,
  `engine/enemy-expansion-en-e03-giant-idle.js`, and
  `engine/enemy-expansion-en-e03-centaur-calibration.js` - approved Hill
  Breaker F1/F2 evidence plus the isolated approved Steppe Hunter F1 calibration
- `engine/enemy-expansion-en-e03-giant-walk.js` - approved internal Hill Breaker
  Walk W1-W4 baseline; it delegates approved Idle exactly, rejects later
  motion/families, and is absent from the public facade
- `engine/enemy-expansion-en-e03-giant-attack.js` - approved internal Hill Breaker
  Attack A1-A4 baseline; it delegates approved Idle and Walk exactly, rejects
  later motion/families, and is absent from the public facade
- `engine/enemy-expansion-en-e03-giant-hurt.js` - approved internal Hill Breaker
  Hurt H1-H2 baseline; it delegates approved Idle, Walk, and Attack
  exactly, rejects Cast/Death and other families, and is absent from the public
  facade
- `engine/enemy-expansion-en-e03-centaur-idle.js` - approved internal Steppe
  Hunter F1/F2 Idle baseline; F1 delegates to the frozen calibration and F2
  preserves the accepted planted-hoof continuation
- `engine/enemy-expansion-en-e03-centaur-walk.js` - approved internal Steppe
  Hunter Walk W1-W4 baseline; it delegates approved Idle
  exactly, rejects later motion/families, and is absent from the public facade
- `engine/enemy-expansion-en-e03-satyr-calibration.js` - bounded internal Briar
  Reveler F1 approved seed; it reuses the approved humanoid and Goatfolk grammar
- `engine/enemy-expansion-en-e03-satyr-idle.js` - approved internal Briar
  Reveler F1/F2 Idle baseline; F1 delegates to the frozen calibration while F2
  preserves the accepted planted-hock, tail-flick, and staff-dip continuation
- `engine/enemy-expansion-en-e03-satyr-walk.js` - approved internal Briar
  Reveler Walk W1-W4 baseline; it delegates approved Idle exactly,
  rejects later motion/families, and is absent from the public facade
- `engine/enemy-expansion-en-e03-satyr-attack.js` - approved internal Briar
  Reveler Attack A1-A4 baseline; it delegates approved Idle and Walk
  exactly, rejects later motion/families, and is absent from the public facade
- `tools/check-enemy-expansion.mjs` - focused legacy-equivalence, registry,
  review-targeting, and malformed-sheet gate
- `tools/check-enemy-expansion-en-e01.mjs` and
  `tools/enemy-expansion-en-e01-review.mjs` - focused candidate gate and exact
  four-direction Idle review evidence generator
- `tools/check-enemy-expansion-en-e02.mjs` and
  `tools/enemy-expansion-en-e02-review.mjs` - common-only EN-E02 structural gate
  and exact four-direction Idle review evidence generator
- `tools/check-enemy-expansion-en-e02-full.mjs` and
  `tools/enemy-expansion-en-e02-full-review.mjs` - exhaustive EN-E02 1,200-frame
  private-candidate gate and full review-bundle generator
- `tools/check-enemy-expansion-en-e02-registration.mjs` - exhaustive approved-
  registry composition, artifact lock, ledger, candidate/registered parity,
  and current cumulative consumer-boundary gate
- `tools/check-enemy-expansion-en-e02-consumers.mjs` - cumulative EN-E01/EN-E02
  editor, randomizer, kit, pack, thumbnail, export, outline, and Form gate
- `tools/check-enemy-expansion-repairs.mjs` - exact approved seven-family
  repair and immutable pre-repair regression gate
- `tools/check-enemy-expansion-en-e03.mjs` and
  `tools/enemy-expansion-en-e03-review.mjs` - isolated 24-frame common-Idle
  structural gate and exact raw/Complete B + Form evidence generator
- `tools/check-enemy-expansion-en-e03-giant-walk.mjs` and
  `tools/enemy-expansion-en-e03-giant-walk-review.mjs` - focused 16-frame Walk
  gate and deterministic raw/Complete B + Form evidence for the approved
  internal Hill Breaker baseline
- `tools/check-enemy-expansion-en-e03-giant-attack.mjs` and
  `tools/enemy-expansion-en-e03-giant-attack-review.mjs` - focused 16-frame
  Attack gate and deterministic raw/Complete B + Form evidence for the approved
  internal Hill Breaker baseline
- `tools/check-enemy-expansion-en-e03-giant-hurt.mjs` and
  `tools/enemy-expansion-en-e03-giant-hurt-review.mjs` - focused eight-frame
  Hurt gate plus deterministic labeled all-four-direction raw and Complete B +
  Form evidence for the approved internal Hill Breaker baseline
- `tools/check-enemy-expansion-en-e03-centaur-walk.mjs` and
  `tools/enemy-expansion-en-e03-centaur-walk-review.mjs` - focused 16-frame
  hybrid Walk gate and deterministic evidence for the approved internal Steppe
  Hunter baseline
- `tools/check-enemy-expansion-en-e03-satyr-walk.mjs` and
  `tools/enemy-expansion-en-e03-satyr-walk-review.mjs` - focused 16-frame
  split-hoof Walk gate and deterministic raw/Complete B + Form evidence for the
  approved internal Briar Reveler baseline
- `tools/check-enemy-expansion-en-e03-satyr-attack.mjs` and
  `tools/enemy-expansion-en-e03-satyr-attack-review.mjs` - focused 16-frame
  body-and-staff Attack gate plus deterministic labeled raw and Complete B +
  Form review evidence for the approved internal Briar Reveler baseline
- `tools/check-enemy-expansion-en-e01-full.mjs` and
  `tools/enemy-expansion-en-e01-full-review.mjs` - exhaustive 1,200-frame
  private-candidate gate and completed-slice review bundle generator
- `tools/check-enemy-expansion-en-e01-registration.mjs` - exhaustive approved-
  registry, stable-facade, ledger, legacy-isolation, and candidate/public pixel-
  parity gate
- `engine/catalogs/boss-directions.js`, `engine/catalogs/boss-animations.js`,
  and `engine/assets/bosses/` - immutable review-only boss direction and
  ten-pilot animation profiles plus checkpoint-exact runtime PNGs
- `asset-pack/` - validated enemy and example player sheets
- `tools/dev-server.mjs` - dependency-free local development server
- `tools/build.mjs` - dependency-free production build
- `tools/check-project.mjs` - project and asset validator
- `tools/check-boss-directions.mjs` - focused boss asset, immutability, facade,
  native-sheet, and dependency-boundary gate
- `tools/check-boss-animations.mjs` - focused 800-frame ten-boss corpus,
  full/scoped-sheet, control-frame, immutability, UI, and isolation gate
- `tools/generate-*-animation-v1.py` - deterministic authored-pose generators
  for all ten review/runtime animation pilots
- `tools/pack-publisher.mjs`, `tools/export-established-boss-pack.mjs`, and
  `tools/check-pack-publisher.mjs` - isolated release-transport gate, frozen
  Boss-pack command, and direct gate harness; the current roster mismatch is
  documented above and in `HANDOFF.md`
- `tools/production-roll-review.mjs` - deterministic balanced Production/Wildcard review and audit generator
- `src-tauri/` - Tauri 2 Windows wrapper, permissions, CSP, and icon resources
- `ARCHITECTURE.md` - engine boundaries, dependency direction, and safe extension points
- `ROADMAP.md` - agreed development and Windows release order
- `HANDOFF.md` - exact branch, validation, known gaps, and continuation state
- `docs/archive/ENEMY_OUTLINE_PLAN.md` - completed 57-family outline rollout record
- `ENEMY_EXPANSION_PLAN.md` - approved decomposition of the 80 proposed Enemy
  additions plus the live approval-gated execution record
- `docs/archive/SHADE_RENDERING_PLAN.md` - canonical completed shade design and approval gates
- `docs/archive/OFFHAND_ITEMS_PLAN.md` - approved Lantern pilot, public contract, validation, and future off-hand boundaries
- `docs/archive/PRODUCTION_ROLL_PLAN.md` - completed Production-versus-Wildcard policy, review, approval, editor integration, and compatibility gates

## Direction

The project will preserve the sprite-sheet contract while moving toward an app-ready frontend, a small Tauri Windows proof, expanded editor functionality and content, and finally a polished Windows installer. See [ROADMAP.md](ROADMAP.md).
