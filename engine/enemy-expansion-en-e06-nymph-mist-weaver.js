import { SIZE } from './catalogs.js';
import { createEnemyExpansionRegistry, ENEMY_EXPANSION_STATES } from './enemy-expansion.js';
import { EN_E06_NYMPH_CONTRACT_CARD } from './enemy-expansion-en-e06-fairy-idle.js';
import {
  EN_E06_SPRING_DANCER_GATE,
  renderEnE06SpringDancerFrame,
} from './enemy-expansion-en-e06-nymph-spring-dancer.js';

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
  skin: ['#d8c2d8', '#9f7fa8', '#f0d8ea'],
  hair: ['#29445f', '#172b42', '#55718d'],
  robe: ['#53639a', '#29345f', '#8692c2'],
  veil: ['#82c4c8', '#3e7c87', '#c3ece6'],
  trim: ['#a9a6d4', '#676394', '#e0dcf2'],
  silver: ['#c5ceda', '#788694', '#edf4f8'],
  sandal: ['#554665', '#302b43', '#9182a4'],
  eye: '#d4f5ef',
  flash: '#f4f4f4',
});

const RECOLOR = deepFreeze({
  '#efc6a5': COLORS.skin[0], '#b77f69': COLORS.skin[1], '#ffe1c2': COLORS.skin[2],
  '#4b8f76': COLORS.hair[0], '#28584e': COLORS.hair[1], '#86c9a7': COLORS.hair[2],
  '#69b985': COLORS.robe[0], '#2f7058': COLORS.robe[1], '#a7dda4': COLORS.robe[2],
  '#ed8eb2': COLORS.veil[0], '#a64d76': COLORS.veil[1], '#ffd0df': COLORS.veil[2],
  '#79a94c': COLORS.trim[0], '#3f6935': COLORS.trim[1], '#b4d769': COLORS.trim[2],
  '#704c3a': COLORS.sandal[0], '#3a2b26': COLORS.sandal[1], '#a67a51': COLORS.sandal[2],
  '#d5ad4f': COLORS.silver[0], '#89602a': COLORS.silver[1], '#f2d778': COLORS.silver[2],
  '#5f3b75': COLORS.eye,
});

export const EN_E06_MIST_WEAVER_CONTRACT = deepFreeze({
  sliceId: 'EN-E06',
  family: 'nymph',
  variant: 'mist-weaver',
  role: 'specialist',
  state: 'implemented-complete-motion-candidate',
  chassis: 'veiled-cowl-bell-sleeve-mist-weaver-nymph-v1',
  silhouette: 'A slender grounded Nymph specialist with a deep crescent cowl, face veil, broad layered shoulder mantle, connected bell sleeves, woven sash, and long divided robe. The hood-and-sleeve mass must differ from Spring Dancer, public Elf Mage, and approved specialist fey in every frame.',
  identity: 'Moonlit lavender skin, midnight-blue hair, indigo robe planes, cool-aqua veil cloth, pale woven trim, silver fasteners, and dark sandals establish a self-contained Mist Weaver without baking in fog, vapor, water arcs, ripples, particles, or glow.',
  effectBoundary: 'Mist, fog banks, vapor curls, water arcs, ground ripples, droplets, sparkles, elemental flares, detached veil trails, and impact flashes remain external.',
});

export const EN_E06_MIST_WEAVER_DATA = deepFreeze({
  actor: {
    species: 'fey', bodyBuild: 'slender-humanoid', skin: 'moonlit-lavender',
    hairStyle: 'hooded-long-hair', hairColor: 'midnight-blue', expression: 'veiled-focus',
    faceDetail: 'pointed-fey-ears', headgear: 'deep-crescent-cowl',
    outfit: 'layered-mantle-bell-sleeve-robe', outfitColor: 'indigo-aqua-silver',
    outfitTier: 'tier2', weapon: 'none', weaponTier: 'none', shield: 'none',
    shieldTier: 'tier1', offhand: 'none',
    palette: { skin: COLORS.skin, hair: COLORS.hair, outfit: COLORS.robe },
  },
  mistWeaver: COLORS,
  alphaPolicy: 'binary-connected-cowl-veil-mantle-bell-sleeves-woven-sash-and-grounded-robe',
  effectBoundary: 'external-mist-fog-vapor-water-arcs-ground-ripples-droplets-sparkles-elemental-flares-detached-veil-trails-and-impact-flashes',
  bakedEffects: [],
});

export const EN_E06_MIST_WEAVER_GATE = deepFreeze({
  id: 'en-e06-nymph-mist-weaver-full-v1',
  status: 'candidate',
  baseCheckpoint: '6e63e95d5e6cf653ad37299766f10c3d3e3c0b2d',
  authorizedOn: '2026-08-10',
  authorizationEvidence: 'After Spring Dancer was visually approved, committed, pushed, and reconciled at a clean published checkpoint, the designer said: lets do next. Under the documented EN-E06 Nymph role order and one-complete-sprite cadence, this authorizes only one private specialist Nymph Mist Weaver 80-frame candidate.',
  approvedOn: null,
  approvalEvidence: 'Pending explicit visual approval of the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, the public Elf Mage plus approved Spring Dancer and Spore Cantor comparison, paired GIF evidence, and the three exact PNG review boards opened together in Aseprite.',
  publishedImplementation: null,
  precedingApproval: {
    gateId: EN_E06_SPRING_DANCER_GATE.id,
    artifactSha256: EN_E06_SPRING_DANCER_GATE.artifactSha256,
    assembledArtifactSha256: EN_E06_SPRING_DANCER_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E06_SPRING_DANCER_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E06_SPRING_DANCER_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E06_SPRING_DANCER_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E06_SPRING_DANCER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E06_SPRING_DANCER_GATE.publishedImplementation,
    publishedHandoff: '6e63e95d5e6cf653ad37299766f10c3d3e3c0b2d',
  },
  artifact: 'enemy-expansion-review/en-e06-nymph-mist-weaver/en-e06-nymph-mist-weaver-full-suite-raw.png',
  artifactSha256: '8a10affbdd26d23ee7071ed6a19c723d3fc5f095d325064f855c2577eb830f01',
  assembledArtifact: 'enemy-expansion-review/en-e06-nymph-mist-weaver/en-e06-nymph-mist-weaver-full-suite-complete-b-form.png',
  assembledArtifactSha256: '79f2876c8bed63d9f1b68cd4cc6d5308f6aa42939b6a424234ac4bd3bacd6b9a',
  comparisonArtifact: 'enemy-expansion-review/en-e06-nymph-mist-weaver/en-e06-nymph-mist-weaver-elf-fey-comparison.png',
  comparisonArtifactSha256: '4cd1153281213823dafb812edd3b1b1cb11a1e6279f772fb84eba65f888cb41f',
  reviewAnimations: {
    raw: { artifact: 'enemy-expansion-review/en-e06-nymph-mist-weaver/en-e06-nymph-mist-weaver-full-suite-four-directions-labeled.gif', sha256: 'ddc0b6bbd45f5d33d4e79f58f1ae2a47ddf81ee7e7b02ad4ca35d4a1bd9b03bc', width: 640, height: 672, frames: 4, durationMs: 720 },
    completeBForm: { artifact: 'enemy-expansion-review/en-e06-nymph-mist-weaver/en-e06-nymph-mist-weaver-full-suite-four-directions-labeled-complete-b-form.gif', sha256: '33712c7db8b0b30b4a53d4ab16eae90301c0d96bf8c2f5c2cc1777890ca011a3', width: 640, height: 672, frames: 4, durationMs: 720 },
  },
  candidateFrameDigest: 'e57a0af441f895fe376f2696d859a97d84564ddf034235d3b237b2cf637520da',
  elfMageComparisonDigest: 'f5924562a9d264bf2950c324fc3b6eb0560391a39e81bf4bd8ab5ed9d5987679',
  springDancerComparisonDigest: EN_E06_SPRING_DANCER_GATE.candidateFrameDigest,
  sporeCantorComparisonDigest: 'b22585e7b055f4ae43eb1293741967c1d76ec9bd3b842320880f2038c0cf62ef',
  scope: 'One complete 80-frame Mist Weaver specialist Nymph across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle breathes through the connected veil and settles the mantle. Walk uses four light grounded glides with alternating sleeve and sash lag. Attack gathers both hands close to the torso, lifts the veiled focus, opens into a clear two-handed outward release, and crosses into recovery without detached pixels. Hurt uses a complete white recoil and colored mantle brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and a public Elf Mage plus approved Spring Dancer and Spore Cantor silhouette comparison together.',
  exclusions: [
    'changes to approved Spring Dancer source or pixels', 'changes to approved Fairy source or pixels',
    'changes to approved Hag source or pixels', 'changes to approved Dryad source or pixels',
    'changes to approved Redcap source or pixels', 'Rivercrown Muse implementation',
    'public Nymph registration', 'public catalog exposure', 'asset-pack fixture generation or regeneration',
    'new Cast pixels', 'new Death pixels', 'mist', 'fog banks', 'vapor curls', 'water arcs',
    'ground ripples', 'droplets', 'sparkles', 'elemental flares', 'detached veil trails',
    'impact flashes', 'effects', 'release', 'later EN-E06 sprites', 'EN-E07 and later Wave 2 work',
  ],
  nextGate: 'Stop at the exact frozen Mist Weaver candidate review. Do not commit, publish, register Nymph, generate fixtures, begin Rivercrown Muse, add effects, release, start EN-E07, or broaden Wave 2 until the designer explicitly approves the presented boards and paired GIFs.',
});

export const EN_E06_MIST_WEAVER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);
const WALK_PHASES = deepFreeze([
  { name: 'left-grounded-glide', idleFrame: 0, step: -1, lift: 0 },
  { name: 'veil-sleeve-drift', idleFrame: 1, step: 0, lift: -1 },
  { name: 'right-grounded-glide', idleFrame: 0, step: 1, lift: 0 },
  { name: 'woven-sash-settle', idleFrame: 1, step: 0, lift: 0 },
]);
const ATTACK_PHASES = deepFreeze([
  { name: 'close-hand-gather', pose: 'gather', idleFrame: 0 },
  { name: 'veiled-focus-lift', pose: 'lift', idleFrame: 1, dy: -1 },
  { name: 'two-hand-outward-release', pose: 'release', idleFrame: 0 },
  { name: 'crossed-sleeve-recovery', pose: 'recover', idleFrame: 1 },
]);
const HURT_PHASES = deepFreeze([
  { name: 'white-veil-recoil', pose: 'hurt', idleFrame: 0, flash: true },
  { name: 'colored-mantle-brace', pose: 'brace', idleFrame: 1, dy: -1, flash: false },
]);

function pixelCanvas() {
  const pixels = new Array(SIZE * SIZE).fill(null);
  let fillStyle = '#000000';
  return { pixels, context: {
    get fillStyle() { return fillStyle; }, set fillStyle(value) { fillStyle = value; },
    clearRect(x, y, width, height) { for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) if (px >= 0 && py >= 0 && px < SIZE && py < SIZE) pixels[(py * SIZE) + px] = null; },
    fillRect(x, y, width, height) { for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) { assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Mist Weaver authored pixels must remain inside the 24x24 cell.'); pixels[(py * SIZE) + px] = fillStyle; } },
  } };
}

function paintFor(pixels, dy = 0) {
  const rect = (x, y, width, height, fill) => { for (let py = y + dy; py < y + dy + height; py++) for (let px = x; px < x + width; px++) { assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Mist Weaver overlay must remain inside the 24x24 cell.'); pixels[(py * SIZE) + px] = fill; } };
  return { rect, dot(x, y, fill) { rect(x, y, 1, 1, fill); } };
}

function overlayFront(paint, rear, phase) {
  const sway = phase.idleFrame || 0;
  paint.rect(7, 3 + sway, 10, 2, COLORS.hair[1]);
  paint.rect(6, 5 + sway, 12, 3, COLORS.hair[0]);
  paint.rect(5, 7, 14, 3, COLORS.robe[1]);
  paint.rect(8, 8, 8, 3, rear ? COLORS.hair[1] : COLORS.veil[0]);
  if (!rear) { paint.dot(9, 8, COLORS.eye); paint.dot(14, 8, COLORS.eye); paint.rect(9, 10, 6, 1, COLORS.veil[2]); }
  paint.rect(5, 10, 14, 4, COLORS.robe[1]);
  paint.rect(4, 12, 4, 5, COLORS.veil[1]);
  paint.rect(16, 12, 4, 5, COLORS.veil[0]);
  paint.rect(3, 15, 5, 3, COLORS.veil[0]);
  paint.rect(16, 15, 5, 3, COLORS.veil[2]);
  paint.rect(8, 12, 8, 5, COLORS.robe[0]);
  paint.rect(7, 16, 10, 3, COLORS.robe[2]);
  paint.rect(6, 18, 12, 3, COLORS.robe[0]);
  paint.rect(6, 20, 12, 1, COLORS.trim[1]);
  paint.rect(9, 13, 6, 2, COLORS.trim[0]);
  paint.dot(12, 13, COLORS.silver[2]);
  if (rear) { paint.rect(4, 9, 3, 7, COLORS.hair[1]); paint.rect(17, 9, 3, 7, COLORS.hair[0]); }
  overlayFrontPose(paint, phase.pose);
  paint.dot(12, 11, COLORS.silver[2]);
}

function overlayFrontPose(paint, pose) {
  if (pose === 'gather') {
    paint.rect(5, 12, 6, 4, COLORS.veil[1]); paint.rect(13, 12, 6, 4, COLORS.veil[0]);
    paint.rect(9, 14, 6, 3, COLORS.skin[2]); paint.rect(11, 13, 2, 2, COLORS.silver[2]);
  } else if (pose === 'lift') {
    paint.rect(6, 8, 5, 6, COLORS.veil[1]); paint.rect(13, 8, 5, 6, COLORS.veil[0]);
    paint.rect(9, 7, 6, 3, COLORS.skin[2]); paint.rect(11, 6, 2, 2, COLORS.silver[2]);
  } else if (pose === 'release') {
    paint.rect(1, 11, 8, 4, COLORS.veil[1]); paint.rect(15, 11, 8, 4, COLORS.veil[0]);
    paint.rect(1, 13, 5, 3, COLORS.skin[1]); paint.rect(18, 13, 5, 3, COLORS.skin[2]);
  } else if (pose === 'recover' || pose === 'brace') {
    paint.rect(6, 12, 6, 5, COLORS.veil[1]); paint.rect(12, 12, 6, 5, COLORS.veil[0]);
    paint.rect(9, 15, 6, 2, COLORS.skin[1]);
  }
}

function overlayRight(paint, phase) {
  const sway = phase.idleFrame || 0;
  paint.rect(8, 3 + sway, 10, 2, COLORS.hair[1]);
  paint.rect(6, 5 + sway, 13, 3, COLORS.hair[0]);
  paint.rect(5, 7, 15, 3, COLORS.robe[1]);
  paint.rect(12, 8, 8, 3, COLORS.veil[0]); paint.dot(17, 8, COLORS.eye);
  paint.rect(5, 10, 15, 4, COLORS.robe[1]);
  paint.rect(4, 12, 6, 6, COLORS.veil[1]); paint.rect(16, 12, 5, 6, COLORS.veil[0]);
  paint.rect(7, 13, 11, 5, COLORS.robe[0]); paint.rect(7, 17, 12, 4, COLORS.robe[2]);
  paint.rect(7, 20, 12, 1, COLORS.trim[1]); paint.rect(10, 13, 6, 2, COLORS.trim[0]);
  paint.dot(15, 13, COLORS.silver[2]);
  if (phase.pose === 'gather') { paint.rect(10, 12, 9, 5, COLORS.veil[0]); paint.rect(15, 14, 5, 3, COLORS.skin[2]); }
  else if (phase.pose === 'lift') { paint.rect(12, 7, 7, 6, COLORS.veil[0]); paint.rect(16, 6, 4, 3, COLORS.skin[2]); }
  else if (phase.pose === 'release') { paint.rect(14, 10, 8, 5, COLORS.veil[0]); paint.rect(19, 12, 4, 3, COLORS.skin[2]); }
  else if (phase.pose === 'recover' || phase.pose === 'brace') { paint.rect(10, 12, 9, 5, COLORS.veil[1]); paint.rect(15, 15, 5, 2, COLORS.skin[1]); }
  paint.dot(11, 11, COLORS.silver[2]);
}

function phaseFor(animation, frame) {
  if (animation === 'idle') { assert(frame === 0 || frame === 1, `Mist Weaver Idle frame ${frame} is out of range.`); return { name: frame ? 'mantle-settle' : 'veil-breath', idleFrame: frame }; }
  if (animation === 'walk') return WALK_PHASES[frame];
  if (animation === 'attack' || animation === 'cast') return ATTACK_PHASES[frame];
  if (animation === 'hurt') return HURT_PHASES[frame];
  if (animation === 'death') return HURT_PHASES[EN_E06_MIST_WEAVER_DEATH_SOURCE_FRAMES[frame]];
  return null;
}

function buildPixels(direction, animation, frame) {
  const phase = phaseFor(animation, frame);
  assert(phase, `Mist Weaver animation ${animation} frame ${frame} is out of range.`);
  const canonicalDirection = direction === 'left' ? 'right' : direction;
  const source = pixelCanvas();
  renderEnE06SpringDancerFrame(source.context, canonicalDirection, animation, frame);
  let pixels = source.pixels.map((color) => RECOLOR[color] || color);
  const paint = paintFor(pixels, phase.dy || phase.lift || 0);
  if (canonicalDirection === 'right') overlayRight(paint, phase);
  else overlayFront(paint, canonicalDirection === 'up', phase);
  if (phase.flash) pixels = pixels.map((color) => color === null ? null : COLORS.flash);
  if (direction === 'left') {
    const mirrored = new Array(SIZE * SIZE).fill(null);
    for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) mirrored[(y * SIZE) + (SIZE - 1 - x)] = pixels[(y * SIZE) + x];
    pixels = mirrored;
  }
  return { phase, pixels };
}

export function renderEnE06MistWeaverFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Mist Weaver rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), `Unsupported Mist Weaver direction ${direction}.`);
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) { const color = pixels[(y * SIZE) + x]; if (color !== null) { context.fillStyle = color; context.fillRect(x, y, 1, 1); } }
  return Object.freeze({ family: 'nymph', variant: 'mist-weaver', direction, animation, frame, phase: phase.name, mistWeaverGate: EN_E06_MIST_WEAVER_GATE.id, approvedPrecedingGate: EN_E06_SPRING_DANCER_GATE.id, alphaPolicy: EN_E06_MIST_WEAVER_DATA.alphaPolicy, effectBoundary: EN_E06_MIST_WEAVER_DATA.effectBoundary });
}

export const EN_E06_MIST_WEAVER_RENDERER = deepFreeze({
  key: 'en-e06-nymph-mist-weaver-v1', chassis: EN_E06_MIST_WEAVER_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'nymph', 'The EN-E06 Mist Weaver renderer is restricted to Nymph.');
    assert(variant.id === 'mist-weaver', 'The EN-E06 Mist Weaver renderer is restricted to Mist Weaver.');
    return renderEnE06MistWeaverFrame(context, direction, animation.id, frame);
  },
});

const MIST_WEAVER_VARIANT = deepFreeze({ id: 'mist-weaver', name: 'Mist Weaver', role: EN_E06_MIST_WEAVER_CONTRACT.role, status: EN_E06_MIST_WEAVER_CONTRACT.state, brief: 'A complete specialist Nymph candidate with crescent cowl, face veil, layered mantle, connected bell sleeves, woven sash, and a self-contained grounded robe; mist, water arcs, ripples, particles, and detached trails remain external.', rendererData: EN_E06_MIST_WEAVER_DATA });
export const EN_E06_MIST_WEAVER_FAMILY = deepFreeze({
  id: 'nymph', name: 'Nymph Mist Weaver Review', sliceId: 'EN-E06', state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E06_MIST_WEAVER_CONTRACT.chassis, rendererKey: EN_E06_MIST_WEAVER_RENDERER.key,
  variants: [MIST_WEAVER_VARIANT],
  rendererData: { contractCard: EN_E06_NYMPH_CONTRACT_CARD.id, approvedPrecedingGate: EN_E06_SPRING_DANCER_GATE.id, activeGate: EN_E06_MIST_WEAVER_GATE.id },
  review: { baselineVariant: 'mist-weaver', scale: 8, notes: 'Awaiting visual approval for one complete grounded Mist Weaver against public Elf Mage and approved Spring Dancer and Spore Cantor. Keep Rivercrown Muse, registration, fixtures, effects, and later Wave 2 work separate.' },
});
export const EN_E06_MIST_WEAVER_REGISTRY = createEnemyExpansionRegistry({ renderers: [EN_E06_MIST_WEAVER_RENDERER], families: [EN_E06_MIST_WEAVER_FAMILY] });
