import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E11_OWL_HUSHMASK_PROWLER_GATE,
  EN_E11_OWL_TOPOLOGY_DECISION,
} from './enemy-expansion-en-e11-owl-hushmask-prowler.js';
import {
  EN_E11_OWL_MOONVEIL_AUGUR_CONTRACT,
  EN_E11_OWL_MOONVEIL_AUGUR_DATA,
  EN_E11_OWL_MOONVEIL_AUGUR_GATE,
  EN_E11_OWL_MOONVEIL_AUGUR_RENDERER,
} from './enemy-expansion-en-e11-owl-moonveil-augur.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E11_OWL_ECLIPSECROWN_NOCTARCH_CONTRACT = deepFreeze({
  family: 'owl',
  variant: 'eclipsecrown-noctarch',
  role: 'elite',
  state: 'implemented-complete-motion-approved',
  chassis: EN_E11_OWL_TOPOLOGY_DECISION.selected,
  silhouette: 'The complete approved Moonveil Augur Owl remains readable beneath a connected three-pronged eclipse crown, broad ivory facial disk and throat gorget, layered plated mantle wings, and a short connected notched fan tail. The round Owl head, small hooked beak, compact feathered barrel, two body-owned wings, two separated three-toed taloned feet, and short fan tail remain one grounded actor in every direction. Attack expands both body-owned mantle wings into a wide eclipse gate without floating pieces, exposed human anatomy, or effect pixels.',
  identity: 'Obsidian-black and eclipse-violet plumage, a broad ivory-and-gold facial disk, connected antique-gold three-pronged crown, royal-violet plated mantle wings, ember-gold eyes, a bronze hooked beak and talons, crimson corona bars, and a short connected notched fan tail distinguish the elite Eclipsecrown Noctarch from Moonveil Augur and Hushmask Prowler.',
  effectBoundary: 'Eclipse halos, corona rings, sun seals, shadow wisps, loose feathers, dust, glow, projectiles, air blades, shock rings, and impact effects remain external.',
});

export const EN_E11_OWL_ELITE_CONTRACT_CARD = deepFreeze({
  family: 'owl',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingVariant: {
    id: EN_E11_OWL_MOONVEIL_AUGUR_CONTRACT.variant,
    role: EN_E11_OWL_MOONVEIL_AUGUR_CONTRACT.role,
    status: 'implemented-full-approved-published-reconciled',
  },
  activeVariant: {
    id: EN_E11_OWL_ECLIPSECROWN_NOCTARCH_CONTRACT.variant,
    role: EN_E11_OWL_ECLIPSECROWN_NOCTARCH_CONTRACT.role,
    status: 'implemented-full-approved',
  },
  deferredRoles: [],
});

export const EN_E11_OWL_ECLIPSECROWN_NOCTARCH_GATE = deepFreeze({
  id: 'en-e11-owl-eclipsecrown-noctarch-full-v1',
  status: 'approved',
  authorizedOn: '2026-08-14',
  authorizationEvidence: 'The exact Moonveil Augur implementation e3544a7c08195d67d7bfac4a4f531bc53c0a1981, approval record c384f07ace77822b12b1daa54b3fc6ca8ef11209, initial published handoff 5dd51c5bdd386ecf4648cae3cc722fcd3ea8cc90, and final reconciliation 20311d040ac086ecff950c3da2a57e330c13b875 are pushed and remote verified. The prior approval reply Approved did not continue. The designer then supplied a fresh continuation request: Let\'s do next. Under the documented Owl common, specialist, elite role order and selected baked-single-actor-grounded-facial-disk-owl topology, this fresh request authorizes exactly one private elite Owl full 80-frame candidate. Because the elite role was not pre-named, this lane names only Eclipsecrown Noctarch. It does not approve candidate pixels or authorize a commit, push, public or outline registration, fixtures, effects, child assets, Phoenix, another Bird family, release, accepted drift, or a pull request.',
  baseCheckpoint: '20311d040ac086ecff950c3da2a57e330c13b875',
  architectureDecision: EN_E11_OWL_TOPOLOGY_DECISION.id,
  approvedOn: '2026-08-14',
  approvalEvidence: 'The final approval prompt posted the exact labeled all-four-direction raw/no-outline, distinct Complete B outlined, Complete B + Form, and Hushmask-Moonveil-Harpy comparison PNGs together with both synchronized full-suite GIFs and candidate digest c2e1e1108ba71d118a1bd169fe81a4745f37c3f96cb89eed1d18033356dc8b6d. All four exact PNGs, all eight raw and Complete B + Form phase sheets, the transparent 20x4 inspection atlas, and both exact GIFs were inspected at original resolution; Aseprite parsed all six principal files and regeneration reproduced every frozen hash. The designer replied: Approved. Approval applies only to that exact Eclipsecrown Noctarch digest and its six frozen review hashes. It does not open public or outline registration, fixtures, effects, child assets, Phoenix, another Bird family, release, accepted drift, or a pull request.',
  approvedImplementation: 'c7c95df2bfd3fb2d4cf421ddc413965b9b0c51f2',
  publicationAuthorizedOn: '2026-08-14',
  publicationAuthorizationEvidence: 'The designer previously said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact frozen artifact or digest. The designer now replied Approved to the exact Eclipsecrown Noctarch review packet. This does not authorize public or outline registration, fixtures, effects, child assets, Phoenix, later families, release, accepted drift, or a pull request.',
  publishedImplementation: 'c7c95df2bfd3fb2d4cf421ddc413965b9b0c51f2',
  publishedApprovalRecord: '402d94575701ecffd16a23a156bf39eae44298f0',
  initialPublishedHandoff: '',
  publicationState: 'published-awaiting-handoff-reconciliation',
  precedingApproval: {
    gateId: EN_E11_OWL_MOONVEIL_AUGUR_GATE.id,
    candidateFrameDigest: EN_E11_OWL_MOONVEIL_AUGUR_GATE.candidateFrameDigest,
    publishedImplementation: EN_E11_OWL_MOONVEIL_AUGUR_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E11_OWL_MOONVEIL_AUGUR_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E11_OWL_MOONVEIL_AUGUR_GATE.initialPublishedHandoff,
    currentReconciliation: '20311d040ac086ecff950c3da2a57e330c13b875',
  },
  artifact: 'enemy-expansion-review/en-e11-owl-eclipsecrown-noctarch/en-e11-owl-eclipsecrown-noctarch-full-suite-raw.png',
  artifactSha256: '271cccaf5495c25672e3d211af5f78ce76f80b201ed868b7aef8eb33b4ed81c5',
  outlinedArtifact: 'enemy-expansion-review/en-e11-owl-eclipsecrown-noctarch/en-e11-owl-eclipsecrown-noctarch-full-suite-outlined-complete-b.png',
  outlinedArtifactSha256: '1b4f86abf30f23d25df51c5286703a0666abc2f9a795a7d4f3e042ce1da4cda2',
  assembledArtifact: 'enemy-expansion-review/en-e11-owl-eclipsecrown-noctarch/en-e11-owl-eclipsecrown-noctarch-full-suite-complete-b-form.png',
  assembledArtifactSha256: '13602279254adb1dd367baff784fcf53dba10c5eefa9186ef90d961a2cf0b954',
  comparisonArtifact: 'enemy-expansion-review/en-e11-owl-eclipsecrown-noctarch/en-e11-owl-eclipsecrown-noctarch-family-comparison.png',
  comparisonArtifactSha256: 'fc5ec424acd79bb9af187ae66bbc6ca479784f46dfa7d78a3ffc3e8c534d3450',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e11-owl-eclipsecrown-noctarch/en-e11-owl-eclipsecrown-noctarch-full-suite-four-directions-labeled.gif',
      sha256: 'ad500e727a8ee6c19376dcb39e76a01cf3de37bb736daaf9002c3dc65b903a90',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e11-owl-eclipsecrown-noctarch/en-e11-owl-eclipsecrown-noctarch-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '02d6b55b78672fbe693bad315c1f14761761c06e664124fd92dbe74ef6df270a',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
  },
  candidateFrameDigest: 'c2e1e1108ba71d118a1bd169fe81a4745f37c3f96cb89eed1d18033356dc8b6d',
  moonveilComparisonDigest: EN_E11_OWL_MOONVEIL_AUGUR_GATE.candidateFrameDigest,
  hushmaskComparisonDigest: EN_E11_OWL_HUSHMASK_PROWLER_GATE.candidateFrameDigest,
  harpyComparisonDigest: 'd7d83f0c209a8b4735e0a488a5df128bffa5407e38fd28e4fc38d73b633e5839',
  scope: 'One complete private 80-frame Owl Eclipsecrown Noctarch elite enemy across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Every frame preserves the approved grounded Moonveil Owl anatomy beneath connected elite crown, facial disk, mantle, and short fan-tail geometry. Idle holds an eclipse-court watch and settles the heavy ivory throat gorget. Walk alternates two deliberate grounded crown-steps while the broad plated mantle and short notched fan tail counterbalance. Attack plants both talons, raises both body-owned wings into a wide eclipse gate, drives a hooked-beak and plated-shoulder crown press, and refolds. Hurt uses a complete-silhouette #f4f4f4 recoil and colored grounded recovery. Cast aliases Attack exactly and Death aliases Hurt H1,H2,H2,H2.',
  anatomyContract: EN_E11_OWL_ECLIPSECROWN_NOCTARCH_CONTRACT.silhouette,
  reviewPresentation: 'Show the exact labeled all-four-direction Eclipsecrown Noctarch raw/no-outline, outlined Complete B, Complete B + Form, Moonveil/Hushmask/Harpy comparison board, and both synchronized full-suite GIFs together.',
  exclusions: [
    'approved Moonveil Augur source module and pixels',
    'approved Hushmask Prowler pixels',
    'public Harpy Screecher pixels',
    'approved backlog V3 registration changes',
    'Phoenix',
    'additional Bird variants',
    'new Cast pixels',
    'new Death pixels',
    'detached feather child assets',
    'baked eclipse-halo pixels',
    'baked corona-ring pixels',
    'baked sun-seal pixels',
    'baked shadow-wisp pixels',
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
  nextGate: 'The exact Eclipsecrown Noctarch implementation c7c95df2bfd3fb2d4cf421ddc413965b9b0c51f2 and approval record 402d94575701ecffd16a23a156bf39eae44298f0 are pushed and remote verified. Only the initial published handoff and final reconciliation remain open to complete the bounded Owl elite publication tuple. No continuation request accompanied the pixel approval, so no Phoenix, other Bird family, or other sprite lane is open. Public or outline registration, fixtures, effects, child assets, release, accepted drift, and a pull request remain closed. The distinct outlined PNG remains review evidence only and does not authorize outline registration.',
});

export const EN_E11_OWL_ECLIPSECROWN_NOCTARCH_DATA = deepFreeze({
  actor: {
    species: 'owl',
    bodyBuild: 'broad-eclipse-mantled-facial-disk-owl',
    skin: 'feathered',
    hairStyle: 'three-pronged-eclipsecrown',
    hairColor: 'antique-gold',
    expression: 'imperious',
    faceDetail: 'ember-gold-eyes-and-hooked-bronze-beak',
    headgear: 'connected-eclipsecrown',
    outfit: 'connected-ivory-gorget-and-royal-violet-mantle-plates',
    outfitColor: 'royal-violet',
    outfitTier: 'tier3',
    weapon: 'none',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: ['#242431', '#0d0e16'],
      hair: ['#d0aa52', '#755129'],
      outfit: ['#54345f', '#271a30', '#8d5a93'],
    },
  },
  actorTopology: EN_E11_OWL_TOPOLOGY_DECISION.selected,
  childAssets: [],
  owl: {
    head: ['#242431', '#0d0e16', '#49435c'],
    body: ['#30253a', '#15121c', '#5a3a62'],
    wing: ['#54345f', '#271a30', '#8d5a93'],
    disk: ['#d2c39c', '#79694a', '#f3e5b7'],
    tail: ['#1b1822', '#0b0a10', '#49344e'],
    crown: ['#d0aa52', '#755129', '#f5d878'],
    seal: ['#9e445b', '#542333', '#e57b88'],
    beak: ['#b58e4f', '#67451f', '#e6c27a'],
    talon: ['#a37a3f', '#56381e'],
    eye: '#ffd56a',
    feature: '#0d0b12',
  },
  effectBoundary: 'external-eclipse-halos-corona-rings-sun-seals-shadow-wisps-loose-feathers-dust-glow-projectiles-air-blades-shock-rings-and-impacts',
  bakedEffects: [],
});

const ECLIPSECROWN_NOCTARCH_VARIANT = deepFreeze({
  id: 'eclipsecrown-noctarch',
  name: 'Eclipsecrown Noctarch',
  role: EN_E11_OWL_ECLIPSECROWN_NOCTARCH_CONTRACT.role,
  status: EN_E11_OWL_ECLIPSECROWN_NOCTARCH_CONTRACT.state,
  brief: 'Elite grounded Owl noctarch preserving the approved facial-disk anatomy beneath obsidian-violet plumage, an attached antique-gold three-pronged eclipse crown, ivory facial disk and gorget, royal-violet plated mantle wings, ember eyes, two planted bronze talons, and one connected short notched fan tail.',
  rendererData: EN_E11_OWL_ECLIPSECROWN_NOCTARCH_DATA,
});

const SOURCE_VARIANT = deepFreeze({ id: 'moonveil-augur' });
export const EN_E11_OWL_ECLIPSECROWN_NOCTARCH_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const MOTION_PHASES = deepFreeze({
  idle: [
    { name: 'eclipse-court-watch', upperBob: 0, wingPhase: 0, tailMode: 'closed', tailSway: 0, flash: false },
    { name: 'ivory-gorget-settle', upperBob: 1, wingPhase: 1, tailMode: 'closed', tailSway: 0, flash: false },
  ],
  walk: [
    { name: 'left-crown-step', upperBob: 0, wingPhase: 1, tailMode: 'closed', tailSway: -1, flash: false },
    { name: 'mantle-weight-shift', upperBob: 1, wingPhase: 0, tailMode: 'closed', tailSway: 0, flash: false },
    { name: 'right-crown-step', upperBob: 0, wingPhase: 1, tailMode: 'closed', tailSway: 1, flash: false },
    { name: 'notched-fan-recover', upperBob: 0, wingPhase: 2, tailMode: 'closed', tailSway: 0, flash: false },
  ],
  attack: [
    { name: 'two-talon-eclipse-brace', upperBob: 1, wingPhase: 2, tailMode: 'braced', tailSway: -1, flash: false },
    { name: 'full-eclipse-gate-rise', upperBob: 0, wingPhase: 3, tailMode: 'spread', tailSway: 0, flash: false },
    { name: 'crowned-mantle-press', upperBob: 0, wingPhase: 4, tailMode: 'spread', tailSway: 0, flash: false },
    { name: 'noctarch-fold-recover', upperBob: 1, wingPhase: 1, tailMode: 'braced', tailSway: 1, flash: false },
  ],
  hurt: [
    { name: 'white-eclipsecrown-recoil', upperBob: 0, wingPhase: 2, tailMode: 'braced', tailSway: -1, flash: true },
    { name: 'planted-eclipse-court-recovery', upperBob: 1, wingPhase: 1, tailMode: 'closed', tailSway: 0, flash: false },
  ],
});

function buildPaletteMap() {
  const source = EN_E11_OWL_MOONVEIL_AUGUR_DATA.owl;
  const target = EN_E11_OWL_ECLIPSECROWN_NOCTARCH_DATA.owl;
  const pairs = [
    [source.head, target.head],
    [source.body, target.body],
    [source.wing, target.wing],
    [source.disk, target.disk],
    [source.tail, target.tail],
    [source.moon, target.crown],
    [source.sigil, target.seal],
    [source.beak, target.beak],
    [source.talon, target.talon],
    [[source.eye], [target.eye]],
    [[source.feature], [target.feature]],
  ];
  const entries = [];
  for (const [from, to] of pairs) {
    assert(from.length === to.length, 'Eclipsecrown Noctarch palette maps must preserve source ramp lengths.');
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
      'Eclipsecrown Noctarch regalia must use positive integer geometry.',
    );
    context.fillStyle = flash ? '#f4f4f4' : fill;
    context.fillRect(mirrored ? SIZE - x - width : x, y, width, height);
  };
  return { view, rect, dot: (x, y, fill) => rect(x, y, 1, 1, fill) };
}

function drawCrownAndGorget(paint, phase) {
  const { crown, disk, seal } = EN_E11_OWL_ECLIPSECROWN_NOCTARCH_DATA.owl;
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
    paint.rect(11, 10 + bob, 6, 2, disk[1]);
    paint.rect(12, 12 + bob, 5, 2, disk[0]);
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
  paint.rect(8, 10 + bob, 8, 2, disk[1]);
  paint.rect(9, 12 + bob, 6, 2, disk[0]);
  paint.dot(12, 13 + bob, paint.view === 'up' ? crown[2] : seal[2]);
}

function drawMantle(paint, phase) {
  const { crown, seal, wing } = EN_E11_OWL_ECLIPSECROWN_NOCTARCH_DATA.owl;
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

function drawNotchedFanTail(paint, phase) {
  const { crown, seal, tail } = EN_E11_OWL_ECLIPSECROWN_NOCTARCH_DATA.owl;
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

function drawEclipsecrownRegalia(context, direction, phase) {
  const paint = createOverlayPainter(context, direction, phase.flash);
  drawCrownAndGorget(paint, phase);
  drawMantle(paint, phase);
  drawNotchedFanTail(paint, phase);
}

function resolveSource(animation, frame) {
  if (animation === 'cast') return { animation: 'attack', frame };
  if (animation === 'death') return { animation: 'hurt', frame: EN_E11_OWL_ECLIPSECROWN_NOCTARCH_DEATH_SOURCE_FRAMES[frame] };
  return { animation, frame };
}

function renderEclipsecrownNoctarch(args) {
  assert(args.family.id === 'owl', 'The EN-E11 Eclipsecrown Noctarch renderer is restricted to Owl.');
  assert(args.variant.id === 'eclipsecrown-noctarch', 'The EN-E11 Owl elite renderer is restricted to Eclipsecrown Noctarch.');
  const frameCounts = { idle: 2, walk: 4, attack: 4, cast: 4, hurt: 2, death: 4 };
  const frameCount = frameCounts[args.animation.id];
  assert(frameCount !== undefined, 'The Eclipsecrown Noctarch gate authorizes only Idle, Walk, Attack, Cast, Hurt, and Death.');
  assert(
    Number.isInteger(args.frame) && args.frame >= 0 && args.frame < frameCount,
    'The Eclipsecrown Noctarch frame is outside the authorized animation contract.',
  );

  const source = resolveSource(args.animation.id, args.frame);
  const phase = MOTION_PHASES[source.animation][source.frame];
  const sourceResult = EN_E11_OWL_MOONVEIL_AUGUR_RENDERER.render({
    ...args,
    variant: SOURCE_VARIANT,
    animation: { ...args.animation, id: source.animation },
    frame: source.frame,
    context: createPaletteMappedContext(args.context),
  });
  drawEclipsecrownRegalia(args.context, args.direction, phase);

  return Object.freeze({
    family: args.family.id,
    variant: args.variant.id,
    direction: args.direction,
    animation: args.animation.id,
    frame: args.frame,
    renderedAnimation: source.animation,
    renderedFrame: source.frame,
    owlEclipsecrownNoctarchGate: EN_E11_OWL_ECLIPSECROWN_NOCTARCH_GATE.id,
    architectureDecision: EN_E11_OWL_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E11_OWL_MOONVEIL_AUGUR_GATE.id,
    approvedSourceMotion: sourceResult.motion,
    role: EN_E11_OWL_ECLIPSECROWN_NOCTARCH_CONTRACT.role,
    anatomy: EN_E11_OWL_ECLIPSECROWN_NOCTARCH_CONTRACT.chassis,
    upperBody: 'approved-round-owl-head-broad-facial-disk-hooked-beak-and-body-owned-wings-with-connected-three-pronged-eclipse-crown-ivory-gorget-and-layered-mantle-plates',
    lowerBody: 'approved-two-grounded-three-toed-talons-and-connected-short-notched-fan-tail',
    motion: args.animation.id === 'cast'
      ? 'exact-cast-alias-of-eclipsecrown-noctarch-eclipse-gate-and-mantle-press'
      : args.animation.id === 'death'
        ? 'exact-death-alias-of-eclipsecrown-noctarch-recoil'
        : phase.name,
    childAssetCount: EN_E11_OWL_ECLIPSECROWN_NOCTARCH_DATA.childAssets.length,
    effectBoundary: EN_E11_OWL_ECLIPSECROWN_NOCTARCH_DATA.effectBoundary,
  });
}

export const EN_E11_OWL_ECLIPSECROWN_NOCTARCH_RENDERER = Object.freeze({
  key: 'en-e11-owl-eclipsecrown-noctarch-full-v1',
  chassis: EN_E11_OWL_ECLIPSECROWN_NOCTARCH_CONTRACT.chassis,
  render: renderEclipsecrownNoctarch,
});

export const EN_E11_OWL_ECLIPSECROWN_NOCTARCH_FAMILY = deepFreeze({
  id: 'owl',
  name: 'Owl',
  sliceId: 'EN-E11',
  rendererKey: EN_E11_OWL_ECLIPSECROWN_NOCTARCH_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [ECLIPSECROWN_NOCTARCH_VARIANT],
  rendererData: {
    approvedPrecedingGate: EN_E11_OWL_MOONVEIL_AUGUR_GATE.id,
    activeGate: EN_E11_OWL_ECLIPSECROWN_NOCTARCH_GATE.id,
    topologyDecision: EN_E11_OWL_TOPOLOGY_DECISION.id,
  },
  review: {
    baselineVariant: 'eclipsecrown-noctarch',
    scale: 6,
    notes: 'Approved private Eclipsecrown Noctarch elite Owl only, bound to exact implementation c7c95df2bfd3fb2d4cf421ddc413965b9b0c51f2, approval record 402d94575701ecffd16a23a156bf39eae44298f0, candidate digest c2e1e1108ba71d118a1bd169fe81a4745f37c3f96cb89eed1d18033356dc8b6d, and its six frozen review hashes. The implementation and approval record are pushed and remote verified; only the initial handoff and final reconciliation remain. No continuation request was supplied. Keep public or outline registration, fixtures, effects, child assets, Phoenix, later Bird work, release, accepted drift, and a pull request separate.',
  },
});

export const EN_E11_OWL_ECLIPSECROWN_NOCTARCH_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E11_OWL_ECLIPSECROWN_NOCTARCH_RENDERER],
  families: [EN_E11_OWL_ECLIPSECROWN_NOCTARCH_FAMILY],
});
