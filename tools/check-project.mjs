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

const runtimeSources = {
  'index.html': entrySource,
  'app.js': await readFile(path.join(root, 'app.js'), 'utf8'),
  'sprite-engine.js': await readFile(path.join(root, 'sprite-engine.js'), 'utf8'),
};
for (const [relativePath, source] of Object.entries(runtimeSources)) {
  check(!/\bnew\s+Function\s*\(/.test(source), `${relativePath}: runtime code generation with new Function is not allowed`);
  check(!/\beval\s*\(/.test(source), `${relativePath}: runtime code generation with eval is not allowed`);
}

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
