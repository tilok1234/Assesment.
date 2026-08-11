import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E07_MIRRORFOLD_HARRIER_CONTRACT_CARD,
  EN_E07_MIRRORFOLD_HARRIER_GATE,
} from './enemy-expansion-en-e07-changeling-mirrorfold-harrier.js';

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
  skin: ['#d0a09a', '#8b5f69', '#efc0b5'],
  veil: ['#365c68', '#203d4a', '#658894'],
  fold: ['#70445e', '#462d48', '#a36682'],
  accent: ['#c08a4e', '#745134', '#e2b36b'],
  feature: '#1d2934',
  eye: '#f5d879',
  flash: '#f4f4f4',
});

export const EN_E07_MANYFOLD_USURPER_CONTRACT_CARD = deepFreeze({
  id: 'en-e07-changeling-manyfold-usurper-v1',
  sliceId: 'EN-E07',
  family: 'changeling',
  familyName: 'Changeling',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingVariant: {
    id: 'mirrorfold-harrier',
    name: 'Mirrorfold Harrier',
    role: 'specialist',
    status: 'approved-published',
  },
  activeVariant: {
    id: 'manyfold-usurper',
    name: 'Manyfold Usurper',
    role: 'elite',
    status: 'implemented-full-approved',
  },
  deferredRoles: [],
  styleContract: 'Use chunky one-to-three-pixel hard-alpha forms and an independently authored broad tall grounded fey body. Keep one centered readable face inside a single connected three-tier living fan mantle, paired heavy ordinary arms, a pinched middle, wide separated pillar legs, and grounded slab feet. The elite must be broader and heavier than Mirrorfold Harrier without becoming a Doppelganger humanoid, a crowned sovereign, a winged creature, or a copied actor.',
  effectBoundary: EN_E07_MIRRORFOLD_HARRIER_CONTRACT_CARD.effectBoundary,
});

export const EN_E07_MANYFOLD_USURPER_CONTRACT = deepFreeze({
  sliceId: 'EN-E07',
  family: 'changeling',
  variant: 'manyfold-usurper',
  role: 'elite',
  state: 'implemented-complete-motion-approved',
  chassis: 'broad-three-tier-fan-mantle-centered-face-heavy-paired-arms-pinched-middle-wide-pillar-legs-slab-feet-grounded-fey-v1',
  silhouette: 'A broad tall grounded authored Changeling elite with one connected three-tier fan mantle, deep side drapes, one centered face, a pinched folded middle, two paired heavy ordinary arms, wide separated pillar legs, and broad slab feet. It must be broader and heavier than Mirrorfold Harrier without collapsing into the pear-shaped Veilskin Foundling, an adult Doppelganger humanoid, a crowned sovereign, detached mask, winged creature, or copied actor.',
  identity: 'Deep ink-teal mantle flesh, rose-clay face and hands, wine inner folds, old-gold living seams, dark eye sockets with amber glints, one centered paired gaze, and a connected two-arm clasp-to-decree motion establish a self-contained elite form without promising runtime actor copying in the assembler.',
  effectBoundary: EN_E07_MANYFOLD_USURPER_CONTRACT_CARD.effectBoundary,
});

export const EN_E07_MANYFOLD_USURPER_DATA = deepFreeze({
  actor: {
    species: 'authored-changeling-default',
    bodyBuild: 'broad-tall-heavy-grounded-fey-usurper',
    skin: 'rose-clay',
    hairStyle: 'none',
    hairColor: 'none',
    expression: 'centered-commanding-paired-gaze',
    faceDetail: 'broad-arch-face-window-dark-eye-sockets-amber-glints-and-mouth-mark',
    headgear: 'connected-three-tier-fan-living-mantle',
    outfit: 'wine-pinched-middle-and-gold-living-folds',
    outfitColor: 'ink-teal-wine-and-old-gold',
    outfitTier: 'tier3',
    weapon: 'paired-connected-heavy-forearm-decree',
    weaponTier: 'none',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.skin,
      hair: COLORS.veil,
      outfit: COLORS.fold,
    },
  },
  manyfoldUsurper: COLORS,
  alphaPolicy: 'binary-single-component-connected-three-tier-fan-mantle-deep-side-drapes-centered-face-pinched-middle-paired-heavy-forearms-wide-separated-pillar-legs-and-grounded-slab-feet',
  effectBoundary: 'external-copied-actor-silhouettes-alternate-actor-bodies-face-swaps-shed-skins-detached-masks-loose-veil-pieces-afterimages-glow-particles-projectiles-impacts-and-illumination',
  bakedEffects: [],
});

export const EN_E07_MANYFOLD_USURPER_GATE = deepFreeze({
  id: 'en-e07-changeling-manyfold-usurper-full-v1',
  status: 'approved',
  baseCheckpoint: 'fdbb4cf04048a819b9cbe1655146842835b86a73',
  authorizedOn: '2026-08-11',
  authorizationEvidence: 'After the exact Mirrorfold Harrier digest was visually approved, committed, pushed, and reconciled at clean published checkpoint fdbb4cf04048a819b9cbe1655146842835b86a73, the designer replied: approved lets do next. Mirrorfold Harrier completed the frozen specialist Changeling role, so the one-complete-sprite cadence authorizes only one private elite Changeling Manyfold Usurper 80-frame candidate.',
  approvedOn: '2026-08-11',
  approvalEvidence: 'The exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, the approved Mirrorfold Harrier, Veilskin Foundling, and Grand Pretender comparison, and synchronized GIF evidence were presented after the early oversized square mask-like face and Harrier-adjacent side read were corrected before freeze. The three exact frozen PNG boards were open together in responsive Aseprite 1.3.17.2 process 39276, whose live command line named all three paths. The designer replied: approved lets do next. Approval applies only to candidate digest f3ed9a91cb01746fc7467e59c92335778a85b476495f5772ac81cf2a6cbda246. Registration, fixtures, runtime copying, effects, Kelpie, release, and EN-E08 remain separate gates.',
  approvedImplementation: '38f9d7f9b3ac5a34bdff91be1fd878e158d26bfe',
  publicationAuthorizedOn: '2026-08-11',
  publicationAuthorizationEvidence: 'The designer said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact artifact or digest. It does not authorize registration, fixtures, runtime copying, effects, later families, release, or any other unopened gate.',
  publishedImplementation: null,
  publishedApprovalRecord: null,
  initialPublishedHandoff: null,
  publicationState: 'authorized-pending-bounded-publication',
  precedingApproval: {
    gateId: EN_E07_MIRRORFOLD_HARRIER_GATE.id,
    artifactSha256: EN_E07_MIRRORFOLD_HARRIER_GATE.artifactSha256,
    assembledArtifactSha256: EN_E07_MIRRORFOLD_HARRIER_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E07_MIRRORFOLD_HARRIER_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E07_MIRRORFOLD_HARRIER_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E07_MIRRORFOLD_HARRIER_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E07_MIRRORFOLD_HARRIER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E07_MIRRORFOLD_HARRIER_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E07_MIRRORFOLD_HARRIER_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E07_MIRRORFOLD_HARRIER_GATE.initialPublishedHandoff,
    currentReconciliation: 'fdbb4cf04048a819b9cbe1655146842835b86a73',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e07-changeling-manyfold-usurper/en-e07-changeling-manyfold-usurper-full-suite-raw.png',
  artifactSha256: 'f33e2449d3ab77124af6a17b5d7727a7c92d76c2b4b78e1bcfcd227686e219f5',
  assembledArtifact: 'enemy-expansion-review/en-e07-changeling-manyfold-usurper/en-e07-changeling-manyfold-usurper-full-suite-complete-b-form.png',
  assembledArtifactSha256: 'e2febf3f3ee2f0f2cf1db45041ab86d89d229d2c291f16130696a15c99218817',
  comparisonArtifact: 'enemy-expansion-review/en-e07-changeling-manyfold-usurper/en-e07-changeling-manyfold-usurper-family-comparison.png',
  comparisonArtifactSha256: '9791178ce188b8ac7095d3e206dd5d0cb71c4ca903954653b8ee8a5ee3d52645',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e07-changeling-manyfold-usurper/en-e07-changeling-manyfold-usurper-full-suite-four-directions-labeled.gif',
      sha256: 'd4bc6f78a1e91f3e586ef2c8d9817ffa931bcc8875e34f7e2ff15a42f471fd4d',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e07-changeling-manyfold-usurper/en-e07-changeling-manyfold-usurper-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '2ce887c526c6985cc4b775555284391018ecd693824d378a0be891f8feb399f0',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
  },
  candidateFrameDigest: 'f3ed9a91cb01746fc7467e59c92335778a85b476495f5772ac81cf2a6cbda246',
  mirrorfoldHarrierComparisonDigest: 'be3e4d03263929ce9677fcf15b742cde769271d037160cd6461b45ea389660f2',
  veilskinFoundlingComparisonDigest: 'e472931d214d369331d6cb750619471d9234ab11561233e700facab6ea4f0126',
  grandPretenderComparisonDigest: '03ca03ade7be4efcb2e69aafe3400cf6a452d26f1ddbaccca2b561374c172dcb',
  scope: 'One complete 80-frame Manyfold Usurper elite Changeling across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle opens and settles the connected three-tier fan mantle around one centered face. Walk uses four deliberate wide alternating slab steps with opposed side-drape and paired-arm weight. Attack clasps both connected hands beneath the face, unfurls both heavy ordinary forearms into a wide decree, drives both connected palms into a centered press, and resets the authored elite form. Hurt uses a complete white recoil and colored collapsed-fan brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and approved Mirrorfold Harrier, Veilskin Foundling, and Grand Pretender silhouette comparisons together.',
  exclusions: [
    'changes to approved Mirrorfold Harrier or Veilskin Foundling rendered pixels',
    'changes to approved Will-o-Wisp, Doppelganger, or Living Shadow rendered pixels',
    'public Changeling registration',
    'public catalog exposure',
    'asset-pack fixture generation or regeneration',
    'runtime actor copying',
    'new Cast pixels',
    'new Death pixels',
    'copied actor silhouettes',
    'alternate actor bodies',
    'pear-shaped Veilskin Foundling chassis',
    'diamond-shaped Mirrorfold Harrier chassis',
    'adult Doppelganger silhouette',
    'offset eyes or multiple faces',
    'face swaps',
    'shed skins',
    'detached masks',
    'loose veil pieces',
    'wings',
    'horns',
    'tail',
    'weapons',
    'afterimages',
    'glow',
    'particles',
    'projectiles',
    'impacts',
    'illumination',
    'effects',
    'release',
    'Kelpie',
    'EN-E08 and later work',
  ],
  nextGate: 'The exact Manyfold Usurper digest is visually approved; implementation 38f9d7f9b3ac5a34bdff91be1fd878e158d26bfe and approval record 306aa3ac1ba658cb48e223651410a7df494e7b9e are remote verified. Standing publication permission opens only the bounded initial-handoff and final-reconciliation commits plus branch pushes. After that remote-verified stop, the same designer reply opens only one private common Kelpie candidate. Changeling registration, fixtures, runtime copying, effects, later Kelpie roles, release, and EN-E08 remain closed.',
});

export const EN_E07_MANYFOLD_USURPER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const WALK_PHASES = deepFreeze([
  { name: 'left-slab-weight-step', pose: 'walk', bob: 0, step: -1, arm: 1, fan: -1 },
  { name: 'high-three-tier-pass', pose: 'walk', bob: -1, step: 0, arm: -1, fan: 1 },
  { name: 'right-slab-weight-step', pose: 'walk', bob: 0, step: 1, arm: -1, fan: 1 },
  { name: 'low-manyfold-settle', pose: 'walk', bob: 1, step: 0, arm: 1, fan: -1 },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'paired-hand-command-clasp', pose: 'clasp', bob: 0, step: 0, arm: 0, fan: -1 },
  { name: 'wide-heavy-forearm-decree', pose: 'decree', bob: -1, step: 0, arm: -1, fan: 1 },
  { name: 'connected-centered-palm-press', pose: 'press', bob: 0, step: 1, arm: 1, fan: 1 },
  { name: 'authored-manyfold-reset', pose: 'reset', bob: 1, step: 0, arm: 0, fan: -1 },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-three-tier-recoil', pose: 'hurt', bob: 0, step: -1, arm: 0, fan: 1, flash: true },
  { name: 'colored-collapsed-fan-brace', pose: 'brace', bob: 1, step: 0, arm: -1, fan: -1, flash: false },
]);

function createPixels() {
  return new Array(SIZE * SIZE).fill(null);
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Manyfold Usurper rectangles must use positive integer geometry.',
    );
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Manyfold Usurper authored pixels must remain inside the 24x24 cell.');
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

function drawFrontMantle(paint, rear, phase) {
  const y = phase.bob || 0;
  const spread = phase.fan > 0 ? 1 : 0;
  paint.rect(9, 2 + y, 6, 2, COLORS.veil[0]);
  paint.rect(7, 4 + y, 10, 2, COLORS.veil[0]);
  paint.rect(4 - spread, 6 + y, 16 + (spread * 2), 2, COLORS.veil[0]);
  paint.rect(2 - spread, 8 + y, 20 + (spread * 2), 2, COLORS.veil[0]);
  paint.rect(3 - spread, 10 + y, 18 + (spread * 2), 2, COLORS.veil[1]);
  paint.rect(5, 12 + y, 14, 2, COLORS.veil[1]);
  paint.rect(7, 5 + y, 10, 1, COLORS.accent[0]);
  paint.rect(4 - spread, 7 + y, 16 + (spread * 2), 1, COLORS.accent[1]);
  paint.rect(3 - spread, 10 + y, 4, 7, COLORS.veil[1]);
  paint.rect(4 - spread, 15 + y, 3, 3, COLORS.fold[1]);
  paint.rect(17 + spread, 10 + y, 4, 7, COLORS.veil[1]);
  paint.rect(17 + spread, 15 + y, 3, 3, COLORS.fold[1]);
  paint.rect(5 - spread, 7 + y, 2, 9, COLORS.accent[1]);
  paint.rect(17 + spread, 7 + y, 2, 9, COLORS.accent[0]);
  paint.dot(2 - spread, 9 + y, COLORS.veil[2]);
  paint.dot(21 + spread, 9 + y, COLORS.accent[2]);
  paint.dot(4 - spread, 12 + y, COLORS.accent[2]);
  paint.dot(19 + spread, 12 + y, COLORS.veil[2]);
  if (rear) {
    paint.rect(8, 4 + y, 8, 8, COLORS.veil[1]);
    paint.rect(11, 3 + y, 2, 11, COLORS.accent[1]);
    paint.rect(8, 7 + y, 2, 3, COLORS.veil[2]);
    paint.rect(14, 8 + y, 2, 3, COLORS.accent[2]);
  } else {
    paint.rect(9, 4 + y, 6, 7, COLORS.skin[0]);
    paint.rect(10, 5 + y, 4, 5, COLORS.skin[2]);
    paint.rect(9, 6 + y, 2, 1, COLORS.feature);
    paint.rect(13, 6 + y, 2, 1, COLORS.feature);
    paint.dot(10, 6 + y, COLORS.eye);
    paint.dot(13, 6 + y, COLORS.eye);
    paint.dot(12, 8 + y, COLORS.accent[0]);
    paint.rect(11, 9 + y, 2, 1, COLORS.feature);
    paint.rect(10, 10 + y, 4, 1, COLORS.skin[1]);
  }
}

function drawFrontArms(paint, phase, y) {
  if (phase.pose === 'clasp') {
    paint.rect(3, 10 + y, 7, 5, COLORS.fold[1]);
    paint.rect(8, 12 + y, 5, 3, COLORS.skin[0]);
    paint.rect(14, 10 + y, 7, 5, COLORS.fold[1]);
    paint.rect(11, 12 + y, 5, 3, COLORS.skin[0]);
    paint.rect(11, 13 + y, 3, 2, COLORS.skin[2]);
  } else if (phase.pose === 'decree') {
    paint.rect(2, 9 + y, 7, 4, COLORS.fold[1]);
    paint.rect(1, 11 + y, 5, 3, COLORS.skin[0]);
    paint.rect(15, 9 + y, 7, 4, COLORS.fold[1]);
    paint.rect(18, 11 + y, 5, 3, COLORS.skin[0]);
    paint.dot(1, 13 + y, COLORS.skin[2]);
    paint.dot(22, 13 + y, COLORS.accent[2]);
  } else if (phase.pose === 'press') {
    paint.rect(3, 10 + y, 7, 5, COLORS.fold[1]);
    paint.rect(8, 11 + y, 5, 4, COLORS.skin[0]);
    paint.rect(14, 10 + y, 7, 5, COLORS.fold[1]);
    paint.rect(11, 11 + y, 5, 4, COLORS.skin[0]);
    paint.rect(11, 11 + y, 3, 4, COLORS.accent[2]);
  } else if (phase.pose === 'brace' || phase.pose === 'reset') {
    paint.rect(4, 10 + y, 5, 7, COLORS.fold[1]);
    paint.rect(7, 15 + y, 5, 3, COLORS.skin[0]);
    paint.rect(15, 10 + y, 5, 7, COLORS.fold[1]);
    paint.rect(12, 15 + y, 5, 3, COLORS.skin[0]);
  } else {
    const swing = phase.arm || 0;
    paint.rect(3, 9 + y, 5, 7, COLORS.fold[1]);
    paint.rect(4, 14 + y + Math.max(swing, 0), 4, 5, COLORS.skin[0]);
    paint.rect(16, 9 + y, 5, 7, COLORS.fold[1]);
    paint.rect(16, 14 + y + Math.max(-swing, 0), 4, 5, COLORS.skin[0]);
    paint.dot(4, 18 + y + Math.max(swing, 0), COLORS.skin[2]);
    paint.dot(19, 18 + y + Math.max(-swing, 0), COLORS.accent[2]);
  }
}

function drawFrontBody(paint, rear, phase) {
  const y = phase.bob || 0;
  const step = phase.step || 0;
  paint.rect(7, 10 + y, 10, 3, COLORS.fold[0]);
  paint.rect(8, 13 + y, 8, 4, COLORS.fold[2]);
  paint.rect(7, 16 + y, 10, 3, COLORS.fold[0]);
  paint.rect(10, 12 + y, 4, 7, COLORS.accent[0]);
  paint.rect(11, 11 + y, 2, 8, COLORS.accent[1]);
  paint.dot(8, 15 + y, COLORS.veil[2]);
  paint.dot(15, 16 + y, COLORS.accent[2]);
  if (rear) {
    paint.rect(8, 12 + y, 3, 6, COLORS.fold[1]);
    paint.rect(13, 12 + y, 3, 6, COLORS.accent[1]);
  }
  drawFrontArms(paint, phase, y);

  const leftX = 6 + Math.min(step, 0);
  const rightX = 15 + Math.max(step, 0);
  paint.rect(leftX, 17, 3, 5, COLORS.fold[1]);
  paint.rect(rightX, 17, 3, 5, COLORS.accent[1]);
  paint.rect(leftX - 2, 21, 6, 2, COLORS.veil[1]);
  paint.rect(rightX - 1, 21, 6, 2, COLORS.veil[0]);
  paint.dot(leftX - 2, 22, COLORS.veil[2]);
  paint.dot(rightX + 4, 22, COLORS.accent[2]);
}

function drawRightMantle(paint, phase) {
  const y = phase.bob || 0;
  const spread = phase.fan > 0 ? 1 : 0;
  paint.rect(10, 2 + y, 6, 2, COLORS.veil[0]);
  paint.rect(8, 4 + y, 10, 2, COLORS.veil[0]);
  paint.rect(5 - spread, 6 + y, 15 + (spread * 2), 2, COLORS.veil[0]);
  paint.rect(3 - spread, 8 + y, 19 + spread, 2, COLORS.veil[0]);
  paint.rect(4 - spread, 10 + y, 17 + spread, 2, COLORS.veil[1]);
  paint.rect(6, 12 + y, 13, 2, COLORS.veil[1]);
  paint.rect(8, 5 + y, 10, 1, COLORS.accent[0]);
  paint.rect(5 - spread, 7 + y, 15 + (spread * 2), 1, COLORS.accent[1]);
  paint.rect(4 - spread, 10 + y, 4, 7, COLORS.veil[1]);
  paint.rect(5 - spread, 15 + y, 3, 3, COLORS.fold[1]);
  paint.rect(17 + spread, 10 + y, 4, 7, COLORS.veil[1]);
  paint.rect(17 + spread, 15 + y, 3, 3, COLORS.fold[1]);
  paint.rect(13, 4 + y, 6, 7, COLORS.skin[0]);
  paint.rect(14, 5 + y, 4, 5, COLORS.skin[2]);
  paint.rect(15, 6 + y, 2, 1, COLORS.feature);
  paint.dot(16, 6 + y, COLORS.eye);
  paint.dot(18, 8 + y, COLORS.accent[0]);
  paint.dot(17, 9 + y, COLORS.feature);
  paint.rect(14, 10 + y, 4, 1, COLORS.skin[1]);
  paint.dot(3 - spread, 9 + y, COLORS.veil[2]);
  paint.dot(20 + spread, 9 + y, COLORS.accent[2]);
}

function drawRightArms(paint, phase, y) {
  if (phase.pose === 'clasp') {
    paint.rect(5, 10 + y, 7, 5, COLORS.fold[1]);
    paint.rect(10, 12 + y, 5, 3, COLORS.skin[0]);
    paint.rect(14, 10 + y, 6, 5, COLORS.fold[1]);
    paint.rect(12, 11 + y, 5, 4, COLORS.skin[0]);
  } else if (phase.pose === 'decree') {
    paint.rect(5, 10 + y, 6, 6, COLORS.fold[1]);
    paint.rect(5, 14 + y, 5, 3, COLORS.skin[0]);
    paint.rect(14, 11 + y, 8, 4, COLORS.fold[1]);
    paint.rect(18, 13 + y, 5, 3, COLORS.skin[0]);
    paint.dot(22, 14 + y, COLORS.accent[2]);
  } else if (phase.pose === 'press') {
    paint.rect(5, 10 + y, 7, 5, COLORS.fold[1]);
    paint.rect(10, 11 + y, 5, 4, COLORS.skin[0]);
    paint.rect(14, 11 + y, 8, 4, COLORS.fold[1]);
    paint.rect(17, 13 + y, 6, 3, COLORS.skin[0]);
    paint.rect(20, 13 + y, 3, 3, COLORS.accent[2]);
  } else if (phase.pose === 'brace' || phase.pose === 'reset') {
    paint.rect(5, 10 + y, 5, 7, COLORS.fold[1]);
    paint.rect(7, 15 + y, 5, 3, COLORS.skin[0]);
    paint.rect(15, 10 + y, 5, 7, COLORS.fold[1]);
    paint.rect(13, 15 + y, 5, 3, COLORS.skin[0]);
  } else {
    const swing = phase.arm || 0;
    paint.rect(4, 9 + y, 5, 7, COLORS.fold[1]);
    paint.rect(5, 14 + y + Math.max(swing, 0), 4, 5, COLORS.skin[0]);
    paint.rect(16, 10 + y, 5, 6, COLORS.fold[1]);
    paint.rect(17, 14 + y + Math.max(-swing, 0), 4, 5, COLORS.skin[0]);
    paint.dot(20, 18 + y + Math.max(-swing, 0), COLORS.skin[2]);
  }
}

function drawRightBody(paint, phase) {
  const y = phase.bob || 0;
  const step = phase.step || 0;
  paint.rect(8, 10 + y, 9, 3, COLORS.fold[0]);
  paint.rect(9, 13 + y, 7, 4, COLORS.fold[2]);
  paint.rect(8, 16 + y, 9, 3, COLORS.fold[0]);
  paint.rect(11, 12 + y, 4, 7, COLORS.accent[0]);
  paint.rect(12, 11 + y, 2, 8, COLORS.accent[1]);
  paint.dot(9, 15 + y, COLORS.veil[2]);
  drawRightArms(paint, phase, y);

  const farX = 7 + Math.min(step, 0);
  const nearX = 14 + Math.max(step, 0);
  paint.rect(farX, 17, 3, 5, COLORS.fold[1]);
  paint.rect(nearX, 17, 3, 5, COLORS.accent[1]);
  paint.rect(farX - 2, 21, 6, 2, COLORS.veil[1]);
  paint.rect(nearX - 1, 21, 6, 2, COLORS.veil[0]);
  paint.dot(farX - 2, 22, COLORS.veil[2]);
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
    assert(frame === 0 || frame === 1, 'Manyfold Usurper Idle frame ' + frame + ' is out of range.');
    phase = frame === 0
      ? { name: 'centered-three-tier-watch', pose: 'idle', bob: 0, step: 0, arm: -1, fan: -1 }
      : { name: 'living-manyfold-fan-open', pose: 'idle', bob: 0, step: 0, arm: 1, fan: 1 };
  } else if (animation === 'walk') {
    phase = WALK_PHASES[frame];
  } else if (animation === 'attack' || animation === 'cast') {
    phase = ATTACK_PHASES[frame];
  } else if (animation === 'hurt') {
    phase = HURT_PHASES[frame];
  } else if (animation === 'death') {
    phase = HURT_PHASES[EN_E07_MANYFOLD_USURPER_DEATH_SOURCE_FRAMES[frame]];
  }
  assert(phase, 'Manyfold Usurper animation ' + animation + ' frame ' + frame + ' is out of range.');

  let pixels = createPixels();
  const paint = painter(pixels);
  if (canonicalDirection === 'right') {
    drawRightMantle(paint, phase);
    drawRightBody(paint, phase);
  } else {
    const rear = canonicalDirection === 'up';
    drawFrontMantle(paint, rear, phase);
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

export function renderEnE07ManyfoldUsurperFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Manyfold Usurper rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Manyfold Usurper direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'changeling',
    variant: 'manyfold-usurper',
    direction,
    animation,
    frame,
    phase: phase.name,
    manyfoldUsurperGate: EN_E07_MANYFOLD_USURPER_GATE.id,
    approvedPrecedingGate: EN_E07_MIRRORFOLD_HARRIER_GATE.id,
    alphaPolicy: EN_E07_MANYFOLD_USURPER_DATA.alphaPolicy,
    effectBoundary: EN_E07_MANYFOLD_USURPER_DATA.effectBoundary,
  });
}

export const EN_E07_MANYFOLD_USURPER_RENDERER = deepFreeze({
  key: 'en-e07-changeling-manyfold-usurper-v1',
  chassis: EN_E07_MANYFOLD_USURPER_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'changeling', 'The EN-E07 Manyfold Usurper renderer is restricted to Changeling.');
    assert(variant.id === 'manyfold-usurper', 'The EN-E07 Manyfold Usurper renderer is restricted to Manyfold Usurper.');
    return renderEnE07ManyfoldUsurperFrame(context, direction, animation.id, frame);
  },
});

const MANYFOLD_USURPER_VARIANT = deepFreeze({
  id: 'manyfold-usurper',
  name: 'Manyfold Usurper',
  role: EN_E07_MANYFOLD_USURPER_CONTRACT.role,
  status: EN_E07_MANYFOLD_USURPER_CONTRACT.state,
  brief: 'A private complete elite Changeling with one connected three-tier fan mantle, deep side drapes, a centered readable face, wine-and-gold pinched folds, paired heavy ordinary forearms, wide pillar legs, and grounded slab feet; copied actors, alternate bodies, detached masks, loose morph pieces, glow, and particles remain external.',
  rendererData: EN_E07_MANYFOLD_USURPER_DATA,
});

export const EN_E07_MANYFOLD_USURPER_FAMILY = deepFreeze({
  id: 'changeling',
  name: 'Changeling Manyfold Usurper Review',
  sliceId: 'EN-E07',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E07_MANYFOLD_USURPER_CONTRACT.chassis,
  rendererKey: EN_E07_MANYFOLD_USURPER_RENDERER.key,
  variants: [MANYFOLD_USURPER_VARIANT],
  rendererData: {
    contractCard: EN_E07_MANYFOLD_USURPER_CONTRACT_CARD.id,
    approvedPrecedingGate: EN_E07_MIRRORFOLD_HARRIER_GATE.id,
    activeGate: EN_E07_MANYFOLD_USURPER_GATE.id,
  },
  review: {
    baselineVariant: 'manyfold-usurper',
    scale: 8,
    notes: 'Visually approved as one broad tall grounded authored Manyfold Usurper against approved Mirrorfold Harrier, Veilskin Foundling, and Grand Pretender. Publish only the bounded approval and reconciliation tuple; after remote verification, open only one private common Kelpie candidate. Keep Changeling registration, fixtures, runtime copying, effects, later Kelpie roles, and later Wave 2 work separate.',
  },
});

export const EN_E07_MANYFOLD_USURPER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E07_MANYFOLD_USURPER_RENDERER],
  families: [EN_E07_MANYFOLD_USURPER_FAMILY],
});
