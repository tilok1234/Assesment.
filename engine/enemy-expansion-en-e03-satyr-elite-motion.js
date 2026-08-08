import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { SIZE } from './catalogs.js';
import { EN_E01_HUMANOID_RENDERER } from './enemy-expansion-humanoid.js';
import {
  drawSatyrWalkIdentity,
  EN_E03_SATYR_WALK_GATE,
  EN_E03_SATYR_WALK_PHASES,
} from './enemy-expansion-en-e03-satyr-walk.js';
import {
  drawSatyrAttackMotion,
  EN_E03_SATYR_ATTACK_GATE,
} from './enemy-expansion-en-e03-satyr-attack.js';
import {
  drawSatyrHurtMotion,
  EN_E03_SATYR_HURT_GATE,
} from './enemy-expansion-en-e03-satyr-hurt.js';
import {
  drawWildwoodHornlordIdentity,
  EN_E03_WILDWOOD_HORNLORD_IDLE_DATA,
  EN_E03_WILDWOOD_HORNLORD_IDLE_FAMILY,
  EN_E03_WILDWOOD_HORNLORD_IDLE_GATE,
  EN_E03_WILDWOOD_HORNLORD_IDLE_RENDERER,
} from './enemy-expansion-en-e03-satyr-elite-idle.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

const WILDWOOD_HORNLORD_VARIANT = EN_E03_WILDWOOD_HORNLORD_IDLE_FAMILY.variants.find(
  (entry) => entry.id === 'wildwood-hornlord',
);
assert(WILDWOOD_HORNLORD_VARIANT, 'The approved Wildwood Hornlord Idle variant is required for grouped motion.');

export const EN_E03_WILDWOOD_HORNLORD_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

export const EN_E03_WILDWOOD_HORNLORD_MOTION_GATE = deepFreeze({
  id: 'en-e03-wildwood-hornlord-motion-v1',
  status: 'approved',
  authorizedOn: '2026-08-08',
  authorizationEvidence: 'After reviewing both exact paired Wildwood Hornlord Idle GIFs, the designer said: Approved lets do next. Following the accepted larger-slice pattern, Codex bounded that continuation to one complete Wildwood Hornlord motion suite only.',
  approvedOn: '2026-08-08',
  approvalEvidence: 'Designer reviewed both exact labeled all-four-direction raw and Complete B + Form Wildwood Hornlord motion-suite GIFs together and said: Approved.',
  approvedIdle: {
    gateId: EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.id,
    artifactSha256: EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.assembledArtifactSha256,
    rawAnimationSha256: EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.reviewAnimations.completeBForm.sha256,
    frameDigest: EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.candidateFrameDigest,
    publishedCheckpoint: 'aa96e170c41cbcb49c7ac1bd979114b3b5bfa7e4',
    publishedHandoff: '4c59c321ae9133d04bdbdb37a833f462c4849ef1',
  },
  approvedMotionSources: {
    walk: {
      gateId: EN_E03_SATYR_WALK_GATE.id,
      artifactSha256: EN_E03_SATYR_WALK_GATE.artifactSha256,
      assembledArtifactSha256: EN_E03_SATYR_WALK_GATE.assembledArtifactSha256,
      frameDigest: EN_E03_SATYR_WALK_GATE.candidateFrameDigest,
    },
    attack: {
      gateId: EN_E03_SATYR_ATTACK_GATE.id,
      artifactSha256: EN_E03_SATYR_ATTACK_GATE.artifactSha256,
      assembledArtifactSha256: EN_E03_SATYR_ATTACK_GATE.assembledArtifactSha256,
      frameDigest: EN_E03_SATYR_ATTACK_GATE.candidateFrameDigest,
    },
    hurt: {
      gateId: EN_E03_SATYR_HURT_GATE.id,
      artifactSha256: EN_E03_SATYR_HURT_GATE.artifactSha256,
      assembledArtifactSha256: EN_E03_SATYR_HURT_GATE.assembledArtifactSha256,
      frameDigest: EN_E03_SATYR_HURT_GATE.candidateFrameDigest,
    },
  },
  artifact: 'enemy-expansion-review/en-e03-wildwood-hornlord-motion/en-e03-wildwood-hornlord-motion-suite-raw.png',
  artifactSha256: '95f92b325d4b7a465ffd50e5dbf11c1b07c3fd941f5bf778433e31872d896f48',
  assembledArtifact: 'enemy-expansion-review/en-e03-wildwood-hornlord-motion/en-e03-wildwood-hornlord-motion-suite-complete-b-form.png',
  assembledArtifactSha256: 'a129d01a91160bf73d999f39379fc379c4da8312da5cccdd17072af1917a131f',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e03-wildwood-hornlord-motion/en-e03-wildwood-hornlord-motion-suite-four-directions-labeled.gif',
      sha256: '22845dd24a64c9674fed979ebf91ee7505818fdad5c80c292b7195c0ea371a0b', width: 640, height: 672, frames: 4, durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e03-wildwood-hornlord-motion/en-e03-wildwood-hornlord-motion-suite-four-directions-labeled-complete-b-form.gif',
      sha256: 'eba94e2f22522fa352204ba8c944fa9b87773b07895e9afeae2efdaaad7fa747', width: 640, height: 672, frames: 4, durationMs: 720,
    },
  },
  candidateFrameDigest: 'a0ac53b0ba66feeda9ef5251aa10b1aac962af4428a6f09ba84051fa630989b3',
  scope: 'Wildwood Hornlord elite Walk W1-W4, Attack A1-A4, Hurt H1-H2, Cast C1-C4, and Death D1-D4 across Down, Left, Right, and Up, with approved Idle F1-F2 delegated byte-for-byte.',
  animationContract: 'Walk reuses the approved alternating reverse-jointed Briar Reveler gait while the Wildwood antler crown, bark pauldrons, moss mantle, bracers, and torque follow the body bob. Attack uses four full-body hornlord phases: brace, lift, forward drive, and recovery, with participating torso, hocks, tail, crown, and mantle. Hurt reuses the approved complete-silhouette white recoil and colored braced recovery. Cast aliases Wildwood Hornlord Attack frame-for-frame; Death aliases Wildwood Hornlord Hurt H1,H2,H2,H2.',
  identityContract: EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.identityContract,
  reviewPresentation: 'Show the exact labeled all-four-direction motion-suite raw/no-outline and Complete B + Form boards and GIFs together. The four GIF phases display approved Idle context plus Walk, Attack, Cast, Hurt, and Death simultaneously.',
  exclusions: [
    'approved Wildwood Hornlord Idle pixel changes',
    'Briar Reveler pixel changes',
    'Reed Charmer pixel changes',
    'Giant changes',
    'Centaur changes',
    'other specialist or elite variants',
    'new Cast pixels',
    'new Death pixels',
    'baked thorn-aura pixels',
    'baked leaf-swirl pixels',
    'baked root-burst pixels',
    'registration',
    'consumer exposure',
    'effects',
    'release',
    'later EN-E03 work',
  ],
  nextGate: 'Visual approval and bounded publication are complete for this Wildwood Hornlord motion lane. No later animation, variant, registration, integration, effect, release, or EN-E03 work is authorized without a separate explicit continuation.',
});

function clampPixel(value) {
  return Math.max(1, Math.min(22, value));
}

function createTransformedContext(context, shift = { x: 0, y: 0 }) {
  let fillStyle = context.fillStyle;
  const eachPixel = (x, y, width, height, callback) => {
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      callback(clampPixel(px + shift.x), clampPixel(py + shift.y));
    }
  };
  return {
    get fillStyle() {
      return fillStyle;
    },
    set fillStyle(value) {
      fillStyle = value;
      context.fillStyle = value;
    },
    clearRect(x, y, width, height) {
      eachPixel(x, y, width, height, (targetX, targetY) => context.clearRect(targetX, targetY, 1, 1));
    },
    fillRect(x, y, width, height) {
      context.fillStyle = fillStyle;
      eachPixel(x, y, width, height, (targetX, targetY) => context.fillRect(targetX, targetY, 1, 1));
    },
  };
}

function physicalShift(direction, shift) {
  return Object.freeze({
    x: direction === 'left' ? -shift.x : shift.x,
    y: shift.y,
  });
}

function resultFor(args, renderedAnimation, renderedFrame, motion, sourceResult = {}) {
  return Object.freeze({
    ...sourceResult,
    family: args.family.id,
    variant: args.variant.id,
    direction: args.direction,
    animation: args.animation.id,
    frame: args.frame,
    renderedAnimation,
    renderedFrame,
    wildwoodHornlordMotionGate: EN_E03_WILDWOOD_HORNLORD_MOTION_GATE.id,
    approvedWildwoodHornlordIdleGate: EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.id,
    approvedBriarSourceGate: renderedAnimation === 'walk'
      ? EN_E03_SATYR_WALK_GATE.id
      : renderedAnimation === 'attack'
        ? EN_E03_SATYR_ATTACK_GATE.id
        : renderedAnimation === 'hurt'
          ? EN_E03_SATYR_HURT_GATE.id
          : undefined,
    eliteMotion: motion,
    effectBoundary: EN_E03_WILDWOOD_HORNLORD_IDLE_DATA.effectBoundary,
  });
}

function renderWalk(args) {
  const sourceResult = EN_E01_HUMANOID_RENDERER.render({ ...args, variant: WILDWOOD_HORNLORD_VARIANT });
  args.context.clearRect(0, 17, SIZE, SIZE - 17);
  drawSatyrWalkIdentity(args.context, args.direction, args.frame, { includeStaff: false });
  const phase = EN_E03_SATYR_WALK_PHASES[args.frame];
  drawWildwoodHornlordIdentity(args.context, args.direction, phase.bob);
  return resultFor(args, 'walk', args.frame, 'reverse-jointed-gait-with-crown-and-mantle-body-bob', sourceResult);
}

function renderAttack(args, outputAnimation = 'attack', outputFrame = args.frame) {
  const sourceArgs = {
    ...args,
    animation: { ...args.animation, id: 'attack' },
    frame: args.frame,
    variant: WILDWOOD_HORNLORD_VARIANT,
  };
  const phase = drawSatyrAttackMotion(sourceArgs, { includeStaff: false });
  const identityContext = createTransformedContext(args.context, physicalShift(args.direction, {
    x: phase.bodyX,
    y: phase.bodyY,
  }));
  drawWildwoodHornlordIdentity(identityContext, args.direction, 0);
  return resultFor(
    { ...args, animation: { ...args.animation, id: outputAnimation }, frame: outputFrame },
    'attack',
    args.frame,
    outputAnimation === 'cast' ? 'cast-alias-of-full-body-hornlord-attack' : 'four-phase-full-body-hornlord-attack',
  );
}

function renderHurt(args, outputAnimation = 'hurt', outputFrame = args.frame) {
  const sourceArgs = {
    ...args,
    animation: { ...args.animation, id: 'hurt' },
    frame: args.frame,
    variant: WILDWOOD_HORNLORD_VARIANT,
  };
  drawSatyrHurtMotion(sourceArgs, {
    includeStaff: false,
    drawIdentity(context, shift) {
      const identityContext = createTransformedContext(context, physicalShift(args.direction, shift));
      drawWildwoodHornlordIdentity(identityContext, args.direction, 0);
    },
  });
  return resultFor(
    { ...args, animation: { ...args.animation, id: outputAnimation }, frame: outputFrame },
    'hurt',
    args.frame,
    outputAnimation === 'death' ? 'death-alias-of-full-silhouette-hurt' : 'full-silhouette-recoil-and-braced-recovery',
  );
}

function renderWildwoodHornlordMotion(args) {
  assert(args.family.id === 'satyr', 'The EN-E03 Wildwood Hornlord motion renderer is restricted to Satyr.');
  assert(args.variant.id === 'wildwood-hornlord', 'The EN-E03 Satyr elite motion renderer is restricted to Wildwood Hornlord.');
  if (args.animation.id === 'idle') {
    assert(args.frame === 0 || args.frame === 1, 'Wildwood Hornlord Idle authorizes only F1-F2.');
    const sourceResult = EN_E03_WILDWOOD_HORNLORD_IDLE_RENDERER.render(args);
    return resultFor(args, 'idle', args.frame, 'approved-idle-byte-exact', sourceResult);
  }
  if (args.animation.id === 'walk') {
    assert(args.frame >= 0 && args.frame < 4, 'Wildwood Hornlord Walk authorizes only W1-W4.');
    return renderWalk(args);
  }
  if (args.animation.id === 'attack') {
    assert(args.frame >= 0 && args.frame < 4, 'Wildwood Hornlord Attack authorizes only A1-A4.');
    return renderAttack(args);
  }
  if (args.animation.id === 'hurt') {
    assert(args.frame >= 0 && args.frame < 2, 'Wildwood Hornlord Hurt authorizes only H1-H2.');
    return renderHurt(args);
  }
  if (args.animation.id === 'cast') {
    assert(args.frame >= 0 && args.frame < 4, 'Wildwood Hornlord Cast authorizes only C1-C4.');
    return renderAttack({ ...args, animation: { ...args.animation, id: 'attack' } }, 'cast', args.frame);
  }
  if (args.animation.id === 'death') {
    assert(args.frame >= 0 && args.frame < 4, 'Wildwood Hornlord Death authorizes only D1-D4.');
    const sourceFrame = EN_E03_WILDWOOD_HORNLORD_DEATH_SOURCE_FRAMES[args.frame];
    return renderHurt({ ...args, animation: { ...args.animation, id: 'hurt' }, frame: sourceFrame }, 'death', args.frame);
  }
  throw new TypeError('The EN-E03 Wildwood Hornlord motion gate authorizes only Idle, Walk, Attack, Cast, Hurt, and Death.');
}

export const EN_E03_WILDWOOD_HORNLORD_MOTION_RENDERER = Object.freeze({
  key: 'en-e03-wildwood-hornlord-motion-v1',
  chassis: EN_E03_WILDWOOD_HORNLORD_IDLE_RENDERER.chassis,
  render: renderWildwoodHornlordMotion,
});

export const EN_E03_WILDWOOD_HORNLORD_MOTION_FAMILY = deepFreeze({
  id: 'satyr',
  name: 'Satyr',
  sliceId: 'EN-E03',
  rendererKey: EN_E03_WILDWOOD_HORNLORD_MOTION_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [{
    id: 'wildwood-hornlord',
    name: 'Wildwood Hornlord',
    brief: 'Elite Satyr warlord with approved Idle plus a bounded reverse-jointed Walk, full-body hornlord Attack, full-silhouette Hurt, and exact Cast/Death aliases; thorn aura, leaf swirl, and root burst remain external.',
    rendererData: EN_E03_WILDWOOD_HORNLORD_IDLE_DATA,
  }],
  rendererData: {
    contractCard: 'satyr',
    approvedIdleGate: EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.id,
    approvedWalkSourceGate: EN_E03_SATYR_WALK_GATE.id,
    approvedAttackSourceGate: EN_E03_SATYR_ATTACK_GATE.id,
    approvedHurtSourceGate: EN_E03_SATYR_HURT_GATE.id,
    activeGate: EN_E03_WILDWOOD_HORNLORD_MOTION_GATE.id,
  },
  review: {
    baselineVariant: 'wildwood-hornlord',
    scale: 6,
    notes: 'Visually approved grouped Wildwood Hornlord motion suite; internal, non-public, and effect-free.',
  },
});

export const EN_E03_WILDWOOD_HORNLORD_MOTION_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E03_WILDWOOD_HORNLORD_MOTION_RENDERER],
  families: [EN_E03_WILDWOOD_HORNLORD_MOTION_FAMILY],
});
