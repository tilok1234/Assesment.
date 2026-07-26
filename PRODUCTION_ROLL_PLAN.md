# Production Roll Plan

Status: Production v1 policy, balanced review corpus, and live editor
integration approved on 2026-07-26. Slices 1-5 are complete and pushed at
`aa77666`. Slice 6 implementation and its technical gates received final
integration approval on 2026-07-27.

This plan defines a curated whole-character roll that favors coherent,
readable, game-ready player sprites while preserving the existing unrestricted
randomizer as **Wildcard Roll**.

The plan is intentionally separate from rendering, sprite-sheet geometry,
approved outlines and Form shading, the deferred effect compositor, fixtures,
baselines, and release artifacts.

## Current checkpoint

- Workspace: `C:\Users\headc\.codex\worktrees\9f24\8-bit sprite assembler`
- Branch: `codex/form-shading`
- Approved Production Roll policy/review/editor checkpoint: `aa77666`
  (`Add production roll workflow`)
- `aa77666` is committed and pushed to `origin/codex/form-shading`.
- `npm.cmd run check` passes 1,000 Production policy cases in addition to the
  full existing project matrix, including 29 bounded-fallback cases and 48
  deterministic integration render cases.
- The balanced review passes 120 Production and 120 Wildcard cases with frozen
  digest `af9b620e5ce87f6febf5983487fc163e8b5a4495fb37ced3653e8b5bbbc4ba3f`.
- The live browser gate passes Production/Wildcard undo and redo, preset and
  ordinary-pack round-trips, category-randomizer locality, Player-only mode
  isolation, Effects Off/Form presentation, export-action smoke, and exact
  restoration of the pre-test editor and 16-entry user pack. The console
  reports no warnings or errors.
- No fixture or visual baseline was changed, and no release artifact was
  rebuilt.
- Slices 0-6 are complete and approved. The checkpoint containing this status
  follows `aa77666`; later deferred follow-ups remain unauthorized.

## Executive assessment

The assembler already has strong structural safety:

- all player components use the fixed 24x24 frame and shared animation grid;
- weapon, shield, utility off-hand, headgear, outline, and Form paths have
  direct frame-safety and recomposition coverage;
- shield and Lantern are mutually exclusive;
- full helmets and fitted hairstyles already have defined renderer behavior;
- class templates already curate equipment by RPG role;
- Form is the new/reset assembled-sprite default;
- combat effects are Off by default.

The existing whole-player `randomPlayer()` is not art-directed. It selects
species, body build, skin, hair, expression, facial detail, headgear, outfit,
armor tier, colors, weapon, and equipment tiers mostly independently. Its one
cross-category rule is the shield/utility-off-hand exclusion.

As a result, current rolls are **valid** but not consistently
**production-coherent**. Common quality risks include:

- several large silhouette features competing in one 24x24 sprite;
- an oversized Tier 5 item paired with unrelated low-tier equipment;
- class-incoherent outfit and weapon combinations;
- face details or expressions selected beneath face-covering gear;
- important species traits hidden by unrelated headgear;
- independently selected colors producing muddy adjacent materials;
- visually broad two-handed weapons competing with the largest shields;
- technically legal selections that add metadata but no visible identity.

The total player combination space is over ten trillion. It is neither useful
nor honest to call every possible combination visually approved. Production
Roll should therefore be a small, explainable, versioned curation policy over
the existing catalogs, not a claim that the complete combinatorial space is
pristine.

## Product decision

Use an explicit roll action rather than a persistent editor mode:

- **Production Roll** generates one curated complete player.
- **Wildcard Roll** preserves the current unrestricted whole-player randomizer.
- Manual editing remains unrestricted.
- Per-category randomizers remain unchanged in the first version.
- A Production Roll does not lock the resulting character.
- After manual edits, the character is simply Custom; it is never labeled
  invalid or unsafe.

This avoids surprising cascading changes when a user edits or rerolls one
category and avoids implying that manual combinations are inferior.

## Quality vocabulary

The implementation and UI must keep these terms distinct:

### Structurally valid

The specification sanitizes, renders deterministically, stays inside the
24x24 frame, and satisfies the existing layer and export contracts.

### Production-compatible

The specification also satisfies the approved Production Roll v1 policy:
archetype, visibility, equipment, tier, silhouette-complexity, and palette
rules.

### Visually approved

The user has explicitly accepted a review corpus or a specific visual. Passing
automated policy checks does not grant visual approval.

Do not use “guaranteed pristine” in the UI or documentation. The intended
promise is **curated and production-ready under the approved v1 policy**.

## Production Roll v1 policy

Rules are divided into hard normalization and curated selection. Hard rules
must always hold. Curated rules define the approved roll distribution but do
not restrict manual editing.

### 1. Archetype first

Choose one of the ten stable class templates before choosing equipment:

- Warrior
- Guardian
- Ranger
- Rogue
- Mage
- Cleric
- Barbarian
- Necromancer
- Paladin
- Druid

Use the class template’s outfit, weapon families, shield families, and utility
off-hands as the equipment pool. Production Roll must not maintain a second
contradictory equipment matrix.

The first review corpus should contain equal class coverage even if the final
runtime weighting is not uniform.

### 2. One coherent power band

Choose one character power band from Tier 1 through Tier 5.

- The outfit uses that tier.
- Equipped weapons and shields use the same tier by default.
- At most one equipped axis may differ by one adjacent tier when variation is
  desired.
- `none` equipment always normalizes to Tier 1 metadata.
- Lantern remains untiered.
- Do not combine multiple unrelated apex Tier 5 silhouettes merely because
  each one is independently frame-safe.

The first implementation should use equal tiers. Adjacent-tier variation is a
later tuning option only if the review corpus becomes too uniform.

### 3. Hand and equipment coherence

Hard rules:

- a shield and utility off-hand can never coexist;
- malformed dual-equipped input preserves the shield;
- only shields can resolve shield-block behavior;
- Lantern does not require or enable a combat effect;
- `none` weapons and shields retain Tier 1 metadata.

Curated v1 rules:

- large shields are reserved for martial or defensive archetypes;
- bows, crossbows, staffs, spellbooks, and the largest two-handed weapons do
  not roll with the broadest shield silhouettes;
- bucklers may accompany agile one-handed loadouts;
- Lantern is favored for Ranger, Mage, Cleric, Necromancer, and Druid, using
  the class-template permissions established by the Lantern slice;
- shieldless variants remain available so Production Roll does not collapse
  into fully equipped silhouettes.

### 4. Visibility normalization

Production results must not retain invisible appearance choices:

- face-covering headgear normalizes expression to Neutral and facial detail to
  None unless the renderer explicitly preserves them;
- full helmets use a fitted/hidden hairstyle result rather than pretending a
  large top silhouette remains visible;
- rear views remain anatomically clean;
- species whose main readable identity is head-based should not be dominated
  by face-covering gear in the first approved corpus;
- visible hair/headgear combinations must use the existing fitted-hair
  contract.

The policy should reuse renderer/catalog visibility metadata where possible.
Do not duplicate headgear behavior with unrelated hard-coded lists unless a
missing semantic flag is first documented and tested.

### 5. Silhouette-complexity budget

Assign each selected feature a small catalog-level complexity weight.

Candidate major features:

- large or trailing hairstyle;
- tall or face-covering headgear;
- cape or expanded Tier 4/Tier 5 outfit;
- large species back/front trait;
- oversized Tier 4/Tier 5 weapon;
- broad Tier 4/Tier 5 shield;
- Lantern or later held utility item.

Production v1 should allow at most two major silhouette features, with one
additional minor accent. The exact weights remain provisional until the visual
review.

Do not calculate quality from total opaque-pixel count alone. That would reward
large dense sprites and punish intentional negative space. The budget must use
explainable catalog semantics, while render metrics remain review evidence.

### 6. Palette families

Choose a curated palette family before individual colors. Candidate families:

- grounded;
- royal;
- wilderness;
- arcane;
- divine;
- infernal;
- necromantic.

Each family supplies weighted skin, hair, outfit, and species-compatible color
choices. Hard exclusions should be rare; weighting is preferred so the system
retains variety.

Production v1 should use catalog colors only. Custom palette generation and
runtime color-scoring are deferred until the fixed-color profile is approved.

### 7. Presentation treatment

The review harness must use:

- approved Form shading;
- effects Off;
- transparent exports;
- both parchment and dark review backgrounds;
- native 24x24 and enlarged nearest-neighbor views.

Complete B and Selective C must be compared during review. The plan does not
pre-authorize one as the Production Roll UI default. That choice requires the
visual gate.

Production Roll content generation should remain independent from the
renderer. If the approved UI action also applies a presentation treatment, the
player specification plus outline/shade/effects state must change as one
undoable editor action.

## Architecture

Add a focused pure module:

`engine/production-rolls.js`

Recommended responsibilities:

- immutable profile id and version;
- seeded deterministic random-number helper;
- archetype and power-band selection;
- weighted catalog choices;
- hard normalization;
- complexity accounting;
- `validateProductionPlayer(spec)` with stable reason codes;
- `rollProductionPlayer(seed)` returning the resolved player plus audit
  metadata.

Suggested result shape:

```js
{
  profile: 'production-v1',
  seed: 'portable-string-seed',
  archetype: 'ranger',
  powerTier: 'tier3',
  player: { /* ordinary complete player specification */ },
  decisions: [
    { rule: 'class-equipment', choice: 'lantern' },
    { rule: 'silhouette-budget', used: 2, limit: 2 }
  ]
}
```

`decisions` are diagnostics and review metadata. They are not renderer input.

Keep these boundaries:

- `engine/generators.js` retains the current `randomPlayer()` behavior for
  Wildcard Roll;
- `engine/production-rolls.js` imports stable catalogs and class-template
  policy, never canvas, DOM, storage, or ZIP code;
- `app.js` imports only through `sprite-engine.js`;
- renderers do not inspect roll profiles;
- `character-kit.js` receives only the resolved ordinary player specification;
- no component path or layer-order change is required.

## Persistence and schema decision

Production Roll v1 does not add a field to the player specification.

The resolved appearance already contains every value required to reproduce the
sprite. Therefore:

- presets save the resolved player as usual;
- ordinary packs save the resolved player as usual;
- Complete Kit recipes remain ordinary player recipes;
- no preset, pack, class, batch, kit, or component schema bump is required;
- existing presets do not migrate;
- manual editing does not need to maintain a hidden production flag.

The seed, profile version, archetype, and decision log are useful provenance
but not required for rendering. Keep them ephemeral during the first slices.
Optional exported provenance is a later separately versioned feature.

## Manageable implementation slices

Every slice must be independently testable, reviewable, and revertible. Do not
start the next slice while its gate is unresolved.

### Slice 0 — safe checkpoint and frozen contract

Status: complete at pushed checkpoint `01b3f1a`.

Completed evidence:

- verify the Lantern diff, branch, HEAD, and upstream;
- rerun the full project and Lantern review gates;
- checkpoint the approved Lantern integration and this plan after explicit
  user authorization;
- leave release artifacts and baselines unchanged.

Satisfied exit criteria:

- clean, pushed safe checkpoint;
- `PRODUCTION_ROLL_PLAN.md` is the canonical lane authority;
- no Production Roll runtime code exists yet.

### Slice 1 — deterministic policy skeleton

Scope:

- add `engine/production-rolls.js`;
- define immutable `production-v1`;
- add portable seeded deterministic selection;
- expose the module through the stable public facade;
- return an ordinary sanitized player specification and audit metadata;
- preserve `randomPlayer()` byte-for-byte as the Wildcard path;
- no UI and no persistence changes.

Required checks:

- identical seed produces an identical complete result;
- different representative seeds produce distinct results;
- all ids exist in stable catalogs;
- every class id can be selected;
- invalid seed input normalizes deterministically;
- result metadata is deeply copied or immutable;
- no DOM, canvas, storage, ZIP, or renderer dependency enters the module.

Gate:

- structural/code review only; no visual approval claimed.

### Slice 2 — production policy v1

Scope:

- archetype-first equipment selection from class templates;
- one coherent equipment tier;
- visibility normalization;
- shield/Lantern and combat-semantics rules;
- first catalog-level silhouette budget;
- first fixed catalog palette families;
- stable validation reason codes;
- bounded deterministic retry/fallback behavior.

Required checks:

- at least 1,000 deterministic seeded rolls;
- zero invalid ids;
- zero shield/utility conflicts;
- zero hidden face-detail/expression selections under fully covering gear;
- zero class-equipment violations;
- zero tier-normalization violations;
- zero complexity-budget violations;
- every class, species, body build, outfit color, and permitted equipment
  family appears in the audit corpus;
- no retry loop can run without a fixed upper bound;
- the same policy version and seed remain reproducible.

Gate:

- automated policy audit passes;
- no editor exposure yet.

### Slice 3 — Production versus Wildcard review harness

Add:

`tools/production-roll-review.mjs`

Generate ignored output beneath:

`production-roll-review/`

Review corpus:

- 120 balanced Production results: 12 per class;
- 120 Wildcard controls using the same seed labels;
- all four directions;
- idle, walk, attack, and hurt;
- every animation frame in the machine-readable audit;
- selected representative frames in the browser grid;
- None, Complete B, and Selective C;
- approved Form shading;
- effects Off;
- parchment and dark backgrounds;
- native and enlarged nearest-neighbor output.

The interactive page must filter by:

- Production/Wildcard;
- class;
- power tier;
- species;
- headgear coverage;
- equipment type;
- complexity usage;
- rule or fallback reason.

Required machine-readable evidence:

- frame bounds and discarded writes;
- face-clearance checks;
- visible equipment attachment;
- outline/Form determinism;
- class/tier/visibility/complexity policy results;
- seed and policy version;
- exact counts and failures.

Approval gate:

Stop and ask the user to compare the Production and Wildcard corpus. Do not
integrate the UI, change the default randomizer, or call the profile visually
approved before explicit acceptance.

### Slice 4 — tuning and profile freeze

Scope:

- adjust weights, palette families, complexity weights, and narrowly justified
  compatibility rules based on review;
- regenerate the same fixed seeds after every policy change;
- keep before/after evidence visible;
- freeze the accepted rule set as `production-v1`.

Do not:

- redraw sprites to make the roll policy pass;
- add broad pairwise blacklists without an explainable rule;
- optimize for opaque-pixel count;
- remove Wildcard options;
- accept a fixture or baseline.

Exit criteria:

- user explicitly approves the Production v1 corpus;
- the chosen outline presentation, if any, is recorded;
- fixed seeds and validation totals pass;
- later catalog additions fail validation until given explicit production
  metadata or an intentional safe fallback.

### Slice 5 — editor integration

Recommended UI:

- change the header random action into an explicit menu or split action;
- expose **Production Roll** and **Wildcard Roll**;
- keep category randomizers unchanged;
- show the last Production result’s archetype and power tier as lightweight
  status text;
- do not label later manual edits as errors.

Behavior:

- Production Roll applies the complete resolved player in one undoable action;
- Wildcard Roll preserves current behavior;
- effects are set Off for the Production action;
- approved outline/shade treatment is applied only if Slice 4 explicitly chose
  one;
- character name, export filename, palette library, pack contents, and saved
  comparison are not destroyed;
- undo restores the complete pre-roll document;
- redo restores the exact seeded result;
- Enemies and Effects retain their current randomizers.

Required browser smoke:

- Production and Wildcard actions are separately reachable;
- Production produces a policy-valid result;
- undo/redo round-trips the exact sprite and treatment;
- switching Player/Enemies/Effects does not leak the profile;
- category rerolls remain local;
- effects remain Off after a Production Roll;
- preset save/load preserves the resolved character without needing roll
  metadata.

Gate:

- live editor behavior and the chosen presentation receive explicit user
  approval.

### Slice 6 — full integration validation and documentation

Scope:

- add production-policy coverage to `npm.cmd run check`;
- add the review command to `package.json`;
- document Production versus Wildcard in README and architecture;
- update ROADMAP and HANDOFF with the exact approved state;
- verify preset, pack, class, batch, kit, and export compatibility;
- confirm no schema version changed;
- confirm existing Wildcard and category-randomization tests still pass;
- run `git diff --check`.

Keep outside this slice:

- per-category compatible rerolls;
- production-readiness badges for manual characters;
- custom generated palettes;
- exported seed/provenance schema;
- enemy production rolls;
- effect-compositor repair;
- fixtures, accepted baselines, Windows installers, and releases.

Exit criteria:

- full validator passes;
- review tool passes;
- live browser smoke passes;
- user approves final integration;
- checkpoint commit/push happens only on explicit request.

## Deferred follow-ups

These are useful only after Production v1 is accepted:

1. **Compatible category reroll**, with its pure policy Slice 1 completed
   under `COMPATIBLE_REROLL_PLAN.md`, that filters one semantic category
   without silently rewriting unrelated choices.
2. **Production compatibility inspector** returning Custom/Compatible plus
   explainable reasons.
3. **Seed replay and sharing**.
4. **Optional provenance metadata** in exported recipes.
5. **Custom-palette harmony generation**.
6. **Enemy encounter or roster rolls** using separate family/biome policy.
7. **Multiple production profiles**, such as grounded, heroic, low-fantasy, or
   boss-ready.

Each follow-up requires its own scope and compatibility decision.

## Risks and mitigations

### False quality guarantee

Risk: “Production” is interpreted as universal visual approval.

Mitigation: distinguish structurally valid, production-compatible, and visually
approved; require corpus approval before promotion.

### Over-curation

Risk: the profile produces attractive but repetitive characters.

Mitigation: use weights rather than broad bans, measure catalog coverage, and
compare 120 fixed Production results against Wildcard controls.

### Rule duplication and drift

Risk: production equipment rules diverge from class templates or renderer
visibility behavior.

Mitigation: consume the existing class and catalog semantics, add missing
metadata at its owning boundary, and validate every catalog addition.

### Unstable or flaky rolls

Risk: `Math.random()` prevents reproduction and makes visual review drift.

Mitigation: use a portable seeded generator and fixed review seeds.

### Hidden cascading edits

Risk: a “smart mode” rewrites unrelated categories when the user changes one
choice.

Mitigation: Production is an explicit whole-roll action in v1; manual and
per-category edits stay local.

### Heuristic gaming

Risk: a numeric score rewards density or penalizes intentional negative space.

Mitigation: use explainable catalog-level rules for runtime selection and keep
render metrics as diagnostic review evidence.

### Scope contamination

Risk: the lane absorbs effect compositor, asset redraw, baseline, schema, or
release work.

Mitigation: preserve the explicit boundaries in this plan and stop at every
approval gate.

## Final definition of done

Production Roll v1 is complete only when:

- Wildcard Roll retains the current unrestricted behavior;
- the pure policy is seeded, deterministic, bounded, and explainable;
- at least 1,000 policy rolls pass hard validation;
- the balanced Production/Wildcard review corpus is generated;
- all audited frames remain in bounds and deterministic;
- every supported class and intended content category receives coverage;
- the user explicitly approves the visual corpus and presentation treatment;
- the editor integration is one undoable action and passes live smoke;
- resolved specs save and export through existing schemas;
- no fixture, baseline, compositor, release artifact, or renderer geometry was
  changed as part of the roll policy;
- the full project validator and `git diff --check` pass;
- documentation records the accepted policy version and exact continuation
  state.
