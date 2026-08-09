import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E06_DRYAD_CONTRACT_CARD } from './enemy-expansion-en-e06-fairy-idle.js';
import {
  EN_E06_GROVE_TENDER_DATA,
  renderEnE06GroveTenderFrame,
} from './enemy-expansion-en-e06-dryad-grove-tender.js';
import { EN_E06_SPORE_CANTOR_GATE } from './enemy-expansion-en-e06-dryad-spore-cantor.js';

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
  bark: ['#76503b', '#3b2c29', '#a87550'],
  cambium: ['#c9a66a', '#80623d', '#e2c27f'],
  heartwood: ['#6b3030', '#3b2428', '#92514a'],
  leaf: ['#315a43', '#1f3d32', '#588267'],
  plate: ['#59463b', '#2e2a2a', '#846752'],
  knot: ['#d09a51', '#7d552c', '#efc778'],
  branch: ['#8a684d', '#4d3b35', '#b58b60'],
  eye: '#f0c15f',
  cavity: '#241f22',
  flash: '#f4f4f4',
});

export const EN_E06_HEARTWOOD_WARDEN_CONTRACT = deepFreeze({
  sliceId: 'EN-E06',
  family: 'dryad',
  variant: 'heartwood-warden',
  role: 'elite',
  state: 'implemented-complete-motion-approved',
  chassis: 'branch-pauldron-heartwood-fey-guardian-v1',
  silhouette: 'A dense ordinary-height living-wood fey with connected branch pauldrons, a ringed heartwood breastplate, short crown prongs, reinforced root greaves, and one visibly forking warding arm. The frame remains upright and fey-scaled rather than broad or trunk-shaped like a Treant.',
  identity: 'Deep red heartwood, warm cambium seams, evergreen crown leaves, amber growth rings, dark ironwood plates, and broad body-connected branch armor establish the elite guardian without introducing a separate shield or environmental state.',
  effectBoundary: 'Protective auras, sap glow, bark shards, detached leaves, acorns, vines, root eruptions, shield blooms, summoned plants, trails, projectiles, impacts, and ground cracks remain external.',
});

export const EN_E06_HEARTWOOD_WARDEN_DATA = deepFreeze({
  actor: {
    species: 'fey', bodyBuild: 'dense-upright', skin: 'deep-bark', hairStyle: 'branch-crown', hairColor: 'evergreen',
    expression: 'unyielding-guard', faceDetail: 'amber-sap-eyes', headgear: 'connected-crown-prongs', outfit: 'heartwood-plate',
    outfitColor: 'ironwood-crimson', outfitTier: 'tier3', weapon: 'forking-warding-branch-arm', weaponTier: 'natural-elite',
    shield: 'body-connected-pauldron-guard', shieldTier: 'natural', offhand: 'reinforced-branch-guard',
    palette: { skin: COLORS.bark, hair: COLORS.leaf, outfit: COLORS.heartwood },
  },
  heartwoodWarden: COLORS,
  alphaPolicy: 'binary-connected-armored-living-wood-fey',
  effectBoundary: 'external-protective-auras-sap-glow-bark-shards-detached-leaves-acorns-vines-root-eruptions-shield-blooms-summoned-plants-trails-projectiles-impacts-and-ground-cracks',
  bakedEffects: [],
});

export const EN_E06_HEARTWOOD_WARDEN_GATE = deepFreeze({
  id: 'en-e06-dryad-heartwood-warden-full-v1',
  status: 'approved',
  authorizedOn: '2026-08-09',
  authorizationEvidence: 'After the approved-enemy assembler integration and Complete B actor export were committed and pushed at 90ac018923fbaa9906cd47cdc9ef22f0db77336a, the designer said: hey lets keep going with the 80 enemies plan. Following the documented EN-E06 Dryad role order, this authorizes only one complete private elite Heartwood Warden 80-frame pass.',
  approvedOn: '2026-08-09',
  approvalEvidence: 'The exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite animations plus the Treant/Grove Tender/Spore Cantor/Heartwood Warden comparison were presented, and the three exact PNG review boards were opened together in Aseprite. The designer replied: approved. This approves only the frozen 80-frame Heartwood Warden, bounded implementation 8a790e3f0d02cf64763733f83d17890c79ce83fc, its approval record, and branch publication. Redcap, Nymph, EN-E07, public-registration changes, fixtures, effects, and release remain separate.',
  publishedImplementation: '8a790e3f0d02cf64763733f83d17890c79ce83fc',
  baseCheckpoint: '90ac018923fbaa9906cd47cdc9ef22f0db77336a',
  precedingApproval: {
    gateId: EN_E06_SPORE_CANTOR_GATE.id,
    artifactSha256: EN_E06_SPORE_CANTOR_GATE.artifactSha256,
    assembledArtifactSha256: EN_E06_SPORE_CANTOR_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E06_SPORE_CANTOR_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E06_SPORE_CANTOR_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E06_SPORE_CANTOR_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E06_SPORE_CANTOR_GATE.candidateFrameDigest,
    publishedImplementation: EN_E06_SPORE_CANTOR_GATE.publishedImplementation,
    publishedApprovalRecord: '61d1fa4d9083ccd3c20951ff2a360a653d408b6c',
  },
  artifact: 'enemy-expansion-review/en-e06-dryad-heartwood-warden/en-e06-dryad-heartwood-warden-full-suite-raw.png',
  artifactSha256: 'da3f003a61494a3414fe6c87e5f926c9257cb6c8b52e466cb5e82d9306467447',
  assembledArtifact: 'enemy-expansion-review/en-e06-dryad-heartwood-warden/en-e06-dryad-heartwood-warden-full-suite-complete-b-form.png',
  assembledArtifactSha256: '488014aaaedc10c7c43ba8db12e3f2d302d482d477ba2c2272dbeddfbdaca1da',
  comparisonArtifact: 'enemy-expansion-review/en-e06-dryad-heartwood-warden/en-e06-dryad-heartwood-warden-comparison.png',
  comparisonArtifactSha256: '75bbdd038bf0af049fa533ab8ae2e1fd372ff2b177d60c6f6bc7789f5550a603',
  reviewAnimations: {
    raw: { artifact: 'enemy-expansion-review/en-e06-dryad-heartwood-warden/en-e06-dryad-heartwood-warden-full-suite-four-directions-labeled.gif', sha256: '3d10b4482f09eec6ca4f190068773c0ee5a8b92e8cd49c7e3ca180b8bd1cad0f', width: 640, height: 672, frames: 4, durationMs: 720 },
    completeBForm: { artifact: 'enemy-expansion-review/en-e06-dryad-heartwood-warden/en-e06-dryad-heartwood-warden-full-suite-four-directions-labeled-complete-b-form.gif', sha256: '99ab8665236d9d8b43f692f5ca49322f04de0313109852fbf500d8871f01a995', width: 640, height: 672, frames: 4, durationMs: 720 },
  },
  candidateFrameDigest: 'fb7b50a0fefda66995c5e81f3e07c0c080893902a33d304066e79fb8181cd97c',
  treantComparisonDigest: EN_E06_SPORE_CANTOR_GATE.treantComparisonDigest,
  groveTenderComparisonDigest: EN_E06_SPORE_CANTOR_GATE.groveTenderComparisonDigest,
  sporeCantorComparisonDigest: EN_E06_SPORE_CANTOR_GATE.candidateFrameDigest,
  scope: 'One complete 80-frame Heartwood Warden elite Dryad across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle settles the connected branch pauldrons and crown prongs around the heartplate. Walk carries a four-phase heavy but humanoid-scale rooted stride. Attack braces the heartplate, draws the warding branch arm inward, extends a visible connected fork, and recovers. Hurt uses a complete white recoil and colored ironwood brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show public Treant, approved Grove Tender, and approved Spore Cantor beside Heartwood Warden, plus the labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards and synchronized GIFs together.',
  exclusions: [
    'changes to approved Fairy source or pixels', 'changes to approved Hag source or pixels',
    'changes to approved Grove Tender source or pixels', 'changes to approved Spore Cantor source or pixels',
    'Redcap implementation', 'Nymph implementation', 'public Dryad registration changes', 'public catalog exposure changes',
    'asset-pack fixture generation or regeneration', 'new Cast pixels', 'new Death pixels',
    'protective auras', 'sap glow', 'bark shards', 'detached leaves', 'acorns', 'vines', 'root eruptions',
    'shield blooms', 'summoned plants', 'trails', 'projectiles', 'impacts', 'ground cracks',
    'effects', 'release', 'later EN-E06 sprites', 'EN-E07 and later Wave 2 work',
  ],
  nextGate: 'The exact Heartwood Warden implementation is visually approved at 8a790e3f0d02cf64763733f83d17890c79ce83fc and authorized for bounded branch publication. After push, stop. Do not change public Dryad registration, generate fixtures, start Redcap or Nymph, add effects, release, open EN-E07, or broaden Wave 2 without another explicit gate.',
});

export const EN_E06_HEARTWOOD_WARDEN_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const PALETTE_MAP = new Map();
for (const [sourceGroup, targetGroup] of [['bark', 'bark'], ['crown', 'leaf'], ['trunk', 'heartwood'], ['leaf', 'leaf'], ['sapwood', 'cambium'], ['blossom', 'knot'], ['branch', 'branch']]) {
  const source = EN_E06_GROVE_TENDER_DATA.groveTender[sourceGroup];
  const target = COLORS[targetGroup];
  for (let index = 0; index < source.length; index++) PALETTE_MAP.set(source[index], target[Math.min(index, target.length - 1)]);
}
PALETTE_MAP.set(EN_E06_GROVE_TENDER_DATA.groveTender.eye, COLORS.eye);
PALETTE_MAP.set(EN_E06_GROVE_TENDER_DATA.groveTender.cavity, COLORS.cavity);

function normalizedAnimation(animation, frame) {
  if (animation === 'cast') return { animation: 'attack', frame };
  if (animation === 'death') return { animation: 'hurt', frame: EN_E06_HEARTWOOD_WARDEN_DEATH_SOURCE_FRAMES[frame] };
  return { animation, frame };
}

function captureGrove(direction, animation, frame) {
  const pixels = new Array(SIZE * SIZE).fill(null);
  let fillStyle = '#000000';
  const context = {
    get fillStyle() { return fillStyle; }, set fillStyle(value) { fillStyle = value; },
    clearRect(x, y, width, height) { for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) if (px >= 0 && py >= 0 && px < SIZE && py < SIZE) pixels[(py * SIZE) + px] = null; },
    fillRect(x, y, width, height) { for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) { assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Heartwood Warden source capture left the 24x24 cell.'); pixels[(py * SIZE) + px] = fillStyle; } },
  };
  renderEnE06GroveTenderFrame(context, direction, animation, frame);
  return pixels;
}

function setPixel(pixels, x, y, color) {
  assert(x >= 1 && y >= 1 && x <= 22 && y <= 22, 'Heartwood Warden additions must preserve a one-cell margin.');
  pixels[(y * SIZE) + x] = color;
}

function boundsOf(pixels) {
  const points = [];
  for (let y = 1; y <= 22; y++) for (let x = 1; x <= 22; x++) if (pixels[(y * SIZE) + x] !== null) points.push([x, y]);
  assert(points.length > 0, 'Heartwood Warden needs an opaque living-wood source.');
  return { minX: Math.min(...points.map(([x]) => x)), maxX: Math.max(...points.map(([x]) => x)), minY: Math.min(...points.map(([, y]) => y)), maxY: Math.max(...points.map(([, y]) => y)) };
}

function nearestOpaque(pixels, centerX, centerY, radius = 8) {
  for (let distance = 0; distance <= radius; distance++) for (let y = centerY - distance; y <= centerY + distance; y++) for (let x = centerX - distance; x <= centerX + distance; x++) {
    if (x >= 1 && y >= 1 && x <= 22 && y <= 22 && pixels[(y * SIZE) + x] !== null) return [x, y];
  }
  throw new TypeError('Heartwood Warden could not find a connected armor anchor.');
}

function edgeAnchor(pixels, side, minY, maxY) {
  const xValues = side === 'left' ? [...Array(22).keys()].map((index) => index + 1) : [...Array(22).keys()].map((index) => 22 - index);
  for (let y = minY; y <= maxY; y++) for (const x of xValues) if (pixels[(y * SIZE) + x] !== null) return [x, y];
  return nearestOpaque(pixels, side === 'left' ? 7 : 17, Math.round((minY + maxY) / 2));
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
  return [x, y];
}

function paintExisting(pixels, points, colors) {
  for (let index = 0; index < points.length; index++) {
    const [x, y] = points[index];
    if (x >= 1 && x <= 22 && y >= 1 && y <= 22 && pixels[(y * SIZE) + x] !== null) setPixel(pixels, x, y, colors[index % colors.length]);
  }
}

function addHeartwoodWardenIdentity(pixels, animation, frame, flash) {
  const color = (group, shade = 0) => flash ? COLORS.flash : COLORS[group][shade];
  const bounds = boundsOf(pixels);
  const centerX = Math.round((bounds.minX + bounds.maxX) / 2);
  const head = nearestOpaque(pixels, centerX, Math.max(1, bounds.minY), 5);
  const crownLean = animation === 'attack' ? [-1, 0, 1, 0][frame] : animation === 'walk' ? [0, 1, 0, -1][frame] : frame % 2;
  const crown = connectPath(pixels, head, [[crownLean, -1]], [color('cambium', 1)]);
  connectPath(pixels, crown, [[-2, -1], [-3, -2]], [color('branch', 1), color('leaf', 0)]);
  connectPath(pixels, crown, [[2, -1], [3, -2]], [color('branch', 0), color('leaf', 2)]);

  const shoulderTop = Math.max(bounds.minY + 4, 7);
  const shoulderBottom = Math.min(bounds.maxY - 5, shoulderTop + 5);
  const left = edgeAnchor(pixels, 'left', shoulderTop, shoulderBottom);
  const right = edgeAnchor(pixels, 'right', shoulderTop, shoulderBottom);
  const settle = animation === 'walk' ? [0, 1, 0, -1][frame] : animation === 'attack' ? [0, -1, 1, 0][frame] : frame % 2;
  const leftTip = connectPath(pixels, left, [[-1, 0], [-2, -1], [-3, settle]], [color('plate', 1), color('plate', 0), color('branch', 2)]);
  const rightTip = connectPath(pixels, right, [[1, 0], [2, -1], [3, -settle]], [color('plate', 1), color('plate', 2), color('branch', 0)]);
  connectPath(pixels, leftTip, [[0, 1]], [color('cambium', 0)]);
  connectPath(pixels, rightTip, [[0, 1]], [color('cambium', 2)]);

  const chest = nearestOpaque(pixels, centerX, Math.min(bounds.maxY - 6, shoulderTop + 4));
  paintExisting(pixels, [
    [chest[0] - 1, chest[1]], [chest[0], chest[1]], [chest[0] + 1, chest[1]],
    [chest[0] - 1, chest[1] + 1], [chest[0], chest[1] + 1], [chest[0] + 1, chest[1] + 1],
    [chest[0], chest[1] + 2],
  ], [color('heartwood', 1), color('knot', 0), color('heartwood', 2), color('plate', 0), color('knot', 2), color('plate', 2), color('cambium', 1)]);

  const hipY = Math.max(shoulderBottom + 3, bounds.maxY - 5);
  const lowerLeft = edgeAnchor(pixels, 'left', Math.min(hipY, bounds.maxY), bounds.maxY);
  const lowerRight = edgeAnchor(pixels, 'right', Math.min(hipY, bounds.maxY), bounds.maxY);
  connectPath(pixels, lowerLeft, [[-1, 0], [-2, 1]], [color('plate', 1), color('branch', 1)]);
  connectPath(pixels, lowerRight, [[1, 0], [2, 1]], [color('plate', 0), color('branch', 2)]);

  if (animation === 'attack') {
    const arm = edgeAnchor(pixels, 'right', shoulderTop, Math.min(bounds.maxY - 3, shoulderBottom + 6));
    const reach = [1, 3, 5, 2][frame];
    const rise = [0, 2, 1, 0][frame];
    const fork = connectPath(pixels, arm, [[1, 0], [reach, -rise]], [color('cambium', 1), color('branch', 2)]);
    connectPath(pixels, fork, [[1, -1]], [color('knot', 0)]);
    connectPath(pixels, fork, [[1, 1]], [color('knot', 2)]);
  }
}

function buildPixels(direction, animation, frame) {
  const canonicalDirection = direction === 'left' ? 'right' : direction;
  const normalized = normalizedAnimation(animation, frame);
  let pixels = captureGrove(canonicalDirection, normalized.animation, normalized.frame).map((value) => PALETTE_MAP.get(value) || value);
  const flash = normalized.animation === 'hurt' && normalized.frame === 0;
  addHeartwoodWardenIdentity(pixels, normalized.animation, normalized.frame, flash);
  if (direction === 'left') {
    const mirrored = new Array(SIZE * SIZE).fill(null);
    for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) mirrored[(y * SIZE) + (SIZE - 1 - x)] = pixels[(y * SIZE) + x];
    pixels = mirrored;
  }
  const phase = normalized.animation === 'attack'
    ? ['heartplate-brace', 'warding-bough-draw', 'connected-fork-guard', 'ironwood-recover'][normalized.frame]
    : `${normalized.animation}-heartwood-warden-${normalized.frame + 1}`;
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

export function renderEnE06HeartwoodWardenFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Heartwood Warden rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), `Unsupported Heartwood Warden direction ${direction}.`);
  context.clearRect(0, 0, SIZE, SIZE);
  const { pixels, phase } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({ family: 'dryad', variant: 'heartwood-warden', direction, animation, frame, phase, heartwoodWardenGate: EN_E06_HEARTWOOD_WARDEN_GATE.id, approvedPrecedingGate: EN_E06_SPORE_CANTOR_GATE.id, alphaPolicy: EN_E06_HEARTWOOD_WARDEN_DATA.alphaPolicy, effectBoundary: EN_E06_HEARTWOOD_WARDEN_DATA.effectBoundary });
}

export const EN_E06_HEARTWOOD_WARDEN_RENDERER = deepFreeze({
  key: 'en-e06-dryad-heartwood-warden-v1', chassis: EN_E06_HEARTWOOD_WARDEN_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'dryad', 'The EN-E06 Heartwood Warden renderer is restricted to Dryad.');
    assert(variant.id === 'heartwood-warden', 'The EN-E06 Heartwood Warden renderer is restricted to Heartwood Warden.');
    return renderEnE06HeartwoodWardenFrame(context, direction, animation.id, frame);
  },
});

const HEARTWOOD_WARDEN_VARIANT = deepFreeze({ id: 'heartwood-warden', name: 'Heartwood Warden', role: EN_E06_HEARTWOOD_WARDEN_CONTRACT.role, status: EN_E06_HEARTWOOD_WARDEN_CONTRACT.state, brief: 'A complete elite Dryad with connected branch pauldrons, a ringed heartplate, crown prongs, root greaves, and one full standard motion suite; auras, bark shards, roots, leaves, and impacts remain external.', rendererData: EN_E06_HEARTWOOD_WARDEN_DATA });

export const EN_E06_HEARTWOOD_WARDEN_FAMILY = deepFreeze({
  id: 'dryad', name: 'Dryad Heartwood Warden Review', sliceId: 'EN-E06', state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E06_HEARTWOOD_WARDEN_CONTRACT.chassis, rendererKey: EN_E06_HEARTWOOD_WARDEN_RENDERER.key,
  variants: [HEARTWOOD_WARDEN_VARIANT],
  rendererData: { contractCard: EN_E06_DRYAD_CONTRACT_CARD.id, approvedPrecedingGate: EN_E06_SPORE_CANTOR_GATE.id, activeGate: EN_E06_HEARTWOOD_WARDEN_GATE.id },
  review: { baselineVariant: 'heartwood-warden', scale: 8, notes: 'Review the complete Heartwood Warden beside public Treant and both approved Dryads before approval, publication, public registration changes, fixtures, Redcap, Nymph, effects, release, or later Wave 2 work.' },
});

export const EN_E06_HEARTWOOD_WARDEN_REGISTRY = createEnemyExpansionRegistry({ renderers: [EN_E06_HEARTWOOD_WARDEN_RENDERER], families: [EN_E06_HEARTWOOD_WARDEN_FAMILY] });
