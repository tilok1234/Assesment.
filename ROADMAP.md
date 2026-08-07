# Product and Windows Roadmap

This roadmap records the agreed order for turning the current Sprite Assembler into a maintainable editor and, ultimately, a proper Windows application.

## Guiding decision

Do not spend the next major phase polishing an installer, and do not add a large amount of hard-coded content to the current monolithic engine.

The order is:

1. Preserve and validate the baseline.
2. Make the frontend and content model app-ready.
3. Prove Windows packaging with a minimal Tauri build.
4. Add the highest-value editor features and establish the content workflow.
5. Expand content through that stable workflow.
6. Finish and distribute the Windows application.

The procedural rendering and exported sprite-sheet contract remain stable throughout these phases.

## Phase 1 - Clean development baseline

Goals:

- Place the existing project under Git on the `main` branch.
- Connect it to the `tilok1234/8-bit-sprite-assembler` GitHub repository.
- Document how to run and validate it.
- Provide a one-click Windows development launcher.
- Validate JavaScript, manifest references, engine definitions, and every PNG dimension.
- Publish the first known-good baseline commit.

Exit criteria:

- The live UI renders without browser errors.
- All project checks pass from one command.
- A fresh checkout can be started without installing project dependencies.
- Generated and user-local files are not committed accidentally.

## Phase 2 - App-ready frontend and content foundation

Progress: complete for the current engine contract. The standard frontend, restrictive-CSP-compatible runtime, dependency-free production build, stable public engine facade, focused catalogs, renderer, sheet/export, and generator modules are all in place and parity-verified.

Goals:

- Replace the exported runtime-driven page with a standard bundled frontend entry point.
- Remove runtime code generation so the desktop application can use a restrictive content-security policy.
- Split the engine into clear boundaries:
  - player and enemy definitions
  - palettes and equipment catalogs
  - procedural renderers
  - animation definitions
  - sprite-sheet generation and export
  - editor state and persistence
- Make content definitions easy to extend without editing unrelated rendering code.
- Preserve every existing character option, enemy, animation, and exported sheet layout.

Exit criteria:

- The editor behaves like the current baseline.
- Existing asset and engine validators still pass.
- The new frontend runs through a normal `index.html` development/build flow.
- No `eval` or `new Function` requirement remains in application code.

## Phase 3 - Minimal Windows packaging proof

Progress: complete as a historical packaging proof. The Tauri 2 wrapper, restrictive production content-security policy, standalone release executable, current-user NSIS target, native Save-dialog plugins, and release validator now exist. Phase 6 owns current distribution and installer work.

Goals:

- Add a small Tauri 2 wrapper around the app-ready frontend.
- Produce a development executable on Windows.
- Verify preview animation, local settings, and PNG export inside WebView2.
- Keep native permissions minimal.

This phase is deliberately a proof, not the final installer or release design.

Exit criteria:

- A local Windows executable launches successfully.
- The core editor works without a separate web server.
- Exported PNGs match browser output.
- The app uses a restrictive content-security policy.

## Phase 4 - Core editor features

Progress: complete. Named player and enemy presets use a sanitized, versioned local format shared by the browser and Windows builds; schema v3 carries character names, export names, and optional player palette overrides while migrating existing v1 and v2 libraries. Bounded undo/redo tracks editable sprite documents without rewinding preview-only direction, animation, zoom, cycle, playback, frame, speed, export, or comparison choices. Header controls and `Ctrl+Z`, `Ctrl+Y`, and `Ctrl+Shift+Z` are supported. Every player and enemy option group has an undoable randomize control that always selects a different valid value. Character names appear in the live preview, and exports support persistent Windows-safe filename overrides with an automatic fallback. Players can override base/shadow tones for skin, hair, and outfit, then save those six tones in a separate versioned reusable palette library. PNG export can target the full sheet, one selected animation across all directions, or one selected direction across all animations, with adaptive previews, filenames, and dimensions. Preview playback supports play/pause, 0.5x/1x/2x speeds, wrapping frame steps, direct frame selection, and animation-frame-to-sheet-column metadata. Player and enemy resets are single undoable edits; Duplicate preserves a persistent local copy that can be animated beside the current editor, restored through history, replaced, or removed. These workflows are production-smoke-tested.

Priority order:

1. Save and load named character presets. Complete.
2. Undo and redo. Complete.
3. Randomize individual categories as well as the whole character. Complete.
4. Custom character and export names. Complete.
5. Palette editing and reusable palette presets. Complete.
6. Export a selected animation or direction in addition to the full sheet. Complete.
7. Improved playback controls and frame inspection. Complete.
8. Reset, duplicate, and compare workflows. Complete.

Exit criteria:

- The editor supports a complete create, revise, save, reopen, and export workflow.
- Preset data has a versioned format.
- Browser and Windows builds share the same editor logic.

## Phase 5 - Content expansion

Progress: underway. The first validated content slice adds eight facial-detail choices—none, beard, mustache, scar, eyepatch, glasses, blush, and war paint—without changing the 24x24 frame or sheet contract. Old state and presets migrate to `none`; facial hair follows the selected hair tones, war paint follows the outfit palette, rear views remain unmarked, and full helmets suppress face details. The controls participate in thumbnails, whole-character and per-category randomization, presets, reset, undo/redo, comparison, persistence, naming, and every export scope.

Review presentation rule: unless the designer explicitly requests a narrow
direction/frame/layer/defect inspection, every sprite approval review must show
labeled Down, Left, Right, and Up animations in both raw/no-outline and outlined
project-presentation form (currently Complete B + Form). Both versions belong
in the same review response; side-only, unlabeled, or single-mode evidence is
not a complete normal review.

Approval publication rule: each explicit visual approval is followed by an
intentional bounded commit and branch push before the next gate begins, unless
the designer explicitly says to hold publication. Unapproved lanes are never
published under this rule.

Current continuation checkpoint (2026-08-07): synchronized `main` remains the
pre-expansion base at `f5476a2`. The EN-E03 approval lane is preserved and
pushed on `codex/en-e03` at `8ea019b`; that checkpoint contains rejected v1/v2,
the approved internal Hill Breaker, Steppe Hunter, and Briar Reveler F1/F2 Idle
baselines, and the exact Hill Breaker Walk W1-W4 pixels later visually approved
on 2026-08-06. The separately approved Steppe Hunter Walk baseline remains
preserved in its isolated source worktree. The approved Briar Reveler Walk
W1-W4 source branch on `codex/en-e03-satyr-walk`, created from clean reconciled
checkpoint `ec525b6` and populated with the exact approved Steppe continuation,
passes its focused gate. Its corrected rear view was visually approved on
2026-08-06. The resulting bounded Hill Breaker Attack A1-A4 source lane on
`codex/en-e03-hill-breaker-attack` preserves approved Idle/Walk exactly and
remains internal and non-public. Both exact approved source lanes are included
in and published through the consolidated Steppe Hunter Attack branch.
The designer approved its exact labeled four-direction raw and Complete B +
Form animations on 2026-08-07 with `Very good approved`. The designer then
said `Cool let's keep going`, authorizing only Steppe Hunter common Attack
A1-A4. Its isolated baseline on `codex/en-e03-steppe-hunter-attack` preserves
the approved Steppe Idle/Walk baselines exactly, passes its 16-frame focused
gate, and remains internal/non-public. The designer reviewed both
exact labeled four-direction raw/no-outline and Complete B + Form GIFs together
and said `Approved` on 2026-08-07; the consolidated bounded lane is committed
and pushed under the approval-publication contract. The subsequent `lets keep
going` authorizes only Briar Reveler common Attack A1-A4. Its isolated
approval lane on `codex/en-e03-briar-reveler-attack`, created exactly
from pushed checkpoint `c567a42`, preserves approved Briar Idle/Walk exactly and
passes its focused 16-frame body-and-staff gate. The designer reviewed both
required labeled all-four-direction raw and Complete B + Form GIFs together and
said `very good! approved` on 2026-08-07. The exact lane is approved, internal,
non-public, committed, and pushed; no later EN-E03 gate is authorized. The complete
57-family / 202-variant
legacy Enemy catalog remains visually approved; its current 20-column gate
covers 16,160 source frames / 48,480 None-B-C cases. Form shading, Lantern,
Production Roll, compatible category rerolls, and the public Cast/Death actor
contract are complete. The isolated Boss workspace contains fourteen direction
entries (twelve approved plus Rhino and Unicorn candidates) and ten animation
entries. Catgirl Templar and Astro Knight are accepted; Goblin War-Crown,
Rhino, and Boar Rider animations remain candidates, as do the repaired Rhino
and Unicorn direction designs.

The deterministic `wildshot-npc-slice-v1@bf6269c` delivery contains 32
Player-built NPC looks and was verified by the game intake. The approved
`ENEMY_EXPANSION_PLAN.md` decomposes 80 additional proposals into EN-F00,
eighteen standard Enemy slices, and three separately blocked Boss micro-slices.
EN-F00 is accepted at isolated checkpoint `73ad73a` on `codex/en-f00`. The
separately authorized `codex/en-e01` branch preserves its approved five-common
Idle evidence and contains a complete reviewed candidate at `230a9a3`: five
families / 15 common-specialist-elite variants with standard Enemy motion and
aliases through the same shared renderer. The designer approved the completed
slice and checkpoint `b43ed6a` registers all five families / 15 variants through
the stable public expansion API with exact candidate parity. Consumer
checkpoint `e0be273` adds immutable `PUBLIC_ENEMIES` and routes the existing
editor, persistence, randomization, thumbnail, kit, pack, combat-default, and
sheet-export consumers through the first approved slice. EN-E02 registration
checkpoint `7b6e448` adds five more approved families / 15 variants, and the
separately authorized consumer checkpoint `8ab1837` routes both slices through
the same generic boundary at 67 families / 232 variants while preserving the
unchanged 57-family / 202-variant legacy catalog and pixel locks. The designer
accepted EN-E02's live Complete B + Form consumer view and later approved the
exact seven-family walk/seam repair. That repaired registry is now both the
stable and consumer boundary; the pre-repair registry remains internal.
The designer rejected EN-E03 v1 checkpoint `50ad516` because its boxed visual
language did not match the approved roster, then rejected replacement checkpoint
`6104eae` as still far from that style. V2 keeps only the Giant, Centaur, and
Satyr contract cards plus three common four-direction/two-frame Idle baselines.
  Its raw and Complete B + Form boards are technically validated but visually
rejected. A separate reference-first Hill Breaker F1 study was then authorized
and visually approved on 2026-08-03. Its F2-only continuation was also visually
approved that day; the exact eight source frames are the accepted Hill Breaker
Idle baseline. The later Steppe Hunter F1-only calibration was also visually
approved across four directions. The designer then authorized only Steppe
Hunter F2 across those directions and approved the exact F1/F2 boards on
2026-08-03 with `Approved lets keep going.` That exact eight-frame result is now
the accepted internal Steppe Hunter Idle baseline. Only the reference-first
Briar Reveler F1 gate was authorized next; its exact four-direction raw and
Complete B + Form boards were visually approved on 2026-08-03 with `looks good.`
Those four frames are now an approved internal F1 seed. The designer then
authorized only F2 with `lets go next`; the exact F1/F2 boards were visually
approved on 2026-08-04 with `approved`. Those eight frames are now the accepted
internal Briar Reveler Idle baseline. The designer then authorized only Hill
Breaker common Walk W1-W4 across all four directions. Preservation checkpoint
`8ea019b` preserves those exact pixels, focused checker, package scripts,
deterministic review generator, and frozen hashes. The designer approved the
exact Hill Breaker raw and Complete B + Form boards on 2026-08-06 with
`yes sir seems fine to me approved`, authorizing only Steppe Hunter common Walk
W1-W4 next. The designer then reviewed the exact Steppe Hunter raw and Complete
B + Form animations and said `approved` on 2026-08-06. That approved Steppe
baseline passes its 16-frame focused gate while preserving all eight approved
Idle frames and zero public exposure. The designer then authorized only Briar
Reveler common Walk W1-W4 with `awesome lets do next`. Its 16-frame candidate
passes connected-silhouette, split-hoof, gait-cycle, mirror, approved-Idle,
rear-head no-eye, frozen-hash, and zero-public-exposure checks. The designer
approved the corrected raw and Complete B + Form animations on 2026-08-06 with
`greeat lets move on`, authorizing only Hill Breaker common Attack A1-A4. That
candidate now passes its 16-frame focused gate with exact approved Idle/Walk
delegation, connected distinct silhouettes, one-cell margins, planted contact,
at least three torso-and-hip phases per direction, frozen review hashes, and
zero public exposure. The first overlay-slide response to the request for more
body movement was rejected as `not a good animation` and removed. The current
replacement uses one layered upper-body/club rig with a backward coil, centered
release, forward impact drop, and recovery over anchored legs. The follow-up
front/back revision extends Down/Up motion through hips and upper legs while
retaining byte-identical planted-foot anchors. The designer approved the exact
labeled four-direction raw and Complete B + Form animations on 2026-08-07 with
`Very good approved`.
No EN-E03 family is public; Steppe Hunter Attack and Briar Reveler Attack are
visually approved and published. The approved Briar Reveler baseline preserves
Idle/Walk exactly and passes 16 connected body-and-staff, planted-hoof,
whole-body-phase, mirror, front/back-depth, frozen-evidence, and zero-public-
exposure checks. Hurt, additional Giant/Centaur/Satyr motion, variants,
registration, effects, release, and every later gate remain blocked. The full project gate passes with
the complete preserved local Boss review-checkpoint corpus; fresh-worktree clone
safety remains a separate unvalidated candidate at `125b0b3`.
The current branch history
also contains the `established-boss-pack-13-v1` clean-tree/pushed-HEAD publish
gate, but its frozen roster currently lacks four direction and seven animation
catalog entries, so the command is not release-ready. Existing fixtures remain
unchanged, Effects start Off, and the effect-after-character equipment
occlusion issue remains on ice. A local standalone executable exists from
`bf6269c`, but no NSIS installer or approved Windows release candidate exists.
See `HANDOFF.md`.

The first fresh content slice after that checkpoint adds the visually approved
Lantern through a separate public non-shield `offhand` field. Shields and
utility off-hands are mutually exclusive, only shields retain five-tier
progression and shield-block behavior, and legacy specifications migrate to no
utility item. The Lantern uses direction-aware back/front layers, the animated
left-hand socket, approved Form shading, and component-aware outlines without
changing the 24x24 contract or accepted baselines.

The second content slice extracts humanoid weapons into a focused renderer with shared direction and pose anchors, while retaining byte-for-byte output for all existing enemy-used weapons. The player catalog grows from eight to sixteen choices with greatsword, scimitar, rapier, mace, warhammer, crossbow, wand, and spellbook additions. Each new weapon is verified across four directions and every animation, follows the animated player hand through idle, walk, attack, and lunge poses, has a distinct side strike, and observes the player face-clearance rule. Player blades also use readable style-specific hilts: compact dagger grips, sword crossguards, broad greatsword guards, scimitar knuckle guards, and rapier baskets.

The third content slice adds an independent two-level weapon progression system without duplicating the weapon-type catalog. Every equipped weapon has a named Tier 2 form with a stronger silhouette and material treatment, including double axe heads, spiked mace and club profiles, reinforced ranged limbs, expanded arcane focuses, and gilded spellbooks. `None` normalizes to Tier 1, old state and preset schemas migrate safely, Tier 2 participates in thumbnails, per-category and whole-character randomization, undo/redo, comparison, persistence, naming, and every export scope, and all 15 upgrades remain distinct in every direction, animation, and frame while following the hand rig and clearing side faces.

The fourth content slice extends that same progression field with legendary Tier 3 forms such as Starforged Blade, Worldsplitter, Stormcleaver, Dragonfire Ballista, Astral Scepter, and Codex Eternal. Tier 3 builds on the Tier 2 geometry with astral metals, larger structural ornaments, celestial edges, elemental flares, and expanded magic orbits. All 15 legendary forms are distinct from Tier 2 in every rendered frame, remain mutually distinct as complete sheets, inherit the full animation rig, preserve side-face clearance, and work through the existing schema-v4 preset, randomization, history, comparison, persistence, and export paths.

The fifth content slice adds oversized mythic Tier 4 forms such as Dawnreaver, Colossus Edge, Tempest Executioner, World Serpent Pike, Seraphim Greatbow, Wyrmfire Repeater, Staff of the Firmament, and Omniscient Codex. Tier 4 cumulatively preserves the earlier materials and ornaments while deliberately extending blade reach, pole and haft length, bow limbs, stocks, barrels, and magical projections toward the safe 24x24 frame limits. Every Tier 4 weapon expands beyond its Tier 3 idle silhouette in all four directions, remains readable in every animation frame, follows the hand rig without clipping, and clears the protected side-face area.

The sixth content slice completes the progression with final artifact Tier 5 forms such as Eternity's End, The Last Horizon, Heavenrend, Supernova, Axis of Creation, Wings of Genesis, Apocalypse Engine, Pillar of Eternity, and The Final Testament. After visual review, Tier 5 was rebuilt as an independent artifact silhouette over the Tier 3 foundation rather than a dense overlay on Tier 4. Each weapon now has its own material palette and keeps its blade, head, handle, shaft, limbs, mechanism, focus, or book cover readable, with restrained crowns, runes, star points, wing tips, multi-bolts, orbiting shards, page lights, and magic accents supporting the physical form. All 15 artifacts establish a distinct silhouette in every idle direction, differ from Tier 4 in every animation frame, follow the animated hand without edge-sticking, preserve both front eyes and the side face, and use the existing preset, randomization, history, persistence, and export paths without a schema migration.

The seventh content slice establishes the shield foundation. Humanoid shield drawing now lives in a focused renderer with a player-only off-hand rig and a legacy-compatible enemy path. Round, kite, and buckler were rebuilt, while heater, tower, oval, bone, and arcane brought the equipped catalog to eight distinct shield families. The later approved object-space attachment correction at `f21cbe3` keeps the same broad shield face attached to the shield hand in every facing; direction changes screen position and near/far body occlusion rather than applying a second perspective turn. The current 20-column validator covers 12,800 equipped-shield cases across four body builds, eight families, five tiers, four directions, and every animation frame.

The eighth content slice adds independent Tier 2 progression for all eight equipped shield families. Ironbound Roundshield, Knight's Bulwark, Duelist's Guard, Lionheart Heater, Bastion Wall, Legionnaire Scutum, Ossuary Aegis, and Runebound Ward each expand beyond the Tier 1 silhouette with family-specific bracing, flares, battlements, bands, bone crowns, or floating runes. The schema-v5 `shieldTier` field participates in the editor, named selections, whole-character and per-category randomization, reset, undo/redo, comparison, persistence, presets, and exports; old v1 through v4 presets migrate to Tier 1, and `None` always normalizes to Tier 1. Automated checks prove Tier 2 differs from Tier 1 in every direction, animation, and frame, grows every idle silhouette, remains mutually distinct, follows the off-hand rig, and preserves face clearance.

The ninth content slice extends all eight shield families with cumulative legendary Tier 3 forms: Sunforged Aegis, Dragoncrest Bulwark, Starsteel Counterguard, Crowned Lion Aegis, Citadel of Kings, Imperial Scutum, Graveking Carapace, and Astral Ward. Each adds family-specific crown, crest, point, heraldry, antler, or astral geometry to the shared broad-face construction while retaining the Tier 2 reinforcement beneath it. The existing schema-v5 field carries Tier 3 through editor selection, naming, randomization, history, comparison, persistence, presets, and exports without a migration. Automated checks prove every Tier 3 frame differs from Tier 2, each directional idle silhouette grows, all eight families remain distinct, the legendary layer follows walk and attack motion, and all additions preserve face clearance.

The tenth content slice adds oversized mythic Tier 4 forms for every shield family: Aegis of the Solar Titan, Worldwyrm Bulwark, Empyrean Starshield, Lion Throne Bastion, Fortress of Eternity, Imperator's Warwall, Ossuary of the Colossus, and Barrier of the Firmament. Tier 4 cumulatively preserves the Tier 2 reinforcement and Tier 3 identity while adding bright mythic cores, wider solar rays and dragon wings, larger star points, taller crowns, fortress rails, imperial bands, colossal bone spines, and expanded arcane projections. The broad-face silhouettes grow outward from the fixed hand attachment while following the existing off-hand rig. Exhaustive validation proves every Tier 4 frame differs from Tier 3, every directional idle silhouette expands, all eight families remain distinct, walk and attack poses move the mythic geometry correctly, and the protected face area stays clear. Live A/B and contact-sheet review also confirm that the larger forms remain recognizable at exact 24x24 scale.

The eleventh content slice completes shield progression with eight artifact Tier 5 forms: Worldsun Disc, Voidwyrm Aegis, Paradox Star, Throneheart Aegis, The Unbroken Gate, Imperial Eternity, Deathking's Reliquary, and Event Horizon. Like the rebuilt Tier 5 weapons, these shields branch from the cleaner Tier 3 foundation instead of stacking more decoration onto Tier 4. Each family gains its own apex silhouette and material language—solar corona, void dragon, paradox star, royal heart, fortress gate, victory laurel, soul reliquary, or arcane singularity—within the same hand-attached broad-face construction used in every facing. Exhaustive validation covers every direction, animation, and frame; proves all eight artifact families remain distinct; confirms their walk and attack motion; preserves the protected face area; and expands the Complete Character Kit to 769 unique component sheets after visually identical Tier 5 color passes are collapsed.

The twelfth content slice makes the Complete Character Kit a broader game-asset package by adding all 41 enemy families and 138 variations as ready-to-use native `288x96` sheets. Enemy files live at stable `enemies/<family>/<variation>.png` paths, remain independent from the regular 1x/2x/3x/4x manual export selector, and appear in both standalone Complete Character Kits and combined Complete Packs. Schema v2 publishes the enemy library and its counts in `manifest.json`; a full 24-player Complete Pack contained 931 PNGs at this milestone.

The thirteenth content slice expands biome coverage with a swamp-and-shoreline roster: frogs, crocodiles, turtles, and jellyfish. Each new family has four palette-and-marking variants plus a dedicated silhouette and animation language—hopping and tongue lashes, low armored crawls and bites, shell-first trudges and head extensions, or floating bell pulses and tentacle whips. This raises the roster to 45 families and 154 variants, the standalone Complete Character Kit to 924 PNGs, and a full 24-player Complete Pack to 947 PNGs.

The fourteenth content slice adds four further silhouette families in one batch: centipedes, carnivorous plants, anglerfish, and griffins. Sixteen variants introduce segmented many-leg scuttles and venom strikes, rooted bloom snaps and vine lashes, swimming lure pulses and oversized bites, plus winged quadruped flaps and claw dives. The roster reaches 49 families and 170 variants, the standalone Complete Character Kit reaches 940 PNGs, and a full 24-player Complete Pack reaches 963 PNGs.

The fifteenth content slice is the Strange Wilds expansion: mantises, moths, octopuses, and moles add sixteen variants with scissor-blade rushes, four-pose wing flutter and dust bursts, tentacle crawls and ink lashes, plus grounded burrow-and-erupt attacks. The roster reaches 53 families and 186 variants, the standalone Complete Character Kit reaches 956 PNGs, and a full 24-player Complete Pack reaches 979 PNGs.

The sixteenth content slice is the Cursed Frontier expansion: scarecrows, snails, porcupines, and haunted puppets add sixteen variants with spinning straw arms, shell retreats and rolling charges, expanding quill bursts, and unnatural jointed marionette attacks. The roster reaches 57 families and 202 variants, the standalone Complete Character Kit reaches 972 PNGs, and a full 24-player Complete Pack reaches 995 PNGs.

The seventeenth content slice adds a modular Combat Effects library: five direction-aware weapon trails, seven projectiles, six impacts, and six persistent status overlays. Every effect uses the full transparent `288x96` sheet contract, reads the same attack column and direction row as its wielder, and remains separate from character art so a consumer can choose an appropriate component-aware draw order. Non-status effects stay transparent outside attack frames, while status overlays animate throughout idle, walk, attack, and hurt. Complete Kit and Complete Pack schema v3 add stable `effects/<category>/<effect>.png` paths; the standalone kit reaches 996 PNGs, the 24-player Complete Pack reaches 1019 PNGs, and the bundled asset pack reaches 232 exported sheets. The editor's current effects-after-complete-character preview order is a known unresolved shield/equipment occlusion problem, not a finalized rule.

The eighteenth content slice turns those modular effects into game-ready Combat Loadouts. Player weapons and enemy attack styles now resolve automatic trail, projectile, and impact defaults, while every slot—including an optional status overlay—can be overridden or disabled. The editor previews the synchronized result without baking effects into the base sprite, saves up to 100 named recipes locally, and exports a standalone schema-v1 JSON contract with base specification, selections, resolved stable paths, zero-based attack columns, timing, and draw order. Regular packs retain each entry's recipe, while Complete Kit and Complete Pack schema v4 attach combat loadouts to their matching character recipes and keep all artwork deduplicated.

The loadout data and effect sheets remain valid and modular, but the current preview compositor is not visually accepted for foreground shield interaction. Fixing that preview must preserve the base sprite and separate effect exports rather than rebaking them together.

The nineteenth content slice adds the Equipment Variant Batch Builder for games that prefer ready-made sheets over runtime component composition. One player identity can expand into 16 weapon families at the current tier, up to five tiers of the current weapon, the complete 76-state weapon arsenal, five armor tiers, the 41-state shield armory, or a deduplicated 120-sheet RPG equipment collection. Schema v1 records the source identity, stable batch definition, complete specifications, animation contract, selected scale, and a resolved combat loadout for every variant. Only referenced combat effects are included once, explicit loadout overrides are preserved, and character PNGs remain effect-free. The production proof archive contains 120 unique native character sheets plus 16 native effects, with 136 unique `288x96` PNGs, no missing references, and no duplicate file content.

The twentieth content slice adds focused RPG Class Packs for Warrior, Guardian, Ranger, Rogue, Mage, and Cleric roles. A class definition chooses its outfit family, Tier 1 starting loadout, allowed weapons, and allowed shields while preserving the source character's identity, colors, and custom palette. Applying a class is undoable; exporting expands every allowed weapon, the class armor, and every allowed shield through all five tiers, then deduplicates complete specifications into bounded collections of 54, 54, 29, 29, 24, and 39 ready sheets respectively. Class Pack schema v1 records the complete class definition, source character, class base, animation and scale contract, every complete variant specification, and a resolved modular combat loadout for every sheet while including referenced effects only once beneath stable game-facing paths. The native Mage production proof contains 24 ready character sheets plus six referenced effects, including all three magic projectile families and a preserved Frozen override; all 30 PNGs are unique `288x96` files with no missing, duplicate, or unreferenced content.

The twenty-first content slice adds six stable player species: Human, Elf, Orc, Goblin, Tiefling, and Celestial. Human is the exact legacy-compatible default; the other species add direction-aware ears, tusks, horns, animated tails, wings, and halos while reusing the proven humanoid body, equipment, and animation rig. Front traits hide beneath full helmets, back traits retain correct occlusion, presets migrate to schema v7, and class and equipment planners preserve species as part of character identity. Complete Kit and Complete Pack schema v5 add 27 deduplicated species sheets in separate back/front passes, raising the component library to 796 PNGs, the standalone kit to 1023 PNGs, and a 24-player Complete Pack to 1046 PNGs. Exhaustive validation proves Human parity, all six complete animation signatures, visible directional traits, full-helmet behavior, and pixel-exact recipe recomposition.

The twenty-second content slice adds four stable player body builds: Classic, Lean, Sturdy, and Heroic. Classic is pixel-identical to every legacy or missing-build specification; Lean narrows the torso, Sturdy broadens it, and Heroic creates a readable shoulder-to-waist taper while preserving the established hand, weapon, shield, species, and animation anchors. Presets migrate to schema v8, randomization and naming understand builds, and class and equipment planners preserve them as part of character identity. Complete Kit and Complete Pack schema v6 expand only the build-dependent outfit and cape passes to 460 fronts and 140 backs, raising the shared component library to 1246 PNGs, the standalone kit to 1473 PNGs, and a 24-player Complete Pack to 1496 PNGs. Exhaustive validation proves Classic parity, distinct silhouettes in every direction, animation, and frame, build-specific outfit and cape content across all five armor tiers, and pixel-exact recipe recomposition.

The twenty-third content slice adds six stable player expressions: Neutral, Happy, Angry, Sad, Surprised, and Determined. Neutral is pixel-identical to every legacy or missing-expression specification, while the five new moods remain distinct across every visible direction, animation, and frame. Expressions render as their own component between the head and front species traits, remain visible through redesigned open-lens glasses, and hide completely beneath full helmets; established humanoid enemy faces remain unchanged. Presets migrate to schema v9, randomization and filenames understand expressions, and class and equipment planners preserve them as part of character identity. Complete Kit and Complete Pack schema v7 add six expression sheets, raising the shared component library to 1252 PNGs, the standalone kit to 1479 PNGs, and a 24-player Complete Pack to 1502 PNGs. Exhaustive validation proves Neutral parity, six distinct animation signatures, directional visibility and helmet occlusion, stable recipe paths, and pixel-exact recomposition.

The twenty-fourth content slice expands player customization with four direction-aware hairstyles—Braids, Afro, Topknot, and Messy—and four headgear choices—Bandana, Circlet, Plumed Helm, and Skull Mask—without changing the stable ids of the original seven hairstyles or eight headgear entries. All 11 hairstyles animate through front, side, and rear views. Braids, Afro, and Messy retain readable lower details under fitted gear, while Topknot intentionally shares the compact short/spiky/bowl fit; Bandana and Plumed Helm use outfit colors, Circlet and Skull Mask remain fixed-color components, and expression visibility follows each silhouette, including complete Skull Mask coverage. Complete Kit and Complete Pack schema v8 add 119 deduplicated hair sheets and 41 headgear sheets, raising the shared component library to 1317 PNGs, the standalone kit to 1544 PNGs, and a 24-player Complete Pack to 1567 PNGs. Exhaustive validation proves catalog stability, distinct animation signatures, fitted-hair behavior, expression visibility and coverage, outfit-color behavior, and pixel-exact recipe recomposition.

The twenty-fifth content slice adds four RPG-ready outfit families—Barbarian Furs, Ranger Coat, Cleric Vestments, and Necromancer Robes—after the original five stable outfit ids. Each family has a readable front, profile, and rear identity across Classic, Lean, Sturdy, and Heroic builds; follows idle, walk, attack, and hurt motion; and receives five named armor tiers with family-specific materials and apex accents. Ranger and Cleric class defaults now select their matching outfits. Complete Kit and Complete Pack schema v9 expand outfit coverage to 1020 front sheets and 140 cape-back sheets, raising the shared component library to 1877 PNGs, the standalone kit to 2104 PNGs, and a 24-player Complete Pack to 2127 PNGs. Exhaustive validation proves stable catalog order, all-family and all-tier distinction, directional color behavior, body-build silhouettes, animated motion, and pixel-exact recipe recomposition.

The twenty-sixth content slice expands the Class Pack Builder from six to ten stable RPG roles. Barbarian turns the new fur silhouette into a shieldless 24-sheet heavy-weapon pack; Necromancer combines deathshrouds, four ritual weapon families, and bone or arcane shields in 34 sheets; Paladin produces 39 plate, holy-blade, crushing-weapon, and heavy-shield sheets; and Druid mixes a wilderness coat, martial tools, spell focuses, and primal shields across 34 sheets. The original six ids and Warrior default remain unchanged. Generic validation proves every template references valid unique equipment, preserves the complete source identity and custom palette, applies Tier 1 defaults, stays within its curated rules, deduplicates complete specifications, and resolves every expected modular combat-effect family.

The twenty-seventh content slice expands the playable species roster from six to ten with Dwarf, Undead, Lizardfolk, and Beastkin. Dwarf adds a broad directional head silhouette without moving the shared body or equipment anchors; Undead adds a fixed-color skull and animated bone hands; Lizardfolk adds skin-matched scale crests, slit eyes, a profile snout, and an animated hip-level tail; Beastkin adds hair-matched ears, muzzle, and animated tufted tail. Human remains pixel-identical, every species stays distinct across all directions and animations, full helmets suppress front traits, and all body builds, outfits, weapons, shields, expressions, and hairstyles remain compatible. Complete Kit and Complete Pack schema v10 add 33 deduplicated species sheets for 20 back and 40 front passes overall, raising the shared component library to 1910 PNGs, the standalone kit to 2137 PNGs, and a 24-player Complete Pack to 2160 PNGs. Validation proves palette-axis selection, walk/attack tail motion, stable recipe paths, and pixel-exact recomposition.

The twenty-eighth content slice extends None, Complete B, and Selective C
outlines from assembled players to every enemy family. It combines connected
exterior contours, component-aware humanoid equipment separation, and
family-specific separated-component thresholds with source-geometry repairs
that reserve one outline cell around every frame. At the historical
12-column approval checkpoint, the final lane covered all 57 families / 202
variants / 9,696 source frames, kept the two outline modes distinct in every
frame, and reported zero source-edge frames and zero out-of-bounds writes. All
rollout groups were visually approved before local `ac860aa`; no push or
fixture-baseline rewrite was performed in that dedicated lane.

The twenty-ninth content slice establishes non-shield utility off-hands with
one visually approved Lantern. A separate `offhand` catalog avoids pretending
that utility items are tiered shields; editor selection, randomization,
history, comparisons, presets, ordinary packs, equipment batches, compatible
class packs, assembled exports, and Complete Kit recipes preserve the field
while enforcing mutual exclusion with `shield`. Dedicated `offhand-back` and
`offhand-front` passes follow the animated left-hand socket and join the
component-aware off-hand equipment owner. Complete Kit/Pack schema v12 adds two
stable Lantern component sheets, raising the shared component library to 1912
PNGs, the standalone kit at that pre-EN-E01 consumer checkpoint to 2139 PNGs,
and a 24-player Complete Pack to 2162 PNGs. The original 12-column validator covered 192
body-build/direction/animation/frame cases; the current 20-column gate covers
320 with zero discarded pixels, face clearance, layer routing, and exact
recomposition. No fixture, baseline, release artifact, or effect-compositor
approval is implied.

The thirtieth Phase 5 slice completes Production Roll v1. The existing
unrestricted `randomPlayer()` remains Wildcard Roll, while the new pure policy
uses portable seeds, ten existing class archetypes, coherent equipment tiers,
fixed catalog palette families, visibility normalization, and a bounded
silhouette budget. A balanced 120-pair Production/Wildcard corpus was approved
on 2026-07-26 with Form shading, Effects Off, and no Production-specific
outline default. The editor exposes separate whole-character actions,
Production applies its resolved player and presentation as one undoable
change, and lightweight archetype/tier status remains ephemeral. The policy,
review harness, catalog/class freeze, editor integration, and 1,000-seed
validator were checkpointed and pushed at `aa77666`; no persistence or export
schema version, renderer, geometry, fixture, baseline, effect compositor,
release artifact, or Windows build changed. Slice 6's technical compatibility
gate received final integration approval on 2026-07-27.

The thirty-first Phase 5 slice completes compatible Production category
rerolls. The pure `production-compatible-reroll-v1` policy deterministically
filters complete candidate catalogs through the approved Production validator
and changes only one declared semantic category. Thirteen explicit Player `C`
buttons coexist with sixteen unchanged unrestricted category-Wildcard arrows;
armor maps to one coherent power-tier action for equipped armor, weapon, and
shield. Known class, tier, and palette context is history-only, so compatible
changes undo/redo without entering ordinary players, presets, packs, recipes,
exports, or schemas. The full gate passes 4,200 compatible cases, 555 explicit
no-alternative cases, live single-field and coupled-tier changes,
whole/category Wildcard boundaries, and Player/Enemy/Effect isolation. No
renderer, geometry, fixture, baseline, effect behavior, release artifact, or
Windows build changed.

The thirty-second Phase 5 slice establishes the Wildshot game-pack actor
contract at pushed checkpoint `d6a56c1`. Native 1x 24x24 actor sheets now use
the public 20-column Idle/Walk/Attack/Cast/Hurt/Death contract: Players have
authored Cast and Death motion, Enemy Cast aliases Attack, and Enemy Death
aliases Hurt frames 1, 2, 2, 2. The pure manifest/refusal boundary is
implemented, but the pack still refuses emission until license text and the
compact effect contract are approved; writer, editor, and consumer slices are
also pending.

The thirty-third Phase 5 slice is an isolated 48x48 Bosses review lane. Nine
four-direction pilots are pushed at `08d1ef7`; six full 20-column animation
corpora plus three static fallbacks are pushed at technical checkpoint
`f15a9cf`. At that checkpoint the Bosses workspace is ephemeral and
native-1x-only, with no connection to Enemy mode, production renderers,
persistence, ordinary packs, fixtures, or Windows builds. The later frozen
Boss-pack transport remains a separate gated lane. The six-boss structural
gate passes 480 distinct frames and 66 native sheets. Goblin War-Crown remains
the current visual-review candidate, so the pushed checkpoint must not be described as
final visual acceptance. The later Cruel Catgirl Templar of the Brutes
direction design was explicitly approved, and its seventh 80-frame animation
corpus was accepted after its foreground-grip and attack-lift depth repair.
Divine Armored Templar Astro Knight was then accepted as the eighth 80-frame
animation corpus after its sealed-helmet direction repair and full motion
review. Furious Depraved Rhino then became the twelfth approved
four-direction pilot, followed by Gunslinger Boar Rider as the thirteenth.
The Rhino was subsequently reopened for a low quadruped silhouette repair, so
its four regenerated direction controls and dependent ninth 80-frame corpus
are again visual candidates. The Boar Rider's tenth 80-frame
gallop/dual-revolver corpus remains a separate animation candidate. Neither
candidate gains implicit visual acceptance from structural validation.
Eclipse Unicorn Sovereign follows as a fourteenth direction-catalog entry and
second direction candidate; animation remains approval-gated.

Candidate additions:

- More body types beyond the completed four-build silhouette foundation
- More facial details and expressions beyond the completed eight-detail and six-expression foundations
- More hairstyles and headgear beyond the completed 11-style and 12-choice foundation
- More outfits beyond the completed nine-family foundation; avoid tiny accessory clutter at 24x24
- More melee, ranged, and magical weapons (first eight-weapon expansion and complete Tier 2/Tier 3/Tier 4/Tier 5 progression finished)
- Additional off-hand items beyond the completed Lantern, such as spell foci; quivers require a separate back-slot plan rather than the held-item topology
- More species-specific features beyond the completed ten-species ears, tusks, horns, skulls, muzzles, scales, wings, halo, and tail foundation
- Additional enemy families and variants only through the approved planning
  and review sequence in `ENEMY_EXPANSION_PLAN.md`; EN-E01 and EN-E02 are
  accepted through repaired consumer integration. Both EN-E03 common-Idle v1/v2
  attempts are rejected; the later Hill Breaker F1 calibration is visually
  approved together with its F2-only continuation as an internal two-frame Idle
  baseline; Steppe Hunter F1/F2 is also an approved internal two-frame Idle
  baseline; Briar Reveler F1/F2 is the third approved internal two-frame Idle
  baseline; Hill Breaker Walk W1-W4 and Steppe Hunter Walk W1-W4 are also
  approved and internal; Briar Reveler Walk W1-W4 is also approved and internal;
  Hill Breaker common Attack A1-A4 is also visually approved, internal, and
  non-public; Steppe Hunter common Attack A1-A4 is also visually approved,
  internal, and non-public; Briar Reveler common Attack A1-A4 is also visually
  approved, internal, and non-public; no later EN-E03 gate is currently
  authorized
- Additional production animations only after the 20-column contract has a
  versioning plan; review-only boss pilots remain isolated

Content is added through the stable definition and validation workflow established in Phases 2 and 4.

## Phase 6 - Windows release

Progress: active. The release lane has native Save dialogs for every PNG, JSON,
and ZIP export, final product metadata and icons, a current-user NSIS target
with an embedded WebView2 bootstrapper, a release-specific validator, and a
versioned GitHub draft-release workflow. Historical installer and standalone
smoke tests passed their earlier checkpoints. A new local standalone proof was
built from the `bf6269c` worktree state on 2026-08-01, but it has no recorded
packaged smoke approval and is not an installer. No NSIS setup executable
currently exists, so there is still no approved release candidate. Full NSIS
install/uninstall testing, code signing, and automatic updates remain deferred
until a stable distribution identity and a deliberate release checkpoint
exist.

Goals:

- Native save and open dialogs where they improve the workflow.
- Final application icon, product metadata, and window behavior.
- NSIS setup executable and/or MSI packaging.
- Versioned release builds through GitHub.
- Code signing and automatic updates when distribution warrants them.
- Release notes, migration checks, and packaged smoke tests.

Exit criteria:

- A signed, versioned Windows installer can be distributed confidently.
- Installation, launch, export, update, and uninstall are verified.
- A release can be reproduced from the repository.
