import { createHash } from 'node:crypto';
import * as engine from '../sprite-engine.js';
import {
  ENEMY_EXPANSION_PRE_REPAIR_REGISTRY,
  ENEMY_EXPANSION_REPAIR_APPROVED_REGISTRY,
  ENEMY_EXPANSION_REPAIR_CANDIDATE_GATE,
  ENEMY_EXPANSION_REPAIR_CANDIDATE_REGISTRY,
} from '../engine/enemy-expansion-repairs.js';
import { captureEnemyExpansionFrame } from './enemy-expansion-review-pixels.mjs';

const errors = [];
const affectedFamilies = [
  'catfolk',
  'desert-raider',
  'fallen-knight',
  'fanatic-monk',
  'goatfolk',
  'necromancer',
  'witch',
];
const changedVariants = new Set([
  'catfolk/alley-prowler',
  'catfolk/moonclaw-duelist',
  'catfolk/pride-champion',
  'desert-raider/dune-reaver',
  'desert-raider/sandbow-stalker',
  'desert-raider/sunscar-captain',
  'fallen-knight/shieldbearer',
  'fanatic-monk/ash-disciple',
  'fanatic-monk/bell-abbot',
  'goatfolk/crag-skirmisher',
  'goatfolk/horn-seer',
  'goatfolk/ramguard-chieftain',
  'necromancer/bone-caller',
  'necromancer/grave-binder',
  'necromancer/ossuary-master',
  'witch/cauldron-brewer',
  'witch/familiar-keeper',
  'witch/hexer',
]);

function check(condition, message) {
  if (!condition) errors.push(message);
}

function capture(registry, family, variant, direction, animation, frame) {
  return captureEnemyExpansionFrame(
    registry,
    { kind: 'enemy', family, variant },
    direction,
    animation,
    frame,
    engine.SIZE,
  );
}

function pixelAt(rendered, x, y) {
  return rendered.pixels[(y * engine.SIZE) + x];
}

function checkOpaque(rendered, coordinates, prefix) {
  for (const [x, y] of coordinates) {
    check(pixelAt(rendered, x, y) !== null, prefix + ' still exposes checkerboard at ' + x + ',' + y);
  }
}

function bobFor(animation, frame) {
  if (animation === 'idle') return frame === 1 ? 1 : 0;
  if (animation === 'walk') return frame === 1 || frame === 3 ? 1 : 0;
  return 0;
}

function shifted(coordinates, yOffset) {
  return coordinates.map(([x, y]) => [x, y + yOffset]);
}

function footAlpha(rendered) {
  const start = 18 * engine.SIZE;
  const end = 23 * engine.SIZE;
  return Array.from(rendered.alpha.slice(start, end)).join('');
}

check(ENEMY_EXPANSION_REPAIR_CANDIDATE_GATE.status === 'approved', 'repair gate must record explicit designer approval');
check(ENEMY_EXPANSION_REPAIR_CANDIDATE_GATE.authorizedOn === '2026-08-03', 'repair gate must record the authorization date');
check(ENEMY_EXPANSION_REPAIR_CANDIDATE_GATE.approvedOn === '2026-08-03', 'repair gate must record the approval date');
check(JSON.stringify(ENEMY_EXPANSION_REPAIR_CANDIDATE_GATE.affectedFamilies) === JSON.stringify(affectedFamilies), 'repair gate affected-family scope drifted');
check(Object.isFrozen(ENEMY_EXPANSION_REPAIR_CANDIDATE_GATE), 'repair gate must be immutable');
check(Object.isFrozen(ENEMY_EXPANSION_REPAIR_CANDIDATE_GATE.affectedFamilies), 'repair gate affected-family scope must be deeply immutable');
check(ENEMY_EXPANSION_REPAIR_APPROVED_REGISTRY === ENEMY_EXPANSION_REPAIR_CANDIDATE_REGISTRY, 'approved repair must alias the exact reviewed candidate object');
check(engine.ENEMY_EXPANSION_REGISTRY !== ENEMY_EXPANSION_REPAIR_APPROVED_REGISTRY, 'stable registry must compose EN-E04 without rewriting the exact approved repair object');
check(engine.ENEMY_EXPANSION_CONSUMER_REGISTRY === engine.ENEMY_EXPANSION_REGISTRY, 'generic consumers must use the exact stable registry after EN-E04 integration');
check(engine.ENEMY_EXPANSION_REGISTRY !== ENEMY_EXPANSION_PRE_REPAIR_REGISTRY, 'approved repair must remain distinct from pre-repair comparison evidence');
check(Object.isFrozen(ENEMY_EXPANSION_REPAIR_CANDIDATE_REGISTRY), 'repair registry must be immutable');
check(ENEMY_EXPANSION_REPAIR_CANDIDATE_REGISTRY.publicFamilies.length === 10, 'repair registry must retain all ten approved families');

let actualChangedVariants = 0;
for (const stableFamily of ENEMY_EXPANSION_PRE_REPAIR_REGISTRY.families) {
  const repairFamily = ENEMY_EXPANSION_REPAIR_CANDIDATE_REGISTRY.families.find((family) => family.id === stableFamily.id);
  check(Boolean(repairFamily), stableFamily.id + ' is missing from the repair registry');
  if (!repairFamily) continue;
  if (!affectedFamilies.includes(stableFamily.id)) {
    check(JSON.stringify(repairFamily) === JSON.stringify(stableFamily), stableFamily.id + ' family metadata changed outside repair scope');
  }
  for (const stableVariant of stableFamily.variants) {
    const repairVariant = repairFamily.variants.find((variant) => variant.id === stableVariant.id);
    check(Boolean(repairVariant), stableFamily.id + '/' + stableVariant.id + ' is missing from the repair registry');
    if (!repairVariant) continue;
    const key = stableFamily.id + '/' + stableVariant.id;
    const changed = JSON.stringify(stableVariant.rendererData) !== JSON.stringify(repairVariant.rendererData);
    check(changed === changedVariants.has(key), key + ' changed outside the authorized renderer-data scope');
    if (changed) actualChangedVariants++;
  }
}
check(actualChangedVariants === changedVariants.size, 'repair registry must change exactly 18 variant renderer records');

for (const familyId of ['alchemist', 'pirate', 'plague-doctor']) {
  const stableFamily = ENEMY_EXPANSION_PRE_REPAIR_REGISTRY.families.find((family) => family.id === familyId);
  for (const variant of stableFamily.variants) {
    for (const direction of engine.DIRS) for (const animation of engine.ANIMS) {
      for (let frame = 0; frame < animation.frames; frame++) {
        const stable = capture(ENEMY_EXPANSION_PRE_REPAIR_REGISTRY, familyId, variant.id, direction, animation.id, frame);
        const repaired = capture(ENEMY_EXPANSION_REPAIR_CANDIDATE_REGISTRY, familyId, variant.id, direction, animation.id, frame);
        check(stable.digest === repaired.digest, familyId + '/' + variant.id + '/' + direction + '/' + animation.id + '/' + frame + ' drifted outside repair scope');
      }
    }
  }
}

const frameRecords = [];
let validatedFrames = 0;
for (const familyId of affectedFamilies) {
  const family = ENEMY_EXPANSION_REPAIR_CANDIDATE_REGISTRY.families.find((entry) => entry.id === familyId);
  for (const variant of family.variants) {
    for (const direction of engine.DIRS) for (const animation of engine.ANIMS) {
      for (let frame = 0; frame < animation.frames; frame++) {
        const rendered = capture(ENEMY_EXPANSION_REPAIR_CANDIDATE_REGISTRY, familyId, variant.id, direction, animation.id, frame);
        const repeated = capture(ENEMY_EXPANSION_REPAIR_CANDIDATE_REGISTRY, familyId, variant.id, direction, animation.id, frame);
        const prefix = familyId + '/' + variant.id + '/' + direction + '/' + animation.id + '/' + frame;
        check(rendered.digest === repeated.digest, prefix + ' is nondeterministic');
        check(rendered.outOfBoundsWrites.length === 0, prefix + ' draws outside the 24x24 cell');
        check(rendered.opaquePixels > 0, prefix + ' is empty');
        check(rendered.bounds && rendered.bounds.minX >= 1 && rendered.bounds.maxX <= 22 && rendered.bounds.minY >= 1 && rendered.bounds.maxY <= 22, prefix + ' violates the one-pixel canvas margin');
        check([...rendered.alpha].every((alpha) => alpha === 0 || alpha === 255), prefix + ' uses non-binary alpha');
        frameRecords.push({ family: familyId, variant: variant.id, direction, animation: animation.id, frame, digest: rendered.digest, alphaDigest: rendered.alphaDigest });
        validatedFrames++;
      }
    }
  }
}
check(validatedFrames === 1680, 'repair candidate must validate 1,680 affected-family frames');

for (const familyId of ['catfolk', 'fanatic-monk', 'goatfolk', 'necromancer', 'witch']) {
  const family = ENEMY_EXPANSION_REPAIR_CANDIDATE_REGISTRY.families.find((entry) => entry.id === familyId);
  for (const variant of family.variants) for (const direction of engine.DIRS) {
    const walk = Array.from({ length: 4 }, (_, frame) => capture(
      ENEMY_EXPANSION_REPAIR_CANDIDATE_REGISTRY,
      familyId,
      variant.id,
      direction,
      'walk',
      frame,
    ));
    const footKeys = walk.map(footAlpha);
    check(footKeys[0] !== footKeys[2], familyId + '/' + variant.id + '/' + direction + ' has no alternating stride extremes');
    check(new Set(footKeys).size >= 3, familyId + '/' + variant.id + '/' + direction + ' needs at least three distinct foot-contact silhouettes');
  }
}

for (const variant of ['alley-prowler', 'moonclaw-duelist', 'pride-champion']) {
  for (const animation of ['idle', 'walk']) {
    const frames = animation === 'idle' ? 2 : 4;
    for (let frame = 0; frame < frames; frame++) {
      const bob = bobFor(animation, frame);
      for (const [direction, coordinates] of Object.entries({
        down: [[10, 10], [11, 10], [12, 10], [13, 10]],
        right: [[14, 10], [15, 10]],
        left: [[8, 10], [9, 10]],
      })) {
        const rendered = capture(ENEMY_EXPANSION_REPAIR_CANDIDATE_REGISTRY, 'catfolk', variant, direction, animation, frame);
        const target = shifted(coordinates, bob);
        checkOpaque(rendered, target, 'catfolk/' + variant + '/' + direction + '/' + animation + '/' + frame);
        for (const [x, y] of target) {
          check(pixelAt(rendered, x, y) !== '#f4f4f4', 'catfolk/' + variant + '/' + direction + '/' + animation + '/' + frame + ' retains the white pseudo-transparent mouth pixel at ' + x + ',' + y);
        }
      }
    }
  }
}

const desertTargets = {
  down: [[16, 5], [16, 8], [16, 9], [16, 10], [13, 11], [14, 11], [15, 11], [16, 11]],
  right: [[8, 5], [13, 11], [14, 11], [15, 11], [16, 11], [16, 12], [16, 13]],
  left: [[15, 5], [7, 11], [8, 11], [9, 11], [10, 11], [7, 12], [7, 13]],
  up: [[7, 8], [7, 9], [7, 10], [7, 11], [8, 11], [9, 11], [10, 11]],
};
for (const variant of ['dune-reaver', 'sandbow-stalker', 'sunscar-captain']) {
  for (const animation of ['idle', 'walk']) {
    const frames = animation === 'idle' ? 2 : 4;
    for (let frame = 0; frame < frames; frame++) for (const direction of engine.DIRS) {
      const rendered = capture(ENEMY_EXPANSION_REPAIR_CANDIDATE_REGISTRY, 'desert-raider', variant, direction, animation, frame);
      checkOpaque(rendered, shifted(desertTargets[direction], bobFor(animation, frame)), 'desert-raider/' + variant + '/' + direction + '/' + animation + '/' + frame);
    }
  }
}

const goatTargets = {
  down: [[16, 4], [16, 6], [16, 8], [16, 9], [16, 10], [13, 11], [14, 11], [15, 11], [16, 11]],
  right: [[16, 8], [16, 9], [16, 10], [13, 11], [14, 11], [15, 11], [16, 11]],
  left: [[7, 8], [7, 9], [7, 10], [7, 11], [8, 11], [9, 11], [10, 11]],
  up: [[7, 6], [7, 8], [7, 9], [7, 10], [7, 11], [8, 11], [9, 11], [10, 11]],
};
for (const variant of ['crag-skirmisher', 'horn-seer', 'ramguard-chieftain']) {
  for (const animation of ['idle', 'walk']) {
    const frames = animation === 'idle' ? 2 : 4;
    for (let frame = 0; frame < frames; frame++) for (const direction of engine.DIRS) {
      const rendered = capture(ENEMY_EXPANSION_REPAIR_CANDIDATE_REGISTRY, 'goatfolk', variant, direction, animation, frame);
      checkOpaque(rendered, shifted(goatTargets[direction], bobFor(animation, frame)), 'goatfolk/' + variant + '/' + direction + '/' + animation + '/' + frame);
    }
  }
}

const fallenTargets = {
  down: [[8, 11], [9, 11], [10, 11]],
  right: [[13, 11], [14, 11], [15, 11], [16, 11]],
  left: [[7, 11], [8, 11], [9, 11], [10, 11]],
};
for (const animation of ['idle', 'walk']) {
  const frames = animation === 'idle' ? 2 : 4;
  for (let frame = 0; frame < frames; frame++) for (const [direction, coordinates] of Object.entries(fallenTargets)) {
    const rendered = capture(ENEMY_EXPANSION_REPAIR_CANDIDATE_REGISTRY, 'fallen-knight', 'shieldbearer', direction, animation, frame);
    checkOpaque(rendered, shifted(coordinates, bobFor(animation, frame)), 'fallen-knight/shieldbearer/' + direction + '/' + animation + '/' + frame);
  }
}

const candidateDigest = createHash('sha256').update(JSON.stringify(frameRecords)).digest('hex');

if (errors.length) {
  console.error('Enemy expansion repair validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('Enemy expansion repair validation passed.');
console.log('- Approved repair registry promoted: 10 families / 30 variants');
console.log('- Pre-repair registry preserved as immutable comparison evidence');
console.log('- Repair renderer-data changes: 18 variants across 7 affected families');
console.log('- Deterministic affected-family frames: ' + validatedFrames);
console.log('- Walk checks: alternating stride extremes with at least three foot-contact silhouettes');
console.log('- Reported checkerboard seams: filled in Catfolk, Desert Raider, Fallen Knight, and Goatfolk targets');
console.log('- Repair-candidate digest: ' + candidateDigest);
