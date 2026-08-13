import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE } from './enemy-expansion-en-e11-cockatrice-crowncoil-basilarch.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E11_RAVEN_TOPOLOGY_DECISION = deepFreeze({
  id: 'en-e11-raven-topology-v1',
  status: 'selected',
  selected: 'baked-single-actor-grounded-folded-wing-corvid',
  approvedOn: '2026-08-14',
  approvalEvidence: 'After the remote-verified Crowncoil Basilarch reconciliation opened only the Raven topology decision gate, the designer approved the proposed baked-single-actor-grounded-folded-wing-corvid topology with: approved.',
  childAssets: [],
  effectBoundary: 'Loose feathers, shadow wisps, dust, glow, projectiles, air blades, and impact effects remain external.',
  rationale: 'A single connected actor preserves a compact natural corvid silhouette, folded wings, two grounded talon contacts, a short neck, hooked beak, and one body-owned wedge tail in every direction without turning feathers or shadows into child effects.',
});

export const EN_E11_RAVEN_CINDERQUILL_SCAVENGER_CONTRACT = deepFreeze({
  family: 'raven',
  variant: 'cinderquill-scavenger',
  role: 'common',
  state: 'implemented-complete-motion-candidate',
  chassis: EN_E11_RAVEN_TOPOLOGY_DECISION.selected,
  silhouette: 'One compact low-forward natural corvid joins a rounded head, short feathered throat, hooked beak, deep body, two folded wings, two separated taloned feet, and one connected wedge tail. Attack opens the body-owned wings into a broad screen and rake while the tail counterbalances. It is shorter-necked and less ornate than a Peacock, neither an upright Birdfolk person nor exposed-human Harpy, and never a four-legged Griffin.',
  identity: 'Blue-black head and body plumage, slate-blue folded wings, a smoky ash throat, black wedge tail, muted horn beak, copper-gold eyes, bronze-gray talons, and a small rust-cinder nape-and-shoulder quill accent distinguish the common Cinderquill Scavenger without baking fire or shadow effects.',
  effectBoundary: EN_E11_RAVEN_TOPOLOGY_DECISION.effectBoundary,
});

export const EN_E11_RAVEN_COMMON_CONTRACT_CARD = deepFreeze({
  family: 'raven',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingGate: EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.id,
  activeVariant: {
    id: EN_E11_RAVEN_CINDERQUILL_SCAVENGER_CONTRACT.variant,
    role: EN_E11_RAVEN_CINDERQUILL_SCAVENGER_CONTRACT.role,
    status: 'implemented-full-candidate',
  },
  deferredRoles: ['specialist', 'elite'],
});

export const EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE = deepFreeze({
  id: 'en-e11-raven-cinderquill-scavenger-full-v1',
  status: 'candidate',
  authorizedOn: '2026-08-14',
  authorizationEvidence: 'The exact Crowncoil Basilarch implementation 5d4ebe9dea7a8a85d0adeec0e34a0b3be8a016ef, approval record 27e60acd72f9c00de886d8fd0d7e1d899c7f2bb7, initial published handoff 7f588bf305072e80a4bf3c4d913dfaba1f389416, and final reconciliation 090399f2e05f83d102f4d672670f64ffdcd24fed are pushed and remote verified. The Raven topology gate then proposed baked-single-actor-grounded-folded-wing-corvid and stated that approval would build exactly one private common Raven 80-frame candidate. The designer replied: approved. This selects that topology and authorizes exactly one private common Raven full 80-frame candidate only. It does not approve candidate pixels or authorize a commit, push, public or outline registration, fixtures, effects, child assets, Raven specialist or elite, Owl, Phoenix, release, accepted drift, or a pull request.',
  baseCheckpoint: '090399f2e05f83d102f4d672670f64ffdcd24fed',
  architectureDecision: EN_E11_RAVEN_TOPOLOGY_DECISION.id,
  precedingApproval: {
    gateId: EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.id,
    candidateFrameDigest: EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.candidateFrameDigest,
    publishedImplementation: EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.initialPublishedHandoff,
    currentReconciliation: '090399f2e05f83d102f4d672670f64ffdcd24fed',
  },
  artifact: 'enemy-expansion-review/en-e11-raven-cinderquill-scavenger/en-e11-raven-cinderquill-scavenger-full-suite-raw.png',
  artifactSha256: '106a702f1084bbc1c4a32390ed13c22f787af6625fcd0563ec036a5214dbe8b2',
  outlinedArtifact: 'enemy-expansion-review/en-e11-raven-cinderquill-scavenger/en-e11-raven-cinderquill-scavenger-full-suite-outlined-complete-b.png',
  outlinedArtifactSha256: '49b233b5b7a8b1b2ee8f155f5e0a28aa08182b85b6a1f73f7e8b6bef06183cd2',
  assembledArtifact: 'enemy-expansion-review/en-e11-raven-cinderquill-scavenger/en-e11-raven-cinderquill-scavenger-full-suite-complete-b-form.png',
  assembledArtifactSha256: 'b94dc10ee145508cd249fd505bf82567f0da9c006d59f066387ee0a97558c769',
  comparisonArtifact: 'enemy-expansion-review/en-e11-raven-cinderquill-scavenger/en-e11-raven-cinderquill-scavenger-family-comparison.png',
  comparisonArtifactSha256: 'b0af0677ebf7c8ec0f6a7e0b5d24780c23ca9680ac600a64ab393db495476ce4',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e11-raven-cinderquill-scavenger/en-e11-raven-cinderquill-scavenger-full-suite-four-directions-labeled.gif',
      sha256: 'eb64ff8d38cc1565a2e41061023de9cfc04081ff7d8e4191a6eaa674db031c7a',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e11-raven-cinderquill-scavenger/en-e11-raven-cinderquill-scavenger-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '687767db7f6d9e3ba642c57c69cfd170541ba6ac3125d0b5d5a9d5fc16100919',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
  },
  candidateFrameDigest: '0f14b1a5c2c9fab2756130fffce516ad50b34d860cd68cd186bd93bc3c2a15f2',
  crowncoilComparisonDigest: EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.candidateFrameDigest,
  rainfanComparisonDigest: '061a67e81e4c2bb4e7ed528953d2acf1e19d1453b2098ddceff1c01ca4e38128',
  harpyComparisonDigest: 'd7d83f0c209a8b4735e0a488a5df128bffa5407e38fd28e4fc38d73b633e5839',
  scope: 'One complete private 80-frame Raven Cinderquill Scavenger common enemy across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle holds a wary ground-watch and settles the smoky throat over two planted talons. Walk alternates two grounded hop-steps with folded-wing and connected wedge-tail counter-motion. Attack crouches on both talons, opens one broad wing screen, drives a hooked-beak rake with the second wing and wedge tail counterbalancing, then refolds into a wary recovery. Hurt uses a complete-silhouette #f4f4f4 recoil and colored grounded recovery. Cast aliases Attack exactly and Death aliases Hurt H1,H2,H2,H2.',
  anatomyContract: EN_E11_RAVEN_CINDERQUILL_SCAVENGER_CONTRACT.silhouette,
  reviewPresentation: 'Show the exact labeled all-four-direction Cinderquill Scavenger raw/no-outline, outlined Complete B, Complete B + Form, Crowncoil/Rainfan/Harpy comparison board, and both synchronized full-suite GIFs together.',
  exclusions: [
    'approved Crowncoil Basilarch pixel changes',
    'approved Rainfan Forager pixel changes',
    'public Harpy Screecher pixel changes',
    'Raven specialist',
    'Raven elite',
    'Owl',
    'Phoenix',
    'additional Bird variants',
    'new Cast pixels',
    'new Death pixels',
    'detached feather child assets',
    'baked loose-feather pixels',
    'baked shadow-wisp pixels',
    'baked dust pixels',
    'baked glow pixels',
    'baked projectile pixels',
    'baked impact pixels',
    'registration',
    'consumer exposure',
    'fixtures',
    'effects',
    'release',
    'later EN-E11 work',
  ],
  nextGate: 'Stop after rendering, inspecting, freezing, and validating this exact private Cinderquill Scavenger candidate. Explicit designer approval of the posted exact review packet or candidate digest is required before any implementation commit or push. That approval would apply only to the frozen common Raven pixels and would not open public or outline registration, fixtures, effects, child assets, Raven specialist or elite, Owl, Phoenix, release, accepted drift, or a pull request.',
});

export const EN_E11_RAVEN_CINDERQUILL_SCAVENGER_DATA = deepFreeze({
  actor: {
    species: 'corvid',
    bodyBuild: 'compact-low-forward-corvid',
    skin: 'feathered',
    hairStyle: 'nape-quills',
    hairColor: 'cinder-rust',
    expression: 'wary',
    faceDetail: 'hooked-beak',
    headgear: 'none',
    outfit: 'none',
    outfitColor: 'blue-black',
    outfitTier: 'tier1',
    weapon: 'none',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: ['#303846', '#191f2b'],
      hair: ['#9a5846', '#5d3540'],
      outfit: ['#252c38', '#141923', '#3f4f65'],
    },
  },
  actorTopology: EN_E11_RAVEN_TOPOLOGY_DECISION.selected,
  childAssets: [],
  raven: {
    head: ['#303846', '#191f2b', '#596575'],
    body: ['#252c38', '#141923', '#465161'],
    wing: ['#3f4f65', '#222d3d', '#667a90'],
    throat: ['#66717a', '#3d4650', '#929ca1'],
    tail: ['#1e2733', '#111722', '#39485a'],
    cinder: ['#855347', '#4e3540', '#ad6b50'],
    beak: ['#8a8470', '#48473f', '#b5ad90'],
    talon: ['#76664f', '#423a31'],
    eye: '#d59a3a',
    feature: '#12131a',
  },
  effectBoundary: 'external-loose-feathers-shadow-wisps-dust-glow-projectiles-and-impacts',
  bakedEffects: [],
});

const CINDERQUILL_SCAVENGER_VARIANT = deepFreeze({
  id: 'cinderquill-scavenger',
  name: 'Cinderquill Scavenger',
  role: EN_E11_RAVEN_CINDERQUILL_SCAVENGER_CONTRACT.role,
  status: EN_E11_RAVEN_CINDERQUILL_SCAVENGER_CONTRACT.state,
  brief: 'Common natural Raven with a low blue-black body, short smoky throat, slate folded wings, rust-cinder shoulder quills, two planted talons, and one connected black wedge tail.',
  rendererData: EN_E11_RAVEN_CINDERQUILL_SCAVENGER_DATA,
});

export const EN_E11_RAVEN_CINDERQUILL_SCAVENGER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'wary-ground-watch', upperBob: 0, wingPhase: 0, legPhase: 0, tailMode: 'closed', tailSway: 0, beakReach: 0, flash: false },
  { name: 'smoky-throat-settle', upperBob: 1, wingPhase: 1, legPhase: 0, tailMode: 'closed', tailSway: 0, beakReach: 0, flash: false },
]);

const WALK_PHASES = deepFreeze([
  { name: 'left-ground-hop', upperBob: 0, wingPhase: 1, legPhase: 1, tailMode: 'closed', tailSway: -1, beakReach: 0, flash: false },
  { name: 'folded-wing-compress', upperBob: 1, wingPhase: 0, legPhase: 2, tailMode: 'closed', tailSway: 0, beakReach: 0, flash: false },
  { name: 'right-ground-hop', upperBob: 0, wingPhase: 1, legPhase: 3, tailMode: 'closed', tailSway: 1, beakReach: 0, flash: false },
  { name: 'wedge-tail-recover', upperBob: 0, wingPhase: 2, legPhase: 4, tailMode: 'closed', tailSway: 0, beakReach: 0, flash: false },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'two-talon-rake-brace', upperBob: 1, wingPhase: 2, legPhase: 1, tailMode: 'braced', tailSway: -1, beakReach: 0, flash: false },
  { name: 'broad-wing-screen', upperBob: 0, wingPhase: 3, legPhase: 0, tailMode: 'spread', tailSway: 0, beakReach: 0, flash: false },
  { name: 'hooked-beak-wing-rake', upperBob: 0, wingPhase: 4, legPhase: 3, tailMode: 'spread', tailSway: 0, beakReach: 1, flash: false },
  { name: 'folded-corvid-recover', upperBob: 1, wingPhase: 1, legPhase: 0, tailMode: 'braced', tailSway: 1, beakReach: 0, flash: false },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-cinderquill-recoil', upperBob: 0, wingPhase: 2, legPhase: 1, tailMode: 'braced', tailSway: -1, beakReach: 0, flash: true },
  { name: 'planted-talon-recovery', upperBob: 1, wingPhase: 1, legPhase: 0, tailMode: 'closed', tailSway: 0, beakReach: 0, flash: false },
]);

const FRONT_LEG_PHASES = deepFreeze([
  { leftX: 0, rightX: 0 },
  { leftX: -1, rightX: 1 },
  { leftX: 1, rightX: 0 },
  { leftX: 0, rightX: -1 },
  { leftX: -1, rightX: 0 },
]);

const SIDE_LEG_PHASES = deepFreeze([
  { farX: 0, nearX: 0 },
  { farX: -1, nearX: 1 },
  { farX: 0, nearX: 1 },
  { farX: -1, nearX: 0 },
  { farX: 0, nearX: 0 },
]);

function createColorContext(context, forcedColor = null) {
  let fillStyle = context.fillStyle;
  return {
    get fillStyle() {
      return forcedColor || fillStyle;
    },
    set fillStyle(value) {
      fillStyle = value;
      context.fillStyle = forcedColor || value;
    },
    onOutOfBounds(write) {
      if (typeof context.onOutOfBounds === 'function') context.onOutOfBounds(write);
    },
    clearRect(x, y, width, height) {
      context.clearRect(x, y, width, height);
    },
    fillRect(x, y, width, height) {
      context.fillStyle = forcedColor || fillStyle;
      context.fillRect(x, y, width, height);
    },
  };
}

function createPainter(context, direction) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Cinderquill Scavenger rectangles must use positive integer geometry.',
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

function drawFrontTail(paint, phase, rearView) {
  const { tail } = EN_E11_RAVEN_CINDERQUILL_SCAVENGER_DATA.raven;
  const sway = phase.tailSway;
  if (phase.tailMode === 'spread') {
    paint.rect(6, 13, 12, 4, tail[0]);
    paint.rect(5, 16, 14, 3, tail[1]);
    paint.rect(7, 19, 10, 2, tail[2]);
    paint.dot(6, 18, tail[2]);
    paint.dot(17, 18, tail[2]);
    return;
  }
  if (phase.tailMode === 'braced') {
    paint.rect(8 + sway, 14, 8, 4, tail[0]);
    paint.rect(7 + sway, 17, 10, 3, tail[1]);
    paint.rect(9 + sway, 20, 6, 1, tail[2]);
    return;
  }
  paint.rect(9 + sway, 14, 6, 4, tail[0]);
  paint.rect(8 + sway, 17, 8, 3, tail[1]);
  paint.rect(10 + sway, 20, 4, 1, rearView ? tail[2] : tail[0]);
}

function drawSideTail(paint, phase) {
  const { tail } = EN_E11_RAVEN_CINDERQUILL_SCAVENGER_DATA.raven;
  const sway = phase.tailSway;
  if (phase.tailMode === 'spread') {
    paint.rect(5, 13, 8, 4, tail[0]);
    paint.rect(2, 15, 11, 4, tail[1]);
    paint.rect(1, 18, 10, 3, tail[2]);
    paint.dot(1, 17, tail[0]);
    return;
  }
  if (phase.tailMode === 'braced') {
    paint.rect(5 + sway, 13, 8, 4, tail[0]);
    paint.rect(2 + sway, 16, 10, 4, tail[1]);
    paint.rect(2 + sway, 19, 8, 2, tail[2]);
    return;
  }
  paint.rect(6 + sway, 13, 6, 4, tail[0]);
  paint.rect(3 + sway, 16, 9, 4, tail[1]);
  paint.rect(2 + sway, 19, 7, 2, tail[2]);
}

function drawTail(paint, phase, rearView) {
  if (paint.view === 'right') drawSideTail(paint, phase);
  else drawFrontTail(paint, phase, rearView);
}

function drawFrontBody(paint, phase, rearView) {
  const { body, wing, cinder } = EN_E11_RAVEN_CINDERQUILL_SCAVENGER_DATA.raven;
  const bob = phase.upperBob;
  paint.rect(7, 10 + bob, 10, 7, body[0]);
  paint.rect(8, 15 + bob, 8, 4, body[1]);
  paint.rect(9, 11 + bob, 6, 6, rearView ? body[2] : body[0]);
  if (phase.wingPhase === 4) {
    paint.rect(1, 10 + bob, 9, 3, wing[0]);
    paint.rect(2, 13 + bob, 8, 2, wing[1]);
    paint.rect(4, 15 + bob, 6, 2, wing[2]);
    paint.rect(14, 10 + bob, 9, 3, wing[0]);
    paint.rect(14, 13 + bob, 8, 2, wing[1]);
    paint.rect(14, 15 + bob, 6, 2, wing[2]);
    paint.dot(1, 14 + bob, wing[2]);
    paint.dot(22, 14 + bob, wing[2]);
    paint.dot(8, 10 + bob, cinder[2]);
    paint.dot(15, 10 + bob, cinder[2]);
    return;
  }
  if (phase.wingPhase === 3) {
    paint.rect(2, 7 + bob, 7, 3, wing[2]);
    paint.rect(1, 9 + bob, 9, 4, wing[0]);
    paint.rect(2, 13 + bob, 8, 3, wing[1]);
    paint.rect(15, 7 + bob, 7, 3, wing[2]);
    paint.rect(14, 9 + bob, 9, 4, wing[0]);
    paint.rect(14, 13 + bob, 8, 3, wing[1]);
    paint.dot(8, 8 + bob, cinder[2]);
    paint.dot(15, 8 + bob, cinder[2]);
    return;
  }
  if (phase.wingPhase === 2) {
    paint.rect(4, 10 + bob, 7, 7, wing[0]);
    paint.rect(13, 10 + bob, 7, 7, wing[0]);
    paint.rect(4, 15 + bob, 7, 3, wing[1]);
    paint.rect(13, 15 + bob, 7, 3, wing[1]);
    paint.dot(4, 17 + bob, wing[2]);
    paint.dot(19, 17 + bob, wing[2]);
    paint.dot(7, 11 + bob, cinder[0]);
    paint.dot(16, 11 + bob, cinder[0]);
    return;
  }
  const lower = phase.wingPhase === 1 ? 1 : 0;
  paint.rect(5, 11 + bob + lower, 6, 6, wing[0]);
  paint.rect(13, 11 + bob + lower, 6, 6, wing[0]);
  paint.rect(5, 15 + bob + lower, 6, 3, wing[1]);
  paint.rect(13, 15 + bob + lower, 6, 3, wing[1]);
  paint.dot(6, 17 + bob + lower, wing[2]);
  paint.dot(17, 17 + bob + lower, wing[2]);
  paint.dot(7, 12 + bob + lower, cinder[0]);
  paint.dot(16, 12 + bob + lower, cinder[0]);
}

function drawSideBody(paint, phase) {
  const { body, wing, cinder } = EN_E11_RAVEN_CINDERQUILL_SCAVENGER_DATA.raven;
  const bob = phase.upperBob;
  paint.rect(7, 10 + bob, 10, 7, body[0]);
  paint.rect(8, 15 + bob, 9, 4, body[1]);
  paint.rect(9, 11 + bob, 7, 6, body[2]);
  if (phase.wingPhase === 4) {
    paint.rect(10, 9 + bob, 12, 5, wing[0]);
    paint.rect(11, 13 + bob, 11, 3, wing[1]);
    paint.dot(22, 9 + bob, wing[2]);
    paint.dot(21, 15 + bob, wing[2]);
    paint.dot(12, 10 + bob, cinder[2]);
    return;
  }
  if (phase.wingPhase === 3) {
    paint.rect(7, 6 + bob, 7, 11, wing[0]);
    paint.rect(8, 5 + bob, 5, 5, wing[2]);
    paint.rect(7, 14 + bob, 7, 3, wing[1]);
    paint.dot(12, 7 + bob, cinder[2]);
    return;
  }
  if (phase.wingPhase === 2) {
    paint.rect(6, 10 + bob, 10, 7, wing[0]);
    paint.rect(6, 15 + bob, 9, 3, wing[1]);
    paint.dot(6, 17 + bob, wing[2]);
    paint.dot(13, 11 + bob, cinder[0]);
    return;
  }
  const lower = phase.wingPhase === 1 ? 1 : 0;
  paint.rect(7, 11 + bob + lower, 9, 6, wing[0]);
  paint.rect(7, 15 + bob + lower, 8, 3, wing[1]);
  paint.dot(8, 17 + bob + lower, wing[2]);
  paint.dot(13, 12 + bob + lower, cinder[0]);
}

function drawBody(paint, phase, rearView) {
  if (paint.view === 'right') drawSideBody(paint, phase);
  else drawFrontBody(paint, phase, rearView);
}

function drawFrontLeg(paint, x, rearView) {
  const { body, talon } = EN_E11_RAVEN_CINDERQUILL_SCAVENGER_DATA.raven;
  paint.rect(x, 17, 2, 3, body[1]);
  paint.rect(x, 19, 2, 3, talon[1]);
  paint.rect(x - 1, 22, 4, 1, rearView ? talon[1] : talon[0]);
}

function drawSideLeg(paint, x, farLeg) {
  const { body, talon } = EN_E11_RAVEN_CINDERQUILL_SCAVENGER_DATA.raven;
  paint.rect(x, 17, 2, 3, farLeg ? body[1] : body[0]);
  paint.rect(x, 19, 2, 3, talon[1]);
  paint.rect(x - 1, 22, 4, 1, farLeg ? talon[1] : talon[0]);
}

function drawLegs(paint, phase, rearView) {
  if (paint.view === 'right') {
    const state = SIDE_LEG_PHASES[phase.legPhase];
    drawSideLeg(paint, 10 + state.farX, true);
    drawSideLeg(paint, 15 + state.nearX, false);
    return;
  }
  const state = FRONT_LEG_PHASES[phase.legPhase];
  drawFrontLeg(paint, 9 + state.leftX, rearView);
  drawFrontLeg(paint, 15 + state.rightX, rearView);
}

function drawFrontHead(paint, phase, rearView) {
  const { head, throat, cinder, beak, eye, feature } = EN_E11_RAVEN_CINDERQUILL_SCAVENGER_DATA.raven;
  const bob = phase.upperBob;
  paint.rect(9, 8 + bob, 6, 6, throat[0]);
  paint.rect(10, 10 + bob, 4, 4, throat[1]);
  paint.rect(9, 4 + bob, 6, 6, head[0]);
  paint.rect(10, 3 + bob, 4, 2, head[1]);
  paint.rect(10, 5 + bob, 4, 4, head[2]);
  paint.dot(9, 9 + bob, cinder[0]);
  paint.dot(14, 9 + bob, cinder[2]);
  if (rearView) {
    paint.rect(10, 5 + bob, 4, 4, head[1]);
    paint.dot(11, 6 + bob, head[2]);
    paint.dot(12, 7 + bob, head[2]);
    return;
  }
  paint.dot(10, 6 + bob, eye);
  paint.dot(13, 6 + bob, eye);
  paint.dot(10, 7 + bob, feature);
  paint.dot(13, 7 + bob, feature);
  paint.rect(10, 8 + bob, 4, 1, beak[0]);
  paint.rect(11, 9 + bob, 2, 2 + phase.beakReach, beak[0]);
  paint.rect(11, 10 + bob + phase.beakReach, 2, 1, beak[1]);
}

function drawSideHead(paint, phase) {
  const { head, throat, cinder, beak, eye, feature } = EN_E11_RAVEN_CINDERQUILL_SCAVENGER_DATA.raven;
  const bob = phase.upperBob;
  paint.rect(12, 8 + bob, 5, 6, throat[0]);
  paint.rect(13, 10 + bob, 4, 4, throat[1]);
  paint.rect(14, 4 + bob, 6, 7, head[0]);
  paint.rect(15, 3 + bob, 4, 2, head[1]);
  paint.rect(14, 6 + bob, 6, 4, head[2]);
  paint.rect(13, 8 + bob, 2, 1, cinder[0]);
  paint.dot(14, 7 + bob, cinder[2]);
  paint.dot(18, 6 + bob, eye);
    paint.dot(18, 7 + bob, feature);
  paint.rect(19, 7 + bob, 3 + phase.beakReach, 2, beak[0]);
  paint.dot(21 + phase.beakReach, 9 + bob, beak[1]);
}

function drawHead(paint, phase, rearView) {
  if (paint.view === 'right') drawSideHead(paint, phase);
  else drawFrontHead(paint, phase, rearView);
}

export function drawRavenCinderquillScavengerAnatomy(context, direction, phase) {
  const paint = createPainter(context, direction);
  const rearView = paint.view === 'up';
  drawTail(paint, phase, rearView);
  drawBody(paint, phase, rearView);
  drawLegs(paint, phase, rearView);
  drawHead(paint, phase, rearView);
}

function renderAnatomy(args, phase) {
  args.context.clearRect(0, 0, SIZE, SIZE);
  const colorContext = createColorContext(args.context, phase.flash ? '#f4f4f4' : null);
  drawRavenCinderquillScavengerAnatomy(colorContext, args.direction, phase);
}

function resultFor(args, renderedAnimation, renderedFrame, motion) {
  return Object.freeze({
    family: args.family.id,
    variant: args.variant.id,
    direction: args.direction,
    animation: args.animation.id,
    frame: args.frame,
    renderedAnimation,
    renderedFrame,
    ravenCinderquillScavengerGate: EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE.id,
    architectureDecision: EN_E11_RAVEN_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.id,
    role: EN_E11_RAVEN_CINDERQUILL_SCAVENGER_CONTRACT.role,
    anatomy: EN_E11_RAVEN_CINDERQUILL_SCAVENGER_CONTRACT.chassis,
    upperBody: 'rounded-blue-black-head-short-smoky-throat-and-two-folded-slate-wings',
    lowerBody: 'two-grounded-three-toed-talons-and-one-connected-black-wedge-tail',
    motion,
    childAssetCount: EN_E11_RAVEN_CINDERQUILL_SCAVENGER_DATA.childAssets.length,
    effectBoundary: EN_E11_RAVEN_CINDERQUILL_SCAVENGER_DATA.effectBoundary,
  });
}

function renderIdle(args) {
  const phase = IDLE_PHASES[args.frame];
  renderAnatomy(args, phase);
  return resultFor(args, 'idle', args.frame, phase.name);
}

function renderWalk(args) {
  const phase = WALK_PHASES[args.frame];
  renderAnatomy(args, phase);
  return resultFor(args, 'walk', args.frame, phase.name);
}

function renderAttack(args, outputAnimation = 'attack', outputFrame = args.frame) {
  const phase = ATTACK_PHASES[args.frame];
  renderAnatomy(args, phase);
  return resultFor(
    { ...args, animation: { ...args.animation, id: outputAnimation }, frame: outputFrame },
    'attack',
    args.frame,
    outputAnimation === 'cast' ? 'exact-cast-alias-of-grounded-cinderquill-wing-screen-and-beak-rake' : phase.name,
  );
}

function renderHurt(args, outputAnimation = 'hurt', outputFrame = args.frame) {
  const phase = HURT_PHASES[args.frame];
  renderAnatomy(args, phase);
  return resultFor(
    { ...args, animation: { ...args.animation, id: outputAnimation }, frame: outputFrame },
    'hurt',
    args.frame,
    outputAnimation === 'death' ? 'exact-death-alias-of-grounded-cinderquill-recoil' : phase.name,
  );
}

function renderRavenCinderquillScavenger(args) {
  assert(args.family.id === 'raven', 'The EN-E11 Raven renderer is restricted to Raven.');
  assert(args.variant.id === 'cinderquill-scavenger', 'The EN-E11 Raven renderer is restricted to Cinderquill Scavenger.');
  if (args.animation.id === 'idle') {
    assert(args.frame >= 0 && args.frame < 2, 'Raven Cinderquill Scavenger Idle authorizes only F1-F2.');
    return renderIdle(args);
  }
  if (args.animation.id === 'walk') {
    assert(args.frame >= 0 && args.frame < 4, 'Raven Cinderquill Scavenger Walk authorizes only W1-W4.');
    return renderWalk(args);
  }
  if (args.animation.id === 'attack') {
    assert(args.frame >= 0 && args.frame < 4, 'Raven Cinderquill Scavenger Attack authorizes only A1-A4.');
    return renderAttack(args);
  }
  if (args.animation.id === 'hurt') {
    assert(args.frame >= 0 && args.frame < 2, 'Raven Cinderquill Scavenger Hurt authorizes only H1-H2.');
    return renderHurt(args);
  }
  if (args.animation.id === 'cast') {
    assert(args.frame >= 0 && args.frame < 4, 'Raven Cinderquill Scavenger Cast authorizes only C1-C4.');
    return renderAttack({ ...args, animation: { ...args.animation, id: 'attack' } }, 'cast', args.frame);
  }
  if (args.animation.id === 'death') {
    assert(args.frame >= 0 && args.frame < 4, 'Raven Cinderquill Scavenger Death authorizes only D1-D4.');
    const sourceFrame = EN_E11_RAVEN_CINDERQUILL_SCAVENGER_DEATH_SOURCE_FRAMES[args.frame];
    return renderHurt({ ...args, animation: { ...args.animation, id: 'hurt' }, frame: sourceFrame }, 'death', args.frame);
  }
  throw new TypeError('The EN-E11 Raven Cinderquill Scavenger gate authorizes only Idle, Walk, Attack, Cast, Hurt, and Death.');
}

export const EN_E11_RAVEN_CINDERQUILL_SCAVENGER_RENDERER = Object.freeze({
  key: 'en-e11-raven-cinderquill-scavenger-full-v1',
  chassis: EN_E11_RAVEN_CINDERQUILL_SCAVENGER_CONTRACT.chassis,
  render: renderRavenCinderquillScavenger,
});

export const EN_E11_RAVEN_CINDERQUILL_SCAVENGER_FAMILY = deepFreeze({
  id: 'raven',
  name: 'Raven',
  sliceId: 'EN-E11',
  rendererKey: EN_E11_RAVEN_CINDERQUILL_SCAVENGER_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [CINDERQUILL_SCAVENGER_VARIANT],
  rendererData: {
    approvedPrecedingGate: EN_E11_COCKATRICE_CROWNCOIL_BASILARCH_GATE.id,
    activeGate: EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE.id,
    topologyDecision: EN_E11_RAVEN_TOPOLOGY_DECISION.id,
  },
  review: {
    baselineVariant: 'cinderquill-scavenger',
    scale: 6,
    notes: 'Unapproved private common Raven candidate against approved Crowncoil Basilarch, approved Rainfan Forager, and public Harpy Screecher. Stop after exact review-packet inspection and validation. Do not commit or push candidate pixels without explicit approval of the posted exact packet or candidate digest. Keep public or outline registration, fixtures, effects, child assets, Raven specialist or elite, Owl, Phoenix, release, accepted drift, and a pull request separate.',
  },
});

export const EN_E11_RAVEN_CINDERQUILL_SCAVENGER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E11_RAVEN_CINDERQUILL_SCAVENGER_RENDERER],
  families: [EN_E11_RAVEN_CINDERQUILL_SCAVENGER_FAMILY],
});
