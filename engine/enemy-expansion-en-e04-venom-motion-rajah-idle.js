import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E01_HUMANOID_RENDERER } from './enemy-expansion-humanoid.js';
import {
  drawNagaIdleIdentity,
  EN_E04_NAGA_CONTRACT_CARD,
  EN_E04_NAGA_IDLE_DATA,
  EN_E04_NAGA_IDLE_GATE,
} from './enemy-expansion-en-e04-naga-idle.js';
import {
  EN_E04_NAGA_ATTACK_PHASES,
  EN_E04_NAGA_DEATH_SOURCE_FRAMES,
  EN_E04_NAGA_HURT_PHASES,
  EN_E04_NAGA_MOTION_FAMILY,
  EN_E04_NAGA_MOTION_GATE,
  EN_E04_NAGA_MOTION_RENDERER,
  EN_E04_NAGA_WALK_PHASES,
} from './enemy-expansion-en-e04-naga-motion.js';
import {
  drawVenomOracleIdentity,
  EN_E04_VENOM_ORACLE_CONTRACT,
  EN_E04_VENOM_ORACLE_IDLE_DATA,
  EN_E04_VENOM_ORACLE_IDLE_FAMILY,
  EN_E04_VENOM_ORACLE_IDLE_GATE,
  EN_E04_VENOM_ORACLE_IDLE_RENDERER,
} from './enemy-expansion-en-e04-naga-specialist-idle.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

const COILGUARD_VARIANT = EN_E04_NAGA_MOTION_FAMILY.variants.find(
  (entry) => entry.id === 'coilguard',
);
const VENOM_ORACLE_VARIANT = EN_E04_VENOM_ORACLE_IDLE_FAMILY.variants.find(
  (entry) => entry.id === 'venom-oracle',
);
assert(COILGUARD_VARIANT, 'The approved Coilguard motion source is required.');
assert(VENOM_ORACLE_VARIANT, 'The approved Venom Oracle Idle source is required.');

export const EN_E04_TEMPLE_RAJAH_CONTRACT = deepFreeze({
  family: 'naga',
  variant: 'temple-rajah',
  role: 'elite',
  state: 'implemented-idle-candidate',
  chassis: 'upright-serpentine-humanoid',
  identity: 'Regal crimson-and-gold temple crown, broad gilded pauldrons, ivory chest plate, royal sash jewel, and the approved continuous belly-plated Naga coil.',
  effectBoundary: 'Command auras, royal sigils, sun flares, temple wards, and coil impacts remain external.',
});

export const EN_E04_NAGA_EXPANDED_SLICE_GATE = deepFreeze({
  id: 'en-e04-venom-motion-rajah-idle-v1',
  status: 'approved',
  authorizedOn: '2026-08-08',
  authorizationEvidence: 'After approving and publishing the Venom Oracle Idle baseline, the designer asked to try bigger slices. Codex proposed one combined 88-frame review boundary containing the complete Venom Oracle standard suite plus Temple Rajah Idle F1-F2, and the designer said: sure lets do that.',
  approvedOn: '2026-08-08',
  approvalEvidence: 'Designer reviewed both exact combined labeled all-four-direction raw/no-outline and Complete B + Form GIFs, located Temple Rajah in the bottom R IDLE row, and said: oh right sorry i had to scroll down approved.',
  precedingApproval: {
    gateId: EN_E04_VENOM_ORACLE_IDLE_GATE.id,
    artifactSha256: EN_E04_VENOM_ORACLE_IDLE_GATE.artifactSha256,
    assembledArtifactSha256: EN_E04_VENOM_ORACLE_IDLE_GATE.assembledArtifactSha256,
    rawAnimationSha256: EN_E04_VENOM_ORACLE_IDLE_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E04_VENOM_ORACLE_IDLE_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E04_VENOM_ORACLE_IDLE_GATE.candidateFrameDigest,
    publishedCheckpoint: '3365d9915ed0ac1e506470604ed1e83c84606181',
    publishedHandoff: '2e14485',
  },
  approvedMotionBaseline: {
    gateId: EN_E04_NAGA_MOTION_GATE.id,
    candidateFrameDigest: EN_E04_NAGA_MOTION_GATE.candidateFrameDigest,
  },
  approvedAnatomyBaseline: {
    gateId: EN_E04_NAGA_IDLE_GATE.id,
    candidateFrameDigest: EN_E04_NAGA_IDLE_GATE.candidateFrameDigest,
  },
  artifact: 'enemy-expansion-review/en-e04-venom-motion-rajah-idle/en-e04-venom-motion-rajah-idle-raw.png',
  artifactSha256: '9221b2b10230b9de58f26b0548eac445921e8531baec59b404a9bd04227c5ba5',
  assembledArtifact: 'enemy-expansion-review/en-e04-venom-motion-rajah-idle/en-e04-venom-motion-rajah-idle-complete-b-form.png',
  assembledArtifactSha256: 'da4d837e6d25a110fd6e2297687fda852d8a71b024d6748674c299eaacb26594',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e04-venom-motion-rajah-idle/en-e04-venom-motion-rajah-idle-four-directions-labeled.gif',
      sha256: '0be77ec47d6e3bdc701034b8d69aa3e1597b6b92cf8c51a1d1d725c330ce0f4b', width: 640, height: 776, frames: 4, durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e04-venom-motion-rajah-idle/en-e04-venom-motion-rajah-idle-four-directions-labeled-complete-b-form.gif',
      sha256: '272bc1b139d51fac8383a1a103c0aa545ca97893bf1774fadd6adaeba88deb6c', width: 640, height: 776, frames: 4, durationMs: 720,
    },
  },
  candidateFrameDigest: '81a087b81df560f7676024484114b550d02ce5c6424f040f4c1765f2231a4e77',
  scope: 'One combined 88-frame review slice: the approved Venom Oracle Idle F1-F2 plus Venom Oracle Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast/Death aliases, and Temple Rajah Idle F1-F2, all across Down, Left, Right, and Up.',
  motionContract: 'Venom Oracle inherits the approved four-phase planted slither, full-body coil strike, and planted Hurt choreography while its crown, mantle, sigil, and hood respond to every phase; upward phases brace the tall crown at the one-cell ceiling. Cast aliases Attack exactly and Death aliases Hurt H1,H2,H2,H2. Temple Rajah receives only a slow two-frame planted royal-breathing Idle.',
  reviewPresentation: 'Show one combined labeled four-direction raw/no-outline board and GIF beside one matching Complete B + Form board and GIF. All six Venom Oracle animations and the Temple Rajah Idle row remain visible together.',
  exclusions: [
    'approved Coilguard pixel changes',
    'approved Venom Oracle Idle pixel changes',
    'Temple Rajah Walk',
    'Temple Rajah Attack',
    'Temple Rajah Cast',
    'Temple Rajah Hurt',
    'Temple Rajah Death',
    'Merfolk',
    'Birdfolk',
    'new Venom Oracle Cast pixels',
    'new Venom Oracle Death pixels',
    'baked venom-orb pixels',
    'baked miasma pixels',
    'baked ritual-sigil pixels',
    'baked command-aura pixels',
    'baked temple-ward pixels',
    'baked coil-impact pixels',
    'registration',
    'consumer exposure',
    'effects',
    'release',
    'later EN-E04 work',
  ],
  nextGate: 'Visual approval is complete and bounded publication is authorized for this exact combined 88-frame slice. After publication, no Temple Rajah motion, other family, registration, integration, effect, release, or broader EN-E04 work is authorized without a separately bounded continuation.',
});

export const EN_E04_TEMPLE_RAJAH_IDLE_DATA = deepFreeze({
  actor: {
    ...EN_E04_NAGA_IDLE_DATA.actor,
    outfit: 'armor',
    palette: {
      skin: [...EN_E04_NAGA_IDLE_DATA.actor.palette.skin],
      hair: [...EN_E04_NAGA_IDLE_DATA.actor.palette.hair],
      outfit: ['#b93f50', '#6d2432', '#d7ad46'],
    },
  },
  identity: EN_E04_NAGA_IDLE_DATA.identity,
  naga: EN_E04_NAGA_IDLE_DATA.naga,
  rajah: {
    crimson: ['#b93f50', '#6d2432', '#ec6971'],
    gold: ['#d7ad46', '#765522', '#f5dc78'],
    ivory: ['#f3e4bd', '#a78c62', '#fff3cf'],
  },
  effectBoundary: 'external-command-auras-royal-sigils-sun-flares-temple-wards-and-coil-impact',
  bakedEffects: [],
});

const TEMPLE_RAJAH_VARIANT = deepFreeze({
  id: 'temple-rajah',
  name: 'Temple Rajah',
  role: EN_E04_TEMPLE_RAJAH_CONTRACT.role,
  status: EN_E04_TEMPLE_RAJAH_CONTRACT.state,
  brief: 'Elite Naga temple commander with a tall royal crown, crimson-and-gold armor, broad pauldrons, ivory chest plate, planted coil, and external command/ward effects; only Idle F1-F2 is implemented.',
  rendererData: EN_E04_TEMPLE_RAJAH_IDLE_DATA,
});

function createTransformedContext(context, shift = { x: 0, y: 0 }, forcedColor = null) {
  let fillStyle = context.fillStyle;
  return {
    get fillStyle() {
      return forcedColor || fillStyle;
    },
    set fillStyle(value) {
      fillStyle = value;
      context.fillStyle = forcedColor || value;
    },
    onOutOfBounds(write) {
      if (typeof context.onOutOfBounds === 'function') {
        context.onOutOfBounds({ ...write, x: write.x + shift.x, y: write.y + shift.y });
      }
    },
    clearRect(x, y, width, height) {
      if (x === 0 && y === 0 && width >= SIZE && height >= SIZE) {
        context.clearRect(0, 0, SIZE, SIZE);
        return;
      }
      context.clearRect(x + shift.x, y + shift.y, width, height);
    },
    fillRect(x, y, width, height) {
      context.fillStyle = forcedColor || fillStyle;
      context.fillRect(x + shift.x, y + shift.y, width, height);
    },
  };
}

function physicalShift(direction, phase) {
  if (direction === 'right') return Object.freeze({ x: phase.forward, y: phase.lift });
  if (direction === 'left') return Object.freeze({ x: -phase.forward, y: phase.lift });
  return Object.freeze({
    x: 0,
    y: phase.lift + (direction === 'down' ? phase.forward : -phase.forward),
  });
}

function venomPhase(animation, frame) {
  if (animation === 'walk') return { ...EN_E04_NAGA_WALK_PHASES[frame], forward: 0, lift: 0, flash: false };
  if (animation === 'attack' || animation === 'cast') return { ...EN_E04_NAGA_ATTACK_PHASES[frame], flash: false };
  if (animation === 'hurt') return EN_E04_NAGA_HURT_PHASES[frame];
  if (animation === 'death') return EN_E04_NAGA_HURT_PHASES[EN_E04_NAGA_DEATH_SOURCE_FRAMES[frame]];
  throw new TypeError('Venom Oracle phase lookup accepts only motion animations.');
}

function renderVenomOracleMotion(args) {
  assert(args.family.id === 'naga', 'The expanded EN-E04 renderer is restricted to Naga.');
  assert(args.variant.id === 'venom-oracle', 'This motion path is restricted to Venom Oracle.');
  if (args.animation.id === 'idle') {
    assert(args.frame === 0 || args.frame === 1, 'Venom Oracle Idle authorizes only F1-F2.');
    const source = EN_E04_VENOM_ORACLE_IDLE_RENDERER.render(args);
    return Object.freeze({
      ...source,
      expandedSliceGate: EN_E04_NAGA_EXPANDED_SLICE_GATE.id,
      motion: 'approved-venom-idle-byte-exact',
    });
  }

  const frameLimits = { walk: 4, attack: 4, cast: 4, hurt: 2, death: 4 };
  const frameLimit = frameLimits[args.animation.id];
  assert(frameLimit && args.frame >= 0 && args.frame < frameLimit, 'Venom Oracle authorizes only the standard bounded motion frames.');
  const source = EN_E04_NAGA_MOTION_RENDERER.render({
    ...args,
    variant: COILGUARD_VARIANT,
  });
  const phase = venomPhase(args.animation.id, args.frame);
  const bodyShift = physicalShift(args.direction, phase);
  const identityShift = Object.freeze({ x: bodyShift.x, y: Math.max(0, bodyShift.y) });
  drawVenomOracleIdentity(
    createTransformedContext(
      args.context,
      identityShift,
      phase.flash ? '#ffffff' : null,
    ),
    args.direction,
    phase.hoodPhase,
  );
  return Object.freeze({
    ...source,
    family: args.family.id,
    variant: args.variant.id,
    direction: args.direction,
    animation: args.animation.id,
    frame: args.frame,
    expandedSliceGate: EN_E04_NAGA_EXPANDED_SLICE_GATE.id,
    approvedVenomIdleGate: EN_E04_VENOM_ORACLE_IDLE_GATE.id,
    approvedMotionSourceGate: EN_E04_NAGA_MOTION_GATE.id,
    role: EN_E04_VENOM_ORACLE_CONTRACT.role,
    anatomy: EN_E04_VENOM_ORACLE_CONTRACT.chassis,
    lowerBody: 'continuous-planted-serpent-coil',
    motion: args.animation.id === 'cast'
      ? 'exact-cast-alias-of-venom-attack'
      : args.animation.id === 'death'
        ? 'exact-death-alias-of-venom-hurt'
        : 'venom-identity-over-approved-naga-' + args.animation.id,
    effectBoundary: EN_E04_VENOM_ORACLE_IDLE_DATA.effectBoundary,
  });
}

function createPainter(context, direction) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Temple Rajah rectangles must use positive integer geometry.',
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

function drawFrontRajahCrown({ rect, dot }, phase, rearView) {
  const { crimson, gold, ivory } = EN_E04_TEMPLE_RAJAH_IDLE_DATA.rajah;
  const bob = phase;
  rect(10, 1 + bob, 4, 2, gold[1]);
  rect(11, 1 + bob, 2, 1, gold[2]);
  dot(12, 2 + bob, crimson[2]);
  rect(9, 3 + bob, 6, 1, gold[0]);
  rect(8, 4 + bob, 8, 1, crimson[1]);
  rect(10, 4 + bob, 4, 1, gold[2]);
  dot(8, 3 + bob, ivory[2]);
  dot(15, 3 + bob, ivory[2]);
  if (rearView) {
    rect(11, 5 + bob, 2, 2, crimson[0]);
    dot(12, 5 + bob, gold[2]);
  } else {
    dot(10, 7 + bob, crimson[2]);
    dot(13, 7 + bob, crimson[2]);
  }
}

function drawSideRajahCrown({ rect, dot }, phase) {
  const { crimson, gold, ivory } = EN_E04_TEMPLE_RAJAH_IDLE_DATA.rajah;
  const bob = phase;
  rect(12, 1 + bob, 3, 2, gold[1]);
  dot(13, 1 + bob, gold[2]);
  dot(14, 2 + bob, crimson[2]);
  rect(10, 3 + bob, 6, 1, gold[0]);
  rect(9, 4 + bob, 7, 1, crimson[1]);
  rect(11, 4 + bob, 4, 1, gold[2]);
  dot(9, 3 + bob, ivory[2]);
  dot(16, 3 + bob, ivory[2]);
}

function drawFrontRajahArmor({ rect, dot }, phase, rearView) {
  const { crimson, gold, ivory } = EN_E04_TEMPLE_RAJAH_IDLE_DATA.rajah;
  const bob = phase;
  rect(6, 10 + bob, 4, 2, gold[1]);
  rect(14, 10 + bob, 4, 2, gold[1]);
  rect(7, 10 + bob, 2, 1, gold[2]);
  rect(15, 10 + bob, 2, 1, gold[2]);
  rect(8, 11 + bob, 8, 3, crimson[1]);
  rect(9, 11 + bob, 6, 2, ivory[0]);
  rect(10, 13 + bob, 4, 2, crimson[0]);
  rect(9, 15 + bob, 6, 1, gold[0]);
  dot(11, 13 + bob, rearView ? gold[2] : crimson[2]);
  dot(12, 14 + bob, gold[2]);
}

function drawSideRajahArmor({ rect, dot }, phase) {
  const { crimson, gold, ivory } = EN_E04_TEMPLE_RAJAH_IDLE_DATA.rajah;
  const bob = phase;
  rect(7, 10 + bob, 4, 2, gold[1]);
  rect(14, 10 + bob, 4, 2, gold[1]);
  rect(8, 10 + bob, 2, 1, gold[2]);
  rect(15, 10 + bob, 2, 1, gold[2]);
  rect(9, 11 + bob, 8, 3, crimson[1]);
  rect(11, 11 + bob, 5, 2, ivory[0]);
  rect(10, 13 + bob, 6, 2, crimson[0]);
  rect(10, 15 + bob, 7, 1, gold[0]);
  dot(14, 12 + bob, crimson[2]);
  dot(12, 14 + bob, gold[2]);
}

export function drawTempleRajahIdentity(context, direction, phase) {
  assert(phase === 0 || phase === 1, 'Temple Rajah identity phase must be F1 or F2.');
  const paint = createPainter(context, direction);
  if (paint.view === 'right') {
    drawSideRajahCrown(paint, phase);
    drawSideRajahArmor(paint, phase);
  } else {
    const rearView = paint.view === 'up';
    drawFrontRajahCrown(paint, phase, rearView);
    drawFrontRajahArmor(paint, phase, rearView);
  }
}

function renderTempleRajahIdle(args) {
  assert(args.family.id === 'naga', 'The expanded EN-E04 renderer is restricted to Naga.');
  assert(args.variant.id === 'temple-rajah', 'This Idle path is restricted to Temple Rajah.');
  assert(args.animation.id === 'idle' && (args.frame === 0 || args.frame === 1), 'Temple Rajah authorizes only Idle F1-F2.');
  const source = EN_E01_HUMANOID_RENDERER.render({
    ...args,
    variant: TEMPLE_RAJAH_VARIANT,
  });
  args.context.clearRect(0, 15, SIZE, SIZE - 15);
  drawNagaIdleIdentity(args.context, args.direction, args.frame);
  drawTempleRajahIdentity(args.context, args.direction, args.frame);
  return Object.freeze({
    ...source,
    family: args.family.id,
    variant: args.variant.id,
    direction: args.direction,
    animation: args.animation.id,
    frame: args.frame,
    expandedSliceGate: EN_E04_NAGA_EXPANDED_SLICE_GATE.id,
    approvedNagaAnatomyGate: EN_E04_NAGA_IDLE_GATE.id,
    role: EN_E04_TEMPLE_RAJAH_CONTRACT.role,
    anatomy: EN_E04_TEMPLE_RAJAH_CONTRACT.chassis,
    lowerBody: 'continuous-direction-aware-serpent-coil',
    motion: 'temple-rajah-two-frame-planted-idle',
    effectBoundary: EN_E04_TEMPLE_RAJAH_IDLE_DATA.effectBoundary,
  });
}

function renderExpandedNagaSlice(args) {
  if (args.variant.id === 'venom-oracle') return renderVenomOracleMotion(args);
  if (args.variant.id === 'temple-rajah') return renderTempleRajahIdle(args);
  throw new TypeError('The expanded EN-E04 slice implements only Venom Oracle and Temple Rajah.');
}

export const EN_E04_NAGA_EXPANDED_SLICE_RENDERER = Object.freeze({
  key: 'en-e04-venom-motion-rajah-idle-v1',
  chassis: 'serpentine-humanoid-v1',
  render: renderExpandedNagaSlice,
});

export const EN_E04_NAGA_EXPANDED_SLICE_FAMILY = deepFreeze({
  id: 'naga',
  name: 'Naga',
  sliceId: 'EN-E04',
  rendererKey: EN_E04_NAGA_EXPANDED_SLICE_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [
    {
      ...VENOM_ORACLE_VARIANT,
      brief: 'Approved Venom Oracle Idle plus the authorized complete standard motion suite, using exact Cast/Death aliases and external venom/miasma/ritual effects.',
    },
    TEMPLE_RAJAH_VARIANT,
  ],
  rendererData: {
    contractCard: EN_E04_NAGA_CONTRACT_CARD.id,
    approvedVenomIdleGate: EN_E04_VENOM_ORACLE_IDLE_GATE.id,
    approvedNagaMotionGate: EN_E04_NAGA_MOTION_GATE.id,
    activeGate: EN_E04_NAGA_EXPANDED_SLICE_GATE.id,
  },
  review: {
    baselineVariant: 'venom-oracle',
    scale: 6,
    notes: 'Awaiting paired visual approval for the combined Venom Oracle complete-motion and Temple Rajah Idle slice; internal, non-public, and effect-free.',
  },
});

export const EN_E04_NAGA_EXPANDED_SLICE_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E04_NAGA_EXPANDED_SLICE_RENDERER],
  families: [EN_E04_NAGA_EXPANDED_SLICE_FAMILY],
});
