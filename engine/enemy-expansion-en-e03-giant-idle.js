import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E01_HUMANOID_RENDERER } from './enemy-expansion-humanoid.js';
import {
  drawGiantCalibrationIdentity,
  EN_E03_GIANT_CALIBRATION_GATE,
  EN_E03_GIANT_CALIBRATION_RENDERER,
  EN_E03_HILL_BREAKER_CALIBRATION_DATA,
} from './enemy-expansion-en-e03-calibration.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E03_GIANT_IDLE_GATE = deepFreeze({
  id: 'en-e03-hill-breaker-idle-v1',
  status: 'approved',
  authorizedOn: '2026-08-03',
  approvedOn: '2026-08-03',
  approvalEvidence: 'Designer reviewed the exact raw and Complete B + Form F1/F2 boards and said: approved.',
  approvedSeed: {
    gateId: EN_E03_GIANT_CALIBRATION_GATE.id,
    artifactSha256: EN_E03_GIANT_CALIBRATION_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_GIANT_CALIBRATION_GATE.assembledArtifactSha256,
    candidateFrameDigest: EN_E03_GIANT_CALIBRATION_GATE.candidateFrameDigest,
  },
  artifact: 'enemy-expansion-review/en-e03-giant-idle/en-e03-hill-breaker-idle-raw.png',
  artifactSha256: '21cb2a314b6fa5866ea4d708570513506c69c02befca739338df1b908fefc686',
  assembledArtifact: 'enemy-expansion-review/en-e03-giant-idle/en-e03-hill-breaker-idle-complete-b-form.png',
  assembledArtifactSha256: '2bcad3208b2571764f1938f0be52383d1cb4128a191b74ed7d669fd8e8c48faf',
  candidateFrameDigest: '2ae3904669508afbabed0742d72d4d334f37cdee360ba4f4d1a11767d22ee5ab',
  scope: 'Approved Hill Breaker Idle frame 1 plus one new frame 2, across Down, Left, Right, and Up, reviewed raw and with Complete B + Form beside exact approved roster references.',
  exclusions: [
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
  nextGate: 'Completed and approved on 2026-08-03: Steppe Hunter first Idle pose only across four directions, with raw and Complete B + Form evidence.',
});

function renderGiantIdle(args) {
  assert(args.family.id === 'giant', 'The EN-E03 Giant Idle renderer is restricted to Giant.');
  assert(args.variant.id === 'hill-breaker', 'The EN-E03 Giant Idle renderer is restricted to Hill Breaker.');
  assert(args.animation.id === 'idle' && (args.frame === 0 || args.frame === 1), 'The EN-E03 Giant Idle renderer authorizes only two Idle frames.');
  if (args.frame === 0) return EN_E03_GIANT_CALIBRATION_RENDERER.render(args);
  const rendered = EN_E01_HUMANOID_RENDERER.render(args);
  drawGiantCalibrationIdentity(args.context, args.direction, 1);
  return Object.freeze({
    ...rendered,
    giantIdleGate: EN_E03_GIANT_IDLE_GATE.id,
    approvedSeedGate: EN_E03_GIANT_CALIBRATION_GATE.id,
  });
}

export const EN_E03_GIANT_IDLE_RENDERER = Object.freeze({
  key: 'en-e03-giant-idle-v1',
  chassis: EN_E01_HUMANOID_RENDERER.chassis,
  render: renderGiantIdle,
});

export const EN_E03_GIANT_IDLE_FAMILY = deepFreeze({
  id: 'giant',
  name: 'Giant',
  sliceId: 'EN-E03',
  rendererKey: EN_E03_GIANT_IDLE_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [{
    id: 'hill-breaker',
    name: 'Hill Breaker',
    brief: 'Approved two-frame Idle baseline; no later animation or family is authorized.',
    rendererData: EN_E03_HILL_BREAKER_CALIBRATION_DATA,
  }],
  rendererData: {
    contractCard: 'giant',
    approvedSeedGate: EN_E03_GIANT_CALIBRATION_GATE.id,
    activeGate: EN_E03_GIANT_IDLE_GATE.id,
  },
  review: {
    baselineVariant: 'hill-breaker',
    scale: 8,
    notes: 'Visually approved one-family two-frame Idle baseline; this remains internal and non-public.',
  },
});

export const EN_E03_GIANT_IDLE_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E03_GIANT_IDLE_RENDERER],
  families: [EN_E03_GIANT_IDLE_FAMILY],
});
