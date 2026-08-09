import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E04_CONSUMER_INTEGRATION_GATE } from './enemy-expansion-en-e04.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E05_GHOUL_UPGRADE_CONTRACT = deepFreeze({
  sliceId: 'EN-E05',
  proposal: 'ghoul',
  replacementTarget: Object.freeze({ family: 'zombie', variant: 'ghoul' }),
  candidateFamily: 'ghoul-upgrade',
  role: 'legacy-material-upgrade',
  state: 'implemented-complete-motion-candidate',
  chassis: 'feral-hunched-undead',
  silhouette: 'A low forward skull, crooked shoulder shelf, long connected claw arms, narrow torn waist, uneven stalking legs, exposed rear spine, and hooked side jaw replace the ordinary armed humanoid read. The actor remains one connected hard-alpha silhouette with one-cell margins in every frame.',
  identity: 'Ash-green corpse flesh, exposed ivory bone, dark wine wounds, corpse-yellow eyes, torn umber leather, and charcoal grave rags distinguish the upgraded Ghoul from Zombie Shambler, Rotter, and Brute while retaining the existing zombie/ghoul gameplay identity.',
  effectBoundary: 'Blood spray, rot motes, grave dust, claw trails, bite impacts, necrotic mist, and ground debris remain external.',
});

export const EN_E05_GHOUL_UPGRADE_GATE = deepFreeze({
  id: 'en-e05-ghoul-upgrade-full-v1',
  status: 'approved',
  authorizedOn: '2026-08-09',
  authorizationEvidence: 'After confirming the 80-proposal accounting, the designer requested a new cadence of one full sprite with all animations each run. The live EN-E05 priority order starts with the existing Ghoul upgrade, so this gate is bounded to one complete replacement candidate only.',
  approvedOn: '2026-08-09',
  approvalEvidence: 'After the exact hash-frozen Ghoul before/after board plus the labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards and GIFs were presented together, the designer said: approved. This approves only the isolated 80-frame candidate and its bounded publication; public zombie/ghoul replacement and fixture regeneration remain separate gates.',
  precedingApproval: {
    gateId: EN_E04_CONSUMER_INTEGRATION_GATE.id,
    registrationCheckpoint: EN_E04_CONSUMER_INTEGRATION_GATE.registrationCheckpoint,
    publishedImplementation: 'cedc774',
    publishedHandoff: '8b1ef2e',
  },
  artifact: 'enemy-expansion-review/en-e05-ghoul-upgrade/en-e05-ghoul-upgrade-full-suite-raw.png',
  artifactSha256: 'd1c94649e8520ff9dba6168caf06f6324ff473783b46d166fa2ab5bd4532003e',
  assembledArtifact: 'enemy-expansion-review/en-e05-ghoul-upgrade/en-e05-ghoul-upgrade-full-suite-complete-b-form.png',
  assembledArtifactSha256: '2ffdeb527ffe097976b350602bf08db67fb95bb53f2a553ffa011047155d4570',
  comparisonArtifact: 'enemy-expansion-review/en-e05-ghoul-upgrade/en-e05-ghoul-upgrade-before-after.png',
  comparisonArtifactSha256: '2e6766dffa8600f2137df2f911996328a429eb56d1465429049f3193fa7c2144',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e05-ghoul-upgrade/en-e05-ghoul-upgrade-full-suite-four-directions-labeled.gif',
      sha256: 'a9bc8d2ec7413a399134e5ddb9f12f5a029b1393373c99aea74061b39ffb2f7c',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e05-ghoul-upgrade/en-e05-ghoul-upgrade-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '13c0bd1e514e5c077938129776cbc6c9e3524822a05a0b195abc855c06041d71',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
  },
  candidateFrameDigest: '9f24d575dd7685afd0ca6411f23d6de2b05f90634ef9802d431881d046394477',
  legacyFrameDigest: 'ee693437844e4018d2098375d5a22ed58389d2f3b9ae8418b83224ca9e5d94a8',
  scope: 'One complete 80-frame Ghoul upgrade candidate for existing zombie/ghoul across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle uses a low corpse breath and shoulder hitch. Walk is a four-step stalking gait with alternating claws and uneven feet. Attack coils, raises, drives a long two-claw rake, and recovers through the full silhouette. Hurt uses a complete white recoil and colored recovery. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact all-four-direction before/after regression board plus the labeled raw/no-outline and Complete B + Form full-suite boards and GIFs together.',
  exclusions: [
    'public zombie/ghoul replacement in this approval-publication gate',
    'changes to zombie/shambler',
    'changes to zombie/rotter',
    'changes to zombie/brute',
    'new Zombie family or Ghoul family registration',
    'asset-pack fixture regeneration',
    'new Cast pixels',
    'new Death pixels',
    'baked blood spray',
    'baked rot motes',
    'baked grave dust',
    'baked claw trails',
    'baked bite impacts',
    'baked necrotic mist',
    'effects',
    'release',
    'Mummy',
    'Vampire',
    'Revenant',
    'Lich',
    'later EN-E05 work',
  ],
  nextGate: 'Bounded commit, push, and publication of this exact ten-file approved Ghoul lane are authorized. Public zombie/ghoul replacement, legacy fixture regeneration, and Mummy require later explicit gates.',
});

const COLORS = deepFreeze({
  flesh: ['#a8b39a', '#697565'],
  rot: '#4a554a',
  bone: ['#d8d1ae', '#8f896f'],
  wound: ['#7d3d4c', '#4d2833'],
  rag: ['#62584d', '#38332f'],
  leather: ['#76513a', '#493326'],
  eye: '#dbe66a',
  cavity: '#242a25',
  flash: '#f4f4f4',
});

export const EN_E05_GHOUL_UPGRADE_DATA = deepFreeze({
  actor: {
    species: 'undead',
    bodyBuild: 'lean',
    skin: 'pale',
    hairStyle: 'bald',
    hairColor: 'black',
    expression: 'angry',
    faceDetail: 'none',
    headgear: 'none',
    outfit: 'leather',
    outfitColor: 'umber',
    outfitTier: 'tier1',
    weapon: 'none',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.flesh,
      hair: [COLORS.cavity, COLORS.rot],
      outfit: [COLORS.rag[0], COLORS.rag[1], COLORS.leather[0]],
    },
  },
  ghoul: COLORS,
  effectBoundary: 'external-blood-rot-motes-grave-dust-claw-trails-bite-impacts-necrotic-mist-and-ground-debris',
  bakedEffects: [],
});

const GHOUL_UPGRADE_VARIANT = deepFreeze({
  id: 'ghoul',
  name: 'Ghoul Upgrade',
  role: EN_E05_GHOUL_UPGRADE_CONTRACT.role,
  status: EN_E05_GHOUL_UPGRADE_CONTRACT.state,
  brief: 'Replacement candidate for legacy zombie/ghoul: a weaponless, hunched corpse predator with long claws, exposed bone, torn grave leathers, and one complete standard motion suite.',
  rendererData: EN_E05_GHOUL_UPGRADE_DATA,
});

export const EN_E05_GHOUL_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'low-corpse-breath', bob: 0, stride: 0, arm: 0, reach: 0, crouch: 0, flash: false },
  { name: 'shoulder-hitch', bob: 1, stride: 0, arm: 1, reach: 0, crouch: 0, flash: false },
]);

const WALK_PHASES = deepFreeze([
  { name: 'left-stalk', bob: 0, stride: -1, arm: 1, reach: 0, crouch: 0, flash: false },
  { name: 'grave-compress', bob: 1, stride: 0, arm: 0, reach: 0, crouch: 1, flash: false },
  { name: 'right-stalk', bob: 0, stride: 1, arm: -1, reach: 0, crouch: 0, flash: false },
  { name: 'drag-recover', bob: 1, stride: 0, arm: 1, reach: 0, crouch: 0, flash: false },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'claw-coil', bob: 1, stride: 0, arm: -1, reach: -1, crouch: 1, flash: false },
  { name: 'shoulder-rise', bob: 0, stride: -1, arm: 2, reach: 0, crouch: 0, flash: false },
  { name: 'two-claw-rake', bob: 0, stride: 1, arm: 3, reach: 1, crouch: 0, flash: false },
  { name: 'feral-recover', bob: 1, stride: 0, arm: 0, reach: 0, crouch: 0, flash: false },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-corpse-recoil', bob: 0, stride: -1, arm: -1, reach: -1, crouch: 1, flash: true },
  { name: 'crooked-recovery', bob: 1, stride: 0, arm: 1, reach: 0, crouch: 1, flash: false },
]);

function phaseFor(animation, frame) {
  if (animation === 'idle') return IDLE_PHASES[frame];
  if (animation === 'walk') return WALK_PHASES[frame];
  if (animation === 'attack' || animation === 'cast') return ATTACK_PHASES[frame];
  if (animation === 'hurt') return HURT_PHASES[frame];
  if (animation === 'death') return HURT_PHASES[EN_E05_GHOUL_DEATH_SOURCE_FRAMES[frame]];
  throw new TypeError(`Unsupported Ghoul animation ${animation}.`);
}

function mirroredContext(context) {
  let fillStyle = context.fillStyle;
  return {
    get fillStyle() { return fillStyle; },
    set fillStyle(value) {
      fillStyle = value;
      context.fillStyle = value;
    },
    onOutOfBounds(write) {
      if (typeof context.onOutOfBounds === 'function') {
        context.onOutOfBounds({ ...write, x: SIZE - 1 - write.x });
      }
    },
    clearRect(x, y, width, height) {
      context.clearRect(SIZE - x - width, y, width, height);
    },
    fillRect(x, y, width, height) {
      context.fillStyle = fillStyle;
      context.fillRect(SIZE - x - width, y, width, height);
    },
  };
}

function painter(context, phase) {
  const color = (value) => phase.flash ? COLORS.flash : value;
  const pixel = (x, y, fill) => {
    context.fillStyle = color(fill);
    context.fillRect(x, y, 1, 1);
  };
  const rect = (x, y, width, height, fill) => {
    context.fillStyle = color(fill);
    context.fillRect(x, y, width, height);
  };
  return { pixel, rect };
}

function drawClaw(paint, x, y, facing, light = true) {
  const flesh = light ? COLORS.flesh[0] : COLORS.flesh[1];
  const bone = light ? COLORS.bone[0] : COLORS.bone[1];
  paint.rect(x, y, 2, 2, flesh);
  paint.pixel(x + facing, y + 1, bone);
  paint.pixel(x + facing, y + 2, bone);
  paint.pixel(x, y + 2, bone);
  paint.pixel(x - facing, y + 2, bone);
}

function drawFrontLegs(paint, phase) {
  const leftX = 8 + (phase.stride < 0 ? -1 : phase.stride > 0 ? 1 : 0);
  const rightX = 13 + (phase.stride > 0 ? 1 : phase.stride < 0 ? -1 : 0);
  const leftLift = phase.stride > 0 ? 1 : 0;
  const rightLift = phase.stride < 0 ? 1 : 0;
  paint.rect(leftX, 17 + leftLift, 3, 4 - leftLift, COLORS.flesh[1]);
  paint.rect(rightX, 17 + rightLift, 3, 4 - rightLift, COLORS.flesh[0]);
  paint.rect(leftX - 1, 20 + leftLift, 4, 2, COLORS.rot);
  paint.rect(rightX, 20 + rightLift, 4, 2, COLORS.flesh[1]);
  paint.pixel(leftX - 1, 21 + leftLift, COLORS.bone[1]);
  paint.pixel(rightX + 3, 21 + rightLift, COLORS.bone[0]);
}

function drawFrontArms(paint, phase, rear = false) {
  const dark = rear ? COLORS.flesh[1] : COLORS.flesh[0];
  if (phase.arm === 2) {
    paint.rect(5, 9, 3, 3, dark);
    paint.rect(4, 7, 2, 4, dark);
    drawClaw(paint, 3, 5, -1, !rear);
    paint.rect(16, 9, 3, 3, COLORS.flesh[1]);
    paint.rect(18, 7, 2, 4, COLORS.flesh[1]);
    drawClaw(paint, 19, 5, 1, false);
    return;
  }
  if (phase.arm === 3) {
    paint.rect(5, 11, 4, 3, dark);
    paint.rect(3, 13, 4, 2, dark);
    drawClaw(paint, 2, 14, -1, !rear);
    paint.rect(15, 10, 4, 3, COLORS.flesh[0]);
    paint.rect(18, 12, 3, 2, COLORS.flesh[0]);
    drawClaw(paint, 20, 13, 1, true);
    return;
  }
  const leftY = 12 + phase.bob + (phase.arm > 0 ? -1 : 0);
  const rightY = 11 + phase.bob + (phase.arm < 0 ? -1 : 0);
  paint.rect(5, leftY, 3, 3, dark);
  paint.rect(4, leftY + 2, 2, 4, dark);
  drawClaw(paint, 3, leftY + 5, -1, !rear);
  paint.rect(16, rightY, 3, 3, COLORS.flesh[0]);
  paint.rect(18, rightY + 2, 2, 4, COLORS.flesh[0]);
  drawClaw(paint, 19, rightY + 5, 1, true);
}

function drawDown(context, phase) {
  const paint = painter(context, phase);
  const bob = phase.bob + phase.crouch;
  drawFrontLegs(paint, phase);
  paint.rect(8, 15 + phase.crouch, 8, 3, COLORS.rag[1]);
  paint.rect(9, 17 + phase.crouch, 2, 2, COLORS.rag[0]);
  paint.rect(13, 17 + phase.crouch, 3, 1, COLORS.leather[1]);
  paint.pixel(12, 18 + phase.crouch, COLORS.wound[0]);
  paint.rect(7, 10 + bob, 10, 6, COLORS.flesh[1]);
  paint.rect(8, 9 + bob, 8, 6, COLORS.flesh[0]);
  paint.rect(9, 13 + bob, 6, 2, COLORS.leather[0]);
  paint.pixel(11, 13 + bob, COLORS.leather[1]);
  paint.pixel(14, 12 + bob, COLORS.wound[0]);
  drawFrontArms(paint, phase);
  paint.rect(8, 4 + bob, 8, 6, COLORS.flesh[0]);
  paint.rect(9, 3 + bob, 6, 2, COLORS.flesh[1]);
  paint.rect(7, 6 + bob, 2, 3, COLORS.rot);
  paint.rect(15, 5 + bob, 2, 4, COLORS.flesh[1]);
  paint.pixel(10, 6 + bob, COLORS.eye);
  paint.pixel(14, 6 + bob, COLORS.eye);
  paint.rect(10, 8 + bob, 5, 2, COLORS.cavity);
  paint.pixel(10, 9 + bob, COLORS.bone[0]);
  paint.pixel(12, 9 + bob, COLORS.bone[1]);
  paint.pixel(14, 9 + bob, COLORS.bone[0]);
  paint.pixel(8, 4 + bob, COLORS.wound[1]);
}

function drawUp(context, phase) {
  const paint = painter(context, phase);
  const bob = phase.bob + phase.crouch;
  drawFrontLegs(paint, phase);
  paint.rect(8, 15 + phase.crouch, 8, 3, COLORS.rag[1]);
  paint.rect(9, 17 + phase.crouch, 2, 2, COLORS.rag[0]);
  paint.rect(14, 17 + phase.crouch, 2, 2, COLORS.leather[1]);
  paint.rect(7, 10 + bob, 10, 6, COLORS.flesh[1]);
  paint.rect(8, 9 + bob, 8, 6, COLORS.flesh[0]);
  paint.pixel(11, 10 + bob, COLORS.bone[0]);
  paint.pixel(12, 12 + bob, COLORS.bone[1]);
  paint.pixel(11, 14 + bob, COLORS.bone[0]);
  paint.rect(9, 13 + bob, 6, 2, COLORS.leather[0]);
  drawFrontArms(paint, phase, true);
  paint.pixel(15, 11 + bob, COLORS.wound[0]);
  paint.rect(8, 4 + bob, 8, 6, COLORS.flesh[1]);
  paint.rect(9, 3 + bob, 6, 2, COLORS.rot);
  paint.rect(7, 6 + bob, 2, 3, COLORS.flesh[1]);
  paint.rect(15, 6 + bob, 2, 3, COLORS.flesh[0]);
  paint.rect(10, 5 + bob, 4, 4, COLORS.flesh[0]);
  paint.pixel(11, 4 + bob, COLORS.bone[1]);
}

function drawSideLegs(paint, phase) {
  const nearX = 13 + (phase.stride > 0 ? 1 : phase.stride < 0 ? -1 : 0);
  const farX = 9 + (phase.stride < 0 ? -1 : phase.stride > 0 ? 1 : 0);
  const nearLift = phase.stride < 0 ? 1 : 0;
  const farLift = phase.stride > 0 ? 1 : 0;
  paint.rect(farX, 17 + farLift, 3, 4 - farLift, COLORS.flesh[1]);
  paint.rect(nearX, 17 + nearLift, 3, 4 - nearLift, COLORS.flesh[0]);
  paint.rect(farX - 1, 20 + farLift, 4, 2, COLORS.rot);
  paint.rect(nearX, 20 + nearLift, 5, 2, COLORS.flesh[1]);
  paint.pixel(nearX + 4, 21 + nearLift, COLORS.bone[0]);
}

function drawRight(context, phase) {
  const paint = painter(context, phase);
  const bob = phase.bob + phase.crouch;
  drawSideLegs(paint, phase);
  paint.rect(9, 15 + phase.crouch, 8, 3, COLORS.rag[1]);
  paint.rect(10, 17 + phase.crouch, 3, 2, COLORS.leather[1]);
  paint.rect(8, 11 + bob, 9, 5, COLORS.flesh[1]);
  paint.rect(10, 9 + bob, 8, 6, COLORS.flesh[0]);
  paint.rect(11, 13 + bob, 6, 2, COLORS.leather[0]);
  paint.pixel(11, 11 + bob, COLORS.bone[0]);
  paint.pixel(15, 13 + bob, COLORS.wound[0]);

  if (phase.arm === 2) {
    paint.rect(11, 8, 4, 3, COLORS.flesh[1]);
    paint.rect(13, 6, 3, 4, COLORS.flesh[1]);
    drawClaw(paint, 14, 4, 1, false);
    paint.rect(15, 10, 4, 3, COLORS.flesh[0]);
    paint.rect(18, 8, 2, 4, COLORS.flesh[0]);
    drawClaw(paint, 19, 6, 1, true);
  } else if (phase.arm === 3) {
    paint.rect(8, 12, 4, 3, COLORS.flesh[1]);
    paint.rect(6, 14, 4, 2, COLORS.flesh[1]);
    drawClaw(paint, 5, 15, -1, false);
    paint.rect(15, 10, 4, 3, COLORS.flesh[0]);
    paint.rect(18, 11, 3, 2, COLORS.flesh[0]);
    drawClaw(paint, 21, 12, 1, true);
  } else {
    const farY = 12 + bob + (phase.arm > 0 ? -1 : 0);
    const nearY = 11 + bob + (phase.arm < 0 ? -1 : 0);
    paint.rect(8, farY, 3, 3, COLORS.flesh[1]);
    paint.rect(7, farY + 2, 2, 4, COLORS.flesh[1]);
    drawClaw(paint, 6, farY + 5, -1, false);
    paint.rect(15, nearY, 3, 3, COLORS.flesh[0]);
    paint.rect(17, nearY + 2, 2, 4, COLORS.flesh[0]);
    drawClaw(paint, 18, nearY + 5, 1, true);
  }

  const headForward = phase.reach;
  paint.rect(13 + headForward, 4 + bob, 7, 6, COLORS.flesh[0]);
  paint.rect(11 + headForward, 5 + bob, 4, 4, COLORS.flesh[1]);
  paint.rect(17 + headForward, 8 + bob, 4, 3, COLORS.rot);
  paint.rect(18 + headForward, 9 + bob, 3, 2, COLORS.cavity);
  paint.pixel(19 + headForward, 10 + bob, COLORS.bone[0]);
  paint.pixel(16 + headForward, 6 + bob, COLORS.eye);
  paint.pixel(13 + headForward, 4 + bob, COLORS.wound[1]);
}

export function renderEnE05GhoulUpgradeFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Ghoul upgrade rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), `Unsupported Ghoul direction ${direction}.`);
  const phase = phaseFor(animation, frame);
  assert(phase, `Ghoul animation ${animation} frame ${frame} is out of range.`);
  context.clearRect(0, 0, SIZE, SIZE);
  if (direction === 'down') drawDown(context, phase);
  else if (direction === 'up') drawUp(context, phase);
  else if (direction === 'right') drawRight(context, phase);
  else drawRight(mirroredContext(context), phase);
  return Object.freeze({
    family: 'ghoul-upgrade',
    variant: 'ghoul',
    replacementTarget: EN_E05_GHOUL_UPGRADE_CONTRACT.replacementTarget,
    direction,
    animation,
    frame,
    phase: phase.name,
    effectBoundary: EN_E05_GHOUL_UPGRADE_DATA.effectBoundary,
  });
}

export const EN_E05_GHOUL_UPGRADE_RENDERER = deepFreeze({
  key: 'en-e05-ghoul-upgrade-v1',
  chassis: EN_E05_GHOUL_UPGRADE_CONTRACT.chassis,
  render({ direction, animation, frame, context }) {
    return renderEnE05GhoulUpgradeFrame(context, direction, animation.id, frame);
  },
});

export const EN_E05_GHOUL_UPGRADE_FAMILY = deepFreeze({
  id: 'ghoul-upgrade',
  name: 'Ghoul Upgrade Review',
  sliceId: 'EN-E05',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E05_GHOUL_UPGRADE_CONTRACT.chassis,
  rendererKey: EN_E05_GHOUL_UPGRADE_RENDERER.key,
  variants: [GHOUL_UPGRADE_VARIANT],
  review: {
    baselineVariant: 'ghoul',
    scale: 8,
    notes: 'Compare the existing zombie/ghoul against this isolated full-suite replacement candidate before any public routing or fixture change.',
  },
});

export const EN_E05_GHOUL_UPGRADE_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E05_GHOUL_UPGRADE_RENDERER],
  families: [EN_E05_GHOUL_UPGRADE_FAMILY],
});
