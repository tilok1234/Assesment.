import { SIZE } from './catalogs.js';
import { drawSprite } from './renderer.js';

export const OUTLINE_MODE_NONE = 'none';
export const OUTLINE_MODE_COMPLETE_B = 'complete-b';
export const OUTLINE_MODE_SELECTIVE_C = 'selective-c';
export const OUTLINE_COLOR = '#1a1c2c';

export const OUTLINE_MODES = Object.freeze([
  Object.freeze({ id: OUTLINE_MODE_NONE, name: 'None' }),
  Object.freeze({ id: OUTLINE_MODE_COMPLETE_B, name: 'Complete B' }),
  Object.freeze({ id: OUTLINE_MODE_SELECTIVE_C, name: 'Selective C' }),
]);

// These are ownership groups, not the much finer character-kit component layers.
// Keeping the body together avoids outlines between skin, outfit, hair, and gear.
export const OUTLINE_LAYER_ORDER = Object.freeze([
  'weapon-back',
  'shield-back',
  'body',
  'headgear',
  'shield-front',
  'weapon-front',
]);

// Front/back equipment passes are one visual owner. Headgear stays part of the
// body owner so the outline cannot cut a seam through the head beneath wide hats.
// Its concrete layer remains in OUTLINE_LAYER_ORDER only to protect visible
// headgear pixels from equipment/body contact replacement.
const OUTLINE_OWNER_GROUPS = Object.freeze([
  Object.freeze(['weapon-back', 'weapon-front']),
  Object.freeze(['shield-back', 'shield-front']),
  Object.freeze(['body']),
]);

const EQUIPMENT_OWNER_INDICES = Object.freeze([0, 1]);
const BODY_OWNER_INDEX = 2;
const OUTLINE_LAYER_INDEX = Object.freeze(Object.fromEntries(
  OUTLINE_LAYER_ORDER.map((layer, index) => [layer, index]),
));
const BACK_EQUIPMENT_LAYER_INDICES = Object.freeze([
  OUTLINE_LAYER_INDEX['weapon-back'],
  OUTLINE_LAYER_INDEX['shield-back'],
]);
const FRONT_EQUIPMENT_LAYER_INDICES = Object.freeze([
  OUTLINE_LAYER_INDEX['shield-front'],
  OUTLINE_LAYER_INDEX['weapon-front'],
]);
const BODY_LAYER_INDEX = OUTLINE_LAYER_INDEX.body;

const CARDINAL_OFFSETS = Object.freeze([
  Object.freeze([0, -1]),
  Object.freeze([-1, 0]),
  Object.freeze([1, 0]),
  Object.freeze([0, 1]),
]);

const COMPLETE_OFFSETS = Object.freeze([
  Object.freeze([-1, -1]),
  ...CARDINAL_OFFSETS,
  Object.freeze([1, -1]),
  Object.freeze([-1, 1]),
  Object.freeze([1, 1]),
]);

export function normalizeOutlineMode(value) {
  return OUTLINE_MODES.some((mode) => mode.id === value) ? value : OUTLINE_MODE_NONE;
}

function isTransparent(value) {
  return value === null || value === undefined;
}

function exteriorTransparency(pixels, width, height) {
  const exterior = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let queueStart = 0;
  let queueEnd = 0;

  const visit = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const index = (y * width) + x;
    if (exterior[index] || !isTransparent(pixels[index])) return;
    exterior[index] = 1;
    queue[queueEnd++] = index;
  };

  for (let x = 0; x < width; x++) {
    visit(x, 0);
    visit(x, height - 1);
  }
  for (let y = 1; y < height - 1; y++) {
    visit(0, y);
    visit(width - 1, y);
  }

  while (queueStart < queueEnd) {
    const index = queue[queueStart++];
    const x = index % width;
    const y = Math.floor(index / width);
    for (const [offsetX, offsetY] of CARDINAL_OFFSETS) visit(x + offsetX, y + offsetY);
  }
  return exterior;
}

function contourMaskForPixels(
  pixels,
  mode = OUTLINE_MODE_COMPLETE_B,
  width = SIZE,
  height = SIZE,
  exteriorOnly = true,
) {
  if (!pixels || pixels.length !== width * height) {
    throw new Error(`Outline source must contain exactly ${width * height} pixels.`);
  }

  const normalizedMode = normalizeOutlineMode(mode);
  const mask = new Uint8Array(width * height);
  if (normalizedMode === OUTLINE_MODE_NONE) return mask;

  const offsets = normalizedMode === OUTLINE_MODE_COMPLETE_B
    ? COMPLETE_OFFSETS
    : CARDINAL_OFFSETS;
  const exterior = exteriorOnly ? exteriorTransparency(pixels, width, height) : null;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width) + x;
      if (!isTransparent(pixels[index]) || exteriorOnly && !exterior[index]) continue;
      for (const [offsetX, offsetY] of offsets) {
        const sourceX = x + offsetX;
        const sourceY = y + offsetY;
        if (sourceX < 0 || sourceY < 0 || sourceX >= width || sourceY >= height) continue;
        if (!isTransparent(pixels[(sourceY * width) + sourceX])) {
          mask[index] = 1;
          break;
        }
      }
    }
  }
  return mask;
}

export function outlineMaskForPixels(
  pixels,
  mode = OUTLINE_MODE_COMPLETE_B,
  width = SIZE,
  height = SIZE,
) {
  return contourMaskForPixels(pixels, mode, width, height, true);
}

export function outlineMaskForEquipmentPixels(
  pixels,
  mode = OUTLINE_MODE_COMPLETE_B,
  width = SIZE,
  height = SIZE,
) {
  return contourMaskForPixels(pixels, mode, width, height, false);
}

export function outlineMaskForOwnedPixels(
  ownerPixels,
  compositePixels,
  mode = OUTLINE_MODE_COMPLETE_B,
  width = SIZE,
  height = SIZE,
  options = {},
) {
  if (!Array.isArray(ownerPixels) || !ownerPixels.length) {
    throw new Error('Outline ownership requires at least one pixel layer.');
  }
  if (!compositePixels || compositePixels.length !== width * height) {
    throw new Error(`Outline composite must contain exactly ${width * height} pixels.`);
  }
  for (const pixels of ownerPixels) {
    if (!pixels || pixels.length !== width * height) {
      throw new Error(`Each outline owner must contain exactly ${width * height} pixels.`);
    }
  }

  const normalizedMode = normalizeOutlineMode(mode);
  const mask = new Uint8Array(width * height);
  if (normalizedMode === OUTLINE_MODE_NONE) return mask;

  const interiorOwnerIndices = new Set(options.interiorOwnerIndices || []);

  const ownerMasks = ownerPixels.map((pixels, ownerIndex) => (
    interiorOwnerIndices.has(ownerIndex)
      ? outlineMaskForEquipmentPixels(pixels, normalizedMode, width, height)
      : outlineMaskForPixels(pixels, normalizedMode, width, height)
  ));

  for (let index = 0; index < mask.length; index++) {
    // Preserve the complete contour from every logical owner. The only rejection
    // is assembled artwork: an outline may never replace a source pixel.
    if (!isTransparent(compositePixels[index])) continue;
    if (ownerMasks.some((ownerMask) => ownerMask[index])) mask[index] = 1;
  }
  return mask;
}

export function outlineContactMaskForVisibleOwners(
  visibleOwners,
  sourceOwnerIndex,
  targetOwnerIndex,
  mode = OUTLINE_MODE_COMPLETE_B,
  width = SIZE,
  height = SIZE,
) {
  if (!visibleOwners || visibleOwners.length !== width * height) {
    throw new Error(`Visible outline ownership must contain exactly ${width * height} entries.`);
  }

  const normalizedMode = normalizeOutlineMode(mode);
  const mask = new Uint8Array(width * height);
  if (normalizedMode === OUTLINE_MODE_NONE) return mask;

  // A contact separator may replace a visible pixel, so only a true shared
  // edge counts here. Diagonal proximity is handled by the transparent-space
  // contour and must not bite corners or endcaps out of either owner.
  const offsets = CARDINAL_OFFSETS;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width) + x;
      if (visibleOwners[index] !== sourceOwnerIndex) continue;
      for (const [offsetX, offsetY] of offsets) {
        const targetX = x + offsetX;
        const targetY = y + offsetY;
        if (targetX < 0 || targetY < 0 || targetX >= width || targetY >= height) continue;
        if (visibleOwners[(targetY * width) + targetX] === targetOwnerIndex) {
          mask[index] = 1;
          break;
        }
      }
    }
  }
  return mask;
}

export function humanoidNeckCavityMaskForPixels(
  bodyPixels,
  compositePixels,
  direction,
  width = SIZE,
  height = SIZE,
) {
  if (!bodyPixels || bodyPixels.length !== width * height) {
    throw new Error(`Neck-cavity body source must contain exactly ${width * height} pixels.`);
  }
  if (!compositePixels || compositePixels.length !== width * height) {
    throw new Error(`Neck-cavity composite must contain exactly ${width * height} pixels.`);
  }

  const mask = new Uint8Array(width * height);
  if (direction !== 'down' && direction !== 'up' || width < 16 || height < 14) return mask;

  // The shared front/back humanoid rig has an eight-pixel head base (x 8..15)
  // above a two-pixel neck (x 11..12). Bob and attack poses move the transition
  // vertically, so locate it from rendered pixels instead of assuming one row.
  // Only transparent cells directly beneath the eight-pixel head base are returned. This is
  // an additive repair mask: existing contour and assembled artwork are untouched.
  for (let y = 9; y <= Math.min(14, height - 1); y++) {
    const headBaseIsSolid = [8, 9, 10, 11, 12, 13, 14, 15]
      .every((x) => !isTransparent(bodyPixels[((y - 1) * width) + x]));
    const neckIsPresent = !isTransparent(bodyPixels[(y * width) + 11])
      && !isTransparent(bodyPixels[(y * width) + 12]);
    if (!headBaseIsSolid || !neckIsPresent) continue;

    const transparentSeam = [];
    for (let x = 8; x <= 15; x++) {
      const index = (y * width) + x;
      if (isTransparent(compositePixels[index])) transparentSeam.push(index);
    }
    if (!transparentSeam.length) continue;
    for (const index of transparentSeam) mask[index] = 1;
    break;
  }
  return mask;
}

function renderSpritePixels(spec, direction, animationId, frame, options) {
  const pixels = new Array(SIZE * SIZE).fill(null);
  let fillStyle = '#000000';
  const context = {
    clearRect(x, y, width, height) {
      for (let py = Math.floor(y); py < y + height; py++) {
        for (let px = Math.floor(x); px < x + width; px++) {
          if (px >= 0 && py >= 0 && px < SIZE && py < SIZE) pixels[(py * SIZE) + px] = null;
        }
      }
    },
    get fillStyle() { return fillStyle; },
    set fillStyle(value) { fillStyle = value; },
    fillRect(x, y, width, height) {
      for (let py = Math.floor(y); py < y + height; py++) {
        for (let px = Math.floor(x); px < x + width; px++) {
          if (px >= 0 && py >= 0 && px < SIZE && py < SIZE) pixels[(py * SIZE) + px] = fillStyle;
        }
      }
    },
  };
  drawSprite(context, spec, direction, animationId, frame, options);
  return pixels;
}

function renderLayerPixels(spec, direction, animationId, frame, layer) {
  return renderSpritePixels(spec, direction, animationId, frame, { layer, shadow: false });
}

function paintPixels(context, pixels) {
  for (let y = 0; y < SIZE; y++) {
    let x = 0;
    while (x < SIZE) {
      const color = pixels[(y * SIZE) + x];
      if (isTransparent(color)) {
        x++;
        continue;
      }
      const start = x;
      while (x < SIZE && pixels[(y * SIZE) + x] === color) x++;
      context.fillStyle = color;
      context.fillRect(start, y, x - start, 1);
    }
  }
}

function paintMask(context, mask, color) {
  context.fillStyle = color;
  for (let y = 0; y < SIZE; y++) {
    let x = 0;
    while (x < SIZE) {
      if (!mask[(y * SIZE) + x]) {
        x++;
        continue;
      }
      const start = x;
      while (x < SIZE && mask[(y * SIZE) + x]) x++;
      context.fillRect(start, y, x - start, 1);
    }
  }
}

export function drawOutlinedSprite(
  context,
  spec,
  direction,
  animationId,
  frame,
  options = {},
) {
  const {
    outlineMode = OUTLINE_MODE_NONE,
    outlineColor = OUTLINE_COLOR,
    ...rendererOptions
  } = options;
  const mode = normalizeOutlineMode(outlineMode);

  // None is deliberately the original renderer call, with the original options.
  // Enemies, effects, and individual kit layers are outside the first outline scope.
  if (
    mode === OUTLINE_MODE_NONE
    || spec?.kind !== 'player'
    || (rendererOptions.layer && rendererOptions.layer !== 'complete')
  ) {
    drawSprite(context, spec, direction, animationId, frame, rendererOptions);
    return;
  }

  const color = typeof outlineColor === 'string' && outlineColor ? outlineColor : OUTLINE_COLOR;
  const renderedLayers = new Map(OUTLINE_LAYER_ORDER.map((layer) => [
    layer,
    renderLayerPixels(spec, direction, animationId, frame, layer),
  ]));
  const ownerPixels = OUTLINE_OWNER_GROUPS.map((layers) => {
    const merged = new Array(SIZE * SIZE).fill(null);
    for (const layer of layers) {
      const pixels = renderedLayers.get(layer);
      for (let index = 0; index < merged.length; index++) {
        if (!isTransparent(pixels[index])) merged[index] = pixels[index];
      }
    }
    return merged;
  });
  const visibleLayers = new Int8Array(SIZE * SIZE).fill(-1);
  for (const layer of OUTLINE_LAYER_ORDER) {
    const pixels = renderedLayers.get(layer);
    const layerIndex = OUTLINE_LAYER_INDEX[layer];
    for (let index = 0; index < pixels.length; index++) {
      if (!isTransparent(pixels[index])) visibleLayers[index] = layerIndex;
    }
  }
  const compositePixels = renderLayerPixels(spec, direction, animationId, frame, 'complete');
  const finalPixels = rendererOptions.shadow === false
    && (!rendererOptions.layer || rendererOptions.layer === 'complete')
    ? compositePixels
    : renderSpritePixels(spec, direction, animationId, frame, rendererOptions);

  // Paint only behind the final composite, then repaint the exact offscreen renderer
  // result above it. No contour can cover assembled artwork.
  if (rendererOptions.clear !== false) context.clearRect(0, 0, SIZE, SIZE);
  const outlineMask = outlineMaskForOwnedPixels(
    ownerPixels,
    compositePixels,
    mode,
    SIZE,
    SIZE,
    { interiorOwnerIndices: EQUIPMENT_OWNER_INDICES },
  );
  const neckCavityMask = humanoidNeckCavityMaskForPixels(
    ownerPixels[BODY_OWNER_INDEX],
    compositePixels,
    direction,
  );
  for (let index = 0; index < outlineMask.length; index++) {
    if (neckCavityMask[index]) outlineMask[index] = 1;
  }
  paintMask(context, outlineMask, color);
  paintPixels(context, finalPixels);

  // Direct layer contact has no transparent cell available for a separator.
  // Respect concrete pass depth: back equipment receives the separator on its
  // own edge, while front equipment stays intact and receives the separator on
  // the adjacent body-side edge. Because the concrete headgear pass sits above
  // body in visibleLayers, equipment contact cannot replace a headgear pixel.
  const layerContactMask = new Uint8Array(SIZE * SIZE);
  for (const equipmentLayerIndex of BACK_EQUIPMENT_LAYER_INDICES) {
    const contactMask = outlineContactMaskForVisibleOwners(
      visibleLayers,
      equipmentLayerIndex,
      BODY_LAYER_INDEX,
      mode,
    );
    for (let index = 0; index < layerContactMask.length; index++) {
      if (contactMask[index]) layerContactMask[index] = 1;
    }
  }
  for (const equipmentLayerIndex of FRONT_EQUIPMENT_LAYER_INDICES) {
    const contactMask = outlineContactMaskForVisibleOwners(
      visibleLayers,
      BODY_LAYER_INDEX,
      equipmentLayerIndex,
      mode,
    );
    for (let index = 0; index < layerContactMask.length; index++) {
      if (contactMask[index]) layerContactMask[index] = 1;
    }
  }
  paintMask(context, layerContactMask, color);
}
