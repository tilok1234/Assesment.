import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E01_HUMANOID_RENDERER } from './enemy-expansion-humanoid.js';
import { EN_E03_WILDWOOD_HORNLORD_MOTION_GATE } from './enemy-expansion-en-e03-satyr-elite-motion.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E04_NAGA_CONTRACT_CARD = deepFreeze({
  id: 'naga',
  sliceId: 'EN-E04',
  anatomy: 'upright-serpentine-humanoid',
  silhouetteContract: 'A humanoid upper body flows into one continuous belly-plated serpent tail and a broad grounded coil. No direction may contain ordinary legs, paired feet, or detached foot-like islands.',
  roleOrder: ['common', 'specialist', 'elite'],
  variants: [
    {
      id: 'coilguard',
      name: 'Coilguard',
      role: 'common',
      status: 'implemented-idle-candidate',
      brief: 'Temple threshold guard with a broad cobra hood, bronze torque, scaled flanks, belly plates, and a planted ground coil.',
    },
    {
      id: 'venom-oracle',
      name: 'Venom Oracle',
      role: 'specialist',
      status: 'planned',
      brief: 'Venom-reading ritual specialist reserved for a later separately authorized identity gate.',
    },
    {
      id: 'temple-rajah',
      name: 'Temple Rajah',
      role: 'elite',
      status: 'planned',
      brief: 'Regal armored Naga commander reserved for a later separately authorized identity gate.',
    },
  ],
});

export const EN_E04_NAGA_IDLE_GATE = deepFreeze({
  id: 'en-e04-naga-idle-v1',
  status: 'approved',
  authorizedOn: '2026-08-08',
  authorizationEvidence: 'After the exact Wildwood Hornlord complete-motion suite was approved, published, and reconciled, the designer said: Let\'s do next. The documented EN-E04 priority order starts with Naga, so Codex bounded the continuation to one common Naga Coilguard Idle F1-F2 pair across four directions.',
  approvedOn: '2026-08-08',
  approvalEvidence: 'Designer reviewed both exact labeled all-four-direction raw/no-outline and Complete B + Form Naga Coilguard Idle GIFs together and said: Approved.',
  precedingApproval: {
    gateId: EN_E03_WILDWOOD_HORNLORD_MOTION_GATE.id,
    artifactSha256: EN_E03_WILDWOOD_HORNLORD_MOTION_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_WILDWOOD_HORNLORD_MOTION_GATE.assembledArtifactSha256,
    rawAnimationSha256: EN_E03_WILDWOOD_HORNLORD_MOTION_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E03_WILDWOOD_HORNLORD_MOTION_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E03_WILDWOOD_HORNLORD_MOTION_GATE.candidateFrameDigest,
    publishedCheckpoint: 'd9cb0faa3dff204106598876fe38db5f4ee3237a',
    publishedHandoff: '8c4edba3fa9460d1afdd4409239f35c6078a7534',
  },
  artifact: 'enemy-expansion-review/en-e04-naga-idle/en-e04-naga-coilguard-idle-raw.png',
  artifactSha256: '14edaceb75bce787da88b065ac435e611dd3b03b1eaf07320f0f6b476021c211',
  assembledArtifact: 'enemy-expansion-review/en-e04-naga-idle/en-e04-naga-coilguard-idle-complete-b-form.png',
  assembledArtifactSha256: 'd4af682862093704497f285e4163e5e7b36a056fadd16e5079a4dd89b4f63bc0',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e04-naga-idle/en-e04-naga-coilguard-idle-four-directions-labeled.gif',
      sha256: '70a85f3ab1b94b6207acb161d2a2de93e4ec925748c399b2c1ce6a0075db69ea', width: 192, height: 224, frames: 2, durationMs: 480,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e04-naga-idle/en-e04-naga-coilguard-idle-four-directions-labeled-complete-b-form.gif',
      sha256: 'ded49cd18d9706c741315ec61b9a219012e4e39d50618a79b60ea91bc592528b', width: 192, height: 224, frames: 2, durationMs: 480,
    },
  },
  candidateFrameDigest: '037ed99a5c9d126d175fe3339fdb9f6443e092d0c0faf6bea6aa5f5c8a72c128',
  scope: 'Coilguard common Naga Idle F1-F2 only across Down, Left, Right, and Up, reviewed raw and with Complete B + Form.',
  identityContract: 'A jade-scaled cobra head and hood, amber eyes, bronze torque, dark temple cloth, central belly plates, and one continuous direction-aware ground coil establish the common Naga silhouette. Venom spit, miasma, and coil-impact effects remain external.',
  animationContract: 'A slow 480 ms planted breathing cycle: F2 settles the hood and upper body one row while the lower body compresses into a visibly shifted continuous coil. The tail never resolves into ordinary legs or paired feet.',
  exclusions: [
    'Venom Oracle implementation',
    'Temple Rajah implementation',
    'Merfolk',
    'Birdfolk',
    'Walk',
    'Attack',
    'Cast',
    'Hurt',
    'Death',
    'baked venom-spit pixels',
    'baked miasma pixels',
    'baked coil-impact pixels',
    'registration',
    'consumer exposure',
    'effects',
    'release',
    'later EN-E04 work',
  ],
  nextGate: 'Visual approval and bounded publication are complete for this Coilguard Idle lane. No later Naga role or motion, Merfolk, Birdfolk, registration, integration, effect, release, or broader EN-E04 work is authorized without a separate explicit continuation.',
});

export const EN_E04_NAGA_IDLE_DATA = deepFreeze({
  actor: {
    species: 'human',
    bodyBuild: 'classic',
    skin: 'olive',
    hairStyle: 'short',
    hairColor: 'black',
    expression: 'stern',
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
      skin: ['#79b47d', '#2f5d48'],
      hair: ['#27473b', '#172d28'],
      outfit: ['#765d35', '#3f3426', '#c8903f'],
    },
  },
  identity: { overlays: [] },
  naga: {
    scale: ['#4d8b67', '#2f5d48', '#79b47d'],
    belly: ['#c8a85f', '#765d35', '#ead27d'],
    hood: ['#3e6e5b', '#1f4238', '#72a978'],
    eye: ['#f0c552', '#7c3d2a'],
    cloth: ['#4a3828', '#281f1b'],
    bronze: ['#c8903f', '#6b4727', '#edc76d'],
  },
  effectBoundary: 'external-venom-spit-miasma-and-coil-impact',
  bakedEffects: [],
});

const COILGUARD_VARIANT = deepFreeze({
  id: 'coilguard',
  name: 'Coilguard',
  brief: 'Common cobra-hooded Naga threshold guard with a continuous plated tail; only the two-frame Idle anatomy baseline is implemented and all combat effects remain external.',
  rendererData: EN_E04_NAGA_IDLE_DATA,
});

function createPainter(context, direction) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Naga rectangles must use positive integer geometry.',
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

function drawDownHood({ rect, dot }, phase, rearView) {
  const { hood, scale, eye, bronze } = EN_E04_NAGA_IDLE_DATA.naga;
  const bob = phase;
  const main = rearView ? hood[1] : hood[0];
  const shade = rearView ? hood[0] : hood[1];

  rect(7, 4 + bob, 10, 1, shade);
  rect(5, 5 + bob, 14, 4, main);
  rect(6, 9 + bob, 12, 2, shade);
  rect(8, 4 + bob, 8, 6, scale[0]);
  rect(9, 5 + bob, 6, 5, rearView ? scale[1] : scale[2]);
  dot(6, 6 + bob, hood[2]);
  dot(17, 6 + bob, hood[2]);
  dot(7, 9 + bob, scale[2]);
  dot(16, 9 + bob, scale[2]);
  if (rearView) {
    rect(11, 5 + bob, 2, 5, scale[0]);
    dot(11, 5 + bob, hood[2]);
    dot(12, 7 + bob, hood[2]);
  } else {
    dot(10, 7 + bob, eye[0]);
    dot(13, 7 + bob, eye[0]);
    dot(10, 8 + bob, eye[1]);
    dot(13, 8 + bob, eye[1]);
    rect(11, 9 + bob, 2, 1, scale[1]);
  }
  rect(9, 11 + bob, 6, 1, bronze[1]);
  dot(rearView ? 13 : 10, 11 + bob, bronze[2]);
}

function drawSideHood({ rect, dot }, phase) {
  const { hood, scale, eye, bronze } = EN_E04_NAGA_IDLE_DATA.naga;
  const bob = phase;

  rect(7, 5 + bob, 4, 5, hood[1]);
  rect(8, 4 + bob, 6, 7, hood[0]);
  rect(10, 4 + bob, 6, 6, scale[0]);
  rect(12, 5 + bob, 5, 5, scale[2]);
  rect(16, 6 + bob, 3, 3, scale[2]);
  dot(19, 7 + bob, scale[0]);
  dot(16, 6 + bob, eye[0]);
  dot(17, 7 + bob, eye[1]);
  dot(18, 8 + bob, scale[1]);
  dot(8, 6 + bob, hood[2]);
  dot(8, 9 + bob, hood[2]);
  rect(10, 11 + bob, 6, 1, bronze[1]);
  dot(15, 11 + bob, bronze[2]);
}

function drawDownTail({ rect, dot }, phase, rearView) {
  const { scale, belly, cloth, bronze } = EN_E04_NAGA_IDLE_DATA.naga;
  const start = 15 + phase;

  rect(9, 15, 6, 1, scale[1]);
  rect(8, start, 8, 1, cloth[1]);
  rect(9, start + 1, 6, 2, scale[0]);
  rect(10, start + 3, 5, 1, scale[0]);
  if (phase === 0) {
    rect(9, 19, 7, 1, scale[1]);
    rect(7, 20, 11, 1, scale[0]);
    rect(6, 21, 12, 1, scale[1]);
    rect(8, 22, 9, 1, scale[0]);
    dot(18, 20, scale[2]);
  } else {
    rect(8, 19, 9, 1, scale[1]);
    rect(6, 20, 13, 1, scale[0]);
    rect(5, 21, 14, 1, scale[1]);
    rect(8, 22, 9, 1, scale[0]);
    dot(19, 20, scale[2]);
  }
  if (rearView) {
    rect(11, start + 1, 2, 4, scale[2]);
    dot(12, start + 1, scale[1]);
    dot(11, start + 3, scale[1]);
  } else {
    rect(10, start + 1, 4, 1, belly[2]);
    rect(10, start + 2, 4, 1, belly[0]);
    rect(10, start + 3, 4, 1, belly[1]);
    rect(10, start + 4, 3, 1, belly[0]);
  }
  rect(8, start, 8, 1, cloth[0]);
  dot(11, start, bronze[2]);
  dot(14, start, bronze[0]);
}

function drawSideTail({ rect, dot }, phase) {
  const { scale, belly, cloth, bronze } = EN_E04_NAGA_IDLE_DATA.naga;
  const start = 15 + phase;

  rect(10, 15, 6, 1, scale[1]);
  rect(9, start, 8, 1, cloth[0]);
  rect(10, start + 1, 6, 1, scale[0]);
  rect(9, start + 2, 6, 1, scale[0]);
  if (phase === 0) {
    rect(8, 18, 6, 1, scale[0]);
    rect(7, 19, 7, 1, scale[1]);
    rect(6, 20, 11, 1, scale[0]);
    rect(5, 21, 14, 1, scale[1]);
    rect(7, 22, 11, 1, scale[0]);
    rect(17, 20, 3, 1, scale[2]);
  } else {
    rect(8, 19, 8, 1, scale[1]);
    rect(6, 20, 13, 1, scale[0]);
    rect(5, 21, 15, 1, scale[1]);
    rect(8, 22, 10, 1, scale[0]);
    dot(20, 21, scale[2]);
  }
  dot(10, start + 1, belly[2]);
  rect(9, start + 2, 2, 1, belly[0]);
  dot(8, Math.min(19, start + 3), belly[1]);
  dot(12, start, bronze[2]);
  dot(15, start, bronze[0]);
}

export function drawNagaIdleIdentity(context, direction, phase) {
  assert(phase === 0 || phase === 1, 'Naga Idle identity phase must be F1 or F2.');
  const paint = createPainter(context, direction);
  if (paint.view === 'right') {
    drawSideTail(paint, phase);
    drawSideHood(paint, phase);
  } else {
    drawDownTail(paint, phase, paint.view === 'up');
    drawDownHood(paint, phase, paint.view === 'up');
  }
}

function renderNagaIdle(args) {
  assert(args.family.id === 'naga', 'The EN-E04 Naga Idle renderer is restricted to Naga.');
  assert(args.variant.id === 'coilguard', 'The EN-E04 Naga Idle renderer is restricted to Coilguard.');
  assert(args.animation.id === 'idle' && (args.frame === 0 || args.frame === 1), 'The EN-E04 Naga gate authorizes only two Idle frames.');
  const rendered = EN_E01_HUMANOID_RENDERER.render({
    ...args,
    variant: COILGUARD_VARIANT,
  });
  args.context.clearRect(0, 15, SIZE, SIZE - 15);
  drawNagaIdleIdentity(args.context, args.direction, args.frame);
  return Object.freeze({
    ...rendered,
    nagaIdleGate: EN_E04_NAGA_IDLE_GATE.id,
    approvedPrecedingGate: EN_E03_WILDWOOD_HORNLORD_MOTION_GATE.id,
    anatomy: EN_E04_NAGA_CONTRACT_CARD.anatomy,
    lowerBody: 'continuous-direction-aware-serpent-coil',
    effectBoundary: EN_E04_NAGA_IDLE_DATA.effectBoundary,
  });
}

export const EN_E04_NAGA_IDLE_RENDERER = Object.freeze({
  key: 'en-e04-naga-idle-v1',
  chassis: 'serpentine-humanoid-v1',
  render: renderNagaIdle,
});

export const EN_E04_NAGA_IDLE_FAMILY = deepFreeze({
  id: 'naga',
  name: 'Naga',
  sliceId: 'EN-E04',
  rendererKey: EN_E04_NAGA_IDLE_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [COILGUARD_VARIANT],
  rendererData: {
    contractCard: EN_E04_NAGA_CONTRACT_CARD.id,
    approvedPrecedingGate: EN_E03_WILDWOOD_HORNLORD_MOTION_GATE.id,
    activeGate: EN_E04_NAGA_IDLE_GATE.id,
  },
  review: {
    baselineVariant: 'coilguard',
    scale: 8,
    notes: 'Visually approved common two-frame Idle anatomy baseline; internal, non-public, and effect-free.',
  },
});

export const EN_E04_NAGA_IDLE_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E04_NAGA_IDLE_RENDERER],
  families: [EN_E04_NAGA_IDLE_FAMILY],
});
