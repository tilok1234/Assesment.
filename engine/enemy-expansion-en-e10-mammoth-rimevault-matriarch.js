import { SIZE } from './catalogs.js';
import { createEnemyExpansionRegistry, ENEMY_EXPANSION_STATES } from './enemy-expansion.js';
import { EN_E10_MAMMOTH_TOPOLOGY_DECISION, EN_E10_TUNDRAHIDE_GRAZER_GATE } from './enemy-expansion-en-e10-mammoth-tundrahide-grazer.js';
import { EN_E10_FROSTVEIN_WAYFINDER_GATE } from './enemy-expansion-en-e10-mammoth-frostvein-wayfinder.js';

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
  wool: ['#4c3f62', '#211c2d', '#81728f'],
  face: ['#53606e', '#242b35', '#8b98a0'],
  tusk: ['#d6c69d', '#8f704f', '#f2e1b7'],
  mantle: ['#c2c9c0', '#6e7880', '#e0ded0'],
  mark: ['#8c554f', '#4c303b'],
  ear: ['#793f5d', '#421f38'],
  foot: '#15151d',
  feature: '#0d1118',
  eye: '#efbd55',
  flash: '#f4f4f4',
});

export const EN_E10_MAMMOTH_ELITE_CONTRACT_CARD = deepFreeze({
  id: 'en-e10-mammoth-rimevault-matriarch-v1',
  sliceId: 'EN-E10',
  family: 'mammoth',
  familyName: 'Mammoth',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingVariant: {
    id: 'frostvein-wayfinder',
    name: 'Frostvein Wayfinder',
    role: 'specialist',
    status: 'approved-published-reconciled',
    gateId: EN_E10_FROSTVEIN_WAYFINDER_GATE.id,
  },
  activeVariant: {
    id: 'rimevault-matriarch',
    name: 'Rimevault Matriarch',
    role: 'elite',
    status: 'implemented-full-approved',
  },
  deferredRoles: [],
  actorTopology: EN_E10_MAMMOTH_TOPOLOGY_DECISION.selected,
  styleContract: 'Use chunky one-to-three-pixel hard-alpha forms for one connected elite Mammoth: a broad blue-violet vaulted wool chassis, immense pale royal mantle, low armored head, body-owned ears and trunk, enormous paired crescent tusks with age bands, short connected tail, four pillar legs, and four separated broad feet. It must read more massive and ceremonial than Tundrahide Grazer and Frostvein Wayfinder without becoming a Rhino, boss-scale actor, antlered cervid, ring-horned Ram, detached construction, or effect carrier.',
  effectBoundary: EN_E10_MAMMOTH_TOPOLOGY_DECISION.effectBoundary,
});

export const EN_E10_RIMEVAULT_MATRIARCH_CONTRACT = deepFreeze({
  sliceId: 'EN-E10',
  family: 'mammoth',
  variant: 'rimevault-matriarch',
  role: 'elite',
  state: 'implemented-complete-motion-approved',
  topology: EN_E10_MAMMOTH_TOPOLOGY_DECISION.selected,
  chassis: 'baked-single-actor-broad-vaulted-blue-violet-royal-mantle-crescent-tusk-four-pillar-foot-mammoth-v1',
  silhouette: 'An elite Mammoth with a broad vaulted back, immense layered shoulder mantle, low royal head, large connected ears, heavy connected trunk, enormous paired crescent tusks, compact hindquarters, short tail, four pillar legs, and four separated broad feet. It must be broader and denser than Frostvein Wayfinder and more ceremonial than Tundrahide Grazer while remaining distinct from the Furious Depraved Rhino Boss, Dire Wolf, Stag, and Ram silhouettes.',
  visualIdentity: 'Deep blue-violet wool, near-black plum lower mass, old-ivory royal mantle, dark glacier face and trunk, immense old-ivory tusks with burnished age bands, crimson vault marks, wine ears, gold eyes, and near-black broad feet establish the Rimevault Matriarch. Every visible shape belongs to the actor; snow, breath, debris, shock rings, tusk trails, impacts, particles, projectiles, glow, and illumination remain external.',
  effectBoundary: EN_E10_MAMMOTH_ELITE_CONTRACT_CARD.effectBoundary,
});

export const EN_E10_RIMEVAULT_MATRIARCH_DATA = deepFreeze({
  actor: {
    species: 'authored-mammoth-elite',
    bodyBuild: 'broad-vaulted-royal-mantled-four-pillar-foot-heavy-quadruped',
    skin: 'blue-violet-wool',
    hairStyle: 'connected-vaulted-back-old-ivory-mantle-and-short-tail',
    hairColor: 'old-ivory-and-blue-violet',
    expression: 'planted-gold-matriarch-gaze',
    faceDetail: 'dark-glacier-face-wine-ears-gold-eyes-connected-heavy-trunk-and-enormous-paired-age-banded-crescent-tusks',
    headgear: 'body-owned-enormous-paired-age-banded-crescent-tusks',
    outfit: 'body-owned-old-ivory-royal-mantle-and-crimson-vault-marks',
    outfitColor: 'blue-violet-plum-old-ivory-glacier-copper-crimson-wine-and-gold',
    outfitTier: 'tier3',
    weapon: 'body-owned-trunk-lift-into-planted-double-tusk-press',
    weaponTier: 'none',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: { skin: COLORS.wool, hair: COLORS.face, outfit: COLORS.mantle },
  },
  rimevaultMatriarch: COLORS,
  actorTopology: EN_E10_MAMMOTH_TOPOLOGY_DECISION.selected,
  childAssets: [],
  alphaPolicy: 'binary-single-component-blue-violet-vaulted-wool-old-ivory-mantle-low-head-connected-trunk-enormous-paired-crescent-tusks-short-tail-four-pillar-legs-and-four-grounded-broad-feet',
  effectBoundary: EN_E10_MAMMOTH_ELITE_CONTRACT_CARD.effectBoundary,
  bakedEffects: [],
});

export const EN_E10_RIMEVAULT_MATRIARCH_GATE = deepFreeze({
  id: 'en-e10-mammoth-rimevault-matriarch-full-v1',
  status: 'approved',
  baseCheckpoint: 'd93dc918e379212743433c5a505029c42dfa0182',
  authorizedOn: '2026-08-13',
  authorizationEvidence: 'The exact Frostvein Wayfinder implementation 03618d6ca98ad1a93596bdbe501edcf1cedd466a, approval record 36c43772911aa0ab81d4a417fc1ad2a29531aa30, initial published handoff c03f2fb05746398e530ff80e2ebacbe261cc5422, and final reconciliation d93dc918e379212743433c5a505029c42dfa0182 were pushed and remote verified. The designer reply approved lets do next opens exactly one private elite Mammoth full 80-frame candidate on a new isolated branch from that clean checkpoint under the selected baked-single-actor-tusked-heavy-grounded-quadruped topology. It does not authorize publication, public or outline registration, fixtures, effects, child assets, Rhino, Rhino Boss work, Runic Idol, release, accepted drift, a pull request, or any broader gate.',
  architectureDecision: EN_E10_MAMMOTH_TOPOLOGY_DECISION.id,
  approvedOn: '2026-08-13',
  approvalEvidence: 'The exact labeled all-four-direction raw/no-outline, distinct Complete B outlined, Complete B + Form, and approved Frostvein Wayfinder and Tundrahide Grazer plus public Dire Wolf comparison PNGs were frozen with both synchronized GIF hashes. The Aseprite review session reported those exact four paths open together as raw sprite 222, outlined sprite 226, Complete B + Form sprite 230, and active comparison sprite 234. The final approval prompt posted all four exact PNGs, both synchronized GIFs, and candidate digest db9d43c24dc9c3e958cdba595866333cfee14d67658524a7f02c1f6d912c5763. The designer replied: approved. Approval applies only to that exact Rimevault Matriarch digest and its six frozen review hashes. No continuation clause was supplied, so no next Mammoth role or Rhino gate is open. It does not authorize public Mammoth or outline registration, fixtures, effects, child assets, Rhino, Rhino Boss work, Runic Idol, release, accepted drift, a pull request, or any broader gate.',
  approvedImplementation: '702a93964de696cb246ca144b0d9a946c81875c9',
  publicationAuthorizedOn: '2026-08-13',
  publicationAuthorizationEvidence: 'The designer previously said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact frozen artifact or digest. It does not authorize registration, fixtures, effects, child assets, later roles or families, release, accepted drift, or a pull request.',
  publishedImplementation: '702a93964de696cb246ca144b0d9a946c81875c9',
  publishedApprovalRecord: '91e012e1682db1db0bb4cec0f692d86b19c962d1',
  initialPublishedHandoff: '78c574c1b50e4b17e2a3a551500cbaf6d17c855e',
  publicationState: 'published',
  precedingApproval: {
    gateId: EN_E10_FROSTVEIN_WAYFINDER_GATE.id,
    artifactSha256: EN_E10_FROSTVEIN_WAYFINDER_GATE.artifactSha256,
    outlinedArtifactSha256: EN_E10_FROSTVEIN_WAYFINDER_GATE.outlinedArtifactSha256,
    assembledArtifactSha256: EN_E10_FROSTVEIN_WAYFINDER_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E10_FROSTVEIN_WAYFINDER_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E10_FROSTVEIN_WAYFINDER_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E10_FROSTVEIN_WAYFINDER_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E10_FROSTVEIN_WAYFINDER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E10_FROSTVEIN_WAYFINDER_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E10_FROSTVEIN_WAYFINDER_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E10_FROSTVEIN_WAYFINDER_GATE.initialPublishedHandoff,
    currentReconciliation: 'd93dc918e379212743433c5a505029c42dfa0182',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e10-mammoth-rimevault-matriarch/en-e10-mammoth-rimevault-matriarch-full-suite-raw.png',
  artifactSha256: 'bb758e8902151564d5b37a4af4aa6a0a280fa9497d65e32214bae7338b2b1f23',
  outlinedArtifact: 'enemy-expansion-review/en-e10-mammoth-rimevault-matriarch/en-e10-mammoth-rimevault-matriarch-full-suite-outlined-complete-b.png',
  outlinedArtifactSha256: 'eae4cb406f7ef1bae7c1aa61a7278eb7c65f5de757714a71cfe27e320e7bf49c',
  assembledArtifact: 'enemy-expansion-review/en-e10-mammoth-rimevault-matriarch/en-e10-mammoth-rimevault-matriarch-full-suite-complete-b-form.png',
  assembledArtifactSha256: '8617dda1f9cac9ebb4be33fa2b6c0998525d3170fb8a300f415539485fefe94c',
  comparisonArtifact: 'enemy-expansion-review/en-e10-mammoth-rimevault-matriarch/en-e10-mammoth-rimevault-matriarch-family-comparison.png',
  comparisonArtifactSha256: 'b40401430b2a9600b52dc2b0d4a9a4b5e2be963470f0a5f7210abd829bd931f9',
  reviewAnimations: {
    raw: { artifact: 'enemy-expansion-review/en-e10-mammoth-rimevault-matriarch/en-e10-mammoth-rimevault-matriarch-full-suite-four-directions-labeled.gif', sha256: '5be609a931b39599c223b601b91920455d106ef4e679e592a9a110534dda48e0', width: 640, height: 672, frames: 4, durationMs: 180 },
    completeBForm: { artifact: 'enemy-expansion-review/en-e10-mammoth-rimevault-matriarch/en-e10-mammoth-rimevault-matriarch-full-suite-four-directions-labeled-complete-b-form.gif', sha256: '2bdc517179096917e9bcdac97e4558d34b150f0c75569bbb8e392c49d3603fdd', width: 640, height: 672, frames: 4, durationMs: 180 },
  },
  candidateFrameDigest: 'db9d43c24dc9c3e958cdba595866333cfee14d67658524a7f02c1f6d912c5763',
  frostveinComparisonDigest: EN_E10_FROSTVEIN_WAYFINDER_GATE.candidateFrameDigest,
  tundrahideComparisonDigest: EN_E10_TUNDRAHIDE_GRAZER_GATE.candidateFrameDigest,
  direWolfComparisonDigest: 'a94a66ee380cfcb91db3907a3a049dae4b59357870857c3ed31be259bb1f1579',
  scope: 'One complete 80-frame Rimevault Matriarch elite Mammoth across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle holds an immense vaulted mantle over four planted broad feet while the connected trunk settles. Walk uses four slow pillar-foot weight transfers while the mantle, face, ears, trunk, and crescent tusks stay readable. Attack plants, lifts the connected trunk, drives one body-owned double-tusk press with no trail or impact pixels, and recovers. Hurt uses a complete white recoil and colored four-foot brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline board, distinct Complete B outlined board, Complete B + Form board, synchronized raw and Complete B + Form GIFs, and approved Frostvein Wayfinder and Tundrahide Grazer plus public Dire Wolf comparisons together.',
  exclusions: [
    'changes to approved Frostvein Wayfinder or Tundrahide Grazer rendered pixels',
    'changes to public Dire Wolf pixels',
    'public Mammoth registration or outline registration',
    'public catalog or facade exposure',
    'asset-pack fixture or manifest changes',
    'schema, shared renderer, exporter, validator, or frame-contract changes',
    'detached trunk, tusks, ears, tail, mantle, or child assets',
    'new Cast pixels or new Death pixels',
    'snow, breath, debris, shock rings, tusk trails, impacts, particles, projectiles, glow, illumination, or effects',
    'additional Mammoth variants',
    'Rhino or Furious Depraved Rhino Boss changes',
    'Runic Idol or other EN-E09 work',
    'release, accepted drift, or pull request',
  ],
  nextGate: 'The exact Rimevault Matriarch implementation 702a93964de696cb246ca144b0d9a946c81875c9, approval record 91e012e1682db1db0bb4cec0f692d86b19c962d1, and initial published handoff 78c574c1b50e4b17e2a3a551500cbaf6d17c855e are remote verified; this reconciliation completes the bounded publication tuple. No continuation clause was supplied, so no next Mammoth role or Rhino gate is open. The distinct outlined PNG remains review evidence only and does not authorize outline registration. Public Mammoth registration, fixtures, effects, child assets, Rhino, Rhino Boss work, Runic Idol, release, accepted drift, and a pull request remain closed.',
});

export const EN_E10_RIMEVAULT_MATRIARCH_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'vaulted-mantle-watch', pose: 'idle', bob: 0, head: 0, trunk: 'hang', reach: 0, lateral: 0, stride: [0, 0, 0, 0] },
  { name: 'matriarch-trunk-settle', pose: 'idle', bob: 1, head: -1, trunk: 'curl', reach: 0, lateral: 0, stride: [0, 0, 0, 0] },
]);

const WALK_PHASES = deepFreeze([
  { name: 'near-pillar-plant', pose: 'walk', bob: 0, head: 0, trunk: 'hang', reach: 0, lateral: 0, stride: [-1, 1, 0, -1] },
  { name: 'royal-mantle-rise', pose: 'walk', bob: -1, head: 0, trunk: 'curl', reach: 0, lateral: 1, stride: [0, 1, -1, 0] },
  { name: 'far-pillar-plant', pose: 'walk', bob: 0, head: 1, trunk: 'hang', reach: 0, lateral: 0, stride: [1, -1, 0, 1] },
  { name: 'four-pillar-switch', pose: 'walk', bob: 1, head: 0, trunk: 'curl', reach: 0, lateral: -1, stride: [0, -1, 1, 0] },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'four-pillar-vault-brace', pose: 'brace', bob: 0, head: 0, trunk: 'hang', reach: 0, lateral: 0, stride: [-1, 0, 1, 0] },
  { name: 'connected-royal-trunk-lift', pose: 'lift', bob: -1, head: -1, trunk: 'lift', reach: 0, lateral: 1, stride: [-1, 1, 1, -1] },
  { name: 'planted-double-tusk-press', pose: 'press', bob: 0, head: 1, trunk: 'press', reach: -2, lateral: -1, stride: [-1, 1, 1, -1] },
  { name: 'effect-free-vault-recover', pose: 'recover', bob: 1, head: 0, trunk: 'curl', reach: 0, lateral: 0, stride: [0, -1, -1, 0] },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-rimevault-recoil', pose: 'hurt', bob: -1, head: 0, trunk: 'curl', reach: 0, lateral: -1, stride: [0, 0, 0, 0], flash: true },
  { name: 'colored-matriarch-brace', pose: 'hurt-brace', bob: 1, head: 1, trunk: 'hang', reach: -1, lateral: 1, stride: [-1, 1, 1, -1], flash: false },
]);

function createPixels() { return new Array(SIZE * SIZE).fill(null); }

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert([x, y, width, height].every(Number.isInteger) && width > 0 && height > 0, 'Rimevault Matriarch geometry must use positive integers.');
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Rimevault Matriarch pixels must remain inside 24x24.');
      pixels[(py * SIZE) + px] = fill;
    }
  };
  return { rect, dot(x, y, fill) { rect(x, y, 1, 1, fill); } };
}

function drawSideLegs(paint, bodyY, stride) {
  const positions = [6, 10, 16, 20];
  for (let index = 0; index < positions.length; index++) {
    const footX = positions[index];
    const upperX = Math.max(5, Math.min(20, footX + stride[index]));
    const legY = 14 + bodyY;
    const anchorX = Math.max(7, Math.min(20, upperX));
    const color = index < 2 ? COLORS.face[0] : COLORS.wool[1];
    paint.rect(Math.min(anchorX, upperX), legY, Math.abs(anchorX - upperX) + 2, 2, color);
    paint.rect(upperX, legY, 2, 7 - bodyY, color);
    paint.rect(footX, 20, 2, 2, COLORS.face[1]);
    paint.rect(footX, 22, 2, 1, COLORS.foot);
  }
}

function drawEndLegs(paint, bodyY, stride, lateral) {
  const positions = [2, 7, 15, 20];
  for (let index = 0; index < positions.length; index++) {
    const footX = positions[index];
    const step = stride[index] > 0 ? 1 : stride[index] < 0 ? -1 : 0;
    const upperX = Math.max(2, Math.min(20, footX + lateral + step));
    const legY = 14 + bodyY;
    const anchorX = Math.max(5 + lateral, Math.min(19 + lateral, upperX));
    const color = index === 0 || index === 3 ? COLORS.wool[1] : COLORS.face[0];
    paint.rect(Math.min(anchorX, upperX), legY, Math.abs(anchorX - upperX) + 2, 2, color);
    paint.rect(upperX, legY, 2, 7 - bodyY, color);
    paint.rect(footX, 20, 2, 2, COLORS.face[1]);
    paint.rect(footX, 22, 2, 1, COLORS.foot);
  }
}

function drawSideTrunk(paint, headX, headY, mode) {
  const baseX = headX + 4;
  const baseY = headY + 4;
  if (mode === 'lift') {
    paint.rect(baseX, baseY, 3, 3, COLORS.face[0]);
    paint.rect(baseX - 2, baseY - 1, 3, 2, COLORS.face[2]);
    paint.rect(Math.max(1, baseX - 3), baseY - 2, 2, 2, COLORS.face[0]);
  } else if (mode === 'press') {
    paint.rect(baseX, baseY, 3, 4, COLORS.face[0]);
    paint.rect(Math.max(1, baseX - 3), baseY + 2, 5, 2, COLORS.face[2]);
    paint.rect(Math.max(1, baseX - 4), baseY + 1, 2, 1, COLORS.face[0]);
  } else {
    paint.rect(baseX, baseY, 3, 7, COLORS.face[0]);
    paint.rect(baseX - 1, baseY + 6, 3, 3, COLORS.face[2]);
    if (mode === 'curl') paint.rect(baseX, baseY + 8, 2, 1, COLORS.face[0]);
    else paint.dot(baseX - 1, baseY + 9, COLORS.face[0]);
  }
}

function drawSide(paint, phase) {
  const y = phase.bob;
  const headX = Math.max(2, 4 + phase.reach);
  const headY = 7 + y + phase.head;

  paint.rect(8, 6 + y, 14, 10, COLORS.wool[0]);
  paint.rect(6, 5 + y, 8, 12, COLORS.mantle[0]);
  paint.rect(8, 2 + y, 7, 4, COLORS.mantle[2]);
  paint.rect(10, 4 + y, 8, 3, COLORS.wool[2]);
  paint.rect(18, 9 + y, 4, 7, COLORS.wool[1]);
  paint.rect(11, 14 + y, 8, 2, COLORS.mantle[1]);
  paint.rect(9, 7 + y, 4, 2, COLORS.mark[0]);
  paint.rect(15, 9 + y, 4, 2, COLORS.mark[1]);

  paint.rect(headX + 2, headY, 8, 7, COLORS.face[0]);
  paint.rect(headX + 3, headY + 1, 7, 5, COLORS.face[2]);
  paint.rect(headX + 8, headY - 1, 4, 6, COLORS.ear[0]);
  paint.rect(headX + 9, headY, 2, 4, COLORS.ear[1]);
  drawSideTrunk(paint, headX, headY, phase.trunk);
  paint.rect(headX + 1, headY + 3, 5, 2, COLORS.tusk[2]);
  paint.rect(Math.max(1, headX - 1), headY + 4, 4, 2, COLORS.tusk[0]);
  paint.rect(Math.max(1, headX - 3), headY + 5, 3, 2, COLORS.tusk[0]);
  paint.rect(Math.max(1, headX - 3), headY + 7, 2, 2, COLORS.tusk[1]);
  paint.dot(Math.max(1, headX - 2), headY + 8, COLORS.tusk[2]);
  paint.rect(headX + 2, headY + 4, 2, 1, COLORS.tusk[1]);
  paint.dot(headX + 6, headY + 2, COLORS.eye);
  paint.dot(headX + 2, headY + 3, COLORS.feature);

  paint.rect(21, 10 + y, 2, 4, COLORS.wool[0]);
  paint.rect(22, 13 + y, 1, 3, COLORS.wool[1]);
  paint.rect(8, 11 + y, 4, 2, COLORS.mantle[2]);
  paint.dot(13, 8 + y, COLORS.mark[0]);
  drawSideLegs(paint, y, phase.stride);
}

function drawFrontTrunk(paint, x, headTop, mode) {
  if (mode === 'lift') {
    paint.rect(11 + x, headTop + 4, 3, 3, COLORS.face[0]);
    paint.rect(9 + x, headTop + 3, 3, 2, COLORS.face[2]);
    paint.rect(8 + x, headTop + 2, 2, 2, COLORS.face[0]);
  } else if (mode === 'press') {
    paint.rect(11 + x, headTop + 4, 3, 4, COLORS.face[0]);
    paint.rect(8 + x, headTop + 7, 5, 2, COLORS.face[2]);
    paint.rect(7 + x, headTop + 6, 2, 1, COLORS.face[0]);
  } else {
    paint.rect(11 + x, headTop + 4, 3, 8, COLORS.face[0]);
    paint.rect(12 + x, headTop + 11, 2, 3, COLORS.face[2]);
    if (mode === 'curl') paint.rect(11 + x, headTop + 13, 2, 1, COLORS.face[0]);
  }
}

function drawDown(paint, phase) {
  const y = phase.bob;
  const x = phase.lateral;
  const headTop = 6 + y + phase.head;

  paint.rect(9 + x, 2, 7, 2, COLORS.mantle[2]);
  paint.rect(5 + x, 6 + y, 16, 11, COLORS.wool[0]);
  paint.rect(7 + x, 3 + y, 12, 5, COLORS.mantle[0]);
  paint.rect(4 + x, 8 + y, 18, 8, COLORS.wool[0]);
  paint.rect(7 + x, 13 + y, 12, 4, COLORS.mantle[1]);
  paint.rect(5 + x, 7 + y, 5, 2, COLORS.mark[0]);
  paint.rect(15 + x, 9 + y, 5, 2, COLORS.mark[1]);
  paint.rect(6 + x, headTop, 13, 7, COLORS.face[0]);
  paint.rect(7 + x, headTop + 1, 11, 5, COLORS.face[2]);
  paint.rect(3 + x, headTop, 4, 6, COLORS.ear[0]);
  paint.rect(18 + x, headTop, 4, 6, COLORS.ear[0]);
  paint.rect(4 + x, headTop + 1, 2, 4, COLORS.ear[1]);
  paint.rect(19 + x, headTop + 1, 2, 4, COLORS.ear[1]);
  drawFrontTrunk(paint, x, headTop, phase.trunk);

  paint.rect(7 + x, headTop + 3, 4, 2, COLORS.tusk[2]);
  paint.rect(5 + x, headTop + 4, 4, 2, COLORS.tusk[0]);
  paint.rect(3 + x, headTop + 5, 3, 2, COLORS.tusk[0]);
  paint.rect(3 + x, headTop + 7, 2, 2, COLORS.tusk[1]);
  paint.dot(4 + x, headTop + 9, COLORS.tusk[2]);
  paint.rect(14 + x, headTop + 3, 4, 2, COLORS.tusk[2]);
  paint.rect(17 + x, headTop + 4, 4, 2, COLORS.tusk[0]);
  paint.rect(19 + x, headTop + 5, 3, 2, COLORS.tusk[0]);
  paint.rect(20 + x, headTop + 7, 2, 2, COLORS.tusk[1]);
  paint.dot(20 + x, headTop + 9, COLORS.tusk[2]);
  paint.dot(9 + x, headTop + 2, COLORS.eye);
  paint.dot(15 + x, headTop + 2, COLORS.eye);
  paint.dot(11 + x, headTop + 4, COLORS.feature);
  paint.dot(13 + x, headTop + 4, COLORS.feature);
  paint.rect(4 + x, 11 + y, 3, 2, COLORS.mark[0]);
  paint.rect(19 + x, 10 + y, 3, 4, COLORS.wool[1]);
  drawEndLegs(paint, y, phase.stride, x);
}

function drawUp(paint, phase) {
  const y = phase.bob;
  const x = phase.lateral;
  const headTop = 6 + y + phase.head;

  paint.rect(9 + x, 2, 7, 2, COLORS.mantle[2]);
  paint.rect(5 + x, 6 + y, 16, 11, COLORS.wool[0]);
  paint.rect(7 + x, 3 + y, 12, 5, COLORS.mantle[0]);
  paint.rect(4 + x, 8 + y, 18, 8, COLORS.wool[0]);
  paint.rect(7 + x, 13 + y, 12, 4, COLORS.wool[1]);
  paint.rect(6 + x, headTop, 13, 7, COLORS.face[0]);
  paint.rect(7 + x, headTop + 2, 11, 5, COLORS.mantle[0]);
  paint.rect(3 + x, headTop, 4, 6, COLORS.ear[1]);
  paint.rect(18 + x, headTop, 4, 6, COLORS.ear[1]);
  paint.rect(5 + x, 7 + y, 6, 2, COLORS.mark[0]);
  paint.rect(14 + x, 9 + y, 6, 2, COLORS.mark[1]);
  paint.rect(9 + x, 12 + y, 7, 3, COLORS.mantle[1]);
  paint.rect(19 + x, 10 + y, 3, 4, COLORS.wool[1]);
  drawEndLegs(paint, y, phase.stride, x);
}

function mirrorPixels(pixels) {
  const mirrored = createPixels();
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) mirrored[(y * SIZE) + (SIZE - 1 - x)] = pixels[(y * SIZE) + x];
  return mirrored;
}

function buildPixels(direction, animation, frame) {
  const sourceAnimation = animation === 'cast' ? 'attack' : animation;
  const sourceFrame = animation === 'death' ? EN_E10_RIMEVAULT_MATRIARCH_DEATH_SOURCE_FRAMES[frame] : frame;
  const phases = sourceAnimation === 'idle' ? IDLE_PHASES : sourceAnimation === 'walk' ? WALK_PHASES : sourceAnimation === 'attack' ? ATTACK_PHASES : HURT_PHASES;
  assert(phases && Number.isInteger(sourceFrame) && sourceFrame >= 0 && sourceFrame < phases.length, `Frame ${frame} is invalid for ${animation}.`);
  const phase = phases[sourceFrame];
  let pixels = createPixels();
  const paint = painter(pixels);
  if (direction === 'left') drawSide(paint, phase);
  else if (direction === 'right') { drawSide(paint, phase); pixels = mirrorPixels(pixels); }
  else if (direction === 'down') drawDown(paint, phase);
  else drawUp(paint, phase);
  if (phase.flash) pixels = pixels.map((color) => color ? COLORS.flash : null);
  return { phase, pixels };
}

function paintPixels(context, pixels) {
  for (let index = 0; index < pixels.length; index++) {
    const color = pixels[index];
    if (!color) continue;
    context.fillStyle = color;
    context.fillRect(index % SIZE, Math.floor(index / SIZE), 1, 1);
  }
}

export function renderEnE10RimevaultMatriarchFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Rimevault Matriarch rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), `Unsupported Rimevault Matriarch direction ${direction}.`);
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return deepFreeze({
    rimevaultMatriarchGate: EN_E10_RIMEVAULT_MATRIARCH_GATE.id,
    architectureDecision: EN_E10_MAMMOTH_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E10_FROSTVEIN_WAYFINDER_GATE.id,
    phase: phase.name,
    pose: phase.pose,
    childAssetCount: 0,
    effects: 'off',
  });
}

export const EN_E10_RIMEVAULT_MATRIARCH_RENDERER = deepFreeze({
  key: 'en-e10-mammoth-rimevault-matriarch-v1',
  chassis: EN_E10_RIMEVAULT_MATRIARCH_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'mammoth', 'The EN-E10 Rimevault Matriarch renderer is restricted to Mammoth.');
    assert(variant.id === 'rimevault-matriarch', 'The EN-E10 Rimevault Matriarch renderer is restricted to Rimevault Matriarch.');
    return renderEnE10RimevaultMatriarchFrame(context, direction, animation.id, frame);
  },
});

const RIMEVAULT_MATRIARCH_VARIANT = deepFreeze({
  id: 'rimevault-matriarch',
  name: 'Rimevault Matriarch',
  role: EN_E10_RIMEVAULT_MATRIARCH_CONTRACT.role,
  status: EN_E10_RIMEVAULT_MATRIARCH_CONTRACT.state,
  brief: 'A private complete elite Mammoth with broad blue-violet vaulted wool, an old-ivory royal mantle, dark glacier face and connected trunk, wine ears, enormous age-banded crescent tusks, crimson vault marks, gold eyes, short tail, four pillar legs, four broad feet, and a body-owned trunk lift into a planted double-tusk press; all effects remain external.',
  rendererData: EN_E10_RIMEVAULT_MATRIARCH_DATA,
});

export const EN_E10_RIMEVAULT_MATRIARCH_FAMILY = deepFreeze({
  id: 'mammoth',
  name: 'Mammoth Rimevault Matriarch Review',
  sliceId: 'EN-E10',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E10_RIMEVAULT_MATRIARCH_CONTRACT.chassis,
  rendererKey: EN_E10_RIMEVAULT_MATRIARCH_RENDERER.key,
  variants: [RIMEVAULT_MATRIARCH_VARIANT],
  rendererData: {
    contractCard: EN_E10_MAMMOTH_ELITE_CONTRACT_CARD.id,
    architectureDecision: EN_E10_MAMMOTH_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E10_FROSTVEIN_WAYFINDER_GATE.id,
    activeGate: EN_E10_RIMEVAULT_MATRIARCH_GATE.id,
  },
  review: {
    baselineVariant: 'rimevault-matriarch',
    scale: 8,
    notes: 'Visually approved as one exact private elite Mammoth against approved Frostvein Wayfinder and Tundrahide Grazer plus public Dire Wolf. Accepted implementation 702a93964de696cb246ca144b0d9a946c81875c9, approval record 91e012e1682db1db0bb4cec0f692d86b19c962d1, and initial published handoff 78c574c1b50e4b17e2a3a551500cbaf6d17c855e are remote verified; this reconciliation completes the bounded publication tuple. The distinct Complete B outlined PNG remains review evidence only. No continuation clause was supplied, so no next Mammoth role or Rhino gate is open; keep public or outline registration, fixtures, effects, child assets, Rhino, Rhino Boss work, deferred Runic Idol, release, accepted drift, and a pull request separate.',
  },
});

export const EN_E10_RIMEVAULT_MATRIARCH_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E10_RIMEVAULT_MATRIARCH_RENDERER],
  families: [EN_E10_RIMEVAULT_MATRIARCH_FAMILY],
});
