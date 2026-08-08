import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E01_HUMANOID_RENDERER } from './enemy-expansion-humanoid.js';
import {
  drawNagaIdleIdentity,
  EN_E04_NAGA_IDLE_DATA,
  EN_E04_NAGA_IDLE_GATE,
} from './enemy-expansion-en-e04-naga-idle.js';
import { EN_E04_NAGA_MOTION_GATE } from './enemy-expansion-en-e04-naga-motion.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E04_VENOM_ORACLE_CONTRACT = deepFreeze({
  family: 'naga',
  variant: 'venom-oracle',
  role: 'specialist',
  state: 'implemented-idle-candidate',
  chassis: 'upright-serpentine-humanoid',
  identity: 'Ritual violet veil and mantle, luminous venom crown jewel, gold oracle sigil, bright venom eyes, and the approved continuous belly-plated Naga coil.',
  effectBoundary: 'Venom orbs, miasma clouds, ritual sigils, prophecy motes, and coil impacts remain external.',
});

export const EN_E04_VENOM_ORACLE_IDLE_GATE = deepFreeze({
  id: 'en-e04-venom-oracle-idle-v1',
  status: 'approved',
  authorizedOn: '2026-08-08',
  authorizationEvidence: 'After approving, publishing, and reconciling the exact Naga Coilguard complete-motion lane, the designer said: lets do next. Following the documented Naga role order, Codex bounded the continuation to Venom Oracle specialist Idle F1-F2 across four directions.',
  approvedOn: '2026-08-08',
  approvalEvidence: 'Designer reviewed both exact labeled all-four-direction raw/no-outline and Complete B + Form Venom Oracle Idle GIFs together and said: ye approved.',
  precedingApproval: {
    gateId: EN_E04_NAGA_MOTION_GATE.id,
    artifactSha256: EN_E04_NAGA_MOTION_GATE.artifactSha256,
    assembledArtifactSha256: EN_E04_NAGA_MOTION_GATE.assembledArtifactSha256,
    rawAnimationSha256: EN_E04_NAGA_MOTION_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E04_NAGA_MOTION_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E04_NAGA_MOTION_GATE.candidateFrameDigest,
    publishedCheckpoint: 'f47e1691208236f5d245a1f3b9b15355ad479790',
    publishedHandoff: 'eddc243e7711f357cb62e40920c83cf066dfc790',
  },
  approvedAnatomyBaseline: {
    gateId: EN_E04_NAGA_IDLE_GATE.id,
    artifactSha256: EN_E04_NAGA_IDLE_GATE.artifactSha256,
    assembledArtifactSha256: EN_E04_NAGA_IDLE_GATE.assembledArtifactSha256,
    rawAnimationSha256: EN_E04_NAGA_IDLE_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E04_NAGA_IDLE_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E04_NAGA_IDLE_GATE.candidateFrameDigest,
  },
  artifact: 'enemy-expansion-review/en-e04-venom-oracle-idle/en-e04-venom-oracle-idle-raw.png',
  artifactSha256: '5181c4f209fcde7a941cc49c9ce9388ff30898a75810c5a83be58447db1eb661',
  assembledArtifact: 'enemy-expansion-review/en-e04-venom-oracle-idle/en-e04-venom-oracle-idle-complete-b-form.png',
  assembledArtifactSha256: '54b68a4433daf84cb5ccbe4a7b9c0b4656d5b1a903b8e3a0f7cb8925af1f7862',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e04-venom-oracle-idle/en-e04-venom-oracle-idle-four-directions-labeled.gif',
      sha256: 'c031f6ac6260e98bc10ccda3101262fbb1f61471fdccccd53cbb1fd72ee474d4', width: 192, height: 224, frames: 2, durationMs: 480,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e04-venom-oracle-idle/en-e04-venom-oracle-idle-four-directions-labeled-complete-b-form.gif',
      sha256: 'ec27da68fecfb8612adb35e29b51f624ce3a7b6bd25635b01ab954cb37077ac1', width: 192, height: 224, frames: 2, durationMs: 480,
    },
  },
  candidateFrameDigest: '2df5c53f3b6636f2918d4620a3419ee0465ecc57f68d5f8506b5c9e79e862228',
  scope: 'Venom Oracle specialist Naga Idle F1-F2 only across Down, Left, Right, and Up, reviewed raw and with Complete B + Form beside the approved Coilguard anatomy baseline.',
  identityContract: EN_E04_VENOM_ORACLE_CONTRACT.identity + ' ' + EN_E04_VENOM_ORACLE_CONTRACT.effectBoundary,
  animationContract: 'A slow 480 ms planted oracle-breathing cycle inherited from the approved Naga anatomy: F2 settles the cobra hood, ritual crown, mantle, and torso one row while visibly compressing the same continuous ground coil. No direction resolves into ordinary legs or paired feet.',
  exclusions: [
    'approved Coilguard pixel changes',
    'Venom Oracle Walk',
    'Venom Oracle Attack',
    'Venom Oracle Cast',
    'Venom Oracle Hurt',
    'Venom Oracle Death',
    'Temple Rajah implementation',
    'Merfolk',
    'Birdfolk',
    'baked venom-orb pixels',
    'baked miasma pixels',
    'baked ritual-sigil pixels',
    'baked prophecy-mote pixels',
    'baked coil-impact pixels',
    'registration',
    'consumer exposure',
    'effects',
    'release',
    'later EN-E04 work',
  ],
  nextGate: 'Visual approval is complete and bounded publication is authorized for this exact Venom Oracle Idle lane. After publication, no motion, Temple Rajah work, other family, registration, integration, effect, release, or broader EN-E04 work is authorized without a separately bounded continuation.',
});

export const EN_E04_VENOM_ORACLE_IDLE_DATA = deepFreeze({
  actor: {
    ...EN_E04_NAGA_IDLE_DATA.actor,
    outfit: 'robe',
    palette: {
      skin: [...EN_E04_NAGA_IDLE_DATA.actor.palette.skin],
      hair: [...EN_E04_NAGA_IDLE_DATA.actor.palette.hair],
      outfit: ['#67508a', '#362c52', '#d5ae4c'],
    },
  },
  identity: EN_E04_NAGA_IDLE_DATA.identity,
  naga: EN_E04_NAGA_IDLE_DATA.naga,
  oracle: {
    veil: ['#67508a', '#362c52', '#9b80bd'],
    venom: ['#b8e05f', '#5d973d', '#efff96'],
    gold: ['#d5ae4c', '#765a2c', '#f0d77a'],
  },
  effectBoundary: 'external-venom-orbs-miasma-ritual-sigils-prophecy-motes-and-coil-impact',
  bakedEffects: [],
});

const VENOM_ORACLE_VARIANT = deepFreeze({
  id: 'venom-oracle',
  name: 'Venom Oracle',
  brief: 'Ritual Naga specialist with a venom-jewel crown, violet mantle, gold oracle sigil, and external venom/miasma effect contract; only the two-frame Idle identity baseline is implemented.',
  rendererData: EN_E04_VENOM_ORACLE_IDLE_DATA,
});

function createPainter(context, direction) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Venom Oracle rectangles must use positive integer geometry.',
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

function drawDownOracleCrown({ rect, dot }, phase, rearView) {
  const { veil, venom, gold } = EN_E04_VENOM_ORACLE_IDLE_DATA.oracle;
  const bob = phase;
  rect(11, 1 + bob, 2, 2, venom[1]);
  dot(11, 1 + bob, venom[2]);
  dot(10, 2 + bob, gold[2]);
  dot(13, 2 + bob, gold[2]);
  rect(9, 3 + bob, 6, 1, veil[1]);
  rect(10, 3 + bob, 4, 1, gold[0]);
  rect(9, 4 + bob, 6, 1, veil[0]);
  dot(rearView ? 12 : 11, 3 + bob, venom[0]);
  dot(9, 4 + bob, veil[2]);
  dot(14, 4 + bob, veil[2]);
  if (rearView) {
    rect(11, 5 + bob, 2, 2, venom[1]);
    dot(12, 5 + bob, venom[2]);
  } else {
    dot(10, 7 + bob, venom[2]);
    dot(13, 7 + bob, venom[2]);
  }
}

function drawSideOracleCrown({ rect, dot }, phase) {
  const { veil, venom, gold } = EN_E04_VENOM_ORACLE_IDLE_DATA.oracle;
  const bob = phase;
  rect(13, 1 + bob, 1, 2, venom[1]);
  dot(13, 1 + bob, venom[2]);
  rect(11, 2 + bob, 4, 1, gold[0]);
  dot(15, 2 + bob, gold[2]);
  rect(9, 3 + bob, 7, 1, veil[1]);
  rect(9, 4 + bob, 7, 1, veil[0]);
  dot(9, 4 + bob, veil[2]);
  dot(15, 3 + bob, venom[0]);
  dot(16, 6 + bob, venom[2]);
}

function drawDownOracleVestments({ rect, dot }, phase, rearView) {
  const { veil, venom, gold } = EN_E04_VENOM_ORACLE_IDLE_DATA.oracle;
  const bob = phase;
  rect(7, 11 + bob, 10, 1, veil[1]);
  rect(8, 12 + bob, 8, 2, veil[0]);
  rect(9, 14 + bob, 6, 1, veil[1]);
  rect(8, 15 + bob, 8, 1, veil[1]);
  dot(9, 15 + bob, gold[2]);
  dot(14, 15 + bob, gold[0]);
  if (rearView) {
    rect(11, 12 + bob, 2, 2, gold[1]);
    dot(12, 13 + bob, venom[1]);
  } else {
    rect(11, 12 + bob, 2, 2, gold[0]);
    dot(11, 12 + bob, venom[2]);
    dot(12, 13 + bob, venom[1]);
  }
}

function drawSideOracleVestments({ rect, dot }, phase) {
  const { veil, venom, gold } = EN_E04_VENOM_ORACLE_IDLE_DATA.oracle;
  const bob = phase;
  rect(8, 11 + bob, 9, 1, veil[1]);
  rect(9, 12 + bob, 8, 2, veil[0]);
  rect(10, 14 + bob, 6, 1, veil[1]);
  rect(9, 15 + bob, 8, 1, veil[1]);
  rect(14, 12 + bob, 2, 1, gold[0]);
  dot(15, 13 + bob, venom[2]);
  dot(10, 15 + bob, gold[2]);
  dot(15, 15 + bob, gold[0]);
}

export function drawVenomOracleIdentity(context, direction, phase) {
  assert(phase === 0 || phase === 1, 'Venom Oracle identity phase must be F1 or F2.');
  const paint = createPainter(context, direction);
  if (paint.view === 'right') {
    drawSideOracleCrown(paint, phase);
    drawSideOracleVestments(paint, phase);
  } else {
    const rearView = paint.view === 'up';
    drawDownOracleCrown(paint, phase, rearView);
    drawDownOracleVestments(paint, phase, rearView);
  }
}

function renderVenomOracleIdle(args) {
  assert(args.family.id === 'naga', 'The EN-E04 Naga specialist Idle renderer is restricted to Naga.');
  assert(args.variant.id === 'venom-oracle', 'The EN-E04 Naga specialist Idle renderer is restricted to Venom Oracle.');
  assert(args.animation.id === 'idle' && (args.frame === 0 || args.frame === 1), 'The EN-E04 Venom Oracle gate authorizes only two Idle frames.');
  const rendered = EN_E01_HUMANOID_RENDERER.render({
    ...args,
    variant: VENOM_ORACLE_VARIANT,
  });
  args.context.clearRect(0, 15, SIZE, SIZE - 15);
  drawNagaIdleIdentity(args.context, args.direction, args.frame);
  drawVenomOracleIdentity(args.context, args.direction, args.frame);
  return Object.freeze({
    ...rendered,
    family: args.family.id,
    variant: args.variant.id,
    venomOracleIdleGate: EN_E04_VENOM_ORACLE_IDLE_GATE.id,
    approvedPrecedingGate: EN_E04_NAGA_MOTION_GATE.id,
    approvedNagaAnatomyGate: EN_E04_NAGA_IDLE_GATE.id,
    role: EN_E04_VENOM_ORACLE_CONTRACT.role,
    anatomy: EN_E04_VENOM_ORACLE_CONTRACT.chassis,
    lowerBody: 'continuous-direction-aware-serpent-coil',
    effectBoundary: EN_E04_VENOM_ORACLE_IDLE_DATA.effectBoundary,
  });
}

export const EN_E04_VENOM_ORACLE_IDLE_RENDERER = Object.freeze({
  key: 'en-e04-venom-oracle-idle-v1',
  chassis: 'serpentine-humanoid-v1',
  render: renderVenomOracleIdle,
});

export const EN_E04_VENOM_ORACLE_IDLE_FAMILY = deepFreeze({
  id: 'naga',
  name: 'Naga',
  sliceId: 'EN-E04',
  rendererKey: EN_E04_VENOM_ORACLE_IDLE_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [VENOM_ORACLE_VARIANT],
  rendererData: {
    contractCard: 'naga',
    role: EN_E04_VENOM_ORACLE_CONTRACT.role,
    approvedPrecedingGate: EN_E04_NAGA_MOTION_GATE.id,
    approvedNagaAnatomyGate: EN_E04_NAGA_IDLE_GATE.id,
    activeGate: EN_E04_VENOM_ORACLE_IDLE_GATE.id,
  },
  review: {
    baselineVariant: 'venom-oracle',
    scale: 8,
    notes: 'Awaiting visual approval for the specialist two-frame Idle lane; internal, non-public, and effect-free.',
  },
});

export const EN_E04_VENOM_ORACLE_IDLE_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E04_VENOM_ORACLE_IDLE_RENDERER],
  families: [EN_E04_VENOM_ORACLE_IDLE_FAMILY],
});
