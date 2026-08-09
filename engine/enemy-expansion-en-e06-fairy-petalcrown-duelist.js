import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E06_FAIRY_CONTRACT_CARD } from './enemy-expansion-en-e06-fairy-idle.js';
import { EN_E06_FAIRY_GATE } from './enemy-expansion-en-e06-fairy.js';
import { EN_E06_THISTLE_HEXER_GATE } from './enemy-expansion-en-e06-fairy-thistle-hexer.js';

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
  skin: ['#d8a58c', '#8e574f', '#f1c8ab'],
  hair: ['#22414d', '#132832', '#4f7b7f'],
  armor: ['#d45579', '#8b2f55', '#f08cac'],
  wing: ['#f2a7c5', '#c85e8b', '#f7cde0'],
  leaf: ['#3f7661', '#69a875', '#b6d77b'],
  gold: ['#e1bd61', '#8e6335', '#fff0a5'],
  blade: ['#bddde1', '#6b929e', '#f3ffff'],
  eye: '#fff0a5',
  flash: '#f4f4f4',
});

export const EN_E06_PETALCROWN_DUELIST_CONTRACT = deepFreeze({
  sliceId: 'EN-E06',
  family: 'fairy',
  variant: 'petalcrown-duelist',
  role: 'elite',
  state: 'implemented-complete-motion-approved',
  chassis: 'small-winged-fey-v1',
  silhouette: 'A broad petal-crown and wide paired wing mantle surround a compact armored fey body while an attached petal rapier gives the elite duelist a wider, more martial 24x24 silhouette than Bramblewing Scout or Thistle Hexer.',
  identity: 'Dark teal hair, rose petal armor, pale crown-wings, green leaf joints, gold clasps, and a connected silver-blue petal rapier establish the elite aerial duelist identity.',
  effectBoundary: 'Dash trails, petal motes, wind arcs, blade glints, impact flashes, and detached petals remain external.',
});

export const EN_E06_PETALCROWN_DUELIST_DATA = deepFreeze({
  actor: {
    species: 'human',
    bodyBuild: 'classic',
    skin: 'tan',
    hairStyle: 'short',
    hairColor: 'teal',
    expression: 'focused',
    faceDetail: 'none',
    headgear: 'crown',
    outfit: 'armor',
    outfitColor: 'rose',
    outfitTier: 'tier3',
    weapon: 'rapier',
    weaponTier: 'tier3',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.skin,
      hair: COLORS.hair,
      outfit: COLORS.armor,
    },
  },
  petalcrownDuelist: COLORS,
  alphaPolicy: 'binary-crown-wing-negative-space',
  effectBoundary: 'external-dash-trails-petal-motes-wind-arcs-blade-glints-impact-flashes-and-detached-petals',
  bakedEffects: [],
});

export const EN_E06_PETALCROWN_DUELIST_GATE = deepFreeze({
  id: 'en-e06-fairy-petalcrown-duelist-full-v1',
  status: 'approved',
  authorizedOn: '2026-08-09',
  authorizationEvidence: 'After approving and publishing the complete Thistle Hexer, the designer said: lets do next. The frozen EN-E06 Fairy role order advances from common Bramblewing Scout and specialist Thistle Hexer to elite Petalcrown Duelist and authorizes only this one complete 80-frame variant pass.',
  approvedOn: '2026-08-09',
  approvalEvidence: 'After the exact labeled all-four-direction raw/no-outline, Complete B + Form, and three-Fairy comparison Petalcrown Duelist boards plus the paired full-suite GIFs were presented, and the three exact PNGs were opened directly in Aseprite, the designer replied: approved. This approves only the frozen 80-frame Petalcrown Duelist candidate and authorizes its bounded commit and branch publication; Hag, registration, fixtures, effects, release, and later Wave 2 work remain separate gates.',
  precedingApproval: {
    gateId: EN_E06_THISTLE_HEXER_GATE.id,
    artifactSha256: EN_E06_THISTLE_HEXER_GATE.artifactSha256,
    assembledArtifactSha256: EN_E06_THISTLE_HEXER_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E06_THISTLE_HEXER_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E06_THISTLE_HEXER_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E06_THISTLE_HEXER_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E06_THISTLE_HEXER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E06_THISTLE_HEXER_GATE.publishedImplementation,
    publishedHandoff: '581bff9',
  },
  bramblewingApproval: {
    gateId: EN_E06_FAIRY_GATE.id,
    candidateFrameDigest: EN_E06_FAIRY_GATE.candidateFrameDigest,
    publishedImplementation: EN_E06_FAIRY_GATE.publishedImplementation,
  },
  artifact: 'enemy-expansion-review/en-e06-fairy-petalcrown-duelist/en-e06-fairy-petalcrown-duelist-full-suite-raw.png',
  artifactSha256: '74b6b4935ef9708c13396104d80589f67c9de5b189f44dac5c455ea33c45c7cc',
  assembledArtifact: 'enemy-expansion-review/en-e06-fairy-petalcrown-duelist/en-e06-fairy-petalcrown-duelist-full-suite-complete-b-form.png',
  assembledArtifactSha256: '784cfcd2041c8851491ebf38112b48b03d45d48715199907923950022b6f00ff',
  comparisonArtifact: 'enemy-expansion-review/en-e06-fairy-petalcrown-duelist/en-e06-fairy-petalcrown-duelist-fairy-variants-comparison.png',
  comparisonArtifactSha256: '693a6fcdf88a96be3e6d14b55cd65286eb71aa1015934b5b2fef02272cc40b42',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e06-fairy-petalcrown-duelist/en-e06-fairy-petalcrown-duelist-full-suite-four-directions-labeled.gif',
      sha256: 'e98a5427e67d7abc15467cb630634ce57b63f3f6541aa0abb3bc73c19bd673c6', width: 640, height: 672, frames: 4, durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e06-fairy-petalcrown-duelist/en-e06-fairy-petalcrown-duelist-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: 'f11e102b7846f3d3ee2b47f1c56493493906fd6e0364046d8ae5964ea8c5ba10', width: 640, height: 672, frames: 4, durationMs: 720,
    },
  },
  candidateFrameDigest: '69de53e0b10aa80ef10afa7e3e8b6a9d913af81a365535f52e3f4be71945bd5c',
  thistleComparisonDigest: EN_E06_THISTLE_HEXER_GATE.candidateFrameDigest,
  bramblewingComparisonDigest: EN_E06_FAIRY_GATE.candidateFrameDigest,
  scope: 'One complete 80-frame Petalcrown Duelist elite Fairy across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle holds a wide crown-wing guard. Walk is a four-phase aerial fencing advance. Attack closes the wing mantle, sets a connected rapier guard, drives a readable attached lunge, and recovers. Hurt uses a complete white recoil and colored crossed-wing brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show approved Bramblewing Scout and Thistle Hexer beside Petalcrown Duelist, plus the labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards and synchronized GIFs together.',
  exclusions: [
    'changes to approved Bramblewing Scout source or pixels',
    'changes to approved Thistle Hexer source or pixels',
    'Hag implementation',
    'Dryad implementation',
    'Redcap implementation',
    'Nymph implementation',
    'public Fairy registration',
    'public catalog exposure',
    'asset-pack fixture generation or regeneration',
    'new Cast pixels',
    'new Death pixels',
    'dash trails',
    'petal motes',
    'wind arcs',
    'detached blade glints',
    'impact flashes',
    'detached petals',
    'effects',
    'release',
    'later EN-E06 sprites',
    'EN-E07 and later Wave 2 work',
  ],
  nextGate: 'Bounded commit, push, and publication of this exact approved Petalcrown Duelist lane are authorized. After clean publication, reconcile the exact implementation commit and stop for a separate continuation; do not register Fairy, generate fixtures, begin Hag, or broaden Wave 2 without explicit authorization.',
});

export const EN_E06_PETALCROWN_DUELIST_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const WALK_PHASES = deepFreeze([
  { name: 'petal-guard-advance', idleFrame: 0, offsets: { down: [-1, 0], right: [-1, 0], up: [1, 0] } },
  { name: 'crown-wing-rise', idleFrame: 1, offsets: { down: [0, -1], right: [0, -1], up: [0, -1] } },
  { name: 'aerial-fencer-pass', idleFrame: 0, offsets: { down: [1, 0], right: [1, 0], up: [-1, 0] } },
  { name: 'wide-wing-settle', idleFrame: 1, offsets: { down: [0, 0], right: [0, 0], up: [0, 0] } },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'mantle-close-guard', idleFrame: 1, bladePose: 'guard', offsets: { down: [-1, -1], right: [-1, 0], up: [1, 0] } },
  { name: 'petal-rapier-draw', idleFrame: 0, bladePose: 'draw', offsets: { down: [0, 0], right: [0, 0], up: [0, 0] } },
  { name: 'attached-aerial-lunge', idleFrame: 0, bladePose: 'lunge', offsets: { down: [0, 0], right: [0, 0], up: [0, 0] } },
  { name: 'crown-wing-recover', idleFrame: 1, bladePose: 'recover', offsets: { down: [0, -1], right: [0, -1], up: [0, -1] } },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-petalcrown-recoil', idleFrame: 0, flash: true, offsets: { down: [-1, 0], right: [-1, 0], up: [1, 0] } },
  { name: 'colored-crossed-wing-brace', idleFrame: 1, flash: false, offsets: { down: [1, -1], right: [-1, -1], up: [-1, -1] } },
]);

const BLADE_PATHS = deepFreeze({
  down: {
    guard: [[0, 0], [1, 0], [1, -1], [2, -1], [2, -2], [3, -2]],
    draw: [[0, 0], [0, -1], [1, -1], [1, -2], [2, -2], [2, -3], [3, -3]],
    lunge: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]],
    recover: [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2]],
  },
  right: {
    guard: [[0, 0], [0, -1], [1, -1], [1, -2], [2, -2], [2, -3]],
    draw: [[0, 0], [0, -1], [1, -1], [1, -2], [2, -2], [2, -3], [3, -3], [3, -4]],
    lunge: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]],
    recover: [[0, 0], [1, 0], [1, 1], [2, 1]],
  },
  up: {
    guard: [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]],
    draw: [[0, 0], [0, -1], [1, -1], [1, -2], [2, -2], [2, -3], [3, -3]],
    lunge: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [5, -1], [6, -1]],
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

function drawFrontCrownWings(paint, phase, rear) {
  const y = phase;
  const deep = rear ? COLORS.wing[0] : COLORS.wing[1];
  const petal = rear ? COLORS.wing[1] : COLORS.wing[0];
  const light = COLORS.wing[2];
  if (phase === 0) {
    paint.pairRect(5, 3 + y, 4, 2, light);
    paint.pairRect(4, 5 + y, 5, 3, petal);
    paint.pairRect(3, 8 + y, 6, 3, deep);
    paint.pairRect(4, 11 + y, 5, 3, petal);
    paint.pairRect(6, 14 + y, 3, 3, deep);
    paint.pairClear(6, 6 + y);
    paint.pairClear(5, 9 + y);
    paint.pairClear(6, 12 + y);
    paint.pairClear(7, 15 + y);
  } else {
    paint.pairRect(6, 4 + y, 3, 2, light);
    paint.pairRect(5, 6 + y, 4, 3, petal);
    paint.pairRect(4, 9 + y, 5, 3, deep);
    paint.pairRect(5, 12 + y, 4, 3, petal);
    paint.pairRect(7, 15 + y, 2, 2, deep);
    paint.pairClear(6, 7 + y);
    paint.pairClear(6, 10 + y);
    paint.pairClear(7, 13 + y);
  }
}

function drawFrontDuelistBody(paint, phase, rear) {
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

  paint.rect(8, 5 + y, 8, 1, COLORS.leaf[0]);
  paint.pairRect(8, 3 + y, 2, 3, COLORS.armor[2]);
  paint.pairRect(10, 2 + y, 2, 4, COLORS.wing[2]);
  paint.rect(11, 1 + y, 2, 4, COLORS.gold[0]);
  paint.pairDot(9, 3 + y, COLORS.leaf[2]);
  paint.dot(12, 1 + y, COLORS.gold[2]);

  paint.pairRect(7, 11 + y, 3, 3, COLORS.armor[0]);
  paint.pairDot(7, 12 + y, COLORS.armor[2]);
  paint.pairDot(8, 12 + y, COLORS.leaf[1]);
  paint.pairRect(8, 13 + y, 2, 3, COLORS.skin[0]);
  paint.pairDot(8, 15 + y, COLORS.skin[2]);
  paint.rect(9, 11 + y, 6, 5, COLORS.armor[1]);
  paint.rect(10, 11 + y, 4, 2, COLORS.armor[2]);
  paint.rect(10, 14 + y, 4, 1, COLORS.gold[0]);
  paint.pairDot(10, 14 + y, COLORS.gold[1]);
  paint.rect(8, 15 + y, 8, 2, COLORS.armor[0]);
  paint.pairRect(8, 17 + y, 3, 2, COLORS.armor[2]);
  paint.rect(10, 18 + y, 2, 2, COLORS.skin[1]);
  paint.rect(12, 18 + y, 2, 2, COLORS.skin[0]);
  paint.dot(10, 19 + y, COLORS.hair[1]);
  paint.dot(13, 19 + y, COLORS.hair[1]);
}

function drawSideCrownWing(paint, phase) {
  const y = phase;
  if (phase === 0) {
    paint.rect(6, 3 + y, 5, 2, COLORS.wing[2]);
    paint.rect(4, 5 + y, 8, 3, COLORS.wing[0]);
    paint.rect(3, 8 + y, 9, 3, COLORS.wing[1]);
    paint.rect(4, 11 + y, 8, 3, COLORS.wing[0]);
    paint.rect(6, 14 + y, 6, 3, COLORS.wing[1]);
    paint.clear(7, 6 + y);
    paint.clear(6, 9 + y);
    paint.clear(7, 12 + y);
    paint.clear(8, 15 + y);
  } else {
    paint.rect(7, 4 + y, 4, 2, COLORS.wing[2]);
    paint.rect(5, 6 + y, 7, 3, COLORS.wing[0]);
    paint.rect(4, 9 + y, 8, 3, COLORS.wing[1]);
    paint.rect(5, 12 + y, 7, 3, COLORS.wing[0]);
    paint.rect(7, 15 + y, 5, 2, COLORS.wing[1]);
    paint.clear(8, 7 + y);
    paint.clear(7, 10 + y);
    paint.clear(8, 13 + y);
  }
}

function drawRightDuelistBody(paint, phase) {
  const y = phase;
  paint.rect(11, 5 + y, 6, 3, COLORS.hair[0]);
  paint.rect(10, 6 + y, 8, 2, COLORS.hair[1]);
  paint.rect(12, 7 + y, 6, 4, COLORS.skin[0]);
  paint.rect(11, 7 + y, 3, 4, COLORS.hair[0]);
  paint.dot(18, 8 + y, COLORS.skin[2]);
  paint.dot(16, 8 + y, COLORS.eye);
  paint.dot(17, 9 + y, COLORS.hair[1]);

  paint.rect(10, 5 + y, 8, 1, COLORS.leaf[0]);
  paint.rect(11, 3 + y, 3, 3, COLORS.armor[2]);
  paint.rect(14, 2 + y, 3, 4, COLORS.wing[2]);
  paint.rect(17, 3 + y, 2, 3, COLORS.armor[0]);
  paint.dot(12, 3 + y, COLORS.leaf[2]);
  paint.dot(15, 2 + y, COLORS.gold[2]);
  paint.dot(18, 3 + y, COLORS.gold[0]);

  paint.rect(10, 11 + y, 4, 3, COLORS.armor[0]);
  paint.dot(10, 12 + y, COLORS.armor[2]);
  paint.rect(10, 12 + y, 2, 1, COLORS.leaf[1]);
  paint.dot(13, 13 + y, COLORS.leaf[2]);
  paint.rect(11, 11 + y, 6, 5, COLORS.armor[1]);
  paint.rect(12, 11 + y, 4, 2, COLORS.armor[2]);
  paint.rect(16, 12 + y, 2, 3, COLORS.skin[0]);
  paint.dot(18, 14 + y, COLORS.skin[2]);
  paint.rect(12, 14 + y, 4, 1, COLORS.gold[0]);
  paint.dot(15, 14 + y, COLORS.gold[1]);
  paint.dot(10, 12 + y, COLORS.leaf[1]);
  paint.dot(11, 13 + y, COLORS.leaf[2]);
  paint.dot(17, 13 + y, COLORS.leaf[1]);
  paint.rect(10, 15 + y, 8, 2, COLORS.armor[0]);
  paint.rect(11, 17 + y, 7, 2, COLORS.armor[2]);
  paint.rect(12, 18 + y, 2, 2, COLORS.skin[1]);
  paint.rect(15, 18 + y, 2, 2, COLORS.skin[0]);
  paint.dot(12, 19 + y, COLORS.hair[1]);
  paint.dot(16, 19 + y, COLORS.hair[1]);
}

function drawPetalcrownIdleIdentity(context, direction, frame) {
  assert(['down', 'right', 'up'].includes(direction), `Unsupported canonical Petalcrown Duelist direction ${direction}.`);
  assert(frame === 0 || frame === 1, 'Petalcrown Duelist Idle identity phase must be F1 or F2.');
  const paint = painter(context);
  if (direction === 'right') {
    drawSideCrownWing(paint, frame);
    drawRightDuelistBody(paint, frame);
  } else {
    drawFrontCrownWings(paint, frame, direction === 'up');
    drawFrontDuelistBody(paint, frame, direction === 'up');
  }
}

function phaseFor(animation, frame) {
  if (animation === 'walk') return WALK_PHASES[frame];
  if (animation === 'attack' || animation === 'cast') return ATTACK_PHASES[frame];
  if (animation === 'hurt') return HURT_PHASES[frame];
  if (animation === 'death') return HURT_PHASES[EN_E06_PETALCROWN_DUELIST_DEATH_SOURCE_FRAMES[frame]];
  throw new TypeError(`Unsupported Petalcrown Duelist animation ${animation}.`);
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
        assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Petalcrown Duelist identity wrote outside the 24x24 cell.');
        pixels[(py * SIZE) + px] = fillStyle;
      }
    },
  };
  drawPetalcrownIdleIdentity(context, direction, frame);
  return pixels;
}

function shiftedPixels(source, dx, dy) {
  const shifted = new Array(SIZE * SIZE).fill(null);
  for (let index = 0; index < source.length; index++) {
    const color = source[index];
    if (color === null) continue;
    const x = (index % SIZE) + dx;
    const y = Math.floor(index / SIZE) + dy;
    assert(x >= 0 && y >= 0 && x < SIZE && y < SIZE, 'Petalcrown Duelist motion shifted pixels outside the 24x24 cell.');
    shifted[(y * SIZE) + x] = color;
  }
  return shifted;
}

function bladeAnchor(direction, idleFrame, dx, dy) {
  if (direction === 'right') return [18 + dx, 14 + idleFrame + dy];
  return [16 + dx, 14 + idleFrame + dy];
}

function addPetalRapier(pixels, direction, phase, dx, dy) {
  const path = BLADE_PATHS[direction][phase.bladePose];
  const [anchorX, anchorY] = bladeAnchor(direction, phase.idleFrame, dx, dy);
  for (let index = 0; index < path.length; index++) {
    const [offsetX, offsetY] = path[index];
    const x = anchorX + offsetX;
    const y = anchorY + offsetY;
    assert(x >= 1 && y >= 1 && x <= 22 && y <= 22, 'The attached Petalcrown rapier must preserve a one-cell margin.');
    const color = index === 0 ? COLORS.gold[1]
      : index === 1 ? COLORS.gold[0]
        : index === path.length - 1 ? COLORS.blade[2]
          : index % 2 === 0 ? COLORS.blade[0] : COLORS.blade[1];
    pixels[(y * SIZE) + x] = color;
  }
}

function buildMotionPixels(direction, animation, frame) {
  const phase = phaseFor(animation, frame);
  assert(phase, `Petalcrown Duelist animation ${animation} frame ${frame} is out of range.`);
  const [dx, dy] = phase.offsets[direction];
  let pixels = shiftedPixels(captureIdentityPixels(direction, phase.idleFrame), dx, dy);
  if (animation === 'attack' || animation === 'cast') addPetalRapier(pixels, direction, phase, dx, dy);
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

export function renderEnE06PetalcrownDuelistFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Petalcrown Duelist rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), `Unsupported Petalcrown Duelist direction ${direction}.`);
  context.clearRect(0, 0, SIZE, SIZE);
  const canonicalDirection = direction === 'left' ? 'right' : direction;
  if (animation === 'idle') {
    assert(frame === 0 || frame === 1, `Petalcrown Duelist Idle frame ${frame} is out of range.`);
    const pixels = captureIdentityPixels(canonicalDirection, frame);
    paintPixels(context, pixels, direction === 'left');
    return Object.freeze({
      family: 'fairy', variant: 'petalcrown-duelist', direction, animation, frame,
      phase: frame === 0 ? 'wide-crown-wing-guard' : 'petal-mantle-hover-settle',
      petalcrownDuelistGate: EN_E06_PETALCROWN_DUELIST_GATE.id,
      approvedPrecedingGate: EN_E06_THISTLE_HEXER_GATE.id,
      alphaPolicy: EN_E06_PETALCROWN_DUELIST_DATA.alphaPolicy,
      effectBoundary: EN_E06_PETALCROWN_DUELIST_DATA.effectBoundary,
    });
  }
  const { phase, pixels } = buildMotionPixels(canonicalDirection, animation, frame);
  paintPixels(context, pixels, direction === 'left');
  return Object.freeze({
    family: 'fairy', variant: 'petalcrown-duelist', direction, animation, frame,
    phase: phase.name,
    petalcrownDuelistGate: EN_E06_PETALCROWN_DUELIST_GATE.id,
    approvedPrecedingGate: EN_E06_THISTLE_HEXER_GATE.id,
    alphaPolicy: EN_E06_PETALCROWN_DUELIST_DATA.alphaPolicy,
    effectBoundary: EN_E06_PETALCROWN_DUELIST_DATA.effectBoundary,
  });
}

export const EN_E06_PETALCROWN_DUELIST_RENDERER = deepFreeze({
  key: 'en-e06-fairy-petalcrown-duelist-v1',
  chassis: EN_E06_PETALCROWN_DUELIST_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'fairy', 'The EN-E06 Petalcrown Duelist renderer is restricted to Fairy.');
    assert(variant.id === 'petalcrown-duelist', 'The EN-E06 Petalcrown Duelist renderer is restricted to Petalcrown Duelist.');
    return renderEnE06PetalcrownDuelistFrame(context, direction, animation.id, frame);
  },
});

const PETALCROWN_DUELIST_VARIANT = deepFreeze({
  id: 'petalcrown-duelist',
  name: 'Petalcrown Duelist',
  role: EN_E06_PETALCROWN_DUELIST_CONTRACT.role,
  status: EN_E06_PETALCROWN_DUELIST_CONTRACT.state,
  brief: 'A complete elite Fairy with wide petal crown-wings, rose armor, attached rapier, and one full standard motion suite; dash and impact effects remain external.',
  rendererData: EN_E06_PETALCROWN_DUELIST_DATA,
});

export const EN_E06_PETALCROWN_DUELIST_FAMILY = deepFreeze({
  id: 'fairy',
  name: 'Fairy Petalcrown Duelist Review',
  sliceId: 'EN-E06',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E06_PETALCROWN_DUELIST_CONTRACT.chassis,
  rendererKey: EN_E06_PETALCROWN_DUELIST_RENDERER.key,
  variants: [PETALCROWN_DUELIST_VARIANT],
  rendererData: {
    contractCard: EN_E06_FAIRY_CONTRACT_CARD.id,
    approvedPrecedingGate: EN_E06_THISTLE_HEXER_GATE.id,
    activeGate: EN_E06_PETALCROWN_DUELIST_GATE.id,
  },
  review: {
    baselineVariant: 'petalcrown-duelist',
    scale: 8,
    notes: 'Review the complete Petalcrown Duelist suite beside approved Bramblewing Scout and Thistle Hexer before any publication, Hag, Fairy registration, fixtures, or later Wave 2 work.',
  },
});

export const EN_E06_PETALCROWN_DUELIST_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E06_PETALCROWN_DUELIST_RENDERER],
  families: [EN_E06_PETALCROWN_DUELIST_FAMILY],
});
