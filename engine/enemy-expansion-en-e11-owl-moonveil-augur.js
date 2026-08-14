import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E11_OWL_COMMON_CONTRACT_CARD,
  EN_E11_OWL_HUSHMASK_PROWLER_CONTRACT,
  EN_E11_OWL_HUSHMASK_PROWLER_DATA,
  EN_E11_OWL_HUSHMASK_PROWLER_GATE,
  EN_E11_OWL_HUSHMASK_PROWLER_RENDERER,
  EN_E11_OWL_TOPOLOGY_DECISION,
} from './enemy-expansion-en-e11-owl-hushmask-prowler.js';
import {
  EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE,
} from './enemy-expansion-en-e11-raven-mournglass-scrier.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E11_OWL_MOONVEIL_AUGUR_CONTRACT = deepFreeze({
  family: 'owl',
  variant: 'moonveil-augur',
  role: 'specialist',
  state: 'implemented-complete-motion-approved',
  chassis: EN_E11_OWL_TOPOLOGY_DECISION.selected,
  silhouette: 'The approved compact grounded Hushmask Prowler Owl remains complete beneath connected swept crescent brow-plumes, a silver-blue facial-disk frame, layered shoulder mantle, moon-barred folded wings, throat clasp, and short tail bands. The broad round head, small hooked beak, compact feathered barrel, two body-owned wings, two separated three-toed taloned feet, and connected short fan tail remain readable in every direction. No regalia pixel floats, no human anatomy is exposed, and no effect substitutes for the Owl body.',
  identity: 'Midnight-indigo head and body plumage, blue-black wings, a pearl-silver facial disk, connected moon-silver brow-plumes and shoulder mantle, cool teal eyes and feather marks, a steel beak, slate talons, and a short silver-banded fan tail distinguish the Moonveil Augur specialist from common Hushmask Prowler.',
  effectBoundary: 'Moon halos, omen rings, runes, scrying panes, shadow wisps, loose feathers, dust, glow, projectiles, air blades, and impact effects remain external.',
});

export const EN_E11_OWL_SPECIALIST_CONTRACT_CARD = deepFreeze({
  family: 'owl',
  roleOrder: EN_E11_OWL_COMMON_CONTRACT_CARD.roleOrder,
  precedingVariant: {
    id: EN_E11_OWL_HUSHMASK_PROWLER_CONTRACT.variant,
    role: EN_E11_OWL_HUSHMASK_PROWLER_CONTRACT.role,
    status: 'implemented-full-approved-published-reconciled',
  },
  activeVariant: {
    id: EN_E11_OWL_MOONVEIL_AUGUR_CONTRACT.variant,
    role: EN_E11_OWL_MOONVEIL_AUGUR_CONTRACT.role,
    status: 'implemented-full-approved-published-reconciled',
  },
  deferredRoles: ['elite'],
});

export const EN_E11_OWL_MOONVEIL_AUGUR_GATE = deepFreeze({
  id: 'en-e11-owl-moonveil-augur-full-v1',
  status: 'approved',
  authorizedOn: '2026-08-14',
  authorizationEvidence: 'The exact Hushmask Prowler implementation e0fd0560ec93d12959d06cd30b593c82be74ffbd, approval record 0e2dbbc6f519c1e135a57686ab1e0600d0327239, initial published handoff afa265a17feca93d2bd1c49cc844c3259e751d04, and final reconciliation 0d4aff05c0ace01be69ddc2ebf8efcf79abcd394 are pushed and remote verified. The designer then supplied the fresh continuation: Let\'s do next. Under the documented Owl common, specialist, elite role order and selected baked-single-actor-grounded-facial-disk-owl topology, this fresh request authorizes exactly one private specialist Owl full 80-frame candidate. Because the role was not pre-named, this lane names only Moonveil Augur. It does not approve candidate pixels or authorize a commit, push, public or outline registration, fixtures, effects, child assets, Owl elite, Phoenix, release, accepted drift, or a pull request.',
  baseCheckpoint: '0d4aff05c0ace01be69ddc2ebf8efcf79abcd394',
  architectureDecision: EN_E11_OWL_TOPOLOGY_DECISION.id,
  approvedOn: '2026-08-14',
  approvalEvidence: 'The final approval prompt posted the exact labeled all-four-direction raw/no-outline, distinct Complete B outlined, Complete B + Form, and Hushmask-Mournglass-Harpy comparison PNGs together with both synchronized full-suite GIFs and candidate digest 86dbba1f850c9411f8d25949f4284874eb594711f4aa8c2c09f75172b2a2addd. All four exact PNGs, all eight raw and Complete B + Form phase sheets, the transparent 20x4 inspection atlas, and both exact GIFs were inspected at original resolution and loaded through Aseprite; both GIFs validated as 640x672 four-frame animations and regeneration reproduced every frozen hash. The designer replied: Approved. Approval applies only to that exact Moonveil Augur digest and its six frozen review hashes. It does not open public or outline registration, fixtures, effects, child assets, Owl elite, Phoenix, another Bird family, release, accepted drift, or a pull request.',
  approvedImplementation: 'e3544a7c08195d67d7bfac4a4f531bc53c0a1981',
  publicationAuthorizedOn: '2026-08-14',
  publicationAuthorizationEvidence: 'The designer previously said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact frozen artifact or digest. The designer now replied Approved to the exact Moonveil Augur review packet. This does not authorize public or outline registration, fixtures, effects, child assets, Owl elite, Phoenix, later families, release, accepted drift, or a pull request.',
  publishedImplementation: 'e3544a7c08195d67d7bfac4a4f531bc53c0a1981',
  publishedApprovalRecord: 'c384f07ace77822b12b1daa54b3fc6ca8ef11209',
  initialPublishedHandoff: '5dd51c5bdd386ecf4648cae3cc722fcd3ea8cc90',
  publicationState: 'published',
  precedingApproval: {
    gateId: EN_E11_OWL_HUSHMASK_PROWLER_GATE.id,
    candidateFrameDigest: EN_E11_OWL_HUSHMASK_PROWLER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E11_OWL_HUSHMASK_PROWLER_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E11_OWL_HUSHMASK_PROWLER_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E11_OWL_HUSHMASK_PROWLER_GATE.initialPublishedHandoff,
    currentReconciliation: '0d4aff05c0ace01be69ddc2ebf8efcf79abcd394',
  },
  artifact: 'enemy-expansion-review/en-e11-owl-moonveil-augur/en-e11-owl-moonveil-augur-full-suite-raw.png',
  artifactSha256: 'cfcefc24118f92bc786808f0bb9b043653b5a852a6eff9ce76e04cd75b1b93c3',
  outlinedArtifact: 'enemy-expansion-review/en-e11-owl-moonveil-augur/en-e11-owl-moonveil-augur-full-suite-outlined-complete-b.png',
  outlinedArtifactSha256: '743f5afed2cf7677a2b061a06a8bb6ba45765ab16615e67277437c159699ee97',
  assembledArtifact: 'enemy-expansion-review/en-e11-owl-moonveil-augur/en-e11-owl-moonveil-augur-full-suite-complete-b-form.png',
  assembledArtifactSha256: '84a4efa628dc44a71616146c0a1a875c3ece2dda2f6a0ceb409e645bd0c6f81b',
  comparisonArtifact: 'enemy-expansion-review/en-e11-owl-moonveil-augur/en-e11-owl-moonveil-augur-family-comparison.png',
  comparisonArtifactSha256: '914f1e3cfb46904a231e8897569a2dccaa85c5f22c72f640346bf04a1c7d3876',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e11-owl-moonveil-augur/en-e11-owl-moonveil-augur-full-suite-four-directions-labeled.gif',
      sha256: '8c9160678d67e11a99e6dba1eb0cb7a4baff1bcba8de6b3c2e6698fcf47777c4',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e11-owl-moonveil-augur/en-e11-owl-moonveil-augur-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '1b2713198b363cbc841973143655d9e55d30c1f35501cecc8d0fbb2cce89c3d4',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
  },
  candidateFrameDigest: '86dbba1f850c9411f8d25949f4284874eb594711f4aa8c2c09f75172b2a2addd',
  hushmaskComparisonDigest: EN_E11_OWL_HUSHMASK_PROWLER_GATE.candidateFrameDigest,
  mournglassComparisonDigest: EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.candidateFrameDigest,
  harpyComparisonDigest: 'd7d83f0c209a8b4735e0a488a5df128bffa5407e38fd28e4fc38d73b633e5839',
  scope: 'One complete private 80-frame Owl Moonveil Augur specialist enemy across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Every frame preserves the approved grounded Hushmask anatomy and full-body motion beneath connected specialist plumage and regalia. Idle holds a moonward watch and settles the silver throat clasp. Walk alternates two grounded silent steps while the swept brow-plumes, layered mantle, moon-barred wings, and connected short fan tail counterbalance. Attack braces on both talons, lifts the body-owned wings into an asymmetrical moon-screen, drives a precise hooked-beak mantle press, and refolds. Hurt uses a complete-silhouette #f4f4f4 recoil and colored grounded recovery. Cast aliases Attack exactly and Death aliases Hurt H1,H2,H2,H2.',
  anatomyContract: EN_E11_OWL_MOONVEIL_AUGUR_CONTRACT.silhouette,
  reviewPresentation: 'Show the exact labeled all-four-direction Moonveil Augur raw/no-outline, outlined Complete B, Complete B + Form, Hushmask/Mournglass/Harpy comparison board, and both synchronized full-suite GIFs together.',
  exclusions: [
    'approved Hushmask Prowler source module and pixels',
    'approved Mournglass Scrier pixels',
    'public Harpy Screecher pixels',
    'Owl elite',
    'Phoenix',
    'additional Bird variants',
    'new Cast pixels',
    'new Death pixels',
    'detached feather child assets',
    'baked moon-halo pixels',
    'baked omen-ring pixels',
    'baked rune pixels',
    'baked scrying-pane pixels',
    'baked shadow-wisp pixels',
    'baked loose-feather pixels',
    'baked dust pixels',
    'baked glow pixels',
    'baked projectile pixels',
    'baked air-blade pixels',
    'baked impact pixels',
    'registration',
    'consumer exposure',
    'fixtures',
    'effects',
    'release',
    'later EN-E11 work',
  ],
  nextGate: 'The exact Moonveil Augur implementation e3544a7c08195d67d7bfac4a4f531bc53c0a1981, approval record c384f07ace77822b12b1daa54b3fc6ca8ef11209, and initial published handoff 5dd51c5bdd386ecf4648cae3cc722fcd3ea8cc90 are pushed and remote verified; this reconciliation completes the bounded Owl specialist publication tuple. No continuation request accompanied the pixel approval, so no Owl elite, Phoenix, other Bird family, or other sprite lane is open. Public or outline registration, fixtures, effects, child assets, release, accepted drift, and a pull request remain closed. The distinct outlined PNG remains review evidence only and does not authorize outline registration.',
});

export const EN_E11_OWL_MOONVEIL_AUGUR_DATA = deepFreeze({
  actor: {
    species: 'owl',
    bodyBuild: 'compact-moon-mantled-facial-disk-owl',
    skin: 'feathered',
    hairStyle: 'swept-crescent-brow-plumes',
    hairColor: 'moon-silver',
    expression: 'moonward-watchful',
    faceDetail: 'cool-teal-eyes-and-small-steel-hooked-beak',
    headgear: 'connected-crescent-brow-plumes',
    outfit: 'connected-layered-shoulder-mantle',
    outfitColor: 'midnight-indigo',
    outfitTier: 'tier2',
    weapon: 'none',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: ['#30354f', '#171b2d'],
      hair: ['#c8cedd', '#7d879d'],
      outfit: ['#343852', '#1b1e30', '#59627d'],
    },
  },
  actorTopology: EN_E11_OWL_TOPOLOGY_DECISION.selected,
  childAssets: [],
  owl: {
    head: ['#30354f', '#171b2d', '#56628a'],
    body: ['#343852', '#1b1e30', '#59627d'],
    wing: ['#3e4666', '#22263a', '#69779c'],
    disk: ['#c8cedd', '#7d879d', '#eef2f7'],
    tail: ['#282d45', '#151827', '#505a76'],
    moon: ['#b5bfd1', '#68758c', '#e1e7f1'],
    sigil: ['#4e8f9a', '#2c5965', '#8fdde0'],
    beak: ['#9ea7b8', '#525a68', '#cbd2de'],
    talon: ['#858e9f', '#464d5b'],
    eye: '#8fe7e2',
    feature: '#111522',
  },
  effectBoundary: 'external-moon-halos-omen-rings-runes-scrying-panes-shadow-wisps-loose-feathers-dust-glow-projectiles-air-blades-and-impacts',
  bakedEffects: [],
});

const MOONVEIL_AUGUR_VARIANT = deepFreeze({
  id: 'moonveil-augur',
  name: 'Moonveil Augur',
  role: EN_E11_OWL_MOONVEIL_AUGUR_CONTRACT.role,
  status: EN_E11_OWL_MOONVEIL_AUGUR_CONTRACT.state,
  brief: 'Specialist grounded Owl preserving the approved compact facial-disk chassis beneath midnight-indigo plumage, connected crescent brow-plumes, a pearl-silver disk frame, layered shoulder mantle, moon-barred wings, cool-teal eyes and feather marks, two planted talons, and one connected short silver-banded fan tail.',
  rendererData: EN_E11_OWL_MOONVEIL_AUGUR_DATA,
});

const SOURCE_VARIANT = deepFreeze({ id: 'hushmask-prowler' });
export const EN_E11_OWL_MOONVEIL_AUGUR_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const MOTION_PHASES = deepFreeze({
  idle: [
    { name: 'moonward-disk-watch', upperBob: 0, wingPhase: 0, tailMode: 'closed', tailSway: 0, flash: false },
    { name: 'silver-throat-settle', upperBob: 1, wingPhase: 1, tailMode: 'closed', tailSway: 0, flash: false },
  ],
  walk: [
    { name: 'left-moonstep', upperBob: 0, wingPhase: 1, tailMode: 'closed', tailSway: -1, flash: false },
    { name: 'mantle-compress', upperBob: 1, wingPhase: 0, tailMode: 'closed', tailSway: 0, flash: false },
    { name: 'right-moonstep', upperBob: 0, wingPhase: 1, tailMode: 'closed', tailSway: 1, flash: false },
    { name: 'silver-fan-recover', upperBob: 0, wingPhase: 2, tailMode: 'closed', tailSway: 0, flash: false },
  ],
  attack: [
    { name: 'two-talon-augur-brace', upperBob: 1, wingPhase: 2, tailMode: 'braced', tailSway: -1, flash: false },
    { name: 'asymmetrical-moon-screen', upperBob: 0, wingPhase: 3, tailMode: 'spread', tailSway: 0, flash: false },
    { name: 'hooked-beak-mantle-press', upperBob: 0, wingPhase: 4, tailMode: 'spread', tailSway: 0, flash: false },
    { name: 'folded-augur-recover', upperBob: 1, wingPhase: 1, tailMode: 'braced', tailSway: 1, flash: false },
  ],
  hurt: [
    { name: 'white-moonveil-recoil', upperBob: 0, wingPhase: 2, tailMode: 'braced', tailSway: -1, flash: true },
    { name: 'planted-augur-recovery', upperBob: 1, wingPhase: 1, tailMode: 'closed', tailSway: 0, flash: false },
  ],
});

function buildPaletteMap() {
  const source = EN_E11_OWL_HUSHMASK_PROWLER_DATA.owl;
  const target = EN_E11_OWL_MOONVEIL_AUGUR_DATA.owl;
  const pairs = [
    [source.head, target.head],
    [source.body, target.body],
    [source.wing, target.wing],
    [source.throat, target.disk],
    [source.tail, target.tail],
    [source.bar, target.moon],
    [source.beak, target.beak],
    [source.talon, target.talon],
    [[source.eye], [target.eye]],
    [[source.feature], [target.feature]],
  ];
  const entries = [];
  for (const [from, to] of pairs) {
    assert(from.length === to.length, 'Moonveil Augur palette maps must preserve source ramp lengths.');
    for (let index = 0; index < from.length; index++) entries.push([from[index].toLowerCase(), to[index]]);
  }
  return new Map(entries);
}

const PALETTE_MAP = buildPaletteMap();

function createPaletteMappedContext(context) {
  let fillStyle = context.fillStyle;
  const map = (value) => typeof value === 'string' ? (PALETTE_MAP.get(value.toLowerCase()) || value) : value;
  return {
    get fillStyle() {
      return fillStyle;
    },
    set fillStyle(value) {
      fillStyle = map(value);
      context.fillStyle = fillStyle;
    },
    onOutOfBounds(write) {
      if (typeof context.onOutOfBounds === 'function') context.onOutOfBounds(write);
    },
    clearRect(x, y, width, height) {
      context.clearRect(x, y, width, height);
    },
    fillRect(x, y, width, height) {
      context.fillStyle = fillStyle;
      context.fillRect(x, y, width, height);
    },
  };
}

function createOverlayPainter(context, direction, flash) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Moonveil Augur regalia must use positive integer geometry.',
    );
    context.fillStyle = flash ? '#f4f4f4' : fill;
    context.fillRect(mirrored ? SIZE - x - width : x, y, width, height);
  };
  return { view, rect, dot: (x, y, fill) => rect(x, y, 1, 1, fill) };
}

function drawBrowDiskAndThroat(paint, phase) {
  const { moon, sigil, disk, head } = EN_E11_OWL_MOONVEIL_AUGUR_DATA.owl;
  const bob = phase.upperBob;
  if (paint.view === 'right') {
    paint.rect(11, 3 + bob, 4, 2, moon[1]);
    paint.rect(12, 2 + bob, 3, 1, moon[0]);
    paint.dot(12, 1 + bob, moon[2]);
    paint.rect(15, 4 + bob, 5, 1, moon[0]);
    paint.rect(16, 5 + bob, 4, 1, disk[2]);
    paint.dot(19, 6 + bob, sigil[2]);
    paint.rect(13, 10 + bob, 4, 1, moon[1]);
    paint.rect(14, 11 + bob, 2, 2, disk[0]);
    paint.dot(15, 12 + bob, sigil[2]);
    return;
  }
  paint.rect(7, 2 + bob, 3, 2, moon[1]);
  paint.dot(7, 1 + bob, moon[2]);
  paint.rect(14, 2 + bob, 3, 2, moon[1]);
  paint.dot(16, 1 + bob, moon[2]);
  paint.rect(9, 3 + bob, 6, 1, moon[0]);
  if (paint.view === 'up') {
    paint.rect(8, 5 + bob, 8, 1, head[2]);
    paint.rect(9, 7 + bob, 6, 1, moon[1]);
    paint.rect(10, 10 + bob, 4, 2, disk[1]);
    return;
  }
  paint.rect(7, 5 + bob, 2, 5, disk[1]);
  paint.rect(15, 5 + bob, 2, 5, disk[1]);
  paint.rect(9, 5 + bob, 6, 1, disk[2]);
  paint.dot(12, 4 + bob, sigil[2]);
  paint.rect(9, 11 + bob, 2, 1, moon[1]);
  paint.rect(13, 11 + bob, 2, 1, moon[1]);
  paint.rect(10, 12 + bob, 4, 1, disk[0]);
  paint.dot(12, 13 + bob, sigil[2]);
}

function drawShoulderMantle(paint, phase) {
  const { moon, sigil, wing } = EN_E11_OWL_MOONVEIL_AUGUR_DATA.owl;
  const bob = phase.upperBob;
  if (paint.view === 'right') {
    if (phase.wingPhase === 3) {
      paint.rect(6, 4 + bob, 5, 3, wing[2]);
      paint.rect(7, 3 + bob, 3, 1, moon[2]);
      paint.rect(7, 8 + bob, 5, 1, moon[0]);
      paint.dot(10, 9 + bob, sigil[2]);
      return;
    }
    if (phase.wingPhase === 4) {
      paint.rect(13, 9 + bob, 6, 2, wing[2]);
      paint.rect(14, 11 + bob, 5, 1, moon[0]);
      paint.rect(17, 12 + bob, 3, 1, moon[1]);
      paint.dot(18, 13 + bob, sigil[2]);
      return;
    }
    if (phase.wingPhase === 2) {
      paint.rect(7, 10 + bob, 5, 2, wing[2]);
      paint.rect(8, 12 + bob, 5, 1, moon[0]);
      paint.dot(11, 13 + bob, sigil[2]);
      return;
    }
    const lower = phase.wingPhase === 1 ? 1 : 0;
    paint.rect(7, 10 + bob + lower, 5, 2, wing[2]);
    paint.rect(8, 13 + bob + lower, 5, 1, moon[0]);
    paint.dot(11, 14 + bob + lower, sigil[2]);
    return;
  }
  if (phase.wingPhase === 3) {
    paint.rect(2, 4 + bob, 5, 3, wing[2]);
    paint.rect(3, 3 + bob, 3, 1, moon[2]);
    paint.rect(17, 6 + bob, 5, 2, wing[2]);
    paint.rect(3, 8 + bob, 5, 1, moon[0]);
    paint.rect(16, 9 + bob, 5, 1, moon[0]);
    paint.dot(7, 9 + bob, sigil[2]);
    paint.dot(16, 10 + bob, sigil[2]);
    return;
  }
  if (phase.wingPhase === 4) {
    paint.rect(1, 7 + bob, 6, 3, wing[2]);
    paint.rect(17, 9 + bob, 6, 2, wing[2]);
    paint.rect(4, 11 + bob, 5, 1, moon[0]);
    paint.rect(15, 11 + bob, 5, 1, moon[0]);
    paint.rect(6, 13 + bob, 3, 1, moon[1]);
    paint.rect(15, 13 + bob, 3, 1, moon[1]);
    paint.dot(8, 14 + bob, sigil[2]);
    paint.dot(15, 14 + bob, sigil[2]);
    return;
  }
  if (phase.wingPhase === 2) {
    paint.rect(4, 10 + bob, 5, 2, wing[2]);
    paint.rect(15, 10 + bob, 5, 2, wing[2]);
    paint.rect(5, 12 + bob, 4, 1, moon[0]);
    paint.rect(15, 12 + bob, 4, 1, moon[0]);
    paint.dot(7, 13 + bob, sigil[2]);
    paint.dot(16, 13 + bob, sigil[2]);
    return;
  }
  const lower = phase.wingPhase === 1 ? 1 : 0;
  paint.rect(5, 10 + bob + lower, 4, 2, wing[2]);
  paint.rect(15, 10 + bob + lower, 4, 2, wing[2]);
  paint.rect(6, 13 + bob + lower, 4, 1, moon[0]);
  paint.rect(14, 13 + bob + lower, 4, 1, moon[0]);
  paint.dot(8, 14 + bob + lower, sigil[2]);
  paint.dot(15, 14 + bob + lower, sigil[2]);
}

function drawTailBands(paint, phase) {
  const { moon, sigil } = EN_E11_OWL_MOONVEIL_AUGUR_DATA.owl;
  const sway = phase.tailSway;
  if (paint.view === 'right') {
    if (phase.tailMode === 'spread') {
      paint.rect(4, 18, 4, 1, moon[1]);
      paint.dot(7, 19, sigil[1]);
    } else if (phase.tailMode === 'braced') {
      paint.rect(5 + sway, 18, 4, 1, moon[1]);
      paint.dot(8 + sway, 19, sigil[1]);
    } else {
      paint.rect(6 + sway, 18, 4, 1, moon[1]);
      paint.dot(8 + sway, 19, sigil[1]);
    }
    return;
  }
  if (phase.tailMode === 'spread') {
    paint.rect(8, 18, 3, 1, moon[1]);
    paint.rect(13, 18, 3, 1, moon[1]);
    paint.dot(10, 19, sigil[1]);
    paint.dot(13, 19, sigil[1]);
  } else if (phase.tailMode === 'braced') {
    paint.rect(9 + sway, 18, 3, 1, moon[1]);
    paint.rect(13 + sway, 18, 2, 1, moon[1]);
    paint.dot(12 + sway, 19, sigil[1]);
  } else {
    paint.rect(10 + sway, 18, 4, 1, moon[1]);
    paint.dot(12 + sway, 19, sigil[1]);
  }
}

function drawMoonveilRegalia(context, direction, phase) {
  const paint = createOverlayPainter(context, direction, phase.flash);
  drawBrowDiskAndThroat(paint, phase);
  drawShoulderMantle(paint, phase);
  drawTailBands(paint, phase);
}

function resolveSource(animation, frame) {
  if (animation === 'cast') return { animation: 'attack', frame };
  if (animation === 'death') return { animation: 'hurt', frame: EN_E11_OWL_MOONVEIL_AUGUR_DEATH_SOURCE_FRAMES[frame] };
  return { animation, frame };
}

function renderMoonveilAugur(args) {
  assert(args.family.id === 'owl', 'The EN-E11 Moonveil Augur renderer is restricted to Owl.');
  assert(args.variant.id === 'moonveil-augur', 'The EN-E11 Owl specialist renderer is restricted to Moonveil Augur.');
  const frameCounts = { idle: 2, walk: 4, attack: 4, cast: 4, hurt: 2, death: 4 };
  const frameCount = frameCounts[args.animation.id];
  assert(frameCount !== undefined, 'The Moonveil Augur gate authorizes only Idle, Walk, Attack, Cast, Hurt, and Death.');
  assert(
    Number.isInteger(args.frame) && args.frame >= 0 && args.frame < frameCount,
    'The Moonveil Augur frame is outside the authorized animation contract.',
  );

  const source = resolveSource(args.animation.id, args.frame);
  const phase = MOTION_PHASES[source.animation][source.frame];
  const sourceResult = EN_E11_OWL_HUSHMASK_PROWLER_RENDERER.render({
    ...args,
    variant: SOURCE_VARIANT,
    animation: { ...args.animation, id: source.animation },
    frame: source.frame,
    context: createPaletteMappedContext(args.context),
  });
  drawMoonveilRegalia(args.context, args.direction, phase);

  return Object.freeze({
    family: args.family.id,
    variant: args.variant.id,
    direction: args.direction,
    animation: args.animation.id,
    frame: args.frame,
    renderedAnimation: source.animation,
    renderedFrame: source.frame,
    owlMoonveilAugurGate: EN_E11_OWL_MOONVEIL_AUGUR_GATE.id,
    architectureDecision: EN_E11_OWL_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E11_OWL_HUSHMASK_PROWLER_GATE.id,
    approvedSourceMotion: sourceResult.motion,
    role: EN_E11_OWL_MOONVEIL_AUGUR_CONTRACT.role,
    anatomy: EN_E11_OWL_MOONVEIL_AUGUR_CONTRACT.chassis,
    upperBody: 'approved-round-owl-head-hooked-beak-facial-disk-and-folded-wings-with-connected-crescent-brow-plumes-silver-disk-frame-layered-mantle-and-moon-bars',
    lowerBody: 'approved-compact-feathered-barrel-two-grounded-three-toed-talons-and-connected-short-silver-banded-fan-tail',
    motion: args.animation.id === 'cast'
      ? 'exact-cast-alias-of-moonveil-augur-moon-screen-and-beak-press'
      : args.animation.id === 'death'
        ? 'exact-death-alias-of-moonveil-augur-recoil'
        : phase.name,
    childAssetCount: EN_E11_OWL_MOONVEIL_AUGUR_DATA.childAssets.length,
    effectBoundary: EN_E11_OWL_MOONVEIL_AUGUR_DATA.effectBoundary,
  });
}

export const EN_E11_OWL_MOONVEIL_AUGUR_RENDERER = Object.freeze({
  key: 'en-e11-owl-moonveil-augur-full-v1',
  chassis: EN_E11_OWL_MOONVEIL_AUGUR_CONTRACT.chassis,
  render: renderMoonveilAugur,
});

export const EN_E11_OWL_MOONVEIL_AUGUR_FAMILY = deepFreeze({
  id: 'owl',
  name: 'Owl',
  sliceId: 'EN-E11',
  rendererKey: EN_E11_OWL_MOONVEIL_AUGUR_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [MOONVEIL_AUGUR_VARIANT],
  rendererData: {
    approvedPrecedingGate: EN_E11_OWL_HUSHMASK_PROWLER_GATE.id,
    activeGate: EN_E11_OWL_MOONVEIL_AUGUR_GATE.id,
    topologyDecision: EN_E11_OWL_TOPOLOGY_DECISION.id,
  },
  review: {
    baselineVariant: 'moonveil-augur',
    scale: 6,
    notes: 'Published and reconciled private Moonveil Augur specialist Owl only, bound to exact implementation e3544a7c08195d67d7bfac4a4f531bc53c0a1981, approval record c384f07ace77822b12b1daa54b3fc6ca8ef11209, initial published handoff 5dd51c5bdd386ecf4648cae3cc722fcd3ea8cc90, candidate digest 86dbba1f850c9411f8d25949f4284874eb594711f4aa8c2c09f75172b2a2addd, and its six frozen review hashes. No continuation request was supplied, so the next gate stays closed. Keep public or outline registration, fixtures, effects, child assets, Owl elite, Phoenix, release, accepted drift, and a pull request separate.',
  },
});

export const EN_E11_OWL_MOONVEIL_AUGUR_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E11_OWL_MOONVEIL_AUGUR_RENDERER],
  families: [EN_E11_OWL_MOONVEIL_AUGUR_FAMILY],
});
