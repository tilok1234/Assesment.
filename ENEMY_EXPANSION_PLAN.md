# Enemy Expansion Plan

- Current integration status (2026-08-09): the approved assembler backlog gate
  on `codex/approved-enemy-assembler-integration` is committed and pushed at
  `90ac018923fbaa9906cd47cdc9ef22f0db77336a`. It composes 23 expansion
  families / 57 variants and 80 public families / 259 variants. It registers
  all eight completed EN-E06 suites, adopts only the six completed full EN-E03
  suites, and maps public `zombie/ghoul` to the approved Ghoul Upgrade without
  adding a duplicate family. The focused gate exhausts 1,200 source-parity
  frames and 1,200 None/Complete B/Form presentation triplets at digest
  `74953d1b8531be86bf3f551b15fc70aa4ff142d954763ad4183eb36e06fd6497`.
  Boulder Hurler, Storm-Clan Jarl, Sun Lancer, Heartwood Warden, Redcap, Nymph,
  EN-E07, effects, fixture regeneration, and release remain outside that
  published integration. All 232 legacy fixtures remain unchanged.

- Current acceptance candidate (2026-08-11): private common Animated Armor
  Hollow Sentry on `codex/en-e08-animated-armor-architecture` is frozen at
  digest `f6e7cbf25692b08e2e4dfccef149662c18d195e4cf615185f7a38e4874e2b9ac`
  from clean published Blackwake reconciliation
  `defc9b8cab1226610da6cf2b17951c8b5815499e`. The explicit architecture choice
  selects `baked-single-actor`: every helmet, armor, gauntlet, binding, greave,
  and sabaton pixel is owned by one 24x24 frame and all 80 frames report zero
  child assets. Haunted Armor and Animated Armor remain one `animated-armor`
  family; Hollow Sentry is its haunted-default common role, with constructed,
  specialist, and elite identities deferred. The 219-306-pixel suite passes
  80/80 connected, bounded, grounded, split-sabaton, broad-plate, topology,
  hard-alpha, alias, mirror, and pixel/alpha distinctions from Fallen Knight
  Shieldbearer, Grave Oathkeeper Revenant, and Gloam Walker. It also passes
  72/72 colored frames, 8/8 exact white flashes, and 54/54 readable visor
  views. `check:fast` passes in 62.3s and full `check` in 121.5s before
  approval, then in 61.5s and 107.7s against approved-local metadata, with
  public 80/259 and all 232 fixtures exact. The exact three frozen PNGs are open in
  responsive Aseprite 1.3.17.2 process 6832. Status is
  `approved`: the designer replied `apprvoed`, approving only the exact digest
  above. Implementation `914aa700b82469dbb22ca1600f1bc7ad6dbecff7` and
  approval record `6a577566766afc66aa01cdf1c7ebd1430aad425d` plus initial handoff
  `e12ff211dda002ac1c089eaedc0ff369d1e432e0` are remote verified. Status is
  `approved` and `published`; this reconciliation completes the bounded tuple.
  Registration, fixtures, child/state assets, effects,
  later roles/families, release, accepted drift, a PR, and another art gate
  remain closed.

- Earlier approved publication checkpoint (2026-08-11): private specialist Kelpie
  Drownbridle Stalker on `codex/en-e07-kelpie-drownbridle-stalker` is frozen at
  digest `d8cbbfef97b63590e6a63335a6b241e742d87f4df5e7443933c5484ef849224b`
  from clean published Miremane Courser reconciliation
  `f143de1fadf3b812f3968d930acf6451e926388d`. The 203-274-pixel suite passes
  80/80 connected, bounded, grounded, four-separated-hoof, specialist-span,
  hard-alpha, alias, mirror, and pixel/alpha distinctions from approved
  Miremane Courser and Steppe Hunter plus public Dire Wolf. Its independently
  authored forward-heavy form uses a high arched neck, hooked readable muzzle,
  connected block crest and ochre reed bridle, deep wedge chest, short barrel,
  four separated fetlocked legs over dark grounded hooves, and a connected
  ropeweed tail. The packet passes 72/72 colored frames, 8/8 exact white
  flashes, 54/54 expected eye-bearing views, and 54/54 readable muzzle views;
  Complete B adds 9,789 pixels and Form changes 6,465. The focused gate passes
  in 0.7s, `check:fast` in 53.2s, and full `check` in 104.7s before approval
  and 110.3s against approval-local metadata, with public 80/259 and all 232
  fixtures exact. The exact raw, Complete
  B + Form, and comparison PNGs are open together in Aseprite at IDs 19, 23,
  and 27. The designer replied `approved lets do next`; approval applies only
  to the frozen digest above. Exact implementation
  `c34b3b9564df683900ff3846d692970faca53ff5` and approval record
  `b5a9011b37dc9a3e0db7c371fa168e589665a127` are published and
  remote-verified. Initial handoff
  `1ba57fefe52398c2c007c01adfde6384c327e6f8` is published and remote-verified.
  This reconciliation completes the bounded tuple. The same reply opens only
  one private elite Kelpie candidate; registration, fixtures, runtime copying,
  effects, release, and EN-E08 remain closed.

- Approved preceding publication checkpoint (2026-08-11): private common Kelpie Miremane
  Courser on `codex/en-e07-kelpie-miremane-courser` is frozen at digest
  `6efd596731a468be7647ee37f048046072bad289f209926e4db862cb63b01f32`
  from clean published Manyfold Usurper reconciliation
  `6ddef83e03e983672bee39b6b484dd1c1bfcba01`. The 166-221-pixel suite passes
  80/80 connected, bounded, grounded, four-separated-hoof, long-equine-span,
  hard-alpha, alias, mirror, and pixel/alpha distinctions from approved Steppe
  Hunter plus public Dire Wolf and Marsh Crocodile. Its independently authored
  low lean waterlogged form uses a bowed wet neck, long readable muzzle,
  connected dripping mane, long ribbed barrel, four separated legs and dark
  grounded hooves, and a connected drowned-weed tail. The packet passes 72/72
  colored frames, 8/8 exact white flashes, 54/54 expected eye-bearing views,
  and 54/54 readable muzzle views; Complete B adds 10,468 pixels and Form
  changes 4,904. `check:fast` passes in 66.0s and full `check` in 110.4s before
  approval, 120.2s immediately before the implementation commit, 102.4s against
  approval-local metadata, and 110.8s against the final published tuple, with
  public 80/259 and all 232 fixtures exact. The exact raw, Complete B + Form,
  and comparison PNGs are open together in Aseprite. The front/rear face,
  chest/rump, tail color, moving hoof separation, and two detached walk legs
  were corrected before freeze. The designer replied `approved` on 2026-08-11;
  approval applies only to the frozen digest above. Exact implementation
  `74463a2b1944b7d3a6d412923c205a0c9cc648f1` and approval record
  `8fb53e961247da875814593feb132182648f9e48` plus initial handoff
  `ae532a17e92c3a7b0b99ccd3c938f8174f102dd6` are published and remote-verified.
  This reconciliation completes the bounded tuple. The candidate
  remains unregistered, fixture-free, and non-public. The designer's later
  `lets do next` opened only the private Drownbridle Stalker checkpoint above;
  runtime copying, effects, release, and EN-E08 remain closed.

- Approved preceding publication checkpoint (2026-08-11): private elite Changeling Manyfold
  Usurper on `codex/en-e07-changeling-manyfold-usurper` is frozen at digest
  `f3ed9a91cb01746fc7467e59c92335778a85b476495f5772ac81cf2a6cbda246`
  from clean published Mirrorfold Harrier reconciliation
  `fdbb4cf04048a819b9cbe1655146842835b86a73`. The 276-330-pixel suite passes
  80/80 connected, bounded, grounded, broad-three-tier, wide-pillar,
  hard-alpha, alias, mirror, and pixel/alpha distinctions from approved
  Mirrorfold Harrier, Veilskin Foundling, and Grand Pretender. Its independently
  authored broad tall form uses one connected three-tier fan mantle, deep side
  drapes, one centered readable face, ink-teal/wine/old-gold folds, paired heavy
  ordinary forearms, a pinched middle, wide separated pillar legs, and broad
  slab feet. The packet passes 72/72 colored frames, 8/8 exact white flashes,
  54/54 expected eye-bearing views, and 54/54 readable face-feature views;
  Complete B adds 8,378 pixels and Form changes 11,849. `check:fast` passes in
  48.5s and full `check` in 93.1s before approval, 104.1s immediately before
  implementation publication, 112.9s against approval-local metadata, and
  113.4s against the final published tuple, with public 80/259 and all 232
  fixtures exact. The exact raw, Complete B + Form,
  and comparison PNGs are open together in responsive Aseprite 1.3.17.2
  process 39276. The designer replied `approved lets do next` on 2026-08-11;
  exact implementation `38f9d7f9b3ac5a34bdff91be1fd878e158d26bfe` and approval record
  `306aa3ac1ba658cb48e223651410a7df494e7b9e` plus initial handoff
  `0d2f5ce3665f848633b4f7a1596356659d720afe` are published and remote-verified.
  This reconciliation completes the bounded tuple; the same reply opens only
  one private common Kelpie candidate. Manyfold remains unregistered and fixture-free.
  Runtime actor copying, effects, later Kelpie roles, release, and EN-E08 remain
  closed.

- Approved preceding checkpoint (2026-08-11): private specialist Changeling
  Mirrorfold Harrier on `codex/en-e07-changeling-mirrorfold-harrier` is frozen
  at digest
  `be3e4d03263929ce9677fcf15b742cde769271d037160cd6461b45ea389660f2`
  from clean published Veilskin Foundling reconciliation
  `5eabfecc08f992db675b64ea3317eb59f67d737c`. The 202-248-pixel suite passes
  80/80 connected, one-cell-bounded, grounded, stepped-diamond, narrow-leg,
  hard-alpha, alias, mirror, and pixel/alpha distinctions from approved
  Veilskin Foundling, Pale Echo, and Falseface Adept. Its independently authored
  compact form uses one connected stepped diamond mantle, angular shoulders,
  one centered readable face, plum-copper pinched folds, paired long ordinary
  forearms, bent separated legs, and narrow wedge feet. The packet passes 72/72
  colored frames, 8/8 exact white flashes, 54/54 expected eye-bearing views,
  and 54/54 readable face-feature views, preserves all three comparisons exact,
  and leaves public 80/259 plus fixtures unchanged. `check:fast` passes in 56.7s
  and full `check` in 106.1s before approval, 138.6s against approval-local
  metadata, and 95.2s against the final published tuple, with all 232 fixtures exact. The exact raw,
  Complete B + Form, and comparison PNGs are open together in responsive
  Aseprite 1.3.17.2 process 40804. The designer replied `approved lets do next`
  on 2026-08-11; exact implementation
  `ab72a9c0600f016439a5351f363b3b34348dc4b1` and approval record
  `e976ca5fc5c249af4e727fb3bff7d58fd541a932` plus initial handoff
  `4ed366a39165660096306cbb327315b211639e3d` are published and remote-verified.
  This reconciliation completes the bounded tuple. It remains unregistered
  and fixture-free. The same reply opened only the private Manyfold Usurper
  checkpoint above. Runtime actor copying, effects,
  Kelpie, release, and EN-E08 remain closed.

- Approved preceding checkpoint (2026-08-11): private common Changeling Veilskin
  Foundling on `codex/en-e07-changeling-veilskin-foundling` is frozen at digest
  `e472931d214d369331d6cb750619471d9234ab11561233e700facab6ea4f0126`
  from clean published Mirecrown Beacon reconciliation
  `4ee32622ec2984ac805ac345b854f23584fda3c3`. The 201-267-pixel suite passes
  80/80 connected, one-cell-bounded, grounded, hard-alpha, alias, mirror, and
  pixel/alpha distinctions from approved Pale Echo, public Goblin Scout, and
  public Imp Sprite. Its small authored fey default uses one connected
  pear-shaped living veil, one centered face with connected dark eye sockets,
  retained amber glints, and a tiny mouth mark, a narrow ochre-coral folded
  torso, paired short ordinary arms, bowed separated legs, and broad splayed
  feet. The first digest
  `1a852ef46dcaa7fee5779379cb9eda9acd79e67cd53dd469ff9cfae9dc18844d`
  is superseded after the designer said `could need a more readable face`;
  silhouette, body, and motion remain unchanged. The packet passes 72/72
  colored frames, 8/8 exact white flashes, 54/54 expected eye-bearing views,
  and 54/54 readable face-feature views, preserves approved Mirecrown and Pale
  Echo exact, and leaves public 80/259 plus fixtures unchanged. The revised
  ten-gate EN-E07 matrix passes in 6.3s, `check:fast` in 58.3s, and full
  `check` in 107.1s before approval and 109.0s against approval-local metadata,
  then 119.8s against the final published tuple, with all 232 fixtures exact.
  The designer replied
  `approved` on 2026-08-11; exact implementation
  `2a295aa70c8a6680ffb85881efa4ccd927a50979` and approval record
  `7d064226d9a0096f8b276f5b0bd30be93435962b`, plus initial published handoff
  `0dcd15249d97b3e24bf174b014885fa2c8b6177c`, form the completed remote-verified
  publication tuple. It remains unregistered and fixture-free. Runtime actor
  copying, effects,
  specialist/elite Changeling, Kelpie, release, and EN-E08 remain closed;
  the designer's later `lets do next` opened only the specialist Mirrorfold
  Harrier checkpoint above.

- Approved preceding checkpoint (2026-08-11): private elite Will-o-Wisp
  Mirecrown Beacon on `codex/en-e07-will-o-wisp-mirecrown-beacon` is frozen at
  digest
  `5fbd53af9fb461717a8bd90698a0b2f7f81f8fdd55fee42fbca5254738654d81`
  from clean published Fenbell Shepherd reconciliation
  `8b0754c9594ad91fe378ba11d4f43d7b2a558145`. The 243-254-pixel suite passes
  80/80 connected, one-cell-bounded, genuinely hovering, hard-alpha, alias,
  mirror, and pixel/alpha distinctions from approved Fenbell Shepherd,
  approved Lantern Mote, public Spectral Ghost, and public Flame Elemental.
  Its broad sovereign-beacon form preserves one connected three-prong
  crown-wick, a wide double-tiered ribbed cage, one central eye, paired
  connected buttresses, a deep living core, broad basin, and four connected
  lower flame tines. The initial A3/C3 detached-beam read was repaired before
  freeze into an enclosed cage/core expansion. All raw/Complete B + Form phase
  boards and the exact five-artifact packet have been inspected at original
  detail; one post-freeze package build reproduces every hash. The protected
  26-command matrix passes in 19.0s, the fast suite in 60.4s, and the full
  suite in 111.2s with the approved integration digest and all 232 fixtures
  exact. The three frozen PNG hashes were reverified and those exact files were
  opened together in responsive Aseprite 1.3.17.2; its live command line names
  all three paths. The designer replied `approved lets do next` on 2026-08-11;
  implementation `72925cd8d8ea1a3ae47a45601607a1a5853decb3` and approval
  record `6448bb49e16679b94fcc402166b089b6b6ca7174` plus initial handoff
  `72b529bcdd19bd0d3018f2b03ceabcb29a809015` are published and remote
  verified, and full validation passes in 110.9s against the published tuple.
  Mirecrown Beacon remains private, unregistered, fixture-free, and non-public.
  The same reply opens only one private common Changeling candidate from this
  clean publication reconciliation. Registration, fixtures, effects, later
  roles or families, Kelpie, release, and EN-E08 remain closed.

- Historical plan chronology: EN-F00 checkpoint `73ad73a` is accepted; EN-E01 and
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
  third exact internal two-frame Idle baseline. The designer then again said
  `lets do next`, authorizing only Hill Breaker common Walk W1-W4 across all
  four directions. Preservation checkpoint `8ea019b` commits and pushes those
  exact candidate pixels. The designer approved the exact raw and Complete B +
  Form boards on 2026-08-06 with `yes sir seems fine to me approved`, then
  authorized only Steppe Hunter common Walk W1-W4 across all four directions.
  That isolated implementation, focused checker, deterministic review generator,
  and frozen hashes now exist and pass. The designer reviewed the exact raw and
  Complete B + Form animations and approved them on 2026-08-06 with `approved`.
  The designer then said `awesome lets do next`, authorizing only Briar Reveler
  common Walk W1-W4 across the same four directions. That isolated candidate,
  focused checker, deterministic boards, and frozen hashes now exist and pass;
  after the inherited rear side-eye pixel was corrected, the designer approved
  the exact corrected animations on 2026-08-06 with `greeat lets move on`.
  The resulting bounded Hill Breaker common Attack A1-A4 implementation was
  approved on the exact labeled four-direction raw and Complete B + Form
  animations on 2026-08-07 with `Very good approved`. The designer then said
   `Cool let's keep going`, authorizing only Steppe Hunter common Attack A1-A4,
   and approved both exact labeled all-four-direction raw/no-outline and
   Complete B + Form GIFs together on 2026-08-07 with `Approved`. After that
   bounded lane was committed and pushed, the designer said `lets keep going`,
   authorizing only Briar Reveler common Attack A1-A4 across all four directions.
   That isolated review candidate, focused checker, deterministic boards, and
   dual labeled GIFs now exist and pass. The designer reviewed both exact
   labeled all-four-direction raw and Complete B + Form animations together and
   said `very good! approved` on 2026-08-07. The exact bounded lane is approved,
   internal, non-public, committed, and pushed. The designer then agreed to
   continue the 80 plan and accepted the explicitly proposed Hill Breaker Hurt
   H1-H2 scope with `lets go for it`. That isolated eight-frame candidate now
   passes its focused technical gate and has deterministic labeled
   all-four-direction raw and Complete B + Form review GIFs. The designer
   reviewed both exact GIFs together and said `approved` on 2026-08-07. The
   bounded lane is approved, internal, non-public, committed, and pushed. The
   designer then said `nice lets do nexrt`. Codex explicitly bounded only
   Steppe Hunter Hurt H1-H2 across Down, Left, Right, and Up while preserving
   every approved Idle, Walk, and Attack pixel. That isolated candidate passes
   its eight-frame focused gate and has both required labeled
   all-four-direction raw and Complete B + Form GIFs ready together. It remains
   internal and non-public. The designer reviewed both exact GIFs together and
   said `approved` on 2026-08-07; the bounded lane is approved, committed, and
   pushed under the approval-publication contract.
- Recorded: 2026-08-04
- Post-cleanup reconciliation: 2026-08-07
- Assessment baseline: clean synchronized `main` at `f5476a2`
- Lane state authority: `CLAUDE.md`, the v2 workflow note in `HANDOFF.md`, and
  this document's latest EN-E04 gate record.
- Preserved approval source: `codex/en-e04-naga-idle` at `26151e1`, whose
  approved Naga implementation checkpoint is `bd920c2`; later work proceeds on
  a separate continuation branch without rewriting those pixels.
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
baselines. Hill Breaker common Walk W1-W4 was then implemented, focused-gate
validated, and visually approved on its exact boards on 2026-08-06. The only
later authorization was the bounded Steppe Hunter common Walk W1-W4 lane. Its
focused automated gate passes, and its exact raw and Complete B + Form
animations were visually approved on 2026-08-06. The designer then authorized
only Briar Reveler common Walk W1-W4 with `awesome lets do next`. That candidate
is technically validated and internal. The designer approved the corrected raw
and Complete B + Form animations on 2026-08-06 with `greeat lets move on`,
authorizing only Hill Breaker common Attack A1-A4 across four directions while
preserving its approved Idle and Walk frames byte-for-byte. That isolated
candidate, focused checker, deterministic boards, and frozen hashes now exist
and pass. The designer approved the exact labeled four-direction raw and
Complete B + Form animations on 2026-08-07 with `Very good approved`, then said
`Cool let's keep going`, authorizing only Steppe Hunter common Attack A1-A4.
That isolated candidate and its mandatory dual four-direction review evidence
pass technically. The designer reviewed both exact labeled all-four-direction
raw/no-outline and Complete B + Form GIFs together and said `Approved` on
2026-08-07. After that bounded lane was committed and pushed, `lets keep going`
authorized only Briar Reveler common Attack A1-A4. Its focused gate and exact
dual labeled animations pass, and the designer reviewed both together and said
`very good! approved` on 2026-08-07. The designer then accepted the explicitly
bounded Hill Breaker Hurt H1-H2 gate with `lets go for it`, reviewed both exact
labeled all-four-direction raw and Complete B + Form GIFs together, and said
`approved` on 2026-08-07. That internal/non-public lane is committed and pushed.
The designer then said `nice lets do nexrt`; Codex explicitly bounded Steppe
Hunter Hurt H1-H2 across all four directions. That technical candidate now
passes, and the designer reviewed both required GIFs together and said
`approved` on 2026-08-07. Briar Reveler Hurt and the common Cast/Death aliases
were subsequently approved and published. Boulder Hurler specialist Idle F1-F2
was then approved and published. The separate 67-family / 232-variant public-
Enemy three-treatment export was delivered and approved when the designer said
`awesome lets do next in plan`. Storm-Clan Jarl elite Idle F1-F2 was then
approved and published after its side-pauldron repair. Sun Lancer specialist
Idle, Banner Khan elite Idle, and Banner Khan grouped motion were subsequently
approved and published. The designer then said `cool lets do next`; following
the documented EN-E03 family and role order, only Reed Charmer specialist Idle
F1-F2 was authorized. The designer reviewed both exact paired GIFs and said
`Approved` on 2026-08-08; bounded publication of that internal lane is now
complete at `070f85b20c4ea77a75e35eb6d9eefd697f4b0b47`. The designer then
authorized the discussed larger slice with `Sure lets go for it one complete
motion suite we can try atleast`. The designer approved both exact paired Reed
Charmer complete-motion GIFs on 2026-08-08. Bounded publication is complete at
`f77c8a88b25cb59f5bdbe82708a620e5cae3fe9d`. Wildwood Hornlord elite Idle and
its grouped complete-motion suite were then approved and published, ending
EN-E03 art at `d9cb0faa3dff204106598876fe38db5f4ee3237a`. After the clean handoff
reconciliation, the designer said `Let's do next`. EN-E04 lists Naga
priority-first, so only the common Coilguard Idle F1-F2 gate was activated
across four directions. The designer approved both exact paired GIFs on
2026-08-08; bounded publication is complete at
`bd920c206d692bcc5e7b043614dcf6a03db2174c`. The separately continued
Coilguard complete-motion suite was then approved and published at
`f47e1691208236f5d245a1f3b9b15355ad479790`. After its clean handoff, the
designer said `lets do next`; following the Naga role order, only Venom Oracle
specialist Idle F1-F2 was activated. The designer reviewed both exact paired
GIFs and said `ye approved` on 2026-08-08; bounded publication is complete at
`3365d9915ed0ac1e506470604ed1e83c84606181`. The designer then asked to try
bigger slices. Codex proposed the combined Venom Oracle complete-motion plus
Temple Rajah Idle 88-frame review boundary, and the designer said `sure lets do
that`. The designer then located Temple Rajah in the bottom `R IDLE` row,
reviewed both exact combined GIFs, and said
`oh right sorry i had to scroll down approved`; bounded publication of that
exact internal lane is complete at
`4fd887f0a174169d47f9f3bee3f98d92c2ffaf30`. The designer then said
`very good lets do another similar sized slice`; that continuation activates
only the comparable 80-frame Temple Rajah complete-motion candidate now
visually approved and published at
`38b56f316a3fa12443b5b9fb003e74dc7e8059aa` on
`codex/en-e04-rajah-motion`. That approval now activates exactly one separate
80-frame Merfolk Tideguard full-enemy candidate on
`codex/en-e04-merfolk-tideguard`; it is hash-frozen and technically validated
and is now visually approved, internal, non-public, committed, and pushed at
`622b00f0c40eed552f61b30bd207b5ad8478836e`.
The designer's later `lets do next` activates exactly one 80-frame Merfolk
Reefcaller specialist on `codex/en-e04-merfolk-reefcaller`; its paired evidence
is hash-frozen, technically validated, and visually approved after both visible
side-eye pixels were repaired to coral red. The internal, non-public lane is
committed and pushed at `b315a32aa48d8881efe23e9d5b8553e6c0fb6b79`.
The designer's next `lets do next` activates exactly one 80-frame Merfolk Pearl
Regent elite on `codex/en-e04-merfolk-pearl-regent`; its paired evidence is
hash-frozen and technically validated, but visual approval remains pending.

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

- `implementation-candidate`: a bounded implementation exists under explicit
  authorization, but technical completion does not imply visual acceptance;
  plan text alone never grants authorization.
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
four directions: Hill Breaker, Steppe Hunter, and Briar Reveler. Hill Breaker
common Walk W1-W4, Steppe Hunter common Walk W1-W4, and Briar Reveler common
Walk W1-W4 are also visually approved and internal. Hill Breaker, Steppe Hunter,
and Briar Reveler common Attack A1-A4 are likewise visually approved, internal,
and non-public. Hill Breaker, Steppe Hunter, and Briar Reveler Hurt H1-H2 plus
their common Cast/Death aliases are visually approved, internal, non-public,
and published. Boulder Hurler specialist Idle F1-F2 is also visually approved,
internal, non-public, and published. The public-roster-only three-treatment
export side lane is approved without changing EN-E03 art or registration.
Storm-Clan Jarl, Sun Lancer, Banner Khan Idle/grouped motion, Reed Charmer
Idle/grouped motion, and Wildwood Hornlord Idle/grouped motion are approved and
published internally. EN-E03 is no longer the active art lane. EN-E04 Naga
Coilguard common Idle F1-F2 is visually approved and published internally at
`bd920c206d692bcc5e7b043614dcf6a03db2174c`. The explicitly continued,
isolated Coilguard complete-motion suite is visually approved as an internal,
non-public lane and published at
`f47e1691208236f5d245a1f3b9b15355ad479790`. The designer's later `lets do
next` activated only Venom Oracle specialist Idle F1-F2. Its internal paired
candidate is technically validated and visually approved; bounded publication
is complete at `3365d9915ed0ac1e506470604ed1e83c84606181`.
The separately authorized larger-slice candidate now combines Venom Oracle
complete motion with Temple Rajah Idle F1-F2. It is technically validated,
visually approved, internal, non-public, committed, and pushed at
`4fd887f0a174169d47f9f3bee3f98d92c2ffaf30`. Temple Rajah motion, Merfolk,
Birdfolk, registration, consumer work, effects, release, and subsequent gates
remained unauthorized until the designer's later same-sized-slice request. That
request activates Temple Rajah complete motion only; Merfolk, Birdfolk,
registration, consumer work, effects, release, and subsequent gates remain
unauthorized.

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

Visual review has a separate mandatory presentation contract. Unless the
designer explicitly requests a narrow inspection, every approval surface must
show labeled Down, Left, Right, and Up animations and must include both raw
source pixels with outlines off and the outlined project presentation
(currently Complete B + Form for this lane). A review may omit directions or a
presentation mode only when its stated scope is a specific direction, frame,
layer, outline mode, or isolated defect; never silently narrow a normal review.

After explicit visual approval, stage only the bounded approved lane, commit
it, and push its branch before beginning another enemy gate. Do not publish an
unapproved lane; an explicit designer hold overrides this default.

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
2. Build exactly one sprite per pass, starting with the baseline variant, and
   complete its standard 80-frame suite: Idle, Walk, Attack, Cast aliases,
   Hurt, and Death aliases across all four directions.
3. Produce labeled four-direction raw/no-outline and Complete B + Form
   full-suite review boards and synchronized GIFs while retaining native-pixel
   inspection.
4. Stop for explicit visual approval.
5. After approval and the bounded publication checkpoint, start at most one
   next sprite as another complete-suite pass. Do not fall back to an Idle-only
   pass unless the designer explicitly requests a calibration gate.
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
  the current four-approved/zero-implemented/eighteen-planned ledger state,
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
- at checkpoint `7b6e448`, cumulative `ENEMY_EXPANSION_REGISTRY` composition
  was ten approved families / 30 variants across EN-E01 and EN-E02;
- at registration checkpoint `7b6e448`, `ENEMY_EXPANSION_CONSUMER_REGISTRY`
  remained exactly EN-E01 and `PUBLIC_ENEMIES` remained 62 families / 217
  variants; that is historical registration evidence rather than the current
  post-authorization consumer boundary; and
- `npm.cmd run check:enemy-expansion-en-e02-registration` verifies the exact
  artifact hashes, current four-approved/zero-implemented/eighteen-planned ledger,
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
resulting F1/F2 boards on 2026-08-04 with `approved`. Subsequent explicit gates
  approved all three common Walk baselines and all three common Attack A1-A4
  baselines. After the Briar Reveler Attack branch was approved and published,
  the designer accepted the explicitly bounded Hill Breaker Hurt H1-H2 gate
  with `lets go for it` and approved both exact GIFs. The designer then said
  `nice lets do nexrt`; Codex explicitly bounded only Steppe Hunter Hurt H1-H2,
  which the designer approved and the matching branch published. The designer
  then said `awesome lets do next`; Codex bounded Briar Reveler Hurt H1-H2,
  whose exact paired GIFs the designer approved with `approved lets do next`.
  That approval branch is published. The separately isolated common Cast/Death
  alias candidate across all three approved common variants now passes its
  focused and full gates and awaits four-GIF review. Do not implement other
  family motion, specialist/elite variants, registration, consumer routing,
  separate effects, release work, or later EN-E03 steps.

### EN-E03 - Large and hybrid walkers

- Status: v1/v2 `rejected`; Hill Breaker, Steppe Hunter, and Briar Reveler
  two-frame Idle baselines `approved` and internal; Hill Breaker Walk W1-W4
  `approved` and internal; Steppe Hunter Walk W1-W4 `approved` and internal;
  Briar Reveler Walk W1-W4 `approved` and internal; Hill Breaker Attack A1-A4
  `approved` and internal; Steppe Hunter Attack A1-A4 `approved` and internal;
  Briar Reveler Attack A1-A4 `approved` and internal; Hill Breaker Hurt H1-H2
  `approved` and internal; Steppe Hunter Hurt H1-H2 `approved` and internal;
  Briar Reveler Hurt H1-H2 `approved` and internal
- Families: Giant, Centaur, Satyr
- Latest completed gate: approved common Cast-to-Attack and Death-to-Hurt
  aliases for the three approved common variants only; the four required GIFs
  were approved together and no new sprite pixels or public integration exist
- Latest completed variant gate: Sun Lancer specialist Idle F1-F2 is approved,
  internal, non-public, and effect-free across four directions; the corrected
  Storm-Clan Jarl elite Idle remains its approved preceding gate
- Approved side lane: the complete 67-family / 232-variant public catalog was
  exported in Form + Complete B, Form + Selective C, and Form + None folders;
  incomplete EN-E03 work remains excluded
- Latest visual approval: both exact raw/no-outline and Complete B + Form
  labeled Reed Charmer complete-motion GIFs were approved together on
  2026-08-08. The internal, non-public 80-frame lane is committed and pushed at
  `f77c8a88b25cb59f5bdbe82708a620e5cae3fe9d`.
- Latest approved implementation: after the designer authorized one safe larger
  slice with `Sure lets go for it one complete motion suite we can try atleast`,
  Reed Charmer Walk/Attack/Hurt/Cast/Death was completed across all four
  directions, visually approved, and published while approved Idle and Briar
  sources remained exact.
- Latest visual approval: Wildwood Hornlord elite Idle F1-F2 across four
  directions was approved with `Approved lets do next`. Its exact paired
  evidence is frozen, all technical gates pass, and the internal lane is
  published at `aa96e170c41cbcb49c7ac1bd979114b3b5bfa7e4`. The same message
  requests the next isolated Wildwood art gate while registration, consumers,
  effects, release, and broader scope remain gated.
- Latest approved implementation: Wildwood Hornlord Walk/Attack/Hurt/Cast/Death
  across four directions forms one internal, non-public 80-frame suite. Approved
  Idle delegates byte-for-byte, Cast/Death are exact aliases, paired evidence is
  frozen, and the designer approved both exact GIFs together on 2026-08-08. The
  bounded implementation is committed and pushed at
  `d9cb0faa3dff204106598876fe38db5f4ee3237a`.

Shared leverage: large-body scale studies, long strides, hoof contacts, and
front/back torso-to-leg alignment. Centaur is the four-legged hybrid pilot;
approval must prove readable front, back, and side joins before animation.

Initial variant briefs:

| Family | Common | Specialist | Elite |
| --- | --- | --- | --- |
| Giant | Hill Breaker | Boulder Hurler | Storm-Clan Jarl |
| Centaur | Steppe Hunter | Sun Lancer | Banner Khan |
| Satyr | Briar Reveler | Reed Charmer | Wildwood Hornlord |

Current EN-E03 evidence:

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
They are now the accepted internal Briar Reveler two-frame Idle baseline.

#### Approved Hill Breaker Walk baseline

The designer authorized only Hill Breaker common Walk W1-W4 across Down, Left,
Right, and Up while preserving the approved Idle baseline exactly.
Repository-consolidation checkpoint `8ea019b` preserves those exact candidate
pixels. The designer reviewed the exact raw and Complete B + Form boards and
approved them on 2026-08-06 with `yes sir seems fine to me approved`.

- Gate ID: `en-e03-hill-breaker-walk-v1`; status: `approved`.
- Raw board SHA-256:
  `bc6302036e4b3c8f45c59195659726408721d3dbdac3b1b670f2543d46213420`.
- Complete B + Form board SHA-256:
  `19ce1476461bf623e5dc909216021e64c61b40f168ec175cb0a60dcf3e338339`.
- Approved 16-frame digest:
  `9f41b2b90b245fe7d6302f87ddcd9313cdedc5360ddc245a4d61c8beab958622`.
- Delegated approved Idle digest:
  `2ae3904669508afbabed0742d72d4d334f37cdee360ba4f4d1a11767d22ee5ab`.
- Approval remains internal: Giant still has zero public exposure.

#### Approved Steppe Hunter Walk baseline

The Hill Breaker approval authorized only Steppe Hunter common Walk W1-W4
across Down, Left, Right, and Up while preserving the approved Steppe Hunter
Idle baseline byte-for-byte. The designer reviewed the exact raw and Complete B
+ Form animations and approved them on 2026-08-06 with `approved`. The isolated
source worktree remains preserved; this exact approved content is included in
and published through the consolidated Steppe Hunter Attack branch.

- Gate ID: `en-e03-steppe-hunter-walk-v1`; status:
  `approved` on 2026-08-06.
- Source: `engine/enemy-expansion-en-e03-centaur-walk.js`.
- Focused checker and package command:
  `tools/check-enemy-expansion-en-e03-centaur-walk.mjs` and
  `npm.cmd run check:enemy-expansion-en-e03-centaur-walk`.
- Review generator and package command:
  `tools/enemy-expansion-en-e03-centaur-walk-review.mjs` and
  `npm.cmd run review:enemy-expansion-en-e03-centaur-walk`.
- Approved raw animation: `384x96`, four frames, `0.67s` loop, SHA-256
  `7e9beaf4d9edae0b2b60cee6c6c828efa3f426e1889e25873787066643a6c94e`.
- Approved Complete B + Form animation: `384x96`, four frames, `0.67s` loop,
  SHA-256
  `94815b06e852ecdb877e29cdf5d3dee2720825a4407c6f38c9cbbb267221e5c9`.
- The approved GIFs are ignored review-only derivatives; the deterministic
  PNG boards and frame digest below remain the frozen source evidence.
- Raw board: `1950x870`, SHA-256
  `b64b73f0bc90c35be428dbf49cc948576fc06575c28af36e286bd34079268269`.
- Complete B + Form board: `1950x870`, SHA-256
  `76503340798a738086cf8c001529c71aa80a3f8890ad55d6eb40a5e198e20a98`.
- Approved 16-frame digest:
  `8fa70b11dd34ae5643c709ff1082b84f61e36a1f3fa6110689f47fee864c433e`.
- Delegated approved Idle digest:
  `3c88471b25fc27397a0a11d6495cd27c641a6715ff33429f5d0d2c81f184ae49`.
- The focused run passes 16 connected hard-alpha hybrid Walk frames, preserves
  all eight approved Idle frames, retains two planted hoof contacts and three
  distinct hoof-contact silhouettes per direction with only W2/W4 shared,
  exact-mirrors the side profiles, adds 1,970 Complete B pixels, changes 2,084
  Form source pixels, reproduces both PNG hashes and the candidate digest, and
  exposes zero public EN-E03 families.
- The full project gate passes with the complete preserved 1,064-file local
  Boss review-checkpoint corpus. A fresh worktree initially fails only the two
  Boss subprocesses because 965 ignored checkpoint PNGs are absent;
  unvalidated clean-clone candidate `125b0b3` remains separate from this lane.
- Visual acceptance is complete. This approval does not register or expose
  Centaur; the registry remains internal with zero public families.

#### Approved Briar Reveler Walk baseline

The designer's `awesome lets do next` authorizes only Briar Reveler common Walk
W1-W4 across Down, Left, Right, and Up while preserving the approved Briar
Reveler Idle baseline byte-for-byte. This approved baseline remains intentionally
internal and non-public; its exact content is included in and published through
the consolidated Steppe Hunter Attack branch.

- Gate ID: `en-e03-briar-reveler-walk-v1`; status: `approved` and internal.
- Source: `engine/enemy-expansion-en-e03-satyr-walk.js`.
- Focused checker and package command:
  `tools/check-enemy-expansion-en-e03-satyr-walk.mjs` and
  `npm.cmd run check:enemy-expansion-en-e03-satyr-walk`.
- Review generator and package command:
  `tools/enemy-expansion-en-e03-satyr-walk-review.mjs` and
  `npm.cmd run review:enemy-expansion-en-e03-satyr-walk`.
- Raw review animation: `384x96`, four frames, `0.67s` loop, SHA-256
  `35a59fb7e05ee6b35505e67183c1f9c93e9780fcfc657ef4278bb6b7cde30825`.
- Complete B + Form review animation: `384x96`, four frames, `0.67s` loop,
  SHA-256
  `17b56b495035a596293f63427f3ccad42efc06f8409e7a50018da5a5c18ff2b9`.
- These GIFs are ignored review-only derivatives and are not approval evidence
  until the designer explicitly accepts the exact animations.
- Raw board: `1950x870`, SHA-256
  `8b39d575c3048bbced3ac975c5f204e3bd9ea7fb35ebf329ce0151a481a3269c`.
- Complete B + Form board: `1950x870`, SHA-256
  `b7e8b566bafbe87816c9f53977dcde8e109f544b488c73012015e3a72b86345f`.
- Candidate 16-frame digest:
  `409b08eb3bd121dec5e8234c49e2fe11d374b73bf501648852adae2ae4ab5755`.
- Delegated approved Idle digest:
  `0d5599dcd452351903e5d56289596d2e75f59caf5c0b7a5525c7e375c39b36fa`.
- The focused run passes 16 connected hard-alpha horned Walk frames, preserves
  all eight approved Idle frames, retains split-hoof ground contacts and three
  distinct contact/silhouette poses per direction with only W2/W4 shared,
  exact-mirrors the side profiles, covers the inherited front-expression pixel
  in every Up frame so the head reads as a rear view, adds 1,913 Complete B
  pixels, changes 2,047 Form source pixels, reproduces both PNG hashes and the
  candidate digest, and exposes zero public EN-E03 families.
- The full project gate passes with the preserved 1,064-file Boss review corpus;
  the 57-family / 202-variant legacy catalog and all 232 sheets remain exact.
- Visual acceptance is complete. After pausing approval to correct the inherited
  side-eye pixel in every Up frame, the designer reviewed the corrected raw and
  Complete B + Form animations and said `greeat lets move on` on 2026-08-06.

That approval authorizes only Hill Breaker common Attack A1-A4 across Down,
Left, Right, and Up while preserving its approved Idle and Walk frames
byte-for-byte. Do not implement Hurt, additional Giant/Centaur/Satyr motion,
specialist/elite variants, Cast/Death aliases, registration, consumer routing,
effects, release, or any later EN-E03 step without another explicitly bounded
authorization.

#### Approved Hill Breaker Attack baseline

The designer's `greeat lets move on` authorizes only Hill Breaker common Attack
A1-A4 across Down, Left, Right, and Up while preserving every approved Hill
Breaker Idle and Walk frame byte-for-byte. This implementation remains internal
and non-public; its exact content is included in and published through the
consolidated Steppe Hunter Attack branch. After the first
Attack review, the designer asked for a little more body movement. The revised
overlay-only attempt was then rejected with `not a good animation`, so it is not
the active candidate. The replacement uses a private layered rig: A1 coils the
upper body and club backward, A2 releases from center, A3 follows through and
drops into impact, and A4 recovers while the approved-style legs and feet stay
anchored. After the follow-up request to use front and back too, Down and Up now
carry the transform through hips and upper legs while both planted-foot anchors
remain byte-identical. Shared humanoid rendering is unchanged.

- Gate ID: `en-e03-hill-breaker-attack-v1`; status: `approved` on 2026-08-07.
- Source: `engine/enemy-expansion-en-e03-giant-attack.js`.
- Focused checker and package command:
  `tools/check-enemy-expansion-en-e03-giant-attack.mjs` and
  `npm.cmd run check:enemy-expansion-en-e03-giant-attack`.
- Review generator and package command:
  `tools/enemy-expansion-en-e03-giant-attack-review.mjs` and
  `npm.cmd run review:enemy-expansion-en-e03-giant-attack`.
- Approved labeled raw review animation: `192x224`, four frames, `0.48s` loop,
  SHA-256
  `a2b880921c4337b89ee64b18446fbe5d2527b2808c8f48a37c2f4549d1118724`.
- Approved labeled Complete B + Form review animation: `192x224`, four frames,
  `0.48s` loop, SHA-256
  `d06771fa77fac6078332f1928e713565a6cd2f54ff440145d03f8131ae353673`.
- These exact ignored review-only derivatives were the direct visual-approval
  surfaces.
- Raw board: `1950x744`, SHA-256
  `45ec7e5a52abdd0dc0e2eaf4042a2d64c73ddb0a47dd070eb974e31fa2dabe8f`.
- Complete B + Form board: `1950x744`, SHA-256
  `250390b3c44db6d86362e8cbad7ef7225b2c728c984718119c5d7b85fc07ea10`.
- Candidate 16-frame digest:
  `1b5cade8a0a19babd00ed067010ecb98948891a7e4f6cd435adc53ae57cf78ab`.
- Delegated approved Idle digest:
  `2ae3904669508afbabed0742d72d4d334f37cdee360ba4f4d1a11767d22ee5ab`.
- Delegated approved Walk digest:
  `9f41b2b90b245fe7d6302f87ddcd9313cdedc5360ddc245a4d61c8beab958622`.
- The focused run passes all 16 connected hard-alpha Attack silhouettes, four
  distinct poses per direction, planted Giant contact, one-cell margins,
  at least three torso-and-hip phases per direction, matched side-profile
  bounds/visual weight, at least three Down/Up hip-and-upper-leg phases, exact
  planted-foot anchors, all 8 approved Idle and 16 approved Walk frames
  byte-for-byte, 1,469 Complete B pixels, 1,752 Form source changes, frozen board
  hashes/digest, and zero public EN-E03 families.
- Visual acceptance is complete. The designer reviewed the exact labeled
  four-direction raw and Complete B + Form animations and said `Very good
  approved` on 2026-08-07.

The Hill Breaker approval followed by `Cool let's keep going` authorized only
the Steppe Hunter common Attack gate below. The designer has now visually
approved that exact bounded result. Hurt, Cast/Death aliases, other
Giant/Centaur/Satyr motion, specialist/elite variants, registration, consumer
routing, effects, release, and every later EN-E03 step remain unauthorized.

#### Approved Steppe Hunter Attack baseline

- Gate ID: `en-e03-steppe-hunter-attack-v1`; status:
  `approved` on 2026-08-07.
- Approval evidence: the designer reviewed the exact labeled Down, Left,
  Right, and Up animations in both raw/no-outline and Complete B + Form and
  said `Approved`.
- Scope: Steppe Hunter common Attack A1-A4 across Down, Left, Right, and Up
  only, with all 8 approved Idle and 16 approved Walk frames delegated
  byte-for-byte.
- Worktree and branch:
  `C:\tmp\8-bit-sprite-assembler-en-e03-steppe-hunter-attack` on
  `codex/en-e03-steppe-hunter-attack`, created from clean reconciled checkpoint
  `ec525b658c2e7d061bc511858b9102cd026c6be0`; published to the matching origin
  branch after visual approval.
- Source: `engine/enemy-expansion-en-e03-centaur-attack.js`; the approved
  `engine/enemy-expansion-en-e03-centaur-walk.js` output remains exact while
  exposing only its private horse-body helper to this candidate.
- Focused checker and package command:
  `tools/check-enemy-expansion-en-e03-centaur-attack.mjs` and
  `npm.cmd run check:enemy-expansion-en-e03-centaur-attack`.
- Review generator and package command:
  `tools/enemy-expansion-en-e03-centaur-attack-review.mjs` and
  `npm.cmd run review:enemy-expansion-en-e03-centaur-attack`.
- Labeled raw review animation: `192x224`, four `120ms` frames, SHA-256
  `ea0d576a586f3dc22777a35e8c8bed837efe5c9e7125e5508531a903fe7236d7`.
- Labeled Complete B + Form review animation: `192x224`, four `120ms` frames,
  SHA-256
  `7798a3da0b43b0111ac68b201f0afc8a4a85d53e0531b2cc3718a08dcd73aafa`.
- Raw board: `1950x744`, SHA-256
  `b276746f3d532df7b3ba9b551d8227b3d2fa439367fd49108eaaab5b5309eee2`.
- Complete B + Form board: `1950x744`, SHA-256
  `ba5c3f84fc0c7e96af985453c847b3669efe39c7c4e5f033fcad13dba432c5be`.
- Candidate 16-frame digest:
  `c01f66be4c6afcaaa562073b85598b09eff0e8686ec0092296d95090883f77a0`;
  delegated Idle digest
  `3c88471b25fc27397a0a11d6495cd27c641a6715ff33429f5d0d2c81f184ae49`;
  delegated Walk digest
  `8fa70b11dd34ae5643c709ff1082b84f61e36a1f3fa6110689f47fee864c433e`.
- The focused gate passes 16 connected hard-alpha horse-rider-spear
  silhouettes, planted hoof contacts, four distinct Attack silhouettes and at
  least three horse-body weight phases per direction, exact side mirroring,
  true Down/Up depth attacks, one-cell margins, 1,752 Complete B additions,
  1,937 Form source changes, exact approved Idle/Walk delegation, and zero
  public EN-E03 families.
- With the 965 missing ignored Boss checkpoints copied from the approved Hill
  Breaker lane, the full `npm.cmd run check` passes against the exact 1,064-file
  local corpus; the 57-family / 202-variant legacy catalog and all 232 fixture
  sheets remain unchanged.
- Visual acceptance is complete on the exact labeled Down, Left, Right, and Up
  raw/no-outline and Complete B + Form pair. The general dual-presentation rule
  remains mandatory for future normal reviews. Commit and push this bounded
  approved lane under the standing publication rule; do not register or begin
  any later EN-E03 gate without separate authorization.

#### Approved Briar Reveler Attack baseline

The designer's `lets keep going`, given after the approved Steppe Hunter Attack
lane was committed and pushed, authorizes only Briar Reveler common Attack A1-A4
across Down, Left, Right, and Up while preserving every approved Briar Reveler
Idle and Walk frame byte-for-byte.

- Gate ID: `en-e03-briar-reveler-attack-v1`; status: `approved` on 2026-08-07
  and internal/non-public.
- Approval evidence: the designer reviewed both exact labeled
  all-four-direction raw and Complete B + Form animations together and said
  `very good! approved`.
- Worktree and branch:
  `C:\tmp\8-bit-sprite-assembler-en-e03-briar-reveler-attack` on
  `codex/en-e03-briar-reveler-attack`, created exactly from pushed approved
  checkpoint `c567a426fa6d5175395c2b035f65b12b5a5dd1cb`.
- Source: `engine/enemy-expansion-en-e03-satyr-attack.js`.
- Focused checker and package command:
  `tools/check-enemy-expansion-en-e03-satyr-attack.mjs` and
  `npm.cmd run check:enemy-expansion-en-e03-satyr-attack`.
- Review generator and package command:
  `tools/enemy-expansion-en-e03-satyr-attack-review.mjs` and
  `npm.cmd run review:enemy-expansion-en-e03-satyr-attack`.
- Labeled raw review animation: `192x224`, four `120ms` frames, SHA-256
  `1625c6db6759cb4a20ea4521ef1a4b04199813f2dc75e2e0db2fa5e4a54241d9`.
- Labeled Complete B + Form review animation: `192x224`, four `120ms` frames,
  SHA-256
  `5efb83b879f1cbe130075db722f9d26762180b4e00945941465d0dbb8304886a`.
- Raw board: `1950x870`, SHA-256
  `ac7ca315dfdd65b378c5db42623bf4013b961c0ebf1f22c0045803f14dcb9abb`.
- Complete B + Form board: `1950x870`, SHA-256
  `4d97b61111bcf293d024a01201677fb10ba54bdf496fa0264df5abb78f5a54ab`.
- Candidate 16-frame digest:
  `9545779f0d39c16f1fedaf581ad1f5dee8b6ce0b79d35ce23a66e81375c32270`;
  delegated Idle digest
  `0d5599dcd452351903e5d56289596d2e75f59caf5c0b7a5525c7e375c39b36fa`;
  delegated Walk digest
  `409b08eb3bd121dec5e8234c49e2fe11d374b73bf501648852adae2ae4ab5755`.
- A1 braces/draws back, A2 lifts, A3 drives a diagonal whole-body strike, and
  A4 recovers to guard. The focused gate passes 16 connected hard-alpha
  body-and-staff silhouettes, planted split-hoof anchors, four distinct poses
  per direction, exact side mirroring, distinct Down/Up depth, 2,030 Complete B
  additions, 1,922 Form source changes, exact approved Idle/Walk delegation,
  and zero public exposure.
- With the 965 missing ignored Boss checkpoints copied from the approved Steppe
  Hunter lane, the full `npm.cmd run check` passes against the exact 1,064-file
  local corpus; the 57-family / 202-variant legacy catalog and all 232 fixture
  sheets remain unchanged.
- The exact bounded approval branch is committed and pushed under the standing
  publication rule. The only authorized continuation is the separately bounded
  Hill Breaker Hurt candidate below.

#### Approved Hill Breaker Hurt baseline

After the approved Briar Reveler Attack lane was committed and pushed, the
designer agreed to continue the 80 plan. Codex proposed exactly Hill Breaker
Hurt H1-H2 across Down, Left, Right, and Up, preserving approved Idle, Walk, and
Attack byte-for-byte and stopping for dual-presentation review; the designer
accepted that scope with `lets go for it` on 2026-08-07.

- Gate ID: `en-e03-hill-breaker-hurt-v1`; status: `approved` on 2026-08-07,
  internal, and non-public.
- Approval evidence: the designer reviewed both exact labeled
  all-four-direction raw and Complete B + Form animations together and said
  `approved`.
- Worktree and branch:
  `C:\tmp\8-bit-sprite-assembler-en-e03-hill-breaker-hurt` on
  `codex/en-e03-hill-breaker-hurt`, created exactly from synchronized approved
  checkpoint `68d913ccfd00f76f15dcac308338c9e686a4f171`; the bounded approved lane is
  committed and pushed to its matching origin branch.
- Source: `engine/enemy-expansion-en-e03-giant-hurt.js`; Idle, Walk, and Attack
  delegate to the exact approved Giant renderer chain.
- Focused checker and package command:
  `tools/check-enemy-expansion-en-e03-giant-hurt.mjs` and
  `npm.cmd run check:enemy-expansion-en-e03-giant-hurt`.
- Review generator and package command:
  `tools/enemy-expansion-en-e03-giant-hurt-review.mjs` and
  `npm.cmd run review:enemy-expansion-en-e03-giant-hurt`.
- Labeled raw review animation: `192x224`, two `140ms` frames, SHA-256
  `ebc7e3e1fcfad73aa0b8114e270dae2a699933aedc23b306a73edeec9214e5b6`.
- Labeled Complete B + Form review animation: `192x224`, two `140ms` frames,
  SHA-256
  `f2034dd87706e196f1eece15f08db86dfb6e32a5437c18cdfe08e89b778ba3f4`.
- Raw board: `1134x744`, SHA-256
  `e621d1ed2898efdf9e49488aa367f7857b1c96f3b2ea1d9dd0dcd75dba2bcf02`.
- Complete B + Form board: `1134x744`, SHA-256
  `201f7c3246c0a924426201d1ad43b6f90849d9f4cd934b591b7d5a8bd6d9161c`.
- Candidate eight-frame digest:
  `92c18dc1dd0699e52f5f31a0900be1c6e46974c6f5bc3347fc7a7c7b65432340`.
- The focused gate preserves 8/8 Idle, 16/16 Walk, and 16/16 Attack frames
  byte-for-byte; validates eight connected, distinct hard-alpha Hurt
  silhouettes, planted contact, one-cell margins, exact side visual weight,
  exact Down/Up foot anchors, 714 Complete B additions, 418 Form source
  changes, and zero public EN-E03 families.
- H1 is a bright direction-aware recoil with the upper body and club moving as
  one rig over planted feet; H2 is the colored braced recovery.
- Both exact labeled review GIFs are approved and the branch is published.
  Cast and Death aliases, other Hurt work, variants, registration, consumers,
  effects, release, and every later gate remain excluded until separately
  authorized.

#### Approved Steppe Hunter Hurt baseline

After approving both exact Hill Breaker Hurt GIFs, the designer said `nice lets
do nexrt`. Codex explicitly bounded the next gate as Steppe Hunter Hurt H1-H2
across Down, Left, Right, and Up, preserving approved Idle, Walk, and Attack
byte-for-byte and stopping for the mandatory dual-presentation review.

- Gate ID: `en-e03-steppe-hunter-hurt-v1`; status: `approved`, internal, and
  non-public on 2026-08-07.
- Approval evidence: the designer reviewed both exact labeled
  all-four-direction raw and Complete B + Form animations together and said
  `approved`.
- Worktree/branch:
  `C:\tmp\8-bit-sprite-assembler-en-e03-steppe-hunter-hurt` on
  `codex/en-e03-steppe-hunter-hurt`, created exactly from approved pushed
  checkpoint `3e0d98bd48b30cd6ddf35cbd87b424c3c3fd3b5c`.
- Source: `engine/enemy-expansion-en-e03-centaur-hurt.js`; it delegates all 8
  approved Idle, 16 approved Walk, and 16 approved Attack frames exactly.
- Checker: `tools/check-enemy-expansion-en-e03-centaur-hurt.mjs` via
  `npm.cmd run check:enemy-expansion-en-e03-centaur-hurt`.
- Review generator: `tools/enemy-expansion-en-e03-centaur-hurt-review.mjs` via
  `npm.cmd run review:enemy-expansion-en-e03-centaur-hurt`.
- Raw labeled GIF: `192x224`, two `140ms` frames, SHA-256
  `b79357ba08580dbe6bb8fb8a175a9694756ec636a71908608cacaa75aa4b0f01`.
- Complete B + Form labeled GIF: `192x224`, two `140ms` frames, SHA-256
  `6995aadbe92e0425eb6625afaed9b3f005d99820d28f4addb9af15c9107011e9`.
- Raw `1134x744` board SHA-256:
  `da4fd6d7c98b4499df378cb006183728d1433d89a15c3db353fc06557bf3c0ec`.
- Complete B + Form `1134x744` board SHA-256:
  `9f00c5feadee2b2670b2d672b903106eaa7ee7a500da28d0ddc1de1c4d6c8441`.
- Eight-frame digest:
  `13861ef4d4543d78afe893968c81b92023a6a863ac8c56e8aef0ece1b5e05a4a`.
- H1 is a full-white horse-rider-spear recoil. H2 is the colored braced spear
  recovery. The four hoof anchors remain exact across both phases.
- The focused gate passes all eight connected distinct hard-alpha hybrid
  silhouettes, exact side mirrors, Down/Up depth distinction, one-cell margins,
  fixed hoof anchors, 879 Complete B additions, 473 Form source changes, exact
  preservation of all 40 approved frames, and zero public exposure.
- Both exact labeled all-four-direction GIFs are approved and the bounded
  branch is published. Cast/Death aliases, other Hurt, variants, registration,
  consumers, effects, release, and later EN-E03 work remain separately gated.

#### Approved Briar Reveler Hurt baseline

After the approved Steppe Hunter Hurt lane was committed and pushed, the
designer said `awesome lets do next`. Codex explicitly bounded the next gate
as Briar Reveler Hurt H1-H2 across Down, Left, Right, and Up, preserving all
approved Briar Reveler Idle, Walk, and Attack pixels and stopping for the
mandatory raw plus Complete B + Form review before any commit or push.

- Gate ID: `en-e03-briar-reveler-hurt-v1`; status: `approved`, internal, and
  non-public on 2026-08-07.
- Approval evidence: the designer reviewed both exact labeled
  all-four-direction raw and Complete B + Form animations together and said
  `approved lets do next`.
- Worktree/branch:
  `C:\tmp\8-bit-sprite-assembler-en-e03-briar-reveler-hurt` on
  `codex/en-e03-briar-reveler-hurt`, created exactly from approved pushed
  Steppe Hurt checkpoint `374d0b73c171c9f9f35b6d71f2f9e85f4dcdd7c1`.
- Source: `engine/enemy-expansion-en-e03-satyr-hurt.js`; it delegates all 8
  approved Idle, 16 approved Walk, and 16 approved Attack frames exactly.
- Checker: `tools/check-enemy-expansion-en-e03-satyr-hurt.mjs` via
  `npm.cmd run check:enemy-expansion-en-e03-satyr-hurt`.
- Review generator: `tools/enemy-expansion-en-e03-satyr-hurt-review.mjs` via
  `npm.cmd run review:enemy-expansion-en-e03-satyr-hurt`.
- Raw labeled GIF: `192x224`, two `140ms` frames, SHA-256
  `438056d9d9c195aff1ab429ead9164f9b98bfd89cf916ff8936d353ce3f713f9`.
- Complete B + Form labeled GIF: `192x224`, two `140ms` frames, SHA-256
  `8b73e3f44c0a7ff94df0cdb8b167d44d32e20e0273275d824844045de0cddce1`.
- Raw `1134x744` board SHA-256:
  `0b5cd11212e272ab29bdac3336155e7546b3e1e28299c7ce70c0a7232b6ba44d`.
- Complete B + Form `1134x744` board SHA-256:
  `78bec5bc888515bad74578b4d08f381f4c25842e88e3b76c74697d3da48fdb74`.
- Eight-frame digest:
  `3bc6bbd29189d8155784fa7499b355af1b826c44d0caf60b37db198cb7625030`.
- H1 flashes the complete connected horned body, tail, hands, crooked staff,
  reverse-jointed legs, and split hooves white. H2 is the colored full-body
  brace. The four split-hoof tips remain exact across both phases.
- The focused gate passes all eight connected distinct hard-alpha silhouettes,
  exact side mirrors, true Down/Up depth, one-cell margins, fixed hoof anchors,
  approved rear-head/no-side-eye treatment, 945 Complete B additions, 417 Form
  source changes, exact preservation of all 40 approved frames, and zero public
  exposure.
- With the 965 missing ignored Boss checkpoints copied from the approved Steppe
  lane, the full `npm.cmd run check` passes against the exact 1,064-file local
  corpus; all 232 public fixture sheets remain unchanged.
- Both exact labeled all-four-direction GIFs are approved and the bounded
  branch is committed and pushed. The designer authorized continuation, and
  Codex explicitly bounded only the separate common Cast/Death alias gate for
  Hill Breaker, Steppe Hunter, and Briar Reveler. Other family motion, variants,
  registration, consumers, effects, release, and later work remain excluded.

#### Common Cast/Death alias approved baseline

The designer approved both exact Briar Reveler Hurt GIFs with `approved lets do
next`. After publishing that branch, Codex explicitly bounded only common
Cast/Death aliases across the approved Hill Breaker, Steppe Hunter, and Briar
Reveler baselines: Cast equals Attack A1-A4, Death equals Hurt H1,H2,H2,H2,
and no new sprite pixels or public integration are authorized.

- Gate ID: `en-e03-common-cast-death-aliases-v1`; status: `approved`, internal,
  non-public, committed, and pushed.
- Approval evidence: the designer reviewed the exact labeled all-four-direction
  Cast raw, Cast Complete B + Form, Death raw, and Death Complete B + Form GIFs
  together and said `approved` on 2026-08-07.
- Worktree/branch:
  `C:\tmp\8-bit-sprite-assembler-en-e03-cast-death-aliases` on
  `codex/en-e03-cast-death-aliases`, created exactly from approved pushed Briar
  Hurt checkpoint `892a0034652c98f99b4f75ab9fdb58210927b98c`.
- Source: `engine/enemy-expansion-en-e03-common-aliases.js`; three wrappers
  delegate all 144 approved Idle/Walk/Attack/Hurt context frames exactly and
  add only alias routing metadata.
- Checker: `tools/check-enemy-expansion-en-e03-common-aliases.mjs` via
  `npm.cmd run check:enemy-expansion-en-e03-common-aliases`.
- Review generator: `tools/enemy-expansion-en-e03-common-aliases-review.mjs`
  via `npm.cmd run review:enemy-expansion-en-e03-common-aliases`.
- Cast raw GIF: `576x224`, four `120ms` frames, SHA-256
  `e7340c687b8b4febc9852d56afaeed8d2545a37f9c3a816cfa3fa3fc25600d85`.
- Cast Complete B + Form GIF: `576x224`, four `120ms` frames, SHA-256
  `26594c7f08b61de870bde6046bca8a0d276cb24b6b7c9f87387546bd934c68c3`.
- Death raw GIF: `576x224`, four `120ms` frames, SHA-256
  `438d31742ddd372018af80d96b84f20aec47246967a092b2f98684fe7580dae4`.
- Death Complete B + Form GIF: `576x224`, four `120ms` frames, SHA-256
  `b4adbb78be7ab2d5f8d7c47b207dba99938b0b3c108799aa651f56b1fcbb93f0`.
- Raw `1120x562` board SHA-256:
  `1353962c4861960683c99a1e608654685b093fd101a6534c4777c5687e3f3b89`.
- Complete B + Form `1120x562` board SHA-256:
  `0ab28ed6467e798e5f24a8f19e6a4d2a522cba5d6ad7d045ea865b8953942575`.
- Ninety-six-frame alias digest:
  `be86cf5677286e745d76f7744a49462ba22d4deeb63bc92026160a5ca84b8d89`.
- The focused gate passes 144/144 approved context frames, 48/48 Cast aliases,
  48/48 Death aliases, zero new pixels, hard alpha, one-cell margins, 10,249
  Complete B additions, 9,535 Form source changes, and zero public families.
- After copying only the 965 missing ignored Boss checkpoints from the approved
  Briar lane, the full `npm.cmd run check` passes against the complete
  1,064-file local corpus; all 232 public fixture sheets remain unchanged.
- Direct review of all four exact labeled GIFs is complete and the bounded
  branch is published under the approval contract. New pixels, variants,
  registration, consumers, effects, release, and later work were excluded from
  that gate. The designer then said `good lets do next`; Codex explicitly
  bounded the continuation to Boulder Hurler Idle F1-F2 across four directions.

#### Approved Boulder Hurler specialist Idle baseline

- Gate ID: `en-e03-boulder-hurler-idle-v1`; status: `approved`, internal,
  non-public, committed, and pushed.
- Approval evidence: the designer reviewed both exact improved labeled
  all-four-direction raw and Complete B + Form GIFs together and said `approved`
  on 2026-08-07.
- Worktree/branch:
  `C:\tmp\8-bit-sprite-assembler-en-e03-boulder-hurler-idle` on
  `codex/en-e03-boulder-hurler-idle`, created exactly from reconciled approved
  alias checkpoint `8fff98f775687a6d0d07b5b9e58a7ec57e1988dd`.
- Source: `engine/enemy-expansion-en-e03-giant-specialist-idle.js`; one
  Giant/Boulder Hurler variant renders only Idle F1-F2 across four directions.
- Identity: long bare throwing arms, heavy wrist wraps, a diagonal sling
  harness, and a cool slate hide palette. The actor is unarmed and the boulder
  remains an external projectile with zero baked actor pixels.
- Checker: `tools/check-enemy-expansion-en-e03-boulder-hurler-idle.mjs` via
  `npm.cmd run check:enemy-expansion-en-e03-boulder-hurler-idle`.
- Review generator:
  `tools/enemy-expansion-en-e03-boulder-hurler-idle-review.mjs` via
  `npm.cmd run review:enemy-expansion-en-e03-boulder-hurler-idle`.
- Raw `1528x650` board SHA-256:
  `f3a9b41fbec9127f3414c3a414b2e64d1a9cae3c2f86c81b31f6dcda0ccda54f`.
- Complete B + Form `1528x650` board SHA-256:
  `bbaf966cbd33a807372c45622112f0fe523dc8e9cb3f52a36cc139777f82be91`.
- Raw labeled four-direction GIF: `192x224`, two `240ms` frames, SHA-256
  `8ee6a17eee4e4428cbfab8fad2fef942dba436803bae398d5ea02b4afbfaad56`.
- Complete B + Form labeled four-direction GIF: `192x224`, two `240ms` frames,
  SHA-256
  `2c081db2c8cb553f70374e70ab234814d4b1c64aa8c11227b85e9971cf058701`.
- Eight-frame candidate digest:
  `d8f3b04d54a55d7fe20e3dfdf0c3cb9c68ffb65722b07a5b0f416e18335795a0`.
- Revised motion uses a slower grounded stance cycle: F2 lowers the shoulders
  and harness while the hands lag, move inward, and bend into a throwing-ready
  side pose rather than translating the whole upper overlay together.
- The focused gate preserves all 8/8 approved Hill Breaker Idle frames and
  validates 8/8 connected hard-alpha specialist frames, four exact side
  mirrors, distinct Down/Up views and F1/F2 poses, one-cell margins, 694
  Complete B additions, 872 Form source changes, zero baked projectile pixels,
  and zero public EN-E03 families.
- With the complete local Boss checkpoint corpus present, the full
  `npm.cmd run check` passes and all 232 public fixture sheets remain unchanged.
- Direct review of both exact labeled all-four-direction GIFs is complete and
  the bounded branch is published under the approval contract. Do not add
  motion or another variant, register, integrate, add effects, release, or begin
  later work without separate explicit authorization.

#### Approved full public-Enemy three-treatment export side lane

- Gate ID: `all-enemy-three-outline-modes-v1`; status: `approved` local
  delivery/tooling checkpoint, committed and pushed at
  `71fb59479626b757f112be3f9e56b92f24085208`.
- Source art commit:
  `9c89077f79ef8eab06dc4e7a725edefe5b9bbb97`; branch/worktree:
  `codex/all-enemy-outline-export` at
  `C:\tmp\8-bit-sprite-assembler-all-enemy-outline-export`.
- `tools/export-all-enemy-outline-pack.mjs` renders all 67 public families / 232
  variants as native `480x96` sheets into three top-level folders: Form +
  Complete B (`outlined`), Form + Selective C (`semi-outlined`), and Form + None
  (`without-outlines`). Incomplete/non-public EN-E03 candidates are excluded.
- `tools/check-all-enemy-outline-pack.mjs` validates all 696 PNGs, 698 unpacked
  files, and 698 stored-ZIP entries, including every frame, hard alpha, hashes,
  treatment distinction, and directory/archive parity.
- Exact approved ZIP: 2,440,823 bytes, SHA-256
  `fd03895d8657b96293be14fbddbdb193ce62678c068023b58015410fc7f92b9c`.
- The full `npm.cmd run check` passes and all 232 committed fixture sheets remain
  unchanged. This side lane does not register EN-E03 or alter the 80-plan art
  sequence.
- Approval evidence: the designer received the package and said `awesome lets
  do next in plan` on 2026-08-07.

#### Approved Storm-Clan Jarl elite Idle gate

- Gate ID: `en-e03-storm-clan-jarl-idle-v1`; status: `approved`, internal,
  non-public, and bounded to Idle F1-F2 only.
- Isolated branch/worktree: `codex/en-e03-storm-clan-jarl-idle` at
  `C:\tmp\8-bit-sprite-assembler-en-e03-storm-clan-jarl-idle`, based on
  approved checkpoint `088b03f1e2b2fd3cf2391c8536a920fca5c9bb86`.
- Approved implementation checkpoint:
  `d9c3dedf521a1a1a6ad0b82f458bf38cf8fa9533`, committed and pushed after the
  exact corrected paired-GIF approval.
- Scope: only Idle F1-F2 across Down, Left, Right, and Up.
- Identity: layered storm-dark plate, broad steel pauldrons, heavy bracers, and
  a bright cyan cloth clan sash; no baked storm arc, lightning, impact crack,
  projectile, aura, or environmental effect.
- Revision: the designer identified the forward shoulder as misplaced in the
  first side frames. The corrected candidate seats that pauldron one row lower
  and one pixel back over the upper-arm joint in both exact mirrored sides; the
  frozen evidence below refers only to the corrected revision.
- Approval evidence: the designer reviewed both exact corrected labeled
  all-four-direction raw and Complete B + Form GIFs together and said
  `approved` on 2026-08-07.
- Preservation: approved Hill Breaker and Boulder Hurler Giant Idle frames must
  remain byte-exact, with all public catalog and fixture content unchanged. The
  focused gate confirms 8/8 plus 8/8 approved frames exact, 8/8 connected
  candidate silhouettes, four exact side mirrors, one-cell margins, hard
  alpha, 106 sash-color pixels, 682 Complete B additions, 684 Form source
  changes, zero baked-effect pixels, and zero public EN-E03 families.
- Frozen candidate evidence: raw board
  `776c57e70b20f7c0f0ab07ea344fab3e31082c028c08621498cf8b58d0b07c50`,
  Complete B + Form board
  `e0fd514dd9a9c26b50c221a5484f2832cee67e64e7a75eb08be56674f54c7768`,
  raw GIF
  `dad3d5b8deaf07ca565165a7db9f2f6159af399b107215a9e7c9f459103f6183`,
  Complete B + Form GIF
  `3f173f215ad354fde8b387a6c507127bb15507e73f575bd843d1b82d55e25bdc`,
  and eight-frame digest
  `3aebd8218877e0da9752b20df1256da4af2710927389006011a37479a5d14894`.
- Validation: focused gate passes; with the complete local Boss corpus, the full
  `npm.cmd run check` passes and all 232 public fixture sheets remain unchanged.
- Required review is complete for both exact labeled all-four-direction
  raw/no-outline and Complete B + Form GIFs together. Commit and push only this
  bounded approved lane; no later work is authorized.
- Exclusions: Walk, Attack, Hurt, Cast/Death aliases, every other EN-E03
  variant, registration, consumers, effects, release, and later work.

#### Approved Sun Lancer specialist Idle gate

- Gate ID: `en-e03-sun-lancer-idle-v1`; status: `approved`, internal,
  non-public, and bounded to Idle F1-F2 only.
- Authorization evidence: after approving Storm-Clan Jarl Idle, the designer
  said `lets do next`; following the documented EN-E03 family order, Codex
  bounded only Sun Lancer specialist Idle F1-F2 across four directions.
- Isolated branch/worktree: `codex/en-e03-sun-lancer-idle` at
  `C:\tmp\8-bit-sprite-assembler-en-e03-sun-lancer-idle`, based on published
  checkpoint `79a24ae3d1951780c2c29c8509fbe6310cb74c1b`.
- Approved implementation checkpoint:
  `f5057497bc0b9ee62b79c5d8a94efecfd49c0ec9`, committed and pushed on the
  isolated approval branch.
- Approval evidence: the designer reviewed both exact labeled
  all-four-direction raw/no-outline and Complete B + Form GIFs together and
  said `approved` on 2026-08-07.
- Identity: the approved Steppe Hunter chestnut four-hoof chassis gains
  sun-gold rider armor, a red-gold saddle cloth, and a bright direction-aware
  lance pennant; charge dust, spear trails, hoof shock rings, aura, and other
  movement effects remain external.
- Preservation: the focused gate confirms all 8/8 Steppe Hunter and 8/8
  Storm-Clan Jarl Idle frames byte-exact, 8/8 connected candidate silhouettes,
  eight four-hoof contact rows, four exact side mirrors, one-cell margins, hard
  alpha, 40 pennant pixels, 308 armor pixels, 192 cloth pixels, 972 Complete B
  additions, 1,172 Form source changes, zero baked-effect pixels, and zero
  public EN-E03 families.
- Frozen candidate evidence: raw board
  `e1bb41a818953dbcd1e11074da5fe1f115f83377697354493dd0ac730c247e47`,
  Complete B + Form board
  `64057dfab7bb6d7eebbf2b3de6838e82c3f0b95d7923f7eedf303b1f5154a493`,
  raw GIF
  `2d6198eba203f013fbbf2813cc6ef030995cbce566e1e845b25444b1ec9e513e`,
  Complete B + Form GIF
  `a8122bd75f6e3761c2215f499ee9c505107e0eb1ee5d2aeebf78514ff6ffae90`,
  and eight-frame digest
  `c195ab452409e722a9b6a9ca14a58b657033ba4c65943ea99fb03c5f180b394e`.
- Validation: focused gate passes; with the complete local Boss corpus, the full
  `npm.cmd run check` passes and all 232 public fixture sheets remain unchanged.
- Publication is complete at approved implementation checkpoint
  `f5057497bc0b9ee62b79c5d8a94efecfd49c0ec9`. No later work is authorized by
  the visual approval.
- Exclusions: Banner Khan, Walk, Attack, Hurt, Cast/Death aliases, other EN-E03
  variants, registration, consumers, effects, release, and later work.

#### Banner Khan elite Idle approved baseline

- Gate ID: `en-e03-banner-khan-idle-v1`; status: `approved`, internal,
  non-public, committed, and pushed at
  `55143049b4153e34fcdaad0ea434932ba0f2d0fd`.
- Authorization evidence: after approving and publishing Sun Lancer Idle, the
  designer said `lets do next`; following the documented Centaur role order,
  Codex bounded only Banner Khan elite Idle F1-F2 across four directions.
- Isolated branch/worktree: `codex/en-e03-banner-khan-idle` at
  `C:\tmp\8-bit-sprite-assembler-en-e03-banner-khan-idle`, based on published
  checkpoint `97787113ba3883e8cec41051fc9bdefe00684e95`.
- Identity: the approved chestnut Steppe Hunter chassis gains a visible khan
  face, compact conical steel helm, segmented blue-steel lamellar armor,
  crimson command sash, limited saddle drape, and a separated direction-aware
  tapered war standard; command aura, banner flare, hoof shock rings, and other
  movement effects remain external.
- Revision evidence: the designer found the first paired candidate weird, then
  found the targeted repair still had too much wrong and requested a from-scratch
  rebuild. Both earlier overlay identities are rejected and discarded. The
  active candidate delegates only the approved Steppe Hunter chassis and redraws
  the complete elite identity. The designer then rejected the straight-line side
  face; only the mirrored Left/Right profiles were rebuilt with a stepped
  forehead, protruding nose, visible eye, cheek, and tapered jaw. Down, Up, and
  the approved chassis remain unchanged. The designer then said the side mouth
  was too long; it is now one front pixel, separated from the shaded cheek by a
  skin-tone jaw pixel. The latest feedback identified the pale horizontal
  side-profile streak as the six-pixel light fur collar. Only the mirrored side
  collars now use a compact stepped two-tone shape with a two-pixel pale
  highlight; the one-pixel mouth remains unchanged. The designer then requested
  horse-body motion. Banner Khan F2 now lifts the side rump while settling the
  chest and lifts both Down/Up outer flanks; every leg and hoof pixel remains
  delegated byte-exact from the approved Steppe Hunter chassis.
- Approval evidence: the designer reviewed both exact labeled all-four-
  direction raw/no-outline and Complete B + Form r3 GIFs together and said
  `approved` on 2026-08-07. The approval applies to the frozen hashes below.
- Preservation: the focused gate confirms all 8/8 Steppe Hunter and 8/8 Sun
  Lancer Idle frames byte-exact, 8/8 connected candidate silhouettes, eight
  four-hoof contact rows, four exact side mirrors, one-cell margins, hard alpha,
  76 banner pixels, 256 lamellar pixels, 152 cloth pixels, 50 bronze-trim
  pixels, 48 fur-collar pixels, 983 Complete B additions, 1,011 Form source
  changes, zero baked-effect pixels, and zero public EN-E03 families.
- Frozen candidate evidence: raw board
  `6221555094b9876ff1aad5f04b7a20327ea4f79bde7d06116f2f95f07a2836e1`,
  Complete B + Form board
  `f4420a5c827762b699fa0007e168a484247fc0cb1a82623ec18c5cf510cc9b92`,
  raw GIF
  `1b93946a596213cb02460624fd3c4e5c0640f5202e86783fbdbbe34e73d15a10`,
  Complete B + Form GIF
  `298ad981961f9025c46fbcc3a255345ac8127fc2ce052303106b3606610e9e97`,
  and eight-frame digest
  `61c80740b96c2a35ccd8382335299c6521049f139c1c4df57e4852480663b3d6`.
- Validation: focused gate passes; with the complete local Boss corpus, the full
  `npm.cmd run check` passes and all 232 public fixture sheets remain unchanged.
- Publication is complete at approved implementation checkpoint
  `55143049b4153e34fcdaad0ea434932ba0f2d0fd`.
- Required next action: stop and wait for separate explicit designer
  authorization. No later gate is authorized by this approval.
- Pass-size guidance: use this Idle gate to calibrate the new elite identity.
  After approval and a separate explicit continuation, the remaining Banner
  Khan Walk, Attack, Hurt, and Cast/Death motion may be reviewed as one larger
  follow-up pass.
- Exclusions: Walk, Attack, Hurt, Cast/Death aliases, other EN-E03 variants,
  registration, consumers, effects, release, and later work.

#### Banner Khan elite grouped motion approved

- Gate ID: `en-e03-banner-khan-motion-v1`; status: `approved`, internal,
  non-public, committed, and pushed at
  `8e73cd038d50037a40cad27ee9f2e37b6e363b69`.
- Authorization evidence: after the exact Banner Khan Idle r3 baseline was
  approved, published, and reconciled, the designer said `lets keep going`.
  This satisfies the documented separate continuation for one grouped remaining
  Banner Khan motion pass.
- Approval evidence: the designer reviewed both exact labeled all-four-direction
  raw/no-outline and Complete B + Form motion-suite GIFs together and said
  `approved` on 2026-08-08. The approval applies to the frozen hashes below and
  authorizes only bounded publication of this internal, non-public lane.
- Isolated branch/worktree: `codex/en-e03-banner-khan-motion` at
  `C:\tmp\8-bit-sprite-assembler-en-e03-banner-khan-motion`, based exactly on
  clean published Idle handoff `a3754a1a26219c3b494289b1cf71da07d5495aa2`;
  it now tracks the matching origin branch with the bounded approval
  implementation at `8e73cd038d50037a40cad27ee9f2e37b6e363b69`.
- Scope: Walk W1-W4, Attack A1-A4, Hurt H1-H2, Cast C1-C4, and Death D1-D4
  across Down, Left, Right, and Up. Approved Idle F1-F2 remains byte-exact.
- Motion sources: approved Steppe Hunter Walk, Attack, and Hurt rigs remain
  byte-exact and supply the four-hoof gait, spear lunge, and full-hybrid recoil.
  The approved Banner Khan identity follows those poses, Walk adds alternating
  horse-torso response, and a saddle standard keeps the flag connected while
  the separate lance attacks.
- Alias contract: Cast C1-C4 equals Banner Khan Attack A1-A4 frame-for-frame;
  Death D1-D4 equals Banner Khan Hurt H1,H2,H2,H2. No Cast/Death sprite pixels
  are authored.
- Preservation: focused validation confirms Banner Khan Idle `8/8`, Steppe
  Walk `16/16`, Steppe Attack `16/16`, and Steppe Hurt `8/8` exact; candidate
  frames `80/80`, connected hard-alpha silhouettes `80/80`, side mirrors
  `20/20`, Cast aliases `16/16`, Death aliases `16/16`, and public EN-E03
  families `0`.
- Frozen candidate evidence: raw board
  `9c7c46c88ab06d799d0fb4f59ed1befad1e3cc404b37e52f78c9f8494344f233`,
  Complete B + Form board
  `d55d32032589fdcbf3587b65aa395dbcf2d68f19c2fb6ec9813465fbac6113d9`,
  raw GIF
  `0c875b122fd3d567f7abb779e4ae589250a7e6cdce7546abc0d21afb11fc941f`,
  Complete B + Form GIF
  `a3aa055e19301a1b6586d5ba8fcda32f96b8ecce01f9c693cbb678779a903e6d`,
  and 80-frame digest
  `0dbd24f50ad7825d9d7860e114ec585b9fd716047c3c993f70f95b26c7bfccc0`.
- Approval presentation: both exact labeled all-four-direction `640x672`
  four-phase GIFs were shown together: raw/no-outline and Complete B + Form.
  Focused and full repository gates pass; the full gate completed in `186.3`
  seconds with all 232 public fixture sheets unchanged.
- Publication is complete at approved implementation checkpoint
  `8e73cd038d50037a40cad27ee9f2e37b6e363b69`.
- Required next action: stop and wait for separate explicit designer
  authorization. No later gate is authorized by this approval.
- Exclusions: approved Idle changes, Steppe source changes, other variants,
  registration, consumers, baked command/banner/hoof effects, release, and
  later EN-E03 work.

#### Reed Charmer specialist Idle approved

- Gate ID: `en-e03-reed-charmer-idle-v1`; status: `approved`, internal,
  non-public, committed, and pushed at
  `070f85b20c4ea77a75e35eb6d9eefd697f4b0b47`.
- Authorization evidence: after Banner Khan grouped motion was approved,
  published, and reconciled, the designer said `cool lets do next`. Following
  the documented family and role order, this authorizes Reed Charmer specialist
  Idle F1-F2 only.
- Approval evidence: the designer reviewed both exact labeled all-four-direction
  raw/no-outline and Complete B + Form GIFs together and said `Approved` on
  2026-08-08. Approval applies only to the frozen hashes below and authorizes
  bounded publication of this internal lane, not later work.
- Isolated branch/worktree: `codex/en-e03-reed-charmer-idle` at
  `C:\tmp\8-bit-sprite-assembler-en-e03-reed-charmer-idle`, based exactly on
  corrected published Banner Khan checkpoint `c324e44`.
- Scope: Idle F1-F2 across Down, Left, Right, and Up. Approved Briar Reveler
  remains byte-exact and supplies the horned head, tail, digitigrade legs,
  split-hoof contacts, and two-frame settle.
- Identity: the crooked staff is omitted only for the specialist. A compact
  direction-aware panpipe, connected playing hands, teal woven vest, and gold
  sash create the Reed Charmer read without music-note or charm-radius pixels.
- Motion: F2 moves the torso, vest, instrument, and hands down one row while the
  approved tail flick, hock articulation, and four grounded split-hoof tips
  continue. Music notes, pollen motes, charm rings, and all controller effects
  remain external.
- Preservation: focused validation confirms approved Briar Reveler `8/8`, Reed
  Charmer `8/8`, connected hard-alpha silhouettes `8/8`, split-hoof contact rows
  `8/8`, exact side mirrors `4/4`, 185 changed-alpha pixels, 164 reed/sash
  pixels, 112 teal-vest pixels, 888 Complete B additions, 984 Form changes,
  zero baked effects, and public EN-E03 families `0`.
- Frozen candidate evidence: raw board
  `a3459b3ed67dbe795bc2af3b55dd837aa91c4d880c941a3eedc0e791807e9b3a`,
  Complete B + Form board
  `a8fb2c1af35060551d6c66dde7137ace9736291beea57f9413d588faa75eb0b0`,
  raw GIF
  `603ac763a9c739728132d96fa30b2cfaf5ee9fe363568da841605526f40f01ca`,
  Complete B + Form GIF
  `0acdf25022c8cae2ffa456780f5497fbcc19b54feefd3aa7fbf908ec1698afa3`,
  and eight-frame digest
  `b9ade755388cbfaad742dd0323c9c11f3ac0e5943bbe2608f146a520f606dfbf`.
- Approval and validation: both exact labeled all-four-direction `192x224`,
  two-frame raw/no-outline and Complete B + Form GIFs were reviewed together.
  The focused gate and full `npm.cmd run check` pass; the full gate finished in
  `184` seconds with all 232 public fixture sheets unchanged.
- Publication is complete at approved implementation checkpoint
  `070f85b20c4ea77a75e35eb6d9eefd697f4b0b47`.
- Required next action: stop and wait for separate explicit designer
  authorization. No later gate is authorized by this approval.
- Exclusions: Briar Reveler pixel changes, Wildwood Hornlord, later animation,
  Giant/Centaur changes, baked music/pollen/charm effects, registration,
  consumers, release, and later EN-E03 work.

#### Reed Charmer complete motion approved and published

- Gate ID: `en-e03-reed-charmer-motion-v1`; status: `approved`, internal,
  non-public, committed, and pushed.
- Authorization evidence: after the exact Reed Idle pair was approved,
  published, and reconciled, the designer said `Sure lets go for it one complete
  motion suite we can try atleast`. This authorizes one Reed Charmer suite only.
- Approval evidence: the designer reviewed both exact labeled all-four-direction
  raw/no-outline and Complete B + Form motion-suite GIFs together and said
  `Approved` on 2026-08-08.
- Isolated branch/worktree: `codex/en-e03-reed-charmer-motion` at
  `C:\tmp\8-bit-sprite-assembler-en-e03-reed-charmer-motion`, based exactly on
  clean published Reed Idle handoff `ef98e7c`, tracking the matching origin
  branch.
- Scope: approved Idle F1-F2 plus Walk W1-W4, Attack A1-A4, Cast C1-C4, Hurt
  H1-H2, and Death D1-D4 across all four directions. Idle delegates exact; Cast
  aliases Attack frame-for-frame; Death aliases Hurt H1,H2,H2,H2.
- Motion and identity: approved Satyr gait, attack shifts, Hurt recoil, horns,
  tail, hocks, and split hooves combine with the frozen Reed pipe, connected
  hands, teal vest, and gold sash. The torso, pipe, vest, hands, legs, and tail
  participate; music notes, pollen, charm rings, and controller effects remain
  external.
- Preservation: approved Reed Idle `8/8`, Briar Walk `16/16`, Attack `16/16`,
  and Hurt `8/8` remain exact. The candidate validates `80/80` connected
  hard-alpha frames, `20/20` side mirrors, `16/16` Cast aliases, `16/16` Death
  aliases, 1,476 reed-pipe pixels, 1,008 teal-wrap pixels, 9,157 Complete B
  additions, 8,062 Form changes, and public EN-E03 families `0`.
- Frozen evidence: raw board
  `7908c42c852e3cde553152a56d1678241559f1aab693f5919f33d97a23ea74f7`,
  Complete B + Form board
  `8b114f22f590c00eb3604d1eb61198e2fb7a6137dccd96aaa2fa3109e9dec104`,
  raw GIF
  `b1d62bd3ba846b819ff331b568713f07b4c5170dec56cb68e7fbf759d69e9266`,
  Complete B + Form GIF
  `6e509894fb8ba34faa2c31cd20abc328b5cd738b6b017cee9f82858d74079182`,
  and 80-frame digest
  `031b4e419e339c416fb43be36641048f89cdfbb255e01d7e6306555c3dc50231`.
- Approved review: both exact paired `640x672`, four-phase raw/no-outline and
  Complete B + Form motion-suite GIFs were reviewed together. Full repository
  validation passes in `187.1s`, including all 232 validated PNG sheets.
- Publication is complete at approved implementation checkpoint
  `f77c8a88b25cb59f5bdbe82708a620e5cae3fe9d`.
- Required next action: stop and wait for separate explicit designer
  authorization. No later gate is authorized by this approval.
- Exclusions: approved Reed Idle changes, Briar changes, Wildwood Hornlord,
  Giant/Centaur changes, new Cast/Death pixels, baked music/pollen/charm effects,
  registration, consumers, release, and later EN-E03 work.

#### Wildwood Hornlord elite Idle approved and published

- Gate ID: `en-e03-wildwood-hornlord-idle-v1`; status: `approved`, internal,
  non-public, committed, and pushed.
- Authorization evidence: after Reed Charmer complete motion was approved,
  published, and reconciled, the designer said `Awesome let's do next`.
  Following the Satyr common/specialist/elite role order, this authorizes only
  Wildwood Hornlord Idle F1-F2 across four directions.
- Approval evidence: the designer reviewed both exact labeled all-four-direction
  raw/no-outline and Complete B + Form Idle GIFs together and said `Approved
  lets do next` on 2026-08-08.
- Isolated branch/worktree: `codex/en-e03-wildwood-hornlord-idle` at
  `C:\tmp\8-bit-sprite-assembler-en-e03-wildwood-hornlord-idle`, based exactly
  on clean published Reed handoff `629bccd`, tracking the matching origin
  branch.
- Scope: Idle F1-F2 in Down, Left, Right, and Up. Briar Reveler and Reed Charmer
  remain exact; Walk/Attack/Cast/Hurt/Death are rejected by the candidate
  registry.
- Identity and motion: the approved Satyr horns, tail, hocks, digitigrade legs,
  and split hooves combine with an oversized branching antler crown, sculpted
  bark pauldrons, a moss mantle, bracers, and amber torque. F2 settles the elite
  upper identity one row while the approved tail/hock/hoof cycle remains
  grounded. Thorn aura, leaf swirl, root burst, and controller effects stay
  external.
- Preservation and focused gate: approved Briar Idle `8/8`; candidate `8/8`;
  connected hard-alpha silhouettes `8/8`; exact hoof-contact rows `8/8`; side
  mirrors `4/4`; 219 changed-alpha pixels; 132 branching-antler pixels; 188
  moss pixels; 268 bark/torque pixels; 980 Complete B additions; 991 Form
  changes; baked effects `0`; public EN-E03 families `0`.
- Frozen evidence: raw board
  `7f3a1280c40652ca183dffd73379d3c43807248b6a40af866d91fd6420d1e2d3`,
  Complete B + Form board
  `b62244e9c953517c4af58ef22040754df9e6911f5a16d95ac42ac467d51fc779`,
  raw GIF
  `ee5f3eb354b4ca5080b2d8f4e2a05f6e50e6b87ebe7af3026309f32c092bbeef`,
  Complete B + Form GIF
  `890d249db2e398da3332f1b9d07ade758964fb530830c57c0d2c6d2fcb757b72`,
  and eight-frame digest
  `a8cebf48ac2506321a546c17293cae5035f8c856139136b63b393bcfbd59207a`.
- Approval record: the exact paired `192x224`, two-frame raw/no-outline and
  Complete B + Form all-four-direction GIFs were reviewed together. Full
  repository validation passes in `187.6s`, including all 232 validated PNG
  sheets, and exact Aseprite board inspection is complete.
- Exclusions: approved Briar/Reed changes, later Wildwood motion, baked
  thorn/leaf/root effects, registration, consumers, release, and later EN-E03
  work.
- Publication is complete at approved implementation checkpoint
  `aa96e170c41cbcb49c7ac1bd979114b3b5bfa7e4`.
- Required next action: open the next isolated Wildwood complete-motion art gate
  requested by the same approval message.

#### Wildwood Hornlord complete motion approved and published

- Gate ID: `en-e03-wildwood-hornlord-motion-v1`; status: `approved`, internal,
  non-public, committed, and pushed.
- Authorization evidence: after approving the exact paired Wildwood Idle GIFs,
  the designer said `Approved lets do next`. Following the accepted grouped
  motion pattern, this authorizes one complete Wildwood suite only.
- Approval evidence: the designer reviewed both exact labeled all-four-direction
  raw/no-outline and Complete B + Form motion-suite GIFs together and said
  `Approved` on 2026-08-08.
- Isolated branch/worktree: `codex/en-e03-wildwood-hornlord-motion` at
  `C:\tmp\8-bit-sprite-assembler-en-e03-wildwood-hornlord-motion`, based exactly
  on clean published Wildwood Idle handoff `4c59c32`, tracking the matching
  origin branch.
- Scope: exact approved Idle F1-F2 plus Walk W1-W4, Attack A1-A4, Cast C1-C4,
  Hurt H1-H2, and Death D1-D4 across Down, Left, Right, and Up. Cast aliases
  Attack; Death aliases Hurt H1,H2,H2,H2.
- Motion: reverse-jointed Walk moves the crown, armor, mantle, torso, tail,
  hocks, and hooves. Attack has brace, lift, forward-drive, and recovery phases.
  Hurt flashes the complete silhouette and returns to a planted colored brace.
- Preservation and focused gate: approved Idle `8/8`; approved Briar Walk
  `16/16`, Attack `16/16`, Hurt `8/8`; candidate `80/80`; connected hard-alpha
  silhouettes `80/80`; side mirrors `20/20`; Cast/Death aliases `16/16` each;
  opaque range 177-239; public EN-E03 families `0`.
- Frozen evidence: raw board
  `95f92b325d4b7a465ffd50e5dbf11c1b07c3fd941f5bf778433e31872d896f48`,
  Complete B + Form board
  `a129d01a91160bf73d999f39379fc379c4da8312da5cccdd17072af1917a131f`,
  raw GIF
  `22845dd24a64c9674fed979ebf91ee7505818fdad5c80c292b7195c0ea371a0b`,
  Complete B + Form GIF
  `eba94e2f22522fa352204ba8c944fa9b87773b07895e9afeae2efdaaad7fa747`,
  and 80-frame digest
  `a0ac53b0ba66feeda9ef5251aa10b1aac962af4428a6f09ba84051fa630989b3`.
- Approved review: the exact paired `640x672`, four-phase raw/no-outline and
  Complete B + Form all-four-direction GIFs were reviewed together. Full
  repository validation passes in `203.7s`, including all 232 validated PNG
  sheets. Both exact boards were opened in Aseprite and cross-checked at
  original resolution.
- Exclusions: approved Wildwood Idle/Briar/Reed changes, new Cast/Death pixels,
  baked thorn/leaf/root effects, registration, consumers, release, and later
  EN-E03 work.
- Publication is complete at approved implementation checkpoint
  `d9cb0faa3dff204106598876fe38db5f4ee3237a`.
- Required next action: stop and wait. No later gate is authorized by this
  approval.

### EN-E04 - Serpentine, aquatic, and avian peoples

- Status: `active - assembler consumer integration published; wait for the next authorized slice`
- Families: Naga, Merfolk, Birdfolk
- Priority-first: Naga
- Approved gate: Naga Coilguard common Idle F1-F2 across Down, Left, Right, and Up
- Approved gate: Naga Coilguard complete motion across Down, Left, Right, and Up
- Approved gate: combined Naga Venom Oracle complete motion plus Temple Rajah Idle F1-F2 across Down, Left, Right, and Up
- Approved gate: Temple Rajah complete motion across Down, Left, Right, and Up; published
- Approved gate: Merfolk Tideguard complete motion across Down, Left, Right, and Up; published
- Approved gate: Merfolk Reefcaller complete specialist motion across Down, Left, Right, and Up; published
- Approved gate: Merfolk Pearl Regent complete elite motion across Down, Left, Right, and Up; published
- Approved gate: Birdfolk Aerie Scout complete common motion across Down, Left, Right, and Up; published
- Approved gate: Birdfolk Gale Augur complete specialist motion across Down, Left, Right, and Up; published
- Approved gate: Birdfolk Stormcrown Exarch complete elite motion across Down, Left, Right, and Up; published
- Approved gate: complete nine-enemy EN-E04 stable registration; published
- Approved gate: generic assembler consumer integration for all nine EN-E04 enemies; implemented

| Family | Common | Specialist | Elite |
| --- | --- | --- | --- |
| Naga | Coilguard | Venom Oracle | Temple Rajah |
| Merfolk | Tideguard | Reefcaller | Pearl Regent |
| Birdfolk | Aerie Scout | Gale Augur | Stormcrown Exarch |

Shared leverage: non-human lower bodies and upright equipment anchors. Naga and
Merfolk must not fake ordinary feet in side views. Birdfolk must remain an
upright avian person rather than collapse into the existing Harpy identity.

#### Naga Coilguard common Idle approved

- Gate ID: `en-e04-naga-idle-v1`; status: `approved`, internal, non-public,
  committed, and pushed.
- Authorization: after Wildwood Hornlord complete motion was approved,
  published, and reconciled, the designer said `Let's do next` on 2026-08-08.
  The EN-E04 priority order bounds that continuation to Naga first; Codex
  further bounded the first new-anatomy gate to common Coilguard Idle F1-F2.
- Approval: the designer reviewed both exact labeled all-four-direction
  raw/no-outline and Complete B + Form Coilguard Idle GIFs together and said
  `Approved` on 2026-08-08.
- Worktree/branch: `C:\tmp\8-bit-sprite-assembler-en-e04-naga-idle` on
  `codex/en-e04-naga-idle`, based exactly on clean published Wildwood handoff
  `8c4edba3fa9460d1afdd4409239f35c6078a7534`.
- Contract: a humanoid upper-body foundation flows into a jade cobra hood,
  plated serpent body, and one continuous direction-aware ground coil. Every
  lower-body scanline remains a single run; ordinary legs, paired feet, and
  detached foot-like islands are forbidden.
- Motion: F2 settles the hood/torso one row and visibly compresses the planted
  coil without separating the body. Venom spit, miasma, coil-impact, and all
  other effects stay external.
- Planned only: Venom Oracle specialist and Temple Rajah elite have names and
  briefs but no candidate renderer. Merfolk and Birdfolk remain untouched.
- Frozen evidence: raw / Complete B + Form boards
  `14edaceb75bce787da88b065ac435e611dd3b03b1eaf07320f0f6b476021c211` /
  `d4af682862093704497f285e4163e5e7b36a056fadd16e5079a4dd89b4f63bc0`;
  raw / Complete B + Form GIFs
  `70a85f3ab1b94b6207acb161d2a2de93e4ec925748c399b2c1ce6a0075db69ea` /
  `ded49cd18d9706c741315ec61b9a219012e4e39d50618a79b60ea91bc592528b`;
  eight-frame digest
  `037ed99a5c9d126d175fe3339fdb9f6443e092d0c0faf6bea6aa5f5c8a72c128`.
- Focused gate passes all eight connected frames, all 64 lower-body continuity
  rows, eight broad single-coil contacts, four exact side mirrors, 158 changed
  alpha pixels, 764 Complete B additions, 1,172 Form changes, zero baked
  effects, and zero public EN-E04 families.
- Post-approval full `npm.cmd run check` passes in `241s`, including all 232 public PNG
  sheets. Both exact frozen boards were opened in Aseprite at original
  resolution after the F2 junction repair.
- Publication is complete at approved implementation checkpoint
  `bd920c206d692bcc5e7b043614dcf6a03db2174c`.
- The prior stop boundary was superseded only by the designer's explicit request
  to check out `codex/en-e04-naga-idle` and continue this lane. That continuation
  is bounded to the Coilguard complete-motion gate below.

#### Naga Coilguard complete motion approved

- Gate ID: `en-e04-naga-coilguard-motion-v1`; status:
  `approved`, internal, non-public, committed, and pushed.
- Live branch: `codex/en-e04-naga-motion` in the current v2 checkout. Approved
  source `codex/en-e04-naga-idle` remains frozen at `26151e1`; checkpoint
  `a81d324` contains only the v2 workflow integration, and the branch tracks its
  matching origin branch.
- Authorization: the designer explicitly asked Codex to check out the approved
  Naga Idle branch and continue the enemy-expansion lane, then identified
  `tilok1234/Assesment` as the current v2 repository. This activates one complete
  Coilguard motion suite only.
- Approval: the designer reviewed both exact labeled all-four-direction
  raw/no-outline and Complete B + Form motion-suite GIFs together and said
  `approved` on 2026-08-08.
- Scope: approved Idle F1-F2 delegates byte-for-byte. The approved suite adds Walk
  W1-W4, Attack A1-A4, Hurt H1-H2, Cast as an exact Attack alias, and Death as
  exact Hurt aliases `H1,H2,H2,H2` across all four directions.
- Motion contract: four planted slither phases; coil brace, cobra rise, forward
  strike, and recovery; then a complete-silhouette white Hurt recoil and colored
  braced recovery. All 640 lower-body scanlines remain single continuous runs,
  with no legs, paired feet, or detached islands.
- Frozen candidate evidence: raw / Complete B + Form boards
  `c07dd2284c86e4ded62afb9f7124003d471445a7ee910ca746d55e41c7ac6e54` /
  `e8d5d915cfcc4ca3688ded2b61d2d32a11edfb6976b874a1300cf789d3e829ab`;
  raw / Complete B + Form GIFs
  `74732f35384ecaef63e9131082d95444f401ebb498e1e2a37b82e16c770a1dc0` /
  `b5a7f20bcf88adefe82d17459b1663b8841ea17aba71cad2a7a1eb81fa455dca`;
  80-frame digest
  `f94b2c647275c9ab7d79433e29fa37f37285c2a203ad87be6631efbb02642c0b`.
- Focused validation passes all 80 connected hard-alpha frames, all 640
  continuous lower-body rows, 20 exact side mirrors, 16 Cast aliases, 16 Death
  aliases, 7,714 Complete B additions, 11,232 Form changes, and zero public
  EN-E04 families. The cleaned v2 fast gate passes with all 232 public PNG
  sheets unchanged.
- Both exact boards were inspected and opened in Aseprite at original
  resolution. Full `npm.cmd run check` also passes in `121.9s` with all 232
  public PNG sheets unchanged.
- Exclusions: approved Idle pixel changes, Venom Oracle, Temple Rajah, Merfolk,
  Birdfolk, new Cast/Death pixels, baked venom/miasma/coil-impact pixels,
  registration, consumers, effects, release, and later EN-E04 work.
- Publication is complete at approved implementation checkpoint
  `f47e1691208236f5d245a1f3b9b15355ad479790`.
- The prior stop boundary was superseded only by the designer's later `lets do
  next`; that continuation is bounded to the Venom Oracle specialist Idle gate
  below.

#### Naga Venom Oracle specialist Idle approved and published

- Gate ID: `en-e04-venom-oracle-idle-v1`; status:
  `approved`, internal, non-public, committed, and pushed.
- Live branch: `codex/en-e04-venom-oracle-idle` in the current v2 checkout,
  based on clean reconciled Coilguard motion handoff
  `eddc243e7711f357cb62e40920c83cf066dfc790`.
- Authorization: after Coilguard complete motion was approved, published, and
  reconciled, the designer said `lets do next` on 2026-08-08. Naga role order
  bounds this gate to Venom Oracle specialist Idle F1-F2 only.
- Approval: the designer reviewed both exact labeled all-four-direction
  raw/no-outline and Complete B + Form Venom Oracle Idle GIFs together and said
  `ye approved` on 2026-08-08.
- Contract: approved Naga hood, continuous serpent body, and planted coil are
  preserved. A connected ritual crown/jewel, violet mantle, gold oracle sigil,
  and venom-bright eyes/sigil distinguish the specialist without baking venom,
  miasma, ritual-circle, prophecy, or impact effects into actor pixels.
- Scope: two Idle frames across Down, Left, Right, and Up. Coilguard motion,
  Venom Oracle motion, Temple Rajah, Merfolk, Birdfolk, registration, consumers,
  effects, release, and later EN-E04 work are excluded.
- Frozen candidate evidence: raw / Complete B + Form boards
  `5181c4f209fcde7a941cc49c9ce9388ff30898a75810c5a83be58447db1eb661` /
  `54b68a4433daf84cb5ccbe4a7b9c0b4656d5b1a903b8e3a0f7cb8925af1f7862`;
  raw / Complete B + Form GIFs
  `c031f6ac6260e98bc10ccda3101262fbb1f61471fdccccd53cbb1fd72ee474d4` /
  `ec27da68fecfb8612adb35e29b51f624ce3a7b6bd25635b01ab954cb37077ac1`;
  eight-frame digest
  `2df5c53f3b6636f2918d4620a3419ee0465ecc57f68d5f8506b5c9e79e862228`.
- Focused validation passes all eight connected hard-alpha frames, all 64
  continuous lower-body rows, eight byte-exact approved Coilguard tail regions,
  four exact side mirrors, 490 specialist-changed pixels, 90 connected crown
  additions, 758 Complete B additions, 953 Form changes, zero baked effects,
  and zero public EN-E04 families. Both protected Coilguard gates also pass.
- The cleaned v2 fast gate passes in `67.1s`; final pre-commit
  `npm.cmd run check` passes in `148.4s`, with all 232 public PNG sheets unchanged. Both exact boards were
  opened in Aseprite and both GIF phases were inspected directly.
- Publication is complete at approved implementation checkpoint
  `3365d9915ed0ac1e506470604ed1e83c84606181`.
- The prior stop boundary was superseded only by the designer's explicit `sure
  lets do that`, authorizing the combined Venom-motion and Rajah-Idle gate below.

#### Expanded Naga Venom motion plus Temple Rajah Idle approved and published

- Gate ID: `en-e04-venom-motion-rajah-idle-v1`; status:
  `approved`, internal, non-public, committed, and pushed.
- Live branch: `codex/en-e04-venom-motion-rajah-idle` in the current v2 checkout,
  based exactly on clean Venom Oracle Idle reconciliation `2e14485`; the
  approved specialist implementation remains frozen at
  `3365d9915ed0ac1e506470604ed1e83c84606181`.
- Authorization: after approving Venom Oracle Idle, the designer asked to try
  bigger slices. Codex proposed one combined 88-frame checkpoint containing
  Venom Oracle complete motion plus Temple Rajah Idle F1-F2, and the designer
  said `sure lets do that` on 2026-08-08.
- Approval: the designer reviewed both exact combined labeled all-four-direction
  raw/no-outline and Complete B + Form GIFs, located Temple Rajah in the bottom
  `R IDLE` row, and said `oh right sorry i had to scroll down approved` on
  2026-08-08.
- Scope: the 80-frame Venom suite delegates approved Idle `8/8`, adds Walk
  W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast aliases, and exact Death aliases
  `H1,H2,H2,H2`. Temple Rajah adds only 8 Idle frames across four directions.
- Motion/identity: Venom retains the violet mantle, venom jewel, gold sigil, and
  crown through the approved planted slither/strike/Hurt choreography. Upward
  phases brace the crown at the one-cell ceiling. Rajah adds a connected
  crimson-and-gold crown, gilded pauldrons, ivory chest plate, and royal sash
  jewel while preserving approved tail rows 17-23 byte-for-byte.
- External effects: venom/miasma/ritual/prophecy effects plus command auras,
  royal sigils, sun flares, temple wards, and coil impacts remain outside actor
  pixels. Both baked-effect arrays are empty.
- Exclusions: approved Coilguard and Venom Idle pixel changes, Temple Rajah
  motion, Merfolk, Birdfolk, new Cast/Death pixels, registration, consumers,
  effects, release, and broader EN-E04 work.
- Frozen candidate evidence: raw / Complete B + Form boards
  `9221b2b10230b9de58f26b0548eac445921e8531baec59b404a9bd04227c5ba5` /
  `da4d837e6d25a110fd6e2297687fda852d8a71b024d6748674c299eaacb26594`;
  raw / Complete B + Form GIFs
  `0be77ec47d6e3bdc701034b8d69aa3e1597b6b92cf8c51a1d1d725c330ce0f4b` /
  `272bc1b139d51fac8383a1a103c0aa545ca97893bf1774fadd6adaeba88deb6c`;
  88-frame digest
  `81a087b81df560f7676024484114b550d02ce5c6424f040f4c1765f2231a4e77`.
- Focused validation passes approved Venom Idle `8/8`, Venom suite `80/80`,
  Rajah Idle `8/8`, connected hard-alpha silhouettes `88/88`, continuous
  no-feet rows `704/704`, exact side mirrors `22/22`, Cast aliases `16/16`,
  Death aliases `16/16`, 8,400 Complete B additions, 10,478 Form changes, and
  zero public EN-E04 families. All three protected Naga gates also pass.
- The cleaned v2 fast gate passes in `65s`; full `npm.cmd run check` passes in
  `153.2s`, with all 232 public PNG sheets unchanged. All four raw/Complete
  phases were inspected, and both exact boards were opened in Aseprite.
- Publication is complete at approved implementation checkpoint
  `4fd887f0a174169d47f9f3bee3f98d92c2ffaf30`.
- Required next action: stop before Rajah motion, Merfolk/Birdfolk,
  registration, integration, effects, release, or broader EN-E04 work. Any
  continuation requires a new explicit authorization.

#### Temple Rajah complete motion approved and published

- Gate ID: `en-e04-temple-rajah-motion-v1`; status:
  `approved`, internal, non-public, committed, and pushed.
- Live branch: `codex/en-e04-rajah-motion` in the current v2 checkout, based
  exactly on clean combined-slice reconciliation
  `c92ee12339f38fd99e8fa87e202b50f69b89c187`; the approved implementation it
  extends remains frozen at `4fd887f0a174169d47f9f3bee3f98d92c2ffaf30`.
- Authorization: after approving the combined pair, the designer said
  `very good lets do another similar sized slice` on 2026-08-08. Codex bounded
  that continuation to one comparable 80-frame Temple Rajah suite rather than
  crossing into a new Merfolk anatomy.
- Approval: the designer reviewed both exact labeled all-four-direction
  raw/no-outline and Complete B + Form Temple Rajah motion-suite GIFs together
  and said `approved, lets keep going with slices like this,, maybe a full enemy
  with all its animations is a good spot` on 2026-08-08.
- Scope: approved Temple Rajah Idle `8/8` delegates byte-for-byte. The candidate
  adds Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast aliases, and exact Death
  aliases `H1,H2,H2,H2` across all four directions.
- Motion/identity: the approved planted Naga choreography carries Rajah's tall
  crimson-and-gold crown, broad gilded pauldrons, ivory chest plate, and royal
  sash through slither, brace, rise, strike, recovery, and Hurt phases. The
  crown retains a one-cell ceiling and tail rows 17-23 remain byte-exact with
  the matching approved Coilguard motion source.
- External effects: command auras, royal sigils, sun flares, temple wards, coil
  impacts, and all other effects remain outside actor pixels; baked effects are
  empty.
- Exclusions: approved Rajah Idle, Coilguard, and Venom Oracle pixel changes;
  Merfolk; Birdfolk; new Cast/Death pixels; registration; consumers;
  integration; effects; release; and broader EN-E04 work.
- Frozen candidate evidence: raw / Complete B + Form boards
  `be72a70e3965675b409ebf736e1448596d9cbeaf9fc2a59b97c8018f0430917b` /
  `eed016625754ca5d675bd34eaa3936de3eeaaca73d7652d01dd52e06910a25ea`;
  raw / Complete B + Form GIFs
  `8396d98941c7abd8419758d13988acdfdeacc0f8567fae2f6ac42cfb094898ec` /
  `c3199fecb9d20b969a1a23f3fa4b9892268a9f606604dc22f6b044a58b2fcf21`;
  80-frame digest
  `9f240fde4224597a94146448a698a57e573eebf966165fddbf2bd51c6d39fe2f`.
- Focused validation passes approved Idle `8/8`, suite frames `80/80`, connected
  silhouettes `80/80`, hard-alpha frames `80/80`, continuous no-feet rows
  `640/640`, exact side mirrors `20/20`, Cast aliases `16/16`, Death aliases
  `16/16`, 7,644 Complete B additions, 10,633 Form changes, and zero public
  EN-E04 families. All four protected predecessor gates also pass.
- The cleaned v2 fast and full gates pass with all 232 public PNG sheets
  unchanged.
- Publication is complete at approved implementation checkpoint
  `38b56f316a3fa12443b5b9fb003e74dc7e8059aa`.
- Required next action: the same approval authorizes one separate full-enemy,
  all-animation slice. Keep it internal and approval-gated; registration,
  integration, effects, release, and broader multi-enemy work remain outside.

#### Merfolk Tideguard full enemy approved and published

- Gate ID: `en-e04-merfolk-tideguard-full-v1`; status:
  `approved`, internal, non-public, committed, and pushed.
- Live branch: `codex/en-e04-merfolk-tideguard` in the current v2 checkout,
  based exactly on clean Rajah reconciliation
  `b9e597fa53b0da32633cec8cdc3c46348b92562f`; the approved Rajah
  implementation remains frozen at
  `38b56f316a3fa12443b5b9fb003e74dc7e8059aa`. The approved Tideguard
  implementation is committed and pushed at
  `622b00f0c40eed552f61b30bd207b5ad8478836e`.
- Authorization: while approving the exact Rajah raw plus Complete B + Form
  pair, the designer said `approved, lets keep going with slices like this,,
  maybe a full enemy with all its animations is a good spot` on 2026-08-08.
  Codex bounded the continuation to one 80-frame common Tideguard only.
- Approval: the designer reviewed both exact labeled all-four-direction
  raw/no-outline and Complete B + Form Merfolk Tideguard full-suite GIFs
  together and said `approved` on 2026-08-09.
- Scope: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast aliases,
  and exact Death aliases `H1,H2,H2,H2` across Down, Left, Right, and Up.
- Anatomy/identity: one continuous humanoid-to-piscine silhouette, one fused
  scaled tail, one broad connected fluke, no ordinary legs or paired feet;
  sea-green skin/scales, dark-blue tide armor and fins, coral knots, bronze
  shell fittings, pale belly plates, and a pearl highlight define Tideguard.
- Motion: two planted Idle breaths, four distinct grounded fluke sweeps, four
  full-body brace/rise/lunge/recovery Attack phases, and two planted Hurt
  phases. H1 flashes the complete silhouette white. Cast/Death introduce no
  new actor pixels beyond their exact aliases.
- External effects: water bolts, tide arcs, bubbles, foam, splashes, undertow
  rings, and impacts remain outside actor pixels; baked effects are empty.
- Exclusions: Merfolk specialist/elite, Birdfolk, new Cast/Death pixels,
  registration, consumers, integration, effects, release, later EN-E04 work,
  and every multi-enemy expansion.
- Frozen candidate evidence: raw / Complete B + Form boards
  `1cf9fabcbde77969f1d8d64ad31c3f788544b7ae082a1bd6f8c2db3c67bc67a6` /
  `0b5fe262f65ea45627fb50723049c560ae9675a0005a1dd963fa46d3049fdf0f`;
  raw / Complete B + Form GIFs
  `f01c7c11a541aa45685bbb4f607efbaa3098b44bfb4b0f105ce2bcfddf72045e` /
  `acbf6b73c88770edbafd95470173344b0321d6075ea3e90675a4e11d59bd32d4`;
  80-frame digest
  `a0ebbb04e5d9a47959be09231fe2ac37e8c5ec0ec278d6434b1732d712eaac90`.
- Focused validation passes suite frames `80/80`, connected hard-alpha
  silhouettes `80/80`, continuous fused-tail rows `640/640`, broad connected
  flukes `80/80`, exact side mirrors `20/20`, Cast aliases `16/16`, Death
  aliases `16/16`, 7,058 Complete B additions, 6,113 Form changes, and zero
  public EN-E04 families. All five protected predecessor gates also pass.
- The v2 fast gate passes; final pre-commit `npm.cmd run check` passes in
  `121.2s` with all
  232 public PNG sheets unchanged.
- Publication is complete at approved implementation checkpoint
  `622b00f0c40eed552f61b30bd207b5ad8478836e`.
- Required next action: stop. Later roles/families, registration, integration,
  effects, release, and broader work require separate explicit authorization.

#### Merfolk Reefcaller full specialist approved and published

- Gate ID: `en-e04-merfolk-reefcaller-full-v1`; status:
  `approved`, internal, non-public, committed, and pushed.
- Live branch: `codex/en-e04-merfolk-reefcaller`, based exactly on clean
  Tideguard reconciliation `6594b2e01bd639997ace424c6a8427ac307196b4`;
  approved Tideguard remains frozen at
  `622b00f0c40eed552f61b30bd207b5ad8478836e`. The approved Reefcaller
  implementation is committed and pushed at
  `b315a32aa48d8881efe23e9d5b8553e6c0fb6b79`.
- Authorization: after Tideguard approval/publication, the designer said
  `lets do next` on 2026-08-09. EN-E04 role order advances common to specialist;
  Codex named and bounded one complete Reefcaller specialist only.
- Approval: after first identifying one missing red side-eye pixel and then the
  remaining black source-eye pixel, the designer reviewed the final regenerated
  raw and Complete B + Form pair with both visible eye pixels coral-red and said
  `approved` on 2026-08-09.
- Scope: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast aliases,
  and exact Death aliases `H1,H2,H2,H2` across Down, Left, Right, and Up.
- Source/anatomy: all motion delegates approved Tideguard. Tail rows 16-23 are
  byte-exact in `80/80` frames; all lower rows remain one connected fused-tail
  run ending in the approved broad fluke.
- Identity: connected coral crown, violet reef mantle, pearl chest/crown sigil,
  gold shell clasps, luminous aqua fin marks, and approved sea-green tail. A
  one-cell ceiling brace repairs the tall crown during rise/recoil; the
  side-eye repair preserves both visible eye pixels in coral red across all 36
  colored Left/Right frames (`72/72` eye pixels).
- External effects: healing currents, reef sigils, bubble spirals, coral
  growth, water bolts, tide arcs, foam, splashes, undertow rings, and impacts
  remain outside actor pixels; baked effects are empty.
- Exclusions: approved Tideguard changes, Merfolk elite, Birdfolk, new
  Cast/Death pixels, registration, consumers, integration, effects, release,
  later EN-E04 work, and every multi-enemy expansion.
- Frozen candidate evidence: raw / Complete B + Form boards
  `c9d3097c543d407f4c700a9631d9046e7ff1e756ab91fb930b51af931326c5fe` /
  `2df2948b30c3efb89aff386fb558126fe3f478d157d83390cdd3a02adcd88c43`;
  raw / Complete B + Form GIFs
  `7d57aeaceca0ce5bc85b7a0b1fbafc9ff5889c1add9a946f4a7b8a2b8eb075c8` /
  `f79945414fd1357b328a2d1af5685517d20c1a7f706a0c1939231b07a446cd24`;
  80-frame digest
  `fc223d0b944152c18481acfe4a775936b5da5659666edb0d35726eef5c6228f7`.
- Focused validation passes suite frames `80/80`, connected hard-alpha
  silhouettes `80/80`, continuous fused-tail rows `640/640`, broad flukes
  `80/80`, approved Tideguard tail locks `80/80`, exact side mirrors `20/20`,
  both coral-red side eyes `36/36` (`72/72` eye pixels), Cast aliases `16/16`,
  Death aliases `16/16`, 6,338 specialist-changed pixels, 7,144 Complete B
  additions, 8,103 Form changes, and zero public EN-E04 families. All six
  protected predecessor gates also pass.
- The v2 fast gate passes; full `npm.cmd run check` passes in `123.7s` with all
  232 public PNG sheets unchanged.
- Publication is complete at approved implementation checkpoint
  `b315a32aa48d8881efe23e9d5b8553e6c0fb6b79`.
- Required next action: stop. Merfolk elite/Birdfolk, registration,
  integration, effects, release, and broader work require separate explicit
  authorization.

#### Merfolk Pearl Regent full elite approved and published

- Gate ID: `en-e04-merfolk-pearl-regent-full-v1`; status:
  `approved`, internal, non-public, committed, and pushed.
- Live branch: `codex/en-e04-merfolk-pearl-regent`, based exactly on clean
  Reefcaller reconciliation `e54807be33020d23ab0ff5b32938804bd83fcbb5`;
  approved Reefcaller remains frozen at
  `b315a32aa48d8881efe23e9d5b8553e6c0fb6b79`. The approved Pearl Regent
  implementation is committed and pushed at
  `ef0ab54b73718b62f8db99f601020f7ef14090f8`.
- Authorization: after Reefcaller approval/publication, the designer said
  `lets do next` on 2026-08-09. EN-E04 role order advances specialist to elite
  before Birdfolk; Codex named and bounded one complete Pearl Regent elite only.
- Approval: the designer reviewed both exact hash-frozen all-four-direction
  raw/no-outline and Complete B + Form GIFs together, including both visible
  coral-red side-eye pixels, and said `approved` on 2026-08-09.
- Scope: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast aliases,
  and exact Death aliases `H1,H2,H2,H2` across Down, Left, Right, and Up.
- Source/anatomy: all motion delegates approved Reefcaller. Tail rows 16-23 are
  byte-exact in `80/80` frames; all lower rows remain one connected fused-tail
  run ending in the approved broad fluke.
- Identity: connected pearl-and-gold diadem, broad shell pauldrons,
  deep-crimson royal mantle, nacre breastplate, luminous aqua regalia marks,
  twin coral-red side eyes, and the approved sea-green tail. A one-cell ceiling
  brace protects the diadem during rise/recoil; both red side-eye pixels remain
  present in all 36 colored Left/Right frames (`72/72` eye pixels).
- External effects: royal tide auras, command rings, pearl flares, current
  spirals, coral growth, water bolts, foam, splashes, undertow rings, and
  impacts remain outside actor pixels; baked effects are empty.
- Exclusions: approved Reefcaller changes, Birdfolk, additional Merfolk
  variants, new Cast/Death pixels, registration, consumers, integration,
  effects, release, later EN-E04 work, and every multi-enemy expansion.
- Frozen candidate evidence: raw / Complete B + Form boards
  `cfbab3f4d9c45a2c61d1e0109f5f55a7f05e3b7831d9374fd6ea93ddfc6821ef` /
  `5ca9014b4308a7fcaaa33a960d12774ff9edc3df525dc8a703e6563833b2cc1f`;
  raw / Complete B + Form GIFs
  `835e00665636bef438d369092c67450512bf4340bb632db1b1cbb38e38a3db88` /
  `a85744e15763d935d6f2d31113249eaf849bf63f4e1252975a06b192afd563c0`;
  80-frame digest
  `30f2e8e40db3fc39b60351c350d58e841a4f2a87d7f57e914ea86a60375cd0b6`.
- Focused validation passes suite frames `80/80`, connected hard-alpha
  silhouettes `80/80`, continuous fused-tail rows `640/640`, broad flukes
  `80/80`, approved Reefcaller tail locks `80/80`, exact side mirrors `20/20`,
  both coral-red side eyes `36/36` (`72/72` eye pixels), Cast aliases `16/16`,
  Death aliases `16/16`, 8,302 elite-changed pixels, 7,320 Complete B
  additions, 7,819 Form changes, and zero public EN-E04 families. All seven
  protected predecessor gates also pass.
- The v2 fast gate passes; full `npm.cmd run check` passes in `115.1s` with all
  232 public PNG sheets unchanged.
- Publication is complete at approved implementation checkpoint
  `ef0ab54b73718b62f8db99f601020f7ef14090f8`.
- Required next action: stop. Birdfolk, registration, integration, effects,
  release, and broader work require separate explicit authorization.

#### Birdfolk Aerie Scout full common approved and published

- Gate ID: `en-e04-birdfolk-aerie-scout-full-v1`; status: `approved`, internal,
  non-public, committed, and pushed.
- Live branch: `codex/en-e04-birdfolk-aerie-scout`, based exactly on clean
  Pearl Regent reconciliation `3a5ff4fdd2709731cb1c673c84ce0956057541e1`;
  approved Pearl Regent remains frozen at
  `ef0ab54b73718b62f8db99f601020f7ef14090f8`. The approved Aerie Scout
  implementation is committed and pushed at
  `a0910312e510ee57b603ee981a279c1f372d6fad`.
- Authorization/naming: after Pearl Regent approval/publication, the designer
  said `next` on 2026-08-09. EN-E04 advances to Birdfolk, whose live anatomy
  contract exists without role names; Codex named and bounded one complete
  common Aerie Scout only. Specialist and elite names remain deliberately open.
- Approval: the designer reviewed both exact hash-frozen all-four-direction
  raw/no-outline and Complete B + Form GIFs together and said `very good
  approved` on 2026-08-09. They paused only for a Codex/MCP restart, then said
  `ok lets keep going`; the working MCP opened both exact `1428x760` boards in
  Aseprite after restart.
- Scope: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast aliases,
  and exact Death aliases `H1,H2,H2,H2` across Down, Left, Right, and Up.
- Anatomy: one upright feathered torso joins a beaked crested head, two
  shoulder-rooted wing-arms, two digitigrade legs with broad talons, and one
  connected tail fan. Every frame is one hard-alpha component within a one-cell
  margin; human hair/face, ordinary boot blocks, detached wing islands, and the
  exposed-human Harpy identity are forbidden.
- Identity: slate-blue plumage, cream throat bib, rust flight-feather tips,
  bronze harness, teal sash marks, amber eyes, and gold beak/talons. All 36
  colored side frames retain two eye pixels; all 18 colored rear frames remain
  eye-free.
- External effects: wind streaks, loose feathers, dust puffs, dive trails,
  gust rings, air blades, and impacts stay outside actor pixels; baked effects
  are empty.
- Exclusions: approved Pearl Regent changes, Birdfolk specialist/elite roles,
  additional variants, new Cast/Death pixels, registration, consumers,
  integration, effects, release, later EN-E04 work, and multi-enemy expansion.
- Frozen candidate evidence: raw / Complete B + Form boards
  `e1d6bd053edeab115ae354383ba39b5ed0698aecc445985cfd5ea06bc67b3b47` /
  `b7bb2f42c79868a1f311340e3df4ecf22d166170a4eb279c0cc293532de3e9b9`;
  raw / Complete B + Form GIFs
  `f50d8b6768eca83561aef0f44576cebcd64f399ec3294a90585972ba7e41d81b` /
  `4ef54ceb8050955b8c6611a3ef1c57124012f315220276283879a021b3d59c4a`;
  80-frame digest
  `afff790c5f60684561752ff7fe9f8f4312c5b46679477cc88d29764379ca41c8`.
- Focused validation passes suite frames `80/80`, connected/hard-alpha frames
  `80/80`, complete colored crest/wing-arm/tail-fan/talon anatomy `72/72`,
  exact side mirrors `20/20`, colored side eyes `36/36`, eye-free colored rear
  frames `18/18`, Cast aliases `16/16`, Death aliases `16/16`, opaque range
  179-231, 7,614 Complete B additions, 7,107 Form changes, and zero public
  EN-E04 families. All eight protected predecessor gates also pass.
- The final post-reconciliation v2 fast gate passes in `54.5s`; full
  `npm.cmd run check` passes in `106.3s`, with all 232 public PNG sheets
  unchanged.
- Publication is complete at approved implementation checkpoint
  `a0910312e510ee57b603ee981a279c1f372d6fad`.
- Required next action: stop. No later Birdfolk role, registration,
  integration, effects, release, or broader work is authorized by this
  approval.

#### Birdfolk Gale Augur full specialist approved and published

- Gate ID: `en-e04-birdfolk-gale-augur-full-v1`; status:
  `approved`, internal, non-public, committed, and pushed.
- Live branch: `codex/en-e04-birdfolk-gale-augur`, based exactly on clean Aerie
  Scout reconciliation `60df011f86f2bce93e54a7bcd071d53b1ae3497e`; approved
  Aerie Scout remains frozen at
  `a0910312e510ee57b603ee981a279c1f372d6fad`. The approved Gale Augur
  implementation is committed and pushed at
  `ad57f25d47415625540ea36ff16d2a884a421576`.
- Authorization/naming: after Aerie Scout approval/publication, the designer
  said `awesome lets keep going` on 2026-08-09. The Birdfolk role order advances
  from common to specialist; Codex named and bounded one complete Gale Augur
  specialist only. The elite name remains deliberately open.
- Approval: the designer reviewed both exact hash-frozen all-four-direction
  raw/no-outline and Complete B + Form GIFs together and said `awesome looks
  good approved` on 2026-08-09.
- Scope: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast aliases,
  and exact Death aliases `H1,H2,H2,H2` across Down, Left, Right, and Up.
- Source/anatomy: all 80 frames preserve the approved Aerie Scout alpha
  footprint and upright avian chassis beneath connected specialist regalia.
- Identity: indigo plumage, midnight flight feathers, storm-violet tips,
  connected storm cowl and shoulder mantle, silver circlet/forewing bands, cyan
  sky rune, ice-blue eyes, and gold beak/talons. All 36 colored side frames
  retain two eye pixels; all 18 colored rear frames remain eye-free.
- External effects: wind glyphs, omen rings, feather spirals, pressure waves,
  lightning filaments, dust puffs, air blades, and impacts stay outside actor
  pixels; baked effects are empty.
- Exclusions: approved Aerie source changes, Birdfolk elite, additional
  variants, new Cast/Death pixels, registration, consumers, integration,
  effects, release, later EN-E04 work, and multi-enemy expansion.
- Frozen candidate evidence: raw / Complete B + Form boards
  `6f1083a615555aa47fc7a9d62c8cf1e2761cccee1b6346f04d5f0d973d68e33c` /
  `c82183ed27e2639130670918960d3c87bd9d16d9eba74f76e049a0d04d1d631b`;
  raw / Complete B + Form GIFs
  `083b327e56c6e530e6b42f92178350803d7a40687e4dc985ad4077ac40bd1a09` /
  `7db6c88d3c0a1ec0f9289d86b80885bf5418edd0af95ad44ac08f1da1ca96641`;
  80-frame digest
  `4495c4f91c77f411a7b0639ac68e3b8bf94318632d0191f0034a4373f32de9d4`.
- Focused validation passes suite/source-lock/connected/hard-alpha frames
  `80/80`, complete colored cowl/circlet/mantle/sky-rune/avian anatomy `72/72`,
  exact side mirrors `20/20`, colored side eyes `36/36`, eye-free colored rear
  frames `18/18`, Cast aliases `16/16`, Death aliases `16/16`, opaque range
  188-237, 15,022 specialist-changed pixels, 7,650 Complete B additions, 8,133
  Form changes, and zero public EN-E04 families.
- All nine protected predecessor gates pass. The final post-reconciliation v2
  fast gate passes in `49.3s`; full `npm.cmd run check` passes in `98.0s`, with
  all 232 public PNG sheets unchanged.
- Publication is complete at approved implementation checkpoint
  `ad57f25d47415625540ea36ff16d2a884a421576`.
- Required next action: stop. No Birdfolk elite, registration, integration,
  effects, release, or broader work is authorized by this approval.

#### Birdfolk Stormcrown Exarch full elite approved and published

- Gate ID: `en-e04-birdfolk-stormcrown-exarch-full-v1`; status:
  `approved`, internal, non-public, committed, and pushed.
- Live branch: `codex/en-e04-birdfolk-stormcrown-exarch`, based exactly on clean
  Gale Augur reconciliation `aaf59dff8a14226bd46edbe48979dd2eb87c3faa`;
  approved Gale Augur remains frozen at
  `ad57f25d47415625540ea36ff16d2a884a421576`. The approved Stormcrown
  implementation is committed and pushed at `da8c089`.
- Authorization/naming: after Gale Augur approval/publication, the designer
  said `lets do next` on 2026-08-09. The Birdfolk role order advances from
  specialist to elite; Codex named and bounded one complete Stormcrown Exarch
  elite only because that role was not pre-named.
- Approval/continuation: after reviewing the exact paired candidate and asking
  when the new enemies would enter the assembler, the designer said `sure lets
  do 123` on 2026-08-09. That approves Stormcrown and authorizes bounded
  publication, then one complete nine-enemy EN-E04 registration checkpoint,
  then one complete assembler consumer-integration checkpoint.
- Scope: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast aliases,
  and exact Death aliases `H1,H2,H2,H2` across Down, Left, Right, and Up.
- Source/anatomy: all 80 frames preserve the approved Gale Augur alpha
  footprint and upright avian chassis beneath connected elite regalia.
- Identity: iron-slate plumage, near-black flight feathers, ivory throat,
  crimson royal mantle, connected gold three-point storm crown and brow guard,
  armored gold forewing bands, cyan lightning sigil, white-blue eyes, and a
  burnished beak/talons. All 36 colored side frames retain two eye pixels; all
  18 colored rear frames remain eye-free.
- External effects: lightning coronas, thunder halos, storm arcs, pressure
  waves, feather spirals, dust puffs, air blades, and impacts stay outside actor
  pixels; baked effects are empty.
- Exclusions: approved Gale source changes, additional Birdfolk variants, new
  Cast/Death pixels, registration, consumers, integration, effects, release,
  later EN-E04 work, and multi-enemy expansion.
- Frozen candidate evidence: raw / Complete B + Form boards
  `94937293130da44fe99b3681330a7807da63dc936ff76586c6647d42e5d41f42` /
  `20f5119159b9440be3f84b65a0b41c88ff3253fffeda3aac65d372ac8c027a18`;
  raw / Complete B + Form GIFs
  `52eb71a4bffab666cfc006b047f2e51b350be3115cafdcf06e44f3e2cb529498` /
  `ad11fbfd1533d29e79b0033b565db510f0a3dba54f49a75130a76dccaad3daac`;
  80-frame digest
  `9e7a7c5e29e1918bf1078bcd4823680ff4243beeaa2e90b8d27689d0c3af9fa1`.
- Focused validation passes suite/source-lock/connected/hard-alpha frames
  `80/80`, complete colored storm-crown/brow-guard/royal-mantle/
  lightning-sigil/avian anatomy `72/72`, exact side mirrors `20/20`, colored
  side eyes `36/36`, eye-free colored rear frames `18/18`, Cast aliases
  `16/16`, Death aliases `16/16`, opaque range 188-237, 14,954 elite-changed
  pixels, 7,650 Complete B additions, 7,041 Form changes, and zero public
  EN-E04 families.
- All ten protected predecessor gates pass. The v2 fast gate passes in
  `50.4s`; full `npm.cmd run check` passes in `103.0s`, with all 232 public PNG
  sheets unchanged.
- Publication is complete at approved implementation checkpoint `da8c089`.
- Required next action: complete the separately authorized nine-enemy EN-E04
  registration checkpoint, then the assembler consumer-integration checkpoint.
  Additional variants, effects, release, and broader work remain outside.

#### Complete EN-E04 nine-enemy registration approved and published

- Gate ID: `en-e04-nine-enemy-registration-v1`; status: `approved` and
  implemented on `codex/en-e04-registration`, based exactly on clean published
  Stormcrown handoff `6f81c92`. The registration implementation is committed
  and pushed at `6f228fb`.
- Authorization: after Stormcrown review, the designer said `sure lets do 123`
  on 2026-08-09, authorizing publication, then registration, then assembler
  consumer integration as separate checkpoints.
- Registered families/variants: Naga Coilguard, Venom Oracle, Temple Rajah;
  Merfolk Tideguard, Reefcaller, Pearl Regent; Birdfolk Aerie Scout, Gale Augur,
  Stormcrown Exarch.
- Architecture: `engine/enemy-expansion-en-e04.js` composes three approved
  families and three family-local dispatchers. Each dispatcher delegates to the
  exact approved variant renderer; no candidate module or reviewed source pixel
  changes.
- Stable boundary: `ENEMY_EXPANSION_REGISTRY` contains 13 approved families /
  39 variants and four renderers across EN-E01, EN-E02, and EN-E04. The ledger
  records four approved and eighteen planned slices.
- Historical separation: at registration checkpoint `6f228fb`,
  `ENEMY_EXPANSION_CONSUMER_REGISTRY` remained the exact repaired EN-E01/EN-E02
  ten-family registry. `PUBLIC_ENEMIES` was therefore 67 families / 232
  variants until the later separately authorized integration gate.
- Validation: `npm.cmd run check:enemy-expansion-en-e04-registration` verifies
  nine complete `480x96` sheets, all 720 candidate/registered frame and alpha
  pairs, hard alpha, bounds, stable facade isolation, ledger state, and zero
  premature consumer exposure. Aggregate digest:
  `137d044a55dd41d612a8b41958029e41ef39fb75ccf58de9b46d6c4328c91459`.
- Protected gates: the foundation, EN-E01/EN-E02 candidate, registration,
  consumer, repair, and EN-E03 evidence gates all remain green.
- Exclusions at registration: consumer exposure, editor-specific branches,
  schema changes, effects, release, EN-E03 adoption, later slices, and any
  reviewed pixel changes.
- Publication is complete at registration checkpoint `6f228fb`.

#### EN-E04 assembler consumer integration implemented

- Gate ID: `en-e04-assembler-consumers-v1`; status: `authorized` and
  implemented on `codex/en-e04-assembler-integration`, based exactly on clean
  registration handoff `3bc380a`. Bounded publication is complete at
  `cedc774`.
- Authorization: the designer's `sure lets do 123` on 2026-08-09 authorized
  Stormcrown publication, nine-enemy registration, and then this generic
  assembler integration.
- Public boundary at that checkpoint: `ENEMY_EXPANSION_CONSUMER_REGISTRY`
  aliased the exact 13-family / 39-variant EN-E04 stable registry.
  `PUBLIC_ENEMIES` therefore became 70 families / 241 variants while legacy
  `ENEMIES` remained 57/202. The later EN-E05 registration extends only stable
  state to 17/43 and deliberately leaves this consumer boundary unchanged.
- Generic coverage: editor selectors and sanitizers, persistence, Enemy
  randomization, thumbnails, full/animation/direction sheets, ordinary packs,
  Complete Character Kits and Packs, Wildshot validation, None/Complete B/
  Selective C outlines, and Form shading require no EN-E04-specific consumer
  branches.
- Adapter repair: the public renderer bridge suppresses only a delegated
  renderer's full-frame clear. It forwards deliberate regional clears used by
  Merfolk and Temple Rajah to replace inherited lower-body pixels, preserving
  exact candidate/public parity under generic composition.
- Validation: `npm.cmd run check:enemy-expansion-en-e04-consumers` verifies all
  720 public frames, nine native full sheets plus scoped sheet/thumbnail routes,
  67,440 Complete B additions, 64,380 Form-changed source pixels, 2,178 Complete
  Kit PNGs, and Wildshot acceptance for all nine EN-E04 specifications.
- Frozen aggregate digest:
  `137d044a55dd41d612a8b41958029e41ef39fb75ccf58de9b46d6c4328c91459`.
- Compatibility: the historical EN-E01/EN-E02 2,400-frame / 30-sheet consumer
  matrix and all focused EN-E04 gates remain green. Full `npm.cmd run check`
  passes after integration and documentation reconciliation.
- Fixture firewall: the 232 committed `asset-pack/` PNGs remain the frozen
  legacy fixture corpus. They are not regenerated, accepted as a new baseline,
  or expanded by this consumer gate.
- Exclusions: reviewed source pixels, schema versions, effects, EN-E03
  adoption, fixture regeneration, release artifacts, and broader enemy work.
- Publication: implementation checkpoint `cedc774` is pushed on the tracked
  integration branch.
- Required next action: stop and wait for the next designer-authorized slice.
  Do not infer effects, release, fixture regeneration, or additional enemies
  from this completed integration gate.

### EN-E05 - Undead humanoids

- Status: `four new families integrated at 773cfad; public catalog 74/245`
- Families/proposal work: existing Ghoul upgrade, Mummy, Vampire, Revenant, Lich
- Priority-first: Ghoul upgrade, Mummy, Vampire, Revenant, Lich
- Active gate: none; stop at the clean published consumer checkpoint while
  public Ghoul replacement, fixtures, effects, release, EN-E03 adoption, and
  Wave 2 remain gated

Shared leverage: broken posture, wrappings, capes, exposed bone, floating hems,
and necrotic palette families. The Ghoul change is an explicit upgrade to the
existing material and requires a before/after regression review; it must not
silently alter unrelated Zombie variants.

#### Existing Ghoul full-suite upgrade approved internal lane

- Gate ID: `en-e05-ghoul-upgrade-full-v1`; status: `approved`, internal, and
  non-public, committed, and pushed at
  `88d32e951441b9ce8f89eb6e3ab279bfc037a497` on
  `codex/en-e05-ghoul-upgrade`, based exactly on clean published EN-E04
  integration handoff `8b1ef2e`.
- Authorization: after reviewing the 80-proposal accounting, the designer said
  `nice lets do 1 full sprite with all animations each run` on 2026-08-09.
  The live EN-E05 priority order selects the existing Ghoul upgrade first.
- Approval: after the exact before/after board plus both labeled
  all-four-direction raw/no-outline and Complete B + Form full-suite review
  surfaces were presented together, the designer said `approved` on
  2026-08-09. Approval applies only to this hash-frozen candidate and its
  bounded publication.
- Exact scope: one replacement candidate for `zombie/ghoul`; 80 frames across
  Down, Left, Right, and Up with Idle F1-F2, Walk W1-W4, Attack A1-A4, exact
  Cast aliases, Hurt H1-H2, and exact Death aliases H1,H2,H2,H2.
- Identity: ash-green corpse flesh, exposed ivory bone, wine-dark wounds,
  corpse-yellow eyes, torn grave leathers, a low hooked side jaw, hunched
  shoulder shelf, long connected claws, exposed rear spine, uneven legs, and a
  weaponless stalking gait. Blood, rot motes, dust, trails, impacts, mist, and
  debris remain external.
- Review evidence: raw / Complete B + Form full-suite boards
  `d1c94649e8520ff9dba6168caf06f6324ff473783b46d166fa2ab5bd4532003e` /
  `2ffdeb527ffe097976b350602bf08db67fb95bb53f2a553ffa011047155d4570`;
  before/after board
  `2e6766dffa8600f2137df2f911996328a429eb56d1465429049f3193fa7c2144`;
  raw / Complete B + Form GIFs
  `a9bc8d2ec7413a399134e5ddb9f12f5a029b1393373c99aea74061b39ffb2f7c` /
  `13c0bd1e514e5c077938129776cbc6c9e3524822a05a0b195abc855c06041d71`.
- Focused validation passes 80/80 changed-from-legacy frames, 80/80 connected
  silhouettes, 80/80 one-cell margins, 72/72 colored identity frames, 36/36
  colored side eyes, 18/18 eye-free colored rear frames, exact mirrors and
  aliases, opaque range 170-209, 7,381 Complete B additions, and 6,381 Form
  changes. Candidate digest:
  `9f24d575dd7685afd0ca6411f23d6de2b05f90634ef9802d431881d046394477`.
- Firewall: public `zombie/ghoul`, `zombie/shambler`, `zombie/rotter`, and
  `zombie/brute` retain exact 80-frame digests; the committed Ghoul fixture
  remains SHA-256
  `a6f69caac95fad855db65ae787ceac0e9333f9013ee3882a13b6ccab57a7edc2`.
- Exclusions: public replacement in this approval-publication gate, fixture
  regeneration, Mummy, Vampire,
  Revenant, Lich, effects, release, and later EN-E05 work.
- Protected validation: the EN-E04 public consumer gate passes; the fast gate
  passes in `52.3s`; full `npm.cmd run check` passes in `114.6s` with 70/241
  public catalog entries and all 232 frozen fixtures unchanged.
- Publication: the exact approved ten-file implementation is committed and
  pushed at `88d32e951441b9ce8f89eb6e3ab279bfc037a497`; generated review artifacts
  remain ignored.
- Required next action: stop at this clean published checkpoint. Keep public
  `zombie/ghoul` and the frozen fixture unchanged. The designer's later
  `lets do next` activates only the separate Mummy candidate below.

#### Mummy Tomb Walker full-suite approved internal lane

- Gate ID: `en-e05-mummy-tomb-walker-full-v1`; status:
  `approved`, internal, non-public, committed, and pushed at
  `85f1ed77b34d7aa300e6ef7454b85f5295ad1da1` on
  `codex/en-e05-mummy`, based exactly on clean published Ghoul handoff
  `1aa733c1cd47c60538e9fa8ff621987867e451e3`.
- Authorization: after approving and publishing the complete Ghoul upgrade,
  the designer said `lets do next` on 2026-08-09. The EN-E05 priority order
  advances to Mummy under the established one-full-sprite cadence.
- Approval: after the exact approved-Ghoul comparison and paired labeled
  all-four-direction Mummy review surfaces were presented, the designer replied
  `lets do nextg` on 2026-08-09. In its direct response context this is recorded
  as approval of the frozen Mummy plus authorization to publish it before one
  separate Vampire candidate.
- Exact scope: one common `mummy/tomb-walker`; 80 frames across Down, Left,
  Right, and Up with Idle F1-F2, Walk W1-W4, Attack A1-A4, exact Cast aliases,
  Hurt H1-H2, and exact Death aliases H1,H2,H2,H2.
- Identity: sun-bleached ivory and papyrus linen, sepia shadow wraps, exposed
  embalmed umber flesh, black tomb cavities, aged-gold bindings, turquoise
  curse eyes and seal, a coffin-stiff wrapped head, asymmetric bound arms,
  connected torn linen skirt, and dragging block feet.
- Motion: rigid tomb sway and linen settle; four-step stiff drag; binding coil,
  raised-arm threat, two-handed curse grasp, and full-body reseal; complete
  white recoil plus colored rebind. Effects remain external.
- Review evidence: raw / Complete B + Form full-suite boards
  `6d652c60c88c8b892eaf6c6f70db03c1f1642f2df8ba35aa2a68c2b1645d891f` /
  `67e36714906f6898381e74504b2e97ac2873e76828adc30b9b683ac0493aad3a`;
  approved-Ghoul comparison
  `0ccf489dfa662e9d61f9d2adc19d5de342ccedff12d37a6fd99cfd0e629c2ab4`;
  raw / Complete B + Form GIFs
  `df6e0a9319e510049f6e6fa11f267cbd42980fb45a3f8c1147c95a869e3fd194` /
  `72279b6d39630d67264a901e9835013ba99470af3c139296ac28d56c68440b04`.
- Focused validation passes 80/80 distinct-from-Ghoul pixel frames and alpha
  silhouettes, 80/80 connected silhouettes, 80/80 one-cell margins, 72/72
  colored identity frames, exact directional eyes, mirrors, and aliases,
  opaque range 187-223, 7,518 Complete B additions, and 7,994 Form changes.
  Candidate digest:
  `321c5c7f05a55a6502b03d3876521c3b799c8156c2197efc3833c4af68a556fd`;
  approved Ghoul digest remains
  `9f24d575dd7685afd0ca6411f23d6de2b05f90634ef9802d431881d046394477`.
- Firewall: public catalog remains 70/241; Zombie siblings and the frozen
  legacy Ghoul fixture remain exact. Mummy has zero public families and no
  fixture.
- Protected validation: the approved Ghoul and EN-E04 public consumer gates
  pass; the fast gate passes in `55.4s`; full `npm.cmd run check` passes in
  `107.2s` with all 232 frozen fixtures unchanged.
- Exclusions: Mummy registration, fixture generation, additional Mummy
  variants, Vampire on this branch, Revenant, Lich, effects, release, and later
  EN-E05 work.
- Publication: the exact approved ten-file implementation is committed and
  pushed at `85f1ed77b34d7aa300e6ef7454b85f5295ad1da1`; generated review artifacts
  remain ignored.
- Required next action: create a separate branch from the reconciled Mummy
  handoff for one complete Vampire candidate. That action is now bounded below;
  keep registration, fixtures, effects, Revenant, and Lich outside it.

#### Vampire Night Noble full-suite approved internal lane

- Gate ID: `en-e05-vampire-night-noble-full-v1`; status:
  `approved`, internal, non-public, committed, and pushed at
  `6a7cce2f84f86f7836b583341f56a1ae7e9c7a51` on
  `codex/en-e05-vampire`, based exactly on clean reconciled Mummy handoff
  `3387bf2fd465e6e861450ba6e69ed2de31fd45ad`.
- Authorization: after reviewing Mummy, the designer replied `lets do nextg`
  on 2026-08-09. In direct context it approved Mummy publication followed by
  one separate complete Vampire under the established one-full-sprite cadence.
- Approval: after the exact approved-Mummy comparison and paired labeled
  all-four-direction raw/no-outline and Complete B + Form Vampire review
  surfaces were presented together, the designer replied `approved` on
  2026-08-09. Approval applies only to this hash-frozen candidate and its
  bounded branch publication; it does not authorize Revenant.
- Exact scope: one common `vampire/night-noble`; 80 frames across Down, Left,
  Right, and Up with Idle F1-F2, Walk W1-W4, Attack A1-A4, exact Cast aliases,
  Hurt H1-H2, and exact Death aliases H1,H2,H2,H2.
- Identity: pallid rose-gray skin, black-violet widow-peaked hair and coat,
  blood-crimson wing collar and cape lining, ivory shirt and cuffs,
  antique-gold clasp, ember-red eyes, fitted waist, split tailcoat, connected
  cape hem, and long booted legs.
- Motion: controlled breath and cape pulse; four-step predatory formal glide;
  cape coil, high claw flare, long night rake, and full-body recovery; complete
  white recoil plus colored composure. Effects remain external.
- Review evidence: raw / Complete B + Form full-suite boards
  `25a6944fa51889c6a09735ef47530a31591610b3c4ef4260aa88318d42d6239e` /
  `02bb524d6ef49a52026037a7f5ef1faf66d0f987c7e792c3b0599d7eb79776d0`;
  approved-Mummy comparison
  `2862b5d4601eaef873a723100f5b462db1d6d0714fdf61b974bb2bc1b3c4fcb8`;
  raw / Complete B + Form GIFs
  `7075df50690e8a00ed5f599a4b28f9095d5f010708d2dff269b9d4b5ed691101` /
  `d7c01c725c8d91896791bbe3a0144f597f27827e4f856824023f4dfcd0f69b22`.
- Focused validation passes 80/80 distinct-from-Mummy pixel frames and alpha
  silhouettes, 80/80 connected silhouettes, 80/80 one-cell margins, 72/72
  colored identity frames, exact directional eyes, mirrors, and aliases,
  opaque range 194-239, 7,307 Complete B additions, and 6,793 Form changes.
  Candidate digest:
  `b3943802e450e454d707f118a58fb81cdf43b3869d02da999b7232d8a0aab4ba`;
  approved Mummy digest remains
  `321c5c7f05a55a6502b03d3876521c3b799c8156c2197efc3833c4af68a556fd`.
- Firewall: public catalog remains 70/241; Zombie siblings and the frozen
  legacy Ghoul fixture remain exact. Vampire has zero public families and no
  fixture.
- Protected validation: the approved Mummy, Ghoul, and EN-E04 public consumer
  gates pass; the fast gate passes in `52.5s`; full `npm.cmd run check` passes
  in `102.6s` with all 232 frozen fixtures unchanged.
- Exclusions: Vampire registration, fixture generation, additional Vampire
  variants, Revenant, Lich, effects, release, and later EN-E05 work.
- Publication: the exact approved ten-file implementation is committed and
  pushed at `6a7cce2f84f86f7836b583341f56a1ae7e9c7a51`; generated review artifacts
  remain ignored.
- Required next action: the designer's later `awesome lets do next` activates
  exactly one separate complete Revenant candidate below. Keep Vampire
  registration, fixtures, effects, and Lich outside that gate.

#### Revenant Grave Oathkeeper full-suite approved internal lane

- Gate ID: `en-e05-revenant-grave-oathkeeper-full-v1`; status:
  `approved`, internal, non-public, committed, and pushed at
  `7434578d5af8f3e7355add884cf0d33e3f312288` on
  `codex/en-e05-revenant`, based exactly on clean reconciled Vampire handoff
  `16f58760be6483ba463e0b5acf88cdaa4592943b`.
- Authorization: after approving, publishing, and reconciling the complete
  Vampire, the designer said `awesome lets do next` on 2026-08-09. This
  activates one separate complete Revenant under the established
  one-full-sprite cadence.
- Approval: after the exact approved-Vampire comparison and paired labeled
  all-four-direction raw/no-outline and Complete B + Form Revenant review
  surfaces were presented together, the designer replied `awesome very good
  approved` on 2026-08-09. Approval applies only to this hash-frozen candidate
  and its bounded branch publication; it does not authorize Lich.
- Exact scope: one common `revenant/grave-oathkeeper`; 80 frames across Down,
  Left, Right, and Up with Idle F1-F2, Walk W1-W4, Attack A1-A4, exact Cast
  aliases, Hurt H1-H2, and exact Death aliases H1,H2,H2,H2.
- Identity: corpse-gray bone, cold blue dented iron, old rust, a faded
  oath-red tabard, worn brass fasteners, chipped steel, black helm cavities,
  two cyan oathfire eyes, split crest, mismatched pauldrons, heavy boots, and a
  connected broken greatblade.
- Motion: sealed vigil and armor heave; four-step grave march with boot plants,
  blade drag, and tabard movement; oathblade guard, shoulder hoist, broad
  full-body cleave, and grounded recovery; complete white iron stagger plus
  colored oath brace. Effects remain external.
- Review evidence: raw / Complete B + Form full-suite boards
  `010fc811c0495406025a6f3efd4e6f97393f9e6e0ccc64e92ce8dcd610063afe` /
  `037ffb153c64f2542f42377ec70222947149d2d46205605728f3004dc41eb3c6`;
  approved-Vampire comparison
  `ba4debce379e44e6d7c5d5e865a3cf06f029efafba4bdf928174c111d2294d96`;
  raw / Complete B + Form GIFs
  `41154eb09cd907b1fd128673dcc9baff5f947990641f2c1a42010fa7ac6f7920` /
  `58d05f0640b94b3e55c5b16d92e785d4637a24664bec3f7a004e364e3b5c860a`.
- Focused validation passes 80/80 distinct-from-Vampire pixel frames and alpha
  silhouettes, 80/80 connected silhouettes, 80/80 one-cell margins, 72/72
  colored identity frames, exact directional eyes, mirrors, and aliases,
  opaque range 208-266, 7,286 Complete B additions, and 9,522 Form changes.
  Candidate digest:
  `f53fa853e7fb7aebc232e3ca1903d8a4d1d717de02576c51fe81f4c4d5b90079`;
  approved Vampire digest remains
  `b3943802e450e454d707f118a58fb81cdf43b3869d02da999b7232d8a0aab4ba`.
- Firewall: public catalog remains 70/241; Zombie siblings and the frozen
  legacy Ghoul fixture remain exact. Revenant has zero public families and no
  fixture.
- Protected validation: the approved Vampire, Mummy, Ghoul, and EN-E04 public
  consumer gates pass; the fast gate passes in `46.6s`; full `npm.cmd run
  check` passes in `98s` with all 232 frozen fixtures unchanged.
- Exclusions: Revenant registration, fixture generation, additional Revenant
  variants, Lich, effects, release, and later EN-E05 work.
- Publication: the exact approved ten-file implementation is committed and
  pushed at `7434578d5af8f3e7355add884cf0d33e3f312288`; generated review artifacts
  remain ignored.
- Required next action: the designer's later `cool lets do next` activates
  exactly one separate complete Lich candidate below. Keep Revenant
  registration, fixtures, effects, and Wave 2 outside that gate.

#### Lich Soul Regent full-suite approved internal lane

- Gate ID: `en-e05-lich-soul-regent-full-v1`; status:
  `approved`, internal, non-public, committed, and pushed at
  `4cebc7b09f979913d73330d275ac3e4729511465` on
  `codex/en-e05-lich`, based exactly on clean reconciled Revenant handoff
  `97db37e151e04f42367c517955c88826c4ed7f51`.
- Authorization: after approving, publishing, and reconciling the complete
  Revenant, the designer said `cool lets do next` on 2026-08-09. This
  activates one separate complete Lich under the established one-full-sprite
  cadence.
- Approval: after the exact approved-Revenant comparison and paired labeled
  all-four-direction raw/no-outline and Complete B + Form Lich review surfaces
  were presented, the designer requested removal of the repeated square
  lower-robe panels. The panels were replaced with tapered folds across every
  direction and frame, the evidence was regenerated, and the designer replied
  `approved` on 2026-08-09. Approval applies only to this final hash-frozen
  candidate and its bounded branch publication.
- Exact scope: one elite `lich/soul-regent`; 80 frames across Down, Left,
  Right, and Up with Idle F1-F2, Walk W1-W4, Attack A1-A4, exact Cast aliases,
  Hurt H1-H2, and exact Death aliases H1,H2,H2,H2.
- Identity: cold ivory bone, deep violet reliquary robes, teal lining,
  oxidized gold, dark staff wood, a sea-green soul gem, black skull cavities,
  mint oathfire eyes, a jagged crown, broad ritual mantle, split hem, and one
  connected gem-tipped staff.
- Motion: sealed ritual stillness and reliquary pulse; four-phase grave glide;
  soul-reliquary gather, crown and staff ascent, full-body soul decree, and
  sepulchral recovery; complete white soul rupture plus colored phylactery
  reform. Soul flame, runes, chains, projectiles, auras, fog, trails, impacts,
  pages, and detached wisps remain external.
- Review evidence: raw / Complete B + Form full-suite boards
  `d1b59e29d6881c2556a786cd0c4bd8017c34a5076a6b687798cef6cd7045519e` /
  `137c89638cb4d23de02de5fe7f72b8fddddf8cdad1f707d91812a79686e928b6`;
  approved-Revenant comparison
  `c9ead47d3bf489ed0cc4af38e8c75d5eacf74c75f3628876fa70901e9d755fa9`;
  raw / Complete B + Form GIFs
  `0a851b281dc3a59bd888000dac8f4389d3a0b7ea9163df7157d64b94a23d11bf` /
  `3d72223b59b9ec670809bca358b5d8f697e49d75315c0daf91b0da4526d10280`.
- Focused validation passes 80/80 distinct-from-Revenant pixel frames and alpha
  silhouettes, 80/80 connected silhouettes, 80/80 one-cell margins, 72/72
  colored identity frames, exact directional eyes, mirrors, and aliases,
  opaque range 223-281, 7,684 Complete B additions, and 7,667 Form changes.
  Candidate digest:
  `236afeccc237ba347a8f4929ac5743d3275abf60defb86d2705f39475bde2a01`;
  approved Revenant digest remains
  `f53fa853e7fb7aebc232e3ca1903d8a4d1d717de02576c51fe81f4c4d5b90079`.
- Firewall: public catalog remains 70/241; Zombie siblings and the frozen
  legacy Ghoul fixture remain exact. Lich has zero public families and no
  fixture.
- Protected validation: the approved Revenant, Vampire, Mummy, Ghoul, and
  EN-E04 public consumer gates pass; the fast gate passes in `52.4s`; full
  `npm.cmd run check` passes in `104.7s` with all 232 frozen fixtures
  unchanged.
- Exclusions: Lich registration, fixture generation, additional Lich variants,
  effects, release, EN-E05 registration, Wave 2, and later expansion work.
- Publication: the exact approved ten-file implementation is committed and
  pushed at `4cebc7b09f979913d73330d275ac3e4729511465`; generated review artifacts
  remain ignored.
- Required next action at this historical lane: stop at the clean published
  Lich checkpoint. The designer's later `lets do next` authorizes only the
  separate stable-registration gate below; fixtures and Wave 2 remain excluded.

#### Five-undead stable registration checkpoint

- Gate ID: `en-e05-five-undead-registration-v1`; status: `authorized`,
  implemented, committed, and pushed at
  `7d273ef52960e5bd4568ce3d47148c1b68fdcf44` on
  `codex/en-e05-registration`, based exactly on clean published Lich handoff
  `c0e438ba25de3f0adc063e6b294cba6c7b5182be`.
- Authorization: after the final repaired Lich was approved, published, and
  reconciled, the designer said `lets do next` on 2026-08-09. The Lich handoff
  explicitly separated EN-E05 registration from Wave 2, so only the
  registration dependency is open.
- Exact scope: register approved `mummy/tomb-walker`,
  `vampire/night-noble`, `revenant/grave-oathkeeper`, and
  `lich/soul-regent` as four stable families. Record approved
  `ghoul-upgrade/ghoul` separately as the proposed replacement for legacy
  `zombie/ghoul`; do not collide with or rewrite the legacy Zombie family.
- Parity: five complete 80-frame sheets pass. All 400 candidate/registered
  frames match, and all 320 new-family frames match through the composed stable
  registry. Frozen registration digest:
  `732c6097b237131e85bdf435112c2bed7ec1f8bf8317dee4e42605f0c1730d32`.
- Registry boundary: stable expansion state advances from 13/39 to 17/43.
  `ENEMY_EXPANSION_CONSUMER_REGISTRY` remains the exact EN-E04 13/39 boundary,
  and `PUBLIC_ENEMIES` remains 70/241. Legacy `ENEMIES` remains 57/202.
- Ghoul/fixture firewall: public `zombie/ghoul` retains exact object and
  80-frame pixel identity; its committed fixture remains SHA-256
  `a6f69caac95fad855db65ae787ceac0e9333f9013ee3882a13b6ccab57a7edc2`.
  All 232 frozen PNG fixtures remain untouched.
- Validation: the new focused gate, all five approved EN-E05 source gates, all
  affected historical expansion gates, fast validation (`51.6s`), and full
  validation (`101.2s`) pass.
- Historical exclusions: this checkpoint did not open assembler consumers,
  public Ghoul replacement, packs, fixture work, schema or reviewed-pixel
  changes, effects, release, or Wave 2. The later consumer gate below opens
  only the four new-family generic routes.

#### EN-E05 assembler consumer integration checkpoint

- Gate ID: `en-e05-assembler-consumers-v1`; status: `authorized`, implemented,
  committed, and pushed at
  `773cfad1c550db8e5b43cc9360e55fe03ddc0ae2` on
  `codex/en-e05-assembler-integration`, based exactly on clean published
  registration handoff `59a694118e08733b6f5e069009abc31e75e517cf`.
- Authorization: after the registration checkpoint was published and
  reconciled, the designer said `cool lets do next` on 2026-08-09. This opens
  only assembler integration for the four registered new families.
- Exact scope: expose `mummy/tomb-walker`, `vampire/night-noble`,
  `revenant/grave-oathkeeper`, and `lich/soul-regent` through generic
  selectors, sanitization, persistence, randomization, dispatch, full,
  direction, animation, and thumbnail sheets, ordinary packs, Complete Kit,
  and Wildshot. No family-specific consumer branches or new sprite pixels.
- Registry boundary: stable and consumer expansion registries are identical at
  17 families / 43 variants. Legacy stays 57/202 and `PUBLIC_ENEMIES` advances
  to 74 families / 245 variants.
- Public parity: all 320 new-family dispatcher frames and four native sheets
  match the registered sources. Frozen consumer digest:
  `947cec4df921761cd5eba378991d7a35b3d773d7e5c0e7c80526ecc6a846a46f`.
  Complete B adds 29,795 pixels and Form changes 27,338 source pixels across
  those 320 cases.
- Export/Wildshot boundary: Complete Kit is 74 families / 245 enemy sheets /
  2,182 total PNGs; all four EN-E05 Wildshot specs are accepted.
- Ghoul/fixture firewall: public `zombie/ghoul` keeps exact object and 80-frame
  pixel identity; `asset-pack/enemies/zombie-ghoul.png` remains SHA-256
  `a6f69caac95fad855db65ae787ceac0e9333f9013ee3882a13b6ccab57a7edc2`.
  All 232 committed PNG fixtures remain untouched.
- Validation: `npm.cmd run check:enemy-expansion-en-e05-consumers`, all
  affected source and historical gates, fast validation (`52.7s`), and full
  validation (`103.1s`) pass. No visual review is needed because the gate
  reuses exact approved and registered pixels.
- Historical next action at that checkpoint: stop. Public Ghoul replacement,
  fixture generation, regeneration, or acceptance, schema or pixel changes,
  effects, release, EN-E03 adoption, and Wave 2 then required later explicit
  authorization. The active Wave 2 boundary is now the Fairy gate below.

Wave 1 exit gate: EN-F00 and EN-E01 through EN-E05 are individually approved,
all existing legacy families still validate, and the humanoid renderer has not
become a catch-all that erases species silhouettes.

## Wave 2 - Fey, Spectral, Possessed, And Constructed

Wave 2 exercises transparency, hovering, asymmetry, detached components, and
stateful identities while effects remain outside the base actor.

### EN-E06 - Fey and folklore

- Status: `all five family role sets complete through approved Rivercrown Muse; EN-E07 Gloam Walker approved and published separately`
- Families: Fairy, Hag, Dryad, Redcap, Nymph
- Priority-first: Fairy, Hag

Shared leverage: small bodies, wings, plant anatomy, exaggerated hats, and
hovering poses. Fairy wings are body parts; glow and particle trails are effects.
Dryad must remain humanoid/fey scale rather than overlap Treant.

#### Approved Fairy Bramblewing Scout complete suite

- Gate ID: `en-e06-fairy-bramblewing-scout-full-v1`; status:
  `approved`, internal, committed, and pushed at `cc92ca9` on
  `codex/en-e06-fairy-full`, based exactly on clean documentation handoff
  `4b2f49dfb80c3c39b6e49672a2c594746f6c030a`.
- Authorization: after the clean EN-E05 audit handoff named Wave 2 as a separate
  closed choice, the designer replied `very good. wave 2` on 2026-08-09. After
  reviewing the exact Fairy Idle evidence, the designer then said
  `very good,. but lately we been doing all animations for 1 sprite each pass`.
  That response approves and freezes the eight Idle pixels and corrects the
  active cadence to one complete sprite, authorizing only the remaining motion
  for Bramblewing Scout.
- Approval: after the exact labeled all-four-direction raw/no-outline and
  Complete B + Form full-suite boards and GIFs were presented together and
  opened in Aseprite, the designer replied `approved` on 2026-08-09. This
  approves only the frozen 80-frame candidate and authorizes bounded branch
  publication.
- Contract cards: Fairy (`bramblewing-scout`, `thistle-hexer`,
  `petalcrown-duelist`), Hag (`mire-crone`, `cauldron-hexer`,
  `blackthorn-matron`), Dryad (`grove-tender`, `spore-cantor`,
  `heartwood-warden`), Redcap (`barrow-stalker`, `ironboot-trapper`,
  `bloodcap-reaver`), and Nymph (`spring-dancer`, `mist-weaver`,
  `rivercrown-muse`). At this published checkpoint only Bramblewing Scout was
  implemented; every other variant and family remained contract-only.
- Identity: a compact plum-haired, pointed-ear fey with leaf-green dress
  planes, small gold fasteners, and paired pale-mint open-lattice wings. The
  body remains clear of the ground and the wings remain connected body parts.
- Transparency policy: the standard binary-alpha contract is unchanged.
  Translucency is suggested with connected opaque rim/vein pixels around
  deliberate transparent negative-space windows; there is no partial-alpha
  membrane. Glow, pollen, sparkles, trails, and impact light remain external.
- Animation scope: exact approved Idle F1-F2, four distinct hover-travel Walk
  frames, four attached thorn-needle Attack poses, exact Cast-to-Attack aliases,
  white-recoil/colored-brace Hurt H1-H2, and exact Death aliases H1,H2,H2,H2.
- Review evidence: raw / Complete B + Form `1428x760` boards
  `b154d3023c75bb06bb6c7312aa4327aa935723cdd7a0ea1d0165a851d3c20200` /
  `3349fe0ebd8ce719b172d64dccaf940bf0e842679e4ee13700fa7182cdf5a650`;
  raw / Complete B + Form `640x672` labeled four-phase GIFs
  `9812b570435f45a8efad77fcdf380f6ec159f73ad950967ed5d1889148958efa` /
  `662af552ce31a84761001f86b95de3db6149419111b7ff592dca22aa8d57cb57`.
- Focused validation passes 80/80 connected, bounded, ground-clear frames;
  preserves all 8/8 approved Idle frames byte-for-byte; retains 72/72 colored
  hard-alpha wing-window frames and 8/8 exact white alias flashes; enforces
  side mirrors and Cast/Death aliases; and measures opaque range 132-159,
  6,362 Complete B additions, and 5,274 Form changes. Candidate digest:
  `0cb24229c55bc9e719dc288ac57ec87c7fba4c4d244bd5e0273e757af09da9a3`.
- Protected EN-E05 consumers pass at 74/245 and 320/320 frames; approval-state
  fast validation passes in `52.7s`; full validation passes in `102.5s`; all
  232 committed PNG fixtures remain frozen.
- Firewall: the candidate registry exposes zero public families; `fairy` is
  absent from `PUBLIC_ENEMIES`, `sprite-engine.js`, and the asset-pack manifest.
- Exclusions at this published checkpoint: Fairy specialist/elite art,
  Hag/Dryad/Redcap/Nymph art,
  registration, consumers, fixture work, effects, release, EN-E07, and later
  Wave 2 work.
- Publication state: the exact approved seventeen-file implementation is
  published at `cc92ca9`. The later separate continuation below opens only
  Thistle Hexer.

#### Approved Fairy Thistle Hexer complete suite

- Gate ID: `en-e06-fairy-thistle-hexer-full-v1`; status:
  `approved`, internal, committed, and pushed at `3dc68cb` on
  `codex/en-e06-fairy-thistle-hexer`, based exactly on clean published Fairy
  reconciliation `c1165dfc901a39723dd61122bc26f9c5d1a3315c`.
- Authorization: after Bramblewing approval/publication, the designer asked
  whether enemy variations were still being made. The sequence was confirmed
  as one complete variant at a time: Bramblewing Scout, Thistle Hexer,
  Petalcrown Duelist, then Hag. The designer replied `nono thats good with just
  1 at the time i was just wondering`, followed by `lets do next` on
  2026-08-09. This authorizes only specialist Fairy Thistle Hexer.
- Approval: after the exact labeled all-four-direction raw/no-outline, Complete
  B + Form, and Bramblewing comparison boards plus paired full-suite GIFs were
  presented, and the three PNGs were opened directly in Aseprite, the designer
  replied `awesome! approved` on 2026-08-09. Approval applies only to the
  frozen 80-frame candidate and authorizes bounded commit and branch
  publication.
- Scope: one private 80-frame specialist Fairy across Idle, Walk, Attack, Cast,
  Hurt, and Death for Down, Left, Right, and Up. The approved Bramblewing suite
  remains exact. Petalcrown Duelist and all Hag/Dryad/Redcap/Nymph art remain
  contract-only.
- Identity: rose-skinned dark-violet-haired fey with a tall green-and-lilac
  thorn crown, long violet robe, narrow folded thistle wings, bronze fasteners,
  and an attached thorn focus. Every candidate frame and alpha silhouette
  differs from Bramblewing Scout.
- Transparency/effect policy: standard binary alpha is unchanged. Connected
  folded-wing rims preserve deliberate transparent negative space. Partial
  alpha, curse motes, pollen, glow, projectiles, thorn trails, impact flashes,
  and summoned briars remain external effects.
- Animation scope: two distinct Idle poses, four translated Walk poses, four
  connected-focus Attack poses, exact Cast-to-Attack aliases, white-recoil and
  colored-brace Hurt H1-H2, and exact Death aliases H1,H2,H2,H2. Left mirrors
  Right exactly.
- Review evidence: raw / Complete B + Form `1428x760` boards
  `bcfcc701f7d87edc3291466dcf86670aaef75f44f104ae3acde45f344d688f1e` /
  `13901a2b1a4accf64cb3174f8ae4dc812b645effed53cb44916bfa11c3573d1f`;
  Bramblewing comparison `910x548` board
  `b615fb38c2be151f17e0f252cb923ed2cd9f67fca50b8c047c392ae4bdbe65fa`;
  raw / Complete B + Form `640x672` four-phase GIFs
  `b5610fdb8c0aa465cbba9667801c56b62ddeb8ed2b9e37c3cfa20b5cb4504b94` /
  `61dbf81601010068f09e08ba0226f80870f1bf4f4ec5acf2099e6af58f8eebcd`.
- Focused validation: 80/80 connected, one-cell-bounded, ground-clear frames;
  80/80 pixel frames and 80/80 alpha silhouettes differ from Bramblewing;
  72/72 colored folded-wing frames; 8/8 exact white alias flashes; exact side
  mirrors and Cast/Death aliases; opaque range 157-180; 5,892 Complete B
  additions; 5,584 Form changes; candidate digest
  `675b5a8957efdc81c07ae53c4b013ad8229847fc84d9b1c0c8da4ad09e6a4534`.
- Protected boundaries: the approved Bramblewing full/Idle gates remain exact;
  EN-E05 consumers remain 74/245 and 320/320; all 232 fixtures remain frozen;
  `fairy` remains absent from the public catalog, engine facade, and manifest.
  Approval-state fast validation passes in `62.4s` and full validation in
  `108.6s`.
- Exclusions: Petalcrown Duelist, Hag/Dryad/Redcap/Nymph art, registration,
  consumers, fixture work, effects, release, EN-E07, and later Wave 2 work.
- Publication state: the exact hash-frozen and visually approved sixteen-file
  implementation is published at
  `3dc68cbae16acd2564d81607ac5a1ca1d569fbee`. Stop before Petalcrown Duelist or
  Hag; either requires a separate continuation.

#### Approved Fairy Petalcrown Duelist complete suite

- Gate ID: `en-e06-fairy-petalcrown-duelist-full-v1`; status:
  `approved`, internal, and published at `b265e97` on
  `codex/en-e06-fairy-petalcrown-duelist`, based exactly on clean published
  Thistle reconciliation `581bff99e2a99fc99b77402baffe2911b5a2ee47`.
- Authorization: after the exact Thistle Hexer lane was approved and published,
  the designer said `lets do next` on 2026-08-09. Under the confirmed one-
  complete-sprite cadence, this opens only elite Fairy Petalcrown Duelist.
- Approval: after the exact raw, Complete B + Form, and three-Fairy comparison
  PNGs plus paired GIFs were presented, and the three PNGs were opened in
  Aseprite, the designer replied `approved` on 2026-08-09. Approval applies only
  to the frozen 80-frame lane and authorizes bounded commit and branch publication.
- Scope: one private 80-frame elite Fairy across Idle, Walk, Attack, Cast, Hurt,
  and Death for Down, Left, Right, and Up. Approved Bramblewing Scout and
  Thistle Hexer remain exact. Hag/Dryad/Redcap/Nymph art remains contract-only.
- Identity: a broad, denser elite fey with dark-teal hair, rose petal armor,
  pale-pink crown-wings, green leaf joints, gold clasps, and a connected
  silver-blue petal rapier. Every candidate frame and alpha silhouette differs
  from both approved Fairy variants.
- Transparency/effect policy: standard binary alpha remains exact. Connected
  crown-wing geometry surrounds deliberate negative space. Dash trails, petal
  motes, wind arcs, detached blade glints, impact flashes, and detached petals
  remain external effects.
- Animation scope: two wide crown-wing Idle guards, four aerial-fencing Walk
  phases, four connected-rapier Attack phases, exact Cast-to-Attack aliases,
  white-recoil and colored-brace Hurt H1-H2, and exact Death aliases
  H1,H2,H2,H2. Left mirrors Right exactly.
- Review evidence: raw / Complete B + Form `1428x760` boards
  `74b6b4935ef9708c13396104d80589f67c9de5b189f44dac5c455ea33c45c7cc` /
  `784cfcd2041c8851491ebf38112b48b03d45d48715199907923950022b6f00ff`;
  three-Fairy comparison `1192x548` board
  `693a6fcdf88a96be3e6d14b55cd65286eb71aa1015934b5b2fef02272cc40b42`;
  raw / Complete B + Form `640x672` four-phase GIFs
  `e98a5427e67d7abc15467cb630634ce57b63f3f6541aa0abb3bc73c19bd673c6` /
  `f11e102b7846f3d3ee2b47f1c56493493906fd6e0364046d8ae5964ea8c5ba10`.
- Focused validation: 80/80 connected, one-cell-bounded, ground-clear frames;
  80/80 pixel and alpha-silhouette distinctions from Thistle and again from
  Bramblewing; 72/72 colored crown-wing frames; 8/8 exact white flashes; exact
  aliases/mirrors; opaque range 193-236; 6,266 Complete B additions; 9,279 Form
  changes; candidate digest
  `69de53e0b10aa80ef10afa7e3e8b6a9d913af81a365535f52e3f4be71945bd5c`.
- Protected boundaries: approved Bramblewing full/Idle and Thistle full gates
  pass unchanged; EN-E05 consumers remain 74/245 and 320/320; all 232 fixtures
  remain frozen; `fairy` remains absent from the public catalog, engine facade,
  and asset-pack manifest. Approval-state fast validation passes in `54.9s`
  and full validation passes in `107.2s`.
- Exclusions: Hag/Dryad/Redcap/Nymph art, registration, consumers, fixture work,
  shared renderer/schema/interface changes, effects, release, EN-E07, and later
  Wave 2 work.
- Publication state: the exact approved Petalcrown implementation is published
  at `b265e972e719d6b697c99085503a1f2ea341da61`. Stop before Hag, Fairy
  registration, fixtures, or broader Wave 2 work; each requires a separate continuation.

#### Approved Hag Mire Crone complete suite

- Gate ID: `en-e06-hag-mire-crone-full-v1`; status: `approved`, internal, and
  published at `25f67d4014437841f855ace2055de32abfeeaeeb` on
  `codex/en-e06-hag-mire-crone`, based exactly on clean Petalcrown publication
  record `5c9363e`.
- Authorization: after the exact Petalcrown lane was approved and published,
  the designer said `lets do nextr` on 2026-08-09. This opens only common Hag
  Mire Crone under the one-complete-sprite cadence.
- Scope: one private 80-frame common Hag across Idle, Walk, Attack, Cast, Hurt,
  and Death for Down, Left, Right, and Up. All three approved Fairies remain
  exact. Later Hags, Dryad, Redcap, Nymph, registration, and fixtures stay closed.
- Identity: moss skin, amber eyes, rope-gray hair, hooked nose, long claws,
  mud-dark shawl, swamp dress, crooked shoulders, bowed trunk, and planted
  splayed feet. No staff, hat, robe, familiar, or cauldron is baked into the
  actor, keeping Hag distinct from the public equipped Witch.
- Animation/effect policy: two uneven Idle poses, four grounded crooked-shuffle
  Walk phases, four connected coil/rise/rake/recovery Attack phases, exact
  Cast-to-Attack aliases, white-recoil and colored-brace Hurt, exact Death
  aliases H1,H2,H2,H2, and exact side mirroring. Hexes, charms, fumes,
  familiars, auras, trails, and impacts remain external.
- Review evidence: raw / Complete B + Form `1428x760` boards
  `d0d878509e17455d8c0ea26e2a12bbd8338fcd1b6cdd799d6f8e4052175a742e` /
  `b03473eb7339de3d6e16094f931b5f1f4ace6a7b790a942fc37eed458a440cd3`;
  Witch comparison `910x548` board
  `a3ded6138931636c5ad44354b833ce5467bce36d5e5a65d943b1b7c6b68e6594`;
  raw / Complete B + Form GIFs
  `79cdc9bb9b1514c03b057f401b4baeb1732349445b11bed5254c84e5e1201ec2` /
  `fda5caed4a6bacfd36f8e76afddcc81e195d390a96c3d5e47c61c4cfa9b195df`.
- Focused validation: 80/80 connected, one-cell-bounded, grounded frames;
  80/80 pixel and alpha-silhouette distinctions from public Witch/Hexer;
  72/72 colored identity frames; 8/8 exact white flashes; opaque range 224-246;
  7,692 Complete B additions; 8,406 Form changes; candidate digest
  `f35512e73fd7b2308bf408f11c2d21a30631361214a372df7bef2e8fc4e6478d`.
- Approval/publication: the three exact PNGs were opened directly in Aseprite
  and presented with the paired GIFs. The designer replied `approved` on
  2026-08-09. The bounded implementation is published at `25f67d4`. Stop before
  registration, fixture work, Cauldron Hexer, Dryad, effects, or broader Wave 2.

#### Approved Hag Cauldron Hexer complete suite

- Gate ID: `en-e06-hag-cauldron-hexer-full-v1`; status: `approved`, internal,
  and published at `4b59b4098caf6397719fba6d21c27c5f8dcd82b0` on
  `codex/en-e06-hag-cauldron-hexer`, based exactly on clean Mire Crone handoff
  `b4ad5cd`.
- Authorization: after Mire Crone approval and publication, the designer said
  `next` on 2026-08-09. This opens only specialist Hag Cauldron Hexer under the
  one-complete-sprite cadence.
- Identity: the approved stooped feral-Hag chassis gains moss-gold skin,
  charcoal rope hair, plum shawl, teal brewer apron, luminous bottle belt, and
  a connected copper hooked ladle. The cauldron is not part of the sprite.
- Animation/effect policy: two brewer Idle poses, four grounded shuffle Walk
  phases, four connected ladle coil/rise/sweep/recovery Attack phases, exact
  Cast-to-Attack and Death-to-Hurt aliases, and side mirroring. Cauldron, fumes,
  thrown brews, liquid arcs, projectiles, familiars, auras, trails, and impacts
  remain external.
- Review hashes: raw / Complete B + Form boards
  `92e6961d04ee9232179e4b080937247ac5eb8eb26fcad80308f5ceaca8a2fe43` /
  `aaa2a749a45b7ab5e2b0e54bd30a4e2b1510c05f28686b8795849be02760adfa`;
  Mire comparison `ab12e7ca5e6ffdf0066357dacf8a9d88182affe3dfcd990f483cd0a5ba0de913`;
  raw / Complete B + Form GIFs
  `2d95a1eb19edf91a694f699bcb377c3f54110dfb24e0d13b55a3718fe2dd2b24` /
  `4af1ac19b43566de6043f1dc20282d085968d1cae317dc6c7a2942fc38902577`.
- Focused validation: 80/80 connected, one-cell-bounded, grounded frames;
  80/80 pixel and alpha-silhouette distinctions from approved Mire Crone;
  72/72 colored brewer frames; 8/8 white flashes; opaque range 228-251;
  7,764 Complete B additions; 6,575 Form changes; candidate digest
  `17f40220730fe4e83be26156d73e0599235be66a9290284b37cb9c8282c7a1a6`.
- Approval/publication: the exact three PNGs were opened in Aseprite and
  presented with the paired GIFs. The designer replied `approved lets do next`
  on 2026-08-09. The bounded implementation is published at `4b59b40`; the same
  reply opens only Blackthorn Matron after publication. Registration, fixtures,
  Dryad, effects, and broader Wave 2 remain separate gates.

#### Approved Hag Blackthorn Matron complete suite

- Gate ID: `en-e06-hag-blackthorn-matron-full-v1`; status: `approved`,
  internal, committed at `8ce2f2a5189c9498e1ace39aab70b9827a4ff0ae`,
  and published on
  `codex/en-e06-hag-blackthorn-matron`, based exactly on clean Cauldron
  publication handoff `0a096fa`.
- Authorization: the designer's `approved lets do next` approved Cauldron and
  opens only this one complete elite Hag pass.
- Identity: bark-olive skin, black-plum rope hair, blood-briar armor, ember
  eyes, bone claws, a connected asymmetrical hooked crown, broad pauldrons,
  plated shawl mass, and a heavier reinforced rake.
- Animation/effect policy: two crown-settle Idle poses, four heavy grounded
  Walk phases, four armored claw coil/rise/rake/recovery Attack phases, exact
  Cast and Death aliases, and exact side mirroring. Detached thorns, briar
  trails, curse motes, hexes, charms, fumes, familiars, trails, and impacts
  remain external.
- Review hashes: raw / Complete B + Form boards
  `6f2ed670a65ac2215c818afb95d7f7a3f7183af7781506705be459962aa63315` /
  `2f93b79eeadca993f6e6b18921942d5a51d8d7cf3ec5a43bab1ac4665011aa37`;
  three-Hag comparison
  `cd423efc081d32cc6979a192a3dbedceab7c94431737d3a32dc4cb2abce2eb2c`;
  raw / Complete B + Form GIFs
  `35c42c7916bdec51264544e43fe468551d0c8111d9d4d896c766ce25bf1b1c46` /
  `d9ccd666b71575748cc513f0ffae1faeeea0d7e90ded104fced891359189e7dc`.
- Focused validation: 80/80 connected, one-cell-bounded, grounded frames;
  80/80 pixel and alpha-silhouette distinctions from both approved Hags;
  72/72 colored briar frames; 8/8 white flashes; opaque range 246-266;
  9,368 Complete B additions; 6,023 Form changes; candidate digest
  `d4588d754e01dbb4916949f27b801342a310706890a0532a0133216d7cb0c7a9`.
- Approval/publication: the exact three PNGs were opened in Aseprite and
  presented with the paired GIFs. The designer replied `approved` on
  2026-08-09. The bounded implementation is published at `8ce2f2a`.
- Stop gate: wait for a separate continuation. Do not register Hag, generate
  fixtures, start Dryad, add effects, release, or broaden Wave 2 without
  explicit authorization.

#### Approved Dryad Grove Tender complete suite

- Gate ID: `en-e06-dryad-grove-tender-full-v1`; status: `approved` and recorded
  for publication on `codex/en-e06-dryad-grove-tender`, based exactly on clean
  Blackthorn publication handoff `8e56ec2`. The bounded implementation is
  `3d96fedc6127b09949befd06a5d177890f45dc05`.
- Authorization: after Blackthorn approval and publication, the designer said
  `cool next please` on 2026-08-09. This opens only one complete common Grove
  Tender under the one-sprite cadence.
- Identity: an ordinary-height slim living-wood fey with warm bark skin,
  narrow heartwood torso, green leaf crown and mantle, pale sapwood joints,
  small blossoms, amber eyes, root hems, and one connected forked branch arm.
  It remains humanoid-fey rather than a broad reduced Treant.
- Animation/effect policy: two mantle-settle Idle poses, four rooted-looking
  mobile Walk phases, four branch draw/fork/sweep/recovery Attack phases, exact
  Cast and Death aliases, and exact side mirroring. Vines, spores, roots,
  detached leaves, pollen, summoned plants, trails, projectiles, and impacts
  remain external.
- Review hashes: raw / Complete B + Form boards
  `ea4bd10e6346a47e89f0af71c0e853ec044a45ec3319364a4f835e25971ab32e` /
  `4b38f46649936e41061c95cc74509cec3d2b804d11ca24d3fa070fca0d5d02d0`;
  Treant / Blackthorn / Grove comparison
  `3d4b44be63e87e55aef0b2c1cb36fc8b65e7960a0740029a1b10852bce3cdf40`;
  raw / Complete B + Form GIFs
  `917b5df1871998cceb05329aef8b7a32c351beaf2b2da66524e6b5a4e3ba4aa2` /
  `d573b892daab216446e5c5e4f45f6eeda2c803126ee835fbc871e5759dfeeadb`.
- Focused validation: 80/80 connected, one-cell-bounded, grounded frames;
  80/80 pixel and alpha-silhouette distinctions from public Treant and
  approved Blackthorn; 72/72 colored living-wood frames; 8/8 white flashes;
  opaque range 213-257; 8,763 Complete B additions; 8,690 Form changes;
  approved implementation digest
  `18fedaf06c457c8a280b3c5518b0763be48de3b3cb5bd29113f0fd5d183e3a21`.
- Approval: the exact three PNGs were opened in Aseprite and presented with the
  paired GIFs; the designer replied `approved lets do nexrt` on 2026-08-09.
- Publication: bounded implementation `3d96fed` and approval record `4c49f27`
  are published on `codex/en-e06-dryad-grove-tender`.

#### Approved Dryad Spore Cantor complete suite

- Gate ID: `en-e06-dryad-spore-cantor-full-v1`; status: `approved`, internal,
  and published on `codex/en-e06-dryad-spore-cantor`, based exactly on clean
  Grove Tender publication handoff `4c49f27`.
- Authorization: after approving Grove Tender, the designer replied
  `approved lets do nexrt` and explicitly confirmed its exact push on
  2026-08-09. This opens only one complete specialist Spore Cantor.
- Identity: an ordinary-height slim living-wood fey with cool bark, a broad
  connected violet fungal crown, pale gill collar, teal mycelium, asymmetric
  coral shelf fungi, amber eyes, connected fruiting bodies, and root hems.
- Animation/effect policy: crown/gill-breath Idle, rooted mobile Walk,
  crown-and-arm draw/chorus-rise/sweep/recovery Attack, exact Cast and Death
  aliases, and exact side mirroring. Spore clouds, drifting motes, loose spores,
  detached caps, summoned fungi, vines, roots, trails, projectiles, impacts,
  and glows remain external.
- Review hashes: raw / Complete B + Form boards
  `8d1ef13a9967ca442139435ab52e5ade356aed328affa640c394426fd6df623a` /
  `dd7be56b97571c1c203e32f1ccccbd99a30476482d1c881b4596b8301f750d81`;
  Treant / Grove / Spore comparison
  `d923c4f60da5e1a59cbd363713b72e47d526a26f5f0c7266a3cb76bb2fa562cc`;
  raw / Complete B + Form GIFs
  `835fab9de60ff4a39cc4235a6dc620ae88a6cf3009999420029f589bc15d40ed` /
  `843d3cc7bdbb9d224503c5d658b14c7bfc19bc7327c2724be8ea25e3b572d9ef`.
- Focused validation: 80/80 connected, one-cell-bounded, grounded frames;
  80/80 pixel and alpha-silhouette distinctions from public Treant and approved
  Grove Tender; 72/72 colored fungal-crowned frames; 8/8 white flashes; opaque
  range 224-262; 8,963 Complete B additions; 9,030 Form changes; approved
  digest `b22585e7b055f4ae43eb1293741967c1d76ec9bd3b842320880f2038c0cf62ef`.
- Approval: the exact raw, Complete B + Form, and comparison PNGs were opened
  in Aseprite and presented with both GIFs. After specifically requiring the
  outlined presentation, the designer approved the exact packet on 2026-08-09.
- Publication: bounded implementation `46d1dc9` and approval record `61d1fa4`
  are published on `codex/en-e06-dryad-spore-cantor`.
- Historical stop gate: that approval did not authorize Heartwood Warden. The
  designer's later continuation below opens it separately.

#### Dryad Heartwood Warden complete suite approved

- Gate ID: `en-e06-dryad-heartwood-warden-full-v1`; status: `approved`,
  internal, with implementation committed at
  `8a790e3f0d02cf64763733f83d17890c79ce83fc` on
  `codex/en-e06-dryad-heartwood-warden`, based exactly on clean pushed
  integration/export checkpoint
  `90ac018923fbaa9906cd47cdc9ef22f0db77336a`.
- Authorization: after that checkpoint was published, the designer said `hey
  lets keep going with the 80 enemies plan`. Following the documented Dryad
  role order, this opens only one complete elite Heartwood Warden.
- Approval: the exact labeled raw/no-outline and Complete B + Form animations
  plus the four-way comparison were presented, and all three exact PNG boards
  were opened together in Aseprite. The designer replied `approved` on
  2026-08-09. Approval applies only to the frozen 80-frame digest below and
  authorizes its bounded approval record and branch publication.
- Identity: dense ordinary-height living-wood fey with deep red heartwood,
  warm cambium seams, evergreen crown leaves, connected branch pauldrons,
  ringed breastplate, short crown prongs, reinforced root greaves, and one
  visibly forking warding arm. It remains upright and fey-scaled rather than a
  broad public Treant.
- Animation/effect policy: pauldron-and-crown-settle Idle, heavy rooted Walk,
  heartplate brace/warding-bough draw/connected-fork guard/recovery Attack,
  exact Cast and Death aliases, and exact side mirroring. Protective auras, sap
  glow, bark shards, detached leaves, acorns, vines, root eruptions, shield
  blooms, summoned plants, trails, projectiles, impacts, and ground cracks
  remain external.
- Review hashes: raw / Complete B + Form `1428x760` boards
  `da3f003a61494a3414fe6c87e5f926c9257cb6c8b52e466cb5e82d9306467447` /
  `488014aaaedc10c7c43ba8db12e3f2d302d482d477ba2c2272dbeddfbdaca1da`;
  Treant / Grove / Spore / Heartwood `1520x548` comparison
  `75bbdd038bf0af049fa533ab8ae2e1fd372ff2b177d60c6f6bc7789f5550a603`;
  raw / Complete B + Form `640x672` GIFs
  `3d10b4482f09eec6ca4f190068773c0ee5a8b92e8cd49c7e3ca180b8bd1cad0f` /
  `99ab8665236d9d8b43f692f5ca49322f04de0313109852fbf500d8871f01a995`.
- Focused validation: 80/80 connected, one-cell-bounded, grounded hard-alpha
  frames; 80/80 pixel and alpha-silhouette distinctions from public Treant,
  approved Grove Tender, and approved Spore Cantor; 72/72 colored
  branch-armored frames; 8/8 exact white flashes; opaque range 236-270; 9,551
  Complete B additions; 6,643 Form changes; candidate digest
  `fb7b50a0fefda66995c5e81f3e07c0c080893902a33d304066e79fb8181cd97c`.
- Protected boundaries: all eight previously approved EN-E06 suites remain
  exact; public catalog stays 80/259 with two public Dryad variants; all 232
  committed fixtures remain untouched; the candidate is absent from public
  facade, selectors, packs, manifest, and exports.
- Broader validation: all nine affected EN-E06 predecessor gates, the exact
  1,200-frame approved-integration gate, `check:fast`, and the full project
  suite pass; the full run completes in 121.5s with all 232 fixtures valid.
- Publication: implementation `8a790e3f0d02cf64763733f83d17890c79ce83fc`
  and approval record `d8c13bb008e3a186daa73a37eec87c707f30365f` are
  committed and pushed on the tracked branch.
- Required next action: stop at this clean published checkpoint. Do not alter
  registration, start Redcap or Nymph, generate fixtures, add effects, release,
  or open EN-E07 without another explicit authorization.

#### Redcap Barrow Stalker complete suite approved

- Gate ID: `en-e06-redcap-barrow-stalker-full-v1`; status: `approved` on
  `codex/en-e06-redcap-barrow-stalker`, based
  exactly on published Heartwood handoff `72c5d7c`.
- Authorization: after Heartwood Warden was approved, committed, pushed, and
  reconciled, the designer said `cool lets do next` on 2026-08-10. Under the
  frozen EN-E06 family order this opens only common Redcap Barrow Stalker.
- Approval: the exact labeled raw/no-outline and Complete B + Form animations
  plus the four-way comparison were presented, and all three exact PNG boards
  were opened together in Aseprite. The designer replied `approved` on
  2026-08-10. Approval applies only to the frozen digest below and authorizes
  its bounded approval record and branch publication.
- Scope: one private complete 80-frame common Redcap. Ironboot Trapper,
  Bloodcap Reaver, Nymph, registration, fixtures, effects, release, and EN-E07
  remain closed.
- Identity: a very short broad grave-ambusher with an oversized drooping
  blood-red cap, long fey ears, compact brown coat, connected hooked hand bill,
  and two massive planted iron boots.
- Effects firewall: blood spray, ground chips, weapon trails, trap markers,
  snare lines, grave dust, impact flashes, and detached hook glints remain
  external.
- Motion: two cap/hook Idle poses; four iron-boot Walk stomps; four connected
  shoulder-drop, hook-draw, upward-cleave, and low-recovery Attack poses; exact
  Cast-to-Attack aliases; white-recoil and colored-brace Hurt; exact Death
  aliases H1,H2,H2,H2; exact side mirrors.
- Focused validation: 80/80 connected, bounded, grounded hard-alpha frames;
  80/80 pixel and alpha distinctions from public Goblin Scout, public
  Hobgoblin, and approved Mire Crone; 72/72 colored identity frames; 8/8 exact
  white flashes; opaque range 243-288; Complete B +7,556; Form changes 10,196.
- Candidate digest:
  `1719f8611f212cfbacf041fc8459d3f52390b05aa73e0a1d50203554845051f1`.
- Evidence SHA-256: raw
  `caaacab0cf2f96c7f9b6832417998662bffdb4d348999d6b212e839cc232bb14`;
  Complete B + Form
  `861574fad545675f022450d2d0975914952ac25898dee81e056d87d015fb44b6`;
  comparison
  `0995d0e4d9919648fee443e433a11bcd512e6c5ae176e38dd26e0f802a239d8f`;
  raw GIF `550b963d530de716f3cb5fc067bc459a0dce4c2f3492b984fee9b1db7a8bd33f`;
  Complete B + Form GIF
  `669f64872e063696a7cdcc3ac1072e28818282c7906db60d7dce510e9730406a`.
- Publication: the exact frozen implementation
  `c3544dc4ec06e06afb15ea699333119342a8946f` and approval record
  `8e2054236a49ab06b7cac404cda8b12bb440085c` are committed and pushed on the
  tracked branch.
- Required next action: stop at this clean published checkpoint. Do not
  register Redcap, begin Ironboot Trapper, Bloodcap Reaver, or Nymph, generate
  fixtures, add effects, release, or open EN-E07.

#### Redcap Ironboot Trapper complete suite approved

- Gate ID: `en-e06-redcap-ironboot-trapper-full-v1`; status: `approved` on
  `codex/en-e06-redcap-ironboot-trapper`, based exactly on clean published
  Barrow handoff `3cb794da9078056d51eaa23137cf67c9782aa77d`.
- Authorization: after Barrow Stalker was approved, committed, pushed, and
  reconciled, the designer said `next` on 2026-08-10. Under the frozen Redcap
  role order this opens only specialist Ironboot Trapper.
- Approval: the exact labeled raw/no-outline and Complete B + Form animations
  plus the four-way comparison were presented, and all three exact PNG boards
  were opened together in Aseprite. The designer replied `approved` on
  2026-08-10. Approval applies only to the frozen digest below and authorizes
  its bounded approval record and branch publication.
- Scope: one private complete 80-frame specialist Redcap. Bloodcap Reaver,
  Nymph, registration, fixtures, effects, release, and EN-E07 remain closed.
- Identity: a short broad trapper with a flat riveted rust-red cap, long fey
  ears, moss-dark coat, asymmetric ochre buckle harness, leather apron,
  connected trap-setting tongs, and enormous square-toed iron boots.
- Effects firewall: blood spray, ground chips, weapon trails, placed traps,
  trap markers, snare lines, loose chains, grave dust, impact flashes, and
  detached tong glints remain external.
- Motion: two cap/tong Idle poses; four heavy square-boot Walk stomps; four
  connected brace, jaw-open, downward-clamp, and closed-recovery Attack poses;
  exact Cast-to-Attack aliases; white-recoil and colored-brace Hurt; exact Death
  aliases H1,H2,H2,H2; exact side mirrors.
- Focused validation: 80/80 connected, bounded, grounded hard-alpha frames;
  80/80 pixel and alpha distinctions from public Goblin Scout, public
  Hobgoblin, and approved Barrow Stalker; 72/72 colored identity frames; 8/8
  exact white flashes; opaque range 268-303; Complete B +7,918; Form changes
  11,251. All twelve EN-E06 gates and the exact 1,200-frame approved-integration
  gate pass; `check:fast` passes in 55.4s and full `check` in 105.5s with all
  232 fixtures valid.
- Candidate digest:
  `31c37fd25d688bd295c2fb84bdb437141149cf43986b6edcc4141467bc32bdf1`.
- Evidence SHA-256: raw
  `139776b84be26585b3bc3d23118a0c55f2f6cdac176b0747b070e10f2f88e8ed`;
  Complete B + Form
  `dd606da11e8c9718c35c02b16dbd630f6715514d6def26b1527e8188300d4609`;
  comparison
  `bd4b88450b0edb8fc3559049ec0013024573f8cc85ca3a3f33a5cc0142b4e5f7`;
  raw GIF `a38ca4cc31e178299096d67df27a54fbcb4ec1eab8c71438786cc9931b550a17`;
  Complete B + Form GIF
  `83b71e030b9f2fe61526c0014a350d43c8e5b68c7a89675890ec1dc148b9c927`.
- Publication: the exact frozen implementation
  `98865936244b94860985210fcaf9a044b0ca228a` and approval record
  `00a9876f963522c88b9cd77f809bec3674d72b19` are committed and pushed on the
  tracked branch.
- Required next action: stop at this clean published checkpoint. Do not
  register Redcap, begin Bloodcap Reaver or Nymph, generate fixtures, add
  effects, release, or open EN-E07.

#### Redcap Bloodcap Reaver complete suite approved

- Gate ID: `en-e06-redcap-bloodcap-reaver-full-v1`; status: `approved` on
  `codex/en-e06-redcap-bloodcap-reaver`, based exactly on clean published
  Ironboot handoff `dc6d524ec2d7d980b5407de75a33c00af7819de7`.
- Authorization: after Ironboot Trapper was approved, committed, pushed, and
  reconciled, the designer said `cool lets do nexrt` on 2026-08-10. Under the
  frozen Redcap role order this opens only elite Bloodcap Reaver.
- Approval: the exact labeled raw/no-outline and Complete B + Form animations
  plus the Hobgoblin/Barrow/Ironboot/Reaver comparison were presented, and all
  three exact PNG boards were opened together in Aseprite. The designer replied
  `approved` on 2026-08-10. Approval applies only to the frozen digest below.
- Scope: one private complete 80-frame elite Redcap. Nymph, registration,
  fixtures, effects, release, and EN-E07 remain closed.
- Identity: a high torn blood-crimson cap, long ears, blackened shoulder and
  chest armor, dark leather, reinforced boots, and a connected broad cleaver.
- Effects firewall: blood spray, weapon trails, ground chips, grave dust,
  impact flashes, and detached cleaver glints remain external.
- Motion: two cap/cleaver Idle poses; four heavy armored Walk stomps; connected
  shoulder-windup, overhead-rise, downward-hew, and low-recoil Attack poses;
  exact Cast-to-Attack aliases; white-recoil and colored-brace Hurt; exact Death
  aliases H1,H2,H2,H2; exact side mirrors.
- Focused validation: 80/80 connected, bounded, grounded hard-alpha frames;
  80/80 pixel and alpha distinctions from public Goblin Scout, public
  Hobgoblin, approved Barrow Stalker, and approved Ironboot Trapper; 72/72
  colored identity frames; 8/8 exact white flashes; opaque range 300-338;
  Complete B +7,241; Form changes 7,126. All thirteen EN-E06 gates and the exact
  1,200-frame approved-integration gate pass; approval-state `check:fast` passes
  in 56.3s and full `check` in 106.4s with all 232 fixtures valid.
- Candidate digest:
  `e9a41fd37e19d96911cfffee3bd89e3859f9cbb95099996632f877da2dbdabff`.
- Evidence SHA-256: raw
  `4a6a8f756af4992812a2884302e859da2ed0bc80feeb1810f465bae52beeee84`;
  Complete B + Form
  `1b3bfcf8ada4aa9c45deb163ec80595f98598f4b5604954d5f59ed24074f9042`;
  comparison
  `884fcc0fc3fc6ef4c700623eb1e189b6db7d9e29b426602f0a79087d2ca18b13`;
  raw GIF `2f4d7aeb3d6be6399e25de7e7cf2a48ad1dd971e27bf2ac29fa382a63e2ce25a`;
  Complete B + Form GIF
  `f1adf9f61c4adf3e62bff9b44e37dce5f84c054cbba6fbd6a5fba2d7e5e4640b`.
- Publication: the exact frozen implementation
  `1a1ba00ea1edfa6e8bd946e95f5e35c6080ce73a` and approval record
  `5c55af26481f9a79988382df3d67b8ff33b765a4` are committed and pushed on the
  tracked branch; review artifacts remain ignored evidence.
- Required next action: stop at this clean published checkpoint. Do not
  register Redcap, begin Nymph, generate fixtures, add effects, release, open
  EN-E07, or infer another art gate without explicit authorization.

#### Nymph Spring Dancer complete suite approved and published

- Gate ID: `en-e06-nymph-spring-dancer-full-v1`; status: `approved` on
  `codex/en-e06-nymph-spring-dancer`, based exactly on clean Bloodcap handoff
  `f4ac500d39da0ac2ecd033c939ac582d06c2d052`.
- Authorization: the designer said `lets do next` after Bloodcap publication;
  the family and role order opens only common Spring Dancer.
- Scope: one private complete 80-frame common Nymph. Mist Weaver, Rivercrown
  Muse, registration, fixtures, effects, release, and EN-E07 remain closed.
- Identity and motion: flowing willow hair, pointed ears, leaf-fastened dress,
  connected rose ribbon hem, light dance steps, low sweep, overhead turn,
  forward fan, low recovery, exact Cast/Death aliases, and exact side mirrors.
- Validation: 80/80 connected, bounded, grounded hard-alpha frames; 80/80 pixel
  and alpha distinctions from Elf Mage, Bramblewing Scout, and Grove Tender;
  72/72 colored frames; 8/8 white flashes; opaque range 266-304; Complete B
  +7,925; Form changes 11,050. All fourteen EN-E06 gates, integration,
  `check:fast` (57.2s), and full `check` (107.6s) pass with 232 fixtures valid.
- Candidate digest:
  `b68906d962e16611384e419610324c6a9934d63ab329963f0734e83255dabe8c`.
- Evidence SHA-256: raw
  `164692c6da7c4a13c727b604f685822ea840933f1e2806252e34c5cf9032ee49`;
  Complete B + Form
  `7642821fc8b740a5611bb0ae7746bfd5f1197b209193b74513760ccc9f7d9ab9`;
  comparison
  `02c05bddc2a5a53e5441a28899318142f715e3a45c5895e7e3c2bcf561b22dc0`;
  raw GIF `b9bb2cd24936d5cf9e82ce4f683793e5df935821d2d455aedd52778cdcbff391`;
  Complete B + Form GIF
  `67525a5e02a599a8ff1b7885b86ab42b0f2ec1ebd90811cf8b3ee5537c8f6f17`.
- Visual approval: the three exact frozen PNG boards were opened together in
  Aseprite and both synchronized GIFs were presented. The designer replied
  `approved` on 2026-08-10; approval applies only to the frozen digest above.
- Publication: frozen implementation
  `9d6366b0c5456704137aadfbbec9a67eccb5fd7c` and approval record
  `eae49376fd7bc4dd315168cb2989293de4a73f55` are committed and pushed on the
  tracked branch. Stop before Mist Weaver, Rivercrown Muse, registration,
  fixtures, effects, release, or EN-E07 without another explicit authorization.

#### Nymph Mist Weaver complete suite approved and published

- Gate ID: `en-e06-nymph-mist-weaver-full-v1`; status: `approved` on
  `codex/en-e06-nymph-mist-weaver`, based exactly on clean Spring Dancer
  handoff `6e63e95d5e6cf653ad37299766f10c3d3e3c0b2d`.
- Authorization: after Spring Dancer publication, the designer said
  `lets  do next`; the Nymph role order opens only specialist Mist Weaver.
- Scope: one private complete 80-frame specialist Nymph. Rivercrown Muse,
  registration, fixtures, effects, release, and EN-E07 remain closed.
- Identity and motion: crescent cowl, horizontal face veil, broad layered
  mantle, connected bell sleeves, woven sash, grounded divided robe, close-hand
  gather, veiled lift, two-hand outward release, crossed recovery, exact
  Cast/Death aliases, and exact side mirrors.
- Validation: 80/80 connected, bounded, grounded hard-alpha frames; 80/80 pixel
  and alpha distinctions from Elf Mage, Spring Dancer, and Spore Cantor; 72/72
  colored frames; 8/8 white flashes; opaque range 280-324; Complete B +7,854;
  Form changes 11,425. All fifteen EN-E06 gates and approved integration pass;
  `check:fast` passes in 58.3s and full `check` in 107.2s with 232 fixtures valid.
- Candidate digest:
  `e57a0af441f895fe376f2696d859a97d84564ddf034235d3b237b2cf637520da`.
- Evidence SHA-256: raw
  `8a10affbdd26d23ee7071ed6a19c723d3fc5f095d325064f855c2577eb830f01`;
  Complete B + Form
  `79f2876c8bed63d9f1b68cd4cc6d5308f6aa42939b6a424234ac4bd3bacd6b9a`;
  comparison
  `4cd1153281213823dafb812edd3b1b1cb11a1e6279f772fb84eba65f888cb41f`;
  raw GIF `ddc0b6bbd45f5d33d4e79f58f1ae2a47ddf81ee7e7b02ad4ca35d4a1bd9b03bc`;
  Complete B + Form GIF
  `33712c7db8b0b30b4a53d4ab16eae90301c0d96bf8c2f5c2cc1777890ca011a3`.
- Visual approval: the three exact frozen PNG boards were opened together in
  Aseprite and both synchronized GIFs were presented. The designer replied
  `approved` on 2026-08-10; approval applies only to the frozen digest above.
- Publication: frozen implementation
  `682f99a581e70ee1c985257e0c122d75c7add6f9` and approval record
  `07a673df462cdb651673fd042fb92965da624faf` are committed and pushed on the
  tracked branch. Stop before Rivercrown Muse, registration, fixtures, effects,
  release, or EN-E07 without another explicit authorization.

#### Nymph Rivercrown Muse complete suite approved and published

- Gate ID: `en-e06-nymph-rivercrown-muse-full-v1`; status: `approved` on
  `codex/en-e06-nymph-rivercrown-muse`, based exactly on clean Mist Weaver
  handoff `983b76ad14dcaf7c3151196763e481237fcbedb1`.
- Authorization: after Mist Weaver publication, the designer said
  `lets do nexr`; the Nymph role order opens only elite Rivercrown Muse.
- Scope: one private complete 80-frame elite Nymph. Registration, fixtures,
  effects, release, and EN-E07 remain closed.
- Identity and motion: vertical three-point river diadem, clear hair-framed
  face, long asymmetric river hair, open shoulders, pearl collar, diagonal
  violet sash, light ceremonial sleeves, flared split-foot gown, diadem/hair
  counter-sway, processional steps, one-hand rise, two-hand invocation, diagonal
  recovery, exact Cast/Death aliases, and exact side mirrors.
- Validation: 80/80 connected, bounded, grounded hard-alpha frames; 80/80 pixel
  and alpha distinctions from Elf Mage, Spring Dancer, and Mist Weaver; 72/72
  colored frames; 8/8 white flashes; opaque range 232-254; Complete B +7,358;
  Form changes 8,930. All sixteen EN-E06 gates and approved integration pass;
  `check:fast` passes in 56.9s and full `check` in 108.6s with 232 fixtures valid.
- Candidate digest:
  `4917d42fd0b480e4c2635ba4c96725e6b68afec1075dacb8acee2f70dc886bcd`.
- Evidence SHA-256: raw
  `1dfa2632a2949ce02316c6e26f7a033b67146cb8190edc510e41daeed36b4407`;
  Complete B + Form
  `5704a8b67c583728aab7b3ef1b4b79d67c75b4e779df3af0121aa7e406221471`;
  comparison
  `6080fd9cdf91593d63244f3e06b82191cc27bb7e55efab8bee16f9f0734af90a`;
  raw GIF `d72e5da8b6e0c96b573d81d75f50f2cd0e652286d9f6f05113bfe89e97d932bd`;
  Complete B + Form GIF
  `9baf3c58541fbab1a3270e40145e401ac10a5c5d8c2e91ec96c2bc20f61fb496`.
- Visual approval: the three exact frozen PNG boards were opened together in
  Aseprite and both synchronized GIFs were presented. The designer replied
  `approived` on 2026-08-10; approval applies only to the frozen digest above.
  The two earlier rejected packets remain superseded and are not approval
  evidence.
- Publication: frozen implementation
  `39bd0658d53acbfe7aa4484e14f6518551720142` and approval record
  `ca82f079ff84934edc4ab51a8d406050b9083d2a` are committed and pushed on the
  tracked branch. That checkpoint stopped before Nymph registration, fixtures,
  effects, release, or EN-E07. The designer's later `lets do next` opens only
  the isolated Gloam Walker gate below, now approved and published.

### EN-E07 - Shapeshifters and apparitions

- Status: `Living Shadow and Doppelganger common-specialist-elite roles approved and published; Lantern Mote, Fenbell Shepherd, and Mirecrown Beacon common-specialist-elite Will-o-Wisp roles approved and published; private common-specialist-elite Changeling roles approved and published; private common-specialist-elite Kelpie roles approved and published; EN-E07 art complete with registration, fixtures, effects, and release still separate`
- Families: Living Shadow, Doppelganger, Will-o'-Wisp, Changeling, Kelpie
- Priority-first: Living Shadow, Doppelganger

Shared leverage: controlled negative space, unstable edges, silhouette swaps,
and spectral motion. Doppelganger and Changeling receive authored default forms;
copying another actor is a runtime/gameplay feature and is not promised by the
assembler.

#### Living Shadow Gloam Walker complete suite approved and published

- Gate ID: `en-e07-living-shadow-gloam-walker-full-v1`; status: `approved` on
  `codex/en-e07-living-shadow-gloam-walker`, based on local current-state
  reconciliation `d785fe56e7d8c98243f948fce615885d5a04fbc3`.
- Authorization: after Rivercrown Muse was visually approved and its
  implementation and approval commits were pushed, the designer said `lets do
  next` on 2026-08-10. Rivercrown completed EN-E06; the slice order and
  priority-first list open only common Living Shadow Gloam Walker.
- Approval/publication: the three exact PNG boards were opened together in
  Aseprite, both exact GIFs were presented, and the designer replied
  `aaprovced` on 2026-08-10. Approval applies only to the frozen digest and
  hashes below. Implementation `a46f59c1cb0bb751760f2776fe60b5c489806c94`
  and approval record `848c7192b6dc2cac8b7ab2dc8725d3859447715d`
  plus initial handoff `00d5b436c7398312a5f3a05a482b4cf34cee9ba5` are committed
  and pushed. The designer's standing approved-work permission also published
  Rivercrown docs reconciliation `d785fe5`; it does not open another gate.
- Style/silhouette contract: chunky one-to-three-pixel forms, a tight
  dark-violet ramp, hard alpha, connected hollow face and torso negative space,
  angular shoulders, long connected claws, pinched waist, clearly split legs,
  and broad planted feet. It must not read as a dark recolor of public Ghost,
  Shadow Slime, or approved Mist Weaver.
- Scope: one private 80-frame common Living Shadow. Cast aliases Attack;
  Death aliases Hurt H1,H2,H2,H2. Detached wisps, floor pools, smoke,
  afterimages, projectiles, claw trails, glow, loose fragments, and impacts
  remain external.
- Focused validation: 80/80 connected, bounded, grounded hard-alpha frames;
  80/80 pixel and alpha distinctions from Cursed Ghost, Shadow Slime, and Mist
  Weaver; 72/72 colored frames; 8/8 white flashes; 54/54 expected eye-bearing
  views; opaque range 208-242; Complete B +7,792; Form changes 5,106. All
  fifteen approved EN-E06 sources remain exact; public 80/259 and fixtures are
  unchanged. The approved 1,200-frame integration digest remains
  `74953d1b8531be86bf3f551b15fc70aa4ff142d954763ad4183eb36e06fd6497`;
  published-state `check:fast` passes in 54.6s and full `check` in 107.4s with
  all 232 fixtures valid.
- Candidate digest:
  `131a95a106a36dea2f6879611c8e14e3aa077012dcbd1bd32e111c45658ca3f9`.
- Evidence SHA-256: raw
  `a3389c510a0d8c16a50a19be6eaebac15d452a056531d71c807e778767975e76`;
  Complete B + Form
  `53c13282fe6d5b3ad9ddad19bd1047cd023fc8bb0392416d737ce47e27869b02`;
  comparison
  `75609882aed2b04749e4efb30fbc77df749895549b0fd11cc42f38eb8c421527`;
  raw GIF `54f3262ce694e6696d3af2a40783cce32b2555de7c5cd72acd18900fa1c1e8a8`;
  Complete B + Form GIF
  `862d28ed3a938a7315146b58706bce4e37f11e9abbfc50c720e63b83be5d9659`.
- Historical stop gate: Gloam approval did not itself open registration,
  fixtures, effects, another role or family, release, or EN-E08. The designer's
  later `lets do next` opens only the specialist candidate below.

#### Living Shadow Nightglass Seer complete suite approved and published

- Gate ID: `en-e07-living-shadow-nightglass-seer-full-v1`; status: `approved`
  on `codex/en-e07-living-shadow-nightglass-seer`, based exactly on clean
  published Gloam reconciliation
  `98d3781b81c8c7ff615ad3cd6562efe12ce63d94`.
- Authorization: after Gloam Walker was visually approved, committed, pushed,
  and reconciled, the designer said `lets do next` on 2026-08-10. The Living
  Shadow role order opens only specialist Nightglass Seer.
- Style/silhouette contract: reuse the approved chunky one-to-three-pixel
  violet-black family ramp and hard alpha. A broad faceted mask, one vertical
  eye, connected shoulder yoke, squared sight-frame forearms, narrow
  transparent chest aperture, bent split legs, and planted wedge feet must
  remain distinct from Gloam Walker, public Ghost/Shadow Slime, and approved
  Mist Weaver.
- Scope: one private 80-frame specialist Living Shadow. Cast aliases Attack;
  Death aliases Hurt H1,H2,H2,H2. Eye beams, gaze cones, portals, runes,
  divination marks, floor sigils, glow, afterimages, loose shards, trails,
  projectiles, and impacts remain external.
- Focused validation: 80/80 connected, bounded, grounded hard-alpha frames;
  80/80 pixel and alpha distinctions from Cursed Ghost, Shadow Slime, Mist
  Weaver, and Gloam Walker; 72/72 colored frames; 8/8 white flashes; 54/54
  expected eye-bearing views; opaque range 228-265; Complete B +7,832; Form
  changes 7,257. Approved Gloam remains exact; public 80/259 and fixtures are
  unchanged.
- Broad validation: the 19-command protected predecessor/candidate/integration
  matrix passed in 12.3s, `npm.cmd run check:fast` passed in 55.3s, and full
  `npm.cmd run check` passed in 109.5s. The approved 1,200-frame integration
  digest remains
  `74953d1b8531be86bf3f551b15fc70aa4ff142d954763ad4183eb36e06fd6497`
  and all 232 fixture sheets validate.
- Candidate digest:
  `07909fa9b74df6dd386ca3f6186fe4da26e8d088af99ad7e2dfa2bcdeb10d3fa`.
- Evidence SHA-256: raw
  `ce61d23cdc393d0c709b5af30cdf7fd734d2f2278431d819d28de8248c5c604a`;
  Complete B + Form
  `8889740496b860c5a27dd45d3a825f70b27b648bcc535d9ebbe6ab1f6825286e`;
  comparison
  `15b5887fc92a39cf87bf14f40da9d7cb64be9f9d41edd8ace3df75a9fc849800`;
  raw GIF `54fb94164d0b90a5bbebe684d78ccc3f9f24d527e25c131cf162ff0f32d98828`;
  Complete B + Form GIF
  `5c12a4d26affb4b4a3453e4eb7183cbbc138f91257428dc36ffe1bf830103523`.
- Approval: after the exact packet was presented and the three exact PNG boards
  were opened together in Aseprite, the designer replied `approved lets do
  next` on 2026-08-10. Approval is restricted to the candidate digest above.
- Published commits: implementation
  `325a6f4cfa1418383c93510262a631358add1d5f`; approval record
  `d50f3af5da0578edf66a5b2f156744c576427b9c`; initial handoff
  `71d36ef48a55a7f1d49e1e6649a33eb945c9667c`. The remote handoff was
  verified exact.
- Historical stop gate: the designer's `approved lets do next` response opens
  only the private elite candidate below. Keep Living Shadow registration,
  fixtures, effects, another EN-E07 family, release, and EN-E08 closed.

#### Living Shadow Hollowcrown Regent complete suite approved and published

- Gate ID: `en-e07-living-shadow-hollowcrown-regent-full-v1`; status:
  `approved` on `codex/en-e07-living-shadow-hollowcrown-regent`, based exactly
  on clean published Nightglass reconciliation
  `46ad4e7759a1ef3a096ba326d96cdef44d1ee3b1`.
- Authorization: after Nightglass Seer was visually approved, committed,
  pushed, and reconciled, the designer replied `approved lets do next` on
  2026-08-10. The Living Shadow role order opens only elite Hollowcrown Regent.
- Style/silhouette contract: reuse the approved chunky one-to-three-pixel
  violet-black family ramp and hard alpha. A connected three-prong crown, high
  angular mantle, paired narrow face slits, transparent diamond void-heart,
  command-bracer arms, armored split legs, and broad throne-step feet must read
  as regal structure rather than a bulky knight, enlarged Gloam, faceted Seer,
  or robed caster.
- Scope: one private 80-frame elite Living Shadow. Cast aliases Attack; Death
  aliases Hurt H1,H2,H2,H2. Crown halos, eclipse rings, throne shapes, banners,
  void rays, portals, floor seals, shadow doubles, detached mantle trails,
  glow, particles, projectiles, and impacts remain external.
- Focused validation: 80/80 connected, bounded, grounded hard-alpha frames;
  80/80 pixel and alpha distinctions from Cursed Ghost, Shadow Slime, Mist
  Weaver, Gloam Walker, and Nightglass Seer; 72/72 colored frames; 8/8 white
  flashes; 54/54 exact eye-bearing views; opaque range 244-283; Complete B
  +8,614; Form changes 8,119. Both approved Living Shadow predecessors remain
  exact; public 80/259 and fixtures are unchanged.
- Candidate digest:
  `657e4071ab8432387f7c8b6ecff8650f3f7a63bf7dc8f4b68564373a5e450991`.
- Evidence SHA-256: raw
  `28bacd40bff6686fb84fdbe0e6d149fa60384b50493dccd09d11f5985852b7c0`;
  Complete B + Form
  `d41dbf448ba59ba73befa65c553655fdb9f980b9d3e7e400a866125d36ff9d3b`;
  comparison
  `414f5e44c9812cbdc6166a05205aa0fd01a73666ee867000234531ff7c4e4e59`;
  raw GIF `5e8acdc677f7cab6738600a259e666e4596963917eb3136b75e9987f3050662d`;
  Complete B + Form GIF
  `dbe5c9676626240b57cada5f092ae43f0d627644a958882d3ea40ddb473923cd`.
  Two fresh generations reproduce all five hashes exactly.
- Broad validation: the 20-command protected predecessor/candidate/integration
  matrix passed in 13.2s, `npm.cmd run check:fast` passed in 54.9s, and full
  `npm.cmd run check` passed in 109.2s. The approved 1,200-frame integration
  digest remains
  `74953d1b8531be86bf3f551b15fc70aa4ff142d954763ad4183eb36e06fd6497`
  and all 232 fixture sheets validate.
- Approval: after the exact packet was presented and the three exact PNG boards
  were opened together in Aseprite, the designer replied `approved lets do
  next` on 2026-08-10. Approval is restricted to the candidate digest above.
- Published commits: implementation
  `ffe5f574ab9f06ecfaad83c50a7980254eea7211`; approval record
  `90a06bd34e1bae29becdc380b01895825cf4a969`; initial handoff
  `0c3d671bee3013413291170e127d3820cdcaff95`. The remote handoff was
  verified exact.
- Historical next gate: the same approval response opened only the private
  common Pale Echo candidate below. Keep Living Shadow registration, fixtures,
  effects, other EN-E07 family artwork, release, and EN-E08 closed.

#### Doppelganger Pale Echo complete suite approved and published

- Gate ID: `en-e07-doppelganger-pale-echo-full-v1`; status: `approved` on
  `codex/en-e07-doppelganger-pale-echo`, based exactly on clean published
  Hollowcrown reconciliation `6ff54c3a926436083675ec8f7e2d0230cc073ac5`.
- Authorization: after Hollowcrown Regent was visually approved, committed,
  pushed, and reconciled, the designer replied `approved lets do next` on
  2026-08-10. EN-E07 priority order opens only common Doppelganger Pale Echo.
- Style/silhouette contract: one authored default-form humanoid with pale
  gray-rose skin, charcoal-violet uneven fringe, offset eyes, mismatched
  shoulders, split slate/wine short tunic, one ordinary hand, one connected
  long-finger mimic hand, separated legs, and grounded boots. The first
  diagnostic render was rejected before freeze for 218-271 opaque pixel bulk;
  the repaired public-humanoid-scale candidate narrows the resting silhouette
  to 186-245 while retaining deliberate A2/A3 reach.
- Scope: one private 80-frame common Doppelganger. Cast aliases Attack; Death
  aliases Hurt H1,H2,H2,H2. Runtime actor copying, copied silhouettes, mirror
  doubles, reflection planes, peeling faces, loose skin ribbons, afterimages,
  glow, particles, projectiles, and impacts remain external.
- Focused validation: 80/80 connected, bounded, grounded hard-alpha frames;
  80/80 pixel and alpha distinctions from Bandit Thug, Cultist Acolyte, and
  Dark Elf; 72/72 colored frames; 8/8 white flashes; 54/54 expected eye-bearing
  views; opaque range 186-245; Complete B +7,826; Form changes 6,236.
  Hollowcrown remains exact; public 80/259 and fixtures are unchanged.
- Candidate digest:
  `c3fa12cb4bb0be432e955adfc32f331286e55c65cbd7a38250bdf0d120fa6596`.
- Evidence SHA-256: raw
  `bcae6f51ad927038989a13f42d993ed05fd9f654f70f1b8f2cb70ce1df862023`;
  Complete B + Form
  `3150f7e6ab8fbfe2c40a8e31115d1c4992ffc33a887798c491a1875e61d770b8`;
  comparison
  `b3d8c0e211218726859b1ea4e41b9961002282d0073eb5d64f6be03ecc1823a2`;
  raw GIF `ee5bf76bbf082e0dfc8a34628998b0a66edacee29a6fd0ce25fcb8b6692582c7`;
  Complete B + Form GIF
  `2eb5e255c6196c178aa37c69a91d08cdb6ce9b5d5936bdfa32bb3acdfe14d125`.
  Two repaired generations reproduce all five hashes exactly.
- Approval/publication: after the exact repaired packet was presented and the
  three exact PNG boards were opened together in Aseprite, the designer replied
  `approved lets do next` on 2026-08-10. Approval is restricted to the frozen
  digest above. Implementation `0628135b84725836c552e13db797540a965854cb`
  and approval record `182938381ac39812434518d0216e6e9796367bbb` plus initial
  handoff `1e6e8d8bb01de97ca4e1373b62b461e40b1aa239` are published and remote
  verified.
- Broad validation: the 21-command protected predecessor/candidate/integration
  matrix passed in 7.7s, candidate `npm.cmd run check:fast` passed in 56.8s,
  the published-state fast suite passed in 53.1s, and full `npm.cmd run check`
  passed in 108.4s before the implementation commit. The approved 1,200-frame
  integration digest remains
  `74953d1b8531be86bf3f551b15fc70aa4ff142d954763ad4183eb36e06fd6497`
  and all 232 fixture sheets validate.
- Required next action: open only one private specialist Doppelganger candidate
  from this clean publication reconciliation. Keep registration, fixtures,
  runtime copying, effects, the elite and later EN-E07 families, release, and
  EN-E08 closed.

#### Doppelganger Falseface Adept complete suite approved and published

- Gate ID: `en-e07-doppelganger-falseface-adept-full-v1`; status: `approved`
  on `codex/en-e07-doppelganger-falseface-adept`, based exactly on clean
  published Pale Echo reconciliation
  `e18a51207868cbcf5b01f55e1c04a50cac43bdcc`.
- Authorization: after the repaired Pale Echo was visually approved,
  committed, pushed, and reconciled, the designer replied `approved lets do
  next` on 2026-08-10. The Doppelganger role order opens only specialist
  Falseface Adept.
- Style/silhouette contract: one authored default-form humanoid using the
  approved family language with a fused diagonal false-face seam, swept uneven
  fringe, asymmetric high collar, fitted cross-seamed short coat, two connected
  long-finger molding hands, separated legs, and grounded boots. The first
  diagnostic packet was rejected before freeze because the colored hurt/death
  brace collapsed into a squat block and its middle attack phases overfilled
  the face. The repaired public-humanoid-scale candidate restores the head and
  split legs, narrows those overlays, and stays within 203-261 opaque pixels.
- Scope: one private 80-frame specialist Doppelganger. Cast aliases Attack;
  Death aliases Hurt H1,H2,H2,H2. Runtime actor copying, copied silhouettes,
  detached faces, mirror doubles, reflection planes, peeling skin, loose skin
  ribbons, afterimages, glow, particles, projectiles, and impacts remain
  external.
- Focused validation: 80/80 connected, bounded, grounded hard-alpha frames;
  80/80 pixel and alpha distinctions from Pale Echo, Cultist Zealot, and Dark
  Elf; 72/72 colored frames; 8/8 white flashes; 54/54 expected eye-bearing
  views; opaque range 203-261; Complete B +8,004; Form changes 8,078. Pale Echo
  remains exact; public 80/259 and fixtures are unchanged.
- Candidate digest:
  `16289e68776f0f93d8238d19a3538c4e92e77e108686f8ddfec01b1a783080c6`.
- Evidence SHA-256: raw
  `8b22e84a20699c694ec0a3110c0c2d887baedc204194ae885e68ccee9f116e38`;
  Complete B + Form
  `d282af955acd012c094be7ab5607828abf91ac2a90f786dab87732293cf79203`;
  comparison
  `69e5d6d64e192ce47a793103e6e23b5d17a465d75f8fac08741893ac4a99635d`;
  raw GIF `4cf7a25aa416d88e61e0d8cecd0687e62f891f2bfb7e8cc7811f56eea17b19ee`;
  Complete B + Form GIF
  `458e15e7b2cad2b9d305dcbffc3bc172aa2b63138ddecfab3202d9947b3f40ad`.
  Two repaired generations reproduce all five hashes exactly.
- Broad validation: the 22-command protected predecessor/candidate/integration
  matrix passed in 7.6s, `npm.cmd run check:fast` passed in 52.3s, and full
  `npm.cmd run check` most recently passed in 107.4s. The approved 1,200-frame
  integration digest remains
  `74953d1b8531be86bf3f551b15fc70aa4ff142d954763ad4183eb36e06fd6497`
  and all 232 fixture sheets validate.
- Approval/publication: the repaired boards and all eight raw/effects-enabled
  phase boards were inspected, the three exact PNGs were opened together in
  responsive Aseprite, both exact GIFs were presented, and the designer replied
  `approved lets do next` on 2026-08-10. Approval applies only to digest
  `16289e68776f0f93d8238d19a3538c4e92e77e108686f8ddfec01b1a783080c6`.
  Implementation `c415620c2f7f95b98c8b8563a2c1d6e39abb4a73` and approval
  record `cb68ec7e861f7130aafb6c60b1e4b4a16676e9cb` plus initial handoff
  `a215f091022537644a4616e8b0977f12d972eb6d` are published and remote
  verified.
- Historical next action: the designer's later `lets do nezxt` response opened
  only the private elite Grand Pretender candidate below. Registration,
  fixtures, runtime copying, effects, later EN-E07 families, release, and
  EN-E08 remained closed.

#### Doppelganger Grand Pretender complete suite approved and published

- Gate ID: `en-e07-doppelganger-grand-pretender-full-v1`; status: `approved`
  on `codex/en-e07-doppelganger-grand-pretender`, based exactly on clean
  published Falseface Adept reconciliation
  `b16b7d2c8cd91ffbf31e0c9ac55d392c53a4b64c`.
- Authorization: after Falseface Adept was visually approved, committed,
  pushed, and reconciled, the designer replied `lets do nezxt` on 2026-08-10.
  The Doppelganger common-specialist-elite order opens only Grand Pretender.
- Style/silhouette contract: one broad public-humanoid-scale authored default
  form using the approved pale/slate/wine family language with a fused
  three-panel visage, one continuous right-swept charcoal crest, asymmetric
  connected mantle wings, a layered split formal coat, two connected
  long-finger claiming hands, separated legs, and grounded broad boots. The
  first diagnostic packet was rejected before freeze because A1 merged the
  hands into a pale cap that erased the face and inherited specialist fringe
  pixels made the crest read as horns. The repair narrows the cheek-side hands,
  restores the expected eyes and tri-seam, clears only the inherited fringe,
  and layers one swept hair mass over the seam tops.
- Scope: one private 80-frame elite Doppelganger. Cast aliases Attack; Death
  aliases Hurt H1,H2,H2,H2. Runtime actor copying, copied silhouettes,
  detached faces, mirror doubles, reflection planes, peeling skin, loose
  ribbons, afterimages, glow, particles, projectiles, and impacts remain
  external.
- Focused validation: 80/80 connected, bounded, grounded hard-alpha frames;
  80/80 pixel and alpha distinctions from approved Pale Echo, approved
  Falseface Adept, and public Cultist Zealot; 72/72 colored frames; 8/8 exact
  white flashes; 54/54 expected eye-bearing views; opaque range 217-273;
  Complete B +8,426; Form changes 8,439. Pale Echo and Falseface remain exact;
  public 80/259 and fixtures are unchanged.
- Candidate digest:
  `03ca03ade7be4efcb2e69aafe3400cf6a452d26f1ddbaccca2b561374c172dcb`.
- Evidence SHA-256: raw
  `d919fcc3003fa0fdc5283c4b4388aa9b2032a0d0d14a0ee006ca8da3dd21ad98`;
  Complete B + Form
  `92468560ff1e0fa304eb7d681c8ab330c30fd8abf8ddacf656881ba321df36f5`;
  comparison
  `0e6acc2acc79b5f2cd0792e807b54286c1a9897ce7ff09e3b3bf3bbbd8d77b66`;
  raw GIF `8980e6a317f8bb228690616ba41dc8bdc0d734fb40a78d2b2bf82ab89b0ca1b9`;
  Complete B + Form GIF
  `fc8619df2ab422d7bc62fb7f2559d97de7e1f61a6e55ab936b265b09206290f9`.
  Two post-freeze generations reproduce all five hashes exactly.
- Visual inspection: the comparison, both full-suite boards, and all eight
  raw/effects-enabled phase boards were inspected at original detail. The
  three exact frozen PNGs were opened together in responsive Aseprite 1.3.17.2.
  The designer replied `Approved lets do next` on 2026-08-10. Approval applies
  only to the frozen digest and evidence hashes above. Implementation
  `0a8d5094d5e5de575f1966db30fc01d093a866c3` and approval record
  `0c54731d5fc1a14495d13ebb4c2accd98ba8b8a3` plus initial handoff
  `c551799f585df2643f83a605279cda06cc629e45` are published and remote
  verified.
- Broad validation: the 23-command protected predecessor/candidate/integration
  matrix passed in 15.0s, `npm.cmd run check:fast` passed in 56.4s, and full
  `npm.cmd run check` passed against the approved-local metadata in 106.3s. The approved 1,200-frame integration
  digest remains
  `74953d1b8531be86bf3f551b15fc70aa4ff142d954763ad4183eb36e06fd6497`
  and all 232 fixture sheets validate.
- Historical next action: the designer's later `Approved lets do next`
  response opened only the private common Lantern Mote candidate below.
  Doppelganger remains unregistered and fixture-free; effects, later
  roles/families, release, and EN-E08 remain closed.

#### Will-o-Wisp Lantern Mote complete suite approved and published

- Gate ID: `en-e07-will-o-wisp-lantern-mote-full-v1`; status: `approved` on
  `codex/en-e07-will-o-wisp-lantern-mote`, based exactly on clean published
  Grand Pretender reconciliation
  `3ddbe159360f16844d167ecc753d6b767b7e5549`.
- Authorization: after Grand Pretender was visually approved, committed,
  pushed, and reconciled, the designer replied `Approved lets do next` on
  2026-08-10. The family order and one-complete-sprite cadence open only one
  private common Will-o-Wisp.
- Style/silhouette contract: a small-to-medium hovering marsh lantern using a
  connected stepped wick, broad ribbed cage, single visible core eye, tapered
  inner flame, and two connected lower flame prongs. It must not read as the
  public Spectral Ghost robe, Shadow Slime dome, Flame Elemental blob,
  humanoid Living Shadow, or a detached particle cluster. The first focused
  run caught a lower-prong pixel detaching in low phases and duplicate eye
  pixels in pinch/fold phases; both were repaired before freeze.
- Scope: one private 80-frame common Will-o-Wisp. Cast aliases Attack; Death
  aliases Hurt H1,H2,H2,H2. Aura, bloom, glow, detached embers, loose sparks,
  smoke, afterimages, trails, light pools, projectiles, impacts, and
  illumination remain external.
- Focused validation: 80/80 connected, bounded, hovering hard-alpha frames;
  80/80 pixel and alpha distinctions from public Spectral Ghost, Shadow Slime,
  and Flame Elemental; 72/72 colored frames; 8/8 exact white flashes; 54/54
  expected single-eye views; opaque range 146-154; Complete B +5,570; Form
  changes 5,850. Grand Pretender remains exact; public 80/259 and fixtures are
  unchanged.
- Candidate digest:
  `f50a0c6f08b63dde7bad06542140123c5d6bb7fb419b7df2789cffa441a9ebb8`.
- Evidence SHA-256: raw
  `a97a52022736cc0b471e7d14d714d779dbdd622d6f3d5936c5e0c58a438a370c`;
  Complete B + Form
  `71be29714f2bfcba373ec8c072102e11dc4213a2350ed7a73ace4eff586a40b7`;
  comparison
  `54ae19c61dec1a4a8566dc75153201f04bb1a5e6df082896eb05a7ebad0eb58e`;
  raw GIF `33b000d802955afa79aee7a33ffd5b42c2867c15f1c7caad3a8828da678ff7d7`;
  Complete B + Form GIF
  `9308e786118a54a847acad7593e28cbab1ab2b41e272989744b948e6bea3e8bd`.
  Two post-freeze generations reproduce all five hashes exactly.
- Visual inspection: the comparison, both full-suite boards, and all eight
  raw/effects-enabled phase boards were inspected at original detail. The
  three exact frozen PNGs were opened together in responsive Aseprite 1.3.17.2.
  The designer replied `approved lets do next` on 2026-08-11. Approval applies
  only to the frozen digest and five evidence hashes above. Implementation
  `96907f552a06ba3865e25a46f881af5add2237ee` and approval record
  `878e4969de59c500de342555e9b136e3d8cde2de` plus initial handoff
  `71f0fbc07f088d6c366f11dc462856e79e3fde8b` are published and remote
  verified.
- Broad validation: the 24-command protected predecessor/candidate/integration
  matrix passed in 16.0s, `npm.cmd run check:fast` passed in 55.6s, and full
  `npm.cmd run check` passed in 108.4s before approval and in 111.9s against
  approved-local metadata. The approved 1,200-frame integration digest remains
  `74953d1b8531be86bf3f551b15fc70aa4ff142d954763ad4183eb36e06fd6497`
  and all 232 fixture sheets validate.
- Historical next action: the designer's later `approved lets do next` reply
  opened only the Fenbell Shepherd candidate below. Do not register
  Will-o-Wisp, generate fixtures, add effects, start the elite or another
  family, release, or advance EN-E08.

#### Will-o-Wisp Fenbell Shepherd complete suite approved and published

- Gate ID: `en-e07-will-o-wisp-fenbell-shepherd-full-v1`; status: `approved`
  on `codex/en-e07-will-o-wisp-fenbell-shepherd`, based exactly on clean
  published Lantern Mote reconciliation
  `d734846067b3bf9dd05cadffef440ead1f6c6d3a`.
- Authorization: after Lantern Mote was visually approved, committed, pushed,
  and reconciled, the designer replied `approved lets do next` on 2026-08-11.
  The frozen Will-o-Wisp role order and one-complete-sprite cadence open only
  one private specialist.
- Style/silhouette contract: a taller hovering ritual lantern using one
  connected hooked wick, tall bell-shaped ribbed cage, one guiding core eye,
  asymmetric connected side shutters, elongated core, broad lip, and three
  connected lower flame tines in the approved teal, mint, pale-core, and
  violet-cage family language. It must remain visibly distinct from approved
  Lantern Mote, public Spectral Ghost, public Flame Elemental, humanoid Living
  Shadow, and detached particle clusters. Pre-freeze inspection strengthened
  the connected hooked-wick cue.
- Scope: one private 80-frame specialist Will-o-Wisp. Cast aliases Attack;
  Death aliases Hurt H1,H2,H2,H2. Detached wisps, embers, sparks, sound rings,
  aura, glow, smoke, afterimages, trails, floor light, projectiles, impacts,
  and illumination remain external.
- Focused validation: 80/80 connected, bounded, hovering hard-alpha frames;
  80/80 pixel and alpha distinctions from approved Lantern Mote, public
  Spectral Ghost, and public Flame Elemental; 72/72 colored frames; 8/8 exact
  white flashes; 54/54 expected single-eye views; opaque range 202-210;
  Complete B +7,010; Form changes 6,404. Lantern Mote remains exact; public
  80/259 and fixtures are unchanged.
- Candidate digest:
  `0a8000e33705967089ae66c98486eb701da88bfacd9f5adc38a47bbb62f5a46b`.
- Evidence SHA-256: raw
  `659e8539a29014278ff15e6cd726ffe2cbee26918cc0cb4e23df49a517f0572e`;
  Complete B + Form
  `ff8cba9a43c0a5639864cbd24fd82429bc3bb2cb8856c9ccadc477379911a781`;
  comparison
  `a967b070596c5aee98798b67a61c1d6fa71ff7e9a3f30d9f2b7e18503a6d0e59`;
  raw GIF `a2eceb35ef98dd1acd92a5058ba71624456c852d92726995610e55e29fb8ba31`;
  Complete B + Form GIF
  `dfb20b16ff2a15142874b718e01b0c5dd369a426f77a5b2c6a6a8af96859f7f7`.
  Two post-freeze generations reproduce all five hashes exactly.
- Visual inspection: the comparison, both full-suite boards, and all eight
  raw/effects-enabled phase boards were inspected at original detail. The
  three frozen PNG hashes were reverified and those exact files were opened
  together in responsive Aseprite 1.3.17.2; its live command line names all
  three paths and the comparison board is the active window. The designer
  replied `approved` on 2026-08-11. Approval applies only to the frozen digest
  and five evidence hashes above. Implementation
  `04f113d6e2b95f290925eba040659b441e3cfcd1` and approval record
  `89e2e2cb271dc9af60dd4dce6fba3bccd03cd9d7` plus initial handoff
  `462e7e5123d96f3ff928cd6ff908267cd313570b` are published and remote
  verified.
- Broad validation: the protected 25-command
  predecessor/candidate/integration matrix passed in 16.8s,
  `npm.cmd run check:fast` passed in 57.6s, and full `npm.cmd run check` passed
  in 111.7s before approval, in 113.7s against committed approved-local
  metadata, and in 108.7s against the published tuple. The approved 1,200-frame
  integration digest remains
  `74953d1b8531be86bf3f551b15fc70aa4ff142d954763ad4183eb36e06fd6497`
  and all 232 fixture sheets validate.
- Historical next action: the designer's later `lets do next` reply opened
  only the private elite Mirecrown Beacon candidate below. Registration,
  fixtures, effects, another family, release, and EN-E08 remain closed.

#### Will-o-Wisp Mirecrown Beacon complete suite approved and published

- Gate ID: `en-e07-will-o-wisp-mirecrown-beacon-full-v1`; status: `approved`
  on `codex/en-e07-will-o-wisp-mirecrown-beacon`, based exactly on clean
  published Fenbell Shepherd reconciliation
  `8b0754c9594ad91fe378ba11d4f43d7b2a558145`.
- Authorization: after Fenbell Shepherd was visually approved, committed,
  pushed, and reconciled, the designer replied `lets do next` on 2026-08-11.
  The frozen Will-o-Wisp common-specialist-elite role order and
  one-complete-sprite cadence open only one private elite.
- Style/silhouette contract: a broad hovering sovereign beacon using one
  connected three-prong crown-wick, a wide double-tiered ribbed cage, one
  central beacon eye, paired connected side buttresses, a deep living core, a
  broad lower basin, and four connected lower flame tines in the approved
  marsh-teal, mint, pale-core, and violet-cage language. It must remain visibly
  distinct from approved Fenbell Shepherd and Lantern Mote, public Spectral
  Ghost and Flame Elemental, humanoids, detached particle clusters, halos,
  beams, and sound-effect icons. The initial A3/C3 pale expansion was rejected
  before freeze because the Up view read as a detached beam; the repaired
  version encloses that expansion within the cage/core in every direction.
- Scope: one private 80-frame elite Will-o-Wisp. Cast aliases Attack; Death
  aliases Hurt H1,H2,H2,H2. Aura, bloom, glow, detached wisps, embers, sparks,
  halos, beams, rays, sound rings, smoke, afterimages, trails, light pools,
  projectiles, impact flashes, and illumination remain external.
- Focused validation: 80/80 connected, bounded, hovering hard-alpha frames;
  80/80 pixel and alpha distinctions from approved Fenbell Shepherd, approved
  Lantern Mote, public Spectral Ghost, and public Flame Elemental; 72/72
  colored frames; 8/8 exact white flashes; 54/54 expected single-eye views;
  opaque range 243-254; Complete B +7,680; Form changes 6,017. Both approved
  family predecessors remain exact; public 80/259 and fixtures are unchanged.
- Candidate digest:
  `5fbd53af9fb461717a8bd90698a0b2f7f81f8fdd55fee42fbca5254738654d81`.
- Evidence SHA-256: raw
  `c76b05b32ead47a92fbd8147c9d813b3e95c8e2bcd25e417ede4be7dc65ad275`;
  Complete B + Form
  `b9119b3f09f92842a0b71fa4198ed447dcddc9cfe5caba33ad3cb5904d28e2d6`;
  comparison
  `cab869d6c4e406712db7c9a307b32adf9a44e6efc112188091b15d9dcfaae90e`;
  raw GIF `8f456bde2c82d33eb9cc5ce634967cb9e81d7fb1ff910b6ed55a37580bf9b99c`;
  Complete B + Form GIF
  `61455606f5399c7006f2d5955fc4d289731d2406828fcfaa260e891989d77ffa`.
  One post-freeze package generation reproduces all five hashes exactly.
- Visual inspection: the comparison, both full-suite boards, and all eight
  raw/Complete B + Form phase boards were inspected at original detail. The
  three exact frozen PNG hashes were reverified and those files are open
  together in responsive Aseprite 1.3.17.2; its live command line names the
  comparison, raw, and Complete B + Form paths. The designer replied
  `approved lets do next` on 2026-08-11. Approval applies only to the frozen
  digest and five evidence hashes above. Implementation
  `72925cd8d8ea1a3ae47a45601607a1a5853decb3` and approval record
  `6448bb49e16679b94fcc402166b089b6b6ca7174` plus initial handoff
  `72b529bcdd19bd0d3018f2b03ceabcb29a809015` are published and remote
  verified.
- Broad validation: the protected 26-command
  predecessor/candidate/repair/integration matrix passed in 19.0s,
  `npm.cmd run check:fast` passed in 60.4s, and full `npm.cmd run check`
  passed in 111.2s before approval, in 110.7s against committed approved-local
  metadata, and in 110.9s against the published tuple. The approved
  1,200-frame integration digest remains
  `74953d1b8531be86bf3f551b15fc70aa4ff142d954763ad4183eb36e06fd6497`
  and all 232 fixture sheets validate.
- Required next action: preserve Mirecrown Beacon and every predecessor
  byte-for-byte and open only one private common Changeling candidate from this
  clean publication reconciliation. Do not register Will-o-Wisp, generate
  fixtures, add effects, start another role or family beyond that candidate,
  release, or advance EN-E08.

#### Changeling Veilskin Foundling complete suite approved and published

- Gate ID: `en-e07-changeling-veilskin-foundling-full-v1`; status: `approved`
  and published on
  `codex/en-e07-changeling-veilskin-foundling`, based exactly on clean
  published Mirecrown Beacon reconciliation
  `4ee32622ec2984ac805ac345b854f23584fda3c3`.
- Authorization: after the exact Mirecrown Beacon was visually approved,
  committed, pushed, and reconciled, the designer replied `approved lets do
  next` on 2026-08-11. Mirecrown completed the frozen Will-o-Wisp role order;
  the one-complete-sprite cadence authorizes only this one private common
  Changeling candidate.
- Face repair: the first digest
  `1a852ef46dcaa7fee5779379cb9eda9acd79e67cd53dd469ff9cfae9dc18844d`
  is superseded after the designer said `could need a more readable face`.
  Only connected dark eye sockets, retained amber glints, and a tiny mouth mark
  changed; silhouette, body, motion, aliases, and exclusions remain unchanged.
- Contract: a small grounded authored fey impostor with one connected
  pear-shaped living veil, one centered face, a narrow ochre-coral folded
  torso, paired short ordinary arms, bowed separated legs, and broad splayed
  feet. It must remain distinct from the adult Pale Echo humanoid, public
  Goblin ear bar, public Imp horn bar, winged Fairy, detached mask, and copied
  actor silhouettes.
- Motion: Idle flexes the connected veil; Walk uses four crouched alternating
  splayed steps; Attack draws both hands beneath the face, extends both short
  forearms symmetrically, opens a connected two-hand rake, and resets. Hurt is
  exact white recoil then colored closed-veil brace. Cast aliases Attack;
  Death aliases Hurt H1,H2,H2,H2.
- Frozen evidence: raw PNG
  `795f6eb56dba256c78295e0543ce2282d680e42fc5ac907534ee30198fbb5485`;
  Complete B + Form PNG
  `e636c9122dd17b1ed901c0afc821256b6dabae4a3b560003720d05d4e40d67f1`;
  Pale Echo/Goblin Scout/Imp Sprite comparison PNG
  `a323ac1b863d8168cc0d3ad4726d2c220cd2c909cd18a90a589fcdd0ac2153f5`;
  raw GIF
  `d4fd3f0ab7f3cd0dc9f44dbaee576a7fdc178ea86dda71d5265cb14194b57aac`;
  Complete B + Form GIF
  `55234484dde64a8b7a90dcb7c24acc8505f351c0e69b9aea8182a6e93093cfdd`;
  candidate digest
  `e472931d214d369331d6cb750619471d9234ab11561233e700facab6ea4f0126`.
- Focused validation: 80/80 connected, bounded, grounded, and pixel/alpha
  distinct from approved Pale Echo, public Goblin Scout, and public Imp Sprite;
  opaque range 201-267; 72/72 colored palette frames; 8/8 exact white flashes;
  54/54 expected eye-bearing views; 54/54 readable face-feature views;
  Complete B adds 7,664 pixels and Form
  changes 7,309. Approved Mirecrown and Pale Echo, public 80/259, and all
  fixtures remain unchanged.
- Broad validation: the revised ten-gate EN-E07 predecessor/candidate matrix
  passed in 6.3s, `npm.cmd run check:fast` passed in 58.3s, and full
  `npm.cmd run check` passed in 107.1s before approval and 109.0s against
  approval-local metadata, then 119.8s against the final published tuple, with
  public 80/259 and all 232 fixture sheets exact.
- Visual-review readiness: the exact raw, Complete B + Form, and comparison
  PNGs are open together in responsive Aseprite 1.3.17.2; its live process
  command line names all three frozen paths.
- Approval: after the repaired boards and both GIFs were presented, the
  designer replied `approved` on 2026-08-11. Approval applies only to digest
  `e472931d214d369331d6cb750619471d9234ab11561233e700facab6ea4f0126`;
  the first digest remains superseded. Exact implementation
  `2a295aa70c8a6680ffb85881efa4ccd927a50979`, approval record
  `7d064226d9a0096f8b276f5b0bd30be93435962b`, and initial published handoff
  `0dcd15249d97b3e24bf174b014885fa2c8b6177c` are remote-verified. This
  reconciliation records the completed bounded publication tuple.
- Scope firewall: no registration, fixtures, runtime actor copying, alternate
  bodies, new Cast or Death pixels, detached masks or veil pieces, wings,
  horns, weapons, glow, particles, projectiles, effects, specialist/elite
  Changeling, Kelpie, release, or EN-E08.
- Historical stop: this published checkpoint required a separate `lets do
  next`. The designer later supplied that authorization, opening only the
  isolated Mirrorfold Harrier specialist candidate below.

#### Changeling Mirrorfold Harrier complete suite approved and published

- Gate ID: `en-e07-changeling-mirrorfold-harrier-full-v1`; status: `approved`
  and published on
  `codex/en-e07-changeling-mirrorfold-harrier`, based exactly on clean,
  remote-verified Veilskin Foundling reconciliation
  `5eabfecc08f992db675b64ea3317eb59f67d737c`.
- Authorization: after the exact Veilskin Foundling was visually approved,
  committed, pushed, and reconciled, the designer replied `lets do next` on
  2026-08-11. That opens only this one private specialist Changeling candidate.
- Contract: a compact grounded authored Changeling, taller and narrower than
  Veilskin Foundling, with one connected stepped-diamond mantle, angular
  shoulders, one centered readable face, plum-copper pinched folds, paired
  long ordinary forearms, bent separated legs, and narrow wedge feet. It is
  distinct from Veilskin Foundling, Pale Echo, and Falseface Adept and does not
  copy a runtime actor or use an alternate body, mask, glow, particles, or a
  projectile.
- Motion: Idle tightens and relaxes the diamond mantle; Walk uses four narrow
  alternating cross-steps; Attack crosses the wrists beneath the face, opens
  paired long forearms into an angular feint, drives one connected lead-hand
  harry, and resets. Hurt is exact white recoil then colored closed-mantle
  brace. Cast aliases Attack; Death aliases Hurt H1,H2,H2,H2.
- Frozen evidence: raw PNG
  `e20cf180e46770d0ce8f12f9695067985954d798922c542acaaa14a585b8c834`;
  Complete B + Form PNG
  `27ddbd6b642ff7c8e5f434a4e816f91c7db07935642967d3462bbf8c8c996bfb`;
  Veilskin Foundling/Pale Echo/Falseface Adept comparison PNG
  `56293d0aa4c00fe628cf6ad0b6e5b7278278a7a645606cecac5ba58a56a9e433`;
  raw GIF
  `58353c0cd5564e7fa8bd6d32859d7c6e07fdf94f203213a5cc18c48deb1fcb63`;
  Complete B + Form GIF
  `2e0f5ed576878e6b9f4e49e056c84b892e9ea93589e07aa9b6fe7a8b745e9e29`;
  candidate digest
  `be3e4d03263929ce9677fcf15b742cde769271d037160cd6461b45ea389660f2`.
- Focused validation: 80/80 candidate frames are connected, bounded,
  grounded, and pixel/alpha distinct from all three approved comparisons;
  opaque range 202-248; 80/80 stepped-diamond shoulder spans; 80/80 narrow
  paired-leg rows; 72/72 colored palette frames; 8/8 exact white flashes;
  54/54 expected eye-bearing views; 54/54 readable face-feature views;
  Complete B adds 8,917 pixels and Form changes 7,062. Public 80/259 and all
  fixtures remain unchanged.
- Broad validation: `npm.cmd run check:fast` passed in 56.7s and full
  `npm.cmd run check` passed in 106.1s before approval, 138.6s against
  approval-local metadata, and 95.2s against the final published tuple, with
  public 80/259 and all 232 fixture sheets exact.
- Visual-review readiness: the exact raw, Complete B + Form, and family
  comparison PNGs are open together in responsive Aseprite 1.3.17.2; process
  40804 names all three frozen paths.
- Approval: after the exact packet was presented, the designer replied
  `approved lets do next` on 2026-08-11. Approval applies only to digest
  `be3e4d03263929ce9677fcf15b742cde769271d037160cd6461b45ea389660f2`.
  Exact implementation `ab72a9c0600f016439a5351f363b3b34348dc4b1` and approval
  record `e976ca5fc5c249af4e727fb3bff7d58fd541a932` plus initial handoff
  `4ed366a39165660096306cbb327315b211639e3d` are published and remote-verified.
  This reconciliation completes the bounded publication tuple.
- Scope firewall: no registration, public facade or catalog change, fixtures,
  manifest, shared renderer, exporter, validator, frame-contract change,
  runtime copying, alternate body, detached mask, glow, particles, projectile,
  Kelpie, release, EN-E08, or accepted drift.
- Historical next action: preserve the published tuple byte-for-byte. The same
  reply opened only the private Manyfold Usurper checkpoint below. Do not
  register Changeling, generate fixtures, add runtime copying or effects,
  start Kelpie, release, or advance EN-E08.

#### Changeling Manyfold Usurper complete suite approved and published

- Gate ID: `en-e07-changeling-manyfold-usurper-full-v1`; status: `approved`
  and published on
  `codex/en-e07-changeling-manyfold-usurper`, based exactly on clean,
  remote-verified Mirrorfold Harrier reconciliation
  `fdbb4cf04048a819b9cbe1655146842835b86a73`.
- Authorization: after the exact Mirrorfold Harrier was visually approved,
  committed, pushed, and reconciled, the designer replied
  `approved lets do next` on 2026-08-11. That opens only this one private elite
  Changeling candidate.
- Contract: a broad tall grounded authored Changeling, broader and heavier than
  Mirrorfold Harrier, with one connected three-tier fan mantle, deep side
  drapes, one centered readable face, ink-teal/wine/old-gold folds, paired heavy
  ordinary forearms, a pinched middle, wide separated pillar legs, and broad
  slab feet. It is distinct from Mirrorfold Harrier, Veilskin Foundling, and
  Grand Pretender and does not copy a runtime actor or use an alternate body,
  detached mask, wings, glow, particles, a projectile, or effects.
- Motion: Idle opens and settles the three-tier fan; Walk uses four deliberate
  wide alternating slab steps; Attack clasps the hands beneath the face, opens
  the heavy forearms into a wide decree, drives one connected centered two-palm
  press, and resets. Hurt is exact white recoil then colored collapsed-fan
  brace. Cast aliases Attack; Death aliases Hurt H1,H2,H2,H2.
- Frozen evidence: raw PNG
  `f33e2449d3ab77124af6a17b5d7727a7c92d76c2b4b78e1bcfcd227686e219f5`;
  Complete B + Form PNG
  `e2febf3f3ee2f0f2cf1db45041ab86d89d229d2c291f16130696a15c99218817`;
  Mirrorfold Harrier/Veilskin Foundling/Grand Pretender comparison PNG
  `9791178ce188b8ac7095d3e206dd5d0cb71c4ca903954653b8ee8a5ee3d52645`;
  raw GIF
  `d4bc6f78a1e91f3e586ef2c8d9817ffa931bcc8875e34f7e2ff15a42f471fd4d`;
  Complete B + Form GIF
  `2ce887c526c6985cc4b775555284391018ecd693824d378a0be891f8feb399f0`;
  candidate digest
  `f3ed9a91cb01746fc7467e59c92335778a85b476495f5772ac81cf2a6cbda246`.
- Focused validation: 80/80 candidate frames are connected, bounded,
  grounded, broad-three-tier, wide-pillar, and pixel/alpha distinct from all
  three approved comparisons; opaque range 276-330; 72/72 colored palette
  frames; 8/8 exact white flashes; 54/54 expected eye-bearing views; 54/54
  readable face-feature views; Complete B adds 8,378 pixels and Form changes
  11,849. Public 80/259 and all fixtures remain unchanged.
- Broad validation: `npm.cmd run check:fast` passed in 48.5s and full
  `npm.cmd run check` passed in 93.1s before approval, 104.1s immediately
  before implementation publication, 112.9s against approval-local metadata,
  and 113.4s against the final published tuple, with public 80/259 and all 232
  fixture sheets exact.
- Visual-review readiness: the exact raw, Complete B + Form, and family
  comparison PNGs are open together in responsive Aseprite 1.3.17.2; process
  39276 names all three frozen paths. An early oversized square mask-like face
  and Harrier-adjacent side read were corrected before the evidence freeze;
  the final face is smaller, readable, and held within exposed tier seams and
  connected side drapes.
- Approval: after the exact packet was presented, the designer replied
  `approved lets do next` on 2026-08-11. Approval applies only to digest
  `f3ed9a91cb01746fc7467e59c92335778a85b476495f5772ac81cf2a6cbda246`.
  Exact implementation `38f9d7f9b3ac5a34bdff91be1fd878e158d26bfe`, approval record
  `306aa3ac1ba658cb48e223651410a7df494e7b9e`, and initial handoff
  `0d2f5ce3665f848633b4f7a1596356659d720afe` are published and remote-verified.
  This reconciliation completes the bounded publication tuple.
- Scope firewall: no registration, public facade or catalog change, fixtures,
  manifest, shared renderer, exporter, validator, frame-contract change,
  runtime copying, alternate body, detached mask, wings, glow, particles,
  projectile, effects, Kelpie, release, EN-E08, or accepted drift.
- Historical next action: preserve the published tuple byte-for-byte. The same
  reply opened only the private Miremane Courser checkpoint below. Do not
  register Changeling or Kelpie, generate fixtures, implement runtime copying,
  add effects, start later Kelpie roles, release, or advance EN-E08.

#### Kelpie Miremane Courser complete suite approved and published

- Gate ID: `en-e07-kelpie-miremane-courser-full-v1`; status: `approved`
  on `codex/en-e07-kelpie-miremane-courser`, based exactly on clean,
  remote-verified Manyfold Usurper reconciliation
  `6ddef83e03e983672bee39b6b484dd1c1bfcba01`.
- Authorization: after the exact Manyfold Usurper was visually approved,
  committed, pushed, and reconciled, the designer replied `approved lets do
  next` on 2026-08-11. That opens only this one private common Kelpie candidate.
- Contract: a low lean waterlogged authored equine with a bowed wet neck, long
  readable muzzle, connected dripping mane, long ribbed barrel, four separated
  legs over four grounded dark hooves, and a connected drowned-weed tail. Its
  peat-black teal, drowned green, brackish belly, and old-reed palette remains
  distinct from Steppe Hunter, Dire Wolf, and Marsh Crocodile. It does not use
  a Centaur humanoid torso or rider, spear or saddle, Unicorn horn or crown,
  Wolf head or tail, Crocodile belly or jaw, skeleton gaps, a copied mount, or
  detached water sheets, splashes, foam, ripples, droplets, mist, glow,
  particles, projectiles, or effects.
- Motion: Idle lifts the connected mane and dips the head; Walk uses four
  alternating upper-leg and knee phases over four separated grounded hoof
  contacts; Attack draws the neck, lowers the muzzle, drives a connected head
  and shoulder lunge, and recovers. Hurt is exact white recoil then a colored
  head-low four-hoof brace. Cast aliases Attack; Death aliases Hurt
  H1,H2,H2,H2.
- Frozen evidence: raw PNG
  `dd4b7f47344b641c8792dc94f04e23320c91e9bb5ec1223ffc70e2add6991311`;
  Complete B + Form PNG
  `be4747757a7b334dc2a74ea9ab68029ce804838011f9742b83b705411dbe1e91`;
  Steppe Hunter/Dire Wolf/Marsh Crocodile comparison PNG
  `aa83bce8c88338667c01602133e3780b5e4dd92e2da1eaa4676fc3771d66901e`;
  raw GIF
  `d056dfd9bf0855650bc02a07ff888f1f363e22f74ae726b8afa1b8bdf00df607`;
  Complete B + Form GIF
  `38e8dc8a182829ec2b1f9003fa3272e011d58838992c46dc575c77dc0c044992`;
  candidate digest
  `6efd596731a468be7647ee37f048046072bad289f209926e4db862cb63b01f32`.
- Focused validation: 80/80 candidate frames are connected, bounded,
  grounded, retain four separated hoof contacts and long equine spans, and are
  pixel/alpha distinct from all three protected comparisons; opaque range
  166-221; 72/72 colored palette frames; 8/8 exact white flashes; 54/54
  expected eye-bearing views; 54/54 readable muzzle views; Complete B adds
  10,468 pixels and Form changes 4,904. Approved Steppe Hunter plus public Dire
  Wolf and Marsh Crocodile remain exact; public 80/259 and fixtures are
  unchanged.
- Broad validation: the focused gate passed in 0.5s,
  `npm.cmd run check:fast` passed in 66.0s, and full `npm.cmd run check` passed
  in 110.4s before approval and 120.2s immediately before the implementation
  commit, 102.4s against approval-local metadata, and 110.8s against the final
  published tuple, with public 80/259 and all 232 fixture sheets exact.
- Visual-review readiness: the exact raw, Complete B + Form, and family
  comparison PNGs are open together in Aseprite; the live sprite list reports
  those three frozen paths at IDs 7, 11, and 15. The first draft's front/rear
  four-pillar read and reed-colored tail tip were corrected by clarifying the
  narrow equine face, chest and rump, tapered legs, and drowned-mane tail. A
  later gait audit repaired touching hooves and two detached walk legs; the
  final suite retains four separated hoof contacts and fully connected limbs.
- Approval: after the exact packet was presented, the designer replied
  `approved` on 2026-08-11. Approval applies only to digest
  `6efd596731a468be7647ee37f048046072bad289f209926e4db862cb63b01f32`.
  Exact implementation `74463a2b1944b7d3a6d412923c205a0c9cc648f1` and approval record
  `8fb53e961247da875814593feb132182648f9e48` plus initial handoff
  `ae532a17e92c3a7b0b99ccd3c938f8174f102dd6` are published and remote-verified
  under the standing bounded publication permission. This reconciliation
  completes the bounded tuple. The designer's later `lets do next` opens only
  the Drownbridle Stalker specialist checkpoint below.
- Scope firewall: no registration, public facade or catalog change, fixtures,
  manifest, shared renderer, exporter, validator, frame-contract change,
  runtime copying, alternate body, rider, saddle, horn, detached water, glow,
  particles, projectile, effects, later Kelpie role, release, EN-E08, or
  accepted drift.
- Historical next action: preserve this tuple byte-for-byte. The later `lets do
  next` opens only the private specialist checkpoint below. Do not register
  Kelpie, generate fixtures, add runtime copying or effects, begin the elite,
  release, or advance EN-E08.

#### Kelpie Drownbridle Stalker complete suite approved and published

- Gate ID: `en-e07-kelpie-drownbridle-stalker-full-v1`; status: `approved` and
  published on
  `codex/en-e07-kelpie-drownbridle-stalker`, based exactly on clean,
  remote-verified Miremane Courser reconciliation
  `f143de1fadf3b812f3968d930acf6451e926388d`.
- Authorization: after the exact Miremane Courser was visually approved,
  committed, pushed, and reconciled, the designer replied `lets do next` on
  2026-08-11. That opens only this one private specialist Kelpie candidate; the
  elite remains deferred.
- Contract: a forward-heavy authored equine with a high arched neck, long
  hooked readable muzzle, connected block crest mane, connected ochre reed
  bridle, deep wedge chest, short powerful barrel, four separated fetlocked
  legs over four grounded dark hooves, and one thick connected ropeweed tail.
  It does not use a Centaur torso or rider, spear or saddle, Unicorn horn or
  crown, Wolf or Crocodile anatomy, skeleton gaps, armor plates, a copied mount,
  loose reins, detached water, glow, particles, projectiles, or effects.
- Motion: Idle raises and settles the crest while the bridle tightens; Walk
  uses four stalking diagonal hoof phases; Attack coils the high neck, lowers
  the hooked bridled muzzle, drives one connected chest-and-muzzle ram, and
  recovers. Hurt is exact white recoil then a colored wide four-hoof brace.
  Cast aliases Attack; Death aliases Hurt H1,H2,H2,H2.
- Frozen evidence: raw PNG
  `3fc970d3ffc5c33b11ec8a4d563f8684650d6548288a62dbc9191259edc75561`;
  Complete B + Form PNG
  `80a09e7a2062d0a34fc9aa906ef39218866afee461952805f2689a8fe3bdd0bf`;
  Miremane Courser/Steppe Hunter/Dire Wolf comparison PNG
  `3c7f0d4702dcd10c1f905b51717baabf3844a4d4b70e0c17736ecfa799ff51ff`;
  raw GIF
  `4b48a5454b1aabdc691578715e35b961b4a896fc9d1be9e37dfc901e17c7ca21`;
  Complete B + Form GIF
  `18795cb0c27078a180f7044c228b5542ad100cb62b1ad8d0ccd749e5865e7781`;
  candidate digest
  `d8cbbfef97b63590e6a63335a6b241e742d87f4df5e7443933c5484ef849224b`.
- Focused validation: 80/80 candidate frames are connected, bounded,
  grounded, retain four separated hoof runs and high-crested specialist spans,
  and are pixel/alpha distinct from all three protected comparisons; opaque
  range 203-274; 72/72 colored palette frames; 8/8 exact white flashes; 54/54
  expected eye-bearing views; 54/54 readable muzzle views; Complete B adds
  9,789 pixels and Form changes 6,465. Approved Miremane Courser and Steppe
  Hunter plus public Dire Wolf remain exact; public 80/259 and fixtures are
  unchanged.
- Broad validation: the frozen focused gate passed in 0.7s,
  `npm.cmd run check:fast` passed in 53.2s, and full `npm.cmd run check` passed
  in 104.7s before approval and 110.3s against approval-local metadata, with
  public 80/259 and all 232 fixture sheets exact.
- Visual-review readiness: the exact raw, Complete B + Form, and family
  comparison PNGs are open together in Aseprite at IDs 19, 23, and 27. The
  face, one-cell crown margin, bridle overlap, and profile eye were corrected
  before freeze.
- Approval: the designer replied `approved lets do next` on 2026-08-11;
  approval applies only to digest
  `d8cbbfef97b63590e6a63335a6b241e742d87f4df5e7443933c5484ef849224b`.
  Exact implementation `c34b3b9564df683900ff3846d692970faca53ff5` and approval
  record `b5a9011b37dc9a3e0db7c371fa168e589665a127` are published and
  remote-verified, and initial handoff
  `1ba57fefe52398c2c007c01adfde6384c327e6f8` is published and remote-verified
  under the standing bounded publication permission. This reconciliation
  completes the publication tuple.
- Scope firewall: no registration,
  public facade or catalog change, fixtures, manifest, shared renderer,
  exporter, validator, frame-contract change, runtime copying, alternate body,
  rider, saddle, horn, detached water, glow, particles, projectile, effects,
  elite Kelpie, release, EN-E08, or accepted drift.
- Historical next action: the same `approved lets do next` reply opened only the
  private Blackwake Dreadmare elite checkpoint below. It did not open
  registration, fixtures, runtime copying, effects, release, or EN-E08.

#### Kelpie Blackwake Dreadmare complete suite approved and published

- Gate ID: `en-e07-kelpie-blackwake-dreadmare-full-v1`; status:
  `approved` and `published` on
  `codex/en-e07-kelpie-blackwake-dreadmare`, based exactly on clean,
  remote-verified Drownbridle Stalker reconciliation
  `f9928aed53cd842b937d396e29ec8d6a7aaa8120`.
- Authorization: after the exact Drownbridle Stalker was visually approved,
  committed, pushed, remotely verified, and reconciled, the designer replied
  `approved lets do next` on 2026-08-11. That opens only this one private elite
  Kelpie candidate.
- Contract: a broad rear-heavy authored equine with a tall arched neck, long
  blunt readable muzzle, one connected breaker mane sweeping from poll to back,
  massive deep barrel and sternum, four thick separated legs over four broad
  grounded dark hooves, and one connected hooked blackwake tail. It does not use
  a Centaur torso or rider, saddle or spear, Unicorn horn or crown, Wolf or
  Crocodile anatomy, skeleton gaps, armor or barding, copied mount geometry,
  detached water, glow, particles, projectiles, or effects.
- Motion: Idle heaves and settles the breaker mane and barrel; Walk uses four
  crushing diagonal hoof phases; Attack draws the tall neck, opens the blunt
  jaw, drives one connected shoulder-and-jaw surge, and recovers. Hurt is exact
  white breaker recoil then a colored collapsed-breaker four-hoof brace. Cast
  aliases Attack; Death aliases Hurt H1,H2,H2,H2.
- Frozen evidence: raw PNG
  `2d902c8fafdb016affc2858fa332196fa1585f5013b2d5a80e07733da81d6e1f`;
  Complete B + Form PNG
  `cb70a90ae5cfd604412e34b8dd980dca24b93f3db12c42e479920bc2cc44b891`;
  Drownbridle Stalker/Miremane Courser/Steppe Hunter comparison PNG
  `d0176a8dd8136b9cef40e1d97bf3322a02153f096512bf2099829241802919ed`;
  raw GIF
  `082ce13f2b2a72997d36b6738a643bde3b53a8df3c15ff035166b7cb256e4520`;
  Complete B + Form GIF
  `60fb0e3f2db76113eb0b8d8f2615b9fd65cce31f1f5dfa1c1173d6251c4aa806`;
  candidate digest
  `be29daec400cffca3f5822aec3bd6ca37c8139a8783f51c7238b47aa37001172`.
- Focused validation: 80/80 candidate frames are connected, bounded, grounded,
  retain four separated hoof runs and broad tall elite spans, and are
  pixel/alpha distinct from all three protected comparisons; opaque range
  255-319; 72/72 colored palette frames; 8/8 exact white flashes; 54/54 expected
  eye-bearing views; 54/54 readable muzzle views; Complete B adds 9,532 pixels
  and Form changes 6,673. Approved Drownbridle Stalker, Miremane Courser, and
  Steppe Hunter remain exact; public 80/259 is unchanged and no fixture or
  manifest was modified.
- Broad validation: `npm.cmd run check:fast` passed in 62.9s and full
  `npm.cmd run check` passed in 121.9s before approval and 112.2s against
  approval-local metadata, with public 80/259 and all 232 fixture sheets exact.
- Visual-review readiness: the exact raw, Complete B + Form, and comparison PNGs
  are open together in Aseprite process 27380. The front/profile eyes,
  nostrils, and mouths remain readable, including the jaw-open attack.
- Approval: after the exact packet above was presented, the designer replied
  `approved lets do next` on 2026-08-11. Approval applies only to candidate
  digest `be29daec400cffca3f5822aec3bd6ca37c8139a8783f51c7238b47aa37001172`.
  Exact implementation `3a3ffce6997a6cc9735b818e13573b9085229555` and approval record
  `a397f3034b9ce894dd7caf971d4b3c1fbc9cb2e6` plus initial handoff
  `d4cfd72229355ccb6024e676562303bc6d633f98` are published and remote-verified
  under the standing bounded publication permission. This reconciliation
  completes the publication tuple.
- Scope firewall: no registration, public facade
  or catalog change, fixtures, manifest, shared renderer, exporter, validator,
  frame-contract change, runtime copying, alternate body, rider, saddle, horn,
  armor or barding, detached water, glow, particles, projectile, effects,
  release, EN-E08, or accepted drift.
- Historical next action: the clean published Blackwake reconciliation opened
  only the EN-E08 architecture decision below. The designer later selected the
  recommended baked single-actor option and opened only the Hollow Sentry
  acceptance candidate recorded below.

### EN-E08 - Possessed equipment

- Status: `acceptance-candidate`
- Families/proposals: Haunted Armor + Animated Armor merged as
  `animated-armor`, Headless Rider, Possessed Mask, Living Weapon
- Priority-first: `animated-armor`

Shared leverage: hollow silhouettes, floating components, rider/mount joins,
and equipment acting as a body. Architecture decision
`en-e08-baked-single-actor-v1` is selected for the first Animated Armor lane:
helmet, armor, gauntlets, bindings, greaves, sabatons, and any later approved
family weapon belong to one deterministic 24x24 actor. The current candidate
has zero child assets. Any separate head, mask, rider, mount, gauntlet, or
living-weapon asset must stop at a new explicit architecture gate; do not solve
it with incidental per-frame offsets.

#### Living Weapon Oathbite Cleaver common approved and published

- Gate ID: `en-e08-living-weapon-oathbite-cleaver-full-v1`; status
  `approved` and `published` on
  `codex/en-e08-living-weapon-architecture`, based
  exactly on published Threnecrown reconciliation
  `6f2a51739a65b88f8c50644e92e440c8004cc049`.
- Authorization and topology: the designer approved the recommended
  deterministic baked 24x24 single actor with zero child assets by replying
  `awesome lets do next`. Decision
  `en-e08-living-weapon-baked-single-actor-v1` owns the blade, spine, core,
  guard, grip, pommel, and tassel in one array and authorizes only this private
  common candidate.
- Identity and motion: broad chipped steel cleaver, heavy spine, one teal core,
  hooked edge, rust claw guard, wine grip, pommel, and short tassel. Idle pulses
  the core; Walk uses four hover phases; Attack braces, raises, drives one
  body-owned cleave, and recovers. Hurt is white recoil then colored brace.
  Cast aliases Attack; Death aliases Hurt H1,H2,H2,H2.
- Frozen digest:
  `6aba171cd7960766078e0fefd6e08cda2313d9f1b8e110d74ad4e78325d58a46`.
  PNG hashes are `9eb25986...d209`, `284df632...8889`, and
  `1d2cfd7d...9530`; GIF hashes are `f8c13d15...a22c` and
  `cc08c221...37ce`.
- Focused 80-frame gate passes with 80/80 connected, bounded, and hovering,
  54/54 readable core views, public 80/259, and approved predecessor pixels
  exact. Fast/full validation passes in 60.4s/110.3s before approval metadata
  and 51.3s/98.0s approval-local with all 232 fixtures unchanged.
- Approval: the exact packet was presented and the designer replied `approved
  lets do next`. Implementation
  `ceafc0badba8c31876cfa3c8055091ba752dbf5d` records the accepted pixels. The
  implementation and approval record
  `1c506640bb270c49815f0de357e9cb051b715cee` are remote verified. Initial
  published handoff `ad6388d308c95e498601b0b40d5406a30253fd44` is also remote
  verified; this reconciliation completes the bounded publication tuple. The
  same reply opens only one private specialist Living
  Weapon art candidate after clean remote reconciliation. Registration,
  fixtures, child assets, effects, the elite role, EN-E09, release, accepted
  drift, and a PR remain closed.

#### Possessed Mask Threnecrown Hierophant elite approved and published

- Gate ID: `en-e08-possessed-mask-threnecrown-hierophant-full-v1`; status
  `approved` and `published` on
  `codex/en-e08-possessed-mask-threnecrown-hierophant`, based exactly on
  published Mournseal reconciliation
  `4f7a1146f1b90c8e70b819461d29a4be72cb379a`.
- Authorization: after the Mournseal publication tuple was reconciled, the
  designer replied `approved lets do next`. This opens only one private elite
  Threnecrown Hierophant art candidate.
- Architecture: one deterministic baked 24x24 actor, zero child assets. The
  three-prong crown-brow, aged-ivory face, crimson tiered mantle, and old-gold
  chain tabs are actor pixels; hosts, detached masks, effects, runtime
  attachments, schemas, shared renderers, exporters, validators, registration,
  and fixtures remain out.
- Identity and motion: two rose-magenta eyes, deep cheeks, long nose ridge,
  barred mouth, and wide jaw. Idle breathes the mantle; Walk uses four hover
  phases; Attack gathers tabs, seals the mouth, opens one body-owned sovereign
  edict, and settles. Hurt is white recoil then colored brace. Cast aliases
  Attack; Death aliases Hurt H1,H2,H2,H2.
- Frozen digest:
  `51ca678e1dee5e086d0fa439686c0e699b857b2ab00dfa4ab7a963546c11c81f`.
  PNG hashes are `896121c2...370d`, `54e5c643...cc16`, and
  `a351d886...07e8`; GIF hashes are `066fee33...88e4` and
  `193c2681...8888`.
- Focused 80-frame gate passes; fast/full validation passes in 57.0s/107.1s
  before approval metadata and 62.0s/119.1s approval-local with public 80/259
  and all 232 fixtures exact. The exact three PNGs were open together in
  Aseprite for approval.
- Approval: the exact packet was presented and the designer replied `approved
  lets ddo next`. Implementation
  `4bf12351ebe643520f052c08bacd385141231a3f` records the accepted pixels.
  Approval record `3ba7a1c49aae4fd759df2912c7e16a8637039a83` and the implementation
  are remote verified. Initial published handoff
  `15b2c26232d3098705b7704b6aee0d52ba2a18b9` is also remote verified; this
  reconciliation completes the bounded publication tuple. The same reply opens only the Living Weapon actor-topology
  architecture decision after clean remote reconciliation and does not
  authorize its art. Registration, fixtures, child assets, effects, EN-E09,
  release, accepted drift, and a PR remain closed.

#### Possessed Mask Mournseal Cantor specialist approved and published

- Gate ID: `en-e08-possessed-mask-mournseal-cantor-full-v1`; status
  `approved` and `published` on
  `codex/en-e08-possessed-mask-mournseal-cantor`, based exactly on published
  Whisperveil reconciliation `2ab49dc879a852d8a3c1a5f14de93345b32d490a`.
- Authorization: after the Whisperveil publication tuple was reconciled, the
  designer replied `lets do next`. This opens only one private specialist
  Mournseal Cantor art candidate.
- Architecture: one deterministic baked 24x24 actor, zero child assets. The
  tall ash-bone mask, connected storm-blue fan shroud, and ochre braided cords
  are actor pixels; hosts, detached masks, sound rings, effects, runtime
  attachments, schemas, shared renderers, exporters, validators, registration,
  and fixtures remain out.
- Identity and motion: two amber eyes, paired tear channels, nose ridge, oval
  mouth, and long chin. Idle breathes the fan; Walk uses four hover phases;
  Attack gathers cords, seals the mouth, opens one body-owned binding canticle,
  and settles. Hurt is white recoil then colored brace. Cast aliases Attack;
  Death aliases Hurt H1,H2,H2,H2.
- Frozen digest:
  `5f54d5f716a11e42e813c7f09c1031d7090b1ac51a9cd93f93f6e0df08ac4e55`.
  PNG hashes are `47514216...cfc4`, `08307dc0...61bc`, and
  `81014bad...1835`; GIF hashes are `16002a90...e9e` and
  `ed7797d9...5a39`.
- Focused 80-frame gate passes; `check:fast` passes in 56.2s and full `check`
  in 109.0s with public 80/259 and all 232 fixtures exact. The exact three PNGs
  are open together in responsive Aseprite process 3228.
- Approval: the exact packet was presented and the designer replied `approved
  lets do next`. Implementation
  `b1fd09ab0b04128330178a99c0379783621e478f` records the accepted pixels.
  Approval record `ae364550cf2ecfece032098800b2c1df018ee2a5` and the
  implementation are remote verified. Initial handoff
  `0309590d9d025e8cdfa960131a3d7835730c3f7b` is also remote verified; this
  reconciliation completes the bounded publication tuple. The same reply opens
  one private elite Possessed Mask gate
  after clean remote reconciliation. Registration, fixtures, child assets,
  effects, Living Weapon, EN-E09, release, broader publication, accepted drift,
  and a PR remain closed.

#### Possessed Mask Whisperveil Visage common approved and published

- Gate ID: `en-e08-possessed-mask-whisperveil-visage-full-v1`; status
  `approved` and `published` on
  `codex/en-e08-possessed-mask-whisperveil-visage`, based exactly on published
  Crownvault reconciliation `42156250f24d03b7e81a29e14cec75c25528cde4`.
- Authorization: after abandoning Headless Rider, the designer accepted
  Possessed Mask as next and replied `lets go`. This opens only one private
  common Whisperveil Visage art candidate.
- Architecture: one deterministic baked 24x24 actor, zero child assets. The
  broad bone mask, connected shroud, and tether ribbons are actor pixels; hosts,
  detached masks, possession overlays, effects, runtime attachments, schemas,
  shared renderers, exporters, validators, registration, and fixtures remain out.
- Identity and motion: two cold eyes, nose ridge, mouth, cheek cracks, pointed
  chin, violet shroud, and wine ribbons. Idle breathes the shroud; Walk uses four
  hover phases; Attack gathers ribbons, seals the mouth, opens one body-owned
  shriek, and settles. Hurt is white recoil then colored brace. Cast aliases
  Attack; Death aliases Hurt H1,H2,H2,H2.
- Frozen digest:
  `c0fac02331632e028b73a21cadd4b472b1bdc18f7d4915b814e9a872dbc0b098`.
  PNG hashes are `cd4a3758...b190d`, `5df28a32...9f88c`, and
  `b6e71886...6e17`; GIF hashes are `d4603cc0...e8b0` and
  `4ddf94aa...6245`.
- Focused 80-frame gate passes; `check:fast` passes in 59.2s and full `check`
  in 106.4s before publication metadata and 115.5s against the final published
  tuple, with public 80/259 and all 232 fixtures exact.
- Approval: the exact packet was presented and the designer replied `approved`.
  Implementation `78f5446c7821bd751c3562d0a18056a64c0e00c6` records the
  accepted pixels. Approval record `c27435976f03a4f9263f6f4bbc4b46dc275b19a7`
  and the implementation are remote verified. Initial handoff
  `29316d8c0c2cbaa900d34cf6b372679dc447ef2e` is also remote verified; this
  reconciliation completes the bounded publication tuple. Registration,
  fixtures, child assets, effects,
  later Possessed Mask roles, Living Weapon, EN-E09, release, accepted drift,
  further publication, and a PR remain closed.

#### Animated Armor Crownvault Castellan elite approved and published

- Gate ID: `en-e08-animated-armor-crownvault-castellan-full-v1`; status:
  `approved` on
  `codex/en-e08-animated-armor-crownvault-castellan`, based exactly on clean
  published Runeforge Custodian reconciliation
  `700f2cedb1d3104369931a97bfec31a3b49fff93`.
- Authorization: after the Runeforge publication tuple was reconciled, the
  designer replied `lets do nextr`, opening exactly one private elite Animated
  Armor candidate. Registration, fixtures, child/state assets, effects,
  Headless Rider, Possessed Mask, Living Weapon, EN-E09, release, accepted
  drift, and a PR remain closed.
- Identity: independently authored monumental royal fortress-suit with a
  crenellated crownvault helm, one readable ivory T-shaped seal, tower
  pauldrons, broad gatehouse chest, connected bastion gauntlets, portcullis
  waist, pillar greaves, and grounded plinth sabatons. Charcoal plate, old gold
  bands, wine-dark vault insets, and black joints distinguish it from approved
  Runeforge Custodian, Hollow Sentry, Fallen Knight, Clockwork Automaton,
  Living Weapon, and boss-scale Colossus identities.
- Architecture and motion: `en-e08-baked-single-actor-v1`, zero child assets.
  Idle locks/releases the T-seal; Walk uses four monumental plinth stamps;
  Attack closes both connected bastion gauntlets, draws the gatehouse chest,
  drives one body-owned fortress press, and recovers. Hurt is white recoil then
  a colored portcullis brace. Cast aliases Attack; Death aliases Hurt
  H1,H2,H2,H2.
- Frozen digest:
  `112feaad57ce04cb2dae15f5bd33f2e7e4fd3418cd3aece68aeb345ff1dc9039`.
  Raw/assembled/comparison PNG hashes are
  `43dfbf617e3e746be3e1afaeafdbff628502709bfd68ba8c02ea7c2f0d9cde47`,
  `1ee1f901c04d95a191d7608f8a41443dfaa4c9ad6593bc1fdc76d4d3db4828e4`,
  and `6f6b4dc735803dd902571047ce44e5ee33472e962a303eb2072ecae93dc319ce`.
  Raw and Complete B + Form GIF hashes are
  `5129fed8d00af19fc52de9d6e36ea3b9d36f03e46a390e380d9ced5ba8bc642c`
  and `554d85925e689b89e7bfdcef573d44e96313c8077fc5013081dd906786aa414b`.
- Focused validation passes: 80/80 connected, bounded, grounded, split-plinth,
  broad-fortress, baked-topology, and pixel/alpha distinctions from approved
  Runeforge Custodian, Hollow Sentry, and Fallen Knight Shieldbearer; 72/72
  colored frames retain every palette, 8/8 flashes are exact white, and 54/54
  expected views retain the T-seal. Opaque range is 262-356; Complete B adds
  8,202 pixels and Form changes 7,420.
- Broad validation: `check:fast` passes in 56.4s and full `npm.cmd run check`
  passes in 105.6s. Public 80/259 and all 232 fixture sheets remain exact.
- Visual-review readiness: the exact frozen raw, Complete B + Form, and
  comparison PNG paths are open together in responsive Aseprite 1.3.17.2
  process 32136.
- Approval: the exact raw, Complete B + Form, comparison, and both synchronized
  GIFs were presented with the three PNG paths open in responsive Aseprite
  1.3.17.2 process 32136. The designer replied `approved`; implementation
  `46d09a4e16a11f9c622cb698ff30055bb9bcb877` records the exact accepted
  pixels. Approval record `9c21f92aed06a66092279e8d53db6cb9a289cbd9`
  and the implementation are remote verified. Initial published handoff
  `9aea250a9a509a27a233d27633e6f7cf9bb759a2` is also remote verified; this
  reconciliation completes the bounded publication tuple.
  Registration, fixtures, effects,
  later EN-E08 families, release, accepted drift, and a PR remain closed.

#### Animated Armor Runeforge Custodian specialist approved preceding

- Gate ID: `en-e08-animated-armor-runeforge-custodian-full-v1`; status:
  `approved` on
  `codex/en-e08-animated-armor-runeforge-custodian`, based exactly on clean
  published Hollow Sentry reconciliation
  `dc86bb65053564c76b18e848933ab4c2d318bfde`.
- Authorization: after the Hollow Sentry publication tuple was reconciled, the
  designer replied `lets do next`, opening exactly one private specialist
  Animated Armor candidate. Registration, fixtures, child/state assets,
  effects, the elite role, Headless Rider, Possessed Mask, Living Weapon,
  EN-E09, release, accepted drift, and a pull request remain closed.
- Identity: independently authored constructed-rune-lock armor with an angular
  crownless helm, one vertical readable rune-lock face aperture, level square
  pauldrons, deep hexagonal forge chest, connected interlocking gauntlets,
  rigid joint belt, divided greaves, and grounded wedge sabatons. Slate plate,
  warm copper bands, dark fixed joints, and inset blue runes distinguish it
  from haunted Hollow Sentry, Fallen Knight, Revenant, gear-driven Clockwork
  Automaton, and independent Living Weapon.
- Architecture and motion: `en-e08-baked-single-actor-v1`, zero child assets.
  Idle seats/releases the rune lock; Walk uses four deliberate forge stamps;
  Attack keys both connected gauntlets, draws the hex chest, drives one
  body-owned interlocking press, and recovers. Hurt is white recoil then a
  colored locked-joint brace. Cast aliases Attack; Death aliases Hurt
  H1,H2,H2,H2.
- Frozen digest:
  `629930688cca04f3d714e12225ab8c3db7c494c5fbaf027d65ec7f8d530ccf85`.
  Raw/assembled/comparison PNG hashes are
  `fe033a30fb075a303334d2ee7f2c9af8c17e4b0ec915e068f486ce3703c8854a`,
  `03faefe1460e956963484b722508ab999a4aae605d3af1d6ed29174f39bfdb82`,
  and `b7cea70e48d5ac23e6fdb203cb7bd41cfda65885447987d30e4a5499b3d89f0d`.
  Raw and Complete B + Form GIF hashes are
  `9f6d1335c8bf68d2a56194efeda38823df2604ceb60e2498d1b3520849203f90`
  and `5165326ba7dccb437de52277d01f001a6c28de265238bd7e2c736f85b82025f9`.
- Focused validation passes: 80/80 connected, bounded, grounded, split-wedge,
  tall-square, baked-topology, and pixel/alpha distinctions from approved
  Hollow Sentry, Fallen Knight Shieldbearer, and Grave Oathkeeper Revenant;
  72/72 colored frames retain every palette, 8/8 flashes are exact white, and
  54/54 expected views retain the rune-lock aperture. Opaque range is 228-330;
  Complete B adds 7,584 pixels and Form changes 7,788.
- Broad validation: frozen review + focused + `check:fast` pass together in
  59.6s; full `npm.cmd run check` passes in 113.1s. Public 80/259 and all 232
  fixture sheets remain exact.
- Visual-review readiness: the exact frozen raw, Complete B + Form, and
  comparison PNG paths are open together in responsive Aseprite 1.3.17.2
  process 42856.
- Approval: after the exact frozen packet was presented and the three PNGs were
  open in responsive Aseprite, the designer replied `accepted`. Implementation
  `d73ca9334640384d9b531c0d8375c1a42e459212` and approval record
  `717b4f7f735984550f44ce90d0bba58cfd6e1762` plus initial handoff
  `054b100cbf9edc8e13facb5f8a312c03b9a7bdd9` are remote verified. This
  reconciliation completes the bounded publication tuple.
  Registration, fixtures, effects, the elite role,
  later EN-E08 families, release, accepted drift, and a PR remain closed; a
  separate `lets do next` is required from this clean published reconciliation.

#### Animated Armor Hollow Sentry approved preceding suite

- Gate ID: `en-e08-animated-armor-hollow-sentry-full-v1`; status: `approved`
  and `published` on
  `codex/en-e08-animated-armor-architecture`, based exactly on clean published
  Blackwake reconciliation `defc9b8cab1226610da6cf2b17951c8b5815499e`.
- Authorization and topology: after the Blackwake tuple was published and
  reconciled, the designer was shown the recommended baked actor and the
  deterministic child/state alternative, then replied `lets do next`. In that
  immediate choice context, the reply selects the recommended option and
  authorizes exactly one private common Hollow Sentry. All 80 render results
  report `baked-single-actor` and zero child assets. No schema, shared renderer,
  exporter, validator, or frame-contract change is permitted.
- Collision and role boundary: Haunted Armor and Animated Armor stay merged as
  one `animated-armor` family. Hollow Sentry is the haunted-default common role;
  constructed identities, specialist/elite roles, Headless Rider, Possessed
  Mask, and Living Weapon remain deferred.
- Identity: one broad grounded empty suit with a sealed low-crested helm, wide
  black visor and paired haunt gaze, mismatched pauldrons, hollow ribbed
  breastplate, oversized connected gauntlets, bound waist, separated greaves,
  and broad grounded sabatons. Flesh, corpse hands, skeleton gaps, robe bodies,
  gears, handheld weapons, shields, floating plate, and detached components are
  excluded.
- Motion: Idle locks and settles the empty shell; Walk uses four weighty iron
  steps; Attack closes the gauntlets into guard, draws the breastplate back,
  commits to one connected full-body iron clamp, and recovers. Hurt uses an
  exact white recoil and colored buckled-plate brace. Cast aliases Attack;
  Death aliases Hurt H1,H2,H2,H2.
- Frozen candidate digest:
  `f6e7cbf25692b08e2e4dfccef149662c18d195e4cf615185f7a38e4874e2b9ac`.
- Frozen artifacts: raw
  `d4e257be9814475c9ecab189f2842541b1fc1264aa95b90098d295a56f4be022`;
  Complete B + Form
  `86bfde2b5091db85f718f8603e8391db21424981bcb46f0985885fc141ce863e`;
  Fallen Knight/Revenant/Gloam comparison
  `85d3bdc53b356eb886329be6045531f9644a11e44965de385bcb4848cf4e8619`;
  raw GIF `731cee04ff79fbeced685299be575cee643b52b88f2ee3404783587b91f4a330`;
  Complete B + Form GIF
  `54faee2dad6939c3e377a7a2eb99358860419e8ebfac4fc5f04b03bd6591a294`.
- Validation: 80/80 connected, bounded, grounded, split-sabaton, broad-plate,
  and baked-topology frames; 72/72 colored frames; 8/8 exact white flashes;
  54/54 readable visor views; exact aliases and mirrors; 80/80 pixel and alpha
  distinctions from all three protected comparisons. Opaque range 219-306;
  Complete B adds 7,272 pixels and Form changes 6,464. `check:fast` passes in
  62.3s and full `check` in 121.5s before approval, then in 61.5s and 107.7s
  against approved-local metadata, with public 80/259 and all 232 fixtures
  exact.
- Visual approval: the exact three frozen PNGs are open together in responsive
  Aseprite 1.3.17.2 process 6832. The designer replied `apprvoed` on
  2026-08-11; in context approval applies only to the frozen digest above.
  Implementation `914aa700b82469dbb22ca1600f1bc7ad6dbecff7` and approval
  record `6a577566766afc66aa01cdf1c7ebd1430aad425d` plus initial handoff
  `e12ff211dda002ac1c089eaedc0ff369d1e432e0` are remote verified. This
  reconciliation completes the bounded tuple. The candidate remains
  unregistered, fixture-free, and non-public.
- Required next action: preserve this tuple byte-for-byte.
  Child/state assets, effects, later roles/families, release, accepted drift,
  and a PR remain closed. A separate `lets do next` is required from this clean
  published reconciliation before another art candidate begins.

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

## Current Authorization Boundary

The designer authorized the completed-sprite assembler integration on
2026-08-09. Branch `codex/approved-enemy-assembler-integration` now composes
23 expansion families / 57 variants and `PUBLIC_ENEMIES` 80/259, including the
six completed EN-E03 suites, all eight completed EN-E06 suites, and the public
Ghoul Upgrade route. Complete Kit is 2,196 PNGs; all 232 committed fixtures
remain unchanged. Focused, fast, and full validation pass. The implementation
and reconciled documentation are committed and pushed at
`90ac018923fbaa9906cd47cdc9ef22f0db77336a`.

The isolated private Heartwood Warden complete suite on
`codex/en-e06-dryad-heartwood-warden` is visually approved and published. Its
exact 80-frame evidence is hash-frozen and technically validated at digest
`fb7b50a0fefda66995c5e81f3e07c0c080893902a33d304066e79fb8181cd97c`,
with implementation `8a790e3f0d02cf64763733f83d17890c79ce83fc` and approval
record `d8c13bb008e3a186daa73a37eec87c707f30365f` committed and pushed.
The later isolated Barrow Stalker suite on
`codex/en-e06-redcap-barrow-stalker` is visually approved and technically
frozen at digest
`1719f8611f212cfbacf041fc8459d3f52390b05aa73e0a1d50203554845051f1`.
Its implementation `c3544dc4ec06e06afb15ea699333119342a8946f` and approval
record `8e2054236a49ab06b7cac404cda8b12bb440085c` are committed and pushed on the
tracked branch. The later isolated Ironboot Trapper suite on
`codex/en-e06-redcap-ironboot-trapper` is technically complete and hash-frozen
at digest `31c37fd25d688bd295c2fb84bdb437141149cf43986b6edcc4141467bc32bdf1`;
its implementation `98865936244b94860985210fcaf9a044b0ca228a` and approval
record `00a9876f963522c88b9cd77f809bec3674d72b19` are committed and pushed on the
tracked branch. The later isolated Bloodcap Reaver suite on
`codex/en-e06-redcap-bloodcap-reaver` is visually approved and technically
frozen at digest `e9a41fd37e19d96911cfffee3bd89e3859f9cbb95099996632f877da2dbdabff`;
its implementation `1a1ba00ea1edfa6e8bd946e95f5e35c6080ce73a` and approval
record `5c55af26481f9a79988382df3d67b8ff33b765a4` are committed and pushed on the
tracked branch. No subsequent art gate is active.
Nymph, EN-E07, the three EN-E03 Idle-only variants, public-registration changes,
fixtures, effects, and release remain separate closed gates.

### Historical Authorization Chronology

Everything below this subheading records point-in-time authorization and is
not a current instruction.

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
The exact rebuilt EN-E03 v2 raw and Complete B + Form common-only Idle artifacts for
  Giant, Centaur, and Satyr are rejected. The separate Hill Breaker F1
  reference-calibration study and its F2-only continuation are now visually
  approved as an exact internal two-frame Idle baseline. The later Steppe Hunter
  F1 calibration and bounded F2-only continuation are also visually approved as
  an exact internal two-frame Idle baseline. The separately authorized Briar
  Reveler F1 calibration and bounded F2-only continuation are also visually
  approved as an exact internal two-frame Idle baseline. Hill Breaker common
  Walk W1-W4 and Steppe Hunter common Walk W1-W4 are also visually approved and
  hash-frozen. Briar Reveler common Walk W1-W4 is also visually approved and
  hash-frozen. Hill Breaker common Attack A1-A4 is also visually approved and
  hash-frozen. Steppe Hunter common Attack A1-A4 is also visually approved and
  hash-frozen. Briar Reveler common Attack A1-A4 is also visually approved and
  hash-frozen. Hill Breaker Hurt H1-H2 is also visually approved and
  hash-frozen. Steppe Hunter Hurt H1-H2 is also visually approved and
  hash-frozen. Briar Reveler Hurt H1-H2 and the common Cast/Death aliases are
  also visually approved, hash-frozen, internal, non-public, and published.
  The designer then said `good lets do next`; Boulder Hurler specialist Idle
  F1-F2 was bounded, approved, and published with its projectile external. The
  later approved public-roster three-treatment export does not alter EN-E03 art
  scope. The designer's `awesome lets do next in plan` authorized only
  Storm-Clan Jarl elite Idle F1-F2 across Down, Left, Right, and Up, which is now
  approved and published after its side-pauldron repair. The designer then said
  `lets do next`; following EN-E03 family order, that authorizes only Sun Lancer
  specialist Idle F1-F2 with charge dust, spear trails, and hoof shock rings
  external. All other variants, animations, registration, consumer routing,
  effects, release, and later work remain gated.

EN-E01 is the strongest first art slice because it yields five recognizable
families while stress-testing reusable humanoid equipment, held-item layering,
and non-baked attack tells. The largest unresolved risks are multi-form assets,
stateful attachments, and Boss-scale direction/animation work; those stay later
and separately gated.

Visual approval is complete through all three common Idle, Walk, Attack, Hurt,
Cast, and Death baselines, Boulder Hurler specialist Idle F1-F2, corrected
Storm-Clan Jarl elite Idle F1-F2, Sun Lancer specialist Idle F1-F2, Banner Khan
elite Idle F1-F2, and Banner Khan grouped Walk/Attack/Hurt/Cast/Death. Banner
Khan Idle publication is complete at
`55143049b4153e34fcdaad0ea434932ba0f2d0fd`; grouped motion publication is
complete at `8e73cd038d50037a40cad27ee9f2e37b6e363b69`. Reed Charmer specialist Idle
F1-F2 is visually approved and published at
`070f85b20c4ea77a75e35eb6d9eefd697f4b0b47`. Reed Charmer complete motion is
visually approved and published at `f77c8a88b25cb59f5bdbe82708a620e5cae3fe9d`.
Wildwood Hornlord elite Idle F1-F2 is visually approved and published at
`aa96e170c41cbcb49c7ac1bd979114b3b5bfa7e4`. The same `Approved lets do next`
message activates only the isolated Wildwood complete-motion art gate. Its
80-frame paired candidate is visually approved and published at
`d9cb0faa3dff204106598876fe38db5f4ee3237a`. The later `Let's do next` message
activates only EN-E04 Naga Coilguard common Idle F1-F2. Its eight-frame paired
candidate passes focused and full validation, and the designer approved both
exact GIFs with `Approved` on 2026-08-08. Bounded publication is complete at
`bd920c206d692bcc5e7b043614dcf6a03db2174c`. The later explicit checkout-and-
continue request activates only the isolated Coilguard complete-motion gate.
Its hash-frozen 80-frame paired suite passes focused, fast, and full validation;
the designer approved both exact presentations on 2026-08-08, authorizing only
bounded publication. Publication is complete at
`f47e1691208236f5d245a1f3b9b15355ad479790`. The designer's later `lets do next`
activates only Venom Oracle specialist Idle F1-F2. Its exact paired candidate is
hash-frozen, technically validated, visually approved, internal, and published
at `3365d9915ed0ac1e506470604ed1e83c84606181` on
`codex/en-e04-venom-oracle-idle`. The later bigger-slice discussion and the
designer's `sure lets do that` activate exactly one combined 88-frame gate:
Venom Oracle complete motion plus Temple Rajah Idle F1-F2. Its hash-frozen
paired candidate is technically validated, visually approved, internal,
non-public, committed, and pushed at
`4fd887f0a174169d47f9f3bee3f98d92c2ffaf30` on
`codex/en-e04-venom-motion-rajah-idle`. Temple Rajah motion, Merfolk, Birdfolk,
registration, integration, effects, release, and broader work remain
unauthorized at that checkpoint. The designer's later `very good lets do
another similar sized slice` activates only the 80-frame Temple Rajah
complete-motion candidate on `codex/en-e04-rajah-motion`. It is hash-frozen,
technically focused/protected/fast/full validated, visually approved, internal,
non-public, committed, and pushed at
`38b56f316a3fa12443b5b9fb003e74dc7e8059aa`. That approval activates only one
80-frame Merfolk Tideguard full-enemy candidate on
`codex/en-e04-merfolk-tideguard`. Its evidence is hash-frozen and all focused,
protected, fast, and full gates pass. The designer reviewed the exact paired
GIFs and said `approved` on 2026-08-09. The internal, non-public lane is
committed and pushed at `622b00f0c40eed552f61b30bd207b5ad8478836e`.
Later Merfolk roles, Birdfolk, registration, integration, effects, release,
and broader multi-enemy work remain unauthorized.
The designer's later `lets do next` activates only one full 80-frame Merfolk
Reefcaller specialist on `codex/en-e04-merfolk-reefcaller`. Its paired evidence
is hash-frozen and focused/protected/fast/full validated. After both visible
side-eye pixels were repaired to coral red, the designer reviewed the final
exact pair and said `approved` on 2026-08-09. The lane remains internal and
non-public, committed, and pushed at
`b315a32aa48d8881efe23e9d5b8553e6c0fb6b79`. Merfolk elite, Birdfolk,
registration, integration, effects, release, and broader work remain
unauthorized.
The designer's next `lets do next` activates only one full 80-frame Merfolk
Pearl Regent elite on `codex/en-e04-merfolk-pearl-regent`. Its paired evidence
is hash-frozen and focused/protected/fast/full validated. The designer reviewed
the exact pair and said `approved` on 2026-08-09. The lane remains internal and
non-public, committed, and pushed at
`ef0ab54b73718b62f8db99f601020f7ef14090f8`. Birdfolk, additional Merfolk
variants, registration, integration, effects, release, and broader work remain
unauthorized.
The designer's next `next` activates only one full 80-frame Birdfolk Aerie
Scout common on `codex/en-e04-birdfolk-aerie-scout`. Because Birdfolk roles were
not pre-named, this lane names only the common and leaves later roles open. Its
paired evidence is hash-frozen and focused/protected/fast/full validated. The
designer reviewed the exact pair and said `very good approved` on 2026-08-09;
after the requested Codex/MCP restart, both exact boards opened successfully in
Aseprite and the designer said `ok lets keep going`. The lane remains internal,
non-public, committed, and pushed at
`a0910312e510ee57b603ee981a279c1f372d6fad`. Later Birdfolk roles,
registration, integration, effects, release, and broader work remain
unauthorized.
The designer's later `awesome lets keep going` activates only one full 80-frame
Birdfolk Gale Augur specialist on `codex/en-e04-birdfolk-gale-augur`. Because
the specialist was not pre-named, this lane names only Gale Augur and leaves the
elite open. Its exact paired evidence is hash-frozen and
focused/protected/fast/full validated. The designer reviewed the exact pair and
said `awesome looks good approved` on 2026-08-09. The lane remains internal,
non-public, committed, and pushed at
`ad57f25d47415625540ea36ff16d2a884a421576`. Birdfolk elite, registration,
integration, effects, release, and broader work remain unauthorized.
The designer's later `lets do next` activates only one full 80-frame Birdfolk
Stormcrown Exarch elite on `codex/en-e04-birdfolk-stormcrown-exarch`. Because
the elite was not pre-named, this lane names only Stormcrown Exarch and does not
open additional Birdfolk variants. Its exact paired evidence is hash-frozen and
focused/protected/fast/full validated. The designer reviewed the exact pair and
said `sure lets do 123` on 2026-08-09, approving the lane and authorizing the
three-gate sequence. The lane remains internal and non-public, but bounded
publication is complete at `da8c089`; complete EN-E04 registration and
assembler consumer integration follow as separate checkpoints. Effects,
release, and broader work remain unauthorized.
