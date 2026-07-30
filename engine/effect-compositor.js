import { SIZE } from './catalogs.js';
import { drawSprite } from './renderer.js';

const SHIELD_OCCLUDED_EFFECT_CATEGORIES = new Set(['trails', 'projectiles', 'impacts']);
const SHIELD_LAYERS = ['shield-back', 'shield-front'];

function renderPixels(spec, direction, animationId, frame, options = {}) {
  const pixels = new Array(SIZE * SIZE).fill(null);
  let fillStyle = '#000000';
  const context = {
    clearRect() { pixels.fill(null); },
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

function paintPixels(context, pixels) {
  for (let y = 0; y < SIZE; y++) {
    let x = 0;
    while (x < SIZE) {
      const color = pixels[(y * SIZE) + x];
      if (color == null) {
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

export function drawOccludedCombatEffect(
  context,
  ownerSpec,
  effectSpec,
  direction,
  animationId,
  frame,
) {
  if (!SHIELD_OCCLUDED_EFFECT_CATEGORIES.has(effectSpec?.category)) {
    drawSprite(context, effectSpec, direction, animationId, frame, { shadow: false, clear: false });
    return;
  }

  const effectPixels = renderPixels(effectSpec, direction, animationId, frame, { shadow: false });
  const shieldLayerPixels = SHIELD_LAYERS.map((layer) => renderPixels(
    ownerSpec,
    direction,
    animationId,
    frame,
    { layer, shadow: false },
  ));
  for (let index = 0; index < effectPixels.length; index++) {
    if (shieldLayerPixels.some((pixels) => pixels[index] != null)) effectPixels[index] = null;
  }
  paintPixels(context, effectPixels);
}
