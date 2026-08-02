import { createHash } from 'node:crypto';
import { deflateSync } from 'node:zlib';
import { renderEnemyExpansionFrame } from '../engine/enemy-expansion.js';

const HEX_COLOR = /^#([0-9a-f]{6})$/i;
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const PNG_CRC_TABLE = Array.from({ length: 256 }, (_, value) => {
  let crc = value;
  for (let bit = 0; bit < 8; bit++) crc = (crc & 1) ? (0xedb88320 ^ (crc >>> 1)) : (crc >>> 1);
  return crc >>> 0;
});

function assert(condition, message) {
  if (!condition) throw new TypeError(message);
}

function pngCrc(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = PNG_CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(pngCrc(Buffer.concat([typeBytes, data])));
  return Buffer.concat([length, typeBytes, data, crc]);
}

export function encodeRgbaPng(width, height, rgba) {
  assert(Number.isInteger(width) && width > 0, 'PNG width must be a positive integer.');
  assert(Number.isInteger(height) && height > 0, 'PNG height must be a positive integer.');
  assert(Buffer.isBuffer(rgba) && rgba.length === width * height * 4, 'PNG RGBA buffer has the wrong length.');
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;
  const stride = width * 4;
  const rows = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    rgba.copy(rows, (y * (stride + 1)) + 1, y * stride, (y + 1) * stride);
  }
  return Buffer.concat([
    PNG_SIGNATURE,
    pngChunk('IHDR', header),
    pngChunk('IDAT', deflateSync(rows, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

export function hexToRgba(color, alpha = 255) {
  const match = HEX_COLOR.exec(color || '');
  assert(match, 'Expected a six-digit hex color, received ' + color + '.');
  const value = Number.parseInt(match[1], 16);
  return [(value >>> 16) & 0xff, (value >>> 8) & 0xff, value & 0xff, alpha];
}

export function pixelDigest(pixels) {
  return createHash('sha256').update(JSON.stringify(pixels)).digest('hex');
}

export function alphaDigest(pixels) {
  const mask = pixels.map((color) => color === null ? '0' : '1').join('');
  return createHash('sha256').update(mask).digest('hex');
}

export function captureEnemyExpansionFrame(registry, spec, direction, animation, frame, size = 24) {
  const pixels = new Array(size * size).fill(null);
  const outOfBoundsWrites = [];
  let fillStyle = '#000000';
  const context = {
    get fillStyle() { return fillStyle; },
    set fillStyle(value) { fillStyle = value; },
    onOutOfBounds(write) { outOfBoundsWrites.push({ ...write }); },
    clearRect(x, y, width, height) {
      for (let py = Math.floor(y); py < y + height; py++) {
        for (let px = Math.floor(x); px < x + width; px++) {
          if (px < 0 || py < 0 || px >= size || py >= size) {
            outOfBoundsWrites.push({ x: px, y: py, operation: 'clearRect' });
          } else {
            pixels[(py * size) + px] = null;
          }
        }
      }
    },
    fillRect(x, y, width, height) {
      for (let py = Math.floor(y); py < y + height; py++) {
        for (let px = Math.floor(x); px < x + width; px++) {
          if (px < 0 || py < 0 || px >= size || py >= size) {
            outOfBoundsWrites.push({ x: px, y: py, operation: 'fillRect', color: fillStyle });
          } else {
            pixels[(py * size) + px] = fillStyle;
          }
        }
      }
    },
  };
  const renderResult = renderEnemyExpansionFrame(registry, spec, direction, animation, frame, context);
  const occupied = [];
  for (let index = 0; index < pixels.length; index++) {
    if (pixels[index] !== null) occupied.push({ x: index % size, y: Math.floor(index / size) });
  }
  const bounds = occupied.length === 0 ? null : {
    minX: Math.min(...occupied.map((pixel) => pixel.x)),
    minY: Math.min(...occupied.map((pixel) => pixel.y)),
    maxX: Math.max(...occupied.map((pixel) => pixel.x)),
    maxY: Math.max(...occupied.map((pixel) => pixel.y)),
  };
  return Object.freeze({
    width: size,
    height: size,
    pixels: Object.freeze(pixels),
    colors: Object.freeze([...new Set(pixels.filter((color) => color !== null))].sort()),
    alpha: Uint8Array.from(pixels, (color) => color === null ? 0 : 255),
    opaquePixels: occupied.length,
    bounds: bounds && Object.freeze(bounds),
    outOfBoundsWrites: Object.freeze(outOfBoundsWrites),
    digest: pixelDigest(pixels),
    alphaDigest: alphaDigest(pixels),
    renderResult,
  });
}

export function mirrorPixels(pixels, size = 24) {
  const mirrored = new Array(size * size).fill(null);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    mirrored[(y * size) + (size - 1 - x)] = pixels[(y * size) + x];
  }
  return mirrored;
}
