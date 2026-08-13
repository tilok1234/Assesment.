import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E11_PEACOCK_TOPOLOGY_DECISION,
} from './enemy-expansion-en-e11-peacock-rainfan-forager.js';
import {
  EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_GATE,
} from './enemy-expansion-en-e11-peacock-mirrorfan-ambusher.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_CONTRACT = deepFreeze({
  family: 'peacock',
  variant: 'crownveil-sovereign',
  role: 'elite',
  state: 'implemented-complete-motion-approved',
  chassis: EN_E11_PEACOCK_TOPOLOGY_DECISION.selected,
  silhouette: 'One broad natural ground-bird body joins a tall connected three-pronged coronet crest, thick arched neck, two layered mantle wings, two strong taloned legs with separated broad three-toed contacts, and one connected heavy eyespot train that becomes a full crowned shield during Attack. It is wider and more imposing than Rainfan Forager or Mirrorfan Ambusher and is not an upright Birdfolk person, exposed-human Harpy, or four-legged Griffin.',
  identity: 'Moon-white and royal-violet head-and-neck plumage, a dark amethyst body, layered antique-gold mantle wings, a deep blue-green train with ivory-cyan-rose crown eyes, old-ivory beak, and a body-owned full-train shield press distinguish the elite Crownveil Sovereign.',
  effectBoundary: 'Loose feathers, wind streaks, gust rings, dust, glow, projectiles, air blades, and impact effects remain external.',
});

export const EN_E11_PEACOCK_ELITE_CONTRACT_CARD = deepFreeze({
  family: 'peacock',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingGate: EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_GATE.id,
  precedingVariant: {
    id: 'mirrorfan-ambusher',
    role: 'specialist',
    status: 'implemented-full-approved-published',
  },
  activeVariant: {
    id: EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_CONTRACT.variant,
    role: EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_CONTRACT.role,
    status: 'implemented-full-approved',
  },
  deferredRoles: [],
});

export const EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE = deepFreeze({
  id: 'en-e11-peacock-crownveil-sovereign-full-v1',
  status: 'approved',
  authorizedOn: '2026-08-13',
  authorizationEvidence: 'The exact Mirrorfan Ambusher implementation dcbb69ca92f8ba8be1a40c79d1ef84b56ac29216, approval record a39a0ef3d5054e040c75f6c9203efa194d987429, initial published handoff 790c82ff0ae33f4777f2628c51af100a9fbc6f52, and final reconciliation 6df83e5e642dbec5b68b856d436aa9db810678eb are pushed and remote verified. The designer approved that exact specialist packet and continued with: approved lets do next. Under the documented Peacock role order and selected baked-single-actor-grounded-fan-tailed-bird topology, the continuation authorizes exactly one private elite Peacock full 80-frame candidate only. It does not approve candidate pixels or authorize public or outline registration, fixtures, effects, child assets, Cockatrice, Raven, Owl, Phoenix, another Bird family, release, accepted drift, or a pull request.',
  baseCheckpoint: '6df83e5e642dbec5b68b856d436aa9db810678eb',
  architectureDecision: EN_E11_PEACOCK_TOPOLOGY_DECISION.id,
  approvedOn: '2026-08-13',
  approvalEvidence: 'The exact labeled all-four-direction raw/no-outline, distinct Complete B outlined, Complete B + Form, and approved Mirrorfan Ambusher, approved Rainfan Forager, and approved Aerie Scout comparison PNGs were frozen with both synchronized GIF hashes. All four exact PNG paths were loaded in Aseprite and inspected, and the transparent 20x4 inspection atlas passed dimensions, hard alpha, non-empty-cell, and strict boundary checks. The final approval prompt posted all four exact PNGs, both synchronized GIFs, and candidate digest 6c4220e3a108eb902370a6d69bea8f2334a73dfddd914deb7f9a43495b99c82d. The designer replied: approved. Approval applies only to that exact Crownveil Sovereign digest and its six frozen review hashes. This reply contains no continuation request and does not open public or outline registration, fixtures, effects, child assets, Cockatrice, Raven, Owl, Phoenix, another Bird family, release, accepted drift, or a pull request.',
  approvedImplementation: '13ceea22b163ae87fe2b6acd9dcf0e45c6e800bc',
  publicationAuthorizedOn: '2026-08-13',
  publicationAuthorizationEvidence: 'The designer previously said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact frozen artifact or digest. It does not authorize registration, fixtures, effects, child assets, later roles or families, release, accepted drift, or a pull request.',
  publishedImplementation: '',
  publishedApprovalRecord: '',
  initialPublishedHandoff: '',
  publicationState: 'approved-not-published',
  precedingApproval: {
    gateId: EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_GATE.id,
    candidateFrameDigest: EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_GATE.initialPublishedHandoff,
    currentReconciliation: '6df83e5e642dbec5b68b856d436aa9db810678eb',
  },
  artifact: 'enemy-expansion-review/en-e11-peacock-crownveil-sovereign/en-e11-peacock-crownveil-sovereign-full-suite-raw.png',
  artifactSha256: '4e27a7d72012ec7468195ddaa06f7801c5d9926d3e1c51754f23231b4efaa9ba',
  outlinedArtifact: 'enemy-expansion-review/en-e11-peacock-crownveil-sovereign/en-e11-peacock-crownveil-sovereign-full-suite-outlined-complete-b.png',
  outlinedArtifactSha256: 'd0e0ed05df36855af918ce741dd4d68adda6266cb0b0bb893134a1b6e3778da7',
  assembledArtifact: 'enemy-expansion-review/en-e11-peacock-crownveil-sovereign/en-e11-peacock-crownveil-sovereign-full-suite-complete-b-form.png',
  assembledArtifactSha256: '7b5d5d16b45a41976d77d4cccb6adb69418d29f0329dd3fdf0548b9348798351',
  comparisonArtifact: 'enemy-expansion-review/en-e11-peacock-crownveil-sovereign/en-e11-peacock-crownveil-sovereign-family-comparison.png',
  comparisonArtifactSha256: '89ca07be4cc53edf14ebc3da06f1d3a4c311bd0d07572569f5d561373cb2e21e',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e11-peacock-crownveil-sovereign/en-e11-peacock-crownveil-sovereign-full-suite-four-directions-labeled.gif',
      sha256: '93e9068ed97d2ef02c89da15e4e1bac2ef945702a4a85a4afc0858fb9a354d7d',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e11-peacock-crownveil-sovereign/en-e11-peacock-crownveil-sovereign-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '8fdd6cde061f09cbbeaa32839c31f5a33f5ea0cf38921780e2460572c5f9985a',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
  },
  candidateFrameDigest: '6c4220e3a108eb902370a6d69bea8f2334a73dfddd914deb7f9a43495b99c82d',
  mirrorfanComparisonDigest: 'd2b57707034f5c2f46b53de51ac800cb12b70610d5abe230db7d8a74396e0cb6',
  rainfanComparisonDigest: '061a67e81e4c2bb4e7ed528953d2acf1e19d1453b2098ddceff1c01ca4e38128',
  aerieScoutComparisonDigest: 'afff790c5f60684561752ff7fe9f8f4312c5b46679477cc88d29764379ca41c8',
  scope: 'One complete 80-frame Peacock Crownveil Sovereign elite enemy across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle holds the heavy train as a folded royal veil beneath the connected three-pronged coronet. Walk uses four distinct weighty talon steps with layered mantle-wing and train counter-motion. Attack plants both talons, raises the connected train into a full crowned shield, closes both mantle wings into a planted forward press with a short beak drive, and recovers. Hurt uses a complete-silhouette #f4f4f4 recoil and colored recovery. Cast aliases Attack exactly and Death aliases Hurt H1,H2,H2,H2.',
  anatomyContract: EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_CONTRACT.silhouette,
  reviewPresentation: 'Show the exact labeled all-four-direction Crownveil Sovereign raw/no-outline, outlined Complete B, Complete B + Form, avian-family comparison board, and both full-suite GIFs together.',
  exclusions: [
    'approved Rainfan Forager pixel changes',
    'approved Mirrorfan Ambusher pixel changes',
    'Cockatrice',
    'Raven',
    'Owl',
    'Phoenix',
    'additional Bird variants',
    'new Cast pixels',
    'new Death pixels',
    'detached feather child assets',
    'baked loose-feather pixels',
    'baked wind-streak pixels',
    'baked gust-ring pixels',
    'baked dust pixels',
    'baked glow pixels',
    'baked projectile pixels',
    'baked air-blade pixels',
    'baked impact pixels',
    'registration',
    'consumer exposure',
    'fixtures',
    'effects',
    'release',
    'later EN-E11 work',
  ],
  nextGate: 'The exact Crownveil Sovereign packet is visually approved at implementation 13ceea22b163ae87fe2b6acd9dcf0e45c6e800bc. Standing publication permission opens only its approval record, branch push, and bounded handoff reconciliation. This approval contains no continuation request, so Peacock is complete and no Cockatrice, Raven, Owl, Phoenix, or other Bird candidate is open. The distinct outlined PNG remains review evidence only and does not authorize outline registration. Public Peacock registration, fixtures, effects, child assets, release, accepted drift, and a pull request remain closed.',
});

export const EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_DATA = deepFreeze({
  actor: {
    species: 'avian',
    bodyBuild: 'broad-royal-ground-bird',
    skin: 'feathered',
    hairStyle: 'crest',
    hairColor: 'moon-white',
    expression: 'regal',
    faceDetail: 'beak',
    headgear: 'none',
    outfit: 'none',
    outfitColor: 'amethyst',
    outfitTier: 'tier1',
    weapon: 'none',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: ['#d8d5e6', '#725aa4'],
      hair: ['#f1ecdf', '#2b234d'],
      outfit: ['#54446d', '#2d2944', '#d4b56f'],
    },
  },
  actorTopology: EN_E11_PEACOCK_TOPOLOGY_DECISION.selected,
  childAssets: [],
  peacock: {
    neck: ['#d8d5e6', '#725aa4', '#f1ecdf'],
    body: ['#54446d', '#2d2944', '#8b729c'],
    wing: ['#d4b56f', '#856137', '#f0d992'],
    train: ['#274a58', '#182a45', '#416f73'],
    eyespot: ['#f2e3b1', '#74c9c1', '#b35a8c'],
    beak: ['#d8c99b', '#806b48', '#f2e5bd'],
    talon: ['#c49b58', '#6f5334'],
    eye: '#f5cb66',
    feature: '#281d36',
  },
  effectBoundary: 'external-loose-feathers-wind-streaks-gust-rings-dust-glow-projectiles-air-blades-and-impacts',
  bakedEffects: [],
});

const CROWNVEIL_SOVEREIGN_VARIANT = deepFreeze({
  id: 'crownveil-sovereign',
  name: 'Crownveil Sovereign',
  role: EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_CONTRACT.role,
  status: EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_CONTRACT.state,
  brief: 'Elite natural Peacock with a connected three-pronged moon-white coronet, broad amethyst body, layered antique-gold mantle wings, strong planted talons, and one heavy connected blue-green train that rises into a body-owned crowned shield before a double-wing press.',
  rendererData: EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_DATA,
});

export const EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'sovereign-vigil', upperBob: 0, wingPhase: 0, legPhase: 0, tailMode: 'closed', tailSway: 0, beakReach: 0, flash: false },
  { name: 'coronet-and-veil-settle', upperBob: 1, wingPhase: 1, legPhase: 0, tailMode: 'closed', tailSway: 0, beakReach: 0, flash: false },
]);

const WALK_PHASES = deepFreeze([
  { name: 'royal-left-talon-step', upperBob: 0, wingPhase: 1, legPhase: 1, tailMode: 'closed', tailSway: -1, beakReach: 0, flash: false },
  { name: 'mantle-compress', upperBob: 1, wingPhase: 0, legPhase: 2, tailMode: 'closed', tailSway: 0, beakReach: 0, flash: false },
  { name: 'royal-right-talon-step', upperBob: 0, wingPhase: 1, legPhase: 3, tailMode: 'closed', tailSway: 1, beakReach: 0, flash: false },
  { name: 'sovereign-recover', upperBob: 0, wingPhase: 2, legPhase: 4, tailMode: 'closed', tailSway: 0, beakReach: 0, flash: false },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'crowned-two-talon-brace', upperBob: 0, wingPhase: 2, legPhase: 1, tailMode: 'half', tailSway: -1, beakReach: 0, flash: false },
  { name: 'full-crown-shield-rise', upperBob: 0, wingPhase: 3, legPhase: 0, tailMode: 'open', tailSway: 0, beakReach: 0, flash: false },
  { name: 'double-mantle-shield-press', upperBob: 0, wingPhase: 4, legPhase: 3, tailMode: 'open', tailSway: 0, beakReach: 1, flash: false },
  { name: 'royal-veil-fold-recover', upperBob: 1, wingPhase: 1, legPhase: 0, tailMode: 'half', tailSway: 1, beakReach: 0, flash: false },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-crownshield-recoil', upperBob: 0, wingPhase: 2, legPhase: 1, tailMode: 'half', tailSway: -1, beakReach: 0, flash: true },
  { name: 'grounded-sovereign-recovery', upperBob: 1, wingPhase: 1, legPhase: 0, tailMode: 'closed', tailSway: 0, beakReach: 0, flash: false },
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
      'Crownveil Sovereign rectangles must use positive integer geometry.',
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

function drawEyespot(paint, x, y) {
  const { eyespot } = EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_DATA.peacock;
  paint.rect(x, y, 2, 2, eyespot[0]);
  paint.dot(x + 1, y, eyespot[1]);
  paint.dot(x, y + 1, eyespot[2]);
}

function drawFrontTrain(paint, phase, rearView) {
  const { train } = EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_DATA.peacock;
  const sway = phase.tailSway;
  if (phase.tailMode === 'open') {
    paint.rect(4, 4, 4, 5, train[2]);
    paint.rect(10, 2, 4, 7, train[2]);
    paint.rect(16, 4, 4, 5, train[2]);
    paint.rect(2, 6, 8, 12, train[0]);
    paint.rect(7, 4, 10, 16, train[1]);
    paint.rect(14, 6, 8, 12, train[0]);
    paint.rect(3, 17, 18, 4, train[2]);
    drawEyespot(paint, 4, 6);
    drawEyespot(paint, 11, 3);
    drawEyespot(paint, 18, 6);
    drawEyespot(paint, 2, 14);
    drawEyespot(paint, 20, 14);
    drawEyespot(paint, 6, 18);
    drawEyespot(paint, 16, 18);
    return;
  }
  if (phase.tailMode === 'half') {
    paint.rect(7 + sway, 6, 10, 7, train[2]);
    paint.rect(5 + sway, 8, 14, 11, train[0]);
    paint.rect(3 + sway, 13, 18, 8, train[1]);
    drawEyespot(paint, 3 + sway, 17);
    drawEyespot(paint, 19 + sway, 17);
    return;
  }
  paint.rect(7 + sway, 11, 10, 9, train[0]);
  paint.rect(4 + sway, 15, 16, 6, train[1]);
  drawEyespot(paint, 4 + sway, 18);
  drawEyespot(paint, 18 + sway, 18);
  if (rearView) paint.dot(12 + sway, 19, EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_DATA.peacock.eyespot[1]);
}

function drawSideTrain(paint, phase) {
  const { train } = EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_DATA.peacock;
  const sway = phase.tailSway;
  if (phase.tailMode === 'open') {
    paint.rect(8, 3, 6, 18, train[2]);
    paint.rect(5, 5, 9, 15, train[0]);
    paint.rect(2, 8, 12, 13, train[1]);
    paint.rect(1, 13, 13, 8, train[0]);
    drawEyespot(paint, 9, 4);
    drawEyespot(paint, 6, 8);
    drawEyespot(paint, 3, 12);
    drawEyespot(paint, 1, 17);
    drawEyespot(paint, 8, 18);
    return;
  }
  if (phase.tailMode === 'half') {
    paint.rect(7 + sway, 6, 7, 8, train[2]);
    paint.rect(4 + sway, 8, 10, 12, train[0]);
    paint.rect(2 + sway, 13, 12, 8, train[1]);
    drawEyespot(paint, 8 + sway, 8);
    drawEyespot(paint, 3 + sway, 15);
    drawEyespot(paint, 9 + sway, 18);
    return;
  }
  paint.rect(7 + sway, 10, 7, 10, train[0]);
  paint.rect(4 + sway, 14, 10, 7, train[1]);
  paint.rect(2 + sway, 18, 12, 3, train[2]);
  drawEyespot(paint, 8 + sway, 12);
  drawEyespot(paint, 2 + sway, 18);
}

function drawTrain(paint, phase, rearView) {
  if (paint.view === 'right') drawSideTrain(paint, phase);
  else drawFrontTrain(paint, phase, rearView);
}

function drawFrontBody(paint, phase, rearView) {
  const { body, wing } = EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_DATA.peacock;
  const bob = phase.upperBob;
  paint.rect(7, 9 + bob, 10, 9, body[0]);
  paint.rect(8, 15 + bob, 8, 4, body[1]);
  paint.rect(10, 10 + bob, 4, 7, rearView ? body[2] : body[0]);
  if (phase.wingPhase === 4) {
    paint.rect(2, 9 + bob, 9, 6, wing[0]);
    paint.rect(3, 13 + bob, 8, 4, wing[1]);
    paint.rect(13, 9 + bob, 9, 6, wing[0]);
    paint.rect(13, 13 + bob, 8, 4, wing[1]);
    paint.rect(4, 16 + bob, 7, 2, wing[2]);
    paint.rect(13, 16 + bob, 7, 2, wing[2]);
    return;
  }
  if (phase.wingPhase === 3) {
    paint.rect(5, 6 + bob, 6, 11, wing[0]);
    paint.rect(6, 5 + bob, 5, 7, wing[2]);
    paint.rect(13, 6 + bob, 6, 11, wing[0]);
    paint.rect(13, 5 + bob, 5, 7, wing[2]);
    paint.rect(5, 14 + bob, 6, 4, wing[1]);
    paint.rect(13, 14 + bob, 6, 4, wing[1]);
    return;
  }
  if (phase.wingPhase === 2) {
    paint.rect(4, 9 + bob, 7, 9, wing[0]);
    paint.rect(13, 9 + bob, 7, 9, wing[0]);
    paint.rect(4, 14 + bob, 7, 4, wing[1]);
    paint.rect(13, 14 + bob, 7, 4, wing[1]);
    paint.rect(6, 17 + bob, 5, 2, wing[2]);
    paint.rect(13, 17 + bob, 5, 2, wing[2]);
    return;
  }
  const lower = phase.wingPhase === 1 ? 1 : 0;
  paint.rect(5, 10 + bob + lower, 6, 8, wing[0]);
  paint.rect(13, 10 + bob + lower, 6, 8, wing[0]);
  paint.rect(5, 15 + bob + lower, 6, 4, wing[1]);
  paint.rect(13, 15 + bob + lower, 6, 4, wing[1]);
  paint.rect(7, 17 + bob + lower, 4, 2, wing[2]);
  paint.rect(13, 17 + bob + lower, 4, 2, wing[2]);
}

function drawSideBody(paint, phase) {
  const { body, wing } = EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_DATA.peacock;
  const bob = phase.upperBob;
  paint.rect(8, 9 + bob, 10, 9, body[0]);
  paint.rect(9, 15 + bob, 9, 4, body[1]);
  paint.rect(7, 11 + bob, 5, 7, body[2]);
  if (phase.wingPhase === 4) {
    paint.rect(10, 8 + bob, 12, 6, wing[0]);
    paint.rect(11, 12 + bob, 11, 5, wing[1]);
    paint.rect(13, 16 + bob, 8, 2, wing[2]);
    return;
  }
  if (phase.wingPhase === 3) {
    paint.rect(8, 5 + bob, 8, 12, wing[0]);
    paint.rect(9, 4 + bob, 7, 8, wing[2]);
    paint.rect(8, 13 + bob, 8, 5, wing[1]);
    return;
  }
  if (phase.wingPhase === 2) {
    paint.rect(6, 8 + bob, 11, 10, wing[0]);
    paint.rect(6, 14 + bob, 10, 5, wing[1]);
    paint.rect(8, 17 + bob, 7, 2, wing[2]);
    return;
  }
  const lower = phase.wingPhase === 1 ? 1 : 0;
  paint.rect(7, 10 + bob + lower, 10, 8, wing[0]);
  paint.rect(7, 15 + bob + lower, 9, 4, wing[1]);
  paint.rect(9, 17 + bob + lower, 6, 2, wing[2]);
}

function drawBody(paint, phase, rearView) {
  if (paint.view === 'right') drawSideBody(paint, phase);
  else drawFrontBody(paint, phase, rearView);
}

function drawFrontLeg(paint, x, rearView) {
  const { body, talon } = EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_DATA.peacock;
  paint.rect(x, 15, 2, 5, body[1]);
  paint.rect(x, 19, 2, 3, talon[1]);
  paint.rect(x - 1, 22, 4, 1, rearView ? talon[1] : talon[0]);
}

function drawSideLeg(paint, x, farLeg) {
  const { body, talon } = EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_DATA.peacock;
  paint.rect(x, 15, 2, 5, farLeg ? body[1] : body[0]);
  paint.rect(x, 19, 2, 3, talon[1]);
  paint.rect(x - 1, 22, 4, 1, farLeg ? talon[1] : talon[0]);
}

function drawLegs(paint, phase, rearView) {
  if (paint.view === 'right') {
    const state = SIDE_LEG_PHASES[phase.legPhase];
    drawSideLeg(paint, 9 + state.farX, true);
    drawSideLeg(paint, 15 + state.nearX, false);
    return;
  }
  const state = FRONT_LEG_PHASES[phase.legPhase];
  drawFrontLeg(paint, 8 + state.leftX, rearView);
  drawFrontLeg(paint, 15 + state.rightX, rearView);
}

function drawFrontHead(paint, phase, rearView) {
  const { neck, beak, eye, feature } = EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_DATA.peacock;
  const bob = phase.upperBob;
  paint.rect(10, 6 + bob, 5, 8, neck[0]);
  paint.rect(11, 7 + bob, 3, 7, neck[2]);
  paint.rect(8, 3 + bob, 8, 5, neck[0]);
  paint.rect(8, 1 + bob, 2, 3, neck[1]);
  paint.rect(11, 1 + bob, 2, 3, neck[1]);
  paint.rect(14, 1 + bob, 2, 3, neck[1]);
  paint.rect(9, 3 + bob, 6, 1, neck[1]);
  paint.dot(8, 1 + bob, neck[2]);
  paint.dot(12, 1 + bob, neck[2]);
  paint.dot(15, 1 + bob, neck[2]);
  if (rearView) {
    paint.rect(9, 4 + bob, 6, 3, neck[1]);
    paint.dot(10, 5 + bob, neck[2]);
    paint.dot(13, 6 + bob, neck[2]);
    return;
  }
  paint.dot(10, 5 + bob, eye);
  paint.dot(14, 5 + bob, eye);
  paint.dot(10, 6 + bob, feature);
  paint.dot(14, 6 + bob, feature);
  paint.rect(11, 7 + bob, 3, 2 + phase.beakReach, beak[0]);
  paint.rect(11, 9 + bob + phase.beakReach, 3, 1, beak[1]);
}

function drawSideHead(paint, phase) {
  const { neck, beak, eye, feature } = EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_DATA.peacock;
  const bob = phase.upperBob;
  paint.rect(13, 6 + bob, 5, 8, neck[0]);
  paint.rect(12, 9 + bob, 4, 5, neck[2]);
  paint.rect(13, 3 + bob, 7, 5, neck[0]);
  paint.rect(13, 1 + bob, 2, 3, neck[1]);
  paint.rect(16, 1 + bob, 2, 3, neck[1]);
  paint.rect(19, 1 + bob, 1, 3, neck[1]);
  paint.rect(14, 3 + bob, 6, 1, neck[1]);
  paint.dot(13, 1 + bob, neck[2]);
  paint.dot(17, 1 + bob, neck[2]);
  paint.dot(19, 1 + bob, neck[2]);
  paint.dot(17, 5 + bob, eye);
  paint.dot(18, 5 + bob, feature);
  paint.rect(18, 6 + bob, 4 + phase.beakReach, 2, beak[0]);
  paint.dot(21 + phase.beakReach, 8 + bob, beak[1]);
}

function drawHead(paint, phase, rearView) {
  if (paint.view === 'right') drawSideHead(paint, phase);
  else drawFrontHead(paint, phase, rearView);
}

export function drawPeacockCrownveilSovereignAnatomy(context, direction, phase) {
  const paint = createPainter(context, direction);
  const rearView = paint.view === 'up';
  drawTrain(paint, phase, rearView);
  drawBody(paint, phase, rearView);
  drawLegs(paint, phase, rearView);
  drawHead(paint, phase, rearView);
}

function renderAnatomy(args, phase) {
  args.context.clearRect(0, 0, SIZE, SIZE);
  const colorContext = createColorContext(args.context, phase.flash ? '#f4f4f4' : null);
  drawPeacockCrownveilSovereignAnatomy(colorContext, args.direction, phase);
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
    peacockCrownveilSovereignGate: EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.id,
    architectureDecision: EN_E11_PEACOCK_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_GATE.id,
    role: EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_CONTRACT.role,
    anatomy: EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_CONTRACT.chassis,
    upperBody: 'connected-three-pronged-moon-white-coronet-thick-violet-neck-and-two-layered-antique-gold-mantle-wings',
    lowerBody: 'two-strong-grounded-three-toed-talons-and-one-connected-heavy-blue-green-crown-eye-train',
    motion,
    childAssetCount: EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_DATA.childAssets.length,
    effectBoundary: EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_DATA.effectBoundary,
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
    outputAnimation === 'cast' ? 'exact-cast-alias-of-connected-crownshield-double-mantle-press' : phase.name,
  );
}

function renderHurt(args, outputAnimation = 'hurt', outputFrame = args.frame) {
  const phase = HURT_PHASES[args.frame];
  renderAnatomy(args, phase);
  return resultFor(
    { ...args, animation: { ...args.animation, id: outputAnimation }, frame: outputFrame },
    'hurt',
    args.frame,
    outputAnimation === 'death' ? 'exact-death-alias-of-grounded-crownveil-hurt' : phase.name,
  );
}

function renderPeacockCrownveilSovereign(args) {
  assert(args.family.id === 'peacock', 'The EN-E11 Peacock renderer is restricted to Peacock.');
  assert(args.variant.id === 'crownveil-sovereign', 'The EN-E11 Peacock renderer is restricted to Crownveil Sovereign.');
  if (args.animation.id === 'idle') {
    assert(args.frame >= 0 && args.frame < 2, 'Peacock Crownveil Sovereign Idle authorizes only F1-F2.');
    return renderIdle(args);
  }
  if (args.animation.id === 'walk') {
    assert(args.frame >= 0 && args.frame < 4, 'Peacock Crownveil Sovereign Walk authorizes only W1-W4.');
    return renderWalk(args);
  }
  if (args.animation.id === 'attack') {
    assert(args.frame >= 0 && args.frame < 4, 'Peacock Crownveil Sovereign Attack authorizes only A1-A4.');
    return renderAttack(args);
  }
  if (args.animation.id === 'hurt') {
    assert(args.frame >= 0 && args.frame < 2, 'Peacock Crownveil Sovereign Hurt authorizes only H1-H2.');
    return renderHurt(args);
  }
  if (args.animation.id === 'cast') {
    assert(args.frame >= 0 && args.frame < 4, 'Peacock Crownveil Sovereign Cast authorizes only C1-C4.');
    return renderAttack({ ...args, animation: { ...args.animation, id: 'attack' } }, 'cast', args.frame);
  }
  if (args.animation.id === 'death') {
    assert(args.frame >= 0 && args.frame < 4, 'Peacock Crownveil Sovereign Death authorizes only D1-D4.');
    const sourceFrame = EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_DEATH_SOURCE_FRAMES[args.frame];
    return renderHurt({ ...args, animation: { ...args.animation, id: 'hurt' }, frame: sourceFrame }, 'death', args.frame);
  }
  throw new TypeError('The EN-E11 Peacock Crownveil Sovereign gate authorizes only Idle, Walk, Attack, Cast, Hurt, and Death.');
}

export const EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_RENDERER = Object.freeze({
  key: 'en-e11-peacock-crownveil-sovereign-full-v1',
  chassis: EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_CONTRACT.chassis,
  render: renderPeacockCrownveilSovereign,
});

export const EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_FAMILY = deepFreeze({
  id: 'peacock',
  name: 'Peacock',
  sliceId: 'EN-E11',
  rendererKey: EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [CROWNVEIL_SOVEREIGN_VARIANT],
  rendererData: {
    approvedPrecedingGate: EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_GATE.id,
    activeGate: EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.id,
    topologyDecision: EN_E11_PEACOCK_TOPOLOGY_DECISION.id,
  },
  review: {
    baselineVariant: 'crownveil-sovereign',
    scale: 6,
    notes: 'Visually approved as one exact private elite Peacock against approved Mirrorfan Ambusher, Rainfan Forager, and Aerie Scout. Accepted implementation 13ceea22b163ae87fe2b6acd9dcf0e45c6e800bc records only the frozen packet. The distinct Complete B outlined PNG remains review evidence only. Standing permission opens only bounded approval publication and reconciliation. This approval contains no continuation request; keep public or outline registration, fixtures, effects, child assets, other Bird families, release, accepted drift, and a pull request separate.',
  },
});

export const EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_RENDERER],
  families: [EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_FAMILY],
});
