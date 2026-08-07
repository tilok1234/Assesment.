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
import { EN_E03_SUN_LANCER_IDLE_GATE } from './enemy-expansion-en-e03-centaur-specialist-idle.js';

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

assert(STEPPE_HUNTER_VARIANT, 'The approved Steppe Hunter Idle chassis is required for Banner Khan.');

export const EN_E03_BANNER_KHAN_IDLE_GATE = deepFreeze({
  id: 'en-e03-banner-khan-idle-v1',
  status: 'approved',
  authorizedOn: '2026-08-07',
  authorizationEvidence: 'After approving and publishing the Sun Lancer Idle gate, the designer said: lets do next. Following the documented EN-E03 Centaur role order, Codex explicitly bounded the continuation to Banner Khan elite Idle F1-F2 across four directions.',
  approvedOn: '2026-08-07',
  approvalEvidence: 'Designer reviewed both exact labeled all-four-direction raw and Complete B + Form Banner Khan Idle r3 GIFs together and said: approved.',
  revisionEvidence: 'Designer found the first Banner Khan candidate weird, then found the targeted repair still had too much wrong and requested a from-scratch rebuild. Both earlier identities were discarded. The new candidate delegates only the approved Steppe Hunter chassis and redraws the complete elite identity with a visible face, compact conical helm, segmented lamellar armor, limited saddle drape, and a separated tapered war standard. On the from-scratch candidate, the designer said the side-frame face was bad because it was just straight lines; this revision replaces only both mirrored side faces with a stepped forehead, protruding nose, visible eye, cheek, and tapered jaw. The designer then said the mouth was too long in the side frames; this revision separates the cheek and jaw tones and reduces the mouth to one front pixel. The designer subsequently identified the pale horizontal side-profile streak; this revision preserves the one-pixel mouth and replaces only the six-pixel light fur bar with a compact stepped two-tone collar. The designer then requested horse-body motion; F2 now adds a Banner Khan-only planted torso weight shift while every leg and hoof pixel remains delegated byte-exact.',
  precedingApproval: {
    gateId: EN_E03_SUN_LANCER_IDLE_GATE.id,
    artifactSha256: EN_E03_SUN_LANCER_IDLE_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_SUN_LANCER_IDLE_GATE.assembledArtifactSha256,
    rawAnimationSha256: EN_E03_SUN_LANCER_IDLE_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E03_SUN_LANCER_IDLE_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E03_SUN_LANCER_IDLE_GATE.candidateFrameDigest,
  },
  approvedCentaurBaseline: {
    gateId: EN_E03_CENTAUR_IDLE_GATE.id,
    artifactSha256: EN_E03_CENTAUR_IDLE_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_CENTAUR_IDLE_GATE.assembledArtifactSha256,
    candidateFrameDigest: EN_E03_CENTAUR_IDLE_GATE.candidateFrameDigest,
  },
  artifact: 'enemy-expansion-review/en-e03-banner-khan-idle/en-e03-banner-khan-idle-r3-raw.png',
  artifactSha256: '6221555094b9876ff1aad5f04b7a20327ea4f79bde7d06116f2f95f07a2836e1',
  assembledArtifact: 'enemy-expansion-review/en-e03-banner-khan-idle/en-e03-banner-khan-idle-r3-complete-b-form.png',
  assembledArtifactSha256: 'f4420a5c827762b699fa0007e168a484247fc0cb1a82623ec18c5cf510cc9b92',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e03-banner-khan-idle/en-e03-banner-khan-idle-r3-four-directions-labeled.gif',
      sha256: '1b93946a596213cb02460624fd3c4e5c0640f5202e86783fbdbbe34e73d15a10', width: 192, height: 224, frames: 2, durationMs: 480,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e03-banner-khan-idle/en-e03-banner-khan-idle-r3-four-directions-labeled-complete-b-form.gif',
      sha256: '298ad981961f9025c46fbcc3a255345ac8127fc2ce052303106b3606610e9e97', width: 192, height: 224, frames: 2, durationMs: 480,
    },
  },
  candidateFrameDigest: '61c80740b96c2a35ccd8382335299c6521049f139c1c4df57e4852480663b3d6',
  scope: 'Banner Khan elite Idle F1-F2 only across Down, Left, Right, and Up, reviewed raw and with Complete B + Form beside the approved Sun Lancer and Steppe Hunter Centaur baselines.',
  identityContract: 'The approved chestnut four-hoof Centaur chassis gains a visible khan face, compact conical steel helm, segmented blue-steel lamellar armor, crimson command sash, limited crimson saddle drape, and a separated direction-aware tapered war standard with a gold mark. Command aura, banner flare, hoof shock rings, and every other movement effect remain external and are not baked into actor pixels.',
  animationContract: 'A slow 480 ms planted warlord Idle cycle based on the approved Steppe Hunter: F2 lowers the rider, armor, and war standard one row and adds a Banner Khan-only horse-torso weight shift while every leg and all four hoof contacts remain fixed.',
  exclusions: [
    'Steppe Hunter changes',
    'Sun Lancer changes',
    'Giant changes',
    'Satyr changes',
    'baked command aura pixels',
    'baked banner flare pixels',
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
  nextGate: 'Visual approval is complete for this bounded Banner Khan Idle lane. No later animation, variant, registration, integration, effect, release, or EN-E03 work is authorized without a separate explicit continuation.',
});

export const EN_E03_BANNER_KHAN_IDLE_DATA = deepFreeze({
  actor: {
    species: 'human',
    bodyBuild: 'classic',
    skin: 'tan',
    hairStyle: 'ponytail',
    hairColor: 'black',
    expression: 'stern',
    faceDetail: 'beard',
    headgear: 'none',
    outfit: 'plate',
    outfitColor: 'steel',
    outfitTier: 'tier2',
    weapon: 'none',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: ['#c79262', '#83563d'],
      hair: ['#3c2c28', '#1f1a1a'],
      outfit: ['#52616d', '#29333c', '#9aa7aa'],
    },
  },
  horse: {
    hide: ['#9a613d', '#5d3c2a'],
    hideHighlight: '#bd7b4d',
    hoof: ['#41312a', '#211a18'],
    wood: ['#8b603a', '#4b3525'],
    spearhead: ['#f2df9b', '#957245'],
    accent: ['#c28c3b', '#6f4726', '#f0cf77'],
  },
  elite: {
    armor: ['#52616d', '#29333c', '#9aa7aa'],
    trim: ['#c28c3b', '#6f4726', '#f0cf77'],
    cloth: ['#8d3442', '#471f2b', '#cf6259'],
    banner: ['#a8323e', '#5b1d28', '#e4b64d'],
    fur: ['#d3c4a1', '#776957'],
    leather: ['#6f4731', '#34261f'],
  },
  effectBoundary: 'external-command-aura-banner-flare-and-hoof-shock-ring',
  bakedEffects: [],
});

function createPainter(context, direction) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Banner Khan rectangles must use positive integer geometry.',
    );
    context.fillStyle = fill;
    context.fillRect(mirrored ? SIZE - x - width : x, y, width, height);
  };
  const clear = (x, y, width, height) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Banner Khan clears must use positive integer geometry.',
    );
    context.clearRect(mirrored ? SIZE - x - width : x, y, width, height);
  };
  return {
    view,
    rect,
    clear,
    dot(x, y, fill) {
      rect(x, y, 1, 1, fill);
    },
  };
}

function drawDownStandard({ rect, dot }, phase) {
  const { banner, trim } = EN_E03_BANNER_KHAN_IDLE_DATA.elite;
  const bob = phase;
  rect(20, 2 + bob, 3, 2, banner[0]);
  rect(20, 4 + bob, 2, 1, banner[1]);
  dot(20, 5 + bob, banner[1]);
  dot(21, 3 + bob, banner[2]);
  dot(22, 2 + bob, trim[2]);
}

function drawUpStandard({ rect, dot }, phase) {
  const { banner, trim } = EN_E03_BANNER_KHAN_IDLE_DATA.elite;
  const bob = phase;
  rect(1, 2 + bob, 3, 2, banner[0]);
  rect(2, 4 + bob, 2, 1, banner[1]);
  dot(3, 5 + bob, banner[1]);
  dot(2, 3 + bob, banner[2]);
  dot(1, 2 + bob, trim[2]);
}

function drawSideStandard({ rect, dot }, phase) {
  const { banner, trim } = EN_E03_BANNER_KHAN_IDLE_DATA.elite;
  const bob = phase;
  rect(16, 1 + bob, 5, 1, banner[0]);
  rect(17, 2 + bob, 4, 1, banner[0]);
  rect(18, 3 + bob, 3, 1, banner[1]);
  dot(19, 2 + bob, banner[2]);
  dot(20, 1 + bob, trim[2]);
}

function drawDownTack({ rect, dot }, rear) {
  const { cloth, leather, trim } = EN_E03_BANNER_KHAN_IDLE_DATA.elite;
  rect(9, 13, 6, 2, rear ? cloth[1] : cloth[0]);
  rect(10, 15, 4, 2, rear ? cloth[0] : cloth[1]);
  rect(9, 13, 6, 1, trim[1]);
  dot(rear ? 13 : 11, 14, trim[2]);
  dot(9, 15, leather[0]);
  dot(14, 15, leather[1]);
}

function drawSideTack({ rect, dot }) {
  const { cloth, leather, trim } = EN_E03_BANNER_KHAN_IDLE_DATA.elite;
  rect(11, 12, 6, 2, cloth[0]);
  rect(12, 14, 5, 3, cloth[1]);
  rect(11, 12, 6, 1, trim[1]);
  dot(15, 13, trim[2]);
  dot(11, 15, leather[1]);
  dot(16, 16, trim[0]);
}

export function drawBannerKhanHorseIdleMotion(context, direction, phase) {
  if (phase === 0) return;
  const paint = createPainter(context, direction);
  const { rect, clear, dot } = paint;
  const { hide, hideHighlight } = EN_E03_BANNER_KHAN_IDLE_DATA.horse;
  if (paint.view === 'right') {
    rect(6, 12, 3, 1, hide[0]);
    clear(19, 13, 1, 1);
    dot(5, 13, hide[0]);
    dot(19, 14, hide[0]);
    dot(7, 12, hideHighlight);
    dot(19, 15, hideHighlight);
    return;
  }
  clear(6, 16, 1, 1);
  clear(17, 16, 1, 1);
  dot(6, 15, hide[0]);
  dot(17, 15, hide[0]);
  rect(8, 15, 2, 1, hide[0]);
  dot(15, 15, hide[0]);
  dot(7, 15, hideHighlight);
  dot(16, 15, hideHighlight);
}

function drawDownRider({ rect, dot }, phase, rear) {
  const { armor, cloth, fur, trim } = EN_E03_BANNER_KHAN_IDLE_DATA.elite;
  const bob = phase;
  rect(9, 9 + bob, 6, 1, rear ? fur[1] : fur[0]);
  rect(8, 10 + bob, 8, 2, armor[1]);
  rect(9, 12 + bob, 6, 2, armor[0]);
  rect(7, 10 + bob, 2, 2, armor[1]);
  rect(15, 10 + bob, 2, 2, armor[0]);
  rect(rear ? 12 : 11, 10 + bob, 2, 4, cloth[0]);
  dot(9, 11 + bob, trim[0]);
  dot(14, 12 + bob, trim[2]);
  rect(10, 4 + bob, 5, 1, armor[1]);
  rect(11, 3 + bob, 3, 1, armor[0]);
  dot(12, 2 + bob, trim[2]);
  dot(10, 4 + bob, trim[0]);
  dot(14, 4 + bob, trim[0]);
}

function drawSideRider({ rect, clear, dot }, phase) {
  const { armor, cloth, fur, trim } = EN_E03_BANNER_KHAN_IDLE_DATA.elite;
  const { skin, hair } = EN_E03_BANNER_KHAN_IDLE_DATA.actor.palette;
  const bob = phase;
  clear(10, 5 + bob, 8, 4);
  rect(11, 5 + bob, 3, 3, hair[0]);
  dot(11, 7 + bob, hair[1]);
  rect(13, 5 + bob, 4, 2, skin[0]);
  dot(17, 6 + bob, skin[0]);
  dot(16, 6 + bob, hair[1]);
  dot(14, 7 + bob, skin[1]);
  dot(15, 7 + bob, skin[0]);
  dot(16, 7 + bob, hair[1]);
  rect(10, 9 + bob, 8, 2, armor[1]);
  rect(11, 11 + bob, 7, 3, armor[0]);
  rect(9, 9 + bob, 2, 2, armor[1]);
  rect(16, 9 + bob, 3, 2, armor[0]);
  rect(14, 10 + bob, 2, 4, cloth[0]);
  dot(12, 8 + bob, fur[1]);
  rect(13, 8 + bob, 2, 1, fur[0]);
  dot(15, 8 + bob, fur[1]);
  dot(11, 9 + bob, fur[1]);
  dot(16, 9 + bob, fur[1]);
  dot(11, 10 + bob, trim[0]);
  dot(17, 11 + bob, trim[2]);
  rect(12, 4 + bob, 5, 1, armor[1]);
  rect(13, 3 + bob, 3, 1, armor[0]);
  dot(14, 2 + bob, trim[2]);
  dot(16, 4 + bob, trim[0]);
}

export function drawBannerKhanIdentity(context, direction, phase) {
  const paint = createPainter(context, direction);
  if (paint.view === 'up') {
    drawUpStandard(paint, phase);
    drawDownTack(paint, true);
    drawDownRider(paint, phase, true);
  } else if (paint.view === 'right') {
    drawSideStandard(paint, phase);
    drawSideTack(paint);
    drawSideRider(paint, phase);
  } else {
    drawDownStandard(paint, phase);
    drawDownTack(paint, false);
    drawDownRider(paint, phase, false);
  }
}

function renderBannerKhanIdle(args) {
  assert(args.family.id === 'centaur', 'The EN-E03 Centaur elite Idle renderer is restricted to Centaur.');
  assert(args.variant.id === 'banner-khan', 'The EN-E03 Centaur elite Idle renderer is restricted to Banner Khan.');
  assert(args.animation.id === 'idle' && (args.frame === 0 || args.frame === 1), 'The EN-E03 Banner Khan gate authorizes only two Idle frames.');
  const rendered = EN_E03_CENTAUR_IDLE_RENDERER.render({
    ...args,
    variant: STEPPE_HUNTER_VARIANT,
  });
  drawBannerKhanHorseIdleMotion(args.context, args.direction, args.frame);
  drawBannerKhanIdentity(args.context, args.direction, args.frame);
  return Object.freeze({
    ...rendered,
    bannerKhanIdleGate: EN_E03_BANNER_KHAN_IDLE_GATE.id,
    approvedPrecedingGate: EN_E03_SUN_LANCER_IDLE_GATE.id,
    approvedCentaurBaselineGate: EN_E03_CENTAUR_IDLE_GATE.id,
    horseMotion: 'banner-khan-planted-torso-weight-shift',
    effectBoundary: EN_E03_BANNER_KHAN_IDLE_DATA.effectBoundary,
  });
}

export const EN_E03_BANNER_KHAN_IDLE_RENDERER = Object.freeze({
  key: 'en-e03-banner-khan-idle-v1',
  chassis: EN_E03_CENTAUR_IDLE_RENDERER.chassis,
  render: renderBannerKhanIdle,
});

export const EN_E03_BANNER_KHAN_IDLE_FAMILY = deepFreeze({
  id: 'centaur',
  name: 'Centaur',
  sliceId: 'EN-E03',
  rendererKey: EN_E03_BANNER_KHAN_IDLE_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [{
    id: 'banner-khan',
    name: 'Banner Khan',
    brief: 'Elite Centaur warlord with a visible face, compact conical helm, segmented lamellar armor, crimson command cloth, and a tapered war standard; only the two-frame Idle identity baseline is implemented and command effects remain external.',
    rendererData: EN_E03_BANNER_KHAN_IDLE_DATA,
  }],
  rendererData: {
    contractCard: 'centaur',
    approvedPrecedingGate: EN_E03_SUN_LANCER_IDLE_GATE.id,
    approvedCentaurBaselineGate: EN_E03_CENTAUR_IDLE_GATE.id,
    activeGate: EN_E03_BANNER_KHAN_IDLE_GATE.id,
  },
  review: {
    baselineVariant: 'banner-khan',
    scale: 8,
    notes: 'Visually approved from-scratch elite two-frame Idle baseline; internal, non-public, and effect-free.',
  },
});

export const EN_E03_BANNER_KHAN_IDLE_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E03_BANNER_KHAN_IDLE_RENDERER],
  families: [EN_E03_BANNER_KHAN_IDLE_FAMILY],
});
