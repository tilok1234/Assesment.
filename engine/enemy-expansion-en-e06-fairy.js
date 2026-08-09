import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  drawFairyIdleIdentity,
  EN_E06_FAIRY_CONTRACT_CARD,
  EN_E06_FAIRY_IDLE_DATA,
  EN_E06_FAIRY_IDLE_GATE,
} from './enemy-expansion-en-e06-fairy-idle.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E06_FAIRY_CONTRACT = deepFreeze({
  sliceId: 'EN-E06',
  family: 'fairy',
  variant: 'bramblewing-scout',
  role: 'common',
  state: 'implemented-complete-motion-approved',
  chassis: 'small-winged-fey-v1',
  silhouette: 'A compact pointed-ear fey, leaf dress, connected open-lattice wings, hovering legs, and an attached thorn needle remain readable in every 24x24 frame. The hard-alpha actor stays connected and ground-clear with one-cell margins.',
  identity: 'Plum hair, warm rose skin, leaf green planes, pale mint wing veins, tiny gold fasteners, and the held thorn needle preserve the approved Bramblewing Scout identity.',
  effectBoundary: 'Glow, pollen, sparkles, wing trails, needle trails, projectiles, and impact light remain external.',
});

export const EN_E06_FAIRY_GATE = deepFreeze({
  id: 'en-e06-fairy-bramblewing-scout-full-v1',
  status: 'approved',
  authorizedOn: '2026-08-09',
  authorizationEvidence: 'After reviewing the exact Bramblewing Scout four-direction Idle evidence, the designer said: very good,. but lately we been doing all animations for 1 sprite each pass. This approves the Fairy identity and Idle baseline, corrects the active cadence to one complete sprite per pass, and authorizes only the remaining Bramblewing Scout motion suite.',
  approvedOn: '2026-08-09',
  approvalEvidence: 'After the exact labeled all-four-direction raw/no-outline and Complete B + Form Bramblewing Scout full-suite boards and GIFs were presented together and opened directly in Aseprite, the designer replied: approved. This approves only the frozen 80-frame candidate and authorizes its bounded commit and branch publication; another Fairy variant, Hag, registration, fixtures, effects, release, and later Wave 2 work remain separate gates.',
  publishedImplementation: 'cc92ca9bb14f9fa7937a7e1e746d55fb754d9653',
  precedingApproval: {
    gateId: EN_E06_FAIRY_IDLE_GATE.id,
    approvedOn: EN_E06_FAIRY_IDLE_GATE.approvedOn,
    artifactSha256: EN_E06_FAIRY_IDLE_GATE.artifactSha256,
    assembledArtifactSha256: EN_E06_FAIRY_IDLE_GATE.assembledArtifactSha256,
    rawAnimationSha256: EN_E06_FAIRY_IDLE_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E06_FAIRY_IDLE_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E06_FAIRY_IDLE_GATE.candidateFrameDigest,
  },
  artifact: 'enemy-expansion-review/en-e06-fairy/en-e06-fairy-bramblewing-scout-full-suite-raw.png',
  artifactSha256: 'b154d3023c75bb06bb6c7312aa4327aa935723cdd7a0ea1d0165a851d3c20200',
  assembledArtifact: 'enemy-expansion-review/en-e06-fairy/en-e06-fairy-bramblewing-scout-full-suite-complete-b-form.png',
  assembledArtifactSha256: '3349fe0ebd8ce719b172d64dccaf940bf0e842679e4ee13700fa7182cdf5a650',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e06-fairy/en-e06-fairy-bramblewing-scout-full-suite-four-directions-labeled.gif',
      sha256: '9812b570435f45a8efad77fcdf380f6ec159f73ad950967ed5d1889148958efa', width: 640, height: 672, frames: 4, durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e06-fairy/en-e06-fairy-bramblewing-scout-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '662af552ce31a84761001f86b95de3db6149419111b7ff592dca22aa8d57cb57', width: 640, height: 672, frames: 4, durationMs: 720,
    },
  },
  candidateFrameDigest: '0cb24229c55bc9e719dc288ac57ec87c7fba4c4d244bd5e0273e757af09da9a3',
  scope: 'One complete 80-frame Bramblewing Scout common Fairy across Down, Left, Right, and Up: the exact approved Idle F1-F2 baseline, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle remains byte-identical to the approved hover baseline. Walk is a four-phase directional hover travel cycle. Attack closes and drives the wing-body silhouette through recoil, high guard, attached thorn-needle thrust, and recovery. Hurt uses a complete white recoil and colored brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards and synchronized four-phase GIFs together.',
  exclusions: [
    'changes to approved Fairy Idle pixels',
    'Thistle Hexer implementation',
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
    'detached needle or projectiles',
    'glow',
    'pollen',
    'sparkles',
    'wing trails',
    'needle trails',
    'impact light',
    'effects',
    'release',
    'later EN-E06 sprites',
    'EN-E07 and later Wave 2 work',
  ],
  nextGate: 'The exact seventeen-file approved Fairy lane is published at cc92ca9bb14f9fa7937a7e1e746d55fb754d9653. Stop for a separate continuation; do not register Fairy, generate fixtures, add another Fairy variant, begin Hag, or broaden Wave 2 without explicit authorization.',
});

export const EN_E06_FAIRY_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const WALK_PHASES = deepFreeze([
  {
    name: 'forward-wing-sweep', idleFrame: 0,
    offsets: { down: [-1, 0], right: [-1, 0], up: [1, 0] },
  },
  {
    name: 'hover-compress', idleFrame: 1,
    offsets: { down: [0, -1], right: [0, -1], up: [0, -1] },
  },
  {
    name: 'rear-wing-sweep', idleFrame: 0,
    offsets: { down: [1, 0], right: [1, 0], up: [-1, 0] },
  },
  {
    name: 'hover-travel-settle', idleFrame: 1,
    offsets: { down: [0, 0], right: [0, 0], up: [0, 0] },
  },
]);

const ATTACK_PHASES = deepFreeze([
  {
    name: 'wing-close-recoil', idleFrame: 1, needlePose: 'windup',
    offsets: { down: [0, -1], right: [-1, 0], up: [0, 0] },
  },
  {
    name: 'thorn-needle-high-guard', idleFrame: 0, needlePose: 'guard',
    offsets: { down: [0, 0], right: [0, 0], up: [0, 0] },
  },
  {
    name: 'thorn-needle-thrust', idleFrame: 0, needlePose: 'thrust',
    offsets: { down: [0, 0], right: [0, 0], up: [0, 0] },
  },
  {
    name: 'wing-open-recovery', idleFrame: 1, needlePose: 'recover',
    offsets: { down: [0, -1], right: [0, -1], up: [0, -1] },
  },
]);

const HURT_PHASES = deepFreeze([
  {
    name: 'white-hover-recoil', idleFrame: 0, flash: true,
    offsets: { down: [-1, 0], right: [-1, 0], up: [1, 0] },
  },
  {
    name: 'colored-wing-brace', idleFrame: 1, flash: false,
    offsets: { down: [1, -1], right: [-1, -1], up: [-1, -1] },
  },
]);

const NEEDLE_PATHS = deepFreeze({
  down: {
    windup: [[0, 0], [1, 0], [1, -1], [2, -1], [2, -2]],
    guard: [[0, 0], [1, 0], [1, -1], [2, -1], [2, -2], [3, -2], [3, -3]],
    thrust: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [4, 1], [5, 1], [5, 2], [6, 2], [6, 3], [7, 3], [7, 4], [8, 4]],
    recover: [[0, 0], [1, 0], [1, 1], [2, 1]],
  },
  right: {
    windup: [[0, 0], [0, -1], [1, -1], [1, -2], [2, -2]],
    guard: [[0, 0], [0, -1], [1, -1], [1, -2], [2, -2], [2, -3], [3, -3], [3, -4]],
    thrust: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]],
    recover: [[0, 0], [1, 0], [1, 1], [2, 1]],
  },
  up: {
    windup: [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2]],
    guard: [[0, 0], [1, 0], [1, -1], [2, -1], [2, -2], [3, -2], [3, -3]],
    thrust: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [4, -1], [5, -1], [5, -2], [6, -2], [6, -3], [7, -3], [7, -4], [8, -4]],
    recover: [[0, 0], [1, 0], [1, -1], [2, -1]],
  },
});

const FLASH = '#f4f4f4';

function phaseFor(animation, frame) {
  if (animation === 'walk') return WALK_PHASES[frame];
  if (animation === 'attack' || animation === 'cast') return ATTACK_PHASES[frame];
  if (animation === 'hurt') return HURT_PHASES[frame];
  if (animation === 'death') return HURT_PHASES[EN_E06_FAIRY_DEATH_SOURCE_FRAMES[frame]];
  throw new TypeError(`Unsupported Fairy animation ${animation}.`);
}

function captureIdlePixels(direction, frame) {
  const pixels = new Array(SIZE * SIZE).fill(null);
  let fillStyle = '#000000';
  const context = {
    get fillStyle() { return fillStyle; },
    set fillStyle(value) { fillStyle = value; },
    fillRect(x, y, width, height) {
      for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
        assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Approved Fairy Idle capture wrote outside the 24x24 cell.');
        pixels[(py * SIZE) + px] = fillStyle;
      }
    },
  };
  drawFairyIdleIdentity(context, direction, frame);
  return pixels;
}

function shiftedPixels(source, dx, dy) {
  const shifted = new Array(SIZE * SIZE).fill(null);
  for (let index = 0; index < source.length; index++) {
    const color = source[index];
    if (color === null) continue;
    const x = (index % SIZE) + dx;
    const y = Math.floor(index / SIZE) + dy;
    assert(x >= 0 && y >= 0 && x < SIZE && y < SIZE, 'Fairy motion shifted pixels outside the 24x24 cell.');
    shifted[(y * SIZE) + x] = color;
  }
  return shifted;
}

function needleAnchor(direction, idleFrame, dx, dy) {
  if (direction === 'right') return [18 + dx, 14 + idleFrame + dy];
  return [14 + dx, 14 + idleFrame + dy];
}

function addThornNeedle(pixels, direction, phase, dx, dy) {
  const path = NEEDLE_PATHS[direction][phase.needlePose];
  const [anchorX, anchorY] = needleAnchor(direction, phase.idleFrame, dx, dy);
  const { gold, leaf } = EN_E06_FAIRY_IDLE_DATA.fairy;
  for (let index = 0; index < path.length; index++) {
    const [offsetX, offsetY] = path[index];
    const x = anchorX + offsetX;
    const y = anchorY + offsetY;
    assert(x >= 1 && y >= 1 && x <= 22 && y <= 22, 'The attached Fairy thorn needle must preserve a one-cell margin.');
    const color = index === 0 ? gold[1]
      : index === 1 ? gold[2]
        : index === path.length - 1 ? leaf[2]
          : leaf[1];
    pixels[(y * SIZE) + x] = color;
  }
}

function buildMotionPixels(direction, animation, frame) {
  const phase = phaseFor(animation, frame);
  assert(phase, `Fairy animation ${animation} frame ${frame} is out of range.`);
  const [dx, dy] = phase.offsets[direction];
  let pixels = shiftedPixels(captureIdlePixels(direction, phase.idleFrame), dx, dy);
  if (animation === 'attack' || animation === 'cast') addThornNeedle(pixels, direction, phase, dx, dy);
  if (phase.flash) pixels = pixels.map((color) => color === null ? null : FLASH);
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

export function renderEnE06FairyFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Fairy rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), `Unsupported Fairy direction ${direction}.`);
  context.clearRect(0, 0, SIZE, SIZE);
  if (animation === 'idle') {
    assert(frame === 0 || frame === 1, `Fairy Idle frame ${frame} is out of range.`);
    drawFairyIdleIdentity(context, direction, frame);
    return Object.freeze({
      family: 'fairy', variant: 'bramblewing-scout', direction, animation, frame,
      phase: frame === 0 ? 'approved-hover-rise' : 'approved-hover-settle',
      fairyGate: EN_E06_FAIRY_GATE.id,
      approvedIdleGate: EN_E06_FAIRY_IDLE_GATE.id,
      idlePixelsPreserved: true,
      alphaPolicy: EN_E06_FAIRY_IDLE_DATA.alphaPolicy,
      effectBoundary: EN_E06_FAIRY_IDLE_DATA.effectBoundary,
    });
  }
  const canonicalDirection = direction === 'left' ? 'right' : direction;
  const { phase, pixels } = buildMotionPixels(canonicalDirection, animation, frame);
  paintPixels(context, pixels, direction === 'left');
  return Object.freeze({
    family: 'fairy', variant: 'bramblewing-scout', direction, animation, frame,
    phase: phase.name,
    fairyGate: EN_E06_FAIRY_GATE.id,
    approvedIdleGate: EN_E06_FAIRY_IDLE_GATE.id,
    idlePixelsPreserved: true,
    alphaPolicy: EN_E06_FAIRY_IDLE_DATA.alphaPolicy,
    effectBoundary: EN_E06_FAIRY_IDLE_DATA.effectBoundary,
  });
}

export const EN_E06_FAIRY_RENDERER = deepFreeze({
  key: 'en-e06-fairy-bramblewing-scout-v1',
  chassis: EN_E06_FAIRY_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'fairy', 'The EN-E06 Fairy renderer is restricted to Fairy.');
    assert(variant.id === 'bramblewing-scout', 'The EN-E06 Fairy renderer is restricted to Bramblewing Scout.');
    return renderEnE06FairyFrame(context, direction, animation.id, frame);
  },
});

const BRAMBLEWING_SCOUT_VARIANT = deepFreeze({
  id: 'bramblewing-scout',
  name: 'Bramblewing Scout',
  role: EN_E06_FAIRY_CONTRACT.role,
  status: EN_E06_FAIRY_CONTRACT.state,
  brief: 'A complete common Fairy: approved compact hover identity, four-phase wing travel, attached thorn-needle attack, exact Cast aliases, and standard Hurt/Death aliases.',
  rendererData: EN_E06_FAIRY_IDLE_DATA,
});

export const EN_E06_FAIRY_FAMILY = deepFreeze({
  id: 'fairy',
  name: 'Fairy Review',
  sliceId: 'EN-E06',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E06_FAIRY_CONTRACT.chassis,
  rendererKey: EN_E06_FAIRY_RENDERER.key,
  variants: [BRAMBLEWING_SCOUT_VARIANT],
  rendererData: {
    contractCard: EN_E06_FAIRY_CONTRACT_CARD.id,
    approvedIdleGate: EN_E06_FAIRY_IDLE_GATE.id,
    activeGate: EN_E06_FAIRY_GATE.id,
  },
  review: {
    baselineVariant: 'bramblewing-scout',
    scale: 8,
    notes: 'The exact complete Bramblewing Scout suite is approved. Publish only this bounded lane; Fairy registration, fixtures, additional variants, Hag, and later Wave 2 work remain separate gates.',
  },
});

export const EN_E06_FAIRY_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E06_FAIRY_RENDERER],
  families: [EN_E06_FAIRY_FAMILY],
});
