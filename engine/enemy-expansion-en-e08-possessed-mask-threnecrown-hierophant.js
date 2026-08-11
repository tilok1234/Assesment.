import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E08_MOURNSEAL_CANTOR_GATE } from './enemy-expansion-en-e08-possessed-mask-mournseal-cantor.js';

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
  mask: ['#bfae86', '#675946', '#efe0b4'],
  void: ['#241427', '#0c0910', '#63304d'],
  shroud: ['#633347', '#321f30', '#96506a'],
  ribbon: ['#a77b3f', '#604522', '#dfb666'],
  eye: '#f06aa6',
  flash: '#f4f4f4',
});

export const EN_E08_POSSESSED_MASK_CONTRACT_CARD = deepFreeze({
  id: 'en-e08-possessed-mask-v1',
  sliceId: 'EN-E08',
  family: 'possessed-mask',
  familyName: 'Possessed Mask',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingVariant: {
    id: 'mournseal-cantor',
    name: 'Mournseal Cantor',
    role: 'specialist',
    status: 'approved-published',
  },
  activeVariant: {
    id: 'threnecrown-hierophant',
    name: 'Threnecrown Hierophant',
    role: 'elite',
    status: 'implemented-full-approved',
  },
  deferredRoles: [],
  styleContract: 'Use chunky one-to-three-pixel hard-alpha forms and one deterministic baked 24x24 actor. A broad bone mask with two readable eye sockets, nose ridge, mouth, cheek planes, connected torn shroud, and tether ribbons must read without a host body. All pieces remain connected actor pixels with true hover clearance; no detached mask, child asset, copied humanoid, aura, glow, particles, or projectile.',
  effectBoundary: 'Hosts, detached masks, alternate faces, possession overlays, aura, glow, spectral smoke, loose ribbons, afterimages, projectiles, impact flashes, floor light, and illumination remain external.',
});

export const EN_E08_THRENECROWN_HIEROPHANT_CONTRACT = deepFreeze({
  sliceId: 'EN-E08',
  family: 'possessed-mask',
  variant: 'threnecrown-hierophant',
  role: 'elite',
  state: 'implemented-complete-motion-approved',
  chassis: 'broad-sovereign-funerary-mask-three-prong-crown-brow-twin-rose-eyes-deep-cheek-panels-nose-ridge-barred-mouth-connected-tiered-mantle-gold-chain-tabs-hovering-mask-v1',
  silhouette: 'A broad monumental hovering funerary mask with a connected three-prong crown-brow, two deep eye sockets, heavy cheek panels, one long nose ridge, a readable barred mouth, wide jaw, connected gold chain tabs, and a three-tier crimson mantle. It must remain visibly related to Whisperveil Visage and Mournseal Cantor without copying either face proportion, shroud shape, palette, or attack pose, and must not read as a Ghost robe, Living Shadow humanoid, floating helmet, crown-only icon, slime, flame blob, or detached particle cluster.',
  identity: 'Dark aged ivory, obsidian-violet voids, crimson funerary mantle cloth, old-gold chain tabs, and two rose-magenta eyes establish a sovereign elite. The crown-brow, broad face, barred mouth, chain tabs, and tiered mantle remain one connected baked actor while hosts, detached masks, aura, glow, smoke, possession overlays, projectiles, and illumination stay external.',
  effectBoundary: EN_E08_POSSESSED_MASK_CONTRACT_CARD.effectBoundary,
});

export const EN_E08_THRENECROWN_HIEROPHANT_DATA = deepFreeze({
  actor: {
    species: 'possessed-mask',
    bodyBuild: 'broad-hovering-sovereign-mask-and-tiered-mantle',
    skin: 'dark-aged-ivory-funerary-mask',
    hairStyle: 'connected-three-prong-crown-and-gold-chain-tabs',
    hairColor: 'old-gold',
    expression: 'twin-rose-edict-and-barred-mouth',
    faceDetail: 'two-rose-eyes-heavy-cheeks-long-nose-ridge-barred-mouth-and-wide-jaw',
    headgear: 'self-contained-threnecrown-mask',
    outfit: 'connected-crimson-three-tier-mantle',
    outfitColor: 'crimson-obsidian-and-old-gold',
    outfitTier: 'tier3',
    weapon: 'body-owned-sovereign-edict',
    weaponTier: 'none',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.mask,
      hair: COLORS.ribbon,
      outfit: COLORS.shroud,
    },
  },
  threnecrownHierophant: COLORS,
  actorTopology: 'baked-single-actor',
  childAssets: [],
  alphaPolicy: 'binary-single-component-broad-sovereign-mask-three-prong-crown-twin-rose-eyes-heavy-cheeks-nose-barred-mouth-connected-tiered-mantle-gold-tabs-and-hover-clearance',
  effectBoundary: 'external-hosts-detached-masks-alternate-faces-possession-overlays-aura-glow-spectral-smoke-loose-chains-afterimages-projectiles-impacts-floor-light-and-illumination',
  bakedEffects: [],
});

export const EN_E08_THRENECROWN_HIEROPHANT_GATE = deepFreeze({
  id: 'en-e08-possessed-mask-threnecrown-hierophant-full-v1',
  status: 'approved',
  baseCheckpoint: '4f7a1146f1b90c8e70b819461d29a4be72cb379a',
  authorizedOn: '2026-08-11',
  authorizationEvidence: 'After the exact Mournseal Cantor packet was approved by the designer reply: approved lets do next, its bounded publication tuple was reconciled at clean remote-verified checkpoint 4f7a1146f1b90c8e70b819461d29a4be72cb379a. Mournseal Cantor completed the specialist role, so the one-complete-sprite cadence authorizes only one private elite Possessed Mask Threnecrown Hierophant 80-frame art candidate. Registration, fixtures, effects, Living Weapon, EN-E09, release, and a pull request remain closed.',
  approvedOn: '2026-08-11',
  approvalEvidence: 'The exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, the approved Mournseal Cantor and Whisperveil Visage plus public Spectral Ghost comparison, and both synchronized GIFs were presented. The three exact frozen PNG paths were open together in Aseprite. The designer replied: approved lets ddo next. In context this explicitly approves candidate digest 51ca678e1dee5e086d0fa439686c0e699b857b2ab00dfa4ab7a963546c11c81f and its five frozen review hashes only. The same reply may open only the Living Weapon actor-topology architecture decision after clean publication reconciliation; it does not select a topology or authorize Living Weapon art. Registration, fixtures, child assets, effects, EN-E09, release, accepted drift, a pull request, and any broader gate remain separate decisions.',
  approvedImplementation: '4bf12351ebe643520f052c08bacd385141231a3f',
  publicationAuthorizedOn: '2026-08-11',
  publicationAuthorizationEvidence: 'The designer said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact artifact or digest. It does not authorize registration, fixtures, effects, later roles or families, release, or any other unopened gate.',
  publishedImplementation: '4bf12351ebe643520f052c08bacd385141231a3f',
  publishedApprovalRecord: '3ba7a1c49aae4fd759df2912c7e16a8637039a83',
  initialPublishedHandoff: '15b2c26232d3098705b7704b6aee0d52ba2a18b9',
  publicationState: 'published',
  precedingApproval: {
    gateId: EN_E08_MOURNSEAL_CANTOR_GATE.id,
    artifactSha256: EN_E08_MOURNSEAL_CANTOR_GATE.artifactSha256,
    assembledArtifactSha256: EN_E08_MOURNSEAL_CANTOR_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E08_MOURNSEAL_CANTOR_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E08_MOURNSEAL_CANTOR_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E08_MOURNSEAL_CANTOR_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E08_MOURNSEAL_CANTOR_GATE.candidateFrameDigest,
    publishedImplementation: EN_E08_MOURNSEAL_CANTOR_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E08_MOURNSEAL_CANTOR_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E08_MOURNSEAL_CANTOR_GATE.initialPublishedHandoff,
    currentReconciliation: '4f7a1146f1b90c8e70b819461d29a4be72cb379a',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e08-possessed-mask-threnecrown-hierophant/en-e08-possessed-mask-threnecrown-hierophant-full-suite-raw.png',
  artifactSha256: '896121c269d76a8f7824e024b4ac74b9467ef33b4f27d09a0348a9fb81b3370d',
  assembledArtifact: 'enemy-expansion-review/en-e08-possessed-mask-threnecrown-hierophant/en-e08-possessed-mask-threnecrown-hierophant-full-suite-complete-b-form.png',
  assembledArtifactSha256: '54e5c643ae2a0aaf87e9af93a541c1db9b17b555fc9f548ad7bf59dacd03cc16',
  comparisonArtifact: 'enemy-expansion-review/en-e08-possessed-mask-threnecrown-hierophant/en-e08-possessed-mask-threnecrown-hierophant-spectral-comparison.png',
  comparisonArtifactSha256: 'a351d886d5a22264679512e9c2254bf7221922d18f0a9ebdffff17d337f507e8',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e08-possessed-mask-threnecrown-hierophant/en-e08-possessed-mask-threnecrown-hierophant-full-suite-four-directions-labeled.gif',
      sha256: '066fee337f72f091e4b6737a7e9f13bc4fcfcf48c7059ae6cc4ea47eff3d88e4',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e08-possessed-mask-threnecrown-hierophant/en-e08-possessed-mask-threnecrown-hierophant-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '193c268151ae42c818ff4c56f62dc6bf209e3adff21c0dc3afc6af244be78888',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
  },
  candidateFrameDigest: '51ca678e1dee5e086d0fa439686c0e699b857b2ab00dfa4ab7a963546c11c81f',
  mournsealCantorComparisonDigest: EN_E08_MOURNSEAL_CANTOR_GATE.candidateFrameDigest,
  whisperveilVisageComparisonDigest: 'c0fac02331632e028b73a21cadd4b472b1bdc18f7d4915b814e9a872dbc0b098',
  spectralGhostComparisonDigest: 'f373247db71b7472a8d64248c0e0e8d06eabfacee7e283db0db0a8fd3c305621',
  shadowSlimeComparisonDigest: '04725a8150c31914758c7185f9c9d82c7cc97c666ea306f291d63aba04eccee1',
  flameElementalComparisonDigest: '0df82667d385dbbf4b44c861922b231ffc4b1850ad037fdefc351935f6c9659c',
  scope: 'One complete 80-frame Threnecrown Hierophant elite Possessed Mask across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle seats the crown-brow and breathes the connected tiered mantle. Walk uses four sovereign hover phases with opposed gold-tab and mantle drift. Attack draws both connected chain tabs inward, seals the barred mouth, opens one body-owned sovereign edict without a projectile, and settles. Hurt uses a complete white recoil and a colored folded-mantle brace that preserves the crown-brow, eye sockets, nose ridge, barred mouth, wide jaw, tabs, and tiered silhouette. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and approved Mournseal Cantor plus approved Whisperveil Visage and public Spectral Ghost silhouette comparisons together.',
  exclusions: [
    'changes to approved Mournseal Cantor or Whisperveil Visage rendered pixels',
    'changes to approved Animated Armor rendered pixels',
    'public Possessed Mask registration',
    'public catalog exposure',
    'asset-pack fixture generation or regeneration',
    'new Cast pixels',
    'new Death pixels',
    'aura',
    'bloom',
    'glow',
    'detached masks',
    'host bodies',
    'loose ribbons',
    'spectral smoke',
    'afterimages',
    'trails',
    'light pools',
    'projectiles',
    'impact flashes',
    'illumination',
    'effects',
    'Living Weapon',
    'EN-E09 and later work',
    'release',
    'accepted drift',
  ],
  nextGate: 'The exact Threnecrown Hierophant implementation 4bf12351ebe643520f052c08bacd385141231a3f, approval record 3ba7a1c49aae4fd759df2912c7e16a8637039a83, and initial published handoff 15b2c26232d3098705b7704b6aee0d52ba2a18b9 are remote verified; this reconciliation completes the bounded publication tuple. The same approved lets ddo next reply opens only the Living Weapon actor-topology architecture decision from this clean published reconciliation; it does not select a topology or authorize Living Weapon art. Registration, fixtures, child assets, effects, EN-E09, release, accepted drift, and a pull request remain closed.',
});

export const EN_E08_THRENECROWN_HIEROPHANT_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const WALK_PHASES = deepFreeze([
  { name: 'left-ribbon-hover', pose: 'walk', bob: 0, drift: -1, flare: 0, tilt: 1 },
  { name: 'high-visage-pass', pose: 'walk', bob: -1, drift: 0, flare: 1, tilt: -1 },
  { name: 'right-ribbon-hover', pose: 'walk', bob: 0, drift: 1, flare: 0, tilt: -1 },
  { name: 'low-shroud-settle', pose: 'walk', bob: 1, drift: 0, flare: 0, tilt: 1 },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'gold-chain-tab-gather', pose: 'gather', bob: 0, drift: 0, flare: 0, tilt: 0 },
  { name: 'barred-mouth-seal', pose: 'seal', bob: -1, drift: 0, flare: 0, tilt: 1 },
  { name: 'body-owned-sovereign-edict', pose: 'edict', bob: 0, drift: 0, flare: 1, tilt: -1 },
  { name: 'threnecrown-settle', pose: 'recover', bob: 1, drift: 0, flare: 0, tilt: 0 },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-visage-recoil', pose: 'hurt', bob: 0, drift: -1, flare: 0, tilt: -1, flash: true },
  { name: 'colored-folded-shroud-brace', pose: 'brace', bob: 1, drift: 0, flare: 0, tilt: 1, flash: false },
]);

function phaseFor(animation, frame) {
  if (animation === 'idle') {
    assert(frame === 0 || frame === 1, 'Threnecrown Hierophant Idle frame ' + frame + ' is out of range.');
    return frame === 0
      ? { name: 'twin-rose-vigil', pose: 'idle', bob: 0, drift: 0, flare: 0, tilt: -1 }
      : { name: 'tiered-mantle-breath', pose: 'idle', bob: 1, drift: 0, flare: 1, tilt: 1 };
  }
  if (animation === 'walk') return WALK_PHASES[frame];
  if (animation === 'attack' || animation === 'cast') return ATTACK_PHASES[frame];
  if (animation === 'hurt') return HURT_PHASES[frame];
  if (animation === 'death') return HURT_PHASES[EN_E08_THRENECROWN_HIEROPHANT_DEATH_SOURCE_FRAMES[frame]];
  return null;
}

function createPixels() {
  return new Array(SIZE * SIZE).fill(null);
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert([x, y, width, height].every(Number.isInteger) && width > 0 && height > 0, 'Threnecrown Hierophant rectangles must use positive integer geometry.');
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Threnecrown Hierophant authored pixels must remain inside the 24x24 cell.');
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
  const tilt = phase.tilt || 0;

  // A connected three-tier crimson mantle establishes the broad elite body.
  paint.rect(3 + x - flare, 9 + y, 19 + (flare * 2), 7, COLORS.shroud[1]);
  paint.rect(4 + x - flare, 15 + y, 18 + (flare * 2), 3, COLORS.shroud[0]);
  paint.rect(6 + x - flare, 18 + y, 14 + (flare * 2), 3, COLORS.shroud[1]);

  // Connected mantle planes and gold chain tabs remain behind the face.
  paint.rect(6 + x, 8 + y, 13, 9, COLORS.shroud[0]);
  paint.rect(4 + x - flare, 10 + y, 4 + flare, 6, COLORS.shroud[1]);
  paint.rect(18 + x, 10 + y, 3 + flare, 6, COLORS.shroud[0]);
  paint.rect(5 + x - flare, 9 + y, 3 + flare, 2, COLORS.shroud[2]);
  paint.rect(18 + x, 9 + y, 2 + flare, 2, COLORS.shroud[2]);
  paint.rect(4 + x - flare, 12 + y, 3 + flare, 2, COLORS.ribbon[0]);
  paint.rect(19 + x, 12 + y, 2 + flare, 2, COLORS.ribbon[1]);
  paint.rect(6 + x, 16 + y, 6, 3, COLORS.shroud[1]);
  paint.rect(13 + x, 16 + y, 6, 3, COLORS.shroud[0]);
  paint.rect(7 + x - flare, 18 + y, 3, 2, COLORS.ribbon[1]);
  paint.rect(16 + x + flare, 18 + y, 3, 2, COLORS.ribbon[0]);
  paint.dot(7 + x - flare, 20 + y, COLORS.ribbon[2]);
  paint.dot(18 + x + flare, 20 + y, COLORS.ribbon[2]);

  // The broad sovereign mask carries a connected three-prong crown-brow.
  paint.rect(10 + x + Math.max(tilt, 0), 3 + y, 6, 1, COLORS.mask[1]);
  paint.rect(8 + x, 4 + y, 10, 2, COLORS.mask[0]);
  paint.rect(7 + x, 6 + y, 12, 4, COLORS.mask[0]);
  paint.rect(8 + x, 10 + y, 10, 4, COLORS.mask[0]);
  paint.rect(9 + x, 14 + y, 8, 3, COLORS.mask[0]);
  paint.rect(10 + x, 17 + y, 6, 1, COLORS.mask[1]);
  paint.rect(11 + x, 18 + y, 4, 1, COLORS.mask[1]);
  paint.rect(9 + x, 5 + y, 3, 1, COLORS.mask[2]);
  paint.rect(14 + x, 5 + y, 3, 1, COLORS.mask[2]);
  paint.rect(7 + x, 3 + y, 2, 4, COLORS.mask[1]);
  paint.rect(12 + x + Math.max(tilt, 0), 2 + y, 2, 5, COLORS.mask[2]);
  paint.rect(17 + x, 3 + y, 2, 4, COLORS.mask[1]);
  paint.rect(6 + x, 6 + y, 14, 2, COLORS.mask[0]);
  paint.rect(6 + x, 9 + y, 3, 6, COLORS.mask[1]);
  paint.rect(17 + x, 9 + y, 3, 6, COLORS.mask[1]);

  if (rear) {
    paint.rect(8 + x, 7 + y, 10, 4, COLORS.mask[1]);
    paint.rect(10 + x, 10 + y, 6, 5, COLORS.shroud[1]);
    paint.rect(11 + x, 11 + y, 4, 3, COLORS.ribbon[2]);
  } else {
    paint.rect(8 + x, 7 + y, 4, 2, COLORS.void[1]);
    paint.rect(14 + x, 7 + y, 4, 2, COLORS.void[1]);
    paint.dot(10 + x, 7 + y, COLORS.eye);
    paint.dot(15 + x, 7 + y, COLORS.eye);
    paint.rect(8 + x, 9 + y, 3, 4, COLORS.mask[1]);
    paint.rect(15 + x, 9 + y, 3, 4, COLORS.mask[1]);
    paint.rect(12 + x, 8 + y, 2, 5, COLORS.mask[2]);
    paint.dot(13 + x, 12 + y, COLORS.mask[1]);
    paint.rect(10 + x, 13 + y, 6, phase.pose === 'edict' ? 4 : 3, COLORS.void[0]);
    paint.rect(11 + x, 13 + y, 1, 3, COLORS.ribbon[2]);
    paint.rect(14 + x, 13 + y, 1, 3, COLORS.ribbon[2]);
  }

  if (phase.pose === 'gather') {
    paint.rect(6 + x, 12 + y, 4, 2, COLORS.ribbon[2]);
    paint.rect(16 + x, 12 + y, 4, 2, COLORS.ribbon[2]);
  } else if (phase.pose === 'seal' && !rear) {
    paint.rect(10 + x, 13 + y, 6, 3, COLORS.mask[1]);
    paint.rect(12 + x, 14 + y, 2, 1, COLORS.void[1]);
  } else if (phase.pose === 'recover' || phase.pose === 'brace') {
    paint.rect(6 + x, 13 + y, 5, 4, COLORS.shroud[1]);
    paint.rect(15 + x, 13 + y, 5, 4, COLORS.shroud[0]);
  }
}

function drawRight(paint, phase) {
  const y = phase.bob || 0;
  const x = phase.drift || 0;
  const flare = Math.max(phase.flare || 0, 0);
  const tilt = phase.tilt || 0;

  paint.rect(2 + x - flare, 9 + y, 17 + (flare * 2), 8, COLORS.shroud[1]);
  paint.rect(4 + x - flare, 16 + y, 15 + (flare * 2), 3, COLORS.shroud[0]);
  paint.rect(6 + x - flare, 18 + y, 12 + (flare * 2), 3, COLORS.shroud[1]);

  paint.rect(4 + x - flare, 8 + y, 12 + flare, 10, COLORS.shroud[0]);
  paint.rect(3 + x - flare, 10 + y, 4 + flare, 6, COLORS.shroud[1]);
  paint.rect(4 + x - flare, 9 + y, 4 + flare, 2, COLORS.shroud[2]);
  paint.rect(3 + x - flare, 12 + y, 4, 2, COLORS.ribbon[1]);
  paint.rect(5 + x, 17 + y, 5, 2, COLORS.shroud[1]);
  paint.rect(10 + x, 17 + y, 6, 2, COLORS.shroud[0]);
  paint.rect(5 + x - flare, 18 + y, 3, 2, COLORS.ribbon[0]);
  paint.rect(14 + x + flare, 18 + y, 3, 2, COLORS.ribbon[1]);
  paint.dot(5 + x - flare, 20 + y, COLORS.ribbon[2]);
  paint.dot(16 + x + flare, 20 + y, COLORS.ribbon[2]);

  paint.rect(12 + x + Math.max(tilt, 0), 3 + y, 5, 1, COLORS.mask[1]);
  paint.rect(10 + x, 3 + y, 2, 4, COLORS.mask[1]);
  paint.rect(14 + x + Math.max(tilt, 0), 2 + y, 2, 5, COLORS.mask[2]);
  paint.rect(18 + x, 4 + y, 2, 4, COLORS.mask[1]);
  paint.rect(9 + x, 6 + y, 11, 2, COLORS.mask[0]);
  paint.rect(10 + x, 4 + y, 8, 2, COLORS.mask[0]);
  paint.rect(9 + x, 6 + y, 10, 5, COLORS.mask[0]);
  paint.rect(10 + x, 11 + y, 9, 4, COLORS.mask[0]);
  paint.rect(11 + x, 15 + y, 7, 3, COLORS.mask[0]);
  paint.rect(12 + x, 18 + y, 5, 1, COLORS.mask[1]);
  paint.rect(17 + x, 8 + y, 3, 4, COLORS.mask[2]);
  paint.rect(19 + x, 10 + y, 2, 2, COLORS.mask[1]);
  paint.rect(14 + x, 7 + y, 4, 2, COLORS.void[1]);
  paint.dot(16 + x, 7 + y, COLORS.eye);
  paint.rect(14 + x, 9 + y, 3, 4, COLORS.mask[1]);
  paint.rect(17 + x, 13 + y, phase.pose === 'edict' ? 4 : 3, phase.pose === 'edict' ? 4 : 3, COLORS.void[0]);
  paint.rect(18 + x, 13 + y, 1, 3, COLORS.ribbon[2]);

  if (phase.pose === 'gather') {
    paint.rect(6 + x, 12 + y, 6, 2, COLORS.ribbon[2]);
  } else if (phase.pose === 'seal') {
    paint.rect(17 + x, 13 + y, 4, 3, COLORS.mask[1]);
    paint.dot(19 + x, 14 + y, COLORS.void[1]);
  } else if (phase.pose === 'recover' || phase.pose === 'brace') {
    paint.rect(6 + x, 13 + y, 6, 4, COLORS.shroud[1]);
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
  assert(phase, 'Threnecrown Hierophant animation ' + animation + ' frame ' + frame + ' is out of range.');
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

export function renderEnE08ThrenecrownHierophantFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Threnecrown Hierophant rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Threnecrown Hierophant direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'possessed-mask',
    variant: 'threnecrown-hierophant',
    direction,
    animation,
    frame,
    phase: phase.name,
    threnecrownHierophantGate: EN_E08_THRENECROWN_HIEROPHANT_GATE.id,
    actorTopology: EN_E08_THRENECROWN_HIEROPHANT_DATA.actorTopology,
    childAssetCount: EN_E08_THRENECROWN_HIEROPHANT_DATA.childAssets.length,
    approvedPrecedingGate: EN_E08_MOURNSEAL_CANTOR_GATE.id,
    alphaPolicy: EN_E08_THRENECROWN_HIEROPHANT_DATA.alphaPolicy,
    effectBoundary: EN_E08_THRENECROWN_HIEROPHANT_DATA.effectBoundary,
  });
}

export const EN_E08_THRENECROWN_HIEROPHANT_RENDERER = deepFreeze({
  key: 'en-e08-possessed-mask-threnecrown-hierophant-v1',
  chassis: EN_E08_THRENECROWN_HIEROPHANT_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'possessed-mask', 'The EN-E08 Threnecrown Hierophant renderer is restricted to Possessed Mask.');
    assert(variant.id === 'threnecrown-hierophant', 'The EN-E08 Threnecrown Hierophant renderer is restricted to Threnecrown Hierophant.');
    return renderEnE08ThrenecrownHierophantFrame(context, direction, animation.id, frame);
  },
});

const THRENECROWN_HIEROPHANT_VARIANT = deepFreeze({
  id: 'threnecrown-hierophant',
  name: 'Threnecrown Hierophant',
  role: EN_E08_THRENECROWN_HIEROPHANT_CONTRACT.role,
  status: EN_E08_THRENECROWN_HIEROPHANT_CONTRACT.state,
  brief: 'A private complete elite Possessed Mask with a broad monumental funerary face, connected three-prong crown-brow, two rose eyes, heavy cheek panels, long nose ridge, barred mouth, wide jaw, crimson tiered mantle, old-gold chain tabs, and true hover clearance; hosts, detached masks, aura, glow, smoke, loose chains, projectiles, illumination, and impacts remain external.',
  rendererData: EN_E08_THRENECROWN_HIEROPHANT_DATA,
});

export const EN_E08_THRENECROWN_HIEROPHANT_FAMILY = deepFreeze({
  id: 'possessed-mask',
  name: 'Possessed Mask Threnecrown Hierophant Review',
  sliceId: 'EN-E08',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E08_THRENECROWN_HIEROPHANT_CONTRACT.chassis,
  rendererKey: EN_E08_THRENECROWN_HIEROPHANT_RENDERER.key,
  variants: [THRENECROWN_HIEROPHANT_VARIANT],
  rendererData: {
    contractCard: EN_E08_POSSESSED_MASK_CONTRACT_CARD.id,
    approvedPrecedingGate: EN_E08_MOURNSEAL_CANTOR_GATE.id,
    activeGate: EN_E08_THRENECROWN_HIEROPHANT_GATE.id,
  },
  review: {
    baselineVariant: 'threnecrown-hierophant',
    scale: 8,
    notes: 'Visually approved as one connected baked hovering elite Threnecrown Hierophant against approved Mournseal Cantor and Whisperveil Visage plus public Spectral Ghost. Implementation 4bf12351ebe643520f052c08bacd385141231a3f records the exact accepted pixels. Keep registration, fixtures, child assets, effects, EN-E09, release, accepted drift, and a pull request separate; the same reply opens only the Living Weapon actor-topology architecture decision after clean publication reconciliation and does not authorize its art.',
  },
});

export const EN_E08_THRENECROWN_HIEROPHANT_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E08_THRENECROWN_HIEROPHANT_RENDERER],
  families: [EN_E08_THRENECROWN_HIEROPHANT_FAMILY],
});
