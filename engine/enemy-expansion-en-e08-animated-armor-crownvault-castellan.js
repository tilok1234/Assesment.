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
import { EN_E08_RUNEFORGE_CUSTODIAN_GATE } from './enemy-expansion-en-e08-animated-armor-runeforge-custodian.js';

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
  plate: ['#596572', '#29313b', '#a9b3bb'],
  gold: ['#b4863d', '#6a4a24', '#dfbb68'],
  forge: ['#b4863d', '#6a4a24', '#dfbb68'],
  vault: ['#794a61', '#432936', '#b97991'],
  rune: ['#794a61', '#432936', '#b97991'],
  joint: ['#39343a', '#171a20', '#6d5b59'],
  cavity: ['#20232a', '#090c11'],
  seal: '#ffe3a0',
  aperture: '#ffe3a0',
  flash: '#f4f4f4',
});
export const EN_E08_CROWNVAULT_CASTELLAN_CONTRACT_CARD = deepFreeze({
  id: 'en-e08-animated-armor-crownvault-castellan-v1',
  sliceId: 'EN-E08',
  family: 'animated-armor',
  familyName: 'Animated Armor',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingVariant: {
    id: 'runeforge-custodian',
    name: 'Runeforge Custodian',
    role: 'specialist',
    identity: 'constructed-rune-lock',
    status: 'approved-published',
  },
  activeVariant: {
    id: 'crownvault-castellan',
    name: 'Crownvault Castellan',
    role: 'elite',
    identity: 'royal-fortress-vault',
    status: 'implemented-full-approved',
  },
  deferredRoles: [],
  actorTopology: EN_E08_ACTOR_TOPOLOGY_DECISION.selected,
  styleContract: 'Use chunky one-to-three-pixel hard-alpha forms and an independently authored monumental elite fortress-suit silhouette. Keep a crenellated crownvault helm with one readable T-shaped vault seal, tower pauldrons, a broad gatehouse chest, connected bastion gauntlets, a portcullis waist, pillar greaves, and wide grounded plinth sabatons. The actor must remain one baked suit without flesh, cloth, gears, a weapon, shield, floating plate, glow, or child asset.',
  effectBoundary: EN_E08_ANIMATED_ARMOR_CONTRACT_CARD.effectBoundary,
});

export const EN_E08_CROWNVAULT_CASTELLAN_CONTRACT = deepFreeze({
  sliceId: 'EN-E08',
  family: 'animated-armor',
  variant: 'crownvault-castellan',
  role: 'elite',
  identity: 'royal-fortress-vault',
  state: 'implemented-complete-motion-approved',
  topology: EN_E08_ACTOR_TOPOLOGY_DECISION.selected,
  chassis: 'baked-single-actor-crenellated-crownvault-helm-t-vault-seal-tower-pauldrons-gatehouse-chest-bastion-gauntlets-portcullis-waist-pillar-greaves-plinth-sabatons-v1',
  silhouette: 'A monumental royal fortress-suit with a crenellated crownvault helm, one centered T-shaped vault seal, tall tower pauldrons, a broad gatehouse breastplate, two connected bastion gauntlets, a portcullis waist, pillar greaves, and wide grounded plinth sabatons. It must exceed Hollow Sentry and Runeforge Custodian in mass and ceremony without becoming a living knight, boss-scale colossus, gear-driven automaton, independent weapon, shield carrier, or detached castle set.',
  visualIdentity: 'Charcoal royal plate, old gold battlement bands, wine-dark vault insets, black fixed joints, and one warm ivory T-seal communicate an ancient elite castellated suit. No paired ghost eyes, vertical rune key, flesh, cloth tabard, gears, handheld weapon, shield, aura, sparks, or detached component is used.',
  effectBoundary: EN_E08_CROWNVAULT_CASTELLAN_CONTRACT_CARD.effectBoundary,
});

export const EN_E08_CROWNVAULT_CASTELLAN_DATA = deepFreeze({
  actor: {
    species: 'baked-animated-armor',
    bodyBuild: 'monumental-broad-royal-fortress-elite',
    skin: 'none',
    hairStyle: 'none',
    hairColor: 'none',
    expression: 'single-readable-t-vault-seal',
    faceDetail: 'centered-t-shaped-ivory-seal-in-black-vault-slot',
    headgear: 'baked-crenellated-crownvault-helm',
    outfit: 'baked-gatehouse-chest-and-fortress-plate-body',
    outfitColor: 'charcoal-old-gold-wine-vault-and-ivory-seal',
    outfitTier: 'tier3',
    weapon: 'connected-bastion-gauntlet-press',
    weaponTier: 'none',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.joint,
      hair: COLORS.vault,
      outfit: COLORS.plate,
    },
  },
  crownvaultCastellan: COLORS,
  actorTopology: EN_E08_ACTOR_TOPOLOGY_DECISION.selected,
  childAssets: [],
  alphaPolicy: 'binary-single-component-baked-crenellated-crownvault-helm-t-seal-tower-pauldrons-gatehouse-chest-connected-bastion-gauntlets-portcullis-waist-pillar-greaves-and-grounded-plinth-sabatons',
  effectBoundary: EN_E08_CROWNVAULT_CASTELLAN_CONTRACT_CARD.effectBoundary,
  bakedEffects: [],
});

export const EN_E08_CROWNVAULT_CASTELLAN_GATE = deepFreeze({
  id: 'en-e08-animated-armor-crownvault-castellan-full-v1',
  status: 'approved',
  baseCheckpoint: '700f2cedb1d3104369931a97bfec31a3b49fff93',
  authorizedOn: '2026-08-11',
  authorizationEvidence: 'After the exact Runeforge Custodian digest was visually approved, committed, pushed, and reconciled at clean published checkpoint 700f2cedb1d3104369931a97bfec31a3b49fff93, the designer replied: lets do nextr. Runeforge Custodian completed the specialist role, so the one-complete-sprite cadence authorizes only one private elite Animated Armor Crownvault Castellan 80-frame candidate.',
  architectureDecision: EN_E08_ACTOR_TOPOLOGY_DECISION.id,
  approvedOn: '2026-08-11',
  approvalEvidence: 'The exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, the approved Runeforge Custodian, Hollow Sentry, and Fallen Knight Shieldbearer comparison, and both synchronized GIFs were presented. The three exact frozen PNG paths were open together in responsive Aseprite 1.3.17.2 process 32136. The designer replied: approved. In context this explicitly approves candidate digest 112feaad57ce04cb2dae15f5bd33f2e7e4fd3418cd3aece68aeb345ff1dc9039 and its five frozen review hashes only. Animated Armor registration, fixtures, child/state assets, effects, later EN-E08 families, release, accepted drift, a pull request, and another art gate remain separate decisions.',
  approvedImplementation: '46d09a4e16a11f9c622cb698ff30055bb9bcb877',
  publicationAuthorizedOn: '2026-08-11',
  publicationAuthorizationEvidence: 'The designer said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact artifact or digest. It does not authorize registration, fixtures, child/state assets, effects, later roles or families, release, accepted drift, a pull request, or any other unopened gate.',
  publishedImplementation: '46d09a4e16a11f9c622cb698ff30055bb9bcb877',
  publishedApprovalRecord: '9c21f92aed06a66092279e8d53db6cb9a289cbd9',
  initialPublishedHandoff: '9aea250a9a509a27a233d27633e6f7cf9bb759a2',
  publicationState: 'published',
  precedingApproval: {
    gateId: EN_E08_RUNEFORGE_CUSTODIAN_GATE.id,
    artifactSha256: EN_E08_RUNEFORGE_CUSTODIAN_GATE.artifactSha256,
    assembledArtifactSha256: EN_E08_RUNEFORGE_CUSTODIAN_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E08_RUNEFORGE_CUSTODIAN_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E08_RUNEFORGE_CUSTODIAN_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E08_RUNEFORGE_CUSTODIAN_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E08_RUNEFORGE_CUSTODIAN_GATE.candidateFrameDigest,
    publishedImplementation: EN_E08_RUNEFORGE_CUSTODIAN_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E08_RUNEFORGE_CUSTODIAN_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E08_RUNEFORGE_CUSTODIAN_GATE.initialPublishedHandoff,
    currentReconciliation: '700f2cedb1d3104369931a97bfec31a3b49fff93',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e08-animated-armor-crownvault-castellan/en-e08-animated-armor-crownvault-castellan-full-suite-raw.png',
  artifactSha256: '43dfbf617e3e746be3e1afaeafdbff628502709bfd68ba8c02ea7c2f0d9cde47',
  assembledArtifact: 'enemy-expansion-review/en-e08-animated-armor-crownvault-castellan/en-e08-animated-armor-crownvault-castellan-full-suite-complete-b-form.png',
  assembledArtifactSha256: '1ee1f901c04d95a191d7608f8a41443dfaa4c9ad6593bc1fdc76d4d3db4828e4',
  comparisonArtifact: 'enemy-expansion-review/en-e08-animated-armor-crownvault-castellan/en-e08-animated-armor-crownvault-castellan-family-comparison.png',
  comparisonArtifactSha256: '6f6b4dc735803dd902571047ce44e5ee33472e962a303eb2072ecae93dc319ce',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e08-animated-armor-crownvault-castellan/en-e08-animated-armor-crownvault-castellan-full-suite-four-directions-labeled.gif',
      sha256: '5129fed8d00af19fc52de9d6e36ea3b9d36f03e46a390e380d9ced5ba8bc642c',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e08-animated-armor-crownvault-castellan/en-e08-animated-armor-crownvault-castellan-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '554d85925e689b89e7bfdcef573d44e96313c8077fc5013081dd906786aa414b',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
  },
  candidateFrameDigest: '112feaad57ce04cb2dae15f5bd33f2e7e4fd3418cd3aece68aeb345ff1dc9039',
  runeforgeCustodianComparisonDigest: EN_E08_RUNEFORGE_CUSTODIAN_GATE.candidateFrameDigest,
  hollowSentryComparisonDigest: EN_E08_HOLLOW_SENTRY_GATE.candidateFrameDigest,
  fallenKnightComparisonDigest: '54a82b2784cee40215221782b502341ee574a722c1416292e5dddf2fcce403ed',
  revenantComparisonDigest: 'f53fa853e7fb7aebc232e3ca1903d8a4d1d717de02576c51fe81f4c4d5b90079',
  scope: 'One complete 80-frame Crownvault Castellan elite Animated Armor across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle locks and releases the T-shaped crownvault seal while the fortress chassis settles. Walk uses four monumental plinth-stamp phases with tower pauldrons and pillar greaves. Attack closes both connected bastion gauntlets, draws the gatehouse chest, drives one body-owned fortress press, and recovers. Hurt uses a complete white recoil and colored portcullis brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and approved Runeforge Custodian, Hollow Sentry, and Fallen Knight Shieldbearer silhouette comparisons together.',
  exclusions: [
    'changes to approved Runeforge Custodian, Hollow Sentry, or earlier rendered pixels',
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
    'Headless Rider',
    'Possessed Mask',
    'Living Weapon',
    'EN-E09 and later work',
    'release',
    'accepted drift',
  ],
  nextGate: 'The exact Crownvault Castellan implementation 46d09a4e16a11f9c622cb698ff30055bb9bcb877, approval record 9c21f92aed06a66092279e8d53db6cb9a289cbd9, and initial handoff 9aea250a9a509a27a233d27633e6f7cf9bb759a2 are remote verified. This reconciliation completes the bounded publication tuple. Animated Armor registration, fixtures, child/state assets, effects, later EN-E08 families, release, accepted drift, and a pull request remain closed; another art gate requires a separate designer lets do next from this clean published reconciliation.',
});

export const EN_E08_CROWNVAULT_CASTELLAN_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'crownvault-seal-lock', pose: 'idle', bob: 0, helm: 0, arm: -1, step: 0 },
  { name: 'fortress-chassis-settle', pose: 'idle', bob: 1, helm: 0, arm: 1, step: 0 },
]);

const WALK_PHASES = deepFreeze([
  { name: 'left-plinth-stamp', pose: 'walk', bob: 0, helm: 0, arm: 1, step: -1 },
  { name: 'gatehouse-weight-pass', pose: 'walk', bob: -1, helm: 0, arm: -1, step: 0 },
  { name: 'right-plinth-stamp', pose: 'walk', bob: 0, helm: 0, arm: -1, step: 1 },
  { name: 'portcullis-waist-settle', pose: 'walk', bob: 1, helm: 0, arm: 1, step: 0 },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'bastion-gauntlet-close', pose: 'guard', bob: 1, helm: 0, arm: 0, step: 0 },
  { name: 'gatehouse-chest-draw', pose: 'draw', bob: -1, helm: 0, arm: -1, step: -1 },
  { name: 'body-owned-fortress-press', pose: 'clamp', bob: 0, helm: 0, arm: 1, step: 1 },
  { name: 'grounded-castellan-recover', pose: 'recover', bob: 1, helm: 0, arm: 0, step: 0 },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-crownvault-recoil', pose: 'hurt', bob: -1, helm: 0, arm: -1, step: -1, flash: true },
  { name: 'colored-portcullis-brace', pose: 'brace', bob: 1, helm: 0, arm: 1, step: 1, flash: false },
]);

function createPixels() {
  return new Array(SIZE * SIZE).fill(null);
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Crownvault Castellan rectangles must use positive integer geometry.',
    );
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Crownvault Castellan authored pixels must remain inside the 24x24 cell.');
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
  paint.rect(leftX - 3, 20, 7, 3, COLORS.plate[1]);
  paint.rect(rightX, 20, 7, 3, COLORS.plate[0]);
  paint.rect(leftX - 3, 22, 7, 1, COLORS.joint[1]);
  paint.rect(rightX, 22, 7, 1, COLORS.joint[1]);
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

  paint.rect(2 - spread, 8 + y, 6, 7, COLORS.plate[1]);
  paint.rect(16 + spread, 8 + y, 6, 7, COLORS.plate[0]);
  paint.rect(2 - spread, 9 + y, 6, 2, COLORS.gold[0]);
  paint.rect(16 + spread, 9 + y, 6, 2, COLORS.gold[1]);
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
  paint.rect(7, helmY, 3, 2, COLORS.plate[2]);
  paint.rect(11, helmY, 3, 2, COLORS.plate[2]);
  paint.rect(15, helmY, 2, 2, COLORS.plate[2]);
  paint.rect(7, helmY + 1, 10, 2, COLORS.gold[1]);
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
    paint.rect(10, helmY + 4, 4, 1, COLORS.seal);
    paint.rect(11, helmY + 4, 2, 3, COLORS.seal);
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
  paint.rect(farX - 3, 20, 7, 3, COLORS.plate[1]);
  paint.rect(nearX, 20, 8, 3, COLORS.plate[0]);
  paint.rect(farX - 3, 22, 7, 1, COLORS.cavity[0]);
  paint.rect(nearX, 22, 8, 1, COLORS.cavity[0]);
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

  paint.rect(5, 8 + y, 7, 7, COLORS.plate[1]);
  paint.rect(15, 8 + y, 6 + reach, 7, COLORS.plate[0]);
  paint.rect(5, 9 + y, 7, 2, COLORS.gold[1]);
  paint.rect(15, 9 + y, 6 + reach, 2, COLORS.gold[0]);
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
  paint.rect(10, helmY, 3, 2, COLORS.plate[2]);
  paint.rect(14, helmY, 3, 2, COLORS.plate[2]);
  paint.rect(18, helmY, 2, 2, COLORS.plate[2]);
  paint.rect(10, helmY + 1, 10, 2, COLORS.gold[1]);
  paint.rect(10, helmY + 1, 8, 2, COLORS.plate[0]);
  paint.rect(9, helmY + 3, 10, 5, COLORS.plate[1]);
  paint.rect(13, helmY + 3, 6, 4, COLORS.cavity[1]);
  paint.rect(15, helmY + 4, 3, 1, COLORS.seal);
  paint.rect(16, helmY + 4, 1, 3, COLORS.seal);
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
    return HURT_PHASES[EN_E08_CROWNVAULT_CASTELLAN_DEATH_SOURCE_FRAMES[frame]];
  }
  throw new TypeError('Animation ' + animation + ' is not implemented for Crownvault Castellan.');
}

function buildPixels(direction, animation, frame) {
  const phase = phaseFor(animation, frame);
  const canonical = direction === 'left' ? 'right' : direction;
  const pixels = createPixels();
  const paint = painter(pixels);
  if (canonical === 'down') drawFront(paint, phase, false);
  else if (canonical === 'up') drawFront(paint, phase, true);
  else if (canonical === 'right') drawSide(paint, phase);
  else throw new TypeError('Unsupported Crownvault Castellan direction ' + direction + '.');
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

export function renderEnE08CrownvaultCastellanFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Crownvault Castellan rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Crownvault Castellan direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'animated-armor',
    variant: 'crownvault-castellan',
    direction,
    animation,
    frame,
    phase: phase.name,
    crownvaultCastellanGate: EN_E08_CROWNVAULT_CASTELLAN_GATE.id,
    approvedPrecedingGate: EN_E08_RUNEFORGE_CUSTODIAN_GATE.id,
    actorTopology: EN_E08_ACTOR_TOPOLOGY_DECISION.selected,
    childAssetCount: EN_E08_CROWNVAULT_CASTELLAN_DATA.childAssets.length,
    alphaPolicy: EN_E08_CROWNVAULT_CASTELLAN_DATA.alphaPolicy,
    effectBoundary: EN_E08_CROWNVAULT_CASTELLAN_DATA.effectBoundary,
  });
}

export const EN_E08_CROWNVAULT_CASTELLAN_RENDERER = deepFreeze({
  key: 'en-e08-animated-armor-crownvault-castellan-v1',
  chassis: EN_E08_CROWNVAULT_CASTELLAN_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'animated-armor', 'The EN-E08 Crownvault Castellan renderer is restricted to Animated Armor.');
    assert(variant.id === 'crownvault-castellan', 'The EN-E08 Crownvault Castellan renderer is restricted to Crownvault Castellan.');
    return renderEnE08CrownvaultCastellanFrame(context, direction, animation.id, frame);
  },
});

const CROWNVAULT_CASTELLAN_VARIANT = deepFreeze({
  id: 'crownvault-castellan',
  name: 'Crownvault Castellan',
  role: EN_E08_CROWNVAULT_CASTELLAN_CONTRACT.role,
  status: EN_E08_CROWNVAULT_CASTELLAN_CONTRACT.state,
  brief: 'A private complete elite Animated Armor using one baked 24x24 actor: crenellated crownvault helm, readable T-seal, tower pauldrons, gatehouse chest, connected bastion gauntlets, portcullis waist, pillar greaves, and plinth sabatons; child assets, flesh, gears, weapons, shields, and effects remain external.',
  rendererData: EN_E08_CROWNVAULT_CASTELLAN_DATA,
});

export const EN_E08_CROWNVAULT_CASTELLAN_FAMILY = deepFreeze({
  id: 'animated-armor',
  name: 'Animated Armor Crownvault Castellan Review',
  sliceId: 'EN-E08',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E08_CROWNVAULT_CASTELLAN_CONTRACT.chassis,
  rendererKey: EN_E08_CROWNVAULT_CASTELLAN_RENDERER.key,
  variants: [CROWNVAULT_CASTELLAN_VARIANT],
  rendererData: {
    contractCard: EN_E08_CROWNVAULT_CASTELLAN_CONTRACT_CARD.id,
    architectureDecision: EN_E08_ACTOR_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E08_RUNEFORGE_CUSTODIAN_GATE.id,
    activeGate: EN_E08_CROWNVAULT_CASTELLAN_GATE.id,
  },
  review: {
    baselineVariant: 'crownvault-castellan',
    scale: 8,
    notes: 'Awaiting visual review as one monumental royal-fortress elite rendered entirely as a baked single actor against approved Runeforge Custodian, Hollow Sentry, and Fallen Knight Shieldbearer. Keep registration, fixtures, child/state assets, effects, later EN-E08 families, release, accepted drift, a pull request, publication, and another art gate separate.',
  },
});

export const EN_E08_CROWNVAULT_CASTELLAN_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E08_CROWNVAULT_CASTELLAN_RENDERER],
  families: [EN_E08_CROWNVAULT_CASTELLAN_FAMILY],
});
