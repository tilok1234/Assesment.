import { SIZE } from './catalogs.js';
import { drawPublicSprite as drawSprite } from './public-renderer.js';

export function isTransparentPixel(value) {
  return value === null || value === undefined;
}

export function capturePixels(draw) {
  const pixels = new Array(SIZE * SIZE).fill(null);
  let fillStyle = '#000000';
  const context = {
    clearRect(x, y, width, height) {
      for (let py = Math.floor(y); py < y + height; py++) {
        for (let px = Math.floor(x); px < x + width; px++) {
          if (px >= 0 && py >= 0 && px < SIZE && py < SIZE) {
            pixels[(py * SIZE) + px] = null;
          }
        }
      }
    },
    get fillStyle() { return fillStyle; },
    set fillStyle(value) { fillStyle = value; },
    fillRect(x, y, width, height) {
      for (let py = Math.floor(y); py < y + height; py++) {
        for (let px = Math.floor(x); px < x + width; px++) {
          if (px >= 0 && py >= 0 && px < SIZE && py < SIZE) {
            pixels[(py * SIZE) + px] = fillStyle;
          }
        }
      }
    },
  };
  draw(context);
  return pixels;
}

export function renderSpritePixels(spec, direction, animationId, frame, options = {}) {
  return capturePixels((context) => {
    drawSprite(context, spec, direction, animationId, frame, options);
  });
}

export function renderLayerPixels(
  spec,
  direction,
  animationId,
  frame,
  layer,
  options = {},
) {
  return renderSpritePixels(spec, direction, animationId, frame, {
    ...options,
    layer,
    shadow: false,
  });
}

export function paintPixels(context, pixels, width = SIZE, height = SIZE) {
  for (let y = 0; y < height; y++) {
    let x = 0;
    while (x < width) {
      const color = pixels[(y * width) + x];
      if (isTransparentPixel(color)) {
        x++;
        continue;
      }
      const start = x;
      while (x < width && pixels[(y * width) + x] === color) x++;
      context.fillStyle = color;
      context.fillRect(start, y, x - start, 1);
    }
  }
}

export function paintMask(context, mask, color, width = SIZE, height = SIZE) {
  context.fillStyle = color;
  for (let y = 0; y < height; y++) {
    let x = 0;
    while (x < width) {
      if (!mask[(y * width) + x]) {
        x++;
        continue;
      }
      const start = x;
      while (x < width && mask[(y * width) + x]) x++;
      context.fillRect(start, y, x - start, 1);
    }
  }
}
