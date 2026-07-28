# Boss 48 Direction Pilots

This directory is a review-only checkpoint for nine approved boss direction
pilots. It is intentionally separate from the production sprite catalogs and
renderers.

## Current contract

- Nine bosses.
- Four directions in stable order: Down, Left, Right, Up.
- One 48x48 hard-alpha frame per direction.
- One 48x192 native direction sheet per boss.
- The approved Down frame is locked by each generator.
- Effects are Off.

The artwork is authored on the assembler's 24x24 logical grid, receives the
existing Form plus Complete B treatment, and is enlarged to 48x48 with
nearest-neighbor scaling.

## Explicitly not integrated

These pilots are not entries in the enemy catalog, do not use the production
24x24 renderer or 20-column animation-sheet contract, and are not part of
persistence, game-pack exports, fixtures, baselines, release artifacts, or
Windows builds.

Open `boss-directions-review.html` through the local development server for the
combined visual gate. Each `*-directions-v1-manifest.json` records the measured
frame facts and keeps `integrated` set to `false`.
