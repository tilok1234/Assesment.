import { SIZE } from './catalogs.js';
import { createEnemyExpansionRegistry, ENEMY_EXPANSION_STATES } from './enemy-expansion.js';
import {
  EN_E10_MUDPLATE_GRAZER_GATE,
  EN_E10_RHINO_TOPOLOGY_DECISION,
} from './enemy-expansion-en-e10-rhino-mudplate-grazer.js';

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
  hide: ['#597069', '#30413d', '#81958a'],
  plate: ['#8c6850', '#543f35', '#b48768'],
  muzzle: ['#42514c', '#232d2a', '#687a71'],
  horn: ['#d2c89a', '#7c7457', '#eee6b9'],
  belly: ['#667c73', '#3d4c48', '#91a49a'],
  reed: ['#b7aa78', '#75694b'],
  ear: ['#8a665b', '#55413d'],
  foot: '#1d2826',
  feature: '#111817',
  eye: '#e2a64c',
  flash: '#f4f4f4',
});

export const EN_E10_RHINO_SPECIALIST_CONTRACT_CARD = deepFreeze({
  id: 'en-e10-rhino-specialist-reedcrest-skirmisher-v1',
  sliceId: 'EN-E10',
  family: 'rhino',
  familyName: 'Rhino',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingVariant: {
    id: 'mudplate-grazer',
    role: 'common',
    status: 'approved-published-reconciled',
    gateId: EN_E10_MUDPLATE_GRAZER_GATE.id,
  },
  activeVariant: {
    id: 'reedcrest-skirmisher',
    name: 'Reedcrest Skirmisher',
    role: 'specialist',
    status: 'implemented-full-approved',
  },
  deferredRoles: ['elite'],
  actorTopology: EN_E10_RHINO_TOPOLOGY_DECISION.selected,
  styleContract: 'Use chunky one-to-three-pixel hard-alpha forms for a connected specialist Rhino: a lean low barrel, forward shoulder wedge, three narrow rust natural plate ridges, compact slate wedge head, one medium upswept body-owned nasal horn and tiny nub, pointed ears, pale reed face and flank markings, short tail, four weight-bearing legs, and four separated broad three-toed feet. Preserve the lean Rhino span, horn, face blaze, ridge rhythm, and four-foot stance in every relevant view. Avoid a huge horn, crown head, high Boss hump, harness, restraint links, rage brand, corruption, detached parts, or baked effects.',
  effectBoundary: EN_E10_RHINO_TOPOLOGY_DECISION.effectBoundary,
});

export const EN_E10_REEDCREST_SKIRMISHER_CONTRACT = deepFreeze({
  sliceId: 'EN-E10',
  family: 'rhino',
  variant: 'reedcrest-skirmisher',
  role: 'specialist',
  state: 'implemented-complete-motion-approved',
  topology: EN_E10_RHINO_TOPOLOGY_DECISION.selected,
  chassis: 'baked-single-actor-slate-teal-lean-forward-shoulder-rust-ridge-reed-blaze-upswept-horn-four-three-toed-foot-rhino-v1',
  silhouette: 'A lean grounded specialist Rhino with a low barrel, defined but restrained forward shoulder wedge, three narrow rearward natural plate ridges, compact wedge head, one medium upswept horn and tiny nub, pointed ears, short tail, four weight-bearing legs, and four separated broad three-toed feet. It must read quicker and more directional than Mudplate Grazer while remaining substantially smaller, flatter, less armed, and less top-heavy than the 48x48 Furious Depraved Rhino Boss.',
  visualIdentity: 'Slate-teal hide, rust-brown plate ridges, pale reed face blaze and flank bars, dark green-gray muzzle and feet, muted rose ears, sand-ivory medium horn and nub, and amber eyes establish Reedcrest Skirmisher. It has no harness, restraints, rage brand, violet corruption, or Boss effects. Every mark belongs to the actor; dust, wake, trails, horn arcs, impacts, debris, particles, projectiles, glow, roar marks, and illumination remain external.',
  effectBoundary: EN_E10_RHINO_SPECIALIST_CONTRACT_CARD.effectBoundary,
});

export const EN_E10_REEDCREST_SKIRMISHER_DATA = deepFreeze({
  actor: {
    species: 'authored-rhino-specialist',
    bodyBuild: 'lean-low-forward-shoulder-three-ridge-four-leg-three-toed-foot-specialist-quadruped',
    skin: 'slate-teal-hide-rust-natural-ridges',
    hairStyle: 'none-short-connected-tail-only',
    hairColor: 'slate-teal',
    expression: 'alert-amber-lateral-watch',
    faceDetail: 'compact-slate-wedge-muzzle-pointed-ears-pale-reed-blaze-amber-eyes-medium-sand-ivory-upswept-horn-and-tiny-nub',
    headgear: 'body-owned-medium-upswept-nasal-horn-and-tiny-secondary-nub',
    outfit: 'body-owned-natural-rust-plate-ridges-and-pale-reed-markings',
    outfitColor: 'slate-teal-rust-reed-sand-ivory-rose-and-amber',
    outfitTier: 'tier2',
    weapon: 'body-owned-planted-sidestep-into-controlled-rising-horn-sweep',
    weaponTier: 'none',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: { skin: COLORS.hide, hair: COLORS.muzzle, outfit: COLORS.plate },
  },
  reedcrestSkirmisher: COLORS,
  actorTopology: EN_E10_RHINO_TOPOLOGY_DECISION.selected,
  childAssets: [],
  alphaPolicy: 'binary-single-component-slate-teal-lean-low-forward-shoulder-rust-ridges-reed-blaze-upswept-horn-tiny-nub-pointed-ears-short-tail-four-legs-and-four-grounded-three-toed-feet',
  effectBoundary: EN_E10_RHINO_SPECIALIST_CONTRACT_CARD.effectBoundary,
  bakedEffects: [],
});

export const EN_E10_REEDCREST_SKIRMISHER_GATE = deepFreeze({
  id: 'en-e10-rhino-reedcrest-skirmisher-full-v1',
  status: 'approved',
  baseCheckpoint: 'fb99996abd98ae369dc6d1fdb436e8f97d54bc95',
  authorizedOn: '2026-08-13',
  authorizationEvidence: 'The exact Mudplate Grazer implementation 1e685159e6ddc09a20d853a511c9cfb448b502fe, approval record 9d2b801f5e02c851e746571880d5465e65e3b1a6, initial published handoff fcb5296dba2c9960609d6dd5ed326ad97c093ac1, and final reconciliation fb99996abd98ae369dc6d1fdb436e8f97d54bc95 were pushed and remote verified. The designer reply was: approved and lets do next. Its continuation suffix authorizes exactly one private specialist Rhino full 80-frame candidate on a new isolated branch under the selected baked-single-actor-natural-plated-low-grounded-quadruped topology. It does not approve candidate pixels or authorize public or outline registration, fixtures, effects, child assets, elite Rhino, any Furious Depraved Rhino Boss change, Runic Idol, release, accepted drift, or a pull request.',
  architectureDecision: EN_E10_RHINO_TOPOLOGY_DECISION.id,
  approvedOn: '2026-08-13',
  approvalEvidence: 'The exact labeled all-four-direction raw/no-outline, distinct Complete B outlined, Complete B + Form, and approved Mudplate Grazer and Frostvein Wayfinder plus public Dire Wolf comparison PNGs were frozen with both synchronized GIF hashes. The Aseprite review session reported those exact four paths open together as raw sprite 270, outlined sprite 274, Complete B + Form sprite 278, and comparison sprite 282; protected Furious Depraved Rhino Boss direction and full-animation sheets were open separately as sprites 294 and active 298. The final approval prompt posted all four exact PNGs, both synchronized GIFs, and candidate digest 3125fe122e54f7a2d08c3f28cd179f2a8409a771001e9021217238a488348f8e. The designer replied: approved. Approval applies only to that exact Reedcrest Skirmisher digest and its six frozen review hashes. It does not open elite Rhino or any broader gate.',
  approvedImplementation: '2f02388f941088f0fdadff809c3b048ba2e93734',
  publicationAuthorizedOn: '2026-08-13',
  publicationAuthorizationEvidence: 'The designer previously said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact frozen artifact or digest. It does not authorize registration, fixtures, effects, child assets, later roles or families, release, accepted drift, or a pull request.',
  publishedImplementation: '2f02388f941088f0fdadff809c3b048ba2e93734',
  publishedApprovalRecord: 'c0ab513f576f0e66cafcc0b36a3467b13e790936',
  initialPublishedHandoff: 'bbe25e76653622c93b99068268f10791a35a9dc2',
  publicationState: 'published',
  precedingApproval: {
    gateId: EN_E10_MUDPLATE_GRAZER_GATE.id,
    artifactSha256: EN_E10_MUDPLATE_GRAZER_GATE.artifactSha256,
    outlinedArtifactSha256: EN_E10_MUDPLATE_GRAZER_GATE.outlinedArtifactSha256,
    assembledArtifactSha256: EN_E10_MUDPLATE_GRAZER_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E10_MUDPLATE_GRAZER_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E10_MUDPLATE_GRAZER_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E10_MUDPLATE_GRAZER_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E10_MUDPLATE_GRAZER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E10_MUDPLATE_GRAZER_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E10_MUDPLATE_GRAZER_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E10_MUDPLATE_GRAZER_GATE.initialPublishedHandoff,
    currentReconciliation: 'fb99996abd98ae369dc6d1fdb436e8f97d54bc95',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e10-rhino-reedcrest-skirmisher/en-e10-rhino-reedcrest-skirmisher-full-suite-raw.png',
  artifactSha256: '70b6b0fbc2433acfa883bbe405ee4a62b043bf7af674b13a0d2e4a906e587842',
  outlinedArtifact: 'enemy-expansion-review/en-e10-rhino-reedcrest-skirmisher/en-e10-rhino-reedcrest-skirmisher-full-suite-outlined-complete-b.png',
  outlinedArtifactSha256: '1d7951acabb4c3b12fd3a16c165a65f5c42cc0721ed8b72b25a64db306b9594d',
  assembledArtifact: 'enemy-expansion-review/en-e10-rhino-reedcrest-skirmisher/en-e10-rhino-reedcrest-skirmisher-full-suite-complete-b-form.png',
  assembledArtifactSha256: '34674d927289e87e4502b77f3321a81863858f138f36572756f1410ae7b4bd3c',
  comparisonArtifact: 'enemy-expansion-review/en-e10-rhino-reedcrest-skirmisher/en-e10-rhino-reedcrest-skirmisher-family-comparison.png',
  comparisonArtifactSha256: 'b87f4961f1db5a0e11dc5b636b4c1db2f7d5d80d05a646120405111f446929c5',
  reviewAnimations: {
    raw: { artifact: 'enemy-expansion-review/en-e10-rhino-reedcrest-skirmisher/en-e10-rhino-reedcrest-skirmisher-full-suite-four-directions-labeled.gif', sha256: '683051e6fdabbc96d7624644266ec25127bfe73e194a489ccad01a23c66e19bb', width: 640, height: 672, frames: 4, durationMs: 180 },
    completeBForm: { artifact: 'enemy-expansion-review/en-e10-rhino-reedcrest-skirmisher/en-e10-rhino-reedcrest-skirmisher-full-suite-four-directions-labeled-complete-b-form.gif', sha256: 'ebd69b5ed812888fb6601f70d0df869054efcf8206f81672d6c5ba7f440a7f49', width: 640, height: 672, frames: 4, durationMs: 180 },
  },
  candidateFrameDigest: '3125fe122e54f7a2d08c3f28cd179f2a8409a771001e9021217238a488348f8e',
  mudplateComparisonDigest: EN_E10_MUDPLATE_GRAZER_GATE.candidateFrameDigest,
  frostveinComparisonDigest: '2fbcd71017d4acacb9e8cfee31d984ad9f039634af79cb656180b11a08f1250e',
  direWolfComparisonDigest: 'a94a66ee380cfcb91db3907a3a049dae4b59357870857c3ed31be259bb1f1579',
  bossDistinction: {
    directionAsset: 'engine/assets/bosses/furious-depraved-rhino-directions-v1.png',
    directionSha256: '6ce979d356e986b207a09bf2e020fde25f2e4a496137fac96aa7bc6a567f2f86',
    animationAsset: 'engine/assets/bosses/furious-depraved-rhino-animation-v1-full.png',
    animationSha256: '7c87c58b4854f75ff8827f66fe29a78b36ee198865e1f6e8d3d4e18d66f46ceb',
    status: 'candidate-read-only',
  },
  scope: 'One complete 80-frame Reedcrest Skirmisher specialist Rhino across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle holds an alert pale-blazed head over a planted four-foot stance. Walk uses four restrained alternating weight transfers while the lean barrel, rust ridges, compact face, medium upswept horn, and broad three-toed feet stay readable. Attack plants, shifts laterally, draws the head back, performs one controlled body-owned rising horn sweep with no charge wake, trail, arc, flare, or impact pixels, and recovers. Hurt uses a complete white recoil and colored four-foot brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline board, distinct Complete B outlined board, Complete B + Form board, synchronized raw and Complete B + Form GIFs, approved Mudplate Grazer and Frostvein Wayfinder plus public Dire Wolf comparisons, and the protected Furious Depraved Rhino Boss direction and full-animation candidates together.',
  exclusions: [
    'changes to approved Mudplate Grazer or Frostvein Wayfinder rendered pixels',
    'changes to public Dire Wolf pixels',
    'public Rhino registration or outline registration',
    'public catalog or facade exposure',
    'asset-pack fixture or manifest changes',
    'schema, shared renderer, exporter, validator, or frame-contract changes',
    'detached horn, nub, ridges, ears, tail, feet, or child assets',
    'new Cast pixels or new Death pixels',
    'dust, charge wake, trails, horn arcs, horn flare, roar marks, shards, debris, impacts, particles, projectiles, glow, illumination, corruption, rage marks, restraint pieces, or effects',
    'elite Rhino variants',
    'any Furious Depraved Rhino Boss source, catalog, roster, or asset change',
    'Runic Idol or other EN-E09 work',
    'release, accepted drift, or pull request',
  ],
  nextGate: 'The exact Reedcrest Skirmisher implementation 2f02388f941088f0fdadff809c3b048ba2e93734, approval record c0ab513f576f0e66cafcc0b36a3467b13e790936, and initial published handoff bbe25e76653622c93b99068268f10791a35a9dc2 are remote verified; this reconciliation completes the bounded publication tuple. The designer reply contains no continuation request, so no private elite Rhino candidate or other Rhino work is open; a fresh explicit continuation is required. The distinct outlined PNG remains review evidence only and does not authorize outline registration. Public Rhino registration, fixtures, effects, child assets, every Boss change, Runic Idol, release, accepted drift, and a pull request remain closed.',
});

export const EN_E10_REEDCREST_SKIRMISHER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'reedcrest-four-foot-watch', pose: 'idle', bob: 0, head: 0, horn: 'level', reach: 0, lateral: 0, stride: [0, 0, 0, 0] },
  { name: 'pale-blazed-head-settle', pose: 'idle', bob: 1, head: -1, horn: 'level', reach: 0, lateral: 0, stride: [0, 0, 0, 0] },
]);

const WALK_PHASES = deepFreeze([
  { name: 'near-fore-far-hind-reed-plant', pose: 'walk', bob: 0, head: 0, horn: 'level', reach: 0, lateral: 0, stride: [-1, 1, 0, -1] },
  { name: 'forward-shoulder-ridge-shift', pose: 'walk', bob: -1, head: 1, horn: 'level', reach: 0, lateral: 1, stride: [0, 1, -1, 0] },
  { name: 'far-fore-near-hind-reed-plant', pose: 'walk', bob: 0, head: 0, horn: 'level', reach: 0, lateral: 0, stride: [1, -1, 0, 1] },
  { name: 'lean-barrel-weight-switch', pose: 'walk', bob: 1, head: -1, horn: 'level', reach: 0, lateral: -1, stride: [0, -1, 1, 0] },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'four-three-toed-foot-sweep-plant', pose: 'brace', bob: 0, head: 0, horn: 'level', reach: 0, lateral: 0, stride: [-1, 0, 1, 0] },
  { name: 'body-owned-lateral-feint', pose: 'feint', bob: 0, head: -1, horn: 'draw', reach: 0, lateral: 1, stride: [-1, 1, 1, -1] },
  { name: 'controlled-rising-horn-sweep', pose: 'sweep', bob: -1, head: -1, horn: 'sweep', reach: -1, lateral: -1, stride: [-1, 1, 1, -1] },
  { name: 'effect-free-reedcrest-recover', pose: 'recover', bob: 1, head: 0, horn: 'level', reach: 0, lateral: 0, stride: [0, -1, -1, 0] },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-reedcrest-recoil', pose: 'hurt', bob: -1, head: 1, horn: 'level', reach: 0, lateral: -1, stride: [0, 0, 0, 0], flash: true },
  { name: 'colored-four-three-toed-foot-brace', pose: 'hurt-brace', bob: 1, head: 0, horn: 'level', reach: -1, lateral: 1, stride: [-1, 1, 1, -1], flash: false },
]);

function createPixels() { return new Array(SIZE * SIZE).fill(null); }

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert([x, y, width, height].every(Number.isInteger) && width > 0 && height > 0, 'Reedcrest Skirmisher geometry must use positive integers.');
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Reedcrest Skirmisher pixels must remain inside 24x24.');
      pixels[(py * SIZE) + px] = fill;
    }
  };
  return { rect, dot(x, y, fill) { rect(x, y, 1, 1, fill); } };
}

function drawSideLegs(paint, bodyY, stride) {
  const positions = [5, 9, 14, 18];
  for (let index = 0; index < positions.length; index++) {
    const footX = positions[index];
    const upperX = Math.max(5, Math.min(19, footX + stride[index]));
    const legY = 14 + bodyY;
    const anchorX = Math.max(7, Math.min(20, upperX));
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
  const lift = mode === 'sweep' ? -1 : mode === 'draw' ? 1 : 0;
  const hornY = headY + lift;
  paint.rect(headX + 1, hornY, 4, 2, COLORS.horn[1]);
  paint.rect(Math.max(1, headX - 1), hornY - 1, 4, 2, COLORS.horn[0]);
  paint.rect(Math.max(1, headX - 2), hornY - 2, 2, 2, COLORS.horn[2]);
  paint.dot(headX + 5, headY - 1, COLORS.horn[1]);
}

function drawSide(paint, phase) {
  const y = phase.bob;
  const headX = Math.max(1, 2 + phase.reach);
  const headY = 8 + y + phase.head;

  paint.rect(7, 7 + y, 15, 8, COLORS.hide[0]);
  paint.rect(7, 6 + y, 5, 5, COLORS.hide[2]);
  paint.rect(9, 7 + y, 3, 3, COLORS.plate[2]);
  paint.rect(14, 8 + y, 3, 3, COLORS.plate[0]);
  paint.rect(19, 9 + y, 3, 3, COLORS.plate[1]);
  paint.rect(10, 13 + y, 9, 3, COLORS.belly[0]);
  paint.rect(12, 9 + y, 1, 5, COLORS.reed[0]);
  paint.rect(16, 11 + y, 3, 2, COLORS.reed[1]);

  paint.rect(7, headY + 1, 4, 5, COLORS.hide[2]);
  paint.rect(headX + 2, headY, 7, 5, COLORS.muzzle[0]);
  paint.rect(headX, headY + 2, 7, 3, COLORS.muzzle[2]);
  paint.rect(headX + 5, headY, 1, 3, COLORS.reed[0]);
  paint.rect(headX + 7, headY - 1, 2, 2, COLORS.ear[0]);
  paint.dot(headX + 8, headY - 2, COLORS.ear[1]);
  drawSideHorn(paint, headX, headY, phase.horn);
  paint.dot(headX + 6, headY + 2, COLORS.eye);
  paint.dot(headX + 1, headY + 3, COLORS.feature);

  paint.rect(21, 10 + y, 2, 2, COLORS.hide[0]);
  paint.rect(22, 11 + y, 1, 3, COLORS.hide[1]);
  drawSideLegs(paint, y, phase.stride);
}

function drawFrontHorn(paint, x, headTop, mode) {
  const lift = mode === 'sweep' ? -1 : mode === 'draw' ? 1 : 0;
  const hornTop = headTop + 3 + lift;
  paint.rect(11 + x, hornTop, 3, 2, COLORS.horn[1]);
  paint.rect(12 + x, hornTop + 1, 1, mode === 'sweep' ? 5 : 4, COLORS.horn[0]);
  paint.dot(12 + x, hornTop + (mode === 'sweep' ? 5 : 4), COLORS.horn[2]);
  paint.dot(12 + x, headTop + 1, COLORS.horn[1]);
}

function drawDown(paint, phase) {
  const y = phase.bob;
  const x = phase.lateral;
  const headTop = 8 + y + phase.head;

  paint.rect(4 + x, 7 + y, 17, 9, COLORS.hide[0]);
  paint.rect(5 + x, 6 + y, 6, 5, COLORS.hide[2]);
  paint.rect(7 + x, 7 + y, 3, 3, COLORS.plate[2]);
  paint.rect(12 + x, 8 + y, 3, 3, COLORS.plate[0]);
  paint.rect(17 + x, 9 + y, 3, 3, COLORS.plate[1]);
  paint.rect(6 + x, 13 + y, 13, 4, COLORS.belly[0]);
  paint.rect(8 + x, 10 + y, 1, 4, COLORS.reed[0]);
  paint.rect(15 + x, 11 + y, 3, 2, COLORS.reed[1]);
  paint.rect(8 + x, headTop, 9, 6, COLORS.muzzle[0]);
  paint.rect(9 + x, headTop + 2, 7, 5, COLORS.muzzle[2]);
  paint.rect(12 + x, headTop, 1, 3, COLORS.reed[0]);
  paint.rect(6 + x, headTop - 1, 3, 2, COLORS.ear[0]);
  paint.rect(16 + x, headTop - 1, 3, 2, COLORS.ear[0]);
  paint.dot(7 + x, headTop - 2, COLORS.ear[1]);
  paint.dot(17 + x, headTop - 2, COLORS.ear[1]);
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

  paint.rect(4 + x, 7 + y, 17, 9, COLORS.hide[0]);
  paint.rect(5 + x, 6 + y, 6, 5, COLORS.hide[2]);
  paint.rect(7 + x, 7 + y, 3, 3, COLORS.plate[2]);
  paint.rect(12 + x, 8 + y, 3, 3, COLORS.plate[0]);
  paint.rect(17 + x, 9 + y, 3, 3, COLORS.plate[1]);
  paint.rect(6 + x, 13 + y, 13, 4, COLORS.hide[1]);
  paint.rect(8 + x, headTop, 9, 6, COLORS.muzzle[0]);
  paint.rect(9 + x, headTop + 2, 7, 4, COLORS.plate[1]);
  paint.rect(12 + x, headTop, 1, 3, COLORS.reed[1]);
  paint.rect(6 + x, headTop - 1, 3, 2, COLORS.ear[1]);
  paint.rect(16 + x, headTop - 1, 3, 2, COLORS.ear[1]);
  paint.rect(8 + x, 10 + y, 1, 4, COLORS.reed[0]);
  paint.rect(15 + x, 11 + y, 3, 2, COLORS.reed[1]);
  paint.rect(11 + x, 14 + y, 3, 3, COLORS.belly[1]);
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
  if (animation === 'death') { assert(frame >= 0 && frame < 4, 'Frame ' + frame + ' is invalid for death.'); return HURT_PHASES[EN_E10_REEDCREST_SKIRMISHER_DEATH_SOURCE_FRAMES[frame]]; }
  throw new TypeError('Animation ' + animation + ' is not implemented for Reedcrest Skirmisher.');
}

function buildPixels(direction, animation, frame) {
  const phase = phaseFor(animation, frame);
  const canonical = direction === 'right' ? 'left' : direction;
  const pixels = createPixels();
  const paint = painter(pixels);
  if (canonical === 'down') drawDown(paint, phase);
  else if (canonical === 'up') drawUp(paint, phase);
  else if (canonical === 'left') drawSide(paint, phase);
  else throw new TypeError('Unsupported Reedcrest Skirmisher direction ' + direction + '.');
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

export function renderEnE10ReedcrestSkirmisherFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Reedcrest Skirmisher rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Reedcrest Skirmisher direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'rhino', variant: 'reedcrest-skirmisher', direction, animation, frame,
    phase: phase.name,
    reedcrestSkirmisherGate: EN_E10_REEDCREST_SKIRMISHER_GATE.id,
    architectureDecision: EN_E10_RHINO_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E10_MUDPLATE_GRAZER_GATE.id,
    actorTopology: EN_E10_REEDCREST_SKIRMISHER_DATA.actorTopology,
    childAssetCount: EN_E10_REEDCREST_SKIRMISHER_DATA.childAssets.length,
    alphaPolicy: EN_E10_REEDCREST_SKIRMISHER_DATA.alphaPolicy,
    effectBoundary: EN_E10_REEDCREST_SKIRMISHER_DATA.effectBoundary,
  });
}

export const EN_E10_REEDCREST_SKIRMISHER_RENDERER = deepFreeze({
  key: 'en-e10-rhino-reedcrest-skirmisher-v1',
  chassis: EN_E10_REEDCREST_SKIRMISHER_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'rhino', 'The EN-E10 Reedcrest Skirmisher renderer is restricted to Rhino.');
    assert(variant.id === 'reedcrest-skirmisher', 'The EN-E10 Reedcrest Skirmisher renderer is restricted to Reedcrest Skirmisher.');
    return renderEnE10ReedcrestSkirmisherFrame(context, direction, animation.id, frame);
  },
});

const REEDCREST_SKIRMISHER_VARIANT = deepFreeze({
  id: 'reedcrest-skirmisher',
  name: 'Reedcrest Skirmisher',
  role: EN_E10_REEDCREST_SKIRMISHER_CONTRACT.role,
  status: EN_E10_REEDCREST_SKIRMISHER_CONTRACT.state,
  brief: 'A private complete specialist Rhino with a lean slate-teal low barrel, forward shoulder wedge, rust natural ridges, pale reed blaze and bars, pointed ears, medium upswept sand-ivory horn and tiny nub, amber eyes, short tail, four legs, four broad three-toed feet, and a planted sidestep into a controlled rising horn sweep; all effects remain external.',
  rendererData: EN_E10_REEDCREST_SKIRMISHER_DATA,
});

export const EN_E10_REEDCREST_SKIRMISHER_FAMILY = deepFreeze({
  id: 'rhino',
  name: 'Rhino Reedcrest Skirmisher Review',
  sliceId: 'EN-E10',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E10_REEDCREST_SKIRMISHER_CONTRACT.chassis,
  rendererKey: EN_E10_REEDCREST_SKIRMISHER_RENDERER.key,
  variants: [REEDCREST_SKIRMISHER_VARIANT],
  rendererData: {
    contractCard: EN_E10_RHINO_SPECIALIST_CONTRACT_CARD.id,
    architectureDecision: EN_E10_RHINO_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E10_MUDPLATE_GRAZER_GATE.id,
    activeGate: EN_E10_REEDCREST_SKIRMISHER_GATE.id,
  },
  review: {
    baselineVariant: 'reedcrest-skirmisher',
    scale: 8,
    notes: 'Visually approved as one exact private specialist Rhino against approved Mudplate Grazer and Frostvein Wayfinder plus public Dire Wolf, with the protected Furious Depraved Rhino Boss direction and full-animation candidates reviewed separately and unchanged. Accepted implementation 2f02388f941088f0fdadff809c3b048ba2e93734, approval record c0ab513f576f0e66cafcc0b36a3467b13e790936, and initial published handoff bbe25e76653622c93b99068268f10791a35a9dc2 are remote verified; this reconciliation completes the bounded publication tuple. The distinct Complete B outlined PNG remains review evidence only. The designer reply contains no continuation request, so no private elite Rhino candidate or other Rhino work is open; keep public or outline registration, fixtures, effects, child assets, every Boss change, deferred Runic Idol, release, accepted drift, and a pull request separate.',
  },
});

export const EN_E10_REEDCREST_SKIRMISHER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E10_REEDCREST_SKIRMISHER_RENDERER],
  families: [EN_E10_REEDCREST_SKIRMISHER_FAMILY],
});
