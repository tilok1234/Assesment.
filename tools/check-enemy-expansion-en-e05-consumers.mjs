import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { buildCompleteCharacterKitPlan, completeCharacterKitCounts } from '../character-kit.js';
import { capturePixels } from '../engine/pixel-buffer.js';
import {
  EN_E05_CONSUMER_INTEGRATION_GATE,
  EN_E05_GHOUL_REPLACEMENT_REGISTRY,
  EN_E05_PUBLIC_REGISTRY,
  EN_E05_REGISTRATION_GATE,
} from '../engine/enemy-expansion-en-e05.js';
import { captureEnemyExpansionFrame } from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

function hashJson(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

async function sha256File(relativePath) {
  return createHash('sha256').update(await readFile(path.join(root, relativePath))).digest('hex');
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

function renderSpritePixels(spec, direction, animation, frame, options = {}) {
  return capturePixels((context) => engine.drawSprite(context, spec, direction, animation, frame, options));
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
  toDataURL() { return 'data:image/png;base64,en-e05-consumer-check'; }
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
  lich: ['soul-regent'],
  mummy: ['tomb-walker'],
  revenant: ['grave-oathkeeper'],
  vampire: ['night-noble'],
};
const familyIds = Object.keys(expectedVariants);
const randomFamilyIndices = {
  lich: 64,
  mummy: 66,
  revenant: 71,
  vampire: 72,
};

check(EN_E05_CONSUMER_INTEGRATION_GATE.id === 'en-e05-assembler-consumers-v1', 'EN-E05 consumer gate id drifted');
check(EN_E05_CONSUMER_INTEGRATION_GATE.status === 'authorized', 'EN-E05 consumer integration needs explicit authorization');
check(EN_E05_CONSUMER_INTEGRATION_GATE.authorizedOn === '2026-08-09', 'EN-E05 consumer authorization date drifted');
check(EN_E05_CONSUMER_INTEGRATION_GATE.authorizationEvidence.includes('cool lets do next'), 'EN-E05 consumer authorization evidence drifted');
check(EN_E05_CONSUMER_INTEGRATION_GATE.registrationCheckpoint === '7d273ef52960e5bd4568ce3d47148c1b68fdcf44', 'EN-E05 consumer gate must retain the exact registration implementation checkpoint');
check(EN_E05_CONSUMER_INTEGRATION_GATE.registrationHandoff === '59a694118e08733b6f5e069009abc31e75e517cf', 'EN-E05 consumer gate must retain the exact registration handoff checkpoint');
check(EN_E05_CONSUMER_INTEGRATION_GATE.registrationFrameDigest === EN_E05_REGISTRATION_GATE.candidateFrameDigest, 'EN-E05 consumer gate must retain the approved registration digest');
check(EN_E05_CONSUMER_INTEGRATION_GATE.expectedExpansionFamilies === 17 && EN_E05_CONSUMER_INTEGRATION_GATE.expectedExpansionVariants === 43, 'EN-E05 consumer expansion counts drifted');
check(EN_E05_CONSUMER_INTEGRATION_GATE.expectedPublicFamilies === 74 && EN_E05_CONSUMER_INTEGRATION_GATE.expectedPublicVariants === 245, 'EN-E05 consumer public counts drifted');
check(EN_E05_CONSUMER_INTEGRATION_GATE.exclusions.includes('public zombie/ghoul replacement') && EN_E05_CONSUMER_INTEGRATION_GATE.exclusions.includes('asset-pack fixture generation or regeneration') && EN_E05_CONSUMER_INTEGRATION_GATE.exclusions.includes('Wave 2'), 'EN-E05 consumer gate must protect Ghoul, fixtures, and Wave 2');
check(Object.isFrozen(EN_E05_CONSUMER_INTEGRATION_GATE) && Object.isFrozen(EN_E05_CONSUMER_INTEGRATION_GATE.exclusions), 'EN-E05 consumer gate must be deeply immutable');

const expansionVariantCount = engine.ENEMY_EXPANSION_REGISTRY.families.reduce((total, family) => total + family.variants.length, 0);
const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((total, family) => total + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && engine.ENEMIES.reduce((total, family) => total + family.variants.length, 0) === 202, 'EN-E05 consumer integration must preserve the legacy 57/202 catalog');
check(engine.ENEMY_EXPANSION_CONSUMER_REGISTRY === engine.ENEMY_EXPANSION_REGISTRY, 'EN-E05 consumers must reuse the exact stable registry');
check(engine.ENEMY_EXPANSION_CONSUMER_REGISTRY.publicFamilies.length === 17 && expansionVariantCount === 43, 'the generic expansion consumer registry must contain 17 families / 43 variants');
check(engine.PUBLIC_ENEMIES.length === 74 && publicVariantCount === 245, 'the public consumer catalog must contain 74 families / 245 variants');
check(Object.isFrozen(engine.PUBLIC_ENEMIES), 'the public consumer catalog must be immutable');
check(engine.PUBLIC_ENEMIES.slice(0, 57).every((family, index) => family === engine.ENEMIES[index]), 'EN-E05 consumer integration must retain the exact legacy catalog and order');
check(engine.PUBLIC_ENEMIES.slice(-17).every((family, index) => family === engine.ENEMY_EXPANSION_CONSUMER_REGISTRY.publicFamilies[index]), 'the public catalog must append the exact stable expansion public-family view');

for (const familyId of familyIds) {
  const registered = EN_E05_PUBLIC_REGISTRY.publicFamilies.find((family) => family.id === familyId);
  const consumer = engine.ENEMY_EXPANSION_CONSUMER_REGISTRY.publicFamilies.find((family) => family.id === familyId);
  const publicFamily = engine.PUBLIC_ENEMIES.find((family) => family.id === familyId);
  check(Boolean(registered) && Boolean(consumer) && publicFamily === consumer, `${familyId} must enter generic consumers through the exact stable public record`);
  check(JSON.stringify(publicFamily?.variants.map((variant) => variant.id)) === JSON.stringify(expectedVariants[familyId]), `${familyId} public variants drifted`);
}

check(EN_E05_GHOUL_REPLACEMENT_REGISTRY.families.length === 1, 'the approved Ghoul replacement record must remain available for its later gate');
check(!engine.ENEMY_EXPANSION_CONSUMER_REGISTRY.families.some((family) => family.id === 'ghoul-upgrade'), 'the Ghoul replacement record must remain outside assembler consumers');
check(!engine.PUBLIC_ENEMIES.some((family) => family.id === 'ghoul-upgrade'), 'the Ghoul replacement record must remain absent from public selectors');
check(!engine.isPublicEnemyExpansionSpec({ kind: 'enemy', family: 'ghoul-upgrade', variant: 'ghoul' }), 'the Ghoul replacement must not route through the public expansion dispatcher');
const publicZombie = engine.PUBLIC_ENEMIES.find((family) => family.id === 'zombie');
const legacyZombie = engine.ENEMIES.find((family) => family.id === 'zombie');
check(publicZombie === legacyZombie, 'public Zombie must remain the exact legacy family record');
check(publicZombie?.variants.find((variant) => variant.id === 'ghoul') === legacyZombie?.variants.find((variant) => variant.id === 'ghoul'), 'public zombie/ghoul must remain the exact legacy variant record');
check(await sha256File('asset-pack/enemies/zombie-ghoul.png') === 'a6f69caac95fad855db65ae787ceac0e9333f9013ee3882a13b6ccab57a7edc2', 'the frozen legacy Ghoul fixture changed');
const legacyGhoulFrames = [];
for (const direction of engine.DIRS) for (const animation of engine.ANIMS) for (let frame = 0; frame < animation.frames; frame++) {
  legacyGhoulFrames.push(renderSpritePixels({ kind: 'enemy', family: 'zombie', variant: 'ghoul' }, direction, animation.id, frame, { shadow: false }));
}
check(hashJson(legacyGhoulFrames) === '2eee0fd08ce8d22cc2d5dc3433746d54b64983216d4b800f93119f9ebec5f735', 'public legacy zombie/ghoul pixels changed during EN-E05 consumer integration');

const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
check(!facadeSource.includes('enemy-expansion-en-e05') && !facadeSource.includes('EN_E05_'), 'the stable facade must not expose EN-E05 implementation details directly');
check(publicSource.includes('export const ENEMY_EXPANSION_CONSUMER_REGISTRY = ENEMY_EXPANSION_REGISTRY;'), 'the public boundary must expose the exact stable registry after authorization');
for (const relativePath of ['app.js', 'character-kit.js', 'engine/generators.js', 'engine/public-game-pack.js', 'engine/public-renderer.js', 'engine/shade-renderer.js']) {
  const source = await readFile(path.join(root, relativePath), 'utf8');
  check(!source.includes('EN_E05_') && !source.includes('enemy-expansion-en-e05'), `${relativePath} must remain generic rather than branch on EN-E05`);
}

const originalRandom = Math.random;
try {
  for (const familyId of familyIds) {
    const values = [(randomFamilyIndices[familyId] + 0.1) / 74, 0.5];
    Math.random = () => values.shift();
    check(JSON.stringify(engine.randomEnemy()) === JSON.stringify({ family: familyId, variant: expectedVariants[familyId][0] }), `the randomizer must select ${familyId}`);
  }
} finally {
  Math.random = originalRandom;
}

const kitCounts = completeCharacterKitCounts();
const kitPlan = buildCompleteCharacterKitPlan();
check(kitCounts.componentPngs === 1912 && kitCounts.enemyFamilies === 74 && kitCounts.enemySheets === 245 && kitCounts.effectSheets === 24 && kitCounts.totalPngs === 2182, 'Complete Character Kit counts must include all four EN-E05 sheets');
check(kitPlan.enemies.length === 74 && kitPlan.enemies.flatMap((family) => family.variants).length === 245, 'Complete Character Kit planning must include the 74/245 public catalog');
for (const [familyId, variants] of Object.entries(expectedVariants)) {
  const family = kitPlan.enemies.find((entry) => entry.family === familyId);
  check(Boolean(family), `Complete Character Kit is missing ${familyId}`);
  for (const variantId of variants) {
    const variant = family?.variants.find((entry) => entry.id === variantId);
    check(variant?.file === `enemies/${familyId}/${variantId}.png`, `Complete Character Kit path drifted for ${familyId}/${variantId}`);
    check(JSON.stringify(variant?.spec) === JSON.stringify({ kind: 'enemy', family: familyId, variant: variantId }), `Complete Character Kit spec drifted for ${familyId}/${variantId}`);
  }
}

const wildshotActors = Object.entries(expectedVariants).map(([family, variants]) => ({
  id: `${family}-${variants[0]}`,
  category: 'enemy',
  sheet: `enemies/${family}-${variants[0]}.png`,
  spec: { kind: 'enemy', family, variant: variants[0] },
}));
const packManifest = engine.buildWildshotGamePackManifest({
  generated: '2026-08-09',
  toolCommit: EN_E05_CONSUMER_INTEGRATION_GATE.registrationHandoff,
  actors: wildshotActors,
});
check(packManifest.actors.length === 4, 'Wildshot validation must accept all four EN-E05 enemy specs');
check(packManifest.actors.every((actor) => familyIds.includes(actor.spec.family)), 'Wildshot EN-E05 actors must retain their approved families');

const frameRecords = [];
let sheetCount = 0;
let outlineCases = 0;
let outlinePixels = 0;
let formCases = 0;
let formChangedPixels = 0;
const originalDocument = globalThis.document;
try {
  globalThis.document = { createElement: (tag) => tag === 'canvas' ? new ValidationCanvas() : null };
  for (const familyId of familyIds) {
    const family = EN_E05_PUBLIC_REGISTRY.publicFamilies.find((entry) => entry.id === familyId);
    const variantId = expectedVariants[familyId][0];
    const variant = family?.variants.find((entry) => entry.id === variantId);
    const spec = { kind: 'enemy', family: familyId, variant: variantId };
    check(Boolean(family) && Boolean(variant), `${familyId}/${variantId} is missing from the registered EN-E05 source`);
    check(engine.isPublicEnemyExpansionSpec(spec), `${familyId}/${variantId} must route through the generic public dispatcher`);
    check(engine.enemySupportsOutline(spec), `${familyId}/${variantId} must support public outline modes`);
    const fullSheet = engine.buildSheet(spec, 1, { shadow: false, outlineMode: engine.OUTLINE_MODE_NONE, shadeMode: engine.SHADE_MODE_NONE });
    const directionSheet = engine.buildDirectionSheet(spec, 'left', 1, { shadow: false });
    const animationSheet = engine.buildAnimationSheet(spec, 'attack', 1, { shadow: false });
    check(fullSheet.width === 480 && fullSheet.height === 96, `${familyId}/${variantId} full sheet must be 480x96`);
    check(directionSheet.width === 480 && directionSheet.height === 24, `${familyId}/${variantId} direction sheet must be 480x24`);
    check(animationSheet.width === 96 && animationSheet.height === 96, `${familyId}/${variantId} Attack sheet must be 96x96`);
    check(engine.thumbURL(spec).startsWith('data:image/png;base64,'), `${familyId}/${variantId} thumbnail must use the generic renderer`);
    sheetCount++;
    let variantFormChanges = 0;
    for (const [row, direction] of engine.DIRS.entries()) {
      let column = 0;
      for (const animation of engine.ANIMS) for (let frame = 0; frame < animation.frames; frame++) {
        const approved = captureEnemyExpansionFrame(EN_E05_PUBLIC_REGISTRY, spec, direction, animation.id, frame, engine.SIZE);
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
        const prefix = `${familyId}/${variantId}/${direction}/${animation.id}/${frame}`;
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
          family: familyId,
          variant: variantId,
          direction,
          animation: animation.id,
          frame,
          digest: approved.digest,
          alphaDigest: approved.alphaDigest,
          opaquePixels: approved.opaquePixels,
          bounds: approved.bounds,
        });
        column++;
      }
    }
    check(variantFormChanges > 0, `${familyId}/${variantId} must receive visible Form shading`);
  }
} finally {
  if (originalDocument === undefined) delete globalThis.document;
  else globalThis.document = originalDocument;
}

const consumerFrameDigest = hashJson(frameRecords);
check(frameRecords.length === 320, 'EN-E05 consumer integration must exhaust all 320 approved new-family frames');
check(sheetCount === 4, 'EN-E05 consumer integration must build four native full sheets');
check(outlineCases === 320 && outlinePixels > 0, 'EN-E05 consumer integration must validate Complete B on all 320 frames');
check(formCases === 320 && formChangedPixels > 0, 'EN-E05 consumer integration must validate Form shading on all 320 frames');
check(consumerFrameDigest === EN_E05_CONSUMER_INTEGRATION_GATE.consumerFrameDigest, `generic EN-E05 consumer digest drifted; computed ${consumerFrameDigest}`);

if (errors.length) {
  console.error('EN-E05 assembler consumer integration validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('EN-E05 assembler consumer integration validation passed.');
console.log('- Public catalog: 74 families / 245 variants');
console.log('- EN-E05 generic dispatcher parity: 320 / 320 frames');
console.log('- EN-E05 native exports: 4 full sheets plus direction/animation/thumbnail routes');
console.log(`- Complete B cases: ${outlineCases}; added pixels: ${outlinePixels}`);
console.log(`- Form cases: ${formCases}; changed source pixels: ${formChangedPixels}`);
console.log('- Complete Character Kit: 74 families / 245 enemy sheets / 2182 total PNGs');
console.log('- Wildshot EN-E05 specs accepted: 4 / 4');
console.log('- Public zombie/ghoul and frozen legacy fixture remain exact');
console.log(`- Approved EN-E05 public frame digest: ${consumerFrameDigest}`);
