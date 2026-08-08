import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E01_HUMANOID_RENDERER } from './enemy-expansion-humanoid.js';
import { EN_E04_TEMPLE_RAJAH_MOTION_GATE } from './enemy-expansion-en-e04-rajah-motion.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E04_MERFOLK_TIDEGUARD_CONTRACT = deepFreeze({
  family: 'merfolk',
  variant: 'tideguard',
  role: 'common',
  state: 'implemented-complete-motion-candidate',
  chassis: 'upright-piscine-humanoid',
  silhouette: 'A humanoid aquatic upper body flows into one fused scaled fish tail and one connected broad fluke. No direction contains ordinary legs, paired feet, or detached fin islands.',
  identity: 'Sea-green skin and scales, dark blue tide armor, coral-red knots, bronze shell fittings, pale belly plates, finned ears, and a connected ground fluke.',
  effectBoundary: 'Water bolts, tide arcs, bubbles, foam, splashes, undertow rings, and impact effects remain external.',
});

export const EN_E04_MERFOLK_TIDEGUARD_GATE = deepFreeze({
  id: 'en-e04-merfolk-tideguard-full-v1',
  status: 'approved',
  authorizedOn: '2026-08-08',
  authorizationEvidence: 'While approving the exact Temple Rajah motion pair, the designer said: lets keep going with slices like this,, maybe a full enemy with all its animations is a good spot. After clean Rajah publication, Codex bounded the next slice to one complete 80-frame Merfolk Tideguard common enemy only.',
  approvedOn: '2026-08-09',
  approvalEvidence: 'The designer reviewed both exact labeled all-four-direction raw/no-outline and Complete B + Form Merfolk Tideguard full-suite GIFs together and said: approved.',
  precedingApproval: {
    gateId: EN_E04_TEMPLE_RAJAH_MOTION_GATE.id,
    artifactSha256: EN_E04_TEMPLE_RAJAH_MOTION_GATE.artifactSha256,
    assembledArtifactSha256: EN_E04_TEMPLE_RAJAH_MOTION_GATE.assembledArtifactSha256,
    rawAnimationSha256: EN_E04_TEMPLE_RAJAH_MOTION_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E04_TEMPLE_RAJAH_MOTION_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E04_TEMPLE_RAJAH_MOTION_GATE.candidateFrameDigest,
    publishedCheckpoint: '38b56f316a3fa12443b5b9fb003e74dc7e8059aa',
    publishedHandoff: 'b9e597fa53b0da32633cec8cdc3c46348b92562f',
  },
  artifact: 'enemy-expansion-review/en-e04-merfolk-tideguard/en-e04-merfolk-tideguard-full-suite-raw.png',
  artifactSha256: '1cf9fabcbde77969f1d8d64ad31c3f788544b7ae082a1bd6f8c2db3c67bc67a6',
  assembledArtifact: 'enemy-expansion-review/en-e04-merfolk-tideguard/en-e04-merfolk-tideguard-full-suite-complete-b-form.png',
  assembledArtifactSha256: '0b5fe262f65ea45627fb50723049c560ae9675a0005a1dd963fa46d3049fdf0f',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e04-merfolk-tideguard/en-e04-merfolk-tideguard-full-suite-four-directions-labeled.gif',
      sha256: 'f01c7c11a541aa45685bbb4f607efbaa3098b44bfb4b0f105ce2bcfddf72045e',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e04-merfolk-tideguard/en-e04-merfolk-tideguard-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: 'acbf6b73c88770edbafd95470173344b0321d6075ea3e90675a4e11d59bd32d4',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
  },
  candidateFrameDigest: 'a0ebbb04e5d9a47959be09231fe2ac37e8c5ec0ec278d6434b1732d712eaac90',
  scope: 'One complete 80-frame Merfolk Tideguard common enemy across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle breathes over a planted fluke. Walk uses four distinct grounded tail-fin sweeps. Attack braces, rises, lunges, and recovers through the full body. Hurt uses a complete-silhouette white recoil and colored recovery. Cast aliases Attack exactly and Death aliases Hurt H1,H2,H2,H2.',
  anatomyContract: EN_E04_MERFOLK_TIDEGUARD_CONTRACT.silhouette,
  reviewPresentation: 'Show the exact labeled all-four-direction Merfolk Tideguard full-suite raw/no-outline and Complete B + Form boards and GIFs together. The four GIF phases display Idle, Walk, Attack, Cast, Hurt, and Death simultaneously.',
  exclusions: [
    'Naga pixel changes',
    'Merfolk specialist',
    'Merfolk elite',
    'Birdfolk',
    'new Cast pixels',
    'new Death pixels',
    'baked water-bolt pixels',
    'baked tide-arc pixels',
    'baked bubble pixels',
    'baked foam pixels',
    'baked splash pixels',
    'baked undertow-ring pixels',
    'registration',
    'consumer exposure',
    'effects',
    'release',
    'later EN-E04 work',
  ],
  nextGate: 'Visual approval is complete. Bounded commit, push, and publication of this exact ten-file Tideguard lane are authorized. No later Merfolk role, Birdfolk, registration, integration, effect, release, or broader EN-E04 work is authorized.',
});

export const EN_E04_MERFOLK_TIDEGUARD_DATA = deepFreeze({
  actor: {
    species: 'human',
    bodyBuild: 'classic',
    skin: 'olive',
    hairStyle: 'short',
    hairColor: 'black',
    expression: 'stern',
    faceDetail: 'none',
    headgear: 'none',
    outfit: 'armor',
    outfitColor: 'navy',
    outfitTier: 'tier1',
    weapon: 'none',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: ['#67b7a7', '#286b6b'],
      hair: ['#164b5c', '#0d2d3b'],
      outfit: ['#28799a', '#17475f', '#d58a51'],
    },
  },
  identity: { overlays: [] },
  merfolk: {
    scale: ['#3b9c91', '#206566', '#75cbbb'],
    fin: ['#28799a', '#17475f', '#68b8cf'],
    belly: ['#d5cf9a', '#8a8b68', '#f0e8b8'],
    bronze: ['#d58a51', '#754a32', '#f0bd72'],
    coral: ['#cf5d65', '#77343f', '#f18a82'],
    pearl: ['#e7f2dc', '#8eaa9c'],
  },
  effectBoundary: 'external-water-bolts-tide-arcs-bubbles-foam-splashes-undertow-rings-and-impacts',
  bakedEffects: [],
});

const TIDEGUARD_VARIANT = deepFreeze({
  id: 'tideguard',
  name: 'Tideguard',
  role: EN_E04_MERFOLK_TIDEGUARD_CONTRACT.role,
  status: EN_E04_MERFOLK_TIDEGUARD_CONTRACT.state,
  brief: 'Common Merfolk sentry with finned ears, blue tide armor, coral knots, bronze shell fittings, a fused fish tail, and one connected broad fluke; the complete standard suite is implemented with external water effects.',
  rendererData: EN_E04_MERFOLK_TIDEGUARD_DATA,
});

export const EN_E04_MERFOLK_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'tide-breath', forward: 0, lift: 0, identityPhase: 0, flash: false },
  { name: 'fluke-settle', forward: 0, lift: 0, identityPhase: 1, flash: false },
]);

const WALK_PHASES = deepFreeze([
  { name: 'left-fin-sweep', forward: 0, lift: 0, identityPhase: 0, flash: false },
  { name: 'center-compress', forward: 0, lift: 0, identityPhase: 1, flash: false },
  { name: 'right-fin-sweep', forward: 0, lift: 0, identityPhase: 0, flash: false },
  { name: 'tide-recover', forward: 0, lift: 0, identityPhase: 1, flash: false },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'fluke-brace', forward: -1, lift: 0, identityPhase: 0, flash: false },
  { name: 'tide-rise', forward: -1, lift: -1, identityPhase: 0, flash: false },
  { name: 'forward-lunge', forward: 1, lift: 0, identityPhase: 0, flash: false },
  { name: 'guard-recover', forward: 0, lift: 0, identityPhase: 1, flash: false },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-recoil', forward: -1, lift: -1, identityPhase: 0, flash: true },
  { name: 'planted-recovery', forward: 0, lift: 0, identityPhase: 1, flash: false },
]);

const IDLE_TAILS = deepFreeze([
  {
    front: [[8, 8], [9, 6], [9, 6], [10, 5], [10, 4], [11, 3], [8, 9], [6, 12]],
    side: [[9, 8], [10, 7], [11, 6], [12, 5], [13, 4], [14, 3], [11, 7], [9, 10]],
  },
  {
    front: [[8, 8], [9, 6], [10, 5], [10, 5], [11, 3], [10, 5], [7, 10], [6, 12]],
    side: [[9, 8], [10, 7], [11, 6], [12, 5], [13, 4], [13, 4], [10, 8], [8, 11]],
  },
]);

const WALK_TAILS = deepFreeze([
  {
    front: [[8, 8], [9, 6], [9, 6], [9, 5], [9, 4], [8, 4], [6, 9], [4, 12]],
    side: [[9, 8], [10, 7], [11, 6], [12, 5], [13, 4], [14, 3], [12, 7], [10, 10]],
  },
  {
    front: [[8, 8], [9, 6], [10, 5], [10, 5], [11, 3], [10, 5], [7, 10], [6, 12]],
    side: [[9, 8], [10, 7], [11, 6], [12, 5], [13, 4], [13, 4], [10, 8], [8, 11]],
  },
  {
    front: [[8, 8], [9, 6], [9, 6], [10, 5], [11, 4], [12, 4], [9, 9], [8, 12]],
    side: [[9, 8], [10, 7], [11, 6], [12, 5], [12, 4], [11, 4], [8, 8], [6, 11]],
  },
  {
    front: [[8, 8], [9, 6], [9, 6], [10, 5], [10, 4], [11, 3], [8, 9], [6, 12]],
    side: [[9, 8], [10, 7], [11, 6], [12, 5], [13, 4], [14, 3], [11, 7], [9, 10]],
  },
]);

const ATTACK_TAILS = deepFreeze([
  {
    front: [[8, 8], [9, 6], [9, 6], [9, 6], [9, 5], [9, 5], [6, 11], [4, 15]],
    side: [[9, 8], [10, 7], [11, 6], [12, 5], [13, 4], [14, 3], [12, 7], [9, 11]],
  },
  {
    front: [[8, 8], [9, 6], [10, 5], [10, 4], [11, 3], [11, 3], [9, 7], [7, 10]],
    side: [[9, 8], [10, 7], [11, 6], [12, 5], [13, 4], [14, 3], [12, 7], [10, 9]],
  },
  {
    front: [[8, 8], [9, 6], [9, 6], [10, 5], [11, 4], [12, 4], [9, 10], [7, 14]],
    side: [[9, 8], [10, 7], [11, 6], [12, 5], [13, 4], [14, 3], [10, 9], [7, 14]],
  },
  {
    front: [[8, 8], [9, 6], [9, 6], [10, 5], [10, 4], [11, 3], [8, 9], [6, 12]],
    side: [[9, 8], [10, 7], [11, 6], [12, 5], [13, 4], [14, 3], [11, 7], [9, 10]],
  },
]);

const HURT_TAIL = deepFreeze({
  front: [[8, 8], [9, 6], [9, 6], [10, 5], [10, 4], [11, 3], [8, 9], [6, 12]],
  side: [[9, 8], [10, 7], [11, 6], [12, 5], [13, 4], [14, 3], [11, 7], [9, 10]],
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
      'Merfolk rectangles must use positive integer geometry.',
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

function drawFrontIdentity({ rect, dot }, phase, rearView) {
  const { fin, bronze, coral, pearl } = EN_E04_MERFOLK_TIDEGUARD_DATA.merfolk;
  const bob = phase;
  rect(6, 6 + bob, 3, 3, fin[0]);
  rect(15, 6 + bob, 3, 3, fin[0]);
  dot(6, 7 + bob, fin[2]);
  dot(17, 7 + bob, fin[2]);
  rect(9, 3 + bob, 6, 1, bronze[1]);
  rect(10, 3 + bob, 4, 1, bronze[0]);
  dot(12, 3 + bob, pearl[0]);
  if (rearView) {
    rect(11, 5 + bob, 2, 5, fin[1]);
    dot(12, 5 + bob, fin[2]);
  } else {
    dot(9, 8 + bob, coral[2]);
    dot(14, 8 + bob, coral[2]);
  }
  rect(7, 11 + bob, 10, 2, fin[1]);
  rect(8, 11 + bob, 8, 2, fin[0]);
  rect(9, 13 + bob, 6, 2, fin[1]);
  rect(10, 13 + bob, 4, 1, pearl[0]);
  dot(11, 14 + bob, coral[2]);
  dot(12, 14 + bob, bronze[2]);
}

function drawSideIdentity({ rect, dot }, phase) {
  const { fin, bronze, coral, pearl } = EN_E04_MERFOLK_TIDEGUARD_DATA.merfolk;
  const bob = phase;
  rect(8, 5 + bob, 3, 5, fin[1]);
  rect(9, 6 + bob, 3, 3, fin[0]);
  dot(8, 7 + bob, fin[2]);
  rect(11, 3 + bob, 5, 1, bronze[1]);
  rect(12, 3 + bob, 4, 1, bronze[0]);
  dot(15, 3 + bob, pearl[0]);
  dot(16, 8 + bob, coral[2]);
  rect(8, 11 + bob, 9, 2, fin[1]);
  rect(10, 11 + bob, 7, 2, fin[0]);
  rect(10, 13 + bob, 6, 2, fin[1]);
  rect(12, 13 + bob, 3, 1, pearl[0]);
  dot(11, 14 + bob, coral[2]);
  dot(15, 14 + bob, bronze[2]);
}

export function drawMerfolkTideguardIdentity(context, direction, phase) {
  assert(phase === 0 || phase === 1, 'Merfolk identity phase must be F1 or F2.');
  const paint = createPainter(context, direction);
  if (paint.view === 'right') drawSideIdentity(paint, phase);
  else drawFrontIdentity(paint, phase, paint.view === 'up');
}

function drawMotionTail(context, direction, shape) {
  const { view, rect, dot } = createPainter(context, direction);
  const rows = view === 'right' ? shape.side : shape.front;
  const { scale, fin, belly, bronze, coral } = EN_E04_MERFOLK_TIDEGUARD_DATA.merfolk;
  for (let index = 0; index < rows.length; index++) {
    const [x, width] = rows[index];
    const fill = index >= 6 ? fin[index % 2] : scale[index % 2];
    rect(x, 15 + index, width, 1, fill);
  }

  const [waistX, waistWidth] = rows[0];
  rect(waistX, 15, waistWidth, 1, fin[1]);
  dot(waistX + 2, 15, coral[2]);
  dot(waistX + waistWidth - 3, 15, bronze[2]);

  if (view === 'down') {
    for (let index = 1; index <= 5; index++) {
      const [x, width] = rows[index];
      const plateWidth = Math.max(1, Math.min(index < 3 ? 4 : 3, width - 1));
      rect(x + Math.floor((width - plateWidth) / 2), 15 + index, plateWidth, 1, belly[index % 3]);
    }
  } else if (view === 'right') {
    for (let index = 1; index <= 5; index++) {
      const [x, width] = rows[index];
      rect(x + Math.min(2, width - 1), 15 + index, 1, 1, belly[(index + 1) % 3]);
    }
  } else {
    for (let index = 1; index <= 5; index++) {
      const [x, width] = rows[index];
      rect(x + Math.floor(width / 2), 15 + index, 1, 1, fin[2]);
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
    variant: TIDEGUARD_VARIANT,
  });
  args.context.clearRect(0, 15, SIZE, SIZE - 15);
  drawMerfolkTideguardIdentity(upperContext, args.direction, phase.identityPhase);
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
    merfolkTideguardGate: EN_E04_MERFOLK_TIDEGUARD_GATE.id,
    approvedPrecedingGate: EN_E04_TEMPLE_RAJAH_MOTION_GATE.id,
    role: EN_E04_MERFOLK_TIDEGUARD_CONTRACT.role,
    anatomy: EN_E04_MERFOLK_TIDEGUARD_CONTRACT.chassis,
    lowerBody: 'single-fused-fishtail-with-connected-fluke',
    motion,
    effectBoundary: EN_E04_MERFOLK_TIDEGUARD_DATA.effectBoundary,
  });
}

function renderIdle(args) {
  const phase = IDLE_PHASES[args.frame];
  const sourceResult = renderUpperAndTail(args, 'idle', args.frame, phase, IDLE_TAILS[args.frame]);
  return resultFor(args, 'idle', args.frame, phase.name, sourceResult);
}

function renderWalk(args) {
  const phase = WALK_PHASES[args.frame];
  const sourceResult = renderUpperAndTail(args, 'walk', args.frame, phase, WALK_TAILS[args.frame]);
  return resultFor(args, 'walk', args.frame, phase.name, sourceResult);
}

function renderAttack(args, outputAnimation = 'attack', outputFrame = args.frame) {
  const phase = ATTACK_PHASES[args.frame];
  const sourceResult = renderUpperAndTail(args, 'attack', args.frame, phase, ATTACK_TAILS[args.frame]);
  return resultFor(
    { ...args, animation: { ...args.animation, id: outputAnimation }, frame: outputFrame },
    'attack',
    args.frame,
    outputAnimation === 'cast' ? 'exact-cast-alias-of-full-body-tide-lunge' : phase.name,
    sourceResult,
  );
}

function renderHurt(args, outputAnimation = 'hurt', outputFrame = args.frame) {
  const phase = HURT_PHASES[args.frame];
  const sourceResult = renderUpperAndTail(args, 'hurt', args.frame, phase, HURT_TAIL);
  return resultFor(
    { ...args, animation: { ...args.animation, id: outputAnimation }, frame: outputFrame },
    'hurt',
    args.frame,
    outputAnimation === 'death' ? 'exact-death-alias-of-planted-fluke-hurt' : phase.name,
    sourceResult,
  );
}

function renderMerfolkTideguard(args) {
  assert(args.family.id === 'merfolk', 'The EN-E04 Merfolk renderer is restricted to Merfolk.');
  assert(args.variant.id === 'tideguard', 'The EN-E04 Merfolk renderer is restricted to Tideguard.');
  if (args.animation.id === 'idle') {
    assert(args.frame >= 0 && args.frame < 2, 'Merfolk Tideguard Idle authorizes only F1-F2.');
    return renderIdle(args);
  }
  if (args.animation.id === 'walk') {
    assert(args.frame >= 0 && args.frame < 4, 'Merfolk Tideguard Walk authorizes only W1-W4.');
    return renderWalk(args);
  }
  if (args.animation.id === 'attack') {
    assert(args.frame >= 0 && args.frame < 4, 'Merfolk Tideguard Attack authorizes only A1-A4.');
    return renderAttack(args);
  }
  if (args.animation.id === 'hurt') {
    assert(args.frame >= 0 && args.frame < 2, 'Merfolk Tideguard Hurt authorizes only H1-H2.');
    return renderHurt(args);
  }
  if (args.animation.id === 'cast') {
    assert(args.frame >= 0 && args.frame < 4, 'Merfolk Tideguard Cast authorizes only C1-C4.');
    return renderAttack({ ...args, animation: { ...args.animation, id: 'attack' } }, 'cast', args.frame);
  }
  if (args.animation.id === 'death') {
    assert(args.frame >= 0 && args.frame < 4, 'Merfolk Tideguard Death authorizes only D1-D4.');
    const sourceFrame = EN_E04_MERFOLK_DEATH_SOURCE_FRAMES[args.frame];
    return renderHurt({ ...args, animation: { ...args.animation, id: 'hurt' }, frame: sourceFrame }, 'death', args.frame);
  }
  throw new TypeError('The EN-E04 Merfolk Tideguard gate authorizes only Idle, Walk, Attack, Cast, Hurt, and Death.');
}

export const EN_E04_MERFOLK_TIDEGUARD_RENDERER = Object.freeze({
  key: 'en-e04-merfolk-tideguard-full-v1',
  chassis: EN_E04_MERFOLK_TIDEGUARD_CONTRACT.chassis,
  render: renderMerfolkTideguard,
});

export const EN_E04_MERFOLK_TIDEGUARD_FAMILY = deepFreeze({
  id: 'merfolk',
  name: 'Merfolk',
  sliceId: 'EN-E04',
  rendererKey: EN_E04_MERFOLK_TIDEGUARD_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [TIDEGUARD_VARIANT],
  rendererData: {
    approvedPrecedingGate: EN_E04_TEMPLE_RAJAH_MOTION_GATE.id,
    activeGate: EN_E04_MERFOLK_TIDEGUARD_GATE.id,
  },
  review: {
    baselineVariant: 'tideguard',
    scale: 6,
    notes: 'Awaiting paired visual approval for one complete Merfolk Tideguard enemy; internal, non-public, and effect-free.',
  },
});

export const EN_E04_MERFOLK_TIDEGUARD_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E04_MERFOLK_TIDEGUARD_RENDERER],
  families: [EN_E04_MERFOLK_TIDEGUARD_FAMILY],
});
