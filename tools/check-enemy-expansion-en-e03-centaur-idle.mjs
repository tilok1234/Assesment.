import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { EN_E03_IDLE_GATE } from '../engine/enemy-expansion-en-e03.js';
import {
  EN_E03_CENTAUR_CALIBRATION_GATE,
  EN_E03_STEPPE_HUNTER_CALIBRATION_DATA,
} from '../engine/enemy-expansion-en-e03-centaur-calibration.js';
import {
  EN_E03_CENTAUR_IDLE_FAMILY,
  EN_E03_CENTAUR_IDLE_GATE,
  EN_E03_CENTAUR_IDLE_REGISTRY,
} from '../engine/enemy-expansion-en-e03-centaur-idle.js';
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

function changedAlphaPixels(first, second) {
  let changed = 0;
  for (let index = 0; index < first.length; index++) if (first[index] !== second[index]) changed++;
  return changed;
}

check(EN_E03_CENTAUR_CALIBRATION_GATE.status === 'approved', 'the first-pose Steppe Hunter calibration must remain approved');
check(EN_E03_CENTAUR_IDLE_GATE.status === 'approved', 'the two-frame Steppe Hunter Idle gate must remain visually approved');
check(EN_E03_CENTAUR_IDLE_GATE.authorizedOn === '2026-08-03', 'the two-frame Steppe Hunter gate must record its authorization date');
check(EN_E03_CENTAUR_IDLE_GATE.authorizationEvidence === 'Designer approved the exact Steppe Hunter F1 gate and authorized the recommended F2-only continuation with: Let\'s do that.', 'the two-frame Steppe Hunter gate must retain exact authorization evidence');
check(EN_E03_CENTAUR_IDLE_GATE.approvedOn === '2026-08-03', 'the two-frame Steppe Hunter gate must record its visual approval date');
check(EN_E03_CENTAUR_IDLE_GATE.approvalEvidence === 'Designer reviewed the exact Steppe Hunter F1/F2 raw and Complete B + Form boards and said: Approved lets keep going.', 'the two-frame Steppe Hunter gate must retain exact approval evidence');
check(EN_E03_CENTAUR_IDLE_GATE.approvedSeed.gateId === EN_E03_CENTAUR_CALIBRATION_GATE.id, 'the two-frame Steppe Hunter gate must identify the approved F1 seed');
check(EN_E03_CENTAUR_IDLE_GATE.approvedSeed.artifactSha256 === EN_E03_CENTAUR_CALIBRATION_GATE.artifactSha256, 'the two-frame Steppe Hunter gate must retain the approved F1 raw hash');
check(EN_E03_CENTAUR_IDLE_GATE.approvedSeed.assembledArtifactSha256 === EN_E03_CENTAUR_CALIBRATION_GATE.assembledArtifactSha256, 'the two-frame Steppe Hunter gate must retain the approved F1 assembled hash');
check(EN_E03_CENTAUR_IDLE_GATE.approvedSeed.candidateFrameDigest === EN_E03_CENTAUR_CALIBRATION_GATE.candidateFrameDigest, 'the two-frame Steppe Hunter gate must retain the approved F1 frame digest');
check(EN_E03_CENTAUR_IDLE_GATE.artifactSha256 === '256b9be67407ada1caad58b6dc68d426ecbeb73b5f2032f13187e337d900c235', 'the Steppe Hunter F1/F2 raw artifact hash must remain frozen');
check(EN_E03_CENTAUR_IDLE_GATE.assembledArtifactSha256 === 'e98d2e7d570c8777238cb187caaac15caff9c9000af0b322c651623e8e0ff7dd', 'the Steppe Hunter F1/F2 assembled artifact hash must remain frozen');
check(EN_E03_CENTAUR_IDLE_GATE.candidateFrameDigest === '3c88471b25fc27397a0a11d6495cd27c641a6715ff33429f5d0d2c81f184ae49', 'the Steppe Hunter F1/F2 frame digest must remain frozen');
check(EN_E03_CENTAUR_IDLE_GATE.scope.includes('Idle frame 1 plus one new frame 2'), 'the Steppe Hunter gate must name its two-pose scope');
check(EN_E03_CENTAUR_IDLE_GATE.exclusions.includes('Giant changes') && EN_E03_CENTAUR_IDLE_GATE.exclusions.includes('Satyr'), 'the Steppe Hunter gate must protect Giant and exclude Satyr');
check(EN_E03_CENTAUR_IDLE_GATE.exclusions.includes('Walk') && EN_E03_CENTAUR_IDLE_GATE.exclusions.includes('registration'), 'the Steppe Hunter gate must exclude later motion and public routing');
check(Object.isFrozen(EN_E03_CENTAUR_IDLE_GATE) && Object.isFrozen(EN_E03_CENTAUR_IDLE_GATE.approvedSeed) && Object.isFrozen(EN_E03_CENTAUR_IDLE_GATE.exclusions), 'the two-frame Steppe Hunter gate must be deeply immutable');

check(EN_E03_IDLE_GATE.artifactSha256 === '059f7c4945cffacf4e53e2d9435566479adf08ec754ed8f0faca520958908aa2', 'the rejected v2 raw review hash must remain frozen');
check(EN_E03_IDLE_GATE.assembledArtifactSha256 === '2835b044868cd948fbb7327675f5821adfe499507a08d0e8350f83cff5e2ab89', 'the rejected v2 assembled review hash must remain frozen');
check(EN_E03_IDLE_GATE.candidateFrameDigest === '8339d3d4a2380f8e9d9bf6ecb3fa1a5f0faddafc0bf6ce43c3ce12c515a1a059', 'the rejected v2 frame digest must remain frozen');

check(EN_E03_CENTAUR_IDLE_REGISTRY.families.length === 1, 'the Steppe Hunter Idle registry must contain exactly one family');
check(EN_E03_CENTAUR_IDLE_REGISTRY.families[0].id === 'centaur', 'the Steppe Hunter Idle registry must contain only Centaur');
check(EN_E03_CENTAUR_IDLE_REGISTRY.families[0].variants.length === 1, 'the Steppe Hunter Idle registry must contain exactly one variant');
check(EN_E03_CENTAUR_IDLE_REGISTRY.families[0].variants[0].id === 'steppe-hunter', 'the Steppe Hunter Idle registry must contain only Steppe Hunter');
check(EN_E03_CENTAUR_IDLE_REGISTRY.publicFamilies.length === 0 && EN_E03_CENTAUR_IDLE_REGISTRY.approvedFamilies.length === 0, 'the visually approved Steppe Hunter Idle baseline must remain outside approved/public registry state');
check(EN_E03_CENTAUR_IDLE_REGISTRY.renderers[0].chassis === 'humanoid-v1', 'the Steppe Hunter Idle renderer must retain the approved humanoid upper chassis');
check(Object.isFrozen(EN_E03_CENTAUR_IDLE_REGISTRY) && Object.isFrozen(EN_E03_CENTAUR_IDLE_FAMILY), 'the Steppe Hunter Idle registry and family must be immutable');

check(engine.PUBLIC_ENEMIES.length === 80, 'the Steppe Hunter Idle source must coexist with the later 80-family public catalog');
check(engine.ENEMIES.length === 57, 'the Steppe Hunter Idle candidate must not alter the 57-family legacy catalog');
check(engine.PUBLIC_ENEMIES.some((family) => family.id === 'centaur'), 'the later approved adoption must expose Centaur in public consumers');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!facadeSource.includes('enemy-expansion-en-e03-centaur-idle'), 'the public facade must not import the Steppe Hunter Idle candidate module');
check(!facadeSource.includes('EN_E03_CENTAUR_IDLE'), 'the public facade must not expose Steppe Hunter Idle candidate symbols');

const spec = { kind: 'enemy', family: 'centaur', variant: 'steppe-hunter' };
const frameRecords = [];
const seedRecords = [];
const byDirection = new Map();
let completeOutlinePixels = 0;
let formChangedPixels = 0;
for (const direction of engine.DIRS) for (let frame = 0; frame < 2; frame++) {
  const captured = captureEnemyExpansionFrame(EN_E03_CENTAUR_IDLE_REGISTRY, spec, direction, 'idle', frame, engine.SIZE);
  byDirection.set(direction + '/' + frame, captured);
  check(captured.outOfBoundsWrites.length === 0, direction + '/F' + (frame + 1) + ' wrote outside the 24x24 cell');
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22, direction + '/F' + (frame + 1) + ' must preserve a one-cell margin');
  check(componentCount(captured.pixels) === 1, direction + '/F' + (frame + 1) + ' must have one connected humanoid-horse-spear silhouette');
  check(captured.alpha.every((value) => value === 0 || value === 255), direction + '/F' + (frame + 1) + ' must use binary alpha');
  check(opaqueRunsAtRow(captured.alpha, 22) === 4, direction + '/F' + (frame + 1) + ' must show four separated hoof contacts on the bottom occupied row');
  for (const color of EN_E03_STEPPE_HUNTER_CALIBRATION_DATA.horse.hoof) check(captured.colors.includes(color), direction + '/F' + (frame + 1) + ' must use hoof color ' + color);
  check(captured.colors.includes(EN_E03_STEPPE_HUNTER_CALIBRATION_DATA.horse.hide[0]), direction + '/F' + (frame + 1) + ' must use the chestnut hide base');
  check(captured.colors.includes(EN_E03_STEPPE_HUNTER_CALIBRATION_DATA.horse.wood[1]), direction + '/F' + (frame + 1) + ' must use the upright spear shaft');
  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E03_STEPPE_HUNTER_CALIBRATION_DATA);
  completeOutlinePixels += presentation.complete.filter((color, index) => color !== null && captured.pixels[index] === null).length;
  formChangedPixels += presentation.form.filter((color, index) => captured.pixels[index] !== null && color !== captured.pixels[index]).length;
  const record = {
    family: 'centaur',
    variant: 'steppe-hunter',
    direction,
    animation: 'idle',
    frame,
    digest: captured.digest,
    alphaDigest: captured.alphaDigest,
    opaquePixels: captured.opaquePixels,
    bounds: captured.bounds,
  };
  frameRecords.push(record);
  if (frame === 0) seedRecords.push(record);
}

const seedDigest = createHash('sha256').update(JSON.stringify(seedRecords)).digest('hex');
check(seedDigest === EN_E03_CENTAUR_CALIBRATION_GATE.candidateFrameDigest, 'the approved Steppe Hunter F1 pixels drifted while adding frame 2');
for (const direction of engine.DIRS) {
  const first = byDirection.get(direction + '/0');
  const second = byDirection.get(direction + '/1');
  check(first.digest !== second.digest, direction + ' F2 must differ from the approved F1');
  check(second.bounds.minY === first.bounds.minY + 1, direction + ' F2 must show the bounded one-pixel rider-and-spear dip');
  check(first.bounds.maxY === second.bounds.maxY, direction + ' F2 must keep the planted-hoof baseline');
  const contactStart = (engine.SIZE - 3) * engine.SIZE;
  check(
    JSON.stringify([...first.alpha.slice(contactStart)]) === JSON.stringify([...second.alpha.slice(contactStart)]),
    direction + ' F2 must preserve the approved bottom three contact rows exactly',
  );
  check(changedAlphaPixels(first.alpha, second.alpha) >= 8, direction + ' F2 must contain a visibly meaningful pose change');
}
for (let frame = 0; frame < 2; frame++) {
  check(
    JSON.stringify(byDirection.get('left/' + frame).pixels) === JSON.stringify(mirrorPixels(byDirection.get('right/' + frame).pixels, engine.SIZE)),
    'the left Steppe Hunter F' + (frame + 1) + ' profile must be the exact mirror of the right profile',
  );
}
check(new Set(engine.DIRS.map((direction) => byDirection.get(direction + '/1').alphaDigest)).size === 4, 'all four F2 directional silhouettes must remain distinct');
const downWidth = byDirection.get('down/1').bounds.maxX - byDirection.get('down/1').bounds.minX;
const sideWidth = byDirection.get('right/1').bounds.maxX - byDirection.get('right/1').bounds.minX;
check(sideWidth > downWidth, 'the Steppe Hunter F2 side profile must remain longer than its foreshortened front view');
check(completeOutlinePixels > 0, 'Complete B must add exterior outline pixels');
check(formChangedPixels > 0, 'Form must shade source pixels');

rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_CENTAUR_IDLE_REGISTRY, spec, 'down', 'idle', 2, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'is invalid for idle',
  'Idle frame 3 rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_CENTAUR_IDLE_REGISTRY, spec, 'down', 'walk', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'authorizes only two Idle frames',
  'Walk rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_CENTAUR_IDLE_REGISTRY, { kind: 'enemy', family: 'giant', variant: 'hill-breaker' }, 'down', 'idle', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'is not implemented',
  'Giant rendering',
);

const candidateDigest = createHash('sha256').update(JSON.stringify(frameRecords)).digest('hex');
check(candidateDigest === EN_E03_CENTAUR_IDLE_GATE.candidateFrameDigest, 'the approved Steppe Hunter F1/F2 pixels drifted');

if (errors.length) {
  console.error('EN-E03 Steppe Hunter Idle validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E03 Steppe Hunter two-frame Idle validation passed.');
console.log('- Candidate scope: 1 family / 1 variant / 8 Idle frames');
console.log('- Approved F1 frames preserved: 4 / 4');
console.log('- New F2 frames: 4 / 4');
console.log('- Connected hybrid silhouettes: 8 / 8');
console.log('- Four-hoof contact rows: 8 / 8');
console.log('- Complete B added pixels: ' + completeOutlinePixels);
console.log('- Form-shaded source pixels: ' + formChangedPixels);
console.log('- Public EN-E03 families: 0');
console.log('- Candidate frame digest: ' + candidateDigest);
