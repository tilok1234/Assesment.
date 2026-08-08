// Headless exporter for the committed legacy enemy fixtures in asset-pack/.
//
// The committed pack is an explicit legacy 12-column 4x fixture (1152x384,
// idle/walk/attack/hurt) that the in-app 20-column exporter cannot produce.
// This tool renders any enemy variant straight from the engine catalogs to
// that exact contract and regenerates asset-pack/manifest.json from
// engine/catalogs/enemies.js, so neither the PNG nor the 1,358-line manifest
// is ever hand-made again.
//
// IMPORTANT: much of the committed corpus predates later approved engine art
// changes (as of 2026-08-08, 166 of 202 sheets are stale — run --verify for
// the live list). Updating published art is a designer decision, so write
// mode NEVER overwrites an existing fixture whose pixels differ from the
// current engine render unless --accept-drift is passed. Up-to-date fixtures
// are left byte-untouched.
//
// Usage:
//   node tools/export-enemy-fixtures.mjs --all                    export every variant (drift-guarded)
//   node tools/export-enemy-fixtures.mjs --family slime           one family (drift-guarded)
//   node tools/export-enemy-fixtures.mjs --family slime --variant lime
//   node tools/export-enemy-fixtures.mjs --missing                only variants without a PNG
//   node tools/export-enemy-fixtures.mjs --verify [--family X]    compare renders against disk, write nothing
//   Add --accept-drift to update stale published fixtures (designer decision).
//   Add --no-manifest to skip the manifest rewrite.

import { readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { deflateSync, inflateSync } from 'node:zlib';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const assetRoot = path.join(root, 'asset-pack');
const manifestPath = path.join(assetRoot, 'manifest.json');

const engine = await import(pathToFileURL(path.join(root, 'sprite-engine.js')).href);
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

const format = manifest.format;
const scale = format.exportScale;
const legacyAnimations = format.animations.map(({ id, frames }) => ({ id, frames }));
const legacyColumns = legacyAnimations.reduce((total, animation) => total + animation.frames, 0);
const sheetWidth = legacyColumns * engine.SIZE * scale;
const sheetHeight = format.rows.length * engine.SIZE * scale;
if (sheetWidth !== format.sheetSize.width || sheetHeight !== format.sheetSize.height) {
  throw new Error(`manifest format is inconsistent: computed ${sheetWidth}x${sheetHeight}, declared ${format.sheetSize.width}x${format.sheetSize.height}`);
}

// ---------------- CLI ----------------
const args = process.argv.slice(2);
function argValue(flag) {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : null;
}
const familyFilter = argValue('--family');
const variantFilter = argValue('--variant');
const exportAll = args.includes('--all');
const onlyMissing = args.includes('--missing');
const verifyOnly = args.includes('--verify');
const acceptDrift = args.includes('--accept-drift');
const writeManifest = !args.includes('--no-manifest');

if (!familyFilter && !variantFilter && !exportAll && !onlyMissing && !verifyOnly) {
  console.error('Nothing selected. Use --all, --missing, --verify, or --family <id> [--variant <id>].');
  process.exit(1);
}

// ---------------- rendering ----------------
function renderFramePixels(spec, direction, animationId, frame) {
  const pixels = new Array(engine.SIZE * engine.SIZE).fill(null);
  let fillStyle = '#000000';
  const context = {
    clearRect() { pixels.fill(null); },
    get fillStyle() { return fillStyle; },
    set fillStyle(value) { fillStyle = value; },
    fillRect(x, y, width, height) {
      for (let py = y; py < y + height; py++) {
        for (let px = x; px < x + width; px++) {
          if (px >= 0 && py >= 0 && px < engine.SIZE && py < engine.SIZE) {
            pixels[(py * engine.SIZE) + px] = fillStyle;
          }
        }
      }
    },
  };
  // The committed fixtures predate outline/shade and carry no ground shadow —
  // verified pixel-identical against the tracked corpus with these options.
  engine.drawAssembledSprite(context, spec, direction, animationId, frame, { shadow: false });
  return pixels;
}

function renderFixtureRgba(spec) {
  const rgba = Buffer.alloc(sheetWidth * sheetHeight * 4);
  for (const [row, direction] of format.rows.entries()) {
    let column = 0;
    for (const animation of legacyAnimations) {
      for (let frame = 0; frame < animation.frames; frame++) {
        const pixels = renderFramePixels(spec, direction, animation.id, frame);
        for (let y = 0; y < engine.SIZE; y++) {
          for (let x = 0; x < engine.SIZE; x++) {
            const fill = pixels[(y * engine.SIZE) + x];
            if (fill === null) continue;
            const red = Number.parseInt(fill.slice(1, 3), 16);
            const green = Number.parseInt(fill.slice(3, 5), 16);
            const blue = Number.parseInt(fill.slice(5, 7), 16);
            for (let sy = 0; sy < scale; sy++) {
              for (let sx = 0; sx < scale; sx++) {
                const px = (column * engine.SIZE + x) * scale + sx;
                const py = (row * engine.SIZE + y) * scale + sy;
                const offset = (py * sheetWidth + px) * 4;
                rgba[offset] = red;
                rgba[offset + 1] = green;
                rgba[offset + 2] = blue;
                rgba[offset + 3] = 255;
              }
            }
          }
        }
        column++;
      }
    }
  }
  return rgba;
}

// ---------------- PNG encode/decode ----------------
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const crcTable = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function pngCrc(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
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
function encodePng(width, height, rgba) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;
  const stride = width * 4;
  const rows = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) rgba.copy(rows, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  return Buffer.concat([
    PNG_SIGNATURE,
    pngChunk('IHDR', header),
    pngChunk('IDAT', deflateSync(rows, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}
function decodePng(buffer) {
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  const chunks = [];
  for (let offset = 8; offset + 12 <= buffer.length;) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString('ascii');
    if (type === 'IDAT') chunks.push(buffer.subarray(offset + 8, offset + 8 + length));
    offset = offset + 8 + length + 4;
    if (type === 'IEND') break;
  }
  const stride = width * 4;
  const raw = inflateSync(Buffer.concat(chunks));
  const pixels = Buffer.alloc(stride * height);
  const paeth = (left, up, upperLeft) => {
    const estimate = left + up - upperLeft;
    const leftDistance = Math.abs(estimate - left);
    const upDistance = Math.abs(estimate - up);
    const upperLeftDistance = Math.abs(estimate - upperLeft);
    if (leftDistance <= upDistance && leftDistance <= upperLeftDistance) return left;
    return upDistance <= upperLeftDistance ? up : upperLeft;
  };
  for (let y = 0; y < height; y++) {
    const sourceStart = y * (stride + 1);
    const filter = raw[sourceStart];
    for (let x = 0; x < stride; x++) {
      const value = raw[sourceStart + 1 + x];
      const target = y * stride + x;
      const left = x >= 4 ? pixels[target - 4] : 0;
      const up = y > 0 ? pixels[target - stride] : 0;
      const upperLeft = y > 0 && x >= 4 ? pixels[target - stride - 4] : 0;
      const predictor = filter === 1
        ? left
        : filter === 2
          ? up
          : filter === 3
            ? Math.floor((left + up) / 2)
            : filter === 4
              ? paeth(left, up, upperLeft)
              : 0;
      pixels[target] = (value + predictor) & 0xff;
    }
  }
  return { width, height, pixels };
}

// ---------------- selection ----------------
const selected = [];
for (const family of engine.ENEMIES) {
  if (familyFilter && family.id !== familyFilter) continue;
  for (const variant of family.variants) {
    if (variantFilter && variant.id !== variantFilter) continue;
    selected.push({ family, variant });
  }
}
if ((familyFilter || variantFilter) && selected.length === 0) {
  console.error(`No catalog match for${familyFilter ? ` --family ${familyFilter}` : ''}${variantFilter ? ` --variant ${variantFilter}` : ''}.`);
  process.exit(1);
}

// ---------------- run ----------------
let written = 0;
let verified = 0;
let skipped = 0;
let upToDate = 0;
const mismatches = [];
const driftBlocked = [];
for (const { family, variant } of selected) {
  const relativeFile = `enemies/${family.id}-${variant.id}.png`;
  const filePath = path.join(assetRoot, relativeFile);
  const spec = { kind: 'enemy', family: family.id, variant: variant.id };

  if (onlyMissing && !verifyOnly) {
    try {
      await access(filePath);
      skipped++;
      continue;
    } catch {}
  }

  const rgba = renderFixtureRgba(spec);
  let existing = null;
  try {
    existing = decodePng(await readFile(filePath));
  } catch {}
  const matchesExisting = existing
    && existing.width === sheetWidth
    && existing.height === sheetHeight
    && existing.pixels.equals(rgba);

  if (verifyOnly) {
    if (!existing) mismatches.push(`${relativeFile}: missing from disk`);
    else if (!matchesExisting) mismatches.push(`${relativeFile}: rendered pixels differ from the committed fixture`);
    else verified++;
    continue;
  }

  if (matchesExisting) {
    upToDate++;
    continue;
  }
  if (existing && !acceptDrift) {
    driftBlocked.push(relativeFile);
    continue;
  }
  await writeFile(filePath, encodePng(sheetWidth, sheetHeight, rgba));
  written++;
}

// ---------------- manifest ----------------
let manifestWritten = false;
if (!verifyOnly && writeManifest) {
  const newEnemies = engine.ENEMIES.map((family) => ({
    family: family.id,
    name: family.name,
    variants: family.variants.map((variant) => ({
      id: variant.id,
      name: variant.name,
      file: `enemies/${family.id}-${variant.id}.png`,
    })),
  }));
  const newCounts = {
    ...manifest.counts,
    enemyFamilies: newEnemies.length,
    enemySheets: newEnemies.reduce((total, family) => total + family.variants.length, 0),
  };
  // Only touch the manifest when its content actually changed — a run that
  // wrote nothing must not churn tracked files or bump the generated date.
  const contentChanged = JSON.stringify({ enemies: manifest.enemies, counts: manifest.counts })
    !== JSON.stringify({ enemies: newEnemies, counts: newCounts });
  if (contentChanged) {
    manifest.enemies = newEnemies;
    manifest.counts = newCounts;
    manifest.generated = new Date().toISOString().slice(0, 10);
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
    manifestWritten = true;
  }
}

if (verifyOnly) {
  if (mismatches.length) {
    console.error(`Fixture verification failed for ${mismatches.length} of ${selected.length} sheets:`);
    for (const mismatch of mismatches) console.error(`- ${mismatch}`);
    process.exit(1);
  }
  if (verified === 0) {
    console.error('Fixture verification matched zero sheets — check the filters.');
    process.exit(1);
  }
  console.log(`Fixture verification passed: ${verified} sheet${verified === 1 ? '' : 's'} match the engine render exactly.`);
} else {
  const parts = [`Exported ${written} fixture sheet${written === 1 ? '' : 's'} (${sheetWidth}x${sheetHeight}, legacy ${legacyColumns}-column ${scale}x contract)`];
  if (upToDate) parts.push(`${upToDate} already up to date (untouched)`);
  if (skipped) parts.push(`${skipped} skipped (--missing)`);
  parts.push(manifestWritten ? 'manifest.json regenerated from the catalog' : 'manifest.json unchanged');
  console.log(`${parts.join('; ')}.`);
  if (driftBlocked.length) {
    console.warn(`NOT overwritten — ${driftBlocked.length} existing fixture${driftBlocked.length === 1 ? '' : 's'} differ from the current engine render (published art is a designer decision):`);
    for (const file of driftBlocked) console.warn(`- ${file}`);
    console.warn('Re-run with --accept-drift to update published art, or `--verify` to audit the full corpus.');
    if (written === 0) process.exit(1);
  }
}
