import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E04_BIRDFOLK_GALE_AUGUR_CONTRACT,
  EN_E04_BIRDFOLK_GALE_AUGUR_DATA,
  EN_E04_BIRDFOLK_GALE_AUGUR_GATE,
  EN_E04_BIRDFOLK_GALE_AUGUR_RENDERER,
} from './enemy-expansion-en-e04-birdfolk-gale-augur.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E04_BIRDFOLK_STORMCROWN_EXARCH_CONTRACT = deepFreeze({
  family: 'birdfolk',
  variant: 'stormcrown-exarch',
  role: 'elite',
  state: 'implemented-complete-motion-candidate',
  chassis: EN_E04_BIRDFOLK_GALE_AUGUR_CONTRACT.chassis,
  silhouette: 'The approved upright Gale Augur avian silhouette remains complete beneath a connected three-point storm crown, gold brow guard, royal shoulder mantle, armored forewing bands, and central lightning sigil. The beaked head, shoulder-rooted wing-arms, two digitigrade talon legs, and connected tail fan remain readable in every direction without human hair, a human face, ordinary boots, floating regalia islands, or exposed-human Harpy anatomy.',
  identity: 'Iron-slate plumage, near-black flight feathers, ivory throat, crimson royal mantle, gold crown and wing armor, bright cyan lightning marks, white-blue eyes, and a burnished beak and talons distinguish the Stormcrown Exarch elite from specialist Gale Augur.',
  effectBoundary: 'Lightning coronas, thunder halos, storm arcs, pressure waves, feather spirals, dust puffs, air blades, and impact effects remain external.',
});

export const EN_E04_BIRDFOLK_STORMCROWN_EXARCH_GATE = deepFreeze({
  id: 'en-e04-birdfolk-stormcrown-exarch-full-v1',
  status: 'approved',
  authorizedOn: '2026-08-09',
  authorizationEvidence: 'After approving, publishing, and reconciling the complete Birdfolk Gale Augur specialist, the designer said: lets do next. The documented Birdfolk role order advances from specialist to elite; because the live plan did not pre-name that role, Codex named and bounded exactly one complete 80-frame Birdfolk Stormcrown Exarch elite enemy.',
  approvedOn: '2026-08-09',
  approvalEvidence: 'After reviewing the exact hash-frozen raw/no-outline and Complete B + Form Stormcrown Exarch pair and asking when the new enemies would enter the assembler, the designer approved the proposed three-gate sequence by saying: sure lets do 123. This authorizes bounded Stormcrown publication followed by separate EN-E04 registration and consumer-integration checkpoints.',
  precedingApproval: {
    gateId: EN_E04_BIRDFOLK_GALE_AUGUR_GATE.id,
    artifactSha256: EN_E04_BIRDFOLK_GALE_AUGUR_GATE.artifactSha256,
    assembledArtifactSha256: EN_E04_BIRDFOLK_GALE_AUGUR_GATE.assembledArtifactSha256,
    rawAnimationSha256: EN_E04_BIRDFOLK_GALE_AUGUR_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E04_BIRDFOLK_GALE_AUGUR_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E04_BIRDFOLK_GALE_AUGUR_GATE.candidateFrameDigest,
    publishedCheckpoint: 'ad57f25d47415625540ea36ff16d2a884a421576',
    publishedHandoff: 'aaf59dff8a14226bd46edbe48979dd2eb87c3faa',
  },
  artifact: 'enemy-expansion-review/en-e04-birdfolk-stormcrown-exarch/en-e04-birdfolk-stormcrown-exarch-full-suite-raw.png',
  artifactSha256: '94937293130da44fe99b3681330a7807da63dc936ff76586c6647d42e5d41f42',
  assembledArtifact: 'enemy-expansion-review/en-e04-birdfolk-stormcrown-exarch/en-e04-birdfolk-stormcrown-exarch-full-suite-complete-b-form.png',
  assembledArtifactSha256: '20f5119159b9440be3f84b65a0b41c88ff3253fffeda3aac65d372ac8c027a18',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e04-birdfolk-stormcrown-exarch/en-e04-birdfolk-stormcrown-exarch-full-suite-four-directions-labeled.gif',
      sha256: '52eb71a4bffab666cfc006b047f2e51b350be3115cafdcf06e44f3e2cb529498',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e04-birdfolk-stormcrown-exarch/en-e04-birdfolk-stormcrown-exarch-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: 'ad11fbfd1533d29e79b0033b565db510f0a3dba54f49a75130a76dccaad3daac',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
  },
  candidateFrameDigest: '9e7a7c5e29e1918bf1078bcd4823680ff4243beeaa2e90b8d27689d0c3af9fa1',
  scope: 'One complete 80-frame Birdfolk Stormcrown Exarch elite enemy across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Every frame preserves the approved Gale Augur anatomy, alpha footprint, and full-body motion beneath connected elite regalia. The storm crown, brow guard, royal mantle, armored forewing bands, and lightning sigil follow the approved breath, four-step gait, wing-and-talon rake, and complete-silhouette recoil. Cast aliases Attack exactly and Death aliases Hurt H1,H2,H2,H2.',
  anatomyContract: EN_E04_BIRDFOLK_STORMCROWN_EXARCH_CONTRACT.silhouette,
  reviewPresentation: 'Show the exact labeled all-four-direction Birdfolk Stormcrown Exarch full-suite raw/no-outline and Complete B + Form boards and GIFs together. The four GIF phases display Idle, Walk, Attack, Cast, Hurt, and Death simultaneously.',
  exclusions: [
    'approved Gale Augur source module and pixels',
    'additional Birdfolk variants',
    'new Cast pixels',
    'new Death pixels',
    'baked lightning-corona pixels',
    'baked thunder-halo pixels',
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
  nextGate: 'Bounded commit, push, and publication of this exact ten-file Stormcrown Exarch lane are authorized. After clean publication, the designer separately authorizes one complete EN-E04 registration checkpoint followed by one complete assembler consumer-integration checkpoint; those later gates must preserve this approved candidate exactly.',
});

export const EN_E04_BIRDFOLK_STORMCROWN_EXARCH_DATA = deepFreeze({
  actor: {
    species: 'human',
    bodyBuild: 'broad',
    skin: 'pale',
    hairStyle: 'short',
    hairColor: 'black',
    expression: 'stern',
    faceDetail: 'none',
    headgear: 'crown',
    outfit: 'plate',
    outfitColor: 'gold',
    outfitTier: 'tier3',
    weapon: 'none',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: ['#4b536f', '#262b40'],
      hair: ['#30364e', '#171b2c'],
      outfit: ['#42c4dd', '#1d7186', '#d4a84b'],
    },
  },
  birdfolk: {
    plumage: ['#4b536f', '#262b40', '#8792b8'],
    flight: ['#30364e', '#171b2c', '#626f99'],
    throat: ['#e6dfc8', '#9e967d', '#fff5d5'],
    storm: ['#8f3f61', '#55253a', '#d76d95'],
    silver: ['#d4a84b', '#78551f', '#ffe17b'],
    sky: ['#42c4dd', '#1d7186', '#a8f5ff'],
    beak: ['#d68e35', '#804a1f', '#ffc767'],
    eye: ['#eefcff', '#243246'],
  },
  effectBoundary: 'external-lightning-coronas-thunder-halos-storm-arcs-pressure-waves-feather-spirals-dust-puffs-air-blades-and-impacts',
  bakedEffects: [],
});

const STORMCROWN_EXARCH_VARIANT = deepFreeze({
  id: 'stormcrown-exarch',
  name: 'Stormcrown Exarch',
  role: EN_E04_BIRDFOLK_STORMCROWN_EXARCH_CONTRACT.role,
  status: EN_E04_BIRDFOLK_STORMCROWN_EXARCH_CONTRACT.state,
  brief: 'Elite Birdfolk storm commander preserving the approved upright avian chassis beneath iron-slate plumage, a crimson royal mantle, connected gold storm crown and forewing armor, a cyan lightning sigil, white-blue eyes, and external thunder effects.',
  rendererData: EN_E04_BIRDFOLK_STORMCROWN_EXARCH_DATA,
});

const SOURCE_VARIANT = deepFreeze({ id: 'gale-augur' });
const DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);
const MOTION_PHASES = deepFreeze({
  idle: [
    { name: 'exarch-command-breath', forward: 0, lift: 0, upperBob: 0 },
    { name: 'stormcrown-settle', forward: 0, lift: 0, upperBob: 1 },
  ],
  walk: [
    { name: 'left-talon-command-step', forward: 0, lift: 0, upperBob: 0 },
    { name: 'royal-mantle-compress', forward: 0, lift: 0, upperBob: 1 },
    { name: 'right-talon-command-step', forward: 0, lift: 0, upperBob: 0 },
    { name: 'exarch-recover', forward: 0, lift: 0, upperBob: 0 },
  ],
  attack: [
    { name: 'armored-mantle-brace', forward: -1, lift: 0, upperBob: 0 },
    { name: 'stormcrown-rise', forward: 0, lift: -1, upperBob: 0 },
    { name: 'thunder-talon-rake', forward: 1, lift: 0, upperBob: 0 },
    { name: 'command-recover', forward: 0, lift: 0, upperBob: 1 },
  ],
  hurt: [
    { name: 'white-exarch-recoil', forward: -1, lift: 0, upperBob: 0 },
    { name: 'armored-mantle-recovery', forward: 0, lift: 0, upperBob: 1 },
  ],
});

function buildPaletteMap() {
  const source = EN_E04_BIRDFOLK_GALE_AUGUR_DATA.birdfolk;
  const target = EN_E04_BIRDFOLK_STORMCROWN_EXARCH_DATA.birdfolk;
  const pairs = [
    [source.plumage, target.plumage],
    [source.flight, target.flight],
    [source.throat, target.throat],
    [source.storm, target.storm],
    [source.silver, target.silver],
    [source.sky, target.sky],
    [source.beak, target.beak],
    [source.eye, target.eye],
  ];
  const entries = [];
  for (const [from, to] of pairs) {
    assert(from.length === to.length, 'Stormcrown Exarch palette maps must preserve source ramp lengths.');
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
    assert([x, y, width, height].every(Number.isInteger) && width > 0 && height > 0, 'Stormcrown Exarch regalia must use positive integer geometry.');
    context.fillStyle = flash ? '#ffffff' : fill;
    context.fillRect((mirrored ? SIZE - x - width : x) + shift.x, y + shift.y, width, height);
  };
  return { view, rect, dot: (x, y, fill) => rect(x, y, 1, 1, fill) };
}

function drawStormcrownExarchRegalia(context, direction, phase, flash) {
  const { storm, silver, sky } = EN_E04_BIRDFOLK_STORMCROWN_EXARCH_DATA.birdfolk;
  const paint = createOverlayPainter(context, direction, phase, flash);
  const bob = phase.upperBob;
  if (paint.view === 'right') {
    paint.rect(9, 4 + bob, 2, 4, storm[1]);
    paint.rect(9, 4 + bob, 2, 1, silver[1]);
    paint.dot(10, 3 + bob, silver[2]);
    paint.rect(12, 4 + bob, 5, 1, silver[0]);
    paint.dot(15, 4 + bob, sky[2]);
    paint.rect(8, 9 + bob, 2, 4, storm[0]);
    paint.rect(8, 9 + bob, 2, 1, silver[1]);
    paint.rect(9, 12 + bob, 3, 2, storm[1]);
    paint.rect(10, 10 + bob, 3, 1, silver[0]);
    paint.dot(13, 11 + bob, sky[2]);
    paint.rect(10, 14 + bob, 3, 1, silver[1]);
    return;
  }
  paint.rect(8, 3 + bob, 2, 2, storm[1]);
  paint.rect(14, 3 + bob, 2, 2, storm[1]);
  paint.dot(9, 2 + bob, silver[2]);
  paint.dot(14, 2 + bob, silver[2]);
  paint.rect(9, 4 + bob, 6, 1, silver[0]);
  paint.dot(12, 4 + bob, sky[2]);
  paint.rect(7, 9 + bob, 2, 4, storm[0]);
  paint.rect(15, 9 + bob, 2, 4, storm[0]);
  paint.rect(7, 9 + bob, 2, 1, silver[1]);
  paint.rect(15, 9 + bob, 2, 1, silver[1]);
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

function renderStormcrownExarch(args) {
  assert(args.family.id === 'birdfolk', 'The EN-E04 Stormcrown Exarch renderer is restricted to Birdfolk.');
  assert(args.variant.id === 'stormcrown-exarch', 'The EN-E04 Stormcrown Exarch renderer is restricted to Stormcrown Exarch.');
  const frameCounts = { idle: 2, walk: 4, attack: 4, cast: 4, hurt: 2, death: 4 };
  const frameCount = frameCounts[args.animation.id];
  assert(frameCount !== undefined, 'The Stormcrown Exarch gate authorizes only Idle, Walk, Attack, Cast, Hurt, and Death.');
  assert(Number.isInteger(args.frame) && args.frame >= 0 && args.frame < frameCount, 'The Stormcrown Exarch frame is outside the authorized animation contract.');

  const source = resolveSource(args.animation.id, args.frame);
  const phase = MOTION_PHASES[source.animation][source.frame];
  const sourceResult = EN_E04_BIRDFOLK_GALE_AUGUR_RENDERER.render({
    ...args,
    variant: SOURCE_VARIANT,
    animation: { ...args.animation, id: source.animation },
    frame: source.frame,
    context: createPaletteMappedContext(args.context),
  });
  const flash = source.animation === 'hurt' && source.frame === 0;
  drawStormcrownExarchRegalia(args.context, args.direction, phase, flash);

  return Object.freeze({
    family: args.family.id,
    variant: args.variant.id,
    direction: args.direction,
    animation: args.animation.id,
    frame: args.frame,
    renderedAnimation: source.animation,
    renderedFrame: source.frame,
    birdfolkStormcrownExarchGate: EN_E04_BIRDFOLK_STORMCROWN_EXARCH_GATE.id,
    approvedPrecedingGate: EN_E04_BIRDFOLK_GALE_AUGUR_GATE.id,
    approvedSourceMotion: sourceResult.motion,
    role: EN_E04_BIRDFOLK_STORMCROWN_EXARCH_CONTRACT.role,
    anatomy: EN_E04_BIRDFOLK_STORMCROWN_EXARCH_CONTRACT.chassis,
    upperBody: 'approved-beaked-crest-and-wing-arms-with-connected-three-point-storm-crown-gold-brow-guard-royal-mantle-armored-forewing-bands-and-lightning-sigil',
    lowerBody: 'approved-two-digitigrade-legs-with-connected-three-pronged-talons-and-tail-fan',
    motion: args.animation.id === 'cast'
      ? 'exact-cast-alias-of-stormcrown-exarch-attack'
      : args.animation.id === 'death'
        ? 'exact-death-alias-of-stormcrown-exarch-hurt'
        : phase.name,
    effectBoundary: EN_E04_BIRDFOLK_STORMCROWN_EXARCH_DATA.effectBoundary,
  });
}

export const EN_E04_BIRDFOLK_STORMCROWN_EXARCH_RENDERER = Object.freeze({
  key: 'en-e04-birdfolk-stormcrown-exarch-full-v1',
  chassis: EN_E04_BIRDFOLK_STORMCROWN_EXARCH_CONTRACT.chassis,
  render: renderStormcrownExarch,
});

export const EN_E04_BIRDFOLK_STORMCROWN_EXARCH_FAMILY = deepFreeze({
  id: 'birdfolk',
  name: 'Birdfolk',
  sliceId: 'EN-E04',
  rendererKey: EN_E04_BIRDFOLK_STORMCROWN_EXARCH_RENDERER.key,
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  variants: [STORMCROWN_EXARCH_VARIANT],
  rendererData: {
    approvedPrecedingGate: EN_E04_BIRDFOLK_GALE_AUGUR_GATE.id,
    activeGate: EN_E04_BIRDFOLK_STORMCROWN_EXARCH_GATE.id,
  },
  review: {
    baselineVariant: 'stormcrown-exarch',
    scale: 6,
    notes: 'Awaiting paired visual approval for one complete Birdfolk Stormcrown Exarch elite; internal, non-public, and effect-free.',
  },
});

export const EN_E04_BIRDFOLK_STORMCROWN_EXARCH_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E04_BIRDFOLK_STORMCROWN_EXARCH_RENDERER],
  families: [EN_E04_BIRDFOLK_STORMCROWN_EXARCH_FAMILY],
});
