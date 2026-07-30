# Boss 48 Pilots

This directory is the review-source checkpoint for twelve approved boss
direction pilots plus repaired quadruped Rhino and Eclipse Unicorn Sovereign
candidates.
Checkpoint-exact runtime copies are exposed by the
assembler's review-only Bosses tab, while the pilots remain separate from
production sprite generation and renderers. Ancient Mirejaw, Bone Reliquary
King, Scorpion Empress, Cyclops Forge-Titan, and Pit-Fiend Juggernaut are the
first five full animation pilots, followed by Goblin War-Crown as the sixth;
Cruel Catgirl Templar of the Brutes is the seventh, and Divine Armored Templar
Astro Knight is the eighth. Furious Depraved Rhino and Gunslinger Boar Rider
are the ninth and tenth. The other three approved bosses remain static, and
Eclipse Unicorn Sovereign is a new static direction candidate. The
repaired catgirl-templar and Astro Knight animations are accepted; Goblin
War-Crown, Rhino, and Boar Rider retain unresolved animation-candidate status;
the Rhino direction redesign and Unicorn direction design also await approval.

## Current contract

- Twelve approved direction pilots plus Rhino and Unicorn candidates.
- Four directions in stable order: Down, Left, Right, Up.
- One 48x48 hard-alpha frame per direction.
- One 48x192 native direction sheet per boss.
- Each current Down control is locked by its generator.
- Effects are Off.

Each `boss-animation-v1` pilot adds:

- 80 direct 48x48 frames across Down, Left, Right, and Up.
- Idle x2, Walk x4, Attack x4, Cast x4, Hurt x2, and Death x4.
- One native `960x192` full sheet, four native `960x48` direction sheets, and
  six native animation sheets.
- Exact equality between each Idle frame 1 and its current static direction
  control.
- Player-style playback and native scoped downloads in the Bosses workspace.

The artwork is authored on the assembler's 24x24 logical grid, receives the
existing Form plus Complete B treatment, and is enlarged to 48x48 with
nearest-neighbor scaling.

## Explicitly not integrated

These pilots are not entries in the enemy catalog, do not use the production
24x24 renderer, and are not part of persistence, game-pack exports, fixtures,
baselines, release artifacts, or Windows builds. Their immutable
`boss-directions-v1` and `boss-animation-v1` path catalogs are review-surface
contracts only. Sharing the 20-column animation names/counts does not route
either boss through the Player renderer or sheet builder.

The runtime copies live beneath `engine/assets/bosses/`. Run
`node tools/check-boss-directions.mjs` to prove byte parity, dimensions, hard
alpha, direction-sheet assembly, immutability, and dependency isolation.
Run `node tools/check-boss-animations.mjs` to validate all ten 80-frame
corpora, all 110 assembled sheets, exact control frames, hard alpha, safety
borders, immutable facade, UI contract, and dependency isolation.

Open `boss-directions-review.html` through the local development server for the
combined visual gate. Each `*-directions-v1-manifest.json` records the measured
frame facts and keeps `integrated` set to `false`. The Astro Knight direction
manifest records `reviewStatus` as `approved`; its animation manifest records
`reviewed`, while the repaired catgirl-templar animation also records
`reviewed`. The Gunslinger Boar Rider direction manifest records `approved`.
The repaired Rhino and Eclipse Unicorn Sovereign direction manifests plus both
Rhino/Boar animation manifests record `candidate`.
