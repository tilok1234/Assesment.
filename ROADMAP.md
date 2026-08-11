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

Current integration checkpoint (2026-08-09): branch
`codex/approved-enemy-assembler-integration` brings all completed approved
backlog suites into the assembler without editing their pixels. It registers
eight EN-E06 variants across Fairy, Hag, and Dryad; adopts six completed EN-E03
variants across Giant, Centaur, and Satyr; and routes `zombie/ghoul` through
the approved Ghoul Upgrade without a duplicate family. The stable/consumer
registry is 23/57, the public catalog is 80/259, the Complete Kit is 2,196
PNGs, and the 24-player Complete Pack maximum is 2,219 PNGs. The focused
1,200-frame integration gate, fast gate, and full project gate pass. All 232
legacy fixtures remain unchanged. Three EN-E03 Idle-only variants,
Heartwood Warden, Redcap, Nymph, EN-E07, effects, fixture regeneration, and
release remain outside this integration. The integration source and docs are
committed and pushed at `90ac018923fbaa9906cd47cdc9ef22f0db77336a`.

Current EN-E06 progression through the published Rivercrown Muse checkpoint (2026-08-10):
Ironboot Trapper is approved and
published at implementation `98865936244b94860985210fcaf9a044b0ca228a` plus
approval record `00a9876f963522c88b9cd77f809bec3674d72b19`, with reconciled
handoff `dc6d524ec2d7d980b5407de75a33c00af7819de7`. The designer's later
`cool lets do nexrt` opens only elite Bloodcap Reaver on
`codex/en-e06-redcap-bloodcap-reaver`. Its private hash-frozen 80-frame
candidate passes 80/80 connected, bounded, grounded, hard-alpha,
Goblin Scout/Hobgoblin/Barrow/Ironboot pixel, and alpha-silhouette distinction
gates at digest
`e9a41fd37e19d96911cfffee3bd89e3859f9cbb95099996632f877da2dbdabff`.
The exact raw, Complete B + Form, four-way comparison, and paired GIF evidence
was opened together in Aseprite and visually approved on 2026-08-10. The frozen
implementation `1a1ba00ea1edfa6e8bd946e95f5e35c6080ce73a` and approval record
`5c55af26481f9a79988382df3d67b8ff33b765a4` are committed and pushed on the
tracked branch. The designer's later `lets do next` opens only common Nymph
Spring Dancer on `codex/en-e06-nymph-spring-dancer`. Its private hash-frozen
80-frame implementation passes 80/80 connected, bounded, grounded, hard-alpha,
Elf/Fairy/Grove pixel, and alpha-silhouette distinctions at digest
`b68906d962e16611384e419610324c6a9934d63ab329963f0734e83255dabe8c`.
The exact five-artifact packet was opened together in Aseprite and visually
approved on 2026-08-10. Frozen implementation
`9d6366b0c5456704137aadfbbec9a67eccb5fd7c` and approval record
`eae49376fd7bc4dd315168cb2989293de4a73f55` are committed and pushed on the
tracked branch. Later Nymphs, EN-E07, registration, fixtures, shared
renderer/schema changes, effects, and release remained closed until the
separately authorized Mist Weaver gate. Its private hash-frozen 80-frame
implementation on `codex/en-e06-nymph-mist-weaver` passes 80/80 connected, bounded,
grounded, hard-alpha, Elf/Spring/Spore pixel, and alpha-silhouette distinctions
at digest `e57a0af441f895fe376f2696d859a97d84564ddf034235d3b237b2cf637520da`.
The exact five-artifact packet was opened together in Aseprite and visually
approved on 2026-08-10. Frozen implementation
`682f99a581e70ee1c985257e0c122d75c7add6f9` and approval record
`07a673df462cdb651673fd042fb92965da624faf` are committed and pushed on the
tracked branch. Rivercrown Muse, EN-E07, registration, fixtures, shared
renderer/schema changes, effects, and release remained closed until the
separately authorized Rivercrown Muse gate. Its private hash-frozen 80-frame
implementation on `codex/en-e06-nymph-rivercrown-muse` passes 80/80 connected,
bounded, grounded, hard-alpha, Elf/Spring/Mist pixel, and alpha-silhouette
distinctions at digest
`4917d42fd0b480e4c2635ba4c96725e6b68afec1075dacb8acee2f70dc886bcd`.
The exact five-artifact packet was opened together in Aseprite and visually
approved on 2026-08-10. Frozen implementation
`39bd0658d53acbfe7aa4484e14f6518551720142` and approval record
`ca82f079ff84934edc4ab51a8d406050b9083d2a` are committed and pushed on the
tracked branch. EN-E07, registration, fixtures, shared renderer/schema changes,
effects, and release remain closed.

Current EN-E07 approval checkpoint (2026-08-10): common Pale Echo and
specialist Falseface Adept are approved and published. Falseface implementation
`c415620c2f7f95b98c8b8563a2c1d6e39abb4a73`, approval record
`cb68ec7e861f7130aafb6c60b1e4b4a16676e9cb`, initial handoff
`a215f091022537644a4616e8b0977f12d972eb6d`, and final reconciliation
`b16b7d2c8cd91ffbf31e0c9ac55d392c53a4b64c` are published and remote
verified. The designer's `lets do nezxt` reply opens only elite Grand Pretender
on `codex/en-e07-doppelganger-grand-pretender`. Its repaired authored default
form at digest
`03ca03ade7be4efcb2e69aafe3400cf6a452d26f1ddbaccca2b561374c172dcb`
uses the approved pale/slate/wine language with a fused three-panel visage,
continuous right-swept crest, asymmetric connected mantle, layered split coat,
paired connected claiming hands, separated legs, and grounded broad boots.
The first packet was rejected before freeze because A1 erased the face under a
pale hand cap and inherited fringe pixels made the crest read as horns. The
repaired 217-273-pixel candidate restores the expected face and replaces that
fringe with one occluding swept hair mass. All 80 frames are connected,
bounded, grounded, and pixel/alpha distinct from Pale Echo, Falseface Adept,
and Cultist Zealot. The exact five-artifact packet is hash-frozen and
reproduces twice. All raw and effects-enabled phase boards were inspected and
the three exact PNGs were opened together in responsive Aseprite. The
23-command matrix, fast suite, and full suite pass with the approved integration
digest and 232 fixtures unchanged. The designer replied `Approved lets do
next`; implementation `0a8d5094d5e5de575f1966db30fc01d093a866c3` and
approval record `0c54731d5fc1a14495d13ebb4c2accd98ba8b8a3` plus initial
handoff `c551799f585df2643f83a605279cda06cc629e45` are published and remote
verified. Grand Pretender remains private, unregistered, and fixture-free. The
same response opens only one private common Will-o-Wisp candidate from the
clean publication reconciliation. Registration, fixtures, runtime copying, effects, later
EN-E07 roles/families, release, and EN-E08 stay closed.

Approved preceding EN-E07 art checkpoint (2026-08-11): that candidate was
common Will-o-Wisp Lantern Mote on
`codex/en-e07-will-o-wisp-lantern-mote`, based exactly on clean Grand Pretender
reconciliation `3ddbe159360f16844d167ecc753d6b767b7e5549`. Its 146-154-pixel
hovering form at digest
`f50a0c6f08b63dde7bad06542140123c5d6bb7fb419b7df2789cffa441a9ebb8`
uses a connected stepped wick, broad ribbed cage, single core eye, tapered
inner flame, and two connected lower prongs. The first focused run caught and
repaired one detached prong pixel and duplicate eye pixels before freeze. All
80 frames are connected, bounded, hovering, hard-alpha, and pixel/alpha
distinct from Spectral Ghost, Shadow Slime, and Flame Elemental. The exact
five-artifact packet reproduces twice. All raw and effects-enabled phase boards
were inspected, and the three exact PNGs were opened together in responsive
Aseprite. The 24-command matrix passed in 16.0s, fast validation in 55.6s, and
full validation in 108.4s with the approved integration digest and 232
fixtures unchanged. The designer replied `approved lets do next` on
2026-08-11; implementation `96907f552a06ba3865e25a46f881af5add2237ee`
and approval record `878e4969de59c500de342555e9b136e3d8cde2de` plus initial
handoff `71f0fbc07f088d6c366f11dc462856e79e3fde8b` are published and remote
verified; final publication reconciliation
`d734846067b3bf9dd05cadffef440ead1f6c6d3a` is remote exact. Lantern Mote
remains private and unregistered. Registration, fixtures, effects, elite
Will-o-Wisp, Changeling, Kelpie, release, and EN-E08 stay closed. That approval
reply opened only the private Fenbell Shepherd candidate below.

Approved preceding isolated EN-E07 art checkpoint (2026-08-11): specialist Will-o-Wisp
Fenbell Shepherd on `codex/en-e07-will-o-wisp-fenbell-shepherd` is based
exactly on clean Lantern reconciliation `d734846067b3bf9dd05cadffef440ead1f6c6d3a`.
Its taller 202-210-pixel hovering ritual-lantern form at digest
`0a8000e33705967089ae66c98486eb701da88bfacd9f5adc38a47bbb62f5a46b`
uses one connected hooked wick, a tall bell-shaped ribbed cage, one guiding
core eye, asymmetric connected side shutters, an elongated core, a broad lip,
and three connected lower flame tines. All 80 frames are connected, bounded,
hovering, hard-alpha, and pixel/alpha distinct from approved Lantern Mote,
public Spectral Ghost, and public Flame Elemental. The exact five-artifact
packet reproduces twice; all raw and effects-enabled phase boards have been
inspected at original detail. The 25-command matrix passes in 16.8s, fast
validation in 57.6s, and full validation in 111.7s with the integration digest
and all 232 fixtures exact. The three frozen PNG hashes were reverified and
those exact files were opened together in responsive Aseprite 1.3.17.2. The
designer replied `approved` on 2026-08-11; implementation
`04f113d6e2b95f290925eba040659b441e3cfcd1` and approval record
`89e2e2cb271dc9af60dd4dce6fba3bccd03cd9d7` plus initial handoff
`462e7e5123d96f3ff928cd6ff908267cd313570b` are published and remote
verified, and full validation passes in 108.7s against the published tuple.
Fenbell Shepherd remains private and unregistered. Registration, fixtures,
effects, Changeling, Kelpie, release, and EN-E08 stay closed. The designer's
later `lets do next` reply opened only the private elite candidate below.

Current isolated EN-E07 art checkpoint (2026-08-11): elite Will-o-Wisp
Mirecrown Beacon on `codex/en-e07-will-o-wisp-mirecrown-beacon` is based
exactly on clean Fenbell reconciliation
`8b0754c9594ad91fe378ba11d4f43d7b2a558145`. Its broad 243-254-pixel
sovereign-beacon form at digest
`5fbd53af9fb461717a8bd90698a0b2f7f81f8fdd55fee42fbca5254738654d81`
uses one connected three-prong crown-wick, a wide double-tiered ribbed cage,
one central eye, paired connected buttresses, a deep core, broad basin, and
four connected lower flame tines. All 80 frames are connected, bounded,
hovering, hard-alpha, and pixel/alpha distinct from approved Fenbell Shepherd,
approved Lantern Mote, public Spectral Ghost, and public Flame Elemental. The
initial A3/C3 detached-beam read was repaired before freeze into an enclosed
cage/core expansion. The exact five-artifact packet reproduces in a
post-freeze package build, and all raw and Complete B + Form boards and phase
sheets have been inspected at original detail. The protected 26-command
matrix passes in 19.0s, fast validation in 60.4s, and full validation in
111.2s with the approved integration digest and all 232 fixtures exact. The
three frozen PNG hashes were reverified and those exact files were opened
together in responsive Aseprite 1.3.17.2; its live command line names all three
paths. The designer replied `approved lets do next` on 2026-08-11;
implementation `72925cd8d8ea1a3ae47a45601607a1a5853decb3` and approval
record `6448bb49e16679b94fcc402166b089b6b6ca7174` plus initial handoff
`72b529bcdd19bd0d3018f2b03ceabcb29a809015` are published and remote
verified, and full validation passes in 110.9s against the published tuple.
Mirecrown Beacon remains private, unregistered, and fixture-free. The same
reply opens only one private common Changeling candidate from this clean
publication reconciliation. Registration, fixtures, effects, later roles or
families, Kelpie, release, and EN-E08 remain closed.

Current approved EN-E08 checkpoint awaiting publication reconciliation
(2026-08-11): elite Animated Armor
Crownvault Castellan on `codex/en-e08-animated-armor-crownvault-castellan` is
frozen at digest
`112feaad57ce04cb2dae15f5bd33f2e7e4fd3418cd3aece68aeb345ff1dc9039`
from clean published Runeforge Custodian reconciliation
`700f2cedb1d3104369931a97bfec31a3b49fff93`. The royal-fortress role is one
baked actor with zero child assets and passes its focused 80-frame gate;
fast validation passes in 56.4s and full validation in 105.6s with public
80/259 and all 232 fixtures exact. The designer replied `approved`;
implementation `46d09a4e16a11f9c622cb698ff30055bb9bcb877` records the accepted
pixels. The approval record and bounded publication reconciliation are pending.
Registration, fixtures, effects, later EN-E08 families, release, accepted
drift, and a PR remain separate gates.

Approved preceding EN-E08 checkpoint (2026-08-11): specialist Animated Armor
Runeforge Custodian on `codex/en-e08-animated-armor-runeforge-custodian` is
frozen at digest
`629930688cca04f3d714e12225ab8c3db7c494c5fbaf027d65ec7f8d530ccf85`
from clean published Hollow Sentry reconciliation
`dc86bb65053564c76b18e848933ab4c2d318bfde`. The constructed-rune-lock role is
one baked actor with zero child assets and passes its focused 80-frame gate;
the frozen review + focused + fast gates pass together in 59.6s and full
validation passes in 113.1s with public 80/259 and all 232 fixtures exact.
The designer replied `accepted`; implementation
`d73ca9334640384d9b531c0d8375c1a42e459212` and approval record
`717b4f7f735984550f44ce90d0bba58cfd6e1762` plus initial handoff
`054b100cbf9edc8e13facb5f8a312c03b9a7bdd9` are remote verified. This
reconciliation completes the bounded publication tuple.
Registration, fixtures, effects, the elite role, later EN-E08
families, release, accepted drift, and a PR remain separate gates.

Approved preceding EN-E08 checkpoint (2026-08-11): common Animated Armor Hollow
Sentry on `codex/en-e08-animated-armor-architecture` is frozen at digest
`f6e7cbf25692b08e2e4dfccef149662c18d195e4cf615185f7a38e4874e2b9ac`
from clean published Blackwake reconciliation
`defc9b8cab1226610da6cf2b17951c8b5815499e`. The explicit topology choice is
`baked-single-actor`: all armor parts live inside one 24x24 frame and all 80
frames report zero child assets. The collision ruling keeps Haunted Armor and
Animated Armor as one `animated-armor` family; Hollow Sentry is the
haunted-default common while constructed/specialist/elite identities remain
deferred. Its 219-306-pixel suite passes 80/80 connected, bounded, grounded,
split-sabaton, broad-plate, topology, hard-alpha, alias, mirror, and pixel/alpha
distinctions from Fallen Knight Shieldbearer, Grave Oathkeeper Revenant, and
Gloam Walker; 72/72 colored frames, 8/8 exact white flashes, and 54/54 readable
visor views pass. `check:fast` passes in 62.3s and full `check` in 121.5s
before approval, then in 61.5s and 107.7s against approved-local metadata,
with public 80/259 and all 232 fixtures exact. The exact three frozen PNGs are open
together in responsive Aseprite 1.3.17.2 process 6832. Status is
`approved`: the designer replied `apprvoed`, approving only the exact digest
above. Implementation `914aa700b82469dbb22ca1600f1bc7ad6dbecff7` and
approval record `6a577566766afc66aa01cdf1c7ebd1430aad425d` plus initial handoff
`e12ff211dda002ac1c089eaedc0ff369d1e432e0` are remote verified. Status is
`approved` and `published`; this reconciliation completes the bounded tuple.
Registration, fixtures, child/state assets, effects, later
roles/families, release, accepted drift, and a PR remain closed; another art
candidate requires a separate `lets do next` from this clean publication.

Approved preceding EN-E07 publication checkpoint (2026-08-11): elite Kelpie Blackwake
Dreadmare on `codex/en-e07-kelpie-blackwake-dreadmare` is based exactly on clean
published Drownbridle Stalker reconciliation
`f9928aed53cd842b937d396e29ec8d6a7aaa8120`. Its 255-319-pixel broad rear-heavy
breaker-maned equine form is frozen at digest
`be29daec400cffca3f5822aec3bd6ca37c8139a8783f51c7238b47aa37001172`.
All 80 frames are connected, bounded, grounded, retain four separated hoof runs
and broad tall elite spans, and are pixel/alpha distinct from approved
Drownbridle Stalker, Miremane Courser, and Steppe Hunter; 72/72 colored frames,
8/8 exact white flashes, 54/54 expected eye-bearing views, and 54/54 readable
muzzle views pass. `check:fast` passes in 62.9s and full `check` in 121.9s
before approval and 112.2s against approval-local metadata, with public 80/259
and all 232 fixtures exact. The exact three frozen PNGs are open together in Aseprite
process 27380. The designer replied `approved lets do next`; approval applies
only to the frozen digest above. Exact implementation
`3a3ffce6997a6cc9735b818e13573b9085229555` and approval record
`a397f3034b9ce894dd7caf971d4b3c1fbc9cb2e6` plus initial handoff
`d4cfd72229355ccb6024e676562303bc6d633f98` are published and remote-verified.
This reconciliation completes the bounded tuple. Its later architecture
decision is resolved only as the private baked Hollow Sentry gate above.
Registration, fixtures, runtime copying, water effects, release, and accepted
drift remain closed.

Approved preceding EN-E07 publication checkpoint (2026-08-11): specialist Kelpie
Drownbridle Stalker on `codex/en-e07-kelpie-drownbridle-stalker` is based
exactly on clean published Miremane Courser reconciliation
`f143de1fadf3b812f3968d930acf6451e926388d`. Its 203-274-pixel forward-heavy
high-crested equine form is frozen at digest
`d8cbbfef97b63590e6a63335a6b241e742d87f4df5e7443933c5484ef849224b`.
All 80 frames are connected, bounded, grounded, retain four separated hoof
runs and specialist spans, and are pixel/alpha distinct from approved Miremane
Courser and Steppe Hunter plus public Dire Wolf; 72/72 colored frames, 8/8
exact white flashes, 54/54 expected eye-bearing views, and 54/54 readable
muzzle views pass. The focused gate passes in 0.7s, `check:fast` in 53.2s, and
full `check` in 104.7s before approval and 110.3s against approval-local
metadata, with public 80/259 and all 232 fixtures exact. The exact three frozen PNGs are open together in Aseprite at
IDs 19, 23, and 27. The designer replied `approved lets do next`; approval
applies only to the frozen digest above. Exact implementation
`c34b3b9564df683900ff3846d692970faca53ff5` and approval record
`b5a9011b37dc9a3e0db7c371fa168e589665a127` are published and remote-verified.
Initial handoff `1ba57fefe52398c2c007c01adfde6384c327e6f8` is published and
remote-verified. This reconciliation completes the bounded tuple. The same
reply opens only one private elite Kelpie candidate; registration, fixtures,
runtime copying, effects, release, and EN-E08 remain closed.

Approved preceding EN-E07 publication checkpoint (2026-08-11): common Kelpie Miremane
Courser on `codex/en-e07-kelpie-miremane-courser` is based exactly on clean
published Manyfold Usurper reconciliation
`6ddef83e03e983672bee39b6b484dd1c1bfcba01`. Its 166-221-pixel low lean
waterlogged equine form at digest
`6efd596731a468be7647ee37f048046072bad289f209926e4db862cb63b01f32`
uses a bowed wet neck, long readable muzzle, connected dripping mane, long
ribbed barrel, four separated legs and dark grounded hooves, and a connected
drowned-weed tail. All 80 frames are connected, bounded, grounded, retain four
separated hoof contacts and long equine spans, and are pixel/alpha distinct
from approved Steppe Hunter plus public Dire Wolf and Marsh Crocodile; 72/72
colored frames, 8/8 exact white flashes, 54/54 expected eye-bearing views, and
54/54 readable muzzle views pass. `check:fast` passes in 66.0s and full `check`
in 110.4s before approval and 120.2s immediately before the implementation
commit, 102.4s against approval-local metadata, and 110.8s against the final
published tuple, with public 80/259 and all 232 fixtures exact. The exact three frozen
PNGs are open together in Aseprite. Front/rear face, chest/rump, tail color,
hoof separation, and two detached walk legs were corrected before freeze. The
designer replied `approved` on 2026-08-11; approval applies only to the frozen
digest above. Exact implementation
`74463a2b1944b7d3a6d412923c205a0c9cc648f1` and approval record
`8fb53e961247da875814593feb132182648f9e48` plus initial handoff
`ae532a17e92c3a7b0b99ccd3c938f8174f102dd6` are published and remote-verified.
This reconciliation completes the bounded tuple. The candidate
remains unregistered and fixture-free. The designer's later `lets do next`
opened only the private Drownbridle Stalker checkpoint above; runtime copying,
effects, release, and EN-E08 remain closed.

Approved preceding EN-E07 publication checkpoint (2026-08-11): elite Changeling
Manyfold Usurper on `codex/en-e07-changeling-manyfold-usurper` is based exactly
on clean published Mirrorfold Harrier reconciliation
`fdbb4cf04048a819b9cbe1655146842835b86a73`. Its 276-330-pixel broad tall
grounded elite form at digest
`f3ed9a91cb01746fc7467e59c92335778a85b476495f5772ac81cf2a6cbda246`
uses one connected three-tier fan mantle, deep side drapes, one centered
readable face, ink-teal/wine/old-gold folds, paired heavy ordinary forearms, a
pinched middle, wide separated pillar legs, and broad slab feet. All 80 frames
are connected, bounded, grounded, broad-three-tier, wide-pillar, hard-alpha,
and pixel/alpha distinct from approved Mirrorfold Harrier, Veilskin Foundling,
and Grand Pretender; 72/72 colored frames, 8/8 exact white flashes, 54/54
expected eye-bearing views, and 54/54 readable face-feature views pass.
`check:fast` passes in 48.5s and full `check` in 93.1s before approval, 104.1s
immediately before implementation publication, 112.9s against approval-local
metadata, and 113.4s against the final published tuple, with public 80/259 and
all 232 fixtures exact. The
three frozen PNGs are open together in responsive Aseprite 1.3.17.2 process
39276. The designer replied `approved lets do next` on 2026-08-11; exact
implementation `38f9d7f9b3ac5a34bdff91be1fd878e158d26bfe` and approval record
`306aa3ac1ba658cb48e223651410a7df494e7b9e` plus initial handoff
`0d2f5ce3665f848633b4f7a1596356659d720afe` are published and remote-verified.
This reconciliation completes the bounded tuple; the same reply opens only one
private common Kelpie candidate.
Registration, fixtures, runtime copying, effects,
later Kelpie roles, release, and EN-E08 remain closed.

Approved preceding EN-E07 publication checkpoint (2026-08-11): specialist Changeling
Mirrorfold Harrier on `codex/en-e07-changeling-mirrorfold-harrier` is based
exactly on clean published Veilskin Foundling reconciliation
`5eabfecc08f992db675b64ea3317eb59f67d737c`. Its 202-248-pixel compact
grounded specialist form at digest
`be3e4d03263929ce9677fcf15b742cde769271d037160cd6461b45ea389660f2`
uses one connected stepped diamond mantle, angular shoulders, one centered
readable face, plum-copper pinched folds, paired long ordinary forearms, bent
separated legs, and narrow wedge feet. All 80 frames are connected, bounded,
grounded, stepped-diamond, narrow-legged, hard-alpha, and pixel/alpha distinct
from approved Veilskin Foundling, Pale Echo, and Falseface Adept; 72/72 colored
frames, 8/8 exact white flashes, 54/54 expected eye-bearing views, and 54/54
readable face-feature views pass. `check:fast` passes in 56.7s and full `check`
in 106.1s before approval, 138.6s against approval-local metadata, and 95.2s
against the final published tuple, with public 80/259 and all 232 fixtures exact. The three frozen PNGs
are open together in responsive Aseprite 1.3.17.2 process 40804. The designer
replied `approved lets do next` on 2026-08-11; exact implementation
`ab72a9c0600f016439a5351f363b3b34348dc4b1` and approval record
`e976ca5fc5c249af4e727fb3bff7d58fd541a932` plus initial handoff
`4ed366a39165660096306cbb327315b211639e3d` are published and remote-verified.
This reconciliation completes the bounded tuple; the same reply opened only
the private Manyfold Usurper checkpoint above. Registration, fixtures,
runtime copying, effects, Kelpie, release,
and EN-E08 remain closed.

Approved preceding EN-E07 art checkpoint (2026-08-11): common Changeling
Veilskin Foundling on `codex/en-e07-changeling-veilskin-foundling` is based
exactly on clean Mirecrown reconciliation
`4ee32622ec2984ac805ac345b854f23584fda3c3`. Its 201-267-pixel small grounded
fey form at digest
`e472931d214d369331d6cb750619471d9234ab11561233e700facab6ea4f0126`
uses one connected pear-shaped living veil, one centered face with dark
eye sockets, amber glints, and a tiny mouth mark, ochre-coral
folds, paired short ordinary arms, bowed legs, and broad splayed feet. All 80
frames are connected, bounded, grounded, hard-alpha, and pixel/alpha distinct
from approved Pale Echo, public Goblin Scout, and public Imp Sprite; 72/72
colored frames, 8/8 exact white flashes, 54/54 expected eye-bearing views, and
54/54 readable face-feature views pass. The first digest
`1a852ef46dcaa7fee5779379cb9eda9acd79e67cd53dd469ff9cfae9dc18844d`
is superseded by this face-only repair. The revised ten-gate EN-E07 matrix
passes in 6.3s, `check:fast` in 58.3s, and full `check` in 107.1s with all 232
fixtures exact; full `check` also passes in 109.0s against approval-local
metadata and 119.8s against the final published tuple. The designer replied
`approved` on 2026-08-11; exact
implementation `2a295aa70c8a6680ffb85881efa4ccd927a50979` and approval record
`7d064226d9a0096f8b276f5b0bd30be93435962b`, plus initial published handoff
`0dcd15249d97b3e24bf174b014885fa2c8b6177c`, form the completed remote-verified
publication tuple. The packet remains unregistered and fixture-free. Runtime
copying, effects,
specialist/elite Changeling, Kelpie, release, and EN-E08 remain closed; another
candidate needs a separate `lets do next`.

Approved preceding EN-E07 checkpoint (2026-08-10): Nightglass Seer was approved,
published, and reconciled at `46ad4e7`; the designer replied `approved lets do
next`. The Living Shadow role order opens only elite Hollowcrown Regent on
`codex/en-e07-living-shadow-hollowcrown-regent`. Its exact 80-frame candidate
at digest `657e4071ab8432387f7c8b6ecff8650f3f7a63bf7dc8f4b68564373a5e450991`
uses the approved family ramp with a connected three-prong crown, high mantle,
paired eye slits, a diamond void-heart, command bracers, armored split legs,
and throne-step feet. All 80 frames are connected, bounded, grounded, and
pixel/alpha distinct from Cursed Ghost, Shadow Slime, Mist Weaver, Gloam
Walker, and Nightglass Seer. The exact five-artifact packet is hash-frozen but
was visually approved when the designer replied `approved lets do next`.
Implementation `ffe5f574ab9f06ecfaad83c50a7980254eea7211` and approval
record `90a06bd34e1bae29becdc380b01895825cf4a969` plus initial handoff
`0c3d671bee3013413291170e127d3820cdcaff95` are published and remote verified.
The protected 20-gate matrix, fast suite, and full suite pass with the approved
integration and 232 fixtures unchanged. Only one private common Doppelganger
candidate opens from the clean publication reconciliation. Registration,
fixtures, effects, other EN-E07 family artwork, release, and EN-E08 stay closed.

Approved preceding EN-E07 checkpoint (2026-08-10): after Gloam Walker was
approved, published, and reconciled at `98d3781`, the designer said `lets do
next`. The Living Shadow role order opens only specialist Nightglass Seer on
`codex/en-e07-living-shadow-nightglass-seer`. Its exact 80-frame candidate at
digest `07909fa9b74df6dd386ca3f6186fe4da26e8d088af99ad7e2dfa2bcdeb10d3fa`
uses the approved family ramp with a broad faceted mask, one vertical eye,
connected shoulder yoke and sight-frame arms, a hollow chest aperture, bent
split legs, and planted wedge feet. All 80 frames are connected, bounded,
grounded, and pixel/alpha distinct from Cursed Ghost, Shadow Slime, Mist
Weaver, and Gloam Walker. The exact five-artifact packet was opened in Aseprite
and approved when the designer replied `approved lets do next`. Implementation
`325a6f4cfa1418383c93510262a631358add1d5f` and approval record
`d50f3af5da0578edf66a5b2f156744c576427b9c` plus initial handoff
`71d36ef48a55a7f1d49e1e6649a33eb945c9667c` are published. The protected
19-gate matrix, fast suite, and full suite pass with the approved integration
and 232 fixtures unchanged. The later `approved lets do next` response opens
only the Hollowcrown Regent candidate above. Registration, fixtures, effects,
Doppelganger and the remaining EN-E07 families, release, and EN-E08 stay
closed.

Approved preceding EN-E07 checkpoint (2026-08-10): the designer's earlier
`lets do next` advances the frozen plan from completed EN-E06 to priority-first
Living Shadow only. Branch `codex/en-e07-living-shadow-gloam-walker` contains
one private common Gloam Walker 80-frame suite at digest
`131a95a106a36dea2f6879611c8e14e3aa077012dcbd1bd32e111c45658ca3f9`.
Its chunky dark-violet, hard-alpha, connected negative-space silhouette keeps a
hollow face, angular shoulders, long claws, split legs, and planted feet. All
80 frames are connected, bounded, grounded, and pixel/alpha distinct from
Cursed Ghost, Shadow Slime, and Mist Weaver; all fifteen approved EN-E06
digests remain exact and public 80/259 is unchanged. The exact five-artifact
review packet was opened in Aseprite and the designer replied `aaprovced`.
Implementation `a46f59c1cb0bb751760f2776fe60b5c489806c94`, approval record
`848c7192b6dc2cac8b7ab2dc8725d3859447715d`, and initial handoff
`00d5b436c7398312a5f3a05a482b4cf34cee9ba5` are committed and pushed. The
same standing approved-work permission published Rivercrown reconciliation
`d785fe5`. Registration, fixtures, effects, later Living Shadow roles,
Doppelganger and the remaining EN-E07 families, release, and EN-E08 stay
closed.

Historical EN-E06 production checkpoint (2026-08-09): approved Fairies Bramblewing
Scout, Thistle Hexer, and Petalcrown Duelist remain exact, internal, non-public,
and published at `cc92ca9`, `3dc68cb`, and `b265e97`. After Petalcrown
publication, the designer said `lets do nextr`, opening only common Hag Mire
Crone gate `en-e06-hag-mire-crone-full-v1` on
`codex/en-e06-hag-mire-crone`, based on clean Petalcrown publication record
`5c9363e`. Its hash-frozen 80-frame suite passes connected, one-cell-bounded,
hard-alpha, grounded checks; all 80 pixel frames and alpha silhouettes differ
from public Witch/Hexer; candidate digest is
`f35512e73fd7b2308bf408f11c2d21a30631361214a372df7bef2e8fc4e6478d`.
At that historical point the published runtime boundary remained 17/43 expansion and 74/245 public with a
2,182-PNG Complete Kit; public `zombie/ghoul`, all 232 committed fixtures,
effects, release state, and EN-E03 isolation remain unchanged. The exact Mire
Crone boards and GIFs were approved on 2026-08-09 and its bounded implementation
is published at `25f67d4`. The later `next` opens only specialist Cauldron Hexer
on `codex/en-e06-hag-cauldron-hexer`; its hash-frozen 80-frame candidate passes
connected, bounded, grounded, alias, mirror, and 80/80 Mire distinction gates
at digest `17f40220730fe4e83be26156d73e0599235be66a9290284b37cb9c8282c7a1a6`.
The exact packet was approved on 2026-08-09 and its bounded implementation is
published at `4b59b40`, with clean handoff `0a096fa`. The approval reply opened
only one complete Blackthorn Matron lane on
`codex/en-e06-hag-blackthorn-matron`. Its hash-frozen 80-frame candidate passes
connected, bounded, grounded, alias, mirror, and 80/80 pixel plus alpha
distinction gates against both approved Hags at digest
`d4588d754e01dbb4916949f27b801342a310706890a0532a0133216d7cb0c7a9`.
The exact packet was visually approved on 2026-08-09 and the bounded
implementation is published at `8ce2f2a`, with clean handoff `8e56ec2`. The
later `cool next please` opened only common Dryad Grove Tender on
`codex/en-e06-dryad-grove-tender`. Its hash-frozen 80-frame suite passes
connected, bounded, grounded, alias, mirror, and 80/80 pixel plus alpha
distinction gates against public Treant and approved Blackthorn at digest
`18fedaf06c457c8a280b3c5518b0763be48de3b3cb5bd29113f0fd5d183e3a21`.
The exact boards and GIFs were visually approved on 2026-08-09 and the bounded
implementation is recorded at `3d96fed`, with published approval handoff
`4c49f27`. The hash-frozen approved Spore Cantor suite on
`codex/en-e06-dryad-spore-cantor` passes 80/80 connected, bounded, grounded,
Treant-distinct, and Grove-distinct gates at digest
`b22585e7b055f4ae43eb1293741967c1d76ec9bd3b842320880f2038c0cf62ef`.
The exact raw and outlined review packet was visually approved on 2026-08-09;
implementation `46d1dc9` and approval record `61d1fa4` are published.
At that historical checkpoint Heartwood Warden, EN-E07, registration, fixtures,
shared renderer/schema changes, effects, and release remained separate gates.

Historical continuation checkpoint (2026-08-07): synchronized `main` remains the
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
non-public, committed, and pushed. The designer then accepted the explicitly
proposed Hill Breaker Hurt H1-H2 continuation with `lets go for it`. Its
isolated lane on `codex/en-e03-hill-breaker-hurt`, based exactly on synchronized
approved checkpoint `68d913c`, preserves every approved Giant Idle/Walk/Attack
frame, passes its eight-frame focused gate, and has the required labeled
all-four-direction raw and Complete B + Form GIFs ready together. The designer
reviewed both exact GIFs together and said `approved` on 2026-08-07. The bounded
lane is approved, committed, pushed, internal, and non-public. The designer
then said `nice lets do nexrt`; Codex explicitly bounded only Steppe Hunter
Hurt H1-H2 across Down, Left, Right, and Up. Its isolated lane on
`codex/en-e03-steppe-hunter-hurt`, created exactly from approved pushed
checkpoint `3e0d98b`, preserves all approved Steppe Idle/Walk/Attack frames,
passes its eight-frame full-hybrid/fixed-hoof/mirror gate, and has both required
labeled all-four-direction raw and Complete B + Form GIFs ready together. It
was directly approved on both exact GIFs together on 2026-08-07; the bounded
lane is approved, internal, non-public, committed, and pushed. The complete
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
exact seven-family walk/seam repair. That repaired registry remains the
EN-E01/EN-E02 source while the pre-repair registry stays internal. Later
approved EN-E03 through EN-E06 integration gates bring the current expansion
boundary to 23/57 and the public catalog to 80/259, with the Ghoul Upgrade
routed as a replacement rather than a duplicate family.
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
exposure checks. Hill Breaker Hurt H1-H2 is also visually approved and
published; it preserves all 40 approved Giant frames and passes eight connected/distinct,
planted-contact, mirror, one-cell-margin, frozen-evidence, and zero-public-
exposure checks. Steppe Hunter Hurt H1-H2 is also visually approved and
published; it preserves all 40 approved Steppe frames and passes eight
connected full-hybrid, fixed-four-hoof, exact-mirror, one-cell-margin,
frozen-evidence, and zero-public-exposure checks. Briar Reveler Hurt H1-H2 is
also visually approved and published; it preserves all 40 approved
Briar frames and passes eight connected full-body horned goatfolk/staff,
fixed-split-hoof, exact-mirror, rear-head/no-side-eye, one-cell-margin,
frozen-evidence, and zero-public-exposure checks. The designer said `approved
lets do next`; only a separately isolated common Cast/Death alias gate across
the three approved EN-E03 common variants is authorized next. That
candidate preserves 144/144 approved context frames,
passes 48/48 Cast-to-Attack and 48/48 Death-to-Hurt aliases with zero new sprite
pixels and zero public families, and has four required labeled three-family/
all-direction raw and Complete B + Form GIFs. The designer reviewed all four
exact GIFs together and said `approved` on 2026-08-07; the bounded branch is
committed and pushed under the publication contract. Its focused and full
project gates pass with all 232 public fixture sheets unchanged. The full project gate
passes with the complete 1,064-file local Boss checkpoint corpus and all 232
public fixture sheets unchanged. The designer then said `good lets do next`;
at that checkpoint, only Boulder Hurler specialist Idle F1-F2 across four
directions was authorized, with no baked boulder/projectile. Additional
Giant/Centaur/Satyr motion, other variants, registration, effects, release, and
every later gate remained blocked until separately authorized.
The full project gate passes with
the complete preserved local Boss review-checkpoint corpus; fresh-worktree clone
safety remains a separate unvalidated candidate at `125b0b3`.

The bounded Boulder Hurler specialist Idle F1-F2 baseline exists on
`codex/en-e03-boulder-hurler-idle`. Its focused gate preserves 8/8 approved
Hill Breaker Idle frames and validates 8/8 connected hard-alpha specialist
frames, four exact side mirrors, distinct Down/Up views, one-cell margins, 694
Complete B additions, 872 Form changes, zero baked projectile pixels, and zero
public families. Both labeled all-four-direction raw and Complete B + Form GIFs
now use the revised slower grounded shoulder/arm cycle and are frozen. The
designer reviewed both exact improved GIFs together and said `approved` on
2026-08-07; the bounded branch is committed and pushed under the publication
contract. Its full project gate also passes with the complete local Boss corpus
and all 232 public fixture sheets unchanged.

Before the next art gate, a separate local export lane generated all 67 public
Enemy families / 232 variants in three complete native treatment trees: Form +
Complete B, Form + Selective C, and Form + None. The package contains 696 PNGs,
698 files/ZIP entries, and a strict independent validator; its exact stored ZIP
is 2,440,823 bytes with SHA-256
`fd03895d8657b96293be14fbddbdb193ce62678c068023b58015410fc7f92b9c`.
The full project gate passes and no sprite source, public catalog, or fixture
changed. The designer accepted the package with `awesome lets do next in plan`
on 2026-08-07; the bounded tooling/docs checkpoint is committed and pushed at
`71fb59479626b757f112be3f9e56b92f24085208`. That continuation was bounded only
to Storm-Clan Jarl elite Idle F1-F2 across four directions. Its corrected
armored Giant/clan-band baseline now passes the focused and full gates with all
storm/lightning/impact effects external; after the side-pauldron repair, the
designer reviewed both exact all-four-direction raw and Complete B + Form GIFs
together and said `approved` on 2026-08-07. The bounded implementation is
committed and pushed at `d9c3dedf521a1a1a6ad0b82f458bf38cf8fa9533`. No
other variant or animation, registration, integration, effect, release, or
later gate was authorized at that checkpoint. The designer then said `lets do
next`; following EN-E03 family order, only Sun Lancer specialist Idle F1-F2 is
authorized. Its internal/non-public baseline preserves the approved Steppe
Hunter four-hoof chassis, adds sun-gold armor, red-gold saddle tack, and a bright
lance pennant, and keeps charge/trail/shock effects external. The designer
reviewed both required all-four-direction raw and Complete B + Form GIFs together
and said `approved` on 2026-08-07; focused and full gates pass. The bounded
implementation is committed and pushed at
`f5057497bc0b9ee62b79c5d8a94efecfd49c0ec9`. No other variant or animation,
registration, integration, effect, release, or later gate is authorized.
The designer then said `lets do next`; following the Centaur role order, only
Banner Khan elite Idle F1-F2 was authorized. Its internal/non-public baseline
preserves the approved four-hoof chassis and keeps
command-aura/banner-flare/hoof-shock effects external. The first blocky overlay
and its targeted repair are both rejected. The from-scratch candidate delegates
only the approved Steppe Hunter chassis and uses a visible face, compact conical
steel helm, segmented blue-steel lamellar armor, crimson command cloth, limited
saddle drape, and a separated tapered war standard. The latest repair changes
only the exact mirrored side faces, replacing the rejected straight-line profile
with a stepped forehead, protruding nose, visible eye, cheek, and tapered jaw;
the follow-up reduces the side mouth to one front pixel and separates it from
the shaded cheek. The later pale horizontal side-profile streak was the
six-pixel light fur collar; only that mirrored collar now uses a compact
stepped two-tone shape with a two-pixel pale highlight. The latest revision
adds a Banner Khan-only planted horse-torso shift in F2 while every leg and
hoof pixel remains byte-exact. Both required
all-four-direction raw and Complete B + Form r3 GIFs were reviewed together;
the designer said `approved` on 2026-08-07, and focused and full gates pass.
The bounded implementation is committed and pushed at
`55143049b4153e34fcdaad0ea434932ba0f2d0fd`. No other variant or animation,
registration, integration, effect, release, or later gate is authorized.
The designer then said `lets keep going`, satisfying the documented separate
continuation for one grouped Banner Khan Walk/Attack/Hurt/Cast/Death pass. The
isolated internal/non-public lane preserves approved Idle F1-F2 and all
approved Steppe motion-source frames byte-exact. Its 80-frame suite reuses the
alternating four-hoof gait, four-phase spear lunge, and two-phase full-hybrid
recoil; adds elite armor, compact collar, tack, connected saddle standard, and
horse-torso response; aliases Cast to Attack and Death to Hurt H1,H2,H2,H2; and
keeps command/banner/hoof effects external. Both exact labeled four-direction
raw and Complete B + Form grouped GIFs were reviewed together; the designer
said `approved` on 2026-08-08, and both focused and full gates pass with all 232
public fixture sheets unchanged. The bounded implementation is committed and
pushed at `8e73cd038d50037a40cad27ee9f2e37b6e363b69`. Registration, integration,
other variants, effects, release, and later gates remain unauthorized.
The designer then said `cool lets do next`; following the EN-E03 family/role
order, only Reed Charmer specialist Idle F1-F2 was activated. Its isolated
internal/non-public candidate keeps the approved Briar Reveler horns, tail,
digitigrade legs, split-hoof contacts, and two-frame settle byte-exact while
replacing the crooked staff with a compact direction-aware panpipe, connected
playing hands, teal woven vest, and gold sash. Both exact labeled four-direction
raw and Complete B + Form GIFs are ready. The focused and full gates pass, with
all 232 public fixture sheets unchanged. Music
notes, pollen, charm rings, Wildwood Hornlord, later motion, registration,
integration, effects, release, and later gates remain unauthorized. The
designer reviewed both exact GIFs together and said `Approved` on 2026-08-08;
the bounded internal implementation is committed and pushed at
`070f85b20c4ea77a75e35eb6d9eefd697f4b0b47`.
The designer then authorized one safe larger slice with `Sure lets go for it one
complete motion suite we can try atleast`. Reed Charmer Walk/Attack/Hurt plus
exact Cast/Death aliases now form one internal/non-public 80-frame candidate.
Approved Idle and Briar sources remain exact, both paired suite GIFs are frozen,
and both focused and full gates pass with all 232 validated PNG sheets
unchanged. The designer reviewed both exact paired GIFs and said `Approved` on
2026-08-08; the bounded implementation is committed and pushed at
`f77c8a88b25cb59f5bdbe82708a620e5cae3fe9d`. That Reed approval did not itself
authorize Wildwood Hornlord, registration, integration, effects, release, or
later gates.
The designer then said `Awesome let's do next`, activating only Wildwood
Hornlord elite Idle F1-F2 across all four directions. Its internal/non-public
candidate retains the approved Satyr lower body and replaces the common staff
identity with an oversized branching antler crown, sculpted bark armor, moss
mantle, bracers, and amber torque. The paired GIFs are frozen and the focused
eight-frame gate passes. The full repository gate also passes with all 232
validated PNG sheets unchanged. The designer reviewed both exact paired GIFs
together and said `Approved lets do next` on 2026-08-08; the bounded internal
Idle implementation is committed and pushed at
`aa96e170c41cbcb49c7ac1bd979114b3b5bfa7e4`. The same message requests the next
isolated Wildwood art gate; effects, registration, integration, release, and
broader work remain unauthorized.
That continuation is now bounded to one complete Wildwood Hornlord suite:
approved Idle delegates byte-for-byte while Walk, Attack, Hurt, and exact
Cast/Death aliases span four directions in an internal/non-public 80-frame
candidate. Crown, armor, mantle, torso, tail, hocks, and hooves participate in
the motion; thorn aura, leaf swirl, and root burst remain external. Both paired
suite GIFs are frozen, focused validation passes, and the full repository gate
passes with all 232 validated PNG sheets unchanged. The designer reviewed both
exact paired GIFs and said `Approved` on 2026-08-08; the bounded implementation
is committed and pushed at `d9cb0faa3dff204106598876fe38db5f4ee3237a`.
Registration, integration, effects, release, and later work stay gated.
After that clean publication was reconciled, `Let's do next` activated EN-E04
Naga priority-first. The approved isolated lane is deliberately
small because it establishes new anatomy: Coilguard common Idle F1-F2 only,
across all four directions. Its custom cobra hood and continuous belly-plated
serpent coil replace the complete humanoid lower body; every lower-body row is
one connected run and no side pose fakes paired feet. F2 settles the upper body
and compresses the grounded coil. The exact paired raw and Complete B + Form
boards/GIFs are frozen, the focused eight-frame gate passes, both boards were
opened in Aseprite, and post-approval full validation passes in `241s` with all 232 public
PNG sheets unchanged. The designer reviewed both exact paired GIFs and said
`Approved` on 2026-08-08; Coilguard is committed and pushed at
`bd920c206d692bcc5e7b043614dcf6a03db2174c`. At that checkpoint no art gate was
active. The designer's later explicit request to check out the approved Naga
branch and continue activates only Coilguard complete motion on
`codex/en-e04-naga-motion`. Its 80-frame paired candidate preserves all eight
Idle pixels, adds four planted Walk and Attack phases plus two Hurt phases, and
uses exact Cast/Death aliases across four directions. Focused, cleaned v2 fast,
and full validation pass with all 232 public sheets unchanged; both frozen
boards were opened in Aseprite. The designer reviewed both exact paired GIFs and
said `approved` on 2026-08-08. The bounded Coilguard implementation is committed
and pushed at `f47e1691208236f5d245a1f3b9b15355ad479790`. After the clean handoff,
the designer said `lets do next`; following Naga role order, only Venom Oracle
specialist Idle F1-F2 is active on `codex/en-e04-venom-oracle-idle`. Its paired
eight-frame candidate is hash-frozen, technically validated, internal,
non-public, and visually approved after the designer reviewed both exact paired
GIFs and said `ye approved` on 2026-08-08. Bounded publication is complete at
`3365d9915ed0ac1e506470604ed1e83c84606181`. Both protected Coilguard
gates, the cleaned v2 fast gate, and the full repository gate pass with all 232
public sheets unchanged; both boards were opened in Aseprite and both GIF
phases were inspected. The designer then asked to try bigger slices, accepted
the proposed combined 88-frame Venom-motion plus Rajah-Idle boundary with `sure
lets do that`, and activated only
`codex/en-e04-venom-motion-rajah-idle`. The hash-frozen candidate preserves all
eight approved Venom Idle frames, completes the 80-frame specialist suite, and
adds eight Temple Rajah Idle frames. Focused, protected, fast, and full gates
pass with all 232 public sheets unchanged; both boards and all four phases were
inspected. The designer then located Temple Rajah in the bottom `R IDLE` row,
reviewed both exact labeled all-four-direction raw/no-outline and Complete B +
Form GIFs, and approved the pair on 2026-08-08 with `oh right sorry i had to
scroll down approved`. It remains internal and non-public; bounded publication
of the exact ten-file lane is complete at
`4fd887f0a174169d47f9f3bee3f98d92c2ffaf30`. Temple Rajah motion, Merfolk,
Birdfolk, registration, integration, effects, release, and later gates remain
gated.
The designer then requested another similar-sized slice. That authorization is
bounded to the 80-frame Temple Rajah complete-motion suite on
`codex/en-e04-rajah-motion`: eight approved Idle frames remain exact while
Walk, Attack, Hurt, exact Cast aliases, and exact Death aliases inherit the
approved planted Naga choreography. The candidate is hash-frozen, focused and
protected validated, fast/full-gate clean with all 232 public sheets unchanged,
internal, non-public, committed, and pushed. The designer approved the exact
paired raw plus Complete B + Form GIFs on 2026-08-08 and requested that future
slices use one complete enemy with all animations as the target size. Bounded
Rajah publication is complete at
`38b56f316a3fa12443b5b9fb003e74dc7e8059aa`; registration, integration,
effects, release, and broader multi-enemy work remain gated.
The authorized full-enemy target is now implemented as one isolated common
Merfolk Tideguard on `codex/en-e04-merfolk-tideguard`. Its complete 80-frame
Idle/Walk/Attack/Cast/Hurt/Death suite uses one fused scaled tail and one broad
connected fluke in every direction, keeps all water effects external, and
remains absent from public consumers. The exact paired raw plus Complete B +
Form boards/GIFs and 80-frame digest are hash-frozen; the focused gate, all five
protected EN-E04 gates, and fast/full repository gates pass with all 232 public
sheets unchanged. The designer reviewed the exact paired GIFs and said
`approved` on 2026-08-09. Gate `en-e04-merfolk-tideguard-full-v1` is now
visually approved, internal, and non-public. Bounded publication of the exact
ten-file lane is complete at `622b00f0c40eed552f61b30bd207b5ad8478836e`.
Later Merfolk roles, Birdfolk, registration, integration, effects, release,
and broader work remain gated.
The designer then said `lets do next`; that continuation activates exactly one
complete Merfolk specialist on `codex/en-e04-merfolk-reefcaller`. Reefcaller
delegates all 80 approved Tideguard motion frames, preserves tail rows 16-23,
and adds a connected coral crown, violet reef mantle, pearl sigil, gold clasps,
and luminous fin marks while keeping ritual/water effects external. Its
repaired side treatment retains both visible eye pixels in coral red across all
36 colored Left/Right frames (`72/72` eye pixels). Its exact raw plus Complete B
+ Form boards/GIFs and 80-frame digest are hash-frozen; the focused gate, all
six protected predecessors, and fast/full repository gates pass with all 232
public sheets unchanged. Gate
`en-e04-merfolk-reefcaller-full-v1` is visually `approved` after both visible
side-eye pixels were repaired to coral red, internal, and non-public. Bounded
publication of the exact ten-file lane is complete at
`b315a32aa48d8881efe23e9d5b8553e6c0fb6b79`. Merfolk elite, Birdfolk,
registration, integration, effects, release, and broader work remain gated.
The designer then said `lets do next`; that continuation activates exactly one
complete Merfolk elite on `codex/en-e04-merfolk-pearl-regent`. Pearl Regent
delegates all 80 approved Reefcaller motion frames, preserves tail rows 16-23,
and adds a connected pearl-and-gold diadem, broad shell pauldrons,
deep-crimson royal mantle, nacre breastplate, luminous regalia marks, and twin
coral-red side eyes while keeping royal tide effects external. Its exact raw
plus Complete B + Form boards/GIFs and 80-frame digest are hash-frozen; the
focused gate, all seven protected predecessors, and fast/full repository gates
pass with all 232 public sheets unchanged. Gate
`en-e04-merfolk-pearl-regent-full-v1` is visually `approved`, internal, and
non-public. The designer reviewed the exact hash-frozen raw plus Complete B +
Form pair with both visible side-eye pixels coral-red and said `approved` on
2026-08-09; bounded publication of the exact ten-file lane is complete at
`ef0ab54b73718b62f8db99f601020f7ef14090f8`. Birdfolk, additional Merfolk
variants, registration, integration, effects, release, and broader work remain
gated.
The designer then said `next`; that continuation activates exactly one complete
Birdfolk common on `codex/en-e04-birdfolk-aerie-scout`. Because the live plan
defines the upright-avian-person boundary without role names, the lane names
only Aerie Scout and leaves specialist/elite names open. The 80-frame candidate
owns a connected beaked crest, shoulder-rooted wing-arms, slate-and-cream
plumage, bronze/teal scout harness, digitigrade gold talons, and connected tail
fan while keeping all wind/feather/dust/gust/impact effects external. Its exact
raw plus Complete B + Form boards/GIFs and 80-frame digest are hash-frozen; the
focused gate and all eight protected predecessors pass. Gate
`en-e04-birdfolk-aerie-scout-full-v1` remains
visually `approved`, internal, non-public, committed, and pushed; fast/full
repository validation passes with all 232 public sheets unchanged. The designer
reviewed the exact pair and said `very good approved` on 2026-08-09. After the
requested Codex/MCP restart, both exact boards opened successfully in Aseprite
and the designer said `ok lets keep going`. Bounded publication of the exact
ten-file lane is complete at `a0910312e510ee57b603ee981a279c1f372d6fad`;
later Birdfolk roles, registration, integration, effects, release, and broader
work remain gated.
The designer then said `awesome lets keep going`; that continuation activates
exactly one complete Birdfolk specialist on
`codex/en-e04-birdfolk-gale-augur`. Because the role was not pre-named, the lane
names only Gale Augur and leaves the elite open. The 80-frame candidate
preserves every approved Aerie alpha footprint and motion phase beneath indigo
plumage, a connected storm cowl/mantle, silver circlet and forewing bands, cyan
sky rune, ice-blue eyes, and gold beak/talons while keeping all wind/omen effects
external. Its exact raw plus Complete B + Form boards/GIFs and 80-frame digest
are hash-frozen; the focused gate passes. Gate
`en-e04-birdfolk-gale-augur-full-v1` is visually `approved`, internal,
non-public, committed, and pushed;
all nine protected predecessor gates pass, the final post-reconciliation fast
gate passes in `49.3s`, and full validation passes in `98.0s` with all 232
public PNG sheets unchanged.
The designer reviewed the exact pair and said `awesome looks good approved` on
2026-08-09. Bounded publication of the exact ten-file lane is complete at
`ad57f25d47415625540ea36ff16d2a884a421576`; Birdfolk elite, registration,
integration, effects, release, and broader work remain gated.
The designer then said `lets do next`; that continuation activates exactly one
complete Birdfolk elite on `codex/en-e04-birdfolk-stormcrown-exarch`. Because
the role was not pre-named, the lane names only Stormcrown Exarch and does not
open additional variants. The 80-frame candidate preserves every approved Gale
alpha footprint and motion phase beneath iron-slate plumage, a crimson royal
mantle, connected gold storm crown/brow guard and forewing armor, cyan lightning
sigil, white-blue eyes, and a burnished beak/talons while keeping all lightning
and thunder effects external. Its exact raw plus Complete B + Form boards/GIFs
and 80-frame digest are hash-frozen; the focused gate passes. Gate
`en-e04-birdfolk-stormcrown-exarch-full-v1` is `approved`, internal,
non-public, committed, and pushed;
all ten protected predecessor gates pass, the fast gate passes in `50.4s`, and
full validation passes in `103.0s` with all 232 public PNG sheets unchanged.
The designer reviewed the exact pair and said `sure lets do 123` on 2026-08-09.
Bounded Stormcrown publication is complete at `da8c089`; separate complete
EN-E04 registration and assembler consumer-integration checkpoints are
authorized next in that order. Additional variants, effects, release, and
broader work remain gated.
The registration checkpoint on `codex/en-e04-registration` now composes all
nine approved EN-E04 enemies as Naga, Merfolk, and Birdfolk common/specialist/
elite families. All 720 candidate/registered frames match at aggregate digest
`137d044a55dd41d612a8b41958029e41ef39fb75ccf58de9b46d6c4328c91459`.
The bounded registration checkpoint is published at `6f228fb`.
At the EN-E04 checkpoint the stable registry reached 13 families / 39 variants.
The separately authorized assembler consumer-integration checkpoint is
implemented on `codex/en-e04-assembler-integration`: the consumer registry
reused that exact EN-E04 object and the generic public catalog reached 70
families / 241 variants.
All 720 EN-E04 public frames, nine full sheets, scoped exports, thumbnails,
randomization, persistence, Complete Kits/Packs, Wildshot intake, outline modes,
and Form shading pass without family-specific consumer branches. The renderer
bridge now forwards deliberate regional clears while still suppressing a
delegated full-frame reset, preserving Merfolk and Temple Rajah composition.
The approved aggregate digest remains
`137d044a55dd41d612a8b41958029e41ef39fb75ccf58de9b46d6c4328c91459`;
the frozen 232-sheet legacy fixture pack remains untouched. The bounded
implementation is published at `cedc774`, and current-state documentation is
reconciled to that checkpoint.
The next authorized one-sprite cadence starts EN-E05 with one isolated full
`zombie/ghoul` replacement candidate on `codex/en-e05-ghoul-upgrade`. Its
80-frame weaponless hunched-corpse suite, direct legacy comparison, raw board,
Complete B + Form board, and paired labeled GIFs are hash-frozen. The focused
gate passes all frames, mirror/alias contracts, connected/bounded anatomy,
identity colors, treatment metrics, Zombie sibling locks, and the unchanged
legacy fixture. Protected, fast, and full repository validation also pass.
The designer reviewed the exact before/after plus labeled all-four-direction
raw/no-outline and Complete B + Form evidence together and said `approved` on
2026-08-09. Bounded publication of the isolated candidate is complete at
`88d32e9`. Public routing, fixture
replacement, and effects remain separate gates. The designer then said
`lets do next`, activating exactly one common Mummy Tomb Walker on
`codex/en-e05-mummy`. Its 80-frame coffin-stiff wrapped suite, approved-Ghoul
comparison, raw board, Complete B + Form board, paired GIFs, and candidate
digest are hash-frozen. The focused gate passes all frames, distinct
silhouettes, connected/bounded anatomy, directional eyes, mirrors, aliases,
identity colors, treatment metrics, approved-Ghoul preservation, public
catalog locks, and the unchanged legacy fixture. It remains internal,
non-public, and fixture-free. The designer replied `lets do nextg`
after the exact review; in direct context this approves bounded Mummy
publication and authorizes one separate Vampire candidate afterward.
Registration, fixtures, and effects remain separate gates. The
approved Ghoul and EN-E04 public gates, fast validation, and full validation
pass with the 70/241 public catalog and all 232 fixtures unchanged. The exact
Mummy implementation is published at `85f1ed7`.
The reconciled Mummy handoff is `3387bf2`. Its approval response also authorizes
one separate common Vampire Night Noble on `codex/en-e05-vampire`. The
80-frame high-collared night-undead suite, approved-Mummy comparison, raw board,
Complete B + Form board, paired GIFs, and candidate digest are hash-frozen. The
focused gate passes all frames, distinct silhouettes, connected/bounded cape
anatomy, directional ember eyes, mirrors, aliases, identity colors, treatment
metrics, approved-Mummy preservation, public catalog locks, and the unchanged
legacy fixture. It remains internal, non-public, and fixture-free.
After the exact paired review, the designer replied `approved` on 2026-08-09,
authorizing only bounded publication of the frozen lane. Registration,
fixtures, Revenant, and effects require later explicit gates. The approved
Mummy, Ghoul, and EN-E04 public gates, fast validation, and full validation pass
with the 70/241 public catalog and all 232 fixtures unchanged. The exact
Vampire implementation is published at `6a7cce2`.
The reconciled Vampire handoff is `16f5876`. The designer then said `awesome
lets do next`, authorizing one separate common Revenant Grave Oathkeeper on
`codex/en-e05-revenant`. Its 80-frame broken-knight suite, approved-Vampire
comparison, raw board, Complete B + Form board, paired GIFs, and candidate
digest are hash-frozen. The focused gate passes all frames, distinct
silhouettes, connected/bounded armor and greatblade anatomy, directional cyan
eyes, mirrors, aliases, identity colors, treatment metrics, approved-Vampire
preservation, public catalog locks, and the unchanged legacy fixture. It
remains internal, non-public, and fixture-free. After the exact paired review,
the designer replied `awesome very good approved` on 2026-08-09, authorizing
only bounded publication of the frozen lane. Registration, fixtures, Lich, and
effects require later explicit gates. The approved Vampire, Mummy, Ghoul, and
EN-E04 public gates, fast validation, and full validation pass with the 70/241
public catalog and all 232 fixtures unchanged. The exact Revenant implementation
is published at `7434578`.
The reconciled Revenant handoff is `97db37e`. The designer then said `cool
lets do next`, authorizing one separate elite Lich Soul Regent on
`codex/en-e05-lich`. Its 80-frame crowned-reliquary suite,
approved-Revenant comparison, raw board, Complete B + Form board, paired GIFs,
and candidate digest are hash-frozen. The focused gate passes all frames,
distinct silhouettes, connected/bounded skull, robes, and ritual-staff
anatomy, directional mint eyes, mirrors, aliases, identity colors, treatment
metrics, approved-Revenant preservation, public catalog locks, and the
unchanged legacy fixture. The approved Revenant, Vampire, Mummy, Ghoul, and
EN-E04 public gates, fast validation, and full validation pass with the 70/241
public catalog and all 232 fixtures unchanged. After the repeated square
lower-robe panels were replaced with tapered folds and the exact regenerated
review was presented, the designer replied `approved` on 2026-08-09,
authorizing only bounded publication. The Lich remains internal, non-public,
and fixture-free. Registration, fixtures, effects, EN-E05 registration, and
Wave 2 required later explicit gates at that Lich checkpoint. The exact Lich implementation is
published at `4cebc7b`.
The clean reconciled Lich handoff is `c0e438b`. The designer then said `lets do
next`, which authorized the separate stable-only EN-E05 registration dependency
without opening consumer integration or Wave 2. Gate
`en-e05-five-undead-registration-v1` on `codex/en-e05-registration` registers
exact approved Mummy, Vampire, Revenant, and Lich families plus a separate
internal Ghoul replacement record targeting legacy `zombie/ghoul`. Five
complete sheets, 400 candidate/registered parity frames, and 320 composed
stable-registry parity frames pass at aggregate digest
`732c6097b237131e85bdf435112c2bed7ec1f8bf8317dee4e42605f0c1730d32`.
Stable expansion state advances to 17 families / 43 variants while assembler
consumers remain on the exact EN-E04 13/39 boundary and the public catalog
remains 70/241. Public Ghoul and its frozen fixture remain exact; all 232 PNG
fixtures are untouched. Fast validation passes in `51.6s` and full validation
passes in `101.2s`. The bounded implementation is published at `7d273ef`.
That registration checkpoint did not authorize consumer exposure, public Ghoul
replacement, fixture work, effects, release, or Wave 2.
After its clean handoff `59a6941`, the designer said `cool lets do next`, which
authorizes only the next dependency: generic assembler integration for the four
registered new families. Gate `en-e05-assembler-consumers-v1` on
`codex/en-e05-assembler-integration` exposes exact Mummy Tomb Walker, Vampire
Night Noble, Revenant Grave Oathkeeper, and Lich Soul Regent without
family-specific consumer branches or new sprite pixels. Stable and consumer
expansion registries are identical at 17 families / 43 variants; the public
catalog is 74/245. All 320 public frames match at consumer digest
`947cec4df921761cd5eba378991d7a35b3d773d7e5c0e7c80526ecc6a846a46f`;
Complete B adds 29,795 pixels and Form changes 27,338 source pixels. Complete
Kit is 74 families / 245 enemy sheets / 2,182 PNGs, and all four Wildshot specs
are accepted. Public Ghoul and its frozen fixture remain exact, and all 232 PNG
fixtures stay untouched. Fast validation passes in `52.7s`; full validation
passes in `103.1s`. The bounded implementation is published at `773cfad`.
At that consumer checkpoint, public Ghoul replacement, fixture generation,
regeneration or acceptance, effects, release, EN-E03 adoption, and Wave 2 still
required separate explicit authorization. Wave 2 was later opened through the
bounded EN-E06 Fairy lane. Bramblewing Scout is approved, committed, pushed at
`cc92ca9`, internal, and non-public. The current separate continuation adds
only approved specialist Thistle Hexer: 80/80 connected, bounded,
ground-clear frames; 80/80 pixel and silhouette distinctions from Bramblewing;
exact mirrors and aliases; binary-alpha folded-wing negative space; Complete
B/Form support; zero public Fairy families; candidate digest
`675b5a8957efdc81c07ae53c4b013ad8229847fc84d9b1c0c8da4ad09e6a4534`.
Protected EN-E05 consumers pass at 74/245 and 320/320 with all 232 fixtures
unchanged; approval-state fast/full validation passes in `62.4s` / `108.6s`.
Exact visual approval is recorded as `awesome! approved`; bounded publication
is complete at `3dc68cb`, and a separate continuation is required for
Petalcrown Duelist or Hag.
The current branch history
also contains the `established-boss-pack-13-v1` clean-tree/pushed-HEAD publish
gate, but its frozen roster currently lacks four direction and seven animation
catalog entries, so the command is not release-ready. Existing fixtures remain
unchanged, Effects start Off, and the effect-after-character equipment
occlusion issue remains on ice. A current local standalone executable was built
and startup/render-smoked from approved checkpoint `4bea410` on 2026-08-07, but
no NSIS installer or approved Windows release candidate exists. See
`HANDOFF.md`.

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
  and review sequence in `ENEMY_EXPANSION_PLAN.md`. EN-E01, EN-E02, EN-E04,
  and the four new EN-E05 families are registered and consumer-integrated at
  17 expansion families / 43 variants and 74/245 public. The separate EN-E05
  Ghoul upgrade and all EN-E03 evidence remain internal. Wave 2 contains the
  approved complete Bramblewing Scout plus the approved complete Thistle Hexer
  suite published at `3dc68cb`. Petalcrown Duelist, later EN-E06
  families, EN-E07,
  public Ghoul replacement, fixture work, EN-E03 adoption, effects, and release
  remain separately gated.
- Additional production animations only after the 20-column contract has a
  versioning plan; review-only boss pilots remain isolated

Content is added through the stable definition and validation workflow established in Phases 2 and 4.

## Phase 6 - Windows release

Progress: active. The release lane has native Save dialogs for every PNG, JSON,
and ZIP export, final product metadata and icons, a current-user NSIS target
with an embedded WebView2 bootstrapper, a release-specific validator, and a
versioned GitHub draft-release workflow. Historical installer and standalone
smoke tests passed their earlier checkpoints. The latest verified local standalone
proof was built from exact approved checkpoint `4bea410` on 2026-08-07 and
passed a direct startup/render smoke, including a responsive assembler UI with
Effects Off visible. It remains unsigned, has not completed the full packaged-
smoke checklist, and is not an installer. No NSIS setup executable currently
exists, so there is still no approved release candidate. Full NSIS install/
uninstall testing, code signing, and automatic updates remain deferred until a
stable distribution identity and a deliberate release checkpoint exist.

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
