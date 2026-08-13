import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const assetRoot = path.join(root, 'asset-pack');
const manifestPath = path.join(assetRoot, 'manifest.json');
const errors = [];

// Check tiers: the default run is the full release gate. --fast skips the two
// boss structural gates and the exhaustive export-parity audit for quick
// inner-loop iteration; --skip-bosses skips only the boss gates (they can be
// run alone via `npm run check:bosses`).
const cliArguments = new Set(process.argv.slice(2));
const FAST_MODE = cliArguments.has('--fast');
const SKIP_BOSS_GATES = FAST_MODE || cliArguments.has('--skip-bosses');

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
const pixelBuffer = await import(`${pathToFileURL(path.join(root, 'engine', 'pixel-buffer.js')).href}?check=${Date.now()}`);
const shadeModule = await import(`${pathToFileURL(path.join(root, 'engine', 'shade-renderer.js')).href}?check=${Date.now()}`);
const castModule = await import(`${pathToFileURL(path.join(root, 'engine', 'cast-animation.js')).href}?check=${Date.now()}`);
const deathModule = await import(`${pathToFileURL(path.join(root, 'engine', 'death-animation.js')).href}?check=${Date.now()}`);
const enemyExpansionModule = await import(`${pathToFileURL(path.join(root, 'engine', 'enemy-expansion.js')).href}?check=${Date.now()}`);
const { SHADE_PILOTS } = await import(`${pathToFileURL(path.join(root, 'tools', 'shade-pilots.mjs')).href}?check=${Date.now()}`);
const characterKit = await import(`${pathToFileURL(path.join(root, 'character-kit.js')).href}?check=${Date.now()}`);
const zipModule = await import(`${pathToFileURL(path.join(root, 'zip.js')).href}?check=${Date.now()}`);

checkSyntax('sprite-engine.js');
checkSyntax('app.js');
checkSyntax('character-kit.js');
checkSyntax('zip.js');
checkSyntax('engine/catalogs.js');
checkSyntax('engine/catalogs/animation.js');
checkSyntax('engine/catalogs/boss-animations.js');
checkSyntax('engine/catalogs/boss-directions.js');
checkSyntax('engine/catalogs/effects.js');
checkSyntax('engine/catalogs/enemies.js');
checkSyntax('engine/catalogs/palettes.js');
checkSyntax('engine/catalogs/player-options.js');
checkSyntax('engine/combat-loadouts.js');
checkSyntax('engine/cast-animation.js');
checkSyntax('engine/death-animation.js');
checkSyntax('engine/enemy-expansion.js');
checkSyntax('engine/enemy-expansion-en-e01.js');
checkSyntax('engine/enemy-expansion-en-e02.js');
checkSyntax('engine/enemy-expansion-en-e03.js');
checkSyntax('engine/enemy-expansion-en-e05.js');
checkSyntax('engine/enemy-expansion-en-e03-adoption.js');
checkSyntax('engine/enemy-expansion-en-e05-ghoul-public.js');
checkSyntax('engine/enemy-expansion-en-e06-public.js');
checkSyntax('engine/enemy-expansion-humanoid.js');
checkSyntax('engine/enemy-expansion-large-hybrid.js');
checkSyntax('engine/enemy-expansion-public.js');
checkSyntax('engine/enemy-expansion-repairs.js');
checkSyntax('engine/public-renderer.js');
checkSyntax('engine/class-templates.js');
checkSyntax('engine/game-pack.js');
checkSyntax('engine/public-game-pack.js');
checkSyntax('engine/production-rolls.js');
checkSyntax('engine/production-rerolls.js');
checkSyntax('engine/variant-batches.js');
checkSyntax('engine/generators.js');
checkSyntax('engine/effect-renderer.js');
checkSyntax('engine/offhand-renderer.js');
checkSyntax('engine/outline-renderer.js');
checkSyntax('engine/pixel-buffer.js');
checkSyntax('engine/renderer.js');
checkSyntax('engine/shade-renderer.js');
checkSyntax('engine/shield-renderer.js');
checkSyntax('engine/sheets.js');
checkSyntax('engine/weapon-renderer.js');
checkSyntax('tools/build.mjs');
checkSyntax('tools/check-boss-animations.mjs');
checkSyntax('tools/check-boss-directions.mjs');
checkSyntax('tools/cast-review.mjs');
checkSyntax('tools/death-review.mjs');
checkSyntax('tools/check-enemy-expansion.mjs');
checkSyntax('tools/check-enemy-expansion-en-e01.mjs');
checkSyntax('tools/check-enemy-expansion-en-e01-full.mjs');
checkSyntax('tools/check-enemy-expansion-en-e01-registration.mjs');
checkSyntax('tools/check-enemy-expansion-en-e01-consumers.mjs');
checkSyntax('tools/check-enemy-expansion-en-e02.mjs');
checkSyntax('tools/check-enemy-expansion-en-e02-full.mjs');
checkSyntax('tools/check-enemy-expansion-en-e02-registration.mjs');
checkSyntax('tools/check-enemy-expansion-en-e02-consumers.mjs');
checkSyntax('tools/check-enemy-expansion-en-e04-registration.mjs');
checkSyntax('tools/check-enemy-expansion-en-e04-consumers.mjs');
checkSyntax('tools/check-enemy-expansion-en-e05-registration.mjs');
checkSyntax('tools/check-enemy-expansion-en-e05-consumers.mjs');
checkSyntax('tools/check-approved-enemy-assembler-integration.mjs');
checkSyntax('tools/check-approved-enemy-assembler-integration-v2.mjs');
checkSyntax('tools/check-approved-enemy-assembler-integration-v3.mjs');
checkSyntax('tools/complete-b-actor-pack-pixels.mjs');
checkSyntax('tools/export-complete-b-actor-pack.mjs');
checkSyntax('tools/check-complete-b-actor-pack.mjs');
checkSyntax('tools/check-enemy-expansion-en-e03.mjs');
checkSyntax('tools/check-enemy-expansion-repairs.mjs');
checkSyntax('tools/enemy-expansion-en-e01-review.mjs');
checkSyntax('tools/enemy-expansion-en-e01-full-review.mjs');
checkSyntax('tools/enemy-expansion-en-e02-review.mjs');
checkSyntax('tools/enemy-expansion-en-e02-full-review.mjs');
checkSyntax('tools/enemy-expansion-en-e03-review.mjs');
checkSyntax('tools/enemy-expansion-candidate-presentation.mjs');
checkSyntax('tools/enemy-expansion-review-pixels.mjs');
checkSyntax('tools/dev-server.mjs');
checkSyntax('tools/generate-shield-placement-audit.mjs');
checkSyntax('tools/outline-review.mjs');
checkSyntax('tools/offhand-review.mjs');
checkSyntax('tools/shade-pilots.mjs');
checkSyntax('tools/shade-review.mjs');
checkSyntax('tools/weapon-readability-audit.mjs');
checkSyntax('tools/check-windows-release.mjs');

if (!SKIP_BOSS_GATES) {
  const bossDirectionCheck = spawnSync(process.execPath, [path.join(root, 'tools', 'check-boss-directions.mjs')], {
    encoding: 'utf8',
  });
  if (bossDirectionCheck.status !== 0) {
    // Fail loudly now instead of only in the summary minutes later.
    console.error('Boss direction structural gate failed (full details in the final report).');
  }
  check(
    bossDirectionCheck.status === 0,
    `Boss direction structural gate failed\n${bossDirectionCheck.stdout.trim()}\n${bossDirectionCheck.stderr.trim()}`,
  );

  const bossAnimationCheck = spawnSync(process.execPath, [path.join(root, 'tools', 'check-boss-animations.mjs')], {
    encoding: 'utf8',
  });
  if (bossAnimationCheck.status !== 0) {
    console.error('Boss animation structural gate failed (full details in the final report).');
  }
  check(
    bossAnimationCheck.status === 0,
    `Boss animation structural gate failed\n${bossAnimationCheck.stdout.trim()}\n${bossAnimationCheck.stderr.trim()}`,
  );
}

const enemyExpansionCheck = spawnSync(process.execPath, [path.join(root, 'tools', 'check-enemy-expansion.mjs')], {
  encoding: 'utf8',
});
check(
  enemyExpansionCheck.status === 0,
  `Enemy expansion foundation gate failed\n${enemyExpansionCheck.stdout.trim()}\n${enemyExpansionCheck.stderr.trim()}`,
);

const enemyExpansionEnE01Check = spawnSync(process.execPath, [path.join(root, 'tools', 'check-enemy-expansion-en-e01.mjs')], {
  encoding: 'utf8',
});
check(
  enemyExpansionEnE01Check.status === 0,
  `EN-E01 Idle candidate gate failed\n${enemyExpansionEnE01Check.stdout.trim()}\n${enemyExpansionEnE01Check.stderr.trim()}`,
);

const enemyExpansionEnE01FullCheck = spawnSync(process.execPath, [path.join(root, 'tools', 'check-enemy-expansion-en-e01-full.mjs')], {
  encoding: 'utf8',
});
check(
  enemyExpansionEnE01FullCheck.status === 0,
  `EN-E01 full private candidate gate failed\n${enemyExpansionEnE01FullCheck.stdout.trim()}\n${enemyExpansionEnE01FullCheck.stderr.trim()}`,
);

const enemyExpansionEnE01RegistrationCheck = spawnSync(process.execPath, [path.join(root, 'tools', 'check-enemy-expansion-en-e01-registration.mjs')], {
  encoding: 'utf8',
});
check(
  enemyExpansionEnE01RegistrationCheck.status === 0,
  `EN-E01 public registration gate failed\n${enemyExpansionEnE01RegistrationCheck.stdout.trim()}\n${enemyExpansionEnE01RegistrationCheck.stderr.trim()}`,
);

const enemyExpansionConsumerCheck = spawnSync(process.execPath, [path.join(root, 'tools', 'check-enemy-expansion-en-e02-consumers.mjs')], {
  encoding: 'utf8',
});
check(
  enemyExpansionConsumerCheck.status === 0,
  `EN-E01/EN-E02 consumer integration gate failed\n${enemyExpansionConsumerCheck.stdout.trim()}\n${enemyExpansionConsumerCheck.stderr.trim()}`,
);

const enemyExpansionEnE02Check = spawnSync(process.execPath, [path.join(root, 'tools', 'check-enemy-expansion-en-e02.mjs')], {
  encoding: 'utf8',
});
check(
  enemyExpansionEnE02Check.status === 0,
  `EN-E02 approved Idle evidence gate failed\n${enemyExpansionEnE02Check.stdout.trim()}\n${enemyExpansionEnE02Check.stderr.trim()}`,
);

const enemyExpansionEnE02FullCheck = spawnSync(process.execPath, [path.join(root, 'tools', 'check-enemy-expansion-en-e02-full.mjs')], {
  encoding: 'utf8',
});
check(
  enemyExpansionEnE02FullCheck.status === 0,
  `EN-E02 full candidate evidence gate failed\n${enemyExpansionEnE02FullCheck.stdout.trim()}\n${enemyExpansionEnE02FullCheck.stderr.trim()}`,
);

const enemyExpansionEnE02RegistrationCheck = spawnSync(process.execPath, [path.join(root, 'tools', 'check-enemy-expansion-en-e02-registration.mjs')], {
  encoding: 'utf8',
});
check(
  enemyExpansionEnE02RegistrationCheck.status === 0,
  `EN-E02 approved registration gate failed\n${enemyExpansionEnE02RegistrationCheck.stdout.trim()}\n${enemyExpansionEnE02RegistrationCheck.stderr.trim()}`,
);

const enemyExpansionEnE04RegistrationCheck = spawnSync(process.execPath, [path.join(root, 'tools', 'check-enemy-expansion-en-e04-registration.mjs')], {
  encoding: 'utf8',
});
check(
  enemyExpansionEnE04RegistrationCheck.status === 0,
  `EN-E04 approved registration gate failed\n${enemyExpansionEnE04RegistrationCheck.stdout.trim()}\n${enemyExpansionEnE04RegistrationCheck.stderr.trim()}`,
);

const enemyExpansionEnE04ConsumerCheck = spawnSync(process.execPath, [path.join(root, 'tools', 'check-enemy-expansion-en-e04-consumers.mjs')], {
  encoding: 'utf8',
});
check(
  enemyExpansionEnE04ConsumerCheck.status === 0,
  `EN-E04 assembler consumer integration gate failed\n${enemyExpansionEnE04ConsumerCheck.stdout.trim()}\n${enemyExpansionEnE04ConsumerCheck.stderr.trim()}`,
);

const enemyExpansionEnE05RegistrationCheck = spawnSync(process.execPath, [path.join(root, 'tools', 'check-enemy-expansion-en-e05-registration.mjs')], {
  encoding: 'utf8',
});
check(
  enemyExpansionEnE05RegistrationCheck.status === 0,
  `EN-E05 approved registration gate failed\n${enemyExpansionEnE05RegistrationCheck.stdout.trim()}\n${enemyExpansionEnE05RegistrationCheck.stderr.trim()}`,
);

const enemyExpansionEnE05ConsumerCheck = spawnSync(process.execPath, [path.join(root, 'tools', 'check-enemy-expansion-en-e05-consumers.mjs')], {
  encoding: 'utf8',
});
check(
  enemyExpansionEnE05ConsumerCheck.status === 0,
  `EN-E05 assembler consumer integration gate failed\n${enemyExpansionEnE05ConsumerCheck.stdout.trim()}\n${enemyExpansionEnE05ConsumerCheck.stderr.trim()}`,
);

const approvedEnemyAssemblerIntegrationCheck = spawnSync(process.execPath, [path.join(root, 'tools', 'check-approved-enemy-assembler-integration.mjs')], {
  cwd: root,
  encoding: 'utf8',
});
check(
  approvedEnemyAssemblerIntegrationCheck.status === 0,
  `Approved enemy assembler integration gate failed\n${approvedEnemyAssemblerIntegrationCheck.stdout.trim()}\n${approvedEnemyAssemblerIntegrationCheck.stderr.trim()}`,
);

const approvedEnemyAssemblerIntegrationV2Check = spawnSync(process.execPath, [path.join(root, 'tools', 'check-approved-enemy-assembler-integration-v2.mjs')], {
  cwd: root,
  encoding: 'utf8',
});
check(
  approvedEnemyAssemblerIntegrationV2Check.status === 0,
  `Approved enemy assembler integration v2 gate failed\n${approvedEnemyAssemblerIntegrationV2Check.stdout.trim()}\n${approvedEnemyAssemblerIntegrationV2Check.stderr.trim()}`,
);

const approvedEnemyAssemblerIntegrationV3Check = spawnSync(process.execPath, [path.join(root, 'tools', 'check-approved-enemy-assembler-integration-v3.mjs')], {
  cwd: root,
  encoding: 'utf8',
});
check(
  approvedEnemyAssemblerIntegrationV3Check.status === 0,
  `Approved enemy assembler integration v3 gate failed\n${approvedEnemyAssemblerIntegrationV3Check.stdout.trim()}\n${approvedEnemyAssemblerIntegrationV3Check.stderr.trim()}`,
);

const enemyExpansionRepairCheck = spawnSync(process.execPath, [path.join(root, 'tools', 'check-enemy-expansion-repairs.mjs')], {
  encoding: 'utf8',
});
check(
  enemyExpansionRepairCheck.status === 0,
  `Approved enemy repair gate failed\n${enemyExpansionRepairCheck.stdout.trim()}\n${enemyExpansionRepairCheck.stderr.trim()}`,
);

const enemyExpansionEnE03Check = spawnSync(process.execPath, [path.join(root, 'tools', 'check-enemy-expansion-en-e03.mjs')], {
  encoding: 'utf8',
});
check(
  enemyExpansionEnE03Check.status === 0,
  `EN-E03 common-only Idle candidate gate failed\n${enemyExpansionEnE03Check.stdout.trim()}\n${enemyExpansionEnE03Check.stderr.trim()}`,
);

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
  'outline-control', 'outline-buttons', 'shade-control', 'shade-buttons',
  'reset-button', 'duplicate-button', 'compare-button', 'compare-dialog',
  'production-roll-button', 'production-roll-status', 'randomize-button',
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
  'boss-stage-image', 'boss-pilot-panel', 'boss-export-scope', 'boss-sheet-image', 'download-boss-sheet-button',
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
  'engine/catalogs/boss-animations.js': await readFile(path.join(root, 'engine', 'catalogs', 'boss-animations.js'), 'utf8'),
  'engine/catalogs/boss-directions.js': await readFile(path.join(root, 'engine', 'catalogs', 'boss-directions.js'), 'utf8'),
  'engine/catalogs/effects.js': await readFile(path.join(root, 'engine', 'catalogs', 'effects.js'), 'utf8'),
  'engine/catalogs/enemies.js': await readFile(path.join(root, 'engine', 'catalogs', 'enemies.js'), 'utf8'),
  'engine/catalogs/palettes.js': await readFile(path.join(root, 'engine', 'catalogs', 'palettes.js'), 'utf8'),
  'engine/catalogs/player-options.js': await readFile(path.join(root, 'engine', 'catalogs', 'player-options.js'), 'utf8'),
  'engine/combat-loadouts.js': await readFile(path.join(root, 'engine', 'combat-loadouts.js'), 'utf8'),
  'engine/cast-animation.js': await readFile(path.join(root, 'engine', 'cast-animation.js'), 'utf8'),
  'engine/death-animation.js': await readFile(path.join(root, 'engine', 'death-animation.js'), 'utf8'),
  'engine/enemy-expansion.js': await readFile(path.join(root, 'engine', 'enemy-expansion.js'), 'utf8'),
  'engine/class-templates.js': await readFile(path.join(root, 'engine', 'class-templates.js'), 'utf8'),
  'engine/game-pack.js': await readFile(path.join(root, 'engine', 'game-pack.js'), 'utf8'),
  'engine/production-rolls.js': await readFile(path.join(root, 'engine', 'production-rolls.js'), 'utf8'),
  'engine/production-rerolls.js': await readFile(path.join(root, 'engine', 'production-rerolls.js'), 'utf8'),
  'engine/variant-batches.js': await readFile(path.join(root, 'engine', 'variant-batches.js'), 'utf8'),
  'engine/generators.js': await readFile(path.join(root, 'engine', 'generators.js'), 'utf8'),
  'engine/effect-renderer.js': await readFile(path.join(root, 'engine', 'effect-renderer.js'), 'utf8'),
  'engine/offhand-renderer.js': await readFile(path.join(root, 'engine', 'offhand-renderer.js'), 'utf8'),
  'engine/outline-renderer.js': await readFile(path.join(root, 'engine', 'outline-renderer.js'), 'utf8'),
  'engine/pixel-buffer.js': await readFile(path.join(root, 'engine', 'pixel-buffer.js'), 'utf8'),
  'engine/renderer.js': await readFile(path.join(root, 'engine', 'renderer.js'), 'utf8'),
  'engine/shade-renderer.js': await readFile(path.join(root, 'engine', 'shade-renderer.js'), 'utf8'),
  'engine/shield-renderer.js': await readFile(path.join(root, 'engine', 'shield-renderer.js'), 'utf8'),
  'engine/sheets.js': await readFile(path.join(root, 'engine', 'sheets.js'), 'utf8'),
  'engine/weapon-renderer.js': await readFile(path.join(root, 'engine', 'weapon-renderer.js'), 'utf8'),
};
const stylesSource = await readFile(path.join(root, 'styles.css'), 'utf8');
for (const [relativePath, source] of Object.entries(runtimeSources)) {
  check(!/\bnew\s+Function\s*\(/.test(source), `${relativePath}: runtime code generation with new Function is not allowed`);
  check(!/\beval\s*\(/.test(source), `${relativePath}: runtime code generation with eval is not allowed`);
}

const expectedEngineExports = [
  'ANIMS', 'BOSS_ANIMATIONS', 'BOSS_ANIMATION_DIRECTIONS', 'BOSS_ANIMATION_FRAME_SIZE',
  'BOSS_ANIMATION_PILOTS', 'BOSS_ANIMATION_PROFILE', 'BOSS_ANIMATION_SHEET_COLUMNS',
  'BOSS_ANIMATION_SHEET_HEIGHT', 'BOSS_ANIMATION_SHEET_WIDTH',
  'BOSS_DIRECTION_FRAME_SIZE', 'BOSS_DIRECTION_PILOT_PROFILE', 'BOSS_DIRECTION_PILOTS',
  'BOSS_DIRECTION_SHEET_HEIGHT', 'BOSS_DIRECTION_SHEET_WIDTH', 'BOSS_DIRECTIONS',
  'BODY_BUILDS', 'CLASS_PACK_FORMAT', 'CLASS_PACK_VERSION', 'CLASS_TEMPLATES',
  'COMBAT_EFFECTS', 'COMBAT_LOADOUT_FORMAT', 'COMBAT_LOADOUT_SLOTS', 'COMBAT_LOADOUT_VERSION', 'DEFAULT_CLASS_TEMPLATE',
  'DEFAULT_COMBAT_LOADOUT', 'DEFAULT_VARIANT_BATCH_SET', 'ENEMY_OUTLINE_PILOT_FAMILIES',
  'DIRS', 'DIR_LABELS', 'ENEMIES', 'ENEMY_EXPANSION_CONSUMER_REGISTRY', 'ENEMY_EXPANSION_LEDGER', 'ENEMY_EXPANSION_PROFILE', 'ENEMY_EXPANSION_REGISTRY',
  'ENEMY_EXPANSION_STATES', 'EXPRESSIONS', 'FACIAL_DETAILS', 'HAIR_COLORS', 'HAIR_STYLES', 'HEADGEAR',
  'OFFHANDS', 'OUTFITS', 'OUTFIT_COLORS', 'OUTFIT_TIERS', 'OUTLINE_COLOR', 'OUTLINE_LAYER_ORDER', 'OUTLINE_MODES',
  'OUTLINE_MODE_COMPLETE_B', 'OUTLINE_MODE_NONE', 'OUTLINE_MODE_SELECTIVE_C',
  'PRODUCTION_COMPATIBLE_REROLL_CATEGORIES', 'PRODUCTION_COMPATIBLE_REROLL_POLICY',
  'PRODUCTION_PALETTE_FAMILIES', 'PRODUCTION_ROLL_FREEZE', 'PRODUCTION_ROLL_MAX_ATTEMPTS', 'PUBLIC_ENEMIES',
  'PRODUCTION_ROLL_PROFILE', 'PRODUCTION_ROLL_REASON_CODES',
  'SHADE_MODES', 'SHADE_MODE_FORM', 'SHADE_MODE_NONE',
  'SHEET_COLS', 'SHIELDS', 'SHIELD_TIERS', 'SIZE', 'SKINS', 'SPECIES', 'WEAPONS', 'WEAPON_TIERS',
  'VARIANT_BATCH_FORMAT', 'VARIANT_BATCH_SETS', 'VARIANT_BATCH_VERSION',
  'WILDSHOT_GAME_PACK_ACTOR_CATEGORIES', 'WILDSHOT_GAME_PACK_EFFECT_CATEGORIES', 'WILDSHOT_GAME_PACK_POLICY',
  'applyClassTemplate', 'auditProductionRollCatalogs', 'auditProductionRollClassTemplates',
  'auditWildshotGamePackRuntime', 'buildAnimationSheet', 'buildClassPack', 'buildDirectionSheet', 'buildEnemyExpansionLedgerReport',
  'buildEnemyExpansionReviewPlan', 'buildSheet',
  'buildVariantBatch', 'buildWildshotGamePackManifest',
  'combatLoadoutEffectSpecs', 'createEnemyExpansionRegistry', 'defaultCombatLoadout', 'describe', 'drawAssembledSprite', 'drawOutlinedSprite', 'drawPublicSprite', 'drawSprite',
  'enemySupportsOutline', 'isPublicEnemyExpansionSpec', 'normalizeAssembledOutlineMode', 'normalizeOutlineMode', 'normalizeShadeMode',
  'normalizeProductionRollSeed', 'randomEffect', 'randomEnemy', 'randomPlayer', 'resolveCombatLoadout',
  'renderEnemyExpansionFrame', 'rerollProductionPlayerCategory', 'rollProductionPlayer', 'sanitizeCombatLoadout',
  'serializeWildshotGamePackManifest', 'thumbURL', 'validateEnemyExpansionSheet', 'validateProductionPlayer', 'validateWildshotGamePackExport',
].sort();
check(
  JSON.stringify(Object.keys(engine).sort()) === JSON.stringify(expectedEngineExports),
  'sprite-engine.js public exports changed; consumers must keep using the stable facade API',
);
check(runtimeSources['sprite-engine.js'].split(/\r?\n/).length < 75, 'sprite-engine.js must remain a small public facade');
check(runtimeSources['engine/catalogs.js'].split(/\r?\n/).length < 55, 'engine/catalogs.js must remain a small internal facade');
check(
  JSON.stringify([...runtimeSources['engine/enemy-expansion.js'].matchAll(/from\s+['"]([^'"]+)['"]/g)].map((match) => match[1]))
    === JSON.stringify(['./catalogs.js']),
  'the Enemy expansion foundation may depend only on the stable internal catalog facade',
);
check(!/\b(document|window|localStorage|sessionStorage)\b/.test(runtimeSources['engine/enemy-expansion.js']), 'the Enemy expansion foundation must remain independent from DOM and browser state');
check(enemyExpansionModule.ENEMY_EXPANSION_REGISTRY.families.length === 0, 'EN-F00 must leave the built-in expansion registry empty');
check(runtimeSources['app.js'].includes("from './sprite-engine.js'"), 'app.js must consume the public engine facade');
check(!runtimeSources['app.js'].includes("from './engine/"), 'app.js must not depend on internal engine modules');
check(runtimeSources['app.js'].includes("from './character-kit.js'"), 'app.js must use the focused master character-kit planner');
check(!runtimeSources['character-kit.js'].includes("from './engine/"), 'character-kit.js must consume only the public engine facade');
const productionRollImports = [...runtimeSources['engine/production-rolls.js'].matchAll(/from\s+['"]([^'"]+)['"]/g)]
  .map((match) => match[1])
  .sort();
const productionRerollImports = [
  ...runtimeSources['engine/production-rerolls.js'].matchAll(/from\s+['"]([^'"]+)['"]/g),
].map((match) => match[1]).sort();
const castImports = [
  ...runtimeSources['engine/cast-animation.js'].matchAll(/from\s+['"]([^'"]+)['"]/g),
].map((match) => match[1]).sort();
const deathImports = [
  ...runtimeSources['engine/death-animation.js'].matchAll(/from\s+['"]([^'"]+)['"]/g),
].map((match) => match[1]).sort();
check(
  castImports.length === 0,
  'the isolated Player Cast contract must remain a dependency-free pure module',
);
check(
  !/\b(document|window|localStorage|sessionStorage|canvas|getContext|Math\.random)\b/
    .test(runtimeSources['engine/cast-animation.js']),
  'the isolated Player Cast contract must not depend on DOM, storage, canvas, or randomness',
);
check(
  JSON.stringify(engine.ANIMS.map(({ id }) => id))
    === JSON.stringify(['idle', 'walk', 'attack', 'cast', 'hurt', 'death'])
    && engine.SHEET_COLS === 20,
  'approved Player Cast and Death must retain their public order in the 20-column sheet contract',
);
check(
  Object.isFrozen(castModule.PLAYER_CAST_PROFILE)
    && Object.isFrozen(castModule.PLAYER_CAST_ANIMATION)
    && castModule.PLAYER_CAST_PROFILE.id === 'player-cast-v1'
    && castModule.PLAYER_CAST_PROFILE.version === 1
    && castModule.PLAYER_CAST_PROFILE.animation === castModule.PLAYER_CAST_ANIMATION
    && JSON.stringify(castModule.PLAYER_CAST_ANIMATION)
      === JSON.stringify({ id: 'cast', name: 'Cast', frames: 4, ms: 130 }),
  'the isolated Player Cast profile and animation identity must remain exact and immutable',
);
const expectedPlayerCastPoses = [
  {
    phase: 'prepare',
    bodyBob: 1,
    leg: 0,
    sideHandReach: 0,
    weaponHandOffset: -1,
    offhandHandOffset: 1,
  },
  {
    phase: 'focus',
    bodyBob: 1,
    leg: 1,
    sideHandReach: 1,
    weaponHandOffset: -1,
    offhandHandOffset: -1,
  },
  {
    phase: 'release',
    bodyBob: 0,
    leg: 1,
    sideHandReach: 2,
    weaponHandOffset: 0,
    offhandHandOffset: -2,
  },
  {
    phase: 'recover',
    bodyBob: 0,
    leg: -1,
    sideHandReach: 1,
    weaponHandOffset: 0,
    offhandHandOffset: 1,
  },
];
for (let frame = 0; frame < expectedPlayerCastPoses.length; frame++) {
  const pose = castModule.playerCastPose(frame);
  check(
    Object.isFrozen(pose)
      && JSON.stringify(pose) === JSON.stringify(expectedPlayerCastPoses[frame]),
    `Player Cast pose ${frame} must remain exact and immutable`,
  );
}
for (const invalidFrame of [-1, 0.5, 4, Number.NaN]) {
  let castError = null;
  try {
    castModule.playerCastPose(invalidFrame);
  } catch (error) {
    castError = error;
  }
  check(
    castError instanceof RangeError,
    `Player Cast must reject invalid frame ${String(invalidFrame)} with RangeError`,
  );
}
check(
  runtimeSources['engine/renderer.js'].includes("if (animId === 'cast')")
    && runtimeSources['engine/renderer.js'].includes('p.castWeaponHand')
    && runtimeSources['engine/renderer.js'].includes('p.castOffhandHand')
    && runtimeSources['engine/offhand-renderer.js'].includes('if (p.cast) return p.castOffhandHand')
    && runtimeSources['engine/shield-renderer.js'].includes('if (p.cast) return p.castOffhandHand'),
  'the guarded Player Cast pose must keep body, weapon, shield, and Lantern hand sockets registered',
);
check(
  deathImports.length === 0,
  'the isolated Player Death contract must remain a dependency-free pure module',
);
check(
  !/\b(document|window|localStorage|sessionStorage|canvas|getContext|Math\.random)\b/
    .test(runtimeSources['engine/death-animation.js']),
  'the isolated Player Death contract must not depend on DOM, storage, canvas, or randomness',
);
check(
  JSON.stringify(engine.ANIMS.map(({ id }) => id))
      === JSON.stringify(['idle', 'walk', 'attack', 'cast', 'hurt', 'death'])
    && engine.SHEET_COLS === 20
    && !Object.hasOwn(engine, 'PLAYER_DEATH_ANIMATION')
    && !runtimeSources['sprite-engine.js'].includes('death-animation')
    && runtimeSources['engine/catalogs/animation.js'].includes("../death-animation.js"),
  'approved Player Death must be public after Hurt while its focused profile stays internal',
);
check(
  Object.isFrozen(deathModule.PLAYER_DEATH_PROFILE)
    && Object.isFrozen(deathModule.PLAYER_DEATH_ANIMATION)
    && deathModule.PLAYER_DEATH_PROFILE.id === 'player-death-v1'
    && deathModule.PLAYER_DEATH_PROFILE.version === 1
    && deathModule.PLAYER_DEATH_PROFILE.animation === deathModule.PLAYER_DEATH_ANIMATION
    && JSON.stringify(deathModule.PLAYER_DEATH_ANIMATION)
      === JSON.stringify({ id: 'death', name: 'Death', frames: 4, ms: 160 }),
  'the isolated Player Death profile and animation identity must remain exact and immutable',
);
const expectedPlayerDeathPoses = [
  { phase: 'stagger', bodyBob: 0, leg: -1, arm: -1, quarterTurn: false },
  { phase: 'buckle', bodyBob: 1, leg: 1, arm: 1, quarterTurn: false },
  { phase: 'fall', bodyBob: 1, leg: -1, arm: -1, quarterTurn: true },
  { phase: 'still', bodyBob: 0, leg: 0, arm: 0, quarterTurn: true },
];
for (let frame = 0; frame < expectedPlayerDeathPoses.length; frame++) {
  const pose = deathModule.playerDeathPose(frame);
  check(
    Object.isFrozen(pose)
      && JSON.stringify(pose) === JSON.stringify(expectedPlayerDeathPoses[frame]),
    `Player Death pose ${frame} must remain exact and immutable`,
  );
}
for (const invalidFrame of [-1, 0.5, 4, Number.NaN]) {
  let deathError = null;
  try {
    deathModule.playerDeathPose(invalidFrame);
  } catch (error) {
    deathError = error;
  }
  check(
    deathError instanceof RangeError,
    `Player Death must reject invalid frame ${String(invalidFrame)} with RangeError`,
  );
}
const deathMarkerPixels = Array.from(
  { length: engine.SIZE * engine.SIZE },
  (_, index) => index,
);
for (const direction of engine.DIRS) {
  for (const frame of [2, 3]) {
    const transformed = deathModule.transformPlayerDeathPixels(
      deathMarkerPixels,
      direction,
      frame,
      engine.SIZE,
    );
    check(
      transformed !== deathMarkerPixels
        && transformed.length === deathMarkerPixels.length
        && new Set(transformed).size === deathMarkerPixels.length
        && deathMarkerPixels.every((marker) => transformed.includes(marker)),
      `Player Death ${direction} frame ${frame} must be a deep-copied coordinate permutation`,
    );
  }
}
check(
  runtimeSources['engine/renderer.js'].includes("if (animId === 'death')")
    && runtimeSources['engine/renderer.js'].includes('transformPlayerDeathPixels')
    && runtimeSources['engine/renderer.js'].includes("spec.kind === 'player' && p.death"),
  'the isolated Player Death renderer path must remain guarded to Player Death calls',
);
const gamePackImports = [
  ...runtimeSources['engine/game-pack.js'].matchAll(/from\s+['"]([^'"]+)['"]/g),
].map((match) => match[1]).sort();
check(
  JSON.stringify(gamePackImports) === JSON.stringify(['./catalogs.js']),
  'the Wildshot game-pack policy must depend only on the stable internal catalog facade',
);
check(
  !/\b(document|window|localStorage|sessionStorage|canvas|getContext|buildStoredZip|drawSprite|drawAssembledSprite)\b/
    .test(runtimeSources['engine/game-pack.js']),
  'the Wildshot game-pack policy must not depend on DOM, storage, canvas, ZIP, or renderers',
);
const editableSnapshotSource = runtimeSources['app.js'].slice(
  runtimeSources['app.js'].indexOf('function editableSnapshot('),
  runtimeSources['app.js'].indexOf('function sanitizeProductionRollSession('),
);
const historySnapshotSource = runtimeSources['app.js'].slice(
  runtimeSources['app.js'].indexOf('function historySnapshot('),
  runtimeSources['app.js'].indexOf('function snapshotsMatch('),
);
const setStateSource = runtimeSources['app.js'].slice(
  runtimeSources['app.js'].indexOf('function setState('),
  runtimeSources['app.js'].indexOf('function restoreSnapshot('),
);
const restoreSnapshotSource = runtimeSources['app.js'].slice(
  runtimeSources['app.js'].indexOf('function restoreSnapshot('),
  runtimeSources['app.js'].indexOf('function undo('),
);
const optionGroupSource = runtimeSources['app.js'].slice(
  runtimeSources['app.js'].indexOf('function createOptionGroup('),
  runtimeSources['app.js'].indexOf('function randomDifferent('),
);
const playerGroupsSource = runtimeSources['app.js'].slice(
  runtimeSources['app.js'].indexOf('function playerGroups('),
  runtimeSources['app.js'].indexOf('function enemyGroups('),
);
const rollProductionSource = runtimeSources['app.js'].slice(
  runtimeSources['app.js'].indexOf('function rollProduction()'),
  runtimeSources['app.js'].indexOf('function randomize()'),
);
const compatibleRerollSource = runtimeSources['app.js'].slice(
  runtimeSources['app.js'].indexOf('function rerollCompatibleCategory('),
  runtimeSources['app.js'].indexOf('function randomize()'),
);
const wildcardRollSource = runtimeSources['app.js'].slice(
  runtimeSources['app.js'].indexOf('function randomize()'),
  runtimeSources['app.js'].indexOf('async function triggerDownload('),
);
const compatibleFieldSource = runtimeSources['app.js'].slice(
  runtimeSources['app.js'].indexOf('const PLAYER_COMPATIBLE_REROLL_FIELDS'),
  runtimeSources['app.js'].indexOf('const historyPast'),
);
const productionPersistenceSources = [
  runtimeSources['app.js'].slice(
    runtimeSources['app.js'].indexOf('function sanitizePlayer('),
    runtimeSources['app.js'].indexOf('function sanitizeEnemy('),
  ),
  runtimeSources['app.js'].slice(
    runtimeSources['app.js'].indexOf('function sanitizePackEntry('),
    runtimeSources['app.js'].indexOf('function loadPackLibrary('),
  ),
  runtimeSources['app.js'].slice(
    runtimeSources['app.js'].indexOf('function addCurrentToPack('),
    runtimeSources['app.js'].indexOf('function loadPackEntry('),
  ),
  runtimeSources['app.js'].slice(
    runtimeSources['app.js'].indexOf('function sanitizePreset('),
    runtimeSources['app.js'].indexOf('function loadPresetLibrary('),
  ),
  runtimeSources['app.js'].slice(
    runtimeSources['app.js'].indexOf('function savePreset('),
    runtimeSources['app.js'].indexOf('function loadSelectedPreset('),
  ),
  editableSnapshotSource,
];
check(
  JSON.stringify(productionRollImports) === JSON.stringify(['./catalogs.js', './class-templates.js']),
  'production rolls must depend only on stable catalogs and class-template policy',
);
check(
  JSON.stringify(productionRerollImports) === JSON.stringify([
    './catalogs.js',
    './production-rolls.js',
  ]),
  'compatible Production rerolls must depend only on stable catalogs and the approved Production policy',
);
check(
  !/\b(?:document|window|localStorage|sessionStorage|indexedDB|CanvasRenderingContext2D|drawSprite|renderSprite|buildStoredZip)\b/.test(
    runtimeSources['engine/production-rolls.js'],
  ),
  'production rolls must not depend on DOM, canvas, storage, ZIP, or renderer behavior',
);
check(
  !/\b(?:document|window|localStorage|sessionStorage|indexedDB|CanvasRenderingContext2D|drawSprite|renderSprite|buildStoredZip)\b/.test(
    runtimeSources['engine/production-rerolls.js'],
  )
    && !runtimeSources['engine/production-rerolls.js'].includes('Math.random'),
  'compatible Production rerolls must remain portable and independent from DOM, canvas, storage, ZIP, renderers, and ambient randomness',
);
check(
  compatibleRerollSource.includes('E.rerollProductionPlayerCategory(')
    && compatibleRerollSource.includes('E.PRODUCTION_COMPATIBLE_REROLL_CATEGORIES.find('),
  'compatible Production category actions must use only the stable sprite-engine.js facade API',
);
check(
  optionGroupSource.includes("compatibleButton.className = 'category-compatible'")
    && optionGroupSource.includes("compatibleButton.textContent = 'C'")
    && optionGroupSource.includes('`Compatible reroll ${actionName}`')
    && optionGroupSource.includes('compatibleButton.disabled = !canCompatibleReroll'),
  'supported Player categories must expose explicit accessible C buttons that stay disabled without Production context',
);
check(
  optionGroupSource.includes('`Wildcard reroll ${label}`')
    && wildcardRollSource.includes('E.randomPlayer()')
    && wildcardRollSource.includes('{ productionRoll: null }'),
  'existing Player randomizers must remain explicit unrestricted Wildcard actions and whole-character Wildcard must clear Production context',
);
check(
  JSON.stringify(
    [...compatibleFieldSource.matchAll(/^\s{2}(\w+): '(\w+)',$/gm)]
      .map((match) => [match[1], match[2]]),
  ) === JSON.stringify([
    ['outfitTier', 'powerTier'],
    ['species', 'species'],
    ['bodyBuild', 'bodyBuild'],
    ['skin', 'skin'],
    ['hairStyle', 'hairStyle'],
    ['hairColor', 'hairColor'],
    ['expression', 'expression'],
    ['faceDetail', 'faceDetail'],
    ['headgear', 'headgear'],
    ['outfitColor', 'outfitColor'],
    ['weapon', 'weapon'],
    ['shield', 'shield'],
    ['offhand', 'offhand'],
  ])
    && !compatibleFieldSource.includes('leftHand')
    && [...compatibleFieldSource.matchAll(/PLAYER_COMPATIBLE_REROLL_FIELDS\.(\w+)/g)].length === 0
    && [...playerGroupsSource.matchAll(/PLAYER_COMPATIBLE_REROLL_FIELDS\.(\w+)/g)].length === 13,
  'the editor must expose only the thirteen explicit uncoupled Player mappings, with armor tier routed to semantic powerTier',
);
check(
  stylesSource.includes('.category-compatible')
    && stylesSource.includes('.category-compatible:not(:disabled):hover')
    && stylesSource.includes('.category-compatible:disabled'),
  'compatible category controls must remain visually distinct and communicate their disabled state',
);
check(
  !runtimeSources['engine/production-rolls.js'].includes('Math.random')
    && !/\bwhile\s*\(/.test(runtimeSources['engine/production-rolls.js'])
    && runtimeSources['engine/production-rolls.js'].includes(
      'attempts <= PRODUCTION_ROLL_MAX_ATTEMPTS',
    ),
  'Production Roll must use only its portable seed stream and a statically bounded retry loop',
);
check(runtimeSources['app.js'].includes("from './zip.js'"), 'app.js must use the standalone ZIP packaging utility');
check(runtimeSources['app.js'].includes("PRESET_VERSION = 12"), 'app.js must use preset schema v12 for off-hand persistence');
check(
  runtimeSources['app.js'].includes('saved.version > PRESET_VERSION'),
  'app.js must migrate preset libraries from every legacy version through v10',
);
check(runtimeSources['app.js'].includes('PALETTE_VERSION = 1'), 'app.js must keep reusable palettes under an explicit versioned schema');
check(runtimeSources['app.js'].includes('HISTORY_LIMIT = 100'), 'app.js must keep bounded sprite-edit history');
check(runtimeSources['app.js'].includes("['mode', 'player', 'enemy', 'effect', 'loadout', 'outlineMode', 'shadeMode', 'previewEffects', 'characterName', 'exportName']"), 'app.js history must include combat loadouts, outlines, shading, and Production Roll effect treatment while remaining scoped to the editable sprite document');
check(
  runtimeSources['app.js'].includes('function historySnapshot(')
    && runtimeSources['app.js'].includes('previewEffects: source.previewEffects === true')
    && !editableSnapshotSource.includes('previewEffects'),
  'Production Roll history must restore Effects Off without adding effect-preview metadata to presets or comparison snapshots',
);
check(
  historySnapshotSource.includes('productionRoll: sanitizeProductionRollSession(productionRoll)')
    && restoreSnapshotSource.includes(
      'lastProductionRoll = sanitizeProductionRollSession(snapshot.productionRoll)',
    )
    && setStateSource.includes('historySnapshot(next, nextProductionRoll)')
    && !editableSnapshotSource.includes('productionRoll')
    && !editableSnapshotSource.includes('paletteFamily'),
  'compatible Production context must be undoable in memory while remaining outside persisted, preset, and comparison snapshots',
);
check(runtimeSources['engine/sheets.js'].includes('drawAssembledSprite'), 'assembled sheet exports must use the shared assembled-output coordinator');
check(runtimeSources['app.js'].includes('E.drawAssembledSprite('), 'assembled editor previews must use the shared assembled-output coordinator');
check(
  runtimeSources['app.js'].includes('const DEFAULT_SHADE_MODE = E.SHADE_MODE_FORM')
    && runtimeSources['app.js'].match(/shadeMode: DEFAULT_SHADE_MODE/g)?.length === 3,
  'new and reset Player/Enemy editor documents must default to approved Form shading',
);
check(
  runtimeSources['app.js'].includes("Object.prototype.hasOwnProperty.call(saved, 'shadeMode')")
    && runtimeSources['app.js'].includes(': DEFAULT_SHADE_MODE,'),
  'pre-shade editor state must adopt the approved Form default without changing versioned preset/pack migration',
);
check(runtimeSources['app.js'].includes('renderShadeControls()'), 'app.js must expose the approved player/enemy shade selector');
check(runtimeSources['app.js'].includes("state.mode === 'player' || state.mode === 'enemy'"), 'the shade selector must stay hidden for effects');
check(
  runtimeSources['app.js'].includes('previewEffects: false')
    && runtimeSources['app.js'].includes('loaded.previewEffects = false;'),
  'combat-effect overlays must remain opt-in and return to Off whenever the editor starts',
);
check(
  runtimeSources['engine/shade-renderer.js'].includes(
    'shade === SHADE_MODE_NONE && outline === OUTLINE_MODE_NONE',
  ),
  'shade and outline None must retain a direct renderer delegation branch',
);
check(
  runtimeSources['app.js'].match(/outlineMode: assembledOutlineMode\(\{ kind, \.\.\.spec \}, raw\.outlineMode\)/g)?.length === 2,
  'preset and ordinary-pack sanitizers must preserve valid assembled enemy outlines',
);
check(
  runtimeSources['app.js'].match(/outlineMode: assembledOutlineMode\(\{ kind: 'enemy', \.\.\./g)?.length === 2,
  'enemy preset and ordinary-pack loads must restore their saved outline treatment',
);
check(
  runtimeSources['app.js'].match(/shadeMode: assembledShadeMode\(\{ kind, \.\.\.spec \}, raw\.shadeMode\)/g)?.length === 2,
  'preset and ordinary-pack sanitizers must preserve valid shade modes and migrate missing values to None',
);
check(
  runtimeSources['app.js'].match(/shadeMode: assembledShadeMode\(\{ kind: 'enemy', \.\.\./g)?.length === 2,
  'enemy preset and ordinary-pack loads must restore their saved shade treatment',
);
check(runtimeSources['app.js'].includes('renderOutlineControls()'), 'app.js must expose the optional sprite outline selector');
check(
  entrySource.includes('>Production Roll</button>')
    && entrySource.includes('>Wildcard Roll</button>')
    && runtimeSources['app.js'].includes('function rollProduction()')
    && runtimeSources['app.js'].includes('E.rollProductionPlayer(createProductionRollSeed())'),
  'the editor must expose separate Production and Wildcard whole-character actions through the public engine facade',
);
check(
  runtimeSources['app.js'].includes('shadeMode: E.PRODUCTION_ROLL_FREEZE.presentation.shadeMode')
    && runtimeSources['app.js'].includes('previewEffects: false')
    && !rollProductionSource.includes('outlineMode:'),
  'Production Roll must apply frozen Form shading and Effects Off while preserving the current outline treatment',
);
check(
  runtimeSources['app.js'].includes('let lastProductionRoll = null')
    && runtimeSources['app.js'].includes('function sanitizeProductionRollSession(')
    && runtimeSources['app.js'].includes('archetypeName:')
    && runtimeSources['app.js'].includes('powerTierName:')
    && !editableSnapshotSource.includes('productionRoll'),
  'the editor must show ephemeral Production context without adding roll provenance to stored state',
);
check(
  compatibleRerollSource.includes('if (!result.changed)')
    && compatibleRerollSource.includes('renderProductionRollControls();')
    && compatibleRerollSource.includes('setState({ player }, {')
    && compatibleRerollSource.includes('preserveCompatibleNotice: true')
    && !compatibleRerollSource.includes('outlineMode')
    && !compatibleRerollSource.includes('shadeMode')
    && !compatibleRerollSource.includes('previewEffects'),
  'compatible category rerolls must be one undoable Player edit, report no-alternative results, and preserve presentation settings',
);
check(
  productionPersistenceSources.every((source) => (
    !/\b(?:profile|seed|archetype|powerTier|paletteFamily|decisions)\s*:/.test(source)
      && !source.includes('lastProductionRoll')
      && !source.includes('rollProductionPlayer')
  )),
  'presets, ordinary packs, comparisons, and persisted player specifications must not store Production Roll provenance',
);
const approvedOutlineFamilies = JSON.parse(
  await readFile(path.join(root, 'tools', 'fixtures', 'approved-outline-families.json'), 'utf8'),
);
check(
  JSON.stringify(engine.ENEMY_OUTLINE_PILOT_FAMILIES) === JSON.stringify(approvedOutlineFamilies),
  `enemy outline support must stay limited to the ${approvedOutlineFamilies.length} approval-gated families recorded in tools/fixtures/approved-outline-families.json (append the id there when a new family's outline is approved)`,
);
for (const familyId of engine.ENEMY_OUTLINE_PILOT_FAMILIES) {
  check(
    engine.ENEMIES.some((family) => family.id === familyId),
    `enemy outline family ${familyId} must exist in the enemy catalog`,
  );
  check(
    engine.enemySupportsOutline({ kind: 'enemy', family: familyId }),
    `enemy outline family ${familyId} must opt into outline rendering`,
  );
}
check(
  !engine.enemySupportsOutline({ kind: 'enemy', family: 'not-a-family' }),
  'unknown enemies must remain on the original renderer',
);
check(
  !engine.enemySupportsOutline({ kind: 'player', family: 'bandit' }),
  'enemy outline support must never classify player specs as outlined enemies',
);
check(
  !engine.enemySupportsOutline({ kind: 'effect', family: 'bandit' }),
  'enemy outline support must never classify effect specs as outlined enemies',
);
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
check(engine.SHEET_COLS * engine.SIZE === 480 && engine.DIRS.length * engine.SIZE === 96, 'native full-sheet dimensions must be 480x96 pixels');
check(engine.SHEET_COLS * engine.SIZE === 480 && engine.SIZE === 24, 'native direction-sheet dimensions must be 480x24 pixels');
check(engine.ANIMS.every((anim) => anim.frames * engine.SIZE === 48 || anim.frames * engine.SIZE === 96), 'native animation-sheet widths must remain 48 or 96 pixels');
check(runtimeSources['app.js'].includes("PACK_STORAGE_KEY = 'sprite-assembler-character-pack-v1'"), 'character packs must use independent versioned persistence');
check(runtimeSources['app.js'].includes('PACK_VERSION = 3'), 'ordinary character packs must use schema v3 for off-hand persistence');
check(runtimeSources['app.js'].includes('[1, 2, PACK_VERSION].includes(saved.version)'), 'ordinary character packs must migrate stored v1 and v2 libraries to v3');
check(runtimeSources['app.js'].includes('PACK_ENTRY_LIMIT = 200'), 'character packs must keep a bounded entry count');
check(runtimeSources['app.js'].includes('function loadPackLibrary(') && runtimeSources['app.js'].includes('function persistPackLibrary('), 'character packs must load and persist their working library');
check(runtimeSources['app.js'].includes('assembledRenderOptions(spec, entry.outlineMode, entry.shadeMode)'), 'character packs must always export complete sprite sheets with their saved outline and shade treatments');
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
check(characterKit.MASTER_CHARACTER_KIT_VERSION === 2, 'master kits must use schema v2 for utility off-hand layers');
check(characterKit.MASTER_CHARACTER_KIT_SCALE === 1, 'master kits must export native logical pixels');
check(
  JSON.stringify(characterKit.MASTER_CHARACTER_KIT_LAYER_ORDER) === JSON.stringify([
    'weapon-back', 'shield-back', 'offhand-back', 'body', 'shield-front', 'offhand-front', 'weapon-front',
  ]),
  'master kits must preserve the renderer draw order across composable layers',
);
const masterKitPlayer = {
  species: 'human', bodyBuild: 'classic', skin: 'peach', hairStyle: 'spiky', hairColor: 'brown', expression: 'neutral', faceDetail: 'none', headgear: 'none',
  outfit: 'tunic', outfitTier: 'tier1', outfitColor: 'royal', weapon: 'sword', weaponTier: 'tier1',
  shield: 'round', shieldTier: 'tier1', offhand: 'none', palette: null,
};
const masterKitPlan = characterKit.buildMasterCharacterKitPlan(masterKitPlayer);
check(masterKitPlan.bodies.length === 756, 'master kits must include every outfit, catalog color, and headgear body combination');
check(masterKitPlan.weapons.length === 75, 'master kits must include all fifteen weapons at all five tiers');
check(masterKitPlan.shields.length === 280, 'master kits must include all eight shields at all five tiers and seven catalog colors');
check(masterKitPlan.offhands.length === 1, 'master kits must include the Lantern as a dedicated utility off-hand');
check(masterKitPlan.counts.totalPngs === 1469, 'standard master kits must contain 1469 native PNG sheets including the assembled preview');
check(masterKitPlan.bodies.every((entry) => entry.layer === 'body' && entry.spec.weapon === 'none' && entry.spec.shield === 'none' && entry.spec.offhand === 'none'), 'master-kit bodies must not bake weapons, shields, or off-hand items');
check(masterKitPlan.weapons.every((entry) => entry.files.back.endsWith('/back.png') && entry.files.front.endsWith('/front.png')), 'every master-kit weapon must expose separate back and front layers');
check(masterKitPlan.shields.every((entry) => entry.files.back.endsWith('/back.png') && entry.files.front.endsWith('/front.png')), 'every master-kit shield must expose separate back and front layers');
check(masterKitPlan.offhands.every((entry) => entry.files.back.endsWith('/back.png') && entry.files.front.endsWith('/front.png')), 'every master-kit utility off-hand must expose separate back and front layers');
const masterKitPaths = [
  ...masterKitPlan.bodies.map((entry) => entry.file),
  ...masterKitPlan.weapons.flatMap((entry) => [entry.files.back, entry.files.front]),
  ...masterKitPlan.shields.flatMap((entry) => [entry.files.back, entry.files.front]),
  ...masterKitPlan.offhands.flatMap((entry) => [entry.files.back, entry.files.front]),
  'preview/default.png',
];
check(new Set(masterKitPaths).size === masterKitPlan.counts.totalPngs, 'every master-kit PNG path must be unique');
const customKitPlan = characterKit.buildMasterCharacterKitPlan({
  ...masterKitPlayer,
  palette: { skin: ['#123456', '#234567'], hair: ['#345678', '#456789'], outfit: ['#56789a', '#6789ab'] },
});
check(customKitPlan.counts.outfitColors === 8 && customKitPlan.counts.totalPngs === 1657, 'master kits must add the current custom outfit color without replacing catalog colors');
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
check(characterKit.COMPLETE_CHARACTER_KIT_VERSION === 12, 'complete character kits must use schema v12 for utility off-hand components');
check(characterKit.COMPLETE_CHARACTER_KIT_RECIPE_LIMIT === 24, 'complete character kits must support up to 24 deduplicated recipes');
check(characterKit.COMPLETE_CHARACTER_PACK_FORMAT === '8-bit-sprite-assembler-complete-character-pack', 'combined complete packs must expose a distinct stable format id');
check(characterKit.COMPLETE_CHARACTER_PACK_VERSION === 12, 'combined complete packs must use schema v12 for utility off-hand components');
check(
  JSON.stringify(characterKit.COMPLETE_CHARACTER_KIT_LAYER_ORDER) === JSON.stringify([
    'weapon-back', 'shield-back', 'offhand-back', 'species-back', 'outfit-back', 'outfit', 'skin-body', 'head',
    'expression', 'species-front', 'face-detail', 'hair', 'headgear', 'shield-front', 'offhand-front', 'weapon-front',
  ]),
  'complete character kits must publish the exact atomic component draw order',
);
const completeKitPlan = characterKit.buildCompleteCharacterKitPlan(rosterKitEntries);
check(completeKitPlan.recipes.length === 24, 'complete character kits must retain 24 saved characters as lightweight recipes');
check(
  completeKitPlan.recipes.every((recipe) => (
    recipe.outlineMode === engine.OUTLINE_MODE_NONE
      && recipe.shadeMode === engine.SHADE_MODE_NONE
  )),
  'legacy Complete Kit recipes must migrate missing outline and shade metadata to None',
);
const shadedCompleteKitPlan = characterKit.buildCompleteCharacterKitPlan([{
  ...rosterKitEntries[0],
  outlineMode: engine.OUTLINE_MODE_SELECTIVE_C,
  shadeMode: engine.SHADE_MODE_FORM,
}]);
check(
  shadedCompleteKitPlan.recipes[0]?.outlineMode === engine.OUTLINE_MODE_SELECTIVE_C
    && shadedCompleteKitPlan.recipes[0]?.shadeMode === engine.SHADE_MODE_FORM,
  'Complete Kit schema v12 recipes must retain approved outline and shade metadata',
);
// Complete Kits plan the PUBLIC catalog (legacy families plus approved
// expansion slices), so kit counts derive from PUBLIC_ENEMIES — registering
// the next slice needs no golden bumps here.
const publicEnemyFamilyCount = engine.PUBLIC_ENEMIES.length;
const publicEnemyVariantCount = engine.PUBLIC_ENEMIES.reduce((total, family) => total + family.variants.length, 0);
check(
  completeKitPlan.counts.componentPngs === 1912
    && completeKitPlan.counts.enemyFamilies === publicEnemyFamilyCount
    && completeKitPlan.counts.enemySheets === publicEnemyVariantCount
    && completeKitPlan.counts.effectCategories === 4
    && completeKitPlan.counts.effectSheets === 24
    && completeKitPlan.counts.totalPngs === 1912 + publicEnemyVariantCount + 24 + 1,
  `complete character kits must contain 1912 content-unique components, ${publicEnemyVariantCount} public enemies, 24 synchronized effects, and one reference preview`,
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
  completeKitPlan.components.offhands.length === 2
    && completeKitPlan.components.offhands.every((entry) => entry.offhand === 'lantern'),
  'complete kits must store the Lantern as independent back and front components',
);
check(
  completeKitPlan.components.shields.filter((entry) => entry.tier === 'tier5').length === 46
    && completeKitPlan.components.shields.filter((entry) => entry.tier === 'tier5' && entry.color === 'default').length === 11,
  'Tier 5 shield components must collapse the four artifact passes whose colors are fully overwritten',
);
const completeEnemyEntries = completeKitPlan.enemies.flatMap((family) => family.variants);
check(
  completeKitPlan.enemies.length === publicEnemyFamilyCount && completeEnemyEntries.length === publicEnemyVariantCount,
  'complete kits must plan every public enemy family and variation',
);
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
  ...completeKitPlan.components.offhands.map((entry) => entry.file),
  ...completeEnemyEntries.map((entry) => entry.file),
  ...completeEffectEntries.map((entry) => entry.file),
  completeKitPlan.reference.file,
];
check(new Set(completeKitPaths).size === completeKitPaths.length, 'every Complete Character Kit PNG path must be unique');
check(
  completeKitPaths.length === 1912 + publicEnemyVariantCount + 24 + 1,
  'the Complete Character Kit path list must cover every component, enemy sheet, effect, and the reference preview',
);
check(completeKitPlan.recipes.every((recipe) => !Object.values(recipe.components).some((file) => file && !completeKitPaths.includes(file))), 'every saved recipe must reference only shared component paths');
const lanternKitPlan = characterKit.buildCompleteCharacterKitPlan([{
  id: 'lantern-bearer',
  name: 'Lantern Bearer',
  kind: 'player',
  spec: {
    ...masterKitPlayer,
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'lantern',
  },
}]);
check(
  lanternKitPlan.recipes[0]?.components.offhandBack === 'components/offhands/lantern/back.png'
    && lanternKitPlan.recipes[0]?.components.offhandFront === 'components/offhands/lantern/front.png'
    && lanternKitPlan.recipes[0]?.components.shieldBack === null
    && lanternKitPlan.recipes[0]?.components.shieldFront === null,
  'Lantern recipes must select independent utility off-hand passes without shield components',
);
const malformedOffhandKitPlan = characterKit.buildCompleteCharacterKitPlan([{
  id: 'malformed-dual-offhand',
  name: 'Malformed Dual Off-hand',
  kind: 'player',
  spec: {
    ...masterKitPlayer,
    shield: 'round',
    shieldTier: 'tier3',
    offhand: 'lantern',
  },
}]);
check(
  malformedOffhandKitPlan.recipes[0]?.components.shieldBack
    && malformedOffhandKitPlan.recipes[0]?.components.shieldFront
    && malformedOffhandKitPlan.recipes[0]?.components.offhandBack === null
    && malformedOffhandKitPlan.recipes[0]?.components.offhandFront === null,
  'malformed Complete Kit recipes must preserve an equipped shield and discard the utility off-hand',
);
const partialLanternKitPlan = characterKit.buildCompleteCharacterKitPlan([{
  id: 'partial-lantern',
  name: 'Partial Lantern',
  kind: 'player',
  spec: {
    ...masterKitPlayer,
    shield: undefined,
    shieldTier: undefined,
    offhand: 'lantern',
  },
}]);
check(
  partialLanternKitPlan.recipes[0]?.components.offhandBack === 'components/offhands/lantern/back.png'
    && partialLanternKitPlan.recipes[0]?.components.offhandFront === 'components/offhands/lantern/front.png'
    && partialLanternKitPlan.recipes[0]?.components.shieldBack === null
    && partialLanternKitPlan.recipes[0]?.components.shieldFront === null,
  'partial Complete Kit recipes must normalize a missing shield to None without dropping a valid Lantern',
);
check(runtimeSources['engine/renderer.js'].includes("renderLayer === 'weapon-back'") && runtimeSources['engine/renderer.js'].includes("renderLayer === 'weapon-front'"), 'the renderer must expose separate weapon occlusion passes');
check(runtimeSources['engine/renderer.js'].includes("renderLayer === 'shield-back'") && runtimeSources['engine/renderer.js'].includes("renderLayer === 'shield-front'"), 'the renderer must expose separate shield occlusion passes');
check(runtimeSources['engine/renderer.js'].includes("renderLayer === 'offhand-back'") && runtimeSources['engine/renderer.js'].includes("renderLayer === 'offhand-front'"), 'the renderer must expose separate utility off-hand occlusion passes');
check(!runtimeSources['engine/shield-renderer.js'].includes('drawTurnedShield'), 'side shields must not apply a second perspective turn after the character turns');
check(runtimeSources['engine/shield-renderer.js'].includes('drawFullShield(S, R, originX, originY'), 'shields must reuse the unchanged broad-face artwork at the hand attachment');
check(!runtimeSources['engine/shield-renderer.js'].includes('SIDE_HANDLE_X'), 'shields must not add a detached connector beyond the body hand');
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
check(runtimeSources['app.js'].includes('MASTER_CHARACTER_KIT_SCALE, { layer, outlineMode, shadeMode }'), 'Complete Character Kits must render every requested compositing layer at native scale while keeping shade options explicit');
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
check(
  engine.HEADGEAR.find((gear) => gear.id === 'skullmask')?.hideFace === true,
  'Skull Mask must expose its existing face-covering behavior as shared visibility metadata',
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
check(
  JSON.stringify(engine.OFFHANDS.map((offhand) => offhand.id)) === JSON.stringify(['none', 'lantern']),
  'the utility off-hand catalog must expose None and Lantern in stable order',
);
check(engine.OFFHANDS.find((offhand) => offhand.id === 'lantern')?.category === 'utility', 'the Lantern must retain utility semantics');
check(runtimeSources['app.js'].includes('validId(E.OFFHANDS, player.offhand'), 'saved player specs must safely migrate missing or invalid utility off-hands');
check(runtimeSources['app.js'].includes("const offhand = shield === 'none'"), 'saved malformed player specs must give an equipped shield precedence over a utility off-hand');
check(runtimeSources['app.js'].includes("'Off-hand item'"), 'the player editor must expose a dedicated utility off-hand control');
check(runtimeSources['app.js'].includes("key === 'shield' && value !== 'none'"), 'equipping a shield must clear the utility off-hand slot');
check(runtimeSources['app.js'].includes("key === 'offhand' && value !== 'none'"), 'equipping a utility off-hand must clear the shield slot');
check(runtimeSources['engine/generators.js'].includes("offhand === 'none' ? rnd(SHIELDS).id : 'none'"), 'random players must keep shields and utility off-hands mutually exclusive');
check(runtimeSources['engine/renderer.js'].includes("from './offhand-renderer.js'"), 'humanoid rendering must use the focused utility off-hand renderer');
check(runtimeSources['engine/offhand-renderer.js'].includes("C.offhand !== 'lantern'"), 'the utility off-hand renderer must gate the approved Lantern family');
check(runtimeSources['engine/offhand-renderer.js'].includes("viewDir === 'left' ? 'front' : 'behind'"), 'the Lantern must preserve direction-aware near/far hand depth');

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

function renderOutlinedPixels(spec, dir, animId, frame, outlineMode, opts = {}) {
  const pixels = new Array(engine.SIZE * engine.SIZE).fill(null);
  let fillStyle = '#000000';
  const ctx = {
    clearRect() { pixels.fill(null); },
    get fillStyle() { return fillStyle; },
    set fillStyle(value) { fillStyle = value; },
    fillRect(x, y, width, height) {
      for (let py = y; py < y + height; py++) {
        for (let px = x; px < x + width; px++) {
          if (px >= 0 && py >= 0 && px < engine.SIZE && py < engine.SIZE) {
            pixels[(py * engine.SIZE) + px] = fillStyle;
          }
        }
      }
    },
  };
  engine.drawOutlinedSprite(ctx, spec, dir, animId, frame, {
    ...opts,
    shadow: false,
    outlineMode,
  });
  return pixels;
}

function renderAssembledPixels(
  spec,
  dir,
  animId,
  frame,
  {
    shadeMode = engine.SHADE_MODE_NONE,
    outlineMode = engine.OUTLINE_MODE_NONE,
    shadow = false,
    ...opts
  } = {},
) {
  const pixels = new Array(engine.SIZE * engine.SIZE).fill(null);
  let fillStyle = '#000000';
  const ctx = {
    clearRect() { pixels.fill(null); },
    get fillStyle() { return fillStyle; },
    set fillStyle(value) { fillStyle = value; },
    fillRect(x, y, width, height) {
      for (let py = y; py < y + height; py++) {
        for (let px = x; px < x + width; px++) {
          if (px >= 0 && py >= 0 && px < engine.SIZE && py < engine.SIZE) {
            pixels[(py * engine.SIZE) + px] = fillStyle;
          }
        }
      }
    },
  };
  engine.drawAssembledSprite(ctx, spec, dir, animId, frame, {
    ...opts,
    shadow,
    shadeMode,
    outlineMode,
  });
  return pixels;
}

function pixelsMatch(left, right) {
  return left.length === right.length && left.every((pixel, index) => pixel === right[index]);
}

check(
  JSON.stringify(engine.SHADE_MODES.map((mode) => mode.id)) === JSON.stringify(['none', 'form']),
  'shade modes must expose stable None and Form ids',
);
check(engine.normalizeShadeMode() === engine.SHADE_MODE_NONE, 'missing shade ids must sanitize to None');
check(engine.normalizeShadeMode('invalid') === engine.SHADE_MODE_NONE, 'invalid shade ids must sanitize to None');
check(engine.normalizeShadeMode(engine.SHADE_MODE_FORM) === engine.SHADE_MODE_FORM, 'Form must remain a stable shade id');
check(
  engine.normalizeAssembledOutlineMode(
    { kind: 'enemy', family: 'slime', variant: 'lime' },
    engine.OUTLINE_MODE_COMPLETE_B,
  ) === engine.OUTLINE_MODE_COMPLETE_B,
  'legacy enemy preset and ordinary-pack entries must preserve valid outline ids',
);
check(
  engine.normalizeAssembledOutlineMode(
    { kind: 'enemy', family: 'slime', variant: 'lime' },
    'invalid',
  ) === engine.OUTLINE_MODE_NONE,
  'legacy enemy preset and ordinary-pack entries must migrate invalid outline ids to None',
);
check(
  engine.normalizeAssembledOutlineMode(
    { kind: 'enemy', family: 'slime', variant: 'lime' },
  ) === engine.OUTLINE_MODE_NONE,
  'legacy enemy preset and ordinary-pack entries must migrate missing outline ids to None',
);
check(
  engine.normalizeAssembledOutlineMode(
    { kind: 'effect', category: 'trails', effect: 'sword-slash' },
    engine.OUTLINE_MODE_COMPLETE_B,
  ) === engine.OUTLINE_MODE_NONE,
  'effect entries must remain outside assembled outline persistence',
);

const pixelBufferParitySpec = {
  kind: 'player',
  species: 'human',
  bodyBuild: 'classic',
  skin: 'peach',
  hairStyle: 'spiky',
  hairColor: 'brown',
  expression: 'neutral',
  faceDetail: 'none',
  headgear: 'none',
  outfit: 'tunic',
  outfitTier: 'tier1',
  outfitColor: 'charcoal',
  weapon: 'sword',
  weaponTier: 'tier1',
  shield: 'round',
  shieldTier: 'tier1',
  palette: null,
};
check(
  pixelsMatch(
    pixelBuffer.renderSpritePixels(
      pixelBufferParitySpec,
      'down',
      'idle',
      0,
      { shadow: false },
    ),
    renderPixels(pixelBufferParitySpec, 'down', 'idle', 0),
  ),
  'shared pixel-buffer capture must remain pixel-identical to the source renderer',
);
check(
  pixelBuffer.isTransparentPixel(null)
    && pixelBuffer.isTransparentPixel(undefined)
    && !pixelBuffer.isTransparentPixel('#000000'),
  'shared pixel-buffer transparency checks must distinguish only nullish cells',
);

const shadeNonePlayerParitySpecs = [
  pixelBufferParitySpec,
  {
    ...pixelBufferParitySpec,
    species: 'elf',
    bodyBuild: 'sturdy',
    expression: 'determined',
    headgear: 'plumed',
    outfit: 'plate',
    outfitTier: 'tier5',
    weapon: 'greatsword',
    weaponTier: 'tier5',
    shield: 'kite',
    shieldTier: 'tier5',
  },
  {
    ...pixelBufferParitySpec,
    species: 'lizardfolk',
    bodyBuild: 'lean',
    skin: 'orc',
    hairStyle: 'mohawk',
    hairColor: 'ginger',
    expression: 'surprised',
    faceDetail: 'warpaint',
    outfit: 'ranger',
    outfitTier: 'tier4',
    outfitColor: 'forest',
    weapon: 'spear',
    weaponTier: 'tier5',
    shield: 'none',
  },
  {
    ...pixelBufferParitySpec,
    species: 'tiefling',
    bodyBuild: 'heroic',
    skin: 'pale',
    hairStyle: 'bald',
    expression: 'angry',
    outfit: 'robe',
    outfitTier: 'tier5',
    outfitColor: 'purple',
    weapon: 'staff',
    weaponTier: 'tier5',
    shield: 'arcane',
    shieldTier: 'tier5',
  },
  {
    ...pixelBufferParitySpec,
    species: 'undead',
    bodyBuild: 'classic',
    hairStyle: 'bald',
    outfit: 'necromancer',
    outfitTier: 'tier3',
    weapon: 'wand',
    weaponTier: 'tier4',
    shield: 'bone',
    shieldTier: 'tier4',
  },
  {
    ...pixelBufferParitySpec,
    species: 'dwarf',
    bodyBuild: 'sturdy',
    hairStyle: 'braids',
    hairColor: 'white',
    expression: 'happy',
    faceDetail: 'beard',
    headgear: 'circlet',
    outfit: 'cleric',
    outfitTier: 'tier4',
    outfitColor: 'gold',
    weapon: 'mace',
    weaponTier: 'tier5',
    shield: 'heater',
    shieldTier: 'tier5',
    palette: {
      skin: ['#b56c53', '#7a3f39'],
      hair: ['#d9c7a5', '#8b765d'],
      outfit: ['#4f7f70', '#2f4d48'],
    },
  },
];
let shadeNonePlayerParityCases = 0;
for (const spec of shadeNonePlayerParitySpecs) for (const direction of engine.DIRS) {
  for (const animation of engine.ANIMS) for (let frame = 0; frame < animation.frames; frame++) {
    const source = renderPixels(spec, direction, animation.id, frame);
    const assembled = renderAssembledPixels(spec, direction, animation.id, frame);
    check(
      pixelsMatch(source, assembled),
      `shade/outline None must preserve sampled player ${direction} ${animation.id}/${frame + 1}`,
    );
    for (const outlineMode of [
      engine.OUTLINE_MODE_COMPLETE_B,
      engine.OUTLINE_MODE_SELECTIVE_C,
    ]) {
      const outlined = renderOutlinedPixels(spec, direction, animation.id, frame, outlineMode);
      const assembledOutlined = renderAssembledPixels(spec, direction, animation.id, frame, {
        outlineMode,
      });
      check(
        pixelsMatch(outlined, assembledOutlined),
        `shade None plus ${outlineMode} must preserve sampled player ${direction} ${animation.id}/${frame + 1}`,
      );
    }
    shadeNonePlayerParityCases++;
  }
}

let shadeNoneEnemyParityCases = 0;
let shadeNoneEnemyOutlineParityCases = 0;
let formEnemyAuditCases = 0;
let formEnemyCombinedOutlineCases = 0;
let enemyCastAliasCases = 0;
let enemyDeathAliasCases = 0;
for (const family of engine.ENEMIES) for (const variant of family.variants) {
  const spec = { kind: 'enemy', family: family.id, variant: variant.id };
  for (const direction of engine.DIRS) for (const animation of engine.ANIMS) {
    for (let frame = 0; frame < animation.frames; frame++) {
      const source = renderPixels(spec, direction, animation.id, frame);
      if (animation.id === 'cast') {
        const attackAlias = renderPixels(spec, direction, 'attack', frame);
        check(
          pixelsMatch(source, attackAlias),
          `${family.id}/${variant.id} ${direction} Cast frame ${frame + 1} must alias Attack exactly`,
        );
        enemyCastAliasCases++;
      }
      if (animation.id === 'death') {
        const hurtAlias = renderPixels(spec, direction, 'hurt', Math.min(frame, 1));
        check(
          pixelsMatch(source, hurtAlias),
          `${family.id}/${variant.id} ${direction} Death frame ${frame + 1} must alias Hurt frame ${Math.min(frame, 1) + 1} exactly`,
        );
        enemyDeathAliasCases++;
      }
      const assembled = renderAssembledPixels(spec, direction, animation.id, frame);
      check(
        pixelsMatch(source, assembled),
        `shade/outline None must preserve ${family.id}/${variant.id} ${direction} ${animation.id}/${frame + 1}`,
      );
      const form = renderAssembledPixels(spec, direction, animation.id, frame, {
        shadeMode: engine.SHADE_MODE_FORM,
      });
      const repeat = renderAssembledPixels(spec, direction, animation.id, frame, {
        shadeMode: engine.SHADE_MODE_FORM,
      });
      const protectedMask = shadeModule.protectedShadeMask(source);
      const prefix = `${family.id}/${variant.id} ${direction} ${animation.id}/${frame + 1}`;
      check(pixelsMatch(form, repeat), `${prefix} Form output must be deterministic`);
      for (let index = 0; index < form.length; index++) {
        check(
          form[index] === null || /^#[0-9a-f]{6}$/.test(form[index]),
          `${prefix} Form must emit only transparent or finite in-gamut hex pixels`,
        );
        if (!source[index]) {
          check(form[index] === null, `${prefix} Form must preserve transparent source cells`);
        } else {
          check(form[index] !== internalCatalogs.INK || source[index] === internalCatalogs.INK, `${prefix} Form must not collapse a source pixel to INK`);
        }
        if (protectedMask[index]) {
          check(form[index] === source[index], `${prefix} Form must preserve protected source features`);
        }
      }
      shadeNoneEnemyParityCases++;
      formEnemyAuditCases++;
    }
  }
  for (const direction of engine.DIRS) for (const outlineMode of [
    engine.OUTLINE_MODE_COMPLETE_B,
    engine.OUTLINE_MODE_SELECTIVE_C,
  ]) {
    const source = renderPixels(spec, direction, 'attack', 1);
    const outlined = renderOutlinedPixels(spec, direction, 'attack', 1, outlineMode);
    const assembledOutlined = renderAssembledPixels(spec, direction, 'attack', 1, {
      outlineMode,
    });
    check(
      pixelsMatch(outlined, assembledOutlined),
      `shade None plus ${outlineMode} must preserve ${family.id}/${variant.id} ${direction} attack/2`,
    );
    const formOutlined = renderAssembledPixels(spec, direction, 'attack', 1, {
      shadeMode: engine.SHADE_MODE_FORM,
      outlineMode,
    });
    const prefix = `${family.id}/${variant.id} ${direction} attack/2 ${outlineMode}`;
    for (let index = 0; index < formOutlined.length; index++) {
      if (outlined[index] !== source[index]) {
        check(formOutlined[index] === outlined[index], `${prefix} Form must preserve approved outline/contact pixels`);
      } else if (formOutlined[index] !== outlined[index]) {
        check(Boolean(source[index]), `${prefix} Form may change only source-owned pixels`);
      }
    }
    shadeNoneEnemyOutlineParityCases++;
    formEnemyCombinedOutlineCases++;
  }
}

const materialUnitPixels = new Array(25).fill(null);
for (let y = 1; y <= 3; y++) for (let x = 1; x <= 3; x++) {
  materialUnitPixels[(y * 5) + x] = '#eab98a';
}
const materialUnitLookup = shadeModule.buildShadeMaterialLookup({
  kind: 'player',
  skin: 'peach',
  hairColor: 'brown',
  outfitColor: 'royal',
});
const materialUnitRamp = materialUnitLookup.get('#eab98a').ramp;
const materialUnitShaded = shadeModule.shadePixels(
  materialUnitPixels,
  materialUnitLookup,
  { width: 5, height: 5 },
);
check(
  materialUnitShaded[6] === materialUnitRamp.highlight,
  'Form top exposure must use the resolved material highlight',
);
check(
  materialUnitShaded[16] === materialUnitRamp.shadow,
  'Form bottom exposure must use the resolved material shadow',
);
check(
  materialUnitShaded[13] === materialUnitRamp.side,
  'Form right exposure must use the resolved material side shade',
);
check(
  materialUnitShaded[12] === '#eab98a',
  'Form interior material pixels must remain unchanged',
);

const precedencePixels = new Array(9).fill(null);
precedencePixels[4] = '#eab98a';
const precedenceShaded = shadeModule.shadePixels(
  precedencePixels,
  materialUnitLookup,
  { width: 3, height: 3, protectedMask: new Uint8Array(9) },
);
check(
  precedenceShaded[4] === materialUnitRamp.highlight,
  'Form top exposure must win for a feature exposed on both top and bottom',
);

const unknownUnitPixels = new Array(25).fill(null);
for (let y = 1; y <= 3; y++) for (let x = 1; x <= 3; x++) {
  unknownUnitPixels[(y * 5) + x] = '#668899';
}
const unknownUnitShaded = shadeModule.shadePixels(
  unknownUnitPixels,
  new Map(),
  { width: 5, height: 5 },
);
check(
  unknownUnitShaded.every((color) => color === null || /^#[0-9a-f]{6}$/.test(color)),
  'unknown-color fallback must emit only finite in-gamut hex colors',
);
check(
  !unknownUnitShaded.some((color, index) => color === internalCatalogs.INK && unknownUnitPixels[index] !== color),
  'unknown-color fallback must not collapse a source color to INK',
);
check(
  Number.isFinite(shadeModule.relativeLuminance('#668899'))
    && Number.isNaN(shadeModule.relativeLuminance('invalid')),
  'Form must expose a clearly bounded sRGB relative-luminance calculation',
);

let shadePilotCases = 0;
let shadePilotChangedPixels = 0;
let shadePilotProtectedPixels = 0;
let shadePilotDeterminismCases = 0;
let shadePilotMaterialControlDifferences = 0;
const shadePilotChangedById = new Map(SHADE_PILOTS.map((pilot) => [pilot.id, 0]));
const shadePilotControlDifferencesById = new Map(SHADE_PILOTS.map((pilot) => [pilot.id, 0]));
for (const pilot of SHADE_PILOTS) {
  for (const direction of engine.DIRS) for (const animation of engine.ANIMS) {
    for (let frame = 0; frame < animation.frames; frame++) {
      const source = renderPixels(pilot.spec, direction, animation.id, frame);
      const protectedMask = shadeModule.protectedShadeMask(source);
      const materialLookup = shadeModule.buildShadeMaterialLookup(pilot.spec);
      const materialForm = shadeModule.shadePixels(source, materialLookup, { protectedMask });
      const silhouetteControl = shadeModule.shadePixels(source, materialLookup, {
        protectedMask,
        silhouetteOnly: true,
      });
      for (let index = 0; index < source.length; index++) {
        if (materialForm[index] === silhouetteControl[index]) continue;
        shadePilotMaterialControlDifferences++;
        shadePilotControlDifferencesById.set(
          pilot.id,
          shadePilotControlDifferencesById.get(pilot.id) + 1,
        );
      }
      for (const outlineMode of [
        engine.OUTLINE_MODE_NONE,
        engine.OUTLINE_MODE_COMPLETE_B,
        engine.OUTLINE_MODE_SELECTIVE_C,
      ]) {
        const before = renderAssembledPixels(pilot.spec, direction, animation.id, frame, {
          outlineMode,
        });
        const form = renderAssembledPixels(pilot.spec, direction, animation.id, frame, {
          shadeMode: engine.SHADE_MODE_FORM,
          outlineMode,
        });
        const repeat = renderAssembledPixels(pilot.spec, direction, animation.id, frame, {
          shadeMode: engine.SHADE_MODE_FORM,
          outlineMode,
        });
        const prefix = `${pilot.id} ${direction} ${animation.id}/${frame + 1} ${outlineMode}`;
        check(pixelsMatch(form, repeat), `${prefix} Form output must be deterministic`);
        for (let index = 0; index < form.length; index++) {
          check(
            form[index] === null || /^#[0-9a-f]{6}$/.test(form[index]),
            `${prefix} must emit only transparent or finite in-gamut hex pixels`,
          );
          if (before[index] !== source[index]) {
            check(
              form[index] === before[index],
              `${prefix} must preserve every approved contour/contact separator`,
            );
          }
          if (protectedMask[index]) {
            check(
              form[index] === before[index],
              `${prefix} must preserve protected dark, white, and tiny-accent pixels`,
            );
            if (source[index]) shadePilotProtectedPixels++;
          }
          if (form[index] !== before[index]) {
            check(Boolean(source[index]), `${prefix} may change only source-owned pixels`);
            check(
              form[index] !== internalCatalogs.INK,
              `${prefix} must not collapse a changed source pixel to INK`,
            );
            shadePilotChangedPixels++;
            shadePilotChangedById.set(
              pilot.id,
              shadePilotChangedById.get(pilot.id) + 1,
            );
          }
        }
        shadePilotCases++;
        shadePilotDeterminismCases++;
      }
    }
  }
  const sourceWithoutShadow = renderPixels(pilot.spec, 'down', 'idle', 0);
  const sourceWithShadow = pixelBuffer.renderSpritePixels(
    pilot.spec,
    'down',
    'idle',
    0,
    { shadow: true },
  );
  const formWithShadow = renderAssembledPixels(pilot.spec, 'down', 'idle', 0, {
    shadeMode: engine.SHADE_MODE_FORM,
    shadow: true,
  });
  check(
    sourceWithoutShadow.every((
      color,
      index,
    ) => color !== null || formWithShadow[index] === sourceWithShadow[index]),
    `${pilot.id} Form must preserve the exact floor shadow and transparent background`,
  );
  check(
    shadePilotChangedById.get(pilot.id) > 0,
    `${pilot.id} must receive a visible Form treatment in the pilot`,
  );
  check(
    shadePilotControlDifferencesById.get(pilot.id) > 0,
    `${pilot.id} material-region Form must remain distinct from the silhouette-only control`,
  );
}

function cardinalPixelComponentGroups(pixels) {
  const seen = new Set();
  const components = [];
  for (let start = 0; start < pixels.length; start++) {
    if (!pixels[start] || seen.has(start)) continue;
    const component = [];
    const queue = [start];
    seen.add(start);
    while (queue.length) {
      const index = queue.pop();
      component.push(index);
      const x = index % engine.SIZE;
      const y = Math.floor(index / engine.SIZE);
      for (const [offsetX, offsetY] of [[0, -1], [-1, 0], [1, 0], [0, 1]]) {
        const nextX = x + offsetX;
        const nextY = y + offsetY;
        if (
          nextX < 0
          || nextY < 0
          || nextX >= engine.SIZE
          || nextY >= engine.SIZE
        ) continue;
        const next = (nextY * engine.SIZE) + nextX;
        if (!pixels[next] || seen.has(next)) continue;
        seen.add(next);
        queue.push(next);
      }
    }
    components.push(component);
  }
  return components;
}

function cardinalTransparentCavityGroups(pixels) {
  const seen = new Set();
  const cavities = [];
  for (let start = 0; start < pixels.length; start++) {
    if (pixels[start] || seen.has(start)) continue;
    const component = [];
    const queue = [start];
    let touchesEdge = false;
    seen.add(start);
    while (queue.length) {
      const index = queue.pop();
      component.push(index);
      const x = index % engine.SIZE;
      const y = Math.floor(index / engine.SIZE);
      if (
        x === 0
        || y === 0
        || x === engine.SIZE - 1
        || y === engine.SIZE - 1
      ) touchesEdge = true;
      for (const [offsetX, offsetY] of [[0, -1], [-1, 0], [1, 0], [0, 1]]) {
        const nextX = x + offsetX;
        const nextY = y + offsetY;
        if (
          nextX < 0
          || nextY < 0
          || nextX >= engine.SIZE
          || nextY >= engine.SIZE
        ) continue;
        const next = (nextY * engine.SIZE) + nextX;
        if (pixels[next] || seen.has(next)) continue;
        seen.add(next);
        queue.push(next);
      }
    }
    if (!touchesEdge) cavities.push(component);
  }
  return cavities;
}

function cardinalPixelComponents(pixels) {
  return cardinalPixelComponentGroups(pixels).length;
}

function cardinalSingletonIndices(pixels) {
  return cardinalPixelComponentGroups(pixels)
    .filter((component) => component.length === 1)
    .flat();
}

function adjacentOutlinePixelsAround(index, source, outlined) {
  const x = index % engine.SIZE;
  const y = Math.floor(index / engine.SIZE);
  let count = 0;
  for (let offsetY = -1; offsetY <= 1; offsetY++) {
    for (let offsetX = -1; offsetX <= 1; offsetX++) {
      if (offsetX === 0 && offsetY === 0) continue;
      const nextX = x + offsetX;
      const nextY = y + offsetY;
      if (
        nextX < 0
        || nextY < 0
        || nextX >= engine.SIZE
        || nextY >= engine.SIZE
      ) continue;
      const nextIndex = (nextY * engine.SIZE) + nextX;
      if (source[nextIndex]) continue;
      if (outlined[nextIndex] === engine.OUTLINE_COLOR) count++;
    }
  }
  return count;
}

for (const [family, variant, separatorX, separatorY] of [
  ['bandit', 'thug', 16, 12],
  ['bandit', 'brigand', 16, 12],
  ['bandit', 'sniper', 17, 12],
  ['kobold', 'skirmisher', 16, 13],
  ['kobold', 'trapper', 15, 13],
  ['kobold', 'sorcerer', 16, 13],
  ['skeleton', 'knight', 16, 12],
  ['skeleton', 'knight', 8, 12],
  ['skeleton', 'mage', 16, 12],
  ['skeleton', 'archer', 17, 12],
  ['skeleton', 'lord', 17, 15],
  ['skeleton', 'lord', 8, 12],
  ['ratfolk', 'skulker', 15, 13],
  ['ratfolk', 'plague', 16, 13],
  ['ratfolk', 'blade', 15, 13],
  ['elf', 'ranger', 17, 12],
  ['elf', 'mage', 16, 12],
  ['elf', 'duelist', 16, 12],
  ['elf', 'dark', 16, 12],
  ['gnoll', 'raider', 16, 12],
  ['gnoll', 'hunter', 17, 12],
  ['gnoll', 'alpha', 16, 12],
]) {
  const spec = { kind: 'enemy', family, variant };
  const source = renderPixels(spec, 'down', 'idle', 0);
  const none = renderOutlinedPixels(
    spec,
    'down',
    'idle',
    0,
    engine.OUTLINE_MODE_NONE,
  );
  check(
    JSON.stringify(none) === JSON.stringify(source),
    `${family} ${variant} None mode must remain pixel-identical`,
  );
  const separatorIndex = (separatorY * engine.SIZE) + separatorX;
  check(
    source[separatorIndex] && source[separatorIndex] !== engine.OUTLINE_COLOR,
    `${family} ${variant} component-aware proof must start from a colored body contact pixel`,
  );
  for (const outlineMode of [
    engine.OUTLINE_MODE_COMPLETE_B,
    engine.OUTLINE_MODE_SELECTIVE_C,
  ]) {
    const outlined = renderOutlinedPixels(spec, 'down', 'idle', 0, outlineMode);
    check(
      outlined[separatorIndex] === engine.OUTLINE_COLOR,
      `${family} ${variant} ${outlineMode} must place a body-side held-weapon separator`,
    );
  }
}

for (const [familyId, variantIds] of [
  ['dwarf', ['warrior', 'miner', 'king']],
  ['ogre', ['brute', 'crusher', 'magi']],
  ['goblin', ['scout', 'brute', 'shaman', 'archer', 'chief']],
  ['zombie', ['rotter', 'brute']],
  ['imp', ['sprite', 'pyro', 'fiend']],
  ['cultist', ['acolyte', 'zealot', 'oracle']],
  ['orc', ['grunt', 'berserker', 'warlord']],
  ['lizardfolk', ['saurian', 'marsh', 'chromatic']],
  ['minotaur', ['bull', 'ironhorn', 'warden']],
  ['demon', ['duke', 'pit', 'warlock']],
]) {
  for (const variant of variantIds) {
    const spec = { kind: 'enemy', family: familyId, variant };
    const source = renderPixels(spec, 'down', 'idle', 0);
    for (const outlineMode of [
      engine.OUTLINE_MODE_COMPLETE_B,
      engine.OUTLINE_MODE_SELECTIVE_C,
    ]) {
      const outlined = renderOutlinedPixels(spec, 'down', 'idle', 0, outlineMode);
      const separatorPixels = source.filter((
        pixel,
        index,
      ) => pixel && pixel !== engine.OUTLINE_COLOR && outlined[index] === engine.OUTLINE_COLOR);
      check(
        separatorPixels.length > 0,
        `${familyId} ${variant} ${outlineMode} must retain a body-side equipment separator`,
      );
    }
  }
}

for (const variant of ['warrior', 'king']) {
  const spec = { kind: 'enemy', family: 'dwarf', variant };
  const source = renderPixels(spec, 'up', 'attack', 2);
  const sourceGroups = cardinalPixelComponentGroups(source);
  check(
    sourceGroups.length === 2,
    `dwarf ${variant} up attack frame 3 must retain detached body and weapon components`,
  );
  for (const outlineMode of [
    engine.OUTLINE_MODE_COMPLETE_B,
    engine.OUTLINE_MODE_SELECTIVE_C,
  ]) {
    const outlined = renderOutlinedPixels(spec, 'up', 'attack', 2, outlineMode);
    check(
      sourceGroups.every((group) => group.every((index) => outlined[index])),
      `dwarf ${variant} ${outlineMode} must preserve every detached source pixel`,
    );
  }
}

for (const [familyId, variantId] of [
  ['ogre', 'magi'],
  ['goblin', 'shaman'],
  ['cultist', 'zealot'],
  ['cultist', 'oracle'],
]) {
  for (const [direction, frame, expectedComponents] of [
    ['down', 1, 2],
    ['down', 2, 2],
    ['left', 1, 3],
    ['left', 2, 3],
    ['right', 1, 3],
    ['right', 2, 3],
  ]) {
    const spec = { kind: 'enemy', family: familyId, variant: variantId };
    const source = renderPixels(spec, direction, 'attack', frame);
    const sourceGroups = cardinalPixelComponentGroups(source);
    const sparkGroups = sourceGroups.filter((group) => group.length === 1);
    check(
      sourceGroups.length === expectedComponents,
      `${familyId} ${variantId} ${direction} attack frame ${frame + 1} `
        + `must retain ${expectedComponents} body and spark components`,
    );
    check(
      sparkGroups.length === expectedComponents - 1,
      `${familyId} ${variantId} ${direction} attack frame ${frame + 1} `
        + 'must retain its authored one-pixel spell sparks',
    );
    for (const outlineMode of [
      engine.OUTLINE_MODE_COMPLETE_B,
      engine.OUTLINE_MODE_SELECTIVE_C,
    ]) {
      const outlined = renderOutlinedPixels(spec, direction, 'attack', frame, outlineMode);
      check(
        sourceGroups.every((group) => group.every((index) => outlined[index])),
        `${familyId} ${variantId} ${direction} attack frame ${frame + 1} ${outlineMode} `
          + 'must preserve every detached source pixel',
      );
      for (const [sparkIndex] of sparkGroups) {
        const sparkX = sparkIndex % engine.SIZE;
        const sparkY = Math.floor(sparkIndex / engine.SIZE);
        let adjacentOutlinePixels = 0;
        for (let offsetY = -1; offsetY <= 1; offsetY++) {
          for (let offsetX = -1; offsetX <= 1; offsetX++) {
            if (offsetX === 0 && offsetY === 0) continue;
            const nextX = sparkX + offsetX;
            const nextY = sparkY + offsetY;
            if (
              nextX < 0
              || nextY < 0
              || nextX >= engine.SIZE
              || nextY >= engine.SIZE
            ) continue;
            const nextIndex = (nextY * engine.SIZE) + nextX;
            if (source[nextIndex]) continue;
            if (outlined[nextIndex] === engine.OUTLINE_COLOR) adjacentOutlinePixels++;
          }
        }
        check(
          adjacentOutlinePixels <= 3,
          `${familyId} ${variantId} ${direction} attack frame ${frame + 1} ${outlineMode} `
            + 'must keep each one-pixel spell spark out of a boxed halo',
        );
      }
    }
  }
}

for (const direction of engine.DIRS) for (const animation of engine.ANIMS) {
  for (let frame = 0; frame < animation.frames; frame++) {
    const spec = { kind: 'enemy', family: 'goblin', variant: 'archer' };
    const source = renderPixels(spec, direction, animation.id, frame);
    const sourceGroups = cardinalPixelComponentGroups(source);
    check(
      sourceGroups.length >= 2 && sourceGroups.length <= 4,
      `goblin archer ${direction} ${animation.id}/${frame + 1} `
        + 'must retain two-to-four authored body and bow components',
    );
    for (const outlineMode of [
      engine.OUTLINE_MODE_COMPLETE_B,
      engine.OUTLINE_MODE_SELECTIVE_C,
    ]) {
      const outlined = renderOutlinedPixels(
        spec,
        direction,
        animation.id,
        frame,
        outlineMode,
      );
      check(
        sourceGroups.every((group) => group.every((index) => outlined[index])),
        `goblin archer ${direction} ${animation.id}/${frame + 1} ${outlineMode} `
          + 'must preserve every detached source pixel',
      );
    }
  }
}

for (const variant of ['sprite', 'pyro', 'fiend']) {
  const spec = { kind: 'enemy', family: 'imp', variant };
  for (const direction of engine.DIRS) for (const animation of engine.ANIMS) {
    for (let frame = 0; frame < animation.frames; frame++) {
      const body = renderPixels(spec, direction, animation.id, frame, { layer: 'body' });
      const hornTips = cardinalSingletonIndices(body);
      const source = renderPixels(spec, direction, animation.id, frame);
      const visibleHornTips = hornTips.filter((
        index,
      ) => source[index]);
      check(
        visibleHornTips.length >= 1 && visibleHornTips.length <= 3,
        `imp ${variant} ${direction} ${animation.id}/${frame + 1} `
          + 'must retain one-to-three visible detached one-pixel horn tips',
      );
      for (const outlineMode of [
        engine.OUTLINE_MODE_COMPLETE_B,
        engine.OUTLINE_MODE_SELECTIVE_C,
      ]) {
        const outlined = renderOutlinedPixels(
          spec,
          direction,
          animation.id,
          frame,
          outlineMode,
        );
        for (const hornIndex of visibleHornTips) {
          check(
            outlined[hornIndex] === source[hornIndex],
            `imp ${variant} ${direction} ${animation.id}/${frame + 1} ${outlineMode} `
              + 'must preserve each detached horn-tip source pixel',
          );
          const adjacentOutline = adjacentOutlinePixelsAround(hornIndex, source, outlined);
          check(
            adjacentOutline <= 4,
            `imp ${variant} ${direction} ${animation.id}/${frame + 1} ${outlineMode} `
              + `must keep each detached horn tip out of a boxed halo (found ${adjacentOutline})`,
          );
        }
      }
    }
  }
}

for (const direction of engine.DIRS) for (const animation of engine.ANIMS) {
  for (let frame = 0; frame < animation.frames; frame++) {
    const spec = { kind: 'enemy', family: 'orc', variant: 'warlord' };
    const headgear = renderPixels(spec, direction, animation.id, frame, { layer: 'headgear' });
    const hornTips = cardinalSingletonIndices(headgear)
      .filter((index) => Math.floor(index / engine.SIZE) < 5);
    const expectedTips = direction === 'left' || direction === 'right' ? 1 : 2;
    const source = renderPixels(spec, direction, animation.id, frame);
    check(
      hornTips.length === expectedTips,
      `orc warlord ${direction} ${animation.id}/${frame + 1} `
        + `must retain ${expectedTips} detached one-pixel horn tip(s)`,
    );
    check(
      hornTips.every((index) => source[index]),
      `orc warlord ${direction} ${animation.id}/${frame + 1} `
        + 'must keep every detached horn tip visible in the complete sprite',
    );
    check(
      headgear.slice(0, engine.SIZE).every((pixel) => pixel === null),
      `orc warlord ${direction} ${animation.id}/${frame + 1} `
        + 'headgear must reserve the top outline row',
    );
    for (const outlineMode of [
      engine.OUTLINE_MODE_COMPLETE_B,
      engine.OUTLINE_MODE_SELECTIVE_C,
    ]) {
      const outlined = renderOutlinedPixels(
        spec,
        direction,
        animation.id,
        frame,
        outlineMode,
      );
      for (const hornIndex of hornTips) {
        check(
          outlined[hornIndex] === source[hornIndex],
          `orc warlord ${direction} ${animation.id}/${frame + 1} ${outlineMode} `
            + 'must preserve each detached horn-tip source pixel',
        );
        const adjacentOutline = adjacentOutlinePixelsAround(hornIndex, source, outlined);
        check(
          adjacentOutline <= 4,
          `orc warlord ${direction} ${animation.id}/${frame + 1} ${outlineMode} `
            + `must keep each detached horn tip out of a boxed halo (found ${adjacentOutline})`,
        );
      }
    }
  }
}

for (const variant of ['bull', 'ironhorn', 'warden']) {
  for (const direction of engine.DIRS) for (const animation of engine.ANIMS) {
    for (let frame = 0; frame < animation.frames; frame++) {
      const spec = { kind: 'enemy', family: 'minotaur', variant };
      const body = renderPixels(spec, direction, animation.id, frame, { layer: 'body' });
      const hornTips = cardinalSingletonIndices(body)
        .filter((index) => Math.floor(index / engine.SIZE) < 4);
      const source = renderPixels(spec, direction, animation.id, frame);
      check(
        hornTips.length === 2,
        `minotaur ${variant} ${direction} ${animation.id}/${frame + 1} `
          + 'must retain both detached one-pixel horn tips',
      );
      check(
        hornTips.every((index) => source[index]),
        `minotaur ${variant} ${direction} ${animation.id}/${frame + 1} `
          + 'must keep both detached horn tips visible in the complete sprite',
      );
      check(
        body.slice(0, engine.SIZE).every((pixel) => pixel === null),
        `minotaur ${variant} ${direction} ${animation.id}/${frame + 1} `
          + 'body must reserve the top outline row',
      );
      for (const outlineMode of [
        engine.OUTLINE_MODE_COMPLETE_B,
        engine.OUTLINE_MODE_SELECTIVE_C,
      ]) {
        const outlined = renderOutlinedPixels(
          spec,
          direction,
          animation.id,
          frame,
          outlineMode,
        );
        for (const hornIndex of hornTips) {
          check(
            outlined[hornIndex] === source[hornIndex],
            `minotaur ${variant} ${direction} ${animation.id}/${frame + 1} ${outlineMode} `
              + 'must preserve each detached horn-tip source pixel',
          );
          const adjacentOutline = adjacentOutlinePixelsAround(hornIndex, source, outlined);
          check(
            adjacentOutline <= 4,
            `minotaur ${variant} ${direction} ${animation.id}/${frame + 1} ${outlineMode} `
              + `must keep each detached horn tip out of a boxed halo (found ${adjacentOutline})`,
          );
        }
      }
    }
  }
}

for (const variant of ['duke', 'pit', 'warlock']) {
  const spec = { kind: 'enemy', family: 'demon', variant };
  for (const direction of engine.DIRS) for (const animation of engine.ANIMS) {
    for (let frame = 0; frame < animation.frames; frame++) {
      const body = renderPixels(spec, direction, animation.id, frame, { layer: 'body' });
      const hornTips = cardinalSingletonIndices(body);
      const source = renderPixels(spec, direction, animation.id, frame);
      const visibleHornTips = hornTips.filter((index) => source[index]);
      check(
        visibleHornTips.length >= 1 && visibleHornTips.length <= 3,
        `demon ${variant} ${direction} ${animation.id}/${frame + 1} `
          + 'must retain one-to-three visible detached one-pixel horn tips',
      );
      for (const outlineMode of [
        engine.OUTLINE_MODE_COMPLETE_B,
        engine.OUTLINE_MODE_SELECTIVE_C,
      ]) {
        const outlined = renderOutlinedPixels(
          spec,
          direction,
          animation.id,
          frame,
          outlineMode,
        );
        for (const hornIndex of visibleHornTips) {
          check(
            outlined[hornIndex] === source[hornIndex],
            `demon ${variant} ${direction} ${animation.id}/${frame + 1} ${outlineMode} `
              + 'must preserve each detached horn-tip source pixel',
          );
          const adjacentOutline = adjacentOutlinePixelsAround(hornIndex, source, outlined);
          check(
            adjacentOutline <= 4,
            `demon ${variant} ${direction} ${animation.id}/${frame + 1} ${outlineMode} `
              + `must keep each detached horn tip out of a boxed halo (found ${adjacentOutline})`,
          );
        }
      }
    }
  }
}

for (const [direction, layer, expectedSparks] of [
  ['down', 'weapon-front', 1],
  ['left', 'weapon-back', 2],
  ['right', 'weapon-front', 2],
  ['up', 'weapon-back', 1],
]) {
  const spec = { kind: 'enemy', family: 'imp', variant: 'pyro' };
  for (const frame of [1, 2]) {
    const equipment = renderPixels(spec, direction, 'attack', frame, { layer });
    const sparks = cardinalSingletonIndices(equipment);
    const source = renderPixels(spec, direction, 'attack', frame);
    check(
      sparks.length === expectedSparks,
      `imp pyro ${direction} attack frame ${frame + 1} `
        + `must retain ${expectedSparks} detached one-pixel staff sparks`,
    );
    for (const outlineMode of [
      engine.OUTLINE_MODE_COMPLETE_B,
      engine.OUTLINE_MODE_SELECTIVE_C,
    ]) {
      const outlined = renderOutlinedPixels(spec, direction, 'attack', frame, outlineMode);
      for (const sparkIndex of sparks) {
        check(
          source[sparkIndex] && outlined[sparkIndex] === source[sparkIndex],
          `imp pyro ${direction} attack frame ${frame + 1} ${outlineMode} `
            + 'must preserve each detached staff-spark source pixel',
        );
        const adjacentOutline = adjacentOutlinePixelsAround(sparkIndex, source, outlined);
        check(
          adjacentOutline <= 4,
          `imp pyro ${direction} attack frame ${frame + 1} ${outlineMode} `
            + `must keep each detached staff spark out of a boxed halo (found ${adjacentOutline})`,
        );
      }
    }
  }
}

for (const [direction, layer, expectedSparks] of [
  ['down', 'weapon-front', 1],
  ['left', 'weapon-back', 2],
  ['right', 'weapon-front', 2],
  ['up', 'weapon-back', 1],
]) {
  const spec = { kind: 'enemy', family: 'lizardfolk', variant: 'chromatic' };
  for (const frame of [1, 2]) {
    const equipment = renderPixels(spec, direction, 'attack', frame, { layer });
    const sparks = cardinalSingletonIndices(equipment);
    const source = renderPixels(spec, direction, 'attack', frame);
    check(
      sparks.length === expectedSparks,
      `lizardfolk chromatic ${direction} attack frame ${frame + 1} `
        + `must retain ${expectedSparks} detached one-pixel staff sparks`,
    );
    for (const outlineMode of [
      engine.OUTLINE_MODE_COMPLETE_B,
      engine.OUTLINE_MODE_SELECTIVE_C,
    ]) {
      const outlined = renderOutlinedPixels(spec, direction, 'attack', frame, outlineMode);
      for (const sparkIndex of sparks) {
        check(
          source[sparkIndex] && outlined[sparkIndex] === source[sparkIndex],
          `lizardfolk chromatic ${direction} attack frame ${frame + 1} ${outlineMode} `
            + 'must preserve each detached staff-spark source pixel',
        );
        const adjacentOutline = adjacentOutlinePixelsAround(sparkIndex, source, outlined);
        check(
          adjacentOutline <= 4,
          `lizardfolk chromatic ${direction} attack frame ${frame + 1} ${outlineMode} `
            + `must keep each detached staff spark out of a boxed halo (found ${adjacentOutline})`,
        );
      }
    }
  }
}

for (const [direction, layer, expectedSparks] of [
  ['down', 'weapon-front', 1],
  ['left', 'weapon-back', 2],
  ['right', 'weapon-front', 2],
  ['up', 'weapon-back', 1],
]) {
  const spec = { kind: 'enemy', family: 'demon', variant: 'warlock' };
  for (const frame of [1, 2]) {
    const equipment = renderPixels(spec, direction, 'attack', frame, { layer });
    const sparks = cardinalSingletonIndices(equipment);
    const source = renderPixels(spec, direction, 'attack', frame);
    const visibleSparks = sparks.filter((index) => source[index] === equipment[index]);
    const expectedVisibleSparks = direction === 'up' && frame === 2 ? 0 : expectedSparks;
    check(
      sparks.length === expectedSparks,
      `demon warlock ${direction} attack frame ${frame + 1} `
        + `must retain ${expectedSparks} detached one-pixel staff sparks`,
    );
    check(
      visibleSparks.length === expectedVisibleSparks,
      `demon warlock ${direction} attack frame ${frame + 1} `
        + `must retain ${expectedVisibleSparks} visible detached one-pixel staff sparks`,
    );
    for (const outlineMode of [
      engine.OUTLINE_MODE_COMPLETE_B,
      engine.OUTLINE_MODE_SELECTIVE_C,
    ]) {
      const outlined = renderOutlinedPixels(spec, direction, 'attack', frame, outlineMode);
      for (const sparkIndex of visibleSparks) {
        check(
          source[sparkIndex] && outlined[sparkIndex] === source[sparkIndex],
          `demon warlock ${direction} attack frame ${frame + 1} ${outlineMode} `
            + 'must preserve each detached staff-spark source pixel',
        );
        const adjacentOutline = adjacentOutlinePixelsAround(sparkIndex, source, outlined);
        check(
          adjacentOutline <= 4,
          `demon warlock ${direction} attack frame ${frame + 1} ${outlineMode} `
            + `must keep each detached staff spark out of a boxed halo (found ${adjacentOutline})`,
        );
      }
    }
  }
}

for (const familyId of [
  'dwarf', 'ogre', 'goblin', 'zombie', 'imp', 'cultist', 'orc', 'lizardfolk',
  'minotaur', 'demon',
]) {
  const cavityFamily = engine.ENEMIES.find((family) => family.id === familyId);
  for (const variant of cavityFamily.variants) {
    const spec = { kind: 'enemy', family: familyId, variant: variant.id };
    for (const direction of engine.DIRS) for (const animation of engine.ANIMS) {
      for (let frame = 0; frame < animation.frames; frame++) {
        const source = renderPixels(spec, direction, animation.id, frame);
        const sourceCavities = cardinalTransparentCavityGroups(source);
        for (const outlineMode of [
          engine.OUTLINE_MODE_COMPLETE_B,
          engine.OUTLINE_MODE_SELECTIVE_C,
        ]) {
          const outlined = renderOutlinedPixels(
            spec,
            direction,
            animation.id,
            frame,
            outlineMode,
          );
          for (const cavity of sourceCavities) {
            check(
              cavity.every((index) => !outlined[index]),
              `${familyId} ${variant.id} ${direction} ${animation.id}/${frame + 1} `
                + `${outlineMode} must preserve its ${cavity.length}-pixel source cavity`,
            );
          }
        }
      }
    }
  }
}

const gnollAlphaSpec = { kind: 'enemy', family: 'gnoll', variant: 'alpha' };
const gnollAlphaSource = renderPixels(gnollAlphaSpec, 'down', 'idle', 0);
const gnollFaceIndices = [
  (4 * engine.SIZE) + 7,
  (5 * engine.SIZE) + 7,
  (4 * engine.SIZE) + 16,
  (5 * engine.SIZE) + 16,
  (8 * engine.SIZE) + 11,
  (8 * engine.SIZE) + 12,
  (9 * engine.SIZE) + 11,
  (9 * engine.SIZE) + 12,
];
check(
  gnollFaceIndices.every((index) => gnollAlphaSource[index]),
  'gnoll alpha down idle must retain both beast ears and the two-pixel muzzle',
);
for (const outlineMode of [
  engine.OUTLINE_MODE_COMPLETE_B,
  engine.OUTLINE_MODE_SELECTIVE_C,
]) {
  const outlined = renderOutlinedPixels(
    gnollAlphaSpec,
    'down',
    'idle',
    0,
    outlineMode,
  );
  check(
    gnollFaceIndices.every((index) => outlined[index] === gnollAlphaSource[index]),
    `gnoll alpha ${outlineMode} must preserve both beast ears and the muzzle`,
  );
}

for (const variant of ['screech', 'storm', 'blood']) {
  const spec = { kind: 'enemy', family: 'harpy', variant };
  const source = renderPixels(spec, 'down', 'idle', 0);
  const none = renderOutlinedPixels(
    spec,
    'down',
    'idle',
    0,
    engine.OUTLINE_MODE_NONE,
  );
  check(
    JSON.stringify(none) === JSON.stringify(source),
    `harpy ${variant} None mode must remain pixel-identical`,
  );
  const wingCoreIndices = [
    (12 * engine.SIZE) + 3,
    (15 * engine.SIZE) + 3,
    (12 * engine.SIZE) + 20,
    (15 * engine.SIZE) + 20,
  ];
  const wingContourIndices = [
    (12 * engine.SIZE) + 2,
    (15 * engine.SIZE) + 2,
    (12 * engine.SIZE) + 21,
    (15 * engine.SIZE) + 21,
  ];
  check(
    wingCoreIndices.every((index) => source[index]),
    `harpy ${variant} down idle must retain all four authored wing-tip cores`,
  );
  for (const outlineMode of [
    engine.OUTLINE_MODE_COMPLETE_B,
    engine.OUTLINE_MODE_SELECTIVE_C,
  ]) {
    const outlined = renderOutlinedPixels(spec, 'down', 'idle', 0, outlineMode);
    check(
      wingCoreIndices.every((index) => outlined[index] === source[index]),
      `harpy ${variant} ${outlineMode} must preserve all wing-tip colors`,
    );
    check(
      wingContourIndices.every((index) => outlined[index] === engine.OUTLINE_COLOR),
      `harpy ${variant} ${outlineMode} must contour both outer wing edges`,
    );
  }
}

for (const variant of ['watcher', 'doom', 'void']) {
  const spec = { kind: 'enemy', family: 'eyemonster', variant };
  const source = renderPixels(spec, 'down', 'idle', 0);
  const none = renderOutlinedPixels(
    spec,
    'down',
    'idle',
    0,
    engine.OUTLINE_MODE_NONE,
  );
  check(
    JSON.stringify(none) === JSON.stringify(source),
    `eye monster ${variant} None mode must remain pixel-identical`,
  );
  check(
    cardinalPixelComponents(source) === 4,
    `eye monster ${variant} down idle must retain one body and three orbiting source parts`,
  );
  const orbitCoreIndices = [
    (5 * engine.SIZE) + 9,
    (4 * engine.SIZE) + 12,
    (6 * engine.SIZE) + 15,
  ];
  const protectedGapIndices = [
    (6 * engine.SIZE) + 9,
    (5 * engine.SIZE) + 12,
    (6 * engine.SIZE) + 14,
  ];
  for (const outlineMode of [
    engine.OUTLINE_MODE_COMPLETE_B,
    engine.OUTLINE_MODE_SELECTIVE_C,
  ]) {
    const outlined = renderOutlinedPixels(spec, 'down', 'idle', 0, outlineMode);
    check(
      orbitCoreIndices.every((index) => outlined[index] === source[index]),
      `eye monster ${variant} ${outlineMode} must preserve all three orbit cores`,
    );
    check(
      protectedGapIndices.every((index) => !outlined[index]),
      `eye monster ${variant} ${outlineMode} must preserve breathing room around every orbit`,
    );
    check(
      cardinalPixelComponents(outlined) === 4,
      `eye monster ${variant} ${outlineMode} must keep all four visual components detached`,
    );
  }
}

const eyeMonsterFamily = engine.ENEMIES.find((family) => family.id === 'eyemonster');
for (const variant of eyeMonsterFamily.variants) {
  const spec = { kind: 'enemy', family: 'eyemonster', variant: variant.id };
  for (const direction of engine.DIRS) {
    for (const animation of engine.ANIMS) {
      for (let frame = 0; frame < animation.frames; frame++) {
        const source = renderPixels(spec, direction, animation.id, frame);
        const sourceComponents = cardinalPixelComponents(source);
        for (const outlineMode of [
          engine.OUTLINE_MODE_COMPLETE_B,
          engine.OUTLINE_MODE_SELECTIVE_C,
        ]) {
          const outlined = renderOutlinedPixels(
            spec,
            direction,
            animation.id,
            frame,
            outlineMode,
          );
          check(
            cardinalPixelComponents(outlined) === sourceComponents,
            `eye monster ${variant.id} ${direction} ${animation.id}/${frame + 1} `
              + `${outlineMode} must preserve every detached source component`,
          );
        }
      }
    }
  }
}

const crabFamily = engine.ENEMIES.find((family) => family.id === 'crab');
for (const variant of crabFamily.variants) {
  const spec = { kind: 'enemy', family: 'crab', variant: variant.id };
  const idleSource = renderPixels(spec, 'down', 'idle', 0);
  check(
    cardinalPixelComponents(idleSource) === 9,
    `crab ${variant.id} down idle must retain the body and eight detached limb groups`,
  );
  const clawCoreIndices = [
    (13 * engine.SIZE) + 4,
    (13 * engine.SIZE) + 19,
  ];
  const limbGapIndices = [
    (18 * engine.SIZE) + 6,
    (18 * engine.SIZE) + 17,
  ];
  const outerClawContourIndices = [
    (13 * engine.SIZE) + 3,
    (13 * engine.SIZE) + 20,
  ];
  for (const outlineMode of [
    engine.OUTLINE_MODE_COMPLETE_B,
    engine.OUTLINE_MODE_SELECTIVE_C,
  ]) {
    const outlined = renderOutlinedPixels(spec, 'down', 'idle', 0, outlineMode);
    check(
      clawCoreIndices.every((index) => outlined[index] === idleSource[index]),
      `crab ${variant.id} ${outlineMode} must preserve both claw-tip cores`,
    );
    check(
      limbGapIndices.every((index) => !outlined[index]),
      `crab ${variant.id} ${outlineMode} must preserve both body/leg gaps`,
    );
    check(
      outerClawContourIndices.every((index) => outlined[index] === engine.OUTLINE_COLOR),
      `crab ${variant.id} ${outlineMode} must contour both outer claw tips`,
    );
  }

  for (const direction of engine.DIRS) {
    for (const animation of engine.ANIMS) {
      for (let frame = 0; frame < animation.frames; frame++) {
        const source = renderPixels(spec, direction, animation.id, frame);
        const sourceComponents = cardinalPixelComponents(source);
        const sourceSingletons = cardinalSingletonIndices(source);
        for (const outlineMode of [
          engine.OUTLINE_MODE_COMPLETE_B,
          engine.OUTLINE_MODE_SELECTIVE_C,
        ]) {
          const outlined = renderOutlinedPixels(
            spec,
            direction,
            animation.id,
            frame,
            outlineMode,
          );
          check(
            cardinalPixelComponents(outlined) === sourceComponents,
            `crab ${variant.id} ${direction} ${animation.id}/${frame + 1} `
              + `${outlineMode} must preserve all ${sourceComponents} source components`,
          );
          check(
            sourceSingletons.every((index) => (
              cardinalSingletonIndices(outlined).includes(index)
            )),
            `crab ${variant.id} ${direction} ${animation.id}/${frame + 1} `
              + `${outlineMode} must leave every one-pixel leg segment unhaloed`,
          );
        }
      }
    }
  }
}

const beetleOutlineFamily = engine.ENEMIES.find((family) => family.id === 'beetle');
for (const variant of beetleOutlineFamily.variants) {
  const spec = { kind: 'enemy', family: 'beetle', variant: variant.id };
  for (const outlineMode of [
    engine.OUTLINE_MODE_COMPLETE_B,
    engine.OUTLINE_MODE_SELECTIVE_C,
  ]) {
    const frontStrikeSource = renderPixels(spec, 'down', 'attack', 1);
    const frontStrike = renderOutlinedPixels(spec, 'down', 'attack', 1, outlineMode);
    check(
      frontStrike[((23 * engine.SIZE) + 8)] === engine.OUTLINE_COLOR
        && frontStrike[((23 * engine.SIZE) + 15)] === engine.OUTLINE_COLOR,
      `beetle ${variant.id} ${outlineMode} must contour both front attack antenna tips`,
    );
    check(
      frontStrike[((11 * engine.SIZE) + 6)] === engine.OUTLINE_COLOR,
      `beetle ${variant.id} ${outlineMode} must retain the front shell contour`,
    );
    check(
      frontStrikeSource[((17 * engine.SIZE) + 10)] === '#f4f4f4'
        && frontStrikeSource[((17 * engine.SIZE) + 13)] === '#f4f4f4',
      `beetle ${variant.id} source must retain both approved front-facing eyes`,
    );

    const sideStrike = renderOutlinedPixels(spec, 'right', 'attack', 1, outlineMode);
    check(
      sideStrike[((10 * engine.SIZE) + 23)] === engine.OUTLINE_COLOR,
      `beetle ${variant.id} ${outlineMode} must retain the side horn-tip contour`,
    );
  }

  for (const direction of engine.DIRS) {
    for (const animation of engine.ANIMS) {
      for (let frame = 0; frame < animation.frames; frame++) {
        const source = renderPixels(spec, direction, animation.id, frame);
        const sourceGroups = cardinalPixelComponentGroups(source);
        check(
          sourceGroups.length >= 3 && sourceGroups.length <= 6,
          `beetle ${variant.id} ${direction} ${animation.id}/${frame + 1} `
            + 'must retain three-to-six authored shell, horn, and leg components',
        );
        const smallSourceGroups = sourceGroups.filter((component) => component.length < 3);
        for (const outlineMode of [
          engine.OUTLINE_MODE_COMPLETE_B,
          engine.OUTLINE_MODE_SELECTIVE_C,
        ]) {
          const outlined = renderOutlinedPixels(
            spec,
            direction,
            animation.id,
            frame,
            outlineMode,
          );
          const outlinedGroups = cardinalPixelComponentGroups(outlined);
          check(
            outlinedGroups.length === sourceGroups.length,
            `beetle ${variant.id} ${direction} ${animation.id}/${frame + 1} `
              + `${outlineMode} must preserve all ${sourceGroups.length} source components`,
          );
          check(
            smallSourceGroups.every((sourceGroup) => {
              const outlinedGroup = outlinedGroups.find((group) => group.includes(sourceGroup[0]));
              return (
                outlinedGroup
                && outlinedGroup.length === sourceGroup.length
                && sourceGroup.every((index) => outlinedGroup.includes(index))
              );
            }),
            `beetle ${variant.id} ${direction} ${animation.id}/${frame + 1} `
              + `${outlineMode} must leave every one- and two-pixel leg component unhaloed`,
          );
        }
      }
    }
  }
}

const waspOutlineFamily = engine.ENEMIES.find((family) => family.id === 'wasp');
for (const variant of waspOutlineFamily.variants) {
  const spec = { kind: 'enemy', family: 'wasp', variant: variant.id };
  const sideFlapSource = renderPixels(spec, 'right', 'idle', 0);
  const sideFlapGroups = cardinalPixelComponentGroups(sideFlapSource);
  check(
    sideFlapGroups.map((group) => group.length).sort((left, right) => right - left)
      .join(',') === '53,11,1',
    `wasp ${variant.id} right idle frame 1 must retain body, detached wing, and stinger tip`,
  );
  const wingCoreIndex = (4 * engine.SIZE) + 9;
  const wingContourIndex = (3 * engine.SIZE) + 9;
  const stingerTipIndex = (11 * engine.SIZE) + 3;
  for (const outlineMode of [
    engine.OUTLINE_MODE_COMPLETE_B,
    engine.OUTLINE_MODE_SELECTIVE_C,
  ]) {
    const sideFlap = renderOutlinedPixels(spec, 'right', 'idle', 0, outlineMode);
    check(
      sideFlap[wingCoreIndex] === sideFlapSource[wingCoreIndex],
      `wasp ${variant.id} ${outlineMode} must preserve the raised wing core`,
    );
    check(
      sideFlap[wingContourIndex] === engine.OUTLINE_COLOR,
      `wasp ${variant.id} ${outlineMode} must contour the raised wing`,
    );
    check(
      sideFlap[stingerTipIndex] === sideFlapSource[stingerTipIndex],
      `wasp ${variant.id} ${outlineMode} must preserve the one-pixel stinger tip`,
    );
  }

  for (const direction of engine.DIRS) {
    for (const animation of engine.ANIMS) {
      for (let frame = 0; frame < animation.frames; frame++) {
        const source = renderPixels(spec, direction, animation.id, frame);
        const sourceGroups = cardinalPixelComponentGroups(source);
        check(
          sourceGroups.length >= 1 && sourceGroups.length <= 4,
          `wasp ${variant.id} ${direction} ${animation.id}/${frame + 1} `
            + 'must retain one-to-four authored body, wing, and stinger components',
        );
        const sourceSingletons = sourceGroups.filter((component) => component.length === 1);
        for (const outlineMode of [
          engine.OUTLINE_MODE_COMPLETE_B,
          engine.OUTLINE_MODE_SELECTIVE_C,
        ]) {
          const outlined = renderOutlinedPixels(
            spec,
            direction,
            animation.id,
            frame,
            outlineMode,
          );
          const outlinedGroups = cardinalPixelComponentGroups(outlined);
          check(
            outlinedGroups.length === sourceGroups.length,
            `wasp ${variant.id} ${direction} ${animation.id}/${frame + 1} `
              + `${outlineMode} must preserve all ${sourceGroups.length} source components`,
          );
          check(
            sourceSingletons.every((sourceGroup) => {
              const outlinedGroup = outlinedGroups.find((group) => group.includes(sourceGroup[0]));
              return (
                outlinedGroup
                && outlinedGroup.length === 1
                && outlinedGroup[0] === sourceGroup[0]
              );
            }),
            `wasp ${variant.id} ${direction} ${animation.id}/${frame + 1} `
              + `${outlineMode} must leave every one-pixel stinger segment unhaloed`,
          );
        }
      }
    }
  }
}

const mimicOutlineFamily = engine.ENEMIES.find((family) => family.id === 'mimic');
for (const variant of mimicOutlineFamily.variants) {
  const spec = { kind: 'enemy', family: 'mimic', variant: variant.id };
  const frontAttackSource = renderPixels(spec, 'down', 'attack', 0);
  const backAttackSource = renderPixels(spec, 'up', 'attack', 0);
  check(
    frontAttackSource[(10 * engine.SIZE) + 8] === '#f4f4f4'
      && frontAttackSource[(14 * engine.SIZE) + 9] === '#f4f4f4',
    `mimic ${variant.id} front attack must retain both rows of teeth`,
  );
  check(
    frontAttackSource[(12 * engine.SIZE) + 11] === '#e05545'
      && frontAttackSource[(13 * engine.SIZE) + 12] === '#e05545',
    `mimic ${variant.id} front attack must retain the tongue`,
  );
  check(
    backAttackSource[(10 * engine.SIZE) + 8] !== '#f4f4f4'
      && backAttackSource[(12 * engine.SIZE) + 11] !== '#e05545',
    `mimic ${variant.id} rear attack must remain eye-, tooth-, and tongue-free`,
  );
  for (const outlineMode of [
    engine.OUTLINE_MODE_COMPLETE_B,
    engine.OUTLINE_MODE_SELECTIVE_C,
  ]) {
    const frontAttack = renderOutlinedPixels(spec, 'down', 'attack', 0, outlineMode);
    const sideAttack = renderOutlinedPixels(spec, 'right', 'attack', 0, outlineMode);
    const closedFront = renderOutlinedPixels(spec, 'down', 'idle', 0, outlineMode);
    check(
      frontAttack[(6 * engine.SIZE) + 7] === engine.OUTLINE_COLOR,
      `mimic ${variant.id} ${outlineMode} must contour the raised front lid`,
    );
    check(
      sideAttack[(6 * engine.SIZE) + 10] === engine.OUTLINE_COLOR,
      `mimic ${variant.id} ${outlineMode} must contour the raised side lid`,
    );
    check(
      closedFront[(10 * engine.SIZE) + 7] === engine.OUTLINE_COLOR,
      `mimic ${variant.id} ${outlineMode} must contour the closed chest lid`,
    );
  }

  for (const direction of engine.DIRS) {
    for (const animation of engine.ANIMS) {
      for (let frame = 0; frame < animation.frames; frame++) {
        const source = renderPixels(spec, direction, animation.id, frame);
        check(
          cardinalPixelComponents(source) === 1,
          `mimic ${variant.id} ${direction} ${animation.id}/${frame + 1} `
            + 'must retain one connected chest silhouette',
        );
        for (const outlineMode of [
          engine.OUTLINE_MODE_COMPLETE_B,
          engine.OUTLINE_MODE_SELECTIVE_C,
        ]) {
          const outlined = renderOutlinedPixels(
            spec,
            direction,
            animation.id,
            frame,
            outlineMode,
          );
          check(
            cardinalPixelComponents(outlined) === 1,
            `mimic ${variant.id} ${direction} ${animation.id}/${frame + 1} `
              + `${outlineMode} must keep the chest silhouette connected`,
          );
        }
      }
    }
  }
}

const drakeOutlineFamily = engine.ENEMIES.find((family) => family.id === 'drake');
for (const variant of drakeOutlineFamily.variants) {
  const spec = { kind: 'enemy', family: 'drake', variant: variant.id };
  const frontIdleSource = renderPixels(spec, 'down', 'idle', 0);
  const frontIdleGroups = cardinalPixelComponentGroups(frontIdleSource);
  const frontStructuralCells = [
    [9, 5], [10, 5], [13, 5], [14, 5],
    [11, 10], [12, 10],
  ];
  check(
    frontIdleGroups.length === 1 && frontIdleGroups[0].length === 132,
    `drake ${variant.id} front idle must keep body, wings, neck, head, and horns `
      + 'in one physical source component',
  );
  check(
    frontStructuralCells.every(([x, y]) => (
      frontIdleSource[(y * engine.SIZE) + x] !== null
    )),
    `drake ${variant.id} front idle must retain both connected horn bases and its neck`,
  );
  for (const direction of ['down', 'up']) {
    for (const frame of [0, 2]) {
      const source = renderPixels(spec, direction, 'attack', frame);
      const neckIndices = [(9 * engine.SIZE) + 9, (9 * engine.SIZE) + 14];
      check(
        neckIndices.every((index) => source[index] === null),
        `drake ${variant.id} ${direction} attack/${frame + 1} `
          + 'must keep the cells beside the neck transparent in None mode',
      );
      for (const outlineMode of [
        engine.OUTLINE_MODE_COMPLETE_B,
        engine.OUTLINE_MODE_SELECTIVE_C,
      ]) {
        const outlined = renderOutlinedPixels(spec, direction, 'attack', frame, outlineMode);
        check(
          neckIndices.every((index) => outlined[index] === engine.OUTLINE_COLOR),
          `drake ${variant.id} ${direction} attack/${frame + 1} ${outlineMode} `
            + 'must derive both neck-corner outlines from the connected source',
        );
      }
    }
  }
  for (const direction of ['left', 'right']) {
    const source = renderPixels(spec, direction, 'idle', 0);
    const sourceGroups = cardinalPixelComponentGroups(source);
    const rightSideStructuralCells = [
      [2, 8], [2, 9], [3, 9], [3, 10], [4, 10],
      [5, 10],
      [14, 10], [15, 10],
      [14, 5], [15, 5], [15, 4],
    ];
    const structuralCells = direction === 'right'
      ? rightSideStructuralCells
      : rightSideStructuralCells.map(([x, y]) => [engine.SIZE - 1 - x, y]);
    check(
      sourceGroups.length === 1 && sourceGroups[0].length === 157,
      `drake ${variant.id} ${direction} idle must keep its rebuilt side silhouette `
        + 'as one physical source component',
    );
    check(
      structuralCells.every(([x, y]) => source[(y * engine.SIZE) + x] !== null),
      `drake ${variant.id} ${direction} idle must retain its cardinal tail, neck, and horn`,
    );
  }
  for (const outlineMode of [
    engine.OUTLINE_MODE_COMPLETE_B,
    engine.OUTLINE_MODE_SELECTIVE_C,
  ]) {
    const frontIdle = renderOutlinedPixels(spec, 'down', 'idle', 0, outlineMode);
    const sideIdle = renderOutlinedPixels(spec, 'right', 'idle', 0, outlineMode);
    const sideStrike = renderOutlinedPixels(spec, 'right', 'attack', 1, outlineMode);
    check(
      frontStructuralCells.every(([x, y]) => (
        frontIdle[(y * engine.SIZE) + x] !== null
      )),
      `drake ${variant.id} ${outlineMode} must preserve the connected front horns and neck`,
    );
    check(
      frontIdle[(5 * engine.SIZE) + 11] === engine.OUTLINE_COLOR,
      `drake ${variant.id} ${outlineMode} must contour the space between its horns`,
    );
    check(
      cardinalPixelComponentGroups(sideIdle).length === 1,
      `drake ${variant.id} ${outlineMode} must keep the rebuilt side silhouette connected`,
    );
    check(
      sideStrike[(7 * engine.SIZE) + 23] === engine.OUTLINE_COLOR,
      `drake ${variant.id} ${outlineMode} must retain the longest side-breath contour`,
    );
  }

  for (const direction of engine.DIRS) {
    for (const animation of engine.ANIMS) {
      for (let frame = 0; frame < animation.frames; frame++) {
        const source = renderPixels(spec, direction, animation.id, frame);
        const sourceGroups = cardinalPixelComponentGroups(source);
        const physicalGroups = sourceGroups.filter((component) => component.length > 1);
        check(
          physicalGroups.length === 1 && physicalGroups[0].length >= 116,
          `drake ${variant.id} ${direction} ${animation.id}/${frame + 1} `
            + 'must keep all physical anatomy in one source component',
        );
        check(
          sourceGroups.length >= 1 && sourceGroups.length <= 2,
          `drake ${variant.id} ${direction} ${animation.id}/${frame + 1} `
            + 'may separate only its one-pixel side breath spark',
        );
        const sourceSingletons = sourceGroups.filter((component) => component.length === 1);
        for (const outlineMode of [
          engine.OUTLINE_MODE_COMPLETE_B,
          engine.OUTLINE_MODE_SELECTIVE_C,
        ]) {
          const outlined = renderOutlinedPixels(
            spec,
            direction,
            animation.id,
            frame,
            outlineMode,
          );
          const outlinedGroups = cardinalPixelComponentGroups(outlined);
          check(
            outlinedGroups.length === sourceGroups.length,
            `drake ${variant.id} ${direction} ${animation.id}/${frame + 1} `
              + `${outlineMode} must contour the connected anatomy without component bridges`,
          );
          check(
            sourceSingletons.every((sourceGroup) => {
              const outlinedGroup = outlinedGroups.find((group) => group.includes(sourceGroup[0]));
              return (
                outlinedGroup
                && outlinedGroup.length === 1
                && outlinedGroup[0] === sourceGroup[0]
              );
            }),
            `drake ${variant.id} ${direction} ${animation.id}/${frame + 1} `
              + `${outlineMode} must leave the one-pixel side breath spark unhaloed`,
          );
        }
      }
    }
  }
}

const connectedOutlineBatchFamilies = ['bat', 'ghost', 'golem', 'snake'];
for (const familyId of connectedOutlineBatchFamilies) {
  const family = engine.ENEMIES.find((candidate) => candidate.id === familyId);
  for (const variant of family.variants) {
    const spec = { kind: 'enemy', family: familyId, variant: variant.id };
    for (const direction of engine.DIRS) {
      for (const animation of engine.ANIMS) {
        for (let frame = 0; frame < animation.frames; frame++) {
          const source = renderPixels(spec, direction, animation.id, frame);
          const sourceGroups = cardinalPixelComponentGroups(source);
          check(
            sourceGroups.length === 1,
            `${familyId} ${variant.id} ${direction} ${animation.id}/${frame + 1} `
              + 'must remain one connected source component',
          );
          for (const outlineMode of [
            engine.OUTLINE_MODE_COMPLETE_B,
            engine.OUTLINE_MODE_SELECTIVE_C,
          ]) {
            const outlined = renderOutlinedPixels(
              spec,
              direction,
              animation.id,
              frame,
              outlineMode,
            );
            check(
              cardinalPixelComponentGroups(outlined).length === 1,
              `${familyId} ${variant.id} ${direction} ${animation.id}/${frame + 1} `
                + `${outlineMode} must retain one connected silhouette`,
            );
          }
        }
      }
    }
  }
}

const separatedOutlineBatchFamilies = new Map([
  ['frog', { minimumComponentPixels: 3, maximumComponents: 2 }],
  ['jellyfish', { minimumComponentPixels: 2, maximumComponents: 4 }],
  ['scarecrow', { minimumComponentPixels: 2, maximumComponents: 5 }],
  ['gargoyle', { minimumComponentPixels: 1, maximumComponents: 3 }],
  ['worm', { minimumComponentPixels: 2, maximumComponents: 3 }],
  ['mantis', { minimumComponentPixels: 3, maximumComponents: 9 }],
  ['moth', { minimumComponentPixels: 2, maximumComponents: 8 }],
  ['puppet', { minimumComponentPixels: 2, maximumComponents: 8 }],
  ['spider', { minimumComponentPixels: 9, maximumComponents: 11 }],
  ['treant', { minimumComponentPixels: 2, maximumComponents: 5 }],
  ['centipede', { minimumComponentPixels: 2, maximumComponents: 11 }],
  ['mole', { minimumComponentPixels: 2, maximumComponents: 11 }],
  ['carniplant', {
    minimumComponentPixels: 3,
    maximumComponents: 6,
    maximumDetachedComponentPixels: 4,
    singlePixelMinimumY: 19,
  }],
  ['octopus', {
    minimumComponentPixels: 10,
    maximumComponents: 10,
    singlePixelMinimumY: 19,
    outlineInteriorCavities: true,
  }],
  ['anglerfish', { minimumComponentPixels: 2, maximumComponents: 4 }],
  ['snail', { minimumComponentPixels: 2, maximumComponents: 5 }],
  ['porcupine', { minimumComponentPixels: 3, maximumComponents: 18 }],
]);
for (const [familyId, familyRules] of separatedOutlineBatchFamilies) {
  const family = engine.ENEMIES.find((candidate) => candidate.id === familyId);
  for (const variant of family.variants) {
    const spec = { kind: 'enemy', family: familyId, variant: variant.id };
    for (const direction of engine.DIRS) {
      for (const animation of engine.ANIMS) {
        for (let frame = 0; frame < animation.frames; frame++) {
          const source = renderPixels(spec, direction, animation.id, frame);
          const sourceGroups = cardinalPixelComponentGroups(source);
          const sourceCavities = cardinalTransparentCavityGroups(source);
          check(
            sourceGroups.length >= 1
              && sourceGroups.length <= familyRules.maximumComponents,
            `${familyId} ${variant.id} ${direction} ${animation.id}/${frame + 1} `
              + `must retain no more than ${familyRules.maximumComponents} source components`,
          );
          if (familyRules.maximumDetachedComponentPixels) {
            check(
              sourceGroups
                .filter((group) => group.length > familyRules.maximumDetachedComponentPixels)
                .length === 1,
              `${familyId} ${variant.id} ${direction} ${animation.id}/${frame + 1} `
                + `must retain exactly one physical body component larger than `
                + `${familyRules.maximumDetachedComponentPixels} pixels`,
            );
          }
          for (const outlineMode of [
            engine.OUTLINE_MODE_COMPLETE_B,
            engine.OUTLINE_MODE_SELECTIVE_C,
          ]) {
            const outlined = renderOutlinedPixels(
              spec,
              direction,
              animation.id,
              frame,
              outlineMode,
            );
            const outlinedGroups = cardinalPixelComponentGroups(outlined);
            if (!familyRules.outlineInteriorCavities) {
              check(
                outlinedGroups.length === sourceGroups.length,
                `${familyId} ${variant.id} ${direction} ${animation.id}/${frame + 1} `
                  + `${outlineMode} must keep authored components separated`,
              );
            }
            for (const sourceGroup of sourceGroups) {
              const outlinedGroup = outlinedGroups.find((group) => group.includes(sourceGroup[0]));
              const outlinesBottomSinglePixel =
                sourceGroup.length === 1
                && Number.isInteger(familyRules.singlePixelMinimumY)
                && sourceGroup.some(
                  (index) => Math.floor(index / engine.SIZE) >= familyRules.singlePixelMinimumY,
                );
              const shouldReceiveOutline =
                sourceGroup.length >= familyRules.minimumComponentPixels
                || outlinesBottomSinglePixel;
              check(
                outlinedGroup
                  && (
                    shouldReceiveOutline
                      ? outlinedGroup.length > sourceGroup.length
                      : outlinedGroup.length === sourceGroup.length
                  ),
                `${familyId} ${variant.id} ${direction} ${animation.id}/${frame + 1} `
                  + `${outlineMode} must ${
                    shouldReceiveOutline ? 'contour' : 'leave unhaloed'
                  } its ${sourceGroup.length}-pixel component`,
              );
            }
            for (const sourceCavity of sourceCavities) {
              if (familyRules.outlineInteriorCavities) {
                check(
                  sourceCavity.every((index) => outlined[index]),
                  `${familyId} ${variant.id} ${direction} ${animation.id}/${frame + 1} `
                    + `${outlineMode} must contour its full ${sourceCavity.length}-pixel `
                    + 'tentacle gap',
                );
              } else {
                check(
                  sourceCavity.every((index) => !outlined[index]),
                  `${familyId} ${variant.id} ${direction} ${animation.id}/${frame + 1} `
                    + `${outlineMode} must preserve its ${sourceCavity.length}-pixel source cavity`,
                );
              }
            }
          }
        }
      }
    }
  }
}

const anglerfishFamily = engine.ENEMIES.find((family) => family.id === 'anglerfish');
for (const variant of anglerfishFamily.variants) {
  const spec = { kind: 'enemy', family: 'anglerfish', variant: variant.id };
  for (const direction of ['left', 'right']) {
    const firstBite = renderPixels(spec, direction, 'attack', 1);
    const edgeX = direction === 'left' ? 0 : engine.SIZE - 1;
    const forwardX = direction === 'left' ? 1 : engine.SIZE - 2;
    check(
      firstBite.every((pixel, index) => (index % engine.SIZE) !== edgeX || !pixel),
      `anglerfish ${variant.id} ${direction} attack frame 2 `
        + 'must reserve the side outline column',
    );
    check(
      firstBite.some((pixel, index) => (index % engine.SIZE) === forwardX && pixel),
      `anglerfish ${variant.id} ${direction} attack frame 2 `
        + 'must retain a visible one-pixel forward bite lunge',
    );
  }
  for (const [direction, animation, frame] of [
    ['down', 'hurt', 0],
    ['up', 'attack', 1],
    ['up', 'attack', 2],
  ]) {
    const source = renderPixels(spec, direction, animation, frame);
    check(
      source.slice(0, engine.SIZE).every((pixel) => !pixel),
      `anglerfish ${variant.id} ${direction} ${animation} frame ${frame + 1} `
        + 'must reserve the top outline row',
    );
    check(
      source.slice(engine.SIZE, engine.SIZE * 2).some(Boolean),
      `anglerfish ${variant.id} ${direction} ${animation} frame ${frame + 1} `
        + 'must retain the lure on the first drawable row',
    );
  }
}

const snailFamily = engine.ENEMIES.find((family) => family.id === 'snail');
for (const variant of snailFamily.variants) {
  const spec = { kind: 'enemy', family: 'snail', variant: variant.id };
  const downWithdrawn = renderPixels(spec, 'down', 'attack', 1);
  check(
    downWithdrawn.slice(-engine.SIZE).every((pixel) => !pixel),
    `snail ${variant.id} down attack frame 2 must reserve the bottom outline row`,
  );
  check(
    downWithdrawn.slice(-engine.SIZE * 2, -engine.SIZE).some(Boolean),
    `snail ${variant.id} down attack frame 2 must retain one cell of forward preparation`,
  );

  const upHurt = renderPixels(spec, 'up', 'hurt', 0);
  check(
    upHurt.slice(-engine.SIZE).every((pixel) => !pixel),
    `snail ${variant.id} up hurt frame 1 must reserve the bottom outline row`,
  );
  check(
    upHurt.slice(-engine.SIZE * 2, -engine.SIZE).some(Boolean),
    `snail ${variant.id} up hurt frame 1 must retain the complete slime trail`,
  );

  for (const direction of ['left', 'right']) {
    const rolling = renderPixels(spec, direction, 'attack', 2);
    const edgeX = direction === 'left' ? 0 : engine.SIZE - 1;
    const insideX = direction === 'left' ? 1 : engine.SIZE - 2;
    check(
      rolling.every((pixel, index) => (index % engine.SIZE) !== edgeX || !pixel),
      `snail ${variant.id} ${direction} attack frame 3 `
        + 'must reserve the side outline column',
    );
    check(
      rolling.some((pixel, index) => (index % engine.SIZE) === insideX && pixel),
      `snail ${variant.id} ${direction} attack frame 3 `
        + 'must retain the full rolling silhouette inside the frame',
    );
  }
}

const porcupineFamily = engine.ENEMIES.find((family) => family.id === 'porcupine');
for (const variant of porcupineFamily.variants) {
  const spec = { kind: 'enemy', family: 'porcupine', variant: variant.id };
  const downFlare = renderPixels(spec, 'down', 'attack', 1);
  check(
    downFlare.slice(-engine.SIZE).every((pixel) => !pixel),
    `porcupine ${variant.id} down attack frame 2 must reserve the bottom outline row`,
  );
  check(
    downFlare.slice(-engine.SIZE * 2, -engine.SIZE).some(Boolean),
    `porcupine ${variant.id} down attack frame 2 must retain one cell of forward flare motion`,
  );

  for (const direction of ['left', 'right']) {
    const edgeX = direction === 'left' ? 0 : engine.SIZE - 1;
    const insideX = direction === 'left' ? 1 : engine.SIZE - 2;
    for (const frame of [1, 2]) {
      const attack = renderPixels(spec, direction, 'attack', frame);
      check(
        attack.every((pixel, index) => (index % engine.SIZE) !== edgeX || !pixel),
        `porcupine ${variant.id} ${direction} attack frame ${frame + 1} `
          + 'must reserve the side outline column',
      );
      check(
        attack.some((pixel, index) => (index % engine.SIZE) === insideX && pixel),
        `porcupine ${variant.id} ${direction} attack frame ${frame + 1} `
          + 'must retain its forward snout or burst quill inside the frame',
      );
    }
  }
}

const elfDuelistSpec = { kind: 'enemy', family: 'elf', variant: 'duelist' };
const elfDuelistSource = renderPixels(elfDuelistSpec, 'down', 'idle', 0);
const elfEarIndices = [
  (5 * engine.SIZE) + 7,
  (6 * engine.SIZE) + 7,
  (5 * engine.SIZE) + 16,
  (6 * engine.SIZE) + 16,
];
check(
  elfEarIndices.every((index) => elfDuelistSource[index]),
  'elf duelist down idle must retain both authored two-pixel pointed ears',
);
for (const outlineMode of [
  engine.OUTLINE_MODE_COMPLETE_B,
  engine.OUTLINE_MODE_SELECTIVE_C,
]) {
  const outlined = renderOutlinedPixels(
    elfDuelistSpec,
    'down',
    'idle',
    0,
    outlineMode,
  );
  check(
    elfEarIndices.every((index) => outlined[index] === elfDuelistSource[index]),
    `elf duelist ${outlineMode} must preserve both pointed-ear cores`,
  );
}

const skeletonGruntSpec = { kind: 'enemy', family: 'skeleton', variant: 'grunt' };
const skeletonGruntSource = renderPixels(skeletonGruntSpec, 'down', 'idle', 0);
for (const outlineMode of [
  engine.OUTLINE_MODE_COMPLETE_B,
  engine.OUTLINE_MODE_SELECTIVE_C,
]) {
  const outlined = renderOutlinedPixels(
    skeletonGruntSpec,
    'down',
    'idle',
    0,
    outlineMode,
  );
  check(
    skeletonGruntSource.every((pixel, index) => !pixel || outlined[index] === pixel),
    `skeleton grunt ${outlineMode} must preserve every unequipped bone/body source pixel`,
  );
}

for (const variant of ['skulker', 'plague', 'blade']) {
  const spec = { kind: 'enemy', family: 'ratfolk', variant };
  const source = renderPixels(spec, 'down', 'idle', 0);
  const tailIndices = [
    (20 * engine.SIZE) + 17,
    (19 * engine.SIZE) + 18,
    (19 * engine.SIZE) + 19,
  ];
  check(
    tailIndices.every((index) => source[index]),
    `ratfolk ${variant} down idle must retain all three authored tail pixels`,
  );
  for (const outlineMode of [
    engine.OUTLINE_MODE_COMPLETE_B,
    engine.OUTLINE_MODE_SELECTIVE_C,
  ]) {
    const outlined = renderOutlinedPixels(spec, 'down', 'idle', 0, outlineMode);
    check(
      tailIndices.every((index) => outlined[index] === source[index]),
      `ratfolk ${variant} ${outlineMode} must preserve the colored tail core`,
    );
    check(
      outlined[(19 * engine.SIZE) + 20] === engine.OUTLINE_COLOR,
      `ratfolk ${variant} ${outlineMode} must contour the detached tail tip`,
    );
  }
}

const lizardfolkFamily = engine.ENEMIES.find((family) => family.id === 'lizardfolk');
for (const variant of lizardfolkFamily.variants) {
  const spec = { kind: 'enemy', family: 'lizardfolk', variant: variant.id };
  for (const direction of engine.DIRS) for (const animation of engine.ANIMS) {
    for (let frame = 0; frame < animation.frames; frame++) {
      const tailPixels = direction === 'right'
        ? [[6, 20, variant.skin[0]], [5, 19, variant.skin[0]], [4, 18, variant.skin[1]]]
        : direction === 'left'
          ? [[17, 20, variant.skin[0]], [18, 19, variant.skin[0]], [19, 18, variant.skin[1]]]
          : [[17, 20, variant.skin[0]], [18, 19, variant.skin[0]], [19, 19, variant.skin[1]]];
      const tailIndices = tailPixels.map(([x, y]) => (y * engine.SIZE) + x);
      const body = renderPixels(spec, direction, animation.id, frame, { layer: 'body' });
      const source = renderPixels(spec, direction, animation.id, frame);
      const flashing = (animation.id === 'hurt' || animation.id === 'death') && frame === 0;
      check(
        tailPixels.every(([x, y, color]) => (
          body[(y * engine.SIZE) + x] === (flashing ? '#ffffff' : color)
        )),
        `lizardfolk ${variant.id} ${direction} ${animation.id}/${frame + 1} `
          + 'must retain all three authored tail pixels and palette colors',
      );
      check(
        tailIndices.every((index) => source[index]),
        `lizardfolk ${variant.id} ${direction} ${animation.id}/${frame + 1} `
          + 'must keep every authored tail pixel visible in the complete sprite',
      );
      for (const outlineMode of [
        engine.OUTLINE_MODE_COMPLETE_B,
        engine.OUTLINE_MODE_SELECTIVE_C,
      ]) {
        const outlined = renderOutlinedPixels(
          spec,
          direction,
          animation.id,
          frame,
          outlineMode,
        );
        const visibleTailIndices = tailIndices.filter((index) => source[index] === body[index]);
        check(
          visibleTailIndices.every((index) => outlined[index] === source[index]),
          `lizardfolk ${variant.id} ${direction} ${animation.id}/${frame + 1} ${outlineMode} `
            + 'must preserve every colored tail-core pixel',
        );
        check(
          visibleTailIndices.every((
            index,
          ) => adjacentOutlinePixelsAround(index, source, outlined) > 0),
          `lizardfolk ${variant.id} ${direction} ${animation.id}/${frame + 1} ${outlineMode} `
            + 'must contour every separated tail segment',
        );
      }
    }
  }
}

const FRAME_SAFE_ENEMY_REPAIR_FAMILIES = [
  'frog', 'jellyfish', 'mole', 'scarecrow', 'drake', 'centipede', 'carniplant',
  'mantis', 'moth', 'octopus', 'puppet',
  'wolf', 'boar', 'bear', 'bigcat',
  'crocodile', 'turtle', 'griffin',
  'slime', 'shroom',
  'elf', 'skeleton', 'kobold', 'ratfolk',
  'golem', 'treant', 'worm', 'beetle',
  'cyclops', 'troll', 'dwarf', 'ogre', 'goblin', 'zombie', 'imp',
  'cultist', 'orc', 'lizardfolk', 'minotaur', 'demon', 'anglerfish', 'snail',
  'porcupine',
];
let frameSafeEnemyCases = 0;
for (const familyId of FRAME_SAFE_ENEMY_REPAIR_FAMILIES) {
  const family = engine.ENEMIES.find((entry) => entry.id === familyId);
  check(family, `frame-safe enemy repair family ${familyId} must exist`);
  for (const variant of family.variants) {
    const spec = { kind: 'enemy', family: familyId, variant: variant.id };
    for (const direction of engine.DIRS) for (const animation of engine.ANIMS) {
      for (let frame = 0; frame < animation.frames; frame++) {
        const discarded = [];
        const pixels = renderPixels(spec, direction, animation.id, frame, {
          onOutOfBounds: (pixel) => discarded.push(pixel),
        });
        const prefix = `${familyId} ${variant.id} ${direction} ${animation.id} frame ${frame + 1}`;
        check(discarded.length === 0, `${prefix} must not attempt out-of-bounds writes`);
        for (let x = 0; x < engine.SIZE; x++) {
          check(pixels[x] === null, `${prefix} must reserve the top outline row`);
          check(
            pixels[((engine.SIZE - 1) * engine.SIZE) + x] === null,
            `${prefix} must reserve the bottom outline row`,
          );
        }
        for (let y = 1; y < engine.SIZE - 1; y++) {
          check(pixels[y * engine.SIZE] === null, `${prefix} must reserve the left outline column`);
          check(
            pixels[(y * engine.SIZE) + engine.SIZE - 1] === null,
            `${prefix} must reserve the right outline column`,
          );
        }
        frameSafeEnemyCases++;
      }
    }
  }
}

for (const [familyId, variantId] of [
  ['cyclops', 'shepherd'],
  ['troll', 'cave'],
  ['dwarf', 'miner'],
  ['ogre', 'brute'],
  ['goblin', 'brute'],
  ['zombie', 'rotter'],
  ['zombie', 'brute'],
  ['imp', 'fiend'],
  ['orc', 'berserker'],
  ['lizardfolk', 'marsh'],
  ['minotaur', 'ironhorn'],
  ['demon', 'pit'],
]) {
  const verticalClubSpec = {
    kind: 'enemy',
    family: familyId,
    variant: variantId,
  };
  for (const [direction, layer, edgeRow] of [
    ['down', 'weapon-front', engine.SIZE - 1],
    ['up', 'weapon-back', 0],
  ]) {
    const strikeFrames = [1, 2].map((frame) => (
      renderPixels(verticalClubSpec, direction, 'attack', frame, { layer })
    ));
    for (const [frameIndex, pixels] of strikeFrames.entries()) {
      check(
        pixels.slice(edgeRow * engine.SIZE, (edgeRow + 1) * engine.SIZE)
          .every((pixel) => pixel === null),
        `${familyId} ${variantId} ${direction} attack frame ${frameIndex + 2} club layer `
          + 'must reserve its vertical outline row',
      );
      check(
        pixels.some(Boolean),
        `${familyId} ${variantId} ${direction} attack frame ${frameIndex + 2} `
          + 'must retain the striking club',
      );
    }
    check(
      JSON.stringify(strikeFrames[0]) !== JSON.stringify(strikeFrames[1]),
      `${familyId} ${variantId} ${direction} attack `
        + 'must retain distinct strike and recoil club frames',
    );
  }
}

for (const familyId of ['cyclops', 'troll']) {
  const exteriorOutlineFamily = engine.ENEMIES.find((family) => family.id === familyId);
  for (const variant of exteriorOutlineFamily.variants) {
    const spec = { kind: 'enemy', family: familyId, variant: variant.id };
    for (const direction of engine.DIRS) for (const animation of engine.ANIMS) {
      for (let frame = 0; frame < animation.frames; frame++) {
        const source = renderPixels(spec, direction, animation.id, frame);
        const sourceCavities = cardinalTransparentCavityGroups(source);
        for (const outlineMode of [
          engine.OUTLINE_MODE_COMPLETE_B,
          engine.OUTLINE_MODE_SELECTIVE_C,
        ]) {
          const outlined = renderOutlinedPixels(
            spec,
            direction,
            animation.id,
            frame,
            outlineMode,
          );
          const prefix =
            `${familyId} ${variant.id} ${direction} `
            + `${animation.id}/${frame + 1} ${outlineMode}`;
          check(
            source.every((pixel, index) => !pixel || outlined[index] === pixel),
            `${prefix} exterior outline must preserve every authored source pixel`,
          );
          for (const cavity of sourceCavities) {
            check(
              cavity.every((index) => !outlined[index]),
              `${prefix} must preserve its ${cavity.length}-pixel source cavity`,
            );
          }
        }
      }
    }
  }
}

let frameSafeEnemyStaffCases = 0;
for (const family of engine.ENEMIES) {
  for (const variant of family.variants.filter((entry) => entry.weapon === 'staff')) {
    const spec = { kind: 'enemy', family: family.id, variant: variant.id };
    for (const frame of [1, 2]) {
      const pixels = renderPixels(spec, 'up', 'attack', frame, { layer: 'weapon-back' });
      check(
        pixels.slice(0, engine.SIZE).every((pixel) => pixel === null),
        `${family.id} ${variant.id} up attack frame ${frame + 1} staff layer must reserve the top outline row`,
      );
      check(pixels.some(Boolean), `${family.id} ${variant.id} up attack frame ${frame + 1} must retain the raised staff`);
      frameSafeEnemyStaffCases++;
    }
  }
}

for (const familyId of [
  'wolf', 'boar', 'bear', 'bigcat',
  'crocodile', 'turtle', 'griffin',
  'slime', 'shroom',
  'golem', 'treant', 'worm', 'beetle',
]) {
  const family = engine.ENEMIES.find((entry) => entry.id === familyId);
  for (const variant of family.variants) {
    const spec = { kind: 'enemy', family: familyId, variant: variant.id };
    for (const direction of engine.DIRS) {
      const firstStrike = renderPixels(spec, direction, 'attack', 1);
      const recoil = renderPixels(spec, direction, 'attack', 2);
      check(
        JSON.stringify(firstStrike) !== JSON.stringify(recoil),
        `${familyId} ${variant.id} ${direction} attack must preserve distinct strike and recoil frames`,
      );
    }
  }
}

const beetleFamily = engine.ENEMIES.find((entry) => entry.id === 'beetle');
for (const variant of beetleFamily.variants) {
  const spec = { kind: 'enemy', family: 'beetle', variant: variant.id };
  for (const [frame, forwardOffset] of [[1, 1], [2, 0]]) {
    const pixels = renderPixels(spec, 'down', 'attack', frame);
    check(
      pixels[((16 + forwardOffset) * engine.SIZE) + 10] === '#f4f4f4'
        && pixels[((16 + forwardOffset) * engine.SIZE) + 13] === '#f4f4f4',
      `beetle ${variant.id} down attack frame ${frame + 1} must retain both front-facing eyes`,
    );
    check(
      pixels[((21 + forwardOffset) * engine.SIZE) + 8] === variant.c[2]
        && pixels[((21 + forwardOffset) * engine.SIZE) + 15] === variant.c[2],
      `beetle ${variant.id} down attack frame ${frame + 1} must retain both forward palette-colored antennae`,
    );

    const backPixels = renderPixels(spec, 'up', 'attack', frame);
    check(
      backPixels[((8 - forwardOffset) * engine.SIZE) + 10] === variant.c[1]
        && backPixels[((8 - forwardOffset) * engine.SIZE) + 13] === variant.c[1],
      `beetle ${variant.id} up attack frame ${frame + 1} must show the eye-free back of the head`,
    );
    check(
      backPixels[((4 - forwardOffset) * engine.SIZE) + 8] === variant.c[2]
        && backPixels[((4 - forwardOffset) * engine.SIZE) + 15] === variant.c[2],
      `beetle ${variant.id} up attack frame ${frame + 1} must retain both receding palette-colored antennae`,
    );
  }
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

check(
  Object.isFrozen(engine.WILDSHOT_GAME_PACK_POLICY)
    && Object.isFrozen(engine.WILDSHOT_GAME_PACK_POLICY.frameContract)
    && Object.isFrozen(engine.WILDSHOT_GAME_PACK_POLICY.frameContract.dirs)
    && Object.isFrozen(engine.WILDSHOT_GAME_PACK_POLICY.frameContract.anims)
    && engine.WILDSHOT_GAME_PACK_POLICY.frameContract.anims.every(Object.isFrozen)
    && engine.WILDSHOT_GAME_PACK_POLICY.pack === 'wildshot-assembler'
    && engine.WILDSHOT_GAME_PACK_POLICY.version === 1
    && engine.WILDSHOT_GAME_PACK_POLICY.cell === 24
    && engine.WILDSHOT_GAME_PACK_POLICY.exportScale === 1,
  'the Wildshot game-pack policy must be deeply immutable and native 1x',
);
check(
  JSON.stringify(engine.WILDSHOT_GAME_PACK_POLICY.frameContract) === JSON.stringify({
    dirs: ['down', 'left', 'right', 'up'],
    anims: [
      { id: 'idle', frames: 2, ms: 420 },
      { id: 'walk', frames: 4, ms: 150 },
      { id: 'attack', frames: 4, ms: 115 },
      { id: 'cast', frames: 4, ms: 130 },
      { id: 'hurt', frames: 2, ms: 140 },
      { id: 'death', frames: 4, ms: 160 },
    ],
    layout: 'rows = dirs in order; columns = anims in order, frames left to right',
  }),
  'the Wildshot v1 direction, animation, timing, and layout contract must remain exact',
);
check(
  JSON.stringify(engine.WILDSHOT_GAME_PACK_ACTOR_CATEGORIES) === JSON.stringify(['player', 'enemy'])
    && Object.isFrozen(engine.WILDSHOT_GAME_PACK_ACTOR_CATEGORIES)
    && JSON.stringify(engine.WILDSHOT_GAME_PACK_EFFECT_CATEGORIES)
      === JSON.stringify(['projectiles', 'impacts', 'trails', 'statuses'])
    && Object.isFrozen(engine.WILDSHOT_GAME_PACK_EFFECT_CATEGORIES),
  'the Wildshot v1 actor and effect category folders must remain immutable',
);

const gamePackRuntimeAudit = engine.auditWildshotGamePackRuntime();
check(
  gamePackRuntimeAudit.ready
    && Object.isFrozen(gamePackRuntimeAudit)
    && Object.isFrozen(gamePackRuntimeAudit.current)
    && Object.isFrozen(gamePackRuntimeAudit.required)
    && Object.isFrozen(gamePackRuntimeAudit.issues)
    && gamePackRuntimeAudit.current.cell === 24
    && gamePackRuntimeAudit.current.anims.reduce((sum, animation) => sum + animation.frames, 0) === 20
    && gamePackRuntimeAudit.issues.length === 0,
  'the Wildshot runtime must satisfy the approved 20-column Cast and Death contract',
);

const gamePackPlayerInput = {
  id: 'hero-one',
  category: 'player',
  sheet: 'players/hero-one.png',
  spec: {
    kind: 'player',
    species: 'human',
    bodyBuild: 'classic',
    skin: 'peach',
    hairStyle: 'spiky',
    hairColor: 'brown',
    expression: 'neutral',
    faceDetail: 'none',
    headgear: 'none',
    outfit: 'tunic',
    outfitTier: 'tier1',
    outfitColor: 'royal',
    weapon: 'sword',
    weaponTier: 'tier1',
    shield: 'round',
    shieldTier: 'tier1',
    offhand: 'none',
    palette: {
      skin: ['#101010', '#202020'],
      hair: ['#303030', '#404040'],
      outfit: ['#505050', '#606060'],
    },
  },
  tags: ['phase-a', 'ranger'],
};
const gamePackEnemyInput = {
  id: 'slime-one',
  category: 'enemy',
  sheet: 'enemies/slime-one.png',
  spec: { kind: 'enemy', family: 'slime', variant: 'lime' },
};
const gamePackEffectInput = {
  id: 'spark-hit',
  category: 'impacts',
  sheet: 'effects/impacts/spark-hit.png',
  frames: 3,
  ms: 90,
  anchor: [12, 12],
  directional: false,
};
const gamePackManifest = engine.buildWildshotGamePackManifest({
  generated: '2026-07-27',
  toolCommit: 'b7eae05',
  actors: [gamePackEnemyInput, gamePackPlayerInput],
  effects: [gamePackEffectInput],
});
const gamePackManifestReplay = engine.buildWildshotGamePackManifest({
  generated: '2026-07-27',
  toolCommit: 'b7eae05',
  actors: [gamePackPlayerInput, gamePackEnemyInput],
  effects: [gamePackEffectInput],
});
check(
  gamePackManifest.export_scale === 1
    && gamePackManifest.cell === 24
    && gamePackManifest.tool_commit === 'b7eae05'
    && JSON.stringify(gamePackManifest.actors.map(({ id }) => id)) === JSON.stringify(['hero-one', 'slime-one'])
    && JSON.stringify(gamePackManifest.effects.map(({ id }) => id)) === JSON.stringify(['spark-hit'])
    && JSON.stringify(gamePackManifest) === JSON.stringify(gamePackManifestReplay)
    && Buffer.compare(
      Buffer.from(engine.serializeWildshotGamePackManifest(gamePackManifest)),
      Buffer.from(engine.serializeWildshotGamePackManifest(gamePackManifestReplay)),
    ) === 0,
  'Wildshot manifests must be native 1x, stably ordered, and byte-deterministic for identical inputs',
);
gamePackPlayerInput.spec.palette.skin[0] = '#ffffff';
gamePackPlayerInput.tags[0] = 'mutated';
check(
  gamePackManifest.actors[0].spec.palette.skin[0] === '#101010'
    && gamePackManifest.actors[0].tags[0] === 'phase-a',
  'Wildshot manifests must deep-copy ordinary actor specifications and tags',
);

const gamePackManifestBytes = engine.serializeWildshotGamePackManifest(gamePackManifest);
const validGamePackFiles = [
  { path: 'manifest.json', data: gamePackManifestBytes },
  {
    path: 'players/hero-one.png',
    width: 480,
    height: 96,
    binaryAlpha: true,
    nonEmptyFrame0: ['idle', 'walk', 'attack', 'cast', 'death'],
  },
  {
    path: 'enemies/slime-one.png',
    width: 480,
    height: 96,
    binaryAlpha: true,
    nonEmptyFrame0: ['idle', 'walk', 'attack', 'cast', 'death'],
  },
  {
    path: 'effects/impacts/spark-hit.png',
    width: 72,
    height: 24,
    binaryAlpha: true,
  },
  { path: 'LICENSE', data: new TextEncoder().encode('Approved test license\n') },
];
const validGamePackAudit = engine.validateWildshotGamePackExport({
  manifest: gamePackManifest,
  files: validGamePackFiles,
});
check(
  validGamePackAudit.valid && validGamePackAudit.issues.length === 0,
  'a complete native 1x Wildshot v1 export audit must pass',
);

const invalidGamePackFiles = validGamePackFiles.map((file) => ({
  ...file,
  ...(Array.isArray(file.nonEmptyFrame0) ? { nonEmptyFrame0: [...file.nonEmptyFrame0] } : {}),
}));
invalidGamePackFiles.find(({ path: filePath }) => filePath === 'manifest.json').data = new Uint8Array([
  0xef, 0xbb, 0xbf, ...gamePackManifestBytes,
]);
const invalidGamePackPlayer = invalidGamePackFiles.find(({ path: filePath }) => filePath === 'players/hero-one.png');
invalidGamePackPlayer.binaryAlpha = false;
invalidGamePackPlayer.nonEmptyFrame0 = ['idle', 'walk', 'attack'];
invalidGamePackFiles.find(({ path: filePath }) => filePath === 'effects/impacts/spark-hit.png').width = 96;
invalidGamePackFiles.find(({ path: filePath }) => filePath === 'LICENSE').data = new Uint8Array();
invalidGamePackFiles.push({ path: 'orphan.png', width: 24, height: 24, binaryAlpha: true });
const invalidGamePackAudit = engine.validateWildshotGamePackExport({
  manifest: gamePackManifest,
  files: invalidGamePackFiles,
});
check(
  !invalidGamePackAudit.valid
    && invalidGamePackAudit.issues.includes('file:orphan:orphan.png')
    && invalidGamePackAudit.issues.includes('png:alpha:players/hero-one.png')
    && invalidGamePackAudit.issues.includes('actor:empty:cast:players/hero-one.png')
    && invalidGamePackAudit.issues.includes('actor:empty:death:players/hero-one.png')
    && invalidGamePackAudit.issues.includes('effect:dimensions:effects/impacts/spark-hit.png')
    && invalidGamePackAudit.issues.includes('manifest:bom:manifest.json')
    && invalidGamePackAudit.issues.includes('license:missing-content:LICENSE'),
  'the Wildshot export audit must refuse orphan files, invalid dimensions, non-binary alpha, empty Cast/Death, BOM JSON, and empty license text',
);
const wrongScaleGamePackManifest = { ...gamePackManifest, export_scale: 4 };
const wrongScaleGamePackFiles = validGamePackFiles.map((file) => (
  file.path === 'manifest.json'
    ? { ...file, data: engine.serializeWildshotGamePackManifest(wrongScaleGamePackManifest) }
    : file
));
check(
  engine.validateWildshotGamePackExport({
    manifest: wrongScaleGamePackManifest,
    files: wrongScaleGamePackFiles,
  }).issues.includes('manifest:export-scale'),
  'the Wildshot game-pack validator must refuse every export scale except native 1x',
);
let invalidGamePackIdRejected = false;
try {
  engine.buildWildshotGamePackManifest({
    generated: '2026-07-27',
    toolCommit: 'b7eae05',
    actors: [{ ...gamePackEnemyInput, id: 'Not Valid', sheet: 'enemies/Not Valid.png' }],
  });
} catch {
  invalidGamePackIdRejected = true;
}
check(invalidGamePackIdRejected, 'Wildshot game-pack manifests must reject non-kebab actor ids and filenames');
let invalidGamePackCatalogRejected = false;
try {
  engine.buildWildshotGamePackManifest({
    generated: '2026-07-27',
    toolCommit: 'b7eae05',
    actors: [{
      ...gamePackManifest.actors[0],
      spec: { ...gamePackManifest.actors[0].spec, species: 'missing-species' },
    }],
  });
} catch {
  invalidGamePackCatalogRejected = true;
}
check(
  invalidGamePackCatalogRejected,
  'Wildshot game-pack manifests must reject actor specifications outside the stable catalogs',
);

check(engine.CLASS_PACK_FORMAT === '8-bit-sprite-assembler-class-pack', 'class packs must expose a stable game-facing format id');
check(engine.CLASS_PACK_VERSION === 3, 'class packs must use schema v3 for utility off-hand variants');
check(engine.DEFAULT_CLASS_TEMPLATE === 'warrior', 'Warrior must remain the safe default class template');
check(
  JSON.stringify(engine.CLASS_TEMPLATES.map((template) => template.id))
    === JSON.stringify(['warrior', 'guardian', 'ranger', 'rogue', 'mage', 'cleric', 'barbarian', 'necromancer', 'paladin', 'druid']),
  'class templates must retain their six legacy ids followed by the four expanded RPG roles',
);
check(
  Object.isFrozen(engine.PRODUCTION_ROLL_PROFILE)
    && JSON.stringify(engine.PRODUCTION_ROLL_PROFILE) === JSON.stringify({ id: 'production-v1', version: 1 }),
  'Production Roll must expose one immutable production-v1 policy identity',
);
check(engine.PRODUCTION_ROLL_MAX_ATTEMPTS === 24, 'production-v1 must expose one fixed retry bound');
const expectedProductionReasonCodes = [
  'invalid-player', 'invalid-archetype', 'invalid-power-tier', 'invalid-palette-family',
  'invalid-catalog-id', 'unclassified-catalog-id',
  'class-outfit', 'class-weapon', 'class-shield', 'class-offhand',
  'equipment-pair', 'hand-conflict', 'outfit-tier', 'weapon-tier', 'shield-tier',
  'hidden-expression', 'hidden-face-detail', 'hidden-hair', 'head-identity-covered',
  'palette-family', 'custom-palette', 'complexity-limit',
];
check(
  Object.isFrozen(engine.PRODUCTION_ROLL_REASON_CODES)
    && JSON.stringify(Object.values(engine.PRODUCTION_ROLL_REASON_CODES)) === JSON.stringify(expectedProductionReasonCodes)
    && new Set(Object.values(engine.PRODUCTION_ROLL_REASON_CODES)).size === expectedProductionReasonCodes.length,
  'production-v1 validation must expose stable unique reason codes',
);
check(
  Object.isFrozen(engine.PRODUCTION_PALETTE_FAMILIES)
    && JSON.stringify(engine.PRODUCTION_PALETTE_FAMILIES.map((family) => family.id))
      === JSON.stringify(['grounded', 'royal', 'wilderness', 'arcane', 'divine', 'infernal', 'necromantic'])
    && engine.PRODUCTION_PALETTE_FAMILIES.every((family) => (
      Object.isFrozen(family)
      && Object.isFrozen(family.skins)
      && Object.isFrozen(family.hair)
      && Object.isFrozen(family.outfits)
      && family.skins.every((entry) => Object.isFrozen(entry) && entry.weight > 0 && engine.SKINS.some((item) => item.id === entry.id))
      && family.hair.every((entry) => Object.isFrozen(entry) && entry.weight > 0 && engine.HAIR_COLORS.some((item) => item.id === entry.id))
      && family.outfits.every((entry) => Object.isFrozen(entry) && entry.weight > 0 && engine.OUTFIT_COLORS.some((item) => item.id === entry.id))
    )),
  'production-v1 palette families must be deeply immutable and reference only catalog colors',
);
check(
  Object.isFrozen(engine.PRODUCTION_ROLL_FREEZE)
    && engine.PRODUCTION_ROLL_FREEZE.status === 'frozen'
    && Object.isFrozen(engine.PRODUCTION_ROLL_FREEZE.acceptedCorpus)
    && JSON.stringify(engine.PRODUCTION_ROLL_FREEZE.acceptedCorpus) === JSON.stringify({
      format: '8-bit-sprite-assembler-production-roll-review',
      version: 1,
      pairs: 120,
      pairsPerClass: 12,
      digest: 'af9b620e5ce87f6febf5983487fc163e8b5a4495fb37ced3653e8b5bbbc4ba3f',
      approved: true,
      approvedOn: '2026-07-26',
    })
    && Object.isFrozen(engine.PRODUCTION_ROLL_FREEZE.presentation)
    && JSON.stringify(engine.PRODUCTION_ROLL_FREEZE.presentation) === JSON.stringify({
      shadeMode: 'form',
      outlineMode: null,
      effects: 'off',
    })
    && Object.isFrozen(engine.PRODUCTION_ROLL_FREEZE.catalogIds)
    && Object.values(engine.PRODUCTION_ROLL_FREEZE.catalogIds).every(Object.isFrozen)
    && Object.isFrozen(engine.PRODUCTION_ROLL_FREEZE.classTemplates)
    && engine.PRODUCTION_ROLL_FREEZE.classTemplates.every((template) => (
      Object.isFrozen(template)
      && Object.isFrozen(template.weapons)
      && Object.isFrozen(template.shields)
      && Object.isFrozen(template.offhands)
    )),
  'production-v1 must expose a deeply immutable accepted corpus and presentation freeze',
);
const productionCatalogFreezeAudit = engine.auditProductionRollCatalogs();
check(
  productionCatalogFreezeAudit.valid
    && Object.isFrozen(productionCatalogFreezeAudit)
    && Object.isFrozen(productionCatalogFreezeAudit.missing)
    && Object.isFrozen(productionCatalogFreezeAudit.unclassified)
    && Object.isFrozen(productionCatalogFreezeAudit.duplicates)
    && productionCatalogFreezeAudit.missing.length === 0
    && productionCatalogFreezeAudit.unclassified.length === 0
    && productionCatalogFreezeAudit.duplicates.length === 0,
  'the frozen production-v1 catalog manifest must exactly cover current stable catalogs',
);
const futureProductionCatalogAudit = engine.auditProductionRollCatalogs({
  species: [...engine.SPECIES, { id: 'future-species' }],
});
check(
  !futureProductionCatalogAudit.valid
    && futureProductionCatalogAudit.unclassified.includes('species:future-species'),
  'new catalog ids must remain outside production-v1 until explicitly classified',
);
const missingProductionCatalogAudit = engine.auditProductionRollCatalogs({
  offhands: engine.OFFHANDS.filter((item) => item.id !== 'lantern'),
});
check(
  !missingProductionCatalogAudit.valid
    && missingProductionCatalogAudit.missing.includes('offhands:lantern'),
  'removing a frozen production-v1 catalog id must fail the catalog audit',
);
const productionClassTemplateFreezeAudit = engine.auditProductionRollClassTemplates();
check(
  productionClassTemplateFreezeAudit.valid
    && Object.isFrozen(productionClassTemplateFreezeAudit)
    && Object.isFrozen(productionClassTemplateFreezeAudit.changed)
    && productionClassTemplateFreezeAudit.changed.length === 0,
  'production-v1 must exactly match the accepted class-template equipment pools',
);
const futureProductionClassAudit = engine.auditProductionRollClassTemplates([
  ...engine.CLASS_TEMPLATES,
  {
    id: 'future-class',
    outfit: 'tunic',
    weapons: ['sword'],
    shields: [],
    offhands: [],
  },
]);
check(
  !futureProductionClassAudit.valid
    && futureProductionClassAudit.unclassified.includes('future-class'),
  'new class templates must remain outside production-v1 until explicitly reviewed',
);
const changedProductionClassAudit = engine.auditProductionRollClassTemplates(
  engine.CLASS_TEMPLATES.map((template) => (
    template.id === 'warrior'
      ? { ...template, weapons: [...template.weapons, 'bow'] }
      : template
  )),
);
check(
  !changedProductionClassAudit.valid
    && changedProductionClassAudit.changed.includes('warrior'),
  'changes to accepted class equipment pools must fail the production-v1 freeze audit',
);
check(
  engine.normalizeProductionRollSeed('  cafe\u0301  ') === 'caf\u00e9',
  'Production Roll seeds must trim and normalize Unicode deterministically',
);
const invalidProductionSeedInputs = [undefined, null, '', '   ', Number.NaN, {}, []];
const normalizedInvalidProductionSeeds = invalidProductionSeedInputs.map((seed) => (
  engine.normalizeProductionRollSeed(seed)
));
check(
  new Set(normalizedInvalidProductionSeeds).size === 1,
  'invalid Production Roll seeds must normalize to one deterministic fallback',
);
check(
  new Set(invalidProductionSeedInputs.map((seed) => JSON.stringify(engine.rollProductionPlayer(seed)))).size === 1,
  'invalid Production Roll seeds must produce one deterministic fallback result',
);

const productionGoldenResult = engine.rollProductionPlayer('slice-1-portable-golden');
const expectedProductionGoldenResult = {
  profile: 'production-v1',
  seed: 'slice-1-portable-golden',
  archetype: 'paladin',
  powerTier: 'tier5',
  paletteFamily: 'necromantic',
  attempts: 1,
  fallback: false,
  player: {
    species: 'human',
    bodyBuild: 'lean',
    skin: 'deep',
    hairStyle: 'spiky',
    hairColor: 'black',
    expression: 'surprised',
    faceDetail: 'glasses',
    headgear: 'hood',
    outfit: 'plate',
    outfitTier: 'tier5',
    outfitColor: 'purple',
    weapon: 'sword',
    weaponTier: 'tier5',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'none',
  },
  decisions: [
    { rule: 'archetype-first', choice: 'paladin' },
    { rule: 'power-band', choice: 'tier5' },
    { rule: 'palette-family', choice: 'necromantic' },
    { rule: 'class-equipment', weapon: 'sword', shield: 'none', offhand: 'none' },
    { rule: 'visibility-normalization', choice: 'none' },
    { rule: 'silhouette-budget', used: 3, limit: 5, major: 1, majorLimit: 2 },
    { rule: 'bounded-selection', attempts: 1, limit: 24, fallback: false, retryReasons: [] },
  ],
};
check(
  JSON.stringify(productionGoldenResult) === JSON.stringify(expectedProductionGoldenResult),
  'production-v1 must preserve its portable seeded golden result',
);
check(
  JSON.stringify(engine.rollProductionPlayer('slice-1-portable-golden'))
    === JSON.stringify(productionGoldenResult),
  'identical Production Roll seeds must produce identical complete results',
);
const representativeProductionResults = ['slice-1-alpha', 'slice-1-beta', 'slice-1-gamma']
  .map((seed) => {
    const result = engine.rollProductionPlayer(seed);
    return JSON.stringify({ archetype: result.archetype, player: result.player });
  });
check(
  new Set(representativeProductionResults).size === representativeProductionResults.length,
  'different representative Production Roll seeds must produce distinct character selections',
);

const productionCopyA = engine.rollProductionPlayer('slice-1-copy-safety');
const productionCopyB = engine.rollProductionPlayer('slice-1-copy-safety');
check(
  productionCopyA !== productionCopyB
    && productionCopyA.player !== productionCopyB.player
    && productionCopyA.decisions !== productionCopyB.decisions
    && productionCopyA.decisions.every((entry, index) => entry !== productionCopyB.decisions[index]),
  'Production Roll results must deeply copy player and audit containers',
);
check(
  Object.isFrozen(productionCopyA.decisions)
    && productionCopyA.decisions.every((entry) => Object.isFrozen(entry))
    && Object.isFrozen(
      productionCopyA.decisions.find((entry) => entry.rule === 'bounded-selection').retryReasons,
    ),
  'Production Roll decision metadata must be immutable',
);
const productionCopyBSpecies = productionCopyB.player.species;
productionCopyA.player.species = 'copy-safety-probe';
check(
  productionCopyB.player.species === productionCopyBSpecies,
  'mutating one ordinary Production Roll player specification must not change another result',
);

const expectedProductionPlayerFields = [
  'bodyBuild', 'expression', 'faceDetail', 'hairColor', 'hairStyle', 'headgear', 'offhand', 'outfit',
  'outfitColor', 'outfitTier', 'shield', 'shieldTier', 'skin', 'species', 'weapon', 'weaponTier',
].sort();
const expectedCompatibleRerollCategoryFields = {
  species: ['species'],
  bodyBuild: ['bodyBuild'],
  skin: ['skin'],
  hairStyle: ['hairStyle'],
  hairColor: ['hairColor'],
  expression: ['expression'],
  faceDetail: ['faceDetail'],
  headgear: ['headgear'],
  outfitColor: ['outfitColor'],
  weapon: ['weapon', 'weaponTier'],
  shield: ['shield', 'shieldTier'],
  offhand: ['offhand'],
  leftHand: ['shield', 'shieldTier', 'offhand'],
  powerTier: ['outfitTier', 'weaponTier', 'shieldTier'],
};
check(
  JSON.stringify(engine.PRODUCTION_COMPATIBLE_REROLL_POLICY) === JSON.stringify({
    id: 'production-compatible-reroll-v1',
    version: 1,
    profile: 'production-v1',
  })
    && Object.isFrozen(engine.PRODUCTION_COMPATIBLE_REROLL_POLICY),
  'compatible Production rerolls must expose one immutable versioned policy identity',
);
check(
  JSON.stringify(Object.fromEntries(engine.PRODUCTION_COMPATIBLE_REROLL_CATEGORIES.map((category) => [
    category.id,
    category.fields,
  ]))) === JSON.stringify(expectedCompatibleRerollCategoryFields)
    && Object.isFrozen(engine.PRODUCTION_COMPATIBLE_REROLL_CATEGORIES)
    && engine.PRODUCTION_COMPATIBLE_REROLL_CATEGORIES.every((category) => (
      Object.isFrozen(category) && Object.isFrozen(category.fields)
    )),
  'compatible Production rerolls must expose only their explicit immutable semantic categories',
);

const compatibleRerollGoldenBase = engine.rollProductionPlayer('compatible-reroll-golden-base');
const compatibleRerollGolden = engine.rerollProductionPlayerCategory(
  compatibleRerollGoldenBase.player,
  compatibleRerollGoldenBase,
  'headgear',
  'compatible-reroll-golden',
);
check(
  JSON.stringify(compatibleRerollGolden) === JSON.stringify({
    policy: 'production-compatible-reroll-v1',
    profile: 'production-v1',
    seed: 'compatible-reroll-golden',
    category: 'headgear',
    changed: true,
    player: {
      species: 'beastkin',
      bodyBuild: 'classic',
      skin: 'peach',
      hairStyle: 'mohawk',
      hairColor: 'blonde',
      expression: 'determined',
      faceDetail: 'blush',
      headgear: 'hood',
      outfit: 'plate',
      outfitTier: 'tier1',
      outfitColor: 'royal',
      weapon: 'warhammer',
      weaponTier: 'tier1',
      shield: 'none',
      shieldTier: 'tier1',
      offhand: 'none',
    },
    context: {
      archetype: 'guardian',
      powerTier: 'tier1',
      paletteFamily: 'royal',
    },
    audit: {
      reason: 'compatible-selection',
      candidateCount: 6,
      candidates: ['none', 'cap', 'helm', 'hood', 'crown', 'circlet'],
      selected: 'hood',
      changedFields: ['headgear'],
      beforeValid: true,
      beforeReasons: [],
    },
  }),
  'compatible Production rerolls must preserve their portable seeded golden result',
);
check(
  JSON.stringify(engine.rerollProductionPlayerCategory(
    compatibleRerollGoldenBase.player,
    compatibleRerollGoldenBase,
    'headgear',
    'compatible-reroll-golden',
  )) === JSON.stringify(compatibleRerollGolden),
  'identical compatible reroll inputs must produce identical complete results',
);

const invalidCompatibleRerollSeeds = [undefined, null, '', '   ', Number.NaN, {}, []];
check(
  new Set(invalidCompatibleRerollSeeds.map((seed) => JSON.stringify(
    engine.rerollProductionPlayerCategory(
      compatibleRerollGoldenBase.player,
      compatibleRerollGoldenBase,
      'headgear',
      seed,
    ),
  ))).size === 1,
  'invalid compatible reroll seeds must normalize to one deterministic fallback result',
);

let compatibleInvalidPlayerError;
let compatibleInvalidContextError;
let compatibleInvalidCategoryError;
try {
  engine.rerollProductionPlayerCategory(null, compatibleRerollGoldenBase, 'species', 'invalid');
} catch (error) {
  compatibleInvalidPlayerError = error;
}
try {
  engine.rerollProductionPlayerCategory(compatibleRerollGoldenBase.player, null, 'species', 'invalid');
} catch (error) {
  compatibleInvalidContextError = error;
}
try {
  engine.rerollProductionPlayerCategory(
    compatibleRerollGoldenBase.player,
    compatibleRerollGoldenBase,
    'not-a-category',
    'invalid',
  );
} catch (error) {
  compatibleInvalidCategoryError = error;
}
check(
  compatibleInvalidPlayerError instanceof TypeError
    && compatibleInvalidContextError instanceof TypeError
    && compatibleInvalidCategoryError instanceof RangeError,
  'compatible Production rerolls must reject invalid player, context, and category inputs explicitly',
);

const compatibleInvalidPolicyContext = engine.rerollProductionPlayerCategory(
  compatibleRerollGoldenBase.player,
  {},
  'species',
  'invalid-policy-context',
);
check(
  !compatibleInvalidPolicyContext.changed
    && compatibleInvalidPolicyContext.audit.reason === 'no-compatible-alternative'
    && [
      engine.PRODUCTION_ROLL_REASON_CODES.INVALID_ARCHETYPE,
      engine.PRODUCTION_ROLL_REASON_CODES.INVALID_POWER_TIER,
      engine.PRODUCTION_ROLL_REASON_CODES.INVALID_PALETTE_FAMILY,
    ].every((reason) => compatibleInvalidPolicyContext.audit.beforeReasons.includes(reason))
    && JSON.stringify(compatibleInvalidPolicyContext.player)
      === JSON.stringify(compatibleRerollGoldenBase.player),
  'compatible Production rerolls must leave the player unchanged when policy context is invalid',
);

const compatibleNoAlternativeBase = engine.rollProductionPlayer('compatible-base-2');
const compatibleNoAlternative = engine.rerollProductionPlayerCategory(
  compatibleNoAlternativeBase.player,
  compatibleNoAlternativeBase,
  'shield',
  'compatible-no-alternative',
);
check(
  !compatibleNoAlternative.changed
    && compatibleNoAlternative.audit.reason === 'no-compatible-alternative'
    && compatibleNoAlternative.audit.candidateCount === 0
    && compatibleNoAlternative.audit.selected === null
    && compatibleNoAlternative.audit.changedFields.length === 0
    && JSON.stringify(compatibleNoAlternative.player)
      === JSON.stringify(compatibleNoAlternativeBase.player)
    && compatibleNoAlternative.player !== compatibleNoAlternativeBase.player,
  'compatible Production rerolls must deep-copy an unchanged player when no compatible alternative exists',
);

const compatibleCopyA = engine.rerollProductionPlayerCategory(
  compatibleRerollGoldenBase.player,
  compatibleRerollGoldenBase,
  'headgear',
  'compatible-copy-safety',
);
const compatibleCopyB = engine.rerollProductionPlayerCategory(
  compatibleRerollGoldenBase.player,
  compatibleRerollGoldenBase,
  'headgear',
  'compatible-copy-safety',
);
check(
  compatibleCopyA !== compatibleCopyB
    && compatibleCopyA.player !== compatibleCopyB.player
    && compatibleCopyA.context !== compatibleCopyB.context
    && compatibleCopyA.audit !== compatibleCopyB.audit
    && compatibleCopyA.audit.candidates !== compatibleCopyB.audit.candidates
    && compatibleCopyA.audit.changedFields !== compatibleCopyB.audit.changedFields
    && Object.isFrozen(compatibleCopyA.context)
    && Object.isFrozen(compatibleCopyA.audit)
    && Object.isFrozen(compatibleCopyA.audit.candidates)
    && Object.isFrozen(compatibleCopyA.audit.changedFields)
    && Object.isFrozen(compatibleCopyA.audit.beforeReasons),
  'compatible Production rerolls must deeply copy players and return immutable context and audit metadata',
);
const compatibleCopyBSpecies = compatibleCopyB.player.species;
compatibleCopyA.player.species = 'copy-safety-probe';
check(
  compatibleCopyB.player.species === compatibleCopyBSpecies,
  'mutating one compatible reroll player must not change another result',
);

const compatibleRerollChangedCoverage = new Set();
let compatibleRerollCases = 0;
let compatibleRerollNoAlternativeCases = 0;
for (let index = 0; index < 300; index += 1) {
  const base = engine.rollProductionPlayer(`compatible-base-${index}`);
  for (const category of engine.PRODUCTION_COMPATIBLE_REROLL_CATEGORIES) {
    const seed = `compatible-pick-${index}-${category.id}`;
    const result = engine.rerollProductionPlayerCategory(
      base.player,
      base,
      category.id,
      seed,
    );
    const repeated = engine.rerollProductionPlayerCategory(
      base.player,
      base,
      category.id,
      seed,
    );
    const actualChangedFields = expectedProductionPlayerFields.filter((field) => (
      JSON.stringify(base.player[field]) !== JSON.stringify(result.player[field])
    ));
    compatibleRerollCases += 1;
    check(
      JSON.stringify(result) === JSON.stringify(repeated),
      `compatible reroll ${index}/${category.id} must be deterministic`,
    );
    check(
      result.policy === engine.PRODUCTION_COMPATIBLE_REROLL_POLICY.id
        && result.profile === engine.PRODUCTION_ROLL_PROFILE.id
        && result.category === category.id
        && JSON.stringify(Object.keys(result.player).sort())
          === JSON.stringify(expectedProductionPlayerFields),
      `compatible reroll ${index}/${category.id} must return an ordinary player and stable policy identity`,
    );
    check(
      result.context.archetype === base.archetype
        && result.context.paletteFamily === base.paletteFamily
        && (
          category.id === 'powerTier'
            ? result.context.powerTier !== base.powerTier
            : result.context.powerTier === base.powerTier
        ),
      `compatible reroll ${index}/${category.id} must preserve policy context outside its declared category`,
    );
    if (result.changed) {
      compatibleRerollChangedCoverage.add(category.id);
      const validation = engine.validateProductionPlayer(result.player, result.context);
      check(
        validation.valid && validation.reasons.length === 0,
        `compatible reroll ${index}/${category.id} must remain production-valid`,
      );
      check(
        actualChangedFields.length > 0
          && actualChangedFields.every((field) => category.fields.includes(field))
          && JSON.stringify([...result.audit.changedFields].sort())
            === JSON.stringify(actualChangedFields)
          && result.audit.reason === 'compatible-selection'
          && result.audit.candidateCount > 0
          && result.audit.candidates.includes(result.audit.selected),
        `compatible reroll ${index}/${category.id} must change only its declared fields`,
      );
    } else {
      compatibleRerollNoAlternativeCases += 1;
      check(
        actualChangedFields.length === 0
          && JSON.stringify(result.player) === JSON.stringify(base.player)
          && JSON.stringify(result.context) === JSON.stringify({
            archetype: base.archetype,
            powerTier: base.powerTier,
            paletteFamily: base.paletteFamily,
          })
          && result.audit.reason === 'no-compatible-alternative'
          && result.audit.candidateCount === 0
          && result.audit.selected === null,
        `compatible reroll ${index}/${category.id} must report an explicit unchanged outcome`,
      );
    }
  }
}
check(
  engine.PRODUCTION_COMPATIBLE_REROLL_CATEGORIES.every((category) => (
    compatibleRerollChangedCoverage.has(category.id)
  )),
  'the compatible reroll audit must exercise a valid change in every supported category',
);
check(
  compatibleRerollNoAlternativeCases > 0,
  'the compatible reroll audit must exercise explicit no-compatible-alternative outcomes',
);

const compatibleStoredPlayer = {
  ...compatibleRerollGoldenBase.player,
  palette: null,
  seed: 'must-not-leak',
  archetype: 'must-not-leak',
};
const compatibleStoredResult = engine.rerollProductionPlayerCategory(
  compatibleStoredPlayer,
  compatibleRerollGoldenBase,
  'hairColor',
  'compatible-stored-player',
);
check(
  compatibleStoredResult.player.palette === null
    && !Object.prototype.hasOwnProperty.call(compatibleStoredResult.player, 'seed')
    && !Object.prototype.hasOwnProperty.call(compatibleStoredResult.player, 'archetype')
    && engine.validateProductionPlayer(
      compatibleStoredResult.player,
      compatibleStoredResult.context,
    ).valid,
  'compatible rerolls must preserve the ordinary nullable palette field while stripping provenance-like extras',
);

const productionStoredPlayer = { ...productionGoldenResult.player, palette: null };
const expectedStoredPlayerFields = [...expectedProductionPlayerFields, 'palette'].sort();
const productionIdentityFields = [
  'species', 'bodyBuild', 'skin', 'hairStyle', 'hairColor', 'expression',
  'faceDetail', 'headgear', 'outfitColor', 'palette',
];
check(
  JSON.stringify(Object.keys(productionStoredPlayer).sort()) === JSON.stringify(expectedStoredPlayerFields),
  'resolved Production players must enter existing persistence and export paths as ordinary schema-v12 player specifications',
);
const productionClassPack = engine.buildClassPack(
  productionStoredPlayer,
  productionGoldenResult.archetype,
);
check(
  productionClassPack.template.id === productionGoldenResult.archetype
    && productionIdentityFields.every((field) => (
      JSON.stringify(productionClassPack.baseSpec[field]) === JSON.stringify(productionStoredPlayer[field])
    ))
    && productionClassPack.variants.every((variant) => (
      JSON.stringify(Object.keys(variant.spec).sort()) === JSON.stringify(expectedStoredPlayerFields)
    )),
  'class packs must accept resolved Production players without provenance fields or identity loss',
);
const productionVariantBatch = engine.buildVariantBatch(productionStoredPlayer, 'rpg-equipment');
check(
  productionVariantBatch.variants.length > 0
    && productionVariantBatch.variants.every((variant) => (
      productionIdentityFields.every((field) => (
        JSON.stringify(variant.spec[field]) === JSON.stringify(productionStoredPlayer[field])
      ))
        && JSON.stringify(Object.keys(variant.spec).sort()) === JSON.stringify(expectedStoredPlayerFields)
    )),
  'equipment batches must accept resolved Production players without provenance fields or identity loss',
);
const productionCompleteKit = characterKit.buildCompleteCharacterKitPlan([{
  id: 'production-v1-integration',
  name: 'Production v1 integration',
  kind: 'player',
  spec: productionStoredPlayer,
  outlineMode: engine.OUTLINE_MODE_NONE,
  shadeMode: engine.SHADE_MODE_FORM,
}]);
const productionCompleteKitRecipe = productionCompleteKit.recipes[0];
check(
  productionCompleteKitRecipe
    && productionCompleteKitRecipe.shadeMode === engine.SHADE_MODE_FORM
    && productionCompleteKitRecipe.outlineMode === engine.OUTLINE_MODE_NONE
    && productionCompleteKitRecipe.spec.kind === 'player'
    && JSON.stringify(Object.keys(productionCompleteKitRecipe.spec).sort())
      === JSON.stringify([...expectedStoredPlayerFields, 'kind'].sort())
    && Object.entries(productionStoredPlayer).every(([field, value]) => (
      JSON.stringify(productionCompleteKitRecipe.spec[field]) === JSON.stringify(value)
    )),
  'Complete Kit recipes must preserve resolved Production players through the existing schema without roll metadata',
);
let productionIntegrationRenderCases = 0;
for (const direction of engine.DIRS) {
  for (const animation of engine.ANIMS) {
    for (let frame = 0; frame < animation.frames; frame += 1) {
      const spec = { kind: 'player', ...productionStoredPlayer };
      const rendered = renderAssembledPixels(spec, direction, animation.id, frame, {
        shadeMode: engine.SHADE_MODE_FORM,
        outlineMode: engine.OUTLINE_MODE_COMPLETE_B,
      });
      const repeated = renderAssembledPixels(spec, direction, animation.id, frame, {
        shadeMode: engine.SHADE_MODE_FORM,
        outlineMode: engine.OUTLINE_MODE_COMPLETE_B,
      });
      productionIntegrationRenderCases += 1;
      check(
        rendered.some(Boolean) && pixelsMatch(rendered, repeated),
        `resolved Production exports must render deterministically in ${direction} ${animation.id} frame ${frame}`,
      );
    }
  }
}
const originalMathRandom = Math.random;
let wildcardZeroResult;
try {
  Math.random = () => 0;
  wildcardZeroResult = engine.randomPlayer();
} finally {
  Math.random = originalMathRandom;
}
check(
  JSON.stringify(wildcardZeroResult) === JSON.stringify({
    species: 'human',
    bodyBuild: 'classic',
    skin: 'pale',
    hairStyle: 'bald',
    hairColor: 'black',
    expression: 'neutral',
    faceDetail: 'none',
    headgear: 'none',
    outfit: 'tunic',
    outfitTier: 'tier1',
    outfitColor: 'crimson',
    weapon: 'sword',
    weaponTier: 'tier1',
    shield: 'none',
    shieldTier: 'tier1',
    offhand: 'lantern',
  }),
  'Wildcard Roll must preserve the existing randomPlayer() selection contract',
);
const productionPlayerCatalogs = [
  ['species', engine.SPECIES],
  ['bodyBuild', engine.BODY_BUILDS],
  ['skin', engine.SKINS],
  ['hairStyle', engine.HAIR_STYLES],
  ['hairColor', engine.HAIR_COLORS],
  ['expression', engine.EXPRESSIONS],
  ['faceDetail', engine.FACIAL_DETAILS],
  ['headgear', engine.HEADGEAR],
  ['outfit', engine.OUTFITS],
  ['outfitTier', engine.OUTFIT_TIERS],
  ['outfitColor', engine.OUTFIT_COLORS],
  ['weapon', engine.WEAPONS],
  ['weaponTier', engine.WEAPON_TIERS],
  ['shield', engine.SHIELDS],
  ['shieldTier', engine.SHIELD_TIERS],
  ['offhand', engine.OFFHANDS],
];
const productionClassCoverage = new Set();
const productionSpeciesCoverage = new Set();
const productionBodyBuildCoverage = new Set();
const productionOutfitColorCoverage = new Set();
const productionOutfitCoverage = new Set();
const productionWeaponCoverage = new Set();
const productionShieldCoverage = new Set();
const productionOffhandCoverage = new Set();
const productionTierCoverage = new Set();
const productionPaletteCoverage = new Set();
const productionEquipmentByClass = new Map(engine.CLASS_TEMPLATES.map((template) => [
  template.id,
  { lantern: 0, none: 0, shields: new Map() },
]));
let productionFallbackCases = 0;
let productionRetryCases = 0;
let productionVisibilityNormalizations = 0;
let productionRollCases = 0;
for (let index = 0; index < 1000; index += 1) {
  const result = engine.rollProductionPlayer(`production-policy-${index}`);
  const template = engine.CLASS_TEMPLATES.find((item) => item.id === result.archetype);
  const palette = engine.PRODUCTION_PALETTE_FAMILIES.find((item) => item.id === result.paletteFamily);
  const validation = engine.validateProductionPlayer(result.player, result);
  const headgear = engine.HEADGEAR.find((item) => item.id === result.player.headgear);
  const boundedDecision = result.decisions.find((entry) => entry.rule === 'bounded-selection');
  const visibilityDecision = result.decisions.find((entry) => entry.rule === 'visibility-normalization');
  productionRollCases += 1;
  productionClassCoverage.add(result.archetype);
  productionSpeciesCoverage.add(result.player.species);
  productionBodyBuildCoverage.add(result.player.bodyBuild);
  productionOutfitColorCoverage.add(result.player.outfitColor);
  productionOutfitCoverage.add(result.player.outfit);
  productionWeaponCoverage.add(result.player.weapon);
  if (result.player.shield !== 'none') productionShieldCoverage.add(result.player.shield);
  if (result.player.offhand !== 'none') productionOffhandCoverage.add(result.player.offhand);
  productionTierCoverage.add(result.powerTier);
  productionPaletteCoverage.add(result.paletteFamily);
  const classEquipment = productionEquipmentByClass.get(result.archetype);
  if (result.player.offhand === 'lantern') classEquipment.lantern += 1;
  else if (result.player.shield === 'none') classEquipment.none += 1;
  else classEquipment.shields.set(
    result.player.shield,
    (classEquipment.shields.get(result.player.shield) || 0) + 1,
  );
  if (result.fallback) productionFallbackCases += 1;
  if (result.attempts > 1) productionRetryCases += 1;
  if (visibilityDecision?.choice !== 'none' && visibilityDecision?.choice !== 'fallback-safe') {
    productionVisibilityNormalizations += 1;
  }
  check(result.profile === engine.PRODUCTION_ROLL_PROFILE.id, 'Production Roll results must retain the immutable profile id');
  check(
    validation.valid && validation.reasons.length === 0,
    `Production Roll ${index} must pass production-v1 validation`,
  );
  check(
    result.attempts >= 1
      && result.attempts <= engine.PRODUCTION_ROLL_MAX_ATTEMPTS
      && boundedDecision?.limit === engine.PRODUCTION_ROLL_MAX_ATTEMPTS
      && boundedDecision?.attempts === result.attempts
      && boundedDecision?.fallback === result.fallback,
    `Production Roll ${index} must report its bounded deterministic selection`,
  );
  check(
    JSON.stringify(Object.keys(result.player).sort()) === JSON.stringify(expectedProductionPlayerFields),
    'Production Roll must return an ordinary player specification without provenance fields',
  );
  for (const [field, catalog] of productionPlayerCatalogs) {
    check(
      catalog.some((entry) => entry.id === result.player[field]),
      `Production Roll ${index} must select a catalog-valid ${field}`,
    );
  }
  check(
    template
      && result.player.outfit === template.outfit
      && template.weapons.includes(result.player.weapon)
      && (result.player.shield === 'none' || template.shields.includes(result.player.shield))
      && (result.player.offhand === 'none' || template.offhands.includes(result.player.offhand)),
    `Production Roll ${index} must select equipment only from its class template`,
  );
  check(
    !(result.player.shield !== 'none' && result.player.offhand !== 'none'),
    `Production Roll ${index} must keep shield and utility off-hand selections mutually exclusive`,
  );
  check(
    result.player.outfitTier === result.powerTier
      && result.player.weaponTier === result.powerTier
      && (result.player.shield === 'none'
        ? result.player.shieldTier === 'tier1'
        : result.player.shieldTier === result.powerTier),
    `Production Roll ${index} must keep one coherent equipment power band`,
  );
  check(
    palette
      && palette.skins.some((entry) => entry.id === result.player.skin)
      && palette.hair.some((entry) => entry.id === result.player.hairColor)
      && palette.outfits.some((entry) => entry.id === result.player.outfitColor)
      && result.player.palette == null,
    `Production Roll ${index} must use only its fixed catalog palette family`,
  );
  check(
    validation.complexity.used <= validation.complexity.limit
      && validation.complexity.major <= validation.complexity.majorLimit,
    `Production Roll ${index} must stay inside the catalog-level silhouette budget`,
  );
  if (headgear?.hideAll || headgear?.hideFace) {
    check(
      result.player.expression === 'neutral' && result.player.faceDetail === 'none',
      `Production Roll ${index} must normalize hidden face selections`,
    );
  }
  if (headgear?.hideAll) {
    check(
      ['bald', 'short', 'spiky', 'bowl', 'topknot'].includes(result.player.hairStyle),
      `Production Roll ${index} must retain only fitted or hidden hair beneath a full helmet`,
    );
  }
  if (['elf', 'orc', 'goblin', 'dwarf', 'undead', 'beastkin'].includes(result.player.species)) {
    check(
      !(headgear?.hideAll || headgear?.hideFace),
      `Production Roll ${index} must preserve head-based species identity`,
    );
  }
  check(
    Object.isFrozen(result.decisions)
      && result.decisions.every((entry) => Object.isFrozen(entry))
      && Object.isFrozen(boundedDecision?.retryReasons),
    `Production Roll ${index} must return immutable audit metadata`,
  );
}
check(
  engine.CLASS_TEMPLATES.every((template) => productionClassCoverage.has(template.id)),
  'portable Production Roll selection must be able to reach every class id',
);
check(
  engine.SPECIES.every((item) => productionSpeciesCoverage.has(item.id))
    && engine.BODY_BUILDS.every((item) => productionBodyBuildCoverage.has(item.id))
    && engine.OUTFIT_COLORS.every((item) => productionOutfitColorCoverage.has(item.id)),
  'the 1,000-seed Production Roll audit must cover every species, body build, and outfit color',
);
check(
  new Set(engine.CLASS_TEMPLATES.map((template) => template.outfit)).size === productionOutfitCoverage.size
    && engine.CLASS_TEMPLATES.every((template) => productionOutfitCoverage.has(template.outfit)),
  'the 1,000-seed Production Roll audit must cover every class outfit family',
);
check(
  new Set(engine.CLASS_TEMPLATES.flatMap((template) => template.weapons)).size === productionWeaponCoverage.size
    && engine.CLASS_TEMPLATES.every((template) => template.weapons.every((id) => productionWeaponCoverage.has(id))),
  'the 1,000-seed Production Roll audit must cover every permitted weapon family',
);
check(
  new Set(engine.CLASS_TEMPLATES.flatMap((template) => template.shields)).size === productionShieldCoverage.size
    && engine.CLASS_TEMPLATES.every((template) => template.shields.every((id) => productionShieldCoverage.has(id))),
  'the 1,000-seed Production Roll audit must cover every permitted shield family',
);
check(
  new Set(engine.CLASS_TEMPLATES.flatMap((template) => template.offhands)).size === productionOffhandCoverage.size
    && engine.CLASS_TEMPLATES.every((template) => template.offhands.every((id) => productionOffhandCoverage.has(id))),
  'the 1,000-seed Production Roll audit must cover every permitted utility off-hand family',
);
check(
  engine.OUTFIT_TIERS.every((tier) => productionTierCoverage.has(tier.id))
    && engine.PRODUCTION_PALETTE_FAMILIES.every((family) => productionPaletteCoverage.has(family.id)),
  'the 1,000-seed Production Roll audit must cover every power tier and palette family',
);
check(
  engine.CLASS_TEMPLATES.every((template) => {
    const counts = productionEquipmentByClass.get(template.id);
    if (counts.none === 0) return false;
    if (!template.offhands.includes('lantern')) return counts.lantern === 0;
    return counts.lantern > Math.max(0, ...counts.shields.values());
  }),
  'Production Roll must retain shieldless results and favor Lantern over each individual shield where permitted',
);
check(
  productionRetryCases > 0
    && productionFallbackCases > 0
    && productionFallbackCases < Math.ceil(productionRollCases / 10)
    && productionVisibilityNormalizations > 0,
  'the policy audit must exercise bounded retries, safe fallback, and visibility normalization without collapsing variety',
);

const productionFallbackProbe = engine.rollProductionPlayer('production-policy-34');
check(
  productionFallbackProbe.fallback
    && productionFallbackProbe.attempts === engine.PRODUCTION_ROLL_MAX_ATTEMPTS
    && engine.validateProductionPlayer(productionFallbackProbe.player, productionFallbackProbe).valid
    && JSON.stringify(engine.rollProductionPlayer('production-policy-34'))
      === JSON.stringify(productionFallbackProbe),
  'production-v1 must exercise a deterministic policy-valid bounded fallback',
);
const invalidProductionPlayerValidation = engine.validateProductionPlayer(null, {});
check(
  !invalidProductionPlayerValidation.valid
    && invalidProductionPlayerValidation.reasons.includes(engine.PRODUCTION_ROLL_REASON_CODES.INVALID_PLAYER),
  'Production validation must reject non-object player specifications with a stable reason',
);
const invalidProductionContext = engine.validateProductionPlayer(productionGoldenResult.player, {});
check(
  !invalidProductionContext.valid
    && [
      engine.PRODUCTION_ROLL_REASON_CODES.INVALID_ARCHETYPE,
      engine.PRODUCTION_ROLL_REASON_CODES.INVALID_POWER_TIER,
      engine.PRODUCTION_ROLL_REASON_CODES.INVALID_PALETTE_FAMILY,
    ].every((reason) => invalidProductionContext.reasons.includes(reason)),
  'Production validation must reject missing policy context with stable reasons',
);
const unclassifiedProductionPlayerValidation = engine.validateProductionPlayer({
  ...productionGoldenResult.player,
  species: 'future-species',
}, productionGoldenResult);
check(
  !unclassifiedProductionPlayerValidation.valid
    && unclassifiedProductionPlayerValidation.reasons.includes(
      engine.PRODUCTION_ROLL_REASON_CODES.INVALID_CATALOG_ID,
    )
    && unclassifiedProductionPlayerValidation.reasons.includes(
      engine.PRODUCTION_ROLL_REASON_CODES.UNCLASSIFIED_CATALOG_ID,
    ),
  'Production validation must reject ids outside the frozen production-v1 catalog manifest',
);
const productionConflictValidation = engine.validateProductionPlayer({
  ...productionGoldenResult.player,
  shield: 'kite',
  shieldTier: productionGoldenResult.powerTier,
  offhand: 'lantern',
}, productionGoldenResult);
check(
  productionConflictValidation.reasons.includes(engine.PRODUCTION_ROLL_REASON_CODES.HAND_CONFLICT),
  'Production validation must reject shield and utility off-hand conflicts',
);
const productionHiddenFaceValidation = engine.validateProductionPlayer({
  ...productionGoldenResult.player,
  hairStyle: 'long',
  expression: 'angry',
  faceDetail: 'beard',
  headgear: 'fullhelm',
}, productionGoldenResult);
check(
  [
    engine.PRODUCTION_ROLL_REASON_CODES.HIDDEN_EXPRESSION,
    engine.PRODUCTION_ROLL_REASON_CODES.HIDDEN_FACE_DETAIL,
    engine.PRODUCTION_ROLL_REASON_CODES.HIDDEN_HAIR,
  ].every((reason) => productionHiddenFaceValidation.reasons.includes(reason)),
  'Production validation must reject hidden face and hair metadata',
);
const productionHeadIdentityValidation = engine.validateProductionPlayer({
  ...productionGoldenResult.player,
  species: 'elf',
  hairStyle: 'short',
  expression: 'neutral',
  faceDetail: 'none',
  headgear: 'fullhelm',
}, productionGoldenResult);
check(
  productionHeadIdentityValidation.reasons.includes(engine.PRODUCTION_ROLL_REASON_CODES.HEAD_IDENTITY_COVERED),
  'Production validation must preserve head-based species identity',
);
check(
  engine.validateProductionPlayer({
    ...productionGoldenResult.player,
    weapon: 'bow',
  }, productionGoldenResult).reasons.includes(engine.PRODUCTION_ROLL_REASON_CODES.CLASS_WEAPON),
  'Production validation must reject equipment outside the selected class template',
);
check(
  engine.validateProductionPlayer({
    ...productionGoldenResult.player,
    outfitTier: 'tier1',
  }, productionGoldenResult).reasons.includes(engine.PRODUCTION_ROLL_REASON_CODES.OUTFIT_TIER),
  'Production validation must reject mixed power bands',
);
const productionEmptyWeaponTierValidation = engine.validateProductionPlayer({
  ...productionGoldenResult.player,
  weapon: 'none',
  weaponTier: 'tier2',
}, productionGoldenResult);
check(
  productionEmptyWeaponTierValidation.reasons.includes(engine.PRODUCTION_ROLL_REASON_CODES.WEAPON_TIER),
  'Production validation must require Tier 1 metadata for an empty weapon slot',
);
check(
  !engine.validateProductionPlayer({
    ...productionGoldenResult.player,
    weapon: 'none',
    weaponTier: 'tier1',
  }, productionGoldenResult).reasons.includes(engine.PRODUCTION_ROLL_REASON_CODES.WEAPON_TIER),
  'Production validation must accept normalized Tier 1 metadata for an empty weapon slot',
);
const productionDruidApexContext = {
  archetype: 'druid',
  powerTier: 'tier5',
  paletteFamily: 'infernal',
};
const productionDruidApexShieldValidation = engine.validateProductionPlayer({
  ...productionFallbackProbe.player,
  outfit: 'ranger',
  outfitColor: 'crimson',
  weapon: 'dagger',
  shield: 'bone',
  shieldTier: 'tier5',
}, productionDruidApexContext);
check(
  productionDruidApexShieldValidation.reasons.includes(engine.PRODUCTION_ROLL_REASON_CODES.EQUIPMENT_PAIR),
  'Production validation must reserve apex broad shields for martial or defensive archetypes',
);
check(
  engine.validateProductionPlayer({
    ...productionGoldenResult.player,
    skin: 'tan',
  }, productionGoldenResult).reasons.includes(engine.PRODUCTION_ROLL_REASON_CODES.PALETTE_FAMILY),
  'Production validation must reject colors outside the selected fixed palette family',
);
check(
  engine.validateProductionPlayer({
    ...productionGoldenResult.player,
    palette: { skin: ['#123456', '#234567'], hair: ['#345678', '#456789'], outfit: ['#56789a', '#6789ab'] },
  }, productionGoldenResult).reasons.includes(engine.PRODUCTION_ROLL_REASON_CODES.CUSTOM_PALETTE),
  'production-v1 must reject custom palette overrides',
);
check(
  engine.validateProductionPlayer({
    ...productionGoldenResult.player,
    species: 'celestial',
    hairStyle: 'long',
    headgear: 'wizard',
    weapon: 'greatsword',
    shield: 'tower',
    shieldTier: 'tier5',
  }, productionGoldenResult).reasons.includes(engine.PRODUCTION_ROLL_REASON_CODES.COMPLEXITY_LIMIT),
  'Production validation must reject specifications above the silhouette-complexity budget',
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
  ['ranger', 30],
  ['rogue', 29],
  ['mage', 25],
  ['cleric', 40],
  ['barbarian', 24],
  ['necromancer', 35],
  ['paladin', 39],
  ['druid', 35],
]);
for (const template of engine.CLASS_TEMPLATES) {
  check(engine.OUTFITS.some((outfit) => outfit.id === template.outfit), `${template.id} must reference a valid outfit`);
  check(template.weapons.includes(template.defaultWeapon), `${template.id} default weapon must belong to its weapon list`);
  check(template.defaultShield === 'none' || template.shields.includes(template.defaultShield), `${template.id} default shield must belong to its shield list`);
  check(template.defaultOffhand === 'none' || template.offhands.includes(template.defaultOffhand), `${template.id} default utility off-hand must belong to its off-hand list`);
  check(template.weapons.every((id) => engine.WEAPONS.some((weapon) => weapon.id === id && id !== 'none')), `${template.id} must reference only equipped weapon ids`);
  check(template.shields.every((id) => engine.SHIELDS.some((shield) => shield.id === id && id !== 'none')), `${template.id} must reference only equipped shield ids`);
  check(template.offhands.every((id) => engine.OFFHANDS.some((offhand) => offhand.id === id && id !== 'none')), `${template.id} must reference only equipped utility off-hand ids`);
  check(new Set(template.weapons).size === template.weapons.length, `${template.id} must not repeat weapon families`);
  check(new Set(template.shields).size === template.shields.length, `${template.id} must not repeat shield families`);
  check(new Set(template.offhands).size === template.offhands.length, `${template.id} must not repeat utility off-hands`);

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
      && applied.shieldTier === 'tier1'
      && applied.offhand === template.defaultOffhand,
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
      && (variant.spec.offhand === 'none' || template.offhands.includes(variant.spec.offhand))
      && !(variant.spec.shield !== 'none' && variant.spec.offhand !== 'none')
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
check(engine.VARIANT_BATCH_VERSION === 3, 'equipment batches must use schema v3 for utility off-hand variants');
check(engine.DEFAULT_VARIANT_BATCH_SET === 'rpg-equipment', 'the default equipment batch must be the deduplicated RPG collection');
check(
  JSON.stringify(engine.VARIANT_BATCH_SETS.map((set) => set.id))
    === JSON.stringify(['weapon-families', 'current-weapon-tiers', 'weapon-arsenal', 'armor-tiers', 'shield-armory', 'offhand-items', 'rpg-equipment']),
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
  offhand: 'none',
};
const expectedVariantBatchCounts = new Map([
  ['weapon-families', 16],
  ['current-weapon-tiers', 5],
  ['weapon-arsenal', 76],
  ['armor-tiers', 5],
  ['shield-armory', 41],
  ['offhand-items', 2],
  ['rpg-equipment', 121],
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
const utilityVariants = engine.buildVariantBatch(variantBatchPlayer, 'offhand-items').variants;
check(
  utilityVariants.some((variant) => variant.spec.offhand === 'lantern')
    && utilityVariants.every((variant) => variant.spec.shield === 'none' && variant.spec.shieldTier === 'tier1'),
  'utility off-hand batches must include the Lantern without retaining a shield',
);
const malformedOffhandVariants = engine.buildVariantBatch({
  ...variantBatchPlayer,
  shield: 'kite',
  shieldTier: 'tier3',
  offhand: 'lantern',
}, 'armor-tiers').variants;
check(
  malformedOffhandVariants.every((variant) => (
    variant.spec.shield === 'kite'
      && variant.spec.shieldTier === 'tier3'
      && variant.spec.offhand === 'none'
  )),
  'equipment planners must preserve a shield and discard the utility item in malformed dual-equipped input',
);

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
check(
  engine.resolveCombatLoadout(
    { kind: 'player', weapon: 'none', shield: 'none', offhand: 'lantern' },
    engine.DEFAULT_COMBAT_LOADOUT,
  ).slots.every((slot) => slot.effect === null),
  'a Lantern without a weapon or shield must not inherit shield-block combat effects',
);
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
  offhand: 'none',
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
  offhand: 'none',
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
for (const entry of completeKitPlan.components.offhands) {
  componentByPath.set(entry.file, { spec: entry.spec, layer: entry.layer });
}
const recipeLayerKeys = {
  'weapon-back': 'weaponBack',
  'shield-back': 'shieldBack',
  'offhand-back': 'offhandBack',
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
  'offhand-front': 'offhandFront',
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
const weaponLayerFor = (direction) => (direction === 'up' || direction === 'left') ? 'weapon-back' : 'weapon-front';
const oppositeWeaponLayerFor = (direction) => (direction === 'up' || direction === 'left') ? 'weapon-front' : 'weapon-back';
const minimumMotionPhases = { idle: 2, walk: 2, attack: 3, cast: 1, hurt: 2, death: 2 };
const tierFiveMaximumPixelRatio = 1.6;
const tierFiveMaximumBoundsRatio = 1.75;
let frameSafeWeaponCases = 0;

for (const weapon of readableWeaponFamilies) {
  const tierSignatures = [];
  for (const tier of engine.WEAPON_TIERS) {
    const spec = { ...straightBladeBase, weapon, weaponTier: tier.id };
    tierSignatures.push(renderPixels(spec, 'down', 'idle', 0, { layer: 'weapon-front' }).join(','));
    for (const direction of engine.DIRS) {
      for (const animation of engine.ANIMS) {
        const motionSignatures = [];
        for (let frame = 0; frame < animation.frames; frame++) {
          const discardedPixels = [];
          const pixels = renderPixels(spec, direction, animation.id, frame, {
            layer: weaponLayerFor(direction),
            onOutOfBounds: (pixel) => discardedPixels.push(pixel),
          });
          frameSafeWeaponCases++;
          check(
            discardedPixels.length === 0,
            `${weapon} ${tier.id} discarded ${discardedPixels.length} pixel(s) outside the 24x24 canvas in ${direction} ${animation.id} frame ${frame}`,
          );
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
            JSON.stringify(compositePixelLayers(weaponLayerFor(direction) === 'weapon-back' ? [pixels, unarmed] : [unarmed, pixels])) === JSON.stringify(complete),
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

let frameSafeHeadgearCases = 0;
for (const headgear of engine.HEADGEAR.filter((entry) => entry.id !== 'none')) {
  const spec = { ...straightBladeBase, headgear: headgear.id, weapon: 'none', weaponTier: 'tier1' };
  for (const direction of engine.DIRS) for (const animation of engine.ANIMS) {
    for (let frame = 0; frame < animation.frames; frame++) {
      const discardedPixels = [];
      renderPixels(spec, direction, animation.id, frame, {
        layer: 'headgear',
        onOutOfBounds: (pixel) => discardedPixels.push(pixel),
      });
      frameSafeHeadgearCases++;
      check(
        discardedPixels.length === 0,
        `${headgear.id} headgear discarded ${discardedPixels.length} pixel(s) outside the 24x24 canvas in ${direction} ${animation.id} frame ${frame}`,
      );
    }
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
    const handleX = tierIndex === 4 ? 16 : 17;
    check(Math.max(...xs) - handleX > handleX - Math.min(...xs), `axe ${tier.id} must keep its primary blade larger than its rear spike or counter-edge`);
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
    const wind = renderPixels(spec, 'right', 'attack', 1, { layer: weaponLayerFor('right') }).join(',');
    const release = renderPixels(spec, 'right', 'attack', 2, { layer: weaponLayerFor('right') }).join(',');
    check(wind !== release, `${weapon} ${tier.id} must visibly change between draw and release phases`);
  }
}

function weaponPixelBounds(pixels) {
  const points = pixels.flatMap((pixel, index) => pixel ? [[index % engine.SIZE, Math.floor(index / engine.SIZE)]] : []);
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
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
    'right', 'attack', 1, { layer: weaponLayerFor('right') },
  ));
  const sideWand = weaponPixelBounds(renderPixels(
    { ...straightBladeBase, weapon: 'wand', weaponTier: tier.id },
    'right', 'attack', 1, { layer: weaponLayerFor('right') },
  ));
  check(staff.height >= wand.height + 3, `staff ${tier.id} must remain substantially longer than the wand`);
  check(sideStaff.width >= sideWand.width + 3, `staff ${tier.id} side strike must keep a visibly longer countershaft than the wand`);
  check(spellbook.width >= wand.width, `spellbook ${tier.id} must preserve a broader page silhouette than the wand focus`);
  if (tier.id === 'tier4' || tier.id === 'tier5') check(spellbook.width >= 6, `spellbook ${tier.id} must preserve its relic-scale open page spread`);

  for (const weapon of ['staff', 'wand', 'spellbook']) {
    const spec = { ...straightBladeBase, weapon, weaponTier: tier.id };
    const attackSignatures = [0, 1, 2, 3].map((frame) => renderPixels(
      spec, 'right', 'attack', frame, { layer: weaponLayerFor('right') },
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
if (!FAST_MODE) {
try {
  globalThis.document = { createElement: (tag) => tag === 'canvas' ? new ValidationCanvas() : null };
  for (const weapon of readableWeaponFamilies) for (const tier of engine.WEAPON_TIERS) {
    const spec = { ...straightBladeBase, weapon, weaponTier: tier.id };
    const fullSheet = engine.buildSheet(spec);
    check(fullSheet.width === 480 && fullSheet.height === 96, `${weapon} ${tier.id} full export must be 480x96 at native scale`);
    // Animation sheets do not vary by direction (each holds all four rows), so
    // build them once per spec instead of once per direction: same coverage,
    // one quarter of the sheet-assembly work.
    const animationSheets = new Map(engine.ANIMS.map((animation) => {
      const animationSheet = engine.buildAnimationSheet(spec, animation.id);
      check(
        animationSheet.width === animation.frames * engine.SIZE && animationSheet.height === 96,
        `${weapon} ${tier.id} ${animation.id} export must retain its native frame dimensions`,
      );
      return [animation.id, animationSheet];
    }));
    for (const [directionRow, direction] of engine.DIRS.entries()) {
      const directionSheet = engine.buildDirectionSheet(spec, direction);
      check(directionSheet.width === 480 && directionSheet.height === 24, `${weapon} ${tier.id} ${direction} export must be 480x24 at native scale`);
      let column = 0;
      for (const animation of engine.ANIMS) {
        const animationSheet = animationSheets.get(animation.id);
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

  for (const familyId of engine.ENEMY_OUTLINE_PILOT_FAMILIES) {
    const family = engine.ENEMIES.find((entry) => entry.id === familyId);
    for (const variant of family.variants) {
      const spec = { kind: 'enemy', family: familyId, variant: variant.id };
      for (const outlineMode of [
        engine.OUTLINE_MODE_COMPLETE_B,
        engine.OUTLINE_MODE_SELECTIVE_C,
      ]) {
        const options = { outlineMode, shadow: false };
        const fullSheet = engine.buildSheet(spec, 1, options);
        check(
          fullSheet.width === 480 && fullSheet.height === 96,
          `${familyId} ${variant.id} ${outlineMode} full export must be 480x96 at native scale`,
        );
        const animationSheets = new Map(engine.ANIMS.map((animation) => {
          const animationSheet = engine.buildAnimationSheet(spec, animation.id, 1, options);
          check(
            animationSheet.width === animation.frames * engine.SIZE
              && animationSheet.height === 96,
            `${familyId} ${variant.id} ${outlineMode} ${animation.id} export must retain its native frame dimensions`,
          );
          return [animation.id, animationSheet];
        }));
        for (const [directionRow, direction] of engine.DIRS.entries()) {
          const directionSheet = engine.buildDirectionSheet(spec, direction, 1, options);
          check(
            directionSheet.width === 480 && directionSheet.height === 24,
            `${familyId} ${variant.id} ${outlineMode} ${direction} export must be 480x24 at native scale`,
          );
          let column = 0;
          for (const animation of engine.ANIMS) {
            const animationSheet = animationSheets.get(animation.id);
            for (let frame = 0; frame < animation.frames; frame++) {
              const expected = renderOutlinedPixels(
                spec,
                direction,
                animation.id,
                frame,
                outlineMode,
              );
              const prefix = `${familyId} ${variant.id} ${outlineMode}`;
              checkExportFrame(
                fullSheet,
                column,
                directionRow,
                expected,
                `${prefix} full export must preserve ${direction} ${animation.id} frame ${frame}`,
              );
              checkExportFrame(
                directionSheet,
                column,
                0,
                expected,
                `${prefix} direction export must preserve ${direction} ${animation.id} frame ${frame}`,
              );
              checkExportFrame(
                animationSheet,
                frame,
                directionRow,
                expected,
                `${prefix} animation export must preserve ${direction} ${animation.id} frame ${frame}`,
              );
              column++;
            }
          }
        }
      }
    }
  }

  for (const pilot of [SHADE_PILOTS[0], SHADE_PILOTS[6]]) {
    for (const outlineMode of [
      engine.OUTLINE_MODE_NONE,
      engine.OUTLINE_MODE_COMPLETE_B,
      engine.OUTLINE_MODE_SELECTIVE_C,
    ]) {
      const options = {
        shadeMode: engine.SHADE_MODE_FORM,
        outlineMode,
        shadow: false,
      };
      const fullSheet = engine.buildSheet(pilot.spec, 1, options);
      const animationSheets = new Map(engine.ANIMS.map((animation) => (
        [animation.id, engine.buildAnimationSheet(pilot.spec, animation.id, 1, options)]
      )));
      for (const [directionRow, direction] of engine.DIRS.entries()) {
        const directionSheet = engine.buildDirectionSheet(pilot.spec, direction, 1, options);
        let column = 0;
        for (const animation of engine.ANIMS) {
          const animationSheet = animationSheets.get(animation.id);
          for (let frame = 0; frame < animation.frames; frame++) {
            const expected = renderAssembledPixels(
              pilot.spec,
              direction,
              animation.id,
              frame,
              options,
            );
            const prefix = `${pilot.id} Form ${outlineMode} ${direction} ${animation.id}/${frame + 1}`;
            checkExportFrame(fullSheet, column, directionRow, expected, `${prefix} full export must match the assembled coordinator`);
            checkExportFrame(directionSheet, column, 0, expected, `${prefix} direction export must match the assembled coordinator`);
            checkExportFrame(animationSheet, frame, directionRow, expected, `${prefix} animation export must match the assembled coordinator`);
            column++;
          }
        }
      }
    }
  }
} finally {
  if (originalDocument === undefined) delete globalThis.document;
  else globalThis.document = originalDocument;
}
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
const protectedFaceChanges = (
  changed,
  unshielded,
  direction,
  animation = 'idle',
  frame = 0,
) => changed.filter((index) => {
  if (unshielded[index] !== internalCatalogs.INK || direction === 'up') return false;
  let x = index % engine.SIZE;
  let y = Math.floor(index / engine.SIZE);
  if (animation === 'death' && frame >= 2) {
    const renderedX = x;
    const renderedY = y;
    if (direction === 'up') {
      x = engine.SIZE - 1 - renderedY;
      y = renderedX;
    } else {
      x = renderedY;
      y = engine.SIZE - 1 - renderedX;
    }
  }
  if (y < 5 || y > 11) return false;
  if (direction === 'down') return x >= 9 && x <= 14;
  if (direction === 'right') return x >= 13 && x <= 17;
  return x >= 6 && x <= 10;
});
let frameSafeOffhandCases = 0;
const offhandBase = {
  ...shieldBase,
  shield: 'none',
  shieldTier: 'tier1',
  offhand: 'lantern',
};
for (const bodyBuild of engine.BODY_BUILDS) {
  const spec = { ...offhandBase, bodyBuild: bodyBuild.id };
  const bodySpec = { ...spec, offhand: 'none' };
  for (const direction of engine.DIRS) for (const animation of engine.ANIMS) {
    for (let frame = 0; frame < animation.frames; frame++) {
      const discardedPixels = [];
      const offhandBackPixels = renderPixels(spec, direction, animation.id, frame, {
        layer: 'offhand-back',
        onOutOfBounds: (pixel) => discardedPixels.push(pixel),
      });
      const offhandFrontPixels = renderPixels(spec, direction, animation.id, frame, {
        layer: 'offhand-front',
        onOutOfBounds: (pixel) => discardedPixels.push(pixel),
      });
      const offhandPixels = compositePixelLayers([offhandBackPixels, offhandFrontPixels]);
      const bodyPixels = renderPixels(bodySpec, direction, animation.id, frame, { layer: 'body' });
      const complete = renderPixels(spec, direction, animation.id, frame);
      const composite = compositePixelLayers([offhandBackPixels, bodyPixels, offhandFrontPixels]);
      const visibleChanges = changedPixels(complete, bodyPixels);
      frameSafeOffhandCases++;
      check(
        discardedPixels.length === 0,
        `${bodyBuild.id} Lantern discarded ${discardedPixels.length} pixel(s) outside the 24x24 canvas in ${direction} ${animation.id} frame ${frame}`,
      );
      check(
        minimumPixelDistance(offhandPixels, bodyPixels) <= 1,
        `${bodyBuild.id} Lantern must stay attached to the body in ${direction} ${animation.id} frame ${frame}`,
      );
      check(
        visibleChanges.length >= 10,
        `${bodyBuild.id} Lantern must retain at least ten visible pixels after body occlusion in ${direction} ${animation.id} frame ${frame}`,
      );
      check(
        protectedFaceChanges(
          visibleChanges,
          bodyPixels,
          direction,
          animation.id,
          frame,
        ).length === 0,
        `${bodyBuild.id} Lantern must preserve face clearance in ${direction} ${animation.id} frame ${frame}`,
      );
      check(
        offhandFrontPixels.some(Boolean),
        `${bodyBuild.id} Lantern must export its hand-owning front grip in ${direction} ${animation.id} frame ${frame}`,
      );
      if (direction === 'right' || direction === 'up') {
        check(offhandBackPixels.some(Boolean), `${bodyBuild.id} Lantern must export its far face behind the body in ${direction} ${animation.id} frame ${frame}`);
      } else {
        check(offhandBackPixels.every((pixel) => pixel === null), `${bodyBuild.id} Lantern must keep its near face out of the back layer in ${direction} ${animation.id} frame ${frame}`);
      }
      check(
        JSON.stringify(composite) === JSON.stringify(complete),
        `${bodyBuild.id} Lantern and body layers must rebuild the complete ${direction} ${animation.id} frame ${frame}`,
      );
    }
  }
}
let frameSafeShieldCases = 0;

function shieldTestPose(animation, frame) {
  const pose = { bob: 0, arm: 0, wep: 'hold' };
  if (animation === 'idle') pose.bob = frame === 1 ? 1 : 0;
  if (animation === 'walk') {
    pose.bob = frame === 1 || frame === 3 ? 1 : 0;
    pose.arm = frame === 0 ? 1 : frame === 2 ? -1 : 0;
  }
  if (animation === 'attack') pose.wep = ['wind', 'strike', 'strike', 'recover'][frame];
  if (animation === 'cast') {
    const cast = castModule.playerCastPose(frame);
    pose.bob = cast.bodyBob;
    pose.cast = cast.phase;
    pose.castOffhandHand = cast.offhandHandOffset;
  }
  return pose;
}

for (const bodyBuild of engine.BODY_BUILDS) for (const shield of equippedShields) for (const tier of engine.SHIELD_TIERS) {
  const spec = { ...shieldBase, bodyBuild: bodyBuild.id, shield, shieldTier: tier.id };
  const bodySpec = { ...spec, shield: 'none', shieldTier: 'tier1' };
  for (const direction of engine.DIRS) for (const animation of engine.ANIMS) {
    for (let frame = 0; frame < animation.frames; frame++) {
      const discardedPixels = [];
      const shieldBackPixels = renderPixels(spec, direction, animation.id, frame, {
        layer: 'shield-back',
        onOutOfBounds: (pixel) => discardedPixels.push(pixel),
      });
      const shieldFrontPixels = renderPixels(spec, direction, animation.id, frame, {
        layer: 'shield-front',
        onOutOfBounds: (pixel) => discardedPixels.push(pixel),
      });
      const shieldPixels = compositePixelLayers([shieldBackPixels, shieldFrontPixels]);
      const bodyPixels = renderPixels(bodySpec, direction, animation.id, frame, { layer: 'body' });
      const complete = renderPixels(spec, direction, animation.id, frame);
      const composite = compositePixelLayers([shieldBackPixels, bodyPixels, shieldFrontPixels]);
      frameSafeShieldCases++;
      check(
        discardedPixels.length === 0,
        `${bodyBuild.id} ${shield} ${tier.id} discarded ${discardedPixels.length} shield pixel(s) outside the 24x24 canvas in ${direction} ${animation.id} frame ${frame}`,
      );
      check(
        minimumPixelDistance(shieldPixels, bodyPixels) <= 1,
        `${bodyBuild.id} ${shield} ${tier.id} shield must stay attached to the body in ${direction} ${animation.id} frame ${frame}`,
      );
      check(
        changedPixels(complete, bodyPixels).length >= 1,
        `${bodyBuild.id} ${shield} ${tier.id} shield must retain a visible pixel after body occlusion in ${direction} ${animation.id} frame ${frame}`,
      );
      check(shieldFrontPixels.some(Boolean), `${bodyBuild.id} ${shield} ${tier.id} must export its hand-owning front grip in ${direction} ${animation.id} frame ${frame}`);
      if (direction === 'right' || direction === 'up') {
        check(shieldBackPixels.some(Boolean), `${bodyBuild.id} ${shield} ${tier.id} must export its far face behind the body in ${direction} ${animation.id} frame ${frame}`);
      } else {
        check(shieldBackPixels.every((pixel) => pixel === null), `${bodyBuild.id} ${shield} ${tier.id} must keep its near face out of the back layer in ${direction} ${animation.id} frame ${frame}`);
      }
      check(
        JSON.stringify(composite) === JSON.stringify(complete),
        `${bodyBuild.id} ${shield} ${tier.id} shield and body layers must rebuild the complete ${direction} ${animation.id} frame ${frame}`,
      );
        if (
          animation.id !== 'death'
          && (direction === 'down' || direction === 'left' || direction === 'right' || direction === 'up')
        ) {
        const pose = shieldTestPose(animation.id, frame);
        const sideOffset = pose.wep === 'wind' ? -1 : pose.arm;
        const armOffset = pose.cast
          ? pose.castOffhandHand
          : (direction === 'down' || direction === 'up' ? -pose.arm : sideOffset);
        const handY = 15 + pose.bob + armOffset;
        const handXs = direction === 'down' ? [6, 7]
          : direction === 'up' ? [16, 17]
            : direction === 'left' ? [10, 11]
              : [12, 13];
        const handIndices = handXs.flatMap((x) => [handY * engine.SIZE + x, (handY + 1) * engine.SIZE + x]);
        check(
          handIndices.every((index) => shieldFrontPixels[index] !== null),
          `${bodyBuild.id} ${shield} ${tier.id} front grip must fully own the hand socket in ${direction} ${animation.id} frame ${frame}`,
        );
      }
    }
  }
}

for (const shield of equippedShields) {
  const spec = { ...shieldBase, shield };
  const emptySpec = { ...shieldBase, shield: 'none' };
  for (const dir of engine.DIRS) {
    for (const anim of engine.ANIMS) {
      for (let frame = 0; frame < anim.frames; frame++) {
        const rendered = renderPixels(spec, dir, anim.id, frame);
        const empty = renderPixels(emptySpec, dir, anim.id, frame);
        const changed = changedPixels(rendered, empty);
        check(changed.length >= 1, `${shield} shield must remain visible in ${dir} ${anim.id} frame ${frame}`);
        check(
          protectedFaceChanges(changed, empty, dir, anim.id, frame).length === 0,
          `${shield} shield must not cover the face in ${dir} ${anim.id} frame ${frame}`,
        );
      }
    }

    const walkStart = changeSignature(renderPixels(spec, dir, 'walk', 0), renderPixels(emptySpec, dir, 'walk', 0));
    const walkReturn = changeSignature(renderPixels(spec, dir, 'walk', 2), renderPixels(emptySpec, dir, 'walk', 2));
    check(walkStart !== walkReturn, `${shield} shield must follow the off-hand walk swing in ${dir}`);

    const attackWind = changeSignature(renderPixels(spec, dir, 'attack', 0), renderPixels(emptySpec, dir, 'attack', 0));
    const attackRecover = changeSignature(renderPixels(spec, dir, 'attack', 3), renderPixels(emptySpec, dir, 'attack', 3));
    check(
      dir === 'left' || dir === 'right' ? attackWind !== attackRecover : attackWind === attackRecover,
      `${shield} shield must follow only its hand socket during attacks in ${dir}`,
    );
  }

  const combinedShieldPixels = (direction) => compositePixelLayers([
    renderPixels(spec, direction, 'idle', 0, { layer: 'shield-back' }),
    renderPixels(spec, direction, 'idle', 0, { layer: 'shield-front' }),
  ]);
  const rightPixels = combinedShieldPixels('right');
  const leftPixels = combinedShieldPixels('left');
  const downPixels = combinedShieldPixels('down');
  const right = weaponPixelBounds(rightPixels);
  const left = weaponPixelBounds(leftPixels);
  const down = weaponPixelBounds(downPixels);
  check(
    right.width >= down.width && right.height === down.height
      && left.width >= down.width && left.height === down.height,
    `${shield} shield side views must retain the full broad-face dimensions without perspective compression`,
  );
  check(rightPixels[(15 * engine.SIZE) + 13] !== null, `${shield} right-facing grip must occupy the hand socket`);
  check(leftPixels[(15 * engine.SIZE) + 10] !== null, `${shield} left-facing grip must occupy the mirrored hand socket`);
  check(right.maxX <= 23 && left.minX >= 0, `${shield} shield side views must remain inside the safe hand-attached frame band`);
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
        const unshielded = renderPixels({ ...tier1Spec, shield: 'none' }, dir, anim.id, frame);
        const changed = changedPixels(tier2, tier1);
        check(changed.length >= 1, `${shield} Tier 2 must differ from Tier 1 in ${dir} ${anim.id} frame ${frame}`);
        check(
          protectedFaceChanges(changed, unshielded, dir, anim.id, frame).length === 0,
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
        const unshielded = renderPixels({ ...tier2Spec, shield: 'none' }, dir, anim.id, frame);
        const changed = changedPixels(tier3, tier2);
        check(changed.length >= 1, `${shield} Tier 3 must differ from Tier 2 in ${dir} ${anim.id} frame ${frame}`);
        check(
          protectedFaceChanges(changed, unshielded, dir, anim.id, frame).length === 0,
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
    check(
      dir === 'left' || dir === 'right' ? attackWind !== attackRecover : attackWind === attackRecover,
      `${shield} Tier 3 additions must follow only the shield-hand socket during attacks in ${dir}`,
    );
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
        const unshielded = renderPixels({ ...tier3Spec, shield: 'none' }, dir, anim.id, frame);
        const changed = changedPixels(tier4, tier3);
        const faceChanges = protectedFaceChanges(changed, unshielded, dir, anim.id, frame);
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
    check(
      dir === 'left' || dir === 'right' ? attackWind !== attackRecover : attackWind === attackRecover,
      `${shield} Tier 4 additions must follow only the shield-hand socket during attacks in ${dir}`,
    );
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
        const unshielded = renderPixels({ ...tier4Spec, shield: 'none' }, dir, anim.id, frame);
        const changed = changedPixels(tier5, tier4);
        const faceChanges = protectedFaceChanges(changed, unshielded, dir, anim.id, frame);
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
    check(
      dir === 'left' || dir === 'right' ? attackWind !== attackRecover : attackWind === attackRecover,
      `${shield} Tier 5 artifact form must follow only the shield-hand socket during attacks in ${dir}`,
    );
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
check(
  packageJson.scripts?.['review:shades'] === 'node tools/shade-review.mjs',
  'package.json must expose the focused shade review generator',
);
check(
  packageJson.scripts?.['review:offhands'] === 'node tools/offhand-review.mjs',
  'package.json must expose the focused off-hand review generator',
);
check(
  packageJson.scripts?.['review:production-rolls'] === 'node tools/production-roll-review.mjs',
  'package.json must expose the approved Production-versus-Wildcard review generator',
);
check(
  runtimeSources['app.js'].includes('PRESET_VERSION = 12')
    && runtimeSources['app.js'].includes('PACK_VERSION = 3')
    && engine.VARIANT_BATCH_VERSION === 3
    && engine.CLASS_PACK_VERSION === 3
    && characterKit.MASTER_CHARACTER_KIT_VERSION === 2
    && characterKit.COMPLETE_CHARACTER_KIT_VERSION === 12
    && characterKit.COMPLETE_CHARACTER_PACK_VERSION === 12,
  'Production Roll integration must not change any existing persistence, pack, batch, class, or kit schema version',
);
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
check(JSON.stringify(engine.DIRS) === JSON.stringify(manifest.format.rows), 'Engine directions do not match manifest row order');

const manifestAnims = manifest.format.animations.map(({ id, frames, frameMs }) => ({ id, frames, ms: frameMs }));
check(
  manifest.format.grid.columns === 12
    && JSON.stringify(manifestAnims) === JSON.stringify([
      { id: 'idle', frames: 2, ms: 420 },
      { id: 'walk', frames: 4, ms: 150 },
      { id: 'attack', frames: 4, ms: 115 },
      { id: 'hurt', frames: 2, ms: 140 },
    ]),
  'the committed 4x asset pack must remain an explicit legacy 12-column fixture',
);

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

console.log(`Project validation passed${FAST_MODE ? ' (fast tier: boss gates and export-parity audit skipped — run the full `npm run check` before release)' : SKIP_BOSS_GATES ? ' (boss gates skipped — run `npm run check:bosses` separately)' : ''}.`);
console.log(`- Entry point: ${entryFile}`);
console.log(`- Player combinations: ${combinations.toLocaleString('en-US')}`);
console.log(`- Enemy families: ${manifest.enemies.length}`);
console.log(`- Enemy variants: ${enemyRefs.length}`);
console.log(`- Public enemy families: ${publicEnemyFamilyCount}`);
console.log(`- Public enemy variants: ${publicEnemyVariantCount}`);
console.log(`- Combat effects: ${effectRefs.length}`);
console.log(`- Player samples: ${playerRefs.length}`);
console.log(`- Production Roll policy cases: ${productionRollCases}`);
console.log(`- Production Roll bounded fallbacks: ${productionFallbackCases}`);
console.log(`- Production Roll integration render cases: ${productionIntegrationRenderCases}`);
console.log(`- Compatible Production reroll cases: ${compatibleRerollCases}`);
console.log(`- Compatible reroll no-alternative cases: ${compatibleRerollNoAlternativeCases}`);
console.log(`- Shade Core/None player parity cases: ${shadeNonePlayerParityCases}`);
console.log(`- Shade Core/None enemy parity cases: ${shadeNoneEnemyParityCases}`);
console.log(`- Enemy Cast-to-Attack alias cases: ${enemyCastAliasCases}`);
console.log(`- Enemy Death-to-Hurt alias cases: ${enemyDeathAliasCases}`);
console.log(`- Shade Core/None enemy outline parity cases: ${shadeNoneEnemyOutlineParityCases}`);
console.log(`- Form pilot cases: ${shadePilotCases}`);
console.log(`- Form pilot changed pixels: ${shadePilotChangedPixels}`);
console.log(`- Form pilot protected pixels: ${shadePilotProtectedPixels}`);
console.log(`- Form pilot determinism cases: ${shadePilotDeterminismCases}`);
console.log(`- Form/material-control pixel differences: ${shadePilotMaterialControlDifferences}`);
console.log(`- Full enemy Form audit cases: ${formEnemyAuditCases}`);
console.log(`- Enemy Form/outline integration cases: ${formEnemyCombinedOutlineCases}`);
console.log(`- Frame-safe weapon cases: ${frameSafeWeaponCases}`);
console.log(`- Frame-safe shield cases: ${frameSafeShieldCases}`);
console.log(`- Frame-safe utility off-hand cases: ${frameSafeOffhandCases}`);
console.log(`- Frame-safe headgear cases: ${frameSafeHeadgearCases}`);
console.log(`- Frame-safe repaired enemy cases: ${frameSafeEnemyCases}`);
console.log(`- Frame-safe enemy staff strikes: ${frameSafeEnemyStaffCases}`);
console.log(`- Validated PNG sheets: ${actualPngs.length} (${expectedWidth}x${expectedHeight})`);
