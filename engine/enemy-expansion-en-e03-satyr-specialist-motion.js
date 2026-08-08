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
  EN_E03_SATYR_ATTACK_PHASES,
} from './enemy-expansion-en-e03-satyr-attack.js';
import {
  drawSatyrHurtMotion,
  EN_E03_SATYR_HURT_BODY_SHIFTS,
  EN_E03_SATYR_HURT_GATE,
} from './enemy-expansion-en-e03-satyr-hurt.js';
import {
  drawReedCharmerIdentity,
  EN_E03_REED_CHARMER_IDLE_DATA,
  EN_E03_REED_CHARMER_IDLE_FAMILY,
  EN_E03_REED_CHARMER_IDLE_GATE,
  EN_E03_REED_CHARMER_IDLE_RENDERER,
} from './enemy-expansion-en-e03-satyr-specialist-idle.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

const REED_CHARMER_VARIANT = EN_E03_REED_CHARMER_IDLE_FAMILY.variants.find(
  (entry) => entry.id === 'reed-charmer',
);
assert(REED_CHARMER_VARIANT, 'The approved Reed Charmer Idle variant is required for grouped motion.');

export const EN_E03_REED_CHARMER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

export const EN_E03_REED_CHARMER_MOTION_GATE = deepFreeze({
  id: 'en-e03-reed-charmer-motion-v1',
  status: 'approved',
  authorizedOn: '2026-08-08',
  authorizationEvidence: 'After the exact Reed Charmer Idle pair was approved, committed, pushed, and reconciled, the designer authorized the discussed larger pass with: Sure lets go for it one complete motion suite we can try atleast. Codex bounded that continuation to one complete Reed Charmer motion suite only.',
  approvedOn: '2026-08-08',
  approvalEvidence: 'Designer reviewed both exact labeled all-four-direction raw and Complete B + Form Reed Charmer motion-suite GIFs together and said: Approved.',
  approvedIdle: {
    gateId: EN_E03_REED_CHARMER_IDLE_GATE.id,
    artifactSha256: EN_E03_REED_CHARMER_IDLE_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_REED_CHARMER_IDLE_GATE.assembledArtifactSha256,
    rawAnimationSha256: EN_E03_REED_CHARMER_IDLE_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E03_REED_CHARMER_IDLE_GATE.reviewAnimations.completeBForm.sha256,
    frameDigest: EN_E03_REED_CHARMER_IDLE_GATE.candidateFrameDigest,
    publishedCheckpoint: '070f85b20c4ea77a75e35eb6d9eefd697f4b0b47',
    publishedHandoff: 'ef98e7ce576205872410029d35b0da7921438a4e',
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
  artifact: 'enemy-expansion-review/en-e03-reed-charmer-motion/en-e03-reed-charmer-motion-suite-raw.png',
  artifactSha256: '7908c42c852e3cde553152a56d1678241559f1aab693f5919f33d97a23ea74f7',
  assembledArtifact: 'enemy-expansion-review/en-e03-reed-charmer-motion/en-e03-reed-charmer-motion-suite-complete-b-form.png',
  assembledArtifactSha256: '8b114f22f590c00eb3604d1eb61198e2fb7a6137dccd96aaa2fa3109e9dec104',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e03-reed-charmer-motion/en-e03-reed-charmer-motion-suite-four-directions-labeled.gif',
      sha256: 'b1d62bd3ba846b819ff331b568713f07b4c5170dec56cb68e7fbf759d69e9266', width: 640, height: 672, frames: 4, durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e03-reed-charmer-motion/en-e03-reed-charmer-motion-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '6e509894fb8ba34faa2c31cd20abc328b5cd738b6b017cee9f82858d74079182', width: 640, height: 672, frames: 4, durationMs: 720,
    },
  },
  candidateFrameDigest: '031b4e419e339c416fb43be36641048f89cdfbb255e01d7e6306555c3dc50231',
  scope: 'Reed Charmer specialist Walk W1-W4, Attack A1-A4, Hurt H1-H2, Cast C1-C4, and Death D1-D4 across Down, Left, Right, and Up, with approved Idle F1-F2 delegated byte-for-byte.',
  animationContract: 'Walk reuses the approved alternating reverse-jointed Briar Reveler gait while the Reed Charmer pipe, connected hands, vest, and sash follow the body bob. Attack uses four full-body pipe-playing phases: brace, lift, forward drive, and recovery, with participating torso, hocks, tail, pipe, and hands. Hurt reuses the approved complete-silhouette white recoil and colored braced recovery. Cast aliases Reed Charmer Attack frame-for-frame; Death aliases Reed Charmer Hurt H1,H2,H2,H2.',
  identityContract: EN_E03_REED_CHARMER_IDLE_GATE.identityContract,
  reviewPresentation: 'Show the exact labeled all-four-direction motion-suite raw/no-outline and Complete B + Form boards and GIFs together. The four GIF phases display approved Idle context plus Walk, Attack, Cast, Hurt, and Death simultaneously.',
  exclusions: [
    'approved Reed Charmer Idle pixel changes',
    'Briar Reveler pixel changes',
    'Wildwood Hornlord',
    'Giant changes',
    'Centaur changes',
    'other specialist or elite variants',
    'new Cast pixels',
    'new Death pixels',
    'baked music-note pixels',
    'baked pollen pixels',
    'baked charm-ring pixels',
    'registration',
    'consumer exposure',
    'effects',
    'release',
    'later EN-E03 work',
  ],
  nextGate: 'Visual approval and bounded publication are complete for this Reed Charmer motion lane. No later animation, variant, registration, integration, effect, release, or EN-E03 work is authorized without a separate explicit continuation.',
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
    reedCharmerMotionGate: EN_E03_REED_CHARMER_MOTION_GATE.id,
    approvedReedCharmerIdleGate: EN_E03_REED_CHARMER_IDLE_GATE.id,
    approvedBriarSourceGate: renderedAnimation === 'walk'
      ? EN_E03_SATYR_WALK_GATE.id
      : renderedAnimation === 'attack'
        ? EN_E03_SATYR_ATTACK_GATE.id
        : renderedAnimation === 'hurt'
          ? EN_E03_SATYR_HURT_GATE.id
          : undefined,
    specialistMotion: motion,
    effectBoundary: EN_E03_REED_CHARMER_IDLE_DATA.effectBoundary,
  });
}

function renderWalk(args) {
  const sourceResult = EN_E01_HUMANOID_RENDERER.render({ ...args, variant: REED_CHARMER_VARIANT });
  args.context.clearRect(0, 17, SIZE, SIZE - 17);
  drawSatyrWalkIdentity(args.context, args.direction, args.frame, { includeStaff: false });
  const phase = EN_E03_SATYR_WALK_PHASES[args.frame];
  drawReedCharmerIdentity(args.context, args.direction, phase.bob);
  return resultFor(args, 'walk', args.frame, 'reverse-jointed-gait-with-pipe-playing-body-bob', sourceResult);
}

function renderAttack(args, outputAnimation = 'attack', outputFrame = args.frame) {
  const sourceArgs = {
    ...args,
    animation: { ...args.animation, id: 'attack' },
    frame: args.frame,
    variant: REED_CHARMER_VARIANT,
  };
  const phase = drawSatyrAttackMotion(sourceArgs, { includeStaff: false });
  const identityContext = createTransformedContext(args.context, physicalShift(args.direction, {
    x: phase.bodyX,
    y: phase.bodyY,
  }));
  drawReedCharmerIdentity(identityContext, args.direction, 0);
  return resultFor(
    { ...args, animation: { ...args.animation, id: outputAnimation }, frame: outputFrame },
    'attack',
    args.frame,
    outputAnimation === 'cast' ? 'cast-alias-of-pipe-playing-attack' : 'four-phase-full-body-pipe-playing-attack',
  );
}

function renderHurt(args, outputAnimation = 'hurt', outputFrame = args.frame) {
  const sourceArgs = {
    ...args,
    animation: { ...args.animation, id: 'hurt' },
    frame: args.frame,
    variant: REED_CHARMER_VARIANT,
  };
  drawSatyrHurtMotion(sourceArgs, {
    includeStaff: false,
    drawIdentity(context, shift) {
      const identityContext = createTransformedContext(context, physicalShift(args.direction, shift));
      drawReedCharmerIdentity(identityContext, args.direction, 0);
    },
  });
  return resultFor(
    { ...args, animation: { ...args.animation, id: outputAnimation }, frame: outputFrame },
    'hurt',
    args.frame,
    outputAnimation === 'death' ? 'death-alias-of-full-silhouette-hurt' : 'full-silhouette-recoil-and-braced-recovery',
  );
}

function renderReedCharmerMotion(args) {
  assert(args.family.id === 'satyr', 'The EN-E03 Reed Charmer motion renderer is restricted to Satyr.');
  assert(args.variant.id === 'reed-charmer', 'The EN-E03 Satyr specialist motion renderer is restricted to Reed Charmer.');
  if (args.animation.id === 'idle') {
    assert(args.frame === 0 || args.frame === 1, 'Reed Charmer Idle authorizes only F1-F2.');
    const sourceResult = EN_E03_REED_CHARMER_IDLE_RENDERER.render(args);
    return resultFor(args, 'idle', args.frame, 'approved-idle-byte-exact', sourceResult);
  }
  if (args.animation.id === 'walk') {
    assert(args.frame >= 0 && args.frame < 4, 'Reed Charmer Walk authorizes only W1-W4.');
    return renderWalk(args);
  }
  if (args.animation.id === 'attack') {
    assert(args.frame >= 0 && args.frame < 4, 'Reed Charmer Attack authorizes only A1-A4.');
    return renderAttack(args);
  }
  if (args.animation.id === 'hurt') {
    assert(args.frame >= 0 && args.frame < 2, 'Reed Charmer Hurt authorizes only H1-H2.');
    return renderHurt(args);
  }
  if (args.animation.id === 'cast') {
    assert(args.frame >= 0 && args.frame < 4, 'Reed Charmer Cast authorizes only C1-C4.');
    return renderAttack({ ...args, animation: { ...args.animation, id: 'attack' } }, 'cast', args.frame);
  }
  if (args.animation.id === 'death') {
    assert(args.frame >= 0 && args.frame < 4, 'Reed Charmer Death authorizes only D1-D4.');
    const sourceFrame = EN_E03_REED_CHARMER_DEATH_SOURCE_FRAMES[args.frame];
    return renderHurt({ ...args, animation: { ...args.animation, id: 'hurt' }, frame: sourceFrame }, 'death', args.frame);
  }
  throw new TypeError('The EN-E03 Reed Charmer motion gate authorizes only Idle, Walk, Attack, Cast, Hurt, and Death.');
}

export const EN_E03_REED_CHARMER_MOTION_RENDERER = Object.freeze({
  key: 'en-e03-reed-charmer-motion-v1',
  chassis: EN_E03_REED_CHARMER_IDLE_RENDERER.chassis,
  render: renderReedCharmerMotion,
});

export const EN_E03_REED_CHARMER_MOTION_FAMILY = deepFreeze({
  id: 'satyr',
  name: 'Satyr',
  sliceId: 'EN-E03',
  rendererKey: EN_E03_REED_CHARMER_MOTION_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [{
    id: 'reed-charmer',
    name: 'Reed Charmer',
    brief: 'Specialist Satyr controller with approved Idle plus a bounded reverse-jointed Walk, full-body pipe Attack, full-silhouette Hurt, and exact Cast/Death aliases; music notes, pollen, and charm rings remain external.',
    rendererData: EN_E03_REED_CHARMER_IDLE_DATA,
  }],
  rendererData: {
    contractCard: 'satyr',
    approvedIdleGate: EN_E03_REED_CHARMER_IDLE_GATE.id,
    approvedWalkSourceGate: EN_E03_SATYR_WALK_GATE.id,
    approvedAttackSourceGate: EN_E03_SATYR_ATTACK_GATE.id,
    approvedHurtSourceGate: EN_E03_SATYR_HURT_GATE.id,
    activeGate: EN_E03_REED_CHARMER_MOTION_GATE.id,
  },
  review: {
    baselineVariant: 'reed-charmer',
    scale: 6,
    notes: 'Grouped Reed Charmer motion candidate awaiting paired raw and Complete B + Form visual approval; internal, non-public, and effect-free.',
  },
});

export const EN_E03_REED_CHARMER_MOTION_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E03_REED_CHARMER_MOTION_RENDERER],
  families: [EN_E03_REED_CHARMER_MOTION_FAMILY],
});
