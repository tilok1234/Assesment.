import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { EN_E03_IDLE_GATE } from '../engine/enemy-expansion-en-e03.js';
import { EN_E03_GIANT_IDLE_GATE } from '../engine/enemy-expansion-en-e03-giant-idle.js';
import {
  EN_E03_CENTAUR_CALIBRATION_FAMILY,
  EN_E03_CENTAUR_CALIBRATION_GATE,
  EN_E03_CENTAUR_CALIBRATION_REGISTRY,
  EN_E03_STEPPE_HUNTER_CALIBRATION_DATA,
} from '../engine/enemy-expansion-en-e03-centaur-calibration.js';
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

check(EN_E03_GIANT_IDLE_GATE.status === 'approved', 'the preceding Hill Breaker two-frame Idle gate must remain approved');
check(EN_E03_CENTAUR_CALIBRATION_GATE.status === 'approved', 'the Centaur F1 calibration must remain visually approved');
check(EN_E03_CENTAUR_CALIBRATION_GATE.authorizedOn === '2026-08-03', 'the Centaur calibration must record its authorization date');
check(EN_E03_CENTAUR_CALIBRATION_GATE.authorizationEvidence === 'Designer approved the exact Hill Breaker F1/F2 gate and said: lets do next.', 'the Centaur calibration must retain exact authorization evidence');
check(EN_E03_CENTAUR_CALIBRATION_GATE.approvedOn === '2026-08-03', 'the Centaur calibration must record its visual approval date');
check(EN_E03_CENTAUR_CALIBRATION_GATE.approvalEvidence === 'Designer reviewed the exact Steppe Hunter F1 raw and Complete B + Form boards and said: Approved.', 'the Centaur calibration must retain exact approval evidence');
check(EN_E03_CENTAUR_CALIBRATION_GATE.precedingApproval.gateId === EN_E03_GIANT_IDLE_GATE.id, 'the Centaur calibration must identify the approved Hill Breaker gate');
check(EN_E03_CENTAUR_CALIBRATION_GATE.precedingApproval.artifactSha256 === EN_E03_GIANT_IDLE_GATE.artifactSha256, 'the Centaur calibration must retain the approved Hill Breaker raw hash');
check(EN_E03_CENTAUR_CALIBRATION_GATE.precedingApproval.assembledArtifactSha256 === EN_E03_GIANT_IDLE_GATE.assembledArtifactSha256, 'the Centaur calibration must retain the approved Hill Breaker assembled hash');
check(EN_E03_CENTAUR_CALIBRATION_GATE.precedingApproval.candidateFrameDigest === EN_E03_GIANT_IDLE_GATE.candidateFrameDigest, 'the Centaur calibration must retain the approved Hill Breaker frame digest');
check(EN_E03_CENTAUR_CALIBRATION_GATE.artifactSha256 === 'f4c462ffd9242684d7335c28c238db0fb59cecd5e168f069da03cc6f40753480', 'the approved Steppe Hunter raw artifact hash must remain frozen');
check(EN_E03_CENTAUR_CALIBRATION_GATE.assembledArtifactSha256 === 'dc7ccd766c736dcb1581b817f950b6be8541bacb26411c2281a42535bbf82f52', 'the approved Steppe Hunter assembled artifact hash must remain frozen');
check(EN_E03_CENTAUR_CALIBRATION_GATE.candidateFrameDigest === '53ea78549da26eccc2b8292672f693384d8551660d68bdd5e3827bb1d21f55cb', 'the approved Steppe Hunter frame digest must remain frozen');
check(EN_E03_CENTAUR_CALIBRATION_GATE.scope.includes('first Idle pose only'), 'the Centaur gate must name its one-pose scope');
check(EN_E03_CENTAUR_CALIBRATION_GATE.exclusions.includes('Idle frame 2'), 'the Centaur gate must exclude the second Idle frame');
check(EN_E03_CENTAUR_CALIBRATION_GATE.exclusions.includes('Giant changes') && EN_E03_CENTAUR_CALIBRATION_GATE.exclusions.includes('Satyr'), 'the Centaur gate must protect Giant and exclude Satyr');
check(EN_E03_CENTAUR_CALIBRATION_GATE.exclusions.includes('registration') && EN_E03_CENTAUR_CALIBRATION_GATE.exclusions.includes('consumer exposure'), 'the Centaur gate must exclude public routing');
check(Object.isFrozen(EN_E03_CENTAUR_CALIBRATION_GATE) && Object.isFrozen(EN_E03_CENTAUR_CALIBRATION_GATE.exclusions), 'the Centaur gate must be deeply immutable');

check(EN_E03_IDLE_GATE.artifactSha256 === '059f7c4945cffacf4e53e2d9435566479adf08ec754ed8f0faca520958908aa2', 'the rejected v2 raw review hash must remain frozen');
check(EN_E03_IDLE_GATE.assembledArtifactSha256 === '2835b044868cd948fbb7327675f5821adfe499507a08d0e8350f83cff5e2ab89', 'the rejected v2 assembled review hash must remain frozen');
check(EN_E03_IDLE_GATE.candidateFrameDigest === '8339d3d4a2380f8e9d9bf6ecb3fa1a5f0faddafc0bf6ce43c3ce12c515a1a059', 'the rejected v2 frame digest must remain frozen');

check(EN_E03_CENTAUR_CALIBRATION_REGISTRY.families.length === 1, 'the Centaur calibration registry must contain exactly one family');
check(EN_E03_CENTAUR_CALIBRATION_REGISTRY.families[0].id === 'centaur', 'the Centaur calibration registry must contain only Centaur');
check(EN_E03_CENTAUR_CALIBRATION_REGISTRY.families[0].variants.length === 1, 'the Centaur calibration registry must contain exactly one variant');
check(EN_E03_CENTAUR_CALIBRATION_REGISTRY.families[0].variants[0].id === 'steppe-hunter', 'the Centaur calibration registry must contain only Steppe Hunter');
check(EN_E03_CENTAUR_CALIBRATION_REGISTRY.publicFamilies.length === 0 && EN_E03_CENTAUR_CALIBRATION_REGISTRY.approvedFamilies.length === 0, 'the visually approved Centaur calibration must remain outside approved/public registry state');
check(EN_E03_CENTAUR_CALIBRATION_REGISTRY.renderers[0].chassis === 'humanoid-v1', 'the Centaur calibration must reuse the approved humanoid upper chassis');
check(Object.isFrozen(EN_E03_CENTAUR_CALIBRATION_REGISTRY) && Object.isFrozen(EN_E03_CENTAUR_CALIBRATION_FAMILY), 'the Centaur calibration registry and family must be immutable');
check(EN_E03_STEPPE_HUNTER_CALIBRATION_DATA.actor.outfit === 'ranger', 'Steppe Hunter must use the approved scout outfit grammar');
check(EN_E03_STEPPE_HUNTER_CALIBRATION_DATA.actor.weapon === 'none', 'Steppe Hunter must use the bounded custom upright spear rather than a full-body weapon composition');
check(EN_E03_STEPPE_HUNTER_CALIBRATION_DATA.horse.hide[0] === '#9a613d', 'Steppe Hunter must retain the chestnut horse palette');
check(EN_E03_STEPPE_HUNTER_CALIBRATION_DATA.horse.hoof.length === 2, 'Steppe Hunter must retain a dedicated dark hoof material pair');

check(engine.PUBLIC_ENEMIES.length === 67, 'the Centaur calibration must not alter the 67-family public catalog');
check(engine.ENEMIES.length === 57, 'the Centaur calibration must not alter the 57-family legacy catalog');
check(!engine.PUBLIC_ENEMIES.some((family) => family.id === 'centaur'), 'Centaur must remain absent from public consumers');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!facadeSource.includes('enemy-expansion-en-e03-centaur-calibration'), 'the public facade must not import the Centaur calibration module');
check(!facadeSource.includes('EN_E03_CENTAUR_CALIBRATION'), 'the public facade must not expose Centaur calibration symbols');

const spec = { kind: 'enemy', family: 'centaur', variant: 'steppe-hunter' };
const frames = new Map();
const frameRecords = [];
let completeOutlinePixels = 0;
let formChangedPixels = 0;
for (const direction of engine.DIRS) {
  const captured = captureEnemyExpansionFrame(EN_E03_CENTAUR_CALIBRATION_REGISTRY, spec, direction, 'idle', 0, engine.SIZE);
  frames.set(direction, captured);
  check(captured.outOfBoundsWrites.length === 0, direction + ' Centaur calibration wrote outside the 24x24 cell');
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22, direction + ' Centaur calibration must preserve a one-cell margin');
  check(componentCount(captured.pixels) === 1, direction + ' Centaur calibration must have one connected humanoid-horse-spear silhouette');
  check(captured.alpha.every((value) => value === 0 || value === 255), direction + ' Centaur calibration must use binary alpha');
  check(opaqueRunsAtRow(captured.alpha, 22) === 4, direction + ' Centaur calibration must show four separated hoof contacts on the bottom occupied row');
  for (const color of EN_E03_STEPPE_HUNTER_CALIBRATION_DATA.horse.hoof) check(captured.colors.includes(color), direction + ' Centaur calibration must use hoof color ' + color);
  check(captured.colors.includes(EN_E03_STEPPE_HUNTER_CALIBRATION_DATA.horse.hide[0]), direction + ' Centaur calibration must use the chestnut hide base');
  check(captured.colors.includes(EN_E03_STEPPE_HUNTER_CALIBRATION_DATA.horse.wood[1]), direction + ' Centaur calibration must use the upright spear shaft');
  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E03_STEPPE_HUNTER_CALIBRATION_DATA);
  completeOutlinePixels += presentation.complete.filter((color, index) => color !== null && captured.pixels[index] === null).length;
  formChangedPixels += presentation.form.filter((color, index) => captured.pixels[index] !== null && color !== captured.pixels[index]).length;
  frameRecords.push({
    family: 'centaur',
    variant: 'steppe-hunter',
    direction,
    animation: 'idle',
    frame: 0,
    digest: captured.digest,
    alphaDigest: captured.alphaDigest,
    opaquePixels: captured.opaquePixels,
    bounds: captured.bounds,
  });
}

check(JSON.stringify(frames.get('left').pixels) === JSON.stringify(mirrorPixels(frames.get('right').pixels, engine.SIZE)), 'the left Centaur profile must be the exact mirror of the right profile');
check(new Set(frameRecords.map((frame) => frame.alphaDigest)).size === 4, 'all four Centaur directional silhouettes must remain distinct');
const downWidth = frames.get('down').bounds.maxX - frames.get('down').bounds.minX;
const sideWidth = frames.get('right').bounds.maxX - frames.get('right').bounds.minX;
check(sideWidth > downWidth, 'the Centaur side profile must read longer than its foreshortened front view');
check(completeOutlinePixels > 0, 'Complete B must add exterior outline pixels');
check(formChangedPixels > 0, 'Form must shade source pixels');

rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_CENTAUR_CALIBRATION_REGISTRY, spec, 'down', 'idle', 1, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'authorizes only the first Idle pose',
  'Idle frame 2 rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_CENTAUR_CALIBRATION_REGISTRY, spec, 'down', 'walk', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'authorizes only the first Idle pose',
  'Walk rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_CENTAUR_CALIBRATION_REGISTRY, { kind: 'enemy', family: 'giant', variant: 'hill-breaker' }, 'down', 'idle', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'is not implemented',
  'Giant rendering',
);

const candidateDigest = createHash('sha256').update(JSON.stringify(frameRecords)).digest('hex');
check(candidateDigest === EN_E03_CENTAUR_CALIBRATION_GATE.candidateFrameDigest, 'the approved Steppe Hunter calibration pixels drifted');

if (errors.length) {
  console.error('EN-E03 Centaur calibration validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E03 Centaur calibration validation passed.');
console.log('- Candidate scope: 1 family / 1 variant / 4 first-Idle-pose directions');
console.log('- Connected hybrid silhouettes: 4 / 4');
console.log('- Four-hoof contact rows: 4 / 4');
console.log('- Complete B added pixels: ' + completeOutlinePixels);
console.log('- Form-shaded source pixels: ' + formChangedPixels);
console.log('- Public EN-E03 families: 0');
console.log('- Candidate frame digest: ' + candidateDigest);
