import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E01_HUMANOID_RENDERER } from './enemy-expansion-humanoid.js';
import { EN_E03_COMMON_ALIAS_GATE } from './enemy-expansion-en-e03-common-aliases.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E03_BOULDER_HURLER_IDLE_GATE = deepFreeze({
  id: 'en-e03-boulder-hurler-idle-v1',
  status: 'approved',
  authorizedOn: '2026-08-07',
  authorizationEvidence: 'Designer approved the exact labeled all-four-direction Cast raw, Cast Complete B + Form, Death raw, and Death Complete B + Form GIFs together, then said: good lets do next. Codex explicitly bounded the continuation to Boulder Hurler Idle F1-F2 across four directions.',
  approvedOn: '2026-08-07',
  approvalEvidence: 'Designer reviewed both exact improved labeled all-four-direction raw and Complete B + Form Boulder Hurler Idle GIFs together and said: approved.',
  precedingApproval: {
    gateId: EN_E03_COMMON_ALIAS_GATE.id,
    artifactSha256: EN_E03_COMMON_ALIAS_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_COMMON_ALIAS_GATE.assembledArtifactSha256,
    candidateFrameDigest: EN_E03_COMMON_ALIAS_GATE.candidateFrameDigest,
  },
  artifact: 'enemy-expansion-review/en-e03-boulder-hurler-idle/en-e03-boulder-hurler-idle-raw.png',
  artifactSha256: 'f3a9b41fbec9127f3414c3a414b2e64d1a9cae3c2f86c81b31f6dcda0ccda54f',
  assembledArtifact: 'enemy-expansion-review/en-e03-boulder-hurler-idle/en-e03-boulder-hurler-idle-complete-b-form.png',
  assembledArtifactSha256: 'bbaf966cbd33a807372c45622112f0fe523dc8e9cb3f52a36cc139777f82be91',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e03-boulder-hurler-idle/en-e03-boulder-hurler-idle-four-directions-labeled.gif',
      sha256: '8ee6a17eee4e4428cbfab8fad2fef942dba436803bae398d5ea02b4afbfaad56', width: 192, height: 224, frames: 2, durationMs: 480,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e03-boulder-hurler-idle/en-e03-boulder-hurler-idle-four-directions-labeled-complete-b-form.gif',
      sha256: '2c081db2c8cb553f70374e70ab234814d4b1c64aa8c11227b85e9971cf058701', width: 192, height: 224, frames: 2, durationMs: 480,
    },
  },
  candidateFrameDigest: 'd8f3b04d54a55d7fe20e3dfdf0c3cb9c68ffb65722b07a5b0f416e18335795a0',
  scope: 'Boulder Hurler specialist Idle F1-F2 only across Down, Left, Right, and Up, reviewed raw and with Complete B + Form beside the approved Hill Breaker baseline.',
  identityContract: 'Long bare throwing arms, heavy wrist wraps, diagonal sling harness, and a cool slate hide palette distinguish Boulder Hurler from Hill Breaker. The boulder is an external projectile and is not baked into actor pixels.',
  animationContract: 'A slow 480 ms grounded stance cycle: F2 lowers the shoulders and harness while the hands lag, move inward, and bend into a throwing-ready side pose. Feet remain controlled by the shared Idle chassis.',
  exclusions: [
    'Hill Breaker changes',
    'Steppe Hunter changes',
    'Briar Reveler changes',
    'baked boulder pixels',
    'Storm-Clan Jarl',
    'Centaur variants',
    'Satyr variants',
    'Walk',
    'Attack',
    'Cast',
    'Hurt',
    'Death',
    'registration',
    'consumer exposure',
    'effects',
    'release',
  ],
  nextGate: 'Visual approval is complete and this bounded Boulder Hurler Idle lane is published. No later animation, variant, registration, integration, effect, release, or EN-E03 work is authorized without a separate explicit continuation.',
});

export const EN_E03_BOULDER_HURLER_IDLE_DATA = deepFreeze({
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
    outfitColor: 'charcoal',
    outfitTier: 'tier1',
    weapon: 'none',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: ['#bd895f', '#74503a'],
      hair: ['#3f332d', '#211b19'],
      outfit: ['#536b70', '#2d3d42'],
    },
  },
  projectileBoundary: 'external-boulder',
});

const COLORS = deepFreeze({
  skin: EN_E03_BOULDER_HURLER_IDLE_DATA.actor.palette.skin,
  hide: ['#536b70', '#2d3d42'],
  leather: ['#845f3d', '#4d3528'],
  wrap: ['#c6b188', '#806f55'],
  accent: ['#d2a44f', '#75502b'],
});

function createPainter(context, direction) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const rect = (x, y, width, height, fill) => {
    context.fillStyle = fill;
    context.fillRect(mirrored ? 24 - x - width : x, y, width, height);
  };
  return {
    view,
    rect,
    dot(x, y, fill) {
      rect(x, y, 1, 1, fill);
    },
  };
}

function drawDownIdentity({ rect, dot }, phase) {
  const { skin, hide, leather, wrap, accent } = COLORS;
  const torsoBob = phase;
  rect(5, 10 + torsoBob, 4, 2, hide[1]);
  rect(15, 10 + torsoBob, 4, 2, hide[1]);
  dot(6, 9 + torsoBob, hide[0]);
  dot(17, 9 + torsoBob, hide[0]);
  rect(8, 11 + torsoBob, 2, 1, leather[0]);
  rect(9, 12 + torsoBob, 2, 1, leather[0]);
  rect(10, 13 + torsoBob, 2, 1, leather[1]);
  rect(11, 14 + torsoBob, 2, 1, leather[0]);
  rect(12, 15 + torsoBob, 3, 1, leather[1]);
  dot(14, 14 + torsoBob, accent[0]);

  const leftX = phase === 0 ? 4 : 5;
  const rightX = phase === 0 ? 17 : 16;
  rect(leftX, 12 + torsoBob, 2, 5, skin[1]);
  rect(leftX + 1, 13 + torsoBob, 2, 4, skin[0]);
  rect(rightX, 12 + torsoBob, 2, 5, skin[1]);
  rect(rightX - 1, 13 + torsoBob, 2, 4, skin[0]);
  rect(leftX, 15 + phase, 3, 1, wrap[1]);
  rect(rightX - 1, 15 + phase, 3, 1, wrap[1]);
  rect(leftX, 16 + phase, 3, 1, wrap[0]);
  rect(rightX - 1, 16 + phase, 3, 1, wrap[0]);
  rect(leftX, 17, 3, 2, skin[0]);
  rect(rightX - 1, 17, 3, 2, skin[0]);
  dot(leftX, 18, skin[1]);
  dot(rightX + 1, 18, skin[1]);
}

function drawUpIdentity({ rect, dot }, phase) {
  const { skin, hide, leather, wrap, accent } = COLORS;
  const torsoBob = phase;
  rect(5, 10 + torsoBob, 4, 2, hide[1]);
  rect(15, 10 + torsoBob, 4, 2, hide[1]);
  dot(6, 9 + torsoBob, hide[0]);
  dot(17, 9 + torsoBob, hide[0]);
  rect(14, 10 + torsoBob, 2, 1, leather[0]);
  rect(13, 11 + torsoBob, 2, 1, leather[0]);
  rect(12, 12 + torsoBob, 2, 1, leather[1]);
  rect(11, 13 + torsoBob, 2, 1, leather[0]);
  rect(9, 14 + torsoBob, 3, 1, leather[1]);
  dot(9, 13 + torsoBob, accent[0]);

  const leftX = phase === 0 ? 4 : 5;
  const rightX = phase === 0 ? 17 : 16;
  rect(leftX, 12 + torsoBob, 2, 5, skin[1]);
  rect(leftX + 1, 13 + torsoBob, 2, 4, skin[0]);
  rect(rightX, 12 + torsoBob, 2, 5, skin[1]);
  rect(rightX - 1, 13 + torsoBob, 2, 4, skin[0]);
  rect(leftX, 15 + phase, 3, 1, wrap[1]);
  rect(rightX - 1, 15 + phase, 3, 1, wrap[1]);
  rect(leftX, 16 + phase, 3, 1, wrap[0]);
  rect(rightX - 1, 16 + phase, 3, 1, wrap[0]);
  rect(leftX, 17, 3, 2, skin[0]);
  rect(rightX - 1, 17, 3, 2, skin[0]);
  dot(leftX, 18, skin[1]);
  dot(rightX + 1, 18, skin[1]);
}

function drawSideIdentity({ rect, dot }, phase) {
  const { skin, hide, leather, wrap, accent } = COLORS;
  const torsoBob = phase;
  rect(6, 10 + torsoBob, 4, 2, hide[1]);
  dot(5, 10 + torsoBob, hide[0]);
  rect(8, 11 + torsoBob, 2, 1, leather[0]);
  rect(9, 12 + torsoBob, 2, 1, leather[0]);
  rect(10, 13 + torsoBob, 2, 1, leather[1]);
  rect(11, 14 + torsoBob, 3, 1, leather[0]);
  rect(6, 14 + torsoBob, 3, 3, leather[1]);
  dot(7, 14 + torsoBob, accent[0]);

  if (phase === 0) {
    rect(16, 11, 2, 7, skin[1]);
    rect(17, 12, 2, 6, skin[0]);
    rect(16, 15, 3, 1, wrap[1]);
    rect(16, 16, 3, 1, wrap[0]);
    rect(16, 17, 3, 2, skin[0]);
    dot(18, 18, skin[1]);
  } else {
    rect(16, 12, 2, 5, skin[1]);
    rect(17, 13, 2, 3, skin[0]);
    rect(15, 15, 3, 1, wrap[1]);
    rect(14, 16, 3, 1, wrap[0]);
    rect(14, 17, 3, 2, skin[0]);
    dot(14, 18, skin[1]);
  }
  rect(6, 12 + torsoBob, 2, 5, skin[1]);
  rect(7, 13 + torsoBob, 2, 4, skin[0]);
}

function drawBoulderHurlerIdentity(context, direction, phase) {
  const paint = createPainter(context, direction);
  if (paint.view === 'up') drawUpIdentity(paint, phase);
  else if (paint.view === 'right') drawSideIdentity(paint, phase);
  else drawDownIdentity(paint, phase);
}

function renderBoulderHurlerIdle(args) {
  assert(args.family.id === 'giant', 'The EN-E03 Giant specialist Idle renderer is restricted to Giant.');
  assert(args.variant.id === 'boulder-hurler', 'The EN-E03 Giant specialist Idle renderer is restricted to Boulder Hurler.');
  assert(args.animation.id === 'idle' && (args.frame === 0 || args.frame === 1), 'The EN-E03 Boulder Hurler gate authorizes only two Idle frames.');
  const rendered = EN_E01_HUMANOID_RENDERER.render(args);
  drawBoulderHurlerIdentity(args.context, args.direction, args.frame);
  return Object.freeze({
    ...rendered,
    boulderHurlerIdleGate: EN_E03_BOULDER_HURLER_IDLE_GATE.id,
    approvedPrecedingGate: EN_E03_COMMON_ALIAS_GATE.id,
    projectileBoundary: EN_E03_BOULDER_HURLER_IDLE_DATA.projectileBoundary,
  });
}

export const EN_E03_BOULDER_HURLER_IDLE_RENDERER = Object.freeze({
  key: 'en-e03-boulder-hurler-idle-v1',
  chassis: EN_E01_HUMANOID_RENDERER.chassis,
  render: renderBoulderHurlerIdle,
});

export const EN_E03_BOULDER_HURLER_IDLE_FAMILY = deepFreeze({
  id: 'giant',
  name: 'Giant',
  sliceId: 'EN-E03',
  rendererKey: EN_E03_BOULDER_HURLER_IDLE_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [{
    id: 'boulder-hurler',
    name: 'Boulder Hurler',
    brief: 'Long-armed ranged giant with an external boulder projectile; only the two-frame Idle identity baseline is implemented.',
    rendererData: EN_E03_BOULDER_HURLER_IDLE_DATA,
  }],
  rendererData: {
    contractCard: 'giant',
    approvedPrecedingGate: EN_E03_COMMON_ALIAS_GATE.id,
    activeGate: EN_E03_BOULDER_HURLER_IDLE_GATE.id,
  },
  review: {
    baselineVariant: 'boulder-hurler',
    scale: 8,
    notes: 'Visually approved specialist two-frame Idle baseline; internal, non-public, and projectile-free.',
  },
});

export const EN_E03_BOULDER_HURLER_IDLE_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E03_BOULDER_HURLER_IDLE_RENDERER],
  families: [EN_E03_BOULDER_HURLER_IDLE_FAMILY],
});
