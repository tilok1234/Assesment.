import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E08_THRENECROWN_HIEROPHANT_GATE } from './enemy-expansion-en-e08-possessed-mask-threnecrown-hierophant.js';
import { EN_E08_CROWNVAULT_CASTELLAN_GATE } from './enemy-expansion-en-e08-animated-armor-crownvault-castellan.js';

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
  blade: ['#9aa7a5', '#4b565a', '#d9e1d8'],
  rust: ['#985b39', '#563527', '#cc8550'],
  binding: ['#60364d', '#33202f', '#96627b'],
  void: ['#1c151d', '#09080b', '#452b3d'],
  core: '#62e4cf',
  flash: '#f4f4f4',
});

export const EN_E08_LIVING_WEAPON_TOPOLOGY_DECISION = deepFreeze({
  id: 'en-e08-living-weapon-baked-single-actor-v1',
  sliceId: 'EN-E08',
  status: 'selected',
  selected: 'baked-single-actor',
  selectedOn: '2026-08-11',
  baseCheckpoint: '6f2a51739a65b88f8c50644e92e440c8004cc049',
  selectionEvidence: 'After the exact Threnecrown Hierophant publication tuple was reconciled at clean remote-verified checkpoint 6f2a51739a65b88f8c50644e92e440c8004cc049, the designer was given the recommended deterministic baked 24x24 single-actor topology with zero child assets. The designer replied: awesome lets do next. In that immediate architecture-choice context, this selects the recommendation for Living Weapon and authorizes only one private common Oathbite Cleaver art candidate.',
  frameOwnership: 'Blade, spine, inset core, chipped edge, claw guard, wrapped grip, binding bands, pommel, and short connected tassel are authored into one deterministic 24x24 Enemy pixel array for every frame.',
  childAssets: [],
  forbidden: [
    'deterministic child/state exports',
    'separate blade assets',
    'separate hilt or guard assets',
    'separate eye or core assets',
    'runtime attachment offsets',
    'incidental per-frame child offsets',
    'schema changes',
    'exporter changes',
    'validator changes',
    'frame-contract changes',
  ],
  reopenRule: 'Any later request for a wielder, detachable blade, orbiting weapon, weapon swap, or separate animated core must stop at a new explicit architecture gate rather than silently extending this content-only renderer.',
});

export const EN_E08_LIVING_WEAPON_CONTRACT_CARD = deepFreeze({
  id: 'en-e08-living-weapon-v1',
  sliceId: 'EN-E08',
  family: 'living-weapon',
  familyName: 'Living Weapon',
  roleOrder: ['common', 'specialist', 'elite'],
  activeVariant: {
    id: 'oathbite-cleaver',
    name: 'Oathbite Cleaver',
    role: 'common',
    identity: 'cursed-cleaver-default',
    status: 'implemented-full-approved',
  },
  deferredRoles: [
    { role: 'specialist', status: 'planned-unnamed' },
    { role: 'elite', status: 'planned-unnamed' },
  ],
  actorTopology: EN_E08_LIVING_WEAPON_TOPOLOGY_DECISION.selected,
  styleContract: 'Use chunky one-to-three-pixel hard-alpha forms and one deterministic baked 24x24 actor. A broad chipped cleaver, heavy spine, readable inset core, hooked edge, connected claw guard, wrapped grip, pommel, and short tassel must read as the weapon itself acting as the body. All pieces remain connected actor pixels with true hover clearance; no wielder, detached blade, child asset, aura, glow, trail, particle, or projectile.',
  effectBoundary: 'Wielders, detached or swapped blades, orbiting weapons, separate cores, aura, bloom, glow, smoke, loose chains, trails, afterimages, projectiles, impacts, floor light, and illumination remain external.',
});

export const EN_E08_OATHBITE_CLEAVER_CONTRACT = deepFreeze({
  sliceId: 'EN-E08',
  family: 'living-weapon',
  variant: 'oathbite-cleaver',
  role: 'common',
  state: 'implemented-complete-motion-approved',
  topology: EN_E08_LIVING_WEAPON_TOPOLOGY_DECISION.selected,
  chassis: 'baked-broad-chipped-cleaver-heavy-spine-single-teal-core-hooked-edge-connected-claw-guard-wrapped-grip-pommel-short-tassel-hovering-weapon-v1',
  silhouette: 'A broad vertical hovering cleaver with a clipped crown, heavy dark spine, chipped bright edge, one readable inset core, hooked lower blade, wide connected claw guard, wrapped grip, squared pommel, and short connected tassel. It must read as a weapon acting as the entire creature rather than Animated Armor holding a sword, a Fallen Knight, a Possessed Mask, a thin inventory icon, an upright humanoid, or a detached particle cluster.',
  identity: 'Cold weathered steel, soot-dark recesses, old rust-orange guard planes, wine binding wraps, and one bright teal core establish a cursed common weapon. The blade, core, guard, grip, pommel, and tassel remain one connected baked actor while wielders, detached parts, aura, glow, trails, projectiles, impacts, and illumination stay external.',
  effectBoundary: EN_E08_LIVING_WEAPON_CONTRACT_CARD.effectBoundary,
});

export const EN_E08_OATHBITE_CLEAVER_DATA = deepFreeze({
  actor: {
    species: 'living-weapon',
    bodyBuild: 'broad-hovering-cleaver',
    skin: 'weathered-steel-blade',
    hairStyle: 'connected-short-binding-tassel',
    hairColor: 'wine-binding',
    expression: 'single-teal-core-vigil',
    faceDetail: 'inset-core-heavy-spine-chipped-edge-and-hooked-lower-blade',
    headgear: 'none',
    outfit: 'connected-rust-claw-guard-and-wrapped-grip',
    outfitColor: 'cold-steel-rust-wine-and-teal',
    outfitTier: 'tier1',
    weapon: 'self',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.blade,
      hair: COLORS.binding,
      outfit: COLORS.rust,
    },
  },
  oathbiteCleaver: COLORS,
  actorTopology: EN_E08_LIVING_WEAPON_TOPOLOGY_DECISION.selected,
  childAssets: [],
  alphaPolicy: 'binary-single-component-broad-cleaver-heavy-spine-single-core-chipped-edge-hooked-blade-connected-claw-guard-wrapped-grip-pommel-short-tassel-and-hover-clearance',
  effectBoundary: EN_E08_LIVING_WEAPON_CONTRACT_CARD.effectBoundary,
  bakedEffects: [],
});

export const EN_E08_OATHBITE_CLEAVER_GATE = deepFreeze({
  id: 'en-e08-living-weapon-oathbite-cleaver-full-v1',
  status: 'approved',
  baseCheckpoint: '6f2a51739a65b88f8c50644e92e440c8004cc049',
  authorizedOn: '2026-08-11',
  authorizationEvidence: 'After the exact Threnecrown Hierophant publication tuple was reconciled at clean remote-verified checkpoint 6f2a51739a65b88f8c50644e92e440c8004cc049, the designer was given the recommended deterministic baked 24x24 single-actor Living Weapon topology with zero child assets and replied: awesome lets do next. In that immediate choice context, the reply selects topology decision en-e08-living-weapon-baked-single-actor-v1 and authorizes only one private common Living Weapon Oathbite Cleaver 80-frame art candidate. Registration, fixtures, child assets, effects, later roles, EN-E09, release, and a pull request remain closed.',
  architectureDecision: EN_E08_LIVING_WEAPON_TOPOLOGY_DECISION.id,
  approvedOn: '2026-08-11',
  approvalEvidence: 'The exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, the approved Threnecrown Hierophant and Crownvault Castellan plus public Fallen Knight Shieldbearer silhouette comparison, and both synchronized GIFs were presented. The three exact frozen PNG paths were open together in Aseprite. The designer replied: approved lets do next. In context this explicitly approves candidate digest 6aba171cd7960766078e0fefd6e08cda2313d9f1b8e110d74ad4e78325d58a46 and its five frozen review hashes only. The same reply may open only one private specialist Living Weapon art candidate after clean publication reconciliation. Registration, fixtures, child assets, effects, the elite role, EN-E09, release, accepted drift, a pull request, and any broader gate remain separate decisions.',
  approvedImplementation: 'ceafc0badba8c31876cfa3c8055091ba752dbf5d',
  publicationAuthorizedOn: '2026-08-11',
  publicationAuthorizationEvidence: 'The designer said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact artifact or digest. It does not authorize registration, fixtures, effects, later roles or families, release, or any other unopened gate.',
  publishedImplementation: 'ceafc0badba8c31876cfa3c8055091ba752dbf5d',
  publishedApprovalRecord: '1c506640bb270c49815f0de357e9cb051b715cee',
  initialPublishedHandoff: null,
  publicationState: 'published-awaiting-handoff-reconciliation',
  precedingApproval: {
    gateId: EN_E08_THRENECROWN_HIEROPHANT_GATE.id,
    artifactSha256: EN_E08_THRENECROWN_HIEROPHANT_GATE.artifactSha256,
    assembledArtifactSha256: EN_E08_THRENECROWN_HIEROPHANT_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E08_THRENECROWN_HIEROPHANT_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E08_THRENECROWN_HIEROPHANT_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E08_THRENECROWN_HIEROPHANT_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E08_THRENECROWN_HIEROPHANT_GATE.candidateFrameDigest,
    publishedImplementation: EN_E08_THRENECROWN_HIEROPHANT_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E08_THRENECROWN_HIEROPHANT_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E08_THRENECROWN_HIEROPHANT_GATE.initialPublishedHandoff,
    currentReconciliation: '6f2a51739a65b88f8c50644e92e440c8004cc049',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e08-living-weapon-oathbite-cleaver/en-e08-living-weapon-oathbite-cleaver-full-suite-raw.png',
  artifactSha256: '9eb25986699b4331d213f884c9c6c9db75a9334a095a1974d01a3b6b0c45d209',
  assembledArtifact: 'enemy-expansion-review/en-e08-living-weapon-oathbite-cleaver/en-e08-living-weapon-oathbite-cleaver-full-suite-complete-b-form.png',
  assembledArtifactSha256: '284df6320e8f90d0cad0251e7c7f14268ba88e1d47c1d90519cdd54c15838889',
  comparisonArtifact: 'enemy-expansion-review/en-e08-living-weapon-oathbite-cleaver/en-e08-living-weapon-oathbite-cleaver-silhouette-comparison.png',
  comparisonArtifactSha256: '1d2cfd7dcc318b266127871aaf49d628b8d8f12a0e549cccdbbc9fde789a9530',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e08-living-weapon-oathbite-cleaver/en-e08-living-weapon-oathbite-cleaver-full-suite-four-directions-labeled.gif',
      sha256: 'f8c13d15116219752b07b983cdbc20a83e0fa43cec737fc48ed433459329a22c',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e08-living-weapon-oathbite-cleaver/en-e08-living-weapon-oathbite-cleaver-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: 'cc08c221d67a08ae720b839c20a9ecf04b4e355c1a97df787ec900deaae537ce',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
  },
  candidateFrameDigest: '6aba171cd7960766078e0fefd6e08cda2313d9f1b8e110d74ad4e78325d58a46',
  threnecrownHierophantComparisonDigest: EN_E08_THRENECROWN_HIEROPHANT_GATE.candidateFrameDigest,
  crownvaultCastellanComparisonDigest: EN_E08_CROWNVAULT_CASTELLAN_GATE.candidateFrameDigest,
  fallenKnightComparisonDigest: EN_E08_CROWNVAULT_CASTELLAN_GATE.fallenKnightComparisonDigest,
  scope: 'One complete 80-frame Oathbite Cleaver common Living Weapon across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle holds the heavy cleaver upright and pulses the inset core. Walk uses four directional hover phases with opposed blade drift and binding flex. Attack braces, raises, drives one body-owned cleaving stroke without a trail or projectile, and recovers. Hurt uses a complete white recoil and a colored guarded brace that preserves the blade, spine, core, hooked edge, claw guard, grip, pommel, and tassel silhouette. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and approved Threnecrown Hierophant plus approved Crownvault Castellan and public Fallen Knight Shieldbearer silhouette comparisons together.',
  exclusions: [
    'changes to approved Threnecrown Hierophant rendered pixels',
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
    'Living Weapon specialist or elite',
    'EN-E09 and later work',
    'release',
    'accepted drift',
  ],
  nextGate: 'The exact Oathbite Cleaver implementation ceafc0badba8c31876cfa3c8055091ba752dbf5d and approval record 1c506640bb270c49815f0de357e9cb051b715cee are remote verified. Only the initial published handoff and final reconciliation remain open under standing publication permission. The same approved lets do next reply opens only one private specialist Living Weapon art candidate after this tuple is clean and remote verified. Registration, fixtures, child assets, effects, the elite role, EN-E09, release, accepted drift, and a pull request remain closed.',
});

export const EN_E08_OATHBITE_CLEAVER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const WALK_PHASES = deepFreeze([
  { name: 'left-edge-hover', pose: 'walk', bob: 0, drift: -1, flare: 0, tilt: 1 },
  { name: 'high-core-pass', pose: 'walk', bob: -1, drift: 0, flare: 1, tilt: -1 },
  { name: 'right-edge-hover', pose: 'walk', bob: 0, drift: 1, flare: 0, tilt: -1 },
  { name: 'low-pommel-settle', pose: 'walk', bob: 1, drift: 0, flare: 0, tilt: 1 },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'claw-guard-brace', pose: 'brace', bob: 0, drift: 0, flare: 0, tilt: -1 },
  { name: 'heavy-blade-raise', pose: 'raise', bob: -1, drift: 0, flare: 0, tilt: 1 },
  { name: 'body-owned-cleaving-stroke', pose: 'chop', bob: 0, drift: 0, flare: 1, tilt: 0 },
  { name: 'oathbite-recover', pose: 'recover', bob: 1, drift: 0, flare: 0, tilt: 0 },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-cleaver-recoil', pose: 'hurt', bob: 0, drift: -1, flare: 0, tilt: -1, flash: true },
  { name: 'colored-guarded-brace', pose: 'guarded', bob: 1, drift: 0, flare: 0, tilt: 1, flash: false },
]);

function phaseFor(animation, frame) {
  if (animation === 'idle') {
    assert(frame === 0 || frame === 1, 'Oathbite Cleaver Idle frame ' + frame + ' is out of range.');
    return frame === 0
      ? { name: 'inset-core-vigil', pose: 'idle', bob: 0, drift: 0, flare: 0, tilt: -1 }
      : { name: 'binding-pulse', pose: 'idle', bob: 1, drift: 0, flare: 1, tilt: 1 };
  }
  if (animation === 'walk') return WALK_PHASES[frame];
  if (animation === 'attack' || animation === 'cast') return ATTACK_PHASES[frame];
  if (animation === 'hurt') return HURT_PHASES[frame];
  if (animation === 'death') return HURT_PHASES[EN_E08_OATHBITE_CLEAVER_DEATH_SOURCE_FRAMES[frame]];
  return null;
}

function createPixels() {
  return new Array(SIZE * SIZE).fill(null);
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert([x, y, width, height].every(Number.isInteger) && width > 0 && height > 0, 'Oathbite Cleaver rectangles must use positive integer geometry.');
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Oathbite Cleaver authored pixels must remain inside the 24x24 cell.');
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
  if (phase.pose === 'chop') {
    paint.rect(3 + x, 7 + y, 15, 2, COLORS.blade[1]);
    paint.rect(4 + x, 9 + y, 17, 5, COLORS.blade[0]);
    paint.rect(5 + x, 14 + y, 14, 2, COLORS.blade[2]);
    paint.rect(18 + x, 10 + y, 3, 3, COLORS.blade[2]);
    paint.rect(9 + x, 8 + y, 5, 3, COLORS.void[0]);
    if (!rear) paint.dot(11 + x, 9 + y, COLORS.core);
    paint.rect(6 + x, 15 + y, 13, 2, COLORS.rust[1]);
    paint.rect(9 + x, 17 + y, 7, 2, COLORS.rust[0]);
    paint.rect(11 + x, 19 + y, 3, 2, COLORS.binding[0]);
    return;
  }

  // Broad cleaver body: heavy spine, bright chipped edge, and hooked heel.
  paint.rect(10 + x, 2 + y, 6, 2, COLORS.blade[1]);
  paint.rect(8 + x, 4 + y, 9, 2, COLORS.blade[0]);
  paint.rect(7 + x, 6 + y, 11, 5, COLORS.blade[0]);
  paint.rect(7 + x, 11 + y, 10, 2, COLORS.blade[0]);
  paint.rect(8 + x, 13 + y, 8, 2, COLORS.blade[0]);
  paint.rect(7 + x, 6 + y, 2, 7, COLORS.blade[1]);
  paint.rect(16 + x, 5 + y, 2, 6, COLORS.blade[2]);
  paint.rect(15 + x, 11 + y, 2, 3, COLORS.blade[2]);
  paint.rect(17 + x, 8 + y, 2, 3, COLORS.blade[2]);
  paint.dot(16 + x, 5 + y, COLORS.void[1]);
  paint.dot(17 + x, 9 + y, COLORS.void[1]);

  if (rear) {
    paint.rect(9 + x, 6 + y, 6, 5, COLORS.blade[1]);
    paint.dot(10 + x, 7 + y, COLORS.rust[2]);
    paint.dot(14 + x, 10 + y, COLORS.rust[2]);
  } else {
    paint.rect(9 + x, 6 + y, 6, 4, COLORS.void[0]);
    paint.rect(10 + x, 7 + y, 4, 2, COLORS.void[1]);
    paint.dot(11 + x, 7 + y, COLORS.core);
    paint.rect(9 + x, 11 + y, 5, 1, COLORS.rust[2]);
  }

  // Connected claw guard, grip, pommel, and short tassel complete the actor.
  paint.rect(5 + x - flare, 14 + y, 15 + (flare * 2), 2, COLORS.rust[1]);
  paint.rect(7 + x - flare, 13 + y, 4 + flare, 2, COLORS.rust[0]);
  paint.rect(15 + x, 13 + y, 4 + flare, 2, COLORS.rust[2]);
  paint.rect(8 + x, 16 + y, 9, 1, COLORS.rust[0]);
  paint.rect(10 + x, 17 + y, 5, 3, COLORS.binding[0]);
  paint.rect(10 + x, 18 + y, 5, 1, COLORS.binding[1]);
  paint.rect(12 + x, 17 + y, 1, 3, COLORS.binding[2]);
  paint.rect(10 + x, 19 + y, 5, 1, COLORS.binding[1]);
  paint.dot(12 + x, 20 + y, COLORS.binding[2]);

  if (phase.pose === 'brace' || phase.pose === 'guarded' || phase.pose === 'recover') {
    paint.rect(6 + x, 12 + y, 4, 3, COLORS.rust[1]);
    paint.rect(16 + x, 12 + y, 3, 3, COLORS.rust[0]);
  }
}

function drawRight(paint, phase) {
  const y = phase.bob || 0;
  const x = phase.drift || 0;
  const flare = Math.max(phase.flare || 0, 0);
  if (phase.pose === 'chop') {
    paint.rect(3 + x, 7 + y, 14, 2, COLORS.blade[1]);
    paint.rect(5 + x, 9 + y, 16, 5, COLORS.blade[0]);
    paint.rect(6 + x, 14 + y, 13, 2, COLORS.blade[2]);
    paint.rect(18 + x, 7 + y, 3, 5, COLORS.blade[2]);
    paint.rect(12 + x, 8 + y, 5, 3, COLORS.void[0]);
    paint.dot(15 + x, 9 + y, COLORS.core);
    paint.rect(7 + x, 15 + y, 12, 2, COLORS.rust[1]);
    paint.rect(10 + x, 17 + y, 7, 2, COLORS.rust[0]);
    paint.rect(12 + x, 19 + y, 3, 2, COLORS.binding[0]);
    return;
  }

  paint.rect(12 + x, 2 + y, 5, 2, COLORS.blade[1]);
  paint.rect(10 + x, 4 + y, 7, 2, COLORS.blade[0]);
  paint.rect(9 + x, 6 + y, 9, 5, COLORS.blade[0]);
  paint.rect(9 + x, 11 + y, 8, 2, COLORS.blade[0]);
  paint.rect(10 + x, 13 + y, 7, 2, COLORS.blade[0]);
  paint.rect(9 + x, 6 + y, 2, 7, COLORS.blade[1]);
  paint.rect(16 + x, 5 + y, 2, 6, COLORS.blade[2]);
  paint.rect(17 + x, 9 + y, 2, 3, COLORS.blade[2]);
  paint.rect(12 + x, 6 + y, 5, 4, COLORS.void[0]);
  paint.dot(14 + x, 7 + y, COLORS.core);
  paint.rect(6 + x - flare, 14 + y, 14 + (flare * 2), 2, COLORS.rust[1]);
  paint.rect(8 + x, 13 + y, 4, 2, COLORS.rust[0]);
  paint.rect(16 + x, 13 + y, 3 + flare, 2, COLORS.rust[2]);
  paint.rect(9 + x, 16 + y, 9, 1, COLORS.rust[0]);
  paint.rect(11 + x, 17 + y, 5, 3, COLORS.binding[0]);
  paint.rect(11 + x, 18 + y, 5, 1, COLORS.binding[1]);
  paint.rect(13 + x, 17 + y, 1, 3, COLORS.binding[2]);
  paint.rect(11 + x, 19 + y, 5, 1, COLORS.binding[1]);
  paint.dot(13 + x, 20 + y, COLORS.binding[2]);

  if (phase.pose === 'brace' || phase.pose === 'guarded' || phase.pose === 'recover') {
    paint.rect(7 + x, 12 + y, 5, 3, COLORS.rust[1]);
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
  assert(phase, 'Oathbite Cleaver animation ' + animation + ' frame ' + frame + ' is out of range.');
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

export function renderEnE08OathbiteCleaverFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Oathbite Cleaver rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Oathbite Cleaver direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'living-weapon',
    variant: 'oathbite-cleaver',
    direction,
    animation,
    frame,
    phase: phase.name,
    oathbiteCleaverGate: EN_E08_OATHBITE_CLEAVER_GATE.id,
    actorTopology: EN_E08_OATHBITE_CLEAVER_DATA.actorTopology,
    childAssetCount: EN_E08_OATHBITE_CLEAVER_DATA.childAssets.length,
    approvedPrecedingGate: EN_E08_THRENECROWN_HIEROPHANT_GATE.id,
    alphaPolicy: EN_E08_OATHBITE_CLEAVER_DATA.alphaPolicy,
    effectBoundary: EN_E08_OATHBITE_CLEAVER_DATA.effectBoundary,
  });
}

export const EN_E08_OATHBITE_CLEAVER_RENDERER = deepFreeze({
  key: 'en-e08-living-weapon-oathbite-cleaver-v1',
  chassis: EN_E08_OATHBITE_CLEAVER_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'living-weapon', 'The EN-E08 Oathbite Cleaver renderer is restricted to Living Weapon.');
    assert(variant.id === 'oathbite-cleaver', 'The EN-E08 Oathbite Cleaver renderer is restricted to Oathbite Cleaver.');
    return renderEnE08OathbiteCleaverFrame(context, direction, animation.id, frame);
  },
});

const OATHBITE_CLEAVER_VARIANT = deepFreeze({
  id: 'oathbite-cleaver',
  name: 'Oathbite Cleaver',
  role: EN_E08_OATHBITE_CLEAVER_CONTRACT.role,
  status: EN_E08_OATHBITE_CLEAVER_CONTRACT.state,
  brief: 'A private complete common Living Weapon with a broad chipped cleaver, heavy spine, one teal inset core, hooked bright edge, connected rust claw guard, wine-wrapped grip, squared pommel, short connected tassel, and true hover clearance; wielders, detached blades, aura, glow, trails, projectiles, illumination, and impacts remain external.',
  rendererData: EN_E08_OATHBITE_CLEAVER_DATA,
});

export const EN_E08_OATHBITE_CLEAVER_FAMILY = deepFreeze({
  id: 'living-weapon',
  name: 'Living Weapon Oathbite Cleaver Review',
  sliceId: 'EN-E08',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E08_OATHBITE_CLEAVER_CONTRACT.chassis,
  rendererKey: EN_E08_OATHBITE_CLEAVER_RENDERER.key,
  variants: [OATHBITE_CLEAVER_VARIANT],
  rendererData: {
    contractCard: EN_E08_LIVING_WEAPON_CONTRACT_CARD.id,
    architectureDecision: EN_E08_LIVING_WEAPON_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E08_THRENECROWN_HIEROPHANT_GATE.id,
    activeGate: EN_E08_OATHBITE_CLEAVER_GATE.id,
  },
  review: {
    baselineVariant: 'oathbite-cleaver',
    scale: 8,
    notes: 'Awaiting visual review as one connected baked hovering common Oathbite Cleaver against approved Threnecrown Hierophant and Crownvault Castellan plus public Fallen Knight Shieldbearer. Keep registration, fixtures, child assets, effects, the specialist and elite roles, EN-E09, release, accepted drift, and a pull request separate.',
  },
});

export const EN_E08_OATHBITE_CLEAVER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E08_OATHBITE_CLEAVER_RENDERER],
  families: [EN_E08_OATHBITE_CLEAVER_FAMILY],
});
