import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E01_HUMANOID_RENDERER } from './enemy-expansion-humanoid.js';
import { EN_E03_CENTAUR_WALK_GATE } from './enemy-expansion-en-e03-centaur-walk.js';
import { EN_E03_BRIAR_REVELER_CALIBRATION_DATA } from './enemy-expansion-en-e03-satyr-calibration.js';
import {
  EN_E03_SATYR_IDLE_GATE,
  EN_E03_SATYR_IDLE_RENDERER,
} from './enemy-expansion-en-e03-satyr-idle.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E03_SATYR_WALK_GATE = deepFreeze({
  id: 'en-e03-briar-reveler-walk-v1',
  status: 'approved',
  authorizedOn: '2026-08-06',
  authorizationEvidence: 'Designer approved the exact Steppe Hunter raw and Complete B + Form animations, then authorized the next bounded gate with: awesome lets do next.',
  approvedOn: '2026-08-06',
  approvalEvidence: 'Designer reviewed the corrected raw and Complete B + Form Briar Reveler Walk animations and said: greeat lets move on.',
  precedingApproval: {
    gateId: EN_E03_CENTAUR_WALK_GATE.id,
    artifactSha256: EN_E03_CENTAUR_WALK_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_CENTAUR_WALK_GATE.assembledArtifactSha256,
    candidateFrameDigest: EN_E03_CENTAUR_WALK_GATE.candidateFrameDigest,
  },
  approvedIdle: {
    gateId: EN_E03_SATYR_IDLE_GATE.id,
    artifactSha256: EN_E03_SATYR_IDLE_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_SATYR_IDLE_GATE.assembledArtifactSha256,
    frameDigest: EN_E03_SATYR_IDLE_GATE.candidateFrameDigest,
  },
  artifact: 'enemy-expansion-review/en-e03-satyr-walk/en-e03-briar-reveler-walk-raw.png',
  artifactSha256: '8b39d575c3048bbced3ac975c5f204e3bd9ea7fb35ebf329ce0151a481a3269c',
  assembledArtifact: 'enemy-expansion-review/en-e03-satyr-walk/en-e03-briar-reveler-walk-complete-b-form.png',
  assembledArtifactSha256: 'b7e8b566bafbe87816c9f53977dcde8e109f544b488c73012015e3a72b86345f',
  candidateFrameDigest: '409b08eb3bd121dec5e8234c49e2fe11d374b73bf501648852adae2ae4ab5755',
  scope: 'Briar Reveler common Walk only: W1-W4 across Down, Left, Right, and Up, with the approved two-frame Idle baseline delegated byte-for-byte and shown as frozen context.',
  exclusions: [
    'Idle pixel changes',
    'Giant changes',
    'Centaur changes',
    'specialist variants',
    'elite variants',
    'Attack',
    'Hurt',
    'Cast',
    'Death',
    'registration',
    'consumer exposure',
    'effects',
    'release',
  ],
  nextGate: 'Authorized on 2026-08-06: Hill Breaker common Attack A1-A4 across Down, Left, Right, and Up, preserving approved Hill Breaker Idle and Walk byte-for-byte.',
});

export const EN_E03_SATYR_WALK_PHASES = deepFreeze([
  { stride: 1, bob: 0, staff: -1 },
  { stride: 0, bob: 1, staff: 0 },
  { stride: -1, bob: 0, staff: 1 },
  { stride: 0, bob: 1, staff: 0 },
]);

function createPainter(context, direction) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Satyr Walk rectangles must use positive integer geometry.',
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

function drawSplitHoofLeg(paint, colors, leg) {
  const { rect, dot } = paint;
  const oppositeShade = leg.shade === 0 ? 1 : 0;
  rect(leg.hipX, leg.hipY, 3, 3, colors.hide[leg.shade]);
  rect(leg.kneeX, leg.hipY + 2, 3, 2, colors.hide[oppositeShade]);
  rect(leg.ankleX, leg.hoofY - 2, 2, 2, colors.hide[leg.shade]);
  rect(leg.hoofX, leg.hoofY - 1, 3, 1, colors.hoof[1]);
  dot(leg.hoofX, leg.hoofY, colors.hoof[leg.shade]);
  dot(leg.hoofX + 2, leg.hoofY, colors.hoof[oppositeShade]);
}

function downLegs(phase, rearView) {
  const hipY = 16 + phase.bob;
  const shades = rearView ? [1, 0] : [0, 1];
  if (phase.stride > 0) return [
    { hipX: 8, hipY, kneeX: 7, ankleX: 6, hoofX: 5, hoofY: 22, shade: shades[0] },
    { hipX: 13, hipY, kneeX: 14, ankleX: 15, hoofX: 15, hoofY: 21, shade: shades[1] },
  ];
  if (phase.stride < 0) return [
    { hipX: 8, hipY, kneeX: 7, ankleX: 7, hoofX: 7, hoofY: 21, shade: shades[0] },
    { hipX: 13, hipY, kneeX: 14, ankleX: 15, hoofX: 16, hoofY: 22, shade: shades[1] },
  ];
  return [
    { hipX: 8, hipY, kneeX: 8, ankleX: 7, hoofX: 7, hoofY: 22, shade: shades[0] },
    { hipX: 13, hipY, kneeX: 13, ankleX: 14, hoofX: 14, hoofY: 22, shade: shades[1] },
  ];
}

function sideLegs(phase) {
  const hipY = 16 + phase.bob;
  if (phase.stride > 0) return [
    { hipX: 13, hipY, kneeX: 15, ankleX: 16, hoofX: 17, hoofY: 22, shade: 0 },
    { hipX: 10, hipY, kneeX: 9, ankleX: 8, hoofX: 7, hoofY: 21, shade: 1 },
  ];
  if (phase.stride < 0) return [
    { hipX: 13, hipY, kneeX: 14, ankleX: 15, hoofX: 15, hoofY: 21, shade: 0 },
    { hipX: 10, hipY, kneeX: 8, ankleX: 7, hoofX: 6, hoofY: 22, shade: 1 },
  ];
  return [
    { hipX: 13, hipY, kneeX: 13, ankleX: 14, hoofX: 14, hoofY: 22, shade: 0 },
    { hipX: 10, hipY, kneeX: 10, ankleX: 9, hoofX: 9, hoofY: 22, shade: 1 },
  ];
}

function drawDownTail(paint, colors, stride) {
  const { rect, dot } = paint;
  if (stride > 0) {
    rect(6, 15, 3, 2, colors.hide[0]);
    rect(4, 14, 3, 2, colors.hide[1]);
    dot(4, 13, colors.hide[0]);
  } else if (stride < 0) {
    rect(6, 16, 3, 2, colors.hide[0]);
    rect(4, 17, 3, 2, colors.hide[1]);
    dot(4, 19, colors.hide[0]);
  } else {
    rect(6, 16, 3, 2, colors.hide[0]);
    rect(4, 16, 3, 2, colors.hide[1]);
    dot(4, 15, colors.hide[0]);
  }
}

function drawUpTail(paint, colors, stride) {
  const { rect, dot } = paint;
  const tailX = stride > 0 ? 12 : stride < 0 ? 14 : 13;
  const tailY = stride > 0 ? 14 : stride < 0 ? 17 : 15;
  rect(tailX, tailY, 2, 3, colors.hide[0]);
  rect(tailX + 1, tailY + (stride > 0 ? -1 : 2), 3, 2, colors.hide[1]);
  dot(tailX + 4, tailY + (stride > 0 ? -2 : 3), colors.hide[0]);
}

function drawSideTail(paint, colors, stride) {
  const { rect, dot } = paint;
  if (stride > 0) {
    rect(6, 15, 4, 2, colors.hide[0]);
    rect(3, 14, 4, 2, colors.hide[1]);
    dot(3, 13, colors.hide[0]);
  } else if (stride < 0) {
    rect(6, 16, 4, 2, colors.hide[0]);
    rect(3, 17, 4, 2, colors.hide[1]);
    dot(3, 19, colors.hide[0]);
  } else {
    rect(6, 16, 4, 2, colors.hide[0]);
    rect(4, 16, 3, 2, colors.hide[1]);
    dot(4, 15, colors.hide[0]);
  }
}

function drawDownStaff(paint, colors, phase) {
  const { rect, dot } = paint;
  const x = 18 + phase.staff;
  const y = 2 + phase.bob;
  dot(x, y, colors.horn[0]);
  rect(x - 1, y + 1, 3, 1, colors.horn[0]);
  dot(x - 1, y + 2, colors.horn[1]);
  rect(x, y + 3, 1, 17 - phase.bob, colors.wood[1]);
  dot(x - 1, y + 4, colors.wood[0]);
  rect(x - 2, 11 + phase.bob, 3, 2, colors.skin[0]);
  rect(x - 1, 13 + phase.bob, 2, 2, colors.skin[1]);
  dot(x - 1, 13 + phase.bob, colors.accent[0]);
}

function drawUpStaff(paint, colors, phase) {
  const { rect, dot } = paint;
  const x = 5 - phase.staff;
  const y = 2 + phase.bob;
  dot(x, y, colors.horn[0]);
  rect(x - 1, y + 1, 3, 1, colors.horn[0]);
  dot(x + 1, y + 2, colors.horn[1]);
  rect(x, y + 3, 1, 17 - phase.bob, colors.wood[1]);
  dot(x + 1, y + 4, colors.wood[0]);
  rect(x, 11 + phase.bob, 3, 2, colors.skin[1]);
  rect(x, 13 + phase.bob, 2, 2, colors.skin[0]);
  dot(x + 1, 13 + phase.bob, colors.accent[1]);
}

function drawSideStaff(paint, colors, phase) {
  const { rect, dot } = paint;
  const x = 20 + phase.staff;
  const y = 2 + phase.bob;
  dot(x, y, colors.horn[0]);
  rect(x - 2, y + 1, 3, 1, colors.horn[0]);
  dot(x, y + 2, colors.horn[1]);
  rect(x, y + 3, 1, 17 - phase.bob, colors.wood[1]);
  dot(x - 1, y + 4, colors.wood[0]);
  rect(x - 5, 11 + phase.bob, 5, 2, colors.skin[0]);
  rect(x - 4, 13 + phase.bob, 4, 2, colors.skin[1]);
  dot(x - 1, 13 + phase.bob, colors.accent[0]);
}

function drawHornCurls(paint, colors, bob) {
  const { rect, dot } = paint;
  if (paint.view === 'right') {
    rect(9, 1 + bob, 2, 1, colors.horn[0]);
    rect(9, 2 + bob, 1, 2, colors.horn[0]);
    dot(10, 3 + bob, colors.horn[1]);
    dot(10, 4 + bob, colors.horn[1]);
    return;
  }
  rect(5, 3 + bob, 1, 2, colors.horn[0]);
  dot(6, 4 + bob, colors.horn[0]);
  dot(6, 5 + bob, colors.horn[1]);
  rect(18, 3 + bob, 1, 2, colors.horn[0]);
  dot(17, 4 + bob, colors.horn[0]);
  dot(17, 5 + bob, colors.horn[1]);
}

export function drawSatyrWalkIdentity(context, direction, frame, { includeStaff = true } = {}) {
  const data = EN_E03_BRIAR_REVELER_CALIBRATION_DATA;
  const colors = {
    skin: data.actor.palette.skin,
    ...data.satyr,
  };
  const phase = EN_E03_SATYR_WALK_PHASES[frame];
  const paint = createPainter(context, direction);
  if (paint.view === 'up') {
    drawUpTail(paint, colors, phase.stride);
    for (const leg of downLegs({ ...phase, stride: -phase.stride }, true)) drawSplitHoofLeg(paint, colors, leg);
    if (includeStaff) drawUpStaff(paint, colors, phase);
    // The shared humanoid Walk leaves one front-expression pixel on the rear
    // profile. Cover it with the surrounding skin ramp so Up reads as a back
    // view rather than an eye glancing sideways.
    paint.dot(9, 9 + phase.bob, colors.skin[0]);
  } else if (paint.view === 'right') {
    drawSideTail(paint, colors, phase.stride);
    for (const leg of sideLegs(phase)) drawSplitHoofLeg(paint, colors, leg);
    if (includeStaff) drawSideStaff(paint, colors, phase);
  } else {
    drawDownTail(paint, colors, phase.stride);
    for (const leg of downLegs(phase, false)) drawSplitHoofLeg(paint, colors, leg);
    if (includeStaff) drawDownStaff(paint, colors, phase);
  }
  drawHornCurls(paint, colors, phase.bob);
}

function renderSatyrWalk(args) {
  assert(args.family.id === 'satyr', 'The EN-E03 Satyr Walk renderer is restricted to Satyr.');
  assert(args.variant.id === 'briar-reveler', 'The EN-E03 Satyr Walk renderer is restricted to Briar Reveler.');
  if (args.animation.id === 'idle') return EN_E03_SATYR_IDLE_RENDERER.render(args);
  assert(args.animation.id === 'walk' && args.frame >= 0 && args.frame < 4, 'The EN-E03 Satyr Walk renderer authorizes only approved Idle and four Walk frames.');
  const rendered = EN_E01_HUMANOID_RENDERER.render(args);
  args.context.clearRect(0, 17, SIZE, SIZE - 17);
  drawSatyrWalkIdentity(args.context, args.direction, args.frame);
  return Object.freeze({
    ...rendered,
    satyrWalkGate: EN_E03_SATYR_WALK_GATE.id,
    approvedIdleGate: EN_E03_SATYR_IDLE_GATE.id,
    precedingApprovalGate: EN_E03_CENTAUR_WALK_GATE.id,
  });
}

export const EN_E03_SATYR_WALK_RENDERER = Object.freeze({
  key: 'en-e03-satyr-walk-v1',
  chassis: EN_E01_HUMANOID_RENDERER.chassis,
  render: renderSatyrWalk,
});

export const EN_E03_SATYR_WALK_FAMILY = deepFreeze({
  id: 'satyr',
  name: 'Satyr',
  sliceId: 'EN-E03',
  rendererKey: EN_E03_SATYR_WALK_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [{
    id: 'briar-reveler',
    name: 'Briar Reveler',
    brief: 'Approved two-frame Idle baseline plus a four-frame Walk candidate with alternating reverse-jointed legs, split-hoof contacts, tail response, and staff counter-swing.',
    rendererData: EN_E03_BRIAR_REVELER_CALIBRATION_DATA,
  }],
  rendererData: {
    contractCard: 'satyr',
    approvedIdleGate: EN_E03_SATYR_IDLE_GATE.id,
    precedingApprovalGate: EN_E03_CENTAUR_WALK_GATE.id,
    activeGate: EN_E03_SATYR_WALK_GATE.id,
  },
  review: {
    baselineVariant: 'briar-reveler',
    scale: 8,
    notes: 'Implementation candidate for one-family Walk review; approved Idle remains exact and the family stays internal and non-public.',
  },
});

export const EN_E03_SATYR_WALK_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E03_SATYR_WALK_RENDERER],
  families: [EN_E03_SATYR_WALK_FAMILY],
});
