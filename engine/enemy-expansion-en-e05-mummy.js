import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E05_GHOUL_UPGRADE_GATE } from './enemy-expansion-en-e05-ghoul-upgrade.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E05_MUMMY_CONTRACT = deepFreeze({
  sliceId: 'EN-E05',
  family: 'mummy',
  variant: 'tomb-walker',
  role: 'common',
  state: 'implemented-complete-motion-candidate',
  chassis: 'wrapped-tomb-undead',
  silhouette: 'A tall coffin-stiff wrapped head, asymmetric shoulder shelf, one reaching arm, one crooked guard arm, narrow bound waist, connected torn linen skirt, dragging block feet, and attached bandage tails create a distinct Mummy silhouette. Every frame remains one connected hard-alpha actor with one-cell margins.',
  identity: 'Sun-bleached ivory and papyrus linen, sepia shadow wraps, exposed embalmed umber flesh, black tomb cavities, aged-gold bindings, and turquoise curse eyes distinguish the Tomb Walker from the approved feral Ghoul.',
  effectBoundary: 'Sand wakes, curse wisps, detached wrap ribbons, scarab swarms, dust clouds, impact bursts, tomb glyphs, and necrotic auras remain external.',
});

export const EN_E05_MUMMY_GATE = deepFreeze({
  id: 'en-e05-mummy-tomb-walker-full-v1',
  status: 'approved',
  authorizedOn: '2026-08-09',
  authorizationEvidence: 'After approving and publishing the complete Ghoul upgrade, the designer said: lets do next. The live EN-E05 priority order advances from Ghoul to Mummy, and the established cadence authorizes one full sprite with all animations in this run.',
  approvedOn: '2026-08-09',
  approvalEvidence: 'After the exact approved-Ghoul comparison plus labeled all-four-direction raw/no-outline and Complete B + Form Mummy boards and GIFs were presented together, the designer replied: lets do nextg. In the direct response to the approval request, this is treated as lets do next: approval of the frozen Mummy and authorization to publish it before starting one separate Vampire candidate.',
  precedingApproval: {
    gateId: EN_E05_GHOUL_UPGRADE_GATE.id,
    artifactSha256: EN_E05_GHOUL_UPGRADE_GATE.artifactSha256,
    assembledArtifactSha256: EN_E05_GHOUL_UPGRADE_GATE.assembledArtifactSha256,
    rawAnimationSha256: EN_E05_GHOUL_UPGRADE_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E05_GHOUL_UPGRADE_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E05_GHOUL_UPGRADE_GATE.candidateFrameDigest,
    publishedImplementation: '88d32e951441b9ce8f89eb6e3ab279bfc037a497',
    publishedHandoff: '1aa733c1cd47c60538e9fa8ff621987867e451e3',
  },
  artifact: 'enemy-expansion-review/en-e05-mummy/en-e05-mummy-tomb-walker-full-suite-raw.png',
  artifactSha256: '6d652c60c88c8b892eaf6c6f70db03c1f1642f2df8ba35aa2a68c2b1645d891f',
  assembledArtifact: 'enemy-expansion-review/en-e05-mummy/en-e05-mummy-tomb-walker-full-suite-complete-b-form.png',
  assembledArtifactSha256: '67e36714906f6898381e74504b2e97ac2873e76828adc30b9b683ac0493aad3a',
  comparisonArtifact: 'enemy-expansion-review/en-e05-mummy/en-e05-mummy-ghoul-comparison.png',
  comparisonArtifactSha256: '0ccf489dfa662e9d61f9d2adc19d5de342ccedff12d37a6fd99cfd0e629c2ab4',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e05-mummy/en-e05-mummy-tomb-walker-full-suite-four-directions-labeled.gif',
      sha256: 'df6e0a9319e510049f6e6fa11f267cbd42980fb45a3f8c1147c95a869e3fd194',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e05-mummy/en-e05-mummy-tomb-walker-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '72279b6d39630d67264a901e9835013ba99470af3c139296ac28d56c68440b04',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
  },
  candidateFrameDigest: '321c5c7f05a55a6502b03d3876521c3b799c8156c2197efc3833c4af68a556fd',
  ghoulComparisonDigest: EN_E05_GHOUL_UPGRADE_GATE.candidateFrameDigest,
  scope: 'One complete 80-frame Mummy Tomb Walker common enemy across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle uses a rigid tomb sway and linen settle. Walk is a four-step stiff drag with alternating bound arms and feet. Attack coils the wraps, raises both arms, drives a two-handed curse grasp, and recovers through the whole silhouette. Hurt uses a complete white recoil and colored rebind. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact approved-Ghoul versus Mummy comparison plus the labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards and GIFs together.',
  exclusions: [
    'approved Ghoul source module or pixels',
    'public Mummy registration',
    'public catalog exposure',
    'asset-pack fixture generation or regeneration',
    'additional Mummy variants',
    'new Cast pixels',
    'new Death pixels',
    'detached wrap ribbons',
    'sand wakes',
    'curse wisps',
    'scarab swarms',
    'dust clouds',
    'impact bursts',
    'tomb glyphs',
    'necrotic auras',
    'effects',
    'release',
    'Vampire in this approval-publication lane',
    'Revenant',
    'Lich',
    'later EN-E05 work',
  ],
  nextGate: 'Bounded commit, push, and publication of this exact ten-file approved Mummy lane are authorized. After clean publication, one separate complete Vampire candidate may begin; Mummy registration and fixture generation remain separate gates.',
});

const COLORS = deepFreeze({
  linen: ['#e7d9ad', '#b9a77a', '#7d6b4d'],
  flesh: ['#80634d', '#4b382e'],
  cavity: '#211c1a',
  eye: '#63dfc0',
  curse: '#249f8a',
  gold: ['#b88a3d', '#70512b'],
  flash: '#f4f4f4',
});

export const EN_E05_MUMMY_DATA = deepFreeze({
  actor: {
    species: 'undead',
    bodyBuild: 'lean',
    skin: 'tan',
    hairStyle: 'bald',
    hairColor: 'brown',
    expression: 'stern',
    faceDetail: 'none',
    headgear: 'hood',
    outfit: 'robe',
    outfitColor: 'sand',
    outfitTier: 'tier1',
    weapon: 'none',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.flesh,
      hair: [COLORS.cavity, COLORS.linen[2]],
      outfit: COLORS.linen,
    },
  },
  mummy: COLORS,
  effectBoundary: 'external-sand-wakes-curse-wisps-detached-wrap-ribbons-scarab-swarms-dust-clouds-impacts-tomb-glyphs-and-necrotic-auras',
  bakedEffects: [],
});

const MUMMY_TOMB_WALKER_VARIANT = deepFreeze({
  id: 'tomb-walker',
  name: 'Tomb Walker',
  role: EN_E05_MUMMY_CONTRACT.role,
  status: EN_E05_MUMMY_CONTRACT.state,
  brief: 'A complete common Mummy: coffin-stiff posture, layered attached wrappings, embalmed gaps, curse eyes, dragging feet, and one full standard motion suite.',
  rendererData: EN_E05_MUMMY_DATA,
});

export const EN_E05_MUMMY_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'sealed-tomb-stillness', bob: 0, stride: 0, swing: 0, reach: 0, crouch: 0, pose: 'guard', flash: false },
  { name: 'linen-sway', bob: 1, stride: 0, swing: 1, reach: 0, crouch: 0, pose: 'guard', flash: false },
]);

const WALK_PHASES = deepFreeze([
  { name: 'left-bound-drag', bob: 0, stride: -1, swing: 1, reach: 0, crouch: 0, pose: 'guard', flash: false },
  { name: 'burial-compress', bob: 1, stride: 0, swing: 0, reach: 0, crouch: 1, pose: 'guard', flash: false },
  { name: 'right-bound-drag', bob: 0, stride: 1, swing: -1, reach: 0, crouch: 0, pose: 'guard', flash: false },
  { name: 'linen-drift-recover', bob: 1, stride: 0, swing: 1, reach: 0, crouch: 0, pose: 'drift', flash: false },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'binding-coil', bob: 1, stride: 0, swing: -1, reach: 0, crouch: 1, pose: 'coil', flash: false },
  { name: 'curse-arm-rise', bob: 0, stride: -1, swing: 1, reach: 0, crouch: 0, pose: 'raise', flash: false },
  { name: 'two-handed-tomb-grasp', bob: 0, stride: 1, swing: 2, reach: 1, crouch: 0, pose: 'grasp', flash: false },
  { name: 'wrapping-reseal', bob: 1, stride: 0, swing: 0, reach: 0, crouch: 0, pose: 'recover', flash: false },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-unbound-recoil', bob: 0, stride: -1, swing: -1, reach: -1, crouch: 1, pose: 'recoil', flash: true },
  { name: 'colored-rebind', bob: 1, stride: 0, swing: 1, reach: 0, crouch: 1, pose: 'brace', flash: false },
]);

function phaseFor(animation, frame) {
  if (animation === 'idle') return IDLE_PHASES[frame];
  if (animation === 'walk') return WALK_PHASES[frame];
  if (animation === 'attack' || animation === 'cast') return ATTACK_PHASES[frame];
  if (animation === 'hurt') return HURT_PHASES[frame];
  if (animation === 'death') return HURT_PHASES[EN_E05_MUMMY_DEATH_SOURCE_FRAMES[frame]];
  throw new TypeError(`Unsupported Mummy animation ${animation}.`);
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
      if (typeof context.onOutOfBounds === 'function') {
        context.onOutOfBounds({ ...write, x: SIZE - 1 - write.x });
      }
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

function drawWrappedHand(paint, x, y, facing, light = true) {
  paint.rect(x, y, 2, 3, light ? COLORS.flesh[0] : COLORS.flesh[1]);
  paint.pixel(x + facing, y, COLORS.linen[0]);
  paint.pixel(x + facing, y + 1, COLORS.linen[1]);
  paint.pixel(x, y + 2, COLORS.linen[2]);
}

function drawFrontLegs(paint, phase) {
  const leftX = 8 + (phase.stride < 0 ? -1 : phase.stride > 0 ? 1 : 0);
  const rightX = 13 + (phase.stride > 0 ? 1 : phase.stride < 0 ? -1 : 0);
  const leftLift = phase.stride > 0 ? 1 : 0;
  const rightLift = phase.stride < 0 ? 1 : 0;
  paint.rect(leftX, 17 + phase.crouch + leftLift, 3, 4 - leftLift, COLORS.flesh[1]);
  paint.rect(rightX, 17 + phase.crouch + rightLift, 3, 4 - rightLift, COLORS.flesh[0]);
  paint.rect(leftX, 18 + phase.crouch + leftLift, 3, 1, COLORS.linen[0]);
  paint.rect(rightX, 19 + phase.crouch + rightLift, 3, 1, COLORS.linen[1]);
  paint.rect(leftX - 1, 20 + leftLift, 4, 2, COLORS.linen[2]);
  paint.rect(rightX, 20 + rightLift, 4, 2, COLORS.linen[1]);
  paint.pixel(leftX - 1, 21 + leftLift, COLORS.flesh[1]);
  paint.pixel(rightX + 3, 21 + rightLift, COLORS.flesh[0]);
}

function drawFrontArms(paint, phase, rear = false) {
  const nearFlesh = rear ? COLORS.flesh[1] : COLORS.flesh[0];
  if (phase.pose === 'raise') {
    paint.rect(5, 8, 4, 3, COLORS.linen[1]);
    paint.rect(4, 5, 3, 4, nearFlesh);
    paint.rect(4, 6, 3, 1, COLORS.linen[0]);
    drawWrappedHand(paint, 3, 3, -1, !rear);
    paint.rect(15, 8, 4, 3, COLORS.linen[2]);
    paint.rect(17, 5, 3, 4, COLORS.flesh[1]);
    paint.rect(17, 7, 3, 1, COLORS.linen[1]);
    drawWrappedHand(paint, 19, 3, 1, false);
    return;
  }
  if (phase.pose === 'grasp') {
    paint.rect(6, 10, 4, 4, COLORS.linen[1]);
    paint.rect(7, 13, 3, 5, nearFlesh);
    paint.rect(7, 14, 3, 1, COLORS.linen[0]);
    drawWrappedHand(paint, 7, 17, -1, !rear);
    paint.rect(14, 10, 4, 4, COLORS.linen[2]);
    paint.rect(14, 13, 3, 5, COLORS.flesh[1]);
    paint.rect(14, 15, 3, 1, COLORS.linen[0]);
    drawWrappedHand(paint, 15, 17, 1, false);
    return;
  }
  const coil = phase.pose === 'coil' || phase.pose === 'recoil';
  const leftY = 10 + phase.bob + (phase.swing > 0 ? -1 : 0) + (coil ? 1 : 0);
  const rightY = 10 + phase.bob + (phase.swing < 0 ? -1 : 0);
  paint.rect(5, leftY, 4, 3, COLORS.linen[1]);
  paint.rect(4, leftY + 2, 3, 5, nearFlesh);
  paint.rect(4, leftY + 4, 3, 1, COLORS.linen[0]);
  drawWrappedHand(paint, 3, leftY + 6, -1, !rear);
  paint.rect(15, rightY, 4, 3, COLORS.linen[2]);
  paint.rect(17, rightY + 2, 3, 5, COLORS.flesh[1]);
  paint.rect(17, rightY + 3, 3, 1, COLORS.linen[1]);
  drawWrappedHand(paint, 19, rightY + 6, 1, false);
}

function drawDown(context, phase) {
  const paint = painter(context, phase);
  const settle = phase.bob + phase.crouch;
  drawFrontLegs(paint, phase);
  paint.rect(8, 15 + phase.crouch, 8, 4, COLORS.linen[2]);
  paint.rect(9, 15 + phase.crouch, 6, 1, COLORS.linen[0]);
  paint.rect(8, 17 + phase.crouch, 3, 2, COLORS.linen[1]);
  paint.pixel(15, 18 + phase.crouch, COLORS.flesh[1]);
  paint.rect(7, 9 + settle, 10, 8, COLORS.linen[1]);
  paint.rect(8, 10 + settle, 8, 6, COLORS.flesh[1]);
  paint.rect(7, 10 + settle, 10, 2, COLORS.linen[0]);
  paint.rect(8, 13 + settle, 9, 2, COLORS.linen[2]);
  paint.rect(9, 16 + settle, 6, 1, COLORS.linen[0]);
  paint.pixel(12, 12 + settle, COLORS.gold[0]);
  paint.pixel(12, 13 + settle, COLORS.curse);
  drawFrontArms(paint, phase);
  paint.rect(8, 3 + settle, 8, 7, COLORS.linen[1]);
  paint.pixel(7, 5 + settle, COLORS.linen[2]);
  paint.pixel(16, 4 + settle, COLORS.linen[0]);
  paint.rect(9, 5 + settle, 6, 4, COLORS.cavity);
  paint.rect(8, 4 + settle, 8, 1, COLORS.linen[0]);
  paint.rect(8, 8 + settle, 8, 1, COLORS.linen[2]);
  paint.rect(9, 7 + settle, 3, 1, COLORS.linen[1]);
  paint.pixel(10, 6 + settle, COLORS.eye);
  paint.pixel(14, 6 + settle, COLORS.eye);
  paint.pixel(15, 9 + settle, COLORS.gold[1]);
}

function drawUp(context, phase) {
  const paint = painter(context, phase);
  const settle = phase.bob + phase.crouch;
  drawFrontLegs(paint, phase);
  paint.rect(8, 15 + phase.crouch, 8, 4, COLORS.linen[2]);
  paint.rect(9, 15 + phase.crouch, 6, 1, COLORS.linen[0]);
  paint.rect(13, 17 + phase.crouch, 3, 2, COLORS.linen[1]);
  paint.rect(7, 9 + settle, 10, 8, COLORS.linen[1]);
  paint.rect(8, 10 + settle, 8, 6, COLORS.flesh[1]);
  paint.rect(7, 10 + settle, 10, 2, COLORS.linen[0]);
  paint.rect(8, 13 + settle, 9, 2, COLORS.linen[2]);
  paint.rect(9, 16 + settle, 6, 1, COLORS.linen[0]);
  paint.pixel(11, 12 + settle, COLORS.gold[1]);
  paint.pixel(12, 13 + settle, COLORS.gold[0]);
  drawFrontArms(paint, phase, true);
  paint.rect(8, 3 + settle, 8, 7, COLORS.linen[1]);
  paint.pixel(7, 5 + settle, COLORS.linen[2]);
  paint.pixel(16, 5 + settle, COLORS.linen[0]);
  paint.rect(9, 4 + settle, 6, 2, COLORS.linen[0]);
  paint.rect(8, 7 + settle, 8, 2, COLORS.linen[2]);
  paint.rect(10, 5 + settle, 4, 3, COLORS.flesh[1]);
  paint.pixel(11, 4 + settle, COLORS.gold[1]);
  paint.pixel(12, 5 + settle, COLORS.gold[0]);
}

function drawSideLegs(paint, phase) {
  const farX = 9 + (phase.stride < 0 ? -1 : phase.stride > 0 ? 1 : 0);
  const nearX = 14 + (phase.stride > 0 ? 1 : phase.stride < 0 ? -1 : 0);
  const farLift = phase.stride > 0 ? 1 : 0;
  const nearLift = phase.stride < 0 ? 1 : 0;
  paint.rect(farX, 17 + phase.crouch + farLift, 3, 4 - farLift, COLORS.flesh[1]);
  paint.rect(nearX, 17 + phase.crouch + nearLift, 3, 4 - nearLift, COLORS.flesh[0]);
  paint.rect(farX, 18 + phase.crouch + farLift, 3, 1, COLORS.linen[0]);
  paint.rect(nearX, 19 + phase.crouch + nearLift, 3, 1, COLORS.linen[1]);
  paint.rect(farX - 1, 20 + farLift, 4, 2, COLORS.linen[2]);
  paint.rect(nearX, 20 + nearLift, 5, 2, COLORS.linen[1]);
  paint.pixel(nearX + 4, 21 + nearLift, COLORS.flesh[0]);
}

function drawSideArms(paint, phase) {
  if (phase.pose === 'raise') {
    paint.rect(10, 9, 4, 3, COLORS.linen[2]);
    paint.rect(9, 6, 3, 4, COLORS.flesh[1]);
    paint.rect(9, 7, 3, 1, COLORS.linen[0]);
    drawWrappedHand(paint, 8, 4, -1, false);
    paint.rect(15, 8, 4, 3, COLORS.linen[1]);
    paint.rect(18, 5, 3, 4, COLORS.flesh[0]);
    paint.rect(18, 6, 3, 1, COLORS.linen[0]);
    drawWrappedHand(paint, 20, 3, 1, true);
    return;
  }
  if (phase.pose === 'grasp') {
    paint.rect(9, 11, 4, 3, COLORS.linen[2]);
    paint.rect(7, 13, 4, 3, COLORS.flesh[1]);
    paint.rect(7, 14, 4, 1, COLORS.linen[1]);
    drawWrappedHand(paint, 6, 14, -1, false);
    paint.rect(15, 10, 4, 3, COLORS.linen[1]);
    paint.rect(18, 11, 4, 3, COLORS.flesh[0]);
    paint.rect(18, 12, 4, 1, COLORS.linen[0]);
    drawWrappedHand(paint, 21, 12, 1, true);
    return;
  }
  const coil = phase.pose === 'coil' || phase.pose === 'recoil';
  const farY = 11 + phase.bob + (phase.swing > 0 ? -1 : 0) + (coil ? 1 : 0);
  const nearY = 10 + phase.bob + (phase.swing < 0 ? -1 : 0);
  paint.rect(9, farY, 4, 3, COLORS.linen[2]);
  paint.rect(7, farY + 2, 3, 5, COLORS.flesh[1]);
  paint.rect(7, farY + 4, 3, 1, COLORS.linen[1]);
  drawWrappedHand(paint, 6, farY + 6, -1, false);
  paint.rect(15, nearY, 4, 3, COLORS.linen[1]);
  paint.rect(18, nearY + 2, 3, 5, COLORS.flesh[0]);
  paint.rect(18, nearY + 3, 3, 1, COLORS.linen[0]);
  drawWrappedHand(paint, 20, nearY + 6, 1, true);
}

function drawRight(context, phase) {
  const paint = painter(context, phase);
  const settle = phase.bob + phase.crouch;
  drawSideLegs(paint, phase);
  paint.rect(9, 15 + phase.crouch, 8, 4, COLORS.linen[2]);
  paint.rect(10, 15 + phase.crouch, 6, 1, COLORS.linen[0]);
  paint.rect(9, 17 + phase.crouch, 3, 2, COLORS.linen[1]);
  paint.rect(9, 9 + settle, 9, 8, COLORS.linen[1]);
  paint.rect(10, 10 + settle, 7, 6, COLORS.flesh[1]);
  paint.rect(9, 10 + settle, 9, 2, COLORS.linen[0]);
  paint.rect(10, 13 + settle, 8, 2, COLORS.linen[2]);
  paint.rect(11, 16 + settle, 6, 1, COLORS.linen[0]);
  drawSideArms(paint, phase);
  paint.pixel(14, 12 + settle, COLORS.gold[0]);
  paint.pixel(15, 13 + settle, COLORS.curse);
  const headX = 12 + phase.reach;
  paint.rect(headX, 3 + settle, 8, 7, COLORS.linen[1]);
  paint.pixel(headX - 1, 5 + settle, COLORS.linen[2]);
  paint.pixel(headX + 8, 4 + settle, COLORS.linen[0]);
  paint.rect(headX + 2, 5 + settle, 6, 4, COLORS.cavity);
  paint.rect(headX, 4 + settle, 8, 1, COLORS.linen[0]);
  paint.rect(headX + 1, 8 + settle, 7, 1, COLORS.linen[2]);
  paint.rect(headX + 1, 7 + settle, 3, 1, COLORS.linen[1]);
  paint.pixel(headX + 5, 6 + settle, COLORS.eye);
  paint.pixel(headX, 9 + settle, COLORS.gold[1]);
}

export function renderEnE05MummyFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Mummy rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), `Unsupported Mummy direction ${direction}.`);
  const phase = phaseFor(animation, frame);
  assert(phase, `Mummy animation ${animation} frame ${frame} is out of range.`);
  context.clearRect(0, 0, SIZE, SIZE);
  if (direction === 'down') drawDown(context, phase);
  else if (direction === 'up') drawUp(context, phase);
  else if (direction === 'right') drawRight(context, phase);
  else drawRight(mirroredContext(context), phase);
  return Object.freeze({
    family: 'mummy',
    variant: 'tomb-walker',
    direction,
    animation,
    frame,
    phase: phase.name,
    effectBoundary: EN_E05_MUMMY_DATA.effectBoundary,
  });
}

export const EN_E05_MUMMY_RENDERER = deepFreeze({
  key: 'en-e05-mummy-tomb-walker-v1',
  chassis: EN_E05_MUMMY_CONTRACT.chassis,
  render({ direction, animation, frame, context }) {
    return renderEnE05MummyFrame(context, direction, animation.id, frame);
  },
});

export const EN_E05_MUMMY_FAMILY = deepFreeze({
  id: 'mummy',
  name: 'Mummy Review',
  sliceId: 'EN-E05',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E05_MUMMY_CONTRACT.chassis,
  rendererKey: EN_E05_MUMMY_RENDERER.key,
  variants: [MUMMY_TOMB_WALKER_VARIANT],
  review: {
    baselineVariant: 'tomb-walker',
    scale: 8,
    notes: 'Review the complete Tomb Walker suite beside the approved Ghoul before any Mummy registration, fixture generation, or later EN-E05 work.',
  },
});

export const EN_E05_MUMMY_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E05_MUMMY_RENDERER],
  families: [EN_E05_MUMMY_FAMILY],
});
