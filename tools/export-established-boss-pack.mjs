import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildStoredZip } from '../zip.js';
import {
  BOSS_ANIMATION_DIRECTIONS,
  BOSS_ANIMATION_PILOTS,
  BOSS_ANIMATION_PROFILE,
  BOSS_ANIMATIONS,
} from '../engine/catalogs/boss-animations.js';
import {
  BOSS_DIRECTION_PILOTS,
  BOSS_DIRECTION_PILOT_PROFILE,
} from '../engine/catalogs/boss-directions.js';
import {
  publishGitHubRelease,
  requireGitHubReleaseReady,
  requirePublishableGitHead,
} from './pack-publisher.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ARTIFACT_ID = 'established-boss-pack-13-v1';
const PACK_NAME = 'Established Boss Pack - 13 Bosses';
const ESTABLISHED_BOSS_IDS = Object.freeze([
  'ancient-mirejaw',
  'bone-reliquary-king',
  'scorpion-empress',
  'cyclops-forge-titan',
  'pit-fiend-juggernaut',
  'goblin-war-crown',
  'lava-core-colossus',
  'abyssal-crown-kraken',
  'sun-crown-griffin',
  'royal-night-elf-prince',
  'living-pyre',
  'tide-man-the-blue',
  'dryad-of-nature',
]);
const EXCLUDED_BOSS_IDS = Object.freeze([
  'fierce-void-dragon',
  'dragon-rider-of-the-fallen',
  'ogre-brute-king',
  'mecha-deathbot',
  'flowered-jungle-tribe-beast-man',
  'chad-the-fantastic-guard',
]);
const EXPECTED_BOSS_COUNT = 13;
const EXPECTED_PNGS_PER_BOSS = 96;
const DEFAULT_OUTPUT = path.join(
  ROOT,
  'dist',
  '8-bit-sprite-assembler-13-bosses-no-dragon.zip',
);
const FIXED_ZIP_TIMESTAMP = new Date('2000-01-01T00:00:00Z');

function outputPathFromArgs(argv) {
  const outputIndex = argv.indexOf('--output');
  if (outputIndex === -1) return DEFAULT_OUTPUT;
  const value = argv[outputIndex + 1];
  if (!value) throw new Error('--output requires a file path.');
  return path.resolve(value);
}

function runtimePath(assetPath) {
  const relative = String(assetPath).replace(/^\.\//, '');
  return path.join(ROOT, ...relative.split('/'));
}

function sha256(data) {
  return createHash('sha256').update(data).digest('hex');
}

function animationAssets(pilot) {
  return [
    pilot.fullSheet,
    ...Object.values(pilot.directionSheets),
    ...Object.values(pilot.animationSheets),
    ...BOSS_ANIMATIONS.flatMap((animation) => (
      BOSS_ANIMATION_DIRECTIONS.flatMap(
        (direction) => pilot.frames[animation.id][direction],
      )
    )),
  ];
}

function directionAssets(pilot) {
  return [pilot.sheet, ...Object.values(pilot.frames)];
}

function bossManifest(animationPilot, directionPilot, assetRecords) {
  return {
    id: animationPilot.id,
    name: animationPilot.name,
    nativeScale: 1,
    hardAlpha: true,
    directionOrder: BOSS_ANIMATION_DIRECTIONS,
    directionPilot: {
      profile: BOSS_DIRECTION_PILOT_PROFILE,
      sheet: path.basename(directionPilot.sheet),
      frames: Object.fromEntries(
        Object.entries(directionPilot.frames).map(([direction, file]) => [
          direction,
          path.basename(file),
        ]),
      ),
    },
    animationPilot: {
      profile: BOSS_ANIMATION_PROFILE,
      fullSheet: path.basename(animationPilot.fullSheet),
      directionSheets: Object.fromEntries(
        Object.entries(animationPilot.directionSheets).map(([direction, file]) => [
          direction,
          path.basename(file),
        ]),
      ),
      animationSheets: Object.fromEntries(
        Object.entries(animationPilot.animationSheets).map(([animation, file]) => [
          animation,
          path.basename(file),
        ]),
      ),
      frames: Object.fromEntries(
        BOSS_ANIMATIONS.map((animation) => [
          animation.id,
          Object.fromEntries(
            BOSS_ANIMATION_DIRECTIONS.map((direction) => [
              direction,
              animationPilot.frames[animation.id][direction].map(
                (file) => path.basename(file),
              ),
            ]),
          ),
        ]),
      ),
    },
    pngCount: assetRecords.length,
    files: assetRecords.map((asset) => asset.name),
    hashes: {
      algorithm: 'sha256',
      files: Object.fromEntries(
        assetRecords.map((asset) => [asset.name, asset.sha256]),
      ),
    },
  };
}

async function main() {
  const gitState = await requirePublishableGitHead(ROOT);
  await requireGitHubReleaseReady({
    root: ROOT,
    remoteName: gitState.remoteName,
    repository: gitState.repository,
    artifactId: ARTIFACT_ID,
  });

  const outputPath = outputPathFromArgs(process.argv.slice(2));
  const animationById = new Map(
    BOSS_ANIMATION_PILOTS.map((pilot) => [pilot.id, pilot]),
  );
  const animationPilots = ESTABLISHED_BOSS_IDS.map((id) => animationById.get(id));
  const directionById = new Map(
    BOSS_DIRECTION_PILOTS.map((pilot) => [pilot.id, pilot]),
  );

  if (animationPilots.length !== EXPECTED_BOSS_COUNT) {
    throw new Error(
      `Expected ${EXPECTED_BOSS_COUNT} established bosses, found ${animationPilots.length}.`,
    );
  }
  if (animationPilots.some((pilot) => !pilot)) {
    throw new Error('The established 13-boss roster is missing a catalog entry.');
  }

  const entries = [];
  const roster = [];
  let pngCount = 0;

  for (const animationPilot of animationPilots) {
    const directionPilot = directionById.get(animationPilot.id);
    if (!directionPilot) {
      throw new Error(`Missing direction pilot for ${animationPilot.id}.`);
    }

    const assetPaths = [
      ...directionAssets(directionPilot),
      ...animationAssets(animationPilot),
    ];
    const uniqueAssetPaths = [...new Set(assetPaths)];
    if (uniqueAssetPaths.length !== EXPECTED_PNGS_PER_BOSS) {
      throw new Error(
        `${animationPilot.id} has ${uniqueAssetPaths.length} PNGs; `
        + `expected ${EXPECTED_PNGS_PER_BOSS}.`,
      );
    }

    const folder = `bosses/${animationPilot.id}`;
    const assetRecords = [];
    for (const assetPath of uniqueAssetPaths) {
      const name = path.basename(assetPath);
      const data = new Uint8Array(await readFile(runtimePath(assetPath)));
      entries.push({
        name: `${folder}/${name}`,
        data,
      });
      assetRecords.push({ name, sha256: sha256(data) });
    }

    const manifest = bossManifest(animationPilot, directionPilot, assetRecords);
    entries.push({
      name: `${folder}/manifest.json`,
      data: new TextEncoder().encode(`${JSON.stringify(manifest, null, 2)}\n`),
    });
    roster.push({
      id: animationPilot.id,
      name: animationPilot.name,
      folder,
      pngCount: uniqueAssetPaths.length,
    });
    pngCount += uniqueAssetPaths.length;
  }

  const readmeData = new TextEncoder().encode(
    '# Established Boss Pack - 13 Bosses\n\n'
    + 'This review-only native export contains the 13 established bosses. '
    + 'Newer review candidates are intentionally excluded.\n\n'
    + `Artifact id: \`${ARTIFACT_ID}\`\n\n`
    + `Source commit: \`${gitState.sourceCommit}\`\n\n`
    + 'Each `bosses/<id>/` folder contains 96 PNGs:\n\n'
    + '- one 960x192 full animation sheet;\n'
    + '- four 960x48 direction animation sheets;\n'
    + '- six scoped animation sheets;\n'
    + '- eighty individual 48x48 animation frames;\n'
    + '- one 48x192 static direction sheet;\n'
    + '- four individual 48x48 static direction frames;\n'
    + '- one per-boss JSON manifest.\n\n'
    + 'All PNGs are native 1x with hard alpha. The root manifest records '
    + 'the source commit, roster, animation contract, dimensions, and '
    + 'SHA-256 content hashes.\n',
  );
  entries.unshift({
    name: 'README.md',
    data: readmeData,
  });

  const packageManifest = {
    id: ARTIFACT_ID,
    name: PACK_NAME,
    version: 1,
    sourceCommit: gitState.sourceCommit,
    sourceRepository: gitState.repository,
    sourceRemoteBranches: gitState.containingBranches,
    bossCount: roster.length,
    pngCount,
    excludedBossIds: EXCLUDED_BOSS_IDS,
    nativeFrameSize: 48,
    fullAnimationSheet: {
      width: BOSS_ANIMATION_PROFILE.sheetWidth,
      height: BOSS_ANIMATION_PROFILE.sheetHeight,
      columns: BOSS_ANIMATION_PROFILE.sheetColumns,
      rows: BOSS_ANIMATION_DIRECTIONS.length,
    },
    directionOrder: BOSS_ANIMATION_DIRECTIONS,
    animations: BOSS_ANIMATIONS,
    hardAlpha: true,
    roster,
    hashes: {
      algorithm: 'sha256',
      files: Object.fromEntries(
        entries.map((entry) => [entry.name, sha256(entry.data)]),
      ),
    },
  };
  entries.unshift({
    name: 'manifest.json',
    data: new TextEncoder().encode(`${JSON.stringify(packageManifest, null, 2)}\n`),
  });

  const entryNames = entries.map((entry) => entry.name);
  if (entryNames.some((name) => EXCLUDED_BOSS_IDS.some((id) => name.includes(id)))) {
    throw new Error('An excluded review candidate has an asset entry in the package.');
  }
  if (pngCount !== EXPECTED_BOSS_COUNT * EXPECTED_PNGS_PER_BOSS) {
    throw new Error(`Expected 1248 PNGs, found ${pngCount}.`);
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  const archive = buildStoredZip(entries, FIXED_ZIP_TIMESTAMP);
  const archiveSha256 = sha256(archive);
  const publishManifest = {
    ...packageManifest,
    archive: {
      file: path.basename(outputPath),
      bytes: archive.length,
      sha256: archiveSha256,
    },
    githubRelease: {
      repository: gitState.repository,
      tag: ARTIFACT_ID,
      sourceCommit: gitState.sourceCommit,
    },
  };
  const publishManifestPath = `${outputPath}.manifest.json`;
  await writeFile(outputPath, archive);
  await writeFile(
    publishManifestPath,
    `${JSON.stringify(publishManifest, null, 2)}\n`,
  );

  const releaseNotes = [
    `Artifact id: ${ARTIFACT_ID}`,
    `Source commit: ${gitState.sourceCommit}`,
    `SHA-256: ${archiveSha256}`,
    `File: ${path.basename(outputPath)}`,
    '',
    'Generated only after the clean-tree and pushed-HEAD publish gate passed.',
  ].join('\n');
  let releaseUrl;
  try {
    releaseUrl = await publishGitHubRelease({
      root: ROOT,
      repository: gitState.repository,
      artifactId: ARTIFACT_ID,
      sourceCommit: gitState.sourceCommit,
      title: PACK_NAME,
      notes: releaseNotes,
      assets: [outputPath, publishManifestPath],
    });
  } catch (error) {
    throw new Error(
      `Pack was built locally, but the GitHub release upload failed: ${error.message}\n`
      + `Unpublished local candidate: ${outputPath}`,
    );
  }

  console.log(`Created ${outputPath}`);
  console.log(
    `${roster.length} bosses, ${pngCount} PNGs, ${entries.length} ZIP entries, `
    + `${archive.length} bytes.`,
  );
  console.log(`SHA-256: ${archiveSha256}`);
  console.log(`Published ${ARTIFACT_ID} from ${gitState.sourceCommit} at ${releaseUrl}`);
}

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
