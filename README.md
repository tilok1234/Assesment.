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
- 67 selectable public enemy families with 232 predefined variants: the locked
  57-family / 202-variant legacy catalog plus 10 approved EN-E01/EN-E02
  families / 30 variants
- Isolated, non-public EN-E03 evidence containing two visually rejected
  common-only Idle attempts, three separately approved internal F1/F2 Idle
  baselines for Hill Breaker, Steppe Hunter, and Briar Reveler, the approved
  internal Hill Breaker, Steppe Hunter, and Briar Reveler four-frame Walks, plus
  the approved Hill Breaker, Steppe Hunter, and Briar Reveler common Attack
  A1-A4 baselines, and the approved Hill Breaker, Steppe Hunter, and Briar
  Reveler Hurt H1-H2 baselines, plus the approved common Cast/Death aliases for
  those three variants, and the approved Boulder Hurler specialist Idle F1-F2
  baseline; none is selectable consumer content
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
- One-click Complete Character Packs combining up to 24 assembled native sheets, matching recipes, 1912 content-unique atomic component sheets, all 232 public enemy variations, and all 24 combat effects at native 1x
- A validated asset pack containing 232 exported sheets
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
  modes for players and all 67 public enemy families; the 30 approved
  EN-E01/EN-E02 variants retain their reviewed raw pixels and gain outlines only
  in assembled output, while effects, source art, floor shadows, and atomic
  component sheets remain untreated
- Optional assembled-sprite shading with None and the approved material-aware
  Form mode for players and all 67 public enemy families; approved EN-E01 and
  EN-E02 variants resolve their own published renderer palette ramps rather
  than a legacy-family fallback. The selector participates in undo/redo,
  comparisons, presets, packs, recipes, previews, and assembled exports, while
  raw source pixels, effects, and atomic component sheets remain untreated
- A validated local full-public-Enemy exporter with three top-level treatment
  folders: Form + Complete B, Form + Selective C, and Form + None. It produces
  232 native complete sheets per folder / 696 PNGs total plus a manifest,
  README, stored ZIP, and SHA-256 sidecar
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
catalog without changing the legacy `ENEMIES` entries. The separately
authorized EN-E02 consumer checkpoint `8ab1837` now reuses the exact cumulative
approved registry, extending editor sanitization and selectors, persistence,
Enemy randomization, thumbnails, full/animation/direction exports, ordinary
packs, Wildshot manifest validation, combat defaults, and Complete Kits to 67
families / 232 variants through the same public dispatcher. All 2,400 approved
expansion frames and all 30 native sheets remain pixel-identical to the registry
when assembled presentation is None. Optional assembled output supports both
approved enemy outline modes and material-aware Form shading without changing
that raw dispatcher boundary. No schema version changed because Enemy specs
retain the existing `{ kind, family, variant }` shape.

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
2026-08-02. The cumulative stable `ENEMY_EXPANSION_REGISTRY` and separately
authorized `ENEMY_EXPANSION_CONSUMER_REGISTRY` now expose the same ten approved
EN-E01/EN-E02 families / 30 variants, producing the immutable 67-family /
232-variant `PUBLIC_ENEMIES` catalog. The cumulative consumer gate exhausts all
2,400 approved frames, 30 sheets, 7,200 None/B/C outline cases, and 7,200
Form-with-outline cases. A live Plague Doctor / Field Chirurgeon smoke test
confirmed Complete B + Form, the exact export name, all 67 selector entries,
and a clean console. The designer accepted that consumer presentation and later
approved the exact seven-family walk/seam repair for Catfolk, Desert Raider,
Fallen Knight, Fanatic Monk, Goatfolk, Necromancer, and Witch. The repaired
registry is now the stable and consumer boundary; the pre-repair registry is
retained only as immutable internal comparison evidence.

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
all 67 complete public Enemy families / 232 variants. The package has exactly
three top-level art folders:

- `outlined/<family>/<variant>.png` for Form + Complete B;
- `semi-outlined/<family>/<variant>.png` for Form + Selective C; and
- `without-outlines/<family>/<variant>.png` for Form + None.

Every file is a native `480x96` hard-alpha sheet containing all four directions
and the 20-column Idle/Walk/Attack/Cast/Hurt/Death contract. The package has 232
sheets in each folder / 696 PNGs total. `manifest.json` records the catalog,
frame contract, treatment mapping, per-file dimensions, opaque-pixel counts,
byte sizes, and SHA-256 hashes. `README.md`, the deterministic stored ZIP, and a
ZIP SHA-256 sidecar are included.

Run `npm.cmd run check:export:enemies:all-outlines` to verify every PNG, every
non-empty actor cell, binary alpha, treatment distinction, directory contents,
manifest hashes, ZIP entry bytes, and sidecar. The exact approved delivery ZIP
is 2,440,823 bytes with SHA-256
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

## Temple Rajah complete motion approved, publication pending

Branch `codex/en-e04-rajah-motion` owns one internal, non-public, uncommitted
80-frame Temple Rajah motion candidate based exactly on clean combined-slice
handoff `c92ee12`. The eight approved Idle frames delegate byte-for-byte. Walk,
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
publication is pending; the same approval separately authorizes one complete
enemy with all standard animations as the next slice.

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

Run `npm run check:enemy-expansion-en-e02-consumers` for the current cumulative
consumer gate. The historical EN-E01 command intentionally reaches the same
matrix. It proves the 57/202 legacy catalog is unchanged, the immutable public
catalog is exactly 67/232, all 2,400 dispatcher/editor frames and all 30 native
full sheets match the approved registry in raw/None mode, and selectors,
persistence, randomization, thumbnails, export scopes, Complete Kits, combat
defaults, and Wildshot pack validation accept both approved slices. It also
exhausts 7,200 None/B/C outline cases and 7,200 Form-with-outline cases while
checking deterministic shading, all 180 expansion palette colors, protected
features, source ownership, and unchanged outline geometry.

Run `npm run check:enemy-expansion-en-e01-full` for the complete private
candidate gate and `npm run review:enemy-expansion-en-e01-full` for the ignored
overview, five family motion boards, 15 native `480x96` sheets, and JSON review
manifest under `enemy-expansion-review/en-e01-full/`. The full gate exhausts
all 1,200 frames, validates each complete sheet, checks deterministic motion
and direction reads, proves Cast/Death alias pixels, preserves the approved
Idle digest, and preserves the exact reviewed pre-registration candidate.

Run `npm run check:enemy-expansion-en-e01-registration` for the approved public
boundary. It verifies the immutable completed-slice approval record, five
approved families, 15 variants, the current three-approved/zero-implemented/
nineteen-planned ledger, stable-facade routing, 15 complete sheets, and pixel
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
the current head confirms the separately authorized consumer registry and
`PUBLIC_ENEMIES` expose both approved slices at 67 families / 232 variants.
Effects and release remain separate gates. EN-E03 is a later, isolated lane
whose two common-Idle attempts were visually rejected; it is not part of this
registration.

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

For a reusable game asset pack, add up to 24 player characters and select **Download Complete Pack**. That single ZIP combines every assembled native character sheet, the matching lightweight recipes and combat loadouts, the full deduplicated component library, all 67 public enemy families with all 232 variations in `enemies/<family>/<variation>.png`, and all 24 synchronized overlays in `effects/<category>/<effect>.png`. Enemy and effect sheets in the Complete Pack are always native 1x, independently of the regular pack export-scale selector.

A 24-player Complete Pack contains 1912 shared component sheets, 232 ready enemy sheets, 24 combat-effect sheets, and 24 ready character sheets: 2192 native `480x96` PNGs. The first ready character also serves as the manifest reference preview, so no extra duplicate reference PNG is added.

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
- 232 complete enemy sheets covering every variation in all 67 public enemy families, organized beneath `enemies/`
- 24 transparent combat-effect sheets covering trails, projectiles, impacts, and statuses, organized beneath `effects/`
- One assembled reference sheet, `manifest.json`, and `README.txt`

The standalone kit contains 1912 content-unique component sheets, 232 ready enemy sheets, 24 combat-effect sheets, and one reference preview: 2169 native `480x96` PNGs total. The combined Complete Pack instead adds one ready sheet per saved player and reuses its first character as the reference.

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
