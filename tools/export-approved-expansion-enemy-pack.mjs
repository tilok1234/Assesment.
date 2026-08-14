import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import * as engine from '../sprite-engine.js';
import {
  EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE,
  EN_E11_RAVEN_MOURNGLASS_SCRIER_REGISTRY,
} from '../engine/enemy-expansion-en-e11-raven-mournglass-scrier.js';
import {
  EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE,
  EN_E11_RAVEN_GRAVECROWN_HARROWER_REGISTRY,
} from '../engine/enemy-expansion-en-e11-raven-gravecrown-harrower.js';
import {
  EN_E11_OWL_HUSHMASK_PROWLER_GATE,
  EN_E11_OWL_HUSHMASK_PROWLER_REGISTRY,
} from '../engine/enemy-expansion-en-e11-owl-hushmask-prowler.js';
import {
  EN_E11_OWL_MOONVEIL_AUGUR_GATE,
  EN_E11_OWL_MOONVEIL_AUGUR_REGISTRY,
} from '../engine/enemy-expansion-en-e11-owl-moonveil-augur.js';
import {
  EN_E11_OWL_ECLIPSECROWN_NOCTARCH_GATE,
  EN_E11_OWL_ECLIPSECROWN_NOCTARCH_REGISTRY,
} from '../engine/enemy-expansion-en-e11-owl-eclipsecrown-noctarch.js';
import {
  EN_E11_PHOENIX_ASHCREST_KINDLER_GATE,
  EN_E11_PHOENIX_ASHCREST_KINDLER_REGISTRY,
} from '../engine/enemy-expansion-en-e11-phoenix-ashcrest-kindler.js';
import {
  EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE,
  EN_E11_PHOENIX_SUNVEIL_CANTOR_REGISTRY,
} from '../engine/enemy-expansion-en-e11-phoenix-sunveil-cantor.js';
import {
  EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_GATE,
  EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_REGISTRY,
} from '../engine/enemy-expansion-en-e11-phoenix-dawnthrone-imperator.js';
import { buildStoredZip } from '../zip.js';
import {
  captureEnemyExpansionFrame,
  encodeRgbaPng,
  hexToRgba,
} from './enemy-expansion-review-pixels.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EXPORTER_PATH = fileURLToPath(import.meta.url);
const PACKAGE_ID = '8-bit-sprite-assembler-approved-expansion-enemies-v1';
const DEFAULT_OUTPUT_DIRECTORY = path.join(ROOT, 'dist', PACKAGE_ID);
const EXPECTED_STABLE_FAMILIES = 43;
const EXPECTED_STABLE_VARIANTS = 114;
const EXPECTED_PRIVATE_VARIANTS = 8;
const EXPECTED_FAMILIES = 45;
const EXPECTED_VARIANTS = 122;
const EXPECTED_FRAMES_PER_SHEET = 80;
const FIXED_ZIP_TIMESTAMP = new Date(2000, 0, 1, 0, 0, 0);
const ALLOWED_DIRTY_PATHS = new Set([
  'package.json',
  'tools/export-approved-expansion-enemy-pack.mjs',
]);
const execFileAsync = promisify(execFile);
const encoder = new TextEncoder();

const PRIVATE_APPROVED_VARIANTS = Object.freeze([
  Object.freeze({
    sourceModule: 'engine/enemy-expansion-en-e11-raven-mournglass-scrier.js',
    gate: EN_E11_RAVEN_MOURNGLASS_SCRIER_GATE,
    registry: EN_E11_RAVEN_MOURNGLASS_SCRIER_REGISTRY,
  }),
  Object.freeze({
    sourceModule: 'engine/enemy-expansion-en-e11-raven-gravecrown-harrower.js',
    gate: EN_E11_RAVEN_GRAVECROWN_HARROWER_GATE,
    registry: EN_E11_RAVEN_GRAVECROWN_HARROWER_REGISTRY,
  }),
  Object.freeze({
    sourceModule: 'engine/enemy-expansion-en-e11-owl-hushmask-prowler.js',
    gate: EN_E11_OWL_HUSHMASK_PROWLER_GATE,
    registry: EN_E11_OWL_HUSHMASK_PROWLER_REGISTRY,
  }),
  Object.freeze({
    sourceModule: 'engine/enemy-expansion-en-e11-owl-moonveil-augur.js',
    gate: EN_E11_OWL_MOONVEIL_AUGUR_GATE,
    registry: EN_E11_OWL_MOONVEIL_AUGUR_REGISTRY,
  }),
  Object.freeze({
    sourceModule: 'engine/enemy-expansion-en-e11-owl-eclipsecrown-noctarch.js',
    gate: EN_E11_OWL_ECLIPSECROWN_NOCTARCH_GATE,
    registry: EN_E11_OWL_ECLIPSECROWN_NOCTARCH_REGISTRY,
  }),
  Object.freeze({
    sourceModule: 'engine/enemy-expansion-en-e11-phoenix-ashcrest-kindler.js',
    gate: EN_E11_PHOENIX_ASHCREST_KINDLER_GATE,
    registry: EN_E11_PHOENIX_ASHCREST_KINDLER_REGISTRY,
  }),
  Object.freeze({
    sourceModule: 'engine/enemy-expansion-en-e11-phoenix-sunveil-cantor.js',
    gate: EN_E11_PHOENIX_SUNVEIL_CANTOR_GATE,
    registry: EN_E11_PHOENIX_SUNVEIL_CANTOR_REGISTRY,
  }),
  Object.freeze({
    sourceModule: 'engine/enemy-expansion-en-e11-phoenix-dawnthrone-imperator.js',
    gate: EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_GATE,
    registry: EN_E11_PHOENIX_DAWNTHRONE_IMPERATOR_REGISTRY,
  }),
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sha256(data) {
  return createHash('sha256').update(data).digest('hex');
}

function hashJson(value) {
  return sha256(JSON.stringify(value));
}

function posix(value) {
  return value.split(path.sep).join('/');
}

function stableCompare(left, right) {
  return left.localeCompare(right, 'en', { sensitivity: 'base' });
}

function parseArguments(argv) {
  const result = {
    outputDirectory: DEFAULT_OUTPUT_DIRECTORY,
    zipPath: null,
    generatedOn: new Date().toISOString().slice(0, 10),
    verifyOnly: false,
  };
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index];
    const value = argv[index + 1];
    if (argument === '--output-dir') {
      assert(value, '--output-dir requires a directory path.');
      result.outputDirectory = path.resolve(value);
      index++;
    } else if (argument === '--zip') {
      assert(value, '--zip requires a file path.');
      result.zipPath = path.resolve(value);
      index++;
    } else if (argument === '--generated') {
      assert(/^\d{4}-\d{2}-\d{2}$/.test(value || ''), '--generated requires YYYY-MM-DD.');
      result.generatedOn = value;
      index++;
    } else if (argument === '--verify-only') {
      result.verifyOnly = true;
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
    `Export refused because unrelated or sprite source files are dirty: ${unexpected.join(', ')}`,
  );
  return { commit, branch, dirtyPaths: dirtyPaths.sort(stableCompare) };
}

function approvedRoster() {
  const stableFamilies = engine.ENEMY_EXPANSION_REGISTRY.families;
  const stableVariantCount = stableFamilies.reduce((total, family) => total + family.variants.length, 0);
  assert(stableFamilies.length === EXPECTED_STABLE_FAMILIES, `Expected ${EXPECTED_STABLE_FAMILIES} stable expansion families, found ${stableFamilies.length}.`);
  assert(stableVariantCount === EXPECTED_STABLE_VARIANTS, `Expected ${EXPECTED_STABLE_VARIANTS} stable expansion variants, found ${stableVariantCount}.`);

  const entries = [];
  for (const family of stableFamilies) {
    assert(family.state === engine.ENEMY_EXPANSION_STATES.APPROVED, `${family.id} is not approved in the stable expansion registry.`);
    for (const variant of family.variants) {
      entries.push({
        sliceId: family.sliceId,
        familyId: family.id,
        familyName: family.name,
        variantId: variant.id,
        variantName: variant.name,
        role: variant.role || null,
        rendererKey: family.rendererKey,
        registry: engine.ENEMY_EXPANSION_REGISTRY,
        publicIntegrated: true,
        approval: {
          source: 'stable-approved-expansion-registry',
          familyState: family.state,
          gateId: null,
          candidateFrameDigest: null,
          approvedImplementation: null,
          publishedImplementation: null,
          publishedApprovalRecord: null,
          initialPublishedHandoff: null,
        },
      });
    }
  }

  assert(PRIVATE_APPROVED_VARIANTS.length === EXPECTED_PRIVATE_VARIANTS, 'The private approved roster size drifted.');
  for (const approved of PRIVATE_APPROVED_VARIANTS) {
    const { gate, registry } = approved;
    assert(gate.status === 'approved', `${gate.id} is not approved.`);
    assert(gate.publicationState === 'published', `${gate.id} is not fully published.`);
    assert(typeof gate.candidateFrameDigest === 'string' && gate.candidateFrameDigest.length === 64, `${gate.id} has no frozen frame digest.`);
    assert(typeof gate.approvedImplementation === 'string' && gate.approvedImplementation.length === 40, `${gate.id} has no approved implementation.`);
    assert(gate.publishedImplementation === gate.approvedImplementation, `${gate.id} published a different implementation.`);
    assert(typeof gate.publishedApprovalRecord === 'string' && gate.publishedApprovalRecord.length === 40, `${gate.id} has no published approval record.`);
    assert(typeof gate.initialPublishedHandoff === 'string' && gate.initialPublishedHandoff.length === 40, `${gate.id} has no published handoff.`);
    assert(registry.families.length === 1, `${gate.id} must expose exactly one private family.`);
    const family = registry.families[0];
    assert(family.variants.length === 1, `${gate.id} must expose exactly one private variant.`);
    const variant = family.variants[0];
    entries.push({
      sliceId: family.sliceId,
      familyId: family.id,
      familyName: family.name,
      variantId: variant.id,
      variantName: variant.name,
      role: variant.role || null,
      rendererKey: family.rendererKey,
      registry,
      publicIntegrated: false,
      approval: {
        source: 'private-published-approval-gate',
        sourceModule: approved.sourceModule,
        familyState: family.state,
        gateId: gate.id,
        candidateFrameDigest: gate.candidateFrameDigest,
        approvedImplementation: gate.approvedImplementation,
        publishedImplementation: gate.publishedImplementation,
        publishedApprovalRecord: gate.publishedApprovalRecord,
        initialPublishedHandoff: gate.initialPublishedHandoff,
      },
    });
  }

  entries.sort((left, right) => (
    stableCompare(left.sliceId, right.sliceId)
      || stableCompare(left.familyId, right.familyId)
      || stableCompare(left.variantId, right.variantId)
  ));
  const identities = entries.map((entry) => `${entry.familyId}/${entry.variantId}`);
  assert(new Set(identities).size === identities.length, 'The approved package roster contains a duplicate family/variant id.');
  assert(entries.length === EXPECTED_VARIANTS, `Expected ${EXPECTED_VARIANTS} approved variants, found ${entries.length}.`);
  assert(new Set(entries.map((entry) => entry.familyId)).size === EXPECTED_FAMILIES, `Expected ${EXPECTED_FAMILIES} approved families.`);
  return entries;
}

function frameKey(direction, animation, frame) {
  return `${direction}/${animation}/${frame}`;
}

function frameRecord(captured, entry, direction, animation, frame) {
  return {
    family: entry.familyId,
    variant: entry.variantId,
    candidateFamily: entry.familyId,
    direction,
    animation,
    frame,
    digest: captured.digest,
    alphaDigest: captured.alphaDigest,
    opaquePixels: captured.opaquePixels,
    bounds: captured.bounds,
  };
}

function renderApprovedSheet(entry) {
  const spec = { kind: 'enemy', family: entry.familyId, variant: entry.variantId };
  const captures = new Map();
  const digestRecords = [];
  for (const animation of engine.ANIMS) {
    for (const direction of engine.DIRS) {
      for (let frame = 0; frame < animation.frames; frame++) {
        const captured = captureEnemyExpansionFrame(entry.registry, spec, direction, animation.id, frame);
        assert(captured.outOfBoundsWrites.length === 0, `${entry.familyId}/${entry.variantId} ${direction}/${animation.id}/${frame} drew outside its cell.`);
        assert(captured.opaquePixels > 0, `${entry.familyId}/${entry.variantId} ${direction}/${animation.id}/${frame} is empty.`);
        assert(captured.alpha.every((value) => value === 0 || value === 255), `${entry.familyId}/${entry.variantId} lost hard alpha.`);
        captures.set(frameKey(direction, animation.id, frame), captured);
        digestRecords.push(frameRecord(captured, entry, direction, animation.id, frame));
      }
    }
  }
  assert(captures.size === EXPECTED_FRAMES_PER_SHEET, `${entry.familyId}/${entry.variantId} did not render 80 frames.`);

  const width = engine.SHEET_COLS * engine.SIZE;
  const height = engine.DIRS.length * engine.SIZE;
  const rgba = Buffer.alloc(width * height * 4);
  const colorCache = new Map();
  const validationFrames = [];
  for (let row = 0; row < engine.DIRS.length; row++) {
    const direction = engine.DIRS[row];
    let column = 0;
    for (const animation of engine.ANIMS) {
      for (let frame = 0; frame < animation.frames; frame++, column++) {
        const captured = captures.get(frameKey(direction, animation.id, frame));
        validationFrames.push({
          direction,
          animation: animation.id,
          frame,
          alpha: captured.alpha,
          outOfBoundsWrites: captured.outOfBoundsWrites,
        });
        for (let y = 0; y < engine.SIZE; y++) {
          for (let x = 0; x < engine.SIZE; x++) {
            const color = captured.pixels[(y * engine.SIZE) + x];
            if (color === null) continue;
            if (!colorCache.has(color)) colorCache.set(color, hexToRgba(color));
            const [red, green, blue] = colorCache.get(color);
            const sheetX = (column * engine.SIZE) + x;
            const sheetY = (row * engine.SIZE) + y;
            const offset = ((sheetY * width) + sheetX) * 4;
            rgba[offset] = red;
            rgba[offset + 1] = green;
            rgba[offset + 2] = blue;
            rgba[offset + 3] = 255;
          }
        }
      }
    }
    assert(column === engine.SHEET_COLS, `${entry.familyId}/${entry.variantId} rendered the wrong column count.`);
  }

  const validation = engine.validateEnemyExpansionSheet({
    width,
    height,
    directions: [...engine.DIRS],
    frames: validationFrames,
  });
  const frameDigest = hashJson(digestRecords);
  if (!entry.publicIntegrated) {
    assert(
      frameDigest === entry.approval.candidateFrameDigest,
      `${entry.familyId}/${entry.variantId} no longer matches its approved frozen digest.`,
    );
  }
  const data = encodeRgbaPng(width, height, rgba);
  return {
    data,
    width,
    height,
    frames: validation.frames,
    opaquePixels: validation.opaquePixels,
    frameDigest,
    sha256: sha256(data),
  };
}

function groupedRoster(entries) {
  const families = new Map();
  for (const entry of entries) {
    const key = `${entry.sliceId}/${entry.familyId}`;
    if (!families.has(key)) {
      families.set(key, {
        sliceId: entry.sliceId,
        id: entry.familyId,
        name: entry.familyName,
        variants: [],
      });
    }
    families.get(key).variants.push({
      id: entry.variantId,
      name: entry.variantName,
      role: entry.role,
      publicIntegrated: entry.publicIntegrated,
      approvalSource: entry.approval.source,
      gateId: entry.approval.gateId,
    });
  }
  return [...families.values()];
}

function buildReadme({ source, generatedOn, entries }) {
  const privatePaths = entries
    .filter((entry) => !entry.publicIntegrated)
    .map((entry) => `- \`${entry.familyId}/${entry.variantId}\``);
  const animationColumns = [];
  let start = 0;
  for (const animation of engine.ANIMS) {
    const end = start + animation.frames - 1;
    animationColumns.push(`- ${animation.name}: columns ${start}-${end} (${animation.frames} frames)`);
    start = end + 1;
  }
  return [
    '# Approved Expansion Enemies',
    '',
    `This copy-only package contains all ${EXPECTED_VARIANTS} approved enemy-expansion sheets across ${EXPECTED_FAMILIES} families.`,
    `It was generated from source commit \`${source.commit}\` on ${generatedOn}.`,
    '',
    '## Contents',
    '',
    `- ${EXPECTED_STABLE_VARIANTS} sheets from the stable approved expansion registry.`,
    `- ${EXPECTED_PRIVATE_VARIANTS} separately approved and published private Raven, Owl, and Phoenix sheets.`,
    `- ${(EXPECTED_VARIANTS * EXPECTED_FRAMES_PER_SHEET).toLocaleString('en-US')} total frames.`,
    '- `manifest.json` with roster, approval provenance, dimensions, frame digests, byte sizes, and SHA-256 hashes.',
    '',
    'The private approved sheets are:',
    '',
    ...privatePaths,
    '',
    '## Sheet contract',
    '',
    '- Native 1x raw/no-outline PNGs with transparent backgrounds and binary alpha.',
    `- ${engine.SIZE}x${engine.SIZE} cells, ${engine.SHEET_COLS} columns, ${engine.DIRS.length} rows, ${engine.SHEET_COLS * engine.SIZE}x${engine.DIRS.length * engine.SIZE} pixels per sheet.`,
    `- Direction rows: ${engine.DIRS.join(', ')}.`,
    ...animationColumns,
    '- Cast aliases Attack. Death uses the approved Hurt-source alias contract.',
    '',
    '## Scope boundary',
    '',
    'This package copies approved source pixels only. It does not register private variants, enroll outlines, update fixtures, or change runtime catalogs.',
    'Legacy enemies, incomplete candidates, rejected review versions, bosses, players, effects, child assets, shadows, projectiles, and release binaries are excluded.',
    'This is a local asset package, not a public release. The repository has no approved license file, so no license text is invented here.',
    '',
  ].join('\n');
}

async function buildPackage(options) {
  const [source, exporterSource] = await Promise.all([
    sourceState(),
    readFile(EXPORTER_PATH),
  ]);
  assert(engine.SIZE === 24 && engine.SHEET_COLS === 20, 'The native 24px / 20-column contract drifted.');
  assert(JSON.stringify(engine.DIRS) === JSON.stringify(['down', 'left', 'right', 'up']), 'The direction order drifted.');
  assert(engine.ANIMS.reduce((total, animation) => total + animation.frames, 0) === 20, 'The animation column count drifted.');

  const entries = approvedRoster();
  const assets = [];
  const records = [];
  for (const entry of entries) {
    const assetPath = `enemies/${entry.sliceId}/${entry.familyId}/${entry.variantId}.png`;
    const rendered = renderApprovedSheet(entry);
    const repeated = renderApprovedSheet(entry);
    assert(rendered.sha256 === repeated.sha256, `${entry.familyId}/${entry.variantId} PNG rendering is not deterministic.`);
    assert(rendered.frameDigest === repeated.frameDigest, `${entry.familyId}/${entry.variantId} frame rendering is not deterministic.`);
    assets.push({ name: assetPath, data: rendered.data });
    records.push({
      path: assetPath,
      sliceId: entry.sliceId,
      family: entry.familyId,
      familyName: entry.familyName,
      variant: entry.variantId,
      variantName: entry.variantName,
      role: entry.role,
      publicIntegrated: entry.publicIntegrated,
      rendererKey: entry.rendererKey,
      width: rendered.width,
      height: rendered.height,
      frames: rendered.frames,
      opaquePixels: rendered.opaquePixels,
      bytes: rendered.data.length,
      sha256: rendered.sha256,
      frameDigest: rendered.frameDigest,
      approval: entry.approval,
    });
  }
  assets.sort((left, right) => stableCompare(left.name, right.name));
  records.sort((left, right) => stableCompare(left.path, right.path));

  const readme = buildReadme({ source, generatedOn: options.generatedOn, entries });
  const readmeData = encoder.encode(readme);
  const manifest = {
    id: PACKAGE_ID,
    name: '8-bit Sprite Assembler Approved Expansion Enemies',
    version: 1,
    status: 'approved-copy-package',
    generatedOn: options.generatedOn,
    source: {
      commit: source.commit,
      branch: source.branch,
      sourceTreeClean: source.dirtyPaths.length === 0,
      allowedToolingChanges: source.dirtyPaths,
      exporterSha256: sha256(exporterSource),
    },
    scope: {
      registry: 'ENEMY_EXPANSION_REGISTRY plus eight separately approved private gates',
      familyCount: EXPECTED_FAMILIES,
      variantCount: EXPECTED_VARIANTS,
      stableIntegratedVariantCount: EXPECTED_STABLE_VARIANTS,
      privateApprovedVariantCount: EXPECTED_PRIVATE_VARIANTS,
      pngCount: EXPECTED_VARIANTS,
      framesPerSheet: EXPECTED_FRAMES_PER_SHEET,
      totalFrames: EXPECTED_VARIANTS * EXPECTED_FRAMES_PER_SHEET,
      rawSourcePixelsOnly: true,
      publicRegistrationChanged: false,
      outlineRegistrationChanged: false,
      fixturesChanged: false,
      excluded: [
        'legacy enemy catalog',
        'incomplete or unapproved candidates',
        'rejected review versions',
        'bosses',
        'players',
        'effects and child assets',
        'floor shadows and projectiles',
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
      directionOrder: [...engine.DIRS],
      animations: engine.ANIMS.map((animation) => ({ ...animation })),
      transparentBackground: true,
      hardAlpha: true,
      shadow: false,
      outlineMode: 'none/raw-source',
    },
    roster: groupedRoster(entries),
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
  const manifestData = encoder.encode(`${JSON.stringify(manifest, null, 2)}\n`);
  const packageEntries = [
    { name: 'manifest.json', data: manifestData },
    { name: 'README.md', data: readmeData },
    ...assets,
  ].sort((left, right) => stableCompare(left.name, right.name));
  const archive = buildStoredZip(packageEntries, FIXED_ZIP_TIMESTAMP);
  const repeatedArchive = buildStoredZip(packageEntries, FIXED_ZIP_TIMESTAMP);
  assert(Buffer.compare(Buffer.from(archive), Buffer.from(repeatedArchive)) === 0, 'The ZIP archive is not deterministic.');

  return {
    source,
    manifest,
    packageEntries,
    archive,
    archiveSha256: sha256(archive),
  };
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
  for (const entry of entries) {
    const written = await readFile(path.join(outputDirectory, ...entry.name.split('/')));
    assert(sha256(written) === sha256(entry.data), `Written package entry drifted: ${entry.name}`);
  }
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  assert(path.resolve(options.outputDirectory) !== ROOT, 'The export directory cannot be the repository root.');
  if (!options.verifyOnly) {
    await Promise.all([
      assertAbsent(options.outputDirectory, 'Output directory'),
      assertAbsent(options.zipPath, 'ZIP archive'),
      assertAbsent(options.hashPath, 'ZIP hash sidecar'),
    ]);
  }

  const built = await buildPackage(options);
  if (options.verifyOnly) {
    console.log('Approved expansion enemy package source passes verification.');
  } else {
    await writeDirectory(options.outputDirectory, built.packageEntries);
    await mkdir(path.dirname(options.zipPath), { recursive: true });
    await writeFile(options.zipPath, built.archive);
    await writeFile(options.hashPath, `${built.archiveSha256}  ${path.basename(options.zipPath)}\n`, 'utf8');
    const writtenArchive = await readFile(options.zipPath);
    assert(sha256(writtenArchive) === built.archiveSha256, 'Written ZIP hash drifted.');
    console.log('Approved expansion enemy package created.');
  }
  console.log(`- source: ${built.source.commit}`);
  console.log(`- families: ${built.manifest.scope.familyCount}`);
  console.log(`- variants / PNGs: ${built.manifest.scope.variantCount}`);
  console.log(`- stable integrated: ${built.manifest.scope.stableIntegratedVariantCount}`);
  console.log(`- private approved: ${built.manifest.scope.privateApprovedVariantCount}`);
  console.log(`- frames: ${built.manifest.scope.totalFrames}`);
  console.log(`- ZIP bytes: ${built.archive.length}`);
  console.log(`- ZIP SHA-256: ${built.archiveSha256}`);
  if (!options.verifyOnly) {
    console.log(`- directory: ${options.outputDirectory}`);
    console.log(`- ZIP: ${options.zipPath}`);
    console.log(`- hash: ${options.hashPath}`);
  }
}

await main();
