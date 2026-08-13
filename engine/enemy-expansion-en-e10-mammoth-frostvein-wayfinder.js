import { SIZE } from './catalogs.js';
import { createEnemyExpansionRegistry, ENEMY_EXPANSION_STATES } from './enemy-expansion.js';
import {
  EN_E10_MAMMOTH_TOPOLOGY_DECISION,
  EN_E10_TUNDRAHIDE_GRAZER_GATE,
} from './enemy-expansion-en-e10-mammoth-tundrahide-grazer.js';

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
  wool: ['#596b78', '#283744', '#88a0ab'],
  face: ['#71808a', '#303a43', '#a5b1b3'],
  tusk: ['#d9d4b7', '#778a89', '#f5e9c7'],
  belly: ['#a8b4ae', '#5f6f72', '#ced2c1'],
  mark: ['#3f8a92', '#285a69'],
  ear: ['#81576e', '#4d3147'],
  foot: '#171d25',
  feature: '#0f151c',
  eye: '#79e2e5',
  flash: '#f4f4f4',
});

export const EN_E10_MAMMOTH_SPECIALIST_CONTRACT_CARD = deepFreeze({
  id: 'en-e10-mammoth-frostvein-wayfinder-v1',
  sliceId: 'EN-E10',
  family: 'mammoth',
  familyName: 'Mammoth',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingVariant: {
    id: 'tundrahide-grazer',
    name: 'Tundrahide Grazer',
    role: 'common',
    status: 'approved-published-reconciled',
    gateId: EN_E10_TUNDRAHIDE_GRAZER_GATE.id,
  },
  activeVariant: {
    id: 'frostvein-wayfinder',
    name: 'Frostvein Wayfinder',
    role: 'specialist',
    status: 'implemented-full-approved',
  },
  deferredRoles: ['elite'],
  actorTopology: EN_E10_MAMMOTH_TOPOLOGY_DECISION.selected,
  styleContract: 'Use chunky one-to-three-pixel hard-alpha forms for a connected specialist Mammoth: a leaner high-shouldered slate-blue wool chassis, sloping back, tucked belly, high alert head, large body-owned ears, long connected trunk, longer swept body-owned tusks, short tail, four weight-bearing legs, and four separated broad feet. Preserve the Mammoth dome, trunk, tusks, face, and four-foot mass while reading faster and more directional than Tundrahide Grazer. Avoid antlers, curled Ram horns, canine posture, reduced Rhino proportions, detached components, or baked effects.',
  effectBoundary: EN_E10_MAMMOTH_TOPOLOGY_DECISION.effectBoundary,
});

export const EN_E10_FROSTVEIN_WAYFINDER_CONTRACT = deepFreeze({
  sliceId: 'EN-E10',
  family: 'mammoth',
  variant: 'frostvein-wayfinder',
  role: 'specialist',
  state: 'implemented-complete-motion-approved',
  topology: EN_E10_MAMMOTH_TOPOLOGY_DECISION.selected,
  chassis: 'baked-single-actor-lean-high-shouldered-slate-blue-long-swept-tusk-four-broad-foot-mammoth-v1',
  silhouette: 'A specialist Mammoth with a leaner high-shouldered barrel, sloping back, tucked belly, high alert head, large connected ears, long body-owned trunk, longer swept paired tusks, short tail, four weight-bearing legs, and four separated broad feet. It must read faster, taller, and more directional than Tundrahide Grazer while remaining unmistakably heavier than Cliffcoil Strider and unlike a reduced Furious Depraved Rhino Boss, long-backed Dire Wolf, antlered Stag, or ring-horned Ram.',
  visualIdentity: 'Slate-blue wool, deep indigo lower body and feet, pale glacier-stone face and trunk, long old-ivory tusks with sea-glass undertones, lichen-pale belly, blue-green frost-vein chevrons, muted wine ears, cyan eyes, and near-black broad feet establish the Frostvein Wayfinder. Every mark belongs to the actor; snow, breath, debris, shock rings, tusk trails, impacts, particles, projectiles, glow, and illumination remain external.',
  effectBoundary: EN_E10_MAMMOTH_SPECIALIST_CONTRACT_CARD.effectBoundary,
});

export const EN_E10_FROSTVEIN_WAYFINDER_DATA = deepFreeze({
  actor: {
    species: 'authored-mammoth-specialist',
    bodyBuild: 'lean-high-shouldered-sloping-backed-four-broad-foot-heavy-quadruped',
    skin: 'slate-blue-wool',
    hairStyle: 'connected-high-shoulder-dome-tucked-belly-and-short-tail',
    hairColor: 'slate-blue',
    expression: 'alert-cyan-frostpath-gaze',
    faceDetail: 'pale-glacier-face-large-wine-ears-cyan-eyes-connected-trunk-and-long-paired-old-ivory-tusks',
    headgear: 'body-owned-long-paired-old-ivory-tusks',
    outfit: 'body-owned-lichen-belly-and-frost-vein-chevrons',
    outfitColor: 'slate-indigo-glacier-ivory-lichen-sea-glass-wine-and-cyan',
    outfitTier: 'tier2',
    weapon: 'body-owned-lateral-trunk-feint-into-hooked-tusk-sweep',
    weaponTier: 'none',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: { skin: COLORS.wool, hair: COLORS.face, outfit: COLORS.belly },
  },
  frostveinWayfinder: COLORS,
  actorTopology: EN_E10_MAMMOTH_TOPOLOGY_DECISION.selected,
  childAssets: [],
  alphaPolicy: 'binary-single-component-slate-blue-high-shouldered-wool-alert-head-large-ears-connected-trunk-long-swept-paired-tusks-short-tail-four-legs-and-four-grounded-broad-feet',
  effectBoundary: EN_E10_MAMMOTH_SPECIALIST_CONTRACT_CARD.effectBoundary,
  bakedEffects: [],
});

export const EN_E10_FROSTVEIN_WAYFINDER_GATE = deepFreeze({
  id: 'en-e10-mammoth-frostvein-wayfinder-full-v1',
  status: 'approved',
  baseCheckpoint: '125b1b81d0f6fa977c3bf674964a45131e65f3ab',
  authorizedOn: '2026-08-13',
  authorizationEvidence: 'The exact Tundrahide Grazer implementation f0ced3c777c478a4077fb439ccd8b4b363ea52ac, approval record 2387ec0a584f77b3473827ef0568823bf86b4fd2, initial published handoff 699e17fe7749b365feabbd15f323eac15aaf4337, and final reconciliation 125b1b81d0f6fa977c3bf674964a45131e65f3ab were pushed and remote verified. The designer reply awesome klets do next opens exactly one private specialist Mammoth full 80-frame candidate on a new isolated branch from that clean checkpoint under the selected baked-single-actor-tusked-heavy-grounded-quadruped topology. It does not authorize publication, public or outline registration, fixtures, effects, child assets, elite Mammoth, Rhino, Rhino Boss work, Runic Idol, release, accepted drift, a pull request, or any broader gate.',
  architectureDecision: EN_E10_MAMMOTH_TOPOLOGY_DECISION.id,
  approvedOn: '2026-08-13',
  approvalEvidence: 'The exact labeled all-four-direction raw/no-outline, distinct Complete B outlined, Complete B + Form, and approved Tundrahide Grazer and Cliffcoil Strider plus public Dire Wolf comparison PNGs were frozen with both synchronized GIF hashes. The Aseprite review session reported those exact four paths open together as raw sprite 179, outlined sprite 183, Complete B + Form sprite 187, and active comparison sprite 191. The final approval prompt posted all four exact PNGs, both synchronized GIFs, and candidate digest 2fbcd71017d4acacb9e8cfee31d984ad9f039634af79cb656180b11a08f1250e. The designer replied: approved lets do next. Approval applies only to that exact Frostvein Wayfinder digest and its six frozen review hashes. The continuation suffix is held until the bounded publication tuple is clean and remote verified, after which it opens exactly one private elite Mammoth full 80-frame candidate under the selected baked-single-actor-tusked-heavy-grounded-quadruped topology. It does not authorize public Mammoth or outline registration, fixtures, effects, child assets, Rhino, Rhino Boss work, Runic Idol, release, accepted drift, a pull request, or any broader gate.',
  approvedImplementation: '03618d6ca98ad1a93596bdbe501edcf1cedd466a',
  publicationAuthorizedOn: '2026-08-13',
  publicationAuthorizationEvidence: 'The designer previously said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact frozen artifact or digest. It does not authorize registration, fixtures, effects, child assets, later roles or families, release, accepted drift, or a pull request.',
  publishedImplementation: '03618d6ca98ad1a93596bdbe501edcf1cedd466a',
  publishedApprovalRecord: '36c43772911aa0ab81d4a417fc1ad2a29531aa30',
  initialPublishedHandoff: '',
  publicationState: 'published-awaiting-handoff-reconciliation',
  precedingApproval: {
    gateId: EN_E10_TUNDRAHIDE_GRAZER_GATE.id,
    artifactSha256: EN_E10_TUNDRAHIDE_GRAZER_GATE.artifactSha256,
    outlinedArtifactSha256: EN_E10_TUNDRAHIDE_GRAZER_GATE.outlinedArtifactSha256,
    assembledArtifactSha256: EN_E10_TUNDRAHIDE_GRAZER_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E10_TUNDRAHIDE_GRAZER_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E10_TUNDRAHIDE_GRAZER_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E10_TUNDRAHIDE_GRAZER_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E10_TUNDRAHIDE_GRAZER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E10_TUNDRAHIDE_GRAZER_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E10_TUNDRAHIDE_GRAZER_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E10_TUNDRAHIDE_GRAZER_GATE.initialPublishedHandoff,
    currentReconciliation: '125b1b81d0f6fa977c3bf674964a45131e65f3ab',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e10-mammoth-frostvein-wayfinder/en-e10-mammoth-frostvein-wayfinder-full-suite-raw.png',
  artifactSha256: '8c3a0343c40f31d7feb4b9758d4dc7fdbb80f04c7e92d6ed00096dc590a2e8da',
  outlinedArtifact: 'enemy-expansion-review/en-e10-mammoth-frostvein-wayfinder/en-e10-mammoth-frostvein-wayfinder-full-suite-outlined-complete-b.png',
  outlinedArtifactSha256: '028196f73fee84c5c369c34ddb15a99e0d4ef63ab1a80aba1477170e7d3569b0',
  assembledArtifact: 'enemy-expansion-review/en-e10-mammoth-frostvein-wayfinder/en-e10-mammoth-frostvein-wayfinder-full-suite-complete-b-form.png',
  assembledArtifactSha256: '6eac49abbd08f2f15fe801e1434fefd6e3d7d92f3b538d97ad91ff551c644a53',
  comparisonArtifact: 'enemy-expansion-review/en-e10-mammoth-frostvein-wayfinder/en-e10-mammoth-frostvein-wayfinder-family-comparison.png',
  comparisonArtifactSha256: '8ae03110e5b2097f14b5797953134bc7e8b4ec9d3892ae9c0a290861bb01ff9c',
  reviewAnimations: {
    raw: { artifact: 'enemy-expansion-review/en-e10-mammoth-frostvein-wayfinder/en-e10-mammoth-frostvein-wayfinder-full-suite-four-directions-labeled.gif', sha256: '7300c456c32c38bc5f040b93c21be5e0d81a1596d21ad46c99ed13975aaa7e5e', width: 640, height: 672, frames: 4, durationMs: 180 },
    completeBForm: { artifact: 'enemy-expansion-review/en-e10-mammoth-frostvein-wayfinder/en-e10-mammoth-frostvein-wayfinder-full-suite-four-directions-labeled-complete-b-form.gif', sha256: '87b730870744d5db6bbdb5109c384f69cfeec3ab5402e9a8055a2f0a8bdccf18', width: 640, height: 672, frames: 4, durationMs: 180 },
  },
  candidateFrameDigest: '2fbcd71017d4acacb9e8cfee31d984ad9f039634af79cb656180b11a08f1250e',
  tundrahideComparisonDigest: EN_E10_TUNDRAHIDE_GRAZER_GATE.candidateFrameDigest,
  cliffcoilComparisonDigest: '1ca2ce85dc6bd4b291e6ede4754f58c2a5bd4278b50acfb699926f9626dd9b29',
  direWolfComparisonDigest: 'a94a66ee380cfcb91db3907a3a049dae4b59357870857c3ed31be259bb1f1579',
  scope: 'One complete 80-frame Frostvein Wayfinder specialist Mammoth across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle holds a high alert head while the connected trunk curls over a planted four-foot stance. Walk uses four longer alternating broad-foot weight transfers while the shoulder rise, face, ears, trunk, and swept tusks stay readable. Attack braces, performs a lateral connected-trunk feint, drives one body-owned hooked tusk sweep with no trail or impact pixels, and recovers. Hurt uses a complete white recoil and colored four-foot brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline board, distinct Complete B outlined board, Complete B + Form board, synchronized raw and Complete B + Form GIFs, and approved Tundrahide Grazer and Cliffcoil Strider plus public Dire Wolf comparisons together.',
  exclusions: [
    'changes to approved Tundrahide Grazer or Cliffcoil Strider rendered pixels',
    'changes to public Dire Wolf pixels',
    'public Mammoth registration or outline registration',
    'public catalog or facade exposure',
    'asset-pack fixture or manifest changes',
    'schema, shared renderer, exporter, validator, or frame-contract changes',
    'detached trunk, tusks, ears, tail, or child assets',
    'new Cast pixels or new Death pixels',
    'snow, breath, debris, shock rings, tusk trails, impacts, particles, projectiles, glow, illumination, or effects',
    'elite Mammoth variants',
    'Rhino or Furious Depraved Rhino Boss changes',
    'Runic Idol or other EN-E09 work',
    'release, accepted drift, or pull request',
  ],
  nextGate: 'The exact Frostvein Wayfinder implementation 03618d6ca98ad1a93596bdbe501edcf1cedd466a and approval record 36c43772911aa0ab81d4a417fc1ad2a29531aa30 are remote verified. Only the initial published handoff and final reconciliation remain open. The designer reply includes lets do next, but that suffix remains held until this exact publication tuple is clean and remote verified; it then opens exactly one private elite Mammoth full 80-frame candidate under the selected baked-single-actor-tusked-heavy-grounded-quadruped topology. The distinct outlined PNG remains review evidence only and does not authorize outline registration. Public Mammoth registration, fixtures, effects, child assets, Rhino, Rhino Boss work, Runic Idol, release, accepted drift, and a pull request remain closed.',
});

export const EN_E10_FROSTVEIN_WAYFINDER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'high-alert-frostpath-watch', pose: 'idle', bob: 0, head: 0, trunk: 'trail', reach: 0, lateral: 0, stride: [0, 0, 0, 0] },
  { name: 'connected-trunk-wayfinder-curl', pose: 'idle', bob: 1, head: -1, trunk: 'curl', reach: 0, lateral: 0, stride: [0, 0, 0, 0] },
]);

const WALK_PHASES = deepFreeze([
  { name: 'near-fore-long-path-plant', pose: 'walk', bob: 0, head: 0, trunk: 'trail', reach: 0, lateral: 0, stride: [-1, 1, 0, -1] },
  { name: 'high-shoulder-forward-rise', pose: 'walk', bob: -1, head: 0, trunk: 'curl', reach: 0, lateral: 1, stride: [0, 1, -1, 0] },
  { name: 'far-fore-long-path-plant', pose: 'walk', bob: 0, head: 1, trunk: 'trail', reach: 0, lateral: 0, stride: [1, -1, 0, 1] },
  { name: 'four-foot-wayfinder-switch', pose: 'walk', bob: 1, head: 0, trunk: 'curl', reach: 0, lateral: -1, stride: [0, -1, 1, 0] },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'four-broad-foot-hook-brace', pose: 'brace', bob: 0, head: 0, trunk: 'trail', reach: 0, lateral: 0, stride: [-1, 0, 1, 0] },
  { name: 'lateral-connected-trunk-feint', pose: 'feint', bob: -1, head: -1, trunk: 'feint', reach: 0, lateral: 1, stride: [-1, 1, 1, -1] },
  { name: 'long-swept-tusk-hook', pose: 'hook', bob: 0, head: 1, trunk: 'hook', reach: -2, lateral: -1, stride: [-1, 1, 1, -1] },
  { name: 'effect-free-frostpath-recover', pose: 'recover', bob: 1, head: 0, trunk: 'curl', reach: 0, lateral: 0, stride: [0, -1, -1, 0] },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-frostvein-recoil', pose: 'hurt', bob: -1, head: 0, trunk: 'curl', reach: 0, lateral: -1, stride: [0, 0, 0, 0], flash: true },
  { name: 'colored-wayfinder-brace', pose: 'hurt-brace', bob: 1, head: 1, trunk: 'trail', reach: -1, lateral: 1, stride: [-1, 1, 1, -1], flash: false },
]);

function createPixels() { return new Array(SIZE * SIZE).fill(null); }

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert([x, y, width, height].every(Number.isInteger) && width > 0 && height > 0, 'Frostvein Wayfinder geometry must use positive integers.');
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Frostvein Wayfinder pixels must remain inside 24x24.');
      pixels[(py * SIZE) + px] = fill;
    }
  };
  return { rect, dot(x, y, fill) { rect(x, y, 1, 1, fill); } };
}

function drawSideLegs(paint, bodyY, stride) {
  const positions = [7, 11, 16, 20];
  for (let index = 0; index < positions.length; index++) {
    const footX = positions[index];
    const upperX = Math.max(6, Math.min(20, footX + stride[index]));
    const legY = 14 + bodyY;
    const anchorX = Math.max(8, Math.min(20, upperX));
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
  const baseX = headX + 3;
  const baseY = headY + 4;
  if (mode === 'feint') {
    paint.rect(baseX, baseY, 2, 3, COLORS.face[0]);
    paint.rect(baseX - 2, baseY - 1, 3, 2, COLORS.face[2]);
    paint.rect(Math.max(1, baseX - 3), baseY - 2, 2, 1, COLORS.face[0]);
  } else if (mode === 'hook') {
    paint.rect(baseX, baseY, 2, 4, COLORS.face[0]);
    paint.rect(Math.max(1, baseX - 3), baseY + 2, 4, 2, COLORS.face[2]);
    paint.rect(Math.max(1, baseX - 4), baseY + 1, 2, 1, COLORS.face[0]);
  } else {
    paint.rect(baseX, baseY, 2, 7, COLORS.face[0]);
    paint.rect(baseX - 1, baseY + 6, 2, 3, COLORS.face[2]);
    if (mode === 'curl') paint.rect(baseX, baseY + 8, 2, 1, COLORS.face[0]);
    else paint.dot(baseX - 1, baseY + 9, COLORS.face[0]);
  }
}

function drawSide(paint, phase) {
  const y = phase.bob;
  const headX = Math.max(2, 4 + phase.reach);
  const headY = 7 + y + phase.head;

  paint.rect(9, 7 + y, 12, 8, COLORS.wool[0]);
  paint.rect(7, 6 + y, 6, 10, COLORS.wool[2]);
  paint.rect(9, 4 + y, 5, 3, COLORS.wool[2]);
  paint.rect(18, 9 + y, 4, 6, COLORS.wool[1]);
  paint.rect(11, 13 + y, 8, 3, COLORS.belly[0]);
  paint.rect(10, 6 + y, 3, 2, COLORS.mark[0]);
  paint.rect(14, 8 + y, 4, 2, COLORS.mark[1]);

  paint.rect(headX + 2, headY, 7, 6, COLORS.face[0]);
  paint.rect(headX + 3, headY + 1, 6, 5, COLORS.face[2]);
  paint.rect(headX + 7, headY - 1, 4, 5, COLORS.ear[0]);
  paint.rect(headX + 8, headY, 2, 3, COLORS.ear[1]);
  drawSideTrunk(paint, headX, headY, phase.trunk);
  paint.rect(headX + 1, headY + 4, 4, 1, COLORS.tusk[2]);
  paint.rect(Math.max(1, headX - 1), headY + 5, 3, 1, COLORS.tusk[0]);
  paint.rect(Math.max(1, headX - 3), headY + 6, 3, 1, COLORS.tusk[0]);
  paint.dot(Math.max(1, headX - 3), headY + 7, COLORS.tusk[1]);
  paint.dot(headX + 5, headY + 2, COLORS.eye);
  paint.dot(headX + 2, headY + 3, COLORS.feature);

  paint.rect(21, 10 + y, 2, 3, COLORS.wool[0]);
  paint.rect(22, 12 + y, 1, 3, COLORS.wool[1]);
  paint.rect(9, 11 + y, 3, 2, COLORS.belly[2]);
  paint.dot(12, 9 + y, COLORS.mark[1]);
  drawSideLegs(paint, y, phase.stride);
}

function drawFrontTrunk(paint, x, headTop, mode) {
  if (mode === 'feint') {
    paint.rect(11 + x, headTop + 4, 3, 3, COLORS.face[0]);
    paint.rect(9 + x, headTop + 3, 3, 2, COLORS.face[2]);
    paint.rect(8 + x, headTop + 2, 2, 1, COLORS.face[0]);
  } else if (mode === 'hook') {
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

  paint.rect(10 + x, 4, 5, 1, COLORS.wool[2]);
  paint.rect(6 + x, 7 + y, 14, 10, COLORS.wool[0]);
  paint.rect(8 + x, 4 + y, 10, 4, COLORS.wool[2]);
  paint.rect(5 + x, 8 + y, 16, 8, COLORS.wool[0]);
  paint.rect(7 + x, 13 + y, 12, 4, COLORS.belly[0]);
  paint.rect(6 + x, 8 + y, 4, 2, COLORS.mark[0]);
  paint.rect(15 + x, 9 + y, 4, 2, COLORS.mark[1]);
  paint.rect(7 + x, headTop, 11, 6, COLORS.face[0]);
  paint.rect(8 + x, headTop + 1, 9, 5, COLORS.face[2]);
  paint.rect(4 + x, headTop, 4, 5, COLORS.ear[0]);
  paint.rect(17 + x, headTop, 4, 5, COLORS.ear[0]);
  paint.rect(5 + x, headTop + 1, 2, 3, COLORS.ear[1]);
  paint.rect(18 + x, headTop + 1, 2, 3, COLORS.ear[1]);
  drawFrontTrunk(paint, x, headTop, phase.trunk);

  paint.rect(8 + x, headTop + 4, 3, 1, COLORS.tusk[2]);
  paint.rect(6 + x, headTop + 5, 3, 1, COLORS.tusk[0]);
  paint.rect(5 + x, headTop + 6, 2, 1, COLORS.tusk[0]);
  paint.dot(5 + x, headTop + 7, COLORS.tusk[1]);
  paint.rect(14 + x, headTop + 4, 3, 1, COLORS.tusk[2]);
  paint.rect(16 + x, headTop + 5, 3, 1, COLORS.tusk[0]);
  paint.rect(18 + x, headTop + 6, 2, 1, COLORS.tusk[0]);
  paint.dot(19 + x, headTop + 7, COLORS.tusk[1]);
  paint.dot(9 + x, headTop + 2, COLORS.eye);
  paint.dot(15 + x, headTop + 2, COLORS.eye);
  paint.dot(11 + x, headTop + 4, COLORS.feature);
  paint.dot(13 + x, headTop + 4, COLORS.feature);
  paint.rect(5 + x, 12 + y, 2, 1, COLORS.mark[0]);
  paint.rect(19 + x, 10 + y, 3, 3, COLORS.wool[1]);
  paint.rect(21 + x, 12 + y, 1, 3, COLORS.wool[1]);
  drawEndLegs(paint, y, phase.stride, x);
}

function drawUp(paint, phase) {
  const y = phase.bob;
  const x = phase.lateral;
  const headTop = 6 + y + phase.head;

  paint.rect(10 + x, 4, 5, 1, COLORS.wool[2]);
  paint.rect(6 + x, 7 + y, 14, 10, COLORS.wool[0]);
  paint.rect(8 + x, 4 + y, 10, 4, COLORS.wool[2]);
  paint.rect(5 + x, 8 + y, 16, 8, COLORS.wool[0]);
  paint.rect(7 + x, 13 + y, 12, 4, COLORS.wool[1]);
  paint.rect(7 + x, headTop, 11, 6, COLORS.face[0]);
  paint.rect(8 + x, headTop + 2, 9, 4, COLORS.wool[2]);
  paint.rect(4 + x, headTop, 4, 5, COLORS.ear[1]);
  paint.rect(17 + x, headTop, 4, 5, COLORS.ear[1]);
  paint.rect(6 + x, 8 + y, 5, 2, COLORS.mark[0]);
  paint.rect(14 + x, 9 + y, 5, 2, COLORS.mark[1]);
  paint.rect(10 + x, 12 + y, 5, 3, COLORS.belly[1]);
  paint.rect(19 + x, 10 + y, 3, 3, COLORS.wool[1]);
  paint.rect(21 + x, 12 + y, 1, 3, COLORS.wool[1]);
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
  if (animation === 'death') { assert(frame >= 0 && frame < 4, 'Frame ' + frame + ' is invalid for death.'); return HURT_PHASES[EN_E10_FROSTVEIN_WAYFINDER_DEATH_SOURCE_FRAMES[frame]]; }
  throw new TypeError('Animation ' + animation + ' is not implemented for Frostvein Wayfinder.');
}

function buildPixels(direction, animation, frame) {
  const phase = phaseFor(animation, frame);
  const canonical = direction === 'right' ? 'left' : direction;
  const pixels = createPixels();
  const paint = painter(pixels);
  if (canonical === 'down') drawDown(paint, phase);
  else if (canonical === 'up') drawUp(paint, phase);
  else if (canonical === 'left') drawSide(paint, phase);
  else throw new TypeError('Unsupported Frostvein Wayfinder direction ' + direction + '.');
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

export function renderEnE10FrostveinWayfinderFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Frostvein Wayfinder rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Frostvein Wayfinder direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'mammoth', variant: 'frostvein-wayfinder', direction, animation, frame,
    phase: phase.name,
    frostveinWayfinderGate: EN_E10_FROSTVEIN_WAYFINDER_GATE.id,
    architectureDecision: EN_E10_MAMMOTH_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E10_TUNDRAHIDE_GRAZER_GATE.id,
    actorTopology: EN_E10_FROSTVEIN_WAYFINDER_DATA.actorTopology,
    childAssetCount: EN_E10_FROSTVEIN_WAYFINDER_DATA.childAssets.length,
    alphaPolicy: EN_E10_FROSTVEIN_WAYFINDER_DATA.alphaPolicy,
    effectBoundary: EN_E10_FROSTVEIN_WAYFINDER_DATA.effectBoundary,
  });
}

export const EN_E10_FROSTVEIN_WAYFINDER_RENDERER = deepFreeze({
  key: 'en-e10-mammoth-frostvein-wayfinder-v1',
  chassis: EN_E10_FROSTVEIN_WAYFINDER_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'mammoth', 'The EN-E10 Frostvein Wayfinder renderer is restricted to Mammoth.');
    assert(variant.id === 'frostvein-wayfinder', 'The EN-E10 Frostvein Wayfinder renderer is restricted to Frostvein Wayfinder.');
    return renderEnE10FrostveinWayfinderFrame(context, direction, animation.id, frame);
  },
});

const FROSTVEIN_WAYFINDER_VARIANT = deepFreeze({
  id: 'frostvein-wayfinder',
  name: 'Frostvein Wayfinder',
  role: EN_E10_FROSTVEIN_WAYFINDER_CONTRACT.role,
  status: EN_E10_FROSTVEIN_WAYFINDER_CONTRACT.state,
  brief: 'A private complete specialist Mammoth with a lean high-shouldered slate-blue wool body, pale glacier face and connected trunk, large wine ears, long swept old-ivory tusks, lichen belly, frost-vein chevrons, cyan eyes, short tail, four broad feet, and a body-owned lateral trunk feint into a hooked tusk sweep; all effects remain external.',
  rendererData: EN_E10_FROSTVEIN_WAYFINDER_DATA,
});

export const EN_E10_FROSTVEIN_WAYFINDER_FAMILY = deepFreeze({
  id: 'mammoth',
  name: 'Mammoth Frostvein Wayfinder Review',
  sliceId: 'EN-E10',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E10_FROSTVEIN_WAYFINDER_CONTRACT.chassis,
  rendererKey: EN_E10_FROSTVEIN_WAYFINDER_RENDERER.key,
  variants: [FROSTVEIN_WAYFINDER_VARIANT],
  rendererData: {
    contractCard: EN_E10_MAMMOTH_SPECIALIST_CONTRACT_CARD.id,
    architectureDecision: EN_E10_MAMMOTH_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E10_TUNDRAHIDE_GRAZER_GATE.id,
    activeGate: EN_E10_FROSTVEIN_WAYFINDER_GATE.id,
  },
  review: {
    baselineVariant: 'frostvein-wayfinder',
    scale: 8,
    notes: 'Visually approved as one exact private specialist Mammoth against approved Tundrahide Grazer and Cliffcoil Strider plus public Dire Wolf. Accepted implementation 03618d6ca98ad1a93596bdbe501edcf1cedd466a and approval record 36c43772911aa0ab81d4a417fc1ad2a29531aa30 are remote verified. Only the initial published handoff and final reconciliation remain open. The distinct Complete B outlined PNG remains review evidence only. The lets do next suffix is held until the publication tuple is clean and remote verified, then opens exactly one private elite Mammoth full 80-frame candidate under the selected topology; keep public or outline registration, fixtures, effects, child assets, Rhino, Rhino Boss work, deferred Runic Idol, release, accepted drift, and a pull request separate.',
  },
});

export const EN_E10_FROSTVEIN_WAYFINDER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E10_FROSTVEIN_WAYFINDER_RENDERER],
  families: [EN_E10_FROSTVEIN_WAYFINDER_FAMILY],
});
