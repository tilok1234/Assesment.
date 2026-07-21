import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const engine = await import(`${new URL('../sprite-engine.js', import.meta.url).href}?shield-placement-audit=${Date.now()}`);
const { ANIMS, SHIELDS, SHIELD_TIERS, SIZE, drawSprite } = engine;
const output = path.join(root, 'shield-review', 'placement-audit');
await mkdir(output, { recursive: true });

class PixelContext {
  constructor() {
    this.fillStyle = '#000000';
    this.pixels = new Array(SIZE * SIZE).fill(null);
  }
  clearRect(x, y, width, height) {
    for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
      if (px >= 0 && py >= 0 && px < SIZE && py < SIZE) this.pixels[py * SIZE + px] = null;
    }
  }
  fillRect(x, y, width, height) {
    for (let py = Math.floor(y); py < Math.ceil(y + height); py++) {
      for (let px = Math.floor(x); px < Math.ceil(x + width); px++) {
        if (px >= 0 && py >= 0 && px < SIZE && py < SIZE) this.pixels[py * SIZE + px] = this.fillStyle;
      }
    }
  }
}

const shieldFamilies = SHIELDS.filter(({ id }) => id !== 'none');
const directions = ['left', 'right', 'up', 'down'];

function spec(shield, shieldTier) {
  return {
    kind: 'player', species: 'human', bodyBuild: 'classic', skin: 'peach',
    hairStyle: 'bald', hairColor: 'brown', expression: 'neutral', faceDetail: 'none',
    headgear: 'none', outfit: 'tunic', outfitTier: 'tier1', outfitColor: 'charcoal',
    weapon: 'none', weaponTier: 'tier1', shield, shieldTier,
  };
}

function render(shield, shieldTier, direction, animation, frame, layer = 'assembled', discarded = []) {
  const context = new PixelContext();
  const options = { shadow: false, onOutOfBounds: (pixel) => discarded.push(pixel) };
  const current = spec(shield, shieldTier);
  if (layer === 'shield') {
    drawSprite(context, current, direction, animation, frame, { ...options, layer: 'shield-back' });
    drawSprite(context, current, direction, animation, frame, { ...options, layer: 'shield-front', clear: false });
  } else if (layer === 'body') {
    drawSprite(context, current, direction, animation, frame, { ...options, layer: 'body' });
  } else {
    drawSprite(context, current, direction, animation, frame, options);
  }
  return context.pixels;
}

function points(pixels) {
  return pixels.flatMap((value, index) => value ? [[index % SIZE, Math.floor(index / SIZE)]] : []);
}

function bounds(pixels) {
  const active = points(pixels);
  if (!active.length) return null;
  const xs = active.map(([x]) => x);
  const ys = active.map(([, y]) => y);
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
}

function distance(left, right) {
  let minimum = Infinity;
  for (const [ax, ay] of left) for (const [bx, by] of right) {
    minimum = Math.min(minimum, Math.max(Math.abs(ax - bx), Math.abs(ay - by)));
    if (minimum === 0) return 0;
  }
  return Number.isFinite(minimum) ? minimum : null;
}

function shiftedShieldPixels(pixels, discarded, shiftX) {
  const shifted = new Array(SIZE * SIZE).fill(null);
  let shiftedDiscarded = 0;
  const source = [
    ...points(pixels).map(([x, y]) => ({ x, y, color: pixels[y * SIZE + x] })),
    ...discarded,
  ];
  for (const { x, y, color } of source) {
    const targetX = x + shiftX;
    if (targetX < 0 || y < 0 || targetX >= SIZE || y >= SIZE) {
      shiftedDiscarded++;
      continue;
    }
    shifted[y * SIZE + targetX] = color;
  }
  return { pixels: shifted, discarded: shiftedDiscarded };
}

function placementMetrics(shield, shieldTier, direction, animation, frame) {
  const discarded = [];
  const shieldPixels = render(shield, shieldTier, direction, animation, frame, 'shield', discarded);
  const bodyPixels = render(shield, shieldTier, direction, animation, frame, 'body');
  const shieldPoints = points(shieldPixels);
  const bodyPoints = points(bodyPixels);
  const overlap = shieldPoints.filter(([x, y]) => bodyPixels[y * SIZE + x]).length;
  const proposedShiftX = direction === 'right' ? 1 : direction === 'left' ? -1 : 0;
  const proposed = shiftedShieldPixels(shieldPixels, discarded, proposedShiftX);
  const proposedPoints = points(proposed.pixels);
  return {
    shield,
    shieldTier,
    direction,
    animation,
    frame,
    discarded: discarded.length,
    shieldPixels: shieldPoints.length,
    overlap,
    contactDistance: distance(shieldPoints, bodyPoints),
    proposedShiftX,
    proposedDiscarded: proposed.discarded,
    proposedOverlap: proposedPoints.filter(([x, y]) => bodyPixels[y * SIZE + x]).length,
    proposedContactDistance: distance(proposedPoints, bodyPoints),
    shieldBounds: bounds(shieldPixels),
    bodyBounds: bounds(bodyPixels),
  };
}

function xml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function pixelRects(pixels, offsetX, offsetY, scale) {
  const rects = [];
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    const fill = pixels[y * SIZE + x];
    if (fill) rects.push(`<rect x="${offsetX + x * scale}" y="${offsetY + y * scale}" width="${scale}" height="${scale}" fill="${xml(fill)}"/>`);
  }
  return rects.join('');
}

const reviewColumns = [
  { direction: 'left', animation: 'idle', frame: 0, label: 'L I1' },
  { direction: 'left', animation: 'walk', frame: 0, label: 'L W1' },
  { direction: 'left', animation: 'attack', frame: 0, label: 'L A1' },
  { direction: 'left', animation: 'attack', frame: 1, label: 'L A2' },
  { direction: 'right', animation: 'idle', frame: 0, label: 'R I1' },
  { direction: 'right', animation: 'walk', frame: 0, label: 'R W1' },
  { direction: 'right', animation: 'attack', frame: 0, label: 'R A1' },
  { direction: 'right', animation: 'attack', frame: 1, label: 'R A2' },
  { direction: 'up', animation: 'idle', frame: 0, label: 'U I1' },
  { direction: 'up', animation: 'walk', frame: 0, label: 'U W1' },
  { direction: 'up', animation: 'attack', frame: 0, label: 'U A1' },
  { direction: 'up', animation: 'attack', frame: 1, label: 'U A2' },
];

async function writeTierMatrix(shieldTier) {
  const scale = 4;
  const labelWidth = 112;
  const titleHeight = 34;
  const headerHeight = 30;
  const cellWidth = SIZE * scale + 6;
  const cellHeight = SIZE * scale + 6;
  const width = labelWidth + reviewColumns.length * cellWidth + 4;
  const height = titleHeight + headerHeight + shieldFamilies.length * cellHeight + 4;
  const body = [];
  body.push(`<rect width="${width}" height="${height}" fill="#131722"/>`);
  body.push('<defs><pattern id="checker" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#303849"/><rect width="8" height="8" fill="#252c3b"/><rect x="8" y="8" width="8" height="8" fill="#252c3b"/></pattern></defs>');
  body.push(`<text x="6" y="22" class="title">SHIELD PLACEMENT AUDIT - ${shieldTier.toUpperCase()}</text>`);
  reviewColumns.forEach((column, index) => body.push(`<text x="${labelWidth + index * cellWidth + 4}" y="${titleHeight + 19}" class="header">${column.label}</text>`));
  shieldFamilies.forEach((shield, rowIndex) => {
    const y = titleHeight + headerHeight + rowIndex * cellHeight;
    body.push(`<text x="6" y="${y + Math.floor(cellHeight / 2) + 5}" class="label">${shield.name.toUpperCase()}</text>`);
    reviewColumns.forEach((column, columnIndex) => {
      const x = labelWidth + columnIndex * cellWidth;
      const pixels = render(shield.id, shieldTier, column.direction, column.animation, column.frame);
      body.push(`<rect x="${x}" y="${y}" width="${SIZE * scale}" height="${SIZE * scale}" fill="url(#checker)"/>`);
      body.push(pixelRects(pixels, x, y, scale));
    });
  });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges"><style>text{font-family:Consolas,monospace;font-weight:700}.title{font-size:18px;fill:#f4cf66}.header{font-size:14px;fill:#9ed8ff}.label{font-size:13px;fill:#e8edf7}</style>${body.join('')}</svg>`;
  await writeFile(path.join(output, `shield-placement-${shieldTier}.svg`), svg, 'utf8');
}

async function writeDirectionMatrix(shieldTier, direction) {
  const scale = 4;
  const labelWidth = 112;
  const titleHeight = 34;
  const headerHeight = 30;
  const cellWidth = SIZE * scale + 6;
  const cellHeight = SIZE * scale + 6;
  const columns = ANIMS.flatMap((animation) => Array.from(
    { length: animation.frames },
    (_, frame) => ({
      animation: animation.id,
      frame,
      label: `${animation.id[0].toUpperCase()}${frame + 1}`,
    }),
  ));
  const width = labelWidth + columns.length * cellWidth + 4;
  const height = titleHeight + headerHeight + shieldFamilies.length * cellHeight + 4;
  const body = [];
  body.push(`<rect width="${width}" height="${height}" fill="#131722"/>`);
  body.push('<defs><pattern id="checker" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#303849"/><rect width="8" height="8" fill="#252c3b"/><rect x="8" y="8" width="8" height="8" fill="#252c3b"/></pattern></defs>');
  body.push(`<text x="6" y="22" class="title">SHIELD ALL-FRAME AUDIT - ${shieldTier.toUpperCase()} - ${direction.toUpperCase()}</text>`);
  columns.forEach((column, index) => body.push(`<text x="${labelWidth + index * cellWidth + 4}" y="${titleHeight + 19}" class="header">${column.label}</text>`));
  shieldFamilies.forEach((shield, rowIndex) => {
    const y = titleHeight + headerHeight + rowIndex * cellHeight;
    body.push(`<text x="6" y="${y + Math.floor(cellHeight / 2) + 5}" class="label">${shield.name.toUpperCase()}</text>`);
    columns.forEach((column, columnIndex) => {
      const x = labelWidth + columnIndex * cellWidth;
      const pixels = render(shield.id, shieldTier, direction, column.animation, column.frame);
      body.push(`<rect x="${x}" y="${y}" width="${SIZE * scale}" height="${SIZE * scale}" fill="url(#checker)"/>`);
      body.push(pixelRects(pixels, x, y, scale));
    });
  });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges"><style>text{font-family:Consolas,monospace;font-weight:700}.title{font-size:18px;fill:#f4cf66}.header{font-size:14px;fill:#9ed8ff}.label{font-size:13px;fill:#e8edf7}</style>${body.join('')}</svg>`;
  await writeFile(path.join(output, `shield-all-frames-${shieldTier}-${direction}.svg`), svg, 'utf8');
}

const rows = [];
for (const shield of shieldFamilies) for (const shieldTier of SHIELD_TIERS) {
  for (const direction of directions) for (const animation of ANIMS) {
    for (let frame = 0; frame < animation.frames; frame++) {
      rows.push(placementMetrics(shield.id, shieldTier.id, direction, animation.id, frame));
    }
  }
}

for (const tier of SHIELD_TIERS) {
  await writeTierMatrix(tier.id);
  for (const direction of directions) await writeDirectionMatrix(tier.id, direction);
}
await writeFile(path.join(output, 'shield-placement-metrics.json'), JSON.stringify(rows, null, 2), 'utf8');

const summarize = (direction) => {
  const selected = rows.filter((row) => row.direction === direction);
  return {
    cases: selected.length,
    discardedPixels: selected.reduce((total, row) => total + row.discarded, 0),
    adjacentWithoutOverlap: selected.filter((row) => row.contactDistance === 1).length,
    separatedByGap: selected.filter((row) => row.contactDistance > 1).length,
    noBodyOverlap: selected.filter((row) => row.overlap === 0).length,
    proposedDiscardedPixels: selected.reduce((total, row) => total + row.proposedDiscarded, 0),
    proposedSeparatedByGap: selected.filter((row) => row.proposedContactDistance > 1).length,
    proposedNoBodyOverlap: selected.filter((row) => row.proposedOverlap === 0).length,
    shieldMinX: Math.min(...selected.map((row) => row.shieldBounds.minX)),
    shieldMaxX: Math.max(...selected.map((row) => row.shieldBounds.maxX)),
    shieldMinY: Math.min(...selected.map((row) => row.shieldBounds.minY)),
    shieldMaxY: Math.max(...selected.map((row) => row.shieldBounds.maxY)),
  };
};

console.log(JSON.stringify({ totalCases: rows.length, directions: Object.fromEntries(directions.map((direction) => [direction, summarize(direction)])) }, null, 2));
