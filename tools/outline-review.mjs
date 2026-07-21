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
  outlineContactMaskForVisibleOwners,
  outlineMaskForEquipmentPixels,
  outlineMaskForOwnedPixels,
  outlineMaskForPixels,
} from '../engine/outline-renderer.js';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const outputFlag = process.argv.indexOf('--out');
const output = path.resolve(root, outputFlag >= 0 ? process.argv[outputFlag + 1] : 'outline-review');

// These hashes were recaptured after the reviewed 2026-07-21 shield object-space correction.
// They protect the accepted renderer independently of the outline algorithm.
const EXPECTED_BASELINE_HASHES = Object.freeze({
  'baseline-sword': 'b0f565f3f2599a3b25b40e64c35cb23271ca724781c082b0243c677ceeec7bf5',
  'plumed-paladin': 'bdf83ca74fb1464716f9ce86d066003816e9b22fc59f971cbdd92709eb803ec7',
  'lizard-spearmaster': '48b9019dcdd15e40c25563c81a7b6839dd60d7d9420c914cc6c7075c8fc2f7f3',
  'tiefling-arcanist': '208d4df2abf53646253275b2967f734ba54f03b951ad024c7391c3b87ad629fc',
  'afro-tower-guard': '5192d4284230d08edcf1e0ad218f93e3a4894d6f6170b962bab31c7735c11777',
  'braided-ranger': '11f01bb9930755e5d8324997ddcf710c93c62fc1d403a6693673b371d61c4831',
  'skull-mask-rogue': 'f8a7d4d97755721871003c89e6a0dc0617fbd6eefb27b780c765e4a3be5968f0',
  'dwarf-cleric': '986040cb6bd63afb7c89c1c921b93e8b92a9fe5c93029224e06e83ea9939a320',
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

const CONTACT_BRIDGE_REGRESSION_SPEC = Object.freeze({
  kind: 'player',
  species: 'goblin',
  bodyBuild: 'classic',
  skin: 'brown',
  hairStyle: 'short',
  hairColor: 'blonde',
  expression: 'determined',
  faceDetail: 'mustache',
  headgear: 'crown',
  outfit: 'barbarian',
  outfitTier: 'tier4',
  outfitColor: 'charcoal',
  weapon: 'bow',
  weaponTier: 'tier5',
  shield: 'bone',
  shieldTier: 'tier3',
  palette: null,
});

const HEADGEAR_CONTACT_REGRESSION_SPEC = Object.freeze({
  kind: 'player',
  species: 'goblin',
  bodyBuild: 'heroic',
  skin: 'brown',
  hairStyle: 'ponytail',
  hairColor: 'white',
  expression: 'angry',
  faceDetail: 'blush',
  headgear: 'hood',
  outfit: 'robe',
  outfitTier: 'tier5',
  outfitColor: 'purple',
  weapon: 'mace',
  weaponTier: 'tier1',
  shield: 'oval',
  shieldTier: 'tier1',
  palette: null,
});

const TEST_LAYER_OWNER_INDEX = Object.freeze({
  'weapon-back': 0,
  'shield-back': 1,
  body: 2,
  headgear: 2,
  'shield-front': 1,
  'weapon-front': 0,
});
const TEST_EQUIPMENT_OWNER_INDICES = Object.freeze([0, 1]);
const TEST_BODY_OWNER_INDEX = 2;
const TEST_LAYER_INDEX = Object.freeze(Object.fromEntries(
  OUTLINE_LAYER_ORDER.map((layer, index) => [layer, index]),
));
const TEST_BACK_EQUIPMENT_LAYER_INDICES = Object.freeze([
  TEST_LAYER_INDEX['weapon-back'],
  TEST_LAYER_INDEX['shield-back'],
]);
const TEST_FRONT_EQUIPMENT_LAYER_INDICES = Object.freeze([
  TEST_LAYER_INDEX['shield-front'],
  TEST_LAYER_INDEX['weapon-front'],
]);
const TEST_BODY_LAYER_INDEX = TEST_LAYER_INDEX.body;
const TEST_HEADGEAR_LAYER_INDEX = TEST_LAYER_INDEX.headgear;

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

function renderVisibleOwners(spec, direction, animation, frame) {
  const visibleOwners = new Int8Array(engine.SIZE * engine.SIZE).fill(-1);
  for (const layer of OUTLINE_LAYER_ORDER) {
    const pixels = renderRawLayer(spec, direction, animation, frame, layer);
    const ownerIndex = TEST_LAYER_OWNER_INDEX[layer];
    for (let index = 0; index < pixels.length; index++) {
      if (pixels[index]) visibleOwners[index] = ownerIndex;
    }
  }
  return visibleOwners;
}

function renderVisibleLayers(spec, direction, animation, frame) {
  const visibleLayers = new Int8Array(engine.SIZE * engine.SIZE).fill(-1);
  for (const layer of OUTLINE_LAYER_ORDER) {
    const pixels = renderRawLayer(spec, direction, animation, frame, layer);
    const layerIndex = TEST_LAYER_INDEX[layer];
    for (let index = 0; index < pixels.length; index++) {
      if (pixels[index]) visibleLayers[index] = layerIndex;
    }
  }
  return visibleLayers;
}

function touchesVisibleLayerColorCardinally(
  visibleLayers,
  visiblePixels,
  index,
  targetLayerIndex,
  targetColor,
) {
  const x = index % engine.SIZE;
  const y = Math.floor(index / engine.SIZE);
  for (const [offsetX, offsetY] of [[0, -1], [-1, 0], [1, 0], [0, 1]]) {
    const targetX = x + offsetX;
    const targetY = y + offsetY;
    if (targetX < 0 || targetY < 0 || targetX >= engine.SIZE || targetY >= engine.SIZE) continue;
    const targetIndex = (targetY * engine.SIZE) + targetX;
    if (
      visibleLayers[targetIndex] === targetLayerIndex
      && visiblePixels[targetIndex] === targetColor
    ) return true;
  }
  return false;
}

function equipmentContactMasks(visibleLayers, visiblePixels, mode) {
  const back = new Uint8Array(engine.SIZE * engine.SIZE);
  const front = new Uint8Array(engine.SIZE * engine.SIZE);
  const frontBodyFallback = new Uint8Array(engine.SIZE * engine.SIZE);
  const frontHeadgear = new Uint8Array(engine.SIZE * engine.SIZE);
  const haloSourceExclusionMasks = [
    new Uint8Array(engine.SIZE * engine.SIZE),
    new Uint8Array(engine.SIZE * engine.SIZE),
    new Uint8Array(engine.SIZE * engine.SIZE),
  ];
  for (const layerIndex of TEST_BACK_EQUIPMENT_LAYER_INDICES) {
    const layerMask = outlineContactMaskForVisibleOwners(
      visibleLayers,
      layerIndex,
      TEST_BODY_LAYER_INDEX,
      mode,
    );
    for (let index = 0; index < back.length; index++) {
      if (!layerMask[index]) continue;
      back[index] = 1;
      haloSourceExclusionMasks[TEST_LAYER_OWNER_INDEX[OUTLINE_LAYER_ORDER[layerIndex]]][index] = 1;
    }
  }
  for (const layerIndex of TEST_FRONT_EQUIPMENT_LAYER_INDICES) {
    const layerMask = outlineContactMaskForVisibleOwners(
      visibleLayers,
      TEST_BODY_LAYER_INDEX,
      layerIndex,
      mode,
    );
    for (let index = 0; index < layerMask.length; index++) {
      if (
        !layerMask[index]
        || visiblePixels[index] === OUTLINE_COLOR
        || !touchesVisibleLayerColorCardinally(
          visibleLayers,
          visiblePixels,
          index,
          TEST_BODY_LAYER_INDEX,
          OUTLINE_COLOR,
        )
      ) continue;
      layerMask[index] = 0;
      const x = index % engine.SIZE;
      const y = Math.floor(index / engine.SIZE);
      for (const [offsetX, offsetY] of [[0, -1], [-1, 0], [1, 0], [0, 1]]) {
        const targetX = x + offsetX;
        const targetY = y + offsetY;
        if (targetX < 0 || targetY < 0 || targetX >= engine.SIZE || targetY >= engine.SIZE) continue;
        const targetIndex = (targetY * engine.SIZE) + targetX;
        if (visibleLayers[targetIndex] !== layerIndex) continue;
        frontBodyFallback[targetIndex] = 1;
        haloSourceExclusionMasks[
          TEST_LAYER_OWNER_INDEX[OUTLINE_LAYER_ORDER[layerIndex]]
        ][targetIndex] = 1;
      }
    }
    for (let index = 0; index < front.length; index++) {
      if (!layerMask[index]) continue;
      front[index] = 1;
      haloSourceExclusionMasks[TEST_BODY_OWNER_INDEX][index] = 1;
    }

    const headgearLayerMask = outlineContactMaskForVisibleOwners(
      visibleLayers,
      layerIndex,
      TEST_HEADGEAR_LAYER_INDEX,
      mode,
    );
    for (let index = 0; index < frontHeadgear.length; index++) {
      if (!headgearLayerMask[index]) continue;
      frontHeadgear[index] = 1;
      haloSourceExclusionMasks[
        TEST_LAYER_OWNER_INDEX[OUTLINE_LAYER_ORDER[layerIndex]]
      ][index] = 1;
    }
  }
  const combined = new Uint8Array(engine.SIZE * engine.SIZE);
  for (let index = 0; index < combined.length; index++) {
    if (back[index] || front[index] || frontBodyFallback[index] || frontHeadgear[index]) combined[index] = 1;
  }
  return { back, front, frontBodyFallback, frontHeadgear, combined, haloSourceExclusionMasks };
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

function outlineViolation(source, outlined, allowedSourceMask = null) {
  for (let index = 0; index < source.length; index++) {
    if (source[index] && outlined[index] !== source[index]) {
      if (
        outlined[index] === OUTLINE_COLOR
        && allowedSourceMask?.[index]
      ) continue;
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

function headgearCoverageSpecs() {
  const broadCoverage = engine.HEADGEAR
    .filter((headgear) => headgear.id !== 'none')
    .flatMap((headgear, headgearIndex) => engine.SPECIES.map((species, speciesIndex) => ({
      ...BASE_PLAYER,
      species: species.id,
      bodyBuild: engine.BODY_BUILDS[(headgearIndex + speciesIndex) % engine.BODY_BUILDS.length].id,
      headgear: headgear.id,
      outfitColor: 'purple',
      weapon: 'none',
      shield: 'none',
    })));
  return [
    ...broadCoverage,
    {
      ...BASE_PLAYER,
      species: 'goblin',
      bodyBuild: 'lean',
      skin: 'tan',
      hairStyle: 'spiky',
      hairColor: 'black',
      expression: 'determined',
      faceDetail: 'scar',
      headgear: 'wizard',
      outfit: 'necromancer',
      outfitTier: 'tier3',
      outfitColor: 'purple',
      weapon: 'club',
      weaponTier: 'tier1',
      shield: 'bone',
      shieldTier: 'tier3',
    },
  ];
}

function algorithmPilotSpecs() {
  return Object.freeze([
    Object.freeze({ id: 'sword-tier3-control', spec: { ...BASE_PLAYER, weapon: 'sword', weaponTier: 'tier3' } }),
    Object.freeze({ id: 'tower-tier3-control', spec: { ...BASE_PLAYER, weapon: 'none', shield: 'tower', shieldTier: 'tier3' } }),
    Object.freeze({ id: 'bow-tier3', spec: { ...BASE_PLAYER, weapon: 'bow', weaponTier: 'tier3' } }),
    Object.freeze({ id: 'bow-tier5', spec: { ...BASE_PLAYER, weapon: 'bow', weaponTier: 'tier5' } }),
    Object.freeze({ id: 'crossbow-tier5', spec: { ...BASE_PLAYER, weapon: 'crossbow', weaponTier: 'tier5' } }),
    Object.freeze({ id: 'staff-tier3', spec: { ...BASE_PLAYER, weapon: 'staff', weaponTier: 'tier3' } }),
    Object.freeze({ id: 'dagger-tier1', spec: { ...BASE_PLAYER, weapon: 'dagger', weaponTier: 'tier1' } }),
    Object.freeze({ id: 'bone-tier3', spec: { ...BASE_PLAYER, weapon: 'none', shield: 'bone', shieldTier: 'tier3' } }),
  ]);
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
  JSON.stringify(OUTLINE_LAYER_ORDER) === JSON.stringify(['weapon-back', 'shield-back', 'body', 'headgear', 'shield-front', 'weapon-front']),
  'outline ownership order must stay weapon-back, shield-back, body, headgear, shield-front, weapon-front',
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
check(maskCount(outlineMaskForEquipmentPixels(single, OUTLINE_MODE_COMPLETE_B, 7, 7)) === 4, 'Complete B equipment must use a restrained cardinal contour');
check(maskCount(outlineMaskForEquipmentPixels(single, OUTLINE_MODE_SELECTIVE_C, 7, 7)) === 4, 'Selective C equipment must use a cardinal contour');

const ring = new Array(7 * 7).fill(null);
for (let x = 2; x <= 4; x++) {
  ring[(2 * 7) + x] = '#ffffff';
  ring[(4 * 7) + x] = '#ffffff';
}
ring[(3 * 7) + 2] = '#ffffff';
ring[(3 * 7) + 4] = '#ffffff';
check(outlineMaskForPixels(ring, OUTLINE_MODE_COMPLETE_B, 7, 7)[(3 * 7) + 3] === 0, 'Complete B must not fill a closed interior gap');
check(outlineMaskForPixels(ring, OUTLINE_MODE_SELECTIVE_C, 7, 7)[(3 * 7) + 3] === 0, 'Selective C must not fill a closed interior gap');
check(outlineMaskForEquipmentPixels(ring, OUTLINE_MODE_COMPLETE_B, 7, 7)[(3 * 7) + 3] === 0, 'Complete B equipment must ignore a one-pixel construction pocket');
check(outlineMaskForEquipmentPixels(ring, OUTLINE_MODE_SELECTIVE_C, 7, 7)[(3 * 7) + 3] === 0, 'Selective C equipment must ignore a one-pixel construction pocket');

const substantialRing = new Array(9 * 9).fill(null);
for (let x = 2; x <= 6; x++) {
  substantialRing[(2 * 9) + x] = '#ffffff';
  substantialRing[(6 * 9) + x] = '#ffffff';
}
for (let y = 3; y <= 5; y++) {
  substantialRing[(y * 9) + 2] = '#ffffff';
  substantialRing[(y * 9) + 6] = '#ffffff';
}
const substantialB = outlineMaskForEquipmentPixels(substantialRing, OUTLINE_MODE_COMPLETE_B, 9, 9);
const substantialC = outlineMaskForEquipmentPixels(substantialRing, OUTLINE_MODE_SELECTIVE_C, 9, 9);
check(substantialB[(3 * 9) + 3] === 1, 'Complete B equipment must retain a substantial silhouette-defining opening');
check(substantialC[(3 * 9) + 3] === 1, 'Selective C equipment must retain a substantial silhouette-defining opening');
check(substantialB[(4 * 9) + 4] === 0, 'Complete B equipment must contour rather than fill a substantial opening');
check(substantialC[(4 * 9) + 4] === 0, 'Selective C equipment must contour rather than fill a substantial opening');

const backContactLayers = new Int8Array(5 * 5).fill(-1);
backContactLayers[(2 * 5) + 1] = TEST_LAYER_INDEX['weapon-back'];
backContactLayers[(2 * 5) + 2] = TEST_BODY_LAYER_INDEX;
const backContactB = outlineContactMaskForVisibleOwners(
  backContactLayers,
  TEST_LAYER_INDEX['weapon-back'],
  TEST_BODY_LAYER_INDEX,
  OUTLINE_MODE_COMPLETE_B,
  5,
  5,
);
const backContactC = outlineContactMaskForVisibleOwners(
  backContactLayers,
  TEST_LAYER_INDEX['weapon-back'],
  TEST_BODY_LAYER_INDEX,
  OUTLINE_MODE_SELECTIVE_C,
  5,
  5,
);
check(backContactB[(2 * 5) + 1] === 1, 'Complete B must put back-pass contact separation on the equipment-side pixel');
check(backContactC[(2 * 5) + 1] === 1, 'Selective C must put back-pass contact separation on the equipment-side pixel');
check(backContactB[(2 * 5) + 2] === 0, 'Complete B must preserve the body in front of back-pass equipment');
check(backContactC[(2 * 5) + 2] === 0, 'Selective C must preserve the body in front of back-pass equipment');

const frontContactLayers = new Int8Array(5 * 5).fill(-1);
frontContactLayers[(2 * 5) + 2] = TEST_BODY_LAYER_INDEX;
frontContactLayers[(2 * 5) + 3] = TEST_LAYER_INDEX['weapon-front'];
const frontContactB = outlineContactMaskForVisibleOwners(
  frontContactLayers,
  TEST_BODY_LAYER_INDEX,
  TEST_LAYER_INDEX['weapon-front'],
  OUTLINE_MODE_COMPLETE_B,
  5,
  5,
);
const frontContactC = outlineContactMaskForVisibleOwners(
  frontContactLayers,
  TEST_BODY_LAYER_INDEX,
  TEST_LAYER_INDEX['weapon-front'],
  OUTLINE_MODE_SELECTIVE_C,
  5,
  5,
);
check(frontContactB[(2 * 5) + 2] === 1, 'Complete B must put front-pass contact separation on the body-side pixel');
check(frontContactC[(2 * 5) + 2] === 1, 'Selective C must put front-pass contact separation on the body-side pixel');
check(frontContactB[(2 * 5) + 3] === 0, 'Complete B must preserve front-pass equipment pixels');
check(frontContactC[(2 * 5) + 3] === 0, 'Selective C must preserve front-pass equipment pixels');

const headgearContactLayers = new Int8Array(5 * 5).fill(-1);
headgearContactLayers[(2 * 5) + 2] = TEST_HEADGEAR_LAYER_INDEX;
headgearContactLayers[(2 * 5) + 3] = TEST_LAYER_INDEX['weapon-front'];
const headgearContactB = outlineContactMaskForVisibleOwners(
  headgearContactLayers,
  TEST_LAYER_INDEX['weapon-front'],
  TEST_HEADGEAR_LAYER_INDEX,
  OUTLINE_MODE_COMPLETE_B,
  5,
  5,
);
const headgearContactC = outlineContactMaskForVisibleOwners(
  headgearContactLayers,
  TEST_LAYER_INDEX['weapon-front'],
  TEST_HEADGEAR_LAYER_INDEX,
  OUTLINE_MODE_SELECTIVE_C,
  5,
  5,
);
check(headgearContactB[(2 * 5) + 3] === 1, 'Complete B must put headgear-contact separation on the front-equipment pixel');
check(headgearContactC[(2 * 5) + 3] === 1, 'Selective C must put headgear-contact separation on the front-equipment pixel');
check(headgearContactB[(2 * 5) + 2] === 0, 'Complete B must preserve headgear beside front equipment');
check(headgearContactC[(2 * 5) + 2] === 0, 'Selective C must preserve headgear beside front equipment');

const threeWayContactLayers = new Int8Array(engine.SIZE * engine.SIZE).fill(-1);
const threeWayContactPixels = new Array(engine.SIZE * engine.SIZE).fill(null);
threeWayContactLayers[(2 * engine.SIZE) + 2] = TEST_BODY_LAYER_INDEX;
threeWayContactLayers[(1 * engine.SIZE) + 3] = TEST_HEADGEAR_LAYER_INDEX;
threeWayContactLayers[(2 * engine.SIZE) + 3] = TEST_LAYER_INDEX['weapon-front'];
threeWayContactPixels[(2 * engine.SIZE) + 2] = '#7a4b2c';
threeWayContactPixels[(1 * engine.SIZE) + 3] = '#7b4fb5';
threeWayContactPixels[(2 * engine.SIZE) + 3] = '#e6ecf4';
const threeWayContactsB = equipmentContactMasks(threeWayContactLayers, threeWayContactPixels, OUTLINE_MODE_COMPLETE_B);
const threeWayContactsC = equipmentContactMasks(threeWayContactLayers, threeWayContactPixels, OUTLINE_MODE_SELECTIVE_C);
check(threeWayContactsB.front[(2 * engine.SIZE) + 2] === 1, 'Complete B must retain the existing body-side separator at a three-way contact');
check(threeWayContactsC.front[(2 * engine.SIZE) + 2] === 1, 'Selective C must retain the existing body-side separator at a three-way contact');
check(threeWayContactsB.frontHeadgear[(2 * engine.SIZE) + 3] === 1, 'Complete B must continue the equipment-side headgear contour through a three-way contact');
check(threeWayContactsC.frontHeadgear[(2 * engine.SIZE) + 3] === 1, 'Selective C must continue the equipment-side headgear contour through a three-way contact');

const featureContactLayers = new Int8Array(engine.SIZE * engine.SIZE).fill(-1);
const featureContactPixels = new Array(engine.SIZE * engine.SIZE).fill(null);
featureContactLayers[(2 * engine.SIZE) + 1] = TEST_BODY_LAYER_INDEX;
featureContactLayers[(2 * engine.SIZE) + 2] = TEST_BODY_LAYER_INDEX;
featureContactLayers[(2 * engine.SIZE) + 3] = TEST_LAYER_INDEX['weapon-front'];
featureContactPixels[(2 * engine.SIZE) + 1] = OUTLINE_COLOR;
featureContactPixels[(2 * engine.SIZE) + 2] = '#7a4b2c';
featureContactPixels[(2 * engine.SIZE) + 3] = '#e6ecf4';
const featureContactsB = equipmentContactMasks(featureContactLayers, featureContactPixels, OUTLINE_MODE_COMPLETE_B);
const featureContactsC = equipmentContactMasks(featureContactLayers, featureContactPixels, OUTLINE_MODE_SELECTIVE_C);
check(featureContactsB.front[(2 * engine.SIZE) + 2] === 0, 'Complete B must preserve a body pixel beside an existing dark body feature');
check(featureContactsC.front[(2 * engine.SIZE) + 2] === 0, 'Selective C must preserve a body pixel beside an existing dark body feature');
check(featureContactsB.frontBodyFallback[(2 * engine.SIZE) + 3] === 1, 'Complete B must move a feature-adjacent separator onto front equipment');
check(featureContactsC.frontBodyFallback[(2 * engine.SIZE) + 3] === 1, 'Selective C must move a feature-adjacent separator onto front equipment');

const diagonalContactLayers = new Int8Array(5 * 5).fill(-1);
diagonalContactLayers[(2 * 5) + 2] = TEST_BODY_LAYER_INDEX;
diagonalContactLayers[(3 * 5) + 3] = TEST_LAYER_INDEX['weapon-front'];
const diagonalContactB = outlineContactMaskForVisibleOwners(
  diagonalContactLayers,
  TEST_BODY_LAYER_INDEX,
  TEST_LAYER_INDEX['weapon-front'],
  OUTLINE_MODE_COMPLETE_B,
  5,
  5,
);
const diagonalContactC = outlineContactMaskForVisibleOwners(
  diagonalContactLayers,
  TEST_BODY_LAYER_INDEX,
  TEST_LAYER_INDEX['weapon-front'],
  OUTLINE_MODE_SELECTIVE_C,
  5,
  5,
);
check(diagonalContactB[(2 * 5) + 2] === 0, 'Complete B must not cut a body corner at diagonal-only equipment proximity');
check(diagonalContactC[(2 * 5) + 2] === 0, 'Selective C must not cut a body corner at diagonal-only equipment proximity');

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

const contactBridgeEquipment = new Array(5 * 5).fill(null);
const contactBridgeBody = new Array(5 * 5).fill(null);
const contactBridgeComposite = new Array(5 * 5).fill(null);
const contactBridgeBodyExclusion = new Uint8Array(5 * 5);
contactBridgeEquipment[(2 * 5) + 1] = '#ffffff';
contactBridgeBody[(2 * 5) + 2] = '#cc8844';
contactBridgeComposite[(2 * 5) + 1] = '#ffffff';
contactBridgeComposite[(2 * 5) + 2] = '#cc8844';
contactBridgeBodyExclusion[(2 * 5) + 2] = 1;
const contactAwareBridge = outlineMaskForOwnedPixels(
  [contactBridgeEquipment, contactBridgeBody],
  contactBridgeComposite,
  OUTLINE_MODE_COMPLETE_B,
  5,
  5,
  {
    interiorOwnerIndices: [0],
    haloSourceExclusionMasks: [null, contactBridgeBodyExclusion],
  },
);
check(contactAwareBridge[(1 * 5) + 1] === 1, 'Visible front equipment must retain its own exterior contour');
check(contactAwareBridge[(1 * 5) + 2] === 0, 'A contact-converted body pixel must not cast a second-pixel bridge');
check(contactAwareBridge[(1 * 5) + 3] === 0, 'A contact-converted body pixel must not cast a diagonal shelf');

const exactContactBridge = renderMode(
  CONTACT_BRIDGE_REGRESSION_SPEC,
  'down',
  'idle',
  0,
  OUTLINE_MODE_COMPLETE_B,
);
check(exactContactBridge[(3 * engine.SIZE) + 17] === OUTLINE_COLOR, 'Bow T5 must retain its real upper-tip contour');
check(!exactContactBridge[(3 * engine.SIZE) + 18], 'Bow T5 contact must not leave the diagnosed horizontal bridge');
check(!exactContactBridge[(3 * engine.SIZE) + 19], 'Bow T5 contact must not leave the diagnosed diagonal shelf');
check(exactContactBridge[(4 * engine.SIZE) + 18] === OUTLINE_COLOR, 'Bow T5 must retain its one-pixel body contact separator');

const exactHeadgearContactRaw = renderMode(
  HEADGEAR_CONTACT_REGRESSION_SPEC,
  'down',
  'idle',
  0,
  OUTLINE_MODE_NONE,
);
const exactHeadgearContactB = renderMode(
  HEADGEAR_CONTACT_REGRESSION_SPEC,
  'down',
  'idle',
  0,
  OUTLINE_MODE_COMPLETE_B,
);
const exactHeadgearContactC = renderMode(
  HEADGEAR_CONTACT_REGRESSION_SPEC,
  'down',
  'idle',
  0,
  OUTLINE_MODE_SELECTIVE_C,
);
for (const index of [
  (7 * engine.SIZE) + 16,
  (9 * engine.SIZE) + 16,
]) {
  check(exactHeadgearContactRaw[index] && exactHeadgearContactRaw[index] !== OUTLINE_COLOR, 'Mace T1 regression must begin with a visible colored weapon edge');
  check(exactHeadgearContactB[index] === OUTLINE_COLOR, 'Complete B must separate the Mace T1 inner edge from the hood');
  check(exactHeadgearContactC[index] === OUTLINE_COLOR, 'Selective C must separate the Mace T1 inner edge from the hood');
}
const eyeAdjacentMaceIndex = (8 * engine.SIZE) + 15;
check(exactHeadgearContactRaw[eyeAdjacentMaceIndex] && exactHeadgearContactRaw[eyeAdjacentMaceIndex] !== OUTLINE_COLOR, 'Mace T1 eye-adjacent regression must begin with a visible colored weapon pixel');
check(exactHeadgearContactB[eyeAdjacentMaceIndex] === OUTLINE_COLOR, 'Complete B must move the eye-adjacent separator onto Mace T1');
check(exactHeadgearContactC[eyeAdjacentMaceIndex] === OUTLINE_COLOR, 'Selective C must move the eye-adjacent separator onto Mace T1');
const preservedFaceIndex = (8 * engine.SIZE) + 14;
check(exactHeadgearContactRaw[preservedFaceIndex] && exactHeadgearContactRaw[preservedFaceIndex] !== OUTLINE_COLOR, 'Mace T1 eye regression must begin with a colored face pixel beside the eye');
check(exactHeadgearContactB[preservedFaceIndex] === exactHeadgearContactRaw[preservedFaceIndex], 'Complete B must preserve the face pixel beside the eye');
check(exactHeadgearContactC[preservedFaceIndex] === exactHeadgearContactRaw[preservedFaceIndex], 'Selective C must preserve the face pixel beside the eye');
const sourceEyeIndex = (8 * engine.SIZE) + 13;
check(exactHeadgearContactB[sourceEyeIndex] === exactHeadgearContactRaw[sourceEyeIndex], 'Complete B must preserve the one-pixel source eye');
check(exactHeadgearContactC[sourceEyeIndex] === exactHeadgearContactRaw[sourceEyeIndex], 'Selective C must preserve the one-pixel source eye');
for (const index of [
  (6 * engine.SIZE) + 16,
]) {
  check(exactHeadgearContactB[index] === OUTLINE_COLOR, 'Complete B must retain the existing body-side Mace T1 separator at a three-way contact');
  check(exactHeadgearContactC[index] === OUTLINE_COLOR, 'Selective C must retain the existing body-side Mace T1 separator at a three-way contact');
}
for (const index of [
  (7 * engine.SIZE) + 15,
  (9 * engine.SIZE) + 15,
]) {
  check(exactHeadgearContactB[index] === exactHeadgearContactRaw[index], 'Complete B must preserve hood pixels beside Mace T1');
  check(exactHeadgearContactC[index] === exactHeadgearContactRaw[index], 'Selective C must preserve hood pixels beside Mace T1');
}

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
    const visibleOwners = renderVisibleOwners(showcase.spec, direction, showcase.animation, showcase.frame);
    const visibleLayers = renderVisibleLayers(showcase.spec, direction, showcase.animation, showcase.frame);
    const completeContacts = equipmentContactMasks(visibleLayers, none, OUTLINE_MODE_COMPLETE_B);
    const selectiveContacts = equipmentContactMasks(visibleLayers, none, OUTLINE_MODE_SELECTIVE_C);
    const completeChanges = changedIndices(none, complete);
    const selectiveChanges = changedIndices(none, selective);
    check(completeChanges.length > 0, `Complete B added no outline to ${showcase.id} ${direction}`);
    check(selectiveChanges.length > 0, `Selective C added no outline to ${showcase.id} ${direction}`);
    check(completeChanges.every((index) => complete[index] === OUTLINE_COLOR), `Complete B changed a source color in ${showcase.id} ${direction}`);
    check(selectiveChanges.every((index) => selective[index] === OUTLINE_COLOR), `Selective C changed a source color in ${showcase.id} ${direction}`);
    check(!outlineViolation(none, complete, completeContacts.combined), `Complete B changed unauthorized art in ${showcase.id} ${direction}: ${outlineViolation(none, complete, completeContacts.combined)}`);
    check(!outlineViolation(none, selective, selectiveContacts.combined), `Selective C changed unauthorized art in ${showcase.id} ${direction}: ${outlineViolation(none, selective, selectiveContacts.combined)}`);
    for (let index = 0; index < none.length; index++) {
      if (none[index] && visibleOwners[index] === TEST_BODY_OWNER_INDEX && !completeContacts.front[index]) {
        check(complete[index] === none[index], `Complete B changed a visible body pixel in ${showcase.id} ${direction} at ${index}`);
      }
      if (none[index] && visibleOwners[index] === TEST_BODY_OWNER_INDEX && !selectiveContacts.front[index]) {
        check(selective[index] === none[index], `Selective C changed a visible body pixel in ${showcase.id} ${direction} at ${index}`);
      }
      if (none[index] && TEST_FRONT_EQUIPMENT_LAYER_INDICES.includes(visibleLayers[index])) {
        if (!completeContacts.frontHeadgear[index] && !completeContacts.frontBodyFallback[index]) {
          check(complete[index] === none[index], `Complete B changed front-pass equipment outside a headgear separator in ${showcase.id} ${direction} at ${index}`);
        }
        if (!selectiveContacts.frontHeadgear[index] && !selectiveContacts.frontBodyFallback[index]) {
          check(selective[index] === none[index], `Selective C changed front-pass equipment outside a headgear separator in ${showcase.id} ${direction} at ${index}`);
        }
      }
      if (none[index] && visibleLayers[index] === TEST_HEADGEAR_LAYER_INDEX) {
        check(complete[index] === none[index], `Complete B changed foreground headgear in ${showcase.id} ${direction} at ${index}`);
        check(selective[index] === none[index], `Selective C changed foreground headgear in ${showcase.id} ${direction} at ${index}`);
      }
    }
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
let randomizedEquipmentContactPixels = 0;
for (let caseIndex = 0; caseIndex < 1000; caseIndex++) {
  const spec = randomOutlineSpec(random);
  const direction = engine.DIRS[Math.floor(random() * engine.DIRS.length)];
  const animation = engine.ANIMS[Math.floor(random() * engine.ANIMS.length)];
  const frame = Math.floor(random() * animation.frames);
  const none = renderMode(spec, direction, animation.id, frame, OUTLINE_MODE_NONE);
  const body = renderRawLayer(spec, direction, animation.id, frame, 'body');
  const visibleOwners = renderVisibleOwners(spec, direction, animation.id, frame);
  const visibleLayers = renderVisibleLayers(spec, direction, animation.id, frame);
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
    const contactMasks = equipmentContactMasks(visibleLayers, none, mode);
    const fullContourMask = outlineMaskForOwnedPixels(
      ownerPixels,
      none,
      mode,
      engine.SIZE,
      engine.SIZE,
      {
        interiorOwnerIndices: TEST_EQUIPMENT_OWNER_INDICES,
        haloSourceExclusionMasks: contactMasks.haloSourceExclusionMasks,
      },
    );
    const violation = outlineViolation(none, outlined, contactMasks.combined);
    check(!violation, `Random case ${caseIndex} ${mode} ${direction}/${animation.id}/${frame}: ${violation}`);
    check(
      [...fullContourMask.keys()].every((index) => (
        !fullContourMask[index] || outlined[index] === OUTLINE_COLOR
      )),
      `Random case ${caseIndex} ${mode} removed a full-contour outline pixel`,
    );
    randomizedFullContourPixelsPreserved += maskCount(fullContourMask);
    check(
      [...contactMasks.combined.keys()].every((index) => (
        !contactMasks.combined[index] || outlined[index] === OUTLINE_COLOR
      )),
      `Random case ${caseIndex} ${mode} left an equipment/body contact edge open`,
    );
    randomizedEquipmentContactPixels += maskCount(contactMasks.combined);
    for (let index = 0; index < none.length; index++) {
      if (none[index] && visibleOwners[index] === TEST_BODY_OWNER_INDEX && !contactMasks.front[index]) {
        check(
          outlined[index] === none[index],
          `Random case ${caseIndex} ${mode} changed a body pixel outside a front-pass separator at ${index}`,
        );
      }
      if (
        none[index]
        && TEST_FRONT_EQUIPMENT_LAYER_INDICES.includes(visibleLayers[index])
        && !contactMasks.frontHeadgear[index]
        && !contactMasks.frontBodyFallback[index]
      ) {
        check(
          outlined[index] === none[index],
          `Random case ${caseIndex} ${mode} changed front-pass equipment pixel ${index} outside a headgear separator`,
        );
      }
      if (none[index] && visibleLayers[index] === TEST_HEADGEAR_LAYER_INDEX) {
        check(
          outlined[index] === none[index],
          `Random case ${caseIndex} ${mode} changed foreground headgear pixel ${index}`,
        );
      }
    }
    check(
      neckCavityIndices.every((index) => outlined[index] === OUTLINE_COLOR),
      `Random case ${caseIndex} ${mode} left a transparent humanoid neck cavity`,
    );
    randomizedCases++;
  }
}
check(randomizedNeckCavityCases > 0, 'Randomized outline sweep must exercise humanoid neck cavities');
check(randomizedNeckCavityPixels > 0, 'Randomized outline sweep must repair humanoid neck-cavity pixels');
check(randomizedEquipmentContactPixels > 0, 'Randomized outline sweep must exercise equipment/body contact separators');

const exhaustiveEquipmentSpecs = [
  ...weaponCoverageSpecs().filter((spec) => spec.weapon !== 'none'),
  ...shieldCoverageSpecs().filter((spec) => spec.shield !== 'none'),
];
let exhaustiveEquipmentCases = 0;
let exhaustiveEquipmentInteriorPixels = 0;
let exhaustiveEquipmentContactPixels = 0;
let exhaustiveBodyPixelsProtected = 0;
let exhaustiveFrontEquipmentPixelsProtected = 0;
for (const spec of exhaustiveEquipmentSpecs) {
  for (const direction of engine.DIRS) {
    for (const animation of engine.ANIMS) {
      for (let frame = 0; frame < animation.frames; frame++) {
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
        const visibleOwners = renderVisibleOwners(spec, direction, animation.id, frame);
        const visibleLayers = renderVisibleLayers(spec, direction, animation.id, frame);
        const equipmentLabel = spec.weapon !== 'none'
          ? `${spec.weapon}/${spec.weaponTier}`
          : `${spec.shield}/${spec.shieldTier}`;

        for (const mode of [OUTLINE_MODE_COMPLETE_B, OUTLINE_MODE_SELECTIVE_C]) {
          const outlined = renderMode(spec, direction, animation.id, frame, mode);
          const contactMasks = equipmentContactMasks(visibleLayers, none, mode);
          const contourMask = outlineMaskForOwnedPixels(
            ownerPixels,
            none,
            mode,
            engine.SIZE,
            engine.SIZE,
            {
              interiorOwnerIndices: TEST_EQUIPMENT_OWNER_INDICES,
              haloSourceExclusionMasks: contactMasks.haloSourceExclusionMasks,
            },
          );
          const violation = outlineViolation(none, outlined, contactMasks.combined);
          check(
            !violation,
            `Exhaustive ${equipmentLabel} ${direction}/${animation.id}/${frame} ${mode}: ${violation}`,
          );
          check(
            [...contourMask.keys()].every((index) => !contourMask[index] || outlined[index] === OUTLINE_COLOR),
            `Exhaustive ${equipmentLabel} ${direction}/${animation.id}/${frame} ${mode} missed an equipment contour`,
          );
          check(
            [...contactMasks.combined.keys()].every((index) => !contactMasks.combined[index] || outlined[index] === OUTLINE_COLOR),
            `Exhaustive ${equipmentLabel} ${direction}/${animation.id}/${frame} ${mode} left a body-contact seam open`,
          );

          for (const ownerIndex of TEST_EQUIPMENT_OWNER_INDICES) {
            const exteriorMask = outlineMaskForPixels(ownerPixels[ownerIndex], mode);
            const equipmentMask = outlineMaskForEquipmentPixels(ownerPixels[ownerIndex], mode);
            for (let index = 0; index < equipmentMask.length; index++) {
              if (equipmentMask[index] && !exteriorMask[index] && !none[index]) {
                check(
                  outlined[index] === OUTLINE_COLOR,
                  `Exhaustive ${equipmentLabel} ${direction}/${animation.id}/${frame} ${mode} missed enclosed equipment pixel ${index}`,
                );
                exhaustiveEquipmentInteriorPixels++;
              }
            }
          }

          exhaustiveEquipmentContactPixels += maskCount(contactMasks.combined);
          for (let index = 0; index < none.length; index++) {
            if (none[index] && visibleOwners[index] === TEST_BODY_OWNER_INDEX && !contactMasks.front[index]) {
              check(
                outlined[index] === none[index],
                `Exhaustive ${equipmentLabel} ${direction}/${animation.id}/${frame} ${mode} changed body pixel ${index} outside a front-pass separator`,
              );
              exhaustiveBodyPixelsProtected++;
            }
            if (
              none[index]
              && TEST_FRONT_EQUIPMENT_LAYER_INDICES.includes(visibleLayers[index])
              && !contactMasks.frontHeadgear[index]
              && !contactMasks.frontBodyFallback[index]
            ) {
              check(
                outlined[index] === none[index],
                `Exhaustive ${equipmentLabel} ${direction}/${animation.id}/${frame} ${mode} changed front-pass equipment pixel ${index} outside a headgear separator`,
              );
              exhaustiveFrontEquipmentPixelsProtected++;
            }
          }
          exhaustiveEquipmentCases++;
        }
      }
    }
  }
}
check(exhaustiveEquipmentCases === 11040, `Expected 11,040 exhaustive outlined equipment cases, got ${exhaustiveEquipmentCases}`);
check(exhaustiveEquipmentInteriorPixels > 0, 'Exhaustive equipment review must exercise enclosed equipment contours');
check(exhaustiveEquipmentContactPixels > 0, 'Exhaustive equipment review must exercise equipment/body contact separators');
check(exhaustiveBodyPixelsProtected > 0, 'Exhaustive equipment review must protect visible body pixels');
check(exhaustiveFrontEquipmentPixelsProtected > 0, 'Exhaustive equipment review must protect front-pass equipment pixels');

const algorithmPilotInteriorPixels = Object.fromEntries(
  algorithmPilotSpecs().map(({ id }) => [id, 0]),
);
let algorithmPilotEquipmentModeMismatches = 0;
for (const { id, spec } of algorithmPilotSpecs()) {
  const equipmentPrefix = spec.weapon !== 'none' ? 'weapon' : 'shield';
  for (const direction of engine.DIRS) {
    for (const animation of engine.ANIMS) {
      for (let frame = 0; frame < animation.frames; frame++) {
        const equipment = mergePixelLayers(
          renderRawLayer(spec, direction, animation.id, frame, `${equipmentPrefix}-back`),
          renderRawLayer(spec, direction, animation.id, frame, `${equipmentPrefix}-front`),
        );
        const exterior = outlineMaskForPixels(equipment, OUTLINE_MODE_COMPLETE_B);
        const complete = outlineMaskForEquipmentPixels(equipment, OUTLINE_MODE_COMPLETE_B);
        const selective = outlineMaskForEquipmentPixels(equipment, OUTLINE_MODE_SELECTIVE_C);
        for (let index = 0; index < complete.length; index++) {
          if (complete[index] && !exterior[index]) algorithmPilotInteriorPixels[id]++;
          if (complete[index] !== selective[index]) algorithmPilotEquipmentModeMismatches++;
        }
      }
    }
  }
}
check(algorithmPilotInteriorPixels['sword-tier3-control'] === 0, 'Sword T3 control must not invent an enclosed cavity');
check(algorithmPilotInteriorPixels['tower-tier3-control'] === 0, 'Tower T3 control must not invent an enclosed cavity');
check(algorithmPilotInteriorPixels['bow-tier3'] > 0, 'Bow T3 must preserve its silhouette-defining opening');
check(algorithmPilotInteriorPixels['bow-tier5'] > algorithmPilotInteriorPixels['bow-tier3'], 'Bow T5 must preserve its larger silhouette-defining opening');
check(algorithmPilotInteriorPixels['crossbow-tier5'] > 0, 'Crossbow T5 must preserve substantial openings while suppressing tiny pockets');
check(algorithmPilotInteriorPixels['staff-tier3'] === 0, 'Staff T3 must suppress tiny enclosed head pockets');
check(algorithmPilotInteriorPixels['dagger-tier1'] === 0, 'Dagger T1 must not invent an enclosed cavity');
check(algorithmPilotInteriorPixels['bone-tier3'] === 0, 'Bone T3 must suppress one-pixel lattice pockets');
check(algorithmPilotEquipmentModeMismatches === 0, 'Equipment contour footprint must remain cardinal in both outline modes');

const exhaustiveHeadgearSpecs = headgearCoverageSpecs();
let exhaustiveHeadgearCases = 0;
let exhaustiveHeadgearPixelsProtected = 0;
let exhaustiveHeadgearBodyPixelsProtected = 0;
for (const spec of exhaustiveHeadgearSpecs) {
  for (const direction of engine.DIRS) {
    for (const animation of engine.ANIMS) {
      for (let frame = 0; frame < animation.frames; frame++) {
        const none = renderMode(spec, direction, animation.id, frame, OUTLINE_MODE_NONE);
        const body = renderRawLayer(spec, direction, animation.id, frame, 'body');
        const visibleOwners = renderVisibleOwners(spec, direction, animation.id, frame);
        const visibleLayers = renderVisibleLayers(spec, direction, animation.id, frame);
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

        for (const mode of [OUTLINE_MODE_COMPLETE_B, OUTLINE_MODE_SELECTIVE_C]) {
          const outlined = renderMode(spec, direction, animation.id, frame, mode);
          const contactMasks = equipmentContactMasks(visibleLayers, none, mode);
          const contourMask = outlineMaskForOwnedPixels(
            ownerPixels,
            none,
            mode,
            engine.SIZE,
            engine.SIZE,
            {
              interiorOwnerIndices: TEST_EQUIPMENT_OWNER_INDICES,
              haloSourceExclusionMasks: contactMasks.haloSourceExclusionMasks,
            },
          );
          const violation = outlineViolation(none, outlined, contactMasks.combined);
          check(
            !violation,
            `Headgear ${spec.headgear}/${spec.species} ${direction}/${animation.id}/${frame} ${mode}: ${violation}`,
          );
          check(
            [...contourMask.keys()].every((index) => !contourMask[index] || outlined[index] === OUTLINE_COLOR),
            `Headgear ${spec.headgear}/${spec.species} ${direction}/${animation.id}/${frame} ${mode} missed a transparent-space contour`,
          );
          for (let index = 0; index < none.length; index++) {
            if (none[index] && visibleLayers[index] === TEST_HEADGEAR_LAYER_INDEX) {
              check(
                outlined[index] === none[index],
                `Headgear ${spec.headgear}/${spec.species} ${direction}/${animation.id}/${frame} ${mode} changed foreground headgear pixel ${index}`,
              );
              exhaustiveHeadgearPixelsProtected++;
            }
            if (none[index] && visibleOwners[index] === TEST_BODY_OWNER_INDEX && !contactMasks.front[index]) {
              check(
                outlined[index] === none[index],
                `Headgear ${spec.headgear}/${spec.species} ${direction}/${animation.id}/${frame} ${mode} changed body pixel ${index} outside a foreground separator`,
              );
              exhaustiveHeadgearBodyPixelsProtected++;
            }
          }
          exhaustiveHeadgearCases++;
        }
      }
    }
  }
}
const expectedHeadgearCases = exhaustiveHeadgearSpecs.length
  * engine.DIRS.length
  * engine.ANIMS.reduce((total, animation) => total + animation.frames, 0)
  * 2;
check(exhaustiveHeadgearCases === expectedHeadgearCases, `Expected ${expectedHeadgearCases} exhaustive headgear cases, got ${exhaustiveHeadgearCases}`);
check(exhaustiveHeadgearPixelsProtected > 0, 'Exhaustive headgear review must protect foreground headgear pixels');
check(exhaustiveHeadgearBodyPixelsProtected > 0, 'Exhaustive headgear review must protect non-contact body pixels');

const baselineHashes = Object.fromEntries(SHOWCASES.map((showcase) => [showcase.id, hashAllFrames(showcase.spec)]));
if (Object.keys(EXPECTED_BASELINE_HASHES).length) {
  for (const [id, expected] of Object.entries(EXPECTED_BASELINE_HASHES)) {
    check(baselineHashes[id] === expected, `${id} baseline drifted from the reviewed frame-safety renderer`);
  }
  check(Object.keys(baselineHashes).length === Object.keys(EXPECTED_BASELINE_HASHES).length, 'baseline hash coverage changed');
}

await mkdir(output, { recursive: true });
const comparison = await writeComparisonSvg();
const manifest = {
  baselineCommit: null,
  baselineReference: 'shield-object-space-2026-07-21',
  modes: [OUTLINE_MODE_NONE, OUTLINE_MODE_COMPLETE_B, OUTLINE_MODE_SELECTIVE_C],
  ownershipOrder: [...OUTLINE_LAYER_ORDER],
  baselineHashes,
  parityCases,
  randomizedCases,
  randomizedFullContourPixelsPreserved,
  randomizedNeckCavityCases,
  randomizedNeckCavityPixels,
  randomizedEquipmentContactPixels,
  exhaustiveEquipmentCases,
  exhaustiveEquipmentInteriorPixels,
  exhaustiveEquipmentContactPixels,
  exhaustiveBodyPixelsProtected,
  exhaustiveFrontEquipmentPixelsProtected,
  algorithmPilotInteriorPixels,
  algorithmPilotEquipmentModeMismatches,
  exhaustiveHeadgearCases,
  exhaustiveHeadgearPixelsProtected,
  exhaustiveHeadgearBodyPixelsProtected,
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
console.log(`- Randomized equipment-contact pixels added: ${randomizedEquipmentContactPixels}`);
console.log(`- Exhaustive outlined equipment cases: ${exhaustiveEquipmentCases}`);
console.log(`- Exhaustive enclosed equipment pixels verified: ${exhaustiveEquipmentInteriorPixels}`);
console.log(`- Exhaustive equipment-contact pixels verified: ${exhaustiveEquipmentContactPixels}`);
console.log(`- Exhaustive visible body pixels protected: ${exhaustiveBodyPixelsProtected}`);
console.log(`- Exhaustive front-pass equipment pixels protected: ${exhaustiveFrontEquipmentPixelsProtected}`);
console.log(`- Algorithm pilot interior pixels: ${JSON.stringify(algorithmPilotInteriorPixels)}`);
console.log(`- Exhaustive outlined headgear cases: ${exhaustiveHeadgearCases}`);
console.log(`- Exhaustive foreground headgear pixels protected: ${exhaustiveHeadgearPixelsProtected}`);
console.log(`- Exhaustive non-contact headgear-body pixels protected: ${exhaustiveHeadgearBodyPixelsProtected}`);
console.log(`- Baseline hashes: ${JSON.stringify(baselineHashes)}`);
console.log(`- Comparison: ${path.join(output, comparison.file)}`);
console.log(`- Manifest: ${path.join(output, 'manifest.json')}`);
