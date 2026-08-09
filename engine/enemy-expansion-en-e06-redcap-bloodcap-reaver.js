import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E06_REDCAP_CONTRACT_CARD } from './enemy-expansion-en-e06-fairy-idle.js';
import { EN_E06_BARROW_STALKER_GATE } from './enemy-expansion-en-e06-redcap-barrow-stalker.js';
import { EN_E06_IRONBOOT_TRAPPER_GATE } from './enemy-expansion-en-e06-redcap-ironboot-trapper.js';

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
  skin: ['#8d594d', '#4a2d2a', '#c27a63'],
  cap: ['#a9162e', '#4a0d1c', '#e13b43'],
  armor: ['#3b414c', '#1c2028', '#737d8b'],
  leather: ['#6b402c', '#34241e', '#a86b3d'],
  boot: ['#2e333d', '#171a20', '#5c6572'],
  iron: ['#8996a5', '#404c59', '#d5dce3'],
  buckle: ['#bb8739', '#6d4822', '#e5b957'],
  eye: '#ffd35f',
  flash: '#f4f4f4',
});

export const EN_E06_BLOODCAP_REAVER_CONTRACT = deepFreeze({
  sliceId: 'EN-E06',
  family: 'redcap',
  variant: 'bloodcap-reaver',
  role: 'elite',
  state: 'implemented-complete-motion-approved',
  chassis: 'short-broad-torncap-reaver-fey-v1',
  silhouette: 'A short, unusually broad fey with a high torn crimson cap, long ears, layered shoulder and chest armor, reinforced boots, and a connected broad cleaver. The peaked cap, armored upper mass, and cleaving poses must differ from Barrow Stalker, Ironboot Trapper, and public Goblins in every frame.',
  identity: 'Ash-red skin, a ragged blood-crimson cap, blackened steel armor, dark leather, brass fastenings, pale cleaver steel, yellow eyes, and reinforced boots establish the final elite Redcap without baking in blood, trails, chips, dust, or flashes.',
  effectBoundary: 'Blood spray, weapon trails, ground chips, grave dust, impact flashes, and detached cleaver glints remain external.',
});

export const EN_E06_BLOODCAP_REAVER_DATA = deepFreeze({
  actor: {
    species: 'fey',
    bodyBuild: 'short-broad-heavy',
    skin: 'ash-red-umber',
    hairStyle: 'none',
    hairColor: 'none',
    expression: 'forward-reaver-snarl',
    faceDetail: 'long-fey-ears',
    headgear: 'high-torn-blood-crimson-cap',
    outfit: 'layered-shoulder-and-chest-armor',
    outfitColor: 'blackened-steel-and-dark-leather',
    outfitTier: 'tier3',
    weapon: 'connected-broad-cleaver',
    weaponTier: 'steel',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.skin,
      hair: COLORS.cap,
      outfit: COLORS.armor,
    },
  },
  bloodcapReaver: COLORS,
  alphaPolicy: 'binary-connected-torn-cap-heavy-armor-cleaver-and-reinforced-boots',
  effectBoundary: 'external-blood-spray-weapon-trails-ground-chips-grave-dust-impact-flashes-and-detached-cleaver-glints',
  bakedEffects: [],
});

export const EN_E06_BLOODCAP_REAVER_GATE = deepFreeze({
  id: 'en-e06-redcap-bloodcap-reaver-full-v1',
  status: 'approved',
  baseCheckpoint: 'dc6d524ec2d7d980b5407de75a33c00af7819de7',
  authorizedOn: '2026-08-10',
  authorizationEvidence: 'After Ironboot Trapper was visually approved, committed, pushed, and reconciled at a clean published checkpoint, the designer said: cool lets do nexrt. Under the documented EN-E06 Redcap role order and one-complete-sprite cadence, this authorizes only one private elite Redcap Bloodcap Reaver 80-frame candidate.',
  approvedOn: '2026-08-10',
  approvalEvidence: 'After the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, the public Hobgoblin plus approved Barrow Stalker and Ironboot Trapper comparison, and paired GIF evidence were presented, and the three exact PNG review boards were opened together in Aseprite, the designer replied: approved. Approval applies only to candidate digest e9a41fd37e19d96911cfffee3bd89e3859f9cbb95099996632f877da2dbdabff and authorizes its bounded approval-record commit and branch publication; Nymph, registration, fixtures, effects, release, EN-E07, and later work remain separate gates.',
  publishedImplementation: '1a1ba00ea1edfa6e8bd946e95f5e35c6080ce73a',
  precedingApproval: {
    gateId: EN_E06_IRONBOOT_TRAPPER_GATE.id,
    artifactSha256: EN_E06_IRONBOOT_TRAPPER_GATE.artifactSha256,
    assembledArtifactSha256: EN_E06_IRONBOOT_TRAPPER_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E06_IRONBOOT_TRAPPER_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E06_IRONBOOT_TRAPPER_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E06_IRONBOOT_TRAPPER_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E06_IRONBOOT_TRAPPER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E06_IRONBOOT_TRAPPER_GATE.publishedImplementation,
    publishedHandoff: 'dc6d524ec2d7d980b5407de75a33c00af7819de7',
  },
  artifact: 'enemy-expansion-review/en-e06-redcap-bloodcap-reaver/en-e06-redcap-bloodcap-reaver-full-suite-raw.png',
  artifactSha256: '4a6a8f756af4992812a2884302e859da2ed0bc80feeb1810f465bae52beeee84',
  assembledArtifact: 'enemy-expansion-review/en-e06-redcap-bloodcap-reaver/en-e06-redcap-bloodcap-reaver-full-suite-complete-b-form.png',
  assembledArtifactSha256: '1b3bfcf8ada4aa9c45deb163ec80595f98598f4b5604954d5f59ed24074f9042',
  comparisonArtifact: 'enemy-expansion-review/en-e06-redcap-bloodcap-reaver/en-e06-redcap-bloodcap-reaver-hobgoblin-redcaps-comparison.png',
  comparisonArtifactSha256: '884fcc0fc3fc6ef4c700623eb1e189b6db7d9e29b426602f0a79087d2ca18b13',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e06-redcap-bloodcap-reaver/en-e06-redcap-bloodcap-reaver-full-suite-four-directions-labeled.gif',
      sha256: '2f4d7aeb3d6be6399e25de7e7cf2a48ad1dd971e27bf2ac29fa382a63e2ce25a', width: 640, height: 672, frames: 4, durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e06-redcap-bloodcap-reaver/en-e06-redcap-bloodcap-reaver-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: 'f1adf9f61c4adf3e62bff9b44e37dce5f84c054cbba6fbd6a5fba2d7e5e4640b', width: 640, height: 672, frames: 4, durationMs: 720,
    },
  },
  candidateFrameDigest: 'e9a41fd37e19d96911cfffee3bd89e3859f9cbb95099996632f877da2dbdabff',
  goblinScoutComparisonDigest: '0582534e2f5fad7ba5059fb6936e9ceafbdca9dc0bcda257a36de6f98e9eb263',
  goblinBruteComparisonDigest: 'af106609ff08f3afacbf910fc2939336f9ecbf35158c382cb453ce2b014d6483',
  barrowStalkerComparisonDigest: EN_E06_BARROW_STALKER_GATE.candidateFrameDigest,
  ironbootTrapperComparisonDigest: EN_E06_IRONBOOT_TRAPPER_GATE.candidateFrameDigest,
  scope: 'One complete 80-frame Bloodcap Reaver elite Redcap across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle settles the torn high cap and connected broad cleaver. Walk uses four heavy armored stomps with cap and shoulder lag. Attack shifts into a shoulder windup, raises the connected cleaver overhead, drives a downward hew, and holds a low recoil before recovery. Hurt uses a complete white recoil and colored armored brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and a public Hobgoblin plus approved Barrow Stalker and Ironboot Trapper silhouette comparison together.',
  exclusions: [
    'changes to approved Bramblewing Scout source or pixels',
    'changes to approved Thistle Hexer source or pixels',
    'changes to approved Petalcrown Duelist source or pixels',
    'changes to approved Hag source or pixels',
    'changes to approved Dryad source or pixels',
    'changes to approved Barrow Stalker source or pixels',
    'changes to approved Ironboot Trapper source or pixels',
    'Nymph implementation',
    'public Redcap registration',
    'public catalog exposure',
    'asset-pack fixture generation or regeneration',
    'new Cast pixels',
    'new Death pixels',
    'blood spray',
    'ground chips',
    'weapon trails',
    'grave dust',
    'impact flashes',
    'effects',
    'release',
    'later EN-E06 sprites',
    'EN-E07 and later Wave 2 work',
  ],
  nextGate: 'The exact Bloodcap Reaver candidate is visually approved and committed at 1a1ba00ea1edfa6e8bd946e95f5e35c6080ce73a. Only its bounded approval-record commit and branch publication are authorized. After push, stop; do not register Redcap, generate fixtures, begin Nymph, add effects, release, start EN-E07, or broaden Wave 2 without another explicit gate.',
});

export const EN_E06_BLOODCAP_REAVER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const WALK_PHASES = deepFreeze([
  { name: 'left-armored-stomp', idleFrame: 0, step: -1, lift: 0 },
  { name: 'shoulder-lag-pass', idleFrame: 1, step: 0, lift: -1 },
  { name: 'right-armored-stomp', idleFrame: 0, step: 1, lift: 0 },
  { name: 'low-cleaver-settle', idleFrame: 1, step: 0, lift: 0 },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'shoulder-windup', pose: 'windup', idleFrame: 1, dx: 0, dy: 0 },
  { name: 'overhead-cleaver-rise', pose: 'overhead', idleFrame: 0, dx: 0, dy: -1 },
  { name: 'downward-cleaver-hew', pose: 'hew', idleFrame: 0, dx: 0, dy: 0 },
  { name: 'low-cleaver-recoil', pose: 'recover', idleFrame: 1, dx: 0, dy: 0 },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-cap-recoil', pose: 'hurt', idleFrame: 0, dx: -1, dy: 0, flash: true },
  { name: 'colored-armored-brace', pose: 'brace', idleFrame: 1, dx: 0, dy: -1, flash: false },
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
          assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Bloodcap Reaver authored pixels must remain inside the 24x24 cell.');
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
  // High torn cap, long ears, and a wider elite face.
  paint.rect(10, 2 + capDip, 6, 2, COLORS.cap[1]);
  paint.rect(8, 4 + capDip, 9, 2, COLORS.cap[0]);
  paint.rect(6, 6 + capDip, 12, 2, COLORS.cap[0]);
  paint.rect(5, 7 + capDip, 14, 2, COLORS.cap[1]);
  paint.rect(7, 6 + capDip, 9, 1, COLORS.cap[2]);
  paint.rect(4, 7 + capDip, 2, 2, COLORS.cap[0]);
  paint.dot(3, 8 + capDip, COLORS.cap[1]);
  paint.dot(18, 6 + capDip, COLORS.cap[2]);
  paint.rect(7, 8, 10, 3, rear ? COLORS.skin[1] : COLORS.skin[0]);
  paint.rect(4, 9, 4, 2, COLORS.skin[1]);
  paint.rect(16, 9, 4, 2, COLORS.skin[1]);
  paint.dot(3, 10, COLORS.skin[2]);
  paint.dot(20, 10, COLORS.skin[2]);
  if (rear) {
    // Connected cap tail makes every Up alpha silhouette distinct from Down.
    paint.rect(18, 7 + capDip, 3, 2, COLORS.cap[0]);
    paint.dot(21, 8 + capDip, COLORS.cap[1]);
    paint.rect(8, 8, 8, 2, COLORS.cap[1]);
    paint.rect(10, 10, 4, 1, COLORS.cap[0]);
  } else {
    paint.pairDot(9, 9, COLORS.eye);
    paint.rect(10, 10, 4, 1, COLORS.skin[1]);
  }

  // Layered pauldrons and chest plate create the elite upper-body mass.
  paint.rect(5, 10, 14, 3, COLORS.armor[1]);
  paint.rect(3, 11, 5, 4, COLORS.armor[0]);
  paint.rect(16, 11, 5, 4, COLORS.armor[0]);
  paint.rect(4, 12, 3, 2, COLORS.armor[2]);
  paint.rect(17, 12, 3, 2, COLORS.armor[2]);
  paint.rect(6, 12, 12, 6, COLORS.armor[0]);
  paint.rect(8, 12, 8, 2, COLORS.armor[2]);
  paint.rect(9, 14, 6, 4, COLORS.armor[1]);
  paint.rect(7, 16, 10, 3, COLORS.leather[0]);
  paint.rect(10, 16, 4, 3, COLORS.leather[2]);
  paint.rect(11, 15, 2, 2, COLORS.buckle[2]);
  paint.rect(3, 14, 4, 4, COLORS.skin[1]);
  paint.rect(17, 14, 4, 4, COLORS.skin[0]);

  // Reinforced boots stay broad but read as plated rather than square trapper blocks.
  paint.rect(5 + Math.min(step, 0), 18, 7, 4, COLORS.boot[1]);
  paint.rect(12 + Math.max(step, 0), 18, 7, 4, COLORS.boot[0]);
  paint.rect(4 + Math.min(step, 0), 20, 8, 3, COLORS.armor[1]);
  paint.rect(12 + Math.max(step, 0), 20, 8, 3, COLORS.armor[0]);
  paint.rect(5 + Math.min(step, 0), 20, 6, 1, COLORS.armor[2]);
  paint.rect(13 + Math.max(step, 0), 20, 6, 1, COLORS.armor[2]);
  paint.rect(7 + Math.min(step, 0), 21, 2, 1, COLORS.buckle[1]);
  paint.rect(15 + Math.max(step, 0), 21, 2, 1, COLORS.buckle[1]);

  // The resting broad cleaver is connected continuously through hand and hilt.
  if (weaponRest) {
    paint.rect(18, 14, 3, 4, COLORS.skin[2]);
    paint.rect(19, 17, 2, 4, COLORS.leather[1]);
    paint.rect(20, 18, 3, 4, COLORS.iron[1]);
    paint.rect(21, 17, 2, 4, COLORS.iron[0]);
    paint.rect(20, 18, 2, 1, COLORS.iron[2]);
  }
}

function drawRightBase(paint, idleFrame, step = 0, weaponRest = true) {
  const capDip = idleFrame;
  // Peaked torn cap with a long rear rag and forward fey profile.
  paint.rect(11, 2 + capDip, 6, 2, COLORS.cap[1]);
  paint.rect(8, 4 + capDip, 10, 2, COLORS.cap[0]);
  paint.rect(6, 6 + capDip, 13, 2, COLORS.cap[0]);
  paint.rect(4, 7 + capDip, 16, 2, COLORS.cap[1]);
  paint.rect(3, 6 + capDip, 4, 2, COLORS.cap[0]);
  paint.dot(2, 6 + capDip, COLORS.cap[1]);
  paint.rect(8, 6 + capDip, 9, 1, COLORS.cap[2]);
  paint.rect(8, 8, 10, 3, COLORS.skin[0]);
  paint.rect(5, 9, 4, 2, COLORS.skin[1]);
  paint.dot(4, 10, COLORS.skin[2]);
  paint.rect(16, 9, 4, 2, COLORS.skin[1]);
  paint.dot(17, 9, COLORS.eye);
  paint.dot(20, 10, COLORS.skin[2]);

  paint.rect(6, 10, 14, 3, COLORS.armor[1]);
  paint.rect(4, 11, 5, 4, COLORS.armor[0]);
  paint.rect(16, 11, 5, 4, COLORS.armor[0]);
  paint.rect(5, 12, 3, 2, COLORS.armor[2]);
  paint.rect(17, 12, 3, 2, COLORS.armor[2]);
  paint.rect(7, 12, 13, 6, COLORS.armor[0]);
  paint.rect(9, 12, 9, 2, COLORS.armor[2]);
  paint.rect(11, 14, 7, 4, COLORS.armor[1]);
  paint.rect(8, 16, 11, 3, COLORS.leather[0]);
  paint.rect(12, 16, 5, 3, COLORS.leather[2]);
  paint.rect(13, 15, 2, 2, COLORS.buckle[2]);
  paint.rect(4, 14, 4, 4, COLORS.skin[1]);
  paint.rect(18, 14, 3, 4, COLORS.skin[0]);

  paint.rect(7 + Math.min(step, 0), 18, 7, 4, COLORS.boot[1]);
  paint.rect(14 + Math.max(step, 0), 18, 7, 4, COLORS.boot[0]);
  paint.rect(6 + Math.min(step, 0), 20, 8, 3, COLORS.armor[1]);
  paint.rect(14 + Math.max(step, 0), 20, 8, 3, COLORS.armor[0]);
  paint.rect(7 + Math.min(step, 0), 20, 6, 1, COLORS.armor[2]);
  paint.rect(15 + Math.max(step, 0), 20, 6, 1, COLORS.armor[2]);
  paint.rect(8 + Math.min(step, 0), 21, 2, 1, COLORS.buckle[1]);
  paint.rect(18 + Math.max(step, 0), 21, 2, 1, COLORS.buckle[1]);

  if (weaponRest) {
    paint.rect(19, 14, 2, 4, COLORS.skin[2]);
    paint.rect(20, 17, 2, 4, COLORS.leather[1]);
    paint.rect(21, 17, 2, 5, COLORS.iron[1]);
    paint.rect(22, 16, 1, 5, COLORS.iron[0]);
    paint.rect(21, 17, 2, 1, COLORS.iron[2]);
  }
}

function drawFrontAttack(paint, rear, phase) {
  drawFrontBase(paint, rear, phase.idleFrame, 0, false);
  if (phase.pose === 'windup') {
    paint.rect(4, 13, 6, 4, COLORS.skin[1]);
    paint.rect(7, 14, 6, 2, COLORS.leather[1]);
    paint.rect(3, 12, 5, 5, COLORS.iron[1]);
    paint.rect(2, 11, 3, 6, COLORS.iron[0]);
    paint.rect(3, 12, 4, 1, COLORS.iron[2]);
  } else if (phase.pose === 'overhead') {
    paint.rect(15, 10, 5, 4, COLORS.skin[1]);
    paint.rect(17, 7, 2, 5, COLORS.leather[1]);
    paint.rect(18, 3, 3, 6, COLORS.iron[1]);
    paint.rect(19, 2, 4, 5, COLORS.iron[0]);
    paint.rect(18, 3, 4, 1, COLORS.iron[2]);
  } else if (phase.pose === 'hew') {
    paint.rect(16, 13, 5, 4, COLORS.skin[1]);
    paint.rect(18, 15, 2, 5, COLORS.leather[1]);
    paint.rect(19, 18, 4, 4, COLORS.iron[1]);
    paint.rect(20, 17, 3, 5, COLORS.iron[0]);
    paint.rect(19, 18, 3, 1, COLORS.iron[2]);
  } else {
    paint.rect(15, 13, 6, 4, COLORS.skin[1]);
    paint.rect(17, 15, 4, 2, COLORS.leather[1]);
    paint.rect(19, 16, 4, 4, COLORS.iron[1]);
    paint.rect(20, 17, 3, 4, COLORS.iron[0]);
    paint.rect(19, 16, 3, 1, COLORS.iron[2]);
  }
}

function drawRightAttack(paint, phase) {
  drawRightBase(paint, phase.idleFrame, 0, false);
  if (phase.pose === 'windup') {
    paint.rect(7, 13, 6, 4, COLORS.skin[1]);
    paint.rect(10, 14, 6, 2, COLORS.leather[1]);
    paint.rect(4, 12, 5, 5, COLORS.iron[1]);
    paint.rect(3, 11, 3, 6, COLORS.iron[0]);
    paint.rect(4, 12, 4, 1, COLORS.iron[2]);
  } else if (phase.pose === 'overhead') {
    paint.rect(16, 10, 4, 5, COLORS.skin[1]);
    paint.rect(18, 7, 2, 5, COLORS.leather[1]);
    paint.rect(19, 3, 3, 6, COLORS.iron[1]);
    paint.rect(20, 2, 3, 5, COLORS.iron[0]);
    paint.rect(19, 3, 3, 1, COLORS.iron[2]);
  } else if (phase.pose === 'hew') {
    paint.rect(17, 13, 5, 4, COLORS.skin[1]);
    paint.rect(19, 15, 2, 5, COLORS.leather[1]);
    paint.rect(20, 18, 3, 4, COLORS.iron[1]);
    paint.rect(21, 17, 2, 5, COLORS.iron[0]);
    paint.rect(20, 18, 3, 1, COLORS.iron[2]);
  } else {
    paint.rect(16, 13, 6, 4, COLORS.skin[1]);
    paint.rect(18, 15, 3, 2, COLORS.leather[1]);
    paint.rect(20, 16, 3, 4, COLORS.iron[1]);
    paint.rect(21, 17, 2, 4, COLORS.iron[0]);
    paint.rect(20, 16, 3, 1, COLORS.iron[2]);
  }
}

function buildPixels(direction, animation, frame) {
  const canonicalDirection = direction === 'left' ? 'right' : direction;
  let phase;
  if (animation === 'idle') {
    assert(frame === 0 || frame === 1, `Bloodcap Reaver Idle frame ${frame} is out of range.`);
    phase = { name: frame === 0 ? 'low-cleaver-watch' : 'torn-cap-settle', idleFrame: frame, step: 0, dx: 0, dy: 0 };
  } else if (animation === 'walk') phase = WALK_PHASES[frame];
  else if (animation === 'attack' || animation === 'cast') phase = ATTACK_PHASES[frame];
  else if (animation === 'hurt') phase = HURT_PHASES[frame];
  else if (animation === 'death') phase = HURT_PHASES[EN_E06_BLOODCAP_REAVER_DEATH_SOURCE_FRAMES[frame]];
  assert(phase, `Bloodcap Reaver animation ${animation} frame ${frame} is out of range.`);

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
      paint.rect(canonicalDirection === 'right' ? 11 : 7, 13, 8, 3, COLORS.armor[1]);
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

export function renderEnE06BloodcapReaverFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Bloodcap Reaver rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), `Unsupported Bloodcap Reaver direction ${direction}.`);
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'redcap', variant: 'bloodcap-reaver', direction, animation, frame,
    phase: phase.name,
    bloodcapReaverGate: EN_E06_BLOODCAP_REAVER_GATE.id,
    approvedPrecedingGate: EN_E06_IRONBOOT_TRAPPER_GATE.id,
    alphaPolicy: EN_E06_BLOODCAP_REAVER_DATA.alphaPolicy,
    effectBoundary: EN_E06_BLOODCAP_REAVER_DATA.effectBoundary,
  });
}

export const EN_E06_BLOODCAP_REAVER_RENDERER = deepFreeze({
  key: 'en-e06-redcap-bloodcap-reaver-v1',
  chassis: EN_E06_BLOODCAP_REAVER_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'redcap', 'The EN-E06 Bloodcap Reaver renderer is restricted to Redcap.');
    assert(variant.id === 'bloodcap-reaver', 'The EN-E06 Bloodcap Reaver renderer is restricted to Bloodcap Reaver.');
    return renderEnE06BloodcapReaverFrame(context, direction, animation.id, frame);
  },
});

const BLOODCAP_REAVER_VARIANT = deepFreeze({
  id: 'bloodcap-reaver',
  name: 'Bloodcap Reaver',
  role: EN_E06_BLOODCAP_REAVER_CONTRACT.role,
  status: EN_E06_BLOODCAP_REAVER_CONTRACT.state,
  brief: 'A complete elite Redcap candidate with a high torn crimson cap, long ears, layered shoulder and chest armor, reinforced boots, and a connected broad cleaver; blood, trails, chips, dust, flashes, and detached glints remain external.',
  rendererData: EN_E06_BLOODCAP_REAVER_DATA,
});

export const EN_E06_BLOODCAP_REAVER_FAMILY = deepFreeze({
  id: 'redcap',
  name: 'Redcap Bloodcap Reaver Review',
  sliceId: 'EN-E06',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E06_BLOODCAP_REAVER_CONTRACT.chassis,
  rendererKey: EN_E06_BLOODCAP_REAVER_RENDERER.key,
  variants: [BLOODCAP_REAVER_VARIANT],
  rendererData: {
    contractCard: EN_E06_REDCAP_CONTRACT_CARD.id,
    approvedPrecedingGate: EN_E06_IRONBOOT_TRAPPER_GATE.id,
    activeGate: EN_E06_BLOODCAP_REAVER_GATE.id,
  },
  review: {
    baselineVariant: 'bloodcap-reaver',
    scale: 8,
    notes: 'Awaiting visual approval for one complete grounded Bloodcap Reaver against public Hobgoblin and approved Barrow Stalker and Ironboot Trapper. Keep Nymph, registration, fixtures, effects, and later Wave 2 work separate.',
  },
});

export const EN_E06_BLOODCAP_REAVER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E06_BLOODCAP_REAVER_RENDERER],
  families: [EN_E06_BLOODCAP_REAVER_FAMILY],
});
