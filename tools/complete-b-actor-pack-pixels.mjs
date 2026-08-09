import { inflateSync } from 'node:zlib';

import {
  OUTLINE_COLOR,
  OUTLINE_MODE_COMPLETE_B,
  outlineMaskForPixels,
} from '../engine/outline-renderer.js';
import { encodeRgbaPng, hexToRgba } from './enemy-expansion-review-pixels.mjs';

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

export class PixelCanvas {
  constructor() {
    this._width = 0;
    this._height = 0;
    this.pixels = [];
    this.context = new PixelCanvasContext(this);
  }

  get width() { return this._width; }
  set width(value) { this._width = value; this.resize(); }
  get height() { return this._height; }
  set height(value) { this._height = value; this.resize(); }
  resize() { this.pixels = new Array(this._width * this._height).fill(null); }
  getContext(kind) { return kind === '2d' ? this.context : null; }
}

class PixelCanvasContext {
  constructor(canvas) {
    this.canvas = canvas;
    this.fillStyle = '#000000';
    this.imageSmoothingEnabled = false;
  }

  clearRect(x, y, width, height) {
    for (let py = Math.floor(y); py < Math.ceil(y + height); py++) {
      for (let px = Math.floor(x); px < Math.ceil(x + width); px++) {
        if (px >= 0 && py >= 0 && px < this.canvas.width && py < this.canvas.height) {
          this.canvas.pixels[(py * this.canvas.width) + px] = null;
        }
      }
    }
  }

  fillRect(x, y, width, height) {
    for (let py = Math.floor(y); py < Math.ceil(y + height); py++) {
      for (let px = Math.floor(x); px < Math.ceil(x + width); px++) {
        if (px >= 0 && py >= 0 && px < this.canvas.width && py < this.canvas.height) {
          this.canvas.pixels[(py * this.canvas.width) + px] = this.fillStyle;
        }
      }
    }
  }

  drawImage(source, destinationX, destinationY, destinationWidth = source.width, destinationHeight = source.height) {
    for (let y = 0; y < destinationHeight; y++) {
      for (let x = 0; x < destinationWidth; x++) {
        const sourceX = Math.floor((x * source.width) / destinationWidth);
        const sourceY = Math.floor((y * source.height) / destinationHeight);
        const targetX = destinationX + x;
        const targetY = destinationY + y;
        if (targetX < 0 || targetY < 0 || targetX >= this.canvas.width || targetY >= this.canvas.height) continue;
        const pixel = source.pixels[(sourceY * source.width) + sourceX];
        if (pixel !== null) this.canvas.pixels[(targetY * this.canvas.width) + targetX] = pixel;
      }
    }
  }
}

export function pixelsToRgba(pixels) {
  const rgba = Buffer.alloc(pixels.length * 4);
  const colors = new Map();
  let opaquePixels = 0;
  for (let index = 0; index < pixels.length; index++) {
    const color = pixels[index];
    if (color === null) continue;
    if (!colors.has(color)) colors.set(color, hexToRgba(color));
    const [red, green, blue] = colors.get(color);
    const offset = index * 4;
    rgba[offset] = red;
    rgba[offset + 1] = green;
    rgba[offset + 2] = blue;
    rgba[offset + 3] = 255;
    opaquePixels++;
  }
  return { rgba, opaquePixels };
}

function paeth(left, up, upperLeft) {
  const estimate = left + up - upperLeft;
  const leftDistance = Math.abs(estimate - left);
  const upDistance = Math.abs(estimate - up);
  const upperLeftDistance = Math.abs(estimate - upperLeft);
  if (leftDistance <= upDistance && leftDistance <= upperLeftDistance) return left;
  return upDistance <= upperLeftDistance ? up : upperLeft;
}

export function decodeRgbaPng(buffer, label = 'PNG') {
  assert(Buffer.isBuffer(buffer), `${label} must be a Buffer.`);
  assert(buffer.length >= 33 && buffer.subarray(0, 8).equals(PNG_SIGNATURE), `${label} has an invalid PNG signature.`);
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  const bitDepth = buffer[24];
  const colorType = buffer[25];
  const interlace = buffer[28];
  assert(bitDepth === 8 && colorType === 6 && interlace === 0, `${label} must be non-interlaced 8-bit RGBA.`);

  const chunks = [];
  for (let offset = 8; offset + 12 <= buffer.length;) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString('ascii');
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    if (type === 'IDAT') chunks.push(buffer.subarray(dataStart, dataEnd));
    offset = dataEnd + 4;
    if (type === 'IEND') break;
  }
  assert(chunks.length > 0, `${label} has no image data.`);

  const bytesPerPixel = 4;
  const stride = width * bytesPerPixel;
  const raw = inflateSync(Buffer.concat(chunks));
  assert(raw.length === (stride + 1) * height, `${label} has an unexpected decompressed length.`);
  const rgba = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    const sourceStart = y * (stride + 1);
    const filter = raw[sourceStart];
    assert(filter >= 0 && filter <= 4, `${label} uses unsupported PNG filter ${filter}.`);
    for (let x = 0; x < stride; x++) {
      const encoded = raw[sourceStart + 1 + x];
      const target = y * stride + x;
      const left = x >= bytesPerPixel ? rgba[target - bytesPerPixel] : 0;
      const up = y > 0 ? rgba[target - stride] : 0;
      const upperLeft = y > 0 && x >= bytesPerPixel ? rgba[target - stride - bytesPerPixel] : 0;
      const predictor = filter === 1
        ? left
        : filter === 2
          ? up
          : filter === 3
            ? Math.floor((left + up) / 2)
            : filter === 4
              ? paeth(left, up, upperLeft)
              : 0;
      rgba[target] = (encoded + predictor) & 0xff;
    }
  }
  return { width, height, rgba };
}

export function hardAlphaStats(rgba) {
  assert(Buffer.isBuffer(rgba) && rgba.length % 4 === 0, 'RGBA data has the wrong length.');
  let transparentPixels = 0;
  let opaquePixels = 0;
  for (let offset = 3; offset < rgba.length; offset += 4) {
    const alpha = rgba[offset];
    assert(alpha === 0 || alpha === 255, `Expected hard alpha, received ${alpha}.`);
    if (alpha === 0) transparentPixels++;
    else opaquePixels++;
  }
  return { transparentPixels, opaquePixels };
}

export function countColor(rgba, color) {
  const [red, green, blue] = hexToRgba(color);
  let count = 0;
  for (let offset = 0; offset < rgba.length; offset += 4) {
    if (rgba[offset] === red && rgba[offset + 1] === green && rgba[offset + 2] === blue && rgba[offset + 3] === 255) count++;
  }
  return count;
}

export function applyCompleteBToRgbaFrame(rgba, width, height) {
  assert(Buffer.isBuffer(rgba) && rgba.length === width * height * 4, 'Frame RGBA length does not match its dimensions.');
  hardAlphaStats(rgba);
  const pixels = new Array(width * height).fill(null);
  for (let index = 0; index < pixels.length; index++) {
    const offset = index * 4;
    if (rgba[offset + 3] === 0) continue;
    pixels[index] = `#${rgba[offset].toString(16).padStart(2, '0')}${rgba[offset + 1].toString(16).padStart(2, '0')}${rgba[offset + 2].toString(16).padStart(2, '0')}`;
  }
  const mask = outlineMaskForPixels(pixels, OUTLINE_MODE_COMPLETE_B, width, height);
  const outlined = Buffer.from(rgba);
  const [red, green, blue] = hexToRgba(OUTLINE_COLOR);
  let addedPixels = 0;
  for (let index = 0; index < mask.length; index++) {
    if (!mask[index]) continue;
    const offset = index * 4;
    assert(outlined[offset + 3] === 0, 'Complete B attempted to overwrite a source pixel.');
    outlined[offset] = red;
    outlined[offset + 1] = green;
    outlined[offset + 2] = blue;
    outlined[offset + 3] = 255;
    addedPixels++;
  }
  return { rgba: outlined, addedPixels };
}

export function encodePixelsPng(width, height, pixels) {
  const { rgba, opaquePixels } = pixelsToRgba(pixels);
  return { data: encodeRgbaPng(width, height, rgba), rgba, opaquePixels };
}

export function blitRgba(source, sourceWidth, sourceHeight, target, targetWidth, x, y) {
  for (let row = 0; row < sourceHeight; row++) {
    const sourceStart = row * sourceWidth * 4;
    const targetStart = (((y + row) * targetWidth) + x) * 4;
    source.copy(target, targetStart, sourceStart, sourceStart + (sourceWidth * 4));
  }
}
