import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E06_HAG_CONTRACT_CARD } from './enemy-expansion-en-e06-fairy-idle.js';
import {
  EN_E06_MIRE_CRONE_DATA,
  EN_E06_MIRE_CRONE_GATE,
  renderEnE06MireCroneFrame,
} from './enemy-expansion-en-e06-hag-mire-crone.js';

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
  skin: ['#929456', '#565d35', '#c2c177'],
  hair: ['#485047', '#29312d', '#75806d'],
  shawl: ['#654761', '#382e40', '#896c84'],
  dress: ['#36514e', '#223637', '#55766f'],
  rope: ['#a56e40', '#67462d', '#d09a59'],
  claw: ['#d8c78f', '#8d7c57', '#f0e1ad'],
  brew: ['#63c79e', '#2d7667', '#b8efba'],
  copper: ['#c27a43', '#754327', '#e8ad63'],
  eye: '#e4dc67',
  flash: '#f4f4f4',
});

export const EN_E06_CAULDRON_HEXER_CONTRACT = deepFreeze({
  sliceId: 'EN-E06',
  family: 'hag',
  variant: 'cauldron-hexer',
  role: 'specialist',
  state: 'implemented-complete-motion-candidate',
  chassis: 'stooped-feral-fey-humanoid-v1',
  silhouette: 'The approved Mire Crone feral-Hag chassis gains a connected hooked copper ladle, bottle-heavy belt, and tied brewer apron while retaining the low head, crooked shoulders, long forearms, bowed trunk, and planted claw feet.',
  identity: 'Moss-gold skin, charcoal rope hair, plum shawl, teal brewer apron, luminous bottle glass, and a body-connected copper ladle establish a specialist field brewer without baking in a cauldron.',
  effectBoundary: 'The cauldron, fumes, thrown brews, liquid arcs, hex bursts, bottle projectiles, familiars, curse auras, claw trails, and impact flashes remain external.',
});

export const EN_E06_CAULDRON_HEXER_DATA = deepFreeze({
  actor: {
    species: 'fey', bodyBuild: 'stooped', skin: 'moss-gold', hairStyle: 'rope', hairColor: 'charcoal',
    expression: 'calculating', faceDetail: 'hooked-nose', headgear: 'none', outfit: 'brewer-apron',
    outfitColor: 'plum-teal', outfitTier: 'tier2', weapon: 'hooked-ladle', weaponTier: 'specialist',
    shield: 'none', shieldTier: 'tier1', offhand: 'bottle-belt',
    palette: { skin: COLORS.skin, hair: COLORS.hair, outfit: COLORS.shawl },
  },
  cauldronHexer: COLORS,
  alphaPolicy: 'binary-connected-brewer-hag',
  effectBoundary: 'external-cauldron-fumes-thrown-brews-liquid-arcs-hex-bursts-bottle-projectiles-familiars-curse-auras-claw-trails-and-impact-flashes',
  bakedEffects: [],
});

export const EN_E06_CAULDRON_HEXER_GATE = deepFreeze({
  id: 'en-e06-hag-cauldron-hexer-full-v1',
  status: 'candidate',
  authorizedOn: '2026-08-09',
  authorizationEvidence: 'After approving and publishing the complete Mire Crone lane, the designer said: next. The frozen Hag role order advances from common Mire Crone to specialist Cauldron Hexer and authorizes only this one complete 80-frame variant pass.',
  approvedOn: null,
  approvalEvidence: null,
  publishedImplementation: null,
  precedingApproval: {
    gateId: EN_E06_MIRE_CRONE_GATE.id,
    artifactSha256: EN_E06_MIRE_CRONE_GATE.artifactSha256,
    assembledArtifactSha256: EN_E06_MIRE_CRONE_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E06_MIRE_CRONE_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E06_MIRE_CRONE_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E06_MIRE_CRONE_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E06_MIRE_CRONE_GATE.candidateFrameDigest,
    publishedImplementation: EN_E06_MIRE_CRONE_GATE.publishedImplementation,
    publishedHandoff: 'b4ad5cd',
  },
  artifact: 'enemy-expansion-review/en-e06-hag-cauldron-hexer/en-e06-hag-cauldron-hexer-full-suite-raw.png',
  artifactSha256: '92e6961d04ee9232179e4b080937247ac5eb8eb26fcad80308f5ceaca8a2fe43',
  assembledArtifact: 'enemy-expansion-review/en-e06-hag-cauldron-hexer/en-e06-hag-cauldron-hexer-full-suite-complete-b-form.png',
  assembledArtifactSha256: 'aaa2a749a45b7ab5e2b0e54bd30a4e2b1510c05f28686b8795849be02760adfa',
  comparisonArtifact: 'enemy-expansion-review/en-e06-hag-cauldron-hexer/en-e06-hag-cauldron-hexer-hag-comparison.png',
  comparisonArtifactSha256: 'ab12e7ca5e6ffdf0066357dacf8a9d88182affe3dfcd990f483cd0a5ba0de913',
  reviewAnimations: {
    raw: { artifact: 'enemy-expansion-review/en-e06-hag-cauldron-hexer/en-e06-hag-cauldron-hexer-full-suite-four-directions-labeled.gif', sha256: '2d95a1eb19edf91a694f699bcb377c3f54110dfb24e0d13b55a3718fe2dd2b24', width: 640, height: 672, frames: 4, durationMs: 720 },
    completeBForm: { artifact: 'enemy-expansion-review/en-e06-hag-cauldron-hexer/en-e06-hag-cauldron-hexer-full-suite-four-directions-labeled-complete-b-form.gif', sha256: '4af1ac19b43566de6043f1dc20282d085968d1cae317dc6c7a2942fc38902577', width: 640, height: 672, frames: 4, durationMs: 720 },
  },
  candidateFrameDigest: '17f40220730fe4e83be26156d73e0599235be66a9290284b37cb9c8282c7a1a6',
  mireCroneComparisonDigest: EN_E06_MIRE_CRONE_GATE.candidateFrameDigest,
  scope: 'One complete 80-frame Cauldron Hexer specialist Hag across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle holds the connected ladle beside the bottle belt. Walk is a four-phase grounded brewer shuffle. Attack coils the ladle toward the chest, raises the hooked bowl, drives a broad connected sweep, and recovers. Hurt uses a complete white recoil and colored brewer brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show approved Mire Crone beside Cauldron Hexer, plus the labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards and synchronized GIFs together.',
  exclusions: [
    'changes to approved Bramblewing Scout source or pixels', 'changes to approved Thistle Hexer source or pixels',
    'changes to approved Petalcrown Duelist source or pixels', 'changes to approved Mire Crone source or pixels',
    'Blackthorn Matron implementation', 'Dryad implementation', 'Redcap implementation', 'Nymph implementation',
    'public Hag registration', 'public catalog exposure', 'asset-pack fixture generation or regeneration',
    'new Cast pixels', 'new Death pixels', 'cauldron geometry', 'fumes', 'thrown brews', 'liquid arcs',
    'hex bursts', 'bottle projectiles', 'familiars', 'curse auras', 'claw trails', 'impact flashes',
    'effects', 'release', 'later EN-E06 sprites', 'EN-E07 and later Wave 2 work',
  ],
  nextGate: 'Stop for explicit visual approval of the exact frozen Cauldron Hexer candidate. Do not commit, publish, register Hag, generate fixtures, start Blackthorn Matron, begin Dryad, or broaden Wave 2 before that approval.',
});

export const EN_E06_CAULDRON_HEXER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const PALETTE_MAP = new Map();
for (const group of ['skin', 'hair', 'shawl', 'dress', 'rope', 'claw']) {
  const source = EN_E06_MIRE_CRONE_DATA.mireCrone[group];
  const target = COLORS[group];
  for (let index = 0; index < source.length; index++) PALETTE_MAP.set(source[index], target[index]);
}
PALETTE_MAP.set(EN_E06_MIRE_CRONE_DATA.mireCrone.eye, COLORS.eye);

const DEFAULT_TOOL = deepFreeze({
  down: [[0, 0], [1, -1], [2, -2], [3, -3], [3, -4], [2, -4]],
  right: [[0, 0], [1, -1], [2, -2], [3, -3], [4, -4], [3, -4]],
  up: [[0, 0], [1, -1], [2, -2], [3, -3], [3, -4], [2, -4]],
});

const ATTACK_TOOLS = deepFreeze({
  coil: {
    down: [[0, 0], [-1, -1], [-2, -2], [-1, -3], [0, -3], [0, -2]],
    right: [[0, 0], [-1, -1], [-2, -2], [-1, -3], [0, -3], [0, -2]],
    up: [[0, 0], [-1, -1], [-2, -2], [-1, -3], [0, -3], [0, -2]],
  },
  rise: {
    down: [[0, 0], [1, -1], [1, -2], [2, -3], [2, -4], [2, -5], [1, -5]],
    right: [[0, 0], [1, -1], [1, -2], [2, -3], [2, -4], [2, -5], [1, -5]],
    up: [[0, 0], [1, -1], [1, -2], [2, -3], [2, -4], [2, -5], [1, -5]],
  },
  sweep: {
    down: [[0, 0], [1, 0], [2, 0], [3, -1], [4, -1], [4, 0], [3, 0]],
    right: [[0, 0], [1, 0], [2, 0], [3, 0], [4, -1], [4, 0], [3, 1]],
    up: [[0, 0], [1, 0], [2, 0], [3, -1], [4, -1], [4, 0], [3, 0]],
  },
  recover: {
    down: [[0, 0], [1, -1], [2, -1], [2, -2], [1, -2]],
    right: [[0, 0], [1, -1], [2, -1], [2, -2], [1, -2]],
    up: [[0, 0], [1, -1], [2, -1], [2, -2], [1, -2]],
  },
});

function captureMire(direction, animation, frame) {
  const pixels = new Array(SIZE * SIZE).fill(null);
  let fillStyle = '#000000';
  const context = {
    get fillStyle() { return fillStyle; }, set fillStyle(value) { fillStyle = value; },
    clearRect(x, y, width, height) { for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) if (px >= 0 && py >= 0 && px < SIZE && py < SIZE) pixels[(py * SIZE) + px] = null; },
    fillRect(x, y, width, height) { for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) { assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Cauldron Hexer source capture left the 24x24 cell.'); pixels[(py * SIZE) + px] = fillStyle; } },
  };
  renderEnE06MireCroneFrame(context, direction, animation, frame);
  return pixels;
}

function normalizedAnimation(animation, frame) {
  if (animation === 'cast') return { animation: 'attack', frame };
  if (animation === 'death') return { animation: 'hurt', frame: EN_E06_CAULDRON_HEXER_DEATH_SOURCE_FRAMES[frame] };
  return { animation, frame };
}

function baseOffset(animation, frame) {
  if (animation === 'walk') return [[-1, 0], [0, -1], [1, 0], [0, 0]][frame];
  if (animation === 'attack') return [[-1, 0], [0, -1], [0, 0], [1, 0]][frame];
  if (animation === 'hurt') return [[-1, 0], [1, -1]][frame];
  return [0, 0];
}

function idlePhase(animation, frame) {
  if (animation === 'idle') return frame;
  if (animation === 'walk') return [0, 1, 0, 1][frame];
  if (animation === 'attack') return [1, 0, 0, 1][frame];
  if (animation === 'hurt') return [0, 1][frame];
  return 0;
}

function nearestOpaque(pixels, centerX, centerY) {
  for (let radius = 0; radius <= 4; radius++) {
    for (let y = centerY - radius; y <= centerY + radius; y++) for (let x = centerX - radius; x <= centerX + radius; x++) {
      if (x >= 1 && y >= 1 && x <= 22 && y <= 22 && pixels[(y * SIZE) + x] !== null) return [x, y];
    }
  }
  throw new TypeError('Cauldron Hexer could not find a connected tool anchor.');
}

function setPixel(pixels, x, y, color) {
  assert(x >= 1 && y >= 1 && x <= 22 && y <= 22, 'Cauldron Hexer additions must preserve a one-cell margin.');
  pixels[(y * SIZE) + x] = color;
}

function addSpecialistEdgePixel(pixels, color) {
  for (let y = 10; y <= 18; y++) for (let x = 8; x <= 19; x++) {
    if (pixels[(y * SIZE) + x] !== null && pixels[(y * SIZE) + x + 1] === null) {
      setPixel(pixels, x + 1, y, color);
      return;
    }
  }
  throw new TypeError('Cauldron Hexer could not place its connected specialist edge cue.');
}

function addBrewerIdentity(pixels, direction, animation, frame, flash) {
  const [dx, dy] = baseOffset(animation, frame);
  const hitch = idlePhase(animation, frame);
  const apron = flash ? COLORS.flash : COLORS.dress[2];
  const glass = flash ? COLORS.flash : COLORS.brew[0];
  const glassLight = flash ? COLORS.flash : COLORS.brew[2];
  const copper = flash ? COLORS.flash : COLORS.copper[0];
  const copperDark = flash ? COLORS.flash : COLORS.copper[1];
  const canonical = direction === 'left' ? 'right' : direction;

  addSpecialistEdgePixel(pixels, flash ? COLORS.flash : COLORS.brew[1]);

  // Apron ties and connected belt bottles sit over the approved body mass.
  if (canonical === 'right') {
    setPixel(pixels, 12 + dx, 16 + hitch + dy, apron);
    setPixel(pixels, 13 + dx, 17 + hitch + dy, apron);
    setPixel(pixels, 14 + dx, 15 + hitch + dy, copperDark);
    setPixel(pixels, 15 + dx, 15 + hitch + dy, glass);
    setPixel(pixels, 15 + dx, 16 + hitch + dy, glassLight);
  } else {
    setPixel(pixels, 10 + dx, 16 + hitch + dy, apron);
    setPixel(pixels, 13 + dx, 16 + hitch + dy, apron);
    setPixel(pixels, 14 + dx, 15 + hitch + dy, copperDark);
    setPixel(pixels, 15 + dx, 15 + hitch + dy, glass);
    setPixel(pixels, 15 + dx, 16 + hitch + dy, glassLight);
  }

  const proposed = canonical === 'right' ? [17 + dx, 16 + hitch + dy] : [17 + dx, 16 + hitch + dy];
  const [anchorX, anchorY] = nearestOpaque(pixels, proposed[0], proposed[1]);
  let path = DEFAULT_TOOL[canonical];
  if (animation === 'attack') path = ATTACK_TOOLS[['coil', 'rise', 'sweep', 'recover'][frame]][canonical];
  let previousX = anchorX;
  let previousY = anchorY;
  for (let index = 0; index < path.length; index++) {
    const [pathX, pathY] = path[index];
    const targetX = anchorX + pathX;
    const targetY = anchorY + pathY;
    const color = flash ? COLORS.flash : index === path.length - 1 ? COLORS.copper[2] : index % 2 === 0 ? copperDark : copper;
    while (previousX !== targetX) {
      previousX += Math.sign(targetX - previousX);
      setPixel(pixels, previousX, previousY, color);
    }
    while (previousY !== targetY) {
      previousY += Math.sign(targetY - previousY);
      setPixel(pixels, previousX, previousY, color);
    }
    setPixel(pixels, targetX, targetY, color);
  }
}

function buildPixels(direction, animation, frame) {
  const canonicalDirection = direction === 'left' ? 'right' : direction;
  const normalized = normalizedAnimation(animation, frame);
  let pixels = captureMire(canonicalDirection, normalized.animation, normalized.frame).map((color) => PALETTE_MAP.get(color) || color);
  const flash = normalized.animation === 'hurt' && normalized.frame === 0;
  addBrewerIdentity(pixels, canonicalDirection, normalized.animation, normalized.frame, flash);
  if (direction === 'left') {
    const mirrored = new Array(SIZE * SIZE).fill(null);
    for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) mirrored[(y * SIZE) + (SIZE - 1 - x)] = pixels[(y * SIZE) + x];
    pixels = mirrored;
  }
  return { pixels, phase: normalized.animation === 'attack' ? ['ladle-coil', 'hooked-bowl-rise', 'broad-ladle-sweep', 'brewer-recover'][normalized.frame] : `${normalized.animation}-brewer-${normalized.frame + 1}` };
}

function paintPixels(context, pixels) {
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    const color = pixels[(y * SIZE) + x];
    if (color === null) continue;
    context.fillStyle = color;
    context.fillRect(x, y, 1, 1);
  }
}

export function renderEnE06CauldronHexerFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Cauldron Hexer rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), `Unsupported Cauldron Hexer direction ${direction}.`);
  context.clearRect(0, 0, SIZE, SIZE);
  const { pixels, phase } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({ family: 'hag', variant: 'cauldron-hexer', direction, animation, frame, phase, cauldronHexerGate: EN_E06_CAULDRON_HEXER_GATE.id, approvedPrecedingGate: EN_E06_MIRE_CRONE_GATE.id, alphaPolicy: EN_E06_CAULDRON_HEXER_DATA.alphaPolicy, effectBoundary: EN_E06_CAULDRON_HEXER_DATA.effectBoundary });
}

export const EN_E06_CAULDRON_HEXER_RENDERER = deepFreeze({
  key: 'en-e06-hag-cauldron-hexer-v1', chassis: EN_E06_CAULDRON_HEXER_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'hag', 'The EN-E06 Cauldron Hexer renderer is restricted to Hag.');
    assert(variant.id === 'cauldron-hexer', 'The EN-E06 Cauldron Hexer renderer is restricted to Cauldron Hexer.');
    return renderEnE06CauldronHexerFrame(context, direction, animation.id, frame);
  },
});

const CAULDRON_HEXER_VARIANT = deepFreeze({ id: 'cauldron-hexer', name: 'Cauldron Hexer', role: EN_E06_CAULDRON_HEXER_CONTRACT.role, status: EN_E06_CAULDRON_HEXER_CONTRACT.state, brief: 'A complete specialist Hag with connected hooked ladle, bottle belt, brewer apron, and one full standard motion suite; cauldron, fumes, and thrown brews remain external.', rendererData: EN_E06_CAULDRON_HEXER_DATA });

export const EN_E06_CAULDRON_HEXER_FAMILY = deepFreeze({
  id: 'hag', name: 'Hag Cauldron Hexer Review', sliceId: 'EN-E06', state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E06_CAULDRON_HEXER_CONTRACT.chassis, rendererKey: EN_E06_CAULDRON_HEXER_RENDERER.key,
  variants: [CAULDRON_HEXER_VARIANT],
  rendererData: { contractCard: EN_E06_HAG_CONTRACT_CARD.id, approvedPrecedingGate: EN_E06_MIRE_CRONE_GATE.id, activeGate: EN_E06_CAULDRON_HEXER_GATE.id },
  review: { baselineVariant: 'cauldron-hexer', scale: 8, notes: 'Review the complete Cauldron Hexer beside approved Mire Crone before any publication, Blackthorn Matron, Dryad, registration, fixtures, effects, or later Wave 2 work.' },
});

export const EN_E06_CAULDRON_HEXER_REGISTRY = createEnemyExpansionRegistry({ renderers: [EN_E06_CAULDRON_HEXER_RENDERER], families: [EN_E06_CAULDRON_HEXER_FAMILY] });
