import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E01_HUMANOID_RENDERER } from './enemy-expansion-humanoid.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E03_GIANT_CALIBRATION_GATE = deepFreeze({
  id: 'en-e03-hill-breaker-first-idle-calibration-v1',
  status: 'approved',
  authorizedOn: '2026-08-03',
  approvedOn: '2026-08-03',
  approvalEvidence: 'Designer reviewed the exact raw and Complete B + Form boards and said: much better lets move onm.',
  artifact: 'enemy-expansion-review/en-e03-calibration/en-e03-hill-breaker-calibration-raw.png',
  artifactSha256: '4dae138234132d6249f36783dcb753716e6556791051c60c7ef92d6e73956e95',
  assembledArtifact: 'enemy-expansion-review/en-e03-calibration/en-e03-hill-breaker-calibration-complete-b-form.png',
  assembledArtifactSha256: '70fce189859c2c86d102b2db9f3b3ea5bac47b9f5f32c172adc70a612eafa605',
  candidateFrameDigest: '019ec9d11daac3d626d1c33693dc707ba98c6ade1c7647f82a5dc5a5a7fa2602',
  scope: 'Hill Breaker first Idle pose only, across Down, Left, Right, and Up, reviewed raw and with Complete B + Form beside exact approved roster references.',
  approvedReferences: [
    { sliceId: 'EN-E01', family: 'fallen-knight', variant: 'shieldbearer' },
    { sliceId: 'EN-E01', family: 'pirate', variant: 'deckhand' },
    { sliceId: 'EN-E02', family: 'goatfolk', variant: 'crag-skirmisher' },
  ],
  exclusions: [
    'Idle frame 2',
    'Centaur',
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
  nextGate: 'Hill Breaker second Idle pose only, across the same four directions, while preserving the approved first-pose pixels exactly.',
});

export const EN_E03_HILL_BREAKER_CALIBRATION_DATA = deepFreeze({
  actor: {
    species: 'human',
    bodyBuild: 'sturdy',
    skin: 'tan',
    hairStyle: 'messy',
    hairColor: 'brown',
    expression: 'angry',
    faceDetail: 'beard',
    headgear: 'none',
    outfit: 'barbarian',
    outfitColor: 'forest',
    outfitTier: 'tier1',
    weapon: 'club',
    weaponTier: 'tier2',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: ['#c69064', '#81563d'],
      hair: ['#49352b', '#251c19'],
      outfit: ['#6e7b43', '#3e4929'],
    },
  },
});

const GIANT_IDENTITY_COLORS = deepFreeze({
  skin: EN_E03_HILL_BREAKER_CALIBRATION_DATA.actor.palette.skin,
  hide: ['#8a6545', '#523c2c'],
  fur: ['#c9b88f', '#88785c'],
  belt: ['#5a3a28', '#d0a04b'],
});

function createIdentityPainter(context, direction, bob) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const rect = (x, y, width, height, fill) => {
    context.fillStyle = fill;
    context.fillRect(mirrored ? 24 - x - width : x, y + bob, width, height);
  };
  return {
    view,
    rect,
    dot(x, y, fill) {
      rect(x, y, 1, 1, fill);
    },
  };
}

function drawGiantDownIdentity(paint) {
  const { rect, dot } = paint;
  const { skin, hide, fur, belt } = GIANT_IDENTITY_COLORS;
  rect(5, 10, 3, 1, fur[1]);
  rect(5, 11, 4, 2, hide[0]);
  rect(6, 13, 3, 1, hide[1]);
  dot(4, 11, fur[0]);
  dot(8, 10, fur[0]);

  rect(4, 13, 2, 4, skin[1]);
  rect(5, 16, 3, 2, skin[0]);
  dot(4, 15, skin[0]);
  dot(17, 12, hide[1]);
  dot(18, 13, fur[1]);
  dot(8, 16, belt[0]);
  dot(15, 16, belt[1]);
}

function drawGiantUpIdentity(paint) {
  const { rect, dot } = paint;
  const { skin, hide, fur, belt } = GIANT_IDENTITY_COLORS;
  rect(15, 10, 4, 1, fur[1]);
  rect(15, 11, 4, 2, hide[1]);
  rect(15, 13, 3, 1, hide[0]);
  dot(19, 11, fur[0]);

  rect(18, 13, 2, 4, skin[1]);
  rect(16, 16, 3, 2, skin[0]);
  dot(8, 16, belt[1]);
  dot(15, 16, belt[0]);
}

function drawGiantSideIdentity(paint) {
  const { rect, dot } = paint;
  const { skin, hide, fur, belt } = GIANT_IDENTITY_COLORS;
  rect(6, 10, 4, 1, fur[1]);
  rect(6, 11, 5, 2, hide[0]);
  rect(7, 13, 4, 1, hide[1]);
  dot(5, 11, fur[0]);

  rect(6, 13, 2, 4, skin[1]);
  rect(7, 16, 3, 2, skin[0]);
  dot(17, 12, hide[1]);
  dot(18, 13, fur[0]);
  dot(9, 16, belt[0]);
  dot(16, 16, belt[1]);
}

export function drawGiantCalibrationIdentity(context, direction, bob = 0) {
  assert(Number.isInteger(bob) && bob >= 0 && bob <= 1, 'The Giant calibration identity bob must be zero or one pixel.');
  const paint = createIdentityPainter(context, direction, bob);
  if (paint.view === 'up') drawGiantUpIdentity(paint);
  else if (paint.view === 'right') drawGiantSideIdentity(paint);
  else drawGiantDownIdentity(paint);
}

function renderGiantCalibration(args) {
  assert(args.family.id === 'giant', 'The EN-E03 calibration renderer is restricted to Giant.');
  assert(args.variant.id === 'hill-breaker', 'The EN-E03 calibration renderer is restricted to Hill Breaker.');
  assert(args.animation.id === 'idle' && args.frame === 0, 'The EN-E03 calibration renderer authorizes only the first Idle pose.');
  const rendered = EN_E01_HUMANOID_RENDERER.render(args);
  drawGiantCalibrationIdentity(args.context, args.direction);
  return Object.freeze({
    ...rendered,
    calibrationGate: EN_E03_GIANT_CALIBRATION_GATE.id,
  });
}

export const EN_E03_GIANT_CALIBRATION_RENDERER = Object.freeze({
  key: 'en-e03-giant-calibration-v1',
  chassis: EN_E01_HUMANOID_RENDERER.chassis,
  render: renderGiantCalibration,
});

export const EN_E03_GIANT_CALIBRATION_FAMILY = deepFreeze({
  id: 'giant',
  name: 'Giant',
  sliceId: 'EN-E03',
  rendererKey: EN_E03_GIANT_CALIBRATION_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [{
    id: 'hill-breaker',
    name: 'Hill Breaker',
    brief: 'Reference-calibration study for a broad hill giant in a rough belted tunic carrying a wooden club.',
    rendererData: EN_E03_HILL_BREAKER_CALIBRATION_DATA,
  }],
  rendererData: {
    contractCard: 'giant',
    calibrationGate: EN_E03_GIANT_CALIBRATION_GATE.id,
  },
  review: {
    baselineVariant: 'hill-breaker',
    scale: 8,
    notes: 'One first-Idle-pose calibration only; this is not an approved baseline or public family.',
  },
});

export const EN_E03_GIANT_CALIBRATION_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E03_GIANT_CALIBRATION_RENDERER],
  families: [EN_E03_GIANT_CALIBRATION_FAMILY],
});
