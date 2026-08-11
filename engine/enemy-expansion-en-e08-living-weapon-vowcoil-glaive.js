import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E08_CROWNVAULT_CASTELLAN_GATE } from './enemy-expansion-en-e08-animated-armor-crownvault-castellan.js';
import {
  EN_E08_LIVING_WEAPON_TOPOLOGY_DECISION,
  EN_E08_OATHBITE_CLEAVER_GATE,
} from './enemy-expansion-en-e08-living-weapon-oathbite-cleaver.js';

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
  blade: ['#a8b4b7', '#515d66', '#e1e8df'],
  rust: ['#b07a3f', '#654525', '#dda85c'],
  binding: ['#4b416d', '#28243f', '#7e72a8'],
  void: ['#171522', '#08080d', '#34314e'],
  core: '#79ead5',
  flash: '#f4f4f4',
});

export const EN_E08_LIVING_WEAPON_CONTRACT_CARD = deepFreeze({
  id: 'en-e08-living-weapon-v1',
  sliceId: 'EN-E08',
  family: 'living-weapon',
  familyName: 'Living Weapon',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingVariant: {
    id: 'oathbite-cleaver',
    name: 'Oathbite Cleaver',
    role: 'common',
    status: 'approved-published',
  },
  activeVariant: {
    id: 'vowcoil-glaive',
    name: 'Vowcoil Glaive',
    role: 'specialist',
    identity: 'crescent-glaive-specialist',
    status: 'implemented-full-approved',
  },
  deferredRoles: [
    { role: 'elite', status: 'planned-unnamed' },
  ],
  actorTopology: EN_E08_LIVING_WEAPON_TOPOLOGY_DECISION.selected,
  styleContract: 'Use chunky one-to-three-pixel hard-alpha forms and one deterministic baked 24x24 actor. A tall crescent glaive, hooked crown blade, connected ring core, long wrapped shaft, collar lugs, and hooked butt spike must read as the weapon itself acting as the body. All pieces remain connected actor pixels with true hover clearance; no wielder, detached blade, child asset, loose chain, aura, glow, trail, particle, or projectile.',
  effectBoundary: 'Wielders, detached or swapped blades, orbiting weapons, separate cores, aura, bloom, glow, smoke, loose chains, trails, afterimages, projectiles, impacts, floor light, and illumination remain external.',
});

export const EN_E08_VOWCOIL_GLAIVE_CONTRACT = deepFreeze({
  sliceId: 'EN-E08',
  family: 'living-weapon',
  variant: 'vowcoil-glaive',
  role: 'specialist',
  state: 'implemented-complete-motion-approved',
  topology: EN_E08_LIVING_WEAPON_TOPOLOGY_DECISION.selected,
  chassis: 'baked-tall-crescent-glaive-hooked-crown-connected-ring-core-long-wrapped-shaft-collar-lugs-butt-spike-hovering-weapon-v1',
  silhouette: 'A tall narrow hovering polearm with a broad crescent crown blade, inward hook, connected round core collar, long segmented shaft, two short collar lugs, and a hooked butt spike. It must read as a living glaive rather than Oathbite Cleaver, Animated Armor holding a spear, a Fallen Knight, a thin inventory icon, an upright humanoid, or a detached particle cluster.',
  identity: 'Pale moon-steel edges, slate recesses, old-gold collar planes, indigo binding bands, and one bright teal ring core establish a precise specialist weapon. The blade, hook, ring core, collar, shaft, bindings, and butt spike remain one connected baked actor while wielders, detached parts, loose chains, aura, glow, trails, projectiles, impacts, and illumination stay external.',
  effectBoundary: EN_E08_LIVING_WEAPON_CONTRACT_CARD.effectBoundary,
});

export const EN_E08_VOWCOIL_GLAIVE_DATA = deepFreeze({
  actor: {
    species: 'living-weapon',
    bodyBuild: 'tall-hovering-crescent-glaive',
    skin: 'moon-steel-crescent-blade',
    hairStyle: 'connected-indigo-shaft-wraps',
    hairColor: 'indigo-binding',
    expression: 'single-teal-ring-core-vigil',
    faceDetail: 'ring-core-crescent-hook-and-segmented-shaft',
    headgear: 'none',
    outfit: 'connected-old-gold-collar-lugs-and-wrapped-shaft',
    outfitColor: 'moon-steel-old-gold-indigo-and-teal',
    outfitTier: 'tier2',
    weapon: 'self',
    weaponTier: 'tier2',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.blade,
      hair: COLORS.binding,
      outfit: COLORS.rust,
    },
  },
  vowcoilGlaive: COLORS,
  actorTopology: EN_E08_LIVING_WEAPON_TOPOLOGY_DECISION.selected,
  childAssets: [],
  alphaPolicy: 'binary-single-component-tall-crescent-glaive-hooked-crown-ring-core-collar-lugs-segmented-wrapped-shaft-butt-spike-and-hover-clearance',
  effectBoundary: EN_E08_LIVING_WEAPON_CONTRACT_CARD.effectBoundary,
  bakedEffects: [],
});

export const EN_E08_VOWCOIL_GLAIVE_GATE = deepFreeze({
  id: 'en-e08-living-weapon-vowcoil-glaive-full-v1',
  status: 'approved',
  baseCheckpoint: '870bf042e4d7604fec6f33ba3ba6b03308204ee2',
  authorizedOn: '2026-08-11',
  authorizationEvidence: 'The exact Oathbite Cleaver packet was presented and the designer replied: approved lets do next. Its bounded publication tuple was reconciled at clean remote-verified checkpoint 870bf042e4d7604fec6f33ba3ba6b03308204ee2. Oathbite completed the common role, so the one-complete-sprite cadence authorizes only one private specialist Living Weapon Vowcoil Glaive 80-frame art candidate under the approved baked-single-actor topology. Registration, fixtures, child assets, effects, the elite role, EN-E09, release, and a pull request remain closed.',
  architectureDecision: EN_E08_LIVING_WEAPON_TOPOLOGY_DECISION.id,
  approvedOn: '2026-08-12',
  approvalEvidence: 'The exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, the approved Oathbite Cleaver and Crownvault Castellan plus public Fallen Knight Shieldbearer silhouette comparison, and both synchronized GIFs were presented. The three exact frozen PNG paths were open together in Aseprite. The designer replied: approved lets do next. In context this explicitly approves candidate digest bfdbd581137492667ad042b062480895b67f63a33aeec43aaef94e22a4816807 and its five frozen review hashes only. The same reply may open only one private elite Living Weapon art candidate after clean publication reconciliation. Registration, fixtures, child assets, effects, EN-E09, release, accepted drift, a pull request, and any broader gate remain separate decisions.',
  approvedImplementation: '1080ca4a377657634249d3579dbd9c743db3b38c',
  publicationAuthorizedOn: '2026-08-11',
  publicationAuthorizationEvidence: 'The designer said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact artifact or digest. It does not authorize registration, fixtures, effects, later roles or families, release, or any other unopened gate.',
  publishedImplementation: '1080ca4a377657634249d3579dbd9c743db3b38c',
  publishedApprovalRecord: '36d41a04fc122336a9e65aa9f5d94618975df388',
  initialPublishedHandoff: '5f7b93d4a911a87e3fb91a45c68d6ce2d8fb31cf',
  publicationState: 'published',
  precedingApproval: {
    gateId: EN_E08_OATHBITE_CLEAVER_GATE.id,
    artifactSha256: EN_E08_OATHBITE_CLEAVER_GATE.artifactSha256,
    assembledArtifactSha256: EN_E08_OATHBITE_CLEAVER_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E08_OATHBITE_CLEAVER_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E08_OATHBITE_CLEAVER_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E08_OATHBITE_CLEAVER_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E08_OATHBITE_CLEAVER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E08_OATHBITE_CLEAVER_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E08_OATHBITE_CLEAVER_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E08_OATHBITE_CLEAVER_GATE.initialPublishedHandoff,
    currentReconciliation: '870bf042e4d7604fec6f33ba3ba6b03308204ee2',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e08-living-weapon-vowcoil-glaive/en-e08-living-weapon-vowcoil-glaive-full-suite-raw.png',
  artifactSha256: '740d23519944d9a3567ca8889871ab4e731c87f74a79d61e3ccc5faf550843f1',
  assembledArtifact: 'enemy-expansion-review/en-e08-living-weapon-vowcoil-glaive/en-e08-living-weapon-vowcoil-glaive-full-suite-complete-b-form.png',
  assembledArtifactSha256: '5697d242be08d1a456fdfdbacb32e67827be58f57819a0678f4adc808c42a580',
  comparisonArtifact: 'enemy-expansion-review/en-e08-living-weapon-vowcoil-glaive/en-e08-living-weapon-vowcoil-glaive-silhouette-comparison.png',
  comparisonArtifactSha256: '245212d2c7f07bb259da471707a9a70922556ad04d6a6e08e9d1ee976dcd3558',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e08-living-weapon-vowcoil-glaive/en-e08-living-weapon-vowcoil-glaive-full-suite-four-directions-labeled.gif',
      sha256: 'c0e4ffa28050045d22799ccee5ed4a800caa60a7ff068b543da6a59be0fdf971',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e08-living-weapon-vowcoil-glaive/en-e08-living-weapon-vowcoil-glaive-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: 'f4c6816a1513c3b900b8a54be7aab68ca210b864a3c450f3aa514aaefbe2f594',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
  },
  candidateFrameDigest: 'bfdbd581137492667ad042b062480895b67f63a33aeec43aaef94e22a4816807',
  oathbiteCleaverComparisonDigest: EN_E08_OATHBITE_CLEAVER_GATE.candidateFrameDigest,
  crownvaultCastellanComparisonDigest: EN_E08_CROWNVAULT_CASTELLAN_GATE.candidateFrameDigest,
  fallenKnightComparisonDigest: EN_E08_CROWNVAULT_CASTELLAN_GATE.fallenKnightComparisonDigest,
  scope: 'One complete 80-frame Vowcoil Glaive specialist Living Weapon across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle holds the tall glaive upright and pulses the connected ring core. Walk uses four directional hover phases with opposed crescent and butt-spike drift. Attack coils, leans, drives one body-owned horizontal reaping sweep without a trail or projectile, and recovers. Hurt uses a complete white recoil and a colored shaft brace that preserves the crescent blade, ring core, collar, long shaft, and butt spike. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and approved Oathbite Cleaver plus approved Crownvault Castellan and public Fallen Knight Shieldbearer silhouette comparisons together.',
  exclusions: [
    'changes to approved Oathbite Cleaver rendered pixels',
    'changes to approved Crownvault Castellan rendered pixels',
    'public Living Weapon registration',
    'public catalog exposure',
    'asset-pack fixture generation or regeneration',
    'new Cast pixels',
    'new Death pixels',
    'aura',
    'bloom',
    'glow',
    'wielders',
    'detached or swapped blades',
    'orbiting weapons',
    'separate animated cores',
    'afterimages',
    'trails',
    'light pools',
    'projectiles',
    'impact flashes',
    'illumination',
    'effects',
    'Living Weapon elite',
    'EN-E09 and later work',
    'release',
    'accepted drift',
  ],
  nextGate: 'The exact Vowcoil Glaive implementation 1080ca4a377657634249d3579dbd9c743db3b38c, approval record 36d41a04fc122336a9e65aa9f5d94618975df388, and initial published handoff 5f7b93d4a911a87e3fb91a45c68d6ce2d8fb31cf are remote verified; this reconciliation completes the bounded publication tuple. The same approved lets do next reply opens only one private elite Living Weapon art candidate from this clean published reconciliation. Registration, fixtures, child assets, effects, EN-E09, release, accepted drift, and a pull request remain closed.',
});

export const EN_E08_VOWCOIL_GLAIVE_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const WALK_PHASES = deepFreeze([
  { name: 'left-crescent-hover', pose: 'walk', bob: 0, drift: -1, flare: 0, tilt: 1 },
  { name: 'high-ring-pass', pose: 'walk', bob: -1, drift: 0, flare: 1, tilt: -1 },
  { name: 'right-butt-spike-hover', pose: 'walk', bob: 0, drift: 1, flare: 0, tilt: -1 },
  { name: 'low-shaft-settle', pose: 'walk', bob: 1, drift: 0, flare: 0, tilt: 1 },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'ring-core-coil', pose: 'coil', bob: 0, drift: 0, flare: 1, tilt: -1 },
  { name: 'crescent-lean', pose: 'lean', bob: -1, drift: 1, flare: 0, tilt: 1 },
  { name: 'body-owned-reaping-sweep', pose: 'sweep', bob: 0, drift: 0, flare: 1, tilt: 0 },
  { name: 'vowcoil-recover', pose: 'recover', bob: 1, drift: 0, flare: 0, tilt: 0 },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-glaive-recoil', pose: 'hurt', bob: 0, drift: -1, flare: 0, tilt: -1, flash: true },
  { name: 'colored-shaft-brace', pose: 'guarded', bob: 1, drift: 0, flare: 0, tilt: 1, flash: false },
]);

function phaseFor(animation, frame) {
  if (animation === 'idle') {
    assert(frame === 0 || frame === 1, 'Vowcoil Glaive Idle frame ' + frame + ' is out of range.');
    return frame === 0
      ? { name: 'ring-core-vigil', pose: 'idle', bob: 0, drift: 0, flare: 0, tilt: -1 }
      : { name: 'vowcoil-pulse', pose: 'idle', bob: 1, drift: 0, flare: 1, tilt: 1 };
  }
  if (animation === 'walk') return WALK_PHASES[frame];
  if (animation === 'attack' || animation === 'cast') return ATTACK_PHASES[frame];
  if (animation === 'hurt') return HURT_PHASES[frame];
  if (animation === 'death') return HURT_PHASES[EN_E08_VOWCOIL_GLAIVE_DEATH_SOURCE_FRAMES[frame]];
  return null;
}

function createPixels() {
  return new Array(SIZE * SIZE).fill(null);
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert([x, y, width, height].every(Number.isInteger) && width > 0 && height > 0, 'Vowcoil Glaive rectangles must use positive integer geometry.');
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Vowcoil Glaive authored pixels must remain inside the 24x24 cell.');
      pixels[(py * SIZE) + px] = fill;
    }
  };
  return {
    rect,
    dot(x, y, fill) { rect(x, y, 1, 1, fill); },
  };
}

function drawFront(paint, rear, phase) {
  const y = phase.bob || 0;
  const x = phase.drift || 0;
  const flare = Math.max(phase.flare || 0, 0);
  if (phase.pose === 'sweep') {
    // The whole polearm rotates into one connected horizontal reaping body.
    paint.rect(3 + x, 7 + y, 7, 2, COLORS.blade[1]);
    paint.rect(2 + x, 9 + y, 8, 5, COLORS.blade[0]);
    paint.rect(3 + x, 13 + y, 6, 2, COLORS.blade[2]);
    paint.rect(2 + x, 8 + y, 2, 3, COLORS.blade[2]);
    paint.rect(8 + x, 10 + y, 5, 4, COLORS.rust[1]);
    paint.rect(9 + x, 11 + y, 3, 2, COLORS.void[0]);
    if (!rear) paint.dot(10 + x, 11 + y, COLORS.core);
    paint.rect(12 + x, 11 + y, 8, 3, COLORS.binding[0]);
    paint.rect(14 + x, 12 + y, 2, 2, COLORS.binding[2]);
    paint.rect(19 + x, 10 + y, 2, 4, COLORS.blade[1]);
    paint.rect(20 + x, 9 + y, 2, 2, COLORS.blade[2]);
    return;
  }

  // Crescent crown: broad enough to read, with an inward hook and dark socket.
  paint.rect(10 + x, 2 + y, 5, 2, COLORS.blade[1]);
  paint.rect(8 + x, 2 + y, 8, 2, COLORS.blade[0]);
  paint.rect(6 + x, 4 + y, 9, 2, COLORS.blade[0]);
  paint.rect(5 + x, 6 + y, 8, 2, COLORS.blade[0]);
  paint.rect(6 + x, 8 + y, 7, 2, COLORS.blade[1]);
  paint.rect(5 + x, 4 + y, 2, 4, COLORS.blade[2]);
  paint.rect(14 + x, 3 + y, 3, 2, COLORS.blade[2]);
  paint.rect(15 + x, 4 + y, 2, 4, COLORS.blade[2]);
  paint.rect(13 + x, 7 + y, 3, 2, COLORS.blade[2]);
  paint.rect(9 + x, 4 + y, 4, 4, COLORS.void[0]);
  paint.dot(10 + x, 5 + y, COLORS.void[2]);

  // Connected ring core and collar lugs bridge blade into the long shaft.
  paint.rect(6 + x - flare, 9 + y, 13 + (flare * 2), 2, COLORS.rust[1]);
  paint.rect(8 + x, 8 + y, 8, 5, COLORS.rust[0]);
  paint.rect(9 + x, 9 + y, 6, 3, COLORS.void[0]);
  if (rear) {
    paint.rect(10 + x, 9 + y, 4, 2, COLORS.binding[1]);
    paint.dot(11 + x, 10 + y, COLORS.rust[2]);
  } else {
    paint.rect(10 + x, 9 + y, 4, 3, COLORS.void[1]);
    paint.dot(11 + x, 10 + y, COLORS.core);
    if (flare) paint.dot(13 + x, 10 + y, COLORS.core);
  }

  paint.rect(10 + x, 12 + y, 5, 8, COLORS.binding[0]);
  paint.rect(11 + x, 12 + y, 3, 8, COLORS.blade[1]);
  paint.rect(10 + x, 13 + y, 5, 1, COLORS.binding[2]);
  paint.rect(10 + x, 16 + y, 5, 1, COLORS.binding[1]);
  paint.rect(10 + x, 19 + y, 5, 2, COLORS.blade[1]);
  paint.rect(9 + x, 20 + y, 4, 2, COLORS.blade[2]);
  paint.dot(9 + x, 21 + y, COLORS.blade[1]);

  if (phase.pose === 'coil' || phase.pose === 'guarded' || phase.pose === 'recover') {
    paint.rect(7 + x, 10 + y, 3, 3, COLORS.rust[2]);
    paint.rect(14 + x, 10 + y, 3, 3, COLORS.rust[0]);
  }
  if (phase.pose === 'lean') {
    paint.rect(15 + x, 6 + y, 3, 2, COLORS.blade[2]);
  }
}

function drawRight(paint, phase) {
  const y = phase.bob || 0;
  const x = phase.drift || 0;
  const flare = Math.max(phase.flare || 0, 0);
  if (phase.pose === 'sweep') {
    paint.rect(4 + x, 11 + y, 11, 3, COLORS.binding[0]);
    paint.rect(5 + x, 12 + y, 8, 2, COLORS.blade[1]);
    paint.rect(3 + x, 10 + y, 3, 4, COLORS.blade[1]);
    paint.rect(2 + x, 9 + y, 3, 2, COLORS.blade[2]);
    paint.rect(12 + x, 9 + y, 5, 5, COLORS.rust[0]);
    paint.rect(13 + x, 10 + y, 3, 3, COLORS.void[0]);
    paint.dot(14 + x, 11 + y, COLORS.core);
    paint.rect(16 + x, 8 + y, 5, 6, COLORS.blade[0]);
    paint.rect(18 + x, 6 + y, 3, 4, COLORS.blade[0]);
    paint.rect(20 + x, 5 + y, 2, 4, COLORS.blade[2]);
    paint.rect(17 + x, 13 + y, 4, 2, COLORS.blade[2]);
    return;
  }

  paint.rect(12 + x, 2 + y, 4, 2, COLORS.blade[1]);
  paint.rect(12 + x, 2 + y, 6, 2, COLORS.blade[0]);
  paint.rect(13 + x, 4 + y, 7, 3, COLORS.blade[0]);
  paint.rect(12 + x, 7 + y, 7, 2, COLORS.blade[1]);
  paint.rect(18 + x, 3 + y, 2, 4, COLORS.blade[2]);
  paint.rect(17 + x, 7 + y, 3, 2, COLORS.blade[2]);
  paint.rect(13 + x, 4 + y, 3, 4, COLORS.void[0]);
  paint.rect(9 + x - flare, 9 + y, 10 + (flare * 2), 2, COLORS.rust[1]);
  paint.rect(11 + x, 8 + y, 7, 5, COLORS.rust[0]);
  paint.rect(12 + x, 9 + y, 5, 3, COLORS.void[0]);
  paint.dot(15 + x, 10 + y, COLORS.core);
  if (flare) paint.dot(13 + x, 10 + y, COLORS.core);
  paint.rect(12 + x, 12 + y, 5, 8, COLORS.binding[0]);
  paint.rect(13 + x, 12 + y, 3, 8, COLORS.blade[1]);
  paint.rect(12 + x, 14 + y, 5, 1, COLORS.binding[2]);
  paint.rect(12 + x, 17 + y, 5, 1, COLORS.binding[1]);
  paint.rect(12 + x, 19 + y, 5, 2, COLORS.blade[1]);
  paint.rect(11 + x, 20 + y, 3, 2, COLORS.blade[2]);

  if (phase.pose === 'coil' || phase.pose === 'guarded' || phase.pose === 'recover') {
    paint.rect(9 + x, 10 + y, 3, 3, COLORS.rust[2]);
  }
  if (phase.pose === 'lean') {
    paint.rect(18 + x, 6 + y, 3, 2, COLORS.blade[2]);
  }
}

function mirrorPixels(pixels) {
  const result = new Array(SIZE * SIZE).fill(null);
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    result[(y * SIZE) + (SIZE - 1 - x)] = pixels[(y * SIZE) + x];
  }
  return result;
}

function buildPixels(direction, animation, frame) {
  const phase = phaseFor(animation, frame);
  assert(phase, 'Vowcoil Glaive animation ' + animation + ' frame ' + frame + ' is out of range.');
  const canonicalDirection = direction === 'left' ? 'right' : direction;
  let pixels = createPixels();
  const paint = painter(pixels);
  if (canonicalDirection === 'right') drawRight(paint, phase);
  else drawFront(paint, canonicalDirection === 'up', phase);
  if (phase.flash) pixels = pixels.map((color) => color ? COLORS.flash : null);
  if (direction === 'left') pixels = mirrorPixels(pixels);
  return Object.freeze({ phase, pixels: Object.freeze(pixels) });
}

function paintPixels(context, pixels) {
  for (let index = 0; index < pixels.length; index++) {
    const fill = pixels[index];
    if (!fill) continue;
    context.fillStyle = fill;
    context.fillRect(index % SIZE, Math.floor(index / SIZE), 1, 1);
  }
}

export function renderEnE08VowcoilGlaiveFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Vowcoil Glaive rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Vowcoil Glaive direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'living-weapon',
    variant: 'vowcoil-glaive',
    direction,
    animation,
    frame,
    phase: phase.name,
    vowcoilGlaiveGate: EN_E08_VOWCOIL_GLAIVE_GATE.id,
    actorTopology: EN_E08_VOWCOIL_GLAIVE_DATA.actorTopology,
    childAssetCount: EN_E08_VOWCOIL_GLAIVE_DATA.childAssets.length,
    approvedPrecedingGate: EN_E08_OATHBITE_CLEAVER_GATE.id,
    alphaPolicy: EN_E08_VOWCOIL_GLAIVE_DATA.alphaPolicy,
    effectBoundary: EN_E08_VOWCOIL_GLAIVE_DATA.effectBoundary,
  });
}

export const EN_E08_VOWCOIL_GLAIVE_RENDERER = deepFreeze({
  key: 'en-e08-living-weapon-vowcoil-glaive-v1',
  chassis: EN_E08_VOWCOIL_GLAIVE_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'living-weapon', 'The EN-E08 Vowcoil Glaive renderer is restricted to Living Weapon.');
    assert(variant.id === 'vowcoil-glaive', 'The EN-E08 Vowcoil Glaive renderer is restricted to Vowcoil Glaive.');
    return renderEnE08VowcoilGlaiveFrame(context, direction, animation.id, frame);
  },
});

const VOWCOIL_GLAIVE_VARIANT = deepFreeze({
  id: 'vowcoil-glaive',
  name: 'Vowcoil Glaive',
  role: EN_E08_VOWCOIL_GLAIVE_CONTRACT.role,
  status: EN_E08_VOWCOIL_GLAIVE_CONTRACT.state,
  brief: 'A private complete specialist Living Weapon with a tall moon-steel crescent, inward hook, connected teal ring core, old-gold collar lugs, long indigo-wrapped shaft, hooked butt spike, and true hover clearance; wielders, detached blades, loose chains, aura, glow, trails, projectiles, illumination, and impacts remain external.',
  rendererData: EN_E08_VOWCOIL_GLAIVE_DATA,
});

export const EN_E08_VOWCOIL_GLAIVE_FAMILY = deepFreeze({
  id: 'living-weapon',
  name: 'Living Weapon Vowcoil Glaive Review',
  sliceId: 'EN-E08',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E08_VOWCOIL_GLAIVE_CONTRACT.chassis,
  rendererKey: EN_E08_VOWCOIL_GLAIVE_RENDERER.key,
  variants: [VOWCOIL_GLAIVE_VARIANT],
  rendererData: {
    contractCard: EN_E08_LIVING_WEAPON_CONTRACT_CARD.id,
    architectureDecision: EN_E08_LIVING_WEAPON_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E08_OATHBITE_CLEAVER_GATE.id,
    activeGate: EN_E08_VOWCOIL_GLAIVE_GATE.id,
  },
  review: {
    baselineVariant: 'vowcoil-glaive',
    scale: 8,
    notes: 'Awaiting visual review as one connected baked hovering specialist Vowcoil Glaive against approved Oathbite Cleaver and Crownvault Castellan plus public Fallen Knight Shieldbearer. Keep registration, fixtures, child assets, effects, the elite role, EN-E09, release, accepted drift, and a pull request separate.',
  },
});

export const EN_E08_VOWCOIL_GLAIVE_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E08_VOWCOIL_GLAIVE_RENDERER],
  families: [EN_E08_VOWCOIL_GLAIVE_FAMILY],
});
