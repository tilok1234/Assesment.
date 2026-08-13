import { SIZE } from './catalogs.js';
import { createEnemyExpansionRegistry, ENEMY_EXPANSION_STATES } from './enemy-expansion.js';
import { EN_E10_CRAGCROWN_PATRIARCH_GATE } from './enemy-expansion-en-e10-ram-cragcrown-patriarch.js';

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
  fur: ['#985f35', '#583426', '#c4874e'],
  face: ['#4a2e24', '#21191a', '#765044'],
  antler: ['#b7a17d', '#6b5b49', '#e2ceaa'],
  belly: ['#d1ba90', '#867154', '#efd5a9'],
  moss: ['#657148', '#3b492f'],
  ear: ['#9a5953', '#593034'],
  hoof: '#171519',
  feature: '#100d0d',
  eye: '#efb84a',
  flash: '#f4f4f4',
});

export const EN_E10_STAG_TOPOLOGY_DECISION = deepFreeze({
  id: 'en-e10-stag-actor-topology-v1',
  sliceId: 'EN-E10',
  family: 'stag',
  status: 'selected',
  selected: 'baked-single-actor-antlered-grounded-quadruped',
  selectedOn: '2026-08-13',
  approvalEvidence: 'After the complete Ram family was approved, published, reconciled, and remote verified at 6d7f7b32733a1a7f8ca16a79ef06b72c17a246ca, the designer said: letsdo nex t. The topology recommendation was one connected 24x24 cervid with a lean barrel, high shoulders, long upright neck, tapered muzzle, paired ears, short tail, four split hooves, and two connected branching antlers; the body owns a head-lowering antler sweep while trails, leaves, impacts, and glow remain external. The designer replied: approved. This selects only baked-single-actor-antlered-grounded-quadruped and authorizes exactly one private common Stag candidate. It does not authorize public or outline registration, fixtures, effects, child assets, specialist or elite Stag, Mammoth, Rhino, Rhino Boss work, Runic Idol, release, accepted drift, or a pull request.',
  alternatives: [
    'baked-single-actor-antlered-grounded-quadruped',
    'body-plus-detached-antler-child-assets',
    'equine-chassis-with-cosmetic-antler-overlay',
  ],
  childAssets: [],
  effectBoundary: 'The baked actor owns only its connected fur, face, ears, eyes, branching antlers, neck, barrel, tail, legs, and split hooves. Dust, grass, leaves, pollen, antler arcs, trails, impacts, debris, particles, projectiles, glow, and illumination remain external.',
});

export const EN_E10_STAG_CONTRACT_CARD = deepFreeze({
  id: 'en-e10-stag-mossrack-forager-v1',
  sliceId: 'EN-E10',
  family: 'stag',
  familyName: 'Stag',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingFamily: {
    id: 'ram',
    variant: 'cragcrown-patriarch',
    status: 'approved-published-reconciled',
    gateId: EN_E10_CRAGCROWN_PATRIARCH_GATE.id,
  },
  activeVariant: {
    id: 'mossrack-forager',
    name: 'Mossrack Forager',
    role: 'common',
    status: 'implemented-full-approved',
  },
  deferredRoles: ['specialist', 'elite'],
  actorTopology: EN_E10_STAG_TOPOLOGY_DECISION.selected,
  styleContract: 'Use chunky one-to-three-pixel hard-alpha forms for a lean cervid: high shoulders, long upright neck, narrow dark muzzle, two connected weathered-bone branching antlers, paired ears, a short cream-tipped tail, four slender legs, and four separated split hooves. Preserve the readable face and rack in every colored view. Avoid broad fleece, curled Ram horns, horse proportions, canine posture, humanoid anatomy, detached components, or baked effects.',
  effectBoundary: EN_E10_STAG_TOPOLOGY_DECISION.effectBoundary,
});

export const EN_E10_MOSSRACK_FORAGER_CONTRACT = deepFreeze({
  sliceId: 'EN-E10',
  family: 'stag',
  variant: 'mossrack-forager',
  role: 'common',
  state: 'implemented-complete-motion-approved',
  topology: EN_E10_STAG_TOPOLOGY_DECISION.selected,
  chassis: 'baked-single-actor-lean-russet-high-shouldered-long-necked-tapered-muzzle-branching-antlered-four-split-hoof-stag-v1',
  silhouette: 'A lean high-shouldered Stag with a narrow barrel, long upright neck, tapered dark muzzle, paired ears, two tall connected branching antlers, short cream-tipped tail, four slender legs, and four separated split hooves. It must remain a cervid rather than the broad full-ring-horned Cragcrown Ram, bowed equine Miremane Courser, long-backed Dire Wolf, upright Goatfolk, Mammoth, or Rhino.',
  visualIdentity: 'Warm russet hide, copper shoulder light, dark chestnut face and lower legs, weathered-bone branching antlers, birch-cream throat and belly, muted moss lichen markings, rose-brown ears, amber eyes, and near-black split hooves establish a woodland forager. Every mark belongs to the body; leaves, dust, grass, pollen, antler trails, impacts, particles, glow, and illumination remain external.',
  effectBoundary: EN_E10_STAG_CONTRACT_CARD.effectBoundary,
});

export const EN_E10_MOSSRACK_FORAGER_DATA = deepFreeze({
  actor: {
    species: 'authored-stag-common',
    bodyBuild: 'lean-high-shouldered-long-necked-four-split-hoof-cervid',
    skin: 'russet-copper-hide',
    hairStyle: 'connected-birch-throat-and-short-tail-tip',
    hairColor: 'birch-cream',
    expression: 'alert-amber-forager-gaze',
    faceDetail: 'tapered-dark-muzzle-rose-ears-amber-eyes-and-connected-branching-bone-antlers',
    headgear: 'body-owned-weathered-bone-branching-antlers',
    outfit: 'body-owned-birch-belly-and-muted-moss-lichen-markings',
    outfitColor: 'russet-copper-chestnut-bone-birch-moss-rose-and-amber',
    outfitTier: 'tier1',
    weapon: 'body-owned-head-lower-antler-sweep',
    weaponTier: 'none',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.fur,
      hair: COLORS.face,
      outfit: COLORS.belly,
    },
  },
  mossrackForager: COLORS,
  actorTopology: EN_E10_STAG_TOPOLOGY_DECISION.selected,
  childAssets: [],
  alphaPolicy: 'binary-single-component-lean-russet-high-shouldered-long-necked-tapered-muzzle-connected-branching-antlers-short-tail-four-slender-legs-and-four-grounded-split-hooves',
  effectBoundary: EN_E10_STAG_CONTRACT_CARD.effectBoundary,
  bakedEffects: [],
});

export const EN_E10_MOSSRACK_FORAGER_GATE = deepFreeze({
  id: 'en-e10-stag-mossrack-forager-full-v1',
  status: 'approved',
  baseCheckpoint: '6d7f7b32733a1a7f8ca16a79ef06b72c17a246ca',
  authorizedOn: '2026-08-13',
  authorizationEvidence: 'The exact Cragcrown Patriarch implementation 3d8727cce7d8b3f00ce8923ee9db629de13e1097, approval record 8b2cc029a94eaeae69dc1a0f4886dd899dfc6902, initial published handoff 46645d2a2a84bc0669f0f5e5f4362da93abf0782, and final reconciliation 6d7f7b32733a1a7f8ca16a79ef06b72c17a246ca were pushed and remote verified. The designer then said: letsdo nex t. After the exact topology recommendation, the designer replied: approved. This selects baked-single-actor-antlered-grounded-quadruped and authorizes exactly one private common Stag full 80-frame candidate. Continue the distinct Complete B outlined PNG as review evidence only; it does not authorize outline registration. Public Stag registration, fixtures, effects, child assets, specialist or elite Stag, Mammoth, Rhino, Rhino Boss work, Runic Idol, release, accepted drift, and a pull request remain closed.',
  architectureDecision: EN_E10_STAG_TOPOLOGY_DECISION.id,
  approvedOn: '2026-08-13',
  approvalEvidence: 'The exact labeled all-four-direction raw/no-outline, distinct Complete B outlined, Complete B + Form, and approved Cragcrown Patriarch and Miremane Courser plus public Dire Wolf comparison PNGs were frozen with both synchronized GIF hashes. The four-lane Aseprite MCP review window reported those exact four paths open together as raw sprite 99, outlined sprite 103, Complete B + Form sprite 107, and active comparison sprite 111. The final approval prompt posted all four exact PNGs, both synchronized GIFs, and candidate digest c3383941492c1976bc03786f73fee20744d0a2af9e8846f44cbf9d59b7384d36. The designer replied: approved lets do next. Approval applies only to that exact Mossrack Forager digest and its six frozen review hashes. The lets do next suffix separately authorizes exactly one private specialist Stag only after this common Stag publication tuple is clean and remote verified. It does not authorize public Stag or outline registration, fixtures, effects, child assets, elite Stag, Mammoth, Rhino, Rhino Boss work, Runic Idol, release, accepted drift, a pull request, or any broader gate.',
  approvedImplementation: '4c5d80901d12063b21c0d6303fc24260bd700209',
  publicationAuthorizedOn: '2026-08-13',
  publicationAuthorizationEvidence: 'The designer previously said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact frozen artifact or digest. It does not authorize registration, fixtures, effects, child assets, later roles or families, release, accepted drift, or a pull request.',
  publishedImplementation: '4c5d80901d12063b21c0d6303fc24260bd700209',
  publishedApprovalRecord: '328a9b188ddd6e5db6144f2fdb253f8d9599e12d',
  initialPublishedHandoff: '',
  publicationState: 'published-awaiting-handoff-reconciliation',
  precedingApproval: {
    gateId: EN_E10_CRAGCROWN_PATRIARCH_GATE.id,
    artifactSha256: EN_E10_CRAGCROWN_PATRIARCH_GATE.artifactSha256,
    outlinedArtifactSha256: EN_E10_CRAGCROWN_PATRIARCH_GATE.outlinedArtifactSha256,
    assembledArtifactSha256: EN_E10_CRAGCROWN_PATRIARCH_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E10_CRAGCROWN_PATRIARCH_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E10_CRAGCROWN_PATRIARCH_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E10_CRAGCROWN_PATRIARCH_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E10_CRAGCROWN_PATRIARCH_GATE.candidateFrameDigest,
    publishedImplementation: EN_E10_CRAGCROWN_PATRIARCH_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E10_CRAGCROWN_PATRIARCH_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E10_CRAGCROWN_PATRIARCH_GATE.initialPublishedHandoff,
    currentReconciliation: '6d7f7b32733a1a7f8ca16a79ef06b72c17a246ca',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e10-stag-mossrack-forager/en-e10-stag-mossrack-forager-full-suite-raw.png',
  artifactSha256: '4238f2741eee51be3d64c546ccd7be94b4b82413d704689fc67a494041bff990',
  outlinedArtifact: 'enemy-expansion-review/en-e10-stag-mossrack-forager/en-e10-stag-mossrack-forager-full-suite-outlined-complete-b.png',
  outlinedArtifactSha256: 'f49a0a417df05aac07b85499e156997cb2f792287d08d99da95ef5f2c64209cf',
  assembledArtifact: 'enemy-expansion-review/en-e10-stag-mossrack-forager/en-e10-stag-mossrack-forager-full-suite-complete-b-form.png',
  assembledArtifactSha256: 'b6362bf1127e710ed988c6b00634ade853e391c8e69ec949b0ce47fa3a485025',
  comparisonArtifact: 'enemy-expansion-review/en-e10-stag-mossrack-forager/en-e10-stag-mossrack-forager-family-comparison.png',
  comparisonArtifactSha256: 'cbb7e0a0b285fed6be331e1e689a758594ca0d9719c4ee41445074fa906107f4',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e10-stag-mossrack-forager/en-e10-stag-mossrack-forager-full-suite-four-directions-labeled.gif',
      sha256: '8821d26a27f193fce26d425f7062cd3c4874e57eda8d34b0294b27e0c15f7bc3', width: 640, height: 672, frames: 4, durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e10-stag-mossrack-forager/en-e10-stag-mossrack-forager-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: 'a769fb6ff61d894fbdd2a9129c2e253669e9cc6f5be97a1d641370b5c69d0a6f', width: 640, height: 672, frames: 4, durationMs: 180,
    },
  },
  candidateFrameDigest: 'c3383941492c1976bc03786f73fee20744d0a2af9e8846f44cbf9d59b7384d36',
  cragcrownComparisonDigest: EN_E10_CRAGCROWN_PATRIARCH_GATE.candidateFrameDigest,
  miremaneComparisonDigest: '6efd596731a468be7647ee37f048046072bad289f209926e4db862cb63b01f32',
  direWolfComparisonDigest: 'a94a66ee380cfcb91db3907a3a049dae4b59357870857c3ed31be259bb1f1579',
  scope: 'One complete 80-frame Mossrack Forager common Stag across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle raises and settles the connected branching rack over an alert four-hoof stance. Walk uses four light alternating split-hoof phases while the high shoulders, long neck, face, and rack remain readable. Attack braces, lowers the connected head and antlers, performs one body-owned antler sweep with no trail or impact pixels, and recovers. Hurt uses a complete white recoil and colored four-hoof brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline board, distinct Complete B outlined board, Complete B + Form board, synchronized raw and Complete B + Form GIFs, and approved Cragcrown Patriarch, approved Miremane Courser, and public Dire Wolf comparisons together.',
  exclusions: [
    'changes to approved Cragcrown Patriarch or Miremane Courser rendered pixels',
    'changes to public Dire Wolf pixels',
    'public Stag registration or outline registration',
    'public catalog or facade exposure',
    'asset-pack fixture or manifest changes',
    'schema, shared renderer, exporter, validator, or frame-contract changes',
    'detached antlers, ears, tail, or child assets',
    'new Cast pixels or new Death pixels',
    'dust, grass, leaves, pollen, antler arcs, trails, impacts, debris, particles, projectiles, glow, illumination, or effects',
    'specialist or elite Stag variants',
    'Mammoth or Rhino',
    'Furious Depraved Rhino Boss changes',
    'Runic Idol or other EN-E09 work',
    'release, accepted drift, or pull request',
  ],
  nextGate: 'The exact Mossrack Forager implementation 4c5d80901d12063b21c0d6303fc24260bd700209 and approval record 328a9b188ddd6e5db6144f2fdb253f8d9599e12d are remote verified. Only the initial published handoff and final reconciliation remain open. After that tuple is clean and remote verified, the designer reply approved lets do next authorizes exactly one private specialist Stag under the selected topology. The distinct outlined PNG remains review evidence only and does not authorize outline registration. Public Stag registration, fixtures, effects, child assets, elite Stag, Mammoth, Rhino, Rhino Boss work, Runic Idol, release, accepted drift, and a pull request remain closed.',
});

export const EN_E10_MOSSRACK_FORAGER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'alert-connected-rack-lift', pose: 'idle', bob: 0, head: 0, rack: 0, reach: 0, lateral: 0, stride: [0, 0, 0, 0] },
  { name: 'mossrack-forager-settle', pose: 'idle', bob: 1, head: 0, rack: 1, reach: 0, lateral: 0, stride: [0, 0, 0, 0] },
]);

const WALK_PHASES = deepFreeze([
  { name: 'near-fore-far-hind-light-plant', pose: 'walk', bob: 0, head: 0, rack: 0, reach: 0, lateral: 0, stride: [-1, 1, 0, -1] },
  { name: 'high-shoulder-forward-rise', pose: 'walk', bob: -1, head: 0, rack: 1, reach: 0, lateral: 1, stride: [0, 1, -1, 0] },
  { name: 'far-fore-near-hind-light-plant', pose: 'walk', bob: 0, head: 1, rack: 0, reach: 0, lateral: 0, stride: [1, -1, 0, 1] },
  { name: 'split-hoof-switch-and-settle', pose: 'walk', bob: 1, head: 0, rack: 1, reach: 0, lateral: -1, stride: [0, -1, 1, 0] },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'four-split-hoof-alert-brace', pose: 'brace', bob: 1, head: 0, rack: 0, reach: 0, lateral: 0, stride: [-1, 0, 1, 0] },
  { name: 'connected-head-and-rack-lower', pose: 'lower', bob: 0, head: 2, rack: 0, reach: -1, lateral: -1, stride: [-1, 1, 1, -1] },
  { name: 'body-owned-antler-sweep', pose: 'sweep', bob: -1, head: 3, rack: 1, reach: -2, lateral: 1, stride: [-1, 1, 1, -1] },
  { name: 'effect-free-long-neck-recover', pose: 'recover', bob: 0, head: 1, rack: 0, reach: 0, lateral: 0, stride: [0, -1, -1, 0] },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-mossrack-recoil', pose: 'hurt', bob: -1, head: 1, rack: 0, reach: 0, lateral: -1, stride: [0, 0, 0, 0], flash: true },
  { name: 'colored-four-split-hoof-brace', pose: 'hurt-brace', bob: 1, head: 2, rack: 1, reach: -1, lateral: 1, stride: [-1, 1, 1, -1], flash: false },
]);

function createPixels() {
  return new Array(SIZE * SIZE).fill(null);
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert([x, y, width, height].every(Number.isInteger) && width > 0 && height > 0, 'Mossrack Forager geometry must use positive integers.');
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Mossrack Forager pixels must remain inside 24x24.');
      pixels[(py * SIZE) + px] = fill;
    }
  };
  return { rect, dot(x, y, fill) { rect(x, y, 1, 1, fill); } };
}

function drawSideLegs(paint, bodyY, stride) {
  const positions = [6, 10, 15, 20];
  for (let index = 0; index < positions.length; index++) {
    const footX = positions[index];
    const upperX = footX + stride[index];
    const legY = 15 + bodyY + (index === 0 || index === 3 ? 1 : 0);
    const anchorX = Math.max(7, Math.min(20, upperX));
    paint.rect(Math.min(anchorX, upperX), legY, Math.abs(anchorX - upperX) + 1, 1, index < 2 ? COLORS.face[0] : COLORS.fur[1]);
    paint.rect(upperX, legY, 1, 19 - legY, index < 2 ? COLORS.face[0] : COLORS.fur[1]);
    paint.rect(Math.min(footX, upperX), 18, Math.abs(footX - upperX) + 1, 1, COLORS.face[1]);
    paint.rect(footX, 18, 1, 3, COLORS.face[1]);
    paint.rect(footX, 21, 3, 1, COLORS.hoof);
    paint.dot(footX, 22, COLORS.hoof);
    paint.dot(footX + 2, 22, COLORS.hoof);
  }
}

function drawEndLegs(paint, bodyY, stride, lateral) {
  const positions = [4, 9, 14, 19];
  for (let index = 0; index < positions.length; index++) {
    const footX = positions[index];
    const step = stride[index] > 0 ? 1 : stride[index] < 0 ? -1 : 0;
    const upperX = footX + lateral + step;
    const rear = index === 0 || index === 3;
    const legY = 15 + bodyY + (rear ? 1 : 0);
    const anchorX = Math.max(6 + lateral, Math.min(18 + lateral, upperX));
    paint.rect(Math.min(anchorX, upperX), legY, Math.abs(anchorX - upperX) + 1, 1, rear ? COLORS.fur[1] : COLORS.face[0]);
    paint.rect(upperX, legY, 1, 20 - legY, rear ? COLORS.fur[1] : COLORS.face[0]);
    paint.rect(Math.min(footX, upperX), 19, Math.abs(footX - upperX) + 1, 1, COLORS.face[1]);
    paint.rect(footX, 19, 1, 2, COLORS.face[1]);
    paint.rect(footX, 21, 3, 1, COLORS.hoof);
    paint.dot(footX, 22, COLORS.hoof);
    paint.dot(footX + 2, 22, COLORS.hoof);
  }
}

function drawSideRack(paint, baseX, headY, rackShift) {
  const top = Math.max(1, headY - 4 + rackShift);
  paint.rect(baseX, top + 3, 2, Math.max(3, headY - top - 1), COLORS.antler[0]);
  paint.rect(baseX - 2, top + 3, 4, 1, COLORS.antler[2]);
  paint.rect(baseX - 2, top + 1, 1, 3, COLORS.antler[1]);
  paint.rect(baseX + 1, top + 3, 4, 1, COLORS.antler[0]);
  paint.rect(baseX + 4, top + 2, 4, 1, COLORS.antler[1]);
  paint.rect(baseX + 7, top + 1, 2, 1, COLORS.antler[2]);
  paint.rect(baseX + 3, top + 1, 1, 3, COLORS.antler[2]);
  paint.rect(baseX + 6, top, 1, 3, COLORS.antler[0]);
  paint.rect(baseX + 8, top, 1, 2, COLORS.antler[1]);
  paint.dot(baseX, top + 4, COLORS.antler[2]);
}

function drawSide(paint, phase) {
  const y = phase.bob;
  const headX = Math.max(1, 3 + phase.reach);
  const headY = 5 + y + phase.head;

  paint.rect(8, 9 + y, 11, 7, COLORS.fur[0]);
  paint.rect(9, 8 + y, 9, 3, COLORS.fur[2]);
  paint.rect(10, 14 + y, 9, 3, COLORS.belly[0]);
  paint.rect(17, 11 + y, 4, 5, COLORS.fur[1]);
  paint.rect(7, 8 + y, 5, 8, COLORS.fur[0]);
  paint.rect(7, 6 + y + Math.floor(phase.head / 2), 4, 8, COLORS.fur[2]);
  paint.rect(6, 7 + y + Math.floor(phase.head / 2), 3, 7, COLORS.belly[2]);

  paint.rect(headX + 2, headY, 5, 4, COLORS.face[0]);
  paint.rect(headX, headY + 2, 6, 3, COLORS.face[1]);
  paint.rect(headX + 1, headY + 4, 5, 2, COLORS.face[2]);
  paint.rect(headX + 5, headY + 2, 3, 4, COLORS.fur[2]);
  drawSideRack(paint, headX + 6, headY, phase.rack);
  paint.rect(headX + 6, headY - 1, 2, 3, COLORS.ear[0]);
  paint.dot(headX + 7, headY - 1, COLORS.ear[1]);

  paint.rect(20, 11 + y, 2, 3, COLORS.fur[0]);
  paint.rect(21, 9 + y, 2, 3, COLORS.belly[2]);
  paint.rect(12, 10 + y, 3, 2, COLORS.moss[0]);
  paint.rect(15, 11 + y, 3, 2, COLORS.moss[1]);
  paint.dot(17, 13 + y, COLORS.moss[0]);
  paint.rect(10, 14 + y, 2, 2, COLORS.belly[2]);

  drawSideLegs(paint, y, phase.stride);

  paint.dot(headX, headY + 3, COLORS.feature);
  paint.rect(headX + 2, headY + 5, 3, 1, COLORS.feature);
  paint.dot(headX + 5, headY + 1, COLORS.eye);
}

function drawFrontRack(paint, x, headTop, rackShift) {
  const top = Math.max(1, headTop - 4 + rackShift);
  const shankHeight = Math.max(4, headTop - top + 1);
  paint.rect(9 + x, top + 3, 1, shankHeight, COLORS.antler[0]);
  paint.rect(14 + x, top + 3, 1, shankHeight, COLORS.antler[0]);
  paint.rect(6 + x, top + 3, 4, 1, COLORS.antler[2]);
  paint.rect(6 + x, top + 2, 1, 2, COLORS.antler[0]);
  paint.rect(3 + x, top + 2, 4, 1, COLORS.antler[1]);
  paint.rect(2 + x, top, 1, 3, COLORS.antler[2]);
  paint.rect(5 + x, top, 1, 3, COLORS.antler[0]);
  paint.rect(8 + x, top + 1, 1, 3, COLORS.antler[1]);
  paint.rect(14 + x, top + 3, 4, 1, COLORS.antler[2]);
  paint.rect(17 + x, top + 2, 1, 2, COLORS.antler[0]);
  paint.rect(17 + x, top + 2, 4, 1, COLORS.antler[1]);
  paint.rect(21 + x, top, 1, 3, COLORS.antler[2]);
  paint.rect(18 + x, top, 1, 3, COLORS.antler[0]);
  paint.rect(15 + x, top + 1, 1, 3, COLORS.antler[1]);
}

function drawDown(paint, phase) {
  const y = phase.bob;
  const x = phase.lateral;
  const headTop = 5 + y + phase.head;

  paint.rect(7 + x, 9 + y, 11, 8, COLORS.fur[0]);
  paint.rect(8 + x, 8 + y, 9, 4, COLORS.fur[2]);
  paint.rect(8 + x, 14 + y, 9, 4, COLORS.belly[0]);
  paint.rect(9 + x, 6 + y + Math.floor(phase.head / 2), 7, 9, COLORS.fur[2]);
  paint.rect(10 + x, 9 + y + Math.floor(phase.head / 2), 5, 7, COLORS.belly[2]);
  paint.rect(8 + x, headTop, 9, 5, COLORS.face[0]);
  paint.rect(9 + x, headTop + 2, 7, 5, COLORS.face[1]);
  paint.rect(10 + x, headTop + 5, 5, 2, COLORS.face[2]);
  paint.rect(7 + x, headTop + 1, 2, 3, COLORS.ear[0]);
  paint.rect(16 + x, headTop + 1, 2, 3, COLORS.ear[0]);
  paint.dot(7 + x, headTop + 2, COLORS.ear[1]);
  paint.dot(17 + x, headTop + 2, COLORS.ear[1]);
  drawFrontRack(paint, x, headTop, phase.rack);

  paint.rect(17 + x, 11 + y, 4, 3, COLORS.fur[1]);
  paint.rect(19 + x, 9 + y, 2, 3, COLORS.belly[2]);
  paint.rect(8 + x, 13 + y, 3, 2, COLORS.moss[0]);
  paint.rect(14 + x, 13 + y, 3, 2, COLORS.moss[0]);
  paint.dot(10 + x, 15 + y, COLORS.moss[1]);
  paint.dot(15 + x, 15 + y, COLORS.moss[1]);
  paint.dot(10 + x, headTop + 2, COLORS.eye);
  paint.dot(14 + x, headTop + 2, COLORS.eye);
  paint.dot(10 + x, headTop + 5, COLORS.feature);
  paint.dot(14 + x, headTop + 5, COLORS.feature);
  paint.rect(11 + x, headTop + 6, 3, 1, COLORS.feature);
  drawEndLegs(paint, y, phase.stride, x);
}

function drawUp(paint, phase) {
  const y = phase.bob;
  const x = phase.lateral;
  const headTop = 5 + y + phase.head;

  paint.rect(7 + x, 9 + y, 11, 8, COLORS.fur[0]);
  paint.rect(8 + x, 8 + y, 9, 4, COLORS.fur[2]);
  paint.rect(8 + x, 14 + y, 9, 4, COLORS.fur[1]);
  paint.rect(9 + x, 6 + y + Math.floor(phase.head / 2), 7, 9, COLORS.fur[2]);
  paint.rect(8 + x, headTop, 9, 6, COLORS.face[0]);
  paint.rect(9 + x, headTop + 2, 7, 5, COLORS.fur[1]);
  paint.rect(7 + x, headTop + 1, 2, 3, COLORS.ear[1]);
  paint.rect(16 + x, headTop + 1, 2, 3, COLORS.ear[1]);
  drawFrontRack(paint, x, headTop, phase.rack);

  paint.rect(17 + x, 11 + y, 4, 3, COLORS.fur[1]);
  paint.rect(19 + x, 9 + y, 2, 3, COLORS.belly[2]);
  paint.rect(9 + x, 11 + y, 3, 2, COLORS.moss[0]);
  paint.rect(13 + x, 12 + y, 3, 2, COLORS.moss[1]);
  paint.rect(11 + x, 14 + y, 3, 3, COLORS.belly[2]);
  paint.dot(12 + x, 14 + y, COLORS.moss[0]);
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
    return HURT_PHASES[EN_E10_MOSSRACK_FORAGER_DEATH_SOURCE_FRAMES[frame]];
  }
  throw new TypeError('Animation ' + animation + ' is not implemented for Mossrack Forager.');
}

function buildPixels(direction, animation, frame) {
  const phase = phaseFor(animation, frame);
  const canonical = direction === 'right' ? 'left' : direction;
  const pixels = createPixels();
  const paint = painter(pixels);
  if (canonical === 'down') drawDown(paint, phase);
  else if (canonical === 'up') drawUp(paint, phase);
  else if (canonical === 'left') drawSide(paint, phase);
  else throw new TypeError('Unsupported Mossrack Forager direction ' + direction + '.');
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

export function renderEnE10MossrackForagerFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Mossrack Forager rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Mossrack Forager direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'stag',
    variant: 'mossrack-forager',
    direction,
    animation,
    frame,
    phase: phase.name,
    mossrackForagerGate: EN_E10_MOSSRACK_FORAGER_GATE.id,
    architectureDecision: EN_E10_STAG_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E10_CRAGCROWN_PATRIARCH_GATE.id,
    actorTopology: EN_E10_MOSSRACK_FORAGER_DATA.actorTopology,
    childAssetCount: EN_E10_MOSSRACK_FORAGER_DATA.childAssets.length,
    alphaPolicy: EN_E10_MOSSRACK_FORAGER_DATA.alphaPolicy,
    effectBoundary: EN_E10_MOSSRACK_FORAGER_DATA.effectBoundary,
  });
}

export const EN_E10_MOSSRACK_FORAGER_RENDERER = deepFreeze({
  key: 'en-e10-stag-mossrack-forager-v1',
  chassis: EN_E10_MOSSRACK_FORAGER_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'stag', 'The EN-E10 Mossrack Forager renderer is restricted to Stag.');
    assert(variant.id === 'mossrack-forager', 'The EN-E10 Mossrack Forager renderer is restricted to Mossrack Forager.');
    return renderEnE10MossrackForagerFrame(context, direction, animation.id, frame);
  },
});

const MOSSRACK_FORAGER_VARIANT = deepFreeze({
  id: 'mossrack-forager',
  name: 'Mossrack Forager',
  role: EN_E10_MOSSRACK_FORAGER_CONTRACT.role,
  status: EN_E10_MOSSRACK_FORAGER_CONTRACT.state,
  brief: 'A private complete common Stag with a lean russet barrel, high copper shoulders, long birch throat, tapered chestnut muzzle, connected weathered-bone branching rack, moss lichen markings, paired rose ears, amber eyes, short cream-tipped tail, four slender legs, four dark split hooves, and a body-owned head-lowering antler sweep; all effects remain external.',
  rendererData: EN_E10_MOSSRACK_FORAGER_DATA,
});

export const EN_E10_MOSSRACK_FORAGER_FAMILY = deepFreeze({
  id: 'stag',
  name: 'Stag Mossrack Forager Review',
  sliceId: 'EN-E10',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E10_MOSSRACK_FORAGER_CONTRACT.chassis,
  rendererKey: EN_E10_MOSSRACK_FORAGER_RENDERER.key,
  variants: [MOSSRACK_FORAGER_VARIANT],
  rendererData: {
    contractCard: EN_E10_STAG_CONTRACT_CARD.id,
    architectureDecision: EN_E10_STAG_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E10_CRAGCROWN_PATRIARCH_GATE.id,
    activeGate: EN_E10_MOSSRACK_FORAGER_GATE.id,
  },
  review: {
    baselineVariant: 'mossrack-forager',
    scale: 8,
    notes: 'Visually approved as one exact common Stag against approved Cragcrown Patriarch, approved Miremane Courser, and public Dire Wolf. Implementation 4c5d80901d12063b21c0d6303fc24260bd700209 and approval record 328a9b188ddd6e5db6144f2fdb253f8d9599e12d are remote verified. Only the initial published handoff and final reconciliation remain open. After that tuple is clean and remote verified, the designer reply approved lets do next opens exactly one private specialist Stag. The packet includes a distinct Complete B outlined PNG as review evidence only. Keep outline registration, public registration, fixtures, effects, child assets, elite Stag, Mammoth, Rhino, Rhino Boss work, deferred Runic Idol, release, accepted drift, and a pull request separate.',
  },
});

export const EN_E10_MOSSRACK_FORAGER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E10_MOSSRACK_FORAGER_RENDERER],
  families: [EN_E10_MOSSRACK_FORAGER_FAMILY],
});
