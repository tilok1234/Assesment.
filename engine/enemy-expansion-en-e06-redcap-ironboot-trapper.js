import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E06_REDCAP_CONTRACT_CARD } from './enemy-expansion-en-e06-fairy-idle.js';
import { EN_E06_BARROW_STALKER_GATE } from './enemy-expansion-en-e06-redcap-barrow-stalker.js';

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
  skin: ['#9d7d64', '#59443b', '#c5a080'],
  cap: ['#9c2932', '#4f1821', '#d3473f'],
  coat: ['#4d533a', '#292f28', '#737a4f'],
  leather: ['#845c39', '#463125', '#b2824d'],
  boot: ['#383d46', '#1f2329', '#686f7a'],
  iron: ['#8f9ba8', '#4c5864', '#ced5dc'],
  buckle: ['#b88a3c', '#6f4f25', '#e0b85a'],
  eye: '#f0c956',
  flash: '#f4f4f4',
});

export const EN_E06_IRONBOOT_TRAPPER_CONTRACT = deepFreeze({
  sliceId: 'EN-E06',
  family: 'redcap',
  variant: 'ironboot-trapper',
  role: 'specialist',
  state: 'implemented-complete-motion-candidate',
  chassis: 'short-stocky-flatcap-trapper-fey-v1',
  silhouette: 'A short broad fey with a flat reinforced red cap, long ears, an asymmetric buckle harness, connected trap-setting tongs, a leather apron, and two enormous square-toed iron boots. The flat cap, tong jaws, and boot-heavy stance must differ from Barrow Stalker and public Goblins in every frame.',
  identity: 'Weathered umber skin, a riveted rust-red cap, moss-dark coat, ochre leather harness, brass buckles, steel tongs, yellow eyes, and blocky iron boots establish a practical specialist without baking in traps, snares, chains, or markers.',
  effectBoundary: 'Blood spray, ground chips, weapon trails, placed traps, trap markers, snare lines, loose chains, grave dust, impact flashes, and detached tong glints remain external.',
});

export const EN_E06_IRONBOOT_TRAPPER_DATA = deepFreeze({
  actor: {
    species: 'fey',
    bodyBuild: 'short-stocky',
    skin: 'weathered-umber',
    hairStyle: 'none',
    hairColor: 'none',
    expression: 'calculating-trapper',
    faceDetail: 'long-fey-ears',
    headgear: 'flat-riveted-red-cap',
    outfit: 'buckle-harness-and-leather-apron',
    outfitColor: 'moss-and-ochre',
    outfitTier: 'tier2',
    weapon: 'connected-trap-setting-tongs',
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
  ironbootTrapper: COLORS,
  alphaPolicy: 'binary-connected-flat-cap-tongs-harness-and-square-iron-boots',
  effectBoundary: 'external-blood-spray-ground-chips-weapon-trails-placed-traps-trap-markers-snare-lines-loose-chains-grave-dust-impact-flashes-and-detached-tong-glints',
  bakedEffects: [],
});

export const EN_E06_IRONBOOT_TRAPPER_GATE = deepFreeze({
  id: 'en-e06-redcap-ironboot-trapper-full-v1',
  status: 'candidate',
  baseCheckpoint: '3cb794da9078056d51eaa23137cf67c9782aa77d',
  authorizedOn: '2026-08-10',
  authorizationEvidence: 'After Barrow Stalker was visually approved, committed, pushed, and reconciled at a clean published checkpoint, the designer said: next. Under the documented EN-E06 Redcap role order and one-complete-sprite cadence, this authorizes only one private specialist Redcap Ironboot Trapper 80-frame candidate.',
  approvedOn: null,
  approvalEvidence: 'Pending designer review of the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, public Goblin Scout/Hobgoblin plus approved Barrow Stalker comparison, paired GIF evidence, and the three exact PNG boards opened together in Aseprite.',
  publishedImplementation: null,
  precedingApproval: {
    gateId: EN_E06_BARROW_STALKER_GATE.id,
    artifactSha256: EN_E06_BARROW_STALKER_GATE.artifactSha256,
    assembledArtifactSha256: EN_E06_BARROW_STALKER_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E06_BARROW_STALKER_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E06_BARROW_STALKER_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E06_BARROW_STALKER_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E06_BARROW_STALKER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E06_BARROW_STALKER_GATE.publishedImplementation,
    publishedHandoff: '3cb794da9078056d51eaa23137cf67c9782aa77d',
  },
  artifact: 'enemy-expansion-review/en-e06-redcap-ironboot-trapper/en-e06-redcap-ironboot-trapper-full-suite-raw.png',
  artifactSha256: '139776b84be26585b3bc3d23118a0c55f2f6cdac176b0747b070e10f2f88e8ed',
  assembledArtifact: 'enemy-expansion-review/en-e06-redcap-ironboot-trapper/en-e06-redcap-ironboot-trapper-full-suite-complete-b-form.png',
  assembledArtifactSha256: 'dd606da11e8c9718c35c02b16dbd630f6715514d6def26b1527e8188300d4609',
  comparisonArtifact: 'enemy-expansion-review/en-e06-redcap-ironboot-trapper/en-e06-redcap-ironboot-trapper-goblin-barrow-comparison.png',
  comparisonArtifactSha256: 'bd4b88450b0edb8fc3559049ec0013024573f8cc85ca3a3f33a5cc0142b4e5f7',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e06-redcap-ironboot-trapper/en-e06-redcap-ironboot-trapper-full-suite-four-directions-labeled.gif',
      sha256: 'a38ca4cc31e178299096d67df27a54fbcb4ec1eab8c71438786cc9931b550a17', width: 640, height: 672, frames: 4, durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e06-redcap-ironboot-trapper/en-e06-redcap-ironboot-trapper-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '83b71e030b9f2fe61526c0014a350d43c8e5b68c7a89675890ec1dc148b9c927', width: 640, height: 672, frames: 4, durationMs: 720,
    },
  },
  candidateFrameDigest: '31c37fd25d688bd295c2fb84bdb437141149cf43986b6edcc4141467bc32bdf1',
  goblinScoutComparisonDigest: '0582534e2f5fad7ba5059fb6936e9ceafbdca9dc0bcda257a36de6f98e9eb263',
  goblinBruteComparisonDigest: 'af106609ff08f3afacbf910fc2939336f9ecbf35158c382cb453ce2b014d6483',
  barrowStalkerComparisonDigest: EN_E06_BARROW_STALKER_GATE.candidateFrameDigest,
  scope: 'One complete 80-frame Ironboot Trapper specialist Redcap across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle settles the flat riveted cap and closed setting tongs. Walk uses four weighty square-boot stomps with harness and cap lag. Attack braces the tong handle, opens the connected jaws, drives them downward in a trap-setting clamp, and recovers closed. Hurt uses a complete white recoil and colored iron-boot brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and a public Goblin Scout/Hobgoblin plus approved Barrow Stalker silhouette comparison together.',
  exclusions: [
    'changes to approved Bramblewing Scout source or pixels',
    'changes to approved Thistle Hexer source or pixels',
    'changes to approved Petalcrown Duelist source or pixels',
    'changes to approved Hag source or pixels',
    'changes to approved Dryad source or pixels',
    'changes to approved Barrow Stalker source or pixels',
    'Bloodcap Reaver implementation',
    'Nymph implementation',
    'public Redcap registration',
    'public catalog exposure',
    'asset-pack fixture generation or regeneration',
    'new Cast pixels',
    'new Death pixels',
    'placed traps',
    'blood spray',
    'ground chips',
    'weapon trails',
    'trap markers',
    'snare lines',
    'loose chains',
    'grave dust',
    'impact flashes',
    'effects',
    'release',
    'later EN-E06 sprites',
    'EN-E07 and later Wave 2 work',
  ],
  nextGate: 'Stop for designer visual approval of this exact hash-frozen Ironboot Trapper candidate. Do not commit, publish, register Redcap, generate fixtures, begin Bloodcap Reaver or Nymph, open EN-E07, add effects, release, or broaden Wave 2 before that review.',
});

export const EN_E06_IRONBOOT_TRAPPER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const WALK_PHASES = deepFreeze([
  { name: 'left-squareboot-stomp', idleFrame: 0, step: -1, lift: 0 },
  { name: 'harness-lag-pass', idleFrame: 1, step: 0, lift: -1 },
  { name: 'right-squareboot-stomp', idleFrame: 0, step: 1, lift: 0 },
  { name: 'closed-tongs-settle', idleFrame: 1, step: 0, lift: 0 },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'tong-handle-brace', pose: 'brace-tool', idleFrame: 1, dx: 0, dy: 0 },
  { name: 'connected-jaws-open', pose: 'open', idleFrame: 0, dx: 0, dy: -1 },
  { name: 'downward-setting-clamp', pose: 'clamp', idleFrame: 0, dx: 0, dy: 0 },
  { name: 'closed-tongs-recover', pose: 'recover', idleFrame: 1, dx: 0, dy: 0 },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-cap-recoil', pose: 'hurt', idleFrame: 0, dx: -1, dy: 0, flash: true },
  { name: 'colored-squareboot-brace', pose: 'brace', idleFrame: 1, dx: 0, dy: -1, flash: false },
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
          assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Ironboot Trapper authored pixels must remain inside the 24x24 cell.');
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
  // Broad flat cap, riveted band, long ears, and a low square face.
  paint.rect(7, 3 + capDip, 10, 2, COLORS.cap[1]);
  paint.rect(5, 5 + capDip, 14, 2, COLORS.cap[0]);
  paint.rect(3, 7 + capDip, 18, 1, COLORS.cap[2]);
  paint.rect(4, 6 + capDip, 3, 3, COLORS.cap[1]);
  paint.dot(7, 7 + capDip, COLORS.buckle[2]);
  paint.dot(16, 7 + capDip, COLORS.buckle[0]);
  paint.rect(7, 8, 10, 3, rear ? COLORS.skin[1] : COLORS.skin[0]);
  paint.rect(4, 8, 4, 2, COLORS.skin[1]);
  paint.rect(16, 8, 4, 2, COLORS.skin[1]);
  paint.dot(3, 8, COLORS.skin[2]);
  paint.dot(20, 8, COLORS.skin[2]);
  if (rear) {
    paint.dot(21, 7 + capDip, COLORS.cap[1]);
    paint.rect(8, 8, 8, 2, COLORS.cap[1]);
    paint.rect(10, 9, 4, 2, COLORS.cap[0]);
    paint.pairDot(8, 10, COLORS.leather[2]);
  } else {
    paint.pairDot(9, 9, COLORS.eye);
    paint.rect(10, 10, 4, 1, COLORS.skin[1]);
  }

  // Moss coat, asymmetric buckle harness, and stiff trapper apron.
  paint.rect(6, 10, 12, 3, COLORS.coat[1]);
  paint.rect(5, 12, 14, 5, COLORS.coat[0]);
  paint.rect(7, 12, 10, 2, COLORS.coat[2]);
  paint.rect(6, 11, 3, 6, COLORS.leather[1]);
  paint.rect(8, 13, 3, 2, COLORS.leather[0]);
  paint.rect(10, 14, 5, 5, COLORS.leather[0]);
  paint.rect(11, 15, 3, 4, COLORS.leather[2]);
  paint.dot(9, 13, COLORS.buckle[2]);
  paint.rect(14, 14, 2, 2, COLORS.buckle[0]);
  paint.rect(4, 12, 3, 5, COLORS.skin[1]);
  paint.rect(17, 12, 3, 5, COLORS.skin[0]);

  // Square-toed iron boots dominate the specialist silhouette.
  paint.rect(5 + Math.min(step, 0), 18, 7, 4, COLORS.boot[1]);
  paint.rect(12 + Math.max(step, 0), 18, 7, 4, COLORS.boot[0]);
  paint.rect(4 + Math.min(step, 0), 20, 8, 3, COLORS.iron[1]);
  paint.rect(12 + Math.max(step, 0), 20, 8, 3, COLORS.iron[0]);
  paint.rect(5 + Math.min(step, 0), 20, 6, 1, COLORS.iron[2]);
  paint.rect(13 + Math.max(step, 0), 20, 6, 1, COLORS.iron[2]);
  paint.dot(6 + Math.min(step, 0), 21, COLORS.buckle[1]);
  paint.dot(17 + Math.max(step, 0), 21, COLORS.buckle[1]);

  // Closed trap-setting tongs remain attached to the hand and actor mass.
  if (weaponRest) {
    paint.rect(18, 14, 2, 3, COLORS.skin[2]);
    paint.rect(19, 16, 2, 4, COLORS.leather[1]);
    paint.rect(18, 19, 5, 2, COLORS.iron[1]);
    paint.rect(19, 20, 4, 2, COLORS.iron[0]);
    paint.dot(18, 18, COLORS.iron[2]);
    paint.dot(22, 19, COLORS.iron[2]);
  }
}

function drawRightBase(paint, idleFrame, step = 0, weaponRest = true) {
  const capDip = idleFrame;
  // Flat riveted cap with a short rear flap and long-eared profile.
  paint.rect(7, 3 + capDip, 10, 2, COLORS.cap[1]);
  paint.rect(5, 5 + capDip, 14, 2, COLORS.cap[0]);
  paint.rect(3, 7 + capDip, 17, 1, COLORS.cap[2]);
  paint.rect(2, 5 + capDip, 4, 3, COLORS.cap[1]);
  paint.dot(8, 7 + capDip, COLORS.buckle[2]);
  paint.rect(8, 8, 10, 3, COLORS.skin[0]);
  paint.rect(5, 8, 4, 2, COLORS.skin[1]);
  paint.dot(4, 8, COLORS.skin[2]);
  paint.rect(16, 9, 4, 2, COLORS.skin[1]);
  paint.dot(17, 9, COLORS.eye);
  paint.dot(20, 10, COLORS.skin[2]);

  // Thick coat, visible cross-harness, buckle, and forward apron.
  paint.rect(7, 10, 12, 3, COLORS.coat[1]);
  paint.rect(6, 12, 13, 5, COLORS.coat[0]);
  paint.rect(8, 12, 9, 2, COLORS.coat[2]);
  paint.rect(7, 11, 3, 7, COLORS.leather[1]);
  paint.rect(9, 13, 4, 2, COLORS.leather[0]);
  paint.rect(12, 14, 6, 5, COLORS.leather[0]);
  paint.rect(13, 15, 4, 3, COLORS.leather[2]);
  paint.dot(10, 13, COLORS.buckle[2]);
  paint.rect(16, 14, 2, 2, COLORS.buckle[0]);
  paint.rect(5, 12, 3, 5, COLORS.skin[1]);
  paint.rect(17, 12, 3, 5, COLORS.skin[0]);

  paint.rect(7 + Math.min(step, 0), 18, 7, 4, COLORS.boot[1]);
  paint.rect(14 + Math.max(step, 0), 18, 7, 4, COLORS.boot[0]);
  paint.rect(6 + Math.min(step, 0), 20, 8, 3, COLORS.iron[1]);
  paint.rect(14 + Math.max(step, 0), 20, 8, 3, COLORS.iron[0]);
  paint.rect(7 + Math.min(step, 0), 20, 6, 1, COLORS.iron[2]);
  paint.rect(15 + Math.max(step, 0), 20, 6, 1, COLORS.iron[2]);
  paint.dot(8 + Math.min(step, 0), 21, COLORS.buckle[1]);
  paint.dot(19 + Math.max(step, 0), 21, COLORS.buckle[1]);

  if (weaponRest) {
    paint.rect(18, 14, 2, 3, COLORS.skin[2]);
    paint.rect(19, 16, 2, 4, COLORS.leather[1]);
    paint.rect(19, 19, 4, 2, COLORS.iron[1]);
    paint.rect(20, 20, 3, 2, COLORS.iron[0]);
    paint.dot(22, 18, COLORS.iron[2]);
  }
}

function drawFrontAttack(paint, rear, phase) {
  drawFrontBase(paint, rear, phase.idleFrame, 0, false);
  if (phase.pose === 'brace-tool') {
    paint.rect(15, 12, 5, 4, COLORS.skin[1]);
    paint.rect(12, 14, 4, 2, COLORS.leather[1]);
    paint.rect(8, 13, 5, 3, COLORS.iron[1]);
    paint.rect(7, 12, 2, 5, COLORS.iron[0]);
    paint.dot(8, 12, COLORS.iron[2]);
  } else if (phase.pose === 'open') {
    paint.rect(15, 11, 5, 4, COLORS.skin[1]);
    paint.rect(17, 9, 2, 4, COLORS.leather[1]);
    paint.rect(18, 7, 4, 2, COLORS.iron[1]);
    paint.rect(19, 5, 2, 3, COLORS.iron[0]);
    paint.dot(22, 7, COLORS.iron[2]);
  } else if (phase.pose === 'clamp') {
    paint.rect(16, 13, 4, 4, COLORS.skin[1]);
    paint.rect(18, 15, 2, 5, COLORS.leather[1]);
    paint.rect(17, 19, 6, 2, COLORS.iron[1]);
    paint.rect(18, 20, 5, 2, COLORS.iron[0]);
    paint.dot(17, 18, COLORS.iron[2]);
  } else {
    paint.rect(15, 12, 5, 4, COLORS.skin[1]);
    paint.rect(17, 14, 2, 5, COLORS.leather[1]);
    paint.rect(18, 18, 5, 2, COLORS.iron[1]);
    paint.rect(19, 19, 4, 2, COLORS.iron[0]);
    paint.dot(18, 17, COLORS.iron[2]);
  }
}

function drawRightAttack(paint, phase) {
  drawRightBase(paint, phase.idleFrame, 0, false);
  if (phase.pose === 'brace-tool') {
    paint.rect(15, 12, 5, 4, COLORS.skin[1]);
    paint.rect(13, 14, 3, 2, COLORS.skin[2]);
    paint.rect(10, 14, 4, 2, COLORS.leather[1]);
    paint.rect(7, 13, 4, 3, COLORS.iron[1]);
    paint.rect(6, 12, 2, 5, COLORS.iron[0]);
    paint.dot(7, 12, COLORS.iron[2]);
  } else if (phase.pose === 'open') {
    paint.rect(16, 10, 4, 5, COLORS.skin[1]);
    paint.rect(18, 8, 2, 4, COLORS.leather[1]);
    paint.rect(19, 6, 4, 2, COLORS.iron[1]);
    paint.rect(20, 4, 2, 3, COLORS.iron[0]);
    paint.dot(22, 5, COLORS.iron[2]);
  } else if (phase.pose === 'clamp') {
    paint.rect(17, 13, 4, 4, COLORS.skin[1]);
    paint.rect(19, 15, 2, 5, COLORS.leather[1]);
    paint.rect(18, 19, 5, 2, COLORS.iron[1]);
    paint.rect(19, 20, 4, 2, COLORS.iron[0]);
    paint.dot(18, 18, COLORS.iron[2]);
  } else {
    paint.rect(16, 12, 5, 4, COLORS.skin[1]);
    paint.rect(18, 14, 2, 5, COLORS.leather[1]);
    paint.rect(19, 18, 4, 2, COLORS.iron[1]);
    paint.rect(20, 19, 3, 2, COLORS.iron[0]);
    paint.dot(19, 17, COLORS.iron[2]);
  }
}

function buildPixels(direction, animation, frame) {
  const canonicalDirection = direction === 'left' ? 'right' : direction;
  let phase;
  if (animation === 'idle') {
    assert(frame === 0 || frame === 1, `Ironboot Trapper Idle frame ${frame} is out of range.`);
    phase = { name: frame === 0 ? 'closed-tongs-watch' : 'riveted-cap-settle', idleFrame: frame, step: 0, dx: 0, dy: 0 };
  } else if (animation === 'walk') phase = WALK_PHASES[frame];
  else if (animation === 'attack' || animation === 'cast') phase = ATTACK_PHASES[frame];
  else if (animation === 'hurt') phase = HURT_PHASES[frame];
  else if (animation === 'death') phase = HURT_PHASES[EN_E06_IRONBOOT_TRAPPER_DEATH_SOURCE_FRAMES[frame]];
  assert(phase, `Ironboot Trapper animation ${animation} frame ${frame} is out of range.`);

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
      paint.rect(canonicalDirection === 'right' ? 11 : 7, 13, 8, 3, COLORS.coat[1]);
      paint.rect(canonicalDirection === 'right' ? 15 : 13, 15, 4, 4, COLORS.skin[1]);
      paint.rect(canonicalDirection === 'right' ? 16 : 14, 17, 4, 2, COLORS.iron[2]);
      paint.dot(canonicalDirection === 'right' ? 16 : 14, 16, COLORS.buckle[2]);
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

export function renderEnE06IronbootTrapperFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Ironboot Trapper rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), `Unsupported Ironboot Trapper direction ${direction}.`);
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'redcap', variant: 'ironboot-trapper', direction, animation, frame,
    phase: phase.name,
    ironbootTrapperGate: EN_E06_IRONBOOT_TRAPPER_GATE.id,
    approvedPrecedingGate: EN_E06_BARROW_STALKER_GATE.id,
    alphaPolicy: EN_E06_IRONBOOT_TRAPPER_DATA.alphaPolicy,
    effectBoundary: EN_E06_IRONBOOT_TRAPPER_DATA.effectBoundary,
  });
}

export const EN_E06_IRONBOOT_TRAPPER_RENDERER = deepFreeze({
  key: 'en-e06-redcap-ironboot-trapper-v1',
  chassis: EN_E06_IRONBOOT_TRAPPER_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'redcap', 'The EN-E06 Ironboot Trapper renderer is restricted to Redcap.');
    assert(variant.id === 'ironboot-trapper', 'The EN-E06 Ironboot Trapper renderer is restricted to Ironboot Trapper.');
    return renderEnE06IronbootTrapperFrame(context, direction, animation.id, frame);
  },
});

const IRONBOOT_TRAPPER_VARIANT = deepFreeze({
  id: 'ironboot-trapper',
  name: 'Ironboot Trapper',
  role: EN_E06_IRONBOOT_TRAPPER_CONTRACT.role,
  status: EN_E06_IRONBOOT_TRAPPER_CONTRACT.state,
  brief: 'A complete specialist Redcap candidate with a flat riveted cap, long ears, buckle harness, leather apron, connected trap-setting tongs, and enormous square iron boots; placed traps, snares, chains, blood, trails, chips, and dust remain external.',
  rendererData: EN_E06_IRONBOOT_TRAPPER_DATA,
});

export const EN_E06_IRONBOOT_TRAPPER_FAMILY = deepFreeze({
  id: 'redcap',
  name: 'Redcap Ironboot Trapper Review',
  sliceId: 'EN-E06',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E06_IRONBOOT_TRAPPER_CONTRACT.chassis,
  rendererKey: EN_E06_IRONBOOT_TRAPPER_RENDERER.key,
  variants: [IRONBOOT_TRAPPER_VARIANT],
  rendererData: {
    contractCard: EN_E06_REDCAP_CONTRACT_CARD.id,
    approvedPrecedingGate: EN_E06_BARROW_STALKER_GATE.id,
    activeGate: EN_E06_IRONBOOT_TRAPPER_GATE.id,
  },
  review: {
    baselineVariant: 'ironboot-trapper',
    scale: 8,
    notes: 'Awaiting visual approval for one complete grounded Ironboot Trapper against public Goblin Scout/Hobgoblin and approved Barrow Stalker. Keep Bloodcap Reaver, Nymph, registration, fixtures, effects, and later Wave 2 work separate.',
  },
});

export const EN_E06_IRONBOOT_TRAPPER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E06_IRONBOOT_TRAPPER_RENDERER],
  families: [EN_E06_IRONBOOT_TRAPPER_FAMILY],
});
