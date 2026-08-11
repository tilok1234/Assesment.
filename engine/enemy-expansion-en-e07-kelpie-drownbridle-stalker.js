import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E07_KELPIE_CONTRACT_CARD,
  EN_E07_MIREMANE_COURSER_GATE,
} from './enemy-expansion-en-e07-kelpie-miremane-courser.js';

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
  body: ['#294a50', '#172d35', '#456b6c'],
  mane: ['#5f806d', '#38564d', '#88a184'],
  belly: ['#647f79', '#405855', '#91a59a'],
  bridle: ['#aa7f4b', '#6f4e32', '#d0aa6b'],
  hoof: '#111d25',
  feature: '#0f1c23',
  eye: '#b9f0cf',
  flash: '#f4f4f4',
});

export const EN_E07_DROWNBRIDLE_STALKER_CONTRACT_CARD = deepFreeze({
  id: 'en-e07-kelpie-drownbridle-stalker-v1',
  sliceId: 'EN-E07',
  family: 'kelpie',
  familyName: 'Kelpie',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingVariant: {
    id: 'miremane-courser',
    name: 'Miremane Courser',
    role: 'common',
    status: 'approved-published',
  },
  activeVariant: {
    id: 'drownbridle-stalker',
    name: 'Drownbridle Stalker',
    role: 'specialist',
    status: 'implemented-full-approved',
  },
  deferredRoles: ['elite'],
  styleContract: 'Use chunky one-to-three-pixel hard-alpha forms and an independently authored forward-heavy specialist equine body. Keep a high arched neck, long readable hooked muzzle, connected blocky crest mane, connected reed bridle, deep wedge chest, shorter barrel, four separated fetlocked legs, four grounded dark hooves, and one thick connected ropeweed tail. The specialist must be taller and more forceful than Miremane Courser without becoming a Centaur horse body, horned Unicorn, Wolf, Crocodile, skeletal mount, armored warhorse, or detached water effect.',
  effectBoundary: EN_E07_KELPIE_CONTRACT_CARD.effectBoundary,
});

export const EN_E07_DROWNBRIDLE_STALKER_CONTRACT = deepFreeze({
  sliceId: 'EN-E07',
  family: 'kelpie',
  variant: 'drownbridle-stalker',
  role: 'specialist',
  state: 'implemented-complete-motion-approved',
  chassis: 'forward-heavy-high-arched-neck-hooked-muzzle-block-crest-connected-reed-bridle-deep-chest-short-barrel-four-fetlocked-legs-grounded-hooves-ropeweed-tail-equine-v1',
  silhouette: "A forward-heavy grounded specialist Kelpie with a high arched neck, long hooked equine muzzle, connected blocky crest mane, connected reed bridle, deep wedge chest, short powerful barrel, four separated fetlocked legs, four dark grounded hooves, and a thick connected ropeweed tail. It must not collapse into Miremane Courser's low lean body or grow a humanoid rider or torso, horn, crown, canine wedge head, crocodilian belly, skeletal gaps, armor plates, detached reins, or copied mount geometry.",
  identity: 'Blue-black drowned hide, cold brackish belly planes, moss-dark crest blocks, ochre reed bridle bands, pale marsh-light eyes, dark nostrils, and a connected coil-to-chest-ram motion establish a self-contained specialist Kelpie while all water and loose-rein effects remain external.',
  effectBoundary: EN_E07_DROWNBRIDLE_STALKER_CONTRACT_CARD.effectBoundary,
});

export const EN_E07_DROWNBRIDLE_STALKER_DATA = deepFreeze({
  actor: {
    species: 'authored-kelpie-default',
    bodyBuild: 'forward-heavy-high-crested-waterlogged-equine-specialist',
    skin: 'blue-black-drowned-hide',
    hairStyle: 'connected-blocky-crest-and-ropeweed-tail',
    hairColor: 'moss-dark-green',
    expression: 'high-neck-marsh-light-stalk',
    faceDetail: 'hooked-long-muzzle-dark-nostrils-pale-eyes-and-connected-reed-bridle',
    headgear: 'connected-reed-bridle-bands',
    outfit: 'cold-brackish-belly-deep-chest-and-fetlock-bands',
    outfitColor: 'brackish-gray-green-and-ochre-reed',
    outfitTier: 'tier2',
    weapon: 'connected-neck-coil-and-chest-muzzle-ram',
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
  drownbridleStalker: COLORS,
  alphaPolicy: 'binary-single-component-forward-heavy-high-arched-neck-hooked-muzzle-connected-crest-and-bridle-deep-chest-short-barrel-four-fetlocked-legs-grounded-dark-hooves-and-connected-ropeweed-tail',
  effectBoundary: EN_E07_DROWNBRIDLE_STALKER_CONTRACT_CARD.effectBoundary,
  bakedEffects: [],
});

export const EN_E07_DROWNBRIDLE_STALKER_GATE = deepFreeze({
  id: 'en-e07-kelpie-drownbridle-stalker-full-v1',
  status: 'approved',
  baseCheckpoint: 'f143de1fadf3b812f3968d930acf6451e926388d',
  authorizedOn: '2026-08-11',
  authorizationEvidence: 'After the exact Miremane Courser digest was visually approved, committed, pushed, and reconciled at clean published checkpoint f143de1fadf3b812f3968d930acf6451e926388d, the designer replied: lets do next. Miremane Courser completed the frozen common Kelpie role, so the one-complete-sprite cadence authorizes only one private specialist Kelpie Drownbridle Stalker 80-frame candidate.',
  approvedOn: '2026-08-11',
  approvalEvidence: 'The exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, the approved Miremane Courser and Steppe Hunter plus public Dire Wolf comparison, and synchronized GIF evidence were presented after the face readability, one-cell crown margin, bridle overlap, and profile eye were corrected before freeze. The three exact frozen PNG boards were open together in Aseprite and the live sprite list named all three paths at IDs 19, 23, and 27. The designer replied: approved lets do next. Approval applies only to candidate digest d8cbbfef97b63590e6a63335a6b241e742d87f4df5e7443933c5484ef849224b. The lets do next portion authorizes exactly one private elite Kelpie candidate only after the bounded Drownbridle publication is clean and remote verified. Kelpie registration, fixtures, runtime copying, water effects, release, and EN-E08 remain separate gates.',
  approvedImplementation: 'c34b3b9564df683900ff3846d692970faca53ff5',
  publicationAuthorizedOn: '2026-08-11',
  publicationAuthorizationEvidence: 'The designer said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact artifact or digest. It does not authorize registration, fixtures, runtime copying, effects, later roles or families, release, or any other unopened gate.',
  publishedImplementation: 'c34b3b9564df683900ff3846d692970faca53ff5',
  publishedApprovalRecord: 'b5a9011b37dc9a3e0db7c371fa168e589665a127',
  initialPublishedHandoff: '1ba57fefe52398c2c007c01adfde6384c327e6f8',
  publicationState: 'published',
  precedingApproval: {
    gateId: EN_E07_MIREMANE_COURSER_GATE.id,
    artifactSha256: EN_E07_MIREMANE_COURSER_GATE.artifactSha256,
    assembledArtifactSha256: EN_E07_MIREMANE_COURSER_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E07_MIREMANE_COURSER_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E07_MIREMANE_COURSER_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E07_MIREMANE_COURSER_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E07_MIREMANE_COURSER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E07_MIREMANE_COURSER_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E07_MIREMANE_COURSER_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E07_MIREMANE_COURSER_GATE.initialPublishedHandoff,
    currentReconciliation: 'f143de1fadf3b812f3968d930acf6451e926388d',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e07-kelpie-drownbridle-stalker/en-e07-kelpie-drownbridle-stalker-full-suite-raw.png',
  artifactSha256: '3fc970d3ffc5c33b11ec8a4d563f8684650d6548288a62dbc9191259edc75561',
  assembledArtifact: 'enemy-expansion-review/en-e07-kelpie-drownbridle-stalker/en-e07-kelpie-drownbridle-stalker-full-suite-complete-b-form.png',
  assembledArtifactSha256: '80a09e7a2062d0a34fc9aa906ef39218866afee461952805f2689a8fe3bdd0bf',
  comparisonArtifact: 'enemy-expansion-review/en-e07-kelpie-drownbridle-stalker/en-e07-kelpie-drownbridle-stalker-family-comparison.png',
  comparisonArtifactSha256: '3c7f0d4702dcd10c1f905b51717baabf3844a4d4b70e0c17736ecfa799ff51ff',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e07-kelpie-drownbridle-stalker/en-e07-kelpie-drownbridle-stalker-full-suite-four-directions-labeled.gif',
      sha256: '4b48a5454b1aabdc691578715e35b961b4a896fc9d1be9e37dfc901e17c7ca21',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e07-kelpie-drownbridle-stalker/en-e07-kelpie-drownbridle-stalker-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '18795cb0c27078a180f7044c228b5542ad100cb62b1ad8d0ccd749e5865e7781',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
  },
  candidateFrameDigest: 'd8cbbfef97b63590e6a63335a6b241e742d87f4df5e7443933c5484ef849224b',
  miremaneComparisonDigest: EN_E07_MIREMANE_COURSER_GATE.candidateFrameDigest,
  steppeHunterComparisonDigest: '13c0273ffad557976ced07708a63e6b01df59e0edd5b5c4c79cc0e341a08f272',
  direWolfComparisonDigest: 'a94a66ee380cfcb91db3907a3a049dae4b59357870857c3ed31be259bb1f1579',
  scope: 'One complete 80-frame Drownbridle Stalker specialist Kelpie across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle raises and settles the connected block crest while the reed bridle tightens against the arched neck. Walk uses four stalking diagonal hoof phases with a forward-heavy chest response and all four dark hooves readable. Attack coils the high neck, lowers the hooked bridled muzzle, drives one connected chest-and-muzzle ram, and recovers the specialist equine form. Hurt uses a complete white recoil and colored wide four-hoof brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and approved Miremane Courser and Steppe Hunter plus public Dire Wolf silhouette comparisons together.',
  exclusions: [
    'changes to approved Miremane Courser rendered pixels',
    'changes to approved Changeling, Living Shadow, Doppelganger, or Will-o-Wisp rendered pixels',
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
    'Kelpie elite',
    'EN-E08 and later work',
  ],
  nextGate: 'The exact Drownbridle Stalker digest is visually approved and published: implementation c34b3b9564df683900ff3846d692970faca53ff5, approval record b5a9011b37dc9a3e0db7c371fa168e589665a127, and initial handoff 1ba57fefe52398c2c007c01adfde6384c327e6f8 are remote verified. The same approved lets do next reply authorizes exactly one private elite Kelpie candidate from this clean published reconciliation. Kelpie registration, fixtures, runtime copying, water effects, release, and EN-E08 remain closed.',
});

export const EN_E07_DROWNBRIDLE_STALKER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'block-crest-rise', pose: 'idle', bob: 0, head: 0, mane: 0, stride: [0, 0, 0, 0] },
  { name: 'reed-bridle-tighten', pose: 'idle', bob: 1, head: 0, mane: 1, stride: [0, 0, 0, 0] },
]);

const WALK_PHASES = deepFreeze([
  { name: 'near-fore-far-hind-stalk', pose: 'walk', bob: 0, head: 0, mane: 0, stride: [-1, 1, 0, -1] },
  { name: 'high-chest-diagonal-pass', pose: 'walk', bob: -1, head: 0, mane: 1, stride: [0, 1, -1, 0] },
  { name: 'far-fore-near-hind-stalk', pose: 'walk', bob: 0, head: 1, mane: 1, stride: [1, -1, 0, 1] },
  { name: 'bridled-four-hoof-settle', pose: 'walk', bob: 1, head: 0, mane: 0, stride: [0, -1, 1, 0] },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'high-neck-coil', pose: 'draw', bob: 0, head: -1, mane: 0, stride: [0, 0, 0, 0] },
  { name: 'hooked-bridled-muzzle-lower', pose: 'lower', bob: 0, head: 1, mane: 1, stride: [-1, 0, 1, 0] },
  { name: 'connected-chest-muzzle-ram', pose: 'lunge', bob: 0, head: 0, mane: 0, stride: [-1, 1, 1, -1] },
  { name: 'drownbridle-recover', pose: 'recover', bob: 1, head: 0, mane: 1, stride: [0, 0, 0, 0] },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-high-neck-recoil', pose: 'hurt', bob: -1, head: 0, mane: 1, stride: [0, 0, 0, 0], flash: true },
  { name: 'colored-wide-four-hoof-brace', pose: 'brace', bob: 1, head: 1, mane: 0, stride: [-1, 1, 1, -1], flash: false },
]);

function createPixels() {
  return new Array(SIZE * SIZE).fill(null);
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Drownbridle Stalker rectangles must use positive integer geometry.',
    );
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Drownbridle Stalker authored pixels must remain inside the 24x24 cell.');
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
    paint.rect(upperX, legY, 2, 4, COLORS.body[1]);
    paint.rect(Math.min(x, upperX), legY, Math.abs(x - upperX) + 2, 1, COLORS.body[1]);
    paint.rect(Math.min(x, upperX), legY + 3, Math.abs(x - upperX) + 2, 1, COLORS.body[1]);
    const shinY = legY + 4;
    paint.rect(x, shinY, 1, 20 - shinY, COLORS.body[1]);
    paint.rect(x, 19, 2, 2, COLORS.belly[1]);
    paint.dot(x + 1, 20, COLORS.bridle[1]);
    paint.rect(x, 21, 2, 2, COLORS.hoof);
  }
}

function drawSide(paint, phase) {
  const y = phase.bob;
  const ram = phase.pose === 'lunge';
  const coiled = phase.pose === 'draw';
  const lowered = phase.pose === 'lower' || phase.pose === 'brace';

  paint.rect(10, 7 + y, 9, 3, COLORS.body[2]);
  paint.rect(8, 9 + y, 12, 6, COLORS.body[0]);
  paint.rect(7, 10 + y, 5, 7, COLORS.body[1]);
  paint.rect(10, 14 + y, 9, 2, COLORS.belly[0]);
  paint.rect(12, 9 + y, 7, 1, COLORS.bridle[1]);
  paint.rect(9, 12 + y, 4, 1, COLORS.bridle[0]);

  const neckX = ram ? 5 : (coiled ? 7 : 6);
  paint.rect(neckX, 4 + y, 5, 10, COLORS.body[0]);
  paint.rect(neckX + 2, 3 + y, 4, 8, COLORS.body[2]);
  paint.rect(neckX + 3, 5 + y, 3, 9, COLORS.body[1]);

  const headX = ram ? 2 : (coiled ? 4 : 3);
  const faceY = 3 + y + phase.head;
  paint.rect(headX, faceY, 6, 4, COLORS.body[0]);
  paint.rect(headX + 2, Math.max(1, faceY - 2), 4, 2, COLORS.body[2]);
  const muzzleX = ram ? 1 : (coiled ? 2 : 1);
  paint.rect(muzzleX, faceY + 3, 7, 3, COLORS.belly[0]);
  paint.rect(headX + 3, Math.max(1, faceY - 2), 2, 2, COLORS.body[1]);
  paint.dot(headX + 2, faceY + 1, COLORS.eye);
  paint.dot(muzzleX, faceY + 4, COLORS.feature);
  paint.rect(muzzleX + 1, faceY + 3, 5, 1, COLORS.bridle[0]);
  paint.rect(headX + 4, faceY, 1, 5, COLORS.bridle[1]);
  paint.rect(headX + 4, faceY + 4, Math.max(1, neckX - headX - 2), 1, COLORS.bridle[2]);

  const crestY = 2 + y + phase.mane;
  paint.rect(neckX + 3, crestY, 3, 3, COLORS.mane[2]);
  paint.rect(neckX + 4, crestY + 2, 3, 5, COLORS.mane[0]);
  paint.rect(neckX + 5, crestY + 6, 2, 6, COLORS.mane[1]);
  paint.rect(neckX + 3, crestY + 8, 3, 3, COLORS.mane[0]);

  paint.rect(19, 10 + y, 3, 4, COLORS.mane[0]);
  paint.rect(21, 12 + y, 2, 6, COLORS.mane[1]);
  paint.rect(20, 17 + y, 2, 3, COLORS.mane[1]);
  paint.dot(21, 16 + y, COLORS.bridle[2]);

  drawLegs(paint, y, [6, 10, 14, 18], phase.stride);
  if (lowered) paint.rect(6, 12 + y, 5, 4, COLORS.body[1]);
}

function drawDown(paint, phase) {
  const y = phase.bob;
  const faceY = 2 + y + phase.head;
  const spread = phase.pose === 'lunge' ? 1 : 0;

  paint.rect(7 - spread, 8 + y, 10 + (spread * 2), 5, COLORS.body[0]);
  paint.rect(6 - spread, 12 + y, 12 + (spread * 2), 5, COLORS.body[1]);
  paint.rect(7 - spread, 11 + y, 10 + (spread * 2), 3, COLORS.body[2]);
  paint.rect(8, 14 + y, 8, 3, COLORS.belly[0]);
  paint.rect(7 - spread, 12 + y, 10 + (spread * 2), 1, COLORS.bridle[0]);
  paint.rect(9, 4 + y, 6, 9, COLORS.body[0]);
  paint.rect(8, 7 + y, 8, 5, COLORS.body[2]);

  paint.rect(9, faceY + 1, 6, 5, COLORS.body[0]);
  paint.rect(10, faceY, 4, 2, COLORS.body[2]);
  paint.rect(8, faceY + 5, 8, 4, COLORS.belly[0]);
  paint.rect(8, faceY, 2, 2, COLORS.body[1]);
  paint.rect(14, faceY, 2, 2, COLORS.body[1]);
  paint.rect(9, faceY + 3, 2, 1, COLORS.feature);
  paint.rect(13, faceY + 3, 2, 1, COLORS.feature);
  paint.dot(10, faceY + 3, COLORS.eye);
  paint.dot(13, faceY + 3, COLORS.eye);
  paint.dot(9, faceY + 7, COLORS.feature);
  paint.dot(14, faceY + 7, COLORS.feature);
  paint.rect(8, faceY + 5, 8, 1, COLORS.bridle[0]);
  paint.rect(9, faceY + 3, 1, 4, COLORS.bridle[1]);
  paint.rect(14, faceY + 3, 1, 4, COLORS.bridle[1]);
  paint.rect(11, faceY + 8, 2, 1, COLORS.feature);

  const crestY = 4 + y + phase.mane;
  paint.rect(6, crestY, 3, 7, COLORS.mane[0]);
  paint.rect(6, crestY + 3, 3, 7, COLORS.mane[1]);
  paint.rect(7, crestY + 8, 2, 4, COLORS.mane[2]);

  drawLegs(paint, y, [5, 9, 14, 18], phase.stride);
}

function drawUp(paint, phase) {
  const y = phase.bob;
  const headY = 2 + y + phase.head;
  paint.rect(8, 7 + y, 8, 5, COLORS.body[1]);
  paint.rect(7, 9 + y, 10, 8, COLORS.body[0]);
  paint.rect(6, 11 + y, 12, 5, COLORS.body[2]);
  paint.rect(8, 14 + y, 8, 3, COLORS.belly[1]);
  paint.rect(8, 4 + y, 8, 9, COLORS.body[0]);
  paint.rect(9, headY, 6, 6, COLORS.body[1]);
  paint.rect(8, headY, 2, 2, COLORS.body[1]);
  paint.rect(14, headY, 2, 2, COLORS.body[1]);
  paint.rect(9, 6 + y, 7, 1, COLORS.bridle[0]);
  paint.rect(10, 6 + y, 1, 5, COLORS.bridle[1]);

  const crestY = 3 + y + phase.mane;
  paint.rect(6, crestY, 4, 8, COLORS.mane[0]);
  paint.rect(5, crestY + 3, 3, 8, COLORS.mane[1]);
  paint.rect(6, crestY + 9, 3, 4, COLORS.mane[2]);

  paint.rect(16, 12 + y, 4, 5, COLORS.mane[0]);
  paint.rect(18, 15 + y, 3, 5, COLORS.mane[1]);
  paint.dot(19, 17 + y, COLORS.bridle[2]);

  drawLegs(paint, y, [5, 9, 14, 18], phase.stride);
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
    return HURT_PHASES[EN_E07_DROWNBRIDLE_STALKER_DEATH_SOURCE_FRAMES[frame]];
  }
  throw new TypeError('Animation ' + animation + ' is not implemented for Drownbridle Stalker.');
}

function buildPixels(direction, animation, frame) {
  const phase = phaseFor(animation, frame);
  const canonical = direction === 'right' ? 'left' : direction;
  const pixels = createPixels();
  const paint = painter(pixels);
  if (canonical === 'down') drawDown(paint, phase);
  else if (canonical === 'up') drawUp(paint, phase);
  else if (canonical === 'left') drawSide(paint, phase);
  else throw new TypeError('Unsupported Drownbridle Stalker direction ' + direction + '.');
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

export function renderEnE07DrownbridleStalkerFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Drownbridle Stalker rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Drownbridle Stalker direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'kelpie',
    variant: 'drownbridle-stalker',
    direction,
    animation,
    frame,
    phase: phase.name,
    drownbridleStalkerGate: EN_E07_DROWNBRIDLE_STALKER_GATE.id,
    approvedPrecedingGate: EN_E07_MIREMANE_COURSER_GATE.id,
    alphaPolicy: EN_E07_DROWNBRIDLE_STALKER_DATA.alphaPolicy,
    effectBoundary: EN_E07_DROWNBRIDLE_STALKER_DATA.effectBoundary,
  });
}

export const EN_E07_DROWNBRIDLE_STALKER_RENDERER = deepFreeze({
  key: 'en-e07-kelpie-drownbridle-stalker-v1',
  chassis: EN_E07_DROWNBRIDLE_STALKER_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'kelpie', 'The EN-E07 Drownbridle Stalker renderer is restricted to Kelpie.');
    assert(variant.id === 'drownbridle-stalker', 'The EN-E07 Drownbridle Stalker renderer is restricted to Drownbridle Stalker.');
    return renderEnE07DrownbridleStalkerFrame(context, direction, animation.id, frame);
  },
});

const DROWNBRIDLE_STALKER_VARIANT = deepFreeze({
  id: 'drownbridle-stalker',
  name: 'Drownbridle Stalker',
  role: EN_E07_DROWNBRIDLE_STALKER_CONTRACT.role,
  status: EN_E07_DROWNBRIDLE_STALKER_CONTRACT.state,
  brief: 'A private complete specialist Kelpie with a forward-heavy high-crested equine body, hooked readable muzzle, connected reed bridle, deep chest, short barrel, four separated fetlocked legs and grounded dark hooves, and a connected ropeweed tail; riders, horns, armor, loose reins, copied mounts, and water effects remain external.',
  rendererData: EN_E07_DROWNBRIDLE_STALKER_DATA,
});

export const EN_E07_DROWNBRIDLE_STALKER_FAMILY = deepFreeze({
  id: 'kelpie',
  name: 'Kelpie Drownbridle Stalker Review',
  sliceId: 'EN-E07',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E07_DROWNBRIDLE_STALKER_CONTRACT.chassis,
  rendererKey: EN_E07_DROWNBRIDLE_STALKER_RENDERER.key,
  variants: [DROWNBRIDLE_STALKER_VARIANT],
  rendererData: {
    contractCard: EN_E07_DROWNBRIDLE_STALKER_CONTRACT_CARD.id,
    approvedPrecedingGate: EN_E07_MIREMANE_COURSER_GATE.id,
    activeGate: EN_E07_DROWNBRIDLE_STALKER_GATE.id,
  },
  review: {
    baselineVariant: 'drownbridle-stalker',
    scale: 8,
    notes: 'Visually approved and published as one forward-heavy high-crested authored Drownbridle Stalker against approved Miremane Courser and Steppe Hunter plus public Dire Wolf. The same reply opens one separate private elite Kelpie candidate; keep registration, fixtures, runtime copying, water effects, and later Wave 2 work separate.',
  },
});

export const EN_E07_DROWNBRIDLE_STALKER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E07_DROWNBRIDLE_STALKER_RENDERER],
  families: [EN_E07_DROWNBRIDLE_STALKER_FAMILY],
});
