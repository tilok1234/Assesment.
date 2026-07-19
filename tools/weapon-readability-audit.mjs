import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const outputFlag = process.argv.indexOf('--out');
const focusFlag = process.argv.indexOf('--focus');
const allFrames = process.argv.includes('--all-frames');
const outputArg = outputFlag >= 0 ? process.argv[outputFlag + 1] : 'weapon-review';
const focusIds = focusFlag >= 0
  ? new Set(String(process.argv[focusFlag + 1] || '').split(',').map((value) => value.trim()).filter(Boolean))
  : null;
const output = path.resolve(root, outputArg);

const engine = await import(`${new URL('../sprite-engine.js', import.meta.url).href}?weapon-review=${Date.now()}`);
const { ANIMS, DIRS, SIZE, WEAPONS, WEAPON_TIERS, drawSprite } = engine;
const equippedWeapons = WEAPONS.filter((weapon) => weapon.id !== 'none');
const weapons = focusIds ? equippedWeapons.filter((weapon) => focusIds.has(weapon.id)) : equippedWeapons;
if (!weapons.length) throw new Error('The weapon review focus did not match any equipped weapon ids.');

await mkdir(output, { recursive: true });
if (allFrames) await mkdir(path.join(output, 'all-frames'), { recursive: true });
if (allFrames) await mkdir(path.join(output, 'all-frames-native'), { recursive: true });

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

function playerSpec(weapon, weaponTier) {
  return {
    kind: 'player',
    species: 'human',
    bodyBuild: 'classic',
    skin: 'peach',
    hairStyle: 'bald',
    hairColor: 'brown',
    expression: 'neutral',
    faceDetail: 'none',
    headgear: 'none',
    outfit: 'tunic',
    outfitTier: 'tier1',
    outfitColor: 'charcoal',
    weapon,
    weaponTier,
    shield: 'none',
    shieldTier: 'tier1',
  };
}

function render(spec, direction, animation, frame, weaponOnly = false) {
  const context = new PixelContext();
  if (weaponOnly) {
    drawSprite(context, spec, direction, animation, frame, { layer: 'weapon-back', shadow: false });
    drawSprite(context, spec, direction, animation, frame, { layer: 'weapon-front', shadow: false, clear: false });
  } else {
    drawSprite(context, spec, direction, animation, frame, { shadow: false });
  }
  return context.pixels;
}

function renderLayer(spec, direction, animation, frame, layer) {
  const context = new PixelContext();
  drawSprite(context, spec, direction, animation, frame, { layer, shadow: false });
  return context.pixels;
}

function xml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function pixelRects(pixels, offsetX, offsetY, scale) {
  const outputRects = [];
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    const fill = pixels[y * SIZE + x];
    if (!fill) continue;
    outputRects.push(`<rect x="${offsetX + x * scale}" y="${offsetY + y * scale}" width="${scale}" height="${scale}" fill="${xml(fill)}"/>`);
  }
  return outputRects.join('');
}

async function writeMatrix(filename, title, columns, renderCell) {
  const scale = 6;
  const labelWidth = 132;
  const titleHeight = 34;
  const headerHeight = 30;
  const cellWidth = SIZE * scale + 8;
  const cellHeight = SIZE * scale + 8;
  const width = labelWidth + columns.length * cellWidth + 4;
  const height = titleHeight + headerHeight + weapons.length * cellHeight + 4;
  const body = [];

  body.push(`<rect width="${width}" height="${height}" fill="#131722"/>`);
  body.push(`<defs><pattern id="checker" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="#303849"/><rect width="12" height="12" fill="#252c3b"/><rect x="12" y="12" width="12" height="12" fill="#252c3b"/></pattern></defs>`);
  body.push(`<text x="6" y="22" class="title">${xml(title)}</text>`);
  columns.forEach((column, index) => {
    body.push(`<text x="${labelWidth + index * cellWidth + 8}" y="${titleHeight + 20}" class="header">${xml(column.label)}</text>`);
  });
  weapons.forEach((weapon, row) => {
    const y = titleHeight + headerHeight + row * cellHeight;
    body.push(`<text x="6" y="${y + Math.floor(cellHeight / 2) + 6}" class="label">${xml(weapon.name.toUpperCase())}</text>`);
    columns.forEach((column, columnIndex) => {
      const x = labelWidth + columnIndex * cellWidth;
      body.push(`<rect x="${x}" y="${y}" width="${SIZE * scale}" height="${SIZE * scale}" fill="url(#checker)"/>`);
      body.push(pixelRects(renderCell(weapon, column), x, y, scale));
    });
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges"><style>text{font-family:Consolas,monospace;font-weight:700}.title{font-size:18px;fill:#f4cf66}.header{font-size:16px;fill:#9ed8ff}.label{font-size:15px;fill:#e8edf7}</style>${body.join('')}</svg>`;
  await writeFile(path.join(output, filename), svg);
  return filename;
}

async function writeAllFrameSheet(weapon, scale = 3, folder = 'all-frames') {
  const labelWidth = 104;
  const titleHeight = 34;
  const headerHeight = 26;
  const cellWidth = SIZE * scale + 6;
  const cellHeight = SIZE * scale + 6;
  const columns = ANIMS.flatMap((animation) => Array.from(
    { length: animation.frames },
    (_, frame) => ({ animation: animation.id, frame, label: `${animation.id[0].toUpperCase()}${frame + 1}` }),
  ));
  const rows = WEAPON_TIERS.flatMap((tier, tierIndex) => DIRS.map((direction) => ({
    tier: tier.id,
    label: `T${tierIndex + 1} ${direction.toUpperCase()}`,
    direction,
  })));
  const width = labelWidth + columns.length * cellWidth + 4;
  const height = titleHeight + headerHeight + rows.length * cellHeight + 4;
  const body = [];

  body.push(`<rect width="${width}" height="${height}" fill="#131722"/>`);
  body.push('<defs><pattern id="checker" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#303849"/><rect width="6" height="6" fill="#252c3b"/><rect x="6" y="6" width="6" height="6" fill="#252c3b"/></pattern></defs>');
  body.push(`<text x="6" y="22" class="title">${xml(`${weapon.name.toUpperCase()} ASSEMBLED ALL FRAMES`)}</text>`);
  columns.forEach((column, index) => {
    body.push(`<text x="${labelWidth + index * cellWidth + 4}" y="${titleHeight + 17}" class="header">${xml(column.label)}</text>`);
  });
  rows.forEach((row, rowIndex) => {
    const y = titleHeight + headerHeight + rowIndex * cellHeight;
    body.push(`<text x="6" y="${y + Math.floor(cellHeight / 2) + 5}" class="label">${xml(row.label)}</text>`);
    columns.forEach((column, columnIndex) => {
      const x = labelWidth + columnIndex * cellWidth;
      body.push(`<rect x="${x}" y="${y}" width="${SIZE * scale}" height="${SIZE * scale}" fill="url(#checker)"/>`);
      body.push(pixelRects(
        render(playerSpec(weapon.id, row.tier), row.direction, column.animation, column.frame),
        x,
        y,
        scale,
      ));
    });
  });

  const relativePath = `${folder}/${weapon.id}-all-frames.svg`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges"><style>text{font-family:Consolas,monospace;font-weight:700}.title{font-size:18px;fill:#f4cf66}.header{font-size:13px;fill:#9ed8ff}.label{font-size:13px;fill:#e8edf7}</style>${body.join('')}</svg>`;
  await writeFile(path.join(output, relativePath), svg);
  return relativePath;
}

const tierColumns = WEAPON_TIERS.map((tier, index) => ({ id: tier.id, label: `T${index + 1}` }));
const directionColumns = DIRS.map((direction) => ({
  id: direction,
  label: direction === 'down' ? 'FRONT' : direction === 'up' ? 'BACK' : direction.toUpperCase(),
}));
const frameColumns = [0, 1, 2, 3].map((frame) => ({ id: frame, label: `F${frame + 1}` }));
const sheets = [];

sheets.push(await writeMatrix('01-tier-assembled-front-hold.svg', 'ASSEMBLED FRONT HOLD', tierColumns,
  (weapon, tier) => render(playerSpec(weapon.id, tier.id), 'down', 'idle', 0)));
sheets.push(await writeMatrix('02-tier-weapon-only-front-hold.svg', 'WEAPON ONLY FRONT HOLD', tierColumns,
  (weapon, tier) => render(playerSpec(weapon.id, tier.id), 'down', 'idle', 0, true)));
sheets.push(await writeMatrix('03-tier-assembled-side-strike.svg', 'ASSEMBLED SIDE STRIKE', tierColumns,
  (weapon, tier) => render(playerSpec(weapon.id, tier.id), 'right', 'attack', 1)));
sheets.push(await writeMatrix('04-tier1-direction-strike.svg', 'T1 DIRECTION STRIKE', directionColumns,
  (weapon, direction) => render(playerSpec(weapon.id, 'tier1'), direction.id, 'attack', 1)));
sheets.push(await writeMatrix('05-tier5-direction-strike.svg', 'T5 DIRECTION STRIKE', directionColumns,
  (weapon, direction) => render(playerSpec(weapon.id, 'tier5'), direction.id, 'attack', 1)));
sheets.push(await writeMatrix('06-tier1-side-attack.svg', 'T1 SIDE ATTACK', frameColumns,
  (weapon, frame) => render(playerSpec(weapon.id, 'tier1'), 'right', 'attack', frame.id)));
sheets.push(await writeMatrix('07-tier5-side-attack.svg', 'T5 SIDE ATTACK', frameColumns,
  (weapon, frame) => render(playerSpec(weapon.id, 'tier5'), 'right', 'attack', frame.id)));
const allFrameSheets = allFrames
  ? await Promise.all(weapons.map((weapon) => writeAllFrameSheet(weapon)))
  : [];
const nativeAllFrameSheets = allFrames
  ? await Promise.all(weapons.map((weapon) => writeAllFrameSheet(weapon, 1, 'all-frames-native')))
  : [];

function frameMetrics(pixels) {
  const active = pixels.map(Boolean);
  const points = active.flatMap((isActive, index) => isActive ? [[index % SIZE, Math.floor(index / SIZE)]] : []);
  if (!points.length) return {
    pixels: 0,
    components: 0,
    minX: null,
    minY: null,
    maxX: null,
    maxY: null,
    boundsWidth: 0,
    boundsHeight: 0,
    bboxArea: 0,
    edgeSides: [],
  };
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
        const nextX = x + dx;
        const nextY = y + dy;
        const next = nextY * SIZE + nextX;
        if (nextX < 0 || nextY < 0 || nextX >= SIZE || nextY >= SIZE || !active[next] || seen.has(next)) continue;
        seen.add(next);
        queue.push([nextX, nextY]);
      }
    }
  }
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  const edgeSides = [];
  if (minX === 0) edgeSides.push('left');
  if (minY === 0) edgeSides.push('top');
  if (maxX === SIZE - 1) edgeSides.push('right');
  if (maxY === SIZE - 1) edgeSides.push('bottom');
  return {
    pixels: points.length,
    components,
    minX,
    minY,
    maxX,
    maxY,
    boundsWidth: maxX - minX + 1,
    boundsHeight: maxY - minY + 1,
    bboxArea: (maxX - minX + 1) * (maxY - minY + 1),
    edgeSides,
  };
}

function minimumPixelDistance(first, second) {
  const firstPoints = first.flatMap((pixel, index) => pixel ? [[index % SIZE, Math.floor(index / SIZE)]] : []);
  const secondPoints = second.flatMap((pixel, index) => pixel ? [[index % SIZE, Math.floor(index / SIZE)]] : []);
  let minimum = Infinity;
  for (const [firstX, firstY] of firstPoints) for (const [secondX, secondY] of secondPoints) {
    minimum = Math.min(minimum, Math.max(Math.abs(firstX - secondX), Math.abs(firstY - secondY)));
  }
  return Number.isFinite(minimum) ? minimum : null;
}

const frameAudit = [];
for (const weapon of weapons) for (const tier of WEAPON_TIERS) for (const direction of DIRS) {
  for (const animation of ANIMS) for (let frame = 0; frame < animation.frames; frame++) {
    const spec = playerSpec(weapon.id, tier.id);
    const weaponPixels = render(spec, direction, animation.id, frame, true);
    const unarmed = render({ ...spec, weapon: 'none' }, direction, animation.id, frame);
    const expression = renderLayer(spec, direction, animation.id, frame, 'expression');
    const metric = frameMetrics(weaponPixels);
    frameAudit.push({
      weapon: weapon.id,
      tier: tier.id,
      direction,
      animation: animation.id,
      frame,
      pixels: metric.pixels,
      components: metric.components,
      minX: metric.minX,
      minY: metric.minY,
      maxX: metric.maxX,
      maxY: metric.maxY,
      boundsWidth: metric.boundsWidth,
      boundsHeight: metric.boundsHeight,
      boundsArea: metric.bboxArea,
      edgeSides: metric.edgeSides.join('|'),
      characterDistance: minimumPixelDistance(weaponPixels, unarmed),
      expressionOverlapPixels: expression.filter((pixel, index) => pixel && weaponPixels[index]).length,
    });
  }
}

const metrics = [];
for (const weapon of weapons) for (const tier of WEAPON_TIERS) {
  const directions = DIRS.map((direction) => frameMetrics(render(playerSpec(weapon.id, tier.id), direction, 'attack', 1, true)));
  const average = (field) => Number((directions.reduce((sum, value) => sum + value[field], 0) / directions.length).toFixed(2));
  metrics.push({
    weapon: weapon.id,
    tier: tier.id,
    averagePixels: average('pixels'),
    averageBoundsArea: average('bboxArea'),
    maximumComponents: Math.max(...directions.map((value) => value.components)),
    edgeDirections: directions.filter((value) => value.edgeSides.length).length,
  });
}

await writeFile(path.join(output, 'weapon-readability-metrics.json'), `${JSON.stringify(metrics, null, 2)}\n`);
await writeFile(path.join(output, 'weapon-readability-metrics.csv'), [
  'weapon,tier,averagePixels,averageBoundsArea,maximumComponents,edgeDirections',
  ...metrics.map((row) => Object.values(row).join(',')),
].join('\n'));
await writeFile(path.join(output, 'weapon-frame-audit.json'), `${JSON.stringify(frameAudit, null, 2)}\n`);
const frameAuditFields = ['weapon', 'tier', 'direction', 'animation', 'frame', 'pixels', 'components', 'minX', 'minY', 'maxX', 'maxY', 'boundsWidth', 'boundsHeight', 'boundsArea', 'edgeSides', 'characterDistance', 'expressionOverlapPixels'];
await writeFile(path.join(output, 'weapon-frame-audit.csv'), [
  frameAuditFields.join(','),
  ...frameAudit.map((row) => frameAuditFields.map((field) => row[field] ?? '').join(',')),
].join('\n'));

const cards = sheets.map((sheet) => `<section><h2>${xml(sheet.replace(/^[0-9]+-/, '').replace('.svg', '').replaceAll('-', ' '))}</h2><a href="./${sheet}"><img src="./${sheet}" alt="${xml(sheet)}"></a></section>`).join('');
const allFrameCards = allFrameSheets.map((sheet) => `<section><h2>${xml(sheet.split('/').at(-1).replace('-all-frames.svg', '').replaceAll('-', ' '))} all frames</h2><a href="./${sheet}"><img src="./${sheet}" alt="${xml(sheet)}"></a></section>`).join('');
const nativeAllFrameCards = nativeAllFrameSheets.map((sheet) => `<section><h2>${xml(sheet.split('/').at(-1).replace('-all-frames.svg', '').replaceAll('-', ' '))} native all frames</h2><a href="./${sheet}"><img src="./${sheet}" alt="${xml(sheet)}"></a></section>`).join('');
const dashboard = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Weapon readability review</title><style>body{margin:0;background:#0d1018;color:#eef3ff;font:16px system-ui,sans-serif}header{position:sticky;top:0;padding:16px 24px;background:#131722;border-bottom:1px solid #303849;z-index:1}main{display:grid;gap:24px;padding:24px}section{background:#181d29;padding:16px;border-radius:8px;overflow:auto}h1,h2{margin:0 0 10px}p{margin:6px 0;color:#bfc9dc}a{color:#9ed8ff}img{display:block;max-width:none;image-rendering:pixelated}</style></head><body><header><h1>Weapon readability review</h1><p>${weapons.length} weapon families, ${weapons.length * WEAPON_TIERS.length} tier variants. Enlarged and true native 24×24 all-frame sheets are included.</p><p><a href="./weapon-readability-metrics.csv">Summary CSV</a> · <a href="./weapon-readability-metrics.json">Summary JSON</a> · <a href="./weapon-frame-audit.csv">All-frame CSV</a> · <a href="./weapon-frame-audit.json">All-frame JSON</a></p></header><main>${cards}${allFrameCards}${nativeAllFrameCards}</main></body></html>`;
await writeFile(path.join(output, 'index.html'), dashboard);

console.log(`Generated ${sheets.length + allFrameSheets.length + nativeAllFrameSheets.length} weapon review sheets and ${frameAudit.length} frame-audit rows for ${weapons.length} families in ${path.relative(root, output)}.`);
