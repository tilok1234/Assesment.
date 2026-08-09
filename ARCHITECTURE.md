# Architecture

The Sprite Assembler keeps its browser and Windows builds on the same frontend and procedural engine. Tauri packages the production web build without duplicating editor or rendering logic.

## Dependency direction

```text
index.html
  -> app.js
    -> sprite-engine.js (stable public facade)
      -> engine/catalogs.js
        -> engine/catalogs/animation.js
        -> engine/catalogs/palettes.js
        -> engine/catalogs/player-options.js
        -> engine/catalogs/enemies.js
        -> engine/catalogs/boss-animations.js
        -> engine/catalogs/boss-directions.js
      -> engine/renderer.js
      -> engine/outline-renderer.js
        -> engine/pixel-buffer.js
      -> engine/shade-renderer.js
      -> engine/weapon-renderer.js
      -> engine/shield-renderer.js
      -> engine/offhand-renderer.js
      -> engine/effect-renderer.js
      -> engine/combat-loadouts.js
      -> engine/sheets.js
      -> engine/generators.js
      -> engine/production-rolls.js
      -> engine/production-rerolls.js
      -> engine/game-pack.js
      -> engine/enemy-expansion-public.js
        -> engine/enemy-expansion.js
        -> engine/enemy-expansion-repairs.js
          -> engine/enemy-expansion-en-e01.js
            -> engine/enemy-expansion-humanoid.js
          -> engine/enemy-expansion-en-e02.js
            -> engine/enemy-expansion-humanoid.js
        -> engine/enemy-expansion-en-e04.js
        -> engine/enemy-expansion-en-e06-public.js
        -> engine/enemy-expansion-en-e03-adoption.js
        -> engine/enemy-expansion-en-e05-ghoul-public.js
      -> engine/variant-batches.js
      -> engine/class-templates.js
    -> character-kit.js
      -> sprite-engine.js (catalogs through the public facade)
    -> zip.js (standalone archive writer)
```

Sprite-rendering consumers import `sprite-engine.js`. Internal engine module paths are deliberately not part of the public API. `zip.js` is a packaging-only utility and does not depend on engine internals.

## Module responsibilities

### Visual review evidence

Review generators and handoff surfaces have a presentation contract separate
from structural validation. Unless the designer explicitly asks for a narrow
direction/frame/layer/defect inspection, every sprite approval review must show
all four labeled directionsâ€”Down, Left, Right, and Upâ€”and provide both the raw
render with outlines disabled and the outlined project presentation (currently
Complete B + Form for EN-E03). Both versions must be shown together; side-only,
unlabeled, or single-mode output is incomplete normal review evidence. Narrow
reviews must state their reduced scope explicitly.

Explicit visual approval also closes the Git publication gate: stage only the
bounded approved lane, commit it, and push its branch before starting another
gate. Never publish an unapproved lane, and honor an explicit designer hold.

### Public facade

`sprite-engine.js` re-exports the supported engine API. It stays small so internal files can move without forcing UI or integration changes.

### Catalogs

- `engine/catalogs/animation.js` owns frame size, directions, animation timing, and sheet layout.
- `engine/catalogs/palettes.js` owns shared material and renderer colors.
- `engine/catalogs/player-options.js` owns stable player-facing species, body-build, expression, appearance, and equipment choices.
- `engine/catalogs/enemies.js` owns enemy families and variants.
- `engine/catalogs/boss-animations.js` owns the immutable review-only
  `boss-animation-v1` 48x48/20-column contract and the Ancient Mirejaw, Bone
  Reliquary King, Scorpion Empress, Cyclops Forge-Titan, Pit-Fiend
  Juggernaut, Goblin War-Crown, Cruel Catgirl Templar of the Brutes, Divine
  Armored Templar Astro Knight, Furious Depraved Rhino, and Gunslinger Boar
  Rider asset paths.
- `engine/catalogs/boss-directions.js` owns the immutable review-only
  `boss-directions-v1` identity and paths for twelve approved 48x48 direction
  pilots plus repaired quadruped Rhino and Eclipse Unicorn Sovereign
  candidates.
- `engine/catalogs.js` is the internal catalog facade used by the renderer and helpers.

Catalog files describe content. They do not touch the DOM, canvas, editor state, or persistence.

### Enemy expansion foundation, approved registrations, and isolated candidates

`engine/enemy-expansion.js` is the pure EN-F00 boundary. It owns the immutable
`enemy-expansion-v1` frame/baseline profile, the 22-slice/80-proposal lifecycle
ledger, renderer/chassis registration validation, implemented-versus-approved
family views, deterministic family/slice Idle review plans, renderer dispatch,
and completed `480x96` hard-alpha sheet validation. It imports only the stable
internal catalog facade and does not access the DOM, canvas, storage, packs,
filesystem, or editor state.

The isolated EN-F00 foundation registry deliberately contains no families or
renderer handlers. `engine/enemy-expansion-public.js` composes only explicitly
approved content and supplies the current default ledger report to the stable
facade. It imports the approved repaired boundary from
`engine/enemy-expansion-repairs.js`, whose immutable registry contains ten
approved EN-E01 and EN-E02 families / 30 variants. The same module retains the
exact pre-repair registry as internal comparison evidence. Planned families
cannot enter the stable/public registry; implemented candidates remain
internal; only an approved registration can appear in the public family view.

The legacy `ENEMIES` array remains unchanged as the 57-family / 202-variant
regression and fixture boundary. `engine/enemy-expansion-public.js` also exports
immutable `PUBLIC_ENEMIES`, which preserves those legacy entries in order and
appends 23 consumer-authorized EN-E01/EN-E02/EN-E03/EN-E04/EN-E05/EN-E06
families, yielding the current 80-family / 259-variant consumer catalog. Editor selectors and sanitizers,
persistence, randomization, combat defaults, kits, packs, thumbnails, and
exports consume that merged view without mutating `ENEMIES`.

`engine/enemy-expansion-en-e06-public.js` registers the exact eight approved
Fairy, Hag, and Dryad suites. `engine/enemy-expansion-en-e03-adoption.js`
registers only the six completed Giant, Centaur, and Satyr suites; the three
Idle-only EN-E03 variants remain internal. `engine/enemy-expansion-en-e05-ghoul-public.js`
owns the one replacement route from public `zombie/ghoul` to the approved
`ghoul-upgrade/ghoul` renderer. That route does not add a duplicate selector
family or change the frozen legacy `ENEMIES` object/fixture boundary.

`engine/public-renderer.js` is the stable dispatcher used by the public
`drawSprite()` facade and assembled/pixel/sheet helpers. It delegates every
ordinary legacy specifications to the unchanged renderer, sends approved
expansion family IDs through `renderEnemyExpansionFrame()`, and translates the
single approved `zombie/ghoul` replacement through its explicit route. It owns clear,
composition, generic preview-shadow, layer, and out-of-bounds callback semantics
around the reviewed renderer. `engine/public-game-pack.js` similarly injects
`PUBLIC_ENEMIES` into the catalog-parameterized manifest builder, leaving the
core game-pack policy renderer-free and dependent only on `catalogs.js`.

The assembled presentation boundary also consumes the public registry.
`engine/outline-renderer.js` recognizes approved expansion specifications via
the stable public dispatcher and applies the source-preserving exterior contour
path for Complete B or Selective C. `engine/shade-renderer.js` resolves enemy
materials from `PUBLIC_ENEMIES`, so EN-E01 uses the nested skin, hair, outfit,
and identity palette ramps published by its renderer data instead of falling
back to an unrelated legacy family. EN-E02 through EN-E06 reach the same
palette-aware path through their approved renderer data. The replacement Ghoul
uses the expansion exterior-contour path because its approved source has no
legacy component/equipment layer contract. None/None still
delegates directly to the raw dispatcher; Form and outlines alter only complete assembled output,
preserve protected features and outline geometry, and do not mutate registry
pixels or atomic component sheets.

The approved EN-E01 implementation lives behind that boundary.
`engine/enemy-expansion-en-e01.js` owns five immutable contract cards, a frozen
common-only registry for the exact approved Idle evidence, and a separate full
candidate registry containing 15 reviewed common/specialist/elite variants. It
also owns the immutable completed-slice approval record and a five-family
approved registry consumed only by `engine/enemy-expansion-public.js`.
`engine/enemy-expansion-humanoid.js` owns one `humanoid-threat-v1` handler on
the `humanoid-v1` chassis. The handler reuses the proven player humanoid rig,
derives Idle/Walk/Attack/Hurt poses generically, maps Enemy Cast to Attack and
Death to Hurt 1, 2, 2, 2, and applies identity overlays selected by renderer
data rather than family-id branches. The frozen registry keeps the approved
common Idle pixels byte-identical while the full registry exercises complete
`480x96` sheets. `sprite-engine.js` exports only the generic public boundary and
does not expose slice-specific symbols; consumers reach EN-E01 through
`PUBLIC_ENEMIES` and the public dispatcher rather than importing the slice
module. The ignored baseline and
full-slice review generators continue to capture their frozen evidence
registries directly. Registration checkpoint `b43ed6a` proves all 1,200 public
frames are pixel-identical to the reviewed candidate; consumer checkpoint
`e0be273` proves the editor/export adapter retains that parity. The later
presentation integration exhaustively verifies the same 1,200 raw frames plus
3,600 outline and 3,600 Form/outline assembled cases. The designer accepted the
live combined treatment on 2026-08-02; registry approval and raw-pixel identity
remain separate contracts.

`engine/enemy-expansion-en-e02.js` owns the approved second art slice. It
contains five immutable contract cards, a frozen common-only registry for the
exact approved Idle evidence, a separate pre-registration candidate registry
containing 15 common/specialist/elite variants, an immutable completed-slice
approval record, and a five-family approved slice registry. These registries
reuse the existing
`humanoid-threat-v1` handler while masks, satchels, wraps, bows, bindings, bell
regalia, feline tails/manes, and caprine regalia remain selected by renderer
data. Walk/Attack/Hurt use the shared humanoid motion contract; Cast aliases
Attack and Death aliases Hurt 1, 2, 2, 2. A private pixel-level compatibility
proof applies the shared Complete B, Selective C, and Form algorithms without
adding EN-E02 to the public dispatcher before authorization. Registration
checkpoint `7b6e448` composes EN-E01 and EN-E02 into the stable approved
`ENEMY_EXPANSION_REGISTRY` at ten families / 30 variants. The later explicit
consumer gate is recorded by immutable `EN_E02_CONSUMER_INTEGRATION_GATE`;
checkpoint `8ab1837` makes `ENEMY_EXPANSION_CONSUMER_REGISTRY` reuse that exact
cumulative approved registry. At that checkpoint `PUBLIC_ENEMIES` was 67/232, and the
existing selectors, randomizer, kit, pack, thumbnail, export, outline/Form, and
standard-dispatcher paths consume EN-E02 without slice-specific branches.
`sprite-engine.js` still imports only the generic stable boundary and exposes no
slice-specific symbols. The five pre-registration candidate records remain
immutable `implemented` evidence; consumer integration does not retroactively
rewrite that reviewed snapshot. The designer later approved an exact
seven-family walk/seam repair, so both stable and consumer composition now route
through `ENEMY_EXPANSION_REPAIR_APPROVED_REGISTRY` at the EN-E01/EN-E02
boundary while the pre-repair object remains internal. The later EN-E04
registration composes three additional approved family dispatchers, and EN-E05
adds four more. Their separately authorized consumer gates now make the
consumer registry reuse the exact 17-family / 43-variant stable object. Those
repairs and integrations did not authorize effects or release.

`engine/enemy-expansion-en-e05.js` owns the five-undead registration provenance
and the later assembler-consumer authorization. Exact approved Mummy Tomb
Walker, Vampire Night Noble, Revenant Grave Oathkeeper, and Lich Soul Regent
enter the stable and consumer registries as four one-variant families. The
approved Ghoul upgrade remains a separate internal replacement record targeting
legacy `zombie/ghoul`; it does not collide with or replace that public legacy
entry. The generic consumer boundary covers selectors, sanitization,
persistence, randomization, dispatch, scoped sheets, thumbnails, ordinary
packs, Complete Kit, and Wildshot without family-specific branches. All 320
public frames retain the registered digest
`947cec4df921761cd5eba378991d7a35b3d773d7e5c0e7c80526ecc6a846a46f`.

`engine/enemy-expansion-en-e03.js` is a separate, non-public historical evidence
module. It owns three immutable Giant/Centaur/Satyr contract cards, the exact v2
raw and Complete B + Form artifact hashes, rejected-v1 hash evidence, and an
internal registry containing only the Hill Breaker, Steppe Hunter, and Briar
Reveler common variants. Its `large-hybrid-v2` renderer lives in
`engine/enemy-expansion-large-hybrid.js`, removes v1's baked silhouette cage in
favor of palette-first source clusters, and rejects every animation except Idle.
V2 passes its structural/reproducibility gate but is also visually rejected; it
is not an approved style baseline or active acceptance candidate. Review tooling
imports this module directly for 24 deterministic frames;
`sprite-engine.js`, `engine/enemy-expansion-public.js`, `PUBLIC_ENEMIES`, editor
selectors, persistence, packs, kits, and exports do not import or expose it.
`engine/enemy-expansion-en-e03-calibration.js` separately freezes the visually
approved four-direction Hill Breaker F1 seed on the shared `humanoid-v1`
chassis. `engine/enemy-expansion-en-e03-giant-idle.js` composes that exact seed
with the visually approved F2 to form the exact two-frame Idle baseline. Both
approval records remain internal. The separately imported
`engine/enemy-expansion-en-e03-centaur-calibration.js` reuses only the approved
`humanoid-v1` upper chassis, replaces its lower body with a bounded four-hoof
horse form, and freezes one visually approved Steppe Hunter F1 seed in its own
internal registry. `engine/enemy-expansion-en-e03-centaur-idle.js` delegates F1
back to that frozen renderer and adds the visually approved planted-hoof F2 as
an internal two-frame Idle baseline. The separate
`engine/enemy-expansion-en-e03-satyr-calibration.js` registry reuses the
approved humanoid chassis and approved Goatfolk horn/ear overlay grammar,
replaces the lower stance with bounded digitigrade legs and split hooves, and
adds a direction-aware tail plus crooked staff for the Briar Reveler F1
approved seed. `engine/enemy-expansion-en-e03-satyr-idle.js` delegates F1 back
to that frozen renderer and adds the visually approved F2 inward-hock settle,
tail flick, and one-pixel staff dip as an internal two-frame Idle baseline.
`engine/enemy-expansion-en-e03-giant-walk.js` is the separately authorized and
visually approved Hill Breaker common Walk baseline. It delegates both approved
Idle frames exactly, adds only W1-W4 for Down/Left/Right/Up, rejects Attack and
every other family, and keeps an empty approved/public family view. Its focused
checker freezes the approved Idle digest, both candidate PNG hashes, and the
16-frame Walk digest while enforcing connected hard-alpha silhouettes, planted
contact, three foot-contact silhouettes per direction, and the deliberate
W2/W4 shared passing pose.
`engine/enemy-expansion-en-e03-centaur-walk.js` delegates both approved
Steppe Hunter Idle frames byte-for-byte, adds only W1-W4 for the same four
directions, and draws three deterministic diagonal hoof-contact silhouettes,
rider/spear weight shift, and direction-aware tail response. Its focused gate
enforces connected hard-alpha hybrid silhouettes, two planted hoof contacts,
exact side mirroring, the deliberate W2/W4 passing pose, frozen board hashes,
and zero public exposure. `sprite-engine.js` imports none of these EN-E03
approval/candidate modules. Hill Breaker Walk and Steppe Hunter Walk are both
approved and internal. The approved
`engine/enemy-expansion-en-e03-satyr-walk.js` baseline delegates the approved
Briar Reveler F1/F2 Idle baseline exactly and adds only common W1-W4 with
reverse-jointed leg alternation, split-hoof contacts, tail response, and staff
counter-swing while covering the shared humanoid front-expression pixel in Up
so the rear head does not read as showing a side eye. Its focused gate enforces
16 connected hard-alpha horned
silhouettes, three contact/silhouette poses per direction with W2/W4 shared,
exact side mirroring, frozen boards/digest, and zero public exposure. The
bounded Hill Breaker common Attack A1-A4 continuation is now visually approved.
`engine/enemy-expansion-en-e03-giant-attack.js` implements that approved
internal baseline by delegating every approved Idle and Walk frame
byte-for-byte, then
adding only A1-A4 through the same sturdy humanoid/club chassis and Hill Breaker
identity overlay. An interim overlay-only body shift was rejected because it
read as sliding/jitter rather than animation. The replacement leaves the shared
humanoid renderer untouched and privately calls its `drawSprite` layer contract:
the body layer and Giant identity are assembled in a 24x24 buffer, the complete
upper rig is posed over anchored lower-body rows, and the club's back/front
layers retain their correct depth. A1 coils backward with the club, A2 releases
from center, A3 follows through and drops into impact, and A4 recovers. The
front/back extension carries the same transform through hip and upper-leg rows
while clamping above row 20, then restores the row-19 seam; both boot anchors
therefore remain exact even when the Down club passes in front of one boot. Side
poses retain their higher row-18 leg anchor. Its
strike cleanup trims only the generic attack's outermost
top/bottom overshoot so all 16 candidate frames retain the EN-E03 one-cell
margin. The focused gate requires 16 connected, distinct hard-alpha silhouettes,
planted contact, at least three torso-and-hip phases per direction, matched
side-profile bounds and visual weight, at least three front/back hip-and-upper-
leg phases, exact front/back foot anchors, frozen raw/Complete B + Form boards
and digest, and zero public exposure. Its gate also freezes the exact labeled
four-direction raw and Complete B + Form GIFs approved by the designer on
2026-08-07. The active
`engine/enemy-expansion-en-e03-satyr-attack.js` continuation delegates the
approved Briar Reveler Idle and Walk registries byte-for-byte and adds only
common A1-A4. It renders the native humanoid Attack upper body into a private
24x24 buffer, replaces only the lower stance with four planted split-hoof/hock
poses, and composes a cardinally connected crooked staff plus counter-sweeping
tail. A1 braces and draws back, A2 lifts, A3 moves torso and hocks into a
diagonal strike, and A4 returns to guard. Down and Up use separate staff-depth
routing, Up explicitly covers the shared front-expression pixel, and Left is an
exact mirror of Right. Its frozen approved gate enforces 16 connected
hard-alpha body-and-staff silhouettes, four distinct poses per direction, exact
hoof anchors, at least three body/lower-identity phases, one-cell margins,
deterministic raw/Complete B + Form boards and labeled GIFs, and zero public
exposure. Separate gate metadata records the designer's direct approval of both
exact labeled all-four-direction raw and Complete B + Form animations on
2026-08-07. The newly authorized
`engine/enemy-expansion-en-e03-giant-hurt.js` candidate composes only Hill
Breaker H1-H2 on top of that approved Giant chain. Idle, Walk, and Attack are
delegated byte-for-byte to their frozen renderers. H1 flashes and moves the
upper body and club together through a direction-aware recoil while fixed lower
rows preserve planted feet; H2 settles into a colored braced recovery. Its
focused gate requires eight connected, distinct hard-alpha silhouettes, exact
left/right visual weight, exact Down/Up foot anchors, one-cell margins, frozen
raw/Complete B + Form evidence, and zero public exposure. The designer approved
both exact labeled Down/Left/Right/Up raw and Complete B + Form GIFs together on
2026-08-07 with `approved`; the bounded branch is committed and pushed under
the approval-publication contract while remaining internal. Cast/Death aliases,
other Giant/Centaur/Satyr Hurt work, specialist/elite implementation,
registration, consumers, and later gates remain blocked.

Boss direction and animation assets live beneath `engine/assets/bosses/` so
the existing runtime `engine/` copy boundary carries them without changing the
build pipeline. Runtime PNGs are byte-identical to their review checkpoint.
The boss catalogs are public through `sprite-engine.js`, but they are
intentionally absent from production generators, procedural renderers, 24x24
sheet builders, game-pack planners, production rolls, and persistence
schemas. The editor reads the immutable PNG paths directly; its Boss state is
ephemeral and never changes the last ordinary Player/Enemy/Effect document.

Weapon entries include a broad content category (`blade`, `blunt`, `polearm`, `ranged`, or `magic`) plus player-facing Tier 2 through Tier 5 names. The separate stable `WEAPON_TIERS` catalog keeps progression independent from weapon type, producing 76 meaningful equipment states: none plus 15 weapons at five tiers. The UI, randomizer, presets, and exports consume both catalogs generically.

Shield entries likewise keep family and progression independent. `SHIELD_TIERS` exposes stable Tier 1 through Tier 5 ids, producing 41 meaningful off-hand states: none plus eight equipped shields at five tiers. Selecting no shield normalizes the tier to Tier 1, while old saved state and presets gain the backward-compatible Tier 1 default.

`OFFHANDS` is the separate catalog for non-shield held utility items. It
currently contains `none` and the approved `lantern`; these choices do not use
shield tiers. The editor and sanitizers enforce one left-hand occupant:
equipping a utility item clears the shield, equipping a shield clears the
utility item, and malformed specifications that contain both preserve the
shield. Missing or invalid legacy values become `none`.

Outfit entries carry player-facing Tier 2 through Tier 5 armor names, while the stable `OUTFIT_TIERS` catalog keeps armor progression independent from outfit family. The catalog now contains nine stable families; Barbarian Furs, Ranger Coat, Cleric Vestments, and Necromancer Robes append to the original five ids without reordering them. Every tier is cumulative inside the animated outfit pass: Tier 2 reinforces shoulders and waist, Tier 3 adds a readable crest, Tier 4 expands the pauldron silhouette, and Tier 5 adds an apex crown and luminous sigil. Legacy state defaults safely to Tier 1.

### Renderer

`engine/renderer.js` converts a sprite specification, direction, animation, and frame into pixels on a 24x24 canvas context. Its pixel buffer can optionally report every attempted out-of-canvas write, which lets validators distinguish real cropping from harmless edge contact. Humanoid body, shield, and headgear remain on their registered anchor during attacks, while the weapon uses a one-pixel perpendicular follow-through/recoil to preserve motion phases without leaving the cell. It owns procedural shapes, body-build silhouettes, armor-tier overlays, species traits, expressions, hairstyles, headgear, and family-specific drawing dispatch. Player specifications may include validated optional base/shadow overrides for skin, hair, and outfit; absent or invalid pairs fall back to the selected catalog colors. Classic is the pixel-identical legacy body default; Lean narrows the torso, Sturdy broadens it, and Heroic uses a wide-shouldered tapered profile. All four builds keep the established hand and equipment anchors, direction rows, and animation timing. Human remains the pixel-identical species compatibility default. Elf ears, Orc ears and tusks, Goblin ears, Tiefling horns and tails, Celestial wings and halos, broad Dwarf features, fixed-color Undead skulls and bone hands, Lizardfolk scales and tails, and Beastkin ears, muzzles, and tails follow the shared humanoid direction and animation rig through separate `species-back` and `species-front` passes. Skin-dependent traits use the resolved skin pair, Beastkin fur uses the resolved hair pair, and the two new tail families follow walk and attack motion. Full helmets suppress front traits while tails and wings remain available behind the body. Neutral is the pixel-identical legacy face default; Happy, Angry, Sad, Surprised, and Determined are drawn through a separate expression pass in every visible direction. Player glasses use open lenses so expressions remain visible, while full helmets suppress the entire expression pass. The 11 hairstyles include direction-aware Braids, Afro, Topknot, and Messy silhouettes; fitted headgear either preserves deliberate lower hair details or uses the shared compact short/spiky/bowl/topknot pass. The 12 headgear choices include outfit-colored Bandana and Plumed Helm art plus fixed-color Circlet and Skull Mask art. Open gear preserves expression pixels, while the Skull Mask intentionally covers them in visible directions. Humanoid enemies retain their established neutral faces independently. Optional facial details are layered only on visible faces, use the resolved player palettes where appropriate, mirror with the existing left/right renderer, and defer to headgear visibility rules.

The four expanded outfit families add direction-aware fur, coat-tail, vestment, and deathshroud identity passes plus family-specific tier materials while preserving the shared humanoid rig and the original five families pixel-for-pixel.

`engine/outline-renderer.js` owns the optional assembled-player and enemy outline treatment. For players and layered humanoid enemies, it requests the renderer's existing body, headgear, back/front weapon, back/front shield, and back/front utility-off-hand layers and merges them into three logical owners: body, weapon, and mutually exclusive shield/off-hand equipment. Headgear remains inside the body owner, while its concrete foreground layer is retained so contact logic can preserve every visible hat pixel. The body receives its mode-specific exterior contour. Equipment uses a cardinal exterior contour in both modes and admits an enclosed transparent component only when its area is at least five logical pixels, preserving large silhouette-defining openings while suppressing tiny construction pockets. A front/back humanoid neck-cavity pass finds the moving eight-pixel head-base/two-pixel-neck transition and ORs outline into only transparent cells directly beneath that head base. The untouched final renderer result is composited above those transparent-space contours, after which a layer-aware contact pass uses each concrete pass identity to place separators on the protected side of direct edge-sharing contact. Back-pass equipment receives an equipment-side separator; at body contact, front-pass equipment normally remains intact while the adjacent character-side boundary receives the separator. If that replacement would cardinally extend an existing dark body feature, the character pixel is preserved and the separator moves to the touching front-equipment pixel. At headgear contact, front-pass equipment receives an equipment-side separator while the hat stays unchanged. Three-way equipment/headgear/body contacts retain the continuous equipment-side headgear edge, with the feature-preserving rule independently deciding whether the body-side candidate remains. Diagonal-only proximity is left to the transparent-space contour so the contact pass cannot clip corners or endcaps. The contact pass does not change procedural source geometry or assets. None mode delegates directly to the original renderer so its pixels remain identical to the safe baseline.

`engine/pixel-buffer.js` owns the internal 24x24 color-string capture,
transparency, and run-paint helpers shared by assembled post-processes. It is
not a public import path. `engine/shade-renderer.js` owns the immutable None and
Form shade catalog, normalization, and the single assembled-output
coordinator. None plus outline None delegates directly to `drawSprite()`, and
existing outline modes route unchanged through the approved outline renderer.
The approved Form algorithm captures the original complete source without its
floor shadow, resolves known material ramps from player/enemy specifications,
applies a deterministic top-highlight/lower-and-right cool-shade transform,
and repaints only source-owned pixels that were not replaced by approved
outline or contact-separator geometry. Unknown colors use a bounded fallback;
INK, exact white, very dark features, transparent cells, and one- or two-pixel
accent components remain exact. Effects, generic source thumbnails, and
non-complete atomic layers always delegate untreated.

Non-humanoid enemies route through an approval-gated family registry. Connected
silhouettes use exterior contours; disconnected creatures use separated
component ownership with family-specific minimum component sizes; and selected
cavity-sensitive families preserve or deliberately contour authored openings.
This prevents small legs, sparks, droplets, lure pixels, and quills from
becoming black boxes while still contouring meaningful physical anatomy. All
57 families are enabled at `ac860aa`. Combat effects, source assets, floor
shadows, and atomic component sheets do not pass through the treatment.

Contact-converted source pixels are excluded only from casting a redundant exterior halo, so the separator stays one pixel thick without removing legitimate interior equipment contours.

`engine/weapon-renderer.js` owns humanoid weapon pixels, reusable blade-hilt primitives, shared down, up, and side pose anchors, and the weapon progression layers. Existing enemy-used weapon ids retain their original coordinates and Tier 1 pixels. Tier 2 adds stronger silhouettes and materials; Tier 3 builds on that geometry with legendary ornaments and effects; Tier 4 deliberately extends reach toward the safe frame limits. Tier 5 branches from the proven Tier 3 foundation instead of inheriting Tier 4's oversized overlay, then builds a purpose-made artifact silhouette with a weapon-specific palette, readable physical parts, restrained supporting effects, and distinct front, profile, and strike shapes. Staff, wand, and spellbook use separate player-only readable paths: the staff preserves a long counterweighted shaft and connected crown, the wand stays compact through every tier, and the book keeps a connected cover, spine, and page spread instead of detached casting particles or slab-like overlays; legacy enemy staves remain on their established renderer. All player tiers use the face-safe side offset and follow the animated hand's idle bob, walk swing, attack pose, and lunge through rig transforms supplied by the humanoid configuration.

`engine/shield-renderer.js` owns humanoid shield pixels, eight player shield silhouettes, direction-aware face depth, an equipment-owned hand grip, and shield progression layers. Equipment uses an object-space attachment rule: turning the character never applies a second relative turn to the shield. Every direction reuses the same broad-face artwork attached to the animated shield-hand socket. The ordinary two-by-two hand is replaced by a material-appropriate grip in the front equipment pass; a far shield face can therefore remain behind the reusable body without allowing skin pixels to reappear between arm and shield. The original facing direction survives the renderer's left/right mirror so only screen position and near/far torso occlusion change. Tier growth retains a fixed face origin extending outward from that grip instead of moving the attachment point. Tier 2 expands every Tier 1 silhouette with family-specific reinforcement, ornament, or magic rather than recoloring the base. Tier 3 builds cumulatively on those forms with readable legendary crowns, crests, points, royal bands, antlers, and astral ornaments in the unchanged broad-face view. Tier 4 deliberately expands every family toward the safe frame limits with mythic cores, wider wings and star points, taller crowns, fortress rails, longer fangs, and larger magical projections while retaining the underlying shield identity. Tier 5 branches from the cleaner Tier 3 foundation into eight independent artifact designs, each with a dedicated silhouette and material language rather than stacking another dense overlay on Tier 4. Player shields follow the exact hand socket through idle, walk, attack, recovery, and hurt while preserving visible face features. Humanoid enemies stay on the legacy shield path so expanding player content does not silently redraw established enemy sheets.

`engine/offhand-renderer.js` owns non-shield held utility pixels. The approved
Lantern follows the same animated left-hand socket while routing its far and
near geometry through dedicated `offhand-back` and `offhand-front` passes. It
hangs below and outside the body, does not require a glow effect, does not use
shield tiers, and yields completely to an equipped shield. Its two passes are
public atomic components and recompose the complete renderer exactly around
the reusable body.

`engine/effect-renderer.js` owns the transparent 24x24 trail, projectile, impact, and status geometry. `engine/combat-loadouts.js` maps player equipment and enemy attack styles to those modular effects without baking them into character art. Combat overlays are opt-in: `previewEffects` is false for new/reset state and is forced back to false whenever the editor starts. When manually enabled, the legacy compositor in `app.js` draws the complete character first and then draws every resolved effect with `clear: false`. That optional order can look cluttered and overwrite foreground shield, equipment, body, or headgear pixels, so its final occlusion rule is a deferred issue recorded in `HANDOFF.md`. It is not a reason to redraw approved shield source art, and it must not be documented as final until a future effect-enabled all-direction/all-attack-frame review is explicitly resumed and approved.

### Sheets and thumbnails

`engine/sheets.js` assembles renderer frames into the stable 20-column by 4-row
full sheet, selected-animation sheets with four direction rows,
selected-direction sheets with all 20 frame columns, and UI thumbnails. Its
option-aware assembled player/enemy paths use the shared assembled-output
coordinator; effects and ordinary source thumbnails retain the direct-render
path.

### Generators

`engine/generators.js` creates unrestricted random valid specifications and
safe default export names. Its existing `randomPlayer()` path is the editor's
Wildcard Roll and remains independent from Production policy.

### Production rolls

`engine/production-rolls.js` is the focused pure policy boundary for immutable
`production-v1`. It imports only stable catalogs and class-template policy,
normalizes portable string seeds, uses a deterministic PRNG and statically
bounded retry loop, validates catalog/class/tier/palette/visibility/silhouette
rules, and returns an ordinary player specification beside immutable audit
metadata. The accepted 120-pair review corpus, catalog ids, class equipment
pools, Form presentation, Effects Off choice, and no-outline-default decision
are frozen so later catalog drift fails validation until it is explicitly
classified. The module does not import the DOM, canvas, storage, renderers,
ZIP packaging, or editor state.

### Compatible Production rerolls

`engine/production-rerolls.js` is the focused pure boundary for immutable
`production-compatible-reroll-v1`. It accepts an ordinary player, explicit
Production class/power-tier/palette context, one semantic category, and a
portable seed. It enumerates the complete candidate catalog, filters every
candidate through `validateProductionPlayer()`, and returns a deep-copied
ordinary player plus immutable audit metadata. A no-alternative result returns
an independent unchanged player. The module imports only stable catalogs and
the Production policy; it does not access ambient randomness, DOM, canvas,
storage, renderers, ZIP packaging, or editor state.

### Wildshot game-pack contract

`engine/game-pack.js` is the pure contract and refusal boundary for the
proposed `wildshot-assembler` manifest v1. It owns the immutable native-1x
identity, 24px cell, direction/animation/timing layout, lower-kebab actor and
effect paths, stable manifest ordering, UTF-8 serialization, and validation
evidence for exact dimensions, binary alpha, required non-empty actor frames,
manifest/file parity, and license content. It imports only the stable internal
catalog facade and does not access DOM, canvas, storage, renderers, ZIP
packaging, filesystem, Tauri, or editor state.

`auditWildshotGamePackRuntime()` now passes the approved public
Idle/Walk/Attack/Cast/Hurt/Death contract. Players use the authored immutable
four-frame Cast and Death poses. Every Enemy explicitly aliases Cast to its
matching Attack frame and Death to Hurt frames 1, 2, 2, 2. Compact effect
extraction, deterministic folder/ZIP writing, and the one-click editor action
are later slices governed by `GAME_PACK_EXPORT_PLAN.md`.

### Equipment variant batches

`engine/variant-batches.js` is the pure, deterministic planner for ready-made equipment collections. It preserves one player identity while expanding weapon families, weapon tiers, armor tiers, shield families and tiers, or utility off-hands, then deduplicates identical complete specifications. Stable preset ids produce bounded collections of 16 weapon families, up to five current-weapon tiers, 76 weapon-arsenal states, five armor tiers, 41 shield-armory states, two utility-off-hand states, or one 121-sheet RPG equipment collection. It imports only catalogs and does not render, package files, access editor state, or touch the DOM.

### RPG class templates

`engine/class-templates.js` owns ten stable definitions: Warrior, Guardian, Ranger, Rogue, Mage, Cleric, Barbarian, Necromancer, Paladin, and Druid. The four expanded roles append after the original six ids. Each definition selects one outfit family, Tier 1 editor defaults, permitted weapon families, permitted shield families, and permitted utility off-hands. Its pure planner preserves character identity and custom colors, expands permitted weapons, armor, shields, and utility items, deduplicates complete specifications, records series membership, and assigns stable variant ids. The bounded results are 54 Warrior, 54 Guardian, 30 Ranger, 29 Rogue, 25 Mage, 40 Cleric, 24 Barbarian, 35 Necromancer, 39 Paladin, and 35 Druid sheets. It imports only public catalog data and does not render, package files, access editor state, or touch the DOM.

### Complete character kits

`character-kit.js` deterministically expands the player catalogs into one deduplicated component plan: skin-body, head, expression, hair, face-detail, species-back, species-front, outfit-back, outfit, headgear, weapon, shield, and utility-off-hand passes. It stores 119 hair sheets, six expression sheets, 60 content-unique species passes, 41 headgear sheets, and two Lantern passes beneath stable component paths. Species paths expand only on the palette axis that changes their pixels: skin for Dwarf and Lizardfolk traits, hair for Beastkin fur, and one fixed path for Undead traits. Short, spiky, bowl, and topknot share one pixel-identical fitted hair path, while outfit-colored headgear expands only the variants whose pixels actually change. Outfit and cape paths include the body-build id because those pixels define the silhouette; all other compatible layers remain shared. The resulting library contains 1020 outfit fronts, 140 cape backs, and 1912 component sheets total. It also expands all 80 public enemy families / 259 variants into stable `enemies/<family>/<variation>.png` paths and every combat effect into stable `effects/<category>/<effect>.png` paths for complete native sheets. Up to 24 named players are mapped to lightweight recipes that reference the shared character paths and carry their modular combat-loadout recipes. The standalone kit adds no per-recipe PNGs and contains 2196 PNGs total; the combined Complete Pack adds one assembled native sheet per player for immediate use and contains 2219 PNGs at the 24-player limit. The planner owns stable paths, counts, recipe limits, the native export scale, compatibility variants, and the runtime layer order. It imports catalogs only through `sprite-engine.js` and does not access the DOM, canvas, editor state, persistence, or ZIP implementation.

### Archive packaging

`zip.js` builds stored ZIP archives with UTF-8 paths and CRC-32 checksums. It accepts already-rendered files and has no knowledge of editor state, sprite specifications, or rendering internals.

`tools/export-all-enemy-outline-pack.mjs` is a local, public-roster-only CLI
adapter over `PUBLIC_ENEMIES`, `buildSheet()`, Form shading, and the approved
outline modes. It emits three stable top-level treesâ€”`outlined`,
`semi-outlined`, and `without-outlines`â€”with one native `480x96` complete sheet
for every public family/variant, plus a manifest, README, stored ZIP, and SHA-256
sidecar. `tools/check-all-enemy-outline-pack.mjs` independently decodes all PNGs
and the stored ZIP, checks the current 80/259 catalog boundary, all 80 non-empty cells,
hard alpha, per-treatment geometry order, hashes, and directory/archive parity.
The adapter does not import or expose incomplete EN-E03 registries, write
fixtures, alter public catalogs, or act as a release publisher. The current
export target contains 735 PNGs. The exact previously approved historical
67/232 delivery contains 696 PNGs and has ZIP SHA-256
`fd03895d8657b96293be14fbddbdb193ce62678c068023b58015410fc7f92b9c`.
The bounded tooling/docs checkpoint is committed and pushed at
`71fb59479626b757f112be3f9e56b92f24085208`.

### Gated release transport

`tools/pack-publisher.mjs` is an isolated GitHub-release safety boundary. It
refuses a dirty worktree, resolves the exact pushed source commit and remote,
checks GitHub authentication, and refuses a reused artifact tag before a
caller may publish immutable assets. `tools/check-pack-publisher.mjs` tests
those gates directly; it is intentionally separate from `npm run check`.

`tools/export-established-boss-pack.mjs` is a frozen 13-Boss transport command,
not an ordinary editor exporter and not part of the Wildshot actor game-pack
contract. At `bf6269c`, its publisher gate is present but its roster is not
compatible with the live Boss catalogs: Royal Night Elf Prince, Living Pyre,
Tide Man the Blue, and Dryad of Nature lack direction entries, and those four
plus Lava-Core Colossus, Abyssal Crown-Kraken, and Sun-Crown Griffin lack
animation entries. The command is therefore not release-ready even though
`npm run check:pack-publish` passes. Roster compatibility needs its own direct
gate before publication is allowed.

### Editor

`app.js` owns UI state, controls, animation playback and frame inspection, reset and comparison workflows, browser persistence, editable-document history, versioned named presets, character/export naming, reusable palette presets, combat-loadout recipes, equipment-batch, class-pack, and sprite-pack exports, Complete Character Kit rendering, and download behavior. It consumes sprite behavior only through the public engine facade, uses `character-kit.js` for deterministic component, enemy, effect, species, body-build, expression, hairstyle, headgear, and outfit coverage plus recipe mapping, and uses `zip.js` for packaging. History snapshots contain the active mode, assembled outline and shade treatments, player/enemy/effect specifications, active combat loadout, optional player palette, and document names, so preset loads, resets, shade changes, and saved-copy restores undo coherently while preview frame, direction, animation, cycle, speed, export-view, and comparison-copy choices remain independent. Production Roll extends history with the current effect-preview toggle and ephemeral compatible-reroll session so the resolved player, Form treatment, Effects Off, class, power tier, and palette family round-trip as one undoable action; ordinary editable, preset, comparison, persistence, and export snapshots remain unchanged. Thirteen supported Player groups expose an explicit secondary compatible action, while the existing arrows remain unrestricted category Wildcards. Armor routes to one semantic power-tier action; the pure combined left-hand category is not exposed as an ambiguous extra editor control. Category Wildcards and manual edits retain known context, whole-character Wildcard and Player document replacement clear it, and no-alternative results create no history entry. Enemy and Effect modes expose no compatible controls. The optional sanitized comparison snapshot persists locally with editor state but does not enter document history unless it is restored into the editor. The shade selector is rendered for Player and Enemies and hidden for Effects; effects neither receive Form nor overwrite the retained Player/Enemy shade choice. New and reset Player/Enemy editor documents use Form, while the engine option still defaults to None and missing/invalid shade metadata in versioned legacy presets, packs, and recipes migrates to None to preserve stored artwork.

Bosses use an ephemeral `workspaceMode` layered above the last ordinary
Player/Enemy/Effect document. Entering Boss does not call `setState()`, add a
fourth persisted kind, or record history. Pilot, direction, animation, frame,
speed, and playback are module-only review state. Reload therefore returns to
  the last ordinary mode. Ten animated pilots use dedicated 48x48 playback
  plus native 1x full/direction/animation downloads; four static entries use
the checkpoint-exact 48x192 direction sheet. Goblin War-Crown, Furious
Depraved Rhino, and Gunslinger Boar Rider remain explicit animation
candidates. Both animated and static paths bypass every ordinary
export/pack route.

The independently versioned persistence and export formats are:

| Format | Current version | Compatibility migration |
| --- | ---: | --- |
| Named preset library | 12 | accepts v1-v11; missing/invalid shade becomes None; missing/invalid offhand becomes none |
| Ordinary sprite-pack storage/manifest | 3 | accepts v1-v2; missing/invalid shade becomes None; missing/invalid offhand becomes none |
| Palette library | 1 | unchanged; shade is not palette data |
| Combat Loadout | 1 | unchanged; assembled `baseSprite` metadata records shade |
| Equipment Variant Batch | 3 | assembled source and every ready variant record shade and offhand |
| Class Pack | 3 | assembled source and every ready variant record shade and offhand |
| Complete Character Kit | 12 | recipes and assembled reference metadata record shade and offhand |
| Complete Character Pack | 12 | recipes and assembled sheets preserve each saved shade and offhand |
| Master Character Kit | 2 | adds atomic utility-off-hand passes; component sheets stay untreated |
| Master Roster Kit | 2 | adds shared atomic utility-off-hand passes |

Preset v10 and ordinary pack v1 already carried `outlineMode`; their pre-shade
sanitizers and load paths were repaired to preserve valid enemy outline values,
while missing or invalid legacy values migrate to None and effects remain
untreated. Shade integration deliberately advances the affected formats listed
above rather than conflating their contracts.

Production Roll and compatible category rerolls change none of these versions.
Every persistence and export
path receives only the resolved ordinary player specification plus the
existing outline, shade, name, loadout, and format metadata. Seed, archetype,
palette-family choice, validation decisions, and policy profile are
deliberately not serialized.

### Windows wrapper

`src-tauri/` owns the native window, application metadata, permissions, content-security policy, native file-dialog/file-write plugins, and packaging. `app.js` routes the shared PNG, JSON, and ZIP export helper through a native Save dialog when the Tauri APIs are present and retains browser downloads otherwise. The dialog-selected path dynamically scopes the narrowly permitted write; the application does not receive unrestricted file-system access. The wrapper does not contain a second renderer or editor implementation.

## Stable invariants

- Logical frame size is 24x24 pixels.
- Directions are ordered down, left, right, up.
- Each row contains idle x2, walk x4, attack x4, cast x4, hurt x2, death x4.
- Full sheets are 480x96 logical pixels before export scaling.
- Export scale 1x preserves those logical pixels exactly; full, animation, and direction exports also support 4x, 8x, and 12x nearest-neighbor scaling.
- Exported sheets have a transparent background and no baked shadow.
- Character-pack archives always contain complete full sheets at the selected scale plus a manifest that records their logical and actual dimensions.
- The proposed Wildshot game-pack profile is separate from those existing
  exporters and is locked to native 1x. Its 20-column
  Idle/Walk/Attack/Cast/Hurt/Death runtime gate now passes, while license
  content and compact effect extraction remain unresolved refusal boundaries.
- Class-pack archives preserve one character identity, contain only equipment permitted by their stable class definition, deduplicate complete specifications, and include one resolved modular combat loadout per ready sheet.
- Complete Character Kits always use native 1x sheets and the draw order `weapon-back`, `shield-back`, `offhand-back`, `species-back`, `outfit-back`, `outfit`, `skin-body`, `head`, `expression`, `species-front`, `face-detail`, `hair`, `headgear`, `shield-front`, `offhand-front`, `weapon-front`.
- Combat-effect sheets remain modular and unbaked. The current effects-after-character preview/recipe order is a compatibility fact, not a finalized foreground-equipment occlusion invariant.
- All 80 public enemy families support None, Complete B, and Selective C in live
  assembled rendering. The locked 57-family legacy gate covers 16,160 source
  frames; the cumulative expansion gate adds all 2,400 approved EN-E01/EN-E02
  frames, all 480 adopted EN-E03 frames, all 720 approved EN-E04 frames, all
  320 approved EN-E05 new-family frames, and all 640 EN-E06 frames with the
  same source-ownership and bounds guarantees. The replacement Ghoul is routed
  separately and checked against both its approved source and raw legacy target.
- The EN-F00 foundation registry remains empty and separate from `ENEMIES`;
  the stable approved and consumer registries contain exactly 23 expansion
  families / 57 variants. `PUBLIC_ENEMIES` is exactly 80 families / 259 variants
  and is the editor, randomizer, kit, pack, thumbnail, and export catalog. The
  underlying 57-family / 202-sheet / 16,160-frame legacy corpus remains
  unchanged and retains locked SHA-256 pixel digest
  `190a0f32b961b23fe0207c5a53fc005f9761666d27b15b98c0030325a10bef0c`.
- The 57 expansion variants retain their reviewed raw pixels at the registry
  and None/None dispatcher boundary. Optional assembled rendering may apply the
  shared Form/outline algorithms; exports remain shadow-free, while the live
  preview may add only the standard non-baked floor shadow.
- The original EN-E03 v1/v2 common-only registry remains rejected historical
  evidence with 24 review frames. The authorized adoption gate exposes only six
  completed full suites; Boulder Hurler, Storm-Clan Jarl, Sun Lancer, and the
  rejected studies remain isolated internal evidence.
- Shade None plus outline None directly delegates to `drawSprite()`. Shade None
  combined with Complete B or Selective C preserves the approved outline
  output. Form changes eligible source-owned colors only and is wired through
  Player/Enemy editor state, persistence, comparisons, previews, and assembled
  export metadata. Effects and atomic component sheets remain untreated.
- Complete Character Kit recipes support at most 24 saved players, reference only shared paths, add no PNGs, and must recompose the complete renderer pixel-for-pixel.
- Combined Complete Character Packs include one assembled native sheet per recipe and reuse the first assembled sheet as the reference preview instead of exporting a duplicate reference PNG.
- `production-v1` is seeded, deterministic, bounded, catalog/class frozen, and
  renderer-independent; its player result contains no provenance fields.
- Production Roll is a Player-only whole-document action that applies Form and
  Effects Off while preserving the current outline.
- Supported Player categories expose a separate compatible action only while
  explicit Production context exists. Existing category arrows and
  whole-character Wildcard remain unrestricted; compatible context is
  history-only and never serialized.
- `sprite-engine.js` remains the public import path.
- Boss pilots remain a separate 48x48 review contract: twelve approved
  four-direction sets plus Rhino and Unicorn candidates, ten full 20-column
  animation sets,
  four static entries, Down/Left/Right/Up row order, hard
  alpha, Effects Off, native 1x export, and no persistence or
  production-renderer claim.
- Browser and Windows builds use identical production files.

`npm run check` enforces these invariants against the native export contract, class and equipment planner counts, character-pack ZIP format, Complete Character Kit component matrix, recipe paths, exact pixel recomposition, `asset-pack/manifest.json`, and all 232 committed PNG fixtures. The current 20-column shade gate adds 480 broad player None-parity cases, exhaustive None parity for all 16,160 enemy source frames, 1,616 sampled enemy None/outline parity cases, 2,880 deterministic Form pilot cases, an exhaustive 16,160-frame enemy Form audit, 1,616 enemy Form/outline integration cases, and assembled full/direction/animation export forwarding checks. The Form matrix verifies source ownership, 164,685 protected pixels, unchanged outline/contact geometry, finite colors, exact floor shadows and transparent cells, 158,872 visible changes, and 35,333 material-aware pixel differences from the silhouette-only control. Weapon validation also enforces one connected silhouette in every frame, family and tier distinction, casting-family proportions, global Tier 5 pixel-density and bounds budgets relative to Tier 4, exact left/right mirroring, direction-aware front/back layer routing and recomposition, animation-phase diversity, front-view identity retention, catastrophic-detachment protection, zero discarded pixels across all 6,000 weapon frames, all 12,800 shield cases across four body builds, all 320 Lantern utility-off-hand cases, and 880 equipped-headgear cases, plus pixel/order parity for native full, direction, and animation sheet exports. The Lantern matrix checks animated hand attachment, face clearance, visible change, near/far routing, mutual exclusion, combat semantics, and exact layer recomposition. These structural checks do not replace explicit visual approval and do not resolve the deferred combined effect/shield compositor.

The nested `npm run check:enemy-expansion` gate additionally proves registry
immutability, duplicate/collision and missing-renderer refusal, planned-family
exclusion, deterministic family/slice review plans, exact legacy pixel parity,
and rejection of empty, clipped, translucent, reordered, or incorrectly sized
completed standard Enemy sheets.

The nested `npm run check:enemy-expansion-en-e02-consumers` gate proves exact
57/202 legacy preservation, current 80/259 public composition, and protected
approved pixel parity across all 2,400 EN-E01/EN-E02 editor/dispatcher frames
and all 30 native `480x96` sheets. It also exhausts 7,200 None/B/C
outline cases and 7,200 Form/outline cases across all 180 published expansion
palette colors.

The nested `npm run check:enemy-expansion-en-e04-consumers` gate proves generic
selector, persistence, randomizer, thumbnail, export, Kit/Pack, combat-default,
and Wildshot routing for Naga, Merfolk, and Birdfolk. It checks all 720 public
dispatcher frames, nine full sheets plus scoped sheet routes, 67,440 Complete B
additions, 64,380 Form-changed source pixels, 2,196 Complete Kit PNGs, all nine
Wildshot specs, and the frozen approved aggregate digest. The generic renderer
bridge suppresses full-frame resets but forwards deliberate regional clears so
Merfolk and Temple Rajah lower-body replacement pixels remain exact.

The nested `npm run check:enemy-expansion-en-e05-consumers` gate proves generic
routing for Mummy Tomb Walker, Vampire Night Noble, Revenant Grave Oathkeeper,
and Lich Soul Regent. It checks all 320 public dispatcher frames, four full
sheets plus scoped routes, 29,795 Complete B additions, 27,338 Form-changed
source pixels, the current 2,196-PNG Complete Kit, all four Wildshot specs,
the separately routed public Ghoul replacement, unchanged fixtures, and frozen digest
`947cec4df921761cd5eba378991d7a35b3d773d7e5c0e7c80526ecc6a846a46f`.

The nested `npm run check:approved-enemy-assembler-integration` gate owns the
current composition proof. It verifies all 15 newly exposed suites / 1,200
approved source frames, 1,200 None/Complete B/Form presentation triplets,
23/57 stable-consumer identity, 80/259 public composition, partial EN-E03
exclusion, explicit Ghoul replacement routing, sibling-Zombie preservation,
the frozen legacy Ghoul fixture, Complete Kit/Wildshot coverage, and digest
`74953d1b8531be86bf3f551b15fc70aa4ff142d954763ad4183eb36e06fd6497`.

`engine/enemy-expansion-en-e06-fairy-idle.js` owns the first private Wave 2
identity boundary. It freezes five EN-E06 family contract cards and the exact
approved Bramblewing Scout Idle F1-F2 pixels. Its dedicated
`small-winged-fey-v1` renderer paints a compact ground-clear body and connected
leaf-veined wings directly under the standard 24x24 binary-alpha contract.
Suggested translucency comes only from transparent negative-space windows
inside opaque connected wing rims and veins; partial alpha and glow, pollen,
sparkle, trail, or impact pixels remain absent.

`engine/enemy-expansion-en-e06-fairy.js` is the separate private motion layer
for that same one-sprite pass. Idle delegates to the approved source path and
is checked byte-for-byte across all eight direction/frame cases. Walk adds four
hover-travel phases; Attack adds four poses with a connected body-held thorn
needle; Cast aliases Attack exactly; Hurt supplies white recoil plus colored
brace; Death aliases Hurt H1,H2,H2,H2. Left is rendered as the exact mirror of
Right. The approved full registry contains only Bramblewing Scout and exposes
zero public families. Neither approved Fairy module is imported by
`sprite-engine.js`; the
stable registry, `PUBLIC_ENEMIES`, selectors, persistence, packs, exports, and
fixtures remain unchanged.

The nested `npm run check:enemy-expansion-en-e06-fairy-idle` gate retains the
approved eight-frame identity digest
`017464b22419f24d2bec6988effe1e36695da0ded04e31d84954eb9941e7893f`.
The nested `npm run check:enemy-expansion-en-e06-fairy` gate proves 80/80
connected, bounded, ground-clear frames, exact Idle preservation, side mirrors,
Cast/Death aliases, hard-alpha wing windows, deterministic raw/Complete B +
Form evidence, the historical source-checkpoint 74/245 public state, and candidate digest
`0cb24229c55bc9e719dc288ac57ec87c7fba4c4d244bd5e0273e757af09da9a3`.
The designer approved the exact hash-frozen full suite on 2026-08-09. The
bounded implementation is published at `cc92ca9`; another Fairy variant, Hag
art, registration, fixtures, effects, and later Wave 2 work remain separate
gates.

`engine/enemy-expansion-en-e06-fairy-thistle-hexer.js` is the next private,
content-only variant boundary. It does not change the shared renderer,
interfaces, exporters, validators, or 20-column frame contract. Its dedicated
`small-winged-fey-v1` data paints a rose-skinned specialist with violet hair
and robe, connected folded thistle wings, thorn crown, bronze fasteners, and an
attached focus. Binary alpha and negative-space wing windows remain exact;
curse motes, glow, projectiles, trails, impacts, and summoned briars stay in
the external effects layer. Walk uses four translated hover poses; Attack uses
four connected-focus poses; Cast aliases Attack; Hurt supplies white recoil
and colored brace; Death aliases H1,H2,H2,H2; Left mirrors Right exactly.

The nested
`npm run check:enemy-expansion-en-e06-fairy-thistle-hexer` gate exhausts all 80
candidate frames and the 80 approved Bramblewing comparison frames. It proves
80/80 pixel and alpha-silhouette distinctions, connected one-cell-bounded
ground-clear structure, exact aliases/mirrors, deterministic raw/Complete B +
Form/comparison evidence, the historical source-checkpoint 74/245 public state, and candidate digest
`675b5a8957efdc81c07ae53c4b013ad8229847fc84d9b1c0c8da4ad09e6a4534`.
The module remains outside `sprite-engine.js`; at its publication checkpoint,
Petalcrown Duelist, Hag, registration, fixtures, effects, and release remained
closed. The exact boards
were opened in Aseprite and approved with `awesome! approved` on 2026-08-09;
technical passage remains supporting evidence. The exact bounded implementation
is published at `3dc68cb`.

`engine/enemy-expansion-en-e06-fairy-petalcrown-duelist.js` is the separately
authorized third private Fairy boundary. It remains content-only: no shared
renderer interface, exporter, validator, schema, frame-contract, facade, public
catalog, or fixture path changes. Its `small-winged-fey-v1` renderer paints a
wider elite silhouette with dark-teal hair, rose petal armor, broad pale-pink
crown-wings, green leaf joints, gold clasps, and a connected silver-blue petal
rapier. Binary alpha and crown-wing negative space remain exact; dash trails,
petal motes, wind arcs, detached blade glints, impact flashes, and detached
petals stay external. Walk uses four aerial-fencing phases; Attack uses four
connected-rapier phases; Cast aliases Attack; Hurt supplies white recoil and
colored brace; Death aliases H1,H2,H2,H2; Left mirrors Right exactly.

The nested
`npm run check:enemy-expansion-en-e06-fairy-petalcrown-duelist` gate exhausts
all 80 candidate frames plus both 80-frame approved Fairy suites. It proves
80/80 pixel and alpha-silhouette distinctions from Thistle and again from
Bramblewing, connected one-cell-bounded ground-clear structure, exact aliases
and mirrors, 72/72 colored crown-wing frames, 8/8 white flashes, deterministic
raw/Complete B + Form/three-Fairy comparison evidence, the historical source-checkpoint 74/245 public
state, and candidate digest
`69de53e0b10aa80ef10afa7e3e8b6a9d913af81a365535f52e3f4be71945bd5c`.
The gate is an approved internal lane published at bounded implementation
checkpoint `b265e97`. Approval-state fast validation passes in `54.9s`
and full validation passes in `107.2s`, with all 232 fixture sheets unchanged.
That published checkpoint left Hag closed. The later explicit `lets do nextr`
continuation opened only the isolated Mire Crone candidate below.

`engine/enemy-expansion-en-e06-hag-mire-crone.js` is the first private Hag
boundary. It is content-only and imports no public facade path. Its dedicated
`stooped-feral-fey-humanoid-v1` renderer authors moss skin, rope-gray hair, a
hooked profile, long connected claw arms, mud-dark shawl, bowed trunk, and
planted splayed feet directly inside the standard 24x24 hard-alpha cell. The
absence of hat, staff, robe, familiar, and cauldron keeps the silhouette distinct
from the equipped public Witch. Hex bursts, thrown charms, fumes, familiars,
auras, claw trails, and impacts stay external.

The nested `npm run check:enemy-expansion-en-e06-hag-mire-crone` gate exhausts
all 80 candidate frames plus the public Witch comparison and all three approved
Fairy suites. It proves connected one-cell-bounded grounded structure, exact
side mirrors and Cast/Death aliases, 80/80 pixel and alpha-silhouette
distinctions from Witch, deterministic raw/Complete B + Form/comparison
evidence, the historical source-checkpoint 74/245 public state, and candidate digest
`f35512e73fd7b2308bf408f11c2d21a30631361214a372df7bef2e8fc4e6478d`.
The exact review packet passed the visual gate on 2026-08-09 and the bounded
implementation is published at `25f67d4`. The lane remains absent from
registration, fixtures, effects, and release; later Hags and families stay
separate gates.

`engine/enemy-expansion-en-e06-hag-cauldron-hexer.js` is the separately
authorized specialist Hag boundary. It derives from the exact approved Mire
Crone pixels without modifying that source, recolors the material planes, and
adds a connected copper ladle, bottle belt, and brewer apron. Orthogonally
rasterized tool bends and a connected specialist edge cue guarantee one true
four-neighbor silhouette and 80/80 alpha distinctions from Mire Crone. The
cauldron and every brew/fume/projectile effect remain external.

`npm run check:enemy-expansion-en-e06-hag-cauldron-hexer` exhausts all 80
candidate frames, approved Mire Crone, and the three approved Fairy suites. It
proves connected bounded grounded structure, exact aliases/mirrors, 80/80 Mire
pixel and alpha distinctions, the historical source-checkpoint public 74/245 state, deterministic
five-artifact evidence, and candidate digest
`17f40220730fe4e83be26156d73e0599235be66a9290284b37cb9c8282c7a1a6`.
The exact packet passed visual approval on 2026-08-09 and the bounded
implementation is published at `4b59b40`. The later Blackthorn Matron remains a
separate content-only gate; registration, fixtures, effects, and Dryad stay closed.

`engine/enemy-expansion-en-e06-hag-blackthorn-matron.js` is that isolated elite
Hag boundary. It derives from approved Mire Crone motion without changing the
source, then recolors the material planes and adds body-connected hooked crown,
briar pauldron, torso-plate, and reinforced-claw geometry. Dynamic opaque-edge
anchors keep every authored thorn attached across all poses while clamped to the
standard one-cell margin. Detached thorns and every trail, mote, hex, charm,
fume, familiar, and impact remain external.

`npm run check:enemy-expansion-en-e06-hag-blackthorn-matron` exhausts all 80
candidate frames, both approved Hags, and all three approved Fairies. It proves
connected bounded grounded structure, exact aliases/mirrors, 80/80 pixel and
alpha distinctions from both Hags, the historical source-checkpoint public 74/245 state,
deterministic five-artifact evidence, and candidate digest
`d4588d754e01dbb4916949f27b801342a310706890a0532a0133216d7cb0c7a9`.
The exact packet passed visual approval on 2026-08-09 and the bounded
implementation is published at `8ce2f2a`. Registration, fixtures, effects,
and release stay closed. The later `cool next please` opened only Grove Tender.

`engine/enemy-expansion-en-e06-dryad-grove-tender.js` is the first private
Dryad boundary. It derives deterministic upright motion from an existing
humanoid content source without modifying it, remaps the material planes to
bark, heartwood, sapwood, leaves, and blossoms, then adds connected leaf-mantle,
forked-branch-arm, trunk-ridge, and root-hem geometry. Dynamic opaque-edge
anchors keep every authored branch and leaf attached inside the one-cell margin.
Vines, spores, roots, detached leaves, pollen, summoned plants, trails,
projectiles, and impacts remain external.

`npm run check:enemy-expansion-en-e06-dryad-grove-tender` exhausts all 80
approved frames, public Treant, approved Blackthorn Matron, all three approved
Hags, and all three approved Fairies. It proves connected bounded grounded
structure, exact aliases/mirrors, 80/80 pixel and alpha distinctions from both
comparison actors, the historical source-checkpoint public 74/245 state, deterministic five-artifact
evidence, and approved implementation digest
`18fedaf06c457c8a280b3c5518b0763be48de3b3cb5bd29113f0fd5d183e3a21`.
The exact boards and GIFs were visually approved on 2026-08-09 and the bounded
implementation is recorded at `3d96fed`, with published approval handoff
`4c49f27`. `engine/enemy-expansion-en-e06-dryad-spore-cantor.js` forms the
second approved private Dryad boundary on `codex/en-e06-dryad-spore-cantor`:
it derives from the immutable Grove renderer, remaps its material planes, and
attaches a connected fungal crown, gill collar, shelves, fruiting bodies, and
canting attack geometry. Its hash-frozen 80-frame suite passes 80/80 connected,
bounded, grounded, Treant-distinct, and Grove-distinct gates at digest
`b22585e7b055f4ae43eb1293741967c1d76ec9bd3b842320880f2038c0cf62ef`.
The exact raw and Complete B + Form boards, comparison board, and paired GIFs
were visually approved on 2026-08-09. The bounded implementation is published
at `46d1dc9`, with approval record `61d1fa4`. Spore clouds and motes remain
external. At that checkpoint registration, fixtures, Heartwood Warden, effects,
release, and broader Wave 2 work stayed closed.

`engine/enemy-expansion-en-e06-dryad-heartwood-warden.js` is the later isolated
elite Dryad candidate boundary. It derives deterministic motion from the
immutable Grove renderer, remaps the material planes to deep heartwood, warm
cambium, evergreen leaves, ironwood plates, and amber growth rings, then adds
connected branch pauldrons, crown prongs, heartplate, root greaves, and a
forking warding arm. Dynamic opaque anchors keep every authored armor and branch
pixel attached inside the one-cell margin. Protective auras, sap glow, bark
shards, detached leaves, acorns, vines, roots, shield blooms, summoned plants,
trails, projectiles, impacts, and ground cracks remain external.

`npm run check:enemy-expansion-en-e06-dryad-heartwood-warden` exhausts the exact
80-frame candidate, public Treant, both approved Dryads, and all earlier
approved EN-E06 sources. It proves connected bounded grounded hard-alpha
structure, exact aliases and mirrors, 80/80 pixel and alpha distinctions from
all three comparison actors, unchanged public 80/259 and two-variant Dryad
boundaries, deterministic five-artifact evidence, and candidate digest
`fb7b50a0fefda66995c5e81f3e07c0c080893902a33d304066e79fb8181cd97c`.
The exact packet was visually approved on 2026-08-09. Its frozen implementation
`8a790e3f0d02cf64763733f83d17890c79ce83fc` and approval record
`d8c13bb008e3a186daa73a37eec87c707f30365f` are committed and pushed on the
tracked branch. The later isolated Barrow Stalker module keeps one complete
common Redcap in a private one-family registry. Its cap-heavy, hook-connected,
iron-boot silhouette passes 80/80 pixel and alpha distinctions from public
Goblin Scout, public Hobgoblin, and approved Mire Crone at digest
`1719f8611f212cfbacf041fc8459d3f52390b05aa73e0a1d50203554845051f1`.
The exact five-artifact packet was visually approved on 2026-08-10. Its frozen
implementation `c3544dc4ec06e06afb15ea699333119342a8946f` and approval record
`8e2054236a49ab06b7cac404cda8b12bb440085c` are committed and pushed on the
tracked branch. At that published checkpoint, registration changes, fixtures,
later Redcaps, Nymph, effects, release, and later Wave 2 work remained closed.
The separately authorized Ironboot Trapper
module keeps one complete specialist Redcap in another private one-family
registry. Its flat riveted cap, buckle harness, connected setting tongs,
leather apron, and square iron boots pass 80/80 pixel and alpha distinctions
from public Goblin Scout, public Hobgoblin, and approved Barrow Stalker at
digest `31c37fd25d688bd295c2fb84bdb437141149cf43986b6edcc4141467bc32bdf1`.
The exact five-artifact packet was visually approved on 2026-08-10. Its frozen
implementation `98865936244b94860985210fcaf9a044b0ca228a` and approval record
`00a9876f963522c88b9cd77f809bec3674d72b19` are committed and pushed on the
tracked branch. The later authorized Bloodcap Reaver module keeps one complete
elite Redcap in a third private one-family registry. Its torn high cap, plated
shoulder mass, reinforced boots, and connected broad cleaver pass 80/80 pixel
and alpha distinctions from public Goblin Scout, public Hobgoblin, approved
Barrow Stalker, and approved Ironboot Trapper at digest
`e9a41fd37e19d96911cfffee3bd89e3859f9cbb95099996632f877da2dbdabff`.
All 80 frames are connected, bounded, grounded, and hard-alpha; the exact
five-artifact packet was visually approved on 2026-08-10 after its three exact
PNG boards were opened together in Aseprite. Its frozen implementation
`1a1ba00ea1edfa6e8bd946e95f5e35c6080ce73a` and approval record
`5c55af26481f9a79988382df3d67b8ff33b765a4` are committed and pushed on the
tracked branch. It remains private. The later Spring Dancer module keeps one
complete common Nymph in a private one-family registry. Its flowing hair,
ribbon dress, open arms, and dance steps pass 80/80 pixel and alpha distinctions
from Elf Mage, Bramblewing Scout, and Grove Tender at digest
`b68906d962e16611384e419610324c6a9934d63ab329963f0734e83255dabe8c`.
All 80 frames are connected, bounded, grounded, and hard-alpha. The five exact
artifacts were opened together in Aseprite and visually approved on 2026-08-10.
Frozen implementation `9d6366b0c5456704137aadfbbec9a67eccb5fd7c` and approval
record `eae49376fd7bc4dd315168cb2989293de4a73f55` are committed and pushed on
the tracked branch. It remains private. Later Nymphs, registration, fixtures,
effects, release, and Wave 2 stay closed.

The nested `npm run check:enemy-expansion-repairs` gate proves that exactly the
approved 18 renderer-data records differ from the pre-repair registry and locks
the seven affected families' Walk contacts, hard alpha, margins, clipping, and
reported seam coordinates. The nested
`npm run check:enemy-expansion-en-e03` gate validates three internal common
variants / 24 Idle frames, connected and distinct silhouettes, true four-hoof
Centaur contacts, Giant/Satyr scale distinctions, exact side mirroring,
Complete B/Form ownership, non-Idle refusal, and zero public exposure.
The nested `npm run check:enemy-expansion-en-e03-giant-walk` gate validates the
approved Hill Breaker Walk baseline across 16 frames, preserves all eight
approved Idle frames exactly, freezes both review hashes and the candidate
digest, and proves zero facade/public exposure. Its paired review generator
reproduces the ignored raw and Complete B + Form boards; the separate gate
metadata records the 2026-08-06 designer approval. The nested
`npm run check:enemy-expansion-en-e03-centaur-walk` gate validates the approved
Steppe Hunter baseline across 16 Walk frames, preserves all eight approved
Idle frames exactly, enforces connected hard-alpha hybrid silhouettes, three
hoof-contact poses per direction, exact side mirroring, and zero facade/public
exposure, and freezes both review hashes and the candidate digest. Its paired
review generator reproduces the exact ignored raw and Complete B + Form boards;
separate gate metadata records its direct visual approval.

The nested `npm run check:enemy-expansion-en-e03-centaur-attack` gate validates
the approved Steppe Hunter Attack baseline across 16 A1-A4 frames while
delegating all 8 approved Idle and 16 approved Walk frames byte-for-byte. The
private renderer reuses the approved humanoid upper chassis and exported
Steppe horse-body helper, adds only a four-direction spear-lunge layer, retains
one connected horse-rider-spear silhouette and planted hoof contacts in every
frame, requires four distinct Attack silhouettes and at least three horse-body
weight phases per direction, preserves exact left/right mirroring and true
Down/Up depth attacks, and remains absent from `sprite-engine.js` and every
public registry. Its deterministic review generator freezes the raw and
Complete B + Form boards. The separately hashed `192x224` labeled GIF pair was
the direct visual-review surface approved on 2026-08-07; technical checks remain
structural evidence rather than the source of that approval.

`engine/enemy-expansion-en-e03-centaur-hurt.js` is the approved isolated
Steppe Hunter H1-H2 baseline. It delegates all approved
Idle, Walk, and Attack frames through the approved Attack renderer, then adds
only two Hurt frames. H1 paints the complete horse-rider-spear silhouette as a
white direction-aware recoil; H2 uses the source palette for a braced spear
recovery. A buffered whole-hybrid transform moves rider, spear, and horse mass
above four fixed lower hoof anchors, restores the connection seam, preserves
one-cell margins, and mirrors the complete Right profile exactly for Left. Up
draws its spear behind the rider and retains the rear-facing head treatment.
The module remains absent from `sprite-engine.js`, public registries, selectors,
packs, persistence, exports, and consumers; Cast and Death aliases are refused.

The nested `npm run check:enemy-expansion-en-e03-centaur-hurt` gate proves
byte-exact delegation of 8 Idle, 16 Walk, and 16 Attack frames; eight connected,
distinct hard-alpha horse-rider-spear Hurt silhouettes; fixed four-hoof anchors;
exact side mirroring; true Down/Up depth distinction; one-cell margins; frozen
board/GIF hashes; Complete B/Form behavior; and zero facade/public exposure.
Its deterministic review generator writes two `1134x744` comparison boards and
four labeled `192x224` animation-panel PNGs used by the raw and Complete B +
Form GIF pair. Passing remains structural evidence rather than visual
acceptance. The designer directly
approved both exact labeled all-four-direction GIFs together on 2026-08-07;
the bounded branch is committed and pushed under the publication contract.

The nested `npm run check:enemy-expansion-en-e03-satyr-attack` gate validates
the approved Briar Reveler Attack baseline across 16 A1-A4 frames while
delegating all 8 approved Idle and 16 approved Walk frames byte-for-byte. It
requires one connected body-and-staff silhouette, planted split-hoof anchors,
four distinct staff/silhouette poses per direction, at least three torso/hock/
tail phases, exact side mirroring, distinct Down/Up depth, one-cell margins,
binary alpha, frozen board/GIF hashes, and zero facade/public exposure. Its
paired generator reproduces both deterministic `1950x870` boards and the eight
`192x224` labeled animation-panel PNGs used for the required raw and Complete B
+ Form GIF pair. Passing remains structural evidence; the exact GIF pair was
separately approved by the designer on 2026-08-07 with `very good! approved`.

`engine/enemy-expansion-en-e03-satyr-hurt.js` is the approved isolated Briar
Reveler H1-H2 baseline. It delegates all 8 approved Idle, 16 approved
Walk, and 16 approved Attack frames through the approved Satyr renderer chain,
then authors only two Hurt frames. H1 flashes the complete connected horned
body, tail, hands, staff, reverse-jointed legs, and split hooves white while
recoiling around fixed ground contacts. H2 drops into a colored brace with a
new torso, hock, tail, grip, horn, and crooked-staff pose. Right is composed
once and mirrored exactly for Left. The Up head replaces the generic Hurt
face patch with the already approved Briar rear-depth construction, then
explicitly suppresses the shared front/side eye pixel. Cast/Death aliases,
facade exports, public registries, selectors, packs, persistence, consumers,
effects, and release remain absent.

The nested `npm run check:enemy-expansion-en-e03-satyr-hurt` gate proves exact
delegation of all 40 approved context frames; eight connected, distinct,
hard-alpha Hurt silhouettes; four fixed split-hoof tips per frame; exact side
mirroring; distinct Down/Up depth; one-cell margins; rear-head eye suppression;
frozen board/GIF hashes; Complete B/Form behavior; and zero facade/public
exposure. Its deterministic review generator writes two `1134x744` comparison
boards plus four `192x224` labeled animation panels used by the required raw
and Complete B + Form two-frame GIF pair. Passing remains technical evidence
rather than visual approval. The designer separately reviewed both exact GIFs
together and said `approved lets do next` on 2026-08-07; the bounded branch is
committed and pushed under the publication contract.
With the complete ignored 1,064-file Boss checkpoint corpus present, the full
`npm run check` also passes without changing the 232 public fixture sheets.

`engine/enemy-expansion-en-e03-common-aliases.js` is the isolated
approved common Cast/Death alias boundary for Hill Breaker, Steppe
Hunter, and Briar Reveler. Three family-specific wrapper renderers delegate
Idle, Walk, Attack, and Hurt directly to their approved Hurt registries. Cast
C1-C4 remaps to approved Attack A1-A4 frame-for-frame; Death D1-D4 remaps to
approved Hurt H1,H2,H2,H2. The wrappers change only requested/rendered frame
metadata after the approved source renderer paints, so they author zero sprite
pixels. All families remain `implemented`, internal, and absent from the public
facade, selectors, packs, persistence, consumers, effects, and release paths.

The nested `npm run check:enemy-expansion-en-e03-common-aliases` gate proves
byte-exact delegation of 144 approved context frames, 48/48 Cast aliases,
48/48 Death aliases, hard alpha, one-cell margins, frozen board/GIF hashes,
Complete B/Form behavior, zero new sprite pixels, and zero public families.
Its deterministic review generator writes paired `1120x562` boards and sixteen
`576x224` animation frames used by four required GIFs: Cast raw, Cast Complete
B + Form, Death raw, and Death Complete B + Form. Every GIF shows all three
families and all four labeled directions. Passing remains technical evidence.
The designer separately reviewed all four exact GIFs together and said
`approved` on 2026-08-07; the bounded branch is committed and pushed under the
publication contract. The designer then said `good lets do next`; only the
Boulder Hurler two-frame Idle baseline is authorized next. Its boulder remains
an external projectile boundary, and every other variant, animation,
integration, effect, release, and later EN-E03 gate remains closed.
With the complete ignored 1,064-file Boss corpus present, the full project gate
also passes without changing any of the 232 public fixture sheets.

`engine/enemy-expansion-en-e03-giant-specialist-idle.js` is the isolated,
approved Boulder Hurler specialist baseline. It reuses the approved
humanoid chassis but exposes only Giant/Boulder Hurler Idle F1-F2 internally.
The actor is explicitly unarmed: long throwing arms, wrist wraps, a diagonal
sling harness, and a cool slate hide palette carry the identity while the
boulder remains outside the actor as a future projectile boundary. No approved
Hill Breaker, Steppe Hunter, Briar Reveler, alias, public facade, selector,
consumer, effect, persistence, pack, or release path is modified.
F1-F2 now forms a slow `480ms` grounded stance cycle: the shared chassis keeps
the lower body controlled while F2 lowers the shoulders/harness, lets the hands
lag and move inward, and bends the side-view throwing hand toward the torso.

The nested `npm run check:enemy-expansion-en-e03-boulder-hurler-idle` gate
proves exact preservation of all eight approved Hill Breaker Idle frames,
eight connected hard-alpha candidate silhouettes, exact side mirroring,
distinct Down/Up views and F1/F2 poses, one-cell margins, deterministic frozen
boards/GIFs, zero baked projectile pixels, and zero public families. Its review
generator writes paired `1528x650` boards and two `192x224` labeled animation
frames for each raw and Complete B + Form GIF. Passing remains technical
evidence. The designer separately reviewed both exact improved GIFs together
and said `approved` on 2026-08-07; the bounded branch is committed and pushed
under the publication contract. The later public-roster-only three-treatment
export was delivered and approved with `awesome lets do next in plan`; it does
not change any sprite source or registry boundary. That statement authorized
only Storm-Clan Jarl elite Idle F1-F2 across four directions. The isolated
`enemy-expansion-en-e03-giant-elite-idle.js` module now implements that exact
internal, non-public, two-frame renderer with layered plate and a bright cyan
cloth clan sash while storm arcs, lightning, and impact cracks remain external.
After the designer identified a misplaced side shoulder, the forward pauldron
was seated one row lower and one pixel back over the upper-arm joint in both
exact mirrored side views. The designer reviewed both corrected labeled
all-four-direction raw and Complete B + Form GIFs together and said `approved`
on 2026-08-07. The bounded implementation is committed and pushed at
`d9c3dedf521a1a1a6ad0b82f458bf38cf8fa9533`. All other animation, variants,
registration, consumers, effects, release, and later work remained gated at
that checkpoint. The designer then said `lets do next`; following documented
EN-E03 family order, the isolated
`enemy-expansion-en-e03-centaur-specialist-idle.js` module now implements only
Sun Lancer Idle F1-F2 as an internal, non-public acceptance candidate. It
delegates the approved Steppe Hunter rider-horse-lance chassis, then adds
direction-aware sun-gold armor, red-gold saddle tack, and a bright lance
pennant. The lower horse and all four hoof contacts remain byte-exact; charge
dust, spear trails, and hoof shock rings remain external. Focused and full gates
pass without changing any of the 232 public fixture sheets. The designer
approved both exact all-four-direction raw and Complete B + Form GIFs together
on 2026-08-07. The bounded implementation is committed and pushed at
`f5057497bc0b9ee62b79c5d8a94efecfd49c0ec9`. All other animation, variants,
registration, consumers, effects, release, and later work remain gated.

The designer then said `lets do next`; following the documented Centaur role
order, the isolated `enemy-expansion-en-e03-centaur-elite-idle.js` module now
implements only Banner Khan Idle F1-F2 as an internal, non-public approved
baseline. Its first Sun-Lancer-derived overlay and targeted repair are both
rejected. The from-scratch implementation delegates only the approved Steppe
Hunter renderer, preserving the four-hoof chassis and all lower horse pixels,
then draws a new elite identity with a visible face, compact conical steel helm,
segmented blue-steel lamellar armor, crimson command cloth, limited saddle
drape, and a separated tapered war standard. Command aura, banner flare, and
hoof shock rings remain external. The latest bounded revision replaces only the
exact mirrored side-face pixels with a stepped forehead, protruding nose,
visible eye, cheek, and tapered jaw, then reduces the side mouth to one front
pixel with a skin-tone jaw separator. The later pale horizontal side-profile
streak was the six-pixel light fur collar; only that mirrored collar now uses a
compact stepped two-tone shape with a two-pixel pale highlight. The latest
revision adds a Banner Khan-only planted horse-torso shift in F2 while every
leg and hoof pixel remains delegated byte-exact.
Focused and full gates pass without changing any of the 232 public fixture
sheets. The designer reviewed both exact labeled all-four-direction r3 GIFs
together and said `approved` on 2026-08-07. The approved baseline is committed
and pushed at `55143049b4153e34fcdaad0ea434932ba0f2d0fd`. All other animation,
variants, registration, consumers, effects, release, and later work remain
gated.

After the designer separately said `lets keep going`, the isolated
`engine/enemy-expansion-en-e03-centaur-elite-motion.js` module now composes the
approved Banner Khan Idle renderer and approved Steppe Hunter Walk, Attack, and
Hurt motion sources into one internal/non-public approved grouped motion lane.
Idle delegates byte-for-byte. Walk retains the three-contact four-hoof cycle and
adds an alternating Banner Khan torso response. Attack moves the elite identity
with the approved spear/body phases and adds a saddle pole so the tapered war
standard stays connected while the lance attacks. Hurt applies the complete
white flash and colored recovery to the elite silhouette with fixed ground
anchors. Cast aliases Attack frame-for-frame; Death aliases Hurt H1,H2,H2,H2.
Only non-rendering helper exports were added to approved source modules, and
their frozen frame digests remain exact. The focused gate validates all 80 suite
frames, 80 connected hard-alpha silhouettes, 20 exact side mirrors, exact
aliases, deterministic raw/Complete B + Form boards and paired grouped GIFs,
and zero facade/public exposure. The full repository gate also passes without
changing any of the 232 public fixture sheets. The designer reviewed the exact
paired raw/no-outline and Complete B + Form all-four-direction GIFs together and
said `approved` on 2026-08-08. The approved lane is committed and pushed at
`8e73cd038d50037a40cad27ee9f2e37b6e363b69`; other variants, registration,
consumers, effects, release, and later work remain gated.

The separate `engine/enemy-expansion-en-e03-satyr-specialist-idle.js` module
now composes the approved humanoid renderer with the exact Briar Reveler Satyr
identity helpers for one internal/non-public Reed Charmer Idle lane. The
approved helper defaults remain unchanged; the specialist alone
suppresses the crooked staff, preserving horns, tail, digitigrade legs, and
split-hoof contacts before adding a compact direction-aware panpipe, connected
playing hands, teal woven vest, and gold sash. F2 retains the approved hock/tail
settle and moves the vest, pipe, and hands with the torso. Music notes, pollen,
charm rings, and all controller effects stay outside actor pixels. The focused
gate validates eight connected hard-alpha frames, four exact side mirrors,
frozen Briar Reveler pixels and evidence, deterministic raw/Complete B + Form
boards and paired GIFs, and zero facade/public exposure. The designer reviewed
both exact GIFs together and said `Approved` on 2026-08-08; the internal lane is
committed and pushed at `070f85b20c4ea77a75e35eb6d9eefd697f4b0b47`. The full
gate also passes in `184` seconds without changing any of the 232 public fixture
sheets;
Wildwood Hornlord, later motion, registration, consumers, effects, release, and
later work remain gated.

The separate `engine/enemy-expansion-en-e03-satyr-specialist-motion.js` module
composes the approved Reed Idle renderer and narrow default-preserving Briar
Walk/Attack/Hurt helpers into one internal/non-public complete motion suite.
Idle delegates byte-for-byte; Walk carries the pipe identity through the body
bob; Attack applies the frozen pipe/vest/hands identity to four participating
body shifts; Hurt adds that identity before the complete-silhouette flash; Cast
and Death are exact Attack/Hurt aliases. Deterministic `1428x760` boards,
`640x672` four-phase paired GIFs, an 80-frame digest, exact source locks, mirror
checks, hard-alpha connectivity, full-body motion checks, external-effect
boundaries, and zero facade exposure define the frozen visual gate. The
designer approved both exact paired GIFs on 2026-08-08; bounded publication
does not itself expand that gate to Wildwood Hornlord, consumers, registration,
effects, release, or later work.
The approved internal implementation is committed and pushed at
`f77c8a88b25cb59f5bdbe82708a620e5cae3fe9d`; no later gate is opened by publication.
The focused gate preserves every approved Reed/Briar source digest, and the
full repository gate passes in `187.1s` with all 232 validated PNG sheets
unchanged.

The separate `engine/enemy-expansion-en-e03-satyr-elite-idle.js` module owns
the internal/non-public Wildwood Hornlord elite Idle candidate. It renders an
elite actor through the approved humanoid chassis, reuses the exact Briar
F1/F2 tail, digitigrade-leg, split-hoof, and horn-root helpers with staff off,
then composes a direction-aware branching antler crown, bark pauldrons, moss
mantle, bracers, and amber torque. Its two-frame focused gate freezes paired raw
and Complete B + Form evidence, exact side mirroring and hoof-contact rows,
hard-alpha connectivity, external thorn/leaf/root effects, and zero facade
exposure. The full repository gate passes in `187.6s` with all 232 validated
PNG sheets unchanged. The designer approved both exact paired GIFs together on
2026-08-08. The approved internal implementation is committed and pushed at
`aa96e170c41cbcb49c7ac1bd979114b3b5bfa7e4`; the same message requests the next
isolated Wildwood art gate while registration, consumers, baked effects,
release, and broader work remain outside this module.

The separate `engine/enemy-expansion-en-e03-satyr-elite-motion.js` module owns
the internal/non-public Wildwood Hornlord complete-motion candidate. It
delegates approved Idle byte-for-byte, composes the elite crown/armor/mantle
identity over approved Satyr Walk/Attack/Hurt draw helpers with staff off, and
maps Cast to Attack plus Death to Hurt H1,H2,H2,H2. The 80-frame focused gate
freezes source digests, all-four-direction side mirrors, connected hard alpha,
full-body motion, external thorn/leaf/root effects, paired evidence, and zero
facade exposure. The full repository gate passes in `203.7s` with all 232
validated PNG sheets unchanged. The designer approved both exact paired GIFs
on 2026-08-08. The approved internal implementation is committed and pushed at
`d9cb0faa3dff204106598876fe38db5f4ee3237a`; publication does not expand the
gate. Registration, consumers, baked effects, release, and later work remain
outside.

The separate `engine/enemy-expansion-en-e04-naga-idle.js` module owns the first
EN-E04 internal/non-public anatomy candidate. It delegates only the humanoid
upper-body foundation, clears the full inherited lower body, and composes a
direction-aware cobra hood plus one continuous belly-plated serpent tail and
ground coil. Left is generated as the exact mirror of Right. F2 moves the hood
and upper body down one row while compressing the coil; a fixed connector keeps
the entire silhouette joined. The deeply frozen Naga contract card records
Coilguard common as the only implemented Idle candidate within that approved
module and Venom Oracle / Temple Rajah as planned specialist/elite roles there.
The dedicated focused gate
freezes paired raw and Complete B + Form boards/GIFs, all eight frames, all 64
lower-body continuity rows, single-run ground contacts, exact side mirrors,
external venom/miasma/coil-impact effects, and zero facade/public exposure.
Post-approval full repository validation passes in `241s` with all 232 public PNG sheets
unchanged, and both exact boards were opened in Aseprite. The designer reviewed
both exact paired GIFs and said `Approved` on 2026-08-08. The approved internal
implementation is committed and pushed at
`bd920c206d692bcc5e7b043614dcf6a03db2174c`; publication does not expand the
gate. Later motion/roles, Merfolk, Birdfolk, registration, consumers, effects,
release, and broader EN-E04 work remain outside this module.

The isolated `engine/enemy-expansion-en-e04-naga-motion.js` module composes the
next authorized Coilguard gate without modifying the approved Idle renderer.
Idle calls delegate directly to `EN_E04_NAGA_IDLE_RENDERER`; all other poses
reuse only the existing humanoid upper-body foundation, clear its inherited
lower body, and attach one authored planted-coil shape. Walk owns four slither
phases. Attack shifts the upper rig through brace, rise, strike, and recovery
while the coil remains grounded. Hurt forces the entire connected silhouette
white for H1 and returns to a colored braced H2. Cast routes to Attack and Death
routes to Hurt source frames `[0, 1, 1, 1]`, so neither alias owns new pixels.
The accompanying 80-frame review/check boundary freezes paired raw and Complete
B + Form evidence, exact side mirrors, all 640 single-run lower-body rows,
external effects, and zero facade/public exposure. This module remains an
internal, non-public boundary; the designer approved both exact paired review
presentations on 2026-08-08. The bounded implementation is committed and pushed
at `f47e1691208236f5d245a1f3b9b15355ad479790`. It passes the focused, fast, and
full repository gates without changing any of the 232 public sheets. Approval
and publication do not authorize another role, family, registration, consumer
integration, effects, or release.

The separate `engine/enemy-expansion-en-e04-naga-specialist-idle.js` module owns
the newly authorized Venom Oracle acceptance candidate without modifying either
approved Coilguard module. It delegates the approved Naga Idle anatomy, keeps
rows 17-23 byte-exact with the matching Coilguard frame, and overlays only the
specialist's connected ritual crown/jewel, violet mantle, gold oracle sigil,
and venom-bright eyes/sigil. Only Idle frames 0-1 are accepted; other
animations, variants, and families are refused. Left remains the exact mirror
of Right. Venom, miasma, ritual-circle, prophecy, and impact effects remain
external.

The focused gate freezes all eight candidate frames, the paired raw and Complete
B + Form evidence hashes, the eight-frame digest, all 64 continuous lower-body
rows, approved-tail preservation, connected hard alpha, one-cell margins,
specialist distinction, exact side mirrors, and zero facade/public exposure.
Both protected Coilguard gates, the cleaned v2 fast matrix, and the full
repository matrix pass with all 232 public sheets unchanged. Both exact boards
were opened in Aseprite and both GIF phases were inspected directly. Gate
`en-e04-venom-oracle-idle-v1` is now visually approved, internal, non-public,
committed, and pushed at `3365d9915ed0ac1e506470604ed1e83c84606181`; the
designer reviewed both exact paired GIFs and said `ye approved` on 2026-08-08.
Approval and publication do not authorize motion, Temple Rajah, another family,
registration, consumers, effects, or release.

The separately authorized
`engine/enemy-expansion-en-e04-venom-motion-rajah-idle.js` module composes one
larger private review boundary without modifying any approved Naga source. For
Venom Oracle Idle it delegates the approved specialist renderer byte-for-byte.
For Walk/Attack/Hurt and the exact Cast/Death aliases it delegates the approved
Coilguard choreography, then applies the specialist crown, mantle, jewel, and
sigil through a phase-aware transformed context. Upward attack/recoil phases
clamp that taller identity overlay to the one-cell crown margin while the
approved underlying body and coil motion continue. Temple Rajah is a separate
Idle-only dispatch on the approved Naga anatomy; it adds a connected
crimson-and-gold crown, gilded pauldrons, ivory chest plate, and royal sash
jewel, while rows 17-23 remain byte-exact with Coilguard.

The combined registry contains exactly Venom Oracle and Temple Rajah, refuses
Rajah motion and every other role/family, and remains absent from the public
facade. Its focused gate freezes 88 frames, 704 continuous lower-body rows, 22
exact side mirrors, exact Venom Cast/Death aliases, approved Venom Idle
delegation, Rajah distinction/tail preservation, paired raw and Complete B +
Form hashes, and zero public exposure. All three protected Naga gates plus the
fast and full repository matrices pass with all 232 public sheets unchanged.
Both boards were opened in Aseprite and all four phases inspected. Gate
`en-e04-venom-motion-rajah-idle-v1` is visually approved, internal, non-public,
committed, and pushed at `4fd887f0a174169d47f9f3bee3f98d92c2ffaf30`. The
designer reviewed both exact combined GIFs, located Rajah in the bottom
`R IDLE` row, and said `oh right sorry i had to scroll down approved` on
2026-08-08. Temple Rajah motion, Merfolk, Birdfolk, registration, consumers,
effects, and release stay outside.

The isolated `engine/enemy-expansion-en-e04-rajah-motion.js` module composes the
next authorized elite gate without modifying the approved Rajah Idle or Naga
motion sources. Idle delegates the approved eight frames byte-for-byte. Motion
renders the approved Coilguard planted-slither/strike/Hurt source, then layers
the connected Rajah crown and armor identity through the same direction-aware
phase transform; tall-crown upward/recoil movement is clamped to the one-cell
ceiling. Cast is an exact Attack alias and Death is the exact Hurt sequence
`H1,H2,H2,H2`.

Gate `en-e04-temple-rajah-motion-v1` is visually approved, internal, non-public,
committed, and pushed at `38b56f316a3fa12443b5b9fb003e74dc7e8059aa`.
The designer reviewed both exact paired GIFs and said `approved, lets keep going
with slices like this,, maybe a full enemy with all its animations is a good
spot` on 2026-08-08. Its lane-local registry contains only Temple Rajah and
remains absent from `sprite-engine.js`. Frozen
`1428x760` boards, `640x672` four-phase paired GIFs, an 80-frame digest, exact
approved-Idle delegation, continuous rows, exact mirrors/aliases, tail-source
locks, Complete B/Form presentation, and zero public exposure define the gate.
Focused, all four protected EN-E04, and fast/full repository gates pass with all
232 public sheets unchanged. Merfolk, Birdfolk, registration, consumers,
effects, release, and broader work remain outside this gate. The approval
separately authorizes one complete-enemy/all-animation slice next.

The isolated `engine/enemy-expansion-en-e04-merfolk-tideguard.js` module owns
that full-enemy slice without changing any approved Naga source or the public
facade. It composes the existing humanoid upper-body renderer with a lane-local
direction-aware Tideguard identity, clears the ordinary lower body, and draws
one continuous eight-row scaled tail ending in one broad connected fluke.
Idle, Walk, Attack, and Hurt own their bounded phase tables; Cast delegates
Attack exactly and Death delegates Hurt as `H1,H2,H2,H2`. A transformed
context moves the upper body while the planted tail remains frame-safe, and a
forced-white context makes H1 cover the complete silhouette. All water effects
stay outside the actor renderer.

Gate `en-e04-merfolk-tideguard-full-v1` is hash-frozen, technically validated,
visually `approved`, internal, and non-public on
`codex/en-e04-merfolk-tideguard`. Its lane-local registry contains only common
Tideguard and remains absent from `sprite-engine.js`. Frozen `1428x760` boards,
`640x672` paired four-phase GIFs, an 80-frame digest, one connected silhouette,
continuous fused-tail rows, broad flukes, exact mirrors/aliases, Complete
B/Form presentation, external effects, and zero public exposure define the
gate. All five protected EN-E04 gates and fast/full repository validation pass
with all 232 public sheets unchanged. The designer reviewed the exact raw and
Complete B + Form GIFs together and said `approved` on 2026-08-09; bounded
publication of the ten-file lane is complete at
`622b00f0c40eed552f61b30bd207b5ad8478836e`. Later Merfolk roles, Birdfolk,
registration, integration, effects, release, and broader work remain outside.

The isolated `engine/enemy-expansion-en-e04-merfolk-reefcaller.js` module owns
the next authorized specialist without modifying the approved Tideguard source
or public facade. It delegates each standard frame to the Tideguard renderer,
then applies one direction-aware connected identity overlay through the same
motion transforms. The overlay adds a branching coral crown, violet mantle,
pearl sigil, gold clasps, and luminous fin marks; its vertical transform braces
at a one-cell crown ceiling, and its side transform preserves both visible eye
pixels in coral red across all 36 colored Left/Right frames. Tail rows 16-23
therefore remain byte-exact across all 80 frames. Cast and Death retain exact
Attack/Hurt aliases, including the complete-silhouette white flash, while all
ritual and water effects stay external.

Gate `en-e04-merfolk-reefcaller-full-v1` is hash-frozen, technically validated,
visually `approved`, internal, and non-public on
`codex/en-e04-merfolk-reefcaller`. Its lane-local registry contains only
specialist Reefcaller and remains absent from `sprite-engine.js`. Frozen
`1428x760` boards, `640x672` paired four-phase GIFs, an 80-frame digest,
connected silhouettes, exact Tideguard tail locks, mirrors/aliases, both
coral-red side eyes in 36/36 colored side frames (`72/72` eye pixels), Complete
B/Form presentation, external effects, and zero public exposure define the
gate. All six protected predecessor gates and fast/full validation pass with
all 232 public sheets unchanged. After requiring both visible side-eye pixels
to be coral-red, the designer reviewed the final exact pair and said `approved`
on 2026-08-09; bounded publication of this exact ten-file lane is complete at
`b315a32aa48d8881efe23e9d5b8553e6c0fb6b79`. Merfolk elite, Birdfolk,
registration, integration, effects, release, and broader work remain outside.

The isolated `engine/enemy-expansion-en-e04-merfolk-pearl-regent.js` module
owns the next authorized Merfolk elite without modifying the approved
Reefcaller source or public facade. It delegates each standard frame to the
Reefcaller renderer, then applies one direction-aware connected royal overlay
through the same motion transforms. The overlay adds a pearl-and-gold diadem,
broad shell pauldrons, deep-crimson mantle, nacre breastplate, luminous regalia
marks, and twin coral-red side eyes. Its vertical transform braces at the
one-cell crown ceiling. Tail rows 16-23 therefore remain byte-exact across all
80 frames. Cast and Death retain exact Attack/Hurt aliases, including the
complete-silhouette white flash, while all royal tide effects stay external.

Gate `en-e04-merfolk-pearl-regent-full-v1` is hash-frozen, technically
validated, visually `approved`, internal, and non-public on
`codex/en-e04-merfolk-pearl-regent`. Its lane-local registry contains only elite
Pearl Regent and remains absent from `sprite-engine.js`. Frozen `1428x760`
boards, `640x672` paired four-phase GIFs, an 80-frame digest, connected
silhouettes, exact Reefcaller tail locks, mirrors/aliases, 72/72 coral-red side
eye pixels, Complete B/Form presentation, external effects, and zero public
exposure define the gate. All seven protected predecessor gates and fast/full
validation pass with all 232 public sheets unchanged. The designer reviewed the
exact hash-frozen raw and Complete B + Form pair with both visible side-eye
pixels coral-red and said `approved` on 2026-08-09; bounded publication of this
exact ten-file lane is complete at
`ef0ab54b73718b62f8db99f601020f7ef14090f8`. Birdfolk, additional Merfolk
variants, registration, integration, effects, release, and broader work remain
outside.

The isolated `engine/enemy-expansion-en-e04-birdfolk-aerie-scout.js` module
owns the next authorized Birdfolk common without modifying Pearl Regent, the
legacy Harpy renderer, shared schemas, or the public facade. Its lane-local
renderer authors one upright avian person directly: beaked crested head,
shoulder-rooted wing-arms, feathered torso and scout harness, two digitigrade
talon legs, and one connected tail fan. Direction-aware transforms provide four
distinct strides and a brace/rise/wing-and-talon-rake/recovery attack; Cast
aliases Attack and Death aliases Hurt `H1,H2,H2,H2` exactly. The white Hurt
phase recolors the complete silhouette, while all wind and impact effects stay
external.

Gate `en-e04-birdfolk-aerie-scout-full-v1` is hash-frozen, technically focused
and predecessor-validated, visually `approved`, internal, and non-public on
`codex/en-e04-birdfolk-aerie-scout`. Its
lane-local registry contains only common Aerie Scout and remains absent from
`sprite-engine.js`. Frozen `1428x760` boards, `640x672` paired four-phase GIFs,
an 80-frame digest, 80 connected hard-alpha silhouettes, one-cell margins,
20 exact side mirrors, exact aliases, 36/36 two-pixel colored side eyes, 18/18
eye-free colored rear views, Complete B/Form presentation, external effects,
and zero public exposure define the gate. All eight protected predecessor gates
pass; the final post-reconciliation fast gate passes in `54.5s` and the full
repository gate passes in `106.3s`, with all 232 public sheets unchanged. Exact
paired visual approval is recorded below. Birdfolk specialist/elite roles,
registration, integration, effects, release, and broader work remain outside.

The designer reviewed the exact raw/no-outline and Complete B + Form pair and
said `very good approved` on 2026-08-09. After the requested Codex/MCP restart,
the working Aseprite MCP opened both exact `1428x760` boards and the designer
said `ok lets keep going`. That approval authorizes only bounded commit, push,
and publication of this exact ten-file Aerie Scout lane. Bounded publication is
complete at approved implementation checkpoint
`a0910312e510ee57b603ee981a279c1f372d6fad`; no later gate is opened by that
publication.

The isolated `engine/enemy-expansion-en-e04-birdfolk-gale-augur.js` module owns
the next authorized Birdfolk specialist without modifying Aerie Scout, shared
schemas, renderers, exporters, validators, or the public facade. Its lane-local
renderer delegates every approved Aerie motion frame through a deterministic
palette map, preserves the complete source alpha footprint, and draws connected
storm-cowl, circlet, mantle, forewing-band, and sky-rune regalia through the
same body transform. Cast aliases Attack and Death aliases Hurt
`H1,H2,H2,H2` exactly; wind and omen effects remain external.

Gate `en-e04-birdfolk-gale-augur-full-v1` is hash-frozen, focused validated,
internal, non-public, committed, pushed, and
`approved` on `codex/en-e04-birdfolk-gale-augur`. Its
lane-local registry contains only specialist Gale Augur and remains absent from
`sprite-engine.js`. Frozen `1428x760` boards, `640x672` paired four-phase GIFs,
an 80-frame digest, 80 approved-source alpha locks, 80 connected hard-alpha
silhouettes, one-cell margins, 20 exact side mirrors, exact aliases, 72/72
colored specialist-identity frames, 36/36 two-pixel colored side eyes, 18/18
eye-free colored rear views, Complete B/Form presentation, external effects,
and zero public exposure define the gate. All nine protected predecessor gates
pass; the final post-reconciliation fast gate passes in `49.3s` and the full
repository gate passes in `98.0s`, with all 232 public PNG sheets unchanged.
Exact paired visual approval is recorded with the designer's `awesome looks
good approved` on 2026-08-09. That approval authorizes only bounded commit,
push, and publication of this exact ten-file Gale Augur lane. Bounded
publication is complete at approved implementation checkpoint
`ad57f25d47415625540ea36ff16d2a884a421576`; no later gate is opened by that
publication. Birdfolk elite, registration, integration, effects, release, and
broader work remain outside.

The isolated
`engine/enemy-expansion-en-e04-birdfolk-stormcrown-exarch.js` module owns the
next authorized Birdfolk elite without modifying Gale Augur, shared schemas,
renderers, exporters, validators, or the public facade. Its lane-local renderer
delegates every approved Gale motion frame through a deterministic palette map,
preserves the complete source alpha footprint, and draws connected storm-crown,
gold brow-guard, royal-mantle, armored-forewing, and lightning-sigil regalia
through the same body transform. Cast aliases Attack and Death aliases Hurt
`H1,H2,H2,H2` exactly; lightning and thunder effects remain external.

Gate `en-e04-birdfolk-stormcrown-exarch-full-v1` is hash-frozen, focused
validated, internal, non-public, committed, pushed, and
`approved` on
`codex/en-e04-birdfolk-stormcrown-exarch`. Its lane-local registry contains
only elite Stormcrown Exarch and remains absent from `sprite-engine.js`. Frozen
`1428x760` boards, `640x672` paired four-phase GIFs, an 80-frame digest, 80
approved-source alpha locks, 80 connected hard-alpha silhouettes, one-cell
margins, 20 exact side mirrors, exact aliases, 72/72 colored elite-identity
frames, 36/36 two-pixel colored side eyes, 18/18 eye-free colored rear views,
Complete B/Form presentation, external effects, and zero public exposure define
the gate. All ten protected predecessor gates pass; the fast gate passes in
`50.4s` and full repository validation passes in `103.0s`, with all 232 public
PNG sheets unchanged. Exact paired visual approval is recorded with the
designer's `sure lets do 123` on 2026-08-09. Bounded publication of this exact
ten-file lane is complete at approved implementation checkpoint
`da8c089`. The subsequently authorized EN-E04 registration and assembler
consumer gates are also complete. Additional Birdfolk variants, effects,
release, and broader work remain outside that historical lane.

`engine/enemy-expansion-en-e04.js` owns the complete approved EN-E04
registration boundary. It composes Naga, Merfolk, and Birdfolk as three
approved families with common/specialist/elite variants in reviewed order and
uses one bounded dispatcher per family to delegate to the nine exact approved
lane renderers. No source renderer, candidate frame, public schema, or legacy
catalog entry is rewritten. Gate `en-e04-nine-enemy-registration-v1` verifies
all nine native `480x96` sheets and 720 candidate/registered frames at aggregate
digest `137d044a55dd41d612a8b41958029e41ef39fb75ccf58de9b46d6c4328c91459`.
The validated registration checkpoint is published at `6f228fb`.
At that checkpoint the stable registry reached 13 families / 39 variants with
four renderers. Gate `en-e04-assembler-consumers-v1` then made the consumer
registry reuse that exact stable object, so `PUBLIC_ENEMIES`, editor paths,
randomization, persistence, and exports covered 70 families / 241 variants.
Its exhaustive 720-frame consumer check preserves the same aggregate digest and
verifies nine full sheets, all scoped routes, outline/Form treatment, Complete
Kits/Packs, and Wildshot acceptance without slice-specific consumer branches.
The bounded implementation is published at checkpoint `cedc774`.

The nested boss gates verify fourteen deeply frozen direction-catalog entries,
56 checkpoint-exact 48x48 hard-alpha direction frames, fourteen checkpoint-exact
48x192 direction sheets, plus ten animation-catalog entries, 800 distinct
48x48 frames, and 110 native full/scoped animation sheets. They also enforce
Idle-frame control parity, facade immutability, native-only download wiring,
and absence from production renderer, generator, persistence, game-pack, and
ordinary sheet dependencies.

The standard full `npm run check` is fresh-clone safe. Missing optional local
Boss review checkpoints are warnings, and byte parity runs for every checkpoint
that is present. `npm run check:bosses:strict` is the separate designer-machine
gate that requires the complete ignored 1,064-file review corpus.

The Production gate within that command adds 1,000 portable policy cases,
immutable profile/freeze and reason-code checks, invalid-seed normalization,
bounded fallback coverage, all-class/tier/palette coverage, Wildcard
compatibility, schema non-proliferation, resolved class/batch/kit
compatibility, and 80 deterministic assembled export cases. The compatible
reroll gate adds 4,200 deterministic category cases, 555 explicit
no-compatible-alternative cases, semantic-field locality, invalid-input,
deep-copy, immutability, stable-facade, editor-mapping, history-only context,
Wildcard, and dependency-boundary checks.

`tools/weapon-readability-audit.mjs` complements those hard checks with visual evidence. Its standard review matrices are joined by a 6,000-row CSV/JSON audit recording bounds, connected components, edge sides, character distance, expression overlap, discarded-frame count, and discarded-pixel count for every family, tier, direction, animation, and frame. The optional `--all-frames` mode also emits one enlarged and one true-native assembled all-frame sheet per weapon, while `--tier-sheets` emits four labeled all-weapon/all-frame SVG sheets per tier with lightweight PNG inspection grids. Frame-edge contact remains advisory, while any attempted write beyond `x=0..23` or `y=0..23` is a hard frame-contract failure.

`tools/outline-review.mjs` is the outline-specific regression and visual-review gate. It anchors representative None-mode sheets to the safe baseline, exercises 6,000 direct-render parity cases, 2,000 deterministic randomized outline cases, 11,040 exhaustive outlined equipment cases, and 10,656 exhaustive headgear-preservation cases. It proves that contact separators change only authorized body-side or equipment-side pixels, protects every visible headgear pixel and all non-contact equipment pixels, verifies cardinal equipment halos, filtered large cavities, the explicit equipment pilot, and neck-cavity repair, and writes ignored review artifacts beneath `outline-review/`.

`tools/enemy-outline-assessment.mjs` audits all 57 families / 202 variants /
16,160 current source frames for margins, discarded writes, connected
components, and cavities. `tools/enemy-outline-pilot-review.mjs` proves None
parity and both outline modes across the complete 20-column roster: 48,480
cases with mode distinction in every frame, zero source-edge frames, and zero
out-of-bounds writes. `docs/archive/ENEMY_OUTLINE_PLAN.md` retains the chronological 9,696
/ 29,088 totals for the historical 12-column approval checkpoint. Generated
evidence stays ignored beneath `enemy-outline-assessment/` and
`enemy-outline-review/`.

`tools/shade-review.mjs` generates the ignored interactive Form pilot beneath
`shade-review/`. It renders 12 diverse player/enemy specimens across all 960
current source frames and 2,880 Form/outline combinations, compares the material-aware
result with an explicit silhouette-only control, and exposes untreated, None,
Complete B, and Selective C columns at native and nearest-neighbor size on dark
and parchment backgrounds, with parchment selected by default. The algorithm
is approved, but this remains review evidence rather than a committed fixture
or accepted baseline.

`tools/offhand-review.mjs` generates the ignored Lantern integration review
beneath `offhand-review/`. It renders three representative bearers across all
240 current source frames and 960 assembled outline/Form cases, then verifies exact
back/body/front recomposition, animated attachment, shield precedence,
absent-field parity, and zero out-of-bounds writes. The Lantern art is approved;
the generated page remains review evidence rather than a committed fixture or
accepted baseline.

`tools/production-roll-review.mjs` generates the ignored balanced
Production-versus-Wildcard corpus beneath `production-roll-review/`. Its 120
fixed Production seeds are evenly divided across all ten class archetypes and
paired with 120 Wildcard controls. The current 20-column report audits all
19,200 source frames, 57,600 Form/outline cases, deterministic replay, frame bounds, equipment
attachments, and policy validity. The accepted digest is
`af9b620e5ce87f6febf5983487fc163e8b5a4495fb37ced3653e8b5bbbc4ba3f`;
generated HTML and JSON are evidence, not committed fixtures or baselines.

## Adding content safely

### Add a player option

1. Add the option to `engine/catalogs/player-options.js`.
2. Add or update renderer behavior only if the option introduces a new shape rather than a palette variant.
3. If it belongs to an existing category, its control is populated from that catalog. If it creates a new category, add the validated state field and one `playerGroups()` entry in `app.js`.
4. Preserve a backward-compatible default so old saved state and presets still sanitize safely.
5. Run `npm run check`, `npm run build`, and the browser smoke test.

For face-bound content, verify front and both side views, confirm the rear view stays anatomically correct, and test every face-hiding headgear option.

### Add an enemy variant

Follow `.claude/skills/add-enemy/SKILL.md` as the current runbook:

1. Add the variant beneath its family in `engine/catalogs/enemies.js`.
2. Run `npm run export:fixtures -- --family <family> --variant <variant>`; the
   exporter writes the legacy-format PNG and regenerates the manifest.
3. Run `npm run check:fast`, review only the changed variant, and run the full
   gate before the bounded commit.

Never hand-edit `asset-pack/manifest.json` or pass `--accept-drift` without the
designer's explicit fixture-regeneration approval.

### Add an enemy family

1. Add the family and variants in `engine/catalogs/enemies.js`.
2. Add its procedural drawing function and dispatch in `engine/renderer.js`.
3. Add outline registry support only when that treatment is approved.
4. Run `npm run export:fixtures -- --family <id>`; do not hand-register files.
5. Run `npm run check:fast`, review one four-direction Idle sheet for this
   family, and run the full gate before publishing.

For the proposed 80-enemy expansion, do not use this legacy one-family path.
EN-F00's data-driven foundation and stable public composition boundary exist.
EN-E01, EN-E02, EN-E04, and the four new EN-E05 families demonstrate the
complete lifecycle with 17 approved/public families / 43 variants. The EN-E05
Ghoul upgrade remains an internal replacement proposal, and EN-E03 remains
isolated evidence rather than a public slice. Follow
`ENEMY_EXPANSION_PLAN.md`: keep
candidates out of the public view, stop for four-direction baseline approval
before full production, stop again for completed-slice approval, and register
only an explicitly approved slice.

### Change the sheet contract

Treat frame size, direction order, animation counts, or row/column layout changes as a versioned format migration. Update the animation catalog, renderer, sheet builder, manifest, fixtures, validator, documentation, and consuming game integrations together.
