import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E08_ACTOR_TOPOLOGY_DECISION,
  EN_E08_ANIMATED_ARMOR_CONTRACT_CARD,
  EN_E08_HOLLOW_SENTRY_GATE,
} from './enemy-expansion-en-e08-animated-armor-hollow-sentry.js';

export { EN_E08_ACTOR_TOPOLOGY_DECISION, EN_E08_ANIMATED_ARMOR_CONTRACT_CARD };

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
  plate: ['#68767c', '#354249', '#aab6b7'],
  forge: ['#a66e36', '#654226', '#d5a45e'],
  rune: ['#4c86a4', '#294f69', '#91c9d7'],
  joint: ['#3d3432', '#1a1d22', '#756052'],
  cavity: ['#20262b', '#0b0f13'],
  aperture: '#d9f4df',
  flash: '#f4f4f4',
});
export const EN_E08_RUNEFORGE_CUSTODIAN_CONTRACT_CARD = deepFreeze({
  id: 'en-e08-animated-armor-runeforge-custodian-v1',
  sliceId: 'EN-E08',
  family: 'animated-armor',
  familyName: 'Animated Armor',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingVariant: {
    id: 'hollow-sentry',
    name: 'Hollow Sentry',
    role: 'common',
    identity: 'haunted-default',
    status: 'approved-published',
  },
  activeVariant: {
    id: 'runeforge-custodian',
    name: 'Runeforge Custodian',
    role: 'specialist',
    identity: 'constructed-rune-lock',
    status: 'implemented-full-approved',
  },
  deferredRoles: ['elite'],
  actorTopology: EN_E08_ACTOR_TOPOLOGY_DECISION.selected,
  styleContract: 'Use chunky one-to-three-pixel hard-alpha forms and an independently authored constructed specialist silhouette. Keep an angular crownless helm with one large readable rune-lock aperture, squared equal pauldrons, a deep hexagonal forge chest, connected interlocking gauntlets, a rigid joint belt, divided plated legs, and broad grounded wedge sabatons. The actor must remain a single baked suit without flesh, cloth, gears, a weapon, shield, floating plate, glow, or child asset.',
  effectBoundary: EN_E08_ANIMATED_ARMOR_CONTRACT_CARD.effectBoundary,
});

export const EN_E08_RUNEFORGE_CUSTODIAN_CONTRACT = deepFreeze({
  sliceId: 'EN-E08',
  family: 'animated-armor',
  variant: 'runeforge-custodian',
  role: 'specialist',
  identity: 'constructed-rune-lock',
  state: 'implemented-complete-motion-approved',
  topology: EN_E08_ACTOR_TOPOLOGY_DECISION.selected,
  chassis: 'baked-single-actor-angular-helm-single-rune-aperture-square-pauldrons-hex-forge-chest-interlocking-gauntlets-joint-belt-divided-greaves-wedge-sabatons-v1',
  silhouette: 'A tall squared constructed suit with a crownless angular helm, one large centered rune-lock face aperture, level block pauldrons, a deep hexagonal forge chest, two connected interlocking gauntlets, rigid joint belt, divided plated legs, and grounded wedge sabatons. It must read as deliberately forged magical machinery without becoming Hollow Sentry, a living Fallen Knight, corpse-handed Revenant, gear-driven Clockwork Automaton, independent Living Weapon, or detached equipment set.',
  visualIdentity: 'Slate forged plate, warm copper structural bands, dark fixed joints, pale blue inset rune channels, and one large pale rune-lock aperture communicate a constructed specialist. No paired ghost eyes, hollow rib cage, exposed flesh, cloth tabard, gears, handheld weapon, shield, aura, sparks, or detached component is used.',
  effectBoundary: EN_E08_RUNEFORGE_CUSTODIAN_CONTRACT_CARD.effectBoundary,
});

export const EN_E08_RUNEFORGE_CUSTODIAN_DATA = deepFreeze({
  actor: {
    species: 'baked-animated-armor',
    bodyBuild: 'tall-squared-constructed-specialist',
    skin: 'none',
    hairStyle: 'none',
    hairColor: 'none',
    expression: 'single-readable-rune-lock',
    faceDetail: 'large-centered-diamond-aperture-with-pale-rune-core',
    headgear: 'baked-angular-crownless-forge-helm',
    outfit: 'baked-hex-chest-and-square-plate-body',
    outfitColor: 'slate-copper-and-inset-blue-runes',
    outfitTier: 'tier2',
    weapon: 'connected-interlocking-forge-gauntlets',
    weaponTier: 'none',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.joint,
      hair: COLORS.rune,
      outfit: COLORS.plate,
    },
  },
  runeforgeCustodian: COLORS,
  actorTopology: EN_E08_ACTOR_TOPOLOGY_DECISION.selected,
  childAssets: [],
  alphaPolicy: 'binary-single-component-baked-angular-helm-single-rune-lock-square-pauldrons-hex-forge-chest-connected-interlocking-gauntlets-rigid-joint-belt-divided-greaves-and-grounded-wedge-sabatons',
  effectBoundary: EN_E08_RUNEFORGE_CUSTODIAN_CONTRACT_CARD.effectBoundary,
  bakedEffects: [],
});

export const EN_E08_RUNEFORGE_CUSTODIAN_GATE = deepFreeze({
  id: 'en-e08-animated-armor-runeforge-custodian-full-v1',
  status: 'approved',
  baseCheckpoint: 'dc86bb65053564c76b18e848933ab4c2d318bfde',
  authorizedOn: '2026-08-11',
  authorizationEvidence: 'After the exact Hollow Sentry digest was visually approved, committed, pushed, and reconciled at clean published checkpoint dc86bb65053564c76b18e848933ab4c2d318bfde, the designer replied: lets do next. Hollow Sentry completed the haunted-default common role, so the one-complete-sprite cadence authorizes only one private constructed specialist Animated Armor Runeforge Custodian 80-frame candidate.',
  architectureDecision: EN_E08_ACTOR_TOPOLOGY_DECISION.id,
  approvedOn: '2026-08-11',
  approvalEvidence: 'The exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, the approved Hollow Sentry, Fallen Knight Shieldbearer, and Grave Oathkeeper Revenant comparison, and both synchronized GIFs were presented after the paired-eye risk was repaired into one vertical readable rune-lock face column. The three exact frozen PNG paths were open together in responsive Aseprite 1.3.17.2 process 42856. The designer replied: accepted. In context this explicitly approves candidate digest 629930688cca04f3d714e12225ab8c3db7c494c5fbaf027d65ec7f8d530ccf85 and its five frozen review hashes only. Animated Armor registration, fixtures, child/state assets, effects, the elite role, later EN-E08 families, release, accepted drift, a pull request, and another art gate remain separate decisions.',
  approvedImplementation: 'd73ca9334640384d9b531c0d8375c1a42e459212',
  publicationAuthorizedOn: '2026-08-11',
  publicationAuthorizationEvidence: 'The designer said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact artifact or digest. It does not authorize registration, fixtures, child/state assets, effects, later roles or families, release, accepted drift, a pull request, or any other unopened gate.',
  publishedImplementation: null,
  publishedApprovalRecord: null,
  initialPublishedHandoff: null,
  publicationState: 'not-published',
  precedingApproval: {
    gateId: EN_E08_HOLLOW_SENTRY_GATE.id,
    artifactSha256: EN_E08_HOLLOW_SENTRY_GATE.artifactSha256,
    assembledArtifactSha256: EN_E08_HOLLOW_SENTRY_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E08_HOLLOW_SENTRY_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E08_HOLLOW_SENTRY_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E08_HOLLOW_SENTRY_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E08_HOLLOW_SENTRY_GATE.candidateFrameDigest,
    publishedImplementation: EN_E08_HOLLOW_SENTRY_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E08_HOLLOW_SENTRY_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E08_HOLLOW_SENTRY_GATE.initialPublishedHandoff,
    currentReconciliation: 'dc86bb65053564c76b18e848933ab4c2d318bfde',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e08-animated-armor-runeforge-custodian/en-e08-animated-armor-runeforge-custodian-full-suite-raw.png',
  artifactSha256: 'fe033a30fb075a303334d2ee7f2c9af8c17e4b0ec915e068f486ce3703c8854a',
  assembledArtifact: 'enemy-expansion-review/en-e08-animated-armor-runeforge-custodian/en-e08-animated-armor-runeforge-custodian-full-suite-complete-b-form.png',
  assembledArtifactSha256: '03faefe1460e956963484b722508ab999a4aae605d3af1d6ed29174f39bfdb82',
  comparisonArtifact: 'enemy-expansion-review/en-e08-animated-armor-runeforge-custodian/en-e08-animated-armor-runeforge-custodian-family-comparison.png',
  comparisonArtifactSha256: 'b7cea70e48d5ac23e6fdb203cb7bd41cfda65885447987d30e4a5499b3d89f0d',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e08-animated-armor-runeforge-custodian/en-e08-animated-armor-runeforge-custodian-full-suite-four-directions-labeled.gif',
      sha256: '9f6d1335c8bf68d2a56194efeda38823df2604ceb60e2498d1b3520849203f90',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e08-animated-armor-runeforge-custodian/en-e08-animated-armor-runeforge-custodian-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '5165326ba7dccb437de52277d01f001a6c28de265238bd7e2c736f85b82025f9',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
  },
  candidateFrameDigest: '629930688cca04f3d714e12225ab8c3db7c494c5fbaf027d65ec7f8d530ccf85',
  hollowSentryComparisonDigest: EN_E08_HOLLOW_SENTRY_GATE.candidateFrameDigest,
  fallenKnightComparisonDigest: '54a82b2784cee40215221782b502341ee574a722c1416292e5dddf2fcce403ed',
  revenantComparisonDigest: 'f53fa853e7fb7aebc232e3ca1903d8a4d1d717de02576c51fe81f4c4d5b90079',
  scope: 'One complete 80-frame Runeforge Custodian specialist Animated Armor across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle seats and releases the centered rune lock while the rigid constructed shell remains square. Walk uses four deliberate forge-stamp phases with opposed connected gauntlets and divided wedge sabatons. Attack keys both connected gauntlets, draws the hexagonal chest back, drives one interlocking body-owned forge press, and recovers. Hurt uses a complete white recoil and colored locked-joint brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and approved Hollow Sentry, Fallen Knight Shieldbearer, and Grave Oathkeeper Revenant silhouette comparisons together.',
  exclusions: [
    'changes to approved Hollow Sentry or earlier rendered pixels',
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
    'elite Animated Armor',
    'Headless Rider',
    'Possessed Mask',
    'Living Weapon',
    'EN-E09 and later work',
    'release',
    'accepted drift',
  ],
  nextGate: 'The exact Runeforge Custodian digest is visually approved and implementation d73ca9334640384d9b531c0d8375c1a42e459212 records the accepted pixels. Standing publication permission now authorizes only its bounded approval record, branch push, and final handoff reconciliation. Animated Armor registration, fixtures, child/state assets, effects, the elite role, later EN-E08 families, release, accepted drift, and a pull request remain closed; another art gate requires a separate designer lets do next after clean remote reconciliation.',
});

export const EN_E08_RUNEFORGE_CUSTODIAN_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'center-rune-seat', pose: 'idle', bob: 0, helm: 0, arm: -1, step: 0 },
  { name: 'forged-joint-release', pose: 'idle', bob: 1, helm: 0, arm: 1, step: 0 },
]);

const WALK_PHASES = deepFreeze([
  { name: 'left-forge-stamp', pose: 'walk', bob: 0, helm: 0, arm: 1, step: -1 },
  { name: 'square-chassis-pass', pose: 'walk', bob: -1, helm: 0, arm: -1, step: 0 },
  { name: 'right-forge-stamp', pose: 'walk', bob: 0, helm: 0, arm: -1, step: 1 },
  { name: 'joint-belt-settle', pose: 'walk', bob: 1, helm: 0, arm: 1, step: 0 },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'paired-gauntlet-key', pose: 'guard', bob: 1, helm: 0, arm: 0, step: 0 },
  { name: 'hex-forge-chest-draw', pose: 'draw', bob: -1, helm: 0, arm: -1, step: -1 },
  { name: 'interlocking-forge-press', pose: 'clamp', bob: 0, helm: 0, arm: 1, step: 1 },
  { name: 'grounded-custodian-recover', pose: 'recover', bob: 1, helm: 0, arm: 0, step: 0 },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-rune-lock-recoil', pose: 'hurt', bob: -1, helm: 0, arm: -1, step: -1, flash: true },
  { name: 'colored-locked-joint-brace', pose: 'brace', bob: 1, helm: 0, arm: 1, step: 1, flash: false },
]);

function createPixels() {
  return new Array(SIZE * SIZE).fill(null);
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Runeforge Custodian rectangles must use positive integer geometry.',
    );
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Runeforge Custodian authored pixels must remain inside the 24x24 cell.');
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
  paint.rect(9, 16, 6, 3, COLORS.joint[1]);
  paint.rect(leftX, 16, 4, 6, COLORS.plate[1]);
  paint.rect(rightX, 16, 4, 6, COLORS.plate[0]);
  paint.rect(leftX + 1, 17, 2, 3, COLORS.plate[2]);
  paint.rect(rightX + 1, 17, 2, 3, COLORS.forge[0]);
  paint.rect(leftX - 2, 20, 6, 3, COLORS.plate[1]);
  paint.rect(rightX, 20, 6, 3, COLORS.plate[0]);
  paint.rect(leftX - 2, 22, 6, 1, COLORS.joint[1]);
  paint.rect(rightX, 22, 6, 1, COLORS.joint[1]);
  paint.dot(leftX + 1, 21, COLORS.rune[2]);
  paint.dot(rightX + 2, 21, COLORS.forge[2]);
}

function drawFrontArms(paint, phase, y) {
  if (phase.pose === 'guard') {
    paint.rect(4, 10 + y, 5, 6, COLORS.plate[1]);
    paint.rect(7, 13 + y, 5, 5, COLORS.forge[0]);
    paint.rect(15, 10 + y, 5, 6, COLORS.plate[0]);
    paint.rect(12, 13 + y, 5, 5, COLORS.forge[1]);
    paint.rect(9, 15 + y, 6, 3, COLORS.joint[1]);
    paint.rect(11, 15 + y, 2, 2, COLORS.rune[2]);
  } else if (phase.pose === 'draw') {
    paint.rect(2, 9 + y, 7, 5, COLORS.plate[1]);
    paint.rect(1, 13 + y, 6, 5, COLORS.forge[1]);
    paint.rect(15, 9 + y, 7, 5, COLORS.plate[0]);
    paint.rect(17, 13 + y, 6, 5, COLORS.forge[0]);
    paint.rect(1, 16 + y, 6, 2, COLORS.joint[0]);
    paint.rect(17, 16 + y, 6, 2, COLORS.joint[0]);
  } else if (phase.pose === 'clamp') {
    paint.rect(3, 9 + y, 7, 5, COLORS.plate[1]);
    paint.rect(5, 12 + y, 8, 6, COLORS.forge[0]);
    paint.rect(14, 9 + y, 7, 5, COLORS.plate[0]);
    paint.rect(11, 12 + y, 8, 6, COLORS.forge[1]);
    paint.rect(8, 14 + y, 8, 4, COLORS.joint[1]);
    paint.rect(10, 15 + y, 4, 2, COLORS.rune[0]);
  } else if (phase.pose === 'brace' || phase.pose === 'recover') {
    paint.rect(4, 10 + y, 5, 8, COLORS.plate[1]);
    paint.rect(3, 15 + y, 6, 3, COLORS.forge[1]);
    paint.rect(15, 10 + y, 5, 8, COLORS.plate[0]);
    paint.rect(15, 15 + y, 6, 3, COLORS.forge[0]);
    paint.dot(4, 16 + y, COLORS.rune[2]);
    paint.dot(19, 16 + y, COLORS.forge[2]);
  } else {
    const swing = phase.arm || 0;
    paint.rect(4, 10 + y, 5, 7, COLORS.plate[1]);
    paint.rect(3, 14 + y + Math.max(swing, 0), 6, 4, COLORS.forge[1]);
    paint.rect(15, 10 + y, 5, 7, COLORS.plate[0]);
    paint.rect(15, 14 + y + Math.max(-swing, 0), 6, 4, COLORS.forge[0]);
    paint.dot(4, 16 + y + Math.max(swing, 0), COLORS.rune[2]);
    paint.dot(19, 16 + y + Math.max(-swing, 0), COLORS.forge[2]);
  }
}

function drawFront(paint, phase, rear) {
  const y = phase.bob;
  const spread = phase.pose === 'draw' ? 1 : 0;
  drawFrontLegs(paint, phase);

  paint.rect(5 - spread, 9 + y, 14 + (spread * 2), 4, COLORS.plate[1]);
  paint.rect(3 - spread, 9 + y, 6, 4, COLORS.plate[0]);
  paint.rect(15 + spread, 9 + y, 6, 4, COLORS.plate[0]);
  paint.rect(7, 10 + y, 10, 7, COLORS.plate[0]);
  paint.rect(8, 11 + y, 8, 6, COLORS.forge[1]);
  paint.rect(9, 12 + y, 6, 5, COLORS.plate[2]);
  paint.rect(10, 13 + y, 4, 4, COLORS.cavity[0]);
  if (rear) {
    paint.rect(10, 12 + y, 4, 4, COLORS.plate[1]);
    paint.rect(11, 12 + y, 2, 4, COLORS.forge[0]);
    paint.dot(10, 15 + y, COLORS.cavity[0]);
    paint.dot(13, 15 + y, COLORS.cavity[0]);
    paint.dot(11, 13 + y, COLORS.rune[0]);
    paint.dot(12, 14 + y, COLORS.rune[2]);
  } else {
    paint.rect(10, 12 + y, 4, 4, COLORS.cavity[1]);
    paint.rect(11, 13 + y, 2, 2, COLORS.rune[0]);
    paint.dot(11, 14 + y, COLORS.rune[2]);
  }
  paint.dot(8, 13 + y, COLORS.forge[2]);
  paint.dot(15, 13 + y, COLORS.rune[1]);
  drawFrontArms(paint, phase, y);
  paint.rect(9, 16 + y, 6, 2, COLORS.joint[0]);
  paint.rect(11, 16 + y, 2, 2, COLORS.rune[1]);

  const helmY = 2 + y + phase.helm;
  paint.rect(9, helmY, 6, 1, COLORS.plate[2]);
  paint.rect(7, helmY + 1, 10, 2, COLORS.plate[0]);
  paint.rect(6, helmY + 3, 12, 5, COLORS.plate[1]);
  paint.rect(8, helmY + 7, 8, 2, COLORS.forge[0]);
  if (rear) {
    paint.rect(9, helmY + 3, 6, 4, COLORS.plate[0]);
    paint.rect(11, helmY + 3, 2, 5, COLORS.forge[1]);
    paint.dot(9, helmY + 6, COLORS.cavity[0]);
    paint.dot(14, helmY + 6, COLORS.cavity[0]);
    paint.dot(11, helmY + 5, COLORS.rune[2]);
  } else {
    paint.rect(9, helmY + 3, 6, 4, COLORS.cavity[1]);
    paint.dot(11, helmY + 3, COLORS.rune[0]);
    paint.dot(10, helmY + 4, COLORS.rune[1]);
    paint.dot(12, helmY + 4, COLORS.rune[1]);
    paint.rect(11, helmY + 4, 1, 2, COLORS.aperture);
    paint.dot(10, helmY + 6, COLORS.rune[1]);
    paint.dot(12, helmY + 6, COLORS.rune[1]);
  }
  paint.dot(7, helmY + 5, COLORS.forge[2]);
  paint.dot(16, helmY + 5, COLORS.plate[2]);
}

function drawSideLegs(paint, phase) {
  const farX = 8 + Math.min(phase.step, 0);
  const nearX = 13 + Math.max(phase.step, 0);
  paint.rect(10, 16, 6, 3, COLORS.joint[1]);
  paint.rect(farX, 16, 4, 6, COLORS.plate[1]);
  paint.rect(nearX, 16, 4, 6, COLORS.plate[0]);
  paint.rect(farX - 2, 20, 6, 3, COLORS.plate[1]);
  paint.rect(nearX, 20, 7, 3, COLORS.plate[0]);
  paint.rect(farX - 2, 22, 6, 1, COLORS.cavity[0]);
  paint.rect(nearX, 22, 7, 1, COLORS.cavity[0]);
  paint.dot(farX + 1, 18, COLORS.plate[2]);
  paint.dot(nearX + 2, 18, COLORS.forge[2]);
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
    paint.rect(19, 14 + y, 4, 4, COLORS.forge[0]);
    paint.rect(20, 15 + y, 3, 2, COLORS.rune[1]);
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
  paint.dot(8, 16 + y, COLORS.rune[2]);
  paint.dot(19, 16 + y, COLORS.forge[2]);
}

function drawSide(paint, phase) {
  const y = phase.bob;
  const reach = phase.pose === 'clamp' ? 1 : 0;
  drawSideLegs(paint, phase);

  paint.rect(7, 9 + y, 12 + reach, 5, COLORS.plate[1]);
  paint.rect(6, 10 + y, 5, 4, COLORS.plate[0]);
  paint.rect(15, 10 + y, 5 + reach, 4, COLORS.forge[0]);
  paint.rect(9, 10 + y, 9, 7, COLORS.plate[0]);
  paint.rect(10, 12 + y, 7, 5, COLORS.plate[2]);
  paint.rect(11, 14 + y, 6, 4, COLORS.plate[1]);
  paint.rect(12, 15 + y, 4, 3, COLORS.cavity[0]);
  paint.rect(13, 12 + y, 3, 3, COLORS.cavity[1]);
  paint.rect(14, 13 + y, 2, 2, COLORS.rune[0]);
  drawSideArms(paint, phase, y);
  paint.rect(10, 16 + y, 7, 2, COLORS.joint[0]);
  paint.rect(13, 16 + y, 2, 2, COLORS.rune[1]);

  const helmY = 2 + y + phase.helm;
  paint.rect(12, helmY, 5, 1, COLORS.plate[2]);
  paint.rect(10, helmY + 1, 8, 2, COLORS.plate[0]);
  paint.rect(9, helmY + 3, 10, 5, COLORS.plate[1]);
  paint.rect(13, helmY + 3, 6, 4, COLORS.cavity[1]);
  paint.rect(14, helmY + 4, 4, 2, COLORS.rune[1]);
  paint.rect(15, helmY + 3, 2, 4, COLORS.rune[0]);
  paint.dot(16, helmY + 5, COLORS.aperture);
  paint.dot(10, helmY + 5, COLORS.forge[2]);
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
    return HURT_PHASES[EN_E08_RUNEFORGE_CUSTODIAN_DEATH_SOURCE_FRAMES[frame]];
  }
  throw new TypeError('Animation ' + animation + ' is not implemented for Runeforge Custodian.');
}

function buildPixels(direction, animation, frame) {
  const phase = phaseFor(animation, frame);
  const canonical = direction === 'left' ? 'right' : direction;
  const pixels = createPixels();
  const paint = painter(pixels);
  if (canonical === 'down') drawFront(paint, phase, false);
  else if (canonical === 'up') drawFront(paint, phase, true);
  else if (canonical === 'right') drawSide(paint, phase);
  else throw new TypeError('Unsupported Runeforge Custodian direction ' + direction + '.');
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

export function renderEnE08RuneforgeCustodianFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Runeforge Custodian rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Runeforge Custodian direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'animated-armor',
    variant: 'runeforge-custodian',
    direction,
    animation,
    frame,
    phase: phase.name,
    runeforgeCustodianGate: EN_E08_RUNEFORGE_CUSTODIAN_GATE.id,
    approvedPrecedingGate: EN_E08_HOLLOW_SENTRY_GATE.id,
    actorTopology: EN_E08_ACTOR_TOPOLOGY_DECISION.selected,
    childAssetCount: EN_E08_RUNEFORGE_CUSTODIAN_DATA.childAssets.length,
    alphaPolicy: EN_E08_RUNEFORGE_CUSTODIAN_DATA.alphaPolicy,
    effectBoundary: EN_E08_RUNEFORGE_CUSTODIAN_DATA.effectBoundary,
  });
}

export const EN_E08_RUNEFORGE_CUSTODIAN_RENDERER = deepFreeze({
  key: 'en-e08-animated-armor-runeforge-custodian-v1',
  chassis: EN_E08_RUNEFORGE_CUSTODIAN_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'animated-armor', 'The EN-E08 Runeforge Custodian renderer is restricted to Animated Armor.');
    assert(variant.id === 'runeforge-custodian', 'The EN-E08 Runeforge Custodian renderer is restricted to Runeforge Custodian.');
    return renderEnE08RuneforgeCustodianFrame(context, direction, animation.id, frame);
  },
});

const RUNEFORGE_CUSTODIAN_VARIANT = deepFreeze({
  id: 'runeforge-custodian',
  name: 'Runeforge Custodian',
  role: EN_E08_RUNEFORGE_CUSTODIAN_CONTRACT.role,
  status: EN_E08_RUNEFORGE_CUSTODIAN_CONTRACT.state,
  brief: 'A private complete specialist Animated Armor using one baked 24x24 actor: angular crownless helm, large single rune-lock aperture, square pauldrons, hex forge chest, connected interlocking gauntlets, rigid joint belt, divided greaves, and wedge sabatons; child assets, flesh, gears, weapons, shields, and effects remain external.',
  rendererData: EN_E08_RUNEFORGE_CUSTODIAN_DATA,
});

export const EN_E08_RUNEFORGE_CUSTODIAN_FAMILY = deepFreeze({
  id: 'animated-armor',
  name: 'Animated Armor Runeforge Custodian Review',
  sliceId: 'EN-E08',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E08_RUNEFORGE_CUSTODIAN_CONTRACT.chassis,
  rendererKey: EN_E08_RUNEFORGE_CUSTODIAN_RENDERER.key,
  variants: [RUNEFORGE_CUSTODIAN_VARIANT],
  rendererData: {
    contractCard: EN_E08_RUNEFORGE_CUSTODIAN_CONTRACT_CARD.id,
    architectureDecision: EN_E08_ACTOR_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E08_HOLLOW_SENTRY_GATE.id,
    activeGate: EN_E08_RUNEFORGE_CUSTODIAN_GATE.id,
  },
  review: {
    baselineVariant: 'runeforge-custodian',
    scale: 8,
    notes: 'Visually approved as one constructed-rune-lock specialist rendered entirely as a baked single actor against approved Hollow Sentry, Fallen Knight Shieldbearer, and Grave Oathkeeper Revenant. Implementation d73ca9334640384d9b531c0d8375c1a42e459212 records the exact accepted pixels. Keep registration, fixtures, child/state assets, effects, the elite role and later EN-E08 families, release, accepted drift, a pull request, and another art gate separate.',
  },
});

export const EN_E08_RUNEFORGE_CUSTODIAN_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E08_RUNEFORGE_CUSTODIAN_RENDERER],
  families: [EN_E08_RUNEFORGE_CUSTODIAN_FAMILY],
});
