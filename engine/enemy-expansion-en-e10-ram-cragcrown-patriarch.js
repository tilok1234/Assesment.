import { SIZE } from './catalogs.js';
import { createEnemyExpansionRegistry, ENEMY_EXPANSION_STATES } from './enemy-expansion.js';
import {
  EN_E10_RAM_CONTRACT_CARD,
  EN_E10_RAM_TOPOLOGY_DECISION,
} from './enemy-expansion-en-e10-ram-stonecurl-grazer.js';
import { EN_E10_CLIFFCOIL_STRIDER_GATE } from './enemy-expansion-en-e10-ram-cliffcoil-strider.js';

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
  wool: ['#4f4448', '#2d292f', '#716069'],
  face: ['#30272a', '#18171b', '#594247'],
  horn: ['#918372', '#514844', '#cbb99e'],
  ring: ['#b5743b', '#6c3f25'],
  belly: ['#88766f', '#514640', '#b29a8d'],
  mark: ['#713842', '#45232c'],
  ear: ['#8a3f4c', '#4b222d'],
  scar: ['#dbc9a8', '#a98e6b'],
  hoof: '#17151a',
  feature: '#0e0c10',
  eye: '#efbd55',
  flash: '#f4f4f4',
});

export const EN_E10_RAM_ELITE_CONTRACT_CARD = deepFreeze({
  id: 'en-e10-ram-cragcrown-patriarch-v1',
  sliceId: 'EN-E10',
  family: 'ram',
  familyName: 'Ram',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingVariant: {
    id: 'cliffcoil-strider',
    role: 'specialist',
    status: 'approved-published-reconciled',
    gateId: EN_E10_CLIFFCOIL_STRIDER_GATE.id,
  },
  activeVariant: {
    id: 'cragcrown-patriarch',
    name: 'Cragcrown Patriarch',
    role: 'elite',
    status: 'implemented-full-approved',
  },
  deferredRoles: [],
  actorTopology: EN_E10_RAM_TOPOLOGY_DECISION.selected,
  styleContract: EN_E10_RAM_CONTRACT_CARD.styleContract,
  effectBoundary: EN_E10_RAM_CONTRACT_CARD.effectBoundary,
});

export const EN_E10_CRAGCROWN_PATRIARCH_CONTRACT = deepFreeze({
  sliceId: 'EN-E10',
  family: 'ram',
  variant: 'cragcrown-patriarch',
  role: 'elite',
  state: 'implemented-complete-motion-approved',
  topology: EN_E10_RAM_TOPOLOGY_DECISION.selected,
  chassis: 'baked-single-actor-broad-dark-layered-fleece-massive-ringed-horns-scarred-four-hoof-ram-v1',
  silhouette: 'A broad elite Ram with a deep layered fleece barrel, massive high shoulders, thick neck, blunt scarred wedge muzzle, two enormous connected full-ring horns, a connected heavy beard and short squared tail, and four separated weight-bearing hooves. It must remain a horned Ram while reading heavier than Stonecurl Grazer and Cliffcoil Strider and unlike a long-backed Dire Wolf, bowed Miremane Courser, upright Goatfolk, antlered Stag, Mammoth, or reduced Rhino Boss.',
  visualIdentity: 'Layered basalt-wine fleece, a near-black umber face and lower legs, ironstone horns with burnished-copper growth rings, a weathered taupe belly and beard, dark crimson crag bands, integrated pale facial scars, blood-wine ear interiors, gold eyes, and near-black hooves establish the crag patriarch. Dust, trophies, chains, rock shards, horn arcs, impacts, particles, projectiles, glow, and illumination remain external.',
  effectBoundary: EN_E10_RAM_CONTRACT_CARD.effectBoundary,
});

export const EN_E10_CRAGCROWN_PATRIARCH_DATA = deepFreeze({
  actor: {
    species: 'authored-ram-elite',
    bodyBuild: 'broad-layered-fleece-heavy-neck-four-hoof-elite',
    skin: 'basalt-wine-layered-fleece',
    hairStyle: 'connected-crown-fleece-and-heavy-taupe-beard',
    hairColor: 'basalt-wine',
    expression: 'gold-crag-patriarch-stare',
    faceDetail: 'blunt-near-black-wedge-muzzle-wine-ears-gold-eyes-integrated-scars-and-massive-ringed-horns',
    headgear: 'body-owned-ironstone-full-ring-horns-with-copper-growth-bands',
    outfit: 'weathered-taupe-belly-beard-and-dark-crimson-crag-bands',
    outfitColor: 'basalt-wine-umber-ironstone-copper-taupe-crimson-and-gold',
    outfitTier: 'tier3',
    weapon: 'body-owned-double-impact-ram',
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
  cragcrownPatriarch: COLORS,
  actorTopology: EN_E10_RAM_TOPOLOGY_DECISION.selected,
  childAssets: [],
  alphaPolicy: 'binary-single-component-broad-layered-fleece-heavy-neck-scarred-wedge-muzzle-massive-connected-ringed-horns-beard-tail-and-four-grounded-hooves',
  effectBoundary: EN_E10_RAM_CONTRACT_CARD.effectBoundary,
  bakedEffects: [],
});

export const EN_E10_CRAGCROWN_PATRIARCH_GATE = deepFreeze({
  id: 'en-e10-ram-cragcrown-patriarch-full-v1',
  status: 'approved',
  baseCheckpoint: 'bb11e3518b65613caa5499ec7cb5ddefb18d5ebd',
  authorizedOn: '2026-08-13',
  authorizationEvidence: 'The exact Cliffcoil Strider implementation cb6c58440297b76f62776d8c11a6232d05bb1467, approval record 3b9b99e28a2c4787d76f3dc0def20f4a79b589ac, initial published handoff b43e0ab90bf39bdc04abf1681d8f78cf2faa78fc, and final reconciliation bb11e3518b65613caa5499ec7cb5ddefb18d5ebd were pushed and remote verified. The handoff recorded that no next Ram art gate was open. The designer then separately said: lets xdo next. In the established common-specialist-elite cadence this authorizes exactly one private elite Ram full 80-frame candidate under the already approved baked-single-actor-horned-grounded-quadruped topology. Continue the distinct Complete B outlined PNG as review evidence only; it does not authorize outline registration. Public Ram registration, fixtures, effects, child assets, additional Ram variants, Stag, Mammoth, Rhino, Rhino Boss work, Runic Idol, release, accepted drift, and a pull request remain closed.',
  architectureDecision: EN_E10_RAM_TOPOLOGY_DECISION.id,
  approvedOn: '2026-08-13',
  approvalEvidence: 'The exact labeled all-four-direction raw/no-outline, distinct Complete B outlined, Complete B + Form, and approved Cliffcoil Strider and Stonecurl Grazer plus public Dire Wolf comparison PNGs were frozen with both synchronized GIF hashes. The four-lane Aseprite MCP review window reported those exact four paths open together as raw sprite 83, outlined sprite 87, Complete B + Form sprite 91, and active comparison sprite 95. The final approval prompt posted all four exact PNGs, both synchronized GIFs, and candidate digest b8c7159c1d85689b3b9178179464b54e01a7ae538a1bda0036eb731d7d7d6c0a. The designer replied: approved. Approval applies only to that exact Cragcrown Patriarch digest and its six frozen review hashes. It does not authorize public Ram or outline registration, fixtures, effects, child assets, additional Ram variants, Stag, Mammoth, Rhino, Rhino Boss work, Runic Idol, release, accepted drift, a pull request, or another art gate.',
  approvedImplementation: '3d8727cce7d8b3f00ce8923ee9db629de13e1097',
  publicationAuthorizedOn: '2026-08-13',
  publicationAuthorizationEvidence: 'The designer previously said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact frozen artifact or digest. It does not authorize registration, fixtures, effects, child assets, later roles or families, release, accepted drift, or a pull request.',
  publishedImplementation: '3d8727cce7d8b3f00ce8923ee9db629de13e1097',
  publishedApprovalRecord: '8b2cc029a94eaeae69dc1a0f4886dd899dfc6902',
  initialPublishedHandoff: '46645d2a2a84bc0669f0f5e5f4362da93abf0782',
  publicationState: 'published',
  precedingApproval: {
    gateId: EN_E10_CLIFFCOIL_STRIDER_GATE.id,
    artifactSha256: EN_E10_CLIFFCOIL_STRIDER_GATE.artifactSha256,
    outlinedArtifactSha256: EN_E10_CLIFFCOIL_STRIDER_GATE.outlinedArtifactSha256,
    assembledArtifactSha256: EN_E10_CLIFFCOIL_STRIDER_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E10_CLIFFCOIL_STRIDER_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E10_CLIFFCOIL_STRIDER_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E10_CLIFFCOIL_STRIDER_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E10_CLIFFCOIL_STRIDER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E10_CLIFFCOIL_STRIDER_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E10_CLIFFCOIL_STRIDER_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E10_CLIFFCOIL_STRIDER_GATE.initialPublishedHandoff,
    currentReconciliation: 'bb11e3518b65613caa5499ec7cb5ddefb18d5ebd',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e10-ram-cragcrown-patriarch/en-e10-ram-cragcrown-patriarch-full-suite-raw.png',
  artifactSha256: '52994038e2b6b9c1d54915099d0d82b3a40fad2c1f71db00eb427a95b0349ae2',
  outlinedArtifact: 'enemy-expansion-review/en-e10-ram-cragcrown-patriarch/en-e10-ram-cragcrown-patriarch-full-suite-outlined-complete-b.png',
  outlinedArtifactSha256: '5613856ef24a57ea3972881918003373729a400f82ea17647c00daa7567e8da0',
  assembledArtifact: 'enemy-expansion-review/en-e10-ram-cragcrown-patriarch/en-e10-ram-cragcrown-patriarch-full-suite-complete-b-form.png',
  assembledArtifactSha256: '0f64719cfbd4226497c1c010994b8c38dd29144d5366ef8857babb06b8a9dc0c',
  comparisonArtifact: 'enemy-expansion-review/en-e10-ram-cragcrown-patriarch/en-e10-ram-cragcrown-patriarch-family-comparison.png',
  comparisonArtifactSha256: '803711a50fc9b2e24b33e6a86136fc2556d0ebfba1fbc411a05d110b26a60c2f',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e10-ram-cragcrown-patriarch/en-e10-ram-cragcrown-patriarch-full-suite-four-directions-labeled.gif',
      sha256: 'c206c884282ee7c09c82eaa0d92d4f3082c6f1efb1370f665ab677499985293e', width: 640, height: 672, frames: 4, durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e10-ram-cragcrown-patriarch/en-e10-ram-cragcrown-patriarch-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '0a5abbc5e575232744ddf0da253a0f07e4007669234b5aba0fb91d1b8bf7e2ad', width: 640, height: 672, frames: 4, durationMs: 180,
    },
  },
  candidateFrameDigest: 'b8c7159c1d85689b3b9178179464b54e01a7ae538a1bda0036eb731d7d7d6c0a',
  cliffcoilComparisonDigest: '1ca2ce85dc6bd4b291e6ede4754f58c2a5bd4278b50acfb699926f9626dd9b29',
  stonecurlComparisonDigest: '79b440290b1c6f503834d44b13d2c9508b34ad48a4ae495c6e957e329095942f',
  direWolfComparisonDigest: 'a94a66ee380cfcb91db3907a3a049dae4b59357870857c3ed31be259bb1f1579',
  scope: 'One complete 80-frame Cragcrown Patriarch elite Ram across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle lifts and settles the massive connected ringed horns over a broad four-hoof patriarch stance. Walk uses four deliberate alternating weight-transfer phases while layered fleece and copper growth bands stay readable. Attack plants the broad body, drives one body-owned first horn impact, recoils without effects, then drives a second heavier body-owned impact without detached horns, dust, rock shards, arcs, debris, or impact pixels. Hurt uses a complete white recoil and colored wide four-hoof brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline board, distinct Complete B outlined board, Complete B + Form board, synchronized raw and Complete B + Form GIFs, and approved Cliffcoil Strider and Stonecurl Grazer plus public Dire Wolf comparisons together.',
  exclusions: [
    'changes to approved Cliffcoil Strider or Stonecurl Grazer rendered pixels',
    'changes to public Dire Wolf pixels',
    'public Ram registration or outline registration',
    'public catalog or facade exposure',
    'asset-pack fixture or manifest changes',
    'schema, shared renderer, exporter, validator, or frame-contract changes',
    'detached horns, beard, tail, or child assets',
    'new Cast pixels or new Death pixels',
    'dust, rock shards, horn arcs, impacts, debris, particles, projectiles, glow, illumination, or effects',
    'additional Ram variants',
    'Stag, Mammoth, or Rhino',
    'Furious Depraved Rhino Boss changes',
    'Runic Idol or other EN-E09 work',
    'release, accepted drift, or pull request',
  ],
  nextGate: 'The exact Cragcrown Patriarch implementation 3d8727cce7d8b3f00ce8923ee9db629de13e1097, approval record 8b2cc029a94eaeae69dc1a0f4886dd899dfc6902, and initial published handoff 46645d2a2a84bc0669f0f5e5f4362da93abf0782 are remote verified; this reconciliation completes the bounded publication tuple. No next Ram art gate is open. The distinct outlined PNG remains review evidence only and does not authorize outline registration. Public Ram registration, fixtures, effects, child assets, additional Ram variants, Stag, Mammoth, Rhino, Rhino Boss work, Runic Idol, release, accepted drift, and a pull request remain closed.',
});

export const EN_E10_CRAGCROWN_PATRIARCH_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'massive-ringed-horn-lift', pose: 'idle', bob: 0, head: 0, horn: -1, reach: 0, lateral: 0, stride: [0, 0, 0, 0] },
  { name: 'crag-patriarch-settle', pose: 'idle', bob: 1, head: 1, horn: 0, reach: 0, lateral: 0, stride: [0, 0, 0, 0] },
]);

const WALK_PHASES = deepFreeze([
  { name: 'near-fore-far-hind-weight-plant', pose: 'walk', bob: 0, head: 0, horn: -1, reach: 0, lateral: 0, stride: [-1, 1, 0, -1] },
  { name: 'layered-fleece-forward-heave', pose: 'walk', bob: -1, head: 0, horn: 0, reach: 0, lateral: 1, stride: [0, 1, -1, 0] },
  { name: 'far-fore-near-hind-weight-plant', pose: 'walk', bob: 0, head: 1, horn: 0, reach: 0, lateral: 0, stride: [1, -1, 0, 1] },
  { name: 'cragcrown-heavy-switch', pose: 'walk', bob: 1, head: 1, horn: -1, reach: 0, lateral: -1, stride: [0, -1, 1, 0] },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'cragcrown-four-hoof-plant', pose: 'brace', bob: 1, head: 0, horn: -1, reach: 0, lateral: -1, stride: [-1, 0, 1, 0] },
  { name: 'body-owned-first-horn-impact', pose: 'first-impact', bob: 0, head: 2, horn: 0, reach: -1, lateral: 0, stride: [-1, 1, 1, -1] },
  { name: 'effect-free-patriarch-recoil', pose: 'recoil', bob: -1, head: 0, horn: -1, reach: 0, lateral: 1, stride: [0, -1, -1, 0] },
  { name: 'body-owned-second-heavy-impact', pose: 'second-impact', bob: 1, head: 2, horn: 0, reach: -1, lateral: 0, stride: [-1, 1, 1, -1] },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-crag-patriarch-recoil', pose: 'hurt', bob: -1, head: 0, horn: 0, reach: 0, lateral: -1, stride: [0, 0, 0, 0], flash: true },
  { name: 'colored-wide-weight-bearing-brace', pose: 'hurt-brace', bob: 1, head: 2, horn: -1, reach: 0, lateral: 1, stride: [-1, 1, 1, -1], flash: false },
]);

function createPixels() {
  return new Array(SIZE * SIZE).fill(null);
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert([x, y, width, height].every(Number.isInteger) && width > 0 && height > 0, 'Cragcrown Patriarch geometry must use positive integers.');
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Cragcrown Patriarch pixels must remain inside 24x24.');
      pixels[(py * SIZE) + px] = fill;
    }
  };
  return { rect, dot(x, y, fill) { rect(x, y, 1, 1, fill); } };
}

function drawSideLegs(paint, bodyY, stride) {
  const positions = [4, 8, 15, 20];
  for (let index = 0; index < positions.length; index++) {
    const footX = positions[index];
    const upperX = footX + stride[index];
    const legY = 14 + bodyY;
    const bodyMinX = 5;
    const bodyMaxX = 20;
    const anchorX = Math.max(bodyMinX, Math.min(bodyMaxX, upperX));
    paint.rect(Math.min(anchorX, upperX), legY, Math.abs(anchorX - upperX) + 2, 1, index < 2 ? COLORS.face[0] : COLORS.wool[1]);
    paint.rect(upperX, legY, 2, 4, index < 2 ? COLORS.face[0] : COLORS.wool[1]);
    paint.rect(Math.min(footX, upperX), legY + 1, Math.abs(footX - upperX) + 2, 1, COLORS.face[0]);
    paint.rect(footX, legY + 2, 1, 19 - legY, COLORS.face[1]);
    paint.dot(footX, 19, COLORS.ring[index % 2]);
    paint.rect(footX, 20, 1, 1, COLORS.belly[1]);
    paint.rect(footX, 21, 2, 2, COLORS.hoof);
  }
}

function drawEndLegs(paint, bodyY, stride, lateral) {
  const positions = [4, 9, 14, 19];
  for (let index = 0; index < positions.length; index++) {
    const footX = positions[index];
    const step = stride[index] > 0 ? 1 : stride[index] < 0 ? -1 : 0;
    const upperX = footX + lateral + step;
    const rearLeg = index === 0 || index === 3;
    const legY = 15 + bodyY + (rearLeg ? 1 : 0);
    const bodyMinX = 6 + lateral;
    const bodyMaxX = 18 + lateral;
    const anchorX = Math.max(bodyMinX, Math.min(bodyMaxX, upperX));
    paint.rect(Math.min(anchorX, upperX), legY, Math.abs(anchorX - upperX) + 2, 1, rearLeg ? COLORS.wool[1] : COLORS.face[0]);
    paint.rect(upperX, legY, 2, 4, rearLeg ? COLORS.wool[1] : COLORS.face[0]);
    paint.rect(Math.min(footX, upperX), legY + 1, Math.abs(footX - upperX) + 2, 1, COLORS.face[0]);
    paint.rect(footX, legY + 2, 1, 20 - legY, COLORS.face[1]);
    paint.dot(footX, 20, COLORS.ring[index % 2]);
    paint.rect(footX, 21, 2, 2, COLORS.hoof);
  }
}

function drawSide(paint, phase) {
  const y = phase.bob;
  const headX = Math.max(1, 2 + phase.reach);
  const faceY = 6 + phase.head;

  paint.rect(7, 7 + y, 14, 8, COLORS.wool[0]);
  paint.rect(8, 5 + y, 12, 5, COLORS.wool[2]);
  paint.rect(9, 9 + y, 11, 5, COLORS.wool[1]);
  paint.rect(8, 13 + y, 12, 4, COLORS.belly[0]);
  paint.rect(17, 8 + y, 5, 8, COLORS.wool[1]);
  paint.rect(5, 5 + y, 7, 12, COLORS.wool[0]);
  paint.rect(6, 9 + y, 5, 8, COLORS.belly[2]);
  paint.rect(6, 3 + y, 5, 4, COLORS.wool[2]);
  paint.rect(9, 2 + y, 6, 3, COLORS.wool[0]);
  paint.rect(11, 3 + y, 5, 3, COLORS.wool[2]);

  paint.rect(headX + 2, faceY, 6, 6, COLORS.face[0]);
  paint.rect(headX, faceY + 3, 6, 3, COLORS.face[1]);
  paint.rect(headX + 1, faceY + 5, 5, 2, COLORS.face[2]);
  paint.rect(headX + 5, faceY + 5, 3, 6, COLORS.belly[2]);
  paint.rect(headX + 6, faceY + 8, 2, 4, COLORS.belly[0]);

  const hornY = faceY - 4 + phase.horn;
  paint.rect(headX + 3, hornY, 8, 2, COLORS.horn[2]);
  paint.rect(headX + 9, hornY + 1, 5, 3, COLORS.horn[0]);
  paint.rect(headX + 12, hornY + 3, 2, 5, COLORS.horn[1]);
  paint.rect(headX + 9, hornY + 7, 5, 2, COLORS.horn[2]);
  paint.rect(headX + 6, hornY + 6, 4, 3, COLORS.horn[0]);
  paint.rect(headX + 5, hornY + 4, 2, 4, COLORS.horn[1]);
  paint.rect(headX + 7, hornY, 2, 2, COLORS.ring[0]);
  paint.rect(headX + 12, hornY + 2, 2, 2, COLORS.ring[1]);
  paint.rect(headX + 10, hornY + 7, 2, 2, COLORS.ring[0]);

  paint.rect(19, 9 + y, 3, 4, COLORS.wool[0]);
  paint.rect(21, 7 + y, 2, 4, COLORS.wool[2]);
  paint.rect(12, 8 + y, 5, 2, COLORS.mark[0]);
  paint.rect(14, 10 + y, 5, 2, COLORS.mark[1]);
  paint.rect(16, 12 + y, 3, 1, COLORS.mark[0]);

  drawSideLegs(paint, y, phase.stride);

  paint.dot(headX, faceY + 4, COLORS.feature);
  paint.rect(headX + 2, faceY + 6, 3, 1, COLORS.feature);
  paint.dot(headX + 7, faceY + 1, COLORS.ear[0]);
  paint.dot(headX + 8, faceY + 2, COLORS.ear[1]);
  paint.dot(headX + 6, faceY + 2, COLORS.eye);
  paint.rect(headX + 3, faceY + 1, 1, 3, COLORS.scar[0]);
  paint.dot(headX + 4, faceY + 4, COLORS.scar[1]);
}

function drawDown(paint, phase) {
  const y = phase.bob;
  const x = phase.lateral;
  const headY = phase.head;
  const hornY = 4 + y + phase.horn;

  paint.rect(6 + x, 7 + y, 13, 9, COLORS.wool[0]);
  paint.rect(7 + x, 5 + y, 11, 6, COLORS.wool[2]);
  paint.rect(7 + x, 13 + y, 11, 5, COLORS.belly[0]);
  paint.rect(6 + x, 15 + y, 13, 3, COLORS.wool[1]);
  paint.rect(8 + x, 2 + y, 8, 5, COLORS.wool[2]);
  paint.rect(7 + x, 5 + headY, 10, 9, COLORS.face[0]);
  paint.rect(8 + x, 9 + headY, 8, 5, COLORS.face[1]);
  paint.rect(9 + x, 11 + headY, 6, 3, COLORS.face[2]);
  paint.rect(9 + x, 13 + y, 6, 5, COLORS.belly[2]);

  paint.rect(2 + x, hornY, 6, 2, COLORS.horn[2]);
  paint.rect(2 + x, hornY + 1, 2, 7, COLORS.horn[0]);
  paint.rect(3 + x, hornY + 7, 6, 2, COLORS.horn[1]);
  paint.rect(7 + x, hornY + 5, 4, 3, COLORS.horn[2]);
  paint.rect(16 + x, hornY, 6, 2, COLORS.horn[2]);
  paint.rect(20 + x, hornY + 1, 2, 7, COLORS.horn[0]);
  paint.rect(15 + x, hornY + 7, 6, 2, COLORS.horn[1]);
  paint.rect(13 + x, hornY + 5, 4, 3, COLORS.horn[2]);
  paint.rect(2 + x, hornY + 3, 2, 2, COLORS.ring[0]);
  paint.rect(4 + x, hornY + 7, 2, 2, COLORS.ring[1]);
  paint.rect(20 + x, hornY + 3, 2, 2, COLORS.ring[0]);
  paint.rect(18 + x, hornY + 7, 2, 2, COLORS.ring[1]);

  paint.rect(18 + x, 10 + y, 4, 3, COLORS.wool[1]);
  paint.rect(20 + x, 8 + y, 2, 4, COLORS.wool[2]);
  paint.rect(7 + x, 13 + y, 4, 2, COLORS.mark[0]);
  paint.rect(14 + x, 13 + y, 4, 2, COLORS.mark[0]);
  paint.dot(9 + x, 15 + y, COLORS.mark[1]);
  paint.dot(15 + x, 15 + y, COLORS.mark[1]);
  paint.dot(7 + x, 7 + headY, COLORS.ear[0]);
  paint.dot(16 + x, 7 + headY, COLORS.ear[0]);
  paint.dot(10 + x, 8 + headY, COLORS.eye);
  paint.dot(13 + x, 8 + headY, COLORS.eye);
  paint.dot(10 + x, 11 + headY, COLORS.feature);
  paint.dot(13 + x, 11 + headY, COLORS.feature);
  paint.rect(11 + x, 13 + headY, 2, 1, COLORS.feature);
  paint.rect(9 + x, 6 + headY, 1, 3, COLORS.scar[0]);
  paint.dot(10 + x, 9 + headY, COLORS.scar[1]);
  drawEndLegs(paint, y, phase.stride, x);
}

function drawUp(paint, phase) {
  const y = phase.bob;
  const x = phase.lateral;
  const headY = phase.head;
  const hornY = 4 + y + phase.horn;

  paint.rect(6 + x, 7 + y, 13, 9, COLORS.wool[0]);
  paint.rect(7 + x, 5 + y, 11, 6, COLORS.wool[2]);
  paint.rect(7 + x, 13 + y, 11, 5, COLORS.belly[1]);
  paint.rect(6 + x, 15 + y, 13, 3, COLORS.wool[1]);
  paint.rect(7 + x, 5 + headY, 10, 9, COLORS.face[0]);
  paint.rect(8 + x, 2 + y, 8, 5, COLORS.wool[2]);
  paint.rect(9 + x, 10 + y, 6, 6, COLORS.belly[2]);

  paint.rect(2 + x, hornY, 6, 2, COLORS.horn[2]);
  paint.rect(2 + x, hornY + 1, 2, 7, COLORS.horn[0]);
  paint.rect(3 + x, hornY + 7, 6, 2, COLORS.horn[1]);
  paint.rect(7 + x, hornY + 5, 4, 3, COLORS.horn[2]);
  paint.rect(16 + x, hornY, 6, 2, COLORS.horn[2]);
  paint.rect(20 + x, hornY + 1, 2, 7, COLORS.horn[0]);
  paint.rect(15 + x, hornY + 7, 6, 2, COLORS.horn[1]);
  paint.rect(13 + x, hornY + 5, 4, 3, COLORS.horn[2]);
  paint.rect(2 + x, hornY + 3, 2, 2, COLORS.ring[0]);
  paint.rect(4 + x, hornY + 7, 2, 2, COLORS.ring[1]);
  paint.rect(20 + x, hornY + 3, 2, 2, COLORS.ring[0]);
  paint.rect(18 + x, hornY + 7, 2, 2, COLORS.ring[1]);

  paint.rect(18 + x, 10 + y, 4, 3, COLORS.wool[1]);
  paint.rect(20 + x, 8 + y, 2, 4, COLORS.wool[2]);
  paint.rect(8 + x, 9 + y, 4, 2, COLORS.mark[0]);
  paint.rect(13 + x, 9 + y, 4, 2, COLORS.mark[0]);
  paint.rect(10 + x, 12 + y, 5, 2, COLORS.mark[1]);
  paint.dot(8 + x, 14 + y, COLORS.scar[1]);
  paint.dot(16 + x, 14 + y, COLORS.scar[1]);
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
    return HURT_PHASES[EN_E10_CRAGCROWN_PATRIARCH_DEATH_SOURCE_FRAMES[frame]];
  }
  throw new TypeError('Animation ' + animation + ' is not implemented for Cragcrown Patriarch.');
}

function buildPixels(direction, animation, frame) {
  const phase = phaseFor(animation, frame);
  const canonical = direction === 'right' ? 'left' : direction;
  const pixels = createPixels();
  const paint = painter(pixels);
  if (canonical === 'down') drawDown(paint, phase);
  else if (canonical === 'up') drawUp(paint, phase);
  else if (canonical === 'left') drawSide(paint, phase);
  else throw new TypeError('Unsupported Cragcrown Patriarch direction ' + direction + '.');
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

export function renderEnE10CragcrownPatriarchFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Cragcrown Patriarch rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Cragcrown Patriarch direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'ram',
    variant: 'cragcrown-patriarch',
    direction,
    animation,
    frame,
    phase: phase.name,
    cragcrownPatriarchGate: EN_E10_CRAGCROWN_PATRIARCH_GATE.id,
    architectureDecision: EN_E10_RAM_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E10_CLIFFCOIL_STRIDER_GATE.id,
    actorTopology: EN_E10_CRAGCROWN_PATRIARCH_DATA.actorTopology,
    childAssetCount: EN_E10_CRAGCROWN_PATRIARCH_DATA.childAssets.length,
    alphaPolicy: EN_E10_CRAGCROWN_PATRIARCH_DATA.alphaPolicy,
    effectBoundary: EN_E10_CRAGCROWN_PATRIARCH_DATA.effectBoundary,
  });
}

export const EN_E10_CRAGCROWN_PATRIARCH_RENDERER = deepFreeze({
  key: 'en-e10-ram-cragcrown-patriarch-v1',
  chassis: EN_E10_CRAGCROWN_PATRIARCH_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'ram', 'The EN-E10 Cragcrown Patriarch renderer is restricted to Ram.');
    assert(variant.id === 'cragcrown-patriarch', 'The EN-E10 Cragcrown Patriarch renderer is restricted to Cragcrown Patriarch.');
    return renderEnE10CragcrownPatriarchFrame(context, direction, animation.id, frame);
  },
});

const CRAGCROWN_PATRIARCH_VARIANT = deepFreeze({
  id: 'cragcrown-patriarch',
  name: 'Cragcrown Patriarch',
  role: EN_E10_CRAGCROWN_PATRIARCH_CONTRACT.role,
  status: EN_E10_CRAGCROWN_PATRIARCH_CONTRACT.state,
  brief: 'A private complete elite Ram with broad layered basalt-wine fleece, a near-black umber face and lower legs, enormous ironstone connected ringed horns with copper growth bands, a taupe beard and belly, integrated pale scars, crimson crag bands, wine ears, gold eyes, four heavy dark hooves, and a body-owned double-impact ram; all effects remain external.',
  rendererData: EN_E10_CRAGCROWN_PATRIARCH_DATA,
});

export const EN_E10_CRAGCROWN_PATRIARCH_FAMILY = deepFreeze({
  id: 'ram',
  name: 'Ram Cragcrown Patriarch Review',
  sliceId: 'EN-E10',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E10_CRAGCROWN_PATRIARCH_CONTRACT.chassis,
  rendererKey: EN_E10_CRAGCROWN_PATRIARCH_RENDERER.key,
  variants: [CRAGCROWN_PATRIARCH_VARIANT],
  rendererData: {
    contractCard: EN_E10_RAM_ELITE_CONTRACT_CARD.id,
    architectureDecision: EN_E10_RAM_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E10_CLIFFCOIL_STRIDER_GATE.id,
    activeGate: EN_E10_CRAGCROWN_PATRIARCH_GATE.id,
  },
  review: {
    baselineVariant: 'cragcrown-patriarch',
    scale: 8,
    notes: 'Visually approved as one exact elite horned Ram against approved Cliffcoil Strider and Stonecurl Grazer plus public Dire Wolf. Implementation 3d8727cce7d8b3f00ce8923ee9db629de13e1097, approval record 8b2cc029a94eaeae69dc1a0f4886dd899dfc6902, and initial published handoff 46645d2a2a84bc0669f0f5e5f4362da93abf0782 are remote verified; this reconciliation completes the bounded publication tuple. The packet includes a distinct Complete B outlined PNG as review evidence only. Keep outline registration, public registration, fixtures, effects, child assets, additional Ram variants and later EN-E10 families, Rhino Boss work, deferred Runic Idol, release, accepted drift, and a pull request separate. No next Ram art gate is open.',
  },
});

export const EN_E10_CRAGCROWN_PATRIARCH_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E10_CRAGCROWN_PATRIARCH_RENDERER],
  families: [EN_E10_CRAGCROWN_PATRIARCH_FAMILY],
});
