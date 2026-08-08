import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as engine from '../sprite-engine.js';
import {
  outlineMaskForPixels,
  OUTLINE_MODE_COMPLETE_B,
  OUTLINE_MODE_SELECTIVE_C,
} from '../engine/outline-renderer.js';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const outputFlag = process.argv.indexOf('--out');
const output = path.resolve(
  root,
  outputFlag >= 0 ? process.argv[outputFlag + 1] : 'enemy-outline-assessment',
);
const HUMANOID_FAMILIES = new Set([
  'goblin', 'skeleton', 'zombie', 'imp', 'elf', 'dwarf', 'bandit', 'cultist',
  'orc', 'ogre', 'troll', 'kobold', 'gnoll', 'ratfolk', 'lizardfolk',
  'minotaur', 'demon', 'cyclops', 'harpy',
]);
const CARDINAL = Object.freeze([
  Object.freeze([0, -1]),
  Object.freeze([-1, 0]),
  Object.freeze([1, 0]),
  Object.freeze([0, 1]),
]);

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

function render(spec, direction, animation, frame) {
  const context = new PixelContext();
  const discarded = [];
  engine.drawSprite(context, spec, direction, animation, frame, {
    shadow: false,
    onOutOfBounds: (pixel) => discarded.push(pixel),
  });
  return { pixels: context.pixels, discarded };
}

function countMask(mask) {
  let total = 0;
  for (const value of mask) total += value ? 1 : 0;
  return total;
}

function occupiedIndices(pixels) {
  const outputIndices = [];
  for (let index = 0; index < pixels.length; index++) {
    if (pixels[index]) outputIndices.push(index);
  }
  return outputIndices;
}

function boundsFor(indices) {
  const xs = indices.map((index) => index % engine.SIZE);
  const ys = indices.map((index) => Math.floor(index / engine.SIZE));
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
}

function edgeStats(indices) {
  const sides = { top: 0, right: 0, bottom: 0, left: 0 };
  const edgeIndices = [];
  for (const index of indices) {
    const x = index % engine.SIZE;
    const y = Math.floor(index / engine.SIZE);
    let touches = false;
    if (y === 0) { sides.top++; touches = true; }
    if (x === engine.SIZE - 1) { sides.right++; touches = true; }
    if (y === engine.SIZE - 1) { sides.bottom++; touches = true; }
    if (x === 0) { sides.left++; touches = true; }
    if (touches) edgeIndices.push(index);
  }
  return { sides, edgeIndices };
}

function connectedSourceComponents(pixels) {
  const seen = new Uint8Array(pixels.length);
  const components = [];
  for (let start = 0; start < pixels.length; start++) {
    if (!pixels[start] || seen[start]) continue;
    const pending = [start];
    const component = [];
    seen[start] = 1;
    while (pending.length) {
      const index = pending.pop();
      component.push(index);
      const x = index % engine.SIZE;
      const y = Math.floor(index / engine.SIZE);
      for (const [dx, dy] of CARDINAL) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= engine.SIZE || ny >= engine.SIZE) continue;
        const next = (ny * engine.SIZE) + nx;
        if (pixels[next] && !seen[next]) {
          seen[next] = 1;
          pending.push(next);
        }
      }
    }
    components.push(component);
  }
  return components.sort((left, right) => right.length - left.length);
}

function enclosedTransparentComponents(pixels) {
  const seen = new Uint8Array(pixels.length);
  const components = [];
  for (let start = 0; start < pixels.length; start++) {
    if (pixels[start] || seen[start]) continue;
    const pending = [start];
    const component = [];
    let touchesEdge = false;
    seen[start] = 1;
    while (pending.length) {
      const index = pending.pop();
      component.push(index);
      const x = index % engine.SIZE;
      const y = Math.floor(index / engine.SIZE);
      if (x === 0 || y === 0 || x === engine.SIZE - 1 || y === engine.SIZE - 1) {
        touchesEdge = true;
      }
      for (const [dx, dy] of CARDINAL) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= engine.SIZE || ny >= engine.SIZE) continue;
        const next = (ny * engine.SIZE) + nx;
        if (!pixels[next] && !seen[next]) {
          seen[next] = 1;
          pending.push(next);
        }
      }
    }
    if (!touchesEdge) components.push(component);
  }
  return components.sort((left, right) => right.length - left.length);
}

function addSides(target, source) {
  for (const side of Object.keys(target)) target[side] += source[side];
}

function initialAggregate(family) {
  return {
    family: family.id,
    name: family.name,
    variants: family.variants.length,
    humanoid: HUMANOID_FAMILIES.has(family.id),
    frames: 0,
    occupiedPixels: 0,
    minOccupiedPixels: Number.POSITIVE_INFINITY,
    maxOccupiedPixels: 0,
    completeBOutlinePixels: 0,
    selectiveCOutlinePixels: 0,
    sourceEdgeFrames: 0,
    sourceEdgePixels: 0,
    sourceEdgeSides: { top: 0, right: 0, bottom: 0, left: 0 },
    outOfBoundsFrames: 0,
    outOfBoundsWrites: 0,
    multiComponentFrames: 0,
    maxSourceComponents: 0,
    detachedSourcePixels: 0,
    cavityFrames: 0,
    enclosedCavities: 0,
    maxCavityArea: 0,
    minimumMargins: {
      top: engine.SIZE,
      right: engine.SIZE,
      bottom: engine.SIZE,
      left: engine.SIZE,
    },
    examples: {
      edge: [],
      outOfBounds: [],
      multiComponent: [],
      cavity: [],
    },
  };
}

function recordExample(list, example, limit = 6) {
  if (list.length < limit) list.push(example);
}

const report = {
  generatedAt: new Date().toISOString(),
  contract: {
    frameSize: [engine.SIZE, engine.SIZE],
    directions: engine.DIRS,
    animations: engine.ANIMS.map(({ id, frames }) => ({ id, frames })),
    outlineModes: [
      engine.OUTLINE_MODE_NONE,
      engine.OUTLINE_MODE_COMPLETE_B,
      engine.OUTLINE_MODE_SELECTIVE_C,
    ],
    shadowExcluded: true,
    edgeContactPolicy: 'advisory unless source writes outside the 24x24 frame',
  },
  totals: {
    families: engine.ENEMIES.length,
    variants: engine.ENEMIES.reduce((sum, family) => sum + family.variants.length, 0),
    frames: 0,
    occupiedPixels: 0,
    completeBOutlinePixels: 0,
    selectiveCOutlinePixels: 0,
    sourceEdgeFrames: 0,
    sourceEdgePixels: 0,
    sourceEdgeSides: { top: 0, right: 0, bottom: 0, left: 0 },
    outOfBoundsFrames: 0,
    outOfBoundsWrites: 0,
    multiComponentFrames: 0,
    detachedSourcePixels: 0,
    cavityFrames: 0,
    enclosedCavities: 0,
  },
  families: [],
  frameRisks: [],
  pilotCandidates: {},
};

for (const family of engine.ENEMIES) {
  const aggregate = initialAggregate(family);
  for (const variant of family.variants) {
    const spec = { kind: 'enemy', family: family.id, variant: variant.id };
    for (const direction of engine.DIRS) {
      for (const animation of engine.ANIMS) {
        for (let frame = 0; frame < animation.frames; frame++) {
          const { pixels, discarded } = render(spec, direction, animation.id, frame);
          const occupied = occupiedIndices(pixels);
          if (!occupied.length) {
            throw new Error(
              `${family.id}/${variant.id} ${direction} ${animation.id} frame ${frame + 1} is empty.`,
            );
          }
          const bounds = boundsFor(occupied);
          const edges = edgeStats(occupied);
          const sourceComponents = connectedSourceComponents(pixels);
          const cavities = enclosedTransparentComponents(pixels);
          const completeB = outlineMaskForPixels(
            pixels,
            OUTLINE_MODE_COMPLETE_B,
            engine.SIZE,
            engine.SIZE,
          );
          const selectiveC = outlineMaskForPixels(
            pixels,
            OUTLINE_MODE_SELECTIVE_C,
            engine.SIZE,
            engine.SIZE,
          );
          const detachedPixels = sourceComponents
            .slice(1)
            .reduce((sum, component) => sum + component.length, 0);
          const completeCount = countMask(completeB);
          const selectiveCount = countMask(selectiveC);
          const example = {
            variant: variant.id,
            direction,
            animation: animation.id,
            frame: frame + 1,
          };

          aggregate.frames++;
          aggregate.occupiedPixels += occupied.length;
          aggregate.minOccupiedPixels = Math.min(aggregate.minOccupiedPixels, occupied.length);
          aggregate.maxOccupiedPixels = Math.max(aggregate.maxOccupiedPixels, occupied.length);
          aggregate.completeBOutlinePixels += completeCount;
          aggregate.selectiveCOutlinePixels += selectiveCount;
          aggregate.maxSourceComponents = Math.max(
            aggregate.maxSourceComponents,
            sourceComponents.length,
          );
          aggregate.detachedSourcePixels += detachedPixels;
          aggregate.minimumMargins.top = Math.min(aggregate.minimumMargins.top, bounds.minY);
          aggregate.minimumMargins.right = Math.min(
            aggregate.minimumMargins.right,
            engine.SIZE - 1 - bounds.maxX,
          );
          aggregate.minimumMargins.bottom = Math.min(
            aggregate.minimumMargins.bottom,
            engine.SIZE - 1 - bounds.maxY,
          );
          aggregate.minimumMargins.left = Math.min(aggregate.minimumMargins.left, bounds.minX);

          if (edges.edgeIndices.length) {
            aggregate.sourceEdgeFrames++;
            aggregate.sourceEdgePixels += edges.edgeIndices.length;
            addSides(aggregate.sourceEdgeSides, edges.sides);
            recordExample(aggregate.examples.edge, {
              ...example,
              pixels: edges.edgeIndices.map((index) => [
                index % engine.SIZE,
                Math.floor(index / engine.SIZE),
              ]),
            });
          }
          if (discarded.length) {
            aggregate.outOfBoundsFrames++;
            aggregate.outOfBoundsWrites += discarded.length;
            recordExample(aggregate.examples.outOfBounds, { ...example, writes: discarded });
          }
          if (sourceComponents.length > 1) {
            aggregate.multiComponentFrames++;
            recordExample(aggregate.examples.multiComponent, {
              ...example,
              components: sourceComponents.map((component) => component.length),
            });
          }
          if (cavities.length) {
            aggregate.cavityFrames++;
            aggregate.enclosedCavities += cavities.length;
            aggregate.maxCavityArea = Math.max(aggregate.maxCavityArea, cavities[0].length);
            recordExample(aggregate.examples.cavity, {
              ...example,
              areas: cavities.map((component) => component.length),
            });
          }

          if (edges.edgeIndices.length || discarded.length || sourceComponents.length > 2) {
            report.frameRisks.push({
              family: family.id,
              ...example,
              edgePixels: edges.edgeIndices.length,
              outOfBoundsWrites: discarded.length,
              sourceComponents: sourceComponents.length,
              detachedSourcePixels: detachedPixels,
              completeBOutlinePixels: completeCount,
              selectiveCOutlinePixels: selectiveCount,
            });
          }
        }
      }
    }
  }

  aggregate.averageOccupiedPixels = Number(
    (aggregate.occupiedPixels / aggregate.frames).toFixed(2),
  );
  aggregate.averageCompleteBOutlinePixels = Number(
    (aggregate.completeBOutlinePixels / aggregate.frames).toFixed(2),
  );
  aggregate.averageSelectiveCOutlinePixels = Number(
    (aggregate.selectiveCOutlinePixels / aggregate.frames).toFixed(2),
  );
  aggregate.edgeFrameRate = Number((aggregate.sourceEdgeFrames / aggregate.frames).toFixed(4));
  aggregate.multiComponentFrameRate = Number(
    (aggregate.multiComponentFrames / aggregate.frames).toFixed(4),
  );
  aggregate.cavityFrameRate = Number((aggregate.cavityFrames / aggregate.frames).toFixed(4));
  report.families.push(aggregate);

  report.totals.frames += aggregate.frames;
  report.totals.occupiedPixels += aggregate.occupiedPixels;
  report.totals.completeBOutlinePixels += aggregate.completeBOutlinePixels;
  report.totals.selectiveCOutlinePixels += aggregate.selectiveCOutlinePixels;
  report.totals.sourceEdgeFrames += aggregate.sourceEdgeFrames;
  report.totals.sourceEdgePixels += aggregate.sourceEdgePixels;
  addSides(report.totals.sourceEdgeSides, aggregate.sourceEdgeSides);
  report.totals.outOfBoundsFrames += aggregate.outOfBoundsFrames;
  report.totals.outOfBoundsWrites += aggregate.outOfBoundsWrites;
  report.totals.multiComponentFrames += aggregate.multiComponentFrames;
  report.totals.detachedSourcePixels += aggregate.detachedSourcePixels;
  report.totals.cavityFrames += aggregate.cavityFrames;
  report.totals.enclosedCavities += aggregate.enclosedCavities;
}

const safeHumanoids = report.families
  .filter((family) => family.humanoid && family.outOfBoundsFrames === 0)
  .sort((left, right) => (
    left.sourceEdgeFrames - right.sourceEdgeFrames
    || left.averageOccupiedPixels - right.averageOccupiedPixels
    || left.family.localeCompare(right.family)
  ));
const edgeStress = [...report.families].sort((left, right) => (
  right.outOfBoundsFrames - left.outOfBoundsFrames
  || right.sourceEdgeFrames - left.sourceEdgeFrames
  || right.sourceEdgePixels - left.sourceEdgePixels
  || left.family.localeCompare(right.family)
));
const openStress = [...report.families].sort((left, right) => (
  right.multiComponentFrames - left.multiComponentFrames
  || right.detachedSourcePixels - left.detachedSourcePixels
  || right.cavityFrames - left.cavityFrames
  || left.family.localeCompare(right.family)
));

report.pilotCandidates = {
  compactHumanoid: safeHumanoids[0]?.family || null,
  widestOrEdgeStressed: edgeStress[0]?.family || null,
  openOrDisconnected: openStress[0]?.family || null,
};
report.frameRisks.sort((left, right) => (
  right.outOfBoundsWrites - left.outOfBoundsWrites
  || right.edgePixels - left.edgePixels
  || right.sourceComponents - left.sourceComponents
  || left.family.localeCompare(right.family)
));

const familyRows = report.families.map((family) => [
  family.family,
  family.variants,
  family.frames,
  family.averageOccupiedPixels,
  family.averageCompleteBOutlinePixels,
  family.averageSelectiveCOutlinePixels,
  family.sourceEdgeFrames,
  family.sourceEdgePixels,
  family.outOfBoundsFrames,
  family.outOfBoundsWrites,
  family.multiComponentFrames,
  family.detachedSourcePixels,
  family.cavityFrames,
  family.enclosedCavities,
  family.maxCavityArea,
  family.minimumMargins.top,
  family.minimumMargins.right,
  family.minimumMargins.bottom,
  family.minimumMargins.left,
].join(','));
const csv = [
  [
    'family', 'variants', 'frames', 'avg_source_pixels', 'avg_complete_b_pixels',
    'avg_selective_c_pixels', 'edge_frames', 'edge_pixels', 'oob_frames', 'oob_writes',
    'multi_component_frames', 'detached_pixels', 'cavity_frames', 'cavities',
    'max_cavity_area', 'min_margin_top', 'min_margin_right', 'min_margin_bottom',
    'min_margin_left',
  ].join(','),
  ...familyRows,
].join('\n');

await writeFile(
  path.join(output, 'assessment.json'),
  `${JSON.stringify(report, null, 2)}\n`,
  'utf8',
);
await writeFile(path.join(output, 'families.csv'), `${csv}\n`, 'utf8');

console.log('Enemy outline assessment complete.');
console.log(`- Families: ${report.totals.families}`);
console.log(`- Variants: ${report.totals.variants}`);
console.log(`- Frames: ${report.totals.frames}`);
console.log(
  `- Source edge contacts: ${report.totals.sourceEdgeFrames} frames / `
  + `${report.totals.sourceEdgePixels} pixels`,
);
console.log(
  `- Out-of-bounds source writes: ${report.totals.outOfBoundsFrames} frames / `
  + `${report.totals.outOfBoundsWrites} writes`,
);
console.log(
  `- Disconnected source: ${report.totals.multiComponentFrames} frames / `
  + `${report.totals.detachedSourcePixels} detached pixels`,
);
console.log(
  `- Enclosed source openings: ${report.totals.cavityFrames} frames / `
  + `${report.totals.enclosedCavities} components`,
);
console.log(`- Suggested pilots: ${JSON.stringify(report.pilotCandidates)}`);
console.log(`- Report: ${path.join(output, 'assessment.json')}`);
