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
  EN_E03_CENTAUR_ATTACK_GATE,
  EN_E03_CENTAUR_ATTACK_REGISTRY,
} from '../engine/enemy-expansion-en-e03-centaur-attack.js';
import { EN_E03_GIANT_HURT_GATE } from '../engine/enemy-expansion-en-e03-giant-hurt.js';
import {
  EN_E03_CENTAUR_HURT_BODY_SHIFTS,
  EN_E03_CENTAUR_HURT_FAMILY,
  EN_E03_CENTAUR_HURT_GATE,
  EN_E03_CENTAUR_HURT_REGISTRY,
} from '../engine/enemy-expansion-en-e03-centaur-hurt.js';
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

function groundAnchorSignature(captured) {
  return alphaRegionSignature(captured, 0, engine.SIZE - 1, 20, 22);
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

check(EN_E03_GIANT_HURT_GATE.status === 'approved', 'the preceding Hill Breaker Hurt gate must remain visually approved');
check(EN_E03_GIANT_HURT_GATE.approvedOn === '2026-08-07', 'the preceding Hill Breaker Hurt approval date must remain exact');
check(EN_E03_GIANT_HURT_GATE.approvalEvidence === 'Designer reviewed both exact labeled all-four-direction raw and Complete B + Form Hill Breaker Hurt animations together and said: approved.', 'the preceding Hill Breaker Hurt visual-approval evidence must remain exact');
check(EN_E03_CENTAUR_IDLE_GATE.status === 'approved', 'the Steppe Hunter Idle baseline must remain visually approved');
check(EN_E03_CENTAUR_WALK_GATE.status === 'approved', 'the Steppe Hunter Walk baseline must remain visually approved');
check(EN_E03_CENTAUR_ATTACK_GATE.status === 'approved', 'the Steppe Hunter Attack baseline must remain visually approved');
check(EN_E03_CENTAUR_HURT_GATE.status === 'approved', 'the Steppe Hunter Hurt gate must retain direct visual approval');
check(EN_E03_CENTAUR_HURT_GATE.authorizedOn === '2026-08-07', 'the Hurt gate must record its authorization date');
check(EN_E03_CENTAUR_HURT_GATE.authorizationEvidence === 'Designer reviewed both exact labeled all-four-direction raw and Complete B + Form Hill Breaker Hurt animations together and said: approved. Designer then said: nice lets do nexrt. Codex explicitly bounded the next gate as Steppe Hunter H1-H2 across all four directions.', 'the Hurt gate must retain exact authorization evidence');
check(EN_E03_CENTAUR_HURT_GATE.approvedOn === '2026-08-07', 'the Hurt gate must retain its visual-approval date');
check(EN_E03_CENTAUR_HURT_GATE.approvalEvidence === 'Designer reviewed both exact labeled all-four-direction raw and Complete B + Form Steppe Hunter Hurt animations together and said: approved.', 'the Hurt gate must retain exact visual-approval evidence');
check(EN_E03_CENTAUR_HURT_GATE.precedingApproval.gateId === EN_E03_GIANT_HURT_GATE.id, 'the Hurt gate must identify the preceding approved Hill Breaker Hurt gate');
check(EN_E03_CENTAUR_HURT_GATE.precedingApproval.artifactSha256 === EN_E03_GIANT_HURT_GATE.artifactSha256, 'the preceding raw Hill Breaker Hurt hash must remain frozen');
check(EN_E03_CENTAUR_HURT_GATE.precedingApproval.assembledArtifactSha256 === EN_E03_GIANT_HURT_GATE.assembledArtifactSha256, 'the preceding assembled Hill Breaker Hurt hash must remain frozen');
check(EN_E03_CENTAUR_HURT_GATE.precedingApproval.candidateFrameDigest === EN_E03_GIANT_HURT_GATE.candidateFrameDigest, 'the preceding Hill Breaker Hurt frame digest must remain frozen');
check(EN_E03_CENTAUR_HURT_GATE.approvedIdle.gateId === EN_E03_CENTAUR_IDLE_GATE.id, 'the Hurt gate must identify the approved Steppe Hunter Idle baseline');
check(EN_E03_CENTAUR_HURT_GATE.approvedIdle.frameDigest === EN_E03_CENTAUR_IDLE_GATE.candidateFrameDigest, 'the Hurt gate must retain the approved Idle digest');
check(EN_E03_CENTAUR_HURT_GATE.approvedWalk.gateId === EN_E03_CENTAUR_WALK_GATE.id, 'the Hurt gate must identify the approved Steppe Hunter Walk baseline');
check(EN_E03_CENTAUR_HURT_GATE.approvedWalk.frameDigest === EN_E03_CENTAUR_WALK_GATE.candidateFrameDigest, 'the Hurt gate must retain the approved Walk digest');
check(EN_E03_CENTAUR_HURT_GATE.approvedAttack.gateId === EN_E03_CENTAUR_ATTACK_GATE.id, 'the Hurt gate must identify the approved Steppe Hunter Attack baseline');
check(EN_E03_CENTAUR_HURT_GATE.approvedAttack.artifactSha256 === EN_E03_CENTAUR_ATTACK_GATE.artifactSha256, 'the approved raw Steppe Hunter Attack hash must remain frozen');
check(EN_E03_CENTAUR_HURT_GATE.approvedAttack.assembledArtifactSha256 === EN_E03_CENTAUR_ATTACK_GATE.assembledArtifactSha256, 'the approved assembled Steppe Hunter Attack hash must remain frozen');
check(EN_E03_CENTAUR_HURT_GATE.approvedAttack.frameDigest === EN_E03_CENTAUR_ATTACK_GATE.candidateFrameDigest, 'the approved Steppe Hunter Attack digest must remain frozen');
check(EN_E03_CENTAUR_HURT_GATE.artifactSha256.length === 64, 'the raw Steppe Hunter Hurt review hash must be frozen');
check(EN_E03_CENTAUR_HURT_GATE.assembledArtifactSha256.length === 64, 'the Complete B + Form Steppe Hunter Hurt review hash must be frozen');
check(EN_E03_CENTAUR_HURT_GATE.candidateFrameDigest.length === 64, 'the eight-frame Steppe Hunter Hurt digest must be frozen');
for (const animation of Object.values(EN_E03_CENTAUR_HURT_GATE.reviewAnimations)) {
  check(animation.sha256.length === 64, 'each labeled Hurt GIF hash must be frozen');
  check(animation.width === 192 && animation.height === 224 && animation.frames === 2 && animation.durationMs === 280, 'each labeled Hurt GIF must retain the 192x224 two-frame 280 ms contract');
}
check(EN_E03_CENTAUR_HURT_GATE.scope.includes('H1-H2 across Down, Left, Right, and Up'), 'the Hurt gate must name its exact two-frame/four-direction scope');
check(EN_E03_CENTAUR_HURT_GATE.motion.includes('complete horse-rider-spear silhouette') && EN_E03_CENTAUR_HURT_GATE.motion.includes('four fixed hoof contacts'), 'the Hurt gate must describe its unified hybrid recoil and fixed hoof anchors');
check(EN_E03_CENTAUR_HURT_GATE.reviewPresentation.includes('both labeled all-four-direction GIFs') && EN_E03_CENTAUR_HURT_GATE.reviewPresentation.includes('raw/no-outline') && EN_E03_CENTAUR_HURT_GATE.reviewPresentation.includes('Complete B + Form'), 'the Hurt gate must encode the mandatory dual four-direction review presentation');
check(EN_E03_CENTAUR_HURT_GATE.exclusions.includes('Idle pixel changes') && EN_E03_CENTAUR_HURT_GATE.exclusions.includes('Walk pixel changes') && EN_E03_CENTAUR_HURT_GATE.exclusions.includes('Attack pixel changes'), 'the Hurt gate must protect every approved Steppe Hunter animation');
check(EN_E03_CENTAUR_HURT_GATE.exclusions.includes('Cast aliases') && EN_E03_CENTAUR_HURT_GATE.exclusions.includes('Death aliases'), 'the Hurt gate must exclude Cast and Death aliases');
check(EN_E03_CENTAUR_HURT_GATE.nextGate.includes('Visual approval is complete') && EN_E03_CENTAUR_HURT_GATE.nextGate.includes('this approval authorizes no later work'), 'the approved Hurt gate must stop without authorizing later EN-E03 work');
check(Object.isFrozen(EN_E03_CENTAUR_HURT_GATE) && Object.isFrozen(EN_E03_CENTAUR_HURT_GATE.reviewAnimations) && Object.isFrozen(EN_E03_CENTAUR_HURT_GATE.exclusions), 'the Hurt gate must be deeply immutable');

check(EN_E03_CENTAUR_HURT_REGISTRY.families.length === 1, 'the Hurt registry must contain exactly one family');
check(EN_E03_CENTAUR_HURT_REGISTRY.families[0].id === 'centaur', 'the Hurt registry must contain only Centaur');
check(EN_E03_CENTAUR_HURT_REGISTRY.families[0].variants.length === 1 && EN_E03_CENTAUR_HURT_REGISTRY.families[0].variants[0].id === 'steppe-hunter', 'the Hurt registry must contain only Steppe Hunter');
check(EN_E03_CENTAUR_HURT_REGISTRY.publicFamilies.length === 0 && EN_E03_CENTAUR_HURT_REGISTRY.approvedFamilies.length === 0, 'the Hurt candidate must remain internal and outside registry approval/public routing');
check(EN_E03_CENTAUR_HURT_REGISTRY.renderers[0].chassis === 'humanoid-v1', 'the Hurt renderer must retain the approved humanoid upper chassis');
check(Object.isFrozen(EN_E03_CENTAUR_HURT_REGISTRY) && Object.isFrozen(EN_E03_CENTAUR_HURT_FAMILY) && Object.isFrozen(EN_E03_CENTAUR_HURT_BODY_SHIFTS), 'the Hurt registry, family, and motion table must be immutable');

check(engine.PUBLIC_ENEMIES.length === 74, 'the Hurt candidate must not alter the later 74-family public catalog');
check(engine.ENEMIES.length === 57, 'the Hurt candidate must not alter the 57-family legacy catalog');
check(!engine.PUBLIC_ENEMIES.some((family) => family.id === 'centaur'), 'Centaur must remain absent from public consumers');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!facadeSource.includes('enemy-expansion-en-e03-centaur-hurt'), 'the public facade must not import the Centaur Hurt candidate module');
check(!facadeSource.includes('EN_E03_CENTAUR_HURT'), 'the public facade must not expose Centaur Hurt candidate symbols');

if (EN_E03_CENTAUR_HURT_GATE.artifactSha256) {
  check(await sha256File(EN_E03_CENTAUR_HURT_GATE.artifact) === EN_E03_CENTAUR_HURT_GATE.artifactSha256, 'the raw review PNG on disk must match the frozen gate hash');
  check(await sha256File(EN_E03_CENTAUR_HURT_GATE.assembledArtifact) === EN_E03_CENTAUR_HURT_GATE.assembledArtifactSha256, 'the Complete B + Form review PNG on disk must match the frozen gate hash');
  check(await sha256File(EN_E03_CENTAUR_HURT_GATE.reviewAnimations.raw.artifact) === EN_E03_CENTAUR_HURT_GATE.reviewAnimations.raw.sha256, 'the labeled raw review GIF on disk must match the frozen gate hash');
  check(await sha256File(EN_E03_CENTAUR_HURT_GATE.reviewAnimations.completeBForm.artifact) === EN_E03_CENTAUR_HURT_GATE.reviewAnimations.completeBForm.sha256, 'the labeled Complete B + Form review GIF on disk must match the frozen gate hash');
}

const spec = { kind: 'enemy', family: 'centaur', variant: 'steppe-hunter' };
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
    const delegated = captureEnemyExpansionFrame(EN_E03_CENTAUR_HURT_REGISTRY, spec, direction, animation, frame, engine.SIZE);
    check(JSON.stringify(delegated.pixels) === JSON.stringify(approved.pixels), direction + '/' + animation + '/' + frame + ' must delegate byte-for-byte');
    check(delegated.digest === approved.digest && delegated.alphaDigest === approved.alphaDigest, direction + '/' + animation + '/' + frame + ' hashes must remain exact');
    records.push(frameRecord(delegated, direction, animation, frame));
  }
}

verifyDelegation('idle', 2, EN_E03_CENTAUR_IDLE_REGISTRY, delegatedIdleRecords);
verifyDelegation('walk', 4, EN_E03_CENTAUR_WALK_REGISTRY, delegatedWalkRecords);
verifyDelegation('attack', 4, EN_E03_CENTAUR_ATTACK_REGISTRY, delegatedAttackRecords);

for (const direction of engine.DIRS) for (let frame = 0; frame < 2; frame++) {
  const captured = captureEnemyExpansionFrame(EN_E03_CENTAUR_HURT_REGISTRY, spec, direction, 'hurt', frame, engine.SIZE);
  hurtFrames.set(direction + '/' + frame, captured);
  check(captured.outOfBoundsWrites.length === 0, direction + '/H' + (frame + 1) + ' wrote outside the 24x24 cell');
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22, direction + '/H' + (frame + 1) + ' must preserve a one-cell margin');
  check(componentCount(captured.pixels) === 1, direction + '/H' + (frame + 1) + ' must have one connected horse-rider-spear silhouette');
  check(captured.alpha.every((value) => value === 0 || value === 255), direction + '/H' + (frame + 1) + ' must use binary alpha');
  check(captured.bounds.maxY === 22 && opaquePixelsAtRow(captured.alpha, 22) >= 4, direction + '/H' + (frame + 1) + ' must retain separated planted hoof contacts on the fixed baseline');
  check(frame === 0
    ? captured.pixels.filter((color) => color !== null).every((color) => color === '#ffffff')
    : captured.pixels.some((color) => color !== null && color !== '#ffffff'),
  direction + '/H' + (frame + 1) + ' must retain the intended full-flash/recovery color phase');
  if (frame === 1) {
    check(captured.colors.includes(EN_E03_STEPPE_HUNTER_CALIBRATION_DATA.horse.hide[0]), direction + '/H2 must retain the chestnut horse body');
    check(captured.colors.some((color) => EN_E03_STEPPE_HUNTER_CALIBRATION_DATA.horse.hoof.includes(color)), direction + '/H2 must retain dark hooves');
    check(captured.colors.includes(EN_E03_STEPPE_HUNTER_CALIBRATION_DATA.horse.wood[1]), direction + '/H2 must retain the spear shaft');
    check(captured.colors.some((color) => EN_E03_STEPPE_HUNTER_CALIBRATION_DATA.horse.spearhead.includes(color)), direction + '/H2 must retain the spearhead');
  }
  plantedContactChecks++;
  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E03_STEPPE_HUNTER_CALIBRATION_DATA);
  completeOutlinePixels += presentation.complete.filter((color, index) => color !== null && captured.pixels[index] === null).length;
  formChangedPixels += presentation.form.filter((color, index) => captured.pixels[index] !== null && color !== captured.pixels[index]).length;
  hurtRecords.push(frameRecord(captured, direction, 'hurt', frame));
}

check(createHash('sha256').update(JSON.stringify(delegatedIdleRecords)).digest('hex') === EN_E03_CENTAUR_IDLE_GATE.candidateFrameDigest, 'the delegated approved Idle records drifted');
check(createHash('sha256').update(JSON.stringify(delegatedWalkRecords)).digest('hex') === EN_E03_CENTAUR_WALK_GATE.candidateFrameDigest, 'the delegated approved Walk records drifted');
check(createHash('sha256').update(JSON.stringify(delegatedAttackRecords)).digest('hex') === EN_E03_CENTAUR_ATTACK_GATE.candidateFrameDigest, 'the delegated approved Attack records drifted');
for (const direction of engine.DIRS) {
  const impact = hurtFrames.get(direction + '/0');
  const recovery = hurtFrames.get(direction + '/1');
  check(impact.digest !== recovery.digest && impact.alphaDigest !== recovery.alphaDigest, direction + ' Hurt must use two distinct silhouettes, not a color-only flash');
  check(alphaRegionSignature(impact, 1, 22, 1, 13) !== alphaRegionSignature(recovery, 1, 22, 1, 13), direction + ' Hurt must visibly move the rider and spear through both phases');
  check(alphaRegionSignature(impact, 1, 22, 13, 19) !== alphaRegionSignature(recovery, 1, 22, 13, 19), direction + ' Hurt must visibly move the horse body through both phases');
  check(groundAnchorSignature(impact) === groundAnchorSignature(recovery), direction + ' Hurt must keep all four planted hoof anchors exact across H1-H2');
  check(impact.bounds.maxY === recovery.bounds.maxY, direction + ' Hurt must retain a fixed ground-contact baseline');
}
for (let frame = 0; frame < 2; frame++) {
  const left = hurtFrames.get('left/' + frame);
  const right = hurtFrames.get('right/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels, engine.SIZE)), 'the left Steppe Hunter H' + (frame + 1) + ' profile must be the exact mirror of the right profile');
  check(hurtFrames.get('down/' + frame).alphaDigest !== hurtFrames.get('up/' + frame).alphaDigest, 'Down and Up H' + (frame + 1) + ' must remain true distinct depth directions');
}
check(new Set(hurtRecords.map((record) => record.alphaDigest)).size === 8, 'the eight Hurt frames must retain eight distinct directional silhouettes');
check(completeOutlinePixels > 0, 'Complete B must add exterior outline pixels');
check(formChangedPixels > 0, 'Form must shade source pixels');

rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_CENTAUR_HURT_REGISTRY, spec, 'down', 'cast', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'authorizes only approved Idle, Walk, and Attack plus two Hurt frames',
  'Cast rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_CENTAUR_HURT_REGISTRY, spec, 'down', 'death', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'authorizes only approved Idle, Walk, and Attack plus two Hurt frames',
  'Death rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_CENTAUR_HURT_REGISTRY, { kind: 'enemy', family: 'giant', variant: 'hill-breaker' }, 'down', 'hurt', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'is not implemented',
  'Giant rendering',
);
rejects(
  () => engine.renderEnemyExpansionFrame(EN_E03_CENTAUR_HURT_REGISTRY, { kind: 'enemy', family: 'satyr', variant: 'briar-reveler' }, 'down', 'hurt', 0, { clearRect() {}, fillRect() {}, fillStyle: '#000000' }),
  'is not implemented',
  'Satyr rendering',
);

const candidateDigest = createHash('sha256').update(JSON.stringify(hurtRecords)).digest('hex');
check(candidateDigest === EN_E03_CENTAUR_HURT_GATE.candidateFrameDigest, 'the Steppe Hunter Hurt pixels drifted');

if (errors.length) {
  console.error('EN-E03 Steppe Hunter Hurt validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E03 Steppe Hunter two-frame Hurt validation passed.');
console.log('- Candidate scope: 1 family / 1 variant / 8 Hurt frames');
console.log('- Approved Idle frames preserved: 8 / 8');
console.log('- Approved Walk frames preserved: 16 / 16');
console.log('- Approved Attack frames preserved: 16 / 16');
console.log('- Connected hard-alpha horse-rider-spear silhouettes: 8 / 8');
console.log('- Fixed four-hoof contact checks: ' + plantedContactChecks + ' / 8');
console.log('- Distinct full-hybrid Hurt silhouettes: 8 / 8');
console.log('- Left/right exact mirrors: 2 / 2');
console.log('- Complete B added pixels: ' + completeOutlinePixels);
console.log('- Form-shaded source pixels: ' + formChangedPixels);
console.log('- Public EN-E03 families: 0');
console.log('- Candidate frame digest: ' + candidateDigest);
