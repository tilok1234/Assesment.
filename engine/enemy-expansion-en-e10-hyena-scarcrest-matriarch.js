import { SIZE } from './catalogs.js';
import { createEnemyExpansionRegistry, ENEMY_EXPANSION_STATES } from './enemy-expansion.js';
import {
  EN_E10_HYENA_CONTRACT_CARD,
  EN_E10_HYENA_TOPOLOGY_DECISION,
} from './enemy-expansion-en-e10-hyena-duneback-scavenger.js';
import { EN_E10_GLOAMSTRIPE_AMBUSHER_GATE } from './enemy-expansion-en-e10-hyena-gloamstripe-ambusher.js';

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
  fur: ['#735242', '#49332d', '#a47859'],
  crest: ['#2a1e23', '#171418', '#5a3633'],
  belly: ['#c29a78', '#80604f', '#e0bb91'],
  scar: ['#d9b09a', '#9c675f'],
  ear: ['#9b4c54', '#5c2b36'],
  paw: '#211719',
  feature: '#120f12',
  eye: '#f2d261',
  flash: '#f4f4f4',
});

export const EN_E10_HYENA_ELITE_CONTRACT_CARD = deepFreeze({
  id: 'en-e10-hyena-scarcrest-matriarch-v1',
  sliceId: 'EN-E10',
  family: 'hyena',
  familyName: 'Hyena',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingVariant: {
    id: 'gloamstripe-ambusher',
    role: 'specialist',
    status: 'approved-published-reconciled',
    gateId: EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.id,
  },
  activeVariant: {
    id: 'scarcrest-matriarch',
    name: 'Scarcrest Matriarch',
    role: 'elite',
    status: 'implemented-full-awaiting-visual-approval',
  },
  deferredRoles: [],
  actorTopology: EN_E10_HYENA_TOPOLOGY_DECISION.selected,
  styleContract: EN_E10_HYENA_CONTRACT_CARD.styleContract,
  effectBoundary: EN_E10_HYENA_CONTRACT_CARD.effectBoundary,
});

export const EN_E10_SCARCREST_MATRIARCH_CONTRACT = deepFreeze({
  sliceId: 'EN-E10',
  family: 'hyena',
  variant: 'scarcrest-matriarch',
  role: 'elite',
  state: 'implemented-complete-motion-awaiting-visual-approval',
  topology: EN_E10_HYENA_TOPOLOGY_DECISION.selected,
  chassis: 'baked-single-actor-broad-high-shoulder-heavy-neck-raised-crest-scarred-wedge-jaw-four-paw-hyena-v1',
  silhouette: 'A broad elite Hyena matriarch with massive high shoulders, a heavy connected neck, descending back, low powerful rump, deep chest, compact scarred wedge muzzle, two rounded ears, a raised connected crown-like crest, thick connected lowered tail, and four separated dark paws. It must remain a grounded Hyena rather than an upright Werewolf, reduced Rhino Boss, long-snouted Dire Wolf, or recolored Duneback and Gloamstripe body.',
  visualIdentity: 'Burnished umber fur, near-black wine crest and muzzle, pale sand throat and belly, two integrated pale muzzle scars with one shoulder scar, crimson ear interiors, gold eyes, and black-brown paws establish the elite matriarch. Trophies, chains, sound glyphs, dust, saliva, bite arcs, impacts, particles, projectiles, glow, and illumination remain external.',
  effectBoundary: EN_E10_HYENA_CONTRACT_CARD.effectBoundary,
});

export const EN_E10_SCARCREST_MATRIARCH_DATA = deepFreeze({
  actor: {
    species: 'authored-hyena-elite',
    bodyBuild: 'broad-high-shouldered-heavy-necked-low-rumped-elite',
    skin: 'burnished-umber-fur',
    hairStyle: 'connected-raised-wine-scarcrest',
    hairColor: 'near-black-wine',
    expression: 'gold-matriarch-stare',
    faceDetail: 'compact-dark-wedge-muzzle-rounded-ears-gold-eyes-and-integrated-scars',
    headgear: 'none',
    outfit: 'pale-throat-belly-and-body-owned-scar-marks',
    outfitColor: 'umber-wine-sand-crimson-and-gold',
    outfitTier: 'tier3',
    weapon: 'body-owned-crushing-connected-jaw',
    weaponTier: 'none',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: { skin: COLORS.fur, hair: COLORS.crest, outfit: COLORS.belly },
  },
  scarcrestMatriarch: COLORS,
  actorTopology: EN_E10_HYENA_TOPOLOGY_DECISION.selected,
  childAssets: [],
  alphaPolicy: 'binary-single-component-broad-high-shoulder-heavy-neck-scarred-wedge-muzzle-raised-connected-crest-tail-and-four-grounded-paws',
  effectBoundary: EN_E10_HYENA_CONTRACT_CARD.effectBoundary,
  bakedEffects: [],
});

export const EN_E10_SCARCREST_MATRIARCH_GATE = deepFreeze({
  id: 'en-e10-hyena-scarcrest-matriarch-full-v1',
  status: 'awaiting-visual-approval',
  baseCheckpoint: '76117603035f6880f25f7dc8356ba23221df2af9',
  authorizedOn: '2026-08-13',
  authorizationEvidence: 'The exact Gloamstripe Ambusher packet was visually approved at digest 6da5c64d98252021280fe6edd867dbe1dc5afa17a0e79a73152194860d52b885 when the designer replied: approved lets do nex t. After its bounded implementation 5d35ed0c36f84646270a3d02b13e63559798aa01, approval record 76ed7212ccddc33d1fcafa1ec97b26eb8963f096, initial published handoff 1126852feae8f812c044806760a0063a7ef8d31f, and final reconciliation 76117603035f6880f25f7dc8356ba23221df2af9 were pushed and remote verified, the lets do nex t portion authorizes exactly one private elite Hyena full 80-frame candidate under the approved baked-single-actor-grounded-quadruped topology. Continue the distinct Complete B outlined PNG as review evidence only; it does not authorize outline registration. Public Hyena registration, fixtures, effects, child assets, Ram, Stag, Mammoth, Rhino, Rhino Boss work, Runic Idol, release, accepted drift, and a pull request remain closed.',
  architectureDecision: EN_E10_HYENA_TOPOLOGY_DECISION.id,
  precedingApproval: {
    gateId: EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.id,
    artifactSha256: EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.artifactSha256,
    outlinedArtifactSha256: EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.outlinedArtifactSha256,
    assembledArtifactSha256: EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.initialPublishedHandoff,
    currentReconciliation: '76117603035f6880f25f7dc8356ba23221df2af9',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e10-hyena-scarcrest-matriarch/en-e10-hyena-scarcrest-matriarch-full-suite-raw.png',
  artifactSha256: 'dedd81ffe72ccef6357faf67bb8b26e247a8bba7e15f562ec4296046658c2026',
  outlinedArtifact: 'enemy-expansion-review/en-e10-hyena-scarcrest-matriarch/en-e10-hyena-scarcrest-matriarch-full-suite-outlined-complete-b.png',
  outlinedArtifactSha256: '4b77fa3209c2d82df3cb91a11a42ef5e15ca31e4e84fc8720356ec2129a857e6',
  assembledArtifact: 'enemy-expansion-review/en-e10-hyena-scarcrest-matriarch/en-e10-hyena-scarcrest-matriarch-full-suite-complete-b-form.png',
  assembledArtifactSha256: 'a48ff7eee5c35302b771e721ce8fd4e9eed471a321a9dda27be8182979c4d31d',
  comparisonArtifact: 'enemy-expansion-review/en-e10-hyena-scarcrest-matriarch/en-e10-hyena-scarcrest-matriarch-family-comparison.png',
  comparisonArtifactSha256: 'b976fc42cb7f0c5d3df89c746db01eb962bbae7642b93ba98b474a011ee7eed0',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e10-hyena-scarcrest-matriarch/en-e10-hyena-scarcrest-matriarch-full-suite-four-directions-labeled.gif',
      sha256: '6e187f8fb2940a68715ec2ee835dd49cfe42703c1089f79aff14e6e2af550ade', width: 640, height: 672, frames: 4, durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e10-hyena-scarcrest-matriarch/en-e10-hyena-scarcrest-matriarch-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '1a2ba4ca2ee3a2279eb3b43a22a1bfb6d87c863e9956d992b969ae282841b5df', width: 640, height: 672, frames: 4, durationMs: 180,
    },
  },
  candidateFrameDigest: '81e0c289eae61184741155c99a1cef9c03d3d3bae115f7eb96489572fbc00cf7',
  gloamstripeComparisonDigest: '6da5c64d98252021280fe6edd867dbe1dc5afa17a0e79a73152194860d52b885',
  dunebackComparisonDigest: '353bd2ee9818a9eac8e799a7bc0e041cb6841509d61d3aabd695e86cd146db4d',
  direWolfComparisonDigest: 'a94a66ee380cfcb91db3907a3a049dae4b59357870857c3ed31be259bb1f1579',
  scope: 'One complete 80-frame Scarcrest Matriarch elite Hyena across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle raises and settles the connected scarcrest over a heavy four-paw stance. Walk uses four weighty diagonal paw phases with massive shoulders, low rump, and every ground contact readable. Attack plants the body, opens the connected wedge jaw, drives one heavy neck-and-jaw crush, and recovers without detached pieces or effect pixels. Hurt uses a complete white recoil and colored wide four-paw brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline, distinct Complete B outlined, and Complete B + Form full-suite boards, synchronized GIFs, and approved Gloamstripe Ambusher and Duneback Scavenger plus public Dire Wolf comparisons together.',
  exclusions: [
    'changes to approved Gloamstripe Ambusher or Duneback Scavenger rendered pixels',
    'changes to public Dire Wolf pixels',
    'public Hyena registration or outline registration',
    'public catalog or facade exposure',
    'asset-pack fixture or manifest changes',
    'schema, shared renderer, exporter, validator, or frame-contract changes',
    'detached jaw, crest, tail, trophies, chains, or child assets',
    'new Cast pixels or new Death pixels',
    'sound glyphs, laughter marks, dust, saliva, bite arcs, impacts, particles, projectiles, glow, illumination, or effects',
    'Ram, Stag, Mammoth, or Rhino',
    'Furious Depraved Rhino Boss changes',
    'Runic Idol or other EN-E09 work',
    'release, accepted drift, or pull request',
  ],
  nextGate: 'Stop for explicit visual approval of this exact frozen Scarcrest Matriarch digest and its four PNG plus two GIF review hashes. Do not register or publish it before approval. The distinct outlined PNG is review evidence only and does not authorize outline registration. All later EN-E10 families remain closed.',
});

export const EN_E10_SCARCREST_MATRIARCH_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'scarcrest-raise', pose: 'idle', bob: 0, head: 0, crest: -1, reach: 0, jaw: 0, stride: [0, 0, 0, 0] },
  { name: 'matriarch-neck-settle', pose: 'idle', bob: 1, head: 1, crest: 0, reach: 0, jaw: 0, stride: [0, 0, 0, 0] },
]);
const WALK_PHASES = deepFreeze([
  { name: 'near-fore-far-hind-weight', pose: 'walk', bob: 0, head: 0, crest: -1, reach: 0, jaw: 0, stride: [-1, 1, 0, -1] },
  { name: 'massive-shoulder-pass', pose: 'walk', bob: -1, head: 0, crest: 0, reach: 0, jaw: 0, stride: [0, 1, -1, 0] },
  { name: 'far-fore-near-hind-weight', pose: 'walk', bob: 0, head: 1, crest: 0, reach: 0, jaw: 0, stride: [1, -1, 0, 1] },
  { name: 'low-rump-heavy-settle', pose: 'walk', bob: 1, head: 1, crest: -1, reach: 0, jaw: 0, stride: [0, -1, 1, 0] },
]);
const ATTACK_PHASES = deepFreeze([
  { name: 'matriarch-four-paw-plant', pose: 'plant', bob: 1, head: 1, crest: 0, reach: 1, jaw: 0, stride: [-1, 0, 1, 0] },
  { name: 'scarred-wedge-jaw-open', pose: 'open', bob: 1, head: 2, crest: -1, reach: 0, jaw: 2, stride: [-1, 0, 1, 0] },
  { name: 'connected-heavy-neck-jaw-crush', pose: 'crush', bob: 0, head: 1, crest: 0, reach: -1, jaw: 1, stride: [-1, 1, 1, -1] },
  { name: 'scarcrest-recover', pose: 'recover', bob: 1, head: 1, crest: -1, reach: 0, jaw: 0, stride: [0, 0, 0, 0] },
]);
const HURT_PHASES = deepFreeze([
  { name: 'white-matriarch-recoil', pose: 'hurt', bob: -1, head: 0, crest: 0, reach: 1, jaw: 0, stride: [0, 0, 0, 0], flash: true },
  { name: 'colored-heavy-four-paw-brace', pose: 'brace', bob: 1, head: 2, crest: -1, reach: 0, jaw: 0, stride: [-1, 1, 1, -1], flash: false },
]);

function createPixels() { return new Array(SIZE * SIZE).fill(null); }

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert([x, y, width, height].every(Number.isInteger) && width > 0 && height > 0, 'Scarcrest Matriarch geometry must use positive integers.');
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Scarcrest Matriarch pixels must remain inside 24x24.');
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
    paint.rect(upperX, legY, 2, 4, index < 2 ? COLORS.fur[1] : COLORS.fur[0]);
    paint.rect(Math.min(footX, upperX), legY, Math.abs(footX - upperX) + 2, 1, COLORS.fur[1]);
    paint.rect(Math.min(footX, upperX), legY + 3, Math.abs(footX - upperX) + 2, 1, COLORS.fur[1]);
    paint.rect(footX, legY + 4, 1, 19 - legY, COLORS.belly[1]);
    paint.rect(footX, 20, 2, 1, COLORS.fur[1]);
    paint.rect(footX, 21, 2, 2, COLORS.paw);
  }
}

function drawEndLegs(paint, bodyY, stride) {
  const positions = [6, 9, 14, 17];
  for (let index = 0; index < positions.length; index++) {
    const footX = positions[index];
    const upperX = footX + (stride[index] > 0 ? 1 : 0);
    const legY = 15 + bodyY;
    paint.rect(upperX, legY, 2, 3, index === 0 || index === 3 ? COLORS.fur[0] : COLORS.fur[1]);
    paint.rect(Math.min(footX, upperX), legY + 2, Math.abs(footX - upperX) + 2, 1, COLORS.fur[1]);
    paint.rect(footX, legY + 3, 1, 20 - legY, COLORS.belly[1]);
    paint.rect(footX, 20, 2, 1, COLORS.fur[1]);
    paint.rect(footX, 21, 2, 2, COLORS.paw);
  }
}

function drawSide(paint, phase) {
  const y = phase.bob;
  const crushing = phase.pose === 'crush';
  const braced = phase.pose === 'plant' || phase.pose === 'brace';

  paint.rect(6, 6 + y, 9, 6, COLORS.fur[0]);
  paint.rect(7, 5 + y, 8, 3, COLORS.fur[2]);
  paint.rect(8, 9 + y, 12, 7, COLORS.fur[0]);
  paint.rect(11, 11 + y, 9, 5, COLORS.fur[2]);
  paint.rect(10, 14 + y, 9, 2, COLORS.belly[0]);
  paint.rect(17, 11 + y, 4, 5, COLORS.fur[1]);

  const neckX = crushing ? 4 : 5;
  paint.rect(neckX, 6 + y, 7, 9, COLORS.fur[0]);
  paint.rect(neckX + 1, 9 + y, 5, 6, COLORS.belly[1]);
  paint.rect(neckX + 4, 7 + y, 3, 7, COLORS.crest[0]);

  const headX = Math.max(1, 1 + phase.reach);
  const faceY = 4 + phase.head;
  paint.rect(headX + 3, faceY, 7, 6, COLORS.fur[0]);
  paint.rect(headX + 4, faceY - 1, 5, 2, COLORS.fur[2]);
  paint.rect(headX + 1, faceY + 3, 8, 3 + (phase.jaw > 0 ? 1 : 0), COLORS.crest[0]);
  paint.rect(headX, faceY + 4, 5 + Math.min(phase.jaw, 1), 2, COLORS.crest[1]);
  if (phase.jaw > 0) paint.rect(headX + 2, faceY + 6, 6 + Math.min(phase.jaw, 1), 1, COLORS.belly[2]);
  paint.rect(headX + 4, faceY - 2, 2, 2, COLORS.fur[1]);
  paint.rect(headX + 8, faceY - 1, 2, 2, COLORS.fur[1]);
  paint.dot(headX + 5, faceY - 1, COLORS.ear[0]);
  paint.dot(headX + 8, faceY, COLORS.ear[1]);
  paint.dot(headX + 7, faceY + 1, COLORS.eye);
  paint.dot(headX, faceY + 4, COLORS.feature);
  paint.rect(headX + 2, faceY + 5, 4 + Math.min(phase.jaw, 1), 1, COLORS.feature);
  paint.rect(headX + 4, faceY + 2, 1, 3, COLORS.scar[0]);
  paint.rect(headX + 5, faceY + 3, 2, 1, COLORS.scar[1]);

  const crestY = 2 + y + phase.crest;
  paint.rect(5, crestY + 2, 3, 7, COLORS.crest[0]);
  paint.rect(7, crestY, 3, 8, COLORS.crest[1]);
  paint.rect(9, crestY + 1, 3, 8, COLORS.crest[0]);
  paint.rect(11, crestY + 2, 3, 7, COLORS.crest[2]);
  paint.rect(13, crestY + 4, 3, 6, COLORS.crest[0]);

  paint.rect(18, 10 + y, 3, 4, COLORS.fur[1]);
  paint.rect(20, 11 + y, 3, 4, COLORS.crest[0]);
  paint.rect(21, 14 + y, 2, 2, COLORS.crest[1]);
  paint.rect(13, 9 + y, 3, 1, COLORS.scar[1]);
  paint.dot(16, 10 + y, COLORS.scar[0]);

  drawSideLegs(paint, y, phase.stride);
  if (braced) paint.rect(5, 12 + y, 6, 4, COLORS.fur[1]);
  paint.dot(headX + 5, faceY - 1, COLORS.ear[0]);
  paint.dot(headX + 8, faceY, COLORS.ear[1]);
  paint.dot(headX + 7, faceY + 1, COLORS.eye);
  paint.dot(headX, faceY + 4, COLORS.feature);
  paint.rect(headX + 2, faceY + 5, 4 + Math.min(phase.jaw, 1), 1, COLORS.feature);
}

function drawDown(paint, phase) {
  const y = phase.bob;
  const faceY = 3 + phase.head;
  const spread = phase.pose === 'crush' ? 1 : 0;

  paint.rect(6 - spread, 7 + y, 12 + (spread * 2), 6, COLORS.fur[0]);
  paint.rect(5 - spread, 10 + y, 14 + (spread * 2), 6, COLORS.fur[2]);
  paint.rect(7, 13 + y, 10, 3, COLORS.belly[0]);
  paint.rect(9, 15 + y, 6, 2, COLORS.belly[2]);
  paint.rect(7, 5 + y, 10, 9, COLORS.fur[0]);

  paint.rect(8, faceY, 8, 7, COLORS.fur[0]);
  paint.rect(10, faceY - 1, 4, 2, COLORS.fur[2]);
  paint.rect(7, faceY - 1, 3, 2, COLORS.fur[1]);
  paint.rect(14, faceY - 1, 3, 2, COLORS.fur[1]);
  paint.dot(8, faceY, COLORS.ear[0]);
  paint.dot(15, faceY, COLORS.ear[0]);
  paint.rect(8, faceY + 4, 8, 3 + (phase.jaw > 0 ? 1 : 0), COLORS.crest[0]);
  paint.rect(9, faceY + 5, 6, 2, COLORS.crest[1]);
  if (phase.jaw > 0) paint.rect(9, faceY + 7, 6, 1, COLORS.belly[2]);
  paint.dot(10, faceY + 2, COLORS.eye);
  paint.dot(13, faceY + 2, COLORS.eye);
  paint.dot(9, faceY + 5, COLORS.feature);
  paint.dot(14, faceY + 5, COLORS.feature);
  paint.rect(11, faceY + 6 + Math.min(phase.jaw, 1), 2, 1, COLORS.feature);
  paint.rect(10, faceY + 3, 1, 3, COLORS.scar[0]);
  paint.rect(13, faceY + 3, 1, 2, COLORS.scar[1]);

  const crestY = 2 + y + phase.crest;
  paint.rect(5, crestY + 3, 3, 10, COLORS.crest[0]);
  paint.rect(7, crestY + 1, 3, 9, COLORS.crest[1]);
  paint.rect(14, crestY + 1, 3, 9, COLORS.crest[1]);
  paint.rect(16, crestY + 3, 3, 10, COLORS.crest[0]);
  paint.rect(6, crestY + 9, 3, 4, COLORS.crest[2]);
  paint.rect(15, crestY + 9, 3, 4, COLORS.crest[2]);

  paint.rect(17, 12 + y, 4, 4, COLORS.fur[1]);
  paint.rect(20, 13 + y, 2, 4, COLORS.crest[0]);
  paint.dot(21, 16 + y, COLORS.crest[1]);
  paint.rect(7, 11 + y, 3, 1, COLORS.scar[1]);
  paint.dot(10, 12 + y, COLORS.scar[0]);
  drawEndLegs(paint, y, phase.stride);

  paint.dot(8, faceY, COLORS.ear[0]);
  paint.dot(15, faceY, COLORS.ear[0]);
  paint.dot(10, faceY + 2, COLORS.eye);
  paint.dot(13, faceY + 2, COLORS.eye);
  paint.dot(9, faceY + 5, COLORS.feature);
  paint.dot(14, faceY + 5, COLORS.feature);
  paint.rect(11, faceY + 6 + Math.min(phase.jaw, 1), 2, 1, COLORS.feature);
}

function drawUp(paint, phase) {
  const y = phase.bob;
  const headY = phase.head;

  paint.rect(6, 7 + y, 12, 6, COLORS.fur[1]);
  paint.rect(5, 10 + y, 14, 6, COLORS.fur[0]);
  paint.rect(7, 14 + y, 10, 3, COLORS.belly[1]);
  paint.rect(8, 4 + y, 8, 9, COLORS.fur[0]);
  paint.rect(8, 2 + headY, 8, 5, COLORS.fur[1]);
  paint.rect(7, 2 + headY, 3, 2, COLORS.fur[1]);
  paint.rect(14, 2 + headY, 3, 2, COLORS.fur[1]);
  paint.dot(8, 3 + headY, COLORS.ear[1]);
  paint.dot(15, 3 + headY, COLORS.ear[1]);

  const crestY = 2 + y + phase.crest;
  paint.rect(5, crestY + 3, 4, 11, COLORS.crest[0]);
  paint.rect(7, crestY + 1, 4, 10, COLORS.crest[1]);
  paint.rect(10, crestY, 4, 10, COLORS.crest[0]);
  paint.rect(13, crestY + 2, 4, 10, COLORS.crest[2]);
  paint.rect(16, crestY + 4, 3, 9, COLORS.crest[0]);
  paint.rect(9, 7 + y, 6, 5, COLORS.fur[0]);
  paint.rect(10, 8 + y, 4, 4, COLORS.crest[0]);

  paint.rect(16, 12 + y, 4, 4, COLORS.fur[1]);
  paint.rect(19, 13 + y, 3, 4, COLORS.crest[0]);
  paint.rect(20, 16 + y, 2, 2, COLORS.crest[1]);
  paint.rect(7, 11 + y, 3, 1, COLORS.scar[1]);
  paint.dot(10, 12 + y, COLORS.scar[0]);
  drawEndLegs(paint, y, phase.stride);
  paint.dot(8, 3 + headY, COLORS.ear[1]);
  paint.dot(15, 3 + headY, COLORS.ear[1]);
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
  if (animation === 'death') { assert(frame >= 0 && frame < 4, 'Frame ' + frame + ' is invalid for death.'); return HURT_PHASES[EN_E10_SCARCREST_MATRIARCH_DEATH_SOURCE_FRAMES[frame]]; }
  throw new TypeError('Animation ' + animation + ' is not implemented for Scarcrest Matriarch.');
}

function buildPixels(direction, animation, frame) {
  const phase = phaseFor(animation, frame);
  const canonical = direction === 'right' ? 'left' : direction;
  const pixels = createPixels();
  const paint = painter(pixels);
  if (canonical === 'down') drawDown(paint, phase);
  else if (canonical === 'up') drawUp(paint, phase);
  else if (canonical === 'left') drawSide(paint, phase);
  else throw new TypeError('Unsupported Scarcrest Matriarch direction ' + direction + '.');
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

export function renderEnE10ScarcrestMatriarchFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Scarcrest Matriarch rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Scarcrest Matriarch direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'hyena', variant: 'scarcrest-matriarch', direction, animation, frame, phase: phase.name,
    scarcrestMatriarchGate: EN_E10_SCARCREST_MATRIARCH_GATE.id,
    architectureDecision: EN_E10_HYENA_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.id,
    actorTopology: EN_E10_SCARCREST_MATRIARCH_DATA.actorTopology,
    childAssetCount: EN_E10_SCARCREST_MATRIARCH_DATA.childAssets.length,
    alphaPolicy: EN_E10_SCARCREST_MATRIARCH_DATA.alphaPolicy,
    effectBoundary: EN_E10_SCARCREST_MATRIARCH_DATA.effectBoundary,
  });
}

export const EN_E10_SCARCREST_MATRIARCH_RENDERER = deepFreeze({
  key: 'en-e10-hyena-scarcrest-matriarch-v1',
  chassis: EN_E10_SCARCREST_MATRIARCH_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'hyena', 'The EN-E10 Scarcrest Matriarch renderer is restricted to Hyena.');
    assert(variant.id === 'scarcrest-matriarch', 'The EN-E10 Scarcrest Matriarch renderer is restricted to Scarcrest Matriarch.');
    return renderEnE10ScarcrestMatriarchFrame(context, direction, animation.id, frame);
  },
});

const SCARCREST_MATRIARCH_VARIANT = deepFreeze({
  id: 'scarcrest-matriarch',
  name: 'Scarcrest Matriarch',
  role: EN_E10_SCARCREST_MATRIARCH_CONTRACT.role,
  status: EN_E10_SCARCREST_MATRIARCH_CONTRACT.state,
  brief: 'A private complete elite Hyena with broad burnished-umber mass, massive high shoulders, heavy connected neck, raised near-black wine scarcrest, scarred compact wedge muzzle, rounded ears, gold eyes, deep pale chest, thick connected low tail, four separated dark paws, and a body-owned crushing connected jaw; all effects remain external.',
  rendererData: EN_E10_SCARCREST_MATRIARCH_DATA,
});

export const EN_E10_SCARCREST_MATRIARCH_FAMILY = deepFreeze({
  id: 'hyena',
  name: 'Hyena Scarcrest Matriarch Review',
  sliceId: 'EN-E10',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E10_SCARCREST_MATRIARCH_CONTRACT.chassis,
  rendererKey: EN_E10_SCARCREST_MATRIARCH_RENDERER.key,
  variants: [SCARCREST_MATRIARCH_VARIANT],
  rendererData: {
    contractCard: EN_E10_HYENA_ELITE_CONTRACT_CARD.id,
    architectureDecision: EN_E10_HYENA_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E10_GLOAMSTRIPE_AMBUSHER_GATE.id,
    activeGate: EN_E10_SCARCREST_MATRIARCH_GATE.id,
  },
  review: {
    baselineVariant: 'scarcrest-matriarch',
    scale: 8,
    notes: 'Awaiting explicit visual approval as one broad heavy-necked elite Hyena against approved Gloamstripe Ambusher and Duneback Scavenger plus public Dire Wolf. The packet includes a distinct Complete B outlined PNG as review evidence. Keep outline registration, public registration, fixtures, effects, child assets, later EN-E10 families, Rhino Boss work, and deferred Runic Idol separate.',
  },
});

export const EN_E10_SCARCREST_MATRIARCH_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E10_SCARCREST_MATRIARCH_RENDERER],
  families: [EN_E10_SCARCREST_MATRIARCH_FAMILY],
});
