import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as engine from '../sprite-engine.js';
import { OUTLINE_COLOR } from '../engine/outline-renderer.js';
import { countColor, decodeRgbaPng, hardAlphaStats } from './complete-b-actor-pack-pixels.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PACKAGE_ID = '8-bit-sprite-assembler-complete-b-actor-pack-v1';
const DEFAULT_DIRECTORY = path.join(ROOT, 'dist', PACKAGE_ID);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sha256(data) {
  return createHash('sha256').update(data).digest('hex');
}

function parseArguments(argv) {
  const index = argv.indexOf('--input-dir');
  if (index === -1) return DEFAULT_DIRECTORY;
  assert(argv[index + 1], '--input-dir requires a directory path.');
  return path.resolve(argv[index + 1]);
}

async function walk(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...await walk(path.join(directory, entry.name), relative));
    else files.push(relative);
  }
  return files;
}

function validateCells(image, cell, columns, rows, label) {
  assert(image.width === cell * columns && image.height === cell * rows, `${label} dimensions drifted.`);
  for (let row = 0; row < rows; row++) for (let column = 0; column < columns; column++) {
    let opaque = 0;
    for (let y = 0; y < cell; y++) for (let x = 0; x < cell; x++) {
      const offset = ((((row * cell) + y) * image.width) + (column * cell) + x) * 4;
      if (image.rgba[offset + 3] === 255) opaque++;
    }
    assert(opaque > 0, `${label} has an empty cell at row ${row}, column ${column}.`);
  }
}

async function main() {
  const directory = parseArguments(process.argv.slice(2));
  const manifest = JSON.parse(await readFile(path.join(directory, 'manifest.json'), 'utf8'));
  assert(manifest.id === PACKAGE_ID && manifest.version === 1, 'Actor package identity drifted.');
  assert(manifest.treatment.outline.id === engine.OUTLINE_MODE_COMPLETE_B, 'Actor package must use Complete B.');
  assert(manifest.treatment.standardActorShade.id === engine.SHADE_MODE_FORM, 'Standard actors must use Form shading.');
  assert(manifest.treatment.nativeScale === 1 && manifest.treatment.hardAlpha && !manifest.treatment.shadow && !manifest.treatment.effects, 'Package treatment flags drifted.');
  assert(manifest.counts.players === 16, 'Expected 16 player characters.');
  assert(manifest.counts.npcs === 96 && manifest.counts.npcRoles === 16, 'Expected 96 NPCs across 16 roles.');
  assert(manifest.counts.enemies === 259 && manifest.counts.enemyFamilies === 80, 'Expected all 259 enemies across 80 families.');
  assert(manifest.counts.bosses === engine.BOSS_ANIMATION_PILOTS.length && manifest.counts.bosses === 10, 'Expected all 10 complete-animation bosses.');
  assert(manifest.counts.pngs === 381 && manifest.assets.length === 381, 'Expected exactly 381 full-sheet PNGs.');

  const categories = manifest.assets.reduce((groups, asset) => {
    (groups[asset.category] ||= []).push(asset);
    return groups;
  }, {});
  assert(categories.player.length === 16 && categories.npc.length === 96 && categories.enemy.length === 259 && categories.boss.length === 10, 'Manifest category counts drifted.');
  assert(new Set(categories.player.map(({ spec }) => JSON.stringify(spec))).size === 16, 'Player specifications must be distinct.');
  assert(new Set(categories.npc.map(({ spec }) => JSON.stringify(spec))).size === 96, 'NPC specifications must be distinct.');
  assert(categories.npc.every(({ source }) => source === 'player-assembler'), 'Every NPC must be derived from the Player assembler.');
  const publicEnemyIds = new Set(engine.PUBLIC_ENEMIES.flatMap((family) => family.variants.map((variant) => `${family.id}/${variant.id}`)));
  assert(new Set(categories.enemy.map(({ family, variant }) => `${family}/${variant}`)).size === 259, 'Enemy asset ids must be unique.');
  assert(categories.enemy.every(({ family, variant }) => publicEnemyIds.has(`${family}/${variant}`)), 'Package contains a non-public enemy.');
  const bossById = new Map(engine.BOSS_ANIMATION_PILOTS.map((pilot) => [pilot.id, pilot]));
  assert(categories.boss.every(({ id, reviewStatus }) => bossById.get(id)?.reviewStatus === reviewStatus), 'Boss ids or review statuses drifted.');

  let pngsChecked = 0;
  let totalOutlineAdditions = 0;
  for (const record of manifest.assets) {
    const data = await readFile(path.join(directory, ...record.path.split('/')));
    assert(data.length === record.bytes && sha256(data) === record.sha256, `${record.path} bytes or hash drifted.`);
    const image = decodeRgbaPng(data, record.path);
    const stats = hardAlphaStats(image.rgba);
    assert(stats.opaquePixels === record.opaquePixels, `${record.path} opaque-pixel count drifted.`);
    assert(record.outlineAddedPixels > 0 && countColor(image.rgba, OUTLINE_COLOR) > 0, `${record.path} lacks Complete B evidence.`);
    if (record.category === 'boss') validateCells(image, 48, 20, 4, record.path);
    else validateCells(image, 24, 20, 4, record.path);
    totalOutlineAdditions += record.outlineAddedPixels;
    pngsChecked++;
  }

  const actualFiles = (await walk(directory)).sort();
  const expectedFiles = ['README.md', 'manifest.json', ...manifest.assets.map(({ path: assetPath }) => assetPath)].sort();
  assert(JSON.stringify(actualFiles) === JSON.stringify(expectedFiles), 'Output directory contains missing or unexpected files.');
  const readmeData = await readFile(path.join(directory, 'README.md'));
  assert(readmeData.length === manifest.supportFiles['README.md'].bytes && sha256(readmeData) === manifest.supportFiles['README.md'].sha256, 'README hash drifted.');
  const zipPath = `${directory}.zip`;
  const zipData = await readFile(zipPath);
  const sidecar = (await readFile(`${zipPath}.sha256`, 'utf8')).trim();
  assert(sidecar === `${sha256(zipData)}  ${path.basename(zipPath)}`, 'ZIP SHA-256 sidecar drifted.');

  console.log('Complete B actor package validation passed.');
  console.log(`- full-sheet PNGs: ${pngsChecked}`);
  console.log(`- players: ${categories.player.length}`);
  console.log(`- NPCs: ${categories.npc.length} across ${manifest.counts.npcRoles} roles`);
  console.log(`- enemies: ${categories.enemy.length} across ${manifest.counts.enemyFamilies} families`);
  console.log(`- complete-animation bosses: ${categories.boss.length}`);
  console.log(`- Complete B outline additions: ${totalOutlineAdditions}`);
  console.log(`- ZIP bytes: ${zipData.length}`);
  console.log(`- ZIP SHA-256: ${sha256(zipData)}`);
}

await main();
