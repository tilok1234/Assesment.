import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { EN_E03_IDLE_GATE } from '../engine/enemy-expansion-en-e03.js';
import { EN_E03_GIANT_CALIBRATION_GATE } from '../engine/enemy-expansion-en-e03-calibration.js';
import {
  EN_E03_GIANT_IDLE_FAMILY,
  EN_E03_GIANT_IDLE_GATE,
  EN_E03_GIANT_IDLE_REGISTRY,
} from '../engine/enemy-expansion-en-e03-giant-idle.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import { captureEnemyExpansionFrame } from './enemy-expansion-review-pixels.mjs';

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

check(EN_E03_GIANT_CALIBRATION_GATE.status === 'approved', 'the first-pose calibration must remain approved');
check(EN_E03_GIANT_IDLE_GATE.status === 'approved', 'the two-frame Giant Idle gate must remain visually approved');
check(EN_E03_GIANT_IDLE_GATE.authorizedOn === '2026-08-03', 'the two-frame gate must record its authorization date');
check(EN_E03_GIANT_IDLE_GATE.approvedOn === '2026-08-03', 'the two-frame gate must record its visual approval date');
check(EN_E03_GIANT_IDLE_GATE.approvalEvidence === 'Designer reviewed the exact raw and Complete B + Form F1/F2 boards and said: approved.', 'the two-frame gate must retain the exact approval evidence');
check(EN_E03_GIANT_IDLE_GATE.approvedSeed.gateId === EN_E03_GIANT_CALIBRATION_GATE.id, 'the two-frame gate must identify the approved first-pose seed');
check(EN_E03_GIANT_IDLE_GATE.approvedSeed.artifactSha256 === EN_E03_GIANT_CALIBRATION_GATE.artifactSha256, 'the two-frame gate must retain the approved raw seed hash');
check(EN_E03_GIANT_IDLE_GATE.approvedSeed.assembledArtifactSha256 === EN_E03_GIANT_CALIBRATION_GATE.assembledArtifactSha256, 'the two-frame gate must retain the approved assembled seed hash');
check(EN_E03_GIANT_IDLE_GATE.approvedSeed.candidateFrameDigest === EN_E03_GIANT_CALIBRATION_GATE.candidateFrameDigest, 'the two-frame gate must retain the approved seed frame digest');
check(EN_E03_GIANT_IDLE_GATE.artifactSha256 === '21cb2a314b6fa5866ea4d708570513506c69c02befca739338df1b908fefc686', 'the approved raw F1/F2 artifact hash must remain frozen');
check(EN_E03_GIANT_IDLE_GATE.assembledArtifactSha256 === '2bcad3208b2571764f1938f0be52383d1cb4128a191b74ed7d669fd8e8c48faf', 'the approved assembled F1/F2 artifact hash must remain frozen');
check(EN_E03_GIANT_IDLE_GATE.candidateFrameDigest === '2ae3904669508afbabed0742d72d4d334f37cdee360ba4f4d1a11767d22ee5ab', 'the approved F1/F2 frame digest must remain frozen');
check(EN_E03_GIANT_IDLE_GATE.exclusions.includes('Centaur') && EN_E03_GIANT_IDLE_GATE.exclusions.includes('Satyr'), 'the two-frame gate must exclude the other EN-E03 families');
check(EN_E03_GIANT_IDLE_GATE.exclusions.includes('Walk') && EN_E03_GIANT_IDLE_GATE.exclusions.includes('registration'), 'the two-frame gate must exclude later motion and public routing');
check(Object.isFrozen(EN_E03_GIANT_IDLE_GATE) && Object.isFrozen(EN_E03_GIANT_IDLE_GATE.exclusions), 'the two-frame gate must be deeply immutable');

check(EN_E03_IDLE_GATE.artifactSha256 === '059f7c4945cffacf4e53e2d9435566479adf08ec754ed8f0faca520958908aa2', 'the rejected v2 raw review hash must remain frozen');
check(EN_E03_IDLE_GATE.assembledArtifactSha256 === '2835b044868cd948fbb7327675f5821adfe499507a08d0e8350f83cff5e2ab89', 'the rejected v2 assembled review hash must remain frozen');
check(EN_E03_IDLE_GATE.candidateFrameDigest === '8339d3d4a2380f8e9d9bf6ecb3fa1a5f0faddafc0bf6ce43c3ce12c515a1a059', 'the rejected v2 frame digest must remain frozen');

check(EN_E03_GIANT_IDLE_REGISTRY.families.length === 1, 'the Giant Idle registry must contain exactly one family');
check(EN_E03_GIANT_IDLE_REGISTRY.families[0].id === 'giant', 'the Giant Idle registry must contain only Giant');
check(EN_E03_GIANT_IDLE_REGISTRY.families[0].variants.length === 1, 'the Giant Idle registry must contain exactly one variant');
check(EN_E03_GIANT_IDLE_REGISTRY.families[0].variants[0].id === 'hill-breaker', 'the Giant Idle registry must contain only Hill Breaker');
check(EN_E03_GIANT_IDLE_REGISTRY.publicFamilies.length === 0 && EN_E03_GIANT_IDLE_REGISTRY.approvedFamilies.length === 0, 'the Giant Idle candidate must remain internal and unapproved');
check(EN_E03_GIANT_IDLE_REGISTRY.renderers[0].chassis === 'humanoid-v1', 'the Giant Idle renderer must retain the approved roster chassis');
check(Object.isFrozen(EN_E03_GIANT_IDLE_REGISTRY) && Object.isFrozen(EN_E03_GIANT_IDLE_FAMILY), 'the Giant Idle registry and family must be immutable');

check(engine.PUBLIC_ENEMIES.length === 74, 'the Giant Idle candidate must not alter the later 74-family public catalog');
check(engine.ENEMIES.length === 57, 'the Giant Idle candidate must not alter the 57-family legacy catalog');
check(!engine.PUBLIC_ENEMIES.some((family) => family.id === 'giant'), 'Giant must remain absent from public consumers');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!facadeSource.includes('enemy-expansion-en-e03-giant-idle'), 'the public facade must not import the Giant Idle candidate module');
check(!facadeSource.includes('EN_E03_GIANT_IDLE'), 'the public facade must not expose Giant Idle candidate symbols');

const spec = { kind: 'enemy', family: 'giant', variant: 'hill-breaker' };
const frameRecords = [];
const seedRecords = [];
const byDirection = new Map();
let completeOutlinePixels = 0;
let formChangedPixels = 0;
for (const direction of engine.DIRS) for (let frame = 0; frame < 2; frame++) {
  const captured = captureEnemyExpansionFrame(EN_E03_GIANT_IDLE_REGISTRY, spec, direction, 'idle', frame, engine.SIZE);
  byDirection.set(direction + '/' + frame, captured);
  check(captured.outOfBoundsWrites.length === 0, direction + '/F' + (frame + 1) + ' wrote outside the 24x24 cell');
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22, direction + '/F' + (frame + 1) + ' must preserve a one-cell margin');
  check(componentCount(captured.pixels) === 1, direction + '/F' + (frame + 1) + ' must have one connected silhouette');
  check(captured.alpha.every((value) => value === 0 || value === 255), direction + '/F' + (frame + 1) + ' must use binary alpha');
  const rendererData = EN_E03_GIANT_IDLE_REGISTRY.families[0].variants[0].rendererData;
  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, rendererData);
  completeOutlinePixels += presentation.complete.filter((color, index) => color !== null && captured.pixels[index] === null).length;
  formChangedPixels += presentation.form.filter((color, index) => captured.pixels[index] !== null && color !== captured.pixels[index]).length;
  const record = {
    family: 'giant',
    variant: 'hill-breaker',
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
check(seedDigest === EN_E03_GIANT_CALIBRATION_GATE.candidateFrameDigest, 'the approved first-pose pixels drifted while adding frame 2');
for (const direction of engine.DIRS) {
  const first = byDirection.get(direction + '/0');
  const second = byDirection.get(direction + '/1');
  check(first.digest !== second.digest, direction + ' F2 must differ from the approved F1');
  check(first.bounds.maxY === second.bounds.maxY, direction + ' F2 must keep the planted-foot baseline');
  const contactStart = (engine.SIZE - 3) * engine.SIZE;
  check(
    JSON.stringify([...first.alpha.slice(contactStart)]) === JSON.stringify([...second.alpha.slice(contactStart)]),
    direction + ' F2 must preserve the approved bottom three contact rows exactly',
  );
}
check(new Set(engine.DIRS.map((direction) => byDirection.get(direction + '/1').alphaDigest)).size === 4, 'the F2 directional silhouettes must remain distinct');
check(completeOutlinePixels > 0, 'Complete B must add exterior outline pixels');
check(formChangedPixels > 0, 'Form must shade source pixels');

rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_GIANT_IDLE_REGISTRY, spec, 'down', 'walk', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'authorizes only two Idle frames',
  'Walk rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_GIANT_IDLE_REGISTRY, { kind: 'enemy', family: 'centaur', variant: 'steppe-hunter' }, 'down', 'idle', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'is not implemented',
  'Centaur rendering',
);

const candidateDigest = createHash('sha256').update(JSON.stringify(frameRecords)).digest('hex');
check(candidateDigest === EN_E03_GIANT_IDLE_GATE.candidateFrameDigest, 'the approved F1/F2 pixels drifted');

if (errors.length) {
  console.error('EN-E03 Hill Breaker Idle validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E03 Hill Breaker two-frame Idle validation passed.');
console.log('- Candidate scope: 1 family / 1 variant / 8 Idle frames');
console.log('- Approved F1 frames preserved: 4 / 4');
console.log('- New F2 frames: 4 / 4');
console.log('- Connected silhouettes: 8 / 8');
console.log('- Complete B added pixels: ' + completeOutlinePixels);
console.log('- Form-shaded source pixels: ' + formChangedPixels);
console.log('- Public EN-E03 families: 0');
console.log('- Candidate frame digest: ' + candidateDigest);
