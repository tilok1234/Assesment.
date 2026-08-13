import { createHash } from 'node:crypto';
import * as engine from '../sprite-engine.js';
import { completeCharacterKitCounts } from '../character-kit.js';
import { ENEMY_OUTLINE_PILOT_FAMILIES } from '../engine/outline-renderer.js';
import { capturePixels } from '../engine/pixel-buffer.js';
import {
  APPROVED_BACKLOG_V3_GATE,
  APPROVED_BACKLOG_V3_REGISTRY,
  APPROVED_BACKLOG_V3_SOURCE_ENTRIES,
  APPROVED_BACKLOG_V3_SOURCE_GATES,
} from '../engine/enemy-expansion-approved-backlog-v3.js';
import { captureEnemyExpansionFrame } from './enemy-expansion-review-pixels.mjs';

const errors = [];
const EXPECTED_FRAME_DIGEST = '148f3147a5afbb1857bfd8018eef647460069de05e6450ade4a45f624235045a';

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

check(APPROVED_BACKLOG_V3_GATE.status === 'authorized', 'approved backlog v3 lacks explicit authorization');
check(APPROVED_BACKLOG_V3_GATE.integratedFamilies === 8, 'approved backlog v3 scope must remain exactly 8 families');
check(APPROVED_BACKLOG_V3_GATE.integratedVariants === 22, 'approved backlog v3 scope must remain exactly 22 variants');
check(APPROVED_BACKLOG_V3_GATE.authorizationEvidence.includes('.bat'), 'approved backlog v3 launcher authorization evidence drifted');
check(APPROVED_BACKLOG_V3_GATE.authorizationEvidence.includes('.exe'), 'approved backlog v3 executable authorization evidence drifted');
check(APPROVED_BACKLOG_V3_SOURCE_GATES.length === 22, 'approved backlog v3 must cite exactly 22 source gates');
check(APPROVED_BACKLOG_V3_SOURCE_GATES.every(({ status }) => status === 'approved'), 'every integrated v3 source gate must be approved');
check(APPROVED_BACKLOG_V3_SOURCE_GATES.every(({ publicationState }) => publicationState === 'published'), 'every integrated v3 source gate must be published and reconciled');
check(new Set(APPROVED_BACKLOG_V3_SOURCE_GATES.map(({ id }) => id)).size === 22, 'approved v3 source gate ids must be unique');
check(APPROVED_BACKLOG_V3_SOURCE_ENTRIES.length === 22, 'approved backlog v3 must map exactly 22 source suites');
check(new Set(APPROVED_BACKLOG_V3_SOURCE_ENTRIES.map(({ family, variant }) => `${family}/${variant}`)).size === 22, 'approved v3 source suites must be unique');
check(APPROVED_BACKLOG_V3_REGISTRY.families.length === 8, 'approved backlog v3 registry must contain exactly 8 families');
check(APPROVED_BACKLOG_V3_REGISTRY.families.reduce((total, family) => total + family.variants.length, 0) === 22, 'approved backlog v3 registry must contain exactly 22 variants');

const expectedFamilyIds = ['cockatrice', 'hyena', 'mammoth', 'peacock', 'ram', 'raven', 'rhino', 'stag'];
check(
  JSON.stringify(APPROVED_BACKLOG_V3_REGISTRY.families.map(({ id }) => id)) === JSON.stringify(expectedFamilyIds),
  'approved backlog v3 family set or stable order drifted',
);
check(expectedFamilyIds.every((id) => !ENEMY_OUTLINE_PILOT_FAMILIES.includes(id)), 'v3 integration must not enroll any family in the outline pilot registry');

const legacyVariants = engine.ENEMIES.reduce((total, family) => total + family.variants.length, 0);
const expansionVariants = engine.ENEMY_EXPANSION_REGISTRY.families.reduce((total, family) => total + family.variants.length, 0);
const publicVariants = engine.PUBLIC_ENEMIES.reduce((total, family) => total + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && legacyVariants === 202, 'locked legacy catalog must remain 57/202');
check(engine.ENEMY_EXPANSION_REGISTRY.families.length === 43 && expansionVariants === 114, 'approved expansion registry must be 43/114');
check(engine.PUBLIC_ENEMIES.length === 100 && publicVariants === 316, 'public assembler catalog must be 100/316');
check(engine.PUBLIC_ENEMIES.slice(0, 57).every((family, index) => family === engine.ENEMIES[index]), 'legacy public catalog order or identity changed');
check(engine.ENEMY_EXPANSION_CONSUMER_REGISTRY === engine.ENEMY_EXPANSION_REGISTRY, 'assembler consumers must reuse the exact approved registry');

const frameRecords = [];
let parityFrames = 0;
let presentationTriplets = 0;
for (const { family, variant, registry } of APPROVED_BACKLOG_V3_SOURCE_ENTRIES) {
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

check(parityFrames === 1760, `approved backlog v3 must validate 1,760 frames, got ${parityFrames}`);
check(presentationTriplets === 1760, `approved backlog v3 must validate 1,760 presentation triplets, got ${presentationTriplets}`);

const kitCounts = completeCharacterKitCounts();
check(kitCounts.componentPngs === 1912, 'component PNG count changed during enemy-only v3 integration');
check(kitCounts.enemyFamilies === 100 && kitCounts.enemySheets === 316, 'Complete Kit enemy counts must be 100/316');
check(kitCounts.effectSheets === 24, 'effect sheets changed during enemy-only v3 integration');
check(kitCounts.totalPngs === 2253, 'Complete Kit total must include the 22 newly public enemy sheets');

const integratedFrameDigest = digest(frameRecords);
if (EXPECTED_FRAME_DIGEST) check(integratedFrameDigest === EXPECTED_FRAME_DIGEST, 'integrated v3 1,760-frame digest drifted');

if (errors.length) {
  console.error('Approved enemy assembler integration v3 gate failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Approved enemy assembler integration v3 gate passed.');
console.log('- Public catalog: 100 families / 316 variants; legacy remains 57/202');
console.log('- Integrated parity: 22 complete suites / 1,760 exact approved frames across 8 families');
console.log(`- Assembler presentation: ${presentationTriplets} None / Complete B / Form frame triplets`);
console.log('- Scope exclusions preserved: source pixels, outline enrollment, effects, fixtures, later roles/families, and release');
console.log(`- Integrated frame digest: ${integratedFrameDigest}`);
