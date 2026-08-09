import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E06_REDCAP_CONTRACT_CARD } from './enemy-expansion-en-e06-fairy-idle.js';
import { EN_E06_HEARTWOOD_WARDEN_GATE } from './enemy-expansion-en-e06-dryad-heartwood-warden.js';
import { EN_E06_MIRE_CRONE_GATE } from './enemy-expansion-en-e06-hag-mire-crone.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

const COLORS = deepFreeze({
  skin: ['#b98b68', '#704f43', '#ddb18a'],
  cap: ['#b52f36', '#681f2a', '#e0524b'],
  coat: ['#50473f', '#2d2a2a', '#766456'],
  leather: ['#76543a', '#423029', '#a4774c'],
  boot: ['#454850', '#25272d', '#777b85'],
  iron: ['#9da4ad', '#565d66', '#d4d8dd'],
  eye: '#efca58',
  flash: '#f4f4f4',
});

export const EN_E06_BARROW_STALKER_CONTRACT = deepFreeze({
  sliceId: 'EN-E06',
  family: 'redcap',
  variant: 'barrow-stalker',
  role: 'common',
  state: 'implemented-complete-motion-candidate',
  chassis: 'short-stocky-cap-heavy-fey-v1',
  silhouette: 'A very short broad fey with an oversized drooping red cap, long ears, a compact coat, one connected hooked hand weapon, and two massive planted iron boots. The cap-to-boot stack must remain distinct from public Goblins and the approved feral Hag.',
  identity: 'Ruddy ash skin, a blood-red cap, barrow-brown coat and leather, iron-dark boots, yellow eyes, and a pale iron hook establish a grave-ambusher identity without traps, blood spray, ground chips, or detached weapon trails.',
  effectBoundary: 'Blood spray, ground chips, weapon trails, trap markers, snare lines, grave dust, impact flashes, and detached hook glints remain external.',
});

export const EN_E06_BARROW_STALKER_DATA = deepFreeze({
  actor: {
    species: 'fey',
    bodyBuild: 'short-stocky',
    skin: 'ruddy-ash',
    hairStyle: 'none',
    hairColor: 'none',
    expression: 'ambusher',
    faceDetail: 'long-fey-ears',
    headgear: 'oversized-red-cap',
    outfit: 'barrow-coat',
    outfitColor: 'earth-brown',
    outfitTier: 'tier1',
    weapon: 'hooked-hand-bill',
    weaponTier: 'iron',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.skin,
      hair: COLORS.cap,
      outfit: COLORS.coat,
    },
  },
  barrowStalker: COLORS,
  alphaPolicy: 'binary-connected-cap-hook-and-iron-boots',
  effectBoundary: 'external-blood-spray-ground-chips-weapon-trails-trap-markers-snare-lines-grave-dust-impact-flashes-and-detached-hook-glints',
  bakedEffects: [],
});

export const EN_E06_BARROW_STALKER_GATE = deepFreeze({
  id: 'en-e06-redcap-barrow-stalker-full-v1',
  status: 'awaiting-visual-approval',
  baseCheckpoint: '72c5d7cad80d55b9e48924c4ff7fb44a578dfadb',
  authorizedOn: '2026-08-10',
  authorizationEvidence: 'After the exact Heartwood Warden lane was approved, committed, pushed, and reconciled, the designer said: cool lets do next. Under the documented EN-E06 family order and one-complete-sprite cadence, this authorizes only one private common Redcap Barrow Stalker 80-frame candidate.',
  approvedOn: null,
  approvalEvidence: null,
  publishedImplementation: null,
  precedingApproval: {
    gateId: EN_E06_HEARTWOOD_WARDEN_GATE.id,
    artifactSha256: EN_E06_HEARTWOOD_WARDEN_GATE.artifactSha256,
    assembledArtifactSha256: EN_E06_HEARTWOOD_WARDEN_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E06_HEARTWOOD_WARDEN_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E06_HEARTWOOD_WARDEN_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E06_HEARTWOOD_WARDEN_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E06_HEARTWOOD_WARDEN_GATE.candidateFrameDigest,
    publishedImplementation: EN_E06_HEARTWOOD_WARDEN_GATE.publishedImplementation,
    publishedHandoff: '72c5d7cad80d55b9e48924c4ff7fb44a578dfadb',
  },
  artifact: 'enemy-expansion-review/en-e06-redcap-barrow-stalker/en-e06-redcap-barrow-stalker-full-suite-raw.png',
  artifactSha256: 'caaacab0cf2f96c7f9b6832417998662bffdb4d348999d6b212e839cc232bb14',
  assembledArtifact: 'enemy-expansion-review/en-e06-redcap-barrow-stalker/en-e06-redcap-barrow-stalker-full-suite-complete-b-form.png',
  assembledArtifactSha256: '861574fad545675f022450d2d0975914952ac25898dee81e056d87d015fb44b6',
  comparisonArtifact: 'enemy-expansion-review/en-e06-redcap-barrow-stalker/en-e06-redcap-barrow-stalker-goblin-mire-comparison.png',
  comparisonArtifactSha256: '0995d0e4d9919648fee443e433a11bcd512e6c5ae176e38dd26e0f802a239d8f',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e06-redcap-barrow-stalker/en-e06-redcap-barrow-stalker-full-suite-four-directions-labeled.gif',
      sha256: '550b963d530de716f3cb5fc067bc459a0dce4c2f3492b984fee9b1db7a8bd33f', width: 640, height: 672, frames: 4, durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e06-redcap-barrow-stalker/en-e06-redcap-barrow-stalker-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '669f64872e063696a7cdcc3ac1072e28818282c7906db60d7dce510e9730406a', width: 640, height: 672, frames: 4, durationMs: 720,
    },
  },
  candidateFrameDigest: '1719f8611f212cfbacf041fc8459d3f52390b05aa73e0a1d50203554845051f1',
  goblinScoutComparisonDigest: '0582534e2f5fad7ba5059fb6936e9ceafbdca9dc0bcda257a36de6f98e9eb263',
  goblinBruteComparisonDigest: 'af106609ff08f3afacbf910fc2939336f9ecbf35158c382cb453ce2b014d6483',
  mireCroneComparisonDigest: EN_E06_MIRE_CRONE_GATE.candidateFrameDigest,
  scope: 'One complete 80-frame Barrow Stalker common Redcap across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle settles the oversized cap and low hook. Walk uses four quick iron-boot stomps with cap lag. Attack drops the weapon shoulder, draws the connected hook inward, drives an upward cleave, and recovers low. Hurt uses a complete white cap recoil and colored iron-boot brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and a public Goblin Scout/Hobgoblin plus approved Mire Crone silhouette comparison together.',
  exclusions: [
    'changes to approved Bramblewing Scout source or pixels',
    'changes to approved Thistle Hexer source or pixels',
    'changes to approved Petalcrown Duelist source or pixels',
    'changes to approved Hag source or pixels',
    'changes to approved Dryad source or pixels',
    'Ironboot Trapper implementation',
    'Bloodcap Reaver implementation',
    'Nymph implementation',
    'public Redcap registration',
    'public catalog exposure',
    'asset-pack fixture generation or regeneration',
    'new Cast pixels',
    'new Death pixels',
    'blood spray',
    'ground chips',
    'weapon trails',
    'trap markers',
    'snare lines',
    'grave dust',
    'impact flashes',
    'effects',
    'release',
    'later EN-E06 sprites',
    'EN-E07 and later Wave 2 work',
  ],
  nextGate: 'Present the exact hash-frozen raw/no-outline, Complete B + Form, public Goblin and approved Mire comparison, and paired GIF evidence for visual approval. Do not commit, push, register Redcap, generate fixtures, begin Ironboot Trapper or Nymph, add effects, release, or broaden Wave 2 without explicit authorization.',
});

export const EN_E06_BARROW_STALKER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const WALK_PHASES = deepFreeze([
  { name: 'left-ironboot-stomp', idleFrame: 0, step: -1, lift: 0 },
  { name: 'cap-lag-pass', idleFrame: 1, step: 0, lift: -1 },
  { name: 'right-ironboot-stomp', idleFrame: 0, step: 1, lift: 0 },
  { name: 'hook-low-settle', idleFrame: 1, step: 0, lift: 0 },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'weapon-shoulder-drop', pose: 'drop', idleFrame: 1, dx: 0, dy: 0 },
  { name: 'connected-hook-draw', pose: 'draw', idleFrame: 0, dx: 0, dy: -1 },
  { name: 'upward-hook-cleave', pose: 'cleave', idleFrame: 0, dx: 0, dy: 0 },
  { name: 'low-hook-recover', pose: 'recover', idleFrame: 1, dx: 0, dy: 0 },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-cap-recoil', pose: 'hurt', idleFrame: 0, dx: -1, dy: 0, flash: true },
  { name: 'colored-ironboot-brace', pose: 'brace', idleFrame: 1, dx: 0, dy: -1, flash: false },
]);

function pixelCanvas() {
  const pixels = new Array(SIZE * SIZE).fill(null);
  let fillStyle = '#000000';
  return {
    pixels,
    context: {
      get fillStyle() { return fillStyle; },
      set fillStyle(value) { fillStyle = value; },
      clearRect(x, y, width, height) {
        for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
          if (px >= 0 && py >= 0 && px < SIZE && py < SIZE) pixels[(py * SIZE) + px] = null;
        }
      },
      fillRect(x, y, width, height) {
        for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
          assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Barrow Stalker authored pixels must remain inside the 24x24 cell.');
          pixels[(py * SIZE) + px] = fillStyle;
        }
      },
    },
  };
}

function painter(context, dx = 0, dy = 0) {
  const rect = (x, y, width, height, fill) => {
    context.fillStyle = fill;
    context.fillRect(x + dx, y + dy, width, height);
  };
  return {
    rect,
    dot(x, y, fill) { rect(x, y, 1, 1, fill); },
    pairRect(x, y, width, height, fill) {
      rect(x, y, width, height, fill);
      rect(SIZE - x - width, y, width, height, fill);
    },
    pairDot(x, y, fill) {
      rect(x, y, 1, 1, fill);
      rect(SIZE - x - 1, y, 1, 1, fill);
    },
  };
}

function drawFrontBase(paint, rear, idleFrame, step = 0, weaponRest = true) {
  const capDip = idleFrame;
  // Oversized blood-red cap, long fey ears, and a low face.
  paint.rect(8, 3 + capDip, 8, 3, COLORS.cap[1]);
  paint.rect(7, 4 + capDip, 10, 3, COLORS.cap[0]);
  paint.rect(5, 6 + capDip, 14, 2, COLORS.cap[2]);
  paint.rect(4, 7 + capDip, 16, 1, COLORS.cap[1]);
  paint.rect(7, 8, 10, 4, rear ? COLORS.skin[1] : COLORS.skin[0]);
  paint.rect(5, 8, 3, 2, COLORS.skin[1]);
  paint.rect(16, 8, 3, 2, COLORS.skin[1]);
  paint.dot(4, 8, COLORS.skin[2]);
  paint.dot(19, 8, COLORS.skin[2]);
  if (rear) {
    paint.dot(4, 6 + capDip, COLORS.cap[1]);
    paint.rect(9, 8, 6, 3, COLORS.cap[1]);
    paint.rect(10, 9, 4, 2, COLORS.cap[0]);
  } else {
    paint.pairDot(9, 9, COLORS.eye);
    paint.rect(10, 10, 4, 1, COLORS.skin[1]);
    paint.dot(12, 11, COLORS.skin[2]);
  }

  // Compact coat and heavy low shoulders.
  paint.rect(7, 10, 10, 3, COLORS.coat[1]);
  paint.rect(6, 12, 12, 5, COLORS.coat[0]);
  paint.rect(8, 12, 8, 2, COLORS.coat[2]);
  paint.rect(8, 16, 8, 3, COLORS.leather[0]);
  paint.rect(10, 16, 4, 3, COLORS.leather[2]);
  paint.rect(5, 12, 3, 5, COLORS.skin[1]);
  paint.rect(16, 12, 3, 5, COLORS.skin[0]);
  paint.rect(5, 16, 3, 2, COLORS.leather[1]);
  paint.rect(16, 16, 3, 2, COLORS.leather[0]);

  // Massive iron boots hold the short silhouette to the ground.
  paint.rect(6 + Math.min(step, 0), 18, 6, 4, COLORS.boot[1]);
  paint.rect(13 + Math.max(step, 0), 18, 6, 4, COLORS.boot[0]);
  paint.rect(5 + Math.min(step, 0), 20, 7, 3, COLORS.iron[1]);
  paint.rect(13 + Math.max(step, 0), 20, 7, 3, COLORS.iron[0]);
  paint.rect(6 + Math.min(step, 0), 20, 5, 1, COLORS.iron[2]);
  paint.rect(14 + Math.max(step, 0), 20, 5, 1, COLORS.iron[2]);

  // The resting hooked bill remains physically attached to the weapon hand.
  if (weaponRest) {
    paint.rect(17, 15, 2, 2, COLORS.skin[2]);
    paint.rect(18, 16, 2, 4, COLORS.leather[1]);
    paint.rect(19, 18, 2, 3, COLORS.iron[1]);
    paint.rect(20, 19, 2, 2, COLORS.iron[0]);
    paint.dot(21, 18, COLORS.iron[2]);
  }
}

function drawRightBase(paint, idleFrame, step = 0, weaponRest = true) {
  const capDip = idleFrame;
  // Back-heavy cap with a drooping tail and a jutting long-eared profile.
  paint.rect(7, 3 + capDip, 8, 3, COLORS.cap[1]);
  paint.rect(5, 4 + capDip, 12, 3, COLORS.cap[0]);
  paint.rect(3, 6 + capDip, 15, 2, COLORS.cap[2]);
  paint.rect(2, 5 + capDip, 4, 2, COLORS.cap[1]);
  paint.rect(8, 8, 10, 4, COLORS.skin[0]);
  paint.rect(5, 8, 4, 2, COLORS.skin[1]);
  paint.dot(4, 8, COLORS.skin[2]);
  paint.rect(16, 9, 4, 2, COLORS.skin[1]);
  paint.dot(17, 9, COLORS.eye);
  paint.dot(20, 10, COLORS.skin[2]);

  // Short barrow coat with one forward weapon shoulder.
  paint.rect(7, 10, 11, 3, COLORS.coat[1]);
  paint.rect(7, 12, 12, 5, COLORS.coat[0]);
  paint.rect(9, 12, 8, 2, COLORS.coat[2]);
  paint.rect(9, 16, 9, 3, COLORS.leather[0]);
  paint.rect(11, 16, 5, 2, COLORS.leather[2]);
  paint.rect(6, 12, 3, 5, COLORS.skin[1]);
  paint.rect(16, 12, 3, 5, COLORS.skin[0]);
  paint.rect(6, 16, 3, 2, COLORS.leather[1]);

  // Two oversized boots overlap the coat base but retain a stomping read.
  paint.rect(8 + Math.min(step, 0), 18, 6, 4, COLORS.boot[1]);
  paint.rect(14 + Math.max(step, 0), 18, 6, 4, COLORS.boot[0]);
  paint.rect(7 + Math.min(step, 0), 20, 7, 3, COLORS.iron[1]);
  paint.rect(14 + Math.max(step, 0), 20, 7, 3, COLORS.iron[0]);
  paint.rect(8 + Math.min(step, 0), 20, 5, 1, COLORS.iron[2]);
  paint.rect(15 + Math.max(step, 0), 20, 5, 1, COLORS.iron[2]);

  if (weaponRest) {
    paint.rect(18, 14, 2, 3, COLORS.skin[2]);
    paint.rect(19, 16, 2, 4, COLORS.leather[1]);
    paint.rect(20, 18, 2, 3, COLORS.iron[1]);
    paint.rect(21, 19, 2, 2, COLORS.iron[0]);
    paint.dot(22, 18, COLORS.iron[2]);
  }
}

function drawFrontAttack(paint, rear, phase) {
  drawFrontBase(paint, rear, phase.idleFrame, 0, false);
  if (phase.pose === 'drop') {
    paint.rect(14, 12, 4, 4, COLORS.skin[1]);
    paint.rect(12, 14, 3, 2, COLORS.skin[2]);
    paint.rect(9, 14, 4, 2, COLORS.leather[1]);
    paint.rect(7, 13, 3, 3, COLORS.iron[0]);
    paint.dot(7, 16, COLORS.iron[2]);
  } else if (phase.pose === 'draw') {
    paint.rect(14, 11, 4, 4, COLORS.skin[1]);
    paint.rect(11, 11, 5, 2, COLORS.leather[1]);
    paint.rect(9, 9, 3, 3, COLORS.iron[0]);
    paint.dot(8, 10, COLORS.iron[2]);
  } else if (phase.pose === 'cleave') {
    paint.rect(16, 10, 4, 4, COLORS.skin[1]);
    paint.rect(18, 7, 2, 5, COLORS.leather[1]);
    paint.rect(18, 5, 4, 3, COLORS.iron[0]);
    paint.dot(21, 4, COLORS.iron[2]);
  } else {
    paint.rect(16, 13, 4, 3, COLORS.skin[1]);
    paint.rect(18, 15, 2, 4, COLORS.leather[1]);
    paint.rect(19, 18, 3, 2, COLORS.iron[0]);
    paint.dot(21, 17, COLORS.iron[2]);
  }
}

function drawRightAttack(paint, phase) {
  drawRightBase(paint, phase.idleFrame, 0, false);
  if (phase.pose === 'drop') {
    paint.rect(15, 12, 5, 4, COLORS.skin[1]);
    paint.rect(13, 14, 3, 2, COLORS.skin[2]);
    paint.rect(10, 14, 4, 2, COLORS.leather[1]);
    paint.rect(8, 13, 3, 3, COLORS.iron[0]);
    paint.dot(8, 16, COLORS.iron[2]);
  } else if (phase.pose === 'draw') {
    paint.rect(16, 10, 4, 5, COLORS.skin[1]);
    paint.rect(14, 11, 4, 2, COLORS.leather[1]);
    paint.rect(12, 9, 3, 3, COLORS.iron[0]);
    paint.dot(11, 10, COLORS.iron[2]);
  } else if (phase.pose === 'cleave') {
    paint.rect(17, 10, 4, 4, COLORS.skin[1]);
    paint.rect(19, 6, 2, 6, COLORS.leather[1]);
    paint.rect(19, 4, 4, 3, COLORS.iron[0]);
    paint.dot(22, 3, COLORS.iron[2]);
  } else {
    paint.rect(17, 12, 4, 4, COLORS.skin[1]);
    paint.rect(19, 15, 2, 4, COLORS.leather[1]);
    paint.rect(20, 18, 3, 2, COLORS.iron[0]);
    paint.dot(22, 17, COLORS.iron[2]);
  }
}

function buildPixels(direction, animation, frame) {
  const canonicalDirection = direction === 'left' ? 'right' : direction;
  let phase;
  if (animation === 'idle') {
    assert(frame === 0 || frame === 1, `Barrow Stalker Idle frame ${frame} is out of range.`);
    phase = { name: frame === 0 ? 'low-hook-watch' : 'oversized-cap-settle', idleFrame: frame, step: 0, dx: 0, dy: 0 };
  } else if (animation === 'walk') phase = WALK_PHASES[frame];
  else if (animation === 'attack' || animation === 'cast') phase = ATTACK_PHASES[frame];
  else if (animation === 'hurt') phase = HURT_PHASES[frame];
  else if (animation === 'death') phase = HURT_PHASES[EN_E06_BARROW_STALKER_DEATH_SOURCE_FRAMES[frame]];
  assert(phase, `Barrow Stalker animation ${animation} frame ${frame} is out of range.`);

  const canvas = pixelCanvas();
  const paint = painter(canvas.context, phase.dx || 0, phase.dy || phase.lift || 0);
  if (animation === 'attack' || animation === 'cast') {
    if (canonicalDirection === 'right') drawRightAttack(paint, phase);
    else drawFrontAttack(paint, canonicalDirection === 'up', phase);
  } else {
    const step = phase.step || 0;
    if (canonicalDirection === 'right') drawRightBase(paint, phase.idleFrame, step);
    else drawFrontBase(paint, canonicalDirection === 'up', phase.idleFrame, step);
    if (phase.pose === 'brace') {
      paint.rect(canonicalDirection === 'right' ? 12 : 8, 13, 7, 3, COLORS.coat[1]);
      paint.rect(canonicalDirection === 'right' ? 16 : 13, 15, 3, 4, COLORS.skin[1]);
      paint.rect(canonicalDirection === 'right' ? 17 : 14, 17, 3, 2, COLORS.iron[2]);
    }
  }
  let pixels = canvas.pixels;
  if (phase.flash) pixels = pixels.map((color) => color === null ? null : COLORS.flash);
  if (direction === 'left') {
    const mirrored = new Array(SIZE * SIZE).fill(null);
    for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) mirrored[(y * SIZE) + (SIZE - 1 - x)] = pixels[(y * SIZE) + x];
    pixels = mirrored;
  }
  return { phase, pixels };
}

function paintPixels(context, pixels) {
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    const color = pixels[(y * SIZE) + x];
    if (color === null) continue;
    context.fillStyle = color;
    context.fillRect(x, y, 1, 1);
  }
}

export function renderEnE06BarrowStalkerFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Barrow Stalker rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), `Unsupported Barrow Stalker direction ${direction}.`);
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'redcap', variant: 'barrow-stalker', direction, animation, frame,
    phase: phase.name,
    barrowStalkerGate: EN_E06_BARROW_STALKER_GATE.id,
    approvedPrecedingGate: EN_E06_HEARTWOOD_WARDEN_GATE.id,
    alphaPolicy: EN_E06_BARROW_STALKER_DATA.alphaPolicy,
    effectBoundary: EN_E06_BARROW_STALKER_DATA.effectBoundary,
  });
}

export const EN_E06_BARROW_STALKER_RENDERER = deepFreeze({
  key: 'en-e06-redcap-barrow-stalker-v1',
  chassis: EN_E06_BARROW_STALKER_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'redcap', 'The EN-E06 Barrow Stalker renderer is restricted to Redcap.');
    assert(variant.id === 'barrow-stalker', 'The EN-E06 Barrow Stalker renderer is restricted to Barrow Stalker.');
    return renderEnE06BarrowStalkerFrame(context, direction, animation.id, frame);
  },
});

const BARROW_STALKER_VARIANT = deepFreeze({
  id: 'barrow-stalker',
  name: 'Barrow Stalker',
  role: EN_E06_BARROW_STALKER_CONTRACT.role,
  status: EN_E06_BARROW_STALKER_CONTRACT.state,
  brief: 'A complete common Redcap candidate with an oversized blood-red cap, long ears, short barrow coat, connected hooked bill, and massive iron boots; blood, traps, trails, chips, and grave dust remain external.',
  rendererData: EN_E06_BARROW_STALKER_DATA,
});

export const EN_E06_BARROW_STALKER_FAMILY = deepFreeze({
  id: 'redcap',
  name: 'Redcap Barrow Stalker Review',
  sliceId: 'EN-E06',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E06_BARROW_STALKER_CONTRACT.chassis,
  rendererKey: EN_E06_BARROW_STALKER_RENDERER.key,
  variants: [BARROW_STALKER_VARIANT],
  rendererData: {
    contractCard: EN_E06_REDCAP_CONTRACT_CARD.id,
    approvedPrecedingGate: EN_E06_HEARTWOOD_WARDEN_GATE.id,
    activeGate: EN_E06_BARROW_STALKER_GATE.id,
  },
  review: {
    baselineVariant: 'barrow-stalker',
    scale: 8,
    notes: 'Awaiting visual approval for one complete grounded Barrow Stalker against public Goblin Scout/Hobgoblin and approved Mire Crone. Keep later Redcaps, Nymph, registration, fixtures, effects, and later Wave 2 work separate.',
  },
});

export const EN_E06_BARROW_STALKER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E06_BARROW_STALKER_RENDERER],
  families: [EN_E06_BARROW_STALKER_FAMILY],
});
