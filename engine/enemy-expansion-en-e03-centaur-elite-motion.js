import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  drawBannerKhanHorseIdleMotion,
  drawBannerKhanIdentity,
  EN_E03_BANNER_KHAN_IDLE_DATA,
  EN_E03_BANNER_KHAN_IDLE_GATE,
  EN_E03_BANNER_KHAN_IDLE_RENDERER,
} from './enemy-expansion-en-e03-centaur-elite-idle.js';
import {
  drawSteppeHunterWalkSpear,
  EN_E03_CENTAUR_WALK_FAMILY,
  EN_E03_CENTAUR_WALK_GATE,
  EN_E03_CENTAUR_WALK_PHASES,
  EN_E03_CENTAUR_WALK_RENDERER,
} from './enemy-expansion-en-e03-centaur-walk.js';
import {
  drawAttackHands,
  drawAttackSpear,
  EN_E03_CENTAUR_ATTACK_FAMILY,
  EN_E03_CENTAUR_ATTACK_GATE,
  EN_E03_CENTAUR_ATTACK_PHASES,
  EN_E03_CENTAUR_ATTACK_RENDERER,
} from './enemy-expansion-en-e03-centaur-attack.js';
import {
  drawHurtHands,
  drawHurtSpear,
  EN_E03_CENTAUR_HURT_BODY_SHIFTS,
  EN_E03_CENTAUR_HURT_FAMILY,
  EN_E03_CENTAUR_HURT_GATE,
  EN_E03_CENTAUR_HURT_RENDERER,
} from './enemy-expansion-en-e03-centaur-hurt.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

function sourceVariant(family, label) {
  const variant = family.variants.find((entry) => entry.id === 'steppe-hunter');
  assert(variant, 'The approved Steppe Hunter ' + label + ' source is required for Banner Khan motion.');
  return variant;
}

const STEPPE_WALK_VARIANT = sourceVariant(EN_E03_CENTAUR_WALK_FAMILY, 'Walk');
const STEPPE_ATTACK_VARIANT = sourceVariant(EN_E03_CENTAUR_ATTACK_FAMILY, 'Attack');
const STEPPE_HURT_VARIANT = sourceVariant(EN_E03_CENTAUR_HURT_FAMILY, 'Hurt');

export const EN_E03_BANNER_KHAN_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

export const EN_E03_BANNER_KHAN_MOTION_GATE = deepFreeze({
  id: 'en-e03-banner-khan-motion-v1',
  status: 'approved',
  authorizedOn: '2026-08-07',
  authorizationEvidence: 'After the exact Banner Khan Idle r3 baseline was approved, committed, pushed, and reconciled, the designer said: lets keep going. The published pass-size guidance explicitly groups the remaining Banner Khan Walk, Attack, Hurt, and Cast/Death work into one larger follow-up review.',
  approvedOn: '2026-08-08',
  approvalEvidence: 'Designer reviewed both exact labeled all-four-direction raw and Complete B + Form Banner Khan motion-suite GIFs together and said: approved.',
  approvedIdle: {
    gateId: EN_E03_BANNER_KHAN_IDLE_GATE.id,
    artifactSha256: EN_E03_BANNER_KHAN_IDLE_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_BANNER_KHAN_IDLE_GATE.assembledArtifactSha256,
    rawAnimationSha256: EN_E03_BANNER_KHAN_IDLE_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E03_BANNER_KHAN_IDLE_GATE.reviewAnimations.completeBForm.sha256,
    frameDigest: EN_E03_BANNER_KHAN_IDLE_GATE.candidateFrameDigest,
    publishedCheckpoint: '55143049b4153e34fcdaad0ea434932ba0f2d0fd',
  },
  approvedMotionSources: {
    walk: {
      gateId: EN_E03_CENTAUR_WALK_GATE.id,
      artifactSha256: EN_E03_CENTAUR_WALK_GATE.artifactSha256,
      assembledArtifactSha256: EN_E03_CENTAUR_WALK_GATE.assembledArtifactSha256,
      frameDigest: EN_E03_CENTAUR_WALK_GATE.candidateFrameDigest,
    },
    attack: {
      gateId: EN_E03_CENTAUR_ATTACK_GATE.id,
      artifactSha256: EN_E03_CENTAUR_ATTACK_GATE.artifactSha256,
      assembledArtifactSha256: EN_E03_CENTAUR_ATTACK_GATE.assembledArtifactSha256,
      frameDigest: EN_E03_CENTAUR_ATTACK_GATE.candidateFrameDigest,
    },
    hurt: {
      gateId: EN_E03_CENTAUR_HURT_GATE.id,
      artifactSha256: EN_E03_CENTAUR_HURT_GATE.artifactSha256,
      assembledArtifactSha256: EN_E03_CENTAUR_HURT_GATE.assembledArtifactSha256,
      frameDigest: EN_E03_CENTAUR_HURT_GATE.candidateFrameDigest,
    },
  },
  artifact: 'enemy-expansion-review/en-e03-banner-khan-motion/en-e03-banner-khan-motion-suite-raw.png',
  artifactSha256: '9c7c46c88ab06d799d0fb4f59ed1befad1e3cc404b37e52f78c9f8494344f233',
  assembledArtifact: 'enemy-expansion-review/en-e03-banner-khan-motion/en-e03-banner-khan-motion-suite-complete-b-form.png',
  assembledArtifactSha256: 'd55d32032589fdcbf3587b65aa395dbcf2d68f19c2fb6ec9813465fbac6113d9',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e03-banner-khan-motion/en-e03-banner-khan-motion-suite-four-directions-labeled.gif',
      sha256: '0c875b122fd3d567f7abb779e4ae589250a7e6cdce7546abc0d21afb11fc941f', width: 640, height: 672, frames: 4, durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e03-banner-khan-motion/en-e03-banner-khan-motion-suite-four-directions-labeled-complete-b-form.gif',
      sha256: 'a3aa055e19301a1b6586d5ba8fcda32f96b8ecce01f9c693cbb678779a903e6d', width: 640, height: 672, frames: 4, durationMs: 720,
    },
  },
  candidateFrameDigest: '0dbd24f50ad7825d9d7860e114ec585b9fd716047c3c993f70f95b26c7bfccc0',
  scope: 'Banner Khan elite Walk W1-W4, Attack A1-A4, Hurt H1-H2, Cast C1-C4, and Death D1-D4 across Down, Left, Right, and Up, with approved Idle F1-F2 delegated byte-for-byte.',
  animationContract: 'Walk reuses the approved alternating four-hoof Steppe Hunter gait with Banner Khan rider, collar, tack, standard bob, and an alternating planted torso shift. Attack reuses the approved four-phase spear brace, release, follow-through, and recovery while the elite identity follows the body shift. Hurt reuses the approved full-hybrid white recoil and colored braced recovery. Cast aliases the Banner Khan Attack frame-for-frame; Death aliases Banner Khan Hurt H1,H2,H2,H2.',
  identityContract: EN_E03_BANNER_KHAN_IDLE_GATE.identityContract,
  reviewPresentation: 'Show the exact labeled all-four-direction motion-suite raw/no-outline and Complete B + Form boards and GIFs together. The four GIF phases display approved Idle context plus Walk, Attack, Cast, Hurt, and Death simultaneously.',
  exclusions: [
    'approved Banner Khan Idle pixel changes',
    'Steppe Hunter pixel changes',
    'Sun Lancer pixel changes',
    'Giant changes',
    'Satyr changes',
    'other specialist or elite variants',
    'new Cast pixels',
    'new Death pixels',
    'baked command aura pixels',
    'baked banner flare pixels',
    'baked hoof shock ring pixels',
    'registration',
    'consumer exposure',
    'effects',
    'release',
    'later EN-E03 work',
  ],
  nextGate: 'Visual approval and bounded publication are complete for this Banner Khan motion lane. No later animation, variant, registration, integration, effect, release, or EN-E03 work is authorized without a separate explicit continuation.',
});

function clampPixel(value) {
  return Math.max(1, Math.min(22, value));
}

function createTransformedContext(context, shift = { x: 0, y: 0 }, flash = false) {
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
      context.fillStyle = flash ? '#ffffff' : value;
    },
    clearRect(x, y, width, height) {
      eachPixel(x, y, width, height, (targetX, targetY) => context.clearRect(targetX, targetY, 1, 1));
    },
    fillRect(x, y, width, height) {
      context.fillStyle = flash ? '#ffffff' : fillStyle;
      eachPixel(x, y, width, height, (targetX, targetY) => context.fillRect(targetX, targetY, 1, 1));
    },
  };
}

function drawCommandStandardPole(context, direction) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const physicalX = (x) => (mirrored ? 23 - x : x);
  const pole = EN_E03_BANNER_KHAN_IDLE_DATA.horse.wood;
  const dot = (x, y, color) => {
    context.fillStyle = color;
    context.fillRect(physicalX(x), y, 1, 1);
  };
  const vertical = (x, top, bottom) => {
    for (let y = top; y <= bottom; y++) dot(x, y, pole[1]);
  };
  if (view === 'up') {
    vertical(4, 4, 18);
    for (let x = 4; x <= 7; x++) dot(x, 12, pole[1]);
    dot(4, 7, pole[0]);
    return;
  }
  if (view === 'right') {
    vertical(20, 3, 18);
    dot(20, 7, pole[0]);
    return;
  }
  vertical(20, 4, 18);
  for (let x = 17; x <= 20; x++) dot(x, 12, pole[1]);
  dot(20, 7, pole[0]);
}

function resultFor(args, sourceResult, renderedAnimation, renderedFrame, motion) {
  return Object.freeze({
    ...sourceResult,
    family: args.family.id,
    variant: args.variant.id,
    animation: args.animation.id,
    frame: args.frame,
    renderedAnimation,
    renderedFrame,
    bannerKhanMotionGate: EN_E03_BANNER_KHAN_MOTION_GATE.id,
    approvedBannerKhanIdleGate: EN_E03_BANNER_KHAN_IDLE_GATE.id,
    approvedSteppeSourceGate: renderedAnimation === 'walk'
      ? EN_E03_CENTAUR_WALK_GATE.id
      : renderedAnimation === 'attack'
        ? EN_E03_CENTAUR_ATTACK_GATE.id
        : renderedAnimation === 'hurt'
          ? EN_E03_CENTAUR_HURT_GATE.id
          : undefined,
    eliteMotion: motion,
    effectBoundary: EN_E03_BANNER_KHAN_IDLE_DATA.effectBoundary,
  });
}

function renderWalk(args) {
  const sourceResult = EN_E03_CENTAUR_WALK_RENDERER.render({ ...args, variant: STEPPE_WALK_VARIANT });
  const phase = EN_E03_CENTAUR_WALK_PHASES[args.frame];
  drawBannerKhanHorseIdleMotion(args.context, args.direction, phase.bob);
  drawBannerKhanIdentity(args.context, args.direction, phase.bob);
  drawSteppeHunterWalkSpear(args.context, args.direction, args.frame);
  return resultFor(args, sourceResult, 'walk', args.frame, 'four-hoof-gait-with-elite-torso-and-standard-response');
}

function renderAttack(args, outputAnimation = 'attack', outputFrame = args.frame) {
  const sourceArgs = {
    ...args,
    animation: { ...args.animation, id: 'attack' },
    frame: args.frame,
    variant: STEPPE_ATTACK_VARIANT,
  };
  const sourceResult = EN_E03_CENTAUR_ATTACK_RENDERER.render(sourceArgs);
  const shift = EN_E03_CENTAUR_ATTACK_PHASES[args.direction][args.frame].shift;
  const identityContext = createTransformedContext(args.context, shift);
  drawCommandStandardPole(identityContext, args.direction);
  drawBannerKhanIdentity(identityContext, args.direction, 0);
  if (args.direction !== 'up') drawAttackSpear(args.context, args.direction, args.frame);
  drawAttackHands(args.context, args.direction, args.frame);
  return resultFor(
    { ...args, animation: { ...args.animation, id: outputAnimation }, frame: outputFrame },
    sourceResult,
    'attack',
    args.frame,
    outputAnimation === 'cast' ? 'cast-alias-of-elite-spear-attack' : 'elite-spear-attack-with-body-shift',
  );
}

function renderHurt(args, outputAnimation = 'hurt', outputFrame = args.frame) {
  const sourceArgs = {
    ...args,
    animation: { ...args.animation, id: 'hurt' },
    frame: args.frame,
    variant: STEPPE_HURT_VARIANT,
  };
  const sourceResult = EN_E03_CENTAUR_HURT_RENDERER.render(sourceArgs);
  const shift = EN_E03_CENTAUR_HURT_BODY_SHIFTS[args.direction][args.frame];
  const flash = args.frame === 0;
  const identityContext = createTransformedContext(args.context, shift, flash);
  drawCommandStandardPole(identityContext, args.direction);
  drawBannerKhanIdentity(identityContext, args.direction, 0);
  if (args.direction !== 'up') drawHurtSpear(args.context, args.direction, args.frame, shift, flash);
  drawHurtHands(args.context, args.direction, args.frame, shift, flash);
  return resultFor(
    { ...args, animation: { ...args.animation, id: outputAnimation }, frame: outputFrame },
    sourceResult,
    'hurt',
    args.frame,
    outputAnimation === 'death' ? 'death-alias-of-elite-hurt' : 'elite-full-hybrid-recoil-and-recovery',
  );
}

function renderBannerKhanMotion(args) {
  assert(args.family.id === 'centaur', 'The EN-E03 Banner Khan motion renderer is restricted to Centaur.');
  assert(args.variant.id === 'banner-khan', 'The EN-E03 Banner Khan motion renderer is restricted to Banner Khan.');
  if (args.animation.id === 'idle') {
    assert(args.frame === 0 || args.frame === 1, 'Banner Khan Idle authorizes only F1-F2.');
    const sourceResult = EN_E03_BANNER_KHAN_IDLE_RENDERER.render(args);
    return resultFor(args, sourceResult, 'idle', args.frame, 'approved-idle-byte-exact');
  }
  if (args.animation.id === 'walk') {
    assert(args.frame >= 0 && args.frame < 4, 'Banner Khan Walk authorizes only W1-W4.');
    return renderWalk(args);
  }
  if (args.animation.id === 'attack') {
    assert(args.frame >= 0 && args.frame < 4, 'Banner Khan Attack authorizes only A1-A4.');
    return renderAttack(args);
  }
  if (args.animation.id === 'hurt') {
    assert(args.frame >= 0 && args.frame < 2, 'Banner Khan Hurt authorizes only H1-H2.');
    return renderHurt(args);
  }
  if (args.animation.id === 'cast') {
    assert(args.frame >= 0 && args.frame < 4, 'Banner Khan Cast authorizes only C1-C4.');
    return renderAttack({ ...args, animation: { ...args.animation, id: 'attack' } }, 'cast', args.frame);
  }
  if (args.animation.id === 'death') {
    assert(args.frame >= 0 && args.frame < 4, 'Banner Khan Death authorizes only D1-D4.');
    const sourceFrame = EN_E03_BANNER_KHAN_DEATH_SOURCE_FRAMES[args.frame];
    return renderHurt({ ...args, animation: { ...args.animation, id: 'hurt' }, frame: sourceFrame }, 'death', args.frame);
  }
  throw new TypeError('The EN-E03 Banner Khan motion gate authorizes only Idle, Walk, Attack, Cast, Hurt, and Death.');
}

export const EN_E03_BANNER_KHAN_MOTION_RENDERER = Object.freeze({
  key: 'en-e03-banner-khan-motion-v1',
  chassis: EN_E03_BANNER_KHAN_IDLE_RENDERER.chassis,
  render: renderBannerKhanMotion,
});

export const EN_E03_BANNER_KHAN_MOTION_FAMILY = deepFreeze({
  id: 'centaur',
  name: 'Centaur',
  sliceId: 'EN-E03',
  rendererKey: EN_E03_BANNER_KHAN_MOTION_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [{
    id: 'banner-khan',
    name: 'Banner Khan',
    brief: 'Elite Centaur warlord with an approved planted Idle plus a bounded four-hoof Walk, spear Attack, full-hybrid Hurt, and exact Cast/Death aliases; command aura, banner flare, and hoof shock effects remain external.',
    rendererData: EN_E03_BANNER_KHAN_IDLE_DATA,
  }],
  rendererData: {
    contractCard: 'centaur',
    approvedIdleGate: EN_E03_BANNER_KHAN_IDLE_GATE.id,
    approvedWalkSourceGate: EN_E03_CENTAUR_WALK_GATE.id,
    approvedAttackSourceGate: EN_E03_CENTAUR_ATTACK_GATE.id,
    approvedHurtSourceGate: EN_E03_CENTAUR_HURT_GATE.id,
    activeGate: EN_E03_BANNER_KHAN_MOTION_GATE.id,
  },
  review: {
    baselineVariant: 'banner-khan',
    scale: 6,
    notes: 'Grouped Banner Khan motion candidate awaiting paired raw and Complete B + Form visual approval; internal, non-public, and effect-free.',
  },
});

export const EN_E03_BANNER_KHAN_MOTION_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E03_BANNER_KHAN_MOTION_RENDERER],
  families: [EN_E03_BANNER_KHAN_MOTION_FAMILY],
});
