import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { inflateSync } from 'node:zlib';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EXPORTER_PATH = path.join(ROOT, 'tools', 'export-all-enemy-outline-pack.mjs');
const PACKAGE_ID = '8-bit-sprite-assembler-all-enemies-3-outline-modes-v1';
const DEFAULT_OUTPUT_DIRECTORY = path.join(ROOT, 'dist', PACKAGE_ID);
const EXPECTED_TREATMENTS = ['outlined', 'semi-outlined', 'without-outlines'];
const EXPECTED_FAMILIES = 67;
const EXPECTED_VARIANTS = 232;
const EXPECTED_PNGS = EXPECTED_VARIANTS * EXPECTED_TREATMENTS.length;
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const execFileAsync = promisify(execFile);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sha256(data) {
  return createHash('sha256').update(data).digest('hex');
}

function parseArguments(argv) {
  const result = { outputDirectory: DEFAULT_OUTPUT_DIRECTORY, zipPath: null };
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
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }
  result.zipPath ||= `${result.outputDirectory}.zip`;
  result.hashPath = `${result.zipPath}.sha256`;
  return result;
}

async function recursiveFiles(root, directory = root) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await recursiveFiles(root, absolute));
    else if (entry.isFile()) files.push(path.relative(root, absolute).split(path.sep).join('/'));
  }
  return files.sort();
}

function parsePng(data, assetPath) {
  assert(data.subarray(0, 8).equals(PNG_SIGNATURE), `${assetPath} has an invalid PNG signature.`);
  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  let interlace = 0;
  const idat = [];
  while (offset < data.length) {
    const length = data.readUInt32BE(offset);
    const type = data.subarray(offset + 4, offset + 8).toString('ascii');
    const chunk = data.subarray(offset + 8, offset + 8 + length);
    if (type === 'IHDR') {
      width = chunk.readUInt32BE(0);
      height = chunk.readUInt32BE(4);
      bitDepth = chunk[8];
      colorType = chunk[9];
      interlace = chunk[12];
    } else if (type === 'IDAT') {
      idat.push(chunk);
    } else if (type === 'IEND') {
      break;
    }
    offset += 12 + length;
  }
  assert(width === 480 && height === 96, `${assetPath} must be 480x96, found ${width}x${height}.`);
  assert(bitDepth === 8 && colorType === 6 && interlace === 0, `${assetPath} must be non-interlaced 8-bit RGBA.`);
  assert(idat.length > 0, `${assetPath} is missing PNG image data.`);
  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * 4;
  assert(raw.length === (stride + 1) * height, `${assetPath} has an unexpected decoded length.`);
  let opaquePixels = 0;
  const frameOpaque = new Uint32Array(20 * 4);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (stride + 1);
    assert(raw[rowOffset] === 0, `${assetPath} uses an unexpected PNG row filter.`);
    for (let x = 0; x < width; x++) {
      const alpha = raw[rowOffset + 1 + (x * 4) + 3];
      assert(alpha === 0 || alpha === 255, `${assetPath} has non-binary alpha at ${x},${y}.`);
      if (alpha === 255) {
        opaquePixels++;
        frameOpaque[(Math.floor(y / 24) * 20) + Math.floor(x / 24)]++;
      }
    }
  }
  assert([...frameOpaque].every((count) => count > 0), `${assetPath} contains an empty actor frame.`);
  return { width, height, opaquePixels };
}

function parseStoredZip(data) {
  const entries = [];
  let offset = 0;
  while (offset + 4 <= data.length && data.readUInt32LE(offset) === 0x04034b50) {
    const flags = data.readUInt16LE(offset + 6);
    const method = data.readUInt16LE(offset + 8);
    const compressedSize = data.readUInt32LE(offset + 18);
    const uncompressedSize = data.readUInt32LE(offset + 22);
    const nameLength = data.readUInt16LE(offset + 26);
    const extraLength = data.readUInt16LE(offset + 28);
    assert((flags & 0x0008) === 0, 'ZIP entries must not use data descriptors.');
    assert(method === 0, 'ZIP entries must use the deterministic stored method.');
    assert(compressedSize === uncompressedSize, 'Stored ZIP entry sizes must match.');
    const nameStart = offset + 30;
    const dataStart = nameStart + nameLength + extraLength;
    const name = data.subarray(nameStart, nameStart + nameLength).toString('utf8');
    const entryData = data.subarray(dataStart, dataStart + compressedSize);
    assert(entryData.length === compressedSize, `${name} is truncated in the ZIP.`);
    entries.push({ name, data: entryData });
    offset = dataStart + compressedSize;
  }
  assert(entries.length > 0, 'ZIP has no local file entries.');
  assert(data.readUInt32LE(offset) === 0x02014b50, 'ZIP central directory is missing after local entries.');
  return entries;
}

async function gitHead() {
  const { stdout } = await execFileAsync('git', ['rev-parse', 'HEAD'], {
    cwd: ROOT,
    encoding: 'utf8',
    windowsHide: true,
  });
  return stdout.trim();
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const manifestPath = path.join(options.outputDirectory, 'manifest.json');
  const [manifestData, readmeData, exporterData, head, files, zipData, hashText] = await Promise.all([
    readFile(manifestPath),
    readFile(path.join(options.outputDirectory, 'README.md')),
    readFile(EXPORTER_PATH),
    gitHead(),
    recursiveFiles(options.outputDirectory),
    readFile(options.zipPath),
    readFile(options.hashPath, 'utf8'),
  ]);
  const manifest = JSON.parse(manifestData.toString('utf8'));
  assert(manifest.id === PACKAGE_ID, 'Package id is incorrect.');
  assert(manifest.status === 'local-review-candidate', 'Package must remain marked as a local review candidate.');
  assert(manifest.releaseReady === false && manifest.license === null, 'Candidate release/license boundary drifted.');
  assert(manifest.source.commit === head, 'Manifest source commit does not match Git HEAD.');
  assert(manifest.source.engineFilesClean === true, 'Manifest must record a clean engine source boundary.');
  assert(manifest.source.exporterSha256 === sha256(exporterData), 'Exporter source hash drifted after generation.');
  assert(manifest.scope.familyCount === EXPECTED_FAMILIES, `Expected ${EXPECTED_FAMILIES} families.`);
  assert(manifest.scope.variantCount === EXPECTED_VARIANTS, `Expected ${EXPECTED_VARIANTS} variants.`);
  assert(manifest.scope.pngCount === EXPECTED_PNGS, `Expected ${EXPECTED_PNGS} PNGs.`);
  assert(manifest.frameContract.sheetWidth === 480 && manifest.frameContract.sheetHeight === 96, 'Manifest sheet dimensions drifted.');
  assert(manifest.frameContract.hardAlpha === true && manifest.frameContract.shadow === false, 'Manifest alpha/shadow contract drifted.');
  assert(JSON.stringify(manifest.frameContract.directionOrder) === JSON.stringify(['down', 'left', 'right', 'up']), 'Manifest direction order drifted.');
  assert(JSON.stringify(manifest.frameContract.animations.map((animation) => animation.frames)) === JSON.stringify([2, 4, 4, 4, 2, 4]), 'Manifest animation frame counts drifted.');
  assert(JSON.stringify(manifest.treatments.map((treatment) => treatment.folder)) === JSON.stringify(EXPECTED_TREATMENTS), 'Manifest treatment folders drifted.');
  assert(manifest.treatments.every((treatment) => treatment.shadeMode === 'form'), 'Every treatment must retain Form shading.');
  assert(manifest.roster.length === EXPECTED_FAMILIES, 'Manifest roster family count drifted.');
  assert(manifest.roster.flatMap((family) => family.variants).length === EXPECTED_VARIANTS, 'Manifest roster variant count drifted.');
  assert(manifest.assets.length === EXPECTED_PNGS, 'Manifest asset record count drifted.');
  assert(manifest.supportFiles['README.md'].sha256 === sha256(readmeData), 'README hash does not match the manifest.');
  assert(manifest.supportFiles['README.md'].bytes === readmeData.length, 'README byte count does not match the manifest.');

  const expectedFiles = ['README.md', 'manifest.json', ...manifest.assets.map((asset) => asset.path)].sort();
  assert(JSON.stringify(files) === JSON.stringify(expectedFiles), 'Unpacked directory files do not exactly match the manifest.');
  const records = new Map(manifest.assets.map((asset) => [asset.path, asset]));
  assert(records.size === EXPECTED_PNGS, 'Manifest has duplicate asset paths.');
  const treatmentCounts = Object.fromEntries(EXPECTED_TREATMENTS.map((treatment) => [treatment, 0]));
  const variantTreatments = new Map();
  for (const assetPath of [...records.keys()].sort()) {
    const record = records.get(assetPath);
    const data = await readFile(path.join(options.outputDirectory, ...assetPath.split('/')));
    assert(data.length === record.bytes, `${assetPath} byte count does not match the manifest.`);
    assert(sha256(data) === record.sha256, `${assetPath} SHA-256 does not match the manifest.`);
    const parsed = parsePng(data, assetPath);
    assert(parsed.opaquePixels === record.opaquePixels, `${assetPath} opaque-pixel count does not match the manifest.`);
    assert(EXPECTED_TREATMENTS.includes(record.treatment), `${assetPath} has an unknown treatment.`);
    assert(assetPath.startsWith(`${record.treatment}/`), `${assetPath} is in the wrong treatment folder.`);
    treatmentCounts[record.treatment]++;
    const key = `${record.family}/${record.variant}`;
    if (!variantTreatments.has(key)) variantTreatments.set(key, []);
    variantTreatments.get(key).push(record);
  }
  for (const treatment of EXPECTED_TREATMENTS) {
    assert(treatmentCounts[treatment] === EXPECTED_VARIANTS, `${treatment} must contain ${EXPECTED_VARIANTS} PNGs.`);
  }
  assert(variantTreatments.size === EXPECTED_VARIANTS, 'The package does not contain exactly 232 family/variant groups.');
  for (const [key, entries] of variantTreatments) {
    assert(entries.length === EXPECTED_TREATMENTS.length, `${key} does not have all three treatments.`);
    const byTreatment = Object.fromEntries(entries.map((entry) => [entry.treatment, entry]));
    assert(
      byTreatment.outlined.opaquePixels > byTreatment['semi-outlined'].opaquePixels
        && byTreatment['semi-outlined'].opaquePixels > byTreatment['without-outlines'].opaquePixels,
      `${key} outline opacity order drifted.`,
    );
    assert(new Set(entries.map((entry) => entry.sha256)).size === EXPECTED_TREATMENTS.length, `${key} treatments are not distinct.`);
  }

  const archiveSha256 = sha256(zipData);
  const sidecarMatch = /^([0-9a-f]{64})\s{2}(.+)\r?\n?$/.exec(hashText);
  assert(sidecarMatch, 'ZIP SHA-256 sidecar format is invalid.');
  assert(sidecarMatch[1] === archiveSha256, 'ZIP SHA-256 sidecar digest does not match the archive.');
  assert(sidecarMatch[2] === path.basename(options.zipPath), 'ZIP SHA-256 sidecar filename does not match the archive.');
  const zipEntries = parseStoredZip(zipData);
  assert(zipEntries.length === expectedFiles.length, 'ZIP entry count does not match the unpacked package.');
  assert(new Set(zipEntries.map((entry) => entry.name)).size === zipEntries.length, 'ZIP has duplicate entry names.');
  const zipByName = new Map(zipEntries.map((entry) => [entry.name, entry.data]));
  for (const file of expectedFiles) {
    assert(zipByName.has(file), `ZIP is missing ${file}.`);
    const diskData = await readFile(path.join(options.outputDirectory, ...file.split('/')));
    assert(sha256(zipByName.get(file)) === sha256(diskData), `ZIP entry ${file} differs from the unpacked file.`);
  }

  console.log('Full enemy export validation passed.');
  console.log(`- source commit: ${head}`);
  console.log(`- families: ${EXPECTED_FAMILIES}`);
  console.log(`- variants: ${EXPECTED_VARIANTS}`);
  console.log(`- treatments: ${EXPECTED_TREATMENTS.length}`);
  console.log(`- PNGs: ${EXPECTED_PNGS}`);
  console.log(`- directory files: ${files.length}`);
  console.log(`- ZIP entries: ${zipEntries.length}`);
  console.log(`- ZIP bytes: ${zipData.length}`);
  console.log(`- ZIP SHA-256: ${archiveSha256}`);
}

await main();
