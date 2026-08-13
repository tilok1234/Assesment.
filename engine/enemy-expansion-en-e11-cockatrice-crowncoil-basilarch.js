import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E11_COCKATRICE_TOPOLOGY_DECISION,
} from './enemy-expansion-en-e11-cockatrice-bramblecomb-scratcher.js';
import {
  EN_E11_COCKATRICE_GLOAMGAZE_STALKER_GATE,
} from './enemy-expansion-en-e11-cockatrice-gloamgaze-stalker.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_CONTRACT = deepFreeze({
  family: 'cockatrice',
  variant: 'crowncoil-basilarch',
  role: 'elite',
  state: 'implemented-complete-motion-approved',
  chassis: EN_E11_COCKATRICE_TOPOLOGY_DECISION.selected,
  silhouette: 'One connected broad high-crowned cockerel-and-serpent actor joins a tall three-pronged crown comb and plated wattle, hooked beak, thick brass-plated scaled neck, deep feathered torso, two layered mantle wings, two separated broad taloned feet, and one heavy body-owned serpent tail ending in a raised crown-hook coil. It is wider and heavier than both Gloamgaze Stalker and Bramblecomb Scratcher and is neither a fan-tailed Peacock, upright Birdfolk person, ordinary two-legged bird, nor quadruped basilisk.',
  identity: 'Obsidian-blue head scales, an antique-gold plated throat, deep royal-burgundy body, layered brass mantle wings, crimson three-pronged crown comb, ivory hooked beak, acid-gold eyes, bronze talons, and a dark blue-green crown-hook serpent tail distinguish the Crowncoil Basilarch elite.',
  effectBoundary: EN_E11_COCKATRICE_TOPOLOGY_DECISION.effectBoundary,
});

export const EN_E11_COCKATRICE_ELITE_CONTRACT_CARD = deepFreeze({
  family: 'cockatrice',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingGate: EN_E11_COCKATRICE_GLOAMGAZE_STALKER_GATE.id,
  precedingVariant: {
    id: 'gloamgaze-stalker',
    role: 'specialist',
    status: 'implemented-full-approved-published-reconciled',
  },
  activeVariant: {
    id: EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_CONTRACT.variant,
    role: EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_CONTRACT.role,
    status: 'implemented-full-approved-published-reconciled',
  },
  deferredRoles: [],
});

export const EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE = deepFreeze({
  id: 'en-e11-cockatrice-crowncoil-basilarch-full-v1',
  status: 'approved',
  authorizedOn: '2026-08-14',
  authorizationEvidence: 'The exact Gloamgaze Stalker implementation cb227af79e2e7db39609d8bb5524942387026333, approval record ab1cab569aa4fbd69a6b2ec9ca60f838792c481b, initial published handoff 1fbad52011fb4e3d95c3b64f2b8ad280d290b22b, and final reconciliation 9d5c942fbdeb49db8c232fc763972962b56e8837 are pushed and remote verified. The prior approval reply aproved did not continue. The designer then supplied a fresh continuation request: lets do next. Under the documented Cockatrice role order and selected baked-single-actor-grounded-serpent-tailed-cockerel topology, that fresh request authorizes exactly one private elite Cockatrice full 80-frame candidate only. It does not approve candidate pixels or authorize a commit, push, public or outline registration, fixtures, effects, child assets, Raven, Owl, Phoenix, release, accepted drift, or a pull request.',
  baseCheckpoint: '9d5c942fbdeb49db8c232fc763972962b56e8837',
  architectureDecision: EN_E11_COCKATRICE_TOPOLOGY_DECISION.id,
  approvedOn: '2026-08-14',
  approvalEvidence: 'The exact labeled all-four-direction raw/no-outline, distinct Complete B outlined, Complete B + Form, and approved Gloamgaze Stalker, approved Bramblecomb Scratcher, and public Marsh Crocodile comparison PNGs were frozen with both synchronized GIF hashes. All four exact PNG paths and all four raw phase sheets were loaded and inspected at original resolution, and the transparent 20x4 inspection atlas passed dimensions, hard alpha, non-empty-cell, and strict boundary checks. The final approval prompt posted all four exact PNGs, both synchronized GIFs, and candidate digest 5beeb0036af6f5c9dc9bfb64c0121e548a372f31ee257e53c0765e3b031c2bb0. The designer replied: approved lets do next. Approval applies only to that exact Crowncoil Basilarch digest and its six frozen review hashes. The continuation is held until this bounded publication tuple is pushed, remote verified, and reconciled; it then opens only the next documented Bird-family decision gate and does not choose a topology or approve later candidate pixels. Public or outline registration, fixtures, effects, child assets, release, accepted drift, and a pull request remain separate.',
  approvedImplementation: '5d4ebe9dea7a8a85d0adeec0e34a0b3be8a016ef',
  publicationAuthorizedOn: '2026-08-14',
  publicationAuthorizationEvidence: 'The designer previously said: you have my pertmission to commit and push everything i approve. After approving Crowncoil, the designer added: and commit and push all aproved please. This authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes for the exact approved packet only. It does not authorize registration, fixtures, effects, child assets, later-family pixels, release, accepted drift, or a pull request.',
  publishedImplementation: '5d4ebe9dea7a8a85d0adeec0e34a0b3be8a016ef',
  publishedApprovalRecord: '27e60acd72f9c00de886d8fd0d7e1d899c7f2bb7',
  initialPublishedHandoff: '7f588bf305072e80a4bf3c4d913dfaba1f389416',
  publicationState: 'published',
  precedingApproval: {
    gateId: EN_E11_COCKATRICE_GLOAMGAZE_STALKER_GATE.id,
    candidateFrameDigest: EN_E11_COCKATRICE_GLOAMGAZE_STALKER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E11_COCKATRICE_GLOAMGAZE_STALKER_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E11_COCKATRICE_GLOAMGAZE_STALKER_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E11_COCKATRICE_GLOAMGAZE_STALKER_GATE.initialPublishedHandoff,
    currentReconciliation: '9d5c942fbdeb49db8c232fc763972962b56e8837',
  },
  artifact: 'enemy-expansion-review/en-e11-cockatrice-crowncoil-basilarch/en-e11-cockatrice-crowncoil-basilarch-full-suite-raw.png',
  artifactSha256: '996e0aadf855f5cc5497abc2fe37b8dd529659b97a050d4390e91934637bfbd1',
  outlinedArtifact: 'enemy-expansion-review/en-e11-cockatrice-crowncoil-basilarch/en-e11-cockatrice-crowncoil-basilarch-full-suite-outlined-complete-b.png',
  outlinedArtifactSha256: '61267a117b812efc382084a7d3ae5c00df0a95ef99dbc7ff6cefd7e975f64ff9',
  assembledArtifact: 'enemy-expansion-review/en-e11-cockatrice-crowncoil-basilarch/en-e11-cockatrice-crowncoil-basilarch-full-suite-complete-b-form.png',
  assembledArtifactSha256: '0bdaf2170643c164cf0cfa7dbcd3d539bef1f9a70094a517650f60ddf26f531d',
  comparisonArtifact: 'enemy-expansion-review/en-e11-cockatrice-crowncoil-basilarch/en-e11-cockatrice-crowncoil-basilarch-family-comparison.png',
  comparisonArtifactSha256: 'd9f841a9261f58a34a5fc6bc9571563d706bd2167fb5f42395afc1d5d76f439d',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e11-cockatrice-crowncoil-basilarch/en-e11-cockatrice-crowncoil-basilarch-full-suite-four-directions-labeled.gif',
      sha256: '7f31d3a07e0ff6db7739f9606bdcf4c4dfedb2b484ab13fed2ef20e9ba11cd7d',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e11-cockatrice-crowncoil-basilarch/en-e11-cockatrice-crowncoil-basilarch-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '5613e1e2c50125e8bb758f9b545a912ff3e22387b78b48bc3d12d7c8d3a0135d',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
  },
  candidateFrameDigest: '5beeb0036af6f5c9dc9bfb64c0121e548a372f31ee257e53c0765e3b031c2bb0',
  gloamgazeComparisonDigest: '7752f15be95848bb5af6d1b89e79cd9f07ff3f1be8776427857497773d5b4eb8',
  bramblecombComparisonDigest: '0d55f7dc0fafac3014bcdfa1ea2dce3cbb4b5ba09eb6c52f6c723067702b9764',
  marshCrocodileComparisonDigest: 'aaabe38311ec314f97b902e92ee6f426199f33c2f5051e8a7ffc7a58c737a19a',
  scope: 'One complete private 80-frame Cockatrice Crowncoil Basilarch elite enemy across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle holds a broad crown-vigil with a breathing mantle and grounded crown-hook coil. Walk alternates two heavy throne steps with plated throat, mantle, crown, and connected tail counter-motion. Attack plants both talons in a crown-brace, raises both mantle wings, drives the body-owned serpent tail into a high crown-hook press with a short beak strike, and settles into a sovereign recovery. Hurt uses a complete-silhouette #f4f4f4 recoil and colored grounded recovery. Cast aliases Attack exactly and Death aliases Hurt H1,H2,H2,H2.',
  anatomyContract: EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_CONTRACT.silhouette,
  reviewPresentation: 'Show the exact labeled all-four-direction Crowncoil Basilarch raw/no-outline, outlined Complete B, Complete B + Form, Gloamgaze/Bramblecomb/Marsh Crocodile comparison board, and both synchronized full-suite GIFs together.',
  exclusions: [
    'approved Gloamgaze Stalker pixel changes',
    'approved Bramblecomb Scratcher pixel changes',
    'public Marsh Crocodile pixel changes',
    'Raven',
    'Owl',
    'Phoenix',
    'new Cast pixels',
    'new Death pixels',
    'detached serpent-tail child assets',
    'baked petrifying-gaze pixels',
    'baked venom pixels',
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
  nextGate: 'The exact Crowncoil Basilarch implementation 5d4ebe9dea7a8a85d0adeec0e34a0b3be8a016ef, approval record 27e60acd72f9c00de886d8fd0d7e1d899c7f2bb7, and initial published handoff 7f588bf305072e80a4bf3c4d913dfaba1f389416 are pushed and remote verified; this reconciliation completes the bounded Cockatrice publication tuple. The approved continuation lets do next now opens only the documented Raven topology decision gate. It does not select a Raven topology, authorize Raven candidate pixels, or open Owl, Phoenix, public or outline registration, fixtures, effects, child assets, release, accepted drift, or a pull request. The distinct outlined PNG remains review evidence only and does not authorize outline registration.',
});

export const EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_DATA = deepFreeze({
  actor: {
    species: 'cockatrice',
    bodyBuild: 'broad-high-crowned-crowncoil-cockerel',
    skin: 'feathered-scaled',
    hairStyle: 'three-pronged-crown-comb',
    hairColor: 'crimson',
    expression: 'imperious',
    faceDetail: 'hooked-beak',
    headgear: 'none',
    outfit: 'none',
    outfitColor: 'royal-burgundy',
    outfitTier: 'tier1',
    weapon: 'none',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: ['#323746', '#1d2634', '#65707d'],
      hair: ['#a53f49', '#5b2638', '#d66756'],
      outfit: ['#5a2f45', '#301f35', '#814457'],
    },
  },
  actorTopology: EN_E11_COCKATRICE_TOPOLOGY_DECISION.selected,
  childAssets: [],
  cockatrice: {
    head: ['#323746', '#1d2634', '#65707d'],
    body: ['#5a2f45', '#301f35', '#814457'],
    wing: ['#9a6b39', '#5d402c', '#c8944e'],
    comb: ['#a53f49', '#5b2638', '#d66756'],
    tail: ['#273d46', '#172932', '#45606a'],
    scale: ['#a9884f', '#665539', '#c8aa67'],
    beak: ['#d4c38b', '#776a4b', '#eee0ab'],
    talon: ['#aa7543', '#5c412f'],
    eye: '#e9d75a',
    feature: '#191a22',
  },
  effectBoundary: 'external-petrifying-gaze-venom-dust-glow-projectiles-and-impacts',
  bakedEffects: [],
});

const CROWNCOIL_BASILARCH_VARIANT = deepFreeze({
  id: 'crowncoil-basilarch',
  name: 'Crowncoil Basilarch',
  role: EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_CONTRACT.role,
  status: EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_CONTRACT.state,
  brief: 'Elite natural Cockatrice with a tall crimson crown comb, ivory hooked beak, thick antique-gold plated neck, deep royal-burgundy body, layered brass mantle wings, broad bronze talons, and one heavy connected dark blue-green serpent tail that rises into a crown-hook press.',
  rendererData: EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_DATA,
});

export const EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'royal-crown-vigil', upperBob: 0, wingPhase: 0, legPhase: 0, tailMode: 'coil', tailSway: -1, beakReach: 0, neckShift: 0, flash: false },
  { name: 'mantle-breath', upperBob: 1, wingPhase: 1, legPhase: 0, tailMode: 'coil', tailSway: 1, beakReach: 0, neckShift: 0, flash: false },
]);

const WALK_PHASES = deepFreeze([
  { name: 'heavy-left-throne-step', upperBob: 0, wingPhase: 1, legPhase: 1, tailMode: 'coil', tailSway: -1, beakReach: 0, neckShift: 0, flash: false },
  { name: 'plated-mantle-compress', upperBob: 1, wingPhase: 0, legPhase: 2, tailMode: 'brace', tailSway: 0, beakReach: 0, neckShift: 0, flash: false },
  { name: 'heavy-right-throne-step', upperBob: 0, wingPhase: 1, legPhase: 3, tailMode: 'coil', tailSway: 1, beakReach: 0, neckShift: 0, flash: false },
  { name: 'crowncoil-settle', upperBob: 0, wingPhase: 2, legPhase: 4, tailMode: 'brace', tailSway: 0, beakReach: 0, neckShift: 0, flash: false },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'two-talon-crown-brace', upperBob: 0, wingPhase: 2, legPhase: 1, tailMode: 'brace', tailSway: 0, beakReach: 0, neckShift: 0, flash: false },
  { name: 'mantle-crown-rise', upperBob: 0, wingPhase: 3, legPhase: 0, tailMode: 'crown', tailSway: 0, beakReach: 0, neckShift: 0, flash: false },
  { name: 'crowncoil-tail-press', upperBob: 0, wingPhase: 4, legPhase: 3, tailMode: 'crown', tailSway: 1, beakReach: 1, neckShift: 1, flash: false },
  { name: 'sovereign-fold-recover', upperBob: 1, wingPhase: 1, legPhase: 0, tailMode: 'coil', tailSway: 0, beakReach: 0, neckShift: 0, flash: false },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-crown-recoil', upperBob: 0, wingPhase: 2, legPhase: 1, tailMode: 'brace', tailSway: -1, beakReach: 0, neckShift: 0, flash: true },
  { name: 'grounded-basilarch-recovery', upperBob: 1, wingPhase: 1, legPhase: 0, tailMode: 'coil', tailSway: 0, beakReach: 0, neckShift: 0, flash: false },
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
      'Crowncoil Basilarch rectangles must use positive integer geometry.',
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

function drawFrontTail(paint, phase) {
  const { tail, scale } = EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_DATA.cockatrice;
  if (phase.tailMode === 'crown') {
    paint.rect(13, 13, 5, 6, tail[0]);
    paint.rect(17, 11, 4, 7, tail[1]);
    paint.rect(20, 7, 3, 6, tail[2]);
    paint.rect(19, 6, 2, 3, tail[0]);
    paint.rect(21, 5, 2, 3, tail[0]);
    paint.dot(21, 5, scale[2]);
    paint.dot(20, 9, scale[0]);
    paint.dot(18, 13, scale[1]);
    paint.dot(15, 16, scale[2]);
    return;
  }
  const sway = phase.tailSway;
  const brace = phase.tailMode === 'brace' ? 1 : 0;
  paint.rect(7, 14, 6, 5, tail[0]);
  paint.rect(4 + sway, 16, 6 + brace, 4, tail[1]);
  paint.rect(2 + sway, 18, 4 + brace, 3, tail[2]);
  paint.rect(1, 17, 3, 2, tail[0]);
  paint.dot(1, 17, scale[2]);
  paint.dot(4 + sway, 19, scale[0]);
  paint.dot(8 + sway, 17, scale[1]);
}

function drawSideTail(paint, phase) {
  const { tail, scale } = EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_DATA.cockatrice;
  if (phase.tailMode === 'crown') {
    paint.rect(9, 13, 6, 6, tail[0]);
    paint.rect(5, 14, 5, 5, tail[1]);
    paint.rect(2, 10, 4, 7, tail[2]);
    paint.rect(1, 6, 3, 6, tail[0]);
    paint.rect(1, 5, 2, 3, tail[2]);
    paint.rect(3, 7, 2, 3, tail[2]);
    paint.dot(1, 5, scale[2]);
    paint.dot(3, 9, scale[0]);
    paint.dot(5, 14, scale[1]);
    paint.dot(9, 16, scale[2]);
    return;
  }
  const sway = phase.tailSway;
  const brace = phase.tailMode === 'brace' ? 1 : 0;
  paint.rect(9, 14, 6, 5, tail[0]);
  paint.rect(6 + sway, 16, 5 + brace, 4, tail[1]);
  paint.rect(3 + sway, 18, 4 + brace, 3, tail[2]);
  paint.rect(1, 17, 3, 2, tail[0]);
  paint.dot(1, 17, scale[2]);
  paint.dot(5 + sway, 19, scale[0]);
  paint.dot(8 + sway, 17, scale[1]);
}

function drawTail(paint, phase) {
  if (paint.view === 'right') drawSideTail(paint, phase);
  else drawFrontTail(paint, phase);
}

function drawFrontBody(paint, phase, rearView) {
  const { body, wing, scale } = EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_DATA.cockatrice;
  const bob = phase.upperBob;
  paint.rect(7, 9 + bob, 12, 10, body[0]);
  paint.rect(8, 15 + bob, 10, 4, body[1]);
  paint.rect(10, 10 + bob, 6, 7, rearView ? scale[1] : scale[0]);
  paint.rect(8, 10 + bob, 2, 5, body[2]);
  if (phase.wingPhase === 4) {
    paint.rect(2, 7 + bob, 11, 7, wing[0]);
    paint.rect(11, 8 + bob, 12, 6, wing[0]);
    paint.rect(3, 12 + bob, 10, 6, wing[1]);
    paint.rect(12, 13 + bob, 10, 5, wing[1]);
    paint.rect(4, 8 + bob, 7, 2, wing[2]);
    paint.rect(15, 16 + bob, 6, 2, wing[2]);
    return;
  }
  if (phase.wingPhase === 3) {
    paint.rect(3, 5 + bob, 8, 12, wing[0]);
    paint.rect(13, 5 + bob, 9, 12, wing[0]);
    paint.rect(4, 11 + bob, 8, 7, wing[1]);
    paint.rect(13, 11 + bob, 9, 7, wing[1]);
    paint.rect(5, 6 + bob, 6, 3, wing[2]);
    paint.rect(14, 6 + bob, 6, 3, wing[2]);
    return;
  }
  const spread = phase.wingPhase === 2 ? 1 : 0;
  const lower = phase.wingPhase === 1 ? 1 : 0;
  paint.rect(4 - spread, 10 + bob + lower, 7 + spread, 8, wing[0]);
  paint.rect(15, 10 + bob + lower, 7 + spread, 8, wing[0]);
  paint.rect(4 - spread, 15 + bob + lower, 7 + spread, 3, wing[1]);
  paint.rect(15, 15 + bob + lower, 7 + spread, 3, wing[1]);
  paint.rect(6, 17 + bob + lower, 5, 2, wing[2]);
  paint.rect(15, 17 + bob + lower, 5, 2, wing[2]);
}

function drawSideBody(paint, phase) {
  const { body, wing, scale } = EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_DATA.cockatrice;
  const bob = phase.upperBob;
  paint.rect(9, 9 + bob, 12, 10, body[0]);
  paint.rect(10, 15 + bob, 10, 4, body[1]);
  paint.rect(15, 10 + bob, 5, 7, scale[0]);
  paint.rect(9, 10 + bob, 3, 5, body[2]);
  if (phase.wingPhase === 4) {
    paint.rect(6, 7 + bob, 16, 7, wing[0]);
    paint.rect(7, 12 + bob, 15, 6, wing[1]);
    paint.rect(11, 8 + bob, 10, 2, wing[2]);
    paint.rect(13, 16 + bob, 8, 2, wing[2]);
    return;
  }
  if (phase.wingPhase === 3) {
    paint.rect(7, 4 + bob, 11, 13, wing[0]);
    paint.rect(8, 10 + bob, 12, 8, wing[1]);
    paint.rect(9, 5 + bob, 8, 4, wing[2]);
    return;
  }
  const spread = phase.wingPhase === 2 ? 1 : 0;
  const lower = phase.wingPhase === 1 ? 1 : 0;
  paint.rect(7 - spread, 10 + bob + lower, 12 + spread, 8, wing[0]);
  paint.rect(8 - spread, 15 + bob + lower, 11 + spread, 3, wing[1]);
  paint.rect(11, 17 + bob + lower, 7, 2, wing[2]);
}

function drawBody(paint, phase, rearView) {
  if (paint.view === 'right') drawSideBody(paint, phase);
  else drawFrontBody(paint, phase, rearView);
}

function drawFrontLeg(paint, x, rearView) {
  const { body, talon } = EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_DATA.cockatrice;
  paint.rect(x, 16, 2, 5, rearView ? body[1] : body[2]);
  paint.rect(x, 20, 2, 2, talon[1]);
  paint.rect(x - 1, 22, 5, 1, rearView ? talon[1] : talon[0]);
}

function drawSideLeg(paint, x, farLeg) {
  const { body, talon } = EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_DATA.cockatrice;
  paint.rect(x, 16, 2, 5, farLeg ? body[1] : body[2]);
  paint.rect(x, 20, 2, 2, talon[1]);
  paint.rect(x - 1, 22, 5, 1, farLeg ? talon[1] : talon[0]);
}

function drawLegs(paint, phase, rearView) {
  if (paint.view === 'right') {
    const state = SIDE_LEG_PHASES[phase.legPhase];
    drawSideLeg(paint, 10 + state.farX, true);
    drawSideLeg(paint, 17 + state.nearX, false);
    return;
  }
  const state = FRONT_LEG_PHASES[phase.legPhase];
  drawFrontLeg(paint, 7 + state.leftX, rearView);
  drawFrontLeg(paint, 16 + state.rightX, rearView);
}

function drawFrontHead(paint, phase, rearView) {
  const { head, comb, scale, beak, eye, feature } = EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_DATA.cockatrice;
  const bob = phase.upperBob;
  const shift = phase.neckShift;
  paint.rect(10, 5 + bob + shift, 6, 10 - Math.max(0, shift), head[0]);
  paint.rect(11, 7 + bob + shift, 4, 8 - Math.max(0, shift), scale[2]);
  paint.rect(8, 3 + bob + shift, 10, 4, head[0]);
  paint.rect(9, 1 + bob + shift, 2, 3, comb[2]);
  paint.rect(12, 1 + bob + shift, 2, 3, comb[0]);
  paint.rect(15, 1 + bob + shift, 2, 3, comb[2]);
  paint.rect(9, 3 + bob + shift, 8, 2, comb[1]);
  if (rearView) {
    paint.rect(9, 4 + bob + shift, 8, 3, head[1]);
    paint.dot(10, 5 + bob + shift, scale[2]);
    paint.dot(15, 6 + bob + shift, scale[0]);
    paint.rect(11, 7 + bob + shift, 4, 4, scale[1]);
    return;
  }
  paint.dot(10, 4 + bob + shift, eye);
  paint.dot(15, 4 + bob + shift, eye);
  paint.dot(10, 5 + bob + shift, feature);
  paint.dot(15, 5 + bob + shift, feature);
  paint.rect(11, 5 + bob + shift, 4, 2 + phase.beakReach, beak[0]);
  paint.rect(11, 7 + bob + shift + phase.beakReach, 4, 1, beak[1]);
  paint.rect(11, 7 + bob + shift, 4, 3, comb[0]);
  paint.dot(12, 9 + bob + shift, comb[2]);
  paint.dot(14, 9 + bob + shift, comb[2]);
}

function drawSideHead(paint, phase) {
  const { head, comb, scale, beak, eye, feature } = EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_DATA.cockatrice;
  const bob = phase.upperBob;
  const shift = phase.neckShift;
  paint.rect(14, 5 + bob + shift, 6, 10 - Math.max(0, shift), head[0]);
  paint.rect(13, 8 + bob + shift, 5, 7 - Math.max(0, shift), scale[2]);
  paint.rect(13, 3 + bob + shift, 8, 4, head[0]);
  paint.rect(13, 1 + bob + shift, 2, 3, comb[2]);
  paint.rect(16, 1 + bob + shift, 2, 3, comb[0]);
  paint.rect(19, 1 + bob + shift, 2, 3, comb[2]);
  paint.rect(13, 3 + bob + shift, 8, 2, comb[1]);
  paint.dot(18, 4 + bob + shift, eye);
  paint.dot(19, 4 + bob + shift, feature);
  paint.rect(19, 5 + bob + shift, 3 + phase.beakReach, 2, beak[0]);
  paint.dot(21 + phase.beakReach, 7 + bob + shift, beak[1]);
  paint.rect(16, 7 + bob + shift, 4, 3, comb[0]);
  paint.dot(17, 9 + bob + shift, comb[2]);
  paint.dot(19, 9 + bob + shift, comb[2]);
}

function drawHead(paint, phase, rearView) {
  if (paint.view === 'right') drawSideHead(paint, phase);
  else drawFrontHead(paint, phase, rearView);
}

export function drawCockatriceCrowncoilBasilarchAnatomy(context, direction, phase) {
  const paint = createPainter(context, direction);
  const rearView = paint.view === 'up';
  drawTail(paint, phase);
  drawBody(paint, phase, rearView);
  drawLegs(paint, phase, rearView);
  drawHead(paint, phase, rearView);
}

function renderAnatomy(args, phase) {
  args.context.clearRect(0, 0, SIZE, SIZE);
  const colorContext = createColorContext(args.context, phase.flash ? '#f4f4f4' : null);
  drawCockatriceCrowncoilBasilarchAnatomy(colorContext, args.direction, phase);
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
    cockatriceCrowncoilBasilarchGate: EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.id,
    architectureDecision: EN_E11_COCKATRICE_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E11_COCKATRICE_GLOAMGAZE_STALKER_GATE.id,
    role: EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_CONTRACT.role,
    anatomy: EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_CONTRACT.chassis,
    upperBody: 'three-pronged-crimson-crown-plated-wattle-ivory-hooked-beak-thick-antique-gold-throat-and-layered-brass-mantle-wings',
    lowerBody: 'two-separated-grounded-broad-bronze-talons-and-one-connected-dark-blue-green-crown-hook-serpent-tail',
    motion,
    childAssetCount: EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_DATA.childAssets.length,
    effectBoundary: EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_DATA.effectBoundary,
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
    outputAnimation === 'cast' ? 'exact-cast-alias-of-connected-mantle-crown-rise-beak-strike-and-crowncoil-tail-press' : phase.name,
  );
}

function renderHurt(args, outputAnimation = 'hurt', outputFrame = args.frame) {
  const phase = HURT_PHASES[args.frame];
  renderAnatomy(args, phase);
  return resultFor(
    { ...args, animation: { ...args.animation, id: outputAnimation }, frame: outputFrame },
    'hurt',
    args.frame,
    outputAnimation === 'death' ? 'exact-death-alias-of-grounded-crowncoil-hurt' : phase.name,
  );
}

function renderCockatriceCrowncoilBasilarch(args) {
  assert(args.family.id === 'cockatrice', 'The EN-E11 Cockatrice renderer is restricted to Cockatrice.');
  assert(args.variant.id === 'crowncoil-basilarch', 'The EN-E11 Cockatrice renderer is restricted to Crowncoil Basilarch.');
  if (args.animation.id === 'idle') {
    assert(args.frame >= 0 && args.frame < 2, 'Cockatrice Crowncoil Basilarch Idle authorizes only F1-F2.');
    return renderIdle(args);
  }
  if (args.animation.id === 'walk') {
    assert(args.frame >= 0 && args.frame < 4, 'Cockatrice Crowncoil Basilarch Walk authorizes only W1-W4.');
    return renderWalk(args);
  }
  if (args.animation.id === 'attack') {
    assert(args.frame >= 0 && args.frame < 4, 'Cockatrice Crowncoil Basilarch Attack authorizes only A1-A4.');
    return renderAttack(args);
  }
  if (args.animation.id === 'hurt') {
    assert(args.frame >= 0 && args.frame < 2, 'Cockatrice Crowncoil Basilarch Hurt authorizes only H1-H2.');
    return renderHurt(args);
  }
  if (args.animation.id === 'cast') {
    assert(args.frame >= 0 && args.frame < 4, 'Cockatrice Crowncoil Basilarch Cast authorizes only C1-C4.');
    return renderAttack({ ...args, animation: { ...args.animation, id: 'attack' } }, 'cast', args.frame);
  }
  if (args.animation.id === 'death') {
    assert(args.frame >= 0 && args.frame < 4, 'Cockatrice Crowncoil Basilarch Death authorizes only D1-D4.');
    const sourceFrame = EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_DEATH_SOURCE_FRAMES[args.frame];
    return renderHurt({ ...args, animation: { ...args.animation, id: 'hurt' }, frame: sourceFrame }, 'death', args.frame);
  }
  throw new TypeError('The EN-E11 Cockatrice Crowncoil Basilarch gate authorizes only Idle, Walk, Attack, Cast, Hurt, and Death.');
}

export const EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_RENDERER = Object.freeze({
  key: 'en-e11-cockatrice-crowncoil-basilarch-full-v1',
  chassis: EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_CONTRACT.chassis,
  render: renderCockatriceCrowncoilBasilarch,
});

export const EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_FAMILY = deepFreeze({
  id: 'cockatrice',
  name: 'Cockatrice',
  sliceId: 'EN-E11',
  rendererKey: EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [CROWNCOIL_BASILARCH_VARIANT],
  rendererData: {
    approvedPrecedingGate: EN_E11_COCKATRICE_GLOAMGAZE_STALKER_GATE.id,
    activeGate: EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.id,
    topologyDecision: EN_E11_COCKATRICE_TOPOLOGY_DECISION.id,
  },
  review: {
    baselineVariant: 'crowncoil-basilarch',
    scale: 6,
    notes: 'Published and reconciled private Crowncoil Basilarch elite Cockatrice only, bound to exact implementation 5d4ebe9dea7a8a85d0adeec0e34a0b3be8a016ef, approval record 27e60acd72f9c00de886d8fd0d7e1d899c7f2bb7, initial published handoff 7f588bf305072e80a4bf3c4d913dfaba1f389416, candidate digest 5beeb0036af6f5c9dc9bfb64c0121e548a372f31ee257e53c0765e3b031c2bb0, and its six frozen review hashes. The approved continuation opens only the Raven topology decision. Keep Raven pixels, Owl, Phoenix, public or outline registration, fixtures, effects, child assets, release, accepted drift, and a pull request separate.',
  },
});

export const EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_RENDERER],
  families: [EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_FAMILY],
});
