import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E11_PEACOCK_RAINFAN_FORAGER_GATE } from './enemy-expansion-en-e11-peacock-rainfan-forager.js';
import { EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE } from './enemy-expansion-en-e11-raven-cinderquill-scavenger.js';
import { EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE } from './enemy-expansion-en-e11-raven-gravecrown-harrower.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E11_OWL_TOPOLOGY_DECISION = deepFreeze({
  id: 'en-e11-owl-topology-v1',
  status: 'selected',
  selected: 'baked-single-actor-grounded-facial-disk-owl',
  approvedOn: '2026-08-14',
  approvalEvidence: 'The exact Gravecrown Harrower implementation 4d05b1f4f0ff5113bb31c4ac7011a393b6d877be, approval record 8ec032c2ff90aceffeb8f8cf9533fccac89d68df, initial published handoff e1645f03572073d00c9c9a9f96b70e9daf2d484a, and final reconciliation 2d5fb020541cbe936bd7f5dba33811f7a0be03e4 are pushed and remote verified. The designer then supplied the fresh continuation lets do ext, meaning lets do next. Under the documented Peacock, Cockatrice, Raven, Owl, Phoenix family order this opens only the Owl actor-topology decision. Codex recommended baked-single-actor-grounded-facial-disk-owl and stated that approval would authorize exactly one private common Owl full 80-frame candidate. The designer replied: approved.',
  childAssets: [],
  effectBoundary: 'Loose feathers, flight states, shadow wisps, dust, glow, projectiles, air blades, and impact effects remain external.',
  rationale: 'A single connected actor preserves a broad round facial disk, compact feathered barrel, two body-owned folded wings, two grounded three-toed talon contacts, a small hooked beak, and one short body-owned fan tail in every direction without turning feathers, magic, or shadows into child effects.',
});

export const EN_E11_OWL_HUSHMASK_PROWLER_CONTRACT = deepFreeze({
  family: 'owl',
  variant: 'hushmask-prowler',
  role: 'common',
  state: 'implemented-complete-motion-approved',
  chassis: EN_E11_OWL_TOPOLOGY_DECISION.selected,
  silhouette: 'One connected compact grounded Owl joins a broad round facial disk and head, small hooked beak, short feathered throat, round barrel body, two folded barred wings, two separated three-toed taloned feet, and one short connected fan tail. Attack plants both talons, opens both body-owned wings into a silent crescent screen, drives a compact beak-and-talon pounce, and refolds. It is rounder-faced, shorter-tailed, and more upright than a Raven, neither a long-necked Peacock nor serpent-tailed Cockatrice, and never an exposed-human Harpy or four-legged Griffin.',
  identity: 'Warm umber head and body plumage, a cream-and-taupe facial disk, smoke-brown barred wings, a pale hush throat, a short banded tail, amber eyes, a small ochre beak, and pale horn talons distinguish the common Hushmask Prowler without baking magic, glow, or shadow effects.',
  effectBoundary: EN_E11_OWL_TOPOLOGY_DECISION.effectBoundary,
});

export const EN_E11_OWL_COMMON_CONTRACT_CARD = deepFreeze({
  family: 'owl',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingGate: EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.id,
  activeVariant: {
    id: EN_E11_OWL_HUSHMASK_PROWLER_CONTRACT.variant,
    role: EN_E11_OWL_HUSHMASK_PROWLER_CONTRACT.role,
    status: 'implemented-full-approved-published-reconciled',
  },
  deferredRoles: ['specialist', 'elite'],
});

export const EN_E11_OWL_HUSHMASK_PROWLER_GATE = deepFreeze({
  id: 'en-e11-owl-hushmask-prowler-full-v1',
  status: 'approved',
  authorizedOn: '2026-08-14',
  authorizationEvidence: 'The exact Gravecrown Harrower implementation 4d05b1f4f0ff5113bb31c4ac7011a393b6d877be, approval record 8ec032c2ff90aceffeb8f8cf9533fccac89d68df, initial published handoff e1645f03572073d00c9c9a9f96b70e9daf2d484a, and final reconciliation 2d5fb020541cbe936bd7f5dba33811f7a0be03e4 are pushed and remote verified. The designer then supplied the fresh continuation lets do ext, meaning lets do next. Under the documented Bird-family order that opened only the Owl actor-topology decision. Codex recommended baked-single-actor-grounded-facial-disk-owl: one connected grounded 24x24 Owl with a broad round facial disk, large eyes, small hooked beak, compact feathered body, folded wings, two separated talons, short connected fan tail, and a body-owned crescent-wing pounce, with flight states, magic, glow, projectiles, effects, and child assets excluded. The designer replied approved. This selects that topology and authorizes exactly one private common Owl full 80-frame candidate only. Because the common role was not pre-named, this lane names only Hushmask Prowler. It does not approve candidate pixels or authorize a commit, push, public or outline registration, fixtures, effects, child assets, Owl specialist or elite, Phoenix, release, accepted drift, or a pull request.',
  baseCheckpoint: '2d5fb020541cbe936bd7f5dba33811f7a0be03e4',
  architectureDecision: EN_E11_OWL_TOPOLOGY_DECISION.id,
  approvedOn: '2026-08-14',
  approvalEvidence: 'The final approval prompt posted the exact labeled all-four-direction raw/no-outline, distinct Complete B outlined, Complete B + Form, and Cinderquill-Rainfan-Harpy comparison PNGs together with both synchronized full-suite GIFs and candidate digest c035b53021e4281378d2a43ff9e0d909fa750d4c877837517ed3c2a42beb445a. All four exact PNGs, all eight raw and Complete B + Form phase sheets, the transparent 20x4 inspection atlas, and both exact GIFs were inspected at original resolution and in Aseprite; both GIFs validated as 640x672 four-frame animations and regeneration reproduced every frozen hash. The designer replied: approived. Approval applies only to that exact Hushmask Prowler digest and its six frozen review hashes. It does not open public or outline registration, fixtures, effects, child assets, Owl specialist or elite, Phoenix, another Bird family, release, accepted drift, or a pull request.',
  approvedImplementation: 'e0fd0560ec93d12959d06cd30b593c82be74ffbd',
  publicationAuthorizedOn: '2026-08-14',
  publicationAuthorizationEvidence: 'The designer previously said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact frozen artifact or digest. The designer now replied approived to the exact Hushmask Prowler review packet. This does not authorize public or outline registration, fixtures, effects, child assets, Owl specialist or elite, Phoenix, later families, release, accepted drift, or a pull request.',
  publishedImplementation: 'e0fd0560ec93d12959d06cd30b593c82be74ffbd',
  publishedApprovalRecord: '0e2dbbc6f519c1e135a57686ab1e0600d0327239',
  initialPublishedHandoff: 'afa265a17feca93d2bd1c49cc844c3259e751d04',
  publicationState: 'published',
  precedingApproval: {
    gateId: EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.id,
    candidateFrameDigest: EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.initialPublishedHandoff,
    currentReconciliation: '2d5fb020541cbe936bd7f5dba33811f7a0be03e4',
  },
  artifact: 'enemy-expansion-review/en-e11-owl-hushmask-prowler/en-e11-owl-hushmask-prowler-full-suite-raw.png',
  artifactSha256: '5104046863cfbb3c032a5b4dae7d9ab1e35fe0131c35a00f94133d7fd6205a20',
  outlinedArtifact: 'enemy-expansion-review/en-e11-owl-hushmask-prowler/en-e11-owl-hushmask-prowler-full-suite-outlined-complete-b.png',
  outlinedArtifactSha256: '535cd37776a7ea3ea43d92546ba76bed8809d924724cfaaa7ed51b618bdeccff',
  assembledArtifact: 'enemy-expansion-review/en-e11-owl-hushmask-prowler/en-e11-owl-hushmask-prowler-full-suite-complete-b-form.png',
  assembledArtifactSha256: 'eb278ef44ad8d5233e383824b78f9bd5b9b25e6afcbcbb9f282d3593563d321a',
  comparisonArtifact: 'enemy-expansion-review/en-e11-owl-hushmask-prowler/en-e11-owl-hushmask-prowler-family-comparison.png',
  comparisonArtifactSha256: '9dce39c1ea271ee27da09c8fbbc54d9cff7a17e86bb6a99371834cc95669ddcc',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e11-owl-hushmask-prowler/en-e11-owl-hushmask-prowler-full-suite-four-directions-labeled.gif',
      sha256: '2b81d72f7f22f786dde5e36d20eb3266ee4aaa3c06a52371dfa150186b92bea0',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e11-owl-hushmask-prowler/en-e11-owl-hushmask-prowler-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '2403d2c88534f27f7945b2e7f933e07ad594bb92b8ed7141e7423b33a316403d',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
  },
  candidateFrameDigest: 'c035b53021e4281378d2a43ff9e0d909fa750d4c877837517ed3c2a42beb445a',
  cinderquillComparisonDigest: EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE.candidateFrameDigest,
  rainfanComparisonDigest: EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.candidateFrameDigest,
  harpyComparisonDigest: 'd7d83f0c209a8b4735e0a488a5df128bffa5407e38fd28e4fc38d73b633e5839',
  scope: 'One complete private 80-frame Owl Hushmask Prowler common enemy across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle holds a silent round-faced watch and settles the pale hush throat over two planted talons. Walk alternates two compact grounded owl steps with barred folded-wing and short fan-tail counter-motion. Attack plants both talons, opens both body-owned wings into a broad silent crescent screen, drives a compact hooked-beak and talon pounce, and refolds. Hurt uses a complete-silhouette #f4f4f4 recoil and colored grounded recovery. Cast aliases Attack exactly and Death aliases Hurt H1,H2,H2,H2.',
  anatomyContract: EN_E11_OWL_HUSHMASK_PROWLER_CONTRACT.silhouette,
  reviewPresentation: 'Show the exact labeled all-four-direction Hushmask Prowler raw/no-outline, outlined Complete B, Complete B + Form, Cinderquill/Rainfan/Harpy comparison board, and both synchronized full-suite GIFs together.',
  exclusions: [
    'approved Gravecrown Harrower source module and pixels',
    'approved Cinderquill Scavenger pixel changes',
    'approved Rainfan Forager pixel changes',
    'public Harpy Screecher pixel changes',
    'Owl specialist',
    'Owl elite',
    'Phoenix',
    'additional Bird variants',
    'new Cast pixels',
    'new Death pixels',
    'detached feather child assets',
    'baked loose-feather pixels',
    'baked shadow-wisp pixels',
    'flight-state assets',
    'baked dust pixels',
    'baked glow pixels',
    'baked projectile pixels',
    'baked impact pixels',
    'registration',
    'consumer exposure',
    'fixtures',
    'effects',
    'release',
    'later EN-E11 work',
  ],
  nextGate: 'The exact Hushmask Prowler implementation e0fd0560ec93d12959d06cd30b593c82be74ffbd, approval record 0e2dbbc6f519c1e135a57686ab1e0600d0327239, and initial published handoff afa265a17feca93d2bd1c49cc844c3259e751d04 are pushed and remote verified; this reconciliation completes the bounded Owl common publication tuple. No continuation request accompanied the pixel approval, so no Owl specialist or elite, Phoenix, other Bird family, or other sprite lane is open. Public or outline registration, fixtures, effects, child assets, release, accepted drift, and a pull request remain closed. The distinct outlined PNG remains review evidence only and does not authorize outline registration.',
});

export const EN_E11_OWL_HUSHMASK_PROWLER_DATA = deepFreeze({
  actor: {
    species: 'owl',
    bodyBuild: 'compact-round-facial-disk-owl',
    skin: 'feathered',
    hairStyle: 'round-facial-disk',
    hairColor: 'cream-taupe',
    expression: 'silent-alert',
    faceDetail: 'paired-amber-eyes-and-small-hooked-beak',
    headgear: 'none',
    outfit: 'none',
    outfitColor: 'warm-umber',
    outfitTier: 'tier1',
    weapon: 'none',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: ['#5a463d', '#342a29'],
      hair: ['#d7c8a3', '#9f8c6d'],
      outfit: ['#6b5447', '#3d302e', '#967967'],
    },
  },
  actorTopology: EN_E11_OWL_TOPOLOGY_DECISION.selected,
  childAssets: [],
  owl: {
    head: ['#493b36', '#2a2324', '#756057'],
    body: ['#5a463d', '#342a29', '#80685a'],
    wing: ['#6b5447', '#3d302e', '#967967'],
    throat: ['#d7c8a3', '#9f8c6d', '#efe0b8'],
    tail: ['#463731', '#2b2424', '#766055'],
    bar: ['#b69a74', '#745e4b', '#dac092'],
    beak: ['#b28b45', '#5f4a2d', '#d6ad5b'],
    talon: ['#b69b6a', '#66553f'],
    eye: '#e7a83f',
    feature: '#211919',
  },
  effectBoundary: 'external-flight-states-loose-feathers-shadow-wisps-dust-glow-projectiles-and-impacts',
  bakedEffects: [],
});

const HUSHMASK_PROWLER_VARIANT = deepFreeze({
  id: 'hushmask-prowler',
  name: 'Hushmask Prowler',
  role: EN_E11_OWL_HUSHMASK_PROWLER_CONTRACT.role,
  status: EN_E11_OWL_HUSHMASK_PROWLER_CONTRACT.state,
  brief: 'Common natural Owl with a broad cream facial disk, warm umber round body, barred smoke-brown folded wings, two pale planted talons, and one short connected banded fan tail.',
  rendererData: EN_E11_OWL_HUSHMASK_PROWLER_DATA,
});

export const EN_E11_OWL_HUSHMASK_PROWLER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'silent-disk-watch', upperBob: 0, wingPhase: 0, legPhase: 0, tailMode: 'closed', tailSway: 0, beakReach: 0, flash: false },
  { name: 'hush-throat-settle', upperBob: 1, wingPhase: 1, legPhase: 0, tailMode: 'closed', tailSway: 0, beakReach: 0, flash: false },
]);

const WALK_PHASES = deepFreeze([
  { name: 'left-silent-step', upperBob: 0, wingPhase: 1, legPhase: 1, tailMode: 'closed', tailSway: -1, beakReach: 0, flash: false },
  { name: 'folded-wing-compress', upperBob: 1, wingPhase: 0, legPhase: 2, tailMode: 'closed', tailSway: 0, beakReach: 0, flash: false },
  { name: 'right-silent-step', upperBob: 0, wingPhase: 1, legPhase: 3, tailMode: 'closed', tailSway: 1, beakReach: 0, flash: false },
  { name: 'short-fan-recover', upperBob: 0, wingPhase: 2, legPhase: 4, tailMode: 'closed', tailSway: 0, beakReach: 0, flash: false },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'two-talon-hush-brace', upperBob: 1, wingPhase: 2, legPhase: 1, tailMode: 'braced', tailSway: -1, beakReach: 0, flash: false },
  { name: 'silent-crescent-screen', upperBob: 0, wingPhase: 3, legPhase: 0, tailMode: 'spread', tailSway: 0, beakReach: 0, flash: false },
  { name: 'beak-talon-pounce', upperBob: 0, wingPhase: 4, legPhase: 3, tailMode: 'spread', tailSway: 0, beakReach: 1, flash: false },
  { name: 'folded-owl-recover', upperBob: 1, wingPhase: 1, legPhase: 0, tailMode: 'braced', tailSway: 1, beakReach: 0, flash: false },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-hushmask-recoil', upperBob: 0, wingPhase: 2, legPhase: 1, tailMode: 'braced', tailSway: -1, beakReach: 0, flash: true },
  { name: 'planted-talon-recovery', upperBob: 1, wingPhase: 1, legPhase: 0, tailMode: 'closed', tailSway: 0, beakReach: 0, flash: false },
]);

const FRONT_LEG_PHASES = deepFreeze([
  { leftX: 0, rightX: 0 },
  { leftX: -1, rightX: 1 },
  { leftX: 1, rightX: 0 },
  { leftX: 0, rightX: -1 },
  { leftX: -1, rightX: 0 },
]);

const SIDE_LEG_PHASES = deepFreeze([
  { farX: 0, nearX: 0 },
  { farX: -1, nearX: 1 },
  { farX: 0, nearX: 1 },
  { farX: -1, nearX: 0 },
  { farX: 0, nearX: 0 },
]);

function createColorContext(context, forcedColor = null) {
  let fillStyle = context.fillStyle;
  return {
    get fillStyle() {
      return forcedColor || fillStyle;
    },
    set fillStyle(value) {
      fillStyle = value;
      context.fillStyle = forcedColor || value;
    },
    onOutOfBounds(write) {
      if (typeof context.onOutOfBounds === 'function') context.onOutOfBounds(write);
    },
    clearRect(x, y, width, height) {
      context.clearRect(x, y, width, height);
    },
    fillRect(x, y, width, height) {
      context.fillStyle = forcedColor || fillStyle;
      context.fillRect(x, y, width, height);
    },
  };
}

function createPainter(context, direction) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Hushmask Prowler rectangles must use positive integer geometry.',
    );
    context.fillStyle = fill;
    context.fillRect(mirrored ? SIZE - x - width : x, y, width, height);
  };
  return {
    view,
    rect,
    dot(x, y, fill) {
      rect(x, y, 1, 1, fill);
    },
  };
}

function drawFrontTail(paint, phase, rearView) {
  const { tail } = EN_E11_OWL_HUSHMASK_PROWLER_DATA.owl;
  const sway = phase.tailSway;
  if (phase.tailMode === 'spread') {
    paint.rect(7, 14, 10, 4, tail[0]);
    paint.rect(6, 17, 12, 2, tail[1]);
    paint.rect(8, 19, 8, 2, tail[2]);
    paint.dot(7, 19, tail[2]);
    paint.dot(16, 19, tail[2]);
    return;
  }
  if (phase.tailMode === 'braced') {
    paint.rect(8 + sway, 15, 8, 3, tail[0]);
    paint.rect(7 + sway, 18, 10, 2, tail[1]);
    paint.rect(9 + sway, 20, 6, 1, tail[2]);
    return;
  }
  paint.rect(9 + sway, 15, 6, 3, tail[0]);
  paint.rect(8 + sway, 18, 8, 2, tail[1]);
  paint.rect(9 + sway, 20, 6, 1, rearView ? tail[2] : tail[0]);
}

function drawSideTail(paint, phase) {
  const { tail } = EN_E11_OWL_HUSHMASK_PROWLER_DATA.owl;
  const sway = phase.tailSway;
  if (phase.tailMode === 'spread') {
    paint.rect(6, 14, 8, 4, tail[0]);
    paint.rect(4, 17, 10, 2, tail[1]);
    paint.rect(3, 19, 9, 2, tail[2]);
    paint.dot(3, 18, tail[0]);
    return;
  }
  if (phase.tailMode === 'braced') {
    paint.rect(6 + sway, 15, 8, 3, tail[0]);
    paint.rect(4 + sway, 18, 10, 2, tail[1]);
    paint.rect(4 + sway, 20, 7, 1, tail[2]);
    return;
  }
  paint.rect(7 + sway, 15, 6, 3, tail[0]);
  paint.rect(5 + sway, 18, 8, 2, tail[1]);
  paint.rect(5 + sway, 20, 6, 1, tail[2]);
}

function drawTail(paint, phase, rearView) {
  if (paint.view === 'right') drawSideTail(paint, phase);
  else drawFrontTail(paint, phase, rearView);
}

function drawFrontBody(paint, phase, rearView) {
  const { body, wing, bar } = EN_E11_OWL_HUSHMASK_PROWLER_DATA.owl;
  const bob = phase.upperBob;
  paint.rect(7, 9 + bob, 10, 10, body[0]);
  paint.rect(6, 11 + bob, 12, 6, body[0]);
  paint.rect(8, 17 + bob, 8, 2, body[1]);
  paint.rect(8, 11 + bob, 8, 7, rearView ? body[2] : body[0]);
  if (phase.wingPhase === 4) {
    paint.rect(1, 9 + bob, 9, 4, wing[0]);
    paint.rect(2, 13 + bob, 8, 3, wing[1]);
    paint.rect(4, 16 + bob, 6, 2, wing[2]);
    paint.rect(14, 9 + bob, 9, 4, wing[0]);
    paint.rect(14, 13 + bob, 8, 3, wing[1]);
    paint.rect(14, 16 + bob, 6, 2, wing[2]);
    paint.rect(4, 11 + bob, 5, 1, bar[2]);
    paint.rect(15, 11 + bob, 5, 1, bar[2]);
    paint.dot(1, 15 + bob, wing[2]);
    paint.dot(22, 15 + bob, wing[2]);
    return;
  }
  if (phase.wingPhase === 3) {
    paint.rect(2, 6 + bob, 7, 4, wing[2]);
    paint.rect(1, 9 + bob, 9, 5, wing[0]);
    paint.rect(2, 14 + bob, 8, 3, wing[1]);
    paint.rect(15, 6 + bob, 7, 4, wing[2]);
    paint.rect(14, 9 + bob, 9, 5, wing[0]);
    paint.rect(14, 14 + bob, 8, 3, wing[1]);
    paint.rect(4, 10 + bob, 5, 1, bar[2]);
    paint.rect(15, 10 + bob, 5, 1, bar[2]);
    return;
  }
  if (phase.wingPhase === 2) {
    paint.rect(4, 10 + bob, 7, 8, wing[0]);
    paint.rect(13, 10 + bob, 7, 8, wing[0]);
    paint.rect(4, 15 + bob, 7, 3, wing[1]);
    paint.rect(13, 15 + bob, 7, 3, wing[1]);
    paint.rect(6, 12 + bob, 4, 1, bar[0]);
    paint.rect(14, 12 + bob, 4, 1, bar[0]);
    paint.dot(4, 17 + bob, wing[2]);
    paint.dot(19, 17 + bob, wing[2]);
    return;
  }
  const lower = phase.wingPhase === 1 ? 1 : 0;
  paint.rect(5, 10 + bob + lower, 6, 8, wing[0]);
  paint.rect(13, 10 + bob + lower, 6, 8, wing[0]);
  paint.rect(5, 15 + bob + lower, 6, 3, wing[1]);
  paint.rect(13, 15 + bob + lower, 6, 3, wing[1]);
  paint.rect(6, 12 + bob + lower, 4, 1, bar[0]);
  paint.rect(14, 12 + bob + lower, 4, 1, bar[0]);
  paint.dot(6, 17 + bob + lower, wing[2]);
  paint.dot(17, 17 + bob + lower, wing[2]);
}

function drawSideBody(paint, phase) {
  const { body, wing, bar } = EN_E11_OWL_HUSHMASK_PROWLER_DATA.owl;
  const bob = phase.upperBob;
  paint.rect(7, 9 + bob, 11, 10, body[0]);
  paint.rect(6, 11 + bob, 12, 6, body[0]);
  paint.rect(8, 17 + bob, 9, 2, body[1]);
  paint.rect(9, 11 + bob, 8, 7, body[2]);
  if (phase.wingPhase === 4) {
    paint.rect(8, 8 + bob, 14, 6, wing[0]);
    paint.rect(9, 14 + bob, 13, 3, wing[1]);
    paint.rect(13, 12 + bob, 7, 1, bar[2]);
    paint.dot(22, 8 + bob, wing[2]);
    paint.dot(21, 16 + bob, wing[2]);
    return;
  }
  if (phase.wingPhase === 3) {
    paint.rect(5, 6 + bob, 10, 11, wing[0]);
    paint.rect(7, 5 + bob, 7, 5, wing[2]);
    paint.rect(5, 14 + bob, 10, 3, wing[1]);
    paint.rect(8, 9 + bob, 6, 1, bar[2]);
    return;
  }
  if (phase.wingPhase === 2) {
    paint.rect(5, 10 + bob, 11, 8, wing[0]);
    paint.rect(5, 15 + bob, 10, 3, wing[1]);
    paint.rect(8, 12 + bob, 6, 1, bar[0]);
    paint.dot(6, 17 + bob, wing[2]);
    return;
  }
  const lower = phase.wingPhase === 1 ? 1 : 0;
  paint.rect(6, 10 + bob + lower, 10, 8, wing[0]);
  paint.rect(6, 15 + bob + lower, 9, 3, wing[1]);
  paint.rect(8, 12 + bob + lower, 6, 1, bar[0]);
  paint.dot(7, 17 + bob + lower, wing[2]);
}

function drawBody(paint, phase, rearView) {
  if (paint.view === 'right') drawSideBody(paint, phase);
  else drawFrontBody(paint, phase, rearView);
}

function drawFrontLeg(paint, x, rearView) {
  const { body, talon } = EN_E11_OWL_HUSHMASK_PROWLER_DATA.owl;
  paint.rect(x, 17, 2, 3, body[1]);
  paint.rect(x, 19, 2, 3, talon[1]);
  paint.rect(x - 1, 22, 4, 1, rearView ? talon[1] : talon[0]);
}

function drawSideLeg(paint, x, farLeg) {
  const { body, talon } = EN_E11_OWL_HUSHMASK_PROWLER_DATA.owl;
  paint.rect(x, 17, 2, 3, farLeg ? body[1] : body[0]);
  paint.rect(x, 19, 2, 3, talon[1]);
  paint.rect(x - 1, 22, 4, 1, farLeg ? talon[1] : talon[0]);
}

function drawLegs(paint, phase, rearView) {
  if (paint.view === 'right') {
    const state = SIDE_LEG_PHASES[phase.legPhase];
    drawSideLeg(paint, 10 + state.farX, true);
    drawSideLeg(paint, 15 + state.nearX, false);
    return;
  }
  const state = FRONT_LEG_PHASES[phase.legPhase];
  drawFrontLeg(paint, 9 + state.leftX, rearView);
  drawFrontLeg(paint, 15 + state.rightX, rearView);
}

function drawFrontHead(paint, phase, rearView) {
  const { head, throat, bar, beak, eye, feature } = EN_E11_OWL_HUSHMASK_PROWLER_DATA.owl;
  const bob = phase.upperBob;
  paint.rect(8, 9 + bob, 8, 5, throat[0]);
  paint.rect(9, 11 + bob, 6, 4, throat[1]);
  paint.rect(7, 3 + bob, 10, 9, head[0]);
  paint.rect(6, 5 + bob, 12, 6, head[0]);
  paint.rect(8, 2 + bob, 8, 2, head[1]);
  if (rearView) {
    paint.rect(8, 4 + bob, 8, 7, head[1]);
    paint.rect(9, 5 + bob, 6, 1, bar[2]);
    paint.rect(8, 8 + bob, 8, 1, bar[0]);
    paint.rect(10, 10 + bob, 4, 2, head[2]);
    return;
  }
  paint.rect(8, 4 + bob, 8, 7, throat[0]);
  paint.rect(7, 6 + bob, 10, 4, throat[0]);
  paint.rect(9, 5 + bob, 6, 5, throat[2]);
  paint.dot(9, 6 + bob, eye);
  paint.dot(14, 6 + bob, eye);
  paint.dot(9, 7 + bob, feature);
  paint.dot(14, 7 + bob, feature);
  paint.rect(10, 8 + bob, 4, 1, beak[2]);
  paint.rect(11, 9 + bob, 2, 2 + phase.beakReach, beak[0]);
  paint.rect(11, 10 + bob + phase.beakReach, 2, 1, beak[1]);
}

function drawSideHead(paint, phase) {
  const { head, throat, beak, eye, feature } = EN_E11_OWL_HUSHMASK_PROWLER_DATA.owl;
  const bob = phase.upperBob;
  paint.rect(11, 9 + bob, 7, 5, throat[0]);
  paint.rect(12, 11 + bob, 6, 4, throat[1]);
  paint.rect(11, 3 + bob, 10, 9, head[0]);
  paint.rect(10, 5 + bob, 12, 6, head[0]);
  paint.rect(12, 2 + bob, 8, 2, head[1]);
  paint.rect(13, 4 + bob, 8, 7, throat[0]);
  paint.rect(14, 5 + bob, 7, 5, throat[2]);
  paint.dot(18, 6 + bob, eye);
  paint.dot(18, 7 + bob, feature);
  paint.rect(19, 8 + bob, 4, 2, beak[0]);
  paint.dot(22, 9 + bob + phase.beakReach, beak[1]);
}

function drawHead(paint, phase, rearView) {
  if (paint.view === 'right') drawSideHead(paint, phase);
  else drawFrontHead(paint, phase, rearView);
}

export function drawOwlHushmaskProwlerAnatomy(context, direction, phase) {
  const paint = createPainter(context, direction);
  const rearView = paint.view === 'up';
  drawTail(paint, phase, rearView);
  drawBody(paint, phase, rearView);
  drawLegs(paint, phase, rearView);
  drawHead(paint, phase, rearView);
}

function renderAnatomy(args, phase) {
  args.context.clearRect(0, 0, SIZE, SIZE);
  const colorContext = createColorContext(args.context, phase.flash ? '#f4f4f4' : null);
  drawOwlHushmaskProwlerAnatomy(colorContext, args.direction, phase);
}

function resultFor(args, renderedAnimation, renderedFrame, motion) {
  return Object.freeze({
    family: args.family.id,
    variant: args.variant.id,
    direction: args.direction,
    animation: args.animation.id,
    frame: args.frame,
    renderedAnimation,
    renderedFrame,
    owlHushmaskProwlerGate: EN_E11_OWL_HUSHMASK_PROWLER_GATE.id,
    architectureDecision: EN_E11_OWL_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.id,
    role: EN_E11_OWL_HUSHMASK_PROWLER_CONTRACT.role,
    anatomy: EN_E11_OWL_HUSHMASK_PROWLER_CONTRACT.chassis,
    upperBody: 'broad-cream-facial-disk-round-umber-head-pale-throat-and-two-barred-smoke-brown-wings',
    lowerBody: 'compact-feathered-barrel-two-grounded-three-toed-horn-talons-and-one-short-connected-banded-fan-tail',
    motion,
    childAssetCount: EN_E11_OWL_HUSHMASK_PROWLER_DATA.childAssets.length,
    effectBoundary: EN_E11_OWL_HUSHMASK_PROWLER_DATA.effectBoundary,
  });
}

function renderIdle(args) {
  const phase = IDLE_PHASES[args.frame];
  renderAnatomy(args, phase);
  return resultFor(args, 'idle', args.frame, phase.name);
}

function renderWalk(args) {
  const phase = WALK_PHASES[args.frame];
  renderAnatomy(args, phase);
  return resultFor(args, 'walk', args.frame, phase.name);
}

function renderAttack(args, outputAnimation = 'attack', outputFrame = args.frame) {
  const phase = ATTACK_PHASES[args.frame];
  renderAnatomy(args, phase);
  return resultFor(
    { ...args, animation: { ...args.animation, id: outputAnimation }, frame: outputFrame },
    'attack',
    args.frame,
    outputAnimation === 'cast' ? 'exact-cast-alias-of-grounded-hushmask-wing-screen-and-beak-rake' : phase.name,
  );
}

function renderHurt(args, outputAnimation = 'hurt', outputFrame = args.frame) {
  const phase = HURT_PHASES[args.frame];
  renderAnatomy(args, phase);
  return resultFor(
    { ...args, animation: { ...args.animation, id: outputAnimation }, frame: outputFrame },
    'hurt',
    args.frame,
    outputAnimation === 'death' ? 'exact-death-alias-of-grounded-hushmask-recoil' : phase.name,
  );
}

function renderOwlHushmaskProwler(args) {
  assert(args.family.id === 'owl', 'The EN-E11 Owl renderer is restricted to Owl.');
  assert(args.variant.id === 'hushmask-prowler', 'The EN-E11 Owl renderer is restricted to Hushmask Prowler.');
  if (args.animation.id === 'idle') {
    assert(args.frame >= 0 && args.frame < 2, 'Owl Hushmask Prowler Idle authorizes only F1-F2.');
    return renderIdle(args);
  }
  if (args.animation.id === 'walk') {
    assert(args.frame >= 0 && args.frame < 4, 'Owl Hushmask Prowler Walk authorizes only W1-W4.');
    return renderWalk(args);
  }
  if (args.animation.id === 'attack') {
    assert(args.frame >= 0 && args.frame < 4, 'Owl Hushmask Prowler Attack authorizes only A1-A4.');
    return renderAttack(args);
  }
  if (args.animation.id === 'hurt') {
    assert(args.frame >= 0 && args.frame < 2, 'Owl Hushmask Prowler Hurt authorizes only H1-H2.');
    return renderHurt(args);
  }
  if (args.animation.id === 'cast') {
    assert(args.frame >= 0 && args.frame < 4, 'Owl Hushmask Prowler Cast authorizes only C1-C4.');
    return renderAttack({ ...args, animation: { ...args.animation, id: 'attack' } }, 'cast', args.frame);
  }
  if (args.animation.id === 'death') {
    assert(args.frame >= 0 && args.frame < 4, 'Owl Hushmask Prowler Death authorizes only D1-D4.');
    const sourceFrame = EN_E11_OWL_HUSHMASK_PROWLER_DEATH_SOURCE_FRAMES[args.frame];
    return renderHurt({ ...args, animation: { ...args.animation, id: 'hurt' }, frame: sourceFrame }, 'death', args.frame);
  }
  throw new TypeError('The EN-E11 Owl Hushmask Prowler gate authorizes only Idle, Walk, Attack, Cast, Hurt, and Death.');
}

export const EN_E11_OWL_HUSHMASK_PROWLER_RENDERER = Object.freeze({
  key: 'en-e11-owl-hushmask-prowler-full-v1',
  chassis: EN_E11_OWL_HUSHMASK_PROWLER_CONTRACT.chassis,
  render: renderOwlHushmaskProwler,
});

export const EN_E11_OWL_HUSHMASK_PROWLER_FAMILY = deepFreeze({
  id: 'owl',
  name: 'Owl',
  sliceId: 'EN-E11',
  rendererKey: EN_E11_OWL_HUSHMASK_PROWLER_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [HUSHMASK_PROWLER_VARIANT],
  rendererData: {
    approvedPrecedingGate: EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.id,
    activeGate: EN_E11_OWL_HUSHMASK_PROWLER_GATE.id,
    topologyDecision: EN_E11_OWL_TOPOLOGY_DECISION.id,
  },
  review: {
    baselineVariant: 'hushmask-prowler',
    scale: 6,
    notes: 'Published and reconciled private Hushmask Prowler common Owl only, bound to exact implementation e0fd0560ec93d12959d06cd30b593c82be74ffbd, approval record 0e2dbbc6f519c1e135a57686ab1e0600d0327239, initial published handoff afa265a17feca93d2bd1c49cc844c3259e751d04, candidate digest c035b53021e4281378d2a43ff9e0d909fa750d4c877837517ed3c2a42beb445a, and its six frozen review hashes. No continuation request was supplied, so the next gate stays closed. Keep public or outline registration, fixtures, effects, child assets, Owl specialist or elite, Phoenix, release, accepted drift, and a pull request separate.',
  },
});

export const EN_E11_OWL_HUSHMASK_PROWLER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E11_OWL_HUSHMASK_PROWLER_RENDERER],
  families: [EN_E11_OWL_HUSHMASK_PROWLER_FAMILY],
});
