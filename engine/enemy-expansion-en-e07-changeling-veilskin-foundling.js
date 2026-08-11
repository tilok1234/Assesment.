import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E07_MIRECROWN_BEACON_GATE,
} from './enemy-expansion-en-e07-will-o-wisp-mirecrown-beacon.js';

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
  skin: ['#d1a48e', '#956d6c', '#efc5aa'],
  veil: ['#4f776e', '#304f4b', '#79a193'],
  fold: ['#9b6b43', '#654738', '#c19161'],
  accent: ['#b45d70', '#773f55', '#df8790'],
  feature: '#26323a',
  eye: '#f1d477',
  flash: '#f4f4f4',
});

export const EN_E07_CHANGELING_CONTRACT_CARD = deepFreeze({
  id: 'en-e07-changeling-v1',
  sliceId: 'EN-E07',
  family: 'changeling',
  familyName: 'Changeling',
  roleOrder: ['common', 'specialist', 'elite'],
  activeVariant: {
    id: 'veilskin-foundling',
    name: 'Veilskin Foundling',
    role: 'common',
    status: 'implemented-full-approved',
  },
  deferredRoles: ['specialist', 'elite'],
  styleContract: 'Use chunky one-to-three-pixel hard-alpha forms and an authored small grounded fey default body. Keep one centered readable face inside a connected living veil, paired ordinary arms, bowed legs, and splayed feet. Do not copy a player, public enemy, or approved Doppelganger sprite into the authored sheet.',
  effectBoundary: 'Copied actor silhouettes, alternate actor bodies, face swaps, shed skins, detached masks, loose veil pieces, afterimages, glow, particles, projectiles, impacts, and illumination remain external.',
});

export const EN_E07_VEILSKIN_FOUNDLING_CONTRACT = deepFreeze({
  sliceId: 'EN-E07',
  family: 'changeling',
  variant: 'veilskin-foundling',
  role: 'common',
  state: 'implemented-complete-motion-approved',
  chassis: 'small-pear-veil-centered-face-paired-arms-bowed-legs-splayed-feet-grounded-fey-v1',
  silhouette: 'A small grounded authored fey impostor with a connected pear-shaped living veil, one centered face, narrow folded torso, two short paired ordinary arms, bowed separated legs, and broad splayed feet. It must not collapse into the adult Pale Echo humanoid, a Goblin ear bar, an Imp horn bar, a winged Fairy, a detached mask, or a copied actor.',
  identity: 'Muted green veil flesh, clay-rose face and hands, ochre body folds, coral living seams, dark eye sockets with amber glints, one centered paired gaze, and symmetrical connected rake motion establish a self-contained default Changeling form without promising runtime actor copying in the assembler.',
  effectBoundary: EN_E07_CHANGELING_CONTRACT_CARD.effectBoundary,
});

export const EN_E07_VEILSKIN_FOUNDLING_DATA = deepFreeze({
  actor: {
    species: 'authored-changeling-default',
    bodyBuild: 'small-grounded-fey-impostor',
    skin: 'clay-rose',
    hairStyle: 'none',
    hairColor: 'none',
    expression: 'centered-paired-gaze',
    faceDetail: 'single-face-window-dark-eye-sockets-amber-glints-and-mouth-mark',
    headgear: 'connected-pear-shaped-living-veil',
    outfit: 'ochre-layered-skin-folds',
    outfitColor: 'ochre-and-coral',
    outfitTier: 'tier1',
    weapon: 'paired-connected-short-hand-rake',
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
  veilskinFoundling: COLORS,
  alphaPolicy: 'binary-single-component-connected-pear-veil-centered-face-narrow-folded-torso-paired-short-arms-bowed-separated-legs-and-grounded-splayed-feet',
  effectBoundary: 'external-copied-actor-silhouettes-alternate-actor-bodies-face-swaps-shed-skins-detached-masks-loose-veil-pieces-afterimages-glow-particles-projectiles-impacts-and-illumination',
  bakedEffects: [],
});

export const EN_E07_VEILSKIN_FOUNDLING_GATE = deepFreeze({
  id: 'en-e07-changeling-veilskin-foundling-full-v1',
  status: 'approved',
  baseCheckpoint: '4ee32622ec2984ac805ac345b854f23584fda3c3',
  authorizedOn: '2026-08-11',
  authorizationEvidence: 'After the exact Mirecrown Beacon was visually approved, committed, pushed, and reconciled at clean published checkpoint 4ee32622ec2984ac805ac345b854f23584fda3c3, the designer replied: approved lets do next. Mirecrown completed the frozen Will-o-Wisp role order, so the one-complete-sprite cadence authorizes only one private common Changeling Veilskin Foundling 80-frame candidate.',
  repairRequestedOn: '2026-08-11',
  repairRequestEvidence: 'After reviewing candidate digest 1a852ef46dcaa7fee5779379cb9eda9acd79e67cd53dd469ff9cfae9dc18844d, the designer said: could need a more readable face. That packet is superseded as approval evidence; the repair is restricted to connected dark eye sockets, retained amber glints, and a tiny mouth mark without changing silhouette, body, or motion.',
  supersededCandidateFrameDigest: '1a852ef46dcaa7fee5779379cb9eda9acd79e67cd53dd469ff9cfae9dc18844d',
  approvedOn: '2026-08-11',
  approvalEvidence: 'After the face-readability repair, the exact revised labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, the approved Pale Echo plus public Goblin Scout and Imp Sprite comparison, and paired GIF evidence were presented, and the three exact revised frozen PNG boards were opened together in a fresh responsive Aseprite 1.3.17.2 process whose live command line named all three paths. The designer replied: approved. Approval applies only to repaired candidate digest e472931d214d369331d6cb750619471d9234ab11561233e700facab6ea4f0126; superseded digest 1a852ef46dcaa7fee5779379cb9eda9acd79e67cd53dd469ff9cfae9dc18844d is not approval evidence. Changeling registration, fixtures, runtime copying, effects, later roles and families, release, and EN-E08 remain separate gates.',
  approvedImplementation: '2a295aa70c8a6680ffb85881efa4ccd927a50979',
  publicationAuthorizedOn: '2026-08-11',
  publicationAuthorizationEvidence: 'The designer said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact artifact or digest. It does not authorize registration, fixtures, runtime copying, effects, later roles or families, release, or any other unopened gate.',
  publishedImplementation: null,
  publishedApprovalRecord: null,
  initialPublishedHandoff: null,
  publicationState: 'authorized-pending-bounded-publication',
  precedingApproval: {
    gateId: EN_E07_MIRECROWN_BEACON_GATE.id,
    artifactSha256: EN_E07_MIRECROWN_BEACON_GATE.artifactSha256,
    assembledArtifactSha256: EN_E07_MIRECROWN_BEACON_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E07_MIRECROWN_BEACON_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E07_MIRECROWN_BEACON_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E07_MIRECROWN_BEACON_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E07_MIRECROWN_BEACON_GATE.candidateFrameDigest,
    publishedImplementation: EN_E07_MIRECROWN_BEACON_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E07_MIRECROWN_BEACON_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E07_MIRECROWN_BEACON_GATE.initialPublishedHandoff,
    currentReconciliation: '4ee32622ec2984ac805ac345b854f23584fda3c3',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e07-changeling-veilskin-foundling/en-e07-changeling-veilskin-foundling-full-suite-raw.png',
  artifactSha256: '795f6eb56dba256c78295e0543ce2282d680e42fc5ac907534ee30198fbb5485',
  assembledArtifact: 'enemy-expansion-review/en-e07-changeling-veilskin-foundling/en-e07-changeling-veilskin-foundling-full-suite-complete-b-form.png',
  assembledArtifactSha256: 'e636c9122dd17b1ed901c0afc821256b6dabae4a3b560003720d05d4e40d67f1',
  comparisonArtifact: 'enemy-expansion-review/en-e07-changeling-veilskin-foundling/en-e07-changeling-veilskin-foundling-family-comparison.png',
  comparisonArtifactSha256: 'a323ac1b863d8168cc0d3ad4726d2c220cd2c909cd18a90a589fcdd0ac2153f5',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e07-changeling-veilskin-foundling/en-e07-changeling-veilskin-foundling-full-suite-four-directions-labeled.gif',
      sha256: 'd4fd3f0ab7f3cd0dc9f44dbaee576a7fdc178ea86dda71d5265cb14194b57aac',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e07-changeling-veilskin-foundling/en-e07-changeling-veilskin-foundling-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '55234484dde64a8b7a90dcb7c24acc8505f351c0e69b9aea8182a6e93093cfdd',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
  },
  candidateFrameDigest: 'e472931d214d369331d6cb750619471d9234ab11561233e700facab6ea4f0126',
  paleEchoComparisonDigest: 'c3fa12cb4bb0be432e955adfc32f331286e55c65cbd7a38250bdf0d120fa6596',
  goblinScoutComparisonDigest: '0582534e2f5fad7ba5059fb6936e9ceafbdca9dc0bcda257a36de6f98e9eb263',
  impSpriteComparisonDigest: '4da080ba4f29edc0c25de03e2a71303f5567ca0ac9ce8956c92b9591ecb5dcf6',
  scope: 'One complete 80-frame Veilskin Foundling common Changeling across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle flexes the connected pear veil around one centered face while the layered torso settles. Walk uses four crouched alternating steps with opposed veil-fold and paired-arm motion. Attack draws both connected hands beneath the face, extends both short forearms symmetrically, opens into one connected two-hand rake, and resets the authored default form. Hurt uses a complete white recoil and colored closed-veil brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and approved Pale Echo plus public Goblin Scout and Imp Sprite silhouette comparisons together.',
  exclusions: [
    'changes to approved Mirecrown Beacon rendered pixels',
    'changes to approved Will-o-Wisp, Doppelganger, or Living Shadow rendered pixels',
    'public Changeling registration',
    'public catalog exposure',
    'asset-pack fixture generation or regeneration',
    'runtime actor copying',
    'new Cast pixels',
    'new Death pixels',
    'copied actor silhouettes',
    'alternate actor bodies',
    'adult Doppelganger silhouette',
    'offset eyes',
    'connected long-finger mimic hand',
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
    'Changeling specialist or elite',
    'Kelpie',
    'EN-E08 and later work',
  ],
  nextGate: 'The repaired Veilskin Foundling digest is visually approved; implementation 2a295aa70c8a6680ffb85881efa4ccd927a50979 and approval record 7d064226d9a0096f8b276f5b0bd30be93435962b are remote verified. Standing publication permission opens only the bounded initial-handoff and final-reconciliation commits plus branch pushes. No specialist Changeling, registration, fixtures, runtime copying, effects, Kelpie, release, or EN-E08 gate is open; a separate designer lets do next is required before another candidate begins.',
});

export const EN_E07_VEILSKIN_FOUNDLING_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const WALK_PHASES = deepFreeze([
  { name: 'left-splayed-step', pose: 'walk', bob: 0, step: -1, arm: 1, veil: -1 },
  { name: 'high-veil-pass', pose: 'walk', bob: -1, step: 0, arm: -1, veil: 1 },
  { name: 'right-splayed-step', pose: 'walk', bob: 0, step: 1, arm: -1, veil: 1 },
  { name: 'low-fold-settle', pose: 'walk', bob: 1, step: 0, arm: 1, veil: -1 },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'paired-hand-draw', pose: 'draw', bob: 0, step: 0, arm: 0, veil: 1 },
  { name: 'symmetric-forearm-extension', pose: 'extend', bob: -1, step: 0, arm: 1, veil: -1 },
  { name: 'connected-two-hand-rake', pose: 'rake', bob: 0, step: 1, arm: -1, veil: 0 },
  { name: 'authored-veilskin-reset', pose: 'reset', bob: 1, step: 0, arm: 0, veil: -1 },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-veil-recoil', pose: 'hurt', bob: 0, step: -1, arm: 0, veil: 1, flash: true },
  { name: 'colored-closed-veil-brace', pose: 'brace', bob: 1, step: 0, arm: -1, veil: -1, flash: false },
]);

function createPixels() {
  return new Array(SIZE * SIZE).fill(null);
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Veilskin Foundling rectangles must use positive integer geometry.',
    );
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Veilskin Foundling authored pixels must remain inside the 24x24 cell.');
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

function drawFrontVeil(paint, rear, phase) {
  const y = phase.bob || 0;
  const spread = phase.veil > 0 ? 1 : 0;
  paint.rect(10, 3 + y, 4, 1, COLORS.veil[2]);
  paint.rect(8 - spread, 4 + y, 8 + (spread * 2), 2, COLORS.veil[0]);
  paint.rect(6 - spread, 6 + y, 12 + (spread * 2), 4, COLORS.veil[0]);
  paint.rect(5 - spread, 8 + y, 3, 5, COLORS.veil[1]);
  paint.rect(16 + spread, 8 + y, 3, 5, COLORS.veil[1]);
  paint.rect(7 - spread, 10 + y, 10 + (spread * 2), 3, COLORS.veil[1]);
  paint.dot(6 - spread, 9 + y, COLORS.veil[2]);
  paint.dot(17 + spread, 9 + y, COLORS.accent[2]);
  if (rear) {
    paint.rect(9, 6 + y, 6, 5, COLORS.veil[1]);
    paint.rect(11, 5 + y, 2, 7, COLORS.accent[1]);
    paint.dot(10, 7 + y, COLORS.veil[2]);
    paint.dot(13, 9 + y, COLORS.accent[2]);
  } else {
    paint.rect(9, 6 + y, 6, 5, COLORS.skin[0]);
    paint.rect(10, 7 + y, 4, 3, COLORS.skin[2]);
    paint.rect(9, 8 + y, 2, 1, COLORS.feature);
    paint.rect(13, 8 + y, 2, 1, COLORS.feature);
    paint.dot(10, 8 + y, COLORS.eye);
    paint.dot(13, 8 + y, COLORS.eye);
    paint.rect(11, 10 + y, 2, 2, COLORS.skin[1]);
    paint.dot(12, 9 + y, COLORS.accent[0]);
    paint.rect(11, 10 + y, 2, 1, COLORS.feature);
  }
}

function drawFrontArms(paint, phase, y) {
  if (phase.pose === 'draw') {
    paint.rect(6, 11 + y, 4, 5, COLORS.fold[1]);
    paint.rect(8, 10 + y, 4, 4, COLORS.skin[0]);
    paint.rect(14, 11 + y, 4, 5, COLORS.fold[1]);
    paint.rect(12, 10 + y, 4, 4, COLORS.skin[0]);
    paint.dot(10, 11 + y, COLORS.skin[2]);
    paint.dot(13, 11 + y, COLORS.skin[2]);
  } else if (phase.pose === 'extend') {
    paint.rect(3, 11 + y, 7, 4, COLORS.fold[1]);
    paint.rect(2, 14 + y, 5, 3, COLORS.skin[0]);
    paint.rect(14, 11 + y, 7, 4, COLORS.fold[1]);
    paint.rect(17, 14 + y, 5, 3, COLORS.skin[0]);
    paint.dot(2, 16 + y, COLORS.skin[2]);
    paint.dot(21, 16 + y, COLORS.skin[2]);
  } else if (phase.pose === 'rake') {
    paint.rect(2, 10 + y, 8, 4, COLORS.fold[1]);
    paint.rect(2, 13 + y, 4, 4, COLORS.skin[0]);
    paint.dot(2, 17 + y, COLORS.accent[2]);
    paint.rect(14, 10 + y, 9, 4, COLORS.fold[1]);
    paint.rect(19, 13 + y, 4, 4, COLORS.skin[0]);
    paint.dot(22, 17 + y, COLORS.accent[2]);
  } else if (phase.pose === 'brace' || phase.pose === 'reset') {
    paint.rect(6, 12 + y, 5, 5, COLORS.fold[1]);
    paint.rect(7, 15 + y, 4, 3, COLORS.skin[0]);
    paint.rect(13, 12 + y, 5, 5, COLORS.fold[1]);
    paint.rect(13, 15 + y, 4, 3, COLORS.skin[0]);
  } else {
    const swing = phase.arm || 0;
    paint.rect(5, 12 + y, 4, 5, COLORS.fold[1]);
    paint.rect(4, 15 + y + Math.max(swing, 0), 4, 3, COLORS.skin[0]);
    paint.rect(15, 12 + y, 4, 5, COLORS.fold[1]);
    paint.rect(16, 15 + y + Math.max(-swing, 0), 4, 3, COLORS.skin[0]);
    paint.dot(4, 17 + y + Math.max(swing, 0), COLORS.skin[2]);
    paint.dot(19, 17 + y + Math.max(-swing, 0), COLORS.skin[2]);
  }
}

function drawFrontBody(paint, rear, phase) {
  const y = phase.bob || 0;
  const step = phase.step || 0;
  paint.rect(8, 11 + y, 8, 3, COLORS.fold[0]);
  paint.rect(7, 13 + y, 10, 5, COLORS.fold[0]);
  paint.rect(8, 14 + y, 4, 5, COLORS.fold[2]);
  paint.rect(12, 13 + y, 4, 6, COLORS.accent[0]);
  paint.rect(11, 12 + y, 2, 7, COLORS.accent[1]);
  paint.dot(8, 15 + y, COLORS.veil[2]);
  paint.dot(15, 16 + y, COLORS.accent[2]);
  if (rear) {
    paint.rect(9, 13 + y, 2, 4, COLORS.fold[1]);
    paint.rect(13, 14 + y, 2, 4, COLORS.accent[1]);
  }
  drawFrontArms(paint, phase, y);

  const leftX = 8 + Math.min(step, 0);
  const rightX = 13 + Math.max(step, 0);
  paint.rect(leftX, 17, 3, 5, COLORS.fold[1]);
  paint.rect(rightX, 17, 3, 5, COLORS.accent[1]);
  paint.rect(leftX - 3, 21, 6, 2, COLORS.veil[1]);
  paint.rect(rightX, 21, 6, 2, COLORS.veil[0]);
  paint.dot(leftX - 3, 22, COLORS.veil[2]);
  paint.dot(rightX + 5, 22, COLORS.accent[2]);
}

function drawRightVeil(paint, phase) {
  const y = phase.bob || 0;
  const spread = phase.veil > 0 ? 1 : 0;
  paint.rect(11, 3 + y, 4, 1, COLORS.veil[2]);
  paint.rect(8 - spread, 4 + y, 8 + spread, 2, COLORS.veil[0]);
  paint.rect(7 - spread, 6 + y, 11 + spread, 5, COLORS.veil[0]);
  paint.rect(6 - spread, 8 + y, 4, 5, COLORS.veil[1]);
  paint.rect(9, 10 + y, 8, 3, COLORS.veil[1]);
  paint.rect(13, 6 + y, 5, 5, COLORS.skin[0]);
  paint.rect(14, 7 + y, 4, 3, COLORS.skin[2]);
  paint.rect(17, 8 + y, 2, 2, COLORS.skin[0]);
  paint.rect(15, 8 + y, 2, 1, COLORS.feature);
  paint.dot(16, 8 + y, COLORS.eye);
  paint.dot(18, 9 + y, COLORS.accent[0]);
  paint.rect(13, 10 + y, 2, 2, COLORS.skin[1]);
  paint.dot(17, 10 + y, COLORS.feature);
  paint.dot(7 - spread, 9 + y, COLORS.veil[2]);
}

function drawRightArms(paint, phase, y) {
  if (phase.pose === 'draw') {
    paint.rect(7, 12 + y, 5, 5, COLORS.fold[1]);
    paint.rect(10, 10 + y, 4, 4, COLORS.skin[0]);
    paint.rect(14, 11 + y, 5, 5, COLORS.fold[1]);
    paint.rect(15, 10 + y, 4, 4, COLORS.skin[0]);
  } else if (phase.pose === 'extend') {
    paint.rect(7, 12 + y, 5, 5, COLORS.fold[1]);
    paint.rect(6, 15 + y, 4, 3, COLORS.skin[0]);
    paint.rect(14, 11 + y, 7, 4, COLORS.fold[1]);
    paint.rect(18, 14 + y, 5, 3, COLORS.skin[0]);
    paint.dot(22, 16 + y, COLORS.skin[2]);
  } else if (phase.pose === 'rake') {
    paint.rect(6, 12 + y, 5, 4, COLORS.fold[1]);
    paint.rect(4, 15 + y, 4, 3, COLORS.skin[0]);
    paint.rect(14, 10 + y, 9, 4, COLORS.fold[1]);
    paint.rect(19, 13 + y, 4, 4, COLORS.skin[0]);
    paint.dot(22, 17 + y, COLORS.accent[2]);
  } else if (phase.pose === 'brace' || phase.pose === 'reset') {
    paint.rect(7, 12 + y, 5, 5, COLORS.fold[1]);
    paint.rect(8, 15 + y, 4, 3, COLORS.skin[0]);
    paint.rect(14, 12 + y, 5, 5, COLORS.fold[1]);
    paint.rect(14, 15 + y, 4, 3, COLORS.skin[0]);
  } else {
    const swing = phase.arm || 0;
    paint.rect(7, 12 + y, 4, 5, COLORS.fold[1]);
    paint.rect(6, 15 + y + Math.max(swing, 0), 4, 3, COLORS.skin[0]);
    paint.rect(14, 12 + y, 5, 5, COLORS.fold[1]);
    paint.rect(16, 15 + y + Math.max(-swing, 0), 4, 3, COLORS.skin[0]);
    paint.dot(19, 17 + y + Math.max(-swing, 0), COLORS.skin[2]);
  }
}

function drawRightBody(paint, phase) {
  const y = phase.bob || 0;
  const step = phase.step || 0;
  paint.rect(9, 11 + y, 7, 3, COLORS.fold[0]);
  paint.rect(8, 13 + y, 9, 5, COLORS.fold[0]);
  paint.rect(9, 14 + y, 4, 5, COLORS.fold[2]);
  paint.rect(13, 13 + y, 4, 6, COLORS.accent[0]);
  paint.rect(12, 12 + y, 2, 7, COLORS.accent[1]);
  paint.dot(9, 15 + y, COLORS.veil[2]);
  drawRightArms(paint, phase, y);

  const farX = 8 + Math.min(step, 0);
  const nearX = 13 + Math.max(step, 0);
  paint.rect(farX, 17, 3, 5, COLORS.fold[1]);
  paint.rect(nearX, 17, 3, 5, COLORS.accent[1]);
  paint.rect(farX - 2, 21, 6, 2, COLORS.veil[1]);
  paint.rect(nearX, 21, 6, 2, COLORS.veil[0]);
  paint.dot(farX - 2, 22, COLORS.veil[2]);
  paint.dot(nearX + 5, 22, COLORS.accent[2]);
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
    assert(frame === 0 || frame === 1, 'Veilskin Foundling Idle frame ' + frame + ' is out of range.');
    phase = frame === 0
      ? { name: 'centered-foundling-gaze', pose: 'idle', bob: 0, step: 0, arm: -1, veil: -1 }
      : { name: 'living-veil-flex', pose: 'idle', bob: 0, step: 0, arm: 1, veil: 1 };
  } else if (animation === 'walk') {
    phase = WALK_PHASES[frame];
  } else if (animation === 'attack' || animation === 'cast') {
    phase = ATTACK_PHASES[frame];
  } else if (animation === 'hurt') {
    phase = HURT_PHASES[frame];
  } else if (animation === 'death') {
    phase = HURT_PHASES[EN_E07_VEILSKIN_FOUNDLING_DEATH_SOURCE_FRAMES[frame]];
  }
  assert(phase, 'Veilskin Foundling animation ' + animation + ' frame ' + frame + ' is out of range.');

  let pixels = createPixels();
  const paint = painter(pixels);
  if (canonicalDirection === 'right') {
    drawRightBody(paint, phase);
    drawRightVeil(paint, phase);
  } else {
    const rear = canonicalDirection === 'up';
    drawFrontBody(paint, rear, phase);
    drawFrontVeil(paint, rear, phase);
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

export function renderEnE07VeilskinFoundlingFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Veilskin Foundling rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Veilskin Foundling direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'changeling',
    variant: 'veilskin-foundling',
    direction,
    animation,
    frame,
    phase: phase.name,
    veilskinFoundlingGate: EN_E07_VEILSKIN_FOUNDLING_GATE.id,
    approvedPrecedingGate: EN_E07_MIRECROWN_BEACON_GATE.id,
    alphaPolicy: EN_E07_VEILSKIN_FOUNDLING_DATA.alphaPolicy,
    effectBoundary: EN_E07_VEILSKIN_FOUNDLING_DATA.effectBoundary,
  });
}

export const EN_E07_VEILSKIN_FOUNDLING_RENDERER = deepFreeze({
  key: 'en-e07-changeling-veilskin-foundling-v1',
  chassis: EN_E07_VEILSKIN_FOUNDLING_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'changeling', 'The EN-E07 Veilskin Foundling renderer is restricted to Changeling.');
    assert(variant.id === 'veilskin-foundling', 'The EN-E07 Veilskin Foundling renderer is restricted to Veilskin Foundling.');
    return renderEnE07VeilskinFoundlingFrame(context, direction, animation.id, frame);
  },
});

const VEILSKIN_FOUNDLING_VARIANT = deepFreeze({
  id: 'veilskin-foundling',
  name: 'Veilskin Foundling',
  role: EN_E07_VEILSKIN_FOUNDLING_CONTRACT.role,
  status: EN_E07_VEILSKIN_FOUNDLING_CONTRACT.state,
  brief: 'A private complete common Changeling with a connected pear-shaped living veil, one centered face, narrow ochre-coral folds, paired ordinary arms, bowed legs, and grounded splayed feet; copied actors, alternate bodies, detached masks, loose morph pieces, glow, and particles remain external.',
  rendererData: EN_E07_VEILSKIN_FOUNDLING_DATA,
});

export const EN_E07_VEILSKIN_FOUNDLING_FAMILY = deepFreeze({
  id: 'changeling',
  name: 'Changeling Veilskin Foundling Review',
  sliceId: 'EN-E07',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E07_VEILSKIN_FOUNDLING_CONTRACT.chassis,
  rendererKey: EN_E07_VEILSKIN_FOUNDLING_RENDERER.key,
  variants: [VEILSKIN_FOUNDLING_VARIANT],
  rendererData: {
    contractCard: EN_E07_CHANGELING_CONTRACT_CARD.id,
    approvedPrecedingGate: EN_E07_MIRECROWN_BEACON_GATE.id,
    activeGate: EN_E07_VEILSKIN_FOUNDLING_GATE.id,
  },
  review: {
    baselineVariant: 'veilskin-foundling',
    scale: 8,
    notes: 'Visually approved locally as one small grounded authored Veilskin Foundling against approved Pale Echo plus public Goblin Scout and Imp Sprite. Publish only the bounded approval/reconciliation tuple under standing permission. Keep registration, fixtures, runtime copying, effects, later Changeling roles, Kelpie, and later Wave 2 work separate.',
  },
});

export const EN_E07_VEILSKIN_FOUNDLING_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E07_VEILSKIN_FOUNDLING_RENDERER],
  families: [EN_E07_VEILSKIN_FOUNDLING_FAMILY],
});
