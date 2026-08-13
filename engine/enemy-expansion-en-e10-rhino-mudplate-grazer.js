import { SIZE } from './catalogs.js';
import { createEnemyExpansionRegistry, ENEMY_EXPANSION_STATES } from './enemy-expansion.js';
import { EN_E10_RIMEVAULT_MATRIARCH_GATE } from './enemy-expansion-en-e10-mammoth-rimevault-matriarch.js';

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
  hide: ['#786f54', '#403d31', '#a69a72'],
  plate: ['#908563', '#5a5540', '#b9aa7b'],
  muzzle: ['#685e49', '#332f28', '#928169'],
  horn: ['#d5c99d', '#81765b', '#f0e5b8'],
  belly: ['#86795c', '#4d4938', '#ad9d75'],
  clay: ['#9b6a4c', '#6b4635'],
  ear: ['#86614e', '#543d35'],
  foot: '#22221d',
  feature: '#151511',
  eye: '#dfb75a',
  flash: '#f4f4f4',
});

export const EN_E10_RHINO_TOPOLOGY_DECISION = deepFreeze({
  id: 'en-e10-rhino-actor-topology-v1',
  sliceId: 'EN-E10',
  family: 'rhino',
  status: 'selected',
  selected: 'baked-single-actor-natural-plated-low-grounded-quadruped',
  selectedOn: '2026-08-13',
  approvalEvidence: 'The exact Rimevault Matriarch implementation 702a93964de696cb246ca144b0d9a946c81875c9, approval record 91e012e1682db1db0bb4cec0f692d86b19c962d1, initial published handoff 78c574c1b50e4b17e2a3a551500cbaf6d17c855e, and final reconciliation df7a918c2b8ef13476cbf363663d42eec7638809 were pushed and remote verified. The designer then said: lets do next. Codex opened only the ordinary-Rhino versus Furious Depraved Rhino Boss distinction decision and recommended one connected grounded 24x24 natural Rhino with a low long plated barrel, compact wedge head, one medium body-owned nasal horn and tiny secondary nub, small rounded ears, short connected tail, four stout legs, four separated broad three-toed feet, and a body-owned head dip into a short shoulder shove or horn jab. Child assets stay zero and every dust, wake, trail, impact, debris, particle, glow, roar mark, and illumination effect stays external. The designer replied: approved. This selects only baked-single-actor-natural-plated-low-grounded-quadruped and authorizes exactly one private common Rhino full 80-frame candidate. It does not approve candidate pixels or authorize publication, public or outline registration, fixtures, effects, child assets, specialist or elite Rhino, any Furious Depraved Rhino Boss change, Runic Idol, release, accepted drift, or a pull request.',
  alternatives: [
    'baked-single-actor-natural-plated-low-grounded-quadruped',
    'body-plus-detached-horn-and-plate-child-assets',
    'scaled-furious-depraved-rhino-boss-chassis',
  ],
  childAssets: [],
  effectBoundary: 'The baked actor owns only its connected natural hide, segmented plates, compact head, small ears, eyes, medium nasal horn, tiny secondary nub, low long barrel, belly, short tail, four stout legs, and four broad three-toed feet. Dust, wake, trails, impacts, debris, particles, projectiles, glow, roar marks, corruption, rage marks, restraint pieces, and illumination remain external or absent.',
});

export const EN_E10_RHINO_CONTRACT_CARD = deepFreeze({
  id: 'en-e10-rhino-mudplate-grazer-v1',
  sliceId: 'EN-E10',
  family: 'rhino',
  familyName: 'Rhino',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingFamily: {
    id: 'mammoth',
    variant: 'rimevault-matriarch',
    status: 'approved-published-reconciled',
    gateId: EN_E10_RIMEVAULT_MATRIARCH_GATE.id,
  },
  activeVariant: {
    id: 'mudplate-grazer',
    name: 'Mudplate Grazer',
    role: 'common',
    status: 'implemented-full-approved',
  },
  deferredRoles: ['specialist', 'elite'],
  actorTopology: EN_E10_RHINO_TOPOLOGY_DECISION.selected,
  styleContract: 'Use chunky one-to-three-pixel hard-alpha forms for a connected ordinary Rhino: a low long barrel with three natural hide-plate segments, a gentle shoulder shelf instead of a Boss hump, compact forward wedge head, one medium body-owned nasal horn and tiny secondary nub, two small rounded ears, short connected tail, four stout weight-bearing legs, and four separated broad three-toed feet. Preserve the horn, compact face, plates, low back line, and four-foot stance in every relevant view. Avoid a huge horn, crown-like head, high shoulder hump, harness, restraint links, rage brand, corruption, Mammoth dome or trunk, Ram rings, detached components, and baked effects.',
  effectBoundary: EN_E10_RHINO_TOPOLOGY_DECISION.effectBoundary,
});

export const EN_E10_MUDPLATE_GRAZER_CONTRACT = deepFreeze({
  sliceId: 'EN-E10',
  family: 'rhino',
  variant: 'mudplate-grazer',
  role: 'common',
  state: 'implemented-complete-motion-approved',
  topology: EN_E10_RHINO_TOPOLOGY_DECISION.selected,
  chassis: 'baked-single-actor-warm-olive-clay-low-plated-compact-wedge-head-medium-horn-four-three-toed-foot-rhino-v1',
  silhouette: 'A grounded ordinary Rhino with a low long plated barrel, only a gentle shoulder shelf, compact forward wedge head, one medium nasal horn with a tiny secondary nub, two small rounded ears, short tail, four stout legs, and four separated broad three-toed feet. It must read lower and more restrained than Tundrahide Grazer and Cragcrown Patriarch while remaining unmistakably smaller, flatter, naturally plated, and less armed than the 48x48 Furious Depraved Rhino Boss.',
  visualIdentity: 'Warm olive-taupe hide, lighter natural plate shelves, a clay-brown flank patch, dark umber muzzle and feet, muted rose-brown ears, old-ivory medium horn and tiny nub, amber eyes, and broad three-toed foot caps establish the Mudplate Grazer. It has no harness, broken restraints, red rage brand, violet corruption, or Boss effects. Every mark belongs to the actor; dust, wake, trails, impacts, debris, particles, projectiles, glow, roar marks, and illumination remain external.',
  effectBoundary: EN_E10_RHINO_CONTRACT_CARD.effectBoundary,
});

export const EN_E10_MUDPLATE_GRAZER_DATA = deepFreeze({
  actor: {
    species: 'authored-rhino-common',
    bodyBuild: 'low-long-gently-shouldered-three-plate-four-stout-leg-three-toed-foot-ordinary-quadruped',
    skin: 'warm-olive-taupe-natural-hide-plates',
    hairStyle: 'none-short-connected-tail-only',
    hairColor: 'warm-olive-taupe',
    expression: 'calm-amber-grounded-gaze',
    faceDetail: 'compact-umber-wedge-muzzle-small-rounded-ears-amber-eyes-medium-old-ivory-nasal-horn-and-tiny-nub',
    headgear: 'body-owned-medium-nasal-horn-and-tiny-secondary-nub',
    outfit: 'body-owned-natural-hide-plates-and-clay-flank-patch',
    outfitColor: 'warm-olive-taupe-clay-umber-old-ivory-rose-brown-and-amber',
    outfitTier: 'tier1',
    weapon: 'body-owned-head-dip-into-short-shoulder-shove-and-horn-jab',
    weaponTier: 'none',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: { skin: COLORS.hide, hair: COLORS.muzzle, outfit: COLORS.plate },
  },
  mudplateGrazer: COLORS,
  actorTopology: EN_E10_RHINO_TOPOLOGY_DECISION.selected,
  childAssets: [],
  alphaPolicy: 'binary-single-component-warm-olive-clay-low-long-three-plate-compact-wedge-head-medium-horn-tiny-nub-small-ears-short-tail-four-stout-legs-and-four-grounded-three-toed-feet',
  effectBoundary: EN_E10_RHINO_CONTRACT_CARD.effectBoundary,
  bakedEffects: [],
});

export const EN_E10_MUDPLATE_GRAZER_GATE = deepFreeze({
  id: 'en-e10-rhino-mudplate-grazer-full-v1',
  status: 'approved',
  baseCheckpoint: 'df7a918c2b8ef13476cbf363663d42eec7638809',
  authorizedOn: '2026-08-13',
  authorizationEvidence: EN_E10_RHINO_TOPOLOGY_DECISION.approvalEvidence,
  architectureDecision: EN_E10_RHINO_TOPOLOGY_DECISION.id,
  approvedOn: '2026-08-13',
  approvalEvidence: 'The exact labeled all-four-direction raw/no-outline, distinct Complete B outlined, Complete B + Form, and approved Tundrahide Grazer and Cragcrown Patriarch plus public Dire Wolf comparison PNGs were frozen with both synchronized GIF hashes. The protected Furious Depraved Rhino Boss direction and full-animation candidates were reviewed separately and remained byte-exact. The Aseprite MCP review session reported those exact four candidate paths open together as raw sprite 246, outlined sprite 250, Complete B + Form sprite 254, and active comparison sprite 258. The final approval prompt posted all four exact PNGs, both synchronized GIFs, and candidate digest ba84ed03d4985b979974ab23d547fb7f687d6e2b948d80c9ccc84bb9cd911848. The designer replied: approved and lets do next. Approval applies only to that exact Mudplate Grazer digest and its six frozen review hashes. The continuation suffix is held until the bounded publication tuple is clean and remote verified, after which it opens exactly one private specialist Rhino full 80-frame candidate on a new isolated branch under the selected baked-single-actor-natural-plated-low-grounded-quadruped topology. It does not authorize public Rhino or outline registration, fixtures, effects, child assets, elite Rhino, any Furious Depraved Rhino Boss change, Runic Idol, release, accepted drift, a pull request, or any broader gate.',
  approvedImplementation: '1e685159e6ddc09a20d853a511c9cfb448b502fe',
  publicationAuthorizedOn: '2026-08-13',
  publicationAuthorizationEvidence: 'The designer previously said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact frozen artifact or digest. It does not authorize registration, fixtures, effects, child assets, later roles or families, release, accepted drift, or a pull request.',
  publishedImplementation: '',
  publishedApprovalRecord: '',
  initialPublishedHandoff: '',
  publicationState: 'approved-not-published',
  precedingApproval: {
    gateId: EN_E10_RIMEVAULT_MATRIARCH_GATE.id,
    artifactSha256: EN_E10_RIMEVAULT_MATRIARCH_GATE.artifactSha256,
    outlinedArtifactSha256: EN_E10_RIMEVAULT_MATRIARCH_GATE.outlinedArtifactSha256,
    assembledArtifactSha256: EN_E10_RIMEVAULT_MATRIARCH_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E10_RIMEVAULT_MATRIARCH_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E10_RIMEVAULT_MATRIARCH_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E10_RIMEVAULT_MATRIARCH_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E10_RIMEVAULT_MATRIARCH_GATE.candidateFrameDigest,
    publishedImplementation: EN_E10_RIMEVAULT_MATRIARCH_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E10_RIMEVAULT_MATRIARCH_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E10_RIMEVAULT_MATRIARCH_GATE.initialPublishedHandoff,
    currentReconciliation: 'df7a918c2b8ef13476cbf363663d42eec7638809',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e10-rhino-mudplate-grazer/en-e10-rhino-mudplate-grazer-full-suite-raw.png',
  artifactSha256: 'bf6ad4e767e45a1bdaf1b617d3fc1ba56fad28c80d5a806c22f4737e45e98118',
  outlinedArtifact: 'enemy-expansion-review/en-e10-rhino-mudplate-grazer/en-e10-rhino-mudplate-grazer-full-suite-outlined-complete-b.png',
  outlinedArtifactSha256: '88e2bf1f9e7f9446829e7db533adf65d9a804ef9146478a1ffc5ece335daf4b8',
  assembledArtifact: 'enemy-expansion-review/en-e10-rhino-mudplate-grazer/en-e10-rhino-mudplate-grazer-full-suite-complete-b-form.png',
  assembledArtifactSha256: '98a85184de5d607003415123e5a24ed1d41c1de515163146d8cbdc6d1a02974d',
  comparisonArtifact: 'enemy-expansion-review/en-e10-rhino-mudplate-grazer/en-e10-rhino-mudplate-grazer-family-comparison.png',
  comparisonArtifactSha256: '918e4a311d2223fbd472683d002e4b9d140dc044c6dc2586e5b380f8efe4b2a4',
  reviewAnimations: {
    raw: { artifact: 'enemy-expansion-review/en-e10-rhino-mudplate-grazer/en-e10-rhino-mudplate-grazer-full-suite-four-directions-labeled.gif', sha256: '66496991b74420e5cc9d9fe86f51c78cded24208a88c05c28a24be38bfab63b8', width: 640, height: 672, frames: 4, durationMs: 180 },
    completeBForm: { artifact: 'enemy-expansion-review/en-e10-rhino-mudplate-grazer/en-e10-rhino-mudplate-grazer-full-suite-four-directions-labeled-complete-b-form.gif', sha256: '39dba84ff75d445146fb897d17b967bf429b02fe860f1be2cefab2f54f1d49e5', width: 640, height: 672, frames: 4, durationMs: 180 },
  },
  candidateFrameDigest: 'ba84ed03d4985b979974ab23d547fb7f687d6e2b948d80c9ccc84bb9cd911848',
  tundrahideComparisonDigest: '740960848a5a45941a908b8f32d53a6426de789f7ca002817309e7506dcd3e08',
  cragcrownComparisonDigest: 'b8c7159c1d85689b3b9178179464b54e01a7ae538a1bda0036eb731d7d7d6c0a',
  direWolfComparisonDigest: 'a94a66ee380cfcb91db3907a3a049dae4b59357870857c3ed31be259bb1f1579',
  bossDistinction: {
    directionAsset: 'engine/assets/bosses/furious-depraved-rhino-directions-v1.png',
    directionSha256: '6ce979d356e986b207a09bf2e020fde25f2e4a496137fac96aa7bc6a567f2f86',
    animationAsset: 'engine/assets/bosses/furious-depraved-rhino-animation-v1-full.png',
    animationSha256: '7c87c58b4854f75ff8827f66fe29a78b36ee198865e1f6e8d3d4e18d66f46ceb',
    status: 'candidate-read-only',
  },
  scope: 'One complete 80-frame Mudplate Grazer common Rhino across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle settles the compact horned head over a planted four-foot stance. Walk uses four restrained alternating weight transfers while the low plate line, wedge face, ears, medium horn, tiny nub, and broad three-toed feet stay readable. Attack plants, dips the body-owned head, performs one short shoulder shove and horn jab with no charge wake, trail, flare, or impact pixels, and recovers. Hurt uses a complete white recoil and colored four-foot brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline board, distinct Complete B outlined board, Complete B + Form board, synchronized raw and Complete B + Form GIFs, approved Tundrahide Grazer and Cragcrown Patriarch plus public Dire Wolf comparisons, and the protected Furious Depraved Rhino Boss direction and full-animation candidates together.',
  exclusions: [
    'changes to approved Tundrahide Grazer or Cragcrown Patriarch rendered pixels',
    'changes to public Dire Wolf pixels',
    'public Rhino registration or outline registration',
    'public catalog or facade exposure',
    'asset-pack fixture or manifest changes',
    'schema, shared renderer, exporter, validator, or frame-contract changes',
    'detached horn, nub, plates, ears, tail, feet, or child assets',
    'new Cast pixels or new Death pixels',
    'dust, charge wake, trails, horn flare, roar marks, shards, debris, impacts, particles, projectiles, glow, illumination, corruption, rage marks, restraint pieces, or effects',
    'specialist or elite Rhino variants',
    'any Furious Depraved Rhino Boss source, catalog, roster, or asset change',
    'Runic Idol or other EN-E09 work',
    'release, accepted drift, or pull request',
  ],
  nextGate: 'The exact Mudplate Grazer packet is visually approved at implementation 1e685159e6ddc09a20d853a511c9cfb448b502fe. Standing publication permission opens only its approval record, branch push, and bounded handoff reconciliation. The designer continuation suffix is held until the publication tuple is clean and remote verified; no specialist Rhino work is open before then. The distinct outlined PNG remains review evidence only and does not authorize outline registration. Public Rhino registration, fixtures, effects, child assets, elite Rhino, every Boss change, Runic Idol, release, accepted drift, and a pull request remain closed.',
});

export const EN_E10_MUDPLATE_GRAZER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'low-plated-mudflat-watch', pose: 'idle', bob: 0, head: 0, horn: 'level', reach: 0, lateral: 0, stride: [0, 0, 0, 0] },
  { name: 'compact-horned-head-settle', pose: 'idle', bob: 1, head: -1, horn: 'level', reach: 0, lateral: 0, stride: [0, 0, 0, 0] },
]);

const WALK_PHASES = deepFreeze([
  { name: 'near-fore-far-hind-three-toe-plant', pose: 'walk', bob: 0, head: 0, horn: 'level', reach: 0, lateral: 0, stride: [-1, 1, 0, -1] },
  { name: 'gentle-shoulder-shelf-forward', pose: 'walk', bob: -1, head: 1, horn: 'level', reach: 0, lateral: 1, stride: [0, 1, -1, 0] },
  { name: 'far-fore-near-hind-three-toe-plant', pose: 'walk', bob: 0, head: 0, horn: 'level', reach: 0, lateral: 0, stride: [1, -1, 0, 1] },
  { name: 'low-barrel-weight-switch', pose: 'walk', bob: 1, head: -1, horn: 'level', reach: 0, lateral: -1, stride: [0, -1, 1, 0] },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'four-three-toed-foot-plant', pose: 'brace', bob: 0, head: 0, horn: 'level', reach: 0, lateral: 0, stride: [-1, 0, 1, 0] },
  { name: 'body-owned-compact-head-dip', pose: 'dip', bob: 1, head: 1, horn: 'dip', reach: 0, lateral: 1, stride: [-1, 1, 1, -1] },
  { name: 'short-shoulder-shove-and-horn-jab', pose: 'jab', bob: 0, head: 0, horn: 'jab', reach: -1, lateral: -1, stride: [-1, 1, 1, -1] },
  { name: 'effect-free-mudplate-recover', pose: 'recover', bob: 1, head: -1, horn: 'level', reach: 0, lateral: 0, stride: [0, -1, -1, 0] },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-mudplate-recoil', pose: 'hurt', bob: -1, head: 1, horn: 'level', reach: 0, lateral: -1, stride: [0, 0, 0, 0], flash: true },
  { name: 'colored-four-three-toed-foot-brace', pose: 'hurt-brace', bob: 1, head: 0, horn: 'level', reach: -1, lateral: 1, stride: [-1, 1, 1, -1], flash: false },
]);

function createPixels() { return new Array(SIZE * SIZE).fill(null); }

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert([x, y, width, height].every(Number.isInteger) && width > 0 && height > 0, 'Mudplate Grazer geometry must use positive integers.');
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Mudplate Grazer pixels must remain inside 24x24.');
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
  const hornY = headY + (mode === 'dip' ? 2 : 1);
  paint.rect(headX + 1, hornY - 1, 3, 2, COLORS.horn[1]);
  paint.rect(Math.max(1, headX - 1), hornY - 2, 3, 2, COLORS.horn[0]);
  paint.dot(Math.max(1, headX - (mode === 'jab' ? 1 : 0)), hornY - 2, COLORS.horn[2]);
  paint.rect(headX + 5, headY - 1, 1, 2, COLORS.horn[1]);
}

function drawSide(paint, phase) {
  const y = phase.bob;
  const headX = Math.max(1, 2 + phase.reach);
  const headY = 9 + y + phase.head;

  paint.rect(7, 7 + y, 15, 8, COLORS.hide[0]);
  paint.rect(7, 6 + y, 5, 4, COLORS.plate[2]);
  paint.rect(12, 7 + y, 5, 4, COLORS.plate[0]);
  paint.rect(17, 8 + y, 5, 4, COLORS.plate[1]);
  paint.rect(8, 10 + y, 3, 5, COLORS.hide[2]);
  paint.rect(10, 13 + y, 9, 3, COLORS.belly[0]);
  paint.rect(14, 10 + y, 4, 3, COLORS.clay[0]);
  paint.dot(18, 12 + y, COLORS.clay[1]);

  paint.rect(7, headY, 4, 5, COLORS.plate[0]);
  paint.rect(headX + 2, headY, 6, 5, COLORS.muzzle[0]);
  paint.rect(headX, headY + 2, 6, 3, COLORS.muzzle[2]);
  paint.rect(headX + 6, headY - 1, 2, 2, COLORS.ear[0]);
  paint.dot(headX + 7, headY - 1, COLORS.ear[1]);
  drawSideHorn(paint, headX, headY, phase.horn);
  paint.dot(headX + 4, headY + 2, COLORS.eye);
  paint.dot(headX + 1, headY + 3, COLORS.feature);

  paint.rect(21, 10 + y, 2, 2, COLORS.hide[0]);
  paint.rect(22, 11 + y, 1, 3, COLORS.hide[1]);
  paint.dot(11, 8 + y, COLORS.clay[1]);
  drawSideLegs(paint, y, phase.stride);
}

function drawFrontHorn(paint, x, headTop, mode) {
  const hornTop = headTop + (mode === 'dip' ? 5 : 4);
  paint.rect(11 + x, hornTop, 3, 2, COLORS.horn[1]);
  paint.rect(12 + x, hornTop + 1, 1, mode === 'jab' ? 5 : 4, COLORS.horn[0]);
  paint.dot(12 + x, hornTop + (mode === 'jab' ? 5 : 4), COLORS.horn[2]);
  paint.rect(12 + x, headTop + 2, 1, 2, COLORS.horn[1]);
}

function drawDown(paint, phase) {
  const y = phase.bob;
  const x = phase.lateral;
  const headTop = 9 + y + phase.head;

  paint.rect(4 + x, 7 + y, 17, 9, COLORS.hide[0]);
  paint.rect(5 + x, 6 + y, 5, 5, COLORS.plate[2]);
  paint.rect(10 + x, 7 + y, 5, 4, COLORS.plate[0]);
  paint.rect(15 + x, 8 + y, 5, 4, COLORS.plate[1]);
  paint.rect(6 + x, 13 + y, 13, 4, COLORS.belly[0]);
  paint.rect(7 + x, 10 + y, 4, 3, COLORS.clay[0]);
  paint.rect(14 + x, 11 + y, 4, 2, COLORS.clay[1]);
  paint.rect(8 + x, headTop, 9, 6, COLORS.muzzle[0]);
  paint.rect(9 + x, headTop + 2, 7, 5, COLORS.muzzle[2]);
  paint.rect(6 + x, headTop, 3, 2, COLORS.ear[0]);
  paint.rect(16 + x, headTop, 3, 2, COLORS.ear[0]);
  paint.dot(7 + x, headTop + 1, COLORS.ear[1]);
  paint.dot(17 + x, headTop + 1, COLORS.ear[1]);
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
  const headTop = 9 + y + phase.head;

  paint.rect(4 + x, 7 + y, 17, 9, COLORS.hide[0]);
  paint.rect(5 + x, 6 + y, 5, 5, COLORS.plate[2]);
  paint.rect(10 + x, 7 + y, 5, 4, COLORS.plate[0]);
  paint.rect(15 + x, 8 + y, 5, 4, COLORS.plate[1]);
  paint.rect(6 + x, 13 + y, 13, 4, COLORS.hide[1]);
  paint.rect(8 + x, headTop, 9, 6, COLORS.muzzle[0]);
  paint.rect(9 + x, headTop + 2, 7, 4, COLORS.plate[1]);
  paint.rect(6 + x, headTop, 3, 2, COLORS.ear[1]);
  paint.rect(16 + x, headTop, 3, 2, COLORS.ear[1]);
  paint.rect(7 + x, 10 + y, 4, 2, COLORS.clay[0]);
  paint.rect(14 + x, 11 + y, 4, 2, COLORS.clay[1]);
  paint.rect(10 + x, 12 + y, 5, 3, COLORS.belly[1]);
  paint.rect(11 + x, 15 + y, 3, 2, COLORS.hide[0]);
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
  if (animation === 'death') { assert(frame >= 0 && frame < 4, 'Frame ' + frame + ' is invalid for death.'); return HURT_PHASES[EN_E10_MUDPLATE_GRAZER_DEATH_SOURCE_FRAMES[frame]]; }
  throw new TypeError('Animation ' + animation + ' is not implemented for Mudplate Grazer.');
}

function buildPixels(direction, animation, frame) {
  const phase = phaseFor(animation, frame);
  const canonical = direction === 'right' ? 'left' : direction;
  const pixels = createPixels();
  const paint = painter(pixels);
  if (canonical === 'down') drawDown(paint, phase);
  else if (canonical === 'up') drawUp(paint, phase);
  else if (canonical === 'left') drawSide(paint, phase);
  else throw new TypeError('Unsupported Mudplate Grazer direction ' + direction + '.');
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

export function renderEnE10MudplateGrazerFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Mudplate Grazer rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Mudplate Grazer direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'rhino', variant: 'mudplate-grazer', direction, animation, frame,
    phase: phase.name,
    mudplateGrazerGate: EN_E10_MUDPLATE_GRAZER_GATE.id,
    architectureDecision: EN_E10_RHINO_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E10_RIMEVAULT_MATRIARCH_GATE.id,
    actorTopology: EN_E10_MUDPLATE_GRAZER_DATA.actorTopology,
    childAssetCount: EN_E10_MUDPLATE_GRAZER_DATA.childAssets.length,
    alphaPolicy: EN_E10_MUDPLATE_GRAZER_DATA.alphaPolicy,
    effectBoundary: EN_E10_MUDPLATE_GRAZER_DATA.effectBoundary,
  });
}

export const EN_E10_MUDPLATE_GRAZER_RENDERER = deepFreeze({
  key: 'en-e10-rhino-mudplate-grazer-v1',
  chassis: EN_E10_MUDPLATE_GRAZER_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'rhino', 'The EN-E10 Mudplate Grazer renderer is restricted to Rhino.');
    assert(variant.id === 'mudplate-grazer', 'The EN-E10 Mudplate Grazer renderer is restricted to Mudplate Grazer.');
    return renderEnE10MudplateGrazerFrame(context, direction, animation.id, frame);
  },
});

const MUDPLATE_GRAZER_VARIANT = deepFreeze({
  id: 'mudplate-grazer',
  name: 'Mudplate Grazer',
  role: EN_E10_MUDPLATE_GRAZER_CONTRACT.role,
  status: EN_E10_MUDPLATE_GRAZER_CONTRACT.state,
  brief: 'A private complete common Rhino with a low warm olive-taupe plated barrel, compact umber wedge head, small rose-brown ears, medium old-ivory nasal horn and tiny nub, clay flank patch, amber eyes, short tail, four stout legs, four broad three-toed feet, and a body-owned head dip into a short shoulder shove and horn jab; all effects remain external.',
  rendererData: EN_E10_MUDPLATE_GRAZER_DATA,
});

export const EN_E10_MUDPLATE_GRAZER_FAMILY = deepFreeze({
  id: 'rhino',
  name: 'Rhino Mudplate Grazer Review',
  sliceId: 'EN-E10',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E10_MUDPLATE_GRAZER_CONTRACT.chassis,
  rendererKey: EN_E10_MUDPLATE_GRAZER_RENDERER.key,
  variants: [MUDPLATE_GRAZER_VARIANT],
  rendererData: {
    contractCard: EN_E10_RHINO_CONTRACT_CARD.id,
    architectureDecision: EN_E10_RHINO_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E10_RIMEVAULT_MATRIARCH_GATE.id,
    activeGate: EN_E10_MUDPLATE_GRAZER_GATE.id,
  },
  review: {
    baselineVariant: 'mudplate-grazer',
    scale: 8,
    notes: 'Visually approved as one exact private common Rhino against approved Tundrahide Grazer and Cragcrown Patriarch plus public Dire Wolf, with the protected Furious Depraved Rhino Boss direction and full-animation candidates reviewed separately and unchanged. Accepted implementation 1e685159e6ddc09a20d853a511c9cfb448b502fe records only the frozen packet. The continuation suffix is held until the bounded publication tuple is clean and remote verified. The distinct Complete B outlined PNG remains review evidence only. Keep public or outline registration, fixtures, effects, child assets, specialist and elite Rhino, every Boss change, deferred Runic Idol, release, accepted drift, and a pull request separate.',
  },
});

export const EN_E10_MUDPLATE_GRAZER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E10_MUDPLATE_GRAZER_RENDERER],
  families: [EN_E10_MUDPLATE_GRAZER_FAMILY],
});
