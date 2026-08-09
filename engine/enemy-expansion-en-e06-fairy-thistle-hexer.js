import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E06_FAIRY_CONTRACT_CARD } from './enemy-expansion-en-e06-fairy-idle.js';
import { EN_E06_FAIRY_GATE } from './enemy-expansion-en-e06-fairy.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

const COLORS = deepFreeze({
  skin: ['#d99aa9', '#925168', '#f0bdc2'],
  hair: ['#3c214f', '#21142f', '#745080'],
  robe: ['#7752a1', '#483266', '#b584c5'],
  wing: ['#b584c5', '#7752a1', '#d9b6e8'],
  thorn: ['#315d48', '#5c9a6e', '#c8d878'],
  bronze: ['#c6a257', '#70502e'],
  eye: '#c8d878',
  flash: '#f4f4f4',
});

export const EN_E06_THISTLE_HEXER_CONTRACT = deepFreeze({
  sliceId: 'EN-E06',
  family: 'fairy',
  variant: 'thistle-hexer',
  role: 'specialist',
  state: 'implemented-complete-motion-approved',
  chassis: 'small-winged-fey-v1',
  silhouette: 'A compact thorn-crowned fey with narrow folded thistle wings, a long violet robe, hovering feet, and an attached thorn focus remains distinct from the broad-winged Bramblewing Scout in every 24x24 frame.',
  identity: 'Deep plum hair, a green-and-lilac thorn crown, folded purple petal wings, violet robe planes, bronze clasps, pale curse eyes, and a connected thorn focus establish the specialist Hexer identity.',
  effectBoundary: 'Curse motes, pollen, glow, projectiles, thorn trails, impact flashes, and summoned briars remain external.',
});

export const EN_E06_THISTLE_HEXER_DATA = deepFreeze({
  actor: {
    species: 'human',
    bodyBuild: 'classic',
    skin: 'light',
    hairStyle: 'short',
    hairColor: 'purple',
    expression: 'focused',
    faceDetail: 'none',
    headgear: 'crown',
    outfit: 'robe',
    outfitColor: 'purple',
    outfitTier: 'tier2',
    weapon: 'none',
    weaponTier: 'tier2',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.skin,
      hair: COLORS.hair,
      outfit: COLORS.robe,
    },
  },
  thistleHexer: COLORS,
  alphaPolicy: 'binary-folded-petal-negative-space',
  effectBoundary: 'external-curse-motes-pollen-glow-projectiles-thorn-trails-impacts-and-summoned-briars',
  bakedEffects: [],
});

export const EN_E06_THISTLE_HEXER_GATE = deepFreeze({
  id: 'en-e06-fairy-thistle-hexer-full-v1',
  status: 'approved',
  authorizedOn: '2026-08-09',
  authorizationEvidence: 'After approving and publishing the complete Bramblewing Scout, the designer confirmed that enemy variations remain queued one complete sprite at a time and then said: lets do next. The frozen EN-E06 Fairy role order advances from common Bramblewing Scout to specialist Thistle Hexer and authorizes only this one complete 80-frame variant pass.',
  approvedOn: '2026-08-09',
  approvalEvidence: 'After the exact labeled all-four-direction raw/no-outline, Complete B + Form, and Bramblewing comparison Thistle Hexer boards plus the paired full-suite GIFs were presented, and the three exact PNGs were opened directly in Aseprite, the designer replied: awesome! approved. This approves only the frozen 80-frame Thistle Hexer candidate and authorizes its bounded commit and branch publication; Petalcrown Duelist, Hag, registration, fixtures, effects, release, and later Wave 2 work remain separate gates.',
  precedingApproval: {
    gateId: EN_E06_FAIRY_GATE.id,
    artifactSha256: EN_E06_FAIRY_GATE.artifactSha256,
    assembledArtifactSha256: EN_E06_FAIRY_GATE.assembledArtifactSha256,
    rawAnimationSha256: EN_E06_FAIRY_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E06_FAIRY_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E06_FAIRY_GATE.candidateFrameDigest,
    publishedImplementation: EN_E06_FAIRY_GATE.publishedImplementation,
    publishedHandoff: 'c1165df',
  },
  artifact: 'enemy-expansion-review/en-e06-fairy-thistle-hexer/en-e06-fairy-thistle-hexer-full-suite-raw.png',
  artifactSha256: 'bcfcc701f7d87edc3291466dcf86670aaef75f44f104ae3acde45f344d688f1e',
  assembledArtifact: 'enemy-expansion-review/en-e06-fairy-thistle-hexer/en-e06-fairy-thistle-hexer-full-suite-complete-b-form.png',
  assembledArtifactSha256: '13901a2b1a4accf64cb3174f8ae4dc812b645effed53cb44916bfa11c3573d1f',
  comparisonArtifact: 'enemy-expansion-review/en-e06-fairy-thistle-hexer/en-e06-fairy-thistle-hexer-bramblewing-comparison.png',
  comparisonArtifactSha256: 'b615fb38c2be151f17e0f252cb923ed2cd9f67fca50b8c047c392ae4bdbe65fa',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e06-fairy-thistle-hexer/en-e06-fairy-thistle-hexer-full-suite-four-directions-labeled.gif',
      sha256: 'b5610fdb8c0aa465cbba9667801c56b62ddeb8ed2b9e37c3cfa20b5cb4504b94', width: 640, height: 672, frames: 4, durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e06-fairy-thistle-hexer/en-e06-fairy-thistle-hexer-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '61dbf81601010068f09e08ba0226f80870f1bf4f4ec5acf2099e6af58f8eebcd', width: 640, height: 672, frames: 4, durationMs: 720,
    },
  },
  candidateFrameDigest: '675b5a8957efdc81c07ae53c4b013ad8229847fc84d9b1c0c8da4ad09e6a4534',
  bramblewingComparisonDigest: EN_E06_FAIRY_GATE.candidateFrameDigest,
  scope: 'One complete 80-frame Thistle Hexer specialist Fairy across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle breathes through a narrow folded-wing hover. Walk is a four-phase petal-wing travel cycle. Attack draws the body and folded wings inward, raises the connected thorn focus, drives a readable attached hex-point release, and recovers. Hurt uses a complete white recoil and colored folded-wing brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the approved Bramblewing Scout versus Thistle Hexer comparison plus the labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards and synchronized GIFs together.',
  exclusions: [
    'changes to approved Bramblewing Scout source or pixels',
    'Petalcrown Duelist implementation',
    'Hag implementation',
    'Dryad implementation',
    'Redcap implementation',
    'Nymph implementation',
    'public Fairy registration',
    'public catalog exposure',
    'asset-pack fixture generation or regeneration',
    'new Cast pixels',
    'new Death pixels',
    'detached curse motes',
    'pollen',
    'glow',
    'projectiles',
    'thorn trails',
    'impact flashes',
    'summoned briars',
    'effects',
    'release',
    'later EN-E06 sprites',
    'EN-E07 and later Wave 2 work',
  ],
  nextGate: 'Bounded commit, push, and publication of this exact approved Thistle Hexer lane are authorized. After clean publication, reconcile the exact implementation commit and stop for a separate continuation; do not register Fairy, generate fixtures, add Petalcrown Duelist, begin Hag, or broaden Wave 2 without explicit authorization.',
});

export const EN_E06_THISTLE_HEXER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const WALK_PHASES = deepFreeze([
  { name: 'folded-petal-forward', idleFrame: 0, offsets: { down: [-1, 0], right: [-1, 0], up: [1, 0] } },
  { name: 'thistle-hover-compress', idleFrame: 1, offsets: { down: [0, -1], right: [0, -1], up: [0, -1] } },
  { name: 'folded-petal-rear', idleFrame: 0, offsets: { down: [1, 0], right: [1, 0], up: [-1, 0] } },
  { name: 'hexer-travel-settle', idleFrame: 1, offsets: { down: [0, 0], right: [0, 0], up: [0, 0] } },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'wing-fold-hex-coil', idleFrame: 1, focusPose: 'coil', offsets: { down: [0, -1], right: [-1, 0], up: [0, 0] } },
  { name: 'thorn-focus-rise', idleFrame: 0, focusPose: 'raise', offsets: { down: [0, 0], right: [0, 0], up: [0, 0] } },
  { name: 'attached-hex-point-release', idleFrame: 0, focusPose: 'release', offsets: { down: [0, 0], right: [0, 0], up: [0, 0] } },
  { name: 'folded-wing-recover', idleFrame: 1, focusPose: 'recover', offsets: { down: [0, -1], right: [0, -1], up: [0, -1] } },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-thistle-recoil', idleFrame: 0, flash: true, offsets: { down: [-1, 0], right: [-1, 0], up: [1, 0] } },
  { name: 'colored-folded-wing-brace', idleFrame: 1, flash: false, offsets: { down: [1, -1], right: [-1, -1], up: [-1, -1] } },
]);

const FOCUS_PATHS = deepFreeze({
  down: {
    coil: [[0, 0], [0, -1], [1, -1], [1, -2], [2, -2]],
    raise: [[0, 0], [1, 0], [1, -1], [2, -1], [2, -2], [3, -2], [3, -3]],
    release: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [4, 1], [5, 1], [5, 2], [6, 2], [6, 3], [7, 3]],
    recover: [[0, 0], [1, 0], [1, 1], [2, 1]],
  },
  right: {
    coil: [[0, 0], [0, -1], [1, -1], [1, -2], [2, -2]],
    raise: [[0, 0], [0, -1], [1, -1], [1, -2], [2, -2], [2, -3], [3, -3], [3, -4]],
    release: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]],
    recover: [[0, 0], [1, 0], [1, 1], [2, 1]],
  },
  up: {
    coil: [[0, 0], [0, 1], [1, 1], [1, 2], [2, 2]],
    raise: [[0, 0], [1, 0], [1, -1], [2, -1], [2, -2], [3, -2], [3, -3]],
    release: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [4, -1], [5, -1], [5, -2], [6, -2], [6, -3], [7, -3]],
    recover: [[0, 0], [1, 0], [1, -1], [2, -1]],
  },
});

function painter(context) {
  const rect = (x, y, width, height, fill) => {
    context.fillStyle = fill;
    context.fillRect(x, y, width, height);
  };
  return {
    rect,
    dot(x, y, fill) { rect(x, y, 1, 1, fill); },
    clear(x, y, width = 1, height = 1) { context.clearRect(x, y, width, height); },
    pairRect(x, y, width, height, fill) {
      rect(x, y, width, height, fill);
      rect(SIZE - x - width, y, width, height, fill);
    },
    pairDot(x, y, fill) {
      rect(x, y, 1, 1, fill);
      rect(SIZE - x - 1, y, 1, 1, fill);
    },
    pairClear(x, y, width = 1, height = 1) {
      context.clearRect(x, y, width, height);
      context.clearRect(SIZE - x - width, y, width, height);
    },
  };
}

function drawFrontFoldedWings(paint, phase, rear) {
  const y = phase;
  const rim = rear ? COLORS.wing[2] : COLORS.wing[1];
  const petal = rear ? COLORS.wing[1] : COLORS.wing[0];
  const light = COLORS.wing[2];
  if (phase === 0) {
    paint.pairRect(6, 6 + y, 3, 1, light);
    paint.pairRect(5, 7 + y, 5, 3, petal);
    paint.pairRect(6, 10 + y, 4, 4, rim);
    paint.pairRect(7, 14 + y, 3, 3, petal);
    paint.pairClear(7, 8 + y);
    paint.pairClear(8, 11 + y);
    paint.pairClear(8, 15 + y);
  } else {
    paint.pairRect(7, 7 + y, 2, 1, light);
    paint.pairRect(6, 8 + y, 4, 3, petal);
    paint.pairRect(6, 11 + y, 4, 4, rim);
    paint.pairRect(7, 15 + y, 3, 2, petal);
    paint.pairClear(7, 9 + y);
    paint.pairClear(8, 12 + y);
    paint.pairClear(8, 15 + y);
  }
}

function drawFrontBody(paint, phase, rear) {
  const y = phase;
  paint.rect(9, 5 + y, 6, 3, COLORS.hair[0]);
  paint.rect(8, 6 + y, 8, 2, COLORS.hair[1]);
  paint.pairDot(8, 8 + y, COLORS.skin[2]);
  if (rear) {
    paint.rect(9, 7 + y, 6, 4, COLORS.hair[0]);
    paint.rect(10, 7 + y, 4, 2, COLORS.hair[2]);
    paint.rect(11, 9 + y, 2, 2, COLORS.hair[1]);
  } else {
    paint.rect(9, 7 + y, 6, 4, COLORS.skin[0]);
    paint.rect(9, 7 + y, 6, 1, COLORS.hair[2]);
    paint.pairDot(10, 8 + y, COLORS.eye);
    paint.rect(11, 10 + y, 2, 1, COLORS.skin[1]);
  }
  paint.rect(8, 5 + y, 8, 1, COLORS.thorn[0]);
  paint.rect(9, 3 + y, 2, 3, COLORS.thorn[1]);
  paint.rect(11, 2 + y, 2, 4, COLORS.wing[2]);
  paint.rect(13, 3 + y, 2, 3, COLORS.thorn[1]);
  paint.pairDot(9, 3 + y, COLORS.thorn[2]);
  paint.dot(12, 2 + y, COLORS.thorn[2]);

  paint.pairRect(8, 12 + y, 2, 4, COLORS.skin[0]);
  paint.pairDot(8, 15 + y, COLORS.skin[2]);
  paint.rect(9, 11 + y, 6, 5, COLORS.robe[1]);
  paint.rect(10, 11 + y, 4, 2, COLORS.robe[2]);
  paint.rect(10, 14 + y, 4, 1, COLORS.bronze[0]);
  paint.pairDot(10, 14 + y, COLORS.bronze[1]);
  paint.rect(8, 15 + y, 8, 2, COLORS.robe[0]);
  paint.rect(9, 17 + y, 6, 2, COLORS.robe[2]);
  paint.rect(10, 18 + y, 2, 2, COLORS.skin[1]);
  paint.rect(12, 18 + y, 2, 2, COLORS.skin[0]);
  paint.dot(10, 19 + y, COLORS.hair[1]);
  paint.dot(13, 19 + y, COLORS.hair[1]);
}

function drawSideFoldedWing(paint, phase) {
  const y = phase;
  if (phase === 0) {
    paint.rect(7, 6 + y, 4, 1, COLORS.wing[2]);
    paint.rect(6, 7 + y, 6, 3, COLORS.wing[0]);
    paint.rect(5, 10 + y, 7, 3, COLORS.wing[1]);
    paint.rect(6, 13 + y, 6, 3, COLORS.wing[0]);
    paint.rect(7, 16 + y, 5, 2, COLORS.wing[1]);
    paint.clear(8, 8 + y);
    paint.clear(7, 11 + y);
    paint.clear(9, 14 + y);
    paint.clear(9, 16 + y);
  } else {
    paint.rect(8, 7 + y, 3, 1, COLORS.wing[2]);
    paint.rect(7, 8 + y, 5, 3, COLORS.wing[0]);
    paint.rect(6, 11 + y, 6, 3, COLORS.wing[1]);
    paint.rect(7, 14 + y, 5, 3, COLORS.wing[0]);
    paint.clear(9, 9 + y);
    paint.clear(8, 12 + y);
    paint.clear(9, 15 + y);
  }
}

function drawRightBody(paint, phase) {
  const y = phase;
  paint.rect(11, 5 + y, 6, 3, COLORS.hair[0]);
  paint.rect(10, 6 + y, 8, 2, COLORS.hair[1]);
  paint.rect(12, 7 + y, 6, 4, COLORS.skin[0]);
  paint.rect(11, 7 + y, 3, 4, COLORS.hair[0]);
  paint.dot(18, 8 + y, COLORS.skin[2]);
  paint.dot(16, 8 + y, COLORS.eye);
  paint.dot(17, 9 + y, COLORS.hair[1]);
  paint.rect(10, 5 + y, 8, 1, COLORS.thorn[0]);
  paint.rect(11, 3 + y, 2, 3, COLORS.thorn[1]);
  paint.rect(14, 2 + y, 2, 4, COLORS.wing[2]);
  paint.rect(17, 3 + y, 2, 3, COLORS.thorn[1]);
  paint.dot(11, 3 + y, COLORS.thorn[2]);
  paint.dot(15, 2 + y, COLORS.thorn[2]);
  paint.dot(18, 3 + y, COLORS.thorn[2]);

  paint.rect(11, 11 + y, 6, 5, COLORS.robe[1]);
  paint.rect(12, 11 + y, 4, 2, COLORS.robe[2]);
  paint.rect(16, 12 + y, 2, 3, COLORS.skin[0]);
  paint.dot(18, 14 + y, COLORS.skin[2]);
  paint.rect(12, 14 + y, 4, 1, COLORS.bronze[0]);
  paint.dot(15, 14 + y, COLORS.bronze[1]);
  paint.rect(10, 15 + y, 8, 2, COLORS.robe[0]);
  paint.rect(11, 17 + y, 6, 2, COLORS.robe[2]);
  paint.rect(12, 18 + y, 2, 2, COLORS.skin[1]);
  paint.rect(15, 18 + y, 2, 2, COLORS.skin[0]);
  paint.dot(12, 19 + y, COLORS.hair[1]);
  paint.dot(16, 19 + y, COLORS.hair[1]);
}

function drawThistleIdleIdentity(context, direction, frame) {
  assert(['down', 'right', 'up'].includes(direction), `Unsupported canonical Thistle Hexer direction ${direction}.`);
  assert(frame === 0 || frame === 1, 'Thistle Hexer Idle identity phase must be F1 or F2.');
  const paint = painter(context);
  if (direction === 'right') {
    drawSideFoldedWing(paint, frame);
    drawRightBody(paint, frame);
  } else {
    drawFrontFoldedWings(paint, frame, direction === 'up');
    drawFrontBody(paint, frame, direction === 'up');
  }
}

function phaseFor(animation, frame) {
  if (animation === 'walk') return WALK_PHASES[frame];
  if (animation === 'attack' || animation === 'cast') return ATTACK_PHASES[frame];
  if (animation === 'hurt') return HURT_PHASES[frame];
  if (animation === 'death') return HURT_PHASES[EN_E06_THISTLE_HEXER_DEATH_SOURCE_FRAMES[frame]];
  throw new TypeError(`Unsupported Thistle Hexer animation ${animation}.`);
}

function captureIdentityPixels(direction, frame) {
  const pixels = new Array(SIZE * SIZE).fill(null);
  let fillStyle = '#000000';
  const context = {
    get fillStyle() { return fillStyle; },
    set fillStyle(value) { fillStyle = value; },
    clearRect(x, y, width, height) {
      for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
        if (px >= 0 && py >= 0 && px < SIZE && py < SIZE) pixels[(py * SIZE) + px] = null;
      }
    },
    fillRect(x, y, width, height) {
      for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
        assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Thistle Hexer identity wrote outside the 24x24 cell.');
        pixels[(py * SIZE) + px] = fillStyle;
      }
    },
  };
  drawThistleIdleIdentity(context, direction, frame);
  return pixels;
}

function shiftedPixels(source, dx, dy) {
  const shifted = new Array(SIZE * SIZE).fill(null);
  for (let index = 0; index < source.length; index++) {
    const color = source[index];
    if (color === null) continue;
    const x = (index % SIZE) + dx;
    const y = Math.floor(index / SIZE) + dy;
    assert(x >= 0 && y >= 0 && x < SIZE && y < SIZE, 'Thistle Hexer motion shifted pixels outside the 24x24 cell.');
    shifted[(y * SIZE) + x] = color;
  }
  return shifted;
}

function focusAnchor(direction, idleFrame, dx, dy) {
  if (direction === 'right') return [18 + dx, 14 + idleFrame + dy];
  return [15 + dx, 14 + idleFrame + dy];
}

function addThornFocus(pixels, direction, phase, dx, dy) {
  const path = FOCUS_PATHS[direction][phase.focusPose];
  const [anchorX, anchorY] = focusAnchor(direction, phase.idleFrame, dx, dy);
  for (let index = 0; index < path.length; index++) {
    const [offsetX, offsetY] = path[index];
    const x = anchorX + offsetX;
    const y = anchorY + offsetY;
    assert(x >= 1 && y >= 1 && x <= 22 && y <= 22, 'The attached Thistle Hexer focus must preserve a one-cell margin.');
    const color = index === 0 ? COLORS.bronze[1]
      : index === 1 ? COLORS.bronze[0]
        : index === path.length - 1 ? COLORS.thorn[2]
          : index % 2 === 0 ? COLORS.thorn[0] : COLORS.thorn[1];
    pixels[(y * SIZE) + x] = color;
  }
}

function buildMotionPixels(direction, animation, frame) {
  const phase = phaseFor(animation, frame);
  assert(phase, `Thistle Hexer animation ${animation} frame ${frame} is out of range.`);
  const [dx, dy] = phase.offsets[direction];
  let pixels = shiftedPixels(captureIdentityPixels(direction, phase.idleFrame), dx, dy);
  if (animation === 'attack' || animation === 'cast') addThornFocus(pixels, direction, phase, dx, dy);
  if (phase.flash) pixels = pixels.map((color) => color === null ? null : COLORS.flash);
  return { phase, pixels };
}

function paintPixels(context, pixels, mirrored) {
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    const color = pixels[(y * SIZE) + x];
    if (color === null) continue;
    context.fillStyle = color;
    context.fillRect(mirrored ? SIZE - 1 - x : x, y, 1, 1);
  }
}

export function renderEnE06ThistleHexerFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Thistle Hexer rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), `Unsupported Thistle Hexer direction ${direction}.`);
  context.clearRect(0, 0, SIZE, SIZE);
  const canonicalDirection = direction === 'left' ? 'right' : direction;
  if (animation === 'idle') {
    assert(frame === 0 || frame === 1, `Thistle Hexer Idle frame ${frame} is out of range.`);
    const pixels = captureIdentityPixels(canonicalDirection, frame);
    paintPixels(context, pixels, direction === 'left');
    return Object.freeze({
      family: 'fairy', variant: 'thistle-hexer', direction, animation, frame,
      phase: frame === 0 ? 'folded-petal-hover-rise' : 'folded-petal-hover-settle',
      thistleHexerGate: EN_E06_THISTLE_HEXER_GATE.id,
      approvedPrecedingGate: EN_E06_FAIRY_GATE.id,
      alphaPolicy: EN_E06_THISTLE_HEXER_DATA.alphaPolicy,
      effectBoundary: EN_E06_THISTLE_HEXER_DATA.effectBoundary,
    });
  }
  const { phase, pixels } = buildMotionPixels(canonicalDirection, animation, frame);
  paintPixels(context, pixels, direction === 'left');
  return Object.freeze({
    family: 'fairy', variant: 'thistle-hexer', direction, animation, frame,
    phase: phase.name,
    thistleHexerGate: EN_E06_THISTLE_HEXER_GATE.id,
    approvedPrecedingGate: EN_E06_FAIRY_GATE.id,
    alphaPolicy: EN_E06_THISTLE_HEXER_DATA.alphaPolicy,
    effectBoundary: EN_E06_THISTLE_HEXER_DATA.effectBoundary,
  });
}

export const EN_E06_THISTLE_HEXER_RENDERER = deepFreeze({
  key: 'en-e06-fairy-thistle-hexer-v1',
  chassis: EN_E06_THISTLE_HEXER_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'fairy', 'The EN-E06 Thistle Hexer renderer is restricted to Fairy.');
    assert(variant.id === 'thistle-hexer', 'The EN-E06 Thistle Hexer renderer is restricted to Thistle Hexer.');
    return renderEnE06ThistleHexerFrame(context, direction, animation.id, frame);
  },
});

const THISTLE_HEXER_VARIANT = deepFreeze({
  id: 'thistle-hexer',
  name: 'Thistle Hexer',
  role: EN_E06_THISTLE_HEXER_CONTRACT.role,
  status: EN_E06_THISTLE_HEXER_CONTRACT.state,
  brief: 'A complete specialist Fairy with thorn crown, folded petal wings, violet robes, attached thorn focus, and one full standard motion suite; all curse effects remain external.',
  rendererData: EN_E06_THISTLE_HEXER_DATA,
});

export const EN_E06_THISTLE_HEXER_FAMILY = deepFreeze({
  id: 'fairy',
  name: 'Fairy Thistle Hexer Review',
  sliceId: 'EN-E06',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E06_THISTLE_HEXER_CONTRACT.chassis,
  rendererKey: EN_E06_THISTLE_HEXER_RENDERER.key,
  variants: [THISTLE_HEXER_VARIANT],
  rendererData: {
    contractCard: EN_E06_FAIRY_CONTRACT_CARD.id,
    approvedPrecedingGate: EN_E06_FAIRY_GATE.id,
    activeGate: EN_E06_THISTLE_HEXER_GATE.id,
  },
  review: {
    baselineVariant: 'thistle-hexer',
    scale: 8,
    notes: 'Review the complete Thistle Hexer suite beside approved Bramblewing Scout before any publication, Petalcrown Duelist, Hag, Fairy registration, fixtures, or later Wave 2 work.',
  },
});

export const EN_E06_THISTLE_HEXER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E06_THISTLE_HEXER_RENDERER],
  families: [EN_E06_THISTLE_HEXER_FAMILY],
});
