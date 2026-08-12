import { SIZE } from './catalogs.js';
import { createEnemyExpansionRegistry, ENEMY_EXPANSION_STATES } from './enemy-expansion.js';
import {
  EN_E10_DUNEBACK_SCAVENGER_GATE,
  EN_E10_HYENA_CONTRACT_CARD,
  EN_E10_HYENA_TOPOLOGY_DECISION,
} from './enemy-expansion-en-e10-hyena-duneback-scavenger.js';

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
  fur: ['#57485f', '#342d42', '#77667e'],
  ruff: ['#292237', '#171521', '#4b3e59'],
  belly: ['#958491', '#655a6b', '#b9aab3'],
  stripe: ['#252033', '#51405d'],
  ear: ['#824c67', '#4c3048'],
  paw: '#17151c',
  feature: '#101018',
  eye: '#8fe3d8',
  flash: '#f4f4f4',
});

export const EN_E10_HYENA_SPECIALIST_CONTRACT_CARD = deepFreeze({
  id: 'en-e10-hyena-gloamstripe-ambusher-v1',
  sliceId: 'EN-E10',
  family: 'hyena',
  familyName: 'Hyena',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingVariant: {
    id: 'duneback-scavenger',
    role: 'common',
    status: 'approved-published-reconciled',
    gateId: EN_E10_DUNEBACK_SCAVENGER_GATE.id,
  },
  activeVariant: {
    id: 'gloamstripe-ambusher',
    name: 'Gloamstripe Ambusher',
    role: 'specialist',
    status: 'implemented-full-approved',
  },
  deferredRoles: ['elite'],
  actorTopology: EN_E10_HYENA_TOPOLOGY_DECISION.selected,
  styleContract: EN_E10_HYENA_CONTRACT_CARD.styleContract,
  effectBoundary: EN_E10_HYENA_CONTRACT_CARD.effectBoundary,
});

export const EN_E10_GLOAMSTRIPE_AMBUSHER_CONTRACT = deepFreeze({
  sliceId: 'EN-E10',
  family: 'hyena',
  variant: 'gloamstripe-ambusher',
  role: 'specialist',
  state: 'implemented-complete-motion-approved',
  topology: EN_E10_HYENA_TOPOLOGY_DECISION.selected,
  chassis: 'baked-single-actor-lean-high-shoulder-low-rump-long-ruff-striped-face-four-paw-hyena-v1',
  silhouette: 'A lean dusk Hyena with tall narrow shoulders, a sharply descending back, tucked abdomen, low angular rump, compact wedge muzzle, two rounded ears, a long connected neck-to-shoulder ruff, connected lowered tail, and four separated dark paws. It must remain recognizably Hyena while reading faster and narrower than Duneback Scavenger and unlike the level-backed long-snouted Dire Wolf or bowed long-necked Miremane Courser.',
  visualIdentity: 'Slate-violet fur, a near-black indigo ruff and muzzle, ash-lilac throat and belly, cold angular cheek and flank stripes, wine ear interiors, cyan eyes, and black paws establish the specialist dusk hunter. Sound glyphs, laughter marks, dust, saliva, bite arcs, impacts, particles, projectiles, glow, and illumination remain external.',
  effectBoundary: EN_E10_HYENA_CONTRACT_CARD.effectBoundary,
});

export const EN_E10_GLOAMSTRIPE_AMBUSHER_DATA = deepFreeze({
  actor: {
    species: 'authored-hyena-specialist',
    bodyBuild: 'lean-high-shouldered-low-rumped-tucked-specialist',
    skin: 'slate-violet-gloam-fur',
    hairStyle: 'connected-long-indigo-ruff',
    hairColor: 'near-black-indigo',
    expression: 'cold-cyan-ambusher-stare',
    faceDetail: 'compact-dark-wedge-muzzle-rounded-ears-and-angular-cold-stripes',
    headgear: 'none',
    outfit: 'ash-throat-belly-and-cold-cheek-flank-stripes',
    outfitColor: 'slate-indigo-ash-wine-and-cyan',
    outfitTier: 'tier2',
    weapon: 'body-owned-feint-to-pounce',
    weaponTier: 'none',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.fur,
      hair: COLORS.ruff,
      outfit: COLORS.belly,
    },
  },
  gloamstripeAmbusher: COLORS,
  actorTopology: EN_E10_HYENA_TOPOLOGY_DECISION.selected,
  childAssets: [],
  alphaPolicy: 'binary-single-component-lean-high-shoulder-low-rump-wedge-muzzle-rounded-ear-long-connected-ruff-tail-and-four-grounded-paws',
  effectBoundary: EN_E10_HYENA_CONTRACT_CARD.effectBoundary,
  bakedEffects: [],
});

export const EN_E10_GLOAMSTRIPE_AMBUSHER_GATE = deepFreeze({
  id: 'en-e10-hyena-gloamstripe-ambusher-full-v1',
  status: 'approved',
  baseCheckpoint: '153ca132f94cc2360eca2c0366602ff400f871df',
  authorizedOn: '2026-08-13',
  authorizationEvidence: 'From the clean published Duneback Scavenger reconciliation at 153ca132f94cc2360eca2c0366602ff400f871df, the designer said: lets do nex t. In the established one-complete-sprite cadence this separately authorizes exactly one private specialist Hyena full 80-frame candidate under the already approved baked-single-actor-grounded-quadruped topology. The prior Duneback approval also required the next review to post a distinct outlined image. That requirement is carried forward as a review-only Complete B PNG and does not authorize public outline registration. Public Hyena registration, fixtures, effects, child assets, the elite Hyena, Ram, Stag, Mammoth, Rhino, Rhino Boss work, Runic Idol, release, accepted drift, and a pull request remain closed.',
  architectureDecision: EN_E10_HYENA_TOPOLOGY_DECISION.id,
  approvedOn: '2026-08-13',
  approvalEvidence: 'The exact labeled all-four-direction raw/no-outline, distinct Complete B outlined, Complete B + Form, and approved Duneback Scavenger and Miremane Courser plus public Dire Wolf comparison PNGs were frozen with both synchronized GIF hashes. The four-lane Aseprite MCP review window reported those exact four paths open together as raw sprite 19, outlined sprite 23, Complete B + Form sprite 27, and active comparison sprite 31. The final approval prompt posted all four exact PNGs and identified candidate digest 6da5c64d98252021280fe6edd867dbe1dc5afa17a0e79a73152194860d52b885. The designer replied: approved lets do nex t. Approval applies only to that exact Gloamstripe Ambusher digest and its six frozen review hashes. The lets do nex t portion separately authorizes exactly one private elite Hyena candidate only after this bounded specialist publication is clean and remote verified. Public Hyena or outline registration, fixtures, effects, child assets, Ram, Stag, Mammoth, Rhino, Rhino Boss work, Runic Idol, release, accepted drift, and a pull request remain closed.',
  approvedImplementation: '5d35ed0c36f84646270a3d02b13e63559798aa01',
  publicationAuthorizedOn: '2026-08-13',
  publicationAuthorizationEvidence: 'The designer previously said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact frozen artifact or digest. It does not authorize registration, fixtures, effects, child assets, later roles or families, release, accepted drift, or a pull request.',
  publishedImplementation: '5d35ed0c36f84646270a3d02b13e63559798aa01',
  publishedApprovalRecord: '76ed7212ccddc33d1fcafa1ec97b26eb8963f096',
  initialPublishedHandoff: '1126852feae8f812c044806760a0063a7ef8d31f',
  publicationState: 'published',
  precedingApproval: {
    gateId: EN_E10_DUNEBACK_SCAVENGER_GATE.id,
    artifactSha256: EN_E10_DUNEBACK_SCAVENGER_GATE.artifactSha256,
    assembledArtifactSha256: EN_E10_DUNEBACK_SCAVENGER_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E10_DUNEBACK_SCAVENGER_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E10_DUNEBACK_SCAVENGER_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E10_DUNEBACK_SCAVENGER_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E10_DUNEBACK_SCAVENGER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E10_DUNEBACK_SCAVENGER_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E10_DUNEBACK_SCAVENGER_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E10_DUNEBACK_SCAVENGER_GATE.initialPublishedHandoff,
    currentReconciliation: '153ca132f94cc2360eca2c0366602ff400f871df',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e10-hyena-gloamstripe-ambusher/en-e10-hyena-gloamstripe-ambusher-full-suite-raw.png',
  artifactSha256: '0d622fcd390ace6e143d7a19fc13e07cec359d6dbd6a5ad8b0fb1b837fdadc16',
  outlinedArtifact: 'enemy-expansion-review/en-e10-hyena-gloamstripe-ambusher/en-e10-hyena-gloamstripe-ambusher-full-suite-outlined-complete-b.png',
  outlinedArtifactSha256: '06544757f2c4413c43707d3c64ddbacd9d6678d232d1b5d6a8bada14deb71cc0',
  assembledArtifact: 'enemy-expansion-review/en-e10-hyena-gloamstripe-ambusher/en-e10-hyena-gloamstripe-ambusher-full-suite-complete-b-form.png',
  assembledArtifactSha256: '420da9378fdaedd5e863a160e5d7e26e2a7db2221d8f55e07c77a5b3b85cf282',
  comparisonArtifact: 'enemy-expansion-review/en-e10-hyena-gloamstripe-ambusher/en-e10-hyena-gloamstripe-ambusher-family-comparison.png',
  comparisonArtifactSha256: '375c5f62b1b8e275daaa11419e2b992d8de0c852a6456652051da19d76b93fb9',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e10-hyena-gloamstripe-ambusher/en-e10-hyena-gloamstripe-ambusher-full-suite-four-directions-labeled.gif',
      sha256: 'aa0024b7e4104384d37cbce5b73284de3d570f42d7eafe14849da193f1318ed3', width: 640, height: 672, frames: 4, durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e10-hyena-gloamstripe-ambusher/en-e10-hyena-gloamstripe-ambusher-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: 'd9b471d7d5bd3c6fb9d8f1fca3a28e1f983aa179a32b6836fec99cab8893cb13', width: 640, height: 672, frames: 4, durationMs: 180,
    },
  },
  candidateFrameDigest: '6da5c64d98252021280fe6edd867dbe1dc5afa17a0e79a73152194860d52b885',
  dunebackComparisonDigest: '353bd2ee9818a9eac8e799a7bc0e041cb6841509d61d3aabd695e86cd146db4d',
  miremaneComparisonDigest: '6efd596731a468be7647ee37f048046072bad289f209926e4db862cb63b01f32',
  direWolfComparisonDigest: 'a94a66ee380cfcb91db3907a3a049dae4b59357870857c3ed31be259bb1f1579',
  scope: 'One complete 80-frame Gloamstripe Ambusher specialist Hyena across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle lifts and settles the long connected ruff over a lean high-shoulder stance. Walk uses four stalking diagonal paw phases with the tucked abdomen and all four ground contacts readable. Attack pulls into a body-owned feint, crouches, drives one connected shoulder-and-muzzle pounce, and recovers without detached pieces or effect pixels. Hurt uses a complete white recoil and colored wide four-paw brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline board, the distinct Complete B outlined board requested by the designer, the Complete B + Form board, synchronized raw and Complete B + Form GIFs, and approved Duneback Scavenger and Miremane Courser plus public Dire Wolf comparisons together.',
  exclusions: [
    'changes to approved Duneback Scavenger rendered pixels',
    'changes to approved Miremane Courser or public Dire Wolf pixels',
    'public Hyena registration or outline registration',
    'public catalog or facade exposure',
    'asset-pack fixture or manifest changes',
    'schema, shared renderer, exporter, validator, or frame-contract changes',
    'detached jaw, ruff, tail, or child assets',
    'new Cast pixels or new Death pixels',
    'sound glyphs, laughter marks, dust, saliva, bite arcs, impacts, particles, projectiles, glow, illumination, or effects',
    'Hyena elite',
    'Ram, Stag, Mammoth, or Rhino',
    'Furious Depraved Rhino Boss changes',
    'Runic Idol or other EN-E09 work',
    'release, accepted drift, or pull request',
  ],
  nextGate: 'The exact Gloamstripe Ambusher implementation 5d35ed0c36f84646270a3d02b13e63559798aa01, approval record 76ed7212ccddc33d1fcafa1ec97b26eb8963f096, and initial published handoff 1126852feae8f812c044806760a0063a7ef8d31f are remote verified; this reconciliation completes the bounded publication tuple. The same approved lets do nex t reply authorizes exactly one private elite Hyena candidate from this clean published reconciliation. Continue the distinct outlined PNG as review evidence only; it does not authorize outline registration. Public Hyena registration, fixtures, effects, child assets, Ram, Stag, Mammoth, Rhino, Rhino Boss work, Runic Idol, release, accepted drift, and a pull request remain closed.',
});

export const EN_E10_GLOAMSTRIPE_AMBUSHER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'long-ruff-lift', pose: 'idle', bob: 0, head: 0, ruff: -1, reach: 0, jaw: 0, stride: [0, 0, 0, 0] },
  { name: 'gloam-hunter-settle', pose: 'idle', bob: 1, head: 1, ruff: 0, reach: 0, jaw: 0, stride: [0, 0, 0, 0] },
]);

const WALK_PHASES = deepFreeze([
  { name: 'near-fore-far-hind-stalk', pose: 'walk', bob: 0, head: 0, ruff: -1, reach: 0, jaw: 0, stride: [-1, 1, 0, -1] },
  { name: 'narrow-shoulder-pass', pose: 'walk', bob: -1, head: 0, ruff: 0, reach: 0, jaw: 0, stride: [0, 1, -1, 0] },
  { name: 'far-fore-near-hind-stalk', pose: 'walk', bob: 0, head: 1, ruff: 0, reach: 0, jaw: 0, stride: [1, -1, 0, 1] },
  { name: 'low-rump-shadow-step', pose: 'walk', bob: 1, head: 1, ruff: -1, reach: 0, jaw: 0, stride: [0, -1, 1, 0] },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'gloamstripe-feint', pose: 'feint', bob: 0, head: 0, ruff: -1, reach: 1, jaw: 0, stride: [0, 0, 0, 0] },
  { name: 'four-paw-crouch', pose: 'crouch', bob: 1, head: 2, ruff: 0, reach: 0, jaw: 1, stride: [-1, 0, 1, 0] },
  { name: 'connected-shoulder-muzzle-pounce', pose: 'pounce', bob: -1, head: 1, ruff: 0, reach: -1, jaw: 2, stride: [-1, 1, 1, -1] },
  { name: 'ambusher-recover', pose: 'recover', bob: 1, head: 1, ruff: -1, reach: 0, jaw: 0, stride: [0, 0, 0, 0] },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-lean-hyena-recoil', pose: 'hurt', bob: -1, head: 0, ruff: 0, reach: 1, jaw: 0, stride: [0, 0, 0, 0], flash: true },
  { name: 'colored-wide-four-paw-brace', pose: 'brace', bob: 1, head: 2, ruff: -1, reach: 0, jaw: 0, stride: [-1, 1, 1, -1], flash: false },
]);

function createPixels() {
  return new Array(SIZE * SIZE).fill(null);
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert([x, y, width, height].every(Number.isInteger) && width > 0 && height > 0, 'Gloamstripe Ambusher geometry must use positive integers.');
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Gloamstripe Ambusher pixels must remain inside 24x24.');
      pixels[(py * SIZE) + px] = fill;
    }
  };
  return { rect, dot(x, y, fill) { rect(x, y, 1, 1, fill); } };
}

function drawSideLegs(paint, bodyY, stride) {
  const positions = [5, 9, 14, 18];
  for (let index = 0; index < positions.length; index++) {
    const footX = positions[index];
    const upperX = footX + stride[index];
    const legY = 14 + bodyY;
    paint.rect(upperX, legY, 2, 3, index < 2 ? COLORS.fur[1] : COLORS.fur[0]);
    paint.rect(Math.min(footX, upperX), legY, Math.abs(footX - upperX) + 2, 1, COLORS.fur[1]);
    paint.rect(Math.min(footX, upperX), legY + 2, Math.abs(footX - upperX) + 2, 1, COLORS.fur[1]);
    paint.rect(footX, legY + 3, 1, 20 - legY, COLORS.belly[1]);
    paint.rect(footX, 20, 1, 1, COLORS.fur[1]);
    paint.rect(footX, 21, 2, 2, COLORS.paw);
  }
}

function drawEndLegs(paint, bodyY, stride) {
  const positions = [6, 9, 14, 17];
  for (let index = 0; index < positions.length; index++) {
    const footX = positions[index];
    const upperX = footX + (stride[index] > 0 ? 1 : 0);
    const rearLeg = index === 0 || index === 3;
    const legY = 15 + bodyY;
    paint.rect(upperX, legY, 2, 2, rearLeg ? COLORS.fur[0] : COLORS.fur[1]);
    paint.rect(Math.min(footX, upperX), legY + 1, Math.abs(footX - upperX) + 2, 1, COLORS.fur[1]);
    paint.rect(footX, legY + 2, 1, 20 - legY, COLORS.belly[1]);
    paint.rect(footX, 21, 2, 2, COLORS.paw);
  }
}

function drawSide(paint, phase) {
  const y = phase.bob;
  const pouncing = phase.pose === 'pounce';
  const crouched = phase.pose === 'crouch' || phase.pose === 'brace';

  paint.rect(7, 7 + y, 7, 4, COLORS.fur[2]);
  paint.rect(7, 9 + y, 12, 6, COLORS.fur[0]);
  paint.rect(10, 11 + y, 9, 5, COLORS.fur[2]);
  paint.rect(10, 14 + y, 8, 2, COLORS.belly[0]);
  paint.rect(17, 11 + y, 3, 4, COLORS.fur[1]);
  paint.rect(7, 8 + y, 4, 7, COLORS.fur[0]);
  paint.rect(8, 11 + y, 3, 5, COLORS.belly[1]);

  const neckX = pouncing ? 5 : 6;
  paint.rect(neckX, 7 + y, 5, 7, COLORS.fur[0]);
  paint.rect(neckX + 1, 10 + y, 3, 5, COLORS.belly[0]);

  const headX = Math.max(1, 2 + phase.reach);
  const faceY = 5 + phase.head;
  paint.rect(headX + 3, faceY, 6, 5, COLORS.fur[0]);
  paint.rect(headX + 4, faceY - 1, 4, 2, COLORS.fur[2]);
  paint.rect(headX + 1, faceY + 3, 7, 3 + (phase.jaw > 0 ? 1 : 0), COLORS.ruff[0]);
  paint.rect(headX, faceY + 4, 4 + phase.jaw, 2, COLORS.ruff[1]);
  if (phase.jaw === 2) paint.rect(headX + 2, faceY + 6, 5, 1, COLORS.belly[2]);
  paint.rect(headX + 4, faceY - 2, 2, 2, COLORS.fur[1]);
  paint.rect(headX + 7, faceY - 1, 2, 2, COLORS.fur[1]);
  paint.dot(headX + 5, faceY - 1, COLORS.ear[0]);
  paint.dot(headX + 7, faceY, COLORS.ear[1]);
  paint.dot(headX + 6, faceY + 1, COLORS.eye);
  paint.dot(headX, faceY + 4, COLORS.feature);
  paint.rect(headX + 2, faceY + 5, 3 + Math.min(phase.jaw, 1), 1, COLORS.feature);
  paint.rect(headX + 4, faceY + 2, 2, 1, COLORS.stripe[1]);
  paint.dot(headX + 3, faceY + 3, COLORS.stripe[0]);

  const ruffY = 3 + y + phase.ruff;
  paint.rect(5, ruffY + 1, 3, 6, COLORS.ruff[0]);
  paint.rect(7, ruffY, 3, 7, COLORS.ruff[1]);
  paint.rect(9, ruffY + 1, 3, 7, COLORS.ruff[0]);
  paint.rect(11, ruffY + 2, 3, 6, COLORS.ruff[2]);
  paint.rect(13, ruffY + 4, 2, 5, COLORS.ruff[0]);

  paint.rect(18, 10 + y, 3, 3, COLORS.fur[1]);
  paint.rect(20, 11 + y, 3, 3, COLORS.ruff[0]);
  paint.rect(21, 13 + y, 2, 2, COLORS.ruff[1]);
  paint.rect(12, 9 + y, 3, 1, COLORS.stripe[0]);
  paint.rect(15, 11 + y, 2, 1, COLORS.stripe[1]);
  paint.rect(17, 13 + y, 2, 1, COLORS.stripe[0]);

  drawSideLegs(paint, y, phase.stride);
  if (crouched) paint.rect(6, 12 + y, 5, 3, COLORS.fur[1]);
  paint.dot(headX + 5, faceY - 1, COLORS.ear[0]);
  paint.dot(headX + 7, faceY, COLORS.ear[1]);
  paint.dot(headX + 6, faceY + 1, COLORS.eye);
  paint.dot(headX, faceY + 4, COLORS.feature);
  paint.rect(headX + 2, faceY + 5, 3 + Math.min(phase.jaw, 1), 1, COLORS.feature);
}

function drawDown(paint, phase) {
  const y = phase.bob;
  const faceY = 3 + phase.head;
  const spread = phase.pose === 'pounce' ? 1 : 0;

  paint.rect(7 - spread, 8 + y, 10 + (spread * 2), 5, COLORS.fur[0]);
  paint.rect(6 - spread, 10 + y, 12 + (spread * 2), 5, COLORS.fur[2]);
  paint.rect(8, 13 + y, 8, 3, COLORS.belly[0]);
  paint.rect(9, 14 + y, 6, 2, COLORS.belly[2]);
  paint.rect(8, 6 + y, 8, 7, COLORS.fur[0]);

  paint.rect(9, faceY, 6, 6, COLORS.fur[0]);
  paint.rect(10, faceY - 1, 4, 2, COLORS.fur[2]);
  paint.rect(8, faceY - 1, 3, 2, COLORS.fur[1]);
  paint.rect(13, faceY - 1, 3, 2, COLORS.fur[1]);
  paint.dot(9, faceY, COLORS.ear[0]);
  paint.dot(14, faceY, COLORS.ear[0]);
  paint.rect(9, faceY + 4, 6, 3 + (phase.jaw > 0 ? 1 : 0), COLORS.ruff[0]);
  paint.rect(10, faceY + 5, 4, 2, COLORS.ruff[1]);
  paint.dot(10, faceY + 2, COLORS.eye);
  paint.dot(13, faceY + 2, COLORS.eye);
  paint.dot(10, faceY + 5, COLORS.feature);
  paint.dot(13, faceY + 5, COLORS.feature);
  paint.rect(11, faceY + 6 + Math.min(phase.jaw, 1), 2, 1, COLORS.feature);
  paint.rect(9, faceY + 3, 2, 1, COLORS.stripe[1]);
  paint.rect(13, faceY + 3, 2, 1, COLORS.stripe[1]);

  const ruffY = 2 + y + phase.ruff;
  paint.rect(5, ruffY + 2, 3, 9, COLORS.ruff[0]);
  paint.rect(7, ruffY, 3, 8, COLORS.ruff[1]);
  paint.rect(14, ruffY, 3, 8, COLORS.ruff[1]);
  paint.rect(16, ruffY + 2, 3, 9, COLORS.ruff[0]);
  paint.rect(6, ruffY + 8, 3, 4, COLORS.ruff[2]);
  paint.rect(15, ruffY + 8, 3, 4, COLORS.ruff[2]);

  paint.rect(17, 12 + y, 3, 3, COLORS.fur[1]);
  paint.rect(19, 13 + y, 3, 3, COLORS.ruff[0]);
  paint.dot(21, 15 + y, COLORS.ruff[1]);
  paint.rect(8, 11 + y, 2, 1, COLORS.stripe[0]);
  paint.rect(14, 12 + y, 2, 1, COLORS.stripe[1]);
  drawEndLegs(paint, y, phase.stride);

  paint.dot(9, faceY, COLORS.ear[0]);
  paint.dot(14, faceY, COLORS.ear[0]);
  paint.dot(10, faceY + 2, COLORS.eye);
  paint.dot(13, faceY + 2, COLORS.eye);
  paint.dot(10, faceY + 5, COLORS.feature);
  paint.dot(13, faceY + 5, COLORS.feature);
  paint.rect(11, faceY + 6 + Math.min(phase.jaw, 1), 2, 1, COLORS.feature);
}

function drawUp(paint, phase) {
  const y = phase.bob;
  const headY = phase.head;

  paint.rect(7, 8 + y, 10, 5, COLORS.fur[1]);
  paint.rect(6, 10 + y, 12, 5, COLORS.fur[0]);
  paint.rect(8, 13 + y, 8, 4, COLORS.belly[1]);
  paint.rect(9, 5 + y, 6, 7, COLORS.fur[0]);
  paint.rect(9, 3 + headY, 6, 4, COLORS.fur[1]);
  paint.rect(8, 3 + headY, 3, 2, COLORS.fur[1]);
  paint.rect(13, 3 + headY, 3, 2, COLORS.fur[1]);
  paint.dot(9, 4 + headY, COLORS.ear[1]);
  paint.dot(14, 4 + headY, COLORS.ear[1]);

  const ruffY = 2 + y + phase.ruff;
  paint.rect(5, ruffY + 2, 4, 10, COLORS.ruff[0]);
  paint.rect(7, ruffY, 4, 10, COLORS.ruff[1]);
  paint.rect(10, ruffY + 1, 4, 9, COLORS.ruff[0]);
  paint.rect(13, ruffY + 2, 4, 9, COLORS.ruff[2]);
  paint.rect(16, ruffY + 5, 3, 7, COLORS.ruff[0]);
  paint.rect(9, 7 + y, 6, 5, COLORS.fur[0]);
  paint.rect(10, 8 + y, 4, 4, COLORS.ruff[0]);

  paint.rect(15, 12 + y, 4, 3, COLORS.fur[1]);
  paint.rect(18, 13 + y, 3, 3, COLORS.ruff[0]);
  paint.rect(19, 15 + y, 2, 2, COLORS.ruff[1]);
  paint.rect(8, 11 + y, 2, 1, COLORS.stripe[0]);
  paint.rect(14, 12 + y, 2, 1, COLORS.stripe[1]);
  drawEndLegs(paint, y, phase.stride);
  paint.dot(9, 4 + headY, COLORS.ear[1]);
  paint.dot(14, 4 + headY, COLORS.ear[1]);
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
    return HURT_PHASES[EN_E10_GLOAMSTRIPE_AMBUSHER_DEATH_SOURCE_FRAMES[frame]];
  }
  throw new TypeError('Animation ' + animation + ' is not implemented for Gloamstripe Ambusher.');
}

function buildPixels(direction, animation, frame) {
  const phase = phaseFor(animation, frame);
  const canonical = direction === 'right' ? 'left' : direction;
  const pixels = createPixels();
  const paint = painter(pixels);
  if (canonical === 'down') drawDown(paint, phase);
  else if (canonical === 'up') drawUp(paint, phase);
  else if (canonical === 'left') drawSide(paint, phase);
  else throw new TypeError('Unsupported Gloamstripe Ambusher direction ' + direction + '.');
  let rendered = direction === 'right' ? mirrorPixels(pixels) : pixels;
  if (phase.flash) rendered = rendered.map((color) => color ? COLORS.flash : null);
  return { phase, pixels: rendered };
}

function paintPixels(context, pixels) {
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    const color = pixels[(y * SIZE) + x];
    if (!color) continue;
    context.fillStyle = color;
    context.fillRect(x, y, 1, 1);
  }
}

export function renderEnE10GloamstripeAmbusherFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Gloamstripe Ambusher rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Gloamstripe Ambusher direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'hyena',
    variant: 'gloamstripe-ambusher',
    direction,
    animation,
    frame,
    phase: phase.name,
    gloamstripeAmbusherGate: EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.id,
    architectureDecision: EN_E10_HYENA_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E10_DUNEBACK_SCAVENGER_GATE.id,
    actorTopology: EN_E10_GLOAMSTRIPE_AMBUSHER_DATA.actorTopology,
    childAssetCount: EN_E10_GLOAMSTRIPE_AMBUSHER_DATA.childAssets.length,
    alphaPolicy: EN_E10_GLOAMSTRIPE_AMBUSHER_DATA.alphaPolicy,
    effectBoundary: EN_E10_GLOAMSTRIPE_AMBUSHER_DATA.effectBoundary,
  });
}

export const EN_E10_GLOAMSTRIPE_AMBUSHER_RENDERER = deepFreeze({
  key: 'en-e10-hyena-gloamstripe-ambusher-v1',
  chassis: EN_E10_GLOAMSTRIPE_AMBUSHER_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'hyena', 'The EN-E10 Gloamstripe Ambusher renderer is restricted to Hyena.');
    assert(variant.id === 'gloamstripe-ambusher', 'The EN-E10 Gloamstripe Ambusher renderer is restricted to Gloamstripe Ambusher.');
    return renderEnE10GloamstripeAmbusherFrame(context, direction, animation.id, frame);
  },
});

const GLOAMSTRIPE_AMBUSHER_VARIANT = deepFreeze({
  id: 'gloamstripe-ambusher',
  name: 'Gloamstripe Ambusher',
  role: EN_E10_GLOAMSTRIPE_AMBUSHER_CONTRACT.role,
  status: EN_E10_GLOAMSTRIPE_AMBUSHER_CONTRACT.state,
  brief: 'A private complete specialist Hyena with lean slate-violet fur, a long connected indigo ruff, cold angular face and flank stripes, compact dark wedge muzzle, rounded ears, cyan eyes, tucked abdomen, low tail, four separated dark paws, and a body-owned feint-to-pounce; all effects remain external.',
  rendererData: EN_E10_GLOAMSTRIPE_AMBUSHER_DATA,
});

export const EN_E10_GLOAMSTRIPE_AMBUSHER_FAMILY = deepFreeze({
  id: 'hyena',
  name: 'Hyena Gloamstripe Ambusher Review',
  sliceId: 'EN-E10',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E10_GLOAMSTRIPE_AMBUSHER_CONTRACT.chassis,
  rendererKey: EN_E10_GLOAMSTRIPE_AMBUSHER_RENDERER.key,
  variants: [GLOAMSTRIPE_AMBUSHER_VARIANT],
  rendererData: {
    contractCard: EN_E10_HYENA_SPECIALIST_CONTRACT_CARD.id,
    architectureDecision: EN_E10_HYENA_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E10_DUNEBACK_SCAVENGER_GATE.id,
    activeGate: EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.id,
  },
  review: {
    baselineVariant: 'gloamstripe-ambusher',
    scale: 8,
    notes: 'Awaiting explicit visual approval as one lean dusk specialist Hyena against approved Duneback Scavenger and Miremane Courser plus public Dire Wolf. The review packet includes the separately requested Complete B outlined PNG. Keep outline registration, public registration, fixtures, effects, child assets, elite Hyena, later EN-E10 families, Rhino Boss work, and deferred Runic Idol separate.',
  },
});

export const EN_E10_GLOAMSTRIPE_AMBUSHER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E10_GLOAMSTRIPE_AMBUSHER_RENDERER],
  families: [EN_E10_GLOAMSTRIPE_AMBUSHER_FAMILY],
});
