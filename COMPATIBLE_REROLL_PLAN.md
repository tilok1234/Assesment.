# Compatible Production Reroll Plan

Status: selected as the next Production follow-up on 2026-07-27. Slice 1 is
complete and approved for checkpoint commit/push on 2026-07-27. The checkpoint
containing this status follows `108b2bb`.

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

## Later approval-gated slices

1. Decide the editor presentation and how compatible actions coexist with
   unrestricted category randomizers.
2. Carry Production context only in ephemeral editor state and history.
3. Add live undo/redo, status, no-alternative, and cross-mode browser smoke.
4. Document the approved editor behavior and run the full integration gate.

Compatibility inspection for arbitrary saved or manually assembled players
remains a separate follow-up because it requires context inference rather than
the known context of a Production result.
