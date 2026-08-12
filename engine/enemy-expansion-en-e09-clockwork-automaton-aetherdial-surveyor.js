import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E08_RUNEFORGE_CUSTODIAN_GATE } from './enemy-expansion-en-e08-animated-armor-runeforge-custodian.js';
import {
  EN_E09_ARCANE_CONSTRUCT_CONTRACT_CARD,
  EN_E09_BRASSCOIL_SENTRY_GATE,
  EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION,
} from './enemy-expansion-en-e09-clockwork-automaton-brasscoil-sentry.js';

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
  verdigris: ['#4d8977', '#285449', '#78b49e'],
  brass: ['#b8883c', '#6b4625', '#e0bd68'],
  iron: ['#657077', '#2d363b', '#aab7b5'],
  coil: ['#315e78', '#19384c', '#79c9d5'],
  joint: ['#3d3430', '#15191b', '#795f4d'],
  cavity: ['#20242a', '#080b0e'],
  lens: '#d9f6df',
  flash: '#f4f4f4',
});

export const EN_E09_AETHERDIAL_SURVEYOR_CONTRACT_CARD = deepFreeze({
  id: 'en-e09-clockwork-automaton-aetherdial-surveyor-v1',
  sliceId: 'EN-E09',
  family: 'clockwork-automaton',
  familyName: 'Clockwork Automaton',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingVariant: {
    id: 'brasscoil-sentry',
    name: 'Brasscoil Sentry',
    role: 'common',
    identity: 'boiler-gear-piston-default',
    status: 'approved-published',
  },
  activeVariant: {
    id: 'aetherdial-surveyor',
    name: 'Aetherdial Surveyor',
    role: 'specialist',
    identity: 'cyclopean-dial-coil-projector-surveyor',
    status: 'implemented-full-awaiting-visual-approval',
  },
  deferredRoles: ['elite'],
  actorTopology: EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION.selected,
  styleContract: 'Use chunky one-to-three-pixel hard-alpha forms and a tall narrow surveyor silhouette. Keep one oversized cyclopean dial head, a connected tuning-fork crown, a slim verdigris chassis with an exposed chest flywheel, one integrated coil-projector forearm, articulated counterweight arm, and three-prong planted feet. The machine must remain one baked actor without armor anatomy, flesh, cloth, handheld equipment, detached parts, projectiles, sparks, glow, or child assets.',
  effectBoundary: EN_E09_ARCANE_CONSTRUCT_CONTRACT_CARD.effectBoundary,
});

export const EN_E09_AETHERDIAL_SURVEYOR_CONTRACT = deepFreeze({
  sliceId: 'EN-E09',
  family: 'clockwork-automaton',
  variant: 'aetherdial-surveyor',
  role: 'specialist',
  identity: 'cyclopean-dial-coil-projector-surveyor',
  state: 'implemented-complete-motion-awaiting-visual-approval',
  topology: EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION.selected,
  chassis: 'baked-single-actor-tuning-fork-crown-cyclopean-dial-slim-chassis-flywheel-coil-projector-counterweight-arms-three-prong-feet-v1',
  silhouette: 'A tall narrow mechanical surveyor with a connected tuning-fork crown, oversized circular lens dial, slim chassis, exposed chest flywheel, one integrated projector forearm, counterweight arm, long piston legs, and three-prong planted feet. It must read as a precision clockwork instrument rather than squat Brasscoil Sentry, Animated Armor, Fallen Knight, humanoid in plate, or detached equipment set.',
  visualIdentity: 'Verdigris shell, brass dial rim, dark iron spine, turquoise coil bands, black joints, one large pale lens, chest flywheel, and forked crown communicate a precision specialist automaton. No visor, pauldrons, breastplate anatomy, flesh, cloth, handheld weapon, shield, projectile, aura, sparks, or detached component is used.',
  effectBoundary: EN_E09_AETHERDIAL_SURVEYOR_CONTRACT_CARD.effectBoundary,
});

export const EN_E09_AETHERDIAL_SURVEYOR_DATA = deepFreeze({
  actor: {
    species: 'baked-clockwork-automaton',
    bodyBuild: 'tall-narrow-optical-surveyor-machine',
    skin: 'none',
    hairStyle: 'none',
    hairColor: 'none',
    expression: 'oversized-readable-cyclopean-dial',
    faceDetail: 'brass-rimmed-pale-optic-with-connected-tuning-fork-crown',
    headgear: 'none',
    outfit: 'baked-verdigris-chassis-flywheel-projector-counterweight-legs-and-crown',
    outfitColor: 'verdigris-brass-dark-iron-and-turquoise-coil',
    outfitTier: 'tier2',
    weapon: 'integrated-coil-projector-forearm',
    weaponTier: 'none',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.joint,
      hair: COLORS.coil,
      outfit: COLORS.verdigris,
    },
  },
  aetherdialSurveyor: COLORS,
  actorTopology: EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION.selected,
  childAssets: [],
  alphaPolicy: 'binary-single-component-baked-tuning-fork-crown-cyclopean-dial-slim-chassis-flywheel-coil-projector-counterweight-arms-long-legs-three-prong-feet-and-ground-contact',
  effectBoundary: EN_E09_AETHERDIAL_SURVEYOR_CONTRACT_CARD.effectBoundary,
  bakedEffects: [],
});

export const EN_E09_AETHERDIAL_SURVEYOR_GATE = deepFreeze({
  id: 'en-e09-clockwork-automaton-aetherdial-surveyor-full-v1',
  status: 'implemented-awaiting-visual-approval',
  baseCheckpoint: '8037f0ccbb042bf041e01ecbe18b1c567567e409',
  authorizedOn: '2026-08-12',
  authorizationEvidence: 'After the exact Brasscoil Sentry publication tuple was clean and remote verified at checkpoint 8037f0ccbb042bf041e01ecbe18b1c567567e409, the designer replied: lets do next. Under the selected en-e09-clockwork-automaton-baked-single-actor-v1 topology and one-complete-sprite cadence, this authorizes only one private specialist Aetherdial Surveyor 80-frame art candidate. Registration, fixtures, effects, child assets, the elite role, later families, release, accepted drift, and a pull request remain closed.',
  architectureDecision: EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION.id,
  approvedOn: null,
  approvalEvidence: null,
  approvedImplementation: null,
  publicationAuthorizedOn: '2026-08-12',
  publicationAuthorizationEvidence: 'The designer said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact artifact or digest. It does not authorize registration, fixtures, child/state assets, effects, later roles or families, release, accepted drift, a pull request, or any other unopened gate.',
  publishedImplementation: null,
  publishedApprovalRecord: null,
  initialPublishedHandoff: null,
  publicationState: 'not-approved',
  precedingApproval: {
    gateId: EN_E09_BRASSCOIL_SENTRY_GATE.id,
    artifactSha256: EN_E09_BRASSCOIL_SENTRY_GATE.artifactSha256,
    assembledArtifactSha256: EN_E09_BRASSCOIL_SENTRY_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E09_BRASSCOIL_SENTRY_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E09_BRASSCOIL_SENTRY_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E09_BRASSCOIL_SENTRY_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E09_BRASSCOIL_SENTRY_GATE.candidateFrameDigest,
    publishedImplementation: EN_E09_BRASSCOIL_SENTRY_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E09_BRASSCOIL_SENTRY_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E09_BRASSCOIL_SENTRY_GATE.initialPublishedHandoff,
    currentReconciliation: '8037f0ccbb042bf041e01ecbe18b1c567567e409',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e09-clockwork-automaton-aetherdial-surveyor/en-e09-clockwork-automaton-aetherdial-surveyor-full-suite-raw.png',
  artifactSha256: '4778dd43e09e2f3816b69abbcca85900e2838194638dd088e55b3047b497babd',
  assembledArtifact: 'enemy-expansion-review/en-e09-clockwork-automaton-aetherdial-surveyor/en-e09-clockwork-automaton-aetherdial-surveyor-full-suite-complete-b-form.png',
  assembledArtifactSha256: '3a2111896a5eb6198b17f4110927cafd5961ed58ba83bf09747d27f42d1a2b57',
  comparisonArtifact: 'enemy-expansion-review/en-e09-clockwork-automaton-aetherdial-surveyor/en-e09-clockwork-automaton-aetherdial-surveyor-family-comparison.png',
  comparisonArtifactSha256: 'ea42855b38ae0b0ecebfa2a770a31c896b4666252fbe01618acde1cb88064f7a',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e09-clockwork-automaton-aetherdial-surveyor/en-e09-clockwork-automaton-aetherdial-surveyor-full-suite-four-directions-labeled.gif',
      sha256: 'd6eec578bc68d6662d758d776c3d9119ed307b8171a3b711c2c12670fd46fd7a',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e09-clockwork-automaton-aetherdial-surveyor/en-e09-clockwork-automaton-aetherdial-surveyor-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: 'e7916001025dcfa3b40b0ee93cad2cde28d638ec10c49c2b42de2d3f55d73ff5',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
  },
  candidateFrameDigest: 'e42453d23d110a5f4328a67b2beb6a83cb3e6a3ca3f51b2e891a82efd18f3627',
  brasscoilComparisonDigest: EN_E09_BRASSCOIL_SENTRY_GATE.candidateFrameDigest,
  runeforgeComparisonDigest: EN_E08_RUNEFORGE_CUSTODIAN_GATE.candidateFrameDigest,
  fallenKnightComparisonDigest: '54a82b2784cee40215221782b502341ee574a722c1416292e5dddf2fcce403ed',
  revenantComparisonDigest: 'f53fa853e7fb7aebc232e3ca1903d8a4d1d717de02576c51fe81f4c4d5b90079',
  scope: 'One complete 80-frame Aetherdial Surveyor specialist Clockwork Automaton across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle calibrates the connected fork crown and chest flywheel. Walk uses four tall piston strides with the counterweight and projector arms opposed. Attack raises and focuses the integrated coil-projector, performs a body-owned recoil with no projectile pixels, and recovers. Hurt uses a complete white recoil and colored tripod brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and approved Brasscoil Sentry, approved Runeforge Custodian, and public Fallen Knight Shieldbearer family comparisons together.',
  exclusions: [
    'changes to approved Brasscoil Sentry or earlier rendered pixels',
    'public Clockwork Automaton registration',
    'public catalog or facade exposure',
    'asset-pack fixture or manifest changes',
    'schema changes',
    'shared renderer changes',
    'exporter changes',
    'validator changes',
    'frame-contract changes',
    'deterministic child/state exports',
    'runtime attachment offsets',
    'incidental per-frame child offsets',
    'separate helmet, gauntlet, or weapon assets',
    'new Cast pixels',
    'new Death pixels',
    'living face or exposed flesh',
    'corpse hands or skeleton gaps',
    'robe body or shadow mantle',
    'detached gears or winding keys',
    'handheld weapon or shield',
    'detached or floating armor pieces',
    'soul wisps',
    'aura',
    'glow',
    'particles',
    'projectiles',
    'weapon trails',
    'sparks',
    'dust',
    'impacts',
    'illumination',
    'effects',
    'elite Clockwork Automaton',
    'Living Book, Runic Idol, Crystal Beast, or later work',
    'release',
    'accepted drift',
  ],
  nextGate: 'Stop for explicit visual approval or rejection of the exact Aetherdial Surveyor digest and five frozen review hashes. Do not commit, publish, register, generate fixtures, add child assets or effects, begin the elite role or another family, release, accept drift, or open a pull request without a new explicit decision.',
});

export const EN_E09_AETHERDIAL_SURVEYOR_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'fork-crown-calibrate', pose: 'idle', bob: 0, arm: -1, step: 0 },
  { name: 'chest-flywheel-index', pose: 'idle', bob: 1, arm: 1, step: 0 },
]);

const WALK_PHASES = deepFreeze([
  { name: 'left-surveyor-stride', pose: 'walk', bob: 0, arm: 1, step: -1 },
  { name: 'high-tripod-pass', pose: 'walk', bob: -1, arm: -1, step: 0 },
  { name: 'right-surveyor-stride', pose: 'walk', bob: 0, arm: -1, step: 1 },
  { name: 'flywheel-settle', pose: 'walk', bob: 1, arm: 1, step: 0 },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'projector-raise', pose: 'aim', bob: 1, arm: 0, step: 0 },
  { name: 'dial-focus', pose: 'focus', bob: -1, arm: -1, step: -1 },
  { name: 'body-owned-projector-recoil', pose: 'recoil', bob: 0, arm: 1, step: 1 },
  { name: 'aetherdial-recover', pose: 'recover', bob: 1, arm: 0, step: 0 },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-surveyor-recoil', pose: 'hurt', bob: -1, arm: -1, step: -1, flash: true },
  { name: 'colored-tripod-brace', pose: 'brace', bob: 1, arm: 1, step: 1, flash: false },
]);

function createPixels() {
  return new Array(SIZE * SIZE).fill(null);
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Aetherdial Surveyor rectangles must use positive integer geometry.',
    );
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Aetherdial Surveyor authored pixels must remain inside the 24x24 cell.');
      pixels[(py * SIZE) + px] = fill;
    }
  };
  return {
    rect,
    dot(x, y, fill) { rect(x, y, 1, 1, fill); },
  };
}

function drawFrontLegs(paint, phase) {
  const leftX = 7 + Math.min(phase.step, 0);
  const rightX = 15 + Math.max(phase.step, 0);
  paint.rect(9, 16, 8, 3, COLORS.iron[1]);
  paint.rect(leftX, 17, 3, 5, COLORS.joint[2]);
  paint.rect(11, 18, 2, 4, COLORS.iron[0]);
  paint.rect(rightX, 17, 3, 5, COLORS.joint[1]);
  paint.rect(leftX - 2, 21, 5, 2, COLORS.verdigris[1]);
  paint.rect(9, 21, 5, 2, COLORS.brass[1]);
  paint.rect(rightX, 21, 5, 2, COLORS.verdigris[0]);
  paint.dot(leftX - 2, 22, COLORS.cavity[1]);
  paint.dot(13, 22, COLORS.cavity[1]);
  paint.dot(rightX + 4, 22, COLORS.cavity[1]);
}

function drawFrontArms(paint, phase, y) {
  const leftDrop = Math.max(phase.arm, 0);
  const rightDrop = Math.max(-phase.arm, 0);
  // Connected counterweight arm.
  paint.rect(5, 10 + y, 5, 3, COLORS.iron[1]);
  paint.rect(3, 12 + y + leftDrop, 5, 3, COLORS.verdigris[1]);
  paint.rect(2, 13 + y + leftDrop, 3, 3, COLORS.brass[1]);
  paint.dot(6, 11 + y, COLORS.joint[2]);

  // Integrated coil-projector forearm; no projectile pixels.
  if (phase.pose === 'focus') {
    paint.rect(14, 9 + y, 6, 3, COLORS.iron[0]);
    paint.rect(18, 7 + y, 5, 5, COLORS.verdigris[0]);
    paint.rect(19, 8 + y, 2, 3, COLORS.coil[2]);
    paint.rect(21, 8 + y, 2, 3, COLORS.brass[0]);
  } else if (phase.pose === 'recoil') {
    paint.rect(14, 11 + y, 6, 3, COLORS.iron[0]);
    paint.rect(18, 12 + y, 5, 4, COLORS.verdigris[0]);
    paint.rect(19, 13 + y, 2, 2, COLORS.coil[1]);
    paint.rect(21, 13 + y, 2, 2, COLORS.brass[1]);
  } else if (phase.pose === 'aim') {
    paint.rect(14, 9 + y, 5, 3, COLORS.iron[0]);
    paint.rect(17, 8 + y, 5, 5, COLORS.verdigris[0]);
    paint.rect(18, 9 + y, 2, 3, COLORS.coil[2]);
    paint.rect(20, 9 + y, 2, 3, COLORS.brass[0]);
  } else {
    paint.rect(14, 10 + y, 5, 3, COLORS.iron[0]);
    paint.rect(17, 12 + y + rightDrop, 5, 4, COLORS.verdigris[0]);
    paint.rect(19, 13 + y + rightDrop, 3, 2, COLORS.coil[1]);
  }
  paint.dot(17, 11 + y, COLORS.joint[2]);
}

function drawFront(paint, phase, rear) {
  const y = phase.bob;
  drawFrontLegs(paint, phase);

  // Slim instrument chassis and exposed connected flywheel.
  paint.rect(9, 9 + y, 6, 2, COLORS.iron[2]);
  paint.rect(8, 11 + y, 8, 6, COLORS.verdigris[0]);
  paint.rect(9, 12 + y, 6, 5, COLORS.iron[1]);
  paint.rect(10, 12 + y, 4, 4, COLORS.cavity[0]);
  paint.rect(11, 13 + y, 2, 2, COLORS.brass[2]);
  paint.dot(10, 12 + y, COLORS.brass[0]);
  paint.dot(13, 12 + y, COLORS.brass[0]);
  paint.dot(10, 15 + y, COLORS.brass[1]);
  paint.dot(13, 15 + y, COLORS.brass[1]);
  if (rear) {
    paint.rect(10, 11 + y, 4, 6, COLORS.iron[1]);
    paint.rect(11, 12 + y, 2, 4, COLORS.coil[1]);
    paint.dot(11, 13 + y, COLORS.coil[2]);
  }
  drawFrontArms(paint, phase, y);

  // Oversized cyclopean dial and connected tuning-fork crown.
  const headY = 3 + y;
  paint.rect(9, 2 + y, 2, 3, COLORS.brass[1]);
  paint.rect(14, 2 + y, 2, 3, COLORS.brass[0]);
  paint.rect(10, 3 + y, 5, 2, COLORS.iron[2]);
  paint.rect(8, headY + 1, 8, 5, COLORS.brass[0]);
  paint.rect(9, headY + 2, 6, 4, COLORS.verdigris[1]);
  if (rear) {
    paint.rect(10, headY + 2, 4, 3, COLORS.iron[1]);
    paint.rect(11, headY + 3, 2, 2, COLORS.coil[1]);
  } else {
    paint.rect(10, headY + 2, 4, 3, COLORS.cavity[1]);
    paint.rect(11, headY + 3, 2, 2, COLORS.lens);
  }
}

function drawSideLegs(paint, phase) {
  const farX = 8 + Math.min(phase.step, 0);
  const nearX = 14 + Math.max(phase.step, 0);
  paint.rect(10, 16, 5, 3, COLORS.iron[1]);
  paint.rect(farX, 17, 3, 5, COLORS.joint[2]);
  paint.rect(11, 18, 2, 4, COLORS.iron[0]);
  paint.rect(nearX, 17, 3, 5, COLORS.joint[1]);
  paint.rect(farX - 2, 21, 5, 2, COLORS.verdigris[1]);
  paint.rect(10, 21, 5, 2, COLORS.brass[1]);
  paint.rect(nearX, 21, 5, 2, COLORS.verdigris[0]);
}

function drawSideArms(paint, phase, y) {
  const swing = phase.arm;
  paint.rect(7, 10 + y, 5, 3, COLORS.iron[1]);
  paint.rect(5, 12 + y + Math.max(swing, 0), 5, 3, COLORS.verdigris[1]);
  paint.rect(4, 13 + y + Math.max(swing, 0), 3, 3, COLORS.brass[1]);
  if (phase.pose === 'focus') {
    paint.rect(14, 8 + y, 7, 3, COLORS.iron[0]);
    paint.rect(19, 7 + y, 4, 5, COLORS.verdigris[0]);
    paint.rect(20, 8 + y, 2, 3, COLORS.coil[2]);
    paint.rect(22, 8 + y, 1, 3, COLORS.brass[0]);
  } else if (phase.pose === 'recoil') {
    paint.rect(14, 11 + y, 6, 3, COLORS.iron[0]);
    paint.rect(18, 12 + y, 5, 4, COLORS.verdigris[0]);
    paint.rect(19, 13 + y, 2, 2, COLORS.coil[1]);
    paint.rect(21, 13 + y, 2, 2, COLORS.brass[1]);
  } else if (phase.pose === 'aim') {
    paint.rect(14, 9 + y, 6, 3, COLORS.iron[0]);
    paint.rect(18, 8 + y, 5, 5, COLORS.verdigris[0]);
    paint.rect(19, 9 + y, 2, 3, COLORS.coil[2]);
    paint.rect(21, 9 + y, 2, 3, COLORS.brass[0]);
  } else {
    paint.rect(14, 10 + y, 5, 3, COLORS.iron[0]);
    paint.rect(17, 12 + y + Math.max(-swing, 0), 5, 4, COLORS.verdigris[0]);
    paint.rect(19, 13 + y + Math.max(-swing, 0), 3, 2, COLORS.coil[1]);
  }
  paint.dot(9, 11 + y, COLORS.joint[2]);
  paint.dot(17, 11 + y, COLORS.joint[2]);
}

function drawSide(paint, phase) {
  const y = phase.bob;
  drawSideLegs(paint, phase);

  paint.rect(9, 9 + y, 6, 2, COLORS.iron[2]);
  paint.rect(8, 11 + y, 8, 6, COLORS.verdigris[0]);
  paint.rect(10, 12 + y, 6, 5, COLORS.iron[1]);
  paint.rect(12, 12 + y, 4, 4, COLORS.cavity[0]);
  paint.rect(13, 13 + y, 2, 2, COLORS.brass[2]);
  paint.dot(12, 12 + y, COLORS.brass[0]);
  paint.dot(15, 15 + y, COLORS.brass[1]);
  drawSideArms(paint, phase, y);

  const headY = 3 + y;
  paint.rect(10, 2 + y, 2, 3, COLORS.brass[1]);
  paint.rect(15, 2 + y, 2, 3, COLORS.brass[0]);
  paint.rect(11, 3 + y, 5, 2, COLORS.iron[2]);
  paint.rect(9, headY + 1, 8, 5, COLORS.brass[0]);
  paint.rect(10, headY + 2, 7, 4, COLORS.verdigris[1]);
  paint.rect(13, headY + 2, 4, 3, COLORS.cavity[1]);
  paint.rect(15, headY + 3, 2, 2, COLORS.lens);
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
    return HURT_PHASES[EN_E09_AETHERDIAL_SURVEYOR_DEATH_SOURCE_FRAMES[frame]];
  }
  throw new TypeError('Animation ' + animation + ' is not implemented for Aetherdial Surveyor.');
}

function buildPixels(direction, animation, frame) {
  const phase = phaseFor(animation, frame);
  const canonical = direction === 'left' ? 'right' : direction;
  const pixels = createPixels();
  const paint = painter(pixels);
  if (canonical === 'down') drawFront(paint, phase, false);
  else if (canonical === 'up') drawFront(paint, phase, true);
  else if (canonical === 'right') drawSide(paint, phase);
  else throw new TypeError('Unsupported Aetherdial Surveyor direction ' + direction + '.');
  let rendered = direction === 'left' ? mirrorPixels(pixels) : pixels;
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

export function renderEnE09AetherdialSurveyorFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Aetherdial Surveyor rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Aetherdial Surveyor direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'clockwork-automaton',
    variant: 'aetherdial-surveyor',
    direction,
    animation,
    frame,
    phase: phase.name,
    aetherdialSurveyorGate: EN_E09_AETHERDIAL_SURVEYOR_GATE.id,
    approvedPrecedingGate: EN_E09_BRASSCOIL_SENTRY_GATE.id,
    actorTopology: EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION.selected,
    childAssetCount: EN_E09_AETHERDIAL_SURVEYOR_DATA.childAssets.length,
    alphaPolicy: EN_E09_AETHERDIAL_SURVEYOR_DATA.alphaPolicy,
    effectBoundary: EN_E09_AETHERDIAL_SURVEYOR_DATA.effectBoundary,
  });
}

export const EN_E09_AETHERDIAL_SURVEYOR_RENDERER = deepFreeze({
  key: 'en-e09-clockwork-automaton-aetherdial-surveyor-v1',
  chassis: EN_E09_AETHERDIAL_SURVEYOR_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'clockwork-automaton', 'The EN-E09 Aetherdial Surveyor renderer is restricted to Clockwork Automaton.');
    assert(variant.id === 'aetherdial-surveyor', 'The EN-E09 Aetherdial Surveyor renderer is restricted to Aetherdial Surveyor.');
    return renderEnE09AetherdialSurveyorFrame(context, direction, animation.id, frame);
  },
});

const AETHERDIAL_SURVEYOR_VARIANT = deepFreeze({
  id: 'aetherdial-surveyor',
  name: 'Aetherdial Surveyor',
  role: EN_E09_AETHERDIAL_SURVEYOR_CONTRACT.role,
  status: EN_E09_AETHERDIAL_SURVEYOR_CONTRACT.state,
  brief: 'A private complete specialist Clockwork Automaton using one baked 24x24 actor: connected tuning-fork crown, oversized cyclopean dial, slim verdigris chassis, exposed chest flywheel, integrated coil-projector, counterweight arm, long piston legs, and three-prong feet; child assets, projectiles, detached parts, sparks, weapons, shields, and effects remain external.',
  rendererData: EN_E09_AETHERDIAL_SURVEYOR_DATA,
});

export const EN_E09_AETHERDIAL_SURVEYOR_FAMILY = deepFreeze({
  id: 'clockwork-automaton',
  name: 'Clockwork Automaton Aetherdial Surveyor Review',
  sliceId: 'EN-E09',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E09_AETHERDIAL_SURVEYOR_CONTRACT.chassis,
  rendererKey: EN_E09_AETHERDIAL_SURVEYOR_RENDERER.key,
  variants: [AETHERDIAL_SURVEYOR_VARIANT],
  rendererData: {
    contractCard: EN_E09_AETHERDIAL_SURVEYOR_CONTRACT_CARD.id,
    architectureDecision: EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E09_BRASSCOIL_SENTRY_GATE.id,
    activeGate: EN_E09_AETHERDIAL_SURVEYOR_GATE.id,
  },
  review: {
    baselineVariant: 'aetherdial-surveyor',
    scale: 8,
    notes: 'Awaiting visual review as one connected baked specialist Aetherdial Surveyor against approved Brasscoil Sentry, approved Runeforge Custodian, and public Fallen Knight Shieldbearer. Keep registration, fixtures, child assets, effects, the elite role, later families, release, accepted drift, and a pull request separate.',
  },
});

export const EN_E09_AETHERDIAL_SURVEYOR_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E09_AETHERDIAL_SURVEYOR_RENDERER],
  families: [EN_E09_AETHERDIAL_SURVEYOR_FAMILY],
});
