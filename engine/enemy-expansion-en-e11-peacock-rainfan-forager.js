import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E10_STONEFERN_BASTION_GATE } from './enemy-expansion-en-e10-rhino-stonefern-bastion.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E11_PEACOCK_TOPOLOGY_DECISION = deepFreeze({
  id: 'en-e11-peacock-topology-v1',
  status: 'selected',
  selected: 'baked-single-actor-grounded-fan-tailed-bird',
  approvedOn: '2026-08-13',
  approvalEvidence: 'After selecting Birds as the next enemy category, the designer approved the proposed grounded Peacock topology and said: approved and letsd go.',
  childAssets: [],
  rationale: 'A single connected actor preserves the natural peafowl silhouette, folded wings, talon contacts, and body-owned train fan in every direction without turning feathers into child effects.',
});

export const EN_E11_PEACOCK_RAINFAN_FORAGER_CONTRACT = deepFreeze({
  family: 'peacock',
  variant: 'rainfan-forager',
  role: 'common',
  state: 'implemented-complete-motion-approved',
  chassis: EN_E11_PEACOCK_TOPOLOGY_DECISION.selected,
  silhouette: 'One compact natural ground-bird body joins a small crested head, long upright neck, two folded wings, two taloned legs with broad three-toed contacts, and one connected eyespot train that stays compact at rest and becomes a partial fan during Attack. It is not an upright Birdfolk person, an exposed-human Harpy, or a four-legged Griffin.',
  identity: 'Cobalt and teal head-and-neck plumage, moss-green body feathers, burnished-bronze folded wings, a dark teal eyespot train, old-ivory beak and talons, and a body-owned rainfan feint distinguish the common Rainfan Forager.',
  effectBoundary: 'Loose feathers, wind streaks, gust rings, dust, glow, projectiles, air blades, and impact effects remain external.',
});

export const EN_E11_PEACOCK_COMMON_CONTRACT_CARD = deepFreeze({
  family: 'peacock',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingGate: EN_E10_STONEFERN_BASTION_GATE.id,
  activeVariant: {
    id: EN_E11_PEACOCK_RAINFAN_FORAGER_CONTRACT.variant,
    role: EN_E11_PEACOCK_RAINFAN_FORAGER_CONTRACT.role,
    status: 'implemented-full-approved',
  },
  deferredRoles: ['specialist', 'elite'],
});

export const EN_E11_PEACOCK_RAINFAN_FORAGER_GATE = deepFreeze({
  id: 'en-e11-peacock-rainfan-forager-full-v1',
  status: 'approved',
  authorizedOn: '2026-08-13',
  authorizationEvidence: 'After reviewing other enemy categories and choosing Birds for now, the designer approved the proposed baked-single-actor-grounded-fan-tailed-bird topology and authorized the next bounded candidate with: approved and letsd go. This authorizes exactly one private common Peacock full 80-frame candidate only.',
  baseCheckpoint: '51033b2385fe5e3eab64006b935a85c91140e86f',
  architectureDecision: EN_E11_PEACOCK_TOPOLOGY_DECISION.id,
  approvedOn: '2026-08-13',
  approvalEvidence: 'The exact labeled all-four-direction raw/no-outline, distinct Complete B outlined, Complete B + Form, and approved Aerie Scout plus public Harpy Screecher and Griffin Royal comparison PNGs were frozen with both synchronized GIF hashes. All four exact PNG paths were opened and inspected in Aseprite, and the transparent 20x4 inspection atlas passed dimensions, hard alpha, non-empty-cell, and strict boundary checks. The final approval prompt posted all four exact PNGs, both synchronized GIFs, and candidate digest 061a67e81e4c2bb4e7ed528953d2acf1e19d1453b2098ddceff1c01ca4e38128. The designer replied: approved. Approval applies only to that exact Rainfan Forager digest and its six frozen review hashes. It does not open public or outline registration, fixtures, effects, child assets, another Peacock role, another Bird family, release, accepted drift, or a pull request.',
  approvedImplementation: '9841f97fbf25074b1ac5aade89ecc84edfe0da73',
  publicationAuthorizedOn: '2026-08-13',
  publicationAuthorizationEvidence: 'The designer previously said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact frozen artifact or digest. It does not authorize registration, fixtures, effects, child assets, later roles or families, release, accepted drift, or a pull request.',
  publishedImplementation: '9841f97fbf25074b1ac5aade89ecc84edfe0da73',
  publishedApprovalRecord: 'd9d2c601b66ca3dcd4c1e00e97df1d4d486932e5',
  initialPublishedHandoff: '6321c247007cc8940f6080352bdfc21576482fc7',
  publicationState: 'published',
  precedingApproval: {
    gateId: EN_E10_STONEFERN_BASTION_GATE.id,
    candidateFrameDigest: EN_E10_STONEFERN_BASTION_GATE.candidateFrameDigest,
    publishedImplementation: EN_E10_STONEFERN_BASTION_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E10_STONEFERN_BASTION_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E10_STONEFERN_BASTION_GATE.initialPublishedHandoff,
    currentReconciliation: '51033b2385fe5e3eab64006b935a85c91140e86f',
  },
  artifact: 'enemy-expansion-review/en-e11-peacock-rainfan-forager/en-e11-peacock-rainfan-forager-full-suite-raw.png',
  artifactSha256: '4a0b21ddca2ec6786e541fd6890e1984897f80cfa936776c6fec571201d123a2',
  outlinedArtifact: 'enemy-expansion-review/en-e11-peacock-rainfan-forager/en-e11-peacock-rainfan-forager-full-suite-outlined-complete-b.png',
  outlinedArtifactSha256: '2c65e3b9dba6cfa50c0bf79fefd99bd13456a4616e25e903e886d65835f022ce',
  assembledArtifact: 'enemy-expansion-review/en-e11-peacock-rainfan-forager/en-e11-peacock-rainfan-forager-full-suite-complete-b-form.png',
  assembledArtifactSha256: '1c2b0bf4a41a4695d18aaaea3e45545cd650a42cc727a7750824992ae1a2cc2d',
  comparisonArtifact: 'enemy-expansion-review/en-e11-peacock-rainfan-forager/en-e11-peacock-rainfan-forager-family-comparison.png',
  comparisonArtifactSha256: 'd8c7f3951067c959c16388e1a388521a77f0ba08e5866199c59555c7cad2a46d',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e11-peacock-rainfan-forager/en-e11-peacock-rainfan-forager-full-suite-four-directions-labeled.gif',
      sha256: '5cebea74dcfc6bc70f349f8d90fb9e5a88aaeeac3971a7bcaf41ab9942b8e182',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e11-peacock-rainfan-forager/en-e11-peacock-rainfan-forager-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: 'a0c8f2f7f07da4f2e67bda4093eadf510444abfba29eaa72cb2c2e5317a816db',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
  },
  candidateFrameDigest: '061a67e81e4c2bb4e7ed528953d2acf1e19d1453b2098ddceff1c01ca4e38128',
  aerieScoutComparisonDigest: 'afff790c5f60684561752ff7fe9f8f4312c5b46679477cc88d29764379ca41c8',
  harpyComparisonDigest: 'd7d83f0c209a8b4735e0a488a5df128bffa5407e38fd28e4fc38d73b633e5839',
  griffinComparisonDigest: '1d662d1e0323123935cdeca2ce232146da1ff0981e240d2788b917868ec5dd08',
  scope: 'One complete 80-frame Peacock Rainfan Forager common enemy across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle settles the connected crest and train over planted talons. Walk uses four distinct two-leg steps with folded-wing and train counter-motion. Attack braces on two talons, opens the connected eyespot train into a partial fan, drives a short wing buffet and beak strike, then recovers. Hurt uses a complete-silhouette #f4f4f4 recoil and colored recovery. Cast aliases Attack exactly and Death aliases Hurt H1,H2,H2,H2.',
  anatomyContract: EN_E11_PEACOCK_RAINFAN_FORAGER_CONTRACT.silhouette,
  reviewPresentation: 'Show the exact labeled all-four-direction Rainfan Forager raw/no-outline, outlined Complete B, Complete B + Form, avian-family comparison board, and both full-suite GIFs together.',
  exclusions: [
    'approved Stonefern Bastion pixel changes',
    'Peacock specialist',
    'Peacock elite',
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
  nextGate: 'The exact Rainfan Forager implementation 9841f97fbf25074b1ac5aade89ecc84edfe0da73, approval record d9d2c601b66ca3dcd4c1e00e97df1d4d486932e5, and initial published handoff 6321c247007cc8940f6080352bdfc21576482fc7 are remote verified; this reconciliation completes the bounded publication tuple. The designer reply contains no continuation request, so no Peacock specialist or elite, other Bird family, or other sprite lane is open; a fresh explicit continuation is required. The distinct outlined PNG remains review evidence only and does not authorize outline registration. Public Peacock registration, fixtures, effects, child assets, Cockatrice, Raven, Owl, Phoenix, release, accepted drift, and a pull request remain closed.',
});

export const EN_E11_PEACOCK_RAINFAN_FORAGER_DATA = deepFreeze({
  actor: {
    species: 'avian',
    bodyBuild: 'compact-ground-bird',
    skin: 'feathered',
    hairStyle: 'crest',
    hairColor: 'cobalt',
    expression: 'alert',
    faceDetail: 'beak',
    headgear: 'none',
    outfit: 'none',
    outfitColor: 'teal',
    outfitTier: 'tier1',
    weapon: 'none',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: ['#276b7d', '#163f4d'],
      hair: ['#357f8d', '#1b4f5d'],
      outfit: ['#526b4b', '#2e493e', '#a66f3f'],
    },
  },
  actorTopology: EN_E11_PEACOCK_TOPOLOGY_DECISION.selected,
  childAssets: [],
  peacock: {
    neck: ['#276b7d', '#163f4d', '#49a1aa'],
    body: ['#526b4b', '#2e493e', '#7d8f58'],
    wing: ['#a66f3f', '#633f2b', '#d09350'],
    train: ['#2f705f', '#183f39', '#4e9478'],
    eyespot: ['#d7ad4f', '#2c8e93', '#243343'],
    beak: ['#d7bd82', '#8e7147', '#f0daa2'],
    talon: ['#c79a55', '#765d38'],
    eye: '#f1cf55',
    feature: '#292d37',
  },
  effectBoundary: 'external-loose-feathers-wind-streaks-gust-rings-dust-glow-projectiles-air-blades-and-impacts',
  bakedEffects: [],
});

const RAINFAN_FORAGER_VARIANT = deepFreeze({
  id: 'rainfan-forager',
  name: 'Rainfan Forager',
  role: EN_E11_PEACOCK_RAINFAN_FORAGER_CONTRACT.role,
  status: EN_E11_PEACOCK_RAINFAN_FORAGER_CONTRACT.state,
  brief: 'Common natural Peacock with a crested cobalt neck, compact moss body, bronze folded wings, two planted talons, and one connected teal eyespot train that opens for a body-owned fan feint.',
  rendererData: EN_E11_PEACOCK_RAINFAN_FORAGER_DATA,
});

export const EN_E11_PEACOCK_RAINFAN_FORAGER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'rainfan-watch', upperBob: 0, wingPhase: 0, legPhase: 0, tailMode: 'closed', tailSway: 0, beakReach: 0, flash: false },
  { name: 'crest-and-train-settle', upperBob: 1, wingPhase: 1, legPhase: 0, tailMode: 'closed', tailSway: 0, beakReach: 0, flash: false },
]);

const WALK_PHASES = deepFreeze([
  { name: 'left-talon-step', upperBob: 0, wingPhase: 1, legPhase: 1, tailMode: 'closed', tailSway: -1, beakReach: 0, flash: false },
  { name: 'folded-wing-compress', upperBob: 1, wingPhase: 0, legPhase: 2, tailMode: 'closed', tailSway: 0, beakReach: 0, flash: false },
  { name: 'right-talon-step', upperBob: 0, wingPhase: 1, legPhase: 3, tailMode: 'closed', tailSway: 1, beakReach: 0, flash: false },
  { name: 'forager-recover', upperBob: 0, wingPhase: 2, legPhase: 4, tailMode: 'closed', tailSway: 0, beakReach: 0, flash: false },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'two-talon-fan-brace', upperBob: 0, wingPhase: 2, legPhase: 1, tailMode: 'half', tailSway: -1, beakReach: 0, flash: false },
  { name: 'connected-rainfan-open', upperBob: 0, wingPhase: 3, legPhase: 0, tailMode: 'open', tailSway: 0, beakReach: 0, flash: false },
  { name: 'wing-buffet-beak-strike', upperBob: 0, wingPhase: 4, legPhase: 3, tailMode: 'open', tailSway: 0, beakReach: 1, flash: false },
  { name: 'rainfan-fold-recover', upperBob: 1, wingPhase: 1, legPhase: 0, tailMode: 'half', tailSway: 1, beakReach: 0, flash: false },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-rainfan-recoil', upperBob: 0, wingPhase: 2, legPhase: 1, tailMode: 'half', tailSway: -1, beakReach: 0, flash: true },
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
      'Rainfan Forager rectangles must use positive integer geometry.',
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
  const { eyespot } = EN_E11_PEACOCK_RAINFAN_FORAGER_DATA.peacock;
  paint.rect(x, y, 2, 2, eyespot[0]);
  paint.dot(x + 1, y, eyespot[1]);
  paint.dot(x, y + 1, eyespot[2]);
}

function drawFrontTrain(paint, phase, rearView) {
  const { train } = EN_E11_PEACOCK_RAINFAN_FORAGER_DATA.peacock;
  const sway = phase.tailSway;
  if (phase.tailMode === 'open') {
    paint.rect(7, 5, 3, 5, train[1]);
    paint.rect(11, 4, 3, 6, train[0]);
    paint.rect(15, 5, 3, 5, train[1]);
    paint.rect(4, 7, 16, 11, train[0]);
    paint.rect(2, 10, 20, 7, train[1]);
    paint.rect(4, 17, 16, 3, train[2]);
    drawEyespot(paint, 10, 5);
    drawEyespot(paint, 2, 11);
    drawEyespot(paint, 20, 11);
    drawEyespot(paint, 5, 17);
    drawEyespot(paint, 17, 17);
    return;
  }
  if (phase.tailMode === 'half') {
    paint.rect(7 + sway, 9, 10, 4, train[1]);
    paint.rect(5 + sway, 11, 14, 8, train[0]);
    paint.rect(4 + sway, 14, 16, 5, train[1]);
    paint.rect(6 + sway, 19, 12, 2, train[2]);
    drawEyespot(paint, 4 + sway, 18);
    drawEyespot(paint, 18 + sway, 18);
    return;
  }
  paint.rect(8 + sway, 14, 8, 5, train[0]);
  paint.rect(7 + sway, 17, 10, 3, train[1]);
  paint.rect(6 + sway, 19, 12, 2, train[2]);
  drawEyespot(paint, 6 + sway, 19);
  drawEyespot(paint, 16 + sway, 19);
  if (rearView) paint.dot(11 + sway, 19, EN_E11_PEACOCK_RAINFAN_FORAGER_DATA.peacock.eyespot[1]);
}

function drawSideTrain(paint, phase) {
  const { train } = EN_E11_PEACOCK_RAINFAN_FORAGER_DATA.peacock;
  const sway = phase.tailSway;
  if (phase.tailMode === 'open') {
    paint.rect(7, 4, 5, 16, train[0]);
    paint.rect(4, 6, 8, 14, train[1]);
    paint.rect(2, 9, 10, 11, train[0]);
    paint.rect(3, 18, 10, 3, train[2]);
    drawEyespot(paint, 7, 6);
    drawEyespot(paint, 4, 10);
    drawEyespot(paint, 7, 14);
    return;
  }
  if (phase.tailMode === 'half') {
    paint.rect(6 + sway, 7, 6, 6, train[1]);
    paint.rect(4 + sway, 9, 8, 10, train[0]);
    paint.rect(3 + sway, 13, 9, 7, train[1]);
    paint.rect(4 + sway, 19, 9, 2, train[2]);
    drawEyespot(paint, 7 + sway, 9);
    drawEyespot(paint, 5 + sway, 14);
    return;
  }
  paint.rect(7 + sway, 13, 6, 5, train[0]);
  paint.rect(5 + sway, 16, 8, 4, train[1]);
  paint.rect(3 + sway, 19, 10, 2, train[2]);
  drawEyespot(paint, 7 + sway, 15);
  drawEyespot(paint, 4 + sway, 19);
}

function drawTrain(paint, phase, rearView) {
  if (paint.view === 'right') drawSideTrain(paint, phase);
  else drawFrontTrain(paint, phase, rearView);
}

function drawFrontBody(paint, phase, rearView) {
  const { body, wing } = EN_E11_PEACOCK_RAINFAN_FORAGER_DATA.peacock;
  const bob = phase.upperBob;
  paint.rect(8, 10 + bob, 8, 8, body[0]);
  paint.rect(9, 15 + bob, 6, 4, body[1]);
  paint.rect(10, 11 + bob, 4, 5, rearView ? body[2] : body[0]);
  if (phase.wingPhase === 4) {
    paint.rect(2, 10 + bob, 8, 5, wing[0]);
    paint.rect(3, 14 + bob, 7, 2, wing[1]);
    paint.rect(14, 10 + bob, 8, 5, wing[0]);
    paint.rect(14, 14 + bob, 7, 2, wing[1]);
    paint.dot(2, 14 + bob, wing[2]);
    paint.dot(21, 14 + bob, wing[2]);
    return;
  }
  if (phase.wingPhase === 3) {
    paint.rect(4, 7 + bob, 6, 9, wing[0]);
    paint.rect(5, 6 + bob, 4, 5, wing[2]);
    paint.rect(14, 7 + bob, 6, 9, wing[0]);
    paint.rect(15, 6 + bob, 4, 5, wing[2]);
    paint.rect(5, 14 + bob, 5, 3, wing[1]);
    paint.rect(14, 14 + bob, 5, 3, wing[1]);
    return;
  }
  if (phase.wingPhase === 2) {
    paint.rect(5, 10 + bob, 5, 7, wing[0]);
    paint.rect(14, 10 + bob, 5, 7, wing[0]);
    paint.rect(5, 15 + bob, 5, 3, wing[1]);
    paint.rect(14, 15 + bob, 5, 3, wing[1]);
    paint.dot(5, 17 + bob, wing[2]);
    paint.dot(18, 17 + bob, wing[2]);
    return;
  }
  const lower = phase.wingPhase === 1 ? 1 : 0;
  paint.rect(6, 11 + bob + lower, 4, 6, wing[0]);
  paint.rect(14, 11 + bob + lower, 4, 6, wing[0]);
  paint.rect(6, 15 + bob + lower, 4, 3, wing[1]);
  paint.rect(14, 15 + bob + lower, 4, 3, wing[1]);
  paint.dot(7, 17 + bob + lower, wing[2]);
  paint.dot(16, 17 + bob + lower, wing[2]);
}

function drawSideBody(paint, phase) {
  const { body, wing } = EN_E11_PEACOCK_RAINFAN_FORAGER_DATA.peacock;
  const bob = phase.upperBob;
  paint.rect(9, 10 + bob, 8, 8, body[0]);
  paint.rect(10, 15 + bob, 7, 4, body[1]);
  paint.rect(8, 12 + bob, 4, 5, body[2]);
  paint.rect(8, 12 + bob, 6, 5, wing[1]);
  if (phase.wingPhase === 4) {
    paint.rect(12, 9 + bob, 10, 5, wing[0]);
    paint.rect(13, 13 + bob, 8, 3, wing[1]);
    paint.dot(21, 9 + bob, wing[2]);
    paint.dot(20, 15 + bob, wing[2]);
    return;
  }
  if (phase.wingPhase === 3) {
    paint.rect(8, 6 + bob, 6, 9, wing[0]);
    paint.rect(9, 5 + bob, 4, 5, wing[2]);
    paint.rect(8, 13 + bob, 6, 4, wing[1]);
    return;
  }
  if (phase.wingPhase === 2) {
    paint.rect(7, 10 + bob, 8, 7, wing[0]);
    paint.rect(7, 15 + bob, 7, 3, wing[1]);
    paint.dot(7, 17 + bob, wing[2]);
    return;
  }
  const lower = phase.wingPhase === 1 ? 1 : 0;
  paint.rect(8, 11 + bob + lower, 7, 6, wing[0]);
  paint.rect(8, 15 + bob + lower, 6, 3, wing[1]);
  paint.dot(9, 17 + bob + lower, wing[2]);
}

function drawBody(paint, phase, rearView) {
  if (paint.view === 'right') drawSideBody(paint, phase);
  else drawFrontBody(paint, phase, rearView);
}

function drawFrontLeg(paint, x, rearView) {
  const { body, talon } = EN_E11_PEACOCK_RAINFAN_FORAGER_DATA.peacock;
  paint.rect(x, 17, 2, 3, body[1]);
  paint.rect(x, 19, 2, 3, talon[1]);
  paint.rect(x - 1, 22, 4, 1, rearView ? talon[1] : talon[0]);
}

function drawSideLeg(paint, x, farLeg) {
  const { body, talon } = EN_E11_PEACOCK_RAINFAN_FORAGER_DATA.peacock;
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
  const { neck, beak, eye, feature } = EN_E11_PEACOCK_RAINFAN_FORAGER_DATA.peacock;
  const bob = phase.upperBob;
  paint.rect(10, 6 + bob, 4, 7, neck[0]);
  paint.rect(11, 7 + bob, 2, 6, neck[2]);
  paint.rect(9, 3 + bob, 6, 5, neck[0]);
  paint.rect(10, 2 + bob, 4, 2, neck[1]);
  paint.rect(11, 1 + bob, 2, 3, neck[1]);
  paint.dot(10, 2 + bob, neck[2]);
  paint.dot(13, 2 + bob, neck[2]);
  if (rearView) {
    paint.rect(10, 4 + bob, 4, 3, neck[1]);
    paint.dot(11, 5 + bob, neck[2]);
    paint.dot(12, 6 + bob, neck[2]);
    return;
  }
  paint.dot(10, 5 + bob, eye);
  paint.dot(13, 5 + bob, eye);
  paint.dot(10, 6 + bob, feature);
  paint.dot(13, 6 + bob, feature);
  paint.rect(10, 7 + bob, 4, 2 + phase.beakReach, beak[0]);
  paint.rect(11, 9 + bob + phase.beakReach, 2, 1, beak[1]);
}

function drawSideHead(paint, phase) {
  const { neck, beak, eye, feature } = EN_E11_PEACOCK_RAINFAN_FORAGER_DATA.peacock;
  const bob = phase.upperBob;
  paint.rect(14, 6 + bob, 3, 8, neck[0]);
  paint.rect(13, 9 + bob, 3, 5, neck[2]);
  paint.rect(14, 3 + bob, 6, 5, neck[0]);
  paint.rect(15, 1 + bob, 2, 3, neck[1]);
  paint.dot(14, 2 + bob, neck[2]);
  paint.dot(17, 2 + bob, neck[2]);
  paint.dot(18, 5 + bob, eye);
  paint.dot(19, 5 + bob, feature);
  paint.rect(19, 6 + bob, 3 + phase.beakReach, 2, beak[0]);
  paint.dot(21 + phase.beakReach, 8 + bob, beak[1]);
}

function drawHead(paint, phase, rearView) {
  if (paint.view === 'right') drawSideHead(paint, phase);
  else drawFrontHead(paint, phase, rearView);
}

export function drawPeacockRainfanForagerAnatomy(context, direction, phase) {
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
  drawPeacockRainfanForagerAnatomy(colorContext, args.direction, phase);
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
    peacockRainfanForagerGate: EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.id,
    architectureDecision: EN_E11_PEACOCK_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E10_STONEFERN_BASTION_GATE.id,
    role: EN_E11_PEACOCK_RAINFAN_FORAGER_CONTRACT.role,
    anatomy: EN_E11_PEACOCK_RAINFAN_FORAGER_CONTRACT.chassis,
    upperBody: 'compact-crested-head-long-cobalt-neck-and-two-folded-bronze-wings',
    lowerBody: 'two-grounded-three-toed-talons-and-one-connected-eyespot-train',
    motion,
    childAssetCount: EN_E11_PEACOCK_RAINFAN_FORAGER_DATA.childAssets.length,
    effectBoundary: EN_E11_PEACOCK_RAINFAN_FORAGER_DATA.effectBoundary,
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
    outputAnimation === 'cast' ? 'exact-cast-alias-of-connected-rainfan-wing-and-beak-strike' : phase.name,
  );
}

function renderHurt(args, outputAnimation = 'hurt', outputFrame = args.frame) {
  const phase = HURT_PHASES[args.frame];
  renderAnatomy(args, phase);
  return resultFor(
    { ...args, animation: { ...args.animation, id: outputAnimation }, frame: outputFrame },
    'hurt',
    args.frame,
    outputAnimation === 'death' ? 'exact-death-alias-of-grounded-rainfan-hurt' : phase.name,
  );
}

function renderPeacockRainfanForager(args) {
  assert(args.family.id === 'peacock', 'The EN-E11 Peacock renderer is restricted to Peacock.');
  assert(args.variant.id === 'rainfan-forager', 'The EN-E11 Peacock renderer is restricted to Rainfan Forager.');
  if (args.animation.id === 'idle') {
    assert(args.frame >= 0 && args.frame < 2, 'Peacock Rainfan Forager Idle authorizes only F1-F2.');
    return renderIdle(args);
  }
  if (args.animation.id === 'walk') {
    assert(args.frame >= 0 && args.frame < 4, 'Peacock Rainfan Forager Walk authorizes only W1-W4.');
    return renderWalk(args);
  }
  if (args.animation.id === 'attack') {
    assert(args.frame >= 0 && args.frame < 4, 'Peacock Rainfan Forager Attack authorizes only A1-A4.');
    return renderAttack(args);
  }
  if (args.animation.id === 'hurt') {
    assert(args.frame >= 0 && args.frame < 2, 'Peacock Rainfan Forager Hurt authorizes only H1-H2.');
    return renderHurt(args);
  }
  if (args.animation.id === 'cast') {
    assert(args.frame >= 0 && args.frame < 4, 'Peacock Rainfan Forager Cast authorizes only C1-C4.');
    return renderAttack({ ...args, animation: { ...args.animation, id: 'attack' } }, 'cast', args.frame);
  }
  if (args.animation.id === 'death') {
    assert(args.frame >= 0 && args.frame < 4, 'Peacock Rainfan Forager Death authorizes only D1-D4.');
    const sourceFrame = EN_E11_PEACOCK_RAINFAN_FORAGER_DEATH_SOURCE_FRAMES[args.frame];
    return renderHurt({ ...args, animation: { ...args.animation, id: 'hurt' }, frame: sourceFrame }, 'death', args.frame);
  }
  throw new TypeError('The EN-E11 Peacock Rainfan Forager gate authorizes only Idle, Walk, Attack, Cast, Hurt, and Death.');
}

export const EN_E11_PEACOCK_RAINFAN_FORAGER_RENDERER = Object.freeze({
  key: 'en-e11-peacock-rainfan-forager-full-v1',
  chassis: EN_E11_PEACOCK_RAINFAN_FORAGER_CONTRACT.chassis,
  render: renderPeacockRainfanForager,
});

export const EN_E11_PEACOCK_RAINFAN_FORAGER_FAMILY = deepFreeze({
  id: 'peacock',
  name: 'Peacock',
  sliceId: 'EN-E11',
  rendererKey: EN_E11_PEACOCK_RAINFAN_FORAGER_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [RAINFAN_FORAGER_VARIANT],
  rendererData: {
    approvedPrecedingGate: EN_E10_STONEFERN_BASTION_GATE.id,
    activeGate: EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.id,
    topologyDecision: EN_E11_PEACOCK_TOPOLOGY_DECISION.id,
  },
  review: {
    baselineVariant: 'rainfan-forager',
    scale: 6,
    notes: 'Visually approved as one exact private common Peacock against approved Aerie Scout plus public Harpy Screecher and Griffin Royal. Accepted implementation 9841f97fbf25074b1ac5aade89ecc84edfe0da73, approval record d9d2c601b66ca3dcd4c1e00e97df1d4d486932e5, and initial published handoff 6321c247007cc8940f6080352bdfc21576482fc7 are remote verified; this reconciliation completes the bounded publication tuple. The distinct Complete B outlined PNG remains review evidence only. The designer reply contains no continuation request, so no Peacock specialist or elite, other Bird family, or other sprite lane is open; keep public or outline registration, fixtures, effects, child assets, release, accepted drift, and a pull request separate.',
  },
});

export const EN_E11_PEACOCK_RAINFAN_FORAGER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E11_PEACOCK_RAINFAN_FORAGER_RENDERER],
  families: [EN_E11_PEACOCK_RAINFAN_FORAGER_FAMILY],
});
