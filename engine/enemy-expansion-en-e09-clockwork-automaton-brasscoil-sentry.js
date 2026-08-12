import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E08_CROWNMAW_GREATBLADE_GATE } from './enemy-expansion-en-e08-living-weapon-crownmaw-greatblade.js';
import { EN_E08_RUNEFORGE_CUSTODIAN_GATE } from './enemy-expansion-en-e08-animated-armor-runeforge-custodian.js';

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
  brass: ['#a87532', '#5b3b1f', '#ddb45d'],
  iron: ['#68747a', '#303a40', '#b4c0bd'],
  coil: ['#315f72', '#183442', '#73bed0'],
  joint: ['#40342d', '#17191b', '#80624b'],
  cavity: ['#242126', '#090a0b'],
  lens: '#a9f1e6',
  plate: ['#68747a', '#303a40', '#b4c0bd'],
  forge: ['#a87532', '#5b3b1f', '#ddb45d'],
  rune: ['#315f72', '#183442', '#73bed0'],
  aperture: '#a9f1e6',
  flash: '#f4f4f4',
});

export const EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION = deepFreeze({
  id: 'en-e09-clockwork-automaton-baked-single-actor-v1',
  status: 'selected',
  selected: 'baked-single-actor',
  selectedOn: '2026-08-12',
  baseCheckpoint: '165dd2a82adabcf87f5c26b12a2c55da893e9718',
  selectionEvidence: 'After Crownmaw Greatblade was clean and remote verified, the designer was shown the recommended deterministic connected 24x24 Clockwork Automaton actor with zero child assets, baked hinges and gears, and sparks kept Effects Off, then replied: lets do next. This selects only that topology and authorizes one private common Brasscoil Sentry candidate.',
  childAssets: [],
  forbidden: ['schema changes', 'shared renderer changes', 'runtime attachment offsets', 'detached gears', 'sparks as permanent body pixels'],
  reopenRule: 'Any detached gear, key, limb, state asset, or runtime attachment requires a new explicit architecture gate.',
});

export const EN_E09_ARCANE_CONSTRUCT_CONTRACT_CARD = deepFreeze({
  id: 'en-e09-arcane-construct-v1',
  sliceId: 'EN-E09',
  families: ['clockwork-automaton', 'living-book', 'runic-idol', 'crystal-beast'],
  priorityFirst: ['clockwork-automaton', 'living-book'],
  sharedLeverage: ['rigid rotations', 'hinges', 'page motion', 'rune-bearing surfaces', 'faceted masses'],
  effectBoundary: 'Gear sparks, loose pages, rune flares, crystal volleys, aura, glow, smoke, particles, projectiles, impacts, floor light, and illumination remain external Effects Off content.',
});

export const EN_E09_BRASSCOIL_SENTRY_CONTRACT_CARD = deepFreeze({
  id: 'en-e09-clockwork-automaton-v1',
  sliceId: 'EN-E09',
  family: 'clockwork-automaton',
  familyName: 'Clockwork Automaton',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingVariant: {
    id: 'crownmaw-greatblade',
    name: 'Crownmaw Greatblade',
    role: 'elite',
    identity: 'en-e08-publication-base',
    status: 'approved-published',
  },
  activeVariant: {
    id: 'brasscoil-sentry',
    name: 'Brasscoil Sentry',
    role: 'common',
    identity: 'boiler-gear-piston-default',
    status: 'implemented-full-awaiting-visual-approval',
  },
  deferredRoles: ['specialist', 'elite'],
  actorTopology: EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION.selected,
  styleContract: 'Use chunky one-to-three-pixel hard-alpha forms and a squat industrial silhouette. Keep one round boiler torso, a single readable lens in a small head pod, one exposed connected side gear, piston forearms, plated legs, broad feet, and a connected rear winding key. The machine must remain one baked actor without armor anatomy, flesh, cloth, handheld equipment, detached parts, sparks, glow, or child assets.',
  effectBoundary: EN_E09_ARCANE_CONSTRUCT_CONTRACT_CARD.effectBoundary,
});

export const EN_E09_BRASSCOIL_SENTRY_CONTRACT = deepFreeze({
  sliceId: 'EN-E09',
  family: 'clockwork-automaton',
  variant: 'brasscoil-sentry',
  role: 'common',
  identity: 'boiler-gear-piston-default',
  state: 'implemented-complete-motion-awaiting-visual-approval',
  topology: EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION.selected,
  chassis: 'baked-single-actor-small-lens-pod-round-boiler-exposed-connected-gear-piston-arms-plated-legs-broad-feet-winding-key-v1',
  silhouette: 'A squat wide mechanical sentry with a small lens pod, round boiler body, one exposed connected gear, piston arms, short plated legs, broad feet, and a connected rear winding key. It must read as a working clockwork machine rather than Animated Armor, Fallen Knight, humanoid in plate, independent Living Weapon, or detached equipment set.',
  visualIdentity: 'Worn brass shell, dark iron frame, turquoise coil channels, black mechanical joints, one pale lens, a readable side gear, and a rear winding key communicate a practical common automaton. No visor, pauldrons, breastplate anatomy, flesh, cloth, handheld weapon, shield, aura, sparks, or detached component is used.',
  effectBoundary: EN_E09_BRASSCOIL_SENTRY_CONTRACT_CARD.effectBoundary,
});

export const EN_E09_BRASSCOIL_SENTRY_DATA = deepFreeze({
  actor: {
    species: 'baked-clockwork-automaton',
    bodyBuild: 'squat-round-boiler-machine',
    skin: 'none',
    hairStyle: 'none',
    hairColor: 'none',
    expression: 'single-readable-lens',
    faceDetail: 'small-lens-pod-with-pale-round-optic',
    headgear: 'none',
    outfit: 'baked-round-boiler-gear-pistons-legs-and-key',
    outfitColor: 'worn-brass-dark-iron-and-turquoise-coil',
    outfitTier: 'tier1',
    weapon: 'connected-piston-forearms',
    weaponTier: 'none',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.joint,
      hair: COLORS.coil,
      outfit: COLORS.brass,
    },
  },
  brasscoilSentry: COLORS,
  actorTopology: EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION.selected,
  childAssets: [],
  alphaPolicy: 'binary-single-component-baked-small-lens-pod-round-boiler-connected-side-gear-piston-arms-plated-legs-broad-feet-winding-key-and-ground-contact',
  effectBoundary: EN_E09_BRASSCOIL_SENTRY_CONTRACT_CARD.effectBoundary,
  bakedEffects: [],
});

export const EN_E09_BRASSCOIL_SENTRY_GATE = deepFreeze({
  id: 'en-e09-clockwork-automaton-brasscoil-sentry-full-v1',
  status: 'approved',
  baseCheckpoint: '165dd2a82adabcf87f5c26b12a2c55da893e9718',
  authorizedOn: '2026-08-12',
  authorizationEvidence: 'After the exact Crownmaw Greatblade publication tuple was clean and remote verified at checkpoint 165dd2a82adabcf87f5c26b12a2c55da893e9718, the designer was shown the recommended deterministic connected 24x24 Clockwork Automaton actor with zero child assets, baked hinges and gears, and sparks kept Effects Off, then replied: lets do next. This selects topology en-e09-clockwork-automaton-baked-single-actor-v1 and authorizes only one private common Brasscoil Sentry 80-frame art candidate. Registration, fixtures, effects, child assets, later roles or families, release, accepted drift, and a pull request remain closed.',
  architectureDecision: EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION.id,
  approvedOn: '2026-08-12',
  approvalEvidence: 'The exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, the approved Runeforge Custodian and Crownmaw Greatblade plus public Fallen Knight Shieldbearer family comparison, and both synchronized GIFs were presented. The three exact frozen PNG paths were open together in Aseprite. The designer replied: approved, and you can commit and push everything we approved. In context this explicitly approves candidate digest 2ce7599bdfeb97ccf99f986f5bf842a5ada7fb4cb3d0605a566c1d1263a111cd and its five frozen review hashes only. The reply authorizes bounded publication under standing permission but does not open registration, fixtures, child/state assets, effects, later roles or families, release, accepted drift, a pull request, or any broader gate.',
  approvedImplementation: 'b109e3d8ba81d444edc3c7ce7e8a479eb37a183e',
  publicationAuthorizedOn: '2026-08-12',
  publicationAuthorizationEvidence: 'The designer said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact artifact or digest. It does not authorize registration, fixtures, child/state assets, effects, later roles or families, release, accepted drift, a pull request, or any other unopened gate.',
  publishedImplementation: null,
  publishedApprovalRecord: null,
  initialPublishedHandoff: null,
  publicationState: 'approved-not-published',
  precedingApproval: {
    gateId: EN_E08_CROWNMAW_GREATBLADE_GATE.id,
    artifactSha256: EN_E08_CROWNMAW_GREATBLADE_GATE.artifactSha256,
    assembledArtifactSha256: EN_E08_CROWNMAW_GREATBLADE_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E08_CROWNMAW_GREATBLADE_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E08_CROWNMAW_GREATBLADE_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E08_CROWNMAW_GREATBLADE_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E08_CROWNMAW_GREATBLADE_GATE.candidateFrameDigest,
    publishedImplementation: EN_E08_CROWNMAW_GREATBLADE_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E08_CROWNMAW_GREATBLADE_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E08_CROWNMAW_GREATBLADE_GATE.initialPublishedHandoff,
    currentReconciliation: '165dd2a82adabcf87f5c26b12a2c55da893e9718',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e09-clockwork-automaton-brasscoil-sentry/en-e09-clockwork-automaton-brasscoil-sentry-full-suite-raw.png',
  artifactSha256: 'ac547fc59af25e5df228919e75f16f43d1b679fb1e721a96f82481207ed3f76c',
  assembledArtifact: 'enemy-expansion-review/en-e09-clockwork-automaton-brasscoil-sentry/en-e09-clockwork-automaton-brasscoil-sentry-full-suite-complete-b-form.png',
  assembledArtifactSha256: 'a4134ca9eb8f2ef5af63ad2b096f21dff8ba9a70578af8aa03700799a1df4791',
  comparisonArtifact: 'enemy-expansion-review/en-e09-clockwork-automaton-brasscoil-sentry/en-e09-clockwork-automaton-brasscoil-sentry-family-comparison.png',
  comparisonArtifactSha256: '09ad18d449b05a8f18eea2b7e24a955d8d54f607ad8cf244fa02b6a6b937da44',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e09-clockwork-automaton-brasscoil-sentry/en-e09-clockwork-automaton-brasscoil-sentry-full-suite-four-directions-labeled.gif',
      sha256: '9d57474c2eecf3ba4944c0b7cf4067fd3340ed5e25f8e1712219380c6c00ecae',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e09-clockwork-automaton-brasscoil-sentry/en-e09-clockwork-automaton-brasscoil-sentry-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: 'dc1fc31a3f17e60c93e6ce831580904a83426d735c6f561d1ff96bd4dbea7ccc',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
  },
  candidateFrameDigest: '2ce7599bdfeb97ccf99f986f5bf842a5ada7fb4cb3d0605a566c1d1263a111cd',
  crownmawComparisonDigest: EN_E08_CROWNMAW_GREATBLADE_GATE.candidateFrameDigest,
  runeforgeComparisonDigest: EN_E08_RUNEFORGE_CUSTODIAN_GATE.candidateFrameDigest,
  fallenKnightComparisonDigest: '54a82b2784cee40215221782b502341ee574a722c1416292e5dddf2fcce403ed',
  revenantComparisonDigest: 'f53fa853e7fb7aebc232e3ca1903d8a4d1d717de02576c51fe81f4c4d5b90079',
  scope: 'One complete 80-frame Brasscoil Sentry common Clockwork Automaton across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle ticks the connected gear and seats the lens pod. Walk uses four weighted piston steps with opposed connected forearms. Attack cocks one piston, draws the boiler back, drives one body-owned piston punch, and recovers. Hurt uses a complete white recoil and colored locked-frame brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and approved Runeforge Custodian, approved Crownmaw Greatblade, and public Fallen Knight Shieldbearer silhouette comparisons together.',
  exclusions: [
    'changes to approved Crownmaw Greatblade or earlier rendered pixels',
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
    'specialist or elite Clockwork Automaton',
    'Living Book, Runic Idol, Crystal Beast, or later work',
    'release',
    'accepted drift',
  ],
  nextGate: 'The exact Brasscoil Sentry packet is visually approved at implementation b109e3d8ba81d444edc3c7ce7e8a479eb37a183e. Standing publication permission opens only its approval record, branch push, and handoff reconciliation. After this tuple is clean and remote verified, inspect the live roadmap and stop at its next explicit decision gate. Registration, fixtures, child/state assets, effects, later roles or families, release, accepted drift, and a pull request remain closed.',
});

export const EN_E09_BRASSCOIL_SENTRY_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'lens-pod-tick', pose: 'idle', bob: 0, helm: 0, arm: -1, step: 0 },
  { name: 'connected-gear-tock', pose: 'idle', bob: 1, helm: 0, arm: 1, step: 0 },
]);

const WALK_PHASES = deepFreeze([
  { name: 'left-piston-step', pose: 'walk', bob: 0, helm: 0, arm: 1, step: -1 },
  { name: 'high-boiler-pass', pose: 'walk', bob: -1, helm: 0, arm: -1, step: 0 },
  { name: 'right-piston-step', pose: 'walk', bob: 0, helm: 0, arm: -1, step: 1 },
  { name: 'gear-train-settle', pose: 'walk', bob: 1, helm: 0, arm: 1, step: 0 },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'piston-cock', pose: 'guard', bob: 1, helm: 0, arm: 0, step: 0 },
  { name: 'boiler-draw', pose: 'draw', bob: -1, helm: 0, arm: -1, step: -1 },
  { name: 'body-owned-piston-punch', pose: 'clamp', bob: 0, helm: 0, arm: 1, step: 1 },
  { name: 'brasscoil-recover', pose: 'recover', bob: 1, helm: 0, arm: 0, step: 0 },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-machine-recoil', pose: 'hurt', bob: -1, helm: 0, arm: -1, step: -1, flash: true },
  { name: 'colored-frame-brace', pose: 'brace', bob: 1, helm: 0, arm: 1, step: 1, flash: false },
]);

function createPixels() {
  return new Array(SIZE * SIZE).fill(null);
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Brasscoil Sentry rectangles must use positive integer geometry.',
    );
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Brasscoil Sentry authored pixels must remain inside the 24x24 cell.');
      pixels[(py * SIZE) + px] = fill;
    }
  };
  return {
    rect,
    dot(x, y, fill) { rect(x, y, 1, 1, fill); },
  };
}

function drawFrontLegs(paint, phase) {
  const leftX = 8 + Math.min(phase.step, 0);
  const rightX = 13 + Math.max(phase.step, 0);
  paint.rect(9, 16, 6, 2, COLORS.joint[1]);
  paint.rect(leftX, 17, 3, 4, COLORS.iron[1]);
  paint.rect(rightX, 17, 3, 4, COLORS.iron[0]);
  paint.rect(leftX + 1, 18, 2, 2, COLORS.brass[0]);
  paint.rect(rightX, 18, 2, 2, COLORS.brass[1]);
  paint.rect(leftX - 2, 20, 5, 3, COLORS.iron[1]);
  paint.rect(rightX, 20, 5, 3, COLORS.iron[0]);
  paint.rect(leftX - 2, 22, 5, 1, COLORS.joint[1]);
  paint.rect(rightX, 22, 5, 1, COLORS.joint[1]);
}

function drawFrontArms(paint, phase, y) {
  const leftDrop = Math.max(phase.arm || 0, 0);
  const rightDrop = Math.max(-(phase.arm || 0), 0);
  if (phase.pose === 'draw') {
    paint.rect(2, 11 + y, 7, 3, COLORS.iron[1]);
    paint.rect(1, 13 + y, 6, 4, COLORS.brass[1]);
    paint.rect(16, 10 + y, 6, 4, COLORS.iron[0]);
    paint.rect(19, 8 + y, 3, 7, COLORS.brass[0]);
  } else if (phase.pose === 'clamp') {
    paint.rect(3, 11 + y, 6, 4, COLORS.iron[1]);
    paint.rect(16, 10 + y, 7, 4, COLORS.iron[0]);
    paint.rect(19, 10 + y, 4, 5, COLORS.brass[0]);
    paint.rect(20, 11 + y, 3, 2, COLORS.coil[2]);
  } else {
    paint.rect(3, 10 + y, 6, 4, COLORS.iron[1]);
    paint.rect(2, 13 + y + leftDrop, 6, 4, COLORS.brass[1]);
    paint.rect(15, 10 + y, 6, 4, COLORS.iron[0]);
    paint.rect(17, 13 + y + rightDrop, 5, 4, COLORS.brass[0]);
  }
  paint.dot(6, 12 + y, COLORS.joint[2]);
  paint.dot(18, 12 + y, COLORS.joint[2]);
}

function drawFront(paint, phase, rear) {
  const y = phase.bob;
  drawFrontLegs(paint, phase);

  // Round boiler chassis with a connected left-side gear.
  paint.rect(6, 9 + y, 12, 2, COLORS.iron[1]);
  paint.rect(5, 11 + y, 14, 5, COLORS.brass[0]);
  paint.rect(7, 16 + y, 10, 2, COLORS.brass[1]);
  paint.rect(8, 10 + y, 8, 7, COLORS.iron[0]);
  paint.rect(9, 11 + y, 6, 5, COLORS.cavity[0]);
  paint.rect(10, 12 + y, 4, 3, COLORS.coil[1]);
  paint.rect(11, 12 + y, 2, 3, COLORS.coil[2]);
  paint.rect(4, 11 + y, 3, 5, COLORS.brass[1]);
  paint.dot(3, 12 + y, COLORS.brass[2]);
  paint.dot(3, 15 + y, COLORS.brass[2]);
  paint.dot(5, 10 + y, COLORS.brass[2]);
  paint.dot(5, 16 + y, COLORS.brass[2]);
  if (rear) {
    paint.rect(9, 11 + y, 6, 5, COLORS.iron[1]);
    paint.rect(11, 11 + y, 2, 5, COLORS.brass[1]);
    paint.rect(13, 12 + y, 2, 2, COLORS.cavity[0]);
    paint.dot(13, 13 + y, COLORS.coil[2]);
    // Connected winding key crosses the rear boiler.
    paint.rect(2, 13 + y, 9, 2, COLORS.iron[1]);
    paint.rect(2, 11 + y, 2, 6, COLORS.brass[2]);
    paint.rect(1, 11 + y, 4, 2, COLORS.brass[0]);
    paint.rect(1, 15 + y, 4, 2, COLORS.brass[0]);
  }
  drawFrontArms(paint, phase, y);

  // Small head pod avoids a helmet/armor read.
  const headY = 4 + y + phase.helm;
  paint.rect(9, headY, 6, 2, COLORS.iron[2]);
  paint.rect(8, headY + 2, 8, 4, COLORS.iron[0]);
  paint.rect(10, headY + 6, 4, 2, COLORS.brass[1]);
  if (rear) {
    paint.rect(10, headY + 2, 4, 3, COLORS.iron[1]);
    paint.rect(11, headY + 3, 2, 2, COLORS.brass[0]);
    paint.dot(10, headY + 4, COLORS.cavity[1]);
  } else {
    paint.rect(10, headY + 2, 4, 3, COLORS.cavity[1]);
    paint.rect(11, headY + 3, 2, 2, COLORS.lens);
  }
}

function drawSideLegs(paint, phase) {
  const farX = 8 + Math.min(phase.step, 0);
  const nearX = 13 + Math.max(phase.step, 0);
  paint.rect(10, 16, 5, 2, COLORS.joint[1]);
  paint.rect(farX, 17, 3, 4, COLORS.iron[1]);
  paint.rect(nearX, 17, 3, 4, COLORS.iron[0]);
  paint.rect(farX - 2, 20, 5, 3, COLORS.iron[1]);
  paint.rect(nearX, 20, 6, 3, COLORS.iron[0]);
  paint.rect(farX - 2, 22, 5, 1, COLORS.cavity[0]);
  paint.rect(nearX, 22, 6, 1, COLORS.cavity[0]);
}

function drawSideArms(paint, phase, y) {
  const swing = phase.arm || 0;
  paint.rect(7, 10 + y, 5, 4, COLORS.iron[1]);
  paint.rect(6, 13 + y + Math.max(swing, 0), 6, 4, COLORS.brass[1]);
  if (phase.pose === 'draw') {
    paint.rect(15, 9 + y, 6, 4, COLORS.iron[0]);
    paint.rect(19, 7 + y, 3, 7, COLORS.brass[0]);
  } else if (phase.pose === 'clamp') {
    paint.rect(15, 10 + y, 8, 4, COLORS.iron[0]);
    paint.rect(20, 10 + y, 3, 5, COLORS.brass[0]);
    paint.rect(21, 11 + y, 2, 2, COLORS.coil[2]);
  } else {
    paint.rect(15, 10 + y, 6, 4, COLORS.iron[0]);
    paint.rect(17, 13 + y + Math.max(-swing, 0), 5, 4, COLORS.brass[0]);
  }
  paint.dot(9, 12 + y, COLORS.joint[2]);
  paint.dot(18, 12 + y, COLORS.joint[2]);
}

function drawSide(paint, phase) {
  const y = phase.bob;
  drawSideLegs(paint, phase);

  paint.rect(7, 9 + y, 11, 2, COLORS.iron[1]);
  paint.rect(6, 11 + y, 13, 5, COLORS.brass[0]);
  paint.rect(8, 16 + y, 9, 2, COLORS.brass[1]);
  paint.rect(9, 10 + y, 8, 7, COLORS.iron[0]);
  paint.rect(11, 11 + y, 6, 5, COLORS.cavity[0]);
  paint.rect(13, 12 + y, 4, 3, COLORS.coil[1]);
  paint.rect(15, 12 + y, 2, 3, COLORS.coil[2]);
  // One exposed gear remains connected to the boiler rim.
  paint.rect(5, 11 + y, 3, 5, COLORS.brass[1]);
  paint.dot(4, 12 + y, COLORS.brass[2]);
  paint.dot(4, 15 + y, COLORS.brass[2]);
  paint.dot(6, 10 + y, COLORS.brass[2]);
  paint.dot(6, 16 + y, COLORS.brass[2]);
  drawSideArms(paint, phase, y);

  const headY = 4 + y + phase.helm;
  paint.rect(11, headY, 5, 2, COLORS.iron[2]);
  paint.rect(10, headY + 2, 7, 4, COLORS.iron[0]);
  paint.rect(13, headY + 2, 4, 3, COLORS.cavity[1]);
  paint.rect(15, headY + 3, 2, 2, COLORS.lens);
  paint.rect(11, headY + 6, 4, 2, COLORS.brass[1]);
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
    return HURT_PHASES[EN_E09_BRASSCOIL_SENTRY_DEATH_SOURCE_FRAMES[frame]];
  }
  throw new TypeError('Animation ' + animation + ' is not implemented for Brasscoil Sentry.');
}

function buildPixels(direction, animation, frame) {
  const phase = phaseFor(animation, frame);
  const canonical = direction === 'left' ? 'right' : direction;
  const pixels = createPixels();
  const paint = painter(pixels);
  if (canonical === 'down') drawFront(paint, phase, false);
  else if (canonical === 'up') drawFront(paint, phase, true);
  else if (canonical === 'right') drawSide(paint, phase);
  else throw new TypeError('Unsupported Brasscoil Sentry direction ' + direction + '.');
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

export function renderEnE09BrasscoilSentryFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Brasscoil Sentry rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Brasscoil Sentry direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'clockwork-automaton',
    variant: 'brasscoil-sentry',
    direction,
    animation,
    frame,
    phase: phase.name,
    brasscoilSentryGate: EN_E09_BRASSCOIL_SENTRY_GATE.id,
    approvedPrecedingGate: EN_E08_CROWNMAW_GREATBLADE_GATE.id,
    actorTopology: EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION.selected,
    childAssetCount: EN_E09_BRASSCOIL_SENTRY_DATA.childAssets.length,
    alphaPolicy: EN_E09_BRASSCOIL_SENTRY_DATA.alphaPolicy,
    effectBoundary: EN_E09_BRASSCOIL_SENTRY_DATA.effectBoundary,
  });
}

export const EN_E09_BRASSCOIL_SENTRY_RENDERER = deepFreeze({
  key: 'en-e09-clockwork-automaton-brasscoil-sentry-v1',
  chassis: EN_E09_BRASSCOIL_SENTRY_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'clockwork-automaton', 'The EN-E09 Brasscoil Sentry renderer is restricted to Clockwork Automaton.');
    assert(variant.id === 'brasscoil-sentry', 'The EN-E09 Brasscoil Sentry renderer is restricted to Brasscoil Sentry.');
    return renderEnE09BrasscoilSentryFrame(context, direction, animation.id, frame);
  },
});

const BRASSCOIL_SENTRY_VARIANT = deepFreeze({
  id: 'brasscoil-sentry',
  name: 'Brasscoil Sentry',
  role: EN_E09_BRASSCOIL_SENTRY_CONTRACT.role,
  status: EN_E09_BRASSCOIL_SENTRY_CONTRACT.state,
  brief: 'A private complete common Clockwork Automaton using one baked 24x24 actor: small single-lens pod, round boiler, connected exposed gear, piston forearms, short plated legs, broad feet, and connected rear winding key; child assets, detached parts, sparks, weapons, shields, and effects remain external.',
  rendererData: EN_E09_BRASSCOIL_SENTRY_DATA,
});

export const EN_E09_BRASSCOIL_SENTRY_FAMILY = deepFreeze({
  id: 'clockwork-automaton',
  name: 'Clockwork Automaton Brasscoil Sentry Review',
  sliceId: 'EN-E09',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E09_BRASSCOIL_SENTRY_CONTRACT.chassis,
  rendererKey: EN_E09_BRASSCOIL_SENTRY_RENDERER.key,
  variants: [BRASSCOIL_SENTRY_VARIANT],
  rendererData: {
    contractCard: EN_E09_BRASSCOIL_SENTRY_CONTRACT_CARD.id,
    architectureDecision: EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E08_CROWNMAW_GREATBLADE_GATE.id,
    activeGate: EN_E09_BRASSCOIL_SENTRY_GATE.id,
  },
  review: {
    baselineVariant: 'brasscoil-sentry',
    scale: 8,
    notes: 'Awaiting visual review as one connected baked common Brasscoil Sentry against approved Runeforge Custodian, approved Crownmaw Greatblade, and public Fallen Knight Shieldbearer. Keep registration, fixtures, child assets, effects, later roles or families, release, accepted drift, and a pull request separate.',
  },
});

export const EN_E09_BRASSCOIL_SENTRY_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E09_BRASSCOIL_SENTRY_RENDERER],
  families: [EN_E09_BRASSCOIL_SENTRY_FAMILY],
});
