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
import { EN_E03_BANNER_KHAN_MOTION_GATE } from './enemy-expansion-en-e03-centaur-elite-motion.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E03_REED_CHARMER_IDLE_GATE = deepFreeze({
  id: 'en-e03-reed-charmer-idle-v1',
  status: 'approved',
  authorizedOn: '2026-08-08',
  authorizationEvidence: 'After approving, publishing, and reconciling the exact Banner Khan grouped-motion lane, the designer said: cool lets do next. Following the documented EN-E03 family and role order, Codex bounded the continuation to Reed Charmer specialist Idle F1-F2 across four directions.',
  approvedOn: '2026-08-08',
  approvalEvidence: 'Designer reviewed both exact labeled all-four-direction raw and Complete B + Form Reed Charmer Idle GIFs together and said: Approved.',
  precedingApproval: {
    gateId: EN_E03_BANNER_KHAN_MOTION_GATE.id,
    artifactSha256: EN_E03_BANNER_KHAN_MOTION_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_BANNER_KHAN_MOTION_GATE.assembledArtifactSha256,
    rawAnimationSha256: EN_E03_BANNER_KHAN_MOTION_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E03_BANNER_KHAN_MOTION_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E03_BANNER_KHAN_MOTION_GATE.candidateFrameDigest,
    publishedCheckpoint: '8e73cd038d50037a40cad27ee9f2e37b6e363b69',
  },
  approvedSatyrBaseline: {
    gateId: EN_E03_SATYR_IDLE_GATE.id,
    artifactSha256: EN_E03_SATYR_IDLE_GATE.artifactSha256,
    assembledArtifactSha256: EN_E03_SATYR_IDLE_GATE.assembledArtifactSha256,
    candidateFrameDigest: EN_E03_SATYR_IDLE_GATE.candidateFrameDigest,
  },
  artifact: 'enemy-expansion-review/en-e03-reed-charmer-idle/en-e03-reed-charmer-idle-raw.png',
  artifactSha256: 'a3459b3ed67dbe795bc2af3b55dd837aa91c4d880c941a3eedc0e791807e9b3a',
  assembledArtifact: 'enemy-expansion-review/en-e03-reed-charmer-idle/en-e03-reed-charmer-idle-complete-b-form.png',
  assembledArtifactSha256: 'a8fb2c1af35060551d6c66dde7137ace9736291beea57f9413d588faa75eb0b0',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e03-reed-charmer-idle/en-e03-reed-charmer-idle-four-directions-labeled.gif',
      sha256: '603ac763a9c739728132d96fa30b2cfaf5ee9fe363568da841605526f40f01ca', width: 192, height: 224, frames: 2, durationMs: 480,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e03-reed-charmer-idle/en-e03-reed-charmer-idle-four-directions-labeled-complete-b-form.gif',
      sha256: '0acdf25022c8cae2ffa456780f5497fbcc19b54feefd3aa7fbf908ec1698afa3', width: 192, height: 224, frames: 2, durationMs: 480,
    },
  },
  candidateFrameDigest: 'b9ade755388cbfaad742dd0323c9c11f3ac0e5943bbe2608f146a520f606dfbf',
  scope: 'Reed Charmer specialist Idle F1-F2 only across Down, Left, Right, and Up, reviewed raw and with Complete B + Form beside the approved Briar Reveler Satyr baseline.',
  identityContract: 'The approved horned digitigrade Satyr chassis gains a teal specialist tunic, woven gold sash, and a compact direction-aware panpipe held at the mouth. Music notes, pollen motes, charm rings, and every other control effect remain external and are not baked into actor pixels.',
  animationContract: 'A slow 480 ms planted pipe-playing Idle cycle inherited from the approved Briar Reveler: F2 settles the torso, pipe, and hands one row while the tail flicks, hocks articulate, and all split-hoof contacts remain grounded.',
  exclusions: [
    'Briar Reveler changes',
    'Wildwood Hornlord',
    'Giant changes',
    'Centaur changes',
    'baked music-note pixels',
    'baked pollen pixels',
    'baked charm-ring pixels',
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
  nextGate: 'Visual approval and bounded publication are complete for this Reed Charmer Idle lane. No later animation, variant, registration, integration, effect, release, or EN-E03 work is authorized without a separate explicit continuation.',
});

export const EN_E03_REED_CHARMER_IDLE_DATA = deepFreeze({
  actor: {
    ...EN_E03_BRIAR_REVELER_CALIBRATION_DATA.actor,
    palette: {
      skin: [...EN_E03_BRIAR_REVELER_CALIBRATION_DATA.actor.palette.skin],
      hair: [...EN_E03_BRIAR_REVELER_CALIBRATION_DATA.actor.palette.hair],
      outfit: ['#3f7f73', '#244d49', '#d6b45f'],
    },
  },
  identity: EN_E03_BRIAR_REVELER_CALIBRATION_DATA.identity,
  satyr: EN_E03_BRIAR_REVELER_CALIBRATION_DATA.satyr,
  specialist: {
    reed: ['#d6b45f', '#8b6835', '#f0d98b'],
    wrap: ['#3f7f73', '#244d49'],
    sash: ['#d6b45f', '#8b6835', '#f0d98b'],
  },
  effectBoundary: 'external-music-notes-pollen-and-charm-ring',
  bakedEffects: [],
});

const REED_CHARMER_VARIANT = deepFreeze({
  id: 'reed-charmer',
  name: 'Reed Charmer',
  brief: 'Pipe-playing Satyr controller with an external music-note and charm-radius effect contract; only the two-frame Idle identity baseline is implemented.',
  rendererData: EN_E03_REED_CHARMER_IDLE_DATA,
});

function createPainter(context, direction) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Reed Charmer rectangles must use positive integer geometry.',
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

function drawDownPipe({ rect, dot }, phase, rearView) {
  const { reed, sash } = EN_E03_REED_CHARMER_IDLE_DATA.specialist;
  const skin = EN_E03_REED_CHARMER_IDLE_DATA.actor.palette.skin;
  const bob = phase;
  rect(9, 14 + bob, 6, 1, sash[1]);
  dot(rearView ? 14 : 9, 14 + bob, sash[2]);
  if (rearView) {
    rect(6, 11 + bob, 2, 2, skin[1]);
    rect(7, 10 + bob, 2, 2, skin[0]);
    rect(10, 10 + bob, 2, 2, skin[0]);
    rect(11, 11 + bob, 2, 2, skin[1]);
    rect(7, 9 + bob, 5, 1, reed[1]);
    dot(7, 9 + bob, reed[2]);
    rect(8, 10 + bob, 1, 2, reed[0]);
    rect(9, 10 + bob, 1, 3, reed[1]);
    rect(10, 10 + bob, 1, 4, reed[0]);
    rect(11, 10 + bob, 1, 3, reed[1]);
    dot(10, 10 + bob, reed[2]);
    return;
  }
  rect(10, 11 + bob, 2, 2, skin[1]);
  rect(11, 10 + bob, 2, 2, skin[0]);
  rect(14, 10 + bob, 2, 2, skin[0]);
  rect(15, 11 + bob, 2, 2, skin[1]);
  rect(12, 9 + bob, 5, 1, reed[1]);
  dot(16, 9 + bob, reed[2]);
  rect(13, 10 + bob, 1, 2, reed[0]);
  rect(14, 10 + bob, 1, 3, reed[1]);
  rect(15, 10 + bob, 1, 4, reed[0]);
  rect(16, 10 + bob, 1, 3, reed[1]);
  dot(15, 10 + bob, reed[2]);
}

function drawSidePipe({ rect, dot }, phase) {
  const { reed, sash } = EN_E03_REED_CHARMER_IDLE_DATA.specialist;
  const skin = EN_E03_REED_CHARMER_IDLE_DATA.actor.palette.skin;
  const bob = phase;
  rect(10, 14 + bob, 6, 1, sash[1]);
  dot(15, 14 + bob, sash[2]);
  rect(15, 11 + bob, 2, 2, skin[1]);
  rect(16, 10 + bob, 2, 2, skin[0]);
  rect(17, 9 + bob, 4, 1, reed[1]);
  dot(20, 9 + bob, reed[2]);
  rect(18, 10 + bob, 1, 2, reed[0]);
  rect(19, 10 + bob, 1, 3, reed[1]);
  rect(20, 10 + bob, 1, 2, reed[0]);
  dot(19, 10 + bob, reed[2]);
}

function drawSpecialistTunic({ view, rect, dot }, phase) {
  const { wrap, sash } = EN_E03_REED_CHARMER_IDLE_DATA.specialist;
  const bob = phase;
  if (view === 'right') {
    rect(10, 11 + bob, 7, 2, wrap[1]);
    rect(11, 12 + bob, 6, 3, wrap[0]);
    rect(12, 14 + bob, 4, 1, wrap[1]);
    dot(16, 12 + bob, sash[0]);
    return;
  }
  rect(8, 11 + bob, 8, 2, wrap[1]);
  rect(9, 12 + bob, 6, 3, wrap[0]);
  rect(10, 14 + bob, 4, 1, wrap[1]);
  dot(view === 'up' ? 14 : 9, 12 + bob, sash[0]);
}

export function drawReedCharmerIdentity(context, direction, phase) {
  const paint = createPainter(context, direction);
  drawSpecialistTunic(paint, phase);
  if (paint.view === 'right') drawSidePipe(paint, phase);
  else drawDownPipe(paint, phase, paint.view === 'up');
}

function renderReedCharmerIdle(args) {
  assert(args.family.id === 'satyr', 'The EN-E03 Satyr specialist Idle renderer is restricted to Satyr.');
  assert(args.variant.id === 'reed-charmer', 'The EN-E03 Satyr specialist Idle renderer is restricted to Reed Charmer.');
  assert(args.animation.id === 'idle' && (args.frame === 0 || args.frame === 1), 'The EN-E03 Reed Charmer gate authorizes only two Idle frames.');
  const rendered = EN_E01_HUMANOID_RENDERER.render({
    ...args,
    variant: REED_CHARMER_VARIANT,
  });
  if (args.frame === 0) {
    drawSatyrCalibrationIdentity(args.context, args.direction, { includeStaff: false });
  } else {
    args.context.clearRect(0, 17, SIZE, SIZE - 17);
    drawSatyrIdleF2Identity(args.context, args.direction, { includeStaff: false });
  }
  drawReedCharmerIdentity(args.context, args.direction, args.frame);
  return Object.freeze({
    ...rendered,
    reedCharmerIdleGate: EN_E03_REED_CHARMER_IDLE_GATE.id,
    approvedPrecedingGate: EN_E03_BANNER_KHAN_MOTION_GATE.id,
    approvedSatyrBaselineGate: EN_E03_SATYR_IDLE_GATE.id,
    effectBoundary: EN_E03_REED_CHARMER_IDLE_DATA.effectBoundary,
  });
}

export const EN_E03_REED_CHARMER_IDLE_RENDERER = Object.freeze({
  key: 'en-e03-reed-charmer-idle-v1',
  chassis: EN_E01_HUMANOID_RENDERER.chassis,
  render: renderReedCharmerIdle,
});

export const EN_E03_REED_CHARMER_IDLE_FAMILY = deepFreeze({
  id: 'satyr',
  name: 'Satyr',
  sliceId: 'EN-E03',
  rendererKey: EN_E03_REED_CHARMER_IDLE_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [REED_CHARMER_VARIANT],
  rendererData: {
    contractCard: 'satyr',
    approvedPrecedingGate: EN_E03_BANNER_KHAN_MOTION_GATE.id,
    approvedSatyrBaselineGate: EN_E03_SATYR_IDLE_GATE.id,
    activeGate: EN_E03_REED_CHARMER_IDLE_GATE.id,
  },
  review: {
    baselineVariant: 'reed-charmer',
    scale: 8,
    notes: 'Approved specialist two-frame Idle lane; internal, non-public, and effect-free.',
  },
});

export const EN_E03_REED_CHARMER_IDLE_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E03_REED_CHARMER_IDLE_RENDERER],
  families: [EN_E03_REED_CHARMER_IDLE_FAMILY],
});
