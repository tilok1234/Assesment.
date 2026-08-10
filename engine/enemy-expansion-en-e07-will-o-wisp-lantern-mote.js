import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E07_GRAND_PRETENDER_GATE } from './enemy-expansion-en-e07-doppelganger-grand-pretender.js';

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
  shell: ['#315f68', '#1b3942', '#57919a'],
  flame: ['#5bc1b0', '#2e8d83', '#9ce4c7'],
  core: ['#d5efa2', '#82bd7f', '#efffc9'],
  cage: ['#746394', '#44395f', '#a48dc3'],
  eye: '#fff0a3',
  flash: '#f4f4f4',
});

export const EN_E07_WILL_O_WISP_CONTRACT_CARD = deepFreeze({
  id: 'en-e07-will-o-wisp-v1',
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
  deferredRoles: [
    { role: 'specialist', status: 'planned-unnamed' },
    { role: 'elite', status: 'planned-unnamed' },
  ],
  styleContract: 'Use chunky one-to-three-pixel connected forms, hard alpha, a visible self-contained flame core, a structural marsh-lantern cage, and true hover clearance. The actor must not depend on detached sparks, bloom, smoke, trails, or floor light to read.',
  effectBoundary: 'Aura, bloom, glow, detached embers, loose sparks, smoke, afterimages, trails, light pools, projectiles, impact flashes, and illumination remain external.',
});

export const EN_E07_LANTERN_MOTE_CONTRACT = deepFreeze({
  sliceId: 'EN-E07',
  family: 'will-o-wisp',
  variant: 'lantern-mote',
  role: 'common',
  state: 'implemented-complete-motion-approved',
  chassis: 'single-eye-ribbed-cage-split-flame-hovering-wisp-v1',
  silhouette: 'A small-to-medium hovering marsh lantern with one connected stepped wick, a broad ribbed cage, a single visible core eye, a tapered inner flame, and two connected lower flame prongs. It must not read as the public Ghost robe, Shadow Slime dome, Flame Elemental blob, a humanoid Living Shadow, or a detached particle cluster.',
  identity: 'A deep marsh-teal shell, mint spectral flame, pale living core, violet cage ribs, one warm eye, and a two-prong lower flame create a self-contained common Will-o-Wisp actor. The cage and flame remain one opaque connected component while all aura, bloom, sparks, trails, smoke, pools, and illumination stay external.',
  effectBoundary: EN_E07_WILL_O_WISP_CONTRACT_CARD.effectBoundary,
});

export const EN_E07_LANTERN_MOTE_DATA = deepFreeze({
  actor: {
    species: 'will-o-wisp',
    bodyBuild: 'small-hovering-ribbed-lantern',
    skin: 'mint-marsh-flame',
    hairStyle: 'connected-stepped-wick',
    hairColor: 'deep-marsh-teal',
    expression: 'single-core-vigil',
    faceDetail: 'one-warm-eye-in-pale-living-core',
    headgear: 'none',
    outfit: 'connected-violet-lantern-cage',
    outfitColor: 'violet-and-marsh-teal',
    outfitTier: 'tier1',
    weapon: 'connected-core-flame-tongue',
    weaponTier: 'none',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.flame,
      hair: COLORS.shell,
      outfit: COLORS.cage,
    },
  },
  lanternMote: COLORS,
  alphaPolicy: 'binary-single-component-stepped-wick-ribbed-cage-single-core-eye-tapered-flame-split-prongs-and-hover-clearance',
  effectBoundary: 'external-aura-bloom-glow-detached-embers-loose-sparks-smoke-afterimages-trails-light-pools-projectiles-impacts-and-illumination',
  bakedEffects: [],
});

export const EN_E07_LANTERN_MOTE_GATE = deepFreeze({
  id: 'en-e07-will-o-wisp-lantern-mote-full-v1',
  status: 'approved',
  baseCheckpoint: '3ddbe159360f16844d167ecc753d6b767b7e5549',
  authorizedOn: '2026-08-10',
  authorizationEvidence: 'After the exact repaired Grand Pretender was visually approved, committed, pushed, and reconciled at clean published checkpoint 3ddbe159360f16844d167ecc753d6b767b7e5549, the designer replied: Approved lets do next. The frozen EN-E07 family order advances from completed priority-first Living Shadow and Doppelganger to Will-o-Wisp; the one-complete-sprite cadence authorizes only one private common Will-o-Wisp Lantern Mote 80-frame candidate.',
  approvedOn: '2026-08-11',
  approvalEvidence: 'After the exact repaired labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, the public Spectral Ghost, Shadow Slime, and Flame Elemental comparison, and paired GIF evidence were presented, and the three exact frozen PNG review boards were opened together in responsive Aseprite, the designer replied: approved lets do next. Approval applies only to candidate digest f50a0c6f08b63dde7bad06542140123c5d6bb7fb419b7df2789cffa441a9ebb8; Will-o-Wisp registration, fixtures, effects, later roles or families, release, and EN-E08 remain separate gates.',
  approvedImplementation: '96907f552a06ba3865e25a46f881af5add2237ee',
  publicationAuthorizedOn: '2026-08-11',
  publicationAuthorizationEvidence: 'The designer said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact artifact or digest. It does not authorize registration, fixtures, effects, later roles or families, release, or any other unopened gate.',
  publishedImplementation: null,
  publishedApprovalRecord: null,
  publicationState: 'authorized-pending-bounded-publication',
  precedingApproval: {
    gateId: EN_E07_GRAND_PRETENDER_GATE.id,
    artifactSha256: EN_E07_GRAND_PRETENDER_GATE.artifactSha256,
    assembledArtifactSha256: EN_E07_GRAND_PRETENDER_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E07_GRAND_PRETENDER_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E07_GRAND_PRETENDER_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E07_GRAND_PRETENDER_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E07_GRAND_PRETENDER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E07_GRAND_PRETENDER_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E07_GRAND_PRETENDER_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E07_GRAND_PRETENDER_GATE.initialPublishedHandoff,
    currentReconciliation: '3ddbe159360f16844d167ecc753d6b767b7e5549',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e07-will-o-wisp-lantern-mote/en-e07-will-o-wisp-lantern-mote-full-suite-raw.png',
  artifactSha256: 'a97a52022736cc0b471e7d14d714d779dbdd622d6f3d5936c5e0c58a438a370c',
  assembledArtifact: 'enemy-expansion-review/en-e07-will-o-wisp-lantern-mote/en-e07-will-o-wisp-lantern-mote-full-suite-complete-b-form.png',
  assembledArtifactSha256: '71be29714f2bfcba373ec8c072102e11dc4213a2350ed7a73ace4eff586a40b7',
  comparisonArtifact: 'enemy-expansion-review/en-e07-will-o-wisp-lantern-mote/en-e07-will-o-wisp-lantern-mote-spectral-comparison.png',
  comparisonArtifactSha256: '54ae19c61dec1a4a8566dc75153201f04bb1a5e6df082896eb05a7ebad0eb58e',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e07-will-o-wisp-lantern-mote/en-e07-will-o-wisp-lantern-mote-full-suite-four-directions-labeled.gif',
      sha256: '33b000d802955afa79aee7a33ffd5b42c2867c15f1c7caad3a8828da678ff7d7',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e07-will-o-wisp-lantern-mote/en-e07-will-o-wisp-lantern-mote-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '9308e786118a54a847acad7593e28cbab1ab2b41e272989744b948e6bea3e8bd',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
  },
  candidateFrameDigest: 'f50a0c6f08b63dde7bad06542140123c5d6bb7fb419b7df2789cffa441a9ebb8',
  spectralGhostComparisonDigest: 'f373247db71b7472a8d64248c0e0e8d06eabfacee7e283db0db0a8fd3c305621',
  shadowSlimeComparisonDigest: '04725a8150c31914758c7185f9c9d82c7cc97c666ea306f291d63aba04eccee1',
  flameElementalComparisonDigest: '0df82667d385dbbf4b44c861922b231ffc4b1850ad037fdefc351935f6c9659c',
  grandPretenderPredecessorDigest: EN_E07_GRAND_PRETENDER_GATE.candidateFrameDigest,
  scope: 'One complete 80-frame Lantern Mote common Will-o-Wisp across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle pulses the single core eye, stepped wick, and connected cage. Walk uses four directional hover phases with opposed cage and lower-prong drift. Attack closes the cage around the visible eye, pinches the core upward, extends one connected flame tongue without a projectile, and relights the authored lantern form. Hurt uses a complete white recoil and a colored dim-cage fold that preserves the eye, wick, cage, and split lower flame. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and a public Spectral Ghost, Shadow Slime, and Flame Elemental silhouette comparison together.',
  exclusions: [
    'changes to approved Grand Pretender rendered pixels',
    'changes to approved Pale Echo or Falseface Adept rendered pixels',
    'changes to approved Living Shadow rendered pixels',
    'public Will-o-Wisp registration',
    'public catalog exposure',
    'asset-pack fixture generation or regeneration',
    'new Cast pixels',
    'new Death pixels',
    'aura',
    'bloom',
    'glow',
    'detached embers',
    'loose sparks',
    'smoke',
    'afterimages',
    'trails',
    'light pools',
    'projectiles',
    'impact flashes',
    'illumination',
    'effects',
    'release',
    'Will-o-Wisp specialist or elite',
    'Changeling',
    'Kelpie',
    'EN-E08 and later work',
  ],
  nextGate: 'The exact repaired Lantern Mote candidate is visually approved and its implementation is committed at 96907f552a06ba3865e25a46f881af5add2237ee. Its bounded approval-record, documentation reconciliation, and branch push are authorized. After a clean published reconciliation, the same approved lets do next response opens only one private specialist Will-o-Wisp candidate. Do not register Will-o-Wisp, generate fixtures, add effects, release, start the elite or another family beyond that candidate, or advance EN-E08.',
});

export const EN_E07_LANTERN_MOTE_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const WALK_PHASES = deepFreeze([
  { name: 'left-cage-hover', pose: 'walk', bob: 0, drift: -1, flare: 0, tilt: 1 },
  { name: 'rising-core-pass', pose: 'walk', bob: -1, drift: 0, flare: 1, tilt: -1 },
  { name: 'right-cage-hover', pose: 'walk', bob: 0, drift: 1, flare: 0, tilt: -1 },
  { name: 'low-prong-settle', pose: 'walk', bob: 1, drift: 0, flare: -1, tilt: 1 },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'single-eye-cage-focus', pose: 'focus', bob: 0, drift: 0, flare: 0, tilt: 0 },
  { name: 'living-core-pinch', pose: 'pinch', bob: -1, drift: 0, flare: 1, tilt: 1 },
  { name: 'connected-flame-tongue', pose: 'thrust', bob: 0, drift: 0, flare: 1, tilt: -1 },
  { name: 'authored-lantern-relight', pose: 'recover', bob: 1, drift: 0, flare: -1, tilt: 0 },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-cage-recoil', pose: 'hurt', bob: 0, drift: -1, flare: 0, tilt: -1, flash: true },
  { name: 'colored-dim-cage-fold', pose: 'brace', bob: 1, drift: 0, flare: -1, tilt: 1, flash: false },
]);

function phaseFor(animation, frame) {
  if (animation === 'idle') {
    assert(frame === 0 || frame === 1, 'Lantern Mote Idle frame ' + frame + ' is out of range.');
    return frame === 0
      ? { name: 'single-core-vigil', pose: 'idle', bob: 0, drift: 0, flare: 0, tilt: -1 }
      : { name: 'ribbed-cage-breath', pose: 'idle', bob: 1, drift: 0, flare: 1, tilt: 1 };
  }
  if (animation === 'walk') return WALK_PHASES[frame];
  if (animation === 'attack' || animation === 'cast') return ATTACK_PHASES[frame];
  if (animation === 'hurt') return HURT_PHASES[frame];
  if (animation === 'death') return HURT_PHASES[EN_E07_LANTERN_MOTE_DEATH_SOURCE_FRAMES[frame]];
  return null;
}

function createPixels() {
  return new Array(SIZE * SIZE).fill(null);
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert([x, y, width, height].every(Number.isInteger) && width > 0 && height > 0, 'Lantern Mote rectangles must use positive integer geometry.');
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Lantern Mote authored pixels must remain inside the 24x24 cell.');
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

  // Stepped wick, closed cap, and ribbed cage are one connected outer actor.
  paint.dot(12 + x + Math.max(tilt, 0), 3 + y, COLORS.cage[2]);
  paint.rect(11 + x, 4 + y, 3, 1, COLORS.cage[1]);
  paint.rect(9 + x, 5 + y, 7, 2, COLORS.shell[1]);
  paint.rect(8 + x, 7 + y, 9, 2, COLORS.shell[0]);
  paint.rect(6 + x, 9 + y, 4, 5, COLORS.cage[1]);
  paint.rect(15 + x, 9 + y, 4, 5, COLORS.cage[0]);
  paint.dot(6 + x, 8 + y, COLORS.cage[2]);
  paint.dot(18 + x, 8 + y, COLORS.shell[2]);

  // Tapered flame and pale core remain fused to both cage ribs.
  paint.rect(9 + x, 8 + y, 7, 8, COLORS.flame[0]);
  paint.rect(10 + x, 7 + y, 5, 10, COLORS.flame[1]);
  paint.rect(8 + x, 11 + y, 2, 4, COLORS.shell[0]);
  paint.rect(15 + x, 11 + y, 2, 4, COLORS.shell[1]);
  paint.rect(11 + x, 9 + y, 3, 6, COLORS.core[1]);
  paint.dot(11 + x, 10 + y, COLORS.core[2]);
  paint.dot(13 + x, 13 + y, COLORS.core[0]);
  if (rear) {
    paint.rect(11 + x, 8 + y, 3, 2, COLORS.cage[1]);
    paint.dot(12 + x, 10 + y, COLORS.cage[2]);
    paint.rect(7 + x, 8 + y, 2, 2, COLORS.shell[2]);
    paint.rect(16 + x, 8 + y, 2, 2, COLORS.cage[2]);
  }

  // Two connected lower flame prongs preserve actor identity without a trail.
  paint.rect(8 + x, 15 + y, 4, 3, COLORS.flame[1]);
  paint.rect(13 + x, 15 + y, 4, 3, COLORS.flame[0]);
  paint.rect(10 + x, 14 + y, 5, 3, COLORS.core[0]);
  paint.rect(9 + x - Math.max(flare, 0), 18 + y, 3, 1, COLORS.cage[1]);
  paint.rect(13 + x + Math.max(flare, 0), 18 + y, 3, 1, COLORS.shell[0]);
  paint.dot(10 + x - Math.max(-flare, 0), 19 + y, COLORS.flame[2]);
  paint.dot(15 + x + Math.max(flare, 0), 19 + y, COLORS.core[2]);

  if (phase.pose === 'focus') {
    paint.rect(7 + x, 9 + y, 4, 3, COLORS.cage[0]);
    paint.rect(14 + x, 9 + y, 4, 3, COLORS.cage[1]);
  } else if (phase.pose === 'pinch') {
    paint.rect(11 + x, 6 + y, 3, 5, COLORS.core[0]);
    paint.dot(12 + x, 7 + y, COLORS.core[2]);
  } else if (phase.pose === 'thrust') {
    if (rear) {
      paint.rect(11 + x, 3 + y, 3, 6, COLORS.flame[2]);
      paint.dot(12 + x, 2 + y, COLORS.core[2]);
    } else {
      paint.rect(11 + x, 15 + y, 3, 5, COLORS.flame[2]);
      paint.dot(12 + x, 20 + y, COLORS.core[2]);
    }
  } else if (phase.pose === 'recover' || phase.pose === 'brace') {
    paint.rect(8 + x, 10 + y, 3, 5, COLORS.cage[1]);
    paint.rect(14 + x, 10 + y, 3, 5, COLORS.cage[0]);
    paint.rect(11 + x, 13 + y, 3, 3, COLORS.core[1]);
  }
  if (!rear) {
    const eyeY = phase.pose === 'pinch'
      ? 10
      : (phase.pose === 'recover' || phase.pose === 'brace' ? 12 : 11);
    paint.dot(12 + x, eyeY + y, COLORS.eye);
  }
}

function drawRight(paint, phase) {
  const y = phase.bob || 0;
  const x = phase.drift || 0;
  const flare = phase.flare || 0;
  const tilt = phase.tilt || 0;

  paint.dot(13 + x + Math.max(tilt, 0), 3 + y, COLORS.cage[2]);
  paint.rect(12 + x, 4 + y, 3, 1, COLORS.cage[1]);
  paint.rect(10 + x, 5 + y, 7, 2, COLORS.shell[1]);
  paint.rect(9 + x, 7 + y, 9, 2, COLORS.shell[0]);
  paint.rect(7 + x, 9 + y, 4, 5, COLORS.cage[1]);
  paint.rect(16 + x, 9 + y, 4, 5, COLORS.cage[0]);
  paint.dot(7 + x, 8 + y, COLORS.cage[2]);
  paint.dot(19 + x, 9 + y, COLORS.shell[2]);
  paint.rect(10 + x, 8 + y, 8, 8, COLORS.flame[0]);
  paint.rect(11 + x, 7 + y, 6, 10, COLORS.flame[1]);
  paint.rect(9 + x, 11 + y, 2, 4, COLORS.shell[0]);
  paint.rect(17 + x, 11 + y, 2, 4, COLORS.shell[1]);
  paint.rect(13 + x, 9 + y, 3, 6, COLORS.core[1]);
  paint.dot(14 + x, 10 + y, COLORS.core[2]);
  paint.dot(14 + x, 13 + y, COLORS.core[0]);
  paint.rect(9 + x, 15 + y, 4, 3, COLORS.flame[1]);
  paint.rect(14 + x, 15 + y, 4, 3, COLORS.flame[0]);
  paint.rect(11 + x, 14 + y, 5, 3, COLORS.core[0]);
  paint.rect(10 + x - Math.max(flare, 0), 18 + y, 3, 1, COLORS.cage[1]);
  paint.rect(14 + x + Math.max(flare, 0), 18 + y, 3, 1, COLORS.shell[0]);
  paint.dot(11 + x - Math.max(-flare, 0), 19 + y, COLORS.flame[2]);
  paint.dot(16 + x + Math.max(flare, 0), 19 + y, COLORS.core[2]);

  if (phase.pose === 'focus') {
    paint.rect(9 + x, 9 + y, 4, 3, COLORS.cage[1]);
    paint.rect(16 + x, 9 + y, 4, 3, COLORS.cage[0]);
  } else if (phase.pose === 'pinch') {
    paint.rect(14 + x, 6 + y, 3, 5, COLORS.core[0]);
    paint.dot(15 + x, 7 + y, COLORS.core[2]);
  } else if (phase.pose === 'thrust') {
    paint.rect(16 + x, 10 + y, 6, 3, COLORS.flame[2]);
    paint.dot(22 + x, 11 + y, COLORS.core[2]);
  } else if (phase.pose === 'recover' || phase.pose === 'brace') {
    paint.rect(9 + x, 10 + y, 3, 5, COLORS.cage[1]);
    paint.rect(16 + x, 10 + y, 3, 5, COLORS.cage[0]);
    paint.rect(13 + x, 13 + y, 3, 3, COLORS.core[1]);
  }
  const eyeY = phase.pose === 'pinch'
    ? 10
    : (phase.pose === 'recover' || phase.pose === 'brace' ? 12 : 11);
  paint.dot(16 + x, eyeY + y, COLORS.eye);
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
  assert(phase, 'Lantern Mote animation ' + animation + ' frame ' + frame + ' is out of range.');
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

export function renderEnE07LanternMoteFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Lantern Mote rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Lantern Mote direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'will-o-wisp',
    variant: 'lantern-mote',
    direction,
    animation,
    frame,
    phase: phase.name,
    lanternMoteGate: EN_E07_LANTERN_MOTE_GATE.id,
    approvedPrecedingGate: EN_E07_GRAND_PRETENDER_GATE.id,
    alphaPolicy: EN_E07_LANTERN_MOTE_DATA.alphaPolicy,
    effectBoundary: EN_E07_LANTERN_MOTE_DATA.effectBoundary,
  });
}

export const EN_E07_LANTERN_MOTE_RENDERER = deepFreeze({
  key: 'en-e07-will-o-wisp-lantern-mote-v1',
  chassis: EN_E07_LANTERN_MOTE_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'will-o-wisp', 'The EN-E07 Lantern Mote renderer is restricted to Will-o-Wisp.');
    assert(variant.id === 'lantern-mote', 'The EN-E07 Lantern Mote renderer is restricted to Lantern Mote.');
    return renderEnE07LanternMoteFrame(context, direction, animation.id, frame);
  },
});

const LANTERN_MOTE_VARIANT = deepFreeze({
  id: 'lantern-mote',
  name: 'Lantern Mote',
  role: EN_E07_LANTERN_MOTE_CONTRACT.role,
  status: EN_E07_LANTERN_MOTE_CONTRACT.state,
  brief: 'An approved complete common Will-o-Wisp with one connected wick, ribbed marsh-lantern cage, single core eye, tapered inner flame, split lower prongs, and true hover clearance; aura, bloom, sparks, smoke, trails, pools, projectiles, illumination, and impacts remain external.',
  rendererData: EN_E07_LANTERN_MOTE_DATA,
});

export const EN_E07_LANTERN_MOTE_FAMILY = deepFreeze({
  id: 'will-o-wisp',
  name: 'Will-o-Wisp Lantern Mote Review',
  sliceId: 'EN-E07',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E07_LANTERN_MOTE_CONTRACT.chassis,
  rendererKey: EN_E07_LANTERN_MOTE_RENDERER.key,
  variants: [LANTERN_MOTE_VARIANT],
  rendererData: {
    contractCard: EN_E07_WILL_O_WISP_CONTRACT_CARD.id,
    approvedPrecedingGate: EN_E07_GRAND_PRETENDER_GATE.id,
    activeGate: EN_E07_LANTERN_MOTE_GATE.id,
  },
  review: {
    baselineVariant: 'lantern-mote',
    scale: 8,
    notes: 'Visually approved as one connected hovering Lantern Mote against public Spectral Ghost, Shadow Slime, and Flame Elemental. The exact implementation is committed locally and its bounded publication is authorized. Keep registration, fixtures, effects, later Will-o-Wisp roles, Changeling, Kelpie, and later Wave 2 work separate until the clean published reconciliation.',
  },
});

export const EN_E07_LANTERN_MOTE_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E07_LANTERN_MOTE_RENDERER],
  families: [EN_E07_LANTERN_MOTE_FAMILY],
});
