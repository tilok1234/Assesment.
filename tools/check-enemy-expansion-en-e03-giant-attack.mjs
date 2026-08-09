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
  EN_E03_GIANT_ATTACK_FAMILY,
  EN_E03_GIANT_ATTACK_GATE,
  EN_E03_GIANT_ATTACK_REGISTRY,
} from '../engine/enemy-expansion-en-e03-giant-attack.js';
import { EN_E03_SATYR_WALK_GATE } from '../engine/enemy-expansion-en-e03-satyr-walk.js';
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

function opaquePixelsAtRow(alpha, row) {
  let opaque = 0;
  for (let x = 0; x < engine.SIZE; x++) {
    if (alpha[(row * engine.SIZE) + x] !== 0) opaque++;
  }
  return opaque;
}

const GIANT_BODY_MARKER_COLORS = new Set([
  '#8a6545', '#523c2c',
  '#c9b88f', '#88785c',
  '#5a3a28', '#d0a04b',
]);

function giantBodyMarkerSignature(captured) {
  const markers = [];
  for (let y = 8; y <= 19; y++) for (let x = 3; x <= 20; x++) {
    const color = captured.pixels[(y * engine.SIZE) + x];
    if (GIANT_BODY_MARKER_COLORS.has(color)) markers.push(x + ',' + y + ':' + color);
  }
  return markers.join('|');
}

function regionSignature(captured, minX, maxX, minY, maxY) {
  const pixels = [];
  for (let y = minY; y <= maxY; y++) for (let x = minX; x <= maxX; x++) {
    pixels.push(captured.pixels[(y * engine.SIZE) + x]);
  }
  return JSON.stringify(pixels);
}

function frontBackFootAnchorSignature(captured) {
  const anchors = [
    [8, 20], [9, 20], [10, 20],
    [8, 21], [9, 21], [10, 21],
    [13, 20], [13, 21],
  ];
  return JSON.stringify(anchors.map(([x, y]) => captured.pixels[(y * engine.SIZE) + x]));
}

check(EN_E03_SATYR_WALK_GATE.status === 'approved', 'the preceding Briar Reveler Walk gate must remain visually approved');
check(EN_E03_SATYR_WALK_GATE.approvedOn === '2026-08-06', 'the Briar Reveler Walk gate must retain its approval date');
check(EN_E03_SATYR_WALK_GATE.approvalEvidence === 'Designer reviewed the corrected raw and Complete B + Form Briar Reveler Walk animations and said: greeat lets move on.', 'the Briar Reveler Walk gate must retain exact approval evidence');
check(EN_E03_GIANT_IDLE_GATE.status === 'approved', 'the Hill Breaker Idle baseline must remain visually approved');
check(EN_E03_GIANT_WALK_GATE.status === 'approved', 'the Hill Breaker Walk baseline must remain visually approved');
check(EN_E03_GIANT_ATTACK_GATE.status === 'approved', 'the Hill Breaker Attack gate must retain direct visual approval');
check(EN_E03_GIANT_ATTACK_GATE.authorizedOn === '2026-08-06', 'the Hill Breaker Attack gate must record its authorization date');
check(EN_E03_GIANT_ATTACK_GATE.authorizationEvidence === 'Designer approved the corrected raw and Complete B + Form Briar Reveler Walk animations and said: greeat lets move on.', 'the Hill Breaker Attack gate must retain exact authorization evidence');
check(Array.isArray(EN_E03_GIANT_ATTACK_GATE.reviewFeedback) && EN_E03_GIANT_ATTACK_GATE.reviewFeedback[0] === 'Designer said: i think maybe a little more of the body could move when he attacks.' && EN_E03_GIANT_ATTACK_GATE.reviewFeedback[1] === 'Designer rejected the overlay-shift revision and said: not a good animation.' && EN_E03_GIANT_ATTACK_GATE.reviewFeedback[2] === 'Designer asked to use the front and back also.', 'the Attack gate must retain all three rounds of body-motion review feedback');
check(EN_E03_GIANT_ATTACK_GATE.approvedOn === '2026-08-07', 'the Hill Breaker Attack gate must retain its visual-approval date');
check(EN_E03_GIANT_ATTACK_GATE.approvalEvidence === 'Designer reviewed the exact labeled four-direction raw and Complete B + Form Hill Breaker Attack animations and said: Very good approved.', 'the Hill Breaker Attack gate must retain exact visual-approval evidence');
check(EN_E03_GIANT_ATTACK_GATE.precedingApproval.gateId === EN_E03_SATYR_WALK_GATE.id, 'the Attack gate must identify the preceding Briar Reveler Walk approval');
check(EN_E03_GIANT_ATTACK_GATE.precedingApproval.artifactSha256 === EN_E03_SATYR_WALK_GATE.artifactSha256, 'the preceding Briar Reveler raw hash must remain frozen');
check(EN_E03_GIANT_ATTACK_GATE.precedingApproval.assembledArtifactSha256 === EN_E03_SATYR_WALK_GATE.assembledArtifactSha256, 'the preceding Briar Reveler assembled hash must remain frozen');
check(EN_E03_GIANT_ATTACK_GATE.precedingApproval.candidateFrameDigest === EN_E03_SATYR_WALK_GATE.candidateFrameDigest, 'the preceding Briar Reveler frame digest must remain frozen');
check(EN_E03_GIANT_ATTACK_GATE.approvedIdle.gateId === EN_E03_GIANT_IDLE_GATE.id, 'the Attack gate must identify the approved Hill Breaker Idle baseline');
check(EN_E03_GIANT_ATTACK_GATE.approvedIdle.frameDigest === EN_E03_GIANT_IDLE_GATE.candidateFrameDigest, 'the Attack gate must retain the approved Idle digest');
check(EN_E03_GIANT_ATTACK_GATE.approvedWalk.gateId === EN_E03_GIANT_WALK_GATE.id, 'the Attack gate must identify the approved Hill Breaker Walk baseline');
check(EN_E03_GIANT_ATTACK_GATE.approvedWalk.artifactSha256 === EN_E03_GIANT_WALK_GATE.artifactSha256, 'the Attack gate must retain the approved raw Walk hash');
check(EN_E03_GIANT_ATTACK_GATE.approvedWalk.assembledArtifactSha256 === EN_E03_GIANT_WALK_GATE.assembledArtifactSha256, 'the Attack gate must retain the approved assembled Walk hash');
check(EN_E03_GIANT_ATTACK_GATE.approvedWalk.frameDigest === EN_E03_GIANT_WALK_GATE.candidateFrameDigest, 'the Attack gate must retain the approved Walk digest');
check(EN_E03_GIANT_ATTACK_GATE.artifactSha256 === '45ec7e5a52abdd0dc0e2eaf4042a2d64c73ddb0a47dd070eb974e31fa2dabe8f', 'the raw Hill Breaker Attack review hash must remain frozen');
check(EN_E03_GIANT_ATTACK_GATE.assembledArtifactSha256 === '250390b3c44db6d86362e8cbad7ef7225b2c728c984718119c5d7b85fc07ea10', 'the assembled Hill Breaker Attack review hash must remain frozen');
check(EN_E03_GIANT_ATTACK_GATE.reviewAnimations.raw.artifact.endsWith('en-e03-hill-breaker-attack-four-directions-labeled-v2.gif') && EN_E03_GIANT_ATTACK_GATE.reviewAnimations.raw.sha256 === 'a2b880921c4337b89ee64b18446fbe5d2527b2808c8f48a37c2f4549d1118724', 'the approved labeled raw four-direction animation must remain frozen');
check(EN_E03_GIANT_ATTACK_GATE.reviewAnimations.completeBForm.artifact.endsWith('en-e03-hill-breaker-attack-four-directions-labeled-complete-b-form-v2.gif') && EN_E03_GIANT_ATTACK_GATE.reviewAnimations.completeBForm.sha256 === 'd06771fa77fac6078332f1928e713565a6cd2f54ff440145d03f8131ae353673', 'the approved labeled Complete B + Form four-direction animation must remain frozen');
check(EN_E03_GIANT_ATTACK_GATE.reviewAnimations.raw.width === 192 && EN_E03_GIANT_ATTACK_GATE.reviewAnimations.raw.height === 224 && EN_E03_GIANT_ATTACK_GATE.reviewAnimations.raw.frames === 4 && EN_E03_GIANT_ATTACK_GATE.reviewAnimations.raw.durationMs === 480, 'the approved labeled raw animation geometry/timing must remain frozen');
check(EN_E03_GIANT_ATTACK_GATE.reviewAnimations.completeBForm.width === 192 && EN_E03_GIANT_ATTACK_GATE.reviewAnimations.completeBForm.height === 224 && EN_E03_GIANT_ATTACK_GATE.reviewAnimations.completeBForm.frames === 4 && EN_E03_GIANT_ATTACK_GATE.reviewAnimations.completeBForm.durationMs === 480, 'the approved labeled Complete B + Form animation geometry/timing must remain frozen');
check(EN_E03_GIANT_ATTACK_GATE.candidateFrameDigest === '1b5cade8a0a19babd00ed067010ecb98948891a7e4f6cd435adc53ae57cf78ab', 'the 16-frame Hill Breaker Attack digest must remain frozen');
check(EN_E03_GIANT_ATTACK_GATE.scope.includes('A1-A4 across Down, Left, Right, and Up'), 'the Attack gate must name its exact four-direction/four-frame scope');
check(EN_E03_GIANT_ATTACK_GATE.revision.includes('layered rig') && EN_E03_GIANT_ATTACK_GATE.revision.includes('Down and Up') && EN_E03_GIANT_ATTACK_GATE.revision.includes('every foot remains anchored'), 'the Attack gate must describe the front/back extension of the replacement rig');
check(EN_E03_GIANT_ATTACK_GATE.exclusions.includes('Idle pixel changes') && EN_E03_GIANT_ATTACK_GATE.exclusions.includes('Walk pixel changes'), 'the Attack gate must protect approved Idle and Walk pixels');
check(EN_E03_GIANT_ATTACK_GATE.exclusions.includes('Centaur changes') && EN_E03_GIANT_ATTACK_GATE.exclusions.includes('Satyr changes'), 'the Attack gate must protect the other EN-E03 families');
check(EN_E03_GIANT_ATTACK_GATE.exclusions.includes('Hurt') && EN_E03_GIANT_ATTACK_GATE.exclusions.includes('registration'), 'the Attack gate must exclude later motion and public routing');
check(EN_E03_GIANT_ATTACK_GATE.nextGate.includes('Visual approval is complete') && EN_E03_GIANT_ATTACK_GATE.nextGate.includes('no later EN-E03 work is authorized yet'), 'the approved Attack gate must stop without authorizing later EN-E03 work');
check(Object.isFrozen(EN_E03_GIANT_ATTACK_GATE) && Object.isFrozen(EN_E03_GIANT_ATTACK_GATE.reviewFeedback) && Object.isFrozen(EN_E03_GIANT_ATTACK_GATE.precedingApproval) && Object.isFrozen(EN_E03_GIANT_ATTACK_GATE.approvedIdle) && Object.isFrozen(EN_E03_GIANT_ATTACK_GATE.approvedWalk) && Object.isFrozen(EN_E03_GIANT_ATTACK_GATE.reviewAnimations) && Object.isFrozen(EN_E03_GIANT_ATTACK_GATE.reviewAnimations.raw) && Object.isFrozen(EN_E03_GIANT_ATTACK_GATE.reviewAnimations.completeBForm) && Object.isFrozen(EN_E03_GIANT_ATTACK_GATE.exclusions), 'the Attack gate must be deeply immutable');

check(EN_E03_GIANT_ATTACK_REGISTRY.families.length === 1, 'the Attack registry must contain exactly one family');
check(EN_E03_GIANT_ATTACK_REGISTRY.families[0].id === 'giant', 'the Attack registry must contain only Giant');
check(EN_E03_GIANT_ATTACK_REGISTRY.families[0].variants.length === 1, 'the Attack registry must contain exactly one variant');
check(EN_E03_GIANT_ATTACK_REGISTRY.families[0].variants[0].id === 'hill-breaker', 'the Attack registry must contain only Hill Breaker');
check(EN_E03_GIANT_ATTACK_REGISTRY.publicFamilies.length === 0 && EN_E03_GIANT_ATTACK_REGISTRY.approvedFamilies.length === 0, 'the visually approved Attack baseline must remain internal and outside registry approval/public routing');
check(EN_E03_GIANT_ATTACK_REGISTRY.renderers[0].chassis === 'humanoid-v1', 'the Attack renderer must retain the approved roster chassis');
check(Object.isFrozen(EN_E03_GIANT_ATTACK_REGISTRY) && Object.isFrozen(EN_E03_GIANT_ATTACK_FAMILY), 'the Attack registry and family must be immutable');

check(engine.PUBLIC_ENEMIES.length === 74, 'the Attack candidate must not alter the later 74-family public catalog');
check(engine.ENEMIES.length === 57, 'the Attack candidate must not alter the 57-family legacy catalog');
check(!engine.PUBLIC_ENEMIES.some((family) => family.id === 'giant'), 'Giant must remain absent from public consumers');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!facadeSource.includes('enemy-expansion-en-e03-giant-attack'), 'the public facade must not import the Giant Attack candidate module');
check(!facadeSource.includes('EN_E03_GIANT_ATTACK'), 'the public facade must not expose Giant Attack candidate symbols');

const spec = { kind: 'enemy', family: 'giant', variant: 'hill-breaker' };
const delegatedIdleRecords = [];
const delegatedWalkRecords = [];
const attackFrames = new Map();
const attackRecords = [];
let completeOutlinePixels = 0;
let formChangedPixels = 0;
let plantedContactChecks = 0;

for (const direction of engine.DIRS) for (let frame = 0; frame < 2; frame++) {
  const approved = captureEnemyExpansionFrame(EN_E03_GIANT_IDLE_REGISTRY, spec, direction, 'idle', frame, engine.SIZE);
  const delegated = captureEnemyExpansionFrame(EN_E03_GIANT_ATTACK_REGISTRY, spec, direction, 'idle', frame, engine.SIZE);
  check(JSON.stringify(delegated.pixels) === JSON.stringify(approved.pixels), direction + '/Idle F' + (frame + 1) + ' must delegate to the exact approved baseline');
  check(delegated.digest === approved.digest && delegated.alphaDigest === approved.alphaDigest, direction + '/Idle F' + (frame + 1) + ' hashes must remain exact');
  delegatedIdleRecords.push({
    family: 'giant', variant: 'hill-breaker', direction, animation: 'idle', frame,
    digest: delegated.digest, alphaDigest: delegated.alphaDigest,
    opaquePixels: delegated.opaquePixels, bounds: delegated.bounds,
  });
}

for (const direction of engine.DIRS) for (let frame = 0; frame < 4; frame++) {
  const approved = captureEnemyExpansionFrame(EN_E03_GIANT_WALK_REGISTRY, spec, direction, 'walk', frame, engine.SIZE);
  const delegated = captureEnemyExpansionFrame(EN_E03_GIANT_ATTACK_REGISTRY, spec, direction, 'walk', frame, engine.SIZE);
  check(JSON.stringify(delegated.pixels) === JSON.stringify(approved.pixels), direction + '/Walk W' + (frame + 1) + ' must delegate to the exact approved baseline');
  check(delegated.digest === approved.digest && delegated.alphaDigest === approved.alphaDigest, direction + '/Walk W' + (frame + 1) + ' hashes must remain exact');
  delegatedWalkRecords.push({
    family: 'giant', variant: 'hill-breaker', direction, animation: 'walk', frame,
    digest: delegated.digest, alphaDigest: delegated.alphaDigest,
    opaquePixels: delegated.opaquePixels, bounds: delegated.bounds,
  });
}

for (const direction of engine.DIRS) for (let frame = 0; frame < 4; frame++) {
  const captured = captureEnemyExpansionFrame(EN_E03_GIANT_ATTACK_REGISTRY, spec, direction, 'attack', frame, engine.SIZE);
  attackFrames.set(direction + '/' + frame, captured);
  check(captured.outOfBoundsWrites.length === 0, direction + '/A' + (frame + 1) + ' wrote outside the 24x24 cell');
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22, direction + '/A' + (frame + 1) + ' must preserve a one-cell margin');
  check(componentCount(captured.pixels) === 1, direction + '/A' + (frame + 1) + ' must have one connected silhouette');
  check(captured.alpha.every((value) => value === 0 || value === 255), direction + '/A' + (frame + 1) + ' must use binary alpha');
  check(opaquePixelsAtRow(captured.alpha, captured.bounds.maxY) > 0, direction + '/A' + (frame + 1) + ' must retain planted Giant ground contact');
  plantedContactChecks++;
  const rendererData = EN_E03_GIANT_ATTACK_REGISTRY.families[0].variants[0].rendererData;
  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, rendererData);
  completeOutlinePixels += presentation.complete.filter((color, index) => color !== null && captured.pixels[index] === null).length;
  formChangedPixels += presentation.form.filter((color, index) => captured.pixels[index] !== null && color !== captured.pixels[index]).length;
  attackRecords.push({
    family: 'giant', variant: 'hill-breaker', direction, animation: 'attack', frame,
    digest: captured.digest, alphaDigest: captured.alphaDigest,
    opaquePixels: captured.opaquePixels, bounds: captured.bounds,
  });
}

check(createHash('sha256').update(JSON.stringify(delegatedIdleRecords)).digest('hex') === EN_E03_GIANT_IDLE_GATE.candidateFrameDigest, 'the delegated approved Idle records drifted');
check(createHash('sha256').update(JSON.stringify(delegatedWalkRecords)).digest('hex') === EN_E03_GIANT_WALK_GATE.candidateFrameDigest, 'the delegated approved Walk records drifted');
for (const direction of engine.DIRS) {
  const phases = [0, 1, 2, 3].map((frame) => attackFrames.get(direction + '/' + frame));
  check(new Set(phases.map((captured) => captured.digest)).size === 4, direction + ' Attack must retain four distinct color poses');
  check(new Set(phases.map((captured) => captured.alphaDigest)).size === 4, direction + ' Attack must retain four distinct silhouettes');
  check(new Set(phases.map(giantBodyMarkerSignature)).size >= 3, direction + ' Attack must move Giant torso-and-hip identity markers through at least three phases');
  check(phases[0].digest !== phases[1].digest, direction + ' A1 wind-up must differ from A2 release');
  check(phases[1].digest !== phases[2].digest, direction + ' A2 release must differ from A3 impact hold');
  check(phases[2].digest !== phases[3].digest, direction + ' A3 impact hold must differ from A4 recovery');
}
for (const direction of ['down', 'up']) {
  const phases = [0, 1, 2, 3].map((frame) => attackFrames.get(direction + '/' + frame));
  check(new Set(phases.map((captured) => regionSignature(captured, 7, 16, 17, 19))).size >= 3, direction + ' Attack must carry motion through hips and upper legs in at least three phases');
  check(new Set(phases.map(frontBackFootAnchorSignature)).size === 1, direction + ' Attack must keep both planted-foot anchors byte-identical across all four phases');
}
for (let frame = 0; frame < 4; frame++) {
  const left = attackFrames.get('left/' + frame);
  const right = attackFrames.get('right/' + frame);
  check(
    left.bounds.minX === (engine.SIZE - 1 - right.bounds.maxX)
      && left.bounds.maxX === (engine.SIZE - 1 - right.bounds.minX)
      && left.bounds.minY === right.bounds.minY
      && left.bounds.maxY === right.bounds.maxY
      && left.opaquePixels === right.opaquePixels,
    'the left and right Hill Breaker A' + (frame + 1) + ' profiles must retain mirrored bounds and equal visual weight',
  );
}
check(new Set(attackRecords.map((record) => record.alphaDigest)).size === 16, 'the 16 Attack frames must retain 16 distinct directional silhouettes');
check(completeOutlinePixels > 0, 'Complete B must add exterior outline pixels');
check(formChangedPixels > 0, 'Form must shade source pixels');

rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_GIANT_ATTACK_REGISTRY, spec, 'down', 'hurt', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'authorizes only approved Idle and Walk plus four Attack frames',
  'Hurt rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_GIANT_ATTACK_REGISTRY, spec, 'down', 'cast', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'authorizes only approved Idle and Walk plus four Attack frames',
  'Cast rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_GIANT_ATTACK_REGISTRY, { kind: 'enemy', family: 'centaur', variant: 'steppe-hunter' }, 'down', 'attack', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'is not implemented',
  'Centaur rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_GIANT_ATTACK_REGISTRY, { kind: 'enemy', family: 'satyr', variant: 'briar-reveler' }, 'down', 'attack', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'is not implemented',
  'Satyr rendering',
);

const candidateDigest = createHash('sha256').update(JSON.stringify(attackRecords)).digest('hex');
check(candidateDigest === EN_E03_GIANT_ATTACK_GATE.candidateFrameDigest, 'the Hill Breaker Attack pixels drifted');

if (errors.length) {
  console.error('EN-E03 Hill Breaker Attack validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E03 Hill Breaker four-frame Attack validation passed.');
console.log('- Candidate scope: 1 family / 1 variant / 16 Attack frames');
console.log('- Approved Idle frames preserved: 8 / 8');
console.log('- Approved Walk frames preserved: 16 / 16');
console.log('- Connected hard-alpha silhouettes: 16 / 16');
console.log('- Planted ground-contact checks: ' + plantedContactChecks + ' / 16');
console.log('- Distinct Attack silhouettes: 16 / 16');
console.log('- Torso-and-hip motion phases: at least 3 / 4 per direction');
console.log('- Front/back hip-and-upper-leg phases: at least 3 / 4');
console.log('- Front/back planted-foot anchors: exact across 4 / 4 phases');
console.log('- Complete B added pixels: ' + completeOutlinePixels);
console.log('- Form-shaded source pixels: ' + formChangedPixels);
console.log('- Public EN-E03 families: 0');
console.log('- Candidate frame digest: ' + candidateDigest);
