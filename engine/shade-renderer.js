import {
  BONE,
  BOOTS,
  CREAM,
  GOLD,
  HAIR_COLORS,
  INK,
  IRONPANTS,
  METAL,
  OUTFIT_COLORS,
  PANTS,
  SIZE,
  SKINS,
  WOOD,
} from './catalogs.js';
import { PUBLIC_ENEMIES } from './enemy-expansion-public.js';
import {
  drawOutlinedSprite,
  enemySupportsOutline,
  normalizeAssembledOutlineMode,
  normalizeOutlineMode,
  OUTLINE_MODE_NONE,
} from './outline-renderer.js';
import {
  capturePixels,
  isTransparentPixel,
  paintPixels,
  renderSpritePixels,
} from './pixel-buffer.js';
import { drawPublicSprite as drawSprite } from './public-renderer.js';

export const SHADE_MODE_NONE = 'none';
export const SHADE_MODE_FORM = 'form';
export const FORM_DARK_FEATURE_LUMINANCE_THRESHOLD = 0.035;
export const FORM_TINY_ACCENT_MAX_PIXELS = 2;

export const SHADE_MODES = Object.freeze([
  Object.freeze({ id: SHADE_MODE_NONE, name: 'None' }),
  Object.freeze({ id: SHADE_MODE_FORM, name: 'Form' }),
]);

export function normalizeShadeMode(value) {
  return SHADE_MODES.some((mode) => mode.id === value) ? value : SHADE_MODE_NONE;
}

const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;
const WHITE = '#ffffff';
const INK_RGB = parseHexColor(INK);
const MINIMUM_INK_DISTANCE = 24;

function normalizeHexColor(value) {
  return typeof value === 'string' && HEX_COLOR_PATTERN.test(value)
    ? value.toLowerCase()
    : null;
}

export function parseHexColor(value) {
  const color = normalizeHexColor(value);
  if (!color) return null;
  return [
    Number.parseInt(color.slice(1, 3), 16),
    Number.parseInt(color.slice(3, 5), 16),
    Number.parseInt(color.slice(5, 7), 16),
  ];
}

function clampChannel(value) {
  return Math.max(0, Math.min(255, Number.isFinite(value) ? Math.round(value) : 0));
}

function rgbToHex(rgb) {
  return `#${rgb.map((channel) => clampChannel(channel).toString(16).padStart(2, '0')).join('')}`;
}

function mixRgb(first, second, amount) {
  return first.map((channel, index) => channel + ((second[index] - channel) * amount));
}

function inkSafeColor(rgb) {
  const safe = rgb.map(clampChannel);
  const distance = safe.reduce((
    total,
    channel,
    index,
  ) => total + Math.abs(channel - INK_RGB[index]), 0);
  if (distance >= MINIMUM_INK_DISTANCE) return rgbToHex(safe);
  return rgbToHex(safe.map((channel, index) => (
    channel + (index === 2 ? MINIMUM_INK_DISTANCE : Math.ceil(MINIMUM_INK_DISTANCE / 2))
  )));
}

function fallbackHighlight(color) {
  const rgb = parseHexColor(color);
  if (!rgb) return color;
  const lifted = mixRgb(rgb, [255, 255, 255], 0.14);
  lifted[0] += 4;
  lifted[1] += 2;
  lifted[2] -= 2;
  return inkSafeColor(lifted);
}

function fallbackCoreShadow(color) {
  const rgb = parseHexColor(color);
  if (!rgb) return color;
  return inkSafeColor([
    (rgb[0] * 0.84) - 3,
    rgb[1] * 0.84,
    (rgb[2] * 0.84) + 5,
  ]);
}

function fallbackSideShade(color) {
  const rgb = parseHexColor(color);
  if (!rgb) return color;
  return inkSafeColor([
    (rgb[0] * 0.93) - 1,
    rgb[1] * 0.93,
    (rgb[2] * 0.93) + 2,
  ]);
}

export function relativeLuminance(color) {
  const rgb = parseHexColor(color);
  if (!rgb) return Number.NaN;
  const linear = rgb.map((channel) => {
    const value = channel / 255;
    return value <= 0.04045
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4;
  });
  return (0.2126 * linear[0]) + (0.7152 * linear[1]) + (0.0722 * linear[2]);
}

function catalogPair(catalog, id) {
  return catalog.find((entry) => entry.id === id)?.c || catalog[0]?.c;
}

function validRamp(colors) {
  return Array.isArray(colors)
    && (colors.length === 2 || colors.length === 3)
    && colors.every((color) => normalizeHexColor(color));
}

function addMaterialRamp(lookup, id, colors) {
  if (!validRamp(colors)) return;
  const normalized = colors.map((color) => normalizeHexColor(color));
  const [base, shadow] = normalized;
  const highlight = normalized[2] || fallbackHighlight(base);
  const side = rgbToHex(mixRgb(parseHexColor(base), parseHexColor(shadow), 0.5));
  const ramp = Object.freeze({
    id,
    base,
    shadow,
    highlight,
    side,
  });
  for (const [role, color] of [
    ['base', base],
    ['shadow', shadow],
    ['highlight', highlight],
  ]) {
    if (!lookup.has(color)) lookup.set(color, Object.freeze({ ramp, role }));
  }
}

function addNestedVariantRamps(lookup, value, path = 'variant') {
  if (!value || typeof value !== 'object') return;
  if (validRamp(value)) {
    addMaterialRamp(lookup, path, value);
    return;
  }
  if (Array.isArray(value)) return;
  for (const [key, child] of Object.entries(value)) {
    addNestedVariantRamps(lookup, child, `${path}.${key}`);
  }
}

export function buildShadeMaterialLookup(spec) {
  const lookup = new Map();
  if (spec?.kind === 'player') {
    addMaterialRamp(
      lookup,
      'player.skin',
      validRamp(spec.palette?.skin) ? spec.palette.skin : catalogPair(SKINS, spec.skin),
    );
    addMaterialRamp(
      lookup,
      'player.hair',
      validRamp(spec.palette?.hair)
        ? spec.palette.hair
        : catalogPair(HAIR_COLORS, spec.hairColor),
    );
    addMaterialRamp(
      lookup,
      'player.outfit',
      validRamp(spec.palette?.outfit)
        ? spec.palette.outfit
        : catalogPair(OUTFIT_COLORS, spec.outfitColor),
    );
  } else if (spec?.kind === 'enemy') {
    const family = PUBLIC_ENEMIES.find((entry) => entry.id === spec.family);
    const variant = family?.variants.find((entry) => entry.id === spec.variant)
      || family?.variants[0];
    addNestedVariantRamps(lookup, variant, `${family?.id || 'enemy'}.${variant?.id || 'variant'}`);
    if (variant?.oc) addMaterialRamp(lookup, 'enemy.outfit', catalogPair(OUTFIT_COLORS, variant.oc));
    if (variant?.hair) addMaterialRamp(lookup, 'enemy.hair', catalogPair(HAIR_COLORS, variant.hair));
    if (variant?.beard) addMaterialRamp(lookup, 'enemy.beard', catalogPair(HAIR_COLORS, variant.beard));
  }

  for (const [id, colors] of [
    ['metal', METAL],
    ['gold', GOLD],
    ['wood', WOOD],
    ['bone', BONE],
    ['cream', CREAM],
    ['boots', BOOTS],
    ['pants', PANTS],
    ['iron-pants', IRONPANTS],
  ]) {
    addMaterialRamp(lookup, id, colors);
  }
  return lookup;
}

function sameColorComponentMask(pixels, width, height, maximumPixels) {
  const mask = new Uint8Array(width * height);
  const visited = new Uint8Array(width * height);
  for (let start = 0; start < pixels.length; start++) {
    const color = normalizeHexColor(pixels[start]);
    if (!color || visited[start]) continue;
    const component = [];
    const queue = [start];
    visited[start] = 1;
    while (queue.length) {
      const index = queue.pop();
      component.push(index);
      const x = index % width;
      const y = Math.floor(index / width);
      for (const [offsetX, offsetY] of [[0, -1], [-1, 0], [1, 0], [0, 1]]) {
        const nextX = x + offsetX;
        const nextY = y + offsetY;
        if (nextX < 0 || nextY < 0 || nextX >= width || nextY >= height) continue;
        const nextIndex = (nextY * width) + nextX;
        if (visited[nextIndex] || normalizeHexColor(pixels[nextIndex]) !== color) continue;
        visited[nextIndex] = 1;
        queue.push(nextIndex);
      }
    }
    if (component.length <= maximumPixels) {
      for (const index of component) mask[index] = 1;
    }
  }
  return mask;
}

export function protectedShadeMask(
  pixels,
  {
    width = SIZE,
    height = SIZE,
    darkLuminanceThreshold = FORM_DARK_FEATURE_LUMINANCE_THRESHOLD,
    tinyAccentMaxPixels = FORM_TINY_ACCENT_MAX_PIXELS,
  } = {},
) {
  if (!pixels || pixels.length !== width * height) {
    throw new Error(`Shade source must contain exactly ${width * height} pixels.`);
  }
  const mask = sameColorComponentMask(pixels, width, height, tinyAccentMaxPixels);
  for (let index = 0; index < pixels.length; index++) {
    const color = normalizeHexColor(pixels[index]);
    if (
      !color
      || color === INK
      || color === WHITE
      || relativeLuminance(color) <= darkLuminanceThreshold
    ) {
      mask[index] = 1;
    }
  }
  return mask;
}

function materialId(entry, color) {
  return entry?.ramp.id || `unknown:${color}`;
}

function shadeKnownColor(color, entry, exposure) {
  const { ramp, role } = entry;
  if (exposure === 'top') {
    if (role === 'base') return ramp.highlight;
    if (role === 'shadow') return ramp.base;
    return color;
  }
  if (exposure === 'bottom') {
    if (role === 'base') return ramp.shadow;
    if (role === 'highlight') return ramp.base;
    return color;
  }
  if (role === 'base') return ramp.side;
  if (role === 'highlight') return ramp.base;
  return color;
}

function shadeUnknownColor(color, exposure) {
  if (exposure === 'top') return fallbackHighlight(color);
  if (exposure === 'bottom') return fallbackCoreShadow(color);
  return fallbackSideShade(color);
}

export function shadePixels(
  pixels,
  materialLookup,
  {
    width = SIZE,
    height = SIZE,
    protectedMask = protectedShadeMask(pixels, { width, height }),
    silhouetteOnly = false,
  } = {},
) {
  if (!pixels || pixels.length !== width * height) {
    throw new Error(`Shade source must contain exactly ${width * height} pixels.`);
  }
  if (!materialLookup || typeof materialLookup.get !== 'function') {
    throw new Error('Shade material lookup must provide a Map-like get().');
  }
  if (!protectedMask || protectedMask.length !== pixels.length) {
    throw new Error(`Shade protection mask must contain exactly ${pixels.length} entries.`);
  }

  const colors = pixels.map((pixel) => normalizeHexColor(pixel));
  const materials = colors.map((color) => (
    color ? (silhouetteOnly ? 'source-silhouette' : materialId(materialLookup.get(color), color)) : null
  ));
  const output = [...pixels];
  for (let index = 0; index < pixels.length; index++) {
    const color = colors[index];
    if (!color || protectedMask[index]) continue;
    const x = index % width;
    const y = Math.floor(index / width);
    const currentMaterial = materials[index];
    const outside = (nextX, nextY) => {
      if (nextX < 0 || nextY < 0 || nextX >= width || nextY >= height) return true;
      const nextIndex = (nextY * width) + nextX;
      return !colors[nextIndex] || materials[nextIndex] !== currentMaterial;
    };
    const exposure = outside(x, y - 1)
      ? 'top'
      : outside(x, y + 1)
        ? 'bottom'
        : outside(x + 1, y)
          ? 'right'
          : null;
    if (!exposure) continue;
    const entry = materialLookup.get(color);
    output[index] = entry
      ? shadeKnownColor(color, entry, exposure)
      : shadeUnknownColor(color, exposure);
  }
  return output;
}

export function drawAssembledSprite(
  context,
  spec,
  direction,
  animationId,
  frame,
  options = {},
) {
  const {
    shadeMode = SHADE_MODE_NONE,
    outlineMode = OUTLINE_MODE_NONE,
    ...rendererOptions
  } = options;
  const shade = normalizeShadeMode(shadeMode);
  const outline = normalizeAssembledOutlineMode(spec, normalizeOutlineMode(outlineMode));
  const assembledKind = spec?.kind === 'player' || enemySupportsOutline(spec);
  const completeLayer = !rendererOptions.layer || rendererOptions.layer === 'complete';

  if (
    !assembledKind
    || !completeLayer
    || (shade === SHADE_MODE_NONE && outline === OUTLINE_MODE_NONE)
  ) {
    drawSprite(context, spec, direction, animationId, frame, rendererOptions);
    return;
  }

  if (shade === SHADE_MODE_NONE) {
    drawOutlinedSprite(context, spec, direction, animationId, frame, {
      ...rendererOptions,
      outlineMode: outline,
    });
    return;
  }

  const { onOutOfBounds, ...captureOptions } = rendererOptions;
  const sourcePixels = renderSpritePixels(spec, direction, animationId, frame, {
    ...captureOptions,
    clear: true,
    shadow: false,
  });
  const materialLookup = buildShadeMaterialLookup(spec);
  const shadedPixels = shadePixels(sourcePixels, materialLookup);
  const outlinedPixels = capturePixels((captureContext) => {
    drawOutlinedSprite(captureContext, spec, direction, animationId, frame, {
      ...captureOptions,
      clear: true,
      shadow: false,
      outlineMode: outline,
    });
  });

  drawOutlinedSprite(context, spec, direction, animationId, frame, {
    ...rendererOptions,
    ...(onOutOfBounds ? { onOutOfBounds } : {}),
    outlineMode: outline,
  });
  paintPixels(context, shadedPixels.map((color, index) => (
    isTransparentPixel(sourcePixels[index])
      || outlinedPixels[index] !== sourcePixels[index]
      ? null
      : color
  )));
}
