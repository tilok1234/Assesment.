import { SIZE } from './catalogs.js';
import { createEnemyExpansionRegistry, ENEMY_EXPANSION_STATES } from './enemy-expansion.js';
import {
  EN_E10_RAM_CONTRACT_CARD,
  EN_E10_RAM_TOPOLOGY_DECISION,
  EN_E10_STONECURL_GRAZER_GATE,
} from './enemy-expansion-en-e10-ram-stonecurl-grazer.js';

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
  wool: ['#65707c', '#414a57', '#8a96a0'],
  face: ['#343942', '#20252d', '#505964'],
  horn: ['#b9b0a0', '#716b65', '#ddd4c1'],
  belly: ['#aab4b7', '#727c83', '#d1d8d7'],
  mark: ['#9dc5bd', '#587d78'],
  ear: ['#8d5a69', '#543746'],
  hoof: '#1e2228',
  feature: '#13171c',
  eye: '#8fd7d2',
  flash: '#f4f4f4',
});

export const EN_E10_RAM_SPECIALIST_CONTRACT_CARD = deepFreeze({
  id: 'en-e10-ram-cliffcoil-strider-v1',
  sliceId: 'EN-E10',
  family: 'ram',
  familyName: 'Ram',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingVariant: {
    id: 'stonecurl-grazer',
    role: 'common',
    status: 'approved-published-reconciled',
    gateId: EN_E10_STONECURL_GRAZER_GATE.id,
  },
  activeVariant: {
    id: 'cliffcoil-strider',
    name: 'Cliffcoil Strider',
    role: 'specialist',
    status: 'implemented-full-approved',
  },
  deferredRoles: ['elite'],
  actorTopology: EN_E10_RAM_TOPOLOGY_DECISION.selected,
  styleContract: EN_E10_RAM_CONTRACT_CARD.styleContract,
  effectBoundary: EN_E10_RAM_CONTRACT_CARD.effectBoundary,
});

export const EN_E10_CLIFFCOIL_STRIDER_CONTRACT = deepFreeze({
  sliceId: 'EN-E10',
  family: 'ram',
  variant: 'cliffcoil-strider',
  role: 'specialist',
  state: 'implemented-complete-motion-approved',
  topology: EN_E10_RAM_TOPOLOGY_DECISION.selected,
  chassis: 'baked-single-actor-slim-slate-arched-neck-long-swept-horns-sure-foot-four-hoof-ram-v1',
  silhouette: 'A lean specialist Ram with a lifted slate fleece body, proud narrow neck, short dark wedge muzzle, two long connected swept-back coil horns, a connected pale beard and short raised tail, and four separated sure-foot hooves. It must remain a horned Ram while reading faster and narrower than Stonecurl Grazer and unlike the bowed Miremane Courser, long-backed Dire Wolf, upright Goatfolk, antlered Stag, or reduced Rhino Boss.',
  visualIdentity: 'Blue-slate fleece, a charcoal-blue face and lower legs, long limestone coil horns, cool pale belly and beard, sea-glass sure-foot chevrons, muted wine ear interiors, cyan eyes, and near-black hooves establish the cliff specialist. Dust, rock shards, horn arcs, impacts, particles, projectiles, glow, and illumination remain external.',
  effectBoundary: EN_E10_RAM_CONTRACT_CARD.effectBoundary,
});

export const EN_E10_CLIFFCOIL_STRIDER_DATA = deepFreeze({
  actor: {
    species: 'authored-ram-specialist',
    bodyBuild: 'lean-slate-lifted-neck-four-hoof-specialist',
    skin: 'blue-slate-fleece',
    hairStyle: 'connected-lifted-forehead-fleece-and-pale-beard',
    hairColor: 'blue-slate',
    expression: 'cyan-cliff-pathfinder-stare',
    faceDetail: 'short-charcoal-wedge-muzzle-wine-ears-cyan-eyes-and-long-swept-coil-horns',
    headgear: 'body-owned-limestone-swept-coil-horns',
    outfit: 'cool-pale-belly-beard-and-sea-glass-sure-foot-chevrons',
    outfitColor: 'slate-charcoal-limestone-sea-glass-wine-and-cyan',
    outfitTier: 'tier2',
    weapon: 'body-owned-sidestep-horn-charge',
    weaponTier: 'none',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.wool,
      hair: COLORS.face,
      outfit: COLORS.belly,
    },
  },
  cliffcoilStrider: COLORS,
  actorTopology: EN_E10_RAM_TOPOLOGY_DECISION.selected,
  childAssets: [],
  alphaPolicy: 'binary-single-component-lean-slate-arched-neck-wedge-muzzle-long-connected-swept-horns-beard-tail-and-four-grounded-hooves',
  effectBoundary: EN_E10_RAM_CONTRACT_CARD.effectBoundary,
  bakedEffects: [],
});

export const EN_E10_CLIFFCOIL_STRIDER_GATE = deepFreeze({
  id: 'en-e10-ram-cliffcoil-strider-full-v1',
  status: 'approved',
  baseCheckpoint: '67ba19086669b9135286784b6c9c39f682ca3032',
  authorizedOn: '2026-08-13',
  authorizationEvidence: 'The exact Stonecurl Grazer implementation 195c6ddf4c2f8d5345d18b3e1657bfab3f7a41b8, approval record c7757c1293bae90840735555e2670d7661bc9873, initial published handoff c278919b2830d7e8654bcb1bbd38f07db344d285, and final reconciliation 67ba19086669b9135286784b6c9c39f682ca3032 were pushed and remote verified. The handoff recorded that no next Ram art gate was open. The designer then separately said: lets do nex t. In the established common-specialist-elite cadence this authorizes exactly one private specialist Ram full 80-frame candidate under the already approved baked-single-actor-horned-grounded-quadruped topology. Continue the distinct Complete B outlined PNG as review evidence only; it does not authorize outline registration. Public Ram registration, fixtures, effects, child assets, elite Ram, Stag, Mammoth, Rhino, Rhino Boss work, Runic Idol, release, accepted drift, and a pull request remain closed.',
  architectureDecision: EN_E10_RAM_TOPOLOGY_DECISION.id,
  approvedOn: '2026-08-13',
  approvalEvidence: 'The exact labeled all-four-direction raw/no-outline, distinct Complete B outlined, Complete B + Form, and approved Stonecurl Grazer and Miremane Courser plus public Dire Wolf comparison PNGs were frozen with both synchronized GIF hashes. The four-lane Aseprite MCP review window reported those exact four paths open together as raw sprite 67, outlined sprite 71, Complete B + Form sprite 75, and active comparison sprite 79. The final approval prompt posted all four exact PNGs, both synchronized GIFs, and candidate digest 1ca2ce85dc6bd4b291e6ede4754f58c2a5bd4278b50acfb699926f9626dd9b29. The designer replied: approved. Approval applies only to that exact Cliffcoil Strider digest and its six frozen review hashes. It does not authorize public Ram or outline registration, fixtures, effects, child assets, elite Ram, Stag, Mammoth, Rhino, Rhino Boss work, Runic Idol, release, accepted drift, a pull request, or another art gate.',
  approvedImplementation: 'cb6c58440297b76f62776d8c11a6232d05bb1467',
  publicationAuthorizedOn: '2026-08-13',
  publicationAuthorizationEvidence: 'The designer previously said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact frozen artifact or digest. It does not authorize registration, fixtures, effects, child assets, later roles or families, release, accepted drift, or a pull request.',
  publishedImplementation: 'cb6c58440297b76f62776d8c11a6232d05bb1467',
  publishedApprovalRecord: '3b9b99e28a2c4787d76f3dc0def20f4a79b589ac',
  initialPublishedHandoff: '',
  publicationState: 'published-awaiting-handoff-reconciliation',
  precedingApproval: {
    gateId: EN_E10_STONECURL_GRAZER_GATE.id,
    artifactSha256: EN_E10_STONECURL_GRAZER_GATE.artifactSha256,
    outlinedArtifactSha256: EN_E10_STONECURL_GRAZER_GATE.outlinedArtifactSha256,
    assembledArtifactSha256: EN_E10_STONECURL_GRAZER_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E10_STONECURL_GRAZER_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E10_STONECURL_GRAZER_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E10_STONECURL_GRAZER_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E10_STONECURL_GRAZER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E10_STONECURL_GRAZER_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E10_STONECURL_GRAZER_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E10_STONECURL_GRAZER_GATE.initialPublishedHandoff,
    currentReconciliation: '67ba19086669b9135286784b6c9c39f682ca3032',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e10-ram-cliffcoil-strider/en-e10-ram-cliffcoil-strider-full-suite-raw.png',
  artifactSha256: '727f944bd748663326dbe208cbec36a3f4f6eb6aecf127265d59c318dc4c7006',
  outlinedArtifact: 'enemy-expansion-review/en-e10-ram-cliffcoil-strider/en-e10-ram-cliffcoil-strider-full-suite-outlined-complete-b.png',
  outlinedArtifactSha256: 'fcff74c278fa4f617cec277e7a7f229188a4debe0461be514ef61f898a16457e',
  assembledArtifact: 'enemy-expansion-review/en-e10-ram-cliffcoil-strider/en-e10-ram-cliffcoil-strider-full-suite-complete-b-form.png',
  assembledArtifactSha256: '735827ed4c89c80949c46f14a7db1de15fa2733b4fb94195e813d3653ea88b11',
  comparisonArtifact: 'enemy-expansion-review/en-e10-ram-cliffcoil-strider/en-e10-ram-cliffcoil-strider-family-comparison.png',
  comparisonArtifactSha256: 'e5e7a5fc056db1ad12b83c6f0b0ebc47bedfe395ae2d0f87dfa539654f261911',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e10-ram-cliffcoil-strider/en-e10-ram-cliffcoil-strider-full-suite-four-directions-labeled.gif',
      sha256: 'f44a277d8f69cbb374964f3b6325ae8af477d55af7bfb85eccac88480f7d6d30', width: 640, height: 672, frames: 4, durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e10-ram-cliffcoil-strider/en-e10-ram-cliffcoil-strider-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '1856759ae6b5f4b805587b7f9f764a37ec40dbc18b3e192f6ca93c12ecbcbf6f', width: 640, height: 672, frames: 4, durationMs: 180,
    },
  },
  candidateFrameDigest: '1ca2ce85dc6bd4b291e6ede4754f58c2a5bd4278b50acfb699926f9626dd9b29',
  stonecurlComparisonDigest: '79b440290b1c6f503834d44b13d2c9508b34ad48a4ae495c6e957e329095942f',
  miremaneComparisonDigest: '6efd596731a468be7647ee37f048046072bad289f209926e4db862cb63b01f32',
  direWolfComparisonDigest: 'a94a66ee380cfcb91db3907a3a049dae4b59357870857c3ed31be259bb1f1579',
  scope: 'One complete 80-frame Cliffcoil Strider specialist Ram across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle lifts and settles the long connected coil horns over a lean four-hoof cliff stance. Walk uses four alternating sure-foot diagonal hoof phases with the narrow torso and sea-glass markings readable. Attack braces laterally, cants the connected swept horns, drives one body-owned sidestep horn charge, and recovers without detached horns, dust, rock shards, arcs, debris, or impact pixels. Hurt uses a complete white recoil and colored wide four-hoof brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline board, distinct Complete B outlined board, Complete B + Form board, synchronized raw and Complete B + Form GIFs, and approved Stonecurl Grazer and Miremane Courser plus public Dire Wolf comparisons together.',
  exclusions: [
    'changes to approved Stonecurl Grazer rendered pixels',
    'changes to approved Miremane Courser or public Dire Wolf pixels',
    'public Ram registration or outline registration',
    'public catalog or facade exposure',
    'asset-pack fixture or manifest changes',
    'schema, shared renderer, exporter, validator, or frame-contract changes',
    'detached horns, beard, tail, or child assets',
    'new Cast pixels or new Death pixels',
    'dust, rock shards, horn arcs, impacts, debris, particles, projectiles, glow, illumination, or effects',
    'Ram elite',
    'Stag, Mammoth, or Rhino',
    'Furious Depraved Rhino Boss changes',
    'Runic Idol or other EN-E09 work',
    'release, accepted drift, or pull request',
  ],
  nextGate: 'The exact Cliffcoil Strider implementation cb6c58440297b76f62776d8c11a6232d05bb1467 and approval record 3b9b99e28a2c4787d76f3dc0def20f4a79b589ac are remote verified. Only the initial published handoff and final reconciliation remain open. No next Ram art gate is open. The distinct outlined PNG remains review evidence only and does not authorize outline registration. Public Ram registration, fixtures, effects, child assets, elite Ram, Stag, Mammoth, Rhino, Rhino Boss work, Runic Idol, release, accepted drift, and a pull request remain closed.',
});

export const EN_E10_CLIFFCOIL_STRIDER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'long-coil-horn-lift', pose: 'idle', bob: 0, head: 0, horn: -1, reach: 0, lateral: 0, stride: [0, 0, 0, 0] },
  { name: 'cliff-strider-settle', pose: 'idle', bob: 1, head: 1, horn: 0, reach: 0, lateral: 0, stride: [0, 0, 0, 0] },
]);

const WALK_PHASES = deepFreeze([
  { name: 'near-fore-far-hind-sure-step', pose: 'walk', bob: 0, head: 0, horn: -1, reach: 0, lateral: 0, stride: [-1, 1, 0, -1] },
  { name: 'cliff-edge-cross-step', pose: 'walk', bob: -1, head: 0, horn: 0, reach: 0, lateral: 1, stride: [0, 1, -1, 0] },
  { name: 'far-fore-near-hind-sure-step', pose: 'walk', bob: 0, head: 1, horn: 0, reach: 0, lateral: 0, stride: [1, -1, 0, 1] },
  { name: 'slate-fleece-switchback', pose: 'walk', bob: 1, head: 1, horn: -1, reach: 0, lateral: -1, stride: [0, -1, 1, 0] },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'cliffcoil-side-brace', pose: 'brace', bob: 0, head: 0, horn: -1, reach: 1, lateral: -1, stride: [-1, 0, 1, 0] },
  { name: 'connected-swept-horns-cant', pose: 'cant', bob: 1, head: 1, horn: 0, reach: 0, lateral: 1, stride: [-1, 0, 1, 0] },
  { name: 'body-owned-sidestep-horn-charge', pose: 'sidestep-charge', bob: 0, head: 1, horn: -1, reach: -1, lateral: 1, stride: [-1, 1, 1, -1] },
  { name: 'cliffcoil-recover', pose: 'recover', bob: 1, head: 1, horn: 0, reach: 0, lateral: 0, stride: [0, 0, 0, 0] },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-cliff-ram-recoil', pose: 'hurt', bob: -1, head: 0, horn: 0, reach: 1, lateral: -1, stride: [0, 0, 0, 0], flash: true },
  { name: 'colored-wide-sure-foot-brace', pose: 'hurt-brace', bob: 1, head: 2, horn: -1, reach: 0, lateral: 1, stride: [-1, 1, 1, -1], flash: false },
]);

function createPixels() {
  return new Array(SIZE * SIZE).fill(null);
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert([x, y, width, height].every(Number.isInteger) && width > 0 && height > 0, 'Cliffcoil Strider geometry must use positive integers.');
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Cliffcoil Strider pixels must remain inside 24x24.');
      pixels[(py * SIZE) + px] = fill;
    }
  };
  return { rect, dot(x, y, fill) { rect(x, y, 1, 1, fill); } };
}

function drawSideLegs(paint, bodyY, stride) {
  const positions = [5, 9, 15, 19];
  for (let index = 0; index < positions.length; index++) {
    const footX = positions[index];
    const upperX = footX + stride[index];
    const legY = 14 + bodyY;
    paint.rect(upperX, legY, 2, 3, index < 2 ? COLORS.face[0] : COLORS.wool[1]);
    paint.rect(Math.min(footX, upperX), legY + 1, Math.abs(footX - upperX) + 2, 1, COLORS.face[0]);
    paint.rect(footX, legY + 2, 1, 19 - legY, COLORS.face[1]);
    paint.dot(footX, 19, COLORS.mark[index % 2]);
    paint.rect(footX, 20, 1, 1, COLORS.belly[1]);
    paint.rect(footX, 21, 2, 2, COLORS.hoof);
  }
}

function drawEndLegs(paint, bodyY, stride, lateral) {
  const positions = [5, 9, 13, 17];
  for (let index = 0; index < positions.length; index++) {
    const footX = positions[index];
    const step = stride[index] > 0 ? 1 : stride[index] < 0 ? -1 : 0;
    const upperX = footX + lateral + step;
    const rearLeg = index === 0 || index === 3;
    const legY = 15 + bodyY + (rearLeg ? 1 : 0);
    const bodyMinX = 7 + lateral;
    const bodyMaxX = 17 + lateral;
    const anchorX = Math.max(bodyMinX, Math.min(bodyMaxX, upperX));
    paint.rect(Math.min(anchorX, upperX), legY, Math.abs(anchorX - upperX) + 2, 1, rearLeg ? COLORS.wool[1] : COLORS.face[0]);
    paint.rect(upperX, legY, 2, 3, rearLeg ? COLORS.wool[1] : COLORS.face[0]);
    paint.rect(Math.min(footX, upperX), legY + 1, Math.abs(footX - upperX) + 2, 1, COLORS.face[0]);
    paint.rect(footX, legY + 2, 1, 20 - legY, COLORS.face[1]);
    paint.dot(footX, 20, COLORS.mark[index % 2]);
    paint.rect(footX, 21, 2, 2, COLORS.hoof);
  }
}

function drawSide(paint, phase) {
  const y = phase.bob;
  const headX = Math.max(1, 2 + phase.reach);
  const faceY = 6 + phase.head;

  paint.rect(9, 8 + y, 11, 6, COLORS.wool[0]);
  paint.rect(10, 6 + y, 9, 4, COLORS.wool[2]);
  paint.rect(11, 10 + y, 8, 3, COLORS.wool[1]);
  paint.rect(11, 13 + y, 8, 3, COLORS.belly[0]);
  paint.rect(16, 9 + y, 5, 6, COLORS.wool[1]);
  paint.rect(6, 6 + y, 7, 10, COLORS.wool[0]);
  paint.rect(7, 10 + y, 5, 6, COLORS.belly[2]);
  paint.rect(7, 4 + y, 4, 4, COLORS.wool[2]);
  paint.rect(9, 3 + y, 5, 3, COLORS.wool[0]);
  paint.rect(11, 4 + y, 4, 3, COLORS.wool[2]);

  paint.rect(headX + 2, faceY, 6, 5, COLORS.face[0]);
  paint.rect(headX, faceY + 3, 6, 3, COLORS.face[1]);
  paint.rect(headX + 1, faceY + 5, 5, 2, COLORS.face[2]);
  paint.rect(headX + 5, faceY + 5, 3, 5, COLORS.belly[2]);
  paint.rect(headX + 6, faceY + 7, 2, 4, COLORS.belly[0]);

  const hornY = faceY - 3 + phase.horn;
  paint.rect(headX + 4, hornY, 6, 2, COLORS.horn[2]);
  paint.rect(headX + 8, hornY + 1, 5, 2, COLORS.horn[0]);
  paint.rect(headX + 11, hornY + 2, 2, 4, COLORS.horn[1]);
  paint.rect(headX + 8, hornY + 5, 4, 2, COLORS.horn[2]);
  paint.rect(headX + 6, hornY + 5, 2, 2, COLORS.horn[0]);

  paint.rect(19, 9 + y, 3, 3, COLORS.wool[0]);
  paint.rect(21, 7 + y, 2, 3, COLORS.wool[2]);
  paint.rect(13, 9 + y, 3, 1, COLORS.mark[0]);
  paint.rect(15, 10 + y, 2, 1, COLORS.mark[1]);
  paint.dot(8, 13 + y, COLORS.mark[0]);
  paint.dot(headX, faceY + 4, COLORS.feature);
  paint.rect(headX + 2, faceY + 6, 3, 1, COLORS.feature);
  paint.dot(headX + 7, faceY + 1, COLORS.ear[0]);
  paint.dot(headX + 8, faceY + 2, COLORS.ear[1]);
  paint.dot(headX + 6, faceY + 2, COLORS.eye);

  drawSideLegs(paint, y, phase.stride);
}

function drawDown(paint, phase) {
  const y = phase.bob;
  const x = phase.lateral;
  const headY = phase.head;
  const hornY = 3 + y + phase.horn;

  paint.rect(7 + x, 8 + y, 11, 7, COLORS.wool[0]);
  paint.rect(8 + x, 6 + y, 9, 5, COLORS.wool[2]);
  paint.rect(8 + x, 13 + y, 9, 4, COLORS.belly[0]);
  paint.rect(7 + x, 15 + y, 11, 2, COLORS.wool[1]);
  paint.rect(9 + x, 3 + y, 6, 4, COLORS.wool[2]);
  paint.rect(8 + x, 5 + headY, 8, 8, COLORS.face[0]);
  paint.rect(9 + x, 9 + headY, 6, 4, COLORS.face[1]);
  paint.rect(10 + x, 11 + headY, 4, 3, COLORS.face[2]);
  paint.rect(10 + x, 12 + y, 4, 5, COLORS.belly[2]);

  paint.rect(3 + x, hornY, 5, 2, COLORS.horn[2]);
  paint.rect(2 + x, hornY + 1, 2, 5, COLORS.horn[0]);
  paint.rect(3 + x, hornY + 5, 5, 2, COLORS.horn[1]);
  paint.rect(7 + x, hornY + 4, 3, 3, COLORS.horn[2]);
  paint.rect(16 + x, hornY, 5, 2, COLORS.horn[2]);
  paint.rect(20 + x, hornY + 1, 2, 5, COLORS.horn[0]);
  paint.rect(16 + x, hornY + 5, 5, 2, COLORS.horn[1]);
  paint.rect(14 + x, hornY + 4, 3, 3, COLORS.horn[2]);

  paint.rect(18 + x, 10 + y, 3, 2, COLORS.wool[1]);
  paint.rect(20 + x, 8 + y, 2, 3, COLORS.wool[2]);
  paint.rect(8 + x, 13 + y, 3, 1, COLORS.mark[0]);
  paint.rect(14 + x, 13 + y, 3, 1, COLORS.mark[0]);
  paint.dot(9 + x, 14 + y, COLORS.mark[1]);
  paint.dot(15 + x, 14 + y, COLORS.mark[1]);
  paint.dot(7 + x, 7 + headY, COLORS.ear[0]);
  paint.dot(16 + x, 7 + headY, COLORS.ear[0]);
  paint.dot(10 + x, 8 + headY, COLORS.eye);
  paint.dot(13 + x, 8 + headY, COLORS.eye);
  paint.dot(10 + x, 11 + headY, COLORS.feature);
  paint.dot(13 + x, 11 + headY, COLORS.feature);
  paint.rect(11 + x, 13 + headY, 2, 1, COLORS.feature);
  drawEndLegs(paint, y, phase.stride, x);
}

function drawUp(paint, phase) {
  const y = phase.bob;
  const x = phase.lateral;
  const headY = phase.head;
  const hornY = 3 + y + phase.horn;

  paint.rect(7 + x, 8 + y, 11, 7, COLORS.wool[0]);
  paint.rect(8 + x, 6 + y, 9, 5, COLORS.wool[2]);
  paint.rect(8 + x, 13 + y, 9, 4, COLORS.belly[1]);
  paint.rect(7 + x, 15 + y, 11, 2, COLORS.wool[1]);
  paint.rect(8 + x, 5 + headY, 8, 8, COLORS.face[0]);
  paint.rect(9 + x, 3 + y, 6, 4, COLORS.wool[2]);
  paint.rect(10 + x, 10 + y, 4, 5, COLORS.belly[2]);

  paint.rect(3 + x, hornY, 5, 2, COLORS.horn[2]);
  paint.rect(2 + x, hornY + 1, 2, 5, COLORS.horn[0]);
  paint.rect(3 + x, hornY + 5, 5, 2, COLORS.horn[1]);
  paint.rect(7 + x, hornY + 4, 3, 3, COLORS.horn[2]);
  paint.rect(16 + x, hornY, 5, 2, COLORS.horn[2]);
  paint.rect(20 + x, hornY + 1, 2, 5, COLORS.horn[0]);
  paint.rect(16 + x, hornY + 5, 5, 2, COLORS.horn[1]);
  paint.rect(14 + x, hornY + 4, 3, 3, COLORS.horn[2]);

  paint.rect(18 + x, 10 + y, 3, 2, COLORS.wool[1]);
  paint.rect(20 + x, 8 + y, 2, 3, COLORS.wool[2]);
  paint.rect(9 + x, 9 + y, 3, 1, COLORS.mark[0]);
  paint.rect(13 + x, 9 + y, 3, 1, COLORS.mark[0]);
  paint.rect(11 + x, 11 + y, 3, 1, COLORS.mark[1]);
  paint.dot(7 + x, 7 + headY, COLORS.ear[1]);
  paint.dot(16 + x, 7 + headY, COLORS.ear[1]);
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
    return HURT_PHASES[EN_E10_CLIFFCOIL_STRIDER_DEATH_SOURCE_FRAMES[frame]];
  }
  throw new TypeError('Animation ' + animation + ' is not implemented for Cliffcoil Strider.');
}

function buildPixels(direction, animation, frame) {
  const phase = phaseFor(animation, frame);
  const canonical = direction === 'right' ? 'left' : direction;
  const pixels = createPixels();
  const paint = painter(pixels);
  if (canonical === 'down') drawDown(paint, phase);
  else if (canonical === 'up') drawUp(paint, phase);
  else if (canonical === 'left') drawSide(paint, phase);
  else throw new TypeError('Unsupported Cliffcoil Strider direction ' + direction + '.');
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

export function renderEnE10CliffcoilStriderFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Cliffcoil Strider rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Cliffcoil Strider direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'ram',
    variant: 'cliffcoil-strider',
    direction,
    animation,
    frame,
    phase: phase.name,
    cliffcoilStriderGate: EN_E10_CLIFFCOIL_STRIDER_GATE.id,
    architectureDecision: EN_E10_RAM_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E10_STONECURL_GRAZER_GATE.id,
    actorTopology: EN_E10_CLIFFCOIL_STRIDER_DATA.actorTopology,
    childAssetCount: EN_E10_CLIFFCOIL_STRIDER_DATA.childAssets.length,
    alphaPolicy: EN_E10_CLIFFCOIL_STRIDER_DATA.alphaPolicy,
    effectBoundary: EN_E10_CLIFFCOIL_STRIDER_DATA.effectBoundary,
  });
}

export const EN_E10_CLIFFCOIL_STRIDER_RENDERER = deepFreeze({
  key: 'en-e10-ram-cliffcoil-strider-v1',
  chassis: EN_E10_CLIFFCOIL_STRIDER_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'ram', 'The EN-E10 Cliffcoil Strider renderer is restricted to Ram.');
    assert(variant.id === 'cliffcoil-strider', 'The EN-E10 Cliffcoil Strider renderer is restricted to Cliffcoil Strider.');
    return renderEnE10CliffcoilStriderFrame(context, direction, animation.id, frame);
  },
});

const CLIFFCOIL_STRIDER_VARIANT = deepFreeze({
  id: 'cliffcoil-strider',
  name: 'Cliffcoil Strider',
  role: EN_E10_CLIFFCOIL_STRIDER_CONTRACT.role,
  status: EN_E10_CLIFFCOIL_STRIDER_CONTRACT.state,
  brief: 'A private complete specialist Ram with lean blue-slate fleece, charcoal face and lower legs, long limestone connected swept horns, pale beard and belly, sea-glass sure-foot chevrons, wine ears, cyan eyes, short raised tail, four dark hooves, and a body-owned sidestep horn charge; all effects remain external.',
  rendererData: EN_E10_CLIFFCOIL_STRIDER_DATA,
});

export const EN_E10_CLIFFCOIL_STRIDER_FAMILY = deepFreeze({
  id: 'ram',
  name: 'Ram Cliffcoil Strider Review',
  sliceId: 'EN-E10',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E10_CLIFFCOIL_STRIDER_CONTRACT.chassis,
  rendererKey: EN_E10_CLIFFCOIL_STRIDER_RENDERER.key,
  variants: [CLIFFCOIL_STRIDER_VARIANT],
  rendererData: {
    contractCard: EN_E10_RAM_SPECIALIST_CONTRACT_CARD.id,
    architectureDecision: EN_E10_RAM_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E10_STONECURL_GRAZER_GATE.id,
    activeGate: EN_E10_CLIFFCOIL_STRIDER_GATE.id,
  },
  review: {
    baselineVariant: 'cliffcoil-strider',
    scale: 8,
    notes: 'Visually approved as one specialist horned Ram against approved Stonecurl Grazer and Miremane Courser plus public Dire Wolf. The packet includes a distinct Complete B outlined PNG as review evidence. Standing publication permission opens only the bounded approval record and reconciliation; keep outline registration, public registration, fixtures, effects, child assets, elite Ram and later EN-E10 families, Rhino Boss work, and deferred Runic Idol separate.',
  },
});

export const EN_E10_CLIFFCOIL_STRIDER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E10_CLIFFCOIL_STRIDER_RENDERER],
  families: [EN_E10_CLIFFCOIL_STRIDER_FAMILY],
});
