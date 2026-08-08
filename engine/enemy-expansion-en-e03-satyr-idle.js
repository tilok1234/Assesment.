import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E01_HUMANOID_RENDERER } from './enemy-expansion-humanoid.js';
import {
  EN_E03_BRIAR_REVELER_CALIBRATION_DATA,
  EN_E03_SATYR_CALIBRATION_GATE,
  EN_E03_SATYR_CALIBRATION_RENDERER,
} from './enemy-expansion-en-e03-satyr-calibration.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E03_SATYR_IDLE_GATE = deepFreeze({
  id: 'en-e03-briar-reveler-idle-v1',
  status: 'approved',
  authorizedOn: '2026-08-03',
  authorizationEvidence: 'Designer approved the exact Briar Reveler F1 gate and said: lets go next.',
  approvedOn: '2026-08-04',
  approvalEvidence: 'Designer reviewed the exact Briar Reveler F1/F2 raw and Complete B + Form boards and said: approved.',
  approvedSeed: {
    gateId: EN_E03_SATYR_CALIBRATION_GATE.id,
    artifactSha256: EN_E03_SATYR_CALIBRATION_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_SATYR_CALIBRATION_GATE.assembledArtifactSha256,
    candidateFrameDigest: EN_E03_SATYR_CALIBRATION_GATE.candidateFrameDigest,
  },
  artifact: 'enemy-expansion-review/en-e03-satyr-idle/en-e03-briar-reveler-idle-raw.png',
  artifactSha256: '8d3a960d62683e19694e28572f15117314fde9ccb7dd898ea9065d64da058204',
  assembledArtifact: 'enemy-expansion-review/en-e03-satyr-idle/en-e03-briar-reveler-idle-complete-b-form.png',
  assembledArtifactSha256: '4257e63a25a23631ff861b3752e03da0897a6ceaf5ef8cef6efccbd575f6b51e',
  candidateFrameDigest: '0d5599dcd452351903e5d56289596d2e75f59caf5c0b7a5525c7e375c39b36fa',
  scope: 'Approved Briar Reveler Idle frame 1 and frame 2 across Down, Left, Right, and Up, reviewed raw and with Complete B + Form beside the approved Hill Breaker, Steppe Hunter, Goatfolk, and Pirate references.',
  exclusions: [
    'Giant changes',
    'Centaur changes',
    'specialist variants',
    'elite variants',
    'Walk',
    'Attack',
    'Hurt',
    'Cast',
    'Death',
    'registration',
    'consumer exposure',
    'effects',
    'release',
  ],
  nextGate: 'No later EN-E03 implementation gate is authorized. Any continuation requires a new explicitly bounded designer authorization.',
});

function createPainter(context, direction) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Satyr Idle rectangles must use positive integer geometry.',
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

function drawDownLegsF2(paint, colors, rearView) {
  const { rect, dot } = paint;
  const { hide, hoof } = colors;
  const near = rearView ? 1 : 0;
  const far = rearView ? 0 : 1;

  rect(8, 16, 3, 3, hide[near]);
  rect(9, 18, 3, 2, hide[far]);
  rect(7, 20, 4, 2, hide[near]);
  rect(6, 21, 3, 1, hoof[1]);
  dot(6, 22, hoof[1]);
  dot(8, 22, hoof[0]);

  rect(13, 16, 3, 3, hide[far]);
  rect(12, 18, 3, 2, hide[near]);
  rect(14, 20, 4, 2, hide[far]);
  rect(15, 21, 3, 1, hoof[1]);
  dot(15, 22, hoof[0]);
  dot(17, 22, hoof[1]);
}

function drawSideLegsF2(paint, colors) {
  const { rect, dot } = paint;
  const { hide, hoof } = colors;

  rect(11, 16, 3, 3, hide[0]);
  rect(12, 18, 3, 2, hide[1]);
  rect(9, 20, 4, 2, hide[0]);
  rect(8, 21, 3, 1, hoof[1]);
  dot(8, 22, hoof[1]);
  dot(10, 22, hoof[0]);

  rect(14, 16, 3, 3, hide[1]);
  rect(15, 18, 3, 2, hide[0]);
  rect(16, 20, 3, 2, hide[1]);
  rect(16, 21, 3, 1, hoof[1]);
  dot(16, 22, hoof[0]);
  dot(18, 22, hoof[1]);
}

function drawDownTailF2(paint, colors) {
  const { rect, dot } = paint;
  rect(6, 16, 3, 2, colors.hide[0]);
  rect(4, 16, 3, 2, colors.hide[1]);
  dot(4, 15, colors.hide[0]);
}

function drawUpTailF2(paint, colors) {
  const { rect, dot } = paint;
  rect(13, 15, 2, 3, colors.hide[0]);
  rect(14, 14, 3, 2, colors.hide[1]);
  dot(17, 13, colors.hide[0]);
}

function drawSideTailF2(paint, colors) {
  const { rect, dot } = paint;
  rect(6, 16, 4, 2, colors.hide[0]);
  rect(4, 16, 3, 2, colors.hide[1]);
  dot(4, 15, colors.hide[0]);
}

function drawDownStaffF2(paint, colors) {
  const { rect, dot } = paint;
  const { skin } = colors;
  dot(17, 3, colors.horn[0]);
  rect(16, 4, 3, 1, colors.horn[0]);
  dot(16, 5, colors.horn[1]);
  rect(18, 5, 1, 17, colors.wood[1]);
  dot(17, 6, colors.wood[0]);
  rect(15, 11, 3, 2, skin[0]);
  rect(16, 13, 3, 2, skin[1]);
  dot(17, 13, colors.accent[0]);
}

function drawUpStaffF2(paint, colors) {
  const { rect, dot } = paint;
  const { skin } = colors;
  dot(6, 3, colors.horn[0]);
  rect(5, 4, 3, 1, colors.horn[0]);
  dot(7, 5, colors.horn[1]);
  rect(5, 5, 1, 17, colors.wood[1]);
  dot(6, 6, colors.wood[0]);
  rect(6, 11, 3, 2, skin[1]);
  rect(5, 13, 3, 2, skin[0]);
  dot(6, 13, colors.accent[1]);
}

function drawSideStaffF2(paint, colors) {
  const { rect, dot } = paint;
  const { skin } = colors;
  dot(18, 3, colors.horn[0]);
  rect(18, 4, 3, 1, colors.horn[0]);
  dot(18, 5, colors.horn[1]);
  rect(20, 5, 1, 17, colors.wood[1]);
  dot(19, 6, colors.wood[0]);
  rect(16, 11, 3, 2, skin[0]);
  rect(17, 13, 3, 2, skin[1]);
  dot(19, 13, colors.accent[0]);
}

function drawHornCurlsF2(paint, colors) {
  const { rect, dot } = paint;
  const { horn } = colors;
  if (paint.view === 'right') {
    rect(9, 1, 2, 1, horn[0]);
    rect(9, 2, 1, 2, horn[0]);
    dot(10, 3, horn[1]);
    dot(10, 4, horn[1]);
    return;
  }
  rect(5, 3, 1, 2, horn[0]);
  dot(6, 4, horn[0]);
  dot(6, 5, horn[1]);
  rect(18, 3, 1, 2, horn[0]);
  dot(17, 4, horn[0]);
  dot(17, 5, horn[1]);
}

export function drawSatyrIdleF2Identity(context, direction, { includeStaff = true } = {}) {
  const data = EN_E03_BRIAR_REVELER_CALIBRATION_DATA;
  const colors = {
    skin: data.actor.palette.skin,
    ...data.satyr,
  };
  const paint = createPainter(context, direction);
  if (paint.view === 'up') {
    drawUpTailF2(paint, colors);
    drawDownLegsF2(paint, colors, true);
    if (includeStaff) drawUpStaffF2(paint, colors);
  } else if (paint.view === 'right') {
    drawSideTailF2(paint, colors);
    drawSideLegsF2(paint, colors);
    if (includeStaff) drawSideStaffF2(paint, colors);
  } else {
    drawDownTailF2(paint, colors);
    drawDownLegsF2(paint, colors, false);
    if (includeStaff) drawDownStaffF2(paint, colors);
  }
  drawHornCurlsF2(paint, colors);
}

function renderSatyrIdle(args) {
  assert(args.family.id === 'satyr', 'The EN-E03 Satyr Idle renderer is restricted to Satyr.');
  assert(args.variant.id === 'briar-reveler', 'The EN-E03 Satyr Idle renderer is restricted to Briar Reveler.');
  assert(args.animation.id === 'idle' && (args.frame === 0 || args.frame === 1), 'The EN-E03 Satyr Idle renderer authorizes only two Idle frames.');
  if (args.frame === 0) return EN_E03_SATYR_CALIBRATION_RENDERER.render(args);
  const rendered = EN_E01_HUMANOID_RENDERER.render(args);
  args.context.clearRect(0, 17, SIZE, SIZE - 17);
  drawSatyrIdleF2Identity(args.context, args.direction);
  return Object.freeze({
    ...rendered,
    satyrIdleGate: EN_E03_SATYR_IDLE_GATE.id,
    approvedSeedGate: EN_E03_SATYR_CALIBRATION_GATE.id,
  });
}

export const EN_E03_SATYR_IDLE_RENDERER = Object.freeze({
  key: 'en-e03-satyr-idle-v1',
  chassis: EN_E01_HUMANOID_RENDERER.chassis,
  render: renderSatyrIdle,
});

export const EN_E03_SATYR_IDLE_FAMILY = deepFreeze({
  id: 'satyr',
  name: 'Satyr',
  sliceId: 'EN-E03',
  rendererKey: EN_E03_SATYR_IDLE_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [{
    id: 'briar-reveler',
    name: 'Briar Reveler',
    brief: 'Approved two-frame Idle baseline with planted split hooves, inward hock motion, a tail flick, and a one-pixel staff dip.',
    rendererData: EN_E03_BRIAR_REVELER_CALIBRATION_DATA,
  }],
  rendererData: {
    contractCard: 'satyr',
    approvedSeedGate: EN_E03_SATYR_CALIBRATION_GATE.id,
    activeGate: EN_E03_SATYR_IDLE_GATE.id,
  },
  review: {
    baselineVariant: 'briar-reveler',
    scale: 8,
    notes: 'Visually approved one-family two-frame Idle baseline; this remains internal and non-public.',
  },
});

export const EN_E03_SATYR_IDLE_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E03_SATYR_IDLE_RENDERER],
  families: [EN_E03_SATYR_IDLE_FAMILY],
});
