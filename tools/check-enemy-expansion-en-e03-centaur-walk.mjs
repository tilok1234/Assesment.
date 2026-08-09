import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import {
  EN_E03_STEPPE_HUNTER_CALIBRATION_DATA,
} from '../engine/enemy-expansion-en-e03-centaur-calibration.js';
import {
  EN_E03_CENTAUR_IDLE_GATE,
  EN_E03_CENTAUR_IDLE_REGISTRY,
} from '../engine/enemy-expansion-en-e03-centaur-idle.js';
import {
  EN_E03_CENTAUR_WALK_FAMILY,
  EN_E03_CENTAUR_WALK_GATE,
  EN_E03_CENTAUR_WALK_REGISTRY,
} from '../engine/enemy-expansion-en-e03-centaur-walk.js';
import { EN_E03_GIANT_WALK_GATE } from '../engine/enemy-expansion-en-e03-giant-walk.js';
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

function hoofContactAlpha(captured) {
  const start = 19 * engine.SIZE;
  return Array.from(captured.alpha.slice(start)).join('');
}

check(EN_E03_GIANT_WALK_GATE.status === 'approved', 'the preceding Hill Breaker Walk gate must remain visually approved');
check(EN_E03_GIANT_WALK_GATE.approvedOn === '2026-08-06', 'the Hill Breaker Walk gate must retain its visual approval date');
check(EN_E03_GIANT_WALK_GATE.approvalEvidence === 'Designer reviewed the exact Hill Breaker Walk raw and Complete B + Form boards and said: yes sir seems fine to me approved.', 'the Hill Breaker Walk gate must retain exact approval evidence');
check(EN_E03_CENTAUR_IDLE_GATE.status === 'approved', 'the Steppe Hunter two-frame Idle baseline must remain visually approved');
check(EN_E03_CENTAUR_WALK_GATE.status === 'approved', 'the Steppe Hunter Walk gate must remain visually approved');
check(EN_E03_CENTAUR_WALK_GATE.authorizedOn === '2026-08-06', 'the Steppe Hunter Walk gate must record its authorization date');
check(EN_E03_CENTAUR_WALK_GATE.authorizationEvidence === 'Designer approved the exact Hill Breaker Walk boards with: yes sir seems fine to me approved, and authorized the next bounded Steppe Hunter Walk gate.', 'the Steppe Hunter Walk gate must retain exact authorization evidence');
check(EN_E03_CENTAUR_WALK_GATE.approvedOn === '2026-08-06', 'the Steppe Hunter Walk gate must record its visual approval date');
check(EN_E03_CENTAUR_WALK_GATE.approvalEvidence === 'Designer reviewed the exact raw and Complete B + Form Steppe Hunter Walk animations and said: approved.', 'the Steppe Hunter Walk gate must retain exact approval evidence');
check(EN_E03_CENTAUR_WALK_GATE.precedingApproval.gateId === EN_E03_GIANT_WALK_GATE.id, 'the Steppe Hunter Walk gate must identify the preceding approved Hill Breaker Walk');
check(EN_E03_CENTAUR_WALK_GATE.precedingApproval.artifactSha256 === EN_E03_GIANT_WALK_GATE.artifactSha256, 'the preceding raw Hill Breaker Walk hash must remain frozen');
check(EN_E03_CENTAUR_WALK_GATE.precedingApproval.assembledArtifactSha256 === EN_E03_GIANT_WALK_GATE.assembledArtifactSha256, 'the preceding assembled Hill Breaker Walk hash must remain frozen');
check(EN_E03_CENTAUR_WALK_GATE.precedingApproval.candidateFrameDigest === EN_E03_GIANT_WALK_GATE.candidateFrameDigest, 'the preceding Hill Breaker Walk frame digest must remain frozen');
check(EN_E03_CENTAUR_WALK_GATE.approvedIdle.gateId === EN_E03_CENTAUR_IDLE_GATE.id, 'the Walk gate must identify the approved Steppe Hunter Idle baseline');
check(EN_E03_CENTAUR_WALK_GATE.approvedIdle.artifactSha256 === EN_E03_CENTAUR_IDLE_GATE.artifactSha256, 'the Walk gate must retain the approved raw Idle hash');
check(EN_E03_CENTAUR_WALK_GATE.approvedIdle.assembledArtifactSha256 === EN_E03_CENTAUR_IDLE_GATE.assembledArtifactSha256, 'the Walk gate must retain the approved assembled Idle hash');
check(EN_E03_CENTAUR_WALK_GATE.approvedIdle.frameDigest === EN_E03_CENTAUR_IDLE_GATE.candidateFrameDigest, 'the Walk gate must retain the approved Idle frame digest');
check(EN_E03_CENTAUR_WALK_GATE.artifactSha256 === 'b64b73f0bc90c35be428dbf49cc948576fc06575c28af36e286bd34079268269', 'the raw Steppe Hunter Walk review hash must remain frozen');
check(EN_E03_CENTAUR_WALK_GATE.assembledArtifactSha256 === '76503340798a738086cf8c001529c71aa80a3f8890ad55d6eb40a5e198e20a98', 'the assembled Steppe Hunter Walk review hash must remain frozen');
check(EN_E03_CENTAUR_WALK_GATE.candidateFrameDigest === '8fa70b11dd34ae5643c709ff1082b84f61e36a1f3fa6110689f47fee864c433e', 'the 16-frame Steppe Hunter Walk digest must remain frozen');
check(EN_E03_CENTAUR_WALK_GATE.scope.includes('W1-W4 across Down, Left, Right, and Up'), 'the Walk gate must name its exact four-direction/four-frame scope');
check(EN_E03_CENTAUR_WALK_GATE.exclusions.includes('Idle pixel changes'), 'the Walk gate must protect the approved Idle pixels');
check(EN_E03_CENTAUR_WALK_GATE.exclusions.includes('Giant changes') && EN_E03_CENTAUR_WALK_GATE.exclusions.includes('Satyr'), 'the Walk gate must protect Giant and exclude Satyr');
check(EN_E03_CENTAUR_WALK_GATE.exclusions.includes('Attack') && EN_E03_CENTAUR_WALK_GATE.exclusions.includes('registration'), 'the Walk gate must exclude later motion and public routing');
check(EN_E03_CENTAUR_WALK_GATE.nextGate.includes('No later EN-E03 implementation is authorized'), 'the Walk gate must stop without authorizing a later EN-E03 implementation');
check(Object.isFrozen(EN_E03_CENTAUR_WALK_GATE) && Object.isFrozen(EN_E03_CENTAUR_WALK_GATE.precedingApproval) && Object.isFrozen(EN_E03_CENTAUR_WALK_GATE.approvedIdle) && Object.isFrozen(EN_E03_CENTAUR_WALK_GATE.exclusions), 'the Walk gate must be deeply immutable');

check(EN_E03_CENTAUR_WALK_REGISTRY.families.length === 1, 'the Walk registry must contain exactly one family');
check(EN_E03_CENTAUR_WALK_REGISTRY.families[0].id === 'centaur', 'the Walk registry must contain only Centaur');
check(EN_E03_CENTAUR_WALK_REGISTRY.families[0].variants.length === 1, 'the Walk registry must contain exactly one variant');
check(EN_E03_CENTAUR_WALK_REGISTRY.families[0].variants[0].id === 'steppe-hunter', 'the Walk registry must contain only Steppe Hunter');
check(EN_E03_CENTAUR_WALK_REGISTRY.publicFamilies.length === 0 && EN_E03_CENTAUR_WALK_REGISTRY.approvedFamilies.length === 0, 'the visually approved Walk baseline must remain internal and outside registry approval/public routing');
check(EN_E03_CENTAUR_WALK_REGISTRY.renderers[0].chassis === 'humanoid-v1', 'the Walk renderer must retain the approved humanoid upper chassis');
check(Object.isFrozen(EN_E03_CENTAUR_WALK_REGISTRY) && Object.isFrozen(EN_E03_CENTAUR_WALK_FAMILY), 'the Walk registry and family must be immutable');

check(engine.PUBLIC_ENEMIES.length === 80, 'the Walk source must coexist with the later 80-family public catalog');
check(engine.ENEMIES.length === 57, 'the Walk candidate must not alter the 57-family legacy catalog');
check(engine.PUBLIC_ENEMIES.some((family) => family.id === 'centaur'), 'the later approved adoption must expose Centaur in public consumers');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!facadeSource.includes('enemy-expansion-en-e03-centaur-walk'), 'the public facade must not import the Centaur Walk candidate module');
check(!facadeSource.includes('EN_E03_CENTAUR_WALK'), 'the public facade must not expose Centaur Walk candidate symbols');

const spec = { kind: 'enemy', family: 'centaur', variant: 'steppe-hunter' };
const walkFrames = new Map();
const walkRecords = [];
const delegatedIdleRecords = [];
let completeOutlinePixels = 0;
let formChangedPixels = 0;
let plantedContactChecks = 0;

for (const direction of engine.DIRS) for (let frame = 0; frame < 2; frame++) {
  const approved = captureEnemyExpansionFrame(EN_E03_CENTAUR_IDLE_REGISTRY, spec, direction, 'idle', frame, engine.SIZE);
  const delegated = captureEnemyExpansionFrame(EN_E03_CENTAUR_WALK_REGISTRY, spec, direction, 'idle', frame, engine.SIZE);
  check(JSON.stringify(delegated.pixels) === JSON.stringify(approved.pixels), direction + '/Idle F' + (frame + 1) + ' must delegate to the exact approved baseline');
  check(delegated.digest === approved.digest && delegated.alphaDigest === approved.alphaDigest, direction + '/Idle F' + (frame + 1) + ' hashes must remain exact');
  delegatedIdleRecords.push({
    family: 'centaur',
    variant: 'steppe-hunter',
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
  const captured = captureEnemyExpansionFrame(EN_E03_CENTAUR_WALK_REGISTRY, spec, direction, 'walk', frame, engine.SIZE);
  walkFrames.set(direction + '/' + frame, captured);
  check(captured.outOfBoundsWrites.length === 0, direction + '/W' + (frame + 1) + ' wrote outside the 24x24 cell');
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22, direction + '/W' + (frame + 1) + ' must preserve a one-cell margin');
  check(componentCount(captured.pixels) === 1, direction + '/W' + (frame + 1) + ' must have one connected humanoid-horse-spear silhouette');
  check(captured.alpha.every((value) => value === 0 || value === 255), direction + '/W' + (frame + 1) + ' must use binary alpha');
  check(opaqueRunsAtRow(captured.alpha, 22) === 2, direction + '/W' + (frame + 1) + ' must retain two separated planted hoof contacts');
  plantedContactChecks++;
  for (const color of EN_E03_STEPPE_HUNTER_CALIBRATION_DATA.horse.hoof) check(captured.colors.includes(color), direction + '/W' + (frame + 1) + ' must use hoof color ' + color);
  check(captured.colors.includes(EN_E03_STEPPE_HUNTER_CALIBRATION_DATA.horse.hide[0]), direction + '/W' + (frame + 1) + ' must use the chestnut hide base');
  check(captured.colors.includes(EN_E03_STEPPE_HUNTER_CALIBRATION_DATA.horse.wood[1]), direction + '/W' + (frame + 1) + ' must use the upright spear shaft');
  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E03_STEPPE_HUNTER_CALIBRATION_DATA);
  completeOutlinePixels += presentation.complete.filter((color, index) => color !== null && captured.pixels[index] === null).length;
  formChangedPixels += presentation.form.filter((color, index) => captured.pixels[index] !== null && color !== captured.pixels[index]).length;
  walkRecords.push({
    family: 'centaur',
    variant: 'steppe-hunter',
    direction,
    animation: 'walk',
    frame,
    digest: captured.digest,
    alphaDigest: captured.alphaDigest,
    opaquePixels: captured.opaquePixels,
    bounds: captured.bounds,
  });
}

check(createHash('sha256').update(JSON.stringify(delegatedIdleRecords)).digest('hex') === EN_E03_CENTAUR_IDLE_GATE.candidateFrameDigest, 'the delegated approved Idle records drifted');
for (const direction of engine.DIRS) {
  const first = walkFrames.get(direction + '/0');
  const passingA = walkFrames.get(direction + '/1');
  const third = walkFrames.get(direction + '/2');
  const passingB = walkFrames.get(direction + '/3');
  check(first.alphaDigest !== passingA.alphaDigest, direction + ' W1 must differ visibly from the passing pose');
  check(third.alphaDigest !== passingA.alphaDigest, direction + ' W3 must differ visibly from the passing pose');
  check(first.alphaDigest !== third.alphaDigest, direction + ' W1 and W3 must use opposite diagonal hoof silhouettes');
  check(passingA.digest === passingB.digest && passingA.alphaDigest === passingB.alphaDigest, direction + ' W2 and W4 must preserve the deliberate shared passing pose');
  const contactCycle = [first, passingA, third, passingB].map(hoofContactAlpha);
  check(contactCycle[0] !== contactCycle[2], direction + ' W1 and W3 must retain opposite hoof-contact silhouettes');
  check(new Set(contactCycle).size === 3, direction + ' Walk must retain three distinct hoof-contact silhouettes with only W2/W4 shared');
  check(first.bounds.minY === 2 && third.bounds.minY === 2, direction + ' W1/W3 must retain the full-height weight poses');
  check(passingA.bounds.minY === 3 && passingB.bounds.minY === 3, direction + ' W2/W4 must retain the one-pixel passing dip');
  check(first.bounds.maxY === 22 && passingA.bounds.maxY === 22 && third.bounds.maxY === 22 && passingB.bounds.maxY === 22, direction + ' Walk must keep a planted ground-contact baseline');
}
for (let frame = 0; frame < 4; frame++) {
  check(
    JSON.stringify(walkFrames.get('left/' + frame).pixels) === JSON.stringify(mirrorPixels(walkFrames.get('right/' + frame).pixels, engine.SIZE)),
    'the left Steppe Hunter W' + (frame + 1) + ' profile must be the exact mirror of the right profile',
  );
}
check(new Set(walkRecords.map((record) => record.alphaDigest)).size === 12, 'the 16 Walk frames must retain 12 distinct silhouettes with only W2/W4 shared per direction');
check(completeOutlinePixels > 0, 'Complete B must add exterior outline pixels');
check(formChangedPixels > 0, 'Form must shade source pixels');

rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_CENTAUR_WALK_REGISTRY, spec, 'down', 'attack', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'authorizes only approved Idle and four Walk frames',
  'Attack rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_CENTAUR_WALK_REGISTRY, { kind: 'enemy', family: 'giant', variant: 'hill-breaker' }, 'down', 'walk', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'is not implemented',
  'Giant rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_CENTAUR_WALK_REGISTRY, { kind: 'enemy', family: 'satyr', variant: 'briar-reveler' }, 'down', 'walk', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'is not implemented',
  'Satyr rendering',
);

const candidateDigest = createHash('sha256').update(JSON.stringify(walkRecords)).digest('hex');
check(candidateDigest === EN_E03_CENTAUR_WALK_GATE.candidateFrameDigest, 'the Steppe Hunter Walk pixels drifted');

if (errors.length) {
  console.error('EN-E03 Steppe Hunter Walk validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E03 Steppe Hunter four-frame Walk validation passed.');
console.log('- Candidate scope: 1 family / 1 variant / 16 Walk frames');
console.log('- Approved Idle frames preserved: 8 / 8');
console.log('- Connected hard-alpha hybrid silhouettes: 16 / 16');
console.log('- Two-hoof ground-contact checks: ' + plantedContactChecks + ' / 16');
console.log('- Distinct hoof-contact cycles: 3 / 4 per direction (W2/W4 shared)');
console.log('- Distinct Walk silhouettes: 12 / 16 (W2/W4 shared per direction)');
console.log('- Complete B added pixels: ' + completeOutlinePixels);
console.log('- Form-shaded source pixels: ' + formChangedPixels);
console.log('- Public EN-E03 families: 0');
console.log('- Candidate frame digest: ' + candidateDigest);
