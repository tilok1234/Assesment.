# Compatible Production Reroll Plan

Status: complete and approved on 2026-07-27. The pure-policy checkpoint is
`a571b1e` (`Add compatible Production reroll policy`). The final editor,
documentation, and integration checkpoint containing this status follows
`a571b1e`.

This lane adds deterministic, Production-compatible per-category rerolls
without weakening the approved `production-v1` policy or changing the existing
unrestricted category randomizers.

## Product boundary

- A compatible reroll changes only the selected semantic category.
- The current Production class, power tier, and palette family are ephemeral
  policy context. They are never added to the ordinary player specification,
  presets, packs, recipes, or exports.
- Candidate choices are filtered through the existing
  `validateProductionPlayer()` contract.
- If no compatible alternative exists, the player remains unchanged and the
  result reports that outcome.
- Existing category randomizers remain unrestricted Wildcard behavior.

Two dependencies are explicit rather than silent:

- **Left-hand equipment** owns shield, shield tier, and utility off-hand as one
  mutually exclusive category.
- **Equipment power tier** owns armor, equipped weapon, and equipped shield
  tiers as one coherent category.

Changing a headgear, species, expression, hair, weapon, shield, or other
ordinary category never normalizes or rewrites a different category. An
incompatible candidate is excluded instead.

## Slice 1 — pure deterministic policy

Scope:

- add the focused pure `engine/production-rerolls.js` module;
- define immutable `production-compatible-reroll-v1` policy identity;
- expose the supported semantic categories;
- use portable seeded selection over the complete compatible candidate set;
- return an ordinary deep-copied player plus immutable audit metadata;
- export the API through `sprite-engine.js`;
- add direct dependency, determinism, locality, compatibility, invalid-input,
  no-alternative, coverage, immutability, and copy-safety tests.

Keep outside Slice 1:

- editor controls or status;
- persistence or schema changes;
- seed/provenance exports;
- automatic context inference or a compatibility inspector;
- custom-palette generation;
- enemy rerolls;
- renderer, sprite geometry, component, fixture, baseline, effect, release, or
  Windows changes.

Exit criteria:

- the original Production corpus and portable golden result remain unchanged;
- every changed result passes `validateProductionPlayer()`;
- only the selected category's declared fields can change;
- identical inputs are deterministic and independently copied;
- every supported category changes in the structural audit;
- `npm.cmd run check` and `git diff --check` pass;
- no commit or push happens without explicit approval.

Completed evidence:

- 4,200 deterministic category cases across 300 Production players;
- all 14 semantic categories produce compatible changes;
- 555 explicit no-compatible-alternative outcomes;
- invalid player, context, category, and seed coverage;
- ordinary-player deep-copy and provenance-stripping coverage;
- immutable context and audit metadata;
- unchanged Production golden result and full project matrix;
- `npm.cmd run check` and `git diff --check` pass.

## Slice 2 - approved editor integration

The Player editor exposes a small secondary `C` action beside thirteen
supported categories:

- species, body build, skin, hair style, hair color, expression, facial
  detail, headgear, outfit color, weapon, shield, and utility off-hand;
- armor tier maps to the semantic equipment-power-tier category and updates
  equipped armor, weapon, and shield tiers coherently.

Outfit family, weapon tier, and shield tier keep only their existing
unrestricted category arrows. The pure policy's combined `leftHand` category
is not exposed as a misleading extra button under either Shield or Off-hand;
the two existing compatible actions retain their explicit meanings.

Editor behavior:

- `C` buttons are visible but disabled until a Player Production Roll creates
  known class, power-tier, and palette-family context;
- existing category arrows are labeled and behave as unrestricted Wildcard
  rerolls;
- Production context lives only in module state and history snapshots, so
  compatible changes are undoable and redoable without changing editable,
  preset, comparison, pack, recipe, or export schemas;
- manual and category-Wildcard edits retain the known context and are labeled
  Custom; whole-character Wildcard and Player document replacement actions
  clear it;
- compatible results change only their declared fields and preserve outline,
  shade, and effect-preview treatment;
- a no-compatible-alternative result reports the outcome without changing the
  player or creating a history entry;
- Enemy and Effect modes expose no compatible controls.

Completed integration evidence:

- thirteen explicit accessible Player `C` controls and sixteen unchanged
  Player category-Wildcard controls;
- single-category locality, no-alternative status, and coherent three-tier
  coupling verified in the live editor;
- compatible and whole-Wildcard undo/redo restore both the player and
  ephemeral context exactly;
- cross-mode smoke confirms Enemy and Effect randomizers remain ordinary
  unrestricted actions;
- Form, Complete B, Effects Off, the inspected frame, empty preset library,
  and the user's 16-entry pack were restored after browser testing;
- browser console reported no warnings or errors;
- `npm.cmd run check` passes 4,200 compatible category cases, 555
  no-compatible-alternative cases, and the complete existing project matrix;
- `git diff --check` passes;
- no renderer, geometry, component path, fixture, baseline, effect behavior,
  schema version, release artifact, or Windows build changed.

Compatibility inspection for arbitrary saved or manually assembled players
remains a separate follow-up because it requires context inference rather than
the known context of a Production result.
