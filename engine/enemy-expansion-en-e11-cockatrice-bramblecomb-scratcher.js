import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE,
} from './enemy-expansion-en-e11-peacock-crownveil-sovereign.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E11_COCKATRICE_TOPOLOGY_DECISION = deepFreeze({
  id: 'en-e11-cockatrice-actor-topology-v1',
  sliceId: 'EN-E11',
  family: 'cockatrice',
  status: 'selected',
  selected: 'baked-single-actor-grounded-serpent-tailed-cockerel',
  selectedOn: '2026-08-13',
  approvalEvidence: 'The exact Crownveil Sovereign implementation 13ceea22b163ae87fe2b6acd9dcf0e45c6e800bc, approval record 15d55e973e5b0d1566e2d3dec39981d37edf24b8, initial published handoff dee859e09ea86ddb546082b4bb45290d06afa252, and current reconciliation 99fed17ec4815b6985288818796a85b9abc7d78d are pushed and remote verified. A fresh designer continuation, lets do next, opened only the Cockatrice topology decision. The recommended baked-single-actor-grounded-serpent-tailed-cockerel topology keeps the rooster crest, beak, folded wings, two broad taloned feet, and coiled serpent tail in one connected 24x24 actor. The designer replied approved. That reply selects this topology and authorizes exactly one private common Cockatrice 80-frame candidate. It does not approve candidate pixels or authorize publication, public or outline registration, fixtures, effects, child assets, specialist or elite Cockatrices, Raven, Owl, Phoenix, release, accepted drift, or a pull request.',
  alternatives: [
    'baked-single-actor-grounded-serpent-tailed-cockerel',
    'body-plus-detached-serpent-tail-child',
    'quadruped-basilisk-like-cockatrice',
  ],
  childAssets: [],
  effectBoundary: 'Petrifying gaze, venom, dust, glow, projectiles, and impacts remain external.',
});

export const EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_CONTRACT = deepFreeze({
  family: 'cockatrice',
  variant: 'bramblecomb-scratcher',
  role: 'common',
  state: 'implemented-complete-motion-approved',
  chassis: EN_E11_COCKATRICE_TOPOLOGY_DECISION.selected,
  silhouette: 'One connected low-slung cockerel-and-serpent actor joins a jagged rooster comb and wattle, hooked beak, arched scaled neck, broad feathered torso, two folded wings, two separated taloned feet, and one thick body-owned serpent tail that coils behind the feet and lashes without becoming a child asset. It is neither a fan-tailed Peacock, upright Birdfolk person, ordinary two-legged bird, nor quadruped basilisk.',
  identity: 'Moss-olive head and neck scales, warm umber body, straw-and-rust folded wings, a crimson bramble comb and wattle, old-ivory hooked beak, amber eyes, ochre talons, and a dark forest-green scale-marked serpent tail distinguish the Bramblecomb Scratcher common.',
  effectBoundary: EN_E11_COCKATRICE_TOPOLOGY_DECISION.effectBoundary,
});

export const EN_E11_COCKATRICE_COMMON_CONTRACT_CARD = deepFreeze({
  family: 'cockatrice',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingGate: EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.id,
  precedingFamily: {
    id: 'peacock',
    finalVariant: 'crownveil-sovereign',
    status: 'implemented-full-approved-published-reconciled',
  },
  activeVariant: {
    id: EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_CONTRACT.variant,
    role: EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_CONTRACT.role,
    status: 'implemented-full-approved',
  },
  deferredRoles: ['specialist', 'elite'],
});

export const EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE = deepFreeze({
  id: 'en-e11-cockatrice-bramblecomb-scratcher-full-v1',
  status: 'approved',
  authorizedOn: '2026-08-13',
  authorizationEvidence: EN_E11_COCKATRICE_TOPOLOGY_DECISION.approvalEvidence,
  baseCheckpoint: '99fed17ec4815b6985288818796a85b9abc7d78d',
  architectureDecision: EN_E11_COCKATRICE_TOPOLOGY_DECISION.id,
  approvedOn: '2026-08-13',
  approvalEvidence: 'The exact labeled all-four-direction raw/no-outline, distinct Complete B outlined, Complete B + Form, and approved Crownveil Sovereign, approved Aerie Scout, and public Marsh Crocodile comparison PNGs were frozen with both synchronized GIF hashes. All four exact PNG paths were loaded and inspected at original resolution, and the transparent 20x4 inspection atlas passed dimensions, hard alpha, non-empty-cell, and strict boundary checks. The final approval prompt posted all four exact PNGs, both synchronized GIFs, and candidate digest 0d55f7dc0fafac3014bcdfa1ea2dce3cbb4b5ba09eb6c52f6c723067702b9764. The designer replied: approved lets do next. Approval applies only to that exact Bramblecomb Scratcher digest and its six frozen review hashes. The continuation opens exactly one private specialist Cockatrice full 80-frame candidate after this bounded publication tuple is reconciled; it does not approve specialist pixels or authorize public or outline registration, fixtures, effects, child assets, elite Cockatrice, Raven, Owl, Phoenix, release, accepted drift, or a pull request.',
  approvedImplementation: 'c01ac35a5862296469967255ffcadadfd5aaae4e',
  publicationAuthorizedOn: '2026-08-13',
  publicationAuthorizationEvidence: 'The designer previously said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact frozen artifact or digest. It does not authorize registration, fixtures, effects, child assets, later roles or families, release, accepted drift, or a pull request.',
  publishedImplementation: 'c01ac35a5862296469967255ffcadadfd5aaae4e',
  publishedApprovalRecord: '335b5c467c10f2042128ef7e7f20367735422909',
  initialPublishedHandoff: '9347a28f6cef9c6ca11a163732674d203bc87d94',
  publicationState: 'published',
  precedingApproval: {
    gateId: EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.id,
    candidateFrameDigest: EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.candidateFrameDigest,
    publishedImplementation: EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.initialPublishedHandoff,
    currentReconciliation: '99fed17ec4815b6985288818796a85b9abc7d78d',
  },
  artifact: 'enemy-expansion-review/en-e11-cockatrice-bramblecomb-scratcher/en-e11-cockatrice-bramblecomb-scratcher-full-suite-raw.png',
  artifactSha256: 'c42f11a84cdd6f711eb485f1a3125e9438603acba9a7c4ec17aac5aae0df5f00',
  outlinedArtifact: 'enemy-expansion-review/en-e11-cockatrice-bramblecomb-scratcher/en-e11-cockatrice-bramblecomb-scratcher-full-suite-outlined-complete-b.png',
  outlinedArtifactSha256: '7cde3cb4ca342f554d42ec4f1b5959bf901acd803a2c0da467b62b6166c9fd2d',
  assembledArtifact: 'enemy-expansion-review/en-e11-cockatrice-bramblecomb-scratcher/en-e11-cockatrice-bramblecomb-scratcher-full-suite-complete-b-form.png',
  assembledArtifactSha256: '7c896d379bd57f3105d4ca42a6be69b15c8d60f5bbe8cbee61e941ba12756582',
  comparisonArtifact: 'enemy-expansion-review/en-e11-cockatrice-bramblecomb-scratcher/en-e11-cockatrice-bramblecomb-scratcher-family-comparison.png',
  comparisonArtifactSha256: 'afcceb3e614fafebd3416c8d7ee79fd7380ad45fbcfcbbefe1416f621df6cd8e',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e11-cockatrice-bramblecomb-scratcher/en-e11-cockatrice-bramblecomb-scratcher-full-suite-four-directions-labeled.gif',
      sha256: '8bc278089a917e9659f976f301b5b82bd303952947bf1a06885b92c7f0c9ced9',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e11-cockatrice-bramblecomb-scratcher/en-e11-cockatrice-bramblecomb-scratcher-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '96fdc163c8093fb4215d0d8b6eb9786e9d14ddd8774ceade04722cebcc82c21d',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
  },
  candidateFrameDigest: '0d55f7dc0fafac3014bcdfa1ea2dce3cbb4b5ba09eb6c52f6c723067702b9764',
  crownveilComparisonDigest: '6c4220e3a108eb902370a6d69bea8f2334a73dfddd914deb7f9a43495b99c82d',
  aerieScoutComparisonDigest: 'afff790c5f60684561752ff7fe9f8f4312c5b46679477cc88d29764379ca41c8',
  marshCrocodileComparisonDigest: 'aaabe38311ec314f97b902e92ee6f426199f33c2f5051e8a7ffc7a58c737a19a',
  scope: 'One complete private 80-frame Cockatrice Bramblecomb Scratcher common enemy across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle holds a watchful cockerel posture over a connected tail coil. Walk alternates two broad talon steps with wing, neck, and coil counter-motion. Attack plants both talons, draws back the arched neck, snaps the hooked beak forward, lashes the connected serpent tail through two readable phases, and recovers. Hurt uses a complete-silhouette #f4f4f4 recoil and colored grounded recovery. Cast aliases Attack exactly and Death aliases Hurt H1,H2,H2,H2.',
  anatomyContract: EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_CONTRACT.silhouette,
  reviewPresentation: 'Show the exact labeled all-four-direction Bramblecomb Scratcher raw/no-outline, outlined Complete B, Complete B + Form, Crownveil/Aerie Scout/Marsh Crocodile comparison board, and both synchronized full-suite GIFs together.',
  exclusions: [
    'approved Crownveil Sovereign pixel changes',
    'approved Aerie Scout pixel changes',
    'public Marsh Crocodile pixel changes',
    'Cockatrice specialist',
    'Cockatrice elite',
    'Raven',
    'Owl',
    'Phoenix',
    'new Cast pixels',
    'new Death pixels',
    'detached serpent-tail child assets',
    'baked petrifying-gaze pixels',
    'baked venom pixels',
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
  nextGate: 'The exact Bramblecomb Scratcher implementation c01ac35a5862296469967255ffcadadfd5aaae4e, approval record 335b5c467c10f2042128ef7e7f20367735422909, and initial published handoff 9347a28f6cef9c6ca11a163732674d203bc87d94 are remote verified; this reconciliation completes the bounded publication tuple. The same approval reply opens exactly one private specialist Cockatrice full 80-frame candidate from this clean pushed checkpoint under the selected topology; it does not approve specialist pixels. The distinct outlined PNG remains review evidence only and does not authorize outline registration. Public Cockatrice registration, fixtures, effects, child assets, elite Cockatrice, Raven, Owl, Phoenix, release, accepted drift, and a pull request remain closed.',
});

export const EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_DATA = deepFreeze({
  actor: {
    species: 'cockatrice',
    bodyBuild: 'grounded-serpent-tailed-cockerel',
    skin: 'feathered-scaled',
    hairStyle: 'bramble-comb',
    hairColor: 'crimson',
    expression: 'feral',
    faceDetail: 'hooked-beak',
    headgear: 'none',
    outfit: 'none',
    outfitColor: 'moss-umber',
    outfitTier: 'tier1',
    weapon: 'none',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: ['#7d8350', '#4d5136', '#a9a66f'],
      hair: ['#a8443d', '#682d33', '#d46c54'],
      outfit: ['#806044', '#4a3f32', '#b58a45'],
    },
  },
  actorTopology: EN_E11_COCKATRICE_TOPOLOGY_DECISION.selected,
  childAssets: [],
  cockatrice: {
    head: ['#7d8350', '#4d5136', '#a9a66f'],
    body: ['#806044', '#4a3f32', '#a17b56'],
    wing: ['#b58a45', '#704f2f', '#d4ad62'],
    comb: ['#a8443d', '#682d33', '#d46c54'],
    tail: ['#355b4a', '#203b37', '#568066'],
    scale: ['#9a9a62', '#5f6845', '#c2b778'],
    beak: ['#d2b36d', '#7b6038', '#edd58f'],
    talon: ['#bd8d43', '#64492d'],
    eye: '#f0c657',
    feature: '#241d1c',
  },
  effectBoundary: 'external-petrifying-gaze-venom-dust-glow-projectiles-and-impacts',
  bakedEffects: [],
});

const BRAMBLECOMB_SCRATCHER_VARIANT = deepFreeze({
  id: 'bramblecomb-scratcher',
  name: 'Bramblecomb Scratcher',
  role: EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_CONTRACT.role,
  status: EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_CONTRACT.state,
  brief: 'Common natural Cockatrice with a jagged crimson rooster comb, hooked beak, moss-scaled neck, folded rust wings, broad talons, and one thick connected forest-green serpent tail that coils at rest and lashes during its planted strike.',
  rendererData: EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_DATA,
});

export const EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'scratcher-watch', upperBob: 0, wingPhase: 0, legPhase: 0, tailMode: 'coil', tailSway: 0, beakReach: 0, neckShift: 0, flash: false },
  { name: 'coil-breath', upperBob: 1, wingPhase: 1, legPhase: 0, tailMode: 'coil', tailSway: 1, beakReach: 0, neckShift: 0, flash: false },
]);

const WALK_PHASES = deepFreeze([
  { name: 'left-claw-step', upperBob: 0, wingPhase: 1, legPhase: 1, tailMode: 'coil', tailSway: -1, beakReach: 0, neckShift: 0, flash: false },
  { name: 'scaled-compress', upperBob: 1, wingPhase: 0, legPhase: 2, tailMode: 'brace', tailSway: 0, beakReach: 0, neckShift: 0, flash: false },
  { name: 'right-claw-step', upperBob: 0, wingPhase: 1, legPhase: 3, tailMode: 'coil', tailSway: 1, beakReach: 0, neckShift: 0, flash: false },
  { name: 'coil-recover', upperBob: 0, wingPhase: 2, legPhase: 4, tailMode: 'brace', tailSway: 0, beakReach: 0, neckShift: 0, flash: false },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'two-talon-neck-draw', upperBob: 0, wingPhase: 2, legPhase: 1, tailMode: 'brace', tailSway: 0, beakReach: 0, neckShift: 0, flash: false },
  { name: 'hooked-beak-jab', upperBob: 0, wingPhase: 3, legPhase: 0, tailMode: 'lash', tailSway: 0, beakReach: 1, neckShift: 1, flash: false },
  { name: 'serpent-tail-lash', upperBob: 0, wingPhase: 4, legPhase: 3, tailMode: 'lash', tailSway: 1, beakReach: 1, neckShift: 1, flash: false },
  { name: 'coil-recover', upperBob: 1, wingPhase: 1, legPhase: 0, tailMode: 'coil', tailSway: 0, beakReach: 0, neckShift: 0, flash: false },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-hybrid-recoil', upperBob: 0, wingPhase: 2, legPhase: 1, tailMode: 'brace', tailSway: -1, beakReach: 0, neckShift: 0, flash: true },
  { name: 'grounded-coil-recovery', upperBob: 1, wingPhase: 1, legPhase: 0, tailMode: 'coil', tailSway: 0, beakReach: 0, neckShift: 0, flash: false },
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
      'Bramblecomb Scratcher rectangles must use positive integer geometry.',
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

function drawFrontTail(paint, phase) {
  const { tail, scale } = EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_DATA.cockatrice;
  if (phase.tailMode === 'lash') {
    paint.rect(13, 14, 5, 5, tail[0]);
    paint.rect(17, 13, 4, 4, tail[1]);
    paint.rect(20, 11, 3, 3, tail[2]);
    paint.dot(21, 11, scale[2]);
    paint.dot(18, 14, scale[0]);
    paint.dot(15, 16, scale[1]);
    return;
  }
  const sway = phase.tailSway;
  const inset = phase.tailMode === 'brace' ? 0 : 1;
  paint.rect(7, 14, 6, 5, tail[0]);
  paint.rect(4 + sway, 16, 6 + inset, 4, tail[1]);
  paint.rect(2 + sway, 18, 5 + inset, 3, tail[2]);
  paint.dot(2 + sway, 18, scale[2]);
  paint.dot(5 + sway, 19, scale[0]);
  paint.dot(8 + sway, 17, scale[1]);
}

function drawSideTail(paint, phase) {
  const { tail, scale } = EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_DATA.cockatrice;
  if (phase.tailMode === 'lash') {
    paint.rect(9, 14, 5, 5, tail[0]);
    paint.rect(6, 15, 4, 4, tail[1]);
    paint.rect(3, 13, 4, 4, tail[2]);
    paint.rect(1, 11, 3, 3, tail[0]);
    paint.dot(1, 11, scale[2]);
    paint.dot(4, 14, scale[0]);
    paint.dot(7, 16, scale[1]);
    return;
  }
  const sway = phase.tailSway;
  const inset = phase.tailMode === 'brace' ? 1 : 0;
  paint.rect(9, 14, 5, 5, tail[0]);
  paint.rect(6 + sway, 16, 5 + inset, 4, tail[1]);
  paint.rect(3 + sway, 18, 5 + inset, 3, tail[2]);
  paint.rect(1, 17, 3 + Math.max(0, sway), 2, tail[0]);
  paint.dot(1, 17, scale[2]);
  paint.dot(5 + sway, 19, scale[0]);
  paint.dot(8 + sway, 17, scale[1]);
}

function drawTail(paint, phase) {
  if (paint.view === 'right') drawSideTail(paint, phase);
  else drawFrontTail(paint, phase);
}

function drawFrontBody(paint, phase, rearView) {
  const { body, wing, scale } = EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_DATA.cockatrice;
  const bob = phase.upperBob;
  paint.rect(7, 10 + bob, 10, 9, body[0]);
  paint.rect(8, 15 + bob, 8, 4, body[1]);
  paint.rect(10, 11 + bob, 4, 6, rearView ? scale[1] : body[2]);
  if (phase.wingPhase === 4) {
    paint.rect(3, 9 + bob, 8, 8, wing[0]);
    paint.rect(13, 9 + bob, 7, 8, wing[0]);
    paint.rect(3, 14 + bob, 8, 4, wing[1]);
    paint.rect(13, 14 + bob, 7, 4, wing[1]);
    paint.rect(6, 17 + bob, 5, 2, wing[2]);
    paint.rect(13, 17 + bob, 5, 2, wing[2]);
    return;
  }
  if (phase.wingPhase === 3) {
    paint.rect(3, 7 + bob, 8, 10, wing[0]);
    paint.rect(13, 7 + bob, 6, 10, wing[0]);
    paint.rect(4, 12 + bob, 7, 6, wing[1]);
    paint.rect(13, 12 + bob, 5, 6, wing[1]);
    paint.rect(7, 8 + bob, 4, 3, wing[2]);
    paint.rect(13, 8 + bob, 4, 3, wing[2]);
    return;
  }
  const spread = phase.wingPhase === 2 ? 1 : 0;
  const lower = phase.wingPhase === 1 ? 1 : 0;
  paint.rect(5 - spread, 11 + bob + lower, 6 + spread, 7, wing[0]);
  paint.rect(13, 11 + bob + lower, 6 + spread, 7, wing[0]);
  paint.rect(5 - spread, 15 + bob + lower, 6 + spread, 3, wing[1]);
  paint.rect(13, 15 + bob + lower, 6 + spread, 3, wing[1]);
  paint.rect(7, 17 + bob + lower, 4, 2, wing[2]);
  paint.rect(13, 17 + bob + lower, 4, 2, wing[2]);
}

function drawSideBody(paint, phase) {
  const { body, wing, scale } = EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_DATA.cockatrice;
  const bob = phase.upperBob;
  paint.rect(9, 10 + bob, 10, 9, body[0]);
  paint.rect(10, 15 + bob, 9, 4, body[1]);
  paint.rect(9, 11 + bob, 5, 6, scale[1]);
  if (phase.wingPhase === 4) {
    paint.rect(10, 8 + bob, 11, 8, wing[0]);
    paint.rect(11, 13 + bob, 10, 5, wing[1]);
    paint.rect(13, 16 + bob, 7, 3, wing[2]);
    return;
  }
  if (phase.wingPhase === 3) {
    paint.rect(10, 6 + bob, 8, 11, wing[0]);
    paint.rect(11, 11 + bob, 7, 7, wing[1]);
    paint.rect(12, 7 + bob, 5, 4, wing[2]);
    return;
  }
  const spread = phase.wingPhase === 2 ? 1 : 0;
  const lower = phase.wingPhase === 1 ? 1 : 0;
  paint.rect(8 - spread, 11 + bob + lower, 10 + spread, 7, wing[0]);
  paint.rect(8 - spread, 15 + bob + lower, 9 + spread, 3, wing[1]);
  paint.rect(10, 17 + bob + lower, 6, 2, wing[2]);
}

function drawBody(paint, phase, rearView) {
  if (paint.view === 'right') drawSideBody(paint, phase);
  else drawFrontBody(paint, phase, rearView);
}

function drawFrontLeg(paint, x, rearView) {
  const { body, talon } = EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_DATA.cockatrice;
  paint.rect(x, 16, 2, 5, rearView ? body[1] : body[2]);
  paint.rect(x, 20, 2, 2, talon[1]);
  paint.rect(x - 1, 22, 4, 1, rearView ? talon[1] : talon[0]);
}

function drawSideLeg(paint, x, farLeg) {
  const { body, talon } = EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_DATA.cockatrice;
  paint.rect(x, 16, 2, 5, farLeg ? body[1] : body[2]);
  paint.rect(x, 20, 2, 2, talon[1]);
  paint.rect(x - 1, 22, 4, 1, farLeg ? talon[1] : talon[0]);
}

function drawLegs(paint, phase, rearView) {
  if (paint.view === 'right') {
    const state = SIDE_LEG_PHASES[phase.legPhase];
    drawSideLeg(paint, 10 + state.farX, true);
    drawSideLeg(paint, 16 + state.nearX, false);
    return;
  }
  const state = FRONT_LEG_PHASES[phase.legPhase];
  drawFrontLeg(paint, 8 + state.leftX, rearView);
  drawFrontLeg(paint, 15 + state.rightX, rearView);
}

function drawFrontHead(paint, phase, rearView) {
  const { head, comb, scale, beak, eye, feature } = EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_DATA.cockatrice;
  const bob = phase.upperBob;
  const shift = phase.neckShift;
  paint.rect(10, 6 + bob + shift, 5, 8 - Math.max(0, shift), head[0]);
  paint.rect(11, 8 + bob + shift, 3, 6 - Math.max(0, shift), scale[0]);
  paint.rect(8, 3 + bob + shift, 8, 5, head[0]);
  paint.rect(9, 2 + bob + shift, 2, 2, comb[0]);
  paint.rect(11, 1 + bob + shift, 2, 3, comb[2]);
  paint.rect(13, 2 + bob + shift, 2, 2, comb[0]);
  paint.rect(9, 3 + bob + shift, 6, 1, comb[1]);
  if (rearView) {
    paint.rect(9, 4 + bob + shift, 6, 3, head[1]);
    paint.dot(10, 5 + bob + shift, scale[2]);
    paint.dot(13, 6 + bob + shift, scale[0]);
    paint.rect(11, 7 + bob + shift, 3, 2, comb[0]);
    return;
  }
  paint.dot(10, 5 + bob + shift, eye);
  paint.dot(14, 5 + bob + shift, eye);
  paint.dot(10, 6 + bob + shift, feature);
  paint.dot(14, 6 + bob + shift, feature);
  paint.rect(11, 6 + bob + shift, 3, 2 + phase.beakReach, beak[0]);
  paint.rect(11, 8 + bob + shift + phase.beakReach, 3, 1, beak[1]);
  paint.rect(10, 8 + bob + shift, 2, 3, comb[0]);
  paint.rect(13, 8 + bob + shift, 2, 2, comb[1]);
}

function drawSideHead(paint, phase) {
  const { head, comb, scale, beak, eye, feature } = EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_DATA.cockatrice;
  const bob = phase.upperBob;
  const shift = phase.neckShift;
  paint.rect(13, 6 + bob + shift, 5, 8 - Math.max(0, shift), head[0]);
  paint.rect(12, 9 + bob + shift, 4, 5 - Math.max(0, shift), scale[0]);
  paint.rect(14, 3 + bob + shift, 7, 5, head[0]);
  paint.rect(14, 2 + bob + shift, 2, 2, comb[0]);
  paint.rect(16, 1 + bob + shift, 2, 3, comb[2]);
  paint.rect(18, 2 + bob + shift, 2, 2, comb[0]);
  paint.rect(14, 3 + bob + shift, 6, 1, comb[1]);
  paint.dot(18, 5 + bob + shift, eye);
  paint.dot(19, 5 + bob + shift, feature);
  paint.rect(19, 6 + bob + shift, 3 + phase.beakReach, 2, beak[0]);
  paint.dot(21 + phase.beakReach, 8 + bob + shift, beak[1]);
  paint.rect(16, 8 + bob + shift, 3, 3, comb[0]);
  paint.dot(17, 10 + bob + shift, comb[1]);
}

function drawHead(paint, phase, rearView) {
  if (paint.view === 'right') drawSideHead(paint, phase);
  else drawFrontHead(paint, phase, rearView);
}

export function drawCockatriceBramblecombScratcherAnatomy(context, direction, phase) {
  const paint = createPainter(context, direction);
  const rearView = paint.view === 'up';
  drawTail(paint, phase);
  drawBody(paint, phase, rearView);
  drawLegs(paint, phase, rearView);
  drawHead(paint, phase, rearView);
}

function renderAnatomy(args, phase) {
  args.context.clearRect(0, 0, SIZE, SIZE);
  const colorContext = createColorContext(args.context, phase.flash ? '#f4f4f4' : null);
  drawCockatriceBramblecombScratcherAnatomy(colorContext, args.direction, phase);
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
    cockatriceBramblecombScratcherGate: EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.id,
    architectureDecision: EN_E11_COCKATRICE_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.id,
    role: EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_CONTRACT.role,
    anatomy: EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_CONTRACT.chassis,
    upperBody: 'jagged-crimson-rooster-comb-wattle-hooked-beak-arched-moss-scaled-neck-and-folded-rust-wings',
    lowerBody: 'two-separated-grounded-ochre-talons-and-one-connected-forest-green-serpent-tail',
    motion,
    childAssetCount: EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_DATA.childAssets.length,
    effectBoundary: EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_DATA.effectBoundary,
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
    outputAnimation === 'cast' ? 'exact-cast-alias-of-connected-beak-strike-and-serpent-tail-lash' : phase.name,
  );
}

function renderHurt(args, outputAnimation = 'hurt', outputFrame = args.frame) {
  const phase = HURT_PHASES[args.frame];
  renderAnatomy(args, phase);
  return resultFor(
    { ...args, animation: { ...args.animation, id: outputAnimation }, frame: outputFrame },
    'hurt',
    args.frame,
    outputAnimation === 'death' ? 'exact-death-alias-of-grounded-bramblecomb-hurt' : phase.name,
  );
}

function renderCockatriceBramblecombScratcher(args) {
  assert(args.family.id === 'cockatrice', 'The EN-E11 Cockatrice renderer is restricted to Cockatrice.');
  assert(args.variant.id === 'bramblecomb-scratcher', 'The EN-E11 Cockatrice renderer is restricted to Bramblecomb Scratcher.');
  if (args.animation.id === 'idle') {
    assert(args.frame >= 0 && args.frame < 2, 'Cockatrice Bramblecomb Scratcher Idle authorizes only F1-F2.');
    return renderIdle(args);
  }
  if (args.animation.id === 'walk') {
    assert(args.frame >= 0 && args.frame < 4, 'Cockatrice Bramblecomb Scratcher Walk authorizes only W1-W4.');
    return renderWalk(args);
  }
  if (args.animation.id === 'attack') {
    assert(args.frame >= 0 && args.frame < 4, 'Cockatrice Bramblecomb Scratcher Attack authorizes only A1-A4.');
    return renderAttack(args);
  }
  if (args.animation.id === 'hurt') {
    assert(args.frame >= 0 && args.frame < 2, 'Cockatrice Bramblecomb Scratcher Hurt authorizes only H1-H2.');
    return renderHurt(args);
  }
  if (args.animation.id === 'cast') {
    assert(args.frame >= 0 && args.frame < 4, 'Cockatrice Bramblecomb Scratcher Cast authorizes only C1-C4.');
    return renderAttack({ ...args, animation: { ...args.animation, id: 'attack' } }, 'cast', args.frame);
  }
  if (args.animation.id === 'death') {
    assert(args.frame >= 0 && args.frame < 4, 'Cockatrice Bramblecomb Scratcher Death authorizes only D1-D4.');
    const sourceFrame = EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_DEATH_SOURCE_FRAMES[args.frame];
    return renderHurt({ ...args, animation: { ...args.animation, id: 'hurt' }, frame: sourceFrame }, 'death', args.frame);
  }
  throw new TypeError('The EN-E11 Cockatrice Bramblecomb Scratcher gate authorizes only Idle, Walk, Attack, Cast, Hurt, and Death.');
}

export const EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_RENDERER = Object.freeze({
  key: 'en-e11-cockatrice-bramblecomb-scratcher-full-v1',
  chassis: EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_CONTRACT.chassis,
  render: renderCockatriceBramblecombScratcher,
});

export const EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_FAMILY = deepFreeze({
  id: 'cockatrice',
  name: 'Cockatrice',
  sliceId: 'EN-E11',
  rendererKey: EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [BRAMBLECOMB_SCRATCHER_VARIANT],
  rendererData: {
    approvedPrecedingGate: EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.id,
    activeGate: EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_GATE.id,
    topologyDecision: EN_E11_COCKATRICE_TOPOLOGY_DECISION.id,
  },
  review: {
    baselineVariant: 'bramblecomb-scratcher',
    scale: 6,
    notes: 'Visually approved as one exact private common Cockatrice against approved Crownveil Sovereign, approved Aerie Scout, and public Marsh Crocodile. Accepted implementation c01ac35a5862296469967255ffcadadfd5aaae4e, approval record 335b5c467c10f2042128ef7e7f20367735422909, and initial published handoff 9347a28f6cef9c6ca11a163732674d203bc87d94 are remote verified; this reconciliation completes the bounded publication tuple. The distinct Complete B outlined PNG remains review evidence only. The same reply opens exactly one private specialist Cockatrice candidate from this clean checkpoint. Keep public or outline registration, fixtures, effects, child assets, elite Cockatrice, later Bird families, release, accepted drift, and a pull request separate.',
  },
});

export const EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_RENDERER],
  families: [EN_E11_COCKATRICE_BRAMBLECOMB_SCRATCHER_FAMILY],
});
