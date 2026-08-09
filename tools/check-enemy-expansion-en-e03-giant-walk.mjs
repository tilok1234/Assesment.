import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { EN_E03_IDLE_GATE } from '../engine/enemy-expansion-en-e03.js';
import {
  EN_E03_GIANT_IDLE_GATE,
  EN_E03_GIANT_IDLE_REGISTRY,
} from '../engine/enemy-expansion-en-e03-giant-idle.js';
import {
  EN_E03_GIANT_WALK_FAMILY,
  EN_E03_GIANT_WALK_GATE,
  EN_E03_GIANT_WALK_REGISTRY,
} from '../engine/enemy-expansion-en-e03-giant-walk.js';
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

function opaquePixelsAtRow(alpha, row) {
  let opaque = 0;
  for (let x = 0; x < engine.SIZE; x++) {
    if (alpha[(row * engine.SIZE) + x] !== 0) opaque++;
  }
  return opaque;
}

function footContactAlpha(captured) {
  const start = 18 * engine.SIZE;
  const end = 23 * engine.SIZE;
  return Array.from(captured.alpha.slice(start, end)).join('');
}

check(EN_E03_GIANT_IDLE_GATE.status === 'approved', 'the Hill Breaker two-frame Idle baseline must remain visually approved');
check(EN_E03_GIANT_WALK_GATE.status === 'approved', 'the Hill Breaker Walk gate must remain visually approved');
check(EN_E03_GIANT_WALK_GATE.authorizedOn === '2026-08-04', 'the Hill Breaker Walk gate must record its authorization date');
check(EN_E03_GIANT_WALK_GATE.authorizationEvidence === 'Designer approved the next bounded EN-E03 gate and said: lets do next.', 'the Hill Breaker Walk gate must retain exact authorization evidence');
check(EN_E03_GIANT_WALK_GATE.approvedOn === '2026-08-06', 'the Hill Breaker Walk gate must record its visual approval date');
check(EN_E03_GIANT_WALK_GATE.approvalEvidence === 'Designer reviewed the exact Hill Breaker Walk raw and Complete B + Form boards and said: yes sir seems fine to me approved.', 'the Hill Breaker Walk gate must retain exact approval evidence');
check(EN_E03_GIANT_WALK_GATE.approvedIdle.gateId === EN_E03_GIANT_IDLE_GATE.id, 'the Walk gate must identify the approved Idle baseline');
check(EN_E03_GIANT_WALK_GATE.approvedIdle.artifactSha256 === EN_E03_GIANT_IDLE_GATE.artifactSha256, 'the Walk gate must retain the approved raw Idle hash');
check(EN_E03_GIANT_WALK_GATE.approvedIdle.assembledArtifactSha256 === EN_E03_GIANT_IDLE_GATE.assembledArtifactSha256, 'the Walk gate must retain the approved assembled Idle hash');
check(EN_E03_GIANT_WALK_GATE.approvedIdle.frameDigest === EN_E03_GIANT_IDLE_GATE.candidateFrameDigest, 'the Walk gate must retain the approved Idle frame digest');
check(EN_E03_GIANT_WALK_GATE.artifactSha256 === 'bc6302036e4b3c8f45c59195659726408721d3dbdac3b1b670f2543d46213420', 'the raw Walk review hash must remain frozen');
check(EN_E03_GIANT_WALK_GATE.assembledArtifactSha256 === '19ce1476461bf623e5dc909216021e64c61b40f168ec175cb0a60dcf3e338339', 'the assembled Walk review hash must remain frozen');
check(EN_E03_GIANT_WALK_GATE.candidateFrameDigest === '9f41b2b90b245fe7d6302f87ddcd9313cdedc5360ddc245a4d61c8beab958622', 'the 16-frame Walk digest must remain frozen');
check(EN_E03_GIANT_WALK_GATE.scope.includes('four Walk frames across Down, Left, Right, and Up'), 'the Walk gate must name its exact four-direction/four-frame scope');
check(EN_E03_GIANT_WALK_GATE.exclusions.includes('Idle pixel changes'), 'the Walk gate must protect the approved Idle pixels');
check(EN_E03_GIANT_WALK_GATE.exclusions.includes('Centaur') && EN_E03_GIANT_WALK_GATE.exclusions.includes('Satyr'), 'the Walk gate must exclude the other EN-E03 families');
check(EN_E03_GIANT_WALK_GATE.exclusions.includes('Attack') && EN_E03_GIANT_WALK_GATE.exclusions.includes('registration'), 'the Walk gate must exclude later motion and public routing');
check(EN_E03_GIANT_WALK_GATE.nextGate.includes('Steppe Hunter common Walk W1-W4'), 'the Walk gate must record the authorized Steppe Hunter continuation');
check(Object.isFrozen(EN_E03_GIANT_WALK_GATE) && Object.isFrozen(EN_E03_GIANT_WALK_GATE.approvedIdle) && Object.isFrozen(EN_E03_GIANT_WALK_GATE.exclusions), 'the Walk gate must be deeply immutable');

check(EN_E03_IDLE_GATE.artifactSha256 === '059f7c4945cffacf4e53e2d9435566479adf08ec754ed8f0faca520958908aa2', 'the rejected v2 raw review hash must remain frozen');
check(EN_E03_IDLE_GATE.assembledArtifactSha256 === '2835b044868cd948fbb7327675f5821adfe499507a08d0e8350f83cff5e2ab89', 'the rejected v2 assembled review hash must remain frozen');
check(EN_E03_IDLE_GATE.candidateFrameDigest === '8339d3d4a2380f8e9d9bf6ecb3fa1a5f0faddafc0bf6ce43c3ce12c515a1a059', 'the rejected v2 frame digest must remain frozen');

check(EN_E03_GIANT_WALK_REGISTRY.families.length === 1, 'the Walk registry must contain exactly one family');
check(EN_E03_GIANT_WALK_REGISTRY.families[0].id === 'giant', 'the Walk registry must contain only Giant');
check(EN_E03_GIANT_WALK_REGISTRY.families[0].variants.length === 1, 'the Walk registry must contain exactly one variant');
check(EN_E03_GIANT_WALK_REGISTRY.families[0].variants[0].id === 'hill-breaker', 'the Walk registry must contain only Hill Breaker');
check(EN_E03_GIANT_WALK_REGISTRY.publicFamilies.length === 0 && EN_E03_GIANT_WALK_REGISTRY.approvedFamilies.length === 0, 'the visually approved Walk baseline must remain internal and outside registry approval/public routing');
check(EN_E03_GIANT_WALK_REGISTRY.renderers[0].chassis === 'humanoid-v1', 'the Walk renderer must retain the approved roster chassis');
check(Object.isFrozen(EN_E03_GIANT_WALK_REGISTRY) && Object.isFrozen(EN_E03_GIANT_WALK_FAMILY), 'the Walk registry and family must be immutable');

check(engine.PUBLIC_ENEMIES.length === 74, 'the Walk candidate must not alter the later 74-family public catalog');
check(engine.ENEMIES.length === 57, 'the Walk candidate must not alter the 57-family legacy catalog');
check(!engine.PUBLIC_ENEMIES.some((family) => family.id === 'giant'), 'Giant must remain absent from public consumers');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!facadeSource.includes('enemy-expansion-en-e03-giant-walk'), 'the public facade must not import the Giant Walk candidate module');
check(!facadeSource.includes('EN_E03_GIANT_WALK'), 'the public facade must not expose Giant Walk candidate symbols');

const spec = { kind: 'enemy', family: 'giant', variant: 'hill-breaker' };
const walkFrames = new Map();
const walkRecords = [];
const delegatedIdleRecords = [];
let completeOutlinePixels = 0;
let formChangedPixels = 0;
let plantedContactChecks = 0;

for (const direction of engine.DIRS) for (let frame = 0; frame < 2; frame++) {
  const approved = captureEnemyExpansionFrame(EN_E03_GIANT_IDLE_REGISTRY, spec, direction, 'idle', frame, engine.SIZE);
  const delegated = captureEnemyExpansionFrame(EN_E03_GIANT_WALK_REGISTRY, spec, direction, 'idle', frame, engine.SIZE);
  check(JSON.stringify(delegated.pixels) === JSON.stringify(approved.pixels), direction + '/Idle F' + (frame + 1) + ' must delegate to the exact approved baseline');
  check(delegated.digest === approved.digest && delegated.alphaDigest === approved.alphaDigest, direction + '/Idle F' + (frame + 1) + ' hashes must remain exact');
  delegatedIdleRecords.push({
    family: 'giant',
    variant: 'hill-breaker',
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
  const captured = captureEnemyExpansionFrame(EN_E03_GIANT_WALK_REGISTRY, spec, direction, 'walk', frame, engine.SIZE);
  walkFrames.set(direction + '/' + frame, captured);
  check(captured.outOfBoundsWrites.length === 0, direction + '/W' + (frame + 1) + ' wrote outside the 24x24 cell');
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22, direction + '/W' + (frame + 1) + ' must preserve a one-cell margin');
  check(componentCount(captured.pixels) === 1, direction + '/W' + (frame + 1) + ' must have one connected silhouette');
  check(captured.alpha.every((value) => value === 0 || value === 255), direction + '/W' + (frame + 1) + ' must use binary alpha');
  check(opaquePixelsAtRow(captured.alpha, captured.bounds.maxY) > 0, direction + '/W' + (frame + 1) + ' must retain planted Giant ground contact');
  plantedContactChecks++;
  const rendererData = EN_E03_GIANT_WALK_REGISTRY.families[0].variants[0].rendererData;
  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, rendererData);
  completeOutlinePixels += presentation.complete.filter((color, index) => color !== null && captured.pixels[index] === null).length;
  formChangedPixels += presentation.form.filter((color, index) => captured.pixels[index] !== null && color !== captured.pixels[index]).length;
  walkRecords.push({
    family: 'giant',
    variant: 'hill-breaker',
    direction,
    animation: 'walk',
    frame,
    digest: captured.digest,
    alphaDigest: captured.alphaDigest,
    opaquePixels: captured.opaquePixels,
    bounds: captured.bounds,
  });
}

check(createHash('sha256').update(JSON.stringify(delegatedIdleRecords)).digest('hex') === EN_E03_GIANT_IDLE_GATE.candidateFrameDigest, 'the delegated approved Idle records drifted');
for (const direction of engine.DIRS) {
  const first = walkFrames.get(direction + '/0');
  const passingA = walkFrames.get(direction + '/1');
  const third = walkFrames.get(direction + '/2');
  const passingB = walkFrames.get(direction + '/3');
  check(first.alphaDigest !== passingA.alphaDigest, direction + ' W1 must differ visibly from the passing pose');
  check(third.alphaDigest !== passingA.alphaDigest, direction + ' W3 must differ visibly from the passing pose');
  check(first.alphaDigest !== third.alphaDigest, direction + ' W1 and W3 must use opposite stride silhouettes');
  check(passingA.digest === passingB.digest && passingA.alphaDigest === passingB.alphaDigest, direction + ' W2 and W4 must preserve the deliberate shared passing pose');
  const contactCycle = [first, passingA, third, passingB].map(footContactAlpha);
  check(contactCycle[0] !== contactCycle[2], direction + ' W1 and W3 must retain opposite foot-contact silhouettes');
  check(new Set(contactCycle).size === 3, direction + ' Walk must retain three distinct foot-contact silhouettes with only W2/W4 shared');
  check(first.bounds.minY === 1 && third.bounds.minY === 1, direction + ' W1/W3 must retain the full-height weight poses');
  check(passingA.bounds.minY === 2 && passingB.bounds.minY === 2, direction + ' W2/W4 must retain the one-pixel passing dip');
  check(first.bounds.maxY === passingA.bounds.maxY && first.bounds.maxY === third.bounds.maxY && first.bounds.maxY === passingB.bounds.maxY, direction + ' Walk must keep a planted ground-contact baseline');
}
check(new Set(walkRecords.map((record) => record.alphaDigest)).size === 12, 'the 16 Walk frames must retain 12 distinct silhouettes with only W2/W4 shared per direction');
check(completeOutlinePixels > 0, 'Complete B must add exterior outline pixels');
check(formChangedPixels > 0, 'Form must shade source pixels');

rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_GIANT_WALK_REGISTRY, spec, 'down', 'attack', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'authorizes only approved Idle and four Walk frames',
  'Attack rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_GIANT_WALK_REGISTRY, { kind: 'enemy', family: 'centaur', variant: 'steppe-hunter' }, 'down', 'walk', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'is not implemented',
  'Centaur rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_GIANT_WALK_REGISTRY, { kind: 'enemy', family: 'satyr', variant: 'briar-reveler' }, 'down', 'walk', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'is not implemented',
  'Satyr rendering',
);

const candidateDigest = createHash('sha256').update(JSON.stringify(walkRecords)).digest('hex');
check(candidateDigest === EN_E03_GIANT_WALK_GATE.candidateFrameDigest, 'the Hill Breaker Walk pixels drifted');

if (errors.length) {
  console.error('EN-E03 Hill Breaker Walk validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E03 Hill Breaker four-frame Walk validation passed.');
console.log('- Candidate scope: 1 family / 1 variant / 16 Walk frames');
console.log('- Approved Idle frames preserved: 8 / 8');
console.log('- Connected hard-alpha silhouettes: 16 / 16');
console.log('- Planted ground-contact checks: ' + plantedContactChecks + ' / 16');
console.log('- Distinct foot-contact cycles: 3 / 4 per direction (W2/W4 shared)');
console.log('- Distinct Walk silhouettes: 12 / 16 (W2/W4 shared per direction)');
console.log('- Complete B added pixels: ' + completeOutlinePixels);
console.log('- Form-shaded source pixels: ' + formChangedPixels);
console.log('- Public EN-E03 families: 0');
console.log('- Candidate frame digest: ' + candidateDigest);
