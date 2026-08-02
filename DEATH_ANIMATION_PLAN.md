# Player Death Animation Plan

Date: 2026-07-27
Status: visually approved, publicly integrated, and pushed at `d6a56c1`

## Goal

Add one focused four-frame Player Death animation after the approved public
Cast integration. It must read clearly at native 24x24 and preserve every
existing appearance and equipment combination. The isolated pilot passed its
gate and received explicit visual approval before public integration.

## Pilot Contract

The isolated animation identity is:

- id: `death`
- name: `Death`
- frames: 4
- timing: 160 ms per review frame
- phases: Stagger, Buckle, Fall, Still

Stagger and Buckle use the existing upright humanoid rig with distinct
body/leg/arm registration. Fall and Still apply a deterministic quarter-turn
to the completed pixel coordinates. The transform is a 24x24 coordinate
permutation, so it cannot discard, duplicate, blend, or invent pixels.
Weapons, shields, Lanterns, species pieces, clothing, faces, hair, and
headgear therefore remain attached and preserve their existing layer order.

The terminal fallen pose keeps a dedicated low, wide floor shadow behind the
sprite. Effects remain Off.

## Pilot and Public Boundaries

During the completed pilot:

- `engine/death-animation.js` is a pure, dependency-free module;
- the renderer recognizes Death only when a caller supplies the isolated
  animation identity;
- `tools/death-review.mjs` temporarily adds Death to its own process/browser
  catalog for review;
- public `ANIMS`, `SHEET_COLS`, editor controls, exports, manifests,
  persistence, schemas, fixtures, baselines, and game-pack requirements do not
  change;
- Enemy animations do not change.

After approval, public integration made these explicit decisions:

- public `ANIMS` appends Death after Hurt;
- `SHEET_COLS` is 20, making native full sheets 480x96 and direction sheets
  480x24;
- Players use the approved authored Death motion;
- every Enemy Death sequence is the deterministic Hurt alias 1, 2, 2, 2;
- the Wildshot v1 runtime contract requires the new Death columns;
- editor/export labels and documentation advertise the 20-column contract.

## Review Matrix

The dedicated review must cover:

- six representative Players;
- all four directions;
- all four Death frames;
- unarmed, one-handed, two-handed/ranged, shield, Arcane shield, and Lantern
  loadouts;
- native 24x24 plus enlarged nearest-neighbor views;
- source, Form + Complete B, and Form + Selective C;
- parchment and dark review backgrounds;
- Effects Off.

Automated gates:

- immutable profile and poses;
- invalid-frame refusal;
- pure dependency boundary;
- deterministic source and assembled output;
- all four frames distinct in every pilot/direction sequence;
- every Death frame distinct from Idle and Hurt controls;
- Fall and Still materially wider than tall;
- exact equipment/body layer recomposition;
- equipment-to-body contact;
- zero out-of-bounds writes.

## Non-goals

This work does not:

- add a separate Death-only stable-facade export;
- add authored Enemy death art;
- add persistence, schemas, provenance, or new game-pack metadata fields;
- change renderers outside the guarded Player Death path;
- change component paths, fixtures, approved baselines, effects behavior,
  release artifacts, or Windows builds;
- commit or push the isolated pilot before visual approval; the approved
  public integration was later checkpointed at `d6a56c1`.

## Approval Gate

Completed on 2026-07-27: the isolated review and focused structural gate
passed, the user explicitly approved the visual result, and only then was Death
promoted into public sheets. Public integration must pass the focused Cast and
Death gates, the full project validator, export dimensions, every Enemy alias,
and a live editor smoke test before checkpoint approval.
