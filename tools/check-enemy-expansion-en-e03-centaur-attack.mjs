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
  EN_E03_CENTAUR_WALK_GATE,
  EN_E03_CENTAUR_WALK_REGISTRY,
} from '../engine/enemy-expansion-en-e03-centaur-walk.js';
import {
  EN_E03_CENTAUR_ATTACK_FAMILY,
  EN_E03_CENTAUR_ATTACK_GATE,
  EN_E03_CENTAUR_ATTACK_REGISTRY,
} from '../engine/enemy-expansion-en-e03-centaur-attack.js';
import { EN_E03_GIANT_ATTACK_GATE } from '../engine/enemy-expansion-en-e03-giant-attack.js';
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

function rejects(run, label) {
  try {
    run();
    errors.push(label + ' was not rejected.');
  } catch {
    // Expected: this bounded renderer must refuse everything outside its lane.
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

const HORSE_MARKER_COLORS = new Set([
  ...EN_E03_STEPPE_HUNTER_CALIBRATION_DATA.horse.hide,
  EN_E03_STEPPE_HUNTER_CALIBRATION_DATA.horse.hideHighlight,
  ...EN_E03_STEPPE_HUNTER_CALIBRATION_DATA.horse.hoof,
]);

function horseBodySignature(captured) {
  const markers = [];
  for (let y = 14; y < engine.SIZE; y++) for (let x = 0; x < engine.SIZE; x++) {
    const color = captured.pixels[(y * engine.SIZE) + x];
    if (HORSE_MARKER_COLORS.has(color)) markers.push(x + ',' + y + ':' + color);
  }
  return markers.join('|');
}

function frameRecord(captured, direction, animation, frame) {
  return {
    family: 'centaur',
    variant: 'steppe-hunter',
    direction,
    animation,
    frame,
    digest: captured.digest,
    alphaDigest: captured.alphaDigest,
    opaquePixels: captured.opaquePixels,
    bounds: captured.bounds,
  };
}

async function sha256File(relativePath) {
  return createHash('sha256').update(await readFile(path.join(root, relativePath))).digest('hex');
}

check(EN_E03_GIANT_ATTACK_GATE.status === 'approved', 'the preceding Hill Breaker Attack gate must remain visually approved');
check(EN_E03_GIANT_ATTACK_GATE.approvedOn === '2026-08-07', 'the Hill Breaker Attack gate must retain its visual-approval date');
check(EN_E03_GIANT_ATTACK_GATE.approvalEvidence === 'Designer reviewed the exact labeled four-direction raw and Complete B + Form Hill Breaker Attack animations and said: Very good approved.', 'the Hill Breaker Attack gate must retain exact visual-approval evidence');
check(EN_E03_CENTAUR_IDLE_GATE.status === 'approved', 'the Steppe Hunter Idle baseline must remain visually approved');
check(EN_E03_CENTAUR_WALK_GATE.status === 'approved', 'the Steppe Hunter Walk baseline must remain visually approved');
check(EN_E03_CENTAUR_ATTACK_GATE.status === 'approved', 'the Steppe Hunter Attack gate must retain direct visual approval');
check(EN_E03_CENTAUR_ATTACK_GATE.authorizedOn === '2026-08-07', 'the Steppe Hunter Attack gate must record its authorization date');
check(EN_E03_CENTAUR_ATTACK_GATE.authorizationEvidence === 'Designer approved the exact labeled four-direction raw and Complete B + Form Hill Breaker Attack animations with: Very good approved. Designer then said: Cool let\'s keep going.', 'the Steppe Hunter Attack gate must retain exact authorization evidence');
check(EN_E03_CENTAUR_ATTACK_GATE.approvedOn === '2026-08-07', 'the Steppe Hunter Attack gate must retain its visual-approval date');
check(EN_E03_CENTAUR_ATTACK_GATE.approvalEvidence === 'Designer reviewed the exact labeled four-direction raw and Complete B + Form Steppe Hunter Attack animations and said: Approved.', 'the Steppe Hunter Attack gate must retain exact visual-approval evidence');
check(EN_E03_CENTAUR_ATTACK_GATE.precedingApproval.gateId === EN_E03_GIANT_ATTACK_GATE.id, 'the Attack gate must identify the preceding approved Hill Breaker Attack');
check(EN_E03_CENTAUR_ATTACK_GATE.precedingApproval.artifactSha256 === EN_E03_GIANT_ATTACK_GATE.artifactSha256, 'the preceding raw Hill Breaker Attack hash must remain frozen');
check(EN_E03_CENTAUR_ATTACK_GATE.precedingApproval.assembledArtifactSha256 === EN_E03_GIANT_ATTACK_GATE.assembledArtifactSha256, 'the preceding assembled Hill Breaker Attack hash must remain frozen');
check(EN_E03_CENTAUR_ATTACK_GATE.precedingApproval.candidateFrameDigest === EN_E03_GIANT_ATTACK_GATE.candidateFrameDigest, 'the preceding Hill Breaker Attack frame digest must remain frozen');
check(EN_E03_CENTAUR_ATTACK_GATE.approvedIdle.gateId === EN_E03_CENTAUR_IDLE_GATE.id, 'the Attack gate must identify the approved Steppe Hunter Idle baseline');
check(EN_E03_CENTAUR_ATTACK_GATE.approvedIdle.frameDigest === EN_E03_CENTAUR_IDLE_GATE.candidateFrameDigest, 'the Attack gate must retain the approved Idle frame digest');
check(EN_E03_CENTAUR_ATTACK_GATE.approvedWalk.gateId === EN_E03_CENTAUR_WALK_GATE.id, 'the Attack gate must identify the approved Steppe Hunter Walk baseline');
check(EN_E03_CENTAUR_ATTACK_GATE.approvedWalk.frameDigest === EN_E03_CENTAUR_WALK_GATE.candidateFrameDigest, 'the Attack gate must retain the approved Walk frame digest');
check(EN_E03_CENTAUR_ATTACK_GATE.artifactSha256 === 'b276746f3d532df7b3ba9b551d8227b3d2fa439367fd49108eaaab5b5309eee2', 'the raw Steppe Hunter Attack review hash must remain frozen');
check(EN_E03_CENTAUR_ATTACK_GATE.assembledArtifactSha256 === 'ba5c3f84fc0c7e96af985453c847b3669efe39c7c4e5f033fcad13dba432c5be', 'the Complete B + Form Steppe Hunter Attack review hash must remain frozen');
check(EN_E03_CENTAUR_ATTACK_GATE.candidateFrameDigest === 'c01f66be4c6afcaaa562073b85598b09eff0e8686ec0092296d95090883f77a0', 'the 16-frame Steppe Hunter Attack digest must remain frozen');
check(EN_E03_CENTAUR_ATTACK_GATE.reviewAnimations.raw.sha256 === 'ea0d576a586f3dc22777a35e8c8bed837efe5c9e7125e5508531a903fe7236d7', 'the labeled raw four-direction Attack GIF must remain frozen');
check(EN_E03_CENTAUR_ATTACK_GATE.reviewAnimations.completeBForm.sha256 === '7798a3da0b43b0111ac68b201f0afc8a4a85d53e0531b2cc3718a08dcd73aafa', 'the labeled Complete B + Form four-direction Attack GIF must remain frozen');
for (const animation of Object.values(EN_E03_CENTAUR_ATTACK_GATE.reviewAnimations)) {
  check(animation.width === 192 && animation.height === 224 && animation.frames === 4 && animation.durationMs === 480, 'each labeled Attack GIF must retain the 192x224 four-frame 480 ms contract');
}
check(EN_E03_CENTAUR_ATTACK_GATE.scope.includes('A1-A4 across Down, Left, Right, and Up'), 'the Attack gate must name its exact four-direction/four-frame scope');
check(EN_E03_CENTAUR_ATTACK_GATE.reviewPresentation.includes('both labeled all-four-direction GIFs') && EN_E03_CENTAUR_ATTACK_GATE.reviewPresentation.includes('raw/no-outline') && EN_E03_CENTAUR_ATTACK_GATE.reviewPresentation.includes('Complete B + Form'), 'the Attack gate must encode the mandatory dual four-direction review presentation');
check(EN_E03_CENTAUR_ATTACK_GATE.exclusions.includes('Idle pixel changes') && EN_E03_CENTAUR_ATTACK_GATE.exclusions.includes('Walk pixel changes'), 'the Attack gate must protect approved Idle and Walk pixels');
check(EN_E03_CENTAUR_ATTACK_GATE.exclusions.includes('Giant changes') && EN_E03_CENTAUR_ATTACK_GATE.exclusions.includes('Satyr changes'), 'the Attack gate must protect the other EN-E03 families');
check(EN_E03_CENTAUR_ATTACK_GATE.exclusions.includes('Hurt') && EN_E03_CENTAUR_ATTACK_GATE.exclusions.includes('registration'), 'the Attack gate must exclude later motion and public routing');
check(EN_E03_CENTAUR_ATTACK_GATE.nextGate.includes('Visual approval is complete') && EN_E03_CENTAUR_ATTACK_GATE.nextGate.includes('no later EN-E03 work is authorized'), 'the approved Attack gate must stop without authorizing later EN-E03 work');
check(Object.isFrozen(EN_E03_CENTAUR_ATTACK_GATE) && Object.isFrozen(EN_E03_CENTAUR_ATTACK_GATE.reviewAnimations) && Object.isFrozen(EN_E03_CENTAUR_ATTACK_GATE.exclusions), 'the Attack gate must be deeply immutable');

check(EN_E03_CENTAUR_ATTACK_REGISTRY.families.length === 1, 'the Attack registry must contain exactly one family');
check(EN_E03_CENTAUR_ATTACK_REGISTRY.families[0].id === 'centaur', 'the Attack registry must contain only Centaur');
check(EN_E03_CENTAUR_ATTACK_REGISTRY.families[0].variants.length === 1 && EN_E03_CENTAUR_ATTACK_REGISTRY.families[0].variants[0].id === 'steppe-hunter', 'the Attack registry must contain only Steppe Hunter');
check(EN_E03_CENTAUR_ATTACK_REGISTRY.publicFamilies.length === 0 && EN_E03_CENTAUR_ATTACK_REGISTRY.approvedFamilies.length === 0, 'the Attack candidate must remain internal and outside registry approval/public routing');
check(EN_E03_CENTAUR_ATTACK_REGISTRY.renderers[0].chassis === 'humanoid-v1', 'the Attack renderer must retain the approved humanoid upper chassis');
check(Object.isFrozen(EN_E03_CENTAUR_ATTACK_REGISTRY) && Object.isFrozen(EN_E03_CENTAUR_ATTACK_FAMILY), 'the Attack registry and family must be immutable');

check(engine.PUBLIC_ENEMIES.length === 74, 'the Attack candidate must not alter the later 74-family public catalog');
check(engine.ENEMIES.length === 57, 'the Attack candidate must not alter the 57-family legacy catalog');
check(!engine.PUBLIC_ENEMIES.some((family) => family.id === 'centaur'), 'Centaur must remain absent from public consumers');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!facadeSource.includes('enemy-expansion-en-e03-centaur-attack'), 'the public facade must not import the Centaur Attack candidate module');
check(!facadeSource.includes('EN_E03_CENTAUR_ATTACK'), 'the public facade must not expose Centaur Attack candidate symbols');

check(await sha256File(EN_E03_CENTAUR_ATTACK_GATE.artifact) === EN_E03_CENTAUR_ATTACK_GATE.artifactSha256, 'the raw review PNG on disk must match the frozen gate hash');
check(await sha256File(EN_E03_CENTAUR_ATTACK_GATE.assembledArtifact) === EN_E03_CENTAUR_ATTACK_GATE.assembledArtifactSha256, 'the Complete B + Form review PNG on disk must match the frozen gate hash');
check(await sha256File(EN_E03_CENTAUR_ATTACK_GATE.reviewAnimations.raw.artifact) === EN_E03_CENTAUR_ATTACK_GATE.reviewAnimations.raw.sha256, 'the labeled raw review GIF on disk must match the frozen gate hash');
check(await sha256File(EN_E03_CENTAUR_ATTACK_GATE.reviewAnimations.completeBForm.artifact) === EN_E03_CENTAUR_ATTACK_GATE.reviewAnimations.completeBForm.sha256, 'the labeled Complete B + Form review GIF on disk must match the frozen gate hash');

const spec = { kind: 'enemy', family: 'centaur', variant: 'steppe-hunter' };
const attackFrames = new Map();
const attackRecords = [];
const delegatedIdleRecords = [];
const delegatedWalkRecords = [];
let completeOutlinePixels = 0;
let formChangedPixels = 0;
let plantedContactChecks = 0;

for (const direction of engine.DIRS) for (let frame = 0; frame < 2; frame++) {
  const approved = captureEnemyExpansionFrame(EN_E03_CENTAUR_IDLE_REGISTRY, spec, direction, 'idle', frame, engine.SIZE);
  const delegated = captureEnemyExpansionFrame(EN_E03_CENTAUR_ATTACK_REGISTRY, spec, direction, 'idle', frame, engine.SIZE);
  check(JSON.stringify(delegated.pixels) === JSON.stringify(approved.pixels), direction + '/Idle F' + (frame + 1) + ' must delegate to the exact approved baseline');
  check(delegated.digest === approved.digest && delegated.alphaDigest === approved.alphaDigest, direction + '/Idle F' + (frame + 1) + ' hashes must remain exact');
  delegatedIdleRecords.push(frameRecord(delegated, direction, 'idle', frame));
}

for (const direction of engine.DIRS) for (let frame = 0; frame < 4; frame++) {
  const approved = captureEnemyExpansionFrame(EN_E03_CENTAUR_WALK_REGISTRY, spec, direction, 'walk', frame, engine.SIZE);
  const delegated = captureEnemyExpansionFrame(EN_E03_CENTAUR_ATTACK_REGISTRY, spec, direction, 'walk', frame, engine.SIZE);
  check(JSON.stringify(delegated.pixels) === JSON.stringify(approved.pixels), direction + '/Walk W' + (frame + 1) + ' must delegate to the exact approved baseline');
  check(delegated.digest === approved.digest && delegated.alphaDigest === approved.alphaDigest, direction + '/Walk W' + (frame + 1) + ' hashes must remain exact');
  delegatedWalkRecords.push(frameRecord(delegated, direction, 'walk', frame));
}

for (const direction of engine.DIRS) for (let frame = 0; frame < 4; frame++) {
  const captured = captureEnemyExpansionFrame(EN_E03_CENTAUR_ATTACK_REGISTRY, spec, direction, 'attack', frame, engine.SIZE);
  attackFrames.set(direction + '/' + frame, captured);
  check(captured.outOfBoundsWrites.length === 0, direction + '/A' + (frame + 1) + ' wrote outside the 24x24 cell');
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22, direction + '/A' + (frame + 1) + ' must preserve a one-cell margin');
  check(componentCount(captured.pixels) === 1, direction + '/A' + (frame + 1) + ' must have one connected horse-rider-spear silhouette');
  check(captured.alpha.every((value) => value === 0 || value === 255), direction + '/A' + (frame + 1) + ' must use binary alpha');
  check(opaqueRunsAtRow(captured.alpha, 22) >= 2, direction + '/A' + (frame + 1) + ' must retain separated planted hoof contacts');
  plantedContactChecks++;
  for (const color of EN_E03_STEPPE_HUNTER_CALIBRATION_DATA.horse.hoof) check(captured.colors.includes(color), direction + '/A' + (frame + 1) + ' must use hoof color ' + color);
  check(captured.colors.includes(EN_E03_STEPPE_HUNTER_CALIBRATION_DATA.horse.hide[0]), direction + '/A' + (frame + 1) + ' must use the chestnut hide base');
  check(captured.colors.includes(EN_E03_STEPPE_HUNTER_CALIBRATION_DATA.horse.wood[1]), direction + '/A' + (frame + 1) + ' must retain the spear shaft');
  check(captured.colors.some((color) => EN_E03_STEPPE_HUNTER_CALIBRATION_DATA.horse.spearhead.includes(color)), direction + '/A' + (frame + 1) + ' must retain a spearhead');
  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E03_STEPPE_HUNTER_CALIBRATION_DATA);
  completeOutlinePixels += presentation.complete.filter((color, index) => color !== null && captured.pixels[index] === null).length;
  formChangedPixels += presentation.form.filter((color, index) => captured.pixels[index] !== null && color !== captured.pixels[index]).length;
  attackRecords.push(frameRecord(captured, direction, 'attack', frame));
}

check(createHash('sha256').update(JSON.stringify(delegatedIdleRecords)).digest('hex') === EN_E03_CENTAUR_IDLE_GATE.candidateFrameDigest, 'the delegated approved Idle records drifted');
check(createHash('sha256').update(JSON.stringify(delegatedWalkRecords)).digest('hex') === EN_E03_CENTAUR_WALK_GATE.candidateFrameDigest, 'the delegated approved Walk records drifted');
for (const direction of engine.DIRS) {
  const frames = [0, 1, 2, 3].map((frame) => attackFrames.get(direction + '/' + frame));
  check(new Set(frames.map((captured) => captured.alphaDigest)).size === 4, direction + ' Attack must retain four visibly distinct spear-and-body silhouettes');
  check(new Set(frames.map(horseBodySignature)).size >= 3, direction + ' Attack must move the horse body through at least three weight phases');
  check(frames.every((captured) => captured.bounds.maxY === 22), direction + ' Attack must keep the planted ground-contact baseline');
}
for (let frame = 0; frame < 4; frame++) {
  check(
    JSON.stringify(attackFrames.get('left/' + frame).pixels) === JSON.stringify(mirrorPixels(attackFrames.get('right/' + frame).pixels, engine.SIZE)),
    'the left Steppe Hunter A' + (frame + 1) + ' profile must be the exact mirror of the right profile',
  );
  check(attackFrames.get('down/' + frame).alphaDigest !== attackFrames.get('up/' + frame).alphaDigest, 'Down and Up A' + (frame + 1) + ' must remain true distinct depth directions');
}
check(attackFrames.get('down/1').bounds.maxY === 22, 'Down A2 must drive the spear to the lower edge of the safe margin');
check(attackFrames.get('up/1').bounds.minY === 1, 'Up A2 must drive the spear to the upper edge of the safe margin');
check(attackFrames.get('left/1').bounds.minX === 1, 'Left A2 must drive the spear to the left edge of the safe margin');
check(attackFrames.get('right/1').bounds.maxX === 22, 'Right A2 must drive the spear to the right edge of the safe margin');
check(completeOutlinePixels > 0, 'Complete B must add exterior outline pixels');
check(formChangedPixels > 0, 'Form must shade source pixels');

rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_CENTAUR_ATTACK_REGISTRY, spec, 'down', 'attack', 4, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'fifth Attack frame rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_CENTAUR_ATTACK_REGISTRY, spec, 'down', 'hurt', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'Hurt rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_CENTAUR_ATTACK_REGISTRY, { kind: 'enemy', family: 'giant', variant: 'hill-breaker' }, 'down', 'attack', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'Giant rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_CENTAUR_ATTACK_REGISTRY, { kind: 'enemy', family: 'satyr', variant: 'briar-reveler' }, 'down', 'attack', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'Satyr rendering',
);

const candidateDigest = createHash('sha256').update(JSON.stringify(attackRecords)).digest('hex');
check(candidateDigest === EN_E03_CENTAUR_ATTACK_GATE.candidateFrameDigest, 'the Steppe Hunter Attack pixels drifted');

if (errors.length) {
  console.error('EN-E03 Steppe Hunter Attack validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E03 Steppe Hunter four-frame Attack validation passed.');
console.log('- Candidate scope: 1 family / 1 variant / 16 Attack frames');
console.log('- Approved Idle frames preserved: 8 / 8');
console.log('- Approved Walk frames preserved: 16 / 16');
console.log('- Connected hard-alpha horse-rider-spear silhouettes: 16 / 16');
console.log('- Planted hoof-contact checks: ' + plantedContactChecks + ' / 16');
console.log('- Distinct Attack silhouettes: 16 / 16');
console.log('- Horse-body weight phases: at least 3 / 4 per direction');
console.log('- True front/back depth attacks: 4 / 4 frames');
console.log('- Complete B added pixels: ' + completeOutlinePixels);
console.log('- Form-shaded source pixels: ' + formChangedPixels);
console.log('- Public EN-E03 families: 0');
console.log('- Candidate frame digest: ' + candidateDigest);
