import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as engine from '../sprite-engine.js';
import {
  drawOutlinedSprite,
  OUTLINE_COLOR,
  OUTLINE_LAYER_ORDER,
  OUTLINE_MODE_COMPLETE_B,
  OUTLINE_MODE_NONE,
  OUTLINE_MODE_SELECTIVE_C,
  humanoidNeckCavityMaskForPixels,
  outlineMaskForOwnedPixels,
  outlineMaskForPixels,
} from '../engine/outline-renderer.js';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const outputFlag = process.argv.indexOf('--out');
const output = path.resolve(root, outputFlag >= 0 ? process.argv[outputFlag + 1] : 'outline-review');

// These hashes are intentionally committed after being captured from 4d26784.
// They protect the untouched renderer independently of the new outline code.
const EXPECTED_BASELINE_HASHES = Object.freeze({
  'baseline-sword': 'f1845f202376cd487b63025c99637895710991b0a88670f5aebc212a3647da92',
  'plumed-paladin': 'a052951ef83c48fac768d4eb75abdc0cc36e3934e0671cb9fd42cd8e024a94f8',
  'lizard-spearmaster': '8e9677f9235fd9e140bb9890c056ead4cba5eca6910dc2a4b2ee6eab2e4b1140',
  'tiefling-arcanist': '4487f6ebc1017b6df4317d682643eb3c5bdd955ce583223d6e090e4ec088c832',
  'afro-tower-guard': '16f371e06ab944b2b2bdedc5331c4f9be74b507428385e76c75099cded234291',
  'braided-ranger': '5d8a4b912ac090befb003493b14b573566fae0a1d16ddb902bfa9ad535e41ef1',
  'skull-mask-rogue': '87797fd02c976d52338f7216185e2216f169f521d76b70aa76b39c34bff9c7a3',
  'dwarf-cleric': 'f6ced0cf1715a384b51a7eccb4a2e4570304a94111078fb7ae47b3da7ee90c85',
});

const BASE_PLAYER = Object.freeze({
  kind: 'player',
  species: 'human',
  bodyBuild: 'classic',
  skin: 'peach',
  hairStyle: 'spiky',
  hairColor: 'brown',
  expression: 'neutral',
  faceDetail: 'none',
  headgear: 'none',
  outfit: 'tunic',
  outfitTier: 'tier1',
  outfitColor: 'charcoal',
  weapon: 'sword',
  weaponTier: 'tier1',
  shield: 'none',
  shieldTier: 'tier1',
  palette: null,
});

const SHOWCASES = Object.freeze([
  Object.freeze({
    id: 'baseline-sword',
    label: 'BASELINE SWORD',
    animation: 'walk',
    frame: 1,
    spec: { ...BASE_PLAYER },
  }),
  Object.freeze({
    id: 'plumed-paladin',
    label: 'PLUMED PALADIN',
    animation: 'attack',
    frame: 1,
    spec: {
      ...BASE_PLAYER,
      species: 'elf', bodyBuild: 'sturdy', expression: 'determined', headgear: 'plumed',
      outfit: 'plate', outfitTier: 'tier5', outfitColor: 'royal',
      weapon: 'greatsword', weaponTier: 'tier5', shield: 'kite', shieldTier: 'tier5',
    },
  }),
  Object.freeze({
    id: 'lizard-spearmaster',
    label: 'LIZARD SPEARMASTER',
    animation: 'attack',
    frame: 2,
    spec: {
      ...BASE_PLAYER,
      species: 'lizardfolk', skin: 'orc', bodyBuild: 'lean', hairStyle: 'mohawk', hairColor: 'ginger',
      expression: 'surprised', faceDetail: 'warpaint', outfit: 'ranger', outfitTier: 'tier4', outfitColor: 'forest',
      weapon: 'spear', weaponTier: 'tier5', shield: 'none',
    },
  }),
  Object.freeze({
    id: 'tiefling-arcanist',
    label: 'TIEFLING ARCANIST',
    animation: 'attack',
    frame: 1,
    spec: {
      ...BASE_PLAYER,
      species: 'tiefling', bodyBuild: 'classic', hairStyle: 'ponytail', hairColor: 'blue',
      expression: 'sad', faceDetail: 'glasses', headgear: 'circlet',
      outfit: 'necromancer', outfitTier: 'tier5', outfitColor: 'purple',
      weapon: 'spellbook', weaponTier: 'tier5', shield: 'arcane', shieldTier: 'tier5',
    },
  }),
  Object.freeze({
    id: 'afro-tower-guard',
    label: 'AFRO TOWER GUARD',
    animation: 'hurt',
    frame: 1,
    spec: {
      ...BASE_PLAYER,
      species: 'orc', skin: 'orc', bodyBuild: 'sturdy', hairStyle: 'afro', hairColor: 'black',
      expression: 'angry', faceDetail: 'scar', headgear: 'bandana',
      outfit: 'cape', outfitTier: 'tier4', outfitColor: 'crimson',
      weapon: 'warhammer', weaponTier: 'tier4', shield: 'tower', shieldTier: 'tier5',
    },
  }),
  Object.freeze({
    id: 'braided-ranger',
    label: 'BRAIDED RANGER',
    animation: 'attack',
    frame: 1,
    spec: {
      ...BASE_PLAYER,
      species: 'beastkin', bodyBuild: 'lean', hairStyle: 'braids', hairColor: 'ginger',
      expression: 'determined', faceDetail: 'eyepatch', headgear: 'none',
      outfit: 'ranger', outfitTier: 'tier3', outfitColor: 'umber',
      weapon: 'bow', weaponTier: 'tier5', shield: 'buckler', shieldTier: 'tier3',
    },
  }),
  Object.freeze({
    id: 'skull-mask-rogue',
    label: 'SKULL MASK ROGUE',
    animation: 'walk',
    frame: 3,
    spec: {
      ...BASE_PLAYER,
      species: 'goblin', bodyBuild: 'classic', hairStyle: 'topknot', hairColor: 'white',
      expression: 'happy', faceDetail: 'mustache', headgear: 'skull',
      outfit: 'leather', outfitTier: 'tier5', outfitColor: 'teal',
      weapon: 'dagger', weaponTier: 'tier5', shield: 'buckler', shieldTier: 'tier5',
    },
  }),
  Object.freeze({
    id: 'dwarf-cleric',
    label: 'DWARF CLERIC',
    animation: 'walk',
    frame: 2,
    spec: {
      ...BASE_PLAYER,
      species: 'dwarf', bodyBuild: 'sturdy', hairStyle: 'braids', hairColor: 'blonde',
      expression: 'happy', faceDetail: 'beard', headgear: 'crown',
      outfit: 'cleric', outfitTier: 'tier5', outfitColor: 'royal',
      weapon: 'mace', weaponTier: 'tier5', shield: 'heater', shieldTier: 'tier5',
    },
  }),
]);

class PixelContext {
  constructor() {
    this.fillStyle = '#000000';
    this.pixels = new Array(engine.SIZE * engine.SIZE).fill(null);
  }

  clearRect(x, y, width, height) {
    for (let py = Math.floor(y); py < y + height; py++) {
      for (let px = Math.floor(x); px < x + width; px++) {
        if (px >= 0 && py >= 0 && px < engine.SIZE && py < engine.SIZE) {
          this.pixels[(py * engine.SIZE) + px] = null;
        }
      }
    }
  }

  fillRect(x, y, width, height) {
    for (let py = Math.floor(y); py < y + height; py++) {
      for (let px = Math.floor(x); px < x + width; px++) {
        if (px >= 0 && py >= 0 && px < engine.SIZE && py < engine.SIZE) {
          this.pixels[(py * engine.SIZE) + px] = this.fillStyle;
        }
      }
    }
  }
}

function renderRaw(spec, direction, animation, frame) {
  const context = new PixelContext();
  engine.drawSprite(context, spec, direction, animation, frame, { shadow: false });
  return context.pixels;
}

function renderRawLayer(spec, direction, animation, frame, layer) {
  const context = new PixelContext();
  engine.drawSprite(context, spec, direction, animation, frame, { layer, shadow: false });
  return context.pixels;
}

function mergePixelLayers(...layers) {
  const merged = new Array(engine.SIZE * engine.SIZE).fill(null);
  for (const pixels of layers) {
    for (let index = 0; index < merged.length; index++) {
      if (pixels[index]) merged[index] = pixels[index];
    }
  }
  return merged;
}

function renderMode(spec, direction, animation, frame, outlineMode) {
  const context = new PixelContext();
  drawOutlinedSprite(context, spec, direction, animation, frame, { outlineMode, shadow: false });
  return context.pixels;
}

function arraysEqual(left, right) {
  if (left.length !== right.length) return false;
  for (let index = 0; index < left.length; index++) {
    if (left[index] !== right[index]) return false;
  }
  return true;
}

function changedIndices(left, right) {
  const result = [];
  for (let index = 0; index < left.length; index++) if (left[index] !== right[index]) result.push(index);
  return result;
}

function outlineViolation(source, outlined) {
  for (let index = 0; index < source.length; index++) {
    if (source[index] && outlined[index] !== source[index]) {
      return `overwrote source pixel ${index} (${source[index]} -> ${outlined[index]})`;
    }
    if (!source[index] && outlined[index] && outlined[index] !== OUTLINE_COLOR) {
      return `added non-outline color ${outlined[index]} at transparent pixel ${index}`;
    }
  }
  return null;
}

function seededRandom(seed = 0x8b17c0de) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function randomOutlineSpec(random) {
  const pick = (values) => values[Math.floor(random() * values.length)].id;
  const weapon = pick(engine.WEAPONS);
  const shield = pick(engine.SHIELDS);
  return {
    kind: 'player',
    species: pick(engine.SPECIES),
    bodyBuild: pick(engine.BODY_BUILDS),
    skin: pick(engine.SKINS),
    hairStyle: pick(engine.HAIR_STYLES),
    hairColor: pick(engine.HAIR_COLORS),
    expression: pick(engine.EXPRESSIONS),
    faceDetail: pick(engine.FACIAL_DETAILS),
    headgear: pick(engine.HEADGEAR),
    outfit: pick(engine.OUTFITS),
    outfitTier: pick(engine.OUTFIT_TIERS),
    outfitColor: pick(engine.OUTFIT_COLORS),
    weapon,
    weaponTier: weapon === 'none' ? 'tier1' : pick(engine.WEAPON_TIERS),
    shield,
    shieldTier: shield === 'none' ? 'tier1' : pick(engine.SHIELD_TIERS),
    palette: null,
  };
}

function hashAllFrames(spec) {
  const hash = createHash('sha256');
  for (const direction of engine.DIRS) {
    for (const animation of engine.ANIMS) {
      for (let frame = 0; frame < animation.frames; frame++) {
        hash.update(`${direction}:${animation.id}:${frame}\n`);
        hash.update(JSON.stringify(renderRaw(spec, direction, animation.id, frame)));
        hash.update('\n');
      }
    }
  }
  return hash.digest('hex');
}

function weaponCoverageSpecs() {
  return engine.WEAPONS.flatMap((weapon) => {
    if (weapon.id === 'none') return [{ ...BASE_PLAYER, weapon: 'none', weaponTier: 'tier1' }];
    return engine.WEAPON_TIERS.map((tier) => ({ ...BASE_PLAYER, weapon: weapon.id, weaponTier: tier.id }));
  });
}

function shieldCoverageSpecs() {
  return engine.SHIELDS.flatMap((shield) => {
    if (shield.id === 'none') return [{ ...BASE_PLAYER, shield: 'none', shieldTier: 'tier1' }];
    return engine.SHIELD_TIERS.map((tier) => ({ ...BASE_PLAYER, weapon: 'none', shield: shield.id, shieldTier: tier.id }));
  });
}

function maskCount(mask) {
  return mask.reduce((total, value) => total + (value ? 1 : 0), 0);
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function pixelRects(pixels, offsetX, offsetY, scale) {
  const rects = [];
  for (let y = 0; y < engine.SIZE; y++) {
    for (let x = 0; x < engine.SIZE; x++) {
      const color = pixels[(y * engine.SIZE) + x];
      if (!color) continue;
      rects.push(`<rect x="${offsetX + x * scale}" y="${offsetY + y * scale}" width="${scale}" height="${scale}" fill="${escapeXml(color)}"/>`);
    }
  }
  return rects.join('');
}

async function writeComparisonSvg() {
  const modes = [
    { id: OUTLINE_MODE_NONE, label: 'NONE' },
    { id: OUTLINE_MODE_COMPLETE_B, label: 'COMPLETE B' },
    { id: OUTLINE_MODE_SELECTIVE_C, label: 'SELECTIVE C' },
  ];
  const scale = 7;
  const labelWidth = 210;
  const titleHeight = 42;
  const headerHeight = 42;
  const cellWidth = (engine.SIZE * scale) + 8;
  const cellHeight = (engine.SIZE * scale) + 12;
  const columns = modes.flatMap((mode) => engine.DIRS.map((direction) => ({ mode, direction })));
  const width = labelWidth + (columns.length * cellWidth) + 4;
  const height = titleHeight + headerHeight + (SHOWCASES.length * cellHeight) + 4;
  const body = [
    `<rect width="${width}" height="${height}" fill="#111722"/>`,
    '<defs><pattern id="checker" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#303849"/><rect width="7" height="7" fill="#252c36"/><rect x="7" y="7" width="7" height="7" fill="#252c36"/></pattern></defs>',
    '<text x="8" y="27" class="title">OUTLINE OWNERSHIP REVIEW - NONE / COMPLETE B / SELECTIVE C</text>',
  ];
  columns.forEach((column, index) => {
    const x = labelWidth + (index * cellWidth) + 4;
    body.push(`<text x="${x}" y="${titleHeight + 17}" class="mode">${escapeXml(column.mode.label)}</text>`);
    body.push(`<text x="${x}" y="${titleHeight + 34}" class="direction">${escapeXml(column.direction.toUpperCase())}</text>`);
  });
  SHOWCASES.forEach((showcase, row) => {
    const y = titleHeight + headerHeight + (row * cellHeight);
    body.push(`<text x="8" y="${y + 74}" class="label">${escapeXml(showcase.label)}</text>`);
    body.push(`<text x="8" y="${y + 94}" class="meta">${escapeXml(`${showcase.animation.toUpperCase()} F${showcase.frame + 1}`)}</text>`);
    columns.forEach((column, columnIndex) => {
      const x = labelWidth + (columnIndex * cellWidth);
      body.push(`<rect x="${x}" y="${y}" width="${engine.SIZE * scale}" height="${engine.SIZE * scale}" fill="url(#checker)"/>`);
      body.push(pixelRects(
        renderMode(showcase.spec, column.direction, showcase.animation, showcase.frame, column.mode.id),
        x,
        y,
        scale,
      ));
    });
  });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><style>text{font-family:Consolas,monospace;font-weight:700}.title{font-size:19px;fill:#f4cf66}.mode{font-size:13px;fill:#d8e7ff}.direction{font-size:12px;fill:#91b8de}.label{font-size:15px;fill:#f0f4fa}.meta{font-size:13px;fill:#9baabd}</style>${body.join('')}</svg>`;
  await writeFile(path.join(output, 'outline-ownership-comparison.svg'), svg, 'utf8');
  return { file: 'outline-ownership-comparison.svg', width, height };
}

const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const startedAt = Date.now();

check(
  JSON.stringify(OUTLINE_LAYER_ORDER) === JSON.stringify(['weapon-back', 'shield-back', 'body', 'shield-front', 'weapon-front']),
  'outline ownership order must stay weapon-back, shield-back, body, shield-front, weapon-front',
);

const single = new Array(7 * 7).fill(null);
single[(3 * 7) + 3] = '#ffffff';
const singleB = outlineMaskForPixels(single, OUTLINE_MODE_COMPLETE_B, 7, 7);
const singleC = outlineMaskForPixels(single, OUTLINE_MODE_SELECTIVE_C, 7, 7);
check(maskCount(singleB) === 8, 'Complete B must use all eight neighboring pixels');
check(maskCount(singleC) === 4, 'Selective C must use only four orthogonal neighboring pixels');
check(singleB[(2 * 7) + 2] === 1, 'Complete B must include diagonal coverage');
check(singleC[(2 * 7) + 2] === 0, 'Selective C must exclude diagonal coverage');
check(singleC.every((value, index) => !value || singleB[index]), 'Complete B must contain every Selective C candidate');

const ring = new Array(7 * 7).fill(null);
for (let x = 2; x <= 4; x++) {
  ring[(2 * 7) + x] = '#ffffff';
  ring[(4 * 7) + x] = '#ffffff';
}
ring[(3 * 7) + 2] = '#ffffff';
ring[(3 * 7) + 4] = '#ffffff';
check(outlineMaskForPixels(ring, OUTLINE_MODE_COMPLETE_B, 7, 7)[(3 * 7) + 3] === 0, 'Complete B must not fill a closed interior gap');
check(outlineMaskForPixels(ring, OUTLINE_MODE_SELECTIVE_C, 7, 7)[(3 * 7) + 3] === 0, 'Selective C must not fill a closed interior gap');

const corner = new Array(5 * 5).fill(null);
corner[0] = '#ffffff';
check(maskCount(outlineMaskForPixels(corner, OUTLINE_MODE_COMPLETE_B, 5, 5)) === 3, 'Complete B must clip safely at the 24x24-style boundary');
check(maskCount(outlineMaskForPixels(corner, OUTLINE_MODE_SELECTIVE_C, 5, 5)) === 2, 'Selective C must clip safely at the 24x24-style boundary');

const bridgeLeft = new Array(5 * 5).fill(null);
const bridgeRight = new Array(5 * 5).fill(null);
const bridgeComposite = new Array(5 * 5).fill(null);
bridgeLeft[(2 * 5) + 1] = '#ffffff';
bridgeRight[(2 * 5) + 3] = '#ffffff';
bridgeComposite[(2 * 5) + 1] = '#ffffff';
bridgeComposite[(2 * 5) + 3] = '#ffffff';
const ownedBridge = outlineMaskForOwnedPixels(
  [bridgeLeft, bridgeRight],
  bridgeComposite,
  OUTLINE_MODE_COMPLETE_B,
  5,
  5,
);
check(ownedBridge[(2 * 5) + 2] === 1, 'Complete outlines must retain a pixel shared by different owners');
check(maskCount(ownedBridge) > 0, 'Ownership compositing must preserve outline pixels');

let parityCases = 0;
const paritySpecs = [
  ...SHOWCASES.map((showcase) => showcase.spec),
  ...weaponCoverageSpecs(),
  ...shieldCoverageSpecs(),
];
for (const spec of paritySpecs) {
  for (const direction of engine.DIRS) {
    for (const animation of engine.ANIMS) {
      for (let frame = 0; frame < animation.frames; frame++) {
        const raw = renderRaw(spec, direction, animation.id, frame);
        const none = renderMode(spec, direction, animation.id, frame, OUTLINE_MODE_NONE);
        check(arraysEqual(raw, none), `None changed ${spec.weapon}/${spec.shield} ${direction} ${animation.id} frame ${frame}`);
        parityCases++;
      }
    }
  }
}

const enemyFamily = engine.ENEMIES[0];
const enemySpec = { kind: 'enemy', family: enemyFamily.id, variant: enemyFamily.variants[0].id };
const effectCategory = engine.COMBAT_EFFECTS[0];
const effectSpec = { kind: 'effect', category: effectCategory.id, effect: effectCategory.effects[0].id };
for (const spec of [enemySpec, effectSpec]) {
  const raw = renderRaw(spec, 'down', spec.kind === 'effect' ? 'attack' : 'walk', 1);
  const outlined = renderMode(spec, 'down', spec.kind === 'effect' ? 'attack' : 'walk', 1, OUTLINE_MODE_COMPLETE_B);
  check(arraysEqual(raw, outlined), `${spec.kind} rendering must ignore player outline modes`);
}

const comparisonMetrics = [];
for (const showcase of SHOWCASES) {
  for (const direction of engine.DIRS) {
    const none = renderMode(showcase.spec, direction, showcase.animation, showcase.frame, OUTLINE_MODE_NONE);
    const complete = renderMode(showcase.spec, direction, showcase.animation, showcase.frame, OUTLINE_MODE_COMPLETE_B);
    const selective = renderMode(showcase.spec, direction, showcase.animation, showcase.frame, OUTLINE_MODE_SELECTIVE_C);
    const completeChanges = changedIndices(none, complete);
    const selectiveChanges = changedIndices(none, selective);
    check(completeChanges.length > 0, `Complete B added no outline to ${showcase.id} ${direction}`);
    check(selectiveChanges.length > 0, `Selective C added no outline to ${showcase.id} ${direction}`);
    check(completeChanges.every((index) => complete[index] === OUTLINE_COLOR), `Complete B changed a source color in ${showcase.id} ${direction}`);
    check(selectiveChanges.every((index) => selective[index] === OUTLINE_COLOR), `Selective C changed a source color in ${showcase.id} ${direction}`);
    check(!outlineViolation(none, complete), `Complete B overwrote assembled art in ${showcase.id} ${direction}: ${outlineViolation(none, complete)}`);
    check(!outlineViolation(none, selective), `Selective C overwrote assembled art in ${showcase.id} ${direction}: ${outlineViolation(none, selective)}`);
    comparisonMetrics.push({
      showcase: showcase.id,
      direction,
      completeBChanges: completeChanges.length,
      selectiveCChanges: selectiveChanges.length,
    });
  }
}

const random = seededRandom();
let randomizedCases = 0;
let randomizedFullContourPixelsPreserved = 0;
let randomizedNeckCavityCases = 0;
let randomizedNeckCavityPixels = 0;
for (let caseIndex = 0; caseIndex < 1000; caseIndex++) {
  const spec = randomOutlineSpec(random);
  const direction = engine.DIRS[Math.floor(random() * engine.DIRS.length)];
  const animation = engine.ANIMS[Math.floor(random() * engine.ANIMS.length)];
  const frame = Math.floor(random() * animation.frames);
  const none = renderMode(spec, direction, animation.id, frame, OUTLINE_MODE_NONE);
  const body = renderRawLayer(spec, direction, animation.id, frame, 'body');
  const ownerPixels = [
    mergePixelLayers(
      renderRawLayer(spec, direction, animation.id, frame, 'weapon-back'),
      renderRawLayer(spec, direction, animation.id, frame, 'weapon-front'),
    ),
    mergePixelLayers(
      renderRawLayer(spec, direction, animation.id, frame, 'shield-back'),
      renderRawLayer(spec, direction, animation.id, frame, 'shield-front'),
    ),
    body,
  ];
  const neckCavityMask = humanoidNeckCavityMaskForPixels(body, none, direction);
  const neckCavityIndices = [...neckCavityMask.keys()].filter((index) => neckCavityMask[index]);
  if (neckCavityIndices.length) {
    randomizedNeckCavityCases++;
    randomizedNeckCavityPixels += neckCavityIndices.length;
  }
  for (const mode of [OUTLINE_MODE_COMPLETE_B, OUTLINE_MODE_SELECTIVE_C]) {
    const outlined = renderMode(spec, direction, animation.id, frame, mode);
    const fullContourMask = outlineMaskForOwnedPixels(ownerPixels, none, mode);
    const violation = outlineViolation(none, outlined);
    check(!violation, `Random case ${caseIndex} ${mode} ${direction}/${animation.id}/${frame}: ${violation}`);
    check(
      [...fullContourMask.keys()].every((index) => (
        !fullContourMask[index] || outlined[index] === OUTLINE_COLOR
      )),
      `Random case ${caseIndex} ${mode} removed a full-contour outline pixel`,
    );
    randomizedFullContourPixelsPreserved += maskCount(fullContourMask);
    check(
      neckCavityIndices.every((index) => outlined[index] === OUTLINE_COLOR),
      `Random case ${caseIndex} ${mode} left a transparent humanoid neck cavity`,
    );
    randomizedCases++;
  }
}
check(randomizedNeckCavityCases > 0, 'Randomized outline sweep must exercise humanoid neck cavities');
check(randomizedNeckCavityPixels > 0, 'Randomized outline sweep must repair humanoid neck-cavity pixels');

const baselineHashes = Object.fromEntries(SHOWCASES.map((showcase) => [showcase.id, hashAllFrames(showcase.spec)]));
if (Object.keys(EXPECTED_BASELINE_HASHES).length) {
  for (const [id, expected] of Object.entries(EXPECTED_BASELINE_HASHES)) {
    check(baselineHashes[id] === expected, `${id} baseline drifted from 4d26784`);
  }
  check(Object.keys(baselineHashes).length === Object.keys(EXPECTED_BASELINE_HASHES).length, 'baseline hash coverage changed');
}

await mkdir(output, { recursive: true });
const comparison = await writeComparisonSvg();
const manifest = {
  baselineCommit: '4d26784b16d945b04aca9ff4f7a15b5435ab82ff',
  modes: [OUTLINE_MODE_NONE, OUTLINE_MODE_COMPLETE_B, OUTLINE_MODE_SELECTIVE_C],
  ownershipOrder: [...OUTLINE_LAYER_ORDER],
  baselineHashes,
  parityCases,
  randomizedCases,
  randomizedFullContourPixelsPreserved,
  randomizedNeckCavityCases,
  randomizedNeckCavityPixels,
  comparison,
  comparisonMetrics,
  elapsedMs: Date.now() - startedAt,
};
await writeFile(path.join(output, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

if (errors.length) {
  console.error(`Outline review failed with ${errors.length} error${errors.length === 1 ? '' : 's'}:`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Outline ownership review passed.');
console.log(`- None parity cases: ${parityCases}`);
console.log(`- Randomized outline integrity cases: ${randomizedCases}`);
console.log(`- Randomized full-contour pixels preserved: ${randomizedFullContourPixelsPreserved}`);
console.log(`- Randomized neck-cavity cases repaired: ${randomizedNeckCavityCases}`);
console.log(`- Randomized neck-cavity pixels added: ${randomizedNeckCavityPixels}`);
console.log(`- Baseline hashes: ${JSON.stringify(baselineHashes)}`);
console.log(`- Comparison: ${path.join(output, comparison.file)}`);
console.log(`- Manifest: ${path.join(output, 'manifest.json')}`);
