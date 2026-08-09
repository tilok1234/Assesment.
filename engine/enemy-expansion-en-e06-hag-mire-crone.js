import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E06_HAG_CONTRACT_CARD } from './enemy-expansion-en-e06-fairy-idle.js';
import { EN_E06_PETALCROWN_DUELIST_GATE } from './enemy-expansion-en-e06-fairy-petalcrown-duelist.js';

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
  skin: ['#7e8d62', '#4e5a3d', '#aebd7c'],
  hair: ['#706958', '#403c34', '#9a8e70'],
  shawl: ['#57493e', '#312b29', '#796352'],
  dress: ['#435441', '#29382f', '#687753'],
  rope: ['#8b7650', '#59492f', '#b69a65'],
  claw: ['#d3c797', '#897c58', '#eee3b3'],
  eye: '#d6d85d',
  flash: '#f4f4f4',
});

export const EN_E06_MIRE_CRONE_CONTRACT = deepFreeze({
  sliceId: 'EN-E06',
  family: 'hag',
  variant: 'mire-crone',
  role: 'common',
  state: 'implemented-complete-motion-approved',
  chassis: 'stooped-feral-fey-humanoid-v1',
  silhouette: 'A low hooked head, rope hair, crooked shoulder shelf, long clawed forearms, bowed shawl torso, and planted splayed feet make a grounded feral-fey silhouette distinct from the equipped humanoid Witch.',
  identity: 'Moss skin, amber eyes, rope-gray hair, a mud-dark shawl, swamp dress, and pale hooked claws establish the bog Hag identity without a staff, hat, robe, familiar, or cauldron.',
  effectBoundary: 'Hex bursts, thrown charms, cauldron fumes, summoned familiars, curse auras, claw trails, and impact flashes remain external.',
});

export const EN_E06_MIRE_CRONE_DATA = deepFreeze({
  actor: {
    species: 'fey',
    bodyBuild: 'stooped',
    skin: 'moss',
    hairStyle: 'rope',
    hairColor: 'bog-gray',
    expression: 'feral',
    faceDetail: 'hooked-nose',
    headgear: 'none',
    outfit: 'mud-shawl',
    outfitColor: 'bog',
    outfitTier: 'tier1',
    weapon: 'claws',
    weaponTier: 'natural',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.skin,
      hair: COLORS.hair,
      outfit: COLORS.shawl,
    },
  },
  mireCrone: COLORS,
  alphaPolicy: 'binary-connected-feral-hag',
  effectBoundary: 'external-hex-bursts-thrown-charms-cauldron-fumes-summoned-familiars-curse-auras-claw-trails-and-impact-flashes',
  bakedEffects: [],
});

export const EN_E06_MIRE_CRONE_GATE = deepFreeze({
  id: 'en-e06-hag-mire-crone-full-v1',
  status: 'approved',
  authorizedOn: '2026-08-09',
  authorizationEvidence: 'After approving the preceding complete Petalcrown Duelist lane, the designer said: lets do nextr. The frozen EN-E06 family order advances from Fairy to Hag and authorizes only one complete common Mire Crone 80-frame variant pass.',
  approvedOn: '2026-08-09',
  approvalEvidence: 'After the exact labeled all-four-direction raw/no-outline, Complete B + Form, and public-Witch comparison Mire Crone boards plus the paired full-suite GIFs were presented, and the three exact PNGs were opened directly in Aseprite, the designer replied: approved. This approves only the frozen 80-frame Mire Crone candidate and authorizes its bounded commit and branch publication; later Hags, Dryad, registration, fixtures, effects, release, and later Wave 2 work remain separate gates.',
  publishedImplementation: '25f67d4014437841f855ace2055de32abfeeaeeb',
  precedingApproval: {
    gateId: EN_E06_PETALCROWN_DUELIST_GATE.id,
    artifactSha256: EN_E06_PETALCROWN_DUELIST_GATE.artifactSha256,
    assembledArtifactSha256: EN_E06_PETALCROWN_DUELIST_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E06_PETALCROWN_DUELIST_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E06_PETALCROWN_DUELIST_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E06_PETALCROWN_DUELIST_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E06_PETALCROWN_DUELIST_GATE.candidateFrameDigest,
    publishedImplementation: EN_E06_PETALCROWN_DUELIST_GATE.publishedImplementation,
    publishedHandoff: '5c9363e',
  },
  artifact: 'enemy-expansion-review/en-e06-hag-mire-crone/en-e06-hag-mire-crone-full-suite-raw.png',
  artifactSha256: 'd0d878509e17455d8c0ea26e2a12bbd8338fcd1b6cdd799d6f8e4052175a742e',
  assembledArtifact: 'enemy-expansion-review/en-e06-hag-mire-crone/en-e06-hag-mire-crone-full-suite-complete-b-form.png',
  assembledArtifactSha256: 'b03473eb7339de3d6e16094f931b5f1f4ace6a7b790a942fc37eed458a440cd3',
  comparisonArtifact: 'enemy-expansion-review/en-e06-hag-mire-crone/en-e06-hag-mire-crone-witch-comparison.png',
  comparisonArtifactSha256: 'a3ded6138931636c5ad44354b833ce5467bce36d5e5a65d943b1b7c6b68e6594',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e06-hag-mire-crone/en-e06-hag-mire-crone-full-suite-four-directions-labeled.gif',
      sha256: '79cdc9bb9b1514c03b057f401b4baeb1732349445b11bed5254c84e5e1201ec2', width: 640, height: 672, frames: 4, durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e06-hag-mire-crone/en-e06-hag-mire-crone-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: 'fda5caed4a6bacfd36f8e76afddcc81e195d390a96c3d5e47c61c4cfa9b195df', width: 640, height: 672, frames: 4, durationMs: 720,
    },
  },
  candidateFrameDigest: 'f35512e73fd7b2308bf408f11c2d21a30631361214a372df7bef2e8fc4e6478d',
  witchComparisonDigest: 'd5f08c3e77b25ecc753c4c9378403a0cb34d335d577d4c3dae13d41ec706dcf2',
  scope: 'One complete 80-frame Mire Crone common Hag across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle uses an uneven shoulder hitch and rope-hair settle. Walk is a grounded four-phase crooked shuffle with planted clawed feet. Attack coils the long leading arm toward the chest, raises the hooked shoulder, drives a broad connected claw rake, and recovers. Hurt uses a complete white recoil and colored crooked brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and a Mire Crone versus public Witch silhouette comparison together.',
  exclusions: [
    'changes to approved Bramblewing Scout source or pixels',
    'changes to approved Thistle Hexer source or pixels',
    'changes to approved Petalcrown Duelist source or pixels',
    'Cauldron Hexer implementation',
    'Blackthorn Matron implementation',
    'Dryad implementation',
    'Redcap implementation',
    'Nymph implementation',
    'public Hag registration',
    'public catalog exposure',
    'asset-pack fixture generation or regeneration',
    'new Cast pixels',
    'new Death pixels',
    'hex bursts',
    'thrown charms',
    'cauldron fumes',
    'summoned familiars',
    'curse auras',
    'claw trails',
    'impact flashes',
    'effects',
    'release',
    'later EN-E06 sprites',
    'EN-E07 and later Wave 2 work',
  ],
  nextGate: 'The exact approved Mire Crone implementation is published at 25f67d4014437841f855ace2055de32abfeeaeeb. Stop for a separate continuation; do not register Hag, generate fixtures, start Cauldron Hexer, begin Dryad, or broaden Wave 2 without explicit authorization.',
});

export const EN_E06_MIRE_CRONE_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const WALK_PHASES = deepFreeze([
  { name: 'left-claw-plant', idleFrame: 0, step: -1, lift: 0, lean: -1 },
  { name: 'crooked-shoulder-pass', idleFrame: 1, step: 0, lift: -1, lean: 0 },
  { name: 'right-claw-plant', idleFrame: 0, step: 1, lift: 0, lean: 1 },
  { name: 'rope-hair-settle', idleFrame: 1, step: 0, lift: 0, lean: 0 },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'leading-arm-coil', pose: 'coil', idleFrame: 1, dx: -1, dy: 0 },
  { name: 'hooked-shoulder-rise', pose: 'rise', idleFrame: 0, dx: 0, dy: -1 },
  { name: 'broad-attached-rake', pose: 'rake', idleFrame: 0, dx: 0, dy: 0 },
  { name: 'crooked-rake-recover', pose: 'recover', idleFrame: 1, dx: 1, dy: 0 },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-crooked-recoil', pose: 'hurt', idleFrame: 0, dx: -1, dy: 0, flash: true },
  { name: 'colored-claw-brace', pose: 'brace', idleFrame: 1, dx: 1, dy: -1, flash: false },
]);

function pixelCanvas() {
  const pixels = new Array(SIZE * SIZE).fill(null);
  let fillStyle = '#000000';
  return {
    pixels,
    context: {
      get fillStyle() { return fillStyle; },
      set fillStyle(value) { fillStyle = value; },
      clearRect(x, y, width, height) {
        for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
          if (px >= 0 && py >= 0 && px < SIZE && py < SIZE) pixels[(py * SIZE) + px] = null;
        }
      },
      fillRect(x, y, width, height) {
        for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
          assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Mire Crone authored pixels must remain inside the 24x24 cell.');
          pixels[(py * SIZE) + px] = fillStyle;
        }
      },
    },
  };
}

function painter(context, dx = 0, dy = 0) {
  const rect = (x, y, width, height, fill) => {
    context.fillStyle = fill;
    context.fillRect(x + dx, y + dy, width, height);
  };
  return {
    rect,
    dot(x, y, fill) { rect(x, y, 1, 1, fill); },
    pairRect(x, y, width, height, fill) {
      rect(x, y, width, height, fill);
      rect(SIZE - x - width, y, width, height, fill);
    },
    pairDot(x, y, fill) {
      rect(x, y, 1, 1, fill);
      rect(SIZE - x - 1, y, 1, 1, fill);
    },
  };
}

function drawFrontBase(paint, rear, idleFrame, step = 0) {
  const hitch = idleFrame;
  // Rope hair and low hooked head.
  paint.rect(8, 3 + hitch, 8, 2, COLORS.hair[1]);
  paint.rect(7, 5 + hitch, 10, 3, COLORS.hair[0]);
  paint.pairRect(6, 6 + hitch, 2, 5, COLORS.hair[1]);
  paint.pairDot(6, 10 + hitch, COLORS.hair[2]);
  if (rear) {
    paint.rect(8, 5 + hitch, 8, 5, COLORS.hair[0]);
    paint.rect(10, 5 + hitch, 4, 3, COLORS.hair[2]);
    paint.rect(11, 8 + hitch, 2, 2, COLORS.hair[1]);
    paint.dot(5, 9 + hitch, COLORS.hair[2]);
  } else {
    paint.rect(8, 5 + hitch, 8, 5, COLORS.skin[0]);
    paint.rect(9, 5 + hitch, 6, 1, COLORS.skin[2]);
    paint.pairDot(9, 7 + hitch, COLORS.eye);
    paint.rect(11, 8 + hitch, 3, 1, COLORS.skin[1]);
    paint.dot(13, 9 + hitch, COLORS.skin[2]);
  }
  // Crooked shoulder shelf, shawl, bowed trunk.
  paint.rect(6, 10 + hitch, 12, 3, COLORS.shawl[1]);
  paint.rect(7, 10 + hitch, 9, 2, COLORS.shawl[2]);
  paint.rect(8, 12 + hitch, 9, 5, COLORS.shawl[0]);
  paint.rect(9, 14 + hitch, 7, 5, COLORS.dress[0]);
  paint.rect(10, 15 + hitch, 5, 4, COLORS.dress[2]);
  paint.rect(8, 18 + hitch, 9, 2, COLORS.dress[1]);
  // Long hanging forearms stay connected to the shoulder shelf.
  paint.rect(5, 11 + hitch, 3, 5, COLORS.skin[1]);
  paint.rect(4, 15 + hitch, 4, 3, COLORS.skin[0]);
  paint.rect(16, 11 + hitch, 3, 5, COLORS.skin[1]);
  paint.rect(16, 15 + hitch, 4, 3, COLORS.skin[0]);
  paint.dot(3, 17 + hitch, COLORS.claw[0]);
  paint.dot(4, 18 + hitch, COLORS.claw[2]);
  paint.dot(20, 17 + hitch, COLORS.claw[0]);
  paint.dot(19, 18 + hitch, COLORS.claw[2]);
  // Planted, splayed claw feet. Step only changes their weight accents.
  paint.rect(8, 19 + hitch, 4, 3, COLORS.dress[1]);
  paint.rect(13, 19 + hitch, 4, 3, COLORS.dress[0]);
  paint.rect(7 + Math.min(step, 0), 21 + hitch, 5, 1, COLORS.skin[1]);
  paint.rect(13 + Math.max(step, 0), 21 + hitch, 5, 1, COLORS.skin[0]);
  paint.dot(6 + Math.min(step, 0), 21 + hitch, COLORS.claw[2]);
  paint.dot(18 + Math.max(step, 0), 21 + hitch, COLORS.claw[2]);
}

function drawRightBase(paint, idleFrame, step = 0) {
  const hitch = idleFrame;
  // Trailing rope hair and low hooked face.
  paint.rect(6, 4 + hitch, 8, 2, COLORS.hair[1]);
  paint.rect(5, 6 + hitch, 11, 3, COLORS.hair[0]);
  paint.rect(4, 8 + hitch, 5, 5, COLORS.hair[1]);
  paint.rect(5, 11 + hitch, 3, 3, COLORS.hair[0]);
  paint.dot(4, 13 + hitch, COLORS.hair[2]);
  paint.rect(11, 6 + hitch, 7, 5, COLORS.skin[0]);
  paint.rect(12, 6 + hitch, 5, 1, COLORS.skin[2]);
  paint.dot(16, 8 + hitch, COLORS.eye);
  paint.rect(17, 9 + hitch, 3, 1, COLORS.skin[1]);
  paint.rect(19, 10 + hitch, 3, 1, COLORS.skin[2]);
  // Humped shawl and bowed trunk.
  paint.rect(6, 10 + hitch, 12, 3, COLORS.shawl[1]);
  paint.rect(7, 9 + hitch, 7, 3, COLORS.shawl[2]);
  paint.rect(8, 12 + hitch, 10, 5, COLORS.shawl[0]);
  paint.rect(9, 15 + hitch, 9, 5, COLORS.dress[0]);
  paint.rect(10, 16 + hitch, 6, 3, COLORS.dress[2]);
  paint.rect(8, 18 + hitch, 10, 2, COLORS.dress[1]);
  // Far and near long arms; the near claw leads the silhouette.
  paint.rect(7, 11 + hitch, 3, 6, COLORS.skin[1]);
  paint.rect(6, 16 + hitch, 4, 2, COLORS.skin[0]);
  paint.dot(5, 17 + hitch, COLORS.claw[0]);
  paint.rect(15, 11 + hitch, 3, 6, COLORS.skin[1]);
  paint.rect(16, 16 + hitch, 4, 2, COLORS.skin[0]);
  paint.dot(20, 17 + hitch, COLORS.claw[2]);
  paint.dot(19, 18 + hitch, COLORS.claw[0]);
  // Uneven but planted feet.
  paint.rect(9, 19 + hitch, 4, 3, COLORS.dress[1]);
  paint.rect(14, 19 + hitch, 4, 3, COLORS.dress[0]);
  paint.rect(8 + Math.min(step, 0), 21 + hitch, 5, 1, COLORS.skin[1]);
  paint.rect(14 + Math.max(step, 0), 21 + hitch, 5, 1, COLORS.skin[0]);
  paint.dot(7 + Math.min(step, 0), 21 + hitch, COLORS.claw[2]);
  paint.dot(19 + Math.max(step, 0), 21 + hitch, COLORS.claw[2]);
}

function drawFrontAttack(paint, rear, phase) {
  drawFrontBase(paint, rear, phase.idleFrame, 0);
  const y = phase.idleFrame;
  if (phase.pose === 'coil') {
    paint.rect(6, 12 + y, 5, 3, COLORS.skin[1]);
    paint.rect(9, 13 + y, 4, 3, COLORS.skin[0]);
    paint.dot(12, 12 + y, COLORS.claw[2]);
  } else if (phase.pose === 'rise') {
    paint.rect(15, 8 + y, 4, 5, COLORS.skin[1]);
    paint.rect(18, 7 + y, 3, 3, COLORS.skin[0]);
    paint.dot(21, 7 + y, COLORS.claw[2]);
    paint.dot(21, 9 + y, COLORS.claw[0]);
  } else if (phase.pose === 'rake') {
    paint.rect(16, 10 + y, 5, 3, COLORS.skin[1]);
    paint.rect(19, 11 + y, 3, 3, COLORS.skin[0]);
    paint.dot(22, 11 + y, COLORS.claw[2]);
    paint.dot(22, 13 + y, COLORS.claw[0]);
  } else {
    paint.rect(14, 12 + y, 5, 3, COLORS.skin[1]);
    paint.rect(17, 14 + y, 4, 2, COLORS.skin[0]);
    paint.dot(21, 15 + y, COLORS.claw[2]);
  }
}

function drawRightAttack(paint, phase) {
  drawRightBase(paint, phase.idleFrame, 0);
  const y = phase.idleFrame;
  if (phase.pose === 'coil') {
    paint.rect(13, 12 + y, 6, 3, COLORS.skin[1]);
    paint.rect(12, 13 + y, 3, 3, COLORS.skin[0]);
    paint.dot(12, 12 + y, COLORS.claw[2]);
  } else if (phase.pose === 'rise') {
    paint.rect(16, 8 + y, 4, 6, COLORS.skin[1]);
    paint.rect(19, 7 + y, 3, 3, COLORS.skin[0]);
    paint.dot(22, 7 + y, COLORS.claw[2]);
    paint.dot(22, 9 + y, COLORS.claw[0]);
  } else if (phase.pose === 'rake') {
    paint.rect(16, 11 + y, 6, 3, COLORS.skin[1]);
    paint.rect(20, 12 + y, 2, 3, COLORS.skin[0]);
    paint.dot(22, 12 + y, COLORS.claw[2]);
    paint.dot(22, 14 + y, COLORS.claw[0]);
  } else {
    paint.rect(15, 12 + y, 5, 3, COLORS.skin[1]);
    paint.rect(18, 14 + y, 3, 2, COLORS.skin[0]);
    paint.dot(21, 15 + y, COLORS.claw[2]);
  }
}

function buildPixels(direction, animation, frame) {
  const canonicalDirection = direction === 'left' ? 'right' : direction;
  let phase;
  if (animation === 'idle') {
    assert(frame === 0 || frame === 1, `Mire Crone Idle frame ${frame} is out of range.`);
    phase = { name: frame === 0 ? 'crooked-bog-crouch' : 'uneven-shoulder-hitch', idleFrame: frame, step: 0, dx: 0, dy: 0 };
  } else if (animation === 'walk') phase = WALK_PHASES[frame];
  else if (animation === 'attack' || animation === 'cast') phase = ATTACK_PHASES[frame];
  else if (animation === 'hurt') phase = HURT_PHASES[frame];
  else if (animation === 'death') phase = HURT_PHASES[EN_E06_MIRE_CRONE_DEATH_SOURCE_FRAMES[frame]];
  assert(phase, `Mire Crone animation ${animation} frame ${frame} is out of range.`);

  const canvas = pixelCanvas();
  const paint = painter(canvas.context, phase.dx || phase.lean || 0, phase.dy || phase.lift || 0);
  if (animation === 'attack' || animation === 'cast') {
    if (canonicalDirection === 'right') drawRightAttack(paint, phase);
    else drawFrontAttack(paint, canonicalDirection === 'up', phase);
  } else {
    const step = phase.step || 0;
    if (canonicalDirection === 'right') drawRightBase(paint, phase.idleFrame, step);
    else drawFrontBase(paint, canonicalDirection === 'up', phase.idleFrame, step);
    if (phase.pose === 'brace') {
      paint.rect(canonicalDirection === 'right' ? 13 : 8, 12 + phase.idleFrame, 7, 3, COLORS.skin[1]);
      paint.dot(canonicalDirection === 'right' ? 12 : 7, 13 + phase.idleFrame, COLORS.claw[2]);
    }
  }
  let pixels = canvas.pixels;
  if (phase.flash) pixels = pixels.map((color) => color === null ? null : COLORS.flash);
  if (direction === 'left') {
    const mirrored = new Array(SIZE * SIZE).fill(null);
    for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) mirrored[(y * SIZE) + (SIZE - 1 - x)] = pixels[(y * SIZE) + x];
    pixels = mirrored;
  }
  return { phase, pixels };
}

function paintPixels(context, pixels) {
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    const color = pixels[(y * SIZE) + x];
    if (color === null) continue;
    context.fillStyle = color;
    context.fillRect(x, y, 1, 1);
  }
}

export function renderEnE06MireCroneFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Mire Crone rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), `Unsupported Mire Crone direction ${direction}.`);
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'hag', variant: 'mire-crone', direction, animation, frame,
    phase: phase.name,
    mireCroneGate: EN_E06_MIRE_CRONE_GATE.id,
    approvedPrecedingGate: EN_E06_PETALCROWN_DUELIST_GATE.id,
    alphaPolicy: EN_E06_MIRE_CRONE_DATA.alphaPolicy,
    effectBoundary: EN_E06_MIRE_CRONE_DATA.effectBoundary,
  });
}

export const EN_E06_MIRE_CRONE_RENDERER = deepFreeze({
  key: 'en-e06-hag-mire-crone-v1',
  chassis: EN_E06_MIRE_CRONE_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'hag', 'The EN-E06 Mire Crone renderer is restricted to Hag.');
    assert(variant.id === 'mire-crone', 'The EN-E06 Mire Crone renderer is restricted to Mire Crone.');
    return renderEnE06MireCroneFrame(context, direction, animation.id, frame);
  },
});

const MIRE_CRONE_VARIANT = deepFreeze({
  id: 'mire-crone',
  name: 'Mire Crone',
  role: EN_E06_MIRE_CRONE_CONTRACT.role,
  status: EN_E06_MIRE_CRONE_CONTRACT.state,
  brief: 'A complete common Hag with rope hair, hooked profile, long claws, mud-dark shawl, grounded crooked shuffle, and connected broad rake; all hex and charm effects remain external.',
  rendererData: EN_E06_MIRE_CRONE_DATA,
});

export const EN_E06_MIRE_CRONE_FAMILY = deepFreeze({
  id: 'hag',
  name: 'Hag Mire Crone Review',
  sliceId: 'EN-E06',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E06_MIRE_CRONE_CONTRACT.chassis,
  rendererKey: EN_E06_MIRE_CRONE_RENDERER.key,
  variants: [MIRE_CRONE_VARIANT],
  rendererData: {
    contractCard: EN_E06_HAG_CONTRACT_CARD.id,
    approvedPrecedingGate: EN_E06_PETALCROWN_DUELIST_GATE.id,
    activeGate: EN_E06_MIRE_CRONE_GATE.id,
  },
  review: {
    baselineVariant: 'mire-crone',
    scale: 8,
    notes: 'The complete grounded Mire Crone suite was approved against the public equipped Witch silhouette. Keep later Hags, Dryad, registration, fixtures, effects, and later Wave 2 work separate.',
  },
});

export const EN_E06_MIRE_CRONE_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E06_MIRE_CRONE_RENDERER],
  families: [EN_E06_MIRE_CRONE_FAMILY],
});
