import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const label = process.argv[2] || 'review';
const engine = await import(`${new URL('../sprite-engine.js', import.meta.url).href}?bone-tier3-review=${Date.now()}`);
const {
  ANIMS,
  DIRS,
  SIZE,
  drawOutlinedSprite,
  drawSprite,
  OUTLINE_MODE_COMPLETE_B,
  OUTLINE_MODE_NONE,
  OUTLINE_MODE_SELECTIVE_C,
} = engine;
const output = path.join(root, 'shield-review');
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

function spec(shieldTier = 'tier3') {
  return {
    kind: 'player', species: 'human', bodyBuild: 'classic', skin: 'peach',
    hairStyle: 'bald', hairColor: 'brown', expression: 'neutral', faceDetail: 'none',
    headgear: 'none', outfit: 'tunic', outfitTier: 'tier1', outfitColor: 'charcoal',
    weapon: 'none', weaponTier: 'tier1', shield: 'bone', shieldTier,
  };
}

function render(
  direction,
  animation,
  frame,
  shieldOnly = false,
  discarded = [],
  shieldTier = 'tier3',
  outlineMode = OUTLINE_MODE_NONE,
) {
  const context = new PixelContext();
  const options = { shadow: false, onOutOfBounds: (pixel) => discarded.push(pixel) };
  if (shieldOnly) {
    drawSprite(context, spec(shieldTier), direction, animation, frame, { ...options, layer: 'shield-back' });
    drawSprite(context, spec(shieldTier), direction, animation, frame, { ...options, layer: 'shield-front', clear: false });
  } else {
    drawOutlinedSprite(context, spec(shieldTier), direction, animation, frame, { ...options, outlineMode });
  }
  return context.pixels;
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

function frameMetrics(pixels) {
  const active = pixels.map(Boolean);
  const points = active.flatMap((value, index) => value ? [[index % SIZE, Math.floor(index / SIZE)]] : []);
  const seen = new Set();
  let components = 0;
  for (const [startX, startY] of points) {
    const start = startY * SIZE + startX;
    if (seen.has(start)) continue;
    components++;
    const queue = [[startX, startY]];
    seen.add(start);
    while (queue.length) {
      const [x, y] = queue.pop();
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = x + dx;
        const ny = y + dy;
        const index = ny * SIZE + nx;
        if (nx < 0 || ny < 0 || nx >= SIZE || ny >= SIZE || !active[index] || seen.has(index)) continue;
        seen.add(index);
        queue.push([nx, ny]);
      }
    }
  }
  if (!points.length) return { pixels: 0, components: 0, boundsArea: 0 };
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  return {
    pixels: points.length,
    components,
    boundsArea: (Math.max(...xs) - Math.min(...xs) + 1) * (Math.max(...ys) - Math.min(...ys) + 1),
  };
}

async function writeMatrix(kind, shieldOnly, outlineMode = OUTLINE_MODE_NONE) {
  const scale = 4;
  const labelWidth = 112;
  const titleHeight = 34;
  const headerHeight = 30;
  const cellWidth = SIZE * scale + 6;
  const cellHeight = SIZE * scale + 6;
  const columns = ANIMS.flatMap((animation) => Array.from(
    { length: animation.frames },
    (_, frame) => ({ animation: animation.id, frame, label: `${animation.id[0].toUpperCase()}${frame + 1}` }),
  ));
  const rows = DIRS.map((direction) => ({
    direction,
    label: direction === 'down' ? 'FRONT / DOWN' : direction === 'up' ? 'BACK / UP' : direction.toUpperCase(),
  }));
  const width = labelWidth + columns.length * cellWidth + 4;
  const height = titleHeight + headerHeight + rows.length * cellHeight + 4;
  const body = [];
  const metrics = [];

  body.push(`<rect width="${width}" height="${height}" fill="#131722"/>`);
  body.push('<defs><pattern id="checker" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#303849"/><rect width="8" height="8" fill="#252c3b"/><rect x="8" y="8" width="8" height="8" fill="#252c3b"/></pattern></defs>');
  body.push(`<text x="6" y="22" class="title">BONE SHIELD T3 - ${xml(label.toUpperCase())} - ${xml(kind.toUpperCase())}</text>`);
  columns.forEach((column, index) => body.push(`<text x="${labelWidth + index * cellWidth + 4}" y="${titleHeight + 19}" class="header">${column.label}</text>`));
  rows.forEach((row, rowIndex) => {
    const y = titleHeight + headerHeight + rowIndex * cellHeight;
    body.push(`<text x="6" y="${y + Math.floor(cellHeight / 2) + 5}" class="label">${row.label}</text>`);
    columns.forEach((column, columnIndex) => {
      const x = labelWidth + columnIndex * cellWidth;
      const discarded = [];
      const pixels = render(row.direction, column.animation, column.frame, shieldOnly, discarded, 'tier3', outlineMode);
      body.push(`<rect x="${x}" y="${y}" width="${SIZE * scale}" height="${SIZE * scale}" fill="url(#checker)"/>`);
      body.push(pixelRects(pixels, x, y, scale));
      metrics.push({ direction: row.direction, animation: column.animation, frame: column.frame, discarded: discarded.length, ...frameMetrics(pixels) });
    });
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges"><style>text{font-family:Consolas,monospace;font-weight:700}.title{font-size:18px;fill:#f4cf66}.header{font-size:14px;fill:#9ed8ff}.label{font-size:13px;fill:#e8edf7}</style>${body.join('')}</svg>`;
  await writeFile(path.join(output, `bone-tier3-${label}-${kind}.svg`), svg, 'utf8');
  return metrics;
}

async function writeTierControlMatrix() {
  const scale = 4;
  const labelWidth = 112;
  const titleHeight = 34;
  const headerHeight = 30;
  const cellWidth = SIZE * scale + 6;
  const cellHeight = SIZE * scale + 6;
  const tiers = ['tier2', 'tier3', 'tier4'];
  const modes = [
    { id: OUTLINE_MODE_NONE, label: 'NONE' },
    { id: OUTLINE_MODE_COMPLETE_B, label: 'COMPLETE B' },
    { id: OUTLINE_MODE_SELECTIVE_C, label: 'SELECTIVE C' },
  ];
  const columns = tiers.flatMap((shieldTier) => DIRS.map((direction) => ({
    shieldTier,
    direction,
    label: `${shieldTier.toUpperCase().replace('TIER', 'T')} ${direction[0].toUpperCase()}`,
  })));
  const width = labelWidth + columns.length * cellWidth + 4;
  const height = titleHeight + headerHeight + modes.length * cellHeight + 4;
  const body = [];
  body.push(`<rect width="${width}" height="${height}" fill="#131722"/>`);
  body.push('<defs><pattern id="checker" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#303849"/><rect width="8" height="8" fill="#252c3b"/><rect x="8" y="8" width="8" height="8" fill="#252c3b"/></pattern></defs>');
  body.push(`<text x="6" y="22" class="title">BONE SHIELD TIER CONTROLS - IDLE FRAME 1</text>`);
  columns.forEach((column, index) => body.push(`<text x="${labelWidth + index * cellWidth + 4}" y="${titleHeight + 19}" class="header">${column.label}</text>`));
  modes.forEach((mode, rowIndex) => {
    const y = titleHeight + headerHeight + rowIndex * cellHeight;
    body.push(`<text x="6" y="${y + Math.floor(cellHeight / 2) + 5}" class="label">${mode.label}</text>`);
    columns.forEach((column, columnIndex) => {
      const x = labelWidth + columnIndex * cellWidth;
      const pixels = render(column.direction, 'idle', 0, false, [], column.shieldTier, mode.id);
      body.push(`<rect x="${x}" y="${y}" width="${SIZE * scale}" height="${SIZE * scale}" fill="url(#checker)"/>`);
      body.push(pixelRects(pixels, x, y, scale));
    });
  });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges"><style>text{font-family:Consolas,monospace;font-weight:700}.title{font-size:18px;fill:#f4cf66}.header{font-size:14px;fill:#9ed8ff}.label{font-size:13px;fill:#e8edf7}</style>${body.join('')}</svg>`;
  await writeFile(path.join(output, `bone-tier3-${label}-tier-controls.svg`), svg, 'utf8');
}

const assembled = await writeMatrix('assembled-none-all-frames', false, OUTLINE_MODE_NONE);
const completeB = await writeMatrix('assembled-complete-b-all-frames', false, OUTLINE_MODE_COMPLETE_B);
const selectiveC = await writeMatrix('assembled-selective-c-all-frames', false, OUTLINE_MODE_SELECTIVE_C);
const shieldOnly = await writeMatrix('shield-only-all-frames', true);
await writeTierControlMatrix();
const summary = (rows) => ({
  cases: rows.length,
  discardedPixels: rows.reduce((total, row) => total + row.discarded, 0),
  minimumPixels: Math.min(...rows.map((row) => row.pixels)),
  maximumPixels: Math.max(...rows.map((row) => row.pixels)),
  maximumComponents: Math.max(...rows.map((row) => row.components)),
  fragmentedCases: rows.filter((row) => row.components > 1).map(({ direction, animation, frame, components }) => ({ direction, animation, frame, components })),
  maximumBoundsArea: Math.max(...rows.map((row) => row.boundsArea)),
});
const tierIdleCounts = Object.fromEntries(['tier2', 'tier3', 'tier4'].map((shieldTier) => [
  shieldTier,
  Object.fromEntries(DIRS.map((direction) => [
    direction,
    {
      assembled: frameMetrics(render(direction, 'idle', 0, false, [], shieldTier)).pixels,
      shieldOnly: frameMetrics(render(direction, 'idle', 0, true, [], shieldTier)).pixels,
    },
  ])),
]));
console.log(JSON.stringify({
  assembledNone: summary(assembled),
  assembledCompleteB: summary(completeB),
  assembledSelectiveC: summary(selectiveC),
  shieldOnly: summary(shieldOnly),
  tierIdleCounts,
}, null, 2));
