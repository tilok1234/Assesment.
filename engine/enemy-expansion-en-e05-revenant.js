import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E05_VAMPIRE_GATE } from './enemy-expansion-en-e05-vampire.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E05_REVENANT_CONTRACT = deepFreeze({
  sliceId: 'EN-E05',
  family: 'revenant',
  variant: 'grave-oathkeeper',
  role: 'common',
  state: 'implemented-complete-motion-candidate',
  chassis: 'oathbound-broken-knight',
  silhouette: 'A split-crested dented helm, broad mismatched pauldrons, battered breastplate, exposed corpse hands, torn oath-tabard, heavy boots, and a connected broken greatblade create a broad martial Revenant silhouette. Every frame remains one connected hard-alpha actor with one-cell margins.',
  identity: 'Corpse-gray bone, cold blue iron, old rust, a faded oath-red tabard, worn brass fasteners, a chipped steel blade, black armor cavities, and two cyan oathfire eyes separate the Grave Oathkeeper from the approved aristocratic Vampire, wrapped Mummy, and feral Ghoul.',
  effectBoundary: 'Soul flame, grave mist, spectral chains, rune glow, weapon trails, sparks, dust, blood, afterimages, ground cracks, and detached armor debris remain external.',
});

export const EN_E05_REVENANT_GATE = deepFreeze({
  id: 'en-e05-revenant-grave-oathkeeper-full-v1',
  status: 'acceptance-candidate',
  authorizedOn: '2026-08-09',
  authorizationEvidence: 'After approving and publishing the complete Vampire, the designer replied: awesome lets do next. This authorized one separate complete Revenant candidate under the established one-full-sprite cadence.',
  precedingApproval: {
    gateId: EN_E05_VAMPIRE_GATE.id,
    artifactSha256: EN_E05_VAMPIRE_GATE.artifactSha256,
    assembledArtifactSha256: EN_E05_VAMPIRE_GATE.assembledArtifactSha256,
    rawAnimationSha256: EN_E05_VAMPIRE_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E05_VAMPIRE_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E05_VAMPIRE_GATE.candidateFrameDigest,
    publishedImplementation: '6a7cce2f84f86f7836b583341f56a1ae7e9c7a51',
    publishedHandoff: '16f58760be6483ba463e0b5acf88cdaa4592943b',
  },
  artifact: 'enemy-expansion-review/en-e05-revenant/en-e05-revenant-grave-oathkeeper-full-suite-raw.png',
  artifactSha256: '010fc811c0495406025a6f3efd4e6f97393f9e6e0ccc64e92ce8dcd610063afe',
  assembledArtifact: 'enemy-expansion-review/en-e05-revenant/en-e05-revenant-grave-oathkeeper-full-suite-complete-b-form.png',
  assembledArtifactSha256: '037ffb153c64f2542f42377ec70222947149d2d46205605728f3004dc41eb3c6',
  comparisonArtifact: 'enemy-expansion-review/en-e05-revenant/en-e05-revenant-vampire-comparison.png',
  comparisonArtifactSha256: 'ba4debce379e44e6d7c5d5e865a3cf06f029efafba4bdf928174c111d2294d96',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e05-revenant/en-e05-revenant-grave-oathkeeper-full-suite-four-directions-labeled.gif',
      sha256: '41154eb09cd907b1fd128673dcc9baff5f947990641f2c1a42010fa7ac6f7920',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e05-revenant/en-e05-revenant-grave-oathkeeper-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '58d05f0640b94b3e55c5b16d92e785d4637a24664bec3f7a004e364e3b5c860a',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
  },
  candidateFrameDigest: 'f53fa853e7fb7aebc232e3ca1903d8a4d1d717de02576c51fe81f4c4d5b90079',
  vampireComparisonDigest: EN_E05_VAMPIRE_GATE.candidateFrameDigest,
  scope: 'One complete 80-frame Revenant Grave Oathkeeper common enemy across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle uses a sealed vigil and armor heave. Walk is a four-step grave march with heavy boot plants, blade drag, and torn-tabard movement. Attack sets the oathblade guard, hoists it over the shoulder, commits to a broad full-body cleave, and grounds into recovery. Hurt uses a complete white iron stagger and colored oath brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact approved-Vampire versus Revenant comparison plus the labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards and GIFs together.',
  exclusions: [
    'approved Vampire source module or pixels',
    'approved Mummy source module or pixels',
    'approved Ghoul source module or pixels',
    'public Revenant registration',
    'public catalog exposure',
    'asset-pack fixture generation or regeneration',
    'additional Revenant variants',
    'new Cast pixels',
    'new Death pixels',
    'soul flame',
    'grave mist',
    'spectral chains',
    'rune glow',
    'weapon trails',
    'sparks',
    'dust',
    'blood',
    'afterimages',
    'ground cracks',
    'detached armor debris',
    'effects',
    'release',
    'Lich',
    'later EN-E05 work',
  ],
  nextGate: 'Stop for explicit designer review of the exact Vampire comparison plus raw and Complete B + Form Revenant evidence. Do not publish, register, generate fixtures, or begin Lich before approval.',
});

const COLORS = deepFreeze({
  bone: ['#c3c5b2', '#7b806f'],
  iron: ['#697586', '#343e4b'],
  rust: ['#a15b3e', '#60372e'],
  tabard: ['#8a4a46', '#4d2c32'],
  blade: ['#a8b2b5', '#59656b'],
  brass: ['#c09a4f', '#70572f'],
  eye: '#5de7e0',
  cavity: '#20252d',
  flash: '#f4f4f4',
});

export const EN_E05_REVENANT_DATA = deepFreeze({
  actor: {
    species: 'undead',
    bodyBuild: 'broad',
    skin: 'pale',
    hairStyle: 'bald',
    hairColor: 'gray',
    expression: 'stern',
    faceDetail: 'none',
    headgear: 'helmet',
    outfit: 'armor',
    outfitColor: 'red',
    outfitTier: 'tier2',
    weapon: 'none',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.bone,
      hair: [COLORS.cavity, COLORS.iron[1]],
      outfit: [COLORS.iron[0], COLORS.iron[1], COLORS.tabard[0]],
    },
  },
  revenant: COLORS,
  effectBoundary: 'external-soul-flame-grave-mist-spectral-chains-rune-glow-weapon-trails-sparks-dust-blood-afterimages-ground-cracks-and-detached-armor-debris',
  bakedEffects: [],
});

const REVENANT_GRAVE_OATHKEEPER_VARIANT = deepFreeze({
  id: 'grave-oathkeeper',
  name: 'Grave Oathkeeper',
  role: EN_E05_REVENANT_CONTRACT.role,
  status: EN_E05_REVENANT_CONTRACT.state,
  brief: 'A complete common Revenant: split helm, battered plate, torn oath-tabard, exposed corpse hands, cyan oathfire eyes, connected broken greatblade, and one full standard motion suite.',
  rendererData: EN_E05_REVENANT_DATA,
});

export const EN_E05_REVENANT_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'sealed-grave-vigil', bob: 0, stride: 0, swing: 0, reach: 0, crouch: 0, tabard: 0, pose: 'guard', flash: false },
  { name: 'armor-heave', bob: 1, stride: 0, swing: 1, reach: 0, crouch: 0, tabard: 1, pose: 'guard', flash: false },
]);

const WALK_PHASES = deepFreeze([
  { name: 'left-grave-step', bob: 0, stride: -1, swing: 1, reach: 0, crouch: 0, tabard: -1, pose: 'march', flash: false },
  { name: 'iron-weight-sink', bob: 1, stride: 0, swing: 0, reach: 0, crouch: 1, tabard: 0, pose: 'march', flash: false },
  { name: 'right-grave-step', bob: 0, stride: 1, swing: -1, reach: 0, crouch: 0, tabard: 1, pose: 'march', flash: false },
  { name: 'broken-blade-drag', bob: 1, stride: 0, swing: 1, reach: 0, crouch: 0, tabard: 1, pose: 'drag', flash: false },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'oathblade-guard', bob: 1, stride: 0, swing: -1, reach: 0, crouch: 1, tabard: -1, pose: 'coil', flash: false },
  { name: 'shoulder-hoist', bob: 0, stride: -1, swing: 1, reach: 0, crouch: 0, tabard: 1, pose: 'hoist', flash: false },
  { name: 'grave-oath-cleave', bob: 0, stride: 1, swing: 2, reach: 1, crouch: 0, tabard: 1, pose: 'cleave', flash: false },
  { name: 'grounded-iron-recover', bob: 1, stride: 0, swing: 0, reach: 0, crouch: 1, tabard: 0, pose: 'recover', flash: false },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-iron-stagger', bob: 0, stride: -1, swing: -1, reach: -1, crouch: 1, tabard: -1, pose: 'recoil', flash: true },
  { name: 'colored-oath-brace', bob: 1, stride: 0, swing: 1, reach: 0, crouch: 1, tabard: 1, pose: 'brace', flash: false },
]);

function phaseFor(animation, frame) {
  if (animation === 'idle') return IDLE_PHASES[frame];
  if (animation === 'walk') return WALK_PHASES[frame];
  if (animation === 'attack' || animation === 'cast') return ATTACK_PHASES[frame];
  if (animation === 'hurt') return HURT_PHASES[frame];
  if (animation === 'death') return HURT_PHASES[EN_E05_REVENANT_DEATH_SOURCE_FRAMES[frame]];
  throw new TypeError(`Unsupported Revenant animation ${animation}.`);
}

function mirroredContext(context) {
  let fillStyle = context.fillStyle;
  return {
    get fillStyle() { return fillStyle; },
    set fillStyle(value) {
      fillStyle = value;
      context.fillStyle = value;
    },
    onOutOfBounds(write) {
      if (typeof context.onOutOfBounds === 'function') context.onOutOfBounds({ ...write, x: SIZE - 1 - write.x });
    },
    clearRect(x, y, width, height) {
      context.clearRect(SIZE - x - width, y, width, height);
    },
    fillRect(x, y, width, height) {
      context.fillStyle = fillStyle;
      context.fillRect(SIZE - x - width, y, width, height);
    },
  };
}

function painter(context, phase) {
  const color = (value) => phase.flash ? COLORS.flash : value;
  const pixel = (x, y, fill) => {
    context.fillStyle = color(fill);
    context.fillRect(x, y, 1, 1);
  };
  const rect = (x, y, width, height, fill) => {
    context.fillStyle = color(fill);
    context.fillRect(x, y, width, height);
  };
  return { pixel, rect };
}

function drawFrontLegs(paint, phase) {
  const leftX = 8 + (phase.stride < 0 ? -1 : phase.stride > 0 ? 1 : 0);
  const rightX = 14 + (phase.stride > 0 ? 1 : phase.stride < 0 ? -1 : 0);
  const leftLift = phase.stride > 0 ? 1 : 0;
  const rightLift = phase.stride < 0 ? 1 : 0;
  paint.rect(leftX, 17 + phase.crouch + leftLift, 3, 4 - leftLift, COLORS.iron[1]);
  paint.rect(rightX, 17 + phase.crouch + rightLift, 3, 4 - rightLift, COLORS.iron[0]);
  paint.rect(leftX - 1, 20 + leftLift, 4, 2, COLORS.rust[1]);
  paint.rect(rightX, 20 + rightLift, 4, 2, COLORS.rust[0]);
  paint.pixel(leftX, 21 + leftLift, COLORS.brass[1]);
  paint.pixel(rightX + 2, 21 + rightLift, COLORS.brass[0]);
}

function drawFrontArmsAndBlade(paint, phase, rear = false) {
  const farBone = rear ? COLORS.bone[1] : COLORS.bone[0];
  if (phase.pose === 'hoist') {
    paint.rect(5, 9, 4, 4, COLORS.iron[1]);
    paint.rect(4, 12, 3, 4, farBone);
    paint.rect(15, 8, 5, 4, COLORS.iron[0]);
    paint.rect(18, 6, 3, 4, COLORS.bone[0]);
    paint.rect(18, 7, 4, 2, COLORS.rust[0]);
    paint.rect(19, 3, 3, 5, COLORS.blade[1]);
    paint.rect(20, 2, 2, 4, COLORS.blade[0]);
    paint.pixel(19, 2, COLORS.blade[1]);
    paint.pixel(21, 1, COLORS.rust[1]);
    return;
  }
  if (phase.pose === 'cleave') {
    paint.rect(5, 10, 4, 4, COLORS.iron[1]);
    paint.rect(6, 13, 4, 3, farBone);
    paint.rect(15, 9, 5, 4, COLORS.iron[0]);
    paint.rect(17, 11, 4, 3, COLORS.bone[0]);
    paint.rect(18, 10, 4, 2, COLORS.rust[0]);
    paint.rect(3, 11, 16, 2, COLORS.blade[0]);
    paint.rect(2, 12, 12, 2, COLORS.blade[1]);
    paint.pixel(2, 11, COLORS.rust[1]);
    return;
  }
  if (phase.pose === 'recoil') {
    paint.rect(4, 9, 5, 4, COLORS.iron[1]);
    paint.rect(3, 12, 4, 4, farBone);
    paint.rect(15, 10, 5, 4, COLORS.iron[0]);
    paint.rect(18, 13, 3, 4, COLORS.bone[0]);
    paint.rect(2, 14, 6, 2, COLORS.blade[1]);
    paint.rect(2, 15, 3, 2, COLORS.blade[0]);
    return;
  }
  const coil = phase.pose === 'coil';
  const drag = phase.pose === 'drag' || phase.pose === 'recover';
  const leftY = 10 + phase.bob + (phase.swing > 0 ? -1 : 0) + (coil ? 1 : 0);
  const rightY = 10 + phase.bob + (phase.swing < 0 ? -1 : 0);
  paint.rect(5, leftY, 4, 4, COLORS.iron[1]);
  paint.rect(4, leftY + 3, 3, 4, farBone);
  paint.pixel(4, leftY + 6, COLORS.brass[1]);
  paint.rect(15, rightY, 5, 4, COLORS.iron[0]);
  paint.rect(18, rightY + 3, 3, 4, COLORS.bone[0]);
  paint.rect(18, rightY + 4, 4, 2, COLORS.rust[0]);
  if (drag) {
    paint.rect(20, rightY + 5, 2, 7, COLORS.blade[1]);
    paint.rect(19, rightY + 9, 3, 3, COLORS.blade[0]);
    paint.pixel(19, rightY + 11, COLORS.rust[1]);
  } else {
    paint.rect(20, 8 + phase.crouch, 2, 12, COLORS.blade[1]);
    paint.rect(19, 9 + phase.crouch, 2, 8, COLORS.blade[0]);
    paint.pixel(20, 7 + phase.crouch, COLORS.rust[1]);
    paint.pixel(21, 20, COLORS.rust[0]);
  }
}

function drawDown(context, phase) {
  const paint = painter(context, phase);
  const settle = phase.bob + phase.crouch;
  drawFrontLegs(paint, phase);
  const tabardLeft = phase.tabard < 0 ? 7 : 8;
  const tabardRight = phase.tabard > 0 ? 18 : 17;
  paint.rect(tabardLeft, 13 + phase.crouch, tabardRight - tabardLeft + 1, 6, COLORS.tabard[1]);
  paint.rect(10, 14 + phase.crouch, 5, 6, COLORS.tabard[0]);
  paint.pixel(tabardLeft, 19 + phase.crouch, COLORS.rust[1]);
  paint.pixel(tabardRight, 18 + phase.crouch, COLORS.rust[0]);
  paint.rect(6, 8 + settle, 12, 9, COLORS.iron[1]);
  paint.rect(8, 9 + settle, 8, 7, COLORS.iron[0]);
  paint.rect(9, 11 + settle, 6, 4, COLORS.tabard[0]);
  paint.rect(10, 12 + settle, 4, 3, COLORS.tabard[1]);
  paint.pixel(12, 10 + settle, COLORS.brass[0]);
  paint.pixel(12, 11 + settle, COLORS.brass[1]);
  paint.rect(5, 7 + settle, 5, 4, COLORS.iron[0]);
  paint.pixel(5, 7 + settle, COLORS.rust[0]);
  paint.rect(14, 7 + settle, 6, 4, COLORS.iron[1]);
  paint.pixel(19, 8 + settle, COLORS.rust[1]);
  drawFrontArmsAndBlade(paint, phase);
  paint.rect(9, 3 + settle, 7, 7, COLORS.iron[1]);
  paint.rect(10, 4 + settle, 5, 5, COLORS.cavity);
  paint.rect(10, 8 + settle, 5, 2, COLORS.bone[1]);
  paint.rect(10, 2 + settle, 5, 2, COLORS.iron[0]);
  paint.rect(11, 1 + settle, 2, 2, COLORS.rust[0]);
  paint.pixel(14, 2 + settle, COLORS.rust[1]);
  paint.pixel(10, 6 + settle, COLORS.eye);
  paint.pixel(14, 6 + settle, COLORS.eye);
  paint.pixel(12, 9 + settle, COLORS.brass[1]);
}

function drawUp(context, phase) {
  const paint = painter(context, phase);
  const settle = phase.bob + phase.crouch;
  drawFrontLegs(paint, phase);
  const tabardLeft = phase.tabard < 0 ? 7 : 8;
  const tabardRight = phase.tabard > 0 ? 18 : 17;
  paint.rect(tabardLeft, 13 + phase.crouch, tabardRight - tabardLeft + 1, 6, COLORS.tabard[1]);
  paint.rect(10, 14 + phase.crouch, 5, 6, COLORS.tabard[0]);
  paint.pixel(tabardLeft, 19 + phase.crouch, COLORS.rust[1]);
  paint.rect(6, 8 + settle, 12, 9, COLORS.iron[1]);
  paint.rect(8, 9 + settle, 8, 7, COLORS.iron[0]);
  paint.rect(9, 11 + settle, 6, 4, COLORS.tabard[1]);
  paint.pixel(12, 10 + settle, COLORS.brass[1]);
  paint.rect(5, 7 + settle, 5, 4, COLORS.iron[0]);
  paint.pixel(5, 7 + settle, COLORS.rust[0]);
  paint.rect(14, 7 + settle, 6, 4, COLORS.iron[1]);
  paint.pixel(19, 8 + settle, COLORS.rust[1]);
  drawFrontArmsAndBlade(paint, phase, true);
  paint.rect(9, 3 + settle, 7, 7, COLORS.iron[1]);
  paint.rect(10, 4 + settle, 5, 5, COLORS.iron[0]);
  paint.rect(10, 8 + settle, 5, 2, COLORS.rust[1]);
  paint.rect(10, 2 + settle, 5, 2, COLORS.iron[0]);
  paint.rect(11, 1 + settle, 2, 2, COLORS.rust[0]);
  paint.pixel(14, 2 + settle, COLORS.rust[1]);
  paint.pixel(12, 6 + settle, COLORS.brass[1]);
}

function drawSideLegs(paint, phase) {
  const farX = 9 + (phase.stride < 0 ? -1 : phase.stride > 0 ? 1 : 0);
  const nearX = 14 + (phase.stride > 0 ? 1 : phase.stride < 0 ? -1 : 0);
  const farLift = phase.stride > 0 ? 1 : 0;
  const nearLift = phase.stride < 0 ? 1 : 0;
  paint.rect(farX, 17 + phase.crouch + farLift, 3, 4 - farLift, COLORS.iron[1]);
  paint.rect(nearX, 17 + phase.crouch + nearLift, 3, 4 - nearLift, COLORS.iron[0]);
  paint.rect(farX - 1, 20 + farLift, 4, 2, COLORS.rust[1]);
  paint.rect(nearX, 20 + nearLift, 4, 2, COLORS.rust[0]);
}

function drawSideArmsAndBlade(paint, phase) {
  if (phase.pose === 'hoist') {
    paint.rect(8, 10, 5, 4, COLORS.iron[1]);
    paint.rect(7, 13, 4, 3, COLORS.bone[1]);
    paint.rect(15, 8, 5, 4, COLORS.iron[0]);
    paint.rect(18, 6, 3, 4, COLORS.bone[0]);
    paint.rect(18, 7, 4, 2, COLORS.rust[0]);
    paint.rect(19, 3, 3, 5, COLORS.blade[1]);
    paint.rect(20, 2, 2, 4, COLORS.blade[0]);
    paint.pixel(21, 1, COLORS.rust[1]);
    return;
  }
  if (phase.pose === 'cleave') {
    paint.rect(8, 11, 5, 4, COLORS.iron[1]);
    paint.rect(7, 14, 4, 3, COLORS.bone[1]);
    paint.rect(14, 9, 5, 4, COLORS.iron[0]);
    paint.rect(17, 11, 4, 3, COLORS.bone[0]);
    paint.rect(18, 10, 4, 2, COLORS.rust[0]);
    paint.rect(18, 11, 5, 2, COLORS.blade[0]);
    paint.rect(17, 12, 5, 2, COLORS.blade[1]);
    paint.pixel(22, 11, COLORS.rust[1]);
    return;
  }
  if (phase.pose === 'recoil') {
    paint.rect(8, 9, 5, 4, COLORS.iron[1]);
    paint.rect(6, 12, 4, 4, COLORS.bone[1]);
    paint.rect(15, 10, 5, 4, COLORS.iron[0]);
    paint.rect(18, 13, 3, 4, COLORS.bone[0]);
    paint.rect(4, 14, 5, 2, COLORS.blade[1]);
    paint.rect(3, 15, 4, 2, COLORS.blade[0]);
    return;
  }
  const drag = phase.pose === 'drag' || phase.pose === 'recover';
  const farY = 11 + phase.bob + (phase.swing > 0 ? -1 : 0);
  const nearY = 10 + phase.bob + (phase.swing < 0 ? -1 : 0);
  paint.rect(8, farY, 5, 4, COLORS.iron[1]);
  paint.rect(7, farY + 3, 3, 4, COLORS.bone[1]);
  paint.rect(15, nearY, 5, 4, COLORS.iron[0]);
  paint.rect(18, nearY + 3, 3, 4, COLORS.bone[0]);
  paint.rect(18, nearY + 4, 4, 2, COLORS.rust[0]);
  if (drag) {
    paint.rect(20, nearY + 5, 2, 7, COLORS.blade[1]);
    paint.rect(19, nearY + 9, 3, 3, COLORS.blade[0]);
    paint.pixel(19, nearY + 11, COLORS.rust[1]);
  } else {
    paint.rect(21, 8 + phase.crouch, 2, 12, COLORS.blade[1]);
    paint.rect(20, 9 + phase.crouch, 2, 8, COLORS.blade[0]);
    paint.pixel(21, 7 + phase.crouch, COLORS.rust[1]);
    paint.pixel(22, 20, COLORS.rust[0]);
  }
}

function drawRight(context, phase) {
  const paint = painter(context, phase);
  const settle = phase.bob + phase.crouch;
  drawSideLegs(paint, phase);
  const tabardBack = phase.tabard < 0 ? 7 : 8;
  paint.rect(tabardBack, 13 + phase.crouch, 10, 6, COLORS.tabard[1]);
  paint.rect(11, 14 + phase.crouch, 6, 6, COLORS.tabard[0]);
  paint.pixel(tabardBack, 19 + phase.crouch, COLORS.rust[1]);
  paint.rect(8, 8 + settle, 10, 9, COLORS.iron[1]);
  paint.rect(10, 9 + settle, 8, 7, COLORS.iron[0]);
  paint.rect(11, 11 + settle, 6, 4, COLORS.tabard[0]);
  paint.pixel(15, 10 + settle, COLORS.brass[0]);
  paint.rect(7, 7 + settle, 5, 4, COLORS.iron[1]);
  paint.pixel(7, 7 + settle, COLORS.rust[1]);
  paint.rect(14, 7 + settle, 6, 4, COLORS.iron[0]);
  paint.pixel(19, 8 + settle, COLORS.rust[0]);
  drawSideArmsAndBlade(paint, phase);
  const headX = 13 + phase.reach;
  paint.rect(headX, 3 + settle, 7, 7, COLORS.iron[1]);
  paint.rect(headX + 2, 4 + settle, 5, 5, COLORS.cavity);
  paint.rect(headX + 2, 8 + settle, 5, 2, COLORS.bone[1]);
  paint.rect(headX + 1, 2 + settle, 5, 2, COLORS.iron[0]);
  paint.rect(headX + 2, 1 + settle, 2, 2, COLORS.rust[0]);
  paint.pixel(headX + 5, 2 + settle, COLORS.rust[1]);
  paint.pixel(headX + 5, 6 + settle, COLORS.eye);
  paint.pixel(headX + 4, 9 + settle, COLORS.brass[1]);
}

export function renderEnE05RevenantFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Revenant rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), `Unsupported Revenant direction ${direction}.`);
  const phase = phaseFor(animation, frame);
  assert(phase, `Revenant animation ${animation} frame ${frame} is out of range.`);
  context.clearRect(0, 0, SIZE, SIZE);
  if (direction === 'down') drawDown(context, phase);
  else if (direction === 'up') drawUp(context, phase);
  else if (direction === 'right') drawRight(context, phase);
  else drawRight(mirroredContext(context), phase);
  return Object.freeze({
    family: 'revenant',
    variant: 'grave-oathkeeper',
    direction,
    animation,
    frame,
    phase: phase.name,
    effectBoundary: EN_E05_REVENANT_DATA.effectBoundary,
  });
}

export const EN_E05_REVENANT_RENDERER = deepFreeze({
  key: 'en-e05-revenant-grave-oathkeeper-v1',
  chassis: EN_E05_REVENANT_CONTRACT.chassis,
  render({ direction, animation, frame, context }) {
    return renderEnE05RevenantFrame(context, direction, animation.id, frame);
  },
});

export const EN_E05_REVENANT_FAMILY = deepFreeze({
  id: 'revenant',
  name: 'Revenant Review',
  sliceId: 'EN-E05',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E05_REVENANT_CONTRACT.chassis,
  rendererKey: EN_E05_REVENANT_RENDERER.key,
  variants: [REVENANT_GRAVE_OATHKEEPER_VARIANT],
  review: {
    baselineVariant: 'grave-oathkeeper',
    scale: 8,
    notes: 'Review the complete Grave Oathkeeper suite beside the approved Vampire before any Revenant registration, fixture generation, or Lich work.',
  },
});

export const EN_E05_REVENANT_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E05_REVENANT_RENDERER],
  families: [EN_E05_REVENANT_FAMILY],
});
