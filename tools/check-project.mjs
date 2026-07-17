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
const internalCatalogs = await import(`${pathToFileURL(path.join(root, 'engine', 'catalogs.js')).href}?check=${Date.now()}`);
const characterKit = await import(`${pathToFileURL(path.join(root, 'character-kit.js')).href}?check=${Date.now()}`);
const zipModule = await import(`${pathToFileURL(path.join(root, 'zip.js')).href}?check=${Date.now()}`);

checkSyntax('sprite-engine.js');
checkSyntax('app.js');
checkSyntax('character-kit.js');
checkSyntax('zip.js');
checkSyntax('engine/catalogs.js');
checkSyntax('engine/catalogs/animation.js');
checkSyntax('engine/catalogs/enemies.js');
checkSyntax('engine/catalogs/palettes.js');
checkSyntax('engine/catalogs/player-options.js');
checkSyntax('engine/generators.js');
checkSyntax('engine/renderer.js');
checkSyntax('engine/shield-renderer.js');
checkSyntax('engine/sheets.js');
checkSyntax('engine/weapon-renderer.js');
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
  'pack-name', 'pack-summary', 'pack-list', 'pack-status',
  'add-to-pack-button', 'clear-pack-button', 'download-pack-button',
  'pack-master-kit-summary', 'download-pack-master-kit-button',
  'master-kit-summary', 'master-kit-status', 'download-master-kit-button',
]) {
  check(entrySource.includes(`id="${controlId}"`), `index.html must expose the ${controlId} editor control`);
}

const runtimeSources = {
  'index.html': entrySource,
  'app.js': await readFile(path.join(root, 'app.js'), 'utf8'),
  'sprite-engine.js': await readFile(path.join(root, 'sprite-engine.js'), 'utf8'),
  'character-kit.js': await readFile(path.join(root, 'character-kit.js'), 'utf8'),
  'zip.js': await readFile(path.join(root, 'zip.js'), 'utf8'),
  'engine/catalogs.js': await readFile(path.join(root, 'engine', 'catalogs.js'), 'utf8'),
  'engine/catalogs/animation.js': await readFile(path.join(root, 'engine', 'catalogs', 'animation.js'), 'utf8'),
  'engine/catalogs/enemies.js': await readFile(path.join(root, 'engine', 'catalogs', 'enemies.js'), 'utf8'),
  'engine/catalogs/palettes.js': await readFile(path.join(root, 'engine', 'catalogs', 'palettes.js'), 'utf8'),
  'engine/catalogs/player-options.js': await readFile(path.join(root, 'engine', 'catalogs', 'player-options.js'), 'utf8'),
  'engine/generators.js': await readFile(path.join(root, 'engine', 'generators.js'), 'utf8'),
  'engine/renderer.js': await readFile(path.join(root, 'engine', 'renderer.js'), 'utf8'),
  'engine/shield-renderer.js': await readFile(path.join(root, 'engine', 'shield-renderer.js'), 'utf8'),
  'engine/sheets.js': await readFile(path.join(root, 'engine', 'sheets.js'), 'utf8'),
  'engine/weapon-renderer.js': await readFile(path.join(root, 'engine', 'weapon-renderer.js'), 'utf8'),
};
for (const [relativePath, source] of Object.entries(runtimeSources)) {
  check(!/\bnew\s+Function\s*\(/.test(source), `${relativePath}: runtime code generation with new Function is not allowed`);
  check(!/\beval\s*\(/.test(source), `${relativePath}: runtime code generation with eval is not allowed`);
}

const expectedEngineExports = [
  'ANIMS', 'DIRS', 'DIR_LABELS', 'ENEMIES', 'FACIAL_DETAILS', 'HAIR_COLORS', 'HAIR_STYLES', 'HEADGEAR',
  'OUTFITS', 'OUTFIT_COLORS', 'SHEET_COLS', 'SHIELDS', 'SHIELD_TIERS', 'SIZE', 'SKINS', 'WEAPONS', 'WEAPON_TIERS',
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
check(runtimeSources['app.js'].includes("from './character-kit.js'"), 'app.js must use the focused master character-kit planner');
check(!runtimeSources['character-kit.js'].includes("from './engine/"), 'character-kit.js must consume only the public engine facade');
check(runtimeSources['app.js'].includes("from './zip.js'"), 'app.js must use the standalone ZIP packaging utility');
check(runtimeSources['app.js'].includes("PRESET_VERSION = 5"), 'app.js must keep presets under the current versioned schema');
check(runtimeSources['app.js'].includes('![1, 2, 3, 4, PRESET_VERSION].includes(saved.version)'), 'app.js must migrate version 1, 2, 3, and 4 preset libraries');
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
check(runtimeSources['app.js'].includes('EXPORT_SCALES = [1, 4, 8, 12]'), 'app.js must expose native 1x plus 4x, 8x, and 12x export scales');
check(runtimeSources['app.js'].includes("scale === 1 ? '1x Native'"), 'the native export scale must be clearly labeled in the UI');
check(runtimeSources['app.js'].includes("state.exportScale === 1 ? ' · native' : ''"), 'native export dimensions must be identified in the size readout');
check(runtimeSources['engine/sheets.js'].includes('function buildSheet(spec, scale = 1, opts = {})'), 'full-sheet assembly must retain native 1x as its logical default');
check(runtimeSources['engine/sheets.js'].includes('function buildAnimationSheet(spec, animId, scale = 1, opts = {})'), 'animation-sheet assembly must retain native 1x as its logical default');
check(runtimeSources['engine/sheets.js'].includes('function buildDirectionSheet(spec, direction, scale = 1, opts = {})'), 'direction-sheet assembly must retain native 1x as its logical default');
check(engine.SHEET_COLS * engine.SIZE === 288 && engine.DIRS.length * engine.SIZE === 96, 'native full-sheet dimensions must remain 288x96 pixels');
check(engine.SHEET_COLS * engine.SIZE === 288 && engine.SIZE === 24, 'native direction-sheet dimensions must remain 288x24 pixels');
check(engine.ANIMS.every((anim) => anim.frames * engine.SIZE === 48 || anim.frames * engine.SIZE === 96), 'native animation-sheet widths must remain 48 or 96 pixels');
check(runtimeSources['app.js'].includes("PACK_STORAGE_KEY = 'sprite-assembler-character-pack-v1'"), 'character packs must use independent versioned persistence');
check(runtimeSources['app.js'].includes('PACK_ENTRY_LIMIT = 200'), 'character packs must keep a bounded entry count');
check(runtimeSources['app.js'].includes('function loadPackLibrary(') && runtimeSources['app.js'].includes('function persistPackLibrary('), 'character packs must load and persist their working library');
check(runtimeSources['app.js'].includes('const canvas = E.buildSheet(spec, scale)'), 'character packs must always export complete sprite sheets');
check(runtimeSources['app.js'].includes("format: '8-bit-sprite-assembler-character-pack'"), 'character pack manifests must expose their stable format id');
check(runtimeSources['app.js'].includes('buildStoredZip(zipEntries'), 'character pack downloads must assemble their PNGs and manifest into a ZIP');
check(characterKit.MASTER_CHARACTER_KIT_FORMAT === '8-bit-sprite-assembler-master-character-kit', 'master kits must expose a stable format id');
check(characterKit.MASTER_CHARACTER_KIT_VERSION === 1, 'master kits must use an explicit versioned schema');
check(characterKit.MASTER_CHARACTER_KIT_SCALE === 1, 'master kits must export native logical pixels');
check(
  JSON.stringify(characterKit.MASTER_CHARACTER_KIT_LAYER_ORDER) === JSON.stringify(['weapon-back', 'shield-back', 'body', 'shield-front', 'weapon-front']),
  'master kits must preserve the renderer draw order across composable layers',
);
const masterKitPlayer = {
  skin: 'peach', hairStyle: 'spiky', hairColor: 'brown', faceDetail: 'none', headgear: 'none',
  outfit: 'tunic', outfitColor: 'royal', weapon: 'sword', weaponTier: 'tier1',
  shield: 'round', shieldTier: 'tier1', palette: null,
};
const masterKitPlan = characterKit.buildMasterCharacterKitPlan(masterKitPlayer);
check(masterKitPlan.bodies.length === 280, 'master kits must include every outfit, catalog color, and headgear body combination');
check(masterKitPlan.weapons.length === 75, 'master kits must include all fifteen weapons at all five tiers');
check(masterKitPlan.shields.length === 224, 'master kits must include all eight shields at four tiers and seven catalog colors');
check(masterKitPlan.counts.totalPngs === 879, 'standard master kits must contain 879 native PNG sheets including the assembled preview');
check(masterKitPlan.bodies.every((entry) => entry.layer === 'body' && entry.spec.weapon === 'none' && entry.spec.shield === 'none'), 'master-kit bodies must not bake weapons or shields');
check(masterKitPlan.weapons.every((entry) => entry.files.back.endsWith('/back.png') && entry.files.front.endsWith('/front.png')), 'every master-kit weapon must expose separate back and front layers');
check(masterKitPlan.shields.every((entry) => entry.files.back.endsWith('/back.png') && entry.files.front.endsWith('/front.png')), 'every master-kit shield must expose separate back and front layers');
const masterKitPaths = [
  ...masterKitPlan.bodies.map((entry) => entry.file),
  ...masterKitPlan.weapons.flatMap((entry) => [entry.files.back, entry.files.front]),
  ...masterKitPlan.shields.flatMap((entry) => [entry.files.back, entry.files.front]),
  'preview/default.png',
];
check(new Set(masterKitPaths).size === masterKitPlan.counts.totalPngs, 'every master-kit PNG path must be unique');
const customKitPlan = characterKit.buildMasterCharacterKitPlan({
  ...masterKitPlayer,
  palette: { skin: ['#123456', '#234567'], hair: ['#345678', '#456789'], outfit: ['#56789a', '#6789ab'] },
});
check(customKitPlan.counts.outfitColors === 8 && customKitPlan.counts.totalPngs === 983, 'master kits must add the current custom outfit color without replacing catalog colors');
check(characterKit.MASTER_ROSTER_KIT_FORMAT === '8-bit-sprite-assembler-master-roster-kit', 'roster master kits must expose a stable format id');
check(characterKit.MASTER_ROSTER_KIT_VERSION === 1, 'roster master kits must use an explicit versioned schema');
check(characterKit.MASTER_ROSTER_KIT_LIMIT === 24, 'roster master kits must keep the approved 24-character identity limit');
const rosterKitEntries = Array.from({ length: 24 }, (_, index) => ({
  id: `hero-${index + 1}`,
  name: `Hero ${index + 1}`,
  kind: 'player',
  spec: {
    ...masterKitPlayer,
    skin: engine.SKINS[index % engine.SKINS.length].id,
    hairStyle: engine.HAIR_STYLES[index % engine.HAIR_STYLES.length].id,
    hairColor: engine.HAIR_COLORS[index % engine.HAIR_COLORS.length].id,
    faceDetail: engine.FACIAL_DETAILS[index % engine.FACIAL_DETAILS.length].id,
  },
}));
const rosterKitPlan = characterKit.buildMasterRosterKitPlan(rosterKitEntries);
check(rosterKitPlan.characters.length === 24, 'roster master kits must retain all 24 player identities');
check(rosterKitPlan.counts.bodySheets === 6720, 'a standard 24-character roster kit must include 280 compatible body sheets per identity');
check(rosterKitPlan.counts.weaponLayers === 150, 'roster master kits must render the weapon library once');
check(rosterKitPlan.counts.shieldLayers === 448, 'roster master kits must render the color-aware shield library once');
check(rosterKitPlan.counts.assembledPreviews === 24 && rosterKitPlan.counts.totalPngs === 7342, 'a standard 24-character roster kit must contain 7342 native PNG sheets');
check(rosterKitPlan.weapons.every((entry) => entry.files.back.startsWith('shared/weapons/')), 'roster weapon layers must live in the shared library');
check(rosterKitPlan.shields.every((entry) => entry.files.front.startsWith('shared/shields/')), 'roster shield layers must live in the shared library');
check(rosterKitPlan.characters.every((character) => (
  character.bodies.length === 280
  && character.bodies.every((entry) => entry.file.startsWith(`${character.bodyRoot}/`))
)), 'every roster identity must own a complete compatible body library');
const rosterKitPaths = [
  ...rosterKitPlan.characters.flatMap((character) => [
    ...character.bodies.map((entry) => entry.file),
    character.defaultPreview,
  ]),
  ...rosterKitPlan.weapons.flatMap((entry) => [entry.files.back, entry.files.front]),
  ...rosterKitPlan.shields.flatMap((entry) => [entry.files.back, entry.files.front]),
];
check(new Set(rosterKitPaths).size === rosterKitPlan.counts.totalPngs, 'every roster master-kit PNG path must be unique');
check(runtimeSources['app.js'].includes('function downloadPackMasterKit('), 'app.js must expose one-click character-pack Master Kit export');
check(runtimeSources['app.js'].includes('function masterRosterKitManifest('), 'roster master-kit downloads must include a game-facing manifest');
check(runtimeSources['engine/renderer.js'].includes("renderLayer === 'weapon-back'") && runtimeSources['engine/renderer.js'].includes("renderLayer === 'weapon-front'"), 'the renderer must expose separate weapon occlusion passes');
check(runtimeSources['engine/renderer.js'].includes("renderLayer === 'shield-back'") && runtimeSources['engine/renderer.js'].includes("renderLayer === 'shield-front'"), 'the renderer must expose separate shield occlusion passes');
check(internalCatalogs.WOOD.length >= 3, 'shield highlights must not clear assembled body pixels through a missing wood color');
check((runtimeSources['engine/sheets.js'].match(/\.\.\.opts, shadow: opts\.shadow === true/g) || []).length === 3, 'every sheet builder must forward layer options while keeping shadows opt-in');
check(runtimeSources['app.js'].includes('function downloadMasterCharacterKit('), 'app.js must expose one-click master character-kit export');
check(runtimeSources['app.js'].includes('MASTER_CHARACTER_KIT_SCALE, { layer }'), 'master character kits must render every requested compositing layer at native scale');
check(runtimeSources['app.js'].includes('defaultPreview: \'preview/default.png\''), 'master character-kit manifests must include an assembled reference preview');
const zipFixture = zipModule.buildStoredZip([
  { name: '../characters/test.png', data: new Uint8Array([137, 80, 78, 71]) },
  { name: 'manifest.json', data: new TextEncoder().encode('{"version":1}') },
], new Date('2026-01-02T03:04:06Z'));
const zipView = new DataView(zipFixture.buffer, zipFixture.byteOffset, zipFixture.byteLength);
check(zipView.getUint32(0, true) === 0x04034b50, 'ZIP archives must begin with a valid local-file signature');
check(zipView.getUint32(zipFixture.length - 22, true) === 0x06054b50, 'ZIP archives must end with a valid central-directory record');
const zipText = new TextDecoder().decode(zipFixture);
check(zipText.includes('characters/test.png') && !zipText.includes('../characters/test.png'), 'ZIP entry paths must reject parent traversal');
check(zipText.includes('manifest.json'), 'ZIP archives must retain every requested entry name');
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
const expectedFacialDetails = ['none', 'beard', 'mustache', 'scar', 'eyepatch', 'glasses', 'blush', 'warpaint'];
check(
  JSON.stringify(engine.FACIAL_DETAILS.map((detail) => detail.id)) === JSON.stringify(expectedFacialDetails),
  'the facial-detail catalog must preserve its validated option ids and default ordering',
);
check(runtimeSources['app.js'].includes("validId(E.FACIAL_DETAILS, player.faceDetail"), 'saved player specs must safely migrate missing or invalid facial details');
check(runtimeSources['engine/renderer.js'].includes("detail: spec.faceDetail || 'none'"), 'the renderer must keep legacy player specs visually compatible');
check(engine.WEAPONS.length === 16, 'the validated weapon catalog must contain sixteen choices including none');
check(engine.WEAPONS.every((weapon) => typeof weapon.category === 'string'), 'every weapon must declare a content category');
check(engine.WEAPONS.filter((weapon) => weapon.id !== 'none').every((weapon) => typeof weapon.tier2Name === 'string'), 'every equipped weapon must declare an RPG-style Tier 2 name');
check(engine.WEAPONS.filter((weapon) => weapon.id !== 'none').every((weapon) => typeof weapon.tier3Name === 'string'), 'every equipped weapon must declare a legendary Tier 3 name');
check(engine.WEAPONS.filter((weapon) => weapon.id !== 'none').every((weapon) => typeof weapon.tier4Name === 'string'), 'every equipped weapon must declare a mythic Tier 4 name');
check(engine.WEAPONS.filter((weapon) => weapon.id !== 'none').every((weapon) => typeof weapon.tier5Name === 'string'), 'every equipped weapon must declare an artifact Tier 5 name');
check(JSON.stringify(engine.WEAPON_TIERS.map((tier) => tier.id)) === JSON.stringify(['tier1', 'tier2', 'tier3', 'tier4', 'tier5']), 'the weapon tier catalog must expose stable Tier 1 through Tier 5 ids');
check(runtimeSources['app.js'].includes("validId(E.WEAPON_TIERS, player.weaponTier"), 'saved player specs must safely migrate missing or invalid weapon tiers');
check(runtimeSources['app.js'].includes("'Weapon tier'"), 'the player editor must expose a dedicated weapon tier control');
check(runtimeSources['engine/weapon-renderer.js'].includes("C.weaponTier === 'tier3'"), 'the weapon renderer must apply the legendary Tier 3 upgrade layer');
check(runtimeSources['engine/weapon-renderer.js'].includes("C.weaponTier === 'tier4'"), 'the weapon renderer must apply the longer mythic Tier 4 upgrade layer');
check(runtimeSources['engine/weapon-renderer.js'].includes("C.weaponTier === 'tier5'"), 'the weapon renderer must apply the apex artifact Tier 5 upgrade layer');
check(runtimeSources['engine/renderer.js'].includes("from './weapon-renderer.js'"), 'humanoid rendering must use the focused weapon renderer');
check(runtimeSources['engine/renderer.js'].includes('weaponFollowRig: true'), 'player weapons must follow the animated humanoid hand rig');
check(runtimeSources['engine/renderer.js'].includes('enhancedHilts: true'), 'player blade weapons must use readable wrapped grips and pommels');
const expectedShields = ['none', 'round', 'kite', 'buckler', 'heater', 'tower', 'oval', 'bone', 'arcane'];
check(
  JSON.stringify(engine.SHIELDS.map((shield) => shield.id)) === JSON.stringify(expectedShields),
  'the shield catalog must expose none plus all eight validated shield families in stable order',
);
check(engine.SHIELDS.filter((shield) => shield.id !== 'none').every((shield) => typeof shield.tier2Name === 'string'), 'every equipped shield must declare an RPG-style Tier 2 name');
check(engine.SHIELDS.filter((shield) => shield.id !== 'none').every((shield) => typeof shield.tier3Name === 'string'), 'every equipped shield must declare a legendary Tier 3 name');
check(engine.SHIELDS.filter((shield) => shield.id !== 'none').every((shield) => typeof shield.tier4Name === 'string'), 'every equipped shield must declare a mythic Tier 4 name');
check(JSON.stringify(engine.SHIELD_TIERS.map((tier) => tier.id)) === JSON.stringify(['tier1', 'tier2', 'tier3', 'tier4']), 'the shield tier catalog must expose stable Tier 1 through Tier 4 ids');
check(runtimeSources['app.js'].includes('validId(E.SHIELDS, player.shield'), 'saved player specs must safely migrate missing or invalid shields');
check(runtimeSources['app.js'].includes('validId(E.SHIELD_TIERS, player.shieldTier'), 'saved player specs must safely migrate missing or invalid shield tiers');
check(runtimeSources['app.js'].includes("'Shield tier'"), 'the player editor must expose a dedicated shield tier control');
check(runtimeSources['app.js'].includes("key === 'shield' && value === 'none'"), 'unequipping a shield must normalize its tier to Tier 1');
check(runtimeSources['engine/generators.js'].includes("shieldTier: shield === 'none' ? 'tier1' : rnd(SHIELD_TIERS).id"), 'random players must choose a valid shield tier and normalize empty off-hands');
check(runtimeSources['engine/renderer.js'].includes("from './shield-renderer.js'"), 'humanoid rendering must use the focused shield renderer');
check(runtimeSources['engine/renderer.js'].includes('shieldFollowRig: true'), 'player shields must follow the animated off-hand rig');
check(runtimeSources['engine/shield-renderer.js'].includes("tier === 'tier2'"), 'the shield renderer must apply the reinforced Tier 2 upgrade layer');
check(runtimeSources['engine/shield-renderer.js'].includes("tier === 'tier3'"), 'the shield renderer must apply the legendary Tier 3 upgrade layer');
check(runtimeSources['engine/shield-renderer.js'].includes("tier === 'tier4'"), 'the shield renderer must apply the mythic Tier 4 upgrade layer');
check(runtimeSources['engine/shield-renderer.js'].includes("d === 'up' ? 'behind' : 'front'"), 'shield layering must place back-view shields behind the humanoid body');

function renderPixels(spec, dir, animId, frame) {
  const pixels = new Array(engine.SIZE * engine.SIZE).fill(null);
  let fillStyle = '#000000';
  const ctx = {
    clearRect() { pixels.fill(null); },
    get fillStyle() { return fillStyle; },
    set fillStyle(value) { fillStyle = value; },
    fillRect(x, y, width, height) {
      for (let py = y; py < y + height; py++) {
        for (let px = x; px < x + width; px++) {
          if (px >= 0 && py >= 0 && px < engine.SIZE && py < engine.SIZE) pixels[(py * engine.SIZE) + px] = fillStyle;
        }
      }
    },
  };
  engine.drawSprite(ctx, spec, dir, animId, frame, { shadow: false });
  return pixels;
}

function changedPixels(withShield, withoutShield) {
  const changed = [];
  for (let index = 0; index < withShield.length; index++) {
    if (withShield[index] !== withoutShield[index]) changed.push(index);
  }
  return changed;
}

function changeSignature(withShield, withoutShield) {
  return changedPixels(withShield, withoutShield).map((index) => `${index}:${withShield[index]}`).join('|');
}

const shieldBase = {
  kind: 'player',
  skin: engine.SKINS[0].id,
  hairStyle: engine.HAIR_STYLES[0].id,
  hairColor: engine.HAIR_COLORS[0].id,
  faceDetail: 'none',
  headgear: 'none',
  outfit: engine.OUTFITS[0].id,
  outfitColor: engine.OUTFIT_COLORS[0].id,
  weapon: 'none',
  weaponTier: 'tier1',
  shieldTier: 'tier1',
};
const equippedShields = expectedShields.slice(1);
for (const shield of equippedShields) {
  const spec = { ...shieldBase, shield };
  const emptySpec = { ...shieldBase, shield: 'none' };
  for (const dir of engine.DIRS) {
    for (const anim of engine.ANIMS) {
      for (let frame = 0; frame < anim.frames; frame++) {
        const rendered = renderPixels(spec, dir, anim.id, frame);
        const empty = renderPixels(emptySpec, dir, anim.id, frame);
        const changed = changedPixels(rendered, empty);
        check(changed.length >= 3, `${shield} shield must remain visible in ${dir} ${anim.id} frame ${frame}`);
        check(
          changed.every((index) => {
            const x = index % engine.SIZE;
            const y = Math.floor(index / engine.SIZE);
            return !(x >= 9 && x <= 14 && y >= 5 && y <= 10);
          }),
          `${shield} shield must not cover the face in ${dir} ${anim.id} frame ${frame}`,
        );
      }
    }

    const walkStart = changeSignature(renderPixels(spec, dir, 'walk', 0), renderPixels(emptySpec, dir, 'walk', 0));
    const walkReturn = changeSignature(renderPixels(spec, dir, 'walk', 2), renderPixels(emptySpec, dir, 'walk', 2));
    check(walkStart !== walkReturn, `${shield} shield must follow the off-hand walk swing in ${dir}`);

    const attackWind = changeSignature(renderPixels(spec, dir, 'attack', 0), renderPixels(emptySpec, dir, 'attack', 0));
    const attackRecover = changeSignature(renderPixels(spec, dir, 'attack', 3), renderPixels(emptySpec, dir, 'attack', 3));
    check(attackWind !== attackRecover, `${shield} shield must brace and recover with attacks in ${dir}`);
  }

  const right = renderPixels(spec, 'right', 'idle', 0);
  const left = renderPixels(spec, 'left', 'idle', 0);
  check(
    left.every((pixel, index) => {
      const x = index % engine.SIZE;
      const y = Math.floor(index / engine.SIZE);
      return pixel === right[(y * engine.SIZE) + (engine.SIZE - 1 - x)];
    }),
    `${shield} shield left profile must mirror the validated right profile`,
  );
}

for (const dir of engine.DIRS) {
  const signatures = equippedShields.map((shield) => renderPixels({ ...shieldBase, shield }, dir, 'idle', 0).join(','));
  check(new Set(signatures).size === equippedShields.length, `every shield family must have a distinct ${dir} silhouette`);
}

for (const shield of equippedShields) {
  const tier1Spec = { ...shieldBase, shield, shieldTier: 'tier1' };
  const tier2Spec = { ...shieldBase, shield, shieldTier: 'tier2' };
  for (const dir of engine.DIRS) {
    for (const anim of engine.ANIMS) {
      for (let frame = 0; frame < anim.frames; frame++) {
        const tier1 = renderPixels(tier1Spec, dir, anim.id, frame);
        const tier2 = renderPixels(tier2Spec, dir, anim.id, frame);
        const changed = changedPixels(tier2, tier1);
        check(changed.length >= 1, `${shield} Tier 2 must differ from Tier 1 in ${dir} ${anim.id} frame ${frame}`);
        check(
          changed.every((index) => {
            const x = index % engine.SIZE;
            const y = Math.floor(index / engine.SIZE);
            return !(x >= 9 && x <= 14 && y >= 5 && y <= 10);
          }),
          `${shield} Tier 2 must preserve face clearance in ${dir} ${anim.id} frame ${frame}`,
        );
      }
    }

    const tier1Idle = renderPixels(tier1Spec, dir, 'idle', 0);
    const tier2Idle = renderPixels(tier2Spec, dir, 'idle', 0);
    check(
      tier2Idle.filter(Boolean).length > tier1Idle.filter(Boolean).length,
      `${shield} Tier 2 must expand beyond its Tier 1 ${dir} idle silhouette`,
    );

    const walkStart = changeSignature(renderPixels(tier2Spec, dir, 'walk', 0), renderPixels(tier1Spec, dir, 'walk', 0));
    const walkReturn = changeSignature(renderPixels(tier2Spec, dir, 'walk', 2), renderPixels(tier1Spec, dir, 'walk', 2));
    check(walkStart !== walkReturn, `${shield} Tier 2 additions must follow the off-hand walk swing in ${dir}`);
  }
}

for (const dir of engine.DIRS) {
  const signatures = equippedShields.map((shield) => (
    renderPixels({ ...shieldBase, shield, shieldTier: 'tier2' }, dir, 'idle', 0).join(',')
  ));
  check(new Set(signatures).size === equippedShields.length, `every Tier 2 shield family must have a distinct ${dir} silhouette`);
}

for (const shield of equippedShields) {
  const tier2Spec = { ...shieldBase, shield, shieldTier: 'tier2' };
  const tier3Spec = { ...shieldBase, shield, shieldTier: 'tier3' };
  for (const dir of engine.DIRS) {
    for (const anim of engine.ANIMS) {
      for (let frame = 0; frame < anim.frames; frame++) {
        const tier2 = renderPixels(tier2Spec, dir, anim.id, frame);
        const tier3 = renderPixels(tier3Spec, dir, anim.id, frame);
        const changed = changedPixels(tier3, tier2);
        check(changed.length >= 1, `${shield} Tier 3 must differ from Tier 2 in ${dir} ${anim.id} frame ${frame}`);
        check(
          changed.every((index) => {
            const x = index % engine.SIZE;
            const y = Math.floor(index / engine.SIZE);
            return !(x >= 9 && x <= 14 && y >= 5 && y <= 10);
          }),
          `${shield} Tier 3 must preserve face clearance in ${dir} ${anim.id} frame ${frame}`,
        );
      }
    }

    const tier2Idle = renderPixels(tier2Spec, dir, 'idle', 0);
    const tier3Idle = renderPixels(tier3Spec, dir, 'idle', 0);
    check(
      tier3Idle.filter(Boolean).length > tier2Idle.filter(Boolean).length,
      `${shield} Tier 3 must expand beyond its Tier 2 ${dir} idle silhouette`,
    );

    const walkStart = changeSignature(renderPixels(tier3Spec, dir, 'walk', 0), renderPixels(tier2Spec, dir, 'walk', 0));
    const walkReturn = changeSignature(renderPixels(tier3Spec, dir, 'walk', 2), renderPixels(tier2Spec, dir, 'walk', 2));
    check(walkStart !== walkReturn, `${shield} Tier 3 additions must follow the off-hand walk swing in ${dir}`);

    const attackWind = changeSignature(renderPixels(tier3Spec, dir, 'attack', 0), renderPixels(tier2Spec, dir, 'attack', 0));
    const attackRecover = changeSignature(renderPixels(tier3Spec, dir, 'attack', 3), renderPixels(tier2Spec, dir, 'attack', 3));
    check(attackWind !== attackRecover, `${shield} Tier 3 additions must brace and recover with attacks in ${dir}`);
  }
}

for (const dir of engine.DIRS) {
  const signatures = equippedShields.map((shield) => (
    renderPixels({ ...shieldBase, shield, shieldTier: 'tier3' }, dir, 'idle', 0).join(',')
  ));
  check(new Set(signatures).size === equippedShields.length, `every Tier 3 shield family must have a distinct ${dir} silhouette`);
}

for (const shield of equippedShields) {
  const tier3Spec = { ...shieldBase, shield, shieldTier: 'tier3' };
  const tier4Spec = { ...shieldBase, shield, shieldTier: 'tier4' };
  for (const dir of engine.DIRS) {
    for (const anim of engine.ANIMS) {
      for (let frame = 0; frame < anim.frames; frame++) {
        const tier3 = renderPixels(tier3Spec, dir, anim.id, frame);
        const tier4 = renderPixels(tier4Spec, dir, anim.id, frame);
        const changed = changedPixels(tier4, tier3);
        const faceChanges = changed.filter((index) => {
          const x = index % engine.SIZE;
          const y = Math.floor(index / engine.SIZE);
          return x >= 9 && x <= 14 && y >= 5 && y <= 10;
        });
        check(changed.length >= 1, `${shield} Tier 4 must differ from Tier 3 in ${dir} ${anim.id} frame ${frame}`);
        check(
          faceChanges.length === 0,
          `${shield} Tier 4 must preserve face clearance in ${dir} ${anim.id} frame ${frame} (${faceChanges.map((index) => `${index % engine.SIZE},${Math.floor(index / engine.SIZE)}`).join('; ')})`,
        );
      }
    }

    const tier3Idle = renderPixels(tier3Spec, dir, 'idle', 0);
    const tier4Idle = renderPixels(tier4Spec, dir, 'idle', 0);
    check(
      tier4Idle.filter(Boolean).length > tier3Idle.filter(Boolean).length,
      `${shield} Tier 4 must expand beyond its Tier 3 ${dir} idle silhouette`,
    );

    const walkStart = changeSignature(renderPixels(tier4Spec, dir, 'walk', 0), renderPixels(tier3Spec, dir, 'walk', 0));
    const walkReturn = changeSignature(renderPixels(tier4Spec, dir, 'walk', 2), renderPixels(tier3Spec, dir, 'walk', 2));
    check(walkStart !== walkReturn, `${shield} Tier 4 additions must follow the off-hand walk swing in ${dir}`);

    const attackWind = changeSignature(renderPixels(tier4Spec, dir, 'attack', 0), renderPixels(tier3Spec, dir, 'attack', 0));
    const attackRecover = changeSignature(renderPixels(tier4Spec, dir, 'attack', 3), renderPixels(tier3Spec, dir, 'attack', 3));
    check(attackWind !== attackRecover, `${shield} Tier 4 additions must brace and recover with attacks in ${dir}`);
  }
}

for (const dir of engine.DIRS) {
  const signatures = equippedShields.map((shield) => (
    renderPixels({ ...shieldBase, shield, shieldTier: 'tier4' }, dir, 'idle', 0).join(',')
  ));
  check(new Set(signatures).size === equippedShields.length, `every Tier 4 shield family must have a distinct ${dir} silhouette`);
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
  * engine.FACIAL_DETAILS.length
  * engine.HEADGEAR.length
  * engine.OUTFITS.length
  * engine.OUTFIT_COLORS.length
  * (1 + ((engine.WEAPONS.length - 1) * engine.WEAPON_TIERS.length))
  * (1 + ((engine.SHIELDS.length - 1) * engine.SHIELD_TIERS.length));

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
