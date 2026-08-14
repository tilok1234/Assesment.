import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E11_PHOENIX_ASHCREST_KINDLER_GATE,
  EN_E11_PHOENIX_TOPOLOGY_DECISION,
} from './enemy-expansion-en-e11-phoenix-ashcrest-kindler.js';
import {
  EN_E11_PHOENIX_SUNVEIL_CANTOR_CONTRACT,
  EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE,
} from './enemy-expansion-en-e11-phoenix-sunveil-cantor.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_CONTRACT = deepFreeze({
  family: 'phoenix',
  variant: 'dawnthrone-imperator',
  role: 'elite',
  state: 'implemented-complete-motion-candidate',
  chassis: EN_E11_PHOENIX_TOPOLOGY_DECISION.selected,
  silhouette: 'A bespoke broad, high-chested throne-bodied grounded Phoenix carries a connected three-pronged stepped crown crest, short powerful hooked-beak head and neck, two heavy body-owned plated mantle wings, two separated three-toed talons, and one connected tiered throne-fan tail. It reads as a square imperial mass rather than Ashcrest Kindler\'s compact flame bird or Sunveil Cantor\'s long low processional singer. Attack erects both wings into twin vertical throne pylons, closes them into a forward imperial sunwall, and ends in a hooked-beak decree while the actor remains connected and grounded without detached fire, rays, or halo pieces.',
  identity: 'Midnight-indigo plumage, moon-ivory face and throat, antique-gold crown and breast, oxblood plated mantle wings, turquoise throne seals, pale-cyan eyes, bronze beak and talons, and a connected tiered old-gold throne tail distinguish Dawnthrone Imperator from approved Sunveil Cantor, approved Ashcrest Kindler, and public Harpy Screecher even without color.',
  effectBoundary: EN_E11_PHOENIX_TOPOLOGY_DECISION.effectBoundary,
});

export const EN_E11_PHOENIX_ELITE_CONTRACT_CARD = deepFreeze({
  family: 'phoenix',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingVariant: {
    id: EN_E11_PHOENIX_SUNVEIL_CANTOR_CONTRACT.variant,
    role: EN_E11_PHOENIX_SUNVEIL_CANTOR_CONTRACT.role,
    status: 'implemented-full-approved-published-reconciled',
  },
  activeVariant: {
    id: EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_CONTRACT.variant,
    role: EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_CONTRACT.role,
    status: 'implemented-full-candidate',
  },
  deferredRoles: [],
});

export const EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_GATE = deepFreeze({
  id: 'en-e11-phoenix-dawnthrone-imperator-full-v1',
  status: 'candidate',
  authorizedOn: '2026-08-14',
  authorizationEvidence: 'The exact revised Sunveil Cantor implementation f1fb03eedad0537d6999b3e0346ef689ba052ac0, approval record 017e889275377cee23c5db57486a949bed3caa70, initial published handoff 3dd15852f6d7664febaa0610b797f589703e6ab6, and final reconciliation 1e0e8b31bac737f8fc0f8cd3eb4710330bd160de are pushed and remote verified. The designer then supplied the fresh continuation: lets do next. Under the documented Phoenix common, specialist, elite role order and selected baked-single-actor-grounded-flame-crested-phoenix topology, this opens exactly one private elite Phoenix full 80-frame candidate. Because the elite role was not pre-named, this lane names only Dawnthrone Imperator. This does not approve candidate pixels or authorize a commit, push, public or outline registration, fixtures, effects, child assets, egg or ash resurrection art, flight states, another Phoenix variant, another family, release, accepted drift, or a pull request.',
  baseCheckpoint: '1e0e8b31bac737f8fc0f8cd3eb4710330bd160de',
  architectureDecision: EN_E11_PHOENIX_TOPOLOGY_DECISION.id,
  precedingApproval: {
    gateId: EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.id,
    candidateFrameDigest: EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.candidateFrameDigest,
    publishedImplementation: EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.initialPublishedHandoff,
    currentReconciliation: '1e0e8b31bac737f8fc0f8cd3eb4710330bd160de',
  },
  artifact: 'enemy-expansion-review/en-e11-phoenix-dawnthrone-imperator/en-e11-phoenix-dawnthrone-imperator-full-suite-raw.png',
  artifactSha256: '1bcbe5f19ece1fcc3fa85b73325b54d6ce9ebfa9516d6da389d4815f2a2faf9b',
  outlinedArtifact: 'enemy-expansion-review/en-e11-phoenix-dawnthrone-imperator/en-e11-phoenix-dawnthrone-imperator-full-suite-outlined-complete-b.png',
  outlinedArtifactSha256: 'fbbabe2143550d7aaa12f6b4095f0a36651c069a24a9ade28171088e94d91617',
  assembledArtifact: 'enemy-expansion-review/en-e11-phoenix-dawnthrone-imperator/en-e11-phoenix-dawnthrone-imperator-full-suite-complete-b-form.png',
  assembledArtifactSha256: 'cb1f4f4810b0db4d920bc188266215dd216c22e38ba0fd27acba7515defb21c0',
  comparisonArtifact: 'enemy-expansion-review/en-e11-phoenix-dawnthrone-imperator/en-e11-phoenix-dawnthrone-imperator-family-comparison.png',
  comparisonArtifactSha256: '471de61ddc455abfc73a027e1be8fa9908bd411629600cd54b01e200f3438dcf',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e11-phoenix-dawnthrone-imperator/en-e11-phoenix-dawnthrone-imperator-full-suite-four-directions-labeled.gif',
      sha256: '9707b21b7fdee4742cb1914adeda8939cc0e28c6a8a4806add112934ca4ff8b5',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e11-phoenix-dawnthrone-imperator/en-e11-phoenix-dawnthrone-imperator-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '9da45b041cc0f8102c0b3958632633fc1ca571793eeb6465619d5f5eeef5636e',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
  },
  candidateFrameDigest: '6d7f50455ff7864004bac35fe2e94c2d0ef4d3530845db2e83a69ff871dbcaba',
  sunveilComparisonDigest: EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.candidateFrameDigest,
  ashcrestComparisonDigest: EN_E11_PHOENIX_ASHCREST_KINDLER_GATE.candidateFrameDigest,
  harpyComparisonDigest: 'd7d83f0c209a8b4735e0a488a5df128bffa5407e38fd28e4fc38d73b633e5839',
  scope: 'One complete private 80-frame Phoenix Dawnthrone Imperator elite enemy across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Every frame uses bespoke broad throne-bodied Phoenix geometry rather than rendering Ashcrest or Sunveil. Idle holds a square high-chested imperial watch and settles the tiered throne tail. Walk uses four heavy grounded crown-steps with mantle and tail counterweight. Attack crouches behind the plated mantle, raises both body-owned wings into twin vertical throne pylons, closes them into a forward imperial sunwall, and ends with a hooked-beak decree; this architectural close-and-press motion differs from Ashcrest\'s solar fan and Sunveil\'s alternating arches. Hurt uses a complete-silhouette #f4f4f4 recoil and colored grounded recovery. Cast aliases Attack exactly and Death aliases Hurt H1,H2,H2,H2.',
  anatomyContract: EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_CONTRACT.silhouette,
  reviewPresentation: 'Show the exact labeled all-four-direction Dawnthrone Imperator raw/no-outline, outlined Complete B, Complete B + Form, Sunveil/Ashcrest/Harpy comparison board, and both synchronized full-suite GIFs together.',
  exclusions: [
    'approved Sunveil Cantor source module and pixels',
    'approved Ashcrest Kindler pixels',
    'public Harpy Screecher pixels',
    'approved backlog V3 registration changes',
    'additional Phoenix variants',
    'additional Bird families or variants',
    'new Cast pixels',
    'new Death pixels',
    'detached feather, note, or flame child assets',
    'baked fire pixels',
    'baked ember particles',
    'baked sound-ring or halo pixels',
    'baked glow or projectile pixels',
    'baked loose-feather or ash pixels',
    'egg or resurrection art',
    'flight states',
    'baked dust, shock-ring, or impact pixels',
    'registration',
    'outline registration',
    'consumer exposure',
    'fixtures',
    'effects',
    'release',
    'accepted drift',
    'pull request',
  ],
  nextGate: 'Render, inspect, freeze, and validate this exact private Dawnthrone Imperator candidate, then stop for explicit visual pixel approval. Do not commit, push, register, add fixtures or effects, create child assets or resurrection art, open another Phoenix variant or family, accept drift, release, or open a pull request. The distinct outlined PNG is review evidence only and does not authorize outline registration.',
});

export const EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_DATA = deepFreeze({
  actor: {
    species: 'phoenix',
    bodyBuild: 'broad-high-chested-throne-bodied-grounded-phoenix',
    skin: 'feathered',
    hairStyle: 'connected-three-pronged-stepped-dawn-crown',
    hairColor: 'antique-gold',
    expression: 'imperial-decree',
    faceDetail: 'pale-cyan-eyes-and-short-hooked-bronze-beak',
    headgear: 'connected-dawnthrone-crown',
    outfit: 'connected-oxblood-plated-mantle-and-moon-ivory-throat-gorget',
    outfitColor: 'oxblood',
    outfitTier: 'tier3',
    weapon: 'none',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: ['#34345f', '#17172f'],
      hair: ['#d6b65a', '#74532c'],
      outfit: ['#7a2f47', '#351a31', '#b95758'],
    },
  },
  actorTopology: EN_E11_PHOENIX_TOPOLOGY_DECISION.selected,
  childAssets: [],
  phoenix: {
    head: ['#e9dfc5', '#8d7657', '#fff8df'],
    body: ['#34345f', '#17172f', '#5d5787'],
    wing: ['#7a2f47', '#351a31', '#b95758'],
    breast: ['#d6a44e', '#74502d', '#ffe39a'],
    tail: ['#a96f35', '#543a2a', '#eab750'],
    crown: ['#d6b65a', '#74532c', '#fff0a1'],
    plate: ['#ddd0ab', '#806b49', '#fff4cd'],
    seal: ['#3c9ca4', '#235563', '#96e7de'],
    beak: ['#b69156', '#63482e', '#e8c47d'],
    talon: ['#9d7746', '#513b28'],
    eye: '#bff8ff',
    feature: '#171225',
  },
  effectBoundary: 'external-fire-embers-glow-halos-sun-rays-projectiles-loose-feathers-ash-egg-resurrection-flight-states-dust-shock-rings-and-impacts',
  bakedEffects: [],
});

const DAWNTHRONE_IMPERATOR_VARIANT = deepFreeze({
  id: 'dawnthrone-imperator',
  name: 'Dawnthrone Imperator',
  role: EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_CONTRACT.role,
  status: EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_CONTRACT.state,
  brief: 'Elite grounded Phoenix with a bespoke broad throne-bodied stance, connected stepped gold crown, moon-ivory face and throat, oxblood plated mantle wings, turquoise seals, pale-cyan eyes, bronze beak and talons, and one connected tiered old-gold throne tail.',
  rendererData: EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_DATA,
});

export const EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const MOTION_PHASES = deepFreeze({
  idle: [
    { name: 'high-dawnthrone-imperial-watch', bodyY: 0, headX: 0, headY: 0, wing: 'folded', tail: 'stepped', step: 'planted', flash: false },
    { name: 'settled-throne-tail-breath', bodyY: 1, headX: 0, headY: 0, wing: 'settled', tail: 'settled', step: 'planted', flash: false },
  ],
  walk: [
    { name: 'left-heavy-crown-step', bodyY: 0, headX: -1, headY: 0, wing: 'folded', tail: 'stepped', step: 'left', flash: false },
    { name: 'passing-throne-weight', bodyY: 1, headX: 0, headY: 1, wing: 'settled', tail: 'braced', step: 'passing', flash: false },
    { name: 'right-heavy-crown-step', bodyY: 0, headX: 1, headY: 0, wing: 'folded', tail: 'stepped', step: 'right', flash: false },
    { name: 'mantle-lock-cadence', bodyY: 0, headX: 0, headY: 0, wing: 'braced', tail: 'raised', step: 'planted', flash: false },
  ],
  attack: [
    { name: 'low-imperial-mantle-crouch', bodyY: 1, headX: -1, headY: 1, wing: 'braced', tail: 'braced', step: 'wide', flash: false },
    { name: 'twin-vertical-throne-pylons', bodyY: 0, headX: 0, headY: 0, wing: 'pylons', tail: 'crown', step: 'wide', flash: false },
    { name: 'closed-forward-imperial-sunwall', bodyY: 0, headX: 0, headY: 0, wing: 'sunwall', tail: 'crown', step: 'wide', flash: false },
    { name: 'hooked-beak-throne-decree', bodyY: 0, headX: 1, headY: 0, wing: 'decree', tail: 'braced', step: 'wide', flash: false },
  ],
  hurt: [
    { name: 'white-dawnthrone-recoil', bodyY: 1, headX: -1, headY: 1, wing: 'recoil', tail: 'raised', step: 'recoil', flash: true },
    { name: 'grounded-imperial-recovery', bodyY: 1, headX: -1, headY: 1, wing: 'droop', tail: 'settled', step: 'recoil', flash: false },
  ],
});

function createPainter(context, direction, flash) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Dawnthrone Imperator geometry must use positive integer rectangles.',
    );
    context.fillStyle = flash ? '#f4f4f4' : fill;
    context.fillRect(mirrored ? SIZE - x - width : x, y, width, height);
  };
  return { view, rect, dot: (x, y, fill) => rect(x, y, 1, 1, fill) };
}

function drawThroneTail(paint, phase) {
  const { body, crown, seal, tail } = EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_DATA.phoenix;
  const bob = phase.bodyY;

  if (paint.view === 'right') {
    if (phase.tail === 'crown') {
      paint.rect(1, 11, 10, 8, tail[1]);
      paint.rect(2, 9, 7, 4, tail[0]);
      paint.rect(3, 7, 4, 4, tail[2]);
      paint.rect(2, 17, 8, 4, tail[0]);
      paint.rect(2, 20, 6, 1, crown[0]);
      paint.rect(5, 10, 3, 2, seal[0]);
      paint.dot(6, 10, seal[2]);
      paint.rect(8, 13, 4, 7, body[1]);
    } else if (phase.tail === 'raised') {
      paint.rect(2, 12 + bob, 9, 5, tail[1]);
      paint.rect(3, 10 + bob, 7, 4, tail[0]);
      paint.rect(3, 9 + bob, 4, 2, tail[2]);
      paint.rect(3, 17, 7, 4, tail[0]);
      paint.rect(3, 20, 5, 1, crown[0]);
      paint.dot(5, 12 + bob, seal[2]);
      paint.rect(8, 14 + bob, 4, 6 - bob, body[1]);
    } else if (phase.tail === 'braced') {
      paint.rect(2, 14 + bob, 10, 4, tail[1]);
      paint.rect(2, 17, 8, 4, tail[0]);
      paint.rect(3, 13 + bob, 6, 2, tail[2]);
      paint.rect(3, 20, 5, 1, crown[0]);
      paint.rect(4, 16 + bob, 4, 1, seal[0]);
      paint.rect(8, 15 + bob, 4, 5 - bob, body[1]);
    } else {
      const settled = phase.tail === 'settled' ? 1 : 0;
      paint.rect(3, 14 + bob + settled, 9, 4, tail[1]);
      paint.rect(2, 17 + settled, 8, 4 - settled, tail[0]);
      paint.rect(4, 13 + bob + settled, 6, 2, tail[2]);
      paint.rect(3, 20, 5, 1, crown[0]);
      paint.dot(6, 16 + bob, seal[2]);
      paint.rect(8, 15 + bob, 4, 5 - bob, body[1]);
    }
    return;
  }

  if (phase.tail === 'crown') {
    paint.rect(2, 12, 20, 7, tail[1]);
    paint.rect(3, 10, 6, 8, tail[0]);
    paint.rect(15, 10, 6, 8, tail[0]);
    paint.rect(5, 8, 4, 5, tail[2]);
    paint.rect(15, 8, 4, 5, tail[2]);
    paint.rect(4, 18, 6, 3, tail[0]);
    paint.rect(14, 18, 6, 3, tail[0]);
    paint.rect(5, 20, 4, 1, crown[0]);
    paint.rect(15, 20, 4, 1, crown[0]);
    paint.dot(7, 11, seal[2]);
    paint.dot(16, 11, seal[2]);
    paint.rect(8, 14, 8, 6, body[1]);
  } else if (phase.tail === 'raised') {
    paint.rect(4, 12 + bob, 7, 6, tail[1]);
    paint.rect(13, 12 + bob, 7, 6, tail[1]);
    paint.rect(5, 10 + bob, 5, 4, tail[0]);
    paint.rect(14, 10 + bob, 5, 4, tail[0]);
    paint.rect(5, 17, 6, 4, tail[0]);
    paint.rect(13, 17, 6, 4, tail[0]);
    paint.rect(6, 20, 4, 1, crown[0]);
    paint.rect(14, 20, 4, 1, crown[0]);
    paint.dot(7, 13 + bob, seal[2]);
    paint.dot(16, 13 + bob, seal[2]);
    paint.rect(8, 15, 8, 5, body[1]);
  } else if (phase.tail === 'braced') {
    paint.rect(3, 14 + bob, 18, 5, tail[1]);
    paint.rect(4, 17, 7, 4, tail[0]);
    paint.rect(13, 17, 7, 4, tail[0]);
    paint.rect(5, 13 + bob, 6, 2, tail[2]);
    paint.rect(13, 13 + bob, 6, 2, tail[2]);
    paint.rect(6, 20, 4, 1, crown[0]);
    paint.rect(14, 20, 4, 1, crown[0]);
    paint.rect(8, 15, 8, 5, body[1]);
  } else {
    const settled = phase.tail === 'settled' ? 1 : 0;
    paint.rect(4, 14 + bob + settled, 16, 4, tail[1]);
    paint.rect(5, 17 + settled, 6, 4 - settled, tail[0]);
    paint.rect(13, 17 + settled, 6, 4 - settled, tail[0]);
    paint.rect(6, 13 + bob + settled, 5, 2, tail[2]);
    paint.rect(13, 13 + bob + settled, 5, 2, tail[2]);
    paint.rect(6, 20, 4, 1, crown[0]);
    paint.rect(14, 20, 4, 1, crown[0]);
    paint.dot(8, 16 + bob, seal[2]);
    paint.dot(15, 16 + bob, seal[2]);
    paint.rect(8, 15, 8, 5, body[1]);
  }
}

function footPositions(view, step) {
  const front = {
    planted: [6, 15], left: [4, 14], passing: [7, 14], right: [7, 16],
    wide: [4, 17], recoil: [5, 16],
  };
  const side = {
    planted: [8, 16], left: [6, 15], passing: [9, 15], right: [9, 17],
    wide: [6, 17], recoil: [8, 16],
  };
  return (view === 'right' ? side : front)[step];
}

function drawImperialTalons(paint, phase) {
  const { talon } = EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_DATA.phoenix;
  for (const footX of footPositions(paint.view, phase.step)) {
    const legY = 17 + phase.bodyY;
    paint.rect(footX + 1, legY, 2, 22 - legY, talon[1]);
    paint.rect(footX, 22, 3, 1, talon[0]);
    paint.dot(footX + 2, 21, talon[0]);
  }
}

function drawSideMantleAndBody(paint, phase) {
  const { body, breast, plate, seal, wing } = EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_DATA.phoenix;
  const bob = phase.bodyY;

  if (phase.wing === 'pylons') {
    paint.rect(3, 4, 6, 13, wing[1]);
    paint.rect(5, 2, 5, 15, wing[0]);
    paint.rect(7, 5, 4, 12, plate[1]);
    paint.rect(10, 4, 6, 14, wing[1]);
    paint.rect(12, 3, 5, 15, wing[0]);
    paint.rect(13, 6, 4, 11, plate[0]);
    paint.rect(5, 3, 4, 2, wing[2]);
    paint.rect(12, 4, 4, 2, wing[2]);
    paint.dot(8, 9, seal[2]);
    paint.dot(14, 10, seal[2]);
  } else if (phase.wing === 'sunwall') {
    paint.rect(7, 6, 15, 12, wing[1]);
    paint.rect(10, 5, 12, 11, wing[0]);
    paint.rect(13, 6, 9, 8, plate[0]);
    paint.rect(16, 8, 6, 5, wing[2]);
    paint.rect(11, 7, 4, 8, plate[1]);
    paint.rect(14, 9, 4, 2, seal[0]);
    paint.dot(16, 9, seal[2]);
  } else if (phase.wing === 'decree') {
    paint.rect(8, 9 + bob, 14, 9 - bob, wing[1]);
    paint.rect(12, 8 + bob, 10, 8 - bob, wing[0]);
    paint.rect(15, 9 + bob, 7, 5, plate[0]);
    paint.rect(17, 11 + bob, 5, 2, wing[2]);
    paint.dot(18, 10 + bob, seal[2]);
  } else if (phase.wing === 'recoil') {
    paint.rect(5, 8 + bob, 10, 9 - bob, wing[1]);
    paint.rect(7, 13 + bob, 9, 6 - bob, wing[0]);
    paint.rect(6, 9 + bob, 5, 2, plate[0]);
  } else if (phase.wing === 'droop') {
    paint.rect(6, 12 + bob, 11, 7 - bob, wing[1]);
    paint.rect(5, 16 + bob, 9, 4 - bob, wing[0]);
    paint.rect(7, 17 + bob, 6, 2, plate[0]);
  } else if (phase.wing === 'braced') {
    paint.rect(5, 8 + bob, 9, 10 - bob, wing[1]);
    paint.rect(8, 10 + bob, 9, 8 - bob, wing[0]);
    paint.rect(6, 9 + bob, 6, 3, plate[1]);
    paint.rect(9, 13 + bob, 6, 2, plate[0]);
    paint.dot(11, 14 + bob, seal[2]);
  } else {
    const low = phase.wing === 'settled' ? 1 : 0;
    paint.rect(6, 8 + bob + low, 9, 9 - bob, wing[1]);
    paint.rect(8, 10 + bob + low, 9, 7 - bob, wing[0]);
    paint.rect(6, 14 + bob + low, 9, 4 - low, wing[2]);
    paint.rect(7, 10 + bob + low, 6, 3, plate[1]);
    paint.rect(9, 14 + bob + low, 5, 2, plate[0]);
    paint.dot(11, 15 + bob, seal[2]);
  }

  paint.rect(7, 10 + bob, 12, 9 - bob, body[1]);
  paint.rect(9, 11 + bob, 9, 7 - bob, body[0]);
  paint.rect(11, 12 + bob, 7, 5, body[2]);
  paint.rect(13, 12 + bob, 5, 5, breast[1]);
  paint.rect(14, 13 + bob, 4, 4, breast[0]);
  paint.rect(15, 14 + bob, 3, 2, breast[2]);
}

function drawFrontMantleAndBody(paint, phase) {
  const { body, breast, plate, seal, wing } = EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_DATA.phoenix;
  const bob = phase.bodyY;

  if (phase.wing === 'pylons') {
    paint.rect(2, 4, 6, 14, wing[1]);
    paint.rect(4, 2, 5, 15, wing[0]);
    paint.rect(5, 5, 4, 12, plate[0]);
    paint.rect(16, 4, 6, 14, wing[1]);
    paint.rect(15, 2, 5, 15, wing[0]);
    paint.rect(15, 5, 4, 12, plate[0]);
    paint.rect(3, 3, 5, 2, wing[2]);
    paint.rect(16, 3, 5, 2, wing[2]);
    paint.dot(7, 9, seal[2]);
    paint.dot(16, 9, seal[2]);
  } else if (phase.wing === 'sunwall') {
    paint.rect(3, 7, 18, 11, wing[1]);
    paint.rect(5, 6, 14, 11, wing[0]);
    paint.rect(6, 7, 5, 8, plate[0]);
    paint.rect(13, 7, 5, 8, plate[0]);
    paint.rect(7, 9, 4, 2, seal[0]);
    paint.rect(13, 9, 4, 2, seal[0]);
    paint.dot(9, 9, seal[2]);
    paint.dot(15, 9, seal[2]);
  } else if (phase.wing === 'decree') {
    paint.rect(3, 9 + bob, 8, 9 - bob, wing[1]);
    paint.rect(13, 9 + bob, 8, 9 - bob, wing[1]);
    paint.rect(5, 8 + bob, 7, 8 - bob, wing[0]);
    paint.rect(12, 8 + bob, 7, 8 - bob, wing[0]);
    paint.rect(6, 10 + bob, 5, 4, plate[0]);
    paint.rect(13, 10 + bob, 5, 4, plate[0]);
  } else if (phase.wing === 'recoil') {
    paint.rect(3, 8 + bob, 9, 9 - bob, wing[1]);
    paint.rect(12, 10 + bob, 9, 8 - bob, wing[0]);
    paint.rect(5, 9 + bob, 5, 2, plate[0]);
  } else if (phase.wing === 'droop') {
    paint.rect(3, 13 + bob, 9, 6 - bob, wing[1]);
    paint.rect(12, 14 + bob, 9, 5 - bob, wing[0]);
    paint.rect(5, 17 + bob, 5, 2, plate[0]);
    paint.rect(14, 17 + bob, 5, 2, plate[0]);
  } else if (phase.wing === 'braced') {
    paint.rect(3, 8 + bob, 9, 10 - bob, wing[1]);
    paint.rect(6, 10 + bob, 6, 8 - bob, wing[0]);
    paint.rect(12, 10 + bob, 6, 8 - bob, wing[0]);
    paint.rect(13, 8 + bob, 8, 10 - bob, wing[1]);
    paint.rect(5, 9 + bob, 5, 3, plate[1]);
    paint.rect(14, 9 + bob, 5, 3, plate[1]);
  } else {
    const low = phase.wing === 'settled' ? 1 : 0;
    paint.rect(5, 8 + bob + low, 7, 9 - bob, wing[1]);
    paint.rect(3, 12 + bob + low, 8, 6 - low, wing[0]);
    paint.rect(12, 8 + bob + low, 7, 9 - bob, wing[1]);
    paint.rect(13, 12 + bob + low, 8, 6 - low, wing[0]);
    paint.rect(5, 10 + bob + low, 5, 3, plate[1]);
    paint.rect(14, 10 + bob + low, 5, 3, plate[1]);
    paint.dot(8, 14 + bob, seal[2]);
    paint.dot(15, 14 + bob, seal[2]);
  }

  paint.rect(7, 10 + bob, 10, 9 - bob, body[1]);
  paint.rect(8, 11 + bob, 8, 7 - bob, body[0]);
  paint.rect(9, 12 + bob, 6, 5, body[2]);
  if (paint.view === 'up') {
    paint.rect(9, 11 + bob, 6, 4, body[1]);
    paint.rect(10, 12 + bob, 4, 2, body[0]);
    paint.dot(12, 13 + bob, seal[2]);
  } else {
    paint.rect(9, 11 + bob, 6, 6, breast[1]);
    paint.rect(10, 12 + bob, 4, 5, breast[0]);
    paint.rect(11, 13 + bob, 2, 3, breast[2]);
  }
}

function drawSideHeadAndCrown(paint, phase) {
  const { beak, crown, eye, feature, head, plate, seal } = EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_DATA.phoenix;
  const x = phase.headX;
  const y = phase.headY;

  paint.rect(10 + x, 4 + y, 9, 3, crown[1]);
  paint.rect(11 + x, 2 + y, 3, 4, crown[0]);
  paint.rect(14 + x, 1 + y, 3, 5, crown[0]);
  paint.rect(17 + x, 3 + y, 2, 4, crown[0]);
  paint.dot(12 + x, 2 + y, crown[2]);
  paint.dot(15 + x, 1 + y, crown[2]);
  paint.dot(18 + x, 3 + y, seal[2]);

  paint.rect(12 + x, 8 + y, 5, 7 + phase.bodyY - y, head[1]);
  paint.rect(14 + x, 5 + y, 6, 6, head[1]);
  paint.rect(15 + x, 6 + y, 5, 4, head[0]);
  paint.rect(13 + x, 9 + y, 5, 5 + phase.bodyY - y, plate[1]);
  paint.rect(14 + x, 10 + y, 4, 4 + phase.bodyY - y, plate[0]);
  paint.dot(16 + x, 11 + y, seal[2]);

  paint.dot(18 + x, 7 + y, eye);
  paint.dot(18 + x, 8 + y, feature);
  paint.rect(19 + x, 8 + y, 3, 2, beak[1]);
  paint.rect(19 + x, 8 + y, 2, 1, beak[0]);
  paint.dot(21 + x, 8 + y, beak[2]);
}

function drawFrontHeadAndCrown(paint, phase) {
  const { beak, crown, eye, feature, head, plate, seal } = EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_DATA.phoenix;
  const x = phase.headX;
  const y = phase.headY;

  paint.rect(6 + x, 4 + y, 12, 3, crown[1]);
  paint.rect(7 + x, 2 + y, 3, 4, crown[0]);
  paint.rect(11 + x, 1 + y, 3, 5, crown[0]);
  paint.rect(15 + x, 2 + y, 3, 4, crown[0]);
  paint.dot(8 + x, 2 + y, crown[2]);
  paint.dot(12 + x, 1 + y, crown[2]);
  paint.dot(16 + x, 2 + y, seal[2]);

  paint.rect(9 + x, 5 + y, 6, 6, head[1]);
  paint.rect(10 + x, 6 + y, 4, 4, head[0]);
  paint.rect(9 + x, 9 + y, 6, 6 + phase.bodyY - y, plate[1]);
  paint.rect(10 + x, 10 + y, 4, 5 + phase.bodyY - y, plate[0]);
  paint.dot(12 + x, 12 + y, seal[2]);

  if (paint.view === 'up') {
    paint.rect(10 + x, 6 + y, 4, 3, crown[1]);
    paint.rect(11 + x, 8 + y, 2, 2, seal[0]);
    return;
  }

  paint.dot(10 + x, 7 + y, eye);
  paint.dot(13 + x, 7 + y, eye);
  paint.dot(10 + x, 8 + y, feature);
  paint.dot(13 + x, 8 + y, feature);
  paint.rect(10 + x, 9 + y, 4, 2, beak[1]);
  paint.rect(11 + x, 9 + y, 2, 2, beak[0]);
  paint.dot(12 + x, 10 + y, beak[2]);
}

function drawDawnthroneImperator(context, direction, phase) {
  const paint = createPainter(context, direction, phase.flash);
  drawThroneTail(paint, phase);
  drawImperialTalons(paint, phase);
  if (paint.view === 'right') {
    drawSideMantleAndBody(paint, phase);
    drawSideHeadAndCrown(paint, phase);
  } else {
    drawFrontMantleAndBody(paint, phase);
    drawFrontHeadAndCrown(paint, phase);
  }
}

function resolveSource(animation, frame) {
  if (animation === 'cast') return { animation: 'attack', frame };
  if (animation === 'death') return { animation: 'hurt', frame: EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_DEATH_SOURCE_FRAMES[frame] };
  return { animation, frame };
}

function renderDawnthroneImperator(args) {
  assert(args.family.id === 'phoenix', 'The EN-E11 Dawnthrone Imperator renderer is restricted to Phoenix.');
  assert(args.variant.id === 'dawnthrone-imperator', 'The EN-E11 Phoenix elite renderer is restricted to Dawnthrone Imperator.');
  const frameCounts = { idle: 2, walk: 4, attack: 4, cast: 4, hurt: 2, death: 4 };
  const frameCount = frameCounts[args.animation.id];
  assert(frameCount !== undefined, 'The Dawnthrone Imperator gate authorizes only Idle, Walk, Attack, Cast, Hurt, and Death.');
  assert(
    Number.isInteger(args.frame) && args.frame >= 0 && args.frame < frameCount,
    'The Dawnthrone Imperator frame is outside the authorized animation contract.',
  );

  const source = resolveSource(args.animation.id, args.frame);
  const phase = MOTION_PHASES[source.animation][source.frame];
  drawDawnthroneImperator(args.context, args.direction, phase);

  return Object.freeze({
    family: args.family.id,
    variant: args.variant.id,
    direction: args.direction,
    animation: args.animation.id,
    frame: args.frame,
    renderedAnimation: source.animation,
    renderedFrame: source.frame,
    phoenixDawnthroneImperatorGate: EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_GATE.id,
    architectureDecision: EN_E11_PHOENIX_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.id,
    approvedSourceMotion: 'bespoke-dawnthrone-imperator-throne-bodied-geometry',
    role: EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_CONTRACT.role,
    anatomy: EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_CONTRACT.chassis,
    upperBody: 'bespoke-broad-high-chested-phoenix-with-connected-stepped-crown-and-two-heavy-body-owned-plated-mantle-wings',
    lowerBody: 'square-throne-body-two-separated-grounded-three-toed-talons-and-one-connected-tiered-throne-fan-tail',
    motion: args.animation.id === 'cast'
      ? 'exact-cast-alias-of-dawnthrone-imperator-twin-pylons-and-imperial-sunwall'
      : args.animation.id === 'death'
        ? 'exact-death-alias-of-dawnthrone-imperator-recoil'
        : phase.name,
    childAssetCount: EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_DATA.childAssets.length,
    effectBoundary: EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_DATA.effectBoundary,
  });
}

export const EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_RENDERER = Object.freeze({
  key: 'en-e11-phoenix-dawnthrone-imperator-full-v1',
  chassis: EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_CONTRACT.chassis,
  render: renderDawnthroneImperator,
});

export const EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_FAMILY = deepFreeze({
  id: 'phoenix',
  name: 'Phoenix',
  sliceId: 'EN-E11',
  rendererKey: EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [DAWNTHRONE_IMPERATOR_VARIANT],
  rendererData: {
    approvedPrecedingGate: EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.id,
    approvedSourceGate: null,
    activeGate: EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_GATE.id,
    topologyDecision: EN_E11_PHOENIX_TOPOLOGY_DECISION.id,
  },
  review: {
    baselineVariant: 'dawnthrone-imperator',
    scale: 6,
    notes: 'Unapproved private Dawnthrone Imperator elite Phoenix candidate against approved Sunveil Cantor, approved Ashcrest Kindler, and public Harpy Screecher. The renderer uses bespoke broad throne-bodied geometry rather than either approved Phoenix source. Stop after exact review-packet inspection and validation. Do not commit or push candidate pixels without explicit approval of the posted exact packet or candidate digest. Keep public or outline registration, fixtures, effects, child assets, resurrection art, flight states, another Phoenix variant or family, release, accepted drift, and a pull request separate.',
  },
});

export const EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_RENDERER],
  families: [EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_FAMILY],
});
