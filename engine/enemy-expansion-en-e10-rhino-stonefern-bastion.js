import { SIZE } from './catalogs.js';
import { createEnemyExpansionRegistry, ENEMY_EXPANSION_STATES } from './enemy-expansion.js';
import { EN_E10_RHINO_TOPOLOGY_DECISION } from './enemy-expansion-en-e10-rhino-mudplate-grazer.js';
import { EN_E10_REEDCREST_SKIRMISHER_GATE } from './enemy-expansion-en-e10-rhino-reedcrest-skirmisher.js';

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
  hide: ['#59605c', '#303633', '#7b827a'],
  plate: ['#a06e42', '#5d402e', '#c38d5b'],
  muzzle: ['#444b47', '#252a28', '#6a726b'],
  horn: ['#d7cfad', '#847b61', '#f0e7c5'],
  belly: ['#666c65', '#3d433f', '#8c9288'],
  fern: ['#89915e', '#50583e'],
  ear: ['#85655a', '#503f3a'],
  foot: '#1b211f',
  feature: '#101513',
  eye: '#d99a3f',
  flash: '#f4f4f4',
});

export const EN_E10_RHINO_ELITE_CONTRACT_CARD = deepFreeze({
  id: 'en-e10-rhino-elite-stonefern-bastion-v1',
  sliceId: 'EN-E10',
  family: 'rhino',
  familyName: 'Rhino',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingVariant: {
    id: 'reedcrest-skirmisher',
    role: 'specialist',
    status: 'approved-published-reconciled',
    gateId: EN_E10_REEDCREST_SKIRMISHER_GATE.id,
  },
  activeVariant: {
    id: 'stonefern-bastion',
    name: 'Stonefern Bastion',
    role: 'elite',
    status: 'implemented-full-awaiting-visual-approval',
  },
  deferredRoles: [],
  actorTopology: EN_E10_RHINO_TOPOLOGY_DECISION.selected,
  styleContract: 'Use chunky one-to-three-pixel hard-alpha forms for one connected elite Rhino: a broad low iron-gray barrel, restrained shoulder escarpment, three separated ochre natural ridges, heavy compact charcoal wedge head, one thick limestone body-owned nasal horn and tiny nub, low rounded ears, muted fern face and flank markings, short tail, four pillar legs, and four separated broad three-toed feet. Preserve the low Rhino span, horn, face, separated ridge rhythm, and four-foot stance in every relevant view. Avoid a giant horn, crown head, high Boss hump, harness, restraint links, rage brand, corruption, detached parts, or baked effects.',
  effectBoundary: EN_E10_RHINO_TOPOLOGY_DECISION.effectBoundary,
});

export const EN_E10_STONEFERN_BASTION_CONTRACT = deepFreeze({
  sliceId: 'EN-E10',
  family: 'rhino',
  variant: 'stonefern-bastion',
  role: 'elite',
  state: 'implemented-complete-motion-awaiting-visual-approval',
  topology: EN_E10_RHINO_TOPOLOGY_DECISION.selected,
  chassis: 'baked-single-actor-iron-gray-broad-low-shoulder-escarpment-ochre-ridge-fern-mark-heavy-limestone-horn-four-three-toed-foot-rhino-v1',
  silhouette: 'A broad grounded elite Rhino with a low iron-gray barrel, restrained shoulder escarpment, three separated ochre natural ridges, heavy compact wedge head, one thick forward-curved horn and tiny nub, low ears, short tail, four pillar legs, and four separated broad three-toed feet. It must read tougher and more deliberate than Mudplate Grazer and Reedcrest Skirmisher while remaining substantially smaller, flatter, less armed, and less top-heavy than the 48x48 Furious Depraved Rhino Boss.',
  visualIdentity: 'Iron-gray hide, burnt-ochre separated ridges, muted fern face and flank markings, charcoal muzzle and feet, brown ears, limestone horn and nub, and copper-gold eyes establish Stonefern Bastion. It has no harness, restraints, rage brand, violet corruption, or Boss effects. Every mark belongs to the actor; dust, wake, trails, horn arcs, impacts, debris, particles, projectiles, glow, roar marks, and illumination remain external.',
  effectBoundary: EN_E10_RHINO_ELITE_CONTRACT_CARD.effectBoundary,
});

export const EN_E10_STONEFERN_BASTION_DATA = deepFreeze({
  actor: {
    species: 'authored-rhino-elite',
    bodyBuild: 'broad-low-shoulder-escarpment-three-separated-ridge-four-pillar-leg-three-toed-foot-elite-quadruped',
    skin: 'iron-gray-hide-burnt-ochre-natural-ridges',
    hairStyle: 'none-short-connected-tail-only',
    hairColor: 'iron-gray',
    expression: 'steady-copper-gold-forward-watch',
    faceDetail: 'heavy-charcoal-wedge-muzzle-low-ears-muted-fern-brow-copper-gold-eyes-thick-limestone-forward-curved-horn-and-tiny-nub',
    headgear: 'body-owned-thick-forward-curved-limestone-nasal-horn-and-tiny-secondary-nub',
    outfit: 'body-owned-separated-ochre-natural-ridges-and-muted-fern-markings',
    outfitColor: 'iron-gray-ochre-fern-limestone-brown-and-copper-gold',
    outfitTier: 'tier3',
    weapon: 'body-owned-four-foot-compression-into-short-shoulder-hook',
    weaponTier: 'none',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: { skin: COLORS.hide, hair: COLORS.muzzle, outfit: COLORS.plate },
  },
  stonefernBastion: COLORS,
  actorTopology: EN_E10_RHINO_TOPOLOGY_DECISION.selected,
  childAssets: [],
  alphaPolicy: 'binary-single-component-iron-gray-broad-low-shoulder-escarpment-separated-ochre-ridges-fern-marks-heavy-limestone-horn-tiny-nub-low-ears-short-tail-four-pillar-legs-and-four-grounded-three-toed-feet',
  effectBoundary: EN_E10_RHINO_ELITE_CONTRACT_CARD.effectBoundary,
  bakedEffects: [],
});

export const EN_E10_STONEFERN_BASTION_GATE = deepFreeze({
  id: 'en-e10-rhino-stonefern-bastion-full-v1',
  status: 'awaiting-visual-approval',
  baseCheckpoint: 'b0313abeeaadea7e14b62339e280469b08b37653',
  authorizedOn: '2026-08-13',
  authorizationEvidence: 'The exact Reedcrest Skirmisher implementation 2f02388f941088f0fdadff809c3b048ba2e93734, approval record c0ab513f576f0e66cafcc0b36a3467b13e790936, initial published handoff bbe25e76653622c93b99068268f10791a35a9dc2, and final reconciliation b0313abeeaadea7e14b62339e280469b08b37653 were pushed and remote verified. The designer asked whats next; Codex answered that elite Rhino is next but its gate was closed and required a fresh lets do next. After the designer typed approvedf, Codex asked whether that meant lets do next to open the elite Rhino lane, and the designer replied approved. That confirmation authorizes exactly one private elite Rhino full 80-frame candidate on a new isolated branch under the selected baked-single-actor-natural-plated-low-grounded-quadruped topology. It does not approve candidate pixels or authorize public or outline registration, fixtures, effects, child assets, any Furious Depraved Rhino Boss change, Runic Idol, release, accepted drift, or a pull request.',
  architectureDecision: EN_E10_RHINO_TOPOLOGY_DECISION.id,
  precedingApproval: {
    gateId: EN_E10_REEDCREST_SKIRMISHER_GATE.id,
    artifactSha256: EN_E10_REEDCREST_SKIRMISHER_GATE.artifactSha256,
    outlinedArtifactSha256: EN_E10_REEDCREST_SKIRMISHER_GATE.outlinedArtifactSha256,
    assembledArtifactSha256: EN_E10_REEDCREST_SKIRMISHER_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E10_REEDCREST_SKIRMISHER_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E10_REEDCREST_SKIRMISHER_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E10_REEDCREST_SKIRMISHER_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E10_REEDCREST_SKIRMISHER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E10_REEDCREST_SKIRMISHER_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E10_REEDCREST_SKIRMISHER_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E10_REEDCREST_SKIRMISHER_GATE.initialPublishedHandoff,
    currentReconciliation: 'b0313abeeaadea7e14b62339e280469b08b37653',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e10-rhino-stonefern-bastion/en-e10-rhino-stonefern-bastion-full-suite-raw.png',
  artifactSha256: '82ea503fec8ded8679f38714b8e1870a29d9db441dc902853ec4716249c2efe5',
  outlinedArtifact: 'enemy-expansion-review/en-e10-rhino-stonefern-bastion/en-e10-rhino-stonefern-bastion-full-suite-outlined-complete-b.png',
  outlinedArtifactSha256: '47ce2c46015c05f5ed05b11eb1f10af865ad2c1510e22d7b2e9cf18a24639107',
  assembledArtifact: 'enemy-expansion-review/en-e10-rhino-stonefern-bastion/en-e10-rhino-stonefern-bastion-full-suite-complete-b-form.png',
  assembledArtifactSha256: '753f0c1b70e16410763803ce4258152228fca387e39b4d6fecaac537defe1293',
  comparisonArtifact: 'enemy-expansion-review/en-e10-rhino-stonefern-bastion/en-e10-rhino-stonefern-bastion-family-comparison.png',
  comparisonArtifactSha256: '2622e48bd4d8dd751457fb1527d61760677757578fe77616cacf6ffac7a66838',
  reviewAnimations: {
    raw: { artifact: 'enemy-expansion-review/en-e10-rhino-stonefern-bastion/en-e10-rhino-stonefern-bastion-full-suite-four-directions-labeled.gif', sha256: 'c4eb9256c8db42de0232aa71b709b3aed21521ea9ca3e32ddf3d4120e1eb08a3', width: 640, height: 672, frames: 4, durationMs: 180 },
    completeBForm: { artifact: 'enemy-expansion-review/en-e10-rhino-stonefern-bastion/en-e10-rhino-stonefern-bastion-full-suite-four-directions-labeled-complete-b-form.gif', sha256: 'a784f08e7535a4ccc219adc2ae3ae277e2058c68c14ffcefecec66f518bcbae6', width: 640, height: 672, frames: 4, durationMs: 180 },
  },
  candidateFrameDigest: 'a737511220c2049e4aed742a7f08a9a71d4b1cfeab86aa8997cef4d3181b808f',
  mudplateComparisonDigest: 'ba84ed03d4985b979974ab23d547fb7f687d6e2b948d80c9ccc84bb9cd911848',
  reedcrestComparisonDigest: EN_E10_REEDCREST_SKIRMISHER_GATE.candidateFrameDigest,
  direWolfComparisonDigest: 'a94a66ee380cfcb91db3907a3a049dae4b59357870857c3ed31be259bb1f1579',
  bossDistinction: {
    directionAsset: 'engine/assets/bosses/furious-depraved-rhino-directions-v1.png',
    directionSha256: '6ce979d356e986b207a09bf2e020fde25f2e4a496137fac96aa7bc6a567f2f86',
    animationAsset: 'engine/assets/bosses/furious-depraved-rhino-animation-v1-full.png',
    animationSha256: '7c87c58b4854f75ff8827f66fe29a78b36ee198865e1f6e8d3d4e18d66f46ceb',
    status: 'candidate-read-only',
  },
  scope: 'One complete 80-frame Stonefern Bastion elite Rhino across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle holds a heavy fern-marked head over a planted four-foot stance. Walk uses four deliberate alternating weight transfers while the broad low barrel, separated ochre ridges, compact face, thick limestone horn, and broad three-toed feet stay readable. Attack plants all four feet, compresses low, rolls the body-owned shoulder forward into one short rising horn hook with no charge wake, trail, arc, flare, or impact pixels, and recovers. Hurt uses a complete white recoil and colored four-foot brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline board, distinct Complete B outlined board, Complete B + Form board, synchronized raw and Complete B + Form GIFs, approved Mudplate Grazer and Reedcrest Skirmisher plus public Dire Wolf comparisons, and the protected Furious Depraved Rhino Boss direction and full-animation candidates together.',
  exclusions: [
    'changes to approved Mudplate Grazer or Reedcrest Skirmisher rendered pixels',
    'changes to public Dire Wolf pixels',
    'public Rhino registration or outline registration',
    'public catalog or facade exposure',
    'asset-pack fixture or manifest changes',
    'schema, shared renderer, exporter, validator, or frame-contract changes',
    'detached horn, nub, ridges, ears, tail, feet, or child assets',
    'new Cast pixels or new Death pixels',
    'dust, charge wake, trails, horn arcs, horn flare, roar marks, shards, debris, impacts, particles, projectiles, glow, illumination, corruption, rage marks, restraint pieces, or effects',
    'additional Rhino variants',
    'any Furious Depraved Rhino Boss source, catalog, roster, or asset change',
    'Runic Idol or other EN-E09 work',
    'release, accepted drift, or pull request',
  ],
  nextGate: 'Stop for explicit designer visual approval of the exact Stonefern Bastion raw, distinct Complete B outlined, Complete B + Form, comparison, and synchronized GIF packet while showing the protected Furious Depraved Rhino Boss candidates for distinction. Do not commit, push, register, or publish the candidate before approval. The distinct outlined PNG is review evidence only and does not authorize outline registration. Every Boss change and all broader gates remain closed.',
});

export const EN_E10_STONEFERN_BASTION_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'stonefern-four-pillar-watch', pose: 'idle', bob: 0, head: 0, horn: 'level', reach: 0, lateral: 0, stride: [0, 0, 0, 0] },
  { name: 'heavy-fern-brow-settle', pose: 'idle', bob: 1, head: -1, horn: 'level', reach: 0, lateral: 0, stride: [0, 0, 0, 0] },
]);

const WALK_PHASES = deepFreeze([
  { name: 'near-fore-far-hind-stonefern-plant', pose: 'walk', bob: 0, head: 0, horn: 'level', reach: 0, lateral: 0, stride: [-1, 1, 0, -1] },
  { name: 'ochre-ridge-weight-rise', pose: 'walk', bob: -1, head: 1, horn: 'level', reach: 0, lateral: 1, stride: [0, 1, -1, 0] },
  { name: 'far-fore-near-hind-stonefern-plant', pose: 'walk', bob: 0, head: 0, horn: 'level', reach: 0, lateral: 0, stride: [1, -1, 0, 1] },
  { name: 'broad-barrel-weight-settle', pose: 'walk', bob: 1, head: -1, horn: 'level', reach: 0, lateral: -1, stride: [0, -1, 1, 0] },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'four-three-toed-foot-bastion-plant', pose: 'brace', bob: 0, head: 0, horn: 'level', reach: 0, lateral: 0, stride: [-1, 0, 1, 0] },
  { name: 'low-four-foot-compression', pose: 'compress', bob: 1, head: 1, horn: 'brace', reach: 0, lateral: 0, stride: [-1, 1, 1, -1] },
  { name: 'short-body-owned-shoulder-hook', pose: 'hook', bob: -1, head: -1, horn: 'hook', reach: -1, lateral: 1, stride: [-1, 1, 1, -1] },
  { name: 'effect-free-stonefern-recover', pose: 'recover', bob: 0, head: 0, horn: 'level', reach: 0, lateral: 0, stride: [0, -1, -1, 0] },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-stonefern-recoil', pose: 'hurt', bob: -1, head: 1, horn: 'level', reach: 0, lateral: -1, stride: [0, 0, 0, 0], flash: true },
  { name: 'colored-four-pillar-brace', pose: 'hurt-brace', bob: 1, head: 0, horn: 'level', reach: -1, lateral: 1, stride: [-1, 1, 1, -1], flash: false },
]);

function createPixels() { return new Array(SIZE * SIZE).fill(null); }

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert([x, y, width, height].every(Number.isInteger) && width > 0 && height > 0, 'Stonefern Bastion geometry must use positive integers.');
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Stonefern Bastion pixels must remain inside 24x24.');
      pixels[(py * SIZE) + px] = fill;
    }
  };
  return { rect, dot(x, y, fill) { rect(x, y, 1, 1, fill); } };
}

function drawSideLegs(paint, bodyY, stride) {
  const positions = [4, 8, 14, 19];
  for (let index = 0; index < positions.length; index++) {
    const footX = positions[index];
    const upperX = Math.max(4, Math.min(20, footX + stride[index]));
    const legY = 14 + bodyY;
    const anchorX = Math.max(6, Math.min(20, upperX));
    const color = index < 2 ? COLORS.muzzle[0] : COLORS.hide[1];
    paint.rect(Math.min(anchorX, upperX), legY, Math.abs(anchorX - upperX) + 2, 2, color);
    paint.rect(upperX, legY, 2, 7 - bodyY, color);
    paint.rect(footX, 20, 3, 2, COLORS.muzzle[1]);
    paint.rect(footX, 22, 3, 1, COLORS.foot);
  }
}

function drawEndLegs(paint, bodyY, stride, lateral) {
  const positions = [2, 7, 14, 19];
  for (let index = 0; index < positions.length; index++) {
    const footX = positions[index];
    const step = stride[index] > 0 ? 1 : stride[index] < 0 ? -1 : 0;
    const upperX = Math.max(2, Math.min(20, footX + lateral + step));
    const legY = 14 + bodyY;
    const anchorX = Math.max(6 + lateral, Math.min(18 + lateral, upperX));
    const color = index === 0 || index === 3 ? COLORS.hide[1] : COLORS.muzzle[0];
    paint.rect(Math.min(anchorX, upperX), legY, Math.abs(anchorX - upperX) + 2, 2, color);
    paint.rect(upperX, legY, 2, 7 - bodyY, color);
    paint.rect(footX, 20, 3, 2, COLORS.muzzle[1]);
    paint.rect(footX, 22, 3, 1, COLORS.foot);
  }
}

function drawSideHorn(paint, headX, headY, mode) {
  const lift = mode === 'hook' ? -1 : mode === 'brace' ? 1 : 0;
  const hornY = headY + lift;
  paint.rect(headX + 1, hornY + 1, 5, 2, COLORS.horn[1]);
  paint.rect(Math.max(1, headX - 1), hornY, 4, 3, COLORS.horn[0]);
  paint.rect(Math.max(1, headX - 2), hornY - 1, 2, 2, COLORS.horn[2]);
  paint.dot(headX + 6, headY, COLORS.horn[1]);
}

function drawSide(paint, phase) {
  const y = phase.bob;
  const headX = Math.max(2, 3 + phase.reach);
  const headY = 8 + y + phase.head;

  paint.rect(6, 7 + y, 16, 9, COLORS.hide[0]);
  paint.rect(6, 6 + y, 6, 6, COLORS.hide[2]);
  paint.rect(8, 6 + y, 3, 3, COLORS.plate[2]);
  paint.rect(13, 7 + y, 3, 3, COLORS.plate[0]);
  paint.rect(18, 8 + y, 3, 3, COLORS.plate[1]);
  paint.rect(9, 13 + y, 11, 3, COLORS.belly[0]);
  paint.rect(11, 10 + y, 2, 1, COLORS.fern[0]);
  paint.rect(15, 11 + y, 2, 2, COLORS.fern[1]);

  paint.rect(6, headY + 1, 5, 6, COLORS.hide[2]);
  paint.rect(headX + 2, headY, 8, 6, COLORS.muzzle[0]);
  paint.rect(headX, headY + 3, 7, 3, COLORS.muzzle[2]);
  paint.rect(headX + 6, headY, 2, 2, COLORS.fern[0]);
  paint.rect(headX + 8, headY - 1, 2, 2, COLORS.ear[0]);
  paint.dot(headX + 9, headY - 1, COLORS.ear[1]);
  drawSideHorn(paint, headX, headY, phase.horn);
  paint.dot(headX + 7, headY + 2, COLORS.eye);
  paint.dot(headX + 1, headY + 3, COLORS.feature);

  paint.rect(21, 10 + y, 2, 2, COLORS.hide[0]);
  paint.rect(22, 11 + y, 1, 3, COLORS.hide[1]);
  drawSideLegs(paint, y, phase.stride);
}

function drawFrontHorn(paint, x, headTop, mode) {
  const lift = mode === 'hook' ? -1 : mode === 'brace' ? 1 : 0;
  const hornTop = headTop + 3 + lift;
  paint.rect(10 + x, hornTop, 5, 2, COLORS.horn[1]);
  paint.rect(11 + x, hornTop + 2, 3, 1, COLORS.horn[0]);
  paint.rect(12 + x, hornTop + 3, 1, mode === 'hook' ? 3 : 2, COLORS.horn[0]);
  paint.dot(12 + x, hornTop + (mode === 'hook' ? 6 : 5), COLORS.horn[2]);
  paint.dot(12 + x, headTop + 1, COLORS.horn[1]);
}

function drawDown(paint, phase) {
  const y = phase.bob;
  const x = phase.lateral;
  const headTop = 8 + y + phase.head;

  paint.rect(3 + x, 6 + y, 19, 10, COLORS.hide[0]);
  paint.rect(4 + x, 5 + y, 7, 6, COLORS.hide[2]);
  paint.rect(6 + x, 6 + y, 3, 3, COLORS.plate[2]);
  paint.rect(12 + x, 7 + y, 3, 3, COLORS.plate[0]);
  paint.rect(18 + x, 8 + y, 3, 3, COLORS.plate[1]);
  paint.rect(5 + x, 13 + y, 15, 4, COLORS.belly[0]);
  paint.rect(8 + x, 10 + y, 2, 1, COLORS.fern[0]);
  paint.rect(16 + x, 11 + y, 2, 2, COLORS.fern[1]);
  paint.rect(7 + x, headTop, 11, 6, COLORS.muzzle[0]);
  paint.rect(8 + x, headTop + 2, 9, 5, COLORS.muzzle[2]);
  paint.rect(11 + x, headTop, 3, 2, COLORS.fern[0]);
  paint.rect(5 + x, headTop - 1, 3, 2, COLORS.ear[0]);
  paint.rect(17 + x, headTop - 1, 3, 2, COLORS.ear[0]);
  paint.dot(6 + x, headTop - 1, COLORS.ear[1]);
  paint.dot(18 + x, headTop - 1, COLORS.ear[1]);
  drawFrontHorn(paint, x, headTop, phase.horn);
  paint.dot(9 + x, headTop + 2, COLORS.eye);
  paint.dot(15 + x, headTop + 2, COLORS.eye);
  paint.rect(19 + x, 10 + y, 3, 2, COLORS.hide[0]);
  paint.rect(21 + x, 11 + y, 1, 3, COLORS.hide[1]);
  drawEndLegs(paint, y, phase.stride, x);
  paint.dot(10 + x, headTop + 4, COLORS.feature);
  paint.dot(14 + x, headTop + 4, COLORS.feature);
}

function drawUp(paint, phase) {
  const y = phase.bob;
  const x = phase.lateral;
  const headTop = 8 + y + phase.head;

  paint.rect(3 + x, 6 + y, 19, 10, COLORS.hide[0]);
  paint.rect(4 + x, 5 + y, 7, 6, COLORS.hide[2]);
  paint.rect(6 + x, 6 + y, 3, 3, COLORS.plate[2]);
  paint.rect(12 + x, 7 + y, 3, 3, COLORS.plate[0]);
  paint.rect(18 + x, 8 + y, 3, 3, COLORS.plate[1]);
  paint.rect(5 + x, 13 + y, 15, 4, COLORS.hide[1]);
  paint.rect(7 + x, headTop, 11, 6, COLORS.muzzle[0]);
  paint.rect(8 + x, headTop + 2, 9, 4, COLORS.plate[1]);
  paint.rect(11 + x, headTop, 3, 2, COLORS.fern[1]);
  paint.rect(5 + x, headTop - 1, 3, 2, COLORS.ear[1]);
  paint.rect(17 + x, headTop - 1, 3, 2, COLORS.ear[1]);
  paint.rect(8 + x, 10 + y, 2, 1, COLORS.fern[0]);
  paint.rect(16 + x, 11 + y, 2, 2, COLORS.fern[1]);
  paint.rect(10 + x, 14 + y, 5, 3, COLORS.belly[1]);
  paint.rect(12 + x, 17 + y, 1, 2, COLORS.hide[1]);
  drawEndLegs(paint, y, phase.stride, x);
}

function mirrorPixels(pixels) {
  const mirrored = createPixels();
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) mirrored[(y * SIZE) + (SIZE - 1 - x)] = pixels[(y * SIZE) + x];
  return mirrored;
}

function phaseFor(animation, frame) {
  if (animation === 'idle') { assert(frame >= 0 && frame < 2, 'Frame ' + frame + ' is invalid for idle.'); return IDLE_PHASES[frame]; }
  if (animation === 'walk') { assert(frame >= 0 && frame < 4, 'Frame ' + frame + ' is invalid for walk.'); return WALK_PHASES[frame]; }
  if (animation === 'attack' || animation === 'cast') { assert(frame >= 0 && frame < 4, 'Frame ' + frame + ' is invalid for ' + animation + '.'); return ATTACK_PHASES[frame]; }
  if (animation === 'hurt') { assert(frame >= 0 && frame < 2, 'Frame ' + frame + ' is invalid for hurt.'); return HURT_PHASES[frame]; }
  if (animation === 'death') { assert(frame >= 0 && frame < 4, 'Frame ' + frame + ' is invalid for death.'); return HURT_PHASES[EN_E10_STONEFERN_BASTION_DEATH_SOURCE_FRAMES[frame]]; }
  throw new TypeError('Animation ' + animation + ' is not implemented for Stonefern Bastion.');
}

function buildPixels(direction, animation, frame) {
  const phase = phaseFor(animation, frame);
  const canonical = direction === 'right' ? 'left' : direction;
  const pixels = createPixels();
  const paint = painter(pixels);
  if (canonical === 'down') drawDown(paint, phase);
  else if (canonical === 'up') drawUp(paint, phase);
  else if (canonical === 'left') drawSide(paint, phase);
  else throw new TypeError('Unsupported Stonefern Bastion direction ' + direction + '.');
  let rendered = direction === 'right' ? mirrorPixels(pixels) : pixels;
  if (phase.flash) rendered = rendered.map((color) => color ? COLORS.flash : null);
  return { phase, pixels: rendered };
}

function paintPixels(context, pixels) {
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    const color = pixels[(y * SIZE) + x];
    if (color) { context.fillStyle = color; context.fillRect(x, y, 1, 1); }
  }
}

export function renderEnE10StonefernSkirmisherFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Stonefern Bastion rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Stonefern Bastion direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'rhino', variant: 'stonefern-bastion', direction, animation, frame,
    phase: phase.name,
    stonefernBastionGate: EN_E10_STONEFERN_BASTION_GATE.id,
    architectureDecision: EN_E10_RHINO_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E10_REEDCREST_SKIRMISHER_GATE.id,
    actorTopology: EN_E10_STONEFERN_BASTION_DATA.actorTopology,
    childAssetCount: EN_E10_STONEFERN_BASTION_DATA.childAssets.length,
    alphaPolicy: EN_E10_STONEFERN_BASTION_DATA.alphaPolicy,
    effectBoundary: EN_E10_STONEFERN_BASTION_DATA.effectBoundary,
  });
}

export const EN_E10_STONEFERN_BASTION_RENDERER = deepFreeze({
  key: 'en-e10-rhino-stonefern-bastion-v1',
  chassis: EN_E10_STONEFERN_BASTION_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'rhino', 'The EN-E10 Stonefern Bastion renderer is restricted to Rhino.');
    assert(variant.id === 'stonefern-bastion', 'The EN-E10 Stonefern Bastion renderer is restricted to Stonefern Bastion.');
    return renderEnE10StonefernSkirmisherFrame(context, direction, animation.id, frame);
  },
});

const STONEFERN_BASTION_VARIANT = deepFreeze({
  id: 'stonefern-bastion',
  name: 'Stonefern Bastion',
  role: EN_E10_STONEFERN_BASTION_CONTRACT.role,
  status: EN_E10_STONEFERN_BASTION_CONTRACT.state,
  brief: 'A private complete elite Rhino with a broad iron-gray low barrel, restrained shoulder escarpment, three separated ochre natural ridges, muted fern markings, heavy charcoal head, thick limestone horn and tiny nub, copper-gold eyes, short tail, four pillar legs, four broad three-toed feet, and a planted compression into one short shoulder hook; all effects remain external.',
  rendererData: EN_E10_STONEFERN_BASTION_DATA,
});

export const EN_E10_STONEFERN_BASTION_FAMILY = deepFreeze({
  id: 'rhino',
  name: 'Rhino Stonefern Bastion Review',
  sliceId: 'EN-E10',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E10_STONEFERN_BASTION_CONTRACT.chassis,
  rendererKey: EN_E10_STONEFERN_BASTION_RENDERER.key,
  variants: [STONEFERN_BASTION_VARIANT],
  rendererData: {
    contractCard: EN_E10_RHINO_ELITE_CONTRACT_CARD.id,
    architectureDecision: EN_E10_RHINO_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E10_REEDCREST_SKIRMISHER_GATE.id,
    activeGate: EN_E10_STONEFERN_BASTION_GATE.id,
  },
  review: {
    baselineVariant: 'stonefern-bastion',
    scale: 8,
    notes: 'Awaiting explicit visual approval as one exact private elite Rhino against approved Mudplate Grazer and Reedcrest Skirmisher plus public Dire Wolf, with the protected Furious Depraved Rhino Boss direction and full-animation candidates shown separately for distinction. The distinct Complete B outlined PNG is review evidence only. Keep public or outline registration, fixtures, effects, child assets, every Boss change, deferred Runic Idol, release, accepted drift, and a pull request separate.',
  },
});

export const EN_E10_STONEFERN_BASTION_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E10_STONEFERN_BASTION_RENDERER],
  families: [EN_E10_STONEFERN_BASTION_FAMILY],
});
