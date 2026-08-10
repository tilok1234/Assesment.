import { SIZE } from './catalogs.js';
import {
  createEnemyExpansionRegistry,
  ENEMY_EXPANSION_STATES,
} from './enemy-expansion.js';
import {
  EN_E07_DOPPELGANGER_CONTRACT_CARD,
  EN_E07_PALE_ECHO_GATE,
  renderEnE07PaleEchoFrame,
} from './enemy-expansion-en-e07-doppelganger-pale-echo.js';

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const entry of Object.values(value)) deepFreeze(entry);
  return value;
}

const COLORS = deepFreeze({
  skin: ['#cbbec2', '#91838f', '#ead9d5'],
  hair: ['#4b4558', '#2b2935', '#736a7e'],
  cloth: ['#4c6072', '#303e4c', '#74899b'],
  accent: ['#92566f', '#663a52', '#c47b96'],
  veil: ['#a9a0aa', '#756d7c', '#d0c4cd'],
  eye: '#d8eef2',
  flash: '#f4f4f4',
});

const RECOLOR = Object.freeze({
  '#c9b9b2': COLORS.skin[0],
  '#97898e': COLORS.skin[1],
  '#e3d2c5': COLORS.skin[2],
  '#514a5f': COLORS.hair[0],
  '#302d3b': COLORS.hair[1],
  '#756c82': COLORS.hair[2],
  '#596777': COLORS.cloth[0],
  '#35404f': COLORS.cloth[1],
  '#8393a2': COLORS.cloth[2],
  '#8d5368': COLORS.accent[0],
  '#63384d': COLORS.accent[1],
  '#bd7890': COLORS.accent[2],
  '#d8eef2': COLORS.eye,
  '#f4f4f4': COLORS.flash,
});

export const EN_E07_FALSEFACE_ADEPT_CONTRACT = deepFreeze({
  sliceId: 'EN-E07',
  family: 'doppelganger',
  variant: 'falseface-adept',
  role: 'specialist',
  state: 'implemented-complete-motion-candidate',
  chassis: 'diagonal-falseface-high-collar-cross-seamed-coat-twin-molding-hands-grounded-humanoid-v1',
  silhouette: 'A public-humanoid-scale authored Doppelganger specialist with a fused diagonal false-face seam, swept uneven fringe, one lifted and one folded collar point, a fitted cross-seamed short coat, two connected long-finger molding hands, separated legs, and grounded broad boots. It must remain a slim-to-medium specialist rather than a broad elite, robed caster, armored duelist, copied actor, or enlarged Pale Echo.',
  identity: 'The approved pale gray-rose, charcoal-violet, slate, and faded-wine family language is shifted through a cool fitted coat, fused two-tone visage, asymmetric collar, crossed torso seams, and paired shaping hands. The authored sheet never copies a player or public enemy and does not bake in a detached face, mirror, double, reflection, ribbon, glow, or projectile.',
  effectBoundary: EN_E07_DOPPELGANGER_CONTRACT_CARD.effectBoundary,
});

export const EN_E07_FALSEFACE_ADEPT_DATA = deepFreeze({
  actor: {
    species: 'authored-doppelganger-default',
    bodyBuild: 'slim-medium-grounded-humanoid',
    skin: 'pale-gray-rose',
    hairStyle: 'swept-uneven-fringe',
    hairColor: 'charcoal-violet',
    expression: 'diagonal-two-tone-falseface',
    faceDetail: 'fused-diagonal-visage-seam-and-offset-eyes',
    headgear: 'none',
    outfit: 'asymmetric-high-collar-cross-seamed-short-coat',
    outfitColor: 'cool-slate-and-faded-wine',
    outfitTier: 'tier2',
    weapon: 'paired-connected-molding-hands',
    weaponTier: 'none',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: COLORS.skin,
      hair: COLORS.hair,
      outfit: COLORS.cloth,
    },
  },
  falsefaceAdept: COLORS,
  alphaPolicy: 'binary-connected-diagonal-falseface-asymmetric-high-collar-cross-seamed-short-coat-twin-connected-molding-hands-separated-legs-and-grounded-boots',
  effectBoundary: 'external-copied-actors-detached-faces-mirror-doubles-reflection-planes-peeling-skin-loose-ribbons-afterimages-glow-particles-projectiles-and-impact-flashes',
  bakedEffects: [],
});

export const EN_E07_FALSEFACE_ADEPT_GATE = deepFreeze({
  id: 'en-e07-doppelganger-falseface-adept-full-v1',
  status: 'candidate',
  baseCheckpoint: 'e18a51207868cbcf5b01f55e1c04a50cac43bdcc',
  authorizedOn: '2026-08-10',
  authorizationEvidence: 'After the exact repaired Pale Echo was visually approved, committed, pushed, and reconciled at clean published checkpoint e18a51207868cbcf5b01f55e1c04a50cac43bdcc, the designer replied: approved lets do next. The frozen Doppelganger role order is common, specialist, elite, so the one-complete-sprite cadence authorizes only one private specialist Falseface Adept 80-frame candidate.',
  approvedOn: null,
  approvalEvidence: 'Pending explicit visual approval of the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, the public Cultist Zealot and Dark Elf plus approved Pale Echo comparison, paired GIF evidence, and the three exact PNG review boards opened together in Aseprite.',
  publishedImplementation: null,
  precedingApproval: {
    gateId: EN_E07_PALE_ECHO_GATE.id,
    artifactSha256: EN_E07_PALE_ECHO_GATE.artifactSha256,
    assembledArtifactSha256: EN_E07_PALE_ECHO_GATE.assembledArtifactSha256,
    comparisonArtifactSha256: EN_E07_PALE_ECHO_GATE.comparisonArtifactSha256,
    rawAnimationSha256: EN_E07_PALE_ECHO_GATE.reviewAnimations.raw.sha256,
    completeBFormAnimationSha256: EN_E07_PALE_ECHO_GATE.reviewAnimations.completeBForm.sha256,
    candidateFrameDigest: EN_E07_PALE_ECHO_GATE.candidateFrameDigest,
    publishedImplementation: EN_E07_PALE_ECHO_GATE.publishedImplementation,
    publishedApprovalRecord: EN_E07_PALE_ECHO_GATE.publishedApprovalRecord,
    initialPublishedHandoff: EN_E07_PALE_ECHO_GATE.initialPublishedHandoff,
    currentReconciliation: 'e18a51207868cbcf5b01f55e1c04a50cac43bdcc',
    reconciliationPublication: 'published',
  },
  artifact: 'enemy-expansion-review/en-e07-doppelganger-falseface-adept/en-e07-doppelganger-falseface-adept-full-suite-raw.png',
  artifactSha256: '8b22e84a20699c694ec0a3110c0c2d887baedc204194ae885e68ccee9f116e38',
  assembledArtifact: 'enemy-expansion-review/en-e07-doppelganger-falseface-adept/en-e07-doppelganger-falseface-adept-full-suite-complete-b-form.png',
  assembledArtifactSha256: 'd282af955acd012c094be7ab5607828abf91ac2a90f786dab87732293cf79203',
  comparisonArtifact: 'enemy-expansion-review/en-e07-doppelganger-falseface-adept/en-e07-doppelganger-falseface-adept-humanoid-comparison.png',
  comparisonArtifactSha256: '69e5d6d64e192ce47a793103e6e23b5d17a465d75f8fac08741893ac4a99635d',
  reviewAnimations: {
    raw: {
      artifact: 'enemy-expansion-review/en-e07-doppelganger-falseface-adept/en-e07-doppelganger-falseface-adept-full-suite-four-directions-labeled.gif',
      sha256: '4cf7a25aa416d88e61e0d8cecd0687e62f891f2bfb7e8cc7811f56eea17b19ee',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
    completeBForm: {
      artifact: 'enemy-expansion-review/en-e07-doppelganger-falseface-adept/en-e07-doppelganger-falseface-adept-full-suite-four-directions-labeled-complete-b-form.gif',
      sha256: '458e15e7b2cad2b9d305dcbffc3bc172aa2b63138ddecfab3202d9947b3f40ad',
      width: 640,
      height: 672,
      frames: 4,
      durationMs: 180,
    },
  },
  candidateFrameDigest: '16289e68776f0f93d8238d19a3538c4e92e77e108686f8ddfec01b1a783080c6',
  cultistZealotComparisonDigest: 'ce0afd5e1e6fb0fcf4b6e5afd5b35b7064c982eff0e35c03737bde59fa417fb0',
  darkElfComparisonDigest: 'c2308d7ed3b28e8251dac6a60dcc7c1b512e2cee3fea5ea01fada8be02fff189',
  paleEchoComparisonDigest: EN_E07_PALE_ECHO_GATE.candidateFrameDigest,
  scope: 'One complete 80-frame Falseface Adept specialist Doppelganger across Down, Left, Right, and Up: Idle F1-F2, Walk W1-W4, Attack A1-A4, Hurt H1-H2, exact Cast-to-Attack aliases, and exact Death-to-Hurt aliases H1,H2,H2,H2.',
  animationContract: 'Idle settles the fused diagonal visage and opposing collar points. Walk uses four grounded alternating steps with counter-moving fringe, collar, and paired shaping hands. Attack brings both connected palms to the face, presses the diagonal visage without detaching it, crosses both molding hands through one connected shape-change tell, and resets the authored specialist form. Hurt uses a complete white recoil and colored high-collar brace. Cast aliases Attack exactly; Death aliases Hurt H1,H2,H2,H2.',
  reviewPresentation: 'Show the exact labeled all-four-direction raw/no-outline and Complete B + Form full-suite boards, synchronized GIFs, and a public Cultist Zealot and Dark Elf plus approved Pale Echo silhouette comparison together.',
  exclusions: [
    'changes to approved Pale Echo rendered pixels',
    'changes to approved Living Shadow source modules or pixels',
    'public Doppelganger registration',
    'public catalog exposure',
    'asset-pack fixture generation or regeneration',
    'runtime actor copying',
    'new Cast pixels',
    'new Death pixels',
    'copied actor silhouettes',
    'detached faces',
    'mirror doubles',
    'reflection planes',
    'peeling skin',
    'loose skin ribbons',
    'afterimages',
    'glow',
    'particles',
    'projectiles',
    'impact flashes',
    'effects',
    'release',
    'Doppelganger elite',
    'Will-o-Wisp',
    'Changeling',
    'Kelpie',
    'EN-E08 and later work',
  ],
  nextGate: 'Stop at the exact frozen Falseface Adept candidate review. Do not commit, publish, register Doppelganger, generate fixtures, add runtime copying or effects, release, start the elite or another EN-E07 family, or advance EN-E08 until the designer explicitly approves the presented boards and paired GIFs.',
});

export const EN_E07_FALSEFACE_ADEPT_DEATH_SOURCE_FRAMES = deepFreeze([0, 1, 1, 1]);

const WALK_PHASES = deepFreeze([
  { name: 'left-molding-step', pose: 'walk', bob: 0, step: -1, arm: 1, seam: -1 },
  { name: 'falseface-pass', pose: 'walk', bob: -1, step: 0, arm: -1, seam: 1 },
  { name: 'right-molding-step', pose: 'walk', bob: 0, step: 1, arm: -1, seam: 1 },
  { name: 'cross-coat-settle', pose: 'walk', bob: 1, step: 0, arm: 1, seam: -1 },
]);

const ATTACK_PHASES = deepFreeze([
  { name: 'paired-palm-falseface-guard', pose: 'guard', bob: 0, step: 0, arm: 0, seam: 0 },
  { name: 'diagonal-visage-press', pose: 'press', bob: -1, step: 0, arm: 1, seam: 1 },
  { name: 'twin-molding-hand-cross', pose: 'cross', bob: 0, step: 1, arm: -1, seam: 0 },
  { name: 'authored-high-collar-reset', pose: 'reset', bob: 1, step: 0, arm: 0, seam: -1 },
]);

const HURT_PHASES = deepFreeze([
  { name: 'white-falseface-recoil', pose: 'hurt', bob: 0, step: -1, arm: 0, seam: 0, flash: true },
  { name: 'colored-high-collar-brace', pose: 'brace', bob: 1, step: 0, arm: -1, seam: -1, flash: false },
]);

function phaseFor(animation, frame) {
  if (animation === 'idle') {
    assert(frame === 0 || frame === 1, 'Falseface Adept Idle frame ' + frame + ' is out of range.');
    return frame === 0
      ? { name: 'diagonal-visage-hold', pose: 'idle', bob: 0, step: 0, arm: -1, seam: -1 }
      : { name: 'opposed-collar-settle', pose: 'idle', bob: 1, step: 0, arm: 1, seam: 1 };
  }
  if (animation === 'walk') return WALK_PHASES[frame];
  if (animation === 'attack' || animation === 'cast') return ATTACK_PHASES[frame];
  if (animation === 'hurt') return HURT_PHASES[frame];
  if (animation === 'death') return HURT_PHASES[EN_E07_FALSEFACE_ADEPT_DEATH_SOURCE_FRAMES[frame]];
  return null;
}

function pixelCanvas() {
  const pixels = new Array(SIZE * SIZE).fill(null);
  let fillStyle = '#000000';
  const context = {
    get fillStyle() { return fillStyle; },
    set fillStyle(value) { fillStyle = value; },
    clearRect(x, y, width, height) {
      for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
        assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Falseface Adept clear must remain inside the 24x24 cell.');
        pixels[(py * SIZE) + px] = null;
      }
    },
    fillRect(x, y, width, height) {
      for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
        assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Falseface Adept source pixels must remain inside the 24x24 cell.');
        pixels[(py * SIZE) + px] = fillStyle;
      }
    },
  };
  return { context, pixels };
}

function painter(pixels) {
  const rect = (x, y, width, height, fill) => {
    assert([x, y, width, height].every(Number.isInteger) && width > 0 && height > 0, 'Falseface Adept rectangles must use positive integer geometry.');
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      assert(px >= 0 && py >= 0 && px < SIZE && py < SIZE, 'Falseface Adept authored pixels must remain inside the 24x24 cell.');
      pixels[(py * SIZE) + px] = fill;
    }
  };
  return {
    rect,
    dot(x, y, fill) { rect(x, y, 1, 1, fill); },
  };
}

function overlayFront(paint, rear, phase) {
  const y = phase.bob || 0;
  const seam = phase.seam > 0 ? 1 : 0;

  // Connected specialist collar and swept fringe remain close to Pale Echo scale.
  paint.rect(6, 9 + y, 3, 4, COLORS.veil[1]);
  paint.rect(15, 9 + y, 3, 4, COLORS.veil[0]);
  paint.dot(6, 8 + y, COLORS.veil[2]);
  paint.dot(17, 8 + y, COLORS.accent[2]);
  paint.rect(7 + seam, 4 + y, 3, 3, COLORS.hair[1]);
  paint.dot(7 + seam, 3 + y, COLORS.hair[2]);

  // Fused diagonal false-face seam; rear view retains only its connected clasp.
  if (rear) {
    paint.rect(11, 6 + y, 2, 4, COLORS.veil[1]);
    paint.dot(13, 9 + y, COLORS.veil[2]);
  } else {
    paint.rect(11, 5 + y, 1, 5, COLORS.veil[2]);
    paint.dot(10, 7 + y, COLORS.eye);
    paint.dot(14, 8 + y, COLORS.eye);
    paint.dot(12, 6 + y, COLORS.accent[2]);
    paint.dot(12, 9 + y, COLORS.veil[1]);
  }

  // A fitted cross-seamed short coat changes material without widening the torso.
  paint.rect(7, 12 + y, 2, 6, COLORS.cloth[1]);
  paint.rect(15, 12 + y, 2, 6, COLORS.accent[1]);
  paint.dot(9, 13 + y, COLORS.veil[2]);
  paint.dot(10, 14 + y, COLORS.veil[2]);
  paint.dot(13, 14 + y, COLORS.veil[0]);
  paint.dot(14, 13 + y, COLORS.veil[0]);
  paint.rect(8, 18, 3, 1, COLORS.veil[1]);
  paint.rect(13, 18, 3, 1, COLORS.veil[0]);

  if (phase.pose === 'guard') {
    paint.rect(8, 8 + y, 3, 3, COLORS.skin[2]);
    paint.rect(13, 8 + y, 3, 3, COLORS.skin[0]);
    paint.dot(8, 7 + y, COLORS.veil[2]);
    paint.dot(15, 7 + y, COLORS.accent[2]);
  } else if (phase.pose === 'press') {
    paint.rect(10, 6 + y, 4, 3, COLORS.veil[0]);
    paint.rect(11, 5 + y, 2, 5, COLORS.skin[2]);
    if (!rear) paint.dot(10, 7 + y, COLORS.eye);
    paint.rect(2, 15 + y, 4, 2, COLORS.skin[1]);
    paint.dot(1, 16 + y, COLORS.veil[2]);
  } else if (phase.pose === 'cross') {
    paint.rect(8, 11 + y, 8, 2, COLORS.veil[1]);
    paint.rect(10, 10 + y, 2, 4, COLORS.skin[1]);
    paint.rect(12, 10 + y, 2, 4, COLORS.skin[0]);
    paint.dot(2, 16 + y, COLORS.veil[2]);
    paint.dot(21, 16 + y, COLORS.accent[2]);
  } else {
    const arm = phase.arm || 0;
    paint.rect(3, 16 + y + Math.max(arm, 0), 2, 1, COLORS.skin[2]);
    paint.rect(20, 16 + y + Math.max(-arm, 0), 2, 1, COLORS.skin[0]);
    paint.dot(3, 17 + y + Math.max(arm, 0), COLORS.veil[2]);
    paint.dot(21, 17 + y + Math.max(-arm, 0), COLORS.accent[2]);
  }

  if (phase.pose === 'brace') {
    paint.rect(7, 11 + y, 3, 3, COLORS.veil[1]);
    paint.rect(14, 11 + y, 3, 3, COLORS.veil[0]);
    paint.rect(9, 14 + y, 6, 1, COLORS.veil[1]);
  }
}

function overlayRight(paint, phase) {
  const y = phase.bob || 0;
  const seam = phase.seam > 0 ? 1 : 0;

  paint.rect(7, 9 + y, 3, 4, COLORS.veil[1]);
  paint.rect(16, 9 + y, 3, 4, COLORS.veil[0]);
  paint.dot(7, 8 + y, COLORS.veil[2]);
  paint.dot(18, 8 + y, COLORS.accent[2]);
  paint.rect(8 + seam, 4 + y, 3, 3, COLORS.hair[1]);
  paint.dot(8 + seam, 3 + y, COLORS.hair[2]);
  paint.rect(14, 5 + y, 1, 5, COLORS.veil[2]);
  paint.dot(15, 7 + y, COLORS.eye);
  paint.dot(17, 9 + y, COLORS.accent[2]);

  paint.rect(8, 12 + y, 2, 6, COLORS.cloth[1]);
  paint.rect(16, 12 + y, 2, 6, COLORS.accent[1]);
  paint.dot(10, 13 + y, COLORS.veil[2]);
  paint.dot(11, 14 + y, COLORS.veil[2]);
  paint.dot(14, 14 + y, COLORS.veil[0]);
  paint.dot(15, 13 + y, COLORS.veil[0]);
  paint.rect(8, 18, 3, 1, COLORS.veil[1]);
  paint.rect(13, 18, 3, 1, COLORS.veil[0]);

  if (phase.pose === 'guard') {
    paint.rect(10, 8 + y, 3, 3, COLORS.skin[2]);
    paint.rect(15, 8 + y, 3, 3, COLORS.skin[0]);
    paint.dot(17, 7 + y, COLORS.accent[2]);
  } else if (phase.pose === 'press') {
    paint.rect(12, 6 + y, 5, 3, COLORS.veil[0]);
    paint.rect(14, 5 + y, 2, 5, COLORS.skin[2]);
    paint.dot(15, 7 + y, COLORS.eye);
    paint.rect(3, 15 + y, 4, 2, COLORS.skin[1]);
    paint.dot(2, 16 + y, COLORS.veil[2]);
  } else if (phase.pose === 'cross') {
    paint.rect(9, 11 + y, 9, 2, COLORS.veil[1]);
    paint.rect(12, 10 + y, 2, 4, COLORS.skin[1]);
    paint.rect(14, 10 + y, 2, 4, COLORS.skin[0]);
    paint.dot(3, 16 + y, COLORS.veil[2]);
    paint.dot(21, 16 + y, COLORS.accent[2]);
  } else {
    const arm = phase.arm || 0;
    paint.rect(4, 16 + y + Math.max(arm, 0), 2, 1, COLORS.skin[2]);
    paint.rect(20, 16 + y + Math.max(-arm, 0), 2, 1, COLORS.skin[0]);
    paint.dot(4, 17 + y + Math.max(arm, 0), COLORS.veil[2]);
    paint.dot(21, 17 + y + Math.max(-arm, 0), COLORS.accent[2]);
  }

  if (phase.pose === 'brace') {
    paint.rect(8, 11 + y, 3, 3, COLORS.veil[1]);
    paint.rect(15, 11 + y, 3, 3, COLORS.veil[0]);
    paint.rect(10, 14 + y, 6, 1, COLORS.veil[1]);
  }
}

function mirrorPixels(pixels) {
  const result = new Array(SIZE * SIZE).fill(null);
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    result[(y * SIZE) + (SIZE - 1 - x)] = pixels[(y * SIZE) + x];
  }
  return result;
}

function buildPixels(direction, animation, frame) {
  const phase = phaseFor(animation, frame);
  assert(phase, 'Falseface Adept animation ' + animation + ' frame ' + frame + ' is out of range.');
  const canonicalDirection = direction === 'left' ? 'right' : direction;
  const source = pixelCanvas();
  renderEnE07PaleEchoFrame(source.context, canonicalDirection, animation, frame);
  let pixels = source.pixels.map((color) => color === null ? null : (RECOLOR[color] || color));
  const paint = painter(pixels);
  if (canonicalDirection === 'right') overlayRight(paint, phase);
  else overlayFront(paint, canonicalDirection === 'up', phase);
  if (phase.flash) pixels = pixels.map((color) => color ? COLORS.flash : null);
  if (direction === 'left') pixels = mirrorPixels(pixels);
  return Object.freeze({ phase, pixels: Object.freeze(pixels) });
}

function paintPixels(context, pixels) {
  for (let index = 0; index < pixels.length; index++) {
    const fill = pixels[index];
    if (!fill) continue;
    context.fillStyle = fill;
    context.fillRect(index % SIZE, Math.floor(index / SIZE), 1, 1);
  }
}

export function renderEnE07FalsefaceAdeptFrame(context, direction, animation, frame) {
  assert(context && typeof context.fillRect === 'function' && typeof context.clearRect === 'function', 'Falseface Adept rendering needs a 2D-like context.');
  assert(['down', 'left', 'right', 'up'].includes(direction), 'Unsupported Falseface Adept direction ' + direction + '.');
  context.clearRect(0, 0, SIZE, SIZE);
  const { phase, pixels } = buildPixels(direction, animation, frame);
  paintPixels(context, pixels);
  return Object.freeze({
    family: 'doppelganger',
    variant: 'falseface-adept',
    direction,
    animation,
    frame,
    phase: phase.name,
    falsefaceAdeptGate: EN_E07_FALSEFACE_ADEPT_GATE.id,
    approvedPrecedingGate: EN_E07_PALE_ECHO_GATE.id,
    alphaPolicy: EN_E07_FALSEFACE_ADEPT_DATA.alphaPolicy,
    effectBoundary: EN_E07_FALSEFACE_ADEPT_DATA.effectBoundary,
  });
}

export const EN_E07_FALSEFACE_ADEPT_RENDERER = deepFreeze({
  key: 'en-e07-doppelganger-falseface-adept-v1',
  chassis: EN_E07_FALSEFACE_ADEPT_CONTRACT.chassis,
  render({ family, variant, direction, animation, frame, context }) {
    assert(family.id === 'doppelganger', 'The EN-E07 Falseface Adept renderer is restricted to Doppelganger.');
    assert(variant.id === 'falseface-adept', 'The EN-E07 Falseface Adept renderer is restricted to Falseface Adept.');
    return renderEnE07FalsefaceAdeptFrame(context, direction, animation.id, frame);
  },
});

const FALSEFACE_ADEPT_VARIANT = deepFreeze({
  id: 'falseface-adept',
  name: 'Falseface Adept',
  role: EN_E07_FALSEFACE_ADEPT_CONTRACT.role,
  status: EN_E07_FALSEFACE_ADEPT_CONTRACT.state,
  brief: 'A complete specialist Doppelganger candidate with a fused diagonal visage seam, asymmetric high collar, cross-seamed short coat, paired connected molding hands, separated legs, and planted boots; copied actors, detached faces, doubles, reflections, loose morph pieces, glow, and particles remain external.',
  rendererData: EN_E07_FALSEFACE_ADEPT_DATA,
});

export const EN_E07_FALSEFACE_ADEPT_FAMILY = deepFreeze({
  id: 'doppelganger',
  name: 'Doppelganger Falseface Adept Review',
  sliceId: 'EN-E07',
  state: ENEMY_EXPANSION_STATES.IMPLEMENTED,
  chassis: EN_E07_FALSEFACE_ADEPT_CONTRACT.chassis,
  rendererKey: EN_E07_FALSEFACE_ADEPT_RENDERER.key,
  variants: [FALSEFACE_ADEPT_VARIANT],
  rendererData: {
    contractCard: EN_E07_DOPPELGANGER_CONTRACT_CARD.id,
    approvedPrecedingGate: EN_E07_PALE_ECHO_GATE.id,
    activeGate: EN_E07_FALSEFACE_ADEPT_GATE.id,
  },
  review: {
    baselineVariant: 'falseface-adept',
    scale: 8,
    notes: 'Awaiting visual approval for one public-humanoid-scale Falseface Adept against public Cultist Zealot and Dark Elf plus approved Pale Echo. Keep registration, fixtures, runtime copying, effects, the elite, Will-o-Wisp, and later Wave 2 work separate.',
  },
});

export const EN_E07_FALSEFACE_ADEPT_REGISTRY = createEnemyExpansionRegistry({
  renderers: [EN_E07_FALSEFACE_ADEPT_RENDERER],
  families: [EN_E07_FALSEFACE_ADEPT_FAMILY],
});
