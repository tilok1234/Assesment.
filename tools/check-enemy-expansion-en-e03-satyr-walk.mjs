import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import {
  EN_E03_BRIAR_REVELER_CALIBRATION_DATA,
} from '../engine/enemy-expansion-en-e03-satyr-calibration.js';
import {
  EN_E03_SATYR_IDLE_GATE,
  EN_E03_SATYR_IDLE_REGISTRY,
} from '../engine/enemy-expansion-en-e03-satyr-idle.js';
import {
  EN_E03_SATYR_WALK_FAMILY,
  EN_E03_SATYR_WALK_GATE,
  EN_E03_SATYR_WALK_REGISTRY,
} from '../engine/enemy-expansion-en-e03-satyr-walk.js';
import { EN_E03_CENTAUR_WALK_GATE } from '../engine/enemy-expansion-en-e03-centaur-walk.js';
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

function opaqueRunsAtRow(alpha, row) {
  let runs = 0;
  let occupied = false;
  for (let x = 0; x < engine.SIZE; x++) {
    const next = alpha[(row * engine.SIZE) + x] !== 0;
    if (next && !occupied) runs++;
    occupied = next;
  }
  return runs;
}

function splitHoofContactAlpha(captured) {
  const start = 18 * engine.SIZE;
  return Array.from(captured.alpha.slice(start)).join('');
}

check(EN_E03_CENTAUR_WALK_GATE.status === 'approved', 'the preceding Steppe Hunter Walk gate must remain visually approved');
check(EN_E03_CENTAUR_WALK_GATE.approvedOn === '2026-08-06', 'the Steppe Hunter Walk gate must retain its visual approval date');
check(EN_E03_CENTAUR_WALK_GATE.approvalEvidence === 'Designer reviewed the exact raw and Complete B + Form Steppe Hunter Walk animations and said: approved.', 'the Steppe Hunter Walk gate must retain exact approval evidence');
check(EN_E03_SATYR_IDLE_GATE.status === 'approved', 'the Briar Reveler two-frame Idle baseline must remain visually approved');
check(EN_E03_SATYR_WALK_GATE.status === 'approved', 'the Briar Reveler Walk gate must retain visual approval');
check(EN_E03_SATYR_WALK_GATE.authorizedOn === '2026-08-06', 'the Briar Reveler Walk gate must record its authorization date');
check(EN_E03_SATYR_WALK_GATE.authorizationEvidence === 'Designer approved the exact Steppe Hunter raw and Complete B + Form animations, then authorized the next bounded gate with: awesome lets do next.', 'the Briar Reveler Walk gate must retain exact authorization evidence');
check(EN_E03_SATYR_WALK_GATE.approvedOn === '2026-08-06', 'the Briar Reveler Walk gate must retain its visual approval date');
check(EN_E03_SATYR_WALK_GATE.approvalEvidence === 'Designer reviewed the corrected raw and Complete B + Form Briar Reveler Walk animations and said: greeat lets move on.', 'the Briar Reveler Walk gate must retain exact approval evidence');
check(EN_E03_SATYR_WALK_GATE.precedingApproval.gateId === EN_E03_CENTAUR_WALK_GATE.id, 'the Briar Reveler Walk gate must identify the preceding approved Steppe Hunter Walk');
check(EN_E03_SATYR_WALK_GATE.precedingApproval.artifactSha256 === EN_E03_CENTAUR_WALK_GATE.artifactSha256, 'the preceding raw Steppe Hunter Walk hash must remain frozen');
check(EN_E03_SATYR_WALK_GATE.precedingApproval.assembledArtifactSha256 === EN_E03_CENTAUR_WALK_GATE.assembledArtifactSha256, 'the preceding assembled Steppe Hunter Walk hash must remain frozen');
check(EN_E03_SATYR_WALK_GATE.precedingApproval.candidateFrameDigest === EN_E03_CENTAUR_WALK_GATE.candidateFrameDigest, 'the preceding Steppe Hunter Walk frame digest must remain frozen');
check(EN_E03_SATYR_WALK_GATE.approvedIdle.gateId === EN_E03_SATYR_IDLE_GATE.id, 'the Walk gate must identify the approved Briar Reveler Idle baseline');
check(EN_E03_SATYR_WALK_GATE.approvedIdle.artifactSha256 === EN_E03_SATYR_IDLE_GATE.artifactSha256, 'the Walk gate must retain the approved raw Idle hash');
check(EN_E03_SATYR_WALK_GATE.approvedIdle.assembledArtifactSha256 === EN_E03_SATYR_IDLE_GATE.assembledArtifactSha256, 'the Walk gate must retain the approved assembled Idle hash');
check(EN_E03_SATYR_WALK_GATE.approvedIdle.frameDigest === EN_E03_SATYR_IDLE_GATE.candidateFrameDigest, 'the Walk gate must retain the approved Idle frame digest');
check(EN_E03_SATYR_WALK_GATE.artifactSha256 === '8b39d575c3048bbced3ac975c5f204e3bd9ea7fb35ebf329ce0151a481a3269c', 'the raw Briar Reveler Walk review hash must remain frozen');
check(EN_E03_SATYR_WALK_GATE.assembledArtifactSha256 === 'b7e8b566bafbe87816c9f53977dcde8e109f544b488c73012015e3a72b86345f', 'the assembled Briar Reveler Walk review hash must remain frozen');
check(EN_E03_SATYR_WALK_GATE.candidateFrameDigest === '409b08eb3bd121dec5e8234c49e2fe11d374b73bf501648852adae2ae4ab5755', 'the 16-frame Briar Reveler Walk digest must remain frozen');
check(EN_E03_SATYR_WALK_GATE.scope.includes('W1-W4 across Down, Left, Right, and Up'), 'the Walk gate must name its exact four-direction/four-frame scope');
check(EN_E03_SATYR_WALK_GATE.exclusions.includes('Idle pixel changes'), 'the Walk gate must protect the approved Idle pixels');
check(EN_E03_SATYR_WALK_GATE.exclusions.includes('Giant changes') && EN_E03_SATYR_WALK_GATE.exclusions.includes('Centaur changes'), 'the Walk gate must protect Giant and Centaur');
check(EN_E03_SATYR_WALK_GATE.exclusions.includes('Attack') && EN_E03_SATYR_WALK_GATE.exclusions.includes('registration'), 'the Walk gate must exclude later motion and public routing');
check(EN_E03_SATYR_WALK_GATE.nextGate.includes('Hill Breaker common Attack A1-A4') && EN_E03_SATYR_WALK_GATE.nextGate.includes('preserving approved Hill Breaker Idle and Walk byte-for-byte'), 'the Walk gate must record the bounded Hill Breaker Attack continuation');
check(Object.isFrozen(EN_E03_SATYR_WALK_GATE) && Object.isFrozen(EN_E03_SATYR_WALK_GATE.precedingApproval) && Object.isFrozen(EN_E03_SATYR_WALK_GATE.approvedIdle) && Object.isFrozen(EN_E03_SATYR_WALK_GATE.exclusions), 'the Walk gate must be deeply immutable');

check(EN_E03_SATYR_WALK_REGISTRY.families.length === 1, 'the Walk registry must contain exactly one family');
check(EN_E03_SATYR_WALK_REGISTRY.families[0].id === 'satyr', 'the Walk registry must contain only Satyr');
check(EN_E03_SATYR_WALK_REGISTRY.families[0].variants.length === 1, 'the Walk registry must contain exactly one variant');
check(EN_E03_SATYR_WALK_REGISTRY.families[0].variants[0].id === 'briar-reveler', 'the Walk registry must contain only Briar Reveler');
check(EN_E03_SATYR_WALK_REGISTRY.publicFamilies.length === 0 && EN_E03_SATYR_WALK_REGISTRY.approvedFamilies.length === 0, 'the visually approved Walk baseline must remain internal and outside registry approval/public routing');
check(EN_E03_SATYR_WALK_REGISTRY.renderers[0].chassis === 'humanoid-v1', 'the Walk renderer must retain the approved humanoid upper chassis');
check(Object.isFrozen(EN_E03_SATYR_WALK_REGISTRY) && Object.isFrozen(EN_E03_SATYR_WALK_FAMILY), 'the Walk registry and family must be immutable');

check(engine.PUBLIC_ENEMIES.length === 70, 'the Walk candidate must not alter the 70-family public catalog');
check(engine.ENEMIES.length === 57, 'the Walk candidate must not alter the 57-family legacy catalog');
check(!engine.PUBLIC_ENEMIES.some((family) => family.id === 'satyr'), 'Satyr must remain absent from public consumers');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!facadeSource.includes('enemy-expansion-en-e03-satyr-walk'), 'the public facade must not import the Satyr Walk candidate module');
check(!facadeSource.includes('EN_E03_SATYR_WALK'), 'the public facade must not expose Satyr Walk candidate symbols');

const spec = { kind: 'enemy', family: 'satyr', variant: 'briar-reveler' };
const walkFrames = new Map();
const walkRecords = [];
const delegatedIdleRecords = [];
let completeOutlinePixels = 0;
let formChangedPixels = 0;
let plantedContactChecks = 0;

for (const direction of engine.DIRS) for (let frame = 0; frame < 2; frame++) {
  const approved = captureEnemyExpansionFrame(EN_E03_SATYR_IDLE_REGISTRY, spec, direction, 'idle', frame, engine.SIZE);
  const delegated = captureEnemyExpansionFrame(EN_E03_SATYR_WALK_REGISTRY, spec, direction, 'idle', frame, engine.SIZE);
  check(JSON.stringify(delegated.pixels) === JSON.stringify(approved.pixels), direction + '/Idle F' + (frame + 1) + ' must delegate to the exact approved baseline');
  check(delegated.digest === approved.digest && delegated.alphaDigest === approved.alphaDigest, direction + '/Idle F' + (frame + 1) + ' hashes must remain exact');
  delegatedIdleRecords.push({
    family: 'satyr',
    variant: 'briar-reveler',
    direction,
    animation: 'idle',
    frame,
    digest: delegated.digest,
    alphaDigest: delegated.alphaDigest,
    opaquePixels: delegated.opaquePixels,
    bounds: delegated.bounds,
  });
}

for (const direction of engine.DIRS) for (let frame = 0; frame < 4; frame++) {
  const captured = captureEnemyExpansionFrame(EN_E03_SATYR_WALK_REGISTRY, spec, direction, 'walk', frame, engine.SIZE);
  walkFrames.set(direction + '/' + frame, captured);
  check(captured.outOfBoundsWrites.length === 0, direction + '/W' + (frame + 1) + ' wrote outside the 24x24 cell');
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22, direction + '/W' + (frame + 1) + ' must preserve a one-cell margin');
  check(componentCount(captured.pixels) === 1, direction + '/W' + (frame + 1) + ' must have one connected horned humanoid-staff silhouette');
  check(captured.alpha.every((value) => value === 0 || value === 255), direction + '/W' + (frame + 1) + ' must use binary alpha');
  const expectedContactTips = frame === 1 || frame === 3 ? 4 : 2;
  check(opaqueRunsAtRow(captured.alpha, 22) === expectedContactTips, direction + '/W' + (frame + 1) + ' must retain ' + expectedContactTips + ' separated split-hoof contact tips');
  plantedContactChecks++;
  for (const color of EN_E03_BRIAR_REVELER_CALIBRATION_DATA.satyr.hoof) check(captured.colors.includes(color), direction + '/W' + (frame + 1) + ' must use split-hoof color ' + color);
  check(captured.colors.includes(EN_E03_BRIAR_REVELER_CALIBRATION_DATA.satyr.hide[0]), direction + '/W' + (frame + 1) + ' must use the approved Satyr hide base');
  check(captured.colors.includes(EN_E03_BRIAR_REVELER_CALIBRATION_DATA.satyr.wood[1]), direction + '/W' + (frame + 1) + ' must use the crooked staff shaft');
  check(captured.colors.includes(EN_E03_BRIAR_REVELER_CALIBRATION_DATA.satyr.horn[0]), direction + '/W' + (frame + 1) + ' must retain the approved horn color');
  if (direction === 'up') {
    const bob = frame === 1 || frame === 3 ? 1 : 0;
    check(
      captured.pixels[((9 + bob) * engine.SIZE) + 9] === EN_E03_BRIAR_REVELER_CALIBRATION_DATA.actor.palette.skin[0],
      'up/W' + (frame + 1) + ' must cover the shared front-expression eye pixel so the head reads as a rear view',
    );
  }
  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E03_BRIAR_REVELER_CALIBRATION_DATA);
  completeOutlinePixels += presentation.complete.filter((color, index) => color !== null && captured.pixels[index] === null).length;
  formChangedPixels += presentation.form.filter((color, index) => captured.pixels[index] !== null && color !== captured.pixels[index]).length;
  walkRecords.push({
    family: 'satyr',
    variant: 'briar-reveler',
    direction,
    animation: 'walk',
    frame,
    digest: captured.digest,
    alphaDigest: captured.alphaDigest,
    opaquePixels: captured.opaquePixels,
    bounds: captured.bounds,
  });
}

check(createHash('sha256').update(JSON.stringify(delegatedIdleRecords)).digest('hex') === EN_E03_SATYR_IDLE_GATE.candidateFrameDigest, 'the delegated approved Idle records drifted');
for (const direction of engine.DIRS) {
  const first = walkFrames.get(direction + '/0');
  const passingA = walkFrames.get(direction + '/1');
  const third = walkFrames.get(direction + '/2');
  const passingB = walkFrames.get(direction + '/3');
  check(first.alphaDigest !== passingA.alphaDigest, direction + ' W1 must differ visibly from the passing pose');
  check(third.alphaDigest !== passingA.alphaDigest, direction + ' W3 must differ visibly from the passing pose');
  check(first.alphaDigest !== third.alphaDigest, direction + ' W1 and W3 must use opposite diagonal hoof silhouettes');
  check(passingA.digest === passingB.digest && passingA.alphaDigest === passingB.alphaDigest, direction + ' W2 and W4 must preserve the deliberate shared passing pose');
  const contactCycle = [first, passingA, third, passingB].map(splitHoofContactAlpha);
  check(contactCycle[0] !== contactCycle[2], direction + ' W1 and W3 must retain opposite hoof-contact silhouettes');
  check(new Set(contactCycle).size === 3, direction + ' Walk must retain three distinct hoof-contact silhouettes with only W2/W4 shared');
  check(first.bounds.minY === third.bounds.minY, direction + ' W1/W3 must retain the same full-height weight baseline');
  check(passingA.bounds.minY === passingB.bounds.minY && passingA.bounds.minY === first.bounds.minY + 1, direction + ' W2/W4 must retain the one-pixel passing dip');
  check(first.bounds.maxY === 22 && passingA.bounds.maxY === 22 && third.bounds.maxY === 22 && passingB.bounds.maxY === 22, direction + ' Walk must keep a planted ground-contact baseline');
}
for (let frame = 0; frame < 4; frame++) {
  check(
    JSON.stringify(walkFrames.get('left/' + frame).pixels) === JSON.stringify(mirrorPixels(walkFrames.get('right/' + frame).pixels, engine.SIZE)),
    'the left Briar Reveler W' + (frame + 1) + ' profile must be the exact mirror of the right profile',
  );
}
check(new Set(walkRecords.map((record) => record.alphaDigest)).size === 12, 'the 16 Walk frames must retain 12 distinct silhouettes with only W2/W4 shared per direction');
check(completeOutlinePixels > 0, 'Complete B must add exterior outline pixels');
check(formChangedPixels > 0, 'Form must shade source pixels');

rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_SATYR_WALK_REGISTRY, spec, 'down', 'attack', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'authorizes only approved Idle and four Walk frames',
  'Attack rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_SATYR_WALK_REGISTRY, { kind: 'enemy', family: 'giant', variant: 'hill-breaker' }, 'down', 'walk', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'is not implemented',
  'Giant rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_SATYR_WALK_REGISTRY, { kind: 'enemy', family: 'centaur', variant: 'steppe-hunter' }, 'down', 'walk', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'is not implemented',
  'Centaur rendering',
);

const candidateDigest = createHash('sha256').update(JSON.stringify(walkRecords)).digest('hex');
check(candidateDigest === EN_E03_SATYR_WALK_GATE.candidateFrameDigest, 'the Briar Reveler Walk pixels drifted');

if (errors.length) {
  console.error('EN-E03 Briar Reveler Walk validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E03 Briar Reveler four-frame Walk validation passed.');
console.log('- Candidate scope: 1 family / 1 variant / 16 Walk frames');
console.log('- Approved Idle frames preserved: 8 / 8');
console.log('- Connected hard-alpha horned silhouettes: 16 / 16');
console.log('- Split-hoof ground-contact checks: ' + plantedContactChecks + ' / 16');
console.log('- Distinct hoof-contact cycles: 3 / 4 per direction (W2/W4 shared)');
console.log('- Distinct Walk silhouettes: 12 / 16 (W2/W4 shared per direction)');
console.log('- Complete B added pixels: ' + completeOutlinePixels);
console.log('- Form-shaded source pixels: ' + formChangedPixels);
console.log('- Public EN-E03 families: 0');
console.log('- Candidate frame digest: ' + candidateDigest);
