import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E11_OWL_MOONVEIL_AUGUR_GATE } from './enemy-expansion-en-e11-owl-moonveil-augur.js';
import {
  EN_E11_PHOENIX_ASHCREST_KINDLER_CONTRACT,
  EN_E11_PHOENIX_ASHCREST_KINDLER_GATE,
  EN_E11_PHOENIX_TOPOLOGY_DECISION,
} from './enemy-expansion-en-e11-phoenix-ashcrest-kindler.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E11_PHOENIX_SUNVEIL_CANTOR_CONTRACT = deepFreeze({
  family: 'phoenix',
  variant: 'sunveil-cantor',
  role: 'specialist',
  state: 'implemented-complete-motion-candidate',
  chassis: EN_E11_PHOENIX_TOPOLOGY_DECISION.selected,
  silhouette: 'A bespoke long-necked, low-bodied grounded Phoenix carries a connected back-swept lyre crest, narrow pale-gold processional veil, diagonal dawn-orange cantor mantle, two separated three-toed talons, and one connected forked-ribbon tail. Its side profile reads as a forward singer with an S-curved neck and trailing mantle rather than Ashcrest Kindler\'s compact upright body. Attack changes from gathered bow to alternating high-and-low body-owned wing arches while the actor remains connected and grounded without detached notes, fire, or halo pieces.',
  identity: 'Deep wine-red and carmine plumage, a pale-gold processional sunveil, connected saffron lyre-ray crest, diagonal dawn-orange mantle wings, cool-aqua eyes, gilt hooked beak and talons, and a connected forked-ribbon cantor tail distinguish Sunveil Cantor from approved Ashcrest Kindler, approved Moonveil Augur, and public Harpy Screecher even without color.',
  effectBoundary: EN_E11_PHOENIX_TOPOLOGY_DECISION.effectBoundary,
});

export const EN_E11_PHOENIX_SPECIALIST_CONTRACT_CARD = deepFreeze({
  family: 'phoenix',
  roleOrder: ['common', 'specialist', 'elite'],
  precedingVariant: {
    id: EN_E11_PHOENIX_ASHCREST_KINDLER_CONTRACT.variant,
    role: EN_E11_PHOENIX_ASHCREST_KINDLER_CONTRACT.role,
    status: 'implemented-full-approved-published-reconciled',
  },
  activeVariant: {
    id: EN_E11_PHOENIX_SUNVEIL_CANTOR_CONTRACT.variant,
    role: EN_E11_PHOENIX_SUNVEIL_CANTOR_CONTRACT.role,
    status: 'implemented-full-candidate',
  },
  deferredRoles: ['elite'],
});

export const EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE = deepFreeze({
  id: 'en-e11-phoenix-sunveil-cantor-full-v2',
  status: 'candidate',
  authorizedOn: '2026-08-14',
  authorizationEvidence: 'The exact Ashcrest Kindler implementation 4111b322fe6f362f92f389e606722b80426aee25, approval record c9cd3669394f0e39e05377bb9be0532e1b6204d8, initial published handoff 2c12283f38fc30a6d73be5a86a67d34842aec715, and final reconciliation ef2d1836a88f074e48d536e92c757988a0a13d17 are pushed and remote verified. The designer approved the exact Ashcrest packet and supplied the fresh continuation: approved lets do next. Under the documented Phoenix common, specialist, elite role order and selected baked-single-actor-grounded-flame-crested-phoenix topology, this opens exactly one private specialist Phoenix full 80-frame candidate. Because the specialist was not pre-named, this lane names only Sunveil Cantor. The first submitted packet was visually rejected as too similar to Ashcrest; the designer then said lets keep working here, authorizing a narrow private revision of Sunveil Cantor only. This does not approve revised candidate pixels or authorize a commit, push, public or outline registration, fixtures, effects, child assets, egg or ash resurrection art, flight states, elite Phoenix work, another family, release, accepted drift, or a pull request.',
  baseCheckpoint: 'ef2d1836a88f074e48d536e92c757988a0a13d17',
  architectureDecision: EN_E11_PHOENIX_TOPOLOGY_DECISION.id,
  precedingApproval: {
    gateId: EN_E11_PHOENIX_ASHCREST_KINDLER_GATE.id,
    candidateFrameDigest: EN_E11_PHOENIX_ASHCREST_KINDLER_GATE.candidateFrameDigest,
    publishedImplementation: EN_E11_PHOENIX_ASHCREST_KINDLER_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E11_PHOENIX_ASHCREST_KINDLER_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E11_PHOENIX_ASHCREST_KINDLER_GATE.initialPublishedHandoff,
    currentReconciliation: 'ef2d1836a88f074e48d536e92c757988a0a13d17',
  },
  artifact: 'enemy-expansion-review/en-e11-phoenix-sunveil-cantor/en-e11-phoenix-sunveil-cantor-full-suite-raw.png',
  artifactSha256: '2f8cd9f264aacb06c57999a3df1f1933189ff4e06352986a1150a115d9137547',
  outlinedArtifact: 'enemy-expansion-review/en-e11-phoenix-sunveil-cantor/en-e11-phoenix-sunveil-cantor-full-suite-outlined-complete-b.png',
  outlinedArtifactSha256: 'b505140807eb461f48d594536f909482214d3ffd3ddac25f229ae33964d33e4e',
  assembledArtifact: 'enemy-expansion-review/en-e11-phoenix-sunveil-cantor/en-e11-phoenix-sunveil-cantor-full-suite-complete-b-form.png',
  assembledArtifactSha256: '7eb90eed077e265c5bc99addacbc229ee79e664aa7db545fd587e0214997f55f',
  comparisonArtifact: 'enemy-expansion-review/en-e11-phoenix-sunveil-cantor/en-e11-phoenix-sunveil-cantor-family-comparison.png',
  comparisonArtifactSha256: 'f29339fcbbafc78cc0bbe424f99cc3a16a967fa2ad7c640e171f6939a5064757',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e11-phoenix-sunveil-cantor/en-e11-phoenix-sunveil-cantor-full-suite-four-directions-labeled.gif',
      sha256: '9c7991fd6a2f5bec8edc91413bc9eb1cc45a318ceb48a9d4175da1b2b92b8c0c',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e11-phoenix-sunveil-cantor/en-e11-phoenix-sunveil-cantor-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '746083e0f834bde653a63fa3b4fe9e2208f996ce88ba71d572f754befa2df30a',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
  },
  candidateFrameDigest: 'f97ddd614b58c2d3f99bc7c16e622cbd99f382455853815d17938804e859c226',
  ashcrestComparisonDigest: EN_E11_PHOENIX_ASHCREST_KINDLER_GATE.candidateFrameDigest,
  moonveilComparisonDigest: EN_E11_OWL_MOONVEIL_AUGUR_GATE.candidateFrameDigest,
  harpyComparisonDigest: 'd7d83f0c209a8b4735e0a488a5df128bffa5407e38fd28e4fc38d73b633e5839',
  scope: 'One complete private revised 80-frame Phoenix Sunveil Cantor specialist enemy across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Every frame uses bespoke long-necked processional Phoenix geometry rather than rendering Ashcrest. Idle alternates a high lyre-crested watch and measured cantor bow. Walk uses four grounded processional steps with neck-and-tail counter-motion. Attack gathers low, raises one body-owned wing into a high rear arch, reverses into a high fore arch, and finishes with a low conducting press; the asymmetric dawnscreen changes vertical emphasis instead of repeating Ashcrest\'s broad solar fan. Hurt uses a complete-silhouette #f4f4f4 recoil and colored low recovery. Cast aliases Attack exactly and Death aliases Hurt H1,H2,H2,H2.',
  anatomyContract: EN_E11_PHOENIX_SUNVEIL_CANTOR_CONTRACT.silhouette,
  reviewPresentation: 'Show the exact labeled all-four-direction revised Sunveil Cantor raw/no-outline, outlined Complete B, Complete B + Form, Ashcrest/Moonveil/Harpy comparison board, and both synchronized full-suite GIFs together.',
  exclusions: [
    'approved Ashcrest Kindler source module and pixels',
    'approved Moonveil Augur pixels',
    'public Harpy Screecher pixels',
    'approved backlog V3 registration changes',
    'Phoenix elite variant',
    'additional Bird families or variants',
    'new Cast pixels',
    'new Death pixels',
    'detached feather, note, or flame child assets',
    'baked fire pixels',
    'baked ember particles',
    'baked sound-ring or halo pixels',
    'baked glow or projectile pixels',
    'baked loose-feather or ash pixels',
    'egg or resurrection art',
    'flight states',
    'baked dust, shock-ring, or impact pixels',
    'registration',
    'outline registration',
    'consumer exposure',
    'fixtures',
    'effects',
    'release',
    'accepted drift',
    'pull request',
  ],
  nextGate: 'Stop after rendering, inspecting, freezing, and validating this exact revised private Sunveil Cantor candidate. Explicit designer approval of the posted exact review packet or candidate digest is required before any implementation commit or push. That approval would apply only to the frozen revised specialist Phoenix pixels and would not open public or outline registration, fixtures, effects, child assets, resurrection or flight-state art, elite Phoenix work, another family, release, accepted drift, or a pull request.',
});

export const EN_E11_PHOENIX_SUNVEIL_CANTOR_DATA = deepFreeze({
  actor: {
    species: 'phoenix',
    bodyBuild: 'long-necked-low-bodied-processional-grounded-phoenix',
    skin: 'feathered',
    hairStyle: 'connected-back-swept-lyre-sunray-crest',
    hairColor: 'saffron-gold',
    expression: 'focused-choral',
    faceDetail: 'cool-aqua-eyes-and-hooked-gilt-beak',
    headgear: 'none',
    outfit: 'connected-pale-gold-processional-sunveil-and-diagonal-dawn-orange-cantor-mantle',
    outfitColor: 'dawn-orange',
    outfitTier: 'tier2',
    weapon: 'none',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: ['#7a3140', '#2b1721'],
      hair: ['#f0a43f', '#9b482f'],
      outfit: ['#b44d3b', '#5a2531', '#e5783f'],
    },
  },
  actorTopology: EN_E11_PHOENIX_TOPOLOGY_DECISION.selected,
  childAssets: [],
  phoenix: {
    head: ['#7a3140', '#2b1721', '#c1524d'],
    body: ['#5a2635', '#21151d', '#963b44'],
    wing: ['#b44d3b', '#5a2531', '#e5783f'],
    breast: ['#d9a44f', '#7b4b2e', '#ffe09a'],
    tail: ['#9a3636', '#4a2029', '#ed6b3f'],
    crest: ['#f0a43f', '#9b482f', '#fff0a6'],
    beak: ['#d1ac63', '#73522d', '#f7d889'],
    talon: ['#aa834e', '#5c432a'],
    eye: '#bff7ed',
    feature: '#24101b',
    veil: ['#e7d19b', '#8e754d', '#fff1bd'],
    cantor: ['#e98945', '#9e3e39', '#ffd46c'],
  },
  effectBoundary: 'external-fire-embers-glow-halos-sound-rings-projectiles-loose-feathers-ash-egg-resurrection-flight-states-dust-shock-rings-and-impacts',
  bakedEffects: [],
});

const SUNVEIL_CANTOR_VARIANT = deepFreeze({
  id: 'sunveil-cantor',
  name: 'Sunveil Cantor',
  role: EN_E11_PHOENIX_SUNVEIL_CANTOR_CONTRACT.role,
  status: EN_E11_PHOENIX_SUNVEIL_CANTOR_CONTRACT.state,
  brief: 'Specialist grounded Phoenix with a bespoke long-necked processional stance, low horizontal body, connected back-swept lyre crest, pale-gold hanging sunveil, diagonal dawn mantle, cool-aqua eyes, gilt beak and talons, and one connected forked-ribbon cantor tail.',
  rendererData: EN_E11_PHOENIX_SUNVEIL_CANTOR_DATA,
});

export const EN_E11_PHOENIX_SUNVEIL_CANTOR_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const MOTION_PHASES = deepFreeze({
  idle: [
    { name: 'lyre-crested-processional-watch', bodyY: 0, headX: 0, headY: 0, mantle: 'folded', tail: 'lyre', tailSway: 0, step: 'planted', flash: false },
    { name: 'measured-sunveil-cantor-bow', bodyY: 1, headX: -1, headY: 1, mantle: 'low-fold', tail: 'lyre', tailSway: 1, step: 'planted', flash: false },
  ],
  walk: [
    { name: 'left-processional-step', bodyY: 0, headX: -1, headY: 0, mantle: 'folded', tail: 'lyre', tailSway: -1, step: 'left', flash: false },
    { name: 'passing-cantor-bow', bodyY: 1, headX: 0, headY: 1, mantle: 'low-fold', tail: 'raised', tailSway: 0, step: 'passing', flash: false },
    { name: 'right-processional-step', bodyY: 0, headX: 1, headY: 0, mantle: 'folded', tail: 'lyre', tailSway: 1, step: 'right', flash: false },
    { name: 'lifted-lyre-cadence', bodyY: 0, headX: 0, headY: 0, mantle: 'gathered', tail: 'raised', tailSway: 0, step: 'planted', flash: false },
  ],
  attack: [
    { name: 'low-cantor-gather', bodyY: 1, headX: -1, headY: 2, mantle: 'gathered', tail: 'raised', tailSway: -1, step: 'wide', flash: false },
    { name: 'high-rear-dawnscreen-arch', bodyY: 0, headX: 0, headY: 0, mantle: 'rear-arch', tail: 'fanned', tailSway: 0, step: 'wide', flash: false },
    { name: 'high-fore-dawnscreen-arch', bodyY: 0, headX: 1, headY: 0, mantle: 'fore-arch', tail: 'fanned', tailSway: 0, step: 'wide', flash: false },
    { name: 'low-hooked-beak-conducting-press', bodyY: 1, headX: 1, headY: 1, mantle: 'conduct', tail: 'lyre', tailSway: 1, step: 'wide', flash: false },
  ],
  hurt: [
    { name: 'white-lyre-cantor-recoil', bodyY: 1, headX: -1, headY: 1, mantle: 'recoil', tail: 'raised', tailSway: -1, step: 'recoil', flash: true },
    { name: 'low-processional-recovery', bodyY: 1, headX: -1, headY: 1, mantle: 'droop', tail: 'lyre', tailSway: 0, step: 'recoil', flash: false },
  ],
});

function createPainter(context, direction, flash) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const rect = (x, y, width, height, fill) => {
    assert(
      [x, y, width, height].every(Number.isInteger) && width > 0 && height > 0,
      'Sunveil Cantor geometry must use positive integer rectangles.',
    );
    context.fillStyle = flash ? '#f4f4f4' : fill;
    context.fillRect(mirrored ? SIZE - x - width : x, y, width, height);
  };
  return { view, rect, dot: (x, y, fill) => rect(x, y, 1, 1, fill) };
}

function drawForkedCantorTail(paint, phase) {
  const { body, cantor, crest, tail } = EN_E11_PHOENIX_SUNVEIL_CANTOR_DATA.phoenix;
  const sway = phase.tailSway;
  const bob = phase.bodyY;
  if (paint.view === 'right') {
    if (phase.tail === 'fanned') {
      paint.rect(1, 13, 11, 4, tail[1]);
      paint.rect(2, 12, 9, 3, tail[0]);
      paint.rect(2, 18, 9, 3, tail[1]);
      paint.rect(1, 20, 7, 1, crest[0]);
      paint.rect(4, 14, 8, 6, body[1]);
      paint.rect(2, 13, 5, 1, tail[2]);
      paint.rect(2, 19, 6, 1, cantor[2]);
    } else if (phase.tail === 'raised') {
      paint.rect(2 + sway, 12 + bob, 10, 4, tail[1]);
      paint.rect(4 + sway, 11 + bob, 7, 2, tail[0]);
      paint.rect(4, 17, 8, 4, tail[1]);
      paint.rect(3, 20, 6, 1, crest[0]);
      paint.rect(8, 14 + bob, 4, 6 - bob, body[1]);
      paint.rect(3 + sway, 13 + bob, 5, 1, tail[2]);
      paint.rect(4, 18, 6, 1, cantor[2]);
    } else {
      paint.rect(3 + sway, 14 + bob, 9, 3, tail[1]);
      paint.rect(2 + sway, 15 + bob, 7, 2, tail[0]);
      paint.rect(4, 18, 8, 3, tail[1]);
      paint.rect(3, 20, 6, 1, crest[0]);
      paint.rect(8, 15 + bob, 4, 5 - bob, body[1]);
      paint.rect(3 + sway, 15 + bob, 5, 1, tail[2]);
      paint.rect(4, 19, 6, 1, cantor[2]);
    }
    return;
  }

  if (phase.tail === 'fanned') {
    paint.rect(2, 14, 20, 4, tail[1]);
    paint.rect(3, 17, 7, 4, tail[0]);
    paint.rect(14, 17, 7, 4, tail[0]);
    paint.rect(8, 16, 8, 5, body[1]);
    paint.rect(2, 15, 7, 1, tail[2]);
    paint.rect(15, 15, 7, 1, cantor[2]);
    paint.rect(4, 20, 5, 1, crest[0]);
    paint.rect(15, 20, 5, 1, crest[0]);
  } else if (phase.tail === 'raised') {
    paint.rect(5 + sway, 13 + bob, 6, 4, tail[1]);
    paint.rect(13 + sway, 13 + bob, 6, 4, tail[0]);
    paint.rect(6 + sway, 12 + bob, 4, 2, tail[2]);
    paint.rect(14 + sway, 12 + bob, 4, 2, cantor[2]);
    paint.rect(7, 16, 10, 5, body[1]);
    paint.rect(5, 19, 5, 2, tail[0]);
    paint.rect(14, 19, 5, 2, tail[0]);
    paint.dot(5, 20, crest[2]);
    paint.dot(18, 20, crest[2]);
  } else {
    paint.rect(6 + sway, 14 + bob, 12, 4, tail[1]);
    paint.rect(5 + sway, 16 + bob, 5, 4 - bob, tail[0]);
    paint.rect(14 + sway, 16 + bob, 5, 4 - bob, tail[0]);
    paint.rect(8, 17, 8, 4, body[1]);
    paint.rect(5 + sway, 17 + bob, 4, 1, tail[2]);
    paint.rect(15 + sway, 17 + bob, 4, 1, cantor[2]);
    paint.rect(6, 20, 4, 1, crest[0]);
    paint.rect(14, 20, 4, 1, crest[0]);
  }
}

function footPositions(view, step) {
  const front = {
    planted: [6, 15], left: [4, 14], passing: [7, 14], right: [7, 16],
    wide: [4, 17], recoil: [5, 16],
  };
  const side = {
    planted: [8, 15], left: [6, 14], passing: [9, 14], right: [9, 17],
    wide: [6, 17], recoil: [8, 16],
  };
  return (view === 'right' ? side : front)[step];
}

function drawProcessionalTalons(paint, phase) {
  const { talon } = EN_E11_PHOENIX_SUNVEIL_CANTOR_DATA.phoenix;
  for (const footX of footPositions(paint.view, phase.step)) {
    const legY = 17 + phase.bodyY;
    paint.rect(footX + 1, legY, 2, 22 - legY, talon[1]);
    paint.rect(footX, 22, 3, 1, talon[0]);
    paint.dot(footX + 2, 21, talon[0]);
  }
}

function drawSideMantleAndBody(paint, phase) {
  const { body, breast, cantor, veil, wing } = EN_E11_PHOENIX_SUNVEIL_CANTOR_DATA.phoenix;
  const bob = phase.bodyY;

  if (phase.mantle === 'rear-arch') {
    paint.rect(3, 6, 5, 9, wing[1]);
    paint.rect(5, 4, 5, 11, wing[0]);
    paint.rect(7, 7, 4, 10, veil[0]);
    paint.rect(4, 5, 4, 2, cantor[2]);
    paint.rect(6, 10, 4, 2, wing[2]);
  } else if (phase.mantle === 'fore-arch') {
    paint.rect(7, 11, 7, 6, wing[1]);
    paint.rect(11, 5, 5, 11, wing[1]);
    paint.rect(13, 3, 5, 11, wing[0]);
    paint.rect(12, 6, 4, 8, veil[0]);
    paint.rect(9, 7, 3, 3, cantor[0]);
    paint.rect(13, 4, 4, 2, cantor[2]);
    paint.rect(17, 11, 6, 5, wing[0]);
    paint.rect(18, 13, 5, 2, wing[2]);
  } else if (phase.mantle === 'conduct') {
    paint.rect(6, 12 + bob, 9, 6, wing[1]);
    paint.rect(13, 10 + bob, 10, 6, wing[0]);
    paint.rect(15, 11 + bob, 8, 2, veil[0]);
    paint.rect(17, 14 + bob, 6, 1, cantor[2]);
  } else if (phase.mantle === 'recoil') {
    paint.rect(5, 9 + bob, 8, 8, wing[1]);
    paint.rect(7, 15 + bob, 8, 4, wing[0]);
    paint.rect(5, 10 + bob, 4, 2, cantor[2]);
  } else if (phase.mantle === 'droop') {
    paint.rect(6, 13 + bob, 10, 6, wing[1]);
    paint.rect(5, 16 + bob, 7, 4 - bob, wing[0]);
    paint.rect(6, 18, 6, 1, cantor[2]);
  } else if (phase.mantle === 'gathered') {
    paint.rect(7, 9 + bob, 7, 9, wing[1]);
    paint.rect(9, 11 + bob, 8, 7, wing[0]);
    paint.rect(8, 10 + bob, 4, 2, veil[0]);
    paint.rect(9, 15 + bob, 5, 1, cantor[2]);
  } else {
    const low = phase.mantle === 'low-fold' ? 1 : 0;
    paint.rect(8, 10 + bob + low, 8, 4, wing[1]);
    paint.rect(6, 13 + bob + low, 10, 4, wing[0]);
    paint.rect(5, 16 + bob + low, 9, 2, wing[2]);
    paint.rect(7, 14 + bob + low, 7, 1, veil[0]);
    paint.rect(6, 17 + bob + low, 6, 1, cantor[2]);
  }

  paint.rect(8, 11 + bob, 10, 8 - bob, body[1]);
  paint.rect(10, 12 + bob, 7, 6 - bob, body[0]);
  paint.rect(12, 13 + bob, 5, 4, body[2]);
  paint.rect(13, 13 + bob, 4, 4, breast[1]);
  paint.rect(14, 14 + bob, 3, 3, breast[0]);
  paint.dot(16, 14 + bob, breast[2]);
}

function drawFrontMantleAndBody(paint, phase) {
  const { body, breast, cantor, veil, wing } = EN_E11_PHOENIX_SUNVEIL_CANTOR_DATA.phoenix;
  const bob = phase.bodyY;

  if (phase.mantle === 'rear-arch') {
    paint.rect(2, 6, 6, 10, wing[1]);
    paint.rect(5, 4, 5, 12, wing[0]);
    paint.rect(6, 7, 4, 10, veil[0]);
    paint.rect(15, 12, 7, 6, wing[0]);
    paint.rect(16, 14, 6, 2, cantor[0]);
    paint.rect(3, 5, 5, 2, cantor[2]);
  } else if (phase.mantle === 'fore-arch') {
    paint.rect(2, 12, 7, 6, wing[0]);
    paint.rect(15, 4, 5, 12, wing[0]);
    paint.rect(17, 6, 5, 10, wing[1]);
    paint.rect(14, 7, 4, 10, veil[0]);
    paint.rect(2, 14, 6, 2, cantor[0]);
    paint.rect(17, 5, 5, 2, cantor[2]);
  } else if (phase.mantle === 'conduct') {
    paint.rect(3, 9 + bob, 7, 9 - bob, wing[1]);
    paint.rect(14, 12 + bob, 9, 6 - bob, wing[0]);
    paint.rect(4, 10 + bob, 5, 2, veil[0]);
    paint.rect(16, 14 + bob, 7, 1, cantor[2]);
  } else if (phase.mantle === 'recoil') {
    paint.rect(4, 9 + bob, 7, 8 - bob, wing[1]);
    paint.rect(13, 11 + bob, 7, 7 - bob, wing[0]);
    paint.rect(5, 10 + bob, 5, 2, cantor[2]);
  } else if (phase.mantle === 'droop') {
    paint.rect(4, 13 + bob, 7, 6 - bob, wing[1]);
    paint.rect(13, 14 + bob, 7, 5 - bob, wing[0]);
    paint.rect(5, 17 + bob, 5, 1, cantor[2]);
    paint.rect(14, 17 + bob, 5, 1, cantor[0]);
  } else if (phase.mantle === 'gathered') {
    paint.rect(4, 12 + bob, 7, 5 - bob, wing[1]);
    paint.rect(6, 9 + bob, 5, 7 - bob, wing[0]);
    paint.rect(13, 9 + bob, 5, 7 - bob, wing[0]);
    paint.rect(13, 12 + bob, 7, 5 - bob, wing[1]);
    paint.rect(5, 13 + bob, 5, 2, veil[0]);
    paint.rect(14, 13 + bob, 5, 2, cantor[2]);
  } else {
    const low = phase.mantle === 'low-fold' ? 1 : 0;
    paint.rect(6, 10 + bob + low, 5, 3, wing[1]);
    paint.rect(5, 12 + bob + low, 5, 3, wing[0]);
    paint.rect(4, 14 + bob + low, 5, 3, wing[0]);
    paint.rect(5, 17 + bob + low, 4, 2 - low, wing[2]);
    paint.rect(13, 10 + bob + low, 5, 3, wing[1]);
    paint.rect(14, 12 + bob + low, 5, 3, wing[0]);
    paint.rect(15, 14 + bob + low, 5, 3, wing[0]);
    paint.rect(15, 17 + bob + low, 4, 2 - low, cantor[0]);
  }

  paint.rect(8, 11 + bob, 8, 3, body[1]);
  paint.rect(7, 14 + bob, 10, 4 - bob, body[1]);
  paint.rect(8, 18, 8, 1, body[1]);
  paint.rect(9, 12 + bob, 6, 3, body[0]);
  paint.rect(8, 15 + bob, 8, 3 - bob, body[0]);
  paint.rect(10, 14 + bob, 4, 4 - bob, body[2]);
  if (paint.view === 'up') {
    paint.rect(9, 11 + bob, 6, 3, breast[1]);
    paint.rect(10, 12 + bob, 4, 1, breast[0]);
    paint.dot(12, 12 + bob, breast[2]);
  } else {
    paint.rect(9, 12 + bob, 6, 3, breast[1]);
    paint.rect(10, 14 + bob, 4, 3 - bob, breast[0]);
    paint.rect(11, 15 + bob, 2, 2 - bob, breast[2]);
  }
}

function drawSideHeadCrestAndVeil(paint, phase) {
  const { cantor, crest, eye, feature, head, beak, veil } = EN_E11_PHOENIX_SUNVEIL_CANTOR_DATA.phoenix;
  const x = phase.headX;
  const y = phase.headY;

  paint.rect(9 + x, 2 + y, 6, 3, crest[1]);
  paint.rect(7 + x, 1 + y, 5, 2, crest[0]);
  paint.rect(11 + x, 3 + y, 5, 2, crest[0]);
  paint.dot(7 + x, 1 + y, crest[2]);
  paint.dot(14 + x, 2 + y, cantor[2]);

  paint.rect(12 + x, 7 + y, 5, 7 - y + phase.bodyY, head[1]);
  paint.rect(14 + x, 4 + y, 6, 5, head[1]);
  paint.rect(15 + x, 5 + y, 4, 3, head[0]);
  paint.rect(13 + x, 9 + y, 4, 5 - y + phase.bodyY, head[0]);
  paint.rect(14 + x, 10 + y, 3, 4 - y + phase.bodyY, veil[1]);
  paint.rect(15 + x, 11 + y, 2, 3 - y + phase.bodyY, veil[0]);
  paint.dot(16 + x, 11 + y, veil[2]);

  paint.dot(17 + x, 6 + y, eye);
  paint.dot(18 + x, 7 + y, feature);
  paint.rect(19 + x, 7 + y, 3, 2, beak[1]);
  paint.rect(19 + x, 7 + y, 2, 1, beak[0]);
  paint.dot(21 + x, 7 + y, beak[2]);
}

function drawFrontHeadCrestAndVeil(paint, phase) {
  const { cantor, crest, eye, feature, head, beak, veil } = EN_E11_PHOENIX_SUNVEIL_CANTOR_DATA.phoenix;
  const x = phase.headX;
  const y = phase.headY;

  paint.rect(6 + x, 3 + y, 5, 2, crest[1]);
  paint.rect(7 + x, 1 + y, 4, 3, crest[0]);
  paint.rect(13 + x, 3 + y, 5, 2, crest[1]);
  paint.rect(13 + x, 1 + y, 4, 3, crest[0]);
  paint.rect(9 + x, 4 + y, 6, 2, crest[0]);
  paint.dot(7 + x, 1 + y, crest[2]);
  paint.dot(16 + x, 1 + y, cantor[2]);

  paint.rect(9 + x, 4 + y, 6, 5, head[1]);
  paint.rect(10 + x, 5 + y, 4, 3, head[0]);
  paint.rect(10 + x, 8 + y, 4, 6 - y + phase.bodyY, head[1]);
  paint.rect(11 + x, 9 + y, 2, 5 - y + phase.bodyY, head[0]);

  if (paint.view === 'up') {
    paint.rect(9 + x, 8 + y, 6, 2, veil[1]);
    paint.rect(10 + x, 10 + y, 4, 2, veil[0]);
    paint.rect(11 + x, 12 + y, 2, 2 - y + phase.bodyY, veil[1]);
    paint.dot(12 + x, 9 + y, veil[2]);
    return;
  }

  paint.dot(10 + x, 6 + y, eye);
  paint.dot(13 + x, 6 + y, eye);
  paint.dot(10 + x, 7 + y, feature);
  paint.dot(13 + x, 7 + y, feature);
  paint.rect(10 + x, 8 + y, 4, 2, beak[1]);
  paint.rect(11 + x, 8 + y, 2, 2, beak[0]);
  paint.dot(12 + x, 9 + y, beak[2]);
  paint.rect(9 + x, 10 + y, 6, 2, veil[1]);
  paint.rect(10 + x, 12 + y, 4, 2, veil[0]);
  paint.rect(11 + x, 14, 2, 2 + phase.bodyY, veil[2]);
}

function drawSunveilCantor(context, direction, phase) {
  const paint = createPainter(context, direction, phase.flash);
  drawForkedCantorTail(paint, phase);
  drawProcessionalTalons(paint, phase);
  if (paint.view === 'right') {
    drawSideMantleAndBody(paint, phase);
    drawSideHeadCrestAndVeil(paint, phase);
  } else {
    drawFrontMantleAndBody(paint, phase);
    drawFrontHeadCrestAndVeil(paint, phase);
  }
}

function resolveSource(animation, frame) {
  if (animation === 'cast') return { animation: 'attack', frame };
  if (animation === 'death') return { animation: 'hurt', frame: EN_E11_PHOENIX_SUNVEIL_CANTOR_DEATH_SOURCE_FRAMES[frame] };
  return { animation, frame };
}

function renderSunveilCantor(args) {
  assert(args.family.id === 'phoenix', 'The EN-E11 Sunveil Cantor renderer is restricted to Phoenix.');
  assert(args.variant.id === 'sunveil-cantor', 'The EN-E11 Phoenix specialist renderer is restricted to Sunveil Cantor.');
  const frameCounts = { idle: 2, walk: 4, attack: 4, cast: 4, hurt: 2, death: 4 };
  const frameCount = frameCounts[args.animation.id];
  assert(frameCount !== undefined, 'The Sunveil Cantor gate authorizes only Idle, Walk, Attack, Cast, Hurt, and Death.');
  assert(
    Number.isInteger(args.frame) && args.frame >= 0 && args.frame < frameCount,
    'The Sunveil Cantor frame is outside the authorized animation contract.',
  );

  const source = resolveSource(args.animation.id, args.frame);
  const phase = MOTION_PHASES[source.animation][source.frame];
  drawSunveilCantor(args.context, args.direction, phase);

  return Object.freeze({
    family: args.family.id,
    variant: args.variant.id,
    direction: args.direction,
    animation: args.animation.id,
    frame: args.frame,
    renderedAnimation: source.animation,
    renderedFrame: source.frame,
    phoenixSunveilCantorGate: EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.id,
    architectureDecision: EN_E11_PHOENIX_TOPOLOGY_DECISION.id,
    approvedPrecedingGate: EN_E11_PHOENIX_ASHCREST_KINDLER_GATE.id,
    approvedSourceMotion: 'bespoke-sunveil-cantor-processional-geometry',
    role: EN_E11_PHOENIX_SUNVEIL_CANTOR_CONTRACT.role,
    anatomy: EN_E11_PHOENIX_SUNVEIL_CANTOR_CONTRACT.chassis,
    upperBody: 'bespoke-long-necked-lyre-crested-phoenix-with-processional-sunveil-and-two-diagonal-body-owned-dawn-mantle-wings',
    lowerBody: 'low-horizontal-body-two-separated-grounded-three-toed-talons-and-one-connected-forked-ribbon-cantor-tail',
    motion: args.animation.id === 'cast'
      ? 'exact-cast-alias-of-sunveil-cantor-alternating-dawnscreen-arches'
      : args.animation.id === 'death'
        ? 'exact-death-alias-of-sunveil-cantor-recoil'
        : phase.name,
    childAssetCount: EN_E11_PHOENIX_SUNVEIL_CANTOR_DATA.childAssets.length,
    effectBoundary: EN_E11_PHOENIX_SUNVEIL_CANTOR_DATA.effectBoundary,
  });
}

export const EN_E11_PHOENIX_SUNVEIL_CANTOR_RENDERER = Object.freeze({
  key: 'en-e11-phoenix-sunveil-cantor-full-v2',
  chassis: EN_E11_PHOENIX_SUNVEIL_CANTOR_CONTRACT.chassis,
  render: renderSunveilCantor,
});

export const EN_E11_PHOENIX_SUNVEIL_CANTOR_FAMILY = deepFreeze({
  id: 'phoenix',
  name: 'Phoenix',
  sliceId: 'EN-E11',
  rendererKey: EN_E11_PHOENIX_SUNVEIL_CANTOR_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [SUNVEIL_CANTOR_VARIANT],
  rendererData: {
    approvedPrecedingGate: EN_E11_PHOENIX_ASHCREST_KINDLER_GATE.id,
    approvedSourceGate: null,
    activeGate: EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE.id,
    topologyDecision: EN_E11_PHOENIX_TOPOLOGY_DECISION.id,
  },
  review: {
    baselineVariant: 'sunveil-cantor',
    scale: 6,
    notes: 'Unapproved revised private specialist Phoenix candidate against approved Ashcrest Kindler, approved Moonveil Augur, and public Harpy Screecher. The renderer uses bespoke long-necked processional geometry rather than Ashcrest source pixels. Stop after exact review-packet inspection and validation. Do not commit or push candidate pixels without explicit approval of the posted exact packet or candidate digest. Keep public or outline registration, fixtures, effects, child assets, resurrection art, flight states, elite Phoenix work, another family, release, accepted drift, and a pull request separate.',
  },
});

export const EN_E11_PHOENIX_SUNVEIL_CANTOR_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E11_PHOENIX_SUNVEIL_CANTOR_RENDERER],
  families: [EN_E11_PHOENIX_SUNVEIL_CANTOR_FAMILY],
});
