import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import * as engine from '../sprite-engine.js';
import { outlineMaskForPixels, OUTLINE_COLOR } from '../engine/outline-renderer.js';
import { buildStoredZip } from '../zip.js';
import { encodeRgbaPng } from './enemy-expansion-review-pixels.mjs';
import {
  applyCompleteBToRgbaFrame,
  blitRgba,
  decodeRgbaPng,
  hardAlphaStats,
  PixelCanvas,
  pixelsToRgba,
} from './complete-b-actor-pack-pixels.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EXPORTER_PATH = fileURLToPath(import.meta.url);
const PACKAGE_ID = '8-bit-sprite-assembler-complete-b-actor-pack-v1';
const DEFAULT_OUTPUT_DIRECTORY = path.join(ROOT, 'dist', PACKAGE_ID);
const FIXED_ZIP_TIMESTAMP = new Date('2000-01-01T00:00:00Z');
const PLAYER_COUNT = 16;
const NPCS_PER_ROLE = 6;
const EXPECTED_ENEMY_COUNT = 259;
const EXPECTED_BOSS_COUNT = 10;
const execFileAsync = promisify(execFile);

const HERO_NAMES = Object.freeze([
  'Aster Vale', 'Brann Ironward', 'Cyra Moonstep', 'Dorian Ashfall',
  'Eira Dawnshield', 'Fenric Wildsong', 'Galen Stormhand', 'Hesta Runeveil',
  'Ilyra Starbow', 'Joren Blackthorn', 'Kael Embercrest', 'Liora Brightwater',
  'Marek Gravewind', 'Nyssa Goldleaf', 'Orin Frostmantle', 'Pella Quicksteel',
]);

const HERO_ARCHETYPES = Object.freeze([
  'warrior', 'guardian', 'ranger', 'rogue', 'mage',
  'cleric', 'barbarian', 'necromancer', 'paladin', 'druid',
]);

const NPC_ROLES = Object.freeze([
  { id: 'village-guard', name: 'Village Guard', outfit: ['plate', 'tunic'], outfitTier: ['tier1', 'tier2'], headgear: ['helm', 'cap'], weapon: ['spear', 'sword'], weaponTier: ['tier1', 'tier2'], shield: ['round', 'heater'], shieldTier: ['tier1', 'tier2'], expression: ['determined', 'neutral'] },
  { id: 'town-watch', name: 'Town Watch', outfit: ['leather', 'plate'], outfitTier: ['tier1', 'tier2'], headgear: ['cap', 'helm'], weapon: ['sword', 'club'], weaponTier: ['tier1'], shield: ['buckler', 'round'], shieldTier: ['tier1'], expression: ['neutral', 'determined'] },
  { id: 'merchant', name: 'Merchant', outfit: ['tunic', 'cape'], outfitTier: ['tier1'], headgear: ['cap', 'none'], weapon: ['none'], shield: ['none'], offhand: ['lantern', 'none'], expression: ['happy', 'neutral'] },
  { id: 'blacksmith', name: 'Blacksmith', outfit: ['leather', 'tunic'], outfitTier: ['tier1', 'tier2'], headgear: ['none', 'bandana'], weapon: ['warhammer', 'none'], weaponTier: ['tier1'], shield: ['none'], expression: ['determined', 'neutral'] },
  { id: 'innkeeper', name: 'Innkeeper', outfit: ['tunic'], outfitTier: ['tier1'], headgear: ['none', 'cap'], weapon: ['none'], shield: ['none'], expression: ['happy', 'neutral'] },
  { id: 'farmer', name: 'Farmer', outfit: ['tunic', 'leather'], outfitTier: ['tier1'], headgear: ['cap', 'none'], weapon: ['spear', 'none'], weaponTier: ['tier1'], shield: ['none'], expression: ['neutral', 'happy'] },
  { id: 'healer', name: 'Healer', outfit: ['cleric', 'robe'], outfitTier: ['tier1', 'tier2'], headgear: ['hood', 'circlet'], weapon: ['staff', 'none'], weaponTier: ['tier1'], shield: ['none'], expression: ['happy', 'neutral'] },
  { id: 'scholar', name: 'Scholar', outfit: ['robe', 'tunic'], outfitTier: ['tier1'], headgear: ['none', 'cap'], weapon: ['spellbook', 'none'], weaponTier: ['tier1'], shield: ['none'], faceDetail: ['glasses', 'none'], expression: ['neutral', 'surprised'] },
  { id: 'hunter', name: 'Hunter', outfit: ['ranger', 'leather'], outfitTier: ['tier1', 'tier2'], headgear: ['hood', 'bandana'], weapon: ['bow', 'crossbow'], weaponTier: ['tier1', 'tier2'], shield: ['none'], expression: ['determined', 'neutral'] },
  { id: 'sailor', name: 'Sailor', outfit: ['tunic', 'leather'], outfitTier: ['tier1'], headgear: ['bandana', 'none'], weapon: ['scimitar', 'club'], weaponTier: ['tier1'], shield: ['none'], expression: ['happy', 'determined'] },
  { id: 'noble', name: 'Noble', outfit: ['cape', 'tunic'], outfitTier: ['tier2', 'tier3'], headgear: ['crown', 'circlet'], weapon: ['rapier', 'none'], weaponTier: ['tier1', 'tier2'], shield: ['none'], expression: ['neutral', 'determined'] },
  { id: 'miner', name: 'Miner', outfit: ['leather', 'tunic'], outfitTier: ['tier1'], headgear: ['helm', 'cap'], weapon: ['warhammer', 'club'], weaponTier: ['tier1'], shield: ['none'], offhand: ['lantern'], expression: ['determined', 'neutral'] },
  { id: 'scout', name: 'Scout', outfit: ['ranger', 'leather'], outfitTier: ['tier1'], headgear: ['hood', 'bandana'], weapon: ['dagger', 'bow'], weaponTier: ['tier1'], shield: ['none'], expression: ['determined', 'neutral'] },
  { id: 'priest', name: 'Priest', outfit: ['cleric', 'robe'], outfitTier: ['tier1', 'tier2'], headgear: ['circlet', 'hood'], weapon: ['staff', 'none'], weaponTier: ['tier1'], shield: ['none'], expression: ['neutral', 'happy'] },
  { id: 'artisan', name: 'Artisan', outfit: ['tunic', 'leather'], outfitTier: ['tier1'], headgear: ['none', 'cap'], weapon: ['none'], shield: ['none'], faceDetail: ['glasses', 'mustache', 'none'], expression: ['happy', 'neutral'] },
  { id: 'elder', name: 'Elder', outfit: ['robe', 'tunic'], outfitTier: ['tier1'], headgear: ['none', 'hood'], weapon: ['staff', 'none'], weaponTier: ['tier1'], shield: ['none'], hairColor: ['white'], expression: ['neutral', 'sad'] },
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sha256(data) {
  return createHash('sha256').update(data).digest('hex');
}

function lowerKebab(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function parseArguments(argv) {
  const result = { outputDirectory: DEFAULT_OUTPUT_DIRECTORY, zipPath: null, generatedOn: new Date().toISOString().slice(0, 10) };
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

async function gitOutput(args, trim = true) {
  const { stdout } = await execFileAsync('git', args, { cwd: ROOT, encoding: 'utf8', windowsHide: true });
  return trim ? stdout.trim() : stdout;
}

async function sourceState() {
  const [commit, branch, status] = await Promise.all([
    gitOutput(['rev-parse', 'HEAD']),
    gitOutput(['branch', '--show-current']),
    gitOutput(['status', '--porcelain=v1', '--untracked-files=all'], false),
  ]);
  const statusLines = status.split(/\r?\n/).filter(Boolean);
  return { commit, branch, dirty: statusLines.length > 0, statusLines, statusSha256: sha256(status) };
}

function choose(values, index, fallback) {
  if (!values?.length) return fallback;
  return values[index % values.length];
}

function normalizeEquipment(player) {
  const normalized = { ...player };
  if (normalized.weapon === 'none') normalized.weaponTier = 'tier1';
  if (normalized.offhand !== 'none') normalized.shield = 'none';
  if (normalized.shield === 'none') normalized.shieldTier = 'tier1';
  else normalized.offhand = 'none';
  return normalized;
}

function playerKey(player) {
  const { kind, ...fields } = player;
  return JSON.stringify(fields);
}

function productionForArchetype(archetype) {
  for (let attempt = 0; attempt < 20000; attempt++) {
    const result = engine.rollProductionPlayer(`${PACKAGE_ID}-hero-${archetype}-${attempt}`);
    if (result.archetype === archetype) return result;
  }
  throw new Error(`Could not deterministically resolve a ${archetype} hero.`);
}

function buildPlayerRoster() {
  const results = HERO_ARCHETYPES.map(productionForArchetype);
  for (let index = results.length; index < PLAYER_COUNT; index++) {
    results.push(engine.rollProductionPlayer(`${PACKAGE_ID}-hero-extra-${index}`));
  }
  const used = new Set();
  return results.map((result, index) => {
    let player = { kind: 'player', ...result.player };
    let attempt = 0;
    while (used.has(playerKey(player))) {
      const replacement = engine.rollProductionPlayer(`${PACKAGE_ID}-hero-unique-${index}-${attempt++}`);
      player = { kind: 'player', ...replacement.player };
      result = replacement;
    }
    used.add(playerKey(player));
    return {
      id: `hero-${String(index + 1).padStart(2, '0')}-${lowerKebab(HERO_NAMES[index])}`,
      name: HERO_NAMES[index],
      archetype: result.archetype,
      seed: result.seed,
      spec: player,
    };
  });
}

function applyNpcRole(basePlayer, role, variantIndex) {
  const player = {
    ...basePlayer,
    kind: 'player',
    outfit: choose(role.outfit, variantIndex, basePlayer.outfit),
    outfitTier: choose(role.outfitTier, variantIndex, 'tier1'),
    headgear: choose(role.headgear, variantIndex, basePlayer.headgear),
    weapon: choose(role.weapon, variantIndex, basePlayer.weapon),
    weaponTier: choose(role.weaponTier, variantIndex, 'tier1'),
    shield: choose(role.shield, variantIndex, 'none'),
    shieldTier: choose(role.shieldTier, variantIndex, 'tier1'),
    offhand: choose(role.offhand, variantIndex, 'none'),
    expression: choose(role.expression, variantIndex, basePlayer.expression),
    faceDetail: choose(role.faceDetail, variantIndex, basePlayer.faceDetail),
    hairColor: choose(role.hairColor, variantIndex, basePlayer.hairColor),
  };
  return normalizeEquipment(player);
}

function buildNpcRoster() {
  const records = [];
  const used = new Set();
  for (const role of NPC_ROLES) {
    for (let variantIndex = 0; variantIndex < NPCS_PER_ROLE; variantIndex++) {
      let attempt = 0;
      let roll;
      let spec;
      do {
        roll = engine.rollProductionPlayer(`${PACKAGE_ID}-npc-${role.id}-${variantIndex}-${attempt++}`);
        spec = applyNpcRole(roll.player, role, variantIndex + attempt - 1);
      } while (used.has(playerKey(spec)) && attempt < 1000);
      assert(!used.has(playerKey(spec)), `Could not build a unique ${role.name} NPC variant.`);
      used.add(playerKey(spec));
      records.push({
        id: `${role.id}-${String(variantIndex + 1).padStart(2, '0')}`,
        name: `${role.name} ${String(variantIndex + 1).padStart(2, '0')}`,
        role: role.id,
        source: 'player-assembler',
        seed: roll.seed,
        spec,
      });
    }
  }
  return records;
}

function validateSheetCells(pixels, width, cellSize, columns, rows, label) {
  assert(width === columns * cellSize, `${label} has the wrong width.`);
  for (let row = 0; row < rows; row++) for (let column = 0; column < columns; column++) {
    let opaque = 0;
    for (let y = 0; y < cellSize; y++) for (let x = 0; x < cellSize; x++) {
      if (pixels[(((row * cellSize) + y) * width) + (column * cellSize) + x] !== null) opaque++;
    }
    assert(opaque > 0, `${label} has an empty cell at row ${row}, column ${column}.`);
  }
}

function renderActorSheet(spec, assetPath) {
  const raw = engine.buildSheet(spec, 1, { shadow: false, shadeMode: engine.SHADE_MODE_FORM, outlineMode: engine.OUTLINE_MODE_NONE });
  const outlined = engine.buildSheet(spec, 1, { shadow: false, shadeMode: engine.SHADE_MODE_FORM, outlineMode: engine.OUTLINE_MODE_COMPLETE_B });
  assert(raw.width === 480 && raw.height === 96 && outlined.width === 480 && outlined.height === 96, `${assetPath} has the wrong actor-sheet dimensions.`);
  validateSheetCells(outlined.pixels, outlined.width, 24, 20, 4, assetPath);
  const rawRgba = pixelsToRgba(raw.pixels);
  const outlinedRgba = pixelsToRgba(outlined.pixels);
  const outlineAddedPixels = outlinedRgba.opaquePixels - rawRgba.opaquePixels;
  assert(outlineAddedPixels > 0, `${assetPath} did not receive Complete B outline pixels.`);
  return {
    data: encodeRgbaPng(outlined.width, outlined.height, outlinedRgba.rgba),
    width: outlined.width,
    height: outlined.height,
    opaquePixels: outlinedRgba.opaquePixels,
    outlineAddedPixels,
  };
}

function runtimePath(assetPath) {
  const relative = String(assetPath).replace(/^\.\//, '');
  return path.join(ROOT, ...relative.split('/'));
}

async function renderBossSheet(pilot, assetPath) {
  const width = engine.BOSS_ANIMATION_SHEET_WIDTH;
  const height = engine.BOSS_ANIMATION_SHEET_HEIGHT;
  const rgba = Buffer.alloc(width * height * 4);
  let column = 0;
  let outlineAddedPixels = 0;
  for (const animation of engine.BOSS_ANIMATIONS) {
    for (let frameIndex = 0; frameIndex < animation.frames; frameIndex++) {
      for (let row = 0; row < engine.BOSS_ANIMATION_DIRECTIONS.length; row++) {
        const direction = engine.BOSS_ANIMATION_DIRECTIONS[row];
        const framePath = pilot.frames[animation.id][direction][frameIndex];
        const frame = decodeRgbaPng(await readFile(runtimePath(framePath)), framePath);
        assert(frame.width === 48 && frame.height === 48, `${framePath} must be 48x48.`);
        const outlined = applyCompleteBToRgbaFrame(frame.rgba, 48, 48);
        assert(outlined.addedPixels > 0, `${framePath} did not receive Complete B outline pixels.`);
        outlineAddedPixels += outlined.addedPixels;
        blitRgba(outlined.rgba, 48, 48, rgba, width, column * 48, row * 48);
      }
      column++;
    }
  }
  assert(column === 20, `${pilot.id} did not produce 20 animation columns.`);
  hardAlphaStats(rgba);
  return {
    data: encodeRgbaPng(width, height, rgba),
    width,
    height,
    opaquePixels: hardAlphaStats(rgba).opaquePixels,
    outlineAddedPixels,
    reviewStatus: pilot.reviewStatus,
  };
}

function recordFor(category, pathName, rendered, metadata) {
  return {
    category,
    path: pathName,
    width: rendered.width,
    height: rendered.height,
    bytes: rendered.data.length,
    opaquePixels: rendered.opaquePixels,
    outlineAddedPixels: rendered.outlineAddedPixels,
    sha256: sha256(rendered.data),
    ...metadata,
  };
}

async function writeDirectory(outputDirectory, entries) {
  await mkdir(outputDirectory, { recursive: true });
  const directories = new Set(entries.map((entry) => path.dirname(path.join(outputDirectory, ...entry.name.split('/')))));
  await Promise.all([...directories].map((directory) => mkdir(directory, { recursive: true })));
  for (let index = 0; index < entries.length; index += 32) {
    await Promise.all(entries.slice(index, index + 32).map((entry) => writeFile(path.join(outputDirectory, ...entry.name.split('/')), entry.data)));
  }
}

function readmeFor({ counts, generatedOn, source }) {
  return [
    '# Complete B Actor Pack',
    '',
    `Generated on ${generatedOn} from branch \`${source.branch}\` at base commit \`${source.commit}\`.`,
    '',
    '## Contents',
    '',
    `- ${counts.players} varied playable characters in \`players/\`;`,
    `- ${counts.npcs} NPCs derived from the Player assembler across ${NPC_ROLES.length} roles in \`npcs/\`;`,
    `- all ${counts.enemies} public enemy variations in \`enemies/\`;`,
    `- all ${counts.bosses} bosses with complete animation suites in \`bosses/\`;`,
    `- ${counts.pngs} full animation-sheet PNGs total.`,
    '',
    '## Treatment',
    '',
    '- Players, NPCs, and enemies: Form shading + Complete B outline.',
    '- Bosses: approved source colors + a per-frame Complete B exterior contour.',
    '- Native 1x, transparent background, hard alpha, no floor shadow, no baked combat effects.',
    '',
    'Standard actors use 24x24 cells and 480x96 full sheets. Bosses use 48x48 cells and 960x192 full sheets. Both contracts contain Down/Left/Right/Up rows and Idle 2, Walk 4, Attack 4, Cast 4, Hurt 2, Death 4 columns.',
    '',
    'The manifest records every source specification, NPC role, boss review status, dimensions, outline additions, byte size, and SHA-256 hash. Candidate-status bosses are included because the package request explicitly includes every boss that has all animations; their status remains visible in the manifest.',
    '',
    'This is a local export artifact, not a licensed public release.',
    '',
  ].join('\n');
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  assert(path.resolve(options.outputDirectory) !== ROOT, 'The output directory cannot be the repository root.');
  await Promise.all([
    assertAbsent(options.outputDirectory, 'Output directory'),
    assertAbsent(options.zipPath, 'ZIP archive'),
    assertAbsent(options.hashPath, 'ZIP hash sidecar'),
  ]);

  const [source, exporterSource] = await Promise.all([sourceState(), readFile(EXPORTER_PATH)]);
  const players = buildPlayerRoster();
  const npcs = buildNpcRoster();
  const enemyCount = engine.PUBLIC_ENEMIES.reduce((total, family) => total + family.variants.length, 0);
  assert(players.length === PLAYER_COUNT && new Set(players.map(({ spec }) => playerKey(spec))).size === PLAYER_COUNT, 'Player roster must contain 16 distinct specifications.');
  assert(npcs.length === NPC_ROLES.length * NPCS_PER_ROLE && new Set(npcs.map(({ spec }) => playerKey(spec))).size === npcs.length, 'NPC roster must contain 96 distinct specifications.');
  assert(enemyCount === EXPECTED_ENEMY_COUNT, `Expected ${EXPECTED_ENEMY_COUNT} enemies, found ${enemyCount}.`);
  assert(engine.BOSS_ANIMATION_PILOTS.length === EXPECTED_BOSS_COUNT, `Expected ${EXPECTED_BOSS_COUNT} complete-animation bosses, found ${engine.BOSS_ANIMATION_PILOTS.length}.`);
  assert(outlineMaskForPixels(new Array(48 * 48).fill(null), engine.OUTLINE_MODE_COMPLETE_B, 48, 48).length === 48 * 48, 'Complete B must support the 48x48 boss frame contract.');

  const originalDocument = globalThis.document;
  globalThis.document = { createElement(tag) { assert(tag === 'canvas', `Unsupported headless element: ${tag}`); return new PixelCanvas(); } };
  const assets = [];
  const records = [];
  try {
    for (const player of players) {
      const assetPath = `players/${player.id}.png`;
      const rendered = renderActorSheet(player.spec, assetPath);
      assets.push({ name: assetPath, data: rendered.data });
      records.push(recordFor('player', assetPath, rendered, player));
    }
    for (const npc of npcs) {
      const assetPath = `npcs/${npc.role}/${npc.id}.png`;
      const rendered = renderActorSheet(npc.spec, assetPath);
      assets.push({ name: assetPath, data: rendered.data });
      records.push(recordFor('npc', assetPath, rendered, npc));
    }
    for (const family of engine.PUBLIC_ENEMIES) for (const variant of family.variants) {
      const spec = { kind: 'enemy', family: family.id, variant: variant.id };
      const assetPath = `enemies/${family.id}/${variant.id}.png`;
      const rendered = renderActorSheet(spec, assetPath);
      assets.push({ name: assetPath, data: rendered.data });
      records.push(recordFor('enemy', assetPath, rendered, { family: family.id, familyName: family.name, variant: variant.id, variantName: variant.name, spec }));
    }
  } finally {
    if (originalDocument === undefined) delete globalThis.document;
    else globalThis.document = originalDocument;
  }

  for (const pilot of engine.BOSS_ANIMATION_PILOTS) {
    const assetPath = `bosses/${pilot.id}.png`;
    const rendered = await renderBossSheet(pilot, assetPath);
    assets.push({ name: assetPath, data: rendered.data });
    records.push(recordFor('boss', assetPath, rendered, { id: pilot.id, name: pilot.name, reviewStatus: pilot.reviewStatus, profileId: pilot.profileId }));
  }

  assets.sort((left, right) => left.name.localeCompare(right.name));
  records.sort((left, right) => left.path.localeCompare(right.path));
  const counts = {
    players: players.length,
    npcs: npcs.length,
    npcRoles: NPC_ROLES.length,
    enemies: enemyCount,
    enemyFamilies: engine.PUBLIC_ENEMIES.length,
    bosses: engine.BOSS_ANIMATION_PILOTS.length,
    pngs: assets.length,
  };
  assert(counts.pngs === counts.players + counts.npcs + counts.enemies + counts.bosses, 'Actor package count arithmetic drifted.');
  assert(counts.pngs === 381, `Expected 381 full sheets, found ${counts.pngs}.`);
  assert(new Set(assets.map(({ name }) => name)).size === assets.length, 'Actor package paths must be unique.');
  assert(records.every(({ outlineAddedPixels }) => outlineAddedPixels > 0), 'Every exported sheet must receive Complete B outline pixels.');

  const readme = readmeFor({ counts, generatedOn: options.generatedOn, source });
  const readmeData = new TextEncoder().encode(readme);
  const manifest = {
    id: PACKAGE_ID,
    name: '8-bit Sprite Assembler Complete B Actor Pack',
    version: 1,
    status: 'local-export',
    generatedOn: options.generatedOn,
    source: { ...source, exporterSha256: sha256(exporterSource) },
    treatment: {
      outline: { id: engine.OUTLINE_MODE_COMPLETE_B, name: 'Complete B', color: OUTLINE_COLOR },
      standardActorShade: { id: engine.SHADE_MODE_FORM, name: 'Form' },
      bossShade: 'approved-source-colors',
      nativeScale: 1,
      transparentBackground: true,
      hardAlpha: true,
      shadow: false,
      effects: false,
    },
    contracts: {
      standardActor: { cell: 24, columns: 20, rows: 4, sheetWidth: 480, sheetHeight: 96, directions: engine.DIRS, animations: engine.ANIMS },
      boss: { cell: 48, columns: 20, rows: 4, sheetWidth: 960, sheetHeight: 192, directions: engine.BOSS_ANIMATION_DIRECTIONS, animations: engine.BOSS_ANIMATIONS },
    },
    counts,
    npcRoles: NPC_ROLES.map(({ id, name }) => ({ id, name, variants: NPCS_PER_ROLE })),
    assets: records,
    supportFiles: { 'README.md': { bytes: readmeData.length, sha256: sha256(readmeData) } },
    license: null,
    releaseReady: false,
  };
  const manifestData = new TextEncoder().encode(`${JSON.stringify(manifest, null, 2)}\n`);
  const entries = [{ name: 'manifest.json', data: manifestData }, { name: 'README.md', data: readmeData }, ...assets];
  const archive = buildStoredZip(entries, FIXED_ZIP_TIMESTAMP);
  const archiveSha256 = sha256(archive);

  await writeDirectory(options.outputDirectory, entries);
  await mkdir(path.dirname(options.zipPath), { recursive: true });
  await writeFile(options.zipPath, archive);
  await writeFile(options.hashPath, `${archiveSha256}  ${path.basename(options.zipPath)}\n`, 'utf8');

  console.log('Complete B actor package created.');
  console.log(`- players: ${counts.players}`);
  console.log(`- NPCs: ${counts.npcs} across ${counts.npcRoles} roles`);
  console.log(`- enemies: ${counts.enemies} across ${counts.enemyFamilies} families`);
  console.log(`- complete-animation bosses: ${counts.bosses}`);
  console.log(`- full-sheet PNGs: ${counts.pngs}`);
  console.log(`- directory: ${options.outputDirectory}`);
  console.log(`- ZIP: ${options.zipPath}`);
  console.log(`- ZIP bytes: ${archive.length}`);
  console.log(`- ZIP SHA-256: ${archiveSha256}`);
}

await main();
