import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E06_DRYAD_CONTRACT_CARD } from './enemy-expansion-en-e06-fairy-idle.js';
import {
  EN_E06_GROVE_TENDER_DATA,
  EN_E06_GROVE_TENDER_GATE,
  renderEnE06GroveTenderFrame,
} from './enemy-expansion-en-e06-dryad-grove-tender.js';

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
  bark: ['#716453', '#403936', '#a08c70'],
  mycelium: ['#77a99a', '#3d665f', '#a8d3b8'],
  heartwood: ['#5a4a45', '#302b31', '#80665b'],
  moss: ['#477469', '#294c48', '#70a38b'],
  gill: ['#d7cba7', '#8f876f', '#f0e4bd'],
  cap: ['#8d668f', '#553f64', '#bd8faa'],
  shelf: ['#b47a69', '#714b50', '#dda58a'],
  eye: '#e7c46a',
  cavity: '#29252b',
  flash: '#f4f4f4',
});

export const EN_E06_SPORE_CANTOR_CONTRACT = deepFreeze({
  sliceId: 'EN-E06',
  family: 'dryad',
  variant: 'spore-cantor',
  role: 'specialist',
  state: 'implemented-complete-motion-approved',
  chassis: 'fungal-crowned-living-wood-fey-humanoid-v1',
  silhouette: 'A slim upright living-wood fey with a connected broad fungal crown, pale gill collar, asymmetric shelf fungi, flexible branch arms, split root hems, and ordinary humanoid height. The body remains distinct from both the leaf-crowned Grove Tender and broad public Treant.',
  identity: 'Cool bark, violet mushroom caps, pale gills, teal mycelium, coral shelf fungi, amber eyes, and a connected canting crown establish a fungal specialist without baking any cloud or mote.',
  effectBoundary: 'Spore clouds, drifting motes, loose spores, pollen, detached caps, summoned fungi, vines, root eruptions, trails, projectiles, impacts, and glows remain external.',
});

export const EN_E06_SPORE_CANTOR_DATA = deepFreeze({
  actor: {
    species: 'fey', bodyBuild: 'slim-upright', skin: 'cool-bark', hairStyle: 'fungal-crown', hairColor: 'violet-cap',
    expression: 'trance-singing', faceDetail: 'amber-sap-eyes', headgear: 'connected-mushroom-crown', outfit: 'mycelial-bark',
    outfitColor: 'teal-violet', outfitTier: 'tier2', weapon: 'canting-branch-arm', weaponTier: 'natural',
    shield: 'none', shieldTier: 'tier1', offhand: 'connected-shelf-fungi',
    palette: { skin: COLORS.bark, hair: COLORS.cap, outfit: COLORS.heartwood },
  },
  sporeCantor: COLORS,
  alphaPolicy: 'binary-connected-fungal-living-wood-fey',
  effectBoundary: 'external-spore-clouds-drifting-motes-loose-spores-pollen-detached-caps-summoned-fungi-vines-root-eruptions-trails-projectiles-impacts-and-glows',
  bakedEffects: [],
});

export const EN_E06_SPORE_CANTOR_GATE = deepFreeze({
  id: 'en-e06-dryad-spore-cantor-full-v1',
  status: 'approved',
  authorizedOn: '2026-08-09',
  authorizationEvidence: 'After the exact Grove Tender boards and paired GIFs were approved, the designer replied: approved lets do nexrt, then explicitly confirmed the exact Grove Tender push. This separately authorizes only one complete private specialist Spore Cantor 80-frame pass after publication.',
  approvedOn: '2026-08-09',
  approvalEvidence: 'The exact raw, Complete B + Form outlined, and Treant/Grove Tender/Spore Cantor comparison boards plus both synchronized raw and outlined GIFs were presented; the three exact PNG review boards were opened together in Aseprite. After specifically requesting the outlined presentation, the designer replied: approved. after comitting and pushing lets go ahead and go over project docs and make sure nothing is stale and then write a proper handoff. This approves only the frozen 80-frame Spore Cantor, its bounded implementation and approval commits, and branch publication. The next authorized work is a current-state project-document audit and proper handoff; Heartwood Warden, registration, fixtures, effects, release, Redcap, and broader Wave 2 remain separate.',
  publishedImplementation: '46d1dc9e24297aade917c8e7268e64a1030aa151',
  precedingApproval: {
    gateId: EN_E06_GROVE_TENDER_GATE.id,
    artifactSha256: EN_E06_GROVE_TENDER_GATE.artifactSha256,
    assembledArtifactSha256: EN_E06_GROVE_TENDER_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E06_GROVE_TENDER_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E06_GROVE_TENDER_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E06_GROVE_TENDER_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E06_GROVE_TENDER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E06_GROVE_TENDER_GATE.publishedImplementation,
    publishedHandoff: '4c49f2788a662a77a063477d5321b34c543e6f97',
  },
  artifact: 'enemy-expansion-review/en-e06-dryad-spore-cantor/en-e06-dryad-spore-cantor-full-suite-raw.png',
  artifactSha256: '8d1ef13a9967ca442139435ab52e5ade356aed328affa640c394426fd6df623a',
  assembledArtifact: 'enemy-expansion-review/en-e06-dryad-spore-cantor/en-e06-dryad-spore-cantor-full-suite-complete-b-form.png',
  assembledArtifactSha256: 'dd7be56b97571c1c203e32f1ccccbd99a30476482d1c881b4596b8301f750d81',
  comparisonArtifact: 'enemy-expansion-review/en-e06-dryad-spore-cantor/en-e06-dryad-spore-cantor-comparison.png',
  comparisonArtifactSha256: 'd923c4f60da5e1a59cbd363713b72e47d526a26f5f0c7266a3cb76bb2fa562cc',
  reviewAnimations: {
    raw: { artifact: 'enemy-expansion-review/en-e06-dryad-spore-cantor/en-e06-dryad-spore-cantor-full-suite-four-directions-labeled.gif', sha256: '835fab9de60ff4a39cc4235a6dc620ae88a6cf3009999420029f589bc15d40ed', width: 640, height: 672, frames: 4, durationMs: 720 },
    completeBForm: { artifact: 'enemy-expansion-review/en-e06-dryad-spore-cantor/en-e06-dryad-spore-cantor-full-suite-four-directions-labeled-complete-b-form.gif', sha256: '843d3cc7bdbb9d224503c5d658b14c7bfc19bc7327c2724be8ea25e3b572d9ef', width: 640, height: 672, frames: 4, durationMs: 720 },
  },
  candidateFrameDigest: 'b22585e7b055f4ae43eb1293741967c1d76ec9bd3b842320880f2038c0cf62ef',
  treantComparisonDigest: EN_E06_GROVE_TENDER_GATE.treantComparisonDigest,
  groveTenderComparisonDigest: EN_E06_GROVE_TENDER_GATE.candidateFrameDigest,
  scope: 'One complete 80-frame Spore Cantor specialist Dryad across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle breathes through a connected gill collar and tilts the fungal crown. Walk carries a four-phase rooted-looking mobile stride with alternating shelf-fungus weight. Attack draws the branch arm and crown inward, lifts the connected caps into a visible canting chorus, sweeps the arm while keeping all fungal geometry attached, and recovers. Hurt uses a complete white recoil and colored mycelial brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show public Treant and approved Grove Tender beside Spore Cantor, plus the labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards and synchronized GIFs together.',
  exclusions: [
    'changes to approved Fairy source or pixels', 'changes to approved Hag source or pixels', 'changes to approved Grove Tender source or pixels',
    'Heartwood Warden implementation', 'Redcap implementation', 'Nymph implementation',
    'public Dryad registration', 'public catalog exposure', 'asset-pack fixture generation or regeneration',
    'new Cast pixels', 'new Death pixels', 'spore clouds', 'drifting motes', 'loose spores', 'pollen',
    'detached caps', 'summoned fungi', 'vines', 'root eruptions', 'trails', 'projectiles', 'impacts', 'glows',
    'effects', 'release', 'later EN-E06 sprites', 'EN-E07 and later Wave 2 work',
  ],
  nextGate: 'The exact Spore Cantor implementation is approved and recorded for branch publication. After that push, audit all active project documents against live Git and validation evidence and write a proper canonical handoff. Do not start Heartwood Warden, register Dryad, generate fixtures, begin Redcap, add effects, release, or broaden Wave 2 without separate authorization.',
});

export const EN_E06_SPORE_CANTOR_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const PALETTE_MAP = new Map();
for (const [sourceGroup, targetGroup] of [['bark', 'bark'], ['crown', 'mycelium'], ['trunk', 'heartwood'], ['leaf', 'moss'], ['sapwood', 'gill'], ['blossom', 'cap'], ['branch', 'shelf']]) {
  const source = EN_E06_GROVE_TENDER_DATA.groveTender[sourceGroup];
  const target = COLORS[targetGroup];
  for (let index = 0; index < source.length; index++) PALETTE_MAP.set(source[index], target[Math.min(index, target.length - 1)]);
}
PALETTE_MAP.set(EN_E06_GROVE_TENDER_DATA.groveTender.eye, COLORS.eye);
PALETTE_MAP.set(EN_E06_GROVE_TENDER_DATA.groveTender.cavity, COLORS.cavity);

function normalizedAnimation(animation, frame) {
  if (animation === 'cast') return { animation: 'attack', frame };
  if (animation === 'death') return { animation: 'hurt', frame: EN_E06_SPORE_CANTOR_DEATH_SOURCE_FRAMES[frame] };
  return { animation, frame };
}

function captureGrove(direction, animation, frame) {
  const pixels = new Array(SIZE * SIZE).fill(null);
  let fillStyle = '#000000';
  const context = {
    get fillStyle() { return fillStyle; }, set fillStyle(value) { fillStyle = value; },
    clearRect(x, y, width, height) { for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) if (px >= 0 && py >= 0 && px < SIZE && py < SIZE) pixels[(py * SIZE) + px] = null; },
    fillRect(x, y, width, height) { for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) { assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Spore Cantor source capture left the 24x24 cell.'); pixels[(py * SIZE) + px] = fillStyle; } },
  };
  renderEnE06GroveTenderFrame(context, direction, animation, frame);
  return pixels;
}

function setPixel(pixels, x, y, color) {
  assert(x >= 1 && y >= 1 && x <= 22 && y <= 22, 'Spore Cantor additions must preserve a one-cell margin.');
  pixels[(y * SIZE) + x] = color;
}

function boundsOf(pixels) {
  const points = [];
  for (let y = 1; y <= 22; y++) for (let x = 1; x <= 22; x++) if (pixels[(y * SIZE) + x] !== null) points.push([x, y]);
  assert(points.length > 0, 'Spore Cantor needs an opaque living-wood source.');
  return { minX: Math.min(...points.map(([x]) => x)), maxX: Math.max(...points.map(([x]) => x)), minY: Math.min(...points.map(([, y]) => y)), maxY: Math.max(...points.map(([, y]) => y)) };
}

function nearestOpaque(pixels, centerX, centerY, radius = 8) {
  for (let distance = 0; distance <= radius; distance++) for (let y = centerY - distance; y <= centerY + distance; y++) for (let x = centerX - distance; x <= centerX + distance; x++) {
    if (x >= 1 && y >= 1 && x <= 22 && y <= 22 && pixels[(y * SIZE) + x] !== null) return [x, y];
  }
  throw new TypeError('Spore Cantor could not find a connected fungal anchor.');
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
}

function addSporeCantorIdentity(pixels, animation, frame, flash) {
  const color = (group, shade = 0) => flash ? COLORS.flash : COLORS[group][shade];
  const bounds = boundsOf(pixels);
  const centerX = Math.round((bounds.minX + bounds.maxX) / 2);
  const head = nearestOpaque(pixels, centerX, Math.max(1, bounds.minY), 5);
  const cant = animation === 'attack' ? [-1, 0, 2, 1][frame] : animation === 'walk' ? [-1, 0, 1, 0][frame] : frame % 2;
  const capY = Math.max(1, head[1] - 1);
  const capX = Math.max(3, Math.min(20, head[0] + cant));

  connectPath(pixels, head, [[cant, -1]], [color('gill', 1)]);
  for (const [dx, dy, shade] of [[-2, 1, 1], [-1, 0, 0], [-1, 1, 1], [0, 0, 2], [0, 1, 1], [1, 0, 0], [1, 1, 1], [2, 1, 1]]) {
    setPixel(pixels, capX + dx, Math.max(1, Math.min(22, capY + dy)), color('cap', shade));
  }

  const shoulderTop = Math.max(bounds.minY + 4, 7);
  const shoulderBottom = Math.min(bounds.maxY - 4, shoulderTop + 5);
  const left = edgeAnchor(pixels, 'left', shoulderTop, shoulderBottom);
  const right = edgeAnchor(pixels, 'right', shoulderTop, shoulderBottom);
  const pulse = animation === 'walk' ? [0, 1, 0, -1][frame] : animation === 'attack' ? [0, -1, 1, 0][frame] : frame % 2;
  connectPath(pixels, left, [[-1, 0], [-2, pulse]], [color('mycelium', 1), color('shelf', 0)]);
  connectPath(pixels, [Math.max(1, left[0] - 1), left[1]], [[-1, -1]], [color('shelf', 2)]);
  connectPath(pixels, right, [[1, 0], [2, -pulse]], [color('mycelium', 0), color('shelf', 1)]);
  connectPath(pixels, [Math.min(22, right[0] + 1), right[1]], [[1, -1]], [color('shelf', 2)]);

  const collar = nearestOpaque(pixels, centerX, Math.min(bounds.maxY - 5, shoulderTop + 3));
  for (const [dx, dy, shade] of [[-1, 0, 1], [0, 0, 2], [1, 0, 1], [-1, 1, 0], [1, 1, 0]]) {
    const x = collar[0] + dx, y = collar[1] + dy;
    if (x >= 1 && x <= 22 && y >= 1 && y <= 22 && pixels[(y * SIZE) + x] !== null) setPixel(pixels, x, y, color('gill', shade));
  }

  // These are connected fruiting bodies, never detached spores or effect motes.
  const hip = nearestOpaque(pixels, centerX, Math.min(bounds.maxY - 3, collar[1] + 5));
  connectPath(pixels, hip, [[-1, 0], [-2, 0], [-2, -1]], [color('mycelium', 1), color('cap', 1), color('cap', 0)]);
  if (animation === 'attack') {
    const arm = edgeAnchor(pixels, 'right', shoulderTop, Math.min(bounds.maxY - 3, shoulderBottom + 5));
    const reach = [1, 2, 4, 2][frame];
    const rise = [1, 2, 1, 0][frame];
    connectPath(pixels, arm, [[1, 0], [reach, -rise]], [color('mycelium', 1), color('shelf', 2)]);
  }
}

function buildPixels(direction, animation, frame) {
  const canonicalDirection = direction === 'left' ? 'right' : direction;
  const normalized = normalizedAnimation(animation, frame);
  let pixels = captureGrove(canonicalDirection, normalized.animation, normalized.frame).map((value) => PALETTE_MAP.get(value) || value);
  const flash = normalized.animation === 'hurt' && normalized.frame === 0;
  addSporeCantorIdentity(pixels, normalized.animation, normalized.frame, flash);
  if (direction === 'left') {
    const mirrored = new Array(SIZE * SIZE).fill(null);
    for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) mirrored[(y * SIZE) + (SIZE - 1 - x)] = pixels[(y * SIZE) + x];
    pixels = mirrored;
  }
  const phase = normalized.animation === 'attack'
    ? ['crown-and-arm-draw', 'connected-cap-chorus-rise', 'cantor-branch-sweep', 'mycelial-recover'][normalized.frame]
    : `${normalized.animation}-spore-cantor-${normalized.frame + 1}`;
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

export function renderEnE06SporeCantorFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Spore Cantor rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), `Unsupported Spore Cantor direction ${direction}.`);
  context.clearRect(0, 0, SIZE, SIZE);
  const { pixels, phase } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({ family: 'dryad', variant: 'spore-cantor', direction, animation, frame, phase, sporeCantorGate: EN_E06_SPORE_CANTOR_GATE.id, approvedPrecedingGate: EN_E06_GROVE_TENDER_GATE.id, alphaPolicy: EN_E06_SPORE_CANTOR_DATA.alphaPolicy, effectBoundary: EN_E06_SPORE_CANTOR_DATA.effectBoundary });
}

export const EN_E06_SPORE_CANTOR_RENDERER = deepFreeze({
  key: 'en-e06-dryad-spore-cantor-v1', chassis: EN_E06_SPORE_CANTOR_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'dryad', 'The EN-E06 Spore Cantor renderer is restricted to Dryad.');
    assert(variant.id === 'spore-cantor', 'The EN-E06 Spore Cantor renderer is restricted to Spore Cantor.');
    return renderEnE06SporeCantorFrame(context, direction, animation.id, frame);
  },
});

const SPORE_CANTOR_VARIANT = deepFreeze({ id: 'spore-cantor', name: 'Spore Cantor', role: EN_E06_SPORE_CANTOR_CONTRACT.role, status: EN_E06_SPORE_CANTOR_CONTRACT.state, brief: 'A complete specialist Dryad with connected fungal crown, gill collar, shelf fungi, and one full standard motion suite; spore clouds, motes, loose spores, and other effects remain external.', rendererData: EN_E06_SPORE_CANTOR_DATA });

export const EN_E06_SPORE_CANTOR_FAMILY = deepFreeze({
  id: 'dryad', name: 'Dryad Spore Cantor Review', sliceId: 'EN-E06', state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E06_SPORE_CANTOR_CONTRACT.chassis, rendererKey: EN_E06_SPORE_CANTOR_RENDERER.key,
  variants: [SPORE_CANTOR_VARIANT],
  rendererData: { contractCard: EN_E06_DRYAD_CONTRACT_CARD.id, approvedPrecedingGate: EN_E06_GROVE_TENDER_GATE.id, activeGate: EN_E06_SPORE_CANTOR_GATE.id },
  review: { baselineVariant: 'spore-cantor', scale: 8, notes: 'Review the complete Spore Cantor beside public Treant and approved Grove Tender before publication, registration, Heartwood Warden, fixtures, effects, release, or later Wave 2 work.' },
});

export const EN_E06_SPORE_CANTOR_REGISTRY = createEnemyExpansionRegistry({ renderers: [EN_E06_SPORE_CANTOR_RENDERER], families: [EN_E06_SPORE_CANTOR_FAMILY] });
