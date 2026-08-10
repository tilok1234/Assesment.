import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E07_LANTERN_MOTE_GATE } from './enemy-expansion-en-e07-will-o-wisp-lantern-mote.js';

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
  shell: ['#284f5a', '#15343d', '#4c8990'],
  flame: ['#58cbb8', '#278c82', '#9be7c8'],
  core: ['#d5ef91', '#80ba70', '#efffc1'],
  cage: ['#705087', '#3c2d56', '#a27bb5'],
  eye: '#fff0a3',
  flash: '#f4f4f4',
});

export const EN_E07_WILL_O_WISP_FENBELL_CONTRACT_CARD = deepFreeze({
  id: 'en-e07-will-o-wisp-v2',
  sliceId: 'EN-E07',
  family: 'will-o-wisp',
  familyName: 'Will-o-Wisp',
  roleOrder: ['common', 'specialist', 'elite'],
  activeVariant: {
    id: 'lantern-mote',
    name: 'Lantern Mote',
    role: 'common',
    status: 'implemented-full-approved',
  },
  activeSpecialist: {
    id: 'fenbell-shepherd',
    name: 'Fenbell Shepherd',
    role: 'specialist',
    status: 'implemented-full-candidate',
  },
  deferredRoles: [
    { role: 'elite', status: 'planned-unnamed' },
  ],
  styleContract: 'Use chunky one-to-three-pixel connected forms, hard alpha, a visible self-contained living core, structural lantern ribs, and true hover clearance. The specialist advances Lantern Mote through a hooked wick, taller bell cage, asymmetric connected shutters, and three connected lower flame tines without depending on detached wisps or effects.',
  effectBoundary: 'Aura, bloom, glow, detached wisps, detached embers, loose sparks, sound rings, smoke, afterimages, trails, light pools, projectiles, impact flashes, and illumination remain external.',
});

export const EN_E07_FENBELL_SHEPHERD_CONTRACT = deepFreeze({
  sliceId: 'EN-E07',
  family: 'will-o-wisp',
  variant: 'fenbell-shepherd',
  role: 'specialist',
  state: 'implemented-complete-motion-candidate',
  chassis: 'hooked-wick-bell-cage-single-eye-three-tine-hovering-wisp-v1',
  silhouette: 'A medium hovering ritual fen bell with one connected hooked wick, a tall bell-shaped ribbed cage, one visible guiding core eye, asymmetric connected side shutters, an elongated inner flame, a broad lower lip, and three connected lower flame tines. It must stay related to Lantern Mote without becoming its enlarged copy, a public Ghost robe, Flame Elemental blob, hanging humanoid, detached wisp flock, or sound-effect icon.',
  identity: 'The approved marsh-teal shell, mint spectral flame, pale living core, violet cage, and warm single eye expand into a taller specialist silhouette with a shepherd-hook wick, opposed shutters, bell lip, and triple lower flame. The whole actor remains one opaque connected component while aura, glow, satellite wisps, sound rings, smoke, trails, floor pools, projectiles, impacts, and illumination stay external.',
  effectBoundary: EN_E07_WILL_O_WISP_FENBELL_CONTRACT_CARD.effectBoundary,
});

export const EN_E07_FENBELL_SHEPHERD_DATA = deepFreeze({
  actor: {
    species: 'will-o-wisp',
    bodyBuild: 'medium-hovering-tall-fen-bell',
    skin: 'mint-marsh-flame',
    hairStyle: 'connected-shepherd-hook-wick',
    hairColor: 'deep-marsh-teal',
    expression: 'single-guiding-eye',
    faceDetail: 'one-warm-eye-in-elongated-living-core',
    headgear: 'none',
    outfit: 'connected-violet-bell-cage-and-shutters',
    outfitColor: 'violet-and-marsh-teal',
    outfitTier: 'tier2',
    weapon: 'connected-shepherd-crook-flame-tongue',
    weaponTier: 'none',
    shield: 'connected-asymmetric-cage-shutters',
    shieldTier: 'tier2',
    offhand: 'none',
    palette: {
      skin: COLORS.flame,
      hair: COLORS.shell,
      outfit: COLORS.cage,
    },
  },
  fenbellShepherd: COLORS,
  alphaPolicy: 'binary-single-component-hooked-wick-tall-bell-cage-single-guiding-eye-asymmetric-shutters-elongated-core-broad-lip-three-flame-tines-and-hover-clearance',
  effectBoundary: 'external-aura-bloom-glow-detached-wisps-detached-embers-loose-sparks-sound-rings-smoke-afterimages-trails-light-pools-projectiles-impacts-and-illumination',
  bakedEffects: [],
});

export const EN_E07_FENBELL_SHEPHERD_GATE = deepFreeze({
  id: 'en-e07-will-o-wisp-fenbell-shepherd-full-v1',
  status: 'candidate',
  baseCheckpoint: 'd734846067b3bf9dd05cadffef440ead1f6c6d3a',
  authorizedOn: '2026-08-11',
  authorizationEvidence: 'After the exact repaired Lantern Mote was visually approved, committed, pushed, and reconciled at clean published checkpoint d734846067b3bf9dd05cadffef440ead1f6c6d3a, the designer replied: approved lets do next. The frozen Will-o-Wisp role order is common, specialist, elite, so the one-complete-sprite cadence authorizes only one private specialist Fenbell Shepherd 80-frame candidate.',
  approvedOn: null,
  approvalEvidence: 'Pending explicit visual approval of the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, the approved Lantern Mote plus public Spectral Ghost and Flame Elemental comparison, paired GIF evidence, and the three exact PNG review boards opened together in Aseprite.',
  publishedImplementation: null,
  precedingApproval: {
    gateId: EN_E07_LANTERN_MOTE_GATE.id,
    artifactSha256: EN_E07_LANTERN_MOTE_GATE.artifactSha256,
    assembledArtifactSha256: EN_E07_LANTERN_MOTE_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E07_LANTERN_MOTE_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E07_LANTERN_MOTE_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E07_LANTERN_MOTE_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E07_LANTERN_MOTE_GATE.candidateFrameDigest,
    publishedImplementation: EN_E07_LANTERN_MOTE_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E07_LANTERN_MOTE_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E07_LANTERN_MOTE_GATE.initialPublishedHandoff,
    currentReconciliation: 'd734846067b3bf9dd05cadffef440ead1f6c6d3a',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e07-will-o-wisp-fenbell-shepherd/en-e07-will-o-wisp-fenbell-shepherd-full-suite-raw.png',
  artifactSha256: '659e8539a29014278ff15e6cd726ffe2cbee26918cc0cb4e23df49a517f0572e',
  assembledArtifact: 'enemy-expansion-review/en-e07-will-o-wisp-fenbell-shepherd/en-e07-will-o-wisp-fenbell-shepherd-full-suite-complete-b-form.png',
  assembledArtifactSha256: 'ff8cba9a43c0a5639864cbd24fd82429bc3bb2cb8856c9ccadc477379911a781',
  comparisonArtifact: 'enemy-expansion-review/en-e07-will-o-wisp-fenbell-shepherd/en-e07-will-o-wisp-fenbell-shepherd-lantern-comparison.png',
  comparisonArtifactSha256: 'a967b070596c5aee98798b67a61c1d6fa71ff7e9a3f30d9f2b7e18503a6d0e59',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e07-will-o-wisp-fenbell-shepherd/en-e07-will-o-wisp-fenbell-shepherd-full-suite-four-directions-labeled.gif',
      sha256: 'a2eceb35ef98dd1acd92a5058ba71624456c852d92726995610e55e29fb8ba31',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e07-will-o-wisp-fenbell-shepherd/en-e07-will-o-wisp-fenbell-shepherd-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: 'dfb20b16ff2a15142874b718e01b0c5dd369a426f77a5b2c6a6a8af96859f7f7',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
  },
  candidateFrameDigest: '0a8000e33705967089ae66c98486eb701da88bfacd9f5adc38a47bbb62f5a46b',
  lanternMoteComparisonDigest: EN_E07_LANTERN_MOTE_GATE.candidateFrameDigest,
  spectralGhostComparisonDigest: 'f373247db71b7472a8d64248c0e0e8d06eabfacee7e283db0db0a8fd3c305621',
  flameElementalComparisonDigest: '0df82667d385dbbf4b44c861922b231ffc4b1850ad037fdefc351935f6c9659c',
  scope: 'One complete 80-frame Fenbell Shepherd specialist Will-o-Wisp across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle sways the hooked wick, tall bell cage, guiding eye, asymmetric shutters, and three connected lower tines. Walk uses four directional chime-hover phases with opposed cage and flame drift. Attack closes the connected shutters around the single eye, lifts the elongated core, extends one connected shepherd-crook flame tongue without a projectile, and settles the authored fen-bell form. Hurt uses a complete white recoil and a colored folded-bell brace that preserves the hook, eye, cage, lip, and three tines. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and an approved Lantern Mote plus public Spectral Ghost and Flame Elemental silhouette comparison together.',
  exclusions: [
    'changes to approved Lantern Mote rendered pixels',
    'changes to approved Doppelganger or Living Shadow rendered pixels',
    'public Will-o-Wisp registration',
    'public catalog exposure',
    'asset-pack fixture generation or regeneration',
    'new Cast pixels',
    'new Death pixels',
    'aura',
    'bloom',
    'glow',
    'detached wisps',
    'detached embers',
    'loose sparks',
    'sound rings',
    'smoke',
    'afterimages',
    'trails',
    'light pools',
    'projectiles',
    'impact flashes',
    'illumination',
    'effects',
    'release',
    'Will-o-Wisp elite',
    'Changeling',
    'Kelpie',
    'EN-E08 and later work',
  ],
  nextGate: 'Stop at the exact frozen Fenbell Shepherd candidate review. Do not commit, publish, register Will-o-Wisp, generate fixtures, add effects, release, start the elite or another family, or advance EN-E08 until the designer explicitly approves the presented boards and paired GIFs.',
});

export const EN_E07_FENBELL_SHEPHERD_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const WALK_PHASES = deepFreeze([
  { name: 'left-bell-hover', pose: 'walk', bob: 0, drift: -1, flare: 0, tilt: 1 },
  { name: 'high-guiding-pass', pose: 'walk', bob: -1, drift: 0, flare: 1, tilt: -1 },
  { name: 'right-bell-hover', pose: 'walk', bob: 0, drift: 1, flare: 0, tilt: -1 },
  { name: 'low-three-tine-settle', pose: 'walk', bob: 1, drift: 0, flare: -1, tilt: 1 },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'connected-shutter-close', pose: 'focus', bob: 0, drift: 0, flare: 0, tilt: 0 },
  { name: 'elongated-core-lift', pose: 'lift', bob: -1, drift: 0, flare: 1, tilt: 1 },
  { name: 'connected-shepherd-crook', pose: 'crook', bob: 0, drift: 0, flare: 1, tilt: -1 },
  { name: 'authored-fenbell-settle', pose: 'recover', bob: 1, drift: 0, flare: -1, tilt: 0 },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-fenbell-recoil', pose: 'hurt', bob: 0, drift: -1, flare: 0, tilt: -1, flash: true },
  { name: 'colored-folded-bell-brace', pose: 'brace', bob: 1, drift: 0, flare: -1, tilt: 1, flash: false },
]);

function phaseFor(animation, frame) {
  if (animation === 'idle') {
    assert(frame === 0 || frame === 1, 'Fenbell Shepherd Idle frame ' + frame + ' is out of range.');
    return frame === 0
      ? { name: 'guiding-eye-vigil', pose: 'idle', bob: 0, drift: 0, flare: 0, tilt: -1 }
      : { name: 'hooked-bell-breath', pose: 'idle', bob: 1, drift: 0, flare: 1, tilt: 1 };
  }
  if (animation === 'walk') return WALK_PHASES[frame];
  if (animation === 'attack' || animation === 'cast') return ATTACK_PHASES[frame];
  if (animation === 'hurt') return HURT_PHASES[frame];
  if (animation === 'death') return HURT_PHASES[EN_E07_FENBELL_SHEPHERD_DEATH_SOURCE_FRAMES[frame]];
  return null;
}

function createPixels() {
  return new Array(SIZE * SIZE).fill(null);
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert([x, y, width, height].every(Number.isInteger) && width > 0 && height > 0, 'Fenbell Shepherd rectangles must use positive integer geometry.');
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Fenbell Shepherd authored pixels must remain inside the 24x24 cell.');
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
  const flare = phase.flare || 0;
  const tilt = phase.tilt || 0;
  const spread = Math.max(flare, 0);

  // Hooked wick, cap, and bell shoulders stay fused to the cage.
  paint.rect(12 + x, 2 + y, 3, 1, COLORS.cage[2]);
  paint.dot(14 + x + Math.max(tilt, 0), 3 + y, COLORS.cage[2]);
  paint.dot(15 + x + Math.max(tilt, 0), 4 + y, COLORS.cage[0]);
  paint.rect(11 + x, 3 + y, 4, 2, COLORS.cage[1]);
  paint.rect(9 + x, 5 + y, 8, 2, COLORS.shell[1]);
  paint.rect(7 + x, 7 + y, 12, 2, COLORS.shell[0]);

  // Asymmetric connected shutters frame one elongated living core.
  paint.rect(5 + x, 9 + y, 4, 6, COLORS.cage[1]);
  paint.rect(17 + x, 9 + y, 4, 6, COLORS.cage[0]);
  paint.dot(5 + x, 8 + y, COLORS.cage[2]);
  paint.dot(20 + x, 10 + y, COLORS.shell[2]);
  paint.rect(9 + x, 7 + y, 8, 10, COLORS.flame[0]);
  paint.rect(10 + x, 8 + y, 6, 9, COLORS.flame[1]);
  paint.rect(11 + x, 9 + y, 4, 7, COLORS.core[1]);
  paint.dot(12 + x, 9 + y, COLORS.core[2]);
  paint.dot(14 + x, 15 + y, COLORS.core[0]);
  paint.rect(7 + x, 10 + y, 3, 2, COLORS.cage[0]);
  paint.rect(16 + x, 11 + y, 3, 2, COLORS.cage[1]);
  if (rear) {
    paint.rect(11 + x, 10 + y, 4, 2, COLORS.cage[1]);
    paint.dot(13 + x, 12 + y, COLORS.cage[2]);
    paint.rect(6 + x, 9 + y, 2, 2, COLORS.shell[2]);
    paint.rect(18 + x, 9 + y, 2, 2, COLORS.cage[2]);
    paint.dot(6 + x, 15 + y, COLORS.cage[2]);
    paint.dot(19 + x, 15 + y, COLORS.shell[2]);
  }

  // A broad bell lip binds three lower flame tines into the actor.
  paint.rect(7 + x, 16 + y, 12, 2, COLORS.cage[1]);
  paint.rect(8 + x - spread, 18 + y, 3, 2, COLORS.flame[1]);
  paint.rect(12 + x, 17 + y, 3, 3, COLORS.core[0]);
  paint.rect(16 + x + spread, 18 + y, 3, 2, COLORS.flame[0]);
  paint.dot(9 + x - spread, 20 + y, COLORS.flame[2]);
  paint.dot(13 + x, 20 + y, COLORS.core[2]);
  paint.dot(17 + x + spread, 20 + y, COLORS.flame[2]);

  if (phase.pose === 'focus') {
    paint.rect(7 + x, 10 + y, 5, 4, COLORS.cage[0]);
    paint.rect(14 + x, 10 + y, 5, 4, COLORS.cage[1]);
  } else if (phase.pose === 'lift') {
    paint.rect(11 + x, 6 + y, 4, 6, COLORS.core[0]);
    paint.rect(12 + x, 5 + y, 2, 3, COLORS.core[2]);
  } else if (phase.pose === 'crook') {
    if (rear) {
      paint.rect(12 + x, 2 + y, 3, 7, COLORS.flame[2]);
      paint.rect(10 + x, 1 + y, 4, 2, COLORS.core[2]);
    } else {
      paint.rect(12 + x, 15 + y, 3, 6, COLORS.flame[2]);
      paint.rect(14 + x, 20 + y, 3, 2, COLORS.core[2]);
    }
  } else if (phase.pose === 'recover' || phase.pose === 'brace') {
    paint.rect(7 + x, 10 + y, 5, 5, COLORS.cage[1]);
    paint.rect(14 + x, 10 + y, 5, 5, COLORS.cage[0]);
    paint.rect(11 + x, 13 + y, 4, 4, COLORS.core[1]);
  }

  if (!rear) {
    const eyeY = phase.pose === 'lift'
      ? 10
      : (phase.pose === 'recover' || phase.pose === 'brace' ? 13 : 12);
    paint.dot(13 + x, eyeY + y, COLORS.eye);
  }
}

function drawRight(paint, phase) {
  const y = phase.bob || 0;
  const x = phase.drift || 0;
  const flare = phase.flare || 0;
  const tilt = phase.tilt || 0;
  const spread = Math.max(flare, 0);

  paint.rect(13 + x, 2 + y, 3, 1, COLORS.cage[2]);
  paint.dot(15 + x + Math.max(tilt, 0), 3 + y, COLORS.cage[2]);
  paint.dot(16 + x + Math.max(tilt, 0), 4 + y, COLORS.cage[0]);
  paint.rect(12 + x, 3 + y, 4, 2, COLORS.cage[1]);
  paint.rect(10 + x, 5 + y, 8, 2, COLORS.shell[1]);
  paint.rect(8 + x, 7 + y, 12, 2, COLORS.shell[0]);
  paint.rect(6 + x, 9 + y, 4, 6, COLORS.cage[1]);
  paint.rect(18 + x, 9 + y, 4, 6, COLORS.cage[0]);
  paint.dot(6 + x, 8 + y, COLORS.cage[2]);
  paint.dot(21 + x, 10 + y, COLORS.shell[2]);
  paint.rect(10 + x, 7 + y, 9, 10, COLORS.flame[0]);
  paint.rect(11 + x, 8 + y, 7, 9, COLORS.flame[1]);
  paint.rect(13 + x, 9 + y, 4, 7, COLORS.core[1]);
  paint.dot(14 + x, 9 + y, COLORS.core[2]);
  paint.dot(16 + x, 15 + y, COLORS.core[0]);
  paint.rect(8 + x, 10 + y, 3, 2, COLORS.cage[0]);
  paint.rect(18 + x, 11 + y, 3, 2, COLORS.cage[1]);
  paint.rect(8 + x, 16 + y, 13, 2, COLORS.cage[1]);
  paint.rect(9 + x - spread, 18 + y, 3, 2, COLORS.flame[1]);
  paint.rect(13 + x, 17 + y, 3, 3, COLORS.core[0]);
  paint.rect(17 + x + spread, 18 + y, 3, 2, COLORS.flame[0]);
  paint.dot(10 + x - spread, 20 + y, COLORS.flame[2]);
  paint.dot(14 + x, 20 + y, COLORS.core[2]);
  paint.dot(18 + x + spread, 20 + y, COLORS.flame[2]);

  if (phase.pose === 'focus') {
    paint.rect(9 + x, 10 + y, 5, 4, COLORS.cage[1]);
    paint.rect(16 + x, 10 + y, 5, 4, COLORS.cage[0]);
  } else if (phase.pose === 'lift') {
    paint.rect(14 + x, 6 + y, 4, 6, COLORS.core[0]);
    paint.rect(15 + x, 5 + y, 2, 3, COLORS.core[2]);
  } else if (phase.pose === 'crook') {
    paint.rect(18 + x, 10 + y, 5, 3, COLORS.flame[2]);
    paint.rect(21 + x, 12 + y, 2, 3, COLORS.core[2]);
  } else if (phase.pose === 'recover' || phase.pose === 'brace') {
    paint.rect(9 + x, 10 + y, 5, 5, COLORS.cage[1]);
    paint.rect(16 + x, 10 + y, 5, 5, COLORS.cage[0]);
    paint.rect(13 + x, 13 + y, 4, 4, COLORS.core[1]);
  }

  const eyeY = phase.pose === 'lift'
    ? 10
    : (phase.pose === 'recover' || phase.pose === 'brace' ? 13 : 12);
  paint.dot(17 + x, eyeY + y, COLORS.eye);
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
  assert(phase, 'Fenbell Shepherd animation ' + animation + ' frame ' + frame + ' is out of range.');
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

export function renderEnE07FenbellShepherdFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Fenbell Shepherd rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Fenbell Shepherd direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'will-o-wisp',
    variant: 'fenbell-shepherd',
    direction,
    animation,
    frame,
    phase: phase.name,
    fenbellShepherdGate: EN_E07_FENBELL_SHEPHERD_GATE.id,
    approvedPrecedingGate: EN_E07_LANTERN_MOTE_GATE.id,
    alphaPolicy: EN_E07_FENBELL_SHEPHERD_DATA.alphaPolicy,
    effectBoundary: EN_E07_FENBELL_SHEPHERD_DATA.effectBoundary,
  });
}

export const EN_E07_FENBELL_SHEPHERD_RENDERER = deepFreeze({
  key: 'en-e07-will-o-wisp-fenbell-shepherd-v1',
  chassis: EN_E07_FENBELL_SHEPHERD_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'will-o-wisp', 'The EN-E07 Fenbell Shepherd renderer is restricted to Will-o-Wisp.');
    assert(variant.id === 'fenbell-shepherd', 'The EN-E07 Fenbell Shepherd renderer is restricted to Fenbell Shepherd.');
    return renderEnE07FenbellShepherdFrame(context, direction, animation.id, frame);
  },
});

const FENBELL_SHEPHERD_VARIANT = deepFreeze({
  id: 'fenbell-shepherd',
  name: 'Fenbell Shepherd',
  role: EN_E07_FENBELL_SHEPHERD_CONTRACT.role,
  status: EN_E07_FENBELL_SHEPHERD_CONTRACT.state,
  brief: 'A complete specialist Will-o-Wisp candidate with one connected hooked wick, tall ribbed bell cage, single guiding eye, asymmetric connected shutters, elongated core, broad lip, three lower flame tines, and true hover clearance; aura, detached wisps, sound rings, smoke, trails, pools, projectiles, illumination, and impacts remain external.',
  rendererData: EN_E07_FENBELL_SHEPHERD_DATA,
});

export const EN_E07_FENBELL_SHEPHERD_FAMILY = deepFreeze({
  id: 'will-o-wisp',
  name: 'Will-o-Wisp Fenbell Shepherd Review',
  sliceId: 'EN-E07',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E07_FENBELL_SHEPHERD_CONTRACT.chassis,
  rendererKey: EN_E07_FENBELL_SHEPHERD_RENDERER.key,
  variants: [FENBELL_SHEPHERD_VARIANT],
  rendererData: {
    contractCard: EN_E07_WILL_O_WISP_FENBELL_CONTRACT_CARD.id,
    approvedPrecedingGate: EN_E07_LANTERN_MOTE_GATE.id,
    activeGate: EN_E07_FENBELL_SHEPHERD_GATE.id,
  },
  review: {
    baselineVariant: 'fenbell-shepherd',
    scale: 8,
    notes: 'Awaiting visual approval for one connected hovering Fenbell Shepherd against approved Lantern Mote plus public Spectral Ghost and Flame Elemental. Keep registration, fixtures, effects, elite Will-o-Wisp, Changeling, Kelpie, and later Wave 2 work separate.',
  },
});

export const EN_E07_FENBELL_SHEPHERD_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E07_FENBELL_SHEPHERD_RENDERER],
  families: [EN_E07_FENBELL_SHEPHERD_FAMILY],
});
