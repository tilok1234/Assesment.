import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import * as engine from '../sprite-engine.js';
import { buildStoredZip } from '../zip.js';
import { encodeRgbaPng, hexToRgba } from './enemy-expansion-review-pixels.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EXPORTER_PATH = fileURLToPath(import.meta.url);
const PACKAGE_ID = '8-bit-sprite-assembler-all-enemies-3-outline-modes-v1';
const DEFAULT_OUTPUT_DIRECTORY = path.join(ROOT, 'dist', PACKAGE_ID);
const EXPECTED_FAMILY_COUNT = 74;
const EXPECTED_VARIANT_COUNT = 245;
const FIXED_ZIP_TIMESTAMP = new Date(2000, 0, 1, 0, 0, 0);
const ALLOWED_DIRTY_PATHS = new Set([
  'package.json',
  'tools/check-all-enemy-outline-pack.mjs',
  'tools/export-all-enemy-outline-pack.mjs',
]);
const TREATMENTS = Object.freeze([
  Object.freeze({
    folder: 'outlined',
    label: 'Outlined',
    shadeMode: engine.SHADE_MODE_FORM,
    outlineMode: engine.OUTLINE_MODE_COMPLETE_B,
    description: 'Approved Form shading with the strong Complete B outline.',
  }),
  Object.freeze({
    folder: 'semi-outlined',
    label: 'Semi-outlined',
    shadeMode: engine.SHADE_MODE_FORM,
    outlineMode: engine.OUTLINE_MODE_SELECTIVE_C,
    description: 'Approved Form shading with the lighter Selective C outline.',
  }),
  Object.freeze({
    folder: 'without-outlines',
    label: 'Without outlines',
    shadeMode: engine.SHADE_MODE_FORM,
    outlineMode: engine.OUTLINE_MODE_NONE,
    description: 'Approved Form shading with outlines disabled.',
  }),
]);
const execFileAsync = promisify(execFile);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sha256(data) {
  return createHash('sha256').update(data).digest('hex');
}

function posix(value) {
  return value.split(path.sep).join('/');
}

function parseArguments(argv) {
  const result = {
    outputDirectory: DEFAULT_OUTPUT_DIRECTORY,
    zipPath: null,
    generatedOn: new Date().toISOString().slice(0, 10),
  };
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index];
    const value = argv[index + 1];
    if (argument === '--output-dir') {
      if (!value) throw new Error('--output-dir requires a directory path.');
      result.outputDirectory = path.resolve(value);
      index++;
    } else if (argument === '--zip') {
      if (!value) throw new Error('--zip requires a file path.');
      result.zipPath = path.resolve(value);
      index++;
    } else if (argument === '--generated') {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) {
        throw new Error('--generated requires an ISO date in YYYY-MM-DD form.');
      }
      result.generatedOn = value;
      index++;
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }
  result.zipPath ||= `${result.outputDirectory}.zip`;
  result.hashPath = `${result.zipPath}.sha256`;
  return result;
}

async function assertAbsent(target, label) {
  try {
    await access(target);
  } catch (error) {
    if (error?.code === 'ENOENT') return;
    throw error;
  }
  throw new Error(`${label} already exists: ${target}`);
}

async function gitOutput(args, { trim = true } = {}) {
  const { stdout } = await execFileAsync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    windowsHide: true,
  });
  return trim ? stdout.trim() : stdout;
}

function statusPath(line) {
  const raw = line.slice(3).trim();
  return raw.includes(' -> ') ? raw.split(' -> ').at(-1) : raw;
}

async function sourceState() {
  const [commit, branch, status] = await Promise.all([
    gitOutput(['rev-parse', 'HEAD']),
    gitOutput(['branch', '--show-current']),
    gitOutput(['status', '--porcelain=v1', '--untracked-files=all'], { trim: false }),
  ]);
  const dirtyPaths = status
    .split(/\r?\n/)
    .filter(Boolean)
    .map(statusPath)
    .map((entry) => entry.replaceAll('\\', '/'));
  const unexpected = dirtyPaths.filter((entry) => !ALLOWED_DIRTY_PATHS.has(entry));
  assert(
    unexpected.length === 0,
    `Export refused because sprite source files are dirty: ${unexpected.join(', ')}`,
  );
  return { commit, branch, dirtyPaths: dirtyPaths.sort() };
}

class PixelCanvas {
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

function pixelsToRgba(pixels) {
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

function validateEveryFrameHasPixels(canvas, assetPath) {
  for (let row = 0; row < engine.DIRS.length; row++) {
    for (let column = 0; column < engine.SHEET_COLS; column++) {
      let opaque = 0;
      for (let y = 0; y < engine.SIZE; y++) {
        for (let x = 0; x < engine.SIZE; x++) {
          const sheetX = (column * engine.SIZE) + x;
          const sheetY = (row * engine.SIZE) + y;
          if (canvas.pixels[(sheetY * canvas.width) + sheetX] !== null) opaque++;
        }
      }
      assert(opaque > 0, `${assetPath} has an empty actor frame at row ${row}, column ${column}.`);
    }
  }
}

function renderAsset(spec, treatment, assetPath) {
  const canvas = engine.buildSheet(spec, 1, {
    shadow: false,
    shadeMode: treatment.shadeMode,
    outlineMode: treatment.outlineMode,
  });
  assert(canvas.width === engine.SHEET_COLS * engine.SIZE, `${assetPath} has the wrong width.`);
  assert(canvas.height === engine.DIRS.length * engine.SIZE, `${assetPath} has the wrong height.`);
  validateEveryFrameHasPixels(canvas, assetPath);
  const { rgba, opaquePixels } = pixelsToRgba(canvas.pixels);
  const data = encodeRgbaPng(canvas.width, canvas.height, rgba);
  return { data, width: canvas.width, height: canvas.height, opaquePixels };
}

function buildReadme({ source, generatedOn, pngCount }) {
  const animationColumns = [];
  let start = 0;
  for (const animation of engine.ANIMS) {
    const end = start + animation.frames - 1;
    animationColumns.push(`- ${animation.name}: columns ${start}-${end} (${animation.frames} frames, ${animation.ms} ms/frame)`);
    start = end + 1;
  }
  return [
    '# Full Enemy Export - Three Outline Modes',
    '',
    `This local candidate export contains every complete enemy in the stable public roster: ${EXPECTED_FAMILY_COUNT} families and ${EXPECTED_VARIANT_COUNT} variants.`,
    `It was generated from source commit \`${source.commit}\` on ${generatedOn}.`,
    '',
    '## Top-level art folders',
    '',
    '- `outlined/`: Form shading + Complete B, the strong approved outline.',
    '- `semi-outlined/`: Form shading + Selective C, the lighter approved outline.',
    '- `without-outlines/`: Form shading + None, with outline geometry disabled.',
    '',
    'Each folder contains `family-id/variant-id.png` paths for all 245 variants. The three treatments vary only the outline mode; Form shading remains enabled in all three.',
    '',
    '## Sheet contract',
    '',
    '- Native 1x PNG with transparent background and hard/binary alpha.',
    `- ${engine.SIZE}x${engine.SIZE} cells, ${engine.SHEET_COLS} columns, ${engine.DIRS.length} direction rows, ${engine.SHEET_COLS * engine.SIZE}x${engine.DIRS.length * engine.SIZE} pixels per full sheet.`,
    `- Direction rows: ${engine.DIRS.join(', ')}.`,
    ...animationColumns,
    '- Enemy Cast aliases Attack. Enemy Death uses Hurt frames 1, 2, 2, 2.',
    '',
    `The package contains ${pngCount} enemy PNGs total. \`manifest.json\` records the full roster, treatment mapping, dimensions, byte sizes, opaque-pixel counts, and SHA-256 hashes.`,
    '',
    '## Scope boundary',
    '',
    'Incomplete and non-public EN-E03 work is excluded, including the Boulder Hurler Idle-only candidate. Bosses, players, effects, floor shadows, projectiles, and release binaries are also excluded.',
    '',
    'This is a local review/export artifact, not a public release. The repository currently has no approved license file, so this package intentionally contains no invented license text.',
    '',
  ].join('\n');
}

async function writeDirectory(outputDirectory, entries) {
  await mkdir(outputDirectory, { recursive: true });
  const directories = new Set(entries.map((entry) => path.dirname(path.join(outputDirectory, ...entry.name.split('/')))));
  await Promise.all([...directories].map((directory) => mkdir(directory, { recursive: true })));
  for (let index = 0; index < entries.length; index += 32) {
    await Promise.all(entries.slice(index, index + 32).map((entry) => (
      writeFile(path.join(outputDirectory, ...entry.name.split('/')), entry.data)
    )));
  }
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  assert(path.resolve(options.outputDirectory) !== ROOT, 'The export directory cannot be the repository root.');
  await Promise.all([
    assertAbsent(options.outputDirectory, 'Output directory'),
    assertAbsent(options.zipPath, 'ZIP archive'),
    assertAbsent(options.hashPath, 'ZIP hash sidecar'),
  ]);

  const [source, exporterSource] = await Promise.all([
    sourceState(),
    readFile(EXPORTER_PATH),
  ]);
  const variantCount = engine.PUBLIC_ENEMIES.reduce((total, family) => total + family.variants.length, 0);
  assert(engine.PUBLIC_ENEMIES.length === EXPECTED_FAMILY_COUNT, `Expected ${EXPECTED_FAMILY_COUNT} public families, found ${engine.PUBLIC_ENEMIES.length}.`);
  assert(variantCount === EXPECTED_VARIANT_COUNT, `Expected ${EXPECTED_VARIANT_COUNT} public variants, found ${variantCount}.`);
  assert(engine.SIZE === 24 && engine.SHEET_COLS === 20, 'The native 24px / 20-column export contract drifted.');
  assert(JSON.stringify(engine.DIRS) === JSON.stringify(['down', 'left', 'right', 'up']), 'The direction order drifted.');

  const assets = [];
  const records = [];
  const originalDocument = globalThis.document;
  globalThis.document = {
    createElement(tag) {
      if (tag !== 'canvas') throw new Error(`Unsupported headless element: ${tag}`);
      return new PixelCanvas();
    },
  };
  try {
    for (const family of engine.PUBLIC_ENEMIES) {
      for (const variant of family.variants) {
        const spec = { kind: 'enemy', family: family.id, variant: variant.id };
        assert(engine.enemySupportsOutline(spec), `${family.id}/${variant.id} does not support the approved outline modes.`);
        const treatmentRecords = [];
        for (const treatment of TREATMENTS) {
          const assetPath = `${treatment.folder}/${family.id}/${variant.id}.png`;
          const rendered = renderAsset(spec, treatment, assetPath);
          const record = {
            path: assetPath,
            treatment: treatment.folder,
            family: family.id,
            variant: variant.id,
            width: rendered.width,
            height: rendered.height,
            bytes: rendered.data.length,
            opaquePixels: rendered.opaquePixels,
            sha256: sha256(rendered.data),
          };
          assets.push({ name: assetPath, data: rendered.data });
          records.push(record);
          treatmentRecords.push(record);
        }
        const opaqueByTreatment = Object.fromEntries(treatmentRecords.map((record) => [record.treatment, record.opaquePixels]));
        assert(
          opaqueByTreatment.outlined > opaqueByTreatment['semi-outlined']
            && opaqueByTreatment['semi-outlined'] > opaqueByTreatment['without-outlines'],
          `${family.id}/${variant.id} does not preserve the strong > light > none outline geometry order.`,
        );
        assert(new Set(treatmentRecords.map((record) => record.sha256)).size === TREATMENTS.length, `${family.id}/${variant.id} treatments are not visually distinct.`);
      }
    }
  } finally {
    if (originalDocument === undefined) delete globalThis.document;
    else globalThis.document = originalDocument;
  }

  assets.sort((left, right) => left.name.localeCompare(right.name));
  records.sort((left, right) => left.path.localeCompare(right.path));
  const expectedPngCount = EXPECTED_VARIANT_COUNT * TREATMENTS.length;
  assert(assets.length === expectedPngCount, `Expected ${expectedPngCount} PNGs, rendered ${assets.length}.`);
  assert(new Set(assets.map((asset) => asset.name)).size === expectedPngCount, 'The package has duplicate asset paths.');

  const readme = buildReadme({ source, generatedOn: options.generatedOn, pngCount: assets.length });
  const readmeData = new TextEncoder().encode(readme);
  const manifest = {
    id: PACKAGE_ID,
    name: '8-bit Sprite Assembler Full Enemy Export - Three Outline Modes',
    version: 1,
    status: 'local-review-candidate',
    generatedOn: options.generatedOn,
    source: {
      commit: source.commit,
      branch: source.branch,
      engineFilesClean: true,
      candidateToolPaths: source.dirtyPaths,
      exporterSha256: sha256(exporterSource),
    },
    scope: {
      catalog: 'PUBLIC_ENEMIES',
      familyCount: engine.PUBLIC_ENEMIES.length,
      variantCount,
      treatmentCount: TREATMENTS.length,
      pngCount: assets.length,
      excluded: [
        'incomplete and non-public EN-E03 candidates',
        'bosses',
        'players',
        'combat effects',
        'floor shadows',
        'projectiles',
        'release binaries',
      ],
    },
    frameContract: {
      nativeScale: 1,
      cellWidth: engine.SIZE,
      cellHeight: engine.SIZE,
      sheetColumns: engine.SHEET_COLS,
      directionRows: engine.DIRS.length,
      sheetWidth: engine.SHEET_COLS * engine.SIZE,
      sheetHeight: engine.DIRS.length * engine.SIZE,
      directionOrder: engine.DIRS,
      animations: engine.ANIMS.map((animation) => ({ ...animation })),
      transparentBackground: true,
      hardAlpha: true,
      shadow: false,
    },
    treatments: TREATMENTS.map((treatment) => ({ ...treatment })),
    roster: engine.PUBLIC_ENEMIES.map((family) => ({
      id: family.id,
      name: family.name,
      variants: family.variants.map((variant) => ({ id: variant.id, name: variant.name })),
    })),
    supportFiles: {
      'README.md': {
        bytes: readmeData.length,
        sha256: sha256(readmeData),
      },
    },
    assets: records,
    license: null,
    releaseReady: false,
  };
  const manifestData = new TextEncoder().encode(`${JSON.stringify(manifest, null, 2)}\n`);
  const packageEntries = [
    { name: 'manifest.json', data: manifestData },
    { name: 'README.md', data: readmeData },
    ...assets,
  ];

  const archive = buildStoredZip(packageEntries, FIXED_ZIP_TIMESTAMP);
  const archiveSha256 = sha256(archive);
  await writeDirectory(options.outputDirectory, packageEntries);
  await mkdir(path.dirname(options.zipPath), { recursive: true });
  await writeFile(options.zipPath, archive);
  await writeFile(options.hashPath, `${archiveSha256}  ${path.basename(options.zipPath)}\n`, 'utf8');

  console.log('Full enemy export created.');
  console.log(`- source: ${source.commit}`);
  console.log(`- families: ${engine.PUBLIC_ENEMIES.length}`);
  console.log(`- variants per treatment: ${variantCount}`);
  console.log(`- PNGs: ${assets.length}`);
  console.log(`- directory: ${options.outputDirectory}`);
  console.log(`- ZIP: ${options.zipPath}`);
  console.log(`- ZIP bytes: ${archive.length}`);
  console.log(`- ZIP SHA-256: ${archiveSha256}`);
}

await main();
