import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import { EN_E05_REVENANT_GATE } from './enemy-expansion-en-e05-revenant.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

export const EN_E05_LICH_CONTRACT = deepFreeze({
  sliceId: 'EN-E05',
  family: 'lich',
  variant: 'soul-regent',
  role: 'elite',
  state: 'implemented-complete-motion-candidate',
  chassis: 'crowned-reliquary-undead',
  silhouette: 'A jagged reliquary crown, exposed skull mask, wide ritual mantle, hanging bone hands, narrow ribbed waist, long split robes, and a connected gem-tipped staff create a tall elite Lich silhouette. Every frame remains one connected hard-alpha actor with one-cell margins.',
  identity: 'Cold ivory bone, deep violet robes, teal reliquary lining, oxidized gold, dark staff wood, a sea-green soul gem, black skull cavities, and two mint oathfire eyes distinguish the Soul Regent from the approved armored Revenant and every earlier EN-E05 undead.',
  effectBoundary: 'Soul flame, orbiting runes, spectral chains, projectiles, aura rings, teleport afterimages, grave fog, staff trails, impacts, floating pages, and detached robe wisps remain external.',
});

export const EN_E05_LICH_GATE = deepFreeze({
  id: 'en-e05-lich-soul-regent-full-v1',
  status: 'acceptance-candidate',
  authorizedOn: '2026-08-09',
  authorizationEvidence: 'After approving and publishing the complete Revenant, the designer replied: cool lets do next. This authorized one separate complete Lich candidate under the established one-full-sprite cadence.',
  precedingApproval: {
    gateId: EN_E05_REVENANT_GATE.id,
    artifactSha256: EN_E05_REVENANT_GATE.artifactSha256,
    assembledArtifactSha256: EN_E05_REVENANT_GATE.assembledArtifactSha256,
    rawAnimationSha256: EN_E05_REVENANT_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E05_REVENANT_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E05_REVENANT_GATE.candidateFrameDigest,
    publishedImplementation: '7434578d5af8f3e7355add884cf0d33e3f312288',
    publishedHandoff: '97db37e151e04f42367c517955c88826c4ed7f51',
  },
  artifact: 'enemy-expansion-review/en-e05-lich/en-e05-lich-soul-regent-full-suite-raw.png',
  artifactSha256: 'd1b59e29d6881c2556a786cd0c4bd8017c34a5076a6b687798cef6cd7045519e',
  assembledArtifact: 'enemy-expansion-review/en-e05-lich/en-e05-lich-soul-regent-full-suite-complete-b-form.png',
  assembledArtifactSha256: '137c89638cb4d23de02de5fe7f72b8fddddf8cdad1f707d91812a79686e928b6',
  comparisonArtifact: 'enemy-expansion-review/en-e05-lich/en-e05-lich-revenant-comparison.png',
  comparisonArtifactSha256: 'c9ead47d3bf489ed0cc4af38e8c75d5eacf74c75f3628876fa70901e9d755fa9',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e05-lich/en-e05-lich-soul-regent-full-suite-four-directions-labeled.gif',
      sha256: '0a851b281dc3a59bd888000dac8f4389d3a0b7ea9163df7157d64b94a23d11bf',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e05-lich/en-e05-lich-soul-regent-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '3d72223b59b9ec670809bca358b5d8f697e49d75315c0daf91b0da4526d10280',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 720,
    },
  },
  candidateFrameDigest: '236afeccc237ba347a8f4929ac5743d3275abf60defb86d2705f39475bde2a01',
  revenantComparisonDigest: EN_E05_REVENANT_GATE.candidateFrameDigest,
  scope: 'One complete 80-frame Lich Soul Regent elite enemy across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle uses sealed ritual stillness and a reliquary pulse. Walk is a four-phase grave glide with robe compression, alternating hem drift, and staff settle. Attack gathers through the staff, raises crown and reliquary together, commits to a full-body staff decree, and recovers into the robe column. Hurt uses a complete white soul rupture and colored phylactery reform. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact approved-Revenant versus Lich comparison plus the labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards and GIFs together.',
  exclusions: [
    'approved Revenant source module or pixels',
    'approved Vampire source module or pixels',
    'approved Mummy source module or pixels',
    'approved Ghoul source module or pixels',
    'public Lich registration',
    'public catalog exposure',
    'asset-pack fixture generation or regeneration',
    'additional Lich variants',
    'new Cast pixels',
    'new Death pixels',
    'soul flame',
    'orbiting runes',
    'spectral chains',
    'projectiles',
    'aura rings',
    'teleport afterimages',
    'grave fog',
    'staff trails',
    'impacts',
    'floating pages',
    'detached robe wisps',
    'effects',
    'release',
    'EN-E05 registration',
    'Wave 2',
    'later expansion work',
  ],
  nextGate: 'Stop for explicit designer review of the exact Revenant comparison plus raw and Complete B + Form Lich evidence. Do not publish, register, generate fixtures, or begin EN-E05 registration or Wave 2 before approval.',
});

const COLORS = deepFreeze({
  bone: ['#ded9c4', '#8f8977'],
  robe: ['#57456f', '#2b243d'],
  lining: ['#39777a', '#20464e'],
  gold: ['#c7a45b', '#725a32'],
  staff: ['#806a58', '#45372f'],
  gem: ['#69dac1', '#2b8379'],
  eye: '#92ffdc',
  cavity: '#1b1728',
  flash: '#f4f4f4',
});

export const EN_E05_LICH_DATA = deepFreeze({
  actor: {
    species: 'undead',
    bodyBuild: 'lean',
    skin: 'pale',
    hairStyle: 'bald',
    hairColor: 'gray',
    expression: 'stern',
    faceDetail: 'none',
    headgear: 'crown',
    outfit: 'robe',
    outfitColor: 'purple',
    outfitTier: 'tier3',
    weapon: 'none',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.bone,
      hair: [COLORS.cavity, COLORS.gold[1]],
      outfit: [COLORS.robe[0], COLORS.robe[1], COLORS.lining[0]],
    },
  },
  lich: COLORS,
  effectBoundary: 'external-soul-flame-orbiting-runes-spectral-chains-projectiles-aura-rings-teleport-afterimages-grave-fog-staff-trails-impacts-floating-pages-and-detached-robe-wisps',
  bakedEffects: [],
});

const LICH_SOUL_REGENT_VARIANT = deepFreeze({
  id: 'soul-regent',
  name: 'Soul Regent',
  role: EN_E05_LICH_CONTRACT.role,
  status: EN_E05_LICH_CONTRACT.state,
  brief: 'A complete elite Lich: jagged crown, skull mask, wide mantle, reliquary robes, hanging bone hands, connected gem staff, and one full standard motion suite.',
  rendererData: EN_E05_LICH_DATA,
});

export const EN_E05_LICH_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const IDLE_PHASES = deepFreeze([
  { name: 'sealed-ritual-stillness', bob: 0, stride: 0, sway: 0, reach: 0, crouch: 0, pose: 'guard', flash: false },
  { name: 'reliquary-pulse', bob: 1, stride: 0, sway: 1, reach: 0, crouch: 0, pose: 'guard', flash: false },
]);

const WALK_PHASES = deepFreeze([
  { name: 'left-grave-glide', bob: 0, stride: -1, sway: -1, reach: 0, crouch: 0, pose: 'glide', flash: false },
  { name: 'veil-compression', bob: 1, stride: 0, sway: 0, reach: 0, crouch: 1, pose: 'glide', flash: false },
  { name: 'right-grave-glide', bob: 0, stride: 1, sway: 1, reach: 0, crouch: 0, pose: 'glide', flash: false },
  { name: 'staff-and-hem-drift', bob: 1, stride: 0, sway: 1, reach: 0, crouch: 0, pose: 'drift', flash: false },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'soul-reliquary-gather', bob: 1, stride: 0, sway: -1, reach: 0, crouch: 1, pose: 'gather', flash: false },
  { name: 'crown-and-staff-ascent', bob: 0, stride: -1, sway: 1, reach: 0, crouch: 0, pose: 'raise', flash: false },
  { name: 'full-body-soul-decree', bob: 0, stride: 1, sway: 1, reach: 1, crouch: 0, pose: 'decree', flash: false },
  { name: 'sepulchral-recover', bob: 1, stride: 0, sway: 0, reach: 0, crouch: 1, pose: 'recover', flash: false },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-soul-rupture', bob: 0, stride: -1, sway: -1, reach: -1, crouch: 1, pose: 'recoil', flash: true },
  { name: 'colored-phylactery-reform', bob: 1, stride: 0, sway: 1, reach: 0, crouch: 1, pose: 'brace', flash: false },
]);

function phaseFor(animation, frame) {
  if (animation === 'idle') return IDLE_PHASES[frame];
  if (animation === 'walk') return WALK_PHASES[frame];
  if (animation === 'attack' || animation === 'cast') return ATTACK_PHASES[frame];
  if (animation === 'hurt') return HURT_PHASES[frame];
  if (animation === 'death') return HURT_PHASES[EN_E05_LICH_DEATH_SOURCE_FRAMES[frame]];
  throw new TypeError(`Unsupported Lich animation ${animation}.`);
}

function mirroredContext(context) {
  let fillStyle = context.fillStyle;
  return {
    get fillStyle() { return fillStyle; },
    set fillStyle(value) {
      fillStyle = value;
      context.fillStyle = value;
    },
    onOutOfBounds(write) {
      if (typeof context.onOutOfBounds === 'function') context.onOutOfBounds({ ...write, x: SIZE - 1 - write.x });
    },
    clearRect(x, y, width, height) {
      context.clearRect(SIZE - x - width, y, width, height);
    },
    fillRect(x, y, width, height) {
      context.fillStyle = fillStyle;
      context.fillRect(SIZE - x - width, y, width, height);
    },
  };
}

function painter(context, phase) {
  const color = (value) => phase.flash ? COLORS.flash : value;
  const pixel = (x, y, fill) => {
    context.fillStyle = color(fill);
    context.fillRect(x, y, 1, 1);
  };
  const rect = (x, y, width, height, fill) => {
    context.fillStyle = color(fill);
    context.fillRect(x, y, width, height);
  };
  return { pixel, rect };
}

function drawFrontHem(paint, phase) {
  const left = 7 + (phase.sway < 0 ? -1 : phase.stride > 0 ? 1 : 0);
  const right = 17 + (phase.sway > 0 ? 1 : phase.stride < 0 ? -1 : 0);
  paint.rect(left, 14 + phase.crouch, right - left + 1, 7, COLORS.robe[1]);
  paint.rect(9, 14 + phase.crouch, 7, 7, COLORS.robe[0]);
  paint.rect(8, 18 + phase.crouch, 4, 1, COLORS.lining[0]);
  paint.rect(8, 19 + phase.crouch, 4, 1, COLORS.lining[1]);
  paint.rect(9, 20 + phase.crouch, 3, 1, COLORS.lining[1]);
  paint.rect(10, 21 + phase.crouch, 2, 1, COLORS.lining[1]);
  paint.rect(13, 18 + phase.crouch, 5, 1, COLORS.robe[0]);
  paint.rect(13, 19 + phase.crouch, 4, 1, COLORS.robe[0]);
  paint.rect(14, 20 + phase.crouch, 4, 1, COLORS.robe[0]);
  paint.rect(15, 21 + phase.crouch, 3, 1, COLORS.robe[0]);
  paint.pixel(left, 21 + phase.crouch, COLORS.gold[1]);
  paint.pixel(right, 20 + phase.crouch, COLORS.lining[0]);
}

function drawFrontArmsAndStaff(paint, phase, rear = false) {
  const farBone = rear ? COLORS.bone[1] : COLORS.bone[0];
  if (phase.pose === 'gather') {
    paint.rect(5, 10, 4, 4, COLORS.robe[1]);
    paint.rect(4, 13, 3, 4, farBone);
    paint.rect(15, 10, 4, 4, COLORS.robe[0]);
    paint.rect(17, 13, 3, 4, COLORS.bone[0]);
    paint.rect(3, 5, 2, 16, COLORS.staff[1]);
    paint.rect(2, 3, 4, 4, COLORS.gold[1]);
    paint.rect(3, 3, 2, 3, COLORS.gem[1]);
    paint.pixel(4, 2, COLORS.gem[0]);
    return;
  }
  if (phase.pose === 'raise') {
    paint.rect(5, 7, 4, 4, COLORS.robe[1]);
    paint.rect(4, 5, 3, 4, farBone);
    paint.rect(15, 7, 4, 4, COLORS.robe[0]);
    paint.rect(17, 5, 3, 4, COLORS.bone[0]);
    paint.rect(4, 3, 18, 2, COLORS.staff[1]);
    paint.rect(2, 2, 4, 4, COLORS.gold[1]);
    paint.rect(3, 2, 2, 3, COLORS.gem[1]);
    paint.pixel(3, 1, COLORS.gem[0]);
    return;
  }
  if (phase.pose === 'decree') {
    paint.rect(5, 10, 4, 4, COLORS.robe[1]);
    paint.rect(6, 12, 4, 3, farBone);
    paint.rect(15, 9, 5, 4, COLORS.robe[0]);
    paint.rect(17, 11, 4, 3, COLORS.bone[0]);
    paint.rect(3, 11, 19, 2, COLORS.staff[0]);
    paint.rect(2, 9, 4, 5, COLORS.gold[1]);
    paint.rect(3, 10, 2, 3, COLORS.gem[1]);
    paint.pixel(2, 10, COLORS.gem[0]);
    return;
  }
  if (phase.pose === 'recoil') {
    paint.rect(4, 10, 5, 4, COLORS.robe[1]);
    paint.rect(3, 13, 4, 4, farBone);
    paint.rect(15, 11, 5, 4, COLORS.robe[0]);
    paint.rect(18, 14, 3, 4, COLORS.bone[0]);
    paint.rect(2, 14, 7, 2, COLORS.staff[1]);
    paint.rect(2, 13, 3, 4, COLORS.gold[1]);
    paint.pixel(3, 14, COLORS.gem[0]);
    return;
  }
  const drift = phase.pose === 'drift' || phase.pose === 'recover';
  const leftY = 10 + phase.bob + (phase.sway > 0 ? -1 : 0);
  const rightY = 10 + phase.bob + (phase.sway < 0 ? -1 : 0);
  paint.rect(5, leftY, 4, 4, COLORS.robe[1]);
  paint.rect(4, leftY + 3, 3, 4, farBone);
  paint.pixel(4, leftY + 6, COLORS.gold[1]);
  paint.rect(15, rightY, 4, 4, COLORS.robe[0]);
  paint.rect(17, rightY + 3, 3, 4, COLORS.bone[0]);
  paint.rect(18, rightY + 4, 3, 2, COLORS.gold[0]);
  const staffX = drift ? 19 : 20;
  paint.rect(staffX, 5 + phase.crouch, 2, 16, COLORS.staff[1]);
  paint.rect(staffX - 1, 3 + phase.crouch, 4, 4, COLORS.gold[1]);
  paint.rect(staffX, 3 + phase.crouch, 2, 3, COLORS.gem[1]);
  paint.pixel(staffX + 1, 2 + phase.crouch, COLORS.gem[0]);
}

function drawDown(context, phase) {
  const paint = painter(context, phase);
  const settle = phase.bob + phase.crouch;
  drawFrontHem(paint, phase);
  paint.rect(7, 8 + settle, 10, 9, COLORS.robe[1]);
  paint.rect(9, 9 + settle, 6, 7, COLORS.robe[0]);
  paint.rect(9, 12 + settle, 6, 4, COLORS.lining[0]);
  paint.rect(10, 13 + settle, 4, 3, COLORS.lining[1]);
  paint.pixel(12, 11 + settle, COLORS.gem[0]);
  paint.pixel(12, 12 + settle, COLORS.gold[0]);
  paint.rect(5, 7 + settle, 5, 4, COLORS.robe[0]);
  paint.pixel(5, 7 + settle, COLORS.gold[1]);
  paint.rect(14, 7 + settle, 5, 4, COLORS.robe[1]);
  paint.pixel(18, 7 + settle, COLORS.gold[0]);
  drawFrontArmsAndStaff(paint, phase);
  paint.rect(9, 4 + settle, 7, 6, COLORS.bone[0]);
  paint.rect(10, 5 + settle, 5, 4, COLORS.cavity);
  paint.rect(10, 8 + settle, 5, 2, COLORS.bone[1]);
  paint.rect(9, 2 + settle, 7, 2, COLORS.gold[1]);
  paint.pixel(10, 1 + settle, COLORS.gold[0]);
  paint.pixel(12, 1 + settle, COLORS.gold[0]);
  paint.pixel(14, 1 + settle, COLORS.gold[0]);
  paint.pixel(10, 6 + settle, COLORS.eye);
  paint.pixel(14, 6 + settle, COLORS.eye);
  paint.pixel(12, 9 + settle, COLORS.gold[1]);
}

function drawUp(context, phase) {
  const paint = painter(context, phase);
  const settle = phase.bob + phase.crouch;
  drawFrontHem(paint, phase);
  paint.rect(7, 8 + settle, 10, 9, COLORS.robe[1]);
  paint.rect(9, 9 + settle, 6, 7, COLORS.robe[0]);
  paint.rect(9, 12 + settle, 6, 4, COLORS.lining[1]);
  paint.pixel(12, 11 + settle, COLORS.gem[1]);
  paint.rect(5, 7 + settle, 5, 4, COLORS.robe[0]);
  paint.pixel(5, 7 + settle, COLORS.gold[1]);
  paint.rect(14, 7 + settle, 5, 4, COLORS.robe[1]);
  paint.pixel(18, 7 + settle, COLORS.gold[0]);
  drawFrontArmsAndStaff(paint, phase, true);
  paint.rect(9, 4 + settle, 7, 6, COLORS.robe[1]);
  paint.rect(10, 5 + settle, 5, 4, COLORS.lining[1]);
  paint.rect(10, 8 + settle, 5, 2, COLORS.robe[0]);
  paint.rect(9, 2 + settle, 7, 2, COLORS.gold[1]);
  paint.pixel(10, 1 + settle, COLORS.gold[0]);
  paint.pixel(12, 1 + settle, COLORS.gold[0]);
  paint.pixel(14, 1 + settle, COLORS.gold[0]);
  paint.pixel(12, 6 + settle, COLORS.gem[1]);
}

function drawSideHem(paint, phase) {
  const back = 7 + (phase.sway < 0 ? -1 : phase.stride > 0 ? 1 : 0);
  const front = 17 + (phase.sway > 0 ? 1 : phase.stride < 0 ? -1 : 0);
  paint.rect(back, 14 + phase.crouch, front - back + 1, 7, COLORS.robe[1]);
  paint.rect(10, 14 + phase.crouch, 8, 7, COLORS.robe[0]);
  paint.rect(back, 18 + phase.crouch, 5, 1, COLORS.lining[0]);
  paint.rect(back, 19 + phase.crouch, 4, 1, COLORS.lining[1]);
  paint.rect(back + 1, 20 + phase.crouch, 3, 1, COLORS.lining[1]);
  paint.rect(back + 2, 21 + phase.crouch, 2, 1, COLORS.lining[1]);
  paint.pixel(back, 21 + phase.crouch, COLORS.gold[1]);
  paint.pixel(front, 20 + phase.crouch, COLORS.lining[0]);
}

function drawSideArmsAndStaff(paint, phase) {
  if (phase.pose === 'gather') {
    paint.rect(7, 11, 5, 4, COLORS.robe[1]);
    paint.rect(6, 14, 4, 3, COLORS.bone[1]);
    paint.rect(15, 10, 5, 4, COLORS.robe[0]);
    paint.rect(18, 13, 3, 4, COLORS.bone[0]);
    paint.rect(5, 5, 2, 16, COLORS.staff[1]);
    paint.rect(4, 3, 4, 4, COLORS.gold[1]);
    paint.rect(5, 3, 2, 3, COLORS.gem[1]);
    paint.pixel(6, 2, COLORS.gem[0]);
    return;
  }
  if (phase.pose === 'raise') {
    paint.rect(7, 8, 5, 4, COLORS.robe[1]);
    paint.rect(7, 5, 4, 4, COLORS.bone[1]);
    paint.rect(15, 7, 5, 4, COLORS.robe[0]);
    paint.rect(18, 5, 3, 4, COLORS.bone[0]);
    paint.rect(7, 3, 16, 2, COLORS.staff[1]);
    paint.rect(19, 2, 4, 4, COLORS.gold[1]);
    paint.rect(20, 2, 2, 3, COLORS.gem[1]);
    paint.pixel(21, 1, COLORS.gem[0]);
    return;
  }
  if (phase.pose === 'decree') {
    paint.rect(8, 11, 5, 4, COLORS.robe[1]);
    paint.rect(7, 14, 4, 3, COLORS.bone[1]);
    paint.rect(14, 9, 5, 4, COLORS.robe[0]);
    paint.rect(17, 11, 4, 3, COLORS.bone[0]);
    paint.rect(15, 11, 8, 2, COLORS.staff[0]);
    paint.rect(20, 9, 3, 5, COLORS.gold[1]);
    paint.rect(21, 10, 2, 3, COLORS.gem[1]);
    paint.pixel(22, 10, COLORS.gem[0]);
    return;
  }
  if (phase.pose === 'recoil') {
    paint.rect(7, 10, 5, 4, COLORS.robe[1]);
    paint.rect(5, 13, 4, 4, COLORS.bone[1]);
    paint.rect(15, 11, 5, 4, COLORS.robe[0]);
    paint.rect(18, 14, 3, 4, COLORS.bone[0]);
    paint.rect(3, 14, 8, 2, COLORS.staff[1]);
    paint.rect(3, 13, 3, 4, COLORS.gold[1]);
    paint.pixel(4, 14, COLORS.gem[0]);
    return;
  }
  const drift = phase.pose === 'drift' || phase.pose === 'recover';
  const farY = 11 + phase.bob + (phase.sway > 0 ? -1 : 0);
  const nearY = 10 + phase.bob + (phase.sway < 0 ? -1 : 0);
  paint.rect(7, farY, 5, 4, COLORS.robe[1]);
  paint.rect(6, farY + 3, 3, 4, COLORS.bone[1]);
  paint.rect(15, nearY, 5, 4, COLORS.robe[0]);
  paint.rect(18, nearY + 3, 3, 4, COLORS.bone[0]);
  paint.rect(18, nearY + 4, 4, 2, COLORS.gold[0]);
  const staffX = drift ? 19 : 20;
  paint.rect(staffX, 5 + phase.crouch, 2, 16, COLORS.staff[1]);
  paint.rect(staffX - 1, 3 + phase.crouch, 4, 4, COLORS.gold[1]);
  paint.rect(staffX, 3 + phase.crouch, 2, 3, COLORS.gem[1]);
  paint.pixel(staffX + 1, 2 + phase.crouch, COLORS.gem[0]);
}

function drawRight(context, phase) {
  const paint = painter(context, phase);
  const settle = phase.bob + phase.crouch;
  drawSideHem(paint, phase);
  paint.rect(8, 8 + settle, 10, 9, COLORS.robe[1]);
  paint.rect(10, 9 + settle, 8, 7, COLORS.robe[0]);
  paint.rect(11, 12 + settle, 6, 4, COLORS.lining[0]);
  paint.pixel(15, 11 + settle, COLORS.gem[0]);
  paint.rect(7, 7 + settle, 5, 4, COLORS.robe[1]);
  paint.pixel(7, 7 + settle, COLORS.gold[1]);
  paint.rect(14, 7 + settle, 6, 4, COLORS.robe[0]);
  paint.pixel(19, 7 + settle, COLORS.gold[0]);
  drawSideArmsAndStaff(paint, phase);
  const headX = 12 + phase.reach;
  paint.rect(headX, 4 + settle, 7, 6, COLORS.bone[0]);
  paint.rect(headX + 2, 5 + settle, 5, 4, COLORS.cavity);
  paint.rect(headX + 2, 8 + settle, 5, 2, COLORS.bone[1]);
  paint.rect(headX, 2 + settle, 7, 2, COLORS.gold[1]);
  paint.pixel(headX + 1, 1 + settle, COLORS.gold[0]);
  paint.pixel(headX + 3, 1 + settle, COLORS.gold[0]);
  paint.pixel(headX + 5, 1 + settle, COLORS.gold[0]);
  paint.pixel(headX + 5, 6 + settle, COLORS.eye);
  paint.pixel(headX + 4, 9 + settle, COLORS.gold[1]);
}

export function renderEnE05LichFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Lich rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), `Unsupported Lich direction ${direction}.`);
  const phase = phaseFor(animation, frame);
  assert(phase, `Lich animation ${animation} frame ${frame} is out of range.`);
  context.clearRect(0, 0, SIZE, SIZE);
  if (direction === 'down') drawDown(context, phase);
  else if (direction === 'up') drawUp(context, phase);
  else if (direction === 'right') drawRight(context, phase);
  else drawRight(mirroredContext(context), phase);
  return Object.freeze({
    family: 'lich',
    variant: 'soul-regent',
    direction,
    animation,
    frame,
    phase: phase.name,
    effectBoundary: EN_E05_LICH_DATA.effectBoundary,
  });
}

export const EN_E05_LICH_RENDERER = deepFreeze({
  key: 'en-e05-lich-soul-regent-v1',
  chassis: EN_E05_LICH_CONTRACT.chassis,
  render({ direction, animation, frame, context }) {
    return renderEnE05LichFrame(context, direction, animation.id, frame);
  },
});

export const EN_E05_LICH_FAMILY = deepFreeze({
  id: 'lich',
  name: 'Lich Review',
  sliceId: 'EN-E05',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E05_LICH_CONTRACT.chassis,
  rendererKey: EN_E05_LICH_RENDERER.key,
  variants: [LICH_SOUL_REGENT_VARIANT],
  review: {
    baselineVariant: 'soul-regent',
    scale: 8,
    notes: 'Review the complete Soul Regent suite beside the approved Revenant before any Lich registration, fixture generation, EN-E05 registration, or Wave 2 work.',
  },
});

export const EN_E05_LICH_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E05_LICH_RENDERER],
  families: [EN_E05_LICH_FAMILY],
});
