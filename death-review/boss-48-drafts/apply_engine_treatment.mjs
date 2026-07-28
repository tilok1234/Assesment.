import { readFile, writeFile } from 'node:fs/promises';

import {
  protectedShadeMask,
  shadePixels,
} from '../../engine/shade-renderer.js';
import {
  OUTLINE_COLOR,
  OUTLINE_MODE_COMPLETE_B,
  outlineMaskForPixels,
} from '../../engine/outline-renderer.js';


const [, , inputPath, outputPath] = process.argv;
if (!inputPath || !outputPath) {
  throw new Error('Usage: node apply_engine_treatment.mjs <input.json> <output.json>');
}

const input = JSON.parse(await readFile(inputPath, 'utf8'));
const { width, height, pixels, ramps } = input;
if (pixels.length !== width * height) {
  throw new Error(`Expected ${width * height} source pixels, got ${pixels.length}.`);
}

function parseHex(color) {
  return [
    Number.parseInt(color.slice(1, 3), 16),
    Number.parseInt(color.slice(3, 5), 16),
    Number.parseInt(color.slice(5, 7), 16),
  ];
}

function toHex(rgb) {
  return `#${rgb.map((value) => Math.round(value).toString(16).padStart(2, '0')).join('')}`;
}

function sideColor(base, shadow) {
  const first = parseHex(base);
  const second = parseHex(shadow);
  return toHex(first.map((channel, index) => (channel + second[index]) / 2));
}

const materialLookup = new Map();
for (const definition of ramps) {
  const ramp = Object.freeze({
    id: definition.id,
    base: definition.base,
    shadow: definition.shadow,
    highlight: definition.highlight,
    side: sideColor(definition.base, definition.shadow),
  });
  for (const role of ['base', 'shadow', 'highlight']) {
    materialLookup.set(
      ramp[role],
      Object.freeze({ ramp, role }),
    );
  }
}

const protectedMask = protectedShadeMask(pixels, { width, height });
const shaded = shadePixels(
  pixels,
  materialLookup,
  { width, height, protectedMask },
);
const outlineMask = outlineMaskForPixels(
  shaded,
  OUTLINE_MODE_COMPLETE_B,
  width,
  height,
);
const treated = shaded.map((pixel, index) => (
  pixel || (outlineMask[index] ? OUTLINE_COLOR : null)
));

await writeFile(
  outputPath,
  `${JSON.stringify({ width, height, pixels: treated })}\n`,
  'utf8',
);
