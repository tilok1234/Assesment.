import { SIZE } from './catalogs.js';
import { createEnemyExpansionRegistry, ENEMY_EXPANSION_STATES } from './enemy-expansion.js';
import {
  EN_E10_STAG_CONTRACT_CARD,
  EN_E10_STAG_TOPOLOGY_DECISION,
  EN_E10_MOSSRACK_FORAGER_GATE,
} from './enemy-expansion-en-e10-stag-mossrack-forager.js';
import { EN_E10_BRIARSTEP_HARRIER_GATE } from './enemy-expansion-en-e10-stag-briarstep-harrier.js';

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
  fur: ['#43364f', '#211d2a', '#6c5578'],
  face: ['#2b2734', '#121219', '#52445f'],
  antler: ['#b89d62', '#66523b', '#e7cf88'],
  crownBand: ['#4f8d78', '#285047'],
  mantle: ['#c1b69e', '#736d66', '#e7d8b9'],
  mark: ['#7d405f', '#47253f'],
  ear: ['#824b66', '#48283e'],
  blaze: ['#e2d1ad', '#aa8f68'],
  hoof: '#11131a',
  feature: '#0b0c11',
  eye: '#f5ca67',
  flash: '#f4f4f4',
});

export const EN_E10_STAG_ELITE_CONTRACT_CARD = deepFreeze({
  id: 'en-e10-stag-gloamcrown-sovereign-v1',
  sliceId: 'EN-E10',
  family: 'stag',
  familyName: 'Stag',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingVariant: {
    id: 'briarstep-harrier',
    role: 'specialist',
    status: 'approved-published-reconciled',
    gateId: EN_E10_BRIARSTEP_HARRIER_GATE.id,
  },
  activeVariant: {
    id: 'gloamcrown-sovereign',
    name: 'Gloamcrown Sovereign',
    role: 'elite',
    status: 'implemented-full-awaiting-visual-approval',
  },
  deferredRoles: [],
  actorTopology: EN_E10_STAG_TOPOLOGY_DECISION.selected,
  styleContract: EN_E10_STAG_CONTRACT_CARD.styleContract,
  effectBoundary: EN_E10_STAG_CONTRACT_CARD.effectBoundary,
});

export const EN_E10_GLOAMCROWN_SOVEREIGN_CONTRACT = deepFreeze({
  sliceId: 'EN-E10',
  family: 'stag',
  variant: 'gloamcrown-sovereign',
  role: 'elite',
  state: 'implemented-complete-motion-awaiting-visual-approval',
  topology: EN_E10_STAG_TOPOLOGY_DECISION.selected,
  chassis: 'baked-single-actor-broad-midnight-plum-royal-mantle-vast-crown-antler-four-split-hoof-stag-v1',
  silhouette: 'A broad elite Stag with a deep but lifted barrel, high royal shoulder mantle, long powerful neck, tapered dark muzzle, paired ears, two vast connected outward-branching crown antlers, a short pale flag tail, four weight-bearing legs, and four visibly split hooves. It must read heavier and more sovereign than Briarstep Harrier and Mossrack Forager while remaining unlike a bowed Miremane Courser, long-backed Dire Wolf, ring-horned Ram, Mammoth, or reduced Rhino Boss.',
  visualIdentity: 'Midnight-plum hide, a near-black violet face and lower legs, weathered-gold crown antlers with verdigris growth bands, an old-ivory throat and royal mantle, wine crown markings, mulberry ears, a pale facial blaze, amber-gold eyes, and near-black split hooves establish the Gloamcrown Sovereign. Every mark belongs to the actor; leaves, roots, dust, pollen, antler trails, impacts, particles, projectiles, glow, and illumination remain external.',
  effectBoundary: EN_E10_STAG_CONTRACT_CARD.effectBoundary,
});

export const EN_E10_GLOAMCROWN_SOVEREIGN_DATA = deepFreeze({
  actor: {
    species: 'authored-stag-elite',
    bodyBuild: 'broad-deep-barrel-high-mantle-long-neck-four-split-hoof-elite-cervid',
    skin: 'midnight-plum-hide',
    hairStyle: 'connected-old-ivory-royal-mantle-throat-and-short-flag-tail',
    hairColor: 'old-ivory',
    expression: 'amber-gold-sovereign-gaze',
    faceDetail: 'tapered-near-black-muzzle-mulberry-ears-pale-blaze-gold-eyes-and-vast-connected-crown-antlers',
    headgear: 'body-owned-weathered-gold-outward-branching-crown-antlers-with-verdigris-growth-bands',
    outfit: 'body-owned-old-ivory-royal-mantle-and-wine-crown-markings',
    outfitColor: 'midnight-plum-black-violet-weathered-gold-verdigris-old-ivory-wine-mulberry-and-amber',
    outfitTier: 'tier3',
    weapon: 'body-owned-antler-lift-into-planted-crown-press',
    weaponTier: 'none',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.fur,
      hair: COLORS.face,
      outfit: COLORS.mantle,
    },
  },
  gloamcrownSovereign: COLORS,
  actorTopology: EN_E10_STAG_TOPOLOGY_DECISION.selected,
  childAssets: [],
  alphaPolicy: 'binary-single-component-broad-midnight-plum-deep-barrel-high-royal-mantle-long-neck-tapered-muzzle-connected-outward-branching-crown-antlers-short-flag-tail-four-legs-and-four-grounded-split-hooves',
  effectBoundary: EN_E10_STAG_CONTRACT_CARD.effectBoundary,
  bakedEffects: [],
});

export const EN_E10_GLOAMCROWN_SOVEREIGN_GATE = deepFreeze({
  id: 'en-e10-stag-gloamcrown-sovereign-full-v1',
  status: 'awaiting-visual-approval',
  baseCheckpoint: '595b2b2b18ebe7e111486df96624b4e1f057647b',
  authorizedOn: '2026-08-13',
  authorizationEvidence: 'The exact Briarstep Harrier implementation 8d52dc26d9d361c5d95603276a4a88b3978a585e, approval record 895456020801fa40a31d7e83413895e0440c505e, initial published handoff 40fd66c20f3b01ddd927ecb83c807c96c5feec7b, final reconciliation f25ebea08723db889298ebce2db606421ed03282, and next-chat handoff 595b2b2b18ebe7e111486df96624b4e1f057647b were pushed and remote verified. The handoff recorded that no next Stag art gate was open. The designer then separately said: awesine lets keep going. In the established common-specialist-elite cadence this authorizes exactly one private elite Stag full 80-frame candidate under the already approved baked-single-actor-antlered-grounded-quadruped topology. Continue the distinct Complete B outlined PNG as review evidence only; it does not authorize outline registration. Public Stag registration, fixtures, effects, child assets, additional Stag variants, Mammoth, Rhino, Rhino Boss work, Runic Idol, release, accepted drift, a pull request, and every broader art gate remain closed.',
  architectureDecision: EN_E10_STAG_TOPOLOGY_DECISION.id,
  precedingApproval: {
    gateId: EN_E10_BRIARSTEP_HARRIER_GATE.id,
    artifactSha256: EN_E10_BRIARSTEP_HARRIER_GATE.artifactSha256,
    outlinedArtifactSha256: EN_E10_BRIARSTEP_HARRIER_GATE.outlinedArtifactSha256,
    assembledArtifactSha256: EN_E10_BRIARSTEP_HARRIER_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E10_BRIARSTEP_HARRIER_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E10_BRIARSTEP_HARRIER_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E10_BRIARSTEP_HARRIER_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E10_BRIARSTEP_HARRIER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E10_BRIARSTEP_HARRIER_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E10_BRIARSTEP_HARRIER_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E10_BRIARSTEP_HARRIER_GATE.initialPublishedHandoff,
    currentReconciliation: '595b2b2b18ebe7e111486df96624b4e1f057647b',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e10-stag-gloamcrown-sovereign/en-e10-stag-gloamcrown-sovereign-full-suite-raw.png',
  artifactSha256: '74245504722d36cfe54d79334230b07464833e1ce15b9175554142b5f232f7f9',
  outlinedArtifact: 'enemy-expansion-review/en-e10-stag-gloamcrown-sovereign/en-e10-stag-gloamcrown-sovereign-full-suite-outlined-complete-b.png',
  outlinedArtifactSha256: '7c4a63f53987e19e87fb5befa9bc9e4561c5cd597b1bdc6de30f50192faa9337',
  assembledArtifact: 'enemy-expansion-review/en-e10-stag-gloamcrown-sovereign/en-e10-stag-gloamcrown-sovereign-full-suite-complete-b-form.png',
  assembledArtifactSha256: 'f489bad325cfa905036f8c6a7f8dc8ba8a71ee273aa5932fcc31c2f0d9e88ed8',
  comparisonArtifact: 'enemy-expansion-review/en-e10-stag-gloamcrown-sovereign/en-e10-stag-gloamcrown-sovereign-family-comparison.png',
  comparisonArtifactSha256: '1bd4fbdda04870c55b13891adead703decf7508a9509fb54a188f7b50c49697e',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e10-stag-gloamcrown-sovereign/en-e10-stag-gloamcrown-sovereign-full-suite-four-directions-labeled.gif',
      sha256: '8403dbb9d1443590ccb34e72a12b73b5a6141e98011159cfa3ae9ee40e8b1795', width: 640, height: 672, frames: 4, durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e10-stag-gloamcrown-sovereign/en-e10-stag-gloamcrown-sovereign-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '33dab8a93c5156b07e97733c44c928436d1cc747241a887b897552471ef859f5', width: 640, height: 672, frames: 4, durationMs: 180,
    },
  },
  candidateFrameDigest: '5a80240ca6bfb16eb6a53b0b95b5214323a9dde25814b48fb39e9caaf11e4855',
  briarstepComparisonDigest: EN_E10_BRIARSTEP_HARRIER_GATE.candidateFrameDigest,
  mossrackComparisonDigest: EN_E10_MOSSRACK_FORAGER_GATE.candidateFrameDigest,
  direWolfComparisonDigest: 'a94a66ee380cfcb91db3907a3a049dae4b59357870857c3ed31be259bb1f1579',
  scope: 'One complete 80-frame Gloamcrown Sovereign elite Stag across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle lifts and settles the vast connected crown antlers over a broad four-split-hoof sovereign stance. Walk uses four deliberate alternating weight-transfer phases while the pale royal mantle, long neck, and verdigris-banded rack stay readable. Attack plants all four hooves, raises the connected head and rack in one body-owned antler lift, lowers into a planted crown press without detached antlers or effect pixels, and recovers. Hurt uses a complete white recoil and colored wide four-hoof brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline board, distinct Complete B outlined board, Complete B + Form board, synchronized raw and Complete B + Form GIFs, and approved Briarstep Harrier and Mossrack Forager plus public Dire Wolf comparisons together.',
  exclusions: [
    'changes to approved Briarstep Harrier or Mossrack Forager rendered pixels',
    'changes to public Dire Wolf pixels',
    'public Stag registration or outline registration',
    'public catalog or facade exposure',
    'asset-pack fixture or manifest changes',
    'schema, shared renderer, exporter, validator, or frame-contract changes',
    'detached antlers, ears, mantle, tail, or child assets',
    'new Cast pixels or new Death pixels',
    'leaves, roots, dust, pollen, antler trails, impacts, debris, particles, projectiles, glow, illumination, or effects',
    'additional Stag variants',
    'Mammoth or Rhino',
    'Furious Depraved Rhino Boss changes',
    'Runic Idol or other EN-E09 work',
    'release, accepted drift, or pull request',
  ],
  nextGate: 'Stop for explicit designer visual approval of this exact frozen Gloamcrown Sovereign digest and its four PNG plus two GIF review hashes. Do not commit, push, register, or publish the candidate before approval. The distinct outlined PNG is review evidence only and does not authorize outline registration. Additional Stag variants plus Mammoth, Rhino, and all broader gates remain closed.',
});

export const EN_E10_GLOAMCROWN_SOVEREIGN_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'vast-crown-rack-watch', pose: 'idle', bob: 0, head: 0, antler: -1, reach: 0, lateral: 0, stride: [0, 0, 0, 0] },
  { name: 'gloamcrown-royal-mantle-settle', pose: 'idle', bob: 1, head: 1, antler: 0, reach: 0, lateral: 0, stride: [0, 0, 0, 0] },
]);

const WALK_PHASES = deepFreeze([
  { name: 'near-fore-far-hind-sovereign-plant', pose: 'walk', bob: 0, head: 0, antler: -1, reach: 0, lateral: 0, stride: [-1, 1, 0, -1] },
  { name: 'royal-mantle-forward-rise', pose: 'walk', bob: -1, head: 0, antler: 0, reach: 0, lateral: 1, stride: [0, 1, -1, 0] },
  { name: 'far-fore-near-hind-sovereign-plant', pose: 'walk', bob: 0, head: 1, antler: 0, reach: 0, lateral: 0, stride: [1, -1, 0, 1] },
  { name: 'split-hoof-crown-switch', pose: 'walk', bob: 1, head: 1, antler: -1, reach: 0, lateral: -1, stride: [0, -1, 1, 0] },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'four-split-hoof-crown-plant', pose: 'brace', bob: 0, head: 0, antler: -1, reach: 0, lateral: -1, stride: [-1, 0, 1, 0] },
  { name: 'body-owned-antler-lift', pose: 'lift', bob: -1, head: -1, antler: -1, reach: -1, lateral: 1, stride: [-1, 1, 1, -1] },
  { name: 'connected-planted-crown-press', pose: 'press', bob: 1, head: 3, antler: 0, reach: -2, lateral: 0, stride: [-1, 1, 1, -1] },
  { name: 'effect-free-sovereign-recover', pose: 'recover', bob: 0, head: 1, antler: -1, reach: 0, lateral: 0, stride: [0, -1, -1, 0] },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-gloamcrown-recoil', pose: 'hurt', bob: -1, head: 0, antler: 0, reach: 0, lateral: -1, stride: [0, 0, 0, 0], flash: true },
  { name: 'colored-wide-split-hoof-brace', pose: 'hurt-brace', bob: 1, head: 2, antler: -1, reach: -1, lateral: 1, stride: [-1, 1, 1, -1], flash: false },
]);

function createPixels() {
  return new Array(SIZE * SIZE).fill(null);
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert([x, y, width, height].every(Number.isInteger) && width > 0 && height > 0, 'Gloamcrown Sovereign geometry must use positive integers.');
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Gloamcrown Sovereign pixels must remain inside 24x24.');
      pixels[(py * SIZE) + px] = fill;
    }
  };
  return { rect, dot(x, y, fill) { rect(x, y, 1, 1, fill); } };
}

function drawSideLegs(paint, bodyY, stride) {
  const positions = [6, 10, 16, 20];
  for (let index = 0; index < positions.length; index++) {
    const footX = positions[index];
    const upperX = footX + stride[index];
    const legY = 14 + bodyY + (index === 0 || index === 3 ? 1 : 0);
    const anchorX = Math.max(8, Math.min(20, upperX));
    const upperColor = index < 2 ? COLORS.face[0] : COLORS.fur[1];
    paint.rect(Math.min(anchorX, upperX), legY, Math.abs(anchorX - upperX) + 1, 1, upperColor);
    paint.rect(upperX, legY, 1, 20 - legY, upperColor);
    paint.rect(Math.min(footX, upperX), 19, Math.abs(footX - upperX) + 1, 1, COLORS.face[1]);
    paint.rect(footX, 19, 1, 2, COLORS.face[1]);
    paint.rect(footX, 21, 3, 1, COLORS.hoof);
    paint.dot(footX, 22, COLORS.hoof);
    paint.dot(footX + 2, 22, COLORS.hoof);
  }
}

function drawEndLegs(paint, bodyY, stride, lateral) {
  const positions = [3, 8, 14, 19];
  for (let index = 0; index < positions.length; index++) {
    const footX = positions[index];
    const step = stride[index] > 0 ? 1 : stride[index] < 0 ? -1 : 0;
    const upperX = footX + lateral + step;
    const rear = index === 0 || index === 3;
    const legY = 15 + bodyY + (rear ? 1 : 0);
    const anchorX = Math.max(7 + lateral, Math.min(18 + lateral, upperX));
    const upperColor = rear ? COLORS.fur[1] : COLORS.face[0];
    paint.rect(Math.min(anchorX, upperX), legY, Math.abs(anchorX - upperX) + 1, 1, upperColor);
    paint.rect(upperX, legY, 1, 20 - legY, upperColor);
    paint.rect(Math.min(footX, upperX), 19, Math.abs(footX - upperX) + 1, 1, COLORS.face[1]);
    paint.rect(footX, 19, 1, 2, COLORS.face[1]);
    paint.rect(footX, 21, 3, 1, COLORS.hoof);
    paint.dot(footX, 22, COLORS.hoof);
    paint.dot(footX + 2, 22, COLORS.hoof);
  }
}

function drawSideRack(paint, headX, headY, rackShift) {
  const top = Math.max(1, headY - 5 + rackShift);
  const baseX = headX + 7;
  paint.rect(baseX, top + 4, 1, Math.max(4, headY - top + 2), COLORS.antler[0]);
  paint.rect(baseX, top + 4, 4, 1, COLORS.antler[2]);
  paint.rect(baseX + 3, top + 3, 4, 1, COLORS.antler[0]);
  paint.rect(baseX + 6, top + 2, 4, 1, COLORS.antler[1]);
  paint.rect(baseX + 9, top + 1, 3, 1, COLORS.antler[2]);
  paint.rect(baseX + 2, top + 1, 1, 4, COLORS.antler[1]);
  paint.rect(baseX + 5, top, 1, 4, COLORS.antler[2]);
  paint.rect(baseX + 8, top, 1, 3, COLORS.antler[0]);
  paint.rect(baseX + 11, top, 1, 2, COLORS.antler[2]);
  paint.dot(baseX, top + 5, COLORS.crownBand[0]);
  paint.dot(baseX + 3, top + 3, COLORS.crownBand[1]);
  paint.dot(baseX + 6, top + 2, COLORS.crownBand[0]);
}

function drawSide(paint, phase) {
  const y = phase.bob;
  const headX = Math.max(1, 3 + phase.reach);
  const headY = 5 + y + phase.head;

  paint.rect(9, 8 + y, 11, 7, COLORS.fur[0]);
  paint.rect(8, 7 + y, 6, 9, COLORS.fur[2]);
  paint.rect(11, 13 + y, 9, 3, COLORS.mantle[0]);
  paint.rect(17, 10 + y, 4, 6, COLORS.fur[1]);
  paint.rect(7, 5 + y + Math.floor(phase.head / 2), 4, 11, COLORS.fur[2]);
  paint.rect(7, 9 + y + Math.floor(phase.head / 2), 3, 7, COLORS.mantle[2]);
  paint.rect(8, 6 + y, 4, 3, COLORS.mantle[0]);

  paint.rect(headX + 2, headY + 1, 6, 4, COLORS.face[0]);
  paint.rect(headX, headY + 3, 6, 3, COLORS.face[1]);
  paint.rect(headX + 1, headY + 5, 5, 2, COLORS.face[2]);
  paint.rect(headX + 6, headY + 2, 3, 4, COLORS.fur[2]);
  paint.rect(headX + 6, headY, 3, 2, COLORS.ear[0]);
  paint.dot(headX + 8, headY, COLORS.ear[1]);
  drawSideRack(paint, headX, headY, phase.antler);

  paint.rect(20, 10 + y, 2, 3, COLORS.fur[0]);
  paint.rect(21, 8 + y, 2, 3, COLORS.mantle[2]);
  paint.rect(12, 8 + y, 3, 2, COLORS.mark[0]);
  paint.rect(15, 10 + y, 4, 2, COLORS.mark[1]);
  paint.rect(17, 12 + y, 2, 2, COLORS.crownBand[0]);
  paint.rect(10, 13 + y, 2, 2, COLORS.mantle[2]);

  drawSideLegs(paint, y, phase.stride);

  paint.dot(headX, headY + 4, COLORS.feature);
  paint.rect(headX + 2, headY + 6, 3, 1, COLORS.feature);
  paint.dot(headX + 6, headY + 2, COLORS.eye);
  paint.rect(headX + 3, headY + 1, 1, 3, COLORS.blaze[0]);
  paint.dot(headX + 4, headY + 4, COLORS.blaze[1]);
}

function drawFrontRack(paint, x, headTop, rackShift) {
  const top = Math.max(1, headTop - 5 + rackShift);
  const leftStem = 9 + x;
  const rightStem = 15 + x;
  const stemHeight = Math.max(4, headTop - top + 2);
  paint.rect(leftStem, top + 4, 1, stemHeight, COLORS.antler[0]);
  paint.rect(rightStem, top + 4, 1, stemHeight, COLORS.antler[0]);
  paint.rect(6 + x, top + 4, 4, 1, COLORS.antler[2]);
  paint.rect(4 + x, top + 3, 3, 1, COLORS.antler[0]);
  paint.rect(3 + x, top + 2, 2, 1, COLORS.antler[1]);
  paint.rect(3 + x, top, 1, 3, COLORS.antler[2]);
  paint.rect(6 + x, top + 1, 1, 4, COLORS.antler[0]);
  paint.rect(9 + x, top + 1, 1, 4, COLORS.antler[1]);
  paint.rect(15 + x, top + 4, 4, 1, COLORS.antler[2]);
  paint.rect(18 + x, top + 3, 3, 1, COLORS.antler[0]);
  paint.rect(20 + x, top + 2, 2, 1, COLORS.antler[1]);
  paint.rect(21 + x, top, 1, 3, COLORS.antler[2]);
  paint.rect(18 + x, top + 1, 1, 4, COLORS.antler[0]);
  paint.rect(15 + x, top + 1, 1, 4, COLORS.antler[1]);
  paint.dot(8 + x, top + 4, COLORS.crownBand[0]);
  paint.dot(10 + x, top + 3, COLORS.crownBand[1]);
  paint.dot(16 + x, top + 3, COLORS.crownBand[1]);
  paint.dot(18 + x, top + 4, COLORS.crownBand[0]);
}

function drawDown(paint, phase) {
  const y = phase.bob;
  const x = phase.lateral;
  const headTop = 5 + y + phase.head;

  paint.rect(7 + x, 8 + y, 11, 9, COLORS.fur[0]);
  paint.rect(8 + x, 7 + y, 9, 5, COLORS.fur[2]);
  paint.rect(8 + x, 13 + y, 9, 4, COLORS.mantle[0]);
  paint.rect(9 + x, 6 + y + Math.floor(phase.head / 2), 7, 10, COLORS.fur[2]);
  paint.rect(10 + x, 9 + y + Math.floor(phase.head / 2), 5, 7, COLORS.mantle[2]);
  paint.rect(8 + x, headTop + 1, 9, 5, COLORS.face[0]);
  paint.rect(9 + x, headTop + 4, 7, 4, COLORS.face[1]);
  paint.rect(10 + x, headTop + 6, 5, 2, COLORS.face[2]);
  paint.rect(6 + x, headTop + 2, 3, 2, COLORS.ear[0]);
  paint.rect(16 + x, headTop + 2, 3, 2, COLORS.ear[0]);
  paint.dot(6 + x, headTop + 2, COLORS.ear[1]);
  paint.dot(18 + x, headTop + 2, COLORS.ear[1]);
  drawFrontRack(paint, x, headTop, phase.antler);

  paint.rect(18 + x, 10 + y, 3, 3, COLORS.fur[1]);
  paint.rect(20 + x, 8 + y, 2, 3, COLORS.mantle[2]);
  paint.rect(7 + x, 12 + y, 3, 2, COLORS.mark[0]);
  paint.rect(15 + x, 12 + y, 3, 2, COLORS.mark[0]);
  paint.dot(10 + x, 14 + y, COLORS.mark[1]);
  paint.dot(14 + x, 14 + y, COLORS.mark[1]);
  paint.dot(9 + x, 10 + y, COLORS.crownBand[0]);
  paint.dot(15 + x, 10 + y, COLORS.crownBand[0]);

  paint.dot(10 + x, headTop + 4, COLORS.eye);
  paint.dot(14 + x, headTop + 4, COLORS.eye);
  paint.dot(10 + x, headTop + 6, COLORS.feature);
  paint.dot(14 + x, headTop + 6, COLORS.feature);
  paint.rect(11 + x, headTop + 7, 3, 1, COLORS.feature);
  paint.rect(12 + x, headTop + 1, 1, 4, COLORS.blaze[0]);
  paint.dot(12 + x, headTop + 5, COLORS.blaze[1]);
  drawEndLegs(paint, y, phase.stride, x);
}

function drawUp(paint, phase) {
  const y = phase.bob;
  const x = phase.lateral;
  const headTop = 5 + y + phase.head;

  paint.rect(7 + x, 8 + y, 11, 9, COLORS.fur[0]);
  paint.rect(8 + x, 7 + y, 9, 5, COLORS.fur[2]);
  paint.rect(8 + x, 13 + y, 9, 4, COLORS.fur[1]);
  paint.rect(9 + x, 6 + y + Math.floor(phase.head / 2), 7, 10, COLORS.fur[2]);
  paint.rect(8 + x, headTop + 1, 9, 6, COLORS.face[0]);
  paint.rect(9 + x, headTop + 4, 7, 4, COLORS.fur[1]);
  paint.rect(6 + x, headTop + 2, 3, 2, COLORS.ear[1]);
  paint.rect(16 + x, headTop + 2, 3, 2, COLORS.ear[1]);
  drawFrontRack(paint, x, headTop, phase.antler);

  paint.rect(18 + x, 10 + y, 3, 3, COLORS.fur[1]);
  paint.rect(20 + x, 8 + y, 2, 3, COLORS.mantle[2]);
  paint.rect(8 + x, 10 + y, 3, 2, COLORS.mark[0]);
  paint.rect(14 + x, 10 + y, 3, 2, COLORS.mark[0]);
  paint.rect(10 + x, 13 + y, 5, 2, COLORS.mark[1]);
  paint.dot(9 + x, 14 + y, COLORS.crownBand[0]);
  paint.dot(15 + x, 14 + y, COLORS.crownBand[0]);
  paint.rect(11 + x, 12 + y, 3, 3, COLORS.mantle[2]);
  drawEndLegs(paint, y, phase.stride, x);
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
    return HURT_PHASES[EN_E10_GLOAMCROWN_SOVEREIGN_DEATH_SOURCE_FRAMES[frame]];
  }
  throw new TypeError('Animation ' + animation + ' is not implemented for Gloamcrown Sovereign.');
}

function buildPixels(direction, animation, frame) {
  const phase = phaseFor(animation, frame);
  const canonical = direction === 'right' ? 'left' : direction;
  const pixels = createPixels();
  const paint = painter(pixels);
  if (canonical === 'down') drawDown(paint, phase);
  else if (canonical === 'up') drawUp(paint, phase);
  else if (canonical === 'left') drawSide(paint, phase);
  else throw new TypeError('Unsupported Gloamcrown Sovereign direction ' + direction + '.');
  let rendered = direction === 'right' ? mirrorPixels(pixels) : pixels;
  if (phase.flash) rendered = rendered.map((color) => color ? COLORS.flash : null);
  return { phase, pixels: rendered };
}

function paintPixels(context, pixels) {
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    const color = pixels[(y * SIZE) + x];
    if (color) {
      context.fillStyle = color;
      context.fillRect(x, y, 1, 1);
    }
  }
}

export function renderEnE10GloamcrownSovereignFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Gloamcrown Sovereign rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Gloamcrown Sovereign direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'stag',
    variant: 'gloamcrown-sovereign',
    direction,
    animation,
    frame,
    phase: phase.name,
    gloamcrownSovereignGate: EN_E10_GLOAMCROWN_SOVEREIGN_GATE.id,
    architectureDecision: EN_E10_STAG_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E10_BRIARSTEP_HARRIER_GATE.id,
    actorTopology: EN_E10_GLOAMCROWN_SOVEREIGN_DATA.actorTopology,
    childAssetCount: EN_E10_GLOAMCROWN_SOVEREIGN_DATA.childAssets.length,
    alphaPolicy: EN_E10_GLOAMCROWN_SOVEREIGN_DATA.alphaPolicy,
    effectBoundary: EN_E10_GLOAMCROWN_SOVEREIGN_DATA.effectBoundary,
  });
}

export const EN_E10_GLOAMCROWN_SOVEREIGN_RENDERER = deepFreeze({
  key: 'en-e10-stag-gloamcrown-sovereign-v1',
  chassis: EN_E10_GLOAMCROWN_SOVEREIGN_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'stag', 'The EN-E10 Gloamcrown Sovereign renderer is restricted to Stag.');
    assert(variant.id === 'gloamcrown-sovereign', 'The EN-E10 Gloamcrown Sovereign renderer is restricted to Gloamcrown Sovereign.');
    return renderEnE10GloamcrownSovereignFrame(context, direction, animation.id, frame);
  },
});

const GLOAMCROWN_PATRIARCH_VARIANT = deepFreeze({
  id: 'gloamcrown-sovereign',
  name: 'Gloamcrown Sovereign',
  role: EN_E10_GLOAMCROWN_SOVEREIGN_CONTRACT.role,
  status: EN_E10_GLOAMCROWN_SOVEREIGN_CONTRACT.state,
  brief: 'A private complete elite Stag with a broad midnight-plum body, high old-ivory royal mantle, long powerful neck, tapered black-violet muzzle, vast connected weathered-gold crown antlers with verdigris bands, wine markings, mulberry ears, pale blaze, amber eyes, short flag tail, four split hooves, and a body-owned antler lift into a planted crown press; all effects remain external.',
  rendererData: EN_E10_GLOAMCROWN_SOVEREIGN_DATA,
});

export const EN_E10_GLOAMCROWN_SOVEREIGN_FAMILY = deepFreeze({
  id: 'stag',
  name: 'Stag Gloamcrown Sovereign Review',
  sliceId: 'EN-E10',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E10_GLOAMCROWN_SOVEREIGN_CONTRACT.chassis,
  rendererKey: EN_E10_GLOAMCROWN_SOVEREIGN_RENDERER.key,
  variants: [GLOAMCROWN_PATRIARCH_VARIANT],
  rendererData: {
    contractCard: EN_E10_STAG_ELITE_CONTRACT_CARD.id,
    architectureDecision: EN_E10_STAG_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E10_BRIARSTEP_HARRIER_GATE.id,
    activeGate: EN_E10_GLOAMCROWN_SOVEREIGN_GATE.id,
  },
  review: {
    baselineVariant: 'gloamcrown-sovereign',
    scale: 8,
    notes: 'Awaiting explicit visual approval as one exact private elite Stag against approved Briarstep Harrier and Mossrack Forager plus public Dire Wolf. The packet includes raw, distinct Complete B outlined, Complete B + Form, comparison, and two synchronized GIF artifacts. Keep outline/public registration, fixtures, effects, child assets, additional Stag variants, Mammoth, Rhino, Rhino Boss work, deferred Runic Idol, release, accepted drift, and a pull request separate.',
  },
});

export const EN_E10_GLOAMCROWN_SOVEREIGN_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E10_GLOAMCROWN_SOVEREIGN_RENDERER],
  families: [EN_E10_GLOAMCROWN_SOVEREIGN_FAMILY],
});
