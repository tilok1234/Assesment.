import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E04_BIRDFOLK_AERIE_SCOUT_CONTRACT,
  EN_E04_BIRDFOLK_AERIE_SCOUT_DATA,
  EN_E04_BIRDFOLK_AERIE_SCOUT_GATE,
  EN_E04_BIRDFOLK_AERIE_SCOUT_RENDERER,
} from './enemy-expansion-en-e04-birdfolk-aerie-scout.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E04_BIRDFOLK_GALE_AUGUR_CONTRACT = deepFreeze({
  family: 'birdfolk',
  variant: 'gale-augur',
  role: 'specialist',
  state: 'implemented-complete-motion-candidate',
  chassis: EN_E04_BIRDFOLK_AERIE_SCOUT_CONTRACT.chassis,
  silhouette: 'The approved upright Aerie Scout avian silhouette remains complete beneath a connected storm cowl, silver brow circlet, layered shoulder mantle, forewing bands, and central sky rune. The beaked head, shoulder-rooted wing-arms, two digitigrade talon legs, and connected tail fan remain readable in every direction without human hair, a human face, ordinary boots, floating regalia islands, or exposed-human Harpy anatomy.',
  identity: 'Indigo plumage, midnight flight feathers, storm-violet tips, a silver ritual circlet and wing-root mantle, cyan sky-rune marks, ice-blue eyes, and the approved gold beak and talons distinguish the Gale Augur specialist from common Aerie Scout.',
  effectBoundary: 'Wind glyphs, omen rings, feather spirals, pressure waves, lightning filaments, dust puffs, air blades, and impact effects remain external.',
});

export const EN_E04_BIRDFOLK_GALE_AUGUR_GATE = deepFreeze({
  id: 'en-e04-birdfolk-gale-augur-full-v1',
  status: 'approved',
  authorizedOn: '2026-08-09',
  authorizationEvidence: 'After approving, publishing, and reconciling the complete Birdfolk Aerie Scout common, the designer said: awesome lets keep going. The documented Birdfolk role order advances from common to specialist; because the live plan did not pre-name that role, Codex named and bounded exactly one complete 80-frame Birdfolk Gale Augur specialist enemy.',
  approvedOn: '2026-08-09',
  approvalEvidence: 'The designer reviewed the exact hash-frozen raw/no-outline and Complete B + Form Birdfolk Gale Augur full-suite pair and said: awesome looks good approved. Both exact 1428x760 boards had already been opened through the working Aseprite MCP, and all four raw plus all four Complete B + Form phases were inspected directly.',
  precedingApproval: {
    gateId: EN_E04_BIRDFOLK_AERIE_SCOUT_GATE.id,
    artifactSha256: EN_E04_BIRDFOLK_AERIE_SCOUT_GATE.artifactSha256,
    assembledArtifactSha256: EN_E04_BIRDFOLK_AERIE_SCOUT_GATE.assembledArtifactSha256,
    rawAnimationSha256: EN_E04_BIRDFOLK_AERIE_SCOUT_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E04_BIRDFOLK_AERIE_SCOUT_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E04_BIRDFOLK_AERIE_SCOUT_GATE.candidateFrameDigest,
    publishedCheckpoint: 'a0910312e510ee57b603ee981a279c1f372d6fad',
    publishedHandoff: '60df011f86f2bce93e54a7bcd071d53b1ae3497e',
  },
  artifact: 'enemy-expansion-review/en-e04-birdfolk-gale-augur/en-e04-birdfolk-gale-augur-full-suite-raw.png',
  artifactSha256: '6f1083a615555aa47fc7a9d62c8cf1e2761cccee1b6346f04d5f0d973d68e33c',
  assembledArtifact: 'enemy-expansion-review/en-e04-birdfolk-gale-augur/en-e04-birdfolk-gale-augur-full-suite-complete-b-form.png',
  assembledArtifactSha256: 'c82183ed27e2639130670918960d3c87bd9d16d9eba74f76e049a0d04d1d631b',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e04-birdfolk-gale-augur/en-e04-birdfolk-gale-augur-full-suite-four-directions-labeled.gif',
      sha256: '083b327e56c6e530e6b42f92178350803d7a40687e4dc985ad4077ac40bd1a09',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e04-birdfolk-gale-augur/en-e04-birdfolk-gale-augur-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '7db6c88d3c0a1ec0f9289d86b80885bf5418edd0af95ad44ac08f1da1ca96641',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
  },
  candidateFrameDigest: '4495c4f91c77f411a7b0639ac68e3b8bf94318632d0191f0034a4373f32de9d4',
  scope: 'One complete 80-frame Birdfolk Gale Augur specialist enemy across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Every frame preserves the approved Aerie Scout anatomy, alpha footprint, and full-body motion beneath connected specialist regalia. The storm cowl, circlet, mantle, forewing bands, and sky rune follow the approved breath, four-step gait, wing-and-talon rake, and complete-silhouette recoil. Cast aliases Attack exactly and Death aliases Hurt H1,H2,H2,H2.',
  anatomyContract: EN_E04_BIRDFOLK_GALE_AUGUR_CONTRACT.silhouette,
  reviewPresentation: 'Show the exact labeled all-four-direction Birdfolk Gale Augur full-suite raw/no-outline and Complete B + Form boards and GIFs together. The four GIF phases display Idle, Walk, Attack, Cast, Hurt, and Death simultaneously.',
  exclusions: [
    'approved Aerie Scout source module and pixels',
    'Birdfolk elite',
    'additional Birdfolk variants',
    'new Cast pixels',
    'new Death pixels',
    'baked wind-glyph pixels',
    'baked omen-ring pixels',
    'baked feather-spiral pixels',
    'baked pressure-wave pixels',
    'baked lightning-filament pixels',
    'baked dust-puff pixels',
    'baked air-blade pixels',
    'baked impact pixels',
    'registration',
    'consumer exposure',
    'effects',
    'release',
    'later EN-E04 work',
  ],
  nextGate: 'Bounded commit, push, and publication of this exact ten-file Gale Augur lane are authorized. No Birdfolk elite, additional Birdfolk variants, registration, integration, effects, release, or broader EN-E04 work is authorized by this approval.',
});

export const EN_E04_BIRDFOLK_GALE_AUGUR_DATA = deepFreeze({
  actor: {
    species: 'human',
    bodyBuild: 'lean',
    skin: 'pale',
    hairStyle: 'short',
    hairColor: 'black',
    expression: 'stern',
    faceDetail: 'none',
    headgear: 'circlet',
    outfit: 'mage',
    outfitColor: 'blue',
    outfitTier: 'tier2',
    weapon: 'none',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: ['#6078a9', '#35466f'],
      hair: ['#41436e', '#272a4c'],
      outfit: ['#3f8fc2', '#275a83', '#b9c6d8'],
    },
  },
  birdfolk: {
    plumage: ['#6078a9', '#35466f', '#a8b7df'],
    flight: ['#41436e', '#272a4c', '#7e83b5'],
    throat: ['#d8d4ee', '#8a86a8', '#f1edff'],
    storm: ['#8b58a8', '#583768', '#c58ae0'],
    silver: ['#b9c6d8', '#68758c', '#e4efff'],
    sky: ['#3f8fc2', '#275a83', '#78c9e8'],
    beak: ['#d6a74f', '#8a612f', '#f0d477'],
    eye: ['#8ef2ff', '#27304d'],
  },
  effectBoundary: 'external-wind-glyphs-omen-rings-feather-spirals-pressure-waves-lightning-filaments-dust-puffs-air-blades-and-impacts',
  bakedEffects: [],
});

const GALE_AUGUR_VARIANT = deepFreeze({
  id: 'gale-augur',
  name: 'Gale Augur',
  role: EN_E04_BIRDFOLK_GALE_AUGUR_CONTRACT.role,
  status: EN_E04_BIRDFOLK_GALE_AUGUR_CONTRACT.state,
  brief: 'Specialist Birdfolk wind reader preserving the approved upright avian chassis beneath indigo plumage, a connected storm cowl and shoulder mantle, silver ritual bands, cyan sky runes, ice-blue eyes, and external omen effects.',
  rendererData: EN_E04_BIRDFOLK_GALE_AUGUR_DATA,
});

const SOURCE_VARIANT = deepFreeze({ id: 'aerie-scout' });
const DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);
const MOTION_PHASES = deepFreeze({
  idle: [
    { name: 'augur-breath', forward: 0, lift: 0, upperBob: 0 },
    { name: 'cowl-settle', forward: 0, lift: 0, upperBob: 1 },
  ],
  walk: [
    { name: 'left-talon-omen-step', forward: 0, lift: 0, upperBob: 0 },
    { name: 'mantle-compress', forward: 0, lift: 0, upperBob: 1 },
    { name: 'right-talon-omen-step', forward: 0, lift: 0, upperBob: 0 },
    { name: 'augur-recover', forward: 0, lift: 0, upperBob: 0 },
  ],
  attack: [
    { name: 'mantle-brace', forward: -1, lift: 0, upperBob: 0 },
    { name: 'circlet-rise', forward: 0, lift: -1, upperBob: 0 },
    { name: 'gale-talon-rake', forward: 1, lift: 0, upperBob: 0 },
    { name: 'ritual-recover', forward: 0, lift: 0, upperBob: 1 },
  ],
  hurt: [
    { name: 'white-augur-recoil', forward: -1, lift: 0, upperBob: 0 },
    { name: 'mantle-recovery', forward: 0, lift: 0, upperBob: 1 },
  ],
});

function buildPaletteMap() {
  const source = EN_E04_BIRDFOLK_AERIE_SCOUT_DATA.birdfolk;
  const target = EN_E04_BIRDFOLK_GALE_AUGUR_DATA.birdfolk;
  const pairs = [
    [source.plumage, target.plumage],
    [source.flight, target.flight],
    [source.throat, target.throat],
    [source.rust, target.storm],
    [source.bronze, target.silver],
    [source.teal, target.sky],
    [source.beak, target.beak],
    [source.eye, target.eye],
  ];
  const entries = [];
  for (const [from, to] of pairs) {
    assert(from.length === to.length, 'Gale Augur palette maps must preserve source ramp lengths.');
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

function physicalShift(direction, phase) {
  if (direction === 'right') return { x: phase.forward, y: phase.lift };
  if (direction === 'left') return { x: -phase.forward, y: phase.lift };
  return { x: 0, y: phase.lift + (direction === 'down' ? phase.forward : -phase.forward) };
}

function createOverlayPainter(context, direction, phase, flash) {
  const mirrored = direction === 'left';
  const view = mirrored ? 'right' : direction;
  const shift = physicalShift(direction, phase);
  const rect = (x, y, width, height, fill) => {
    assert([x, y, width, height].every(Number.isInteger) && width > 0 && height > 0, 'Gale Augur regalia must use positive integer geometry.');
    context.fillStyle = flash ? '#ffffff' : fill;
    context.fillRect((mirrored ? SIZE - x - width : x) + shift.x, y + shift.y, width, height);
  };
  return { view, rect, dot: (x, y, fill) => rect(x, y, 1, 1, fill) };
}

function drawGaleAugurRegalia(context, direction, phase, flash) {
  const { storm, silver, sky } = EN_E04_BIRDFOLK_GALE_AUGUR_DATA.birdfolk;
  const paint = createOverlayPainter(context, direction, phase, flash);
  const bob = phase.upperBob;
  if (paint.view === 'right') {
    paint.rect(9, 4 + bob, 2, 4, storm[1]);
    paint.dot(10, 3 + bob, storm[2]);
    paint.rect(12, 4 + bob, 5, 1, silver[1]);
    paint.dot(15, 4 + bob, sky[2]);
    paint.rect(8, 9 + bob, 2, 4, storm[0]);
    paint.rect(9, 12 + bob, 3, 2, storm[1]);
    paint.rect(10, 10 + bob, 3, 1, silver[0]);
    paint.dot(13, 11 + bob, sky[2]);
    paint.rect(10, 14 + bob, 3, 1, silver[1]);
    return;
  }
  paint.rect(8, 3 + bob, 2, 2, storm[1]);
  paint.rect(14, 3 + bob, 2, 2, storm[1]);
  paint.dot(9, 2 + bob, storm[2]);
  paint.dot(14, 2 + bob, storm[2]);
  paint.rect(9, 4 + bob, 6, 1, silver[1]);
  paint.dot(12, 4 + bob, sky[2]);
  paint.rect(7, 9 + bob, 2, 4, storm[0]);
  paint.rect(15, 9 + bob, 2, 4, storm[0]);
  paint.rect(8, 12 + bob, 2, 2, storm[1]);
  paint.rect(14, 12 + bob, 2, 2, storm[1]);
  paint.rect(10, 9 + bob, 4, 1, silver[0]);
  paint.dot(12, 10 + bob, sky[2]);
  paint.rect(11, 11 + bob, 2, 1, sky[0]);
  paint.dot(9, 14 + bob, silver[2]);
  paint.dot(14, 14 + bob, silver[2]);
}

function resolveSource(animation, frame) {
  if (animation === 'cast') return { animation: 'attack', frame };
  if (animation === 'death') return { animation: 'hurt', frame: DEATH_SOURCE_FRAMES[frame] };
  return { animation, frame };
}

function renderGaleAugur(args) {
  assert(args.family.id === 'birdfolk', 'The EN-E04 Gale Augur renderer is restricted to Birdfolk.');
  assert(args.variant.id === 'gale-augur', 'The EN-E04 Gale Augur renderer is restricted to Gale Augur.');
  const frameCounts = { idle: 2, walk: 4, attack: 4, cast: 4, hurt: 2, death: 4 };
  const frameCount = frameCounts[args.animation.id];
  assert(frameCount !== undefined, 'The Gale Augur gate authorizes only Idle, Walk, Attack, Cast, Hurt, and Death.');
  assert(Number.isInteger(args.frame) && args.frame >= 0 && args.frame < frameCount, 'The Gale Augur frame is outside the authorized animation contract.');

  const source = resolveSource(args.animation.id, args.frame);
  const phase = MOTION_PHASES[source.animation][source.frame];
  const sourceResult = EN_E04_BIRDFOLK_AERIE_SCOUT_RENDERER.render({
    ...args,
    variant: SOURCE_VARIANT,
    animation: { ...args.animation, id: source.animation },
    frame: source.frame,
    context: createPaletteMappedContext(args.context),
  });
  const flash = source.animation === 'hurt' && source.frame === 0;
  drawGaleAugurRegalia(args.context, args.direction, phase, flash);

  return Object.freeze({
    family: args.family.id,
    variant: args.variant.id,
    direction: args.direction,
    animation: args.animation.id,
    frame: args.frame,
    renderedAnimation: source.animation,
    renderedFrame: source.frame,
    birdfolkGaleAugurGate: EN_E04_BIRDFOLK_GALE_AUGUR_GATE.id,
    approvedPrecedingGate: EN_E04_BIRDFOLK_AERIE_SCOUT_GATE.id,
    approvedSourceMotion: sourceResult.motion,
    role: EN_E04_BIRDFOLK_GALE_AUGUR_CONTRACT.role,
    anatomy: EN_E04_BIRDFOLK_GALE_AUGUR_CONTRACT.chassis,
    upperBody: 'approved-beaked-crest-and-wing-arms-with-connected-storm-cowl-circlet-mantle-and-sky-rune',
    lowerBody: 'approved-two-digitigrade-legs-with-connected-three-pronged-talons-and-tail-fan',
    motion: args.animation.id === 'cast'
      ? 'exact-cast-alias-of-gale-augur-attack'
      : args.animation.id === 'death'
        ? 'exact-death-alias-of-gale-augur-hurt'
        : phase.name,
    effectBoundary: EN_E04_BIRDFOLK_GALE_AUGUR_DATA.effectBoundary,
  });
}

export const EN_E04_BIRDFOLK_GALE_AUGUR_RENDERER = Object.freeze({
  key: 'en-e04-birdfolk-gale-augur-full-v1',
  chassis: EN_E04_BIRDFOLK_GALE_AUGUR_CONTRACT.chassis,
  render: renderGaleAugur,
});

export const EN_E04_BIRDFOLK_GALE_AUGUR_FAMILY = deepFreeze({
  id: 'birdfolk',
  name: 'Birdfolk',
  sliceId: 'EN-E04',
  rendererKey: EN_E04_BIRDFOLK_GALE_AUGUR_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [GALE_AUGUR_VARIANT],
  rendererData: {
    approvedPrecedingGate: EN_E04_BIRDFOLK_AERIE_SCOUT_GATE.id,
    activeGate: EN_E04_BIRDFOLK_GALE_AUGUR_GATE.id,
  },
  review: {
    baselineVariant: 'gale-augur',
    scale: 6,
    notes: 'Awaiting paired visual approval for one complete Birdfolk Gale Augur specialist; internal, non-public, and effect-free.',
  },
});

export const EN_E04_BIRDFOLK_GALE_AUGUR_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E04_BIRDFOLK_GALE_AUGUR_RENDERER],
  families: [EN_E04_BIRDFOLK_GALE_AUGUR_FAMILY],
});
