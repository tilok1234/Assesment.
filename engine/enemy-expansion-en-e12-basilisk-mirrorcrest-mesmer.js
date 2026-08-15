import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E12_BASILISK_CROWNSCALE_CRAWLER_GATE,
  EN_E12_BASILISK_TOPOLOGY_DECISION,
} from './enemy-expansion-en-e12-basilisk-crownscale-crawler.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E12_BASILISK_MIRRORCREST_MESMER_CONTRACT = deepFreeze({
  family: 'basilisk',
  variant: 'mirrorcrest-mesmer',
  role: 'specialist',
  state: 'implemented-complete-motion-approved',
  chassis: EN_E12_BASILISK_TOPOLOGY_DECISION.selected,
  silhouette: 'One connected lean, low, long Basilisk joins a narrow diamond serpent head, a connected split crescent mirror crest, an arched S-neck, a slim plated body, four separately readable splayed grounded clawed legs, and one long tapering tail curled into a raised body-owned hook loop. It preserves the approved four-clawed crowned-serpent topology while reading narrower, longer-necked, more open-centered, and more ritualized than the heavy Crownscale Crawler.',
  identity: 'Deep teal and blue-black hide, violet belly scales, opaline moon-silver mirror plates, a split pale crest, cyan eyes, a dark plum jaw, ivory fangs, and rose-copper claws distinguish the Mirrorcrest Mesmer specialist without relying on gaze beams, venom, glow, dust, or projectiles.',
  effectBoundary: EN_E12_BASILISK_TOPOLOGY_DECISION.effectBoundary,
});

export const EN_E12_BASILISK_SPECIALIST_CONTRACT_CARD = deepFreeze({
  family: 'basilisk',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingGate: EN_E12_BASILISK_CROWNSCALE_CRAWLER_GATE.id,
  precedingVariant: {
    id: 'crownscale-crawler',
    role: 'common',
    status: 'implemented-full-approved-published-reconciled',
  },
  activeVariant: {
    id: EN_E12_BASILISK_MIRRORCREST_MESMER_CONTRACT.variant,
    role: EN_E12_BASILISK_MIRRORCREST_MESMER_CONTRACT.role,
    status: 'implemented-full-approved-published-reconciled',
  },
  deferredRoles: ['elite'],
});

export const EN_E12_BASILISK_MIRRORCREST_MESMER_GATE = deepFreeze({
  id: 'en-e12-basilisk-mirrorcrest-mesmer-full-v1',
  status: 'approved',
  authorizedOn: '2026-08-15',
  authorizationEvidence: 'The exact Crownscale Crawler implementation 3071d18d98b84ca1492e88ab85bf7765aa7ee0d0, approval record fd734af1df0a6b2ab1712533892e2a9e18c5984c, initial published handoff 06249d3ce2924a1010ab6a8edd927ab934c50380, and final reconciliation e894fc126c33fd94c49c077f8dc0432dfabe753a are pushed and remote verified. The designer replied Approved lets do next to the exact Crownscale packet. That approval publishes only Crownscale Crawler; its continuation opens exactly one private specialist Basilisk full 80-frame candidate under the selected baked-single-actor-grounded-four-clawed-crowned-serpent topology. Because the role was not pre-named, this lane names only Mirrorcrest Mesmer. It does not approve candidate pixels or authorize a commit, push, public or outline registration, fixtures, approved-enemy package mutation, effects, child assets, elite Basilisk, Manticore, Sphinx, boss work, release, accepted drift, or a pull request.',
  baseCheckpoint: 'e894fc126c33fd94c49c077f8dc0432dfabe753a',
  architectureDecision: EN_E12_BASILISK_TOPOLOGY_DECISION.id,
  approvedOn: '2026-08-15',
  approvalEvidence: 'The final approval prompt posted the exact labeled all-four-direction raw/no-outline, distinct Complete B outlined, Complete B + Form, and Crownscale-Gloamgaze-Marsh Crocodile comparison PNGs together with both synchronized full-suite GIFs and candidate digest 3ff5c75cd5272e66cfad42b84c5dbb1e86c20b67f506845923734cda24569a80. All four exact PNGs, all eight raw and Complete B + Form phase sheets, the transparent 20x4 inspection atlas, and both exact GIFs were inspected at original resolution; Aseprite parsed all six principal files and regeneration reproduced every frozen hash. The designer replied: approved letsd do next. Pixel approval applies only to that exact Mirrorcrest Mesmer digest and its six frozen review hashes. The continuation clause separately opens exactly one private elite Basilisk candidate only after this specialist publication tuple is complete; it does not approve elite pixels or open public or outline registration, fixtures, approved-enemy package mutation, effects, child assets, Manticore, Sphinx, boss work, release, accepted drift, or a pull request.',
  approvedImplementation: '9c020537525094430307813e77fd23d7e6308fcc',
  publicationAuthorizedOn: '2026-08-15',
  publicationAuthorizationEvidence: 'The designer previously said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact frozen artifact or digest. The designer now replied approved letsd do next to the exact Mirrorcrest Mesmer review packet. This does not authorize public or outline registration, fixtures, approved-enemy package mutation, effects, child assets, elite pixel approval, Manticore, Sphinx, boss work, release, accepted drift, or a pull request.',
  publishedImplementation: '9c020537525094430307813e77fd23d7e6308fcc',
  publishedApprovalRecord: '7ecc9df1f7f05c38af6cd395bfd26811a0d79099',
  initialPublishedHandoff: 'a983959ccf0fb6c965fcb04e534c170f8b1f854b',
  publicationState: 'published',
  precedingApproval: {
    gateId: EN_E12_BASILISK_CROWNSCALE_CRAWLER_GATE.id,
    candidateFrameDigest: EN_E12_BASILISK_CROWNSCALE_CRAWLER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E12_BASILISK_CROWNSCALE_CRAWLER_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E12_BASILISK_CROWNSCALE_CRAWLER_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E12_BASILISK_CROWNSCALE_CRAWLER_GATE.initialPublishedHandoff,
    currentReconciliation: 'e894fc126c33fd94c49c077f8dc0432dfabe753a',
  },
  artifact: 'enemy-expansion-review/en-e12-basilisk-mirrorcrest-mesmer/en-e12-basilisk-mirrorcrest-mesmer-full-suite-raw.png',
  artifactSha256: 'fa14a2e95377039433c3342867e1e498cd63a83abc3cd9a4439392079fc74328',
  outlinedArtifact: 'enemy-expansion-review/en-e12-basilisk-mirrorcrest-mesmer/en-e12-basilisk-mirrorcrest-mesmer-full-suite-outlined-complete-b.png',
  outlinedArtifactSha256: 'bc415ca68f9ef7122baaf96a68ede53f7b9c677e446dcafc54a68698941ca23f',
  assembledArtifact: 'enemy-expansion-review/en-e12-basilisk-mirrorcrest-mesmer/en-e12-basilisk-mirrorcrest-mesmer-full-suite-complete-b-form.png',
  assembledArtifactSha256: '0760aa1abd5e2b8f548500aae0acfe21dba701f45324366feb830e68bca4068b',
  comparisonArtifact: 'enemy-expansion-review/en-e12-basilisk-mirrorcrest-mesmer/en-e12-basilisk-mirrorcrest-mesmer-family-comparison.png',
  comparisonArtifactSha256: '8f7c417002fa89638abaf10815205eeb38d3727cce500c38c6881ca3637eef73',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e12-basilisk-mirrorcrest-mesmer/en-e12-basilisk-mirrorcrest-mesmer-full-suite-four-directions-labeled.gif',
      sha256: 'f96cd642fcb1e0cc04d79f137142ed34316c308f40f4a64c426b58541a1bd589',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e12-basilisk-mirrorcrest-mesmer/en-e12-basilisk-mirrorcrest-mesmer-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: 'ca7dc5d41d9e16c9ec8771cd335239e518b028289fec3c6826d9f5c515631c77',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
  },
  candidateFrameDigest: '3ff5c75cd5272e66cfad42b84c5dbb1e86c20b67f506845923734cda24569a80',
  crownscaleComparisonDigest: '96283b7a295071acaa7541a44ccccbd6c99af0523b4e66d69cb5c9a706cd9872',
  gloamgazeComparisonDigest: '7752f15be95848bb5af6d1b89e79cd9f07ff3f1be8776427857497773d5b4eb8',
  marshCrocodileComparisonDigest: 'aaabe38311ec314f97b902e92ee6f426199f33c2f5051e8a7ffc7a58c737a19a',
  scope: 'One complete private 80-frame Basilisk Mirrorcrest Mesmer specialist enemy across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Every frame preserves one connected grounded four-clawed crowned serpent actor. Idle holds a lean mirror-crest vigil while the long tail settles into a hooked loop. Walk uses four splayed-claw weight shifts with neck, plate, split-crest, and loop-tail counter-motion. Attack braces all four claws, opens the connected split crescent crest into a body-owned aperture, arches the S-neck into a gaze-lock posture, closes the crest, and recovers without detached gaze, venom, glow, dust, or impact pixels. Hurt uses a complete-silhouette #f4f4f4 recoil and colored grounded recovery. Cast aliases Attack exactly and Death aliases Hurt H1,H2,H2,H2.',
  anatomyContract: EN_E12_BASILISK_MIRRORCREST_MESMER_CONTRACT.silhouette,
  reviewPresentation: 'Show the exact labeled all-four-direction Mirrorcrest Mesmer raw/no-outline, outlined Complete B, Complete B + Form, Crownscale/Gloamgaze/Marsh Crocodile comparison board, and both synchronized full-suite GIFs together.',
  exclusions: [
    'approved Crownscale Crawler source module and pixels',
    'approved Gloamgaze Stalker source module and pixels',
    'public Marsh Crocodile pixels',
    'approved-enemy copy package contents',
    'Basilisk elite variants',
    'Manticore or Sphinx',
    '48x48 boss work',
    'new Cast pixels',
    'new Death pixels',
    'detached tail, fang, scale, or gaze child assets',
    'baked petrifying-gaze pixels',
    'baked venom pixels',
    'baked glow pixels',
    'baked dust pixels',
    'baked projectile pixels',
    'baked shock-ring or impact pixels',
    'registration',
    'outline registration',
    'consumer exposure',
    'fixtures',
    'effects',
    'release',
    'accepted drift',
    'pull request',
  ],
  nextGate: 'The exact Mirrorcrest Mesmer implementation 9c020537525094430307813e77fd23d7e6308fcc, approval record 7ecc9df1f7f05c38af6cd395bfd26811a0d79099, and initial published handoff a983959ccf0fb6c965fcb04e534c170f8b1f854b are pushed and remote verified; this reconciliation completes the bounded Basilisk specialist publication tuple. The same reply includes a lets do next continuation, which now opens exactly one private elite Basilisk full 80-frame candidate under the selected baked-single-actor-grounded-four-clawed-crowned-serpent topology; because the elite was not pre-named, that lane may name only its one candidate. It does not approve elite pixels or authorize their commit or push. Public or outline registration, fixtures, approved-enemy package mutation, effects, child assets, Manticore, Sphinx, boss work, release, accepted drift, and a pull request remain closed. The distinct outlined PNG remains review evidence only and does not authorize outline registration.',
});

export const EN_E12_BASILISK_MIRRORCREST_MESMER_DATA = deepFreeze({
  actor: {
    species: 'basilisk',
    bodyBuild: 'lean-low-four-clawed-s-necked-mirrorcrest-loop-tail-serpent',
    skin: 'scaled',
    hairStyle: 'connected-split-crescent-mirror-crest',
    hairColor: 'moon-silver',
    expression: 'mesmeric-gaze-lock',
    faceDetail: 'cyan-eyes-dark-plum-diamond-jaw-and-ivory-fangs',
    headgear: 'none',
    outfit: 'connected-opaline-mirror-plates-and-violet-belly',
    outfitColor: 'moon-silver-violet',
    outfitTier: 'tier1',
    weapon: 'none',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: ['#234d55', '#172b39'],
      hair: ['#b7cbd2', '#607889'],
      outfit: ['#8ca6b8', '#53677d', '#6a496f'],
    },
  },
  actorTopology: EN_E12_BASILISK_TOPOLOGY_DECISION.selected,
  childAssets: [],
  basilisk: {
    hide: ['#234d55', '#172b39', '#3d7180'],
    plate: ['#8ca6b8', '#53677d', '#c4d3d6'],
    belly: ['#6a496f', '#3b2b4c', '#a7799a'],
    crown: ['#b7cbd2', '#607889', '#e4edf0'],
    jaw: ['#544266', '#2b263d', '#866b8f'],
    claw: ['#b48068', '#66465a', '#dda68a'],
    fang: ['#e7e3df', '#888593'],
    scale: ['#6e879f', '#3e586c', '#a6b8c5'],
    eye: '#70e2e6',
    feature: '#131927',
  },
  effectBoundary: 'external-petrifying-gaze-venom-glow-dust-projectiles-detached-fangs-or-scales-shock-rings-and-impacts',
  bakedEffects: [],
});

const MIRRORCREST_MESMER_VARIANT = deepFreeze({
  id: 'mirrorcrest-mesmer',
  name: 'Mirrorcrest Mesmer',
  role: EN_E12_BASILISK_MIRRORCREST_MESMER_CONTRACT.role,
  status: EN_E12_BASILISK_MIRRORCREST_MESMER_CONTRACT.state,
  brief: 'Specialist lean Basilisk with deep teal and blue-black hide, violet belly scales, opaline mirror plates, a connected moon-silver split crescent crest, cyan eyes, dark plum diamond jaw, ivory fangs, four splayed rose-copper claws, an arched S-neck, and one connected hooked loop-tail.',
  rendererData: EN_E12_BASILISK_MIRRORCREST_MESMER_DATA,
});

export const EN_E12_BASILISK_MIRRORCREST_MESMER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const MOTION_PHASES = deepFreeze({
  idle: [
    { name: 'split-mirror-vigil', bodyY: 0, headReach: 0, headY: 0, crownMode: 'folded', tailMode: 'loop', tailSide: -1, legPhase: 0, flash: false },
    { name: 'violet-throat-measure', bodyY: 1, headReach: 0, headY: 0, crownMode: 'folded', tailMode: 'soft-loop', tailSide: 1, legPhase: 1, flash: false },
  ],
  walk: [
    { name: 'splayed-left-mirror-step', bodyY: 0, headReach: 0, headY: 0, crownMode: 'folded', tailMode: 'loop', tailSide: -1, legPhase: 1, flash: false },
    { name: 'opaline-plate-compress', bodyY: 1, headReach: 0, headY: 0, crownMode: 'tilted', tailMode: 'soft-loop', tailSide: -1, legPhase: 2, flash: false },
    { name: 'splayed-right-mirror-step', bodyY: 0, headReach: 0, headY: 0, crownMode: 'folded', tailMode: 'loop', tailSide: 1, legPhase: 3, flash: false },
    { name: 'hook-loop-recover', bodyY: 1, headReach: 0, headY: -1, crownMode: 'tilted', tailMode: 'soft-loop', tailSide: 1, legPhase: 4, flash: false },
  ],
  attack: [
    { name: 'four-claw-mirror-brace', bodyY: 1, headReach: 0, headY: 0, crownMode: 'tilted', tailMode: 'brace', tailSide: -1, legPhase: 0, flash: false },
    { name: 'connected-split-aperture-rise', bodyY: 0, headReach: 0, headY: -1, crownMode: 'open', tailMode: 'high-loop', tailSide: -1, legPhase: 2, flash: false },
    { name: 'body-owned-gaze-lock', bodyY: 0, headReach: 1, headY: 0, crownMode: 'locked', tailMode: 'high-loop', tailSide: 1, legPhase: 3, flash: false },
    { name: 'mirrorcrest-fold-recover', bodyY: 1, headReach: 0, headY: 0, crownMode: 'folded', tailMode: 'loop', tailSide: 1, legPhase: 1, flash: false },
  ],
  hurt: [
    { name: 'white-mirror-aperture-recoil', bodyY: 1, headReach: 0, headY: 0, crownMode: 'open', tailMode: 'brace', tailSide: -1, legPhase: 2, flash: true },
    { name: 'four-claw-loop-tail-recovery', bodyY: 1, headReach: 0, headY: 0, crownMode: 'folded', tailMode: 'soft-loop', tailSide: 1, legPhase: 0, flash: false },
  ],
});

function createColorContext(context, forcedColor = null) {
  let fillStyle = context.fillStyle;
  return {
    get fillStyle() {
      return forcedColor || fillStyle;
    },
    set fillStyle(value) {
      fillStyle = value;
      context.fillStyle = forcedColor || value;
    },
    onOutOfBounds(write) {
      if (typeof context.onOutOfBounds === 'function') context.onOutOfBounds(write);
    },
    clearRect(x, y, width, height) {
      context.clearRect(x, y, width, height);
    },
    fillRect(x, y, width, height) {
      context.fillStyle = forcedColor || fillStyle;
      context.fillRect(x, y, width, height);
    },
  };
}

function createPainter(context, direction) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Mirrorcrest Mesmer rectangles must use positive integer geometry.',
    );
    context.fillStyle = fill;
    context.fillRect(mirrored ? SIZE - x - width : x, y, width, height);
  };
  return {
    view,
    rect,
    dot(x, y, fill) {
      rect(x, y, 1, 1, fill);
    },
  };
}

function drawSideTail(paint, phase) {
  const { hide, plate, scale } = EN_E12_BASILISK_MIRRORCREST_MESMER_DATA.basilisk;
  const bob = phase.bodyY;
  paint.rect(5, 12 + bob, 4, 5, hide[0]);
  paint.rect(5, 15 + bob, 4, 3, hide[1]);
  if (phase.tailMode === 'brace') {
    paint.rect(3, 14 + bob, 4, 4, hide[1]);
    paint.rect(1, 13 + bob, 3, 3, hide[2]);
    paint.rect(1, 12 + bob, 2, 2, plate[1]);
    paint.dot(4, 15 + bob, scale[2]);
    return;
  }
  const high = phase.tailMode === 'high-loop';
  const soft = phase.tailMode === 'soft-loop';
  const top = (high ? 5 : 7) + (soft ? 1 : 0) + bob;
  paint.rect(3, 11 + bob, 4, 5, hide[1]);
  paint.rect(1, top + 2, 3, 5, hide[2]);
  paint.rect(2, top, 4, 2, plate[0]);
  paint.rect(5, top + 1, 2, high ? 7 : 5, hide[0]);
  paint.rect(3, top + 1, 2, 1, plate[2]);
  paint.dot(1, top + 3, scale[0]);
  paint.dot(5, top + 4, scale[2]);
}

function drawFrontTail(paint, phase) {
  const { hide, plate, scale } = EN_E12_BASILISK_MIRRORCREST_MESMER_DATA.basilisk;
  const bob = phase.bodyY;
  const right = phase.tailSide > 0;
  if (phase.tailMode === 'brace') {
    if (right) {
      paint.rect(17, 14 + bob, 4, 4, hide[1]);
      paint.rect(20, 13 + bob, 3, 3, hide[2]);
      paint.dot(22, 13 + bob, plate[1]);
    } else {
      paint.rect(3, 14 + bob, 4, 4, hide[1]);
      paint.rect(1, 13 + bob, 3, 3, hide[2]);
      paint.dot(1, 13 + bob, plate[1]);
    }
    return;
  }
  const high = phase.tailMode === 'high-loop';
  const soft = phase.tailMode === 'soft-loop';
  const top = (high ? 5 : 7) + (soft ? 1 : 0) + bob;
  if (right) {
    paint.rect(17, 12 + bob, 3, 5, hide[0]);
    paint.rect(20, top + 2, 3, 5, hide[2]);
    paint.rect(18, top, 4, 2, plate[0]);
    paint.rect(18, top + 1, 2, high ? 7 : 5, hide[1]);
    paint.dot(22, top + 3, scale[0]);
    paint.dot(19, top + 1, plate[2]);
    return;
  }
  paint.rect(4, 12 + bob, 3, 5, hide[0]);
  paint.rect(1, top + 2, 3, 5, hide[2]);
  paint.rect(2, top, 4, 2, plate[0]);
  paint.rect(4, top + 1, 2, high ? 7 : 5, hide[1]);
  paint.dot(1, top + 3, scale[0]);
  paint.dot(4, top + 1, plate[2]);
}

function drawTail(paint, phase) {
  if (paint.view === 'right') drawSideTail(paint, phase);
  else drawFrontTail(paint, phase);
}

const SIDE_LEG_X = Object.freeze([4, 8, 15, 19]);
const FRONT_LEG_X = Object.freeze([4, 8, 15, 19]);

function drawGroundedLeg(paint, x, phase, farLeg, index) {
  const { hide, belly, claw } = EN_E12_BASILISK_MIRRORCREST_MESMER_DATA.basilisk;
  const bob = phase.bodyY;
  const active = ((phase.legPhase + index) % 4) < 2;
  const upper = farLeg ? hide[1] : (active ? hide[2] : belly[1]);
  paint.rect(index === 3 ? x - 1 : x, 15 + bob, 2, 5 - bob, upper);
  paint.rect(x, 19, 2, 3, farLeg ? claw[1] : claw[0]);
  paint.rect(x - 1, 22, 3, 1, farLeg ? claw[1] : claw[2]);
  paint.dot(active ? x - 1 : x + 2, 21, farLeg ? claw[1] : claw[0]);
}

function drawLegs(paint, phase) {
  const positions = paint.view === 'right' ? SIDE_LEG_X : FRONT_LEG_X;
  for (let index = 0; index < positions.length; index++) {
    drawGroundedLeg(paint, positions[index], phase, index === 0 || index === 2, index);
  }
}

function drawSideBody(paint, phase) {
  const { hide, plate, belly, scale } = EN_E12_BASILISK_MIRRORCREST_MESMER_DATA.basilisk;
  const bob = phase.bodyY;
  paint.rect(6, 12 + bob, 12, 5, hide[0]);
  paint.rect(5, 13 + bob, 4, 4, hide[1]);
  paint.rect(7, 15 + bob, 11, 3, hide[1]);
  paint.rect(9, 12 + bob, 8, 3, hide[2]);
  paint.rect(11, 15 + bob, 7, 3, belly[0]);
  paint.rect(12, 17 + bob, 6, 2, belly[1]);
  paint.rect(7, 9 + bob, 2, 4, plate[0]);
  paint.rect(10, 8 + bob, 2, 5, plate[2]);
  paint.rect(13, 9 + bob, 2, 4, plate[0]);
  paint.rect(16, 10 + bob, 2, 4, plate[1]);
  paint.dot(8, 13 + bob, scale[2]);
  paint.dot(11, 13 + bob, scale[0]);
  paint.dot(14, 13 + bob, scale[1]);
  paint.dot(17, 14 + bob, scale[2]);
}

function drawFrontBody(paint, phase, rearView) {
  const { hide, plate, belly, scale } = EN_E12_BASILISK_MIRRORCREST_MESMER_DATA.basilisk;
  const bob = phase.bodyY;
  paint.rect(6, 12 + bob, 12, 5, hide[0]);
  paint.rect(7, 15 + bob, 10, 3, hide[1]);
  paint.rect(8, 10 + bob, 8, 5, hide[2]);
  paint.rect(5, 12 + bob, 3, 4, plate[0]);
  paint.rect(16, 12 + bob, 3, 4, plate[0]);
  paint.rect(6, 11 + bob, 2, 2, plate[2]);
  paint.rect(16, 11 + bob, 2, 2, plate[2]);
  if (rearView) {
    paint.rect(9, 12 + bob, 6, 6, plate[1]);
    paint.rect(10, 11 + bob, 4, 3, plate[2]);
  } else {
    paint.rect(9, 13 + bob, 6, 5, belly[0]);
    paint.rect(10, 16 + bob, 4, 2, belly[1]);
  }
  paint.dot(7, 14 + bob, scale[2]);
  paint.dot(10, 12 + bob, scale[0]);
  paint.dot(13, 12 + bob, scale[1]);
  paint.dot(16, 14 + bob, scale[2]);
}

function drawBody(paint, phase, rearView) {
  if (paint.view === 'right') drawSideBody(paint, phase);
  else drawFrontBody(paint, phase, rearView);
}

function drawCrownSide(paint, x, y, mode) {
  const { crown } = EN_E12_BASILISK_MIRRORCREST_MESMER_DATA.basilisk;
  const open = mode === 'open';
  const locked = mode === 'locked';
  const tilt = mode === 'tilted' ? 1 : 0;
  paint.rect(x, y + 3 + tilt, 7, 2, crown[1]);
  paint.rect(x + 1, y + 2 + tilt, 5, 2, crown[0]);
  if (open) {
    paint.rect(x, y, 2, 3, crown[2]);
    paint.rect(x + 5, y, 2, 3, crown[2]);
    paint.dot(x + 2, y + 1, crown[0]);
    paint.dot(x + 4, y + 1, crown[0]);
  } else {
    paint.rect(x + 1, y, 2, 4 + tilt, crown[2]);
    paint.rect(x + 5, y + (locked ? 0 : 1), 2, 3 + (locked ? 1 : 0), crown[0]);
  }
  if (locked) paint.rect(x + 5, y + 4, 2, 3, crown[2]);
}

function drawCrownFront(paint, x, y, mode) {
  const { crown } = EN_E12_BASILISK_MIRRORCREST_MESMER_DATA.basilisk;
  const open = mode === 'open';
  const locked = mode === 'locked';
  const tilt = mode === 'tilted' ? 1 : 0;
  paint.rect(x, y + 3 + tilt, 10, 2, crown[1]);
  paint.rect(x + 1, y + 2 + tilt, 8, 2, crown[0]);
  if (open) {
    paint.rect(x, y, 3, 3, crown[2]);
    paint.rect(x + 7, y, 3, 3, crown[2]);
    paint.dot(x + 3, y + 1, crown[0]);
    paint.dot(x + 6, y + 1, crown[0]);
  } else {
    paint.rect(x + 1, y, 2, 4 + tilt, crown[2]);
    paint.rect(x + 7, y + (locked ? 0 : 1), 2, 3 + (locked ? 1 : 0), crown[0]);
  }
  if (locked) {
    paint.rect(x + 1, y + 4, 2, 3, crown[2]);
    paint.rect(x + 7, y + 4, 2, 3, crown[2]);
  }
}

function drawSideHead(paint, phase) {
  const { hide, plate, jaw, fang, scale, eye, feature } = EN_E12_BASILISK_MIRRORCREST_MESMER_DATA.basilisk;
  const reach = phase.headReach;
  const y = 4 + phase.headY;
  paint.rect(15, y + 5, 4, 8, hide[0]);
  paint.rect(16, y + 3, 4, 7, hide[2]);
  paint.rect(15, y + 9, 3, 4, plate[1]);
  paint.rect(17 + reach, y + 2, 5, 6, hide[2]);
  paint.rect(16 + reach, y + 4, 7 - reach, 4, hide[0]);
  paint.rect(18 + reach, y + 7, 5 - reach, 3, jaw[0]);
  paint.rect(19 + reach, y + 9, 4 - reach, 2, jaw[1]);
  drawCrownSide(paint, 15 + Math.min(reach, 1), y - 2, phase.crownMode);
  paint.dot(20 + reach, y + 4, eye);
  paint.dot(21 + reach, y + 4, feature);
  paint.dot(21 + Math.min(reach, 1), y + 9, fang[0]);
  paint.dot(17, y + 7, scale[2]);
  paint.dot(16, y + 10, scale[0]);
  paint.dot(18, y + 11, plate[2]);
}

function drawFrontHead(paint, phase, rearView) {
  const { hide, plate, jaw, fang, scale, eye, feature } = EN_E12_BASILISK_MIRRORCREST_MESMER_DATA.basilisk;
  const y = 4 + phase.headY;
  const widen = phase.headReach > 0 ? 1 : 0;
  paint.rect(9, y + 7, 6, 7, hide[0]);
  paint.rect(8 - widen, y + 3, 8 + (widen * 2), 6, hide[0]);
  paint.rect(9 - widen, y + 1, 6 + (widen * 2), 5, hide[2]);
  paint.rect(9, y + 7, 6, 4, rearView ? plate[1] : jaw[0]);
  paint.rect(10, y + 9, 4, 3, rearView ? hide[1] : jaw[1]);
  paint.dot(7 - widen, y + 5, hide[1]);
  paint.dot(16 + widen, y + 5, hide[1]);
  drawCrownFront(paint, 7, y - 2, phase.crownMode);
  if (rearView) {
    paint.rect(9, y + 4, 6, 4, plate[0]);
    paint.dot(10, y + 5, scale[2]);
    paint.dot(13, y + 5, scale[0]);
    paint.rect(10, y + 10, 4, 2, plate[1]);
    return;
  }
  paint.dot(9 - widen, y + 5, eye);
  paint.dot(14 + widen, y + 5, eye);
  paint.dot(10 - widen, y + 6, feature);
  paint.dot(13 + widen, y + 6, feature);
  paint.dot(10, y + 10, fang[0]);
  paint.dot(13, y + 10, fang[0]);
  paint.dot(11, y + 8, scale[2]);
  paint.dot(12, y + 8, scale[0]);
}

function drawHead(paint, phase, rearView) {
  if (paint.view === 'right') drawSideHead(paint, phase);
  else drawFrontHead(paint, phase, rearView);
}

export function drawBasiliskMirrorcrestMesmerAnatomy(context, direction, phase) {
  const paint = createPainter(context, direction);
  const rearView = paint.view === 'up';
  drawTail(paint, phase);
  drawLegs(paint, phase);
  drawBody(paint, phase, rearView);
  drawHead(paint, phase, rearView);
}

function renderAnatomy(args, phase) {
  args.context.clearRect(0, 0, SIZE, SIZE);
  const colorContext = createColorContext(args.context, phase.flash ? '#f4f4f4' : null);
  drawBasiliskMirrorcrestMesmerAnatomy(colorContext, args.direction, phase);
}

function resultFor(args, renderedAnimation, renderedFrame, motion) {
  return Object.freeze({
    family: args.family.id,
    variant: args.variant.id,
    direction: args.direction,
    animation: args.animation.id,
    frame: args.frame,
    renderedAnimation,
    renderedFrame,
    basiliskMirrorcrestMesmerGate: EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.id,
    architectureDecision: EN_E12_BASILISK_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E12_BASILISK_CROWNSCALE_CRAWLER_GATE.id,
    role: EN_E12_BASILISK_MIRRORCREST_MESMER_CONTRACT.role,
    anatomy: EN_E12_BASILISK_MIRRORCREST_MESMER_CONTRACT.chassis,
    upperBody: 'narrow-diamond-serpent-head-arched-s-neck-connected-split-crescent-moon-silver-mirrorcrest-cyan-eyes-and-ivory-fangs',
    lowerBody: 'lean-long-opaline-plated-deep-teal-body-four-splayed-rose-copper-clawed-legs-and-connected-hooked-loop-tail',
    motion,
    childAssetCount: EN_E12_BASILISK_MIRRORCREST_MESMER_DATA.childAssets.length,
    effectBoundary: EN_E12_BASILISK_MIRRORCREST_MESMER_DATA.effectBoundary,
  });
}

function renderIdle(args) {
  const phase = MOTION_PHASES.idle[args.frame];
  renderAnatomy(args, phase);
  return resultFor(args, 'idle', args.frame, phase.name);
}

function renderWalk(args) {
  const phase = MOTION_PHASES.walk[args.frame];
  renderAnatomy(args, phase);
  return resultFor(args, 'walk', args.frame, phase.name);
}

function renderAttack(args, outputAnimation = 'attack', outputFrame = args.frame) {
  const phase = MOTION_PHASES.attack[args.frame];
  renderAnatomy(args, phase);
  return resultFor(
    { ...args, animation: { ...args.animation, id: outputAnimation }, frame: outputFrame },
    'attack',
    args.frame,
    outputAnimation === 'cast' ? 'exact-cast-alias-of-four-claw-split-aperture-and-body-owned-gaze-lock' : phase.name,
  );
}

function renderHurt(args, outputAnimation = 'hurt', outputFrame = args.frame) {
  const phase = MOTION_PHASES.hurt[args.frame];
  renderAnatomy(args, phase);
  return resultFor(
    { ...args, animation: { ...args.animation, id: outputAnimation }, frame: outputFrame },
    'hurt',
    args.frame,
    outputAnimation === 'death' ? 'exact-death-alias-of-grounded-mirrorcrest-hurt' : phase.name,
  );
}

function renderBasiliskMirrorcrestMesmer(args) {
  assert(args.family.id === 'basilisk', 'The EN-E12 Basilisk renderer is restricted to Basilisk.');
  assert(args.variant.id === 'mirrorcrest-mesmer', 'The EN-E12 Basilisk renderer is restricted to Mirrorcrest Mesmer.');
  if (args.animation.id === 'idle') {
    assert(args.frame >= 0 && args.frame < 2, 'Basilisk Mirrorcrest Mesmer Idle authorizes only F1-F2.');
    return renderIdle(args);
  }
  if (args.animation.id === 'walk') {
    assert(args.frame >= 0 && args.frame < 4, 'Basilisk Mirrorcrest Mesmer Walk authorizes only W1-W4.');
    return renderWalk(args);
  }
  if (args.animation.id === 'attack') {
    assert(args.frame >= 0 && args.frame < 4, 'Basilisk Mirrorcrest Mesmer Attack authorizes only A1-A4.');
    return renderAttack(args);
  }
  if (args.animation.id === 'hurt') {
    assert(args.frame >= 0 && args.frame < 2, 'Basilisk Mirrorcrest Mesmer Hurt authorizes only H1-H2.');
    return renderHurt(args);
  }
  if (args.animation.id === 'cast') {
    assert(args.frame >= 0 && args.frame < 4, 'Basilisk Mirrorcrest Mesmer Cast authorizes only C1-C4.');
    return renderAttack({ ...args, animation: { ...args.animation, id: 'attack' } }, 'cast', args.frame);
  }
  if (args.animation.id === 'death') {
    assert(args.frame >= 0 && args.frame < 4, 'Basilisk Mirrorcrest Mesmer Death authorizes only D1-D4.');
    const sourceFrame = EN_E12_BASILISK_MIRRORCREST_MESMER_DEATH_SOURCE_FRAMES[args.frame];
    return renderHurt({ ...args, animation: { ...args.animation, id: 'hurt' }, frame: sourceFrame }, 'death', args.frame);
  }
  throw new TypeError('The EN-E12 Basilisk Mirrorcrest Mesmer gate authorizes only Idle, Walk, Attack, Cast, Hurt, and Death.');
}

export const EN_E12_BASILISK_MIRRORCREST_MESMER_RENDERER = Object.freeze({
  key: 'en-e12-basilisk-mirrorcrest-mesmer-full-v1',
  chassis: EN_E12_BASILISK_MIRRORCREST_MESMER_CONTRACT.chassis,
  render: renderBasiliskMirrorcrestMesmer,
});

export const EN_E12_BASILISK_MIRRORCREST_MESMER_FAMILY = deepFreeze({
  id: 'basilisk',
  name: 'Basilisk',
  sliceId: 'EN-E12',
  rendererKey: EN_E12_BASILISK_MIRRORCREST_MESMER_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [MIRRORCREST_MESMER_VARIANT],
  rendererData: {
    approvedPrecedingGate: EN_E12_BASILISK_CROWNSCALE_CRAWLER_GATE.id,
    activeGate: EN_E12_BASILISK_MIRRORCREST_MESMER_GATE.id,
    topologyDecision: EN_E12_BASILISK_TOPOLOGY_DECISION.id,
  },
  review: {
    baselineVariant: 'mirrorcrest-mesmer',
    scale: 6,
    notes: 'Published and reconciled private Mirrorcrest Mesmer specialist Basilisk only, bound to exact implementation 9c020537525094430307813e77fd23d7e6308fcc, approval record 7ecc9df1f7f05c38af6cd395bfd26811a0d79099, initial published handoff a983959ccf0fb6c965fcb04e534c170f8b1f854b, candidate digest 3ff5c75cd5272e66cfad42b84c5dbb1e86c20b67f506845923734cda24569a80, and its six frozen review hashes. The designer replied approved letsd do next, so exactly one private elite Basilisk candidate is now open under the selected topology without pixel approval. Keep public or outline registration, fixtures, approved-enemy package mutation, effects, child assets, Manticore, Sphinx, boss work, release, accepted drift, and a pull request separate.',
  },
});

export const EN_E12_BASILISK_MIRRORCREST_MESMER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E12_BASILISK_MIRRORCREST_MESMER_RENDERER],
  families: [EN_E12_BASILISK_MIRRORCREST_MESMER_FAMILY],
});
