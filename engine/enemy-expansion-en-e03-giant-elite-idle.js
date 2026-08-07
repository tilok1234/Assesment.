import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E01_HUMANOID_RENDERER } from './enemy-expansion-humanoid.js';
import { EN_E03_BOULDER_HURLER_IDLE_GATE } from './enemy-expansion-en-e03-giant-specialist-idle.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E03_STORM_CLAN_JARL_IDLE_GATE = deepFreeze({
  id: 'en-e03-storm-clan-jarl-idle-v1',
  status: 'approved',
  authorizedOn: '2026-08-07',
  authorizationEvidence: 'Designer approved the exact full public-Enemy three-treatment export and said: awesome lets do next in plan. Codex explicitly bounded the continuation to Storm-Clan Jarl elite Idle F1-F2 across four directions.',
  revisionEvidence: 'Designer reviewed the first paired GIF candidate and said: his shoulder is kind of in wrong place in the side frames. The forward side-view pauldron was moved one row down and one pixel back to sit over the upper-arm joint in both exact mirrored directions.',
  approvedOn: '2026-08-07',
  approvalEvidence: 'Designer reviewed both exact corrected labeled all-four-direction raw and Complete B + Form Storm-Clan Jarl Idle GIFs together after the requested side-shoulder placement repair and said: approved.',
  precedingApproval: {
    gateId: EN_E03_BOULDER_HURLER_IDLE_GATE.id,
    artifactSha256: EN_E03_BOULDER_HURLER_IDLE_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_BOULDER_HURLER_IDLE_GATE.assembledArtifactSha256,
    rawAnimationSha256: EN_E03_BOULDER_HURLER_IDLE_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E03_BOULDER_HURLER_IDLE_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E03_BOULDER_HURLER_IDLE_GATE.candidateFrameDigest,
  },
  artifact: 'enemy-expansion-review/en-e03-storm-clan-jarl-idle/en-e03-storm-clan-jarl-idle-raw.png',
  artifactSha256: '776c57e70b20f7c0f0ab07ea344fab3e31082c028c08621498cf8b58d0b07c50',
  assembledArtifact: 'enemy-expansion-review/en-e03-storm-clan-jarl-idle/en-e03-storm-clan-jarl-idle-complete-b-form.png',
  assembledArtifactSha256: 'e0fd514dd9a9c26b50c221a5484f2832cee67e64e7a75eb08be56674f54c7768',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e03-storm-clan-jarl-idle/en-e03-storm-clan-jarl-idle-four-directions-labeled.gif',
      sha256: 'dad3d5b8deaf07ca565165a7db9f2f6159af399b107215a9e7c9f459103f6183', width: 192, height: 224, frames: 2, durationMs: 480,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e03-storm-clan-jarl-idle/en-e03-storm-clan-jarl-idle-four-directions-labeled-complete-b-form.gif',
      sha256: '3f173f215ad354fde8b387a6c507127bb15507e73f575bd843d1b82d55e25bdc', width: 192, height: 224, frames: 2, durationMs: 480,
    },
  },
  candidateFrameDigest: '3aebd8218877e0da9752b20df1256da4af2710927389006011a37479a5d14894',
  scope: 'Storm-Clan Jarl elite Idle F1-F2 only across Down, Left, Right, and Up, reviewed raw and with Complete B + Form beside the approved Boulder Hurler and Hill Breaker baselines.',
  identityContract: 'Layered storm-dark plate, oversized steel pauldrons, heavy bracers, and a broad bright-cyan clan sash distinguish the armored Jarl from the approved Giant baselines. Storm arcs, lightning, and impact cracks remain external effects and are not baked into actor pixels.',
  animationContract: 'A slow 480 ms grounded command-stance cycle: F2 settles the pauldrons and breastplate one row while the braced hands close inward and the clan sash follows the torso. Both slab-like feet remain controlled by the shared Idle chassis.',
  exclusions: [
    'Hill Breaker changes',
    'Boulder Hurler changes',
    'baked lightning pixels',
    'baked storm arc pixels',
    'baked impact crack pixels',
    'Centaur variants',
    'Satyr variants',
    'Walk',
    'Attack',
    'Cast',
    'Hurt',
    'Death',
    'registration',
    'consumer exposure',
    'effects',
    'release',
  ],
  nextGate: 'Visual approval is complete for this corrected bounded Storm-Clan Jarl Idle lane. No later animation, variant, registration, integration, effect, release, or EN-E03 work is authorized without a separate explicit continuation.',
});

export const EN_E03_STORM_CLAN_JARL_IDLE_DATA = deepFreeze({
  actor: {
    species: 'human',
    bodyBuild: 'sturdy',
    skin: 'tan',
    hairStyle: 'messy',
    hairColor: 'black',
    expression: 'angry',
    faceDetail: 'beard',
    headgear: 'none',
    outfit: 'plate',
    outfitColor: 'charcoal',
    outfitTier: 'tier2',
    weapon: 'none',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: ['#b9815b', '#704a38'],
      hair: ['#343039', '#1b1920'],
      outfit: ['#596675', '#303945'],
    },
  },
  clanBand: ['#71e3ef', '#178eac', '#b9fbff'],
  effectBoundary: 'external-storm-arc-and-impact-crack',
  bakedEffects: [],
});

const COLORS = deepFreeze({
  steel: ['#788a9c', '#3b4855', '#aab9c5'],
  darkSteel: ['#4e5b69', '#252d38'],
  leather: ['#70503b', '#3e2d27'],
  band: EN_E03_STORM_CLAN_JARL_IDLE_DATA.clanBand,
  gold: ['#d1a94e', '#735326'],
});

function createPainter(context, direction) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const rect = (x, y, width, height, fill) => {
    context.fillStyle = fill;
    context.fillRect(mirrored ? 24 - x - width : x, y, width, height);
  };
  return {
    view,
    rect,
    dot(x, y, fill) {
      rect(x, y, 1, 1, fill);
    },
  };
}

function drawDownIdentity({ rect, dot }, phase) {
  const { steel, darkSteel, leather, band, gold } = COLORS;
  const bob = phase;

  // Broad layered pauldrons retain a giant-leader silhouette without effects.
  rect(4, 10 + bob, 4, 2, darkSteel[1]);
  rect(5, 9 + bob, 3, 2, steel[0]);
  dot(6, 9 + bob, steel[2]);
  rect(16, 10 + bob, 4, 2, darkSteel[1]);
  rect(16, 9 + bob, 3, 2, steel[0]);
  dot(17, 9 + bob, steel[2]);

  rect(8, 11 + bob, 8, 5, darkSteel[0]);
  rect(9, 12 + bob, 6, 3, steel[1]);
  rect(10, 12 + bob, 4, 1, steel[0]);
  dot(11, 12 + bob, steel[2]);

  // A broad cloth sash, not a lightning zig-zag.
  rect(8, 12 + bob, 3, 1, band[1]);
  rect(9, 13 + bob, 4, 1, band[0]);
  rect(11, 14 + bob, 4, 1, band[0]);
  rect(13, 15 + bob, 3, 1, band[1]);
  dot(12, 14 + bob, band[2]);

  rect(7, 16 + bob, 10, 2, leather[1]);
  rect(8, 16 + bob, 8, 1, leather[0]);
  rect(11, 16 + bob, 2, 2, gold[1]);
  dot(12, 16 + bob, gold[0]);

  const leftX = phase === 0 ? 5 : 6;
  const rightX = phase === 0 ? 17 : 16;
  rect(leftX, 12 + bob, 2, 5, darkSteel[1]);
  rect(leftX, 13 + bob, 3, 2, steel[0]);
  rect(rightX, 12 + bob, 2, 5, darkSteel[1]);
  rect(rightX - 1, 13 + bob, 3, 2, steel[0]);
  dot(leftX + 1, 13 + bob, steel[2]);
  dot(rightX, 13 + bob, steel[2]);
  rect(leftX, 16 + bob, 3, 2, steel[1]);
  rect(rightX - 1, 16 + bob, 3, 2, steel[1]);
}

function drawUpIdentity({ rect, dot }, phase) {
  const { steel, darkSteel, leather, band, gold } = COLORS;
  const bob = phase;

  rect(4, 10 + bob, 4, 2, darkSteel[1]);
  rect(5, 9 + bob, 3, 2, steel[0]);
  dot(6, 9 + bob, steel[2]);
  rect(16, 10 + bob, 4, 2, darkSteel[1]);
  rect(16, 9 + bob, 3, 2, steel[0]);
  dot(17, 9 + bob, steel[2]);

  rect(8, 11 + bob, 8, 5, darkSteel[0]);
  rect(9, 12 + bob, 6, 3, steel[1]);
  rect(10, 12 + bob, 4, 1, steel[0]);

  rect(13, 12 + bob, 3, 1, band[1]);
  rect(11, 13 + bob, 4, 1, band[0]);
  rect(9, 14 + bob, 4, 1, band[0]);
  rect(8, 15 + bob, 3, 1, band[1]);
  dot(11, 14 + bob, band[2]);

  rect(7, 16 + bob, 10, 2, leather[1]);
  rect(8, 16 + bob, 8, 1, leather[0]);
  rect(11, 16 + bob, 2, 2, gold[1]);
  dot(12, 16 + bob, gold[0]);

  const leftX = phase === 0 ? 5 : 6;
  const rightX = phase === 0 ? 17 : 16;
  rect(leftX, 12 + bob, 2, 5, darkSteel[1]);
  rect(leftX, 13 + bob, 3, 2, steel[0]);
  rect(rightX, 12 + bob, 2, 5, darkSteel[1]);
  rect(rightX - 1, 13 + bob, 3, 2, steel[0]);
  rect(leftX, 16 + bob, 3, 2, steel[1]);
  rect(rightX - 1, 16 + bob, 3, 2, steel[1]);
}

function drawSideIdentity({ rect, dot }, phase) {
  const { steel, darkSteel, leather, band, gold } = COLORS;
  const bob = phase;

  rect(6, 10 + bob, 4, 2, darkSteel[1]);
  rect(6, 9 + bob, 3, 2, steel[0]);
  dot(7, 9 + bob, steel[2]);
  // Seat the forward pauldron on the upper-arm joint instead of beside the face.
  rect(13, 11 + bob, 5, 2, darkSteel[1]);
  rect(14, 10 + bob, 3, 2, steel[0]);
  rect(14, 10 + bob, 2, 1, steel[2]);

  rect(9, 11 + bob, 7, 5, darkSteel[0]);
  rect(10, 12 + bob, 5, 3, steel[1]);
  rect(11, 12 + bob, 3, 1, steel[0]);

  rect(9, 12 + bob, 3, 1, band[1]);
  rect(10, 13 + bob, 4, 1, band[0]);
  rect(12, 14 + bob, 4, 1, band[0]);
  rect(14, 15 + bob, 2, 1, band[1]);
  dot(13, 14 + bob, band[2]);

  rect(8, 16 + bob, 9, 2, leather[1]);
  rect(9, 16 + bob, 7, 1, leather[0]);
  rect(13, 16 + bob, 2, 2, gold[1]);
  dot(14, 16 + bob, gold[0]);

  const handX = phase === 0 ? 17 : 16;
  rect(handX, 12 + bob, 2, 5, darkSteel[1]);
  rect(handX - 1, 13 + bob, 3, 2, steel[0]);
  dot(handX, 13 + bob, steel[2]);
  rect(handX - 1, 16 + bob, 3, 2, steel[1]);
  rect(7, 13 + bob, 3, 4, darkSteel[1]);
  rect(7, 15 + bob, 3, 2, steel[1]);
}

function drawStormClanJarlIdentity(context, direction, phase) {
  const paint = createPainter(context, direction);
  if (paint.view === 'up') drawUpIdentity(paint, phase);
  else if (paint.view === 'right') drawSideIdentity(paint, phase);
  else drawDownIdentity(paint, phase);
}

function renderStormClanJarlIdle(args) {
  assert(args.family.id === 'giant', 'The EN-E03 Giant elite Idle renderer is restricted to Giant.');
  assert(args.variant.id === 'storm-clan-jarl', 'The EN-E03 Giant elite Idle renderer is restricted to Storm-Clan Jarl.');
  assert(args.animation.id === 'idle' && (args.frame === 0 || args.frame === 1), 'The EN-E03 Storm-Clan Jarl gate authorizes only two Idle frames.');
  const rendered = EN_E01_HUMANOID_RENDERER.render(args);
  drawStormClanJarlIdentity(args.context, args.direction, args.frame);
  return Object.freeze({
    ...rendered,
    stormClanJarlIdleGate: EN_E03_STORM_CLAN_JARL_IDLE_GATE.id,
    approvedPrecedingGate: EN_E03_BOULDER_HURLER_IDLE_GATE.id,
    effectBoundary: EN_E03_STORM_CLAN_JARL_IDLE_DATA.effectBoundary,
  });
}

export const EN_E03_STORM_CLAN_JARL_IDLE_RENDERER = Object.freeze({
  key: 'en-e03-storm-clan-jarl-idle-v1',
  chassis: EN_E01_HUMANOID_RENDERER.chassis,
  render: renderStormClanJarlIdle,
});

export const EN_E03_STORM_CLAN_JARL_IDLE_FAMILY = deepFreeze({
  id: 'giant',
  name: 'Giant',
  sliceId: 'EN-E03',
  rendererKey: EN_E03_STORM_CLAN_JARL_IDLE_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [{
    id: 'storm-clan-jarl',
    name: 'Storm-Clan Jarl',
    brief: 'Armored giant leader with a bright cyan clan sash; only the two-frame Idle identity baseline is implemented and storm effects remain external.',
    rendererData: EN_E03_STORM_CLAN_JARL_IDLE_DATA,
  }],
  rendererData: {
    contractCard: 'giant',
    approvedPrecedingGate: EN_E03_BOULDER_HURLER_IDLE_GATE.id,
    activeGate: EN_E03_STORM_CLAN_JARL_IDLE_GATE.id,
  },
  review: {
    baselineVariant: 'storm-clan-jarl',
    scale: 8,
    notes: 'Visually approved elite two-frame Idle baseline; internal, non-public, and effect-free.',
  },
});

export const EN_E03_STORM_CLAN_JARL_IDLE_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E03_STORM_CLAN_JARL_IDLE_RENDERER],
  families: [EN_E03_STORM_CLAN_JARL_IDLE_FAMILY],
});
