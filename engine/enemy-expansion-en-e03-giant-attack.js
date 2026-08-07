import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { drawSprite } from './renderer.js';
import { EN_E01_HUMANOID_RENDERER } from './enemy-expansion-humanoid.js';
import {
  drawGiantCalibrationIdentity,
  EN_E03_HILL_BREAKER_CALIBRATION_DATA,
} from './enemy-expansion-en-e03-calibration.js';
import {
  EN_E03_GIANT_WALK_GATE,
  EN_E03_GIANT_WALK_RENDERER,
} from './enemy-expansion-en-e03-giant-walk.js';
import { EN_E03_SATYR_WALK_GATE } from './enemy-expansion-en-e03-satyr-walk.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E03_GIANT_ATTACK_GATE = deepFreeze({
  id: 'en-e03-hill-breaker-attack-v1',
  status: 'approved',
  authorizedOn: '2026-08-06',
  authorizationEvidence: 'Designer approved the corrected raw and Complete B + Form Briar Reveler Walk animations and said: greeat lets move on.',
  approvedOn: '2026-08-07',
  approvalEvidence: 'Designer reviewed the exact labeled four-direction raw and Complete B + Form Hill Breaker Attack animations and said: Very good approved.',
  reviewFeedback: [
    'Designer said: i think maybe a little more of the body could move when he attacks.',
    'Designer rejected the overlay-shift revision and said: not a good animation.',
    'Designer asked to use the front and back also.',
  ],
  precedingApproval: {
    gateId: EN_E03_SATYR_WALK_GATE.id,
    artifactSha256: EN_E03_SATYR_WALK_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_SATYR_WALK_GATE.assembledArtifactSha256,
    candidateFrameDigest: EN_E03_SATYR_WALK_GATE.candidateFrameDigest,
  },
  approvedIdle: {
    gateId: EN_E03_GIANT_WALK_GATE.approvedIdle.gateId,
    artifactSha256: EN_E03_GIANT_WALK_GATE.approvedIdle.artifactSha256,
    assembledArtifactSha256: EN_E03_GIANT_WALK_GATE.approvedIdle.assembledArtifactSha256,
    frameDigest: EN_E03_GIANT_WALK_GATE.approvedIdle.frameDigest,
  },
  approvedWalk: {
    gateId: EN_E03_GIANT_WALK_GATE.id,
    artifactSha256: EN_E03_GIANT_WALK_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_GIANT_WALK_GATE.assembledArtifactSha256,
    frameDigest: EN_E03_GIANT_WALK_GATE.candidateFrameDigest,
  },
  artifact: 'enemy-expansion-review/en-e03-giant-attack/en-e03-hill-breaker-attack-raw.png',
  artifactSha256: '45ec7e5a52abdd0dc0e2eaf4042a2d64c73ddb0a47dd070eb974e31fa2dabe8f',
  assembledArtifact: 'enemy-expansion-review/en-e03-giant-attack/en-e03-hill-breaker-attack-complete-b-form.png',
  assembledArtifactSha256: '250390b3c44db6d86362e8cbad7ef7225b2c728c984718119c5d7b85fc07ea10',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e03-giant-attack/en-e03-hill-breaker-attack-four-directions-labeled-v2.gif',
      sha256: 'a2b880921c4337b89ee64b18446fbe5d2527b2808c8f48a37c2f4549d1118724',
      width: 192,
      height: 224,
      frames: 4,
      durationMs: 480,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e03-giant-attack/en-e03-hill-breaker-attack-four-directions-labeled-complete-b-form-v2.gif',
      sha256: 'd06771fa77fac6078332f1928e713565a6cd2f54ff440145d03f8131ae353673',
      width: 192,
      height: 224,
      frames: 4,
      durationMs: 480,
    },
  },
  candidateFrameDigest: '1b5cade8a0a19babd00ed067010ecb98948891a7e4f6cd435adc53ae57cf78ab',
  scope: 'Hill Breaker common Attack only: A1-A4 across Down, Left, Right, and Up, with approved Idle and Walk delegated byte-for-byte and shown as frozen context.',
  revision: 'Replace the rejected overlay slide with one layered rig: A1 coils body and club together, A2 releases from center, A3 follows through toward the club, and A4 recovers; Down and Up carry the pose through hips and upper legs while every foot remains anchored.',
  exclusions: [
    'Idle pixel changes',
    'Walk pixel changes',
    'Centaur changes',
    'Satyr changes',
    'specialist variants',
    'elite variants',
    'Hurt',
    'Cast',
    'Death',
    'registration',
    'consumer exposure',
    'effects',
    'release',
  ],
  nextGate: 'Visual approval is complete. Stop until the designer explicitly selects and authorizes the next bounded EN-E03 gate; no later EN-E03 work is authorized yet.',
});

const ATTACK_UPPER_BODY_SHIFTS = deepFreeze({
  down: [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 0 }],
  left: [{ x: 1, y: 0 }, { x: 0, y: 0 }, { x: -1, y: 1 }, { x: 0, y: 0 }],
  right: [{ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 0 }],
  up: [{ x: 1, y: 0 }, { x: 0, y: 0 }, { x: -1, y: 1 }, { x: 0, y: 0 }],
});

const HILL_BREAKER_PLAYER_SPEC = deepFreeze({
  ...EN_E03_HILL_BREAKER_CALIBRATION_DATA.actor,
  palette: {
    skin: EN_E03_HILL_BREAKER_CALIBRATION_DATA.actor.palette.skin,
    hair: EN_E03_HILL_BREAKER_CALIBRATION_DATA.actor.palette.hair,
    outfit: EN_E03_HILL_BREAKER_CALIBRATION_DATA.actor.palette.outfit,
  },
  kind: 'player',
});

function createPixelBuffer() {
  const pixels = new Array(24 * 24).fill(null);
  let fillStyle = '#000000';
  const context = {
    get fillStyle() {
      return fillStyle;
    },
    set fillStyle(value) {
      fillStyle = value;
    },
    clearRect(x, y, width, height) {
      for (let py = Math.floor(y); py < y + height; py++) for (let px = Math.floor(x); px < x + width; px++) {
        if (px >= 0 && py >= 0 && px < 24 && py < 24) pixels[(py * 24) + px] = null;
      }
    },
    fillRect(x, y, width, height) {
      for (let py = Math.floor(y); py < y + height; py++) for (let px = Math.floor(x); px < x + width; px++) {
        if (px >= 0 && py >= 0 && px < 24 && py < 24) pixels[(py * 24) + px] = fillStyle;
      }
    },
  };
  return { context, pixels };
}

function paintPixels(context, pixels, transform = (x, y) => ({ x, y })) {
  for (let y = 0; y < 24; y++) for (let x = 0; x < 24; x++) {
    const color = pixels[(y * 24) + x];
    if (color === null) continue;
    const target = transform(x, y);
    context.fillStyle = color;
    context.fillRect(target.x, target.y, 1, 1);
  }
}

function renderPlayerLayer(direction, frame, layer) {
  const rendered = createPixelBuffer();
  drawSprite(rendered.context, HILL_BREAKER_PLAYER_SPEC, direction, 'attack', frame, {
    clear: true,
    layer,
    shadow: false,
  });
  return rendered;
}

function paintAttackBody(context, direction, frame, shift) {
  const body = renderPlayerLayer(direction, frame, 'body');
  drawGiantCalibrationIdentity(body.context, direction);
  const frontOrBack = direction === 'down' || direction === 'up';
  const anchorRow = frontOrBack ? 20 : 18;
  paintPixels(context, body.pixels, (x, y) => {
    if (y >= anchorRow) return { x, y };
    return {
      x: x + shift.x,
      y: Math.min(anchorRow - 1, y + shift.y),
    };
  });
  if (shift.y !== 0 || (frontOrBack && shift.x !== 0)) {
    const seamRow = anchorRow - 1;
    for (let x = 0; x < 24; x++) {
      const color = body.pixels[(seamRow * 24) + x];
      if (color === null) continue;
      context.fillStyle = color;
      context.fillRect(x, seamRow, 1, 1);
    }
  }
}

function paintAttackWeapon(context, direction, frame, layer, shift) {
  const weapon = renderPlayerLayer(direction, frame, layer);
  const weaponShift = frame === 0 ? shift : { x: 0, y: 0 };
  paintPixels(context, weapon.pixels, (x, y) => ({
    x: x + weaponShift.x,
    y: y + weaponShift.y,
  }));
}

function renderGiantAttack(args) {
  assert(args.family.id === 'giant', 'The EN-E03 Giant Attack renderer is restricted to Giant.');
  assert(args.variant.id === 'hill-breaker', 'The EN-E03 Giant Attack renderer is restricted to Hill Breaker.');
  if (args.animation.id === 'idle' || args.animation.id === 'walk') {
    return EN_E03_GIANT_WALK_RENDERER.render(args);
  }
  assert(args.animation.id === 'attack' && args.frame >= 0 && args.frame < 4, 'The EN-E03 Giant Attack renderer authorizes only approved Idle and Walk plus four Attack frames.');
  const bodyShift = ATTACK_UPPER_BODY_SHIFTS[args.direction][args.frame];
  args.context.clearRect(0, 0, 24, 24);
  paintAttackWeapon(args.context, args.direction, args.frame, 'weapon-back', bodyShift);
  paintAttackBody(args.context, args.direction, args.frame, bodyShift);
  paintAttackWeapon(args.context, args.direction, args.frame, 'weapon-front', bodyShift);
  if ((args.frame === 1 || args.frame === 2) && args.direction === 'down') {
    args.context.clearRect(0, 23, 24, 1);
  }
  if ((args.frame === 1 || args.frame === 2) && args.direction === 'up') {
    args.context.clearRect(0, 0, 24, 1);
  }
  return Object.freeze({
    family: args.family.id,
    variant: args.variant.id,
    direction: args.direction,
    animation: args.animation.id,
    frame: args.frame,
    renderedAnimation: 'attack',
    renderedFrame: args.frame,
    giantAttackGate: EN_E03_GIANT_ATTACK_GATE.id,
    approvedWalkGate: EN_E03_GIANT_WALK_GATE.id,
    bodyShift,
  });
}

export const EN_E03_GIANT_ATTACK_RENDERER = Object.freeze({
  key: 'en-e03-giant-attack-v1',
  chassis: EN_E01_HUMANOID_RENDERER.chassis,
  render: renderGiantAttack,
});

export const EN_E03_GIANT_ATTACK_FAMILY = deepFreeze({
  id: 'giant',
  name: 'Giant',
  sliceId: 'EN-E03',
  rendererKey: EN_E03_GIANT_ATTACK_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [{
    id: 'hill-breaker',
    name: 'Hill Breaker',
    brief: 'Approved Idle and Walk baselines plus a visually approved four-frame overhead club Attack with one coherent upper-body-and-club coil, release, follow-through, and recovery.',
    rendererData: EN_E03_HILL_BREAKER_CALIBRATION_DATA,
  }],
  rendererData: {
    contractCard: 'giant',
    approvedWalkGate: EN_E03_GIANT_WALK_GATE.id,
    activeGate: EN_E03_GIANT_ATTACK_GATE.id,
  },
  review: {
    baselineVariant: 'hill-breaker',
    scale: 8,
    notes: 'Visually approved one-common-Attack baseline; its complete upper rig moves over anchored legs while approved Idle and Walk remain exact and the family stays internal and non-public.',
  },
});

export const EN_E03_GIANT_ATTACK_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E03_GIANT_ATTACK_RENDERER],
  families: [EN_E03_GIANT_ATTACK_FAMILY],
});
