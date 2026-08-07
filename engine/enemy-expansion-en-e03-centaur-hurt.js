import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E01_HUMANOID_RENDERER } from './enemy-expansion-humanoid.js';
import { EN_E03_GIANT_HURT_GATE } from './enemy-expansion-en-e03-giant-hurt.js';
import { EN_E03_STEPPE_HUNTER_CALIBRATION_DATA } from './enemy-expansion-en-e03-centaur-calibration.js';
import { drawSteppeHunterCentaurBody } from './enemy-expansion-en-e03-centaur-walk.js';
import {
  EN_E03_CENTAUR_ATTACK_GATE,
  EN_E03_CENTAUR_ATTACK_RENDERER,
} from './enemy-expansion-en-e03-centaur-attack.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E03_CENTAUR_HURT_GATE = deepFreeze({
  id: 'en-e03-steppe-hunter-hurt-v1',
  status: 'approved',
  authorizedOn: '2026-08-07',
  authorizationEvidence: 'Designer reviewed both exact labeled all-four-direction raw and Complete B + Form Hill Breaker Hurt animations together and said: approved. Designer then said: nice lets do nexrt. Codex explicitly bounded the next gate as Steppe Hunter H1-H2 across all four directions.',
  approvedOn: '2026-08-07',
  approvalEvidence: 'Designer reviewed both exact labeled all-four-direction raw and Complete B + Form Steppe Hunter Hurt animations together and said: approved.',
  precedingApproval: {
    gateId: EN_E03_GIANT_HURT_GATE.id,
    artifactSha256: EN_E03_GIANT_HURT_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_GIANT_HURT_GATE.assembledArtifactSha256,
    candidateFrameDigest: EN_E03_GIANT_HURT_GATE.candidateFrameDigest,
  },
  approvedIdle: EN_E03_CENTAUR_ATTACK_GATE.approvedIdle,
  approvedWalk: EN_E03_CENTAUR_ATTACK_GATE.approvedWalk,
  approvedAttack: {
    gateId: EN_E03_CENTAUR_ATTACK_GATE.id,
    artifactSha256: EN_E03_CENTAUR_ATTACK_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_CENTAUR_ATTACK_GATE.assembledArtifactSha256,
    frameDigest: EN_E03_CENTAUR_ATTACK_GATE.candidateFrameDigest,
  },
  artifact: 'enemy-expansion-review/en-e03-centaur-hurt/en-e03-steppe-hunter-hurt-raw.png',
  artifactSha256: 'da4fd6d7c98b4499df378cb006183728d1433d89a15c3db353fc06557bf3c0ec',
  assembledArtifact: 'enemy-expansion-review/en-e03-centaur-hurt/en-e03-steppe-hunter-hurt-complete-b-form.png',
  assembledArtifactSha256: '9f00c5feadee2b2670b2d672b903106eaa7ee7a500da28d0ddc1de1c4d6c8441',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e03-centaur-hurt/en-e03-steppe-hunter-hurt-four-directions-labeled.gif',
      sha256: 'b79357ba08580dbe6bb8fb8a175a9694756ec636a71908608cacaa75aa4b0f01',
      width: 192,
      height: 224,
      frames: 2,
      durationMs: 280,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e03-centaur-hurt/en-e03-steppe-hunter-hurt-four-directions-labeled-complete-b-form.gif',
      sha256: '6995aadbe92e0425eb6625afaed9b3f005d99820d28f4addb9af15c9107011e9',
      width: 192,
      height: 224,
      frames: 2,
      durationMs: 280,
    },
  },
  candidateFrameDigest: '13861ef4d4543d78afe893968c81b92023a6a863ac8c56e8aef0ece1b5e05a4a',
  scope: 'Steppe Hunter common Hurt only: H1-H2 across Down, Left, Right, and Up, with approved Idle, Walk, and Attack delegated byte-for-byte.',
  motion: 'H1 flashes the complete horse-rider-spear silhouette white and recoils the connected hybrid mass around four fixed hoof contacts; H2 drops into a colored braced recovery with a newly settled spear and distinct full-body silhouette.',
  reviewPresentation: 'Show both labeled all-four-direction GIFs together for review: raw/no-outline and Complete B + Form. Narrower evidence is allowed only for an explicitly requested direction, frame, layer, outline mode, or isolated defect.',
  exclusions: [
    'Idle pixel changes',
    'Walk pixel changes',
    'Attack pixel changes',
    'Giant changes',
    'Satyr changes',
    'specialist variants',
    'elite variants',
    'Cast aliases',
    'Death aliases',
    'registration',
    'consumer exposure',
    'effects',
    'release',
  ],
  nextGate: 'Visual approval is complete and this bounded lane is published. Stop until the designer explicitly selects and authorizes the next EN-E03 gate; this approval authorizes no later work.',
});

export const EN_E03_CENTAUR_HURT_BODY_SHIFTS = deepFreeze({
  down: [{ x: 1, y: -1 }, { x: 0, y: 1 }],
  left: [{ x: 1, y: -1 }, { x: 0, y: 1 }],
  right: [{ x: -1, y: -1 }, { x: 0, y: 1 }],
  up: [{ x: -1, y: 1 }, { x: 0, y: 1 }],
});

const HURT_SPEAR_POSES = deepFreeze({
  down: [
    {
      shaft: [17, 12, 21, 4],
      head: [[21, 2, 0], [20, 3, 0], [21, 3, 0], [22, 3, 1], [21, 4, 1]],
      hands: [[16, 11, 0], [17, 11, 0], [17, 12, 1]],
      highlight: [19, 8],
    },
    {
      shaft: [17, 13, 18, 5],
      head: [[18, 3, 0], [17, 4, 0], [18, 4, 0], [19, 4, 1], [18, 5, 1]],
      hands: [[16, 12, 0], [17, 12, 0], [17, 13, 1]],
      highlight: [18, 8],
    },
  ],
  right: [
    {
      shaft: [17, 12, 12, 4],
      head: [[11, 2, 0], [11, 3, 0], [12, 3, 0], [12, 4, 1], [13, 4, 1]],
      hands: [[16, 11, 0], [17, 11, 0], [17, 12, 1]],
      highlight: [14, 7],
    },
    {
      shaft: [17, 13, 20, 5],
      head: [[20, 3, 0], [19, 4, 0], [20, 4, 0], [21, 4, 1], [20, 5, 1]],
      hands: [[16, 12, 0], [17, 12, 0], [17, 13, 1]],
      highlight: [19, 8],
    },
  ],
  up: [
    {
      shaft: [6, 12, 3, 4],
      head: [[3, 2, 0], [2, 3, 0], [3, 3, 0], [4, 3, 1], [3, 4, 1]],
      hands: [[6, 11, 0], [7, 11, 0], [6, 12, 1]],
      highlight: [4, 7],
    },
    {
      shaft: [6, 13, 5, 5],
      head: [[5, 3, 0], [4, 4, 0], [5, 4, 0], [6, 4, 1], [5, 5, 1]],
      hands: [[6, 12, 0], [7, 12, 0], [6, 13, 1]],
      highlight: [5, 8],
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

function paintPixels(context, pixels, transform, flash) {
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    const color = pixels[(y * SIZE) + x];
    if (color === null) continue;
    const target = transform(x, y);
    context.fillStyle = flash ? '#ffffff' : color;
    context.fillRect(target.x, target.y, 1, 1);
  }
}

function renderHurtBody(args) {
  const body = createPixelBuffer();
  EN_E01_HUMANOID_RENDERER.render({ ...args, context: body.context });
  body.context.clearRect(0, 14, SIZE, SIZE - 14);
  drawSteppeHunterCentaurBody(body.context, args.direction, { stride: 0, bob: 0 });
  return body;
}

function paintHurtBody(context, body, shift, flash) {
  const anchorRow = 20;
  const seamRow = anchorRow - 1;
  paintPixels(context, body.pixels, (x, y) => {
    if (y >= anchorRow) return { x, y };
    return {
      x: Math.max(1, Math.min(SIZE - 2, x + shift.x)),
      y: Math.max(1, Math.min(seamRow, y + shift.y)),
    };
  }, flash);
  for (let x = 0; x < SIZE; x++) {
    const color = body.pixels[(seamRow * SIZE) + x];
    if (color === null) continue;
    context.fillStyle = flash ? '#ffffff' : color;
    context.fillRect(x, seamRow, 1, 1);
  }
}

function createHurtPainter(context, direction, shift, flash) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const colors = EN_E03_STEPPE_HUNTER_CALIBRATION_DATA;
  const resolve = (color) => (flash ? '#ffffff' : color);
  const dot = (x, y, color) => {
    const physicalX = (mirrored ? SIZE - x - 1 : x) + shift.x;
    const physicalY = y + shift.y;
    context.fillStyle = resolve(color);
    context.fillRect(
      Math.max(1, Math.min(SIZE - 2, physicalX)),
      Math.max(1, Math.min(SIZE - 2, physicalY)),
      1,
      1,
    );
  };
  const line = (x0, y0, x1, y1, color) => {
    let x = x0;
    let y = y0;
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let error = dx - dy;
    dot(x, y, color);
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
      if (x !== previousX && y !== previousY) dot(x, previousY, color);
      dot(x, y, color);
    }
  };
  return {
    view,
    dot,
    line,
    colors: {
      skin: colors.actor.palette.skin,
      accent: colors.horse.accent,
      wood: colors.horse.wood,
      spearhead: colors.horse.spearhead,
    },
  };
}

export function drawHurtSpear(context, direction, frame, shift, flash) {
  const paint = createHurtPainter(context, direction, shift, flash);
  const pose = HURT_SPEAR_POSES[paint.view][frame];
  paint.line(...pose.shaft, paint.colors.wood[1]);
  paint.dot(pose.highlight[0], pose.highlight[1], paint.colors.wood[0]);
  for (const [x, y, shade] of pose.head) paint.dot(x, y, paint.colors.spearhead[shade]);
}

export function drawHurtHands(context, direction, frame, shift, flash) {
  const paint = createHurtPainter(context, direction, shift, flash);
  const pose = HURT_SPEAR_POSES[paint.view][frame];
  for (const [x, y, shade] of pose.hands) paint.dot(x, y, paint.colors.skin[shade]);
  const last = pose.hands[pose.hands.length - 1];
  paint.dot(last[0], last[1], paint.colors.accent[1]);
}

function renderCentaurHurt(args) {
  assert(args.family.id === 'centaur', 'The EN-E03 Centaur Hurt renderer is restricted to Centaur.');
  assert(args.variant.id === 'steppe-hunter', 'The EN-E03 Centaur Hurt renderer is restricted to Steppe Hunter.');
  if (args.animation.id === 'idle' || args.animation.id === 'walk' || args.animation.id === 'attack') {
    return EN_E03_CENTAUR_ATTACK_RENDERER.render(args);
  }
  assert(args.animation.id === 'hurt' && args.frame >= 0 && args.frame < 2, 'The EN-E03 Centaur Hurt renderer authorizes only approved Idle, Walk, and Attack plus two Hurt frames.');
  const shift = EN_E03_CENTAUR_HURT_BODY_SHIFTS[args.direction][args.frame];
  const flash = args.frame === 0;
  const body = renderHurtBody(args);
  args.context.clearRect(0, 0, SIZE, SIZE);
  if (args.direction === 'up') drawHurtSpear(args.context, args.direction, args.frame, shift, flash);
  paintHurtBody(args.context, body, shift, flash);
  if (args.direction !== 'up') drawHurtSpear(args.context, args.direction, args.frame, shift, flash);
  drawHurtHands(args.context, args.direction, args.frame, shift, flash);
  return Object.freeze({
    family: args.family.id,
    variant: args.variant.id,
    direction: args.direction,
    animation: args.animation.id,
    frame: args.frame,
    renderedAnimation: 'hurt',
    renderedFrame: args.frame,
    centaurHurtGate: EN_E03_CENTAUR_HURT_GATE.id,
    approvedAttackGate: EN_E03_CENTAUR_ATTACK_GATE.id,
    precedingApprovalGate: EN_E03_GIANT_HURT_GATE.id,
    bodyShift: shift,
  });
}

export const EN_E03_CENTAUR_HURT_RENDERER = Object.freeze({
  key: 'en-e03-centaur-hurt-v1',
  chassis: EN_E01_HUMANOID_RENDERER.chassis,
  render: renderCentaurHurt,
});

export const EN_E03_CENTAUR_HURT_FAMILY = deepFreeze({
  id: 'centaur',
  name: 'Centaur',
  sliceId: 'EN-E03',
  rendererKey: EN_E03_CENTAUR_HURT_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [{
    id: 'steppe-hunter',
    name: 'Steppe Hunter',
    brief: 'Approved Idle, Walk, and Attack baselines plus an approved two-frame Hurt with a full hybrid recoil, fixed hoof contacts, and braced spear recovery.',
    rendererData: EN_E03_STEPPE_HUNTER_CALIBRATION_DATA,
  }],
  rendererData: {
    contractCard: 'centaur',
    approvedIdleGate: EN_E03_CENTAUR_ATTACK_GATE.approvedIdle.gateId,
    approvedWalkGate: EN_E03_CENTAUR_ATTACK_GATE.approvedWalk.gateId,
    approvedAttackGate: EN_E03_CENTAUR_ATTACK_GATE.id,
    precedingApprovalGate: EN_E03_GIANT_HURT_GATE.id,
    activeGate: EN_E03_CENTAUR_HURT_GATE.id,
  },
  review: {
    baselineVariant: 'steppe-hunter',
    scale: 8,
    notes: 'Visually approved two-frame common Hurt baseline; every earlier approved Steppe Hunter frame remains exact and the family stays internal and non-public.',
  },
});

export const EN_E03_CENTAUR_HURT_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E03_CENTAUR_HURT_RENDERER],
  families: [EN_E03_CENTAUR_HURT_FAMILY],
});
