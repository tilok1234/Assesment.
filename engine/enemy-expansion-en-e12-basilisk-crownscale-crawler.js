import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_GATE,
} from './enemy-expansion-en-e11-phoenix-dawnthrone-imperator.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E12_BASILISK_TOPOLOGY_DECISION = deepFreeze({
  id: 'en-e12-basilisk-actor-topology-v1',
  sliceId: 'EN-E12',
  family: 'basilisk',
  status: 'approved',
  selected: 'baked-single-actor-grounded-four-clawed-crowned-serpent',
  approvedOn: '2026-08-15',
  approvalEvidence: 'The exact Dawnthrone Imperator implementation 68c36bb5711b985ab9f9a37a68c18bfc0748c399, approval record 4acfbbb172a8ff380ce22141f68d494e620ce9c4, initial published handoff 6d6fa755f4c7c7a4fefa0da3e2740d7a43629f25, final reconciliation and approved-enemy copy package checkpoint 6bec0b69f95c11d63780712aff223073376c2541 are pushed and remote verified. A fresh designer continuation, awesome lets do next, opened only the documented EN-E12 priority-first Basilisk topology decision. The recommended baked-single-actor-grounded-four-clawed-crowned-serpent topology keeps the wedge head, connected crown crest, plated long body, four clawed legs, and tapering serpent tail in one grounded 24x24 actor. The designer replied approved. That reply selects only this topology and authorizes exactly one private common Basilisk 80-frame candidate. It does not approve candidate pixels or authorize a commit, push, public or outline registration, fixtures, effects, child assets, specialist or elite Basilisks, Manticore, Sphinx, boss work, release, accepted drift, or a pull request.',
  alternatives: [
    {
      id: 'baked-single-actor-grounded-four-clawed-crowned-serpent',
      status: 'selected',
      summary: 'One connected low serpent-lizard actor with a crown crest, plated back, four grounded clawed legs, and a body-owned tapering tail.',
    },
    {
      id: 'body-plus-detached-serpent-tail-child',
      status: 'rejected',
      summary: 'A detached tail would cross the child-asset boundary and weaken the continuous long-body read.',
    },
    {
      id: 'upright-crowned-naga-basilisk',
      status: 'rejected',
      summary: 'An upright form would collapse the required distinction from the approved Naga chassis.',
    },
  ],
  childAssets: [],
  effectBoundary: 'Petrifying gaze, venom, glow, dust, projectiles, detached fangs or scales, shock rings, and impacts remain external.',
  rationale: 'The common Basilisk must read as a natural low quadruped-serpent before color or effects. A single connected actor preserves the 24x24 frame contract while the four claw contacts, crowned wedge head, plated back, and tapering tail separate it from upright Naga, birdlike Cockatrice, and ordinary Crocodile silhouettes.',
});

export const EN_E12_BASILISK_CROWNSCALE_CRAWLER_CONTRACT = deepFreeze({
  family: 'basilisk',
  variant: 'crownscale-crawler',
  role: 'common',
  state: 'implemented-complete-motion-approved',
  chassis: EN_E12_BASILISK_TOPOLOGY_DECISION.selected,
  silhouette: 'One connected low, long Basilisk joins a broad wedge-shaped serpent head, a connected three-pronged keratin crown, short plated neck, heavy scale-armored barrel body, four separately readable grounded clawed legs, and one thick tapering upturned serpent tail. It is neither an upright humanoid Naga, serpent-tailed cockerel Cockatrice, ordinary uncrowned Crocodile, nor winged composite.',
  identity: 'Deep moss and forest-green hide, sage back plates, an ochre throat and belly, old-bone three-pronged crown, amber eyes, dark wedge jaw, ivory fangs, and bronze claws distinguish the Crownscale Crawler common without relying on gaze, venom, glow, dust, or projectiles.',
  effectBoundary: EN_E12_BASILISK_TOPOLOGY_DECISION.effectBoundary,
});

export const EN_E12_BASILISK_COMMON_CONTRACT_CARD = deepFreeze({
  family: 'basilisk',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingGate: EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_GATE.id,
  precedingFamily: {
    id: 'phoenix',
    finalVariant: 'dawnthrone-imperator',
    status: 'implemented-full-approved-published-reconciled',
  },
  activeVariant: {
    id: EN_E12_BASILISK_CROWNSCALE_CRAWLER_CONTRACT.variant,
    role: EN_E12_BASILISK_CROWNSCALE_CRAWLER_CONTRACT.role,
    status: 'implemented-full-approved',
  },
  deferredRoles: ['specialist', 'elite'],
});

export const EN_E12_BASILISK_CROWNSCALE_CRAWLER_GATE = deepFreeze({
  id: 'en-e12-basilisk-crownscale-crawler-full-v1',
  status: 'approved',
  authorizedOn: '2026-08-15',
  authorizationEvidence: EN_E12_BASILISK_TOPOLOGY_DECISION.approvalEvidence,
  baseCheckpoint: '6bec0b69f95c11d63780712aff223073376c2541',
  architectureDecision: EN_E12_BASILISK_TOPOLOGY_DECISION.id,
  approvedOn: '2026-08-15',
  approvalEvidence: 'The final approval prompt posted the exact labeled all-four-direction raw/no-outline, distinct Complete B outlined, Complete B + Form, and Naga-Cockatrice-Marsh Crocodile comparison PNGs together with both synchronized full-suite GIFs and candidate digest 96283b7a295071acaa7541a44ccccbd6c99af0523b4e66d69cb5c9a706cd9872. All four exact PNGs, all eight raw and Complete B + Form phase sheets, the transparent 20x4 inspection atlas, and both exact GIFs were inspected at original resolution; Aseprite parsed all six principal files and regeneration reproduced every frozen hash. The designer replied: Approved lets do next. Pixel approval applies only to that exact Crownscale Crawler digest and its six frozen review hashes. The continuation clause separately opens exactly one private specialist Basilisk candidate only after this common publication tuple is complete; it does not approve specialist pixels or open public or outline registration, fixtures, package mutation, effects, child assets, elite Basilisk work, Manticore, Sphinx, boss work, release, accepted drift, or a pull request.',
  approvedImplementation: '3071d18d98b84ca1492e88ab85bf7765aa7ee0d0',
  publicationAuthorizedOn: '2026-08-15',
  publicationAuthorizationEvidence: 'The designer previously said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact frozen artifact or digest. The designer now replied Approved lets do next to the exact Crownscale Crawler review packet. This does not authorize public or outline registration, fixtures, package mutation, effects, child assets, specialist pixel approval, elite Basilisk work, Manticore, Sphinx, boss work, release, accepted drift, or a pull request.',
  publishedImplementation: '',
  publishedApprovalRecord: '',
  initialPublishedHandoff: '',
  publicationState: 'approved-not-published',
  precedingApproval: {
    gateId: EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_GATE.id,
    candidateFrameDigest: EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_GATE.candidateFrameDigest,
    publishedImplementation: EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_GATE.initialPublishedHandoff,
    currentReconciliation: '6bec0b69f95c11d63780712aff223073376c2541',
  },
  artifact: 'enemy-expansion-review/en-e12-basilisk-crownscale-crawler/en-e12-basilisk-crownscale-crawler-full-suite-raw.png',
  artifactSha256: '1c06e9921dd81028e7da5e2e45756852bf466150156fe466a61ca387ec6823bd',
  outlinedArtifact: 'enemy-expansion-review/en-e12-basilisk-crownscale-crawler/en-e12-basilisk-crownscale-crawler-full-suite-outlined-complete-b.png',
  outlinedArtifactSha256: 'c4fd7a868ff220e90d63683b542d8e02353ef33e69c0b29a8b371c48551fec07',
  assembledArtifact: 'enemy-expansion-review/en-e12-basilisk-crownscale-crawler/en-e12-basilisk-crownscale-crawler-full-suite-complete-b-form.png',
  assembledArtifactSha256: 'f1c5cfd174522a89a6a1194958c603d84df7b26cf1434423276cd07eef87b66d',
  comparisonArtifact: 'enemy-expansion-review/en-e12-basilisk-crownscale-crawler/en-e12-basilisk-crownscale-crawler-family-comparison.png',
  comparisonArtifactSha256: '5471ca5ea7e1be4e935ae4bb063fa23f2145efa397530162632b15ad6da23aa4',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e12-basilisk-crownscale-crawler/en-e12-basilisk-crownscale-crawler-full-suite-four-directions-labeled.gif',
      sha256: 'c7570f094b448f16715c83814b8a8da62126c9ecaa04daf5002e7ef5f48ce5bb',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e12-basilisk-crownscale-crawler/en-e12-basilisk-crownscale-crawler-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: 'ec32bcad5e6a36e775022d9ed024581db10e10d2a20a89e65a787a5d57efae4e',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
  },
  candidateFrameDigest: '96283b7a295071acaa7541a44ccccbd6c99af0523b4e66d69cb5c9a706cd9872',
  nagaComparisonDigest: 'f94b2c647275c9ab7d79433e29fa37f37285c2a203ad87be6631efbb02642c0b',
  cockatriceComparisonDigest: '0d55f7dc0fafac3014bcdfa1ea2dce3cbb4b5ba09eb6c52f6c723067702b9764',
  marshCrocodileComparisonDigest: 'aaabe38311ec314f97b902e92ee6f426199f33c2f5051e8a7ffc7a58c737a19a',
  scope: 'One complete private 80-frame Basilisk Crownscale Crawler common enemy across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Every frame preserves one connected grounded four-clawed crowned serpent actor. Idle holds a low crown-forward watch and settles the upturned tail. Walk uses four weight shifts while all four claw contacts, back plates, crown, and tail remain readable. Attack braces the four legs, raises the connected crown and neck, drives a body-owned fanged forward press, and recoils without detached gaze, venom, glow, dust, or impact pixels. Hurt uses a complete-silhouette #f4f4f4 recoil and colored grounded recovery. Cast aliases Attack exactly and Death aliases Hurt H1,H2,H2,H2.',
  anatomyContract: EN_E12_BASILISK_CROWNSCALE_CRAWLER_CONTRACT.silhouette,
  reviewPresentation: 'Show the exact labeled all-four-direction Crownscale Crawler raw/no-outline, outlined Complete B, Complete B + Form, Naga/Cockatrice/Marsh Crocodile comparison board, and both synchronized full-suite GIFs together.',
  exclusions: [
    'approved Dawnthrone Imperator source module and pixels',
    'approved Naga Coilguard source module and pixels',
    'approved Cockatrice Bramblecomb Scratcher source module and pixels',
    'public Marsh Crocodile pixels',
    'approved-enemy copy package contents',
    'Basilisk specialist or elite variants',
    'Manticore or Sphinx',
    '48x48 boss work',
    'new Cast pixels',
    'new Death pixels',
    'detached tail, fang, scale, or gaze child assets',
    'baked petrifying-gaze pixels',
    'baked venom pixels',
    'baked glow pixels',
    'baked dust pixels',
    'baked projectile pixels',
    'baked shock-ring or impact pixels',
    'registration',
    'outline registration',
    'consumer exposure',
    'fixtures',
    'effects',
    'release',
    'accepted drift',
    'pull request',
  ],
  nextGate: 'The exact Crownscale Crawler implementation 3071d18d98b84ca1492e88ab85bf7765aa7ee0d0 is pushed and remote verified. Commit and push only this approval record, then create the initial published handoff and final reconciliation needed to complete the bounded Basilisk common publication tuple. The same reply includes a lets do next continuation, which opens exactly one private specialist Basilisk candidate only after that publication tuple is complete; it does not approve specialist pixels. Public or outline registration, fixtures, approved-enemy package mutation, effects, child assets, elite Basilisk work, Manticore, Sphinx, boss work, release, accepted drift, and a pull request remain closed. The distinct outlined PNG remains review evidence only and does not authorize outline registration.',
});

export const EN_E12_BASILISK_CROWNSCALE_CRAWLER_DATA = deepFreeze({
  actor: {
    species: 'basilisk',
    bodyBuild: 'low-long-four-clawed-crowned-serpent',
    skin: 'scaled',
    hairStyle: 'connected-three-pronged-keratin-crown',
    hairColor: 'old-bone',
    expression: 'crown-forward-predator',
    faceDetail: 'amber-eyes-dark-wedge-jaw-and-ivory-fangs',
    headgear: 'none',
    outfit: 'connected-sage-back-plates-and-ochre-belly',
    outfitColor: 'sage-ochre',
    outfitTier: 'tier1',
    weapon: 'none',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: ['#48633b', '#233723'],
      hair: ['#d2bd7d', '#786039'],
      outfit: ['#81905a', '#455232', '#b78c4a'],
    },
  },
  actorTopology: EN_E12_BASILISK_TOPOLOGY_DECISION.selected,
  childAssets: [],
  basilisk: {
    hide: ['#48633b', '#233723', '#6f8050'],
    plate: ['#81905a', '#455232', '#aeb66c'],
    belly: ['#b78c4a', '#684b2d', '#d8b66c'],
    crown: ['#d2bd7d', '#786039', '#f0dfa5'],
    jaw: ['#705b3b', '#342b24', '#a58a58'],
    claw: ['#a87b43', '#59412b', '#d1a861'],
    fang: ['#e8dfc4', '#8b8064'],
    scale: ['#91a15f', '#53633b', '#c0c878'],
    eye: '#f4cf54',
    feature: '#171d16',
  },
  effectBoundary: 'external-petrifying-gaze-venom-glow-dust-projectiles-detached-fangs-or-scales-shock-rings-and-impacts',
  bakedEffects: [],
});

const CROWNSCALE_CRAWLER_VARIANT = deepFreeze({
  id: 'crownscale-crawler',
  name: 'Crownscale Crawler',
  role: EN_E12_BASILISK_CROWNSCALE_CRAWLER_CONTRACT.role,
  status: EN_E12_BASILISK_CROWNSCALE_CRAWLER_CONTRACT.state,
  brief: 'Common low Basilisk with deep moss hide, sage back plates, ochre throat and belly, a connected old-bone three-pronged crown, amber eyes, dark wedge jaw, ivory fangs, four separately grounded bronze-clawed legs, and one connected tapering upturned serpent tail.',
  rendererData: EN_E12_BASILISK_CROWNSCALE_CRAWLER_DATA,
});

export const EN_E12_BASILISK_CROWNSCALE_CRAWLER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const MOTION_PHASES = deepFreeze({
  idle: [
    { name: 'low-crownscale-watch', bodyY: 0, headReach: 0, headY: 0, crownMode: 'set', tailMode: 'upturned', tailSide: -1, legPhase: 0, flash: false },
    { name: 'plated-barrel-breath', bodyY: 1, headReach: 0, headY: 1, crownMode: 'set', tailMode: 'settled', tailSide: 1, legPhase: 1, flash: false },
  ],
  walk: [
    { name: 'front-left-claw-weight', bodyY: 0, headReach: 0, headY: 0, crownMode: 'set', tailMode: 'upturned', tailSide: -1, legPhase: 1, flash: false },
    { name: 'rear-right-scale-compress', bodyY: 1, headReach: 0, headY: 1, crownMode: 'set', tailMode: 'settled', tailSide: -1, legPhase: 2, flash: false },
    { name: 'front-right-claw-weight', bodyY: 0, headReach: 0, headY: 0, crownMode: 'set', tailMode: 'upturned', tailSide: 1, legPhase: 3, flash: false },
    { name: 'rear-left-tail-recover', bodyY: 1, headReach: 0, headY: 0, crownMode: 'set', tailMode: 'settled', tailSide: 1, legPhase: 4, flash: false },
  ],
  attack: [
    { name: 'four-claw-serpent-brace', bodyY: 1, headReach: 0, headY: 1, crownMode: 'set', tailMode: 'braced', tailSide: -1, legPhase: 0, flash: false },
    { name: 'connected-crown-neck-rise', bodyY: 0, headReach: 1, headY: 0, crownMode: 'raised', tailMode: 'raised', tailSide: -1, legPhase: 2, flash: false },
    { name: 'body-owned-fanged-press', bodyY: 0, headReach: 2, headY: 2, crownMode: 'pressed', tailMode: 'raised', tailSide: 1, legPhase: 3, flash: false },
    { name: 'crownscale-grounded-recoil', bodyY: 1, headReach: 0, headY: 1, crownMode: 'set', tailMode: 'upturned', tailSide: 1, legPhase: 1, flash: false },
  ],
  hurt: [
    { name: 'white-crowned-serpent-recoil', bodyY: 1, headReach: 0, headY: 1, crownMode: 'pressed', tailMode: 'braced', tailSide: -1, legPhase: 2, flash: true },
    { name: 'four-claw-grounded-recovery', bodyY: 1, headReach: 0, headY: 1, crownMode: 'set', tailMode: 'settled', tailSide: 1, legPhase: 0, flash: false },
  ],
});

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
      'Crownscale Crawler rectangles must use positive integer geometry.',
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

function drawSideTail(paint, phase) {
  const { hide, plate, scale } = EN_E12_BASILISK_CROWNSCALE_CRAWLER_DATA.basilisk;
  const bob = phase.bodyY;
  paint.rect(5, 12 + bob, 6, 6, hide[0]);
  paint.rect(5, 16 + bob, 5, 3, hide[1]);
  if (phase.tailMode === 'raised') {
    paint.rect(3, 10 + bob, 4, 5, hide[0]);
    paint.rect(1, 7 + bob, 3, 5, hide[2]);
    paint.rect(1, 7 + bob, 2, 2, plate[2]);
    paint.dot(4, 11 + bob, scale[0]);
    paint.dot(6, 14 + bob, scale[2]);
    return;
  }
  if (phase.tailMode === 'braced') {
    paint.rect(3, 14 + bob, 4, 5, hide[1]);
    paint.rect(1, 13 + bob, 3, 4, hide[2]);
    paint.dot(1, 13 + bob, plate[2]);
    paint.dot(4, 15 + bob, scale[0]);
    return;
  }
  const settled = phase.tailMode === 'settled' ? 1 : 0;
  paint.rect(3, 13 + bob + settled, 4, 5, hide[1]);
  paint.rect(1, 11 + bob + settled, 3, 4, hide[2]);
  paint.rect(1, 10 + bob + settled, 2, 2, plate[2]);
  paint.dot(4, 14 + bob + settled, scale[0]);
  paint.dot(6, 13 + bob + settled, scale[2]);
}

function drawFrontTail(paint, phase) {
  const { hide, plate, scale } = EN_E12_BASILISK_CROWNSCALE_CRAWLER_DATA.basilisk;
  const bob = phase.bodyY;
  const right = phase.tailSide > 0;
  if (right) {
    paint.rect(15, 13 + bob, 5, 5, hide[0]);
    paint.rect(19, 12 + bob, 3, 4, hide[2]);
    paint.rect(21, (phase.tailMode === 'raised' ? 8 : 10) + bob, 2, 4, hide[1]);
    paint.dot(22, (phase.tailMode === 'raised' ? 8 : 10) + bob, plate[2]);
    paint.dot(19, 14 + bob, scale[0]);
    return;
  }
  paint.rect(4, 13 + bob, 5, 5, hide[0]);
  paint.rect(2, 12 + bob, 3, 4, hide[2]);
  paint.rect(1, (phase.tailMode === 'raised' ? 8 : 10) + bob, 2, 4, hide[1]);
  paint.dot(1, (phase.tailMode === 'raised' ? 8 : 10) + bob, plate[2]);
  paint.dot(4, 14 + bob, scale[0]);
}

function drawTail(paint, phase) {
  if (paint.view === 'right') drawSideTail(paint, phase);
  else drawFrontTail(paint, phase);
}

const SIDE_LEG_X = Object.freeze([5, 9, 14, 18]);
const FRONT_LEG_X = Object.freeze([5, 9, 14, 18]);

function drawGroundedLeg(paint, x, phase, farLeg, index) {
  const { hide, belly, claw } = EN_E12_BASILISK_CROWNSCALE_CRAWLER_DATA.basilisk;
  const bob = phase.bodyY;
  const active = ((phase.legPhase + index) % 4) < 2;
  const upper = farLeg ? hide[1] : (active ? belly[0] : belly[1]);
  paint.rect(x, 15 + bob, 2, 5 - bob, upper);
  paint.rect(x, 19, 2, 3, farLeg ? claw[1] : claw[0]);
  paint.rect(x - 1, 22, 3, 1, farLeg ? claw[1] : claw[2]);
  paint.dot(x + 1, 21, claw[1]);
}

function drawLegs(paint, phase) {
  const positions = paint.view === 'right' ? SIDE_LEG_X : FRONT_LEG_X;
  for (let index = 0; index < positions.length; index++) {
    drawGroundedLeg(paint, positions[index], phase, index === 0 || index === 2, index);
  }
}

function drawSideBody(paint, phase) {
  const { hide, plate, belly, scale } = EN_E12_BASILISK_CROWNSCALE_CRAWLER_DATA.basilisk;
  const bob = phase.bodyY;
  paint.rect(5, 10 + bob, 14, 8, hide[0]);
  paint.rect(6, 15 + bob, 12, 4, hide[1]);
  paint.rect(8, 11 + bob, 9, 4, hide[2]);
  paint.rect(10, 15 + bob, 8, 3, belly[0]);
  paint.rect(11, 17 + bob, 7, 2, belly[1]);
  paint.rect(7, 8 + bob, 3, 3, plate[0]);
  paint.rect(10, 7 + bob, 3, 4, plate[2]);
  paint.rect(13, 8 + bob, 3, 3, plate[0]);
  paint.rect(16, 9 + bob, 2, 2, plate[1]);
  paint.dot(8, 12 + bob, scale[2]);
  paint.dot(11, 13 + bob, scale[0]);
  paint.dot(14, 12 + bob, scale[1]);
  paint.dot(17, 13 + bob, scale[2]);
}

function drawFrontBody(paint, phase, rearView) {
  const { hide, plate, belly, scale } = EN_E12_BASILISK_CROWNSCALE_CRAWLER_DATA.basilisk;
  const bob = phase.bodyY;
  paint.rect(5, 10 + bob, 14, 8, hide[0]);
  paint.rect(6, 15 + bob, 12, 4, hide[1]);
  paint.rect(7, 9 + bob, 10, 4, hide[2]);
  paint.rect(5, 12 + bob, 3, 5, plate[0]);
  paint.rect(16, 12 + bob, 3, 5, plate[0]);
  if (rearView) {
    paint.rect(9, 12 + bob, 6, 7, plate[1]);
    paint.rect(10, 11 + bob, 4, 3, plate[2]);
  } else {
    paint.rect(9, 13 + bob, 6, 6, belly[0]);
    paint.rect(10, 16 + bob, 4, 3, belly[1]);
  }
  paint.dot(7, 11 + bob, scale[2]);
  paint.dot(10, 12 + bob, scale[0]);
  paint.dot(13, 12 + bob, scale[1]);
  paint.dot(16, 11 + bob, scale[2]);
}

function drawBody(paint, phase, rearView) {
  if (paint.view === 'right') drawSideBody(paint, phase);
  else drawFrontBody(paint, phase, rearView);
}

function drawCrownSide(paint, x, y, mode) {
  const { crown } = EN_E12_BASILISK_CROWNSCALE_CRAWLER_DATA.basilisk;
  const raised = mode === 'raised' ? 1 : 0;
  const pressed = mode === 'pressed' ? 1 : 0;
  paint.rect(x, y + 3 + pressed, 7, 2, crown[1]);
  paint.rect(x + 1, y + 5 + pressed, 5, 2, crown[1]);
  paint.rect(x, y + 2 + pressed, 7, 2, crown[0]);
  paint.rect(x, y + 1 + pressed, 2, 2 + raised, crown[0]);
  paint.rect(x + 3, y + pressed, 2, 3 + raised, crown[2]);
  paint.rect(x + 6, y + 1 + pressed, 1, 2 + raised, crown[0]);
}

function drawCrownFront(paint, x, y, mode) {
  const { crown } = EN_E12_BASILISK_CROWNSCALE_CRAWLER_DATA.basilisk;
  const raised = mode === 'raised' ? 1 : 0;
  const pressed = mode === 'pressed' ? 1 : 0;
  paint.rect(x, y + 3 + pressed, 9, 2, crown[1]);
  paint.rect(x + 2, y + 5 + pressed, 5, 3, crown[1]);
  paint.rect(x, y + 2 + pressed, 9, 2, crown[0]);
  paint.rect(x, y + 1 + pressed, 2, 2 + raised, crown[0]);
  paint.rect(x + 3, y + pressed, 3, 3 + raised, crown[2]);
  paint.rect(x + 7, y + 1 + pressed, 2, 2 + raised, crown[0]);
}

function drawSideHead(paint, phase) {
  const { hide, plate, jaw, fang, scale, eye, feature } = EN_E12_BASILISK_CROWNSCALE_CRAWLER_DATA.basilisk;
  const reach = phase.headReach;
  const y = 4 + phase.headY;
  paint.rect(13 + reach, y + 5, 6, 7, hide[0]);
  paint.rect(14 + reach, y + 7, 5, 5, plate[1]);
  paint.rect(15 + reach, y + 3, 5, 7, hide[0]);
  paint.rect(17 + reach, y + 4, 6 - reach, 5, hide[2]);
  paint.rect(18 + reach, y + 7, 5 - reach, 4, jaw[0]);
  paint.rect(19 + reach, y + 9, 4 - reach, 2, jaw[1]);
  drawCrownSide(paint, 15 + Math.min(reach, 1), y - 3, phase.crownMode);
  paint.dot(19 + reach, y + 5, eye);
  paint.dot(20 + reach, y + 5, feature);
  paint.dot(21 + Math.min(reach, 1), y + 9, fang[0]);
  paint.dot(16 + reach, y + 6, scale[2]);
  paint.dot(17 + reach, y + 9, scale[0]);
}

function drawFrontHead(paint, phase, rearView) {
  const { hide, plate, jaw, fang, scale, eye, feature } = EN_E12_BASILISK_CROWNSCALE_CRAWLER_DATA.basilisk;
  const y = 4 + phase.headY;
  const widen = phase.headReach === 2 ? 1 : 0;
  paint.rect(7 - widen, y + 4, 10 + (widen * 2), 7, hide[0]);
  paint.rect(8 - widen, y + 3, 8 + (widen * 2), 5, hide[2]);
  paint.rect(8, y + 8, 8, 5, rearView ? plate[1] : jaw[0]);
  paint.rect(9, y + 10, 6, 3, rearView ? hide[1] : jaw[1]);
  drawCrownFront(paint, 8 - widen, y - 3, phase.crownMode);
  if (rearView) {
    paint.rect(9, y + 5, 6, 3, plate[0]);
    paint.dot(10, y + 6, scale[2]);
    paint.dot(13, y + 6, scale[0]);
    return;
  }
  paint.dot(9, y + 6, eye);
  paint.dot(14, y + 6, eye);
  paint.dot(10, y + 7, feature);
  paint.dot(13, y + 7, feature);
  paint.dot(10, y + 11, fang[0]);
  paint.dot(13, y + 11, fang[0]);
  paint.dot(11, y + 9, scale[2]);
  paint.dot(12, y + 9, scale[0]);
}

function drawHead(paint, phase, rearView) {
  if (paint.view === 'right') drawSideHead(paint, phase);
  else drawFrontHead(paint, phase, rearView);
}

export function drawBasiliskCrownscaleCrawlerAnatomy(context, direction, phase) {
  const paint = createPainter(context, direction);
  const rearView = paint.view === 'up';
  drawTail(paint, phase);
  drawLegs(paint, phase);
  drawBody(paint, phase, rearView);
  drawHead(paint, phase, rearView);
}

function renderAnatomy(args, phase) {
  args.context.clearRect(0, 0, SIZE, SIZE);
  const colorContext = createColorContext(args.context, phase.flash ? '#f4f4f4' : null);
  drawBasiliskCrownscaleCrawlerAnatomy(colorContext, args.direction, phase);
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
    basiliskCrownscaleCrawlerGate: EN_E12_BASILISK_CROWNSCALE_CRAWLER_GATE.id,
    architectureDecision: EN_E12_BASILISK_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_GATE.id,
    role: EN_E12_BASILISK_CROWNSCALE_CRAWLER_CONTRACT.role,
    anatomy: EN_E12_BASILISK_CROWNSCALE_CRAWLER_CONTRACT.chassis,
    upperBody: 'broad-wedge-serpent-head-connected-three-pronged-old-bone-crown-dark-jaw-amber-eyes-and-ivory-fangs',
    lowerBody: 'low-long-sage-plated-moss-barrel-four-separately-grounded-bronze-clawed-legs-and-connected-upturned-tail',
    motion,
    childAssetCount: EN_E12_BASILISK_CROWNSCALE_CRAWLER_DATA.childAssets.length,
    effectBoundary: EN_E12_BASILISK_CROWNSCALE_CRAWLER_DATA.effectBoundary,
  });
}

function renderIdle(args) {
  const phase = MOTION_PHASES.idle[args.frame];
  renderAnatomy(args, phase);
  return resultFor(args, 'idle', args.frame, phase.name);
}

function renderWalk(args) {
  const phase = MOTION_PHASES.walk[args.frame];
  renderAnatomy(args, phase);
  return resultFor(args, 'walk', args.frame, phase.name);
}

function renderAttack(args, outputAnimation = 'attack', outputFrame = args.frame) {
  const phase = MOTION_PHASES.attack[args.frame];
  renderAnatomy(args, phase);
  return resultFor(
    { ...args, animation: { ...args.animation, id: outputAnimation }, frame: outputFrame },
    'attack',
    args.frame,
    outputAnimation === 'cast' ? 'exact-cast-alias-of-four-claw-crown-rise-and-fanged-forward-press' : phase.name,
  );
}

function renderHurt(args, outputAnimation = 'hurt', outputFrame = args.frame) {
  const phase = MOTION_PHASES.hurt[args.frame];
  renderAnatomy(args, phase);
  return resultFor(
    { ...args, animation: { ...args.animation, id: outputAnimation }, frame: outputFrame },
    'hurt',
    args.frame,
    outputAnimation === 'death' ? 'exact-death-alias-of-grounded-crownscale-hurt' : phase.name,
  );
}

function renderBasiliskCrownscaleCrawler(args) {
  assert(args.family.id === 'basilisk', 'The EN-E12 Basilisk renderer is restricted to Basilisk.');
  assert(args.variant.id === 'crownscale-crawler', 'The EN-E12 Basilisk renderer is restricted to Crownscale Crawler.');
  if (args.animation.id === 'idle') {
    assert(args.frame >= 0 && args.frame < 2, 'Basilisk Crownscale Crawler Idle authorizes only F1-F2.');
    return renderIdle(args);
  }
  if (args.animation.id === 'walk') {
    assert(args.frame >= 0 && args.frame < 4, 'Basilisk Crownscale Crawler Walk authorizes only W1-W4.');
    return renderWalk(args);
  }
  if (args.animation.id === 'attack') {
    assert(args.frame >= 0 && args.frame < 4, 'Basilisk Crownscale Crawler Attack authorizes only A1-A4.');
    return renderAttack(args);
  }
  if (args.animation.id === 'hurt') {
    assert(args.frame >= 0 && args.frame < 2, 'Basilisk Crownscale Crawler Hurt authorizes only H1-H2.');
    return renderHurt(args);
  }
  if (args.animation.id === 'cast') {
    assert(args.frame >= 0 && args.frame < 4, 'Basilisk Crownscale Crawler Cast authorizes only C1-C4.');
    return renderAttack({ ...args, animation: { ...args.animation, id: 'attack' } }, 'cast', args.frame);
  }
  if (args.animation.id === 'death') {
    assert(args.frame >= 0 && args.frame < 4, 'Basilisk Crownscale Crawler Death authorizes only D1-D4.');
    const sourceFrame = EN_E12_BASILISK_CROWNSCALE_CRAWLER_DEATH_SOURCE_FRAMES[args.frame];
    return renderHurt({ ...args, animation: { ...args.animation, id: 'hurt' }, frame: sourceFrame }, 'death', args.frame);
  }
  throw new TypeError('The EN-E12 Basilisk Crownscale Crawler gate authorizes only Idle, Walk, Attack, Cast, Hurt, and Death.');
}

export const EN_E12_BASILISK_CROWNSCALE_CRAWLER_RENDERER = Object.freeze({
  key: 'en-e12-basilisk-crownscale-crawler-full-v1',
  chassis: EN_E12_BASILISK_CROWNSCALE_CRAWLER_CONTRACT.chassis,
  render: renderBasiliskCrownscaleCrawler,
});

export const EN_E12_BASILISK_CROWNSCALE_CRAWLER_FAMILY = deepFreeze({
  id: 'basilisk',
  name: 'Basilisk',
  sliceId: 'EN-E12',
  rendererKey: EN_E12_BASILISK_CROWNSCALE_CRAWLER_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [CROWNSCALE_CRAWLER_VARIANT],
  rendererData: {
    approvedPrecedingGate: EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_GATE.id,
    activeGate: EN_E12_BASILISK_CROWNSCALE_CRAWLER_GATE.id,
    topologyDecision: EN_E12_BASILISK_TOPOLOGY_DECISION.id,
  },
  review: {
    baselineVariant: 'crownscale-crawler',
    scale: 6,
    notes: 'Approved private Crownscale Crawler common Basilisk only, bound to exact implementation 3071d18d98b84ca1492e88ab85bf7765aa7ee0d0, candidate digest 96283b7a295071acaa7541a44ccccbd6c99af0523b4e66d69cb5c9a706cd9872, and its six frozen review hashes. The designer replied Approved lets do next to the posted exact packet. The continuation clause opens only one private specialist Basilisk candidate after common publication completes and does not approve specialist pixels. Keep public or outline registration, fixtures, approved-enemy package mutation, effects, child assets, elite Basilisk work, Manticore, Sphinx, boss work, release, accepted drift, and a pull request separate.',
  },
});

export const EN_E12_BASILISK_CROWNSCALE_CRAWLER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E12_BASILISK_CROWNSCALE_CRAWLER_RENDERER],
  families: [EN_E12_BASILISK_CROWNSCALE_CRAWLER_FAMILY],
});
