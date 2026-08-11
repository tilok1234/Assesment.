import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E07_KELPIE_CONTRACT_CARD,
  EN_E07_MIREMANE_COURSER_GATE,
} from './enemy-expansion-en-e07-kelpie-miremane-courser.js';
import {
  EN_E07_DROWNBRIDLE_STALKER_GATE,
} from './enemy-expansion-en-e07-kelpie-drownbridle-stalker.js';

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
  body: ['#233744', '#111f2b', '#3e5966'],
  mane: ['#36505a', '#1b3038', '#6c8684'],
  belly: ['#4f6570', '#2e404b', '#819496'],
  wake: ['#67536f', '#3d3049', '#92789a'],
  hoof: '#0b151f',
  feature: '#09131a',
  eye: '#d2f6ed',
  flash: '#f4f4f4',
});

export const EN_E07_BLACKWAKE_DREADMARE_CONTRACT_CARD = deepFreeze({
  id: 'en-e07-kelpie-blackwake-dreadmare-v1',
  sliceId: 'EN-E07',
  family: 'kelpie',
  familyName: 'Kelpie',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingVariant: {
    id: 'drownbridle-stalker',
    name: 'Drownbridle Stalker',
    role: 'specialist',
    status: 'approved-published',
  },
  activeVariant: {
    id: 'blackwake-dreadmare',
    name: 'Blackwake Dreadmare',
    role: 'elite',
    status: 'implemented-full-awaiting-review',
  },
  deferredRoles: [],
  styleContract: 'Use chunky one-to-three-pixel hard-alpha forms and an independently authored broad rear-heavy elite equine body. Keep a tall arched neck, long blunt readable muzzle, one connected breaker-like mane sweeping from poll to back, a massive deep barrel and sternum, four thick separated legs, four broad grounded dark hooves, and one thick connected hooked blackwake tail. The elite must be broader and more ominous than Drownbridle Stalker without becoming a Centaur horse body, horned or crowned Unicorn, Wolf, Crocodile, skeletal mount, armored or barded warhorse, or detached water effect.',
  effectBoundary: EN_E07_KELPIE_CONTRACT_CARD.effectBoundary,
});

export const EN_E07_BLACKWAKE_DREADMARE_CONTRACT = deepFreeze({
  sliceId: 'EN-E07',
  family: 'kelpie',
  variant: 'blackwake-dreadmare',
  role: 'elite',
  state: 'implemented-complete-motion-awaiting-review',
  chassis: 'broad-rear-heavy-arched-neck-long-blunt-muzzle-connected-breaker-mane-massive-barrel-deep-sternum-four-thick-separated-legs-broad-grounded-hooves-hooked-blackwake-tail-equine-v1',
  silhouette: "A broad rear-heavy grounded elite Kelpie with a tall arched neck, long blunt readable equine muzzle, one connected breaker mane sweeping from poll to back, a massive deep barrel and sternum, four thick separated legs, four broad dark grounded hooves, and a connected hooked blackwake tail. It must not collapse into Miremane Courser's lean body or Drownbridle Stalker's forward wedge, nor grow a humanoid rider or torso, horn, crown, canine wedge head, crocodilian belly, skeletal gaps, armor or barding plates, detached wake shapes, or copied mount geometry.",
  identity: 'Abyssal navy hide, drowned silver-blue belly planes, black-green breaker mane blocks, bruised-violet wake seams, paired sea-glass eyes, dark nostrils and mouth, and a connected jaw-open shoulder surge establish a self-contained elite Kelpie while all wake, foam, undertow, and illumination effects remain external.',
  effectBoundary: EN_E07_BLACKWAKE_DREADMARE_CONTRACT_CARD.effectBoundary,
});

export const EN_E07_BLACKWAKE_DREADMARE_DATA = deepFreeze({
  actor: {
    species: 'authored-kelpie-default',
    bodyBuild: 'broad-rear-heavy-breaker-backed-waterlogged-equine-elite',
    skin: 'abyssal-navy-drowned-hide',
    hairStyle: 'connected-breaker-mane-and-hooked-blackwake-tail',
    hairColor: 'black-green-drowned-silver',
    expression: 'deep-set-sea-glass-dreadmare-glare',
    faceDetail: 'long-blunt-muzzle-dark-nostrils-short-mouth-and-paired-sea-glass-eyes',
    headgear: 'none',
    outfit: 'drowned-silver-belly-deep-sternum-and-bruised-wake-seams',
    outfitColor: 'abyssal-blue-drowned-silver-and-bruised-violet',
    outfitTier: 'tier3',
    weapon: 'connected-jaw-open-shoulder-surge',
    weaponTier: 'none',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.body,
      hair: COLORS.mane,
      outfit: COLORS.belly,
    },
  },
  blackwakeDreadmare: COLORS,
  alphaPolicy: 'binary-single-component-broad-rear-heavy-tall-arched-neck-long-blunt-muzzle-connected-breaker-mane-massive-barrel-deep-sternum-four-thick-separated-legs-broad-grounded-hooves-and-connected-hooked-blackwake-tail',
  effectBoundary: EN_E07_BLACKWAKE_DREADMARE_CONTRACT_CARD.effectBoundary,
  bakedEffects: [],
});

export const EN_E07_BLACKWAKE_DREADMARE_GATE = deepFreeze({
  id: 'en-e07-kelpie-blackwake-dreadmare-full-v1',
  status: 'implemented-awaiting-review',
  baseCheckpoint: 'f9928aed53cd842b937d396e29ec8d6a7aaa8120',
  authorizedOn: '2026-08-11',
  authorizationEvidence: 'After the exact Drownbridle Stalker digest was visually approved, committed, pushed, and reconciled at clean published checkpoint f9928aed53cd842b937d396e29ec8d6a7aaa8120, the designer replied: approved lets do next. Drownbridle Stalker completed the frozen specialist Kelpie role, so the one-complete-sprite cadence authorizes only one private elite Kelpie Blackwake Dreadmare 80-frame candidate.',
  approvedOn: null,
  approvalEvidence: null,
  approvedImplementation: null,
  publicationAuthorizedOn: null,
  publicationAuthorizationEvidence: null,
  publishedImplementation: null,
  publishedApprovalRecord: null,
  initialPublishedHandoff: null,
  publicationState: 'not-published',
  precedingApproval: {
    gateId: EN_E07_DROWNBRIDLE_STALKER_GATE.id,
    artifactSha256: EN_E07_DROWNBRIDLE_STALKER_GATE.artifactSha256,
    assembledArtifactSha256: EN_E07_DROWNBRIDLE_STALKER_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E07_DROWNBRIDLE_STALKER_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E07_DROWNBRIDLE_STALKER_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E07_DROWNBRIDLE_STALKER_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E07_DROWNBRIDLE_STALKER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E07_DROWNBRIDLE_STALKER_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E07_DROWNBRIDLE_STALKER_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E07_DROWNBRIDLE_STALKER_GATE.initialPublishedHandoff,
    currentReconciliation: 'f9928aed53cd842b937d396e29ec8d6a7aaa8120',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e07-kelpie-blackwake-dreadmare/en-e07-kelpie-blackwake-dreadmare-full-suite-raw.png',
  artifactSha256: '2d902c8fafdb016affc2858fa332196fa1585f5013b2d5a80e07733da81d6e1f',
  assembledArtifact: 'enemy-expansion-review/en-e07-kelpie-blackwake-dreadmare/en-e07-kelpie-blackwake-dreadmare-full-suite-complete-b-form.png',
  assembledArtifactSha256: 'cb70a90ae5cfd604412e34b8dd980dca24b93f3db12c42e479920bc2cc44b891',
  comparisonArtifact: 'enemy-expansion-review/en-e07-kelpie-blackwake-dreadmare/en-e07-kelpie-blackwake-dreadmare-family-comparison.png',
  comparisonArtifactSha256: 'd0176a8dd8136b9cef40e1d97bf3322a02153f096512bf2099829241802919ed',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e07-kelpie-blackwake-dreadmare/en-e07-kelpie-blackwake-dreadmare-full-suite-four-directions-labeled.gif',
      sha256: '082ce13f2b2a72997d36b6738a643bde3b53a8df3c15ff035166b7cb256e4520',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e07-kelpie-blackwake-dreadmare/en-e07-kelpie-blackwake-dreadmare-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '60fb0e3f2db76113eb0b8d8f2615b9fd65cce31f1f5dfa1c1173d6251c4aa806',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
  },
  candidateFrameDigest: 'be29daec400cffca3f5822aec3bd6ca37c8139a8783f51c7238b47aa37001172',
  drownbridleComparisonDigest: EN_E07_DROWNBRIDLE_STALKER_GATE.candidateFrameDigest,
  miremaneComparisonDigest: EN_E07_MIREMANE_COURSER_GATE.candidateFrameDigest,
  steppeHunterComparisonDigest: '13c0273ffad557976ced07708a63e6b01df59e0edd5b5c4c79cc0e341a08f272',
  scope: 'One complete 80-frame Blackwake Dreadmare elite Kelpie across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle heaves and settles the connected breaker mane over the rear-heavy barrel. Walk uses four crushing diagonal hoof phases with a massive sternum and rump response while all four broad dark hooves remain readable. Attack draws the tall neck, opens the long blunt jaw, drives one connected shoulder-and-jaw surge, and recovers the elite equine form. Hurt uses a complete white recoil and colored collapsed-breaker four-hoof brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and approved Drownbridle Stalker, Miremane Courser, and Steppe Hunter silhouette comparisons together.',
  exclusions: [
    'changes to approved Drownbridle Stalker or Miremane Courser rendered pixels',
    'changes to approved Changeling, Living Shadow, Doppelganger, or Will-o-Wisp rendered pixels',
    'public Kelpie registration',
    'public catalog exposure',
    'asset-pack fixture generation or regeneration',
    'new Cast pixels',
    'new Death pixels',
    'Centaur humanoid torso or rider',
    'spear or saddle',
    'Unicorn horn or crown',
    'canine Wolf head or raised tail',
    'Crocodile belly or jaw',
    'skeletal horse gaps',
    'armor or barding plates',
    'copied mount body',
    'detached water sheets',
    'splashes',
    'foam',
    'ripples',
    'droplets',
    'mist',
    'glow',
    'particles',
    'projectiles',
    'impacts',
    'illumination',
    'effects',
    'release',
    'EN-E08 and later work',
  ],
  nextGate: 'Visual approval is required for the exact frozen Blackwake Dreadmare packet. Do not commit or push the candidate, register Kelpie, generate fixtures, add runtime copying or water effects, release, or advance EN-E08 before that approval.',
});

export const EN_E07_BLACKWAKE_DREADMARE_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'breaker-mane-heave', pose: 'idle', bob: 0, head: 0, mane: 0, stride: [0, 0, 0, 0] },
  { name: 'blackwake-barrel-settle', pose: 'idle', bob: 1, head: 0, mane: 1, stride: [0, 0, 0, 0] },
]);

const WALK_PHASES = deepFreeze([
  { name: 'near-fore-far-hind-crush', pose: 'walk', bob: 0, head: 0, mane: 0, stride: [-1, 1, 0, -1] },
  { name: 'massive-barrel-diagonal-pass', pose: 'walk', bob: -1, head: 0, mane: 1, stride: [0, 1, -1, 0] },
  { name: 'far-fore-near-hind-crush', pose: 'walk', bob: 0, head: 1, mane: 1, stride: [1, -1, 0, 1] },
  { name: 'blackwake-four-hoof-settle', pose: 'walk', bob: 1, head: 0, mane: 0, stride: [0, -1, 1, 0] },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'breaker-neck-draw', pose: 'draw', bob: 0, head: -1, mane: 0, stride: [0, 0, 0, 0] },
  { name: 'dreadmare-jaw-open', pose: 'gape', bob: 0, head: 1, mane: 1, stride: [-1, 0, 1, 0] },
  { name: 'connected-shoulder-jaw-surge', pose: 'surge', bob: 0, head: 0, mane: 0, stride: [-1, 1, 1, -1] },
  { name: 'blackwake-recover', pose: 'recover', bob: 1, head: 0, mane: 1, stride: [0, 0, 0, 0] },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-breaker-recoil', pose: 'hurt', bob: -1, head: 0, mane: 1, stride: [0, 0, 0, 0], flash: true },
  { name: 'colored-collapsed-breaker-brace', pose: 'brace', bob: 1, head: 1, mane: 0, stride: [-1, 1, 1, -1], flash: false },
]);

function createPixels() {
  return new Array(SIZE * SIZE).fill(null);
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Blackwake Dreadmare rectangles must use positive integer geometry.',
    );
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Blackwake Dreadmare authored pixels must remain inside the 24x24 cell.');
      pixels[(py * SIZE) + px] = fill;
    }
  };
  return {
    rect,
    dot(x, y, fill) { rect(x, y, 1, 1, fill); },
  };
}

function drawLegs(paint, bodyY, positions, stride) {
  for (let index = 0; index < positions.length; index++) {
    const x = positions[index];
    const upperX = x + stride[index];
    const legY = 13 + bodyY;
    paint.rect(upperX, legY, 3, 4, COLORS.body[1]);
    paint.rect(Math.min(x, upperX), legY, Math.abs(x - upperX) + 3, 1, COLORS.body[1]);
    paint.rect(Math.min(x, upperX), legY + 3, Math.abs(x - upperX) + 3, 1, COLORS.body[1]);
    const shinY = legY + 4;
    paint.rect(x, shinY, 2, 20 - shinY, COLORS.body[1]);
    paint.rect(x, 19, 2, 2, COLORS.belly[1]);
    paint.dot(x + 1, 20, COLORS.wake[1]);
    paint.rect(x, 21, 2, 2, COLORS.hoof);
  }
}

function drawSide(paint, phase) {
  const y = phase.bob;
  const surge = phase.pose === 'surge';
  const drawn = phase.pose === 'draw';
  const gape = phase.pose === 'gape';
  const collapsed = phase.pose === 'brace';
  const neckX = surge ? 4 : (drawn ? 6 : 5);

  const breakerY = 2 + y + phase.mane;
  paint.rect(neckX + 3, breakerY, 4, 4, COLORS.mane[2]);
  paint.rect(neckX + 5, breakerY + 2, 5, 5, COLORS.mane[0]);
  paint.rect(neckX + 8, breakerY + 5, 5, 4, COLORS.mane[1]);
  paint.rect(14, 6 + y, 5, 4, COLORS.mane[0]);

  paint.rect(13, 7 + y, 8, 5, COLORS.body[2]);
  paint.rect(8, 9 + y, 13, 7, COLORS.body[0]);
  paint.rect(6, 11 + y, 7, 7, COLORS.body[1]);
  paint.rect(9, 14 + y, 11, 3, COLORS.belly[0]);
  paint.rect(11, 11 + y, 9, 1, COLORS.wake[0]);
  paint.rect(8, 15 + y, 5, 1, COLORS.wake[1]);

  paint.rect(neckX, 4 + y, 6, 11, COLORS.body[0]);
  paint.rect(neckX + 3, 3 + y, 4, 10, COLORS.body[2]);
  paint.rect(neckX + 4, 7 + y, 3, 9, COLORS.body[1]);

  const headX = surge ? 1 : (drawn ? 3 : 2);
  const faceY = 3 + y + phase.head;
  const crownY = Math.max(1, faceY - 2);
  paint.rect(headX, faceY, 7, 4, COLORS.body[0]);
  paint.rect(headX + 2, crownY, 5, 2, COLORS.body[2]);
  const muzzleX = 1;
  paint.rect(muzzleX, faceY + 3, 8, 4, COLORS.belly[0]);
  if (gape) paint.rect(muzzleX + 1, faceY + 6, 7, 2, COLORS.belly[1]);
  paint.rect(headX + 4, crownY, 2, 3, COLORS.body[1]);
  paint.dot(headX + 2, faceY + 1, COLORS.eye);
  paint.dot(muzzleX, faceY + 4, COLORS.feature);
  paint.rect(headX + 3, faceY + 3, 3, 1, COLORS.wake[0]);
  paint.rect(muzzleX + 2, faceY + (gape ? 7 : 5), gape ? 5 : 3, 1, COLORS.feature);

  paint.rect(19, 9 + y, 3, 6, COLORS.mane[0]);
  paint.rect(21, 11 + y, 2, 8, COLORS.mane[1]);
  paint.rect(19, 16 + y, 3, 4, COLORS.mane[1]);
  paint.rect(18, 19 + y, 3, 2, COLORS.mane[0]);
  paint.dot(19, 18 + y, COLORS.wake[2]);

  drawLegs(paint, y, [5, 10, 15, 19], phase.stride);
  if (collapsed) paint.rect(6, 13 + y, 7, 5, COLORS.body[1]);
}

function drawDown(paint, phase) {
  const y = phase.bob;
  const faceY = 2 + y + phase.head;
  const spread = phase.pose === 'surge' ? 1 : 0;
  const gape = phase.pose === 'gape';

  const breakerY = 2 + y + phase.mane;
  paint.rect(5, breakerY + 2, 5, 6, COLORS.mane[2]);
  paint.rect(4, breakerY + 5, 5, 7, COLORS.mane[0]);
  paint.rect(5, breakerY + 10, 5, 5, COLORS.mane[1]);

  paint.rect(6 - spread, 8 + y, 12 + (spread * 2), 5, COLORS.body[2]);
  paint.rect(5 - spread, 11 + y, 14 + (spread * 2), 7, COLORS.body[0]);
  paint.rect(7 - spread, 14 + y, 10 + (spread * 2), 4, COLORS.belly[0]);
  paint.rect(6 - spread, 12 + y, 12 + (spread * 2), 1, COLORS.wake[0]);
  paint.rect(8, 4 + y, 8, 10, COLORS.body[0]);
  paint.rect(9, 6 + y, 7, 7, COLORS.body[2]);

  const crownY = Math.max(1, faceY - 1);
  paint.rect(8, faceY + 1, 8, 5, COLORS.body[0]);
  paint.rect(9, faceY, 6, 2, COLORS.body[2]);
  paint.rect(7, faceY + 5, 10, 4, COLORS.belly[0]);
  if (gape) paint.rect(8, faceY + 8, 8, 2, COLORS.belly[1]);
  paint.rect(7, crownY, 2, 3, COLORS.body[1]);
  paint.rect(15, crownY, 2, 3, COLORS.body[1]);
  paint.dot(10, faceY + 3, COLORS.eye);
  paint.dot(13, faceY + 3, COLORS.eye);
  paint.dot(9, faceY + 7, COLORS.feature);
  paint.dot(14, faceY + 7, COLORS.feature);
  paint.dot(8, faceY + 4, COLORS.wake[2]);
  paint.dot(15, faceY + 4, COLORS.wake[2]);
  paint.rect(10, faceY + (gape ? 9 : 8), 4, 1, COLORS.feature);

  drawLegs(paint, y, [4, 9, 14, 19], phase.stride);
}

function drawUp(paint, phase) {
  const y = phase.bob;
  const headY = 2 + y + phase.head;
  const spread = phase.pose === 'surge' ? 1 : 0;
  const breakerY = 2 + y + phase.mane;

  paint.rect(5, breakerY + 1, 5, 7, COLORS.mane[2]);
  paint.rect(4, breakerY + 5, 5, 8, COLORS.mane[0]);
  paint.rect(5, breakerY + 11, 5, 5, COLORS.mane[1]);

  paint.rect(6 - spread, 8 + y, 12 + (spread * 2), 6, COLORS.body[2]);
  paint.rect(5 - spread, 10 + y, 14 + (spread * 2), 8, COLORS.body[0]);
  paint.rect(7 - spread, 14 + y, 10 + (spread * 2), 4, COLORS.belly[1]);
  paint.rect(7 - spread, 11 + y, 11 + (spread * 2), 1, COLORS.wake[0]);
  paint.rect(8, 4 + y, 8, 10, COLORS.body[0]);
  paint.rect(9, headY, 6, 6, COLORS.body[1]);
  paint.rect(7, Math.max(1, headY - 1), 2, 3, COLORS.body[1]);
  paint.rect(15, Math.max(1, headY - 1), 2, 3, COLORS.body[1]);
  paint.rect(10, 6 + y, 5, 2, COLORS.body[2]);

  paint.rect(17, 10 + y, 4, 6, COLORS.mane[0]);
  paint.rect(20, 12 + y, 3, 8, COLORS.mane[1]);
  paint.rect(18, 18 + y, 4, 3, COLORS.mane[0]);
  paint.dot(19, 17 + y, COLORS.wake[2]);

  drawLegs(paint, y, [4, 9, 14, 19], phase.stride);
}

function mirrorPixels(pixels) {
  const mirrored = createPixels();
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    mirrored[(y * SIZE) + (SIZE - 1 - x)] = pixels[(y * SIZE) + x];
  }
  return mirrored;
}

function phaseFor(animation, frame) {
  if (animation === 'idle') {
    assert(frame >= 0 && frame < 2, 'Frame ' + frame + ' is invalid for idle.');
    return IDLE_PHASES[frame];
  }
  if (animation === 'walk') {
    assert(frame >= 0 && frame < 4, 'Frame ' + frame + ' is invalid for walk.');
    return WALK_PHASES[frame];
  }
  if (animation === 'attack' || animation === 'cast') {
    assert(frame >= 0 && frame < 4, 'Frame ' + frame + ' is invalid for ' + animation + '.');
    return ATTACK_PHASES[frame];
  }
  if (animation === 'hurt') {
    assert(frame >= 0 && frame < 2, 'Frame ' + frame + ' is invalid for hurt.');
    return HURT_PHASES[frame];
  }
  if (animation === 'death') {
    assert(frame >= 0 && frame < 4, 'Frame ' + frame + ' is invalid for death.');
    return HURT_PHASES[EN_E07_BLACKWAKE_DREADMARE_DEATH_SOURCE_FRAMES[frame]];
  }
  throw new TypeError('Animation ' + animation + ' is not implemented for Blackwake Dreadmare.');
}

function buildPixels(direction, animation, frame) {
  const phase = phaseFor(animation, frame);
  const canonical = direction === 'right' ? 'left' : direction;
  const pixels = createPixels();
  const paint = painter(pixels);
  if (canonical === 'down') drawDown(paint, phase);
  else if (canonical === 'up') drawUp(paint, phase);
  else if (canonical === 'left') drawSide(paint, phase);
  else throw new TypeError('Unsupported Blackwake Dreadmare direction ' + direction + '.');
  let rendered = direction === 'right' ? mirrorPixels(pixels) : pixels;
  if (phase.flash) rendered = rendered.map((color) => color ? COLORS.flash : null);
  return { phase, pixels: rendered };
}

function paintPixels(context, pixels) {
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    const color = pixels[(y * SIZE) + x];
    if (!color) continue;
    context.fillStyle = color;
    context.fillRect(x, y, 1, 1);
  }
}

export function renderEnE07BlackwakeDreadmareFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Blackwake Dreadmare rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Blackwake Dreadmare direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'kelpie',
    variant: 'blackwake-dreadmare',
    direction,
    animation,
    frame,
    phase: phase.name,
    blackwakeDreadmareGate: EN_E07_BLACKWAKE_DREADMARE_GATE.id,
    approvedPrecedingGate: EN_E07_DROWNBRIDLE_STALKER_GATE.id,
    alphaPolicy: EN_E07_BLACKWAKE_DREADMARE_DATA.alphaPolicy,
    effectBoundary: EN_E07_BLACKWAKE_DREADMARE_DATA.effectBoundary,
  });
}

export const EN_E07_BLACKWAKE_DREADMARE_RENDERER = deepFreeze({
  key: 'en-e07-kelpie-blackwake-dreadmare-v1',
  chassis: EN_E07_BLACKWAKE_DREADMARE_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'kelpie', 'The EN-E07 Blackwake Dreadmare renderer is restricted to Kelpie.');
    assert(variant.id === 'blackwake-dreadmare', 'The EN-E07 Blackwake Dreadmare renderer is restricted to Blackwake Dreadmare.');
    return renderEnE07BlackwakeDreadmareFrame(context, direction, animation.id, frame);
  },
});

const BLACKWAKE_DREADMARE_VARIANT = deepFreeze({
  id: 'blackwake-dreadmare',
  name: 'Blackwake Dreadmare',
  role: EN_E07_BLACKWAKE_DREADMARE_CONTRACT.role,
  status: EN_E07_BLACKWAKE_DREADMARE_CONTRACT.state,
  brief: 'A private complete elite Kelpie with a broad rear-heavy equine body, tall arched neck, long blunt readable muzzle, one connected breaker mane, massive deep barrel and sternum, four thick separated legs with broad grounded dark hooves, and one connected hooked blackwake tail; riders, horns, armor or barding, copied mounts, and water effects remain external.',
  rendererData: EN_E07_BLACKWAKE_DREADMARE_DATA,
});

export const EN_E07_BLACKWAKE_DREADMARE_FAMILY = deepFreeze({
  id: 'kelpie',
  name: 'Kelpie Blackwake Dreadmare Review',
  sliceId: 'EN-E07',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E07_BLACKWAKE_DREADMARE_CONTRACT.chassis,
  rendererKey: EN_E07_BLACKWAKE_DREADMARE_RENDERER.key,
  variants: [BLACKWAKE_DREADMARE_VARIANT],
  rendererData: {
    contractCard: EN_E07_BLACKWAKE_DREADMARE_CONTRACT_CARD.id,
    approvedPrecedingGate: EN_E07_DROWNBRIDLE_STALKER_GATE.id,
    activeGate: EN_E07_BLACKWAKE_DREADMARE_GATE.id,
  },
  review: {
    baselineVariant: 'blackwake-dreadmare',
    scale: 8,
    notes: 'Awaiting visual approval as one broad rear-heavy breaker-maned Blackwake Dreadmare elite against approved Drownbridle Stalker and Miremane Courser plus Steppe Hunter. Keep registration, fixtures, runtime copying, water effects, release, and later Wave 2 work separate.',
  },
});

export const EN_E07_BLACKWAKE_DREADMARE_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E07_BLACKWAKE_DREADMARE_RENDERER],
  families: [EN_E07_BLACKWAKE_DREADMARE_FAMILY],
});
