import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { inflateSync } from 'node:zlib';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const runtimeAssetRoot = path.join(root, 'engine', 'assets', 'bosses');
const checkpointRoot = path.join(root, 'death-review', 'boss-48-drafts');
const catalogPath = path.join(root, 'engine', 'catalogs', 'boss-directions.js');
const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

function png(buffer, relativePath) {
  const signature = '89504e470d0a1a0a';
  check(buffer.length >= 33, `${relativePath}: PNG is too small`);
  if (buffer.length < 33) return null;
  check(buffer.subarray(0, 8).toString('hex') === signature, `${relativePath}: invalid PNG signature`);

  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  const bitDepth = buffer[24];
  const colorType = buffer[25];
  const interlace = buffer[28];
  check(bitDepth === 8 && colorType === 6 && interlace === 0, `${relativePath}: expected non-interlaced 8-bit RGBA PNG`);

  const chunks = [];
  for (let offset = 8; offset + 12 <= buffer.length;) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString('ascii');
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    if (type === 'IDAT') chunks.push(buffer.subarray(dataStart, dataEnd));
    offset = dataEnd + 4;
    if (type === 'IEND') break;
  }
  check(chunks.length > 0, `${relativePath}: missing PNG image data`);
  if (!chunks.length) return { width, height, pixels: Buffer.alloc(0) };

  const bytesPerPixel = 4;
  const stride = width * bytesPerPixel;
  const raw = inflateSync(Buffer.concat(chunks));
  check(raw.length === (stride + 1) * height, `${relativePath}: unexpected decompressed PNG length`);
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
    check(filter >= 0 && filter <= 4, `${relativePath}: unsupported PNG filter ${filter}`);
    for (let x = 0; x < stride; x++) {
      const encoded = raw[sourceStart + 1 + x];
      const target = y * stride + x;
      const left = x >= bytesPerPixel ? pixels[target - bytesPerPixel] : 0;
      const up = y > 0 ? pixels[target - stride] : 0;
      const upperLeft = y > 0 && x >= bytesPerPixel ? pixels[target - stride - bytesPerPixel] : 0;
      const predictor = filter === 1
        ? left
        : filter === 2
          ? up
          : filter === 3
            ? Math.floor((left + up) / 2)
            : filter === 4
              ? paeth(left, up, upperLeft)
              : 0;
      pixels[target] = (encoded + predictor) & 0xff;
    }
  }

  return { width, height, pixels };
}

function isDeepFrozen(value, seen = new Set()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return true;
  seen.add(value);
  return Object.isFrozen(value)
    && Object.values(value).every((entry) => isDeepFrozen(entry, seen));
}

const cacheBust = `boss-check=${Date.now()}`;
const engine = await import(`${pathToFileURL(path.join(root, 'sprite-engine.js')).href}?${cacheBust}`);
const internalCatalogs = await import(`${pathToFileURL(path.join(root, 'engine', 'catalogs.js')).href}?${cacheBust}`);
const catalogSource = await readFile(catalogPath, 'utf8');
const appSource = await readFile(path.join(root, 'app.js'), 'utf8');
const gamePackSource = await readFile(path.join(root, 'engine', 'game-pack.js'), 'utf8');
const generatorsSource = await readFile(path.join(root, 'engine', 'generators.js'), 'utf8');
const rendererSource = await readFile(path.join(root, 'engine', 'renderer.js'), 'utf8');
const sheetsSource = await readFile(path.join(root, 'engine', 'sheets.js'), 'utf8');
const entrySource = await readFile(path.join(root, 'index.html'), 'utf8');

check(engine.BOSS_DIRECTION_PILOTS === internalCatalogs.BOSS_DIRECTION_PILOTS, 'stable facade and internal facade must share the boss catalog identity');
check(engine.BOSS_DIRECTION_PILOT_PROFILE === internalCatalogs.BOSS_DIRECTION_PILOT_PROFILE, 'stable facade and internal facade must share the boss policy identity');
check(isDeepFrozen(engine.BOSS_DIRECTION_PILOT_PROFILE), 'boss direction pilot profile must be deeply immutable');
check(isDeepFrozen(engine.BOSS_DIRECTION_PILOTS), 'boss direction pilot catalog must be deeply immutable');
check(JSON.stringify(engine.BOSS_DIRECTIONS) === JSON.stringify(['down', 'left', 'right', 'up']), 'boss direction order must remain Down, Left, Right, Up');
check(engine.BOSS_DIRECTION_FRAME_SIZE === 48, 'boss pilot frames must remain 48x48');
check(engine.BOSS_DIRECTION_SHEET_WIDTH === 48 && engine.BOSS_DIRECTION_SHEET_HEIGHT === 192, 'boss pilot sheets must remain 48x192');
check(
  engine.BOSS_DIRECTION_PILOT_PROFILE.id === 'boss-directions-v1'
    && engine.BOSS_DIRECTION_PILOT_PROFILE.version === 1
    && engine.BOSS_DIRECTION_PILOT_PROFILE.exportScale === 1
    && engine.BOSS_DIRECTION_PILOT_PROFILE.animated === false
    && engine.BOSS_DIRECTION_PILOT_PROFILE.effects === false,
  'boss direction pilot policy identity must stay review-only, native 1x, static, and effects-off',
);
check(engine.BOSS_DIRECTION_PILOTS.length === 14, 'boss direction catalog must contain twelve approved pilots plus Rhino and Unicorn candidates');

const ids = engine.BOSS_DIRECTION_PILOTS.map(({ id }) => id);
check(new Set(ids).size === ids.length, 'boss direction pilot ids must be unique');
check(ids.every((id) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)), 'boss direction pilot ids must use portable lower-kebab-case');
check(
  engine.BOSS_DIRECTION_PILOTS.filter(({ status }) => status === 'approved').length === 12,
  'boss direction catalog must retain exactly twelve approved pilots',
);
check(
  JSON.stringify(engine.BOSS_DIRECTION_PILOTS.filter(({ status }) => status === 'candidate').map(({ id }) => id))
    === JSON.stringify(['furious-depraved-rhino', 'eclipse-unicorn-sovereign']),
  'Furious Depraved Rhino and Eclipse Unicorn Sovereign must remain explicit direction candidates',
);

const expectedAssetNames = [];
for (const boss of engine.BOSS_DIRECTION_PILOTS) {
  check(typeof boss.name === 'string' && boss.name.length > 0, `${boss.id}: missing display name`);
  check(typeof boss.note === 'string' && boss.note.length > 0, `${boss.id}: missing review note`);
  check(['approved', 'candidate'].includes(boss.status), `${boss.id}: invalid review status`);
  check(
    boss.sheet === `./engine/assets/bosses/${boss.id}-directions-v1.png`,
    `${boss.id}: sheet path escaped the immutable runtime asset convention`,
  );
  check(Object.keys(boss.frames).join(',') === engine.BOSS_DIRECTIONS.join(','), `${boss.id}: frame map direction order drifted`);

  const relativeSheet = boss.sheet.replace(/^\.\//, '');
  const runtimeSheetPath = path.join(root, ...relativeSheet.split('/'));
  const checkpointSheetPath = path.join(checkpointRoot, `${boss.id}-directions-v1.png`);
  const runtimeSheetBytes = await readFile(runtimeSheetPath);
  const checkpointSheetBytes = await readFile(checkpointSheetPath);
  check(runtimeSheetBytes.equals(checkpointSheetBytes), `${boss.id}: runtime sheet must be byte-identical to the review checkpoint`);
  const sheet = png(runtimeSheetBytes, relativeSheet);
  check(sheet?.width === 48 && sheet?.height === 192, `${boss.id}: runtime sheet must be 48x192`);
  expectedAssetNames.push(path.basename(runtimeSheetPath));

  const distinctFrames = new Set();
  for (const [directionIndex, direction] of engine.BOSS_DIRECTIONS.entries()) {
    const frameAsset = boss.frames[direction];
    check(
      frameAsset === `./engine/assets/bosses/${boss.id}-directions-v1-${direction}.png`,
      `${boss.id}/${direction}: frame path escaped the immutable runtime asset convention`,
    );
    check(!frameAsset.includes('\\') && !frameAsset.includes('..'), `${boss.id}/${direction}: frame path must stay portable and relative`);
    const relativeFrame = frameAsset.replace(/^\.\//, '');
    const runtimeFramePath = path.join(root, ...relativeFrame.split('/'));
    const checkpointFramePath = path.join(checkpointRoot, `${boss.id}-directions-v1-${direction}.png`);
    const runtimeFrameBytes = await readFile(runtimeFramePath);
    const checkpointFrameBytes = await readFile(checkpointFramePath);
    check(runtimeFrameBytes.equals(checkpointFrameBytes), `${boss.id}/${direction}: runtime frame must be byte-identical to the review checkpoint`);
    const frame = png(runtimeFrameBytes, relativeFrame);
    check(frame?.width === 48 && frame?.height === 48, `${boss.id}/${direction}: runtime frame must be 48x48`);
    distinctFrames.add(runtimeFrameBytes.toString('base64'));
    expectedAssetNames.push(path.basename(runtimeFramePath));

    let opaque = 0;
    let transparent = 0;
    for (let alphaOffset = 3; alphaOffset < frame.pixels.length; alphaOffset += 4) {
      const alpha = frame.pixels[alphaOffset];
      check(alpha === 0 || alpha === 255, `${boss.id}/${direction}: alpha must remain hard binary`);
      if (alpha === 255) opaque += 1;
      else transparent += 1;
    }
    check(opaque > 0 && transparent > 0, `${boss.id}/${direction}: frame must contain both sprite and transparent space`);

    const sheetRowStart = directionIndex * 48;
    for (let y = 0; y < 48; y++) {
      const sheetStart = ((sheetRowStart + y) * 48) * 4;
      const frameStart = (y * 48) * 4;
      check(
        sheet.pixels.subarray(sheetStart, sheetStart + 48 * 4)
          .equals(frame.pixels.subarray(frameStart, frameStart + 48 * 4)),
        `${boss.id}/${direction}: sheet cell must equal its direct frame asset`,
      );
    }
  }
  check(distinctFrames.size === 4, `${boss.id}: all four direction frames must remain visually distinct`);
}

const actualAssetNames = (await readdir(runtimeAssetRoot))
  .filter((name) => name.includes('-directions-v1'))
  .sort();
check(
  JSON.stringify(actualAssetNames) === JSON.stringify(expectedAssetNames.sort()),
  'runtime boss asset folder must contain exactly fourteen static direction sheets and 56 direction frames',
);

const catalogImports = [...catalogSource.matchAll(/from\s+['"]([^'"]+)['"]/g)];
check(catalogImports.length === 0, 'boss direction catalog must remain dependency-free');
check(
  !/\b(document|window|localStorage|sessionStorage|canvas|getContext|Math\.random|drawSprite|drawAssembledSprite)\b/.test(catalogSource),
  'boss direction catalog must not depend on DOM, storage, randomness, canvas, or renderer paths',
);
for (const [relativePath, source] of [
  ['engine/game-pack.js', gamePackSource],
  ['engine/generators.js', generatorsSource],
  ['engine/renderer.js', rendererSource],
  ['engine/sheets.js', sheetsSource],
]) {
  check(!/\bBOSS_DIRECTION|\bboss-directions\b/.test(source), `${relativePath}: boss pilots must not enter production generation, rendering, sheets, or game packs`);
}
check(!appSource.includes("{ mode: 'boss'"), 'Boss tab must not store boss as a persisted sprite mode');
check(appSource.includes('let workspaceMode = state.mode;'), 'Boss tab must use an ephemeral workspace mode');
check(appSource.includes('asset: boss.sheet'), 'Static Boss download must retain the approved native direction sheet asset');
check(appSource.includes('fetch(descriptor.asset)'), 'Boss download must use the selected immutable catalog asset');
check(appSource.includes("`${boss.id}-directions-v1@1x.png`"), 'Boss download filename must declare native 1x');
for (const id of ['boss-stage-image', 'boss-pilot-panel', 'boss-sheet-image', 'download-boss-sheet-button']) {
  check(entrySource.includes(`id="${id}"`), `index.html must expose the ${id} Boss Directions control`);
}
check(entrySource.includes('Direction pilot, not a fully animated boss.'), 'Boss tab must state that the pilots are not fully animated');

if (errors.length) {
  console.error(`Boss direction structural gate failed with ${errors.length} issue${errors.length === 1 ? '' : 's'}:`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Boss direction structural gate passed: 12 approved pilots plus Rhino and Unicorn candidates, 56 distinct 48x48 frames, 14 native 48x192 sheets, immutable facade, isolated dependencies.');
