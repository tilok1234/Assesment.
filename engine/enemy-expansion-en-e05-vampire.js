import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E05_MUMMY_GATE } from './enemy-expansion-en-e05-mummy.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E05_VAMPIRE_CONTRACT = deepFreeze({
  sliceId: 'EN-E05',
  family: 'vampire',
  variant: 'night-noble',
  role: 'common',
  state: 'implemented-complete-motion-candidate',
  chassis: 'high-collared-night-undead',
  silhouette: 'An upright widow-peaked head, tall connected wing collar, narrow formal shoulders, one poised claw arm, one cape-guard arm, fitted waist, split tailcoat, connected cape hem, and long booted legs create an aristocratic Vampire silhouette. Every frame remains one connected hard-alpha actor with one-cell margins.',
  identity: 'Pallid rose-gray skin, black-violet hair and coat, blood-crimson collar and cape lining, ivory shirt, antique-gold clasp, and two ember-red eyes distinguish the Night Noble from the approved wrapped Mummy and feral Ghoul.',
  effectBoundary: 'Bat swarms, blood spray, charm motes, shadow mist, teleport afterimages, red auras, projectiles, bite impacts, and ground fog remain external.',
});

export const EN_E05_VAMPIRE_GATE = deepFreeze({
  id: 'en-e05-vampire-night-noble-full-v1',
  status: 'acceptance-candidate',
  authorizedOn: '2026-08-09',
  authorizationEvidence: 'After reviewing the complete Mummy, the designer replied: lets do nextg. In its direct approval context this authorized Mummy publication followed by one separate complete Vampire candidate under the one-full-sprite cadence.',
  precedingApproval: {
    gateId: EN_E05_MUMMY_GATE.id,
    artifactSha256: EN_E05_MUMMY_GATE.artifactSha256,
    assembledArtifactSha256: EN_E05_MUMMY_GATE.assembledArtifactSha256,
    rawAnimationSha256: EN_E05_MUMMY_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E05_MUMMY_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E05_MUMMY_GATE.candidateFrameDigest,
    publishedImplementation: '85f1ed77b34d7aa300e6ef7454b85f5295ad1da1',
    publishedHandoff: '3387bf2fd465e6e861450ba6e69ed2de31fd45ad',
  },
  artifact: 'enemy-expansion-review/en-e05-vampire/en-e05-vampire-night-noble-full-suite-raw.png',
  artifactSha256: '25a6944fa51889c6a09735ef47530a31591610b3c4ef4260aa88318d42d6239e',
  assembledArtifact: 'enemy-expansion-review/en-e05-vampire/en-e05-vampire-night-noble-full-suite-complete-b-form.png',
  assembledArtifactSha256: '02bb524d6ef49a52026037a7f5ef1faf66d0f987c7e792c3b0599d7eb79776d0',
  comparisonArtifact: 'enemy-expansion-review/en-e05-vampire/en-e05-vampire-mummy-comparison.png',
  comparisonArtifactSha256: '2862b5d4601eaef873a723100f5b462db1d6d0714fdf61b974bb2bc1b3c4fcb8',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e05-vampire/en-e05-vampire-night-noble-full-suite-four-directions-labeled.gif',
      sha256: '7075df50690e8a00ed5f599a4b28f9095d5f010708d2dff269b9d4b5ed691101',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e05-vampire/en-e05-vampire-night-noble-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: 'd7c01c725c8d91896791bbe3a0144f597f27827e4f856824023f4dfcd0f69b22',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
  },
  candidateFrameDigest: 'b3943802e450e454d707f118a58fb81cdf43b3869d02da999b7232d8a0aab4ba',
  mummyComparisonDigest: EN_E05_MUMMY_GATE.candidateFrameDigest,
  scope: 'One complete 80-frame Vampire Night Noble common enemy across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle uses a controlled breath and cape pulse. Walk is a four-step predatory glide with alternating formal steps and coat tails. Attack coils behind the cape, raises both claws in a collar flare, lunges with one long rake, and recovers through the whole silhouette. Hurt uses a complete white recoil and colored composure. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact approved-Mummy versus Vampire comparison plus the labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards and GIFs together.',
  exclusions: [
    'approved Mummy source module or pixels',
    'approved Ghoul source module or pixels',
    'public Vampire registration',
    'public catalog exposure',
    'asset-pack fixture generation or regeneration',
    'additional Vampire variants',
    'new Cast pixels',
    'new Death pixels',
    'bat swarms',
    'blood spray',
    'charm motes',
    'shadow mist',
    'teleport afterimages',
    'red auras',
    'projectiles',
    'bite impacts',
    'ground fog',
    'effects',
    'release',
    'Revenant',
    'Lich',
    'later EN-E05 work',
  ],
  nextGate: 'Stop for explicit designer review of the exact Mummy comparison plus raw and Complete B + Form Vampire evidence. Do not publish, register, generate fixtures, or begin Revenant before approval.',
});

const COLORS = deepFreeze({
  skin: ['#dfcec6', '#9c7f7c'],
  hair: ['#31243f', '#17131f'],
  coat: ['#493451', '#282031'],
  crimson: ['#a13b56', '#5e2338'],
  shirt: ['#eadfce', '#aea18e'],
  gold: ['#d1a24b', '#7b592d'],
  eye: '#ff4b66',
  cavity: '#2b1722',
  flash: '#f4f4f4',
});

export const EN_E05_VAMPIRE_DATA = deepFreeze({
  actor: {
    species: 'undead',
    bodyBuild: 'lean',
    skin: 'pale',
    hairStyle: 'short',
    hairColor: 'black',
    expression: 'stern',
    faceDetail: 'none',
    headgear: 'none',
    outfit: 'coat',
    outfitColor: 'crimson',
    outfitTier: 'tier2',
    weapon: 'none',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.skin,
      hair: COLORS.hair,
      outfit: [COLORS.coat[0], COLORS.coat[1], COLORS.crimson[0]],
    },
  },
  vampire: COLORS,
  effectBoundary: 'external-bat-swarms-blood-spray-charm-motes-shadow-mist-teleport-afterimages-red-auras-projectiles-bite-impacts-and-ground-fog',
  bakedEffects: [],
});

const VAMPIRE_NIGHT_NOBLE_VARIANT = deepFreeze({
  id: 'night-noble',
  name: 'Night Noble',
  role: EN_E05_VAMPIRE_CONTRACT.role,
  status: EN_E05_VAMPIRE_CONTRACT.state,
  brief: 'A complete common Vampire: high collar, connected cape and tailcoat, pallid formal anatomy, ember eyes, poised claws, and one full standard motion suite.',
  rendererData: EN_E05_VAMPIRE_DATA,
});

export const EN_E05_VAMPIRE_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'courtly-stillness', bob: 0, stride: 0, swing: 0, reach: 0, crouch: 0, cape: 0, pose: 'guard', flash: false },
  { name: 'cape-pulse', bob: 1, stride: 0, swing: 1, reach: 0, crouch: 0, cape: 1, pose: 'guard', flash: false },
]);

const WALK_PHASES = deepFreeze([
  { name: 'left-formal-step', bob: 0, stride: -1, swing: 1, reach: 0, crouch: 0, cape: -1, pose: 'guard', flash: false },
  { name: 'shadow-compress', bob: 1, stride: 0, swing: 0, reach: 0, crouch: 1, cape: 0, pose: 'guard', flash: false },
  { name: 'right-formal-step', bob: 0, stride: 1, swing: -1, reach: 0, crouch: 0, cape: 1, pose: 'guard', flash: false },
  { name: 'tailcoat-glide', bob: 1, stride: 0, swing: 1, reach: 0, crouch: 0, cape: 1, pose: 'drift', flash: false },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'predatory-cape-coil', bob: 1, stride: 0, swing: -1, reach: 0, crouch: 1, cape: -1, pose: 'coil', flash: false },
  { name: 'high-collar-claw-flare', bob: 0, stride: -1, swing: 1, reach: 0, crouch: 0, cape: 1, pose: 'flare', flash: false },
  { name: 'long-night-rake', bob: 0, stride: 1, swing: 2, reach: 1, crouch: 0, cape: 1, pose: 'lunge', flash: false },
  { name: 'aristocratic-recover', bob: 1, stride: 0, swing: 0, reach: 0, crouch: 0, cape: 0, pose: 'recover', flash: false },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-cape-recoil', bob: 0, stride: -1, swing: -1, reach: -1, crouch: 1, cape: -1, pose: 'recoil', flash: true },
  { name: 'colored-composure', bob: 1, stride: 0, swing: 1, reach: 0, crouch: 1, cape: 1, pose: 'brace', flash: false },
]);

function phaseFor(animation, frame) {
  if (animation === 'idle') return IDLE_PHASES[frame];
  if (animation === 'walk') return WALK_PHASES[frame];
  if (animation === 'attack' || animation === 'cast') return ATTACK_PHASES[frame];
  if (animation === 'hurt') return HURT_PHASES[frame];
  if (animation === 'death') return HURT_PHASES[EN_E05_VAMPIRE_DEATH_SOURCE_FRAMES[frame]];
  throw new TypeError(`Unsupported Vampire animation ${animation}.`);
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

function drawClawHand(paint, x, y, facing, light = true) {
  paint.rect(x, y, 2, 2, light ? COLORS.skin[0] : COLORS.skin[1]);
  paint.pixel(x + facing, y + 1, COLORS.shirt[0]);
  paint.pixel(x + facing, y + 2, COLORS.skin[0]);
  paint.pixel(x, y + 2, COLORS.skin[1]);
}

function drawFrontLegs(paint, phase) {
  const leftX = 9 + (phase.stride < 0 ? -1 : phase.stride > 0 ? 1 : 0);
  const rightX = 13 + (phase.stride > 0 ? 1 : phase.stride < 0 ? -1 : 0);
  const leftLift = phase.stride > 0 ? 1 : 0;
  const rightLift = phase.stride < 0 ? 1 : 0;
  paint.rect(leftX, 17 + phase.crouch + leftLift, 2, 4 - leftLift, COLORS.coat[1]);
  paint.rect(rightX, 17 + phase.crouch + rightLift, 2, 4 - rightLift, COLORS.coat[0]);
  paint.rect(leftX - 1, 20 + leftLift, 3, 2, COLORS.hair[1]);
  paint.rect(rightX, 20 + rightLift, 4, 2, COLORS.hair[0]);
  paint.pixel(rightX + 3, 21 + rightLift, COLORS.crimson[1]);
}

function drawFrontArms(paint, phase, rear = false) {
  const nearSkin = rear ? COLORS.skin[1] : COLORS.skin[0];
  if (phase.pose === 'flare') {
    paint.rect(5, 8, 4, 3, COLORS.coat[0]);
    paint.rect(3, 6, 4, 3, COLORS.crimson[0]);
    paint.rect(2, 5, 3, 3, nearSkin);
    drawClawHand(paint, 2, 3, -1, !rear);
    paint.rect(15, 8, 4, 3, COLORS.coat[1]);
    paint.rect(17, 6, 4, 3, COLORS.crimson[1]);
    paint.rect(19, 5, 3, 3, COLORS.skin[1]);
    drawClawHand(paint, 20, 3, 1, false);
    return;
  }
  if (phase.pose === 'lunge') {
    paint.rect(6, 10, 4, 3, COLORS.coat[0]);
    paint.rect(7, 12, 3, 5, nearSkin);
    paint.rect(7, 14, 3, 1, COLORS.shirt[0]);
    drawClawHand(paint, 7, 16, -1, !rear);
    paint.rect(14, 10, 4, 3, COLORS.coat[1]);
    paint.rect(14, 12, 3, 5, COLORS.skin[1]);
    paint.rect(14, 14, 3, 1, COLORS.shirt[1]);
    drawClawHand(paint, 15, 16, 1, false);
    return;
  }
  const coil = phase.pose === 'coil' || phase.pose === 'recoil';
  const leftY = 10 + phase.bob + (phase.swing > 0 ? -1 : 0) + (coil ? 1 : 0);
  const rightY = 10 + phase.bob + (phase.swing < 0 ? -1 : 0);
  paint.rect(5, leftY, 4, 3, COLORS.coat[0]);
  paint.rect(4, leftY + 2, 3, 5, nearSkin);
  paint.rect(4, leftY + 3, 3, 1, COLORS.shirt[0]);
  drawClawHand(paint, 3, leftY + 6, -1, !rear);
  paint.rect(15, rightY, 4, 3, COLORS.coat[1]);
  paint.rect(17, rightY + 2, 3, 5, COLORS.skin[1]);
  paint.rect(17, rightY + 4, 3, 1, COLORS.shirt[1]);
  drawClawHand(paint, 19, rightY + 6, 1, false);
}

function drawDown(context, phase) {
  const paint = painter(context, phase);
  const settle = phase.bob + phase.crouch;
  drawFrontLegs(paint, phase);
  const leftTail = phase.cape < 0 ? 7 : 8;
  const rightTail = phase.cape > 0 ? 17 : 16;
  paint.rect(leftTail, 14 + phase.crouch, rightTail - leftTail + 1, 4, COLORS.coat[1]);
  paint.rect(8, 17 + phase.crouch, 4, 3, COLORS.crimson[1]);
  paint.rect(13, 17 + phase.crouch, 4, 3, COLORS.coat[0]);
  paint.pixel(8, 19 + phase.crouch, COLORS.crimson[0]);
  paint.pixel(16, 19 + phase.crouch, COLORS.crimson[1]);
  paint.rect(6, 8 + settle, 12, 9, COLORS.coat[1]);
  paint.rect(8, 9 + settle, 8, 7, COLORS.coat[0]);
  paint.rect(9, 9 + settle, 6, 5, COLORS.shirt[0]);
  paint.rect(8, 13 + settle, 8, 3, COLORS.crimson[1]);
  paint.pixel(12, 11 + settle, COLORS.gold[0]);
  paint.pixel(12, 12 + settle, COLORS.gold[1]);
  paint.rect(6, 7 + settle, 4, 4, COLORS.crimson[0]);
  paint.rect(14, 7 + settle, 4, 4, COLORS.crimson[1]);
  drawFrontArms(paint, phase);
  paint.rect(9, 3 + settle, 6, 7, COLORS.skin[0]);
  paint.pixel(8, 5 + settle, COLORS.skin[1]);
  paint.pixel(15, 5 + settle, COLORS.skin[1]);
  paint.rect(9, 3 + settle, 6, 2, COLORS.hair[0]);
  paint.rect(10, 2 + settle, 4, 2, COLORS.hair[1]);
  paint.pixel(12, 4 + settle, COLORS.hair[1]);
  paint.pixel(10, 6 + settle, COLORS.eye);
  paint.pixel(14, 6 + settle, COLORS.eye);
  paint.rect(11, 8 + settle, 3, 1, COLORS.cavity);
  paint.pixel(11, 9 + settle, COLORS.shirt[0]);
  paint.pixel(13, 9 + settle, COLORS.shirt[0]);
}

function drawUp(context, phase) {
  const paint = painter(context, phase);
  const settle = phase.bob + phase.crouch;
  drawFrontLegs(paint, phase);
  const leftTail = phase.cape < 0 ? 7 : 8;
  const rightTail = phase.cape > 0 ? 17 : 16;
  paint.rect(leftTail, 14 + phase.crouch, rightTail - leftTail + 1, 5, COLORS.coat[1]);
  paint.rect(8, 16 + phase.crouch, 4, 4, COLORS.coat[0]);
  paint.rect(13, 16 + phase.crouch, 4, 4, COLORS.crimson[1]);
  paint.rect(6, 8 + settle, 12, 9, COLORS.coat[1]);
  paint.rect(8, 9 + settle, 8, 7, COLORS.coat[0]);
  paint.rect(7, 9 + settle, 10, 3, COLORS.crimson[1]);
  paint.rect(9, 12 + settle, 6, 3, COLORS.coat[1]);
  paint.pixel(12, 11 + settle, COLORS.gold[1]);
  paint.rect(6, 7 + settle, 4, 4, COLORS.crimson[0]);
  paint.rect(14, 7 + settle, 4, 4, COLORS.crimson[1]);
  drawFrontArms(paint, phase, true);
  paint.rect(9, 3 + settle, 6, 7, COLORS.hair[0]);
  paint.rect(10, 2 + settle, 4, 2, COLORS.hair[1]);
  paint.pixel(8, 5 + settle, COLORS.hair[1]);
  paint.pixel(15, 5 + settle, COLORS.hair[1]);
  paint.rect(10, 5 + settle, 4, 4, COLORS.skin[1]);
  paint.rect(10, 8 + settle, 4, 2, COLORS.hair[1]);
  paint.pixel(12, 4 + settle, COLORS.crimson[1]);
}

function drawSideLegs(paint, phase) {
  const farX = 10 + (phase.stride < 0 ? -1 : phase.stride > 0 ? 1 : 0);
  const nearX = 14 + (phase.stride > 0 ? 1 : phase.stride < 0 ? -1 : 0);
  const farLift = phase.stride > 0 ? 1 : 0;
  const nearLift = phase.stride < 0 ? 1 : 0;
  paint.rect(farX, 17 + phase.crouch + farLift, 2, 4 - farLift, COLORS.coat[1]);
  paint.rect(nearX, 17 + phase.crouch + nearLift, 2, 4 - nearLift, COLORS.coat[0]);
  paint.rect(farX - 1, 20 + farLift, 3, 2, COLORS.hair[1]);
  paint.rect(nearX, 20 + nearLift, 4, 2, COLORS.hair[0]);
}

function drawSideArms(paint, phase) {
  if (phase.pose === 'flare') {
    paint.rect(10, 8, 4, 3, COLORS.coat[1]);
    paint.rect(8, 6, 4, 3, COLORS.crimson[1]);
    drawClawHand(paint, 7, 4, -1, false);
    paint.rect(15, 8, 4, 3, COLORS.coat[0]);
    paint.rect(18, 6, 3, 3, COLORS.crimson[0]);
    drawClawHand(paint, 20, 4, 1, true);
    return;
  }
  if (phase.pose === 'lunge') {
    paint.rect(9, 11, 4, 3, COLORS.coat[1]);
    paint.rect(7, 13, 4, 3, COLORS.skin[1]);
    drawClawHand(paint, 6, 14, -1, false);
    paint.rect(15, 10, 4, 3, COLORS.coat[0]);
    paint.rect(18, 11, 4, 3, COLORS.skin[0]);
    paint.rect(18, 12, 4, 1, COLORS.shirt[0]);
    drawClawHand(paint, 21, 12, 1, true);
    return;
  }
  const coil = phase.pose === 'coil' || phase.pose === 'recoil';
  const farY = 11 + phase.bob + (phase.swing > 0 ? -1 : 0) + (coil ? 1 : 0);
  const nearY = 10 + phase.bob + (phase.swing < 0 ? -1 : 0);
  paint.rect(9, farY, 4, 3, COLORS.coat[1]);
  paint.rect(7, farY + 2, 3, 5, COLORS.skin[1]);
  paint.rect(7, farY + 4, 3, 1, COLORS.shirt[1]);
  drawClawHand(paint, 6, farY + 6, -1, false);
  paint.rect(15, nearY, 4, 3, COLORS.coat[0]);
  paint.rect(18, nearY + 2, 3, 5, COLORS.skin[0]);
  paint.rect(18, nearY + 3, 3, 1, COLORS.shirt[0]);
  drawClawHand(paint, 20, nearY + 6, 1, true);
}

function drawRight(context, phase) {
  const paint = painter(context, phase);
  const settle = phase.bob + phase.crouch;
  drawSideLegs(paint, phase);
  const capeBack = phase.cape < 0 ? 6 : 7;
  paint.rect(capeBack, 10 + settle, 10, 9, COLORS.coat[1]);
  paint.rect(capeBack, 14 + settle, 5, 6, COLORS.crimson[1]);
  paint.pixel(capeBack - 1, 18 + settle, COLORS.crimson[0]);
  paint.rect(10, 9 + settle, 8, 8, COLORS.coat[0]);
  paint.rect(12, 9 + settle, 5, 5, COLORS.shirt[0]);
  paint.rect(11, 13 + settle, 7, 3, COLORS.crimson[1]);
  paint.rect(9, 7 + settle, 4, 4, COLORS.crimson[1]);
  paint.rect(15, 7 + settle, 4, 4, COLORS.crimson[0]);
  drawSideArms(paint, phase);
  paint.pixel(14, 11 + settle, COLORS.gold[0]);
  const headX = 13 + phase.reach;
  paint.rect(headX, 3 + settle, 6, 7, COLORS.skin[0]);
  paint.pixel(headX - 1, 5 + settle, COLORS.skin[1]);
  paint.rect(headX - 1, 3 + settle, 6, 2, COLORS.hair[0]);
  paint.rect(headX, 2 + settle, 4, 2, COLORS.hair[1]);
  paint.pixel(headX + 2, 4 + settle, COLORS.hair[1]);
  paint.pixel(headX + 4, 6 + settle, COLORS.eye);
  paint.rect(headX + 3, 8 + settle, 3, 1, COLORS.cavity);
  paint.pixel(headX + 4, 9 + settle, COLORS.shirt[0]);
}

export function renderEnE05VampireFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Vampire rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), `Unsupported Vampire direction ${direction}.`);
  const phase = phaseFor(animation, frame);
  assert(phase, `Vampire animation ${animation} frame ${frame} is out of range.`);
  context.clearRect(0, 0, SIZE, SIZE);
  if (direction === 'down') drawDown(context, phase);
  else if (direction === 'up') drawUp(context, phase);
  else if (direction === 'right') drawRight(context, phase);
  else drawRight(mirroredContext(context), phase);
  return Object.freeze({
    family: 'vampire',
    variant: 'night-noble',
    direction,
    animation,
    frame,
    phase: phase.name,
    effectBoundary: EN_E05_VAMPIRE_DATA.effectBoundary,
  });
}

export const EN_E05_VAMPIRE_RENDERER = deepFreeze({
  key: 'en-e05-vampire-night-noble-v1',
  chassis: EN_E05_VAMPIRE_CONTRACT.chassis,
  render({ direction, animation, frame, context }) {
    return renderEnE05VampireFrame(context, direction, animation.id, frame);
  },
});

export const EN_E05_VAMPIRE_FAMILY = deepFreeze({
  id: 'vampire',
  name: 'Vampire Review',
  sliceId: 'EN-E05',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E05_VAMPIRE_CONTRACT.chassis,
  rendererKey: EN_E05_VAMPIRE_RENDERER.key,
  variants: [VAMPIRE_NIGHT_NOBLE_VARIANT],
  review: {
    baselineVariant: 'night-noble',
    scale: 8,
    notes: 'Review the complete Night Noble suite beside the approved Mummy before any Vampire registration, fixture generation, or later EN-E05 work.',
  },
});

export const EN_E05_VAMPIRE_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E05_VAMPIRE_RENDERER],
  families: [EN_E05_VAMPIRE_FAMILY],
});
