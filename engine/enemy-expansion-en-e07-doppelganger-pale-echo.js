import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E07_HOLLOWCROWN_REGENT_GATE,
} from './enemy-expansion-en-e07-living-shadow-hollowcrown-regent.js';

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
  skin: ['#c9b9b2', '#97898e', '#e3d2c5'],
  hair: ['#514a5f', '#302d3b', '#756c82'],
  cloth: ['#596777', '#35404f', '#8393a2'],
  accent: ['#8d5368', '#63384d', '#bd7890'],
  eye: '#d8eef2',
  flash: '#f4f4f4',
});

export const EN_E07_DOPPELGANGER_CONTRACT_CARD = deepFreeze({
  id: 'en-e07-doppelganger-v1',
  sliceId: 'EN-E07',
  family: 'doppelganger',
  familyName: 'Doppelganger',
  roleOrder: ['common', 'specialist', 'elite'],
  activeVariant: {
    id: 'pale-echo',
    name: 'Pale Echo',
    role: 'common',
    status: 'implemented-full-approved',
  },
  activeSpecialist: {
    id: 'falseface-adept',
    name: 'Falseface Adept',
    role: 'specialist',
    status: 'implemented-full-approved',
  },
  activeElite: {
    id: 'grand-pretender',
    name: 'Grand Pretender',
    role: 'elite',
    status: 'implemented-full-candidate',
  },
  deferredRoles: [],
  styleContract: 'Use chunky one-to-three-pixel humanoid forms, hard alpha, an authored neutral default body, readable face and limb anatomy, and controlled asymmetry. Do not copy a player or public enemy sprite into the authored sheet.',
  effectBoundary: 'Copied actor silhouettes, mirror doubles, reflection planes, peeling faces, loose skin ribbons, afterimages, glow, particles, projectiles, and impact flashes remain external.',
});

export const EN_E07_PALE_ECHO_CONTRACT = deepFreeze({
  sliceId: 'EN-E07',
  family: 'doppelganger',
  variant: 'pale-echo',
  role: 'common',
  state: 'implemented-complete-motion-approved',
  chassis: 'asymmetric-borrowed-fringe-offset-face-split-tunic-mimic-hand-grounded-humanoid-v1',
  silhouette: 'A slim grounded authored humanoid with an uneven borrowed fringe, mismatched shoulder heights, offset paired eyes, a split short tunic, one ordinary hand, one connected long-finger mimic hand, separated legs, and broad boots. It must not collapse into a Bandit, Cultist robe, Dark Elf, Living Shadow, or copied actor.',
  identity: 'Pale gray-rose skin, charcoal-violet hair, slate cloth, faded wine asymmetry, a subtly offset face, reversed torso panels, and one lengthening connected hand establish a self-contained default Doppelganger form without promising runtime copying in the assembler.',
  effectBoundary: EN_E07_DOPPELGANGER_CONTRACT_CARD.effectBoundary,
});

export const EN_E07_PALE_ECHO_DATA = deepFreeze({
  actor: {
    species: 'authored-doppelganger-default',
    bodyBuild: 'slim-grounded-humanoid',
    skin: 'pale-gray-rose',
    hairStyle: 'uneven-borrowed-fringe',
    hairColor: 'charcoal-violet',
    expression: 'offset-paired-gaze',
    faceDetail: 'asymmetric-cheek-seam-and-offset-eyes',
    headgear: 'none',
    outfit: 'split-slate-wine-short-tunic',
    outfitColor: 'slate-and-faded-wine',
    outfitTier: 'tier1',
    weapon: 'connected-lengthening-mimic-hand',
    weaponTier: 'none',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.skin,
      hair: COLORS.hair,
      outfit: COLORS.cloth,
    },
  },
  paleEcho: COLORS,
  alphaPolicy: 'binary-connected-asymmetric-fringe-offset-face-mismatched-shoulders-split-short-tunic-connected-mimic-hand-separated-legs-and-grounded-boots',
  effectBoundary: 'external-copied-actors-mirror-doubles-reflection-planes-peeling-faces-loose-skin-ribbons-afterimages-glow-particles-projectiles-and-impact-flashes',
  bakedEffects: [],
});

export const EN_E07_PALE_ECHO_GATE = deepFreeze({
  id: 'en-e07-doppelganger-pale-echo-full-v1',
  status: 'approved',
  baseCheckpoint: '6ff54c3a926436083675ec8f7e2d0230cc073ac5',
  authorizedOn: '2026-08-10',
  authorizationEvidence: 'After the exact Hollowcrown Regent was visually approved, committed, pushed, and reconciled at a clean published checkpoint, the designer replied: approved lets do next. EN-E07 lists Living Shadow then Doppelganger as priority-first, so the one-complete-sprite cadence authorizes only one private common Doppelganger Pale Echo 80-frame candidate.',
  approvedOn: '2026-08-10',
  approvalEvidence: 'After the exact repaired labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, the public Bandit Thug, Cultist Acolyte, and Dark Elf comparison, and paired GIF evidence were presented, and the three exact repaired PNG review boards were opened together in Aseprite, the designer replied: approved lets do next. Approval applies only to candidate digest c3fa12cb4bb0be432e955adfc32f331286e55c65cbd7a38250bdf0d120fa6596; Doppelganger registration, fixtures, runtime copying, effects, later roles and families, release, and EN-E08 remain separate gates.',
  approvedImplementation: '0628135b84725836c552e13db797540a965854cb',
  publicationAuthorizedOn: '2026-08-10',
  publicationAuthorizationEvidence: 'The designer said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact artifact or digest. It does not authorize registration, fixtures, runtime copying, effects, later roles or families, release, or any other unopened gate.',
  publishedImplementation: '0628135b84725836c552e13db797540a965854cb',
  publishedApprovalRecord: '182938381ac39812434518d0216e6e9796367bbb',
  initialPublishedHandoff: '1e6e8d8bb01de97ca4e1373b62b461e40b1aa239',
  publicationState: 'published',
  precedingApproval: {
    gateId: EN_E07_HOLLOWCROWN_REGENT_GATE.id,
    artifactSha256: EN_E07_HOLLOWCROWN_REGENT_GATE.artifactSha256,
    assembledArtifactSha256: EN_E07_HOLLOWCROWN_REGENT_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E07_HOLLOWCROWN_REGENT_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E07_HOLLOWCROWN_REGENT_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E07_HOLLOWCROWN_REGENT_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E07_HOLLOWCROWN_REGENT_GATE.candidateFrameDigest,
    publishedImplementation: EN_E07_HOLLOWCROWN_REGENT_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E07_HOLLOWCROWN_REGENT_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E07_HOLLOWCROWN_REGENT_GATE.initialPublishedHandoff,
    currentReconciliation: '6ff54c3a926436083675ec8f7e2d0230cc073ac5',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e07-doppelganger-pale-echo/en-e07-doppelganger-pale-echo-full-suite-raw.png',
  artifactSha256: 'bcae6f51ad927038989a13f42d993ed05fd9f654f70f1b8f2cb70ce1df862023',
  assembledArtifact: 'enemy-expansion-review/en-e07-doppelganger-pale-echo/en-e07-doppelganger-pale-echo-full-suite-complete-b-form.png',
  assembledArtifactSha256: '3150f7e6ab8fbfe2c40a8e31115d1c4992ffc33a887798c491a1875e61d770b8',
  comparisonArtifact: 'enemy-expansion-review/en-e07-doppelganger-pale-echo/en-e07-doppelganger-pale-echo-humanoid-comparison.png',
  comparisonArtifactSha256: 'b3d8c0e211218726859b1ea4e41b9961002282d0073eb5d64f6be03ecc1823a2',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e07-doppelganger-pale-echo/en-e07-doppelganger-pale-echo-full-suite-four-directions-labeled.gif',
      sha256: 'ee5bf76bbf082e0dfc8a34628998b0a66edacee29a6fd0ce25fcb8b6692582c7',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e07-doppelganger-pale-echo/en-e07-doppelganger-pale-echo-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '2eb5e255c6196c178aa37c69a91d08cdb6ce9b5d5936bdfa32bb3acdfe14d125',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
  },
  candidateFrameDigest: 'c3fa12cb4bb0be432e955adfc32f331286e55c65cbd7a38250bdf0d120fa6596',
  banditThugComparisonDigest: '488d3e63592f48a526004caea2e3a677d409c104dfeaca77eaacacd5768ef3a5',
  cultistAcolyteComparisonDigest: '7e10242faffa4c290ccf3e8b613631697f7c3ed701d521ddb249aa4faaeb29b2',
  darkElfComparisonDigest: 'c2308d7ed3b28e8251dac6a60dcc7c1b512e2cee3fea5ea01fada8be02fff189',
  scope: 'One complete 80-frame Pale Echo common Doppelganger across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle holds an uneven borrowed face and lets the mismatched shoulders settle. Walk uses four grounded alternating steps with opposed sleeve and fringe motion. Attack pinches both connected hands toward the face, lengthens the mimic hand without detaching it, opens into a two-arm shape-rake, and resets the authored default form. Hurt uses a complete white recoil and colored false-face brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and a public Bandit Thug, Cultist Acolyte, and Dark Elf silhouette comparison together.',
  exclusions: [
    'changes to approved Living Shadow source modules or pixels',
    'public Doppelganger registration',
    'public catalog exposure',
    'asset-pack fixture generation or regeneration',
    'runtime actor copying',
    'new Cast pixels',
    'new Death pixels',
    'copied actor silhouettes',
    'mirror doubles',
    'reflection planes',
    'peeling faces',
    'loose skin ribbons',
    'afterimages',
    'glow',
    'particles',
    'projectiles',
    'impact flashes',
    'effects',
    'release',
    'Doppelganger specialist or elite',
    'Will-o-Wisp',
    'Changeling',
    'Kelpie',
    'EN-E08 and later work',
  ],
  nextGate: 'The exact repaired Pale Echo candidate is visually approved and published: implementation 0628135b84725836c552e13db797540a965854cb, approval record 182938381ac39812434518d0216e6e9796367bbb, and initial handoff 1e6e8d8bb01de97ca4e1373b62b461e40b1aa239 are remote verified. The same approved lets do next response opens only one private specialist Doppelganger candidate from this clean publication reconciliation. Do not register Doppelganger, generate fixtures, add runtime copying or effects, release, start the elite or another family beyond that candidate, or advance EN-E08.',
});

export const EN_E07_PALE_ECHO_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const WALK_PHASES = deepFreeze([
  { name: 'left-borrowed-step', pose: 'walk', bob: 0, step: -1, arm: 1, fringe: -1 },
  { name: 'offset-face-pass', pose: 'walk', bob: -1, step: 0, arm: -1, fringe: 1 },
  { name: 'right-borrowed-step', pose: 'walk', bob: 0, step: 1, arm: -1, fringe: 1 },
  { name: 'split-tunic-settle', pose: 'walk', bob: 1, step: 0, arm: 1, fringe: -1 },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'face-pinching-guard', pose: 'pinch', bob: 0, step: 0, arm: 0, fringe: 0 },
  { name: 'connected-mimic-hand-lengthen', pose: 'lengthen', bob: -1, step: 0, arm: 1, fringe: 1 },
  { name: 'two-arm-shape-rake', pose: 'rake', bob: 0, step: 1, arm: -1, fringe: 0 },
  { name: 'authored-form-reset', pose: 'reset', bob: 1, step: 0, arm: 0, fringe: -1 },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-false-face-recoil', pose: 'hurt', bob: 0, step: -1, arm: 0, fringe: 0, flash: true },
  { name: 'colored-pale-echo-brace', pose: 'brace', bob: 1, step: 0, arm: -1, fringe: -1, flash: false },
]);

function createPixels() {
  return new Array(SIZE * SIZE).fill(null);
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Pale Echo rectangles must use positive integer geometry.',
    );
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Pale Echo authored pixels must remain inside the 24x24 cell.');
      pixels[(py * SIZE) + px] = fill;
    }
  };
  return {
    rect,
    dot(x, y, fill) {
      rect(x, y, 1, 1, fill);
    },
  };
}

function drawFrontHead(paint, rear, phase) {
  const y = phase.bob || 0;
  const fringe = phase.fringe > 0 ? 1 : 0;
  paint.rect(9 + fringe, 3 + y, 7, 2, COLORS.hair[1]);
  paint.rect(8 + fringe, 4 + y, 3, 4, COLORS.hair[0]);
  paint.rect(10, 4 + y, 6, 2, COLORS.hair[2]);
  paint.rect(9, 5 + y, 7, 5, rear ? COLORS.hair[0] : COLORS.skin[0]);
  paint.rect(9, 8 + y, 2, 2, rear ? COLORS.hair[1] : COLORS.skin[1]);
  paint.rect(13, 5 + y, 3, 5, rear ? COLORS.hair[0] : COLORS.skin[2]);
  paint.rect(11, 9 + y, 3, 3, COLORS.skin[1]);
  paint.dot(8 + fringe, 7 + y, COLORS.accent[2]);
  if (rear) {
    paint.rect(11, 6 + y, 2, 3, COLORS.hair[1]);
    paint.dot(14, 9 + y, COLORS.accent[0]);
  } else {
    paint.dot(11, 7 + y, COLORS.eye);
    paint.dot(14, 8 + y, COLORS.eye);
    paint.dot(12, 6 + y, COLORS.accent[2]);
    paint.dot(12, 9 + y, COLORS.accent[0]);
  }
}

function drawFrontArms(paint, phase, y) {
  if (phase.pose === 'pinch') {
    paint.rect(5, 10 + y, 4, 4, COLORS.cloth[1]);
    paint.rect(7, 9 + y, 4, 4, COLORS.skin[1]);
    paint.rect(9, 8 + y, 2, 3, COLORS.skin[2]);
    paint.rect(15, 10 + y, 4, 4, COLORS.accent[1]);
    paint.rect(13, 9 + y, 4, 4, COLORS.skin[0]);
    paint.rect(13, 8 + y, 2, 3, COLORS.skin[2]);
  } else if (phase.pose === 'lengthen') {
    paint.rect(5, 11 + y, 4, 5, COLORS.cloth[1]);
    paint.rect(4, 15 + y, 4, 3, COLORS.skin[1]);
    paint.rect(15, 10 + y, 5, 4, COLORS.accent[1]);
    paint.rect(18, 12 + y, 5, 3, COLORS.skin[0]);
    paint.rect(20, 14 + y, 3, 3, COLORS.skin[2]);
    paint.dot(22, 17 + y, COLORS.accent[2]);
  } else if (phase.pose === 'rake') {
    paint.rect(1, 9 + y, 8, 4, COLORS.cloth[1]);
    paint.rect(1, 12 + y, 4, 4, COLORS.skin[1]);
    paint.dot(1, 16 + y, COLORS.accent[2]);
    paint.rect(15, 9 + y, 8, 4, COLORS.accent[1]);
    paint.rect(19, 12 + y, 4, 4, COLORS.skin[0]);
    paint.dot(22, 16 + y, COLORS.accent[2]);
  } else if (phase.pose === 'reset') {
    paint.rect(5, 11 + y, 4, 5, COLORS.cloth[1]);
    paint.rect(4, 15 + y, 4, 3, COLORS.skin[1]);
    paint.rect(15, 11 + y, 4, 5, COLORS.accent[1]);
    paint.rect(17, 15 + y, 4, 3, COLORS.skin[0]);
  } else {
    const swing = phase.arm || 0;
    paint.rect(5, 10 + y, 4, 5, COLORS.cloth[1]);
    paint.rect(4, 14 + y + Math.max(swing, 0), 4, 3, COLORS.skin[1]);
    paint.rect(15, 11 + y, 4, 5, COLORS.accent[1]);
    paint.rect(17, 15 + y + Math.max(-swing, 0), 4, 3, COLORS.skin[0]);
    paint.dot(20, 17 + y + Math.max(-swing, 0), COLORS.accent[2]);
  }
}

function drawFrontBody(paint, rear, phase) {
  const y = phase.bob || 0;
  const step = phase.step || 0;
  paint.rect(7, 10 + y, 5, 3, COLORS.cloth[0]);
  paint.rect(12, 11 + y, 5, 3, COLORS.accent[0]);
  paint.rect(8, 11 + y, 8, 8, COLORS.hair[1]);
  paint.rect(8, 12 + y, 4, 6, COLORS.cloth[0]);
  paint.rect(12, 12 + y, 4, 6, COLORS.accent[0]);
  paint.rect(11, 11 + y, 2, 7, COLORS.skin[1]);
  paint.rect(9, 18 + y, 6, 2, COLORS.hair[0]);
  paint.dot(8, 13 + y, COLORS.cloth[2]);
  paint.dot(15, 15 + y, COLORS.accent[2]);
  if (rear) {
    paint.rect(9, 13 + y, 2, 4, COLORS.cloth[1]);
    paint.rect(13, 13 + y, 2, 4, COLORS.accent[1]);
  }
  drawFrontArms(paint, phase, y);

  const leftX = 8 + Math.min(step, 0);
  const rightX = 13 + Math.max(step, 0);
  paint.rect(leftX, 17, 3, 5, COLORS.cloth[1]);
  paint.rect(rightX, 17, 3, 5, COLORS.accent[1]);
  paint.rect(leftX - 2, 21, 5, 2, COLORS.hair[1]);
  paint.rect(rightX, 21, 5, 2, COLORS.hair[0]);
  paint.dot(leftX - 2, 22, COLORS.cloth[2]);
  paint.dot(rightX + 4, 22, COLORS.accent[2]);
}

function drawRightHead(paint, phase) {
  const y = phase.bob || 0;
  const fringe = phase.fringe > 0 ? 1 : 0;
  paint.rect(9 + fringe, 3 + y, 7, 2, COLORS.hair[1]);
  paint.rect(8 + fringe, 4 + y, 3, 4, COLORS.hair[0]);
  paint.rect(10, 4 + y, 6, 2, COLORS.hair[2]);
  paint.rect(10, 5 + y, 7, 5, COLORS.skin[0]);
  paint.rect(10, 8 + y, 2, 2, COLORS.skin[1]);
  paint.rect(15, 6 + y, 2, 3, COLORS.skin[2]);
  paint.rect(17, 7 + y, 1, 2, COLORS.skin[1]);
  paint.rect(12, 9 + y, 3, 3, COLORS.skin[1]);
  paint.dot(15, 7 + y, COLORS.eye);
  paint.dot(17, 9 + y, COLORS.accent[0]);
  paint.dot(9 + fringe, 7 + y, COLORS.accent[2]);
}

function drawRightArms(paint, phase, y) {
  if (phase.pose === 'pinch') {
    paint.rect(6, 10 + y, 4, 5, COLORS.cloth[1]);
    paint.rect(8, 9 + y, 4, 4, COLORS.skin[1]);
    paint.rect(14, 10 + y, 5, 4, COLORS.accent[1]);
    paint.rect(15, 8 + y, 4, 4, COLORS.skin[0]);
  } else if (phase.pose === 'lengthen') {
    paint.rect(6, 11 + y, 4, 5, COLORS.cloth[1]);
    paint.rect(5, 15 + y, 4, 3, COLORS.skin[1]);
    paint.rect(14, 10 + y, 6, 4, COLORS.accent[1]);
    paint.rect(18, 12 + y, 5, 3, COLORS.skin[0]);
    paint.rect(20, 14 + y, 3, 3, COLORS.skin[2]);
    paint.dot(22, 17 + y, COLORS.accent[2]);
  } else if (phase.pose === 'rake') {
    paint.rect(4, 10 + y, 6, 4, COLORS.cloth[1]);
    paint.rect(2, 13 + y, 4, 3, COLORS.skin[1]);
    paint.rect(14, 9 + y, 9, 4, COLORS.accent[1]);
    paint.rect(19, 12 + y, 4, 4, COLORS.skin[0]);
    paint.dot(22, 16 + y, COLORS.accent[2]);
  } else {
    const swing = phase.arm || 0;
    paint.rect(6, 10 + y, 4, 5, COLORS.cloth[1]);
    paint.rect(5, 14 + y + Math.max(swing, 0), 4, 3, COLORS.skin[1]);
    paint.rect(14, 11 + y, 5, 5, COLORS.accent[1]);
    paint.rect(17, 15 + y + Math.max(-swing, 0), 4, 3, COLORS.skin[0]);
    paint.dot(20, 17 + y + Math.max(-swing, 0), COLORS.accent[2]);
  }
}

function drawRightBody(paint, phase) {
  const y = phase.bob || 0;
  const step = phase.step || 0;
  paint.rect(8, 10 + y, 5, 3, COLORS.cloth[0]);
  paint.rect(12, 11 + y, 6, 3, COLORS.accent[0]);
  paint.rect(9, 11 + y, 8, 8, COLORS.hair[1]);
  paint.rect(9, 12 + y, 4, 6, COLORS.cloth[0]);
  paint.rect(13, 12 + y, 4, 6, COLORS.accent[0]);
  paint.rect(12, 11 + y, 2, 7, COLORS.skin[1]);
  paint.rect(10, 18 + y, 6, 2, COLORS.hair[0]);
  paint.dot(9, 13 + y, COLORS.cloth[2]);
  paint.dot(16, 15 + y, COLORS.accent[2]);
  drawRightArms(paint, phase, y);

  const farX = 8 + Math.min(step, 0);
  const nearX = 13 + Math.max(step, 0);
  paint.rect(farX, 17, 3, 5, COLORS.cloth[1]);
  paint.rect(nearX, 17, 3, 5, COLORS.accent[1]);
  paint.rect(farX - 2, 21, 5, 2, COLORS.hair[1]);
  paint.rect(nearX, 21, 5, 2, COLORS.hair[0]);
  paint.dot(farX - 2, 22, COLORS.cloth[2]);
  paint.dot(nearX + 4, 22, COLORS.accent[2]);
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
    assert(frame === 0 || frame === 1, 'Pale Echo Idle frame ' + frame + ' is out of range.');
    phase = frame === 0
      ? { name: 'offset-paired-gaze', pose: 'idle', bob: 0, step: 0, arm: -1, fringe: -1 }
      : { name: 'mismatched-shoulder-settle', pose: 'idle', bob: 1, step: 0, arm: 1, fringe: 1 };
  } else if (animation === 'walk') {
    phase = WALK_PHASES[frame];
  } else if (animation === 'attack' || animation === 'cast') {
    phase = ATTACK_PHASES[frame];
  } else if (animation === 'hurt') {
    phase = HURT_PHASES[frame];
  } else if (animation === 'death') {
    phase = HURT_PHASES[EN_E07_PALE_ECHO_DEATH_SOURCE_FRAMES[frame]];
  }
  assert(phase, 'Pale Echo animation ' + animation + ' frame ' + frame + ' is out of range.');

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

export function renderEnE07PaleEchoFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Pale Echo rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Pale Echo direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'doppelganger',
    variant: 'pale-echo',
    direction,
    animation,
    frame,
    phase: phase.name,
    paleEchoGate: EN_E07_PALE_ECHO_GATE.id,
    approvedPrecedingGate: EN_E07_HOLLOWCROWN_REGENT_GATE.id,
    alphaPolicy: EN_E07_PALE_ECHO_DATA.alphaPolicy,
    effectBoundary: EN_E07_PALE_ECHO_DATA.effectBoundary,
  });
}

export const EN_E07_PALE_ECHO_RENDERER = deepFreeze({
  key: 'en-e07-doppelganger-pale-echo-v1',
  chassis: EN_E07_PALE_ECHO_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'doppelganger', 'The EN-E07 Pale Echo renderer is restricted to Doppelganger.');
    assert(variant.id === 'pale-echo', 'The EN-E07 Pale Echo renderer is restricted to Pale Echo.');
    return renderEnE07PaleEchoFrame(context, direction, animation.id, frame);
  },
});

const PALE_ECHO_VARIANT = deepFreeze({
  id: 'pale-echo',
  name: 'Pale Echo',
  role: EN_E07_PALE_ECHO_CONTRACT.role,
  status: EN_E07_PALE_ECHO_CONTRACT.state,
  brief: 'An approved complete common Doppelganger with an authored uneven fringe, offset face, mismatched shoulders, split slate-wine tunic, one connected lengthening mimic hand, separated legs, and planted boots; copied actors, doubles, reflections, loose morph pieces, glow, and particles remain external.',
  rendererData: EN_E07_PALE_ECHO_DATA,
});

export const EN_E07_PALE_ECHO_FAMILY = deepFreeze({
  id: 'doppelganger',
  name: 'Doppelganger Pale Echo Review',
  sliceId: 'EN-E07',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E07_PALE_ECHO_CONTRACT.chassis,
  rendererKey: EN_E07_PALE_ECHO_RENDERER.key,
  variants: [PALE_ECHO_VARIANT],
  rendererData: {
    contractCard: EN_E07_DOPPELGANGER_CONTRACT_CARD.id,
    approvedPrecedingGate: EN_E07_HOLLOWCROWN_REGENT_GATE.id,
    activeGate: EN_E07_PALE_ECHO_GATE.id,
  },
  review: {
    baselineVariant: 'pale-echo',
    scale: 8,
    notes: 'Visually approved and published as one authored grounded Pale Echo against public Bandit Thug, Cultist Acolyte, and Dark Elf. Keep registration, fixtures, runtime copying, effects, the elite, Will-o-Wisp, and later Wave 2 work separate; only one private specialist Doppelganger candidate is open from the clean publication reconciliation.',
  },
});

export const EN_E07_PALE_ECHO_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E07_PALE_ECHO_RENDERER],
  families: [EN_E07_PALE_ECHO_FAMILY],
});
