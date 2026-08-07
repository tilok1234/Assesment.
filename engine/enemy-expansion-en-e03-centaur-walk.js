import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E01_HUMANOID_RENDERER } from './enemy-expansion-humanoid.js';
import { EN_E03_GIANT_WALK_GATE } from './enemy-expansion-en-e03-giant-walk.js';
import { EN_E03_STEPPE_HUNTER_CALIBRATION_DATA } from './enemy-expansion-en-e03-centaur-calibration.js';
import {
  EN_E03_CENTAUR_IDLE_GATE,
  EN_E03_CENTAUR_IDLE_RENDERER,
} from './enemy-expansion-en-e03-centaur-idle.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E03_CENTAUR_WALK_GATE = deepFreeze({
  id: 'en-e03-steppe-hunter-walk-v1',
  status: 'approved',
  authorizedOn: '2026-08-06',
  authorizationEvidence: 'Designer approved the exact Hill Breaker Walk boards with: yes sir seems fine to me approved, and authorized the next bounded Steppe Hunter Walk gate.',
  approvedOn: '2026-08-06',
  approvalEvidence: 'Designer reviewed the exact raw and Complete B + Form Steppe Hunter Walk animations and said: approved.',
  precedingApproval: {
    gateId: EN_E03_GIANT_WALK_GATE.id,
    artifactSha256: EN_E03_GIANT_WALK_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_GIANT_WALK_GATE.assembledArtifactSha256,
    candidateFrameDigest: EN_E03_GIANT_WALK_GATE.candidateFrameDigest,
  },
  approvedIdle: {
    gateId: EN_E03_CENTAUR_IDLE_GATE.id,
    artifactSha256: EN_E03_CENTAUR_IDLE_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_CENTAUR_IDLE_GATE.assembledArtifactSha256,
    frameDigest: EN_E03_CENTAUR_IDLE_GATE.candidateFrameDigest,
  },
  artifact: 'enemy-expansion-review/en-e03-centaur-walk/en-e03-steppe-hunter-walk-raw.png',
  artifactSha256: 'b64b73f0bc90c35be428dbf49cc948576fc06575c28af36e286bd34079268269',
  assembledArtifact: 'enemy-expansion-review/en-e03-centaur-walk/en-e03-steppe-hunter-walk-complete-b-form.png',
  assembledArtifactSha256: '76503340798a738086cf8c001529c71aa80a3f8890ad55d6eb40a5e198e20a98',
  candidateFrameDigest: '8fa70b11dd34ae5643c709ff1082b84f61e36a1f3fa6110689f47fee864c433e',
  scope: 'Steppe Hunter common Walk only: W1-W4 across Down, Left, Right, and Up, with the approved two-frame Idle baseline delegated byte-for-byte and shown as frozen context.',
  exclusions: [
    'Idle pixel changes',
    'Giant changes',
    'Satyr',
    'specialist variants',
    'elite variants',
    'Attack',
    'Hurt',
    'Cast',
    'Death',
    'registration',
    'consumer exposure',
    'effects',
    'release',
  ],
  nextGate: 'No later EN-E03 implementation is authorized; require a new explicitly bounded designer gate.',
});

const WALK_PHASES = deepFreeze([
  { stride: 1, bob: 0 },
  { stride: 0, bob: 1 },
  { stride: -1, bob: 0 },
  { stride: 0, bob: 1 },
]);

function createPainter(context, direction) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Centaur Walk rectangles must use positive integer geometry.',
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

function drawLeg(paint, colors, leg) {
  const { rect } = paint;
  const height = leg.hoofY - leg.topY;
  assert(height > 0, 'Centaur Walk legs must connect body and hoof.');
  rect(leg.x, leg.topY, 2, height, colors.hide[leg.shade]);
  rect(leg.hoofX, leg.hoofY, 2, 2, colors.hoof[leg.shade]);
}

function downLegs(stride) {
  if (stride > 0) return [
    { x: 6, topY: 17, hoofX: 5, hoofY: 21, shade: 1 },
    { x: 9, topY: 18, hoofX: 10, hoofY: 20, shade: 0 },
    { x: 13, topY: 18, hoofX: 12, hoofY: 21, shade: 0 },
    { x: 16, topY: 17, hoofX: 17, hoofY: 20, shade: 1 },
  ];
  if (stride < 0) return [
    { x: 6, topY: 17, hoofX: 5, hoofY: 20, shade: 1 },
    { x: 9, topY: 18, hoofX: 10, hoofY: 21, shade: 0 },
    { x: 13, topY: 18, hoofX: 12, hoofY: 20, shade: 0 },
    { x: 16, topY: 17, hoofX: 17, hoofY: 21, shade: 1 },
  ];
  return [
    { x: 6, topY: 17, hoofX: 6, hoofY: 21, shade: 1 },
    { x: 9, topY: 18, hoofX: 9, hoofY: 20, shade: 0 },
    { x: 13, topY: 18, hoofX: 13, hoofY: 20, shade: 0 },
    { x: 16, topY: 17, hoofX: 16, hoofY: 21, shade: 1 },
  ];
}

function sideLegs(stride) {
  if (stride > 0) return [
    { x: 6, topY: 17, hoofX: 5, hoofY: 21, shade: 1 },
    { x: 9, topY: 17, hoofX: 10, hoofY: 20, shade: 0 },
    { x: 15, topY: 17, hoofX: 14, hoofY: 21, shade: 1 },
    { x: 18, topY: 17, hoofX: 19, hoofY: 20, shade: 0 },
  ];
  if (stride < 0) return [
    { x: 6, topY: 17, hoofX: 5, hoofY: 20, shade: 1 },
    { x: 9, topY: 17, hoofX: 10, hoofY: 21, shade: 0 },
    { x: 15, topY: 17, hoofX: 14, hoofY: 20, shade: 1 },
    { x: 18, topY: 17, hoofX: 19, hoofY: 21, shade: 0 },
  ];
  return [
    { x: 6, topY: 17, hoofX: 6, hoofY: 20, shade: 1 },
    { x: 9, topY: 17, hoofX: 9, hoofY: 21, shade: 0 },
    { x: 15, topY: 17, hoofX: 15, hoofY: 20, shade: 1 },
    { x: 18, topY: 17, hoofX: 18, hoofY: 21, shade: 0 },
  ];
}

function drawDownTail(paint, colors, stride) {
  const { rect, dot } = paint;
  if (stride > 0) {
    rect(16, 13, 3, 2, colors.hair[0]);
    rect(18, 12, 2, 2, colors.hair[1]);
    dot(20, 12, colors.hair[0]);
  } else if (stride < 0) {
    rect(16, 15, 3, 2, colors.hair[0]);
    rect(18, 16, 2, 2, colors.hair[1]);
    dot(20, 18, colors.hair[0]);
  } else {
    rect(17, 14, 3, 2, colors.hair[0]);
    rect(19, 15, 2, 2, colors.hair[1]);
    dot(20, 17, colors.hair[0]);
  }
}

function drawUpTail(paint, colors, stride) {
  const { rect, dot } = paint;
  const x = stride > 0 ? 12 : stride < 0 ? 14 : 13;
  rect(x, 17, 2, 2, colors.hair[0]);
  rect(x + 1, 18, 2, 3, colors.hair[0]);
  dot(x + (stride < 0 ? 0 : 2), 20, colors.hair[1]);
  dot(x + (stride < 0 ? 0 : 2), 21, colors.hair[1]);
}

function drawSideTail(paint, colors, stride) {
  const { rect, dot } = paint;
  if (stride > 0) {
    rect(2, 13, 3, 2, colors.hair[0]);
    rect(1, 12, 2, 2, colors.hair[1]);
    dot(1, 11, colors.hair[0]);
  } else if (stride < 0) {
    rect(2, 15, 3, 2, colors.hair[0]);
    rect(1, 16, 2, 2, colors.hair[1]);
    dot(2, 18, colors.hair[0]);
  } else {
    rect(2, 14, 3, 2, colors.hair[0]);
    rect(1, 15, 2, 2, colors.hair[1]);
    dot(2, 17, colors.hair[0]);
  }
}

function drawDownBody(paint, colors, phase) {
  const { rect, dot } = paint;
  for (const leg of downLegs(phase.stride)) drawLeg(paint, colors, leg);
  drawDownTail(paint, colors, phase.stride);

  rect(8, 14, 8, 1, colors.hide[0]);
  rect(7, 15, 10, 2, colors.hide[0]);
  rect(6, 16, 12, 1, colors.hide[0]);
  rect(7, 17, 10, 1, colors.hide[1]);
  rect(8, 18, 8, 1, colors.hide[1]);
  rect(9, 13, 6, 2, colors.hide[0]);
  rect(8, 15, 2, 1, colors.hideHighlight);
  dot(15, 15, colors.hideHighlight);

  const bob = phase.bob;
  rect(8, 10 + bob, 8, 2, colors.cloth[0]);
  rect(9, 12 + bob, 6, 3, colors.cloth[0]);
  rect(14, 11 + bob, 2, 3, colors.cloth[1]);
  dot(9, 10 + bob, colors.accent[1]);
  dot(10, 11 + bob, colors.accent[1]);
  dot(11, 12 + bob, colors.accent[1]);
  rect(7, 11 + bob, 2, 4, colors.skin[1]);
  dot(8, 14 + bob, colors.skin[0]);
  rect(16, 11 + bob, 2, 3, colors.skin[0]);
  dot(17, 13 + bob, colors.skin[1]);
  rect(8, 14 + bob, 8, 1, colors.accent[1]);
  dot(12, 14 + bob, colors.accent[0]);
}

function drawUpBody(paint, colors, phase) {
  const { rect, dot } = paint;
  for (const leg of downLegs(-phase.stride).map((leg) => ({ ...leg, shade: leg.shade ? 0 : 1 }))) drawLeg(paint, colors, leg);

  rect(8, 14, 8, 1, colors.hide[0]);
  rect(7, 15, 10, 2, colors.hide[0]);
  rect(6, 16, 12, 1, colors.hide[0]);
  rect(7, 17, 10, 1, colors.hide[1]);
  rect(8, 18, 8, 1, colors.hide[1]);
  rect(9, 13, 6, 2, colors.hide[0]);
  rect(8, 15, 2, 1, colors.hideHighlight);
  dot(15, 15, colors.hideHighlight);
  drawUpTail(paint, colors, phase.stride);

  const bob = phase.bob;
  rect(8, 10 + bob, 8, 2, colors.cloth[1]);
  rect(9, 12 + bob, 6, 3, colors.cloth[1]);
  rect(9, 10 + bob, 2, 4, colors.cloth[0]);
  dot(15, 10 + bob, colors.accent[1]);
  dot(14, 11 + bob, colors.accent[1]);
  dot(13, 12 + bob, colors.accent[1]);
  rect(7, 11 + bob, 2, 4, colors.skin[0]);
  dot(8, 14 + bob, colors.skin[1]);
  rect(16, 11 + bob, 2, 4, colors.skin[1]);
  dot(16, 14 + bob, colors.skin[0]);
  rect(8, 14 + bob, 8, 1, colors.accent[1]);
  dot(15, 14 + bob, colors.accent[0]);
}

function drawSideBody(paint, colors, phase) {
  const { rect, dot } = paint;
  for (const leg of sideLegs(phase.stride)) drawLeg(paint, colors, leg);
  drawSideTail(paint, colors, phase.stride);

  rect(4, 14, 15, 4, colors.hide[0]);
  rect(5, 13, 13, 2, colors.hide[0]);
  rect(6, 17, 12, 2, colors.hide[1]);
  rect(16, 13, 4, 4, colors.hide[0]);
  dot(5, 13, colors.hideHighlight);
  rect(12, 13, 3, 1, colors.hideHighlight);
  dot(19, 14, colors.hideHighlight);
  dot(4, 17, colors.hide[1]);

  const bob = phase.bob;
  rect(10, 9 + bob, 7, 3, colors.cloth[0]);
  rect(11, 12 + bob, 6, 3, colors.cloth[0]);
  rect(15, 10 + bob, 2, 4, colors.cloth[1]);
  rect(11, 10 + bob, 1, 3, colors.accent[1]);
  dot(12, 13 + bob, colors.accent[1]);
  rect(17, 10 + bob, 2, 3, colors.skin[0]);
  dot(18, 12 + bob, colors.skin[1]);
  rect(10, 14 + bob, 7, 1, colors.accent[1]);
  dot(16, 14 + bob, colors.accent[0]);
  rect(10, 11 + bob, 2, 3, colors.hair[1]);
}

function drawSpear(paint, colors, phase) {
  const { rect, dot } = paint;
  const bob = phase.bob;
  if (paint.view === 'up') {
    dot(4, 2 + bob, colors.spearhead[0]);
    rect(4, 3 + bob, 2, 1, colors.spearhead[0]);
    dot(4, 4 + bob, colors.spearhead[1]);
    rect(4, 5 + bob, 1, 16 - bob, colors.wood[1]);
    dot(5, 6 + bob, colors.wood[0]);
    rect(5, 11 + bob, 3, 2, colors.skin[1]);
    dot(6, 12 + bob, colors.accent[1]);
  } else if (paint.view === 'right') {
    dot(21, 2 + bob, colors.spearhead[0]);
    rect(20, 3 + bob, 2, 1, colors.spearhead[0]);
    dot(21, 4 + bob, colors.spearhead[1]);
    rect(21, 5 + bob, 1, 16 - bob, colors.wood[1]);
    dot(20, 6 + bob, colors.wood[0]);
    rect(18, 11 + bob, 3, 2, colors.skin[0]);
    dot(20, 12 + bob, colors.accent[0]);
  } else {
    dot(19, 2 + bob, colors.spearhead[0]);
    rect(18, 3 + bob, 2, 1, colors.spearhead[0]);
    dot(19, 4 + bob, colors.spearhead[1]);
    rect(19, 5 + bob, 1, 16 - bob, colors.wood[1]);
    dot(18, 6 + bob, colors.wood[0]);
    rect(17, 11 + bob, 2, 2, colors.skin[0]);
    dot(18, 12 + bob, colors.accent[0]);
  }
}

function steppeHunterColors() {
  const data = EN_E03_STEPPE_HUNTER_CALIBRATION_DATA;
  return {
    skin: data.actor.palette.skin,
    hair: data.actor.palette.hair,
    cloth: data.actor.palette.outfit,
    ...data.horse,
  };
}

export function drawSteppeHunterCentaurBody(context, direction, phase) {
  assert(
    phase && Number.isInteger(phase.stride) && phase.stride >= -1 && phase.stride <= 1
      && Number.isInteger(phase.bob) && phase.bob >= 0 && phase.bob <= 1,
    'Steppe Hunter body phases require stride -1/0/1 and bob 0/1.',
  );
  const colors = steppeHunterColors();
  const paint = createPainter(context, direction);
  if (paint.view === 'up') drawUpBody(paint, colors, phase);
  else if (paint.view === 'right') drawSideBody(paint, colors, phase);
  else drawDownBody(paint, colors, phase);
}

function drawCentaurWalkIdentity(context, direction, frame) {
  const colors = steppeHunterColors();
  const phase = WALK_PHASES[frame];
  const paint = createPainter(context, direction);
  drawSteppeHunterCentaurBody(context, direction, phase);
  drawSpear(paint, colors, phase);
}

function renderCentaurWalk(args) {
  assert(args.family.id === 'centaur', 'The EN-E03 Centaur Walk renderer is restricted to Centaur.');
  assert(args.variant.id === 'steppe-hunter', 'The EN-E03 Centaur Walk renderer is restricted to Steppe Hunter.');
  if (args.animation.id === 'idle') return EN_E03_CENTAUR_IDLE_RENDERER.render(args);
  assert(args.animation.id === 'walk' && args.frame >= 0 && args.frame < 4, 'The EN-E03 Centaur Walk renderer authorizes only approved Idle and four Walk frames.');
  const rendered = EN_E01_HUMANOID_RENDERER.render(args);
  args.context.clearRect(0, 14, SIZE, SIZE - 14);
  drawCentaurWalkIdentity(args.context, args.direction, args.frame);
  return Object.freeze({
    ...rendered,
    centaurWalkGate: EN_E03_CENTAUR_WALK_GATE.id,
    approvedIdleGate: EN_E03_CENTAUR_IDLE_GATE.id,
    precedingApprovalGate: EN_E03_GIANT_WALK_GATE.id,
  });
}

export const EN_E03_CENTAUR_WALK_RENDERER = Object.freeze({
  key: 'en-e03-centaur-walk-v1',
  chassis: EN_E01_HUMANOID_RENDERER.chassis,
  render: renderCentaurWalk,
});

export const EN_E03_CENTAUR_WALK_FAMILY = deepFreeze({
  id: 'centaur',
  name: 'Centaur',
  sliceId: 'EN-E03',
  rendererKey: EN_E03_CENTAUR_WALK_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [{
    id: 'steppe-hunter',
    name: 'Steppe Hunter',
    brief: 'Approved two-frame Idle baseline plus an approved four-frame Walk with alternating diagonal hoof contacts, rider weight shift, tail response, and an upright spear.',
    rendererData: EN_E03_STEPPE_HUNTER_CALIBRATION_DATA,
  }],
  rendererData: {
    contractCard: 'centaur',
    approvedIdleGate: EN_E03_CENTAUR_IDLE_GATE.id,
    precedingApprovalGate: EN_E03_GIANT_WALK_GATE.id,
    activeGate: EN_E03_CENTAUR_WALK_GATE.id,
  },
  review: {
    baselineVariant: 'steppe-hunter',
    scale: 8,
    notes: 'Visually approved one-family Walk lane; approved Idle remains exact and the family stays internal and non-public.',
  },
});

export const EN_E03_CENTAUR_WALK_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E03_CENTAUR_WALK_RENDERER],
  families: [EN_E03_CENTAUR_WALK_FAMILY],
});
