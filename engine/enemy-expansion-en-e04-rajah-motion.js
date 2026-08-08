import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E04_NAGA_IDLE_GATE,
} from './enemy-expansion-en-e04-naga-idle.js';
import {
  EN_E04_NAGA_ATTACK_PHASES,
  EN_E04_NAGA_DEATH_SOURCE_FRAMES,
  EN_E04_NAGA_HURT_PHASES,
  EN_E04_NAGA_MOTION_FAMILY,
  EN_E04_NAGA_MOTION_GATE,
  EN_E04_NAGA_MOTION_RENDERER,
  EN_E04_NAGA_WALK_PHASES,
} from './enemy-expansion-en-e04-naga-motion.js';
import {
  drawTempleRajahIdentity,
  EN_E04_NAGA_EXPANDED_SLICE_FAMILY,
  EN_E04_NAGA_EXPANDED_SLICE_GATE,
  EN_E04_NAGA_EXPANDED_SLICE_RENDERER,
  EN_E04_TEMPLE_RAJAH_CONTRACT,
  EN_E04_TEMPLE_RAJAH_IDLE_DATA,
} from './enemy-expansion-en-e04-venom-motion-rajah-idle.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

const COILGUARD_VARIANT = EN_E04_NAGA_MOTION_FAMILY.variants.find(
  (entry) => entry.id === 'coilguard',
);
const TEMPLE_RAJAH_VARIANT = EN_E04_NAGA_EXPANDED_SLICE_FAMILY.variants.find(
  (entry) => entry.id === 'temple-rajah',
);
assert(COILGUARD_VARIANT, 'The approved Coilguard motion source is required.');
assert(TEMPLE_RAJAH_VARIANT, 'The approved Temple Rajah Idle source is required.');

export const EN_E04_TEMPLE_RAJAH_MOTION_CONTRACT = deepFreeze({
  family: EN_E04_TEMPLE_RAJAH_CONTRACT.family,
  variant: EN_E04_TEMPLE_RAJAH_CONTRACT.variant,
  role: EN_E04_TEMPLE_RAJAH_CONTRACT.role,
  state: 'implemented-motion-candidate',
  chassis: EN_E04_TEMPLE_RAJAH_CONTRACT.chassis,
  identity: EN_E04_TEMPLE_RAJAH_CONTRACT.identity,
  effectBoundary: EN_E04_TEMPLE_RAJAH_CONTRACT.effectBoundary,
});

export const EN_E04_TEMPLE_RAJAH_MOTION_GATE = deepFreeze({
  id: 'en-e04-temple-rajah-motion-v1',
  status: 'approved',
  authorizedOn: '2026-08-08',
  authorizationEvidence: 'After approving and publishing the combined Venom Oracle motion plus Temple Rajah Idle slice, the designer said: very good lets do another similar sized slice. Codex bounded that continuation to the 80-frame Temple Rajah complete-motion suite only.',
  approvedOn: '2026-08-08',
  approvalEvidence: 'Designer reviewed both exact labeled all-four-direction raw/no-outline and Complete B + Form Temple Rajah motion-suite GIFs together and said: approved, lets keep going with slices like this,, maybe a full enemy with all its animations is a good spot.',
  precedingApproval: {
    gateId: EN_E04_NAGA_EXPANDED_SLICE_GATE.id,
    artifactSha256: EN_E04_NAGA_EXPANDED_SLICE_GATE.artifactSha256,
    assembledArtifactSha256: EN_E04_NAGA_EXPANDED_SLICE_GATE.assembledArtifactSha256,
    rawAnimationSha256: EN_E04_NAGA_EXPANDED_SLICE_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E04_NAGA_EXPANDED_SLICE_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E04_NAGA_EXPANDED_SLICE_GATE.candidateFrameDigest,
    publishedCheckpoint: '4fd887f0a174169d47f9f3bee3f98d92c2ffaf30',
    publishedHandoff: 'c92ee12339f38fd99e8fa87e202b50f69b89c187',
  },
  approvedMotionBaseline: {
    gateId: EN_E04_NAGA_MOTION_GATE.id,
    candidateFrameDigest: EN_E04_NAGA_MOTION_GATE.candidateFrameDigest,
  },
  approvedAnatomyBaseline: {
    gateId: EN_E04_NAGA_IDLE_GATE.id,
    candidateFrameDigest: EN_E04_NAGA_IDLE_GATE.candidateFrameDigest,
  },
  artifact: 'enemy-expansion-review/en-e04-rajah-motion/en-e04-temple-rajah-motion-suite-raw.png',
  artifactSha256: 'be72a70e3965675b409ebf736e1448596d9cbeaf9fc2a59b97c8018f0430917b',
  assembledArtifact: 'enemy-expansion-review/en-e04-rajah-motion/en-e04-temple-rajah-motion-suite-complete-b-form.png',
  assembledArtifactSha256: 'eed016625754ca5d675bd34eaa3936de3eeaaca73d7652d01dd52e06910a25ea',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e04-rajah-motion/en-e04-temple-rajah-motion-suite-four-directions-labeled.gif',
      sha256: '8396d98941c7abd8419758d13988acdfdeacc0f8567fae2f6ac42cfb094898ec',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e04-rajah-motion/en-e04-temple-rajah-motion-suite-four-directions-labeled-complete-b-form.gif',
      sha256: 'c3199fecb9d20b969a1a23f3fa4b9892268a9f606604dc22f6b044a58b2fcf21',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
  },
  candidateFrameDigest: '9f240fde4224597a94146448a698a57e573eebf966165fddbf2bd51c6d39fe2f',
  scope: 'One 80-frame Temple Rajah elite suite across Down, Left, Right, and Up: the eight approved Idle F1-F2 frames delegated byte-for-byte, plus Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  motionContract: 'Temple Rajah inherits the approved four-phase planted slither, full-body coil strike, and planted Hurt choreography while the crimson-and-gold crown, gilded pauldrons, ivory chest plate, and royal sash respond to every phase. Upward/recoil phases brace the tall crown at the one-cell ceiling. Cast aliases Attack exactly and Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction Temple Rajah motion-suite raw/no-outline and Complete B + Form boards and GIFs together. The four GIF phases display approved Idle context plus Walk, Attack, Cast, Hurt, and Death simultaneously.',
  exclusions: [
    'approved Temple Rajah Idle pixel changes',
    'approved Coilguard pixel changes',
    'approved Venom Oracle pixel changes',
    'Merfolk',
    'Birdfolk',
    'new Temple Rajah Cast pixels',
    'new Temple Rajah Death pixels',
    'baked command-aura pixels',
    'baked royal-sigil pixels',
    'baked sun-flare pixels',
    'baked temple-ward pixels',
    'baked coil-impact pixels',
    'registration',
    'consumer exposure',
    'effects',
    'release',
    'later EN-E04 work',
  ],
  nextGate: 'Visual approval is complete and bounded publication is authorized for this exact 80-frame Temple Rajah suite. After clean publication, the designer same message separately authorizes one full-enemy all-animation slice; it does not authorize registration, integration, effects, release, or broader multi-enemy work.',
});

function createTransformedContext(context, shift = { x: 0, y: 0 }, forcedColor = null) {
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
      if (typeof context.onOutOfBounds === 'function') {
        context.onOutOfBounds({ ...write, x: write.x + shift.x, y: write.y + shift.y });
      }
    },
    clearRect(x, y, width, height) {
      if (x === 0 && y === 0 && width >= SIZE && height >= SIZE) {
        context.clearRect(0, 0, SIZE, SIZE);
        return;
      }
      context.clearRect(x + shift.x, y + shift.y, width, height);
    },
    fillRect(x, y, width, height) {
      context.fillStyle = forcedColor || fillStyle;
      context.fillRect(x + shift.x, y + shift.y, width, height);
    },
  };
}

function physicalShift(direction, phase) {
  if (direction === 'right') return Object.freeze({ x: phase.forward, y: phase.lift });
  if (direction === 'left') return Object.freeze({ x: -phase.forward, y: phase.lift });
  return Object.freeze({
    x: 0,
    y: phase.lift + (direction === 'down' ? phase.forward : -phase.forward),
  });
}

function rajahPhase(animation, frame) {
  if (animation === 'walk') return { ...EN_E04_NAGA_WALK_PHASES[frame], forward: 0, lift: 0, flash: false };
  if (animation === 'attack' || animation === 'cast') return { ...EN_E04_NAGA_ATTACK_PHASES[frame], flash: false };
  if (animation === 'hurt') return EN_E04_NAGA_HURT_PHASES[frame];
  if (animation === 'death') return EN_E04_NAGA_HURT_PHASES[EN_E04_NAGA_DEATH_SOURCE_FRAMES[frame]];
  throw new TypeError('Temple Rajah phase lookup accepts only motion animations.');
}

function renderTempleRajahMotion(args) {
  assert(args.family.id === 'naga', 'The Temple Rajah motion renderer is restricted to Naga.');
  assert(args.variant.id === 'temple-rajah', 'The Temple Rajah motion renderer is restricted to Temple Rajah.');
  if (args.animation.id === 'idle') {
    assert(args.frame === 0 || args.frame === 1, 'Temple Rajah Idle authorizes only F1-F2.');
    const source = EN_E04_NAGA_EXPANDED_SLICE_RENDERER.render(args);
    return Object.freeze({
      ...source,
      templeRajahMotionGate: EN_E04_TEMPLE_RAJAH_MOTION_GATE.id,
      motion: 'approved-temple-rajah-idle-byte-exact',
    });
  }

  const frameLimits = { walk: 4, attack: 4, cast: 4, hurt: 2, death: 4 };
  const frameLimit = frameLimits[args.animation.id];
  assert(frameLimit && args.frame >= 0 && args.frame < frameLimit, 'Temple Rajah authorizes only the standard bounded motion frames.');
  const source = EN_E04_NAGA_MOTION_RENDERER.render({
    ...args,
    variant: COILGUARD_VARIANT,
  });
  const phase = rajahPhase(args.animation.id, args.frame);
  const bodyShift = physicalShift(args.direction, phase);
  const identityShift = Object.freeze({ x: bodyShift.x, y: Math.max(0, bodyShift.y) });
  drawTempleRajahIdentity(
    createTransformedContext(
      args.context,
      identityShift,
      phase.flash ? '#ffffff' : null,
    ),
    args.direction,
    phase.hoodPhase,
  );
  return Object.freeze({
    ...source,
    family: args.family.id,
    variant: args.variant.id,
    direction: args.direction,
    animation: args.animation.id,
    frame: args.frame,
    templeRajahMotionGate: EN_E04_TEMPLE_RAJAH_MOTION_GATE.id,
    approvedRajahIdleGate: EN_E04_NAGA_EXPANDED_SLICE_GATE.id,
    approvedNagaMotionGate: EN_E04_NAGA_MOTION_GATE.id,
    role: EN_E04_TEMPLE_RAJAH_MOTION_CONTRACT.role,
    anatomy: EN_E04_TEMPLE_RAJAH_MOTION_CONTRACT.chassis,
    lowerBody: 'continuous-planted-serpent-coil',
    motion: args.animation.id === 'cast'
      ? 'exact-cast-alias-of-temple-rajah-attack'
      : args.animation.id === 'death'
        ? 'exact-death-alias-of-temple-rajah-hurt'
        : 'temple-rajah-identity-over-approved-naga-' + args.animation.id,
    effectBoundary: EN_E04_TEMPLE_RAJAH_IDLE_DATA.effectBoundary,
  });
}

export const EN_E04_TEMPLE_RAJAH_MOTION_RENDERER = Object.freeze({
  key: 'en-e04-temple-rajah-motion-v1',
  chassis: 'serpentine-humanoid-v1',
  render: renderTempleRajahMotion,
});

export const EN_E04_TEMPLE_RAJAH_MOTION_FAMILY = deepFreeze({
  id: 'naga',
  name: 'Naga',
  sliceId: 'EN-E04',
  rendererKey: EN_E04_TEMPLE_RAJAH_MOTION_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [{
    ...TEMPLE_RAJAH_VARIANT,
    status: EN_E04_TEMPLE_RAJAH_MOTION_CONTRACT.state,
    brief: 'Temple Rajah elite with approved Idle plus a bounded four-phase royal slither, full-body coil strike, planted-coil Hurt, and exact Cast/Death aliases; command, ward, sun, and impact effects remain external.',
  }],
  rendererData: {
    approvedRajahIdleGate: EN_E04_NAGA_EXPANDED_SLICE_GATE.id,
    approvedNagaMotionGate: EN_E04_NAGA_MOTION_GATE.id,
    activeGate: EN_E04_TEMPLE_RAJAH_MOTION_GATE.id,
  },
  review: {
    baselineVariant: 'temple-rajah',
    scale: 6,
    notes: 'Awaiting paired visual approval for the Temple Rajah complete-motion suite; internal, non-public, and effect-free.',
  },
});

export const EN_E04_TEMPLE_RAJAH_MOTION_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E04_TEMPLE_RAJAH_MOTION_RENDERER],
  families: [EN_E04_TEMPLE_RAJAH_MOTION_FAMILY],
});
