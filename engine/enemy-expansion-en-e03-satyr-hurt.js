import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E01_HUMANOID_RENDERER } from './enemy-expansion-humanoid.js';
import { EN_E03_CENTAUR_HURT_GATE } from './enemy-expansion-en-e03-centaur-hurt.js';
import { EN_E03_BRIAR_REVELER_CALIBRATION_DATA } from './enemy-expansion-en-e03-satyr-calibration.js';
import { EN_E03_SATYR_IDLE_GATE } from './enemy-expansion-en-e03-satyr-idle.js';
import { EN_E03_SATYR_WALK_GATE } from './enemy-expansion-en-e03-satyr-walk.js';
import {
  EN_E03_SATYR_ATTACK_GATE,
  EN_E03_SATYR_ATTACK_RENDERER,
} from './enemy-expansion-en-e03-satyr-attack.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E03_SATYR_HURT_GATE = deepFreeze({
  id: 'en-e03-briar-reveler-hurt-v1',
  status: 'approved',
  authorizedOn: '2026-08-07',
  authorizationEvidence: 'Designer approved the exact labeled all-four-direction raw and Complete B + Form Steppe Hunter Hurt animations, the approval lane was committed and pushed, and then said: awesome lets do next. Codex explicitly bounded the next gate as Briar Reveler Hurt H1-H2 across all four directions.',
  approvedOn: '2026-08-07',
  approvalEvidence: 'Designer reviewed both exact labeled all-four-direction raw and Complete B + Form Briar Reveler Hurt animations together and said: approved lets do next.',
  precedingApproval: {
    gateId: EN_E03_CENTAUR_HURT_GATE.id,
    artifactSha256: EN_E03_CENTAUR_HURT_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_CENTAUR_HURT_GATE.assembledArtifactSha256,
    candidateFrameDigest: EN_E03_CENTAUR_HURT_GATE.candidateFrameDigest,
  },
  approvedIdle: {
    gateId: EN_E03_SATYR_IDLE_GATE.id,
    artifactSha256: EN_E03_SATYR_IDLE_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_SATYR_IDLE_GATE.assembledArtifactSha256,
    frameDigest: EN_E03_SATYR_IDLE_GATE.candidateFrameDigest,
  },
  approvedWalk: {
    gateId: EN_E03_SATYR_WALK_GATE.id,
    artifactSha256: EN_E03_SATYR_WALK_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_SATYR_WALK_GATE.assembledArtifactSha256,
    frameDigest: EN_E03_SATYR_WALK_GATE.candidateFrameDigest,
  },
  approvedAttack: {
    gateId: EN_E03_SATYR_ATTACK_GATE.id,
    artifactSha256: EN_E03_SATYR_ATTACK_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_SATYR_ATTACK_GATE.assembledArtifactSha256,
    frameDigest: EN_E03_SATYR_ATTACK_GATE.candidateFrameDigest,
  },
  artifact: 'enemy-expansion-review/en-e03-satyr-hurt/en-e03-briar-reveler-hurt-raw.png',
  artifactSha256: '0b5cd11212e272ab29bdac3336155e7546b3e1e28299c7ce70c0a7232b6ba44d',
  assembledArtifact: 'enemy-expansion-review/en-e03-satyr-hurt/en-e03-briar-reveler-hurt-complete-b-form.png',
  assembledArtifactSha256: '78bec5bc888515bad74578b4d08f381f4c25842e88e3b76c74697d3da48fdb74',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e03-satyr-hurt/en-e03-briar-reveler-hurt-four-directions-labeled.gif',
      sha256: '438056d9d9c195aff1ab429ead9164f9b98bfd89cf916ff8936d353ce3f713f9',
      width: 192,
      height: 224,
      frames: 2,
      durationMs: 280,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e03-satyr-hurt/en-e03-briar-reveler-hurt-four-directions-labeled-complete-b-form.gif',
      sha256: '8b73e3f44c0a7ff94df0cdb8b167d44d32e20e0273275d824844045de0cddce1',
      width: 192,
      height: 224,
      frames: 2,
      durationMs: 280,
    },
  },
  candidateFrameDigest: '3bc6bbd29189d8155784fa7499b355af1b826c44d0caf60b37db198cb7625030',
  scope: 'Briar Reveler common Hurt only: H1-H2 across Down, Left, Right, and Up, with approved Idle, Walk, and Attack delegated byte-for-byte.',
  motion: 'H1 flashes the complete horned goatfolk-staff silhouette white and recoils the connected body around fixed split-hoof contacts; H2 drops into a colored brace with newly settled hocks, tail, hands, horns, and crooked staff.',
  reviewPresentation: 'Show both labeled all-four-direction GIFs together for review: raw/no-outline and Complete B + Form. Narrower evidence is allowed only for an explicitly requested direction, frame, layer, outline mode, or isolated defect.',
  exclusions: [
    'Idle pixel changes',
    'Walk pixel changes',
    'Attack pixel changes',
    'Giant changes',
    'Centaur changes',
    'specialist variants',
    'elite variants',
    'Cast aliases',
    'Death aliases',
    'registration',
    'consumer exposure',
    'effects',
    'release',
  ],
  nextGate: 'Visual approval is complete and this bounded lane is published. The designer also authorized continuation; Codex explicitly bounded only the separate common Cast/Death alias gate across approved Hill Breaker, Steppe Hunter, and Briar Reveler baselines.',
});

export const EN_E03_SATYR_HURT_BODY_SHIFTS = deepFreeze({
  down: [{ x: 1, y: 0 }, { x: 0, y: 1 }],
  left: [{ x: -1, y: 0 }, { x: 0, y: 1 }],
  right: [{ x: -1, y: 0 }, { x: 0, y: 1 }],
  up: [{ x: -1, y: 0 }, { x: 0, y: 1 }],
});

const FRONT_LEG_PHASES = deepFreeze([
  [
    { hipX: 9, hipY: 15, kneeX: 7, kneeY: 18, ankleX: 7, hoofX: 6, shade: 0 },
    { hipX: 14, hipY: 15, kneeX: 15, kneeY: 18, ankleX: 16, hoofX: 15, shade: 1 },
  ],
  [
    { hipX: 8, hipY: 16, kneeX: 7, kneeY: 18, ankleX: 7, hoofX: 6, shade: 0 },
    { hipX: 13, hipY: 16, kneeX: 14, kneeY: 18, ankleX: 16, hoofX: 15, shade: 1 },
  ],
]);

const SIDE_LEG_PHASES = deepFreeze([
  [
    { hipX: 9, hipY: 15, kneeX: 7, kneeY: 18, ankleX: 9, hoofX: 8, shade: 1 },
    { hipX: 13, hipY: 15, kneeX: 15, kneeY: 18, ankleX: 17, hoofX: 16, shade: 0 },
  ],
  [
    { hipX: 10, hipY: 16, kneeX: 8, kneeY: 18, ankleX: 9, hoofX: 8, shade: 1 },
    { hipX: 14, hipY: 16, kneeX: 15, kneeY: 18, ankleX: 17, hoofX: 16, shade: 0 },
  ],
]);

const TAIL_POSES = deepFreeze({
  down: [
    { root: [9, 16], tip: [3, 12] },
    { root: [8, 17], tip: [3, 18] },
  ],
  right: [
    { root: [10, 16], tip: [3, 12] },
    { root: [11, 17], tip: [4, 18] },
  ],
  up: [
    { root: [13, 16], tip: [21, 12] },
    { root: [14, 17], tip: [20, 18] },
  ],
});

const STAFF_POSES = deepFreeze({
  down: [
    { tip: [21, 3], butt: [13, 18], hand: [15, 11] },
    { tip: [18, 3], butt: [19, 18], hand: [17, 11] },
  ],
  right: [
    { tip: [5, 3], butt: [17, 18], hand: [12, 11] },
    { tip: [20, 4], butt: [18, 18], hand: [17, 11] },
  ],
  up: [
    { tip: [2, 4], butt: [9, 18], hand: [6, 11] },
    { tip: [5, 3], butt: [4, 18], hand: [4, 11] },
  ],
});

function createPixelBuffer() {
  const pixels = new Array(SIZE * SIZE).fill(null);
  let fillStyle = '#000000';
  const context = {
    get fillStyle() { return fillStyle; },
    set fillStyle(value) { fillStyle = value; },
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

function createPainter(context, direction) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const rect = (x, y, width, height, fill) => {
    assert([x, y, width, height].every(Number.isInteger) && width > 0 && height > 0, 'Satyr Hurt rectangles must use positive integer geometry.');
    context.fillStyle = fill;
    context.fillRect(mirrored ? SIZE - x - width : x, y, width, height);
  };
  return {
    view,
    rect,
    dot(x, y, fill) { rect(x, y, 1, 1, fill); },
  };
}

function colors() {
  const data = EN_E03_BRIAR_REVELER_CALIBRATION_DATA;
  return { skin: data.actor.palette.skin, ...data.satyr };
}

function drawLine(paint, from, to, fill) {
  let [x0, y0] = from;
  const [x1, y1] = to;
  const dx = Math.abs(x1 - x0);
  const sx = x0 < x1 ? 1 : -1;
  const dy = -Math.abs(y1 - y0);
  const sy = y0 < y1 ? 1 : -1;
  let error = dx + dy;
  while (true) {
    paint.dot(x0, y0, fill);
    if (x0 === x1 && y0 === y1) break;
    const previousX = x0;
    const previousY = y0;
    const twice = error * 2;
    if (twice >= dy) { error += dy; x0 += sx; }
    if (twice <= dx) { error += dx; y0 += sy; }
    if (x0 !== previousX && y0 !== previousY) paint.dot(x0, previousY, fill);
  }
}

function paintUpperBody(context, pixels, direction, shift) {
  for (let y = 0; y < 17; y++) for (let x = 0; x < SIZE; x++) {
    const color = pixels[(y * SIZE) + x];
    if (color === null) continue;
    context.fillStyle = color;
    context.fillRect(direction === 'left' ? SIZE - 1 - x - shift.x : x + shift.x, y + shift.y, 1, 1);
  }
}

function replaceBackHeadWithApprovedDepth(base, args) {
  if (args.direction !== 'up') return;
  const approvedDepth = createPixelBuffer();
  EN_E01_HUMANOID_RENDERER.render({
    ...args,
    animation: { ...args.animation, id: 'attack' },
    frame: 3,
    context: approvedDepth.context,
  });
  base.context.clearRect(0, 0, SIZE, 12);
  for (let y = 0; y < 12; y++) for (let x = 0; x < SIZE; x++) {
    const color = approvedDepth.pixels[(y * SIZE) + x];
    if (color === null) continue;
    base.context.fillStyle = color;
    base.context.fillRect(x, y, 1, 1);
  }
}

function drawSplitHoofLeg(paint, palette, leg, rearView) {
  const shade = rearView ? 1 - leg.shade : leg.shade;
  const opposite = 1 - shade;
  paint.rect(leg.hipX, leg.hipY, 3, 3, palette.hide[shade]);
  paint.rect(leg.kneeX, leg.kneeY, 3, 2, palette.hide[opposite]);
  paint.rect(leg.ankleX, 20, 2, 2, palette.hide[shade]);
  paint.rect(leg.hoofX, 21, 3, 1, palette.hoof[1]);
  paint.dot(leg.hoofX, 22, palette.hoof[shade]);
  paint.dot(leg.hoofX + 2, 22, palette.hoof[opposite]);
}

function drawHurtLegs(paint, palette, frame) {
  const legs = paint.view === 'right' ? SIDE_LEG_PHASES[frame] : FRONT_LEG_PHASES[frame];
  for (const leg of legs) drawSplitHoofLeg(paint, palette, leg, paint.view === 'up');
}

function drawHurtTail(paint, palette, frame) {
  const pose = TAIL_POSES[paint.view][frame];
  drawLine(paint, pose.root, pose.tip, palette.hide[1]);
  paint.rect(pose.root[0] - 1, pose.root[1] - 1, 3, 2, palette.hide[0]);
  paint.dot(pose.tip[0], pose.tip[1], palette.hide[0]);
}

function drawStaffShaft(paint, palette, frame) {
  const pose = STAFF_POSES[paint.view][frame];
  drawLine(paint, pose.tip, pose.butt, palette.wood[1]);
  const [tipX, tipY] = pose.tip;
  const inward = tipX > 11 ? -1 : 1;
  paint.dot(tipX, tipY, palette.horn[0]);
  paint.dot(tipX + inward, tipY, palette.horn[0]);
  paint.dot(tipX + (inward * 2), tipY, palette.horn[1]);
  paint.dot(tipX + (inward * 2), tipY + 1, palette.horn[1]);
  paint.dot(Math.round((pose.tip[0] + pose.butt[0]) / 2), Math.round((pose.tip[1] + pose.butt[1]) / 2), palette.wood[0]);
}

function drawStaffGrip(paint, palette, frame) {
  const [handX, handY] = STAFF_POSES[paint.view][frame].hand;
  paint.rect(handX, handY, 2, 3, paint.view === 'up' ? palette.skin[1] : palette.skin[0]);
  paint.dot(handX + 1, handY + 1, palette.accent[paint.view === 'up' ? 1 : 0]);
}

function drawHornCurls(paint, palette, shift) {
  const x = shift.x;
  const y = shift.y;
  if (paint.view === 'right') {
    paint.rect(9 + x, 1 + y, 2, 1, palette.horn[0]);
    paint.rect(9 + x, 2 + y, 1, 2, palette.horn[0]);
    paint.dot(10 + x, 3 + y, palette.horn[1]);
    paint.dot(10 + x, 4 + y, palette.horn[1]);
    return;
  }
  paint.rect(5 + x, 3 + y, 1, 2, palette.horn[0]);
  paint.dot(6 + x, 4 + y, palette.horn[0]);
  paint.dot(6 + x, 5 + y, palette.horn[1]);
  paint.rect(18 + x, 3 + y, 1, 2, palette.horn[0]);
  paint.dot(17 + x, 4 + y, palette.horn[0]);
  paint.dot(17 + x, 5 + y, palette.horn[1]);
}

function paintFinishedFrame(context, pixels, flash) {
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    const color = pixels[(y * SIZE) + x];
    if (color === null) continue;
    context.fillStyle = flash ? '#ffffff' : color;
    context.fillRect(x, y, 1, 1);
  }
}

function renderSatyrHurt(args) {
  assert(args.family.id === 'satyr', 'The EN-E03 Satyr Hurt renderer is restricted to Satyr.');
  assert(args.variant.id === 'briar-reveler', 'The EN-E03 Satyr Hurt renderer is restricted to Briar Reveler.');
  if (args.animation.id === 'idle' || args.animation.id === 'walk' || args.animation.id === 'attack') {
    return EN_E03_SATYR_ATTACK_RENDERER.render(args);
  }
  assert(args.animation.id === 'hurt' && args.frame >= 0 && args.frame < 2, 'The EN-E03 Satyr Hurt renderer authorizes only approved Idle, Walk, and Attack plus two Hurt frames.');
  const shift = EN_E03_SATYR_HURT_BODY_SHIFTS[args.direction][args.frame];
  const palette = colors();
  const base = createPixelBuffer();
  EN_E01_HUMANOID_RENDERER.render({ ...args, direction: args.direction === 'left' ? 'right' : args.direction, context: base.context });
  replaceBackHeadWithApprovedDepth(base, args);
  const composed = createPixelBuffer();
  const paint = createPainter(composed.context, args.direction);
  drawHurtTail(paint, palette, args.frame);
  if (paint.view === 'up') drawStaffShaft(paint, palette, args.frame);
  paintUpperBody(composed.context, base.pixels, args.direction, shift);
  drawHurtLegs(paint, palette, args.frame);
  if (paint.view !== 'up') drawStaffShaft(paint, palette, args.frame);
  drawStaffGrip(paint, palette, args.frame);
  drawHornCurls(paint, palette, shift);
  if (paint.view === 'up') paint.dot(9 + shift.x, 9 + shift.y, palette.skin[0]);
  args.context.clearRect(0, 0, SIZE, SIZE);
  paintFinishedFrame(args.context, composed.pixels, args.frame === 0);
  return Object.freeze({
    family: args.family.id,
    variant: args.variant.id,
    direction: args.direction,
    animation: args.animation.id,
    frame: args.frame,
    renderedAnimation: 'hurt',
    renderedFrame: args.frame,
    satyrHurtGate: EN_E03_SATYR_HURT_GATE.id,
    approvedAttackGate: EN_E03_SATYR_ATTACK_GATE.id,
    precedingApprovalGate: EN_E03_CENTAUR_HURT_GATE.id,
    bodyShift: shift,
  });
}

export const EN_E03_SATYR_HURT_RENDERER = Object.freeze({
  key: 'en-e03-satyr-hurt-v1',
  chassis: EN_E01_HUMANOID_RENDERER.chassis,
  render: renderSatyrHurt,
});

export const EN_E03_SATYR_HURT_FAMILY = deepFreeze({
  id: 'satyr',
  name: 'Satyr',
  sliceId: 'EN-E03',
  rendererKey: EN_E03_SATYR_HURT_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [{
    id: 'briar-reveler',
    name: 'Briar Reveler',
    brief: 'Approved Idle, Walk, Attack, and two-frame full-body Hurt baselines with fixed split-hoof contacts and a participating tail, hands, horns, and crooked staff.',
    rendererData: EN_E03_BRIAR_REVELER_CALIBRATION_DATA,
  }],
  rendererData: {
    contractCard: 'satyr',
    approvedIdleGate: EN_E03_SATYR_IDLE_GATE.id,
    approvedWalkGate: EN_E03_SATYR_WALK_GATE.id,
    approvedAttackGate: EN_E03_SATYR_ATTACK_GATE.id,
    precedingApprovalGate: EN_E03_CENTAUR_HURT_GATE.id,
    activeGate: EN_E03_SATYR_HURT_GATE.id,
  },
  review: {
    baselineVariant: 'briar-reveler',
    scale: 8,
    notes: 'Visually approved two-frame common Hurt baseline; every earlier approved Briar Reveler frame remains delegated exactly and the family stays internal and non-public.',
  },
});

export const EN_E03_SATYR_HURT_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E03_SATYR_HURT_RENDERER],
  families: [EN_E03_SATYR_HURT_FAMILY],
});
