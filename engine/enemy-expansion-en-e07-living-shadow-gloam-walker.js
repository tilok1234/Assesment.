import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E06_RIVERCROWN_MUSE_GATE } from './enemy-expansion-en-e06-nymph-rivercrown-muse.js';

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
  claw: ['#51436f', '#2b2544', '#8975ad'],
  eye: '#d6f3ef',
  flash: '#f4f4f4',
});

export const EN_E07_LIVING_SHADOW_CONTRACT_CARD = deepFreeze({
  id: 'en-e07-living-shadow-v1',
  sliceId: 'EN-E07',
  family: 'living-shadow',
  familyName: 'Living Shadow',
  roleOrder: ['common', 'specialist', 'elite'],
  activeVariant: {
    id: 'gloam-walker',
    name: 'Gloam Walker',
    role: 'common',
    status: 'implemented-full-approved',
  },
  activeSpecialist: {
    id: 'nightglass-seer',
    name: 'Nightglass Seer',
    role: 'specialist',
    status: 'implemented-full-approved',
  },
  activeElite: {
    id: 'hollowcrown-regent',
    name: 'Hollowcrown Regent',
    role: 'elite',
    status: 'implemented-full-approved',
  },
  deferredRoles: [],
  styleContract: 'Use chunky one-to-three-pixel forms, a tight dark-violet ramp, hard alpha, and connected negative-space cutouts. Preserve readable head, shoulder, arm, split-leg, and foot anatomy at native 24x24 scale.',
  effectBoundary: 'Detached wisps, floor pools, smoke, afterimages, projectiles, claw trails, glow, and impact flashes remain external.',
});

export const EN_E07_GLOAM_WALKER_CONTRACT = deepFreeze({
  sliceId: 'EN-E07',
  family: 'living-shadow',
  variant: 'gloam-walker',
  role: 'common',
  state: 'implemented-complete-motion-approved',
  chassis: 'gaunt-hollow-face-split-leg-living-shadow-v1',
  silhouette: 'A tall gaunt grounded humanoid absence with a hooked crown, hollow face, angular shoulders, long connected claw arms, a pinched waist, two clearly split legs, and broad planted shadow feet. It must not read as the public Ghost floating robe, the Shadow Slime blob, or an approved dark robed caster.',
  identity: 'A restrained violet-black body ramp, connected pale eye slits, a transparent face cavity, a narrow transparent torso rift, angular rim planes, and solid split feet establish a self-contained common Living Shadow without detached smoke or glow.',
  effectBoundary: 'Detached wisps, floor pools, smoke, afterimages, projectiles, claw trails, glow, loose shadow fragments, and impact flashes remain external.',
});

export const EN_E07_GLOAM_WALKER_DATA = deepFreeze({
  actor: {
    species: 'living-shadow',
    bodyBuild: 'tall-gaunt-humanoid',
    skin: 'violet-black-shadow',
    hairStyle: 'hooked-shadow-crown',
    hairColor: 'gloam-violet',
    expression: 'hollow-vigil',
    faceDetail: 'transparent-face-cavity-with-connected-eye-slits',
    headgear: 'none',
    outfit: 'self-shadow-angular-body',
    outfitColor: 'abyss-violet',
    outfitTier: 'tier1',
    weapon: 'connected-shadow-claws',
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
  gloamWalker: COLORS,
  alphaPolicy: 'binary-connected-hooked-crown-hollow-face-angular-shoulders-long-claws-pinched-waist-split-legs-and-planted-feet',
  effectBoundary: 'external-detached-wisps-floor-pools-smoke-afterimages-projectiles-claw-trails-glow-loose-shadow-fragments-and-impact-flashes',
  bakedEffects: [],
});

export const EN_E07_GLOAM_WALKER_GATE = deepFreeze({
  id: 'en-e07-living-shadow-gloam-walker-full-v1',
  status: 'approved',
  baseCheckpoint: 'd785fe56e7d8c98243f948fce615885d5a04fbc3',
  authorizedOn: '2026-08-10',
  authorizationEvidence: 'After the exact Rivercrown Muse was visually approved and its implementation and approval commits were pushed, the designer said: lets do next. Rivercrown completes the fifth and final EN-E06 family; the frozen plan queues EN-E07 next and names Living Shadow priority-first. Under the one-complete-sprite cadence, this authorizes only one private common Living Shadow Gloam Walker 80-frame candidate.',
  approvedOn: '2026-08-10',
  approvalEvidence: 'After the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, the public Cursed Ghost and Shadow Slime plus approved Mist Weaver comparison, and paired GIF evidence were presented, and the three exact PNG review boards were opened together in Aseprite, the designer replied: aaprovced. Approval applies only to candidate digest 131a95a106a36dea2f6879611c8e14e3aa077012dcbd1bd32e111c45658ca3f9; Living Shadow registration, fixtures, effects, later roles and families, release, and EN-E08 remain separate gates.',
  approvedImplementation: 'a46f59c1cb0bb751760f2776fe60b5c489806c94',
  publicationAuthorizedOn: '2026-08-10',
  publicationAuthorizationEvidence: 'The designer said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact artifact or digest. It does not authorize registration, fixtures, effects, later roles or families, release, or any other unopened gate.',
  publishedImplementation: 'a46f59c1cb0bb751760f2776fe60b5c489806c94',
  publishedApprovalRecord: '848c7192b6dc2cac8b7ab2dc8725d3859447715d',
  initialPublishedHandoff: '00d5b436c7398312a5f3a05a482b4cf34cee9ba5',
  publicationState: 'published',
  precedingApproval: {
    gateId: EN_E06_RIVERCROWN_MUSE_GATE.id,
    artifactSha256: EN_E06_RIVERCROWN_MUSE_GATE.artifactSha256,
    assembledArtifactSha256: EN_E06_RIVERCROWN_MUSE_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E06_RIVERCROWN_MUSE_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E06_RIVERCROWN_MUSE_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E06_RIVERCROWN_MUSE_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E06_RIVERCROWN_MUSE_GATE.candidateFrameDigest,
    publishedImplementation: EN_E06_RIVERCROWN_MUSE_GATE.publishedImplementation,
    approvalRecord: 'ca82f079ff84934edc4ab51a8d406050b9083d2a',
    currentReconciliation: 'd785fe56e7d8c98243f948fce615885d5a04fbc3',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e07-living-shadow-gloam-walker/en-e07-living-shadow-gloam-walker-full-suite-raw.png',
  artifactSha256: 'a3389c510a0d8c16a50a19be6eaebac15d452a056531d71c807e778767975e76',
  assembledArtifact: 'enemy-expansion-review/en-e07-living-shadow-gloam-walker/en-e07-living-shadow-gloam-walker-full-suite-complete-b-form.png',
  assembledArtifactSha256: '53c13282fe6d5b3ad9ddad19bd1047cd023fc8bb0392416d737ce47e27869b02',
  comparisonArtifact: 'enemy-expansion-review/en-e07-living-shadow-gloam-walker/en-e07-living-shadow-gloam-walker-spectral-comparison.png',
  comparisonArtifactSha256: '75609882aed2b04749e4efb30fbc77df749895549b0fd11cc42f38eb8c421527',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e07-living-shadow-gloam-walker/en-e07-living-shadow-gloam-walker-full-suite-four-directions-labeled.gif',
      sha256: '54f3262ce694e6696d3af2a40783cce32b2555de7c5cd72acd18900fa1c1e8a8',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e07-living-shadow-gloam-walker/en-e07-living-shadow-gloam-walker-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '862d28ed3a938a7315146b58706bce4e37f11e9abbfc50c720e63b83be5d9659',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
  },
  candidateFrameDigest: '131a95a106a36dea2f6879611c8e14e3aa077012dcbd1bd32e111c45658ca3f9',
  cursedGhostComparisonDigest: 'c49507d0e6e55adfe8fcf72312ea969fbaab3a120fc37c81ec7de50245d8eb42',
  shadowSlimeComparisonDigest: '04725a8150c31914758c7185f9c9d82c7cc97c666ea306f291d63aba04eccee1',
  mistWeaverComparisonDigest: EN_E06_RIVERCROWN_MUSE_GATE.mistWeaverComparisonDigest,
  scope: 'One complete 80-frame Gloam Walker common Living Shadow across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle compresses and releases the hooked crown, hollow face, shoulders, and long claws. Walk uses four stalking split-foot steps with opposed arm drag. Attack coils both connected claws, extends one long reach, opens into a two-arm rake, and closes through a low recovery. Hurt uses a complete white recoil and colored hollow-body brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and a public Cursed Ghost and Shadow Slime plus approved Mist Weaver silhouette comparison together.',
  exclusions: [
    'changes to any approved EN-E06 source or pixels',
    'Nymph registration',
    'public Living Shadow registration',
    'public catalog exposure',
    'asset-pack fixture generation or regeneration',
    'new Cast pixels',
    'new Death pixels',
    'detached wisps',
    'floor pools',
    'smoke',
    'afterimages',
    'projectiles',
    'claw trails',
    'glow',
    'loose shadow fragments',
    'impact flashes',
    'effects',
    'release',
    'Living Shadow specialist or elite',
    'Doppelganger',
    'Will-o-Wisp',
    'Changeling',
    'Kelpie',
    'EN-E08 and later work',
  ],
  nextGate: 'The exact Gloam Walker candidate is visually approved and published on codex/en-e07-living-shadow-gloam-walker with implementation a46f59c1cb0bb751760f2776fe60b5c489806c94, approval record 848c7192b6dc2cac8b7ab2dc8725d3859447715d, and initial published handoff 00d5b436c7398312a5f3a05a482b4cf34cee9ba5. Stop at this clean published checkpoint. Do not register Living Shadow, generate fixtures, add effects, release, start another EN-E07 role or family, or advance EN-E08 without another explicit gate.',
});

export const EN_E07_GLOAM_WALKER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const WALK_PHASES = deepFreeze([
  { name: 'left-split-foot-stalk', pose: 'walk', bob: 0, step: -1, arm: 1 },
  { name: 'hooked-crown-pass', pose: 'walk', bob: -1, step: 0, arm: -1 },
  { name: 'right-split-foot-stalk', pose: 'walk', bob: 0, step: 1, arm: -1 },
  { name: 'long-claw-drag', pose: 'walk', bob: 1, step: 0, arm: 1 },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'connected-claw-coil', pose: 'coil', bob: 0, step: 0, arm: 0 },
  { name: 'long-shadow-reach', pose: 'reach', bob: -1, step: 0, arm: 1 },
  { name: 'two-arm-eclipse-rake', pose: 'rake', bob: 0, step: 1, arm: -1 },
  { name: 'low-gloam-recovery', pose: 'recover', bob: 1, step: 0, arm: 0 },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-hollow-recoil', pose: 'hurt', bob: 0, step: -1, arm: 0, flash: true },
  { name: 'colored-split-foot-brace', pose: 'brace', bob: 1, step: 0, arm: -1, flash: false },
]);

function createPixels() {
  return new Array(SIZE * SIZE).fill(null);
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Gloam Walker rectangles must use positive integer geometry.',
    );
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Gloam Walker authored pixels must remain inside the 24x24 cell.');
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
        assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Gloam Walker negative space must remain inside the 24x24 cell.');
        pixels[(py * SIZE) + px] = null;
      }
    },
  };
}

function drawFrontHead(paint, rear, phase) {
  const y = phase.bob || 0;
  const lean = phase.arm > 0 ? 1 : 0;

  // Hooked crown and a closed outer hood ring.
  paint.rect(10 + lean, 2 + y, 4, 1, COLORS.rim[2]);
  paint.rect(8 + lean, 3 + y, 8, 2, COLORS.rim[1]);
  paint.rect(7, 5 + y, 10, 2, COLORS.void[1]);
  paint.rect(7, 7 + y, 3, 3, COLORS.body[0]);
  paint.rect(14, 7 + y, 3, 3, COLORS.body[1]);
  paint.rect(9, 9 + y, 6, 2, COLORS.void[0]);
  paint.dot(7, 4 + y, COLORS.rim[0]);
  paint.dot(16, 5 + y, COLORS.rim[2]);

  if (rear) {
    paint.rect(10, 7 + y, 4, 3, COLORS.void[1]);
    paint.rect(11, 7 + y, 2, 4, COLORS.rim[1]);
    paint.dot(12, 8 + y, COLORS.rim[2]);
  } else {
    // The eye slits touch the hood sidewalls, leaving one connected transparent cavity.
    paint.dot(10, 7 + y, COLORS.eye);
    paint.dot(13, 7 + y, COLORS.eye);
    paint.dot(10, 8 + y, COLORS.rim[0]);
    paint.dot(13, 8 + y, COLORS.rim[0]);
  }
}

function drawFrontArms(paint, phase, y) {
  const pose = phase.pose;
  if (pose === 'coil') {
    paint.rect(5, 10 + y, 4, 4, COLORS.body[1]);
    paint.rect(15, 10 + y, 4, 4, COLORS.body[0]);
    paint.rect(7, 13 + y, 5, 2, COLORS.claw[0]);
    paint.rect(12, 13 + y, 5, 2, COLORS.claw[1]);
    paint.dot(10, 15 + y, COLORS.rim[0]);
    paint.dot(13, 15 + y, COLORS.rim[2]);
  } else if (pose === 'reach') {
    paint.rect(5, 10 + y, 4, 5, COLORS.body[1]);
    paint.rect(4, 14 + y, 4, 3, COLORS.claw[1]);
    paint.rect(15, 10 + y, 4, 3, COLORS.body[0]);
    paint.rect(18, 11 + y, 3, 2, COLORS.claw[0]);
    paint.rect(20, 12 + y, 2, 2, COLORS.claw[2]);
    paint.dot(21, 14 + y, COLORS.rim[2]);
  } else if (pose === 'rake') {
    paint.rect(5, 9 + y, 4, 4, COLORS.body[1]);
    paint.rect(3, 7 + y, 4, 3, COLORS.claw[0]);
    paint.rect(1, 6 + y, 3, 2, COLORS.rim[1]);
    paint.dot(1, 5 + y, COLORS.rim[2]);
    paint.rect(15, 9 + y, 4, 4, COLORS.body[0]);
    paint.rect(17, 7 + y, 4, 3, COLORS.claw[0]);
    paint.rect(20, 6 + y, 3, 2, COLORS.rim[0]);
    paint.dot(22, 5 + y, COLORS.rim[2]);
  } else if (pose === 'recover') {
    paint.rect(5, 11 + y, 4, 5, COLORS.body[1]);
    paint.rect(4, 15 + y, 4, 3, COLORS.claw[1]);
    paint.dot(5, 18 + y, COLORS.rim[0]);
    paint.rect(15, 11 + y, 4, 5, COLORS.body[0]);
    paint.rect(16, 15 + y, 4, 3, COLORS.claw[0]);
    paint.dot(18, 18 + y, COLORS.rim[2]);
  } else {
    const swing = phase.arm || 0;
    paint.rect(5, 10 + y, 4, 5, COLORS.body[1]);
    paint.rect(4, 14 + y + Math.max(swing, 0), 4, 3, COLORS.claw[1]);
    paint.dot(5, 17 + y + Math.max(swing, 0), COLORS.rim[0]);
    paint.rect(15, 10 + y, 4, 5, COLORS.body[0]);
    paint.rect(16, 14 + y + Math.max(-swing, 0), 4, 3, COLORS.claw[0]);
    paint.dot(18, 17 + y + Math.max(-swing, 0), COLORS.rim[2]);
  }
}

function drawFrontBody(paint, rear, phase) {
  const y = phase.bob || 0;
  const step = phase.step || 0;

  paint.rect(6, 9 + y, 4, 3, COLORS.body[1]);
  paint.rect(14, 9 + y, 4, 3, COLORS.body[0]);
  paint.dot(5, 10 + y, COLORS.rim[1]);
  paint.dot(18, 11 + y, COLORS.rim[0]);
  paint.rect(8, 10 + y, 8, 7, COLORS.body[0]);
  paint.rect(8, 11 + y, 2, 5, COLORS.rim[1]);
  paint.rect(14, 11 + y, 2, 5, COLORS.body[1]);
  paint.rect(9, 16 + y, 6, 3, COLORS.void[0]);

  // One narrow transparent torso rift; shoulder and waist bridges keep the actor connected.
  paint.clear(11, 12 + y, 2, 3);
  if (rear) {
    paint.rect(11, 10 + y, 2, 2, COLORS.rim[1]);
    paint.rect(11, 15 + y, 2, 3, COLORS.rim[0]);
  } else {
    paint.dot(10, 11 + y, COLORS.rim[2]);
    paint.dot(13, 15 + y, COLORS.rim[0]);
  }

  drawFrontArms(paint, phase, y);

  // Split legs and broad planted feet prevent a robe or floating-ghost read.
  const leftX = 6 + Math.min(step, 0);
  const rightX = 13 + Math.max(step, 0);
  paint.rect(leftX, 18, 5, 4, COLORS.body[1]);
  paint.rect(rightX, 18, 5, 4, COLORS.body[0]);
  paint.rect(leftX - 1, 21, 6, 2, COLORS.claw[1]);
  paint.rect(rightX, 21, 6, 2, COLORS.claw[0]);
  paint.rect(leftX, 21, 3, 1, COLORS.rim[1]);
  paint.rect(rightX + 2, 21, 3, 1, COLORS.rim[0]);
  paint.dot(leftX - 1, 22, COLORS.rim[2]);
  paint.dot(rightX + 5, 22, COLORS.rim[2]);
}

function drawRightHead(paint, phase) {
  const y = phase.bob || 0;
  const lean = phase.arm > 0 ? 1 : 0;

  paint.rect(9 + lean, 2 + y, 4, 1, COLORS.rim[2]);
  paint.rect(7 + lean, 3 + y, 8, 2, COLORS.rim[1]);
  paint.rect(5, 4 + y, 5, 2, COLORS.void[0]);
  paint.dot(4, 4 + y, COLORS.rim[0]);
  paint.rect(8, 5 + y, 9, 3, COLORS.void[1]);
  paint.rect(9, 8 + y, 8, 3, COLORS.body[0]);
  paint.rect(15, 6 + y, 3, 4, COLORS.body[1]);
  paint.clear(14, 6 + y, 2, 2);
  paint.dot(16, 6 + y, COLORS.eye);
  paint.dot(16, 7 + y, COLORS.rim[0]);
  paint.rect(10, 9 + y, 5, 2, COLORS.void[0]);
}

function drawRightArms(paint, phase, y) {
  const pose = phase.pose;
  if (pose === 'coil') {
    paint.rect(6, 10 + y, 4, 5, COLORS.body[1]);
    paint.rect(8, 13 + y, 5, 2, COLORS.claw[1]);
    paint.rect(14, 10 + y, 4, 4, COLORS.body[0]);
    paint.rect(12, 13 + y, 5, 2, COLORS.claw[0]);
    paint.dot(12, 15 + y, COLORS.rim[2]);
  } else if (pose === 'reach') {
    paint.rect(6, 10 + y, 4, 6, COLORS.body[1]);
    paint.rect(5, 15 + y, 4, 3, COLORS.claw[1]);
    paint.rect(14, 10 + y, 5, 3, COLORS.body[0]);
    paint.rect(18, 11 + y, 3, 2, COLORS.claw[0]);
    paint.rect(20, 12 + y, 3, 2, COLORS.claw[2]);
    paint.dot(22, 14 + y, COLORS.rim[2]);
  } else if (pose === 'rake') {
    paint.rect(6, 10 + y, 4, 5, COLORS.body[1]);
    paint.rect(5, 14 + y, 4, 3, COLORS.claw[1]);
    paint.rect(14, 9 + y, 5, 4, COLORS.body[0]);
    paint.rect(18, 7 + y, 3, 3, COLORS.claw[0]);
    paint.rect(20, 5 + y, 3, 3, COLORS.rim[0]);
    paint.dot(22, 4 + y, COLORS.rim[2]);
  } else if (pose === 'recover') {
    paint.rect(6, 11 + y, 4, 5, COLORS.body[1]);
    paint.rect(5, 15 + y, 4, 3, COLORS.claw[1]);
    paint.rect(14, 11 + y, 5, 5, COLORS.body[0]);
    paint.rect(17, 15 + y, 4, 3, COLORS.claw[0]);
    paint.dot(19, 18 + y, COLORS.rim[2]);
  } else {
    const swing = phase.arm || 0;
    paint.rect(6, 10 + y, 4, 5, COLORS.body[1]);
    paint.rect(5, 14 + y + Math.max(swing, 0), 4, 3, COLORS.claw[1]);
    paint.dot(6, 17 + y + Math.max(swing, 0), COLORS.rim[0]);
    paint.rect(14, 10 + y, 5, 5, COLORS.body[0]);
    paint.rect(17, 14 + y + Math.max(-swing, 0), 4, 3, COLORS.claw[0]);
    paint.dot(19, 17 + y + Math.max(-swing, 0), COLORS.rim[2]);
  }
}

function drawRightBody(paint, phase) {
  const y = phase.bob || 0;
  const step = phase.step || 0;

  paint.rect(7, 9 + y, 5, 3, COLORS.body[1]);
  paint.rect(11, 9 + y, 7, 3, COLORS.body[0]);
  paint.dot(6, 10 + y, COLORS.rim[1]);
  paint.dot(18, 11 + y, COLORS.rim[0]);
  paint.rect(8, 10 + y, 9, 7, COLORS.body[0]);
  paint.rect(8, 11 + y, 2, 5, COLORS.rim[1]);
  paint.rect(15, 11 + y, 2, 5, COLORS.body[1]);
  paint.clear(11, 12 + y, 2, 3);
  paint.rect(10, 16 + y, 6, 3, COLORS.void[0]);
  paint.dot(14, 15 + y, COLORS.rim[0]);

  drawRightArms(paint, phase, y);

  const farX = 7 + Math.min(step, 0);
  const nearX = 13 + Math.max(step, 0);
  paint.rect(farX, 18, 5, 4, COLORS.body[1]);
  paint.rect(nearX, 18, 5, 4, COLORS.body[0]);
  paint.rect(farX - 1, 21, 6, 2, COLORS.claw[1]);
  paint.rect(nearX, 21, 6, 2, COLORS.claw[0]);
  paint.rect(farX, 21, 3, 1, COLORS.rim[1]);
  paint.rect(nearX + 2, 21, 3, 1, COLORS.rim[0]);
  paint.dot(farX - 1, 22, COLORS.rim[2]);
  paint.dot(nearX + 5, 22, COLORS.rim[2]);
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
    assert(frame === 0 || frame === 1, 'Gloam Walker Idle frame ' + frame + ' is out of range.');
    phase = frame === 0
      ? { name: 'hooked-crown-vigil', pose: 'idle', bob: 0, step: 0, arm: -1 }
      : { name: 'hollow-body-breath', pose: 'idle', bob: 1, step: 0, arm: 1 };
  } else if (animation === 'walk') {
    phase = WALK_PHASES[frame];
  } else if (animation === 'attack' || animation === 'cast') {
    phase = ATTACK_PHASES[frame];
  } else if (animation === 'hurt') {
    phase = HURT_PHASES[frame];
  } else if (animation === 'death') {
    phase = HURT_PHASES[EN_E07_GLOAM_WALKER_DEATH_SOURCE_FRAMES[frame]];
  }
  assert(phase, 'Gloam Walker animation ' + animation + ' frame ' + frame + ' is out of range.');

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

export function renderEnE07GloamWalkerFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Gloam Walker rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Gloam Walker direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'living-shadow',
    variant: 'gloam-walker',
    direction,
    animation,
    frame,
    phase: phase.name,
    gloamWalkerGate: EN_E07_GLOAM_WALKER_GATE.id,
    approvedPrecedingGate: EN_E06_RIVERCROWN_MUSE_GATE.id,
    alphaPolicy: EN_E07_GLOAM_WALKER_DATA.alphaPolicy,
    effectBoundary: EN_E07_GLOAM_WALKER_DATA.effectBoundary,
  });
}

export const EN_E07_GLOAM_WALKER_RENDERER = deepFreeze({
  key: 'en-e07-living-shadow-gloam-walker-v1',
  chassis: EN_E07_GLOAM_WALKER_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'living-shadow', 'The EN-E07 Gloam Walker renderer is restricted to Living Shadow.');
    assert(variant.id === 'gloam-walker', 'The EN-E07 Gloam Walker renderer is restricted to Gloam Walker.');
    return renderEnE07GloamWalkerFrame(context, direction, animation.id, frame);
  },
});

const GLOAM_WALKER_VARIANT = deepFreeze({
  id: 'gloam-walker',
  name: 'Gloam Walker',
  role: EN_E07_GLOAM_WALKER_CONTRACT.role,
  status: EN_E07_GLOAM_WALKER_CONTRACT.state,
  brief: 'An approved complete common Living Shadow with a hooked crown, hollow face, angular shoulders, long connected claw arms, a pinched transparent torso rift, split legs, and broad planted feet; all wisps, pools, trails, smoke, glow, and impacts remain external.',
  rendererData: EN_E07_GLOAM_WALKER_DATA,
});

export const EN_E07_GLOAM_WALKER_FAMILY = deepFreeze({
  id: 'living-shadow',
  name: 'Living Shadow Gloam Walker Review',
  sliceId: 'EN-E07',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E07_GLOAM_WALKER_CONTRACT.chassis,
  rendererKey: EN_E07_GLOAM_WALKER_RENDERER.key,
  variants: [GLOAM_WALKER_VARIANT],
  rendererData: {
    contractCard: EN_E07_LIVING_SHADOW_CONTRACT_CARD.id,
    approvedPrecedingGate: EN_E06_RIVERCROWN_MUSE_GATE.id,
    activeGate: EN_E07_GLOAM_WALKER_GATE.id,
  },
  review: {
    baselineVariant: 'gloam-walker',
    scale: 8,
    notes: 'Visually approved and published as one complete grounded Gloam Walker against public Cursed Ghost and Shadow Slime plus approved Mist Weaver. Keep registration, fixtures, effects, later Living Shadows, Doppelganger, and later Wave 2 work separate.',
  },
});

export const EN_E07_GLOAM_WALKER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E07_GLOAM_WALKER_RENDERER],
  families: [EN_E07_GLOAM_WALKER_FAMILY],
});
