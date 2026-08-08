import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { inflateSync } from 'node:zlib';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const runtimeAssetRoot = path.join(root, 'engine', 'assets', 'bosses');
const checkpointRoot = path.join(root, 'death-review', 'boss-48-drafts');
const catalogPath = path.join(root, 'engine', 'catalogs', 'boss-animations.js');
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

function cellEquals(image, cellX, cellY, frame, label) {
  if (!image || !frame) return;
  for (let y = 0; y < 48; y++) {
    const imageStart = (((cellY * 48) + y) * image.width + (cellX * 48)) * 4;
    const frameStart = y * 48 * 4;
    check(
      image.pixels.subarray(imageStart, imageStart + 48 * 4)
        .equals(frame.pixels.subarray(frameStart, frameStart + 48 * 4)),
      `${label}: sheet cell differs from its direct frame`,
    );
  }
}

function silhouetteHorizontallyMirrored(left, right) {
  if (!left || !right || left.width !== right.width || left.height !== right.height) return false;
  for (let y = 0; y < left.height; y++) {
    for (let x = 0; x < left.width; x++) {
      const leftOffset = (y * left.width + x) * 4;
      const rightOffset = (y * right.width + (right.width - x - 1)) * 4;
      if (left.pixels[leftOffset + 3] !== right.pixels[rightOffset + 3]) return false;
    }
  }
  return true;
}

function silhouetteSignature(image) {
  if (!image) return '';
  const alpha = Buffer.alloc(image.width * image.height);
  for (let pixel = 0; pixel < image.width * image.height; pixel++) {
    alpha[pixel] = image.pixels[(pixel * 4) + 3];
  }
  return alpha.toString('base64');
}

const cacheBust = `boss-animation-check=${Date.now()}`;
const engine = await import(`${pathToFileURL(path.join(root, 'sprite-engine.js')).href}?${cacheBust}`);
const internalCatalogs = await import(`${pathToFileURL(path.join(root, 'engine', 'catalogs.js')).href}?${cacheBust}`);
const catalogSource = await readFile(catalogPath, 'utf8');
const appSource = await readFile(path.join(root, 'app.js'), 'utf8');
const entrySource = await readFile(path.join(root, 'index.html'), 'utf8');
const generatorSources = new Map(await Promise.all([
  ['ancient-mirejaw', 'generate-mirejaw-animation-v1.py', 'generate_mirejaw_directions_v1'],
  ['bone-reliquary-king', 'generate-bone-king-animation-v1.py', 'generate_bone_king_directions_v1'],
  ['scorpion-empress', 'generate-scorpion-empress-animation-v1.py', 'generate_scorpion_empress_directions_v1'],
  ['cyclops-forge-titan', 'generate-cyclops-forge-titan-animation-v1.py', 'generate_cyclops_forge_titan_directions_v1'],
  ['pit-fiend-juggernaut', 'generate-pit-fiend-juggernaut-animation-v1.py', 'generate_pit_fiend_juggernaut_directions_v1'],
  ['goblin-war-crown', 'generate-goblin-war-crown-animation-v1.py', 'generate_goblin_war_crown_directions_v1'],
  ['cruel-catgirl-templar-of-the-brutes', 'generate-cruel-catgirl-templar-animation-v1.py', 'generate_cruel_catgirl_templar_directions_v1'],
  ['divine-armored-templar-astro-knight', 'generate-divine-armored-templar-astro-knight-animation-v1.py', 'generate_divine_armored_templar_astro_knight_directions_v1'],
  ['furious-depraved-rhino', 'generate-furious-depraved-rhino-animation-v1.py', 'generate_furious_depraved_rhino_directions_v1'],
  ['gunslinger-boar-rider', 'generate-gunslinger-boar-rider-animation-v1.py', 'generate_gunslinger_boar_rider_directions_v1'],
].map(async ([id, filename, directionModule]) => [
  id,
  {
    directionModule,
    source: await readFile(path.join(root, 'tools', filename), 'utf8'),
  },
])));
const boundarySources = await Promise.all([
  'engine/game-pack.js',
  'engine/generators.js',
  'engine/renderer.js',
  'engine/sheets.js',
  'engine/production-rolls.js',
  'engine/production-rerolls.js',
].map(async (relativePath) => [
  relativePath,
  await readFile(path.join(root, relativePath), 'utf8'),
]));

check(engine.BOSS_ANIMATION_PROFILE === internalCatalogs.BOSS_ANIMATION_PROFILE, 'stable facade and internal facade must share the boss animation profile identity');
check(engine.BOSS_ANIMATION_PILOTS === internalCatalogs.BOSS_ANIMATION_PILOTS, 'stable facade and internal facade must share the boss animation catalog identity');
check(isDeepFrozen(engine.BOSS_ANIMATION_PROFILE), 'boss animation profile must be deeply immutable');
check(isDeepFrozen(engine.BOSS_ANIMATION_PILOTS), 'boss animation catalog must be deeply immutable');
check(isDeepFrozen(engine.BOSS_ANIMATIONS), 'boss animation definitions must be deeply immutable');
check(JSON.stringify(engine.BOSS_ANIMATION_DIRECTIONS) === JSON.stringify(['down', 'left', 'right', 'up']), 'boss animation direction order must remain Down, Left, Right, Up');
check(JSON.stringify(engine.BOSS_ANIMATIONS.map(({ id, frames }) => [id, frames])) === JSON.stringify([
  ['idle', 2],
  ['walk', 4],
  ['attack', 4],
  ['cast', 4],
  ['hurt', 2],
  ['death', 4],
]), 'boss animation frame contract must remain 2/4/4/4/2/4 across the six named animations');
check(engine.BOSS_ANIMATION_FRAME_SIZE === 48, 'boss animation frame size must remain 48');
check(engine.BOSS_ANIMATION_SHEET_COLUMNS === 20, 'boss animation sheet must remain 20 columns');
check(engine.BOSS_ANIMATION_SHEET_WIDTH === 960 && engine.BOSS_ANIMATION_SHEET_HEIGHT === 192, 'boss full animation sheet must remain 960x192');
check(
  engine.BOSS_ANIMATION_PROFILE.id === 'boss-animation-v1'
    && engine.BOSS_ANIMATION_PROFILE.version === 1
    && engine.BOSS_ANIMATION_PROFILE.exportScale === 1
    && engine.BOSS_ANIMATION_PROFILE.animated === true
    && engine.BOSS_ANIMATION_PROFILE.effects === false,
  'boss animation profile must stay native 1x, animated, and effects-off',
);
check(engine.BOSS_ANIMATION_PILOTS.length === 10, 'exactly ten full boss animation pilots may be integrated in this slice');
check(
  JSON.stringify(engine.BOSS_ANIMATION_PILOTS.map(({ id }) => id)) === JSON.stringify([
    'ancient-mirejaw',
    'bone-reliquary-king',
    'scorpion-empress',
    'cyclops-forge-titan',
    'pit-fiend-juggernaut',
    'goblin-war-crown',
    'cruel-catgirl-templar-of-the-brutes',
    'divine-armored-templar-astro-knight',
    'furious-depraved-rhino',
    'gunslinger-boar-rider',
  ]),
  'full boss animation pilots must retain the eight existing entries and append Furious Depraved Rhino then Gunslinger Boar Rider',
);
check(
  engine.BOSS_DIRECTION_PILOTS.filter(({ id }) => !engine.BOSS_ANIMATION_PILOTS.some((pilot) => pilot.id === id)).length === 4,
  'the three approved fallbacks plus the Unicorn candidate must remain static-only',
);
check(
  engine.BOSS_ANIMATION_PILOTS.every(({ reviewStatus }) => ['reviewed', 'candidate'].includes(reviewStatus)),
  'boss animation pilots must carry a review status',
);
check(
  JSON.stringify(engine.BOSS_ANIMATION_PILOTS.filter(({ reviewStatus }) => reviewStatus === 'candidate').map(({ id }) => id))
    === JSON.stringify(['goblin-war-crown', 'furious-depraved-rhino', 'gunslinger-boar-rider']),
  'Goblin War-Crown, Furious Depraved Rhino, and Gunslinger Boar Rider must remain explicit animation candidates',
);

const expectedAssetNames = [];
for (const pilot of engine.BOSS_ANIMATION_PILOTS) {
  const fullRelative = pilot.fullSheet.replace(/^\.\//, '');
  const fullBytes = await readFile(path.join(root, ...fullRelative.split('/')));
  const fullCheckpoint = await readFile(path.join(checkpointRoot, path.basename(fullRelative)));
  check(fullBytes.equals(fullCheckpoint), `${pilot.id}: runtime full animation sheet must be byte-identical to the review checkpoint`);
  const fullSheet = png(fullBytes, fullRelative);
  check(fullSheet?.width === 960 && fullSheet?.height === 192, `${pilot.id}: full animation sheet must be 960x192`);
  expectedAssetNames.push(path.basename(fullRelative));

  const directionSheets = new Map();
  for (const [direction, asset] of Object.entries(pilot.directionSheets)) {
    const relative = asset.replace(/^\.\//, '');
    const bytes = await readFile(path.join(root, ...relative.split('/')));
    const checkpoint = await readFile(path.join(checkpointRoot, path.basename(relative)));
    check(bytes.equals(checkpoint), `${pilot.id}/${direction}: runtime direction animation sheet must match the review checkpoint`);
    const image = png(bytes, relative);
    check(image?.width === 960 && image?.height === 48, `${pilot.id}/${direction}: direction animation sheet must be 960x48`);
    directionSheets.set(direction, image);
    expectedAssetNames.push(path.basename(relative));
  }

  const animationSheets = new Map();
  for (const animation of engine.BOSS_ANIMATIONS) {
    const asset = pilot.animationSheets[animation.id];
    const relative = asset.replace(/^\.\//, '');
    const bytes = await readFile(path.join(root, ...relative.split('/')));
    const checkpoint = await readFile(path.join(checkpointRoot, path.basename(relative)));
    check(bytes.equals(checkpoint), `${pilot.id}/${animation.id}: runtime animation sheet must match the review checkpoint`);
    const image = png(bytes, relative);
    check(
      image?.width === animation.frames * 48 && image?.height === 192,
      `${pilot.id}/${animation.id}: animation sheet dimensions must match ${animation.frames} columns by four rows`,
    );
    animationSheets.set(animation.id, image);
    expectedAssetNames.push(path.basename(relative));
  }

  for (const animation of engine.BOSS_ANIMATIONS) {
    const animationSheet = animationSheets.get(animation.id);
    for (const [directionIndex, direction] of engine.BOSS_ANIMATION_DIRECTIONS.entries()) {
      const distinctFrames = new Set();
      const distinctSilhouettes = new Set();
      for (let frameIndex = 0; frameIndex < animation.frames; frameIndex++) {
        const label = `${pilot.id}/${animation.id}/${direction}/${frameIndex + 1}`;
        const asset = pilot.frames[animation.id][direction][frameIndex];
        const expected = `./engine/assets/bosses/${pilot.id}-animation-v1-${animation.id}-${direction}-${frameIndex + 1}.png`;
        check(asset === expected, `${label}: frame path drifted`);
        check(!asset.includes('\\') && !asset.includes('..'), `${label}: frame path must remain portable`);
        const relative = asset.replace(/^\.\//, '');
        const bytes = await readFile(path.join(root, ...relative.split('/')));
        const checkpoint = await readFile(path.join(checkpointRoot, path.basename(relative)));
        check(bytes.equals(checkpoint), `${label}: runtime frame must match the review checkpoint`);
        const frame = png(bytes, relative);
        check(frame?.width === 48 && frame?.height === 48, `${label}: frame must be 48x48`);
        let opaque = 0;
        let minX = 48;
        let minY = 48;
        let maxX = -1;
        let maxY = -1;
        for (let pixel = 0; pixel < frame.pixels.length; pixel += 4) {
          const alpha = frame.pixels[pixel + 3];
          check(alpha === 0 || alpha === 255, `${label}: alpha must remain hard binary`);
          if (alpha === 255) {
            opaque += 1;
            const coordinate = pixel / 4;
            const x = coordinate % 48;
            const y = Math.floor(coordinate / 48);
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
        check(opaque > 0, `${label}: frame must not be empty`);
        check(minX >= 2 && minY >= 2 && maxX <= 45 && maxY <= 45, `${label}: frame must keep a two-pixel safety border`);
        const globalColumn = animation.column + frameIndex;
        cellEquals(fullSheet, globalColumn, directionIndex, frame, `${label} full`);
        cellEquals(animationSheet, frameIndex, directionIndex, frame, `${label} animation`);
        cellEquals(directionSheets.get(direction), globalColumn, 0, frame, `${label} direction`);
        distinctFrames.add(frame.pixels.toString('base64'));
        distinctSilhouettes.add(silhouetteSignature(frame));
        expectedAssetNames.push(path.basename(relative));
      }
      check(distinctFrames.size === animation.frames, `${pilot.id}/${animation.id}/${direction}: every authored frame must remain visually distinct`);
      if (animation.id === 'idle') {
        check(
          distinctSilhouettes.size === animation.frames,
          `${pilot.id}/${direction}: Idle must use authored silhouette motion rather than a color-only pulse`,
        );
      }
      if (['scorpion-empress', 'cyclops-forge-titan', 'pit-fiend-juggernaut', 'goblin-war-crown', 'cruel-catgirl-templar-of-the-brutes', 'divine-armored-templar-astro-knight', 'furious-depraved-rhino', 'gunslinger-boar-rider'].includes(pilot.id)) {
        check(
          distinctSilhouettes.size === animation.frames,
          `${pilot.id}/${animation.id}/${direction}: every frame must change the action silhouette`,
        );
      }

      if (direction === 'left') {
        const leftAssets = pilot.frames[animation.id].left;
        const rightAssets = pilot.frames[animation.id].right;
        for (let frameIndex = 0; frameIndex < animation.frames; frameIndex++) {
          const leftRelative = leftAssets[frameIndex].replace(/^\.\//, '');
          const rightRelative = rightAssets[frameIndex].replace(/^\.\//, '');
          const left = png(await readFile(path.join(root, ...leftRelative.split('/'))), leftRelative);
          const right = png(await readFile(path.join(root, ...rightRelative.split('/'))), rightRelative);
          check(silhouetteHorizontallyMirrored(left, right), `${pilot.id}/${animation.id}/${frameIndex + 1}: right silhouette must be an exact horizontal mirror of left`);
        }
      }
    }
  }

  for (const direction of engine.BOSS_ANIMATION_DIRECTIONS) {
    const idleAsset = pilot.frames.idle[direction][0].replace(/^\.\//, '');
    const staticAsset = `engine/assets/bosses/${pilot.id}-directions-v1-${direction}.png`;
    const idle = png(await readFile(path.join(root, ...idleAsset.split('/'))), idleAsset);
    const approved = png(await readFile(path.join(root, ...staticAsset.split('/'))), staticAsset);
    check(idle?.pixels.equals(approved?.pixels), `${pilot.id}/${direction}: Idle frame 1 must exactly preserve the current static direction control`);
  }
}

const animatedPrefixes = engine.BOSS_ANIMATION_PILOTS.map(({ id }) => `${id}-animation-v1`);
const actualAssetNames = (await readdir(runtimeAssetRoot))
  .filter((name) => animatedPrefixes.some((prefix) => name.startsWith(prefix)) && name.endsWith('.png'))
  .sort();
check(
  JSON.stringify(actualAssetNames) === JSON.stringify(expectedAssetNames.sort()),
  'runtime boss folder must contain exactly 80 frames and 11 native sheets for each integrated animation pilot',
);

const catalogImports = [...catalogSource.matchAll(/from\s+['"]([^'"]+)['"]/g)];
check(catalogImports.length === 0, 'boss animation catalog must remain dependency-free');
check(
  !/\b(document|window|localStorage|sessionStorage|canvas|getContext|Math\.random|drawSprite|drawAssembledSprite)\b/.test(catalogSource),
  'boss animation catalog must not depend on DOM, storage, randomness, canvas, or renderer paths',
);
for (const [relativePath, source] of boundarySources) {
  check(!/\bBOSS_ANIMATION|\bboss-animations\b/.test(source), `${relativePath}: boss animation pilots must not enter production generation, rendering, sheets, rolls, or game packs`);
}
for (const [id, generator] of generatorSources) {
  check(generator.source.includes(generator.directionModule), `${id}: animation generator must derive from its current direction sources`);
  check(generator.source.includes('apply_engine_treatment.mjs'), `${id}: animation generator must retain the Form + Complete B treatment path`);
}
check(!appSource.includes("{ mode: 'boss'"), 'Boss animation workspace must remain outside persisted sprite mode');
check(appSource.includes("let bossAnimation = E.BOSS_ANIMATIONS[0].id;"), 'Boss animation selection must remain ephemeral editor state');
check(appSource.includes("workspaceMode === 'boss' ? bossFrame : state.frame"), 'Shared frame stepping must use the ephemeral Boss frame in Boss mode');
check(appSource.includes('fetch(descriptor.asset)'), 'Boss animation download must use an immutable catalog asset');
check(appSource.includes('descriptor.filename'), 'Boss animation download must use the native scoped filename');
for (const id of [
  'boss-pilot-kicker',
  'boss-pilot-warning',
  'boss-export-scope',
  'boss-directions-title',
  'boss-sheet-title',
  'boss-sheet-contract',
  'boss-download-size',
]) {
  check(entrySource.includes(`id="${id}"`), `index.html must expose the ${id} boss animation control`);
}
check(entrySource.includes('value="full"'), 'Boss animation export scope must include the full native sheet');
check(entrySource.includes('value="animation"'), 'Boss animation export scope must include the current animation');
check(entrySource.includes('value="direction"'), 'Boss animation export scope must include the current direction');

if (errors.length) {
  console.error(`Boss animation structural gate failed with ${errors.length} issue${errors.length === 1 ? '' : 's'}:`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Boss animation structural gate passed: ten pilots including Furious Depraved Rhino and Gunslinger Boar Rider, 800 distinct 48x48 frames, 110 native 1x sheets, exact control frames, immutable facade, isolated dependencies.');
