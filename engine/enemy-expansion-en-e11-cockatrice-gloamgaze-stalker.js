import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE,
  EN_E11_COCKATRICE_TOPOLOGY_DECISION,
} from './enemy-expansion-en-e11-cockatrice-bramblecomb-scratcher.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E11_COCKATRICE_GLOAMGAZE_STALKER_CONTRACT = deepFreeze({
  family: 'cockatrice',
  variant: 'gloamgaze-stalker',
  role: 'specialist',
  state: 'implemented-complete-motion-candidate',
  chassis: EN_E11_COCKATRICE_TOPOLOGY_DECISION.selected,
  silhouette: 'One connected lean high-necked cockerel-and-serpent actor joins a tall forked comb and narrow wattle, hooked beak, long pale-throated scaled neck, slim feathered torso, two angular folded wings, two separated taloned feet, and one long body-owned serpent tail ending in a raised wedge-shaped hook. It is taller and narrower than Bramblecomb Scratcher and is neither a fan-tailed Peacock, upright Birdfolk person, ordinary two-legged bird, nor quadruped basilisk.',
  identity: 'Deep teal and slate head scales, a pale mint throat mask, dusk-plum body, angular rose-copper wings, forked violet comb, bone hooked beak, lichen-green eyes, dark copper talons, and a blue-black teal-marked hooked serpent tail distinguish the Gloamgaze Stalker specialist.',
  effectBoundary: EN_E11_COCKATRICE_TOPOLOGY_DECISION.effectBoundary,
});

export const EN_E11_COCKATRICE_SPECIALIST_CONTRACT_CARD = deepFreeze({
  family: 'cockatrice',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingGate: EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.id,
  precedingVariant: {
    id: 'bramblecomb-scratcher',
    role: 'common',
    status: 'implemented-full-approved-published-reconciled',
  },
  activeVariant: {
    id: EN_E11_COCKATRICE_GLOAMGAZE_STALKER_CONTRACT.variant,
    role: EN_E11_COCKATRICE_GLOAMGAZE_STALKER_CONTRACT.role,
    status: 'implemented-full-candidate',
  },
  deferredRoles: ['elite'],
});

export const EN_E11_COCKATRICE_GLOAMGAZE_STALKER_GATE = deepFreeze({
  id: 'en-e11-cockatrice-gloamgaze-stalker-full-v1',
  status: 'candidate',
  authorizedOn: '2026-08-13',
  authorizationEvidence: 'The exact Bramblecomb Scratcher implementation c01ac35a5862296469967255ffcadadfd5aaae4e, approval record 335b5c467c10f2042128ef7e7f20367735422909, initial published handoff 9347a28f6cef9c6ca11a163732674d203bc87d94, and final reconciliation f95144ee3fc656dcb624567ee003d344185cbfe5 are pushed and remote verified. The designer approved that exact common packet and continued with: approved lets do next. Under the documented Cockatrice role order and selected baked-single-actor-grounded-serpent-tailed-cockerel topology, the continuation authorizes exactly one private specialist Cockatrice full 80-frame candidate only. It does not approve candidate pixels or authorize public or outline registration, fixtures, effects, child assets, elite Cockatrice, Raven, Owl, Phoenix, release, accepted drift, or a pull request.',
  baseCheckpoint: 'f95144ee3fc656dcb624567ee003d344185cbfe5',
  architectureDecision: EN_E11_COCKATRICE_TOPOLOGY_DECISION.id,
  precedingApproval: {
    gateId: EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.id,
    candidateFrameDigest: EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.initialPublishedHandoff,
    currentReconciliation: 'f95144ee3fc656dcb624567ee003d344185cbfe5',
  },
  artifact: 'enemy-expansion-review/en-e11-cockatrice-gloamgaze-stalker/en-e11-cockatrice-gloamgaze-stalker-full-suite-raw.png',
  artifactSha256: '6c68b97f972f396b93cdffc51508846f626fa408c07ccbc346ad5834d96ca9c8',
  outlinedArtifact: 'enemy-expansion-review/en-e11-cockatrice-gloamgaze-stalker/en-e11-cockatrice-gloamgaze-stalker-full-suite-outlined-complete-b.png',
  outlinedArtifactSha256: 'e2334a8c390e8ff461fceefd5fb2f520331b185d050d17b33cd0bce35424f49a',
  assembledArtifact: 'enemy-expansion-review/en-e11-cockatrice-gloamgaze-stalker/en-e11-cockatrice-gloamgaze-stalker-full-suite-complete-b-form.png',
  assembledArtifactSha256: '290ae13e6502ae5247540e48bc7ce433a498f254d40c1cf22d1e989db69a7eb7',
  comparisonArtifact: 'enemy-expansion-review/en-e11-cockatrice-gloamgaze-stalker/en-e11-cockatrice-gloamgaze-stalker-family-comparison.png',
  comparisonArtifactSha256: 'c61716adca6a92d6c64a76bfd7bdb308b5b9a27c1ef28e5f3b09ae9df8c72ba9',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e11-cockatrice-gloamgaze-stalker/en-e11-cockatrice-gloamgaze-stalker-full-suite-four-directions-labeled.gif',
      sha256: '866ec849db45b9c6bd5bda91b7e918b6fba63ac78389a51d744eab5dae13fc84',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e11-cockatrice-gloamgaze-stalker/en-e11-cockatrice-gloamgaze-stalker-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '600c2a2de173c5b9c9cf55fed7a16e4ee330a688b968e10e1145fe599aa40e1a',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
  },
  candidateFrameDigest: '7752f15be95848bb5af6d1b89e79cd9f07ff3f1be8776427857497773d5b4eb8',
  bramblecombComparisonDigest: '0d55f7dc0fafac3014bcdfa1ea2dce3cbb4b5ba09eb6c52f6c723067702b9764',
  aerieScoutComparisonDigest: 'afff790c5f60684561752ff7fe9f8f4312c5b46679477cc88d29764379ca41c8',
  marshCrocodileComparisonDigest: 'aaabe38311ec314f97b902e92ee6f426199f33c2f5051e8a7ffc7a58c737a19a',
  scope: 'One complete private 80-frame Cockatrice Gloamgaze Stalker specialist enemy across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle holds a tall sidelong vigil over a narrow connected tail hook. Walk alternates two stalking talon steps with angular wing, throat-mask, and tail counter-motion. Attack plants both talons, raises a forked gaze-screen posture, folds an angular wing through the face line, lifts the connected serpent tail into a high hooked counter-feint, drives a short beak feint, and recovers. Hurt uses a complete-silhouette #f4f4f4 recoil and colored grounded recovery. Cast aliases Attack exactly and Death aliases Hurt H1,H2,H2,H2.',
  anatomyContract: EN_E11_COCKATRICE_GLOAMGAZE_STALKER_CONTRACT.silhouette,
  reviewPresentation: 'Show the exact labeled all-four-direction Gloamgaze Stalker raw/no-outline, outlined Complete B, Complete B + Form, Bramblecomb/Aerie Scout/Marsh Crocodile comparison board, and both synchronized full-suite GIFs together.',
  exclusions: [
    'approved Bramblecomb Scratcher pixel changes',
    'approved Aerie Scout pixel changes',
    'public Marsh Crocodile pixel changes',
    'Cockatrice elite',
    'Raven',
    'Owl',
    'Phoenix',
    'new Cast pixels',
    'new Death pixels',
    'detached serpent-tail child assets',
    'baked petrifying-gaze pixels',
    'baked venom pixels',
    'baked dust pixels',
    'baked glow pixels',
    'baked projectile pixels',
    'baked impact pixels',
    'registration',
    'consumer exposure',
    'fixtures',
    'effects',
    'release',
    'later EN-E11 work',
  ],
  nextGate: 'Stop after the exact hash-frozen private Gloamgaze Stalker review packet is generated and validated. Explicit designer visual approval is required before any commit, push, publication, registration, fixture, effect, elite Cockatrice, other Bird family, release, accepted drift, or pull-request work. The distinct outlined PNG is review evidence only and does not authorize outline registration.',
});

export const EN_E11_COCKATRICE_GLOAMGAZE_STALKER_DATA = deepFreeze({
  actor: {
    species: 'cockatrice',
    bodyBuild: 'lean-high-necked-hooktail-cockerel',
    skin: 'feathered-scaled',
    hairStyle: 'forked-gloam-comb',
    hairColor: 'violet',
    expression: 'mesmeric',
    faceDetail: 'hooked-beak',
    headgear: 'none',
    outfit: 'none',
    outfitColor: 'dusk-plum',
    outfitTier: 'tier1',
    weapon: 'none',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: ['#486b70', '#2c3f55', '#8daea5'],
      hair: ['#6e3b6f', '#3b294d', '#a25983'],
      outfit: ['#4b3f62', '#292d42', '#8f5961'],
    },
  },
  actorTopology: EN_E11_COCKATRICE_TOPOLOGY_DECISION.selected,
  childAssets: [],
  cockatrice: {
    head: ['#486b70', '#2c3f55', '#8daea5'],
    body: ['#4b3f62', '#292d42', '#766080'],
    wing: ['#8f5961', '#543646', '#c07a6a'],
    comb: ['#6e3b6f', '#3b294d', '#a25983'],
    tail: ['#233d4d', '#172937', '#3e6570'],
    scale: ['#7aa09a', '#456775', '#a9c2aa'],
    beak: ['#c7b98f', '#736b58', '#e2d7ae'],
    talon: ['#9b704f', '#523b38'],
    eye: '#b9e46b',
    feature: '#1c1d2b',
  },
  effectBoundary: 'external-petrifying-gaze-venom-dust-glow-projectiles-and-impacts',
  bakedEffects: [],
});

const GLOAMGAZE_STALKER_VARIANT = deepFreeze({
  id: 'gloamgaze-stalker',
  name: 'Gloamgaze Stalker',
  role: EN_E11_COCKATRICE_GLOAMGAZE_STALKER_CONTRACT.role,
  status: EN_E11_COCKATRICE_GLOAMGAZE_STALKER_CONTRACT.state,
  brief: 'Specialist natural Cockatrice with a tall forked violet comb, bone hooked beak, long pale-throated teal neck, slim plum body, angular rose-copper wings, stalking talons, and one long connected blue-black serpent tail that rises into a high hook during its planted gaze feint.',
  rendererData: EN_E11_COCKATRICE_GLOAMGAZE_STALKER_DATA,
});

export const EN_E11_COCKATRICE_GLOAMGAZE_STALKER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'gloam-vigil', upperBob: 0, wingPhase: 0, legPhase: 0, tailMode: 'coil', tailSway: -1, beakReach: 0, neckShift: 0, flash: false },
  { name: 'throat-mask-breath', upperBob: 1, wingPhase: 1, legPhase: 0, tailMode: 'coil', tailSway: 1, beakReach: 0, neckShift: 0, flash: false },
]);

const WALK_PHASES = deepFreeze([
  { name: 'shadow-left-step', upperBob: 0, wingPhase: 1, legPhase: 1, tailMode: 'coil', tailSway: -1, beakReach: 0, neckShift: 0, flash: false },
  { name: 'mask-compress', upperBob: 1, wingPhase: 0, legPhase: 2, tailMode: 'brace', tailSway: 0, beakReach: 0, neckShift: 0, flash: false },
  { name: 'shadow-right-step', upperBob: 0, wingPhase: 1, legPhase: 3, tailMode: 'coil', tailSway: 1, beakReach: 0, neckShift: 0, flash: false },
  { name: 'hooktail-recover', upperBob: 0, wingPhase: 2, legPhase: 4, tailMode: 'brace', tailSway: 0, beakReach: 0, neckShift: 0, flash: false },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'two-talon-trance-brace', upperBob: 0, wingPhase: 2, legPhase: 1, tailMode: 'brace', tailSway: 0, beakReach: 0, neckShift: 0, flash: false },
  { name: 'forked-gaze-screen-rise', upperBob: 0, wingPhase: 3, legPhase: 0, tailMode: 'hook', tailSway: 0, beakReach: 0, neckShift: 0, flash: false },
  { name: 'hooktail-gaze-feint', upperBob: 0, wingPhase: 4, legPhase: 3, tailMode: 'hook', tailSway: 1, beakReach: 1, neckShift: 1, flash: false },
  { name: 'stalker-fold-recover', upperBob: 1, wingPhase: 1, legPhase: 0, tailMode: 'coil', tailSway: 0, beakReach: 0, neckShift: 0, flash: false },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-gaze-recoil', upperBob: 0, wingPhase: 2, legPhase: 1, tailMode: 'brace', tailSway: -1, beakReach: 0, neckShift: 0, flash: true },
  { name: 'grounded-hook-recovery', upperBob: 1, wingPhase: 1, legPhase: 0, tailMode: 'coil', tailSway: 0, beakReach: 0, neckShift: 0, flash: false },
]);

const FRONT_LEG_PHASES = deepFreeze([
  { leftX: 0, rightX: 0 },
  { leftX: -1, rightX: 1 },
  { leftX: 1, rightX: 0 },
  { leftX: 0, rightX: -1 },
  { leftX: -1, rightX: 0 },
]);

const SIDE_LEG_PHASES = deepFreeze([
  { farX: 0, nearX: 0 },
  { farX: -1, nearX: 1 },
  { farX: 0, nearX: 1 },
  { farX: -1, nearX: 0 },
  { farX: 0, nearX: 0 },
]);

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
      'Gloamgaze Stalker rectangles must use positive integer geometry.',
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

function drawFrontTail(paint, phase) {
  const { tail, scale } = EN_E11_COCKATRICE_GLOAMGAZE_STALKER_DATA.cockatrice;
  if (phase.tailMode === 'hook') {
    paint.rect(13, 14, 5, 5, tail[0]);
    paint.rect(17, 12, 3, 5, tail[1]);
    paint.rect(19, 8, 3, 6, tail[2]);
    paint.rect(20, 7, 2, 2, tail[0]);
    paint.dot(20, 7, scale[2]);
    paint.dot(20, 10, scale[0]);
    paint.dot(18, 13, scale[1]);
    paint.dot(15, 16, scale[2]);
    return;
  }
  const sway = phase.tailSway;
  const brace = phase.tailMode === 'brace' ? 1 : 0;
  paint.rect(8, 14, 5, 5, tail[0]);
  paint.rect(5 + sway, 16, 5 + brace, 4, tail[1]);
  paint.rect(3 + sway, 18, 4 + brace, 3, tail[2]);
  paint.rect(2 + sway, 17, 2, 2, tail[0]);
  paint.dot(2 + sway, 17, scale[2]);
  paint.dot(5 + sway, 19, scale[0]);
  paint.dot(8 + sway, 17, scale[1]);
}

function drawSideTail(paint, phase) {
  const { tail, scale } = EN_E11_COCKATRICE_GLOAMGAZE_STALKER_DATA.cockatrice;
  if (phase.tailMode === 'hook') {
    paint.rect(9, 14, 5, 5, tail[0]);
    paint.rect(6, 15, 4, 4, tail[1]);
    paint.rect(4, 12, 3, 5, tail[2]);
    paint.rect(2, 9, 3, 5, tail[0]);
    paint.rect(1, 8, 3, 3, tail[2]);
    paint.dot(1, 8, scale[2]);
    paint.dot(3, 11, scale[0]);
    paint.dot(5, 14, scale[1]);
    paint.dot(8, 16, scale[2]);
    return;
  }
  const sway = phase.tailSway;
  const brace = phase.tailMode === 'brace' ? 1 : 0;
  paint.rect(9, 14, 5, 5, tail[0]);
  paint.rect(6 + sway, 16, 5 + brace, 4, tail[1]);
  paint.rect(3 + sway, 18, 4 + brace, 3, tail[2]);
  paint.rect(1, 17, 3 + Math.max(0, sway), 2, tail[0]);
  paint.dot(1, 17, scale[2]);
  paint.dot(5 + sway, 19, scale[0]);
  paint.dot(8 + sway, 17, scale[1]);
}

function drawTail(paint, phase) {
  if (paint.view === 'right') drawSideTail(paint, phase);
  else drawFrontTail(paint, phase);
}

function drawFrontBody(paint, phase, rearView) {
  const { body, wing, scale } = EN_E11_COCKATRICE_GLOAMGAZE_STALKER_DATA.cockatrice;
  const bob = phase.upperBob;
  paint.rect(8, 10 + bob, 9, 9, body[0]);
  paint.rect(9, 15 + bob, 7, 4, body[1]);
  paint.rect(10, 11 + bob, 5, 6, rearView ? scale[1] : body[2]);
  if (phase.wingPhase === 4) {
    paint.rect(3, 8 + bob, 9, 6, wing[0]);
    paint.rect(11, 10 + bob, 10, 5, wing[0]);
    paint.rect(4, 12 + bob, 8, 5, wing[1]);
    paint.rect(13, 14 + bob, 8, 4, wing[1]);
    paint.rect(5, 9 + bob, 6, 2, wing[2]);
    paint.rect(15, 16 + bob, 5, 2, wing[2]);
    return;
  }
  if (phase.wingPhase === 3) {
    paint.rect(4, 6 + bob, 7, 11, wing[0]);
    paint.rect(14, 8 + bob, 6, 9, wing[0]);
    paint.rect(5, 11 + bob, 6, 7, wing[1]);
    paint.rect(14, 13 + bob, 6, 5, wing[1]);
    paint.rect(6, 7 + bob, 5, 3, wing[2]);
    paint.rect(14, 9 + bob, 4, 3, wing[2]);
    return;
  }
  const spread = phase.wingPhase === 2 ? 1 : 0;
  const lower = phase.wingPhase === 1 ? 1 : 0;
  paint.rect(6 - spread, 11 + bob + lower, 5 + spread, 7, wing[0]);
  paint.rect(14, 11 + bob + lower, 5 + spread, 7, wing[0]);
  paint.rect(6 - spread, 15 + bob + lower, 5 + spread, 3, wing[1]);
  paint.rect(14, 15 + bob + lower, 5 + spread, 3, wing[1]);
  paint.rect(8, 17 + bob + lower, 3, 2, wing[2]);
  paint.rect(14, 17 + bob + lower, 3, 2, wing[2]);
}

function drawSideBody(paint, phase) {
  const { body, wing, scale } = EN_E11_COCKATRICE_GLOAMGAZE_STALKER_DATA.cockatrice;
  const bob = phase.upperBob;
  paint.rect(10, 10 + bob, 9, 9, body[0]);
  paint.rect(11, 15 + bob, 8, 4, body[1]);
  paint.rect(10, 11 + bob, 4, 6, scale[1]);
  if (phase.wingPhase === 4) {
    paint.rect(9, 7 + bob, 12, 7, wing[0]);
    paint.rect(10, 12 + bob, 11, 5, wing[1]);
    paint.rect(13, 15 + bob, 8, 3, wing[2]);
    return;
  }
  if (phase.wingPhase === 3) {
    paint.rect(9, 5 + bob, 8, 12, wing[0]);
    paint.rect(10, 10 + bob, 8, 8, wing[1]);
    paint.rect(11, 6 + bob, 6, 4, wing[2]);
    return;
  }
  const spread = phase.wingPhase === 2 ? 1 : 0;
  const lower = phase.wingPhase === 1 ? 1 : 0;
  paint.rect(9 - spread, 11 + bob + lower, 9 + spread, 7, wing[0]);
  paint.rect(9 - spread, 15 + bob + lower, 8 + spread, 3, wing[1]);
  paint.rect(11, 17 + bob + lower, 5, 2, wing[2]);
}

function drawBody(paint, phase, rearView) {
  if (paint.view === 'right') drawSideBody(paint, phase);
  else drawFrontBody(paint, phase, rearView);
}

function drawFrontLeg(paint, x, rearView) {
  const { body, talon } = EN_E11_COCKATRICE_GLOAMGAZE_STALKER_DATA.cockatrice;
  paint.rect(x, 16, 2, 5, rearView ? body[1] : body[2]);
  paint.rect(x, 20, 2, 2, talon[1]);
  paint.rect(x - 1, 22, 4, 1, rearView ? talon[1] : talon[0]);
}

function drawSideLeg(paint, x, farLeg) {
  const { body, talon } = EN_E11_COCKATRICE_GLOAMGAZE_STALKER_DATA.cockatrice;
  paint.rect(x, 16, 2, 5, farLeg ? body[1] : body[2]);
  paint.rect(x, 20, 2, 2, talon[1]);
  paint.rect(x - 1, 22, 4, 1, farLeg ? talon[1] : talon[0]);
}

function drawLegs(paint, phase, rearView) {
  if (paint.view === 'right') {
    const state = SIDE_LEG_PHASES[phase.legPhase];
    drawSideLeg(paint, 10 + state.farX, true);
    drawSideLeg(paint, 16 + state.nearX, false);
    return;
  }
  const state = FRONT_LEG_PHASES[phase.legPhase];
  drawFrontLeg(paint, 8 + state.leftX, rearView);
  drawFrontLeg(paint, 15 + state.rightX, rearView);
}

function drawFrontHead(paint, phase, rearView) {
  const { head, comb, scale, beak, eye, feature } = EN_E11_COCKATRICE_GLOAMGAZE_STALKER_DATA.cockatrice;
  const bob = phase.upperBob;
  const shift = phase.neckShift;
  paint.rect(10, 5 + bob + shift, 5, 9 - Math.max(0, shift), head[0]);
  paint.rect(11, 7 + bob + shift, 3, 7 - Math.max(0, shift), scale[2]);
  paint.rect(8, 3 + bob + shift, 8, 4, head[0]);
  paint.rect(9, 1 + bob + shift, 2, 3, comb[2]);
  paint.rect(11, 2 + bob + shift, 2, 2, comb[0]);
  paint.rect(13, 1 + bob + shift, 2, 3, comb[2]);
  paint.rect(9, 3 + bob + shift, 6, 1, comb[1]);
  if (rearView) {
    paint.rect(9, 4 + bob + shift, 6, 3, head[1]);
    paint.dot(10, 5 + bob + shift, scale[2]);
    paint.dot(13, 6 + bob + shift, scale[0]);
    paint.rect(11, 7 + bob + shift, 3, 3, scale[0]);
    return;
  }
  paint.dot(10, 4 + bob + shift, eye);
  paint.dot(14, 4 + bob + shift, eye);
  paint.dot(10, 5 + bob + shift, feature);
  paint.dot(14, 5 + bob + shift, feature);
  paint.rect(11, 5 + bob + shift, 3, 2 + phase.beakReach, beak[0]);
  paint.rect(11, 7 + bob + shift + phase.beakReach, 3, 1, beak[1]);
  paint.rect(10, 7 + bob + shift, 2, 3, comb[0]);
  paint.dot(10, 9 + bob + shift, comb[2]);
}

function drawSideHead(paint, phase) {
  const { head, comb, scale, beak, eye, feature } = EN_E11_COCKATRICE_GLOAMGAZE_STALKER_DATA.cockatrice;
  const bob = phase.upperBob;
  const shift = phase.neckShift;
  paint.rect(13, 5 + bob + shift, 5, 9 - Math.max(0, shift), head[0]);
  paint.rect(12, 8 + bob + shift, 4, 6 - Math.max(0, shift), scale[2]);
  paint.rect(14, 3 + bob + shift, 7, 4, head[0]);
  paint.rect(14, 1 + bob + shift, 2, 3, comb[2]);
  paint.rect(16, 2 + bob + shift, 2, 2, comb[0]);
  paint.rect(18, 1 + bob + shift, 2, 3, comb[2]);
  paint.rect(14, 3 + bob + shift, 6, 1, comb[1]);
  paint.dot(18, 4 + bob + shift, eye);
  paint.dot(19, 4 + bob + shift, feature);
  paint.rect(19, 5 + bob + shift, 3 + phase.beakReach, 2, beak[0]);
  paint.dot(21 + phase.beakReach, 7 + bob + shift, beak[1]);
  paint.rect(16, 7 + bob + shift, 3, 3, comb[0]);
  paint.dot(17, 9 + bob + shift, comb[2]);
}

function drawHead(paint, phase, rearView) {
  if (paint.view === 'right') drawSideHead(paint, phase);
  else drawFrontHead(paint, phase, rearView);
}

export function drawCockatriceGloamgazeStalkerAnatomy(context, direction, phase) {
  const paint = createPainter(context, direction);
  const rearView = paint.view === 'up';
  drawTail(paint, phase);
  drawBody(paint, phase, rearView);
  drawLegs(paint, phase, rearView);
  drawHead(paint, phase, rearView);
}

function renderAnatomy(args, phase) {
  args.context.clearRect(0, 0, SIZE, SIZE);
  const colorContext = createColorContext(args.context, phase.flash ? '#f4f4f4' : null);
  drawCockatriceGloamgazeStalkerAnatomy(colorContext, args.direction, phase);
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
    cockatriceGloamgazeStalkerGate: EN_E11_COCKATRICE_GLOAMGAZE_STALKER_GATE.id,
    architectureDecision: EN_E11_COCKATRICE_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.id,
    role: EN_E11_COCKATRICE_GLOAMGAZE_STALKER_CONTRACT.role,
    anatomy: EN_E11_COCKATRICE_GLOAMGAZE_STALKER_CONTRACT.chassis,
    upperBody: 'forked-violet-comb-narrow-wattle-bone-hooked-beak-long-pale-throated-teal-neck-and-angular-rose-copper-wings',
    lowerBody: 'two-separated-grounded-dark-copper-talons-and-one-connected-blue-black-high-hooked-serpent-tail',
    motion,
    childAssetCount: EN_E11_COCKATRICE_GLOAMGAZE_STALKER_DATA.childAssets.length,
    effectBoundary: EN_E11_COCKATRICE_GLOAMGAZE_STALKER_DATA.effectBoundary,
  });
}

function renderIdle(args) {
  const phase = IDLE_PHASES[args.frame];
  renderAnatomy(args, phase);
  return resultFor(args, 'idle', args.frame, phase.name);
}

function renderWalk(args) {
  const phase = WALK_PHASES[args.frame];
  renderAnatomy(args, phase);
  return resultFor(args, 'walk', args.frame, phase.name);
}

function renderAttack(args, outputAnimation = 'attack', outputFrame = args.frame) {
  const phase = ATTACK_PHASES[args.frame];
  renderAnatomy(args, phase);
  return resultFor(
    { ...args, animation: { ...args.animation, id: outputAnimation }, frame: outputFrame },
    'attack',
    args.frame,
    outputAnimation === 'cast' ? 'exact-cast-alias-of-connected-gaze-screen-beak-feint-and-hooktail-rise' : phase.name,
  );
}

function renderHurt(args, outputAnimation = 'hurt', outputFrame = args.frame) {
  const phase = HURT_PHASES[args.frame];
  renderAnatomy(args, phase);
  return resultFor(
    { ...args, animation: { ...args.animation, id: outputAnimation }, frame: outputFrame },
    'hurt',
    args.frame,
    outputAnimation === 'death' ? 'exact-death-alias-of-grounded-gloamgaze-hurt' : phase.name,
  );
}

function renderCockatriceGloamgazeStalker(args) {
  assert(args.family.id === 'cockatrice', 'The EN-E11 Cockatrice renderer is restricted to Cockatrice.');
  assert(args.variant.id === 'gloamgaze-stalker', 'The EN-E11 Cockatrice renderer is restricted to Gloamgaze Stalker.');
  if (args.animation.id === 'idle') {
    assert(args.frame >= 0 && args.frame < 2, 'Cockatrice Gloamgaze Stalker Idle authorizes only F1-F2.');
    return renderIdle(args);
  }
  if (args.animation.id === 'walk') {
    assert(args.frame >= 0 && args.frame < 4, 'Cockatrice Gloamgaze Stalker Walk authorizes only W1-W4.');
    return renderWalk(args);
  }
  if (args.animation.id === 'attack') {
    assert(args.frame >= 0 && args.frame < 4, 'Cockatrice Gloamgaze Stalker Attack authorizes only A1-A4.');
    return renderAttack(args);
  }
  if (args.animation.id === 'hurt') {
    assert(args.frame >= 0 && args.frame < 2, 'Cockatrice Gloamgaze Stalker Hurt authorizes only H1-H2.');
    return renderHurt(args);
  }
  if (args.animation.id === 'cast') {
    assert(args.frame >= 0 && args.frame < 4, 'Cockatrice Gloamgaze Stalker Cast authorizes only C1-C4.');
    return renderAttack({ ...args, animation: { ...args.animation, id: 'attack' } }, 'cast', args.frame);
  }
  if (args.animation.id === 'death') {
    assert(args.frame >= 0 && args.frame < 4, 'Cockatrice Gloamgaze Stalker Death authorizes only D1-D4.');
    const sourceFrame = EN_E11_COCKATRICE_GLOAMGAZE_STALKER_DEATH_SOURCE_FRAMES[args.frame];
    return renderHurt({ ...args, animation: { ...args.animation, id: 'hurt' }, frame: sourceFrame }, 'death', args.frame);
  }
  throw new TypeError('The EN-E11 Cockatrice Gloamgaze Stalker gate authorizes only Idle, Walk, Attack, Cast, Hurt, and Death.');
}

export const EN_E11_COCKATRICE_GLOAMGAZE_STALKER_RENDERER = Object.freeze({
  key: 'en-e11-cockatrice-gloamgaze-stalker-full-v1',
  chassis: EN_E11_COCKATRICE_GLOAMGAZE_STALKER_CONTRACT.chassis,
  render: renderCockatriceGloamgazeStalker,
});

export const EN_E11_COCKATRICE_GLOAMGAZE_STALKER_FAMILY = deepFreeze({
  id: 'cockatrice',
  name: 'Cockatrice',
  sliceId: 'EN-E11',
  rendererKey: EN_E11_COCKATRICE_GLOAMGAZE_STALKER_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [GLOAMGAZE_STALKER_VARIANT],
  rendererData: {
    approvedPrecedingGate: EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.id,
    activeGate: EN_E11_COCKATRICE_GLOAMGAZE_STALKER_GATE.id,
    topologyDecision: EN_E11_COCKATRICE_TOPOLOGY_DECISION.id,
  },
  review: {
    baselineVariant: 'gloamgaze-stalker',
    scale: 6,
    notes: 'Private specialist Cockatrice candidate only, authorized by the designer continuation attached to exact Bramblecomb Scratcher approval after that common publication tuple became remote verified and reconciled. Review the exact raw, Complete B outline, Complete B + Form, sibling/comparison, and animated full-suite evidence together. Candidate pixels are not approved. Keep public or outline registration, fixtures, effects, child assets, elite Cockatrice, later Bird families, release, accepted drift, commit, push, publication, and a pull request separate until explicit visual approval.',
  },
});

export const EN_E11_COCKATRICE_GLOAMGAZE_STALKER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E11_COCKATRICE_GLOAMGAZE_STALKER_RENDERER],
  families: [EN_E11_COCKATRICE_GLOAMGAZE_STALKER_FAMILY],
});
