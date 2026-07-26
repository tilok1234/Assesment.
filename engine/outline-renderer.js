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

export const ENEMY_OUTLINE_PILOT_FAMILIES = Object.freeze([
  'bandit',
  'kobold',
  'skeleton',
  'ratfolk',
  'elf',
  'gnoll',
  'harpy',
  'eyemonster',
  'scorpion',
  'crab',
  'beetle',
  'wasp',
  'mimic',
  'drake',
  'elemental',
  'wolf',
  'boar',
  'bear',
  'bigcat',
  'crocodile',
  'turtle',
  'griffin',
  'slime',
  'shroom',
  'bat',
  'ghost',
  'golem',
  'snake',
  'frog',
  'jellyfish',
  'scarecrow',
  'gargoyle',
  'worm',
  'mantis',
  'moth',
  'puppet',
  'spider',
  'treant',
  'centipede',
  'mole',
  'carniplant',
  'octopus',
  'cyclops',
  'troll',
  'dwarf',
]);
const ENEMY_OUTLINE_FAMILY_SET = new Set(ENEMY_OUTLINE_PILOT_FAMILIES);
// Layered humanoid enemies share the player renderer's concrete body,
// headgear, weapon, and shield passes. Keep this list approval-gated so solid
// creatures retain the simpler exterior-only contour while humanoid families
// enter the component-aware path only after their own approval gate.
const ENEMY_COMPONENT_OUTLINE_FAMILY_SET = new Set([
  'bandit',
  'kobold',
  'skeleton',
  'ratfolk',
  'elf',
  'gnoll',
  'dwarf',
]);
const ENEMY_COMPONENT_OUTLINE_PRESERVE_CAVITY_FAMILY_SET = new Set([
  'dwarf',
]);
// Orbiting one-pixel parts need their own contour ownership. A normal merged
// silhouette contour fills the one-cell breathing room and visually welds them
// back onto the body.
const ENEMY_SEPARATED_OUTLINE_FAMILY_SET = new Set([
  'eyemonster',
  'crab',
  'beetle',
  'wasp',
  'drake',
  'frog',
  'jellyfish',
  'scarecrow',
  'gargoyle',
  'worm',
  'mantis',
  'moth',
  'puppet',
  'spider',
  'treant',
  'centipede',
  'mole',
  'carniplant',
  'octopus',
]);
const ENEMY_SEPARATED_OUTLINE_MINIMUM_COMPONENT_PIXELS = Object.freeze({
  beetle: 3,
  crab: 2,
  wasp: 2,
  drake: 2,
  frog: 3,
  jellyfish: 2,
  scarecrow: 2,
  worm: 2,
  mantis: 3,
  moth: 2,
  puppet: 2,
  spider: 9,
  treant: 2,
  centipede: 2,
  mole: 2,
  carniplant: 3,
  octopus: 10,
});
const ENEMY_SEPARATED_OUTLINE_PRESERVE_CAVITY_FAMILY_SET = new Set([
  'centipede',
  'mole',
  'carniplant',
]);
const ENEMY_SEPARATED_OUTLINE_INTERIOR_CAVITY_FAMILY_SET = new Set([
  'octopus',
]);
const ENEMY_SEPARATED_OUTLINE_SINGLE_PIXEL_MINIMUM_Y = Object.freeze({
  carniplant: 19,
  octopus: 19,
});

export function enemySupportsOutline(spec) {
  return spec?.kind === 'enemy' && ENEMY_OUTLINE_FAMILY_SET.has(spec.family);
}

function enemyUsesComponentOutline(spec) {
  return spec?.kind === 'enemy' && ENEMY_COMPONENT_OUTLINE_FAMILY_SET.has(spec.family);
}

function enemyPreservesComponentOutlineCavities(spec) {
  return spec?.kind === 'enemy'
    && ENEMY_COMPONENT_OUTLINE_PRESERVE_CAVITY_FAMILY_SET.has(spec.family);
}

function enemyUsesSeparatedOutline(spec) {
  return spec?.kind === 'enemy' && ENEMY_SEPARATED_OUTLINE_FAMILY_SET.has(spec.family);
}

function enemyPreservesSeparatedOutlineCavities(spec) {
  return spec?.kind === 'enemy'
    && ENEMY_SEPARATED_OUTLINE_PRESERVE_CAVITY_FAMILY_SET.has(spec.family);
}

function enemyOutlinesSeparatedInteriorCavities(spec) {
  return spec?.kind === 'enemy'
    && ENEMY_SEPARATED_OUTLINE_INTERIOR_CAVITY_FAMILY_SET.has(spec.family);
}

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
const FRONT_EQUIPMENT_LAYER_INDICES = Object.freeze([
  OUTLINE_LAYER_INDEX['shield-front'],
  OUTLINE_LAYER_INDEX['weapon-front'],
]);
const BODY_LAYER_INDEX = OUTLINE_LAYER_INDEX.body;
const HEADGEAR_LAYER_INDEX = OUTLINE_LAYER_INDEX.headgear;

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

// One-to-four-pixel enclosed pockets are usually construction noise at 24x24:
// outlining all of them turns bone lattices, crossbow joints, staff heads, and
// late-tier ornaments into dark mazes. Larger openings remain eligible because
// they define forms such as bows. This threshold is geometry-based, not tied to
// any equipment family or tier.
const MIN_EQUIPMENT_INTERIOR_AREA = 5;

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

function equipmentEligibleTransparency(pixels, width, height, minimumInteriorArea) {
  const eligible = exteriorTransparency(pixels, width, height);
  const visited = new Uint8Array(eligible);

  for (let start = 0; start < pixels.length; start++) {
    if (!isTransparent(pixels[start]) || visited[start]) continue;
    const component = [];
    const queue = [start];
    visited[start] = 1;

    while (queue.length) {
      const index = queue.pop();
      component.push(index);
      const x = index % width;
      const y = Math.floor(index / width);
      for (const [offsetX, offsetY] of CARDINAL_OFFSETS) {
        const nextX = x + offsetX;
        const nextY = y + offsetY;
        if (nextX < 0 || nextY < 0 || nextX >= width || nextY >= height) continue;
        const next = (nextY * width) + nextX;
        if (!isTransparent(pixels[next]) || visited[next]) continue;
        visited[next] = 1;
        queue.push(next);
      }
    }

    if (component.length >= minimumInteriorArea) {
      for (const index of component) eligible[index] = 1;
    }
  }
  return eligible;
}

function contourMaskForPixels(
  pixels,
  mode = OUTLINE_MODE_COMPLETE_B,
  width = SIZE,
  height = SIZE,
  exteriorOnly = true,
  options = {},
) {
  if (!pixels || pixels.length !== width * height) {
    throw new Error(`Outline source must contain exactly ${width * height} pixels.`);
  }

  const normalizedMode = normalizeOutlineMode(mode);
  const mask = new Uint8Array(width * height);
  if (normalizedMode === OUTLINE_MODE_NONE) return mask;

  const sourceExclusionMask = options.sourceExclusionMask || null;
  if (sourceExclusionMask && sourceExclusionMask.length !== width * height) {
    throw new Error(`Outline source exclusion must contain exactly ${width * height} entries.`);
  }

  const offsets = !options.cardinalOnly && normalizedMode === OUTLINE_MODE_COMPLETE_B
    ? COMPLETE_OFFSETS
    : CARDINAL_OFFSETS;
  const exterior = exteriorTransparency(pixels, width, height);
  const eligible = exteriorOnly
    ? exterior
    : equipmentEligibleTransparency(
      pixels,
      width,
      height,
      options.minimumInteriorArea || 1,
    );

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width) + x;
      if (!isTransparent(pixels[index]) || !eligible[index]) continue;
      for (const [offsetX, offsetY] of offsets) {
        const sourceX = x + offsetX;
        const sourceY = y + offsetY;
        if (sourceX < 0 || sourceY < 0 || sourceX >= width || sourceY >= height) continue;
        const sourceIndex = (sourceY * width) + sourceX;
        const excludedExteriorSource = exterior[index] && sourceExclusionMask?.[sourceIndex];
        if (!isTransparent(pixels[sourceIndex]) && !excludedExteriorSource) {
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
  options = {},
) {
  return contourMaskForPixels(pixels, mode, width, height, true, options);
}

function connectedSourceComponents(pixels, width, height) {
  const components = [];
  const sourceOwners = new Int16Array(width * height).fill(-1);

  for (let start = 0; start < pixels.length; start++) {
    if (isTransparent(pixels[start]) || sourceOwners[start] >= 0) continue;
    const ownerIndex = components.length;
    const componentPixels = new Array(width * height).fill(null);
    const queue = [start];
    sourceOwners[start] = ownerIndex;

    while (queue.length) {
      const index = queue.pop();
      componentPixels[index] = pixels[index];
      const x = index % width;
      const y = Math.floor(index / width);
      for (const [offsetX, offsetY] of CARDINAL_OFFSETS) {
        const nextX = x + offsetX;
        const nextY = y + offsetY;
        if (nextX < 0 || nextY < 0 || nextX >= width || nextY >= height) continue;
        const nextIndex = (nextY * width) + nextX;
        if (
          isTransparent(pixels[nextIndex])
          || sourceOwners[nextIndex] >= 0
        ) continue;
        sourceOwners[nextIndex] = ownerIndex;
        queue.push(nextIndex);
      }
    }
    components.push(componentPixels);
  }

  return { components, sourceOwners };
}

function outlineMaskForSeparatedComponents(
  pixels,
  mode = OUTLINE_MODE_COMPLETE_B,
  width = SIZE,
  height = SIZE,
  options = {},
) {
  const { components, sourceOwners } = connectedSourceComponents(pixels, width, height);
  if (components.length <= 1) return outlineMaskForPixels(pixels, mode, width, height);

  const minimumComponentPixels = Math.max(1, options.minimumComponentPixels || 1);
  const combinedExterior = options.preserveSourceCavities
    ? exteriorTransparency(pixels, width, height)
    : null;
  const componentMasks = components.map((componentPixels) => {
    const componentSize = componentPixels.reduce((
      count,
      pixel,
    ) => count + (isTransparent(pixel) ? 0 : 1), 0);
    const outlinesBottomSinglePixel =
      componentSize === 1
      && Number.isInteger(options.singlePixelMinimumY)
      && componentPixels.some((
        pixel,
        index,
      ) => !isTransparent(pixel) && Math.floor(index / width) >= options.singlePixelMinimumY);
    return componentSize < minimumComponentPixels && !outlinesBottomSinglePixel
      ? new Uint8Array(width * height)
      : outlineMaskForPixels(componentPixels, mode, width, height);
  });
  const outlineOwners = new Int16Array(width * height).fill(-1);

  for (let index = 0; index < pixels.length; index++) {
    if (!isTransparent(pixels[index])) continue;
    let candidateOwner = -1;
    let candidateCount = 0;
    for (let ownerIndex = 0; ownerIndex < componentMasks.length; ownerIndex++) {
      if (!componentMasks[ownerIndex][index]) continue;
      candidateOwner = ownerIndex;
      candidateCount++;
    }
    if (candidateCount === 1) outlineOwners[index] = candidateOwner;
  }

  const mask = new Uint8Array(width * height);
  for (let index = 0; index < outlineOwners.length; index++) {
    const ownerIndex = outlineOwners[index];
    if (ownerIndex < 0) continue;
    // Per-component contouring sees a cavity enclosed by multiple authored
    // components as exterior space. For cavity-sensitive families, keep those
    // combined-silhouette holes transparent instead of closing them with halo.
    if (combinedExterior && !combinedExterior[index]) continue;
    const x = index % width;
    const y = Math.floor(index / width);
    let touchesAnotherOwner = false;
    for (const [offsetX, offsetY] of CARDINAL_OFFSETS) {
      const nextX = x + offsetX;
      const nextY = y + offsetY;
      if (nextX < 0 || nextY < 0 || nextX >= width || nextY >= height) continue;
      const nextIndex = (nextY * width) + nextX;
      if (
        (
          sourceOwners[nextIndex] >= 0
          && sourceOwners[nextIndex] !== ownerIndex
        )
        || (
          outlineOwners[nextIndex] >= 0
          && outlineOwners[nextIndex] !== ownerIndex
        )
      ) {
        touchesAnotherOwner = true;
        break;
      }
    }
    if (!touchesAnotherOwner) mask[index] = 1;
  }

  // Removing cross-owner bridges can strand halo pixels on the far side of a
  // protected gap. Keep only outline cells that are still cardinally reachable
  // from their own authored source component.
  const reachableOutline = new Uint8Array(width * height);
  for (let ownerIndex = 0; ownerIndex < components.length; ownerIndex++) {
    const visited = new Uint8Array(width * height);
    const queue = [];
    for (let index = 0; index < sourceOwners.length; index++) {
      if (sourceOwners[index] !== ownerIndex) continue;
      visited[index] = 1;
      queue.push(index);
    }
    while (queue.length) {
      const index = queue.pop();
      const x = index % width;
      const y = Math.floor(index / width);
      for (const [offsetX, offsetY] of CARDINAL_OFFSETS) {
        const nextX = x + offsetX;
        const nextY = y + offsetY;
        if (nextX < 0 || nextY < 0 || nextX >= width || nextY >= height) continue;
        const nextIndex = (nextY * width) + nextX;
        if (visited[nextIndex]) continue;
        const sameSource = sourceOwners[nextIndex] === ownerIndex;
        const sameOutline = mask[nextIndex] && outlineOwners[nextIndex] === ownerIndex;
        if (!sameSource && !sameOutline) continue;
        visited[nextIndex] = 1;
        queue.push(nextIndex);
        if (sameOutline) reachableOutline[nextIndex] = 1;
      }
    }
  }
  for (let index = 0; index < mask.length; index++) {
    if (mask[index] && !reachableOutline[index]) mask[index] = 0;
  }
  // Octopus tentacles use narrow enclosed transparent channels as authored
  // separation lines. The full-tentacle treatment deliberately contours those
  // channels after exterior component ownership has been resolved.
  if (options.outlineInteriorCavities) {
    const combinedExteriorMask = exteriorTransparency(pixels, width, height);
    const combinedInteriorContour = contourMaskForPixels(
      pixels,
      mode,
      width,
      height,
      false,
    );
    for (let index = 0; index < mask.length; index++) {
      if (!combinedExteriorMask[index] && combinedInteriorContour[index]) {
        mask[index] = 1;
      }
    }
  }
  return mask;
}

export function outlineMaskForEquipmentPixels(
  pixels,
  mode = OUTLINE_MODE_COMPLETE_B,
  width = SIZE,
  height = SIZE,
  options = {},
) {
  const normalizedMode = normalizeOutlineMode(mode);
  // Complete B is the strong eight-neighbor equipment contour; Selective C
  // stays cardinal so one-pixel shafts and tiny held items keep more breathing
  // room. Both modes suppress tiny enclosed construction pockets while retaining
  // substantial silhouette-defining openings.
  return contourMaskForPixels(pixels, mode, width, height, false, {
    ...options,
    cardinalOnly: normalizedMode !== OUTLINE_MODE_COMPLETE_B,
    minimumInteriorArea: MIN_EQUIPMENT_INTERIOR_AREA,
  });
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
  const haloSourceExclusionMasks = options.haloSourceExclusionMasks || [];
  const compositeExterior = options.preserveSourceCavities
    ? exteriorTransparency(compositePixels, width, height)
    : null;
  for (const exclusionMask of haloSourceExclusionMasks) {
    if (exclusionMask && exclusionMask.length !== width * height) {
      throw new Error(`Each halo source exclusion must contain exactly ${width * height} entries.`);
    }
  }

  const ownerMasks = ownerPixels.map((pixels, ownerIndex) => (
    interiorOwnerIndices.has(ownerIndex)
      ? outlineMaskForEquipmentPixels(pixels, normalizedMode, width, height, {
        sourceExclusionMask: haloSourceExclusionMasks[ownerIndex],
      })
      : outlineMaskForPixels(pixels, normalizedMode, width, height, {
        sourceExclusionMask: haloSourceExclusionMasks[ownerIndex],
      })
  ));

  for (let index = 0; index < mask.length; index++) {
    // Preserve the complete contour from every logical owner. The only rejection
    // is assembled artwork: an outline may never replace a source pixel.
    if (!isTransparent(compositePixels[index])) continue;
    if (compositeExterior && !compositeExterior[index]) continue;
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

function touchesVisibleLayerColorCardinally(
  visibleLayers,
  visiblePixels,
  index,
  targetLayerIndex,
  targetColor,
  width,
  height,
) {
  const x = index % width;
  const y = Math.floor(index / width);
  for (const [offsetX, offsetY] of CARDINAL_OFFSETS) {
    const targetX = x + offsetX;
    const targetY = y + offsetY;
    if (targetX < 0 || targetY < 0 || targetX >= width || targetY >= height) continue;
    const targetIndex = (targetY * width) + targetX;
    if (
      visibleLayers[targetIndex] === targetLayerIndex
      && visiblePixels[targetIndex] === targetColor
    ) return true;
  }
  return false;
}

function contactOutlinePlanForVisibleLayers(
  visibleLayers,
  visiblePixels,
  mode,
  width = SIZE,
  height = SIZE,
) {
  const layerContactMask = new Uint8Array(width * height);
  const haloSourceExclusionMasks = OUTLINE_OWNER_GROUPS.map(() => new Uint8Array(width * height));

  const addContactMask = (contactMask, sourceOwnerIndex) => {
    for (let index = 0; index < contactMask.length; index++) {
      if (!contactMask[index]) continue;
      layerContactMask[index] = 1;
      // A source pixel converted into a one-pixel contact separator is already
      // outline. Letting that hidden source cast a second exterior halo makes
      // nearby owner contours fuse into thick shelves and bridges.
      haloSourceExclusionMasks[sourceOwnerIndex][index] = 1;
    }
  };

  // Back-pass equipment is already separated by body occlusion and its exterior
  // contour. Replacing its visible edge here can erase an entire one-pixel
  // shaft, blade, or shield rim in side view, so no source equipment pixel is
  // converted into an interior contact separator.
  for (const equipmentLayerIndex of FRONT_EQUIPMENT_LAYER_INDICES) {
    const contactMask = outlineContactMaskForVisibleOwners(
      visibleLayers,
      BODY_LAYER_INDEX,
      equipmentLayerIndex,
      mode,
      width,
      height,
    );
    for (let index = 0; index < contactMask.length; index++) {
      if (
        !contactMask[index]
        || visiblePixels[index] === OUTLINE_COLOR
        || !touchesVisibleLayerColorCardinally(
          visibleLayers,
          visiblePixels,
          index,
          BODY_LAYER_INDEX,
          OUTLINE_COLOR,
          width,
          height,
        )
      ) continue;

      // Replacing this body pixel would lengthen an existing dark facial/body
      // feature. Keep the body color and omit this single interior separator:
      // moving it onto front equipment can break a one-pixel shaft or grip.
      contactMask[index] = 0;
    }
    addContactMask(contactMask, BODY_OWNER_INDEX);

    // Front equipment must remain visually continuous across a headgear
    // contact. Put that separator on the occluded headgear edge, matching the
    // body-side depth rule, instead of turning a thin weapon or shield rim black.
    const headgearContactMask = outlineContactMaskForVisibleOwners(
      visibleLayers,
      HEADGEAR_LAYER_INDEX,
      equipmentLayerIndex,
      mode,
      width,
      height,
    );
    addContactMask(headgearContactMask, BODY_OWNER_INDEX);
  }

  return { layerContactMask, haloSourceExclusionMasks };
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
  // Effects, unsupported enemies, and individual kit layers stay outside this
  // approval-gated outline scope.
  if (
    mode === OUTLINE_MODE_NONE
    || (spec?.kind !== 'player' && !enemySupportsOutline(spec))
    || (rendererOptions.layer && rendererOptions.layer !== 'complete')
  ) {
    drawSprite(context, spec, direction, animationId, frame, rendererOptions);
    return;
  }

  const color = typeof outlineColor === 'string' && outlineColor ? outlineColor : OUTLINE_COLOR;
  if (enemySupportsOutline(spec) && !enemyUsesComponentOutline(spec)) {
    const { onOutOfBounds, ...sourceOptions } = rendererOptions;
    const sourcePixels = renderSpritePixels(spec, direction, animationId, frame, {
      ...sourceOptions,
      clear: true,
      shadow: false,
    });
    const finalPixels = rendererOptions.shadow === false
      ? sourcePixels
      : renderSpritePixels(spec, direction, animationId, frame, rendererOptions);
    const outlineMask = enemyUsesSeparatedOutline(spec)
      ? outlineMaskForSeparatedComponents(sourcePixels, mode, SIZE, SIZE, {
        // Crab legs are authored as diagonal chains of isolated one-pixel
        // segments. Beetle legs are similarly delicate one- or two-pixel
        // components, while its three-pixel attack antenna/horn tips still
        // need their own contour. Wasp's detached wings need contours, while
        // its one-pixel stinger and Drake's one-pixel breath spark do not.
        // Drake's rebuilt body, wings, neck, head, and horns form one
        // outline-native physical component in every direction. Frog's
        // two-pixel tongue tip, Worm's dirt specks, Mantis/Moth's tiny
        // extremities, and Puppet's one-pixel strings/lights stay unhaloed.
        // Spider's small leg clusters, Treant's one-pixel leaf tips, and
        // Centipede/Mole's one-pixel leg and dirt accents, plus Carnivorous
        // Plant's one-pixel pollen and Octopus's one- and two-pixel ink
        // droplets also stay thin. Their low one-pixel root/tentacle tips are
        // separately opted into contours so physical limbs do not look
        // truncated.
        // Gargoyle's detached wings, Puppet's detached attack arm, Treant's
        // canopy, Mole's detached attack claws, Carnivorous Plant's
        // three-pixel-or-larger stepping roots, and Octopus's ten-pixel-or-
        // larger tentacle groups are meaningful physical components and
        // receive normal contours. Eye Monster keeps the default because its
        // orbitals are intended to read as individually outlined floating
        // parts.
        minimumComponentPixels:
          ENEMY_SEPARATED_OUTLINE_MINIMUM_COMPONENT_PIXELS[spec.family] || 1,
        preserveSourceCavities: enemyPreservesSeparatedOutlineCavities(spec),
        outlineInteriorCavities: enemyOutlinesSeparatedInteriorCavities(spec),
        singlePixelMinimumY:
          ENEMY_SEPARATED_OUTLINE_SINGLE_PIXEL_MINIMUM_Y[spec.family],
      })
      : outlineMaskForPixels(sourcePixels, mode, SIZE, SIZE);

    if (rendererOptions.clear !== false) context.clearRect(0, 0, SIZE, SIZE);
    paintMask(context, outlineMask, color);
    paintPixels(context, finalPixels);
    return;
  }

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
  const contactOutlinePlan = contactOutlinePlanForVisibleLayers(visibleLayers, compositePixels, mode);

  // Paint only behind the final composite, then repaint the exact offscreen renderer
  // result above it. No contour can cover assembled artwork.
  if (rendererOptions.clear !== false) context.clearRect(0, 0, SIZE, SIZE);
  const outlineMask = outlineMaskForOwnedPixels(
    ownerPixels,
    compositePixels,
    mode,
    SIZE,
    SIZE,
    {
      interiorOwnerIndices: EQUIPMENT_OWNER_INDICES,
      haloSourceExclusionMasks: contactOutlinePlan.haloSourceExclusionMasks,
      preserveSourceCavities: enemyPreservesComponentOutlineCavities(spec),
    },
  );
  if (!enemyPreservesComponentOutlineCavities(spec)) {
    const neckCavityMask = humanoidNeckCavityMaskForPixels(
      ownerPixels[BODY_OWNER_INDEX],
      compositePixels,
      direction,
    );
    for (let index = 0; index < outlineMask.length; index++) {
      if (neckCavityMask[index]) outlineMask[index] = 1;
    }
  }
  paintMask(context, outlineMask, color);
  paintPixels(context, finalPixels);

  // Direct layer contact has no transparent cell available for a separator.
  // Preserve every visible equipment source pixel: back equipment is separated
  // by natural occlusion, while front equipment receives any necessary seam on
  // the adjacent body/headgear side.
  paintMask(context, contactOutlinePlan.layerContactMask, color);
}
