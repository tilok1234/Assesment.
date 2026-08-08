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
  EN_E04_NAGA_IDLE_FAMILY,
  EN_E04_NAGA_IDLE_GATE,
  EN_E04_NAGA_IDLE_RENDERER,
} from './enemy-expansion-en-e04-naga-idle.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

const COILGUARD_VARIANT = EN_E04_NAGA_IDLE_FAMILY.variants.find(
  (entry) => entry.id === 'coilguard',
);
assert(COILGUARD_VARIANT, 'The approved Naga Coilguard Idle variant is required for complete motion.');

export const EN_E04_NAGA_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

export const EN_E04_NAGA_WALK_PHASES = deepFreeze([
  { name: 'left-wave', hoodPhase: 0 },
  { name: 'center-compress', hoodPhase: 1 },
  { name: 'right-wave', hoodPhase: 0 },
  { name: 'travel-recover', hoodPhase: 1 },
]);

export const EN_E04_NAGA_ATTACK_PHASES = deepFreeze([
  { name: 'coil-brace', forward: -1, lift: 0, hoodPhase: 0 },
  { name: 'cobra-rise', forward: -1, lift: -1, hoodPhase: 0 },
  { name: 'forward-strike', forward: 1, lift: 0, hoodPhase: 0 },
  { name: 'coil-recover', forward: 0, lift: 0, hoodPhase: 1 },
]);

export const EN_E04_NAGA_HURT_PHASES = deepFreeze([
  { name: 'white-recoil', forward: -1, lift: -1, hoodPhase: 0, flash: true },
  { name: 'braced-recovery', forward: 0, lift: 0, hoodPhase: 1, flash: false },
]);

export const EN_E04_NAGA_MOTION_GATE = deepFreeze({
  id: 'en-e04-naga-coilguard-motion-v1',
  status: 'approved',
  authorizedOn: '2026-08-08',
  authorizationEvidence: 'The designer explicitly asked Codex to check out codex/en-e04-naga-idle and continue the enemy-expansion lane, then clarified that tilok1234/Assesment is the current v2 repository after its workflow cleanup. Codex bounded that continuation to one complete Naga Coilguard motion suite only.',
  approvedOn: '2026-08-08',
  approvalEvidence: 'Designer reviewed both exact labeled all-four-direction raw/no-outline and Complete B + Form Naga Coilguard motion-suite GIFs together and said: approved.',
  approvedIdle: {
    gateId: EN_E04_NAGA_IDLE_GATE.id,
    artifactSha256: EN_E04_NAGA_IDLE_GATE.artifactSha256,
    assembledArtifactSha256: EN_E04_NAGA_IDLE_GATE.assembledArtifactSha256,
    rawAnimationSha256: EN_E04_NAGA_IDLE_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E04_NAGA_IDLE_GATE.reviewAnimations.completeBForm.sha256,
    frameDigest: EN_E04_NAGA_IDLE_GATE.candidateFrameDigest,
    publishedCheckpoint: '26151e1',
    v2WorkflowIntegrationCheckpoint: 'a81d324',
  },
  artifact: 'enemy-expansion-review/en-e04-naga-motion/en-e04-naga-coilguard-motion-suite-raw.png',
  artifactSha256: 'c07dd2284c86e4ded62afb9f7124003d471445a7ee910ca746d55e41c7ac6e54',
  assembledArtifact: 'enemy-expansion-review/en-e04-naga-motion/en-e04-naga-coilguard-motion-suite-complete-b-form.png',
  assembledArtifactSha256: 'e8d5d915cfcc4ca3688ded2b61d2d32a11edfb6976b874a1300cf789d3e829ab',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e04-naga-motion/en-e04-naga-coilguard-motion-suite-four-directions-labeled.gif',
      sha256: '74732f35384ecaef63e9131082d95444f401ebb498e1e2a37b82e16c770a1dc0', width: 640, height: 672, frames: 4, durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e04-naga-motion/en-e04-naga-coilguard-motion-suite-four-directions-labeled-complete-b-form.gif',
      sha256: 'b5a7f20bcf88adefe82d17459b1663b8841ea17aba71cad2a7a1eb81fa455dca', width: 640, height: 672, frames: 4, durationMs: 720,
    },
  },
  candidateFrameDigest: 'f94b2c647275c9ab7d79433e29fa37f37285c2a203ad87be6631efbb02642c0b',
  scope: 'Coilguard common Naga Walk W1-W4, Attack A1-A4, Hurt H1-H2, Cast C1-C4, and Death D1-D4 across Down, Left, Right, and Up, with approved Idle F1-F2 delegated byte-for-byte.',
  animationContract: 'Walk uses four distinct planted slither phases while the cobra hood follows the upper-body settle. Attack uses four full-body phases: coil brace, cobra rise, forward strike, and coil recovery. Hurt uses a complete-silhouette white recoil and colored braced recovery while the ground coil stays planted. Cast aliases Coilguard Attack frame-for-frame; Death aliases Coilguard Hurt H1,H2,H2,H2.',
  identityContract: EN_E04_NAGA_IDLE_GATE.identityContract,
  reviewPresentation: 'Show the exact labeled all-four-direction motion-suite raw/no-outline and Complete B + Form boards and GIFs together. The four GIF phases display approved Idle context plus Walk, Attack, Cast, Hurt, and Death simultaneously.',
  exclusions: [
    'approved Coilguard Idle pixel changes',
    'Venom Oracle implementation',
    'Temple Rajah implementation',
    'Merfolk',
    'Birdfolk',
    'new Cast pixels',
    'new Death pixels',
    'baked venom-spit pixels',
    'baked miasma pixels',
    'baked coil-impact pixels',
    'registration',
    'consumer exposure',
    'effects',
    'release',
    'later EN-E04 work',
  ],
  nextGate: 'Visual approval and bounded publication are complete for this Naga Coilguard motion lane. No later Naga role or family, Merfolk, Birdfolk, registration, integration, effect, release, or broader EN-E04 work is authorized without a separate explicit continuation.',
});

const WALK_TAILS = deepFreeze([
  {
    front: [[8, 8], [9, 6], [9, 6], [8, 8], [6, 11], [4, 15], [5, 15], [7, 11]],
    side: [[9, 8], [10, 6], [9, 7], [8, 8], [6, 11], [4, 16], [5, 16], [7, 12]],
  },
  {
    front: [[8, 8], [9, 6], [10, 5], [9, 7], [7, 10], [5, 13], [6, 14], [8, 10]],
    side: [[9, 8], [10, 6], [9, 7], [8, 9], [7, 11], [5, 14], [6, 15], [8, 11]],
  },
  {
    front: [[8, 8], [9, 6], [10, 5], [10, 7], [8, 11], [6, 14], [5, 15], [7, 11]],
    side: [[9, 8], [10, 6], [10, 7], [9, 8], [8, 11], [6, 14], [5, 16], [7, 12]],
  },
  {
    front: [[8, 8], [9, 6], [9, 6], [8, 8], [6, 12], [5, 14], [4, 15], [7, 11]],
    side: [[9, 8], [10, 6], [9, 7], [8, 9], [6, 12], [5, 15], [4, 16], [7, 12]],
  },
]);

const ATTACK_TAILS = deepFreeze([
  {
    front: [[8, 8], [9, 6], [9, 6], [8, 8], [6, 12], [4, 16], [3, 18], [6, 13]],
    side: [[9, 8], [10, 6], [9, 7], [8, 9], [6, 13], [4, 17], [3, 18], [6, 14]],
  },
  {
    front: [[8, 8], [9, 6], [10, 5], [9, 7], [8, 8], [7, 10], [6, 12], [8, 9]],
    side: [[9, 8], [10, 6], [10, 6], [9, 7], [8, 9], [6, 12], [5, 13], [7, 10]],
  },
  {
    front: [[8, 8], [9, 6], [9, 6], [8, 8], [7, 10], [5, 14], [4, 17], [7, 12]],
    side: [[9, 8], [10, 6], [9, 7], [8, 9], [5, 12], [3, 16], [2, 18], [4, 14]],
  },
  {
    front: [[8, 8], [9, 6], [9, 6], [8, 8], [7, 10], [5, 14], [5, 15], [8, 10]],
    side: [[9, 8], [10, 6], [9, 7], [8, 9], [6, 12], [5, 15], [5, 15], [8, 11]],
  },
]);

const HURT_TAIL = deepFreeze({
  front: [[8, 8], [9, 6], [9, 6], [8, 8], [6, 12], [4, 16], [4, 17], [7, 12]],
  side: [[9, 8], [10, 6], [9, 7], [8, 9], [6, 12], [4, 16], [4, 17], [7, 13]],
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

function createPainter(context, direction) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Naga motion rectangles must use positive integer geometry.',
    );
    context.fillStyle = fill;
    context.fillRect(mirrored ? SIZE - x - width : x, y, width, height);
  };
  return { view, rect };
}

function drawMotionTail(context, direction, shape) {
  const { view, rect } = createPainter(context, direction);
  const rows = view === 'right' ? shape.side : shape.front;
  const { scale, belly, cloth, bronze } = EN_E04_NAGA_IDLE_DATA.naga;
  for (let index = 0; index < rows.length; index++) {
    const [x, width] = rows[index];
    const fill = index === 0 ? cloth[0] : scale[index % 2 === 0 ? 0 : 1];
    rect(x, 15 + index, width, 1, fill);
  }

  const [waistX, waistWidth] = rows[0];
  rect(waistX + 2, 15, 1, 1, bronze[2]);
  rect(waistX + waistWidth - 3, 15, 1, 1, bronze[0]);

  if (view === 'down') {
    for (let index = 1; index <= 4; index++) {
      const [x, width] = rows[index];
      const plateWidth = Math.min(index === 4 ? 3 : 4, width - 2);
      rect(x + Math.floor((width - plateWidth) / 2), 15 + index, plateWidth, 1, belly[index % 3]);
    }
  } else if (view === 'right') {
    for (let index = 1; index <= 4; index++) {
      const [x, width] = rows[index];
      rect(x + Math.min(2, width - 1), 15 + index, 1, 1, belly[(index + 1) % 3]);
    }
  } else {
    for (let index = 1; index <= 4; index++) {
      const [x, width] = rows[index];
      rect(x + Math.floor(width / 2), 15 + index, 1, 1, scale[2]);
    }
  }
}

function renderUpperAndTail(args, sourceAnimation, sourceFrame, phase, shape) {
  const forcedColor = phase.flash ? '#ffffff' : null;
  const upperContext = createTransformedContext(
    args.context,
    physicalShift(args.direction, phase),
    forcedColor,
  );
  const sourceResult = EN_E01_HUMANOID_RENDERER.render({
    ...args,
    context: upperContext,
    animation: { ...args.animation, id: sourceAnimation },
    frame: sourceFrame,
    variant: COILGUARD_VARIANT,
  });
  args.context.clearRect(0, 15, SIZE, SIZE - 15);
  drawNagaIdleIdentity(upperContext, args.direction, phase.hoodPhase);
  args.context.clearRect(0, 15, SIZE, SIZE - 15);
  drawMotionTail(
    createTransformedContext(args.context, { x: 0, y: 0 }, forcedColor),
    args.direction,
    shape,
  );
  return sourceResult;
}

function resultFor(args, renderedAnimation, renderedFrame, motion, sourceResult = {}) {
  return Object.freeze({
    ...sourceResult,
    family: args.family.id,
    variant: args.variant.id,
    direction: args.direction,
    animation: args.animation.id,
    frame: args.frame,
    renderedAnimation,
    renderedFrame,
    nagaMotionGate: EN_E04_NAGA_MOTION_GATE.id,
    approvedNagaIdleGate: EN_E04_NAGA_IDLE_GATE.id,
    anatomy: EN_E04_NAGA_CONTRACT_CARD.anatomy,
    lowerBody: 'continuous-planted-serpent-coil',
    coilMotion: motion,
    effectBoundary: EN_E04_NAGA_IDLE_DATA.effectBoundary,
  });
}

function renderWalk(args) {
  const phase = EN_E04_NAGA_WALK_PHASES[args.frame];
  const sourceResult = renderUpperAndTail(
    args,
    'walk',
    args.frame,
    { ...phase, forward: 0, lift: 0, flash: false },
    WALK_TAILS[args.frame],
  );
  return resultFor(args, 'walk', args.frame, 'four-phase-planted-slither', sourceResult);
}

function renderAttack(args, outputAnimation = 'attack', outputFrame = args.frame) {
  const phase = EN_E04_NAGA_ATTACK_PHASES[args.frame];
  const sourceResult = renderUpperAndTail(
    args,
    'attack',
    args.frame,
    { ...phase, flash: false },
    ATTACK_TAILS[args.frame],
  );
  return resultFor(
    { ...args, animation: { ...args.animation, id: outputAnimation }, frame: outputFrame },
    'attack',
    args.frame,
    outputAnimation === 'cast' ? 'cast-alias-of-full-body-coil-strike' : phase.name,
    sourceResult,
  );
}

function renderHurt(args, outputAnimation = 'hurt', outputFrame = args.frame) {
  const phase = EN_E04_NAGA_HURT_PHASES[args.frame];
  const sourceResult = renderUpperAndTail(args, 'hurt', args.frame, phase, HURT_TAIL);
  return resultFor(
    { ...args, animation: { ...args.animation, id: outputAnimation }, frame: outputFrame },
    'hurt',
    args.frame,
    outputAnimation === 'death' ? 'death-alias-of-planted-coil-hurt' : phase.name,
    sourceResult,
  );
}

function renderNagaMotion(args) {
  assert(args.family.id === 'naga', 'The EN-E04 Naga motion renderer is restricted to Naga.');
  assert(args.variant.id === 'coilguard', 'The EN-E04 Naga motion renderer is restricted to Coilguard.');
  if (args.animation.id === 'idle') {
    assert(args.frame === 0 || args.frame === 1, 'Naga Coilguard Idle authorizes only F1-F2.');
    const sourceResult = EN_E04_NAGA_IDLE_RENDERER.render(args);
    return resultFor(args, 'idle', args.frame, 'approved-idle-byte-exact', sourceResult);
  }
  if (args.animation.id === 'walk') {
    assert(args.frame >= 0 && args.frame < 4, 'Naga Coilguard Walk authorizes only W1-W4.');
    return renderWalk(args);
  }
  if (args.animation.id === 'attack') {
    assert(args.frame >= 0 && args.frame < 4, 'Naga Coilguard Attack authorizes only A1-A4.');
    return renderAttack(args);
  }
  if (args.animation.id === 'hurt') {
    assert(args.frame >= 0 && args.frame < 2, 'Naga Coilguard Hurt authorizes only H1-H2.');
    return renderHurt(args);
  }
  if (args.animation.id === 'cast') {
    assert(args.frame >= 0 && args.frame < 4, 'Naga Coilguard Cast authorizes only C1-C4.');
    return renderAttack({ ...args, animation: { ...args.animation, id: 'attack' } }, 'cast', args.frame);
  }
  if (args.animation.id === 'death') {
    assert(args.frame >= 0 && args.frame < 4, 'Naga Coilguard Death authorizes only D1-D4.');
    const sourceFrame = EN_E04_NAGA_DEATH_SOURCE_FRAMES[args.frame];
    return renderHurt({ ...args, animation: { ...args.animation, id: 'hurt' }, frame: sourceFrame }, 'death', args.frame);
  }
  throw new TypeError('The EN-E04 Naga motion gate authorizes only Idle, Walk, Attack, Cast, Hurt, and Death.');
}

export const EN_E04_NAGA_MOTION_RENDERER = Object.freeze({
  key: 'en-e04-naga-coilguard-motion-v1',
  chassis: EN_E04_NAGA_IDLE_RENDERER.chassis,
  render: renderNagaMotion,
});

export const EN_E04_NAGA_MOTION_FAMILY = deepFreeze({
  id: 'naga',
  name: 'Naga',
  sliceId: 'EN-E04',
  rendererKey: EN_E04_NAGA_MOTION_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [{
    id: 'coilguard',
    name: 'Coilguard',
    brief: 'Common cobra-hooded Naga threshold guard with approved Idle plus a bounded four-phase slither, full-body coil strike, planted-coil Hurt, and exact Cast/Death aliases; venom, miasma, and coil-impact effects remain external.',
    rendererData: EN_E04_NAGA_IDLE_DATA,
  }],
  rendererData: {
    contractCard: EN_E04_NAGA_CONTRACT_CARD.id,
    approvedIdleGate: EN_E04_NAGA_IDLE_GATE.id,
    activeGate: EN_E04_NAGA_MOTION_GATE.id,
  },
  review: {
    baselineVariant: 'coilguard',
    scale: 6,
    notes: 'Visually approved grouped Coilguard motion suite; internal, non-public, and effect-free.',
  },
});

export const EN_E04_NAGA_MOTION_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E04_NAGA_MOTION_RENDERER],
  families: [EN_E04_NAGA_MOTION_FAMILY],
});
