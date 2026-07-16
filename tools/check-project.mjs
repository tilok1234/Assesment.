import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const assetRoot = path.join(root, 'asset-pack');
const manifestPath = path.join(assetRoot, 'manifest.json');
const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

async function listFiles(directory) {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await listFiles(fullPath));
    if (entry.isFile()) output.push(fullPath);
  }
  return output;
}

function asPosix(relativePath) {
  return relativePath.split(path.sep).join('/');
}

function pngDimensions(buffer, relativePath) {
  const signature = '89504e470d0a1a0a';
  check(buffer.length >= 24, `${relativePath}: file is too small to be a PNG`);
  if (buffer.length < 24) return null;
  check(buffer.subarray(0, 8).toString('hex') === signature, `${relativePath}: invalid PNG signature`);
  check(buffer.subarray(12, 16).toString('ascii') === 'IHDR', `${relativePath}: missing PNG IHDR header`);
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function checkSyntax(relativePath) {
  const result = spawnSync(process.execPath, ['--check', path.join(root, relativePath)], {
    encoding: 'utf8',
  });
  check(result.status === 0, `${relativePath}: JavaScript syntax check failed\n${result.stderr.trim()}`);
}

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const engine = await import(`${pathToFileURL(path.join(root, 'sprite-engine.js')).href}?check=${Date.now()}`);

checkSyntax('sprite-engine.js');
checkSyntax('app.js');
checkSyntax('engine/catalogs.js');
checkSyntax('engine/catalogs/animation.js');
checkSyntax('engine/catalogs/enemies.js');
checkSyntax('engine/catalogs/palettes.js');
checkSyntax('engine/catalogs/player-options.js');
checkSyntax('engine/generators.js');
checkSyntax('engine/renderer.js');
checkSyntax('engine/sheets.js');
checkSyntax('tools/build.mjs');
checkSyntax('tools/dev-server.mjs');

const entryCandidates = ['index.html', 'Sprite Assembler.dc.html'];
let entryFile = null;
let entrySource = '';
for (const candidate of entryCandidates) {
  try {
    entrySource = await readFile(path.join(root, candidate), 'utf8');
    entryFile = candidate;
    break;
  } catch {}
}
check(Boolean(entryFile), `Missing application entry point (${entryCandidates.join(' or ')})`);
check(entryFile === 'index.html', 'The app-ready frontend must use index.html as its entry point');
check(entrySource.includes('type="module" src="./app.js"'), 'index.html must load app.js as a module');
check(entrySource.includes('href="./styles.css"'), 'index.html must load styles.css');
for (const controlId of [
  'undo-button', 'redo-button', 'preset-name', 'preset-select',
  'save-preset-button', 'load-preset-button', 'delete-preset-button',
  'character-name', 'export-name', 'export-filename-preview',
  'palette-editor', 'palette-summary', 'reset-palette-button', 'palette-name',
  'palette-select', 'save-palette-button', 'load-palette-button', 'delete-palette-button',
  'sheet-title', 'sheet-contract', 'export-scope',
  'previous-frame-button', 'play-pause-button', 'next-frame-button',
  'frame-buttons', 'frame-readout', 'playback-speed',
  'reset-button', 'duplicate-button', 'compare-button', 'compare-dialog',
  'saved-copy-canvas', 'current-copy-canvas', 'restore-copy-button',
  'keep-current-button', 'remove-copy-button', 'replace-copy-button',
]) {
  check(entrySource.includes(`id="${controlId}"`), `index.html must expose the ${controlId} editor control`);
}

const runtimeSources = {
  'index.html': entrySource,
  'app.js': await readFile(path.join(root, 'app.js'), 'utf8'),
  'sprite-engine.js': await readFile(path.join(root, 'sprite-engine.js'), 'utf8'),
  'engine/catalogs.js': await readFile(path.join(root, 'engine', 'catalogs.js'), 'utf8'),
  'engine/catalogs/animation.js': await readFile(path.join(root, 'engine', 'catalogs', 'animation.js'), 'utf8'),
  'engine/catalogs/enemies.js': await readFile(path.join(root, 'engine', 'catalogs', 'enemies.js'), 'utf8'),
  'engine/catalogs/palettes.js': await readFile(path.join(root, 'engine', 'catalogs', 'palettes.js'), 'utf8'),
  'engine/catalogs/player-options.js': await readFile(path.join(root, 'engine', 'catalogs', 'player-options.js'), 'utf8'),
  'engine/generators.js': await readFile(path.join(root, 'engine', 'generators.js'), 'utf8'),
  'engine/renderer.js': await readFile(path.join(root, 'engine', 'renderer.js'), 'utf8'),
  'engine/sheets.js': await readFile(path.join(root, 'engine', 'sheets.js'), 'utf8'),
};
for (const [relativePath, source] of Object.entries(runtimeSources)) {
  check(!/\bnew\s+Function\s*\(/.test(source), `${relativePath}: runtime code generation with new Function is not allowed`);
  check(!/\beval\s*\(/.test(source), `${relativePath}: runtime code generation with eval is not allowed`);
}

const expectedEngineExports = [
  'ANIMS', 'DIRS', 'DIR_LABELS', 'ENEMIES', 'HAIR_COLORS', 'HAIR_STYLES', 'HEADGEAR',
  'OUTFITS', 'OUTFIT_COLORS', 'SHEET_COLS', 'SHIELDS', 'SIZE', 'SKINS', 'WEAPONS',
  'buildAnimationSheet', 'buildDirectionSheet', 'buildSheet', 'describe', 'drawSprite',
  'randomEnemy', 'randomPlayer', 'thumbURL',
].sort();
check(
  JSON.stringify(Object.keys(engine).sort()) === JSON.stringify(expectedEngineExports),
  'sprite-engine.js public exports changed; consumers must keep using the stable facade API',
);
check(runtimeSources['sprite-engine.js'].split(/\r?\n/).length < 40, 'sprite-engine.js must remain a small public facade');
check(runtimeSources['engine/catalogs.js'].split(/\r?\n/).length < 40, 'engine/catalogs.js must remain a small internal facade');
check(runtimeSources['app.js'].includes("from './sprite-engine.js'"), 'app.js must consume the public engine facade');
check(!runtimeSources['app.js'].includes("from './engine/"), 'app.js must not depend on internal engine modules');
check(runtimeSources['app.js'].includes("PRESET_VERSION = 3"), 'app.js must keep presets under the current versioned schema');
check(runtimeSources['app.js'].includes('![1, 2, PRESET_VERSION].includes(saved.version)'), 'app.js must migrate version 1 and 2 preset libraries');
check(runtimeSources['app.js'].includes('PALETTE_VERSION = 1'), 'app.js must keep reusable palettes under an explicit versioned schema');
check(runtimeSources['app.js'].includes('HISTORY_LIMIT = 100'), 'app.js must keep bounded sprite-edit history');
check(runtimeSources['app.js'].includes("['mode', 'player', 'enemy', 'characterName', 'exportName']"), 'app.js history must remain scoped to the editable sprite document');
check(runtimeSources['app.js'].includes("key === 'z'"), 'app.js must expose the undo keyboard shortcut');
check(runtimeSources['app.js'].includes("key === 'y'"), 'app.js must expose the redo keyboard shortcut');
check(runtimeSources['app.js'].includes("className = 'category-randomize'"), 'app.js must expose per-category randomize controls');
check(runtimeSources['app.js'].includes('function randomDifferent('), 'app.js category randomization must guarantee a different selection');
check(runtimeSources['app.js'].includes('function sanitizeFilenameBase('), 'app.js must sanitize custom export filenames');
check(runtimeSources['app.js'].includes('triggerDownload(canvas, exportFilename())'), 'PNG downloads must use the resolved custom export filename');
check(runtimeSources['app.js'].includes('function buildExportCanvas('), 'app.js must route full and scoped exports through one resolver');
check(runtimeSources['app.js'].includes("EXPORT_SCOPES = ['full', 'animation', 'direction']"), 'app.js must support full, animation, and direction export scopes');
check(runtimeSources['app.js'].includes('PLAYBACK_SPEEDS = [0.5, 1, 2]'), 'app.js must expose the supported preview playback speeds');
check(runtimeSources['app.js'].includes('function inspectFrame('), 'app.js must expose deterministic individual frame inspection');
check(runtimeSources['app.js'].includes("event.key === '['") && runtimeSources['app.js'].includes("event.key === ']'"), 'app.js must expose previous and next frame keyboard shortcuts');
check((entrySource.match(/<option value="(?:0\.5|1|2)"/g) || []).length === 3, 'index.html must expose all three playback-speed choices');
check(runtimeSources['app.js'].includes('function resetCurrentDocument('), 'app.js must expose an undoable current-document reset');
check(runtimeSources['app.js'].includes('function duplicateCurrentForComparison('), 'app.js must expose saved comparison copies');
check(runtimeSources['app.js'].includes('function restoreComparisonCopy('), 'app.js must restore a comparison copy through editor history');
check(runtimeSources['app.js'].includes('.showModal()'), 'app.js must open the side-by-side comparison as an accessible dialog');
check((entrySource.match(/data-palette-color=/g) || []).length === 6, 'index.html must expose all six editable player palette tones');
check(runtimeSources['engine/renderer.js'].includes('palettePair(spec.palette?.skin'), 'the renderer must consume safe player palette overrides');

const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
check(packageJson.scripts?.build === 'node tools/build.mjs', 'package.json must expose the production build command');
check(packageJson.scripts?.['tauri:build'] === 'tauri build --no-bundle', 'package.json must expose the proof Windows build command');
check(packageJson.devDependencies?.['@tauri-apps/cli'] === '^2.11.0', 'Tauri CLI must stay pinned to the approved 2.11 line');

const tauriConfig = JSON.parse(await readFile(path.join(root, 'src-tauri', 'tauri.conf.json'), 'utf8'));
const tauriCsp = tauriConfig.app?.security?.csp || {};
check(tauriConfig.build?.frontendDist === '../dist', 'Tauri must package the production dist directory');
check(tauriConfig.build?.beforeBuildCommand === 'npm run build', 'Tauri must build the frontend before native compilation');
check(tauriCsp['script-src'] === "'self'", 'Tauri script CSP must only allow bundled application scripts');
check(!Object.values(tauriCsp).join(' ').includes('unsafe-eval'), 'Tauri CSP must not allow unsafe-eval');
try {
  await readFile(path.join(root, 'src-tauri', 'icons', 'icon.ico'));
} catch {
  errors.push('src-tauri/icons/icon.ico: Windows application icon is missing');
}

const expectedWidth = manifest.format.sheetSize.width;
const expectedHeight = manifest.format.sheetSize.height;
const enemyRefs = manifest.enemies.flatMap((family) => family.variants.map((variant) => variant.file));
const playerRefs = (manifest.players || []).map((player) => player.file);
const referenced = [...enemyRefs, ...playerRefs];
const referencedSet = new Set(referenced);

check(referencedSet.size === referenced.length, 'Manifest contains duplicate PNG references');
check(engine.SIZE === manifest.format.frameSize, `Engine frame size ${engine.SIZE} does not match manifest ${manifest.format.frameSize}`);
check(engine.SHEET_COLS === manifest.format.grid.columns, `Engine sheet columns ${engine.SHEET_COLS} do not match manifest ${manifest.format.grid.columns}`);
check(JSON.stringify(engine.DIRS) === JSON.stringify(manifest.format.rows), 'Engine directions do not match manifest row order');

const manifestAnims = manifest.format.animations.map(({ id, frames, frameMs }) => ({ id, frames, ms: frameMs }));
const engineAnims = engine.ANIMS.map(({ id, frames, ms }) => ({ id, frames, ms }));
check(JSON.stringify(engineAnims) === JSON.stringify(manifestAnims), 'Engine animations do not match manifest animation definitions');

const manifestFamilies = new Map(manifest.enemies.map((family) => [family.family, family]));
const engineFamilies = new Map(engine.ENEMIES.map((family) => [family.id, family]));
check(engineFamilies.size === manifestFamilies.size, `Engine has ${engineFamilies.size} enemy families but manifest has ${manifestFamilies.size}`);

for (const [familyId, manifestFamily] of manifestFamilies) {
  const engineFamily = engineFamilies.get(familyId);
  check(Boolean(engineFamily), `Manifest family ${familyId} is missing from the engine`);
  if (!engineFamily) continue;
  const engineVariantIds = engineFamily.variants.map((variant) => variant.id);
  const manifestVariantIds = manifestFamily.variants.map((variant) => variant.id);
  check(
    JSON.stringify(engineVariantIds) === JSON.stringify(manifestVariantIds),
    `${familyId}: engine variants do not match manifest variants`,
  );
}

const actualPngs = (await listFiles(assetRoot))
  .filter((file) => path.extname(file).toLowerCase() === '.png')
  .map((file) => asPosix(path.relative(assetRoot, file)))
  .sort();

for (const relativePath of referenced) {
  let buffer;
  try {
    buffer = await readFile(path.join(assetRoot, relativePath));
  } catch {
    errors.push(`${relativePath}: referenced by the manifest but missing from disk`);
    continue;
  }
  const dimensions = pngDimensions(buffer, relativePath);
  if (!dimensions) continue;
  check(
    dimensions.width === expectedWidth && dimensions.height === expectedHeight,
    `${relativePath}: expected ${expectedWidth}x${expectedHeight}, found ${dimensions.width}x${dimensions.height}`,
  );
}

for (const relativePath of actualPngs) {
  check(referencedSet.has(relativePath), `${relativePath}: PNG exists on disk but is not referenced by the manifest`);
}

const combinations = engine.SKINS.length
  * engine.HAIR_STYLES.length
  * engine.HAIR_COLORS.length
  * engine.HEADGEAR.length
  * engine.OUTFITS.length
  * engine.OUTFIT_COLORS.length
  * engine.WEAPONS.length
  * engine.SHIELDS.length;

if (errors.length) {
  console.error(`Project validation failed with ${errors.length} error${errors.length === 1 ? '' : 's'}:`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Project validation passed.');
console.log(`- Entry point: ${entryFile}`);
console.log(`- Player combinations: ${combinations.toLocaleString('en-US')}`);
console.log(`- Enemy families: ${manifest.enemies.length}`);
console.log(`- Enemy variants: ${enemyRefs.length}`);
console.log(`- Player samples: ${playerRefs.length}`);
console.log(`- Validated PNG sheets: ${actualPngs.length} (${expectedWidth}x${expectedHeight})`);
