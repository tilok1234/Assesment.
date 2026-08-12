import { createHash } from 'node:crypto';
import * as engine from '../sprite-engine.js';
import { completeCharacterKitCounts } from '../character-kit.js';
import { capturePixels } from '../engine/pixel-buffer.js';
import {
  APPROVED_BACKLOG_V2_GATE,
  APPROVED_BACKLOG_V2_SOURCE_ENTRIES,
  APPROVED_BACKLOG_V2_SOURCE_GATES,
} from '../engine/enemy-expansion-approved-backlog-v2.js';
import { captureEnemyExpansionFrame } from './enemy-expansion-review-pixels.mjs';

const errors = [];
const EXPECTED_FRAME_DIGEST = 'e7d8b93e78058ca43b3ba584108bfa9906f33581aed43dbf6ec6819101743f93';

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

check(APPROVED_BACKLOG_V2_GATE.status === 'authorized', 'approved backlog v2 lacks explicit authorization');
check(APPROVED_BACKLOG_V2_GATE.integratedVariants === 35, 'approved backlog v2 scope must remain exactly 35 variants');
check(APPROVED_BACKLOG_V2_GATE.authorizationEvidence.includes('lets do it'), 'approved backlog v2 authorization evidence drifted');
check(APPROVED_BACKLOG_V2_SOURCE_GATES.length === 35, 'approved backlog v2 must cite exactly 35 source gates');
check(APPROVED_BACKLOG_V2_SOURCE_GATES.every(({ status }) => status === 'approved'), 'every integrated source gate must be approved');
check(new Set(APPROVED_BACKLOG_V2_SOURCE_GATES.map(({ id }) => id)).size === 35, 'approved source gate ids must be unique');
check(APPROVED_BACKLOG_V2_SOURCE_ENTRIES.length === 35, 'approved backlog v2 must map exactly 35 source suites');
check(new Set(APPROVED_BACKLOG_V2_SOURCE_ENTRIES.map(({ family, variant }) => `${family}/${variant}`)).size === 35, 'approved source suites must be unique');

const legacyVariants = engine.ENEMIES.reduce((total, family) => total + family.variants.length, 0);
const expansionVariants = engine.ENEMY_EXPANSION_REGISTRY.families.reduce((total, family) => total + family.variants.length, 0);
const publicVariants = engine.PUBLIC_ENEMIES.reduce((total, family) => total + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && legacyVariants === 202, 'locked legacy catalog must remain 57/202');
check(engine.ENEMY_EXPANSION_REGISTRY.families.length === 35 && expansionVariants === 92, 'approved expansion registry must be 35/92');
check(engine.PUBLIC_ENEMIES.length === 92 && publicVariants === 294, 'public assembler catalog must be 92/294');
check(engine.PUBLIC_ENEMIES.slice(0, 57).every((family, index) => family === engine.ENEMIES[index]), 'legacy public catalog order or identity changed');
check(engine.ENEMY_EXPANSION_CONSUMER_REGISTRY === engine.ENEMY_EXPANSION_REGISTRY, 'assembler consumers must reuse the exact approved registry');

const frameRecords = [];
let parityFrames = 0;
let presentationTriplets = 0;
for (const { family, variant, registry } of APPROVED_BACKLOG_V2_SOURCE_ENTRIES) {
  const spec = { kind: 'enemy', family, variant };
  const publicFamily = engine.PUBLIC_ENEMIES.find(({ id }) => id === family);
  check(publicFamily?.variants.some(({ id }) => id === variant), `${family}/${variant} is missing from the public catalog`);
  check(engine.isPublicEnemyExpansionSpec(spec), `${family}/${variant} must route through the public expansion dispatcher`);

  for (const direction of engine.DIRS) for (const animation of engine.ANIMS) for (let frame = 0; frame < animation.frames; frame++) {
    const prefix = `${family}/${variant}/${direction}/${animation.id}/${frame}`;
    const approved = captureEnemyExpansionFrame(registry, spec, direction, animation.id, frame, engine.SIZE);
    const none = capturePixels((context) => engine.drawAssembledSprite(context, spec, direction, animation.id, frame, {
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
    const frameDigest = digest(none);
    check(frameDigest === approved.digest, `${prefix} differs from its approved private source`);
    check(addedOutlinePixels(approved.pixels, completeB) > 0, `${prefix} Complete B must add contour without changing source pixels`);
    check(sameGeometry(approved.pixels, form), `${prefix} Form shading must preserve approved geometry`);
    check(form.every((color) => color === null || /^#[0-9a-f]{6}$/.test(color)), `${prefix} Form shading emitted a non-canonical color`);
    frameRecords.push([family, variant, direction, animation.id, frame, frameDigest]);
    parityFrames++;
    presentationTriplets++;
  }
}

check(parityFrames === 2800, `approved backlog v2 must validate 2,800 frames, got ${parityFrames}`);
check(presentationTriplets === 2800, `approved backlog v2 must validate 2,800 presentation triplets, got ${presentationTriplets}`);

const kitCounts = completeCharacterKitCounts();
check(kitCounts.componentPngs === 1912, 'component PNG count changed during enemy-only integration');
check(kitCounts.enemyFamilies === 92 && kitCounts.enemySheets === 294, 'Complete Kit enemy counts must be 92/294');
check(kitCounts.effectSheets === 24, 'effect sheets changed during enemy-only integration');
check(kitCounts.totalPngs === 2231, 'Complete Kit total must include the 35 newly public enemy sheets');

const integratedFrameDigest = digest(frameRecords);
if (EXPECTED_FRAME_DIGEST) check(integratedFrameDigest === EXPECTED_FRAME_DIGEST, 'integrated 2,800-frame digest drifted');

if (errors.length) {
  console.error('Approved enemy assembler integration v2 gate failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Approved enemy assembler integration v2 gate passed.');
console.log('- Public catalog: 92 families / 294 variants; legacy remains 57/202');
console.log('- Integrated parity: 35 complete suites / 2,800 exact approved frames');
console.log(`- Assembler presentation: ${presentationTriplets} None / Complete B / Form frame triplets`);
console.log('- Scope exclusions preserved: incomplete candidates, prototypes, bosses, effects, fixtures, and source pixels');
console.log(`- Integrated frame digest: ${integratedFrameDigest}`);
