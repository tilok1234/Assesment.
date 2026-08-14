import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE,
  EN_E11_RAVEN_TOPOLOGY_DECISION,
} from './enemy-expansion-en-e11-raven-cinderquill-scavenger.js';
import {
  EN_E11_RAVEN_MOURNGLASS_SCRIER_CONTRACT,
  EN_E11_RAVEN_MOURNGLASS_SCRIER_DATA,
  EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE,
  EN_E11_RAVEN_MOURNGLASS_SCRIER_RENDERER,
} from './enemy-expansion-en-e11-raven-mournglass-scrier.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E11_RAVEN_GRAVECROWN_HARROWER_CONTRACT = deepFreeze({
  family: 'raven',
  variant: 'gravecrown-harrower',
  role: 'elite',
  state: 'implemented-complete-motion-approved',
  chassis: EN_E11_RAVEN_TOPOLOGY_DECISION.selected,
  silhouette: 'The complete approved Mournglass Scrier corvid remains readable beneath a connected three-pronged gravecrown, bone throat gorget, broad layered mantle-wing plates, and a barbed wedge tail. The rounded Raven head, hooked beak, short throat, deep body, two body-owned wings, two separated taloned feet, and connected tail remain one grounded actor in every direction. Attack expands the body-owned mantle into a wide gravegate without floating pieces, exposed human anatomy, or effect pixels.',
  identity: 'Obsidian-black head and body plumage, oxblood and iron-violet mantle wings, a bone-ivory throat gorget, antique-gold gravecrown and wing clasps, ember-gold eyes, a bronze hooked beak and talons, crimson seal marks, and a connected barbed black tail distinguish the elite Gravecrown Harrower from Mournglass Scrier and Cinderquill Scavenger.',
  effectBoundary: 'Grave sigils, carrion wisps, loose feathers, dust, glow, projectiles, air blades, shock rings, and impact effects remain external.',
});

export const EN_E11_RAVEN_ELITE_CONTRACT_CARD = deepFreeze({
  family: 'raven',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingVariant: {
    id: EN_E11_RAVEN_MOURNGLASS_SCRIER_CONTRACT.variant,
    role: EN_E11_RAVEN_MOURNGLASS_SCRIER_CONTRACT.role,
    status: 'implemented-full-approved-published-reconciled',
  },
  activeVariant: {
    id: EN_E11_RAVEN_GRAVECROWN_HARROWER_CONTRACT.variant,
    role: EN_E11_RAVEN_GRAVECROWN_HARROWER_CONTRACT.role,
    status: 'implemented-full-approved',
  },
  deferredRoles: [],
});

export const EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE = deepFreeze({
  id: 'en-e11-raven-gravecrown-harrower-full-v1',
  status: 'approved',
  authorizedOn: '2026-08-14',
  authorizationEvidence: 'The exact Mournglass Scrier implementation ca79bdeced0161f720775e405416d98cd809314f, approval record 5e50ad8bf12e6782800be71a7e7613684fc7bb49, initial published handoff 930d589f4ab77598bbd11fe925a838b99e52556d, and final reconciliation d12e42ceb0375a39c60de3f4253aeaa5ac0306ae are pushed and remote verified. The prior approval reply approved did not continue. The designer then supplied a fresh continuation request: lets do next. Under the documented Raven common, specialist, elite role order and selected baked-single-actor-grounded-folded-wing-corvid topology, this fresh request authorizes exactly one private elite Raven full 80-frame candidate. Because the elite role was not pre-named, this lane names only Gravecrown Harrower. It does not approve candidate pixels or authorize a commit, push, public or outline registration, fixtures, effects, child assets, Owl, Phoenix, release, accepted drift, or a pull request.',
  baseCheckpoint: 'd12e42ceb0375a39c60de3f4253aeaa5ac0306ae',
  architectureDecision: EN_E11_RAVEN_TOPOLOGY_DECISION.id,
  approvedOn: '2026-08-14',
  approvalEvidence: 'The final approval prompt posted the exact labeled all-four-direction raw/no-outline, distinct Complete B outlined, Complete B + Form, and Raven-family comparison PNGs together with both synchronized full-suite GIFs and candidate digest 06892d2e8583a2c7ba2dc06aca12a94007230801b645db478cac187e538465d9. All four exact PNGs, all eight raw and Complete B + Form phase sheets, the transparent 20x4 inspection atlas, and both exact GIFs were inspected at original resolution and in Aseprite; regeneration reproduced every frozen hash. The designer replied: approved. Approval applies only to that exact Gravecrown Harrower digest and its six frozen review hashes. It does not open public or outline registration, fixtures, effects, child assets, Owl, Phoenix, another Bird family, release, accepted drift, or a pull request.',
  approvedImplementation: '4d05b1f4f0ff5113bb31c4ac7011a393b6d877be',
  publicationAuthorizedOn: '2026-08-14',
  publicationAuthorizationEvidence: 'The designer previously said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact frozen artifact or digest. The designer now replied approved to the exact Gravecrown Harrower review packet. This does not authorize registration, fixtures, effects, child assets, Owl, Phoenix, later families, release, accepted drift, or a pull request.',
  publishedImplementation: '',
  publishedApprovalRecord: '',
  initialPublishedHandoff: '',
  publicationState: 'approved-not-published',
  precedingApproval: {
    gateId: EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.id,
    candidateFrameDigest: EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.initialPublishedHandoff,
    currentReconciliation: 'd12e42ceb0375a39c60de3f4253aeaa5ac0306ae',
  },
  artifact: 'enemy-expansion-review/en-e11-raven-gravecrown-harrower/en-e11-raven-gravecrown-harrower-full-suite-raw.png',
  artifactSha256: 'feca6ff1f3a6fb840e76d7da463894ddd548f1560b2d15e9f7ec7749cdfb6aa3',
  outlinedArtifact: 'enemy-expansion-review/en-e11-raven-gravecrown-harrower/en-e11-raven-gravecrown-harrower-full-suite-outlined-complete-b.png',
  outlinedArtifactSha256: '94046507e0e3fa003b0681263cbecc5d099216f70497f986d48cf69ff9c9ad5e',
  assembledArtifact: 'enemy-expansion-review/en-e11-raven-gravecrown-harrower/en-e11-raven-gravecrown-harrower-full-suite-complete-b-form.png',
  assembledArtifactSha256: '8ee08b4c7f9df7f0d384aee3fd2ded305b472d3283ef61285dccf42392ff7d69',
  comparisonArtifact: 'enemy-expansion-review/en-e11-raven-gravecrown-harrower/en-e11-raven-gravecrown-harrower-family-comparison.png',
  comparisonArtifactSha256: 'd2b8593807344b48b0e4aa0ab05d9fc03aaf2aa0df378e7a4d41c53d923a696e',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e11-raven-gravecrown-harrower/en-e11-raven-gravecrown-harrower-full-suite-four-directions-labeled.gif',
      sha256: '10b714ebab2cd2b480b5012c2104f7fc7a0b07706103b5398943c600409bf73d',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e11-raven-gravecrown-harrower/en-e11-raven-gravecrown-harrower-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '3138fd5a34201b6bdaf96263f77d39d1f5264b7e3cd072cabdfe9a3aff9def6b',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
  },
  candidateFrameDigest: '06892d2e8583a2c7ba2dc06aca12a94007230801b645db478cac187e538465d9',
  mournglassComparisonDigest: EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.candidateFrameDigest,
  cinderquillComparisonDigest: EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE.candidateFrameDigest,
  harpyComparisonDigest: 'd7d83f0c209a8b4735e0a488a5df128bffa5407e38fd28e4fc38d73b633e5839',
  scope: 'One complete private 80-frame Raven Gravecrown Harrower elite enemy across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Every frame preserves the approved grounded Mournglass anatomy beneath connected elite crown, gorget, mantle, and tail geometry. Idle holds a gravecourt watch and settles the heavy bone gorget. Walk alternates two deliberate grounded crown-steps while the broad mantle and barbed wedge tail counterbalance. Attack plants both talons, raises both body-owned wings into a wide gravegate, drives a hooked-beak and plated-shoulder harrow press, and refolds. Hurt uses a complete-silhouette #f4f4f4 recoil and colored grounded recovery. Cast aliases Attack exactly and Death aliases Hurt H1,H2,H2,H2.',
  anatomyContract: EN_E11_RAVEN_GRAVECROWN_HARROWER_CONTRACT.silhouette,
  reviewPresentation: 'Show the exact labeled all-four-direction Gravecrown Harrower raw/no-outline, outlined Complete B, Complete B + Form, Mournglass/Cinderquill/Harpy comparison board, and both synchronized full-suite GIFs together.',
  exclusions: [
    'approved Mournglass Scrier source module and pixels',
    'approved Cinderquill Scavenger pixels',
    'public Harpy Screecher pixels',
    'approved backlog V3 registration changes',
    'Owl',
    'Phoenix',
    'additional Bird variants',
    'new Cast pixels',
    'new Death pixels',
    'detached feather child assets',
    'baked grave-sigil pixels',
    'baked carrion-wisp pixels',
    'baked loose-feather pixels',
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
  nextGate: 'The exact Gravecrown Harrower implementation 4d05b1f4f0ff5113bb31c4ac7011a393b6d877be is pushed and remote verified. Commit and push only this approval record, then create the initial published handoff and final reconciliation needed to complete the bounded Raven elite publication tuple. No continuation request accompanied the pixel approval, so no Owl, Phoenix, other Bird family, or other sprite lane is open. Public or outline registration, fixtures, effects, child assets, release, accepted drift, and a pull request remain closed. The distinct outlined PNG remains review evidence only and does not authorize outline registration.',
});

export const EN_E11_RAVEN_GRAVECROWN_HARROWER_DATA = deepFreeze({
  actor: {
    species: 'corvid',
    bodyBuild: 'broad-gravecourt-corvid',
    skin: 'feathered',
    hairStyle: 'three-pronged-gravecrown',
    hairColor: 'antique-gold',
    expression: 'imperious',
    faceDetail: 'hooked-bronze-beak',
    headgear: 'connected-gravecrown',
    outfit: 'connected-bone-gorget-and-mantle-plates',
    outfitColor: 'oxblood',
    outfitTier: 'tier3',
    weapon: 'none',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: ['#29242d', '#121016'],
      hair: ['#c4a45b', '#6f552e'],
      outfit: ['#5a303a', '#241a22', '#8d4d5b'],
    },
  },
  actorTopology: EN_E11_RAVEN_TOPOLOGY_DECISION.selected,
  childAssets: [],
  raven: {
    head: ['#29242d', '#121016', '#51424d'],
    body: ['#34242d', '#181219', '#603b47'],
    wing: ['#5a303a', '#2a1d26', '#8d4d5b'],
    throat: ['#c8b88f', '#77664b', '#eadbb4'],
    tail: ['#1d1820', '#0d0b10', '#49343e'],
    crown: ['#c4a45b', '#6f552e', '#f0d487'],
    seal: ['#9f3e49', '#59212a', '#e27871'],
    beak: ['#aa8d5f', '#60492f', '#ddc28f'],
    talon: ['#99764a', '#513a28'],
    eye: '#ffd36a',
    feature: '#110d12',
  },
  effectBoundary: 'external-grave-sigils-carrion-wisps-loose-feathers-dust-glow-projectiles-air-blades-shock-rings-and-impacts',
  bakedEffects: [],
});

const GRAVECROWN_HARROWER_VARIANT = deepFreeze({
  id: 'gravecrown-harrower',
  name: 'Gravecrown Harrower',
  role: EN_E11_RAVEN_GRAVECROWN_HARROWER_CONTRACT.role,
  status: EN_E11_RAVEN_GRAVECROWN_HARROWER_CONTRACT.state,
  brief: 'Elite grounded Raven gravecourt enforcer preserving the approved corvid beneath obsidian plumage, an attached antique-gold gravecrown, bone gorget, oxblood plated mantle wings, ember eyes, two planted bronze talons, and one connected barbed wedge tail.',
  rendererData: EN_E11_RAVEN_GRAVECROWN_HARROWER_DATA,
});

const SOURCE_VARIANT = deepFreeze({ id: 'mournglass-scrier' });
export const EN_E11_RAVEN_GRAVECROWN_HARROWER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const MOTION_PHASES = deepFreeze({
  idle: [
    { name: 'gravecourt-watch', upperBob: 0, wingPhase: 0, tailMode: 'closed', tailSway: 0, flash: false },
    { name: 'bone-gorget-settle', upperBob: 1, wingPhase: 1, tailMode: 'closed', tailSway: 0, flash: false },
  ],
  walk: [
    { name: 'left-crown-step', upperBob: 0, wingPhase: 1, tailMode: 'closed', tailSway: -1, flash: false },
    { name: 'mantle-weight-shift', upperBob: 1, wingPhase: 0, tailMode: 'closed', tailSway: 0, flash: false },
    { name: 'right-crown-step', upperBob: 0, wingPhase: 1, tailMode: 'closed', tailSway: 1, flash: false },
    { name: 'barbed-tail-recover', upperBob: 0, wingPhase: 2, tailMode: 'closed', tailSway: 0, flash: false },
  ],
  attack: [
    { name: 'two-talon-grave-brace', upperBob: 1, wingPhase: 2, tailMode: 'braced', tailSway: -1, flash: false },
    { name: 'full-gravegate-rise', upperBob: 0, wingPhase: 3, tailMode: 'spread', tailSway: 0, flash: false },
    { name: 'crowned-mantle-harrow', upperBob: 0, wingPhase: 4, tailMode: 'spread', tailSway: 0, flash: false },
    { name: 'sovereign-fold-recover', upperBob: 1, wingPhase: 1, tailMode: 'braced', tailSway: 1, flash: false },
  ],
  hurt: [
    { name: 'white-gravecrown-recoil', upperBob: 0, wingPhase: 2, tailMode: 'braced', tailSway: -1, flash: true },
    { name: 'planted-gravecourt-recovery', upperBob: 1, wingPhase: 1, tailMode: 'closed', tailSway: 0, flash: false },
  ],
});

function buildPaletteMap() {
  const source = EN_E11_RAVEN_MOURNGLASS_SCRIER_DATA.raven;
  const target = EN_E11_RAVEN_GRAVECROWN_HARROWER_DATA.raven;
  const pairs = [
    [source.head, target.head],
    [source.body, target.body],
    [source.wing, target.wing],
    [source.throat, target.throat],
    [source.tail, target.tail],
    [source.glass, target.crown],
    [source.omen, target.seal],
    [source.beak, target.beak],
    [source.talon, target.talon],
    [[source.eye], [target.eye]],
    [[source.feature], [target.feature]],
  ];
  const entries = [];
  for (const [from, to] of pairs) {
    assert(from.length === to.length, 'Gravecrown Harrower palette maps must preserve source ramp lengths.');
    for (let index = 0; index < from.length; index++) entries.push([from[index].toLowerCase(), to[index]]);
  }
  return new Map(entries);
}

const PALETTE_MAP = buildPaletteMap();

function createPaletteMappedContext(context) {
  let fillStyle = context.fillStyle;
  const map = (value) => typeof value === 'string' ? (PALETTE_MAP.get(value.toLowerCase()) || value) : value;
  return {
    get fillStyle() {
      return fillStyle;
    },
    set fillStyle(value) {
      fillStyle = map(value);
      context.fillStyle = fillStyle;
    },
    onOutOfBounds(write) {
      if (typeof context.onOutOfBounds === 'function') context.onOutOfBounds(write);
    },
    clearRect(x, y, width, height) {
      context.clearRect(x, y, width, height);
    },
    fillRect(x, y, width, height) {
      context.fillStyle = fillStyle;
      context.fillRect(x, y, width, height);
    },
  };
}

function createOverlayPainter(context, direction, flash) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Gravecrown Harrower regalia must use positive integer geometry.',
    );
    context.fillStyle = flash ? '#f4f4f4' : fill;
    context.fillRect(mirrored ? SIZE - x - width : x, y, width, height);
  };
  return { view, rect, dot: (x, y, fill) => rect(x, y, 1, 1, fill) };
}

function drawCrownAndGorget(paint, phase) {
  const { crown, seal, throat } = EN_E11_RAVEN_GRAVECROWN_HARROWER_DATA.raven;
  const bob = phase.upperBob;
  if (paint.view === 'right') {
    paint.rect(11, 4 + bob, 6, 2, crown[1]);
    paint.rect(10, 2 + bob, 2, 3, crown[0]);
    paint.dot(10, 1 + bob, crown[2]);
    paint.rect(12, 1 + bob, 2, 4, crown[0]);
    paint.dot(13, 1 + bob, crown[2]);
    paint.rect(15, 2 + bob, 2, 3, crown[0]);
    paint.dot(16, 1 + bob, crown[2]);
    paint.rect(15, 5 + bob, 4, 1, crown[0]);
    paint.rect(11, 10 + bob, 6, 2, throat[1]);
    paint.rect(12, 12 + bob, 5, 2, throat[0]);
    paint.dot(15, 13 + bob, seal[2]);
    return;
  }
  paint.rect(8, 4 + bob, 8, 2, crown[1]);
  paint.rect(8, 2 + bob, 2, 3, crown[0]);
  paint.dot(8, 1 + bob, crown[2]);
  paint.rect(11, 1 + bob, 2, 4, crown[0]);
  paint.dot(12, 1 + bob, crown[2]);
  paint.rect(14, 2 + bob, 2, 3, crown[0]);
  paint.dot(15, 1 + bob, crown[2]);
  paint.rect(9, 5 + bob, 6, 1, crown[0]);
  paint.rect(8, 10 + bob, 8, 2, throat[1]);
  paint.rect(9, 12 + bob, 6, 2, throat[0]);
  paint.dot(12, 13 + bob, paint.view === 'up' ? crown[2] : seal[2]);
}

function drawMantle(paint, phase) {
  const { crown, seal, wing } = EN_E11_RAVEN_GRAVECROWN_HARROWER_DATA.raven;
  const bob = phase.upperBob;
  if (paint.view === 'right') {
    if (phase.wingPhase === 3) {
      paint.rect(6, 4 + bob, 4, 9, wing[1]);
      paint.rect(7, 3 + bob, 3, 8, wing[0]);
      paint.rect(7, 5 + bob, 2, 1, crown[2]);
      paint.rect(7, 9 + bob, 3, 1, crown[0]);
      paint.dot(9, 11 + bob, seal[2]);
      return;
    }
    if (phase.wingPhase === 4) {
      paint.rect(12, 9 + bob, 9, 5, wing[0]);
      paint.rect(14, 10 + bob, 7, 2, wing[2]);
      paint.rect(15, 12 + bob, 6, 1, crown[0]);
      paint.dot(19, 13 + bob, seal[2]);
      return;
    }
    if (phase.wingPhase === 2) {
      paint.rect(7, 10 + bob, 7, 6, wing[0]);
      paint.rect(9, 12 + bob, 5, 3, wing[2]);
      paint.rect(10, 14 + bob, 4, 1, crown[0]);
      paint.dot(12, 15 + bob, seal[2]);
      return;
    }
    const lower = phase.wingPhase === 1 ? 1 : 0;
    paint.rect(8, 11 + bob + lower, 7, 6, wing[0]);
    paint.rect(10, 13 + bob + lower, 5, 3, wing[2]);
    paint.rect(11, 15 + bob + lower, 4, 1, crown[0]);
    paint.dot(13, 14 + bob + lower, seal[2]);
    return;
  }
  if (phase.wingPhase === 3) {
    paint.rect(2, 4 + bob, 5, 9, wing[1]);
    paint.rect(17, 4 + bob, 5, 9, wing[1]);
    paint.rect(3, 5 + bob, 4, 7, wing[0]);
    paint.rect(17, 5 + bob, 4, 7, wing[0]);
    paint.rect(3, 6 + bob, 3, 1, crown[2]);
    paint.rect(18, 6 + bob, 3, 1, crown[2]);
    paint.rect(4, 10 + bob, 3, 1, crown[0]);
    paint.rect(17, 10 + bob, 3, 1, crown[0]);
    paint.dot(6, 12 + bob, seal[2]);
    paint.dot(17, 12 + bob, seal[2]);
    return;
  }
  if (phase.wingPhase === 4) {
    paint.rect(2, 9 + bob, 8, 5, wing[0]);
    paint.rect(14, 9 + bob, 8, 5, wing[0]);
    paint.rect(3, 10 + bob, 7, 2, wing[2]);
    paint.rect(14, 10 + bob, 7, 2, wing[2]);
    paint.rect(5, 12 + bob, 5, 1, crown[0]);
    paint.rect(14, 12 + bob, 5, 1, crown[0]);
    paint.dot(8, 13 + bob, seal[2]);
    paint.dot(15, 13 + bob, seal[2]);
    return;
  }
  if (phase.wingPhase === 2) {
    paint.rect(4, 10 + bob, 7, 6, wing[0]);
    paint.rect(13, 10 + bob, 7, 6, wing[0]);
    paint.rect(6, 12 + bob, 5, 3, wing[2]);
    paint.rect(13, 12 + bob, 5, 3, wing[2]);
    paint.rect(7, 14 + bob, 4, 1, crown[0]);
    paint.rect(13, 14 + bob, 4, 1, crown[0]);
    paint.dot(9, 15 + bob, seal[2]);
    paint.dot(14, 15 + bob, seal[2]);
    return;
  }
  const lower = phase.wingPhase === 1 ? 1 : 0;
  paint.rect(4, 11 + bob + lower, 7, 6, wing[0]);
  paint.rect(13, 11 + bob + lower, 7, 6, wing[0]);
  paint.rect(6, 13 + bob + lower, 5, 3, wing[2]);
  paint.rect(13, 13 + bob + lower, 5, 3, wing[2]);
  paint.rect(8, 15 + bob + lower, 3, 1, crown[0]);
  paint.rect(13, 15 + bob + lower, 3, 1, crown[0]);
  paint.dot(9, 14 + bob + lower, seal[2]);
  paint.dot(14, 14 + bob + lower, seal[2]);
}

function drawBarbedTail(paint, phase) {
  const { crown, seal, tail } = EN_E11_RAVEN_GRAVECROWN_HARROWER_DATA.raven;
  const sway = phase.tailSway;
  if (paint.view === 'right') {
    if (phase.tailMode === 'spread') {
      paint.rect(3, 17, 6, 3, tail[0]);
      paint.rect(4, 19, 5, 2, tail[2]);
      paint.rect(6, 18, 3, 1, crown[1]);
      paint.dot(8, 20, seal[2]);
    } else if (phase.tailMode === 'braced') {
      paint.rect(4 + sway, 17, 6, 3, tail[0]);
      paint.rect(5 + sway, 19, 5, 2, tail[2]);
      paint.rect(7 + sway, 18, 3, 1, crown[1]);
    } else {
      paint.rect(5 + sway, 17, 5, 3, tail[0]);
      paint.rect(6 + sway, 19, 4, 2, tail[2]);
      paint.rect(8 + sway, 18, 2, 1, crown[1]);
    }
    return;
  }
  if (phase.tailMode === 'spread') {
    paint.rect(6, 17, 12, 3, tail[0]);
    paint.rect(7, 19, 4, 2, tail[2]);
    paint.rect(13, 19, 4, 2, tail[2]);
    paint.rect(9, 18, 6, 1, crown[1]);
    paint.dot(10, 20, seal[2]);
    paint.dot(13, 20, seal[2]);
  } else if (phase.tailMode === 'braced') {
    paint.rect(8 + sway, 17, 8, 3, tail[0]);
    paint.rect(9 + sway, 19, 3, 2, tail[2]);
    paint.rect(13 + sway, 19, 3, 2, tail[2]);
    paint.rect(10 + sway, 18, 5, 1, crown[1]);
  } else {
    paint.rect(9 + sway, 17, 6, 3, tail[0]);
    paint.rect(10 + sway, 19, 2, 2, tail[2]);
    paint.rect(13 + sway, 19, 2, 2, tail[2]);
    paint.rect(11 + sway, 18, 3, 1, crown[1]);
  }
}

function drawGravecrownRegalia(context, direction, phase) {
  const paint = createOverlayPainter(context, direction, phase.flash);
  drawCrownAndGorget(paint, phase);
  drawMantle(paint, phase);
  drawBarbedTail(paint, phase);
}

function resolveSource(animation, frame) {
  if (animation === 'cast') return { animation: 'attack', frame };
  if (animation === 'death') return { animation: 'hurt', frame: EN_E11_RAVEN_GRAVECROWN_HARROWER_DEATH_SOURCE_FRAMES[frame] };
  return { animation, frame };
}

function renderGravecrownHarrower(args) {
  assert(args.family.id === 'raven', 'The EN-E11 Gravecrown Harrower renderer is restricted to Raven.');
  assert(args.variant.id === 'gravecrown-harrower', 'The EN-E11 Raven elite renderer is restricted to Gravecrown Harrower.');
  const frameCounts = { idle: 2, walk: 4, attack: 4, cast: 4, hurt: 2, death: 4 };
  const frameCount = frameCounts[args.animation.id];
  assert(frameCount !== undefined, 'The Gravecrown Harrower gate authorizes only Idle, Walk, Attack, Cast, Hurt, and Death.');
  assert(
    Number.isInteger(args.frame) && args.frame >= 0 && args.frame < frameCount,
    'The Gravecrown Harrower frame is outside the authorized animation contract.',
  );

  const source = resolveSource(args.animation.id, args.frame);
  const phase = MOTION_PHASES[source.animation][source.frame];
  const sourceResult = EN_E11_RAVEN_MOURNGLASS_SCRIER_RENDERER.render({
    ...args,
    variant: SOURCE_VARIANT,
    animation: { ...args.animation, id: source.animation },
    frame: source.frame,
    context: createPaletteMappedContext(args.context),
  });
  drawGravecrownRegalia(args.context, args.direction, phase);

  return Object.freeze({
    family: args.family.id,
    variant: args.variant.id,
    direction: args.direction,
    animation: args.animation.id,
    frame: args.frame,
    renderedAnimation: source.animation,
    renderedFrame: source.frame,
    ravenGravecrownHarrowerGate: EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.id,
    architectureDecision: EN_E11_RAVEN_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.id,
    approvedSourceMotion: sourceResult.motion,
    role: EN_E11_RAVEN_GRAVECROWN_HARROWER_CONTRACT.role,
    anatomy: EN_E11_RAVEN_GRAVECROWN_HARROWER_CONTRACT.chassis,
    upperBody: 'approved-rounded-corvid-head-hooked-beak-and-body-owned-wings-with-connected-three-pronged-gravecrown-bone-gorget-and-layered-mantle-plates',
    lowerBody: 'approved-two-grounded-three-toed-talons-and-connected-barbed-wedge-tail',
    motion: args.animation.id === 'cast'
      ? 'exact-cast-alias-of-gravecrown-harrower-gravegate-and-mantle-harrow'
      : args.animation.id === 'death'
        ? 'exact-death-alias-of-gravecrown-harrower-recoil'
        : phase.name,
    childAssetCount: EN_E11_RAVEN_GRAVECROWN_HARROWER_DATA.childAssets.length,
    effectBoundary: EN_E11_RAVEN_GRAVECROWN_HARROWER_DATA.effectBoundary,
  });
}

export const EN_E11_RAVEN_GRAVECROWN_HARROWER_RENDERER = Object.freeze({
  key: 'en-e11-raven-gravecrown-harrower-full-v1',
  chassis: EN_E11_RAVEN_GRAVECROWN_HARROWER_CONTRACT.chassis,
  render: renderGravecrownHarrower,
});

export const EN_E11_RAVEN_GRAVECROWN_HARROWER_FAMILY = deepFreeze({
  id: 'raven',
  name: 'Raven',
  sliceId: 'EN-E11',
  rendererKey: EN_E11_RAVEN_GRAVECROWN_HARROWER_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [GRAVECROWN_HARROWER_VARIANT],
  rendererData: {
    approvedPrecedingGate: EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.id,
    activeGate: EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE.id,
    topologyDecision: EN_E11_RAVEN_TOPOLOGY_DECISION.id,
  },
  review: {
    baselineVariant: 'gravecrown-harrower',
    scale: 6,
    notes: 'Approved private Gravecrown Harrower elite Raven only, bound to exact implementation 4d05b1f4f0ff5113bb31c4ac7011a393b6d877be, candidate digest 06892d2e8583a2c7ba2dc06aca12a94007230801b645db478cac187e538465d9, and its six frozen review hashes. The designer replied approved to the posted exact packet; no continuation request was supplied. Keep public or outline registration, fixtures, effects, child assets, Owl, Phoenix, release, accepted drift, and a pull request separate.',
  },
});

export const EN_E11_RAVEN_GRAVECROWN_HARROWER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E11_RAVEN_GRAVECROWN_HARROWER_RENDERER],
  families: [EN_E11_RAVEN_GRAVECROWN_HARROWER_FAMILY],
});
