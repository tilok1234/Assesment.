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
  EN_E03_GIANT_ATTACK_GATE,
  EN_E03_GIANT_ATTACK_RENDERER,
} from './enemy-expansion-en-e03-giant-attack.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E03_GIANT_HURT_GATE = deepFreeze({
  id: 'en-e03-hill-breaker-hurt-v1',
  status: 'approved',
  authorizedOn: '2026-08-07',
  authorizationEvidence: 'Designer approved continuing the 80 plan, then explicitly accepted the proposed Hill Breaker Hurt H1-H2 scope with: lets go for it.',
  approvedOn: '2026-08-07',
  approvalEvidence: 'Designer reviewed both exact labeled all-four-direction raw and Complete B + Form Hill Breaker Hurt animations together and said: approved.',
  approvedAttack: {
    gateId: EN_E03_GIANT_ATTACK_GATE.id,
    artifactSha256: EN_E03_GIANT_ATTACK_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_GIANT_ATTACK_GATE.assembledArtifactSha256,
    frameDigest: EN_E03_GIANT_ATTACK_GATE.candidateFrameDigest,
  },
  approvedIdle: EN_E03_GIANT_ATTACK_GATE.approvedIdle,
  approvedWalk: EN_E03_GIANT_ATTACK_GATE.approvedWalk,
  artifact: 'enemy-expansion-review/en-e03-giant-hurt/en-e03-hill-breaker-hurt-raw.png',
  artifactSha256: 'e621d1ed2898efdf9e49488aa367f7857b1c96f3b2ea1d9dd0dcd75dba2bcf02',
  assembledArtifact: 'enemy-expansion-review/en-e03-giant-hurt/en-e03-hill-breaker-hurt-complete-b-form.png',
  assembledArtifactSha256: '201f7c3246c0a924426201d1ad43b6f90849d9f4cd934b591b7d5a8bd6d9161c',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e03-giant-hurt/en-e03-hill-breaker-hurt-four-directions-labeled.gif',
      sha256: 'ebc7e3e1fcfad73aa0b8114e270dae2a699933aedc23b306a73edeec9214e5b6',
      width: 192,
      height: 224,
      frames: 2,
      durationMs: 280,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e03-giant-hurt/en-e03-hill-breaker-hurt-four-directions-labeled-complete-b-form.gif',
      sha256: 'f2034dd87706e196f1eece15f08db86dfb6e32a5437c18cdfe08e89b778ba3f4',
      width: 192,
      height: 224,
      frames: 2,
      durationMs: 280,
    },
  },
  candidateFrameDigest: '92c18dc1dd0699e52f5f31a0900be1c6e46974c6f5bc3347fc7a7c7b65432340',
  scope: 'Hill Breaker common Hurt only: H1-H2 across Down, Left, Right, and Up, with approved Idle, Walk, and Attack delegated byte-for-byte.',
  motion: 'H1 flashes and recoils the upper body and club together away from the incoming hit while the feet stay planted; H2 drops into a colored braced recovery before returning to the approved stance.',
  exclusions: [
    'Idle pixel changes',
    'Walk pixel changes',
    'Attack pixel changes',
    'Centaur changes',
    'Satyr changes',
    'specialist variants',
    'elite variants',
    'Cast aliases',
    'Death aliases',
    'registration',
    'consumer exposure',
    'effects',
    'release',
  ],
  nextGate: 'Visual approval is complete and this bounded lane is published. Stop until the designer explicitly selects and authorizes the next EN-E03 gate; this approval authorizes no later work.',
});

export const EN_E03_GIANT_HURT_BODY_SHIFTS = deepFreeze({
  down: [{ x: 1, y: -1 }, { x: 0, y: 1 }],
  left: [{ x: 1, y: -1 }, { x: 0, y: 1 }],
  right: [{ x: -1, y: -1 }, { x: 0, y: 1 }],
  up: [{ x: -1, y: 1 }, { x: 0, y: 1 }],
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

function paintPixels(context, pixels, transform, flash) {
  for (let y = 0; y < 24; y++) for (let x = 0; x < 24; x++) {
    const color = pixels[(y * 24) + x];
    if (color === null) continue;
    const target = transform(x, y);
    context.fillStyle = flash ? '#ffffff' : color;
    context.fillRect(target.x, target.y, 1, 1);
  }
}

function renderPlayerLayer(direction, frame, layer) {
  const rendered = createPixelBuffer();
  drawSprite(rendered.context, HILL_BREAKER_PLAYER_SPEC, direction, 'hurt', frame, {
    clear: true,
    layer,
    shadow: false,
  });
  return rendered;
}

function paintHurtBody(context, direction, frame, shift) {
  const body = renderPlayerLayer(direction, frame, 'body');
  drawGiantCalibrationIdentity(body.context, direction);
  const frontOrBack = direction === 'down' || direction === 'up';
  const anchorRow = frontOrBack ? 20 : 18;
  paintPixels(context, body.pixels, (x, y) => {
    if (y >= anchorRow) return { x, y };
    return {
      x: x + shift.x,
      y: Math.max(1, Math.min(anchorRow - 1, y + shift.y)),
    };
  }, frame === 0);
  const seamRow = anchorRow - 1;
  for (let x = 0; x < 24; x++) {
    const color = body.pixels[(seamRow * 24) + x];
    if (color === null) continue;
    context.fillStyle = frame === 0 ? '#ffffff' : color;
    context.fillRect(x, seamRow, 1, 1);
  }
}

function paintHurtWeapon(context, direction, frame, layer, shift) {
  const weapon = renderPlayerLayer(direction, frame, layer);
  paintPixels(context, weapon.pixels, (x, y) => ({
    x: x + shift.x,
    y: Math.max(1, Math.min(22, y + shift.y)),
  }), frame === 0);
}

function renderGiantHurt(args) {
  assert(args.family.id === 'giant', 'The EN-E03 Giant Hurt renderer is restricted to Giant.');
  assert(args.variant.id === 'hill-breaker', 'The EN-E03 Giant Hurt renderer is restricted to Hill Breaker.');
  if (args.animation.id === 'idle' || args.animation.id === 'walk' || args.animation.id === 'attack') {
    return EN_E03_GIANT_ATTACK_RENDERER.render(args);
  }
  assert(args.animation.id === 'hurt' && args.frame >= 0 && args.frame < 2, 'The EN-E03 Giant Hurt renderer authorizes only approved Idle, Walk, and Attack plus two Hurt frames.');
  const bodyShift = EN_E03_GIANT_HURT_BODY_SHIFTS[args.direction][args.frame];
  args.context.clearRect(0, 0, 24, 24);
  paintHurtWeapon(args.context, args.direction, args.frame, 'weapon-back', bodyShift);
  paintHurtBody(args.context, args.direction, args.frame, bodyShift);
  paintHurtWeapon(args.context, args.direction, args.frame, 'weapon-front', bodyShift);
  return Object.freeze({
    family: args.family.id,
    variant: args.variant.id,
    direction: args.direction,
    animation: args.animation.id,
    frame: args.frame,
    renderedAnimation: 'hurt',
    renderedFrame: args.frame,
    giantHurtGate: EN_E03_GIANT_HURT_GATE.id,
    approvedAttackGate: EN_E03_GIANT_ATTACK_GATE.id,
    bodyShift,
  });
}

export const EN_E03_GIANT_HURT_RENDERER = Object.freeze({
  key: 'en-e03-giant-hurt-v1',
  chassis: EN_E01_HUMANOID_RENDERER.chassis,
  render: renderGiantHurt,
});

export const EN_E03_GIANT_HURT_FAMILY = deepFreeze({
  id: 'giant',
  name: 'Giant',
  sliceId: 'EN-E03',
  rendererKey: EN_E03_GIANT_HURT_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [{
    id: 'hill-breaker',
    name: 'Hill Breaker',
    brief: 'Approved Idle, Walk, and Attack baselines plus an approved two-frame Hurt with a unified planted recoil and braced recovery.',
    rendererData: EN_E03_HILL_BREAKER_CALIBRATION_DATA,
  }],
  rendererData: {
    contractCard: 'giant',
    approvedAttackGate: EN_E03_GIANT_ATTACK_GATE.id,
    activeGate: EN_E03_GIANT_HURT_GATE.id,
  },
  review: {
    baselineVariant: 'hill-breaker',
    scale: 8,
    notes: 'Visually approved two-frame common Hurt baseline; all earlier approved motion remains exact and the family stays internal and non-public.',
  },
});

export const EN_E03_GIANT_HURT_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E03_GIANT_HURT_RENDERER],
  families: [EN_E03_GIANT_HURT_FAMILY],
});
