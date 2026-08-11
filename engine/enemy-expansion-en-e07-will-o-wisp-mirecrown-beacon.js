import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E07_LANTERN_MOTE_GATE } from './enemy-expansion-en-e07-will-o-wisp-lantern-mote.js';
import { EN_E07_FENBELL_SHEPHERD_GATE } from './enemy-expansion-en-e07-will-o-wisp-fenbell-shepherd.js';

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
  shell: ['#254b57', '#112f39', '#4f8e91'],
  flame: ['#62d2bd', '#258b82', '#a1ecd0'],
  core: ['#d9f29b', '#78b66d', '#f2ffc8'],
  cage: ['#75518d', '#39284f', '#ad82bd'],
  eye: '#fff1a6',
  flash: '#f4f4f4',
});

export const EN_E07_WILL_O_WISP_MIRECROWN_CONTRACT_CARD = deepFreeze({
  id: 'en-e07-will-o-wisp-v3',
  sliceId: 'EN-E07',
  family: 'will-o-wisp',
  familyName: 'Will-o-Wisp',
  roleOrder: ['common', 'specialist', 'elite'],
  activeVariant: {
    id: 'lantern-mote',
    name: 'Lantern Mote',
    role: 'common',
    status: 'implemented-full-approved',
  },
  activeSpecialist: {
    id: 'fenbell-shepherd',
    name: 'Fenbell Shepherd',
    role: 'specialist',
    status: 'implemented-full-approved',
  },
  activeElite: {
    id: 'mirecrown-beacon',
    name: 'Mirecrown Beacon',
    role: 'elite',
    status: 'implemented-full-approved',
  },
  deferredRoles: [],
  closedFamilies: ['changeling', 'kelpie'],
  styleContract: 'Use chunky one-to-three-pixel connected forms, hard alpha, one visible self-contained living core eye, structural lantern ribs, and true hover clearance. The elite advances Lantern Mote and Fenbell Shepherd through a connected crown-wick, broad double-tiered beacon cage, paired connected buttresses, deep core, broad basin, and four connected lower flame tines without detached wisps or effects.',
  effectBoundary: 'Aura, bloom, glow, detached wisps, detached embers, loose sparks, halos, beams, rays, sound rings, smoke, afterimages, trails, light pools, projectiles, impact flashes, and illumination remain external.',
});

export const EN_E07_MIRECROWN_BEACON_CONTRACT = deepFreeze({
  sliceId: 'EN-E07',
  family: 'will-o-wisp',
  variant: 'mirecrown-beacon',
  role: 'elite',
  state: 'implemented-complete-motion-approved',
  chassis: 'crown-wick-double-tier-cage-single-eye-four-tine-hovering-beacon-v1',
  silhouette: 'A broad hovering sovereign mire beacon with one connected three-prong crown-wick, a wide double-tiered ribbed cage, one visible central beacon eye, paired connected side buttresses, a deep living core, a broad lower basin, and four connected lower flame tines. It must stay related to Lantern Mote and Fenbell Shepherd without becoming an enlarged bell, public Ghost robe, Flame Elemental blob, hanging humanoid, detached wisp flock, halo, or sound-effect icon.',
  identity: 'The approved marsh-teal shell, mint spectral flame, pale living core, violet cage, and warm single eye expand into a wider elite silhouette with crown-wick regalia, two structural cage tiers, opposed buttresses, a deep core, basin, and four lower flames. The whole actor remains one opaque connected component while aura, glow, detached fire, halos, beams, rays, sound rings, smoke, trails, floor pools, projectiles, impacts, and illumination stay external.',
  effectBoundary: EN_E07_WILL_O_WISP_MIRECROWN_CONTRACT_CARD.effectBoundary,
});

export const EN_E07_MIRECROWN_BEACON_DATA = deepFreeze({
  actor: {
    species: 'will-o-wisp',
    bodyBuild: 'broad-hovering-double-tier-mire-beacon',
    skin: 'mint-marsh-flame',
    hairStyle: 'connected-three-prong-crown-wick',
    hairColor: 'deep-marsh-teal',
    expression: 'single-sovereign-beacon-eye',
    faceDetail: 'one-warm-eye-in-deep-living-core',
    headgear: 'none',
    outfit: 'connected-violet-double-tier-cage-buttresses-and-basin',
    outfitColor: 'violet-and-marsh-teal',
    outfitTier: 'tier3',
    weapon: 'connected-regalia-flame-fan',
    weaponTier: 'none',
    shield: 'connected-paired-cage-buttresses',
    shieldTier: 'tier3',
    offhand: 'none',
    palette: {
      skin: COLORS.flame,
      hair: COLORS.shell,
      outfit: COLORS.cage,
    },
  },
  mirecrownBeacon: COLORS,
  alphaPolicy: 'binary-single-component-three-prong-crown-wick-double-tier-cage-single-beacon-eye-paired-buttresses-deep-core-broad-basin-four-flame-tines-and-hover-clearance',
  effectBoundary: 'external-aura-bloom-glow-detached-wisps-detached-embers-loose-sparks-halos-beams-rays-sound-rings-smoke-afterimages-trails-light-pools-projectiles-impacts-and-illumination',
  bakedEffects: [],
});

export const EN_E07_MIRECROWN_BEACON_GATE = deepFreeze({
  id: 'en-e07-will-o-wisp-mirecrown-beacon-full-v1',
  status: 'approved',
  baseCheckpoint: '8b0754c9594ad91fe378ba11d4f43d7b2a558145',
  authorizedOn: '2026-08-11',
  authorizationEvidence: 'After the exact repaired Fenbell Shepherd was visually approved, committed, pushed, and reconciled at clean published checkpoint 8b0754c9594ad91fe378ba11d4f43d7b2a558145, the designer replied: lets do next. The frozen Will-o-Wisp role order is common, specialist, elite, so the one-complete-sprite cadence authorizes only one private elite Mirecrown Beacon 80-frame candidate.',
  approvedOn: '2026-08-11',
  approvalEvidence: 'After the exact repaired labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, the approved Lantern Mote and Fenbell Shepherd plus public Spectral Ghost and Flame Elemental comparison, and paired GIF evidence were presented, and the three exact frozen PNG review boards were opened together in responsive Aseprite, the designer replied: approved lets do next. Approval applies only to candidate digest 5fbd53af9fb461717a8bd90698a0b2f7f81f8fdd55fee42fbca5254738654d81; Will-o-Wisp registration, fixtures, effects, later families, release, and EN-E08 remain separate gates.',
  approvedImplementation: '72925cd8d8ea1a3ae47a45601607a1a5853decb3',
  publicationAuthorizedOn: '2026-08-11',
  publicationAuthorizationEvidence: 'The designer said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact artifact or digest. It does not authorize registration, fixtures, effects, later roles or families, release, or any other unopened gate.',
  publishedImplementation: '72925cd8d8ea1a3ae47a45601607a1a5853decb3',
  publishedApprovalRecord: '6448bb49e16679b94fcc402166b089b6b6ca7174',
  initialPublishedHandoff: '72b529bcdd19bd0d3018f2b03ceabcb29a809015',
  publicationState: 'published',
  precedingApproval: {
    gateId: EN_E07_FENBELL_SHEPHERD_GATE.id,
    artifactSha256: EN_E07_FENBELL_SHEPHERD_GATE.artifactSha256,
    assembledArtifactSha256: EN_E07_FENBELL_SHEPHERD_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E07_FENBELL_SHEPHERD_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E07_FENBELL_SHEPHERD_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E07_FENBELL_SHEPHERD_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E07_FENBELL_SHEPHERD_GATE.candidateFrameDigest,
    publishedImplementation: EN_E07_FENBELL_SHEPHERD_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E07_FENBELL_SHEPHERD_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E07_FENBELL_SHEPHERD_GATE.initialPublishedHandoff,
    currentReconciliation: '8b0754c9594ad91fe378ba11d4f43d7b2a558145',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e07-will-o-wisp-mirecrown-beacon/en-e07-will-o-wisp-mirecrown-beacon-full-suite-raw.png',
  artifactSha256: 'c76b05b32ead47a92fbd8147c9d813b3e95c8e2bcd25e417ede4be7dc65ad275',
  assembledArtifact: 'enemy-expansion-review/en-e07-will-o-wisp-mirecrown-beacon/en-e07-will-o-wisp-mirecrown-beacon-full-suite-complete-b-form.png',
  assembledArtifactSha256: 'b9119b3f09f92842a0b71fa4198ed447dcddc9cfe5caba33ad3cb5904d28e2d6',
  comparisonArtifact: 'enemy-expansion-review/en-e07-will-o-wisp-mirecrown-beacon/en-e07-will-o-wisp-mirecrown-beacon-family-comparison.png',
  comparisonArtifactSha256: 'cab869d6c4e406712db7c9a307b32adf9a44e6efc112188091b15d9dcfaae90e',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e07-will-o-wisp-mirecrown-beacon/en-e07-will-o-wisp-mirecrown-beacon-full-suite-four-directions-labeled.gif',
      sha256: '8f456bde2c82d33eb9cc5ce634967cb9e81d7fb1ff910b6ed55a37580bf9b99c',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e07-will-o-wisp-mirecrown-beacon/en-e07-will-o-wisp-mirecrown-beacon-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '61455606f5399c7006f2d5955fc4d289731d2406828fcfaa260e891989d77ffa',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
  },
  candidateFrameDigest: '5fbd53af9fb461717a8bd90698a0b2f7f81f8fdd55fee42fbca5254738654d81',
  fenbellShepherdComparisonDigest: EN_E07_FENBELL_SHEPHERD_GATE.candidateFrameDigest,
  lanternMoteComparisonDigest: EN_E07_LANTERN_MOTE_GATE.candidateFrameDigest,
  spectralGhostComparisonDigest: 'f373247db71b7472a8d64248c0e0e8d06eabfacee7e283db0db0a8fd3c305621',
  flameElementalComparisonDigest: '0df82667d385dbbf4b44c861922b231ffc4b1850ad037fdefc351935f6c9659c',
  scope: 'One complete 80-frame Mirecrown Beacon elite Will-o-Wisp across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle counter-pulses the crown-wick, double cage, beacon eye, buttresses, basin, and four connected tines. Walk uses four directional processional hover phases with opposed cage-tier, crown, core, and lower-flame drift. Attack seals the connected buttresses around the single eye, lifts the deep core into the crown, opens one connected regalia flame fan without a projectile, and settles the authored sovereign beacon form. Hurt uses a complete white recoil and a colored collapsed-beacon brace that preserves the crown, eye, double cage, basin, and four tines. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and approved Lantern Mote and Fenbell Shepherd plus public Spectral Ghost and Flame Elemental silhouette comparisons together.',
  exclusions: [
    'changes to approved Fenbell Shepherd rendered pixels',
    'changes to approved Lantern Mote rendered pixels',
    'changes to approved Doppelganger or Living Shadow rendered pixels',
    'public Will-o-Wisp registration',
    'public catalog exposure',
    'asset-pack fixture generation or regeneration',
    'new Cast pixels',
    'new Death pixels',
    'aura',
    'bloom',
    'glow',
    'detached wisps',
    'detached embers',
    'loose sparks',
    'halos',
    'beams',
    'rays',
    'sound rings',
    'smoke',
    'afterimages',
    'trails',
    'light pools',
    'projectiles',
    'impact flashes',
    'illumination',
    'effects',
    'release',
    'additional Will-o-Wisp roles',
    'Changeling',
    'Kelpie',
    'EN-E08 and later work',
  ],
  nextGate: 'The exact repaired Mirecrown Beacon is visually approved and published: implementation 72925cd8d8ea1a3ae47a45601607a1a5853decb3, approval record 6448bb49e16679b94fcc402166b089b6b6ca7174, and initial handoff 72b529bcdd19bd0d3018f2b03ceabcb29a809015 are remote verified. The same approved lets do next response opens only one private common Changeling candidate from this clean publication reconciliation. Do not register Will-o-Wisp, generate fixtures, add effects, release, start a specialist or elite Changeling, start Kelpie, or advance EN-E08.',
});

export const EN_E07_MIRECROWN_BEACON_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const WALK_PHASES = deepFreeze([
  { name: 'left-crown-procession', pose: 'walk', bob: 0, drift: -1, flare: 0, tilt: 1 },
  { name: 'high-core-procession', pose: 'walk', bob: -1, drift: 0, flare: 1, tilt: -1 },
  { name: 'right-crown-procession', pose: 'walk', bob: 0, drift: 1, flare: 0, tilt: -1 },
  { name: 'low-four-tine-settle', pose: 'walk', bob: 1, drift: 0, flare: -1, tilt: 1 },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'connected-buttress-seal', pose: 'seal', bob: 0, drift: 0, flare: 0, tilt: 0 },
  { name: 'deep-core-crown-lift', pose: 'lift', bob: -1, drift: 0, flare: 1, tilt: 1 },
  { name: 'connected-regalia-flame-fan', pose: 'fan', bob: 0, drift: 0, flare: 1, tilt: -1 },
  { name: 'sovereign-beacon-settle', pose: 'recover', bob: 1, drift: 0, flare: -1, tilt: 0 },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-mirecrown-recoil', pose: 'hurt', bob: 0, drift: -1, flare: 0, tilt: -1, flash: true },
  { name: 'colored-collapsed-beacon-brace', pose: 'brace', bob: 1, drift: 0, flare: -1, tilt: 1, flash: false },
]);

function phaseFor(animation, frame) {
  if (animation === 'idle') {
    assert(frame === 0 || frame === 1, 'Mirecrown Beacon Idle frame ' + frame + ' is out of range.');
    return frame === 0
      ? { name: 'sovereign-eye-vigil', pose: 'idle', bob: 0, drift: 0, flare: 0, tilt: -1 }
      : { name: 'double-cage-core-pulse', pose: 'idle', bob: 1, drift: 0, flare: 1, tilt: 1 };
  }
  if (animation === 'walk') return WALK_PHASES[frame];
  if (animation === 'attack' || animation === 'cast') return ATTACK_PHASES[frame];
  if (animation === 'hurt') return HURT_PHASES[frame];
  if (animation === 'death') return HURT_PHASES[EN_E07_MIRECROWN_BEACON_DEATH_SOURCE_FRAMES[frame]];
  return null;
}

function createPixels() {
  return new Array(SIZE * SIZE).fill(null);
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert([x, y, width, height].every(Number.isInteger) && width > 0 && height > 0, 'Mirecrown Beacon rectangles must use positive integer geometry.');
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Mirecrown Beacon authored pixels must remain inside the 24x24 cell.');
      pixels[(py * SIZE) + px] = fill;
    }
  };
  return {
    rect,
    dot(x, y, fill) { rect(x, y, 1, 1, fill); },
  };
}

function drawFront(paint, rear, phase) {
  const y = phase.bob || 0;
  const x = phase.drift || 0;
  const flare = phase.flare || 0;
  const tilt = phase.tilt || 0;
  const spread = Math.max(flare, 0);

  // A connected three-prong crown-wick anchors the broad upper cage.
  paint.rect(12 + x, 2 + y, 2, 3, COLORS.cage[2]);
  paint.dot(10 + x + Math.max(-tilt, 0), 3 + y, COLORS.cage[2]);
  paint.dot(15 + x + Math.max(tilt, 0), 3 + y, COLORS.cage[2]);
  if (tilt > 0) paint.dot(15 + x, 3 + y, COLORS.cage[2]);
  paint.rect(10 + x, 4 + y, 6, 2, COLORS.cage[1]);
  paint.rect(8 + x, 6 + y, 10, 2, COLORS.shell[1]);
  paint.rect(6 + x, 8 + y, 14, 2, COLORS.shell[0]);

  // Paired buttresses and two structural tiers frame one deep living core.
  paint.rect(4 + x, 10 + y, 4, 6, COLORS.cage[1]);
  paint.rect(18 + x, 10 + y, 4, 6, COLORS.cage[0]);
  paint.dot(4 + x, 9 + y, COLORS.cage[2]);
  paint.dot(21 + x, 11 + y, COLORS.shell[2]);
  paint.rect(8 + x, 8 + y, 10, 10, COLORS.flame[0]);
  paint.rect(9 + x, 9 + y, 8, 9, COLORS.flame[1]);
  paint.rect(11 + x, 9 + y, 4, 8, COLORS.core[1]);
  paint.rect(12 + x, 10 + y, 2, 6, COLORS.core[0]);
  paint.dot(12 + x, 9 + y, COLORS.core[2]);
  paint.rect(6 + x, 11 + y, 3, 2, COLORS.cage[0]);
  paint.rect(17 + x, 12 + y, 3, 2, COLORS.cage[1]);
  paint.rect(7 + x, 13 + y, 12, 2, COLORS.cage[1]);
  if (rear) {
    paint.rect(10 + x, 10 + y, 6, 2, COLORS.cage[1]);
    paint.rect(11 + x, 13 + y, 4, 2, COLORS.cage[2]);
    paint.rect(5 + x, 10 + y, 2, 2, COLORS.shell[2]);
    paint.rect(19 + x, 10 + y, 2, 2, COLORS.cage[2]);
    paint.dot(5 + x, 16 + y, COLORS.cage[2]);
    paint.dot(20 + x, 16 + y, COLORS.shell[2]);
  }

  // The broad basin binds four lower flame tines into the main component.
  paint.rect(6 + x, 17 + y, 14, 2, COLORS.cage[1]);
  paint.rect(5 + x, 19 + y, 16, 2, COLORS.shell[1]);
  paint.rect(6 + x - spread, 19 + y, 3, 2, COLORS.flame[1]);
  paint.rect(10 + x, 19 + y, 3, 2, COLORS.flame[0]);
  paint.rect(14 + x, 19 + y, 3, 2, COLORS.core[0]);
  paint.rect(18 + x + spread, 19 + y, 3, 2, COLORS.flame[1]);
  paint.dot(7 + x - spread, 21 + y, COLORS.flame[2]);
  paint.dot(11 + x, 21 + y, COLORS.flame[2]);
  paint.dot(15 + x, 21 + y, COLORS.core[2]);
  paint.dot(19 + x + spread, 21 + y, COLORS.flame[2]);

  if (phase.pose === 'seal') {
    paint.rect(6 + x, 11 + y, 6, 4, COLORS.cage[0]);
    paint.rect(14 + x, 11 + y, 6, 4, COLORS.cage[1]);
  } else if (phase.pose === 'lift') {
    paint.rect(11 + x, 6 + y, 4, 7, COLORS.core[0]);
    paint.rect(12 + x, 5 + y, 2, 3, COLORS.core[2]);
  } else if (phase.pose === 'fan') {
    if (rear) {
      paint.rect(8 + x, 6 + y, 10, 4, COLORS.cage[0]);
      paint.rect(9 + x, 6 + y, 8, 3, COLORS.flame[2]);
      paint.rect(11 + x, 5 + y, 4, 4, COLORS.core[0]);
      paint.rect(12 + x, 5 + y, 2, 3, COLORS.core[2]);
    } else {
      paint.rect(7 + x, 15 + y, 12, 4, COLORS.cage[0]);
      paint.rect(8 + x, 15 + y, 10, 3, COLORS.flame[2]);
      paint.rect(10 + x, 16 + y, 6, 3, COLORS.core[0]);
      paint.rect(11 + x, 17 + y, 4, 2, COLORS.core[2]);
    }
  } else if (phase.pose === 'recover' || phase.pose === 'brace') {
    paint.rect(6 + x, 11 + y, 6, 5, COLORS.cage[1]);
    paint.rect(14 + x, 11 + y, 6, 5, COLORS.cage[0]);
    paint.rect(11 + x, 14 + y, 4, 4, COLORS.core[1]);
  }

  if (!rear) {
    const eyeY = phase.pose === 'lift'
      ? 11
      : (phase.pose === 'recover' || phase.pose === 'brace' ? 14 : 12);
    paint.dot(13 + x, eyeY + y, COLORS.eye);
  }
}

function drawRight(paint, phase) {
  const y = phase.bob || 0;
  const x = phase.drift || 0;
  const flare = phase.flare || 0;
  const tilt = phase.tilt || 0;
  const spread = Math.max(flare, 0);

  paint.rect(13 + x, 2 + y, 2, 3, COLORS.cage[2]);
  paint.dot(11 + x + Math.max(-tilt, 0), 3 + y, COLORS.cage[2]);
  paint.dot(16 + x + Math.max(tilt, 0), 3 + y, COLORS.cage[2]);
  if (tilt > 0) paint.dot(16 + x, 3 + y, COLORS.cage[2]);
  paint.rect(11 + x, 4 + y, 6, 2, COLORS.cage[1]);
  paint.rect(9 + x, 6 + y, 10, 2, COLORS.shell[1]);
  paint.rect(7 + x, 8 + y, 14, 2, COLORS.shell[0]);
  paint.rect(5 + x, 10 + y, 4, 6, COLORS.cage[1]);
  paint.rect(18 + x, 10 + y, 4, 6, COLORS.cage[0]);
  paint.dot(5 + x, 9 + y, COLORS.cage[2]);
  paint.dot(21 + x, 11 + y, COLORS.shell[2]);
  paint.rect(9 + x, 8 + y, 10, 10, COLORS.flame[0]);
  paint.rect(10 + x, 9 + y, 8, 9, COLORS.flame[1]);
  paint.rect(13 + x, 9 + y, 4, 8, COLORS.core[1]);
  paint.rect(14 + x, 10 + y, 2, 6, COLORS.core[0]);
  paint.dot(14 + x, 9 + y, COLORS.core[2]);
  paint.rect(7 + x, 11 + y, 3, 2, COLORS.cage[0]);
  paint.rect(17 + x, 12 + y, 4, 2, COLORS.cage[1]);
  paint.rect(8 + x, 13 + y, 12, 2, COLORS.cage[1]);
  paint.rect(7 + x, 17 + y, 14, 2, COLORS.cage[1]);
  paint.rect(6 + x, 19 + y, 16, 2, COLORS.shell[1]);
  paint.rect(7 + x - spread, 19 + y, 3, 2, COLORS.flame[1]);
  paint.rect(11 + x, 19 + y, 3, 2, COLORS.flame[0]);
  paint.rect(15 + x, 19 + y, 3, 2, COLORS.core[0]);
  paint.rect(19 + x + spread, 19 + y, 3, 2, COLORS.flame[1]);
  paint.dot(8 + x - spread, 21 + y, COLORS.flame[2]);
  paint.dot(12 + x, 21 + y, COLORS.flame[2]);
  paint.dot(16 + x, 21 + y, COLORS.core[2]);
  paint.dot(20 + x + spread, 21 + y, COLORS.flame[2]);

  if (phase.pose === 'seal') {
    paint.rect(7 + x, 11 + y, 6, 4, COLORS.cage[1]);
    paint.rect(15 + x, 11 + y, 6, 4, COLORS.cage[0]);
  } else if (phase.pose === 'lift') {
    paint.rect(14 + x, 6 + y, 4, 7, COLORS.core[0]);
    paint.rect(15 + x, 5 + y, 2, 3, COLORS.core[2]);
  } else if (phase.pose === 'fan') {
    paint.rect(16 + x, 10 + y, 6, 7, COLORS.cage[0]);
    paint.rect(17 + x, 11 + y, 5, 5, COLORS.flame[2]);
    paint.rect(18 + x, 12 + y, 4, 3, COLORS.core[0]);
    paint.rect(19 + x, 13 + y, 3, 2, COLORS.core[2]);
  } else if (phase.pose === 'recover' || phase.pose === 'brace') {
    paint.rect(7 + x, 11 + y, 6, 5, COLORS.cage[1]);
    paint.rect(15 + x, 11 + y, 6, 5, COLORS.cage[0]);
    paint.rect(13 + x, 14 + y, 4, 4, COLORS.core[1]);
  }

  const eyeY = phase.pose === 'lift'
    ? 11
    : (phase.pose === 'recover' || phase.pose === 'brace' ? 14 : 12);
  paint.dot(17 + x, eyeY + y, COLORS.eye);
}

function mirrorPixels(pixels) {
  const result = new Array(SIZE * SIZE).fill(null);
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    result[(y * SIZE) + (SIZE - 1 - x)] = pixels[(y * SIZE) + x];
  }
  return result;
}

function buildPixels(direction, animation, frame) {
  const phase = phaseFor(animation, frame);
  assert(phase, 'Mirecrown Beacon animation ' + animation + ' frame ' + frame + ' is out of range.');
  const canonicalDirection = direction === 'left' ? 'right' : direction;
  let pixels = createPixels();
  const paint = painter(pixels);
  if (canonicalDirection === 'right') drawRight(paint, phase);
  else drawFront(paint, canonicalDirection === 'up', phase);
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

export function renderEnE07MirecrownBeaconFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Mirecrown Beacon rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Mirecrown Beacon direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'will-o-wisp',
    variant: 'mirecrown-beacon',
    direction,
    animation,
    frame,
    phase: phase.name,
    mirecrownBeaconGate: EN_E07_MIRECROWN_BEACON_GATE.id,
    approvedPrecedingGate: EN_E07_FENBELL_SHEPHERD_GATE.id,
    alphaPolicy: EN_E07_MIRECROWN_BEACON_DATA.alphaPolicy,
    effectBoundary: EN_E07_MIRECROWN_BEACON_DATA.effectBoundary,
  });
}

export const EN_E07_MIRECROWN_BEACON_RENDERER = deepFreeze({
  key: 'en-e07-will-o-wisp-mirecrown-beacon-v1',
  chassis: EN_E07_MIRECROWN_BEACON_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'will-o-wisp', 'The EN-E07 Mirecrown Beacon renderer is restricted to Will-o-Wisp.');
    assert(variant.id === 'mirecrown-beacon', 'The EN-E07 Mirecrown Beacon renderer is restricted to Mirecrown Beacon.');
    return renderEnE07MirecrownBeaconFrame(context, direction, animation.id, frame);
  },
});

const MIRECROWN_BEACON_VARIANT = deepFreeze({
  id: 'mirecrown-beacon',
  name: 'Mirecrown Beacon',
  role: EN_E07_MIRECROWN_BEACON_CONTRACT.role,
  status: EN_E07_MIRECROWN_BEACON_CONTRACT.state,
  brief: 'An approved complete elite Will-o-Wisp with one connected three-prong crown-wick, broad double-tiered cage, single beacon eye, paired buttresses, deep core, broad basin, four lower flame tines, and true hover clearance; halos, beams, rays, aura, detached wisps, sound rings, smoke, trails, pools, projectiles, illumination, and impacts remain external.',
  rendererData: EN_E07_MIRECROWN_BEACON_DATA,
});

export const EN_E07_MIRECROWN_BEACON_FAMILY = deepFreeze({
  id: 'will-o-wisp',
  name: 'Will-o-Wisp Mirecrown Beacon Review',
  sliceId: 'EN-E07',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E07_MIRECROWN_BEACON_CONTRACT.chassis,
  rendererKey: EN_E07_MIRECROWN_BEACON_RENDERER.key,
  variants: [MIRECROWN_BEACON_VARIANT],
  rendererData: {
    contractCard: EN_E07_WILL_O_WISP_MIRECROWN_CONTRACT_CARD.id,
    approvedPrecedingGate: EN_E07_FENBELL_SHEPHERD_GATE.id,
    activeGate: EN_E07_MIRECROWN_BEACON_GATE.id,
  },
  review: {
    baselineVariant: 'mirecrown-beacon',
    scale: 8,
    notes: 'Visually approved and published as one connected hovering Mirecrown Beacon against approved Fenbell Shepherd and Lantern Mote plus public Spectral Ghost and Flame Elemental. Keep registration, fixtures, effects, and later Wave 2 work separate; only one private common Changeling candidate is open from the clean publication reconciliation.',
  },
});

export const EN_E07_MIRECROWN_BEACON_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E07_MIRECROWN_BEACON_RENDERER],
  families: [EN_E07_MIRECROWN_BEACON_FAMILY],
});
