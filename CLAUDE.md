# 8-Bit Sprite Assembler — session guide

Procedural 24x24 pixel-art sprite forge (vanilla JS + Tauri). Players and enemies
render procedurally from `engine/` catalogs; bosses are pre-baked 48x48 PNGs
authored by Python generators. Other repos consume `asset-pack/` and boss packs.

**This file is the session entry point. Do NOT read the archived plan docs in
`docs/archive/` unless researching how a feature was built — they are completed
historical records (~230KB). Live docs: this file, README.md, ARCHITECTURE.md,
HANDOFF.md (state), ENEMY_EXPANSION_PLAN.md + GAME_PACK_EXPORT_PLAN.md (active plans).**

## File map

| Path | Owns | Size warning |
|---|---|---|
| `engine/catalogs/enemies.js` | LEGACY enemy family/variant data (~1 line per variant) | small |
| `engine/enemy-expansion*.js` | EN-expansion facade: registry, slices, repairs, `PUBLIC_ENEMIES` composed catalog | small each |
| `engine/catalogs/player-options.js` | player option catalogs | small |
| `engine/catalogs/animation.js` | frozen frame contract: 24px, 4 dirs, 20 cols (idle2/walk4/attack4/cast4/hurt2/death4) | small |
| `engine/renderer.js` | per-family draw functions + dispatch if-chain (L~3205) + HUMANOID_FAMS (L~3195) | 141KB — read sections, not whole |
| `engine/outline-renderer.js` | outline registries: 8 per-family sets (L22-190) | 36KB |
| `engine/shade-renderer.js` | Form shading (derives from catalog colors — no per-family edits) | 12KB |
| `engine/sheets.js` | sheet builders (browser-only, 20-col contract) | small |
| `app.js` | entire editor UI (catalog-driven — no per-enemy edits) | 168KB — grep, don't read |
| `tools/check-project.mjs` | the master gate | 322KB — never read whole |
| `tools/export-enemy-fixtures.mjs` | headless legacy fixture exporter + manifest regen | small |
| `tools/fixtures/*.json` | approval rosters the checkers compare against | small |
| `asset-pack/` | published legacy pack: 12-col 4x 1152x384 fixtures (frozen LEGACY format — the engine's live format is 20-col; do not "fix" this) | binary |
| `engine/assets/bosses/` | 980 committed boss PNGs (runtime) | binary — don't list casually |
| `death-review/boss-48-drafts/` | boss checkpoint corpus + LIVE boss source .py modules (gitignored-but-tracked; only partially committed) | mixed |

## Verification tiers — run the cheapest sufficient check

| Change | Command | Cost |
|---|---|---|
| One enemy variant/family iteration | `npm run check:fast` | ~1 min recent |
| Boss catalog/asset work | `npm run check:bosses` | ~3s |
| Fixture export sanity | `npm run export:fixtures -- --verify --family <id>` | seconds |
| Pre-commit / checkpoint | `npm run check` (full) | ~2 min recent |
| Release | `npm run check && npm run check:release` | full |

`npm run check` passes on a fresh clone; missing boss review checkpoints are
WARNINGS (byte-parity runs only where the corpus exists — complete corpus lives
on the designer's machine; `check:bosses:strict` enforces it there).

## Add an enemy variant (~5 min)

1. Add one variant line under the family in `engine/catalogs/enemies.js`.
2. `npm run export:fixtures -- --family <family> --variant <new-id>` — renders
   the new fixture PNG and updates `asset-pack/manifest.json` from the catalog.
   (The exporter never overwrites existing published fixtures whose pixels
   differ from the current engine; that needs `--accept-drift`, which is a
   designer decision — see Known state.)
3. `npm run check:fast`. Done. (Golden counts derive from the catalog now.)

## Add an enemy family

1. Family block in `engine/catalogs/enemies.js`.
2. Draw function in `engine/renderer.js` (median ~47 lines — copy the closest
   body shape; humanoids share `drawHumanoid`) + one dispatch line (L~3205);
   humanoids also append to `HUMANOID_FAMS` (L~3195) and `HUM_FACE` (L~3108).
3. If outline support is approved: append the id to
   `engine/outline-renderer.js` registries AND `tools/fixtures/approved-outline-families.json`.
4. `npm run export:fixtures -- --family <id>`, then `npm run check:fast`.
5. Generate the review sheet for designer approval only for the changed family.

## Add a boss (see .claude/skills/add-boss for the full runbook)

style .py → review → directions .py → catalog `boss-directions.js` + `tools/fixtures/boss-roster.json`
→ animation .py (import `tools/boss_animation_authoring_v1.py` — never copy-paste the old 500-line scripts)
→ catalog `boss-animations.js` + roster JSON (incl. generator filename) → `npm run check:bosses`.
Python needs `pip install -r requirements.txt` (Pillow ≥11.3) and Node on PATH.

## Hard rules

- Frame contract is frozen: 24px cell, Down/Left/Right/Up rows, 20 columns,
  binary alpha, no antialiasing/scaling/cropping. Bosses: 48px, 2px safety border.
- `asset-pack/` PNGs must stay 1152x384 legacy 12-col format (the exporter does this).
- Boss runtime assets live flat in `engine/assets/bosses/` with frozen naming.
- Imports from outside the engine go through `sprite-engine.js` only.
- Never run `export:bosses:13` — its frozen roster currently lacks four
  direction and seven animation catalog entries.
- Don't edit checker roster literals — they live in `tools/fixtures/*.json`.
- Scope reviews to the changed family/boss; whole-roster review packets are
  release-time only.

## Known state (2026-08-13)

- Legacy catalog: 57 families / 202 variants (engine/catalogs/enemies.js, feeds
  the frozen asset pack). The stable and consumer expansion registries now
  contain 35 families / 92 variants across approved EN-E01 through EN-E09, so
  `engine.PUBLIC_ENEMIES` is 92 families / 294 variants. EN-E03 contributes
  only its six completed full suites; Boulder Hurler, Storm-Clan Jarl, and Sun
  Lancer remain internal Idle-only evidence.
- Current integration gate: `codex/approved-enemy-assembler-integration-v2`
  at implementation `6808ee93e4a7434173a7502795ed39c032f20530`
  registers exactly 35 previously private approved suites from later EN-E06,
  EN-E07, EN-E08, and EN-E09. The new exhaustive 2,800-frame digest is
  `e7d8b93e78058ca43b3ba584108bfa9906f33581aed43dbf6ec6819101743f93`;
  the earlier 1,200-frame digest remains exact. The Complete Kit is 92 families
  / 294 enemy sheets / 2,231 PNGs; the 24-player Complete Pack maximum is 2,254
  PNGs. All 232 legacy fixtures stay byte-unchanged, including the intentionally
  historical Ghoul fixture. No source sprite module, schema, effect, exporter,
  shared renderer interface, or frame contract changed.
- Publication permission: after explicit approval of an exact artifact or
  digest, the designer authorizes its bounded implementation, approval-record,
  reconciliation commits, and branch push. Never infer approval for
  registration, fixtures, effects, later roles/families, release, or another
  gate.
- Current private art checkpoint published / handoff reconciliation in progress: on
  `codex/en-e10-stag-elite`, based exactly on clean remote-verified Briarstep
  handoff `595b2b2b18ebe7e111486df96624b4e1f057647b`, the designer's `awesine lets
  keep going` opens exactly one private elite Stag. Gloamcrown Sovereign is a
  broad midnight-plum royal cervid with an old-ivory mantle, near-black violet
  face and lower legs, a vast connected weathered-gold crown rack with
  verdigris bands, wine markings, mulberry ears, a pale blaze, amber-gold eyes,
  four split hooves, and a body-owned antler lift into a planted crown press.
  Its exact 80-frame digest is
  `5a80240ca6bfb16eb6a53b0b95b5214323a9dde25814b48fb39e9caaf11e4855`.
  Raw / distinct Complete B outlined / Complete B + Form / comparison PNG
  hashes are `74245504722d36cfe54d79334230b07464833e1ce15b9175554142b5f232f7f9`,
  `7c4a63f53987e19e87fb5befa9bc9e4561c5cd597b1bdc6de30f50192faa9337`,
  `f489bad325cfa905036f8c6a7f8dc8ba8a71ee273aa5932fcc31c2f0d9e88ed8`,
  and `1bd4fbdda04870c55b13891adead703decf7508a9509fb54a188f7b50c49697e`;
  raw / Form GIF hashes are
  `8403dbb9d1443590ccb34e72a12b73b5a6141e98011159cfa3ae9ee40e8b1795`
  and `33dab8a93c5156b07e97733c44c928436d1cc747241a887b897552471ef859f5`.
  Focused / fast / full validation is green, with approval-local focused / fast
  passing in 0.8s / 56.6s, 80/80 structural and three-way comparison frames,
  opaque range 196-234, public 92/294, and all 232 fixtures unchanged. Exact
  review PNGs are open in Aseprite as sprites 131,
  135, 139, and active 143. The designer replied `approved lets do next` to the
  exact posted packet. Accepted implementation
  `0ece468efeaf4b50351358020075b4bf91dc7cff` is the immutable publication
  anchor. Approval record `378ec3d107b43e6b354cadcad16f64e0a8cf838b` and
  that implementation are pushed and remote verified; only the initial
  published handoff and final reconciliation remain open. After that tuple is
  clean and remote verified, the suffix
  opens only the Mammoth actor-topology decision, not Mammoth pixels.
  Registration, fixtures, effects, child assets, additional Stag variants,
  Rhino, release, accepted drift, and a PR remain closed.
- Current approved private art checkpoint published / no next Stag gate: on
  `codex/en-e10-stag-specialist`, based exactly on clean published Mossrack
  reconciliation `67331ed1a160c8e62df0c9941b7c051ab5d0b228`, the designer's
  `approved lets do next` suffix opens exactly one private specialist Stag.
  Briarstep Harrier is a sleek high-chested slate-green cervid with a tucked
  barrel, long pale throat, compact blue-charcoal face, connected swept-back
  ivory branching rack, violet bramble bands, plum ears, cyan eyes, short pale
  flag tail, four long legs, four cleft near-black hooves, and a body-owned
  lateral feint into a low antler rake. Its exact 80-frame digest is
  `fb352a405be53536a2304eb8ad97ef7e03f0819519607a8a0afea16e81f97457`.
  Raw / distinct Complete B outlined / Complete B + Form / comparison PNG
  hashes are `3874a2be78c6cf49d956da8cad4dea0273bd64df4a905b49ea6a10bbaa34ebcc`,
  `18c2ead46605c7530511a076ecbcf0f6cf2f630b94bdf9504449cec6794164a8`,
  `d0c075c28d6ed0a52620e54195435c477f41a13ac71205c34b281ec6817ec8cb`,
  and `f58ced45ebe96fb7e42bfb29118024e7e2a4b4d0461e287ad522d093d3bcc866`;
  raw / Form GIF hashes are
  `6172ddb391750d318e8fc263e6a53a34492dd723beb53ad6bf10d07b8cad1e13`
  and `523e4c3a8462d02a95398fa8df8c056b932c157ee834d18c10042092eea3ccc5`.
  Focused / fast / full gates pass in 1.1s / 69.1s / 124.8s, approval-local
  focused / fast gates pass in 0.7s / 67.0s, and final published-state full
  validation passes in 126.9s: 80/80 connected, bounded, grounded, split-hoof,
  cervid-span, and three-way pixel/alpha-distinct frames; opaque range 171-209;
  public 92/294 and all 232 fixtures unchanged. Exact
  PNGs are open in Aseprite as sprites 115, 119, 123, and active 127. The
  outlined board is evidence only, not outline registration. The final prompt
  posted all four exact PNGs, both GIFs, and the digest; the designer replied
  `approved`. Accepted implementation
  `8d52dc26d9d361c5d95603276a4a88b3978a585e`, approval record
  `895456020801fa40a31d7e83413895e0440c505e`, and initial published handoff
  `40fd66c20f3b01ddd927ecb83c807c96c5feec7b` are remote verified; this
  reconciliation completes the bounded publication tuple. No next Stag art
  gate is open. Registration, fixtures,
  effects, child assets, elite Stag, later families, release, accepted drift,
  and a PR remain closed.
- Approved preceding private art checkpoint published / specialist gate open: on
  `codex/en-e10-stag-common`, based exactly on clean published Cragcrown reconciliation
  `6d7f7b32733a1a7f8ca16a79ef06b72c17a246ca`, the designer's `letsdo nex t`
  opened the Stag topology decision and the subsequent `approved` selected
  `baked-single-actor-antlered-grounded-quadruped`: one connected lean cervid
  with a high shoulder, long upright neck, tapered muzzle, paired ears, short
  tail, two connected branching antlers, four visibly cleft hooves, a
  body-owned head-lowering antler sweep, zero child assets, and all effects
  external. Mossrack Forager is the one authorized private common candidate,
  using warm russet and copper hide, a dark chestnut face and lower legs,
  weathered-bone rack, birch throat and belly, moss lichen markings, rose ears,
  amber eyes, and near-black split hooves. Its exact 80-frame digest is
  `c3383941492c1976bc03786f73fee20744d0a2af9e8846f44cbf9d59b7384d36`.
  Focused validation passes all 80 connected, bounded, grounded, split-hoof,
  cervid-span, pixel-distinct, and alpha-distinct frames against approved
  Cragcrown Patriarch and Miremane Courser plus public Dire Wolf; opaque range
  is 194-224. Exact aliases and mirrors pass. The raw, required distinct
  Complete B outlined, Complete B + Form, and comparison PNGs plus two GIFs are
  hash-frozen and regenerate deterministically. Pre-approval focused / fast /
  full gates pass in 0.9s / 69.8s / 113.3s, approval-local focused / fast gates
  pass in 0.9s / 61.1s, and final published-state full validation passes in
  111.4s with public 92/294 and all 232 fixtures unchanged.
  The four exact PNGs are open together in Aseprite as sprites 99, 103, 107,
  and active 111. The outlined PNG is review evidence only, not outline
  registration. The final prompt posted all four PNGs, both GIFs, and the exact
  digest; the designer replied `approved lets do next`. Accepted implementation
  `4c5d80901d12063b21c0d6303fc24260bd700209`, approval record
  `328a9b188ddd6e5db6144f2fdb253f8d9599e12d`, and initial published handoff
  `b8e67f2ddc12a71e3b25c33997a1ffed0329b7f4` are remote verified; this
  reconciliation completes the bounded publication tuple. The reply now opens
  exactly one private specialist Stag. Public/outline registration,
  fixtures, effects, child assets, elite Stag, Mammoth, Rhino, Rhino Boss work,
  release, accepted drift, a PR, and every broader gate remain closed.
- Approved preceding published private art checkpoint: on `codex/en-e10-ram-elite`, based
  exactly on clean published Cliffcoil reconciliation
  `bb11e3518b65613caa5499ec7cb5ddefb18d5ebd`, the designer's separate `lets
  xdo next` authorizes exactly one private elite Ram candidate under the
  approved `baked-single-actor-horned-grounded-quadruped` topology. Cragcrown
  Patriarch is a broad connected grounded Ram with layered basalt-wine fleece,
  near-black umber face and lower legs, enormous connected ironstone full-ring
  horns with burnished-copper growth bands, weathered taupe belly and beard,
  dark crimson crag bands, pale facial scars, blood-wine ears, gold eyes,
  near-black hooves, and a body-owned double-impact horn ram. Its exact
  80-frame digest is
  `b8c7159c1d85689b3b9178179464b54e01a7ae538a1bda0036eb731d7d7d6c0a`.
  Focused validation passes all 80 connected, bounded, grounded, four-hoof,
  quadruped-span, pixel-distinct, and alpha-distinct frames against approved
  Cliffcoil Strider and Stonecurl Grazer plus public Dire Wolf; opaque range is
  282-303. Exact aliases and mirrors pass. The raw, required distinct Complete B
  outlined, Complete B + Form, and comparison PNGs plus two GIFs are hash-frozen
  and regenerate deterministically. Pre-approval focused / fast / full gates
  pass in 0.6s / 60.9s / 119.0s and approval-local focused / fast gates pass in
  0.7s / 58.7s with public 92/294 and all 232 fixtures unchanged. Final
  published-state full validation passes in 115.0s with the same boundary. The
  four exact PNGs are open together in Aseprite as sprites 83, 87, 91, and
  active 95. The outlined PNG is review evidence only, not outline
  registration. The final prompt posted all four PNGs, both GIFs, and the exact
  digest; the designer replied `approved`. Accepted implementation
  `3d8727cce7d8b3f00ce8923ee9db629de13e1097` and approval record
  `8b2cc029a94eaeae69dc1a0f4886dd899dfc6902`, plus initial published handoff
  `46645d2a2a84bc0669f0f5e5f4362da93abf0782`, are remote verified; this
  reconciliation completes the bounded publication tuple. No next Ram art gate
  is open. Public/outline registration, fixtures, effects, child assets, further
  Ram variants, later families, release, accepted drift, a PR, and every later
  gate remain closed.
- Approved preceding published private art checkpoint: on `codex/en-e10-ram-specialist`, based exactly
  on clean published Stonecurl reconciliation
  `67ba19086669b9135286784b6c9c39f682ca3032`, the designer's separate `lets do
  nex t` authorizes exactly one private specialist Ram candidate under the
  approved `baked-single-actor-horned-grounded-quadruped` topology. Cliffcoil
  Strider is a connected grounded lean blue-slate Ram with charcoal-blue face
  and lower legs, long connected pale-limestone swept coil horns, cool pale
  belly and beard, sea-glass sure-foot chevrons, muted-wine ears, cyan eyes,
  near-black hooves, and a body-owned sidestep horn charge. Its exact 80-frame
  digest is `1ca2ce85dc6bd4b291e6ede4754f58c2a5bd4278b50acfb699926f9626dd9b29`.
  Focused validation passes all 80 connected, bounded, grounded, four-hoof,
  quadruped-span, pixel-distinct, and alpha-distinct frames against approved
  Stonecurl Grazer and Miremane Courser plus public Dire Wolf; opaque range is
  233-259. Exact aliases and mirrors pass. The raw, required distinct Complete B
  outlined, Complete B + Form, and comparison PNGs plus two GIFs are hash-frozen
  and regenerate deterministically. Pre-approval focused / fast / full gates
  pass in 0.7s / 59.0s / 113.9s and approval-local focused / fast gates pass in
  0.6s / 57.9s with public 92/294 and all 232 fixtures unchanged. Final
  published-state full validation passes in 111.0s with the same boundary. The
  four exact PNGs are open together in Aseprite as sprites 67, 71, 75, and
  active 79. The outlined PNG is review evidence only, not outline registration.
  The final prompt posted all four PNGs, both GIFs, and the exact digest; the
  designer replied `approved`. Accepted implementation
  `cb6c58440297b76f62776d8c11a6232d05bb1467` and approval record
  `3b9b99e28a2c4787d76f3dc0def20f4a79b589ac`, plus initial published handoff
  `b43e0ab90bf39bdc04abf1681d8f78cf2faa78fc`, are remote verified; this
  reconciliation completes the bounded publication tuple. At that checkpoint
  public/outline registration, fixtures, effects, child assets, elite Ram,
  later families, release, accepted drift, a PR, and every later gate remained
  closed. The designer later separately said `lets xdo next`, opening only the
  private elite Cragcrown Patriarch candidate above.
- Approved preceding published private art checkpoint: on `codex/en-e10-ram-common`, based exactly on clean
  published Scarcrest reconciliation
  `a7d2abbd610dfc6096498d1dce096d652e50596d`, the designer's `approved`
  selects `baked-single-actor-horned-grounded-quadruped` and authorizes exactly
  one private common Ram candidate. Stonecurl Grazer is a connected grounded
  24x24 ash-cream Ram with a compact barrel torso, proud arched neck, charcoal
  wedge muzzle and lower legs, two body-owned weathered-ochre spiral horns,
  connected forehead wool, pale chest beard, four separated black-brown
  hooves, short connected tail, amber eyes, rose ears, and a body-owned horn
  bash. Its exact 80-frame digest is
  `79b440290b1c6f503834d44b13d2c9508b34ad48a4ae495c6e957e329095942f`.
  Focused validation passes all 80 connected, bounded, grounded, four-hoof,
  quadruped-span, pixel-distinct, and alpha-distinct frames against approved
  Scarcrest Matriarch and Miremane Courser plus public Dire Wolf; opaque range
  is 214-243. Exact aliases and mirrors pass. The raw, required distinct
  Complete B outlined, Complete B + Form, and comparison PNGs plus two GIFs
  are hash-frozen and regenerate deterministically. Pre-approval focused /
  fast / full gates pass in 0.7s / 67.6s / 123.1s and approval-local focused /
  fast gates pass in 0.7s / 58.8s with public 92/294 and all 232 fixtures
  unchanged. Final published-state full validation passes in 113.9s with the
  same boundary. The four exact PNGs are open together in Aseprite as sprites
  51, 55, 59, and active 63. The outlined PNG is review evidence only, not
  outline registration. The final prompt posted all four PNGs and the exact
  digest; the designer replied `approved`. Accepted implementation
  `195c6ddf4c2f8d5345d18b3e1657bfab3f7a41b8` and approval record
  `c7757c1293bae90840735555e2670d7661bc9873`, plus initial published handoff
  `c278919b2830d7e8654bcb1bbd38f07db344d285`, are remote verified; this
  reconciliation completes the bounded publication tuple. At that checkpoint
  public registration, fixtures, effects, child assets, specialist or elite
  Ram, Stag, Mammoth, Rhino, Rhino Boss work, the deferred Runic Idol decision,
  release, accepted drift, a PR, and every later gate remained closed. The
  designer later separately said `lets do nex t`, opening only the private
  specialist Cliffcoil Strider candidate above.
- Approved preceding private art checkpoint: on `codex/en-e10-hyena-elite`, based exactly on clean
  published Gloamstripe reconciliation
  `76117603035f6880f25f7dc8356ba23221df2af9`, the designer's `approved lets do
  nex t` authorizes exactly one private elite Hyena under the approved connected
  grounded 24x24 zero-child topology. Scarcrest Matriarch is a broad
  burnished-umber matriarch with massive high shoulders, heavy connected neck,
  low rump, deep pale chest, compact scarred wedge muzzle, rounded crimson-lined
  ears, raised connected near-black wine crest, pale scars, gold eyes, four
  dark paws, thick connected lowered tail, and a body-owned heavy neck-and-jaw
  crush. Its exact 80-frame digest is
  `81e0c289eae61184741155c99a1cef9c03d3d3bae115f7eb96489572fbc00cf7`.
  Focused validation passes 80/80 connected, bounded, grounded, four-paw,
  quadruped-span, pixel-distinct, and alpha-distinct frames against approved
  Gloamstripe Ambusher and Duneback Scavenger plus public Dire Wolf; opaque
  range is 239-259. Exact aliases and mirrors pass. The raw, required distinct
  Complete B outlined, Complete B + Form, and comparison PNGs plus two GIFs are
  hash-frozen and regenerate deterministically. Pre-approval focused / fast /
  full gates pass in 0.6s / 61.5s / 111.2s and approval-local focused / fast
  gates pass in 0.6s / 58.9s with public 92/294 and all 232 fixtures unchanged.
  Final published-state full validation passes in 113.2s with the same boundary.
  The exact raw, outlined, Complete B + Form, and
  comparison PNGs are open together in Aseprite as sprites 35, 39, 43, and
  active 47 when the designer replied `approvedf lets do nex tr`. Accepted
  implementation `88d00336ee8ff714f1d978a5cf37d9807bbb4719` records only the
  frozen packet. The outlined PNG is a review surface only, not public outline
  registration. Gloamstripe's approved
  implementation `5d35ed0c36f84646270a3d02b13e63559798aa01`, approval record
  `76ed7212ccddc33d1fcafa1ec97b26eb8963f096`, initial published handoff
  `1126852feae8f812c044806760a0063a7ef8d31f`, and final reconciliation above
  are remote verified. Scarcrest implementation
  `88d00336ee8ff714f1d978a5cf37d9807bbb4719` and approval record
  `0411a1a385ddddf090f0ca3d31c81e0a6f6e6214`, and initial published handoff
  `e0c9fcce275380d501c7ac393619387e033f3046` are remote verified; this
  reconciliation completes the bounded publication tuple. That continuation
  opened only the Ram decision; the designer's later separate `approved`
  selected it and authorized only the Stonecurl Grazer candidate above. It did
  not authorize publication, registration, fixtures, effects, child assets,
  later roles or families, release, accepted drift, or a PR.
- Approved preceding private art gate: on `codex/en-e09-living-book-elite`, based exactly
  on clean published Starlock reconciliation
  `77334139e5fb968b8f8415a3b13e60e6e0b632d0`, the designer's `lets do nex t`
  authorizes exactly one elite Living Book under the approved connected 24x24
  zero-child topology. Crownseal Grimoire is a broad royal-violet tome with a
  gilt crown-spine, tiered ivory page mass, crimson triple seals, turquoise
  crown script, connected cathedral page vault, and body-owned twin-cover
  crush. Its exact 80-frame candidate is frozen at digest
  `7c1ea4a637b46b0fc494670e83a6527535b02b0c21705c0450f74cf1293ce024`.
  The focused gate passes 80/80 connected hover silhouettes, 8/8 connected
  cathedral vaults, 72/72 colored frames, 8/8 exact-white flashes, 54/54
  readable non-rear crown-script views, and 80/80 pixel plus alpha distinctions
  from Starlock, Claspbound, and Epochforge. Opaque range is 235-303 and the
  exact three PNG plus two GIF hashes are frozen in the gate. `check:fast`
  passes in 61.3s, while pre-metadata fast/full gates pass in 61.7s/115.7s and
  approval-local fast/full gates in 67.1s/122.5s with public 92/294 and all 232
  fixtures exact. The exact raw, Complete B +
  Form, and comparison PNGs were open together in Aseprite as sprites 7, 11,
  and active 15 when the designer replied `approved lets do next`. Accepted
  implementation `159b9105297fb6c999f91ec77c194c777579d526` records only that
  frozen packet. The implementation and approval record
  `c4c256c7ba125cc177954f8664593431e00da27a` plus initial published handoff
  `7406864fb459eca40082b0fe9883441148b2230a` are remote verified; this
  reconciliation completes the bounded publication tuple. That reply
  historically opened only the Runic Idol actor-topology decision; the designer
  later paused it and selected the separate EN-E10 Hyena gate above.
  Registration, fixtures,
  child/state assets, effects, Crystal Beast, later families, release, accepted
  drift, and a PR remain closed.
- Current approved private art gate: on `codex/en-e09-living-book-specialist`, based on
  clean integrated checkpoint `e7729e651044139bda7e4dcf14c3c2690dbd29be`,
  the designer's `lets keep going` authorizes exactly one specialist Living
  Book under the approved connected 24x24 zero-child topology. Starlock
  Lexicon is a tall midnight-blue codex with an iron spine, copper star-lock,
  stepped pale page index, amber sigil, connected asymmetric page fan, and
  body-owned spine sweep. Its exact 80-frame candidate is frozen at digest
  `3cd86b946115179fc566160e5045eccfda4fd5ce61ce44eae269634b07f3e92c`.
  The focused gate passes 80/80 connected hover silhouettes, 8/8 connected
  page fans, 72/72 colored frames, 8/8 exact-white flashes, and 54/54 readable
  non-rear sigil views; pre-approval `check:fast` passes in 58.1s and full
  `check` in 114.1s; approval-local fast/full gates pass in 61.2s/112.9s with
  public 92/294 and all 232 fixtures exact. The three PNG and two GIF hashes
  are frozen in the gate. All three exact PNGs were open
  together in Aseprite when the designer replied `APPROVED`; accepted
  implementation `f11c2a0915588c616e1db7d8e461208f97a42706` records those
  pixels. The implementation and approval record
  `335ff6a36a1b72509816546655d3d58ae2173ecb` plus initial published handoff
  `7ae9b30dc5c440eb4b8743fe726c952241a18da3` are remote verified; this
  reconciliation completes the bounded publication tuple. The designer's later
  `lets do nex t` opens only the isolated elite gate above. Registration,
  fixtures, child/state assets, effects, later families, release, accepted
  drift, and a PR remain closed.
- Latest source-art approval: common Living Book Claspbound Primer on
  `codex/en-e09-living-book-architecture`, based exactly on clean published
  Epochforge reconciliation `85b29f76cb77ae85a116cec56eeed5b61ea5a375`, is frozen
  at digest `bb00346a7bf5f8157f018b92dfd038373977d8ba9dc372f7affee7e2dc3dedf4`.
  It uses the approved connected deterministic 24x24 baked-book topology with
  zero child assets. Cover, spine, hinges, clasp, page block, rune, connected
  open spread, and body-owned snap are actor pixels; loose pages and rune
  effects remain Effects Off. The focused gate passes all 80 frames with 80/80
  connected hover silhouettes, 8/8 connected open spreads, 72/72 colored
  frames, 8/8 exact-white flashes, and 54/54 readable non-rear rune views. The
  exact five review hashes are visually approved at implementation
  `785c851672d427e7b45459716b70fff5834fa0a5`. Standing permission opens only
  the bounded handoff reconciliation; approval record
  `7f46874d47572044cba070c0f04f441d88804191` and initial published handoff
  `02d0e7cc4fc33d1e98c244468643927ab99c1063` are remote verified; the bounded
  publication tuple is complete. The
  designer's later `lets do it` authorized its inclusion in the exact 35-suite
  integration above. Fixture generation remains closed. Do not add child/state
  assets or effects, begin another role/family, release, accept drift, or open
  a PR without a separate gate.
- Approved preceding private art gate: common Clockwork Automaton Brasscoil
  Sentry on `codex/en-e09-clockwork-automaton-architecture` is published at
  reconciliation `8037f0ccbb042bf041e01ecbe18b1c567567e409`, frozen at digest
  `2ce7599bdfeb97ccf99f986f5bf842a5ada7fb4cb3d0605a566c1d1263a111cd`,
  and remains private, unregistered, fixture-free, effect-free, and zero-child.
- Approved earlier private art gate: elite Living Weapon Crownmaw Greatblade on
  `codex/en-e08-living-weapon-elite`, based exactly on clean published Vowcoil
  reconciliation `7bdb09e95d47c6213e2387124c305f78b0b486d1`, is frozen at digest
  `a7f88e5ebf4656f7dbea55ea5a62ad23a530b0c4bf573f9750240cf605a6fa44`.
  It is one baked broad crown-blade/jaw-guard/crimson-slit-core/short-grip/
  forked-pommel actor with zero child assets. The focused gate passes; fast/full
  validation passes in 61.0s/114.0s before approval metadata; approval-local
  focused/fast/full gates also pass, with the full suite at 117.5s and public
  80/259 plus all 232 fixtures exact. The exact packet was open together in Aseprite
  when the designer replied `ok lets do next`; implementation
  `2ec77b0595d74d6765503b2ebd2bb366f53d4ffe` records the accepted pixels. It is
  approved; the implementation and approval record
  `08538ac2d90d186c6550bcc139c2234023ec9c9d` are remote verified. Initial
  published handoff `64f21886c43245f1c85820b0c91a1f8ff31686dc` is also remote
  verified; this reconciliation completes the bounded publication tuple.
  Inspect the live roadmap and stop at its next decision gate; do not infer
  EN-E09 authorization. Registration, fixtures, effects, child assets, release,
  accepted drift, and a PR remain closed.
- Approved preceding published private art checkpoint: specialist Living Weapon Vowcoil Glaive on
  `codex/en-e08-living-weapon-specialist`, based exactly on clean published
  Oathbite reconciliation `870bf042e4d7604fec6f33ba3ba6b03308204ee2`, is frozen
  at digest `bfdbd581137492667ad042b062480895b67f63a33aeec43aaef94e22a4816807`.
  It is one baked tall crescent/ring-core/wrapped-shaft/butt-spike actor with
  zero child assets. The focused gate passes; fast/full validation passes in
  55.0s/115.7s before approval metadata and 57.7s/116.1s approval-local with
  public 80/259 and all 232 fixtures exact. The exact three frozen PNGs were
  open together in Aseprite when the designer replied `approved lets do next`;
  implementation `1080ca4a377657634249d3579dbd9c743db3b38c` records the accepted
  pixels. The implementation and approval record
  `36d41a04fc122336a9e65aa9f5d94618975df388` are remote verified. Initial
  published handoff `5f7b93d4a911a87e3fb91a45c68d6ce2d8fb31cf` is also remote
  verified; this reconciliation completes the bounded publication tuple. The
  same reply opens only one private elite Living Weapon art candidate from this clean
  published
  reconciliation. Registration, fixtures, effects, child assets, EN-E09,
  release, accepted drift, and a PR remain closed.
- Approved preceding published private art checkpoint: common Living Weapon Oathbite Cleaver on
  `codex/en-e08-living-weapon-architecture`, based exactly on clean published
  Threnecrown reconciliation `6f2a51739a65b88f8c50644e92e440c8004cc049`, is
  frozen at digest
  `6aba171cd7960766078e0fefd6e08cda2313d9f1b8e110d74ad4e78325d58a46`.
  The designer selected the recommended baked 24x24 single-actor topology with
  zero child assets by replying `awesome lets do next`. All 80 frames pass
  connected, bounded, hovering, readable-core, alias, mirror, and predecessor/
  comparison gates; fast/full validation passes in 60.4s/110.3s before approval
  metadata and 51.3s/98.0s approval-local with public 80/259 and all 232
  fixtures exact. The exact three frozen PNGs were open together in Aseprite
  when the designer replied `approved lets do next`; implementation
  `ceafc0badba8c31876cfa3c8055091ba752dbf5d` records the accepted pixels. The
  implementation and approval record
  `1c506640bb270c49815f0de357e9cb051b715cee` are remote verified. Initial
  published handoff `ad6388d308c95e498601b0b40d5406a30253fd44` is also remote
  verified; this reconciliation completes the bounded publication tuple. The
  same reply opens only one
  private specialist Living Weapon art candidate after clean remote
  reconciliation. Registration, fixtures, effects, child assets, the elite
  role, EN-E09, release, accepted drift, and a PR remain closed.
- Approved preceding published private art checkpoint: elite Possessed Mask Threnecrown Hierophant on
  `codex/en-e08-possessed-mask-threnecrown-hierophant`, based exactly on clean
  published Mournseal reconciliation
  `4f7a1146f1b90c8e70b819461d29a4be72cb379a`, is frozen at digest
  `51ca678e1dee5e086d0fa439686c0e699b857b2ab00dfa4ab7a963546c11c81f`.
  It is one baked 24x24 crown-mask/tiered-mantle/gold-tab actor with zero child
  assets. All 80 frames pass connected, bounded, hovering, readable-face,
  alias, mirror, and predecessor/comparison gates; fast/full validation passes
  in 57.0s/107.1s before approval metadata and 62.0s/119.1s approval-local with
  public 80/259 and all 232 fixtures exact. The exact three frozen PNGs were
  open together in Aseprite when the
  designer replied `approved lets ddo next`; implementation
  `4bf12351ebe643520f052c08bacd385141231a3f` records the accepted pixels. It is
  remote verified with approval record
  `3ba7a1c49aae4fd759df2912c7e16a8637039a83`. Initial published handoff
  `15b2c26232d3098705b7704b6aee0d52ba2a18b9` is also remote verified; this
  reconciliation completes the bounded publication tuple. The same reply opens only the
  Living Weapon actor-topology architecture decision after clean remote
  reconciliation; it does not authorize Living Weapon art. Registration,
  fixtures, effects, child assets, EN-E09, release, accepted drift, and a PR
  remain closed.
- Approved preceding published private art checkpoint: specialist Possessed Mask Mournseal Cantor on
  `codex/en-e08-possessed-mask-mournseal-cantor`, based exactly on clean
  published Whisperveil reconciliation
  `2ab49dc879a852d8a3c1a5f14de93345b32d490a`, is frozen at digest
  `5f54d5f716a11e42e813c7f09c1031d7090b1ac51a9cd93f93f6e0df08ac4e55`.
  It is one baked 24x24 tall-mask/fan-shroud/braided-cord actor with zero child
  assets. All 80 frames pass connected, bounded, hovering, readable-face,
  alias, mirror, and predecessor/comparison gates; fast validation passes in
  56.2s and full validation in 109.0s with public 80/259 and all 232 fixtures
  exact. The exact three frozen PNGs are open together in responsive Aseprite
  process 3228. The designer replied `approved lets do next`; implementation
  `b1fd09ab0b04128330178a99c0379783621e478f` records the accepted pixels.
  Approval record `ae364550cf2ecfece032098800b2c1df018ee2a5` and the
  implementation are remote verified. Initial handoff
  `0309590d9d025e8cdfa960131a3d7835730c3f7b` is also remote verified; this
  reconciliation completes the bounded publication tuple. Status is `approved`
  and `published`. The same reply opens only the private elite role
  after clean remote reconciliation. Registration, fixtures, effects, child
  assets, Living Weapon, EN-E09, release, accepted drift, and a PR remain closed.
- Approved preceding published private art checkpoint: common Possessed Mask Whisperveil Visage on
  `codex/en-e08-possessed-mask-whisperveil-visage`, based exactly on clean
  published Crownvault reconciliation
  `42156250f24d03b7e81a29e14cec75c25528cde4`, is frozen at digest
  `c0fac02331632e028b73a21cadd4b472b1bdc18f7d4915b814e9a872dbc0b098`.
  It is one baked 24x24 mask/shroud/ribbon actor with zero child assets. All 80
  frames pass connected, bounded, hovering, readable-face, alias, mirror, and
  comparison gates; fast and full validation pass with public 80/259 and all
  232 fixtures exact. The designer replied `approved`; implementation
  `78f5446c7821bd751c3562d0a18056a64c0e00c6` records the accepted pixels.
  Approval record `c27435976f03a4f9263f6f4bbc4b46dc275b19a7` and the
  implementation are remote verified. Initial handoff
  `29316d8c0c2cbaa900d34cf6b372679dc447ef2e` is also remote verified; this
  reconciliation completes the bounded publication tuple. Registration,
  fixtures, effects, child assets, later
  roles/families, release, accepted drift, and a PR remain closed.
- Current approved published private art checkpoint:
  elite Animated Armor Crownvault
  Castellan on `codex/en-e08-animated-armor-crownvault-castellan`, based exactly
  on clean published Runeforge Custodian reconciliation
  `700f2cedb1d3104369931a97bfec31a3b49fff93`, is frozen at digest
  `112feaad57ce04cb2dae15f5bd33f2e7e4fd3418cd3aece68aeb345ff1dc9039`
  and is visually approved by the designer's reply `approved`; implementation
  `46d09a4e16a11f9c622cb698ff30055bb9bcb877` records the accepted pixels. It
  is one baked 24x24 actor with zero child
  assets: crenellated helm, readable T-seal, tower pauldrons, gatehouse chest,
  connected bastion gauntlets, portcullis waist, pillar greaves, and plinth
  sabatons. Run `npm.cmd run
  review:enemy-expansion-en-e08-animated-armor-crownvault-castellan` and
  `npm.cmd run check:enemy-expansion-en-e08-animated-armor-crownvault-castellan`.
  Fast validation passes in 56.4s and full validation in 105.6s with public
  80/259 and all 232 fixtures exact.
  The exact three frozen PNGs are open together in responsive Aseprite 1.3.17.2
  process 32136.
  Approval record `9c21f92aed06a66092279e8d53db6cb9a289cbd9` and the
  implementation are remote verified. Initial published handoff
  `9aea250a9a509a27a233d27633e6f7cf9bb759a2` is also remote verified; this
  reconciliation completes the bounded publication tuple. Do not register, generate fixtures,
  add effects, advance another EN-E08 family, release, accept drift, or open a
  PR.
- Approved preceding private art checkpoint: specialist Animated Armor Runeforge
  Custodian on `codex/en-e08-animated-armor-runeforge-custodian`, based exactly
  on clean published Hollow Sentry reconciliation
  `dc86bb65053564c76b18e848933ab4c2d318bfde`, is frozen at digest
  `629930688cca04f3d714e12225ab8c3db7c494c5fbaf027d65ec7f8d530ccf85`
  and visually approved by the designer's reply `accepted`. Implementation
  `d73ca9334640384d9b531c0d8375c1a42e459212` records the exact accepted
  pixels; approval record `717b4f7f735984550f44ce90d0bba58cfd6e1762`
  and initial handoff `054b100cbf9edc8e13facb5f8a312c03b9a7bdd9`
  are remote verified. This reconciliation completes the bounded publication
  tuple. It is one baked 24x24 actor with zero child
  assets: angular helm, one vertical rune-lock aperture, square pauldrons, hex
  forge chest, connected interlocking gauntlets, rigid joint belt, divided
  greaves, and grounded wedge sabatons. Run
  `npm.cmd run review:enemy-expansion-en-e08-animated-armor-runeforge-custodian`
  and `npm.cmd run
  check:enemy-expansion-en-e08-animated-armor-runeforge-custodian`.
  The frozen review + focused + fast gates pass together in 59.6s and full
  validation passes in 113.1s with public 80/259 and all 232 fixtures exact.
  The exact three frozen PNGs are open together in responsive Aseprite 1.3.17.2
  process 42856.
  Do not register, generate fixtures, add effects, open the
  elite role, advance another EN-E08 family, release, accept drift, or open a
  PR; a separate `lets do next` is required from this clean published reconciliation.
- Approved preceding private art checkpoint:
  `codex/en-e08-animated-armor-architecture`, based exactly on clean published
  Blackwake reconciliation `defc9b8cab1226610da6cf2b17951c8b5815499e`,
  contains one common Animated Armor Hollow Sentry frozen at digest
  `f6e7cbf25692b08e2e4dfccef149662c18d195e4cf615185f7a38e4874e2b9ac`.
  The designer selected `en-e08-baked-single-actor-v1` by replying `lets do
  next` immediately after the recommended baked actor versus deterministic
  child/state choice. Every frame owns the complete helmet, plate body,
  gauntlets, bindings, greaves, and sabatons in one 24x24 pixel array and
  reports zero child assets; schema, shared renderer, exporter, validator, and
  frame-contract changes are forbidden. The Haunted Armor/Animated Armor
  collision is one `animated-armor` family, with Hollow Sentry as its
  haunted-default common role and constructed/specialist/elite identities
  deferred. All 80 frames are connected, bounded, grounded, preserve split
  sabatons and broad plate spans, and differ in pixels and alpha from Fallen
  Knight Shieldbearer, Grave Oathkeeper Revenant, and Gloam Walker. The opaque
  range is 219-306; 72/72 colored frames, 8/8 exact white flashes, 54/54 visor
  views, aliases, mirrors, and baked-topology metadata pass. `check:fast`
  passes in 62.3s and full `check` in 121.5s before approval, then in 61.5s
  and 107.7s against approved-local metadata, with public 80/259 and all 232
  fixtures exact. The exact three frozen PNGs are open together in responsive
  Aseprite 1.3.17.2 process 6832. Run
  `npm.cmd run review:enemy-expansion-en-e08-animated-armor-hollow-sentry` and
  `npm.cmd run check:enemy-expansion-en-e08-animated-armor-hollow-sentry`.
  The designer replied `apprvoed`; in context approval applies only to the
  exact digest above. Implementation
  `914aa700b82469dbb22ca1600f1bc7ad6dbecff7` and approval record
  `6a577566766afc66aa01cdf1c7ebd1430aad425d` plus initial handoff
  `e12ff211dda002ac1c089eaedc0ff369d1e432e0` are remote verified. Status is
  `approved` and `published`; this reconciliation completes the bounded tuple.
  Do not register,
  generate fixtures, add child/state assets or effects, start another
  role/family, release, accept drift, or open a PR. Another art candidate
  requires a separate `lets do next` from this clean published reconciliation.
- Approved preceding art publication checkpoint:
  `codex/en-e07-kelpie-blackwake-dreadmare`, based exactly on clean published
  Drownbridle Stalker reconciliation
  `f9928aed53cd842b937d396e29ec8d6a7aaa8120`, contains one private elite Kelpie
  Blackwake Dreadmare candidate. Its frozen 80-frame digest is
  `be29daec400cffca3f5822aec3bd6ca37c8139a8783f51c7238b47aa37001172`.
  The broad rear-heavy form uses a tall arched neck, long blunt readable muzzle,
  connected breaker mane, massive barrel and sternum, four thick separated legs
  over broad grounded dark hooves, and a connected hooked blackwake tail. All 80
  frames are connected, bounded, grounded, preserve four hoof runs and broad
  tall elite spans, and differ in pixels and alpha from approved Drownbridle
  Stalker, Miremane Courser, and Steppe Hunter. The packet passes 72/72 colored
  frames, 8/8 exact white flashes, 54/54 expected eye-bearing views, 54/54
  readable muzzle views, exact aliases and mirrors, and public 80/259; opaque
  range is 255-319. `check:fast` passes in 62.9s and full `check` in 121.9s
  before approval and 112.2s against approval-local metadata, with all 232
  fixtures exact. The exact raw, Complete B + Form, and comparison PNGs are
  open together in Aseprite process 27380. Run
  `npm.cmd run review:enemy-expansion-en-e07-kelpie-blackwake-dreadmare` and
  `npm.cmd run check:enemy-expansion-en-e07-kelpie-blackwake-dreadmare`.
  The designer replied `approved lets do next` on 2026-08-11; approval applies
  only to the frozen digest above. Exact implementation
  `3a3ffce6997a6cc9735b818e13573b9085229555` and approval record
  `a397f3034b9ce894dd7caf971d4b3c1fbc9cb2e6` plus initial handoff
  `d4cfd72229355ccb6024e676562303bc6d633f98` are published and remote-verified.
  Status is `approved` and `published`; this reconciliation completes the
  bounded tuple. Its later architecture decision is resolved only as the baked
  Hollow Sentry gate above; Kelpie registration, fixtures, runtime copying,
  water effects, release, and accepted drift remain closed.
- Approved preceding art publication checkpoint:
  `codex/en-e07-kelpie-drownbridle-stalker`, based exactly on clean published
  Miremane Courser reconciliation
  `f143de1fadf3b812f3968d930acf6451e926388d`, contains one private specialist
  Kelpie Drownbridle Stalker candidate. Its frozen 80-frame digest is
  `d8cbbfef97b63590e6a63335a6b241e742d87f4df5e7443933c5484ef849224b`.
  The forward-heavy form uses a high arched neck, hooked readable muzzle,
  connected block crest and ochre reed bridle, deep chest, short barrel, four
  separated fetlocked legs and grounded dark hooves, and a connected ropeweed
  tail. All 80 frames are connected, bounded, grounded, preserve four hoof runs
  and specialist spans, and differ in pixels and alpha from approved Miremane
  Courser and Steppe Hunter plus public Dire Wolf. The packet passes 72/72
  colored frames, 8/8 exact white flashes, 54/54 expected eye-bearing views,
  54/54 readable muzzle views, exact aliases and mirrors, public 80/259, and
  unchanged fixtures. The focused gate passes in 0.7s, `check:fast` in 53.2s,
  and full `check` in 104.7s before approval and 110.3s against approved-local
  metadata. The exact raw, Complete B + Form, and comparison PNGs are
  open together in Aseprite at IDs 19, 23, and 27. Run
  `npm.cmd run review:enemy-expansion-en-e07-kelpie-drownbridle-stalker` and
  `npm.cmd run check:enemy-expansion-en-e07-kelpie-drownbridle-stalker`.
  The designer replied `approved lets do next` on 2026-08-11; approval applies
  only to the frozen digest above. Exact implementation
  `c34b3b9564df683900ff3846d692970faca53ff5` and approval record
  `b5a9011b37dc9a3e0db7c371fa168e589665a127` are published and
  remote-verified, and initial handoff
  `1ba57fefe52398c2c007c01adfde6384c327e6f8` is published and remote-verified.
  This reconciliation completes the bounded tuple. The same reply opens only
  one private elite Kelpie candidate; registration, fixtures, runtime copying,
  effects, release, and EN-E08 remain closed.
- Approved preceding art publication checkpoint:
  `codex/en-e07-kelpie-miremane-courser`, based exactly on clean published
  Manyfold Usurper reconciliation
  `6ddef83e03e983672bee39b6b484dd1c1bfcba01`, contains one private common
  Kelpie Miremane Courser candidate. Its frozen 80-frame digest is
  `6efd596731a468be7647ee37f048046072bad289f209926e4db862cb63b01f32`.
  The low lean waterlogged equine uses a bowed wet neck, long readable muzzle,
  connected dripping mane, long ribbed barrel, four separated legs and dark
  grounded hooves, and a connected drowned-weed tail. All 80 frames are
  connected, bounded, grounded, retain four separated hoof contacts and long
  equine spans, and differ in pixels and alpha from approved Steppe Hunter plus
  public Dire Wolf and Marsh Crocodile. The packet passes 72/72 colored frames,
  8/8 exact white flashes, 54/54 expected eye-bearing views, 54/54 readable
  muzzle views, exact Cast/Death aliases, side mirrors, public 80/259,
  unchanged fixtures, the focused gate in 0.5s, `check:fast` in 66.0s, and full
  `check` in 110.4s before approval and 120.2s immediately before the
  implementation commit, 102.4s against approval-local metadata, and 110.8s
  against the final published tuple. The raw, Complete B + Form, and comparison
  PNGs are open
  together in Aseprite as exact frozen paths. The front/rear face, chest/rump,
  tail color, moving hoof separation, and two detached walk legs were corrected
  before freeze. Run
  `npm.cmd run review:enemy-expansion-en-e07-kelpie-miremane-courser` and
  `npm.cmd run check:enemy-expansion-en-e07-kelpie-miremane-courser`.
  The designer replied `approved` on 2026-08-11; approval applies only to the
  frozen digest above. Exact implementation
  `74463a2b1944b7d3a6d412923c205a0c9cc648f1` and approval record
  `8fb53e961247da875814593feb132182648f9e48` plus initial handoff
  `ae532a17e92c3a7b0b99ccd3c938f8174f102dd6` are published and remote-verified.
  This reconciliation completes the bounded tuple. The candidate
  remains unregistered, fixture-free, and non-public. The designer's later
  `lets do next` opens only the private Drownbridle Stalker checkpoint above;
  runtime copying, effects, release, and EN-E08 remain separate closed gates.
- Approved preceding art publication checkpoint:
  `codex/en-e07-changeling-manyfold-usurper`, based exactly on clean published
  Mirrorfold Harrier reconciliation
  `fdbb4cf04048a819b9cbe1655146842835b86a73`, contains one private elite
  Changeling Manyfold Usurper candidate. Its frozen 80-frame digest is
  `f3ed9a91cb01746fc7467e59c92335778a85b476495f5772ac81cf2a6cbda246`.
  The broad tall grounded form uses one connected three-tier fan mantle, deep
  side drapes, one centered readable face, ink-teal/wine/old-gold folds, paired
  heavy ordinary forearms, a pinched middle, wide separated pillar legs, and
  broad slab feet. All 80 frames are connected, bounded, grounded, hard-alpha,
  retain the broad fan and pillar stance, and differ in pixels and alpha from
  approved Mirrorfold Harrier, Veilskin Foundling, and Grand Pretender. The
  packet passes 72/72 colored frames, 8/8 exact white flashes, 54/54 expected
  eye-bearing views, 54/54 readable face-feature views, exact Cast/Death
  aliases, side mirrors, public 80/259, unchanged fixtures, `check:fast` in
  48.5s, and full `check` in 93.1s before approval, 104.1s immediately before
  implementation publication, 112.9s against approval-local metadata, and
  113.4s against the final published tuple. Run
  `npm.cmd run review:enemy-expansion-en-e07-changeling-manyfold-usurper`
  and
  `npm.cmd run check:enemy-expansion-en-e07-changeling-manyfold-usurper`.
  The exact raw, Complete B + Form, and comparison PNGs are open together in
  responsive Aseprite 1.3.17.2 process 39276, whose command line names all
  three paths. The designer replied `approved lets do next` on 2026-08-11;
  exact implementation `38f9d7f9b3ac5a34bdff91be1fd878e158d26bfe`, approval
  record `306aa3ac1ba658cb48e223651410a7df494e7b9e`, and initial handoff
  `0d2f5ce3665f848633b4f7a1596356659d720afe` are published and
  remote-verified. This reconciliation completes the bounded tuple; the same
  reply opens only one private common Kelpie candidate. Registration,
  fixtures, runtime copying, effects, later Kelpie roles, release, and EN-E08
  remain separate gates.
- Approved preceding art publication checkpoint:
  `codex/en-e07-changeling-mirrorfold-harrier`, based exactly on clean
  published Veilskin Foundling reconciliation
  `5eabfecc08f992db675b64ea3317eb59f67d737c`, contains one private specialist
  Changeling Mirrorfold Harrier candidate. Its frozen 80-frame digest is
  `be3e4d03263929ce9677fcf15b742cde769271d037160cd6461b45ea389660f2`.
  The compact grounded form uses one connected stepped diamond mantle, angular
  shoulders, one centered readable face, plum-copper pinched folds, paired long
  ordinary forearms, bent separated legs, and narrow wedge feet. All 80 frames
  are connected, bounded, grounded, hard-alpha, retain the diamond shoulder
  span and narrow paired-leg row, and differ in pixels and alpha from approved
  Veilskin Foundling, Pale Echo, and Falseface Adept. The packet passes 72/72
  colored frames, 8/8 exact white flashes, 54/54 expected eye-bearing views,
  54/54 readable face-feature views, exact Cast/Death aliases, side mirrors,
  public 80/259, unchanged fixtures, `check:fast` in 56.7s, and full `check` in
  106.1s before approval, 138.6s against approval-local metadata, and 95.2s
  against the final published tuple. Run
  `npm.cmd run review:enemy-expansion-en-e07-changeling-mirrorfold-harrier`
  and
  `npm.cmd run check:enemy-expansion-en-e07-changeling-mirrorfold-harrier`.
  The exact raw, Complete B + Form, and comparison PNGs are open together in
  responsive Aseprite 1.3.17.2 process 40804, whose command line names all
  three paths. The designer replied `approved lets do next` on 2026-08-11;
  exact implementation `ab72a9c0600f016439a5351f363b3b34348dc4b1` and
  approval record `e976ca5fc5c249af4e727fb3bff7d58fd541a932` plus initial handoff
  `4ed366a39165660096306cbb327315b211639e3d` are published and remote-verified.
  This reconciliation completes the bounded tuple; the same reply opened only
  the private Manyfold Usurper candidate at the active checkpoint above. Registration, fixtures, runtime
  copying, effects, Kelpie, release, and EN-E08 remain separate gates.
- Approved preceding isolated art checkpoint:
  `codex/en-e07-changeling-veilskin-foundling`, based exactly on clean
  published Mirecrown Beacon reconciliation
  `4ee32622ec2984ac805ac345b854f23584fda3c3`, contains one private common
  Changeling Veilskin Foundling candidate. Its frozen 80-frame digest is
  `e472931d214d369331d6cb750619471d9234ab11561233e700facab6ea4f0126`.
  The small grounded fey form uses one connected pear-shaped living veil, one
  centered face, a narrow ochre-coral folded torso, paired short ordinary
  arms, bowed separated legs, and broad splayed feet. The first digest
  `1a852ef46dcaa7fee5779379cb9eda9acd79e67cd53dd469ff9cfae9dc18844d`
  is superseded after the designer said `could need a more readable face`.
  The repair adds connected dark eye sockets, retained amber glints, and a
  tiny mouth mark only; silhouette, body, and motion remain unchanged. All 80 frames are
  connected, one-cell-bounded, grounded, hard-alpha, and pixel/alpha distinct
  from approved Pale Echo, public Goblin Scout, and public Imp Sprite. The
  packet passes 72/72 colored frames, 8/8 exact white flashes, 54/54 expected
  eye-bearing views, 54/54 readable face-feature views, exact Cast/Death aliases, side mirrors, public 80/259,
  approved Mirecrown and Pale Echo protection, and unchanged fixtures. Run
  `npm.cmd run review:enemy-expansion-en-e07-changeling-veilskin-foundling`
  and
  `npm.cmd run check:enemy-expansion-en-e07-changeling-veilskin-foundling`.
  The revised ten-gate EN-E07 protection matrix passes in 6.3s, `check:fast`
  in 58.3s, and full `check` in 107.1s before approval and 109.0s against
  approval-local metadata, then 119.8s against the final published tuple, with
  all 232 fixtures exact.
  The three exact frozen PNG boards are open together in responsive Aseprite
  1.3.17.2, and its live command line names all three paths.
  The designer replied `approved` on 2026-08-11. Exact implementation
  `2a295aa70c8a6680ffb85881efa4ccd927a50979` and approval record
  `7d064226d9a0096f8b276f5b0bd30be93435962b`, plus initial published handoff
  `0dcd15249d97b3e24bf174b014885fa2c8b6177c`, are published and remote-verified
  on the isolated branch. This reconciliation records the completed bounded
  publication tuple. The packet is not registered or fixture-generated.
  Runtime actor copying, alternate
  bodies, detached masks or veil pieces, effects, specialist/elite Changeling,
  Kelpie, release, and EN-E08 remain separate gates; another candidate requires
  a separate `lets do next`.
- Earlier approved preceding isolated art checkpoint:
  `codex/en-e07-will-o-wisp-mirecrown-beacon`, based exactly on clean
  published Fenbell Shepherd reconciliation
  `8b0754c9594ad91fe378ba11d4f43d7b2a558145`, contains one private elite
  Will-o-Wisp Mirecrown Beacon candidate. Its frozen 80-frame digest is
  `5fbd53af9fb461717a8bd90698a0b2f7f81f8fdd55fee42fbca5254738654d81`.
  The broad sovereign-beacon form uses one connected three-prong crown-wick,
  a wide double-tiered ribbed cage, one central eye, paired connected
  buttresses, a deep living core, broad basin, and four connected lower flame
  tines in the approved family palette. All 80 frames are connected,
  one-cell-bounded, genuinely hovering, hard-alpha, and pixel/alpha distinct
  from approved Fenbell Shepherd, approved Lantern Mote, public Spectral
  Ghost, and public Flame Elemental. The packet passes 72/72 colored frames,
  8/8 white flashes, 54/54 required single-eye views, and an opaque range of
  243-254. A first A3/C3 detached-beam read was repaired before freeze into an
  enclosed cage/core expansion. One post-freeze package build reproduces the
  exact five-artifact packet. All boards and phase sheets were inspected at
  original detail. The protected 26-command matrix passes in 19.0s,
  `check:fast` in 60.4s, and full `check` in 111.2s with the approved
  integration digest and all 232 fixtures exact. The three frozen PNG hashes
  were reverified and those exact files are open together in responsive
  Aseprite 1.3.17.2; its live command line names all three paths. The designer
  replied `approved lets do next` on 2026-08-11; implementation
  `72925cd8d8ea1a3ae47a45601607a1a5853decb3` and approval record
  `6448bb49e16679b94fcc402166b089b6b6ca7174` plus initial handoff
  `72b529bcdd19bd0d3018f2b03ceabcb29a809015` are published and remote
  verified, and full `check` passes in 110.9s against the published tuple. The
  same reply opens only one private common Changeling candidate from this clean
  publication reconciliation. Do not register Will-o-Wisp, generate fixtures,
  add effects, start another role or family beyond that candidate, release, or
  advance EN-E08.
- Approved preceding isolated art checkpoint:
  `codex/en-e07-will-o-wisp-fenbell-shepherd`, based exactly on clean
  published Lantern Mote reconciliation
  `d734846067b3bf9dd05cadffef440ead1f6c6d3a`, contains one private specialist
  Will-o-Wisp Fenbell Shepherd candidate. Its frozen 80-frame digest is
  `0a8000e33705967089ae66c98486eb701da88bfacd9f5adc38a47bbb62f5a46b`.
  All frames are connected, one-cell-bounded, genuinely hovering, hard-alpha,
  and pixel/alpha distinct from approved Lantern Mote, public Spectral Ghost,
  and public Flame Elemental. It uses one connected hooked wick, a tall
  bell-shaped ribbed cage, one guiding core eye, asymmetric connected side
  shutters, an elongated core, a broad lip, and three connected lower flame
  tines. Detached wisps/embers/sparks, sound rings, aura, glow, smoke,
  afterimages, trails, floor light, projectiles, impacts, and illumination
  remain external. The 202-210-pixel packet reproduces all five artifacts
  byte-for-byte twice; 80/80 predecessor/comparison pixel and alpha
  distinctions, 72/72 colored frames, 8/8 white flashes, and 54/54 one-eye
  views pass. All three boards and all eight raw/effects-enabled phase boards
  have been inspected at original detail. The protected 25-command matrix
  passes in 16.8s, `check:fast` in 57.6s, and full `check` in 111.7s with the
  approved integration digest and all 232 fixtures exact. The three frozen PNG
  hashes were reverified and those exact files are open together in responsive
  Aseprite 1.3.17.2. The designer replied `approved` on 2026-08-11;
  implementation `04f113d6e2b95f290925eba040659b441e3cfcd1` and approval
  record `89e2e2cb271dc9af60dd4dce6fba3bccd03cd9d7` plus initial handoff
  `462e7e5123d96f3ff928cd6ff908267cd313570b` are published and remote
  verified, and full `check` passes in 108.7s against the published tuple. Do
  not register Will-o-Wisp, generate fixtures, add effects, start another
  family, release, or advance EN-E08. The designer's later `lets do next`
  reply opened only the private Mirecrown Beacon candidate above.
- Approved preceding art checkpoint (Lantern Mote):
  `codex/en-e07-will-o-wisp-lantern-mote`, based exactly on clean published
  Grand Pretender reconciliation `3ddbe159360f16844d167ecc753d6b767b7e5549`,
  contains one private common Will-o-Wisp Lantern Mote candidate. Its frozen
  80-frame digest is
  `f50a0c6f08b63dde7bad06542140123c5d6bb7fb419b7df2789cffa441a9ebb8`.
  All frames are connected, one-cell-bounded, genuinely hovering, hard-alpha,
  and pixel/alpha distinct from public Spectral Ghost, Shadow Slime, and Flame
  Elemental. It uses one connected stepped wick, broad ribbed cage, single
  visible core eye, tapered inner flame, and two connected lower flame prongs;
  aura, bloom, detached particles, smoke, trails, projectiles, impacts, floor
  light, and illumination remain external. An initial focused check caught and
  repaired one detached lower-prong pixel and duplicate eye pixels before
  freeze. The repaired 146-154-pixel packet reproduces all five artifacts
  byte-for-byte twice. The 24-command protected matrix passed in 16.0s,
  `check:fast` in 55.6s, and full `check` in 108.4s with the approved
  1,200-frame integration digest and all 232 fixtures exact. Both full boards,
  the comparison, and all eight raw/effects-enabled phase boards were
  inspected; the three exact frozen PNGs were opened together in responsive
  Aseprite. The designer replied `approved lets do next` on 2026-08-11;
  implementation `96907f552a06ba3865e25a46f881af5add2237ee` and approval
  record `878e4969de59c500de342555e9b136e3d8cde2de` plus initial handoff
  `71f0fbc07f088d6c366f11dc462856e79e3fde8b` are published and remote
  verified; final publication reconciliation
  `d734846067b3bf9dd05cadffef440ead1f6c6d3a` is remote exact. Do not register
  Will-o-Wisp, generate fixtures, add effects, start the elite or another
  family, release, or advance EN-E08. The same reply opened only the Fenbell
  Shepherd candidate above.
- Approved preceding art checkpoint (Grand Pretender):
  `codex/en-e07-doppelganger-grand-pretender`, based exactly on clean published
  Falseface Adept reconciliation `b16b7d2c8cd91ffbf31e0c9ac55d392c53a4b64c`,
  contains one private elite Doppelganger Grand Pretender. Its approved frozen
  80-frame digest is
  `03ca03ade7be4efcb2e69aafe3400cf6a452d26f1ddbaccca2b561374c172dcb`.
  All frames are connected, one-cell-bounded, grounded, hard-alpha, and
  pixel/alpha distinct from approved Pale Echo, approved Falseface Adept, and
  public Cultist Zealot. It uses one fused three-panel visage, a continuous
  right-swept crest, asymmetric connected mantle, layered split formal coat,
  paired connected claiming hands, separated legs, and grounded broad boots.
  The first packet was rejected before freeze because A1 erased the face under
  a pale hand cap and the inherited fringe made the crest read as horns; the
  repaired 217-273-pixel version restores the face and replaces the fringe
  with one occluding swept hair mass. All five artifacts reproduce
  byte-for-byte twice. The 23-command protected matrix passed in 15.0s,
  `check:fast` in 56.4s, and full `check` in 107.2s with the approved
  1,200-frame integration digest and all 232 fixtures exact. All raw and
  effects-enabled phase boards were inspected, and the three exact frozen
  PNGs were opened together in responsive Aseprite. The designer replied
  `Approved lets do next`; implementation
  `0a8d5094d5e5de575f1966db30fc01d093a866c3` and approval record
  `0c54731d5fc1a14495d13ebb4c2accd98ba8b8a3` plus initial handoff
  `c551799f585df2643f83a605279cda06cc629e45` are published and remote
  verified. The same response opens only one private common Will-o-Wisp
  candidate from the clean publication reconciliation. Do not register Doppelganger, generate
  fixtures, implement runtime copying, add effects, start another
  Will-o-Wisp role or later family, release, or advance EN-E08.
- Approved preceding art checkpoint (Falseface Adept):
  `codex/en-e07-doppelganger-falseface-adept`, based exactly on clean published
  Pale Echo reconciliation `e18a51207868cbcf5b01f55e1c04a50cac43bdcc`,
  contains one private specialist Doppelganger Falseface Adept. Its repaired
  frozen 80-frame digest is
  `16289e68776f0f93d8238d19a3538c4e92e77e108686f8ddfec01b1a783080c6`.
  All frames are connected, one-cell-bounded, grounded, hard-alpha, and
  pixel/alpha distinct from approved Pale Echo, public Cultist Zealot, and
  public Dark Elf. It retains the authored default form and family palette with
  a fused diagonal visage seam, swept fringe, asymmetric high collar,
  cross-seamed short coat, paired connected molding hands, separated legs, and
  grounded boots. The first diagnostic packet was rejected before freeze
  because its colored brace collapsed into a squat block and its attack press
  overfilled the face; the repaired version restores a readable head and split
  legs at 203-261 opaque pixels. All five repaired review artifacts reproduce
  byte-for-byte. The 22-command protected matrix, `check:fast`, and full
  `check` pass with the approved 1,200-frame integration digest and all 232
  fixtures exact. The three exact repaired PNGs were opened together in
  Aseprite, both GIFs were presented, and the designer replied `approved lets
  do next`. Implementation `c415620c2f7f95b98c8b8563a2c1d6e39abb4a73`
  and approval record `cb68ec7e861f7130aafb6c60b1e4b4a16676e9cb` plus initial
  handoff `a215f091022537644a4616e8b0977f12d972eb6d` are published and remote
  verified, with final reconciliation
  `b16b7d2c8cd91ffbf31e0c9ac55d392c53a4b64c`. The same reply opened only the
  private elite Doppelganger candidate above.
- Approved preceding art checkpoint:
  `codex/en-e07-doppelganger-pale-echo`, based exactly on clean published
  Hollowcrown reconciliation `6ff54c3a926436083675ec8f7e2d0230cc073ac5`,
  contains one private common Doppelganger Pale Echo. Its repaired frozen
  80-frame digest is
  `c3fa12cb4bb0be432e955adfc32f331286e55c65cbd7a38250bdf0d120fa6596`.
  All frames are connected, one-cell-bounded, grounded, hard-alpha, and
  pixel/alpha distinct from public Bandit Thug, Cultist Acolyte, and Dark Elf.
  The authored default form uses pale gray-rose skin, uneven charcoal-violet
  fringe, offset eyes, mismatched shoulders, split slate/wine short tunic, one
  ordinary hand, one connected long-finger mimic hand, separated legs, and
  grounded boots. The initial 218-271-pixel diagnostic silhouette was rejected
  before freeze; the repaired public-humanoid-scale version is 186-245 opaque
  pixels. The five exact review artifacts reproduce byte-for-byte, and the
  protected 21-gate matrix, `check:fast`, and full `check` pass with the
  approved 1,200-frame integration digest and all 232 fixtures exact. The three
  exact repaired PNGs were opened together in Aseprite, both GIFs were
  presented, and the designer replied `approved lets do next`. Implementation
  `0628135b84725836c552e13db797540a965854cb` and approval record
  `182938381ac39812434518d0216e6e9796367bbb` plus initial handoff
  `1e6e8d8bb01de97ca4e1373b62b461e40b1aa239` are published and remote
  verified. The same response opens only one private specialist Doppelganger
  candidate from the clean publication reconciliation. Do not register
  Doppelganger, generate fixtures, implement runtime copying, add effects,
  start the elite or another family beyond that candidate, release, or advance
  EN-E08.
- Earlier approved Living Shadow checkpoint:
  `codex/en-e07-living-shadow-hollowcrown-regent`, based exactly on clean
  published Nightglass reconciliation `46ad4e7759a1ef3a096ba326d96cdef44d1ee3b1`,
  contains one private elite Living Shadow Hollowcrown Regent. Its frozen
  80-frame digest is
  `657e4071ab8432387f7c8b6ecff8650f3f7a63bf7dc8f4b68564373a5e450991`.
  All frames are connected, one-cell-bounded, grounded, hard-alpha, and
  pixel/alpha distinct from public Cursed Ghost, public Shadow Slime, approved
  Mist Weaver, Gloam Walker, and Nightglass Seer. The approved family ramp is
  carried by a connected three-prong crown, high mantle, paired narrow eye
  slits, diamond void-heart, command bracers, armored split legs, and broad
  throne-step feet. The five exact review artifacts reproduce byte-for-byte,
  and the protected 20-gate matrix, `check:fast`, and full `check` pass with the
  approved 1,200-frame integration digest and all 232 fixtures exact. The exact
  packet was opened in Aseprite and the designer replied `approved lets do
  next`; implementation `ffe5f574ab9f06ecfaad83c50a7980254eea7211` and
  approval record `90a06bd34e1bae29becdc380b01895825cf4a969` plus initial
  handoff `0c3d671bee3013413291170e127d3820cdcaff95` are published and remote
  verified. The same response opens only one private common Doppelganger
  candidate from the clean publication reconciliation. Do not register Living
  Shadow, generate fixtures, add effects, start another role or family beyond
  that candidate, release, or advance EN-E08.
- Earlier approved art checkpoint:
  `codex/en-e07-living-shadow-nightglass-seer`, based exactly on clean
  published Gloam Walker reconciliation `98d3781b81c8c7ff615ad3cd6562efe12ce63d94`,
  contains one private specialist Living Shadow Nightglass Seer. Its frozen
  80-frame digest is
  `07909fa9b74df6dd386ca3f6186fe4da26e8d088af99ad7e2dfa2bcdeb10d3fa`.
  All frames are connected, one-cell-bounded, grounded, hard-alpha, and
  pixel/alpha distinct from public Cursed Ghost, public Shadow Slime, approved
  Mist Weaver, and approved Gloam Walker. The approved violet-black family ramp
  is carried by a broad faceted mask, one true vertical eye, a connected
  shoulder yoke, squared sight-frame arms, a narrow chest aperture, bent split
  legs, and planted wedge feet. The five exact review artifacts reproduce
  byte-for-byte. The exact packet was opened in Aseprite and the designer
  replied `approved lets do next`; implementation
  `325a6f4cfa1418383c93510262a631358add1d5f` and approval record
  `d50f3af5da0578edf66a5b2f156744c576427b9c` plus initial handoff
  `71d36ef48a55a7f1d49e1e6649a33eb945c9667c` are published and remote
  verified. The protected 19-gate matrix, `check:fast`, and full `check` all
  pass; the approved 1,200-frame integration digest and all 232 fixtures remain
  exact. The same response opens only the Hollowcrown Regent gate above. Do not
  register Living Shadow, generate fixtures, add effects, start another EN-E07
  family, release, or advance EN-E08.
- Earlier approved art checkpoint:
  `codex/en-e07-living-shadow-gloam-walker` contains exactly one private common
  Living Shadow Gloam Walker. The frozen
  80-frame digest is
  `131a95a106a36dea2f6879611c8e14e3aa077012dcbd1bd32e111c45658ca3f9`;
  all frames are connected, one-cell-bounded, grounded, hard-alpha, and
  pixel/alpha distinct from public Cursed Ghost, public Shadow Slime, and
  approved Mist Weaver. The style contract requires chunky one-to-three-pixel
  forms, a tight dark-violet ramp, connected hollow face/torso negative space,
  and clearly split planted legs. The exact raw, Complete B + Form, comparison,
  and paired GIF evidence was presented and the three exact PNGs were opened
  together in Aseprite; the designer replied `aaprovced` on 2026-08-10.
  Implementation `a46f59c1cb0bb751760f2776fe60b5c489806c94` and approval
  record `848c7192b6dc2cac8b7ab2dc8725d3859447715d`, and initial handoff
  `00d5b436c7398312a5f3a05a482b4cf34cee9ba5` are committed and pushed.
  Rivercrown reconciliation `d785fe5` is also pushed. That approval did not
  register Living Shadow, generate fixtures, add effects, release, or open
  another family; the later `lets do next` opens only the Nightglass Seer gate
  above.
- Approved EN-E06 predecessor: `codex/en-e06-nymph-rivercrown-muse`,
  based exactly on clean published Mist Weaver handoff `983b76a`, contains one
  complete approved elite Nymph. Its 80 frames pass connected, one-cell-bounded, grounded,
  hard-alpha, alias, mirror, and 80/80 pixel plus alpha-silhouette distinctions
  from public Elf Mage, approved Spring Dancer, and approved Mist Weaver at
  digest `4917d42fd0b480e4c2635ba4c96725e6b68afec1075dacb8acee2f70dc886bcd`.
  The exact five-artifact packet was opened together in Aseprite and visually
  approved on 2026-08-10. Frozen implementation `39bd065` and approval record
  `ca82f07` are committed and pushed. Full post-approval validation passes in
  111.7s with all 232 fixtures valid. Public Nymph remains absent within 80/259.
  That approval itself stopped before registration, fixtures, EN-E07, effects,
  or release; the later `lets do next` opens only the Gloam Walker gate above.
- The EN-E05 registration gate
  `en-e05-five-undead-registration-v1` is published on
  `codex/en-e05-registration` at `7d273ef`. It registers exact approved
  `mummy/tomb-walker`, `vampire/night-noble`,
  `revenant/grave-oathkeeper`, and `lich/soul-regent` families plus one
  separate internal `ghoul-upgrade/ghoul` replacement record targeting legacy
  `zombie/ghoul`. All 400 source/registered frames and 320 composed-stable
  frames match; aggregate digest is
  `732c6097b237131e85bdf435112c2bed7ec1f8bf8317dee4e42605f0c1730d32`.
  That checkpoint was stable-only; the later consumer gate below exposes only
  the four new families. At the registration checkpoint, public Ghoul,
  fixtures, and Wave 2 were still separate closed gates.
- The separate EN-E05 consumer gate `en-e05-assembler-consumers-v1` is
  published on `codex/en-e05-assembler-integration` at `773cfad`. It exposes
  exact `mummy/tomb-walker`, `vampire/night-noble`,
  `revenant/grave-oathkeeper`, and `lich/soul-regent` through the existing
  generic selectors, randomization, persistence, dispatcher, sheet,
  thumbnail, pack, Complete Kit, and Wildshot routes. All 320 public frames
  match the registered sources at digest
  `947cec4df921761cd5eba378991d7a35b3d773d7e5c0e7c80526ecc6a846a46f`;
  at that checkpoint the Complete Kit was 74 families / 245 enemy sheets /
  2,182 PNGs. This historical gate
  creates no new sprite pixels and does not alter fixtures.
- Historical Wave 2 source checkpoint: the work was once active only through private Hag gate
  `en-e06-hag-mire-crone-full-v1` on `codex/en-e06-hag-mire-crone`, based
  exactly on clean Petalcrown publication record `5c9363e`. Approved
  Bramblewing Scout, Thistle Hexer, and Petalcrown Duelist remain exact and
  published at `cc92ca9`, `3dc68cb`, and `b265e97`. After Petalcrown
  publication, the designer said `lets do nextr`, authorizing only one complete
  common Mire Crone. Its private 80-frame suite passes 80/80 connected,
  bounded, grounded frames; all 80 pixel frames and alpha silhouettes differ
  from public Witch/Hexer; candidate digest is
  `f35512e73fd7b2308bf408f11c2d21a30631361214a372df7bef2e8fc4e6478d`.
  The exact Mire Crone boards and paired GIFs were approved on 2026-08-09 and
  its bounded implementation is published at `25f67d4`. The later designer
  `next` opens only private specialist Cauldron Hexer on
  `codex/en-e06-hag-cauldron-hexer`, based at `b4ad5cd`. Its 80-frame candidate
  passes connected, bounded, grounded, alias, mirror, and 80/80 Mire alpha-
  distinction gates at digest
  `17f40220730fe4e83be26156d73e0599235be66a9290284b37cb9c8282c7a1a6`.
  Its exact packet was approved on 2026-08-09 and the bounded implementation is
  published at `4b59b40`, with clean handoff `0a096fa`. It remains absent from
  the public facade, catalog, and fixtures. The approval reply opened only one
  complete Blackthorn Matron lane on
  `codex/en-e06-hag-blackthorn-matron`. Its private 80-frame candidate passes
  80/80 connected, bounded, grounded frames and differs from both approved
  Hags in every pixel frame and alpha silhouette at digest
  `d4588d754e01dbb4916949f27b801342a310706890a0532a0133216d7cb0c7a9`.
  Its exact boards and GIFs were visually approved on 2026-08-09 and the
  bounded implementation is published at `8ce2f2a`, with clean handoff
  `8e56ec2`. The later `cool next please` opened only common Dryad Grove Tender
  on `codex/en-e06-dryad-grove-tender`. Its private 80-frame suite passes
  80/80 connected, bounded, grounded frames and differs from public Treant and
  approved Blackthorn in every pixel frame and alpha silhouette at digest
  `18fedaf06c457c8a280b3c5518b0763be48de3b3cb5bd29113f0fd5d183e3a21`.
  The exact boards and GIFs were visually approved on 2026-08-09 and the
  bounded implementation is recorded at `3d96fed`, with published approval
  handoff `4c49f27`. The approved private Spore Cantor suite on
  `codex/en-e06-dryad-spore-cantor` passes 80/80 connected, bounded, grounded,
  Treant-distinct, and Grove-distinct frames at digest
  `b22585e7b055f4ae43eb1293741967c1d76ec9bd3b842320880f2038c0cf62ef`.
  Its fungal crown, gills, shelves, and fruiting bodies remain connected while
  spore clouds and motes stay external. The exact raw and outlined review
  packet was visually approved on 2026-08-09; implementation `46d1dc9` and
  approval record `61d1fa4` are published. At that historical checkpoint,
  registration, fixtures, Heartwood Warden, effects, and broader Wave 2 work
  remained closed; the later current gate above authorizes Heartwood separately.
- EN-E05's first isolated, visually approved lane is the full-suite Ghoul
  upgrade lane on `codex/en-e05-ghoul-upgrade`, committed and pushed at
  `88d32e9`. Approval applies only to the exact hash-frozen 80-frame candidate
  and bounded branch publication. The later registration gate records it only
  in a separate internal replacement registry. Public `zombie/ghoul`, all
  Zombie siblings, and the frozen legacy fixture remain unchanged; public
  replacement and fixture regeneration require separate gates.
- The approved second EN-E05 lane is one full-suite Mummy Tomb
  Walker on `codex/en-e05-mummy`, based exactly on the published Ghoul handoff
  `1aa733c`, committed and pushed at `85f1ed7`. It is internal and non-public;
  its 80 frames, paired raw and Complete B + Form evidence, and approved-Ghoul
  comparison are hash-frozen. Its exact approved variant is registered and now
  exposed through the generic EN-E05 consumer layer; fixtures remain gated.
- The approved third EN-E05 lane is one full-suite Vampire
  Night Noble on `codex/en-e05-vampire`, based exactly on reconciled Mummy
  handoff `3387bf2`, committed and pushed at `6a7cce2`. It is internal and
  non-public; its 80 frames, paired raw and Complete B + Form evidence, and
  approved-Mummy comparison are hash-frozen. Its exact approved variant is
  registered and now exposed through the generic EN-E05 consumer layer;
  fixtures remain gated.
- The approved fourth EN-E05 lane is one full-suite Revenant
  Grave Oathkeeper on `codex/en-e05-revenant`, based exactly on reconciled
  Vampire handoff `16f5876`, committed and pushed at `7434578`. It is internal
  and non-public; its 80 frames, paired raw and Complete B + Form evidence, and
  approved-Vampire comparison are hash-frozen. Its exact approved variant is
  registered and now exposed through the generic EN-E05 consumer layer;
  fixtures remain gated.
- The approved fifth EN-E05 lane is one full-suite elite Lich
  Soul Regent on `codex/en-e05-lich`, based exactly on clean reconciled
  Revenant handoff `97db37e`, committed and pushed at `4cebc7b`. Its 80
  connected and bounded frames, approved-Revenant comparison, raw/no-outline
  board and GIF, and Complete B + Form board and GIF are hash-frozen. Its exact
  approved variant is registered and now exposed through the generic EN-E05
  consumer layer. At that checkpoint fixtures, effects, and Wave 2 remained
  gated; at that historical checkpoint, approved Bramblewing and Thistle plus
  the then-unapproved Petalcrown candidate were the only Wave 2 work. Current
  EN-E06 state is governed by the published Fairy, Hag, and Dryad records above.
- 166 of 202 committed asset-pack fixtures are STALE vs the current engine
  (approved repair waves were never re-exported). `npm run export:fixtures -- --verify`
  lists them. The exporter refuses to overwrite them without `--accept-drift`;
  regenerating is a designer decision (downstream repos consume the pack) —
  never pass `--accept-drift` on your own initiative.
- `review:outlines` is stale (expects 240/720 cases, actual 400/1200) — do not
  trust its 31 errors until its counts and baseline hashes are recaptured.
