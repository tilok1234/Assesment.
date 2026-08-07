import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E03_CENTAUR_IDLE_GATE,
  EN_E03_CENTAUR_IDLE_REGISTRY,
  EN_E03_CENTAUR_IDLE_RENDERER,
} from './enemy-expansion-en-e03-centaur-idle.js';
import { EN_E03_STORM_CLAN_JARL_IDLE_GATE } from './enemy-expansion-en-e03-giant-elite-idle.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

const STEPPE_HUNTER_VARIANT = EN_E03_CENTAUR_IDLE_REGISTRY.families
  .find((family) => family.id === 'centaur')
  ?.variants.find((variant) => variant.id === 'steppe-hunter');

assert(STEPPE_HUNTER_VARIANT, 'The approved Steppe Hunter Idle chassis is required for Sun Lancer.');

export const EN_E03_SUN_LANCER_IDLE_GATE = deepFreeze({
  id: 'en-e03-sun-lancer-idle-v1',
  status: 'approved',
  authorizedOn: '2026-08-07',
  authorizationEvidence: 'After approving and publishing the corrected Storm-Clan Jarl Idle gate, the designer said: lets do next. Following the documented EN-E03 family order, Codex explicitly bounded the continuation to Sun Lancer specialist Idle F1-F2 across four directions.',
  approvedOn: '2026-08-07',
  approvalEvidence: 'Designer reviewed both exact labeled all-four-direction raw and Complete B + Form Sun Lancer Idle GIFs together and said: approved.',
  precedingApproval: {
    gateId: EN_E03_STORM_CLAN_JARL_IDLE_GATE.id,
    artifactSha256: EN_E03_STORM_CLAN_JARL_IDLE_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_STORM_CLAN_JARL_IDLE_GATE.assembledArtifactSha256,
    rawAnimationSha256: EN_E03_STORM_CLAN_JARL_IDLE_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E03_STORM_CLAN_JARL_IDLE_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E03_STORM_CLAN_JARL_IDLE_GATE.candidateFrameDigest,
  },
  approvedCentaurBaseline: {
    gateId: EN_E03_CENTAUR_IDLE_GATE.id,
    artifactSha256: EN_E03_CENTAUR_IDLE_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_CENTAUR_IDLE_GATE.assembledArtifactSha256,
    candidateFrameDigest: EN_E03_CENTAUR_IDLE_GATE.candidateFrameDigest,
  },
  artifact: 'enemy-expansion-review/en-e03-sun-lancer-idle/en-e03-sun-lancer-idle-raw.png',
  artifactSha256: 'e1bb41a818953dbcd1e11074da5fe1f115f83377697354493dd0ac730c247e47',
  assembledArtifact: 'enemy-expansion-review/en-e03-sun-lancer-idle/en-e03-sun-lancer-idle-complete-b-form.png',
  assembledArtifactSha256: '64057dfab7bb6d7eebbf2b3de6838e82c3f0b95d7923f7eedf303b1f5154a493',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e03-sun-lancer-idle/en-e03-sun-lancer-idle-four-directions-labeled.gif',
      sha256: '2d6198eba203f013fbbf2813cc6ef030995cbce566e1e845b25444b1ec9e513e', width: 192, height: 224, frames: 2, durationMs: 480,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e03-sun-lancer-idle/en-e03-sun-lancer-idle-four-directions-labeled-complete-b-form.gif',
      sha256: 'a8122bd75f6e3761c2215f499ee9c505107e0eb1ee5d2aeebf78514ff6ffae90', width: 192, height: 224, frames: 2, durationMs: 480,
    },
  },
  candidateFrameDigest: 'c195ab452409e722a9b6a9ca14a58b657033ba4c65943ea99fb03c5f180b394e',
  scope: 'Sun Lancer specialist Idle F1-F2 only across Down, Left, Right, and Up, reviewed raw and with Complete B + Form beside the approved Steppe Hunter Centaur baseline.',
  identityContract: 'The approved chestnut four-hoof Centaur chassis gains sun-gold rider armor, a red-gold saddle cloth, and a bright direction-aware lance pennant. Charge dust, spear trails, hoof shock rings, and every other movement effect remain external and are not baked into actor pixels.',
  animationContract: 'A slow 480 ms planted cavalry Idle cycle inherited from the approved Steppe Hunter: F2 lowers the rider and lance one row while the four hoof contacts remain fixed; the armor and pennant follow the rider without adding a charge pose.',
  exclusions: [
    'Steppe Hunter changes',
    'Banner Khan',
    'Giant changes',
    'Satyr changes',
    'baked charge dust pixels',
    'baked spear trail pixels',
    'baked hoof shock ring pixels',
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
  nextGate: 'Visual approval is complete for this bounded Sun Lancer Idle lane. No later animation, variant, registration, integration, effect, release, or EN-E03 work is authorized without a separate explicit continuation.',
});

export const EN_E03_SUN_LANCER_IDLE_DATA = deepFreeze({
  actor: {
    species: 'human',
    bodyBuild: 'classic',
    skin: 'tan',
    hairStyle: 'ponytail',
    hairColor: 'brown',
    expression: 'determined',
    faceDetail: 'none',
    headgear: 'none',
    outfit: 'plate',
    outfitColor: 'crimson',
    outfitTier: 'tier2',
    weapon: 'none',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: ['#c79262', '#83563d'],
      hair: ['#66402c', '#35251d'],
      outfit: ['#d94b32', '#7f2a2c', '#ff9b42'],
    },
  },
  horse: {
    hide: ['#9a613d', '#5d3c2a'],
    hideHighlight: '#bd7b4d',
    hoof: ['#41312a', '#211a18'],
    wood: ['#8b603a', '#4b3525'],
    spearhead: ['#f2df9b', '#957245'],
    accent: ['#e3b54d', '#8c4a2c', '#fff1a0'],
  },
  specialist: {
    armor: ['#e3b54d', '#8c4a2c', '#fff1a0'],
    cloth: ['#d94b32', '#7f2a2c', '#ff9b42'],
    pennant: ['#f0643d', '#a52f30', '#ffd96b'],
    leather: ['#7b4a31', '#3f2c26'],
  },
  effectBoundary: 'external-charge-dust-spear-trail-and-hoof-shock-ring',
  bakedEffects: [],
});

function createPainter(context, direction) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Sun Lancer rectangles must use positive integer geometry.',
    );
    context.fillStyle = fill;
    context.fillRect(mirrored ? SIZE - x - width : x, y, width, height);
  };
  return {
    view,
    rect,
    dot(x, y, fill) {
      rect(x, y, 1, 1, fill);
    },
  };
}

function drawDownTack({ rect, dot }) {
  const { armor, cloth, leather } = EN_E03_SUN_LANCER_IDLE_DATA.specialist;
  rect(8, 14, 8, 2, cloth[0]);
  rect(9, 16, 6, 1, cloth[1]);
  rect(8, 14, 8, 1, armor[1]);
  dot(12, 14, armor[2]);
  rect(7, 16, 2, 1, leather[0]);
  rect(15, 16, 2, 1, leather[1]);
}

function drawUpTack({ rect, dot }) {
  const { armor, cloth, leather } = EN_E03_SUN_LANCER_IDLE_DATA.specialist;
  rect(8, 14, 8, 2, cloth[1]);
  rect(9, 16, 6, 1, cloth[0]);
  rect(8, 14, 8, 1, armor[1]);
  dot(15, 14, armor[2]);
  rect(7, 16, 2, 1, leather[1]);
  rect(15, 16, 2, 1, leather[0]);
}

function drawSideTack({ rect, dot }) {
  const { armor, cloth, leather } = EN_E03_SUN_LANCER_IDLE_DATA.specialist;
  rect(9, 13, 8, 2, cloth[0]);
  rect(10, 15, 6, 2, cloth[1]);
  rect(9, 13, 8, 1, armor[1]);
  dot(16, 13, armor[2]);
  rect(9, 16, 2, 1, leather[1]);
  rect(15, 16, 2, 1, leather[0]);
}

function drawDownRider({ rect, dot }, phase) {
  const { armor, cloth } = EN_E03_SUN_LANCER_IDLE_DATA.specialist;
  const bob = phase;
  rect(8, 10 + bob, 8, 2, cloth[1]);
  rect(9, 11 + bob, 6, 3, armor[0]);
  rect(10, 12 + bob, 4, 2, armor[1]);
  rect(7, 10 + bob, 3, 2, armor[1]);
  rect(15, 10 + bob, 3, 2, armor[0]);
  dot(8, 10 + bob, armor[2]);
  dot(16, 10 + bob, armor[2]);
  rect(11, 11 + bob, 3, 1, cloth[0]);
  dot(12, 12 + bob, armor[2]);
  rect(9, 4 + bob, 7, 1, armor[1]);
  rect(10, 4 + bob, 5, 1, armor[0]);
  dot(11, 4 + bob, armor[2]);
}

function drawUpRider({ rect, dot }, phase) {
  const { armor, cloth } = EN_E03_SUN_LANCER_IDLE_DATA.specialist;
  const bob = phase;
  rect(8, 10 + bob, 8, 2, cloth[1]);
  rect(9, 11 + bob, 6, 3, armor[1]);
  rect(10, 12 + bob, 4, 2, armor[0]);
  rect(7, 10 + bob, 3, 2, armor[0]);
  rect(15, 10 + bob, 3, 2, armor[1]);
  dot(8, 10 + bob, armor[2]);
  dot(16, 10 + bob, armor[2]);
  rect(11, 11 + bob, 3, 1, cloth[0]);
  dot(13, 12 + bob, armor[2]);
  rect(9, 4 + bob, 7, 1, armor[1]);
  rect(10, 4 + bob, 5, 1, armor[0]);
  dot(14, 4 + bob, armor[2]);
}

function drawSideRider({ rect, dot }, phase) {
  const { armor, cloth } = EN_E03_SUN_LANCER_IDLE_DATA.specialist;
  const bob = phase;
  rect(10, 9 + bob, 7, 3, cloth[1]);
  rect(11, 10 + bob, 6, 4, armor[0]);
  rect(12, 12 + bob, 5, 2, armor[1]);
  rect(16, 9 + bob, 3, 2, armor[1]);
  rect(16, 10 + bob, 3, 2, armor[0]);
  dot(17, 10 + bob, armor[2]);
  rect(12, 10 + bob, 3, 1, cloth[0]);
  dot(15, 12 + bob, armor[2]);
  rect(11, 4 + bob, 7, 1, armor[1]);
  rect(12, 4 + bob, 5, 1, armor[0]);
  dot(16, 4 + bob, armor[2]);
}

function drawDownPennant({ rect, dot }, phase) {
  const { pennant, armor } = EN_E03_SUN_LANCER_IDLE_DATA.specialist;
  const bob = phase;
  rect(16, 5 + bob, 3, 1, pennant[0]);
  rect(17, 6 + bob, 2, 1, pennant[0]);
  dot(18, 7 + bob, pennant[1]);
  dot(16, 5 + bob, pennant[2]);
  dot(19, 5 + bob, armor[0]);
}

function drawUpPennant({ rect, dot }, phase) {
  const { pennant, armor } = EN_E03_SUN_LANCER_IDLE_DATA.specialist;
  const bob = phase;
  rect(5, 5 + bob, 3, 1, pennant[0]);
  rect(5, 6 + bob, 2, 1, pennant[0]);
  dot(5, 7 + bob, pennant[1]);
  dot(7, 5 + bob, pennant[2]);
  dot(4, 5 + bob, armor[0]);
}

function drawSidePennant({ rect, dot }, phase) {
  const { pennant, armor } = EN_E03_SUN_LANCER_IDLE_DATA.specialist;
  const bob = phase;
  rect(22, 5 + bob, 1, 3, pennant[0]);
  dot(21, 5 + bob, pennant[2]);
  dot(22, 7 + bob, pennant[1]);
  dot(21, 6 + bob, armor[0]);
}

function drawSunLancerIdentity(context, direction, phase) {
  const paint = createPainter(context, direction);
  if (paint.view === 'up') {
    drawUpTack(paint);
    drawUpRider(paint, phase);
    drawUpPennant(paint, phase);
  } else if (paint.view === 'right') {
    drawSideTack(paint);
    drawSideRider(paint, phase);
    drawSidePennant(paint, phase);
  } else {
    drawDownTack(paint);
    drawDownRider(paint, phase);
    drawDownPennant(paint, phase);
  }
}

function renderSunLancerIdle(args) {
  assert(args.family.id === 'centaur', 'The EN-E03 Centaur specialist Idle renderer is restricted to Centaur.');
  assert(args.variant.id === 'sun-lancer', 'The EN-E03 Centaur specialist Idle renderer is restricted to Sun Lancer.');
  assert(args.animation.id === 'idle' && (args.frame === 0 || args.frame === 1), 'The EN-E03 Sun Lancer gate authorizes only two Idle frames.');
  const rendered = EN_E03_CENTAUR_IDLE_RENDERER.render({
    ...args,
    variant: STEPPE_HUNTER_VARIANT,
  });
  drawSunLancerIdentity(args.context, args.direction, args.frame);
  return Object.freeze({
    ...rendered,
    sunLancerIdleGate: EN_E03_SUN_LANCER_IDLE_GATE.id,
    approvedPrecedingGate: EN_E03_STORM_CLAN_JARL_IDLE_GATE.id,
    approvedCentaurBaselineGate: EN_E03_CENTAUR_IDLE_GATE.id,
    effectBoundary: EN_E03_SUN_LANCER_IDLE_DATA.effectBoundary,
  });
}

export const EN_E03_SUN_LANCER_IDLE_RENDERER = Object.freeze({
  key: 'en-e03-sun-lancer-idle-v1',
  chassis: EN_E03_CENTAUR_IDLE_RENDERER.chassis,
  render: renderSunLancerIdle,
});

export const EN_E03_SUN_LANCER_IDLE_FAMILY = deepFreeze({
  id: 'centaur',
  name: 'Centaur',
  sliceId: 'EN-E03',
  rendererKey: EN_E03_SUN_LANCER_IDLE_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [{
    id: 'sun-lancer',
    name: 'Sun Lancer',
    brief: 'Fast cavalry specialist with sun-gold armor and a bright lance pennant; only the two-frame Idle identity baseline is implemented and charge effects remain external.',
    rendererData: EN_E03_SUN_LANCER_IDLE_DATA,
  }],
  rendererData: {
    contractCard: 'centaur',
    approvedPrecedingGate: EN_E03_STORM_CLAN_JARL_IDLE_GATE.id,
    approvedCentaurBaselineGate: EN_E03_CENTAUR_IDLE_GATE.id,
    activeGate: EN_E03_SUN_LANCER_IDLE_GATE.id,
  },
  review: {
    baselineVariant: 'sun-lancer',
    scale: 8,
    notes: 'Specialist two-frame Idle acceptance candidate; internal, non-public, and effect-free pending visual approval.',
  },
});

export const EN_E03_SUN_LANCER_IDLE_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E03_SUN_LANCER_IDLE_RENDERER],
  families: [EN_E03_SUN_LANCER_IDLE_FAMILY],
});
