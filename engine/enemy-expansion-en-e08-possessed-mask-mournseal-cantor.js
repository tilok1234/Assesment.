import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E08_WHISPERVEIL_VISAGE_GATE } from './enemy-expansion-en-e08-possessed-mask-whisperveil-visage.js';

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
  mask: ['#d2c5a0', '#766855', '#f2e7c5'],
  void: ['#231b2b', '#0d0b12', '#5a3656'],
  shroud: ['#394c61', '#202b39', '#66809a'],
  ribbon: ['#a36a42', '#5f3a2d', '#d49a60'],
  eye: '#f4c96b',
  flash: '#f4f4f4',
});

export const EN_E08_POSSESSED_MASK_CONTRACT_CARD = deepFreeze({
  id: 'en-e08-possessed-mask-v1',
  sliceId: 'EN-E08',
  family: 'possessed-mask',
  familyName: 'Possessed Mask',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingVariant: {
    id: 'whisperveil-visage',
    name: 'Whisperveil Visage',
    role: 'common',
    status: 'approved-published',
  },
  activeVariant: {
    id: 'mournseal-cantor',
    name: 'Mournseal Cantor',
    role: 'specialist',
    status: 'implemented-full-approved',
  },
  deferredRoles: [{ role: 'elite', status: 'planned-unnamed' }],
  styleContract: 'Use chunky one-to-three-pixel hard-alpha forms and one deterministic baked 24x24 actor. A broad bone mask with two readable eye sockets, nose ridge, mouth, cheek planes, connected torn shroud, and tether ribbons must read without a host body. All pieces remain connected actor pixels with true hover clearance; no detached mask, child asset, copied humanoid, aura, glow, particles, or projectile.',
  effectBoundary: 'Hosts, detached masks, alternate faces, possession overlays, aura, glow, spectral smoke, loose ribbons, afterimages, projectiles, impact flashes, floor light, and illumination remain external.',
});

export const EN_E08_MOURNSEAL_CANTOR_CONTRACT = deepFreeze({
  sliceId: 'EN-E08',
  family: 'possessed-mask',
  variant: 'mournseal-cantor',
  role: 'specialist',
  state: 'implemented-complete-motion-approved',
  chassis: 'tall-ritual-visage-stepped-brow-twin-amber-eyes-tear-channels-nose-ridge-oval-cantor-mouth-connected-fan-shroud-braided-cords-hovering-mask-v1',
  silhouette: 'A tall hovering ritual mask with a stepped brow, long tapered jaw, two deep eye sockets, paired tear channels, one nose ridge, a readable oval cantor mouth, connected side cords, and a broad fan-shaped shroud. It must remain visibly related to Whisperveil Visage without copying its broad short face, split tails, violet palette, or shriek pose, and must not read as a Ghost robe, Living Shadow humanoid, Doppelganger face, floating helmet, slime, flame blob, or detached particle cluster.',
  identity: 'Pale ash-bone planes, ink-violet voids, storm-blue fan cloth, ochre braided cords, and two warm amber eyes establish a ritual-cantor specialist. The taller face, tear channels, oval mouth, and fan shroud remain one connected baked actor while hosts, detached masks, sound rings, glow, smoke, possession overlays, projectiles, and illumination stay external.',
  effectBoundary: EN_E08_POSSESSED_MASK_CONTRACT_CARD.effectBoundary,
});

export const EN_E08_MOURNSEAL_CANTOR_DATA = deepFreeze({
  actor: {
    species: 'possessed-mask',
    bodyBuild: 'tall-hovering-ritual-mask-and-fan-shroud',
    skin: 'ash-bone-ritual-mask',
    hairStyle: 'connected-fan-shroud-and-braided-cords',
    hairColor: 'storm-blue-and-ochre',
    expression: 'twin-amber-vigil-and-oval-cantor-mouth',
    faceDetail: 'two-amber-eyes-tear-channels-nose-ridge-oval-mouth-and-long-chin',
    headgear: 'self-contained-mournseal-mask',
    outfit: 'connected-storm-blue-fan-shroud',
    outfitColor: 'storm-blue-ink-and-ochre',
    outfitTier: 'tier2',
    weapon: 'body-owned-binding-canticle',
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
  mournsealCantor: COLORS,
  actorTopology: 'baked-single-actor',
  childAssets: [],
  alphaPolicy: 'binary-single-component-tall-ritual-mask-twin-amber-eyes-tear-channels-nose-oval-mouth-connected-fan-shroud-braided-cords-and-hover-clearance',
  effectBoundary: 'external-hosts-detached-masks-alternate-faces-possession-overlays-aura-glow-spectral-smoke-sound-rings-loose-cords-afterimages-projectiles-impacts-floor-light-and-illumination',
  bakedEffects: [],
});

export const EN_E08_MOURNSEAL_CANTOR_GATE = deepFreeze({
  id: 'en-e08-possessed-mask-mournseal-cantor-full-v1',
  status: 'approved',
  baseCheckpoint: '2ab49dc879a852d8a3c1a5f14de93345b32d490a',
  authorizedOn: '2026-08-11',
  authorizationEvidence: 'After the exact Whisperveil Visage publication tuple was reconciled at clean remote-verified checkpoint 2ab49dc879a852d8a3c1a5f14de93345b32d490a, the designer replied: lets do next. Whisperveil Visage completed the common role, so the one-complete-sprite cadence authorizes only one private specialist Possessed Mask Mournseal Cantor 80-frame art candidate. Registration, fixtures, effects, the elite role, Living Weapon, EN-E09, release, and a pull request remain closed.',
  approvedOn: '2026-08-11',
  approvalEvidence: 'The exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, the approved Whisperveil Visage plus public Spectral Ghost and Flame Elemental comparison, and both synchronized GIFs were presented. The three exact frozen PNG paths were open together in responsive Aseprite process 3228. The designer replied: approved lets do next. In context this explicitly approves candidate digest 5f54d5f716a11e42e813c7f09c1031d7090b1ac51a9cd93f93f6e0df08ac4e55 and its five frozen review hashes only. The same reply may open only one private elite Possessed Mask art gate after clean publication reconciliation. Registration, fixtures, child assets, effects, Living Weapon, EN-E09, release, accepted drift, a pull request, and any broader gate remain separate decisions.',
  approvedImplementation: 'b1fd09ab0b04128330178a99c0379783621e478f',
  publicationAuthorizedOn: '2026-08-11',
  publicationAuthorizationEvidence: 'The designer said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact artifact or digest. It does not authorize registration, fixtures, effects, later roles or families, release, or any other unopened gate.',
  publishedImplementation: 'b1fd09ab0b04128330178a99c0379783621e478f',
  publishedApprovalRecord: 'ae364550cf2ecfece032098800b2c1df018ee2a5',
  initialPublishedHandoff: '0309590d9d025e8cdfa960131a3d7835730c3f7b',
  publicationState: 'published',
  precedingApproval: {
    gateId: EN_E08_WHISPERVEIL_VISAGE_GATE.id,
    artifactSha256: EN_E08_WHISPERVEIL_VISAGE_GATE.artifactSha256,
    assembledArtifactSha256: EN_E08_WHISPERVEIL_VISAGE_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E08_WHISPERVEIL_VISAGE_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E08_WHISPERVEIL_VISAGE_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E08_WHISPERVEIL_VISAGE_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E08_WHISPERVEIL_VISAGE_GATE.candidateFrameDigest,
    publishedImplementation: EN_E08_WHISPERVEIL_VISAGE_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E08_WHISPERVEIL_VISAGE_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E08_WHISPERVEIL_VISAGE_GATE.initialPublishedHandoff,
    currentReconciliation: '2ab49dc879a852d8a3c1a5f14de93345b32d490a',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e08-possessed-mask-mournseal-cantor/en-e08-possessed-mask-mournseal-cantor-full-suite-raw.png',
  artifactSha256: '475142168aa09e65d89509243be69b2fcae8bb570cb9dcb03a972051859ccfc4',
  assembledArtifact: 'enemy-expansion-review/en-e08-possessed-mask-mournseal-cantor/en-e08-possessed-mask-mournseal-cantor-full-suite-complete-b-form.png',
  assembledArtifactSha256: '08307dc01d116070cc3cb39a17c48493afafaeffe26486819f94c8a1a48361bc',
  comparisonArtifact: 'enemy-expansion-review/en-e08-possessed-mask-mournseal-cantor/en-e08-possessed-mask-mournseal-cantor-spectral-comparison.png',
  comparisonArtifactSha256: '81014badb7da35d1b779b0364fca07e59465a5c72b61e00dbdb64e5ee2d31835',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e08-possessed-mask-mournseal-cantor/en-e08-possessed-mask-mournseal-cantor-full-suite-four-directions-labeled.gif',
      sha256: '16002a90220fd12a5403de46dbef67b26365aac63bb0f3d0534e557db4f93e9e',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e08-possessed-mask-mournseal-cantor/en-e08-possessed-mask-mournseal-cantor-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: 'ed7797d9ef900d90c27335b7ff3c254cb9dbbdcab65db3fed5a8e177b8035a39',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
  },
  candidateFrameDigest: '5f54d5f716a11e42e813c7f09c1031d7090b1ac51a9cd93f93f6e0df08ac4e55',
  whisperveilVisageComparisonDigest: EN_E08_WHISPERVEIL_VISAGE_GATE.candidateFrameDigest,
  spectralGhostComparisonDigest: 'f373247db71b7472a8d64248c0e0e8d06eabfacee7e283db0db0a8fd3c305621',
  shadowSlimeComparisonDigest: '04725a8150c31914758c7185f9c9d82c7cc97c666ea306f291d63aba04eccee1',
  flameElementalComparisonDigest: '0df82667d385dbbf4b44c861922b231ffc4b1850ad037fdefc351935f6c9659c',
  scope: 'One complete 80-frame Mournseal Cantor specialist Possessed Mask across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle seats the long mask and breathes the connected fan shroud. Walk uses four directional hover phases with opposed braided-cord and fan drift. Attack gathers both connected cords, closes the oval mouth, opens one body-owned binding canticle without a sound ring or projectile, and settles. Hurt uses a complete white recoil and a colored folded-fan brace that preserves the eye sockets, tear channels, nose ridge, oval mouth, long chin, cords, and fan silhouette. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and approved Whisperveil Visage plus public Spectral Ghost and Flame Elemental silhouette comparisons together.',
  exclusions: [
    'changes to approved Whisperveil Visage rendered pixels',
    'changes to approved Animated Armor rendered pixels',
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
    'Possessed Mask elite',
    'Living Weapon',
    'EN-E09 and later work',
    'release',
    'accepted drift',
  ],
  nextGate: 'The exact Mournseal Cantor implementation b1fd09ab0b04128330178a99c0379783621e478f, approval record ae364550cf2ecfece032098800b2c1df018ee2a5, and initial published handoff 0309590d9d025e8cdfa960131a3d7835730c3f7b are remote verified; this reconciliation completes the bounded publication tuple. The same approved lets do next reply opens exactly one private elite Possessed Mask art gate from this clean published reconciliation. Registration, fixtures, child assets, effects, Living Weapon, EN-E09, release, accepted drift, and a pull request remain closed.',
});

export const EN_E08_MOURNSEAL_CANTOR_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const WALK_PHASES = deepFreeze([
  { name: 'left-ribbon-hover', pose: 'walk', bob: 0, drift: -1, flare: 0, tilt: 1 },
  { name: 'high-visage-pass', pose: 'walk', bob: -1, drift: 0, flare: 1, tilt: -1 },
  { name: 'right-ribbon-hover', pose: 'walk', bob: 0, drift: 1, flare: 0, tilt: -1 },
  { name: 'low-shroud-settle', pose: 'walk', bob: 1, drift: 0, flare: 0, tilt: 1 },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'braided-cord-gather', pose: 'gather', bob: 0, drift: 0, flare: 0, tilt: 0 },
  { name: 'oval-mouth-seal', pose: 'seal', bob: -1, drift: 0, flare: 0, tilt: 1 },
  { name: 'body-owned-binding-canticle', pose: 'canticle', bob: 0, drift: 0, flare: 1, tilt: -1 },
  { name: 'mournseal-settle', pose: 'recover', bob: 1, drift: 0, flare: 0, tilt: 0 },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-visage-recoil', pose: 'hurt', bob: 0, drift: -1, flare: 0, tilt: -1, flash: true },
  { name: 'colored-folded-shroud-brace', pose: 'brace', bob: 1, drift: 0, flare: 0, tilt: 1, flash: false },
]);

function phaseFor(animation, frame) {
  if (animation === 'idle') {
    assert(frame === 0 || frame === 1, 'Mournseal Cantor Idle frame ' + frame + ' is out of range.');
    return frame === 0
      ? { name: 'twin-amber-vigil', pose: 'idle', bob: 0, drift: 0, flare: 0, tilt: -1 }
      : { name: 'fan-shroud-breath', pose: 'idle', bob: 1, drift: 0, flare: 1, tilt: 1 };
  }
  if (animation === 'walk') return WALK_PHASES[frame];
  if (animation === 'attack' || animation === 'cast') return ATTACK_PHASES[frame];
  if (animation === 'hurt') return HURT_PHASES[frame];
  if (animation === 'death') return HURT_PHASES[EN_E08_MOURNSEAL_CANTOR_DEATH_SOURCE_FRAMES[frame]];
  return null;
}

function createPixels() {
  return new Array(SIZE * SIZE).fill(null);
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert([x, y, width, height].every(Number.isInteger) && width > 0 && height > 0, 'Mournseal Cantor rectangles must use positive integer geometry.');
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Mournseal Cantor authored pixels must remain inside the 24x24 cell.');
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

  // A connected storm-blue fan and ochre cords form the body behind the face.
  paint.rect(6 + x, 8 + y, 13, 9, COLORS.shroud[0]);
  paint.rect(4 + x - flare, 10 + y, 4 + flare, 6, COLORS.shroud[1]);
  paint.rect(18 + x, 10 + y, 3 + flare, 6, COLORS.shroud[0]);
  paint.rect(5 + x - flare, 9 + y, 3 + flare, 2, COLORS.shroud[2]);
  paint.rect(18 + x, 9 + y, 2 + flare, 2, COLORS.shroud[2]);
  paint.rect(4 + x - flare, 12 + y, 3 + flare, 2, COLORS.ribbon[0]);
  paint.rect(19 + x, 12 + y, 2 + flare, 2, COLORS.ribbon[1]);
  paint.rect(6 + x, 16 + y, 6, 3, COLORS.shroud[1]);
  paint.rect(13 + x, 16 + y, 6, 3, COLORS.shroud[0]);
  paint.rect(7 + x - flare, 18 + y, 3, 2, COLORS.ribbon[1]);
  paint.rect(16 + x + flare, 18 + y, 3, 2, COLORS.ribbon[0]);
  paint.dot(7 + x - flare, 20 + y, COLORS.ribbon[2]);
  paint.dot(18 + x + flare, 20 + y, COLORS.ribbon[2]);

  // The taller stepped ritual mask carries readable eyes, tears, nose, and mouth.
  paint.rect(10 + x + Math.max(tilt, 0), 3 + y, 6, 1, COLORS.mask[1]);
  paint.rect(8 + x, 4 + y, 10, 2, COLORS.mask[0]);
  paint.rect(7 + x, 6 + y, 12, 4, COLORS.mask[0]);
  paint.rect(8 + x, 10 + y, 10, 4, COLORS.mask[0]);
  paint.rect(9 + x, 14 + y, 8, 3, COLORS.mask[0]);
  paint.rect(10 + x, 17 + y, 6, 1, COLORS.mask[1]);
  paint.rect(11 + x, 18 + y, 4, 1, COLORS.mask[1]);
  paint.rect(9 + x, 5 + y, 3, 1, COLORS.mask[2]);
  paint.rect(14 + x, 5 + y, 3, 1, COLORS.mask[2]);

  if (rear) {
    paint.rect(8 + x, 7 + y, 10, 4, COLORS.mask[1]);
    paint.rect(10 + x, 10 + y, 6, 5, COLORS.shroud[1]);
    paint.rect(11 + x, 11 + y, 4, 3, COLORS.ribbon[2]);
  } else {
    paint.rect(8 + x, 7 + y, 4, 2, COLORS.void[1]);
    paint.rect(14 + x, 7 + y, 4, 2, COLORS.void[1]);
    paint.dot(10 + x, 7 + y, COLORS.eye);
    paint.dot(15 + x, 7 + y, COLORS.eye);
    paint.rect(9 + x, 9 + y, 2, 4, COLORS.void[2]);
    paint.rect(15 + x, 9 + y, 2, 4, COLORS.void[2]);
    paint.rect(12 + x, 8 + y, 2, 5, COLORS.mask[2]);
    paint.dot(13 + x, 12 + y, COLORS.mask[1]);
    paint.rect(11 + x, 13 + y, 4, phase.pose === 'canticle' ? 4 : 3, COLORS.void[0]);
    paint.dot(11 + x, 13 + y, COLORS.mask[0]);
    paint.dot(14 + x, 13 + y, COLORS.mask[0]);
    paint.dot(11 + x, 15 + y, COLORS.mask[0]);
    paint.dot(14 + x, 15 + y, COLORS.mask[0]);
  }

  if (phase.pose === 'gather') {
    paint.rect(6 + x, 12 + y, 4, 2, COLORS.ribbon[2]);
    paint.rect(16 + x, 12 + y, 4, 2, COLORS.ribbon[2]);
  } else if (phase.pose === 'seal' && !rear) {
    paint.rect(11 + x, 13 + y, 4, 3, COLORS.mask[1]);
    paint.rect(12 + x, 14 + y, 2, 1, COLORS.void[1]);
  } else if (phase.pose === 'recover' || phase.pose === 'brace') {
    paint.rect(6 + x, 13 + y, 5, 4, COLORS.shroud[1]);
    paint.rect(15 + x, 13 + y, 5, 4, COLORS.shroud[0]);
  }
}

function drawRight(paint, phase) {
  const y = phase.bob || 0;
  const x = phase.drift || 0;
  const flare = Math.max(phase.flare || 0, 0);
  const tilt = phase.tilt || 0;

  paint.rect(4 + x - flare, 8 + y, 12 + flare, 10, COLORS.shroud[0]);
  paint.rect(3 + x - flare, 10 + y, 4 + flare, 6, COLORS.shroud[1]);
  paint.rect(4 + x - flare, 9 + y, 4 + flare, 2, COLORS.shroud[2]);
  paint.rect(3 + x - flare, 12 + y, 4, 2, COLORS.ribbon[1]);
  paint.rect(5 + x, 17 + y, 5, 2, COLORS.shroud[1]);
  paint.rect(10 + x, 17 + y, 6, 2, COLORS.shroud[0]);
  paint.rect(5 + x - flare, 18 + y, 3, 2, COLORS.ribbon[0]);
  paint.rect(14 + x + flare, 18 + y, 3, 2, COLORS.ribbon[1]);
  paint.dot(5 + x - flare, 20 + y, COLORS.ribbon[2]);
  paint.dot(16 + x + flare, 20 + y, COLORS.ribbon[2]);

  paint.rect(12 + x + Math.max(tilt, 0), 3 + y, 5, 1, COLORS.mask[1]);
  paint.rect(10 + x, 4 + y, 8, 2, COLORS.mask[0]);
  paint.rect(9 + x, 6 + y, 10, 5, COLORS.mask[0]);
  paint.rect(10 + x, 11 + y, 9, 4, COLORS.mask[0]);
  paint.rect(11 + x, 15 + y, 7, 3, COLORS.mask[0]);
  paint.rect(12 + x, 18 + y, 5, 1, COLORS.mask[1]);
  paint.rect(17 + x, 8 + y, 3, 4, COLORS.mask[2]);
  paint.rect(19 + x, 10 + y, 2, 2, COLORS.mask[1]);
  paint.rect(14 + x, 7 + y, 4, 2, COLORS.void[1]);
  paint.dot(16 + x, 7 + y, COLORS.eye);
  paint.rect(15 + x, 9 + y, 2, 4, COLORS.void[2]);
  paint.rect(18 + x, 13 + y, phase.pose === 'canticle' ? 3 : 2, phase.pose === 'canticle' ? 4 : 3, COLORS.void[0]);
  paint.dot(18 + x, 13 + y, COLORS.mask[0]);
  paint.dot(18 + x, 15 + y, COLORS.mask[0]);

  if (phase.pose === 'gather') {
    paint.rect(6 + x, 12 + y, 6, 2, COLORS.ribbon[2]);
  } else if (phase.pose === 'seal') {
    paint.rect(18 + x, 13 + y, 2, 3, COLORS.mask[1]);
    paint.dot(19 + x, 14 + y, COLORS.void[1]);
  } else if (phase.pose === 'recover' || phase.pose === 'brace') {
    paint.rect(6 + x, 13 + y, 6, 4, COLORS.shroud[1]);
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
  assert(phase, 'Mournseal Cantor animation ' + animation + ' frame ' + frame + ' is out of range.');
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

export function renderEnE08MournsealCantorFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Mournseal Cantor rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Mournseal Cantor direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'possessed-mask',
    variant: 'mournseal-cantor',
    direction,
    animation,
    frame,
    phase: phase.name,
    mournsealCantorGate: EN_E08_MOURNSEAL_CANTOR_GATE.id,
    actorTopology: EN_E08_MOURNSEAL_CANTOR_DATA.actorTopology,
    childAssetCount: EN_E08_MOURNSEAL_CANTOR_DATA.childAssets.length,
    approvedPrecedingGate: EN_E08_WHISPERVEIL_VISAGE_GATE.id,
    alphaPolicy: EN_E08_MOURNSEAL_CANTOR_DATA.alphaPolicy,
    effectBoundary: EN_E08_MOURNSEAL_CANTOR_DATA.effectBoundary,
  });
}

export const EN_E08_MOURNSEAL_CANTOR_RENDERER = deepFreeze({
  key: 'en-e08-possessed-mask-mournseal-cantor-v1',
  chassis: EN_E08_MOURNSEAL_CANTOR_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'possessed-mask', 'The EN-E08 Mournseal Cantor renderer is restricted to Possessed Mask.');
    assert(variant.id === 'mournseal-cantor', 'The EN-E08 Mournseal Cantor renderer is restricted to Mournseal Cantor.');
    return renderEnE08MournsealCantorFrame(context, direction, animation.id, frame);
  },
});

const MOURNSEAL_CANTOR_VARIANT = deepFreeze({
  id: 'mournseal-cantor',
  name: 'Mournseal Cantor',
  role: EN_E08_MOURNSEAL_CANTOR_CONTRACT.role,
  status: EN_E08_MOURNSEAL_CANTOR_CONTRACT.state,
  brief: 'A private complete specialist Possessed Mask with a tall readable ash-bone visage, two amber eyes, paired tear channels, nose ridge, oval cantor mouth, long chin, connected storm-blue fan shroud, braided ochre cords, and true hover clearance; hosts, detached masks, sound rings, glow, smoke, loose cords, projectiles, illumination, and impacts remain external.',
  rendererData: EN_E08_MOURNSEAL_CANTOR_DATA,
});

export const EN_E08_MOURNSEAL_CANTOR_FAMILY = deepFreeze({
  id: 'possessed-mask',
  name: 'Possessed Mask Mournseal Cantor Review',
  sliceId: 'EN-E08',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E08_MOURNSEAL_CANTOR_CONTRACT.chassis,
  rendererKey: EN_E08_MOURNSEAL_CANTOR_RENDERER.key,
  variants: [MOURNSEAL_CANTOR_VARIANT],
  rendererData: {
    contractCard: EN_E08_POSSESSED_MASK_CONTRACT_CARD.id,
    approvedPrecedingGate: EN_E08_WHISPERVEIL_VISAGE_GATE.id,
    activeGate: EN_E08_MOURNSEAL_CANTOR_GATE.id,
  },
  review: {
    baselineVariant: 'mournseal-cantor',
    scale: 8,
    notes: 'Visually approved as one connected baked hovering specialist Mournseal Cantor against approved Whisperveil Visage plus public Spectral Ghost and Flame Elemental. Implementation b1fd09ab0b04128330178a99c0379783621e478f records the exact accepted pixels. Keep registration, fixtures, child assets, effects, Living Weapon, EN-E09, release, accepted drift, and a pull request separate; the same reply opens only the private elite role after clean publication reconciliation.',
  },
});

export const EN_E08_MOURNSEAL_CANTOR_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E08_MOURNSEAL_CANTOR_RENDERER],
  families: [EN_E08_MOURNSEAL_CANTOR_FAMILY],
});
