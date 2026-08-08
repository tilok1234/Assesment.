import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E04_MERFOLK_DEATH_SOURCE_FRAMES,
  EN_E04_MERFOLK_TIDEGUARD_DATA,
  EN_E04_MERFOLK_TIDEGUARD_GATE,
  EN_E04_MERFOLK_TIDEGUARD_RENDERER,
} from './enemy-expansion-en-e04-merfolk-tideguard.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E04_MERFOLK_REEFCALLER_CONTRACT = deepFreeze({
  family: 'merfolk',
  variant: 'reefcaller',
  role: 'specialist',
  state: 'implemented-complete-motion-candidate',
  chassis: 'approved-upright-piscine-humanoid',
  source: 'approved Merfolk Tideguard full-enemy anatomy and motion',
  silhouette: 'The approved Tideguard humanoid-to-fishtail silhouette gains one connected branching coral crown, broad reef mantle, luminous chest sigil, and enlarged head fins without introducing ordinary legs, paired feet, or detached islands.',
  identity: 'Violet reef mantle, coral crown, pale pearl sigil, gold shell clasps, luminous aqua fin marks, and the approved continuous sea-green tail distinguish the specialist.',
  effectBoundary: 'Healing currents, reef sigils, bubble spirals, coral growth, water bolts, tide arcs, foam, splashes, undertow rings, and impacts remain external.',
});

export const EN_E04_MERFOLK_REEFCALLER_GATE = deepFreeze({
  id: 'en-e04-merfolk-reefcaller-full-v1',
  status: 'approved',
  authorizedOn: '2026-08-09',
  authorizationEvidence: 'After approving and publishing the complete Merfolk Tideguard, the designer said: lets do next. The documented EN-E04 order advances from Merfolk common to Merfolk specialist before elite or Birdfolk; Codex bounded the continuation to one complete 80-frame Merfolk Reefcaller specialist enemy only.',
  approvedOn: '2026-08-09',
  approvalEvidence: 'The designer reviewed the final hash-frozen raw/no-outline and Complete B + Form Merfolk Reefcaller full-suite pair after requiring both visible side-eye pixels to be coral-red and said: approved.',
  precedingApproval: {
    gateId: EN_E04_MERFOLK_TIDEGUARD_GATE.id,
    artifactSha256: EN_E04_MERFOLK_TIDEGUARD_GATE.artifactSha256,
    assembledArtifactSha256: EN_E04_MERFOLK_TIDEGUARD_GATE.assembledArtifactSha256,
    rawAnimationSha256: EN_E04_MERFOLK_TIDEGUARD_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E04_MERFOLK_TIDEGUARD_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E04_MERFOLK_TIDEGUARD_GATE.candidateFrameDigest,
    publishedCheckpoint: '622b00f0c40eed552f61b30bd207b5ad8478836e',
    publishedHandoff: '6594b2e01bd639997ace424c6a8427ac307196b4',
  },
  artifact: 'enemy-expansion-review/en-e04-merfolk-reefcaller/en-e04-merfolk-reefcaller-full-suite-raw.png',
  artifactSha256: 'c9d3097c543d407f4c700a9631d9046e7ff1e756ab91fb930b51af931326c5fe',
  assembledArtifact: 'enemy-expansion-review/en-e04-merfolk-reefcaller/en-e04-merfolk-reefcaller-full-suite-complete-b-form.png',
  assembledArtifactSha256: '2df2948b30c3efb89aff386fb558126fe3f478d157d83390cdd3a02adcd88c43',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e04-merfolk-reefcaller/en-e04-merfolk-reefcaller-full-suite-four-directions-labeled.gif',
      sha256: '7d57aeaceca0ce5bc85b7a0b1fbafc9ff5889c1add9a946f4a7b8a2b8eb075c8',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e04-merfolk-reefcaller/en-e04-merfolk-reefcaller-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: 'f79945414fd1357b328a2d1af5685517d20c1a7f706a0c1939231b07a446cd24',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
  },
  candidateFrameDigest: 'fc223d0b944152c18481acfe4a775936b5da5659666edb0d35726eef5c6228f7',
  scope: 'One complete 80-frame Merfolk Reefcaller specialist enemy across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'All 80 frames delegate the approved Tideguard full-body motion and fused-tail anatomy, then carry the connected Reefcaller crown, mantle, clasps, fins, pearl sigil, and both visible coral-red side eyes through the same transforms. Tall-crown rise and recoil brace at the one-cell ceiling. Cast aliases Attack exactly and Death aliases Hurt H1,H2,H2,H2.',
  anatomyContract: EN_E04_MERFOLK_REEFCALLER_CONTRACT.silhouette,
  reviewPresentation: 'Show the exact labeled all-four-direction Merfolk Reefcaller full-suite raw/no-outline and Complete B + Form boards and GIFs together. The four GIF phases display Idle, Walk, Attack, Cast, Hurt, and Death simultaneously.',
  exclusions: [
    'approved Tideguard pixel changes',
    'Merfolk elite',
    'Birdfolk',
    'new Cast pixels',
    'new Death pixels',
    'baked healing-current pixels',
    'baked reef-sigil pixels',
    'baked bubble-spiral pixels',
    'baked coral-growth pixels',
    'baked water-bolt pixels',
    'baked tide-arc pixels',
    'baked foam pixels',
    'baked splash pixels',
    'baked undertow-ring pixels',
    'registration',
    'consumer exposure',
    'effects',
    'release',
    'later EN-E04 work',
  ],
  nextGate: 'Visual approval is complete. Bounded commit, push, and publication of this exact ten-file Reefcaller lane are authorized. No Merfolk elite, Birdfolk, registration, integration, effects, release, or broader EN-E04 work is authorized.',
});

export const EN_E04_MERFOLK_REEFCALLER_DATA = deepFreeze({
  actor: EN_E04_MERFOLK_TIDEGUARD_DATA.actor,
  identity: { overlays: [] },
  merfolk: EN_E04_MERFOLK_TIDEGUARD_DATA.merfolk,
  reefcaller: {
    mantle: ['#745497', '#3f315f', '#a77bc2'],
    coral: ['#d96270', '#743844', '#f08b87'],
    pearl: ['#eef7dc', '#93b8aa', '#ffffff'],
    shellGold: ['#e0a15e', '#805035', '#ffd17d'],
    glow: ['#76e1d0', '#309b9b'],
  },
  effectBoundary: 'external-healing-currents-reef-sigils-bubble-spirals-coral-growth-water-bolts-tide-arcs-foam-splashes-undertow-rings-and-impacts',
  bakedEffects: [],
});

const REEFCALLER_VARIANT = deepFreeze({
  id: 'reefcaller',
  name: 'Reefcaller',
  role: EN_E04_MERFOLK_REEFCALLER_CONTRACT.role,
  status: EN_E04_MERFOLK_REEFCALLER_CONTRACT.state,
  brief: 'Specialist Merfolk ritualist with a connected coral crown, violet reef mantle, luminous pearl sigil, gold shell clasps, enlarged fins, and the approved fused Tideguard tail; all healing and water effects remain external.',
  rendererData: EN_E04_MERFOLK_REEFCALLER_DATA,
});

const TIDEGUARD_SOURCE_VARIANT = deepFreeze({ id: 'tideguard' });

const MOTION_PHASES = deepFreeze({
  idle: [
    { forward: 0, lift: 0, identityPhase: 0, flash: false },
    { forward: 0, lift: 0, identityPhase: 1, flash: false },
  ],
  walk: [
    { forward: 0, lift: 0, identityPhase: 0, flash: false },
    { forward: 0, lift: 0, identityPhase: 1, flash: false },
    { forward: 0, lift: 0, identityPhase: 0, flash: false },
    { forward: 0, lift: 0, identityPhase: 1, flash: false },
  ],
  attack: [
    { forward: -1, lift: 0, identityPhase: 0, flash: false },
    { forward: -1, lift: -1, identityPhase: 0, flash: false },
    { forward: 1, lift: 0, identityPhase: 0, flash: false },
    { forward: 0, lift: 0, identityPhase: 1, flash: false },
  ],
  hurt: [
    { forward: -1, lift: -1, identityPhase: 0, flash: true },
    { forward: 0, lift: 0, identityPhase: 1, flash: false },
  ],
});

function physicalShift(direction, phase) {
  if (direction === 'right') return Object.freeze({ x: phase.forward, y: phase.lift });
  if (direction === 'left') return Object.freeze({ x: -phase.forward, y: phase.lift });
  return Object.freeze({
    x: 0,
    y: phase.lift + (direction === 'down' ? phase.forward : -phase.forward),
  });
}

function createPainter(context, direction, shift, forcedColor) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Reefcaller rectangles must use positive integer geometry.',
    );
    context.fillStyle = forcedColor || fill;
    const drawX = mirrored ? SIZE - x - width : x;
    context.fillRect(drawX + shift.x, y + shift.y, width, height);
  };
  return {
    view,
    rect,
    dot(x, y, fill) {
      rect(x, y, 1, 1, fill);
    },
  };
}

function drawFrontReefcaller({ rect, dot }, identityPhase, rearView) {
  const { mantle, coral, pearl, shellGold, glow } = EN_E04_MERFOLK_REEFCALLER_DATA.reefcaller;
  const bob = identityPhase;
  rect(9, 3 + bob, 6, 2, coral[1]);
  rect(10, 2 + bob, 1, 2, coral[0]);
  rect(13, 2 + bob, 1, 2, coral[0]);
  dot(11, 2 + bob, pearl[0]);
  dot(12, 3 + bob, shellGold[2]);
  rect(5, 6 + bob, 4, 3, mantle[1]);
  rect(15, 6 + bob, 4, 3, mantle[1]);
  dot(5, 7 + bob, glow[0]);
  dot(18, 7 + bob, glow[0]);
  rect(6, 10 + bob, 12, 2, mantle[1]);
  rect(7, 11 + bob, 10, 3, mantle[0]);
  rect(9, 13 + bob, 6, 2, mantle[1]);
  dot(7, 12 + bob, shellGold[2]);
  dot(16, 12 + bob, shellGold[2]);
  rect(10, 12 + bob, 4, 2, pearl[1]);
  dot(11, 12 + bob, pearl[2]);
  dot(12, 13 + bob, glow[0]);
  if (rearView) {
    rect(11, 5 + bob, 2, 5, mantle[2]);
    dot(12, 6 + bob, coral[2]);
  } else {
    dot(9, 8 + bob, coral[2]);
    dot(14, 8 + bob, coral[2]);
  }
}

function drawSideReefcaller({ rect, dot }, identityPhase) {
  const { mantle, coral, pearl, shellGold, glow } = EN_E04_MERFOLK_REEFCALLER_DATA.reefcaller;
  const bob = identityPhase;
  rect(11, 3 + bob, 6, 2, coral[1]);
  rect(12, 2 + bob, 1, 2, coral[0]);
  rect(15, 2 + bob, 1, 2, coral[0]);
  dot(14, 2 + bob, pearl[0]);
  dot(16, 3 + bob, shellGold[2]);
  rect(7, 6 + bob, 4, 4, mantle[1]);
  dot(7, 7 + bob, glow[0]);
  rect(8, 10 + bob, 10, 2, mantle[1]);
  rect(9, 11 + bob, 9, 3, mantle[0]);
  rect(10, 13 + bob, 7, 2, mantle[1]);
  dot(9, 12 + bob, shellGold[2]);
  dot(17, 12 + bob, shellGold[2]);
  rect(12, 12 + bob, 3, 2, pearl[1]);
  dot(14, 12 + bob, pearl[2]);
  dot(15, 13 + bob, glow[0]);
  dot(14, 8 + bob, coral[2]);
  dot(16, 8 + bob, coral[2]);
}

export function drawMerfolkReefcallerIdentity(context, direction, phase, forcedColor = null) {
  const requestedShift = physicalShift(direction, phase);
  const shift = Object.freeze({ ...requestedShift, y: Math.max(-1, requestedShift.y) });
  const paint = createPainter(context, direction, shift, forcedColor);
  if (paint.view === 'right') drawSideReefcaller(paint, phase.identityPhase);
  else drawFrontReefcaller(paint, phase.identityPhase, paint.view === 'up');
}

function sourceCoordinates(animation, frame) {
  if (animation === 'cast') return Object.freeze({ animation: 'attack', frame });
  if (animation === 'death') return Object.freeze({ animation: 'hurt', frame: EN_E04_MERFOLK_DEATH_SOURCE_FRAMES[frame] });
  return Object.freeze({ animation, frame });
}

function renderMerfolkReefcaller(args) {
  assert(args.family.id === 'merfolk', 'The EN-E04 Reefcaller renderer is restricted to Merfolk.');
  assert(args.variant.id === 'reefcaller', 'The EN-E04 Reefcaller renderer is restricted to Reefcaller.');
  const source = sourceCoordinates(args.animation.id, args.frame);
  const phases = MOTION_PHASES[source.animation];
  assert(phases && source.frame >= 0 && source.frame < phases.length, 'Reefcaller authorizes only the standard Idle, Walk, Attack, Cast, Hurt, and Death frame contract.');
  const sourceResult = EN_E04_MERFOLK_TIDEGUARD_RENDERER.render({
    ...args,
    variant: TIDEGUARD_SOURCE_VARIANT,
  });
  const phase = phases[source.frame];
  drawMerfolkReefcallerIdentity(args.context, args.direction, phase, phase.flash ? '#ffffff' : null);
  return Object.freeze({
    ...sourceResult,
    family: args.family.id,
    variant: args.variant.id,
    direction: args.direction,
    animation: args.animation.id,
    frame: args.frame,
    renderedAnimation: source.animation,
    renderedFrame: source.frame,
    merfolkReefcallerGate: EN_E04_MERFOLK_REEFCALLER_GATE.id,
    approvedPrecedingGate: EN_E04_MERFOLK_TIDEGUARD_GATE.id,
    role: EN_E04_MERFOLK_REEFCALLER_CONTRACT.role,
    anatomy: EN_E04_MERFOLK_REEFCALLER_CONTRACT.chassis,
    lowerBody: 'approved-single-fused-fishtail-with-connected-fluke',
    motion: args.animation.id === 'cast'
      ? 'exact-cast-alias-of-reefcaller-attack'
      : args.animation.id === 'death'
        ? 'exact-death-alias-of-reefcaller-hurt'
        : sourceResult.motion,
    effectBoundary: EN_E04_MERFOLK_REEFCALLER_DATA.effectBoundary,
  });
}

export const EN_E04_MERFOLK_REEFCALLER_RENDERER = Object.freeze({
  key: 'en-e04-merfolk-reefcaller-full-v1',
  chassis: EN_E04_MERFOLK_REEFCALLER_CONTRACT.chassis,
  render: renderMerfolkReefcaller,
});

export const EN_E04_MERFOLK_REEFCALLER_FAMILY = deepFreeze({
  id: 'merfolk',
  name: 'Merfolk',
  sliceId: 'EN-E04',
  rendererKey: EN_E04_MERFOLK_REEFCALLER_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [REEFCALLER_VARIANT],
  rendererData: {
    approvedPrecedingGate: EN_E04_MERFOLK_TIDEGUARD_GATE.id,
    activeGate: EN_E04_MERFOLK_REEFCALLER_GATE.id,
  },
  review: {
    baselineVariant: 'reefcaller',
    scale: 6,
    notes: 'Exact paired visual candidate approved; one complete Merfolk Reefcaller specialist remains internal, non-public, and effect-free.',
  },
});

export const EN_E04_MERFOLK_REEFCALLER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E04_MERFOLK_REEFCALLER_RENDERER],
  families: [EN_E04_MERFOLK_REEFCALLER_FAMILY],
});
