import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E01_HUMANOID_RENDERER } from './enemy-expansion-humanoid.js';
import { EN_E03_CENTAUR_ATTACK_GATE } from './enemy-expansion-en-e03-centaur-attack.js';
import { EN_E03_BRIAR_REVELER_CALIBRATION_DATA } from './enemy-expansion-en-e03-satyr-calibration.js';
import { EN_E03_SATYR_IDLE_GATE } from './enemy-expansion-en-e03-satyr-idle.js';
import {
  EN_E03_SATYR_WALK_GATE,
  EN_E03_SATYR_WALK_RENDERER,
} from './enemy-expansion-en-e03-satyr-walk.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E03_SATYR_ATTACK_GATE = deepFreeze({
  id: 'en-e03-briar-reveler-attack-v1',
  status: 'approved',
  authorizedOn: '2026-08-07',
  authorizationEvidence: 'Designer approved the exact Steppe Hunter Attack lane, published it under the standing approval rule, and then said: lets keep going.',
  approvedOn: '2026-08-07',
  approvalEvidence: 'Designer reviewed both exact labeled all-four-direction raw and Complete B + Form Briar Reveler Attack animations and said: very good! approved.',
  precedingApproval: {
    gateId: EN_E03_CENTAUR_ATTACK_GATE.id,
    artifactSha256: EN_E03_CENTAUR_ATTACK_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_CENTAUR_ATTACK_GATE.assembledArtifactSha256,
    candidateFrameDigest: EN_E03_CENTAUR_ATTACK_GATE.candidateFrameDigest,
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
  artifact: 'enemy-expansion-review/en-e03-satyr-attack/en-e03-briar-reveler-attack-raw.png',
  artifactSha256: 'ac7ca315dfdd65b378c5db42623bf4013b961c0ebf1f22c0045803f14dcb9abb',
  assembledArtifact: 'enemy-expansion-review/en-e03-satyr-attack/en-e03-briar-reveler-attack-complete-b-form.png',
  assembledArtifactSha256: '4d97b61111bcf293d024a01201677fb10ba54bdf496fa0264df5abb78f5a54ab',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e03-satyr-attack/en-e03-briar-reveler-attack-four-directions-labeled-v1.gif',
      sha256: '1625c6db6759cb4a20ea4521ef1a4b04199813f2dc75e2e0db2fa5e4a54241d9',
      width: 192,
      height: 224,
      frames: 4,
      durationMs: 480,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e03-satyr-attack/en-e03-briar-reveler-attack-four-directions-labeled-complete-b-form-v1.gif',
      sha256: '5efb83b879f1cbe130075db722f9d26762180b4e00945941465d0dbb8304886a',
      width: 192,
      height: 224,
      frames: 4,
      durationMs: 480,
    },
  },
  candidateFrameDigest: '9545779f0d39c16f1fedaf581ad1f5dee8b6ce0b79d35ce23a66e81375c32270',
  scope: 'Briar Reveler common Attack only: A1-A4 across Down, Left, Right, and Up, with approved Idle and Walk delegated byte-for-byte and shown as frozen context.',
  motion: 'A1 braces and draws the crooked staff back, A2 lifts through the torso and hocks, A3 drives a diagonal whole-body strike, and A4 settles to guard; the split hooves stay planted while hips, upper body, tail, hands, and staff all participate.',
  exclusions: [
    'Idle pixel changes',
    'Walk pixel changes',
    'Giant changes',
    'Centaur changes',
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
    { bodyX: -1, bodyY: 0, legs: 0, tail: 0, staff: 0, name: 'brace' },
    { bodyX: 0, bodyY: 0, legs: 1, tail: 1, staff: 1, name: 'lift' },
    { bodyX: 1, bodyY: 1, legs: 2, tail: 2, staff: 2, name: 'strike' },
    { bodyX: 0, bodyY: 0, legs: 3, tail: 3, staff: 3, name: 'recover' },
  ],
  right: [
    { bodyX: -1, bodyY: 0, legs: 0, tail: 0, staff: 0, name: 'brace' },
    { bodyX: 0, bodyY: 0, legs: 1, tail: 1, staff: 1, name: 'lift' },
    { bodyX: 1, bodyY: 1, legs: 2, tail: 2, staff: 2, name: 'strike' },
    { bodyX: 0, bodyY: 0, legs: 3, tail: 3, staff: 3, name: 'recover' },
  ],
  up: [
    { bodyX: 1, bodyY: 0, legs: 0, tail: 0, staff: 0, name: 'brace' },
    { bodyX: 0, bodyY: 0, legs: 1, tail: 1, staff: 1, name: 'lift' },
    { bodyX: -1, bodyY: 1, legs: 2, tail: 2, staff: 2, name: 'strike' },
    { bodyX: 0, bodyY: 0, legs: 3, tail: 3, staff: 3, name: 'recover' },
  ],
});

const FRONT_LEG_PHASES = deepFreeze([
  [
    { hipX: 7, hipY: 16, kneeX: 6, kneeY: 18, ankleX: 7, hoofX: 6, shade: 0 },
    { hipX: 12, hipY: 16, kneeX: 14, kneeY: 18, ankleX: 16, hoofX: 15, shade: 1 },
  ],
  [
    { hipX: 8, hipY: 15, kneeX: 7, kneeY: 18, ankleX: 7, hoofX: 6, shade: 0 },
    { hipX: 13, hipY: 15, kneeX: 14, kneeY: 18, ankleX: 16, hoofX: 15, shade: 1 },
  ],
  [
    { hipX: 9, hipY: 16, kneeX: 8, kneeY: 18, ankleX: 7, hoofX: 6, shade: 0 },
    { hipX: 14, hipY: 16, kneeX: 15, kneeY: 18, ankleX: 16, hoofX: 15, shade: 1 },
  ],
  [
    { hipX: 8, hipY: 16, kneeX: 7, kneeY: 18, ankleX: 7, hoofX: 6, shade: 0 },
    { hipX: 13, hipY: 16, kneeX: 14, kneeY: 18, ankleX: 16, hoofX: 15, shade: 1 },
  ],
]);

const SIDE_LEG_PHASES = deepFreeze([
  [
    { hipX: 10, hipY: 16, kneeX: 8, kneeY: 18, ankleX: 9, hoofX: 8, shade: 1 },
    { hipX: 14, hipY: 16, kneeX: 16, kneeY: 18, ankleX: 17, hoofX: 16, shade: 0 },
  ],
  [
    { hipX: 11, hipY: 15, kneeX: 10, kneeY: 18, ankleX: 9, hoofX: 8, shade: 1 },
    { hipX: 14, hipY: 15, kneeX: 15, kneeY: 18, ankleX: 17, hoofX: 16, shade: 0 },
  ],
  [
    { hipX: 12, hipY: 16, kneeX: 10, kneeY: 18, ankleX: 9, hoofX: 8, shade: 1 },
    { hipX: 15, hipY: 16, kneeX: 16, kneeY: 18, ankleX: 17, hoofX: 16, shade: 0 },
  ],
  [
    { hipX: 11, hipY: 16, kneeX: 9, kneeY: 18, ankleX: 9, hoofX: 8, shade: 1 },
    { hipX: 14, hipY: 16, kneeX: 16, kneeY: 18, ankleX: 17, hoofX: 16, shade: 0 },
  ],
]);

const STAFF_POSES = deepFreeze({
  down: [
    { tip: [14, 2], butt: [20, 21], hand: [16, 11] },
    { tip: [5, 5], butt: [20, 17], hand: [13, 11] },
    { tip: [4, 13], butt: [20, 20], hand: [13, 16] },
    { tip: [17, 3], butt: [19, 21], hand: [17, 12] },
  ],
  right: [
    { tip: [7, 3], butt: [18, 21], hand: [13, 12] },
    { tip: [16, 2], butt: [19, 21], hand: [17, 12] },
    { tip: [21, 8], butt: [6, 19], hand: [14, 13] },
    { tip: [19, 3], butt: [20, 21], hand: [18, 12] },
  ],
  up: [
    { tip: [9, 2], butt: [3, 21], hand: [6, 11] },
    { tip: [18, 5], butt: [3, 17], hand: [9, 11] },
    { tip: [19, 13], butt: [3, 20], hand: [9, 16] },
    { tip: [6, 3], butt: [4, 21], hand: [5, 12] },
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

function createPainter(context, direction) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Satyr Attack rectangles must use positive integer geometry.',
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

function colors() {
  const data = EN_E03_BRIAR_REVELER_CALIBRATION_DATA;
  return {
    skin: data.actor.palette.skin,
    ...data.satyr,
  };
}

function paintUpperBody(context, pixels, direction, phase) {
  const physicalX = direction === 'left' ? -phase.bodyX : phase.bodyX;
  for (let y = 0; y < 17; y++) for (let x = 0; x < SIZE; x++) {
    const color = pixels[(y * SIZE) + x];
    if (color === null) continue;
    context.fillStyle = color;
    context.fillRect(x + physicalX, y + phase.bodyY, 1, 1);
  }
}

function drawSplitHoofLeg(paint, palette, leg, rearView) {
  const { rect, dot } = paint;
  const shade = rearView ? 1 - leg.shade : leg.shade;
  const opposite = 1 - shade;
  rect(leg.hipX, leg.hipY, 3, 3, palette.hide[shade]);
  rect(leg.kneeX, leg.kneeY, 3, 2, palette.hide[opposite]);
  rect(leg.ankleX, 20, 2, 2, palette.hide[shade]);
  rect(leg.hoofX, 21, 3, 1, palette.hoof[1]);
  dot(leg.hoofX, 22, palette.hoof[shade]);
  dot(leg.hoofX + 2, 22, palette.hoof[opposite]);
}

function drawAttackLegs(paint, palette, phase) {
  const side = paint.view === 'right';
  const legs = side ? SIDE_LEG_PHASES[phase.legs] : FRONT_LEG_PHASES[phase.legs];
  for (const leg of legs) drawSplitHoofLeg(paint, palette, leg, paint.view === 'up');
}

function drawAttackTail(paint, palette, phase) {
  const { rect, dot } = paint;
  if (paint.view === 'right') {
    const poses = [[10, 16, 3, 13], [10, 16, 4, 12], [10, 16, 3, 19], [10, 16, 4, 15]];
    const [rootX, rootY, tipX, tipY] = poses[phase.tail];
    drawLine(paint, [rootX, rootY], [tipX, tipY], palette.hide[1]);
    rect(rootX - 2, rootY - 1, 3, 2, palette.hide[0]);
    dot(tipX, tipY, palette.hide[0]);
    return;
  }
  if (paint.view === 'up') {
    const poses = [[14, 16, 20, 12], [14, 16, 21, 14], [14, 16, 20, 19], [14, 16, 19, 16]];
    const [rootX, rootY, tipX, tipY] = poses[phase.tail];
    drawLine(paint, [rootX, rootY], [tipX, tipY], palette.hide[1]);
    rect(rootX - 1, rootY - 1, 3, 2, palette.hide[0]);
    dot(tipX, tipY, palette.hide[0]);
    return;
  }
  const poses = [[8, 16, 3, 12], [8, 16, 2, 14], [8, 16, 3, 20], [8, 16, 3, 15]];
  const [rootX, rootY, tipX, tipY] = poses[phase.tail];
  drawLine(paint, [rootX, rootY], [tipX, tipY], palette.hide[1]);
  rect(rootX - 2, rootY - 1, 3, 2, palette.hide[0]);
  dot(tipX, tipY, palette.hide[0]);
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
    if (twice >= dy) {
      error += dy;
      x0 += sx;
    }
    if (twice <= dx) {
      error += dx;
      y0 += sy;
    }
    if (x0 !== previousX && y0 !== previousY) paint.dot(x0, previousY, fill);
  }
}

function staffPose(paint, phase) {
  return STAFF_POSES[paint.view][phase.staff];
}

function drawStaffShaft(paint, palette, phase) {
  const pose = staffPose(paint, phase);
  drawLine(paint, pose.tip, pose.butt, palette.wood[1]);
  const [tipX, tipY] = pose.tip;
  paint.dot(tipX, tipY, palette.horn[0]);
  paint.dot(Math.max(1, tipX - 1), tipY, palette.horn[0]);
  paint.dot(Math.max(1, tipX - 2), tipY, palette.horn[1]);
  paint.dot(Math.max(1, tipX - 2), Math.min(22, tipY + 1), palette.horn[1]);
  const middleX = Math.round((pose.tip[0] + pose.butt[0]) / 2);
  const middleY = Math.round((pose.tip[1] + pose.butt[1]) / 2);
  paint.dot(middleX, middleY, palette.wood[0]);
}

function drawStaffGrip(paint, palette, phase) {
  const [handX, handY] = staffPose(paint, phase).hand;
  paint.rect(handX, handY, 2, 3, paint.view === 'up' ? palette.skin[1] : palette.skin[0]);
  paint.dot(handX + 1, handY + 1, palette.accent[paint.view === 'up' ? 1 : 0]);
}

function drawHornCurls(paint, palette, phase) {
  const { rect, dot } = paint;
  const x = phase.bodyX;
  const y = phase.bodyY;
  if (paint.view === 'right') {
    rect(9 + x, 1 + y, 2, 1, palette.horn[0]);
    rect(9 + x, 2 + y, 1, 2, palette.horn[0]);
    dot(10 + x, 3 + y, palette.horn[1]);
    dot(10 + x, 4 + y, palette.horn[1]);
    return;
  }
  rect(5 + x, 3 + y, 1, 2, palette.horn[0]);
  dot(6 + x, 4 + y, palette.horn[0]);
  dot(6 + x, 5 + y, palette.horn[1]);
  rect(18 + x, 3 + y, 1, 2, palette.horn[0]);
  dot(17 + x, 4 + y, palette.horn[0]);
  dot(17 + x, 5 + y, palette.horn[1]);
}

function renderSatyrAttack(args) {
  assert(args.family.id === 'satyr', 'The EN-E03 Satyr Attack renderer is restricted to Satyr.');
  assert(args.variant.id === 'briar-reveler', 'The EN-E03 Satyr Attack renderer is restricted to Briar Reveler.');
  if (args.animation.id === 'idle' || args.animation.id === 'walk') {
    return EN_E03_SATYR_WALK_RENDERER.render(args);
  }
  assert(args.animation.id === 'attack' && args.frame >= 0 && args.frame < 4, 'The EN-E03 Satyr Attack renderer authorizes only approved Idle and Walk plus four Attack frames.');
  const view = args.direction === 'left' ? 'right' : args.direction;
  const phase = ATTACK_PHASES[view][args.frame];
  const palette = colors();
  const base = createPixelBuffer();
  EN_E01_HUMANOID_RENDERER.render({ ...args, context: base.context });

  args.context.clearRect(0, 0, SIZE, SIZE);
  const paint = createPainter(args.context, args.direction);
  drawAttackTail(paint, palette, phase);
  if (paint.view === 'up') drawStaffShaft(paint, palette, phase);
  paintUpperBody(args.context, base.pixels, args.direction, phase);
  drawAttackLegs(paint, palette, phase);
  if (paint.view !== 'up') drawStaffShaft(paint, palette, phase);
  drawStaffGrip(paint, palette, phase);
  drawHornCurls(paint, palette, phase);
  if (paint.view === 'up') paint.dot(9 + phase.bodyX, 9 + phase.bodyY, palette.skin[0]);

  return Object.freeze({
    family: args.family.id,
    variant: args.variant.id,
    direction: args.direction,
    animation: args.animation.id,
    frame: args.frame,
    renderedAnimation: 'attack',
    renderedFrame: args.frame,
    satyrAttackGate: EN_E03_SATYR_ATTACK_GATE.id,
    approvedWalkGate: EN_E03_SATYR_WALK_GATE.id,
    precedingApprovalGate: EN_E03_CENTAUR_ATTACK_GATE.id,
    attackPhase: phase.name,
  });
}

export const EN_E03_SATYR_ATTACK_RENDERER = Object.freeze({
  key: 'en-e03-satyr-attack-v1',
  chassis: EN_E01_HUMANOID_RENDERER.chassis,
  render: renderSatyrAttack,
});

export const EN_E03_SATYR_ATTACK_FAMILY = deepFreeze({
  id: 'satyr',
  name: 'Satyr',
  sliceId: 'EN-E03',
  rendererKey: EN_E03_SATYR_ATTACK_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [{
    id: 'briar-reveler',
    name: 'Briar Reveler',
    brief: 'Approved Idle and Walk baselines plus an approved four-frame full-body crooked-staff Attack with planted split hooves, braced hocks, counter-sweeping tail, and distinct front/back depth.',
    rendererData: EN_E03_BRIAR_REVELER_CALIBRATION_DATA,
  }],
  rendererData: {
    contractCard: 'satyr',
    approvedWalkGate: EN_E03_SATYR_WALK_GATE.id,
    precedingApprovalGate: EN_E03_CENTAUR_ATTACK_GATE.id,
    activeGate: EN_E03_SATYR_ATTACK_GATE.id,
  },
  review: {
    baselineVariant: 'briar-reveler',
    scale: 8,
    notes: 'One-family four-direction Attack baseline; approved Idle and Walk remain exact, direct visual approval is frozen in the gate, and the family stays internal and non-public.',
  },
});

export const EN_E03_SATYR_ATTACK_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E03_SATYR_ATTACK_RENDERER],
  families: [EN_E03_SATYR_ATTACK_FAMILY],
});
