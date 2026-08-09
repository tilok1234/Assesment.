import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { buildCompleteCharacterKitPlan, completeCharacterKitCounts } from '../character-kit.js';
import { capturePixels } from '../engine/pixel-buffer.js';
import {
  EN_E04_CONSUMER_INTEGRATION_GATE,
  EN_E04_PUBLIC_REGISTRY,
  EN_E04_REGISTRATION_GATE,
} from '../engine/enemy-expansion-en-e04.js';
import { captureEnemyExpansionFrame } from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

function samePixels(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function geometryMatches(source, presented) {
  return source.every((color, index) => (color === null) === (presented[index] === null));
}

function addedOutlinePixels(source, outlined) {
  let added = 0;
  for (let index = 0; index < source.length; index++) {
    if (source[index] === null && outlined[index] !== null) added++;
    if (source[index] !== null && outlined[index] !== source[index]) return -1;
  }
  return added;
}

function changedSourcePixels(source, presented) {
  let changed = 0;
  for (let index = 0; index < source.length; index++) {
    if (source[index] !== null && presented[index] !== source[index]) changed++;
  }
  return changed;
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
  toDataURL() { return 'data:image/png;base64,en-e04-consumer-check'; }
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

const expectedVariants = {
  birdfolk: ['aerie-scout', 'gale-augur', 'stormcrown-exarch'],
  merfolk: ['tideguard', 'reefcaller', 'pearl-regent'],
  naga: ['coilguard', 'venom-oracle', 'temple-rajah'],
};
const enE04FamilyIds = Object.keys(expectedVariants);
const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((total, family) => total + family.variants.length, 0);

check(EN_E04_CONSUMER_INTEGRATION_GATE.id === 'en-e04-assembler-consumers-v1', 'EN-E04 consumer gate id drifted');
check(EN_E04_CONSUMER_INTEGRATION_GATE.status === 'authorized', 'EN-E04 consumer integration needs explicit authorization');
check(EN_E04_CONSUMER_INTEGRATION_GATE.authorizedOn === '2026-08-09', 'EN-E04 consumer authorization date drifted');
check(EN_E04_CONSUMER_INTEGRATION_GATE.authorizationEvidence.includes('sure lets do 123'), 'EN-E04 consumer authorization evidence drifted');
check(EN_E04_CONSUMER_INTEGRATION_GATE.registrationCheckpoint === '6f228fb' && EN_E04_CONSUMER_INTEGRATION_GATE.registrationHandoff === '3bc380a', 'EN-E04 consumer gate must identify the exact published registration checkpoints');
check(EN_E04_CONSUMER_INTEGRATION_GATE.expectedPublicFamilies === 70 && EN_E04_CONSUMER_INTEGRATION_GATE.expectedPublicVariants === 241, 'EN-E04 consumer expected counts drifted');
check(Object.isFrozen(EN_E04_CONSUMER_INTEGRATION_GATE) && Object.isFrozen(EN_E04_CONSUMER_INTEGRATION_GATE.exclusions), 'EN-E04 consumer gate must be deeply immutable');
check(EN_E04_REGISTRATION_GATE.candidateFrameDigest === '137d044a55dd41d612a8b41958029e41ef39fb75ccf58de9b46d6c4328c91459', 'the approved EN-E04 registration digest drifted');

check(engine.ENEMIES.length === 57 && engine.ENEMIES.reduce((total, family) => total + family.variants.length, 0) === 202, 'consumer integration must preserve the 57-family / 202-variant legacy catalog');
check(engine.ENEMY_EXPANSION_CONSUMER_REGISTRY === engine.ENEMY_EXPANSION_REGISTRY, 'EN-E04 consumers must reuse the exact stable approved registry');
check(engine.ENEMY_EXPANSION_CONSUMER_REGISTRY.publicFamilies.length === 13, 'the generic expansion consumer registry must contain thirteen families');
check(engine.PUBLIC_ENEMIES.length === 70 && publicVariantCount === 241, 'the public consumer catalog must contain 70 families / 241 variants');
check(Object.isFrozen(engine.PUBLIC_ENEMIES), 'the public consumer catalog must be immutable');
check(engine.PUBLIC_ENEMIES.slice(0, 57).every((family, index) => family === engine.ENEMIES[index]), 'consumer integration must retain the legacy catalog unchanged and in order');
check(engine.PUBLIC_ENEMIES.slice(-13).every((family, index) => family === engine.ENEMY_EXPANSION_CONSUMER_REGISTRY.publicFamilies[index]), 'the public catalog must append the exact stable expansion public-family view');

for (const familyId of enE04FamilyIds) {
  const family = engine.PUBLIC_ENEMIES.find((entry) => entry.id === familyId);
  check(Boolean(family), `${familyId} must enter the public consumer catalog`);
  check(JSON.stringify(family?.variants.map((variant) => variant.id)) === JSON.stringify(expectedVariants[familyId]), `${familyId} public variants must retain approved common/specialist/elite order`);
}

const appSource = await readFile(path.join(root, 'app.js'), 'utf8');
check(!appSource.includes('E.ENEMIES'), 'editor sanitization and selectors must not use the legacy-only catalog');
check((appSource.match(/E\.PUBLIC_ENEMIES/g) || []).length === 7, 'editor persistence, sanitization, and both selector levels must consume PUBLIC_ENEMIES');
for (const relativePath of ['app.js', 'character-kit.js', 'engine/generators.js', 'engine/public-game-pack.js', 'engine/public-renderer.js', 'engine/shade-renderer.js']) {
  const source = relativePath === 'app.js' ? appSource : await readFile(path.join(root, relativePath), 'utf8');
  check(!source.includes('EN_E04_') && !source.includes('enemy-expansion-en-e04'), `${relativePath} must remain generic rather than branch on EN-E04`);
}

const originalRandom = Math.random;
try {
  let values = [58.1 / 70, 0.5];
  Math.random = () => values.shift();
  check(JSON.stringify(engine.randomEnemy()) === JSON.stringify({ family: 'birdfolk', variant: 'gale-augur' }), 'the randomizer must select Birdfolk variants');
  values = [64.1 / 70, 0];
  Math.random = () => values.shift();
  check(JSON.stringify(engine.randomEnemy()) === JSON.stringify({ family: 'merfolk', variant: 'tideguard' }), 'the randomizer must select Merfolk variants');
  values = [65.1 / 70, 0.999999];
  Math.random = () => values.shift();
  check(JSON.stringify(engine.randomEnemy()) === JSON.stringify({ family: 'naga', variant: 'temple-rajah' }), 'the randomizer must select Naga variants');
} finally {
  Math.random = originalRandom;
}

const kitCounts = completeCharacterKitCounts();
const kitPlan = buildCompleteCharacterKitPlan();
check(kitCounts.componentPngs === 1912 && kitCounts.enemyFamilies === 70 && kitCounts.enemySheets === 241 && kitCounts.effectSheets === 24 && kitCounts.totalPngs === 2178, 'Complete Character Kit counts must include all nine EN-E04 sheets');
check(kitPlan.enemies.length === 70 && kitPlan.enemies.flatMap((family) => family.variants).length === 241, 'Complete Character Kit planning must include the 70/241 public catalog');
for (const [familyId, variants] of Object.entries(expectedVariants)) {
  const family = kitPlan.enemies.find((entry) => entry.family === familyId);
  check(Boolean(family), `Complete Character Kit is missing ${familyId}`);
  for (const variantId of variants) {
    const variant = family?.variants.find((entry) => entry.id === variantId);
    check(variant?.file === `enemies/${familyId}/${variantId}.png`, `Complete Character Kit path drifted for ${familyId}/${variantId}`);
    check(JSON.stringify(variant?.spec) === JSON.stringify({ kind: 'enemy', family: familyId, variant: variantId }), `Complete Character Kit spec drifted for ${familyId}/${variantId}`);
  }
}

const wildshotActors = Object.entries(expectedVariants).flatMap(([family, variants]) => variants.map((variant) => ({
  id: `${family}-${variant}`,
  category: 'enemy',
  sheet: `enemies/${family}-${variant}.png`,
  spec: { kind: 'enemy', family, variant },
})));
const packManifest = engine.buildWildshotGamePackManifest({
  generated: '2026-08-09',
  toolCommit: '3bc380a',
  actors: wildshotActors,
});
check(packManifest.actors.length === 9, 'Wildshot validation must accept all nine EN-E04 enemy specs');
check(packManifest.actors.every((actor) => enE04FamilyIds.includes(actor.spec.family)), 'Wildshot EN-E04 actors must retain their approved families');

const frameRecords = [];
let frameCount = 0;
let sheetCount = 0;
let outlineCases = 0;
let outlinePixels = 0;
let formCases = 0;
let formChangedPixels = 0;
const originalDocument = globalThis.document;
try {
  globalThis.document = { createElement: (tag) => tag === 'canvas' ? new ValidationCanvas() : null };
  for (const familyId of ['naga', 'merfolk', 'birdfolk']) {
    const family = EN_E04_PUBLIC_REGISTRY.publicFamilies.find((entry) => entry.id === familyId);
    for (const variantId of expectedVariants[familyId]) {
      const variant = family.variants.find((entry) => entry.id === variantId);
    const spec = { kind: 'enemy', family: family.id, variant: variant.id };
    check(engine.isPublicEnemyExpansionSpec(spec), `${family.id}/${variant.id} must route through the generic public dispatcher`);
    check(engine.enemySupportsOutline(spec), `${family.id}/${variant.id} must support public outline modes`);
    const fullSheet = engine.buildSheet(spec, 1, { shadow: false, outlineMode: engine.OUTLINE_MODE_NONE, shadeMode: engine.SHADE_MODE_NONE });
    const directionSheet = engine.buildDirectionSheet(spec, 'left', 1, { shadow: false });
    const animationSheet = engine.buildAnimationSheet(spec, 'attack', 1, { shadow: false });
    check(fullSheet.width === 480 && fullSheet.height === 96, `${family.id}/${variant.id} full sheet must be 480x96`);
    check(directionSheet.width === 480 && directionSheet.height === 24, `${family.id}/${variant.id} direction sheet must be 480x24`);
    check(animationSheet.width === 96 && animationSheet.height === 96, `${family.id}/${variant.id} Attack sheet must be 96x96`);
    check(engine.thumbURL(spec).startsWith('data:image/png;base64,'), `${family.id}/${variant.id} thumbnail must use the generic renderer`);
    sheetCount++;
    let variantFormChanges = 0;
    for (const [row, direction] of engine.DIRS.entries()) {
      let column = 0;
      for (const animation of engine.ANIMS) for (let frame = 0; frame < animation.frames; frame++) {
        const approved = captureEnemyExpansionFrame(EN_E04_PUBLIC_REGISTRY, spec, direction, animation.id, frame, engine.SIZE);
        const outOfBoundsWrites = [];
        const dispatched = capturePixels((context) => engine.drawSprite(context, spec, direction, animation.id, frame, {
          shadow: false,
          onOutOfBounds: (write) => outOfBoundsWrites.push(write),
        }));
        const assembledNone = capturePixels((context) => engine.drawAssembledSprite(context, spec, direction, animation.id, frame, {
          shadow: false,
          outlineMode: engine.OUTLINE_MODE_NONE,
          shadeMode: engine.SHADE_MODE_NONE,
        }));
        const completeB = capturePixels((context) => engine.drawAssembledSprite(context, spec, direction, animation.id, frame, {
          shadow: false,
          outlineMode: engine.OUTLINE_MODE_COMPLETE_B,
          shadeMode: engine.SHADE_MODE_NONE,
        }));
        const form = capturePixels((context) => engine.drawAssembledSprite(context, spec, direction, animation.id, frame, {
          shadow: false,
          outlineMode: engine.OUTLINE_MODE_NONE,
          shadeMode: engine.SHADE_MODE_FORM,
        }));
        const prefix = `${family.id}/${variant.id}/${direction}/${animation.id}/${frame}`;
        check(samePixels(dispatched, approved.pixels), `${prefix} public dispatcher pixels differ from the approved registry`);
        check(samePixels(assembledNone, approved.pixels), `${prefix} None presentation must preserve approved pixels`);
        check(outOfBoundsWrites.length === 0, `${prefix} public dispatcher attempted an out-of-bounds write`);
        const added = addedOutlinePixels(approved.pixels, completeB);
        check(added > 0, `${prefix} Complete B must add contour pixels without changing source pixels`);
        check(geometryMatches(approved.pixels, form), `${prefix} Form shading must preserve actor geometry`);
        check(form.every((color) => color === null || /^#[0-9a-f]{6}$/.test(color)), `${prefix} Form shading must emit canonical colors`);
        const changed = changedSourcePixels(approved.pixels, form);
        variantFormChanges += changed;
        outlinePixels += Math.max(0, added);
        formChangedPixels += changed;
        outlineCases++;
        formCases++;
        check(samePixels(canvasFrame(fullSheet, column, row), approved.pixels), `${prefix} full-sheet cell differs from the approved registry`);
        frameRecords.push({
          family: family.id,
          variant: variant.id,
          direction,
          animation: animation.id,
          frame,
          digest: approved.digest,
          alphaDigest: approved.alphaDigest,
          opaquePixels: approved.opaquePixels,
          bounds: approved.bounds,
        });
        frameCount++;
        column++;
      }
    }
      check(variantFormChanges > 0, `${family.id}/${variant.id} must receive visible Form shading`);
    }
  }
} finally {
  if (originalDocument === undefined) delete globalThis.document;
  else globalThis.document = originalDocument;
}

const publicFrameDigest = createHash('sha256').update(JSON.stringify(frameRecords)).digest('hex');
check(frameCount === 720 && frameRecords.length === 720, 'EN-E04 consumer integration must exhaust all 720 approved frames');
check(sheetCount === 9, 'EN-E04 consumer integration must build nine native full sheets');
check(outlineCases === 720 && outlinePixels > 0, 'EN-E04 consumer integration must validate Complete B on all 720 frames');
check(formCases === 720 && formChangedPixels > 0, 'EN-E04 consumer integration must validate Form shading on all 720 frames');
check(publicFrameDigest === EN_E04_REGISTRATION_GATE.candidateFrameDigest, 'generic EN-E04 consumer pixels differ from the approved registration digest');

if (errors.length) {
  console.error('EN-E04 assembler consumer integration validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('EN-E04 assembler consumer integration validation passed.');
console.log('- Public catalog: 70 families / 241 variants');
console.log('- EN-E04 generic dispatcher parity: 720 / 720 frames');
console.log('- EN-E04 native exports: 9 full sheets plus direction/animation/thumbnail routes');
console.log(`- Complete B cases: ${outlineCases}; added pixels: ${outlinePixels}`);
console.log(`- Form cases: ${formCases}; changed source pixels: ${formChangedPixels}`);
console.log('- Complete Character Kit: 70 families / 241 enemy sheets / 2178 total PNGs');
console.log('- Wildshot EN-E04 specs accepted: 9 / 9');
console.log(`- Approved EN-E04 public frame digest: ${publicFrameDigest}`);
