import { SIZE } from './catalogs.js';
import { createEnemyExpansionRegistry, ENEMY_EXPANSION_STATES } from './enemy-expansion.js';
import {
  EN_E10_STAG_TOPOLOGY_DECISION,
  EN_E10_STAG_CONTRACT_CARD,
  EN_E10_MOSSRACK_FORAGER_GATE,
} from './enemy-expansion-en-e10-stag-mossrack-forager.js';

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
  fur: ['#536a62', '#273b38', '#789489'],
  face: ['#303848', '#151c24', '#596578'],
  antler: ['#c9bd9a', '#776e5e', '#eee1b5'],
  belly: ['#b4c5ae', '#667b70', '#dce6c8'],
  bramble: ['#684c72', '#3b2d4c'],
  ear: ['#7a536f', '#412d48'],
  hoof: '#13181a',
  feature: '#0d1217',
  eye: '#65e4d0',
  flash: '#f4f4f4',
});

export const EN_E10_BRIARSTEP_HARRIER_CONTRACT = deepFreeze({
  sliceId: 'EN-E10',
  family: 'stag',
  variant: 'briarstep-harrier',
  role: 'specialist',
  state: 'implemented-complete-motion-approved',
  topology: EN_E10_STAG_TOPOLOGY_DECISION.selected,
  chassis: 'baked-single-actor-sleek-slate-green-high-chested-long-legged-swept-rack-four-split-hoof-stag-v1',
  silhouette: 'A sleek high-chested specialist Stag with a tucked narrow barrel, long angled neck, compact tapered muzzle, paired swept ears, two long connected swept-back branching antlers, a short pale flag tail, four high-stepping legs, and four separated split hooves. It must remain distinct from the warmer upright-racked Mossrack Forager, bowed equine Miremane Courser, long-backed Dire Wolf, broad Ram, Mammoth, and Rhino silhouettes.',
  visualIdentity: 'Dusk slate-green hide, deep blue-charcoal face and lower legs, long pale-ivory swept antlers, a cool pale throat and belly, dusk-violet bramble bands, plum ears, cyan eyes, and near-black split hooves establish a fast woodland harrier. Every mark belongs to the body; leaves, thorns, dust, grass, pollen, antler trails, impacts, particles, glow, and illumination remain external.',
  effectBoundary: EN_E10_STAG_CONTRACT_CARD.effectBoundary,
});

export const EN_E10_BRIARSTEP_HARRIER_DATA = deepFreeze({
  actor: {
    species: 'authored-stag-specialist',
    bodyBuild: 'sleek-high-chested-tucked-barrel-long-legged-four-split-hoof-cervid',
    skin: 'dusk-slate-green-hide',
    hairStyle: 'connected-pale-throat-and-short-flag-tail-tip',
    hairColor: 'cool-pale-sage',
    expression: 'focused-cyan-harrier-gaze',
    faceDetail: 'compact-dark-muzzle-plum-ears-cyan-eyes-and-connected-swept-ivory-branching-antlers',
    headgear: 'body-owned-long-swept-ivory-branching-antlers',
    outfit: 'body-owned-pale-belly-and-dusk-violet-bramble-bands',
    outfitColor: 'slate-green-blue-charcoal-ivory-pale-sage-violet-plum-and-cyan',
    outfitTier: 'tier2',
    weapon: 'body-owned-lateral-feint-into-low-antler-rake',
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
  briarstepHarrier: COLORS,
  actorTopology: EN_E10_STAG_TOPOLOGY_DECISION.selected,
  childAssets: [],
  alphaPolicy: 'binary-single-component-sleek-slate-green-high-chested-tucked-barrel-long-angled-neck-compact-muzzle-connected-swept-branching-antlers-short-flag-tail-four-long-legs-and-four-grounded-split-hooves',
  effectBoundary: EN_E10_STAG_CONTRACT_CARD.effectBoundary,
  bakedEffects: [],
});

export const EN_E10_BRIARSTEP_HARRIER_GATE = deepFreeze({
  id: 'en-e10-stag-briarstep-harrier-full-v1',
  status: 'approved',
  baseCheckpoint: '67331ed1a160c8e62df0c9941b7c051ab5d0b228',
  authorizedOn: '2026-08-13',
  authorizationEvidence: 'The exact Mossrack Forager implementation 4c5d80901d12063b21c0d6303fc24260bd700209, approval record 328a9b188ddd6e5db6144f2fdb253f8d9599e12d, initial published handoff b8e67f2ddc12a71e3b25c33997a1ffed0329b7f4, and final reconciliation 67331ed1a160c8e62df0c9941b7c051ab5d0b228 were pushed and remote verified. The designer approval reply was: approved lets do next. Its lets do next suffix authorizes exactly one private specialist Stag full 80-frame candidate under the selected baked-single-actor-antlered-grounded-quadruped topology. Continue the distinct Complete B outlined PNG as review evidence only; it does not authorize outline registration. Public Stag registration, fixtures, effects, child assets, elite Stag, Mammoth, Rhino, Rhino Boss work, Runic Idol, release, accepted drift, a pull request, and every broader art gate remain closed.',
  architectureDecision: EN_E10_STAG_TOPOLOGY_DECISION.id,
  approvedOn: '2026-08-13',
  approvalEvidence: 'The exact labeled all-four-direction raw/no-outline, distinct Complete B outlined, Complete B + Form, and approved Mossrack Forager and Miremane Courser plus public Dire Wolf comparison PNGs were frozen with both synchronized GIF hashes. The four-lane Aseprite MCP review window reported those exact four paths open together as raw sprite 115, outlined sprite 119, Complete B + Form sprite 123, and active comparison sprite 127. The final approval prompt posted all four exact PNGs, both synchronized GIFs, and candidate digest fb352a405be53536a2304eb8ad97ef7e03f0819519607a8a0afea16e81f97457. The designer replied: approved. Approval applies only to that exact Briarstep Harrier digest and its six frozen review hashes. It does not authorize public Stag or outline registration, fixtures, effects, child assets, elite Stag, Mammoth, Rhino, Rhino Boss work, Runic Idol, release, accepted drift, a pull request, or any broader gate.',
  approvedImplementation: '8d52dc26d9d361c5d95603276a4a88b3978a585e',
  publicationAuthorizedOn: '2026-08-13',
  publicationAuthorizationEvidence: 'The designer previously said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact frozen artifact or digest. It does not authorize registration, fixtures, effects, child assets, later roles or families, release, accepted drift, or a pull request.',
  publishedImplementation: '',
  publishedApprovalRecord: '',
  initialPublishedHandoff: '',
  publicationState: 'approved-not-published',
  precedingApproval: {
    gateId: EN_E10_MOSSRACK_FORAGER_GATE.id,
    artifactSha256: EN_E10_MOSSRACK_FORAGER_GATE.artifactSha256,
    outlinedArtifactSha256: EN_E10_MOSSRACK_FORAGER_GATE.outlinedArtifactSha256,
    assembledArtifactSha256: EN_E10_MOSSRACK_FORAGER_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E10_MOSSRACK_FORAGER_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E10_MOSSRACK_FORAGER_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E10_MOSSRACK_FORAGER_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E10_MOSSRACK_FORAGER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E10_MOSSRACK_FORAGER_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E10_MOSSRACK_FORAGER_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E10_MOSSRACK_FORAGER_GATE.initialPublishedHandoff,
    currentReconciliation: '67331ed1a160c8e62df0c9941b7c051ab5d0b228',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e10-stag-briarstep-harrier/en-e10-stag-briarstep-harrier-full-suite-raw.png',
  artifactSha256: '3874a2be78c6cf49d956da8cad4dea0273bd64df4a905b49ea6a10bbaa34ebcc',
  outlinedArtifact: 'enemy-expansion-review/en-e10-stag-briarstep-harrier/en-e10-stag-briarstep-harrier-full-suite-outlined-complete-b.png',
  outlinedArtifactSha256: '18c2ead46605c7530511a076ecbcf0f6cf2f630b94bdf9504449cec6794164a8',
  assembledArtifact: 'enemy-expansion-review/en-e10-stag-briarstep-harrier/en-e10-stag-briarstep-harrier-full-suite-complete-b-form.png',
  assembledArtifactSha256: 'd0c075c28d6ed0a52620e54195435c477f41a13ac71205c34b281ec6817ec8cb',
  comparisonArtifact: 'enemy-expansion-review/en-e10-stag-briarstep-harrier/en-e10-stag-briarstep-harrier-family-comparison.png',
  comparisonArtifactSha256: 'f58ced45ebe96fb7e42bfb29118024e7e2a4b4d0461e287ad522d093d3bcc866',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e10-stag-briarstep-harrier/en-e10-stag-briarstep-harrier-full-suite-four-directions-labeled.gif',
      sha256: '6172ddb391750d318e8fc263e6a53a34492dd723beb53ad6bf10d07b8cad1e13', width: 640, height: 672, frames: 4, durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e10-stag-briarstep-harrier/en-e10-stag-briarstep-harrier-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '523e4c3a8462d02a95398fa8df8c056b932c157ee834d18c10042092eea3ccc5', width: 640, height: 672, frames: 4, durationMs: 180,
    },
  },
  candidateFrameDigest: 'fb352a405be53536a2304eb8ad97ef7e03f0819519607a8a0afea16e81f97457',
  mossrackComparisonDigest: EN_E10_MOSSRACK_FORAGER_GATE.candidateFrameDigest,
  miremaneComparisonDigest: '6efd596731a468be7647ee37f048046072bad289f209926e4db862cb63b01f32',
  direWolfComparisonDigest: 'a94a66ee380cfcb91db3907a3a049dae4b59357870857c3ed31be259bb1f1579',
  scope: 'One complete 80-frame Briarstep Harrier specialist Stag across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle lifts and settles the long connected swept rack over a high-chested four-hoof stance. Walk uses four quick high-stepping split-hoof phases while the angled neck, compact face, and swept rack remain readable. Attack braces, makes a body-owned lateral feint, lowers the connected head and antlers into one low antler rake with no trail or impact pixels, and recovers. Hurt uses a complete white recoil and colored four-hoof brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline board, distinct Complete B outlined board, Complete B + Form board, synchronized raw and Complete B + Form GIFs, and approved Mossrack Forager, approved Miremane Courser, and public Dire Wolf comparisons together.',
  exclusions: [
    'changes to approved Mossrack Forager or Miremane Courser rendered pixels',
    'changes to public Dire Wolf pixels',
    'public Stag registration or outline registration',
    'public catalog or facade exposure',
    'asset-pack fixture or manifest changes',
    'schema, shared renderer, exporter, validator, or frame-contract changes',
    'detached antlers, ears, tail, or child assets',
    'new Cast pixels or new Death pixels',
    'dust, grass, leaves, pollen, antler arcs, trails, impacts, debris, particles, projectiles, glow, illumination, or effects',
    'elite Stag variants',
    'Mammoth or Rhino',
    'Furious Depraved Rhino Boss changes',
    'Runic Idol or other EN-E09 work',
    'release, accepted drift, or pull request',
  ],
  nextGate: 'The exact Briarstep Harrier packet is visually approved at implementation 8d52dc26d9d361c5d95603276a4a88b3978a585e. Standing publication permission opens only its approval record, branch push, and bounded handoff reconciliation. No next Stag art gate is open. The distinct outlined PNG remains review evidence only and does not authorize outline registration. Public Stag registration, fixtures, effects, child assets, elite Stag, Mammoth, Rhino, Rhino Boss work, Runic Idol, release, accepted drift, and a pull request remain closed.',
});

export const EN_E10_BRIARSTEP_HARRIER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'high-chested-swept-rack-watch', pose: 'idle', bob: 0, head: 0, rack: 0, reach: 0, lateral: 0, stride: [0, 0, 0, 0] },
  { name: 'briarstep-low-breath-settle', pose: 'idle', bob: 1, head: 0, rack: 1, reach: 0, lateral: 0, stride: [0, 0, 0, 0] },
]);

const WALK_PHASES = deepFreeze([
  { name: 'near-fore-far-hind-quick-plant', pose: 'walk', bob: 0, head: 0, rack: 0, reach: 0, lateral: 0, stride: [-1, 1, 0, -1] },
  { name: 'long-leg-high-step-rise', pose: 'walk', bob: -1, head: 0, rack: 1, reach: 0, lateral: 1, stride: [0, 1, -1, 0] },
  { name: 'far-fore-near-hind-quick-plant', pose: 'walk', bob: 0, head: 1, rack: 0, reach: 0, lateral: 0, stride: [1, -1, 0, 1] },
  { name: 'split-hoof-switch-low-settle', pose: 'walk', bob: 1, head: 0, rack: 1, reach: 0, lateral: -1, stride: [0, -1, 1, 0] },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'four-split-hoof-feint-brace', pose: 'brace', bob: 0, head: 0, rack: 0, reach: 0, lateral: -1, stride: [-1, 0, 1, 0] },
  { name: 'body-owned-lateral-feint', pose: 'feint', bob: -1, head: 1, rack: 0, reach: -1, lateral: 1, stride: [-1, 1, 1, -1] },
  { name: 'connected-low-antler-rake', pose: 'rake', bob: 0, head: 3, rack: 1, reach: -2, lateral: -1, stride: [-1, 1, 1, -1] },
  { name: 'effect-free-high-step-recover', pose: 'recover', bob: 0, head: 1, rack: 0, reach: 0, lateral: 0, stride: [0, -1, -1, 0] },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-briarstep-recoil', pose: 'hurt', bob: -1, head: 1, rack: 0, reach: 0, lateral: -1, stride: [0, 0, 0, 0], flash: true },
  { name: 'colored-long-leg-four-hoof-brace', pose: 'hurt-brace', bob: 1, head: 2, rack: 1, reach: -1, lateral: 1, stride: [-1, 1, 1, -1], flash: false },
]);

function createPixels() {
  return new Array(SIZE * SIZE).fill(null);
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert([x, y, width, height].every(Number.isInteger) && width > 0 && height > 0, 'Briarstep Harrier geometry must use positive integers.');
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Briarstep Harrier pixels must remain inside 24x24.');
      pixels[(py * SIZE) + px] = fill;
    }
  };
  return { rect, dot(x, y, fill) { rect(x, y, 1, 1, fill); } };
}

function drawSideLegs(paint, bodyY, stride) {
  const positions = [7, 11, 16, 20];
  for (let index = 0; index < positions.length; index++) {
    const footX = positions[index];
    const upperX = footX + stride[index];
    const legY = 14 + bodyY + (index === 0 || index === 3 ? 1 : 0);
    const anchorX = Math.max(8, Math.min(20, upperX));
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
    const anchorX = Math.max(8 + lateral, Math.min(16 + lateral, upperX));
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
  paint.rect(baseX, top + 3, 1, Math.max(4, headY - top + 1), COLORS.antler[0]);
  paint.rect(baseX, top + 3, 5, 1, COLORS.antler[2]);
  paint.rect(baseX + 4, top + 2, 5, 1, COLORS.antler[0]);
  paint.rect(baseX + 8, top + 1, 4, 1, COLORS.antler[1]);
  paint.rect(baseX + 11, top, 1, 2, COLORS.antler[2]);
  paint.rect(baseX + 3, top + 1, 1, 3, COLORS.antler[1]);
  paint.rect(baseX + 6, top, 1, 3, COLORS.antler[2]);
  paint.rect(baseX + 9, top, 1, 2, COLORS.antler[0]);
  paint.dot(baseX, top + 4, COLORS.antler[2]);
}

function drawSide(paint, phase) {
  const y = phase.bob;
  const headX = Math.max(1, 2 + phase.reach);
  const headY = 5 + y + phase.head;

  paint.rect(9, 9 + y, 10, 6, COLORS.fur[0]);
  paint.rect(8, 8 + y, 5, 7, COLORS.fur[2]);
  paint.rect(11, 13 + y, 8, 3, COLORS.belly[0]);
  paint.rect(17, 10 + y, 4, 5, COLORS.fur[1]);
  paint.rect(8, 6 + y + Math.floor(phase.head / 2), 3, 8, COLORS.fur[2]);
  paint.rect(7, 8 + y + Math.floor(phase.head / 2), 2, 6, COLORS.belly[2]);

  paint.rect(headX + 2, headY + 1, 5, 3, COLORS.face[0]);
  paint.rect(headX, headY + 2, 5, 3, COLORS.face[1]);
  paint.rect(headX + 1, headY + 4, 4, 2, COLORS.face[2]);
  paint.rect(headX + 5, headY + 2, 4, 3, COLORS.fur[2]);
  drawSideRack(paint, headX + 6, headY, phase.rack);
  paint.rect(headX + 6, headY, 3, 2, COLORS.ear[0]);
  paint.dot(headX + 8, headY, COLORS.ear[1]);

  paint.rect(20, 10 + y, 2, 3, COLORS.fur[0]);
  paint.rect(21, 8 + y, 2, 3, COLORS.belly[2]);
  paint.rect(12, 9 + y, 2, 3, COLORS.bramble[0]);
  paint.rect(15, 10 + y, 2, 3, COLORS.bramble[1]);
  paint.dot(18, 12 + y, COLORS.bramble[0]);
  paint.rect(10, 13 + y, 2, 2, COLORS.belly[2]);

  drawSideLegs(paint, y, phase.stride);

  paint.dot(headX, headY + 3, COLORS.feature);
  paint.rect(headX + 2, headY + 5, 3, 1, COLORS.feature);
  paint.dot(headX + 5, headY + 1, COLORS.eye);
}

function drawFrontRack(paint, x, headTop, rackShift) {
  const top = Math.max(1, headTop - 4 + rackShift);
  const shankHeight = Math.max(4, headTop - top + 1);
  paint.rect(10 + x, top + 3, 1, shankHeight, COLORS.antler[0]);
  paint.rect(14 + x, top + 3, 1, shankHeight, COLORS.antler[0]);
  paint.rect(7 + x, top + 3, 4, 1, COLORS.antler[2]);
  paint.rect(5 + x, top + 2, 3, 1, COLORS.antler[0]);
  paint.rect(3 + x, top + 1, 3, 1, COLORS.antler[1]);
  paint.rect(3 + x, top, 1, 2, COLORS.antler[2]);
  paint.rect(6 + x, top, 1, 3, COLORS.antler[0]);
  paint.rect(9 + x, top + 1, 1, 3, COLORS.antler[1]);
  paint.rect(14 + x, top + 3, 4, 1, COLORS.antler[2]);
  paint.rect(17 + x, top + 2, 3, 1, COLORS.antler[0]);
  paint.rect(19 + x, top + 1, 3, 1, COLORS.antler[1]);
  paint.rect(21 + x, top + 1, 1, 2, COLORS.antler[2]);
  paint.rect(18 + x, top + 1, 1, 2, COLORS.antler[0]);
  paint.rect(15 + x, top + 1, 1, 3, COLORS.antler[1]);
}

function drawDown(paint, phase) {
  const y = phase.bob;
  const x = phase.lateral;
  const headTop = 5 + y + phase.head;

  paint.rect(8 + x, 9 + y, 9, 7, COLORS.fur[0]);
  paint.rect(9 + x, 8 + y, 7, 4, COLORS.fur[2]);
  paint.rect(9 + x, 13 + y, 7, 4, COLORS.belly[0]);
  paint.rect(10 + x, 6 + y + Math.floor(phase.head / 2), 5, 9, COLORS.fur[2]);
  paint.rect(11 + x, 9 + y + Math.floor(phase.head / 2), 3, 7, COLORS.belly[2]);
  paint.rect(9 + x, headTop + 1, 7, 4, COLORS.face[0]);
  paint.rect(10 + x, headTop + 3, 5, 4, COLORS.face[1]);
  paint.rect(11 + x, headTop + 5, 3, 2, COLORS.face[2]);
  paint.rect(7 + x, headTop + 2, 3, 2, COLORS.ear[0]);
  paint.rect(15 + x, headTop + 2, 3, 2, COLORS.ear[0]);
  paint.dot(7 + x, headTop + 2, COLORS.ear[1]);
  paint.dot(17 + x, headTop + 2, COLORS.ear[1]);
  drawFrontRack(paint, x, headTop, phase.rack);

  paint.rect(17 + x, 10 + y, 3, 3, COLORS.fur[1]);
  paint.rect(19 + x, 8 + y, 2, 3, COLORS.belly[2]);
  paint.rect(8 + x, 12 + y, 2, 3, COLORS.bramble[0]);
  paint.rect(15 + x, 12 + y, 2, 3, COLORS.bramble[0]);
  paint.dot(10 + x, 14 + y, COLORS.bramble[1]);
  paint.dot(14 + x, 14 + y, COLORS.bramble[1]);
  paint.dot(10 + x, headTop + 3, COLORS.eye);
  paint.dot(14 + x, headTop + 3, COLORS.eye);
  paint.dot(11 + x, headTop + 5, COLORS.feature);
  paint.dot(13 + x, headTop + 5, COLORS.feature);
  paint.rect(11 + x, headTop + 6, 3, 1, COLORS.feature);
  drawEndLegs(paint, y, phase.stride, x);
}

function drawUp(paint, phase) {
  const y = phase.bob;
  const x = phase.lateral;
  const headTop = 5 + y + phase.head;

  paint.rect(8 + x, 9 + y, 9, 7, COLORS.fur[0]);
  paint.rect(9 + x, 8 + y, 7, 4, COLORS.fur[2]);
  paint.rect(9 + x, 13 + y, 7, 4, COLORS.fur[1]);
  paint.rect(10 + x, 6 + y + Math.floor(phase.head / 2), 5, 9, COLORS.fur[2]);
  paint.rect(9 + x, headTop + 1, 7, 5, COLORS.face[0]);
  paint.rect(10 + x, headTop + 3, 5, 4, COLORS.fur[1]);
  paint.rect(7 + x, headTop + 2, 3, 2, COLORS.ear[1]);
  paint.rect(15 + x, headTop + 2, 3, 2, COLORS.ear[1]);
  drawFrontRack(paint, x, headTop, phase.rack);

  paint.rect(17 + x, 10 + y, 3, 3, COLORS.fur[1]);
  paint.rect(19 + x, 8 + y, 2, 3, COLORS.belly[2]);
  paint.rect(9 + x, 11 + y, 2, 3, COLORS.bramble[0]);
  paint.rect(14 + x, 12 + y, 2, 3, COLORS.bramble[1]);
  paint.rect(11 + x, 13 + y, 3, 3, COLORS.belly[2]);
  paint.dot(12 + x, 13 + y, COLORS.bramble[0]);
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
    return HURT_PHASES[EN_E10_BRIARSTEP_HARRIER_DEATH_SOURCE_FRAMES[frame]];
  }
  throw new TypeError('Animation ' + animation + ' is not implemented for Briarstep Harrier.');
}

function buildPixels(direction, animation, frame) {
  const phase = phaseFor(animation, frame);
  const canonical = direction === 'right' ? 'left' : direction;
  const pixels = createPixels();
  const paint = painter(pixels);
  if (canonical === 'down') drawDown(paint, phase);
  else if (canonical === 'up') drawUp(paint, phase);
  else if (canonical === 'left') drawSide(paint, phase);
  else throw new TypeError('Unsupported Briarstep Harrier direction ' + direction + '.');
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

export function renderEnE10BriarstepHarrierFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Briarstep Harrier rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Briarstep Harrier direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'stag',
    variant: 'briarstep-harrier',
    direction,
    animation,
    frame,
    phase: phase.name,
    briarstepHarrierGate: EN_E10_BRIARSTEP_HARRIER_GATE.id,
    architectureDecision: EN_E10_STAG_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E10_MOSSRACK_FORAGER_GATE.id,
    actorTopology: EN_E10_BRIARSTEP_HARRIER_DATA.actorTopology,
    childAssetCount: EN_E10_BRIARSTEP_HARRIER_DATA.childAssets.length,
    alphaPolicy: EN_E10_BRIARSTEP_HARRIER_DATA.alphaPolicy,
    effectBoundary: EN_E10_BRIARSTEP_HARRIER_DATA.effectBoundary,
  });
}

export const EN_E10_BRIARSTEP_HARRIER_RENDERER = deepFreeze({
  key: 'en-e10-stag-briarstep-harrier-v1',
  chassis: EN_E10_BRIARSTEP_HARRIER_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'stag', 'The EN-E10 Briarstep Harrier renderer is restricted to Stag.');
    assert(variant.id === 'briarstep-harrier', 'The EN-E10 Briarstep Harrier renderer is restricted to Briarstep Harrier.');
    return renderEnE10BriarstepHarrierFrame(context, direction, animation.id, frame);
  },
});

const BRIARSTEP_HARRIER_VARIANT = deepFreeze({
  id: 'briarstep-harrier',
  name: 'Briarstep Harrier',
  role: EN_E10_BRIARSTEP_HARRIER_CONTRACT.role,
  status: EN_E10_BRIARSTEP_HARRIER_CONTRACT.state,
  brief: 'A private complete specialist Stag with a sleek slate-green high chest, tucked barrel, long pale throat, compact blue-charcoal muzzle, connected swept ivory branching rack, violet bramble bands, plum ears, cyan eyes, short pale flag tail, four long legs, four dark split hooves, and a body-owned lateral feint into a low antler rake; all effects remain external.',
  rendererData: EN_E10_BRIARSTEP_HARRIER_DATA,
});

export const EN_E10_BRIARSTEP_HARRIER_FAMILY = deepFreeze({
  id: 'stag',
  name: 'Stag Briarstep Harrier Review',
  sliceId: 'EN-E10',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E10_BRIARSTEP_HARRIER_CONTRACT.chassis,
  rendererKey: EN_E10_BRIARSTEP_HARRIER_RENDERER.key,
  variants: [BRIARSTEP_HARRIER_VARIANT],
  rendererData: {
    contractCard: EN_E10_STAG_CONTRACT_CARD.id,
    architectureDecision: EN_E10_STAG_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E10_MOSSRACK_FORAGER_GATE.id,
    activeGate: EN_E10_BRIARSTEP_HARRIER_GATE.id,
  },
  review: {
    baselineVariant: 'briarstep-harrier',
    scale: 8,
    notes: 'Visually approved as one exact private specialist Stag against approved Mossrack Forager and Miremane Courser plus public Dire Wolf. Accepted implementation 8d52dc26d9d361c5d95603276a4a88b3978a585e records only the frozen packet. The distinct Complete B outlined PNG remains review evidence only. Standing permission opens only bounded approval publication and reconciliation; keep public or outline registration, fixtures, effects, child assets, elite Stag, later families, release, accepted drift, and a pull request separate.',
  },
});

export const EN_E10_BRIARSTEP_HARRIER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E10_BRIARSTEP_HARRIER_RENDERER],
  families: [EN_E10_BRIARSTEP_HARRIER_FAMILY],
});
