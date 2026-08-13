import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { buildCompleteCharacterKitPlan, completeCharacterKitCounts } from '../character-kit.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import { capturePixels } from '../engine/pixel-buffer.js';
import { EN_E03_COMMON_ALIAS_REGISTRY } from '../engine/enemy-expansion-en-e03-common-aliases.js';
import { EN_E03_ADOPTION_GATE } from '../engine/enemy-expansion-en-e03-adoption.js';
import { EN_E03_BANNER_KHAN_MOTION_REGISTRY } from '../engine/enemy-expansion-en-e03-centaur-elite-motion.js';
import { EN_E03_REED_CHARMER_MOTION_REGISTRY } from '../engine/enemy-expansion-en-e03-satyr-specialist-motion.js';
import { EN_E03_WILDWOOD_HORNLORD_MOTION_REGISTRY } from '../engine/enemy-expansion-en-e03-satyr-elite-motion.js';
import { EN_E05_GHOUL_REPLACEMENT_REGISTRY } from '../engine/enemy-expansion-en-e05.js';
import { EN_E05_GHOUL_PUBLIC_GATE } from '../engine/enemy-expansion-en-e05-ghoul-public.js';
import { resolvePublicEnemyExpansionRoute } from '../engine/enemy-expansion-public.js';
import { EN_E06_REGISTRATION_GATE } from '../engine/enemy-expansion-en-e06-public.js';
import { EN_E06_FAIRY_REGISTRY } from '../engine/enemy-expansion-en-e06-fairy.js';
import { EN_E06_THISTLE_HEXER_REGISTRY } from '../engine/enemy-expansion-en-e06-fairy-thistle-hexer.js';
import { EN_E06_PETALCROWN_DUELIST_REGISTRY } from '../engine/enemy-expansion-en-e06-fairy-petalcrown-duelist.js';
import { EN_E06_MIRE_CRONE_REGISTRY } from '../engine/enemy-expansion-en-e06-hag-mire-crone.js';
import { EN_E06_CAULDRON_HEXER_REGISTRY } from '../engine/enemy-expansion-en-e06-hag-cauldron-hexer.js';
import { EN_E06_BLACKTHORN_MATRON_REGISTRY } from '../engine/enemy-expansion-en-e06-hag-blackthorn-matron.js';
import { EN_E06_GROVE_TENDER_REGISTRY } from '../engine/enemy-expansion-en-e06-dryad-grove-tender.js';
import { EN_E06_SPORE_CANTOR_REGISTRY } from '../engine/enemy-expansion-en-e06-dryad-spore-cantor.js';
import { captureEnemyExpansionFrame } from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

function digest(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function sameGeometry(left, right) {
  return left.every((color, index) => (color === null) === (right[index] === null));
}

function addedOutlinePixels(source, outlined) {
  let added = 0;
  for (let index = 0; index < source.length; index++) {
    if (source[index] === null && outlined[index] !== null) added++;
    if (source[index] !== null && outlined[index] !== source[index]) return -1;
  }
  return added;
}

let presentationFrames = 0;
function validatePresentation(spec, direction, animation, frame, approvedPixels, prefix) {
  const none = capturePixels((context) => engine.drawAssembledSprite(context, spec, direction, animation, frame, {
    shadow: false, outlineMode: engine.OUTLINE_MODE_NONE, shadeMode: engine.SHADE_MODE_NONE,
  }));
  const completeB = capturePixels((context) => engine.drawAssembledSprite(context, spec, direction, animation, frame, {
    shadow: false, outlineMode: engine.OUTLINE_MODE_COMPLETE_B, shadeMode: engine.SHADE_MODE_NONE,
  }));
  const form = capturePixels((context) => engine.drawAssembledSprite(context, spec, direction, animation, frame, {
    shadow: false, outlineMode: engine.OUTLINE_MODE_NONE, shadeMode: engine.SHADE_MODE_FORM,
  }));
  check(digest(none) === digest(approvedPixels), `${prefix} None presentation differs from approved source`);
  check(addedOutlinePixels(approvedPixels, completeB) > 0, `${prefix} Complete B must add contour without changing source pixels`);
  check(sameGeometry(approvedPixels, form), `${prefix} Form shading must preserve approved geometry`);
  check(form.every((color) => color === null || /^#[0-9a-f]{6}$/.test(color)), `${prefix} Form shading emitted a non-canonical color`);
  presentationFrames++;
}

const sources = [
  ['giant', 'hill-breaker', EN_E03_COMMON_ALIAS_REGISTRY],
  ['centaur', 'steppe-hunter', EN_E03_COMMON_ALIAS_REGISTRY],
  ['centaur', 'banner-khan', EN_E03_BANNER_KHAN_MOTION_REGISTRY],
  ['satyr', 'briar-reveler', EN_E03_COMMON_ALIAS_REGISTRY],
  ['satyr', 'reed-charmer', EN_E03_REED_CHARMER_MOTION_REGISTRY],
  ['satyr', 'wildwood-hornlord', EN_E03_WILDWOOD_HORNLORD_MOTION_REGISTRY],
  ['fairy', 'bramblewing-scout', EN_E06_FAIRY_REGISTRY],
  ['fairy', 'thistle-hexer', EN_E06_THISTLE_HEXER_REGISTRY],
  ['fairy', 'petalcrown-duelist', EN_E06_PETALCROWN_DUELIST_REGISTRY],
  ['hag', 'mire-crone', EN_E06_MIRE_CRONE_REGISTRY],
  ['hag', 'cauldron-hexer', EN_E06_CAULDRON_HEXER_REGISTRY],
  ['hag', 'blackthorn-matron', EN_E06_BLACKTHORN_MATRON_REGISTRY],
  ['dryad', 'grove-tender', EN_E06_GROVE_TENDER_REGISTRY],
  ['dryad', 'spore-cantor', EN_E06_SPORE_CANTOR_REGISTRY],
];

const expected = {
  giant: ['hill-breaker'],
  centaur: ['steppe-hunter', 'banner-khan'],
  satyr: ['briar-reveler', 'reed-charmer', 'wildwood-hornlord'],
  fairy: ['bramblewing-scout', 'thistle-hexer', 'petalcrown-duelist'],
  hag: ['mire-crone', 'cauldron-hexer', 'blackthorn-matron'],
  dryad: ['grove-tender', 'spore-cantor'],
};

check(EN_E06_REGISTRATION_GATE.status === 'authorized', 'EN-E06 registration lacks explicit authorization');
check(EN_E03_ADOPTION_GATE.status === 'authorized', 'EN-E03 adoption lacks explicit authorization');
check(EN_E05_GHOUL_PUBLIC_GATE.status === 'authorized', 'Ghoul replacement lacks explicit authorization');
check([EN_E06_REGISTRATION_GATE, EN_E03_ADOPTION_GATE, EN_E05_GHOUL_PUBLIC_GATE].every((gate) => gate.authorizationEvidence.includes('sure lets go ahead')), 'integration authorization evidence drifted');

const expansionVariants = engine.ENEMY_EXPANSION_REGISTRY.families.reduce((total, family) => total + family.variants.length, 0);
const publicVariants = engine.PUBLIC_ENEMIES.reduce((total, family) => total + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && engine.ENEMIES.reduce((total, family) => total + family.variants.length, 0) === 202, 'legacy catalog must remain 57/202');
check(engine.ENEMY_EXPANSION_REGISTRY.families.length === 43 && expansionVariants === 114, 'approved expansion registry must be 43/114');
check(engine.ENEMY_EXPANSION_CONSUMER_REGISTRY === engine.ENEMY_EXPANSION_REGISTRY, 'assembler consumers must reuse the exact approved registry');
check(engine.PUBLIC_ENEMIES.length === 100 && publicVariants === 316, 'public assembler catalog must be 100/316');
check(engine.PUBLIC_ENEMIES.slice(0, 57).every((family, index) => family === engine.ENEMIES[index]), 'legacy public catalog order or identity changed');

for (const [familyId, variants] of Object.entries(expected)) {
  const family = engine.PUBLIC_ENEMIES.find((entry) => entry.id === familyId);
  check(Boolean(family), `public assembler is missing ${familyId}`);
  check(variants.every((variant, index) => family?.variants[index]?.id === variant), `${familyId} previously integrated variants drifted`);
}
for (const [family, variant] of [['giant', 'boulder-hurler'], ['giant', 'storm-clan-jarl'], ['centaur', 'sun-lancer']]) {
  check(!engine.PUBLIC_ENEMIES.find(({ id }) => id === family)?.variants.some(({ id }) => id === variant), `${family}/${variant} is partial and must remain excluded`);
}

const frameRecords = [];
for (const [family, variant, registry] of sources) {
  const spec = { kind: 'enemy', family, variant };
  check(engine.isPublicEnemyExpansionSpec(spec), `${family}/${variant} must route through the public expansion dispatcher`);
  for (const direction of engine.DIRS) for (const animation of engine.ANIMS) for (let frame = 0; frame < animation.frames; frame++) {
    const approved = captureEnemyExpansionFrame(registry, spec, direction, animation.id, frame, engine.SIZE);
    const integrated = capturePixels((context) => engine.drawSprite(context, spec, direction, animation.id, frame, { shadow: false }));
    const integratedDigest = digest(integrated);
    const prefix = `${family}/${variant}/${direction}/${animation.id}/${frame}`;
    check(integratedDigest === approved.digest, `${prefix} differs from approved source`);
    validatePresentation(spec, direction, animation.id, frame, approved.pixels, prefix);
    frameRecords.push([family, variant, direction, animation.id, frame, integratedDigest]);
  }
}

const publicGhoul = { kind: 'enemy', family: 'zombie', variant: 'ghoul' };
const sourceGhoul = { kind: 'enemy', family: 'ghoul-upgrade', variant: 'ghoul' };
check(engine.isPublicEnemyExpansionSpec(publicGhoul), 'public zombie/ghoul must route through the approved replacement');
check(!engine.PUBLIC_ENEMIES.some(({ id }) => id === 'ghoul-upgrade'), 'Ghoul replacement must not create a duplicate public family');
check(resolvePublicEnemyExpansionRoute(publicGhoul)?.replacementGate === EN_E05_GHOUL_PUBLIC_GATE.id, 'public Ghoul replacement route drifted');
for (const direction of engine.DIRS) for (const animation of engine.ANIMS) for (let frame = 0; frame < animation.frames; frame++) {
  const approved = captureEnemyExpansionFrame(EN_E05_GHOUL_REPLACEMENT_REGISTRY, sourceGhoul, direction, animation.id, frame, engine.SIZE);
  const integrated = capturePixels((context) => engine.drawSprite(context, publicGhoul, direction, animation.id, frame, { shadow: false }));
  const integratedDigest = digest(integrated);
  const prefix = `zombie/ghoul/${direction}/${animation.id}/${frame}`;
  check(integratedDigest === approved.digest, `${prefix} differs from approved upgrade`);
  validatePresentation(publicGhoul, direction, animation.id, frame, approved.pixels, prefix);
  frameRecords.push(['zombie', 'ghoul', direction, animation.id, frame, integratedDigest]);
}

for (const variant of ['shambler', 'rotter', 'brute']) {
  const spec = { kind: 'enemy', family: 'zombie', variant };
  for (const direction of engine.DIRS) for (const animation of engine.ANIMS) for (let frame = 0; frame < animation.frames; frame++) {
    const legacy = capturePixels((context) => drawLegacySprite(context, spec, direction, animation.id, frame, { shadow: false }));
    const current = capturePixels((context) => engine.drawSprite(context, spec, direction, animation.id, frame, { shadow: false }));
    check(digest(current) === digest(legacy), `zombie/${variant}/${direction}/${animation.id}/${frame} changed with Ghoul replacement`);
  }
}

const fixtureHash = createHash('sha256').update(await readFile(path.join(root, 'asset-pack', 'enemies', 'zombie-ghoul.png'))).digest('hex');
check(fixtureHash === 'a6f69caac95fad855db65ae787ceac0e9333f9013ee3882a13b6ccab57a7edc2', 'legacy Ghoul fixture changed without fixture authorization');

const kitCounts = completeCharacterKitCounts();
const kitPlan = buildCompleteCharacterKitPlan();
check(kitCounts.componentPngs === 1912 && kitCounts.enemyFamilies === 100 && kitCounts.enemySheets === 316 && kitCounts.effectSheets === 24 && kitCounts.totalPngs === 2253, 'Complete Kit counts must include all adopted enemies');
check(kitPlan.enemies.length === 100 && kitPlan.enemies.flatMap(({ variants }) => variants).length === 316, 'Complete Kit plan must include the 100/316 public catalog');

const actorSpecs = [...sources.map(([family, variant]) => ({ family, variant })), publicGhoul].map((spec) => ({ kind: 'enemy', ...spec }));
const manifest = engine.buildWildshotGamePackManifest({
  generated: '2026-08-09',
  toolCommit: 'b331e54',
  actors: actorSpecs.map((spec) => ({ id: `${spec.family}-${spec.variant}`, category: 'enemy', sheet: `enemies/${spec.family}-${spec.variant}.png`, spec })),
});
check(manifest.actors.length === 15, 'Wildshot must accept all fifteen integrated enemy specs');

const integratedFrameDigest = digest(frameRecords);
check(integratedFrameDigest === '74953d1b8531be86bf3f551b15fc70aa4ff142d954763ad4183eb36e06fd6497', 'integrated 1,200-frame digest drifted');

if (errors.length) {
  console.error('Approved enemy assembler integration gate failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Approved enemy assembler integration gate passed.');
console.log('- Public catalog: 100 families / 316 variants; legacy remains 57/202');
console.log('- Integrated parity: 15 complete suites / 1,200 exact approved frames');
console.log(`- Assembler presentation: ${presentationFrames} None / Complete B / Form frame triplets`);
console.log('- Excluded partials: Boulder Hurler, Storm-Clan Jarl, Sun Lancer');
console.log('- Ghoul: approved upgrade routed at zombie/ghoul; other Zombies and fixture unchanged');
console.log(`- Integrated frame digest: ${integratedFrameDigest}`);
