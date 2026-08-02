import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { buildCompleteCharacterKitPlan, completeCharacterKitCounts } from '../character-kit.js';
import { capturePixels } from '../engine/pixel-buffer.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import { captureEnemyExpansionFrame } from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

function samePixels(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function canvasFrame(canvas, column, row) {
  const pixels = [];
  const offsetX = column * engine.SIZE;
  const offsetY = row * engine.SIZE;
  for (let y = 0; y < engine.SIZE; y++) for (let x = 0; x < engine.SIZE; x++) {
    pixels.push(canvas.pixels[((offsetY + y) * canvas.width) + offsetX + x]);
  }
  return pixels;
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
  toDataURL() { return 'data:image/png;base64,consumer-check'; }
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

const expectedExpansionFamilies = ['alchemist', 'fallen-knight', 'necromancer', 'pirate', 'witch'];
const legacyVariants = engine.ENEMIES.reduce((total, family) => total + family.variants.length, 0);
const publicVariants = engine.PUBLIC_ENEMIES.reduce((total, family) => total + family.variants.length, 0);

check(engine.ENEMIES.length === 57 && legacyVariants === 202, 'consumer integration must not rewrite the 57-family / 202-variant legacy catalog');
check(engine.PUBLIC_ENEMIES.length === 62 && publicVariants === 217, 'the public consumer catalog must expose 62 families / 217 variants');
check(Object.isFrozen(engine.PUBLIC_ENEMIES), 'the public consumer catalog must be immutable');
check(
  engine.PUBLIC_ENEMIES.slice(0, engine.ENEMIES.length).every((family, index) => family === engine.ENEMIES[index]),
  'the public consumer catalog must retain the legacy catalog unchanged and in order',
);
check(
  JSON.stringify(engine.PUBLIC_ENEMIES.slice(-5).map((family) => family.id)) === JSON.stringify(expectedExpansionFamilies),
  'the public consumer catalog must append exactly the five approved EN-E01 families',
);
check(
  engine.PUBLIC_ENEMIES.slice(-5).every((family, index) => family === engine.ENEMY_EXPANSION_REGISTRY.publicFamilies[index]),
  'the public consumer catalog must use the stable registry public-family view',
);

const appSource = await readFile(path.join(root, 'app.js'), 'utf8');
check(!appSource.includes('E.ENEMIES'), 'editor enemy sanitization and selectors must not remain on the legacy-only catalog');
check((appSource.match(/E\.PUBLIC_ENEMIES/g) || []).length === 7, 'editor persistence and both selector levels must consume PUBLIC_ENEMIES');

const originalRandom = Math.random;
try {
  Math.random = () => 0.999999;
  check(
    JSON.stringify(engine.randomEnemy()) === JSON.stringify({ family: 'witch', variant: 'cauldron-brewer' }),
    'the randomizer must be able to select the appended approved expansion catalog',
  );
} finally {
  Math.random = originalRandom;
}

const kitCounts = completeCharacterKitCounts();
const kitPlan = buildCompleteCharacterKitPlan();
check(
  kitCounts.enemyFamilies === 62 && kitCounts.enemySheets === 217 && kitCounts.totalPngs === 2154,
  'Complete Character Kit counts must include all 15 approved EN-E01 sheets',
);
check(
  kitPlan.enemies.length === 62
    && kitPlan.enemies.flatMap((family) => family.variants).length === 217
    && expectedExpansionFamilies.every((familyId) => kitPlan.enemies.some((family) => family.family === familyId)),
  'Complete Character Kit planning must include every approved EN-E01 family and variant',
);

const packManifest = engine.buildWildshotGamePackManifest({
  generated: '2026-08-02',
  toolCommit: 'b368f80',
  actors: [{
    id: 'approved-witch',
    category: 'enemy',
    sheet: 'enemies/approved-witch.png',
    spec: { kind: 'enemy', family: 'witch', variant: 'hexer' },
  }],
});
check(packManifest.actors[0]?.spec.family === 'witch', 'Wildshot pack validation must accept approved expansion enemy specs');
check(
  engine.defaultCombatLoadout({ kind: 'enemy', family: 'fallen-knight', variant: 'shieldbearer' }).trail === 'sword-slash',
  'expansion combat defaults must resolve nested approved actor equipment metadata',
);

const legacySpec = { kind: 'enemy', family: 'slime', variant: 'lime' };
const legacyPublicPixels = capturePixels((context) => engine.drawSprite(context, legacySpec, 'down', 'idle', 0, { shadow: false }));
const legacyDirectPixels = capturePixels((context) => drawLegacySprite(context, legacySpec, 'down', 'idle', 0, { shadow: false }));
check(samePixels(legacyPublicPixels, legacyDirectPixels), 'the public dispatcher must delegate legacy sprites without pixel changes');

let frameCount = 0;
let sheetCount = 0;
const originalDocument = globalThis.document;
try {
  globalThis.document = { createElement: (tag) => tag === 'canvas' ? new ValidationCanvas() : null };
  for (const family of engine.ENEMY_EXPANSION_REGISTRY.publicFamilies) {
    for (const variant of family.variants) {
      const spec = { kind: 'enemy', family: family.id, variant: variant.id };
      check(engine.isPublicEnemyExpansionSpec(spec), `${family.id}/${variant.id} must route through the public expansion dispatcher`);
      const fullSheet = engine.buildSheet(spec, 1, {
        shadow: false,
        shadeMode: engine.SHADE_MODE_FORM,
        outlineMode: engine.OUTLINE_MODE_SELECTIVE_C,
      });
      check(fullSheet.width === 480 && fullSheet.height === 96, `${family.id}/${variant.id} public export must be 480x96`);
      for (const [row, direction] of engine.DIRS.entries()) {
        let column = 0;
        for (const animation of engine.ANIMS) for (let frame = 0; frame < animation.frames; frame++) {
          const reviewed = captureEnemyExpansionFrame(
            engine.ENEMY_EXPANSION_REGISTRY,
            spec,
            direction,
            animation.id,
            frame,
            engine.SIZE,
          );
          const outOfBoundsWrites = [];
          const dispatched = capturePixels((context) => engine.drawSprite(
            context,
            spec,
            direction,
            animation.id,
            frame,
            { shadow: false, onOutOfBounds: (write) => outOfBoundsWrites.push(write) },
          ));
          const assembled = capturePixels((context) => engine.drawAssembledSprite(
            context,
            spec,
            direction,
            animation.id,
            frame,
            {
              shadow: false,
              shadeMode: engine.SHADE_MODE_FORM,
              outlineMode: engine.OUTLINE_MODE_SELECTIVE_C,
            },
          ));
          const prefix = `${family.id}/${variant.id}/${direction}/${animation.id}/${frame}`;
          check(samePixels(dispatched, reviewed.pixels), `${prefix} public dispatcher pixels differ from the approved registry`);
          check(samePixels(assembled, reviewed.pixels), `${prefix} assembled editor pixels differ from the approved registry`);
          check(samePixels(canvasFrame(fullSheet, column, row), reviewed.pixels), `${prefix} full-sheet export pixels differ from the approved registry`);
          check(outOfBoundsWrites.length === 0, `${prefix} public dispatcher attempted out-of-bounds drawing`);
          frameCount++;
          column++;
        }
      }
      sheetCount++;
    }
  }

  const representative = { kind: 'enemy', family: 'witch', variant: 'hexer' };
  for (const direction of engine.DIRS) {
    const sheet = engine.buildDirectionSheet(representative, direction, 1, { shadow: false });
    check(sheet.width === 480 && sheet.height === 24, `approved expansion ${direction} export must be 480x24`);
  }
  for (const animation of engine.ANIMS) {
    const sheet = engine.buildAnimationSheet(representative, animation.id, 1, { shadow: false });
    check(
      sheet.width === animation.frames * engine.SIZE && sheet.height === 96,
      `approved expansion ${animation.id} export must retain native frame dimensions`,
    );
  }
  check(engine.thumbURL(representative).startsWith('data:image/png'), 'approved expansion thumbnails must render through the public dispatcher');
} finally {
  if (originalDocument === undefined) delete globalThis.document;
  else globalThis.document = originalDocument;
}

check(frameCount === 1200, 'consumer integration must verify all 1,200 approved EN-E01 frames');
check(sheetCount === 15, 'consumer integration must verify all 15 approved EN-E01 full sheets');

if (errors.length) {
  console.error('EN-E01 consumer integration validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E01 consumer integration validation passed.');
console.log('- Legacy catalog: 57 families / 202 variants (unchanged)');
console.log('- Public consumer catalog: 62 families / 217 variants');
console.log('- Approved adapter parity: 1,200 / 1,200 frames');
console.log('- Native expansion sheets: 15 / 15 at 480x96');
console.log('- Editor, randomizer, Complete Kit, Wildshot pack, thumbnails, and export scopes: enabled');
