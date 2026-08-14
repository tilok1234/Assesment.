import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_GATE } from './enemy-expansion-en-e11-peacock-mirrorfan-ambusher.js';
import {
  EN_E11_RAVEN_CINDERQUILL_SCAVENGER_CONTRACT,
  EN_E11_RAVEN_CINDERQUILL_SCAVENGER_DATA,
  EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE,
  EN_E11_RAVEN_CINDERQUILL_SCAVENGER_RENDERER,
  EN_E11_RAVEN_TOPOLOGY_DECISION,
} from './enemy-expansion-en-e11-raven-cinderquill-scavenger.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E11_RAVEN_MOURNGLASS_SCRIER_CONTRACT = deepFreeze({
  family: 'raven',
  variant: 'mournglass-scrier',
  role: 'specialist',
  state: 'implemented-complete-motion-approved',
  chassis: EN_E11_RAVEN_TOPOLOGY_DECISION.selected,
  silhouette: 'The approved compact grounded Cinderquill Scavenger corvid remains complete beneath a connected swept two-point brow crest, moon-glass face band, pale throat clasp, folded-wing quill bars, and tail notches. The rounded head, hooked beak, short throat, deep body, two body-owned wings, two separated taloned feet, and connected wedge tail remain readable in every direction. No regalia pixel floats, no human anatomy is exposed, and no effect substitutes for the Raven body.',
  identity: 'Violet-black head and body plumage, indigo-slate wings, a pale mourning throat, silver moon-glass brow and quill bars, cool teal omen marks and eyes, a steel beak, dark steel talons, and a connected swept crest distinguish the Mournglass Scrier specialist from common Cinderquill Scavenger.',
  effectBoundary: 'Omen rings, scrying panes, shadow wisps, loose feathers, dust, glow, projectiles, air blades, and impact effects remain external.',
});

export const EN_E11_RAVEN_SPECIALIST_CONTRACT_CARD = deepFreeze({
  family: 'raven',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingVariant: {
    id: EN_E11_RAVEN_CINDERQUILL_SCAVENGER_CONTRACT.variant,
    role: EN_E11_RAVEN_CINDERQUILL_SCAVENGER_CONTRACT.role,
    status: 'implemented-full-approved-published-reconciled-integrated',
  },
  activeVariant: {
    id: EN_E11_RAVEN_MOURNGLASS_SCRIER_CONTRACT.variant,
    role: EN_E11_RAVEN_MOURNGLASS_SCRIER_CONTRACT.role,
    status: 'implemented-full-approved',
  },
  deferredRoles: ['elite'],
});

export const EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE = deepFreeze({
  id: 'en-e11-raven-mournglass-scrier-full-v1',
  status: 'approved',
  authorizedOn: '2026-08-14',
  authorizationEvidence: 'The exact Cinderquill Scavenger implementation 0e1124d6e16f3c5e568b0fe38890eb270b41306d, approval record 368754e9c037d7f37793ac737e162a3c5a4572f7, initial published handoff 0e455f9665400003fbb55c4a59260016c80f40cd, and final reconciliation a56211531caaa55be96979af2f53aafaa08c1067 are pushed and remote verified. The audited approved suites and current Windows launcher are integrated on clean pushed V3 checkpoint e7cedbc569ac0ad5c405efbf9b888e167cb8f671. The designer then said: awesome lets keep going. Under the documented Raven common, specialist, elite role order and selected baked-single-actor-grounded-folded-wing-corvid topology, this fresh continuation authorizes exactly one private specialist Raven full 80-frame candidate. Because the role was not pre-named, this lane names only Mournglass Scrier. It does not approve candidate pixels or authorize a commit, push, public or outline registration, fixtures, effects, child assets, Raven elite, Owl, Phoenix, release, accepted drift, or a pull request.',
  baseCheckpoint: 'e7cedbc569ac0ad5c405efbf9b888e167cb8f671',
  architectureDecision: EN_E11_RAVEN_TOPOLOGY_DECISION.id,
  approvedOn: '2026-08-14',
  approvalEvidence: 'The exact labeled all-four-direction raw/no-outline, distinct Complete B outlined, Complete B + Form, and Cinderquill Scavenger, Mirrorfan Ambusher, and Harpy Screecher comparison PNGs were frozen with both synchronized GIF hashes. All four exact PNG paths, all eight raw and Complete B + Form phase sheets, and the transparent 20x4 inspection atlas were loaded and inspected at original resolution. The final approval prompt posted all four exact PNGs, both synchronized GIFs, and candidate digest 59b3b963b18edf1385fcc13252ec702cfa7d87c48ec8aaf8e34039becbfc8f1a. The designer replied: approved. Approval applies only to that exact Mournglass Scrier digest and its six frozen review hashes. It does not open public or outline registration, fixtures, effects, child assets, Raven elite, Owl, Phoenix, release, accepted drift, or a pull request.',
  approvedImplementation: 'ca79bdeced0161f720775e405416d98cd809314f',
  publicationAuthorizedOn: '2026-08-14',
  publicationAuthorizationEvidence: 'The designer previously said: you have my pertmission to commit and push everything i approve. This standing permission authorizes bounded implementation, approval-record, and reconciliation commits plus branch pushes only after explicit approval of the exact frozen artifact or digest. The designer now replied approved to the exact Mournglass Scrier review packet. This does not authorize registration, fixtures, effects, child assets, Raven elite, later families, release, accepted drift, or a pull request.',
  publishedImplementation: '',
  publishedApprovalRecord: '',
  initialPublishedHandoff: '',
  publicationState: 'approved-not-published',
  precedingApproval: {
    gateId: EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE.id,
    candidateFrameDigest: EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE.initialPublishedHandoff,
    currentReconciliation: 'a56211531caaa55be96979af2f53aafaa08c1067',
    integrationCheckpoint: 'e7cedbc569ac0ad5c405efbf9b888e167cb8f671',
  },
  artifact: 'enemy-expansion-review/en-e11-raven-mournglass-scrier/en-e11-raven-mournglass-scrier-full-suite-raw.png',
  artifactSha256: '49bbf1f8e1345ab2b36e819e6ad399bb4a8d367824127a5c6bc31d730eb95ebe',
  outlinedArtifact: 'enemy-expansion-review/en-e11-raven-mournglass-scrier/en-e11-raven-mournglass-scrier-full-suite-outlined-complete-b.png',
  outlinedArtifactSha256: 'a07638992a87b024611de68f1871d5076f71b96c1f0b5834f53b32131a5b411a',
  assembledArtifact: 'enemy-expansion-review/en-e11-raven-mournglass-scrier/en-e11-raven-mournglass-scrier-full-suite-complete-b-form.png',
  assembledArtifactSha256: '1779a1cf763ff0211850f56cf78116f6a8ee9d546f12811000828d1ca10813b1',
  comparisonArtifact: 'enemy-expansion-review/en-e11-raven-mournglass-scrier/en-e11-raven-mournglass-scrier-family-comparison.png',
  comparisonArtifactSha256: '0f9b718508723b69d094aa4c6b742d8dcd558eeba19064065c90369c86df62a1',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e11-raven-mournglass-scrier/en-e11-raven-mournglass-scrier-full-suite-four-directions-labeled.gif',
      sha256: 'a5126e97c75c3b4e37cf9a135da44f75c112979616311017d0df601349b557c7',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e11-raven-mournglass-scrier/en-e11-raven-mournglass-scrier-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '60ae2796847d11995a80a438595e3fada5664b9dde3ddb410484a3677682e0fe',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
  },
  candidateFrameDigest: '59b3b963b18edf1385fcc13252ec702cfa7d87c48ec8aaf8e34039becbfc8f1a',
  cinderquillComparisonDigest: EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE.candidateFrameDigest,
  mirrorfanComparisonDigest: EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_GATE.candidateFrameDigest,
  harpyComparisonDigest: 'd7d83f0c209a8b4735e0a488a5df128bffa5407e38fd28e4fc38d73b633e5839',
  scope: 'One complete private 80-frame Raven Mournglass Scrier specialist enemy across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Every frame preserves the approved grounded Cinderquill anatomy and full-body motion beneath connected specialist regalia. Idle holds a still omen watch and settles the pale throat clasp. Walk alternates two grounded hop-steps while the swept crest, folded-wing quill bars, and connected wedge tail counterbalance. Attack braces on both talons, lifts the body-owned wings into a tall scrying vane, drives a precise hooked-beak wing rake, and refolds. Hurt uses a complete-silhouette #f4f4f4 recoil and colored grounded recovery. Cast aliases Attack exactly and Death aliases Hurt H1,H2,H2,H2.',
  anatomyContract: EN_E11_RAVEN_MOURNGLASS_SCRIER_CONTRACT.silhouette,
  reviewPresentation: 'Show the exact labeled all-four-direction Mournglass Scrier raw/no-outline, outlined Complete B, Complete B + Form, Cinderquill/Mirrorfan/Harpy comparison board, and both synchronized full-suite GIFs together.',
  exclusions: [
    'approved Cinderquill Scavenger source module and pixels',
    'approved Mirrorfan Ambusher pixels',
    'public Harpy Screecher pixels',
    'approved backlog V3 registration changes',
    'Raven elite',
    'Owl',
    'Phoenix',
    'additional Bird variants',
    'new Cast pixels',
    'new Death pixels',
    'detached feather child assets',
    'baked omen-ring pixels',
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
  nextGate: 'The exact Mournglass Scrier implementation ca79bdeced0161f720775e405416d98cd809314f is pushed and remote verified. Commit and push only this approval record, then create the initial published handoff and final reconciliation needed to complete the bounded publication tuple. No continuation request accompanied the pixel approval, so no Raven elite, other Bird family, or other sprite lane is open. Public or outline registration, fixtures, effects, child assets, Owl, Phoenix, release, accepted drift, and a pull request remain closed. The distinct outlined PNG remains review evidence only and does not authorize outline registration.',
});

export const EN_E11_RAVEN_MOURNGLASS_SCRIER_DATA = deepFreeze({
  actor: {
    species: 'corvid',
    bodyBuild: 'lean-omen-reader-corvid',
    skin: 'feathered',
    hairStyle: 'swept-brow-crest',
    hairColor: 'moon-glass',
    expression: 'watchful',
    faceDetail: 'hooked-steel-beak',
    headgear: 'connected-brow-band',
    outfit: 'connected-quill-bars',
    outfitColor: 'indigo',
    outfitTier: 'tier2',
    weapon: 'none',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: ['#34304a', '#1b182a'],
      hair: ['#a9b1c5', '#60677c'],
      outfit: ['#2b273d', '#171523', '#454a72'],
    },
  },
  actorTopology: EN_E11_RAVEN_TOPOLOGY_DECISION.selected,
  childAssets: [],
  raven: {
    head: ['#34304a', '#1b182a', '#6c668c'],
    body: ['#2b273d', '#171523', '#514b69'],
    wing: ['#454a72', '#252941', '#747fa8'],
    throat: ['#aaa9bf', '#66687b', '#d3d4e4'],
    tail: ['#211f34', '#12111e', '#49465f'],
    glass: ['#a9b1c5', '#60677c', '#d7dff0'],
    omen: ['#3e8d92', '#28575f', '#79d7d6'],
    beak: ['#9399a6', '#4c505a', '#c5ccd7'],
    talon: ['#74798a', '#3e414d'],
    eye: '#9aeaf0',
    feature: '#14131d',
  },
  effectBoundary: 'external-omen-rings-scrying-panes-shadow-wisps-loose-feathers-dust-glow-projectiles-air-blades-and-impacts',
  bakedEffects: [],
});

const MOURNGLASS_SCRIER_VARIANT = deepFreeze({
  id: 'mournglass-scrier',
  name: 'Mournglass Scrier',
  role: EN_E11_RAVEN_MOURNGLASS_SCRIER_CONTRACT.role,
  status: EN_E11_RAVEN_MOURNGLASS_SCRIER_CONTRACT.state,
  brief: 'Specialist grounded Raven omen reader preserving the approved compact corvid beneath violet-black plumage, an attached moon-glass brow crest and throat clasp, indigo wings, silver quill bars, cool-teal eyes and marks, two planted talons, and one connected notched wedge tail.',
  rendererData: EN_E11_RAVEN_MOURNGLASS_SCRIER_DATA,
});

const SOURCE_VARIANT = deepFreeze({ id: 'cinderquill-scavenger' });
export const EN_E11_RAVEN_MOURNGLASS_SCRIER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const MOTION_PHASES = deepFreeze({
  idle: [
    { name: 'still-omen-watch', upperBob: 0, wingPhase: 0, tailMode: 'closed', tailSway: 0, flash: false },
    { name: 'mournglass-throat-settle', upperBob: 1, wingPhase: 1, tailMode: 'closed', tailSway: 0, flash: false },
  ],
  walk: [
    { name: 'left-scrier-hop', upperBob: 0, wingPhase: 1, tailMode: 'closed', tailSway: -1, flash: false },
    { name: 'quill-bar-compress', upperBob: 1, wingPhase: 0, tailMode: 'closed', tailSway: 0, flash: false },
    { name: 'right-scrier-hop', upperBob: 0, wingPhase: 1, tailMode: 'closed', tailSway: 1, flash: false },
    { name: 'notched-tail-recover', upperBob: 0, wingPhase: 2, tailMode: 'closed', tailSway: 0, flash: false },
  ],
  attack: [
    { name: 'two-talon-omen-brace', upperBob: 1, wingPhase: 2, tailMode: 'braced', tailSway: -1, flash: false },
    { name: 'tall-scrying-vane', upperBob: 0, wingPhase: 3, tailMode: 'spread', tailSway: 0, flash: false },
    { name: 'mournglass-beak-rake', upperBob: 0, wingPhase: 4, tailMode: 'spread', tailSway: 0, flash: false },
    { name: 'folded-scrier-recover', upperBob: 1, wingPhase: 1, tailMode: 'braced', tailSway: 1, flash: false },
  ],
  hurt: [
    { name: 'white-mournglass-recoil', upperBob: 0, wingPhase: 2, tailMode: 'braced', tailSway: -1, flash: true },
    { name: 'planted-scrier-recovery', upperBob: 1, wingPhase: 1, tailMode: 'closed', tailSway: 0, flash: false },
  ],
});

function buildPaletteMap() {
  const source = EN_E11_RAVEN_CINDERQUILL_SCAVENGER_DATA.raven;
  const target = EN_E11_RAVEN_MOURNGLASS_SCRIER_DATA.raven;
  const pairs = [
    [source.head, target.head],
    [source.body, target.body],
    [source.wing, target.wing],
    [source.throat, target.throat],
    [source.tail, target.tail],
    [source.cinder, target.glass],
    [source.beak, target.beak],
    [source.talon, target.talon],
    [[source.eye], [target.eye]],
    [[source.feature], [target.feature]],
  ];
  const entries = [];
  for (const [from, to] of pairs) {
    assert(from.length === to.length, 'Mournglass Scrier palette maps must preserve source ramp lengths.');
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
      'Mournglass Scrier regalia must use positive integer geometry.',
    );
    context.fillStyle = flash ? '#f4f4f4' : fill;
    context.fillRect(mirrored ? SIZE - x - width : x, y, width, height);
  };
  return { view, rect, dot: (x, y, fill) => rect(x, y, 1, 1, fill) };
}

function drawHeadAndThroatMarks(paint, phase) {
  const { glass, omen } = EN_E11_RAVEN_MOURNGLASS_SCRIER_DATA.raven;
  const bob = phase.upperBob;
  if (paint.view === 'right') {
    paint.rect(12, 4 + bob, 3, 2, glass[1]);
    paint.rect(11, 3 + bob, 2, 2, glass[0]);
    paint.dot(10, 3 + bob, glass[2]);
    paint.rect(16, 5 + bob, 4, 1, glass[0]);
    paint.dot(19, 6 + bob, omen[2]);
    paint.rect(13, 10 + bob, 3, 1, glass[1]);
    paint.rect(14, 11 + bob, 2, 2, glass[0]);
    paint.dot(15, 12 + bob, omen[2]);
    return;
  }
  paint.rect(8, 4 + bob, 2, 2, glass[1]);
  paint.dot(8, 3 + bob, glass[2]);
  paint.rect(14, 4 + bob, 2, 2, glass[1]);
  paint.dot(15, 3 + bob, glass[2]);
  paint.rect(10, 5 + bob, 4, 1, glass[0]);
  paint.dot(12, 4 + bob, omen[2]);
  paint.rect(9, 11 + bob, 2, 1, glass[1]);
  paint.rect(13, 11 + bob, 2, 1, glass[1]);
  paint.rect(10, 12 + bob, 4, 1, glass[0]);
  paint.dot(12, 13 + bob, omen[2]);
}

function drawWingMarks(paint, phase) {
  const { glass, omen, wing } = EN_E11_RAVEN_MOURNGLASS_SCRIER_DATA.raven;
  const bob = phase.upperBob;
  if (paint.view === 'right') {
    if (phase.wingPhase === 3) {
      paint.rect(7, 4 + bob, 2, 3, wing[2]);
      paint.dot(7, 3 + bob, glass[2]);
      paint.rect(8, 8 + bob, 3, 1, glass[0]);
      paint.dot(10, 9 + bob, omen[2]);
      return;
    }
    if (phase.wingPhase === 4) {
      paint.rect(14, 10 + bob, 4, 1, glass[0]);
      paint.rect(17, 11 + bob, 3, 1, glass[1]);
      paint.dot(18, 12 + bob, omen[2]);
      return;
    }
    if (phase.wingPhase === 2) {
      paint.rect(8, 12 + bob, 4, 1, glass[0]);
      paint.rect(10, 13 + bob, 3, 1, glass[1]);
      paint.dot(9, 13 + bob, omen[2]);
      return;
    }
    const lower = phase.wingPhase === 1 ? 1 : 0;
    paint.rect(9, 13 + bob + lower, 4, 1, glass[0]);
    paint.rect(11, 14 + bob + lower, 3, 1, glass[1]);
    paint.dot(10, 14 + bob + lower, omen[2]);
    return;
  }
  if (phase.wingPhase === 3) {
    paint.rect(3, 5 + bob, 2, 3, wing[2]);
    paint.dot(3, 4 + bob, glass[2]);
    paint.rect(19, 5 + bob, 2, 3, wing[2]);
    paint.dot(20, 4 + bob, glass[2]);
    paint.rect(4, 9 + bob, 4, 1, glass[0]);
    paint.rect(16, 9 + bob, 4, 1, glass[0]);
    paint.dot(7, 10 + bob, omen[2]);
    paint.dot(16, 10 + bob, omen[2]);
    return;
  }
  if (phase.wingPhase === 4) {
    paint.rect(4, 11 + bob, 4, 1, glass[0]);
    paint.rect(16, 11 + bob, 4, 1, glass[0]);
    paint.rect(6, 13 + bob, 3, 1, glass[1]);
    paint.rect(15, 13 + bob, 3, 1, glass[1]);
    paint.dot(8, 14 + bob, omen[2]);
    paint.dot(15, 14 + bob, omen[2]);
    return;
  }
  if (phase.wingPhase === 2) {
    paint.rect(5, 12 + bob, 4, 1, glass[0]);
    paint.rect(15, 12 + bob, 4, 1, glass[0]);
    paint.dot(7, 13 + bob, omen[2]);
    paint.dot(16, 13 + bob, omen[2]);
    return;
  }
  const lower = phase.wingPhase === 1 ? 1 : 0;
  paint.rect(6, 13 + bob + lower, 4, 1, glass[0]);
  paint.rect(14, 13 + bob + lower, 4, 1, glass[0]);
  paint.dot(8, 14 + bob + lower, omen[2]);
  paint.dot(15, 14 + bob + lower, omen[2]);
}

function drawTailMarks(paint, phase) {
  const { glass, omen } = EN_E11_RAVEN_MOURNGLASS_SCRIER_DATA.raven;
  const sway = phase.tailSway;
  if (paint.view === 'right') {
    if (phase.tailMode === 'spread') {
      paint.rect(4, 18, 4, 1, glass[1]);
      paint.dot(7, 19, omen[1]);
    } else if (phase.tailMode === 'braced') {
      paint.rect(5 + sway, 18, 4, 1, glass[1]);
      paint.dot(8 + sway, 19, omen[1]);
    } else {
      paint.rect(5 + sway, 18, 3, 1, glass[1]);
      paint.dot(7 + sway, 19, omen[1]);
    }
    return;
  }
  if (phase.tailMode === 'spread') {
    paint.rect(8, 18, 3, 1, glass[1]);
    paint.rect(13, 18, 3, 1, glass[1]);
    paint.dot(10, 19, omen[1]);
    paint.dot(13, 19, omen[1]);
  } else if (phase.tailMode === 'braced') {
    paint.rect(9 + sway, 18, 3, 1, glass[1]);
    paint.rect(13 + sway, 18, 2, 1, glass[1]);
    paint.dot(12 + sway, 19, omen[1]);
  } else {
    paint.rect(10 + sway, 18, 4, 1, glass[1]);
    paint.dot(12 + sway, 19, omen[1]);
  }
}

function drawMournglassRegalia(context, direction, phase) {
  const paint = createOverlayPainter(context, direction, phase.flash);
  drawHeadAndThroatMarks(paint, phase);
  drawWingMarks(paint, phase);
  drawTailMarks(paint, phase);
}

function resolveSource(animation, frame) {
  if (animation === 'cast') return { animation: 'attack', frame };
  if (animation === 'death') return { animation: 'hurt', frame: EN_E11_RAVEN_MOURNGLASS_SCRIER_DEATH_SOURCE_FRAMES[frame] };
  return { animation, frame };
}

function renderMournglassScrier(args) {
  assert(args.family.id === 'raven', 'The EN-E11 Mournglass Scrier renderer is restricted to Raven.');
  assert(args.variant.id === 'mournglass-scrier', 'The EN-E11 Raven specialist renderer is restricted to Mournglass Scrier.');
  const frameCounts = { idle: 2, walk: 4, attack: 4, cast: 4, hurt: 2, death: 4 };
  const frameCount = frameCounts[args.animation.id];
  assert(frameCount !== undefined, 'The Mournglass Scrier gate authorizes only Idle, Walk, Attack, Cast, Hurt, and Death.');
  assert(
    Number.isInteger(args.frame) && args.frame >= 0 && args.frame < frameCount,
    'The Mournglass Scrier frame is outside the authorized animation contract.',
  );

  const source = resolveSource(args.animation.id, args.frame);
  const phase = MOTION_PHASES[source.animation][source.frame];
  const sourceResult = EN_E11_RAVEN_CINDERQUILL_SCAVENGER_RENDERER.render({
    ...args,
    variant: SOURCE_VARIANT,
    animation: { ...args.animation, id: source.animation },
    frame: source.frame,
    context: createPaletteMappedContext(args.context),
  });
  drawMournglassRegalia(args.context, args.direction, phase);

  return Object.freeze({
    family: args.family.id,
    variant: args.variant.id,
    direction: args.direction,
    animation: args.animation.id,
    frame: args.frame,
    renderedAnimation: source.animation,
    renderedFrame: source.frame,
    ravenMournglassScrierGate: EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.id,
    architectureDecision: EN_E11_RAVEN_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE.id,
    approvedSourceMotion: sourceResult.motion,
    role: EN_E11_RAVEN_MOURNGLASS_SCRIER_CONTRACT.role,
    anatomy: EN_E11_RAVEN_MOURNGLASS_SCRIER_CONTRACT.chassis,
    upperBody: 'approved-rounded-corvid-head-hooked-beak-and-folded-wings-with-connected-mournglass-crest-brow-throat-clasp-and-quill-bars',
    lowerBody: 'approved-two-grounded-three-toed-talons-and-connected-notched-wedge-tail',
    motion: args.animation.id === 'cast'
      ? 'exact-cast-alias-of-mournglass-scrier-scrying-vane-and-beak-rake'
      : args.animation.id === 'death'
        ? 'exact-death-alias-of-mournglass-scrier-recoil'
        : phase.name,
    childAssetCount: EN_E11_RAVEN_MOURNGLASS_SCRIER_DATA.childAssets.length,
    effectBoundary: EN_E11_RAVEN_MOURNGLASS_SCRIER_DATA.effectBoundary,
  });
}

export const EN_E11_RAVEN_MOURNGLASS_SCRIER_RENDERER = Object.freeze({
  key: 'en-e11-raven-mournglass-scrier-full-v1',
  chassis: EN_E11_RAVEN_MOURNGLASS_SCRIER_CONTRACT.chassis,
  render: renderMournglassScrier,
});

export const EN_E11_RAVEN_MOURNGLASS_SCRIER_FAMILY = deepFreeze({
  id: 'raven',
  name: 'Raven',
  sliceId: 'EN-E11',
  rendererKey: EN_E11_RAVEN_MOURNGLASS_SCRIER_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [MOURNGLASS_SCRIER_VARIANT],
  rendererData: {
    approvedPrecedingGate: EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE.id,
    activeGate: EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE.id,
    topologyDecision: EN_E11_RAVEN_TOPOLOGY_DECISION.id,
  },
  review: {
    baselineVariant: 'mournglass-scrier',
    scale: 6,
    notes: 'Approved private Mournglass Scrier specialist Raven only, bound to exact implementation ca79bdeced0161f720775e405416d98cd809314f, candidate digest 59b3b963b18edf1385fcc13252ec702cfa7d87c48ec8aaf8e34039becbfc8f1a, and its six frozen review hashes. The designer replied approved to the posted exact packet; no continuation request was supplied. Keep public or outline registration, fixtures, effects, child assets, Raven elite, Owl, Phoenix, release, accepted drift, and a pull request separate.',
  },
});

export const EN_E11_RAVEN_MOURNGLASS_SCRIER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E11_RAVEN_MOURNGLASS_SCRIER_RENDERER],
  families: [EN_E11_RAVEN_MOURNGLASS_SCRIER_FAMILY],
});
