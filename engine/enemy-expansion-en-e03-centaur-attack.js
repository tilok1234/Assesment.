import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E01_HUMANOID_RENDERER } from './enemy-expansion-humanoid.js';
import { EN_E03_GIANT_ATTACK_GATE } from './enemy-expansion-en-e03-giant-attack.js';
import { EN_E03_STEPPE_HUNTER_CALIBRATION_DATA } from './enemy-expansion-en-e03-centaur-calibration.js';
import {
  drawSteppeHunterCentaurBody,
  EN_E03_CENTAUR_WALK_GATE,
  EN_E03_CENTAUR_WALK_RENDERER,
} from './enemy-expansion-en-e03-centaur-walk.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E03_CENTAUR_ATTACK_GATE = deepFreeze({
  id: 'en-e03-steppe-hunter-attack-v1',
  status: 'approved',
  authorizedOn: '2026-08-07',
  authorizationEvidence: 'Designer approved the exact labeled four-direction raw and Complete B + Form Hill Breaker Attack animations with: Very good approved. Designer then said: Cool let\'s keep going.',
  approvedOn: '2026-08-07',
  approvalEvidence: 'Designer reviewed the exact labeled four-direction raw and Complete B + Form Steppe Hunter Attack animations and said: Approved.',
  precedingApproval: {
    gateId: EN_E03_GIANT_ATTACK_GATE.id,
    artifactSha256: EN_E03_GIANT_ATTACK_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_GIANT_ATTACK_GATE.assembledArtifactSha256,
    candidateFrameDigest: EN_E03_GIANT_ATTACK_GATE.candidateFrameDigest,
  },
  approvedIdle: {
    gateId: EN_E03_CENTAUR_WALK_GATE.approvedIdle.gateId,
    artifactSha256: EN_E03_CENTAUR_WALK_GATE.approvedIdle.artifactSha256,
    assembledArtifactSha256: EN_E03_CENTAUR_WALK_GATE.approvedIdle.assembledArtifactSha256,
    frameDigest: EN_E03_CENTAUR_WALK_GATE.approvedIdle.frameDigest,
  },
  approvedWalk: {
    gateId: EN_E03_CENTAUR_WALK_GATE.id,
    artifactSha256: EN_E03_CENTAUR_WALK_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_CENTAUR_WALK_GATE.assembledArtifactSha256,
    frameDigest: EN_E03_CENTAUR_WALK_GATE.candidateFrameDigest,
  },
  artifact: 'enemy-expansion-review/en-e03-centaur-attack/en-e03-steppe-hunter-attack-raw.png',
  artifactSha256: 'b276746f3d532df7b3ba9b551d8227b3d2fa439367fd49108eaaab5b5309eee2',
  assembledArtifact: 'enemy-expansion-review/en-e03-centaur-attack/en-e03-steppe-hunter-attack-complete-b-form.png',
  assembledArtifactSha256: 'ba5c3f84fc0c7e96af985453c847b3669efe39c7c4e5f033fcad13dba432c5be',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e03-centaur-attack/en-e03-steppe-hunter-attack-four-directions-labeled-v1.gif',
      sha256: 'ea0d576a586f3dc22777a35e8c8bed837efe5c9e7125e5508531a903fe7236d7',
      width: 192,
      height: 224,
      frames: 4,
      durationMs: 480,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e03-centaur-attack/en-e03-steppe-hunter-attack-four-directions-labeled-complete-b-form-v1.gif',
      sha256: '7798a3da0b43b0111ac68b201f0afc8a4a85d53e0531b2cc3718a08dcd73aafa',
      width: 192,
      height: 224,
      frames: 4,
      durationMs: 480,
    },
  },
  candidateFrameDigest: 'c01f66be4c6afcaaa562073b85598b09eff0e8686ec0092296d95090883f77a0',
  scope: 'Steppe Hunter common Attack only: A1-A4 across Down, Left, Right, and Up, with approved Idle and Walk delegated byte-for-byte and shown as frozen context.',
  revision: 'A four-direction spear-lunge rig: A1 braces backward, A2 releases from center, A3 carries the rider and horse body through the thrust over planted hoof contacts, and A4 recovers. Front and back use true depth-axis spear travel; side profiles retain exact mirroring.',
  reviewPresentation: 'Show both labeled all-four-direction GIFs together for review: raw/no-outline and Complete B + Form. Narrower evidence is allowed only for an explicitly requested direction, frame, layer, outline mode, or isolated defect.',
  exclusions: [
    'Idle pixel changes',
    'Walk pixel changes',
    'Giant changes',
    'Satyr changes',
    'specialist variants',
    'elite variants',
    'Hurt',
    'Cast',
    'Death',
    'registration',
    'consumer exposure',
    'effects',
    'release',
  ],
  nextGate: 'Visual approval is complete. Stop until the designer explicitly selects and authorizes the next bounded EN-E03 gate; no later EN-E03 work is authorized yet.',
});

const ATTACK_PHASES = deepFreeze({
  down: [
    { stride: -1, bob: 0, shift: { x: 0, y: -1 } },
    { stride: 0, bob: 0, shift: { x: 0, y: 0 } },
    { stride: 1, bob: 0, shift: { x: 0, y: 1 } },
    { stride: 0, bob: 0, shift: { x: 0, y: 0 } },
  ],
  left: [
    { stride: -1, bob: 0, shift: { x: 1, y: 0 } },
    { stride: 0, bob: 0, shift: { x: 0, y: 0 } },
    { stride: 1, bob: 0, shift: { x: -1, y: 0 } },
    { stride: 0, bob: 0, shift: { x: 0, y: 0 } },
  ],
  right: [
    { stride: -1, bob: 0, shift: { x: -1, y: 0 } },
    { stride: 0, bob: 0, shift: { x: 0, y: 0 } },
    { stride: 1, bob: 0, shift: { x: 1, y: 0 } },
    { stride: 0, bob: 0, shift: { x: 0, y: 0 } },
  ],
  up: [
    { stride: -1, bob: 0, shift: { x: 0, y: 1 } },
    { stride: 0, bob: 0, shift: { x: 0, y: 0 } },
    { stride: 1, bob: 0, shift: { x: 0, y: -1 } },
    { stride: 0, bob: 0, shift: { x: 0, y: 0 } },
  ],
});

export const EN_E03_CENTAUR_ATTACK_PHASES = ATTACK_PHASES;

const SPEAR_POSES = deepFreeze({
  down: [
    {
      shaft: [19, 20, 19, 4],
      head: [[19, 2, 0], [18, 3, 0], [19, 3, 0], [20, 3, 1], [19, 4, 1]],
      hands: [[17, 11, 0], [18, 11, 0], [18, 12, 1]],
      highlight: [18, 6],
    },
    {
      shaft: [17, 11, 17, 20],
      head: [[17, 22, 0], [16, 21, 0], [17, 21, 0], [18, 21, 1], [17, 20, 1]],
      hands: [[16, 11, 0], [17, 11, 0], [16, 12, 1]],
      highlight: [18, 18],
    },
    {
      shaft: [17, 10, 13, 20],
      head: [[12, 22, 0], [12, 21, 0], [13, 21, 0], [13, 20, 1], [14, 20, 1]],
      hands: [[16, 10, 0], [17, 10, 0], [16, 11, 1]],
      highlight: [14, 18],
    },
    {
      shaft: [19, 20, 19, 5],
      head: [[19, 3, 0], [18, 4, 0], [19, 4, 0], [20, 4, 1], [19, 5, 1]],
      hands: [[17, 11, 0], [18, 11, 0], [18, 12, 1]],
      highlight: [18, 7],
    },
  ],
  right: [
    {
      shaft: [14, 17, 14, 4],
      head: [[14, 2, 0], [13, 3, 0], [14, 3, 0], [15, 3, 1], [14, 4, 1]],
      hands: [[15, 11, 0], [16, 11, 0], [15, 12, 1]],
      highlight: [15, 6],
    },
    {
      shaft: [12, 12, 20, 12],
      head: [[22, 12, 0], [21, 11, 0], [21, 12, 0], [21, 13, 1], [20, 12, 1]],
      hands: [[15, 11, 0], [16, 11, 0], [17, 12, 1]],
      highlight: [19, 11],
    },
    {
      shaft: [11, 13, 20, 13],
      head: [[22, 12, 0], [21, 12, 0], [21, 13, 0], [21, 14, 1], [20, 13, 1]],
      hands: [[15, 12, 0], [16, 12, 0], [17, 13, 1]],
      highlight: [19, 12],
    },
    {
      shaft: [17, 17, 20, 4],
      head: [[20, 2, 0], [19, 3, 0], [20, 3, 0], [21, 3, 1], [20, 4, 1]],
      hands: [[17, 11, 0], [18, 11, 0], [18, 12, 1]],
      highlight: [20, 6],
    },
  ],
  up: [
    {
      shaft: [6, 10, 3, 20],
      head: [[2, 22, 0], [2, 21, 0], [3, 21, 0], [3, 20, 1], [4, 20, 1]],
      hands: [[6, 10, 0], [7, 10, 0], [6, 11, 1]],
      highlight: [4, 18],
    },
    {
      shaft: [6, 12, 6, 3],
      head: [[6, 1, 0], [5, 2, 0], [6, 2, 0], [7, 2, 1], [6, 3, 1]],
      hands: [[6, 11, 0], [7, 11, 0], [7, 12, 1]],
      highlight: [5, 5],
    },
    {
      shaft: [6, 11, 9, 3],
      head: [[10, 1, 0], [9, 2, 0], [10, 2, 0], [9, 3, 1], [8, 3, 1]],
      hands: [[6, 10, 0], [7, 10, 0], [7, 11, 1]],
      highlight: [8, 5],
    },
    {
      shaft: [4, 20, 4, 4],
      head: [[4, 2, 0], [3, 3, 0], [4, 3, 0], [5, 3, 1], [4, 4, 1]],
      hands: [[5, 11, 0], [6, 11, 0], [6, 12, 1]],
      highlight: [5, 6],
    },
  ],
});

function createPixelBuffer() {
  const pixels = new Array(SIZE * SIZE).fill(null);
  let fillStyle = '#000000';
  const context = {
    get fillStyle() {
      return fillStyle;
    },
    set fillStyle(value) {
      fillStyle = value;
    },
    clearRect(x, y, width, height) {
      for (let py = Math.floor(y); py < y + height; py++) for (let px = Math.floor(x); px < x + width; px++) {
        if (px >= 0 && py >= 0 && px < SIZE && py < SIZE) pixels[(py * SIZE) + px] = null;
      }
    },
    fillRect(x, y, width, height) {
      for (let py = Math.floor(y); py < y + height; py++) for (let px = Math.floor(x); px < x + width; px++) {
        if (px >= 0 && py >= 0 && px < SIZE && py < SIZE) pixels[(py * SIZE) + px] = fillStyle;
      }
    },
  };
  return { context, pixels };
}

function paintPixels(context, pixels, transform = (x, y) => ({ x, y })) {
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    const color = pixels[(y * SIZE) + x];
    if (color === null) continue;
    const target = transform(x, y);
    context.fillStyle = color;
    context.fillRect(target.x, target.y, 1, 1);
  }
}

function createAttackPainter(context, direction) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const dot = (x, y, fill) => {
    context.fillStyle = fill;
    context.fillRect(mirrored ? SIZE - x - 1 : x, y, 1, 1);
  };
  const line = (x0, y0, x1, y1, fill) => {
    let x = x0;
    let y = y0;
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let error = dx - dy;
    dot(x, y, fill);
    while (x !== x1 || y !== y1) {
      const previousX = x;
      const previousY = y;
      const doubled = error * 2;
      if (doubled > -dy) {
        error -= dy;
        x += sx;
      }
      if (doubled < dx) {
        error += dx;
        y += sy;
      }
      if (x !== previousX && y !== previousY) dot(x, previousY, fill);
      dot(x, y, fill);
    }
  };
  return { view, dot, line };
}

function attackColors() {
  const data = EN_E03_STEPPE_HUNTER_CALIBRATION_DATA;
  return {
    skin: data.actor.palette.skin,
    accent: data.horse.accent,
    wood: data.horse.wood,
    spearhead: data.horse.spearhead,
  };
}

function spearPose(direction, frame) {
  const view = direction === 'left' ? 'right' : direction;
  return SPEAR_POSES[view][frame];
}

export function drawAttackSpear(context, direction, frame) {
  const paint = createAttackPainter(context, direction);
  const colors = attackColors();
  const pose = spearPose(direction, frame);
  paint.line(...pose.shaft, colors.wood[1]);
  paint.dot(pose.highlight[0], pose.highlight[1], colors.wood[0]);
  for (const [x, y, shade] of pose.head) paint.dot(x, y, colors.spearhead[shade]);
}

export function drawAttackHands(context, direction, frame) {
  const paint = createAttackPainter(context, direction);
  const colors = attackColors();
  const pose = spearPose(direction, frame);
  for (const [x, y, shade] of pose.hands) paint.dot(x, y, colors.skin[shade]);
  const last = pose.hands[pose.hands.length - 1];
  paint.dot(last[0], last[1], colors.accent[1]);
}

function renderAttackBody(args, phase) {
  const body = createPixelBuffer();
  EN_E01_HUMANOID_RENDERER.render({ ...args, context: body.context });
  body.context.clearRect(0, 14, SIZE, SIZE - 14);
  drawSteppeHunterCentaurBody(body.context, args.direction, phase);
  return body;
}

function isSideTailPixel(direction, x) {
  if (direction === 'right') return x < 5;
  if (direction === 'left') return x > 18;
  return false;
}

function paintAttackBody(context, direction, body, phase) {
  const seamRow = 17;
  paintPixels(context, body.pixels, (x, y) => {
    if (y >= 18 || isSideTailPixel(direction, x)) return { x, y };
    return {
      x: Math.max(1, Math.min(SIZE - 2, x + phase.shift.x)),
      y: Math.max(1, Math.min(seamRow, y + phase.shift.y)),
    };
  });
  if (phase.shift.x !== 0 || phase.shift.y !== 0) {
    for (let x = 0; x < SIZE; x++) {
      const color = body.pixels[(seamRow * SIZE) + x];
      if (color === null) continue;
      context.fillStyle = color;
      context.fillRect(x, seamRow, 1, 1);
    }
  }
}

function renderCentaurAttack(args) {
  assert(args.family.id === 'centaur', 'The EN-E03 Centaur Attack renderer is restricted to Centaur.');
  assert(args.variant.id === 'steppe-hunter', 'The EN-E03 Centaur Attack renderer is restricted to Steppe Hunter.');
  if (args.animation.id === 'idle' || args.animation.id === 'walk') {
    return EN_E03_CENTAUR_WALK_RENDERER.render(args);
  }
  assert(args.animation.id === 'attack' && args.frame >= 0 && args.frame < 4, 'The EN-E03 Centaur Attack renderer authorizes only approved Idle and Walk plus four Attack frames.');
  const phase = ATTACK_PHASES[args.direction][args.frame];
  const body = renderAttackBody(args, phase);
  args.context.clearRect(0, 0, SIZE, SIZE);
  if (args.direction === 'up') drawAttackSpear(args.context, args.direction, args.frame);
  paintAttackBody(args.context, args.direction, body, phase);
  if (args.direction !== 'up') drawAttackSpear(args.context, args.direction, args.frame);
  drawAttackHands(args.context, args.direction, args.frame);
  return Object.freeze({
    family: args.family.id,
    variant: args.variant.id,
    direction: args.direction,
    animation: args.animation.id,
    frame: args.frame,
    renderedAnimation: 'attack',
    renderedFrame: args.frame,
    centaurAttackGate: EN_E03_CENTAUR_ATTACK_GATE.id,
    approvedWalkGate: EN_E03_CENTAUR_WALK_GATE.id,
    precedingApprovalGate: EN_E03_GIANT_ATTACK_GATE.id,
    bodyShift: phase.shift,
    stride: phase.stride,
  });
}

export const EN_E03_CENTAUR_ATTACK_RENDERER = Object.freeze({
  key: 'en-e03-centaur-attack-v1',
  chassis: EN_E01_HUMANOID_RENDERER.chassis,
  render: renderCentaurAttack,
});

export const EN_E03_CENTAUR_ATTACK_FAMILY = deepFreeze({
  id: 'centaur',
  name: 'Centaur',
  sliceId: 'EN-E03',
  rendererKey: EN_E03_CENTAUR_ATTACK_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [{
    id: 'steppe-hunter',
    name: 'Steppe Hunter',
    brief: 'Approved Idle and Walk baselines plus an approved four-frame spear Attack with a rearward brace, release, horse-and-rider follow-through, and recovery across four true directions.',
    rendererData: EN_E03_STEPPE_HUNTER_CALIBRATION_DATA,
  }],
  rendererData: {
    contractCard: 'centaur',
    approvedIdleGate: EN_E03_CENTAUR_WALK_GATE.approvedIdle.gateId,
    approvedWalkGate: EN_E03_CENTAUR_WALK_GATE.id,
    precedingApprovalGate: EN_E03_GIANT_ATTACK_GATE.id,
    activeGate: EN_E03_CENTAUR_ATTACK_GATE.id,
  },
  review: {
    baselineVariant: 'steppe-hunter',
    scale: 8,
    notes: 'Visually approved common Attack baseline; approved Idle and Walk remain exact while the horse-and-rider spear rig stays internal and non-public.',
  },
});

export const EN_E03_CENTAUR_ATTACK_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E03_CENTAUR_ATTACK_RENDERER],
  families: [EN_E03_CENTAUR_ATTACK_FAMILY],
});
