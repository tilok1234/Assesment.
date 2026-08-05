import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E01_HUMANOID_RENDERER } from './enemy-expansion-humanoid.js';
import { EN_E03_GIANT_IDLE_GATE } from './enemy-expansion-en-e03-giant-idle.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E03_CENTAUR_CALIBRATION_GATE = deepFreeze({
  id: 'en-e03-steppe-hunter-first-idle-calibration-v1',
  status: 'approved',
  authorizedOn: '2026-08-03',
  authorizationEvidence: 'Designer approved the exact Hill Breaker F1/F2 gate and said: lets do next.',
  approvedOn: '2026-08-03',
  approvalEvidence: 'Designer reviewed the exact Steppe Hunter F1 raw and Complete B + Form boards and said: Approved.',
  precedingApproval: {
    gateId: EN_E03_GIANT_IDLE_GATE.id,
    artifactSha256: EN_E03_GIANT_IDLE_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_GIANT_IDLE_GATE.assembledArtifactSha256,
    candidateFrameDigest: EN_E03_GIANT_IDLE_GATE.candidateFrameDigest,
  },
  artifact: 'enemy-expansion-review/en-e03-centaur-calibration/en-e03-steppe-hunter-calibration-raw.png',
  artifactSha256: 'f4c462ffd9242684d7335c28c238db0fb59cecd5e168f069da03cc6f40753480',
  assembledArtifact: 'enemy-expansion-review/en-e03-centaur-calibration/en-e03-steppe-hunter-calibration-complete-b-form.png',
  assembledArtifactSha256: 'dc7ccd766c736dcb1581b817f950b6be8541bacb26411c2281a42535bbf82f52',
  candidateFrameDigest: '53ea78549da26eccc2b8292672f693384d8551660d68bdd5e3827bb1d21f55cb',
  scope: 'Steppe Hunter first Idle pose only, across Down, Left, Right, and Up, reviewed raw and with Complete B + Form beside the approved Hill Breaker and exact approved roster references.',
  approvedReferences: [
    { sliceId: 'EN-E03', family: 'giant', variant: 'hill-breaker' },
    { sliceId: 'EN-E01', family: 'fallen-knight', variant: 'shieldbearer' },
    { sliceId: 'EN-E01', family: 'pirate', variant: 'deckhand' },
    { sliceId: 'EN-E02', family: 'goatfolk', variant: 'crag-skirmisher' },
  ],
  exclusions: [
    'Idle frame 2',
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
  nextGate: 'Authorized on 2026-08-03: Steppe Hunter Idle frame 2 only across the same four directions, preserving the approved first-pose pixels exactly.',
});

export const EN_E03_STEPPE_HUNTER_CALIBRATION_DATA = deepFreeze({
  actor: {
    species: 'human',
    bodyBuild: 'classic',
    skin: 'tan',
    hairStyle: 'ponytail',
    hairColor: 'brown',
    expression: 'determined',
    faceDetail: 'none',
    headgear: 'none',
    outfit: 'ranger',
    outfitColor: 'teal',
    outfitTier: 'tier1',
    weapon: 'none',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: ['#c79262', '#83563d'],
      hair: ['#66402c', '#35251d'],
      outfit: ['#347477', '#21484e'],
    },
  },
  horse: {
    hide: ['#9a613d', '#5d3c2a'],
    hideHighlight: '#bd7b4d',
    hoof: ['#41312a', '#211a18'],
    wood: ['#8b603a', '#4b3525'],
    spearhead: ['#d7d3bd', '#77766f'],
    accent: ['#d0a04c', '#7c572b'],
  },
});

function createPainter(context, direction) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Centaur calibration rectangles must use positive integer geometry.',
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

function drawSpearDown(paint, colors) {
  const { rect, dot } = paint;
  const { skin, wood, spearhead, accent } = colors;
  dot(19, 2, spearhead[0]);
  rect(18, 3, 2, 1, spearhead[0]);
  dot(19, 4, spearhead[1]);
  rect(19, 5, 1, 16, wood[1]);
  dot(18, 6, wood[0]);
  rect(17, 11, 2, 2, skin[0]);
  dot(18, 12, accent[0]);
}

function drawSpearUp(paint, colors) {
  const { rect, dot } = paint;
  const { skin, wood, spearhead, accent } = colors;
  dot(4, 2, spearhead[0]);
  rect(4, 3, 2, 1, spearhead[0]);
  dot(4, 4, spearhead[1]);
  rect(4, 5, 1, 16, wood[1]);
  dot(5, 6, wood[0]);
  rect(5, 11, 3, 2, skin[1]);
  dot(6, 12, accent[1]);
}

function drawSpearSide(paint, colors) {
  const { rect, dot } = paint;
  const { skin, wood, spearhead, accent } = colors;
  dot(21, 2, spearhead[0]);
  rect(20, 3, 2, 1, spearhead[0]);
  dot(21, 4, spearhead[1]);
  rect(21, 5, 1, 16, wood[1]);
  dot(20, 6, wood[0]);
  rect(18, 11, 3, 2, skin[0]);
  dot(20, 12, accent[0]);
}

function drawDownHorse(paint, colors) {
  const { rect, dot } = paint;
  const { skin, cloth, hair, hide, hideHighlight, hoof, accent } = colors;

  rect(17, 14, 3, 2, hair[0]);
  rect(19, 15, 2, 2, hair[1]);
  dot(20, 17, hair[0]);

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

  rect(8, 10, 8, 2, cloth[0]);
  rect(9, 12, 6, 3, cloth[0]);
  rect(14, 11, 2, 3, cloth[1]);
  dot(9, 10, accent[1]);
  dot(10, 11, accent[1]);
  dot(11, 12, accent[1]);
  rect(7, 11, 2, 4, skin[1]);
  dot(8, 14, skin[0]);
  rect(16, 11, 2, 3, skin[0]);
  dot(17, 13, skin[1]);
  rect(8, 14, 8, 1, accent[1]);
  dot(12, 14, accent[0]);
}

function drawUpHorse(paint, colors) {
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

  rect(13, 17, 2, 2, hair[0]);
  rect(14, 18, 2, 3, hair[0]);
  dot(16, 20, hair[1]);
  dot(15, 21, hair[1]);

  rect(8, 10, 8, 2, cloth[1]);
  rect(9, 12, 6, 3, cloth[1]);
  rect(9, 10, 2, 4, cloth[0]);
  dot(15, 10, accent[1]);
  dot(14, 11, accent[1]);
  dot(13, 12, accent[1]);
  rect(7, 11, 2, 4, skin[0]);
  dot(8, 14, skin[1]);
  rect(16, 11, 2, 4, skin[1]);
  dot(16, 14, skin[0]);
  rect(8, 14, 8, 1, accent[1]);
  dot(15, 14, accent[0]);
}

function drawSideHorse(paint, colors) {
  const { rect, dot } = paint;
  const { skin, cloth, hair, hide, hideHighlight, hoof, accent } = colors;

  rect(2, 14, 3, 2, hair[0]);
  rect(1, 15, 2, 2, hair[1]);
  dot(2, 17, hair[0]);

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

  rect(10, 9, 7, 3, cloth[0]);
  rect(11, 12, 6, 3, cloth[0]);
  rect(15, 10, 2, 4, cloth[1]);
  rect(11, 10, 1, 3, accent[1]);
  dot(12, 13, accent[1]);
  rect(17, 10, 2, 3, skin[0]);
  dot(18, 12, skin[1]);
  rect(10, 14, 7, 1, accent[1]);
  dot(16, 14, accent[0]);
  rect(10, 11, 2, 3, hair[1]);
}

function drawCentaurCalibrationIdentity(context, direction) {
  const data = EN_E03_STEPPE_HUNTER_CALIBRATION_DATA;
  const colors = {
    skin: data.actor.palette.skin,
    hair: data.actor.palette.hair,
    cloth: data.actor.palette.outfit,
    ...data.horse,
  };
  const paint = createPainter(context, direction);
  if (paint.view === 'up') {
    drawUpHorse(paint, colors);
    drawSpearUp(paint, colors);
  } else if (paint.view === 'right') {
    drawSideHorse(paint, colors);
    drawSpearSide(paint, colors);
  } else {
    drawDownHorse(paint, colors);
    drawSpearDown(paint, colors);
  }
}

function renderCentaurCalibration(args) {
  assert(args.family.id === 'centaur', 'The EN-E03 Centaur calibration renderer is restricted to Centaur.');
  assert(args.variant.id === 'steppe-hunter', 'The EN-E03 Centaur calibration renderer is restricted to Steppe Hunter.');
  assert(args.animation.id === 'idle' && args.frame === 0, 'The EN-E03 Centaur calibration renderer authorizes only the first Idle pose.');
  const rendered = EN_E01_HUMANOID_RENDERER.render(args);
  args.context.clearRect(0, 14, SIZE, SIZE - 14);
  drawCentaurCalibrationIdentity(args.context, args.direction);
  return Object.freeze({
    ...rendered,
    centaurCalibrationGate: EN_E03_CENTAUR_CALIBRATION_GATE.id,
    precedingApprovalGate: EN_E03_GIANT_IDLE_GATE.id,
  });
}

export const EN_E03_CENTAUR_CALIBRATION_RENDERER = Object.freeze({
  key: 'en-e03-centaur-calibration-v1',
  chassis: EN_E01_HUMANOID_RENDERER.chassis,
  render: renderCentaurCalibration,
});

export const EN_E03_CENTAUR_CALIBRATION_FAMILY = deepFreeze({
  id: 'centaur',
  name: 'Centaur',
  sliceId: 'EN-E03',
  rendererKey: EN_E03_CENTAUR_CALIBRATION_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [{
    id: 'steppe-hunter',
    name: 'Steppe Hunter',
    brief: 'Approved reference-first F1 seed for a chestnut centaur scout with teal vest, four separated dark hooves, tail, and upright spear.',
    rendererData: EN_E03_STEPPE_HUNTER_CALIBRATION_DATA,
  }],
  rendererData: {
    contractCard: 'centaur',
    calibrationGate: EN_E03_CENTAUR_CALIBRATION_GATE.id,
    precedingApprovalGate: EN_E03_GIANT_IDLE_GATE.id,
  },
  review: {
    baselineVariant: 'steppe-hunter',
    scale: 8,
    notes: 'Visually approved first-Idle-pose Centaur seed; this remains internal and non-public.',
  },
});

export const EN_E03_CENTAUR_CALIBRATION_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E03_CENTAUR_CALIBRATION_RENDERER],
  families: [EN_E03_CENTAUR_CALIBRATION_FAMILY],
});
