# Project Handoff

Date: 2026-08-07

## Immediate Continuation Checkpoint - Banner Khan Idle Approved, Publication Pending

Start here in a new task. Banner Khan elite Idle F1-F2 is visually approved
against the exact r3 paired GIFs below. The only remaining action in this gate
is bounded publication and handoff reconciliation; no later art or integration
gate is authorized.

- Live checkout: `C:\tmp\8-bit-sprite-assembler-en-e03-banner-khan-idle` on
  branch `codex/en-e03-banner-khan-idle` at
  `97787113ba3883e8cec41051fc9bdefe00684e95`. Until bounded publication, the
  branch has no upstream and remains based on the published Sun Lancer handoff
  checkpoint.
- Git state contains the approved bounded lane and remains uncommitted and
  unpushed pending publication. Modified files:
  `ARCHITECTURE.md`, `ENEMY_EXPANSION_PLAN.md`, `HANDOFF.md`, `README.md`,
  `ROADMAP.md`, and `package.json`. New candidate files:
  `engine/enemy-expansion-en-e03-centaur-elite-idle.js`,
  `tools/enemy-expansion-en-e03-banner-khan-idle-review.mjs`,
  `tools/build-enemy-expansion-en-e03-banner-khan-idle-gifs.py`, and
  `tools/check-enemy-expansion-en-e03-banner-khan-idle.mjs`. Do not reset,
  clean, stash, or switch this lane. Stage and publish only these bounded files
  under the approval-publication contract.
- Gate: `en-e03-banner-khan-idle-v1`, status `approved`. Scope is only Banner
  Khan Idle F1-F2 in Down,
  Left, Right, and Up. It is internal and non-public. Walk, Attack, Hurt,
  Cast/Death, other variants, registration, consumers, effects, release, and
  later EN-E03 work remain unauthorized.
- Candidate history: the first blocky overlay was called weird; its targeted
  repair was still judged to have too much wrong, so both were discarded. The
  active candidate was rebuilt from the approved Steppe Hunter chassis. The
  designer then rejected the straight-line side face, so only the mirrored
  Left/Right profiles gained a stepped forehead, nose, eye, cheek, and tapered
  jaw. The follow-up mouth feedback reduced it to exactly one front pixel,
  separated from the shaded cheek by a skin-tone jaw pixel. The latest feedback
  identified the pale horizontal side-profile streak: it was the six-pixel
  light fur collar, not the mouth. Only the mirrored side collars now use a
  compact stepped two-tone shape with a two-pixel pale highlight; the mouth
  remains unchanged. The latest feedback requested horse-body motion. Banner
  Khan F2 now lifts the side rump and settles the chest while Down/Up lift both
  outer flanks; every leg and hoof pixel and both approved reference registries
  remain byte-exact.
- Approval evidence: the designer reviewed both exact labeled all-four-
  direction r3 GIFs together and said `approved` on 2026-08-07. This approval
  applies to the hashes below and authorizes only bounded publication of this
  internal, non-public Idle baseline.
- Required review presentation: always show both exact labeled all-four-
  direction GIFs together unless the designer explicitly requests a narrow
  inspection:
  - raw/no outline:
    `enemy-expansion-review/en-e03-banner-khan-idle/en-e03-banner-khan-idle-r3-four-directions-labeled.gif`
  - Complete B + Form:
    `enemy-expansion-review/en-e03-banner-khan-idle/en-e03-banner-khan-idle-r3-four-directions-labeled-complete-b-form.gif`
  Both are `192x224`, contain two `240ms` frames, and loop continuously.
- Frozen latest evidence: raw board SHA-256
  `6221555094b9876ff1aad5f04b7a20327ea4f79bde7d06116f2f95f07a2836e1`;
  Complete B + Form board SHA-256
  `f4420a5c827762b699fa0007e168a484247fc0cb1a82623ec18c5cf510cc9b92`;
  raw GIF SHA-256
  `1b93946a596213cb02460624fd3c4e5c0640f5202e86783fbdbbe34e73d15a10`;
  Complete B + Form GIF SHA-256
  `298ad981961f9025c46fbcc3a255345ac8127fc2ce052303106b3606610e9e97`;
  eight-frame candidate digest
  `61c80740b96c2a35ccd8382335299c6521049f139c1c4df57e4852480663b3d6`.
- Validation is current. Run
  `npm.cmd run check:enemy-expansion-en-e03-banner-khan-idle` for the focused
  gate and `npm.cmd run check` for the repository gate. Both passed after the
  planted horse-torso motion repair; the full gate completed in `186.8` seconds and kept
  all 232 public fixture sheets unchanged. `git diff --check` also passed.
- Review output and the copied local Boss checkpoint corpus under
  `death-review/boss-48-drafts` are ignored support artifacts. They are needed
  to reproduce the full local gate but are not candidate source changes.
- Next action: rerun focused and full validation, stage only the bounded files
  listed above, commit and push the branch under the standing
  approval-publication rule, verify the upstream, and reconcile this handoff
  with the published commit. Stop there. Only a separate explicit continuation
  may authorize another Banner Khan animation or any later gate.

The detailed historical and technical evidence remains in
[Banner Khan Elite Idle Approved](#banner-khan-elite-idle-approved).

## Purpose

This is the canonical new-chat continuation for the 8-bit Sprite Assembler.
EN-E01's completed-slice review and bounded public registration are complete;
its explicitly authorized consumer integration and outline/Form presentation
are also complete. EN-E02's common Idle, completed slice, registration at
`7b6e448`, and consumer integration at `8ab1837` are complete. On 2026-08-03 the
designer reopened seven family presentations for narrow walk/seam corrections:
Catfolk, Desert Raider, Fallen Knight, Fanatic Monk, Goatfolk, Necromancer, and
Witch. The designer accepted that exact candidate on 2026-08-03 and authorized
continuation. The repaired registry is now the stable/public result, while the
pre-repair registry remains immutable internal comparison evidence. The
designer rejected EN-E03 v1 because its boxed, pre-inked construction did not
match the approved Enemy roster. EN-E03 v2 rebuilt the same contract cards and
common-only Idle scope for Giant, Centaur, and Satyr, but on 2026-08-03 the
designer also rejected those exact raw and Complete B + Form boards as still
far from the established roster style. Both implementations remain reproducible
  technical evidence only; neither is an approved visual baseline. The designer
  then explicitly authorized a reference-first Hill Breaker first-pose study,
  approved its exact raw and Complete B + Form boards on 2026-08-03 with
  `much better lets move onm`, and authorized the bounded second Idle pose. That
  F2-only continuation was approved on the exact raw and Complete B + Form
  boards with `approved`. The eight-frame Hill Breaker Idle baseline became the
  first accepted EN-E03 art seed. The designer then said `lets do next`,
  authorizing only a reference-first Steppe Hunter F1 calibration across four
  directions, then approved its exact raw plus Complete B + Form boards with
  `Approved`. Steppe Hunter F1 is the second accepted internal EN-E03 seed. The
  designer next authorized only the recommended Steppe Hunter F2 continuation
  with `Let's do that`, then approved its exact F1/F2 raw and Complete B + Form
  boards with `Approved lets keep going.` The eight frames now form the accepted
  internal Steppe Hunter Idle baseline, and the approval authorized only a
  reference-first Briar Reveler F1 study across four directions. Its exact raw
  and Complete B + Form boards were visually approved on 2026-08-03 with
  `looks good.` Those four frames are now the accepted internal Briar Reveler F1
  seed. The designer then said `lets go next`, authorizing only Briar Reveler F2
  across the same directions. The designer approved its exact F1/F2 raw and
  Complete B + Form boards on 2026-08-04 with `approved`. Those eight frames
  are now the third accepted internal EN-E03 two-frame Idle baseline. The
  designer then again said `lets do next`, explicitly authorizing only a bounded
  Hill Breaker common Walk candidate: four Walk frames in Down, Left, Right,
  and Up while preserving the approved Idle frames exactly. That implementation
  candidate passed its focused gate and the designer approved the exact raw and
  Complete B + Form boards on 2026-08-06 with
  `yes sir seems fine to me approved`. That approval authorized only Steppe
  Hunter common Walk W1-W4 across the same four directions. The isolated
  Steppe implementation, focused checker, deterministic review generator, and
  exact boards now exist and pass. The designer reviewed the exact raw and
  Complete B + Form animations and approved them on 2026-08-06 with `approved`.
  The designer then said `awesome lets do next`, authorizing only Briar Reveler
  common Walk W1-W4 across the same directions while preserving its approved
  F1/F2 Idle baseline byte-for-byte. That isolated implementation candidate,
  focused checker, and deterministic raw/Complete B + Form boards now exist and
  pass. After identifying and correcting the inherited side-eye pixel in every
  rear Walk frame, the designer reviewed the corrected raw and Complete B +
  Form animations and approved them on 2026-08-06 with `greeat lets move on`.
  That approval authorizes only Hill Breaker common Attack A1-A4 across Down,
  Left, Right, and Up while preserving approved Hill Breaker Idle and Walk
  byte-for-byte. That isolated implementation candidate, focused checker,
  deterministic raw/Complete B + Form boards, and review GIFs now exist and
  pass their focused gate. The designer reviewed the exact labeled
  four-direction raw and Complete B + Form animations and said `Very good
  approved` on 2026-08-07. Hill Breaker Attack is now an approved internal
  baseline. The designer then said `Cool let's keep going`, authorizing only
  Steppe Hunter common Attack A1-A4 across Down, Left, Right, and Up while
  preserving its approved Idle and Walk byte-for-byte. That isolated
  implementation candidate, checker, deterministic boards, and required dual
  labeled review GIFs now exist and pass the focused gate. The designer reviewed
  both exact labeled all-four-direction GIFs together and said `Approved` on
  2026-08-07. Steppe Hunter Attack is now an approved internal baseline. After
  that exact lane was committed and pushed, the designer said `lets keep going`,
  authorizing only Briar Reveler common Attack A1-A4 across Down, Left, Right,
  and Up while preserving its approved Idle and Walk byte-for-byte. That
  isolated candidate, focused checker, deterministic boards, and required dual
  labeled GIFs now exist and pass. The designer reviewed both exact labeled
  all-four-direction raw and Complete B + Form animations and said `very good!
  approved` on 2026-08-07. Briar Reveler Attack is now an approved internal
  baseline; this bounded lane is committed and pushed under the standing
  approval-publication contract. The designer then agreed to continue the 80
  plan and accepted the explicitly proposed Hill Breaker Hurt H1-H2 gate with
  `lets go for it`. Its isolated eight-frame implementation, focused checker,
  deterministic boards, and required labeled all-four-direction raw and
  Complete B + Form GIFs now exist and pass technically. The Hurt lane remains
  internal and non-public. The designer reviewed both exact GIFs together and
  said `approved` on 2026-08-07; the bounded lane is committed and pushed under
  the approval-publication contract.
  The designer then said `nice lets do nexrt`. Codex explicitly bounded that
  continuation as Steppe Hunter Hurt H1-H2 across Down, Left, Right, and Up,
  preserving its approved Idle, Walk, and Attack frames byte-for-byte and
  excluding Cast/Death aliases, variants, registration, consumers, effects,
  and release. The isolated renderer, focused checker, deterministic raw and
  Complete B + Form boards, and both required labeled all-four-direction GIFs
  now exist and pass technically. The designer reviewed both exact GIFs
  together and said `approved` on 2026-08-07. Steppe Hunter Hurt is now an
  approved internal/non-public baseline, and its bounded lane is committed and
  pushed under the approval-publication contract.
  The designer then said `awesome lets do next`. Codex explicitly bounded that
  continuation as Briar Reveler Hurt H1-H2 across all four directions while
  preserving its 40 approved Idle/Walk/Attack frames. The focused gate, exact
  raw and Complete B + Form boards, and both labeled four-direction GIFs pass.
  The designer reviewed both exact GIFs together and said `approved lets do
  next` on 2026-08-07. Briar Reveler Hurt is now an approved internal baseline;
  its bounded lane is committed and pushed. The separate common Cast/Death
  aliases across the three approved EN-E03 common variants also pass their
  focused/full gates and preserve zero-new-pixel routing. The designer reviewed
  all four exact labeled three-family/all-direction GIFs together and said
  `approved` on 2026-08-07; checkpoint
  `d3f78f7fc924123a95c6dc140e5288525bf3f322` is pushed. The designer then said
  `good lets do next`. Codex bounds that continuation only to a Boulder Hurler
  two-frame Idle baseline across Down, Left, Right, and Up, with no baked
  boulder/projectile and no other variant, animation, integration, effect, or
  release work. That isolated candidate, focused checker, deterministic raw and
  Complete B + Form boards, and both required labeled all-four-direction GIFs
  now exist and pass technically. The designer reviewed both exact improved
  GIFs together and said `approved` on 2026-08-07; the bounded branch is
  committed and pushed under the publication contract.
  Before starting another EN-E03 art gate, the designer requested one full
  export of every complete public Enemy in three treatment folders. The
  isolated `codex/all-enemy-outline-export` lane generated 67 families / 232
  variants in `outlined`, `semi-outlined`, and `without-outlines`, for 696
  native `480x96` PNGs plus a manifest, README, deterministic stored ZIP, and
  SHA-256 sidecar. The exact ZIP is 2,440,823 bytes with SHA-256
  `fd03895d8657b96293be14fbddbdb193ce62678c068023b58015410fc7f92b9c`.
  Its focused package validator and the full project gate pass. The designer
  reviewed that delivered package and said `awesome lets do next in plan`,
  approving the bounded export checkpoint. That same statement authorizes only
  Storm-Clan Jarl elite Idle F1-F2 across Down, Left, Right, and Up next, with
  storm arcs/lightning and impact cracks remaining external. The isolated
  `codex/en-e03-storm-clan-jarl-idle` lane now contains that exact acceptance
  candidate, its deterministic raw and Complete B + Form evidence, and both
  required labeled all-four-direction GIFs. After identifying and receiving a
  repaired side-pauldron placement, the designer reviewed both corrected GIFs
  together and said `approved` on 2026-08-07. Its focused gate and the full
  project gate pass. The bounded approval implementation is committed and
  pushed at `d9c3dedf521a1a1a6ad0b82f458bf38cf8fa9533`; it does not
  authorize later EN-E03 work. The designer then said `lets do next`; following
  the documented EN-E03 family order, Codex bounded that continuation only to
  Sun Lancer specialist Idle F1-F2 across Down, Left, Right, and Up. The
  isolated `codex/en-e03-sun-lancer-idle` lane now contains that exact
  acceptance candidate, its deterministic raw and Complete B + Form evidence,
  and both required labeled all-four-direction GIFs. Its focused gate and full
  project gate pass. The designer reviewed both exact GIFs together and said
  `approved` on 2026-08-07. The bounded approval implementation is committed
  and pushed at `f5057497bc0b9ee62b79c5d8a94efecfd49c0ec9`; it does not
  authorize later EN-E03 work. The designer then said `lets do next`; following
  the documented Centaur role order, Codex bounded that continuation only to
  Banner Khan elite Idle F1-F2 across Down, Left, Right, and Up. The isolated
  `codex/en-e03-banner-khan-idle` lane contains that exact acceptance candidate,
  both required labeled raw and Complete B + Form GIFs, and passing focused and
  full gates. The designer found the first version weird, then found the targeted
  repair still had too much wrong and requested a from-scratch rebuild. Both
  earlier identities are discarded. The active candidate delegates only the
  approved Steppe Hunter chassis and redraws the entire elite identity with a
  visible face, compact conical helm, segmented lamellar armor, limited crimson
  saddle drape, and separated tapered standard. After the designer identified
  the side face as straight lines, only the mirrored Left/Right profiles were
  rebuilt with a stepped forehead, protruding nose, visible eye, cheek, and
  tapered jaw. The follow-up mouth-length critique reduces the mouth to one
  front pixel and separates it from the shaded cheek with a skin-tone jaw pixel.
  The later pale horizontal streak was the six-pixel fur collar; only the
  mirrored collar now uses a compact stepped two-tone shape. F2 also adds a
  Banner Khan-only planted horse-torso shift while every leg and hoof pixel
  remains byte-exact. The designer reviewed both exact labeled r3 GIFs together
  and said `approved` on 2026-08-07. Bounded publication remains pending.
This handoff records the accepted EN-F00 foundation, ten approved EN-E01/EN-E02
families / 30 variants, the
unchanged 67-family / 232-variant public catalog, unchanged legacy Enemy corpus,
frozen pre-registration evidence, shipped NPC artifact, local Windows proof,
and unresolved Boss and publisher boundaries.

This handoff was last reconciled on 2026-08-07 after the repository cleanup
against the live refs, surviving worktrees, preserved implementation checkpoint,
public/internal expansion boundaries, current validation scripts, exact review
hashes, and the separate clean-clone-check candidate. Historical measurements
remain where explicitly labeled. `README.md`, `ARCHITECTURE.md`, `ROADMAP.md`,
`ENEMY_EXPANSION_PLAN.md`, and this file now agree that all three common Walk
baselines and Hill Breaker common Attack A1-A4 are visually approved, internal,
  and non-public. Steppe Hunter common Attack A1-A4 is also visually approved,
  internal, and non-public. Briar Reveler common Attack A1-A4 is also visually
  approved, internal, non-public, and published on its matching approval branch.
  Hill Breaker Hurt H1-H2 is also visually approved, internal, non-public, and
  published on its matching approval branch. Steppe Hunter Hurt H1-H2 is also
  visually approved, internal, non-public, and published on its matching
  approval branch. Briar Reveler Hurt H1-H2 is likewise visually approved,
  internal, non-public, and published on its matching branch. The separate
  common Cast/Death aliases are visually approved, internal, non-public, and
  published on their matching branch. Boulder Hurler Idle F1-F2 is visually
  approved, internal, non-public, and published. The separate full public-Enemy
  three-treatment export is also approved and publication-bounded. Storm-Clan
  Jarl elite Idle F1-F2 is now visually approved, internal, non-public, and
  publication-bounded after the side-pauldron repair. Sun Lancer specialist
  Idle F1-F2 is now visually approved, internal, non-public, and published on
  its matching approval branch. Banner Khan elite Idle F1-F2 is visually
  approved against the exact r3 pair, internal, and non-public; only its bounded
  commit, push, and handoff reconciliation remain. Every other variant,
  animation, registration, consumer, effect, release, and later EN-E03 step
  remains unauthorized.

## Visual Review Presentation Contract

Unless the designer explicitly asks for a narrow review, every actor or sprite
review shown to the designer must include all four labeled directionsâ€”Down,
Left, Right, and Upâ€”and must present both versions together:

- raw source pixels with outlines disabled; and
- the outlined project presentation, currently Complete B + Form for this lane.

Do not substitute a side-only loop, an ambiguous unlabeled montage, or only one
of the two presentation modes. A narrow exception is allowed only when the
designer is reviewing a specific direction, frame, layer, outline mode, or
isolated defect; state that narrow scope explicitly instead of silently omitting
the other directions or presentation mode.

## Approval Publication Contract

After the designer explicitly approves the exact review surface, stage only
that bounded approval lane, commit it, and push its branch before beginning
another gate. Do not commit or push an unapproved lane. If the designer
explicitly says to hold publication, that narrower instruction wins.

## Canonical Workspace And Git State

- Approved all-enemy export worktree:
  `C:\tmp\8-bit-sprite-assembler-all-enemy-outline-export`
- Approval branch: `codex/all-enemy-outline-export`, created exactly from
  approved and pushed Boulder Hurler Idle checkpoint
  `9c89077f79ef8eab06dc4e7a725edefe5b9bbb97`. It contains only the reusable
  local exporter/checker, two package commands, approval documentation, and
  generated ignored delivery artifacts. No sprite source, registry, selector,
  fixture, release, or public catalog entry changed.
- Approved Steppe Hunter Hurt worktree:
  `C:\tmp\8-bit-sprite-assembler-en-e03-steppe-hunter-hurt`
- Approval branch: `codex/en-e03-steppe-hunter-hurt`, created exactly from
  approved and pushed Hill Breaker Hurt checkpoint
  `3e0d98bd48b30cd6ddf35cbd87b424c3c3fd3b5c`. It contains only the bounded
  Steppe Hunter H1-H2 renderer, checker, deterministic dual-presentation
  evidence, package commands, and approval documentation. It tracks the
  matching origin branch under the approval-publication contract.
- Approved Hill Breaker Hurt worktree:
  `C:\tmp\8-bit-sprite-assembler-en-e03-hill-breaker-hurt`
- Approval branch: `codex/en-e03-hill-breaker-hurt`, created exactly from the
  synchronized approved Briar/docs checkpoint
  `68d913ccfd00f76f15dcac308338c9e686a4f171`. It contains only Hill Breaker
  H1-H2 plus its checker, deterministic dual-presentation review generator,
  package commands, and approval documentation. It tracks the matching origin
  branch under the approval-publication contract.
- Approved Briar Reveler Attack worktree:
  `C:\tmp\8-bit-sprite-assembler-en-e03-briar-reveler-attack`
- Approval branch: `codex/en-e03-briar-reveler-attack`, created exactly from
  pushed approved Steppe Hunter checkpoint
  `c567a426fa6d5175395c2b035f65b12b5a5dd1cb`. It contains only the bounded
  Briar Reveler Attack continuation, records its exact direct visual approval,
  and is committed and pushed to the matching origin branch under the standing
  approval-publication contract.
- Approved Steppe Hunter Attack worktree:
  `C:\tmp\8-bit-sprite-assembler-en-e03-steppe-hunter-attack`
- Approval branch: `codex/en-e03-steppe-hunter-attack`, created exactly from
  clean reconciled checkpoint
  `ec525b658c2e7d061bc511858b9102cd026c6be0`, then populated with the exact
  approved Hill Breaker/Satyr/Steppe continuation state before adding only
  Steppe Hunter Attack A1-A4. It tracks
  `origin/codex/en-e03-steppe-hunter-attack`; the bounded approved state is
  committed and pushed under the approval-publication contract. Registration
  and later EN-E03 work remain separately gated.
- Approved Hill Breaker Attack worktree:
  `C:\tmp\8-bit-sprite-assembler-en-e03-hill-breaker-attack`
- Candidate branch: `codex/en-e03-hill-breaker-attack`, created exactly from
  clean reconciled checkpoint
  `ec525b658c2e7d061bc511858b9102cd026c6be0`, then populated with the exact
  approved Walk lane before adding only Hill Breaker Attack A1-A4. This source
  worktree remains preserved without an upstream; its exact approved content is
  included in and published through the consolidated Steppe Hunter Attack
  branch above.
- Preserved Briar Reveler Walk approval worktree:
  `C:\tmp\8-bit-sprite-assembler-en-e03-satyr-walk`
- Approval branch: `codex/en-e03-satyr-walk`, created exactly from the
  clean reconciled checkpoint
  `ec525b658c2e7d061bc511858b9102cd026c6be0`, then populated with the exact
  approved Steppe continuation before adding only the Satyr Walk baseline. This
  source worktree remains preserved without an upstream; its exact approved
  content is included in and published through the consolidated Steppe Hunter
  Attack branch above.
- Preserved Steppe Hunter Walk approval worktree:
  `C:\tmp\8-bit-sprite-assembler-en-e03-steppe-hunter-walk` on
  `codex/en-e03-steppe-hunter-walk`; it remains untouched after approval.
- Documentation-reconciliation branch and upstream:
  `codex/en-e03-handoff-reconcile` at
  `ec525b658c2e7d061bc511858b9102cd026c6be0`.
- Preserved implementation branch and upstream: local `codex/en-e03` and
  `origin/codex/en-e03` both resolve to
  `8ea019b10befb083b793e35d58ca5763c8cfd67e`
  (`Preserve EN-E03 approval-lane dirty state (designer-authorized checkpoint)`).
  That cleanup checkpoint committed and pushed the previously deliberate dirty
  lane without changing pixels, approving the Walk candidate, or advancing a
  gate. It supersedes every older instruction to preserve that lane uncommitted.
- Normal baseline worktree:
  `C:\Users\headc\Documents\8-bit-sprite-assembler-main`, clean `main` at
  `f5476a2c962fde1fa9e736aafce4ad01fae0ef99`, equal to `origin/main`.
- The former EN-F00, EN-E01, EN-E02, and EN-E03 temporary implementation
  worktrees were removed during cleanup. Their branch/checkpoint history was
  preserved; do not recreate an old worktree path and assume it is current.
- Accepted EN-F00 branch: `codex/en-f00` at
  `73ad73a354738d21e8d3f33f2cbbc50315f64050`.
- EN-E01 review/registration branch: `codex/en-e01`, based exactly on accepted
  EN-F00 `73ad73a`.
- EN-E01 consumer-integration branch: `codex/en-e01-consumers`, based exactly
  on synchronized public-registration/docs checkpoint `b368f80`.
- Approved EN-E01 Idle checkpoint: `73dbec9`.
- Complete private EN-E01 implementation checkpoint: `230a9a3`.
- Approved EN-E01 public-registration checkpoint: `b43ed6a`.
- Approved EN-E01 consumer implementation checkpoint: `e0be273`.
- Approved EN-E01 presentation checkpoint: `5196c0a`.
- EN-E02 approval/registration branch: `codex/en-e02`, based exactly on
  approved EN-E01 presentation checkpoint `5196c0a`.
- Reviewed EN-E02 full-candidate implementation checkpoint:
  `b2c1283c33dbfd6b2c307fc4d2288877a149c9df`.
- Approved EN-E02 registration code checkpoint:
  `7b6e448fb1d44176bbf9ecee6798c52abb6e914e`.
- Clean-clone-safe registration artifact-gate checkpoint:
  `be44af7b52d199befab3689450c44bc34665dd67`.
- EN-E02 consumer implementation checkpoint:
  `8ab1837` (`Integrate approved EN-E02 consumers`).
- Seven-family repair-candidate implementation checkpoint:
  `6400dd5` (`Create enemy walk and seam repair candidate`).
- Approved seven-family repair promotion checkpoint:
  `8eb0f99` (`Promote approved enemy repairs`).
- EN-E03 review branch lineage: `codex/en-e03`, based exactly on approved
  repair documentation checkpoint `2a8a7a2`.
- Rejected EN-E03 v1 common-only Idle checkpoint:
  `50ad516bdf338842e47ae9c22cd7cd293adef498`
  (`Create EN-E03 common Idle candidate`).
- Rejected EN-E03 v2 roster-style replacement checkpoint:
  `6104eaedce62c4514cdd5061bd58c8c79eeb0341`
  (`Rebuild EN-E03 Idle candidate in roster style`).
- Preserved EN-E03 approval lane: approved Hill Breaker, Steppe Hunter, and
  Briar Reveler two-frame Idle and four-frame Walk baselines plus the visually
  approved Hill Breaker, Steppe Hunter, and Briar Reveler common Attack A1-A4
  baselines. Hill Breaker and Steppe Hunter Hurt H1-H2 are also visually
  approved. All remain internal and non-public; other Hurt/family motion,
  variants,
  registration, consumers, effects, release, and public promotion remain
  unauthorized.
- Verified synchronized base before EN-F00:
  `f5476a2c962fde1fa9e736aafce4ad01fae0ef99`
  (`Document enemy expansion and refresh handoff`).
- EN-F00 follows synchronized main `f5476a2`; EN-E01 follows EN-F00. Always
  verify the live HEAD, branch, and upstream rather than copying a
  self-referential hash from this file.
- The planning repository's `tools/ecosystem.lock.json` rules the assembler
  mainline as `main`.
- `codex/form-shading` is fully merged and archive-tagged as
  `archive/codex/form-shading`; its deleted remote branch is not a continuation
  target.
- The archived checkout at
  `C:\Users\headc\Documents\8-bit sprite assembler` remains review-only on
  `wip/19-boss-review` at `fb4b664`, equal to
  `origin/wip/19-boss-review`. Its review payload is parked safely and the
  checkout must not be repurposed.
- `codex/clean-clone-check` equals `origin/codex/clean-clone-check` at
  `125b0b3`. It is a separately preserved, explicitly unvalidated candidate for
  optional Boss review-checkpoint handling, not an accepted fix and not part of
  this Steppe Hunter Walk branch.
- `salvage/19-boss-continuation` remains a historical/support branch, not a
  normal implementation target. Its former worktree was removed.
- Cleanup verification found no stash, no local commit unreachable from remote
  refs or tags, no stale worktree-prune entry, and no Git object-integrity error.

Before making a claim or edit in a new chat, run:

```powershell
git status --short --branch
git rev-parse HEAD
git branch -vv
git worktree list --porcelain
git log -5 --oneline --decorate
```

Historical state immediately after recording the Steppe Hunter Walk approval,
before the later consolidated approval publication:
`codex/en-e03-steppe-hunter-walk` has no upstream, remains intentionally dirty
and uncommitted, and is rooted at reconciled checkpoint `ec525b6`; the
reconciliation branch equals its upstream at `ec525b6`; local `codex/en-e03`
equals its upstream at `8ea019b`; `main` equals `origin/main` at `f5476a2`; and
the archived review checkout equals its upstream at `fb4b664`. The ignored
deterministic review boards and copied local Boss checkpoint corpus in the
Steppe worktree are validation evidence, not tracked changes. Do not modify,
clean, reset, rebase, or repurpose the archived review checkout.

## Exact Next Lane

`ENEMY_EXPANSION_PLAN.md` remains the accepted decomposition of the designer's
80 additional proposals. It resolves them into:

- EN-F00, one renderer/registry foundation slice with no new family art;
- EN-E01 through EN-E18, eighteen standard 24x24 Enemy slices;
- EN-B01 through EN-B03, isolated 48x48 Hydra, Chimera, and Roc direction
  pilots; and
- 75 new standard families, one Ghoul upgrade, one two-proposal Armor merge,
  and three Boss candidates.

The seven-family EN-E01/EN-E02 repair is explicitly approved. The accepted
registry changes exactly 18 renderer-data records to add real foot strides,
replace Catfolk's white pseudo-transparent mouth band, and close the reported
Desert Raider, Fallen Knight, and Goatfolk checkerboard seams. The pre-repair
pixels remain exact in an internal comparison registry. EN-E03 v1 and v2 are
both visually rejected. V2 contains the same three contract cards and only the
rebuilt Hill Breaker, Steppe Hunter, and Briar Reveler common Idle baselines;
its passing structural gate did not make it stylistically acceptable. Preserve
both attempts as historical evidence. The later reference-first Hill Breaker F1
study reuses the exact approved humanoid chassis, adds only an asymmetric Giant
identity treatment, and was visually approved on 2026-08-03. Its four source
frames are now an immutable seed. The bounded continuation added Hill Breaker F2
across the same four directions for raw and Complete B + Form review. The
designer approved that exact board on 2026-08-03, closing the candidate gate.
The resulting two-frame Idle baseline is immutable and internal. The next
explicit authorization added only Steppe Hunter F1 across four directions for
raw and Complete B + Form review. The designer approved that exact board on
2026-08-03, making the F1 seed immutable and internal, then authorized only its
F2 continuation with `Let's do that`. The designer approved the exact F1/F2
boards on 2026-08-03 with `Approved lets keep going.`, making that two-frame
Idle baseline immutable and internal. That approval authorized only Briar
Reveler F1 across four directions. The designer approved its exact raw and
Complete B + Form boards on 2026-08-03 with `looks good.`, making the F1 seed
immutable and internal, then authorized only its F2 continuation with
`lets go next`. The designer approved the exact F1/F2 raw and Complete B + Form
boards on 2026-08-04 with `approved`, making that two-frame Idle baseline
immutable and internal. The designer then again said `lets do next`, authorizing
only Hill Breaker common Walk W1-W4 across Down, Left, Right, and Up. The
approved Hill Breaker Idle baseline remained byte-exact, and the designer
approved the exact Walk boards on 2026-08-06. That approval authorized only
Steppe Hunter common Walk W1-W4 across the same directions. Preserve the
approved Steppe Hunter Idle baseline byte-exact. After approving that exact
Walk animation, the designer said `awesome lets do next`, authorizing only
Briar Reveler common Walk W1-W4. Its corrected four-direction raw and Complete
B + Form animations were approved, authorizing only Hill Breaker common Attack
A1-A4. The designer then approved the exact labeled four-direction raw and
Complete B + Form Hill Breaker Attack animations on 2026-08-07 with `Very good
approved`. Preserve all approved Idle, Walk, and Hill Breaker Attack baselines
exactly. The subsequent `Cool let's keep going` authorizes only Steppe Hunter
  common Attack A1-A4, now visually approved as an exact internal baseline. The
  subsequent `lets keep going` authorizes only Briar Reveler common Attack A1-A4
  across the same four directions while preserving approved Idle and Walk
  byte-for-byte. Hurt, other Giant/Centaur/Satyr motion, specialist/elite
  variants, registration, consumers, effects, release, and every later gate
  remain unauthorized.

### Approved Hill Breaker Walk Baseline

- Gate ID: `en-e03-hill-breaker-walk-v1`; status: `approved` on 2026-08-06.
- Approval evidence: the designer reviewed the exact raw and Complete B + Form
  boards and said `yes sir seems fine to me approved`.
- The source, exact `1950x744` boards, and 16-frame digest remain unchanged:
  raw SHA-256
  `bc6302036e4b3c8f45c59195659726408721d3dbdac3b1b670f2543d46213420`,
  assembled SHA-256
  `19ce1476461bf623e5dc909216021e64c61b40f168ec175cb0a60dcf3e338339`,
  frame digest
  `9f41b2b90b245fe7d6302f87ddcd9313cdedc5360ddc245a4d61c8beab958622`.
- This visual approval does not register Giant or expose it through consumers;
  the registry remains internal with zero approved/public families.

### Approved Steppe Hunter Walk Baseline

- Gate ID: `en-e03-steppe-hunter-walk-v1`; current status:
  `approved` on 2026-08-06.
- Approval evidence: the designer reviewed the exact raw and Complete B + Form
  animated Walk previews and said `approved`.
- Approved raw animation:
  `enemy-expansion-review/en-e03-centaur-walk/en-e03-steppe-hunter-walk-all-directions.gif`,
  `384x96`, four frames, `0.67s` loop, SHA-256
  `7e9beaf4d9edae0b2b60cee6c6c828efa3f426e1889e25873787066643a6c94e`.
- Approved Complete B + Form animation:
  `enemy-expansion-review/en-e03-centaur-walk/en-e03-steppe-hunter-walk-complete-b-form-all-directions.gif`,
  `384x96`, four frames, `0.67s` loop, SHA-256
  `94815b06e852ecdb877e29cdf5d3dee2720825a4407c6f38c9cbbb267221e5c9`.
- Those GIFs are ignored review-only derivatives; the frozen deterministic
  source evidence remains the two PNG boards and 16-frame digest below.
- Source:
  `engine/enemy-expansion-en-e03-centaur-walk.js`.
- Focused checker:
  `tools/check-enemy-expansion-en-e03-centaur-walk.mjs` via
  `npm.cmd run check:enemy-expansion-en-e03-centaur-walk`.
- Review generator:
  `tools/enemy-expansion-en-e03-centaur-walk-review.mjs` via
  `npm.cmd run review:enemy-expansion-en-e03-centaur-walk`.
- Raw board:
  `enemy-expansion-review/en-e03-centaur-walk/en-e03-steppe-hunter-walk-raw.png`,
  `1950x870`, SHA-256
  `b64b73f0bc90c35be428dbf49cc948576fc06575c28af36e286bd34079268269`.
- Complete B + Form board:
  `enemy-expansion-review/en-e03-centaur-walk/en-e03-steppe-hunter-walk-complete-b-form.png`,
  `1950x870`, SHA-256
  `76503340798a738086cf8c001529c71aa80a3f8890ad55d6eb40a5e198e20a98`.
- Approved 16-frame digest:
  `8fa70b11dd34ae5643c709ff1082b84f61e36a1f3fa6110689f47fee864c433e`.
- Delegated approved Idle digest remains exact at
  `3c88471b25fc27397a0a11d6495cd27c641a6715ff33429f5d0d2c81f184ae49`.
- The focused gate passes all 16 connected hard-alpha hybrid silhouettes,
  two planted hoof contacts per frame, three distinct hoof-contact silhouettes
  per direction with only W2/W4 shared, exact side mirroring, one-cell margins,
  all eight delegated Idle frames, and zero public exposure. Complete B adds
  1,970 pixels and Form changes 2,084 source pixels.
- The deterministic generator reproduces both exact PNG hashes and the frame
  digest. The full `npm.cmd run check` also passes after copying only the 965
  missing ignored Boss review PNGs into this fresh temporary worktree, bringing
  its local validation corpus to the expected 1,064 files.
- Visual acceptance is complete. This approval does not register or expose
  Centaur; the registry remains internal with zero approved/public families.
- This approved baseline is preserved unchanged in both the Steppe approval
  worktree and the bounded Satyr continuation.

### Approved Briar Reveler Walk Baseline

- Gate ID: `en-e03-briar-reveler-walk-v1`; current status: `approved` and
  internal/non-public.
- Authorization evidence: after approving the exact Steppe Hunter raw and
  Complete B + Form animations, the designer said `awesome lets do next`.
- Scope: Briar Reveler common Walk W1-W4 across Down, Left, Right, and Up only,
  with all eight approved Briar Reveler Idle frames delegated byte-for-byte.
- Source: `engine/enemy-expansion-en-e03-satyr-walk.js`.
- Focused checker:
  `tools/check-enemy-expansion-en-e03-satyr-walk.mjs` via
  `npm.cmd run check:enemy-expansion-en-e03-satyr-walk`.
- Review generator:
  `tools/enemy-expansion-en-e03-satyr-walk-review.mjs` via
  `npm.cmd run review:enemy-expansion-en-e03-satyr-walk`.
- Raw animation for direct review:
  `enemy-expansion-review/en-e03-satyr-walk/en-e03-briar-reveler-walk-all-directions.gif`,
  `384x96`, four frames, `0.67s` loop, SHA-256
  `35a59fb7e05ee6b35505e67183c1f9c93e9780fcfc657ef4278bb6b7cde30825`.
- Complete B + Form animation for direct review:
  `enemy-expansion-review/en-e03-satyr-walk/en-e03-briar-reveler-walk-complete-b-form-all-directions.gif`,
  `384x96`, four frames, `0.67s` loop, SHA-256
  `17b56b495035a596293f63427f3ccad42efc06f8409e7a50018da5a5c18ff2b9`.
- These exact corrected GIFs were the direct visual-approval surface.
- Raw board:
  `enemy-expansion-review/en-e03-satyr-walk/en-e03-briar-reveler-walk-raw.png`,
  `1950x870`, SHA-256
  `8b39d575c3048bbced3ac975c5f204e3bd9ea7fb35ebf329ce0151a481a3269c`.
- Complete B + Form board:
  `enemy-expansion-review/en-e03-satyr-walk/en-e03-briar-reveler-walk-complete-b-form.png`,
  `1950x870`, SHA-256
  `b7e8b566bafbe87816c9f53977dcde8e109f544b488c73012015e3a72b86345f`.
- Candidate 16-frame digest:
  `409b08eb3bd121dec5e8234c49e2fe11d374b73bf501648852adae2ae4ab5755`.
- Delegated approved Idle digest remains exact at
  `0d5599dcd452351903e5d56289596d2e75f59caf5c0b7a5525c7e375c39b36fa`.
- The focused gate passes all 16 connected hard-alpha horned silhouettes,
  split-hoof ground contacts, three distinct contact/silhouette poses per
  direction with only W2/W4 shared, exact side mirroring, one-cell margins,
  all eight delegated Idle frames, an explicit no-eye rear-head pixel in every
  Up frame, and zero public exposure. Complete B adds 1,913 pixels and Form
  changes 2,047 source pixels.
- The full `npm.cmd run check` passes with the preserved 1,064-file local Boss
  review corpus: 57 legacy Enemy families / 202 variants and all 232 sheets
  remain unchanged.
- Visual acceptance is complete. After first pausing approval to remove the
  inherited side-eye pixel from every Up frame, the designer reviewed the
  corrected raw and Complete B + Form animations and said
  `greeat lets move on` on 2026-08-06.
- That approval authorizes only Hill Breaker common Attack A1-A4 across Down,
  Left, Right, and Up while preserving its approved Idle and Walk pixels
  byte-for-byte. Hurt, other families, variants, registration, consumers,
  effects, release, and later gates remain unauthorized.
- The original Briar Reveler source worktree remains preserved; this exact
  approved baseline is included in and published through the consolidated
  Steppe Hunter Attack branch.

### Approved Hill Breaker Attack Baseline

- Gate ID: `en-e03-hill-breaker-attack-v1`; current status: `approved` on
  2026-08-07 and internal/non-public.
- Authorization evidence: after reviewing the corrected Briar Reveler raw and
  Complete B + Form animations, the designer said `greeat lets move on`.
- Current review feedback: `i think maybe a little more of the body could move
  when he attacks`. The first overlay-only response was explicitly rejected as
  `not a good animation` and has been discarded. The replacement is a private
  layered rig: A1 coils the upper body and club backward, A2 releases from
  center, A3 follows through and drops into impact, and A4 recovers over
  anchored legs and feet. The follow-up request to use front and back too is now
  represented by Down/Up hip-and-upper-leg motion with both foot anchors exact
  across all four phases. Shared humanoid rendering remains unchanged.
- Scope: Hill Breaker common Attack A1-A4 across Down, Left, Right, and Up only,
  with all 8 approved Idle and 16 approved Walk frames delegated byte-for-byte.
- Source: `engine/enemy-expansion-en-e03-giant-attack.js`.
- Focused checker:
  `tools/check-enemy-expansion-en-e03-giant-attack.mjs` via
  `npm.cmd run check:enemy-expansion-en-e03-giant-attack`.
- Review generator:
  `tools/enemy-expansion-en-e03-giant-attack-review.mjs` via
  `npm.cmd run review:enemy-expansion-en-e03-giant-attack`.
- Approved labeled raw animation:
  `enemy-expansion-review/en-e03-giant-attack/en-e03-hill-breaker-attack-four-directions-labeled-v2.gif`,
  `192x224`, four frames, `0.48s` loop, SHA-256
  `a2b880921c4337b89ee64b18446fbe5d2527b2808c8f48a37c2f4549d1118724`.
- Approved labeled Complete B + Form animation:
  `enemy-expansion-review/en-e03-giant-attack/en-e03-hill-breaker-attack-four-directions-labeled-complete-b-form-v2.gif`,
  `192x224`, four frames, `0.48s` loop, SHA-256
  `d06771fa77fac6078332f1928e713565a6cd2f54ff440145d03f8131ae353673`.
- These exact ignored review-only derivatives were the direct visual-approval
  surfaces. The frozen deterministic source evidence remains the boards and
  16-frame digest below.
- Raw board:
  `enemy-expansion-review/en-e03-giant-attack/en-e03-hill-breaker-attack-raw.png`,
  `1950x744`, SHA-256
  `45ec7e5a52abdd0dc0e2eaf4042a2d64c73ddb0a47dd070eb974e31fa2dabe8f`.
- Complete B + Form board:
  `enemy-expansion-review/en-e03-giant-attack/en-e03-hill-breaker-attack-complete-b-form.png`,
  `1950x744`, SHA-256
  `250390b3c44db6d86362e8cbad7ef7225b2c728c984718119c5d7b85fc07ea10`.
- Candidate 16-frame digest:
  `1b5cade8a0a19babd00ed067010ecb98948891a7e4f6cd435adc53ae57cf78ab`.
- Delegated approved Idle digest remains exact at
  `2ae3904669508afbabed0742d72d4d334f37cdee360ba4f4d1a11767d22ee5ab`.
- Delegated approved Walk digest remains exact at
  `9f41b2b90b245fe7d6302f87ddcd9313cdedc5360ddc245a4d61c8beab958622`.
- The focused gate passes all 16 connected hard-alpha Attack silhouettes, four
  distinct poses per direction, planted Giant contact, one-cell margins,
  at least three torso-and-hip phases per direction, matched side-profile
  bounds/visual weight, at least three Down/Up hip-and-upper-leg phases, exact
  planted-foot anchors, all approved Idle/Walk frames, and zero public exposure.
  Complete B adds 1,469 pixels and Form changes 1,752 source pixels.
- Visual acceptance is complete. The designer reviewed the exact labeled raw
  and Complete B + Form four-direction animations and said `Very good approved`
  on 2026-08-07.
- The original Hill Breaker Attack source worktree remains preserved; this exact
  approved lane is included in and published through the consolidated Steppe
  Hunter Attack branch. Do not register or advance a later EN-E03 gate without
  separate authorization.

### Approved Steppe Hunter Attack Baseline

- Gate ID: `en-e03-steppe-hunter-attack-v1`; current status:
  `approved` on 2026-08-07 and internal/non-public.
- Authorization evidence: after approving the exact labeled four-direction raw
  and Complete B + Form Hill Breaker Attack animations with `Very good
  approved`, the designer said `Cool let's keep going`.
- Approval evidence: the designer reviewed both exact labeled Down, Left,
  Right, and Up GIFs together in raw/no-outline and Complete B + Form and said
  `Approved`.
- Scope: Steppe Hunter common Attack A1-A4 across Down, Left, Right, and Up
  only, with all 8 approved Idle and 16 approved Walk frames delegated
  byte-for-byte.
- Source: `engine/enemy-expansion-en-e03-centaur-attack.js`. The approved
  `engine/enemy-expansion-en-e03-centaur-walk.js` output remains hash-exact;
  only its private horse-body helper is exported for reuse by this baseline.
- Focused checker:
  `tools/check-enemy-expansion-en-e03-centaur-attack.mjs` via
  `npm.cmd run check:enemy-expansion-en-e03-centaur-attack`.
- Review generator:
  `tools/enemy-expansion-en-e03-centaur-attack-review.mjs` via
  `npm.cmd run review:enemy-expansion-en-e03-centaur-attack`.
- Labeled raw animation:
  `enemy-expansion-review/en-e03-centaur-attack/en-e03-steppe-hunter-attack-four-directions-labeled-v1.gif`,
  `192x224`, four `120ms` frames / `0.48s` loop, SHA-256
  `ea0d576a586f3dc22777a35e8c8bed837efe5c9e7125e5508531a903fe7236d7`.
- Labeled Complete B + Form animation:
  `enemy-expansion-review/en-e03-centaur-attack/en-e03-steppe-hunter-attack-four-directions-labeled-complete-b-form-v1.gif`,
  `192x224`, four `120ms` frames / `0.48s` loop, SHA-256
  `7798a3da0b43b0111ac68b201f0afc8a4a85d53e0531b2cc3718a08dcd73aafa`.
- Raw board:
  `enemy-expansion-review/en-e03-centaur-attack/en-e03-steppe-hunter-attack-raw.png`,
  `1950x744`, SHA-256
  `b276746f3d532df7b3ba9b551d8227b3d2fa439367fd49108eaaab5b5309eee2`.
- Complete B + Form board:
  `enemy-expansion-review/en-e03-centaur-attack/en-e03-steppe-hunter-attack-complete-b-form.png`,
  `1950x744`, SHA-256
  `ba5c3f84fc0c7e96af985453c847b3669efe39c7c4e5f033fcad13dba432c5be`.
- Candidate 16-frame digest:
  `c01f66be4c6afcaaa562073b85598b09eff0e8686ec0092296d95090883f77a0`.
- Delegated approved Idle digest remains exact at
  `3c88471b25fc27397a0a11d6495cd27c641a6715ff33429f5d0d2c81f184ae49`;
  delegated approved Walk digest remains exact at
  `8fa70b11dd34ae5643c709ff1082b84f61e36a1f3fa6110689f47fee864c433e`.
- The focused gate passes all 16 connected hard-alpha horse-rider-spear
  silhouettes, planted hoof contacts, four distinct poses and at least three
  horse-body weight phases per direction, exact left/right mirroring, true
  Down/Up depth attacks, one-cell margins, all approved Idle/Walk frames, 1,752
  Complete B additions, 1,937 Form source changes, frozen board/GIF hashes,
  and zero public exposure.
- Visual acceptance is complete on both exact labeled all-four-direction GIFs,
  raw/no-outline and Complete B + Form. The general dual-presentation rule
  remains mandatory for future normal reviews. Commit and push this bounded
  approved lane under the standing publication rule; do not register it or
  begin a later gate without separate authorization.

### Approved Briar Reveler Attack Baseline

- Gate ID: `en-e03-briar-reveler-attack-v1`; current status:
  `approved`, internal, and non-public on 2026-08-07.
- Authorization evidence: after the approved Steppe Hunter Attack lane was
  committed and pushed, the designer said `lets keep going` on 2026-08-07.
- Approval evidence: the designer reviewed both exact labeled
  all-four-direction raw and Complete B + Form animations together and said
  `very good! approved` on 2026-08-07.
- Scope: Briar Reveler common Attack A1-A4 across Down, Left, Right, and Up
  only, with all 8 approved Idle and 16 approved Walk frames delegated
  byte-for-byte.
- Worktree and branch:
  `C:\tmp\8-bit-sprite-assembler-en-e03-briar-reveler-attack` on
  `codex/en-e03-briar-reveler-attack`, created exactly from pushed checkpoint
  `c567a426fa6d5175395c2b035f65b12b5a5dd1cb`.
- Source: `engine/enemy-expansion-en-e03-satyr-attack.js`.
- Focused checker:
  `tools/check-enemy-expansion-en-e03-satyr-attack.mjs` via
  `npm.cmd run check:enemy-expansion-en-e03-satyr-attack`.
- Review generator:
  `tools/enemy-expansion-en-e03-satyr-attack-review.mjs` via
  `npm.cmd run review:enemy-expansion-en-e03-satyr-attack`.
- Labeled raw animation:
  `enemy-expansion-review/en-e03-satyr-attack/en-e03-briar-reveler-attack-four-directions-labeled-v1.gif`,
  `192x224`, four `120ms` frames / `0.48s` loop, SHA-256
  `1625c6db6759cb4a20ea4521ef1a4b04199813f2dc75e2e0db2fa5e4a54241d9`.
- Labeled Complete B + Form animation:
  `enemy-expansion-review/en-e03-satyr-attack/en-e03-briar-reveler-attack-four-directions-labeled-complete-b-form-v1.gif`,
  `192x224`, four `120ms` frames / `0.48s` loop, SHA-256
  `5efb83b879f1cbe130075db722f9d26762180b4e00945941465d0dbb8304886a`.
- Raw board:
  `enemy-expansion-review/en-e03-satyr-attack/en-e03-briar-reveler-attack-raw.png`,
  `1950x870`, SHA-256
  `ac7ca315dfdd65b378c5db42623bf4013b961c0ebf1f22c0045803f14dcb9abb`.
- Complete B + Form board:
  `enemy-expansion-review/en-e03-satyr-attack/en-e03-briar-reveler-attack-complete-b-form.png`,
  `1950x870`, SHA-256
  `4d97b61111bcf293d024a01201677fb10ba54bdf496fa0264df5abb78f5a54ab`.
- Candidate 16-frame digest:
  `9545779f0d39c16f1fedaf581ad1f5dee8b6ce0b79d35ce23a66e81375c32270`.
- Delegated approved Idle digest remains exact at
  `0d5599dcd452351903e5d56289596d2e75f59caf5c0b7a5525c7e375c39b36fa`;
  delegated approved Walk digest remains exact at
  `409b08eb3bd121dec5e8234c49e2fe11d374b73bf501648852adae2ae4ab5755`.
- A1 braces and draws the crooked staff back, A2 lifts through torso and hocks,
  A3 drives a diagonal full-body strike, and A4 settles to guard. The focused
  gate passes 16 connected hard-alpha body-and-staff silhouettes, exact side
  mirroring, planted split-hoof anchors, four distinct poses per direction,
  front/back depth distinction, 2,030 Complete B additions, 1,922 Form source
  changes, exact approved Idle/Walk delegation, and zero public exposure.
- Visual approval is complete and the bounded branch is published. Stop here:
  the only authorized continuation is the separately bounded Hill Breaker Hurt
  candidate below.

### Approved Hill Breaker Hurt Baseline

- Gate ID: `en-e03-hill-breaker-hurt-v1`; current status: `approved` on
  2026-08-07, internal, and non-public.
- Authorization evidence: after the approved Briar Reveler Attack branch was
  committed and pushed, the designer agreed to continue the 80 plan. Codex
  proposed exactly Hill Breaker H1-H2 across Down, Left, Right, and Up while
  preserving every approved Idle, Walk, and Attack frame and stopping for both
  required review modes; the designer said `lets go for it` on 2026-08-07.
- Approval evidence: the designer reviewed both exact labeled
  all-four-direction raw and Complete B + Form animations together and said
  `approved`.
- Worktree and branch:
  `C:\tmp\8-bit-sprite-assembler-en-e03-hill-breaker-hurt` on
  `codex/en-e03-hill-breaker-hurt`, based exactly on
  `68d913ccfd00f76f15dcac308338c9e686a4f171`; the approved bounded lane is
  committed and pushed to its matching origin branch.
- Source: `engine/enemy-expansion-en-e03-giant-hurt.js`. Its renderer delegates
  all 8 approved Idle, 16 approved Walk, and 16 approved Attack frames
  byte-for-byte.
- Focused checker:
  `tools/check-enemy-expansion-en-e03-giant-hurt.mjs` via
  `npm.cmd run check:enemy-expansion-en-e03-giant-hurt`.
- Review generator:
  `tools/enemy-expansion-en-e03-giant-hurt-review.mjs` via
  `npm.cmd run review:enemy-expansion-en-e03-giant-hurt`.
- Labeled raw animation:
  `enemy-expansion-review/en-e03-giant-hurt/en-e03-hill-breaker-hurt-four-directions-labeled.gif`,
  `192x224`, two `140ms` frames / `0.28s` loop, SHA-256
  `ebc7e3e1fcfad73aa0b8114e270dae2a699933aedc23b306a73edeec9214e5b6`.
- Labeled Complete B + Form animation:
  `enemy-expansion-review/en-e03-giant-hurt/en-e03-hill-breaker-hurt-four-directions-labeled-complete-b-form.gif`,
  `192x224`, two `140ms` frames / `0.28s` loop, SHA-256
  `f2034dd87706e196f1eece15f08db86dfb6e32a5437c18cdfe08e89b778ba3f4`.
- Raw board:
  `enemy-expansion-review/en-e03-giant-hurt/en-e03-hill-breaker-hurt-raw.png`,
  `1134x744`, SHA-256
  `e621d1ed2898efdf9e49488aa367f7857b1c96f3b2ea1d9dd0dcd75dba2bcf02`.
- Complete B + Form board:
  `enemy-expansion-review/en-e03-giant-hurt/en-e03-hill-breaker-hurt-complete-b-form.png`,
  `1134x744`, SHA-256
  `201f7c3246c0a924426201d1ad43b6f90849d9f4cd934b591b7d5a8bd6d9161c`.
- Candidate eight-frame digest:
  `92c18dc1dd0699e52f5f31a0900be1c6e46974c6f5bc3347fc7a7c7b65432340`.
- H1 is the bright direction-aware recoil: upper body and club move as one rig
  over planted lower rows. H2 is the colored braced recovery. The focused gate
  passes 8/8 connected, distinct hard-alpha silhouettes, planted contact,
  one-cell margins, exact side visual weight, exact Down/Up foot anchors, 714
  Complete B additions, 418 Form source changes, and zero public families.
- Both exact labeled GIFs are approved and the bounded branch is published.
  Cast and Death aliases, other Hurt/family work, variants, registration,
  consumers, effects, release, and every later gate remain outside scope.

### Approved Steppe Hunter Hurt Baseline

- Gate ID: `en-e03-steppe-hunter-hurt-v1`; current status:
  `approved`, internal, and non-public on 2026-08-07.
- Authorization evidence: after approving both exact Hill Breaker Hurt GIFs,
  the designer said `nice lets do nexrt`. Codex explicitly bounded the next
  gate as Steppe Hunter H1-H2 across Down, Left, Right, and Up, preserving all
  approved Steppe Idle, Walk, and Attack pixels and stopping for the required
  dual-GIF review.
- Approval evidence: the designer reviewed both exact labeled
  all-four-direction raw and Complete B + Form animations together and said
  `approved`.
- Worktree and branch:
  `C:\tmp\8-bit-sprite-assembler-en-e03-steppe-hunter-hurt` on
  `codex/en-e03-steppe-hunter-hurt`, created exactly from approved pushed
  checkpoint `3e0d98bd48b30cd6ddf35cbd87b424c3c3fd3b5c`. The bounded approved lane is
  committed and pushed to its matching origin branch.
- Source: `engine/enemy-expansion-en-e03-centaur-hurt.js`; all 8 approved Idle,
  16 approved Walk, and 16 approved Attack frames delegate byte-for-byte.
- Focused checker:
  `tools/check-enemy-expansion-en-e03-centaur-hurt.mjs` via
  `npm.cmd run check:enemy-expansion-en-e03-centaur-hurt`.
- Review generator:
  `tools/enemy-expansion-en-e03-centaur-hurt-review.mjs` via
  `npm.cmd run review:enemy-expansion-en-e03-centaur-hurt`.
- Labeled raw animation:
  `enemy-expansion-review/en-e03-centaur-hurt/en-e03-steppe-hunter-hurt-four-directions-labeled.gif`,
  `192x224`, two `140ms` frames / `0.28s` loop, SHA-256
  `b79357ba08580dbe6bb8fb8a175a9694756ec636a71908608cacaa75aa4b0f01`.
- Labeled Complete B + Form animation:
  `enemy-expansion-review/en-e03-centaur-hurt/en-e03-steppe-hunter-hurt-four-directions-labeled-complete-b-form.gif`,
  `192x224`, two `140ms` frames / `0.28s` loop, SHA-256
  `6995aadbe92e0425eb6625afaed9b3f005d99820d28f4addb9af15c9107011e9`.
- Raw board:
  `enemy-expansion-review/en-e03-centaur-hurt/en-e03-steppe-hunter-hurt-raw.png`,
  `1134x744`, SHA-256
  `da4fd6d7c98b4499df378cb006183728d1433d89a15c3db353fc06557bf3c0ec`.
- Complete B + Form board:
  `enemy-expansion-review/en-e03-centaur-hurt/en-e03-steppe-hunter-hurt-complete-b-form.png`,
  `1134x744`, SHA-256
  `9f00c5feadee2b2670b2d672b903106eaa7ee7a500da28d0ddc1de1c4d6c8441`.
- Candidate eight-frame digest:
  `13861ef4d4543d78afe893968c81b92023a6a863ac8c56e8aef0ece1b5e05a4a`.
- H1 flashes the complete horse-rider-spear rig white and recoils the connected
  hybrid mass; H2 is a colored braced recovery with a newly settled spear.
  All four hoof contacts remain exact across H1-H2.
- The focused gate passes 8/8 connected distinct hard-alpha Hurt silhouettes,
  exact Left/Right mirroring, true Down/Up depth distinction, one-cell margins,
  fixed hoof anchors, 879 Complete B additions, 473 Form source changes, exact
  delegation of all 40 approved frames, and zero public EN-E03 families.
- Both exact labeled all-four-direction GIFs are approved and the bounded
  branch is published. Cast/Death aliases, registration, other Hurt, variants,
  consumers, effects, release, and later EN-E03 work remain separately gated.

### Approved Briar Reveler Hurt Baseline

- Gate ID: `en-e03-briar-reveler-hurt-v1`; current status:
  `approved`, internal, and non-public on 2026-08-07.
- Authorization evidence: after both exact Steppe Hunter Hurt GIFs were
  approved and that lane was committed and pushed, the designer said
  `awesome lets do next`. Codex explicitly bounded the continuation as Briar
  Reveler H1-H2 across Down, Left, Right, and Up, preserving all approved
  Idle/Walk/Attack pixels and stopping for the paired review.
- Approval evidence: the designer reviewed both exact labeled
  all-four-direction raw and Complete B + Form animations together and said
  `approved lets do next`.
- Worktree and branch:
  `C:\tmp\8-bit-sprite-assembler-en-e03-briar-reveler-hurt` on
  `codex/en-e03-briar-reveler-hurt`, created exactly from approved pushed
  checkpoint `374d0b73c171c9f9f35b6d71f2f9e85f4dcdd7c1`.
- Source: `engine/enemy-expansion-en-e03-satyr-hurt.js`; all 8 approved Idle,
  16 approved Walk, and 16 approved Attack frames delegate byte-for-byte.
- Focused checker:
  `tools/check-enemy-expansion-en-e03-satyr-hurt.mjs` via
  `npm.cmd run check:enemy-expansion-en-e03-satyr-hurt`.
- Review generator:
  `tools/enemy-expansion-en-e03-satyr-hurt-review.mjs` via
  `npm.cmd run review:enemy-expansion-en-e03-satyr-hurt`.
- Labeled raw animation:
  `enemy-expansion-review/en-e03-satyr-hurt/en-e03-briar-reveler-hurt-four-directions-labeled.gif`,
  `192x224`, two `140ms` frames / `0.28s` loop, SHA-256
  `438056d9d9c195aff1ab429ead9164f9b98bfd89cf916ff8936d353ce3f713f9`.
- Labeled Complete B + Form animation:
  `enemy-expansion-review/en-e03-satyr-hurt/en-e03-briar-reveler-hurt-four-directions-labeled-complete-b-form.gif`,
  `192x224`, two `140ms` frames / `0.28s` loop, SHA-256
  `8b73e3f44c0a7ff94df0cdb8b167d44d32e20e0273275d824844045de0cddce1`.
- Raw board:
  `enemy-expansion-review/en-e03-satyr-hurt/en-e03-briar-reveler-hurt-raw.png`,
  `1134x744`, SHA-256
  `0b5cd11212e272ab29bdac3336155e7546b3e1e28299c7ce70c0a7232b6ba44d`.
- Complete B + Form board:
  `enemy-expansion-review/en-e03-satyr-hurt/en-e03-briar-reveler-hurt-complete-b-form.png`,
  `1134x744`, SHA-256
  `78bec5bc888515bad74578b4d08f381f4c25842e88e3b76c74697d3da48fdb74`.
- Candidate eight-frame digest:
  `3bc6bbd29189d8155784fa7499b355af1b826c44d0caf60b37db198cb7625030`.
- The focused gate passes 8/8 connected distinct hard-alpha full-body Hurt
  silhouettes, four fixed split-hoof tips, exact Left/Right mirrors, true
  Down/Up depth, one-cell margins, the approved rear-head/no-side-eye treatment,
  945 Complete B additions, 417 Form source changes, exact delegation of all
  40 approved frames, and zero public EN-E03 families.
- After copying only the 965 missing ignored Boss checkpoints from the approved
  Steppe lane, the full `npm.cmd run check` passes against the complete
  1,064-file local corpus and all 232 public fixture sheets remain unchanged.
- Both exact labeled GIFs are approved and the bounded branch is committed and
  pushed. The designer authorized continuation; Codex explicitly bounded only
  a separate common Cast/Death alias gate across the three approved EN-E03
  common variants. Do not broaden it into variants, registration, consumers,
  effects, or release.

### Common Cast/Death Alias Approved Baseline

- Gate ID: `en-e03-common-cast-death-aliases-v1`; current status:
  `approved`, internal, non-public, committed, and pushed.
- Authorization evidence: the designer approved both exact Briar Reveler Hurt
  GIFs with `approved lets do next`; after publishing that lane, Codex bounded
  only common Cast/Death aliases for Hill Breaker, Steppe Hunter, and Briar
  Reveler with no new sprite pixels.
- Approval evidence: the designer reviewed the exact labeled all-four-direction
  Cast raw, Cast Complete B + Form, Death raw, and Death Complete B + Form GIFs
  together and said `approved` on 2026-08-07.
- Worktree and branch:
  `C:\tmp\8-bit-sprite-assembler-en-e03-cast-death-aliases` on
  `codex/en-e03-cast-death-aliases`, created exactly from approved pushed
  checkpoint `892a0034652c98f99b4f75ab9fdb58210927b98c`.
- Source: `engine/enemy-expansion-en-e03-common-aliases.js`; Cast C1-C4 maps to
  approved Attack A1-A4 and Death D1-D4 maps to approved Hurt H1,H2,H2,H2.
- Focused checker:
  `tools/check-enemy-expansion-en-e03-common-aliases.mjs` via
  `npm.cmd run check:enemy-expansion-en-e03-common-aliases`.
- Review generator:
  `tools/enemy-expansion-en-e03-common-aliases-review.mjs` via
  `npm.cmd run review:enemy-expansion-en-e03-common-aliases`.
- Cast raw / Complete B + Form GIF SHA-256 values:
  `e7340c687b8b4febc9852d56afaeed8d2545a37f9c3a816cfa3fa3fc25600d85` /
  `26594c7f08b61de870bde6046bca8a0d276cb24b6b7c9f87387546bd934c68c3`.
- Death raw / Complete B + Form GIF SHA-256 values:
  `438d31742ddd372018af80d96b84f20aec47246967a092b2f98684fe7580dae4` /
  `b4adbb78be7ab2d5f8d7c47b207dba99938b0b3c108799aa651f56b1fcbb93f0`.
- All four GIFs are `576x224`, four `120ms` frames, and show all three families
  plus Down, Left, Right, and Up together.
- Raw / Complete B + Form `1120x562` board SHA-256 values:
  `1353962c4861960683c99a1e608654685b093fd101a6534c4777c5687e3f3b89` /
  `0ab28ed6467e798e5f24a8f19e6a4d2a522cba5d6ad7d045ea865b8953942575`.
- Ninety-six-frame alias digest:
  `be86cf5677286e745d76f7744a49462ba22d4deeb63bc92026160a5ca84b8d89`.
- Focused results: 144/144 context frames preserved, 48/48 Cast aliases,
  48/48 Death aliases, zero new sprite pixels, 10,249 Complete B additions,
  9,535 Form changes, and zero public EN-E03 families.
- After copying only the 965 missing ignored Boss checkpoints from the approved
  Briar lane, the full `npm.cmd run check` passes against the complete
  1,064-file local corpus and all 232 public fixture sheets remain unchanged.
- Direct review of all four exact GIFs is complete and the bounded branch is
  published under the approval contract. The designer then said `good lets do
  next`; that continuation is explicitly bounded to Boulder Hurler Idle F1-F2
  across four directions. Do not begin any other variant, animation,
  registration, integration, effect, release, or later work.

### Boulder Hurler Specialist Idle Approved Baseline

- Gate ID: `en-e03-boulder-hurler-idle-v1`; current status:
  `approved`, internal, non-public, committed, and pushed.
- Authorization evidence: after approving all four exact common Cast/Death
  alias GIFs, the designer said `good lets do next`; Codex explicitly bounded
  the continuation to Boulder Hurler Idle F1-F2 across all four directions.
- Approval evidence: the designer reviewed both exact improved labeled
  all-four-direction raw and Complete B + Form GIFs together and said `approved`
  on 2026-08-07.
- Worktree and branch:
  `C:\tmp\8-bit-sprite-assembler-en-e03-boulder-hurler-idle` on
  `codex/en-e03-boulder-hurler-idle`, created exactly from reconciled approved
  alias checkpoint `8fff98f775687a6d0d07b5b9e58a7ec57e1988dd`.
- Source: `engine/enemy-expansion-en-e03-giant-specialist-idle.js`; only
  Giant/Boulder Hurler Idle F1-F2 is implemented.
- Identity: long bare throwing arms, heavy wrist wraps, a diagonal sling
  harness, and a cool slate hide palette. The actor uses no weapon pixels and
  the boulder remains an external projectile boundary.
- Focused checker:
  `tools/check-enemy-expansion-en-e03-boulder-hurler-idle.mjs` via
  `npm.cmd run check:enemy-expansion-en-e03-boulder-hurler-idle`.
- Review generator:
  `tools/enemy-expansion-en-e03-boulder-hurler-idle-review.mjs` via
  `npm.cmd run review:enemy-expansion-en-e03-boulder-hurler-idle`.
- Raw / Complete B + Form `1528x650` board SHA-256 values:
  `f3a9b41fbec9127f3414c3a414b2e64d1a9cae3c2f86c81b31f6dcda0ccda54f` /
  `bbaf966cbd33a807372c45622112f0fe523dc8e9cb3f52a36cc139777f82be91`.
- Raw / Complete B + Form labeled four-direction GIF SHA-256 values:
  `8ee6a17eee4e4428cbfab8fad2fef942dba436803bae398d5ea02b4afbfaad56` /
  `2c081db2c8cb553f70374e70ab234814d4b1c64aa8c11227b85e9971cf058701`.
- Both GIFs are `192x224`, contain two `240ms` frames, and show Down, Left,
  Right, and Up together.
- Eight-frame candidate digest:
  `d8f3b04d54a55d7fe20e3dfdf0c3cb9c68ffb65722b07a5b0f416e18335795a0`.
- Revised motion: a slower grounded stance cycle lowers the shoulders and
  harness in F2 while the hands lag, move inward, and bend into a
  throwing-ready side pose instead of translating the whole overlay together.
- Focused results: 8/8 approved Hill Breaker Idle frames preserved, 8/8
  connected hard-alpha candidate frames, four exact side mirrors, distinct
  Down/Up views and F1/F2 poses, one-cell margins, 694 Complete B additions,
  872 Form changes, zero baked projectile pixels, and zero public families.
- With the complete local Boss checkpoint corpus present, the full
  `npm.cmd run check` passes and all 232 public fixture sheets remain unchanged.
- Direct review of both exact GIFs is complete and the bounded branch is
  published under the approval contract. Do not add motion or another variant,
  register, integrate, add effects, release, or begin later work without
  separate explicit authorization.

### Full Public-Enemy Three-Treatment Export Approved

- Gate ID: `all-enemy-three-outline-modes-v1`; status: `approved`, local
  delivery/tooling checkpoint, committed and pushed at
  `71fb59479626b757f112be3f9e56b92f24085208`, with no catalog or sprite-source
  change.
- Approval evidence: after receiving the exact ZIP and validation summary, the
  designer said `awesome lets do next in plan` on 2026-08-07.
- Source art checkpoint:
  `9c89077f79ef8eab06dc4e7a725edefe5b9bbb97`; the manifest records clean engine
  files and exporter SHA-256
  `6d934d164df8d7b76491bb9b8f547385562381773ac74bee748c3762f23e1b21`.
- Export command: `npm.cmd run export:enemies:all-outlines` through
  `tools/export-all-enemy-outline-pack.mjs`.
- Validation command: `npm.cmd run check:export:enemies:all-outlines` through
  `tools/check-all-enemy-outline-pack.mjs`.
- Folder contract:
  - `outlined/<family>/<variant>.png`: Form + Complete B;
  - `semi-outlined/<family>/<variant>.png`: Form + Selective C; and
  - `without-outlines/<family>/<variant>.png`: Form + None.
- Coverage: all 67 complete public families / 232 variants in each treatment,
  696 native `480x96` hard-alpha PNGs, 698 unpacked files, and 698 ZIP entries.
- Exact ZIP: `8-bit-sprite-assembler-all-enemies-3-outline-modes-v1.zip`,
  2,440,823 bytes, SHA-256
  `fd03895d8657b96293be14fbddbdb193ce62678c068023b58015410fc7f92b9c`.
- The focused checker validates every PNG dimension, all 80 non-empty actor
  cells, binary alpha, treatment placement and distinction, per-file hashes,
  directory parity, ZIP entry bytes, and archive sidecar. The full
  `npm.cmd run check` also passes with all 232 committed fixtures unchanged.
- Incomplete/non-public EN-E03 candidates, including Boulder Hurler's
  Idle-only internal baseline, remain excluded from the complete public-roster
  package. Bosses, players, effects, floor shadows, projectiles, release
  binaries, and invented license text are also excluded.
- The package is a local delivery artifact, not the separately gated Wildshot
  game-pack release or a public release transport.

The designer's approval plus `lets do next in plan` authorizes only a
Storm-Clan Jarl elite Idle F1-F2 baseline across all four labeled directions.
It must preserve the approved Hill Breaker and Boulder Hurler Giant Idle pixels,
read as an armored Giant leader with a bright clan band, and keep storm arcs,
lightning, impact cracks, and every other effect external. Walk, Attack, Hurt,
Cast/Death aliases, other EN-E03 variants, registration, consumers, effects,
release, and later work remain separately gated.

### Storm-Clan Jarl Elite Idle Approved

- Gate ID: `en-e03-storm-clan-jarl-idle-v1`; status: `approved`, internal,
  non-public, and bounded to Idle F1-F2 only.
- Isolated branch/worktree: `codex/en-e03-storm-clan-jarl-idle` at
  `C:\tmp\8-bit-sprite-assembler-en-e03-storm-clan-jarl-idle`, based exactly
  on approved handoff/export reconciliation checkpoint
  `088b03f1e2b2fd3cf2391c8536a920fca5c9bb86`.
- Approved implementation checkpoint:
  `d9c3dedf521a1a1a6ad0b82f458bf38cf8fa9533`, committed and pushed on the
  isolated branch after the exact corrected paired-GIF approval.
- Scope: Storm-Clan Jarl elite Idle F1-F2 only across Down, Left, Right, and Up.
  Layered storm-dark plate, broad steel pauldrons, heavy bracers, and a bright
  cyan cloth clan sash establish the leader identity. No lightning, storm arc,
  impact crack, projectile, aura, or environmental-effect pixels are baked in.
- Revision evidence: after reviewing the first paired candidate, the designer
  said `his shoulder is kind of in wrong place in the side frames`. The forward
  side pauldron is now one row lower and one pixel back over the upper-arm joint
  in both exact mirrored side directions; all hashes below identify this
  corrected candidate only.
- Approval evidence: the designer reviewed both exact corrected labeled
  all-four-direction raw and Complete B + Form GIFs together and said
  `approved` on 2026-08-07.
- Review command:
  `npm.cmd run review:enemy-expansion-en-e03-storm-clan-jarl-idle`.
  It deterministically produces both labeled `192x224`, two-frame, `480ms`
  all-four-direction GIFs plus comparison boards beside the approved Boulder
  Hurler and Hill Breaker Idle baselines.
- Raw board SHA-256:
  `776c57e70b20f7c0f0ab07ea344fab3e31082c028c08621498cf8b58d0b07c50`;
  Complete B + Form board SHA-256:
  `e0fd514dd9a9c26b50c221a5484f2832cee67e64e7a75eb08be56674f54c7768`.
- Raw GIF SHA-256:
  `dad3d5b8deaf07ca565165a7db9f2f6159af399b107215a9e7c9f459103f6183`;
  Complete B + Form GIF SHA-256:
  `3f173f215ad354fde8b387a6c507127bb15507e73f575bd843d1b82d55e25bdc`.
- Candidate eight-frame digest:
  `3aebd8218877e0da9752b20df1256da4af2710927389006011a37479a5d14894`.
- Focused validation command:
  `npm.cmd run check:enemy-expansion-en-e03-storm-clan-jarl-idle`; it preserves
  all 8/8 Hill Breaker and 8/8 Boulder Hurler Idle frames byte-exact, validates
  8/8 connected hard-alpha candidate silhouettes, four exact side mirrors,
  distinct Down/Up and F1/F2 poses, one-cell margins, 106 bright clan-sash
  pixels, 682 Complete B additions, 684 Form source changes, zero baked effect
  pixels, and zero public EN-E03 families.
- With the complete local Boss checkpoint corpus present, the full
  `npm.cmd run check` passes in 178.4 seconds and all 232 public fixture sheets
  remain unchanged.
- Publication is complete at approved implementation checkpoint
  `d9c3dedf521a1a1a6ad0b82f458bf38cf8fa9533`. Do not begin another animation
  or variant, register, integrate, add effects, release, or start later EN-E03
  work without separate explicit authorization.

### Sun Lancer Specialist Idle Approved

- Gate ID: `en-e03-sun-lancer-idle-v1`; status: `approved`, internal,
  non-public, and bounded to Idle F1-F2 only.
- Authorization evidence: after approving the corrected Storm-Clan Jarl Idle
  gate, the designer said `lets do next`. Following the documented EN-E03
  family order, Codex explicitly bounded the next smallest gate to Sun Lancer
  specialist Idle F1-F2 across all four directions.
- Isolated branch/worktree: `codex/en-e03-sun-lancer-idle` at
  `C:\tmp\8-bit-sprite-assembler-en-e03-sun-lancer-idle`, based exactly on
  published Storm handoff checkpoint
  `79a24ae3d1951780c2c29c8509fbe6310cb74c1b`.
- Approved implementation checkpoint:
  `f5057497bc0b9ee62b79c5d8a94efecfd49c0ec9`, committed and pushed on the
  isolated branch after the exact paired-GIF approval.
- Approval evidence: the designer reviewed both exact labeled
  all-four-direction raw and Complete B + Form GIFs together and said
  `approved` on 2026-08-07.
- Scope: Sun Lancer specialist Idle F1-F2 only across Down, Left, Right, and Up.
  The approved Steppe Hunter chestnut four-hoof chassis is preserved while
  sun-gold rider armor, a red-gold saddle cloth, and a bright direction-aware
  lance pennant establish the specialist identity. Charge dust, spear trails,
  hoof shock rings, and every other movement effect remain external.
- Review command: `npm.cmd run review:enemy-expansion-en-e03-sun-lancer-idle`.
  It deterministically produces both labeled `192x224`, two-frame, `480ms`
  all-four-direction GIFs plus raw and Complete B + Form comparison boards
  beside the approved Steppe Hunter baseline.
- Raw board SHA-256:
  `e1bb41a818953dbcd1e11074da5fe1f115f83377697354493dd0ac730c247e47`;
  Complete B + Form board SHA-256:
  `64057dfab7bb6d7eebbf2b3de6838e82c3f0b95d7923f7eedf303b1f5154a493`.
- Raw GIF SHA-256:
  `2d6198eba203f013fbbf2813cc6ef030995cbce566e1e845b25444b1ec9e513e`;
  Complete B + Form GIF SHA-256:
  `a8122bd75f6e3761c2215f499ee9c505107e0eb1ee5d2aeebf78514ff6ffae90`.
- Candidate eight-frame digest:
  `c195ab452409e722a9b6a9ca14a58b657033ba4c65943ea99fb03c5f180b394e`.
- Focused validation command:
  `npm.cmd run check:enemy-expansion-en-e03-sun-lancer-idle`; it preserves all
  8/8 approved Steppe Hunter and 8/8 Storm-Clan Jarl Idle frames byte-exact,
  validates 8/8 connected hard-alpha candidate silhouettes, eight four-hoof
  contact rows, four exact side mirrors, distinct Down/Up and F1/F2 poses,
  one-cell margins, 40 pennant pixels, 308 sun-gold armor pixels, 192 red-gold
  cloth pixels, 972 Complete B additions, 1,172 Form source changes, zero baked
  effect pixels, and zero public EN-E03 families.
- With the complete local Boss checkpoint corpus present, the full
  `npm.cmd run check` passes in 186.9 seconds and all 232 public fixture sheets
  remain unchanged.
- Publication is complete at approved implementation checkpoint
  `f5057497bc0b9ee62b79c5d8a94efecfd49c0ec9`. Do not begin another animation
  or variant, register, integrate, add effects, release, or start later EN-E03
  work without separate explicit authorization.

### Banner Khan Elite Idle Approved

- Gate ID: `en-e03-banner-khan-idle-v1`; status: `approved`, internal,
  non-public, uncommitted, and unpushed pending bounded publication.
- Authorization evidence: after approving and publishing Sun Lancer Idle, the
  designer said `lets do next`. Following the documented Centaur role order,
  Codex bounded only Banner Khan elite Idle F1-F2 across four directions.
- Isolated branch/worktree: `codex/en-e03-banner-khan-idle` at
  `C:\tmp\8-bit-sprite-assembler-en-e03-banner-khan-idle`, based exactly on
  published Sun Lancer handoff checkpoint
  `97787113ba3883e8cec41051fc9bdefe00684e95`.
- Scope: Banner Khan elite Idle F1-F2 only across Down, Left, Right, and Up. The
  approved chestnut Steppe Hunter rider-horse-lance chassis is preserved while
  a visible khan face, compact conical steel helm, segmented blue-steel lamellar
  armor, crimson command sash, limited saddle drape, and separated tapered war
  standard establish the elite identity. Command aura, banner flare, hoof shock
  rings, and every other movement effect remain external.
- Revision evidence: the designer said `this one was weird` about the first
  paired candidate, then said the targeted repair still had `so much wrong` and
  requested a from-scratch rebuild. Both earlier overlay identities are rejected
  and discarded. The active version delegates only the approved Steppe Hunter
  chassis and redraws the complete elite identity. The designer then said the
  side-frame face was bad because it was `just straigth lines`; the active
  revision changes only the exact mirrored side faces, adding a stepped
  forehead, protruding nose, visible eye, cheek, and tapered jaw while preserving
  Down, Up, and the chassis. The designer then said the side mouth was too long;
  the active revision reduces it to one front pixel and separates the cheek and
  jaw tones. The latest feedback identified a pale horizontal side-profile
  streak; it was the six-pixel light fur collar rather than the mouth. Only the
  mirrored side collar was replaced with a compact stepped two-tone shape and
  two-pixel pale highlight. The designer then requested horse-body motion. F2
  now adds a Banner Khan-only planted torso shift: the side rump lifts while the
  chest settles, and Down/Up lift both outer flanks. Every leg and hoof pixel
  remains delegated byte-exact. All hashes below identify only this repaired
  from-scratch candidate.
- Approval evidence: the designer reviewed both exact labeled all-four-
  direction raw and Complete B + Form r3 GIFs together and said `approved` on
  2026-08-07. Technical validation supports but does not substitute for that
  direct visual approval.
- Review command: `npm.cmd run review:enemy-expansion-en-e03-banner-khan-idle`.
  It deterministically produces both labeled `192x224`, two-frame, `480ms`
  all-four-direction GIFs plus raw and Complete B + Form comparison boards
  beside the approved Sun Lancer and Steppe Hunter baselines.
- Raw board SHA-256:
  `6221555094b9876ff1aad5f04b7a20327ea4f79bde7d06116f2f95f07a2836e1`;
  Complete B + Form board SHA-256:
  `f4420a5c827762b699fa0007e168a484247fc0cb1a82623ec18c5cf510cc9b92`.
- Raw GIF SHA-256:
  `1b93946a596213cb02460624fd3c4e5c0640f5202e86783fbdbbe34e73d15a10`;
  Complete B + Form GIF SHA-256:
  `298ad981961f9025c46fbcc3a255345ac8127fc2ce052303106b3606610e9e97`.
- Candidate eight-frame digest:
  `61c80740b96c2a35ccd8382335299c6521049f139c1c4df57e4852480663b3d6`.
- Focused validation command:
  `npm.cmd run check:enemy-expansion-en-e03-banner-khan-idle`; it preserves all
  8/8 approved Steppe Hunter and 8/8 Sun Lancer Idle frames byte-exact,
  validates 8/8 connected hard-alpha candidate silhouettes, eight four-hoof
  contact rows, four exact side mirrors, distinct Down/Up and F1/F2 poses,
  one-cell margins, 76 banner pixels, 256 blue-steel lamellar pixels, 152
  crimson-cloth pixels, 50 bronze-trim pixels, 48 fur-collar pixels, 983
  Complete B additions, 1,011 Form source changes, zero baked effect pixels,
  and zero public EN-E03 families.
- With the complete local Boss checkpoint corpus present, the full
  `npm.cmd run check` passes in 186.8 seconds and all 232 public fixture sheets
  remain unchanged.
- Required next action: publish only this bounded approved lane, verify its
  upstream, and reconcile the handoff with the published commit. Do not begin
  another animation or variant, register, integrate, add effects, release, or
  start later EN-E03 work without separate explicit designer authorization.
- Pass-size guidance: this small Idle gate calibrates the new elite identity.
  If it is approved and the designer explicitly continues, the remaining
  Banner Khan Walk, Attack, Hurt, and Cast/Death work may be grouped into one
  larger follow-up review instead of separate motion-by-motion gates.

The designer accepted EN-F00, approved EN-E01's exact common-baseline Idle
artifact, authorized its full private production, accepted the completed-slice
review, authorized bounded public registration, and then explicitly authorized
legacy consumer integration on 2026-08-02.
EN-E01 now contains five immutable contract cards and all 15 common,
specialist, and elite briefs for Witch, Fallen Knight, Pirate, Necromancer, and
Alchemist. All variants render through one shared humanoid handler and implement
the standard 20-column Enemy contract in Down, Left, Right, and Up. The EN-E01
slice registry contains all five families / 15 variants. The cumulative stable
approved registry now contains EN-E01 plus EN-E02 at ten families / 30 variants.
The consumer catalog retains those exact IDs and counts and routes the approved
repair registry. The pre-repair registry remains separately addressable only as
historical regression evidence.

The designer approved exact Idle PNG SHA-256
`2d710ab54a845c4805d428c428cfa9e1cda09f4adee886c5deafbafee831b7ee`
and 40-frame digest
`339c5ff809d3b17aec20b3ec953c8217470cde026fc743cde0cd3854ed5c3323`.
Those approved Idle pixels remain exact. Walk/Attack/Hurt, Enemy Cast/Death
aliases, all specialist/elite briefs, exhaustive structural checks, and focused
review evidence are complete. The public registry is pixel-identical to the
reviewed candidate across all 1,200 frames. Consumer checkpoint `e0be273`
publishes immutable `PUBLIC_ENEMIES`: the unchanged 57-family / 202-variant
legacy entries followed by the five approved families / 15 variants. Editor
selectors and sanitization, persisted Enemy specs, randomization, combat
defaults, thumbnails, ordinary/Wildshot packs, full/animation/direction
exports, and Complete Kits first consumed 62 families / 217 variants at that
historical checkpoint. EN-E02 consumer checkpoint `8ab1837` extends those same
generic paths to 67 families / 232 variants. The legacy `ENEMIES` array and all
16,160 locked legacy frames remain unchanged.
Optional assembled EN-E01 output now supports Complete B, Selective C, and Form
using each variant's published renderer palette ramps. Raw/None output remains
pixel-identical to the approved registry. The focused consumer gate exhausts
3,600 outline and 3,600 Form/outline cases across all 1,200 frames; it records
74,029 source-owned Form changes while preserving 69,090 protected pixels and
all added outline geometry. The designer accepted the live Witch/Hexer
Complete B + Form result on 2026-08-02 before authorizing continuation.

EN-E01 does not authorize all later waves. The three new Boss proposals remain
blocked behind the current Boss review queue unless the designer explicitly
changes priority.

## Required Reading

Read these completely before implementation:

1. `README.md`
2. `ARCHITECTURE.md`
3. `HANDOFF.md`
4. `ROADMAP.md`
5. `ENEMY_EXPANSION_PLAN.md`
6. `ENEMY_OUTLINE_PLAN.md`
7. `OUTLINE_RENDERING_PLAN.md`
8. `SHADE_RENDERING_PLAN.md`
9. `PRODUCTION_ROLL_PLAN.md`
10. `COMPATIBLE_REROLL_PLAN.md`
11. `OFFHAND_ITEMS_PLAN.md`
12. `GAME_PACK_EXPORT_PLAN.md`
13. `DEATH_ANIMATION_PLAN.md`
14. `EQUIPMENT_OUTLINE_ASSESSMENT.md`
15. `EQUIPMENT_READABILITY_PLAN.md`
16. `WEAPON_READABILITY_PLAN.md`
17. `TRANSPARENT_TILE_REPAIR_PLAN.md`
18. `WINDOWS_RELEASE.md`
19. `asset-pack/README.md`
20. `death-review/boss-48-drafts/README.md`

The order deliberately puts the active expansion authority before the
chronological completed-lane records. Historical plans do not authorize work;
their current headers and closing notices route continuation back here.

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
- The legacy effect-after-character compositor remains an explicit optional
  preview only; its foreground equipment occlusion rule remains on ice.

The 232 committed PNG fixtures are a deliberate legacy 12-column baseline.
Their `1152x384` 4x dimensions do not change the current public 20-column
runtime contract and must not be rewritten merely to match it.

## Current Enemy And Expansion State

- Locked legacy catalog: 57 families / 202 variants.
- Live public consumer catalog: 67 families / 232 variants.
- Current locked legacy audit: 16,160 source frames.
- Legacy None/Complete B/Selective C outline gate: 48,480 cases; the cumulative
  EN-E01/EN-E02 extension adds 7,200 source-preserving outline cases.
- All 67 public families support Form shading and all three outline modes at the
  assembled-output boundary with no source ownership or outline-geometry
  failures. EN-E01/EN-E02 consumer integration and the later seven-family
  repair presentation are explicitly accepted.
- The expansion projection is approximately 132 standard Enemy families / 427
  variants if every planned slice is later approved and completed.
- The frozen EN-E01 candidate registry retains five internal families / 15
  reviewed variants as pre-registration evidence.
- The stable approved expansion registry exposes exactly ten EN-E01/EN-E02
  families / 30 variants using the accepted repair pixels.
- The live consumer expansion registry is the exact same stable object; the
  internal pre-repair registry preserves the historical pixels for regression
  comparison.
- The frozen EN-E02 Idle registry retains five approved common baselines / 40
  exact Idle frames; the separate pre-registration candidate registry contains
  five immutable implemented-snapshot families / 15 variants / 1,200 frames.
  Its five approved records live separately in the registered slice boundary.
- The isolated EN-E03 Idle registry contains exactly three rejected common
  baselines / 24 Idle frames and zero approved/public families. Its renderer
  rejects every non-Idle animation. This technically valid implementation is
  historical evidence, not a visual baseline for a third attempt.
- The separate reference-first approval lane contains one visually approved
  Hill Breaker F1/F2 Idle baseline / eight frames / four directions. It remains
  one internal family / one common variant / zero
  public families and does not import into generic consumers.
- The approved Steppe Hunter calibration is a second isolated internal registry
  containing one Centaur family / one common variant / four frozen F1 directions
  / zero public families. Its bounded F1/F2 registry delegates those exact F1
  frames and adds four visually approved F2 directions with a planted four-hoof
  base. Neither registry imports into public consumers.
- The Briar Reveler calibration is a third isolated internal registry containing
  one Satyr family / one common variant / four F1 directions / zero public
  families. Its exact F1 boards are visually approved, and it rejects F2 plus
  every non-Idle animation.
- Its bounded approved F1/F2 registry delegates those exact F1 frames and adds
  four visually approved F2 directions with inward hock motion, a tail flick,
  and a one-pixel staff dip. Neither Satyr registry imports into public
  consumers.
- The Hill Breaker Walk registry delegates all eight approved Idle frames and
  contains 16 visually approved W1-W4 frames across four directions. It remains
  one internal family / one common variant / zero public families.
- The approved Steppe Hunter Walk registry delegates all eight approved Idle
  frames byte-for-byte and contains 16 visually approved W1-W4 frames across
  four directions. It remains one internal family / one common variant / zero
  public families and does not import into generic consumers.
- Giant uses the large-biped archetype, Centaur uses a true four-hoof hybrid
  archetype with readable withers joins, and Satyr uses the horned digitigrade
  archetype with tail, hocks, and split-hoof contacts.
- Current lifecycle ledger: three approved slices, zero implemented slices, and
  nineteen planned slices.
- The immutable `PUBLIC_ENEMIES` catalog appends the consumer-integrated
  EN-E01/EN-E02 families to the unchanged legacy entries and is the source for
  editor selectors, randomization, kits, packs, thumbnails, and exports.
- Approved EN-E01/EN-E02 frames now include the exact accepted repair pixels in
  the stable registry. The internal pre-repair comparison uses the same shared
  Form/outline algorithms without entering public consumers.
- The complete legacy 20-column corpus retains SHA-256 pixel digest
  `190a0f32b961b23fe0207c5a53fc005f9761666d27b15b98c0030325a10bef0c`.
- Effects, projectiles, summons, telegraphs, attachments, and environment
  states remain separate asset/runtime contracts; they are not baked into new
  actors to make a proposal appear complete.

## Current Boss Review State

The isolated Bosses workspace contains fourteen direction entries:

- twelve approved direction designs;
- Furious Depraved Rhino's repaired quadruped direction candidate; and
- Eclipse Unicorn Sovereign's direction candidate.

Ten entries have full 80-frame animation corpora. Seven are reviewed/accepted:

- Ancient Mirejaw
- Bone Reliquary King
- Scorpion Empress
- Cyclops Forge-Titan
- Pit-Fiend Juggernaut
- Cruel Catgirl Templar of the Brutes
- Divine Armored Templar Astro Knight

Three animation corpora remain candidates:

- Goblin War-Crown
- Furious Depraved Rhino
- Gunslinger Boar Rider

Lava-Core Colossus, Abyssal Crown-Kraken, and Sun-Crown Griffin remain approved
static fallbacks; Unicorn remains a static candidate. Do not start another Boss
animation or treat structural checks as visual acceptance. Boss state remains
ephemeral and outside Enemy mode, the 24x24 renderer, persistence, ordinary
packs, schemas, Production rolls, fixtures, and Windows builds.

## Delivered Wildshot NPC Slice

The completed `wildshot-npc-slice-v1@bf6269c` delivery contains 32 Player-built
NPC looks:

- 13 named roles;
- 10 zone quest-givers; and
- nine ambient villagers.

Artifact facts:

- native 1x `480x96` sheets using the public 20-column contract;
- 2,560 runtime frames across 32 full sheets;
- Form shading, no outline, Effects Off, no baked shadow, and binary alpha;
- 70 ZIP entries / 301,736 bytes;
- SHA-256
  `548e0c9608a190983ac9705b6e1c9c36f29c2390022ebe55d85dc74919c23607`;
- consumer intake was verified and recorded by planning; and
- manifest marks `publicGamePackRelease: false`.

The local ignored archive, contact sheet, and archive record remain under
`dist/`. This is a delivered NPC intake artifact, not 32 new assembler catalog
options and not the still-blocked `wildshot-assembler` public game pack.

## Pack-Publish Gate And Known Compatibility Gap

Pushed checkpoint `bf6269c` adds:

- `tools/pack-publisher.mjs`;
- `tools/export-established-boss-pack.mjs`;
- `tools/check-pack-publisher.mjs`;
- `npm run check:pack-publish`; and
- the frozen `established-boss-pack-13-v1` release identity.

The safety harness correctly tests dirty-tree refusal, pushed-HEAD discovery,
remote/auth/tag readiness, and GitHub release invocation. It does **not** prove
that the frozen roster exists in the current Boss catalogs.

The live compatibility audit found:

- missing direction entries: Royal Night Elf Prince, Living Pyre, Tide Man the
  Blue, and Dryad of Nature; and
- missing animation entries: those four plus Lava-Core Colossus, Abyssal
  Crown-Kraken, and Sun-Crown Griffin.

Therefore `npm run check:pack-publish` passing does not make
`npm run export:bosses:13` runnable or publishable. Do not invoke the publish
command until the roster contract is reconciled and a direct roster/asset gate
is added and passes. The already-delivered external Boss pack does not prove
reproducibility from this mainline command.

## Wildshot Public Game-Pack Boundary

The pure `wildshot-assembler` v1 actor contract and Cast/Death audit are
complete at `d6a56c1`, but the public game pack still refuses emission. It
requires:

- approved license text;
- the compact effect frame/anchor/direction contract;
- a deterministic writer;
- an editor action; and
- a consumer handoff slice.

The NPC slice and frozen Boss transport do not satisfy or bypass these refusal
conditions.

## Windows Artifact State

A current local standalone proof executable was built in the approved Briar
Reveler worktree at:

`C:\tmp\8-bit-sprite-assembler-en-e03-briar-reveler-attack\src-tauri\target\release\sprite-assembler.exe`

It was built on 2026-08-07 from exact pushed checkpoint
`4bea4102b0ddf94b020d5b7c66f1f9af806aab8f`, is 5,375,488 bytes, and has
SHA-256
`a303a0e83f54466d44dc312444e8f41883834f7d40b3ef01dd74bb87972502b4`.
The packaged Briar Reveler Attack module is byte-identical to source at SHA-256
`5500b1342ad448bd43e084ba2777554587807bf74839d9fc1d91444eb64b5288`
and retains the exact approved gate metadata. Windows release configuration
passes 35 assertions. A direct startup/render smoke opened the executable,
rendered the assembler UI with Effects Off visible, and remained responsive;
this is technical smoke evidence, not full packaged-smoke or release approval.

The executable is version `0.1.0`, unsigned, ignored, uncommitted, and not an
NSIS installer. No setup executable exists beneath this worktree's
`src-tauri/target/release/bundle/nsis/`; there is no approved Windows release
candidate. `npm run check:release -- --require-artifact` intentionally fails
because it requires the separate NSIS installer and is not satisfied by the
standalone proof. The older 2026-08-01 `bf6269c` proof remains historical only.

## Validation Evidence For This Handoff

Current focused validation from the isolated Briar Reveler Attack worktree on
2026-08-07:

```powershell
node --check engine/enemy-expansion-en-e03-satyr-attack.js
node --check tools/check-enemy-expansion-en-e03-satyr-attack.mjs
node --check tools/enemy-expansion-en-e03-satyr-attack-review.mjs
npm.cmd run review:enemy-expansion-en-e03-satyr-attack
npm.cmd run check:enemy-expansion-en-e03-satyr-attack
git diff --check
```

Current Briar Reveler Attack results:

- one internal family / one variant / 16 Attack frames;
- 16/16 connected hard-alpha body-and-staff silhouettes, planted split-hoof
  checks, distinct directional silhouettes, and one-cell margins;
- four distinct staff poses and at least three torso/hock/tail phases per
  direction, exact left/right mirroring, and distinct Down/Up depth silhouettes;
- all 8 approved Briar Reveler Idle and 16 approved Walk frames remain exact;
- Complete B adds 2,030 pixels and Form changes 1,922 source pixels;
- both deterministic `1950x870` board hashes and the 16-frame digest reproduce;
- both required labeled `192x224` four-direction GIFs use four `120ms` frames
  and reproduce the frozen hashes recorded above; and
- public EN-E03 families remain zero;
- after copying only the 965 missing ignored Boss review PNGs from the approved
  Steppe Hunter worktree, the full `npm.cmd run check` passes with the exact
  1,064-file corpus, including 57 legacy Enemy families / 202 variants, 16,160
  Enemy Form cases, 12,560 repaired-Enemy frame-safety cases, and all 232
  committed fixture sheets; and
- the exact raw and Complete B + Form GIF pair received direct designer approval
  on 2026-08-07 with `very good! approved`.

Current focused revalidation from the isolated Steppe Hunter Attack worktree on
2026-08-07:

```powershell
node --check engine/enemy-expansion-en-e03-centaur-walk.js
node --check engine/enemy-expansion-en-e03-centaur-attack.js
node --check tools/check-enemy-expansion-en-e03-centaur-attack.mjs
node --check tools/enemy-expansion-en-e03-centaur-attack-review.mjs
npm.cmd run check:enemy-expansion-en-e03-centaur-walk
npm.cmd run check:enemy-expansion-en-e03-giant-attack
npm.cmd run review:enemy-expansion-en-e03-centaur-attack
npm.cmd run check:enemy-expansion-en-e03-centaur-attack
git diff --check
```

Current Steppe Hunter Attack results:

- the focused gate passes one internal family / one variant / 16 Attack frames;
- all 16 frames are connected hard-alpha horse-rider-spear silhouettes with
  planted hoof contacts, one-cell margins, four distinct poses per direction,
  and true Down/Up depth attacks;
- every direction has at least three distinct horse-body weight phases and the
  left profiles are exact mirrors of the right profiles;
- all 8 approved Steppe Hunter Idle and 16 approved Walk frames remain exact;
- Complete B adds 1,752 outline pixels and Form changes 1,937 source pixels;
- candidate digest
  `c01f66be4c6afcaaa562073b85598b09eff0e8686ec0092296d95090883f77a0`
  and both generated PNG hashes reproduce the frozen values recorded above;
- both required labeled four-direction review GIFs are `192x224`, use four
  `120ms` frames, and reproduce the frozen SHA-256 values recorded above;
- public EN-E03 families remain zero;
- after copying only the 965 missing ignored Boss review PNGs from the approved
  Hill Breaker worktree, the full `npm.cmd run check` passes with the exact
  1,064-file local corpus, including 57 legacy Enemy families / 202 variants,
  16,160 Enemy Form cases, 12,560 repaired-Enemy frame-safety cases, and all
  232 committed fixture sheets; and
- direct visual acceptance is complete. The designer reviewed the exact labeled
  raw/no-outline and Complete B + Form four-direction GIFs together and said
  `Approved` on 2026-08-07.

Preserved approved revalidation from the isolated Hill Breaker Attack worktree on
2026-08-07:

```powershell
node --check engine/enemy-expansion-en-e03-giant-walk.js
node --check tools/check-enemy-expansion-en-e03-giant-walk.mjs
node --check tools/enemy-expansion-en-e03-giant-walk-review.mjs
npm.cmd run check:enemy-expansion-en-e03-giant-walk
npm.cmd run review:enemy-expansion-en-e03-giant-walk
node --check engine/enemy-expansion-en-e03-centaur-walk.js
node --check tools/check-enemy-expansion-en-e03-centaur-walk.mjs
node --check tools/enemy-expansion-en-e03-centaur-walk-review.mjs
npm.cmd run check:enemy-expansion-en-e03-centaur-walk
npm.cmd run review:enemy-expansion-en-e03-centaur-walk
node --check engine/enemy-expansion-en-e03-satyr-walk.js
node --check tools/check-enemy-expansion-en-e03-satyr-walk.mjs
node --check tools/enemy-expansion-en-e03-satyr-walk-review.mjs
npm.cmd run check:enemy-expansion-en-e03-satyr-idle
npm.cmd run check:enemy-expansion-en-e03-satyr-walk
npm.cmd run review:enemy-expansion-en-e03-satyr-walk
node --check engine/enemy-expansion-en-e03-giant-attack.js
node --check tools/check-enemy-expansion-en-e03-giant-attack.mjs
node --check tools/enemy-expansion-en-e03-giant-attack-review.mjs
npm.cmd run check:enemy-expansion-en-e03-giant-attack
npm.cmd run review:enemy-expansion-en-e03-giant-attack
npm.cmd run check
git diff --check
```

Current Hill Breaker Attack results:

- the focused gate passes one internal family / one variant / 16 Attack frames;
- all 16 frames are connected hard-alpha silhouettes with planted Giant contact,
  one-cell margins, four distinct poses per direction, and 16 distinct
  directional silhouettes;
- every direction has at least three distinct torso-and-hip motion phases;
- Down and Up each carry at least three distinct hip-and-upper-leg phases while
  both planted-foot anchors remain exact across all four phases;
- all 8 approved Hill Breaker Idle and 16 approved Walk frames remain exact;
- Complete B adds 1,469 outline pixels and Form changes 1,752 source pixels;
- candidate digest
  `1b5cade8a0a19babd00ed067010ecb98948891a7e4f6cd435adc53ae57cf78ab`
  and both generated PNG hashes reproduce the frozen values recorded above;
- both approved labeled four-direction review GIFs are `192x224`, use four
  `120ms` frames, and reproduce the SHA-256 values recorded above;
- public EN-E03 families remain zero;
- after copying the ignored Boss review PNG corpus from the preserved Satyr
  worktree, the full gate passes with exactly 1,064 Boss review PNGs, including
  57 legacy Enemy families / 202 variants, 16,160 Enemy Form cases, 12,560
  repaired-Enemy frame-safety cases, and all 232 committed fixture sheets; and
- direct visual acceptance is complete on the exact labeled raw and Complete B
  + Form animations with `Very good approved` on 2026-08-07.

Approved Briar Reveler Walk results:

- the focused gate passes one internal family / one variant / 16 Walk frames;
- all 16 frames are connected hard-alpha horned silhouettes with valid
  split-hoof ground contacts and 12 distinct silhouettes; only the deliberate
  W2/W4 passing pose is shared in each direction;
- all eight approved Briar Reveler Idle frames remain exact;
- every Up frame covers the inherited front-expression pixel so the rear head
  no longer reads as showing a side eye;
- Complete B adds 1,913 outline pixels and Form changes 2,047 source pixels;
- candidate digest
  `409b08eb3bd121dec5e8234c49e2fe11d374b73bf501648852adae2ae4ab5755`
  and both generated PNG hashes reproduce the frozen values recorded above;
- both four-frame review GIFs reproduce the exact dimensions, `0.67s` loop,
  and SHA-256 values recorded above;
- public EN-E03 families remain zero;
- after copying the 965 missing ignored Boss review PNGs from the preserved
  Steppe worktree, the full gate passes in this fresh worktree with the exact
  1,064-file corpus, including 57 legacy Enemy families / 202 variants, 16,160
  Enemy Form cases, 12,560 repaired-Enemy frame-safety cases, and all 232
  committed fixture sheets; and
- direct visual acceptance is complete on the corrected raw and Complete B +
  Form animations with `greeat lets move on`.

Preserved Steppe Hunter Walk results:

- the focused gate passes one internal family / one variant / 16 Walk frames;
- all 16 frames are connected hard-alpha hybrid silhouettes with two planted
  hoof contacts and
  12 distinct silhouettes; only the deliberate W2/W4 passing pose is shared in
  each direction;
- all eight approved Steppe Hunter Idle frames remain exact;
- Complete B adds 1,970 outline pixels and Form changes 2,084 source pixels;
- the candidate digest and both generated PNG hashes reproduce the frozen
  values recorded above;
- public EN-E03 families remain zero;
- an initial full `npm.cmd run check` in the fresh worktree stopped only at the
  Boss direction and animation subprocesses because ignored local review
  checkpoints were absent;
- after copying only the 965 missing ignored Boss review PNGs from the preserved
  main-worktree corpus, the same full gate passed, including 57 legacy Enemy
  families / 202 variants, 16,160 Enemy Form cases, 12,560 repaired-Enemy
  frame-safety cases, and all 232 committed fixture sheets; and
- the clean-clone behavior remains a separate unresolved candidate at
  `125b0b3`; this Steppe lane does not adopt or validate that code change.

These results establish structural reproducibility. The designer separately
approved the exact Steppe Hunter raw and Complete B + Form animations on
2026-08-06. Hill Breaker and Steppe Hunter Walk are both hash-frozen.

Historical revalidation through the approved Idle checkpoint from the active
EN-E03 worktree on 2026-08-04:

```powershell
npm.cmd run check:enemy-expansion-repairs
npm.cmd run check:enemy-expansion-en-e02-consumers
npm.cmd run check:enemy-expansion-en-e03
npm.cmd run review:enemy-expansion-en-e03
npm.cmd run check:enemy-expansion-en-e03-calibration
npm.cmd run review:enemy-expansion-en-e03-calibration
npm.cmd run check:enemy-expansion-en-e03-giant-idle
npm.cmd run review:enemy-expansion-en-e03-giant-idle
npm.cmd run check:enemy-expansion-en-e03-centaur-calibration
npm.cmd run review:enemy-expansion-en-e03-centaur-calibration
npm.cmd run check:enemy-expansion-en-e03-centaur-idle
npm.cmd run review:enemy-expansion-en-e03-centaur-idle
npm.cmd run check:enemy-expansion-en-e03-satyr-calibration
npm.cmd run review:enemy-expansion-en-e03-satyr-calibration
npm.cmd run check:enemy-expansion-en-e03-satyr-idle
npm.cmd run review:enemy-expansion-en-e03-satyr-idle
npm.cmd run check
git diff --check
```

Current results:

- the approved repair, cumulative public-consumer, and isolated EN-E03 gates
  pass;
- the rejected v2 raw and Complete B + Form artifacts reproduce their frozen
  SHA-256 values and 24-frame digest exactly;
- both historical EN-E03 v1/v2 implementations remain visually rejected;
- the approved Hill Breaker F1 board reproduces both frozen SHA-256 values and
  its four-frame digest exactly, while the approved F1/F2 board reproduces both
  frozen SHA-256 values and its eight-frame digest exactly;
- the approved Steppe Hunter F1 board reproduces both frozen SHA-256 values and
  its four-frame digest exactly, with four connected hybrid silhouettes and four
  separated hoof contacts in every direction;
- the approved Steppe Hunter F1/F2 board reproduces both frozen SHA-256 values
  and its eight-frame digest exactly; all four approved F1 frames and their
  contact rows remain exact while four accepted F2 poses retain connected hybrid
  silhouettes and four separated hoof contacts;
- the approved Briar Reveler F1 board reproduces both frozen SHA-256 values and
  its four-frame digest exactly, with four connected horned
  digitigrade silhouettes and four split-hoof contact tips per direction;
- the approved Briar Reveler F1/F2 board reproduces both frozen SHA-256 values
  and its eight-frame digest exactly; all four approved F1 frames remain exact
  while four accepted F2 poses retain connected horned digitigrade silhouettes
  and four split-hoof contact tips;
- full project validation passed all catalog, renderer, animation, outline,
  shade, expansion, equipment, Boss, pack, release-configuration, and 232 PNG
  fixture gates before the later Hill Breaker Walk candidate was added;
- the bounded Hill Breaker, Steppe Hunter, and Briar Reveler F1/F2 source
  changes introduce no legacy fixture, schema, public catalog, consumer,
  effect, release-artifact, or archived-review change; and
- `git diff --check` passes.

The 2026-08-06 focused and corpus-complete full-suite results above supersede the
older pre-Walk limitation. They do not supersede the visual approval gate.

Historical base validation from the canonical main worktree on 2026-08-02:

```powershell
npm.cmd run check
npm.cmd run check:pack-publish
npm.cmd run check:release
git diff --check
```

Recorded results before commit:

- full project validation passed;
- 57 Enemy families / 202 variants;
- 16,160 Enemy None-parity cases;
- 3,232 Enemy Cast aliases and 3,232 Enemy Death aliases;
- 16,160 exhaustive Enemy Form cases;
- 12,560 repaired-Enemy frame-safety cases;
- 232 legacy fixture sheets validated;
- pack publisher harness passed eight assertion groups; and
- Windows release configuration passed 35 assertions; the current standalone
  proof was built and startup/render-smoked, while no NSIS installer artifact
  was found or claimed.

The documentation audit additionally verifies:

- all 80 proposals occur exactly once in the expansion accounting;
- EN-F00, EN-E01 through EN-E18, and EN-B01 through EN-B03 are present;
- the handoff names the expansion plan as the active lane authority;
- current Boss counts match the live catalogs;
- the NPC archive hash matches its archive record; and
- the current standalone executable and packaged Briar module hashes match the
  recorded values.

Historical EN-E01/EN-E02 approval evidence, inherited unchanged by the EN-E03
branch, was run from the isolated EN-E02 worktree on 2026-08-02:

```powershell
npm.cmd run check:enemy-expansion
npm.cmd run check:enemy-expansion-en-e01
npm.cmd run check:enemy-expansion-en-e01-full
npm.cmd run check:enemy-expansion-en-e01-registration
npm.cmd run check:enemy-expansion-en-e01-consumers
npm.cmd run check:enemy-expansion-en-e02
npm.cmd run check:enemy-expansion-en-e02-full
npm.cmd run check:enemy-expansion-en-e02-registration
npm.cmd run check:enemy-expansion-en-e02-registration:artifacts
npm.cmd run check:enemy-expansion-en-e02-consumers
npm.cmd run review:enemy-expansion-en-e01
npm.cmd run review:enemy-expansion-en-e01-full
npm.cmd run review:enemy-expansion-en-e02
npm.cmd run review:enemy-expansion-en-e02-full
npm.cmd run check
git diff --check
```

Recorded expansion results through the rejected EN-E03 v2 technical gate:

- the focused foundation gate passes its registry, ledger, renderer-key,
  review-targeting, sheet-contract, and negative-path assertions;
- all 57 legacy families / 202 sheets / 16,160 frames match the locked pixel
  digest above;
- EN-E01's frozen pre-registration Idle gate passes five immutable contract cards, five internal
  common baselines, 40 deterministic Idle frames, four-direction/two-frame
  ordering, hard alpha, one-cell margins, no clipping, distinct silhouettes,
  and zero public-family exposure;
- candidate frame digest:
  `339c5ff809d3b17aec20b3ec953c8217470cde026fc743cde0cd3854ed5c3323`;
- exact review PNG SHA-256:
  `2d710ab54a845c4805d428c428cfa9e1cda09f4adee886c5deafbafee831b7ee`;
- EN-E02's approved common-only Idle gate passes five immutable cards, five
  internal variants / 40 deterministic Idle frames, four-direction ordering,
  hard alpha, one-cell margins, distinct silhouettes, mirrored side occupancy,
  and zero EN-E02 consumer exposure from the frozen snapshot;
- EN-E02 candidate frame digest:
  `00d71d7e8f1904c275bfe84ec6cec746fb314fab4d27ce182d72e286a846d02b`;
- EN-E02 review PNG SHA-256:
  `c224258139c7c810c7a122ea9e95061f3dd1697864913765fe9d11e09f4eca50`;
- EN-E02's full private gate passes five implemented families / 15 variants, 15
  complete `480x96` sheets, all 1,200 frames, deterministic full motion,
  Cast-to-Attack and Death-to-Hurt aliases, hard alpha, strict margins,
  within-family silhouette distinction, exact approved-Idle preservation, and
  zero approved families in the frozen pre-registration candidate view;
- the private presentation proof passes 2,400 Complete B/Selective C outline
  cases and 3,600 Form-with-None/B/C cases, adding 103,077 Complete B and 81,840
  Selective C pixels while preserving 77,597 protected pixels;
- EN-E02 full candidate frame digest:
  `f4667a1ccefb3026c6df3604e114393fdaae619dab0c68bec969203986cb35bf`;
- EN-E02 full overview PNG SHA-256:
  `21f3175600377eaf75206f9fcb65856731da28eafb6715687821f782f41da6a8`;
- EN-E02 Complete B/Form presentation PNG SHA-256:
  `211e9ace3eb965f243724249c73927567568e2f22f181f5448ba398ddab4a094`;
- EN-E02 motion-board SHA-256 values: Catfolk
  `c73d0b7b2ffea9c8a5aa061460403b4cfa66099b3ed66baef950872bf4bd8c2c`,
  Desert Raider
  `a5102c40d41c9bd69aecc9940f5ac42e208fdfc9a215ea8998c73010ebe523e9`,
  Fanatic Monk
  `d248943af3fe590a396de3610891f494da2ee3ed79b1d29f48140595a0549441`,
  Goatfolk
  `ea3348595aa761695e2419b6656631e2f760c81948aa1c481f0999455e423e83`,
  and Plague Doctor
  `039efe503a31888ec23a0855838f6a46deb79ddc0676befaca4f2bbb6fac7c5b`;
- EN-E02 review JSON SHA-256:
  `0a135fbed3eeeaf69400a3700d113af67a0c2a75043f95ab2a392711cd6b0afa`;
- the designer approved that exact completed-slice evidence and bounded
  registration checkpoint `7b6e448` composes ten approved EN-E01/EN-E02
  families / 30 variants through the stable registry;
- the EN-E02 registration gate locks the overview, Complete B/Form
  presentation, review manifest, reviewed implementation commit, Idle digest,
  and full digest; verifies 15 registered `480x96` sheets and exact
  candidate/registered parity across all 1,200 frames. At registration checkpoint
  `7b6e448`, the consumer registry remained EN-E01-only and `PUBLIC_ENEMIES`
  remained 62/217; that is preserved as historical gate evidence;
- clone-safety checkpoint `be44af7` passes the default registration gate in a
  fresh detached worktree without ignored artifacts, while strict artifact mode
  correctly rejects their absence; the local strict run re-hashes all three
  reviewed files successfully;
- the frozen EN-E01 pre-registration full gate passes five internal families / 15 variants, 15 complete
  `480x96` sheets, all 1,200 frames, deterministic direction and motion,
  Cast-to-Attack and Death-to-Hurt aliases, hard alpha, strict margins, and zero
  public families;
- full candidate frame digest:
  `addcf8055a80a0a6266be0eff8cd6b8235092c6ba366bc9c020bd5feb90ae173`;
- full overview PNG SHA-256:
  `0b38f2737b5215d37a08e0ae3f7e25f82e88bb17a97641e33b0ee9ef9c0e8fb7`;
- motion-board SHA-256 values: Witch
  `a6a15cba3fbbcf342533491836a700fdbb5965301e6872d2e07c9535c249c0a9`,
  Fallen Knight
  `6e688f2f3da3781608d555510d85be08b3df6b7a8e06cdc4e48937247de186b5`,
  Pirate
  `4aa570b3f52866d42814950677ca6c65346f4a458552041e021ec1b6c16ab81a`,
  Necromancer
  `379efc15f29ed991ac307308038bbcdbf2802e6cdc12015a8be3668413379abe`,
  and Alchemist
  `c07fe982683926583336062a5a97040cf038b6d592bccf9aafeb390bb2010056`;
- review JSON SHA-256:
  `129f3f2b81318df08edf2b0b1dc2183fc8494450027e91ceea04a2248208e398`;
- all review artifacts are ignored evidence; internal native/4x/Aseprite
  inspection accepted the candidate and the designer approved the completed
  slice;
- the registration gate passes five approved/public families, 15 variants, 15
  complete `480x96` sheets, stable-facade routing, current
  three-approved/zero-implemented/nineteen-planned lifecycle counts, and exact
  public/candidate parity across all 1,200 frames;
- the cumulative EN-E01/EN-E02 consumer gate passes unchanged 57/202 legacy
  locks, immutable 67/232 public composition, editor persistence/selectors,
  randomization, combat defaults, Complete Kits, Wildshot validation,
  thumbnails, all export scopes, 2,400/2,400 adapter frames, 30/30 native full
  sheets, 7,200 source-preserving None/B/C outline cases, and 7,200
  deterministic Form/outline cases with all 180 renderer palette colors
  resolved. The historical pre-repair aggregate remains 207,162 Complete B
  pixels, 164,487 Selective C pixels, 174,917 source-owned Form changes, and
  146,687 protected pixels. The accepted stable/consumer repair aggregate is
  207,356 Complete B,
  163,843 Selective C, 175,878 Form changes, and 145,528 protected pixels;
- `check:enemy-expansion-repairs` passes 1,680 affected-family frames, exactly
  18 authorized renderer-data changes, alternating stride extremes, at least
  three distinct foot-contact silhouettes per Walk direction, binary alpha,
  one-cell margins, zero clipping, and every reported seam coordinate;
- repair motion boards and native sheets exist under
  `enemy-expansion-review/repair-candidate/`; affected-family digest
  `c24f36eac5dedd10a1c931b7d59b52f379c3113e4c80fb8aa73bc71514e1e7c8`;
- live browser smoke advances Walk frames 1-4 for all seven reported baseline
  variants at 20x with Complete B and Form active;
- EN-E03 v1 checkpoint `50ad516bdf338842e47ae9c22cd7cd293adef498`
  and its original hashes remain rejected historical evidence; v2 checkpoint
  `6104eaedce62c4514cdd5061bd58c8c79eeb0341` freezes the second rejected
  implementation after the designer found it still far from the established
  roster style;
- `check:enemy-expansion-en-e03` passes all 24 Giant/Centaur/Satyr common Idle
  frames, one connected silhouette per frame, binary alpha, one-cell margins,
  zero clipping, exact side mirroring, distinct direction/family silhouettes,
  2,916 Complete B additions, and 2,579 Form-shaded source pixels;
- EN-E03 raw artifact SHA-256 is
  `059f7c4945cffacf4e53e2d9435566479adf08ec754ed8f0faca520958908aa2`,
  Complete B + Form artifact SHA-256 is
  `2835b044868cd948fbb7327675f5821adfe499507a08d0e8350f83cff5e2ab89`,
  and the locked 24-frame digest is
  `8339d3d4a2380f8e9d9bf6ecb3fa1a5f0faddafc0bf6ce43c3ce12c515a1a059`;
- EN-E03 remains internal at three rejected common variants / zero public
  families, with
  specialist/elite data, later motion, registration, consumers, effects, and
  release explicitly absent;
- the approved Hill Breaker F1 calibration raw artifact SHA-256 is
  `4dae138234132d6249f36783dcb753716e6556791051c60c7ef92d6e73956e95`,
  its Complete B + Form SHA-256 is
  `70fce189859c2c86d102b2db9f3b3ea5bac47b9f5f32c172adc70a612eafa605`,
  and its four-frame digest is
  `019ec9d11daac3d626d1c33693dc707ba98c6ade1c7647f82a5dc5a5a7fa2602`;
- `check:enemy-expansion-en-e03-giant-idle` validates the approved F1/F2 lane at
  eight connected hard-alpha frames, exact preservation of all four approved F1
  frames and their bottom contact rows, 726 Complete B additions, 852
  Form-shaded source pixels, and zero public families;
- the approved Hill Breaker F1/F2 raw SHA-256 is
  `21cb2a314b6fa5866ea4d708570513506c69c02befca739338df1b908fefc686`,
  its Complete B + Form SHA-256 is
  `2bcad3208b2571764f1938f0be52383d1cb4128a191b74ed7d669fd8e8c48faf`,
  and its eight-frame digest is
  `2ae3904669508afbabed0742d72d4d334f37cdee360ba4f4d1a11767d22ee5ab`;
- `check:enemy-expansion-en-e03-centaur-calibration` validates four connected
  Steppe Hunter F1 hybrid silhouettes, four separated hoof contacts per
  direction, exact mirrored side profiles, hard alpha, one-cell margins, 511
  Complete B additions, 550 Form-shaded source pixels, and zero public families;
- the approved Steppe Hunter F1 raw SHA-256 is
  `f4c462ffd9242684d7335c28c238db0fb59cecd5e168f069da03cc6f40753480`,
  its Complete B + Form SHA-256 is
  `dc7ccd766c736dcb1581b817f950b6be8541bacb26411c2281a42535bbf82f52`,
  and its four-frame digest is
  `53ea78549da26eccc2b8292672f693384d8551660d68bdd5e3827bb1d21f55cb`;
- `check:enemy-expansion-en-e03-centaur-idle` validates the approved F1/F2 lane
  at eight connected hard-alpha hybrid frames, exact preservation of all four
  approved F1 records and bottom contact rows, four separated hoof contacts in
  every frame, exact mirrored profiles, 1,016 Complete B additions, 1,068
  Form-shaded source pixels, and zero public families;
- the approved Steppe Hunter F1/F2 raw SHA-256 is
  `256b9be67407ada1caad58b6dc68d426ecbeb73b5f2032f13187e337d900c235`,
  its Complete B + Form SHA-256 is
  `e98d2e7d570c8777238cb187caaac15caff9c9000af0b322c651623e8e0ff7dd`,
  and its eight-frame digest is
  `3c88471b25fc27397a0a11d6495cd27c641a6715ff33429f5d0d2c81f184ae49`;
- `check:enemy-expansion-en-e03-centaur-walk` validates the approved Steppe Walk
  lane at 16 connected hard-alpha hybrid frames, exact preservation of all
  eight approved Idle frames, two planted hoof contacts, three contact poses
  per direction with W2/W4 shared, exact mirrored profiles, 1,970 Complete B
  additions, 2,084 Form-shaded source pixels, and zero public families;
- the Steppe Hunter Walk raw SHA-256 is
  `b64b73f0bc90c35be428dbf49cc948576fc06575c28af36e286bd34079268269`,
  its Complete B + Form SHA-256 is
  `76503340798a738086cf8c001529c71aa80a3f8890ad55d6eb40a5e198e20a98`,
  and its 16-frame digest is
  `8fa70b11dd34ae5643c709ff1082b84f61e36a1f3fa6110689f47fee864c433e`;
- `check:enemy-expansion-en-e03-satyr-calibration` validates the approved Briar
  Reveler F1 lane at four connected hard-alpha horned digitigrade frames, four
  split-hoof contact tips per direction, exact mirrored side profiles, 559
  Complete B additions, 535 Form-shaded source pixels, and zero public families;
- the approved Briar Reveler F1 raw SHA-256 is
  `1272f52186c4f0df8666e845392eec6338d31aa161222d2064ed27625acc4405`,
  its Complete B + Form SHA-256 is
  `aa516c5d4e53b7d89b8dc2a935f7d41c8e36260950b771b8f094093e4fd9a5a1`,
  and its four-frame digest is
  `b8335de4e6794e84de0be10a3c437fab024db8310262e1c1deb484bd6b9add6b`;
- `check:enemy-expansion-en-e03-satyr-idle` validates the approved F1/F2 lane at
  eight connected hard-alpha horned digitigrade frames, exact preservation of
  all four approved F1 frames, four split-hoof contact tips in every frame, exact
  mirrored profiles, 356 changed F2 alpha pixels, 1,026 Complete B additions,
  1,072 Form-shaded source pixels, and zero public families;
- the approved Briar Reveler F1/F2 raw SHA-256 is
  `8d3a960d62683e19694e28572f15117314fde9ccb7dd898ea9065d64da058204`,
  its Complete B + Form SHA-256 is
  `4257e63a25a23631ff861b3752e03da0897a6ceaf5ef8cef6efccbd575f6b51e`,
  and its eight-frame digest is
  `0d5599dcd452351903e5d56289596d2e75f59caf5c0b7a5525c7e375c39b36fa`;
- the full project validator passes with all existing catalog, renderer,
  outline, Form-shade, Cast/Death alias, equipment, Boss, 232-fixture, pack,
  and release-configuration gates unchanged; and
- no legacy fixture, schema version, Boss asset, release artifact, or archived
  review payload is modified; the exact visually accepted repair registry
  remains the only public replacement. Historical EN-E03 v1/v2 stay isolated
  rejected evidence, while the approved Hill Breaker and Steppe Hunter F1/F2
  lanes and approved Briar Reveler F1/F2 lane are also internal.

## Documentation Audit Result

The historical 2026-08-03/04 audit covered all 20 tracked Markdown documents.
The 2026-08-06 post-cleanup reconciliation compared its five active documents
with live refs/worktrees and preservation commit `8ea019b`. The 2026-08-07
continuation then reconciled the same five documents with all three common Walk
approvals,
the approved Hill Breaker Attack baseline, exact focused output, the
fresh-worktree Boss-corpus boundary, and the corpus-complete full-suite pass.

Current-facing drift was corrected in exactly these five documents:

- `README.md` — records all three approved Walk baselines plus the approved Hill
  Breaker and Steppe Hunter Attack commands/results;
- `ARCHITECTURE.md` — records exact Idle/Walk delegation, the private
  horse-rider-spear boundary, focused gate, and continued facade isolation;
- `ROADMAP.md` — records both bounded Attack approvals and the consolidated
  published approval branch;
- `ENEMY_EXPANSION_PLAN.md` — records the exact approved Steppe hashes, focused
  gate, exclusions, and closed dual-GIF visual-review boundary; and
- `HANDOFF.md` — reconciles worktrees, refs, validation, clean-clone caveat,
  frozen boundaries, and new-chat state.

The earlier audit had also reconciled these historical/current-routing docs;
they remain unchanged in this five-file pass:

- `EQUIPMENT_OUTLINE_ASSESSMENT.md`, `EQUIPMENT_READABILITY_PLAN.md`,
  `WEAPON_READABILITY_PLAN.md`, and `TRANSPARENT_TILE_REPAIR_PLAN.md` — retain
  their historical evidence while removing obsolete claims that shade work is
  still next;
- `PRODUCTION_ROLL_PLAN.md` — distinguishes the consolidated baseline worktree
  from later isolated slice worktrees; and
- `asset-pack/README.md` — explicitly labels the 232 committed PNGs as the
  locked historical 12-column fixture corpus rather than current 20-column
  exports.

No current-state correction was required in the remaining documents:

- `COMPATIBLE_REROLL_PLAN.md`;
- `DEATH_ANIMATION_PLAN.md`;
- `ENEMY_OUTLINE_PLAN.md`;
- `GAME_PACK_EXPORT_PLAN.md`;
- `OFFHAND_ITEMS_PLAN.md`;
- `OUTLINE_RENDERING_PLAN.md`;
- `SHADE_RENDERING_PLAN.md`;
- `WINDOWS_RELEASE.md`; or
- `death-review/boss-48-drafts/README.md`.

Older branch names, interim counts, and 12-column measurements remain only
where their sections explicitly identify them as historical evidence. The
active implementation and approval authority remains `ENEMY_EXPANSION_PLAN.md`
plus this handoff. All five active documents now agree: Hill Breaker, Steppe
Hunter, and Briar Reveler Walk are approved, hash-frozen, internal, and
non-public. Hill Breaker common Attack A1-A4 is also approved, hash-frozen,
internal, and non-public. Steppe Hunter common Attack A1-A4 is also approved,
hash-frozen, internal, and non-public. Their exact bounded state is published
through `codex/en-e03-steppe-hunter-attack`. Briar Reveler common Attack A1-A4
is also approved, hash-frozen, internal, and non-public; its exact bounded state
is published through `codex/en-e03-briar-reveler-attack`. Hill Breaker Hurt
H1-H2 is also approved, hash-frozen, internal, and non-public; its exact bounded
state is published through `codex/en-e03-hill-breaker-hurt`. Steppe Hunter Hurt
H1-H2 is also approved, hash-frozen, internal, and non-public; its exact bounded
state is published through `codex/en-e03-steppe-hunter-hurt`. No later EN-E03
gate is authorized, and no public registry changed.

## Frozen Boundaries

Unless the designer explicitly changes scope:

- preserve the exact approved common-baseline Idle and completed-slice pixels in
  the stable registry;
- preserve the merged 67-family / 232-variant `PUBLIC_ENEMIES` consumer
  boundary without mutating the locked legacy `ENEMIES` array;
- do not pre-register unfinished families, IDs, variants, selectors, or packs;
- preserve the approved seven-family repair registry and its pre-repair
  comparison evidence;
- treat EN-E03 v1 and v2 as rejected historical evidence, not approved style
  references or candidates to extend;
- preserve the exact approved Hill Breaker F1/F2 Idle hashes and pixels;
- preserve the exact approved Hill Breaker Walk W1-W4 hashes and pixels;
- preserve the exact approved Steppe Hunter F1/F2 Idle hashes and pixels;
- preserve the exact approved Steppe Hunter Walk W1-W4 hashes and pixels;
- preserve the exact approved Briar Reveler F1/F2 Idle hashes and pixels;
- preserve the exact approved Briar Reveler Walk W1-W4 hashes and pixels;
- preserve the exact approved Hill Breaker common Attack A1-A4 hashes and
  pixels while keeping approved Idle and Walk byte-for-byte;
- preserve the exact approved Steppe Hunter common Attack A1-A4 hashes, pixels,
  and raw/Complete B + Form review evidence while keeping approved Idle and
  Walk byte-for-byte;
- preserve the exact approved Briar Reveler common Attack A1-A4 hashes, pixels,
  and raw/Complete B + Form review evidence while keeping approved Idle and
  Walk byte-for-byte;
- preserve the exact approved Hill Breaker H1-H2 hashes, pixels, and dual-GIF
  review evidence together with all 40 delegated approved Idle/Walk/Attack
  frames;
- preserve the exact approved Steppe Hunter Hurt H1-H2 hashes, pixels, and
  dual-GIF review evidence together with all 40 delegated approved
  Idle/Walk/Attack frames;
- do not begin other Hurt, other Giant/Centaur/Satyr motion, Cast, Death,
  variants, registration, consumers, effects, release, or any later EN-E03
  work without another explicit gate;
- do not modify the archived `wip/19-boss-review` checkout;
- do not accept the Rhino/Unicorn direction candidates or the three animation
  candidates without direct visual review;
- do not start Hydra, Chimera, Roc, or another Boss animation in parallel;
- do not resume or alter the legacy effect compositor;
- do not bake effects, projectiles, summons, or environment states into actor
  sheets;
- do not rewrite fixtures or visual baselines;
- do not invoke the incompatible 13-Boss publish command;
- do not call the standalone executable a release candidate; and
- do not change actor geometry, animation timing/order, stable IDs, public
  schemas, or the 20-column sheet contract incidentally.

## New-Chat Opening

The safest opening request for the next chat is:

> EN-E01 and EN-E02 are approved, registered, consumer-integrated, and include
> the visually accepted 2026-08-03 seven-family repair. Verify the clean synced
> branch and exact 67/232 stable/public boundary. EN-E03 v1 at `50ad516` and v2
> at `6104eae` were both visually rejected and remain historical. The later
> four-direction Hill Breaker F1/F2 Idle baseline is visually approved and hash
> frozen. The four-direction Steppe Hunter F1/F2 Idle baseline is also visually
> approved and hash frozen. The Briar Reveler F1/F2 Idle baseline was visually
> approved on 2026-08-04 and is also hash frozen. All three baselines remain
> internal and non-public. Hill Breaker common Walk W1-W4 was visually approved
> on 2026-08-06 and remains hash frozen. Steppe Hunter common Walk W1-W4 was
> also visually approved on 2026-08-06 after exact raw and Complete B + Form
> animation review; its approved Idle remains delegated exactly. The designer
> then said `awesome lets do next`, authorizing only Briar Reveler common Walk
> W1-W4. Its corrected rear view was visually approved on 2026-08-06 with
> `greeat lets move on`; the approved baseline remains internal and non-public,
> and its exact content is published through the consolidated Steppe Hunter
> Attack branch. That approval authorized only Hill Breaker common
> Attack A1-A4 across four directions while preserving approved Idle and Walk
> byte-for-byte. Its exact
> labeled four-direction raw and Complete B + Form animations were visually
> approved on 2026-08-07 with `Very good approved`. The designer then said
> `Cool let's keep going`, authorizing only Steppe Hunter common Attack A1-A4.
> Resume `codex/en-e03-steppe-hunter-attack` in
> `C:\tmp\8-bit-sprite-assembler-en-e03-steppe-hunter-attack`; its focused
> gate, deterministic boards, and labeled all-four-direction raw/Complete B +
> Form GIFs pass. The designer reviewed both exact GIFs together and said
> `Approved` on 2026-08-07. The approved branch is committed and pushed under
> the approval-publication contract. The designer then said `lets keep going`,
> authorizing only Briar Reveler common Attack A1-A4. Resume
> `codex/en-e03-briar-reveler-attack` in
> `C:\tmp\8-bit-sprite-assembler-en-e03-briar-reveler-attack`; its focused gate,
> deterministic boards, and labeled all-four-direction raw/Complete B + Form
> GIFs pass. The designer reviewed both exact GIFs together and said `very good!
> approved` on 2026-08-07. The bounded approval branch is committed and pushed.
> The designer then agreed to continue the 80 plan and accepted the explicitly
> proposed Hill Breaker Hurt H1-H2 scope with `lets go for it`. Resume
> `codex/en-e03-hill-breaker-hurt` in
> `C:\tmp\8-bit-sprite-assembler-en-e03-hill-breaker-hurt`, based exactly on
> `68d913ccfd00f76f15dcac308338c9e686a4f171`. Its focused gate preserves all
> 40 approved Idle/Walk/Attack frames, validates 8 connected distinct Hurt
> frames, and its labeled all-four-direction raw and Complete B + Form GIFs are
> ready together. The designer reviewed both exact GIFs together and said
> `approved` on 2026-08-07. The bounded approval branch is committed and pushed.
> The designer then said `nice lets do nexrt`. Resume the explicitly bounded
> Steppe Hunter Hurt H1-H2 baseline on
> `codex/en-e03-steppe-hunter-hurt` in
> `C:\tmp\8-bit-sprite-assembler-en-e03-steppe-hunter-hurt`, created exactly
> from approved pushed checkpoint
> `3e0d98bd48b30cd6ddf35cbd87b424c3c3fd3b5c`. Its focused gate preserves all
> 40 approved Idle/Walk/Attack frames, validates eight connected distinct
> horse-rider-spear Hurt frames with fixed four-hoof anchors and exact side
> mirroring, and its labeled all-four-direction raw and Complete B + Form GIFs
> are ready together. The designer reviewed both exact GIFs together and said
> `approved` on 2026-08-07. The bounded approval branch is committed and pushed.
> The designer then said `awesome lets do next`, authorizing the explicitly
> bounded Briar Reveler Hurt H1-H2 lane. Resume
> `codex/en-e03-briar-reveler-hurt` in
> `C:\tmp\8-bit-sprite-assembler-en-e03-briar-reveler-hurt`, based exactly on
> approved pushed checkpoint `374d0b73c171c9f9f35b6d71f2f9e85f4dcdd7c1`.
> Its focused and full gates pass and both exact labeled raw and Complete B +
> Form GIFs were approved with `approved lets do next` on 2026-08-07. The
> bounded branch is committed and pushed. The separate common alias gate on
> `codex/en-e03-cast-death-aliases` maps Cast to Attack A1-A4 and Death to Hurt
> H1,H2,H2,H2 with zero new pixels/public families. The designer reviewed all
> four exact labeled three-family/all-direction raw and Complete B + Form GIFs
> together and said `approved` on 2026-08-07. Its focused/full gates pass and
> pushed checkpoint `d3f78f7fc924123a95c6dc140e5288525bf3f322` is the exact
> approved alias checkpoint; the reconciled handoff checkpoint is
> `8fff98f775687a6d0d07b5b9e58a7ec57e1988dd`. The designer then said `good
> lets do next`. The bounded Boulder Hurler two-frame Idle baseline on
> `codex/en-e03-boulder-hurler-idle` in
> `C:\tmp\8-bit-sprite-assembler-en-e03-boulder-hurler-idle`. Its focused gate
> preserves 8/8 approved Hill Breaker Idle frames and validates 8/8 connected
> hard-alpha candidate frames, exact side mirrors, one-cell margins, zero baked
> projectile pixels, and zero public families. The designer reviewed both exact
> improved labeled all-four-direction raw and Complete B + Form GIFs together
> and said `approved` on 2026-08-07. The bounded branch is committed and pushed.
> Do not add other variants or animation, register, integrate, add effects,
> release, or begin later work without separate explicit authorization.

EN-F00, EN-E01, EN-E02, and the seven-family repair are approved. The stable and
consumer registries are the same ten-family / 30-variant repaired object through
67 public families / 232 variants; the pre-repair pixels remain internal
evidence. EN-E03 contract cards and two common-only Idle attempts exist, but
both full art passes are visually rejected. The separate Hill Breaker F1
calibration and F2-only continuation form the visually approved internal
two-frame Idle baseline. Steppe Hunter F1 and its F2-only continuation form a
second visually approved internal two-frame Idle baseline. Briar Reveler F1 and
its F2-only continuation form the third visually approved internal two-frame
Idle baseline. Hill Breaker four-direction/four-frame Walk is also visually
approved, hash-frozen, internal, and non-public. Steppe Hunter
four-direction/four-frame Walk is likewise visually approved, hash-frozen,
internal, and non-public. Briar Reveler four-direction/four-frame Walk is also
visually approved, hash-frozen, internal, and non-public after the corrected
rear-view review. Hill Breaker common Attack A1-A4 is also visually approved,
hash-frozen, internal, and non-public. Steppe Hunter common Attack A1-A4 is
likewise visually approved, hash-frozen, internal, and non-public. Briar Reveler
common Attack A1-A4 is likewise visually approved, hash-frozen, internal, and
non-public. Hill Breaker Hurt H1-H2 is also visually approved, hash-frozen,
internal, and non-public. Steppe Hunter Hurt H1-H2 is also visually approved,
hash-frozen, internal, and non-public. Briar Reveler Hurt H1-H2 and the common
Cast/Death aliases are also visually approved, hash-frozen, internal, and
non-public. The bounded Boulder Hurler Idle F1-F2 baseline is visually approved,
hash-frozen, internal, non-public, committed, and pushed; every other later step
remains gated.
