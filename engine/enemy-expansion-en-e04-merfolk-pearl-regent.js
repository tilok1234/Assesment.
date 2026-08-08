import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E04_MERFOLK_REEFCALLER_DATA,
  EN_E04_MERFOLK_REEFCALLER_GATE,
  EN_E04_MERFOLK_REEFCALLER_RENDERER,
} from './enemy-expansion-en-e04-merfolk-reefcaller.js';
import { EN_E04_MERFOLK_DEATH_SOURCE_FRAMES } from './enemy-expansion-en-e04-merfolk-tideguard.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E04_MERFOLK_PEARL_REGENT_CONTRACT = deepFreeze({
  family: 'merfolk',
  variant: 'pearl-regent',
  role: 'elite',
  state: 'implemented-complete-motion-candidate',
  chassis: 'approved-upright-piscine-humanoid',
  source: 'approved Merfolk Reefcaller full-enemy anatomy and motion',
  silhouette: 'The approved Reefcaller humanoid-to-fishtail silhouette gains one connected pearl-and-gold diadem, broad shell pauldrons, a royal mantle, and a nacre breastplate without introducing ordinary legs, paired feet, or detached islands.',
  identity: 'Deep-crimson royal mantle, gold shell regalia, white nacre breastplate, central pearl diadem, luminous aqua fin marks, twin coral-red side eyes, and the approved continuous sea-green tail distinguish the elite.',
  effectBoundary: 'Royal tide auras, command rings, pearl flares, current spirals, coral growth, water bolts, foam, splashes, undertow rings, and impacts remain external.',
});

export const EN_E04_MERFOLK_PEARL_REGENT_GATE = deepFreeze({
  id: 'en-e04-merfolk-pearl-regent-full-v1',
  status: 'approved',
  authorizedOn: '2026-08-09',
  authorizationEvidence: 'After approving, publishing, and reconciling the complete Merfolk Reefcaller specialist, the designer said: lets do next. The documented EN-E04 order advances from Merfolk common to specialist to elite before Birdfolk; Codex bounded the continuation to one complete 80-frame Merfolk Pearl Regent elite enemy only.',
  approvedOn: '2026-08-09',
  approvalEvidence: 'The designer reviewed the exact hash-frozen raw/no-outline and Complete B + Form Merfolk Pearl Regent full-suite pair, including both coral-red side-eye pixels, and said: approved.',
  precedingApproval: {
    gateId: EN_E04_MERFOLK_REEFCALLER_GATE.id,
    artifactSha256: EN_E04_MERFOLK_REEFCALLER_GATE.artifactSha256,
    assembledArtifactSha256: EN_E04_MERFOLK_REEFCALLER_GATE.assembledArtifactSha256,
    rawAnimationSha256: EN_E04_MERFOLK_REEFCALLER_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E04_MERFOLK_REEFCALLER_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E04_MERFOLK_REEFCALLER_GATE.candidateFrameDigest,
    publishedCheckpoint: 'b315a32aa48d8881efe23e9d5b8553e6c0fb6b79',
    publishedHandoff: 'e54807be33020d23ab0ff5b32938804bd83fcbb5',
  },
  artifact: 'enemy-expansion-review/en-e04-merfolk-pearl-regent/en-e04-merfolk-pearl-regent-full-suite-raw.png',
  artifactSha256: 'cfbab3f4d9c45a2c61d1e0109f5f55a7f05e3b7831d9374fd6ea93ddfc6821ef',
  assembledArtifact: 'enemy-expansion-review/en-e04-merfolk-pearl-regent/en-e04-merfolk-pearl-regent-full-suite-complete-b-form.png',
  assembledArtifactSha256: '5ca9014b4308a7fcaaa33a960d12774ff9edc3df525dc8a703e6563833b2cc1f',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e04-merfolk-pearl-regent/en-e04-merfolk-pearl-regent-full-suite-four-directions-labeled.gif',
      sha256: '835e00665636bef438d369092c67450512bf4340bb632db1b1cbb38e38a3db88',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e04-merfolk-pearl-regent/en-e04-merfolk-pearl-regent-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: 'a85744e15763d935d6f2d31113249eaf849bf63f4e1252975a06b192afd563c0',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
  },
  candidateFrameDigest: '30f2e8e40db3fc39b60351c350d58e841a4f2a87d7f57e914ea86a60375cd0b6',
  scope: 'One complete 80-frame Merfolk Pearl Regent elite enemy across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'All 80 frames delegate the approved Reefcaller full-body motion and fused-tail anatomy, then carry the connected Pearl Regent diadem, pauldrons, mantle, nacre breastplate, luminous fin marks, and twin coral-red side eyes through the same transforms. Crown rise and recoil brace at the one-cell ceiling. Cast aliases Attack exactly and Death aliases Hurt H1,H2,H2,H2.',
  anatomyContract: EN_E04_MERFOLK_PEARL_REGENT_CONTRACT.silhouette,
  reviewPresentation: 'Show the exact labeled all-four-direction Merfolk Pearl Regent full-suite raw/no-outline and Complete B + Form boards and GIFs together. The four GIF phases display Idle, Walk, Attack, Cast, Hurt, and Death simultaneously.',
  exclusions: [
    'approved Reefcaller pixel changes',
    'Birdfolk',
    'additional Merfolk variants',
    'new Cast pixels',
    'new Death pixels',
    'baked royal-aura pixels',
    'baked command-ring pixels',
    'baked pearl-flare pixels',
    'baked current-spiral pixels',
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
  nextGate: 'Bounded commit, push, and publication of this exact ten-file Pearl Regent lane are authorized. No Birdfolk, additional Merfolk variants, registration, integration, effects, release, or broader EN-E04 work is authorized by this approval.',
});

export const EN_E04_MERFOLK_PEARL_REGENT_DATA = deepFreeze({
  actor: EN_E04_MERFOLK_REEFCALLER_DATA.actor,
  identity: { overlays: [] },
  merfolk: EN_E04_MERFOLK_REEFCALLER_DATA.merfolk,
  pearlRegent: {
    mantle: ['#913d63', '#492342', '#c75c7c'],
    coral: ['#df5f6c', '#75333f', '#ff8d89'],
    pearl: ['#f4f0d3', '#9bbab0', '#ffffff'],
    shellGold: ['#dca14d', '#74462e', '#ffd77f'],
    glow: ['#7be7d8', '#2b9b9a'],
  },
  effectBoundary: 'external-royal-tide-auras-command-rings-pearl-flares-current-spirals-coral-growth-water-bolts-foam-splashes-undertow-rings-and-impacts',
  bakedEffects: [],
});

const PEARL_REGENT_VARIANT = deepFreeze({
  id: 'pearl-regent',
  name: 'Pearl Regent',
  role: EN_E04_MERFOLK_PEARL_REGENT_CONTRACT.role,
  status: EN_E04_MERFOLK_PEARL_REGENT_CONTRACT.state,
  brief: 'Elite Merfolk ruler with a connected pearl-and-gold diadem, broad shell pauldrons, deep-crimson mantle, nacre breastplate, twin coral-red side eyes, and the approved fused Reefcaller tail; all royal tide effects remain external.',
  rendererData: EN_E04_MERFOLK_PEARL_REGENT_DATA,
});

const REEFCALLER_SOURCE_VARIANT = deepFreeze({ id: 'reefcaller' });

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
      'PearlRegent rectangles must use positive integer geometry.',
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

function drawFrontPearlRegent({ rect, dot }, identityPhase, rearView) {
  const { mantle, coral, pearl, shellGold, glow } = EN_E04_MERFOLK_PEARL_REGENT_DATA.pearlRegent;
  const bob = identityPhase;
  rect(8, 4 + bob, 8, 2, shellGold[1]);
  rect(9, 3 + bob, 6, 2, shellGold[0]);
  dot(10, 2 + bob, shellGold[2]);
  dot(13, 2 + bob, shellGold[2]);
  rect(11, 2 + bob, 2, 3, pearl[1]);
  dot(12, 2 + bob, pearl[2]);
  rect(4, 7 + bob, 5, 4, mantle[1]);
  rect(15, 7 + bob, 5, 4, mantle[1]);
  rect(5, 6 + bob, 4, 2, shellGold[0]);
  rect(15, 6 + bob, 4, 2, shellGold[0]);
  dot(4, 8 + bob, glow[0]);
  dot(19, 8 + bob, glow[0]);
  rect(6, 10 + bob, 12, 2, mantle[1]);
  rect(7, 11 + bob, 10, 4, mantle[0]);
  rect(9, 11 + bob, 6, 4, pearl[1]);
  rect(10, 12 + bob, 4, 2, pearl[0]);
  dot(11, 12 + bob, pearl[2]);
  rect(7, 14 + bob, 10, 1, shellGold[1]);
  dot(7, 12 + bob, shellGold[2]);
  dot(16, 12 + bob, shellGold[2]);
  dot(12, 14 + bob, glow[0]);
  if (rearView) {
    rect(11, 5 + bob, 2, 5, mantle[2]);
    dot(12, 6 + bob, pearl[2]);
    dot(10, 4 + bob, coral[0]);
    dot(13, 4 + bob, coral[0]);
  } else {
    dot(9, 8 + bob, coral[2]);
    dot(14, 8 + bob, coral[2]);
  }
}

function drawSidePearlRegent({ rect, dot }, identityPhase) {
  const { mantle, coral, pearl, shellGold, glow } = EN_E04_MERFOLK_PEARL_REGENT_DATA.pearlRegent;
  const bob = identityPhase;
  rect(10, 4 + bob, 8, 2, shellGold[1]);
  rect(11, 3 + bob, 7, 2, shellGold[0]);
  dot(12, 2 + bob, shellGold[2]);
  dot(16, 2 + bob, shellGold[2]);
  rect(13, 2 + bob, 2, 3, pearl[1]);
  dot(14, 2 + bob, pearl[2]);
  rect(6, 7 + bob, 5, 4, mantle[1]);
  rect(7, 6 + bob, 4, 2, shellGold[0]);
  dot(6, 8 + bob, glow[0]);
  rect(8, 10 + bob, 11, 2, mantle[1]);
  rect(9, 11 + bob, 10, 4, mantle[0]);
  rect(12, 11 + bob, 5, 4, pearl[1]);
  rect(13, 12 + bob, 3, 2, pearl[0]);
  dot(14, 12 + bob, pearl[2]);
  rect(9, 14 + bob, 10, 1, shellGold[1]);
  dot(9, 12 + bob, shellGold[2]);
  dot(18, 12 + bob, shellGold[2]);
  dot(16, 14 + bob, glow[0]);
  dot(14, 8 + bob, coral[2]);
  dot(16, 8 + bob, coral[2]);
}

export function drawMerfolkPearlRegentIdentity(context, direction, phase, forcedColor = null) {
  const requestedShift = physicalShift(direction, phase);
  const shift = Object.freeze({ ...requestedShift, y: Math.max(-1, requestedShift.y) });
  const paint = createPainter(context, direction, shift, forcedColor);
  if (paint.view === 'right') drawSidePearlRegent(paint, phase.identityPhase);
  else drawFrontPearlRegent(paint, phase.identityPhase, paint.view === 'up');
}

function sourceCoordinates(animation, frame) {
  if (animation === 'cast') return Object.freeze({ animation: 'attack', frame });
  if (animation === 'death') return Object.freeze({ animation: 'hurt', frame: EN_E04_MERFOLK_DEATH_SOURCE_FRAMES[frame] });
  return Object.freeze({ animation, frame });
}

function renderMerfolkPearlRegent(args) {
  assert(args.family.id === 'merfolk', 'The EN-E04 Pearl Regent renderer is restricted to Merfolk.');
  assert(args.variant.id === 'pearl-regent', 'The EN-E04 Pearl Regent renderer is restricted to Pearl Regent.');
  const source = sourceCoordinates(args.animation.id, args.frame);
  const phases = MOTION_PHASES[source.animation];
  assert(phases && source.frame >= 0 && source.frame < phases.length, 'Pearl Regent authorizes only the standard Idle, Walk, Attack, Cast, Hurt, and Death frame contract.');
  const sourceResult = EN_E04_MERFOLK_REEFCALLER_RENDERER.render({
    ...args,
    variant: REEFCALLER_SOURCE_VARIANT,
  });
  const phase = phases[source.frame];
  drawMerfolkPearlRegentIdentity(args.context, args.direction, phase, phase.flash ? '#ffffff' : null);
  return Object.freeze({
    ...sourceResult,
    family: args.family.id,
    variant: args.variant.id,
    direction: args.direction,
    animation: args.animation.id,
    frame: args.frame,
    renderedAnimation: source.animation,
    renderedFrame: source.frame,
    merfolkPearlRegentGate: EN_E04_MERFOLK_PEARL_REGENT_GATE.id,
    approvedPrecedingGate: EN_E04_MERFOLK_REEFCALLER_GATE.id,
    role: EN_E04_MERFOLK_PEARL_REGENT_CONTRACT.role,
    anatomy: EN_E04_MERFOLK_PEARL_REGENT_CONTRACT.chassis,
    lowerBody: 'approved-single-fused-fishtail-with-connected-fluke',
    motion: args.animation.id === 'cast'
      ? 'exact-cast-alias-of-pearl-regent-attack'
      : args.animation.id === 'death'
        ? 'exact-death-alias-of-pearl-regent-hurt'
        : sourceResult.motion,
    effectBoundary: EN_E04_MERFOLK_PEARL_REGENT_DATA.effectBoundary,
  });
}

export const EN_E04_MERFOLK_PEARL_REGENT_RENDERER = Object.freeze({
  key: 'en-e04-merfolk-pearl-regent-full-v1',
  chassis: EN_E04_MERFOLK_PEARL_REGENT_CONTRACT.chassis,
  render: renderMerfolkPearlRegent,
});

export const EN_E04_MERFOLK_PEARL_REGENT_FAMILY = deepFreeze({
  id: 'merfolk',
  name: 'Merfolk',
  sliceId: 'EN-E04',
  rendererKey: EN_E04_MERFOLK_PEARL_REGENT_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [PEARL_REGENT_VARIANT],
  rendererData: {
    approvedPrecedingGate: EN_E04_MERFOLK_REEFCALLER_GATE.id,
    activeGate: EN_E04_MERFOLK_PEARL_REGENT_GATE.id,
  },
  review: {
    baselineVariant: 'pearl-regent',
    scale: 6,
    notes: 'Exact paired visual candidate approved; one complete Merfolk Pearl Regent elite remains internal, non-public, and effect-free.',
  },
});

export const EN_E04_MERFOLK_PEARL_REGENT_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E04_MERFOLK_PEARL_REGENT_RENDERER],
  families: [EN_E04_MERFOLK_PEARL_REGENT_FAMILY],
});
