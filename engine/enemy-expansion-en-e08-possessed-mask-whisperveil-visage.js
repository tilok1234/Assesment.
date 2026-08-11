import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E08_CROWNVAULT_CASTELLAN_GATE } from './enemy-expansion-en-e08-animated-armor-crownvault-castellan.js';

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
  mask: ['#c8b98e', '#75684f', '#eee1b7'],
  void: ['#2a1b28', '#100d14', '#543147'],
  shroud: ['#4d3b63', '#292338', '#79618c'],
  ribbon: ['#783f55', '#462839', '#aa6075'],
  eye: '#91ead9',
  flash: '#f4f4f4',
});

export const EN_E08_POSSESSED_MASK_CONTRACT_CARD = deepFreeze({
  id: 'en-e08-possessed-mask-v1',
  sliceId: 'EN-E08',
  family: 'possessed-mask',
  familyName: 'Possessed Mask',
  roleOrder: ['common', 'specialist', 'elite'],
  activeVariant: {
    id: 'whisperveil-visage',
    name: 'Whisperveil Visage',
    role: 'common',
    status: 'implemented-full-approved',
  },
  deferredRoles: [
    { role: 'specialist', status: 'planned-unnamed' },
    { role: 'elite', status: 'planned-unnamed' },
  ],
  styleContract: 'Use chunky one-to-three-pixel hard-alpha forms and one deterministic baked 24x24 actor. A broad bone mask with two readable eye sockets, nose ridge, mouth, cheek planes, connected torn shroud, and tether ribbons must read without a host body. All pieces remain connected actor pixels with true hover clearance; no detached mask, child asset, copied humanoid, aura, glow, particles, or projectile.',
  effectBoundary: 'Hosts, detached masks, alternate faces, possession overlays, aura, glow, spectral smoke, loose ribbons, afterimages, projectiles, impact flashes, floor light, and illumination remain external.',
});

export const EN_E08_WHISPERVEIL_VISAGE_CONTRACT = deepFreeze({
  sliceId: 'EN-E08',
  family: 'possessed-mask',
  variant: 'whisperveil-visage',
  role: 'common',
  state: 'implemented-complete-motion-approved',
  chassis: 'broad-bone-visage-twin-void-eyes-nose-ridge-mouth-cheek-planes-connected-torn-shroud-tether-ribbons-hovering-mask-v1',
  silhouette: 'A medium hovering ceremonial mask with a broad brow, tapered jaw, pointed chin, two deep eye sockets, one nose ridge, a readable mouth, asymmetric cheek cracks, connected side ribbons, and a split torn shroud below. It must not read as a Ghost robe, Living Shadow humanoid, Doppelganger face, floating helmet, slime, flame blob, or detached particle cluster.',
  identity: 'Aged bone planes, plum-black voids, violet shroud cloth, wine tether ribbons, and two cold teal eyes establish a self-contained common Possessed Mask. The face and every cloth piece remain one connected baked actor while hosts, detached masks, glow, smoke, possession overlays, projectiles, and illumination stay external.',
  effectBoundary: EN_E08_POSSESSED_MASK_CONTRACT_CARD.effectBoundary,
});

export const EN_E08_WHISPERVEIL_VISAGE_DATA = deepFreeze({
  actor: {
    species: 'possessed-mask',
    bodyBuild: 'medium-hovering-broad-mask-and-torn-shroud',
    skin: 'aged-bone-mask',
    hairStyle: 'connected-torn-shroud-and-tether-ribbons',
    hairColor: 'violet-and-wine',
    expression: 'twin-void-stare-and-carved-mouth',
    faceDetail: 'two-cold-eyes-nose-ridge-mouth-cheek-cracks-and-pointed-chin',
    headgear: 'self-contained-ceremonial-mask',
    outfit: 'connected-violet-shroud',
    outfitColor: 'plum-violet-and-wine',
    outfitTier: 'tier1',
    weapon: 'connected-possession-shriek',
    weaponTier: 'none',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.mask,
      hair: COLORS.ribbon,
      outfit: COLORS.shroud,
    },
  },
  whisperveilVisage: COLORS,
  actorTopology: 'baked-single-actor',
  childAssets: [],
  alphaPolicy: 'binary-single-component-broad-bone-mask-twin-void-eyes-nose-mouth-cheeks-connected-shroud-ribbons-split-tails-and-hover-clearance',
  effectBoundary: 'external-hosts-detached-masks-alternate-faces-possession-overlays-aura-glow-spectral-smoke-loose-ribbons-afterimages-projectiles-impacts-floor-light-and-illumination',
  bakedEffects: [],
});

export const EN_E08_WHISPERVEIL_VISAGE_GATE = deepFreeze({
  id: 'en-e08-possessed-mask-whisperveil-visage-full-v1',
  status: 'approved',
  baseCheckpoint: '42156250f24d03b7e81a29e14cec75c25528cde4',
  authorizedOn: '2026-08-11',
  authorizationEvidence: 'After the published Crownvault Castellan reconciliation at 42156250f24d03b7e81a29e14cec75c25528cde4, the designer abandoned the Headless Rider lane, returned to the clean checkpoint, accepted Possessed Mask as next, and replied: lets go. The content-only architecture uses one deterministic baked 24x24 actor containing the mask, shroud, and tether ribbons with zero child assets. This authorizes only one private common Whisperveil Visage 80-frame art candidate.',
  approvedOn: '2026-08-11',
  approvalEvidence: 'The exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, the public Spectral Ghost, Shadow Slime, and Flame Elemental comparison, and both synchronized GIFs were presented. The three exact frozen PNG paths were open together in responsive Aseprite process 1956. The designer replied: approved. In context this explicitly approves candidate digest c0fac02331632e028b73a21cadd4b472b1bdc18f7d4915b814e9a872dbc0b098 and its five frozen review hashes only. Possessed Mask registration, fixtures, child assets, effects, later roles or families, Living Weapon, EN-E09, release, accepted drift, a pull request, and another art gate remain separate decisions.',
  approvedImplementation: '78f5446c7821bd751c3562d0a18056a64c0e00c6',
  publicationAuthorizedOn: '2026-08-11',
  publicationAuthorizationEvidence: 'The designer said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact artifact or digest. It does not authorize registration, fixtures, effects, later roles or families, release, or any other unopened gate.',
  publishedImplementation: '78f5446c7821bd751c3562d0a18056a64c0e00c6',
  publishedApprovalRecord: 'c27435976f03a4f9263f6f4bbc4b46dc275b19a7',
  initialPublishedHandoff: null,
  publicationState: 'published-awaiting-handoff-reconciliation',
  precedingApproval: {
    gateId: EN_E08_CROWNVAULT_CASTELLAN_GATE.id,
    artifactSha256: EN_E08_CROWNVAULT_CASTELLAN_GATE.artifactSha256,
    assembledArtifactSha256: EN_E08_CROWNVAULT_CASTELLAN_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E08_CROWNVAULT_CASTELLAN_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E08_CROWNVAULT_CASTELLAN_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E08_CROWNVAULT_CASTELLAN_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E08_CROWNVAULT_CASTELLAN_GATE.candidateFrameDigest,
    publishedImplementation: EN_E08_CROWNVAULT_CASTELLAN_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E08_CROWNVAULT_CASTELLAN_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E08_CROWNVAULT_CASTELLAN_GATE.initialPublishedHandoff,
    currentReconciliation: '42156250f24d03b7e81a29e14cec75c25528cde4',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e08-possessed-mask-whisperveil-visage/en-e08-possessed-mask-whisperveil-visage-full-suite-raw.png',
  artifactSha256: 'cd4a375813e0f6ad4a61126dc1858af2913f093abfb61a45b25331af30bb190d',
  assembledArtifact: 'enemy-expansion-review/en-e08-possessed-mask-whisperveil-visage/en-e08-possessed-mask-whisperveil-visage-full-suite-complete-b-form.png',
  assembledArtifactSha256: '5df28a32c0ee8e8dbfc8a349d1898b2dbde6542a4ef9a7f7ba11ee0354e9f88c',
  comparisonArtifact: 'enemy-expansion-review/en-e08-possessed-mask-whisperveil-visage/en-e08-possessed-mask-whisperveil-visage-spectral-comparison.png',
  comparisonArtifactSha256: 'b6e71886fa3750192eea1f67d916f8c042335cc77a368ccc916da8e71c656e17',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e08-possessed-mask-whisperveil-visage/en-e08-possessed-mask-whisperveil-visage-full-suite-four-directions-labeled.gif',
      sha256: 'd4603cc0a5dcc169be3e076b14d69651514a1e2708d6b2aa8bc3d02f62c2e8b0',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e08-possessed-mask-whisperveil-visage/en-e08-possessed-mask-whisperveil-visage-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '4ddf94aa919bd2d4b77a3526c723d186a5f3ee4971784fe0012cfef97ade6245',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
  },
  candidateFrameDigest: 'c0fac02331632e028b73a21cadd4b472b1bdc18f7d4915b814e9a872dbc0b098',
  spectralGhostComparisonDigest: 'f373247db71b7472a8d64248c0e0e8d06eabfacee7e283db0db0a8fd3c305621',
  shadowSlimeComparisonDigest: '04725a8150c31914758c7185f9c9d82c7cc97c666ea306f291d63aba04eccee1',
  flameElementalComparisonDigest: '0df82667d385dbbf4b44c861922b231ffc4b1850ad037fdefc351935f6c9659c',
  crownvaultCastellanPredecessorDigest: EN_E08_CROWNVAULT_CASTELLAN_GATE.candidateFrameDigest,
  scope: 'One complete 80-frame Whisperveil Visage common Possessed Mask across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle tilts the carved visage and breathes the connected shroud. Walk uses four directional hover phases with opposed ribbon and split-tail drift. Attack gathers both connected ribbons, seals the mouth, opens one body-owned possession shriek without a projectile, and settles the face. Hurt uses a complete white recoil and a colored folded-shroud brace that preserves the eye sockets, nose ridge, mouth, chin, ribbons, and split tails. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and a public Spectral Ghost, Shadow Slime, and Flame Elemental silhouette comparison together.',
  exclusions: [
    'changes to approved Crownvault Castellan rendered pixels',
    'changes to approved Runeforge Custodian or Hollow Sentry rendered pixels',
    'public Possessed Mask registration',
    'public catalog exposure',
    'asset-pack fixture generation or regeneration',
    'new Cast pixels',
    'new Death pixels',
    'aura',
    'bloom',
    'glow',
    'detached masks',
    'host bodies',
    'loose ribbons',
    'spectral smoke',
    'afterimages',
    'trails',
    'light pools',
    'projectiles',
    'impact flashes',
    'illumination',
    'effects',
    'Possessed Mask specialist or elite',
    'Living Weapon',
    'EN-E09 and later work',
    'release',
    'accepted drift',
  ],
  nextGate: 'The exact Whisperveil Visage implementation 78f5446c7821bd751c3562d0a18056a64c0e00c6 and approval record c27435976f03a4f9263f6f4bbc4b46dc275b19a7 are remote verified. Only the initial published handoff and final reconciliation remain open under standing publication permission. Possessed Mask registration, fixtures, child assets, effects, later roles or families, Living Weapon, EN-E09, release, accepted drift, and a pull request remain closed; another art gate requires a separate designer lets do next from the clean published reconciliation.',
});

export const EN_E08_WHISPERVEIL_VISAGE_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const WALK_PHASES = deepFreeze([
  { name: 'left-ribbon-hover', pose: 'walk', bob: 0, drift: -1, flare: 0, tilt: 1 },
  { name: 'high-visage-pass', pose: 'walk', bob: -1, drift: 0, flare: 1, tilt: -1 },
  { name: 'right-ribbon-hover', pose: 'walk', bob: 0, drift: 1, flare: 0, tilt: -1 },
  { name: 'low-shroud-settle', pose: 'walk', bob: 1, drift: 0, flare: 0, tilt: 1 },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'paired-ribbon-gather', pose: 'gather', bob: 0, drift: 0, flare: 0, tilt: 0 },
  { name: 'carved-mouth-seal', pose: 'seal', bob: -1, drift: 0, flare: 0, tilt: 1 },
  { name: 'body-owned-possession-shriek', pose: 'shriek', bob: 0, drift: 0, flare: 1, tilt: -1 },
  { name: 'whisperveil-settle', pose: 'recover', bob: 1, drift: 0, flare: 0, tilt: 0 },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-visage-recoil', pose: 'hurt', bob: 0, drift: -1, flare: 0, tilt: -1, flash: true },
  { name: 'colored-folded-shroud-brace', pose: 'brace', bob: 1, drift: 0, flare: 0, tilt: 1, flash: false },
]);

function phaseFor(animation, frame) {
  if (animation === 'idle') {
    assert(frame === 0 || frame === 1, 'Whisperveil Visage Idle frame ' + frame + ' is out of range.');
    return frame === 0
      ? { name: 'twin-void-vigil', pose: 'idle', bob: 0, drift: 0, flare: 0, tilt: -1 }
      : { name: 'torn-shroud-breath', pose: 'idle', bob: 1, drift: 0, flare: 1, tilt: 1 };
  }
  if (animation === 'walk') return WALK_PHASES[frame];
  if (animation === 'attack' || animation === 'cast') return ATTACK_PHASES[frame];
  if (animation === 'hurt') return HURT_PHASES[frame];
  if (animation === 'death') return HURT_PHASES[EN_E08_WHISPERVEIL_VISAGE_DEATH_SOURCE_FRAMES[frame]];
  return null;
}

function createPixels() {
  return new Array(SIZE * SIZE).fill(null);
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert([x, y, width, height].every(Number.isInteger) && width > 0 && height > 0, 'Whisperveil Visage rectangles must use positive integer geometry.');
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Whisperveil Visage authored pixels must remain inside the 24x24 cell.');
      pixels[(py * SIZE) + px] = fill;
    }
  };
  return {
    rect,
    dot(x, y, fill) { rect(x, y, 1, 1, fill); },
  };
}

function drawFront(paint, rear, phase) {
  const y = phase.bob || 0;
  const x = phase.drift || 0;
  const flare = Math.max(phase.flare || 0, 0);
  const tilt = phase.tilt || 0;

  // Connected shroud and tether ribbons form the body behind the face.
  paint.rect(7 + x, 8 + y, 11, 9, COLORS.shroud[0]);
  paint.rect(5 + x - flare, 10 + y, 4 + flare, 5, COLORS.shroud[1]);
  paint.rect(17 + x, 10 + y, 3 + flare, 5, COLORS.shroud[0]);
  paint.rect(4 + x - flare, 11 + y, 3 + flare, 2, COLORS.ribbon[0]);
  paint.rect(19 + x, 11 + y, 2 + flare, 2, COLORS.ribbon[1]);
  paint.rect(7 + x, 15 + y, 5, 4, COLORS.shroud[1]);
  paint.rect(13 + x, 15 + y, 5, 4, COLORS.shroud[0]);
  paint.rect(6 + x - flare, 18 + y, 4, 2, COLORS.ribbon[1]);
  paint.rect(15 + x + flare, 18 + y, 4, 2, COLORS.ribbon[0]);
  paint.dot(7 + x - flare, 20 + y, COLORS.ribbon[2]);
  paint.dot(18 + x + flare, 20 + y, COLORS.shroud[2]);

  // Broad tapered mask remains the dominant readable face.
  paint.rect(9 + x + Math.max(tilt, 0), 4 + y, 7, 1, COLORS.mask[1]);
  paint.rect(7 + x, 5 + y, 11, 2, COLORS.mask[0]);
  paint.rect(6 + x, 7 + y, 13, 4, COLORS.mask[0]);
  paint.rect(7 + x, 11 + y, 11, 3, COLORS.mask[0]);
  paint.rect(9 + x, 14 + y, 7, 2, COLORS.mask[1]);
  paint.rect(11 + x, 16 + y, 3, 1, COLORS.mask[1]);
  paint.rect(8 + x, 6 + y, 4, 1, COLORS.mask[2]);
  paint.rect(14 + x, 6 + y, 3, 1, COLORS.mask[2]);

  if (rear) {
    paint.rect(8 + x, 8 + y, 9, 3, COLORS.mask[1]);
    paint.rect(10 + x, 10 + y, 5, 4, COLORS.shroud[1]);
    paint.rect(11 + x, 11 + y, 3, 2, COLORS.ribbon[2]);
  } else {
    paint.rect(8 + x, 8 + y, 3, 2, COLORS.void[1]);
    paint.rect(14 + x, 8 + y, 3, 2, COLORS.void[1]);
    paint.dot(9 + x, 8 + y, COLORS.eye);
    paint.dot(15 + x, 8 + y, COLORS.eye);
    paint.rect(11 + x, 9 + y, 3, 3, COLORS.mask[2]);
    paint.dot(12 + x, 12 + y, COLORS.mask[1]);
    paint.rect(10 + x, 13 + y, 5, phase.pose === 'shriek' ? 3 : 1, COLORS.void[0]);
    paint.dot(7 + x, 11 + y, COLORS.void[2]);
    paint.dot(17 + x, 12 + y, COLORS.void[2]);
  }

  if (phase.pose === 'gather') {
    paint.rect(6 + x, 12 + y, 4, 2, COLORS.ribbon[2]);
    paint.rect(15 + x, 12 + y, 4, 2, COLORS.ribbon[2]);
  } else if (phase.pose === 'seal' && !rear) {
    paint.rect(10 + x, 13 + y, 5, 1, COLORS.mask[1]);
    paint.dot(12 + x, 13 + y, COLORS.void[1]);
  } else if (phase.pose === 'recover' || phase.pose === 'brace') {
    paint.rect(7 + x, 14 + y, 4, 3, COLORS.shroud[1]);
    paint.rect(14 + x, 14 + y, 4, 3, COLORS.shroud[0]);
  }
}

function drawRight(paint, phase) {
  const y = phase.bob || 0;
  const x = phase.drift || 0;
  const flare = Math.max(phase.flare || 0, 0);
  const tilt = phase.tilt || 0;

  paint.rect(5 + x - flare, 9 + y, 10 + flare, 8, COLORS.shroud[0]);
  paint.rect(4 + x - flare, 11 + y, 4, 3, COLORS.ribbon[1]);
  paint.rect(6 + x, 15 + y, 5, 4, COLORS.shroud[1]);
  paint.rect(11 + x, 15 + y, 5, 4, COLORS.shroud[0]);
  paint.rect(5 + x - flare, 18 + y, 4, 2, COLORS.ribbon[0]);
  paint.rect(13 + x + flare, 18 + y, 4, 2, COLORS.ribbon[1]);
  paint.dot(6 + x - flare, 20 + y, COLORS.ribbon[2]);
  paint.dot(16 + x + flare, 20 + y, COLORS.shroud[2]);

  paint.rect(11 + x + Math.max(tilt, 0), 4 + y, 5, 1, COLORS.mask[1]);
  paint.rect(9 + x, 5 + y, 8, 2, COLORS.mask[0]);
  paint.rect(8 + x, 7 + y, 10, 5, COLORS.mask[0]);
  paint.rect(9 + x, 12 + y, 9, 3, COLORS.mask[0]);
  paint.rect(11 + x, 15 + y, 6, 2, COLORS.mask[1]);
  paint.rect(16 + x, 8 + y, 3, 4, COLORS.mask[2]);
  paint.rect(18 + x, 10 + y, 2, 2, COLORS.mask[1]);
  paint.rect(13 + x, 8 + y, 3, 2, COLORS.void[1]);
  paint.dot(15 + x, 8 + y, COLORS.eye);
  paint.rect(16 + x, 13 + y, phase.pose === 'shriek' ? 3 : 2, phase.pose === 'shriek' ? 3 : 1, COLORS.void[0]);
  paint.dot(10 + x, 10 + y, COLORS.void[2]);

  if (phase.pose === 'gather') {
    paint.rect(7 + x, 12 + y, 5, 2, COLORS.ribbon[2]);
  } else if (phase.pose === 'seal') {
    paint.rect(16 + x, 13 + y, 2, 1, COLORS.mask[1]);
  } else if (phase.pose === 'recover' || phase.pose === 'brace') {
    paint.rect(8 + x, 14 + y, 4, 3, COLORS.shroud[1]);
  }
}

function mirrorPixels(pixels) {
  const result = new Array(SIZE * SIZE).fill(null);
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    result[(y * SIZE) + (SIZE - 1 - x)] = pixels[(y * SIZE) + x];
  }
  return result;
}

function buildPixels(direction, animation, frame) {
  const phase = phaseFor(animation, frame);
  assert(phase, 'Whisperveil Visage animation ' + animation + ' frame ' + frame + ' is out of range.');
  const canonicalDirection = direction === 'left' ? 'right' : direction;
  let pixels = createPixels();
  const paint = painter(pixels);
  if (canonicalDirection === 'right') drawRight(paint, phase);
  else drawFront(paint, canonicalDirection === 'up', phase);
  if (phase.flash) pixels = pixels.map((color) => color ? COLORS.flash : null);
  if (direction === 'left') pixels = mirrorPixels(pixels);
  return Object.freeze({ phase, pixels: Object.freeze(pixels) });
}

function paintPixels(context, pixels) {
  for (let index = 0; index < pixels.length; index++) {
    const fill = pixels[index];
    if (!fill) continue;
    context.fillStyle = fill;
    context.fillRect(index % SIZE, Math.floor(index / SIZE), 1, 1);
  }
}

export function renderEnE08WhisperveilVisageFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Whisperveil Visage rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Whisperveil Visage direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'possessed-mask',
    variant: 'whisperveil-visage',
    direction,
    animation,
    frame,
    phase: phase.name,
    whisperveilVisageGate: EN_E08_WHISPERVEIL_VISAGE_GATE.id,
    actorTopology: EN_E08_WHISPERVEIL_VISAGE_DATA.actorTopology,
    childAssetCount: EN_E08_WHISPERVEIL_VISAGE_DATA.childAssets.length,
    approvedPrecedingGate: EN_E08_CROWNVAULT_CASTELLAN_GATE.id,
    alphaPolicy: EN_E08_WHISPERVEIL_VISAGE_DATA.alphaPolicy,
    effectBoundary: EN_E08_WHISPERVEIL_VISAGE_DATA.effectBoundary,
  });
}

export const EN_E08_WHISPERVEIL_VISAGE_RENDERER = deepFreeze({
  key: 'en-e08-possessed-mask-whisperveil-visage-v1',
  chassis: EN_E08_WHISPERVEIL_VISAGE_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'possessed-mask', 'The EN-E08 Whisperveil Visage renderer is restricted to Possessed Mask.');
    assert(variant.id === 'whisperveil-visage', 'The EN-E08 Whisperveil Visage renderer is restricted to Whisperveil Visage.');
    return renderEnE08WhisperveilVisageFrame(context, direction, animation.id, frame);
  },
});

const WHISPERVEIL_VISAGE_VARIANT = deepFreeze({
  id: 'whisperveil-visage',
  name: 'Whisperveil Visage',
  role: EN_E08_WHISPERVEIL_VISAGE_CONTRACT.role,
  status: EN_E08_WHISPERVEIL_VISAGE_CONTRACT.state,
  brief: 'A private complete common Possessed Mask with a broad readable bone visage, two cold eyes, nose ridge, mouth, cheek cracks, connected torn shroud, tether ribbons, split tails, and true hover clearance; hosts, detached masks, possession overlays, glow, smoke, loose ribbons, projectiles, illumination, and impacts remain external.',
  rendererData: EN_E08_WHISPERVEIL_VISAGE_DATA,
});

export const EN_E08_WHISPERVEIL_VISAGE_FAMILY = deepFreeze({
  id: 'possessed-mask',
  name: 'Possessed Mask Whisperveil Visage Review',
  sliceId: 'EN-E08',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E08_WHISPERVEIL_VISAGE_CONTRACT.chassis,
  rendererKey: EN_E08_WHISPERVEIL_VISAGE_RENDERER.key,
  variants: [WHISPERVEIL_VISAGE_VARIANT],
  rendererData: {
    contractCard: EN_E08_POSSESSED_MASK_CONTRACT_CARD.id,
    approvedPrecedingGate: EN_E08_CROWNVAULT_CASTELLAN_GATE.id,
    activeGate: EN_E08_WHISPERVEIL_VISAGE_GATE.id,
  },
  review: {
    baselineVariant: 'whisperveil-visage',
    scale: 8,
    notes: 'Awaiting visual review as one connected baked hovering Whisperveil Visage against public Spectral Ghost, Shadow Slime, and Flame Elemental. Keep registration, fixtures, child assets, effects, later roles, Living Weapon, and EN-E09 separate.',
  },
});

export const EN_E08_WHISPERVEIL_VISAGE_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E08_WHISPERVEIL_VISAGE_RENDERER],
  families: [EN_E08_WHISPERVEIL_VISAGE_FAMILY],
});
