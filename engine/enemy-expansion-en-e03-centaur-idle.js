import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E01_HUMANOID_RENDERER } from './enemy-expansion-humanoid.js';
import {
  EN_E03_CENTAUR_CALIBRATION_GATE,
  EN_E03_CENTAUR_CALIBRATION_RENDERER,
  EN_E03_STEPPE_HUNTER_CALIBRATION_DATA,
} from './enemy-expansion-en-e03-centaur-calibration.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E03_CENTAUR_IDLE_GATE = deepFreeze({
  id: 'en-e03-steppe-hunter-idle-v1',
  status: 'approved',
  authorizedOn: '2026-08-03',
  authorizationEvidence: 'Designer approved the exact Steppe Hunter F1 gate and authorized the recommended F2-only continuation with: Let\'s do that.',
  approvedOn: '2026-08-03',
  approvalEvidence: 'Designer reviewed the exact Steppe Hunter F1/F2 raw and Complete B + Form boards and said: Approved lets keep going.',
  approvedSeed: {
    gateId: EN_E03_CENTAUR_CALIBRATION_GATE.id,
    artifactSha256: EN_E03_CENTAUR_CALIBRATION_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_CENTAUR_CALIBRATION_GATE.assembledArtifactSha256,
    candidateFrameDigest: EN_E03_CENTAUR_CALIBRATION_GATE.candidateFrameDigest,
  },
  artifact: 'enemy-expansion-review/en-e03-centaur-idle/en-e03-steppe-hunter-idle-raw.png',
  artifactSha256: '256b9be67407ada1caad58b6dc68d426ecbeb73b5f2032f13187e337d900c235',
  assembledArtifact: 'enemy-expansion-review/en-e03-centaur-idle/en-e03-steppe-hunter-idle-complete-b-form.png',
  assembledArtifactSha256: 'e98d2e7d570c8777238cb187caaac15caff9c9000af0b322c651623e8e0ff7dd',
  candidateFrameDigest: '3c88471b25fc27397a0a11d6495cd27c641a6715ff33429f5d0d2c81f184ae49',
  scope: 'Approved Steppe Hunter Idle frame 1 plus one new frame 2, across Down, Left, Right, and Up, reviewed raw and with Complete B + Form beside the approved Hill Breaker and exact approved roster references.',
  exclusions: [
    'Giant changes',
    'Satyr',
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
  nextGate: 'Authorized on 2026-08-03: Briar Reveler first Idle pose only across Down, Left, Right, and Up, preserving all approved Hill Breaker and Steppe Hunter evidence.',
});

function createPainter(context, direction) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Centaur Idle rectangles must use positive integer geometry.',
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

function drawSpearDownF2(paint, colors) {
  const { rect, dot } = paint;
  const { skin, wood, spearhead, accent } = colors;
  dot(19, 3, spearhead[0]);
  rect(18, 4, 2, 1, spearhead[0]);
  dot(19, 5, spearhead[1]);
  rect(19, 6, 1, 15, wood[1]);
  dot(18, 7, wood[0]);
  rect(17, 12, 2, 2, skin[0]);
  dot(18, 13, accent[0]);
}

function drawSpearUpF2(paint, colors) {
  const { rect, dot } = paint;
  const { skin, wood, spearhead, accent } = colors;
  dot(4, 3, spearhead[0]);
  rect(4, 4, 2, 1, spearhead[0]);
  dot(4, 5, spearhead[1]);
  rect(4, 6, 1, 15, wood[1]);
  dot(5, 7, wood[0]);
  rect(5, 12, 3, 2, skin[1]);
  dot(6, 13, accent[1]);
}

function drawSpearSideF2(paint, colors) {
  const { rect, dot } = paint;
  const { skin, wood, spearhead, accent } = colors;
  dot(21, 3, spearhead[0]);
  rect(20, 4, 2, 1, spearhead[0]);
  dot(21, 5, spearhead[1]);
  rect(21, 6, 1, 15, wood[1]);
  dot(20, 7, wood[0]);
  rect(18, 12, 3, 2, skin[0]);
  dot(20, 13, accent[0]);
}

function drawDownHorseF2(paint, colors) {
  const { rect, dot } = paint;
  const { skin, cloth, hair, hide, hideHighlight, hoof, accent } = colors;

  rect(16, 13, 3, 2, hair[0]);
  rect(18, 12, 2, 2, hair[1]);
  dot(20, 12, hair[0]);

  rect(6, 17, 2, 4, hide[1]);
  rect(16, 17, 2, 4, hide[1]);
  rect(9, 18, 2, 3, hide[0]);
  rect(13, 18, 2, 3, hide[0]);
  rect(6, 21, 2, 2, hoof[1]);
  rect(9, 21, 2, 2, hoof[0]);
  rect(13, 21, 2, 2, hoof[0]);
  rect(16, 21, 2, 2, hoof[1]);

  rect(8, 14, 8, 1, hide[0]);
  rect(7, 15, 10, 2, hide[0]);
  rect(6, 16, 12, 1, hide[0]);
  rect(7, 17, 10, 1, hide[1]);
  rect(8, 18, 8, 1, hide[1]);
  rect(9, 13, 6, 2, hide[0]);
  rect(8, 15, 2, 1, hideHighlight);
  dot(15, 15, hideHighlight);
  dot(6, 17, hide[1]);
  dot(17, 17, hide[1]);

  rect(8, 11, 8, 2, cloth[0]);
  rect(9, 13, 6, 3, cloth[0]);
  rect(14, 12, 2, 3, cloth[1]);
  dot(9, 11, accent[1]);
  dot(10, 12, accent[1]);
  dot(11, 13, accent[1]);
  rect(7, 12, 2, 4, skin[1]);
  dot(8, 15, skin[0]);
  rect(16, 12, 2, 3, skin[0]);
  dot(17, 14, skin[1]);
  rect(8, 15, 8, 1, accent[1]);
  dot(12, 15, accent[0]);
}

function drawUpHorseF2(paint, colors) {
  const { rect, dot } = paint;
  const { skin, cloth, hair, hide, hideHighlight, hoof, accent } = colors;

  rect(6, 17, 2, 4, hide[0]);
  rect(16, 17, 2, 4, hide[0]);
  rect(9, 18, 2, 3, hide[1]);
  rect(13, 18, 2, 3, hide[1]);
  rect(6, 21, 2, 2, hoof[0]);
  rect(9, 21, 2, 2, hoof[1]);
  rect(13, 21, 2, 2, hoof[1]);
  rect(16, 21, 2, 2, hoof[0]);

  rect(8, 14, 8, 1, hide[0]);
  rect(7, 15, 10, 2, hide[0]);
  rect(6, 16, 12, 1, hide[0]);
  rect(7, 17, 10, 1, hide[1]);
  rect(8, 18, 8, 1, hide[1]);
  rect(9, 13, 6, 2, hide[0]);
  rect(8, 15, 2, 1, hideHighlight);
  dot(15, 15, hideHighlight);

  rect(12, 17, 2, 2, hair[0]);
  rect(13, 18, 2, 3, hair[0]);
  dot(15, 20, hair[1]);
  dot(15, 21, hair[1]);

  rect(8, 11, 8, 2, cloth[1]);
  rect(9, 13, 6, 3, cloth[1]);
  rect(9, 11, 2, 4, cloth[0]);
  dot(15, 11, accent[1]);
  dot(14, 12, accent[1]);
  dot(13, 13, accent[1]);
  rect(7, 12, 2, 4, skin[0]);
  dot(8, 15, skin[1]);
  rect(16, 12, 2, 4, skin[1]);
  dot(16, 15, skin[0]);
  rect(8, 15, 8, 1, accent[1]);
  dot(15, 15, accent[0]);
}

function drawSideHorseF2(paint, colors) {
  const { rect, dot } = paint;
  const { skin, cloth, hair, hide, hideHighlight, hoof, accent } = colors;

  rect(2, 13, 3, 2, hair[0]);
  rect(1, 12, 2, 2, hair[1]);
  dot(1, 11, hair[0]);

  rect(6, 17, 2, 4, hide[1]);
  rect(15, 17, 2, 4, hide[1]);
  rect(9, 17, 2, 4, hide[0]);
  rect(18, 17, 2, 4, hide[0]);
  rect(6, 21, 2, 2, hoof[1]);
  rect(9, 21, 2, 2, hoof[0]);
  rect(15, 21, 2, 2, hoof[1]);
  rect(18, 21, 2, 2, hoof[0]);

  rect(4, 14, 15, 4, hide[0]);
  rect(5, 13, 13, 2, hide[0]);
  rect(6, 17, 12, 2, hide[1]);
  rect(16, 13, 4, 4, hide[0]);
  dot(5, 13, hideHighlight);
  rect(12, 13, 3, 1, hideHighlight);
  dot(19, 14, hideHighlight);
  dot(4, 17, hide[1]);

  rect(10, 10, 7, 3, cloth[0]);
  rect(11, 13, 6, 3, cloth[0]);
  rect(15, 11, 2, 4, cloth[1]);
  rect(11, 11, 1, 3, accent[1]);
  dot(12, 14, accent[1]);
  rect(17, 11, 2, 3, skin[0]);
  dot(18, 13, skin[1]);
  rect(10, 15, 7, 1, accent[1]);
  dot(16, 15, accent[0]);
  rect(10, 12, 2, 3, hair[1]);
}

function drawCentaurIdleF2Identity(context, direction) {
  const data = EN_E03_STEPPE_HUNTER_CALIBRATION_DATA;
  const colors = {
    skin: data.actor.palette.skin,
    hair: data.actor.palette.hair,
    cloth: data.actor.palette.outfit,
    ...data.horse,
  };
  const paint = createPainter(context, direction);
  if (paint.view === 'up') {
    drawUpHorseF2(paint, colors);
    drawSpearUpF2(paint, colors);
  } else if (paint.view === 'right') {
    drawSideHorseF2(paint, colors);
    drawSpearSideF2(paint, colors);
  } else {
    drawDownHorseF2(paint, colors);
    drawSpearDownF2(paint, colors);
  }
}

function renderCentaurIdle(args) {
  assert(args.family.id === 'centaur', 'The EN-E03 Centaur Idle renderer is restricted to Centaur.');
  assert(args.variant.id === 'steppe-hunter', 'The EN-E03 Centaur Idle renderer is restricted to Steppe Hunter.');
  assert(args.animation.id === 'idle' && (args.frame === 0 || args.frame === 1), 'The EN-E03 Centaur Idle renderer authorizes only two Idle frames.');
  if (args.frame === 0) return EN_E03_CENTAUR_CALIBRATION_RENDERER.render(args);
  const rendered = EN_E01_HUMANOID_RENDERER.render(args);
  args.context.clearRect(0, 14, SIZE, SIZE - 14);
  drawCentaurIdleF2Identity(args.context, args.direction);
  return Object.freeze({
    ...rendered,
    centaurIdleGate: EN_E03_CENTAUR_IDLE_GATE.id,
    approvedSeedGate: EN_E03_CENTAUR_CALIBRATION_GATE.id,
  });
}

export const EN_E03_CENTAUR_IDLE_RENDERER = Object.freeze({
  key: 'en-e03-centaur-idle-v1',
  chassis: EN_E01_HUMANOID_RENDERER.chassis,
  render: renderCentaurIdle,
});

export const EN_E03_CENTAUR_IDLE_FAMILY = deepFreeze({
  id: 'centaur',
  name: 'Centaur',
  sliceId: 'EN-E03',
  rendererKey: EN_E03_CENTAUR_IDLE_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [{
    id: 'steppe-hunter',
    name: 'Steppe Hunter',
    brief: 'Approved two-frame Idle baseline with planted hooves, a one-pixel rider dip, and a direction-aware tail flick.',
    rendererData: EN_E03_STEPPE_HUNTER_CALIBRATION_DATA,
  }],
  rendererData: {
    contractCard: 'centaur',
    approvedSeedGate: EN_E03_CENTAUR_CALIBRATION_GATE.id,
    activeGate: EN_E03_CENTAUR_IDLE_GATE.id,
  },
  review: {
    baselineVariant: 'steppe-hunter',
    scale: 8,
    notes: 'Visually approved one-family two-frame Idle baseline; this remains internal and non-public.',
  },
});

export const EN_E03_CENTAUR_IDLE_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E03_CENTAUR_IDLE_RENDERER],
  families: [EN_E03_CENTAUR_IDLE_FAMILY],
});
