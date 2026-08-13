import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E11_PEACOCK_RAINFAN_FORAGER_GATE,
  EN_E11_PEACOCK_TOPOLOGY_DECISION,
} from './enemy-expansion-en-e11-peacock-rainfan-forager.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_CONTRACT = deepFreeze({
  family: 'peacock',
  variant: 'mirrorfan-ambusher',
  role: 'specialist',
  state: 'implemented-complete-motion-approved',
  chassis: EN_E11_PEACOCK_TOPOLOGY_DECISION.selected,
  silhouette: 'One lean natural ground-bird body joins a compact high-forked crest, long swept neck, two angular folded wings, two long taloned legs with separated broad three-toed contacts, and one connected narrow eyespot train that becomes a split mirror-screen during Attack. It remains lighter, narrower, and more evasive than Rainfan Forager and is not an upright Birdfolk person, exposed-human Harpy, or four-legged Griffin.',
  identity: 'Dusk-indigo head-and-neck plumage, a pale throat flash, plum body feathers, copper-russet folded wings, a narrow jade train with cream-cyan-violet mirror eyes, old-ivory beak, and a body-owned fan-screen lunge distinguish the specialist Mirrorfan Ambusher.',
  effectBoundary: 'Loose feathers, wind streaks, gust rings, dust, glow, projectiles, air blades, and impact effects remain external.',
});

export const EN_E11_PEACOCK_SPECIALIST_CONTRACT_CARD = deepFreeze({
  family: 'peacock',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingGate: EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.id,
  precedingVariant: {
    id: 'rainfan-forager',
    role: 'common',
    status: 'implemented-full-approved-published',
  },
  activeVariant: {
    id: EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_CONTRACT.variant,
    role: EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_CONTRACT.role,
    status: 'implemented-full-approved',
  },
  deferredRoles: ['elite'],
});

export const EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_GATE = deepFreeze({
  id: 'en-e11-peacock-mirrorfan-ambusher-full-v1',
  status: 'approved',
  authorizedOn: '2026-08-13',
  authorizationEvidence: 'The exact Rainfan Forager implementation 9841f97fbf25074b1ac5aade89ecc84edfe0da73, approval record d9d2c601b66ca3dcd4c1e00e97df1d4d486932e5, initial published handoff 6321c247007cc8940f6080352bdfc21576482fc7, and final reconciliation eb504d2c6b419768aefe026e84f9ed6119855d5c are pushed and remote verified. The live handoff closed every next lane pending a fresh continuation. The designer then said: lets do next. Under the documented Peacock role order and selected baked-single-actor-grounded-fan-tailed-bird topology, that fresh continuation authorizes exactly one private specialist Peacock full 80-frame candidate only. It does not approve candidate pixels or authorize public or outline registration, fixtures, effects, child assets, Peacock elite, Cockatrice, Raven, Owl, Phoenix, release, accepted drift, or a pull request.',
  baseCheckpoint: 'eb504d2c6b419768aefe026e84f9ed6119855d5c',
  architectureDecision: EN_E11_PEACOCK_TOPOLOGY_DECISION.id,
  approvedOn: '2026-08-13',
  approvalEvidence: 'The exact labeled all-four-direction raw/no-outline, distinct Complete B outlined, Complete B + Form, and approved Rainfan Forager plus approved Aerie Scout and public Harpy Screecher comparison PNGs were frozen with both synchronized GIF hashes. All four exact PNG paths were loaded in Aseprite and inspected, and the transparent 20x4 inspection atlas passed dimensions, hard alpha, non-empty-cell, and strict boundary checks. The final approval prompt posted all four exact PNGs, both synchronized GIFs, and candidate digest d2b57707034f5c2f46b53de51ac800cb12b70610d5abe230db7d8a74396e0cb6. The designer replied: approved lets do next. Approval applies only to that exact Mirrorfan Ambusher digest and its six frozen review hashes. The continuation clause opens only one private elite Peacock candidate after this specialist publication is clean, pushed, remote verified, and reconciled. It does not open public or outline registration, fixtures, effects, child assets, another Bird family, release, accepted drift, or a pull request.',
  approvedImplementation: 'dcbb69ca92f8ba8be1a40c79d1ef84b56ac29216',
  publicationAuthorizedOn: '2026-08-13',
  publicationAuthorizationEvidence: 'The designer previously said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact frozen artifact or digest. It does not authorize registration, fixtures, effects, child assets, later roles or families, release, accepted drift, or a pull request.',
  publishedImplementation: 'dcbb69ca92f8ba8be1a40c79d1ef84b56ac29216',
  publishedApprovalRecord: 'a39a0ef3d5054e040c75f6c9203efa194d987429',
  initialPublishedHandoff: '',
  publicationState: 'published-awaiting-handoff-reconciliation',
  precedingApproval: {
    gateId: EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.id,
    candidateFrameDigest: EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.initialPublishedHandoff,
    currentReconciliation: 'eb504d2c6b419768aefe026e84f9ed6119855d5c',
  },
  artifact: 'enemy-expansion-review/en-e11-peacock-mirrorfan-ambusher/en-e11-peacock-mirrorfan-ambusher-full-suite-raw.png',
  artifactSha256: '0a0b2b8d90f70681d6b88a72856cd02d97083863d2c5d50a0df70b79d8f5a19d',
  outlinedArtifact: 'enemy-expansion-review/en-e11-peacock-mirrorfan-ambusher/en-e11-peacock-mirrorfan-ambusher-full-suite-outlined-complete-b.png',
  outlinedArtifactSha256: 'e1af810efb0dbf3ecec4790e76de4177be5704490e1aecc2d3bc1648e9a5abf4',
  assembledArtifact: 'enemy-expansion-review/en-e11-peacock-mirrorfan-ambusher/en-e11-peacock-mirrorfan-ambusher-full-suite-complete-b-form.png',
  assembledArtifactSha256: '41e4b101a813a55b68eb580e2b00397a602c98725eec69ca6416ffc942911895',
  comparisonArtifact: 'enemy-expansion-review/en-e11-peacock-mirrorfan-ambusher/en-e11-peacock-mirrorfan-ambusher-family-comparison.png',
  comparisonArtifactSha256: 'a7a93357411b7737e045cc57d2a55532a2bd8b5ebd06e13f28ba0322f3cab303',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e11-peacock-mirrorfan-ambusher/en-e11-peacock-mirrorfan-ambusher-full-suite-four-directions-labeled.gif',
      sha256: 'e33ddaa98a99150e9088e34108a91daa9eb5470d1a612c128f74a78618268fa3',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e11-peacock-mirrorfan-ambusher/en-e11-peacock-mirrorfan-ambusher-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '1bf90d9ff43ee0d874c227c505355163b4e19f8827f623705f569c0ea929c963',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
  },
  candidateFrameDigest: 'd2b57707034f5c2f46b53de51ac800cb12b70610d5abe230db7d8a74396e0cb6',
  rainfanComparisonDigest: '061a67e81e4c2bb4e7ed528953d2acf1e19d1453b2098ddceff1c01ca4e38128',
  aerieScoutComparisonDigest: 'afff790c5f60684561752ff7fe9f8f4312c5b46679477cc88d29764379ca41c8',
  harpyComparisonDigest: 'd7d83f0c209a8b4735e0a488a5df128bffa5407e38fd28e4fc38d73b633e5839',
  scope: 'One complete 80-frame Peacock Mirrorfan Ambusher specialist enemy across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle keeps the narrow train tucked while the high forked crest scans. Walk uses four distinct long-legged sidesteps with angular folded-wing and train counter-motion. Attack plants both talons, snaps the connected train into a split mirror-screen, crosses one wing through the face line, drives a short beak-and-talon lunge, and recovers. Hurt uses a complete-silhouette #f4f4f4 recoil and colored recovery. Cast aliases Attack exactly and Death aliases Hurt H1,H2,H2,H2.',
  anatomyContract: EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_CONTRACT.silhouette,
  reviewPresentation: 'Show the exact labeled all-four-direction Mirrorfan Ambusher raw/no-outline, outlined Complete B, Complete B + Form, avian-family comparison board, and both full-suite GIFs together.',
  exclusions: [
    'approved Rainfan Forager pixel changes',
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
  nextGate: 'The exact Mirrorfan Ambusher implementation dcbb69ca92f8ba8be1a40c79d1ef84b56ac29216 and approval record a39a0ef3d5054e040c75f6c9203efa194d987429 are remote verified. Only the initial published handoff and final reconciliation remain open. The same designer reply says lets do next, which opens exactly one private elite Peacock candidate only after this specialist publication is clean, pushed, remote verified, and reconciled. The distinct outlined PNG remains review evidence only and does not authorize outline registration. Public Peacock registration, fixtures, effects, child assets, Cockatrice, Raven, Owl, Phoenix, release, accepted drift, and a pull request remain closed.',
});

export const EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_DATA = deepFreeze({
  actor: {
    species: 'avian',
    bodyBuild: 'lean-ground-bird',
    skin: 'feathered',
    hairStyle: 'crest',
    hairColor: 'indigo',
    expression: 'alert',
    faceDetail: 'beak',
    headgear: 'none',
    outfit: 'none',
    outfitColor: 'plum',
    outfitTier: 'tier1',
    weapon: 'none',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: ['#3c4f91', '#252b5a'],
      hair: ['#7889c4', '#252b5a'],
      outfit: ['#6a526f', '#3d354f', '#aa5d48'],
    },
  },
  actorTopology: EN_E11_PEACOCK_TOPOLOGY_DECISION.selected,
  childAssets: [],
  peacock: {
    neck: ['#3c4f91', '#252b5a', '#7889c4'],
    body: ['#6a526f', '#3d354f', '#92739a'],
    wing: ['#aa5d48', '#673338', '#db8061'],
    train: ['#276b66', '#173c4d', '#4e9892'],
    eyespot: ['#e5d5a3', '#6ec3c1', '#532d67'],
    beak: ['#cfb979', '#7d6742', '#f0daa2'],
    talon: ['#b98a50', '#66503a'],
    eye: '#e8d58f',
    feature: '#26253a',
  },
  effectBoundary: 'external-loose-feathers-wind-streaks-gust-rings-dust-glow-projectiles-air-blades-and-impacts',
  bakedEffects: [],
});

const MIRRORFAN_AMBUSHER_VARIANT = deepFreeze({
  id: 'mirrorfan-ambusher',
  name: 'Mirrorfan Ambusher',
  role: EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_CONTRACT.role,
  status: EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_CONTRACT.state,
  brief: 'Specialist natural Peacock with a high forked indigo crest, lean plum body, angular copper-russet wings, long planted talons, and one narrow connected jade train that snaps into a body-owned mirror screen before a short lunge.',
  rendererData: EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_DATA,
});

export const EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'mirrorfan-watch', upperBob: 0, wingPhase: 0, legPhase: 0, tailMode: 'closed', tailSway: 0, beakReach: 0, flash: false },
  { name: 'crest-and-train-settle', upperBob: 1, wingPhase: 1, legPhase: 0, tailMode: 'closed', tailSway: 0, beakReach: 0, flash: false },
]);

const WALK_PHASES = deepFreeze([
  { name: 'left-talon-step', upperBob: 0, wingPhase: 1, legPhase: 1, tailMode: 'closed', tailSway: -1, beakReach: 0, flash: false },
  { name: 'wing-screen-compress', upperBob: 1, wingPhase: 0, legPhase: 2, tailMode: 'closed', tailSway: 0, beakReach: 0, flash: false },
  { name: 'right-talon-step', upperBob: 0, wingPhase: 1, legPhase: 3, tailMode: 'closed', tailSway: 1, beakReach: 0, flash: false },
  { name: 'ambusher-recover', upperBob: 0, wingPhase: 2, legPhase: 4, tailMode: 'closed', tailSway: 0, beakReach: 0, flash: false },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'two-talon-side-brace', upperBob: 0, wingPhase: 2, legPhase: 1, tailMode: 'half', tailSway: -1, beakReach: 0, flash: false },
  { name: 'split-mirror-screen-snap', upperBob: 0, wingPhase: 3, legPhase: 0, tailMode: 'open', tailSway: 0, beakReach: 0, flash: false },
  { name: 'cross-wing-beak-talon-lunge', upperBob: 0, wingPhase: 4, legPhase: 3, tailMode: 'open', tailSway: 0, beakReach: 1, flash: false },
  { name: 'veil-fold-recover', upperBob: 1, wingPhase: 1, legPhase: 0, tailMode: 'half', tailSway: 1, beakReach: 0, flash: false },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-mirrorfan-recoil', upperBob: 0, wingPhase: 2, legPhase: 1, tailMode: 'half', tailSway: -1, beakReach: 0, flash: true },
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
      'Mirrorfan Ambusher rectangles must use positive integer geometry.',
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
  const { eyespot } = EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_DATA.peacock;
  paint.rect(x, y, 2, 2, eyespot[0]);
  paint.dot(x + 1, y, eyespot[1]);
  paint.dot(x, y + 1, eyespot[2]);
}

function drawFrontTrain(paint, phase, rearView) {
  const { train } = EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_DATA.peacock;
  const sway = phase.tailSway;
  if (phase.tailMode === 'open') {
    paint.rect(5, 5, 4, 4, train[2]);
    paint.rect(15, 5, 4, 4, train[2]);
    paint.rect(3, 7, 7, 11, train[0]);
    paint.rect(14, 7, 7, 11, train[0]);
    paint.rect(8, 12, 8, 7, train[1]);
    paint.rect(4, 17, 16, 4, train[2]);
    drawEyespot(paint, 5, 6);
    drawEyespot(paint, 17, 6);
    drawEyespot(paint, 3, 14);
    drawEyespot(paint, 19, 14);
    drawEyespot(paint, 11, 18);
    return;
  }
  if (phase.tailMode === 'half') {
    paint.rect(8 + sway, 8, 8, 5, train[2]);
    paint.rect(6 + sway, 10, 12, 8, train[0]);
    paint.rect(4 + sway, 14, 16, 6, train[1]);
    paint.rect(6 + sway, 19, 12, 2, train[2]);
    drawEyespot(paint, 4 + sway, 17);
    drawEyespot(paint, 18 + sway, 17);
    return;
  }
  paint.rect(9 + sway, 14, 6, 6, train[0]);
  paint.rect(6 + sway, 18, 12, 3, train[1]);
  drawEyespot(paint, 6 + sway, 18);
  drawEyespot(paint, 16 + sway, 18);
  if (rearView) paint.dot(12 + sway, 19, EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_DATA.peacock.eyespot[1]);
}

function drawSideTrain(paint, phase) {
  const { train } = EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_DATA.peacock;
  const sway = phase.tailSway;
  if (phase.tailMode === 'open') {
    paint.rect(7, 4, 6, 16, train[0]);
    paint.rect(4, 7, 9, 13, train[1]);
    paint.rect(2, 10, 11, 10, train[0]);
    paint.rect(3, 18, 10, 3, train[2]);
    drawEyespot(paint, 7, 6);
    drawEyespot(paint, 4, 10);
    drawEyespot(paint, 2, 15);
    return;
  }
  if (phase.tailMode === 'half') {
    paint.rect(7 + sway, 8, 6, 6, train[2]);
    paint.rect(5 + sway, 9, 8, 11, train[0]);
    paint.rect(3 + sway, 13, 10, 7, train[1]);
    paint.rect(4 + sway, 19, 9, 2, train[2]);
    drawEyespot(paint, 7 + sway, 10);
    drawEyespot(paint, 4 + sway, 15);
    return;
  }
  paint.rect(7 + sway, 13, 6, 6, train[0]);
  paint.rect(5 + sway, 16, 8, 4, train[1]);
  paint.rect(3 + sway, 19, 10, 2, train[2]);
  drawEyespot(paint, 7 + sway, 15);
  drawEyespot(paint, 3 + sway, 19);
}

function drawTrain(paint, phase, rearView) {
  if (paint.view === 'right') drawSideTrain(paint, phase);
  else drawFrontTrain(paint, phase, rearView);
}

function drawFrontBody(paint, phase, rearView) {
  const { body, wing } = EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_DATA.peacock;
  const bob = phase.upperBob;
  paint.rect(9, 10 + bob, 6, 8, body[0]);
  paint.rect(10, 15 + bob, 4, 4, body[1]);
  paint.rect(11, 11 + bob, 2, 5, rearView ? body[2] : body[0]);
  if (phase.wingPhase === 4) {
    paint.rect(3, 10 + bob, 8, 4, wing[0]);
    paint.rect(4, 13 + bob, 7, 3, wing[1]);
    paint.rect(13, 12 + bob, 9, 4, wing[0]);
    paint.rect(14, 15 + bob, 7, 2, wing[1]);
    paint.dot(3, 15 + bob, wing[2]);
    paint.dot(21, 12 + bob, wing[2]);
    return;
  }
  if (phase.wingPhase === 3) {
    paint.rect(5, 7 + bob, 6, 9, wing[0]);
    paint.rect(6, 6 + bob, 4, 5, wing[2]);
    paint.rect(13, 7 + bob, 6, 9, wing[0]);
    paint.rect(14, 6 + bob, 4, 5, wing[2]);
    paint.rect(5, 14 + bob, 6, 3, wing[1]);
    paint.rect(13, 14 + bob, 6, 3, wing[1]);
    return;
  }
  if (phase.wingPhase === 2) {
    paint.rect(6, 10 + bob, 5, 7, wing[0]);
    paint.rect(13, 9 + bob, 5, 8, wing[0]);
    paint.rect(6, 15 + bob, 5, 3, wing[1]);
    paint.rect(13, 14 + bob, 5, 4, wing[1]);
    paint.dot(6, 17 + bob, wing[2]);
    paint.dot(17, 17 + bob, wing[2]);
    return;
  }
  const lower = phase.wingPhase === 1 ? 1 : 0;
  paint.rect(7, 11 + bob + lower, 4, 6, wing[0]);
  paint.rect(13, 11 + bob + lower, 4, 6, wing[0]);
  paint.rect(7, 15 + bob + lower, 4, 3, wing[1]);
  paint.rect(13, 15 + bob + lower, 4, 3, wing[1]);
  paint.dot(8, 17 + bob + lower, wing[2]);
  paint.dot(15, 17 + bob + lower, wing[2]);
}

function drawSideBody(paint, phase) {
  const { body, wing } = EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_DATA.peacock;
  const bob = phase.upperBob;
  paint.rect(10, 10 + bob, 7, 8, body[0]);
  paint.rect(11, 15 + bob, 6, 4, body[1]);
  paint.rect(9, 12 + bob, 4, 5, body[2]);
  if (phase.wingPhase === 4) {
    paint.rect(12, 8 + bob, 10, 5, wing[0]);
    paint.rect(13, 12 + bob, 8, 4, wing[1]);
    paint.dot(21, 8 + bob, wing[2]);
    paint.dot(20, 15 + bob, wing[2]);
    return;
  }
  if (phase.wingPhase === 3) {
    paint.rect(8, 6 + bob, 7, 9, wing[0]);
    paint.rect(9, 5 + bob, 5, 5, wing[2]);
    paint.rect(8, 13 + bob, 7, 4, wing[1]);
    return;
  }
  if (phase.wingPhase === 2) {
    paint.rect(8, 9 + bob, 8, 8, wing[0]);
    paint.rect(8, 14 + bob, 7, 4, wing[1]);
    paint.dot(8, 17 + bob, wing[2]);
    return;
  }
  const lower = phase.wingPhase === 1 ? 1 : 0;
  paint.rect(9, 11 + bob + lower, 7, 6, wing[0]);
  paint.rect(9, 15 + bob + lower, 6, 3, wing[1]);
  paint.dot(10, 17 + bob + lower, wing[2]);
}

function drawBody(paint, phase, rearView) {
  if (paint.view === 'right') drawSideBody(paint, phase);
  else drawFrontBody(paint, phase, rearView);
}

function drawFrontLeg(paint, x, rearView) {
  const { body, talon } = EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_DATA.peacock;
  paint.rect(x, 16, 2, 4, body[1]);
  paint.rect(x, 19, 2, 3, talon[1]);
  paint.rect(x - 1, 22, 4, 1, rearView ? talon[1] : talon[0]);
}

function drawSideLeg(paint, x, farLeg) {
  const { body, talon } = EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_DATA.peacock;
  paint.rect(x, 16, 2, 4, farLeg ? body[1] : body[0]);
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
  const { neck, beak, eye, feature } = EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_DATA.peacock;
  const bob = phase.upperBob;
  paint.rect(11, 6 + bob, 3, 8, neck[0]);
  paint.rect(12, 7 + bob, 1, 7, neck[2]);
  paint.rect(9, 3 + bob, 6, 5, neck[0]);
  paint.rect(10, 1 + bob, 2, 3, neck[1]);
  paint.rect(13, 1 + bob, 2, 3, neck[1]);
  paint.rect(11, 3 + bob, 3, 1, neck[1]);
  paint.dot(10, 1 + bob, neck[2]);
  paint.dot(14, 1 + bob, neck[2]);
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
  paint.rect(11, 7 + bob, 2, 2 + phase.beakReach, beak[0]);
  paint.rect(11, 9 + bob + phase.beakReach, 2, 1, beak[1]);
}

function drawSideHead(paint, phase) {
  const { neck, beak, eye, feature } = EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_DATA.peacock;
  const bob = phase.upperBob;
  paint.rect(14, 6 + bob, 3, 8, neck[0]);
  paint.rect(13, 9 + bob, 3, 5, neck[2]);
  paint.rect(14, 3 + bob, 6, 5, neck[0]);
  paint.rect(15, 1 + bob, 2, 3, neck[1]);
  paint.rect(18, 1 + bob, 1, 3, neck[1]);
  paint.rect(16, 3 + bob, 3, 1, neck[1]);
  paint.dot(15, 1 + bob, neck[2]);
  paint.dot(18, 1 + bob, neck[2]);
  paint.dot(18, 5 + bob, eye);
  paint.dot(19, 5 + bob, feature);
  paint.rect(19, 6 + bob, 3 + phase.beakReach, 2, beak[0]);
  paint.dot(21 + phase.beakReach, 8 + bob, beak[1]);
}

function drawHead(paint, phase, rearView) {
  if (paint.view === 'right') drawSideHead(paint, phase);
  else drawFrontHead(paint, phase, rearView);
}

export function drawPeacockMirrorfanAmbusherAnatomy(context, direction, phase) {
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
  drawPeacockMirrorfanAmbusherAnatomy(colorContext, args.direction, phase);
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
    peacockMirrorfanAmbusherGate: EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_GATE.id,
    architectureDecision: EN_E11_PEACOCK_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.id,
    role: EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_CONTRACT.role,
    anatomy: EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_CONTRACT.chassis,
    upperBody: 'high-forked-crest-long-dusk-indigo-neck-and-two-angular-copper-russet-wings',
    lowerBody: 'two-long-grounded-three-toed-talons-and-one-connected-jade-mirror-eye-train',
    motion,
    childAssetCount: EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_DATA.childAssets.length,
    effectBoundary: EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_DATA.effectBoundary,
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
    outputAnimation === 'cast' ? 'exact-cast-alias-of-connected-mirrorfan-wing-and-beak-strike' : phase.name,
  );
}

function renderHurt(args, outputAnimation = 'hurt', outputFrame = args.frame) {
  const phase = HURT_PHASES[args.frame];
  renderAnatomy(args, phase);
  return resultFor(
    { ...args, animation: { ...args.animation, id: outputAnimation }, frame: outputFrame },
    'hurt',
    args.frame,
    outputAnimation === 'death' ? 'exact-death-alias-of-grounded-mirrorfan-hurt' : phase.name,
  );
}

function renderPeacockMirrorfanAmbusher(args) {
  assert(args.family.id === 'peacock', 'The EN-E11 Peacock renderer is restricted to Peacock.');
  assert(args.variant.id === 'mirrorfan-ambusher', 'The EN-E11 Peacock renderer is restricted to Mirrorfan Ambusher.');
  if (args.animation.id === 'idle') {
    assert(args.frame >= 0 && args.frame < 2, 'Peacock Mirrorfan Ambusher Idle authorizes only F1-F2.');
    return renderIdle(args);
  }
  if (args.animation.id === 'walk') {
    assert(args.frame >= 0 && args.frame < 4, 'Peacock Mirrorfan Ambusher Walk authorizes only W1-W4.');
    return renderWalk(args);
  }
  if (args.animation.id === 'attack') {
    assert(args.frame >= 0 && args.frame < 4, 'Peacock Mirrorfan Ambusher Attack authorizes only A1-A4.');
    return renderAttack(args);
  }
  if (args.animation.id === 'hurt') {
    assert(args.frame >= 0 && args.frame < 2, 'Peacock Mirrorfan Ambusher Hurt authorizes only H1-H2.');
    return renderHurt(args);
  }
  if (args.animation.id === 'cast') {
    assert(args.frame >= 0 && args.frame < 4, 'Peacock Mirrorfan Ambusher Cast authorizes only C1-C4.');
    return renderAttack({ ...args, animation: { ...args.animation, id: 'attack' } }, 'cast', args.frame);
  }
  if (args.animation.id === 'death') {
    assert(args.frame >= 0 && args.frame < 4, 'Peacock Mirrorfan Ambusher Death authorizes only D1-D4.');
    const sourceFrame = EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_DEATH_SOURCE_FRAMES[args.frame];
    return renderHurt({ ...args, animation: { ...args.animation, id: 'hurt' }, frame: sourceFrame }, 'death', args.frame);
  }
  throw new TypeError('The EN-E11 Peacock Mirrorfan Ambusher gate authorizes only Idle, Walk, Attack, Cast, Hurt, and Death.');
}

export const EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_RENDERER = Object.freeze({
  key: 'en-e11-peacock-mirrorfan-ambusher-full-v1',
  chassis: EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_CONTRACT.chassis,
  render: renderPeacockMirrorfanAmbusher,
});

export const EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_FAMILY = deepFreeze({
  id: 'peacock',
  name: 'Peacock',
  sliceId: 'EN-E11',
  rendererKey: EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [MIRRORFAN_AMBUSHER_VARIANT],
  rendererData: {
    approvedPrecedingGate: EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.id,
    activeGate: EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_GATE.id,
    topologyDecision: EN_E11_PEACOCK_TOPOLOGY_DECISION.id,
  },
  review: {
    baselineVariant: 'mirrorfan-ambusher',
    scale: 6,
    notes: 'Visually approved as one exact private specialist Peacock against approved Rainfan Forager and Aerie Scout plus public Harpy Screecher. Accepted implementation dcbb69ca92f8ba8be1a40c79d1ef84b56ac29216 and approval record a39a0ef3d5054e040c75f6c9203efa194d987429 are remote verified. Only the initial published handoff and final reconciliation remain open. The distinct Complete B outlined PNG remains review evidence only. The same reply opens exactly one private elite Peacock candidate after clean remote reconciliation; keep public or outline registration, fixtures, effects, child assets, other Bird families, release, accepted drift, and a pull request separate.',
  },
});

export const EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_RENDERER],
  families: [EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_FAMILY],
});
