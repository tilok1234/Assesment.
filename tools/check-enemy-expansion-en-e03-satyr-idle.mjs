import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { EN_E03_IDLE_GATE } from '../engine/enemy-expansion-en-e03.js';
import {
  EN_E03_BRIAR_REVELER_CALIBRATION_DATA,
  EN_E03_SATYR_CALIBRATION_GATE,
  EN_E03_SATYR_CALIBRATION_REGISTRY,
} from '../engine/enemy-expansion-en-e03-satyr-calibration.js';
import {
  EN_E03_SATYR_IDLE_FAMILY,
  EN_E03_SATYR_IDLE_GATE,
  EN_E03_SATYR_IDLE_REGISTRY,
} from '../engine/enemy-expansion-en-e03-satyr-idle.js';
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

function pixelAt(captured, x, y) {
  return captured.pixels[(y * engine.SIZE) + x];
}

check(EN_E03_SATYR_CALIBRATION_GATE.status === 'approved', 'the Briar Reveler F1 seed must remain visually approved');
check(EN_E03_SATYR_CALIBRATION_GATE.approvedOn === '2026-08-03', 'the Briar Reveler F1 seed must retain its approval date');
check(EN_E03_SATYR_CALIBRATION_GATE.approvalEvidence === 'Designer reviewed the exact Briar Reveler F1 raw and Complete B + Form boards and said: looks good.', 'the Briar Reveler F1 seed must retain exact approval evidence');
check(EN_E03_SATYR_CALIBRATION_GATE.nextGate === 'Authorized on 2026-08-03: Briar Reveler Idle frame 2 only across Down, Left, Right, and Up, preserving the exact approved F1 evidence.', 'the Briar Reveler F1 seed must authorize only the bounded F2 continuation');
check(EN_E03_SATYR_IDLE_GATE.status === 'approved', 'the Briar Reveler F1/F2 gate must remain visually approved');
check(EN_E03_SATYR_IDLE_GATE.authorizedOn === '2026-08-03', 'the Briar Reveler F1/F2 gate must record its authorization date');
check(EN_E03_SATYR_IDLE_GATE.authorizationEvidence === 'Designer approved the exact Briar Reveler F1 gate and said: lets go next.', 'the Briar Reveler F1/F2 gate must retain exact authorization evidence');
check(EN_E03_SATYR_IDLE_GATE.approvedOn === '2026-08-04', 'the Briar Reveler F1/F2 gate must retain its approval date');
check(EN_E03_SATYR_IDLE_GATE.approvalEvidence === 'Designer reviewed the exact Briar Reveler F1/F2 raw and Complete B + Form boards and said: approved.', 'the Briar Reveler F1/F2 gate must retain exact approval evidence');
check(EN_E03_SATYR_IDLE_GATE.approvedSeed.gateId === EN_E03_SATYR_CALIBRATION_GATE.id, 'the Briar Reveler F1/F2 gate must identify the approved F1 seed');
check(EN_E03_SATYR_IDLE_GATE.approvedSeed.artifactSha256 === EN_E03_SATYR_CALIBRATION_GATE.artifactSha256, 'the Briar Reveler F1/F2 gate must retain the approved F1 raw hash');
check(EN_E03_SATYR_IDLE_GATE.approvedSeed.assembledArtifactSha256 === EN_E03_SATYR_CALIBRATION_GATE.assembledArtifactSha256, 'the Briar Reveler F1/F2 gate must retain the approved F1 assembled hash');
check(EN_E03_SATYR_IDLE_GATE.approvedSeed.candidateFrameDigest === EN_E03_SATYR_CALIBRATION_GATE.candidateFrameDigest, 'the Briar Reveler F1/F2 gate must retain the approved F1 frame digest');
check(EN_E03_SATYR_IDLE_GATE.artifactSha256 === '8d3a960d62683e19694e28572f15117314fde9ccb7dd898ea9065d64da058204', 'the Briar Reveler F1/F2 raw artifact hash must remain frozen');
check(EN_E03_SATYR_IDLE_GATE.assembledArtifactSha256 === '4257e63a25a23631ff861b3752e03da0897a6ceaf5ef8cef6efccbd575f6b51e', 'the Briar Reveler F1/F2 assembled artifact hash must remain frozen');
check(EN_E03_SATYR_IDLE_GATE.candidateFrameDigest === '0d5599dcd452351903e5d56289596d2e75f59caf5c0b7a5525c7e375c39b36fa', 'the Briar Reveler F1/F2 frame digest must remain frozen');
check(EN_E03_SATYR_IDLE_GATE.scope.includes('Idle frame 1 and frame 2'), 'the Briar Reveler F1/F2 gate must name its approved two-pose scope');
check(EN_E03_SATYR_IDLE_GATE.exclusions.includes('Giant changes') && EN_E03_SATYR_IDLE_GATE.exclusions.includes('Centaur changes'), 'the Briar Reveler F1/F2 gate must protect Giant and Centaur');
check(EN_E03_SATYR_IDLE_GATE.exclusions.includes('Walk') && EN_E03_SATYR_IDLE_GATE.exclusions.includes('registration'), 'the Briar Reveler F1/F2 gate must exclude later motion and public routing');
check(EN_E03_SATYR_IDLE_GATE.nextGate === 'No later EN-E03 implementation gate is authorized. Any continuation requires a new explicitly bounded designer authorization.', 'the approved Briar Reveler F1/F2 gate must not authorize later work');
check(Object.isFrozen(EN_E03_SATYR_IDLE_GATE) && Object.isFrozen(EN_E03_SATYR_IDLE_GATE.approvedSeed) && Object.isFrozen(EN_E03_SATYR_IDLE_GATE.exclusions), 'the Briar Reveler F1/F2 gate must be deeply immutable');

check(EN_E03_IDLE_GATE.artifactSha256 === '059f7c4945cffacf4e53e2d9435566479adf08ec754ed8f0faca520958908aa2', 'the rejected v2 raw review hash must remain frozen');
check(EN_E03_IDLE_GATE.assembledArtifactSha256 === '2835b044868cd948fbb7327675f5821adfe499507a08d0e8350f83cff5e2ab89', 'the rejected v2 assembled review hash must remain frozen');
check(EN_E03_IDLE_GATE.candidateFrameDigest === '8339d3d4a2380f8e9d9bf6ecb3fa1a5f0faddafc0bf6ce43c3ce12c515a1a059', 'the rejected v2 frame digest must remain frozen');

check(EN_E03_SATYR_IDLE_REGISTRY.families.length === 1, 'the Briar Reveler F1/F2 registry must contain exactly one family');
check(EN_E03_SATYR_IDLE_REGISTRY.families[0].id === 'satyr', 'the Briar Reveler F1/F2 registry must contain only Satyr');
check(EN_E03_SATYR_IDLE_REGISTRY.families[0].variants.length === 1, 'the Briar Reveler F1/F2 registry must contain exactly one variant');
check(EN_E03_SATYR_IDLE_REGISTRY.families[0].variants[0].id === 'briar-reveler', 'the Briar Reveler F1/F2 registry must contain only the common Satyr variant');
check(EN_E03_SATYR_IDLE_REGISTRY.publicFamilies.length === 0 && EN_E03_SATYR_IDLE_REGISTRY.approvedFamilies.length === 0, 'the approved Briar Reveler F1/F2 baseline must remain outside production-approved/public registry state');
check(EN_E03_SATYR_IDLE_REGISTRY.renderers[0].chassis === 'humanoid-v1', 'the Briar Reveler F1/F2 renderer must reuse the approved humanoid chassis');
check(Object.isFrozen(EN_E03_SATYR_IDLE_REGISTRY) && Object.isFrozen(EN_E03_SATYR_IDLE_FAMILY), 'the Briar Reveler F1/F2 registry and family must be immutable');

check(engine.PUBLIC_ENEMIES.length === 70, 'the Briar Reveler F1/F2 gate must not alter the 70-family public catalog');
check(engine.ENEMIES.length === 57, 'the Briar Reveler F1/F2 gate must not alter the 57-family legacy catalog');
check(!engine.PUBLIC_ENEMIES.some((family) => family.id === 'satyr'), 'Satyr must remain absent from public consumers');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!facadeSource.includes('enemy-expansion-en-e03-satyr-idle'), 'the public facade must not import the Briar Reveler F1/F2 module');
check(!facadeSource.includes('EN_E03_SATYR_IDLE'), 'the public facade must not expose Briar Reveler F1/F2 symbols');

const spec = { kind: 'enemy', family: 'satyr', variant: 'briar-reveler' };
const frames = new Map();
const frameRecords = [];
const seedRecords = [];
let completeOutlinePixels = 0;
let formChangedPixels = 0;
let f2ChangedAlphaPixels = 0;
for (const direction of engine.DIRS) for (let frame = 0; frame < 2; frame++) {
  const captured = captureEnemyExpansionFrame(EN_E03_SATYR_IDLE_REGISTRY, spec, direction, 'idle', frame, engine.SIZE);
  frames.set(direction + '/' + frame, captured);
  check(captured.outOfBoundsWrites.length === 0, direction + ' Briar Reveler F' + (frame + 1) + ' wrote outside the 24x24 cell');
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22, direction + ' Briar Reveler F' + (frame + 1) + ' must preserve a one-cell margin');
  check(componentCount(captured.pixels) === 1, direction + ' Briar Reveler F' + (frame + 1) + ' must have one connected horned-body-tail-staff silhouette');
  check(captured.alpha.every((value) => value === 0 || value === 255), direction + ' Briar Reveler F' + (frame + 1) + ' must use binary alpha');
  check(opaqueRunsAtRow(captured.alpha, 22) === 4, direction + ' Briar Reveler F' + (frame + 1) + ' must show four separated cloven-hoof tips on the bottom occupied row');
  for (const color of EN_E03_BRIAR_REVELER_CALIBRATION_DATA.satyr.hoof) check(captured.colors.includes(color), direction + ' Briar Reveler F' + (frame + 1) + ' must use hoof color ' + color);
  for (const color of EN_E03_BRIAR_REVELER_CALIBRATION_DATA.satyr.horn) check(captured.colors.includes(color), direction + ' Briar Reveler F' + (frame + 1) + ' must use horn color ' + color);
  for (const color of EN_E03_BRIAR_REVELER_CALIBRATION_DATA.satyr.wood) check(captured.colors.includes(color), direction + ' Briar Reveler F' + (frame + 1) + ' must use staff color ' + color);
  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E03_BRIAR_REVELER_CALIBRATION_DATA);
  completeOutlinePixels += presentation.complete.filter((color, index) => color !== null && captured.pixels[index] === null).length;
  formChangedPixels += presentation.form.filter((color, index) => captured.pixels[index] !== null && color !== captured.pixels[index]).length;
  const record = {
    family: 'satyr',
    variant: 'briar-reveler',
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

for (const direction of engine.DIRS) {
  const approved = captureEnemyExpansionFrame(EN_E03_SATYR_CALIBRATION_REGISTRY, spec, direction, 'idle', 0, engine.SIZE);
  const delegated = frames.get(direction + '/0');
  const candidate = frames.get(direction + '/1');
  check(JSON.stringify(delegated.pixels) === JSON.stringify(approved.pixels), direction + ' Briar Reveler F1 pixels must delegate to the exact approved seed');
  check(delegated.digest === approved.digest && delegated.alphaDigest === approved.alphaDigest, direction + ' Briar Reveler F1 hashes must remain exact');
  const changed = changedAlphaPixels(delegated.alpha, candidate.alpha);
  check(changed >= 8, direction + ' Briar Reveler F2 must create a visible pose change instead of a color-only edit');
  f2ChangedAlphaPixels += changed;
}

check(createHash('sha256').update(JSON.stringify(seedRecords)).digest('hex') === EN_E03_SATYR_CALIBRATION_GATE.candidateFrameDigest, 'the delegated Briar Reveler F1 record digest must remain frozen');
check(pixelAt(frames.get('down/1'), 4, 15) === EN_E03_BRIAR_REVELER_CALIBRATION_DATA.satyr.hide[0], 'the front F2 tail must remain visible at the lowered trailing hip');
check(pixelAt(frames.get('up/1'), 17, 13) === EN_E03_BRIAR_REVELER_CALIBRATION_DATA.satyr.hide[0], 'the rear F2 tail must remain visible in its raised flick');
check(pixelAt(frames.get('right/1'), 4, 15) === EN_E03_BRIAR_REVELER_CALIBRATION_DATA.satyr.hide[0], 'the profile F2 tail must trail behind the lowered hip');
for (let frame = 0; frame < 2; frame++) {
  check(JSON.stringify(frames.get('left/' + frame).pixels) === JSON.stringify(mirrorPixels(frames.get('right/' + frame).pixels, engine.SIZE)), 'Briar Reveler F' + (frame + 1) + ' left profile must be the exact mirror of the right profile');
}
check(new Set(frameRecords.map((frame) => frame.alphaDigest)).size === 8, 'all eight Briar Reveler Idle silhouettes must remain distinct');
check(completeOutlinePixels > 0, 'Complete B must add exterior outline pixels');
check(formChangedPixels > 0, 'Form must shade source pixels');

rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_SATYR_IDLE_REGISTRY, spec, 'down', 'idle', 2, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'Expansion frame 2 is invalid for idle',
  'Idle frame 3 rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_SATYR_IDLE_REGISTRY, spec, 'down', 'walk', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'authorizes only two Idle frames',
  'Walk rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_SATYR_IDLE_REGISTRY, { kind: 'enemy', family: 'centaur', variant: 'steppe-hunter' }, 'down', 'idle', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'is not implemented',
  'Centaur rendering',
);

const candidateDigest = createHash('sha256').update(JSON.stringify(frameRecords)).digest('hex');
check(candidateDigest === EN_E03_SATYR_IDLE_GATE.candidateFrameDigest, 'the Briar Reveler F1/F2 pixels drifted');

if (errors.length) {
  console.error('EN-E03 Briar Reveler two-frame Idle validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E03 Briar Reveler two-frame Idle validation passed.');
console.log('- Approved internal scope: 1 family / 1 variant / 8 Idle frames');
console.log('- Approved F1 frames preserved: 4 / 4');
console.log('- New F2 frames: 4 / 4');
console.log('- Connected horned digitigrade silhouettes: 8 / 8');
console.log('- Four split-hoof contact tips: 8 / 8 frames');
console.log('- F2 changed alpha pixels: ' + f2ChangedAlphaPixels);
console.log('- Complete B added pixels: ' + completeOutlinePixels);
console.log('- Form-shaded source pixels: ' + formChangedPixels);
console.log('- Public EN-E03 families: 0');
console.log('- Approved frame digest: ' + candidateDigest);
