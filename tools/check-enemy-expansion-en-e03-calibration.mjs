import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { EN_E03_IDLE_GATE } from '../engine/enemy-expansion-en-e03.js';
import {
  EN_E03_GIANT_CALIBRATION_FAMILY,
  EN_E03_GIANT_CALIBRATION_GATE,
  EN_E03_GIANT_CALIBRATION_REGISTRY,
  EN_E03_HILL_BREAKER_CALIBRATION_DATA,
} from '../engine/enemy-expansion-en-e03-calibration.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import {
  captureEnemyExpansionFrame,
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

check(EN_E03_GIANT_CALIBRATION_GATE.status === 'approved', 'the calibration must record exact designer approval');
check(EN_E03_GIANT_CALIBRATION_GATE.authorizedOn === '2026-08-03', 'the calibration must record its authorization date');
check(EN_E03_GIANT_CALIBRATION_GATE.approvedOn === '2026-08-03', 'the calibration must record its approval date');
check(EN_E03_GIANT_CALIBRATION_GATE.artifactSha256 === '4dae138234132d6249f36783dcb753716e6556791051c60c7ef92d6e73956e95', 'the approved raw calibration hash must remain frozen');
check(EN_E03_GIANT_CALIBRATION_GATE.assembledArtifactSha256 === '70fce189859c2c86d102b2db9f3b3ea5bac47b9f5f32c172adc70a612eafa605', 'the approved assembled calibration hash must remain frozen');
check(EN_E03_GIANT_CALIBRATION_GATE.candidateFrameDigest === '019ec9d11daac3d626d1c33693dc707ba98c6ade1c7647f82a5dc5a5a7fa2602', 'the approved calibration frame digest must remain frozen');
check(EN_E03_GIANT_CALIBRATION_GATE.scope.includes('first Idle pose only'), 'the gate must name the one-pose scope');
check(EN_E03_GIANT_CALIBRATION_GATE.exclusions.includes('Idle frame 2'), 'the gate must exclude the second Idle frame');
check(EN_E03_GIANT_CALIBRATION_GATE.exclusions.includes('Centaur') && EN_E03_GIANT_CALIBRATION_GATE.exclusions.includes('Satyr'), 'the gate must exclude the other EN-E03 families');
check(EN_E03_GIANT_CALIBRATION_GATE.exclusions.includes('registration') && EN_E03_GIANT_CALIBRATION_GATE.exclusions.includes('consumer exposure'), 'the gate must exclude public routing');
check(Object.isFrozen(EN_E03_GIANT_CALIBRATION_GATE) && Object.isFrozen(EN_E03_GIANT_CALIBRATION_GATE.exclusions), 'the calibration gate must be deeply immutable');

check(EN_E03_IDLE_GATE.artifactSha256 === '059f7c4945cffacf4e53e2d9435566479adf08ec754ed8f0faca520958908aa2', 'the rejected v2 raw review hash must remain frozen');
check(EN_E03_IDLE_GATE.assembledArtifactSha256 === '2835b044868cd948fbb7327675f5821adfe499507a08d0e8350f83cff5e2ab89', 'the rejected v2 assembled review hash must remain frozen');
check(EN_E03_IDLE_GATE.candidateFrameDigest === '8339d3d4a2380f8e9d9bf6ecb3fa1a5f0faddafc0bf6ce43c3ce12c515a1a059', 'the rejected v2 frame digest must remain frozen');

check(EN_E03_GIANT_CALIBRATION_REGISTRY.families.length === 1, 'the calibration registry must contain exactly one family');
check(EN_E03_GIANT_CALIBRATION_REGISTRY.families[0].id === 'giant', 'the calibration registry must contain only Giant');
check(EN_E03_GIANT_CALIBRATION_REGISTRY.families[0].variants.length === 1, 'the calibration registry must contain exactly one variant');
check(EN_E03_GIANT_CALIBRATION_REGISTRY.families[0].variants[0].id === 'hill-breaker', 'the calibration registry must contain only Hill Breaker');
check(EN_E03_GIANT_CALIBRATION_REGISTRY.publicFamilies.length === 0 && EN_E03_GIANT_CALIBRATION_REGISTRY.approvedFamilies.length === 0, 'the calibration must remain internal and unapproved');
check(EN_E03_GIANT_CALIBRATION_REGISTRY.renderers[0].chassis === 'humanoid-v1', 'the calibration must reuse the approved roster chassis');
check(Object.isFrozen(EN_E03_GIANT_CALIBRATION_REGISTRY) && Object.isFrozen(EN_E03_GIANT_CALIBRATION_FAMILY), 'the calibration registry and family must be immutable');
check(EN_E03_HILL_BREAKER_CALIBRATION_DATA.actor.bodyBuild === 'sturdy', 'Hill Breaker must use the approved sturdy body profile');
check(EN_E03_HILL_BREAKER_CALIBRATION_DATA.actor.outfit === 'barbarian', 'Hill Breaker must use the approved rough outfit grammar');
check(EN_E03_HILL_BREAKER_CALIBRATION_DATA.actor.weapon === 'club', 'Hill Breaker must use the approved club renderer');

check(engine.PUBLIC_ENEMIES.length === 80, 'the calibration source must coexist with the later 80-family public catalog');
check(engine.ENEMIES.length === 57, 'the calibration must not alter the 57-family legacy catalog');
check(engine.PUBLIC_ENEMIES.some((family) => family.id === 'giant'), 'the later approved adoption must expose Giant in public consumers');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!facadeSource.includes('enemy-expansion-en-e03-calibration'), 'the public facade must not import the calibration module');
check(!facadeSource.includes('EN_E03_GIANT_CALIBRATION'), 'the public facade must not expose calibration symbols');

const spec = { kind: 'enemy', family: 'giant', variant: 'hill-breaker' };
const frames = new Map();
const frameRecords = [];
let completeOutlinePixels = 0;
let formChangedPixels = 0;
for (const direction of engine.DIRS) {
  const captured = captureEnemyExpansionFrame(EN_E03_GIANT_CALIBRATION_REGISTRY, spec, direction, 'idle', 0, engine.SIZE);
  frames.set(direction, captured);
  check(captured.outOfBoundsWrites.length === 0, direction + ' calibration wrote outside the 24x24 cell');
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22, direction + ' calibration must preserve a one-cell margin');
  check(componentCount(captured.pixels) === 1, direction + ' calibration must have one connected silhouette');
  check(captured.alpha.every((value) => value === 0 || value === 255), direction + ' calibration must use binary alpha');
  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E03_HILL_BREAKER_CALIBRATION_DATA);
  completeOutlinePixels += presentation.complete.filter((color, index) => color !== null && captured.pixels[index] === null).length;
  formChangedPixels += presentation.form.filter((color, index) => captured.pixels[index] !== null && color !== captured.pixels[index]).length;
  frameRecords.push({
    family: 'giant',
    variant: 'hill-breaker',
    direction,
    animation: 'idle',
    frame: 0,
    digest: captured.digest,
    alphaDigest: captured.alphaDigest,
    opaquePixels: captured.opaquePixels,
    bounds: captured.bounds,
  });
}

check(new Set(frameRecords.map((frame) => frame.alphaDigest)).size === 4, 'all four directional silhouettes must remain distinct');
check(frames.get('left').opaquePixels > 0 && frames.get('right').opaquePixels > 0, 'both handed side views must render');
check(completeOutlinePixels > 0, 'Complete B must add exterior outline pixels');
check(formChangedPixels > 0, 'Form must shade source pixels');

rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_GIANT_CALIBRATION_REGISTRY, spec, 'down', 'idle', 1, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'authorizes only the first Idle pose',
  'Idle frame 2 rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_GIANT_CALIBRATION_REGISTRY, spec, 'down', 'walk', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'authorizes only the first Idle pose',
  'Walk rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_GIANT_CALIBRATION_REGISTRY, { kind: 'enemy', family: 'centaur', variant: 'steppe-hunter' }, 'down', 'idle', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'is not implemented',
  'Centaur rendering',
);

const candidateDigest = createHash('sha256').update(JSON.stringify(frameRecords)).digest('hex');
check(candidateDigest === EN_E03_GIANT_CALIBRATION_GATE.candidateFrameDigest, 'the approved calibration frame pixels drifted');

if (errors.length) {
  console.error('EN-E03 Giant calibration validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E03 Giant calibration validation passed.');
console.log('- Candidate scope: 1 family / 1 variant / 4 first-Idle-pose directions');
console.log('- Connected silhouettes: 4 / 4');
console.log('- Complete B added pixels: ' + completeOutlinePixels);
console.log('- Form-shaded source pixels: ' + formChangedPixels);
console.log('- Public EN-E03 families: 0');
console.log('- Candidate frame digest: ' + candidateDigest);
