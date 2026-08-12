import { SIZE } from './catalogs.js';
import { createEnemyExpansionRegistry, ENEMY_EXPANSION_STATES } from './enemy-expansion.js';
import { EN_E09_CROWNSEAL_GRIMOIRE_GATE } from './enemy-expansion-en-e09-living-book-crownseal-grimoire.js';

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
  fur: ['#8b643d', '#5a402d', '#b98b50'],
  mane: ['#3b2d27', '#211b1a', '#6b4932'],
  belly: ['#c0a06b', '#7a5a3b', '#e0c48b'],
  spot: ['#4a3428', '#30241f'],
  ear: ['#9e5c52', '#5a3434'],
  paw: '#241d1b',
  feature: '#171416',
  eye: '#e0b84d',
  flash: '#f4f4f4',
});

export const EN_E10_HYENA_TOPOLOGY_DECISION = deepFreeze({
  id: 'en-e10-hyena-baked-grounded-quadruped-topology-v1',
  status: 'selected',
  selected: 'baked-single-actor-grounded-quadruped',
  selectedOn: '2026-08-13',
  evidence: 'After choosing EN-E10, the designer approved the recommended topology: one connected grounded 24x24 Hyena actor with high shoulders, low rump, wedge muzzle, rounded ears, bristled mane, connected tail, four readable paws in every direction, zero child assets, and a body-owned bite lunge.',
  childAssets: [],
  required: [
    'one connected grounded 24x24 actor',
    'high shoulders and low rump',
    'compact wedge muzzle and rounded ears',
    'connected bristled mane and tail',
    'four readable grounded paws in every direction',
    'body-owned bite or jaw lunge',
  ],
  forbidden: [
    'detached jaw',
    'detached tail',
    'child assets',
    'runtime attachment offsets',
    'dust or saliva sprites',
    'bite arcs',
    'impact particles',
    'laughter marks',
    'glow or illumination',
  ],
});

export const EN_E10_HYENA_CONTRACT_CARD = deepFreeze({
  id: 'en-e10-hyena-duneback-scavenger-v1',
  sliceId: 'EN-E10',
  family: 'hyena',
  familyName: 'Hyena',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingCheckpoint: {
    id: EN_E09_CROWNSEAL_GRIMOIRE_GATE.id,
    variant: 'crownseal-grimoire',
    status: 'approved-published-reconciled',
  },
  activeVariant: {
    id: 'duneback-scavenger',
    name: 'Duneback Scavenger',
    role: 'common',
    status: 'implemented-full-approved',
  },
  variantBriefs: [
    { role: 'common', brief: 'Tawny spotted scavenger with a steep shoulder-to-rump slope, compact dark muzzle, connected bristle ridge, and direct body-owned bite.' },
    { role: 'specialist', brief: 'Deferred lean dusk hunter with a longer ruff, sharper face markings, and a body-owned feint or pounce; no sound glyphs, dust, or saliva.' },
    { role: 'elite', brief: 'Deferred broad matriarch with a scarred muzzle, heavy neck, raised crest, and crushing connected jaw attack; no detached trophies or effects.' },
  ],
  deferredRoles: ['specialist', 'elite'],
  actorTopology: EN_E10_HYENA_TOPOLOGY_DECISION.selected,
  styleContract: 'Use chunky one-to-three-pixel hard-alpha forms and an independently authored Hyena silhouette. Keep the shoulders visibly higher than the rump, the body compact and deep-chested, the muzzle short and wedge-shaped, both ears rounded, the mane and tail connected, and all four dark paws readable. It must not collapse into the public Dire Wolf, approved Kelpie, Crocodile, feline, upright Werewolf, or Furious Depraved Rhino Boss silhouettes.',
  effectBoundary: 'external-dust-saliva-bite-arcs-impacts-particles-laughter-marks-projectiles-glow-illumination-and-runtime-attachments',
});

export const EN_E10_DUNEBACK_SCAVENGER_CONTRACT = deepFreeze({
  sliceId: 'EN-E10',
  family: 'hyena',
  variant: 'duneback-scavenger',
  role: 'common',
  state: 'implemented-complete-motion-approved',
  topology: EN_E10_HYENA_TOPOLOGY_DECISION.selected,
  chassis: 'baked-single-actor-high-shoulder-low-rump-wedge-muzzle-rounded-ear-bristle-mane-four-paw-hyena-v1',
  silhouette: 'A grounded tawny Hyena with high bristled shoulders, a visibly descending back, low narrow rump, deep chest, tucked belly, compact wedge muzzle, two rounded ears, connected short tail, and four separated dark paws. It must read as a Hyena rather than a level-backed long-snouted Dire Wolf, bowed long-necked Kelpie, low Crocodile, upright Werewolf, feline predator, or reduced Rhino Boss.',
  visualIdentity: 'Warm dun fur, a dark cocoa mane and muzzle, pale throat and belly, irregular dark flank spots, rose-brown ear interiors, amber eyes, and black-brown paws establish the common scavenger. Dust, saliva, bite arcs, impacts, laughter marks, particles, glow, projectiles, and illumination remain external.',
  effectBoundary: EN_E10_HYENA_CONTRACT_CARD.effectBoundary,
});

export const EN_E10_DUNEBACK_SCAVENGER_DATA = deepFreeze({
  actor: {
    species: 'authored-hyena-default',
    bodyBuild: 'high-shouldered-low-rumped-deep-chested-common',
    skin: 'warm-dun-spotted-fur',
    hairStyle: 'connected-dark-bristle-ridge',
    hairColor: 'cocoa-black',
    expression: 'amber-scavenger-stare',
    faceDetail: 'compact-dark-wedge-muzzle-rounded-ears-and-amber-eyes',
    headgear: 'none',
    outfit: 'pale-throat-belly-and-irregular-flank-spots',
    outfitColor: 'dun-cocoa-pale-bone-and-rose-brown',
    outfitTier: 'tier1',
    weapon: 'body-owned-wedge-jaw-lunge',
    weaponTier: 'none',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.fur,
      hair: COLORS.mane,
      outfit: COLORS.belly,
    },
  },
  dunebackScavenger: COLORS,
  actorTopology: EN_E10_HYENA_TOPOLOGY_DECISION.selected,
  childAssets: [],
  alphaPolicy: 'binary-single-component-high-shoulder-low-rump-wedge-muzzle-rounded-ear-connected-bristle-mane-tail-and-four-grounded-paws',
  effectBoundary: EN_E10_HYENA_CONTRACT_CARD.effectBoundary,
  bakedEffects: [],
});

export const EN_E10_DUNEBACK_SCAVENGER_GATE = deepFreeze({
  id: 'en-e10-hyena-duneback-scavenger-full-v1',
  status: 'approved',
  baseCheckpoint: 'ff9f9103e06e9edb7729b5efb61c237cf6d4a625',
  authorizedOn: '2026-08-13',
  authorizationEvidence: 'The designer redirected the next lane to EN-E10. Codex bounded EN-E10 to its first family, Hyena, while retaining the roadmap rule that Rhino stays deferred until its ordinary-versus-Boss distinction is approved. Codex then recommended one connected grounded 24x24 baked Hyena actor with zero child assets and external effects. The designer replied: approved. This selects that topology and authorizes only one private common Hyena Duneback Scavenger 80-frame candidate. Runic Idol remains deferred; registration, fixtures, effects, later Hyena roles, Ram, Stag, Mammoth, Rhino, Boss work, release, accepted drift, and a pull request remain closed.',
  architectureDecision: EN_E10_HYENA_TOPOLOGY_DECISION.id,
  approvedOn: '2026-08-13',
  approvalEvidence: 'The exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards and the approved Miremane Courser plus public Dire Wolf and Marsh Crocodile comparison were frozen with both synchronized GIF hashes. The four-lane Aseprite MCP review window reported the exact three PNG paths open together as raw sprite 7, Complete B + Form sprite 11, and active comparison sprite 15; the final approval prompt also posted the exact raw and comparison PNGs and identified candidate digest 353bd2ee9818a9eac8e799a7bc0e041cb6841509d61d3aabd695e86cd146db4d. The designer replied: approved but for nex to ne please also post image of it outlined. In context this approves only that exact Duneback Scavenger digest and its five frozen review hashes. The second clause adds one presentation requirement for the next separately authorized sprite: post a distinct outlined image in addition to the existing packet. It does not retroactively change Duneback, authorize outline registration, fixtures, effects, child assets, another Hyena role or family, or any new art gate.',
  approvedImplementation: 'e0e5e36bd6769a334f06e72db3de67c836021c46',
  publicationAuthorizedOn: '2026-08-13',
  publicationAuthorizationEvidence: 'The designer previously said: you have my pertmission to commit and push everything i approve. This standing permission applies only after explicit approval of the exact frozen artifact or digest and does not authorize this awaiting-review candidate, registration, fixtures, effects, later roles or families, release, accepted drift, or a pull request.',
  publishedImplementation: 'e0e5e36bd6769a334f06e72db3de67c836021c46',
  publishedApprovalRecord: 'eab51c5045a2f8c3f211476e1de640d64940dbc5',
  initialPublishedHandoff: '',
  publicationState: 'published-awaiting-handoff-reconciliation',
  precedingApproval: {
    gateId: EN_E09_CROWNSEAL_GRIMOIRE_GATE.id,
    artifactSha256: EN_E09_CROWNSEAL_GRIMOIRE_GATE.artifactSha256,
    assembledArtifactSha256: EN_E09_CROWNSEAL_GRIMOIRE_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E09_CROWNSEAL_GRIMOIRE_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E09_CROWNSEAL_GRIMOIRE_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E09_CROWNSEAL_GRIMOIRE_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E09_CROWNSEAL_GRIMOIRE_GATE.candidateFrameDigest,
    publishedImplementation: EN_E09_CROWNSEAL_GRIMOIRE_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E09_CROWNSEAL_GRIMOIRE_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E09_CROWNSEAL_GRIMOIRE_GATE.initialPublishedHandoff,
    currentReconciliation: 'ff9f9103e06e9edb7729b5efb61c237cf6d4a625',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e10-hyena-duneback-scavenger/en-e10-hyena-duneback-scavenger-full-suite-raw.png',
  artifactSha256: '053fbc337412dff68a66b991ce2d1e876ba6c7c8255a666039db48aa00db2abc',
  assembledArtifact: 'enemy-expansion-review/en-e10-hyena-duneback-scavenger/en-e10-hyena-duneback-scavenger-full-suite-complete-b-form.png',
  assembledArtifactSha256: '766089b27e18eb15525c1b1a664ff877b400bf624b06ed1ea8f380e45b8c25fe',
  comparisonArtifact: 'enemy-expansion-review/en-e10-hyena-duneback-scavenger/en-e10-hyena-duneback-scavenger-family-comparison.png',
  comparisonArtifactSha256: '30b32107b63343f3aceed123c34e801f3d421b8f62eed35b84a61260ea387587',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e10-hyena-duneback-scavenger/en-e10-hyena-duneback-scavenger-full-suite-four-directions-labeled.gif',
      sha256: 'eea7b08355c03478ac2dc1c4b440e426cebce0cca3a12d5a09fddf28916fb6e8', width: 640, height: 672, frames: 4, durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e10-hyena-duneback-scavenger/en-e10-hyena-duneback-scavenger-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '16c622b006b99f0b1135468048c3478c6907bdd1e40f91e468720bebdeb6f370', width: 640, height: 672, frames: 4, durationMs: 180,
    },
  },
  candidateFrameDigest: '353bd2ee9818a9eac8e799a7bc0e041cb6841509d61d3aabd695e86cd146db4d',
  miremaneComparisonDigest: '6efd596731a468be7647ee37f048046072bad289f209926e4db862cb63b01f32',
  direWolfComparisonDigest: 'a94a66ee380cfcb91db3907a3a049dae4b59357870857c3ed31be259bb1f1579',
  marshCrocodileComparisonDigest: 'aaabe38311ec314f97b902e92ee6f426199f33c2f5051e8a7ffc7a58c737a19a',
  scope: 'One complete 80-frame Duneback Scavenger common Hyena across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle shifts the connected bristle ridge while the high shoulders settle above the low rump. Walk uses four alternating paw phases with the sloped back, tucked belly, and all four dark ground contacts readable. Attack braces, lowers the compact wedge muzzle, drives one connected jaw-and-shoulder lunge, and recovers without detached jaw, saliva, dust, arc, or impact pixels. Hurt uses a complete white recoil and colored four-paw brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and approved Miremane Courser plus public Dire Wolf and Marsh Crocodile silhouette comparisons together.',
  exclusions: [
    'changes to approved Crownseal Grimoire or earlier rendered pixels',
    'changes to approved Miremane Courser or public Dire Wolf and Marsh Crocodile pixels',
    'public Hyena registration',
    'public catalog or facade exposure',
    'asset-pack fixture or manifest changes',
    'schema changes',
    'shared renderer changes',
    'exporter changes',
    'validator changes',
    'frame-contract changes',
    'deterministic child or state exports',
    'runtime attachment offsets',
    'detached jaw or tail',
    'new Cast pixels',
    'new Death pixels',
    'dust',
    'saliva',
    'bite arcs',
    'impacts',
    'particles',
    'laughter marks',
    'projectiles',
    'glow or illumination',
    'effects',
    'Hyena specialist or elite',
    'Ram, Stag, Mammoth, or Rhino',
    'Furious Depraved Rhino Boss changes',
    'Runic Idol or other EN-E09 work',
    'release',
    'accepted drift',
    'pull request',
  ],
  nextGate: 'The exact Duneback Scavenger implementation e0e5e36bd6769a334f06e72db3de67c836021c46 and approval record eab51c5045a2f8c3f211476e1de640d64940dbc5 are remote verified. Only the initial published handoff and final reconciliation remain open. No next sprite is authorized. If a later sprite is separately authorized, its review presentation must also post a distinct outlined image; this is a review-surface requirement, not permission for outline registration. Registration, fixtures, effects, child assets, specialist or elite Hyena, Ram, Stag, Mammoth, Rhino, Rhino Boss work, the deferred Runic Idol decision, release, accepted drift, and a pull request remain closed.',
});

export const EN_E10_DUNEBACK_SCAVENGER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'bristle-ridge-lift', pose: 'idle', bob: 0, head: 0, mane: -1, reach: 0, jaw: 0, stride: [0, 0, 0, 0] },
  { name: 'low-rump-settle', pose: 'idle', bob: 1, head: 1, mane: 0, reach: 0, jaw: 0, stride: [0, 0, 0, 0] },
]);

const WALK_PHASES = deepFreeze([
  { name: 'near-fore-far-hind-step', pose: 'walk', bob: 0, head: 0, mane: -1, reach: 0, jaw: 0, stride: [-1, 1, 0, -1] },
  { name: 'high-shoulder-pass', pose: 'walk', bob: -1, head: 0, mane: 0, reach: 0, jaw: 0, stride: [0, 1, -1, 0] },
  { name: 'far-fore-near-hind-step', pose: 'walk', bob: 0, head: 1, mane: 0, reach: 0, jaw: 0, stride: [1, -1, 0, 1] },
  { name: 'low-rump-paw-settle', pose: 'walk', bob: 1, head: 1, mane: -1, reach: 0, jaw: 0, stride: [0, -1, 1, 0] },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'duneback-brace', pose: 'brace', bob: 1, head: 1, mane: 0, reach: 1, jaw: 0, stride: [-1, 0, 1, 0] },
  { name: 'wedge-muzzle-lower', pose: 'lower', bob: 1, head: 2, mane: -1, reach: 1, jaw: 1, stride: [-1, 0, 1, 0] },
  { name: 'connected-jaw-shoulder-lunge', pose: 'lunge', bob: 0, head: 1, mane: 0, reach: -1, jaw: 2, stride: [-1, 1, 1, -1] },
  { name: 'scavenger-recover', pose: 'recover', bob: 1, head: 1, mane: -1, reach: 0, jaw: 0, stride: [0, 0, 0, 0] },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-hyena-recoil', pose: 'hurt', bob: -1, head: 0, mane: 0, reach: 1, jaw: 0, stride: [0, 0, 0, 0], flash: true },
  { name: 'colored-four-paw-brace', pose: 'hurt-brace', bob: 1, head: 2, mane: -1, reach: 0, jaw: 0, stride: [-1, 1, 1, -1], flash: false },
]);

function createPixels() {
  return new Array(SIZE * SIZE).fill(null);
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert([x, y, width, height].every(Number.isInteger) && width > 0 && height > 0, 'Duneback Scavenger geometry must use positive integers.');
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Duneback Scavenger pixels must remain inside 24x24.');
      pixels[(py * SIZE) + px] = fill;
    }
  };
  return { rect, dot(x, y, fill) { rect(x, y, 1, 1, fill); } };
}

function drawSideLegs(paint, bodyY, positions, stride) {
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
  const positions = [7, 10, 13, 16];
  for (let index = 0; index < positions.length; index++) {
    const footX = positions[index];
    const lean = stride[index] > 0 ? 1 : 0;
    const upperX = footX + lean;
    const rearLeg = index === 0 || index === 3;
    const legY = 15 + bodyY + (rearLeg ? 1 : 0);
    paint.rect(upperX, legY, 2, 2, rearLeg ? COLORS.fur[0] : COLORS.fur[1]);
    paint.rect(Math.min(footX, upperX), legY + 1, Math.abs(footX - upperX) + 2, 1, COLORS.fur[1]);
    paint.rect(footX, legY + 2, 1, 20 - legY, COLORS.belly[1]);
    paint.rect(footX, 21, 2, 2, COLORS.paw);
  }
}

function drawSide(paint, phase) {
  const y = phase.bob;
  const headY = phase.head;
  const lunging = phase.pose === 'lunge';
  const lowered = phase.pose === 'lower' || phase.pose === 'hurt-brace';

  paint.rect(6, 7 + y, 8, 5, COLORS.fur[0]);
  paint.rect(7, 6 + y, 7, 3, COLORS.fur[2]);
  paint.rect(8, 9 + y, 11, 6, COLORS.fur[0]);
  paint.rect(11, 10 + y, 8, 5, COLORS.fur[2]);
  paint.rect(10, 13 + y, 8, 3, COLORS.belly[0]);
  paint.rect(17, 11 + y, 3, 4, COLORS.fur[1]);

  const neckX = lunging ? 5 : 6;
  paint.rect(neckX, 7 + y, 5, 7, COLORS.fur[0]);
  paint.rect(neckX + 1, 8 + y, 3, 6, COLORS.belly[1]);

  const headX = Math.max(1, (lunging ? 2 : 2) + phase.reach);
  const faceY = 5 + headY;
  paint.rect(headX + 3, faceY, 5, 5, COLORS.fur[0]);
  paint.rect(headX + 4, faceY - 1, 4, 2, COLORS.fur[2]);
  paint.rect(headX + 1, faceY + 3, 6, 3 + (phase.jaw > 0 ? 1 : 0), COLORS.mane[0]);
  paint.rect(headX, faceY + 4, 4 + phase.jaw, 2, COLORS.mane[1]);
  if (phase.jaw === 2) paint.rect(headX + 2, faceY + 6, 5, 1, COLORS.belly[2]);
  paint.rect(headX + 4, faceY - 2, 2, 2, COLORS.fur[1]);
  paint.rect(headX + 7, faceY - 1, 2, 2, COLORS.fur[1]);
  paint.dot(headX + 5, faceY - 1, COLORS.ear[0]);
  paint.dot(headX + 7, faceY, COLORS.ear[1]);
  paint.dot(headX + 6, faceY + 1, COLORS.eye);
  paint.dot(headX, faceY + 4, COLORS.feature);
  paint.rect(headX + 2, faceY + 5, 3 + Math.min(phase.jaw, 1), 1, COLORS.feature);

  const maneY = 4 + y + phase.mane;
  paint.rect(6, maneY + 1, 3, 5, COLORS.mane[0]);
  paint.rect(8, maneY, 3, 5, COLORS.mane[1]);
  paint.rect(10, maneY + 1, 3, 5, COLORS.mane[0]);
  paint.rect(12, maneY + 2, 3, 4, COLORS.mane[2]);

  paint.rect(18, 10 + y, 3, 3, COLORS.fur[1]);
  paint.rect(20, 11 + y, 3, 3, COLORS.mane[0]);
  paint.rect(21, 13 + y, 2, 2, COLORS.mane[1]);

  paint.rect(11, 9 + y, 2, 1, COLORS.spot[0]);
  paint.dot(14, 10 + y, COLORS.spot[1]);
  paint.rect(16, 12 + y, 2, 1, COLORS.spot[0]);
  paint.dot(12, 13 + y, COLORS.spot[1]);

  drawSideLegs(paint, y, [5, 9, 14, 18], phase.stride);
  if (lowered) paint.rect(5, 12 + y, 4, 3, COLORS.fur[1]);
  paint.dot(headX + 5, faceY - 1, COLORS.ear[0]);
  paint.dot(headX + 7, faceY, COLORS.ear[1]);
  paint.dot(headX + 6, faceY + 1, COLORS.eye);
  paint.dot(headX, faceY + 4, COLORS.feature);
  paint.rect(headX + 2, faceY + 5, 3 + Math.min(phase.jaw, 1), 1, COLORS.feature);
}

function drawDown(paint, phase) {
  const y = phase.bob;
  const faceY = 3 + phase.head;
  const spread = phase.pose === 'lunge' ? 1 : 0;

  paint.rect(7 - spread, 8 + y, 10 + (spread * 2), 5, COLORS.fur[0]);
  paint.rect(6 - spread, 10 + y, 12 + (spread * 2), 5, COLORS.fur[2]);
  paint.rect(7, 13 + y, 10, 3, COLORS.belly[0]);
  paint.rect(9, 14 + y, 6, 2, COLORS.belly[2]);
  paint.rect(8, 6 + y, 8, 7, COLORS.fur[0]);

  paint.rect(9, faceY, 6, 6, COLORS.fur[0]);
  paint.rect(10, faceY - 1, 4, 2, COLORS.fur[2]);
  paint.rect(8, faceY - 1, 3, 2, COLORS.fur[1]);
  paint.rect(13, faceY - 1, 3, 2, COLORS.fur[1]);
  paint.dot(9, faceY, COLORS.ear[0]);
  paint.dot(14, faceY, COLORS.ear[0]);
  paint.rect(9, faceY + 4, 6, 3 + (phase.jaw > 0 ? 1 : 0), COLORS.mane[0]);
  paint.rect(10, faceY + 5, 4, 2, COLORS.mane[1]);
  paint.dot(10, faceY + 2, COLORS.eye);
  paint.dot(13, faceY + 2, COLORS.eye);
  paint.dot(10, faceY + 5, COLORS.feature);
  paint.dot(13, faceY + 5, COLORS.feature);
  paint.rect(11, faceY + 6 + Math.min(phase.jaw, 1), 2, 1, COLORS.feature);

  const maneY = 4 + y + phase.mane;
  paint.rect(6, maneY + 2, 3, 7, COLORS.mane[0]);
  paint.rect(15, maneY + 2, 3, 7, COLORS.mane[0]);
  paint.rect(7, maneY, 3, 4, COLORS.mane[1]);
  paint.rect(14, maneY, 3, 4, COLORS.mane[1]);

  paint.rect(17, 12 + y, 3, 3, COLORS.fur[1]);
  paint.rect(19, 13 + y, 2, 4, COLORS.mane[0]);
  paint.dot(20, 16 + y, COLORS.mane[1]);

  paint.rect(8, 11 + y, 2, 1, COLORS.spot[0]);
  paint.rect(14, 12 + y, 2, 1, COLORS.spot[1]);
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
  paint.rect(7, 13 + y, 10, 4, COLORS.belly[1]);
  paint.rect(9, 5 + y, 6, 7, COLORS.fur[0]);
  paint.rect(9, 3 + headY, 6, 4, COLORS.fur[1]);
  paint.rect(8, 3 + headY, 3, 2, COLORS.fur[1]);
  paint.rect(13, 3 + headY, 3, 2, COLORS.fur[1]);
  paint.dot(9, 4 + headY, COLORS.ear[1]);
  paint.dot(14, 4 + headY, COLORS.ear[1]);

  const maneY = 3 + y + phase.mane;
  paint.rect(7, maneY + 2, 3, 8, COLORS.mane[0]);
  paint.rect(9, maneY, 3, 8, COLORS.mane[1]);
  paint.rect(12, maneY + 1, 3, 7, COLORS.mane[0]);
  paint.rect(14, maneY + 3, 3, 6, COLORS.mane[2]);
  paint.rect(9, 7 + y, 6, 5, COLORS.fur[0]);
  paint.rect(10, 8 + y, 4, 4, COLORS.mane[0]);

  paint.rect(15, 12 + y, 4, 3, COLORS.fur[1]);
  paint.rect(18, 13 + y, 3, 3, COLORS.mane[0]);
  paint.rect(19, 15 + y, 2, 2, COLORS.mane[1]);

  paint.rect(8, 11 + y, 2, 1, COLORS.spot[0]);
  paint.rect(14, 12 + y, 2, 1, COLORS.spot[1]);
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
    return HURT_PHASES[EN_E10_DUNEBACK_SCAVENGER_DEATH_SOURCE_FRAMES[frame]];
  }
  throw new TypeError('Animation ' + animation + ' is not implemented for Duneback Scavenger.');
}

function buildPixels(direction, animation, frame) {
  const phase = phaseFor(animation, frame);
  const canonical = direction === 'right' ? 'left' : direction;
  const pixels = createPixels();
  const paint = painter(pixels);
  if (canonical === 'down') drawDown(paint, phase);
  else if (canonical === 'up') drawUp(paint, phase);
  else if (canonical === 'left') drawSide(paint, phase);
  else throw new TypeError('Unsupported Duneback Scavenger direction ' + direction + '.');
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

export function renderEnE10DunebackScavengerFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Duneback Scavenger rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Duneback Scavenger direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'hyena',
    variant: 'duneback-scavenger',
    direction,
    animation,
    frame,
    phase: phase.name,
    dunebackScavengerGate: EN_E10_DUNEBACK_SCAVENGER_GATE.id,
    architectureDecision: EN_E10_HYENA_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E09_CROWNSEAL_GRIMOIRE_GATE.id,
    actorTopology: EN_E10_DUNEBACK_SCAVENGER_DATA.actorTopology,
    childAssetCount: EN_E10_DUNEBACK_SCAVENGER_DATA.childAssets.length,
    alphaPolicy: EN_E10_DUNEBACK_SCAVENGER_DATA.alphaPolicy,
    effectBoundary: EN_E10_DUNEBACK_SCAVENGER_DATA.effectBoundary,
  });
}

export const EN_E10_DUNEBACK_SCAVENGER_RENDERER = deepFreeze({
  key: 'en-e10-hyena-duneback-scavenger-v1',
  chassis: EN_E10_DUNEBACK_SCAVENGER_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'hyena', 'The EN-E10 Duneback Scavenger renderer is restricted to Hyena.');
    assert(variant.id === 'duneback-scavenger', 'The EN-E10 Duneback Scavenger renderer is restricted to Duneback Scavenger.');
    return renderEnE10DunebackScavengerFrame(context, direction, animation.id, frame);
  },
});

const DUNEBACK_SCAVENGER_VARIANT = deepFreeze({
  id: 'duneback-scavenger',
  name: 'Duneback Scavenger',
  role: EN_E10_DUNEBACK_SCAVENGER_CONTRACT.role,
  status: EN_E10_DUNEBACK_SCAVENGER_CONTRACT.state,
  brief: 'A private complete common Hyena with tawny spotted fur, high bristled shoulders, a descending back, low rump, compact dark wedge muzzle, rounded ears, connected short tail, four separated dark paws, and a body-owned jaw lunge; all effects remain external.',
  rendererData: EN_E10_DUNEBACK_SCAVENGER_DATA,
});

export const EN_E10_DUNEBACK_SCAVENGER_FAMILY = deepFreeze({
  id: 'hyena',
  name: 'Hyena Duneback Scavenger Review',
  sliceId: 'EN-E10',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E10_DUNEBACK_SCAVENGER_CONTRACT.chassis,
  rendererKey: EN_E10_DUNEBACK_SCAVENGER_RENDERER.key,
  variants: [DUNEBACK_SCAVENGER_VARIANT],
  rendererData: {
    contractCard: EN_E10_HYENA_CONTRACT_CARD.id,
    architectureDecision: EN_E10_HYENA_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E09_CROWNSEAL_GRIMOIRE_GATE.id,
    activeGate: EN_E10_DUNEBACK_SCAVENGER_GATE.id,
  },
  review: {
    baselineVariant: 'duneback-scavenger',
    scale: 8,
    notes: 'Awaiting explicit visual approval as one independently authored common Hyena against approved Miremane Courser and public Dire Wolf and Marsh Crocodile. Keep registration, fixtures, effects, child assets, later Hyena roles, later EN-E10 families, Rhino Boss work, and deferred Runic Idol separate.',
  },
});

export const EN_E10_DUNEBACK_SCAVENGER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E10_DUNEBACK_SCAVENGER_RENDERER],
  families: [EN_E10_DUNEBACK_SCAVENGER_FAMILY],
});
