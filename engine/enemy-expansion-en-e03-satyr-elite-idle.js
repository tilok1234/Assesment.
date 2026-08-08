import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E01_HUMANOID_RENDERER } from './enemy-expansion-humanoid.js';
import {
  drawSatyrCalibrationIdentity,
  EN_E03_BRIAR_REVELER_CALIBRATION_DATA,
} from './enemy-expansion-en-e03-satyr-calibration.js';
import {
  drawSatyrIdleF2Identity,
  EN_E03_SATYR_IDLE_GATE,
} from './enemy-expansion-en-e03-satyr-idle.js';
import { EN_E03_REED_CHARMER_MOTION_GATE } from './enemy-expansion-en-e03-satyr-specialist-motion.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E03_WILDWOOD_HORNLORD_IDLE_GATE = deepFreeze({
  id: 'en-e03-wildwood-hornlord-idle-v1',
  status: 'approved',
  authorizedOn: '2026-08-08',
  authorizationEvidence: 'After approving, publishing, and reconciling the exact Reed Charmer complete-motion lane, the designer said: Awesome let\'s do next. Following the documented EN-E03 Satyr role order, Codex bounded the continuation to Wildwood Hornlord elite Idle F1-F2 across four directions.',
  approvedOn: '2026-08-08',
  approvalEvidence: 'Designer reviewed both exact labeled all-four-direction raw and Complete B + Form Wildwood Hornlord Idle GIFs together and said: Approved lets do next.',
  precedingApproval: {
    gateId: EN_E03_REED_CHARMER_MOTION_GATE.id,
    artifactSha256: EN_E03_REED_CHARMER_MOTION_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_REED_CHARMER_MOTION_GATE.assembledArtifactSha256,
    rawAnimationSha256: EN_E03_REED_CHARMER_MOTION_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E03_REED_CHARMER_MOTION_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E03_REED_CHARMER_MOTION_GATE.candidateFrameDigest,
    publishedCheckpoint: 'f77c8a88b25cb59f5bdbe82708a620e5cae3fe9d',
    publishedHandoff: '629bccd1fefe5e98731dcfbf87049e7517dbca2e',
  },
  approvedSatyrBaseline: {
    gateId: EN_E03_SATYR_IDLE_GATE.id,
    artifactSha256: EN_E03_SATYR_IDLE_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_SATYR_IDLE_GATE.assembledArtifactSha256,
    candidateFrameDigest: EN_E03_SATYR_IDLE_GATE.candidateFrameDigest,
  },
  artifact: 'enemy-expansion-review/en-e03-wildwood-hornlord-idle/en-e03-wildwood-hornlord-idle-raw.png',
  artifactSha256: '7f3a1280c40652ca183dffd73379d3c43807248b6a40af866d91fd6420d1e2d3',
  assembledArtifact: 'enemy-expansion-review/en-e03-wildwood-hornlord-idle/en-e03-wildwood-hornlord-idle-complete-b-form.png',
  assembledArtifactSha256: 'b62244e9c953517c4af58ef22040754df9e6911f5a16d95ac42ac467d51fc779',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e03-wildwood-hornlord-idle/en-e03-wildwood-hornlord-idle-four-directions-labeled.gif',
      sha256: 'ee5f3eb354b4ca5080b2d8f4e2a05f6e50e6b87ebe7af3026309f32c092bbeef', width: 192, height: 224, frames: 2, durationMs: 480,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e03-wildwood-hornlord-idle/en-e03-wildwood-hornlord-idle-four-directions-labeled-complete-b-form.gif',
      sha256: '890d249db2e398da3332f1b9d07ade758964fb530830c57c0d2c6d2fcb757b72', width: 192, height: 224, frames: 2, durationMs: 480,
    },
  },
  candidateFrameDigest: 'a8cebf48ac2506321a546c17293cae5035f8c856139136b63b393bcfbd59207a',
  scope: 'Wildwood Hornlord elite Idle F1-F2 only across Down, Left, Right, and Up, reviewed raw and with Complete B + Form beside the approved Briar Reveler Satyr baseline.',
  identityContract: 'The approved horned digitigrade Satyr chassis gains an oversized branching antler crown, layered bark pauldrons, a dark moss mantle, root-brown bracers, and an amber clan torque. Thorn aura, leaf swirl, root burst, and every other forest-control effect remain external and are not baked into actor pixels.',
  animationContract: 'A slow 480 ms planted hornlord Idle cycle inherited from the approved Briar Reveler: F2 settles the crown, mantle, bracers, and torso one row while the tail flicks, hocks articulate, and all split-hoof contacts remain grounded.',
  exclusions: [
    'Briar Reveler changes',
    'Reed Charmer changes',
    'Giant changes',
    'Centaur changes',
    'baked thorn-aura pixels',
    'baked leaf-swirl pixels',
    'baked root-burst pixels',
    'Walk',
    'Attack',
    'Cast',
    'Hurt',
    'Death',
    'registration',
    'consumer exposure',
    'effects',
    'release',
    'later EN-E03 work',
  ],
  nextGate: 'Visual approval and bounded publication are complete for this Wildwood Hornlord Idle lane. The designer\'s same message separately requests the next documented Wildwood art gate; this Idle gate does not authorize registration, integration, baked effects, release, or any broader EN-E03 scope.',
});

export const EN_E03_WILDWOOD_HORNLORD_IDLE_DATA = deepFreeze({
  actor: {
    ...EN_E03_BRIAR_REVELER_CALIBRATION_DATA.actor,
    hairStyle: 'messy',
    hairColor: 'brown',
    outfit: 'ranger',
    outfitColor: 'forest',
    outfitTier: 'tier2',
    palette: {
      skin: [...EN_E03_BRIAR_REVELER_CALIBRATION_DATA.actor.palette.skin],
      hair: ['#513723', '#281d18'],
      outfit: ['#455d36', '#263a2b', '#9d7a3d'],
    },
  },
  identity: EN_E03_BRIAR_REVELER_CALIBRATION_DATA.identity,
  satyr: EN_E03_BRIAR_REVELER_CALIBRATION_DATA.satyr,
  elite: {
    antler: ['#d8b765', '#7b572b', '#f0d98b'],
    bark: ['#704d2f', '#392a20', '#aa7d45'],
    moss: ['#4d693b', '#293e2d', '#85a653'],
    torque: ['#d29c43', '#765127', '#f1cc70'],
  },
  effectBoundary: 'external-thorn-aura-leaf-swirl-and-root-burst',
  bakedEffects: [],
});

const WILDWOOD_HORNLORD_VARIANT = deepFreeze({
  id: 'wildwood-hornlord',
  name: 'Wildwood Hornlord',
  brief: 'Antler-crowned elite Satyr warlord in layered bark and moss regalia; only the two-frame Idle identity baseline is implemented and all forest-control effects remain external.',
  rendererData: EN_E03_WILDWOOD_HORNLORD_IDLE_DATA,
});

function createPainter(context, direction) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Wildwood Hornlord rectangles must use positive integer geometry.',
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

function drawDownAntlerCrown({ rect, dot }, phase, rearView) {
  const { antler } = EN_E03_WILDWOOD_HORNLORD_IDLE_DATA.elite;
  const bob = phase;
  const main = rearView ? antler[1] : antler[0];
  const shade = rearView ? antler[0] : antler[1];

  rect(3, 1 + bob, 2, 1, main);
  rect(3, 2 + bob, 1, 2, main);
  rect(4, 3 + bob, 2, 1, main);
  dot(2, 1 + bob, antler[2]);
  dot(2, 2 + bob, main);
  dot(4, 2 + bob, shade);

  rect(19, 1 + bob, 2, 1, main);
  rect(20, 2 + bob, 1, 2, main);
  rect(18, 3 + bob, 2, 1, main);
  dot(21, 1 + bob, antler[2]);
  dot(21, 2 + bob, main);
  dot(19, 2 + bob, shade);
}

function drawSideAntlerCrown({ rect, dot }, phase) {
  const { antler } = EN_E03_WILDWOOD_HORNLORD_IDLE_DATA.elite;
  const bob = phase;

  rect(5, 2 + bob, 5, 1, antler[0]);
  rect(4, 1 + bob, 2, 1, antler[0]);
  dot(3, 1 + bob, antler[2]);
  dot(6, 1 + bob, antler[1]);
  dot(7, 3 + bob, antler[1]);
  rect(10, 1 + bob, 3, 1, antler[0]);
  dot(12, 2 + bob, antler[2]);
  dot(11, 3 + bob, antler[1]);
}

function drawDownMantle({ rect, dot }, phase, rearView) {
  const { bark, moss, torque } = EN_E03_WILDWOOD_HORNLORD_IDLE_DATA.elite;
  const skin = EN_E03_WILDWOOD_HORNLORD_IDLE_DATA.actor.palette.skin;
  const bob = phase;

  rect(7, 10 + bob, 10, 1, bark[1]);
  rect(6, 11 + bob, 3, 2, bark[0]);
  rect(15, 11 + bob, 3, 2, bark[0]);
  rect(8, 11 + bob, 8, 3, rearView ? moss[1] : moss[0]);
  rect(9, 14 + bob, 6, 2, bark[0]);
  rect(6, 12 + bob, 2, 3, bark[1]);
  rect(16, 12 + bob, 2, 3, bark[1]);
  dot(6, 15 + bob, skin[1]);
  dot(17, 15 + bob, skin[0]);
  rect(10, 14 + bob, 4, 1, torque[1]);
  dot(rearView ? 13 : 10, 14 + bob, torque[2]);
  dot(8, 11 + bob, moss[2]);
  dot(16, 12 + bob, bark[2]);
}

function drawSideMantle({ rect, dot }, phase) {
  const { bark, moss, torque } = EN_E03_WILDWOOD_HORNLORD_IDLE_DATA.elite;
  const skin = EN_E03_WILDWOOD_HORNLORD_IDLE_DATA.actor.palette.skin;
  const bob = phase;

  rect(9, 10 + bob, 8, 1, bark[1]);
  rect(8, 11 + bob, 3, 2, bark[0]);
  rect(10, 11 + bob, 8, 3, moss[0]);
  rect(10, 14 + bob, 6, 2, bark[0]);
  rect(17, 12 + bob, 2, 3, bark[1]);
  dot(18, 15 + bob, skin[0]);
  rect(12, 14 + bob, 4, 1, torque[1]);
  dot(15, 14 + bob, torque[2]);
  dot(9, 11 + bob, moss[2]);
  dot(17, 12 + bob, bark[2]);
}

export function drawWildwoodHornlordIdentity(context, direction, phase) {
  const paint = createPainter(context, direction);
  if (paint.view === 'right') {
    drawSideAntlerCrown(paint, phase);
    drawSideMantle(paint, phase);
  } else {
    drawDownAntlerCrown(paint, phase, paint.view === 'up');
    drawDownMantle(paint, phase, paint.view === 'up');
  }
}

function renderWildwoodHornlordIdle(args) {
  assert(args.family.id === 'satyr', 'The EN-E03 Satyr elite Idle renderer is restricted to Satyr.');
  assert(args.variant.id === 'wildwood-hornlord', 'The EN-E03 Satyr elite Idle renderer is restricted to Wildwood Hornlord.');
  assert(args.animation.id === 'idle' && (args.frame === 0 || args.frame === 1), 'The EN-E03 Wildwood Hornlord gate authorizes only two Idle frames.');
  const rendered = EN_E01_HUMANOID_RENDERER.render({
    ...args,
    variant: WILDWOOD_HORNLORD_VARIANT,
  });
  if (args.frame === 0) {
    drawSatyrCalibrationIdentity(args.context, args.direction, { includeStaff: false });
  } else {
    args.context.clearRect(0, 17, SIZE, SIZE - 17);
    drawSatyrIdleF2Identity(args.context, args.direction, { includeStaff: false });
  }
  drawWildwoodHornlordIdentity(args.context, args.direction, args.frame);
  return Object.freeze({
    ...rendered,
    wildwoodHornlordIdleGate: EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.id,
    approvedPrecedingGate: EN_E03_REED_CHARMER_MOTION_GATE.id,
    approvedSatyrBaselineGate: EN_E03_SATYR_IDLE_GATE.id,
    effectBoundary: EN_E03_WILDWOOD_HORNLORD_IDLE_DATA.effectBoundary,
  });
}

export const EN_E03_WILDWOOD_HORNLORD_IDLE_RENDERER = Object.freeze({
  key: 'en-e03-wildwood-hornlord-idle-v1',
  chassis: EN_E01_HUMANOID_RENDERER.chassis,
  render: renderWildwoodHornlordIdle,
});

export const EN_E03_WILDWOOD_HORNLORD_IDLE_FAMILY = deepFreeze({
  id: 'satyr',
  name: 'Satyr',
  sliceId: 'EN-E03',
  rendererKey: EN_E03_WILDWOOD_HORNLORD_IDLE_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [WILDWOOD_HORNLORD_VARIANT],
  rendererData: {
    contractCard: 'satyr',
    approvedPrecedingGate: EN_E03_REED_CHARMER_MOTION_GATE.id,
    approvedSatyrBaselineGate: EN_E03_SATYR_IDLE_GATE.id,
    activeGate: EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.id,
  },
  review: {
    baselineVariant: 'wildwood-hornlord',
    scale: 8,
    notes: 'Visually approved elite two-frame Idle; internal, non-public, and effect-free.',
  },
});

export const EN_E03_WILDWOOD_HORNLORD_IDLE_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E03_WILDWOOD_HORNLORD_IDLE_RENDERER],
  families: [EN_E03_WILDWOOD_HORNLORD_IDLE_FAMILY],
});
