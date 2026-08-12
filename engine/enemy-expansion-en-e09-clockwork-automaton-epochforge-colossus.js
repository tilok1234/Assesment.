
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
import { EN_E09_AETHERDIAL_SURVEYOR_GATE } from './enemy-expansion-en-e09-clockwork-automaton-aetherdial-surveyor.js';

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
  iron: ['#515c62', '#20282d', '#899398'],
  brass: ['#a85f38', '#5a2f25', '#d49355'],
  furnace: ['#8c3f2d', '#3b1718', '#ef9a4a'],
  joint: ['#40383a', '#15191b', '#775348'],
  cavity: ['#272328', '#080b0e'],
  slit: '#f2c36b',
  flash: '#f4f4f4',
});

export const EN_E09_EPOCHFORGE_COLOSSUS_CONTRACT_CARD = deepFreeze({
  id: 'en-e09-clockwork-automaton-epochforge-colossus-v1',
  sliceId: 'EN-E09',
  family: 'clockwork-automaton',
  familyName: 'Clockwork Automaton',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingVariant: {
    id: 'aetherdial-surveyor',
    name: 'Aetherdial Surveyor',
    role: 'specialist',
    identity: 'cyclopean-dial-coil-projector-surveyor',
    status: 'approved-published',
  },
  activeVariant: {
    id: 'epochforge-colossus',
    name: 'Epochforge Colossus',
    role: 'elite',
    identity: 'cog-crown-twin-furnace-hammer-colossus',
    status: 'implemented-full-awaiting-visual-approval',
  },
  deferredRoles: [],
  actorTopology: EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION.selected,
  styleContract: 'Use chunky one-to-three-pixel hard-alpha forms and a broad siege-machine silhouette. Keep one connected cog crown, a low armored sensor slit, twin furnace dials, an exposed reinforced hip axle, oversized integrated hammer forearms, piston legs, and tread-like planted feet. The machine must remain one baked actor without armor anatomy, flesh, cloth, handheld equipment, detached parts, projectiles, sparks, glow, or child assets.',
  effectBoundary: EN_E09_ARCANE_CONSTRUCT_CONTRACT_CARD.effectBoundary,
});

export const EN_E09_EPOCHFORGE_COLOSSUS_CONTRACT = deepFreeze({
  sliceId: 'EN-E09',
  family: 'clockwork-automaton',
  variant: 'epochforge-colossus',
  role: 'elite',
  identity: 'cog-crown-twin-furnace-hammer-colossus',
  state: 'implemented-complete-motion-awaiting-visual-approval',
  topology: EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION.selected,
  chassis: 'baked-single-actor-cog-crown-low-sensor-twin-furnaces-hammer-forearms-hip-axle-tread-feet-v1',
  silhouette: 'A very broad mechanical siege colossus with a connected toothed crown, low head block, twin furnace chest, integrated hammer forearms, reinforced hip axle, piston legs, and wide tread-like feet. It must read as a purpose-built elite machine rather than the narrow Aetherdial Surveyor, squat Brasscoil Sentry, Animated Armor, humanoid in plate, or detached equipment set.',
  visualIdentity: 'Black iron mass, red brass plating, orange furnace dials, a thin pale sensor slit, cog teeth, giant squared hammer forearms, and tread feet communicate a brutal elite automaton. No visor-face, pauldrons, breastplate anatomy, flesh, cloth, handheld weapon, shield, projectile, aura, sparks, or detached component is used.',
  effectBoundary: EN_E09_EPOCHFORGE_COLOSSUS_CONTRACT_CARD.effectBoundary,
});

export const EN_E09_EPOCHFORGE_COLOSSUS_DATA = deepFreeze({
  actor: {
    species: 'baked-clockwork-automaton',
    bodyBuild: 'broad-heavy-twin-furnace-siege-machine',
    skin: 'none',
    hairStyle: 'none',
    hairColor: 'none',
    expression: 'low-readable-armored-sensor-slit',
    faceDetail: 'pale-slit-under-connected-cog-crown',
    headgear: 'none',
    outfit: 'baked-black-iron-chassis-cog-crown-twin-furnaces-hammer-forearms-axle-legs-and-treads',
    outfitColor: 'black-iron-red-brass-and-furnace-orange',
    outfitTier: 'tier3',
    weapon: 'integrated-twin-hammer-forearms',
    weaponTier: 'none',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.joint,
      hair: COLORS.furnace,
      outfit: COLORS.iron,
    },
  },
  epochforgeColossus: COLORS,
  actorTopology: EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION.selected,
  childAssets: [],
  alphaPolicy: 'binary-single-component-baked-cog-crown-low-sensor-twin-furnaces-hammer-forearms-hip-axle-piston-legs-tread-feet-and-ground-contact',
  effectBoundary: EN_E09_EPOCHFORGE_COLOSSUS_CONTRACT_CARD.effectBoundary,
  bakedEffects: [],
});

export const EN_E09_EPOCHFORGE_COLOSSUS_GATE = deepFreeze({
  id: 'en-e09-clockwork-automaton-epochforge-colossus-full-v1',
  status: 'awaiting-visual-approval',
  baseCheckpoint: '0d5aec453d8bad9ba6d4c66a641963932d9c2e78',
  authorizedOn: '2026-08-12',
  authorizationEvidence: 'After the exact Aetherdial Surveyor publication tuple was clean and remote verified at checkpoint 0d5aec453d8bad9ba6d4c66a641963932d9c2e78, the designer replied: lets do nexty. Under the selected en-e09-clockwork-automaton-baked-single-actor-v1 topology and one-complete-sprite cadence, this authorizes only one private elite Epochforge Colossus 80-frame art candidate. Registration, fixtures, effects, child assets, later families, release, accepted drift, and a pull request remain closed.',
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
    gateId: EN_E09_AETHERDIAL_SURVEYOR_GATE.id,
    artifactSha256: EN_E09_AETHERDIAL_SURVEYOR_GATE.artifactSha256,
    assembledArtifactSha256: EN_E09_AETHERDIAL_SURVEYOR_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E09_AETHERDIAL_SURVEYOR_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E09_AETHERDIAL_SURVEYOR_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E09_AETHERDIAL_SURVEYOR_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E09_AETHERDIAL_SURVEYOR_GATE.candidateFrameDigest,
    publishedImplementation: EN_E09_AETHERDIAL_SURVEYOR_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E09_AETHERDIAL_SURVEYOR_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E09_AETHERDIAL_SURVEYOR_GATE.initialPublishedHandoff,
    currentReconciliation: '0d5aec453d8bad9ba6d4c66a641963932d9c2e78',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e09-clockwork-automaton-epochforge-colossus/en-e09-clockwork-automaton-epochforge-colossus-full-suite-raw.png',
  artifactSha256: '7d47c4ba15edc745133c02484c8e535f70b044986b319bd3c59aeff82f58d529',
  assembledArtifact: 'enemy-expansion-review/en-e09-clockwork-automaton-epochforge-colossus/en-e09-clockwork-automaton-epochforge-colossus-full-suite-complete-b-form.png',
  assembledArtifactSha256: '7349145fe0943007a92fc55bb1a52eea187a8a3eff8029db2f811dec76caa4c5',
  comparisonArtifact: 'enemy-expansion-review/en-e09-clockwork-automaton-epochforge-colossus/en-e09-clockwork-automaton-epochforge-colossus-family-comparison.png',
  comparisonArtifactSha256: '4b24ab724c98551dd3f85fd0d5fabde0de5b86aeeb38d163a500cd3dd55795b4',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e09-clockwork-automaton-epochforge-colossus/en-e09-clockwork-automaton-epochforge-colossus-full-suite-four-directions-labeled.gif',
      sha256: 'b4c94bc40c9500c52139de6e1aa718e7f5a3607b610e36176bd6fda4c707320c',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e09-clockwork-automaton-epochforge-colossus/en-e09-clockwork-automaton-epochforge-colossus-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '2c3e213170572269be1d810e61ec38fc8697eb31936479df4d7efdc8836097bc',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
  },
  candidateFrameDigest: '0b0c8b792a177c08fd9655cf635aa2b756373ecb57aefe5ff508291f5b708254',
  aetherdialComparisonDigest: EN_E09_AETHERDIAL_SURVEYOR_GATE.candidateFrameDigest,
  brasscoilComparisonDigest: EN_E09_BRASSCOIL_SENTRY_GATE.candidateFrameDigest,
  runeforgeComparisonDigest: EN_E08_RUNEFORGE_CUSTODIAN_GATE.candidateFrameDigest,
  scope: 'One complete 80-frame Epochforge Colossus elite Clockwork Automaton across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle banks the twin furnace dials and indexes the connected cog crown. Walk uses four heavy piston steps with opposed integrated hammer weight. Attack guards, raises both hammer forearms, performs a body-owned compression strike with no impact pixels, and recovers. Hurt uses a complete white recoil and colored tread brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and approved Aetherdial Surveyor, Brasscoil Sentry, and Runeforge Custodian family comparisons together.',
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
    'additional Clockwork Automaton roles',
    'Living Book, Runic Idol, Crystal Beast, or later work',
    'release',
    'accepted drift',
  ],
  nextGate: 'Stop for explicit designer visual approval of the exact frozen Epochforge Colossus review artifacts and candidate digest. Do not publish, register, add fixtures, add child/state assets, add effects, begin later families, release, accept drift, or open a pull request.',
});

export const EN_E09_EPOCHFORGE_COLOSSUS_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'twin-furnace-bank', pose: 'idle', bob: 0, arm: -1, step: 0 },
  { name: 'cog-crown-index', pose: 'idle', bob: 1, arm: 1, step: 0 },
]);

const WALK_PHASES = deepFreeze([
  { name: 'left-tread-piston-step', pose: 'walk', bob: 0, arm: 1, step: -1 },
  { name: 'siege-weight-pass', pose: 'walk', bob: -1, arm: -1, step: 0 },
  { name: 'right-tread-piston-step', pose: 'walk', bob: 0, arm: -1, step: 1 },
  { name: 'hip-axle-settle', pose: 'walk', bob: 1, arm: 1, step: 0 },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'hammer-guard', pose: 'guard', bob: 1, arm: 0, step: 0 },
  { name: 'twin-hammer-rise', pose: 'raise', bob: -1, arm: -1, step: -1 },
  { name: 'body-owned-compression-strike', pose: 'strike', bob: 0, arm: 1, step: 1 },
  { name: 'epochforge-recover', pose: 'recover', bob: 1, arm: 0, step: 0 },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-colossus-recoil', pose: 'hurt', bob: -1, arm: -1, step: -1, flash: true },
  { name: 'colored-tread-brace', pose: 'brace', bob: 1, arm: 1, step: 1, flash: false },
]);

function createPixels() {
  return new Array(SIZE * SIZE).fill(null);
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Epochforge Colossus rectangles must use positive integer geometry.',
    );
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Epochforge Colossus authored pixels must remain inside the 24x24 cell.');
      pixels[(py * SIZE) + px] = fill;
    }
  };
  return {
    rect,
    dot(x, y, fill) { rect(x, y, 1, 1, fill); },
  };
}

function drawFrontLegs(paint, phase) {
  const leftX = 5 + Math.min(phase.step, 0);
  const rightX = 15 + Math.max(phase.step, 0);
  paint.rect(5, 15, 14, 4, COLORS.iron[1]);
  paint.rect(7, 16, 10, 2, COLORS.brass[1]);
  paint.rect(10, 16, 4, 3, COLORS.joint[0]);
  paint.rect(leftX, 18, 4, 4, COLORS.joint[2]);
  paint.rect(rightX, 18, 4, 4, COLORS.joint[1]);
  paint.rect(leftX - 3, 21, 9, 2, COLORS.iron[0]);
  paint.rect(rightX - 1, 21, 9, 2, COLORS.iron[0]);
  paint.rect(leftX - 2, 22, 7, 1, COLORS.cavity[1]);
  paint.rect(rightX, 22, 7, 1, COLORS.cavity[1]);
}

function drawFrontArms(paint, phase, y) {
  let hammerY = 10 + y;
  if (phase.pose === 'raise') hammerY = 4 + y;
  else if (phase.pose === 'strike') hammerY = 12 + y;
  else if (phase.pose === 'guard') hammerY = 8 + y;
  else hammerY += Math.max(phase.arm, 0);
  paint.rect(4, 9 + y, 6, 4, COLORS.joint[0]);
  paint.rect(14, 9 + y, 6, 4, COLORS.joint[0]);
  paint.rect(2, hammerY, 6, 6, COLORS.iron[0]);
  paint.rect(16, hammerY, 6, 6, COLORS.iron[0]);
  paint.rect(1, hammerY + 1, 6, 4, COLORS.brass[1]);
  paint.rect(17, hammerY + 1, 6, 4, COLORS.brass[0]);
  paint.rect(3, hammerY + 2, 3, 2, COLORS.iron[2]);
  paint.rect(18, hammerY + 2, 3, 2, COLORS.iron[2]);
  paint.dot(7, 11 + y, COLORS.brass[2]);
  paint.dot(16, 11 + y, COLORS.brass[2]);
}

function drawFront(paint, phase, rear) {
  const y = phase.bob;
  drawFrontLegs(paint, phase);
  paint.rect(5, 8 + y, 14, 9, COLORS.iron[0]);
  paint.rect(7, 9 + y, 10, 7, COLORS.brass[1]);
  paint.rect(8, 10 + y, 8, 6, COLORS.cavity[0]);
  paint.rect(8, 11 + y, 3, 4, COLORS.furnace[1]);
  paint.rect(13, 11 + y, 3, 4, COLORS.furnace[1]);
  paint.rect(9, 12 + y, 2, 2, COLORS.furnace[2]);
  paint.rect(13, 12 + y, 2, 2, COLORS.furnace[2]);
  if (rear) {
    paint.rect(8, 10 + y, 8, 6, COLORS.iron[1]);
    paint.rect(10, 11 + y, 4, 4, COLORS.brass[1]);
    paint.rect(11, 12 + y, 2, 2, COLORS.furnace[0]);
  }
  drawFrontArms(paint, phase, y);
  paint.rect(8, 3 + y, 8, 6, COLORS.iron[1]);
  paint.rect(7, 5 + y, 10, 4, COLORS.brass[1]);
  paint.rect(9, 2 + y, 2, 3, COLORS.brass[0]);
  paint.rect(12, 1 + y, 2, 4, COLORS.brass[0]);
  paint.rect(15, 2 + y, 2, 3, COLORS.brass[0]);
  paint.rect(10, 3 + y, 5, 2, COLORS.iron[2]);
  if (rear) {
    paint.rect(9, 5 + y, 6, 3, COLORS.iron[0]);
    paint.rect(11, 6 + y, 2, 2, COLORS.furnace[0]);
  } else {
    paint.rect(9, 5 + y, 6, 3, COLORS.cavity[1]);
    paint.rect(10, 6 + y, 4, 1, COLORS.slit);
  }
}

function drawSideLegs(paint, phase) {
  const farX = 7 + Math.min(phase.step, 0);
  const nearX = 14 + Math.max(phase.step, 0);
  paint.rect(7, 15, 11, 4, COLORS.iron[1]);
  paint.rect(9, 16, 7, 2, COLORS.brass[1]);
  paint.rect(farX, 18, 4, 4, COLORS.joint[2]);
  paint.rect(nearX, 18, 4, 4, COLORS.joint[1]);
  paint.rect(farX - 3, 21, 9, 2, COLORS.iron[0]);
  paint.rect(nearX - 1, 21, 9, 2, COLORS.iron[0]);
  paint.rect(farX - 2, 22, 7, 1, COLORS.cavity[1]);
  paint.rect(nearX, 22, 7, 1, COLORS.cavity[1]);
}

function drawSideArms(paint, phase, y) {
  let nearY = 10 + y;
  if (phase.pose === 'raise') nearY = 4 + y;
  else if (phase.pose === 'strike') nearY = 12 + y;
  else if (phase.pose === 'guard') nearY = 8 + y;
  else nearY += Math.max(phase.arm, 0);
  paint.rect(5, 10 + y, 6, 4, COLORS.joint[0]);
  paint.rect(15, 9 + y, 5, 4, COLORS.joint[0]);
  paint.rect(3, 11 + y + Math.max(-phase.arm, 0), 6, 5, COLORS.iron[1]);
  paint.rect(2, 12 + y + Math.max(-phase.arm, 0), 6, 3, COLORS.brass[1]);
  paint.rect(17, nearY, 6, 6, COLORS.iron[0]);
  paint.rect(18, nearY + 1, 5, 4, COLORS.brass[0]);
  paint.rect(19, nearY + 2, 3, 2, COLORS.iron[2]);
}

function drawSide(paint, phase) {
  const y = phase.bob;
  drawSideLegs(paint, phase);
  paint.rect(6, 8 + y, 13, 9, COLORS.iron[0]);
  paint.rect(8, 9 + y, 10, 7, COLORS.brass[1]);
  paint.rect(10, 10 + y, 8, 6, COLORS.cavity[0]);
  paint.rect(12, 11 + y, 4, 4, COLORS.furnace[1]);
  paint.rect(14, 12 + y, 2, 2, COLORS.furnace[2]);
  drawSideArms(paint, phase, y);
  paint.rect(8, 3 + y, 10, 6, COLORS.iron[1]);
  paint.rect(7, 5 + y, 11, 4, COLORS.brass[1]);
  paint.rect(9, 2 + y, 2, 3, COLORS.brass[0]);
  paint.rect(12, 1 + y, 2, 4, COLORS.brass[0]);
  paint.rect(15, 2 + y, 2, 3, COLORS.brass[0]);
  paint.rect(12, 5 + y, 6, 3, COLORS.cavity[1]);
  paint.rect(14, 6 + y, 4, 1, COLORS.slit);
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
    return HURT_PHASES[EN_E09_EPOCHFORGE_COLOSSUS_DEATH_SOURCE_FRAMES[frame]];
  }
  throw new TypeError('Animation ' + animation + ' is not implemented for Epochforge Colossus.');
}

function buildPixels(direction, animation, frame) {
  const phase = phaseFor(animation, frame);
  const canonical = direction === 'left' ? 'right' : direction;
  const pixels = createPixels();
  const paint = painter(pixels);
  if (canonical === 'down') drawFront(paint, phase, false);
  else if (canonical === 'up') drawFront(paint, phase, true);
  else if (canonical === 'right') drawSide(paint, phase);
  else throw new TypeError('Unsupported Epochforge Colossus direction ' + direction + '.');
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

export function renderEnE09EpochforgeColossusFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Epochforge Colossus rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Epochforge Colossus direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'clockwork-automaton',
    variant: 'epochforge-colossus',
    direction,
    animation,
    frame,
    phase: phase.name,
    epochforgeColossusGate: EN_E09_EPOCHFORGE_COLOSSUS_GATE.id,
    approvedPrecedingGate: EN_E09_AETHERDIAL_SURVEYOR_GATE.id,
    actorTopology: EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION.selected,
    childAssetCount: EN_E09_EPOCHFORGE_COLOSSUS_DATA.childAssets.length,
    alphaPolicy: EN_E09_EPOCHFORGE_COLOSSUS_DATA.alphaPolicy,
    effectBoundary: EN_E09_EPOCHFORGE_COLOSSUS_DATA.effectBoundary,
  });
}

export const EN_E09_EPOCHFORGE_COLOSSUS_RENDERER = deepFreeze({
  key: 'en-e09-clockwork-automaton-epochforge-colossus-v1',
  chassis: EN_E09_EPOCHFORGE_COLOSSUS_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'clockwork-automaton', 'The EN-E09 Epochforge Colossus renderer is restricted to Clockwork Automaton.');
    assert(variant.id === 'epochforge-colossus', 'The EN-E09 Epochforge Colossus renderer is restricted to Epochforge Colossus.');
    return renderEnE09EpochforgeColossusFrame(context, direction, animation.id, frame);
  },
});

const EPOCHFORGE_COLOSSUS_VARIANT = deepFreeze({
  id: 'epochforge-colossus',
  name: 'Epochforge Colossus',
  role: EN_E09_EPOCHFORGE_COLOSSUS_CONTRACT.role,
  status: EN_E09_EPOCHFORGE_COLOSSUS_CONTRACT.state,
  brief: 'A private complete elite Clockwork Automaton using one baked 24x24 actor: connected cog crown, low sensor slit, black-iron siege chassis, twin furnace dials, integrated hammer forearms, reinforced hip axle, piston legs, and tread-like feet; child assets, projectiles, detached parts, sparks, handheld weapons, shields, and effects remain external.',
  rendererData: EN_E09_EPOCHFORGE_COLOSSUS_DATA,
});

export const EN_E09_EPOCHFORGE_COLOSSUS_FAMILY = deepFreeze({
  id: 'clockwork-automaton',
  name: 'Clockwork Automaton Epochforge Colossus Review',
  sliceId: 'EN-E09',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E09_EPOCHFORGE_COLOSSUS_CONTRACT.chassis,
  rendererKey: EN_E09_EPOCHFORGE_COLOSSUS_RENDERER.key,
  variants: [EPOCHFORGE_COLOSSUS_VARIANT],
  rendererData: {
    contractCard: EN_E09_EPOCHFORGE_COLOSSUS_CONTRACT_CARD.id,
    architectureDecision: EN_E09_CLOCKWORK_AUTOMATON_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E09_AETHERDIAL_SURVEYOR_GATE.id,
    activeGate: EN_E09_EPOCHFORGE_COLOSSUS_GATE.id,
  },
  review: {
    baselineVariant: 'epochforge-colossus',
    scale: 8,
    notes: 'Awaiting visual review as one connected baked elite Epochforge Colossus against approved Aetherdial Surveyor, Brasscoil Sentry, and Runeforge Custodian. Keep registration, fixtures, child assets, effects, later families, release, accepted drift, and a pull request separate.',
  },
});

export const EN_E09_EPOCHFORGE_COLOSSUS_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E09_EPOCHFORGE_COLOSSUS_RENDERER],
  families: [EN_E09_EPOCHFORGE_COLOSSUS_FAMILY],
});
