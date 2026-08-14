import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E11_OWL_ECLIPSECROWN_NOCTARCH_GATE } from './enemy-expansion-en-e11-owl-eclipsecrown-noctarch.js';
import {
  EN_E11_RAVEN_CINDERQUILL_SCAVENGER_DATA,
  EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE,
  EN_E11_RAVEN_CINDERQUILL_SCAVENGER_RENDERER,
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

export const EN_E11_PHOENIX_TOPOLOGY_DECISION = deepFreeze({
  id: 'en-e11-phoenix-topology-v1',
  status: 'approved',
  approvedOn: '2026-08-14',
  selected: 'baked-single-actor-grounded-flame-crested-phoenix',
  authorizationEvidence: 'The exact Eclipsecrown Noctarch implementation c7c95df2bfd3fb2d4cf421ddc413965b9b0c51f2, approval record 402d94575701ecffd16a23a156bf39eae44298f0, initial published handoff 5dc6b790e5320e55625a5d601fb4752684a87883, and final reconciliation 43452d7a03a92cee228a1d1ffaf147fc39802ad5 are pushed and remote verified. The designer supplied a fresh continuation request: Let\'s do next. The topology recommendation was then presented as baked-single-actor-grounded-flame-crested-phoenix, and the designer replied: Approved. This approves only that Phoenix topology and opens one private common Phoenix candidate named Ashcrest Kindler. It does not approve candidate pixels or authorize a commit, push, registration, fixtures, effects, child assets, resurrection art, flight states, specialist or elite Phoenix work, another family, release, accepted drift, or a pull request.',
  alternatives: [
    {
      id: 'baked-single-actor-grounded-flame-crested-phoenix',
      status: 'selected',
      summary: 'One connected grounded actor with a feather-built flame crest, body-owned wings, two taloned feet, and a connected ember tail.',
    },
    {
      id: 'baked-single-actor-hovering-flame-wing-phoenix',
      status: 'rejected-for-common',
      summary: 'A hovering silhouette would require a separate flight-state contract and weaken grounded comparison continuity.',
    },
    {
      id: 'parent-with-detached-flame-tail-children',
      status: 'rejected',
      summary: 'Detached flame pieces would cross the child-asset and effect boundary.',
    },
  ],
  childAssets: [],
  effectBoundary: 'Fire, embers, glow, halos, projectiles, loose feathers, ash, egg or resurrection art, flight states, dust, shock rings, and impacts remain external.',
  rationale: 'The common Phoenix should read first as one compact bird combatant. Keeping the crest, wings, talons, and tail connected preserves the 24x24 actor contract and leaves fire spectacle to later effect or state decisions.',
});

export const EN_E11_PHOENIX_ASHCREST_KINDLER_CONTRACT = deepFreeze({
  family: 'phoenix',
  variant: 'ashcrest-kindler',
  role: 'common',
  state: 'candidate-awaiting-visual-approval',
  chassis: EN_E11_PHOENIX_TOPOLOGY_DECISION.selected,
  silhouette: 'A compact grounded Phoenix with a connected flame-shaped feather crest, hooked bird beak, heated breast, two body-owned folded wings, two separated three-toed taloned feet, and one connected layered ember tail. Attack opens both body-owned wings into a broad solar fan while the actor remains a single grounded silhouette.',
  identity: 'Ash-charcoal and ember-russet plumage, a heated-gold breast, connected orange-gold flame crest, copper-red body-owned wings, pale-gold eyes, brass beak and talons, and a layered ember tail distinguish Ashcrest Kindler from the approved Cinderquill Raven, approved Eclipsecrown Owl, and public Harpy.',
  effectBoundary: EN_E11_PHOENIX_TOPOLOGY_DECISION.effectBoundary,
});

export const EN_E11_PHOENIX_COMMON_CONTRACT_CARD = deepFreeze({
  family: 'phoenix',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingGate: EN_E11_OWL_ECLIPSECROWN_NOCTARCH_GATE.id,
  activeVariant: {
    id: EN_E11_PHOENIX_ASHCREST_KINDLER_CONTRACT.variant,
    role: EN_E11_PHOENIX_ASHCREST_KINDLER_CONTRACT.role,
    status: 'candidate-awaiting-visual-approval',
  },
  deferredRoles: ['specialist', 'elite'],
});

export const EN_E11_PHOENIX_ASHCREST_KINDLER_GATE = deepFreeze({
  id: 'en-e11-phoenix-ashcrest-kindler-full-v1',
  status: 'candidate',
  authorizedOn: '2026-08-14',
  authorizationEvidence: 'The exact Eclipsecrown Noctarch publication tuple is pushed and remote verified at final reconciliation 43452d7a03a92cee228a1d1ffaf147fc39802ad5. A fresh Let\'s do next request opened only the Phoenix topology decision. The designer then replied Approved to the recommended baked-single-actor-grounded-flame-crested-phoenix topology. That authorizes exactly one private common Phoenix 80-frame candidate named Ashcrest Kindler. It does not approve candidate pixels or authorize a commit, push, registration, outline registration, fixtures, effects, child assets, egg or ash resurrection art, flight states, specialist or elite Phoenix work, another family, release, accepted drift, or a pull request.',
  baseCheckpoint: '43452d7a03a92cee228a1d1ffaf147fc39802ad5',
  architectureDecision: EN_E11_PHOENIX_TOPOLOGY_DECISION.id,
  precedingApproval: {
    gateId: EN_E11_OWL_ECLIPSECROWN_NOCTARCH_GATE.id,
    candidateFrameDigest: EN_E11_OWL_ECLIPSECROWN_NOCTARCH_GATE.candidateFrameDigest,
    publishedImplementation: EN_E11_OWL_ECLIPSECROWN_NOCTARCH_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E11_OWL_ECLIPSECROWN_NOCTARCH_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E11_OWL_ECLIPSECROWN_NOCTARCH_GATE.initialPublishedHandoff,
    currentReconciliation: '43452d7a03a92cee228a1d1ffaf147fc39802ad5',
  },
  artifact: 'enemy-expansion-review/en-e11-phoenix-ashcrest-kindler/en-e11-phoenix-ashcrest-kindler-full-suite-raw.png',
  artifactSha256: '1932d82750a37ad527b6e24e53ab947b19c7fee5edcdafb97ed23af2092ca284',
  outlinedArtifact: 'enemy-expansion-review/en-e11-phoenix-ashcrest-kindler/en-e11-phoenix-ashcrest-kindler-full-suite-outlined-complete-b.png',
  outlinedArtifactSha256: '94da66c785c37116342d51ff0f5b5f4267b8c051973c995f37985d5ada9b9253',
  assembledArtifact: 'enemy-expansion-review/en-e11-phoenix-ashcrest-kindler/en-e11-phoenix-ashcrest-kindler-full-suite-complete-b-form.png',
  assembledArtifactSha256: '815dff42950252f2764fd8166bf2858be0db006c2dbddfe0bcc9236f799b8500',
  comparisonArtifact: 'enemy-expansion-review/en-e11-phoenix-ashcrest-kindler/en-e11-phoenix-ashcrest-kindler-family-comparison.png',
  comparisonArtifactSha256: 'c347131877b8b0f78d51ff96df3bf6f49c55cdb236250dd2257faad773445f6a',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e11-phoenix-ashcrest-kindler/en-e11-phoenix-ashcrest-kindler-full-suite-four-directions-labeled.gif',
      sha256: 'db9b464d5f2395b743c6b0c3f298e0f2654d3c14eb9f883147edb14ac22be5a2',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e11-phoenix-ashcrest-kindler/en-e11-phoenix-ashcrest-kindler-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: 'dc651078d81f87168f4be481173add9142a050f199dc92b23f0a030d3047e2c2',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
  },
  candidateFrameDigest: '8ed5a8436f2c0647cb1bfe09740cb8e6bfd84c6f0254c5402c547f7ef974b3b7',
  eclipsecrownComparisonDigest: EN_E11_OWL_ECLIPSECROWN_NOCTARCH_GATE.candidateFrameDigest,
  cinderquillComparisonDigest: EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE.candidateFrameDigest,
  harpyComparisonDigest: 'd7d83f0c209a8b4735e0a488a5df128bffa5407e38fd28e4fc38d73b633e5839',
  scope: 'One complete private 80-frame Phoenix Ashcrest Kindler common enemy across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Every frame preserves one connected grounded Phoenix actor. Idle keeps an alert ember watch. Walk alternates two grounded talon steps while folded copper wings and the connected tail counterbalance. Attack plants both talons, opens both body-owned wings into a broad solar fan, performs a hooked-beak kindle rake, and refolds. Hurt uses a complete-silhouette #f4f4f4 recoil and colored grounded recovery. Cast aliases Attack exactly and Death aliases Hurt H1,H2,H2,H2.',
  anatomyContract: EN_E11_PHOENIX_ASHCREST_KINDLER_CONTRACT.silhouette,
  reviewPresentation: 'Show the exact labeled all-four-direction Ashcrest Kindler raw/no-outline, outlined Complete B, Complete B + Form, Eclipsecrown/Cinderquill/Harpy comparison board, and both synchronized full-suite GIFs together.',
  exclusions: [
    'approved Eclipsecrown Noctarch pixels',
    'approved Cinderquill Scavenger source module and pixels',
    'public Harpy Screecher pixels',
    'approved backlog V3 registration changes',
    'Phoenix specialist or elite variants',
    'additional Bird families or variants',
    'new Cast pixels',
    'new Death pixels',
    'detached feather or flame child assets',
    'baked fire pixels',
    'baked ember particles',
    'baked glow or halo pixels',
    'baked projectile pixels',
    'baked loose-feather pixels',
    'baked ash pixels',
    'egg or resurrection art',
    'flight states',
    'baked dust pixels',
    'baked shock-ring pixels',
    'baked impact pixels',
    'registration',
    'outline registration',
    'consumer exposure',
    'fixtures',
    'effects',
    'release',
    'accepted drift',
    'pull request',
  ],
  nextGate: 'Generate, freeze, validate, and inspect the six exact private Ashcrest Kindler review artifacts, then stop for explicit visual pixel approval. Do not commit, push, register, add fixtures or effects, create child assets or resurrection art, open specialist or elite Phoenix work, accept drift, release, or open a pull request.',
});

export const EN_E11_PHOENIX_ASHCREST_KINDLER_DATA = deepFreeze({
  actor: {
    species: 'phoenix',
    bodyBuild: 'compact-grounded-flame-crested-phoenix',
    skin: 'feathered',
    hairStyle: 'connected-flame-feather-crest',
    hairColor: 'orange-gold',
    expression: 'kindled-alert',
    faceDetail: 'pale-gold-eyes-and-hooked-brass-beak',
    headgear: 'none',
    outfit: 'connected-copper-red-body-owned-wings-and-heated-gold-breast',
    outfitColor: 'ember-russet',
    outfitTier: 'tier1',
    weapon: 'none',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: ['#6f382e', '#2b1c22'],
      hair: ['#df6a2e', '#8d3326'],
      outfit: ['#93452e', '#4b2525', '#d26a32'],
    },
  },
  actorTopology: EN_E11_PHOENIX_TOPOLOGY_DECISION.selected,
  childAssets: [],
  phoenix: {
    head: ['#6f382e', '#2b1c22', '#b45a38'],
    body: ['#4d2c2a', '#241920', '#8c4933'],
    wing: ['#93452e', '#4b2525', '#d26a32'],
    breast: ['#c77a35', '#6b3d29', '#f2b84e'],
    tail: ['#7f3529', '#3d2022', '#dc5a2f'],
    crest: ['#df6a2e', '#8d3326', '#ffd060'],
    beak: ['#c49a51', '#6f4a27', '#f0c46a'],
    talon: ['#9d7948', '#55402a'],
    eye: '#fff0a6',
    feature: '#241016',
  },
  effectBoundary: 'external-fire-embers-glow-halos-projectiles-loose-feathers-ash-egg-resurrection-flight-states-dust-shock-rings-and-impacts',
  bakedEffects: [],
});

const ASHCREST_KINDLER_VARIANT = deepFreeze({
  id: 'ashcrest-kindler',
  name: 'Ashcrest Kindler',
  role: EN_E11_PHOENIX_ASHCREST_KINDLER_CONTRACT.role,
  status: EN_E11_PHOENIX_ASHCREST_KINDLER_CONTRACT.state,
  brief: 'Common grounded Phoenix with ash-charcoal and ember-russet plumage, connected orange-gold flame crest, heated-gold breast, copper-red body-owned wings, pale-gold eyes, brass beak and talons, and one connected layered ember tail.',
  rendererData: EN_E11_PHOENIX_ASHCREST_KINDLER_DATA,
});

const SOURCE_FAMILY = deepFreeze({ id: 'raven' });
const SOURCE_VARIANT = deepFreeze({ id: 'cinderquill-scavenger' });
export const EN_E11_PHOENIX_ASHCREST_KINDLER_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const MOTION_PHASES = deepFreeze({
  idle: [
    { name: 'ashcrest-ember-watch', upperBob: 0, wingPhase: 0, tailMode: 'closed', tailSway: 0, flash: false },
    { name: 'kindled-breast-settle', upperBob: 1, wingPhase: 1, tailMode: 'closed', tailSway: 0, flash: false },
  ],
  walk: [
    { name: 'left-kindle-step', upperBob: 0, wingPhase: 1, tailMode: 'closed', tailSway: -1, flash: false },
    { name: 'ember-weight-shift', upperBob: 1, wingPhase: 0, tailMode: 'closed', tailSway: 0, flash: false },
    { name: 'right-kindle-step', upperBob: 0, wingPhase: 1, tailMode: 'closed', tailSway: 1, flash: false },
    { name: 'layered-tail-recover', upperBob: 0, wingPhase: 2, tailMode: 'closed', tailSway: 0, flash: false },
  ],
  attack: [
    { name: 'two-talon-solar-brace', upperBob: 1, wingPhase: 2, tailMode: 'braced', tailSway: -1, flash: false },
    { name: 'broad-solar-wing-fan', upperBob: 0, wingPhase: 3, tailMode: 'spread', tailSway: 0, flash: false },
    { name: 'hooked-beak-kindle-rake', upperBob: 0, wingPhase: 4, tailMode: 'spread', tailSway: 0, flash: false },
    { name: 'ashcrest-refold', upperBob: 1, wingPhase: 1, tailMode: 'braced', tailSway: 1, flash: false },
  ],
  hurt: [
    { name: 'white-ashcrest-recoil', upperBob: 0, wingPhase: 2, tailMode: 'braced', tailSway: -1, flash: true },
    { name: 'planted-kindler-recovery', upperBob: 1, wingPhase: 1, tailMode: 'closed', tailSway: 0, flash: false },
  ],
});

function buildPaletteMap() {
  const source = EN_E11_RAVEN_CINDERQUILL_SCAVENGER_DATA.raven;
  const target = EN_E11_PHOENIX_ASHCREST_KINDLER_DATA.phoenix;
  const pairs = [
    [source.head, target.head],
    [source.body, target.body],
    [source.wing, target.wing],
    [source.throat, target.breast],
    [source.tail, target.tail],
    [source.cinder, target.crest],
    [source.beak, target.beak],
    [source.talon, target.talon],
    [[source.eye], [target.eye]],
    [[source.feature], [target.feature]],
  ];
  const entries = [];
  for (const [from, to] of pairs) {
    assert(from.length === to.length, 'Ashcrest Kindler palette maps must preserve source ramp lengths.');
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
      'Ashcrest Kindler plumage must use positive integer geometry.',
    );
    context.fillStyle = flash ? '#f4f4f4' : fill;
    context.fillRect(mirrored ? SIZE - x - width : x, y, width, height);
  };
  return { view, rect, dot: (x, y, fill) => rect(x, y, 1, 1, fill) };
}

function drawFlameCrestAndBreast(paint, phase) {
  const { breast, crest } = EN_E11_PHOENIX_ASHCREST_KINDLER_DATA.phoenix;
  const bob = phase.upperBob;
  if (paint.view === 'right') {
    paint.rect(15, 2 + bob, 4, 2, crest[0]);
    paint.rect(16, 1 + bob, 2, 2, crest[1]);
    paint.dot(14, 3 + bob, crest[2]);
    paint.rect(12, 11 + bob, 4, 3, breast[1]);
    paint.rect(13, 12 + bob, 3, 2, breast[0]);
    paint.dot(12, 13 + bob, breast[2]);
    return;
  }
  paint.rect(10, 2 + bob, 4, 2, crest[0]);
  paint.rect(11, 1 + bob, 2, 2, crest[1]);
  paint.dot(9, 3 + bob, crest[2]);
  paint.dot(14, 3 + bob, crest[2]);
  if (paint.view === 'up') {
    paint.rect(10, 8 + bob, 4, 3, breast[1]);
    paint.rect(11, 9 + bob, 2, 2, breast[0]);
  } else {
    paint.rect(10, 12 + bob, 4, 3, breast[1]);
    paint.rect(11, 13 + bob, 2, 2, breast[0]);
    paint.dot(12, 14 + bob, breast[2]);
  }
}

function drawSolarWingBars(paint, phase) {
  const { crest } = EN_E11_PHOENIX_ASHCREST_KINDLER_DATA.phoenix;
  const bob = phase.upperBob;
  if (paint.view === 'right') {
    if (phase.wingPhase === 3) {
      paint.rect(8, 7 + bob, 5, 1, crest[2]);
      paint.rect(8, 10 + bob, 4, 1, crest[0]);
      paint.rect(8, 13 + bob, 4, 1, crest[1]);
    } else if (phase.wingPhase === 4) {
      paint.rect(13, 10 + bob, 8, 1, crest[2]);
      paint.rect(14, 13 + bob, 7, 1, crest[0]);
      paint.dot(20, 15 + bob, crest[1]);
    } else if (phase.wingPhase === 2) {
      paint.rect(8, 12 + bob, 6, 1, crest[2]);
      paint.rect(8, 15 + bob, 5, 1, crest[0]);
    } else {
      const lower = phase.wingPhase === 1 ? 1 : 0;
      paint.rect(9, 13 + bob + lower, 5, 1, crest[2]);
      paint.rect(8, 16 + bob + lower, 5, 1, crest[0]);
    }
    return;
  }
  if (phase.wingPhase === 3) {
    paint.rect(2, 9 + bob, 6, 1, crest[2]);
    paint.rect(16, 9 + bob, 6, 1, crest[2]);
    paint.rect(3, 12 + bob, 6, 1, crest[0]);
    paint.rect(15, 12 + bob, 6, 1, crest[0]);
  } else if (phase.wingPhase === 4) {
    paint.rect(2, 11 + bob, 7, 1, crest[2]);
    paint.rect(15, 11 + bob, 7, 1, crest[2]);
    paint.rect(4, 14 + bob, 6, 1, crest[0]);
    paint.rect(14, 14 + bob, 6, 1, crest[0]);
  } else if (phase.wingPhase === 2) {
    paint.rect(5, 12 + bob, 5, 1, crest[2]);
    paint.rect(14, 12 + bob, 5, 1, crest[2]);
    paint.rect(6, 15 + bob, 4, 1, crest[0]);
    paint.rect(14, 15 + bob, 4, 1, crest[0]);
  } else {
    const lower = phase.wingPhase === 1 ? 1 : 0;
    paint.rect(6, 13 + bob + lower, 4, 1, crest[2]);
    paint.rect(14, 13 + bob + lower, 4, 1, crest[2]);
    paint.rect(7, 16 + bob + lower, 3, 1, crest[0]);
    paint.rect(14, 16 + bob + lower, 3, 1, crest[0]);
  }
}

function drawLayeredEmberTail(paint, phase) {
  const { crest, tail } = EN_E11_PHOENIX_ASHCREST_KINDLER_DATA.phoenix;
  const sway = phase.tailSway;
  if (paint.view === 'right') {
    if (phase.tailMode === 'spread') {
      paint.rect(2, 16, 9, 1, tail[2]);
      paint.rect(2, 19, 7, 1, crest[0]);
      paint.dot(1, 20, crest[2]);
    } else if (phase.tailMode === 'braced') {
      paint.rect(3 + sway, 17, 8, 1, tail[2]);
      paint.rect(3 + sway, 20, 6, 1, crest[0]);
    } else {
      paint.rect(4 + sway, 17, 7, 1, tail[2]);
      paint.rect(3 + sway, 20, 6, 1, crest[0]);
    }
    return;
  }
  if (phase.tailMode === 'spread') {
    paint.rect(6, 16, 12, 1, tail[2]);
    paint.rect(7, 19, 10, 1, crest[0]);
    paint.dot(6, 20, crest[2]);
    paint.dot(17, 20, crest[2]);
  } else if (phase.tailMode === 'braced') {
    paint.rect(8 + sway, 17, 8, 1, tail[2]);
    paint.rect(9 + sway, 20, 6, 1, crest[0]);
  } else {
    paint.rect(9 + sway, 17, 6, 1, tail[2]);
    paint.rect(10 + sway, 20, 4, 1, crest[0]);
  }
}

function drawAshcrestPlumage(context, direction, phase) {
  const paint = createOverlayPainter(context, direction, phase.flash);
  drawFlameCrestAndBreast(paint, phase);
  drawSolarWingBars(paint, phase);
  drawLayeredEmberTail(paint, phase);
}

function resolveSource(animation, frame) {
  if (animation === 'cast') return { animation: 'attack', frame };
  if (animation === 'death') return { animation: 'hurt', frame: EN_E11_PHOENIX_ASHCREST_KINDLER_DEATH_SOURCE_FRAMES[frame] };
  return { animation, frame };
}

function renderAshcrestKindler(args) {
  assert(args.family.id === 'phoenix', 'The EN-E11 Ashcrest Kindler renderer is restricted to Phoenix.');
  assert(args.variant.id === 'ashcrest-kindler', 'The EN-E11 Phoenix common renderer is restricted to Ashcrest Kindler.');
  const frameCounts = { idle: 2, walk: 4, attack: 4, cast: 4, hurt: 2, death: 4 };
  const frameCount = frameCounts[args.animation.id];
  assert(frameCount !== undefined, 'The Ashcrest Kindler gate authorizes only Idle, Walk, Attack, Cast, Hurt, and Death.');
  assert(
    Number.isInteger(args.frame) && args.frame >= 0 && args.frame < frameCount,
    'The Ashcrest Kindler frame is outside the authorized animation contract.',
  );

  const source = resolveSource(args.animation.id, args.frame);
  const phase = MOTION_PHASES[source.animation][source.frame];
  const sourceResult = EN_E11_RAVEN_CINDERQUILL_SCAVENGER_RENDERER.render({
    ...args,
    family: SOURCE_FAMILY,
    variant: SOURCE_VARIANT,
    animation: { ...args.animation, id: source.animation },
    frame: source.frame,
    context: createPaletteMappedContext(args.context),
  });
  drawAshcrestPlumage(args.context, args.direction, phase);

  return Object.freeze({
    family: args.family.id,
    variant: args.variant.id,
    direction: args.direction,
    animation: args.animation.id,
    frame: args.frame,
    renderedAnimation: source.animation,
    renderedFrame: source.frame,
    phoenixAshcrestKindlerGate: EN_E11_PHOENIX_ASHCREST_KINDLER_GATE.id,
    architectureDecision: EN_E11_PHOENIX_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E11_OWL_ECLIPSECROWN_NOCTARCH_GATE.id,
    approvedSourceMotion: sourceResult.motion,
    role: EN_E11_PHOENIX_ASHCREST_KINDLER_CONTRACT.role,
    anatomy: EN_E11_PHOENIX_ASHCREST_KINDLER_CONTRACT.chassis,
    upperBody: 'connected-flame-feather-crest-hooked-bird-beak-heated-gold-breast-and-two-body-owned-copper-red-wings',
    lowerBody: 'two-grounded-three-toed-talons-and-one-connected-layered-ember-tail',
    motion: args.animation.id === 'cast'
      ? 'exact-cast-alias-of-ashcrest-kindler-solar-fan-and-kindle-rake'
      : args.animation.id === 'death'
        ? 'exact-death-alias-of-ashcrest-kindler-recoil'
        : phase.name,
    childAssetCount: EN_E11_PHOENIX_ASHCREST_KINDLER_DATA.childAssets.length,
    effectBoundary: EN_E11_PHOENIX_ASHCREST_KINDLER_DATA.effectBoundary,
  });
}

export const EN_E11_PHOENIX_ASHCREST_KINDLER_RENDERER = Object.freeze({
  key: 'en-e11-phoenix-ashcrest-kindler-full-v1',
  chassis: EN_E11_PHOENIX_ASHCREST_KINDLER_CONTRACT.chassis,
  render: renderAshcrestKindler,
});

export const EN_E11_PHOENIX_ASHCREST_KINDLER_FAMILY = deepFreeze({
  id: 'phoenix',
  name: 'Phoenix',
  sliceId: 'EN-E11',
  rendererKey: EN_E11_PHOENIX_ASHCREST_KINDLER_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [ASHCREST_KINDLER_VARIANT],
  rendererData: {
    approvedPrecedingGate: EN_E11_OWL_ECLIPSECROWN_NOCTARCH_GATE.id,
    approvedSourceGate: EN_E11_RAVEN_CINDERQUILL_SCAVENGER_GATE.id,
    activeGate: EN_E11_PHOENIX_ASHCREST_KINDLER_GATE.id,
    topologyDecision: EN_E11_PHOENIX_TOPOLOGY_DECISION.id,
  },
  review: {
    baselineVariant: 'ashcrest-kindler',
    scale: 6,
    notes: 'Private Ashcrest Kindler common Phoenix candidate only. It awaits exact visual pixel approval. Keep registration, outline registration, fixtures, effects, child assets, resurrection art, flight states, specialist and elite Phoenix work, another family, commit, push, release, accepted drift, and a pull request separate.',
  },
});

export const EN_E11_PHOENIX_ASHCREST_KINDLER_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E11_PHOENIX_ASHCREST_KINDLER_RENDERER],
  families: [EN_E11_PHOENIX_ASHCREST_KINDLER_FAMILY],
});
