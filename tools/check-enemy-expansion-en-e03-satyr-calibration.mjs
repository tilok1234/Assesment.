import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { EN_E03_IDLE_GATE } from '../engine/enemy-expansion-en-e03.js';
import { EN_E03_CENTAUR_IDLE_GATE } from '../engine/enemy-expansion-en-e03-centaur-idle.js';
import {
  EN_E03_BRIAR_REVELER_CALIBRATION_DATA,
  EN_E03_SATYR_CALIBRATION_FAMILY,
  EN_E03_SATYR_CALIBRATION_GATE,
  EN_E03_SATYR_CALIBRATION_REGISTRY,
} from '../engine/enemy-expansion-en-e03-satyr-calibration.js';
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

function pixelAt(captured, x, y) {
  return captured.pixels[(y * engine.SIZE) + x];
}

check(EN_E03_CENTAUR_IDLE_GATE.status === 'approved', 'the preceding Steppe Hunter F1/F2 gate must remain approved');
check(EN_E03_CENTAUR_IDLE_GATE.approvedOn === '2026-08-03', 'the preceding Steppe Hunter gate must retain its approval date');
check(EN_E03_CENTAUR_IDLE_GATE.approvalEvidence === 'Designer reviewed the exact Steppe Hunter F1/F2 raw and Complete B + Form boards and said: Approved lets keep going.', 'the preceding Steppe Hunter gate must retain exact approval evidence');
check(EN_E03_SATYR_CALIBRATION_GATE.status === 'approved', 'the Briar Reveler F1 gate must remain visually approved');
check(EN_E03_SATYR_CALIBRATION_GATE.authorizedOn === '2026-08-03', 'the Briar Reveler gate must record its authorization date');
check(EN_E03_SATYR_CALIBRATION_GATE.authorizationEvidence === 'Designer approved the exact Steppe Hunter F1/F2 gate and said: Approved lets keep going.', 'the Briar Reveler gate must retain exact authorization evidence');
check(EN_E03_SATYR_CALIBRATION_GATE.approvedOn === '2026-08-03', 'the Briar Reveler gate must record its visual approval date');
check(EN_E03_SATYR_CALIBRATION_GATE.approvalEvidence === 'Designer reviewed the exact Briar Reveler F1 raw and Complete B + Form boards and said: looks good.', 'the Briar Reveler gate must retain exact approval evidence');
check(EN_E03_SATYR_CALIBRATION_GATE.precedingApproval.gateId === EN_E03_CENTAUR_IDLE_GATE.id, 'the Briar Reveler gate must identify the approved Steppe Hunter gate');
check(EN_E03_SATYR_CALIBRATION_GATE.precedingApproval.artifactSha256 === EN_E03_CENTAUR_IDLE_GATE.artifactSha256, 'the Briar Reveler gate must retain the approved Steppe Hunter raw hash');
check(EN_E03_SATYR_CALIBRATION_GATE.precedingApproval.assembledArtifactSha256 === EN_E03_CENTAUR_IDLE_GATE.assembledArtifactSha256, 'the Briar Reveler gate must retain the approved Steppe Hunter assembled hash');
check(EN_E03_SATYR_CALIBRATION_GATE.precedingApproval.candidateFrameDigest === EN_E03_CENTAUR_IDLE_GATE.candidateFrameDigest, 'the Briar Reveler gate must retain the approved Steppe Hunter frame digest');
check(EN_E03_SATYR_CALIBRATION_GATE.artifactSha256 === '1272f52186c4f0df8666e845392eec6338d31aa161222d2064ed27625acc4405', 'the Briar Reveler raw artifact hash must remain frozen');
check(EN_E03_SATYR_CALIBRATION_GATE.assembledArtifactSha256 === 'aa516c5d4e53b7d89b8dc2a935f7d41c8e36260950b771b8f094093e4fd9a5a1', 'the Briar Reveler assembled artifact hash must remain frozen');
check(EN_E03_SATYR_CALIBRATION_GATE.candidateFrameDigest === 'b8335de4e6794e84de0be10a3c437fab024db8310262e1c1deb484bd6b9add6b', 'the Briar Reveler frame digest must remain frozen');
check(EN_E03_SATYR_CALIBRATION_GATE.scope.includes('first Idle pose only'), 'the Briar Reveler gate must name its one-pose scope');
check(EN_E03_SATYR_CALIBRATION_GATE.exclusions.includes('Idle frame 2'), 'the Briar Reveler gate must exclude the second Idle frame');
check(EN_E03_SATYR_CALIBRATION_GATE.exclusions.includes('Giant changes') && EN_E03_SATYR_CALIBRATION_GATE.exclusions.includes('Centaur changes'), 'the Briar Reveler gate must protect the approved Giant and Centaur lanes');
check(EN_E03_SATYR_CALIBRATION_GATE.exclusions.includes('Walk') && EN_E03_SATYR_CALIBRATION_GATE.exclusions.includes('registration'), 'the Briar Reveler gate must exclude later motion and public routing');
check(EN_E03_SATYR_CALIBRATION_GATE.nextGate === 'Authorized on 2026-08-03: Briar Reveler Idle frame 2 only across Down, Left, Right, and Up, preserving the exact approved F1 evidence.', 'the Briar Reveler F1 gate must record only the bounded F2 continuation');
check(Object.isFrozen(EN_E03_SATYR_CALIBRATION_GATE) && Object.isFrozen(EN_E03_SATYR_CALIBRATION_GATE.exclusions), 'the Briar Reveler gate must be deeply immutable');

check(EN_E03_IDLE_GATE.artifactSha256 === '059f7c4945cffacf4e53e2d9435566479adf08ec754ed8f0faca520958908aa2', 'the rejected v2 raw review hash must remain frozen');
check(EN_E03_IDLE_GATE.assembledArtifactSha256 === '2835b044868cd948fbb7327675f5821adfe499507a08d0e8350f83cff5e2ab89', 'the rejected v2 assembled review hash must remain frozen');
check(EN_E03_IDLE_GATE.candidateFrameDigest === '8339d3d4a2380f8e9d9bf6ecb3fa1a5f0faddafc0bf6ce43c3ce12c515a1a059', 'the rejected v2 frame digest must remain frozen');

check(EN_E03_SATYR_CALIBRATION_REGISTRY.families.length === 1, 'the Briar Reveler registry must contain exactly one family');
check(EN_E03_SATYR_CALIBRATION_REGISTRY.families[0].id === 'satyr', 'the Briar Reveler registry must contain only Satyr');
check(EN_E03_SATYR_CALIBRATION_REGISTRY.families[0].variants.length === 1, 'the Briar Reveler registry must contain exactly one variant');
check(EN_E03_SATYR_CALIBRATION_REGISTRY.families[0].variants[0].id === 'briar-reveler', 'the Briar Reveler registry must contain only the common Satyr variant');
check(EN_E03_SATYR_CALIBRATION_REGISTRY.publicFamilies.length === 0 && EN_E03_SATYR_CALIBRATION_REGISTRY.approvedFamilies.length === 0, 'the approved Briar Reveler F1 seed must remain outside production-approved/public registry state');
check(EN_E03_SATYR_CALIBRATION_REGISTRY.renderers[0].chassis === 'humanoid-v1', 'the Briar Reveler renderer must reuse the approved humanoid chassis');
check(Object.isFrozen(EN_E03_SATYR_CALIBRATION_REGISTRY) && Object.isFrozen(EN_E03_SATYR_CALIBRATION_FAMILY), 'the Briar Reveler registry and family must be immutable');
check(EN_E03_BRIAR_REVELER_CALIBRATION_DATA.actor.bodyBuild === 'lean', 'Briar Reveler must retain the narrow approved-roster chassis');
check(EN_E03_BRIAR_REVELER_CALIBRATION_DATA.actor.outfit === 'ranger', 'Briar Reveler must retain the forest scout outfit grammar');
check(EN_E03_BRIAR_REVELER_CALIBRATION_DATA.actor.weapon === 'none', 'Briar Reveler must use the bounded custom crooked staff');
check(EN_E03_BRIAR_REVELER_CALIBRATION_DATA.identity.overlays[0].id === 'goatfolk-traits-v2', 'Briar Reveler must reuse the approved Goatfolk horn and ear grammar');

check(engine.PUBLIC_ENEMIES.length === 67, 'the Briar Reveler calibration must not alter the 67-family public catalog');
check(engine.ENEMIES.length === 57, 'the Briar Reveler calibration must not alter the 57-family legacy catalog');
check(!engine.PUBLIC_ENEMIES.some((family) => family.id === 'satyr'), 'Satyr must remain absent from public consumers');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!facadeSource.includes('enemy-expansion-en-e03-satyr-calibration'), 'the public facade must not import the Satyr calibration module');
check(!facadeSource.includes('EN_E03_SATYR_CALIBRATION'), 'the public facade must not expose Satyr calibration symbols');

const spec = { kind: 'enemy', family: 'satyr', variant: 'briar-reveler' };
const frames = new Map();
const frameRecords = [];
let completeOutlinePixels = 0;
let formChangedPixels = 0;
for (const direction of engine.DIRS) {
  const captured = captureEnemyExpansionFrame(EN_E03_SATYR_CALIBRATION_REGISTRY, spec, direction, 'idle', 0, engine.SIZE);
  frames.set(direction, captured);
  check(captured.outOfBoundsWrites.length === 0, direction + ' Briar Reveler F1 wrote outside the 24x24 cell');
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22, direction + ' Briar Reveler F1 must preserve a one-cell margin');
  check(componentCount(captured.pixels) === 1, direction + ' Briar Reveler F1 must have one connected horned-body-tail-staff silhouette');
  check(captured.alpha.every((value) => value === 0 || value === 255), direction + ' Briar Reveler F1 must use binary alpha');
  check(opaqueRunsAtRow(captured.alpha, 22) === 4, direction + ' Briar Reveler F1 must show four separated cloven-hoof tips on the bottom occupied row');
  for (const color of EN_E03_BRIAR_REVELER_CALIBRATION_DATA.satyr.hoof) check(captured.colors.includes(color), direction + ' Briar Reveler F1 must use hoof color ' + color);
  for (const color of EN_E03_BRIAR_REVELER_CALIBRATION_DATA.satyr.horn) check(captured.colors.includes(color), direction + ' Briar Reveler F1 must use horn color ' + color);
  for (const color of EN_E03_BRIAR_REVELER_CALIBRATION_DATA.satyr.wood) check(captured.colors.includes(color), direction + ' Briar Reveler F1 must use staff color ' + color);
  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E03_BRIAR_REVELER_CALIBRATION_DATA);
  completeOutlinePixels += presentation.complete.filter((color, index) => color !== null && captured.pixels[index] === null).length;
  formChangedPixels += presentation.form.filter((color, index) => captured.pixels[index] !== null && color !== captured.pixels[index]).length;
  frameRecords.push({
    family: 'satyr',
    variant: 'briar-reveler',
    direction,
    animation: 'idle',
    frame: 0,
    digest: captured.digest,
    alphaDigest: captured.alphaDigest,
    opaquePixels: captured.opaquePixels,
    bounds: captured.bounds,
  });
}

check(pixelAt(frames.get('down'), 5, 13) === EN_E03_BRIAR_REVELER_CALIBRATION_DATA.satyr.hide[0], 'the front Satyr tail must remain visible at the trailing hip');
check(pixelAt(frames.get('up'), 17, 18) === EN_E03_BRIAR_REVELER_CALIBRATION_DATA.satyr.hide[0], 'the rear Satyr tail must remain visible behind the torso');
check(pixelAt(frames.get('right'), 4, 13) === EN_E03_BRIAR_REVELER_CALIBRATION_DATA.satyr.hide[0], 'the profile Satyr tail must trail behind the hip');
check(JSON.stringify(frames.get('left').pixels) === JSON.stringify(mirrorPixels(frames.get('right').pixels, engine.SIZE)), 'the left Briar Reveler profile must be the exact mirror of the right profile');
check(new Set(frameRecords.map((frame) => frame.alphaDigest)).size === 4, 'all four Briar Reveler directional silhouettes must remain distinct');
check(completeOutlinePixels > 0, 'Complete B must add exterior outline pixels');
check(formChangedPixels > 0, 'Form must shade source pixels');

rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_SATYR_CALIBRATION_REGISTRY, spec, 'down', 'idle', 1, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'authorizes only the first Idle pose',
  'Idle frame 2 rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_SATYR_CALIBRATION_REGISTRY, spec, 'down', 'walk', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'authorizes only the first Idle pose',
  'Walk rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_SATYR_CALIBRATION_REGISTRY, { kind: 'enemy', family: 'centaur', variant: 'steppe-hunter' }, 'down', 'idle', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'is not implemented',
  'Centaur rendering',
);

const candidateDigest = createHash('sha256').update(JSON.stringify(frameRecords)).digest('hex');
check(candidateDigest === EN_E03_SATYR_CALIBRATION_GATE.candidateFrameDigest, 'the Briar Reveler F1 pixels drifted');

if (errors.length) {
  console.error('EN-E03 Briar Reveler calibration validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E03 Briar Reveler calibration validation passed.');
console.log('- Candidate scope: 1 family / 1 variant / 4 first-Idle-pose directions');
console.log('- Connected horned digitigrade silhouettes: 4 / 4');
console.log('- Four split-hoof contact tips: 4 / 4 directions');
console.log('- Complete B added pixels: ' + completeOutlinePixels);
console.log('- Form-shaded source pixels: ' + formChangedPixels);
console.log('- Public EN-E03 families: 0');
console.log('- Candidate frame digest: ' + candidateDigest);
