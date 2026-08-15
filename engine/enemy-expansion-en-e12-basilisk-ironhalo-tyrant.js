import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E12_BASILISK_CROWNSCALE_CRAWLER_GATE,
  EN_E12_BASILISK_TOPOLOGY_DECISION,
} from './enemy-expansion-en-e12-basilisk-crownscale-crawler.js';
import { EN_E12_BASILISK_MIRRORCREST_MESMER_GATE } from './enemy-expansion-en-e12-basilisk-mirrorcrest-mesmer.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E12_BASILISK_IRONHALO_TYRANT_CONTRACT = deepFreeze({
  family: 'basilisk',
  variant: 'ironhalo-tyrant',
  role: 'elite',
  state: 'implemented-complete-motion-approved',
  chassis: EN_E12_BASILISK_TOPOLOGY_DECISION.selected,
  silhouette: 'One connected broad, high-backed elite Basilisk joins a massive armored wedge head, a connected stepped antique-gold ironhalo crown, a short columnar neck, an articulated fortress-plated obsidian and oxblood body, four separately readable pillar legs with grounded iron claws, and one thick inward-curled serpent tail. It preserves the approved four-clawed crowned-serpent topology while reading taller, wider, more architectural, and more crushing than Crownscale Crawler or Mirrorcrest Mesmer without collapsing into a rigid square.',
  identity: 'Obsidian and blue-black hide, oxblood belly armor, antique-gold fortress plates and connected ironhalo, acid-green eyes, a black-crimson jaw, old-bone fangs, and cold iron claws establish the elite without relying on gaze beams, venom, glow, dust, projectiles, or detached parts.',
  effectBoundary: EN_E12_BASILISK_TOPOLOGY_DECISION.effectBoundary,
});

export const EN_E12_BASILISK_ELITE_CONTRACT_CARD = deepFreeze({
  family: 'basilisk',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingGate: EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.id,
  precedingVariants: [
    { id: 'crownscale-crawler', role: 'common', status: 'implemented-full-approved-published-reconciled' },
    { id: 'mirrorcrest-mesmer', role: 'specialist', status: 'implemented-full-approved-published-reconciled' },
  ],
  activeVariant: {
    id: EN_E12_BASILISK_IRONHALO_TYRANT_CONTRACT.variant,
    role: EN_E12_BASILISK_IRONHALO_TYRANT_CONTRACT.role,
    status: 'implemented-full-approved',
  },
  deferredRoles: [],
});

export const EN_E12_BASILISK_IRONHALO_TYRANT_GATE = deepFreeze({
  id: 'en-e12-basilisk-ironhalo-tyrant-full-v1',
  status: 'approved',
  authorizedOn: '2026-08-15',
  authorizationEvidence: 'The exact Mirrorcrest Mesmer implementation 9c020537525094430307813e77fd23d7e6308fcc, approval record 7ecc9df1f7f05c38af6cd395bfd26811a0d79099, initial published handoff a983959ccf0fb6c965fcb04e534c170f8b1f854b, and final reconciliation 1b1b11ba6464bdf2bb1220b094e6908578f7a7aa are pushed and remote verified. The designer replied approved letsd do next to the exact Mirrorcrest packet. That approval publishes only Mirrorcrest Mesmer; its continuation opens exactly one private elite Basilisk full 80-frame candidate under the selected baked-single-actor-grounded-four-clawed-crowned-serpent topology. Because the role was not pre-named, this lane names only Ironhalo Tyrant. It does not approve candidate pixels or authorize a commit, push, public or outline registration, fixtures, approved-enemy package mutation, effects, child assets, Manticore, Sphinx, boss work, release, accepted drift, or a pull request.',
  baseCheckpoint: '1b1b11ba6464bdf2bb1220b094e6908578f7a7aa',
  architectureDecision: EN_E12_BASILISK_TOPOLOGY_DECISION.id,
  approvedOn: '2026-08-15',
  approvalEvidence: 'The final approval prompt posted the exact revised labeled all-four-direction raw/no-outline, distinct Complete B outlined, Complete B + Form, and Crownscale-Mirrorcrest-Marsh Crocodile comparison PNGs together with both synchronized full-suite GIFs and candidate digest ea00f445e8f807098b6392cd3cf81fedbf0a29d6eb96434495ab5af9b3308a6f. The earlier rigid-square packet was superseded after the designer requested need to fix animation for that square. The revised stepped-halo, independently articulated plate, four-leg bend, torso-lean, and tail-counter-motion packet was regenerated exactly; all four PNGs, all eight raw and Complete B + Form phase sheets, the transparent 20x4 inspection atlas, and both exact GIFs were inspected at original resolution; Aseprite parsed all six principal files; focused, fast, and full validation passed. The designer replied: aproved. Pixel approval applies only to implementation 7a00ef8691da6df2821cf3ad02437198d0d9f2e6, that revised digest, and its six frozen review hashes. The reply contains no continuation request and does not authorize public or outline registration, fixtures, approved-enemy package mutation, effects, child assets, Manticore, Sphinx, boss work, release, accepted drift, a pull request, or another enemy gate.',
  approvedImplementation: '7a00ef8691da6df2821cf3ad02437198d0d9f2e6',
  publicationAuthorizedOn: '2026-08-15',
  publicationAuthorizationEvidence: 'The designer previously said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact frozen artifact or digest. The designer now replied aproved to the exact revised Ironhalo Tyrant packet. This does not authorize public or outline registration, fixtures, approved-enemy package mutation, effects, child assets, Manticore, Sphinx, boss work, release, accepted drift, a pull request, or another enemy gate.',
  publishedImplementation: '7a00ef8691da6df2821cf3ad02437198d0d9f2e6',
  publishedApprovalRecord: '16f797813361c61f0bcda2933ecb86d03b0d66cc',
  initialPublishedHandoff: '',
  publicationState: 'published-awaiting-handoff-reconciliation',
  precedingApproval: {
    gateId: EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.id,
    candidateFrameDigest: EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.initialPublishedHandoff,
    currentReconciliation: '1b1b11ba6464bdf2bb1220b094e6908578f7a7aa',
  },
  artifact: 'enemy-expansion-review/en-e12-basilisk-ironhalo-tyrant/en-e12-basilisk-ironhalo-tyrant-full-suite-raw.png',
  artifactSha256: '5a8bf0fcf580146403ecb13d3659af2573dcb1ebb06f47d9345beda99dd8582b',
  outlinedArtifact: 'enemy-expansion-review/en-e12-basilisk-ironhalo-tyrant/en-e12-basilisk-ironhalo-tyrant-full-suite-outlined-complete-b.png',
  outlinedArtifactSha256: 'ff22f815f3eb21a56f74f3a2b3332ac504e4fe325cb3464ad5e58b5055309661',
  assembledArtifact: 'enemy-expansion-review/en-e12-basilisk-ironhalo-tyrant/en-e12-basilisk-ironhalo-tyrant-full-suite-complete-b-form.png',
  assembledArtifactSha256: 'fd736afe44d060fceb21c8a6daf73b6e5e727199e1dca3cc820f0c9c9ec94499',
  comparisonArtifact: 'enemy-expansion-review/en-e12-basilisk-ironhalo-tyrant/en-e12-basilisk-ironhalo-tyrant-family-comparison.png',
  comparisonArtifactSha256: '9c0f872245b75b04bdcaf44a028060a005b4387e95cabfb5b00a2ed8ae761201',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e12-basilisk-ironhalo-tyrant/en-e12-basilisk-ironhalo-tyrant-full-suite-four-directions-labeled.gif',
      sha256: '6f430faef989711f6e86b903648b40d16b530e9f74217b5b538fb53400220417', width: 640, height: 672, frames: 4, durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e12-basilisk-ironhalo-tyrant/en-e12-basilisk-ironhalo-tyrant-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: 'e69f68e2c5e7abbae6ee611e1b27c9eee49296de2e3f16865c16df91586d26bd', width: 640, height: 672, frames: 4, durationMs: 720,
    },
  },
  candidateFrameDigest: 'ea00f445e8f807098b6392cd3cf81fedbf0a29d6eb96434495ab5af9b3308a6f',
  crownscaleComparisonDigest: '96283b7a295071acaa7541a44ccccbd6c99af0523b4e66d69cb5c9a706cd9872',
  mirrorcrestComparisonDigest: '3ff5c75cd5272e66cfad42b84c5dbb1e86c20b67f506845923734cda24569a80',
  marshCrocodileComparisonDigest: 'aaabe38311ec314f97b902e92ee6f426199f33c2f5051e8a7ffc7a58c737a19a',
  scope: 'One complete private 80-frame Basilisk Ironhalo Tyrant elite enemy across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Every frame preserves one connected grounded four-clawed crowned serpent actor. Idle breathes through a body compression, stepped halo tilt, independent shoulder-plate shift, angled leg bend, and tail counter-coil instead of translating one rigid rectangle. Walk uses four distinct pillar-claw bend phases with torso lean, dorsal plate waves, crown, jaw, and coil counter-motion. Attack braces all four claws, raises the connected arched halo and dorsal gate, compresses the crown architecture into a body-owned crushing press, then recoils without detached gaze, venom, glow, dust, projectile, or impact pixels. Hurt uses a complete-silhouette #f4f4f4 recoil and colored grounded recovery. Cast aliases Attack exactly and Death aliases Hurt H1,H2,H2,H2.',
  anatomyContract: EN_E12_BASILISK_IRONHALO_TYRANT_CONTRACT.silhouette,
  reviewPresentation: 'Show the exact labeled all-four-direction Ironhalo Tyrant raw/no-outline, outlined Complete B, Complete B + Form, Crownscale/Mirrorcrest/Marsh Crocodile comparison board, and both synchronized full-suite GIFs together.',
  exclusions: [
    'approved Crownscale Crawler source module and pixels',
    'approved Mirrorcrest Mesmer source module and pixels',
    'public Marsh Crocodile pixels',
    'approved-enemy copy package contents',
    'additional Basilisk variants',
    'Manticore or Sphinx',
    '48x48 boss work',
    'new Cast pixels',
    'new Death pixels',
    'detached tail, crown, fang, scale, or gaze child assets',
    'baked petrifying-gaze pixels',
    'baked venom pixels',
    'baked glow pixels',
    'baked dust pixels',
    'baked projectile pixels',
    'baked shock-ring or impact pixels',
    'registration',
    'outline registration',
    'consumer exposure',
    'fixtures',
    'effects',
    'release',
    'accepted drift',
    'pull request',
  ],
  nextGate: 'The exact revised Ironhalo Tyrant implementation 7a00ef8691da6df2821cf3ad02437198d0d9f2e6 and approval record 16f797813361c61f0bcda2933ecb86d03b0d66cc are pushed and remote verified. Only the initial published handoff and final reconciliation remain open to complete the bounded Basilisk elite publication tuple. The approval reply contains no continuation request, so the next enemy gate remains closed after publication and requires a fresh explicit continuation. Public or outline registration, fixtures, approved-enemy package mutation, effects, child assets, Manticore, Sphinx, boss work, release, accepted drift, and a pull request remain closed. The distinct outlined PNG remains review evidence only and does not authorize outline registration.',
});

export const EN_E12_BASILISK_IRONHALO_TYRANT_DATA = deepFreeze({
  actor: {
    species: 'basilisk',
    bodyBuild: 'broad-high-backed-four-pillar-clawed-ironhalo-coil-tail-serpent',
    skin: 'scaled',
    hairStyle: 'connected-antique-gold-ironhalo-crown',
    hairColor: 'antique-gold',
    expression: 'crushing-crown-gate',
    faceDetail: 'acid-green-eyes-black-crimson-armored-jaw-and-old-bone-fangs',
    headgear: 'none',
    outfit: 'connected-antique-gold-fortress-plates-and-oxblood-belly-armor',
    outfitColor: 'antique-gold-oxblood', outfitTier: 'tier1',
    weapon: 'none', weaponTier: 'tier1', shield: 'none', shieldTier: 'tier1', offhand: 'none',
    palette: {
      skin: ['#2b252d', '#151923'], hair: ['#b67b2f', '#684424'], outfit: ['#c58a36', '#762f3c', '#7f8790'],
    },
  },
  actorTopology: EN_E12_BASILISK_TOPOLOGY_DECISION.selected,
  childAssets: [],
  basilisk: {
    hide: ['#2b252d', '#151923', '#59404b'],
    plate: ['#c58a36', '#815528', '#efc56b'],
    belly: ['#762f3c', '#451f2b', '#a8494d'],
    crown: ['#b67b2f', '#684424', '#f1cf73'],
    jaw: ['#541d2b', '#24131d', '#913544'],
    claw: ['#7f8790', '#3e4654', '#bcc3c5'],
    fang: ['#e5dfcc', '#8c877d'],
    scale: ['#9a6430', '#5e3d2b', '#d59b4d'],
    eye: '#b7ef4d',
    feature: '#10131a',
  },
  effectBoundary: 'external-petrifying-gaze-venom-glow-dust-projectiles-detached-crown-fangs-or-scales-shock-rings-and-impacts',
  bakedEffects: [],
});

const IRONHALO_TYRANT_VARIANT = deepFreeze({
  id: 'ironhalo-tyrant',
  name: 'Ironhalo Tyrant',
  role: EN_E12_BASILISK_IRONHALO_TYRANT_CONTRACT.role,
  status: EN_E12_BASILISK_IRONHALO_TYRANT_CONTRACT.state,
  brief: 'Elite broad Basilisk with obsidian and oxblood hide, antique-gold fortress plates and connected ironhalo, acid-green eyes, black-crimson armored jaw, old-bone fangs, four pillar legs with grounded iron claws, and one thick inward-curled tail.',
  rendererData: EN_E12_BASILISK_IRONHALO_TYRANT_DATA,
});

export const EN_E12_BASILISK_IRONHALO_TYRANT_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const MOTION_PHASES = deepFreeze({
  idle: [
    { name: 'ironhalo-fortress-vigil', bodyY: 0, headReach: 0, headY: 0, torsoLean: 0, plateWave: 0, crownMode: 'halo', tailMode: 'coil', tailSide: -1, legPhase: 0, flash: false },
    { name: 'oxblood-rampart-breath', bodyY: 1, headReach: 0, headY: 1, torsoLean: -1, plateWave: 1, crownMode: 'tilted', tailMode: 'drag-coil', tailSide: 1, legPhase: 1, flash: false },
  ],
  walk: [
    { name: 'left-pillar-iron-step', bodyY: 0, headReach: 0, headY: 0, torsoLean: -1, plateWave: 1, crownMode: 'halo', tailMode: 'coil', tailSide: -1, legPhase: 0, flash: false },
    { name: 'fortress-plate-compress', bodyY: 1, headReach: 0, headY: 1, torsoLean: 0, plateWave: 2, crownMode: 'tilted', tailMode: 'drag-coil', tailSide: -1, legPhase: 1, flash: false },
    { name: 'right-pillar-iron-step', bodyY: 0, headReach: 0, headY: 0, torsoLean: 1, plateWave: 3, crownMode: 'halo', tailMode: 'coil', tailSide: 1, legPhase: 2, flash: false },
    { name: 'inward-coil-recover', bodyY: 1, headReach: 0, headY: 1, torsoLean: 0, plateWave: 0, crownMode: 'tilted', tailMode: 'drag-coil', tailSide: 1, legPhase: 3, flash: false },
  ],
  attack: [
    { name: 'four-pillar-crown-brace', bodyY: 1, headReach: 0, headY: 1, torsoLean: -1, plateWave: 1, crownMode: 'barred', tailMode: 'brace', tailSide: -1, legPhase: 0, flash: false },
    { name: 'connected-ironhalo-gate-rise', bodyY: 0, headReach: 0, headY: -1, torsoLean: 0, plateWave: 2, crownMode: 'raised', tailMode: 'high-coil', tailSide: -1, legPhase: 1, flash: false },
    { name: 'body-owned-crown-gate-crush', bodyY: 0, headReach: 2, headY: 0, torsoLean: 1, plateWave: 3, crownMode: 'closed', tailMode: 'high-coil', tailSide: 1, legPhase: 2, flash: false },
    { name: 'ironhalo-rampart-recover', bodyY: 1, headReach: 0, headY: 1, torsoLean: 0, plateWave: 0, crownMode: 'halo', tailMode: 'coil', tailSide: 1, legPhase: 3, flash: false },
  ],
  hurt: [
    { name: 'white-crown-gate-recoil', bodyY: 1, headReach: 0, headY: -1, torsoLean: 1, plateWave: 2, crownMode: 'raised', tailMode: 'brace', tailSide: -1, legPhase: 1, flash: true },
    { name: 'four-pillar-coil-recovery', bodyY: 1, headReach: 0, headY: 1, torsoLean: -1, plateWave: 0, crownMode: 'halo', tailMode: 'drag-coil', tailSide: 1, legPhase: 3, flash: false },
  ],
});

const PLATE_WAVE_OFFSETS = deepFreeze([
  [0, 0, 1, 0],
  [1, 0, -1, 1],
  [0, -1, -2, 0],
  [-1, 0, 0, 1],
]);

function createColorContext(context, forcedColor = null) {
  let fillStyle = context.fillStyle;
  return {
    get fillStyle() { return forcedColor || fillStyle; },
    set fillStyle(value) { fillStyle = value; context.fillStyle = forcedColor || value; },
    onOutOfBounds(write) { if (typeof context.onOutOfBounds === 'function') context.onOutOfBounds(write); },
    clearRect(x, y, width, height) { context.clearRect(x, y, width, height); },
    fillRect(x, y, width, height) { context.fillStyle = forcedColor || fillStyle; context.fillRect(x, y, width, height); },
  };
}

function createPainter(context, direction) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const rect = (x, y, width, height, fill) => {
    assert([x, y, width, height].every(Number.isInteger) && width > 0 && height > 0, 'Ironhalo Tyrant rectangles must use positive integer geometry.');
    context.fillStyle = fill;
    context.fillRect(mirrored ? SIZE - x - width : x, y, width, height);
  };
  return { view, rect, dot(x, y, fill) { rect(x, y, 1, 1, fill); } };
}

function drawSideTail(paint, phase) {
  const { hide, plate, scale } = EN_E12_BASILISK_IRONHALO_TYRANT_DATA.basilisk;
  const bob = phase.bodyY;
  if (phase.tailMode === 'brace') {
    paint.rect(5, 11 + bob, 4, 7, hide[0]);
    paint.rect(2, 8 + bob, 5, 3, hide[2]);
    paint.rect(1, 10 + bob, 3, 7, hide[1]);
    paint.rect(2, 15 + bob, 5, 3, hide[0]);
    paint.rect(3, 7 + bob, 4, 2, plate[1]);
    paint.dot(2, 11 + bob, scale[2]);
    return;
  }
  const high = phase.tailMode === 'high-coil';
  const drag = phase.tailMode === 'drag-coil';
  const top = (high ? 4 : 6) + (drag ? 1 : 0) + bob;
  paint.rect(5, 11 + bob, 4, 7, hide[0]);
  paint.rect(2, top + 2, 5, 3, hide[2]);
  paint.rect(1, top + 4, 3, 7, hide[1]);
  paint.rect(2, top + 9, 5, 3, hide[0]);
  paint.rect(5, top + 5, 2, 6, hide[2]);
  paint.rect(3, top, 4, 2, plate[0]);
  paint.dot(2, top + 3, scale[0]);
  paint.dot(5, top + 9, plate[2]);
}

function drawFrontTail(paint, phase) {
  const { hide, plate, scale } = EN_E12_BASILISK_IRONHALO_TYRANT_DATA.basilisk;
  const bob = phase.bodyY;
  const right = phase.tailSide > 0;
  const x = right ? 17 : 1;
  if (phase.tailMode === 'brace') {
    if (right) {
      paint.rect(17, 11 + bob, 4, 7, hide[0]);
      paint.rect(19, 8 + bob, 4, 3, hide[2]);
      paint.rect(21, 10 + bob, 2, 7, hide[1]);
      paint.rect(18, 15 + bob, 5, 3, hide[0]);
      paint.rect(18, 7 + bob, 4, 2, plate[1]);
      paint.dot(22, 11 + bob, scale[2]);
    } else {
      paint.rect(3, 11 + bob, 4, 7, hide[0]);
      paint.rect(1, 8 + bob, 4, 3, hide[2]);
      paint.rect(1, 10 + bob, 2, 7, hide[1]);
      paint.rect(1, 15 + bob, 5, 3, hide[0]);
      paint.rect(2, 7 + bob, 4, 2, plate[1]);
      paint.dot(1, 11 + bob, scale[2]);
    }
    return;
  }
  const high = phase.tailMode === 'high-coil';
  const drag = phase.tailMode === 'drag-coil';
  const top = (high ? 4 : 6) + (drag ? 1 : 0) + bob;
  if (right) {
    paint.rect(17, 11 + bob, 4, 7, hide[0]);
    paint.rect(19, top + 2, 4, 3, hide[2]);
    paint.rect(21, top + 4, 2, 7, hide[1]);
    paint.rect(18, top + 9, 5, 3, hide[0]);
    paint.rect(18, top, 4, 2, plate[0]);
    paint.dot(22, top + 3, scale[0]);
  } else {
    paint.rect(3, 11 + bob, 4, 7, hide[0]);
    paint.rect(1, top + 2, 4, 3, hide[2]);
    paint.rect(1, top + 4, 2, 7, hide[1]);
    paint.rect(1, top + 9, 5, 3, hide[0]);
    paint.rect(2, top, 4, 2, plate[0]);
    paint.dot(1, top + 3, scale[0]);
  }
}

function drawTail(paint, phase) {
  if (paint.view === 'right') drawSideTail(paint, phase);
  else drawFrontTail(paint, phase);
}

const SIDE_LEG_X = Object.freeze([3, 8, 14, 19]);
const FRONT_LEG_X = Object.freeze([3, 8, 14, 19]);

function drawGroundedLeg(paint, x, phase, farLeg, index) {
  const { hide, belly, claw, plate } = EN_E12_BASILISK_IRONHALO_TYRANT_DATA.basilisk;
  const bob = phase.bodyY;
  const cycle = (phase.legPhase + index) % 4;
  const active = cycle < 2;
  const kneeShift = cycle === 0 ? -1 : (cycle === 2 ? 1 : 0);
  const upperX = x + kneeShift;
  const ankleX = x + (kneeShift > 0 ? 1 : 0);
  const upper = farLeg ? hide[1] : (active ? hide[2] : belly[1]);
  paint.rect(upperX, 15 + bob, 3, 4 - bob, upper);
  paint.rect(ankleX, 18 + bob, 2, 4 - bob, upper);
  paint.rect(x, 19, 3, 3, farLeg ? claw[1] : claw[0]);
  paint.rect(x - 1, 22, 4, 1, farLeg ? claw[1] : claw[2]);
  paint.dot(cycle === 0 ? x - 1 : (cycle === 2 ? x + 3 : x + 1), 21, farLeg ? claw[1] : claw[0]);
  if (!farLeg) paint.dot(upperX + 1, 17 + bob, plate[1]);
}

function drawLegs(paint, phase) {
  const positions = paint.view === 'right' ? SIDE_LEG_X : FRONT_LEG_X;
  for (let index = 0; index < positions.length; index++) drawGroundedLeg(paint, positions[index], phase, index === 0 || index === 2, index);
}

function drawSideBody(paint, phase) {
  const { hide, plate, belly, scale } = EN_E12_BASILISK_IRONHALO_TYRANT_DATA.basilisk;
  const bob = phase.bodyY;
  const lean = phase.torsoLean || 0;
  const wave = PLATE_WAVE_OFFSETS[phase.plateWave || 0];
  paint.rect(5, 11 + bob, 14, 6, hide[0]);
  paint.rect(6, 14 + bob, 13, 5, hide[1]);
  paint.rect(7 + lean, 10 + bob, 11, 6, hide[2]);
  paint.rect(9 + Math.max(lean, 0), 15 + bob, 10 - Math.max(lean, 0), 4, belly[0]);
  paint.rect(11 + Math.max(lean, 0), 17 + bob, 8 - Math.max(lean, 0), 2, belly[1]);
  const plateX = [6, 9, 12, 15];
  const plateTop = [8, 6, 7, 8];
  const plateColor = [plate[1], plate[0], plate[2], plate[0]];
  for (let index = 0; index < plateX.length; index++) {
    const top = plateTop[index] + wave[index] + bob;
    const base = 12 + bob;
    paint.rect(plateX[index] + 1, top, 2, 2, plateColor[index]);
    paint.rect(plateX[index], top + 1, 3, base - top, plateColor[index]);
  }
  paint.dot(7 + lean, 13 + bob, scale[2]);
  paint.dot(10 + lean, 12 + bob, scale[0]);
  paint.dot(14 + lean, 12 + bob, scale[1]);
  paint.dot(17, 13 + bob, scale[2]);
}

function drawFrontBody(paint, phase, rearView) {
  const { hide, plate, belly, scale } = EN_E12_BASILISK_IRONHALO_TYRANT_DATA.basilisk;
  const bob = phase.bodyY;
  const lean = phase.torsoLean || 0;
  const wave = PLATE_WAVE_OFFSETS[phase.plateWave || 0];
  paint.rect(5, 11 + bob, 14, 6, hide[0]);
  paint.rect(6, 14 + bob, 12, 5, hide[1]);
  paint.rect(7 + lean, 10 + bob, 10, 6, hide[2]);
  const leftTop = 9 + wave[0] + bob;
  const rightTop = 9 + wave[3] + bob;
  paint.rect(5, leftTop, 3, (14 + bob) - leftTop, plate[0]);
  paint.rect(6, leftTop - 1, 2, 2, plate[2]);
  paint.rect(16, rightTop, 3, (14 + bob) - rightTop, plate[0]);
  paint.rect(16, rightTop - 1, 2, 2, plate[2]);
  paint.rect(4, 12 + bob + (lean > 0 ? 1 : 0), 3, 4 - (lean > 0 ? 1 : 0), plate[1]);
  paint.rect(17, 12 + bob + (lean < 0 ? 1 : 0), 3, 4 - (lean < 0 ? 1 : 0), plate[1]);
  if (rearView) {
    paint.rect(9, 11 + bob, 6, 7, plate[1]);
    paint.rect(10, 8 + bob + wave[1], 4, 5 - wave[1], plate[2]);
    paint.rect(11, 6 + bob + wave[2], 2, 4 - wave[2], plate[0]);
  } else {
    paint.rect(8 + lean, 12 + bob, 8, 7, belly[0]);
    paint.rect(10 + Math.max(lean, 0), 16 + bob, 4, 3, belly[1]);
    paint.rect(6, 15 + bob, 2, 3, belly[0]);
    paint.rect(16, 15 + bob, 2, 3, belly[0]);
  }
  paint.dot(6, 14 + bob, scale[2]);
  paint.dot(9 + lean, 12 + bob, scale[0]);
  paint.dot(14 + lean, 12 + bob, scale[1]);
  paint.dot(17, 14 + bob, scale[2]);
}

function drawBody(paint, phase, rearView) {
  if (paint.view === 'right') drawSideBody(paint, phase);
  else drawFrontBody(paint, phase, rearView);
}

function drawCrownSide(paint, x, y, mode) {
  const { crown } = EN_E12_BASILISK_IRONHALO_TYRANT_DATA.basilisk;
  const raised = mode === 'raised';
  const closed = mode === 'closed';
  const barred = mode === 'barred';
  const tilted = mode === 'tilted';
  const top = Math.max(1, y - (raised ? 1 : 0));
  if (closed) {
    paint.rect(x + 4, top, 3, 2, crown[2]);
    paint.rect(x + 1, top + 4, 8, 3, crown[1]);
    paint.rect(x + 3, top + 2, 5, 3, crown[2]);
    paint.rect(x + 7, top + 5, 2, 5, crown[0]);
    paint.rect(x + 4, top + 7, 5, 2, crown[2]);
    paint.dot(x + 2, top + 3, crown[0]);
    return;
  }
  const baseY = top + (raised ? 7 : (tilted ? 7 : 6));
  paint.rect(x, baseY, 9, 2, crown[1]);
  paint.rect(x + 1, top + (tilted ? 4 : 3), 2, baseY - top - (tilted ? 2 : 1), crown[0]);
  paint.rect(x + 2, top + (tilted ? 2 : 1), 3, 3, crown[0]);
  paint.rect(x + 4, top, 3, 2, crown[2]);
  paint.rect(x + 6, top + 1, 2, 4 + (raised ? 1 : 0), crown[0]);
  paint.rect(x + 7, top + 3, 2, baseY - top - 1, crown[0]);
  if (barred) {
    paint.rect(x + 4, top + 2, 2, 4, crown[1]);
    paint.dot(x + 6, top + 5, crown[2]);
  }
}

function drawCrownFront(paint, x, y, mode) {
  const { crown } = EN_E12_BASILISK_IRONHALO_TYRANT_DATA.basilisk;
  const raised = mode === 'raised';
  const closed = mode === 'closed';
  const barred = mode === 'barred';
  const tilted = mode === 'tilted';
  const top = Math.max(1, y - (raised ? 1 : 0));
  if (closed) {
    paint.rect(x + 5, top, 4, 2, crown[2]);
    paint.rect(x + 2, top + 3, 10, 3, crown[1]);
    paint.rect(x + 4, top + 1, 6, 3, crown[2]);
    paint.rect(x + 5, top + 5, 4, 5, crown[0]);
    paint.rect(x + 3, top + 8, 8, 2, crown[2]);
    paint.rect(x + 1, top + 5, 3, 2, crown[0]);
    paint.rect(x + 10, top + 5, 3, 2, crown[0]);
    return;
  }
  const baseY = top + (raised ? 7 : (tilted ? 7 : 6));
  paint.rect(x + 1, baseY, 12, 2, crown[1]);
  paint.rect(x + 1, top + (tilted ? 4 : 3), 3, baseY - top - (tilted ? 2 : 1), crown[0]);
  paint.rect(x + 3, top + (tilted ? 2 : 1), 4, 3, crown[0]);
  paint.rect(x + 5, top, 4, 2, crown[2]);
  paint.rect(x + 7, top + 1, 4, 3, crown[0]);
  paint.rect(x + 10, top + 3, 3, baseY - top - 1, crown[0]);
  if (barred) {
    paint.rect(x + 4, top + 3, 2, 2, crown[1]);
    paint.rect(x + 5, top + 4, 2, 2, crown[1]);
    paint.rect(x + 8, top + 3, 2, 2, crown[1]);
    paint.rect(x + 7, top + 4, 2, 2, crown[1]);
  }
}

function drawSideHead(paint, phase) {
  const { hide, plate, jaw, fang, scale, eye, feature } = EN_E12_BASILISK_IRONHALO_TYRANT_DATA.basilisk;
  const reach = phase.headReach;
  const y = 4 + phase.headY;
  paint.rect(14, y + 6, 5, 9, hide[0]);
  paint.rect(15, y + 4, 5, 7, hide[2]);
  paint.rect(16, y + 3, 3, 3, plate[0]);
  paint.rect(14, y + 10, 4, 5, plate[1]);
  paint.rect(18 + reach, y + 4, 5 - reach, 5, hide[2]);
  paint.rect(17 + reach, y + 7, 6 - reach, 4, hide[0]);
  paint.rect(17 + reach, y + 9, 6 - reach, 4, jaw[0]);
  paint.rect(18 + reach, y + 11, 5 - reach, 2, jaw[1]);
  drawCrownSide(paint, 13 + Math.min(reach, 1), y - 3, phase.crownMode);
  paint.dot(19 + reach, y + 6, eye);
  paint.dot(20 + reach, y + 6, feature);
  paint.dot(20 + Math.min(reach, 1), y + 11, fang[0]);
  paint.dot(16, y + 9, scale[2]);
  paint.dot(15, y + 11, scale[0]);
  paint.dot(17, y + 13, plate[2]);
}

function drawFrontHead(paint, phase, rearView) {
  const { hide, plate, jaw, fang, scale, eye, feature } = EN_E12_BASILISK_IRONHALO_TYRANT_DATA.basilisk;
  const y = 4 + phase.headY;
  const widen = phase.headReach > 0 ? 1 : 0;
  paint.rect(8, y + 7, 8, 8, hide[0]);
  paint.rect(7 - widen, y + 5, 10 + (widen * 2), 5, hide[0]);
  paint.rect(8 - widen, y + 3, 8 + (widen * 2), 4, hide[2]);
  paint.rect(9 - widen, y + 2, 6 + (widen * 2), 2, plate[0]);
  paint.rect(8, y + 8, 8, 6, rearView ? plate[1] : jaw[0]);
  paint.rect(9, y + 11, 6, 3, rearView ? hide[1] : jaw[1]);
  paint.dot(6 - widen, y + 7, hide[1]);
  paint.dot(17 + widen, y + 7, hide[1]);
  drawCrownFront(paint, 5, y - 3, phase.crownMode);
  if (rearView) {
    paint.rect(9, y + 5, 6, 5, plate[0]);
    paint.rect(10, y + 3, 4, 4, plate[2]);
    paint.rect(11, y + 2, 2, 2, plate[1]);
    paint.dot(9, y + 7, scale[2]);
    paint.dot(14, y + 7, scale[0]);
    return;
  }
  paint.dot(8 - widen, y + 6, eye);
  paint.dot(15 + widen, y + 6, eye);
  paint.dot(9 - widen, y + 7, feature);
  paint.dot(14 + widen, y + 7, feature);
  paint.dot(9, y + 12, fang[0]);
  paint.dot(14, y + 12, fang[0]);
  paint.dot(11, y + 9, scale[2]);
  paint.dot(12, y + 9, scale[0]);
}

function drawHead(paint, phase, rearView) {
  if (paint.view === 'right') drawSideHead(paint, phase);
  else drawFrontHead(paint, phase, rearView);
}

export function drawBasiliskIronhaloTyrantAnatomy(context, direction, phase) {
  const paint = createPainter(context, direction);
  const rearView = paint.view === 'up';
  drawTail(paint, phase);
  drawLegs(paint, phase);
  drawBody(paint, phase, rearView);
  drawHead(paint, phase, rearView);
}

function renderAnatomy(args, phase) {
  args.context.clearRect(0, 0, SIZE, SIZE);
  const colorContext = createColorContext(args.context, phase.flash ? '#f4f4f4' : null);
  drawBasiliskIronhaloTyrantAnatomy(colorContext, args.direction, phase);
}

function resultFor(args, renderedAnimation, renderedFrame, motion) {
  return Object.freeze({
    family: args.family.id, variant: args.variant.id, direction: args.direction,
    animation: args.animation.id, frame: args.frame, renderedAnimation, renderedFrame,
    basiliskIronhaloTyrantGate: EN_E12_BASILISK_IRONHALO_TYRANT_GATE.id,
    architectureDecision: EN_E12_BASILISK_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.id,
    role: EN_E12_BASILISK_IRONHALO_TYRANT_CONTRACT.role,
    anatomy: EN_E12_BASILISK_IRONHALO_TYRANT_CONTRACT.chassis,
    upperBody: 'massive-armored-wedge-head-short-columnar-neck-connected-antique-gold-ironhalo-acid-green-eyes-and-old-bone-fangs',
    lowerBody: 'broad-high-backed-obsidian-oxblood-fortress-body-four-pillar-iron-clawed-legs-and-connected-inward-coil-tail',
    motion,
    childAssetCount: EN_E12_BASILISK_IRONHALO_TYRANT_DATA.childAssets.length,
    effectBoundary: EN_E12_BASILISK_IRONHALO_TYRANT_DATA.effectBoundary,
  });
}

function renderIdle(args) {
  const phase = MOTION_PHASES.idle[args.frame]; renderAnatomy(args, phase); return resultFor(args, 'idle', args.frame, phase.name);
}
function renderWalk(args) {
  const phase = MOTION_PHASES.walk[args.frame]; renderAnatomy(args, phase); return resultFor(args, 'walk', args.frame, phase.name);
}
function renderAttack(args, outputAnimation = 'attack', outputFrame = args.frame) {
  const phase = MOTION_PHASES.attack[args.frame]; renderAnatomy(args, phase);
  return resultFor({ ...args, animation: { ...args.animation, id: outputAnimation }, frame: outputFrame }, 'attack', args.frame, outputAnimation === 'cast' ? 'exact-cast-alias-of-four-pillar-ironhalo-gate-and-body-owned-crushing-press' : phase.name);
}
function renderHurt(args, outputAnimation = 'hurt', outputFrame = args.frame) {
  const phase = MOTION_PHASES.hurt[args.frame]; renderAnatomy(args, phase);
  return resultFor({ ...args, animation: { ...args.animation, id: outputAnimation }, frame: outputFrame }, 'hurt', args.frame, outputAnimation === 'death' ? 'exact-death-alias-of-grounded-ironhalo-hurt' : phase.name);
}

function renderBasiliskIronhaloTyrant(args) {
  assert(args.family.id === 'basilisk', 'The EN-E12 Basilisk renderer is restricted to Basilisk.');
  assert(args.variant.id === 'ironhalo-tyrant', 'The EN-E12 Basilisk renderer is restricted to Ironhalo Tyrant.');
  if (args.animation.id === 'idle') { assert(args.frame >= 0 && args.frame < 2, 'Basilisk Ironhalo Tyrant Idle authorizes only F1-F2.'); return renderIdle(args); }
  if (args.animation.id === 'walk') { assert(args.frame >= 0 && args.frame < 4, 'Basilisk Ironhalo Tyrant Walk authorizes only W1-W4.'); return renderWalk(args); }
  if (args.animation.id === 'attack') { assert(args.frame >= 0 && args.frame < 4, 'Basilisk Ironhalo Tyrant Attack authorizes only A1-A4.'); return renderAttack(args); }
  if (args.animation.id === 'hurt') { assert(args.frame >= 0 && args.frame < 2, 'Basilisk Ironhalo Tyrant Hurt authorizes only H1-H2.'); return renderHurt(args); }
  if (args.animation.id === 'cast') { assert(args.frame >= 0 && args.frame < 4, 'Basilisk Ironhalo Tyrant Cast authorizes only C1-C4.'); return renderAttack({ ...args, animation: { ...args.animation, id: 'attack' } }, 'cast', args.frame); }
  if (args.animation.id === 'death') {
    assert(args.frame >= 0 && args.frame < 4, 'Basilisk Ironhalo Tyrant Death authorizes only D1-D4.');
    const sourceFrame = EN_E12_BASILISK_IRONHALO_TYRANT_DEATH_SOURCE_FRAMES[args.frame];
    return renderHurt({ ...args, animation: { ...args.animation, id: 'hurt' }, frame: sourceFrame }, 'death', args.frame);
  }
  throw new TypeError('The EN-E12 Basilisk Ironhalo Tyrant gate authorizes only Idle, Walk, Attack, Cast, Hurt, and Death.');
}

export const EN_E12_BASILISK_IRONHALO_TYRANT_RENDERER = Object.freeze({
  key: 'en-e12-basilisk-ironhalo-tyrant-full-v1',
  chassis: EN_E12_BASILISK_IRONHALO_TYRANT_CONTRACT.chassis,
  render: renderBasiliskIronhaloTyrant,
});

export const EN_E12_BASILISK_IRONHALO_TYRANT_FAMILY = deepFreeze({
  id: 'basilisk', name: 'Basilisk', sliceId: 'EN-E12',
  rendererKey: EN_E12_BASILISK_IRONHALO_TYRANT_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [IRONHALO_TYRANT_VARIANT],
  rendererData: {
    approvedPrecedingGate: EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.id,
    activeGate: EN_E12_BASILISK_IRONHALO_TYRANT_GATE.id,
    topologyDecision: EN_E12_BASILISK_TOPOLOGY_DECISION.id,
  },
  review: {
    baselineVariant: 'ironhalo-tyrant', scale: 6,
    notes: 'Approved private Ironhalo Tyrant elite Basilisk only, bound to exact revised implementation 7a00ef8691da6df2821cf3ad02437198d0d9f2e6, approval record 16f797813361c61f0bcda2933ecb86d03b0d66cc, candidate digest ea00f445e8f807098b6392cd3cf81fedbf0a29d6eb96434495ab5af9b3308a6f, and its six frozen review hashes. The implementation and approval record are pushed and remote verified; only the initial handoff and final reconciliation remain. The designer replied aproved to the revised packet after the rigid-square animation repair, with no continuation request. Keep public or outline registration, fixtures, approved-enemy package mutation, effects, child assets, Manticore, Sphinx, boss work, release, accepted drift, a pull request, and another enemy gate separate.',
  },
});

export const EN_E12_BASILISK_IRONHALO_TYRANT_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E12_BASILISK_IRONHALO_TYRANT_RENDERER],
  families: [EN_E12_BASILISK_IRONHALO_TYRANT_FAMILY],
});
