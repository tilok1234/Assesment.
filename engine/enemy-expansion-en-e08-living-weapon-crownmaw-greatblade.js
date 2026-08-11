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
import { EN_E08_VOWCOIL_GLAIVE_GATE } from './enemy-expansion-en-e08-living-weapon-vowcoil-glaive.js';

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
  blade: ['#aaa7a0', '#3f414b', '#eee0bd'],
  gold: ['#b9853f', '#604322', '#e2b866'],
  binding: ['#723a46', '#351f2b', '#ad5960'],
  void: ['#19151d', '#08070a', '#34303d'],
  core: '#ff7466',
  flash: '#f4f4f4',
});

export const EN_E08_LIVING_WEAPON_ELITE_CONTRACT_CARD = deepFreeze({
  id: 'en-e08-living-weapon-v1',
  sliceId: 'EN-E08',
  family: 'living-weapon',
  familyName: 'Living Weapon',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingVariant: {
    id: 'vowcoil-glaive',
    name: 'Vowcoil Glaive',
    role: 'specialist',
    status: 'approved-published',
  },
  activeVariant: {
    id: 'crownmaw-greatblade',
    name: 'Crownmaw Greatblade',
    role: 'elite',
    identity: 'crowned-execution-greatblade-elite',
    status: 'implemented-full-awaiting-visual-approval',
  },
  deferredRoles: [],
  actorTopology: EN_E08_LIVING_WEAPON_TOPOLOGY_DECISION.selected,
  styleContract: 'Use chunky one-to-three-pixel hard-alpha forms and one deterministic baked 24x24 actor. A broad symmetrical crown blade, jaw guard, connected crimson slit core, short wrapped grip, and forked pommel must read as the weapon itself acting as the body. All pieces remain connected actor pixels with true hover clearance; no wielder, detached blade, child asset, loose chain, aura, glow, trail, particle, or projectile.',
  effectBoundary: 'Wielders, detached or swapped blades, orbiting weapons, separate cores, aura, bloom, glow, smoke, loose chains, trails, afterimages, projectiles, impacts, floor light, and illumination remain external.',
});

export const EN_E08_CROWNMAW_GREATBLADE_CONTRACT = deepFreeze({
  sliceId: 'EN-E08',
  family: 'living-weapon',
  variant: 'crownmaw-greatblade',
  role: 'elite',
  state: 'implemented-complete-motion-awaiting-visual-approval',
  topology: EN_E08_LIVING_WEAPON_TOPOLOGY_DECISION.selected,
  chassis: 'baked-broad-crowned-greatblade-jaw-guard-connected-slit-core-short-wrapped-grip-forked-pommel-hovering-weapon-v1',
  silhouette: 'A broad symmetrical hovering execution greatblade with three crown prongs, heavy edge shoulders, a toothed jaw guard, short grip, and forked pommel. It must read as a sovereign living greatblade rather than Oathbite Cleaver, Vowcoil Glaive, Animated Armor, a Fallen Knight, a thin inventory icon, an upright humanoid, or a detached particle cluster.',
  identity: 'Ash-steel planes, ivory edges, old-gold crown and jaw hardware, wine-red bindings, and one bright crimson slit core establish an elite sovereign weapon. The crown blade, jaw guard, slit core, grip, bindings, and forked pommel remain one connected baked actor while wielders, detached parts, loose chains, aura, glow, trails, projectiles, impacts, and illumination stay external.',
  effectBoundary: EN_E08_LIVING_WEAPON_ELITE_CONTRACT_CARD.effectBoundary,
});

export const EN_E08_CROWNMAW_GREATBLADE_DATA = deepFreeze({
  actor: {
    species: 'living-weapon',
    bodyBuild: 'broad-hovering-crowned-greatblade',
    skin: 'ash-steel-ivory-edged-blade',
    hairStyle: 'connected-wine-red-grip-wraps',
    hairColor: 'wine-red-binding',
    expression: 'single-crimson-slit-core-glare',
    faceDetail: 'crown-prongs-jaw-guard-and-slit-core',
    headgear: 'none',
    outfit: 'connected-old-gold-jaw-guard-and-forked-pommel',
    outfitColor: 'ash-steel-ivory-old-gold-wine-and-crimson',
    outfitTier: 'tier3',
    weapon: 'self',
    weaponTier: 'tier3',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.blade,
      hair: COLORS.binding,
      outfit: COLORS.gold,
    },
  },
  crownmawGreatblade: COLORS,
  actorTopology: EN_E08_LIVING_WEAPON_TOPOLOGY_DECISION.selected,
  childAssets: [],
  alphaPolicy: 'binary-single-component-broad-crowned-greatblade-three-prongs-jaw-guard-slit-core-short-wrapped-grip-forked-pommel-and-hover-clearance',
  effectBoundary: EN_E08_LIVING_WEAPON_ELITE_CONTRACT_CARD.effectBoundary,
  bakedEffects: [],
});

export const EN_E08_CROWNMAW_GREATBLADE_GATE = deepFreeze({
  id: 'en-e08-living-weapon-crownmaw-greatblade-full-v1',
  status: 'implemented-awaiting-visual-approval',
  baseCheckpoint: '7bdb09e95d47c6213e2387124c305f78b0b486d1',
  authorizedOn: '2026-08-12',
  authorizationEvidence: 'The exact Vowcoil Glaive packet was presented and the designer replied: approved lets do next. Its bounded publication tuple was reconciled at clean remote-verified checkpoint 7bdb09e95d47c6213e2387124c305f78b0b486d1. Vowcoil completed the specialist role, so the one-complete-sprite cadence authorizes only one private elite Living Weapon Crownmaw Greatblade 80-frame art candidate under the approved baked-single-actor topology. Registration, fixtures, child assets, effects, EN-E09, release, and a pull request remain closed.',
  architectureDecision: EN_E08_LIVING_WEAPON_TOPOLOGY_DECISION.id,
  approvedOn: null,
  approvalEvidence: null,
  approvedImplementation: null,
  publicationAuthorizedOn: '2026-08-11',
  publicationAuthorizationEvidence: 'The designer said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact artifact or digest. It does not authorize registration, fixtures, effects, later roles or families, release, or any other unopened gate.',
  publishedImplementation: null,
  publishedApprovalRecord: null,
  initialPublishedHandoff: null,
  publicationState: 'not-approved',
  precedingApproval: {
    gateId: EN_E08_VOWCOIL_GLAIVE_GATE.id,
    artifactSha256: EN_E08_VOWCOIL_GLAIVE_GATE.artifactSha256,
    assembledArtifactSha256: EN_E08_VOWCOIL_GLAIVE_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E08_VOWCOIL_GLAIVE_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E08_VOWCOIL_GLAIVE_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E08_VOWCOIL_GLAIVE_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E08_VOWCOIL_GLAIVE_GATE.candidateFrameDigest,
    publishedImplementation: EN_E08_VOWCOIL_GLAIVE_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E08_VOWCOIL_GLAIVE_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E08_VOWCOIL_GLAIVE_GATE.initialPublishedHandoff,
    currentReconciliation: '7bdb09e95d47c6213e2387124c305f78b0b486d1',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e08-living-weapon-crownmaw-greatblade/en-e08-living-weapon-crownmaw-greatblade-full-suite-raw.png',
  artifactSha256: '1986500952544fc01507ea76b4e2f0d6d87c5a03c2afc79eec5c30b168d8dcc8',
  assembledArtifact: 'enemy-expansion-review/en-e08-living-weapon-crownmaw-greatblade/en-e08-living-weapon-crownmaw-greatblade-full-suite-complete-b-form.png',
  assembledArtifactSha256: '2e4966afbefcb7c1c0f2086efdd1c29a99fbc9d30928222fb0f11aa29db1ab30',
  comparisonArtifact: 'enemy-expansion-review/en-e08-living-weapon-crownmaw-greatblade/en-e08-living-weapon-crownmaw-greatblade-silhouette-comparison.png',
  comparisonArtifactSha256: 'cc12a02b84b9010c3238f3ee6acefb04271537941302346b9017c648d5dbe5ac',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e08-living-weapon-crownmaw-greatblade/en-e08-living-weapon-crownmaw-greatblade-full-suite-four-directions-labeled.gif',
      sha256: '9a6b939dc2192d2fb813d2807200426ac34bee5258b41b5ec2812db048227214',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e08-living-weapon-crownmaw-greatblade/en-e08-living-weapon-crownmaw-greatblade-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '77eed1d6333f68c0ae26d0caf80ff9609abe93d2a852ac59a96a52392068f86a',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
  },
  candidateFrameDigest: 'a7f88e5ebf4656f7dbea55ea5a62ad23a530b0c4bf573f9750240cf605a6fa44',
  oathbiteCleaverComparisonDigest: EN_E08_OATHBITE_CLEAVER_GATE.candidateFrameDigest,
  vowcoilGlaiveComparisonDigest: EN_E08_VOWCOIL_GLAIVE_GATE.candidateFrameDigest,
  crownvaultCastellanComparisonDigest: EN_E08_CROWNVAULT_CASTELLAN_GATE.candidateFrameDigest,
  fallenKnightComparisonDigest: EN_E08_CROWNVAULT_CASTELLAN_GATE.fallenKnightComparisonDigest,
  scope: 'One complete 80-frame Crownmaw Greatblade elite Living Weapon across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle holds the broad crowned blade upright and pulses the connected crimson slit core. Walk uses four directional hover phases with opposed crown and forked-pommel drift. Attack draws back, leans, drives one body-owned horizontal execution cleave without a trail or projectile, and recovers. Hurt uses a complete white recoil and a colored jaw-guard brace that preserves the crown blade, slit core, jaw guard, grip, and forked pommel. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and approved Vowcoil Glaive, approved Oathbite Cleaver, approved Crownvault Castellan, and public Fallen Knight Shieldbearer silhouette comparisons together.',
  exclusions: [
    'changes to approved Oathbite Cleaver rendered pixels',
    'changes to approved Vowcoil Glaive rendered pixels',
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
    'EN-E09 and later work',
    'release',
    'accepted drift',
  ],
  nextGate: 'Stop for explicit visual approval or rejection of the exact Crownmaw Greatblade digest and five frozen review hashes. Do not commit, publish, register, generate fixtures, add child assets or effects, begin EN-E09, release, accept drift, or open a pull request without a new explicit decision.',
});

export const EN_E08_CROWNMAW_GREATBLADE_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const WALK_PHASES = deepFreeze([
  { name: 'left-crown-hover', pose: 'walk', bob: 0, drift: -1, flare: 0, tilt: 1 },
  { name: 'high-core-pass', pose: 'walk', bob: -1, drift: 0, flare: 1, tilt: -1 },
  { name: 'right-pommel-hover', pose: 'walk', bob: 0, drift: 1, flare: 0, tilt: -1 },
  { name: 'low-jaw-settle', pose: 'walk', bob: 1, drift: 0, flare: 0, tilt: 1 },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'jaw-guard-draw', pose: 'coil', bob: 0, drift: 0, flare: 1, tilt: -1 },
  { name: 'crown-blade-lean', pose: 'lean', bob: -1, drift: 1, flare: 0, tilt: 1 },
  { name: 'body-owned-execution-cleave', pose: 'sweep', bob: 0, drift: 0, flare: 1, tilt: 0 },
  { name: 'crownmaw-recover', pose: 'recover', bob: 1, drift: 0, flare: 0, tilt: 0 },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-greatblade-recoil', pose: 'hurt', bob: 0, drift: -1, flare: 0, tilt: -1, flash: true },
  { name: 'colored-jaw-guard-brace', pose: 'guarded', bob: 1, drift: 0, flare: 0, tilt: 1, flash: false },
]);

function phaseFor(animation, frame) {
  if (animation === 'idle') {
    assert(frame === 0 || frame === 1, 'Crownmaw Greatblade Idle frame ' + frame + ' is out of range.');
    return frame === 0
      ? { name: 'crimson-core-vigil', pose: 'idle', bob: 0, drift: 0, flare: 0, tilt: -1 }
      : { name: 'crownmaw-pulse', pose: 'idle', bob: 1, drift: 0, flare: 1, tilt: 1 };
  }
  if (animation === 'walk') return WALK_PHASES[frame];
  if (animation === 'attack' || animation === 'cast') return ATTACK_PHASES[frame];
  if (animation === 'hurt') return HURT_PHASES[frame];
  if (animation === 'death') return HURT_PHASES[EN_E08_CROWNMAW_GREATBLADE_DEATH_SOURCE_FRAMES[frame]];
  return null;
}

function createPixels() {
  return new Array(SIZE * SIZE).fill(null);
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert([x, y, width, height].every(Number.isInteger) && width > 0 && height > 0, 'Crownmaw Greatblade rectangles must use positive integer geometry.');
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Crownmaw Greatblade authored pixels must remain inside the 24x24 cell.');
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
    // The entire greatblade rotates into one connected horizontal execution body.
    paint.rect(2 + x, 8 + y, 10, 2, COLORS.blade[2]);
    paint.rect(3 + x, 10 + y, 10, 5, COLORS.blade[0]);
    paint.rect(4 + x, 15 + y, 8, 2, COLORS.blade[1]);
    paint.rect(2 + x, 9 + y, 2, 5, COLORS.blade[2]);
    paint.rect(5 + x, 11 + y, 5, 2, COLORS.blade[1]);
    paint.rect(10 + x, 9 + y, 6, 7, COLORS.gold[1]);
    paint.rect(11 + x, 10 + y, 4, 5, COLORS.gold[0]);
    paint.rect(12 + x, 11 + y, 3, 3, COLORS.void[0]);
    if (!rear) paint.rect(12 + x, 12 + y, 2, 1, COLORS.core);
    paint.rect(15 + x, 11 + y, 6, 4, COLORS.binding[0]);
    paint.rect(17 + x, 12 + y, 3, 2, COLORS.binding[2]);
    paint.rect(20 + x, 10 + y, 2, 6, COLORS.gold[0]);
    paint.dot(21 + x, 9 + y, COLORS.blade[2]);
    paint.dot(21 + x, 16 + y, COLORS.blade[2]);
    return;
  }

  // Three crown prongs bridge into one broad, symmetrical execution blade.
  paint.rect(6 + x, 2 + y, 3, 4, COLORS.blade[2]);
  paint.rect(11 + x, 2 + y, 3, 4, COLORS.gold[2]);
  paint.rect(16 + x, 2 + y, 3, 4, COLORS.blade[2]);
  paint.rect(7 + x, 4 + y, 11, 3, COLORS.blade[0]);
  paint.rect(6 + x, 6 + y, 13, 3, COLORS.blade[0]);
  paint.rect(7 + x, 9 + y, 11, 3, COLORS.blade[1]);
  paint.rect(6 + x, 6 + y, 2, 5, COLORS.blade[2]);
  paint.rect(17 + x, 6 + y, 2, 5, COLORS.blade[2]);
  paint.rect(10 + x, 5 + y, 5, 5, COLORS.void[0]);
  paint.rect(11 + x, 5 + y, 3, 3, COLORS.void[2]);

  // A toothed jaw guard holds the connected slit core and joins the short grip.
  paint.rect(5 + x - flare, 10 + y, 15 + (flare * 2), 2, COLORS.gold[1]);
  paint.rect(7 + x, 10 + y, 11, 5, COLORS.gold[0]);
  paint.rect(8 + x, 11 + y, 9, 3, COLORS.void[0]);
  paint.dot(6 + x - flare, 12 + y, COLORS.blade[2]);
  paint.dot(18 + x + flare, 12 + y, COLORS.blade[2]);
  if (rear) {
    paint.rect(10 + x, 11 + y, 5, 2, COLORS.binding[1]);
    paint.dot(12 + x, 12 + y, COLORS.gold[2]);
  } else {
    paint.rect(10 + x, 11 + y, 5, 3, COLORS.void[1]);
    paint.rect(11 + x, 12 + y, 3 + flare, 1, COLORS.core);
  }

  paint.rect(10 + x, 14 + y, 5, 7, COLORS.binding[0]);
  paint.rect(11 + x, 14 + y, 3, 7, COLORS.blade[1]);
  paint.rect(10 + x, 15 + y, 5, 1, COLORS.binding[2]);
  paint.rect(10 + x, 18 + y, 5, 1, COLORS.binding[1]);
  paint.rect(9 + x, 20 + y, 7, 2, COLORS.gold[0]);
  paint.rect(8 + x, 21 + y, 3, 1, COLORS.blade[2]);
  paint.rect(14 + x, 21 + y, 3, 1, COLORS.blade[2]);

  if (phase.pose === 'coil' || phase.pose === 'guarded' || phase.pose === 'recover') {
    paint.rect(4 + x, 11 + y, 3, 3, COLORS.gold[2]);
    paint.rect(18 + x, 11 + y, 3, 3, COLORS.gold[0]);
  }
  if (phase.pose === 'lean') {
    paint.rect(18 + x, 5 + y, 3, 3, COLORS.blade[2]);
  }
}

function drawRight(paint, phase) {
  const y = phase.bob || 0;
  const x = phase.drift || 0;
  const flare = Math.max(phase.flare || 0, 0);
  if (phase.pose === 'sweep') {
    paint.rect(3 + x, 11 + y, 9, 4, COLORS.binding[0]);
    paint.rect(4 + x, 12 + y, 7, 2, COLORS.blade[1]);
    paint.rect(2 + x, 10 + y, 3, 6, COLORS.gold[0]);
    paint.dot(2 + x, 9 + y, COLORS.blade[2]);
    paint.dot(2 + x, 16 + y, COLORS.blade[2]);
    paint.rect(10 + x, 9 + y, 6, 7, COLORS.gold[0]);
    paint.rect(11 + x, 10 + y, 4, 5, COLORS.void[0]);
    paint.rect(12 + x, 12 + y, 3, 1, COLORS.core);
    paint.rect(15 + x, 8 + y, 7, 8, COLORS.blade[0]);
    paint.rect(17 + x, 6 + y, 5, 4, COLORS.blade[2]);
    paint.rect(18 + x, 15 + y, 4, 2, COLORS.blade[1]);
    return;
  }

  paint.rect(10 + x, 2 + y, 3, 4, COLORS.blade[2]);
  paint.rect(14 + x, 2 + y, 3, 4, COLORS.gold[2]);
  paint.rect(18 + x, 2 + y, 3, 4, COLORS.blade[2]);
  paint.rect(11 + x, 4 + y, 10, 3, COLORS.blade[0]);
  paint.rect(12 + x, 7 + y, 9, 4, COLORS.blade[1]);
  paint.rect(19 + x, 5 + y, 2, 6, COLORS.blade[2]);
  paint.rect(13 + x, 5 + y, 4, 4, COLORS.void[0]);
  paint.rect(8 + x - flare, 10 + y, 13 + (flare * 2), 2, COLORS.gold[1]);
  paint.rect(10 + x, 10 + y, 10, 5, COLORS.gold[0]);
  paint.rect(11 + x, 11 + y, 7, 3, COLORS.void[0]);
  paint.rect(14 + x, 12 + y, 3 + flare, 1, COLORS.core);
  paint.rect(11 + x, 14 + y, 5, 7, COLORS.binding[0]);
  paint.rect(12 + x, 14 + y, 3, 7, COLORS.blade[1]);
  paint.rect(11 + x, 16 + y, 5, 1, COLORS.binding[2]);
  paint.rect(10 + x, 20 + y, 7, 2, COLORS.gold[0]);
  paint.rect(9 + x, 21 + y, 3, 1, COLORS.blade[2]);
  paint.rect(15 + x, 21 + y, 3, 1, COLORS.blade[2]);

  if (phase.pose === 'coil' || phase.pose === 'guarded' || phase.pose === 'recover') {
    paint.rect(7 + x, 11 + y, 3, 3, COLORS.gold[2]);
  }
  if (phase.pose === 'lean') {
    paint.rect(19 + x, 6 + y, 3, 3, COLORS.blade[2]);
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
  assert(phase, 'Crownmaw Greatblade animation ' + animation + ' frame ' + frame + ' is out of range.');
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

export function renderEnE08CrownmawGreatbladeFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Crownmaw Greatblade rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Crownmaw Greatblade direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'living-weapon',
    variant: 'crownmaw-greatblade',
    direction,
    animation,
    frame,
    phase: phase.name,
    crownmawGreatbladeGate: EN_E08_CROWNMAW_GREATBLADE_GATE.id,
    actorTopology: EN_E08_CROWNMAW_GREATBLADE_DATA.actorTopology,
    childAssetCount: EN_E08_CROWNMAW_GREATBLADE_DATA.childAssets.length,
    approvedPrecedingGate: EN_E08_VOWCOIL_GLAIVE_GATE.id,
    alphaPolicy: EN_E08_CROWNMAW_GREATBLADE_DATA.alphaPolicy,
    effectBoundary: EN_E08_CROWNMAW_GREATBLADE_DATA.effectBoundary,
  });
}

export const EN_E08_CROWNMAW_GREATBLADE_RENDERER = deepFreeze({
  key: 'en-e08-living-weapon-crownmaw-greatblade-v1',
  chassis: EN_E08_CROWNMAW_GREATBLADE_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'living-weapon', 'The EN-E08 Crownmaw Greatblade renderer is restricted to Living Weapon.');
    assert(variant.id === 'crownmaw-greatblade', 'The EN-E08 Crownmaw Greatblade renderer is restricted to Crownmaw Greatblade.');
    return renderEnE08CrownmawGreatbladeFrame(context, direction, animation.id, frame);
  },
});

const CROWNMAW_GREATBLADE_VARIANT = deepFreeze({
  id: 'crownmaw-greatblade',
  name: 'Crownmaw Greatblade',
  role: EN_E08_CROWNMAW_GREATBLADE_CONTRACT.role,
  status: EN_E08_CROWNMAW_GREATBLADE_CONTRACT.state,
  brief: 'A private complete elite Living Weapon with a broad symmetrical ash-steel crown blade, ivory edges, connected crimson slit core, old-gold jaw guard, short wine-wrapped grip, forked pommel, and true hover clearance; wielders, detached blades, loose chains, aura, glow, trails, projectiles, illumination, and impacts remain external.',
  rendererData: EN_E08_CROWNMAW_GREATBLADE_DATA,
});

export const EN_E08_CROWNMAW_GREATBLADE_FAMILY = deepFreeze({
  id: 'living-weapon',
  name: 'Living Weapon Crownmaw Greatblade Review',
  sliceId: 'EN-E08',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E08_CROWNMAW_GREATBLADE_CONTRACT.chassis,
  rendererKey: EN_E08_CROWNMAW_GREATBLADE_RENDERER.key,
  variants: [CROWNMAW_GREATBLADE_VARIANT],
  rendererData: {
    contractCard: EN_E08_LIVING_WEAPON_ELITE_CONTRACT_CARD.id,
    architectureDecision: EN_E08_LIVING_WEAPON_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E08_VOWCOIL_GLAIVE_GATE.id,
    activeGate: EN_E08_CROWNMAW_GREATBLADE_GATE.id,
  },
  review: {
    baselineVariant: 'crownmaw-greatblade',
    scale: 8,
    notes: 'Awaiting visual review as one connected baked hovering elite Crownmaw Greatblade against approved Vowcoil Glaive, approved Oathbite Cleaver, approved Crownvault Castellan, and public Fallen Knight Shieldbearer. Keep registration, fixtures, child assets, effects, EN-E09, release, accepted drift, and a pull request separate.',
  },
});

export const EN_E08_CROWNMAW_GREATBLADE_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E08_CROWNMAW_GREATBLADE_RENDERER],
  families: [EN_E08_CROWNMAW_GREATBLADE_FAMILY],
});
