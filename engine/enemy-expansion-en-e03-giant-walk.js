import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E01_HUMANOID_RENDERER } from './enemy-expansion-humanoid.js';
import {
  drawGiantCalibrationIdentity,
  EN_E03_HILL_BREAKER_CALIBRATION_DATA,
} from './enemy-expansion-en-e03-calibration.js';
import {
  EN_E03_GIANT_IDLE_GATE,
  EN_E03_GIANT_IDLE_RENDERER,
} from './enemy-expansion-en-e03-giant-idle.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E03_GIANT_WALK_GATE = deepFreeze({
  id: 'en-e03-hill-breaker-walk-v1',
  status: 'approved',
  authorizedOn: '2026-08-04',
  authorizationEvidence: 'Designer approved the next bounded EN-E03 gate and said: lets do next.',
  approvedOn: '2026-08-06',
  approvalEvidence: 'Designer reviewed the exact Hill Breaker Walk raw and Complete B + Form boards and said: yes sir seems fine to me approved.',
  approvedIdle: {
    gateId: EN_E03_GIANT_IDLE_GATE.id,
    artifactSha256: EN_E03_GIANT_IDLE_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_GIANT_IDLE_GATE.assembledArtifactSha256,
    frameDigest: EN_E03_GIANT_IDLE_GATE.candidateFrameDigest,
  },
  artifact: 'enemy-expansion-review/en-e03-giant-walk/en-e03-hill-breaker-walk-raw.png',
  artifactSha256: 'bc6302036e4b3c8f45c59195659726408721d3dbdac3b1b670f2543d46213420',
  assembledArtifact: 'enemy-expansion-review/en-e03-giant-walk/en-e03-hill-breaker-walk-complete-b-form.png',
  assembledArtifactSha256: '19ce1476461bf623e5dc909216021e64c61b40f168ec175cb0a60dcf3e338339',
  candidateFrameDigest: '9f41b2b90b245fe7d6302f87ddcd9313cdedc5360ddc245a4d61c8beab958622',
  scope: 'Hill Breaker common Walk only: all four Walk frames across Down, Left, Right, and Up, with the approved two-frame Idle baseline delegated byte-for-byte and shown as frozen context.',
  exclusions: [
    'Idle pixel changes',
    'Centaur',
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
  nextGate: 'Authorized on 2026-08-06: Steppe Hunter common Walk W1-W4 across Down, Left, Right, and Up, preserving the approved two-frame Idle baseline byte-for-byte.',
});

function renderGiantWalk(args) {
  assert(args.family.id === 'giant', 'The EN-E03 Giant Walk renderer is restricted to Giant.');
  assert(args.variant.id === 'hill-breaker', 'The EN-E03 Giant Walk renderer is restricted to Hill Breaker.');
  if (args.animation.id === 'idle') return EN_E03_GIANT_IDLE_RENDERER.render(args);
  assert(args.animation.id === 'walk' && args.frame >= 0 && args.frame < 4, 'The EN-E03 Giant Walk renderer authorizes only approved Idle and four Walk frames.');
  const rendered = EN_E01_HUMANOID_RENDERER.render(args);
  const bob = args.frame === 1 || args.frame === 3 ? 1 : 0;
  drawGiantCalibrationIdentity(args.context, args.direction, bob);
  return Object.freeze({
    ...rendered,
    giantWalkGate: EN_E03_GIANT_WALK_GATE.id,
    approvedIdleGate: EN_E03_GIANT_IDLE_GATE.id,
  });
}

export const EN_E03_GIANT_WALK_RENDERER = Object.freeze({
  key: 'en-e03-giant-walk-v1',
  chassis: EN_E01_HUMANOID_RENDERER.chassis,
  render: renderGiantWalk,
});

export const EN_E03_GIANT_WALK_FAMILY = deepFreeze({
  id: 'giant',
  name: 'Giant',
  sliceId: 'EN-E03',
  rendererKey: EN_E03_GIANT_WALK_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [{
    id: 'hill-breaker',
    name: 'Hill Breaker',
    brief: 'Approved two-frame Idle baseline plus an approved four-frame Walk with alternating weight, club counter-swing, and planted Giant contacts.',
    rendererData: EN_E03_HILL_BREAKER_CALIBRATION_DATA,
  }],
  rendererData: {
    contractCard: 'giant',
    approvedIdleGate: EN_E03_GIANT_IDLE_GATE.id,
    activeGate: EN_E03_GIANT_WALK_GATE.id,
  },
  review: {
    baselineVariant: 'hill-breaker',
    scale: 8,
    notes: 'Visually approved one-family Walk lane; approved Idle remains exact and the family stays internal and non-public.',
  },
});

export const EN_E03_GIANT_WALK_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E03_GIANT_WALK_RENDERER],
  families: [EN_E03_GIANT_WALK_FAMILY],
});
