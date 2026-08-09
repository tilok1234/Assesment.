import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import {
  EN_E03_GIANT_IDLE_GATE,
  EN_E03_GIANT_IDLE_REGISTRY,
} from '../engine/enemy-expansion-en-e03-giant-idle.js';
import {
  EN_E03_GIANT_WALK_GATE,
  EN_E03_GIANT_WALK_REGISTRY,
} from '../engine/enemy-expansion-en-e03-giant-walk.js';
import {
  EN_E03_GIANT_ATTACK_GATE,
  EN_E03_GIANT_ATTACK_REGISTRY,
} from '../engine/enemy-expansion-en-e03-giant-attack.js';
import {
  EN_E03_GIANT_HURT_BODY_SHIFTS,
  EN_E03_GIANT_HURT_FAMILY,
  EN_E03_GIANT_HURT_GATE,
  EN_E03_GIANT_HURT_REGISTRY,
} from '../engine/enemy-expansion-en-e03-giant-hurt.js';
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
  for (let x = 0; x < engine.SIZE; x++) if (alpha[(row * engine.SIZE) + x] !== 0) opaque++;
  return opaque;
}

function alphaRegionSignature(captured, minX, maxX, minY, maxY) {
  const values = [];
  for (let y = minY; y <= maxY; y++) for (let x = minX; x <= maxX; x++) {
    values.push(captured.alpha[(y * engine.SIZE) + x]);
  }
  return JSON.stringify(values);
}

function frontBackFootAnchorSignature(captured) {
  const anchors = [
    [8, 20], [9, 20], [10, 20],
    [8, 21], [9, 21], [10, 21],
    [13, 20], [13, 21],
  ];
  return JSON.stringify(anchors.map(([x, y]) => captured.alpha[(y * engine.SIZE) + x]));
}

check(EN_E03_GIANT_IDLE_GATE.status === 'approved', 'the Hill Breaker Idle baseline must remain visually approved');
check(EN_E03_GIANT_WALK_GATE.status === 'approved', 'the Hill Breaker Walk baseline must remain visually approved');
check(EN_E03_GIANT_ATTACK_GATE.status === 'approved', 'the Hill Breaker Attack baseline must remain visually approved');
check(EN_E03_GIANT_HURT_GATE.status === 'approved', 'the Hill Breaker Hurt gate must retain direct visual approval');
check(EN_E03_GIANT_HURT_GATE.authorizedOn === '2026-08-07', 'the Hurt gate must record its authorization date');
check(EN_E03_GIANT_HURT_GATE.authorizationEvidence === 'Designer approved continuing the 80 plan, then explicitly accepted the proposed Hill Breaker Hurt H1-H2 scope with: lets go for it.', 'the Hurt gate must retain exact authorization evidence');
check(EN_E03_GIANT_HURT_GATE.approvedOn === '2026-08-07', 'the Hurt gate must retain its visual-approval date');
check(EN_E03_GIANT_HURT_GATE.approvalEvidence === 'Designer reviewed both exact labeled all-four-direction raw and Complete B + Form Hill Breaker Hurt animations together and said: approved.', 'the Hurt gate must retain exact visual-approval evidence');
check(EN_E03_GIANT_HURT_GATE.approvedIdle.gateId === EN_E03_GIANT_IDLE_GATE.id, 'the Hurt gate must identify the approved Idle baseline');
check(EN_E03_GIANT_HURT_GATE.approvedIdle.frameDigest === EN_E03_GIANT_IDLE_GATE.candidateFrameDigest, 'the Hurt gate must retain the approved Idle digest');
check(EN_E03_GIANT_HURT_GATE.approvedWalk.gateId === EN_E03_GIANT_WALK_GATE.id, 'the Hurt gate must identify the approved Walk baseline');
check(EN_E03_GIANT_HURT_GATE.approvedWalk.frameDigest === EN_E03_GIANT_WALK_GATE.candidateFrameDigest, 'the Hurt gate must retain the approved Walk digest');
check(EN_E03_GIANT_HURT_GATE.approvedAttack.gateId === EN_E03_GIANT_ATTACK_GATE.id, 'the Hurt gate must identify the approved Attack baseline');
check(EN_E03_GIANT_HURT_GATE.approvedAttack.artifactSha256 === EN_E03_GIANT_ATTACK_GATE.artifactSha256, 'the approved raw Attack hash must remain frozen');
check(EN_E03_GIANT_HURT_GATE.approvedAttack.assembledArtifactSha256 === EN_E03_GIANT_ATTACK_GATE.assembledArtifactSha256, 'the approved assembled Attack hash must remain frozen');
check(EN_E03_GIANT_HURT_GATE.approvedAttack.frameDigest === EN_E03_GIANT_ATTACK_GATE.candidateFrameDigest, 'the approved Attack digest must remain frozen');
check(EN_E03_GIANT_HURT_GATE.artifactSha256 === 'e621d1ed2898efdf9e49488aa367f7857b1c96f3b2ea1d9dd0dcd75dba2bcf02', 'the raw Hill Breaker Hurt review hash must remain frozen');
check(EN_E03_GIANT_HURT_GATE.assembledArtifactSha256 === '201f7c3246c0a924426201d1ad43b6f90849d9f4cd934b591b7d5a8bd6d9161c', 'the assembled Hill Breaker Hurt review hash must remain frozen');
check(EN_E03_GIANT_HURT_GATE.reviewAnimations.raw.sha256 === 'ebc7e3e1fcfad73aa0b8114e270dae2a699933aedc23b306a73edeec9214e5b6', 'the labeled raw four-direction Hurt animation hash must remain frozen');
check(EN_E03_GIANT_HURT_GATE.reviewAnimations.completeBForm.sha256 === 'f2034dd87706e196f1eece15f08db86dfb6e32a5437c18cdfe08e89b778ba3f4', 'the labeled Complete B + Form Hurt animation hash must remain frozen');
check(EN_E03_GIANT_HURT_GATE.reviewAnimations.raw.width === 192 && EN_E03_GIANT_HURT_GATE.reviewAnimations.raw.height === 224 && EN_E03_GIANT_HURT_GATE.reviewAnimations.raw.frames === 2 && EN_E03_GIANT_HURT_GATE.reviewAnimations.raw.durationMs === 280, 'the labeled raw Hurt animation geometry/timing must be exact');
check(EN_E03_GIANT_HURT_GATE.reviewAnimations.completeBForm.width === 192 && EN_E03_GIANT_HURT_GATE.reviewAnimations.completeBForm.height === 224 && EN_E03_GIANT_HURT_GATE.reviewAnimations.completeBForm.frames === 2 && EN_E03_GIANT_HURT_GATE.reviewAnimations.completeBForm.durationMs === 280, 'the labeled Complete B + Form Hurt animation geometry/timing must be exact');
check(EN_E03_GIANT_HURT_GATE.candidateFrameDigest === '92c18dc1dd0699e52f5f31a0900be1c6e46974c6f5bc3347fc7a7c7b65432340', 'the eight-frame Hill Breaker Hurt digest must remain frozen');
check(EN_E03_GIANT_HURT_GATE.scope.includes('H1-H2 across Down, Left, Right, and Up'), 'the Hurt gate must name its exact two-frame/four-direction scope');
check(EN_E03_GIANT_HURT_GATE.motion.includes('upper body and club together') && EN_E03_GIANT_HURT_GATE.motion.includes('feet stay planted'), 'the Hurt gate must describe its unified planted recoil');
check(EN_E03_GIANT_HURT_GATE.exclusions.includes('Idle pixel changes') && EN_E03_GIANT_HURT_GATE.exclusions.includes('Walk pixel changes') && EN_E03_GIANT_HURT_GATE.exclusions.includes('Attack pixel changes'), 'the Hurt gate must protect every approved Hill Breaker animation');
check(EN_E03_GIANT_HURT_GATE.exclusions.includes('Cast aliases') && EN_E03_GIANT_HURT_GATE.exclusions.includes('Death aliases'), 'the Hurt gate must exclude Cast and Death aliases');
check(EN_E03_GIANT_HURT_GATE.nextGate.includes('Visual approval is complete') && EN_E03_GIANT_HURT_GATE.nextGate.includes('this approval authorizes no later work'), 'the approved Hurt gate must stop without authorizing later EN-E03 work');
check(Object.isFrozen(EN_E03_GIANT_HURT_GATE) && Object.isFrozen(EN_E03_GIANT_HURT_GATE.approvedAttack) && Object.isFrozen(EN_E03_GIANT_HURT_GATE.reviewAnimations) && Object.isFrozen(EN_E03_GIANT_HURT_GATE.exclusions), 'the Hurt gate must be deeply immutable');

check(EN_E03_GIANT_HURT_REGISTRY.families.length === 1, 'the Hurt registry must contain exactly one family');
check(EN_E03_GIANT_HURT_REGISTRY.families[0].id === 'giant', 'the Hurt registry must contain only Giant');
check(EN_E03_GIANT_HURT_REGISTRY.families[0].variants.length === 1 && EN_E03_GIANT_HURT_REGISTRY.families[0].variants[0].id === 'hill-breaker', 'the Hurt registry must contain only Hill Breaker');
check(EN_E03_GIANT_HURT_REGISTRY.publicFamilies.length === 0 && EN_E03_GIANT_HURT_REGISTRY.approvedFamilies.length === 0, 'the approved Hurt baseline must remain internal and non-public');
check(EN_E03_GIANT_HURT_REGISTRY.renderers[0].chassis === 'humanoid-v1', 'the Hurt renderer must retain the approved roster chassis');
check(Object.isFrozen(EN_E03_GIANT_HURT_REGISTRY) && Object.isFrozen(EN_E03_GIANT_HURT_FAMILY) && Object.isFrozen(EN_E03_GIANT_HURT_BODY_SHIFTS), 'the Hurt registry, family, and motion table must be immutable');

check(engine.PUBLIC_ENEMIES.length === 70, 'the Hurt candidate must not alter the 70-family public catalog');
check(engine.ENEMIES.length === 57, 'the Hurt candidate must not alter the 57-family legacy catalog');
check(!engine.PUBLIC_ENEMIES.some((family) => family.id === 'giant'), 'Giant must remain absent from public consumers');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!facadeSource.includes('enemy-expansion-en-e03-giant-hurt'), 'the public facade must not import the Giant Hurt candidate module');
check(!facadeSource.includes('EN_E03_GIANT_HURT'), 'the public facade must not expose Giant Hurt candidate symbols');

const spec = { kind: 'enemy', family: 'giant', variant: 'hill-breaker' };
const delegatedIdleRecords = [];
const delegatedWalkRecords = [];
const delegatedAttackRecords = [];
const hurtFrames = new Map();
const hurtRecords = [];
let completeOutlinePixels = 0;
let formChangedPixels = 0;
let plantedContactChecks = 0;

function verifyDelegation(animation, frameCount, approvedRegistry, records) {
  for (const direction of engine.DIRS) for (let frame = 0; frame < frameCount; frame++) {
    const approved = captureEnemyExpansionFrame(approvedRegistry, spec, direction, animation, frame, engine.SIZE);
    const delegated = captureEnemyExpansionFrame(EN_E03_GIANT_HURT_REGISTRY, spec, direction, animation, frame, engine.SIZE);
    check(JSON.stringify(delegated.pixels) === JSON.stringify(approved.pixels), direction + '/' + animation + '/' + frame + ' must delegate byte-for-byte');
    check(delegated.digest === approved.digest && delegated.alphaDigest === approved.alphaDigest, direction + '/' + animation + '/' + frame + ' hashes must remain exact');
    records.push({
      family: 'giant', variant: 'hill-breaker', direction, animation, frame,
      digest: delegated.digest, alphaDigest: delegated.alphaDigest,
      opaquePixels: delegated.opaquePixels, bounds: delegated.bounds,
    });
  }
}

verifyDelegation('idle', 2, EN_E03_GIANT_IDLE_REGISTRY, delegatedIdleRecords);
verifyDelegation('walk', 4, EN_E03_GIANT_WALK_REGISTRY, delegatedWalkRecords);
verifyDelegation('attack', 4, EN_E03_GIANT_ATTACK_REGISTRY, delegatedAttackRecords);

for (const direction of engine.DIRS) for (let frame = 0; frame < 2; frame++) {
  const captured = captureEnemyExpansionFrame(EN_E03_GIANT_HURT_REGISTRY, spec, direction, 'hurt', frame, engine.SIZE);
  hurtFrames.set(direction + '/' + frame, captured);
  check(captured.outOfBoundsWrites.length === 0, direction + '/H' + (frame + 1) + ' wrote outside the 24x24 cell');
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22, direction + '/H' + (frame + 1) + ' must preserve a one-cell margin');
  check(componentCount(captured.pixels) === 1, direction + '/H' + (frame + 1) + ' must have one connected silhouette');
  check(captured.alpha.every((value) => value === 0 || value === 255), direction + '/H' + (frame + 1) + ' must use binary alpha');
  check(opaquePixelsAtRow(captured.alpha, captured.bounds.maxY) > 0, direction + '/H' + (frame + 1) + ' must retain planted Giant ground contact');
  check(frame === 0
    ? captured.pixels.filter((color) => color !== null).every((color) => color === '#ffffff')
    : captured.pixels.some((color) => color !== null && color !== '#ffffff'),
  direction + '/H' + (frame + 1) + ' must retain the intended flash/recovery color phase');
  plantedContactChecks++;
  const rendererData = EN_E03_GIANT_HURT_REGISTRY.families[0].variants[0].rendererData;
  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, rendererData);
  completeOutlinePixels += presentation.complete.filter((color, index) => color !== null && captured.pixels[index] === null).length;
  formChangedPixels += presentation.form.filter((color, index) => captured.pixels[index] !== null && color !== captured.pixels[index]).length;
  hurtRecords.push({
    family: 'giant', variant: 'hill-breaker', direction, animation: 'hurt', frame,
    digest: captured.digest, alphaDigest: captured.alphaDigest,
    opaquePixels: captured.opaquePixels, bounds: captured.bounds,
  });
}

check(createHash('sha256').update(JSON.stringify(delegatedIdleRecords)).digest('hex') === EN_E03_GIANT_IDLE_GATE.candidateFrameDigest, 'the delegated approved Idle records drifted');
check(createHash('sha256').update(JSON.stringify(delegatedWalkRecords)).digest('hex') === EN_E03_GIANT_WALK_GATE.candidateFrameDigest, 'the delegated approved Walk records drifted');
check(createHash('sha256').update(JSON.stringify(delegatedAttackRecords)).digest('hex') === EN_E03_GIANT_ATTACK_GATE.candidateFrameDigest, 'the delegated approved Attack records drifted');
for (const direction of engine.DIRS) {
  const impact = hurtFrames.get(direction + '/0');
  const recovery = hurtFrames.get(direction + '/1');
  check(impact.digest !== recovery.digest, direction + ' H1 impact must differ from H2 recovery');
  check(impact.alphaDigest !== recovery.alphaDigest, direction + ' Hurt must use two distinct silhouettes, not color-only flashing');
  check(alphaRegionSignature(impact, 4, 19, 2, 19) !== alphaRegionSignature(recovery, 4, 19, 2, 19), direction + ' Hurt must visibly move the body and club through both phases');
}
for (const direction of ['down', 'up']) {
  const phases = [hurtFrames.get(direction + '/0'), hurtFrames.get(direction + '/1')];
  check(new Set(phases.map(frontBackFootAnchorSignature)).size === 1, direction + ' Hurt must keep both planted-foot anchors exact across H1-H2');
}
for (let frame = 0; frame < 2; frame++) {
  const left = hurtFrames.get('left/' + frame);
  const right = hurtFrames.get('right/' + frame);
  check(
    left.bounds.minX === (engine.SIZE - 1 - right.bounds.maxX)
      && left.bounds.maxX === (engine.SIZE - 1 - right.bounds.minX)
      && left.bounds.minY === right.bounds.minY
      && left.bounds.maxY === right.bounds.maxY
      && left.opaquePixels === right.opaquePixels,
    'the left and right Hill Breaker H' + (frame + 1) + ' profiles must retain mirrored bounds and equal visual weight',
  );
}
check(new Set(hurtRecords.map((record) => record.alphaDigest)).size === 8, 'the eight Hurt frames must retain eight distinct directional silhouettes');
check(completeOutlinePixels > 0, 'Complete B must add exterior outline pixels');
check(formChangedPixels > 0, 'Form must shade source pixels');

rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_GIANT_HURT_REGISTRY, spec, 'down', 'cast', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'authorizes only approved Idle, Walk, and Attack plus two Hurt frames',
  'Cast rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_GIANT_HURT_REGISTRY, spec, 'down', 'death', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'authorizes only approved Idle, Walk, and Attack plus two Hurt frames',
  'Death rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_GIANT_HURT_REGISTRY, { kind: 'enemy', family: 'centaur', variant: 'steppe-hunter' }, 'down', 'hurt', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'is not implemented',
  'Centaur rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_GIANT_HURT_REGISTRY, { kind: 'enemy', family: 'satyr', variant: 'briar-reveler' }, 'down', 'hurt', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'is not implemented',
  'Satyr rendering',
);

const candidateDigest = createHash('sha256').update(JSON.stringify(hurtRecords)).digest('hex');
check(candidateDigest === EN_E03_GIANT_HURT_GATE.candidateFrameDigest, 'the Hill Breaker Hurt pixels drifted');

if (errors.length) {
  console.error('EN-E03 Hill Breaker Hurt validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E03 Hill Breaker two-frame Hurt validation passed.');
console.log('- Candidate scope: 1 family / 1 variant / 8 Hurt frames');
console.log('- Approved Idle frames preserved: 8 / 8');
console.log('- Approved Walk frames preserved: 16 / 16');
console.log('- Approved Attack frames preserved: 16 / 16');
console.log('- Connected hard-alpha silhouettes: 8 / 8');
console.log('- Planted ground-contact checks: ' + plantedContactChecks + ' / 8');
console.log('- Distinct Hurt silhouettes: 8 / 8');
console.log('- Front/back planted-foot anchors: exact across H1-H2');
console.log('- Complete B added pixels: ' + completeOutlinePixels);
console.log('- Form-shaded source pixels: ' + formChangedPixels);
console.log('- Public EN-E03 families: 0');
console.log('- Candidate frame digest: ' + candidateDigest);
