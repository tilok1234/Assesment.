import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E06_NYMPH_CONTRACT_CARD } from './enemy-expansion-en-e06-fairy-idle.js';
import { EN_E06_FAIRY_GATE } from './enemy-expansion-en-e06-fairy.js';
import { EN_E06_GROVE_TENDER_GATE } from './enemy-expansion-en-e06-dryad-grove-tender.js';
import { EN_E06_BLOODCAP_REAVER_GATE } from './enemy-expansion-en-e06-redcap-bloodcap-reaver.js';

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
  skin: ['#efc6a5', '#b77f69', '#ffe1c2'],
  hair: ['#4b8f76', '#28584e', '#86c9a7'],
  dress: ['#69b985', '#2f7058', '#a7dda4'],
  ribbon: ['#ed8eb2', '#a64d76', '#ffd0df'],
  leaf: ['#79a94c', '#3f6935', '#b4d769'],
  sandal: ['#704c3a', '#3a2b26', '#a67a51'],
  gold: ['#d5ad4f', '#89602a', '#f2d778'],
  eye: '#5f3b75',
  flash: '#f4f4f4',
});

export const EN_E06_SPRING_DANCER_CONTRACT = deepFreeze({
  sliceId: 'EN-E06',
  family: 'nymph',
  variant: 'spring-dancer',
  role: 'common',
  state: 'implemented-complete-motion-approved',
  chassis: 'slender-flowing-hair-ribbon-dress-nymph-v1',
  silhouette: 'A clear slender humanoid fey with long flowing hair, pointed ears, open arms, a leaf-fastened ribbon-edged dress, and light split-foot dance steps. Hair fall, flared skirt, and sweeping arm poses must differ from public Elves, approved Fairies, and approved Dryads in every frame.',
  identity: 'Warm spring skin, willow-green hair, fresh-leaf dress planes, rose ribbon edging, leaf accents, gold fasteners, and light sandals establish a grounded common Nymph without baking in petals, mist, water, pollen, sparkles, or detached trails.',
  effectBoundary: 'Petals, pollen, mist, water ribbons, detached cloth trails, sparkles, impact flashes, and ground motes remain external.',
});

export const EN_E06_SPRING_DANCER_DATA = deepFreeze({
  actor: {
    species: 'fey',
    bodyBuild: 'slender-humanoid',
    skin: 'warm-spring',
    hairStyle: 'long-flowing-willow',
    hairColor: 'willow-green',
    expression: 'calm-dancer-focus',
    faceDetail: 'pointed-fey-ears',
    headgear: 'leaf-and-gold-hair-clasp',
    outfit: 'ribbon-edged-leaf-dress',
    outfitColor: 'spring-green-and-rose',
    outfitTier: 'tier1',
    weapon: 'none',
    weaponTier: 'none',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.skin,
      hair: COLORS.hair,
      outfit: COLORS.dress,
    },
  },
  springDancer: COLORS,
  alphaPolicy: 'binary-connected-flowing-hair-open-arms-ribbon-dress-and-light-feet',
  effectBoundary: 'external-petals-pollen-mist-water-ribbons-detached-cloth-trails-sparkles-impact-flashes-and-ground-motes',
  bakedEffects: [],
});

export const EN_E06_SPRING_DANCER_GATE = deepFreeze({
  id: 'en-e06-nymph-spring-dancer-full-v1',
  status: 'approved',
  baseCheckpoint: 'f4ac500d39da0ac2ecd033c939ac582d06c2d052',
  authorizedOn: '2026-08-10',
  authorizationEvidence: 'After Bloodcap Reaver was visually approved, committed, pushed, and reconciled at a clean published checkpoint, the designer said: lets do next. Under the documented EN-E06 family order, Nymph role order, and one-complete-sprite cadence, this authorizes only one private common Nymph Spring Dancer 80-frame candidate.',
  approvedOn: '2026-08-10',
  approvalEvidence: 'After the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, the public Elf Mage plus approved Bramblewing Scout and Grove Tender comparison, and paired GIF evidence were presented, and the three exact PNG review boards were opened together in Aseprite, the designer replied: approved. Approval applies only to candidate digest b68906d962e16611384e419610324c6a9934d63ab329963f0734e83255dabe8c and authorizes its bounded approval-record commit and branch publication; Mist Weaver, Rivercrown Muse, Nymph registration, fixtures, effects, release, EN-E07, and later work remain separate gates.',
  publishedImplementation: '9d6366b0c5456704137aadfbbec9a67eccb5fd7c',
  precedingApproval: {
    gateId: EN_E06_BLOODCAP_REAVER_GATE.id,
    artifactSha256: EN_E06_BLOODCAP_REAVER_GATE.artifactSha256,
    assembledArtifactSha256: EN_E06_BLOODCAP_REAVER_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E06_BLOODCAP_REAVER_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E06_BLOODCAP_REAVER_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E06_BLOODCAP_REAVER_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E06_BLOODCAP_REAVER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E06_BLOODCAP_REAVER_GATE.publishedImplementation,
    publishedHandoff: 'f4ac500d39da0ac2ecd033c939ac582d06c2d052',
  },
  artifact: 'enemy-expansion-review/en-e06-nymph-spring-dancer/en-e06-nymph-spring-dancer-full-suite-raw.png',
  artifactSha256: '164692c6da7c4a13c727b604f685822ea840933f1e2806252e34c5cf9032ee49',
  assembledArtifact: 'enemy-expansion-review/en-e06-nymph-spring-dancer/en-e06-nymph-spring-dancer-full-suite-complete-b-form.png',
  assembledArtifactSha256: '7642821fc8b740a5611bb0ae7746bfd5f1197b209193b74513760ccc9f7d9ab9',
  comparisonArtifact: 'enemy-expansion-review/en-e06-nymph-spring-dancer/en-e06-nymph-spring-dancer-elf-fey-comparison.png',
  comparisonArtifactSha256: '02c05bddc2a5a53e5441a28899318142f715e3a45c5895e7e3c2bcf561b22dc0',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e06-nymph-spring-dancer/en-e06-nymph-spring-dancer-full-suite-four-directions-labeled.gif',
      sha256: 'b9bb2cd24936d5cf9e82ce4f683793e5df935821d2d455aedd52778cdcbff391', width: 640, height: 672, frames: 4, durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e06-nymph-spring-dancer/en-e06-nymph-spring-dancer-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '67525a5e02a599a8ff1b7885b86ab42b0f2ec1ebd90811cf8b3ee5537c8f6f17', width: 640, height: 672, frames: 4, durationMs: 720,
    },
  },
  candidateFrameDigest: 'b68906d962e16611384e419610324c6a9934d63ab329963f0734e83255dabe8c',
  elfMageComparisonDigest: 'f5924562a9d264bf2950c324fc3b6eb0560391a39e81bf4bd8ab5ed9d5987679',
  bramblewingScoutComparisonDigest: EN_E06_FAIRY_GATE.candidateFrameDigest,
  groveTenderComparisonDigest: EN_E06_GROVE_TENDER_GATE.candidateFrameDigest,
  scope: 'One complete 80-frame Spring Dancer common Nymph across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle sways the connected long hair and ribbon-edged dress. Walk uses four light dance steps with alternating skirt and hair lag. Attack opens into a low sweep, turns the arms overhead, extends a forward fan, and settles through a low ribbon-edged recovery without detached pixels. Hurt uses a complete white recoil and colored dress brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and a public Elf Mage plus approved Bramblewing Scout and Grove Tender silhouette comparison together.',
  exclusions: [
    'changes to approved Bramblewing Scout source or pixels',
    'changes to approved Thistle Hexer source or pixels',
    'changes to approved Petalcrown Duelist source or pixels',
    'changes to approved Hag source or pixels',
    'changes to approved Dryad source or pixels',
    'changes to approved Barrow Stalker source or pixels',
    'changes to approved Ironboot Trapper source or pixels',
    'changes to approved Bloodcap Reaver source or pixels',
    'Mist Weaver implementation',
    'Rivercrown Muse implementation',
    'public Nymph registration',
    'public catalog exposure',
    'asset-pack fixture generation or regeneration',
    'new Cast pixels',
    'new Death pixels',
    'petals',
    'pollen',
    'mist',
    'water ribbons',
    'detached cloth trails',
    'sparkles',
    'ground motes',
    'impact flashes',
    'effects',
    'release',
    'later EN-E06 sprites',
    'EN-E07 and later Wave 2 work',
  ],
  nextGate: 'The exact Spring Dancer candidate is visually approved and committed at 9d6366b0c5456704137aadfbbec9a67eccb5fd7c. Only its bounded approval-record commit and branch publication are authorized. After push, stop; do not register Nymph, generate fixtures, begin Mist Weaver or Rivercrown Muse, add effects, release, start EN-E07, or broaden Wave 2 without another explicit gate.',
});

export const EN_E06_SPRING_DANCER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const WALK_PHASES = deepFreeze([
  { name: 'left-dance-step', idleFrame: 0, step: -1, lift: 0 },
  { name: 'ribbon-pass', idleFrame: 1, step: 0, lift: -1 },
  { name: 'right-dance-step', idleFrame: 0, step: 1, lift: 0 },
  { name: 'hair-skirt-settle', idleFrame: 1, step: 0, lift: 0 },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'low-arm-sweep', pose: 'sweep', idleFrame: 1, dx: 0, dy: 0 },
  { name: 'overhead-turn', pose: 'overhead', idleFrame: 0, dx: 0, dy: -1 },
  { name: 'forward-ribbon-fan', pose: 'fan', idleFrame: 0, dx: 0, dy: 0 },
  { name: 'low-dance-recovery', pose: 'recover', idleFrame: 1, dx: 0, dy: 0 },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-hair-recoil', pose: 'hurt', idleFrame: 0, dx: 0, dy: 0, flash: true },
  { name: 'colored-dress-brace', pose: 'brace', idleFrame: 1, dx: 0, dy: -1, flash: false },
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
          assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Spring Dancer authored pixels must remain inside the 24x24 cell.');
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
  const sway = idleFrame;
  // Willow hair canopy, pointed ears, and a clear humanoid face.
  paint.rect(9, 2 + sway, 6, 2, COLORS.hair[1]);
  paint.rect(7, 4 + sway, 10, 3, COLORS.hair[0]);
  paint.rect(6, 6 + sway, 12, 2, COLORS.hair[2]);
  paint.rect(7, 7, 10, 4, rear ? COLORS.hair[1] : COLORS.skin[0]);
  paint.rect(5, 7, 3, 8, COLORS.hair[1]);
  paint.rect(16, 7, 3, 8, COLORS.hair[0]);
  paint.rect(4, 8, 3, 2, COLORS.skin[1]);
  paint.rect(17, 8, 3, 2, COLORS.skin[1]);
  paint.dot(3, 9, COLORS.skin[2]);
  paint.dot(20, 9, COLORS.skin[2]);
  if (rear) {
    // Connected rear hair sweep keeps every Up alpha silhouette distinct.
    paint.rect(4, 10 + sway, 3, 6, COLORS.hair[0]);
    paint.dot(3, 15 + sway, COLORS.hair[1]);
    paint.rect(8, 8, 8, 4, COLORS.hair[1]);
    paint.rect(10, 10, 4, 3, COLORS.hair[0]);
  } else {
    paint.pairDot(9, 8, COLORS.eye);
    paint.rect(10, 10, 4, 1, COLORS.skin[1]);
  }

  // Open shoulders, fitted bodice, and leaf-fastened ribbon dress.
  paint.rect(7, 10, 10, 4, COLORS.dress[1]);
  paint.rect(8, 11, 8, 3, COLORS.dress[2]);
  paint.rect(5, 11, 3, 6, COLORS.skin[0]);
  paint.rect(16, 11, 3, 6, COLORS.skin[1]);
  paint.rect(4, 15, 3, 3, COLORS.skin[2]);
  paint.rect(17, 15, 3, 3, COLORS.skin[2]);
  paint.rect(8, 13, 8, 3, COLORS.dress[0]);
  paint.rect(7, 15, 10, 3, COLORS.dress[0]);
  paint.rect(6, 17, 12, 3, COLORS.dress[1]);
  paint.rect(5, 19, 14, 2, COLORS.dress[0]);
  paint.rect(5, 20, 5, 1, COLORS.ribbon[0]);
  paint.rect(10, 20, 4, 1, COLORS.ribbon[2]);
  paint.rect(14, 20, 5, 1, COLORS.ribbon[0]);
  paint.rect(9, 13, 3, 2, COLORS.leaf[0]);
  paint.rect(12, 14, 3, 2, COLORS.leaf[2]);
  paint.dot(12, 13, COLORS.gold[2]);

  // Light split-foot stance remains grounded while retaining dance readability.
  paint.rect(7 + Math.min(step, 0), 20, 4, 3, COLORS.skin[1]);
  paint.rect(13 + Math.max(step, 0), 20, 4, 3, COLORS.skin[0]);
  paint.rect(6 + Math.min(step, 0), 22, 5, 1, COLORS.sandal[1]);
  paint.rect(13 + Math.max(step, 0), 22, 5, 1, COLORS.sandal[0]);
  paint.rect(7 + Math.min(step, 0), 21, 3, 1, COLORS.sandal[2]);
  paint.rect(14 + Math.max(step, 0), 21, 3, 1, COLORS.sandal[2]);

  // A connected rose ribbon end sways with the dress; detached trails stay external.
  if (weaponRest) {
    paint.rect(18, 17, 3, 2, COLORS.ribbon[1]);
    paint.rect(20, 18 + sway, 3, 2, COLORS.ribbon[0]);
    paint.dot(22, 19 + sway, COLORS.ribbon[2]);
  }
}

function drawRightBase(paint, idleFrame, step = 0, weaponRest = true) {
  const sway = idleFrame;
  // Long hair streams behind a clear pointed-ear profile.
  paint.rect(11, 2 + sway, 5, 2, COLORS.hair[1]);
  paint.rect(8, 4 + sway, 9, 3, COLORS.hair[0]);
  paint.rect(5, 6 + sway, 12, 2, COLORS.hair[2]);
  paint.rect(3, 7, 7, 7, COLORS.hair[1]);
  paint.rect(2, 11 + sway, 5, 5, COLORS.hair[0]);
  paint.dot(1, 15 + sway, COLORS.hair[1]);
  paint.rect(9, 7, 9, 4, COLORS.skin[0]);
  paint.rect(16, 8, 4, 2, COLORS.skin[1]);
  paint.dot(17, 8, COLORS.eye);
  paint.dot(20, 9, COLORS.skin[2]);
  paint.rect(7, 10, 11, 4, COLORS.dress[1]);
  paint.rect(9, 11, 8, 3, COLORS.dress[2]);
  paint.rect(6, 11, 3, 6, COLORS.skin[1]);
  paint.rect(17, 11, 3, 6, COLORS.skin[0]);
  paint.rect(5, 15, 3, 3, COLORS.skin[2]);
  paint.rect(18, 15, 3, 3, COLORS.skin[2]);
  paint.rect(8, 13, 10, 4, COLORS.dress[0]);
  paint.rect(7, 16, 12, 4, COLORS.dress[1]);
  paint.rect(6, 19, 14, 2, COLORS.dress[0]);
  paint.rect(6, 20, 5, 1, COLORS.ribbon[0]);
  paint.rect(11, 20, 4, 1, COLORS.ribbon[2]);
  paint.rect(15, 20, 5, 1, COLORS.ribbon[0]);
  paint.rect(10, 13, 3, 2, COLORS.leaf[0]);
  paint.rect(13, 14, 3, 2, COLORS.leaf[2]);
  paint.dot(13, 13, COLORS.gold[2]);

  paint.rect(8 + Math.min(step, 0), 20, 4, 3, COLORS.skin[1]);
  paint.rect(14 + Math.max(step, 0), 20, 4, 3, COLORS.skin[0]);
  paint.rect(7 + Math.min(step, 0), 22, 5, 1, COLORS.sandal[1]);
  paint.rect(14 + Math.max(step, 0), 22, 5, 1, COLORS.sandal[0]);
  paint.rect(8 + Math.min(step, 0), 21, 3, 1, COLORS.sandal[2]);
  paint.rect(15 + Math.max(step, 0), 21, 3, 1, COLORS.sandal[2]);

  if (weaponRest) {
    paint.rect(18, 17, 3, 2, COLORS.ribbon[1]);
    paint.rect(20, 18 + sway, 3, 2, COLORS.ribbon[0]);
    paint.dot(22, 19 + sway, COLORS.ribbon[2]);
  }
}

function drawFrontAttack(paint, rear, phase) {
  drawFrontBase(paint, rear, phase.idleFrame, 0, false);
  if (phase.pose === 'sweep') {
    paint.rect(3, 13, 7, 3, COLORS.skin[1]);
    paint.rect(2, 14, 5, 3, COLORS.skin[2]);
    paint.rect(1, 16, 5, 2, COLORS.ribbon[1]);
    paint.rect(2, 17, 4, 1, COLORS.ribbon[2]);
  } else if (phase.pose === 'overhead') {
    paint.rect(6, 7, 4, 6, COLORS.skin[1]);
    paint.rect(14, 7, 4, 6, COLORS.skin[0]);
    paint.rect(7, 5, 4, 3, COLORS.skin[2]);
    paint.rect(13, 5, 4, 3, COLORS.skin[2]);
    paint.rect(8, 4, 8, 2, COLORS.ribbon[0]);
    paint.rect(10, 3, 4, 2, COLORS.ribbon[2]);
  } else if (phase.pose === 'fan') {
    paint.rect(15, 11, 6, 4, COLORS.skin[0]);
    paint.rect(19, 12, 4, 3, COLORS.skin[2]);
    paint.rect(20, 14, 3, 3, COLORS.ribbon[0]);
    paint.rect(21, 16, 2, 2, COLORS.ribbon[2]);
  } else {
    paint.rect(14, 14, 7, 3, COLORS.skin[1]);
    paint.rect(19, 16, 4, 2, COLORS.ribbon[1]);
    paint.rect(20, 18, 3, 2, COLORS.ribbon[0]);
    paint.dot(22, 19, COLORS.ribbon[2]);
  }
}

function drawRightAttack(paint, phase) {
  drawRightBase(paint, phase.idleFrame, 0, false);
  if (phase.pose === 'sweep') {
    paint.rect(4, 13, 8, 3, COLORS.skin[1]);
    paint.rect(2, 14, 5, 3, COLORS.skin[2]);
    paint.rect(1, 16, 5, 2, COLORS.ribbon[1]);
    paint.rect(2, 17, 4, 1, COLORS.ribbon[2]);
  } else if (phase.pose === 'overhead') {
    paint.rect(8, 7, 4, 6, COLORS.skin[1]);
    paint.rect(15, 7, 4, 6, COLORS.skin[0]);
    paint.rect(9, 5, 4, 3, COLORS.skin[2]);
    paint.rect(14, 5, 4, 3, COLORS.skin[2]);
    paint.rect(10, 4, 7, 2, COLORS.ribbon[0]);
    paint.rect(12, 3, 4, 2, COLORS.ribbon[2]);
  } else if (phase.pose === 'fan') {
    paint.rect(16, 11, 6, 4, COLORS.skin[0]);
    paint.rect(19, 12, 4, 3, COLORS.skin[2]);
    paint.rect(20, 14, 3, 3, COLORS.ribbon[0]);
    paint.rect(21, 16, 2, 2, COLORS.ribbon[2]);
  } else {
    paint.rect(15, 14, 7, 3, COLORS.skin[1]);
    paint.rect(19, 16, 4, 2, COLORS.ribbon[1]);
    paint.rect(20, 18, 3, 2, COLORS.ribbon[0]);
    paint.dot(22, 19, COLORS.ribbon[2]);
  }
}

function buildPixels(direction, animation, frame) {
  const canonicalDirection = direction === 'left' ? 'right' : direction;
  let phase;
  if (animation === 'idle') {
    assert(frame === 0 || frame === 1, `Spring Dancer Idle frame ${frame} is out of range.`);
    phase = { name: frame === 0 ? 'hair-ribbon-poise' : 'spring-dress-sway', idleFrame: frame, step: 0, dx: 0, dy: 0 };
  } else if (animation === 'walk') phase = WALK_PHASES[frame];
  else if (animation === 'attack' || animation === 'cast') phase = ATTACK_PHASES[frame];
  else if (animation === 'hurt') phase = HURT_PHASES[frame];
  else if (animation === 'death') phase = HURT_PHASES[EN_E06_SPRING_DANCER_DEATH_SOURCE_FRAMES[frame]];
  assert(phase, `Spring Dancer animation ${animation} frame ${frame} is out of range.`);

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
      paint.rect(canonicalDirection === 'right' ? 11 : 7, 13, 8, 3, COLORS.dress[1]);
      paint.rect(canonicalDirection === 'right' ? 15 : 13, 15, 4, 4, COLORS.skin[1]);
      paint.rect(canonicalDirection === 'right' ? 16 : 14, 17, 4, 2, COLORS.ribbon[2]);
      paint.dot(canonicalDirection === 'right' ? 16 : 14, 16, COLORS.gold[2]);
      paint.rect(canonicalDirection === 'right' ? 10 : 9, 14, 3, 2, COLORS.leaf[0]);
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

export function renderEnE06SpringDancerFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Spring Dancer rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), `Unsupported Spring Dancer direction ${direction}.`);
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'nymph', variant: 'spring-dancer', direction, animation, frame,
    phase: phase.name,
    springDancerGate: EN_E06_SPRING_DANCER_GATE.id,
    approvedPrecedingGate: EN_E06_BLOODCAP_REAVER_GATE.id,
    alphaPolicy: EN_E06_SPRING_DANCER_DATA.alphaPolicy,
    effectBoundary: EN_E06_SPRING_DANCER_DATA.effectBoundary,
  });
}

export const EN_E06_SPRING_DANCER_RENDERER = deepFreeze({
  key: 'en-e06-nymph-spring-dancer-v1',
  chassis: EN_E06_SPRING_DANCER_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'nymph', 'The EN-E06 Spring Dancer renderer is restricted to Nymph.');
    assert(variant.id === 'spring-dancer', 'The EN-E06 Spring Dancer renderer is restricted to Spring Dancer.');
    return renderEnE06SpringDancerFrame(context, direction, animation.id, frame);
  },
});

const SPRING_DANCER_VARIANT = deepFreeze({
  id: 'spring-dancer',
  name: 'Spring Dancer',
  role: EN_E06_SPRING_DANCER_CONTRACT.role,
  status: EN_E06_SPRING_DANCER_CONTRACT.state,
  brief: 'A complete common Nymph candidate with flowing willow hair, pointed ears, open arms, a leaf-fastened ribbon-edged dress, and light split-foot dance steps; petals, mist, water ribbons, sparkles, and detached trails remain external.',
  rendererData: EN_E06_SPRING_DANCER_DATA,
});

export const EN_E06_SPRING_DANCER_FAMILY = deepFreeze({
  id: 'nymph',
  name: 'Nymph Spring Dancer Review',
  sliceId: 'EN-E06',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E06_SPRING_DANCER_CONTRACT.chassis,
  rendererKey: EN_E06_SPRING_DANCER_RENDERER.key,
  variants: [SPRING_DANCER_VARIANT],
  rendererData: {
    contractCard: EN_E06_NYMPH_CONTRACT_CARD.id,
    approvedPrecedingGate: EN_E06_BLOODCAP_REAVER_GATE.id,
    activeGate: EN_E06_SPRING_DANCER_GATE.id,
  },
  review: {
    baselineVariant: 'spring-dancer',
    scale: 8,
    notes: 'Awaiting visual approval for one complete grounded Spring Dancer against public Elf Mage and approved Bramblewing Scout and Grove Tender. Keep Mist Weaver, Rivercrown Muse, registration, fixtures, effects, and later Wave 2 work separate.',
  },
});

export const EN_E06_SPRING_DANCER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E06_SPRING_DANCER_RENDERER],
  families: [EN_E06_SPRING_DANCER_FAMILY],
});
