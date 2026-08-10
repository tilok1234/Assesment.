import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E07_LIVING_SHADOW_CONTRACT_CARD,
} from './enemy-expansion-en-e07-living-shadow-gloam-walker.js';
import {
  EN_E07_NIGHTGLASS_SEER_GATE,
} from './enemy-expansion-en-e07-living-shadow-nightglass-seer.js';

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
  body: ['#3d345c', '#24213c', '#68558c'],
  void: ['#211c35', '#151324', '#44385f'],
  rim: ['#7d68a1', '#4d406d', '#aa96cf'],
  bracer: ['#51436f', '#2b2544', '#8975ad'],
  eye: '#d6f3ef',
  flash: '#f4f4f4',
});

export const EN_E07_HOLLOWCROWN_REGENT_CONTRACT = deepFreeze({
  sliceId: 'EN-E07',
  family: 'living-shadow',
  variant: 'hollowcrown-regent',
  role: 'elite',
  state: 'implemented-complete-motion-approved',
  chassis: 'three-prong-crown-high-mantle-twin-slit-void-heart-command-bracer-split-leg-living-shadow-v1',
  silhouette: 'A tall grounded Living Shadow elite with a connected three-prong hollow crown, high angular shoulder mantle, paired narrow face slits, a diamond void-heart aperture, command-bracer arms, two armored split legs, and broad throne-step feet. Elite presence comes from crown height, mantle span, and deliberate posture rather than becoming a bulky knight, enlarged Gloam Walker, or another robed caster.',
  identity: 'The approved violet-black Living Shadow ramp, connected crown and mantle, paired pale eye slits, transparent diamond heart, squared command bracers, split greaves, and planted feet establish a self-contained Hollowcrown Regent without baking in a halo, eclipse ring, throne, banner, ray, portal, shadow double, glow, or particles.',
  effectBoundary: 'Crown halos, eclipse rings, throne shapes, banners, void rays, portals, floor seals, shadow doubles, detached mantle trails, glow, particles, projectiles, and impact flashes remain external.',
});

export const EN_E07_HOLLOWCROWN_REGENT_DATA = deepFreeze({
  actor: {
    species: 'living-shadow',
    bodyBuild: 'tall-crowned-grounded-humanoid',
    skin: 'violet-black-shadow',
    hairStyle: 'connected-hollowcrown-prongs',
    hairColor: 'gloam-violet',
    expression: 'paired-slit-regent-vigil',
    faceDetail: 'two-connected-narrow-eye-slits-under-crown',
    headgear: 'self-shadow-three-prong-crown',
    outfit: 'self-shadow-high-mantle-and-split-greaves',
    outfitColor: 'abyss-violet',
    outfitTier: 'tier3',
    weapon: 'connected-command-bracer-arms',
    weaponTier: 'none',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.body,
      hair: COLORS.rim,
      outfit: COLORS.void,
    },
  },
  hollowcrownRegent: COLORS,
  alphaPolicy: 'binary-connected-three-prong-crown-high-mantle-twin-slit-face-diamond-void-heart-command-bracers-armored-split-legs-and-throne-step-feet',
  effectBoundary: 'external-crown-halos-eclipse-rings-thrones-banners-void-rays-portals-floor-seals-shadow-doubles-detached-mantle-trails-glow-particles-projectiles-and-impact-flashes',
  bakedEffects: [],
});

export const EN_E07_HOLLOWCROWN_REGENT_GATE = deepFreeze({
  id: 'en-e07-living-shadow-hollowcrown-regent-full-v1',
  status: 'approved',
  baseCheckpoint: '46ad4e7759a1ef3a096ba326d96cdef44d1ee3b1',
  authorizedOn: '2026-08-10',
  authorizationEvidence: 'After the exact Nightglass Seer was visually approved, committed, pushed, and reconciled at a clean published checkpoint, the designer replied: approved lets do next. The frozen Living Shadow role order is common, specialist, elite, so the one-complete-sprite cadence authorizes only one private elite Hollowcrown Regent 80-frame candidate.',
  approvedOn: '2026-08-10',
  approvalEvidence: 'After the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, the public Cursed Ghost and Shadow Slime plus approved Mist Weaver, Gloam Walker, and Nightglass Seer comparison, and paired GIF evidence were presented, and the three exact PNG review boards were opened together in Aseprite, the designer replied: approved lets do next. Approval applies only to candidate digest 657e4071ab8432387f7c8b6ecff8650f3f7a63bf7dc8f4b68564373a5e450991; Living Shadow registration, fixtures, effects, another EN-E07 family, release, and EN-E08 remain separate gates.',
  approvedImplementation: 'ffe5f574ab9f06ecfaad83c50a7980254eea7211',
  publicationAuthorizedOn: '2026-08-10',
  publicationAuthorizationEvidence: 'The designer said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact artifact or digest. It does not authorize registration, fixtures, effects, later roles or families, release, or any other unopened gate.',
  publishedImplementation: null,
  publishedApprovalRecord: null,
  publicationState: 'authorized-pending-bounded-publication',
  precedingApproval: {
    gateId: EN_E07_NIGHTGLASS_SEER_GATE.id,
    artifactSha256: EN_E07_NIGHTGLASS_SEER_GATE.artifactSha256,
    assembledArtifactSha256: EN_E07_NIGHTGLASS_SEER_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E07_NIGHTGLASS_SEER_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E07_NIGHTGLASS_SEER_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E07_NIGHTGLASS_SEER_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E07_NIGHTGLASS_SEER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E07_NIGHTGLASS_SEER_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E07_NIGHTGLASS_SEER_GATE.publishedApprovalRecord,
    publishedHandoff: '46ad4e7759a1ef3a096ba326d96cdef44d1ee3b1',
  },
  artifact: 'enemy-expansion-review/en-e07-living-shadow-hollowcrown-regent/en-e07-living-shadow-hollowcrown-regent-full-suite-raw.png',
  artifactSha256: '28bacd40bff6686fb84fdbe0e6d149fa60384b50493dccd09d11f5985852b7c0',
  assembledArtifact: 'enemy-expansion-review/en-e07-living-shadow-hollowcrown-regent/en-e07-living-shadow-hollowcrown-regent-full-suite-complete-b-form.png',
  assembledArtifactSha256: 'd41dbf448ba59ba73befa65c553655fdb9f980b9d3e7e400a866125d36ff9d3b',
  comparisonArtifact: 'enemy-expansion-review/en-e07-living-shadow-hollowcrown-regent/en-e07-living-shadow-hollowcrown-regent-spectral-comparison.png',
  comparisonArtifactSha256: '414f5e44c9812cbdc6166a05205aa0fd01a73666ee867000234531ff7c4e4e59',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e07-living-shadow-hollowcrown-regent/en-e07-living-shadow-hollowcrown-regent-full-suite-four-directions-labeled.gif',
      sha256: '5e8acdc677f7cab6738600a259e666e4596963917eb3136b75e9987f3050662d',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e07-living-shadow-hollowcrown-regent/en-e07-living-shadow-hollowcrown-regent-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: 'dbe5c9676626240b57cada5f092ae43f0d627644a958882d3ea40ddb473923cd',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
  },
  candidateFrameDigest: '657e4071ab8432387f7c8b6ecff8650f3f7a63bf7dc8f4b68564373a5e450991',
  cursedGhostComparisonDigest: 'c49507d0e6e55adfe8fcf72312ea969fbaab3a120fc37c81ec7de50245d8eb42',
  shadowSlimeComparisonDigest: '04725a8150c31914758c7185f9c9d82c7cc97c666ea306f291d63aba04eccee1',
  mistWeaverComparisonDigest: 'e57a0af441f895fe376f2696d859a97d84564ddf034235d3b237b2cf637520da',
  gloamWalkerComparisonDigest: '131a95a106a36dea2f6879611c8e14e3aa077012dcbd1bd32e111c45658ca3f9',
  nightglassSeerComparisonDigest: EN_E07_NIGHTGLASS_SEER_GATE.candidateFrameDigest,
  scope: 'One complete 80-frame Hollowcrown Regent elite Living Shadow across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle carries a restrained crown-and-mantle compression. Walk uses four measured throne-step strides with opposing command bracers and crown tilt. Attack crosses both bracers into an edict seal, raises one command arm, opens the mantle and diamond void-heart for a full decree, then returns to a planted recovery. Hurt uses a complete white recoil and colored crown-mantle brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and a public Cursed Ghost and Shadow Slime plus approved Mist Weaver, Gloam Walker, and Nightglass Seer silhouette comparison together.',
  exclusions: [
    'changes to approved Gloam Walker rendered pixels',
    'changes to approved Nightglass Seer rendered pixels',
    'changes to any approved EN-E06 source or pixels',
    'public Living Shadow registration',
    'public catalog exposure',
    'asset-pack fixture generation or regeneration',
    'new Cast pixels',
    'new Death pixels',
    'crown halos',
    'eclipse rings',
    'throne shapes',
    'banners',
    'void rays',
    'portals',
    'floor seals',
    'shadow doubles',
    'detached mantle trails',
    'glow',
    'particles',
    'projectiles',
    'impact flashes',
    'effects',
    'release',
    'Doppelganger',
    'Will-o-Wisp',
    'Changeling',
    'Kelpie',
    'EN-E08 and later work',
  ],
  nextGate: 'The exact Hollowcrown Regent candidate is visually approved and its implementation is committed at ffe5f574ab9f06ecfaad83c50a7980254eea7211. Its bounded approval-record, documentation reconciliation, and branch push are authorized. After a clean published reconciliation, the same approved lets do next response opens only one private common Doppelganger candidate. Do not register Living Shadow, generate fixtures, add effects, release, start another role or family beyond that candidate, or advance EN-E08.',
});

export const EN_E07_HOLLOWCROWN_REGENT_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const WALK_PHASES = deepFreeze([
  { name: 'left-throne-step', pose: 'walk', bob: 0, step: -1, arm: 1, crown: -1 },
  { name: 'crown-mantle-pass', pose: 'walk', bob: -1, step: 0, arm: -1, crown: 1 },
  { name: 'right-throne-step', pose: 'walk', bob: 0, step: 1, arm: -1, crown: 1 },
  { name: 'regent-stride-settle', pose: 'walk', bob: 1, step: 0, arm: 1, crown: -1 },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'crossed-edict-seal', pose: 'seal', bob: 0, step: 0, arm: 0, crown: 0 },
  { name: 'raised-command', pose: 'command', bob: -1, step: 0, arm: 1, crown: 1 },
  { name: 'hollowcrown-full-decree', pose: 'decree', bob: 0, step: 1, arm: -1, crown: 0 },
  { name: 'planted-regent-recovery', pose: 'recover', bob: 1, step: 0, arm: 0, crown: -1 },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-hollowcrown-recoil', pose: 'hurt', bob: 0, step: -1, arm: 0, crown: 0, flash: true },
  { name: 'colored-regent-brace', pose: 'brace', bob: 1, step: 0, arm: -1, crown: -1, flash: false },
]);

function createPixels() {
  return new Array(SIZE * SIZE).fill(null);
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Hollowcrown Regent rectangles must use positive integer geometry.',
    );
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Hollowcrown Regent authored pixels must remain inside the 24x24 cell.');
      pixels[(py * SIZE) + px] = fill;
    }
  };
  return {
    rect,
    dot(x, y, fill) {
      rect(x, y, 1, 1, fill);
    },
    clear(x, y, width, height) {
      for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
        assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Hollowcrown Regent negative space must remain inside the 24x24 cell.');
        pixels[(py * SIZE) + px] = null;
      }
    },
  };
}

function drawFrontHead(paint, rear, phase) {
  const y = phase.bob || 0;
  const tilt = phase.crown || 0;

  // All three crown prongs join the same head and mantle silhouette.
  paint.rect(11 + Math.max(tilt, 0), 2 + y, 2, 4, COLORS.rim[2]);
  paint.rect(7 + Math.min(tilt, 0), 3 + y, 3, 3, COLORS.rim[1]);
  paint.rect(14 + Math.max(tilt, 0), 3 + y, 3, 3, COLORS.rim[0]);
  paint.rect(8, 5 + y, 8, 2, COLORS.rim[1]);
  paint.rect(7, 6 + y, 10, 5, COLORS.void[1]);
  paint.rect(8, 6 + y, 8, 2, COLORS.body[0]);
  paint.rect(7, 8 + y, 3, 3, COLORS.body[1]);
  paint.rect(14, 8 + y, 3, 3, COLORS.body[0]);
  paint.rect(9, 10 + y, 6, 2, COLORS.void[0]);
  paint.dot(7, 6 + y, COLORS.rim[2]);
  paint.dot(16, 9 + y, COLORS.rim[0]);
  if (rear) {
    paint.rect(10, 8 + y, 4, 2, COLORS.rim[1]);
    paint.dot(11, 7 + y, COLORS.rim[2]);
  } else {
    paint.rect(10, 8 + y, 1, 2, COLORS.eye);
    paint.rect(13, 8 + y, 1, 2, COLORS.eye);
  }
}

function drawFrontArms(paint, phase, y) {
  if (phase.pose === 'seal') {
    paint.rect(3, 10 + y, 6, 4, COLORS.body[1]);
    paint.rect(6, 13 + y, 6, 3, COLORS.bracer[1]);
    paint.rect(8, 15 + y, 4, 2, COLORS.rim[1]);
    paint.rect(15, 10 + y, 6, 4, COLORS.body[0]);
    paint.rect(12, 13 + y, 6, 3, COLORS.bracer[0]);
    paint.rect(12, 15 + y, 4, 2, COLORS.rim[0]);
    paint.rect(11, 14 + y, 2, 3, COLORS.rim[2]);
  } else if (phase.pose === 'command') {
    paint.rect(3, 11 + y, 6, 5, COLORS.body[1]);
    paint.rect(4, 15 + y, 5, 3, COLORS.bracer[1]);
    paint.rect(15, 9 + y, 6, 4, COLORS.body[0]);
    paint.rect(17, 6 + y, 4, 5, COLORS.bracer[0]);
    paint.rect(19, 4 + y, 3, 3, COLORS.rim[0]);
    paint.dot(21, 3 + y, COLORS.rim[2]);
  } else if (phase.pose === 'decree') {
    paint.rect(3, 9 + y, 6, 4, COLORS.body[1]);
    paint.rect(1, 7 + y, 5, 4, COLORS.bracer[1]);
    paint.rect(1, 6 + y, 3, 2, COLORS.rim[1]);
    paint.rect(15, 9 + y, 6, 4, COLORS.body[0]);
    paint.rect(18, 7 + y, 5, 4, COLORS.bracer[0]);
    paint.rect(20, 6 + y, 3, 2, COLORS.rim[0]);
    paint.dot(1, 5 + y, COLORS.rim[2]);
    paint.dot(22, 5 + y, COLORS.rim[2]);
  } else if (phase.pose === 'recover') {
    paint.rect(3, 11 + y, 6, 5, COLORS.body[1]);
    paint.rect(2, 15 + y, 6, 3, COLORS.bracer[1]);
    paint.rect(15, 11 + y, 6, 5, COLORS.body[0]);
    paint.rect(16, 15 + y, 6, 3, COLORS.bracer[0]);
    paint.dot(3, 18 + y, COLORS.rim[2]);
    paint.dot(20, 18 + y, COLORS.rim[2]);
  } else {
    const swing = phase.arm || 0;
    paint.rect(3, 10 + y, 6, 5, COLORS.body[1]);
    paint.rect(2, 14 + y + Math.max(swing, 0), 6, 3, COLORS.bracer[1]);
    paint.rect(4, 16 + y + Math.max(swing, 0), 5, 2, COLORS.rim[1]);
    paint.rect(15, 10 + y, 6, 5, COLORS.body[0]);
    paint.rect(16, 14 + y + Math.max(-swing, 0), 6, 3, COLORS.bracer[0]);
    paint.rect(15, 16 + y + Math.max(-swing, 0), 5, 2, COLORS.rim[0]);
  }
}

function drawFrontBody(paint, rear, phase) {
  const y = phase.bob || 0;
  const step = phase.step || 0;

  // The high mantle joins crown, torso, and both command arms.
  paint.rect(4, 10 + y, 6, 3, COLORS.body[1]);
  paint.rect(14, 10 + y, 6, 3, COLORS.body[0]);
  paint.rect(7, 10 + y, 10, 4, COLORS.rim[1]);
  paint.dot(4, 9 + y, COLORS.rim[2]);
  paint.dot(19, 9 + y, COLORS.rim[2]);
  paint.rect(8, 12 + y, 8, 7, COLORS.body[0]);
  paint.rect(8, 13 + y, 2, 5, COLORS.rim[1]);
  paint.rect(14, 13 + y, 2, 5, COLORS.body[1]);
  paint.rect(9, 18 + y, 6, 2, COLORS.void[0]);

  // A transparent 2/4/2 diamond stays enclosed by the connected torso ring.
  paint.clear(11, 13 + y, 2, 1);
  paint.clear(10, 14 + y, 4, 2);
  paint.clear(11, 16 + y, 2, 1);
  if (rear) {
    paint.rect(11, 13 + y, 2, 1, COLORS.rim[1]);
    paint.rect(11, 16 + y, 2, 2, COLORS.rim[0]);
  } else {
    paint.dot(10, 13 + y, COLORS.rim[2]);
    paint.dot(13, 16 + y, COLORS.rim[0]);
  }

  drawFrontArms(paint, phase, y);

  const leftX = 7 + Math.min(step, 0);
  const rightX = 13 + Math.max(step, 0);
  paint.rect(leftX, 17, 4, 5, COLORS.body[1]);
  paint.rect(rightX, 17, 4, 5, COLORS.body[0]);
  paint.rect(leftX - 2, 20, 6, 3, COLORS.bracer[1]);
  paint.rect(rightX + 1, 20, 6, 3, COLORS.bracer[0]);
  paint.rect(leftX - 2, 22, 7, 1, COLORS.rim[1]);
  paint.rect(rightX, 22, 7, 1, COLORS.rim[0]);
  paint.dot(leftX - 2, 21, COLORS.rim[2]);
  paint.dot(rightX + 6, 21, COLORS.rim[2]);
}

function drawRightHead(paint, phase) {
  const y = phase.bob || 0;
  const tilt = phase.crown > 0 ? 1 : 0;

  paint.rect(11 + tilt, 2 + y, 2, 4, COLORS.rim[2]);
  paint.rect(7, 3 + y, 3, 3, COLORS.rim[1]);
  paint.rect(14 + tilt, 3 + y, 3, 3, COLORS.rim[0]);
  paint.rect(8, 5 + y, 9, 2, COLORS.rim[1]);
  paint.rect(6, 6 + y, 12, 5, COLORS.void[1]);
  paint.rect(7, 6 + y, 10, 2, COLORS.body[0]);
  paint.rect(6, 8 + y, 4, 3, COLORS.body[1]);
  paint.rect(15, 8 + y, 4, 3, COLORS.body[0]);
  paint.rect(9, 10 + y, 8, 2, COLORS.void[0]);
  paint.rect(16, 8 + y, 1, 2, COLORS.eye);
  paint.dot(18, 9 + y, COLORS.rim[2]);
  paint.dot(6, 6 + y, COLORS.rim[2]);
}

function drawRightArms(paint, phase, y) {
  if (phase.pose === 'seal') {
    paint.rect(4, 10 + y, 6, 5, COLORS.body[1]);
    paint.rect(8, 13 + y, 6, 3, COLORS.bracer[1]);
    paint.rect(14, 10 + y, 6, 4, COLORS.body[0]);
    paint.rect(12, 13 + y, 6, 3, COLORS.bracer[0]);
    paint.rect(12, 15 + y, 3, 2, COLORS.rim[2]);
  } else if (phase.pose === 'command') {
    paint.rect(4, 11 + y, 6, 5, COLORS.body[1]);
    paint.rect(3, 15 + y, 6, 3, COLORS.bracer[1]);
    paint.rect(14, 9 + y, 6, 4, COLORS.body[0]);
    paint.rect(17, 6 + y, 4, 5, COLORS.bracer[0]);
    paint.rect(19, 4 + y, 3, 3, COLORS.rim[0]);
    paint.dot(21, 3 + y, COLORS.rim[2]);
  } else if (phase.pose === 'decree') {
    paint.rect(4, 10 + y, 6, 5, COLORS.body[1]);
    paint.rect(3, 14 + y, 6, 3, COLORS.bracer[1]);
    paint.rect(14, 9 + y, 6, 4, COLORS.body[0]);
    paint.rect(18, 7 + y, 5, 4, COLORS.bracer[0]);
    paint.rect(20, 5 + y, 3, 3, COLORS.rim[0]);
    paint.dot(22, 4 + y, COLORS.rim[2]);
  } else if (phase.pose === 'recover') {
    paint.rect(4, 11 + y, 6, 5, COLORS.body[1]);
    paint.rect(3, 15 + y, 6, 3, COLORS.bracer[1]);
    paint.rect(14, 11 + y, 6, 5, COLORS.body[0]);
    paint.rect(17, 15 + y, 6, 3, COLORS.bracer[0]);
    paint.dot(21, 18 + y, COLORS.rim[2]);
  } else {
    const swing = phase.arm || 0;
    paint.rect(4, 10 + y, 6, 5, COLORS.body[1]);
    paint.rect(3, 14 + y + Math.max(swing, 0), 6, 3, COLORS.bracer[1]);
    paint.rect(14, 10 + y, 6, 5, COLORS.body[0]);
    paint.rect(17, 14 + y + Math.max(-swing, 0), 6, 3, COLORS.bracer[0]);
    paint.dot(21, 17 + y + Math.max(-swing, 0), COLORS.rim[2]);
  }
}

function drawRightBody(paint, phase) {
  const y = phase.bob || 0;
  const step = phase.step || 0;

  paint.rect(5, 10 + y, 6, 3, COLORS.body[1]);
  paint.rect(13, 10 + y, 7, 3, COLORS.body[0]);
  paint.rect(8, 10 + y, 9, 4, COLORS.rim[1]);
  paint.dot(5, 9 + y, COLORS.rim[2]);
  paint.dot(19, 9 + y, COLORS.rim[2]);
  paint.rect(8, 12 + y, 9, 7, COLORS.body[0]);
  paint.rect(8, 13 + y, 2, 5, COLORS.rim[1]);
  paint.rect(15, 13 + y, 2, 5, COLORS.body[1]);
  paint.rect(10, 18 + y, 6, 2, COLORS.void[0]);
  paint.clear(12, 13 + y, 2, 1);
  paint.clear(11, 14 + y, 4, 2);
  paint.clear(12, 16 + y, 2, 1);
  paint.dot(15, 17 + y, COLORS.rim[0]);

  drawRightArms(paint, phase, y);

  const farX = 7 + Math.min(step, 0);
  const nearX = 13 + Math.max(step, 0);
  paint.rect(farX, 17, 4, 5, COLORS.body[1]);
  paint.rect(nearX, 17, 4, 5, COLORS.body[0]);
  paint.rect(farX - 2, 20, 6, 3, COLORS.bracer[1]);
  paint.rect(nearX + 1, 20, 6, 3, COLORS.bracer[0]);
  paint.rect(farX - 2, 22, 7, 1, COLORS.rim[1]);
  paint.rect(nearX, 22, 7, 1, COLORS.rim[0]);
  paint.dot(farX - 2, 21, COLORS.rim[2]);
  paint.dot(nearX + 6, 21, COLORS.rim[2]);
}

function mirrorPixels(pixels) {
  const result = new Array(SIZE * SIZE).fill(null);
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    result[(y * SIZE) + (SIZE - 1 - x)] = pixels[(y * SIZE) + x];
  }
  return result;
}

function buildPixels(direction, animation, frame) {
  const canonicalDirection = direction === 'left' ? 'right' : direction;
  let phase;
  if (animation === 'idle') {
    assert(frame === 0 || frame === 1, 'Hollowcrown Regent Idle frame ' + frame + ' is out of range.');
    phase = frame === 0
      ? { name: 'paired-slit-regent-vigil', pose: 'idle', bob: 0, step: 0, arm: -1, crown: -1 }
      : { name: 'crown-mantle-breath', pose: 'idle', bob: 1, step: 0, arm: 1, crown: 1 };
  } else if (animation === 'walk') {
    phase = WALK_PHASES[frame];
  } else if (animation === 'attack' || animation === 'cast') {
    phase = ATTACK_PHASES[frame];
  } else if (animation === 'hurt') {
    phase = HURT_PHASES[frame];
  } else if (animation === 'death') {
    phase = HURT_PHASES[EN_E07_HOLLOWCROWN_REGENT_DEATH_SOURCE_FRAMES[frame]];
  }
  assert(phase, 'Hollowcrown Regent animation ' + animation + ' frame ' + frame + ' is out of range.');

  let pixels = createPixels();
  const paint = painter(pixels);
  if (canonicalDirection === 'right') {
    drawRightBody(paint, phase);
    drawRightHead(paint, phase);
  } else {
    const rear = canonicalDirection === 'up';
    drawFrontBody(paint, rear, phase);
    drawFrontHead(paint, rear, phase);
  }
  if (phase.flash) pixels = pixels.map((color) => color ? COLORS.flash : null);
  if (direction === 'left') pixels = mirrorPixels(pixels);
  return Object.freeze({ phase, pixels: Object.freeze(pixels) });
}

function paintPixels(context, pixels) {
  for (let index = 0; index < pixels.length; index++) {
    const fill = pixels[index];
    if (!fill) continue;
    context.fillStyle = fill;
    context.fillRect(index % SIZE, Math.floor(index / SIZE), 1, 1);
  }
}

export function renderEnE07HollowcrownRegentFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Hollowcrown Regent rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Hollowcrown Regent direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'living-shadow',
    variant: 'hollowcrown-regent',
    direction,
    animation,
    frame,
    phase: phase.name,
    hollowcrownRegentGate: EN_E07_HOLLOWCROWN_REGENT_GATE.id,
    approvedPrecedingGate: EN_E07_NIGHTGLASS_SEER_GATE.id,
    alphaPolicy: EN_E07_HOLLOWCROWN_REGENT_DATA.alphaPolicy,
    effectBoundary: EN_E07_HOLLOWCROWN_REGENT_DATA.effectBoundary,
  });
}

export const EN_E07_HOLLOWCROWN_REGENT_RENDERER = deepFreeze({
  key: 'en-e07-living-shadow-hollowcrown-regent-v1',
  chassis: EN_E07_HOLLOWCROWN_REGENT_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'living-shadow', 'The EN-E07 Hollowcrown Regent renderer is restricted to Living Shadow.');
    assert(variant.id === 'hollowcrown-regent', 'The EN-E07 Hollowcrown Regent renderer is restricted to Hollowcrown Regent.');
    return renderEnE07HollowcrownRegentFrame(context, direction, animation.id, frame);
  },
});

const HOLLOWCROWN_REGENT_VARIANT = deepFreeze({
  id: 'hollowcrown-regent',
  name: 'Hollowcrown Regent',
  role: EN_E07_HOLLOWCROWN_REGENT_CONTRACT.role,
  status: EN_E07_HOLLOWCROWN_REGENT_CONTRACT.state,
  brief: 'An approved complete elite Living Shadow with a connected three-prong crown, high mantle, paired eye slits, diamond void-heart, command bracers, armored split legs, and throne-step feet; halos, rings, banners, rays, portals, doubles, glow, and particles remain external.',
  rendererData: EN_E07_HOLLOWCROWN_REGENT_DATA,
});

export const EN_E07_HOLLOWCROWN_REGENT_FAMILY = deepFreeze({
  id: 'living-shadow',
  name: 'Living Shadow Hollowcrown Regent Review',
  sliceId: 'EN-E07',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E07_HOLLOWCROWN_REGENT_CONTRACT.chassis,
  rendererKey: EN_E07_HOLLOWCROWN_REGENT_RENDERER.key,
  variants: [HOLLOWCROWN_REGENT_VARIANT],
  rendererData: {
    contractCard: EN_E07_LIVING_SHADOW_CONTRACT_CARD.id,
    approvedPrecedingGate: EN_E07_NIGHTGLASS_SEER_GATE.id,
    activeGate: EN_E07_HOLLOWCROWN_REGENT_GATE.id,
  },
  review: {
    baselineVariant: 'hollowcrown-regent',
    scale: 8,
    notes: 'Visually approved as one tall grounded Hollowcrown Regent against public Cursed Ghost and Shadow Slime plus approved Mist Weaver, Gloam Walker, and Nightglass Seer. The exact implementation is committed locally and its bounded publication is authorized. Keep registration, fixtures, effects, Doppelganger artwork, and later Wave 2 work separate until the clean published reconciliation.',
  },
});

export const EN_E07_HOLLOWCROWN_REGENT_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E07_HOLLOWCROWN_REGENT_RENDERER],
  families: [EN_E07_HOLLOWCROWN_REGENT_FAMILY],
});
