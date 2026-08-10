import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E07_GLOAM_WALKER_GATE,
  EN_E07_LIVING_SHADOW_CONTRACT_CARD,
} from './enemy-expansion-en-e07-living-shadow-gloam-walker.js';

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
  shutter: ['#51436f', '#2b2544', '#8975ad'],
  eye: '#d6f3ef',
  flash: '#f4f4f4',
});

export const EN_E07_NIGHTGLASS_SEER_CONTRACT = deepFreeze({
  sliceId: 'EN-E07',
  family: 'living-shadow',
  variant: 'nightglass-seer',
  role: 'specialist',
  state: 'implemented-complete-motion-approved',
  chassis: 'faceted-single-eye-yoke-sight-frame-split-leg-living-shadow-v1',
  silhouette: 'A grounded faceted Living Shadow specialist with a broad nightglass mask, one vertical eye, connected shoulder yoke, angular sight-frame arms, a narrow transparent chest aperture, two bent split legs, and planted wedge feet. It must stay visibly related to Gloam Walker without inheriting its hooked crown and long claw profile or collapsing into a Ghost, Slime, or robed caster.',
  identity: 'The approved violet-black Living Shadow ramp, one pale vertical eye, symmetrical mask facets, connected shutter forearms, a hollow chest aperture, and bent planted legs establish a self-contained Nightglass Seer without baking in a beam, gaze cone, portal, rune, glow, or afterimage.',
  effectBoundary: 'Eye beams, gaze cones, portals, runes, divination marks, floor sigils, glow, afterimages, loose shards, trails, projectiles, and impact flashes remain external.',
});

export const EN_E07_NIGHTGLASS_SEER_DATA = deepFreeze({
  actor: {
    species: 'living-shadow',
    bodyBuild: 'faceted-grounded-humanoid',
    skin: 'violet-black-shadow',
    hairStyle: 'nightglass-mask-facets',
    hairColor: 'gloam-violet',
    expression: 'single-eye-vigil',
    faceDetail: 'one-connected-vertical-eye-in-faceted-mask',
    headgear: 'none',
    outfit: 'self-shadow-yoke-and-shutter-frame',
    outfitColor: 'abyss-violet',
    outfitTier: 'tier2',
    weapon: 'connected-nightglass-sight-frame-arms',
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
  nightglassSeer: COLORS,
  alphaPolicy: 'binary-connected-faceted-mask-single-eye-shoulder-yoke-sight-frame-arms-hollow-chest-bent-split-legs-and-planted-wedge-feet',
  effectBoundary: 'external-eye-beams-gaze-cones-portals-runes-divination-marks-floor-sigils-glow-afterimages-loose-shards-trails-projectiles-and-impact-flashes',
  bakedEffects: [],
});

export const EN_E07_NIGHTGLASS_SEER_GATE = deepFreeze({
  id: 'en-e07-living-shadow-nightglass-seer-full-v1',
  status: 'approved',
  baseCheckpoint: '98d3781b81c8c7ff615ad3cd6562efe12ce63d94',
  authorizedOn: '2026-08-10',
  authorizationEvidence: 'After the exact Gloam Walker was visually approved, committed, pushed, and reconciled at a clean published checkpoint, the designer said: lets do next. The frozen Living Shadow role order is common, specialist, elite, so the one-complete-sprite cadence authorizes only one private specialist Nightglass Seer 80-frame candidate.',
  approvedOn: '2026-08-10',
  approvalEvidence: 'After the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, the public Cursed Ghost and Shadow Slime plus approved Mist Weaver and Gloam Walker comparison, and paired GIF evidence were presented, and the three exact PNG review boards were opened together in Aseprite, the designer replied: approved lets do next. Approval applies only to candidate digest 07909fa9b74df6dd386ca3f6186fe4da26e8d088af99ad7e2dfa2bcdeb10d3fa; Living Shadow registration, fixtures, effects, elite artwork, another EN-E07 family, release, and EN-E08 remain separate gates.',
  approvedImplementation: '325a6f4cfa1418383c93510262a631358add1d5f',
  publicationAuthorizedOn: '2026-08-10',
  publicationAuthorizationEvidence: 'The designer said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact artifact or digest. It does not authorize registration, fixtures, effects, later roles or families, release, or any other unopened gate.',
  publishedImplementation: null,
  publishedApprovalRecord: null,
  publicationState: 'authorized-pending-bounded-publication',
  precedingApproval: {
    gateId: EN_E07_GLOAM_WALKER_GATE.id,
    artifactSha256: EN_E07_GLOAM_WALKER_GATE.artifactSha256,
    assembledArtifactSha256: EN_E07_GLOAM_WALKER_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E07_GLOAM_WALKER_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E07_GLOAM_WALKER_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E07_GLOAM_WALKER_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E07_GLOAM_WALKER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E07_GLOAM_WALKER_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E07_GLOAM_WALKER_GATE.publishedApprovalRecord,
    publishedHandoff: '98d3781b81c8c7ff615ad3cd6562efe12ce63d94',
  },
  artifact: 'enemy-expansion-review/en-e07-living-shadow-nightglass-seer/en-e07-living-shadow-nightglass-seer-full-suite-raw.png',
  artifactSha256: 'ce61d23cdc393d0c709b5af30cdf7fd734d2f2278431d819d28de8248c5c604a',
  assembledArtifact: 'enemy-expansion-review/en-e07-living-shadow-nightglass-seer/en-e07-living-shadow-nightglass-seer-full-suite-complete-b-form.png',
  assembledArtifactSha256: '8889740496b860c5a27dd45d3a825f70b27b648bcc535d9ebbe6ab1f6825286e',
  comparisonArtifact: 'enemy-expansion-review/en-e07-living-shadow-nightglass-seer/en-e07-living-shadow-nightglass-seer-spectral-comparison.png',
  comparisonArtifactSha256: '15b5887fc92a39cf87bf14f40da9d7cb64be9f9d41edd8ace3df75a9fc849800',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e07-living-shadow-nightglass-seer/en-e07-living-shadow-nightglass-seer-full-suite-four-directions-labeled.gif',
      sha256: '54fb94164d0b90a5bbebe684d78ccc3f9f24d527e25c131cf162ff0f32d98828',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e07-living-shadow-nightglass-seer/en-e07-living-shadow-nightglass-seer-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '5c12a4d26affb4b4a3453e4eb7183cbbc138f91257428dc36ffe1bf830103523',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
  },
  candidateFrameDigest: '07909fa9b74df6dd386ca3f6186fe4da26e8d088af99ad7e2dfa2bcdeb10d3fa',
  cursedGhostComparisonDigest: 'c49507d0e6e55adfe8fcf72312ea969fbaab3a120fc37c81ec7de50245d8eb42',
  shadowSlimeComparisonDigest: '04725a8150c31914758c7185f9c9d82c7cc97c666ea306f291d63aba04eccee1',
  mistWeaverComparisonDigest: 'e57a0af441f895fe376f2696d859a97d84564ddf034235d3b237b2cf637520da',
  gloamWalkerComparisonDigest: EN_E07_GLOAM_WALKER_GATE.candidateFrameDigest,
  scope: 'One complete 80-frame Nightglass Seer specialist Living Shadow across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle compresses and tilts the faceted mask, single eye, shoulder yoke, and shutter forearms. Walk uses four bent split-foot steps with counter-rotating yoke and arm frame. Attack closes the connected sight frame, locks the single eye, opens both shutter arms into one wide aperture, and settles through a grounded recovery. Hurt uses a complete white recoil and colored faceted brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and a public Cursed Ghost and Shadow Slime plus approved Mist Weaver and Gloam Walker silhouette comparison together.',
  exclusions: [
    'changes to approved Gloam Walker rendered pixels',
    'changes to any approved EN-E06 source or pixels',
    'public Living Shadow registration',
    'public catalog exposure',
    'asset-pack fixture generation or regeneration',
    'new Cast pixels',
    'new Death pixels',
    'eye beams',
    'gaze cones',
    'portals',
    'runes',
    'divination marks',
    'floor sigils',
    'glow',
    'afterimages',
    'loose shards',
    'trails',
    'projectiles',
    'impact flashes',
    'effects',
    'release',
    'Living Shadow elite',
    'Doppelganger',
    'Will-o-Wisp',
    'Changeling',
    'Kelpie',
    'EN-E08 and later work',
  ],
  nextGate: 'The exact Nightglass Seer candidate is visually approved and its implementation is committed at 325a6f4cfa1418383c93510262a631358add1d5f. Its bounded approval-record, documentation reconciliation, and branch push are authorized. After a clean published reconciliation, the same approved lets do next response opens only one private elite Living Shadow candidate. Do not register Living Shadow, generate fixtures, add effects, release, start another EN-E07 family, or advance EN-E08.',
});

export const EN_E07_NIGHTGLASS_SEER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const WALK_PHASES = deepFreeze([
  { name: 'left-faceted-step', pose: 'walk', bob: 0, step: -1, arm: 1, gaze: -1 },
  { name: 'single-eye-pass', pose: 'walk', bob: -1, step: 0, arm: -1, gaze: 1 },
  { name: 'right-faceted-step', pose: 'walk', bob: 0, step: 1, arm: -1, gaze: 1 },
  { name: 'yoke-frame-settle', pose: 'walk', bob: 1, step: 0, arm: 1, gaze: -1 },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'connected-sight-frame-close', pose: 'focus', bob: 0, step: 0, arm: 0, gaze: 0 },
  { name: 'single-eye-lock', pose: 'lock', bob: -1, step: 0, arm: 1, gaze: 1 },
  { name: 'nightglass-aperture-open', pose: 'aperture', bob: 0, step: 1, arm: -1, gaze: 0 },
  { name: 'grounded-shutter-recovery', pose: 'recover', bob: 1, step: 0, arm: 0, gaze: -1 },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-faceted-recoil', pose: 'hurt', bob: 0, step: -1, arm: 0, gaze: 0, flash: true },
  { name: 'colored-nightglass-brace', pose: 'brace', bob: 1, step: 0, arm: -1, gaze: -1, flash: false },
]);

function createPixels() {
  return new Array(SIZE * SIZE).fill(null);
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Nightglass Seer rectangles must use positive integer geometry.',
    );
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Nightglass Seer authored pixels must remain inside the 24x24 cell.');
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
        assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Nightglass Seer negative space must remain inside the 24x24 cell.');
        pixels[(py * SIZE) + px] = null;
      }
    },
  };
}

function drawFrontHead(paint, rear, phase) {
  const y = phase.bob || 0;
  const shift = phase.gaze || 0;

  paint.rect(10 + shift, 2 + y, 4, 1, COLORS.rim[2]);
  paint.rect(8 + shift, 3 + y, 8, 2, COLORS.rim[1]);
  paint.rect(7, 5 + y, 10, 4, COLORS.void[1]);
  paint.rect(8, 4 + y, 8, 2, COLORS.rim[0]);
  paint.rect(7, 6 + y, 3, 4, COLORS.body[1]);
  paint.rect(14, 6 + y, 3, 4, COLORS.body[0]);
  paint.rect(9, 9 + y, 6, 2, COLORS.void[0]);
  paint.dot(7, 5 + y, COLORS.rim[2]);
  paint.dot(16, 8 + y, COLORS.rim[0]);
  paint.clear(10, 6 + y, 1, 2);
  paint.clear(13, 6 + y, 1, 2);

  if (rear) {
    paint.rect(11, 6 + y, 2, 3, COLORS.rim[1]);
    paint.dot(11, 7 + y, COLORS.rim[2]);
  } else {
    const eyeX = 11 + Math.max(0, shift);
    paint.rect(eyeX, 6 + y, 1, 3, COLORS.eye);
    paint.dot(eyeX + 1, 7 + y, COLORS.rim[2]);
  }
}

function drawFrontArms(paint, phase, y) {
  if (phase.pose === 'focus') {
    paint.rect(4, 10 + y, 5, 4, COLORS.body[1]);
    paint.rect(6, 13 + y, 5, 3, COLORS.shutter[1]);
    paint.rect(8, 15 + y, 4, 2, COLORS.rim[1]);
    paint.rect(15, 10 + y, 5, 4, COLORS.body[0]);
    paint.rect(13, 13 + y, 5, 3, COLORS.shutter[0]);
    paint.rect(12, 15 + y, 4, 2, COLORS.rim[0]);
    paint.dot(11, 16 + y, COLORS.rim[2]);
    paint.dot(12, 16 + y, COLORS.rim[2]);
  } else if (phase.pose === 'lock') {
    paint.rect(4, 10 + y, 5, 5, COLORS.body[1]);
    paint.rect(5, 14 + y, 5, 3, COLORS.shutter[1]);
    paint.rect(15, 9 + y, 5, 4, COLORS.body[0]);
    paint.rect(13, 11 + y, 5, 3, COLORS.shutter[0]);
    paint.rect(12, 9 + y, 3, 4, COLORS.rim[0]);
    paint.dot(12, 8 + y, COLORS.rim[2]);
  } else if (phase.pose === 'aperture') {
    paint.rect(4, 9 + y, 5, 4, COLORS.body[1]);
    paint.rect(2, 7 + y, 5, 3, COLORS.shutter[1]);
    paint.rect(1, 5 + y, 3, 3, COLORS.rim[1]);
    paint.dot(1, 4 + y, COLORS.rim[2]);
    paint.rect(15, 9 + y, 5, 4, COLORS.body[0]);
    paint.rect(17, 7 + y, 5, 3, COLORS.shutter[0]);
    paint.rect(20, 5 + y, 3, 3, COLORS.rim[0]);
    paint.dot(22, 4 + y, COLORS.rim[2]);
  } else if (phase.pose === 'recover') {
    paint.rect(4, 11 + y, 5, 5, COLORS.body[1]);
    paint.rect(3, 15 + y, 5, 3, COLORS.shutter[1]);
    paint.rect(15, 11 + y, 5, 5, COLORS.body[0]);
    paint.rect(16, 15 + y, 5, 3, COLORS.shutter[0]);
    paint.dot(4, 18 + y, COLORS.rim[2]);
    paint.dot(19, 18 + y, COLORS.rim[2]);
  } else {
    const swing = phase.arm || 0;
    paint.rect(4, 10 + y, 5, 5, COLORS.body[1]);
    paint.rect(3, 14 + y + Math.max(swing, 0), 5, 3, COLORS.shutter[1]);
    paint.rect(5, 16 + y + Math.max(swing, 0), 4, 2, COLORS.rim[1]);
    paint.rect(15, 10 + y, 5, 5, COLORS.body[0]);
    paint.rect(16, 14 + y + Math.max(-swing, 0), 5, 3, COLORS.shutter[0]);
    paint.rect(15, 16 + y + Math.max(-swing, 0), 4, 2, COLORS.rim[0]);
  }
}

function drawFrontBody(paint, rear, phase) {
  const y = phase.bob || 0;
  const step = phase.step || 0;

  // Connected shoulder yoke bridges the mask, torso, and both sight-frame arms.
  paint.rect(5, 9 + y, 5, 3, COLORS.body[1]);
  paint.rect(14, 9 + y, 5, 3, COLORS.body[0]);
  paint.rect(8, 9 + y, 8, 3, COLORS.rim[1]);
  paint.dot(5, 8 + y, COLORS.rim[2]);
  paint.dot(18, 8 + y, COLORS.rim[2]);
  paint.rect(8, 11 + y, 8, 7, COLORS.body[0]);
  paint.rect(8, 12 + y, 2, 5, COLORS.rim[1]);
  paint.rect(14, 12 + y, 2, 5, COLORS.body[1]);
  paint.rect(9, 17 + y, 6, 3, COLORS.void[0]);
  paint.clear(11, 13 + y, 2, 3);
  if (rear) {
    paint.rect(11, 11 + y, 2, 2, COLORS.rim[1]);
    paint.rect(11, 16 + y, 2, 3, COLORS.rim[0]);
  } else {
    paint.dot(10, 12 + y, COLORS.rim[2]);
    paint.dot(13, 16 + y, COLORS.rim[0]);
  }

  drawFrontArms(paint, phase, y);

  // Bent split legs and wedge feet keep the specialist grounded and non-robed.
  const leftX = 7 + Math.min(step, 0);
  const rightX = 13 + Math.max(step, 0);
  paint.rect(leftX, 17, 4, 4, COLORS.body[1]);
  paint.rect(rightX, 17, 4, 4, COLORS.body[0]);
  paint.rect(leftX - 2, 20, 5, 3, COLORS.shutter[1]);
  paint.rect(rightX + 1, 20, 5, 3, COLORS.shutter[0]);
  paint.rect(leftX - 2, 22, 6, 1, COLORS.rim[1]);
  paint.rect(rightX, 22, 6, 1, COLORS.rim[0]);
  paint.dot(leftX - 2, 21, COLORS.rim[2]);
  paint.dot(rightX + 5, 21, COLORS.rim[2]);
}

function drawRightHead(paint, phase) {
  const y = phase.bob || 0;
  const shift = phase.gaze > 0 ? 1 : 0;

  paint.rect(10 + shift, 2 + y, 4, 1, COLORS.rim[2]);
  paint.rect(8 + shift, 3 + y, 8, 2, COLORS.rim[1]);
  paint.rect(6, 5 + y, 11, 4, COLORS.void[1]);
  paint.rect(7, 4 + y, 9, 2, COLORS.rim[0]);
  paint.rect(6, 6 + y, 4, 4, COLORS.body[1]);
  paint.rect(14, 6 + y, 4, 4, COLORS.body[0]);
  paint.rect(9, 9 + y, 7, 2, COLORS.void[0]);
  paint.clear(12, 6 + y, 2, 2);
  paint.rect(16, 6 + y, 1, 3, COLORS.eye);
  paint.dot(17, 7 + y, COLORS.rim[2]);
  paint.dot(6, 5 + y, COLORS.rim[2]);
}

function drawRightArms(paint, phase, y) {
  if (phase.pose === 'focus') {
    paint.rect(5, 10 + y, 5, 5, COLORS.body[1]);
    paint.rect(8, 13 + y, 5, 3, COLORS.shutter[1]);
    paint.rect(14, 10 + y, 5, 4, COLORS.body[0]);
    paint.rect(12, 13 + y, 5, 3, COLORS.shutter[0]);
    paint.dot(12, 16 + y, COLORS.rim[2]);
  } else if (phase.pose === 'lock') {
    paint.rect(5, 10 + y, 5, 5, COLORS.body[1]);
    paint.rect(6, 14 + y, 5, 3, COLORS.shutter[1]);
    paint.rect(14, 9 + y, 5, 4, COLORS.body[0]);
    paint.rect(17, 7 + y, 4, 4, COLORS.shutter[0]);
    paint.rect(19, 6 + y, 3, 2, COLORS.rim[0]);
    paint.dot(21, 5 + y, COLORS.rim[2]);
  } else if (phase.pose === 'aperture') {
    paint.rect(5, 10 + y, 5, 5, COLORS.body[1]);
    paint.rect(4, 14 + y, 5, 3, COLORS.shutter[1]);
    paint.rect(14, 9 + y, 5, 4, COLORS.body[0]);
    paint.rect(18, 7 + y, 4, 4, COLORS.shutter[0]);
    paint.rect(20, 5 + y, 3, 3, COLORS.rim[0]);
    paint.dot(22, 4 + y, COLORS.rim[2]);
  } else if (phase.pose === 'recover') {
    paint.rect(5, 11 + y, 5, 5, COLORS.body[1]);
    paint.rect(4, 15 + y, 5, 3, COLORS.shutter[1]);
    paint.rect(14, 11 + y, 5, 5, COLORS.body[0]);
    paint.rect(17, 15 + y, 5, 3, COLORS.shutter[0]);
    paint.dot(20, 18 + y, COLORS.rim[2]);
  } else {
    const swing = phase.arm || 0;
    paint.rect(5, 10 + y, 5, 5, COLORS.body[1]);
    paint.rect(4, 14 + y + Math.max(swing, 0), 5, 3, COLORS.shutter[1]);
    paint.rect(14, 10 + y, 5, 5, COLORS.body[0]);
    paint.rect(17, 14 + y + Math.max(-swing, 0), 5, 3, COLORS.shutter[0]);
    paint.dot(20, 17 + y + Math.max(-swing, 0), COLORS.rim[2]);
  }
}

function drawRightBody(paint, phase) {
  const y = phase.bob || 0;
  const step = phase.step || 0;

  paint.rect(6, 9 + y, 5, 3, COLORS.body[1]);
  paint.rect(13, 9 + y, 6, 3, COLORS.body[0]);
  paint.rect(9, 9 + y, 7, 3, COLORS.rim[1]);
  paint.dot(6, 8 + y, COLORS.rim[2]);
  paint.dot(18, 8 + y, COLORS.rim[2]);
  paint.rect(8, 11 + y, 9, 7, COLORS.body[0]);
  paint.rect(8, 12 + y, 2, 5, COLORS.rim[1]);
  paint.rect(15, 12 + y, 2, 5, COLORS.body[1]);
  paint.clear(12, 13 + y, 2, 3);
  paint.rect(10, 17 + y, 6, 3, COLORS.void[0]);
  paint.dot(14, 16 + y, COLORS.rim[0]);

  drawRightArms(paint, phase, y);

  const farX = 7 + Math.min(step, 0);
  const nearX = 13 + Math.max(step, 0);
  paint.rect(farX, 17, 4, 4, COLORS.body[1]);
  paint.rect(nearX, 17, 4, 4, COLORS.body[0]);
  paint.rect(farX - 2, 20, 5, 3, COLORS.shutter[1]);
  paint.rect(nearX + 1, 20, 5, 3, COLORS.shutter[0]);
  paint.rect(farX - 2, 22, 6, 1, COLORS.rim[1]);
  paint.rect(nearX, 22, 6, 1, COLORS.rim[0]);
  paint.dot(farX - 2, 21, COLORS.rim[2]);
  paint.dot(nearX + 5, 21, COLORS.rim[2]);
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
    assert(frame === 0 || frame === 1, 'Nightglass Seer Idle frame ' + frame + ' is out of range.');
    phase = frame === 0
      ? { name: 'single-eye-vigil', pose: 'idle', bob: 0, step: 0, arm: -1, gaze: -1 }
      : { name: 'nightglass-mask-breath', pose: 'idle', bob: 1, step: 0, arm: 1, gaze: 1 };
  } else if (animation === 'walk') {
    phase = WALK_PHASES[frame];
  } else if (animation === 'attack' || animation === 'cast') {
    phase = ATTACK_PHASES[frame];
  } else if (animation === 'hurt') {
    phase = HURT_PHASES[frame];
  } else if (animation === 'death') {
    phase = HURT_PHASES[EN_E07_NIGHTGLASS_SEER_DEATH_SOURCE_FRAMES[frame]];
  }
  assert(phase, 'Nightglass Seer animation ' + animation + ' frame ' + frame + ' is out of range.');

  let pixels = createPixels();
  const paint = painter(pixels);
  if (canonicalDirection === 'right') {
    drawRightHead(paint, phase);
    drawRightBody(paint, phase);
  } else {
    const rear = canonicalDirection === 'up';
    drawFrontHead(paint, rear, phase);
    drawFrontBody(paint, rear, phase);
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

export function renderEnE07NightglassSeerFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Nightglass Seer rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Nightglass Seer direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'living-shadow',
    variant: 'nightglass-seer',
    direction,
    animation,
    frame,
    phase: phase.name,
    nightglassSeerGate: EN_E07_NIGHTGLASS_SEER_GATE.id,
    approvedPrecedingGate: EN_E07_GLOAM_WALKER_GATE.id,
    alphaPolicy: EN_E07_NIGHTGLASS_SEER_DATA.alphaPolicy,
    effectBoundary: EN_E07_NIGHTGLASS_SEER_DATA.effectBoundary,
  });
}

export const EN_E07_NIGHTGLASS_SEER_RENDERER = deepFreeze({
  key: 'en-e07-living-shadow-nightglass-seer-v1',
  chassis: EN_E07_NIGHTGLASS_SEER_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'living-shadow', 'The EN-E07 Nightglass Seer renderer is restricted to Living Shadow.');
    assert(variant.id === 'nightglass-seer', 'The EN-E07 Nightglass Seer renderer is restricted to Nightglass Seer.');
    return renderEnE07NightglassSeerFrame(context, direction, animation.id, frame);
  },
});

const NIGHTGLASS_SEER_VARIANT = deepFreeze({
  id: 'nightglass-seer',
  name: 'Nightglass Seer',
  role: EN_E07_NIGHTGLASS_SEER_CONTRACT.role,
  status: EN_E07_NIGHTGLASS_SEER_CONTRACT.state,
  brief: 'An approved complete specialist Living Shadow with a broad faceted mask, one vertical eye, connected shoulder yoke and sight-frame arms, hollow chest aperture, bent split legs, and planted wedge feet; beams, gaze cones, portals, runes, glow, and afterimages remain external.',
  rendererData: EN_E07_NIGHTGLASS_SEER_DATA,
});

export const EN_E07_NIGHTGLASS_SEER_FAMILY = deepFreeze({
  id: 'living-shadow',
  name: 'Living Shadow Nightglass Seer Review',
  sliceId: 'EN-E07',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E07_NIGHTGLASS_SEER_CONTRACT.chassis,
  rendererKey: EN_E07_NIGHTGLASS_SEER_RENDERER.key,
  variants: [NIGHTGLASS_SEER_VARIANT],
  rendererData: {
    contractCard: EN_E07_LIVING_SHADOW_CONTRACT_CARD.id,
    approvedPrecedingGate: EN_E07_GLOAM_WALKER_GATE.id,
    activeGate: EN_E07_NIGHTGLASS_SEER_GATE.id,
  },
  review: {
    baselineVariant: 'nightglass-seer',
    scale: 8,
    notes: 'Visually approved as one grounded faceted Nightglass Seer against public Cursed Ghost and Shadow Slime plus approved Mist Weaver and Gloam Walker. The exact implementation is committed locally and its bounded publication is authorized. Keep registration, fixtures, effects, elite Living Shadow artwork, Doppelganger, and later Wave 2 work separate.',
  },
});

export const EN_E07_NIGHTGLASS_SEER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E07_NIGHTGLASS_SEER_RENDERER],
  families: [EN_E07_NIGHTGLASS_SEER_FAMILY],
});
