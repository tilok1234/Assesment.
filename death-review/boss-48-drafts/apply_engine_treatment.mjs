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

// Usage (single pose, legacy):
//   node apply_engine_treatment.mjs <input.json> <output.json>
//     input:  { width, height, pixels, ramps }
//     output: { width, height, pixels }
// Usage (batched — one Node startup for a whole 80-frame build):
//   node apply_engine_treatment.mjs --batch <input.json> <output.json>
//     input:  { poses: [{ key, width, height, pixels, ramps }, ...] }
//     output: { poses: [{ key, width, height, pixels }, ...] }

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

function treatPose({ width, height, pixels, ramps }) {
  if (pixels.length !== width * height) {
    throw new Error(`Expected ${width * height} source pixels, got ${pixels.length}.`);
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
  return shaded.map((pixel, index) => (
    pixel || (outlineMask[index] ? OUTLINE_COLOR : null)
  ));
}

const batchMode = process.argv[2] === '--batch';
const inputPath = batchMode ? process.argv[3] : process.argv[2];
const outputPath = batchMode ? process.argv[4] : process.argv[3];
if (!inputPath || !outputPath) {
  throw new Error('Usage: node apply_engine_treatment.mjs [--batch] <input.json> <output.json>');
}

const input = JSON.parse(await readFile(inputPath, 'utf8'));

if (batchMode) {
  const poses = input.poses.map((pose) => ({
    key: pose.key,
    width: pose.width,
    height: pose.height,
    pixels: treatPose(pose),
  }));
  await writeFile(outputPath, `${JSON.stringify({ poses })}\n`, 'utf8');
} else {
  const treated = treatPose(input);
  await writeFile(
    outputPath,
    `${JSON.stringify({ width: input.width, height: input.height, pixels: treated })}\n`,
    'utf8',
  );
}
