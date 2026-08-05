import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E01_HUMANOID_RENDERER } from './enemy-expansion-humanoid.js';
import { EN_E03_CENTAUR_IDLE_GATE } from './enemy-expansion-en-e03-centaur-idle.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E03_SATYR_CALIBRATION_GATE = deepFreeze({
  id: 'en-e03-briar-reveler-first-idle-calibration-v1',
  status: 'approved',
  authorizedOn: '2026-08-03',
  authorizationEvidence: 'Designer approved the exact Steppe Hunter F1/F2 gate and said: Approved lets keep going.',
  approvedOn: '2026-08-03',
  approvalEvidence: 'Designer reviewed the exact Briar Reveler F1 raw and Complete B + Form boards and said: looks good.',
  precedingApproval: {
    gateId: EN_E03_CENTAUR_IDLE_GATE.id,
    artifactSha256: EN_E03_CENTAUR_IDLE_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_CENTAUR_IDLE_GATE.assembledArtifactSha256,
    candidateFrameDigest: EN_E03_CENTAUR_IDLE_GATE.candidateFrameDigest,
  },
  artifact: 'enemy-expansion-review/en-e03-satyr-calibration/en-e03-briar-reveler-calibration-raw.png',
  artifactSha256: '1272f52186c4f0df8666e845392eec6338d31aa161222d2064ed27625acc4405',
  assembledArtifact: 'enemy-expansion-review/en-e03-satyr-calibration/en-e03-briar-reveler-calibration-complete-b-form.png',
  assembledArtifactSha256: 'aa516c5d4e53b7d89b8dc2a935f7d41c8e36260950b771b8f094093e4fd9a5a1',
  candidateFrameDigest: 'b8335de4e6794e84de0be10a3c437fab024db8310262e1c1deb484bd6b9add6b',
  scope: 'Approved Briar Reveler first Idle pose only, across Down, Left, Right, and Up, reviewed raw and with Complete B + Form beside the approved Hill Breaker, Steppe Hunter, Goatfolk, and Pirate references.',
  approvedReferences: [
    { sliceId: 'EN-E03', family: 'centaur', variant: 'steppe-hunter' },
    { sliceId: 'EN-E03', family: 'giant', variant: 'hill-breaker' },
    { sliceId: 'EN-E02', family: 'goatfolk', variant: 'crag-skirmisher' },
    { sliceId: 'EN-E01', family: 'pirate', variant: 'deckhand' },
  ],
  exclusions: [
    'Idle frame 2',
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
  nextGate: 'Authorized on 2026-08-03: Briar Reveler Idle frame 2 only across Down, Left, Right, and Up, preserving the exact approved F1 evidence.',
});

export const EN_E03_BRIAR_REVELER_CALIBRATION_DATA = deepFreeze({
  actor: {
    species: 'human',
    bodyBuild: 'lean',
    skin: 'tan',
    hairStyle: 'messy',
    hairColor: 'brown',
    expression: 'determined',
    faceDetail: 'none',
    headgear: 'none',
    outfit: 'ranger',
    outfitColor: 'forest',
    outfitTier: 'tier1',
    weapon: 'none',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: ['#cf9a69', '#895d43'],
      hair: ['#6c4931', '#38291f'],
      outfit: ['#4f7542', '#30472e'],
    },
  },
  identity: {
    overlays: [{ id: 'goatfolk-traits-v2', colors: ['#8b6243', '#76572c', '#cf9a69'] }],
  },
  satyr: {
    hide: ['#8b6243', '#543d2e'],
    hoof: ['#45332a', '#211a17'],
    wood: ['#80603c', '#493725'],
    horn: ['#c99b4d', '#76572c'],
    accent: ['#d2ad62', '#7d572e'],
  },
});

function createPainter(context, direction) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Satyr calibration rectangles must use positive integer geometry.',
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

function drawDownLegs(paint, colors, rearView) {
  const { rect, dot } = paint;
  const { hide, hoof } = colors;
  const near = rearView ? 1 : 0;
  const far = rearView ? 0 : 1;

  rect(8, 16, 3, 3, hide[near]);
  rect(7, 18, 3, 2, hide[far]);
  rect(7, 20, 2, 2, hide[near]);
  rect(6, 21, 3, 1, hoof[1]);
  dot(6, 22, hoof[1]);
  dot(8, 22, hoof[0]);

  rect(13, 16, 3, 3, hide[far]);
  rect(15, 18, 3, 2, hide[near]);
  rect(16, 20, 2, 2, hide[far]);
  rect(15, 21, 3, 1, hoof[1]);
  dot(15, 22, hoof[0]);
  dot(17, 22, hoof[1]);
}

function drawSideLegs(paint, colors) {
  const { rect, dot } = paint;
  const { hide, hoof } = colors;

  rect(11, 16, 3, 3, hide[0]);
  rect(9, 18, 3, 3, hide[1]);
  rect(9, 20, 2, 2, hide[0]);
  rect(8, 21, 3, 1, hoof[1]);
  dot(8, 22, hoof[1]);
  dot(10, 22, hoof[0]);

  rect(14, 16, 3, 3, hide[1]);
  rect(16, 18, 3, 3, hide[0]);
  rect(17, 20, 2, 2, hide[1]);
  rect(16, 21, 3, 1, hoof[1]);
  dot(16, 22, hoof[0]);
  dot(18, 22, hoof[1]);
}

function drawDownTail(paint, colors) {
  const { rect, dot } = paint;
  rect(6, 15, 3, 2, colors.hide[0]);
  rect(5, 14, 2, 2, colors.hide[1]);
  dot(5, 13, colors.hide[0]);
}

function drawUpTail(paint, colors) {
  const { rect, dot } = paint;
  rect(13, 15, 2, 3, colors.hide[0]);
  rect(14, 17, 3, 2, colors.hide[1]);
  dot(17, 18, colors.hide[0]);
}

function drawSideTail(paint, colors) {
  const { rect, dot } = paint;
  rect(6, 15, 4, 2, colors.hide[0]);
  rect(4, 14, 3, 2, colors.hide[1]);
  dot(4, 13, colors.hide[0]);
}

function drawDownStaff(paint, colors) {
  const { rect, dot } = paint;
  const { skin } = colors;
  dot(18, 2, colors.horn[0]);
  rect(17, 3, 3, 1, colors.horn[0]);
  dot(17, 4, colors.horn[1]);
  rect(19, 4, 1, 17, colors.wood[1]);
  dot(18, 5, colors.wood[0]);
  rect(16, 11, 3, 2, skin[0]);
  rect(17, 13, 3, 2, skin[1]);
  dot(18, 13, colors.accent[0]);
}

function drawUpStaff(paint, colors) {
  const { rect, dot } = paint;
  const { skin } = colors;
  dot(5, 2, colors.horn[0]);
  rect(3, 3, 3, 1, colors.horn[0]);
  dot(5, 4, colors.horn[1]);
  rect(4, 4, 1, 17, colors.wood[1]);
  dot(5, 5, colors.wood[0]);
  rect(5, 11, 3, 2, skin[1]);
  rect(4, 13, 3, 2, skin[0]);
  dot(5, 13, colors.accent[1]);
}

function drawSideStaff(paint, colors) {
  const { rect, dot } = paint;
  const { skin } = colors;
  dot(19, 2, colors.horn[0]);
  rect(19, 3, 3, 1, colors.horn[0]);
  dot(19, 4, colors.horn[1]);
  rect(21, 4, 1, 17, colors.wood[1]);
  dot(20, 5, colors.wood[0]);
  rect(17, 11, 3, 2, skin[0]);
  rect(18, 13, 3, 2, skin[1]);
  dot(20, 13, colors.accent[0]);
}

function drawHornCurls(paint, colors) {
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

function drawSatyrCalibrationIdentity(context, direction) {
  const data = EN_E03_BRIAR_REVELER_CALIBRATION_DATA;
  const colors = {
    skin: data.actor.palette.skin,
    ...data.satyr,
  };
  const paint = createPainter(context, direction);
  if (paint.view === 'up') {
    drawDownLegs(paint, colors, true);
    drawUpTail(paint, colors);
    drawUpStaff(paint, colors);
  } else if (paint.view === 'right') {
    drawSideTail(paint, colors);
    drawSideLegs(paint, colors);
    drawSideStaff(paint, colors);
  } else {
    drawDownTail(paint, colors);
    drawDownLegs(paint, colors, false);
    drawDownStaff(paint, colors);
  }
  drawHornCurls(paint, colors);
}

function renderSatyrCalibration(args) {
  assert(args.family.id === 'satyr', 'The EN-E03 Satyr calibration renderer is restricted to Satyr.');
  assert(args.variant.id === 'briar-reveler', 'The EN-E03 Satyr calibration renderer is restricted to Briar Reveler.');
  assert(args.animation.id === 'idle' && args.frame === 0, 'The EN-E03 Satyr calibration renderer authorizes only the first Idle pose.');
  const rendered = EN_E01_HUMANOID_RENDERER.render(args);
  args.context.clearRect(0, 17, SIZE, SIZE - 17);
  drawSatyrCalibrationIdentity(args.context, args.direction);
  return Object.freeze({
    ...rendered,
    satyrCalibrationGate: EN_E03_SATYR_CALIBRATION_GATE.id,
    precedingApprovalGate: EN_E03_CENTAUR_IDLE_GATE.id,
  });
}

export const EN_E03_SATYR_CALIBRATION_RENDERER = Object.freeze({
  key: 'en-e03-satyr-calibration-v1',
  chassis: EN_E01_HUMANOID_RENDERER.chassis,
  render: renderSatyrCalibration,
});

export const EN_E03_SATYR_CALIBRATION_FAMILY = deepFreeze({
  id: 'satyr',
  name: 'Satyr',
  sliceId: 'EN-E03',
  rendererKey: EN_E03_SATYR_CALIBRATION_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [{
    id: 'briar-reveler',
    name: 'Briar Reveler',
    brief: 'Approved reference-first F1 seed for a lean forest-green satyr with curled horns, rotated tail, reverse-jointed legs, split hooves, and a crooked staff.',
    rendererData: EN_E03_BRIAR_REVELER_CALIBRATION_DATA,
  }],
  rendererData: {
    contractCard: 'satyr',
    calibrationGate: EN_E03_SATYR_CALIBRATION_GATE.id,
    precedingApprovalGate: EN_E03_CENTAUR_IDLE_GATE.id,
  },
  review: {
    baselineVariant: 'briar-reveler',
    scale: 8,
    notes: 'One visually approved first-Idle-pose Satyr seed; this remains internal and non-public, with no later pose authorized.',
  },
});

export const EN_E03_SATYR_CALIBRATION_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E03_SATYR_CALIBRATION_RENDERER],
  families: [EN_E03_SATYR_CALIBRATION_FAMILY],
});
