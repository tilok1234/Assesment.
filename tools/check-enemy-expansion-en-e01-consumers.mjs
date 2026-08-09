import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import {
  ENEMY_EXPANSION_PRE_REPAIR_REGISTRY,
  ENEMY_EXPANSION_REPAIR_CANDIDATE_GATE,
  ENEMY_EXPANSION_REPAIR_CANDIDATE_REGISTRY,
} from '../engine/enemy-expansion-repairs.js';
import { buildCompleteCharacterKitPlan, completeCharacterKitCounts } from '../character-kit.js';
import { capturePixels } from '../engine/pixel-buffer.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import { outlineMaskForPixels } from '../engine/outline-renderer.js';
import { buildShadeMaterialLookup, protectedShadeMask, shadePixels } from '../engine/shade-renderer.js';
import { EN_E02_CONSUMER_INTEGRATION_GATE } from '../engine/enemy-expansion-en-e02.js';
import { captureEnemyExpansionFrame } from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

function samePixels(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function outlineReport(source, outlined) {
  let addedPixels = 0;
  let sourcePreserved = true;
  let outlineColorOnly = true;
  for (let index = 0; index < source.length; index++) {
    if (source[index] !== null) {
      if (outlined[index] !== source[index]) sourcePreserved = false;
    } else if (outlined[index] !== null) {
      addedPixels++;
      if (outlined[index] !== engine.OUTLINE_COLOR) outlineColorOnly = false;
    }
  }
  return { addedPixels, sourcePreserved, outlineColorOnly };
}

const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/;

function shadeReport(source, before, shaded, protectedMask) {
  let changedPixels = 0;
  let validColors = true;
  let sourceOwnedChanges = true;
  let protectedPixelsPreserved = true;
  let outlinePixelsPreserved = true;
  let inkSafe = true;
  for (let index = 0; index < source.length; index++) {
    const sourceColor = source[index];
    const beforeColor = before[index];
    const shadedColor = shaded[index];
    if (shadedColor !== null && !HEX_COLOR_PATTERN.test(shadedColor)) validColors = false;
    if (beforeColor !== sourceColor && shadedColor !== beforeColor) outlinePixelsPreserved = false;
    if (shadedColor === beforeColor) continue;
    changedPixels++;
    if (sourceColor === null) sourceOwnedChanges = false;
    if (protectedMask[index]) protectedPixelsPreserved = false;
    if (sourceColor !== engine.OUTLINE_COLOR && shadedColor === engine.OUTLINE_COLOR) inkSafe = false;
  }
  return {
    changedPixels,
    validColors,
    sourceOwnedChanges,
    protectedPixelsPreserved,
    outlinePixelsPreserved,
    inkSafe,
  };
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

const expectedExpansionFamilies = [
  'alchemist',
  'birdfolk',
  'catfolk',
  'desert-raider',
  'fallen-knight',
  'fanatic-monk',
  'goatfolk',
  'lich',
  'merfolk',
  'mummy',
  'naga',
  'necromancer',
  'pirate',
  'plague-doctor',
  'revenant',
  'vampire',
  'witch',
];
const legacyVariants = engine.ENEMIES.reduce((total, family) => total + family.variants.length, 0);
const publicVariants = engine.PUBLIC_ENEMIES.reduce((total, family) => total + family.variants.length, 0);

check(EN_E02_CONSUMER_INTEGRATION_GATE.status === 'authorized', 'EN-E02 consumer integration needs explicit authorization');
check(EN_E02_CONSUMER_INTEGRATION_GATE.authorizedOn === '2026-08-02', 'EN-E02 consumer authorization must record its date');
check(Object.isFrozen(EN_E02_CONSUMER_INTEGRATION_GATE) && Object.isFrozen(EN_E02_CONSUMER_INTEGRATION_GATE.exclusions), 'EN-E02 consumer authorization must be deeply immutable');
check(engine.ENEMIES.length === 57 && legacyVariants === 202, 'consumer integration must not rewrite the 57-family / 202-variant legacy catalog');
check(engine.PUBLIC_ENEMIES.length === 74 && publicVariants === 245, 'the later EN-E05 consumer gate must expose 74 families / 245 variants');
check(Object.isFrozen(engine.PUBLIC_ENEMIES), 'the public consumer catalog must be immutable');
check(
  engine.PUBLIC_ENEMIES.slice(0, engine.ENEMIES.length).every((family, index) => family === engine.ENEMIES[index]),
  'the public consumer catalog must retain the legacy catalog unchanged and in order',
);
check(
  JSON.stringify(engine.PUBLIC_ENEMIES.slice(-17).map((family) => family.id)) === JSON.stringify(expectedExpansionFamilies),
  'the public consumer catalog must append exactly the seventeen approved EN-E01/EN-E02/EN-E04/EN-E05 families',
);
check(
  engine.PUBLIC_ENEMIES.slice(-17).every((family, index) => family === engine.ENEMY_EXPANSION_CONSUMER_REGISTRY.publicFamilies[index]),
  'the public consumer catalog must use the stable registry public-family view',
);
check(ENEMY_EXPANSION_REPAIR_CANDIDATE_GATE.status === 'approved', 'the consumer repair boundary must record explicit visual approval');
check(engine.ENEMY_EXPANSION_REGISTRY !== ENEMY_EXPANSION_REPAIR_CANDIDATE_REGISTRY, 'the stable registry must compose EN-E04 without rewriting the approved repair candidate');
check(engine.ENEMY_EXPANSION_CONSUMER_REGISTRY === engine.ENEMY_EXPANSION_REGISTRY, 'the later EN-E05 consumer gate must reuse the exact stable registry');
check(engine.ENEMY_EXPANSION_REGISTRY !== ENEMY_EXPANSION_PRE_REPAIR_REGISTRY, 'pre-repair comparison evidence must remain isolated from generic consumers');

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
  Math.random = () => 59.1 / 74;
  check(
    JSON.stringify(engine.randomEnemy()) === JSON.stringify({ family: 'catfolk', variant: 'pride-champion' }),
    'the randomizer must be able to select an approved EN-E02 family and variant',
  );
} finally {
  Math.random = originalRandom;
}

const kitCounts = completeCharacterKitCounts();
const kitPlan = buildCompleteCharacterKitPlan();
check(
  kitCounts.enemyFamilies === 74 && kitCounts.enemySheets === 245 && kitCounts.totalPngs === 2182,
  'Complete Character Kit counts must include all 43 approved EN-E01/EN-E02/EN-E04/EN-E05 sheets',
);
check(
  kitPlan.enemies.length === 74
    && kitPlan.enemies.flatMap((family) => family.variants).length === 245
    && expectedExpansionFamilies.every((familyId) => kitPlan.enemies.some((family) => family.family === familyId)),
  'Complete Character Kit planning must include every approved EN-E01/EN-E02/EN-E04/EN-E05 family and variant',
);

const packManifest = engine.buildWildshotGamePackManifest({
  generated: '2026-08-02',
  toolCommit: 'b368f80',
  actors: [{
    id: 'approved-catfolk',
    category: 'enemy',
    sheet: 'enemies/approved-catfolk.png',
    spec: { kind: 'enemy', family: 'catfolk', variant: 'pride-champion' },
  }],
});
check(packManifest.actors[0]?.spec.family === 'catfolk', 'Wildshot pack validation must accept approved EN-E02 enemy specs');
check(
  engine.defaultCombatLoadout({ kind: 'enemy', family: 'goatfolk', variant: 'ramguard-chieftain' }).trail === 'axe-cleave',
  'expansion combat defaults must resolve nested approved EN-E02 actor equipment metadata',
);

const legacySpec = { kind: 'enemy', family: 'slime', variant: 'lime' };
const legacyPublicPixels = capturePixels((context) => engine.drawSprite(context, legacySpec, 'down', 'idle', 0, { shadow: false }));
const legacyDirectPixels = capturePixels((context) => drawLegacySprite(context, legacySpec, 'down', 'idle', 0, { shadow: false }));
check(samePixels(legacyPublicPixels, legacyDirectPixels), 'the public dispatcher must delegate legacy sprites without pixel changes');

let frameCount = 0;
let sheetCount = 0;
let outlineModeCases = 0;
let completeOutlinePixels = 0;
let selectiveOutlinePixels = 0;
let shadeModeCases = 0;
let shadeChangedPixels = 0;
let protectedShadePixels = 0;
let expansionPaletteColors = 0;
let stableCompleteOutlinePixels = 0;
let stableSelectiveOutlinePixels = 0;
let stableShadeChangedPixels = 0;
let stableProtectedShadePixels = 0;
const originalDocument = globalThis.document;
try {
  globalThis.document = { createElement: (tag) => tag === 'canvas' ? new ValidationCanvas() : null };
  for (const family of ENEMY_EXPANSION_REPAIR_CANDIDATE_REGISTRY.publicFamilies) {
    for (const variant of family.variants) {
      const spec = { kind: 'enemy', family: family.id, variant: variant.id };
      check(engine.isPublicEnemyExpansionSpec(spec), `${family.id}/${variant.id} must route through the public expansion dispatcher`);
      check(engine.enemySupportsOutline(spec), `${family.id}/${variant.id} must expose the approved enemy outline modes`);
      const materialLookup = buildShadeMaterialLookup(spec);
      const rendererRamps = Object.entries(variant.actor?.palette || {})
        .filter(([, colors]) => Array.isArray(colors) && colors.length >= 2);
      check(rendererRamps.length > 0, `${family.id}/${variant.id} must publish renderer palette ramps for Form shading`);
      for (const [rampName, colors] of rendererRamps) for (const color of colors) {
        check(
          materialLookup.has(color.toLowerCase()),
          `${family.id}/${variant.id} Form material lookup is missing ${rampName} color ${color}`,
        );
        expansionPaletteColors++;
      }
      let variantShadeChangedPixels = 0;
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
            engine.ENEMY_EXPANSION_CONSUMER_REGISTRY,
            spec,
            direction,
            animation.id,
            frame,
            engine.SIZE,
          );
          const stableReviewed = captureEnemyExpansionFrame(
            ENEMY_EXPANSION_PRE_REPAIR_REGISTRY,
            spec,
            direction,
            animation.id,
            frame,
            engine.SIZE,
          );
          const stableCompleteMask = outlineMaskForPixels(stableReviewed.pixels, engine.OUTLINE_MODE_COMPLETE_B);
          const stableSelectiveMask = outlineMaskForPixels(stableReviewed.pixels, engine.OUTLINE_MODE_SELECTIVE_C);
          const stableProtectedMask = protectedShadeMask(stableReviewed.pixels);
          const stableForm = shadePixels(stableReviewed.pixels, materialLookup, { protectedMask: stableProtectedMask });
          stableCompleteOutlinePixels += stableCompleteMask.reduce((total, value) => total + Number(Boolean(value)), 0);
          stableSelectiveOutlinePixels += stableSelectiveMask.reduce((total, value) => total + Number(Boolean(value)), 0);
          stableShadeChangedPixels += stableForm.reduce((total, color, index) => total + Number(color !== stableReviewed.pixels[index]), 0);
          stableProtectedShadePixels += stableProtectedMask.reduce((total, value, index) => (
            total + Number(Boolean(value) && stableReviewed.pixels[index] !== null)
          ), 0);
          const outOfBoundsWrites = [];
          const dispatched = capturePixels((context) => engine.drawSprite(
            context,
            spec,
            direction,
            animation.id,
            frame,
            { shadow: false, onOutOfBounds: (write) => outOfBoundsWrites.push(write) },
          ));
          const assembledNone = capturePixels((context) => engine.drawAssembledSprite(
            context,
            spec,
            direction,
            animation.id,
            frame,
            {
              shadow: false,
              shadeMode: engine.SHADE_MODE_NONE,
              outlineMode: engine.OUTLINE_MODE_NONE,
            },
          ));
          const outlinedComplete = capturePixels((context) => engine.drawAssembledSprite(
            context,
            spec,
            direction,
            animation.id,
            frame,
            {
              shadow: false,
              shadeMode: engine.SHADE_MODE_NONE,
              outlineMode: engine.OUTLINE_MODE_COMPLETE_B,
            },
          ));
          const outlinedSelective = capturePixels((context) => engine.drawAssembledSprite(
            context,
            spec,
            direction,
            animation.id,
            frame,
            {
              shadow: false,
              shadeMode: engine.SHADE_MODE_NONE,
              outlineMode: engine.OUTLINE_MODE_SELECTIVE_C,
            },
          ));
          const formNone = capturePixels((context) => engine.drawAssembledSprite(
            context,
            spec,
            direction,
            animation.id,
            frame,
            {
              shadow: false,
              shadeMode: engine.SHADE_MODE_FORM,
              outlineMode: engine.OUTLINE_MODE_NONE,
            },
          ));
          const formComplete = capturePixels((context) => engine.drawAssembledSprite(
            context,
            spec,
            direction,
            animation.id,
            frame,
            {
              shadow: false,
              shadeMode: engine.SHADE_MODE_FORM,
              outlineMode: engine.OUTLINE_MODE_COMPLETE_B,
            },
          ));
          const formSelective = capturePixels((context) => engine.drawAssembledSprite(
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
          const formNoneRepeat = capturePixels((context) => engine.drawAssembledSprite(
            context,
            spec,
            direction,
            animation.id,
            frame,
            {
              shadow: false,
              shadeMode: engine.SHADE_MODE_FORM,
              outlineMode: engine.OUTLINE_MODE_NONE,
            },
          ));
          const formSelectiveRepeat = capturePixels((context) => engine.drawAssembledSprite(
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
          const completeReport = outlineReport(reviewed.pixels, outlinedComplete);
          const selectiveReport = outlineReport(reviewed.pixels, outlinedSelective);
          const protectedMask = protectedShadeMask(reviewed.pixels);
          const formReports = [
            ['None', shadeReport(reviewed.pixels, assembledNone, formNone, protectedMask)],
            ['Complete B', shadeReport(reviewed.pixels, outlinedComplete, formComplete, protectedMask)],
            ['Selective C', shadeReport(reviewed.pixels, outlinedSelective, formSelective, protectedMask)],
          ];
          check(samePixels(dispatched, reviewed.pixels), `${prefix} public dispatcher pixels differ from the approved registry`);
          check(samePixels(assembledNone, reviewed.pixels), `${prefix} None outline/shade must preserve approved registry pixels`);
          check(completeReport.sourcePreserved && completeReport.outlineColorOnly && completeReport.addedPixels > 0, `${prefix} Complete B must add only approved contour pixels`);
          check(selectiveReport.sourcePreserved && selectiveReport.outlineColorOnly && selectiveReport.addedPixels > 0, `${prefix} Selective C must add only approved contour pixels`);
          check(!samePixels(outlinedComplete, outlinedSelective), `${prefix} Complete B and Selective C must remain visibly distinct`);
          check(samePixels(formNone, formNoneRepeat), `${prefix} Form without outline must be deterministic`);
          check(samePixels(formSelective, formSelectiveRepeat), `${prefix} Form plus Selective C must be deterministic`);
          for (const [modeName, report] of formReports) {
            check(report.validColors, `${prefix} Form + ${modeName} emitted a non-canonical color`);
            check(report.sourceOwnedChanges, `${prefix} Form + ${modeName} changed sprite geometry`);
            check(report.protectedPixelsPreserved, `${prefix} Form + ${modeName} changed a protected feature pixel`);
            check(report.outlinePixelsPreserved, `${prefix} Form + ${modeName} changed outline geometry`);
            check(report.inkSafe, `${prefix} Form + ${modeName} collapsed a source pixel to outline ink`);
          }
          check(samePixels(canvasFrame(fullSheet, column, row), formSelective), `${prefix} full-sheet export must retain Form + Selective C pixels`);
          check(outOfBoundsWrites.length === 0, `${prefix} public dispatcher attempted out-of-bounds drawing`);
          completeOutlinePixels += completeReport.addedPixels;
          selectiveOutlinePixels += selectiveReport.addedPixels;
          outlineModeCases += 3;
          const frameShadeChanges = formReports[0][1].changedPixels;
          variantShadeChangedPixels += frameShadeChanges;
          shadeChangedPixels += frameShadeChanges;
          protectedShadePixels += protectedMask.reduce((total, value, index) => (
            total + (value && reviewed.pixels[index] !== null ? 1 : 0)
          ), 0);
          shadeModeCases += 3;
          frameCount++;
          column++;
        }
      }
      check(variantShadeChangedPixels > 0, `${family.id}/${variant.id} Form shading must visibly affect its approved frame corpus`);
      sheetCount++;
    }
  }

  const representative = { kind: 'enemy', family: 'plague-doctor', variant: 'field-chirurgeon' };
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

check(frameCount === 2400, 'consumer integration must verify all 2,400 approved EN-E01/EN-E02 frames');
check(sheetCount === 30, 'consumer integration must verify all 30 approved EN-E01/EN-E02 full sheets');
check(outlineModeCases === 7200, 'consumer integration must verify 7,200 EN-E01/EN-E02 None/B/C frame cases');
check(stableCompleteOutlinePixels === 207162, 'Complete B aggregate changed across the historical pre-repair EN-E01/EN-E02 corpus');
check(stableSelectiveOutlinePixels === 164487, 'Selective C aggregate changed across the historical pre-repair EN-E01/EN-E02 corpus');
check(completeOutlinePixels === 207356, 'repair-candidate Complete B aggregate drifted');
check(selectiveOutlinePixels === 163843, 'repair-candidate Selective C aggregate drifted');
check(shadeModeCases === 7200, 'consumer integration must verify Form with all 3 outline modes across 7,200 frame cases');
check(stableShadeChangedPixels === 174917, 'Form shading aggregate changed across the historical pre-repair EN-E01/EN-E02 corpus');
check(stableProtectedShadePixels === 146687, 'Form protected-pixel coverage changed across the historical pre-repair EN-E01/EN-E02 corpus');
check(shadeChangedPixels === 175878, 'repair-candidate Form shading aggregate drifted');
check(protectedShadePixels === 145528, 'repair-candidate Form protected-pixel coverage drifted');
check(expansionPaletteColors === 180, 'Form shading must resolve all published EN-E01/EN-E02 renderer palette colors');

if (errors.length) {
  console.error('EN-E01/EN-E02 consumer integration validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E01/EN-E02 consumer integration validation passed.');
console.log('- Legacy catalog: 57 families / 202 variants (unchanged)');
console.log('- Public consumer catalog: 74 families / 245 variants');
console.log('- Approved-repair adapter parity: 2,400 / 2,400 frames');
console.log('- Historical pre-repair outline/Form aggregates: preserved');
console.log('- Native expansion sheets: 30 / 30 at 480x96');
console.log(`- EN-E01/EN-E02 None/B/C outline cases: ${outlineModeCases.toLocaleString('en-US')}`);
console.log(`- Added outline pixels: ${completeOutlinePixels.toLocaleString('en-US')} Complete B / ${selectiveOutlinePixels.toLocaleString('en-US')} Selective C`);
console.log(`- EN-E01/EN-E02 Form shade cases: ${shadeModeCases.toLocaleString('en-US')} across None/B/C outlines`);
console.log(`- Form shade changes: ${shadeChangedPixels.toLocaleString('en-US')} source-owned pixels; ${protectedShadePixels.toLocaleString('en-US')} protected pixels preserved`);
console.log(`- Expansion palette colors resolved: ${expansionPaletteColors.toLocaleString('en-US')}`);
console.log('- Editor, randomizer, Complete Kit, Wildshot pack, thumbnails, and export scopes: enabled');
