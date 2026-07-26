import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as engine from '../sprite-engine.js';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const outputFlag = process.argv.indexOf('--out');
const output = path.resolve(
  root,
  outputFlag >= 0 ? process.argv[outputFlag + 1] : 'enemy-outline-review',
);
const familiesFlag = process.argv.indexOf('--families');
const familiesArgument = familiesFlag >= 0 ? process.argv[familiesFlag + 1] : '';
if (familiesFlag >= 0 && (!familiesArgument || familiesArgument.startsWith('--'))) {
  throw new Error('--families requires a comma-separated list of enabled family ids.');
}
const requestedFamilyIds = familiesFlag >= 0
  ? [...new Set(familiesArgument
      .split(',')
      .map((familyId) => familyId.trim())
      .filter(Boolean))]
  : engine.ENEMY_OUTLINE_PILOT_FAMILIES;
const comparisonAnimationFlag = process.argv.indexOf('--comparison-animation');
const comparisonAnimation = comparisonAnimationFlag >= 0
  ? process.argv[comparisonAnimationFlag + 1]
  : 'attack';
const comparisonAnimationSpec = engine.ANIMS.find(
  (animation) => animation.id === comparisonAnimation,
);
if (!comparisonAnimationSpec) {
  throw new Error(
    `--comparison-animation must be one of: ${
      engine.ANIMS.map((animation) => animation.id).join(', ')
    }.`,
  );
}
const comparisonFrameFlag = process.argv.indexOf('--comparison-frame');
const comparisonFrameNumber = comparisonFrameFlag >= 0
  ? Number(process.argv[comparisonFrameFlag + 1])
  : 2;
if (
  !Number.isInteger(comparisonFrameNumber)
  || comparisonFrameNumber < 1
  || comparisonFrameNumber > comparisonAnimationSpec.frames
) {
  throw new Error(
    `--comparison-frame must be an integer from 1 through ${
      comparisonAnimationSpec.frames
    } for ${comparisonAnimation}.`,
  );
}
const comparisonFrame = comparisonFrameNumber - 1;
const MODES = [
  { id: engine.OUTLINE_MODE_NONE, label: 'NONE' },
  { id: engine.OUTLINE_MODE_COMPLETE_B, label: 'COMPLETE B' },
  { id: engine.OUTLINE_MODE_SELECTIVE_C, label: 'SELECTIVE C' },
];
const COMPONENT_AWARE_FAMILIES = new Set([
  'bandit',
  'kobold',
  'skeleton',
  'ratfolk',
  'elf',
  'gnoll',
  'dwarf',
  'ogre',
  'goblin',
]);
const COMPONENT_LAYER_ORDER = [
  'weapon-back',
  'shield-back',
  'body',
  'headgear',
  'shield-front',
  'weapon-front',
];
const COMPONENT_BODY_LAYERS = new Set(['body', 'headgear']);
const COMPONENT_FRONT_EQUIPMENT_LAYERS = new Set(['shield-front', 'weapon-front']);
const CARDINAL_OFFSETS = [[0, -1], [-1, 0], [1, 0], [0, 1]];
const PILOTS = requestedFamilyIds.map((familyId) => {
  if (!engine.ENEMY_OUTLINE_PILOT_FAMILIES.includes(familyId)) {
    throw new Error(`Enemy outline family ${familyId} is not enabled.`);
  }
  const family = engine.ENEMIES.find((entry) => entry.id === familyId);
  if (!family) throw new Error(`Missing enemy outline family ${familyId}.`);
  return family;
});

await mkdir(output, { recursive: true });

class PixelContext {
  constructor() {
    this.fillStyle = '#000000';
    this.pixels = new Array(engine.SIZE * engine.SIZE).fill(null);
  }

  clearRect() {
    this.pixels.fill(null);
  }

  fillRect(x, y, width, height) {
    for (let py = Math.floor(y); py < Math.ceil(y + height); py++) {
      for (let px = Math.floor(x); px < Math.ceil(x + width); px++) {
        if (px >= 0 && py >= 0 && px < engine.SIZE && py < engine.SIZE) {
          this.pixels[(py * engine.SIZE) + px] = this.fillStyle;
        }
      }
    }
  }
}

function render(spec, direction, animation, frame, outlineMode) {
  const context = new PixelContext();
  const discarded = [];
  engine.drawOutlinedSprite(context, spec, direction, animation, frame, {
    outlineMode,
    shadow: false,
    onOutOfBounds: (pixel) => discarded.push(pixel),
  });
  return { pixels: context.pixels, discarded };
}

function renderLayer(spec, direction, animation, frame, layer) {
  const context = new PixelContext();
  engine.drawSprite(context, spec, direction, animation, frame, {
    layer,
    shadow: false,
  });
  return context.pixels;
}

function visibleComponentLayers(spec, direction, animation, frame) {
  const visibleLayers = new Array(engine.SIZE * engine.SIZE).fill(null);
  for (const layer of COMPONENT_LAYER_ORDER) {
    const pixels = renderLayer(spec, direction, animation, frame, layer);
    for (let index = 0; index < pixels.length; index++) {
      if (pixels[index]) visibleLayers[index] = layer;
    }
  }
  return visibleLayers;
}

function touchesFrontEquipment(visibleLayers, index) {
  const x = index % engine.SIZE;
  const y = Math.floor(index / engine.SIZE);
  for (const [offsetX, offsetY] of CARDINAL_OFFSETS) {
    const targetX = x + offsetX;
    const targetY = y + offsetY;
    if (
      targetX >= 0
      && targetY >= 0
      && targetX < engine.SIZE
      && targetY < engine.SIZE
      && COMPONENT_FRONT_EQUIPMENT_LAYERS.has(
        visibleLayers[(targetY * engine.SIZE) + targetX],
      )
    ) return true;
  }
  return false;
}

function arraysEqual(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function sourceEdgePixels(pixels) {
  const indices = [];
  for (let index = 0; index < pixels.length; index++) {
    if (!pixels[index]) continue;
    const x = index % engine.SIZE;
    const y = Math.floor(index / engine.SIZE);
    if (x === 0 || y === 0 || x === engine.SIZE - 1 || y === engine.SIZE - 1) {
      indices.push(index);
    }
  }
  return indices;
}

function changedIndices(source, outlined) {
  const indices = [];
  for (let index = 0; index < source.length; index++) {
    if (source[index] !== outlined[index]) indices.push(index);
  }
  return indices;
}

function xml(value) {
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
      rects.push(
        `<rect x="${offsetX + x * scale}" y="${offsetY + y * scale}" `
        + `width="${scale}" height="${scale}" fill="${xml(color)}"/>`,
      );
    }
  }
  return rects.join('');
}

function svgDocument(width, height, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" `
    + `viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">`
    + '<style>text{font-family:Consolas,monospace;font-weight:700}'
    + '.title{font-size:18px;fill:#f4cf66}.header{font-size:12px;fill:#9ed8ff}'
    + '.label{font-size:12px;fill:#e8edf7}</style>'
    + body.join('')
    + '</svg>';
}

function checkerDefinition(id, size) {
  const half = Math.floor(size / 2);
  return `<defs><pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse">`
    + `<rect width="${size}" height="${size}" fill="#303849"/>`
    + `<rect width="${half}" height="${half}" fill="#252c3b"/>`
    + `<rect x="${half}" y="${half}" width="${half}" height="${half}" fill="#252c3b"/>`
    + '</pattern></defs>';
}

async function writeModeComparison() {
  const scale = 5;
  const labelWidth = 112;
  const titleHeight = 34;
  const headerHeight = 24;
  const cellWidth = engine.SIZE * scale + 8;
  const cellHeight = engine.SIZE * scale + 8;
  const columns = engine.DIRS.flatMap((direction) => MODES.map((mode) => ({
    direction,
    mode: mode.id,
    label: `${direction.toUpperCase()} ${mode.label}`,
  })));
  const rows = PILOTS.flatMap((family) => family.variants.map((variant) => ({
    family,
    variant,
  })));
  const width = labelWidth + columns.length * cellWidth + 4;
  const height = titleHeight + headerHeight + rows.length * cellHeight + 4;
  const body = [
    `<rect width="${width}" height="${height}" fill="#131722"/>`,
    checkerDefinition('checker-mode', 20),
    `<text x="6" y="22" class="title">ENEMY OUTLINE REVIEW - ${
      comparisonAnimation.toUpperCase()
    } FRAME ${comparisonFrameNumber}</text>`,
  ];
  columns.forEach((column, index) => {
    body.push(
      `<text x="${labelWidth + index * cellWidth + 4}" y="${titleHeight + 16}" `
      + `class="header">${xml(column.label)}</text>`,
    );
  });
  rows.forEach((row, rowIndex) => {
    const y = titleHeight + headerHeight + rowIndex * cellHeight;
    body.push(
      `<text x="6" y="${y + Math.floor(cellHeight / 2)}" class="label">`
      + `${xml(`${row.family.name}/${row.variant.name}`)}</text>`,
    );
    columns.forEach((column, columnIndex) => {
      const x = labelWidth + columnIndex * cellWidth;
      const spec = {
        kind: 'enemy',
        family: row.family.id,
        variant: row.variant.id,
      };
      const { pixels } = render(
        spec,
        column.direction,
        comparisonAnimation,
        comparisonFrame,
        column.mode,
      );
      body.push(
        `<rect x="${x}" y="${y}" width="${engine.SIZE * scale}" `
        + `height="${engine.SIZE * scale}" fill="url(#checker-mode)"/>`,
      );
      body.push(pixelRects(pixels, x, y, scale));
    });
  });
  const file = 'pilot-mode-comparison.svg';
  await writeFile(path.join(output, file), svgDocument(width, height, body), 'utf8');
  return file;
}

async function writeAllFrames(family) {
  const scale = 2;
  const labelWidth = 132;
  const titleHeight = 34;
  const headerHeight = 24;
  const cellWidth = engine.SIZE * scale + 5;
  const cellHeight = engine.SIZE * scale + 5;
  const columns = engine.ANIMS.flatMap((animation) => Array.from(
    { length: animation.frames },
    (_, frame) => ({
      animation: animation.id,
      frame,
      label: `${animation.id[0].toUpperCase()}${frame + 1}`,
    }),
  ));
  const rows = family.variants.flatMap((variant) => engine.DIRS.flatMap((direction) => (
    MODES.map((mode) => ({ variant, direction, mode }))
  )));
  const width = labelWidth + columns.length * cellWidth + 4;
  const height = titleHeight + headerHeight + rows.length * cellHeight + 4;
  const body = [
    `<rect width="${width}" height="${height}" fill="#131722"/>`,
    checkerDefinition(`checker-${family.id}`, 12),
    `<text x="6" y="22" class="title">${xml(`${family.name.toUpperCase()} OUTLINE REVIEW - ALL FRAMES`)}</text>`,
  ];
  columns.forEach((column, index) => {
    body.push(
      `<text x="${labelWidth + index * cellWidth + 3}" y="${titleHeight + 16}" `
      + `class="header">${xml(column.label)}</text>`,
    );
  });
  rows.forEach((row, rowIndex) => {
    const y = titleHeight + headerHeight + rowIndex * cellHeight;
    body.push(
      `<text x="6" y="${y + Math.floor(cellHeight / 2)}" class="label">`
      + `${xml(`${row.variant.id} ${row.direction} ${row.mode.label}`)}</text>`,
    );
    columns.forEach((column, columnIndex) => {
      const x = labelWidth + columnIndex * cellWidth;
      const spec = { kind: 'enemy', family: family.id, variant: row.variant.id };
      const { pixels } = render(
        spec,
        row.direction,
        column.animation,
        column.frame,
        row.mode.id,
      );
      body.push(
        `<rect x="${x}" y="${y}" width="${engine.SIZE * scale}" `
        + `height="${engine.SIZE * scale}" fill="url(#checker-${family.id})"/>`,
      );
      body.push(pixelRects(pixels, x, y, scale));
    });
  });
  const file = `${family.id}-pilot-all-frames.svg`;
  await writeFile(path.join(output, file), svgDocument(width, height, body), 'utf8');
  return file;
}

const report = {
  pilots: PILOTS.map((family) => family.id),
  comparisonAnimation,
  comparisonFrame: comparisonFrameNumber,
  frames: 0,
  modeCases: 0,
  noneParityCases: 0,
  completeBAddedPixels: 0,
  selectiveCAddedPixels: 0,
  modeDistinctFrames: 0,
  componentContactSeparatorPixels: 0,
  componentContactSeparatorPixelsByFamily: Object.fromEntries(
    PILOTS
      .map((family) => family.id)
      .filter((familyId) => COMPONENT_AWARE_FAMILIES.has(familyId))
      .map((familyId) => [familyId, 0]),
  ),
  sourceEdgeFrames: 0,
  outOfBoundsWrites: 0,
  files: [],
};
const failures = [];

for (const family of PILOTS) {
  for (const variant of family.variants) {
    const spec = { kind: 'enemy', family: family.id, variant: variant.id };
    for (const direction of engine.DIRS) {
      for (const animation of engine.ANIMS) {
        for (let frame = 0; frame < animation.frames; frame++) {
          report.frames++;
          const directContext = new PixelContext();
          const directDiscarded = [];
          engine.drawSprite(directContext, spec, direction, animation.id, frame, {
            shadow: false,
            onOutOfBounds: (pixel) => directDiscarded.push(pixel),
          });
          const none = render(
            spec,
            direction,
            animation.id,
            frame,
            engine.OUTLINE_MODE_NONE,
          );
          const complete = render(
            spec,
            direction,
            animation.id,
            frame,
            engine.OUTLINE_MODE_COMPLETE_B,
          );
          const selective = render(
            spec,
            direction,
            animation.id,
            frame,
            engine.OUTLINE_MODE_SELECTIVE_C,
          );
          report.modeCases += 3;
          report.noneParityCases++;
          const componentAware = COMPONENT_AWARE_FAMILIES.has(family.id);
          const visibleLayers = componentAware
            ? visibleComponentLayers(spec, direction, animation.id, frame)
            : null;
          report.outOfBoundsWrites += directDiscarded.length
            + none.discarded.length
            + complete.discarded.length
            + selective.discarded.length;
          if (!arraysEqual(directContext.pixels, none.pixels)) {
            failures.push(`${family.id}/${variant.id} ${direction} ${animation.id}/${frame + 1} None parity`);
          }
          const edges = sourceEdgePixels(directContext.pixels);
          if (edges.length) {
            report.sourceEdgeFrames++;
            failures.push(
              `${family.id}/${variant.id} ${direction} ${animation.id}/${frame + 1} source edge contact`,
            );
          }
          for (const [modeName, outlined] of [
            ['Complete B', complete.pixels],
            ['Selective C', selective.pixels],
          ]) {
            for (let index = 0; index < directContext.pixels.length; index++) {
              const source = directContext.pixels[index];
              if (source && outlined[index] !== source) {
                const componentSeparator = componentAware
                  && outlined[index] === engine.OUTLINE_COLOR
                  && COMPONENT_BODY_LAYERS.has(visibleLayers[index])
                  && touchesFrontEquipment(visibleLayers, index);
                if (!componentSeparator) {
                  failures.push(
                    `${family.id}/${variant.id} ${direction} ${animation.id}/${frame + 1} `
                    + `${modeName} changed non-contact source pixel ${index}`,
                  );
                  break;
                }
                report.componentContactSeparatorPixels++;
                report.componentContactSeparatorPixelsByFamily[family.id]++;
              }
              if (!source && outlined[index] && outlined[index] !== engine.OUTLINE_COLOR) {
                failures.push(
                  `${family.id}/${variant.id} ${direction} ${animation.id}/${frame + 1} `
                  + `${modeName} added non-outline pixel ${index}`,
                );
                break;
              }
            }
          }
          const completeChanges = changedIndices(directContext.pixels, complete.pixels);
          const selectiveChanges = changedIndices(directContext.pixels, selective.pixels);
          report.completeBAddedPixels += completeChanges.length;
          report.selectiveCAddedPixels += selectiveChanges.length;
          if (!completeChanges.length || !selectiveChanges.length) {
            failures.push(
              `${family.id}/${variant.id} ${direction} ${animation.id}/${frame + 1} missing outline`,
            );
          }
          if (!arraysEqual(complete.pixels, selective.pixels)) report.modeDistinctFrames++;
        }
      }
    }
  }
}

if (report.outOfBoundsWrites) {
  failures.push(`outlined enemy renderers attempted ${report.outOfBoundsWrites} out-of-bounds writes`);
}
if (report.modeDistinctFrames !== report.frames) {
  failures.push(
    `Complete B and Selective C differ in ${report.modeDistinctFrames}/${report.frames} frames`,
  );
}
for (const familyId of PILOTS
  .map((family) => family.id)
  .filter((familyId) => COMPONENT_AWARE_FAMILIES.has(familyId))) {
  if (!report.componentContactSeparatorPixelsByFamily[familyId]) {
    failures.push(
      `component-aware ${familyId} proof produced no body/equipment contact separators`,
    );
  }
}

report.files.push(await writeModeComparison());
for (const family of PILOTS) report.files.push(await writeAllFrames(family));
await writeFile(
  path.join(output, 'manifest.json'),
  `${JSON.stringify({ ...report, failures }, null, 2)}\n`,
  'utf8',
);

if (failures.length) {
  console.error(`Enemy outline review failed with ${failures.length} issue(s).`);
  console.error(failures.slice(0, 30).join('\n'));
  process.exit(1);
}

console.log('Enemy outline review passed.');
console.log(`- Outline families: ${report.pilots.join(', ')}`);
console.log(`- Frames: ${report.frames}`);
console.log(`- None parity cases: ${report.noneParityCases}`);
console.log(`- Mode cases: ${report.modeCases}`);
console.log(`- Complete B added pixels: ${report.completeBAddedPixels}`);
console.log(`- Selective C added pixels: ${report.selectiveCAddedPixels}`);
console.log(`- Mode-distinct frames: ${report.modeDistinctFrames}`);
console.log(`- Component contact separator pixels: ${report.componentContactSeparatorPixels}`);
console.log(
  `- Component separators by family: ${JSON.stringify(report.componentContactSeparatorPixelsByFamily)}`,
);
console.log(`- Source edge frames: ${report.sourceEdgeFrames}`);
console.log(`- Out-of-bounds writes: ${report.outOfBoundsWrites}`);
console.log(`- Review: ${path.join(output, report.files[0])}`);
