import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import {
  EN_E03_SATYR_IDLE_GATE,
  EN_E03_SATYR_IDLE_REGISTRY,
} from '../engine/enemy-expansion-en-e03-satyr-idle.js';
import {
  EN_E03_SATYR_WALK_GATE,
  EN_E03_SATYR_WALK_REGISTRY,
} from '../engine/enemy-expansion-en-e03-satyr-walk.js';
import {
  EN_E03_SATYR_ATTACK_FAMILY,
  EN_E03_SATYR_ATTACK_GATE,
  EN_E03_SATYR_ATTACK_REGISTRY,
} from '../engine/enemy-expansion-en-e03-satyr-attack.js';
import { EN_E03_CENTAUR_ATTACK_GATE } from '../engine/enemy-expansion-en-e03-centaur-attack.js';
import { EN_E03_BRIAR_REVELER_CALIBRATION_DATA } from '../engine/enemy-expansion-en-e03-satyr-calibration.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import {
  captureEnemyExpansionFrame,
  mirrorPixels,
} from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

function rejects(run, messageFragment, label) {
  try {
    run();
    errors.push(label + ' was not rejected.');
  } catch (error) {
    check(String(error.message).includes(messageFragment), label + ' returned the wrong error: ' + error.message);
  }
}

function componentCount(pixels) {
  const visited = new Uint8Array(pixels.length);
  let count = 0;
  for (let start = 0; start < pixels.length; start++) {
    if (pixels[start] === null || visited[start]) continue;
    count++;
    const queue = [start];
    visited[start] = 1;
    while (queue.length) {
      const index = queue.pop();
      const x = index % engine.SIZE;
      const y = Math.floor(index / engine.SIZE);
      for (const [dx, dy] of [[0, -1], [-1, 0], [1, 0], [0, 1]]) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= engine.SIZE || ny >= engine.SIZE) continue;
        const next = (ny * engine.SIZE) + nx;
        if (visited[next] || pixels[next] === null) continue;
        visited[next] = 1;
        queue.push(next);
      }
    }
  }
  return count;
}

function opaquePixelsAtRow(alpha, row) {
  let opaque = 0;
  for (let x = 0; x < engine.SIZE; x++) {
    if (alpha[(row * engine.SIZE) + x] !== 0) opaque++;
  }
  return opaque;
}

function coordinateSignature(captured, acceptedColors, minY = 0, maxY = engine.SIZE - 1) {
  const coordinates = [];
  for (let y = minY; y <= maxY; y++) for (let x = 0; x < engine.SIZE; x++) {
    const color = captured.pixels[(y * engine.SIZE) + x];
    if (acceptedColors.has(color)) coordinates.push(x + ',' + y + ':' + color);
  }
  return coordinates.join('|');
}

function regionSignature(captured, minX, maxX, minY, maxY) {
  const pixels = [];
  for (let y = minY; y <= maxY; y++) for (let x = minX; x <= maxX; x++) {
    pixels.push(captured.pixels[(y * engine.SIZE) + x]);
  }
  return JSON.stringify(pixels);
}

function footAnchorCoordinates(direction) {
  if (direction === 'down' || direction === 'up') return [[6, 22], [8, 22], [15, 22], [17, 22]];
  if (direction === 'right') return [[8, 22], [10, 22], [16, 22], [18, 22]];
  return footAnchorCoordinates('right').map(([x, y]) => [engine.SIZE - 1 - x, y]);
}

function footAnchorSignature(captured, direction) {
  return JSON.stringify(footAnchorCoordinates(direction).map(([x, y]) => captured.pixels[(y * engine.SIZE) + x]));
}

check(EN_E03_CENTAUR_ATTACK_GATE.status === 'approved', 'the preceding Steppe Hunter Attack gate must remain visually approved');
check(EN_E03_CENTAUR_ATTACK_GATE.approvedOn === '2026-08-07', 'the Steppe Hunter Attack gate must retain its approval date');
check(EN_E03_CENTAUR_ATTACK_GATE.approvalEvidence === 'Designer reviewed the exact labeled four-direction raw and Complete B + Form Steppe Hunter Attack animations and said: Approved.', 'the Steppe Hunter Attack gate must retain exact approval evidence');
check(EN_E03_SATYR_IDLE_GATE.status === 'approved', 'the Briar Reveler Idle baseline must remain visually approved');
check(EN_E03_SATYR_WALK_GATE.status === 'approved', 'the Briar Reveler Walk baseline must remain visually approved');
check(EN_E03_SATYR_ATTACK_GATE.status === 'approved', 'the Briar Reveler Attack gate must remain visually approved');
check(EN_E03_SATYR_ATTACK_GATE.authorizedOn === '2026-08-07', 'the Briar Reveler Attack gate must record its authorization date');
check(EN_E03_SATYR_ATTACK_GATE.authorizationEvidence === 'Designer approved the exact Steppe Hunter Attack lane, published it under the standing approval rule, and then said: lets keep going.', 'the Briar Reveler Attack gate must retain exact authorization evidence');
check(EN_E03_SATYR_ATTACK_GATE.approvedOn === '2026-08-07', 'the Briar Reveler Attack gate must retain its approval date');
check(EN_E03_SATYR_ATTACK_GATE.approvalEvidence === 'Designer reviewed both exact labeled all-four-direction raw and Complete B + Form Briar Reveler Attack animations and said: very good! approved.', 'the Briar Reveler Attack gate must retain exact approval evidence');
check(EN_E03_SATYR_ATTACK_GATE.precedingApproval.gateId === EN_E03_CENTAUR_ATTACK_GATE.id, 'the Attack gate must identify the preceding Steppe Hunter Attack approval');
check(EN_E03_SATYR_ATTACK_GATE.precedingApproval.artifactSha256 === EN_E03_CENTAUR_ATTACK_GATE.artifactSha256, 'the preceding Steppe Hunter raw hash must remain frozen');
check(EN_E03_SATYR_ATTACK_GATE.precedingApproval.assembledArtifactSha256 === EN_E03_CENTAUR_ATTACK_GATE.assembledArtifactSha256, 'the preceding Steppe Hunter assembled hash must remain frozen');
check(EN_E03_SATYR_ATTACK_GATE.precedingApproval.candidateFrameDigest === EN_E03_CENTAUR_ATTACK_GATE.candidateFrameDigest, 'the preceding Steppe Hunter frame digest must remain frozen');
check(EN_E03_SATYR_ATTACK_GATE.approvedIdle.gateId === EN_E03_SATYR_IDLE_GATE.id, 'the Attack gate must identify the approved Briar Reveler Idle baseline');
check(EN_E03_SATYR_ATTACK_GATE.approvedIdle.frameDigest === EN_E03_SATYR_IDLE_GATE.candidateFrameDigest, 'the Attack gate must retain the approved Idle digest');
check(EN_E03_SATYR_ATTACK_GATE.approvedWalk.gateId === EN_E03_SATYR_WALK_GATE.id, 'the Attack gate must identify the approved Briar Reveler Walk baseline');
check(EN_E03_SATYR_ATTACK_GATE.approvedWalk.artifactSha256 === EN_E03_SATYR_WALK_GATE.artifactSha256, 'the Attack gate must retain the approved raw Walk hash');
check(EN_E03_SATYR_ATTACK_GATE.approvedWalk.assembledArtifactSha256 === EN_E03_SATYR_WALK_GATE.assembledArtifactSha256, 'the Attack gate must retain the approved assembled Walk hash');
check(EN_E03_SATYR_ATTACK_GATE.approvedWalk.frameDigest === EN_E03_SATYR_WALK_GATE.candidateFrameDigest, 'the Attack gate must retain the approved Walk digest');
check(EN_E03_SATYR_ATTACK_GATE.artifactSha256 === 'ac7ca315dfdd65b378c5db42623bf4013b961c0ebf1f22c0045803f14dcb9abb', 'the raw Briar Reveler Attack review hash must remain frozen');
check(EN_E03_SATYR_ATTACK_GATE.assembledArtifactSha256 === '4d97b61111bcf293d024a01201677fb10ba54bdf496fa0264df5abb78f5a54ab', 'the assembled Briar Reveler Attack review hash must remain frozen');
check(EN_E03_SATYR_ATTACK_GATE.reviewAnimations.raw.artifact.endsWith('en-e03-briar-reveler-attack-four-directions-labeled-v1.gif') && EN_E03_SATYR_ATTACK_GATE.reviewAnimations.raw.sha256 === '1625c6db6759cb4a20ea4521ef1a4b04199813f2dc75e2e0db2fa5e4a54241d9', 'the labeled raw all-four-direction animation must remain frozen');
check(EN_E03_SATYR_ATTACK_GATE.reviewAnimations.completeBForm.artifact.endsWith('en-e03-briar-reveler-attack-four-directions-labeled-complete-b-form-v1.gif') && EN_E03_SATYR_ATTACK_GATE.reviewAnimations.completeBForm.sha256 === '5efb83b879f1cbe130075db722f9d26762180b4e00945941465d0dbb8304886a', 'the labeled Complete B + Form all-four-direction animation must remain frozen');
check(EN_E03_SATYR_ATTACK_GATE.reviewAnimations.raw.width === 192 && EN_E03_SATYR_ATTACK_GATE.reviewAnimations.raw.height === 224 && EN_E03_SATYR_ATTACK_GATE.reviewAnimations.raw.frames === 4 && EN_E03_SATYR_ATTACK_GATE.reviewAnimations.raw.durationMs === 480, 'the labeled raw animation geometry/timing must remain frozen');
check(EN_E03_SATYR_ATTACK_GATE.reviewAnimations.completeBForm.width === 192 && EN_E03_SATYR_ATTACK_GATE.reviewAnimations.completeBForm.height === 224 && EN_E03_SATYR_ATTACK_GATE.reviewAnimations.completeBForm.frames === 4 && EN_E03_SATYR_ATTACK_GATE.reviewAnimations.completeBForm.durationMs === 480, 'the labeled Complete B + Form animation geometry/timing must remain frozen');
check(EN_E03_SATYR_ATTACK_GATE.candidateFrameDigest === '9545779f0d39c16f1fedaf581ad1f5dee8b6ce0b79d35ce23a66e81375c32270', 'the 16-frame Briar Reveler Attack digest must remain frozen');
check(EN_E03_SATYR_ATTACK_GATE.scope.includes('A1-A4 across Down, Left, Right, and Up'), 'the Attack gate must name its exact four-direction/four-frame scope');
check(EN_E03_SATYR_ATTACK_GATE.motion.includes('hips, upper body, tail, hands, and staff') && EN_E03_SATYR_ATTACK_GATE.motion.includes('split hooves stay planted'), 'the Attack gate must require whole-body motion over planted split hooves');
check(EN_E03_SATYR_ATTACK_GATE.exclusions.includes('Idle pixel changes') && EN_E03_SATYR_ATTACK_GATE.exclusions.includes('Walk pixel changes'), 'the Attack gate must protect approved Idle and Walk pixels');
check(EN_E03_SATYR_ATTACK_GATE.exclusions.includes('Giant changes') && EN_E03_SATYR_ATTACK_GATE.exclusions.includes('Centaur changes'), 'the Attack gate must protect the other EN-E03 families');
check(EN_E03_SATYR_ATTACK_GATE.exclusions.includes('Hurt') && EN_E03_SATYR_ATTACK_GATE.exclusions.includes('registration'), 'the Attack gate must exclude later motion and public routing');
check(EN_E03_SATYR_ATTACK_GATE.nextGate.includes('Visual approval is complete') && EN_E03_SATYR_ATTACK_GATE.nextGate.includes('no later EN-E03 work is authorized yet'), 'the approved gate must stop before any later EN-E03 work');
check(Object.isFrozen(EN_E03_SATYR_ATTACK_GATE) && Object.isFrozen(EN_E03_SATYR_ATTACK_GATE.reviewAnimations) && Object.isFrozen(EN_E03_SATYR_ATTACK_GATE.reviewAnimations.raw) && Object.isFrozen(EN_E03_SATYR_ATTACK_GATE.reviewAnimations.completeBForm) && Object.isFrozen(EN_E03_SATYR_ATTACK_GATE.exclusions), 'the Attack gate must be deeply immutable');

check(EN_E03_SATYR_ATTACK_REGISTRY.families.length === 1, 'the Attack registry must contain exactly one family');
check(EN_E03_SATYR_ATTACK_REGISTRY.families[0].id === 'satyr', 'the Attack registry must contain only Satyr');
check(EN_E03_SATYR_ATTACK_REGISTRY.families[0].variants.length === 1, 'the Attack registry must contain exactly one variant');
check(EN_E03_SATYR_ATTACK_REGISTRY.families[0].variants[0].id === 'briar-reveler', 'the Attack registry must contain only Briar Reveler');
check(EN_E03_SATYR_ATTACK_REGISTRY.publicFamilies.length === 0 && EN_E03_SATYR_ATTACK_REGISTRY.approvedFamilies.length === 0, 'the Attack candidate must remain internal and outside registry approval/public routing');
check(EN_E03_SATYR_ATTACK_REGISTRY.renderers[0].chassis === 'humanoid-v1', 'the Attack renderer must retain the approved roster chassis');
check(Object.isFrozen(EN_E03_SATYR_ATTACK_REGISTRY) && Object.isFrozen(EN_E03_SATYR_ATTACK_FAMILY), 'the Attack registry and family must be immutable');

check(engine.PUBLIC_ENEMIES.length === 67, 'the Attack candidate must not alter the 67-family public catalog');
check(engine.ENEMIES.length === 57, 'the Attack candidate must not alter the 57-family legacy catalog');
check(!engine.PUBLIC_ENEMIES.some((family) => family.id === 'satyr'), 'Satyr must remain absent from public consumers');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!facadeSource.includes('enemy-expansion-en-e03-satyr-attack'), 'the public facade must not import the Satyr Attack candidate module');
check(!facadeSource.includes('EN_E03_SATYR_ATTACK'), 'the public facade must not expose Satyr Attack candidate symbols');

const spec = { kind: 'enemy', family: 'satyr', variant: 'briar-reveler' };
const delegatedIdleRecords = [];
const delegatedWalkRecords = [];
const attackFrames = new Map();
const attackRecords = [];
let completeOutlinePixels = 0;
let formChangedPixels = 0;
let plantedContactChecks = 0;

for (const direction of engine.DIRS) for (let frame = 0; frame < 2; frame++) {
  const approved = captureEnemyExpansionFrame(EN_E03_SATYR_IDLE_REGISTRY, spec, direction, 'idle', frame, engine.SIZE);
  const delegated = captureEnemyExpansionFrame(EN_E03_SATYR_ATTACK_REGISTRY, spec, direction, 'idle', frame, engine.SIZE);
  check(JSON.stringify(delegated.pixels) === JSON.stringify(approved.pixels), direction + '/Idle F' + (frame + 1) + ' must delegate to the exact approved baseline');
  check(delegated.digest === approved.digest && delegated.alphaDigest === approved.alphaDigest, direction + '/Idle F' + (frame + 1) + ' hashes must remain exact');
  delegatedIdleRecords.push({
    family: 'satyr', variant: 'briar-reveler', direction, animation: 'idle', frame,
    digest: delegated.digest, alphaDigest: delegated.alphaDigest,
    opaquePixels: delegated.opaquePixels, bounds: delegated.bounds,
  });
}

for (const direction of engine.DIRS) for (let frame = 0; frame < 4; frame++) {
  const approved = captureEnemyExpansionFrame(EN_E03_SATYR_WALK_REGISTRY, spec, direction, 'walk', frame, engine.SIZE);
  const delegated = captureEnemyExpansionFrame(EN_E03_SATYR_ATTACK_REGISTRY, spec, direction, 'walk', frame, engine.SIZE);
  check(JSON.stringify(delegated.pixels) === JSON.stringify(approved.pixels), direction + '/Walk W' + (frame + 1) + ' must delegate to the exact approved baseline');
  check(delegated.digest === approved.digest && delegated.alphaDigest === approved.alphaDigest, direction + '/Walk W' + (frame + 1) + ' hashes must remain exact');
  delegatedWalkRecords.push({
    family: 'satyr', variant: 'briar-reveler', direction, animation: 'walk', frame,
    digest: delegated.digest, alphaDigest: delegated.alphaDigest,
    opaquePixels: delegated.opaquePixels, bounds: delegated.bounds,
  });
}

for (const direction of engine.DIRS) for (let frame = 0; frame < 4; frame++) {
  const captured = captureEnemyExpansionFrame(EN_E03_SATYR_ATTACK_REGISTRY, spec, direction, 'attack', frame, engine.SIZE);
  attackFrames.set(direction + '/' + frame, captured);
  check(captured.outOfBoundsWrites.length === 0, direction + '/A' + (frame + 1) + ' wrote outside the 24x24 cell');
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22, direction + '/A' + (frame + 1) + ' must preserve a one-cell margin');
  check(componentCount(captured.pixels) === 1, direction + '/A' + (frame + 1) + ' must have one connected body-and-staff silhouette');
  check(captured.alpha.every((value) => value === 0 || value === 255), direction + '/A' + (frame + 1) + ' must use binary alpha');
  check(opaquePixelsAtRow(captured.alpha, 22) >= 4, direction + '/A' + (frame + 1) + ' must retain four split-hoof ground contacts');
  check(footAnchorSignature(captured, direction).includes('#'), direction + '/A' + (frame + 1) + ' must retain all expected hoof anchors');
  plantedContactChecks++;
  const rendererData = EN_E03_SATYR_ATTACK_REGISTRY.families[0].variants[0].rendererData;
  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, rendererData);
  completeOutlinePixels += presentation.complete.filter((color, index) => color !== null && captured.pixels[index] === null).length;
  formChangedPixels += presentation.form.filter((color, index) => captured.pixels[index] !== null && color !== captured.pixels[index]).length;
  attackRecords.push({
    family: 'satyr', variant: 'briar-reveler', direction, animation: 'attack', frame,
    digest: captured.digest, alphaDigest: captured.alphaDigest,
    opaquePixels: captured.opaquePixels, bounds: captured.bounds,
  });
}

check(createHash('sha256').update(JSON.stringify(delegatedIdleRecords)).digest('hex') === EN_E03_SATYR_IDLE_GATE.candidateFrameDigest, 'the delegated approved Idle records drifted');
check(createHash('sha256').update(JSON.stringify(delegatedWalkRecords)).digest('hex') === EN_E03_SATYR_WALK_GATE.candidateFrameDigest, 'the delegated approved Walk records drifted');

const palette = EN_E03_BRIAR_REVELER_CALIBRATION_DATA;
const bodyColors = new Set([...palette.actor.palette.skin, ...palette.actor.palette.outfit]);
const staffColors = new Set([...palette.satyr.wood, ...palette.satyr.horn, ...palette.satyr.accent]);
const lowerBodyColors = new Set([...palette.satyr.hide, ...palette.satyr.hoof]);
for (const direction of engine.DIRS) {
  const phases = [0, 1, 2, 3].map((frame) => attackFrames.get(direction + '/' + frame));
  check(new Set(phases.map((captured) => captured.digest)).size === 4, direction + ' Attack must retain four distinct color poses');
  check(new Set(phases.map((captured) => captured.alphaDigest)).size === 4, direction + ' Attack must retain four distinct silhouettes');
  check(new Set(phases.map((captured) => coordinateSignature(captured, bodyColors, 6, 18))).size >= 3, direction + ' Attack must move torso-and-hip colors through at least three phases');
  check(new Set(phases.map((captured) => coordinateSignature(captured, staffColors))).size === 4, direction + ' Attack must carry the crooked staff through four distinct poses');
  check(new Set(phases.map((captured) => coordinateSignature(captured, lowerBodyColors, 13, 22))).size >= 3, direction + ' Attack must animate hocks and tail through at least three phases');
  check(new Set(phases.map((captured) => footAnchorSignature(captured, direction))).size === 1, direction + ' Attack must keep all four split-hoof anchors byte-identical across the four phases');
}

for (let frame = 0; frame < 4; frame++) {
  const left = attackFrames.get('left/' + frame);
  const right = attackFrames.get('right/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels, engine.SIZE)), 'the left and right Briar Reveler A' + (frame + 1) + ' profiles must remain exact mirrors');
}

for (const direction of ['down', 'up']) {
  const phases = [0, 1, 2, 3].map((frame) => attackFrames.get(direction + '/' + frame));
  check(new Set(phases.map((captured) => regionSignature(captured, 5, 18, 14, 20))).size >= 3, direction + ' Attack must carry motion through hips and upper legs in at least three phases');
}

for (let frame = 0; frame < 4; frame++) {
  const down = attackFrames.get('down/' + frame);
  const up = attackFrames.get('up/' + frame);
  check(down.alphaDigest !== up.alphaDigest, 'A' + (frame + 1) + ' must retain distinct front and rear depth silhouettes');
}

check(new Set(attackRecords.map((record) => record.alphaDigest)).size === 16, 'the 16 Attack frames must retain 16 distinct directional silhouettes');
check(createHash('sha256').update(JSON.stringify(attackRecords)).digest('hex') === EN_E03_SATYR_ATTACK_GATE.candidateFrameDigest, 'the 16-frame Briar Reveler Attack digest drifted');
check(completeOutlinePixels > 0, 'Complete B must add exterior outline pixels');
check(formChangedPixels > 0, 'Form must shade source pixels');

rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_SATYR_ATTACK_REGISTRY, spec, 'down', 'hurt', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'authorizes only approved Idle and Walk plus four Attack frames',
  'Hurt rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_SATYR_ATTACK_REGISTRY, spec, 'down', 'cast', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'authorizes only approved Idle and Walk plus four Attack frames',
  'Cast rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_SATYR_ATTACK_REGISTRY, spec, 'down', 'death', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'authorizes only approved Idle and Walk plus four Attack frames',
  'Death rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_SATYR_ATTACK_REGISTRY, { kind: 'enemy', family: 'giant', variant: 'hill-breaker' }, 'down', 'attack', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'Expansion family giant is not implemented',
  'Giant rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_SATYR_ATTACK_REGISTRY, { kind: 'enemy', family: 'centaur', variant: 'steppe-hunter' }, 'down', 'attack', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'Expansion family centaur is not implemented',
  'Centaur rendering',
);

if (errors.length) {
  console.error('EN-E03 Briar Reveler Attack validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E03 Briar Reveler four-frame Attack validation passed.');
console.log('- Candidate scope: 1 family / 1 variant / 16 Attack frames');
console.log('- Approved Idle frames preserved: ' + delegatedIdleRecords.length + ' / 8');
console.log('- Approved Walk frames preserved: ' + delegatedWalkRecords.length + ' / 16');
console.log('- Connected hard-alpha body-and-staff silhouettes: ' + attackRecords.length + ' / 16');
console.log('- Planted split-hoof contact checks: ' + plantedContactChecks + ' / 16');
console.log('- Distinct Attack silhouettes: ' + new Set(attackRecords.map((record) => record.alphaDigest)).size + ' / 16');
console.log('- Complete B added pixels: ' + completeOutlinePixels);
console.log('- Form-shaded source pixels: ' + formChangedPixels);
console.log('- Public EN-E03 families: ' + EN_E03_SATYR_ATTACK_REGISTRY.publicFamilies.length);
console.log('- Candidate frame digest: ' + EN_E03_SATYR_ATTACK_GATE.candidateFrameDigest);
