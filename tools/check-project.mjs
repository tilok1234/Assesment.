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
checkSyntax('engine/catalogs/effects.js');
checkSyntax('engine/catalogs/enemies.js');
checkSyntax('engine/catalogs/palettes.js');
checkSyntax('engine/catalogs/player-options.js');
checkSyntax('engine/combat-loadouts.js');
checkSyntax('engine/class-templates.js');
checkSyntax('engine/variant-batches.js');
checkSyntax('engine/generators.js');
checkSyntax('engine/effect-renderer.js');
checkSyntax('engine/renderer.js');
checkSyntax('engine/shield-renderer.js');
checkSyntax('engine/sheets.js');
checkSyntax('engine/weapon-renderer.js');
checkSyntax('tools/build.mjs');
checkSyntax('tools/dev-server.mjs');
checkSyntax('tools/weapon-readability-audit.mjs');
checkSyntax('tools/check-windows-release.mjs');

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
  'combat-loadout-panel', 'loadout-summary', 'loadout-preview-button',
  'loadout-trail', 'loadout-projectile', 'loadout-impact', 'loadout-status-overlay',
  'loadout-name', 'loadout-library-select', 'save-loadout-button',
  'load-loadout-button', 'delete-loadout-button', 'download-loadout-button', 'loadout-status',
  'variant-batch-panel', 'variant-batch-set', 'variant-batch-description',
  'variant-batch-summary', 'variant-batch-status', 'download-variant-batch-button',
  'class-pack-panel', 'class-template', 'class-pack-description', 'class-pack-equipment',
  'class-pack-summary', 'class-pack-status', 'apply-class-template-button', 'download-class-pack-button',
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
  'engine/catalogs/effects.js': await readFile(path.join(root, 'engine', 'catalogs', 'effects.js'), 'utf8'),
  'engine/catalogs/enemies.js': await readFile(path.join(root, 'engine', 'catalogs', 'enemies.js'), 'utf8'),
  'engine/catalogs/palettes.js': await readFile(path.join(root, 'engine', 'catalogs', 'palettes.js'), 'utf8'),
  'engine/catalogs/player-options.js': await readFile(path.join(root, 'engine', 'catalogs', 'player-options.js'), 'utf8'),
  'engine/combat-loadouts.js': await readFile(path.join(root, 'engine', 'combat-loadouts.js'), 'utf8'),
  'engine/class-templates.js': await readFile(path.join(root, 'engine', 'class-templates.js'), 'utf8'),
  'engine/variant-batches.js': await readFile(path.join(root, 'engine', 'variant-batches.js'), 'utf8'),
  'engine/generators.js': await readFile(path.join(root, 'engine', 'generators.js'), 'utf8'),
  'engine/effect-renderer.js': await readFile(path.join(root, 'engine', 'effect-renderer.js'), 'utf8'),
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
  'ANIMS', 'BODY_BUILDS', 'CLASS_PACK_FORMAT', 'CLASS_PACK_VERSION', 'CLASS_TEMPLATES',
  'COMBAT_EFFECTS', 'COMBAT_LOADOUT_FORMAT', 'COMBAT_LOADOUT_SLOTS', 'COMBAT_LOADOUT_VERSION', 'DEFAULT_CLASS_TEMPLATE',
  'DEFAULT_COMBAT_LOADOUT', 'DEFAULT_VARIANT_BATCH_SET',
  'DIRS', 'DIR_LABELS', 'ENEMIES', 'EXPRESSIONS', 'FACIAL_DETAILS', 'HAIR_COLORS', 'HAIR_STYLES', 'HEADGEAR',
  'OUTFITS', 'OUTFIT_COLORS', 'OUTFIT_TIERS', 'SHEET_COLS', 'SHIELDS', 'SHIELD_TIERS', 'SIZE', 'SKINS', 'SPECIES', 'WEAPONS', 'WEAPON_TIERS',
  'VARIANT_BATCH_FORMAT', 'VARIANT_BATCH_SETS', 'VARIANT_BATCH_VERSION',
  'applyClassTemplate', 'buildAnimationSheet', 'buildClassPack', 'buildDirectionSheet', 'buildSheet', 'buildVariantBatch',
  'combatLoadoutEffectSpecs', 'defaultCombatLoadout', 'describe', 'drawSprite',
  'randomEffect', 'randomEnemy', 'randomPlayer', 'resolveCombatLoadout', 'sanitizeCombatLoadout', 'thumbURL',
].sort();
check(
  JSON.stringify(Object.keys(engine).sort()) === JSON.stringify(expectedEngineExports),
  'sprite-engine.js public exports changed; consumers must keep using the stable facade API',
);
check(runtimeSources['sprite-engine.js'].split(/\r?\n/).length < 60, 'sprite-engine.js must remain a small public facade');
check(runtimeSources['engine/catalogs.js'].split(/\r?\n/).length < 40, 'engine/catalogs.js must remain a small internal facade');
check(runtimeSources['app.js'].includes("from './sprite-engine.js'"), 'app.js must consume the public engine facade');
check(!runtimeSources['app.js'].includes("from './engine/"), 'app.js must not depend on internal engine modules');
check(runtimeSources['app.js'].includes("from './character-kit.js'"), 'app.js must use the focused master character-kit planner');
check(!runtimeSources['character-kit.js'].includes("from './engine/"), 'character-kit.js must consume only the public engine facade');
check(runtimeSources['app.js'].includes("from './zip.js'"), 'app.js must use the standalone ZIP packaging utility');
check(runtimeSources['app.js'].includes("PRESET_VERSION = 9"), 'app.js must keep presets under the current versioned schema');
check(runtimeSources['app.js'].includes('![1, 2, 3, 4, 5, 6, 7, 8, PRESET_VERSION].includes(saved.version)'), 'app.js must migrate version 1 through 8 preset libraries');
check(runtimeSources['app.js'].includes('PALETTE_VERSION = 1'), 'app.js must keep reusable palettes under an explicit versioned schema');
check(runtimeSources['app.js'].includes('HISTORY_LIMIT = 100'), 'app.js must keep bounded sprite-edit history');
check(runtimeSources['app.js'].includes("['mode', 'player', 'enemy', 'effect', 'loadout', 'characterName', 'exportName']"), 'app.js history must include combat loadouts while remaining scoped to the editable sprite document');
check(runtimeSources['app.js'].includes("makeButton('Effects'"), 'app.js must expose combat effects as a first-class editor mode');
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
check(runtimeSources['app.js'].includes("LOADOUT_STORAGE_KEY = 'sprite-assembler-combat-loadouts-v1'"), 'combat loadouts must use independent versioned persistence');
check(runtimeSources['app.js'].includes('LOADOUT_STORAGE_LIMIT = 100'), 'saved combat loadouts must keep a bounded entry count');
check(runtimeSources['app.js'].includes('function loadCombatLoadoutLibrary(') && runtimeSources['app.js'].includes('function persistCombatLoadoutLibrary('), 'combat loadouts must load and persist their recipe library');
check(runtimeSources['app.js'].includes('function combatLoadoutManifest('), 'combat loadouts must expose a game-facing JSON manifest');
check(runtimeSources['app.js'].includes('columnIndexBase: 0'), 'combat loadout JSON must identify sheet columns as zero-based');
check(runtimeSources['app.js'].includes('manifestCombatLoadoutRecipe(spec, entry.loadout)'), 'regular sprite packs must preserve resolved combat recipes beside modular sheets');
check(runtimeSources['app.js'].includes('combatLoadoutsBySource.has(recipe.sourceId)'), 'Complete Kit recipes must carry their matching combat loadouts');
check(runtimeSources['app.js'].includes('E.combatLoadoutEffectSpecs(spec, loadout)'), 'combined previews must resolve modular effect overlays through the public engine facade');
check(runtimeSources['app.js'].includes('{ shadow: false, clear: false }'), 'combined previews must layer effects without clearing the base sprite');
check(runtimeSources['engine/renderer.js'].includes("if (opts.clear !== false) ctx.clearRect"), 'the renderer must support non-clearing modular overlay passes');
check(runtimeSources['app.js'].includes('function downloadEquipmentVariantBatch('), 'the editor must expose the equipment-variant ZIP workflow');
check(runtimeSources['app.js'].includes('variantBatchEffectEntries(plan)'), 'variant batches must deduplicate the combat effects actually referenced by their generated characters');
check(runtimeSources['app.js'].includes('format: E.VARIANT_BATCH_FORMAT'), 'equipment batches must publish their stable schema format');
check(runtimeSources['app.js'].includes('function applySelectedClassTemplate('), 'class templates must support an undoable apply-defaults action');
check(runtimeSources['app.js'].includes('function downloadClassPack('), 'the editor must expose the focused class-pack ZIP workflow');
check(runtimeSources['app.js'].includes('format: E.CLASS_PACK_FORMAT'), 'class packs must publish their stable schema format');
check(runtimeSources['app.js'].includes('classTemplate: { ...plan.template }'), 'class-pack manifests must retain the complete stable template definition');
check(runtimeSources['app.js'].includes('combatLoadout: manifestCombatLoadoutRecipe(spec, loadout)'), 'ready variant and class sheets must carry their captured modular combat loadouts');
check(characterKit.MASTER_CHARACTER_KIT_FORMAT === '8-bit-sprite-assembler-master-character-kit', 'master kits must expose a stable format id');
check(characterKit.MASTER_CHARACTER_KIT_VERSION === 1, 'master kits must use an explicit versioned schema');
check(characterKit.MASTER_CHARACTER_KIT_SCALE === 1, 'master kits must export native logical pixels');
check(
  JSON.stringify(characterKit.MASTER_CHARACTER_KIT_LAYER_ORDER) === JSON.stringify(['weapon-back', 'shield-back', 'body', 'shield-front', 'weapon-front']),
  'master kits must preserve the renderer draw order across composable layers',
);
const masterKitPlayer = {
  species: 'human', bodyBuild: 'classic', skin: 'peach', hairStyle: 'spiky', hairColor: 'brown', expression: 'neutral', faceDetail: 'none', headgear: 'none',
  outfit: 'tunic', outfitTier: 'tier1', outfitColor: 'royal', weapon: 'sword', weaponTier: 'tier1',
  shield: 'round', shieldTier: 'tier1', palette: null,
};
const masterKitPlan = characterKit.buildMasterCharacterKitPlan(masterKitPlayer);
check(masterKitPlan.bodies.length === 756, 'master kits must include every outfit, catalog color, and headgear body combination');
check(masterKitPlan.weapons.length === 75, 'master kits must include all fifteen weapons at all five tiers');
check(masterKitPlan.shields.length === 280, 'master kits must include all eight shields at all five tiers and seven catalog colors');
check(masterKitPlan.counts.totalPngs === 1467, 'standard master kits must contain 1467 native PNG sheets including the assembled preview');
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
check(customKitPlan.counts.outfitColors === 8 && customKitPlan.counts.totalPngs === 1655, 'master kits must add the current custom outfit color without replacing catalog colors');
const rosterKitEntries = Array.from({ length: 24 }, (_, index) => ({
  id: `hero-${index + 1}`,
  name: `Hero ${index + 1}`,
  kind: 'player',
  spec: {
    ...masterKitPlayer,
    species: engine.SPECIES[index % engine.SPECIES.length].id,
    bodyBuild: engine.BODY_BUILDS[index % engine.BODY_BUILDS.length].id,
    skin: engine.SKINS[index % engine.SKINS.length].id,
    hairStyle: engine.HAIR_STYLES[index % engine.HAIR_STYLES.length].id,
    hairColor: engine.HAIR_COLORS[index % engine.HAIR_COLORS.length].id,
    expression: engine.EXPRESSIONS[index % engine.EXPRESSIONS.length].id,
    faceDetail: engine.FACIAL_DETAILS[index % engine.FACIAL_DETAILS.length].id,
    outfit: engine.OUTFITS[index % engine.OUTFITS.length].id,
    outfitTier: engine.OUTFIT_TIERS[index % engine.OUTFIT_TIERS.length].id,
    outfitColor: engine.OUTFIT_COLORS[index % engine.OUTFIT_COLORS.length].id,
  },
}));
check(characterKit.COMPLETE_CHARACTER_KIT_FORMAT === '8-bit-sprite-assembler-complete-character-kit', 'complete character kits must expose a stable format id');
check(characterKit.COMPLETE_CHARACTER_KIT_VERSION === 10, 'complete character kits must use the expanded species component schema');
check(characterKit.COMPLETE_CHARACTER_KIT_RECIPE_LIMIT === 24, 'complete character kits must support up to 24 deduplicated recipes');
check(characterKit.COMPLETE_CHARACTER_PACK_FORMAT === '8-bit-sprite-assembler-complete-character-pack', 'combined complete packs must expose a distinct stable format id');
check(characterKit.COMPLETE_CHARACTER_PACK_VERSION === 10, 'combined complete packs must use the expanded species component schema');
check(
  JSON.stringify(characterKit.COMPLETE_CHARACTER_KIT_LAYER_ORDER) === JSON.stringify([
    'weapon-back', 'shield-back', 'species-back', 'outfit-back', 'outfit', 'skin-body', 'head',
    'expression', 'species-front', 'face-detail', 'hair', 'headgear', 'shield-front', 'weapon-front',
  ]),
  'complete character kits must publish the exact atomic component draw order',
);
const completeKitPlan = characterKit.buildCompleteCharacterKitPlan(rosterKitEntries);
check(completeKitPlan.recipes.length === 24, 'complete character kits must retain 24 saved characters as lightweight recipes');
check(
  completeKitPlan.counts.componentPngs === 1910
    && completeKitPlan.counts.enemyFamilies === 57
    && completeKitPlan.counts.enemySheets === 202
    && completeKitPlan.counts.effectCategories === 4
    && completeKitPlan.counts.effectSheets === 24
    && completeKitPlan.counts.totalPngs === 2137,
  'complete character kits must contain 1910 content-unique components, 202 enemies, 24 synchronized effects, and one reference preview',
);
check(completeKitPlan.components.skinBodies.length === 6, 'complete kits must store each skin-body component once');
check(completeKitPlan.components.heads.length === 12, 'complete kits must store normal and shaded heads for all six skins');
check(completeKitPlan.components.hair.length === 119, 'complete kits must collapse visually identical under-headgear hair variants');
check(completeKitPlan.components.expressions.length === 6, 'complete kits must store each animated expression exactly once');
check(completeKitPlan.components.faceDetails.length === 30, 'complete kits must store only the color-dependent facial-detail variants');
check(completeKitPlan.components.speciesBack.length === 20 && completeKitPlan.components.speciesFront.length === 40, 'complete kits must store only the color-dependent species back/front variants');
const dwarfRecipe = completeKitPlan.recipes.find((recipe) => recipe.spec.species === 'dwarf');
const undeadRecipe = completeKitPlan.recipes.find((recipe) => recipe.spec.species === 'undead');
const lizardfolkRecipe = completeKitPlan.recipes.find((recipe) => recipe.spec.species === 'lizardfolk');
const beastkinRecipe = completeKitPlan.recipes.find((recipe) => recipe.spec.species === 'beastkin');
check(
  dwarfRecipe?.components.speciesBack === null
    && dwarfRecipe?.components.speciesFront === `components/species/dwarf/front/${dwarfRecipe.spec.skin}.png`,
  'Dwarf recipes must select the matching skin-dependent front component without a back pass',
);
check(
  undeadRecipe?.components.speciesBack === null
    && undeadRecipe?.components.speciesFront === 'components/species/undead/front/default.png',
  'Undead recipes must select the fixed-color skull component without a back pass',
);
check(
  lizardfolkRecipe?.components.speciesBack === `components/species/lizardfolk/back/${lizardfolkRecipe.spec.skin}.png`
    && lizardfolkRecipe?.components.speciesFront === `components/species/lizardfolk/front/${lizardfolkRecipe.spec.skin}.png`,
  'Lizardfolk recipes must select matching skin-dependent front and tail components',
);
check(
  beastkinRecipe?.components.speciesBack === `components/species/beastkin/back/${beastkinRecipe.spec.hairColor}.png`
    && beastkinRecipe?.components.speciesFront === `components/species/beastkin/front/${beastkinRecipe.spec.hairColor}.png`,
  'Beastkin recipes must select matching hair-dependent fur and tail components',
);
check(
  completeKitPlan.components.speciesBack.find((entry) => entry.species === 'beastkin' && entry.variant === 'blue')?.spec.hairColor === 'blue'
    && completeKitPlan.components.speciesFront.find((entry) => entry.species === 'lizardfolk' && entry.variant === 'orc')?.spec.skin === 'orc',
  'species component render specs must preserve their hair- or skin-color variant axis',
);
check(completeKitPlan.components.outfits.length === 1020 && completeKitPlan.components.outfitBack.length === 140, 'complete kits must cover all nine outfits, four body builds, and five armor tiers while omitting fixed-color duplicates');
check(completeKitPlan.components.headgear.length === 41, 'complete kits must avoid duplicate fixed-color headgear sheets');
check(completeKitPlan.components.weapons.length === 75 && completeKitPlan.components.shields.length === 326, 'complete kits must store every five-tier weapon and shield family while omitting visually identical color passes');
check(
  completeKitPlan.components.shields.filter((entry) => entry.tier === 'tier5').length === 46
    && completeKitPlan.components.shields.filter((entry) => entry.tier === 'tier5' && entry.color === 'default').length === 11,
  'Tier 5 shield components must collapse the four artifact passes whose colors are fully overwritten',
);
const completeEnemyEntries = completeKitPlan.enemies.flatMap((family) => family.variants);
check(completeKitPlan.enemies.length === 57 && completeEnemyEntries.length === 202, 'complete kits must plan every enemy family and variation');
check(
  completeKitPlan.enemies.every((family) => family.variants.every((entry) => (
    entry.file === `enemies/${family.family}/${entry.id}.png`
      && entry.spec.kind === 'enemy'
      && entry.spec.family === family.family
      && entry.spec.variant === entry.id
  ))),
  'complete-kit enemies must use stable family folders and exact render specifications',
);
const completeEffectEntries = completeKitPlan.effects.flatMap((category) => category.effects);
check(completeKitPlan.effects.length === 4 && completeEffectEntries.length === 24, 'complete kits must plan all four combat-effect groups and 24 overlays');
check(
  completeKitPlan.effects.every((category) => category.effects.every((entry) => (
    entry.file === `effects/${category.category}/${entry.id}.png`
      && entry.spec.kind === 'effect'
      && entry.spec.category === category.category
      && entry.spec.effect === entry.id
  ))),
  'complete-kit effects must use stable category folders and exact overlay specifications',
);
const completeKitPaths = [
  ...completeKitPlan.components.skinBodies.map((entry) => entry.file),
  ...completeKitPlan.components.heads.map((entry) => entry.file),
  ...completeKitPlan.components.hair.map((entry) => entry.file),
  ...completeKitPlan.components.expressions.map((entry) => entry.file),
  ...completeKitPlan.components.faceDetails.map((entry) => entry.file),
  ...completeKitPlan.components.speciesBack.map((entry) => entry.file),
  ...completeKitPlan.components.speciesFront.map((entry) => entry.file),
  ...completeKitPlan.components.outfitBack.map((entry) => entry.file),
  ...completeKitPlan.components.outfits.map((entry) => entry.file),
  ...completeKitPlan.components.headgear.map((entry) => entry.file),
  ...completeKitPlan.components.weapons.flatMap((entry) => [entry.files.back, entry.files.front]),
  ...completeKitPlan.components.shields.map((entry) => entry.file),
  ...completeEnemyEntries.map((entry) => entry.file),
  ...completeEffectEntries.map((entry) => entry.file),
  completeKitPlan.reference.file,
];
check(new Set(completeKitPaths).size === 2137, 'every Complete Character Kit PNG path must be unique');
check(completeKitPlan.recipes.every((recipe) => !Object.values(recipe.components).some((file) => file && !completeKitPaths.includes(file))), 'every saved recipe must reference only shared component paths');
check(runtimeSources['engine/renderer.js'].includes("renderLayer === 'weapon-back'") && runtimeSources['engine/renderer.js'].includes("renderLayer === 'weapon-front'"), 'the renderer must expose separate weapon occlusion passes');
check(runtimeSources['engine/renderer.js'].includes("renderLayer === 'shield-back'") && runtimeSources['engine/renderer.js'].includes("renderLayer === 'shield-front'"), 'the renderer must expose separate shield occlusion passes');
check(runtimeSources['engine/renderer.js'].includes("renderLayer === 'species-back'") && runtimeSources['engine/renderer.js'].includes("renderLayer === 'species-front'"), 'the renderer must expose separate species occlusion passes');
check(internalCatalogs.WOOD.length >= 3, 'shield highlights must not clear assembled body pixels through a missing wood color');
check((runtimeSources['engine/sheets.js'].match(/\.\.\.opts, shadow: opts\.shadow === true/g) || []).length === 3, 'every sheet builder must forward layer options while keeping shadows opt-in');
check(runtimeSources['app.js'].includes('function downloadMasterCharacterKit('), 'app.js must expose one-click Complete Character Kit export');
check(runtimeSources['app.js'].includes('function downloadPackMasterKit('), 'character packs must export one combined Complete Character Pack');
check(runtimeSources['app.js'].includes('function completeCharacterKitManifest('), 'Complete Character Kit downloads must include a game-facing component manifest');
check(runtimeSources['app.js'].includes('function renderCompleteCharacterKitPngs('), 'Complete Character Kit downloads must route every component group through one renderer');
check(runtimeSources['app.js'].includes("advance('Rendering native enemy sheets.')"), 'Complete Character Kits must render the planned native enemy library');
check(runtimeSources['app.js'].includes("advance('Rendering synchronized combat-effect overlays.')"), 'Complete Character Kits must render the planned combat-effect library');
check(runtimeSources['app.js'].includes('function renderReadyPackCharacters('), 'Complete Character Packs must include ready-to-use assembled character sheets');
check(runtimeSources['app.js'].includes('includeReference: false'), 'combined packs must reuse a ready character as the reference instead of duplicating its PNG');
check(runtimeSources['app.js'].includes('MASTER_CHARACTER_KIT_SCALE, { layer }'), 'Complete Character Kits must render every requested compositing layer at native scale');
check(runtimeSources['app.js'].includes("-complete-character-kit.zip`"), 'Complete Character Kit downloads must use an unambiguous filename');
check(runtimeSources['app.js'].includes("-complete-character-pack.zip`"), 'combined Complete Character Pack downloads must use an unambiguous filename');
check(!runtimeSources['app.js'].includes('buildMasterRosterKitPlan'), 'the app must not expose the duplicate-heavy roster body-matrix exporter');
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
const expectedBodyBuilds = ['classic', 'lean', 'sturdy', 'heroic'];
check(JSON.stringify(engine.BODY_BUILDS.map((build) => build.id)) === JSON.stringify(expectedBodyBuilds), 'the player body-build catalog must retain its stable ids and Classic default');
check(runtimeSources['app.js'].includes('validId(E.BODY_BUILDS, player.bodyBuild'), 'saved player specs must safely migrate missing or invalid body builds');
check(runtimeSources['app.js'].includes("'Body build'"), 'the player editor must expose a dedicated body-build control');
check(runtimeSources['engine/generators.js'].includes('bodyBuild: rnd(BODY_BUILDS).id'), 'random players must choose a valid body build');
check(runtimeSources['engine/renderer.js'].includes("bodyBuild: spec.bodyBuild || 'classic'"), 'legacy player specs must render with the Classic build');
const expectedSpecies = ['human', 'elf', 'orc', 'goblin', 'tiefling', 'celestial', 'dwarf', 'undead', 'lizardfolk', 'beastkin'];
check(JSON.stringify(engine.SPECIES.map((species) => species.id)) === JSON.stringify(expectedSpecies), 'the player species catalog must retain its stable ids and Human default');
check(runtimeSources['app.js'].includes('validId(E.SPECIES, player.species'), 'saved player specs must safely migrate missing or invalid species');
check(runtimeSources['app.js'].includes("'Species'"), 'the player editor must expose a dedicated species control');
check(runtimeSources['engine/generators.js'].includes('species: rnd(SPECIES).id'), 'random players must choose a valid species');
check(runtimeSources['engine/renderer.js'].includes("species: spec.species || 'human'"), 'legacy player specs must render as Human');
const expectedFacialDetails = ['none', 'beard', 'mustache', 'scar', 'eyepatch', 'glasses', 'blush', 'warpaint'];
check(
  JSON.stringify(engine.FACIAL_DETAILS.map((detail) => detail.id)) === JSON.stringify(expectedFacialDetails),
  'the facial-detail catalog must preserve its validated option ids and default ordering',
);
check(runtimeSources['app.js'].includes("validId(E.FACIAL_DETAILS, player.faceDetail"), 'saved player specs must safely migrate missing or invalid facial details');
check(runtimeSources['engine/renderer.js'].includes("detail: spec.faceDetail || 'none'"), 'the renderer must keep legacy player specs visually compatible');
const expectedExpressions = ['neutral', 'happy', 'angry', 'sad', 'surprised', 'determined'];
check(
  JSON.stringify(engine.EXPRESSIONS.map((expression) => expression.id)) === JSON.stringify(expectedExpressions),
  'the expression catalog must preserve its stable ids and Neutral default ordering',
);
check(runtimeSources['app.js'].includes('validId(E.EXPRESSIONS, player.expression'), 'saved player specs must safely migrate missing or invalid expressions');
check(runtimeSources['app.js'].includes("'Expression'"), 'the player editor must expose a dedicated expression control');
check(runtimeSources['engine/generators.js'].includes('expression: rnd(EXPRESSIONS).id'), 'random players must choose a valid expression');
check(runtimeSources['engine/renderer.js'].includes("expression: spec.expression || 'neutral'"), 'legacy player specs must render with the Neutral expression');
const expectedHairStyles = ['bald', 'short', 'spiky', 'bowl', 'long', 'ponytail', 'mohawk', 'braids', 'afro', 'topknot', 'messy'];
check(
  JSON.stringify(engine.HAIR_STYLES.map((style) => style.id)) === JSON.stringify(expectedHairStyles),
  'the hair catalog must preserve its seven legacy ids followed by the four expanded styles',
);
const expectedHeadgear = ['none', 'cap', 'helm', 'fullhelm', 'hood', 'crown', 'wizard', 'horns', 'bandana', 'circlet', 'plumed', 'skullmask'];
check(
  JSON.stringify(engine.HEADGEAR.map((gear) => gear.id)) === JSON.stringify(expectedHeadgear),
  'the headgear catalog must preserve its eight legacy ids followed by the four expanded options',
);
check(runtimeSources['app.js'].includes('validId(E.HAIR_STYLES, player.hairStyle'), 'saved player specs must validate expanded hairstyles through the stable catalog');
check(runtimeSources['app.js'].includes('validId(E.HEADGEAR, player.headgear'), 'saved player specs must validate expanded headgear through the stable catalog');
check(runtimeSources['engine/generators.js'].includes('hairStyle: rnd(HAIR_STYLES).id'), 'random players must include the expanded hairstyle catalog');
check(runtimeSources['engine/generators.js'].includes('headgear: rnd(HEADGEAR).id'), 'random players must include the expanded headgear catalog');
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
const expectedOutfits = ['tunic', 'leather', 'plate', 'robe', 'cape', 'barbarian', 'ranger', 'cleric', 'necromancer'];
check(
  JSON.stringify(engine.OUTFITS.map((outfit) => outfit.id)) === JSON.stringify(expectedOutfits),
  'the outfit catalog must preserve its five legacy ids followed by the four expanded RPG families',
);
check(runtimeSources['app.js'].includes('validId(E.OUTFITS, player.outfit'), 'saved player specs must validate expanded outfits through the stable catalog');
check(runtimeSources['engine/generators.js'].includes('outfit: rnd(OUTFITS).id'), 'random players must include the expanded outfit catalog');
check(engine.OUTFITS.every((outfit) => ['tier2Name', 'tier3Name', 'tier4Name', 'tier5Name'].every((key) => typeof outfit[key] === 'string')), 'every outfit must declare named RPG upgrades through Tier 5');
check(JSON.stringify(engine.OUTFIT_TIERS.map((tier) => tier.id)) === JSON.stringify(['tier1', 'tier2', 'tier3', 'tier4', 'tier5']), 'the armor tier catalog must expose stable Tier 1 through Tier 5 ids');
check(runtimeSources['app.js'].includes('validId(E.OUTFIT_TIERS, player.outfitTier'), 'saved player specs must safely migrate missing or invalid armor tiers');
check(runtimeSources['app.js'].includes("'Armor tier'"), 'the player editor must expose a dedicated armor tier control');
check(runtimeSources['engine/generators.js'].includes('outfitTier: rnd(OUTFIT_TIERS).id'), 'random players must choose a valid armor tier');
check(runtimeSources['engine/renderer.js'].includes('function drawOutfitTier('), 'the humanoid renderer must apply visible armor-tier upgrade layers');
const expectedShields = ['none', 'round', 'kite', 'buckler', 'heater', 'tower', 'oval', 'bone', 'arcane'];
check(
  JSON.stringify(engine.SHIELDS.map((shield) => shield.id)) === JSON.stringify(expectedShields),
  'the shield catalog must expose none plus all eight validated shield families in stable order',
);
check(engine.SHIELDS.filter((shield) => shield.id !== 'none').every((shield) => typeof shield.tier2Name === 'string'), 'every equipped shield must declare an RPG-style Tier 2 name');
check(engine.SHIELDS.filter((shield) => shield.id !== 'none').every((shield) => typeof shield.tier3Name === 'string'), 'every equipped shield must declare a legendary Tier 3 name');
check(engine.SHIELDS.filter((shield) => shield.id !== 'none').every((shield) => typeof shield.tier4Name === 'string'), 'every equipped shield must declare a mythic Tier 4 name');
check(engine.SHIELDS.filter((shield) => shield.id !== 'none').every((shield) => typeof shield.tier5Name === 'string'), 'every equipped shield must declare an artifact Tier 5 name');
check(JSON.stringify(engine.SHIELD_TIERS.map((tier) => tier.id)) === JSON.stringify(['tier1', 'tier2', 'tier3', 'tier4', 'tier5']), 'the shield tier catalog must expose stable Tier 1 through Tier 5 ids');
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
check(runtimeSources['engine/shield-renderer.js'].includes("tier === 'tier5'"), 'the shield renderer must apply the artifact Tier 5 upgrade layer');
check(runtimeSources['engine/shield-renderer.js'].includes("d === 'up' ? 'behind' : 'front'"), 'shield layering must place back-view shields behind the humanoid body');

function renderPixels(spec, dir, animId, frame, opts = {}) {
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
  engine.drawSprite(ctx, spec, dir, animId, frame, { ...opts, shadow: false });
  return pixels;
}

const speciesProbe = {
  kind: 'player', species: 'human', bodyBuild: 'classic', skin: 'orc', hairStyle: 'bald', hairColor: 'brown',
  faceDetail: 'glasses', headgear: 'none', outfit: 'tunic', outfitTier: 'tier1', outfitColor: 'royal',
  weapon: 'none', weaponTier: 'tier1', shield: 'none', shieldTier: 'tier1', palette: null,
};
const speciesSignatures = new Map();
for (const species of engine.SPECIES) {
  const frames = [];
  for (const dir of engine.DIRS) {
    for (const anim of engine.ANIMS) {
      for (let frame = 0; frame < anim.frames; frame++) {
        const spec = { ...speciesProbe, species: species.id };
        const complete = renderPixels(spec, dir, anim.id, frame);
        frames.push(complete.join(','));
        const back = renderPixels(spec, dir, anim.id, frame, { layer: 'species-back' });
        const front = renderPixels(spec, dir, anim.id, frame, { layer: 'species-front' });
        if (species.id === 'human') {
          check(back.every((pixel) => pixel === null) && front.every((pixel) => pixel === null), 'Human species layers must stay empty for legacy pixel parity');
          const legacySpec = { ...spec };
          delete legacySpec.species;
          check(JSON.stringify(complete) === JSON.stringify(renderPixels(legacySpec, dir, anim.id, frame)), 'an omitted species field must remain pixel-identical to Human');
        } else {
          const expectsBack = ['tiefling', 'celestial', 'lizardfolk', 'beastkin'].includes(species.id);
          check(front.some((pixel) => pixel !== null), `${species.name} must expose visible animated front species pixels in ${dir} ${anim.id} frame ${frame}`);
          check(back.some((pixel) => pixel !== null) === expectsBack, `${species.name} must expose only its intended back species pass in ${dir} ${anim.id} frame ${frame}`);
        }
      }
    }
  }
  speciesSignatures.set(species.id, frames.join('|'));
}
check(new Set(speciesSignatures.values()).size === engine.SPECIES.length, 'all ten player species must remain visually distinct across the complete animation set');
for (const speciesId of expectedSpecies.slice(1)) {
  const hidden = renderPixels({ ...speciesProbe, species: speciesId, headgear: 'fullhelm' }, 'down', 'idle', 0, { layer: 'species-front' });
  check(hidden.every((pixel) => pixel === null), `${speciesId} front traits must hide beneath a full helmet`);
}

for (const speciesId of ['lizardfolk', 'beastkin']) {
  for (const animId of ['walk', 'attack']) {
    const anim = engine.ANIMS.find((entry) => entry.id === animId);
    const tailFrames = Array.from({ length: anim.frames }, (_, frame) => (
      renderPixels({ ...speciesProbe, species: speciesId }, 'down', animId, frame, { layer: 'species-back' }).join(',')
    ));
    check(new Set(tailFrames).size > 1, `${speciesId} tail must follow the ${animId} animation rig`);
  }
}

const dwarfPeach = renderPixels({ ...speciesProbe, species: 'dwarf', skin: 'peach' }, 'down', 'idle', 0, { layer: 'species-front' });
const dwarfOrc = renderPixels({ ...speciesProbe, species: 'dwarf', skin: 'orc' }, 'down', 'idle', 0, { layer: 'species-front' });
const lizardPeach = renderPixels({ ...speciesProbe, species: 'lizardfolk', skin: 'peach' }, 'down', 'idle', 0, { layer: 'species-back' });
const lizardOrc = renderPixels({ ...speciesProbe, species: 'lizardfolk', skin: 'orc' }, 'down', 'idle', 0, { layer: 'species-back' });
check(JSON.stringify(dwarfPeach) !== JSON.stringify(dwarfOrc), 'Dwarf head traits must follow the selected skin palette');
check(JSON.stringify(lizardPeach) !== JSON.stringify(lizardOrc), 'Lizardfolk scales and tail must follow the selected skin palette');

const beastBrownFront = renderPixels({ ...speciesProbe, species: 'beastkin', hairColor: 'brown' }, 'down', 'idle', 0, { layer: 'species-front' });
const beastBlueFront = renderPixels({ ...speciesProbe, species: 'beastkin', hairColor: 'blue' }, 'down', 'idle', 0, { layer: 'species-front' });
const beastBrownBack = renderPixels({ ...speciesProbe, species: 'beastkin', hairColor: 'brown' }, 'down', 'idle', 0, { layer: 'species-back' });
const beastBlueBack = renderPixels({ ...speciesProbe, species: 'beastkin', hairColor: 'blue' }, 'down', 'idle', 0, { layer: 'species-back' });
check(JSON.stringify(beastBrownFront) !== JSON.stringify(beastBlueFront) && JSON.stringify(beastBrownBack) !== JSON.stringify(beastBlueBack), 'Beastkin ears, muzzle, and tail must follow the selected hair palette');

const undeadWarm = renderPixels({ ...speciesProbe, species: 'undead', skin: 'peach', hairColor: 'brown' }, 'down', 'idle', 0, { layer: 'species-front' });
const undeadCool = renderPixels({ ...speciesProbe, species: 'undead', skin: 'orc', hairColor: 'blue' }, 'down', 'idle', 0, { layer: 'species-front' });
check(JSON.stringify(undeadWarm) === JSON.stringify(undeadCool), 'Undead skull and bone traits must use one stable fixed-color component');

const expressionProbe = {
  ...speciesProbe,
  species: 'human',
  expression: 'neutral',
  faceDetail: 'none',
  headgear: 'none',
};
const expressionSignatures = new Map();
for (const expression of engine.EXPRESSIONS) {
  const frames = [];
  for (const dir of engine.DIRS) {
    for (const anim of engine.ANIMS) {
      for (let frame = 0; frame < anim.frames; frame++) {
        const spec = { ...expressionProbe, expression: expression.id };
        const layer = renderPixels(spec, dir, anim.id, frame, { layer: 'expression' });
        frames.push(layer.join(','));
        if (dir === 'up') {
          check(layer.every((pixel) => pixel === null), `${expression.name} must remain hidden on the back-facing head`);
        } else {
          check(layer.some((pixel) => pixel !== null), `${expression.name} must remain readable in ${dir} ${anim.id} frame ${frame}`);
        }
        if (expression.id === 'neutral') {
          const legacySpec = { ...spec };
          delete legacySpec.expression;
          check(
            JSON.stringify(renderPixels(spec, dir, anim.id, frame)) === JSON.stringify(renderPixels(legacySpec, dir, anim.id, frame)),
            'an omitted expression field must remain pixel-identical to Neutral',
          );
        }
      }
    }
  }
  const hidden = renderPixels({ ...expressionProbe, expression: expression.id, headgear: 'fullhelm' }, 'down', 'idle', 0, { layer: 'expression' });
  check(hidden.every((pixel) => pixel === null), `${expression.name} must hide beneath a full helmet`);
  expressionSignatures.set(expression.id, frames.join('|'));
}
check(new Set(expressionSignatures.values()).size === engine.EXPRESSIONS.length, 'all six expressions must remain visually distinct across the complete animation set');

const hairProbe = {
  ...expressionProbe,
  skin: 'peach',
  hairStyle: 'short',
  hairColor: 'blue',
  expression: 'neutral',
  headgear: 'none',
};
const hairSignatures = new Map();
for (const style of engine.HAIR_STYLES) {
  const frames = [];
  for (const dir of engine.DIRS) {
    for (const anim of engine.ANIMS) {
      for (let frame = 0; frame < anim.frames; frame++) {
        const layer = renderPixels({ ...hairProbe, hairStyle: style.id }, dir, anim.id, frame, { layer: 'hair' });
        frames.push(layer.join(','));
        check(
          layer.some((pixel) => pixel !== null) === (style.id !== 'bald'),
          `${style.name} must expose its intended hair layer in ${dir} ${anim.id} frame ${frame}`,
        );
      }
    }
  }
  hairSignatures.set(style.id, frames.join('|'));
}
check(new Set(hairSignatures.values()).size === engine.HAIR_STYLES.length, 'all eleven hairstyles must retain distinct complete animation signatures');

const underGearSignatures = new Map();
for (const styleId of ['braids', 'afro', 'messy']) {
  const frames = [];
  for (const dir of engine.DIRS) {
    for (const anim of engine.ANIMS) {
      for (let frame = 0; frame < anim.frames; frame++) {
        const layer = renderPixels({ ...hairProbe, hairStyle: styleId, headgear: 'plumed' }, dir, anim.id, frame, { layer: 'hair' });
        frames.push(layer.join(','));
        check(layer.some((pixel) => pixel !== null), `${styleId} must remain readable beneath headgear in ${dir} ${anim.id} frame ${frame}`);
      }
    }
  }
  underGearSignatures.set(styleId, frames.join('|'));
}
check(new Set(underGearSignatures.values()).size === 3, 'braids, afro, and messy hair must keep distinct under-headgear silhouettes');
for (const dir of engine.DIRS) {
  for (const anim of engine.ANIMS) {
    for (let frame = 0; frame < anim.frames; frame++) {
      const shortUnderGear = renderPixels({ ...hairProbe, hairStyle: 'short', headgear: 'plumed' }, dir, anim.id, frame, { layer: 'hair' });
      const topknotUnderGear = renderPixels({ ...hairProbe, hairStyle: 'topknot', headgear: 'plumed' }, dir, anim.id, frame, { layer: 'hair' });
      check(JSON.stringify(shortUnderGear) === JSON.stringify(topknotUnderGear), `topknot must collapse to the shared fitted hair pass in ${dir} ${anim.id} frame ${frame}`);
    }
  }
}

const expandedHeadgear = ['bandana', 'circlet', 'plumed', 'skullmask'];
const headgearSignatures = new Map();
for (const headgear of expandedHeadgear) {
  const frames = [];
  for (const dir of engine.DIRS) {
    for (const anim of engine.ANIMS) {
      for (let frame = 0; frame < anim.frames; frame++) {
        const layer = renderPixels({ ...hairProbe, hairStyle: 'braids', headgear }, dir, anim.id, frame, { layer: 'headgear' });
        frames.push(layer.join(','));
        check(layer.some((pixel) => pixel !== null), `${headgear} must remain visible in ${dir} ${anim.id} frame ${frame}`);
      }
    }
  }
  headgearSignatures.set(headgear, frames.join('|'));
}
check(new Set(headgearSignatures.values()).size === expandedHeadgear.length, 'all four expanded headgear options must retain distinct complete animation signatures');
for (const headgear of ['bandana', 'plumed']) {
  const royal = renderPixels({ ...hairProbe, headgear, outfitColor: 'royal' }, 'down', 'idle', 0, { layer: 'headgear' });
  const crimson = renderPixels({ ...hairProbe, headgear, outfitColor: 'crimson' }, 'down', 'idle', 0, { layer: 'headgear' });
  check(JSON.stringify(royal) !== JSON.stringify(crimson), `${headgear} must retain its catalog-color variants`);
}
for (const headgear of ['circlet', 'skullmask']) {
  const royal = renderPixels({ ...hairProbe, headgear, outfitColor: 'royal' }, 'down', 'idle', 0, { layer: 'headgear' });
  const crimson = renderPixels({ ...hairProbe, headgear, outfitColor: 'crimson' }, 'down', 'idle', 0, { layer: 'headgear' });
  check(JSON.stringify(royal) === JSON.stringify(crimson), `${headgear} must remain a fixed-color deduplicated component`);
}
for (const dir of ['down', 'left', 'right']) {
  for (const anim of engine.ANIMS) {
    for (let frame = 0; frame < anim.frames; frame++) {
      const maskedExpressions = engine.EXPRESSIONS.map((expression) => renderPixels({
        ...hairProbe,
        hairStyle: 'messy',
        expression: expression.id,
        headgear: 'skullmask',
      }, dir, anim.id, frame).join(','));
      check(new Set(maskedExpressions).size === 1, `skull mask must fully cover expressions in ${dir} ${anim.id} frame ${frame}`);
    }
  }
}
check(
  JSON.stringify(renderPixels({ ...hairProbe, expression: 'neutral', headgear: 'circlet' }, 'down', 'idle', 0))
    !== JSON.stringify(renderPixels({ ...hairProbe, expression: 'happy', headgear: 'circlet' }, 'down', 'idle', 0)),
  'the circlet must preserve readable facial expressions',
);

const bodyBuildSignatures = new Map();
for (const bodyBuild of engine.BODY_BUILDS) {
  const frames = [];
  for (const dir of engine.DIRS) {
    for (const anim of engine.ANIMS) {
      for (let frame = 0; frame < anim.frames; frame++) {
        const spec = { ...speciesProbe, bodyBuild: bodyBuild.id, outfit: 'tunic', outfitTier: 'tier1' };
        const outfitPixels = renderPixels(spec, dir, anim.id, frame, { layer: 'outfit' });
        frames.push(outfitPixels.join(','));
        if (bodyBuild.id === 'classic') {
          const legacySpec = { ...spec };
          delete legacySpec.bodyBuild;
          check(
            JSON.stringify(renderPixels(spec, dir, anim.id, frame)) === JSON.stringify(renderPixels(legacySpec, dir, anim.id, frame)),
            'an omitted body-build field must remain pixel-identical to Classic',
          );
        } else {
          const classicPixels = renderPixels({ ...spec, bodyBuild: 'classic' }, dir, anim.id, frame, { layer: 'outfit' });
          check(
            JSON.stringify(outfitPixels) !== JSON.stringify(classicPixels),
            `${bodyBuild.name} must expose a distinct outfit silhouette in ${dir} ${anim.id} frame ${frame}`,
          );
        }
      }
    }
  }
  bodyBuildSignatures.set(bodyBuild.id, frames.join('|'));
}
check(new Set(bodyBuildSignatures.values()).size === engine.BODY_BUILDS.length, 'all four body builds must remain visually distinct across the complete animation set');
for (const outfit of engine.OUTFITS) {
  for (const tier of engine.OUTFIT_TIERS) {
    const buildLayerSignatures = engine.BODY_BUILDS.map((bodyBuild) => engine.DIRS.flatMap((dir) => (
      engine.ANIMS.flatMap((anim) => Array.from({ length: anim.frames }, (_, frame) => renderPixels(
        { ...speciesProbe, bodyBuild: bodyBuild.id, outfit: outfit.id, outfitTier: tier.id },
        dir,
        anim.id,
        frame,
        { layer: 'outfit' },
      ).join(',')))
    )).join('|'));
    check(
      new Set(buildLayerSignatures).size === engine.BODY_BUILDS.length,
      `${outfit.id} ${tier.id} must retain four content-distinct body-build outfit components`,
    );
  }
}
const expandedOutfitIds = ['barbarian', 'ranger', 'cleric', 'necromancer'];
for (const tier of engine.OUTFIT_TIERS) {
  const outfitSignatures = engine.OUTFITS.map((outfit) => engine.DIRS.flatMap((dir) => (
    engine.ANIMS.flatMap((anim) => Array.from({ length: anim.frames }, (_, frame) => renderPixels(
      { ...speciesProbe, bodyBuild: 'classic', outfit: outfit.id, outfitTier: tier.id, outfitColor: 'royal' },
      dir,
      anim.id,
      frame,
      { layer: 'outfit' },
    ).join(',')))
  )).join('|'));
  check(
    new Set(outfitSignatures).size === engine.OUTFITS.length,
    `all nine outfit families must retain distinct complete animation signatures at ${tier.id}`,
  );
}
for (const outfitId of expandedOutfitIds) {
  for (const dir of engine.DIRS) {
    const royal = renderPixels({ ...speciesProbe, outfit: outfitId, outfitTier: 'tier1', outfitColor: 'royal' }, dir, 'idle', 0, { layer: 'outfit' });
    const crimson = renderPixels({ ...speciesProbe, outfit: outfitId, outfitTier: 'tier1', outfitColor: 'crimson' }, dir, 'idle', 0, { layer: 'outfit' });
    check(JSON.stringify(royal) !== JSON.stringify(crimson), `${outfitId} must retain catalog outfit colors while facing ${dir}`);

    for (const animationId of ['idle', 'walk', 'attack']) {
      const animation = engine.ANIMS.find((entry) => entry.id === animationId);
      const frames = Array.from({ length: animation.frames }, (_, frame) => renderPixels(
        { ...speciesProbe, outfit: outfitId, outfitTier: 'tier1', outfitColor: 'royal' },
        dir,
        animationId,
        frame,
        { layer: 'outfit' },
      ).join(','));
      check(new Set(frames).size >= 2, `${outfitId} must follow ${animationId} body motion while facing ${dir}`);
    }
  }
}
for (const tier of engine.OUTFIT_TIERS) {
  const capeBuildSignatures = engine.BODY_BUILDS.map((bodyBuild) => engine.ANIMS.flatMap((anim) => (
    Array.from({ length: anim.frames }, (_, frame) => renderPixels(
      { ...speciesProbe, bodyBuild: bodyBuild.id, outfit: 'cape', outfitTier: tier.id },
      'right',
      anim.id,
      frame,
      { layer: 'outfit-back' },
    ).join(','))
  )).join('|'));
  check(
    new Set(capeBuildSignatures).size === engine.BODY_BUILDS.length,
    `cape ${tier.id} must retain four content-distinct body-build back components`,
  );
}

check(engine.CLASS_PACK_FORMAT === '8-bit-sprite-assembler-class-pack', 'class packs must expose a stable game-facing format id');
check(engine.CLASS_PACK_VERSION === 1, 'class packs must use an explicit schema version');
check(engine.DEFAULT_CLASS_TEMPLATE === 'warrior', 'Warrior must remain the safe default class template');
check(
  JSON.stringify(engine.CLASS_TEMPLATES.map((template) => template.id))
    === JSON.stringify(['warrior', 'guardian', 'ranger', 'rogue', 'mage', 'cleric', 'barbarian', 'necromancer', 'paladin', 'druid']),
  'class templates must retain their six legacy ids followed by the four expanded RPG roles',
);
const classFixturePlayer = {
  ...masterKitPlayer,
  species: 'tiefling',
  bodyBuild: 'heroic',
  skin: 'orc',
  hairStyle: 'mohawk',
  hairColor: 'pink',
  expression: 'angry',
  faceDetail: 'warpaint',
  headgear: 'crown',
  outfitColor: 'teal',
  palette: { skin: ['#123456', '#234567'], hair: ['#345678', '#456789'], outfit: ['#56789a', '#6789ab'] },
};
const expectedClassCounts = new Map([
  ['warrior', 54],
  ['guardian', 54],
  ['ranger', 29],
  ['rogue', 29],
  ['mage', 24],
  ['cleric', 39],
  ['barbarian', 24],
  ['necromancer', 34],
  ['paladin', 39],
  ['druid', 34],
]);
for (const template of engine.CLASS_TEMPLATES) {
  check(engine.OUTFITS.some((outfit) => outfit.id === template.outfit), `${template.id} must reference a valid outfit`);
  check(template.weapons.includes(template.defaultWeapon), `${template.id} default weapon must belong to its weapon list`);
  check(template.defaultShield === 'none' || template.shields.includes(template.defaultShield), `${template.id} default shield must belong to its shield list`);
  check(template.weapons.every((id) => engine.WEAPONS.some((weapon) => weapon.id === id && id !== 'none')), `${template.id} must reference only equipped weapon ids`);
  check(template.shields.every((id) => engine.SHIELDS.some((shield) => shield.id === id && id !== 'none')), `${template.id} must reference only equipped shield ids`);
  check(new Set(template.weapons).size === template.weapons.length, `${template.id} must not repeat weapon families`);
  check(new Set(template.shields).size === template.shields.length, `${template.id} must not repeat shield families`);

  const applied = engine.applyClassTemplate(classFixturePlayer, template.id);
  check(
    applied.species === classFixturePlayer.species
      && applied.bodyBuild === classFixturePlayer.bodyBuild
      && applied.skin === classFixturePlayer.skin
      && applied.hairStyle === classFixturePlayer.hairStyle
      && applied.hairColor === classFixturePlayer.hairColor
      && applied.expression === classFixturePlayer.expression
      && applied.faceDetail === classFixturePlayer.faceDetail
      && applied.headgear === classFixturePlayer.headgear
      && applied.outfitColor === classFixturePlayer.outfitColor
      && JSON.stringify(applied.palette) === JSON.stringify(classFixturePlayer.palette),
    `${template.id} defaults must preserve the source character identity and custom palette`,
  );
  check(
    applied.outfit === template.outfit
      && applied.weapon === template.defaultWeapon
      && applied.weaponTier === 'tier1'
      && applied.shield === template.defaultShield
      && applied.shieldTier === 'tier1',
    `${template.id} must apply its class outfit and Tier 1 default equipment`,
  );

  const classPack = engine.buildClassPack(classFixturePlayer, template.id);
  check(classPack.template.id === template.id, `${template.id} class pack must retain its template`);
  check(classPack.variants.length === expectedClassCounts.get(template.id), `${template.id} must retain its bounded ready-sheet count`);
  check(new Set(classPack.variants.map((variant) => variant.id)).size === classPack.variants.length, `${template.id} must expose stable unique variant ids`);
  check(new Set(classPack.variants.map((variant) => JSON.stringify(variant.spec))).size === classPack.variants.length, `${template.id} must deduplicate identical complete specifications`);
  check(classPack.variants.every((variant) => (
    variant.spec.outfit === template.outfit
      && template.weapons.includes(variant.spec.weapon)
      && (variant.spec.shield === 'none' || template.shields.includes(variant.spec.shield))
      && variant.spec.species === classFixturePlayer.species
      && variant.spec.bodyBuild === classFixturePlayer.bodyBuild
      && variant.spec.skin === classFixturePlayer.skin
      && variant.spec.hairStyle === classFixturePlayer.hairStyle
      && variant.spec.expression === classFixturePlayer.expression
      && variant.spec.faceDetail === classFixturePlayer.faceDetail
  )), `${template.id} variants must stay inside their class equipment rules and preserve identity`);
}
const rangerClassEffects = new Set(engine.buildClassPack(classFixturePlayer, 'ranger').variants.flatMap((variant) => (
  engine.resolveCombatLoadout({ kind: 'player', ...variant.spec }, engine.DEFAULT_COMBAT_LOADOUT).slots
    .filter((slot) => slot.effect)
    .map((slot) => slot.effect)
)));
check(rangerClassEffects.has('arrow') && rangerClassEffects.has('crossbow-bolt'), 'Ranger class packs must resolve both ranged projectile families');
const mageClassEffects = new Set(engine.buildClassPack(classFixturePlayer, 'mage').variants.flatMap((variant) => (
  engine.resolveCombatLoadout({ kind: 'player', ...variant.spec }, engine.DEFAULT_COMBAT_LOADOUT).slots
    .filter((slot) => slot.effect)
    .map((slot) => slot.effect)
)));
check(mageClassEffects.has('fireball') && mageClassEffects.has('holy-orb') && mageClassEffects.has('shadow-shot'), 'Mage class packs must resolve all three magic projectile families');
const barbarianClassEffects = new Set(engine.buildClassPack(classFixturePlayer, 'barbarian').variants.flatMap((variant) => (
  engine.resolveCombatLoadout({ kind: 'player', ...variant.spec }, engine.DEFAULT_COMBAT_LOADOUT).slots
    .filter((slot) => slot.effect)
    .map((slot) => slot.effect)
)));
check(
  ['sword-slash', 'axe-cleave', 'spear-thrust', 'hammer-smash'].every((effect) => barbarianClassEffects.has(effect)),
  'Barbarian class packs must resolve every permitted melee attack family',
);
const necromancerClassEffects = new Set(engine.buildClassPack(classFixturePlayer, 'necromancer').variants.flatMap((variant) => (
  engine.resolveCombatLoadout({ kind: 'player', ...variant.spec }, engine.DEFAULT_COMBAT_LOADOUT).slots
    .filter((slot) => slot.effect)
    .map((slot) => slot.effect)
)));
check(
  ['fireball', 'holy-orb', 'shadow-shot'].every((effect) => necromancerClassEffects.has(effect)),
  'Necromancer class packs must resolve all three magic projectile families',
);
const paladinClassEffects = new Set(engine.buildClassPack(classFixturePlayer, 'paladin').variants.flatMap((variant) => (
  engine.resolveCombatLoadout({ kind: 'player', ...variant.spec }, engine.DEFAULT_COMBAT_LOADOUT).slots
    .filter((slot) => slot.effect)
    .map((slot) => slot.effect)
)));
check(
  paladinClassEffects.has('sword-slash') && paladinClassEffects.has('hammer-smash'),
  'Paladin class packs must resolve blade and crushing attack families',
);
const druidClassEffects = new Set(engine.buildClassPack(classFixturePlayer, 'druid').variants.flatMap((variant) => (
  engine.resolveCombatLoadout({ kind: 'player', ...variant.spec }, engine.DEFAULT_COMBAT_LOADOUT).slots
    .filter((slot) => slot.effect)
    .map((slot) => slot.effect)
)));
check(
  ['sword-slash', 'spear-thrust', 'fireball', 'holy-orb'].every((effect) => druidClassEffects.has(effect)),
  'Druid class packs must resolve both martial and magical attack families',
);

check(engine.VARIANT_BATCH_FORMAT === '8-bit-sprite-assembler-equipment-variant-batch', 'equipment batches must expose a stable game-facing format id');
check(engine.VARIANT_BATCH_VERSION === 1, 'equipment batches must use an explicit schema version');
check(engine.DEFAULT_VARIANT_BATCH_SET === 'rpg-equipment', 'the default equipment batch must be the deduplicated RPG collection');
check(
  JSON.stringify(engine.VARIANT_BATCH_SETS.map((set) => set.id))
    === JSON.stringify(['weapon-families', 'current-weapon-tiers', 'weapon-arsenal', 'armor-tiers', 'shield-armory', 'rpg-equipment']),
  'equipment batch presets must retain their stable ids and order',
);
const variantBatchPlayer = {
  ...masterKitPlayer,
  species: 'celestial',
  bodyBuild: 'lean',
  expression: 'determined',
  outfitTier: 'tier3',
  weapon: 'bow',
  weaponTier: 'tier3',
  shield: 'kite',
  shieldTier: 'tier3',
};
const expectedVariantBatchCounts = new Map([
  ['weapon-families', 16],
  ['current-weapon-tiers', 5],
  ['weapon-arsenal', 76],
  ['armor-tiers', 5],
  ['shield-armory', 41],
  ['rpg-equipment', 120],
]);
for (const set of engine.VARIANT_BATCH_SETS) {
  const batch = engine.buildVariantBatch(variantBatchPlayer, set.id);
  check(batch.set.id === set.id, `${set.id} must resolve its requested batch definition`);
  check(batch.variants.length === expectedVariantBatchCounts.get(set.id), `${set.id} must retain its bounded variant count`);
  check(new Set(batch.variants.map((variant) => JSON.stringify(variant.spec))).size === batch.variants.length, `${set.id} must deduplicate identical character specifications`);
  check(new Set(batch.variants.map((variant) => variant.id)).size === batch.variants.length, `${set.id} must expose stable unique variant ids`);
  check(batch.variants.every((variant) => (
    variant.spec.species === variantBatchPlayer.species
      && variant.spec.bodyBuild === variantBatchPlayer.bodyBuild
      && variant.spec.skin === variantBatchPlayer.skin
      && variant.spec.hairStyle === variantBatchPlayer.hairStyle
      && variant.spec.hairColor === variantBatchPlayer.hairColor
      && variant.spec.expression === variantBatchPlayer.expression
      && variant.spec.faceDetail === variantBatchPlayer.faceDetail
      && variant.spec.headgear === variantBatchPlayer.headgear
      && variant.spec.outfit === variantBatchPlayer.outfit
      && variant.spec.outfitColor === variantBatchPlayer.outfitColor
  )), `${set.id} must preserve the source character identity`);
}
check(
  engine.buildVariantBatch({ ...variantBatchPlayer, weapon: 'none', weaponTier: 'tier1' }, 'current-weapon-tiers').variants.length === 1,
  'an unarmed current-weapon batch must avoid five identical copies',
);
const fullVariantBatch = engine.buildVariantBatch(variantBatchPlayer, 'rpg-equipment');
const fullVariantEffects = new Set(fullVariantBatch.variants.flatMap((variant) => (
  engine.resolveCombatLoadout({ kind: 'player', ...variant.spec }, engine.DEFAULT_COMBAT_LOADOUT).slots
    .filter((slot) => slot.effect)
    .map((slot) => slot.file)
)));
check(fullVariantEffects.has('effects/projectiles/arrow.png'), 'the RPG equipment batch must resolve Bow projectiles');
check(fullVariantEffects.has('effects/projectiles/fireball.png'), 'the RPG equipment batch must resolve Staff projectiles');
check(fullVariantEffects.has('effects/trails/shield-block.png'), 'the RPG equipment batch must resolve unarmed shield blocks');

check(engine.COMBAT_EFFECTS.length === 4, 'combat effects must expose trails, projectiles, impacts, and statuses');
const combatEffectEntries = engine.COMBAT_EFFECTS.flatMap((category) => (
  category.effects.map((effect) => ({ category, effect }))
));
check(combatEffectEntries.length === 24, 'the combat-effects library must contain 24 synchronized overlays');
check(
  JSON.stringify(engine.COMBAT_EFFECTS.map((category) => category.effects.length)) === JSON.stringify([5, 7, 6, 6]),
  'combat-effect groups must retain the planned 5 trail, 7 projectile, 6 impact, and 6 status sheets',
);

check(engine.COMBAT_LOADOUT_FORMAT === '8-bit-sprite-assembler-combat-loadout', 'combat loadouts must expose a stable game-facing format id');
check(engine.COMBAT_LOADOUT_VERSION === 1, 'combat loadouts must use an explicit schema version');
check(
  JSON.stringify(engine.COMBAT_LOADOUT_SLOTS.map((slot) => `${slot.id}:${slot.category}`))
    === JSON.stringify(['trail:trails', 'projectile:projectiles', 'impact:impacts', 'status:statuses']),
  'combat loadouts must retain trail, projectile, impact, and status slots in draw order',
);
check(
  JSON.stringify(engine.sanitizeCombatLoadout({ trail: 'invalid', projectile: 'arrow', impact: 'none', status: 'burning' }))
    === JSON.stringify({ trail: 'auto', projectile: 'arrow', impact: 'none', status: 'burning' }),
  'combat loadout sanitization must preserve valid overrides and repair invalid selections',
);

const weaponLoadoutExpectations = new Map([
  ['none', ['shield-block', 'armor-impact']],
  ['sword', ['sword-slash', 'sparks']],
  ['greatsword', ['sword-slash', 'sparks']],
  ['scimitar', ['sword-slash', 'sparks']],
  ['rapier', ['spear-thrust', 'blood-hit']],
  ['dagger', ['sword-slash', 'blood-hit']],
  ['axe', ['axe-cleave', 'blood-hit']],
  ['mace', ['hammer-smash', 'armor-impact']],
  ['warhammer', ['hammer-smash', 'armor-impact']],
  ['spear', ['spear-thrust', 'blood-hit']],
  ['club', ['hammer-smash', 'armor-impact']],
  ['bow', ['arrow', 'blood-hit']],
  ['crossbow', ['crossbow-bolt', 'armor-impact']],
  ['staff', ['fireball', 'explosion']],
  ['wand', ['holy-orb', 'arcane-burst']],
  ['spellbook', ['shadow-shot', 'arcane-burst']],
]);
for (const weapon of engine.WEAPONS) {
  const spec = { kind: 'player', weapon: weapon.id, shield: 'round' };
  const effects = engine.resolveCombatLoadout(spec, engine.DEFAULT_COMBAT_LOADOUT).slots
    .filter((slot) => slot.effect)
    .map((slot) => slot.effect);
  check(
    JSON.stringify(effects) === JSON.stringify(weaponLoadoutExpectations.get(weapon.id)),
    `${weapon.id} must retain its automatic combat-effect mapping`,
  );
}
const overrideFixture = engine.resolveCombatLoadout(
  { kind: 'player', weapon: 'sword', shield: 'none' },
  { trail: 'hammer-smash', projectile: 'fireball', impact: 'none', status: 'frozen' },
);
check(
  JSON.stringify(overrideFixture.slots.map((slot) => slot.effect))
    === JSON.stringify(['hammer-smash', 'fireball', null, 'frozen']),
  'specific loadout overrides and explicit None selections must win over automatic weapon mappings',
);
for (const family of engine.ENEMIES) {
  for (const variant of family.variants) {
    const resolved = engine.resolveCombatLoadout(
      { kind: 'enemy', family: family.id, variant: variant.id },
      engine.DEFAULT_COMBAT_LOADOUT,
    );
    check(resolved.slots.some((slot) => slot.effect), `${family.id}/${variant.id} must resolve at least one automatic combat effect`);
    for (const slot of resolved.slots.filter((item) => item.effect)) {
      check(
        combatEffectEntries.some(({ category, effect }) => category.id === slot.category && effect.id === slot.effect),
        `${family.id}/${variant.id} resolves missing effect ${slot.category}/${slot.effect}`,
      );
      check(slot.file === `effects/${slot.category}/${slot.effect}.png`, `${family.id}/${variant.id} must resolve a stable modular effect path`);
    }
  }
}

for (const { category, effect } of combatEffectEntries) {
  const spec = { kind: 'effect', category: category.id, effect: effect.id };
  for (const dir of engine.DIRS) {
    const attackFrames = [0, 1, 2, 3].map((frame) => renderPixels(spec, dir, 'attack', frame));
    check(new Set(attackFrames.map((pixels) => pixels.join(','))).size === 4, `${category.id}/${effect.id} must use four distinct synchronized attack frames while facing ${dir}`);
    check(attackFrames.every((pixels) => pixels.filter(Boolean).length >= 3), `${category.id}/${effect.id} attack frames must remain visible while facing ${dir}`);
    for (const pixels of attackFrames) {
      check(!pixels.some((pixel, index) => {
        if (!pixel) return false;
        const x = index % engine.SIZE;
        const y = Math.floor(index / engine.SIZE);
        return x === 0 || y === 0 || x === engine.SIZE - 1 || y === engine.SIZE - 1;
      }), `${category.id}/${effect.id} must preserve a transparent outer pixel margin while facing ${dir}`);
    }

    if (category.id === 'statuses') {
      const idleFrames = [0, 1].map((frame) => renderPixels(spec, dir, 'idle', frame));
      check(idleFrames.every((pixels) => pixels.filter(Boolean).length >= 8), `${effect.id} status must remain visible outside attacks while facing ${dir}`);
      check(idleFrames[0].join(',') !== idleFrames[1].join(','), `${effect.id} status must animate during idle while facing ${dir}`);
    } else {
      for (const animId of ['idle', 'walk', 'hurt']) {
        check(renderPixels(spec, dir, animId, 0).every((pixel) => pixel === null), `${category.id}/${effect.id} must stay transparent during ${animId}`);
      }
    }
  }
}

for (const category of engine.COMBAT_EFFECTS) {
  const signatures = category.effects.map((effect) => renderPixels(
    { kind: 'effect', category: category.id, effect: effect.id },
    'down',
    'attack',
    2,
  ).join(','));
  check(new Set(signatures).size === category.effects.length, `${category.id} effects must remain visually distinct`);
}

const dedicatedEnemyFamilies = [
  'shroom', 'frog', 'crocodile', 'turtle', 'jellyfish',
  'centipede', 'carniplant', 'anglerfish', 'griffin',
  'mantis', 'moth', 'octopus', 'mole',
  'scarecrow', 'snail', 'porcupine', 'puppet',
];
for (const familyId of dedicatedEnemyFamilies) {
  const family = engine.ENEMIES.find((entry) => entry.id === familyId);
  check(Boolean(family), `${familyId} must be registered in the enemy catalog`);
  if (!family) continue;
  check(family.variants.length === 4, `${familyId} must ship four roster-ready variants`);

  for (const dir of engine.DIRS) {
    const variantSignatures = family.variants.map((variant) => renderPixels(
      { kind: 'enemy', family: familyId, variant: variant.id },
      dir,
      'idle',
      0,
    ).join(','));
    check(new Set(variantSignatures).size === family.variants.length, `${familyId} variants must remain visually distinct while facing ${dir}`);
  }

  for (const variant of family.variants) {
    const spec = { kind: 'enemy', family: familyId, variant: variant.id };
    for (const dir of engine.DIRS) {
      for (const anim of engine.ANIMS) {
        for (let frame = 0; frame < anim.frames; frame++) {
          const pixels = renderPixels(spec, dir, anim.id, frame);
          check(pixels.filter(Boolean).length >= 40, `${familyId}/${variant.id} must remain readable in ${dir} ${anim.id} frame ${frame}`);
        }
      }
      check(
        renderPixels(spec, dir, 'idle', 0).join(',') !== renderPixels(spec, dir, 'idle', 1).join(','),
        `${familyId}/${variant.id} must animate its idle pose while facing ${dir}`,
      );
      check(
        renderPixels(spec, dir, 'walk', 0).join(',') !== renderPixels(spec, dir, 'walk', 1).join(','),
        `${familyId}/${variant.id} must animate locomotion while facing ${dir}`,
      );
      check(
        renderPixels(spec, dir, 'attack', 0).join(',') !== renderPixels(spec, dir, 'attack', 1).join(','),
        `${familyId}/${variant.id} must animate its attack while facing ${dir}`,
      );
    }
  }
}

for (const familyId of ['shroom', 'carniplant']) {
  const family = engine.ENEMIES.find((entry) => entry.id === familyId);
  for (const variant of family.variants) {
    const spec = { kind: 'enemy', family: familyId, variant: variant.id };
    for (const dir of engine.DIRS) {
      const walkFrames = [0, 1, 2, 3].map((frame) => renderPixels(spec, dir, 'walk', frame));
      check(
        new Set(walkFrames.map((pixels) => pixels.join(','))).size === 4,
        `${familyId}/${variant.id} must use four distinct grounded walk poses while facing ${dir}`,
      );
      check(
        new Set(walkFrames.map((pixels) => pixels.slice(engine.SIZE * 19).join(','))).size === 4,
        `${familyId}/${variant.id} feet or roots must change contact in every walk frame while facing ${dir}`,
      );
    }
  }
}

for (const familyId of ['mantis', 'moth', 'octopus', 'mole', 'scarecrow', 'snail', 'porcupine', 'puppet']) {
  const family = engine.ENEMIES.find((entry) => entry.id === familyId);
  for (const variant of family.variants) {
    const spec = { kind: 'enemy', family: familyId, variant: variant.id };
    for (const dir of engine.DIRS) {
      const walkSignatures = [0, 1, 2, 3].map((frame) => renderPixels(spec, dir, 'walk', frame).join(','));
      check(
        new Set(walkSignatures).size === 4,
        `${familyId}/${variant.id} must use four distinct walk poses while facing ${dir}`,
      );
    }
  }
}

function compositePixelLayers(layers) {
  const output = new Array(engine.SIZE * engine.SIZE).fill(null);
  for (const layer of layers) {
    for (let index = 0; index < layer.length; index++) {
      if (layer[index] !== null) output[index] = layer[index];
    }
  }
  return output;
}

const armorBase = {
  kind: 'player',
  skin: engine.SKINS[1].id,
  hairStyle: 'bald',
  hairColor: engine.HAIR_COLORS[0].id,
  faceDetail: 'none',
  headgear: 'none',
  outfit: engine.OUTFITS[0].id,
  outfitTier: 'tier1',
  outfitColor: engine.OUTFIT_COLORS[1].id,
  weapon: 'none',
  weaponTier: 'tier1',
  shield: 'none',
  shieldTier: 'tier1',
  palette: null,
};
for (const outfit of engine.OUTFITS) {
  for (let tierIndex = 1; tierIndex < engine.OUTFIT_TIERS.length; tierIndex++) {
    const previousTier = engine.OUTFIT_TIERS[tierIndex - 1].id;
    const currentTier = engine.OUTFIT_TIERS[tierIndex].id;
    for (const dir of engine.DIRS) {
      for (const anim of engine.ANIMS) {
        for (let frame = 0; frame < anim.frames; frame++) {
          if (anim.id === 'hurt' && frame === 0) continue;
          const previous = renderPixels({ ...armorBase, outfit: outfit.id, outfitTier: previousTier }, dir, anim.id, frame, { layer: 'outfit' });
          const current = renderPixels({ ...armorBase, outfit: outfit.id, outfitTier: currentTier }, dir, anim.id, frame, { layer: 'outfit' });
          check(
            JSON.stringify(previous) !== JSON.stringify(current),
            `${outfit.id} ${currentTier} armor must visibly upgrade ${dir} ${anim.id} frame ${frame}`,
          );
        }
      }
    }
  }
}
for (const anim of engine.ANIMS) {
  for (let frame = 0; frame < anim.frames; frame++) {
    if (anim.id === 'hurt' && frame === 0) continue;
    const capeBackTiers = engine.OUTFIT_TIERS.map((tier) => renderPixels(
      { ...armorBase, outfit: 'cape', outfitTier: tier.id },
      'right',
      anim.id,
      frame,
      { layer: 'outfit-back' },
    ).join(','));
    check(new Set(capeBackTiers).size === engine.OUTFIT_TIERS.length, `every cape-back armor tier must remain distinct in ${anim.id} frame ${frame}`);
  }
}

const atomicPlayerSpecs = engine.HEADGEAR.map((headgear, index) => ({
  kind: 'player',
  species: engine.SPECIES[index % engine.SPECIES.length].id,
  bodyBuild: engine.BODY_BUILDS[index % engine.BODY_BUILDS.length].id,
  skin: engine.SKINS[index % engine.SKINS.length].id,
  hairStyle: engine.HAIR_STYLES[index % engine.HAIR_STYLES.length].id,
  hairColor: engine.HAIR_COLORS[index % engine.HAIR_COLORS.length].id,
  expression: engine.EXPRESSIONS[index % engine.EXPRESSIONS.length].id,
  faceDetail: engine.FACIAL_DETAILS[index % engine.FACIAL_DETAILS.length].id,
  headgear: headgear.id,
  outfit: engine.OUTFITS[index % engine.OUTFITS.length].id,
  outfitTier: engine.OUTFIT_TIERS[index % engine.OUTFIT_TIERS.length].id,
  outfitColor: engine.OUTFIT_COLORS[index % engine.OUTFIT_COLORS.length].id,
  weapon: engine.WEAPONS[1 + (index % (engine.WEAPONS.length - 1))].id,
  weaponTier: engine.WEAPON_TIERS[index % engine.WEAPON_TIERS.length].id,
  shield: engine.SHIELDS[1 + (index % (engine.SHIELDS.length - 1))].id,
  shieldTier: engine.SHIELD_TIERS[index % engine.SHIELD_TIERS.length].id,
  palette: null,
}));

for (const spec of atomicPlayerSpecs) {
  for (const dir of engine.DIRS) {
    for (const anim of engine.ANIMS) {
      for (let frame = 0; frame < anim.frames; frame++) {
        const complete = renderPixels(spec, dir, anim.id, frame);
        const layers = characterKit.COMPLETE_CHARACTER_KIT_LAYER_ORDER
          .filter((layer) => !(spec.headgear === 'fullhelm' && ['head', 'expression', 'face-detail', 'hair'].includes(layer)))
          .map((layer) => renderPixels(spec, dir, anim.id, frame, { layer }));
        const assembled = compositePixelLayers(layers);
        check(
          JSON.stringify(assembled) === JSON.stringify(complete),
          `atomic layers must exactly recompose ${spec.headgear} ${spec.outfit} in ${dir} ${anim.id} frame ${frame}`,
        );
      }
    }
  }
}

const componentByPath = new Map();
for (const entry of [
  ...completeKitPlan.components.skinBodies,
  ...completeKitPlan.components.heads,
  ...completeKitPlan.components.hair,
  ...completeKitPlan.components.expressions,
  ...completeKitPlan.components.faceDetails,
  ...completeKitPlan.components.speciesBack,
  ...completeKitPlan.components.speciesFront,
  ...completeKitPlan.components.outfitBack,
  ...completeKitPlan.components.outfits,
  ...completeKitPlan.components.headgear,
]) {
  componentByPath.set(entry.file, entry);
}
for (const entry of completeKitPlan.components.weapons) {
  componentByPath.set(entry.files.back, { spec: entry.spec, layer: 'weapon-back' });
  componentByPath.set(entry.files.front, { spec: entry.spec, layer: 'weapon-front' });
}
for (const entry of completeKitPlan.components.shields) {
  componentByPath.set(entry.file, { spec: entry.spec, layer: entry.layer });
}
const recipeLayerKeys = {
  'weapon-back': 'weaponBack',
  'shield-back': 'shieldBack',
  'species-back': 'speciesBack',
  'outfit-back': 'outfitBack',
  outfit: 'outfit',
  'skin-body': 'skinBody',
  head: 'head',
  expression: 'expression',
  'species-front': 'speciesFront',
  'face-detail': 'faceDetail',
  hair: 'hair',
  headgear: 'headgear',
  'shield-front': 'shieldFront',
  'weapon-front': 'weaponFront',
};
for (const recipe of completeKitPlan.recipes) {
  for (const dir of engine.DIRS) {
    for (const anim of engine.ANIMS) {
      for (let frame = 0; frame < anim.frames; frame++) {
        const layers = characterKit.COMPLETE_CHARACTER_KIT_LAYER_ORDER.flatMap((layer) => {
          const path = recipe.components[recipeLayerKeys[layer]];
          if (!path) return [];
          const component = componentByPath.get(path);
          return [renderPixels(component.spec, dir, anim.id, frame, { layer: component.layer })];
        });
        check(
          JSON.stringify(compositePixelLayers(layers)) === JSON.stringify(renderPixels(recipe.spec, dir, anim.id, frame)),
          `recipe components must exactly rebuild ${recipe.name} in ${dir} ${anim.id} frame ${frame}`,
        );
      }
    }
  }
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

function connectedPixelComponents(pixels) {
  const active = pixels.map(Boolean);
  const seen = new Set();
  let components = 0;
  for (let start = 0; start < active.length; start++) {
    if (!active[start] || seen.has(start)) continue;
    components++;
    const queue = [start];
    seen.add(start);
    while (queue.length) {
      const index = queue.pop();
      const x = index % engine.SIZE;
      const y = Math.floor(index / engine.SIZE);
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nextX = x + dx;
        const nextY = y + dy;
        const next = (nextY * engine.SIZE) + nextX;
        if (nextX < 0 || nextY < 0 || nextX >= engine.SIZE || nextY >= engine.SIZE) continue;
        if (!active[next] || seen.has(next)) continue;
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return components;
}

function pixelMaskSignature(pixels) {
  return pixels.map((pixel) => pixel ? 'x' : '.').join('');
}

function horizontallyMirroredPixels(pixels) {
  const mirrored = new Array(pixels.length).fill(null);
  for (let y = 0; y < engine.SIZE; y++) for (let x = 0; x < engine.SIZE; x++) {
    mirrored[(y * engine.SIZE) + (engine.SIZE - 1 - x)] = pixels[(y * engine.SIZE) + x];
  }
  return mirrored;
}

function minimumPixelDistance(first, second) {
  const firstPoints = first.flatMap((pixel, index) => pixel
    ? [[index % engine.SIZE, Math.floor(index / engine.SIZE)]]
    : []);
  const secondPoints = second.flatMap((pixel, index) => pixel
    ? [[index % engine.SIZE, Math.floor(index / engine.SIZE)]]
    : []);
  let minimum = Infinity;
  for (const [firstX, firstY] of firstPoints) for (const [secondX, secondY] of secondPoints) {
    minimum = Math.min(minimum, Math.max(Math.abs(firstX - secondX), Math.abs(firstY - secondY)));
  }
  return minimum;
}

const straightBladeBase = {
  kind: 'player',
  species: 'human',
  bodyBuild: 'classic',
  skin: 'peach',
  hairStyle: 'bald',
  hairColor: 'brown',
  expression: 'neutral',
  faceDetail: 'none',
  headgear: 'none',
  outfit: 'tunic',
  outfitTier: 'tier1',
  outfitColor: 'charcoal',
  shield: 'none',
  shieldTier: 'tier1',
};
const readableWeaponFamilies = ['sword', 'greatsword', 'dagger', 'scimitar', 'rapier', 'axe', 'mace', 'warhammer', 'club', 'spear', 'bow', 'crossbow', 'staff', 'wand', 'spellbook'];
const weaponLayerFor = (direction) => direction === 'up' ? 'weapon-back' : 'weapon-front';
const oppositeWeaponLayerFor = (direction) => direction === 'up' ? 'weapon-front' : 'weapon-back';
const minimumMotionPhases = { idle: 2, walk: 2, attack: 3, hurt: 2 };
const tierFiveMaximumPixelRatio = 1.6;
const tierFiveMaximumBoundsRatio = 1.75;

for (const weapon of readableWeaponFamilies) {
  const tierSignatures = [];
  for (const tier of engine.WEAPON_TIERS) {
    const spec = { ...straightBladeBase, weapon, weaponTier: tier.id };
    tierSignatures.push(renderPixels(spec, 'down', 'idle', 0, { layer: 'weapon-front' }).join(','));
    for (const direction of engine.DIRS) {
      for (const animation of engine.ANIMS) {
        const motionSignatures = [];
        for (let frame = 0; frame < animation.frames; frame++) {
          const pixels = renderPixels(spec, direction, animation.id, frame, { layer: weaponLayerFor(direction) });
          const wrongLayer = renderPixels(spec, direction, animation.id, frame, { layer: oppositeWeaponLayerFor(direction) });
          const unarmed = renderPixels({ ...spec, weapon: 'none' }, direction, animation.id, frame);
          const complete = renderPixels(spec, direction, animation.id, frame);
          const expression = renderPixels(spec, direction, animation.id, frame, { layer: 'expression' });
          const expressionIndices = expression.flatMap((pixel, index) => pixel ? [index] : []);
          motionSignatures.push(pixelMaskSignature(pixels));
          check(pixels.filter(Boolean).length >= 7, `${weapon} ${tier.id} must remain visible in ${direction} ${animation.id} frame ${frame}`);
          check(connectedPixelComponents(pixels) === 1, `${weapon} ${tier.id} must remain one connected silhouette in ${direction} ${animation.id} frame ${frame}`);
          check(wrongLayer.every((pixel) => pixel === null), `${weapon} ${tier.id} must use only the ${weaponLayerFor(direction)} layer in ${direction} ${animation.id} frame ${frame}`);
          check(
            JSON.stringify(compositePixelLayers(direction === 'up' ? [pixels, unarmed] : [unarmed, pixels])) === JSON.stringify(complete),
            `${weapon} ${tier.id} equipment layers must exactly rebuild the complete ${direction} ${animation.id} frame ${frame}`,
          );
          if (direction === 'down' && expressionIndices.length) check(
            expressionIndices.some((index) => !pixels[index]),
            `${weapon} ${tier.id} must leave at least one front-view facial-expression pixel unobscured in ${animation.id} frame ${frame}`,
          );
          check(
            minimumPixelDistance(pixels, unarmed) <= 4,
            `${weapon} ${tier.id} must not detach from the assembled character in ${direction} ${animation.id} frame ${frame}`,
          );
          if (direction === 'right') {
            const left = renderPixels(spec, 'left', animation.id, frame, { layer: 'weapon-front' });
            check(
              JSON.stringify(left) === JSON.stringify(horizontallyMirroredPixels(pixels)),
              `${weapon} ${tier.id} left ${animation.id} frame ${frame} must exactly mirror right`,
            );
          }
        }
        check(
          new Set(motionSignatures).size >= minimumMotionPhases[animation.id],
          `${weapon} ${tier.id} ${direction} ${animation.id} must preserve at least ${minimumMotionPhases[animation.id]} distinct motion phases`,
        );
      }
    }
  }
  check(new Set(tierSignatures).size === engine.WEAPON_TIERS.length, `${weapon} must expose five visually distinct tier materials or silhouettes`);

  const tier4 = renderPixels({ ...straightBladeBase, weapon, weaponTier: 'tier4' }, 'down', 'idle', 0, { layer: 'weapon-front' });
  const tier5 = renderPixels({ ...straightBladeBase, weapon, weaponTier: 'tier5' }, 'down', 'idle', 0, { layer: 'weapon-front' });
  const tier4Pixels = tier4.filter(Boolean).length;
  const tier5Pixels = tier5.filter(Boolean).length;
  const tier4Bounds = weaponPixelBounds(tier4);
  const tier5Bounds = weaponPixelBounds(tier5);
  const tier4BoundsArea = tier4Bounds.width * tier4Bounds.height;
  const tier5BoundsArea = tier5Bounds.width * tier5Bounds.height;
  check(tier5Pixels >= tier4Pixels, `${weapon} Tier 5 must not shrink below its Tier 4 front silhouette`);
  check(tier5Pixels <= Math.ceil(tier4Pixels * tierFiveMaximumPixelRatio), `${weapon} Tier 5 must stay within the global decluttered pixel-density budget`);
  check(tier5BoundsArea <= Math.ceil(tier4BoundsArea * tierFiveMaximumBoundsRatio), `${weapon} Tier 5 must stay within the global decluttered silhouette-bounds budget`);
}

for (const tier of engine.WEAPON_TIERS) {
  for (const direction of engine.DIRS) {
    const signatures = readableWeaponFamilies.map((weapon) => renderPixels(
      { ...straightBladeBase, weapon, weaponTier: tier.id },
      direction,
      'idle',
      0,
      { layer: weaponLayerFor(direction) },
    ).map((pixel) => pixel ? 'x' : '.').join(''));
    check(new Set(signatures).size === readableWeaponFamilies.length, `completed readability-pass weapons must keep distinct ${tier.id} ${direction} silhouettes`);
  }
}

const axeHeadMinimums = [
  { width: 3, height: 5 },
  { width: 5, height: 5 },
  { width: 6, height: 7 },
  { width: 7, height: 7 },
  { width: 9, height: 8 },
];
for (const [tierIndex, tier] of engine.WEAPON_TIERS.entries()) {
  const pixels = renderPixels(
    { ...straightBladeBase, weapon: 'axe', weaponTier: tier.id },
    'down',
    'idle',
    0,
    { layer: 'weapon-front' },
  );
  const headPoints = pixels.flatMap((pixel, index) => {
    const x = index % engine.SIZE;
    const y = Math.floor(index / engine.SIZE);
    return pixel && y <= 11 ? [[x, y]] : [];
  });
  const xs = headPoints.map(([x]) => x);
  const ys = headPoints.map(([, y]) => y);
  const width = Math.max(...xs) - Math.min(...xs) + 1;
  const height = Math.max(...ys) - Math.min(...ys) + 1;
  check(width >= axeHeadMinimums[tierIndex].width, `axe ${tier.id} must preserve a broad cutting-head silhouette`);
  check(height >= axeHeadMinimums[tierIndex].height, `axe ${tier.id} must preserve a tall outer cutting edge`);
  if (tierIndex >= 2) {
    check(Math.max(...xs) - 17 > 17 - Math.min(...xs), `axe ${tier.id} must keep its primary blade larger than its rear spike or counter-edge`);
  }
}

function frontHeadBounds(weapon, tier, bottomY) {
  const pixels = renderPixels(
    { ...straightBladeBase, weapon, weaponTier: tier },
    'down',
    'idle',
    0,
    { layer: 'weapon-front' },
  );
  const points = pixels.flatMap((pixel, index) => {
    const x = index % engine.SIZE;
    const y = Math.floor(index / engine.SIZE);
    return pixel && y <= bottomY ? [[x, y]] : [];
  });
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  return {
    width: Math.max(...xs) - Math.min(...xs) + 1,
    height: Math.max(...ys) - Math.min(...ys) + 1,
  };
}

for (const tier of engine.WEAPON_TIERS) {
  const maceHead = frontHeadBounds('mace', tier.id, 10);
  const hammerHead = frontHeadBounds('warhammer', tier.id, 10);
  const clubHead = frontHeadBounds('club', tier.id, 13);
  check(Math.abs(maceHead.width - maceHead.height) <= 2, `mace ${tier.id} must preserve a compact radial head`);
  check(hammerHead.width >= hammerHead.height + 2, `warhammer ${tier.id} must preserve a broad directional striking head`);
  check(clubHead.height >= clubHead.width + 2, `club ${tier.id} must preserve a long tapered wooden silhouette`);
}

const spearHeadBottom = [7, 7, 8, 8, 9];
for (const [tierIndex, tier] of engine.WEAPON_TIERS.entries()) {
  const spearHead = frontHeadBounds('spear', tier.id, spearHeadBottom[tierIndex]);
  check(spearHead.height >= spearHead.width, `spear ${tier.id} must preserve a length-led piercing head`);
  if (tierIndex >= 3) check(spearHead.height >= spearHead.width + 2, `spear ${tier.id} relic head must stay slender rather than axe-like`);

  for (const weapon of ['bow', 'crossbow']) {
    const spec = { ...straightBladeBase, weapon, weaponTier: tier.id };
    const wind = renderPixels(spec, 'right', 'attack', 1, { layer: 'weapon-front' }).join(',');
    const release = renderPixels(spec, 'right', 'attack', 2, { layer: 'weapon-front' }).join(',');
    check(wind !== release, `${weapon} ${tier.id} must visibly change between draw and release phases`);
  }
}

function weaponPixelBounds(pixels) {
  const points = pixels.flatMap((pixel, index) => pixel ? [[index % engine.SIZE, Math.floor(index / engine.SIZE)]] : []);
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  return {
    width: Math.max(...xs) - Math.min(...xs) + 1,
    height: Math.max(...ys) - Math.min(...ys) + 1,
  };
}

for (const tier of engine.WEAPON_TIERS) {
  const staff = weaponPixelBounds(renderPixels(
    { ...straightBladeBase, weapon: 'staff', weaponTier: tier.id },
    'down', 'idle', 0, { layer: 'weapon-front' },
  ));
  const wand = weaponPixelBounds(renderPixels(
    { ...straightBladeBase, weapon: 'wand', weaponTier: tier.id },
    'down', 'idle', 0, { layer: 'weapon-front' },
  ));
  const spellbook = weaponPixelBounds(renderPixels(
    { ...straightBladeBase, weapon: 'spellbook', weaponTier: tier.id },
    'down', 'idle', 0, { layer: 'weapon-front' },
  ));
  const sideStaff = weaponPixelBounds(renderPixels(
    { ...straightBladeBase, weapon: 'staff', weaponTier: tier.id },
    'right', 'attack', 1, { layer: 'weapon-front' },
  ));
  const sideWand = weaponPixelBounds(renderPixels(
    { ...straightBladeBase, weapon: 'wand', weaponTier: tier.id },
    'right', 'attack', 1, { layer: 'weapon-front' },
  ));
  check(staff.height >= wand.height + 3, `staff ${tier.id} must remain substantially longer than the wand`);
  check(sideStaff.width >= sideWand.width + 3, `staff ${tier.id} side strike must keep a visibly longer countershaft than the wand`);
  check(spellbook.width >= wand.width, `spellbook ${tier.id} must preserve a broader page silhouette than the wand focus`);
  if (tier.id === 'tier4' || tier.id === 'tier5') check(spellbook.width >= 6, `spellbook ${tier.id} must preserve its relic-scale open page spread`);

  for (const weapon of ['staff', 'wand', 'spellbook']) {
    const spec = { ...straightBladeBase, weapon, weaponTier: tier.id };
    const attackSignatures = [0, 1, 2, 3].map((frame) => renderPixels(
      spec, 'right', 'attack', frame, { layer: 'weapon-front' },
    ).join(','));
    check(new Set(attackSignatures).size >= 3, `${weapon} ${tier.id} must visibly progress through cast wind-up, strike, and recovery`);
  }
}

class ValidationCanvas {
  constructor() {
    this._width = 0;
    this._height = 0;
    this.pixels = [];
    this.context = new ValidationCanvasContext(this);
  }

  get width() { return this._width; }
  set width(value) { this._width = value; this.resize(); }
  get height() { return this._height; }
  set height(value) { this._height = value; this.resize(); }
  resize() { this.pixels = new Array(this._width * this._height).fill(null); }
  getContext(kind) { return kind === '2d' ? this.context : null; }
}

class ValidationCanvasContext {
  constructor(canvas) {
    this.canvas = canvas;
    this.fillStyle = '#000000';
    this.imageSmoothingEnabled = true;
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
    for (let y = 0; y < destinationHeight; y++) for (let x = 0; x < destinationWidth; x++) {
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

function checkExportFrame(canvas, column, row, expected, message) {
  const offsetX = column * engine.SIZE;
  const offsetY = row * engine.SIZE;
  const actual = [];
  for (let y = 0; y < engine.SIZE; y++) for (let x = 0; x < engine.SIZE; x++) {
    actual.push(canvas.pixels[((offsetY + y) * canvas.width) + offsetX + x]);
  }
  check(JSON.stringify(actual) === JSON.stringify(expected), message);
}

const originalDocument = globalThis.document;
try {
  globalThis.document = { createElement: (tag) => tag === 'canvas' ? new ValidationCanvas() : null };
  for (const weapon of readableWeaponFamilies) for (const tier of engine.WEAPON_TIERS) {
    const spec = { ...straightBladeBase, weapon, weaponTier: tier.id };
    const fullSheet = engine.buildSheet(spec);
    check(fullSheet.width === 288 && fullSheet.height === 96, `${weapon} ${tier.id} full export must remain 288x96 at native scale`);
    for (const [directionRow, direction] of engine.DIRS.entries()) {
      const directionSheet = engine.buildDirectionSheet(spec, direction);
      check(directionSheet.width === 288 && directionSheet.height === 24, `${weapon} ${tier.id} ${direction} export must remain 288x24 at native scale`);
      let column = 0;
      for (const animation of engine.ANIMS) {
        const animationSheet = engine.buildAnimationSheet(spec, animation.id);
        check(
          animationSheet.width === animation.frames * engine.SIZE && animationSheet.height === 96,
          `${weapon} ${tier.id} ${animation.id} export must retain its native frame dimensions`,
        );
        for (let frame = 0; frame < animation.frames; frame++) {
          const expected = renderPixels(spec, direction, animation.id, frame);
          checkExportFrame(fullSheet, column, directionRow, expected, `${weapon} ${tier.id} full export must preserve ${direction} ${animation.id} frame ${frame}`);
          checkExportFrame(directionSheet, column, 0, expected, `${weapon} ${tier.id} direction export must preserve ${direction} ${animation.id} frame ${frame}`);
          checkExportFrame(animationSheet, frame, directionRow, expected, `${weapon} ${tier.id} animation export must preserve ${direction} ${animation.id} frame ${frame}`);
          column++;
        }
      }
    }
  }
} finally {
  if (originalDocument === undefined) delete globalThis.document;
  else globalThis.document = originalDocument;
}

const shieldBase = {
  kind: 'player',
  skin: engine.SKINS[0].id,
  hairStyle: engine.HAIR_STYLES[0].id,
  hairColor: engine.HAIR_COLORS[0].id,
  faceDetail: 'none',
  headgear: 'none',
  outfit: engine.OUTFITS[0].id,
  outfitTier: 'tier1',
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

for (const shield of equippedShields) {
  const tier4Spec = { ...shieldBase, shield, shieldTier: 'tier4' };
  const tier5Spec = { ...shieldBase, shield, shieldTier: 'tier5' };
  for (const dir of engine.DIRS) {
    for (const anim of engine.ANIMS) {
      for (let frame = 0; frame < anim.frames; frame++) {
        const tier4 = renderPixels(tier4Spec, dir, anim.id, frame);
        const tier5 = renderPixels(tier5Spec, dir, anim.id, frame);
        const changed = changedPixels(tier5, tier4);
        const faceChanges = changed.filter((index) => {
          const x = index % engine.SIZE;
          const y = Math.floor(index / engine.SIZE);
          return x >= 9 && x <= 14 && y >= 5 && y <= 10;
        });
        const minimumArtifactChanges = anim.id === 'hurt' ? 1 : 4;
        check(changed.length >= minimumArtifactChanges, `${shield} Tier 5 must be a substantial artifact redesign in ${dir} ${anim.id} frame ${frame}`);
        check(
          faceChanges.length === 0,
          `${shield} Tier 5 must preserve face clearance in ${dir} ${anim.id} frame ${frame} (${faceChanges.map((index) => `${index % engine.SIZE},${Math.floor(index / engine.SIZE)}`).join('; ')})`,
        );
      }
    }

    const walkStart = changeSignature(renderPixels(tier5Spec, dir, 'walk', 0), renderPixels(tier4Spec, dir, 'walk', 0));
    const walkReturn = changeSignature(renderPixels(tier5Spec, dir, 'walk', 2), renderPixels(tier4Spec, dir, 'walk', 2));
    check(walkStart !== walkReturn, `${shield} Tier 5 artifact form must follow the off-hand walk swing in ${dir}`);

    const attackWind = changeSignature(renderPixels(tier5Spec, dir, 'attack', 0), renderPixels(tier4Spec, dir, 'attack', 0));
    const attackRecover = changeSignature(renderPixels(tier5Spec, dir, 'attack', 3), renderPixels(tier4Spec, dir, 'attack', 3));
    check(attackWind !== attackRecover, `${shield} Tier 5 artifact form must brace and recover with attacks in ${dir}`);
  }
}

for (const dir of engine.DIRS) {
  const signatures = equippedShields.map((shield) => (
    renderPixels({ ...shieldBase, shield, shieldTier: 'tier5' }, dir, 'idle', 0).join(',')
  ));
  check(new Set(signatures).size === equippedShields.length, `every Tier 5 shield family must have a distinct ${dir} artifact silhouette`);
}

const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
check(packageJson.scripts?.build === 'node tools/build.mjs', 'package.json must expose the production build command');
check(packageJson.scripts?.['tauri:build'] === 'tauri build --bundles nsis', 'package.json must expose the Windows installer build command');
check(packageJson.scripts?.['tauri:build:exe'] === 'tauri build --no-bundle', 'package.json must preserve the proof Windows executable command');
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
const effectRefs = (manifest.effects || []).flatMap((category) => category.effects.map((effect) => effect.file));
const playerRefs = (manifest.players || []).map((player) => player.file);
const referenced = [...enemyRefs, ...effectRefs, ...playerRefs];
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

const manifestEffectCategories = new Map((manifest.effects || []).map((category) => [category.category, category]));
const engineEffectCategories = new Map(engine.COMBAT_EFFECTS.map((category) => [category.id, category]));
check(engineEffectCategories.size === manifestEffectCategories.size, `Engine has ${engineEffectCategories.size} effect groups but manifest has ${manifestEffectCategories.size}`);
for (const [categoryId, manifestCategory] of manifestEffectCategories) {
  const engineCategory = engineEffectCategories.get(categoryId);
  check(Boolean(engineCategory), `Manifest effect group ${categoryId} is missing from the engine`);
  if (!engineCategory) continue;
  check(
    JSON.stringify(engineCategory.effects.map((effect) => effect.id)) === JSON.stringify(manifestCategory.effects.map((effect) => effect.id)),
    `${categoryId}: engine effects do not match manifest effects`,
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

const combinations = engine.SPECIES.length
  * engine.BODY_BUILDS.length
  * engine.SKINS.length
  * engine.HAIR_STYLES.length
  * engine.HAIR_COLORS.length
  * engine.EXPRESSIONS.length
  * engine.FACIAL_DETAILS.length
  * engine.HEADGEAR.length
  * engine.OUTFITS.length
  * engine.OUTFIT_TIERS.length
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
console.log(`- Combat effects: ${effectRefs.length}`);
console.log(`- Player samples: ${playerRefs.length}`);
console.log(`- Validated PNG sheets: ${actualPngs.length} (${expectedWidth}x${expectedHeight})`);
