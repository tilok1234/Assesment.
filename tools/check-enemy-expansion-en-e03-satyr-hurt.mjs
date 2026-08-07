import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { EN_E03_BRIAR_REVELER_CALIBRATION_DATA } from '../engine/enemy-expansion-en-e03-satyr-calibration.js';
import { EN_E03_SATYR_IDLE_GATE, EN_E03_SATYR_IDLE_REGISTRY } from '../engine/enemy-expansion-en-e03-satyr-idle.js';
import { EN_E03_SATYR_WALK_GATE, EN_E03_SATYR_WALK_REGISTRY } from '../engine/enemy-expansion-en-e03-satyr-walk.js';
import { EN_E03_SATYR_ATTACK_GATE, EN_E03_SATYR_ATTACK_REGISTRY } from '../engine/enemy-expansion-en-e03-satyr-attack.js';
import { EN_E03_CENTAUR_HURT_GATE } from '../engine/enemy-expansion-en-e03-centaur-hurt.js';
import {
  EN_E03_SATYR_HURT_FAMILY,
  EN_E03_SATYR_HURT_GATE,
  EN_E03_SATYR_HURT_REGISTRY,
} from '../engine/enemy-expansion-en-e03-satyr-hurt.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import { captureEnemyExpansionFrame, mirrorPixels } from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors = [];

function check(condition, message) { if (!condition) errors.push(message); }

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

function alphaRegionSignature(captured, minX, maxX, minY, maxY) {
  const values = [];
  for (let y = minY; y <= maxY; y++) for (let x = minX; x <= maxX; x++) values.push(captured.alpha[(y * engine.SIZE) + x]);
  return JSON.stringify(values);
}

function rowOpaqueXs(captured, row) {
  const values = [];
  for (let x = 0; x < engine.SIZE; x++) if (captured.alpha[(row * engine.SIZE) + x] !== 0) values.push(x);
  return values;
}

function frameRecord(captured, direction, animation, frame) {
  return {
    family: 'satyr', variant: 'briar-reveler', direction, animation, frame,
    digest: captured.digest, alphaDigest: captured.alphaDigest,
    opaquePixels: captured.opaquePixels, bounds: captured.bounds,
  };
}

async function sha256File(relativePath) {
  return createHash('sha256').update(await readFile(path.join(root, relativePath))).digest('hex');
}

check(EN_E03_CENTAUR_HURT_GATE.status === 'approved', 'the preceding Steppe Hunter Hurt gate must remain visually approved');
check(EN_E03_CENTAUR_HURT_GATE.approvalEvidence === 'Designer reviewed both exact labeled all-four-direction raw and Complete B + Form Steppe Hunter Hurt animations together and said: approved.', 'the preceding Steppe Hunter Hurt approval evidence must remain exact');
check(EN_E03_SATYR_IDLE_GATE.status === 'approved', 'the Briar Reveler Idle baseline must remain visually approved');
check(EN_E03_SATYR_WALK_GATE.status === 'approved', 'the Briar Reveler Walk baseline must remain visually approved');
check(EN_E03_SATYR_ATTACK_GATE.status === 'approved', 'the Briar Reveler Attack baseline must remain visually approved');
check(EN_E03_SATYR_HURT_GATE.status === 'approved', 'the Briar Reveler Hurt gate must retain direct visual approval');
check(EN_E03_SATYR_HURT_GATE.authorizedOn === '2026-08-07', 'the Briar Reveler Hurt gate must record the authorization date');
check(EN_E03_SATYR_HURT_GATE.authorizationEvidence.includes('awesome lets do next') && EN_E03_SATYR_HURT_GATE.authorizationEvidence.includes('Hurt H1-H2 across all four directions'), 'the Briar Reveler Hurt gate must retain the bounded authorization evidence');
check(EN_E03_SATYR_HURT_GATE.approvedOn === '2026-08-07', 'the Briar Reveler Hurt gate must retain its visual-approval date');
check(EN_E03_SATYR_HURT_GATE.approvalEvidence === 'Designer reviewed both exact labeled all-four-direction raw and Complete B + Form Briar Reveler Hurt animations together and said: approved lets do next.', 'the Briar Reveler Hurt gate must retain exact visual-approval evidence');
check(EN_E03_SATYR_HURT_GATE.precedingApproval.gateId === EN_E03_CENTAUR_HURT_GATE.id, 'the gate must identify the approved Steppe Hunter Hurt predecessor');
check(EN_E03_SATYR_HURT_GATE.precedingApproval.artifactSha256 === EN_E03_CENTAUR_HURT_GATE.artifactSha256, 'the preceding raw Steppe Hunter Hurt hash must remain frozen');
check(EN_E03_SATYR_HURT_GATE.precedingApproval.assembledArtifactSha256 === EN_E03_CENTAUR_HURT_GATE.assembledArtifactSha256, 'the preceding assembled Steppe Hunter Hurt hash must remain frozen');
check(EN_E03_SATYR_HURT_GATE.precedingApproval.candidateFrameDigest === EN_E03_CENTAUR_HURT_GATE.candidateFrameDigest, 'the preceding Steppe Hunter Hurt frame digest must remain frozen');
for (const [label, gate, approved] of [
  ['Idle', EN_E03_SATYR_IDLE_GATE, EN_E03_SATYR_HURT_GATE.approvedIdle],
  ['Walk', EN_E03_SATYR_WALK_GATE, EN_E03_SATYR_HURT_GATE.approvedWalk],
  ['Attack', EN_E03_SATYR_ATTACK_GATE, EN_E03_SATYR_HURT_GATE.approvedAttack],
]) {
  check(approved.gateId === gate.id, 'the Hurt gate must identify the approved Briar Reveler ' + label + ' baseline');
  check(approved.artifactSha256 === gate.artifactSha256, 'the approved raw ' + label + ' hash must remain frozen');
  check(approved.assembledArtifactSha256 === gate.assembledArtifactSha256, 'the approved assembled ' + label + ' hash must remain frozen');
  check(approved.frameDigest === gate.candidateFrameDigest, 'the approved ' + label + ' frame digest must remain frozen');
}
check(EN_E03_SATYR_HURT_GATE.artifactSha256.length === 64, 'the raw Briar Reveler Hurt review hash must be frozen');
check(EN_E03_SATYR_HURT_GATE.assembledArtifactSha256.length === 64, 'the Complete B + Form Briar Reveler Hurt review hash must be frozen');
check(EN_E03_SATYR_HURT_GATE.candidateFrameDigest.length === 64, 'the eight-frame Briar Reveler Hurt digest must be frozen');
for (const animation of Object.values(EN_E03_SATYR_HURT_GATE.reviewAnimations)) {
  check(animation.sha256.length === 64, 'each labeled Briar Reveler Hurt GIF hash must be frozen');
  check(animation.width === 192 && animation.height === 224 && animation.frames === 2 && animation.durationMs === 280, 'each labeled Hurt GIF must retain the 192x224 two-frame 280 ms contract');
}
check(EN_E03_SATYR_HURT_GATE.scope.includes('H1-H2 across Down, Left, Right, and Up'), 'the gate must name its exact two-frame/four-direction scope');
check(EN_E03_SATYR_HURT_GATE.motion.includes('complete horned goatfolk-staff silhouette') && EN_E03_SATYR_HURT_GATE.motion.includes('fixed split-hoof contacts'), 'the gate must describe its unified full-body recoil and fixed hoof anchors');
check(EN_E03_SATYR_HURT_GATE.reviewPresentation.includes('both labeled all-four-direction GIFs') && EN_E03_SATYR_HURT_GATE.reviewPresentation.includes('raw/no-outline') && EN_E03_SATYR_HURT_GATE.reviewPresentation.includes('Complete B + Form'), 'the gate must encode the mandatory dual four-direction review presentation');
check(EN_E03_SATYR_HURT_GATE.exclusions.includes('Idle pixel changes') && EN_E03_SATYR_HURT_GATE.exclusions.includes('Walk pixel changes') && EN_E03_SATYR_HURT_GATE.exclusions.includes('Attack pixel changes'), 'the gate must freeze all earlier Briar Reveler pixels');
check(EN_E03_SATYR_HURT_GATE.exclusions.includes('Cast aliases') && EN_E03_SATYR_HURT_GATE.exclusions.includes('Death aliases') && EN_E03_SATYR_HURT_GATE.exclusions.includes('registration') && EN_E03_SATYR_HURT_GATE.exclusions.includes('release'), 'the gate must exclude aliases, integration, and release');
check(EN_E03_SATYR_HURT_GATE.nextGate.includes('Visual approval is complete and this bounded lane is published') && EN_E03_SATYR_HURT_GATE.nextGate.includes('common Cast/Death alias gate'), 'the gate must record publication and the next bounded alias lane');
check(EN_E03_SATYR_HURT_FAMILY.state === 'implemented', 'the isolated candidate family must remain implemented internally');
check(EN_E03_SATYR_HURT_REGISTRY.families.length === 1 && EN_E03_SATYR_HURT_REGISTRY.publicFamilies.length === 0, 'the isolated registry must contain one internal and zero public families');
check(engine.EN_E03_SATYR_HURT_REGISTRY === undefined && engine.EN_E03_SATYR_HURT_GATE === undefined, 'the Briar Reveler Hurt candidate must not leak through the public engine facade');

if (EN_E03_SATYR_HURT_GATE.artifactSha256.length === 64) {
  check(await sha256File(EN_E03_SATYR_HURT_GATE.artifact) === EN_E03_SATYR_HURT_GATE.artifactSha256, 'the raw review PNG on disk must match the frozen gate hash');
  check(await sha256File(EN_E03_SATYR_HURT_GATE.assembledArtifact) === EN_E03_SATYR_HURT_GATE.assembledArtifactSha256, 'the Complete B + Form review PNG on disk must match the frozen gate hash');
  check(await sha256File(EN_E03_SATYR_HURT_GATE.reviewAnimations.raw.artifact) === EN_E03_SATYR_HURT_GATE.reviewAnimations.raw.sha256, 'the labeled raw GIF on disk must match the frozen gate hash');
  check(await sha256File(EN_E03_SATYR_HURT_GATE.reviewAnimations.completeBForm.artifact) === EN_E03_SATYR_HURT_GATE.reviewAnimations.completeBForm.sha256, 'the labeled Complete B + Form GIF on disk must match the frozen gate hash');
}

const spec = { kind: 'enemy', family: 'satyr', variant: 'briar-reveler' };
const delegatedIdleRecords = [];
const delegatedWalkRecords = [];
const delegatedAttackRecords = [];
const hurtFrames = new Map();
const hurtRecords = [];
let completeOutlinePixels = 0;
let formChangedPixels = 0;

function verifyDelegation(animation, frameCount, approvedRegistry, records) {
  for (const direction of engine.DIRS) for (let frame = 0; frame < frameCount; frame++) {
    const approved = captureEnemyExpansionFrame(approvedRegistry, spec, direction, animation, frame, engine.SIZE);
    const delegated = captureEnemyExpansionFrame(EN_E03_SATYR_HURT_REGISTRY, spec, direction, animation, frame, engine.SIZE);
    check(JSON.stringify(delegated.pixels) === JSON.stringify(approved.pixels), direction + '/' + animation + '/' + frame + ' must delegate byte-for-byte');
    check(delegated.digest === approved.digest && delegated.alphaDigest === approved.alphaDigest, direction + '/' + animation + '/' + frame + ' hashes must remain exact');
    records.push(frameRecord(delegated, direction, animation, frame));
  }
}

verifyDelegation('idle', 2, EN_E03_SATYR_IDLE_REGISTRY, delegatedIdleRecords);
verifyDelegation('walk', 4, EN_E03_SATYR_WALK_REGISTRY, delegatedWalkRecords);
verifyDelegation('attack', 4, EN_E03_SATYR_ATTACK_REGISTRY, delegatedAttackRecords);

const hoofAnchors = {
  down: [6, 8, 15, 17], left: [5, 7, 13, 15], right: [8, 10, 16, 18], up: [6, 8, 15, 17],
};

for (const direction of engine.DIRS) for (let frame = 0; frame < 2; frame++) {
  const captured = captureEnemyExpansionFrame(EN_E03_SATYR_HURT_REGISTRY, spec, direction, 'hurt', frame, engine.SIZE);
  hurtFrames.set(direction + '/' + frame, captured);
  check(captured.outOfBoundsWrites.length === 0, direction + '/H' + (frame + 1) + ' wrote outside the 24x24 cell');
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22, direction + '/H' + (frame + 1) + ' must preserve a one-cell margin');
  check(componentCount(captured.pixels) === 1, direction + '/H' + (frame + 1) + ' must have one connected horned-body-tail-staff silhouette');
  check(captured.alpha.every((value) => value === 0 || value === 255), direction + '/H' + (frame + 1) + ' must use binary alpha');
  check(captured.bounds.maxY === 22 && JSON.stringify(rowOpaqueXs(captured, 22)) === JSON.stringify(hoofAnchors[direction]), direction + '/H' + (frame + 1) + ' must retain the four exact split-hoof tips on the fixed baseline');
  check(frame === 0 ? captured.pixels.filter(Boolean).every((color) => color === '#ffffff') : captured.pixels.some((color) => color !== null && color !== '#ffffff'), direction + '/H' + (frame + 1) + ' must retain the full-flash/recovery color phase');
  if (frame === 1) {
    check(captured.colors.includes(EN_E03_BRIAR_REVELER_CALIBRATION_DATA.satyr.hide[0]), direction + '/H2 must retain the goat hide');
    check(captured.colors.some((color) => EN_E03_BRIAR_REVELER_CALIBRATION_DATA.satyr.hoof.includes(color)), direction + '/H2 must retain split-hoof colors');
    check(captured.colors.includes(EN_E03_BRIAR_REVELER_CALIBRATION_DATA.satyr.wood[1]), direction + '/H2 must retain the crooked staff shaft');
    check(captured.colors.some((color) => EN_E03_BRIAR_REVELER_CALIBRATION_DATA.satyr.horn.includes(color)), direction + '/H2 must retain horn colors');
  }
  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E03_BRIAR_REVELER_CALIBRATION_DATA);
  completeOutlinePixels += presentation.complete.filter((color, index) => color !== null && captured.pixels[index] === null).length;
  formChangedPixels += presentation.form.filter((color, index) => captured.pixels[index] !== null && color !== captured.pixels[index]).length;
  hurtRecords.push(frameRecord(captured, direction, 'hurt', frame));
}

check(createHash('sha256').update(JSON.stringify(delegatedIdleRecords)).digest('hex') === EN_E03_SATYR_IDLE_GATE.candidateFrameDigest, 'the delegated approved Idle records drifted');
check(createHash('sha256').update(JSON.stringify(delegatedWalkRecords)).digest('hex') === EN_E03_SATYR_WALK_GATE.candidateFrameDigest, 'the delegated approved Walk records drifted');
check(createHash('sha256').update(JSON.stringify(delegatedAttackRecords)).digest('hex') === EN_E03_SATYR_ATTACK_GATE.candidateFrameDigest, 'the delegated approved Attack records drifted');

for (const direction of engine.DIRS) {
  const impact = hurtFrames.get(direction + '/0');
  const recovery = hurtFrames.get(direction + '/1');
  check(impact.digest !== recovery.digest && impact.alphaDigest !== recovery.alphaDigest, direction + ' Hurt must use two distinct silhouettes, not a color-only flash');
  check(alphaRegionSignature(impact, 1, 22, 1, 14) !== alphaRegionSignature(recovery, 1, 22, 1, 14), direction + ' Hurt must visibly move the head, torso, hands, horns, and staff');
  check(alphaRegionSignature(impact, 1, 22, 15, 19) !== alphaRegionSignature(recovery, 1, 22, 15, 19), direction + ' Hurt must visibly move the hocks and tail');
  check(alphaRegionSignature(impact, 0, 23, 20, 22) === alphaRegionSignature(recovery, 0, 23, 20, 22), direction + ' Hurt must keep all four split-hoof contacts exact across H1-H2');
}
for (let frame = 0; frame < 2; frame++) {
  const left = hurtFrames.get('left/' + frame);
  const right = hurtFrames.get('right/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels, engine.SIZE)), 'the left Briar Reveler H' + (frame + 1) + ' profile must be the exact mirror of the right profile');
  check(hurtFrames.get('down/' + frame).alphaDigest !== hurtFrames.get('up/' + frame).alphaDigest, 'Down and Up H' + (frame + 1) + ' must remain true distinct depth directions');
}
check(hurtFrames.get('up/1').pixels[(10 * engine.SIZE) + 9] !== '#1a1c2c', 'the Up recovery must not expose the shared front/side eye ink on the back of the head');
check(new Set(hurtRecords.map((record) => record.alphaDigest)).size === 8, 'the eight Hurt frames must retain eight distinct directional silhouettes');
check(completeOutlinePixels > 0, 'Complete B must add exterior outline pixels');
check(formChangedPixels > 0, 'Form must shade source pixels');

rejects(() => engine.renderEnemyExpansionFrame(EN_E03_SATYR_HURT_REGISTRY, spec, 'down', 'cast', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }), 'authorizes only approved Idle, Walk, and Attack plus two Hurt frames', 'Cast rendering');
rejects(() => engine.renderEnemyExpansionFrame(EN_E03_SATYR_HURT_REGISTRY, spec, 'down', 'death', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }), 'authorizes only approved Idle, Walk, and Attack plus two Hurt frames', 'Death rendering');
rejects(() => engine.renderEnemyExpansionFrame(EN_E03_SATYR_HURT_REGISTRY, { kind: 'enemy', family: 'giant', variant: 'hill-breaker' }, 'down', 'hurt', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }), 'is not implemented', 'Giant rendering');
rejects(() => engine.renderEnemyExpansionFrame(EN_E03_SATYR_HURT_REGISTRY, { kind: 'enemy', family: 'centaur', variant: 'steppe-hunter' }, 'down', 'hurt', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }), 'is not implemented', 'Centaur rendering');

const candidateDigest = createHash('sha256').update(JSON.stringify(hurtRecords)).digest('hex');
check(candidateDigest === EN_E03_SATYR_HURT_GATE.candidateFrameDigest, 'the Briar Reveler Hurt pixels drifted');

if (errors.length) {
  console.error('EN-E03 Briar Reveler Hurt validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E03 Briar Reveler two-frame Hurt validation passed.');
console.log('- Candidate scope: 1 family / 1 variant / 8 Hurt frames');
console.log('- Approved Idle frames preserved: 8 / 8');
console.log('- Approved Walk frames preserved: 16 / 16');
console.log('- Approved Attack frames preserved: 16 / 16');
console.log('- Connected hard-alpha horned-body-tail-staff silhouettes: 8 / 8');
console.log('- Fixed split-hoof contact checks: 8 / 8');
console.log('- Distinct full-body Hurt silhouettes: 8 / 8');
console.log('- Left/right exact mirrors: 2 / 2');
console.log('- Complete B added pixels: ' + completeOutlinePixels);
console.log('- Form-shaded source pixels: ' + formChangedPixels);
console.log('- Public EN-E03 families: 0');
console.log('- Candidate frame digest: ' + candidateDigest);
