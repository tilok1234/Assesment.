import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E07_CHANGELING_CONTRACT_CARD,
  EN_E07_VEILSKIN_FOUNDLING_GATE,
} from './enemy-expansion-en-e07-changeling-veilskin-foundling.js';

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
  skin: ['#c89a91', '#875f68', '#e8bbb0'],
  veil: ['#3f6768', '#28474f', '#6f9290'],
  fold: ['#765476', '#49384f', '#a77aa0'],
  accent: ['#b7794d', '#714a38', '#dda36b'],
  feature: '#222d35',
  eye: '#f3ce72',
  flash: '#f4f4f4',
});

export const EN_E07_MIRRORFOLD_HARRIER_CONTRACT_CARD = deepFreeze({
  id: 'en-e07-changeling-mirrorfold-harrier-v1',
  sliceId: 'EN-E07',
  family: 'changeling',
  familyName: 'Changeling',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingVariant: {
    id: 'veilskin-foundling',
    name: 'Veilskin Foundling',
    role: 'common',
    status: 'approved-published',
  },
  activeVariant: {
    id: 'mirrorfold-harrier',
    name: 'Mirrorfold Harrier',
    role: 'specialist',
    status: 'implemented-full-approved',
  },
  deferredRoles: ['elite'],
  styleContract: 'Use chunky one-to-three-pixel hard-alpha forms and an independently authored compact grounded fey body. Keep one centered readable face inside a connected angular living mantle, paired ordinary arms, bent separated legs, and grounded wedge feet. The specialist must be taller and narrower than Veilskin Foundling without becoming an adult Doppelganger humanoid or copying any actor.',
  effectBoundary: EN_E07_CHANGELING_CONTRACT_CARD.effectBoundary,
});

export const EN_E07_MIRRORFOLD_HARRIER_CONTRACT = deepFreeze({
  sliceId: 'EN-E07',
  family: 'changeling',
  variant: 'mirrorfold-harrier',
  role: 'specialist',
  state: 'implemented-complete-motion-approved',
  chassis: 'compact-diamond-mantle-centered-face-long-paired-forearms-pinched-waist-bent-legs-wedge-feet-grounded-fey-v1',
  silhouette: 'A compact grounded authored Changeling specialist, taller and narrower than Veilskin Foundling, with one connected diamond-fold living mantle, angular shoulder points, one centered face, a pinched folded waist, two paired long ordinary forearms, bent separated legs, and low wedge feet. It must not collapse into the common pear-shaped Foundling, adult Pale Echo or Falseface humanoids, a detached mask, a winged Fairy, or a copied actor.',
  identity: 'Muted blue-green mantle flesh, clay-rose face and hands, plum inner folds, copper living seams, dark eye sockets with amber glints, one centered paired gaze, and a connected crossed-arm feint establish a self-contained specialist form without promising runtime actor copying in the assembler.',
  effectBoundary: EN_E07_MIRRORFOLD_HARRIER_CONTRACT_CARD.effectBoundary,
});

export const EN_E07_MIRRORFOLD_HARRIER_DATA = deepFreeze({
  actor: {
    species: 'authored-changeling-default',
    bodyBuild: 'compact-tall-narrow-grounded-fey-harrier',
    skin: 'clay-rose',
    hairStyle: 'none',
    hairColor: 'none',
    expression: 'centered-alert-paired-gaze',
    faceDetail: 'diamond-face-window-dark-eye-sockets-amber-glints-and-mouth-mark',
    headgear: 'connected-angular-diamond-fold-living-mantle',
    outfit: 'plum-pinched-waist-living-folds',
    outfitColor: 'plum-and-copper',
    outfitTier: 'tier2',
    weapon: 'paired-connected-long-forearm-feint',
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
  mirrorfoldHarrier: COLORS,
  alphaPolicy: 'binary-single-component-connected-diamond-mantle-angular-shoulders-centered-face-pinched-waist-paired-long-forearms-bent-separated-legs-and-grounded-wedge-feet',
  effectBoundary: 'external-copied-actor-silhouettes-alternate-actor-bodies-face-swaps-shed-skins-detached-masks-loose-veil-pieces-afterimages-glow-particles-projectiles-impacts-and-illumination',
  bakedEffects: [],
});

export const EN_E07_MIRRORFOLD_HARRIER_GATE = deepFreeze({
  id: 'en-e07-changeling-mirrorfold-harrier-full-v1',
  status: 'approved',
  baseCheckpoint: '5eabfecc08f992db675b64ea3317eb59f67d737c',
  authorizedOn: '2026-08-11',
  authorizationEvidence: 'After the exact repaired Veilskin Foundling was visually approved, committed, pushed, and reconciled at clean published checkpoint 5eabfecc08f992db675b64ea3317eb59f67d737c, the designer replied: lets do next. Veilskin Foundling completed the frozen common Changeling role, so the one-complete-sprite cadence authorizes only one private specialist Changeling Mirrorfold Harrier 80-frame candidate.',
  approvedOn: '2026-08-11',
  approvalEvidence: 'The exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, the approved Veilskin Foundling, Pale Echo, and Falseface Adept comparison, and synchronized GIF evidence were presented after the early Foundling-like scaffold was corrected before freeze. The three exact frozen PNG boards were open together in responsive Aseprite 1.3.17.2 process 40804, whose live command line named all three paths. The designer replied: approved lets do next. Approval applies only to candidate digest be3e4d03263929ce9677fcf15b742cde769271d037160cd6461b45ea389660f2. Registration, fixtures, runtime copying, effects, Kelpie, release, and EN-E08 remain separate gates.',
  approvedImplementation: 'ab72a9c0600f016439a5351f363b3b34348dc4b1',
  publicationAuthorizedOn: '2026-08-11',
  publicationAuthorizationEvidence: 'The designer said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact artifact or digest. It does not authorize registration, fixtures, runtime copying, effects, later families, release, or any other unopened gate.',
  publishedImplementation: null,
  publishedApprovalRecord: null,
  initialPublishedHandoff: null,
  publicationState: 'approved-local',
  precedingApproval: {
    gateId: EN_E07_VEILSKIN_FOUNDLING_GATE.id,
    artifactSha256: EN_E07_VEILSKIN_FOUNDLING_GATE.artifactSha256,
    assembledArtifactSha256: EN_E07_VEILSKIN_FOUNDLING_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E07_VEILSKIN_FOUNDLING_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E07_VEILSKIN_FOUNDLING_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E07_VEILSKIN_FOUNDLING_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E07_VEILSKIN_FOUNDLING_GATE.candidateFrameDigest,
    publishedImplementation: EN_E07_VEILSKIN_FOUNDLING_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E07_VEILSKIN_FOUNDLING_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E07_VEILSKIN_FOUNDLING_GATE.initialPublishedHandoff,
    currentReconciliation: '5eabfecc08f992db675b64ea3317eb59f67d737c',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e07-changeling-mirrorfold-harrier/en-e07-changeling-mirrorfold-harrier-full-suite-raw.png',
  artifactSha256: 'e20cf180e46770d0ce8f12f9695067985954d798922c542acaaa14a585b8c834',
  assembledArtifact: 'enemy-expansion-review/en-e07-changeling-mirrorfold-harrier/en-e07-changeling-mirrorfold-harrier-full-suite-complete-b-form.png',
  assembledArtifactSha256: '27ddbd6b642ff7c8e5f434a4e816f91c7db07935642967d3462bbf8c8c996bfb',
  comparisonArtifact: 'enemy-expansion-review/en-e07-changeling-mirrorfold-harrier/en-e07-changeling-mirrorfold-harrier-family-comparison.png',
  comparisonArtifactSha256: '56293d0aa4c00fe628cf6ad0b6e5b7278278a7a645606cecac5ba58a56a9e433',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e07-changeling-mirrorfold-harrier/en-e07-changeling-mirrorfold-harrier-full-suite-four-directions-labeled.gif',
      sha256: '58353c0cd5564e7fa8bd6d32859d7c6e07fdf94f203213a5cc18c48deb1fcb63',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e07-changeling-mirrorfold-harrier/en-e07-changeling-mirrorfold-harrier-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '2e0f5ed576878e6b9f4e49e056c84b892e9ea93589e07aa9b6fe7a8b745e9e29',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
  },
  candidateFrameDigest: 'be3e4d03263929ce9677fcf15b742cde769271d037160cd6461b45ea389660f2',
  veilskinFoundlingComparisonDigest: 'e472931d214d369331d6cb750619471d9234ab11561233e700facab6ea4f0126',
  paleEchoComparisonDigest: 'c3fa12cb4bb0be432e955adfc32f331286e55c65cbd7a38250bdf0d120fa6596',
  falsefaceAdeptComparisonDigest: '16289e68776f0f93d8238d19a3538c4e92e77e108686f8ddfec01b1a783080c6',
  scope: 'One complete 80-frame Mirrorfold Harrier specialist Changeling across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle tightens and relaxes the connected diamond mantle around one centered face. Walk uses four narrow alternating cross-steps with opposed shoulder-fold and paired-arm motion. Attack crosses both connected wrists beneath the face, opens the paired long forearms into an angular feint, drives one connected lead-hand harry, and resets the authored specialist form. Hurt uses a complete white recoil and colored closed-mantle brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and approved Veilskin Foundling, Pale Echo, and Falseface Adept silhouette comparisons together.',
  exclusions: [
    'changes to approved Veilskin Foundling rendered pixels',
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
    'Changeling elite',
    'Kelpie',
    'EN-E08 and later work',
  ],
  nextGate: 'The exact Mirrorfold Harrier digest is visually approved and its implementation is published. Complete the bounded approval-record and current-state reconciliation first; after that remote-verified stop, the same designer reply opens only one private elite Changeling candidate. Registration, fixtures, runtime copying, effects, Kelpie, release, and EN-E08 remain closed.',
});

export const EN_E07_MIRRORFOLD_HARRIER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const WALK_PHASES = deepFreeze([
  { name: 'left-wedge-cross-step', pose: 'walk', bob: 0, step: -1, arm: 1, fold: -1 },
  { name: 'high-diamond-pass', pose: 'walk', bob: -1, step: 0, arm: -1, fold: 1 },
  { name: 'right-wedge-cross-step', pose: 'walk', bob: 0, step: 1, arm: -1, fold: 1 },
  { name: 'low-mantle-settle', pose: 'walk', bob: 1, step: 0, arm: 1, fold: -1 },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'crossed-wrist-face-guard', pose: 'cross', bob: 0, step: 0, arm: 0, fold: 1 },
  { name: 'paired-angular-feint-open', pose: 'open', bob: -1, step: 0, arm: -1, fold: 1 },
  { name: 'connected-lead-hand-harry', pose: 'harry', bob: 0, step: 1, arm: 1, fold: -1 },
  { name: 'authored-mirrorfold-reset', pose: 'reset', bob: 1, step: 0, arm: 0, fold: -1 },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-diamond-recoil', pose: 'hurt', bob: 0, step: -1, arm: 0, fold: 1, flash: true },
  { name: 'colored-closed-mantle-brace', pose: 'brace', bob: 1, step: 0, arm: -1, fold: -1, flash: false },
]);

function createPixels() {
  return new Array(SIZE * SIZE).fill(null);
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Mirrorfold Harrier rectangles must use positive integer geometry.',
    );
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Mirrorfold Harrier authored pixels must remain inside the 24x24 cell.');
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
  const spread = phase.fold > 0 ? 1 : 0;
  paint.rect(11, 2 + y, 2, 1, COLORS.accent[2]);
  paint.rect(9, 3 + y, 6, 2, COLORS.veil[0]);
  paint.rect(7 - spread, 5 + y, 10 + (spread * 2), 2, COLORS.veil[0]);
  paint.rect(5 - spread, 7 + y, 14 + (spread * 2), 2, COLORS.veil[0]);
  paint.rect(3 - spread, 9 + y, 18 + (spread * 2), 1, COLORS.veil[0]);
  paint.rect(5 - spread, 10 + y, 14 + (spread * 2), 2, COLORS.veil[1]);
  paint.rect(7, 12 + y, 10, 2, COLORS.veil[1]);
  paint.dot(3 - spread, 9 + y, COLORS.veil[2]);
  paint.dot(20 + spread, 9 + y, COLORS.accent[2]);
  paint.dot(6 - spread, 11 + y, COLORS.accent[0]);
  paint.dot(17 + spread, 11 + y, COLORS.veil[2]);
  if (rear) {
    paint.rect(9, 5 + y, 6, 7, COLORS.veil[1]);
    paint.rect(11, 4 + y, 2, 10, COLORS.accent[1]);
    paint.dot(9, 7 + y, COLORS.veil[2]);
    paint.dot(14, 9 + y, COLORS.accent[2]);
  } else {
    paint.rect(9, 5 + y, 6, 6, COLORS.skin[0]);
    paint.rect(10, 6 + y, 4, 4, COLORS.skin[2]);
    paint.rect(9, 7 + y, 2, 1, COLORS.feature);
    paint.rect(13, 7 + y, 2, 1, COLORS.feature);
    paint.dot(10, 7 + y, COLORS.eye);
    paint.dot(13, 7 + y, COLORS.eye);
    paint.dot(12, 8 + y, COLORS.accent[0]);
    paint.rect(11, 9 + y, 2, 1, COLORS.feature);
    paint.rect(10, 10 + y, 4, 1, COLORS.skin[1]);
  }
}

function drawFrontArms(paint, phase, y) {
  if (phase.pose === 'cross') {
    paint.rect(5, 10 + y, 6, 4, COLORS.fold[1]);
    paint.rect(8, 12 + y, 5, 3, COLORS.skin[0]);
    paint.rect(13, 10 + y, 6, 4, COLORS.fold[1]);
    paint.rect(11, 12 + y, 5, 3, COLORS.skin[0]);
    paint.dot(10, 13 + y, COLORS.skin[2]);
    paint.dot(13, 13 + y, COLORS.skin[2]);
  } else if (phase.pose === 'open') {
    paint.rect(3, 10 + y, 7, 3, COLORS.fold[1]);
    paint.rect(2, 12 + y, 6, 3, COLORS.skin[0]);
    paint.rect(14, 10 + y, 7, 3, COLORS.fold[1]);
    paint.rect(16, 12 + y, 6, 3, COLORS.skin[0]);
    paint.dot(2, 14 + y, COLORS.skin[2]);
    paint.dot(21, 14 + y, COLORS.skin[2]);
  } else if (phase.pose === 'harry') {
    paint.rect(6, 11 + y, 6, 4, COLORS.fold[1]);
    paint.rect(9, 13 + y, 5, 3, COLORS.skin[0]);
    paint.rect(14, 9 + y, 7, 4, COLORS.fold[1]);
    paint.rect(18, 12 + y, 5, 3, COLORS.skin[0]);
    paint.dot(22, 14 + y, COLORS.accent[2]);
  } else if (phase.pose === 'brace' || phase.pose === 'reset') {
    paint.rect(5, 10 + y, 4, 7, COLORS.fold[1]);
    paint.rect(7, 15 + y, 4, 3, COLORS.skin[0]);
    paint.rect(15, 10 + y, 4, 7, COLORS.fold[1]);
    paint.rect(13, 15 + y, 4, 3, COLORS.skin[0]);
  } else {
    const swing = phase.arm || 0;
    paint.rect(4, 9 + y, 3, 7, COLORS.fold[1]);
    paint.rect(3, 14 + y + Math.max(swing, 0), 3, 5, COLORS.skin[0]);
    paint.rect(17, 9 + y, 3, 7, COLORS.fold[1]);
    paint.rect(18, 14 + y + Math.max(-swing, 0), 3, 5, COLORS.skin[0]);
    paint.dot(3, 18 + y + Math.max(swing, 0), COLORS.skin[2]);
    paint.dot(20, 18 + y + Math.max(-swing, 0), COLORS.skin[2]);
  }
}

function drawFrontBody(paint, rear, phase) {
  const y = phase.bob || 0;
  const step = phase.step || 0;
  paint.rect(8, 10 + y, 8, 2, COLORS.fold[0]);
  paint.rect(9, 12 + y, 6, 3, COLORS.fold[0]);
  paint.rect(10, 14 + y, 4, 5, COLORS.fold[2]);
  paint.rect(12, 13 + y, 3, 5, COLORS.accent[0]);
  paint.rect(11, 11 + y, 2, 8, COLORS.accent[1]);
  paint.dot(10, 15 + y, COLORS.veil[2]);
  paint.dot(13, 16 + y, COLORS.accent[2]);
  if (rear) {
    paint.rect(9, 12 + y, 2, 6, COLORS.fold[1]);
    paint.rect(13, 12 + y, 2, 6, COLORS.accent[1]);
  }
  drawFrontArms(paint, phase, y);

  const leftX = 9 + Math.min(step, 0);
  const rightX = 13 + Math.max(step, 0);
  paint.rect(leftX, 17, 2, 5, COLORS.fold[1]);
  paint.rect(rightX, 17, 2, 5, COLORS.accent[1]);
  paint.rect(leftX - 2, 21, 4, 2, COLORS.veil[1]);
  paint.rect(rightX, 21, 4, 2, COLORS.veil[0]);
  paint.dot(leftX - 2, 22, COLORS.veil[2]);
  paint.dot(rightX + 3, 22, COLORS.accent[2]);
}

function drawRightMantle(paint, phase) {
  const y = phase.bob || 0;
  const spread = phase.fold > 0 ? 1 : 0;
  paint.rect(12, 2 + y, 2, 1, COLORS.accent[2]);
  paint.rect(9, 3 + y, 6, 2, COLORS.veil[0]);
  paint.rect(7 - spread, 5 + y, 10 + spread, 2, COLORS.veil[0]);
  paint.rect(5 - spread, 7 + y, 14 + spread, 2, COLORS.veil[0]);
  paint.rect(3 - spread, 9 + y, 18 + spread, 1, COLORS.veil[0]);
  paint.rect(5 - spread, 10 + y, 14 + spread, 2, COLORS.veil[1]);
  paint.rect(8, 12 + y, 9, 2, COLORS.veil[1]);
  paint.rect(13, 5 + y, 5, 6, COLORS.skin[0]);
  paint.rect(14, 6 + y, 4, 4, COLORS.skin[2]);
  paint.rect(15, 7 + y, 2, 1, COLORS.feature);
  paint.dot(16, 7 + y, COLORS.eye);
  paint.dot(18, 8 + y, COLORS.accent[0]);
  paint.rect(13, 10 + y, 3, 1, COLORS.skin[1]);
  paint.dot(17, 9 + y, COLORS.feature);
  paint.dot(3 - spread, 9 + y, COLORS.veil[2]);
  paint.dot(6 - spread, 11 + y, COLORS.accent[2]);
}

function drawRightArms(paint, phase, y) {
  if (phase.pose === 'cross') {
    paint.rect(6, 10 + y, 6, 5, COLORS.fold[1]);
    paint.rect(10, 12 + y, 5, 3, COLORS.skin[0]);
    paint.rect(14, 10 + y, 5, 5, COLORS.fold[1]);
    paint.rect(12, 11 + y, 5, 3, COLORS.skin[0]);
  } else if (phase.pose === 'open') {
    paint.rect(6, 10 + y, 5, 6, COLORS.fold[1]);
    paint.rect(5, 14 + y, 5, 3, COLORS.skin[0]);
    paint.rect(14, 9 + y, 7, 4, COLORS.fold[1]);
    paint.rect(18, 12 + y, 5, 3, COLORS.skin[0]);
    paint.dot(22, 14 + y, COLORS.skin[2]);
  } else if (phase.pose === 'harry') {
    paint.rect(6, 10 + y, 5, 6, COLORS.fold[1]);
    paint.rect(7, 14 + y, 5, 3, COLORS.skin[0]);
    paint.rect(14, 8 + y, 8, 4, COLORS.fold[1]);
    paint.rect(18, 11 + y, 5, 4, COLORS.skin[0]);
    paint.dot(22, 14 + y, COLORS.accent[2]);
  } else if (phase.pose === 'brace' || phase.pose === 'reset') {
    paint.rect(6, 10 + y, 4, 7, COLORS.fold[1]);
    paint.rect(7, 15 + y, 4, 3, COLORS.skin[0]);
    paint.rect(15, 10 + y, 4, 7, COLORS.fold[1]);
    paint.rect(13, 15 + y, 4, 3, COLORS.skin[0]);
  } else {
    const swing = phase.arm || 0;
    paint.rect(4, 9 + y, 3, 7, COLORS.fold[1]);
    paint.rect(3, 14 + y + Math.max(swing, 0), 3, 5, COLORS.skin[0]);
    paint.rect(17, 9 + y, 3, 7, COLORS.fold[1]);
    paint.rect(18, 14 + y + Math.max(-swing, 0), 3, 5, COLORS.skin[0]);
    paint.dot(20, 18 + y + Math.max(-swing, 0), COLORS.skin[2]);
  }
}

function drawRightBody(paint, phase) {
  const y = phase.bob || 0;
  const step = phase.step || 0;
  paint.rect(9, 10 + y, 7, 2, COLORS.fold[0]);
  paint.rect(10, 12 + y, 5, 3, COLORS.fold[0]);
  paint.rect(10, 14 + y, 4, 5, COLORS.fold[2]);
  paint.rect(12, 13 + y, 3, 5, COLORS.accent[0]);
  paint.rect(11, 11 + y, 2, 8, COLORS.accent[1]);
  paint.dot(10, 15 + y, COLORS.veil[2]);
  drawRightArms(paint, phase, y);

  const farX = 9 + Math.min(step, 0);
  const nearX = 13 + Math.max(step, 0);
  paint.rect(farX, 17, 2, 5, COLORS.fold[1]);
  paint.rect(nearX, 17, 2, 5, COLORS.accent[1]);
  paint.rect(farX - 2, 21, 4, 2, COLORS.veil[1]);
  paint.rect(nearX, 21, 4, 2, COLORS.veil[0]);
  paint.dot(farX - 2, 22, COLORS.veil[2]);
  paint.dot(nearX + 3, 22, COLORS.accent[2]);
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
    assert(frame === 0 || frame === 1, 'Mirrorfold Harrier Idle frame ' + frame + ' is out of range.');
    phase = frame === 0
      ? { name: 'centered-diamond-watch', pose: 'idle', bob: 0, step: 0, arm: -1, fold: -1 }
      : { name: 'living-mirrorfold-tighten', pose: 'idle', bob: 0, step: 0, arm: 1, fold: 1 };
  } else if (animation === 'walk') {
    phase = WALK_PHASES[frame];
  } else if (animation === 'attack' || animation === 'cast') {
    phase = ATTACK_PHASES[frame];
  } else if (animation === 'hurt') {
    phase = HURT_PHASES[frame];
  } else if (animation === 'death') {
    phase = HURT_PHASES[EN_E07_MIRRORFOLD_HARRIER_DEATH_SOURCE_FRAMES[frame]];
  }
  assert(phase, 'Mirrorfold Harrier animation ' + animation + ' frame ' + frame + ' is out of range.');

  let pixels = createPixels();
  const paint = painter(pixels);
  if (canonicalDirection === 'right') {
    drawRightBody(paint, phase);
    drawRightMantle(paint, phase);
  } else {
    const rear = canonicalDirection === 'up';
    drawFrontBody(paint, rear, phase);
    drawFrontMantle(paint, rear, phase);
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

export function renderEnE07MirrorfoldHarrierFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Mirrorfold Harrier rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Mirrorfold Harrier direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'changeling',
    variant: 'mirrorfold-harrier',
    direction,
    animation,
    frame,
    phase: phase.name,
    mirrorfoldHarrierGate: EN_E07_MIRRORFOLD_HARRIER_GATE.id,
    approvedPrecedingGate: EN_E07_VEILSKIN_FOUNDLING_GATE.id,
    alphaPolicy: EN_E07_MIRRORFOLD_HARRIER_DATA.alphaPolicy,
    effectBoundary: EN_E07_MIRRORFOLD_HARRIER_DATA.effectBoundary,
  });
}

export const EN_E07_MIRRORFOLD_HARRIER_RENDERER = deepFreeze({
  key: 'en-e07-changeling-mirrorfold-harrier-v1',
  chassis: EN_E07_MIRRORFOLD_HARRIER_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'changeling', 'The EN-E07 Mirrorfold Harrier renderer is restricted to Changeling.');
    assert(variant.id === 'mirrorfold-harrier', 'The EN-E07 Mirrorfold Harrier renderer is restricted to Mirrorfold Harrier.');
    return renderEnE07MirrorfoldHarrierFrame(context, direction, animation.id, frame);
  },
});

const MIRRORFOLD_HARRIER_VARIANT = deepFreeze({
  id: 'mirrorfold-harrier',
  name: 'Mirrorfold Harrier',
  role: EN_E07_MIRRORFOLD_HARRIER_CONTRACT.role,
  status: EN_E07_MIRRORFOLD_HARRIER_CONTRACT.state,
  brief: 'A private complete specialist Changeling with one connected diamond-fold mantle, angular shoulders, a centered readable face, plum-copper pinched folds, paired long ordinary forearms, bent legs, and grounded wedge feet; copied actors, alternate bodies, detached masks, loose morph pieces, glow, and particles remain external.',
  rendererData: EN_E07_MIRRORFOLD_HARRIER_DATA,
});

export const EN_E07_MIRRORFOLD_HARRIER_FAMILY = deepFreeze({
  id: 'changeling',
  name: 'Changeling Mirrorfold Harrier Review',
  sliceId: 'EN-E07',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E07_MIRRORFOLD_HARRIER_CONTRACT.chassis,
  rendererKey: EN_E07_MIRRORFOLD_HARRIER_RENDERER.key,
  variants: [MIRRORFOLD_HARRIER_VARIANT],
  rendererData: {
    contractCard: EN_E07_MIRRORFOLD_HARRIER_CONTRACT_CARD.id,
    approvedPrecedingGate: EN_E07_VEILSKIN_FOUNDLING_GATE.id,
    activeGate: EN_E07_MIRRORFOLD_HARRIER_GATE.id,
  },
  review: {
    baselineVariant: 'mirrorfold-harrier',
    scale: 8,
    notes: 'Visually approved as one compact grounded authored Mirrorfold Harrier against approved Veilskin Foundling, Pale Echo, and Falseface Adept. Publish only the bounded approval and reconciliation tuple; after remote verification, open only one private elite Changeling candidate. Keep registration, fixtures, runtime copying, effects, Kelpie, and later Wave 2 work separate.',
  },
});

export const EN_E07_MIRRORFOLD_HARRIER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E07_MIRRORFOLD_HARRIER_RENDERER],
  families: [EN_E07_MIRRORFOLD_HARRIER_FAMILY],
});
