import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E06_HAG_CONTRACT_CARD } from './enemy-expansion-en-e06-fairy-idle.js';
import {
  EN_E06_MIRE_CRONE_DATA,
  renderEnE06MireCroneFrame,
} from './enemy-expansion-en-e06-hag-mire-crone.js';
import { EN_E06_CAULDRON_HEXER_GATE } from './enemy-expansion-en-e06-hag-cauldron-hexer.js';

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
  skin: ['#77804f', '#42482d', '#a5ad68'],
  hair: ['#352f34', '#211e25', '#5b4d55'],
  shawl: ['#553340', '#2e222b', '#7a4a55'],
  dress: ['#304637', '#1d2d26', '#4d6650'],
  rope: ['#5b4434', '#342a23', '#85624a'],
  claw: ['#d5c68d', '#87764e', '#f0dda4'],
  briar: ['#30242a', '#17151a', '#63323b'],
  thorn: ['#8e4a4b', '#4d282f', '#bd6b62'],
  eye: '#ef9a4d',
  flash: '#f4f4f4',
});

export const EN_E06_BLACKTHORN_MATRON_CONTRACT = deepFreeze({
  sliceId: 'EN-E06',
  family: 'hag',
  variant: 'blackthorn-matron',
  role: 'elite',
  state: 'implemented-complete-motion-candidate',
  chassis: 'stooped-feral-fey-humanoid-v1',
  silhouette: 'The approved feral-Hag chassis becomes a heavier elder through a body-connected hooked blackthorn crown, broad briar pauldrons, plated shawl mass, and reinforced raking claws while retaining the low head, crooked back, long forearms, and planted claw feet.',
  identity: 'Bark-olive skin, black-plum rope hair, blood-briar armor, ember eyes, bone claws, and an asymmetrical thorn crown establish the elite Matron without detached branches or curse effects.',
  effectBoundary: 'Detached thorns, briar trails, curse motes, hex bursts, thrown charms, cauldron fumes, summoned familiars, claw trails, and impact flashes remain external.',
});

export const EN_E06_BLACKTHORN_MATRON_DATA = deepFreeze({
  actor: {
    species: 'fey', bodyBuild: 'stooped-heavy', skin: 'bark-olive', hairStyle: 'rope', hairColor: 'black-plum',
    expression: 'matriarchal-feral', faceDetail: 'hooked-nose', headgear: 'blackthorn-crown', outfit: 'briar-armor',
    outfitColor: 'blood-briar', outfitTier: 'tier3', weapon: 'reinforced-claws', weaponTier: 'elite',
    shield: 'none', shieldTier: 'tier1', offhand: 'none',
    palette: { skin: COLORS.skin, hair: COLORS.hair, outfit: COLORS.shawl },
  },
  blackthornMatron: COLORS,
  alphaPolicy: 'binary-connected-elite-briar-hag',
  effectBoundary: 'external-detached-thorns-briar-trails-curse-motes-hex-bursts-thrown-charms-cauldron-fumes-summoned-familiars-claw-trails-and-impact-flashes',
  bakedEffects: [],
});

export const EN_E06_BLACKTHORN_MATRON_GATE = deepFreeze({
  id: 'en-e06-hag-blackthorn-matron-full-v1',
  status: 'candidate',
  authorizedOn: '2026-08-09',
  authorizationEvidence: 'After approving the complete Cauldron Hexer boards and GIFs, the designer said: approved lets do next. The approved Cauldron publication record explicitly opens only one complete Blackthorn Matron elite Hag pass.',
  approvedOn: null,
  approvalEvidence: null,
  publishedImplementation: null,
  precedingApproval: {
    gateId: EN_E06_CAULDRON_HEXER_GATE.id,
    artifactSha256: EN_E06_CAULDRON_HEXER_GATE.artifactSha256,
    assembledArtifactSha256: EN_E06_CAULDRON_HEXER_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E06_CAULDRON_HEXER_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E06_CAULDRON_HEXER_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E06_CAULDRON_HEXER_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E06_CAULDRON_HEXER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E06_CAULDRON_HEXER_GATE.publishedImplementation,
    publishedHandoff: '0a096fa',
  },
  artifact: 'enemy-expansion-review/en-e06-hag-blackthorn-matron/en-e06-hag-blackthorn-matron-full-suite-raw.png',
  artifactSha256: '6f2ed670a65ac2215c818afb95d7f7a3f7183af7781506705be459962aa63315',
  assembledArtifact: 'enemy-expansion-review/en-e06-hag-blackthorn-matron/en-e06-hag-blackthorn-matron-full-suite-complete-b-form.png',
  assembledArtifactSha256: '2f93b79eeadca993f6e6b18921942d5a51d8d7cf3ec5a43bab1ac4665011aa37',
  comparisonArtifact: 'enemy-expansion-review/en-e06-hag-blackthorn-matron/en-e06-hag-blackthorn-matron-hag-comparison.png',
  comparisonArtifactSha256: 'cd423efc081d32cc6979a192a3dbedceab7c94431737d3a32dc4cb2abce2eb2c',
  reviewAnimations: {
    raw: { artifact: 'enemy-expansion-review/en-e06-hag-blackthorn-matron/en-e06-hag-blackthorn-matron-full-suite-four-directions-labeled.gif', sha256: '35c42c7916bdec51264544e43fe468551d0c8111d9d4d896c766ce25bf1b1c46', width: 640, height: 672, frames: 4, durationMs: 720 },
    completeBForm: { artifact: 'enemy-expansion-review/en-e06-hag-blackthorn-matron/en-e06-hag-blackthorn-matron-full-suite-four-directions-labeled-complete-b-form.gif', sha256: 'd9ccd666b71575748cc513f0ffae1faeeea0d7e90ded104fced891359189e7dc', width: 640, height: 672, frames: 4, durationMs: 720 },
  },
  candidateFrameDigest: 'd4588d754e01dbb4916949f27b801342a310706890a0532a0133216d7cb0c7a9',
  mireCroneComparisonDigest: 'f35512e73fd7b2308bf408f11c2d21a30631361214a372df7bef2e8fc4e6478d',
  cauldronHexerComparisonDigest: '17f40220730fe4e83be26156d73e0599235be66a9290284b37cb9c8282c7a1a6',
  scope: 'One complete 80-frame Blackthorn Matron elite Hag across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle settles the hooked crown against uneven armored shoulders. Walk is a four-phase heavy planted Matron shuffle. Attack coils the leading arm, raises the thorned shoulder, drives a broad reinforced claw rake, and recovers. Hurt uses a complete white recoil and colored briar brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show approved Mire Crone and Cauldron Hexer beside Blackthorn Matron, plus the labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards and synchronized GIFs together.',
  exclusions: [
    'changes to approved Fairy source or pixels', 'changes to approved Mire Crone source or pixels',
    'changes to approved Cauldron Hexer source or pixels', 'Dryad implementation', 'Redcap implementation', 'Nymph implementation',
    'public Hag registration', 'public catalog exposure', 'asset-pack fixture generation or regeneration',
    'new Cast pixels', 'new Death pixels', 'detached thorns', 'briar trails', 'curse motes', 'hex bursts',
    'thrown charms', 'cauldron fumes', 'summoned familiars', 'claw trails', 'impact flashes',
    'effects', 'release', 'later EN-E06 sprites', 'EN-E07 and later Wave 2 work',
  ],
  nextGate: 'Stop for explicit visual approval of the exact frozen Blackthorn Matron candidate. Do not commit, publish, register Hag, generate fixtures, start Dryad, add effects, release, or broaden Wave 2 before that approval.',
});

export const EN_E06_BLACKTHORN_MATRON_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const PALETTE_MAP = new Map();
for (const group of ['skin', 'hair', 'shawl', 'dress', 'rope', 'claw']) {
  const source = EN_E06_MIRE_CRONE_DATA.mireCrone[group];
  const target = COLORS[group];
  for (let index = 0; index < source.length; index++) PALETTE_MAP.set(source[index], target[index]);
}
PALETTE_MAP.set(EN_E06_MIRE_CRONE_DATA.mireCrone.eye, COLORS.eye);

function captureMire(direction, animation, frame) {
  const pixels = new Array(SIZE * SIZE).fill(null);
  let fillStyle = '#000000';
  const context = {
    get fillStyle() { return fillStyle; }, set fillStyle(value) { fillStyle = value; },
    clearRect(x, y, width, height) { for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) if (px >= 0 && py >= 0 && px < SIZE && py < SIZE) pixels[(py * SIZE) + px] = null; },
    fillRect(x, y, width, height) { for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) { assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Blackthorn Matron source capture left the 24x24 cell.'); pixels[(py * SIZE) + px] = fillStyle; } },
  };
  renderEnE06MireCroneFrame(context, direction, animation, frame);
  return pixels;
}

function normalizedAnimation(animation, frame) {
  if (animation === 'cast') return { animation: 'attack', frame };
  if (animation === 'death') return { animation: 'hurt', frame: EN_E06_BLACKTHORN_MATRON_DEATH_SOURCE_FRAMES[frame] };
  return { animation, frame };
}

function setPixel(pixels, x, y, color) {
  assert(x >= 1 && y >= 1 && x <= 22 && y <= 22, 'Blackthorn Matron additions must preserve a one-cell margin.');
  pixels[(y * SIZE) + x] = color;
}

function boundsOf(pixels) {
  const points = [];
  for (let y = 1; y <= 22; y++) for (let x = 1; x <= 22; x++) if (pixels[(y * SIZE) + x] !== null) points.push([x, y]);
  assert(points.length > 0, 'Blackthorn Matron needs an opaque Hag source.');
  return {
    minX: Math.min(...points.map(([x]) => x)), maxX: Math.max(...points.map(([x]) => x)),
    minY: Math.min(...points.map(([, y]) => y)), maxY: Math.max(...points.map(([, y]) => y)),
  };
}

function nearestOpaque(pixels, centerX, centerY, radius = 7) {
  for (let distance = 0; distance <= radius; distance++) {
    for (let y = centerY - distance; y <= centerY + distance; y++) for (let x = centerX - distance; x <= centerX + distance; x++) {
      if (x >= 1 && y >= 1 && x <= 22 && y <= 22 && pixels[(y * SIZE) + x] !== null) return [x, y];
    }
  }
  throw new TypeError('Blackthorn Matron could not find a connected armor anchor.');
}

function connectPath(pixels, from, offsets, colors) {
  let [x, y] = from;
  for (let index = 0; index < offsets.length; index++) {
    const [dx, dy] = offsets[index];
    const targetX = Math.max(1, Math.min(22, from[0] + dx));
    const targetY = Math.max(1, Math.min(22, from[1] + dy));
    const color = colors[index % colors.length];
    while (x !== targetX) { x += Math.sign(targetX - x); setPixel(pixels, x, y, color); }
    while (y !== targetY) { y += Math.sign(targetY - y); setPixel(pixels, x, y, color); }
    setPixel(pixels, targetX, targetY, color);
  }
}

function edgeAnchor(pixels, side, minY, maxY) {
  const xValues = side === 'left' ? [...Array(22).keys()].map((index) => index + 1) : [...Array(22).keys()].map((index) => 22 - index);
  for (let y = minY; y <= maxY; y++) for (const x of xValues) if (pixels[(y * SIZE) + x] !== null) return [x, y];
  return nearestOpaque(pixels, side === 'left' ? 7 : 17, Math.round((minY + maxY) / 2));
}

function addMatronIdentity(pixels, direction, animation, frame, flash) {
  const color = (group, shade = 0) => flash ? COLORS.flash : COLORS[group][shade];
  const bounds = boundsOf(pixels);
  const centerX = Math.round((bounds.minX + bounds.maxX) / 2);
  const [crownX, crownY] = nearestOpaque(pixels, centerX, bounds.minY, 4);
  const crownLean = animation === 'walk' ? [-1, 0, 1, 0][frame] : animation === 'attack' ? [-1, 0, 1, 1][frame] : animation === 'hurt' ? [-1, 1][frame] : frame % 2;

  // A crown band grows directly from the topmost head mass; all hooked tips remain attached.
  setPixel(pixels, crownX, crownY, color('briar', 0));
  connectPath(pixels, [crownX, crownY], [[0, -1], [-1, -2], [-2, -2], [-2, -3]], [color('briar', 1), color('thorn', 0), color('thorn', 2)]);
  connectPath(pixels, [crownX, crownY], [[1, -1], [2, -2], [3, -2], [3 + crownLean, -3]], [color('briar', 0), color('thorn', 1), color('thorn', 2)]);

  // Broad body-connected pauldrons and overlapping torso plates carry the elite weight.
  const shoulderTop = Math.max(bounds.minY + 3, 8);
  const shoulderBottom = Math.min(shoulderTop + 5, bounds.maxY - 2);
  const left = edgeAnchor(pixels, 'left', shoulderTop, shoulderBottom);
  const right = edgeAnchor(pixels, 'right', shoulderTop, shoulderBottom);
  connectPath(pixels, left, [[-1, 0], [-2, 1], [-2, 2], [-1, 2]], [color('briar', 1), color('briar', 0), color('thorn', 0)]);
  connectPath(pixels, right, [[1, 0], [2, 0], [3, -1], [3, 0], [2, 1]], [color('briar', 1), color('briar', 0), color('thorn', 2)]);

  const torso = nearestOpaque(pixels, centerX, Math.min(bounds.maxY - 4, shoulderBottom + 4));
  setPixel(pixels, torso[0], torso[1], color('briar', 0));
  for (const [dx, dy, shade] of [[-1, 0, 1], [1, 0, 2], [-1, 1, 0], [0, 1, 1], [1, 1, 0], [0, 2, 2]]) {
    const x = torso[0] + dx, y = torso[1] + dy;
    if (x >= 1 && x <= 22 && y >= 1 && y <= 22 && pixels[(y * SIZE) + x] !== null) setPixel(pixels, x, y, color('briar', shade));
  }

  // Reinforce the leading claw edge, with the broadest hook during the rake frame.
  const clawY = Math.min(bounds.maxY - 2, shoulderBottom + (animation === 'attack' && frame === 2 ? 2 : 3));
  const claw = edgeAnchor(pixels, 'right', Math.max(8, clawY - 2), Math.min(21, clawY + 2));
  const reach = animation === 'attack' ? [1, 2, 3, 2][frame] : 1;
  connectPath(pixels, claw, [[1, 0], [reach, 0], [reach, 1]], [color('claw', 1), color('claw', 0), color('claw', 2)]);
}

function buildPixels(direction, animation, frame) {
  const canonicalDirection = direction === 'left' ? 'right' : direction;
  const normalized = normalizedAnimation(animation, frame);
  let pixels = captureMire(canonicalDirection, normalized.animation, normalized.frame).map((color) => PALETTE_MAP.get(color) || color);
  const flash = normalized.animation === 'hurt' && normalized.frame === 0;
  addMatronIdentity(pixels, canonicalDirection, normalized.animation, normalized.frame, flash);
  if (direction === 'left') {
    const mirrored = new Array(SIZE * SIZE).fill(null);
    for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) mirrored[(y * SIZE) + (SIZE - 1 - x)] = pixels[(y * SIZE) + x];
    pixels = mirrored;
  }
  const phase = normalized.animation === 'attack'
    ? ['armored-claw-coil', 'thorned-shoulder-rise', 'heavy-blackthorn-rake', 'matron-recover'][normalized.frame]
    : `${normalized.animation}-briar-${normalized.frame + 1}`;
  return { pixels, phase };
}

function paintPixels(context, pixels) {
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    const color = pixels[(y * SIZE) + x];
    if (color === null) continue;
    context.fillStyle = color;
    context.fillRect(x, y, 1, 1);
  }
}

export function renderEnE06BlackthornMatronFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Blackthorn Matron rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), `Unsupported Blackthorn Matron direction ${direction}.`);
  context.clearRect(0, 0, SIZE, SIZE);
  const { pixels, phase } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({ family: 'hag', variant: 'blackthorn-matron', direction, animation, frame, phase, blackthornMatronGate: EN_E06_BLACKTHORN_MATRON_GATE.id, approvedPrecedingGate: EN_E06_CAULDRON_HEXER_GATE.id, alphaPolicy: EN_E06_BLACKTHORN_MATRON_DATA.alphaPolicy, effectBoundary: EN_E06_BLACKTHORN_MATRON_DATA.effectBoundary });
}

export const EN_E06_BLACKTHORN_MATRON_RENDERER = deepFreeze({
  key: 'en-e06-hag-blackthorn-matron-v1', chassis: EN_E06_BLACKTHORN_MATRON_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'hag', 'The EN-E06 Blackthorn Matron renderer is restricted to Hag.');
    assert(variant.id === 'blackthorn-matron', 'The EN-E06 Blackthorn Matron renderer is restricted to Blackthorn Matron.');
    return renderEnE06BlackthornMatronFrame(context, direction, animation.id, frame);
  },
});

const BLACKTHORN_MATRON_VARIANT = deepFreeze({ id: 'blackthorn-matron', name: 'Blackthorn Matron', role: EN_E06_BLACKTHORN_MATRON_CONTRACT.role, status: EN_E06_BLACKTHORN_MATRON_CONTRACT.state, brief: 'A complete elite Hag with connected hooked blackthorn crown, briar pauldrons, plated shawl mass, reinforced claws, and one full standard motion suite; detached thorns and curse effects remain external.', rendererData: EN_E06_BLACKTHORN_MATRON_DATA });

export const EN_E06_BLACKTHORN_MATRON_FAMILY = deepFreeze({
  id: 'hag', name: 'Hag Blackthorn Matron Review', sliceId: 'EN-E06', state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E06_BLACKTHORN_MATRON_CONTRACT.chassis, rendererKey: EN_E06_BLACKTHORN_MATRON_RENDERER.key,
  variants: [BLACKTHORN_MATRON_VARIANT],
  rendererData: { contractCard: EN_E06_HAG_CONTRACT_CARD.id, approvedPrecedingGate: EN_E06_CAULDRON_HEXER_GATE.id, activeGate: EN_E06_BLACKTHORN_MATRON_GATE.id },
  review: { baselineVariant: 'blackthorn-matron', scale: 8, notes: 'Review the complete Blackthorn Matron beside both approved Hag variants before publication, registration, Dryad, fixtures, effects, release, or later Wave 2 work.' },
});

export const EN_E06_BLACKTHORN_MATRON_REGISTRY = createEnemyExpansionRegistry({ renderers: [EN_E06_BLACKTHORN_MATRON_RENDERER], families: [EN_E06_BLACKTHORN_MATRON_FAMILY] });
