import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E05_VAMPIRE_DATA, renderEnE05VampireFrame } from './enemy-expansion-en-e05-vampire.js';
import { EN_E06_DRYAD_CONTRACT_CARD } from './enemy-expansion-en-e06-fairy-idle.js';
import { EN_E06_BLACKTHORN_MATRON_GATE } from './enemy-expansion-en-e06-hag-blackthorn-matron.js';

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
  bark: ['#8b6743', '#4f392b', '#b78d5b'],
  crown: ['#3f6a48', '#24422f', '#6f9859'],
  trunk: ['#73513a', '#3c2d25', '#9b7149'],
  leaf: ['#4e7f49', '#2b4e32', '#83aa62'],
  sapwood: ['#c2a56c', '#7c6846', '#e0c78a'],
  blossom: ['#d59a70', '#8b5b4f', '#f0c292'],
  branch: ['#66503a', '#382d24', '#9a7450'],
  eye: '#e2bd59',
  cavity: '#2e251f',
  flash: '#f4f4f4',
});

export const EN_E06_GROVE_TENDER_CONTRACT = deepFreeze({
  sliceId: 'EN-E06',
  family: 'dryad',
  variant: 'grove-tender',
  role: 'common',
  state: 'implemented-complete-motion-approved',
  chassis: 'slim-living-wood-fey-humanoid-v1',
  silhouette: 'A slim upright humanoid-fey with a narrow trunk waist, living-wood limbs, connected leaf mantle, branch-like forearms, split root hems, and ordinary humanoid height. The form stays distinct from the broad trunk-bodied public Treant and the stooped feral Hag.',
  identity: 'Warm bark skin, dark heartwood torso, green leaf crown and shoulders, pale sapwood joints, small peach blossoms, amber sap eyes, and a visibly forked connected leading arm establish a young grove caretaker.',
  effectBoundary: 'Vines, spores, root eruptions, leaf trails, detached leaves, pollen, summoned plants, branch trails, projectiles, and impact flashes remain external.',
});

export const EN_E06_GROVE_TENDER_DATA = deepFreeze({
  actor: {
    species: 'fey', bodyBuild: 'slim-upright', skin: 'warm-bark', hairStyle: 'leaf-crown', hairColor: 'grove-green',
    expression: 'watchful', faceDetail: 'sap-eyes', headgear: 'leaf-mantle', outfit: 'living-bark',
    outfitColor: 'heartwood-green', outfitTier: 'tier1', weapon: 'forked-branch-arm', weaponTier: 'natural',
    shield: 'none', shieldTier: 'tier1', offhand: 'none',
    palette: { skin: COLORS.bark, hair: COLORS.crown, outfit: COLORS.trunk },
  },
  groveTender: COLORS,
  alphaPolicy: 'binary-connected-living-wood-fey',
  effectBoundary: 'external-vines-spores-root-eruptions-leaf-trails-detached-leaves-pollen-summoned-plants-branch-trails-projectiles-and-impact-flashes',
  bakedEffects: [],
});

export const EN_E06_GROVE_TENDER_GATE = deepFreeze({
  id: 'en-e06-dryad-grove-tender-full-v1',
  status: 'approved',
  authorizedOn: '2026-08-09',
  authorizationEvidence: 'After approving and publishing the complete Blackthorn Matron lane, the designer said: cool next please. The frozen EN-E06 family order advances from Hag to Dryad and authorizes only this one complete common Grove Tender 80-frame variant pass.',
  approvedOn: '2026-08-09',
  approvalEvidence: 'The exact raw, Complete B + Form, and Treant/Blackthorn Matron/Grove Tender comparison boards plus both synchronized GIFs were presented, and the three exact PNG review boards were opened in Aseprite. The designer replied: approved lets do nexrt. This approves only the frozen 80-frame Grove Tender, its bounded implementation and approval commits, branch publication, and one separately isolated complete Spore Cantor specialist Dryad pass after publication. Registration, fixtures, effects, release, Heartwood Warden, Redcap, and broader Wave 2 work remain separate.',
  publishedImplementation: '3d96fedc6127b09949befd06a5d177890f45dc05',
  precedingApproval: {
    gateId: EN_E06_BLACKTHORN_MATRON_GATE.id,
    artifactSha256: EN_E06_BLACKTHORN_MATRON_GATE.artifactSha256,
    assembledArtifactSha256: EN_E06_BLACKTHORN_MATRON_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E06_BLACKTHORN_MATRON_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E06_BLACKTHORN_MATRON_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E06_BLACKTHORN_MATRON_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E06_BLACKTHORN_MATRON_GATE.candidateFrameDigest,
    publishedImplementation: EN_E06_BLACKTHORN_MATRON_GATE.publishedImplementation,
    publishedHandoff: '8e56ec2',
  },
  artifact: 'enemy-expansion-review/en-e06-dryad-grove-tender/en-e06-dryad-grove-tender-full-suite-raw.png',
  artifactSha256: 'ea4bd10e6346a47e89f0af71c0e853ec044a45ec3319364a4f835e25971ab32e',
  assembledArtifact: 'enemy-expansion-review/en-e06-dryad-grove-tender/en-e06-dryad-grove-tender-full-suite-complete-b-form.png',
  assembledArtifactSha256: '4b38f46649936e41061c95cc74509cec3d2b804d11ca24d3fa070fca0d5d02d0',
  comparisonArtifact: 'enemy-expansion-review/en-e06-dryad-grove-tender/en-e06-dryad-grove-tender-comparison.png',
  comparisonArtifactSha256: '3d4b44be63e87e55aef0b2c1cb36fc8b65e7960a0740029a1b10852bce3cdf40',
  reviewAnimations: {
    raw: { artifact: 'enemy-expansion-review/en-e06-dryad-grove-tender/en-e06-dryad-grove-tender-full-suite-four-directions-labeled.gif', sha256: '917b5df1871998cceb05329aef8b7a32c351beaf2b2da66524e6b5a4e3ba4aa2', width: 640, height: 672, frames: 4, durationMs: 720 },
    completeBForm: { artifact: 'enemy-expansion-review/en-e06-dryad-grove-tender/en-e06-dryad-grove-tender-full-suite-four-directions-labeled-complete-b-form.gif', sha256: 'd573b892daab216446e5c5e4f45f6eeda2c803126ee835fbc871e5759dfeeadb', width: 640, height: 672, frames: 4, durationMs: 720 },
  },
  candidateFrameDigest: '18fedaf06c457c8a280b3c5518b0763be48de3b3cb5bd29113f0fd5d183e3a21',
  treantComparisonDigest: '06cc0cb05748bc1fdccdee81e3b9306f631a2bc293f9eca9ba3d6f767a97f42d',
  blackthornMatronComparisonDigest: 'd4588d754e01dbb4916949f27b801342a310706890a0532a0133216d7cb0c7a9',
  scope: 'One complete 80-frame Grove Tender common Dryad across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle settles the connected leaf mantle and forked branch arm. Walk is a four-phase rooted-looking but mobile stride. Attack draws one branch arm toward the trunk, visibly forks it, drives a connected sweeping lash, and recovers. Hurt uses a complete white recoil and colored sapwood brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show public Treant and approved Blackthorn Matron beside Grove Tender, plus the labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards and synchronized GIFs together.',
  exclusions: [
    'changes to approved Fairy source or pixels', 'changes to approved Hag source or pixels',
    'Spore Cantor implementation', 'Heartwood Warden implementation', 'Redcap implementation', 'Nymph implementation',
    'public Dryad registration', 'public catalog exposure', 'asset-pack fixture generation or regeneration',
    'new Cast pixels', 'new Death pixels', 'vines', 'spores', 'root eruptions', 'leaf trails',
    'detached leaves', 'pollen', 'summoned plants', 'branch trails', 'projectiles', 'impact flashes',
    'effects', 'release', 'later EN-E06 sprites', 'EN-E07 and later Wave 2 work',
  ],
  nextGate: 'The exact Grove Tender implementation is approved and recorded for branch publication. The designer separately authorizes only one complete Spore Cantor specialist Dryad pass after that publication; Heartwood Warden, Dryad registration, fixtures, Redcap, effects, release, and broader Wave 2 work remain closed.',
});

export const EN_E06_GROVE_TENDER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const PALETTE_MAP = new Map();
for (const [sourceGroup, targetGroup] of [['skin', 'bark'], ['hair', 'crown'], ['coat', 'trunk'], ['crimson', 'leaf'], ['shirt', 'sapwood'], ['gold', 'blossom']]) {
  const source = EN_E05_VAMPIRE_DATA.vampire[sourceGroup];
  const target = COLORS[targetGroup];
  for (let index = 0; index < source.length; index++) PALETTE_MAP.set(source[index], target[Math.min(index, target.length - 1)]);
}
PALETTE_MAP.set(EN_E05_VAMPIRE_DATA.vampire.eye, COLORS.eye);
PALETTE_MAP.set(EN_E05_VAMPIRE_DATA.vampire.cavity, COLORS.cavity);

function captureVampire(direction, animation, frame) {
  const pixels = new Array(SIZE * SIZE).fill(null);
  let fillStyle = '#000000';
  const context = {
    get fillStyle() { return fillStyle; }, set fillStyle(value) { fillStyle = value; },
    clearRect(x, y, width, height) { for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) if (px >= 0 && py >= 0 && px < SIZE && py < SIZE) pixels[(py * SIZE) + px] = null; },
    fillRect(x, y, width, height) { for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) { assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Grove Tender source capture left the 24x24 cell.'); pixels[(py * SIZE) + px] = fillStyle; } },
  };
  renderEnE05VampireFrame(context, direction, animation, frame);
  return pixels;
}

function normalizedAnimation(animation, frame) {
  if (animation === 'cast') return { animation: 'attack', frame };
  if (animation === 'death') return { animation: 'hurt', frame: EN_E06_GROVE_TENDER_DEATH_SOURCE_FRAMES[frame] };
  return { animation, frame };
}

function setPixel(pixels, x, y, color) {
  assert(x >= 1 && y >= 1 && x <= 22 && y <= 22, 'Grove Tender additions must preserve a one-cell margin.');
  pixels[(y * SIZE) + x] = color;
}

function boundsOf(pixels) {
  const points = [];
  for (let y = 1; y <= 22; y++) for (let x = 1; x <= 22; x++) if (pixels[(y * SIZE) + x] !== null) points.push([x, y]);
  assert(points.length > 0, 'Grove Tender needs an opaque humanoid source.');
  return { minX: Math.min(...points.map(([x]) => x)), maxX: Math.max(...points.map(([x]) => x)), minY: Math.min(...points.map(([, y]) => y)), maxY: Math.max(...points.map(([, y]) => y)) };
}

function nearestOpaque(pixels, centerX, centerY, radius = 7) {
  for (let distance = 0; distance <= radius; distance++) for (let y = centerY - distance; y <= centerY + distance; y++) for (let x = centerX - distance; x <= centerX + distance; x++) {
    if (x >= 1 && y >= 1 && x <= 22 && y <= 22 && pixels[(y * SIZE) + x] !== null) return [x, y];
  }
  throw new TypeError('Grove Tender could not find a connected living-wood anchor.');
}

function connectPath(pixels, from, offsets, colors) {
  let [x, y] = from;
  for (let index = 0; index < offsets.length; index++) {
    const targetX = Math.max(1, Math.min(22, from[0] + offsets[index][0]));
    const targetY = Math.max(1, Math.min(22, from[1] + offsets[index][1]));
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

function addGroveIdentity(pixels, animation, frame, flash) {
  const color = (group, shade = 0) => flash ? COLORS.flash : COLORS[group][shade];
  const bounds = boundsOf(pixels);
  const centerX = Math.round((bounds.minX + bounds.maxX) / 2);
  const [headX, headY] = nearestOpaque(pixels, centerX, bounds.minY, 4);
  const leafSway = animation === 'walk' ? [-1, 0, 1, 0][frame] : animation === 'attack' ? [-1, 0, 1, 0][frame] : frame % 2;

  // The leaf crown and mantle grow directly from the head and shoulders.
  setPixel(pixels, headX, headY, color('crown', 1));
  connectPath(pixels, [headX, headY], [[-1, -1], [-2, -1], [-2 + leafSway, -2]], [color('crown', 0), color('leaf', 2), color('crown', 2)]);
  connectPath(pixels, [headX, headY], [[1, -1], [2, -1], [2 + leafSway, -2]], [color('crown', 1), color('leaf', 0), color('blossom', 0)]);

  const shoulderTop = Math.max(bounds.minY + 4, 8);
  const shoulderBottom = Math.min(shoulderTop + 4, bounds.maxY - 4);
  const leftShoulder = edgeAnchor(pixels, 'left', shoulderTop, shoulderBottom);
  const rightShoulder = edgeAnchor(pixels, 'right', shoulderTop, shoulderBottom);
  connectPath(pixels, leftShoulder, [[-1, 0], [-2, 1], [-1, 2]], [color('leaf', 1), color('leaf', 0), color('crown', 2)]);
  connectPath(pixels, rightShoulder, [[1, 0], [2, 1], [1, 2]], [color('leaf', 1), color('leaf', 2), color('crown', 0)]);

  // Bark ridges reinforce a narrow living trunk rather than a broad tree body.
  const trunk = nearestOpaque(pixels, centerX, Math.min(bounds.maxY - 5, shoulderBottom + 4));
  for (const [dx, dy, shade] of [[0, 0, 1], [-1, 1, 0], [0, 1, 2], [1, 1, 0], [0, 2, 1], [1, 3, 2]]) {
    const x = trunk[0] + dx, y = trunk[1] + dy;
    if (x >= 1 && x <= 22 && y >= 1 && y <= 22 && pixels[(y * SIZE) + x] !== null) setPixel(pixels, x, y, color('trunk', shade));
  }

  // One leading arm visibly forks before the broad sweep; both tines share a connected stem.
  const arm = edgeAnchor(pixels, 'right', Math.max(8, shoulderTop), Math.min(18, shoulderBottom + 5));
  const reach = animation === 'attack' ? [1, 2, 4, 2][frame] : animation === 'walk' ? [1, 2, 1, 2][frame] : 2;
  const rise = animation === 'attack' ? [1, 2, 0, 1][frame] : leafSway;
  connectPath(pixels, arm, [[1, 0], [reach, -rise], [reach + 1, -rise]], [color('branch', 1), color('branch', 0), color('sapwood', 0)]);
  const forkBase = [Math.max(1, Math.min(22, arm[0] + reach)), Math.max(1, Math.min(22, arm[1] - rise))];
  connectPath(pixels, forkBase, [[1, 1], [2, 1]], [color('branch', 0), color('sapwood', 2)]);

  // Connected root hems keep the humanoid stride grounded without becoming a trunk stump.
  const rootY = Math.min(22, bounds.maxY);
  const leftRoot = edgeAnchor(pixels, 'left', Math.max(bounds.minY, rootY - 2), rootY);
  const rightRoot = edgeAnchor(pixels, 'right', Math.max(bounds.minY, rootY - 2), rootY);
  connectPath(pixels, leftRoot, [[-1, 0]], [color('branch', 1)]);
  connectPath(pixels, rightRoot, [[1, 0]], [color('branch', 0)]);
}

function buildPixels(direction, animation, frame) {
  const canonicalDirection = direction === 'left' ? 'right' : direction;
  const normalized = normalizedAnimation(animation, frame);
  let pixels = captureVampire(canonicalDirection, normalized.animation, normalized.frame).map((color) => PALETTE_MAP.get(color) || color);
  const flash = normalized.animation === 'hurt' && normalized.frame === 0;
  addGroveIdentity(pixels, normalized.animation, normalized.frame, flash);
  if (direction === 'left') {
    const mirrored = new Array(SIZE * SIZE).fill(null);
    for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) mirrored[(y * SIZE) + (SIZE - 1 - x)] = pixels[(y * SIZE) + x];
    pixels = mirrored;
  }
  const phase = normalized.animation === 'attack'
    ? ['branch-arm-draw', 'visible-fork-rise', 'connected-branch-sweep', 'grove-recover'][normalized.frame]
    : `${normalized.animation}-grove-${normalized.frame + 1}`;
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

export function renderEnE06GroveTenderFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Grove Tender rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), `Unsupported Grove Tender direction ${direction}.`);
  context.clearRect(0, 0, SIZE, SIZE);
  const { pixels, phase } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({ family: 'dryad', variant: 'grove-tender', direction, animation, frame, phase, groveTenderGate: EN_E06_GROVE_TENDER_GATE.id, approvedPrecedingGate: EN_E06_BLACKTHORN_MATRON_GATE.id, alphaPolicy: EN_E06_GROVE_TENDER_DATA.alphaPolicy, effectBoundary: EN_E06_GROVE_TENDER_DATA.effectBoundary });
}

export const EN_E06_GROVE_TENDER_RENDERER = deepFreeze({
  key: 'en-e06-dryad-grove-tender-v1', chassis: EN_E06_GROVE_TENDER_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'dryad', 'The EN-E06 Grove Tender renderer is restricted to Dryad.');
    assert(variant.id === 'grove-tender', 'The EN-E06 Grove Tender renderer is restricted to Grove Tender.');
    return renderEnE06GroveTenderFrame(context, direction, animation.id, frame);
  },
});

const GROVE_TENDER_VARIANT = deepFreeze({ id: 'grove-tender', name: 'Grove Tender', role: EN_E06_GROVE_TENDER_CONTRACT.role, status: EN_E06_GROVE_TENDER_CONTRACT.state, brief: 'A complete common Dryad with connected leaf mantle, narrow living-wood torso, forked branch arm, rooted hems, and one full standard motion suite; vines, spores, roots, and leaf trails remain external.', rendererData: EN_E06_GROVE_TENDER_DATA });

export const EN_E06_GROVE_TENDER_FAMILY = deepFreeze({
  id: 'dryad', name: 'Dryad Grove Tender Review', sliceId: 'EN-E06', state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E06_GROVE_TENDER_CONTRACT.chassis, rendererKey: EN_E06_GROVE_TENDER_RENDERER.key,
  variants: [GROVE_TENDER_VARIANT],
  rendererData: { contractCard: EN_E06_DRYAD_CONTRACT_CARD.id, approvedPrecedingGate: EN_E06_BLACKTHORN_MATRON_GATE.id, activeGate: EN_E06_GROVE_TENDER_GATE.id },
  review: { baselineVariant: 'grove-tender', scale: 8, notes: 'Review the complete Grove Tender beside public Treant and approved Blackthorn Matron before publication, registration, Spore Cantor, fixtures, effects, release, or later Wave 2 work.' },
});

export const EN_E06_GROVE_TENDER_REGISTRY = createEnemyExpansionRegistry({ renderers: [EN_E06_GROVE_TENDER_RENDERER], families: [EN_E06_GROVE_TENDER_FAMILY] });
