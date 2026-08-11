import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E07_MANYFOLD_USURPER_GATE,
} from './enemy-expansion-en-e07-changeling-manyfold-usurper.js';

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
  body: ['#315a58', '#1e3b3e', '#4f7d72'],
  mane: ['#668f72', '#3d6559', '#95b394'],
  belly: ['#78988a', '#4d6d65', '#aac3ae'],
  reed: ['#b2a35f', '#766a3f', '#d2c07a'],
  hoof: '#17272b',
  feature: '#14262a',
  eye: '#c6efb7',
  flash: '#f4f4f4',
});

export const EN_E07_KELPIE_CONTRACT_CARD = deepFreeze({
  id: 'en-e07-kelpie-miremane-courser-v1',
  sliceId: 'EN-E07',
  family: 'kelpie',
  familyName: 'Kelpie',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingFamily: {
    id: 'changeling',
    variant: 'manyfold-usurper',
    name: 'Manyfold Usurper',
    role: 'elite',
    status: 'approved-published',
  },
  activeVariant: {
    id: 'miremane-courser',
    name: 'Miremane Courser',
    role: 'common',
    status: 'implemented-full-approved',
  },
  deferredRoles: ['specialist', 'elite'],
  styleContract: 'Use chunky one-to-three-pixel hard-alpha forms and an independently authored low lean waterlogged equine body. Keep a bowed wet neck, readable long muzzle, one connected dripping mane, a connected weed-like tail, a long barrel, four separated legs, and four grounded dark hooves. The common must read as a self-contained Kelpie rather than a Centaur horse body, horned Unicorn, Wolf, Crocodile, skeletal mount, or detached water effect.',
  effectBoundary: 'external-water-sheets-splashes-foam-ripples-droplets-mist-glow-particles-projectiles-impacts-and-illumination',
});

export const EN_E07_MIREMANE_COURSER_CONTRACT = deepFreeze({
  sliceId: 'EN-E07',
  family: 'kelpie',
  variant: 'miremane-courser',
  role: 'common',
  state: 'implemented-complete-motion-approved',
  chassis: 'low-lean-bowed-neck-long-muzzle-connected-wet-mane-long-barrel-four-separated-legs-grounded-dark-hooves-weed-tail-equine-v1',
  silhouette: 'A low lean grounded waterlogged horse with a bowed neck, long readable muzzle, connected wet mane, long ribbed barrel, four separated legs, four small dark hooves, and a connected weed-like tail. It must not grow a humanoid rider or torso, horn, crown, canine wedge head, crocodilian belly, skeletal gaps, detached water shapes, or copied mount body.',
  identity: 'Peat-black teal hide, pale brackish belly planes, drowned-green mane clumps, old-reed tail accents, one pale marsh-light profile eye, paired front-view eyes, dark nostrils, and a connected head-low charge establish a self-contained common Kelpie while all water effects remain external.',
  effectBoundary: EN_E07_KELPIE_CONTRACT_CARD.effectBoundary,
});

export const EN_E07_MIREMANE_COURSER_DATA = deepFreeze({
  actor: {
    species: 'authored-kelpie-default',
    bodyBuild: 'low-lean-waterlogged-equine-common',
    skin: 'peat-black-teal-hide',
    hairStyle: 'connected-dripping-mane',
    hairColor: 'drowned-green',
    expression: 'bowed-neck-marsh-light-gaze',
    faceDetail: 'long-muzzle-dark-nostrils-and-pale-marsh-light-eyes',
    headgear: 'none',
    outfit: 'brackish-belly-and-reed-seams',
    outfitColor: 'brackish-green-and-old-reed',
    outfitTier: 'tier1',
    weapon: 'connected-neck-and-muzzle-lunge',
    weaponTier: 'none',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.body,
      hair: COLORS.mane,
      outfit: COLORS.belly,
    },
  },
  miremaneCourser: COLORS,
  alphaPolicy: 'binary-single-component-low-lean-bowed-neck-long-muzzle-connected-wet-mane-long-barrel-four-separated-legs-grounded-dark-hooves-and-connected-weed-tail',
  effectBoundary: EN_E07_KELPIE_CONTRACT_CARD.effectBoundary,
  bakedEffects: [],
});

export const EN_E07_MIREMANE_COURSER_GATE = deepFreeze({
  id: 'en-e07-kelpie-miremane-courser-full-v1',
  status: 'approved',
  baseCheckpoint: '6ddef83e03e983672bee39b6b484dd1c1bfcba01',
  authorizedOn: '2026-08-11',
  authorizationEvidence: 'After the exact Manyfold Usurper digest was visually approved, committed, pushed, and reconciled at clean published checkpoint 6ddef83e03e983672bee39b6b484dd1c1bfcba01, the designer replied: approved lets do next. Manyfold Usurper completed the frozen Changeling common-specialist-elite order, so the one-complete-sprite cadence authorizes only one private common Kelpie Miremane Courser 80-frame candidate.',
  approvedOn: '2026-08-11',
  approvalEvidence: 'The exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, the approved Steppe Hunter plus public Dire Wolf and Marsh Crocodile comparison, and synchronized GIF evidence were presented after the front/rear four-pillar read, reed-colored tail tip, touching moving hooves, and two detached walk legs were corrected before freeze. The three exact frozen PNG boards were open together in Aseprite and the live sprite list named all three paths at IDs 7, 11, and 15. The designer replied: approved. Approval applies only to candidate digest 6efd596731a468be7647ee37f048046072bad289f209926e4db862cb63b01f32. Kelpie registration, fixtures, runtime copying, water effects, later Kelpie roles, release, and EN-E08 remain separate gates.',
  approvedImplementation: '74463a2b1944b7d3a6d412923c205a0c9cc648f1',
  publicationAuthorizedOn: '2026-08-11',
  publicationAuthorizationEvidence: 'The designer said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact artifact or digest. It does not authorize registration, fixtures, runtime copying, effects, later roles or families, release, or any other unopened gate.',
  publishedImplementation: '74463a2b1944b7d3a6d412923c205a0c9cc648f1',
  publishedApprovalRecord: '8fb53e961247da875814593feb132182648f9e48',
  initialPublishedHandoff: 'ae532a17e92c3a7b0b99ccd3c938f8174f102dd6',
  publicationState: 'published',
  precedingApproval: {
    gateId: EN_E07_MANYFOLD_USURPER_GATE.id,
    artifactSha256: EN_E07_MANYFOLD_USURPER_GATE.artifactSha256,
    assembledArtifactSha256: EN_E07_MANYFOLD_USURPER_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E07_MANYFOLD_USURPER_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E07_MANYFOLD_USURPER_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E07_MANYFOLD_USURPER_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E07_MANYFOLD_USURPER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E07_MANYFOLD_USURPER_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E07_MANYFOLD_USURPER_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E07_MANYFOLD_USURPER_GATE.initialPublishedHandoff,
    currentReconciliation: '6ddef83e03e983672bee39b6b484dd1c1bfcba01',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e07-kelpie-miremane-courser/en-e07-kelpie-miremane-courser-full-suite-raw.png',
  artifactSha256: 'dd4b7f47344b641c8792dc94f04e23320c91e9bb5ec1223ffc70e2add6991311',
  assembledArtifact: 'enemy-expansion-review/en-e07-kelpie-miremane-courser/en-e07-kelpie-miremane-courser-full-suite-complete-b-form.png',
  assembledArtifactSha256: 'be4747757a7b334dc2a74ea9ab68029ce804838011f9742b83b705411dbe1e91',
  comparisonArtifact: 'enemy-expansion-review/en-e07-kelpie-miremane-courser/en-e07-kelpie-miremane-courser-family-comparison.png',
  comparisonArtifactSha256: 'aa83bce8c88338667c01602133e3780b5e4dd92e2da1eaa4676fc3771d66901e',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e07-kelpie-miremane-courser/en-e07-kelpie-miremane-courser-full-suite-four-directions-labeled.gif',
      sha256: 'd056dfd9bf0855650bc02a07ff888f1f363e22f74ae726b8afa1b8bdf00df607',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e07-kelpie-miremane-courser/en-e07-kelpie-miremane-courser-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '38e8dc8a182829ec2b1f9003fa3272e011d58838992c46dc575c77dc0c044992',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
  },
  candidateFrameDigest: '6efd596731a468be7647ee37f048046072bad289f209926e4db862cb63b01f32',
  steppeHunterComparisonDigest: '13c0273ffad557976ced07708a63e6b01df59e0edd5b5c4c79cc0e341a08f272',
  direWolfComparisonDigest: 'a94a66ee380cfcb91db3907a3a049dae4b59357870857c3ed31be259bb1f1579',
  marshCrocodileComparisonDigest: 'aaabe38311ec314f97b902e92ee6f426199f33c2f5051e8a7ffc7a58c737a19a',
  scope: 'One complete 80-frame Miremane Courser common Kelpie across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle lets the connected drowned mane lift and settle while the bowed head dips. Walk uses four true alternating hoof phases with a low barrel response and all four dark hooves readable. Attack draws back the connected bowed neck, lowers the long muzzle, drives one connected head-and-shoulder lunge, and recovers the authored equine form. Hurt uses a complete white recoil and colored head-low four-hoof brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and approved Steppe Hunter plus public Dire Wolf and Marsh Crocodile silhouette comparisons together.',
  exclusions: [
    'changes to approved Manyfold Usurper or other Changeling rendered pixels',
    'changes to approved Living Shadow, Doppelganger, or Will-o-Wisp rendered pixels',
    'public Kelpie registration',
    'public catalog exposure',
    'asset-pack fixture generation or regeneration',
    'new Cast pixels',
    'new Death pixels',
    'Centaur humanoid torso or rider',
    'spear or saddle',
    'Unicorn horn or crown',
    'canine Wolf head or raised tail',
    'Crocodile belly or jaw',
    'skeletal horse gaps',
    'copied mount body',
    'detached water sheets',
    'splashes',
    'foam',
    'ripples',
    'droplets',
    'mist',
    'glow',
    'particles',
    'projectiles',
    'impacts',
    'illumination',
    'effects',
    'release',
    'Kelpie specialist or elite',
    'EN-E08 and later work',
  ],
  nextGate: 'The exact Miremane Courser digest is visually approved and published: implementation 74463a2b1944b7d3a6d412923c205a0c9cc648f1, approval record 8fb53e961247da875814593feb132182648f9e48, and initial handoff ae532a17e92c3a7b0b99ccd3c938f8174f102dd6 are remote verified. No next Kelpie role is authorized. Kelpie registration, fixtures, runtime copying, water effects, later Kelpie roles, release, and EN-E08 remain closed until a separate lets do next.',
});

export const EN_E07_MIREMANE_COURSER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'drowned-mane-lift', pose: 'idle', bob: 0, head: 0, mane: -1, stride: [0, 0, 0, 0] },
  { name: 'waterlogged-head-dip', pose: 'idle', bob: 1, head: 1, mane: 1, stride: [0, 0, 0, 0] },
]);

const WALK_PHASES = deepFreeze([
  { name: 'near-fore-far-hind-step', pose: 'walk', bob: 0, head: 0, mane: -1, stride: [-1, 1, 0, -1] },
  { name: 'high-four-hoof-pass', pose: 'walk', bob: -1, head: 0, mane: 1, stride: [0, 1, -1, 0] },
  { name: 'far-fore-near-hind-step', pose: 'walk', bob: 0, head: 1, mane: 1, stride: [1, -1, 0, 1] },
  { name: 'low-barrel-settle', pose: 'walk', bob: 1, head: 1, mane: -1, stride: [0, -1, 1, 0] },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'bowed-neck-draw', pose: 'draw', bob: 0, head: 0, mane: 1, stride: [0, 0, 0, 0] },
  { name: 'long-muzzle-lower', pose: 'lower', bob: 1, head: 2, mane: -1, stride: [-1, 0, 1, 0] },
  { name: 'connected-shoulder-lunge', pose: 'lunge', bob: 0, head: 1, mane: 1, stride: [-1, 1, 1, -1] },
  { name: 'miremane-recover', pose: 'recover', bob: 1, head: 1, mane: -1, stride: [0, 0, 0, 0] },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-equine-recoil', pose: 'hurt', bob: -1, head: 0, mane: 1, stride: [0, 0, 0, 0], flash: true },
  { name: 'colored-head-low-four-hoof-brace', pose: 'brace', bob: 1, head: 2, mane: -1, stride: [-1, 1, 1, -1], flash: false },
]);

function createPixels() {
  return new Array(SIZE * SIZE).fill(null);
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Miremane Courser rectangles must use positive integer geometry.',
    );
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Miremane Courser authored pixels must remain inside the 24x24 cell.');
      pixels[(py * SIZE) + px] = fill;
    }
  };
  return {
    rect,
    dot(x, y, fill) { rect(x, y, 1, 1, fill); },
  };
}

function drawLegs(paint, bodyY, positions, stride) {
  for (let index = 0; index < positions.length; index++) {
    const x = positions[index];
    const upperX = x + stride[index];
    const legY = 14 + bodyY;
    paint.rect(upperX, legY, 2, 3, COLORS.body[1]);
    paint.rect(Math.min(x, upperX), legY, Math.abs(x - upperX) + 2, 1, COLORS.body[1]);
    paint.rect(Math.min(x, upperX), legY + 2, Math.abs(x - upperX) + 2, 1, COLORS.body[1]);
    paint.rect(x, legY + 3, 1, 19 - legY, COLORS.body[1]);
    paint.rect(x, 20, 1, 2, COLORS.belly[1]);
    paint.rect(x, 21, 2, 2, COLORS.hoof);
  }
}

function drawSide(paint, phase) {
  const y = phase.bob;
  const headY = phase.head;
  const lunge = phase.pose === 'lunge';
  const drawn = phase.pose === 'draw';
  const lowered = phase.pose === 'lower' || phase.pose === 'brace';

  paint.rect(8, 8 + y, 10, 3, COLORS.body[2]);
  paint.rect(7, 10 + y, 12, 5, COLORS.body[0]);
  paint.rect(9, 14 + y, 9, 2, COLORS.body[1]);
  paint.rect(10, 13 + y, 7, 2, COLORS.belly[0]);
  paint.dot(17, 9 + y, COLORS.reed[0]);
  paint.dot(8, 14 + y, COLORS.reed[1]);

  const neckX = lunge ? 5 : (drawn ? 7 : 6);
  paint.rect(neckX, 6 + y, 5, 7, COLORS.body[0]);
  paint.rect(neckX + 2, 5 + y, 3, 7, COLORS.body[2]);
  paint.rect(neckX + 3, 7 + y, 2, 6, COLORS.body[1]);

  const headX = lunge ? 2 : (drawn ? 4 : 3);
  const faceY = 5 + headY;
  paint.rect(headX, faceY, 6, 4, COLORS.body[0]);
  paint.rect(headX + 1, faceY - 1, 4, 2, COLORS.body[2]);
  paint.rect(lunge ? 1 : (drawn ? 2 : 1), faceY + 3, lunge ? 6 : 5, 3, COLORS.belly[0]);
  paint.rect(headX + 2, faceY - 3, 2, 3, COLORS.body[1]);
  paint.dot(headX + 4, faceY + 1, COLORS.feature);
  paint.dot(headX + 4, faceY + 1, COLORS.eye);
  paint.dot(lunge ? 1 : (drawn ? 2 : 1), faceY + 4, COLORS.feature);

  const maneY = 5 + y + phase.mane;
  paint.rect(neckX + 3, maneY, 3, 3, COLORS.mane[2]);
  paint.rect(neckX + 4, maneY + 2, 3, 5, COLORS.mane[0]);
  paint.rect(neckX + 4, maneY + 6, 2, 4, COLORS.mane[1]);
  paint.dot(neckX + 3, maneY + 5, COLORS.reed[2]);

  paint.rect(18, 10 + y, 3, 3, COLORS.mane[0]);
  paint.rect(20, 11 + y, 3, 4, COLORS.mane[1]);
  paint.rect(21, 14 + y, 2, 3, COLORS.mane[1]);
  paint.dot(22, 17 + y, COLORS.reed[2]);

  drawLegs(paint, y, [6, 10, 14, 18], phase.stride);
  if (lowered) paint.rect(5, 12 + y, 4, 3, COLORS.body[1]);
}

function drawDown(paint, phase) {
  const y = phase.bob;
  const faceY = 3 + phase.head;
  const spread = phase.pose === 'lunge' ? 1 : 0;

  paint.rect(8 - spread, 9 + y, 8 + (spread * 2), 4, COLORS.body[0]);
  paint.rect(7 - spread, 12 + y, 10 + (spread * 2), 4, COLORS.body[0]);
  paint.rect(6 - spread, 13 + y, 12 + (spread * 2), 2, COLORS.body[2]);
  paint.rect(8, 14 + y, 8, 2, COLORS.belly[0]);
  paint.rect(9, 6 + y, 6, 7, COLORS.body[0]);
  paint.rect(8, 9 + y, 8, 4, COLORS.body[2]);

  paint.rect(10, faceY, 4, 6, COLORS.body[0]);
  paint.rect(10, faceY - 1, 4, 2, COLORS.body[2]);
  paint.rect(9, faceY + 5, 6, 3, COLORS.belly[0]);
  paint.rect(9, faceY - 2, 2, 2, COLORS.body[1]);
  paint.rect(13, faceY - 2, 2, 2, COLORS.body[1]);
  paint.rect(9, faceY + 2, 2, 1, COLORS.feature);
  paint.rect(13, faceY + 2, 2, 1, COLORS.feature);
  paint.dot(10, faceY + 2, COLORS.eye);
  paint.dot(13, faceY + 2, COLORS.eye);
  paint.dot(9, faceY + 6, COLORS.feature);
  paint.dot(14, faceY + 6, COLORS.feature);
  paint.rect(11, faceY + 7, 2, 1, COLORS.feature);

  const maneY = 5 + y + phase.mane;
  paint.rect(7, maneY, 3, 6, COLORS.mane[0]);
  paint.rect(6, maneY + 4, 3, 6, COLORS.mane[1]);
  paint.rect(7, maneY + 8, 2, 4, COLORS.reed[1]);
  paint.dot(6, maneY + 7, COLORS.mane[2]);

  drawLegs(paint, y, [6, 10, 14, 18], phase.stride);
}

function drawUp(paint, phase) {
  const y = phase.bob;
  paint.rect(8, 8 + y, 8, 4, COLORS.body[1]);
  paint.rect(7, 9 + y, 10, 7, COLORS.body[0]);
  paint.rect(6, 11 + y, 12, 4, COLORS.body[2]);
  paint.rect(8, 14 + y, 8, 2, COLORS.belly[1]);
  paint.rect(9, 5 + y, 6, 7, COLORS.body[0]);
  paint.rect(10, 3 + phase.head, 4, 6, COLORS.body[1]);
  paint.rect(9, 2 + phase.head, 2, 3, COLORS.body[1]);
  paint.rect(13, 2 + phase.head, 2, 3, COLORS.body[1]);

  const maneY = 4 + y + phase.mane;
  paint.rect(8, maneY, 3, 6, COLORS.mane[0]);
  paint.rect(7, maneY + 4, 3, 7, COLORS.mane[1]);
  paint.rect(8, maneY + 9, 2, 4, COLORS.reed[1]);
  paint.dot(7, maneY + 7, COLORS.mane[2]);

  paint.rect(10, 14 + y, 4, 4, COLORS.mane[0]);
  paint.rect(11, 17 + y, 3, 3, COLORS.mane[1]);
  paint.dot(13, 19 + y, COLORS.reed[2]);

  drawLegs(paint, y, [6, 10, 14, 18], phase.stride);
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
    return HURT_PHASES[EN_E07_MIREMANE_COURSER_DEATH_SOURCE_FRAMES[frame]];
  }
  throw new TypeError('Animation ' + animation + ' is not implemented for Miremane Courser.');
}

function buildPixels(direction, animation, frame) {
  const phase = phaseFor(animation, frame);
  const canonical = direction === 'right' ? 'left' : direction;
  const pixels = createPixels();
  const paint = painter(pixels);
  if (canonical === 'down') drawDown(paint, phase);
  else if (canonical === 'up') drawUp(paint, phase);
  else if (canonical === 'left') drawSide(paint, phase);
  else throw new TypeError('Unsupported Miremane Courser direction ' + direction + '.');
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

export function renderEnE07MiremaneCourserFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Miremane Courser rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Miremane Courser direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'kelpie',
    variant: 'miremane-courser',
    direction,
    animation,
    frame,
    phase: phase.name,
    miremaneCourserGate: EN_E07_MIREMANE_COURSER_GATE.id,
    approvedPrecedingGate: EN_E07_MANYFOLD_USURPER_GATE.id,
    alphaPolicy: EN_E07_MIREMANE_COURSER_DATA.alphaPolicy,
    effectBoundary: EN_E07_MIREMANE_COURSER_DATA.effectBoundary,
  });
}

export const EN_E07_MIREMANE_COURSER_RENDERER = deepFreeze({
  key: 'en-e07-kelpie-miremane-courser-v1',
  chassis: EN_E07_MIREMANE_COURSER_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'kelpie', 'The EN-E07 Miremane Courser renderer is restricted to Kelpie.');
    assert(variant.id === 'miremane-courser', 'The EN-E07 Miremane Courser renderer is restricted to Miremane Courser.');
    return renderEnE07MiremaneCourserFrame(context, direction, animation.id, frame);
  },
});

const MIREMANE_COURSER_VARIANT = deepFreeze({
  id: 'miremane-courser',
  name: 'Miremane Courser',
  role: EN_E07_MIREMANE_COURSER_CONTRACT.role,
  status: EN_E07_MIREMANE_COURSER_CONTRACT.state,
  brief: 'A private complete common Kelpie with a low lean waterlogged equine body, bowed wet neck, long readable muzzle, connected dripping mane, long barrel, four separated dark hooves, and connected weed-tail; riders, horns, copied mounts, and water effects remain external.',
  rendererData: EN_E07_MIREMANE_COURSER_DATA,
});

export const EN_E07_MIREMANE_COURSER_FAMILY = deepFreeze({
  id: 'kelpie',
  name: 'Kelpie Miremane Courser Review',
  sliceId: 'EN-E07',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E07_MIREMANE_COURSER_CONTRACT.chassis,
  rendererKey: EN_E07_MIREMANE_COURSER_RENDERER.key,
  variants: [MIREMANE_COURSER_VARIANT],
  rendererData: {
    contractCard: EN_E07_KELPIE_CONTRACT_CARD.id,
    approvedPrecedingGate: EN_E07_MANYFOLD_USURPER_GATE.id,
    activeGate: EN_E07_MIREMANE_COURSER_GATE.id,
  },
  review: {
    baselineVariant: 'miremane-courser',
    scale: 8,
    notes: 'Visually approved as one low lean waterlogged authored Miremane Courser against approved Steppe Hunter and public Dire Wolf and Marsh Crocodile. Publish only the bounded approval and reconciliation tuple. No next Kelpie role is authorized; keep registration, fixtures, runtime copying, water effects, later Kelpie roles, and later Wave 2 work separate.',
  },
});

export const EN_E07_MIREMANE_COURSER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E07_MIREMANE_COURSER_RENDERER],
  families: [EN_E07_MIREMANE_COURSER_FAMILY],
});
