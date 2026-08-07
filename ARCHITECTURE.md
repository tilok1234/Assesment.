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
appends the ten consumer-authorized EN-E01/EN-E02 families, yielding the current
67-family / 232-variant consumer catalog. Editor selectors and sanitizers,
persistence, randomization, combat defaults, kits, packs, thumbnails, and
exports consume that merged view without mutating `ENEMIES`.

`engine/public-renderer.js` is the stable dispatcher used by the public
`drawSprite()` facade and assembled/pixel/sheet helpers. It delegates every
legacy specification to the unchanged renderer and sends only approved
expansion family IDs through `renderEnemyExpansionFrame()`. It owns clear,
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
back to an unrelated legacy family. EN-E02 reaches the same palette-aware path
through its approved renderer data. None/None still delegates directly to the
raw dispatcher; Form and outlines alter only complete assembled output,
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
cumulative approved registry. `PUBLIC_ENEMIES` is therefore 67/232, and the
existing selectors, randomizer, kit, pack, thumbnail, export, outline/Form, and
standard-dispatcher paths consume EN-E02 without slice-specific branches.
`sprite-engine.js` still imports only the generic stable boundary and exposes no
slice-specific symbols. The five pre-registration candidate records remain
immutable `implemented` evidence; consumer integration does not retroactively
rewrite that reviewed snapshot. The designer later approved an exact
seven-family walk/seam repair, so both stable and consumer composition now route
through `ENEMY_EXPANSION_REPAIR_APPROVED_REGISTRY` while the pre-repair object
remains internal. That repair did not authorize effects or release.

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

`character-kit.js` deterministically expands the player catalogs into one deduplicated component plan: skin-body, head, expression, hair, face-detail, species-back, species-front, outfit-back, outfit, headgear, weapon, shield, and utility-off-hand passes. It stores 119 hair sheets, six expression sheets, 60 content-unique species passes, 41 headgear sheets, and two Lantern passes beneath stable component paths. Species paths expand only on the palette axis that changes their pixels: skin for Dwarf and Lizardfolk traits, hair for Beastkin fur, and one fixed path for Undead traits. Short, spiky, bowl, and topknot share one pixel-identical fitted hair path, while outfit-colored headgear expands only the variants whose pixels actually change. Outfit and cape paths include the body-build id because those pixels define the silhouette; all other compatible layers remain shared. The resulting library contains 1020 outfit fronts, 140 cape backs, and 1912 component sheets total. It also expands all 67 public enemy families / 232 variants into stable `enemies/<family>/<variation>.png` paths and every combat effect into stable `effects/<category>/<effect>.png` paths for complete native sheets. Up to 24 named players are mapped to lightweight recipes that reference the shared character paths and carry their modular combat-loadout recipes. The standalone kit adds no per-recipe PNGs and contains 2169 PNGs total; the combined Complete Pack adds one assembled native sheet per player for immediate use and contains 2192 PNGs at the 24-player limit. The planner owns stable paths, counts, recipe limits, the native export scale, compatibility variants, and the runtime layer order. It imports catalogs only through `sprite-engine.js` and does not access the DOM, canvas, editor state, persistence, or ZIP implementation.

### Archive packaging

`zip.js` builds stored ZIP archives with UTF-8 paths and CRC-32 checksums. It accepts already-rendered files and has no knowledge of editor state, sprite specifications, or rendering internals.

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
- All 67 public enemy families support None, Complete B, and Selective C in live
  assembled rendering. The locked 57-family legacy gate covers 16,160 source
  frames; the cumulative expansion gate adds all 2,400 approved EN-E01/EN-E02
  frames with the same source-ownership and bounds guarantees.
- The EN-F00 foundation registry remains empty and separate from `ENEMIES`;
  the stable approved and consumer registries contain exactly ten EN-E01/EN-E02
  families / 30 variants. `PUBLIC_ENEMIES` is exactly 67 families / 232 variants
  and is the editor, randomizer, kit, pack, thumbnail, and export catalog. The
  underlying 57-family / 202-sheet / 16,160-frame legacy corpus remains
  unchanged and retains locked SHA-256 pixel digest
  `190a0f32b961b23fe0207c5a53fc005f9761666d27b15b98c0030325a10bef0c`.
- The 30 expansion variants retain their reviewed raw pixels at the registry
  and None/None dispatcher boundary. Optional assembled rendering may apply the
  shared Form/outline algorithms; exports remain shadow-free, while the live
  preview may add only the standard non-baked floor shadow.
- EN-E03 remains an isolated common-only Idle evidence registry with three
  rejected implemented variants, 24 review frames, and zero approved/public
  families. Its non-Idle refusal and absence from the public facade are
  invariants; neither rejected implementation may be extended without a newly
  authorized calibration gate.
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
57/202 legacy preservation, immutable 67/232 public composition, selectors and
persistence wiring, deterministic expansion randomization, nested actor combat
metadata, Wildshot validation, 232-sheet Complete Kit planning, thumbnails and
all export scopes, and approved pixel parity across all 2,400 editor/dispatcher
frames and all 30 native `480x96` sheets. It also exhausts 7,200 None/B/C
outline cases and 7,200 Form/outline cases across all 180 published expansion
palette colors.

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

The nested boss gates verify fourteen deeply frozen direction-catalog entries,
56 checkpoint-exact 48x48 hard-alpha direction frames, fourteen checkpoint-exact
48x192 direction sheets, plus ten animation-catalog entries, 800 distinct
48x48 frames, and 110 native full/scoped animation sheets. They also enforce
Idle-frame control parity, facade immutability, native-only download wiring,
and absence from production renderer, generator, persistence, game-pack, and
ordinary sheet dependencies.

The full `npm run check` also expects a complete ignored local Boss
review-checkpoint corpus. It passes on the approved Hill Breaker, Steppe Hunter
Attack, and Briar Reveler Attack branches when
that 1,064-file corpus is present, but a fresh worktree stops in the two Boss subprocesses
because 965 optional checkpoint PNGs are absent. The separate
`codex/clean-clone-check` candidate at `125b0b3` is unvalidated and is not part
of this architecture checkpoint.

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
out-of-bounds writes. `ENEMY_OUTLINE_PLAN.md` retains the chronological 9,696
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

1. Add the variant beneath its family in `engine/catalogs/enemies.js`.
2. Re-export its fixture into `asset-pack/enemies/`.
3. Register the file in `asset-pack/manifest.json`.
4. Run `npm run check` to catch definition, registration, or dimension drift.

### Add an enemy family

1. Add the family and variants in `engine/catalogs/enemies.js`.
2. Add its procedural drawing function and dispatch in `engine/renderer.js`.
3. Export and register every fixture.
4. Verify all directions and animations before publishing.

For the proposed 80-enemy expansion, do not use this legacy one-family path.
EN-F00's data-driven foundation and stable public composition boundary now
exist. EN-E01 and EN-E02 demonstrate the complete lifecycle with ten
approved/public families / 30 variants and a shared renderer handler; the later
approved repair remains a separate immutable registry layer. EN-E03 is the
current counterexample that proves approved implemented evidence can stay
non-public: three internal Idle baselines plus all three common Walk and Attack
baselines are visually approved while remaining internal. Hill Breaker H1-H2
is also a visually approved internal baseline with every approved prior frame
delegated exactly; it is not public. Follow
`ENEMY_EXPANSION_PLAN.md`: keep
candidates out of the public view, stop for four-direction baseline approval
before full production, stop again for completed-slice approval, and register
only an explicitly approved slice.

### Change the sheet contract

Treat frame size, direction order, animation counts, or row/column layout changes as a versioned format migration. Update the animation catalog, renderer, sheet builder, manifest, fixtures, validator, documentation, and consuming game integrations together.
