import { SIZE } from './catalogs.js';
import { createEnemyExpansionRegistry, ENEMY_EXPANSION_STATES } from './enemy-expansion.js';
import { EN_E10_GLOAMCROWN_SOVEREIGN_GATE } from './enemy-expansion-en-e10-stag-gloamcrown-sovereign.js';

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
  wool: ['#75675b', '#3d3735', '#a79680'],
  face: ['#5f544d', '#292728', '#8b796b'],
  tusk: ['#d8c79e', '#8b7658', '#f2dfad'],
  belly: ['#b8a88e', '#756b60', '#dac9a8'],
  frost: ['#6d8585', '#405b5e'],
  ear: ['#95645f', '#5d3b3e'],
  foot: '#1d1d21',
  feature: '#111116',
  eye: '#e7b95d',
  flash: '#f4f4f4',
});

export const EN_E10_MAMMOTH_TOPOLOGY_DECISION = deepFreeze({
  id: 'en-e10-mammoth-actor-topology-v1',
  sliceId: 'EN-E10',
  family: 'mammoth',
  status: 'selected',
  selected: 'baked-single-actor-tusked-heavy-grounded-quadruped',
  selectedOn: '2026-08-13',
  approvalEvidence: 'The exact Gloamcrown Sovereign implementation 0ece468efeaf4b50351358020075b4bf91dc7cff, approval record 378ec3d107b43e6b354cadcad16f64e0a8cf838b, initial published handoff be5d7c7316e035021ef805b0f1f6843b10df9c32, and final reconciliation c371e7ffeb3dd9196c29b9236d62585d96a52585 were pushed and remote verified. The designer reply approved lets do next opened only the Mammoth actor-topology decision. Codex recommended one connected grounded 24x24 Mammoth with body-owned trunk, paired tusks, ears, short tail, four broad feet, a body-owned trunk lift into a tusk shove, zero child assets, and external effects. The designer replied: approved. This selects only baked-single-actor-tusked-heavy-grounded-quadruped and authorizes exactly one private common Mammoth full 80-frame candidate. It does not authorize publication, public or outline registration, fixtures, effects, child assets, specialist or elite Mammoth, Rhino, Rhino Boss work, Runic Idol, release, accepted drift, or a pull request.',
  alternatives: [
    'baked-single-actor-tusked-heavy-grounded-quadruped',
    'body-plus-detached-trunk-and-tusk-child-assets',
    'scaled-elephant-chassis-with-cosmetic-wool-overlay',
  ],
  childAssets: [],
  effectBoundary: 'The baked actor owns only its connected wool, head, ears, eyes, trunk, paired tusks, domed barrel, belly, short tail, four legs, and broad feet. Dust, snow, breath, debris, shock rings, tusk trails, impacts, particles, projectiles, glow, and illumination remain external.',
});

export const EN_E10_MAMMOTH_CONTRACT_CARD = deepFreeze({
  id: 'en-e10-mammoth-tundrahide-grazer-v1',
  sliceId: 'EN-E10',
  family: 'mammoth',
  familyName: 'Mammoth',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingFamily: {
    id: 'stag',
    variant: 'gloamcrown-sovereign',
    status: 'approved-published-reconciled',
    gateId: EN_E10_GLOAMCROWN_SOVEREIGN_GATE.id,
  },
  activeVariant: {
    id: 'tundrahide-grazer',
    name: 'Tundrahide Grazer',
    role: 'common',
    status: 'implemented-full-approved',
  },
  deferredRoles: ['specialist', 'elite'],
  actorTopology: EN_E10_MAMMOTH_TOPOLOGY_DECISION.selected,
  styleContract: 'Use chunky one-to-three-pixel hard-alpha forms for a connected heavy Mammoth: high domed woolly back, massive shoulders, low hindquarters, broad head, large body-owned ears, long connected trunk, paired connected ivory tusks, short tail, four short weight-bearing legs, and four broad separated feet. Preserve trunk, tusks, face, dome, and four-foot mass in every relevant view. Avoid antlers, curled horns, long cervid legs, canine posture, reduced Rhino proportions, detached components, or baked effects.',
  effectBoundary: EN_E10_MAMMOTH_TOPOLOGY_DECISION.effectBoundary,
});

export const EN_E10_TUNDRAHIDE_GRAZER_CONTRACT = deepFreeze({
  sliceId: 'EN-E10',
  family: 'mammoth',
  variant: 'tundrahide-grazer',
  role: 'common',
  state: 'implemented-complete-motion-approved',
  topology: EN_E10_MAMMOTH_TOPOLOGY_DECISION.selected,
  chassis: 'baked-single-actor-storm-taupe-domed-wool-broad-head-connected-trunk-paired-tusks-four-broad-foot-mammoth-v1',
  silhouette: 'A grounded common Mammoth with a high domed woolly back, massive shoulders, low hindquarters, broad head, large connected ears, long body-owned trunk, paired connected forward-curving tusks, a short tail, four short weight-bearing legs, and four separated broad feet. It must read heavier and lower than Gloamcrown Sovereign and Cragcrown Patriarch while remaining unlike a reduced Furious Depraved Rhino Boss, long-backed Dire Wolf, antlered Stag, or ring-horned Ram.',
  visualIdentity: 'Storm-taupe wool, charcoal-brown lower body and feet, a warm stone face, frost-ivory tusks, pale sand belly, muted blue-green tundra bands, weathered rose ears, amber eyes, and near-black broad feet establish the Tundrahide Grazer. Every mark belongs to the actor; dust, snow, breath, debris, shock rings, tusk trails, impacts, particles, projectiles, glow, and illumination remain external.',
  effectBoundary: EN_E10_MAMMOTH_CONTRACT_CARD.effectBoundary,
});

export const EN_E10_TUNDRAHIDE_GRAZER_DATA = deepFreeze({
  actor: {
    species: 'authored-mammoth-common',
    bodyBuild: 'high-domed-massive-shouldered-low-rumped-four-broad-foot-heavy-quadruped',
    skin: 'storm-taupe-wool',
    hairStyle: 'connected-domed-wool-brow-belly-and-short-tail',
    hairColor: 'storm-taupe',
    expression: 'steady-amber-tundra-gaze',
    faceDetail: 'broad-stone-face-large-rose-ears-amber-eyes-connected-trunk-and-paired-frost-ivory-tusks',
    headgear: 'body-owned-paired-frost-ivory-tusks',
    outfit: 'body-owned-pale-sand-belly-and-muted-tundra-bands',
    outfitColor: 'storm-taupe-charcoal-stone-ivory-sand-tundra-blue-green-rose-and-amber',
    outfitTier: 'tier1',
    weapon: 'body-owned-trunk-lift-into-tusk-shove',
    weaponTier: 'none',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: { skin: COLORS.wool, hair: COLORS.face, outfit: COLORS.belly },
  },
  tundrahideGrazer: COLORS,
  actorTopology: EN_E10_MAMMOTH_TOPOLOGY_DECISION.selected,
  childAssets: [],
  alphaPolicy: 'binary-single-component-storm-taupe-high-domed-wool-broad-head-large-ears-connected-trunk-paired-tusks-short-tail-four-short-legs-and-four-grounded-broad-feet',
  effectBoundary: EN_E10_MAMMOTH_CONTRACT_CARD.effectBoundary,
  bakedEffects: [],
});

export const EN_E10_TUNDRAHIDE_GRAZER_GATE = deepFreeze({
  id: 'en-e10-mammoth-tundrahide-grazer-full-v1',
  status: 'approved',
  baseCheckpoint: 'c371e7ffeb3dd9196c29b9236d62585d96a52585',
  authorizedOn: '2026-08-13',
  authorizationEvidence: EN_E10_MAMMOTH_TOPOLOGY_DECISION.approvalEvidence,
  architectureDecision: EN_E10_MAMMOTH_TOPOLOGY_DECISION.id,
  approvedOn: '2026-08-13',
  approvalEvidence: 'The exact labeled all-four-direction raw/no-outline, distinct Complete B outlined, Complete B + Form, and approved Gloamcrown Sovereign and Cragcrown Patriarch plus public Dire Wolf comparison PNGs were frozen with both synchronized GIF hashes. The Aseprite review session reported those exact four paths open together as raw sprite 155, outlined sprite 159, Complete B + Form sprite 163, and active comparison sprite 167. The final approval prompt posted all four exact PNGs, both synchronized GIFs, and candidate digest 740960848a5a45941a908b8f32d53a6426de789f7ca002817309e7506dcd3e08. The designer replied: awesome klets do next. Approval applies only to that exact Tundrahide Grazer digest and its six frozen review hashes. The continuation suffix is held until the bounded publication tuple is clean and remote verified, after which it opens exactly one private specialist Mammoth under the selected baked-single-actor-tusked-heavy-grounded-quadruped topology. It does not authorize public Mammoth or outline registration, fixtures, effects, child assets, elite Mammoth, Rhino, Rhino Boss work, Runic Idol, release, accepted drift, a pull request, or any broader gate.',
  approvedImplementation: 'f0ced3c777c478a4077fb439ccd8b4b363ea52ac',
  publicationAuthorizedOn: '2026-08-13',
  publicationAuthorizationEvidence: 'The designer previously said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact frozen artifact or digest. It does not authorize registration, fixtures, effects, child assets, later roles or families, release, accepted drift, or a pull request.',
  publishedImplementation: '',
  publishedApprovalRecord: '',
  initialPublishedHandoff: '',
  publicationState: 'approved-not-published',
  precedingApproval: {
    gateId: EN_E10_GLOAMCROWN_SOVEREIGN_GATE.id,
    artifactSha256: EN_E10_GLOAMCROWN_SOVEREIGN_GATE.artifactSha256,
    outlinedArtifactSha256: EN_E10_GLOAMCROWN_SOVEREIGN_GATE.outlinedArtifactSha256,
    assembledArtifactSha256: EN_E10_GLOAMCROWN_SOVEREIGN_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E10_GLOAMCROWN_SOVEREIGN_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E10_GLOAMCROWN_SOVEREIGN_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E10_GLOAMCROWN_SOVEREIGN_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E10_GLOAMCROWN_SOVEREIGN_GATE.candidateFrameDigest,
    publishedImplementation: EN_E10_GLOAMCROWN_SOVEREIGN_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E10_GLOAMCROWN_SOVEREIGN_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E10_GLOAMCROWN_SOVEREIGN_GATE.initialPublishedHandoff,
    currentReconciliation: 'c371e7ffeb3dd9196c29b9236d62585d96a52585',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e10-mammoth-tundrahide-grazer/en-e10-mammoth-tundrahide-grazer-full-suite-raw.png',
  artifactSha256: '8e0f30182ce187fcd2742c6d6dde9e7ef6d8716cdef562e6279cf09ea1ead1f6',
  outlinedArtifact: 'enemy-expansion-review/en-e10-mammoth-tundrahide-grazer/en-e10-mammoth-tundrahide-grazer-full-suite-outlined-complete-b.png',
  outlinedArtifactSha256: '9baac7da2784068bb775b1b705a79d66e80db23e5750fff91e3d76b89a77fec2',
  assembledArtifact: 'enemy-expansion-review/en-e10-mammoth-tundrahide-grazer/en-e10-mammoth-tundrahide-grazer-full-suite-complete-b-form.png',
  assembledArtifactSha256: '658ec1817f40c58cf2de9d2bd0b9d752f863aeca82d4892908dd50d0cbe85d80',
  comparisonArtifact: 'enemy-expansion-review/en-e10-mammoth-tundrahide-grazer/en-e10-mammoth-tundrahide-grazer-family-comparison.png',
  comparisonArtifactSha256: 'b8e289487c3130e1a199f4637c1106ac69238df4b3935915c79090cf3d0c044d',
  reviewAnimations: {
    raw: { artifact: 'enemy-expansion-review/en-e10-mammoth-tundrahide-grazer/en-e10-mammoth-tundrahide-grazer-full-suite-four-directions-labeled.gif', sha256: 'fdfc4ff68c913df89807a85ccb0a803b6d04612ca1ff87c62bbaea79488a045d', width: 640, height: 672, frames: 4, durationMs: 180 },
    completeBForm: { artifact: 'enemy-expansion-review/en-e10-mammoth-tundrahide-grazer/en-e10-mammoth-tundrahide-grazer-full-suite-four-directions-labeled-complete-b-form.gif', sha256: '497eee4fadf8ceb6d4cd0b3cc096b676757aea95a51f92346d9a34089a473e97', width: 640, height: 672, frames: 4, durationMs: 180 },
  },
  candidateFrameDigest: '740960848a5a45941a908b8f32d53a6426de789f7ca002817309e7506dcd3e08',
  gloamcrownComparisonDigest: EN_E10_GLOAMCROWN_SOVEREIGN_GATE.candidateFrameDigest,
  cragcrownComparisonDigest: 'b8c7159c1d85689b3b9178179464b54e01a7ae538a1bda0036eb731d7d7d6c0a',
  direWolfComparisonDigest: 'a94a66ee380cfcb91db3907a3a049dae4b59357870857c3ed31be259bb1f1579',
  scope: 'One complete 80-frame Tundrahide Grazer common Mammoth across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle settles the connected trunk and domed wool over a planted four-foot stance. Walk uses four slow alternating broad-foot weight transfers while the shoulder mass, face, ears, trunk, and tusks stay readable. Attack braces, lifts the connected trunk, performs one body-owned tusk shove with no trail or impact pixels, and recovers. Hurt uses a complete white recoil and colored four-foot brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline board, distinct Complete B outlined board, Complete B + Form board, synchronized raw and Complete B + Form GIFs, and approved Gloamcrown Sovereign and Cragcrown Patriarch plus public Dire Wolf comparisons together.',
  exclusions: [
    'changes to approved Gloamcrown Sovereign or Cragcrown Patriarch rendered pixels',
    'changes to public Dire Wolf pixels',
    'public Mammoth registration or outline registration',
    'public catalog or facade exposure',
    'asset-pack fixture or manifest changes',
    'schema, shared renderer, exporter, validator, or frame-contract changes',
    'detached trunk, tusks, ears, tail, or child assets',
    'new Cast pixels or new Death pixels',
    'dust, snow, breath, debris, shock rings, tusk trails, impacts, particles, projectiles, glow, illumination, or effects',
    'specialist or elite Mammoth variants',
    'Rhino or Furious Depraved Rhino Boss changes',
    'Runic Idol or other EN-E09 work',
    'release, accepted drift, or pull request',
  ],
  nextGate: 'The exact Tundrahide Grazer packet is visually approved at implementation f0ced3c777c478a4077fb439ccd8b4b363ea52ac. Standing publication permission opens only its approval record, branch push, and bounded handoff reconciliation. The designer reply includes lets do next, but that suffix remains held until this exact publication tuple is clean and remote verified; it then opens exactly one private specialist Mammoth under the selected baked-single-actor-tusked-heavy-grounded-quadruped topology. The distinct outlined PNG remains review evidence only and does not authorize outline registration. Public Mammoth registration, fixtures, effects, child assets, elite Mammoth, Rhino, Rhino Boss work, Runic Idol, release, accepted drift, and a pull request remain closed.',
});

export const EN_E10_TUNDRAHIDE_GRAZER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'connected-trunk-tundra-watch', pose: 'idle', bob: 0, head: 0, trunk: 'down', reach: 0, lateral: 0, stride: [0, 0, 0, 0] },
  { name: 'domed-wool-heavy-settle', pose: 'idle', bob: 1, head: 0, trunk: 'curl', reach: 0, lateral: 0, stride: [0, 0, 0, 0] },
]);

const WALK_PHASES = deepFreeze([
  { name: 'near-fore-far-hind-broad-plant', pose: 'walk', bob: 0, head: 0, trunk: 'down', reach: 0, lateral: 0, stride: [-1, 1, 0, -1] },
  { name: 'massive-shoulder-forward-rise', pose: 'walk', bob: -1, head: 0, trunk: 'curl', reach: 0, lateral: 1, stride: [0, 1, -1, 0] },
  { name: 'far-fore-near-hind-broad-plant', pose: 'walk', bob: 0, head: 1, trunk: 'down', reach: 0, lateral: 0, stride: [1, -1, 0, 1] },
  { name: 'four-foot-weight-switch', pose: 'walk', bob: 1, head: 0, trunk: 'curl', reach: 0, lateral: -1, stride: [0, -1, 1, 0] },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'four-broad-foot-tusk-brace', pose: 'brace', bob: 0, head: 0, trunk: 'down', reach: 0, lateral: 0, stride: [-1, 0, 1, 0] },
  { name: 'body-owned-connected-trunk-lift', pose: 'lift', bob: -1, head: -1, trunk: 'lift', reach: 0, lateral: 1, stride: [-1, 1, 1, -1] },
  { name: 'paired-tusk-heavy-shove', pose: 'shove', bob: 0, head: 1, trunk: 'shove', reach: -1, lateral: -1, stride: [-1, 1, 1, -1] },
  { name: 'effect-free-tundra-recover', pose: 'recover', bob: 1, head: 0, trunk: 'curl', reach: 0, lateral: 0, stride: [0, -1, -1, 0] },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-tundrahide-recoil', pose: 'hurt', bob: -1, head: 0, trunk: 'curl', reach: 0, lateral: -1, stride: [0, 0, 0, 0], flash: true },
  { name: 'colored-four-broad-foot-brace', pose: 'hurt-brace', bob: 1, head: 1, trunk: 'down', reach: -1, lateral: 1, stride: [-1, 1, 1, -1], flash: false },
]);

function createPixels() { return new Array(SIZE * SIZE).fill(null); }

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert([x, y, width, height].every(Number.isInteger) && width > 0 && height > 0, 'Tundrahide Grazer geometry must use positive integers.');
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Tundrahide Grazer pixels must remain inside 24x24.');
      pixels[(py * SIZE) + px] = fill;
    }
  };
  return { rect, dot(x, y, fill) { rect(x, y, 1, 1, fill); } };
}

function drawSideLegs(paint, bodyY, stride) {
  const positions = [6, 10, 15, 19];
  for (let index = 0; index < positions.length; index++) {
    const footX = positions[index];
    const upperX = Math.max(5, Math.min(20, footX + stride[index]));
    const legY = 14 + bodyY;
    const anchorX = Math.max(8, Math.min(19, upperX));
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
    const anchorX = Math.max(6 + lateral, Math.min(18 + lateral, upperX));
    const color = index === 0 || index === 3 ? COLORS.wool[1] : COLORS.face[0];
    paint.rect(Math.min(anchorX, upperX), legY, Math.abs(anchorX - upperX) + 2, 2, color);
    paint.rect(upperX, legY, 2, 7 - bodyY, color);
    paint.rect(footX, 20, 2, 2, COLORS.face[1]);
    paint.rect(footX, 22, 2, 1, COLORS.foot);
  }
}

function drawSideTrunk(paint, headX, headY, mode) {
  const baseX = headX + 1;
  const baseY = headY + 4;
  if (mode === 'lift') {
    paint.rect(baseX + 1, baseY, 2, 3, COLORS.face[0]);
    paint.rect(baseX, baseY - 1, 2, 2, COLORS.face[2]);
    paint.rect(Math.max(1, baseX - 2), baseY - 2, 3, 1, COLORS.face[0]);
  } else if (mode === 'shove') {
    paint.rect(baseX + 1, baseY, 2, 3, COLORS.face[0]);
    paint.rect(Math.max(1, baseX - 2), baseY + 1, 4, 2, COLORS.face[2]);
    paint.rect(Math.max(1, baseX - 3), baseY, 2, 1, COLORS.face[0]);
  } else {
    paint.rect(baseX + 1, baseY, 2, 6, COLORS.face[0]);
    paint.rect(baseX, baseY + 5, 2, 3, COLORS.face[2]);
    if (mode === 'curl') paint.rect(baseX + 1, baseY + 7, 2, 1, COLORS.face[0]);
    else paint.dot(baseX, baseY + 8, COLORS.face[0]);
  }
}

function drawSide(paint, phase) {
  const y = phase.bob;
  const headX = Math.max(2, 3 + phase.reach);
  const headY = 7 + y + phase.head;

  paint.rect(8, 6 + y, 13, 9, COLORS.wool[0]);
  paint.rect(10, 4 + y, 8, 3, COLORS.wool[2]);
  paint.rect(7, 7 + y, 5, 9, COLORS.wool[2]);
  paint.rect(18, 8 + y, 4, 7, COLORS.wool[1]);
  paint.rect(10, 13 + y, 9, 3, COLORS.belly[0]);
  paint.rect(12, 6 + y, 4, 2, COLORS.frost[0]);
  paint.rect(16, 8 + y, 4, 2, COLORS.frost[1]);

  paint.rect(headX + 2, headY, 6, 6, COLORS.face[0]);
  paint.rect(headX + 3, headY + 1, 5, 5, COLORS.face[2]);
  paint.rect(headX + 6, headY - 1, 4, 5, COLORS.ear[0]);
  paint.rect(headX + 7, headY, 2, 3, COLORS.ear[1]);
  drawSideTrunk(paint, headX, headY, phase.trunk);
  paint.rect(headX + 1, headY + 5, 3, 1, COLORS.tusk[2]);
  paint.rect(headX, headY + 6, 2, 1, COLORS.tusk[0]);
  paint.dot(Math.max(1, headX - 1), headY + 6, COLORS.tusk[1]);
  paint.dot(Math.max(1, headX - 1), headY + 7, COLORS.tusk[1]);
  paint.dot(headX + 4, headY + 2, COLORS.eye);
  paint.dot(headX + 2, headY + 3, COLORS.feature);

  paint.rect(21, 9 + y, 2, 3, COLORS.wool[0]);
  paint.rect(22, 11 + y, 1, 4, COLORS.wool[1]);
  paint.rect(8, 10 + y, 3, 2, COLORS.belly[2]);
  paint.dot(10, 8 + y, COLORS.frost[1]);
  drawSideLegs(paint, y, phase.stride);
}

function drawFrontTrunk(paint, x, headTop, mode) {
  if (mode === 'lift') {
    paint.rect(11 + x, headTop + 4, 3, 3, COLORS.face[0]);
    paint.rect(9 + x, headTop + 3, 3, 2, COLORS.face[2]);
    paint.rect(8 + x, headTop + 2, 2, 1, COLORS.face[0]);
  } else if (mode === 'shove') {
    paint.rect(11 + x, headTop + 4, 3, 4, COLORS.face[0]);
    paint.rect(9 + x, headTop + 7, 5, 2, COLORS.face[2]);
  } else {
    paint.rect(11 + x, headTop + 4, 3, 7, COLORS.face[0]);
    paint.rect(12 + x, headTop + 10, 2, 3, COLORS.face[2]);
    if (mode === 'curl') paint.rect(11 + x, headTop + 12, 2, 1, COLORS.face[0]);
  }
}

function drawDown(paint, phase) {
  const y = phase.bob;
  const x = phase.lateral;
  const headTop = 7 + y + phase.head;

  paint.rect(5 + x, 6 + y, 15, 11, COLORS.wool[0]);
  paint.rect(7 + x, 4 + y, 11, 4, COLORS.wool[2]);
  paint.rect(6 + x, 13 + y, 13, 4, COLORS.belly[0]);
  paint.rect(8 + x, 6 + y, 4, 2, COLORS.frost[0]);
  paint.rect(13 + x, 7 + y, 4, 2, COLORS.frost[1]);
  paint.rect(7 + x, headTop, 11, 6, COLORS.face[0]);
  paint.rect(8 + x, headTop + 1, 9, 5, COLORS.face[2]);
  paint.rect(4 + x, headTop, 4, 5, COLORS.ear[0]);
  paint.rect(17 + x, headTop, 4, 5, COLORS.ear[0]);
  paint.rect(5 + x, headTop + 1, 2, 3, COLORS.ear[1]);
  paint.rect(18 + x, headTop + 1, 2, 3, COLORS.ear[1]);
  drawFrontTrunk(paint, x, headTop, phase.trunk);

  paint.rect(8 + x, headTop + 4, 3, 1, COLORS.tusk[2]);
  paint.rect(7 + x, headTop + 5, 3, 1, COLORS.tusk[0]);
  paint.dot(7 + x, headTop + 6, COLORS.tusk[1]);
  paint.rect(14 + x, headTop + 4, 3, 1, COLORS.tusk[2]);
  paint.rect(15 + x, headTop + 5, 3, 1, COLORS.tusk[0]);
  paint.dot(17 + x, headTop + 6, COLORS.tusk[1]);
  paint.dot(9 + x, headTop + 2, COLORS.eye);
  paint.dot(15 + x, headTop + 2, COLORS.eye);
  paint.dot(11 + x, headTop + 4, COLORS.feature);
  paint.dot(13 + x, headTop + 4, COLORS.feature);
  paint.rect(5 + x, 12 + y, 2, 1, COLORS.frost[0]);
  paint.rect(18 + x, 9 + y, 4, 3, COLORS.wool[1]);
  paint.rect(21 + x, 11 + y, 1, 4, COLORS.wool[1]);
  drawEndLegs(paint, y, phase.stride, x);
}

function drawUp(paint, phase) {
  const y = phase.bob;
  const x = phase.lateral;
  const headTop = 7 + y + phase.head;

  paint.rect(5 + x, 6 + y, 15, 11, COLORS.wool[0]);
  paint.rect(7 + x, 4 + y, 11, 4, COLORS.wool[2]);
  paint.rect(6 + x, 13 + y, 13, 4, COLORS.wool[1]);
  paint.rect(7 + x, headTop, 11, 6, COLORS.face[0]);
  paint.rect(8 + x, headTop + 2, 9, 4, COLORS.wool[2]);
  paint.rect(4 + x, headTop, 4, 5, COLORS.ear[1]);
  paint.rect(17 + x, headTop, 4, 5, COLORS.ear[1]);
  paint.rect(7 + x, 7 + y, 5, 2, COLORS.frost[0]);
  paint.rect(13 + x, 8 + y, 5, 2, COLORS.frost[1]);
  paint.rect(10 + x, 12 + y, 5, 3, COLORS.belly[1]);
  paint.rect(18 + x, 9 + y, 4, 3, COLORS.wool[1]);
  paint.rect(21 + x, 11 + y, 1, 4, COLORS.wool[1]);
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
  if (animation === 'death') { assert(frame >= 0 && frame < 4, 'Frame ' + frame + ' is invalid for death.'); return HURT_PHASES[EN_E10_TUNDRAHIDE_GRAZER_DEATH_SOURCE_FRAMES[frame]]; }
  throw new TypeError('Animation ' + animation + ' is not implemented for Tundrahide Grazer.');
}

function buildPixels(direction, animation, frame) {
  const phase = phaseFor(animation, frame);
  const canonical = direction === 'right' ? 'left' : direction;
  const pixels = createPixels();
  const paint = painter(pixels);
  if (canonical === 'down') drawDown(paint, phase);
  else if (canonical === 'up') drawUp(paint, phase);
  else if (canonical === 'left') drawSide(paint, phase);
  else throw new TypeError('Unsupported Tundrahide Grazer direction ' + direction + '.');
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

export function renderEnE10TundrahideGrazerFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Tundrahide Grazer rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Tundrahide Grazer direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'mammoth', variant: 'tundrahide-grazer', direction, animation, frame,
    phase: phase.name,
    tundrahideGrazerGate: EN_E10_TUNDRAHIDE_GRAZER_GATE.id,
    architectureDecision: EN_E10_MAMMOTH_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E10_GLOAMCROWN_SOVEREIGN_GATE.id,
    actorTopology: EN_E10_TUNDRAHIDE_GRAZER_DATA.actorTopology,
    childAssetCount: EN_E10_TUNDRAHIDE_GRAZER_DATA.childAssets.length,
    alphaPolicy: EN_E10_TUNDRAHIDE_GRAZER_DATA.alphaPolicy,
    effectBoundary: EN_E10_TUNDRAHIDE_GRAZER_DATA.effectBoundary,
  });
}

export const EN_E10_TUNDRAHIDE_GRAZER_RENDERER = deepFreeze({
  key: 'en-e10-mammoth-tundrahide-grazer-v1',
  chassis: EN_E10_TUNDRAHIDE_GRAZER_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'mammoth', 'The EN-E10 Tundrahide Grazer renderer is restricted to Mammoth.');
    assert(variant.id === 'tundrahide-grazer', 'The EN-E10 Tundrahide Grazer renderer is restricted to Tundrahide Grazer.');
    return renderEnE10TundrahideGrazerFrame(context, direction, animation.id, frame);
  },
});

const TUNDRAHIDE_GRAZER_VARIANT = deepFreeze({
  id: 'tundrahide-grazer',
  name: 'Tundrahide Grazer',
  role: EN_E10_TUNDRAHIDE_GRAZER_CONTRACT.role,
  status: EN_E10_TUNDRAHIDE_GRAZER_CONTRACT.state,
  brief: 'A private complete common Mammoth with a storm-taupe high-domed woolly body, warm stone face, large rose ears, connected trunk, paired frost-ivory tusks, pale sand belly, tundra bands, amber eyes, short tail, four broad feet, and a body-owned trunk lift into a tusk shove; all effects remain external.',
  rendererData: EN_E10_TUNDRAHIDE_GRAZER_DATA,
});

export const EN_E10_TUNDRAHIDE_GRAZER_FAMILY = deepFreeze({
  id: 'mammoth',
  name: 'Mammoth Tundrahide Grazer Review',
  sliceId: 'EN-E10',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E10_TUNDRAHIDE_GRAZER_CONTRACT.chassis,
  rendererKey: EN_E10_TUNDRAHIDE_GRAZER_RENDERER.key,
  variants: [TUNDRAHIDE_GRAZER_VARIANT],
  rendererData: {
    contractCard: EN_E10_MAMMOTH_CONTRACT_CARD.id,
    architectureDecision: EN_E10_MAMMOTH_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E10_GLOAMCROWN_SOVEREIGN_GATE.id,
    activeGate: EN_E10_TUNDRAHIDE_GRAZER_GATE.id,
  },
  review: {
    baselineVariant: 'tundrahide-grazer',
    scale: 8,
    notes: 'Visually approved as one exact private common Mammoth against approved Gloamcrown Sovereign and Cragcrown Patriarch plus public Dire Wolf. Accepted implementation f0ced3c777c478a4077fb439ccd8b4b363ea52ac records only the frozen packet. The distinct Complete B outlined PNG remains review evidence only. Standing permission opens only bounded approval publication and reconciliation. The lets do next suffix is held until that tuple is clean and remote verified, then opens exactly one private specialist Mammoth under the selected topology; keep public or outline registration, fixtures, effects, child assets, elite Mammoth, Rhino, Rhino Boss work, deferred Runic Idol, release, accepted drift, and a pull request separate.',
  },
});

export const EN_E10_TUNDRAHIDE_GRAZER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E10_TUNDRAHIDE_GRAZER_RENDERER],
  families: [EN_E10_TUNDRAHIDE_GRAZER_FAMILY],
});
