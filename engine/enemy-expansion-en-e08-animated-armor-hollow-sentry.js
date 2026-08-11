import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E07_BLACKWAKE_DREADMARE_GATE,
} from './enemy-expansion-en-e07-kelpie-blackwake-dreadmare.js';

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
  plate: ['#77858f', '#3b4650', '#b8c2c6'],
  rust: ['#9b6844', '#5a3d30', '#c38b58'],
  binding: ['#66503d', '#3e3028', '#8b6e4e'],
  haunt: ['#4fbca3', '#286b64', '#96efd0'],
  cavity: ['#20272e', '#0b1015'],
  eye: '#b9ffe3',
  flash: '#f4f4f4',
});

export const EN_E08_ACTOR_TOPOLOGY_DECISION = deepFreeze({
  id: 'en-e08-baked-single-actor-v1',
  sliceId: 'EN-E08',
  status: 'selected',
  selected: 'baked-single-actor',
  selectedOn: '2026-08-11',
  baseCheckpoint: 'defc9b8cab1226610da6cf2b17951c8b5815499e',
  selectionEvidence: 'After the exact approved Blackwake Dreadmare publication tuple was reconciled at defc9b8cab1226610da6cf2b17951c8b5815499e, the designer was given the recommended baked single-actor topology and the alternative deterministic child/state architecture. The designer replied: lets do next. In that immediate architecture-choice context, this selects the recommended baked single actor for the first EN-E08 Animated Armor candidate.',
  frameOwnership: 'Helmet, pauldrons, breastplate, gauntlets, waist bindings, greaves, sabatons, and any future equipped weapon approved inside this family are authored into one deterministic 24x24 Enemy pixel array for every frame.',
  childAssets: [],
  forbidden: [
    'deterministic child/state exports',
    'separate helmet assets',
    'separate gauntlet assets',
    'separate weapon assets',
    'runtime attachment offsets',
    'incidental per-frame child offsets',
    'schema changes',
    'exporter changes',
    'validator changes',
    'frame-contract changes',
  ],
  reopenRule: 'Any later request for separate head, mask, rider, mount, or living-weapon assets must stop at a new explicit architecture gate rather than silently extending this content-only renderer.',
});

export const EN_E08_ANIMATED_ARMOR_CONTRACT_CARD = deepFreeze({
  id: 'en-e08-animated-armor-v1',
  sliceId: 'EN-E08',
  family: 'animated-armor',
  familyName: 'Animated Armor',
  collisionRuling: 'Haunted Armor and Animated Armor are one animated-armor family; haunted and constructed identities belong to variants rather than duplicate families.',
  roleOrder: ['common', 'specialist', 'elite'],
  activeVariant: {
    id: 'hollow-sentry',
    name: 'Hollow Sentry',
    role: 'common',
    identity: 'haunted-default',
    status: 'implemented-full-awaiting-review',
  },
  deferredRoles: ['specialist', 'elite'],
  actorTopology: EN_E08_ACTOR_TOPOLOGY_DECISION.selected,
  styleContract: 'Use chunky one-to-three-pixel hard-alpha forms and one independently authored broad empty-suit silhouette. Keep a readable sealed helm and black visor cavity, broad mismatched pauldrons, hollow breastplate, oversized connected gauntlets, cinched bindings, split greaves, and broad grounded sabatons. No flesh, face, robe body, corpse gaps, sword, shield, loose plate, or child asset may substitute for the armor itself acting as the body.',
  effectBoundary: 'Detached plate, floating helmet or gauntlets, weapons, shields, child/state assets, runtime offsets, soul wisps, aura, glow, particles, projectiles, weapon trails, sparks, dust, impacts, illumination, and ground effects remain external.',
});

export const EN_E08_HOLLOW_SENTRY_CONTRACT = deepFreeze({
  sliceId: 'EN-E08',
  family: 'animated-armor',
  variant: 'hollow-sentry',
  role: 'common',
  identity: 'haunted-default',
  state: 'implemented-complete-motion-awaiting-review',
  topology: EN_E08_ACTOR_TOPOLOGY_DECISION.selected,
  chassis: 'baked-single-actor-sealed-helm-black-visor-broad-mismatched-pauldrons-hollow-breastplate-oversized-gauntlets-cinched-bindings-split-greaves-grounded-sabatons-v1',
  silhouette: 'A broad grounded empty suit with a sealed low-crested helm, wide black visor slit, offset pauldrons, hollow ribbed breastplate, two oversized connected gauntlets, narrow bound waist, separated plate greaves, and broad sabatons. It must read as armor acting as the entire body rather than a living Fallen Knight, corpse-handed Revenant, robed Living Shadow, skeleton, clockwork automaton, or independent Living Weapon.',
  visualIdentity: 'Cold blue-gray plate, black interior cavities, old russet edge wear, dark leather bindings, restrained sea-green haunt seams, and a bright paired visor gaze communicate an inhabited empty suit with no exposed flesh, cloth tabard, handheld weapon, shield, aura, or detached component.',
  effectBoundary: EN_E08_ANIMATED_ARMOR_CONTRACT_CARD.effectBoundary,
});

export const EN_E08_HOLLOW_SENTRY_DATA = deepFreeze({
  actor: {
    species: 'baked-animated-armor',
    bodyBuild: 'broad-empty-suit',
    skin: 'none',
    hairStyle: 'none',
    hairColor: 'none',
    expression: 'paired-visor-haunt',
    faceDetail: 'black-empty-visor-with-two-haunt-points',
    headgear: 'baked-sealed-low-crested-helm',
    outfit: 'baked-hollow-plate-body',
    outfitColor: 'cold-blue-gray-old-rust-and-sea-green-haunt',
    outfitTier: 'tier1',
    weapon: 'none',
    weaponTier: 'none',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.cavity,
      hair: COLORS.haunt,
      outfit: COLORS.plate,
    },
  },
  hollowSentry: COLORS,
  actorTopology: EN_E08_ACTOR_TOPOLOGY_DECISION.selected,
  childAssets: [],
  alphaPolicy: 'binary-single-component-baked-sealed-helm-wide-black-visor-mismatched-pauldrons-hollow-breastplate-oversized-connected-gauntlets-bound-waist-separated-greaves-and-broad-grounded-sabatons',
  effectBoundary: EN_E08_ANIMATED_ARMOR_CONTRACT_CARD.effectBoundary,
  bakedEffects: [],
});

export const EN_E08_HOLLOW_SENTRY_GATE = deepFreeze({
  id: 'en-e08-animated-armor-hollow-sentry-full-v1',
  status: 'implemented-awaiting-review',
  baseCheckpoint: 'defc9b8cab1226610da6cf2b17951c8b5815499e',
  authorizedOn: '2026-08-11',
  authorizationEvidence: 'After the exact Blackwake Dreadmare was visually approved, published, and reconciled at clean checkpoint defc9b8cab1226610da6cf2b17951c8b5815499e, the designer was presented with the recommended baked single-actor topology and a separate child/state alternative. The designer replied: lets do next. That context selects the recommended topology and authorizes exactly one private common Animated Armor Hollow Sentry 80-frame candidate.',
  architectureDecision: EN_E08_ACTOR_TOPOLOGY_DECISION.id,
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
    gateId: EN_E07_BLACKWAKE_DREADMARE_GATE.id,
    artifactSha256: EN_E07_BLACKWAKE_DREADMARE_GATE.artifactSha256,
    assembledArtifactSha256: EN_E07_BLACKWAKE_DREADMARE_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E07_BLACKWAKE_DREADMARE_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E07_BLACKWAKE_DREADMARE_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E07_BLACKWAKE_DREADMARE_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E07_BLACKWAKE_DREADMARE_GATE.candidateFrameDigest,
    publishedImplementation: EN_E07_BLACKWAKE_DREADMARE_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E07_BLACKWAKE_DREADMARE_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E07_BLACKWAKE_DREADMARE_GATE.initialPublishedHandoff,
    currentReconciliation: 'defc9b8cab1226610da6cf2b17951c8b5815499e',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e08-animated-armor-hollow-sentry/en-e08-animated-armor-hollow-sentry-full-suite-raw.png',
  artifactSha256: 'd4e257be9814475c9ecab189f2842541b1fc1264aa95b90098d295a56f4be022',
  assembledArtifact: 'enemy-expansion-review/en-e08-animated-armor-hollow-sentry/en-e08-animated-armor-hollow-sentry-full-suite-complete-b-form.png',
  assembledArtifactSha256: '86bfde2b5091db85f718f8603e8391db21424981bcb46f0985885fc141ce863e',
  comparisonArtifact: 'enemy-expansion-review/en-e08-animated-armor-hollow-sentry/en-e08-animated-armor-hollow-sentry-family-comparison.png',
  comparisonArtifactSha256: '85d3bdc53b356eb886329be6045531f9644a11e44965de385bcb4848cf4e8619',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e08-animated-armor-hollow-sentry/en-e08-animated-armor-hollow-sentry-full-suite-four-directions-labeled.gif',
      sha256: '731cee04ff79fbeced685299be575cee643b52b88f2ee3404783587b91f4a330',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e08-animated-armor-hollow-sentry/en-e08-animated-armor-hollow-sentry-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '54faee2dad6939c3e377a7a2eb99358860419e8ebfac4fc5f04b03bd6591a294',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
  },
  candidateFrameDigest: 'f6e7cbf25692b08e2e4dfccef149662c18d195e4cf615185f7a38e4874e2b9ac',
  fallenKnightComparisonDigest: '54a82b2784cee40215221782b502341ee574a722c1416292e5dddf2fcce403ed',
  revenantComparisonDigest: 'f53fa853e7fb7aebc232e3ca1903d8a4d1d717de02576c51fe81f4c4d5b90079',
  gloamWalkerComparisonDigest: '131a95a106a36dea2f6879611c8e14e3aa077012dcbd1bd32e111c45658ca3f9',
  scope: 'One complete 80-frame Hollow Sentry common Animated Armor across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle locks and settles the empty plate shell around the black visor cavity. Walk uses four weighty iron steps with opposed pauldrons, gauntlets, and split greaves while both sabatons remain readable. Attack closes the oversized gauntlets into guard, draws the empty breastplate back, commits to one connected full-body iron clamp, and grounds into recovery. Hurt uses a complete white recoil and colored buckled-plate brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and approved Fallen Knight Shieldbearer, Grave Oathkeeper Revenant, and Gloam Walker silhouette comparisons together.',
  exclusions: [
    'changes to approved Blackwake Dreadmare or earlier rendered pixels',
    'public Animated Armor registration',
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
    'clockwork gears or automaton identity',
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
    'specialist or elite Animated Armor',
    'Headless Rider',
    'Possessed Mask',
    'Living Weapon',
    'EN-E09 and later work',
    'release',
    'accepted drift',
  ],
  nextGate: 'Visual approval is required for the exact frozen Hollow Sentry packet. Do not commit or push the candidate, register Animated Armor, generate fixtures, add child/state assets or effects, begin another role or EN-E08 family, release, or accept drift before that approval.',
});

export const EN_E08_HOLLOW_SENTRY_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'sealed-hollow-vigil', pose: 'idle', bob: 0, helm: 0, arm: -1, step: 0 },
  { name: 'empty-plate-settle', pose: 'idle', bob: 1, helm: 0, arm: 1, step: 0 },
]);

const WALK_PHASES = deepFreeze([
  { name: 'left-sabaton-plant', pose: 'walk', bob: 0, helm: 0, arm: 1, step: -1 },
  { name: 'iron-weight-pass', pose: 'walk', bob: -1, helm: 0, arm: -1, step: 0 },
  { name: 'right-sabaton-plant', pose: 'walk', bob: 0, helm: 1, arm: -1, step: 1 },
  { name: 'bound-waist-settle', pose: 'walk', bob: 1, helm: 0, arm: 1, step: 0 },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'closed-gauntlet-guard', pose: 'guard', bob: 1, helm: 0, arm: 0, step: 0 },
  { name: 'empty-breastplate-draw', pose: 'draw', bob: -1, helm: 0, arm: -1, step: -1 },
  { name: 'connected-iron-clamp', pose: 'clamp', bob: 0, helm: 1, arm: 1, step: 1 },
  { name: 'grounded-hollow-recover', pose: 'recover', bob: 1, helm: 0, arm: 0, step: 0 },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-empty-plate-recoil', pose: 'hurt', bob: -1, helm: 1, arm: -1, step: -1, flash: true },
  { name: 'colored-buckled-plate-brace', pose: 'brace', bob: 1, helm: 0, arm: 1, step: 1, flash: false },
]);

function createPixels() {
  return new Array(SIZE * SIZE).fill(null);
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Hollow Sentry rectangles must use positive integer geometry.',
    );
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Hollow Sentry authored pixels must remain inside the 24x24 cell.');
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
  const rightX = 13 + Math.max(phase.step, 0);
  paint.rect(9, 16, 6, 3, COLORS.binding[1]);
  paint.rect(leftX, 16, 4, 6, COLORS.plate[1]);
  paint.rect(rightX, 16, 4, 6, COLORS.plate[0]);
  paint.rect(leftX + 1, 17, 2, 3, COLORS.plate[2]);
  paint.rect(rightX, 17, 2, 3, COLORS.rust[0]);
  paint.rect(leftX - 2, 20, 6, 3, COLORS.plate[1]);
  paint.rect(rightX, 20, 6, 3, COLORS.plate[0]);
  paint.rect(leftX - 2, 22, 6, 1, COLORS.cavity[0]);
  paint.rect(rightX, 22, 6, 1, COLORS.cavity[0]);
  paint.dot(leftX + 2, 21, COLORS.rust[2]);
  paint.dot(rightX + 1, 21, COLORS.plate[2]);
}

function drawFrontArms(paint, phase, y) {
  if (phase.pose === 'guard') {
    paint.rect(4, 11 + y, 5, 6, COLORS.plate[1]);
    paint.rect(7, 13 + y, 4, 5, COLORS.plate[0]);
    paint.rect(15, 11 + y, 5, 6, COLORS.plate[0]);
    paint.rect(13, 13 + y, 4, 5, COLORS.plate[1]);
    paint.rect(8, 15 + y, 3, 2, COLORS.rust[0]);
    paint.rect(13, 15 + y, 3, 2, COLORS.rust[0]);
  } else if (phase.pose === 'draw') {
    paint.rect(2, 10 + y, 7, 5, COLORS.plate[1]);
    paint.rect(1, 13 + y, 6, 5, COLORS.plate[0]);
    paint.rect(15, 10 + y, 7, 5, COLORS.plate[0]);
    paint.rect(17, 13 + y, 6, 5, COLORS.plate[1]);
    paint.rect(1, 16 + y, 6, 2, COLORS.rust[1]);
    paint.rect(17, 16 + y, 6, 2, COLORS.rust[0]);
  } else if (phase.pose === 'clamp') {
    paint.rect(3, 10 + y, 7, 5, COLORS.plate[1]);
    paint.rect(5, 13 + y, 7, 5, COLORS.plate[0]);
    paint.rect(14, 10 + y, 7, 5, COLORS.plate[0]);
    paint.rect(12, 13 + y, 7, 5, COLORS.plate[1]);
    paint.rect(8, 15 + y, 8, 3, COLORS.rust[0]);
    paint.rect(10, 16 + y, 4, 2, COLORS.haunt[1]);
  } else if (phase.pose === 'brace' || phase.pose === 'recover') {
    paint.rect(4, 11 + y, 5, 7, COLORS.plate[1]);
    paint.rect(3, 15 + y, 6, 3, COLORS.plate[0]);
    paint.rect(15, 11 + y, 5, 7, COLORS.plate[0]);
    paint.rect(15, 15 + y, 6, 3, COLORS.plate[1]);
    paint.dot(4, 16 + y, COLORS.rust[2]);
    paint.dot(19, 16 + y, COLORS.rust[0]);
  } else {
    const swing = phase.arm || 0;
    paint.rect(4, 11 + y, 5, 6, COLORS.plate[1]);
    paint.rect(3, 14 + y + Math.max(swing, 0), 6, 4, COLORS.plate[0]);
    paint.rect(15, 11 + y, 5, 6, COLORS.plate[0]);
    paint.rect(15, 14 + y + Math.max(-swing, 0), 6, 4, COLORS.plate[1]);
    paint.dot(4, 16 + y + Math.max(swing, 0), COLORS.rust[2]);
    paint.dot(19, 16 + y + Math.max(-swing, 0), COLORS.rust[0]);
  }
}

function drawFront(paint, phase, rear) {
  const y = phase.bob;
  const spread = phase.pose === 'draw' || phase.pose === 'clamp' ? 1 : 0;
  drawFrontLegs(paint, phase);

  paint.rect(5 - spread, 9 + y, 14 + (spread * 2), 5, COLORS.plate[1]);
  paint.rect(4 - spread, 10 + y, 5, 4, COLORS.plate[0]);
  paint.rect(15 + spread, 10 + y, 5, 4, COLORS.rust[0]);
  paint.rect(7, 10 + y, 10, 7, COLORS.plate[0]);
  paint.rect(8, 12 + y, 8, 5, COLORS.plate[2]);
  paint.rect(9, 14 + y, 6, 4, COLORS.plate[1]);
  paint.rect(10, 15 + y, 4, 3, COLORS.cavity[0]);
  if (rear) {
    paint.rect(10, 12 + y, 4, 3, COLORS.plate[1]);
    paint.rect(11, 12 + y, 2, 4, COLORS.rust[1]);
    paint.dot(11, 13 + y, COLORS.haunt[0]);
    paint.dot(12, 14 + y, COLORS.haunt[2]);
  } else {
    paint.rect(10, 12 + y, 4, 3, COLORS.cavity[1]);
    paint.rect(11, 13 + y, 2, 2, COLORS.haunt[0]);
  }
  paint.dot(8, 13 + y, COLORS.rust[2]);
  paint.dot(15, 13 + y, COLORS.rust[1]);
  drawFrontArms(paint, phase, y);
  paint.rect(9, 16 + y, 6, 2, COLORS.binding[0]);
  paint.rect(11, 16 + y, 2, 2, COLORS.haunt[1]);

  const helmY = 3 + y + phase.helm;
  paint.rect(9, helmY, 6, 2, COLORS.plate[2]);
  paint.rect(7, helmY + 2, 10, 4, COLORS.plate[0]);
  paint.rect(6, helmY + 5, 12, 3, COLORS.plate[1]);
  paint.rect(8, helmY + 6, 8, 2, COLORS.rust[0]);
  if (rear) {
    paint.rect(9, helmY + 3, 6, 3, COLORS.plate[1]);
    paint.rect(11, helmY + 2, 2, 5, COLORS.rust[1]);
    paint.dot(10, helmY + 4, COLORS.haunt[2]);
    paint.dot(13, helmY + 4, COLORS.haunt[0]);
  } else {
    paint.rect(8, helmY + 3, 8, 3, COLORS.cavity[1]);
    paint.rect(9, helmY + 5, 6, 1, COLORS.cavity[0]);
    paint.dot(10, helmY + 4, COLORS.eye);
    paint.dot(13, helmY + 4, COLORS.eye);
  }
  paint.dot(7, helmY + 5, COLORS.rust[2]);
  paint.dot(16, helmY + 5, COLORS.plate[2]);
}

function drawSideLegs(paint, phase) {
  const farX = 8 + Math.min(phase.step, 0);
  const nearX = 13 + Math.max(phase.step, 0);
  paint.rect(10, 16, 6, 3, COLORS.binding[1]);
  paint.rect(farX, 16, 4, 6, COLORS.plate[1]);
  paint.rect(nearX, 16, 4, 6, COLORS.plate[0]);
  paint.rect(farX - 2, 20, 6, 3, COLORS.plate[1]);
  paint.rect(nearX, 20, 7, 3, COLORS.plate[0]);
  paint.rect(farX - 2, 22, 6, 1, COLORS.cavity[0]);
  paint.rect(nearX, 22, 7, 1, COLORS.cavity[0]);
  paint.dot(farX + 1, 18, COLORS.plate[2]);
  paint.dot(nearX + 2, 18, COLORS.rust[2]);
}

function drawSideArms(paint, phase, y) {
  if (phase.pose === 'guard') {
    paint.rect(7, 11 + y, 5, 7, COLORS.plate[1]);
    paint.rect(10, 14 + y, 6, 4, COLORS.plate[0]);
    paint.rect(14, 11 + y, 5, 6, COLORS.plate[0]);
    paint.rect(15, 14 + y, 5, 4, COLORS.plate[1]);
  } else if (phase.pose === 'draw') {
    paint.rect(5, 10 + y, 6, 6, COLORS.plate[1]);
    paint.rect(3, 14 + y, 7, 4, COLORS.plate[0]);
    paint.rect(14, 10 + y, 6, 5, COLORS.plate[0]);
    paint.rect(17, 12 + y, 5, 5, COLORS.plate[1]);
  } else if (phase.pose === 'clamp') {
    paint.rect(7, 11 + y, 6, 7, COLORS.plate[1]);
    paint.rect(12, 10 + y, 7, 5, COLORS.plate[0]);
    paint.rect(17, 11 + y, 6, 5, COLORS.plate[1]);
    paint.rect(19, 14 + y, 4, 4, COLORS.rust[0]);
    paint.rect(20, 15 + y, 3, 2, COLORS.haunt[1]);
  } else if (phase.pose === 'brace' || phase.pose === 'recover') {
    paint.rect(7, 11 + y, 5, 7, COLORS.plate[1]);
    paint.rect(6, 15 + y, 6, 3, COLORS.plate[0]);
    paint.rect(14, 11 + y, 6, 7, COLORS.plate[0]);
    paint.rect(16, 15 + y, 5, 3, COLORS.plate[1]);
  } else {
    const swing = phase.arm || 0;
    paint.rect(7, 11 + y, 5, 7, COLORS.plate[1]);
    paint.rect(6, 15 + y + Math.max(swing, 0), 6, 3, COLORS.plate[0]);
    paint.rect(14, 11 + y, 6, 7, COLORS.plate[0]);
    paint.rect(16, 15 + y + Math.max(-swing, 0), 5, 3, COLORS.plate[1]);
  }
  paint.dot(8, 16 + y, COLORS.rust[2]);
  paint.dot(19, 16 + y, COLORS.rust[0]);
}

function drawSide(paint, phase) {
  const y = phase.bob;
  const reach = phase.pose === 'clamp' ? 1 : 0;
  drawSideLegs(paint, phase);

  paint.rect(7, 9 + y, 12 + reach, 5, COLORS.plate[1]);
  paint.rect(6, 10 + y, 5, 4, COLORS.plate[0]);
  paint.rect(15, 10 + y, 5 + reach, 4, COLORS.rust[0]);
  paint.rect(9, 10 + y, 9, 7, COLORS.plate[0]);
  paint.rect(10, 12 + y, 7, 5, COLORS.plate[2]);
  paint.rect(11, 14 + y, 6, 4, COLORS.plate[1]);
  paint.rect(12, 15 + y, 4, 3, COLORS.cavity[0]);
  paint.rect(13, 12 + y, 3, 3, COLORS.cavity[1]);
  paint.rect(14, 13 + y, 2, 2, COLORS.haunt[0]);
  drawSideArms(paint, phase, y);
  paint.rect(10, 16 + y, 7, 2, COLORS.binding[0]);
  paint.rect(13, 16 + y, 2, 2, COLORS.haunt[1]);

  const helmY = 3 + y + phase.helm;
  paint.rect(11, helmY, 6, 2, COLORS.plate[2]);
  paint.rect(9, helmY + 2, 9, 4, COLORS.plate[0]);
  paint.rect(8, helmY + 5, 11, 3, COLORS.plate[1]);
  paint.rect(13, helmY + 3, 6, 3, COLORS.cavity[1]);
  paint.rect(14, helmY + 5, 5, 1, COLORS.cavity[0]);
  paint.dot(16, helmY + 4, COLORS.eye);
  paint.dot(9, helmY + 5, COLORS.rust[2]);
  paint.dot(18, helmY + 6, COLORS.plate[2]);
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
    return HURT_PHASES[EN_E08_HOLLOW_SENTRY_DEATH_SOURCE_FRAMES[frame]];
  }
  throw new TypeError('Animation ' + animation + ' is not implemented for Hollow Sentry.');
}

function buildPixels(direction, animation, frame) {
  const phase = phaseFor(animation, frame);
  const canonical = direction === 'left' ? 'right' : direction;
  const pixels = createPixels();
  const paint = painter(pixels);
  if (canonical === 'down') drawFront(paint, phase, false);
  else if (canonical === 'up') drawFront(paint, phase, true);
  else if (canonical === 'right') drawSide(paint, phase);
  else throw new TypeError('Unsupported Hollow Sentry direction ' + direction + '.');
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

export function renderEnE08HollowSentryFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Hollow Sentry rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Hollow Sentry direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'animated-armor',
    variant: 'hollow-sentry',
    direction,
    animation,
    frame,
    phase: phase.name,
    hollowSentryGate: EN_E08_HOLLOW_SENTRY_GATE.id,
    approvedPrecedingGate: EN_E07_BLACKWAKE_DREADMARE_GATE.id,
    actorTopology: EN_E08_ACTOR_TOPOLOGY_DECISION.selected,
    childAssetCount: EN_E08_HOLLOW_SENTRY_DATA.childAssets.length,
    alphaPolicy: EN_E08_HOLLOW_SENTRY_DATA.alphaPolicy,
    effectBoundary: EN_E08_HOLLOW_SENTRY_DATA.effectBoundary,
  });
}

export const EN_E08_HOLLOW_SENTRY_RENDERER = deepFreeze({
  key: 'en-e08-animated-armor-hollow-sentry-v1',
  chassis: EN_E08_HOLLOW_SENTRY_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'animated-armor', 'The EN-E08 Hollow Sentry renderer is restricted to Animated Armor.');
    assert(variant.id === 'hollow-sentry', 'The EN-E08 Hollow Sentry renderer is restricted to Hollow Sentry.');
    return renderEnE08HollowSentryFrame(context, direction, animation.id, frame);
  },
});

const HOLLOW_SENTRY_VARIANT = deepFreeze({
  id: 'hollow-sentry',
  name: 'Hollow Sentry',
  role: EN_E08_HOLLOW_SENTRY_CONTRACT.role,
  status: EN_E08_HOLLOW_SENTRY_CONTRACT.state,
  brief: 'A private complete common Animated Armor using one baked 24x24 actor: sealed empty helm, black visor, mismatched pauldrons, hollow breastplate, oversized connected gauntlets, bound waist, split greaves, and broad grounded sabatons; child assets, exposed bodies, weapons, shields, and effects remain external.',
  rendererData: EN_E08_HOLLOW_SENTRY_DATA,
});

export const EN_E08_HOLLOW_SENTRY_FAMILY = deepFreeze({
  id: 'animated-armor',
  name: 'Animated Armor Hollow Sentry Review',
  sliceId: 'EN-E08',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E08_HOLLOW_SENTRY_CONTRACT.chassis,
  rendererKey: EN_E08_HOLLOW_SENTRY_RENDERER.key,
  variants: [HOLLOW_SENTRY_VARIANT],
  rendererData: {
    contractCard: EN_E08_ANIMATED_ARMOR_CONTRACT_CARD.id,
    architectureDecision: EN_E08_ACTOR_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E07_BLACKWAKE_DREADMARE_GATE.id,
    activeGate: EN_E08_HOLLOW_SENTRY_GATE.id,
  },
  review: {
    baselineVariant: 'hollow-sentry',
    scale: 8,
    notes: 'Awaiting visual approval as one broad haunted-default Hollow Sentry rendered entirely as a baked single actor against Fallen Knight Shieldbearer, Grave Oathkeeper Revenant, and Gloam Walker. Keep registration, fixtures, child/state assets, effects, later roles and EN-E08 families, release, and accepted drift separate.',
  },
});

export const EN_E08_HOLLOW_SENTRY_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E08_HOLLOW_SENTRY_RENDERER],
  families: [EN_E08_HOLLOW_SENTRY_FAMILY],
});
