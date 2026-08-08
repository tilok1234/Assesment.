import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { EN_E03_BRIAR_REVELER_CALIBRATION_DATA } from '../engine/enemy-expansion-en-e03-satyr-calibration.js';
import {
  EN_E03_SATYR_WALK_GATE,
  EN_E03_SATYR_WALK_REGISTRY,
} from '../engine/enemy-expansion-en-e03-satyr-walk.js';
import {
  EN_E03_SATYR_ATTACK_GATE,
  EN_E03_SATYR_ATTACK_REGISTRY,
} from '../engine/enemy-expansion-en-e03-satyr-attack.js';
import {
  EN_E03_SATYR_HURT_GATE,
  EN_E03_SATYR_HURT_REGISTRY,
} from '../engine/enemy-expansion-en-e03-satyr-hurt.js';
import {
  EN_E03_REED_CHARMER_IDLE_DATA,
  EN_E03_REED_CHARMER_IDLE_GATE,
  EN_E03_REED_CHARMER_IDLE_REGISTRY,
} from '../engine/enemy-expansion-en-e03-satyr-specialist-idle.js';
import {
  EN_E03_REED_CHARMER_DEATH_SOURCE_FRAMES,
  EN_E03_REED_CHARMER_MOTION_FAMILY,
  EN_E03_REED_CHARMER_MOTION_GATE,
  EN_E03_REED_CHARMER_MOTION_REGISTRY,
  EN_E03_REED_CHARMER_MOTION_RENDERER,
} from '../engine/enemy-expansion-en-e03-satyr-specialist-motion.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import {
  captureEnemyExpansionFrame,
  mirrorPixels,
} from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors = [];
const check = (condition, message) => {
  if (!condition) errors.push(message);
};

async function sha256File(relativePath) {
  return createHash('sha256').update(await readFile(path.resolve(root, relativePath))).digest('hex');
}

function frameRecord(captured, variant, direction, animation, frame) {
  return {
    family: 'satyr',
    variant,
    direction,
    animation,
    frame,
    digest: captured.digest,
    alphaDigest: captured.alphaDigest,
    opaquePixels: captured.opaquePixels,
    bounds: captured.bounds,
  };
}

function recordsFor(registry, variant, animation, count) {
  const records = [];
  const spec = { kind: 'enemy', family: 'satyr', variant };
  for (const direction of engine.DIRS) for (let frame = 0; frame < count; frame++) {
    records.push(frameRecord(
      captureEnemyExpansionFrame(registry, spec, direction, animation, frame),
      variant,
      direction,
      animation,
      frame,
    ));
  }
  return records;
}

function digestRecords(records) {
  return createHash('sha256').update(JSON.stringify(records)).digest('hex');
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
        const nextX = x + dx;
        const nextY = y + dy;
        if (nextX < 0 || nextY < 0 || nextX >= engine.SIZE || nextY >= engine.SIZE) continue;
        const next = (nextY * engine.SIZE) + nextX;
        if (visited[next] || pixels[next] === null) continue;
        visited[next] = 1;
        queue.push(next);
      }
    }
  }
  return count;
}

function regionSignature(captured, minX, maxX, minY, maxY, alphaOnly = false) {
  const values = [];
  for (let y = minY; y <= maxY; y++) for (let x = minX; x <= maxX; x++) {
    const index = (y * engine.SIZE) + x;
    values.push(alphaOnly ? captured.alpha[index] : captured.pixels[index]);
  }
  return JSON.stringify(values);
}

function groundSignature(captured) {
  return regionSignature(captured, 0, engine.SIZE - 1, 20, 22, true);
}

function pixelsEqual(first, second) {
  return JSON.stringify(first.pixels) === JSON.stringify(second.pixels);
}

check(EN_E03_REED_CHARMER_MOTION_GATE.status === 'approved', 'the grouped Reed Charmer motion gate must retain exact paired visual approval');
check(EN_E03_REED_CHARMER_MOTION_GATE.authorizedOn === '2026-08-08', 'the grouped Reed Charmer motion gate must retain its authorization date');
check(EN_E03_REED_CHARMER_MOTION_GATE.authorizationEvidence.includes('Sure lets go for it one complete motion suite we can try atleast') && EN_E03_REED_CHARMER_MOTION_GATE.authorizationEvidence.includes('one complete Reed Charmer motion suite only'), 'the gate must retain the exact larger-slice authorization and one-variant boundary');
check(EN_E03_REED_CHARMER_MOTION_GATE.approvedOn === '2026-08-08', 'the grouped Reed Charmer motion approval date must remain frozen');
check(EN_E03_REED_CHARMER_MOTION_GATE.approvalEvidence === 'Designer reviewed both exact labeled all-four-direction raw and Complete B + Form Reed Charmer motion-suite GIFs together and said: Approved.', 'the grouped gate must retain the exact paired-GIF approval evidence');
check(EN_E03_REED_CHARMER_MOTION_GATE.approvedIdle.gateId === EN_E03_REED_CHARMER_IDLE_GATE.id, 'the grouped gate must identify the approved Reed Charmer Idle baseline');
check(EN_E03_REED_CHARMER_MOTION_GATE.approvedIdle.frameDigest === EN_E03_REED_CHARMER_IDLE_GATE.candidateFrameDigest, 'the grouped gate must freeze the approved Reed Charmer Idle digest');
check(EN_E03_REED_CHARMER_MOTION_GATE.approvedIdle.publishedCheckpoint === '070f85b20c4ea77a75e35eb6d9eefd697f4b0b47', 'the grouped gate must retain the published Reed Charmer Idle implementation checkpoint');
check(EN_E03_REED_CHARMER_MOTION_GATE.approvedIdle.publishedHandoff === 'ef98e7ce576205872410029d35b0da7921438a4e', 'the grouped gate must retain the reconciled Reed Charmer Idle handoff checkpoint');
check(EN_E03_REED_CHARMER_MOTION_GATE.approvedMotionSources.walk.gateId === EN_E03_SATYR_WALK_GATE.id, 'the grouped gate must identify the approved Briar Reveler Walk source');
check(EN_E03_REED_CHARMER_MOTION_GATE.approvedMotionSources.attack.gateId === EN_E03_SATYR_ATTACK_GATE.id, 'the grouped gate must identify the approved Briar Reveler Attack source');
check(EN_E03_REED_CHARMER_MOTION_GATE.approvedMotionSources.hurt.gateId === EN_E03_SATYR_HURT_GATE.id, 'the grouped gate must identify the approved Briar Reveler Hurt source');
check(EN_E03_REED_CHARMER_MOTION_GATE.scope.includes('Walk W1-W4') && EN_E03_REED_CHARMER_MOTION_GATE.scope.includes('Death D1-D4') && EN_E03_REED_CHARMER_MOTION_GATE.scope.includes('Idle F1-F2 delegated byte-for-byte'), 'the grouped gate must state the exact complete motion scope and protected Idle context');
check(EN_E03_REED_CHARMER_MOTION_GATE.animationContract.includes('Cast aliases Reed Charmer Attack frame-for-frame') && EN_E03_REED_CHARMER_MOTION_GATE.animationContract.includes('Death aliases Reed Charmer Hurt H1,H2,H2,H2'), 'the grouped gate must retain exact Cast and Death alias contracts');
check(EN_E03_REED_CHARMER_MOTION_GATE.exclusions.includes('approved Reed Charmer Idle pixel changes') && EN_E03_REED_CHARMER_MOTION_GATE.exclusions.includes('Wildwood Hornlord') && EN_E03_REED_CHARMER_MOTION_GATE.exclusions.includes('new Cast pixels') && EN_E03_REED_CHARMER_MOTION_GATE.exclusions.includes('new Death pixels') && EN_E03_REED_CHARMER_MOTION_GATE.exclusions.includes('registration') && EN_E03_REED_CHARMER_MOTION_GATE.exclusions.includes('release'), 'the grouped gate must exclude approved-pixel changes, the elite, new alias pixels, integration, and release');
check(EN_E03_REED_CHARMER_MOTION_GATE.nextGate.includes('Visual approval and bounded publication are complete') && EN_E03_REED_CHARMER_MOTION_GATE.nextGate.includes('No later animation, variant, registration, integration, effect, release, or EN-E03 work is authorized'), 'the approved grouped gate must stop before later work without a separate continuation');
check(Object.isFrozen(EN_E03_REED_CHARMER_MOTION_GATE) && Object.isFrozen(EN_E03_REED_CHARMER_MOTION_GATE.approvedMotionSources) && Object.isFrozen(EN_E03_REED_CHARMER_MOTION_GATE.exclusions), 'the grouped gate must be deeply immutable');

check(EN_E03_REED_CHARMER_MOTION_REGISTRY.families.length === 1, 'the grouped registry must contain exactly one family');
check(EN_E03_REED_CHARMER_MOTION_FAMILY.variants.length === 1 && EN_E03_REED_CHARMER_MOTION_FAMILY.variants[0].id === 'reed-charmer', 'the grouped registry must contain only Reed Charmer');
check(EN_E03_REED_CHARMER_MOTION_REGISTRY.publicFamilies.length === 0 && EN_E03_REED_CHARMER_MOTION_REGISTRY.approvedFamilies.length === 0, 'the grouped Reed Charmer candidate must remain internal and non-public');
check(EN_E03_REED_CHARMER_IDLE_DATA.bakedEffects.length === 0 && EN_E03_REED_CHARMER_IDLE_DATA.effectBoundary === 'external-music-notes-pollen-and-charm-ring', 'all music, pollen, and charm-ring effects must remain external');
check(engine.EN_E03_REED_CHARMER_MOTION_REGISTRY === undefined && engine.EN_E03_REED_CHARMER_MOTION_GATE === undefined, 'the grouped motion candidate must not leak through the public engine facade');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!facadeSource.includes('enemy-expansion-en-e03-satyr-specialist-motion') && !facadeSource.includes('EN_E03_REED_CHARMER_MOTION'), 'the public facade must not import or expose the grouped Reed motion module');

const approvedWalkRecords = recordsFor(EN_E03_SATYR_WALK_REGISTRY, 'briar-reveler', 'walk', 4);
const approvedAttackRecords = recordsFor(EN_E03_SATYR_ATTACK_REGISTRY, 'briar-reveler', 'attack', 4);
const approvedHurtRecords = recordsFor(EN_E03_SATYR_HURT_REGISTRY, 'briar-reveler', 'hurt', 2);
check(digestRecords(approvedWalkRecords) === EN_E03_SATYR_WALK_GATE.candidateFrameDigest, 'the approved Briar Reveler Walk source drifted while exposing its draw helper');
check(digestRecords(approvedAttackRecords) === EN_E03_SATYR_ATTACK_GATE.candidateFrameDigest, 'the approved Briar Reveler Attack source drifted while exposing its draw helper');
check(digestRecords(approvedHurtRecords) === EN_E03_SATYR_HURT_GATE.candidateFrameDigest, 'the approved Briar Reveler Hurt source drifted while exposing its draw helper');

const spec = Object.freeze({ kind: 'enemy', family: 'satyr', variant: 'reed-charmer' });
const animations = Object.freeze([
  { id: 'idle', frames: 2 },
  { id: 'walk', frames: 4 },
  { id: 'attack', frames: 4 },
  { id: 'cast', frames: 4 },
  { id: 'hurt', frames: 2 },
  { id: 'death', frames: 4 },
]);
const suiteFrames = new Map();
const suiteRecords = [];
const reedColors = new Set(EN_E03_REED_CHARMER_IDLE_DATA.specialist.reed);
const wrapColors = new Set(EN_E03_REED_CHARMER_IDLE_DATA.specialist.wrap);
const sashColors = new Set(EN_E03_REED_CHARMER_IDLE_DATA.specialist.sash);
const forbiddenStaffColors = new Set(EN_E03_BRIAR_REVELER_CALIBRATION_DATA.satyr.wood);
let reedPixels = 0;
let wrapPixels = 0;
let sashPixels = 0;
let completeOutlinePixels = 0;
let formChangedPixels = 0;
let connectedFrames = 0;
let hardAlphaFrames = 0;

for (const animation of animations) for (const direction of engine.DIRS) for (let frame = 0; frame < animation.frames; frame++) {
  const captured = captureEnemyExpansionFrame(
    EN_E03_REED_CHARMER_MOTION_REGISTRY,
    spec,
    direction,
    animation.id,
    frame,
  );
  suiteFrames.set([animation.id, direction, frame].join('/'), captured);
  suiteRecords.push(frameRecord(captured, 'reed-charmer', direction, animation.id, frame));
  const label = direction + '/' + animation.id + '/' + (frame + 1);
  check(captured.outOfBoundsWrites.length === 0, label + ' must not write outside the 24x24 cell');
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22, label + ' must retain a one-cell margin');
  check(captured.alpha.every((value) => value === 0 || value === 255), label + ' must retain hard alpha');
  if (captured.alpha.every((value) => value === 0 || value === 255)) hardAlphaFrames++;
  check(componentCount(captured.pixels) === 1, label + ' must retain one connected horned-body-tail-pipe silhouette');
  if (componentCount(captured.pixels) === 1) connectedFrames++;
  check(captured.opaquePixels >= 160 && captured.opaquePixels <= 225, label + ' must retain bounded Satyr visual weight');
  check(captured.renderResult.reedCharmerMotionGate === EN_E03_REED_CHARMER_MOTION_GATE.id, label + ' must report the grouped motion gate');
  check(captured.renderResult.approvedReedCharmerIdleGate === EN_E03_REED_CHARMER_IDLE_GATE.id, label + ' must report the approved Reed Charmer Idle gate');
  check(captured.renderResult.effectBoundary === EN_E03_REED_CHARMER_IDLE_DATA.effectBoundary, label + ' must report the external effect boundary');
  const isWhiteFlash = (animation.id === 'hurt' && frame === 0) || (animation.id === 'death' && frame === 0);
  if (isWhiteFlash) {
    check(captured.pixels.every((color) => color === null || color === '#ffffff'), label + ' must flash the complete connected specialist silhouette white');
  } else {
    const frameReedPixels = captured.pixels.filter((color) => reedColors.has(color)).length;
    const frameWrapPixels = captured.pixels.filter((color) => wrapColors.has(color)).length;
    const frameSashPixels = captured.pixels.filter((color) => sashColors.has(color)).length;
    check(frameReedPixels >= 5, label + ' must retain the compact readable panpipe');
    check(frameWrapPixels >= 8, label + ' must retain the teal woven vest');
    check(frameSashPixels >= 1, label + ' must retain the gold sash/reed accent');
    check(!captured.colors.some((color) => forbiddenStaffColors.has(color)), label + ' must remove the Briar Reveler crooked staff');
    reedPixels += frameReedPixels;
    wrapPixels += frameWrapPixels;
    sashPixels += frameSashPixels;
  }
  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E03_REED_CHARMER_IDLE_DATA);
  completeOutlinePixels += presentation.complete.filter((color, index) => color !== null && captured.pixels[index] === null).length;
  formChangedPixels += presentation.form.filter((color, index) => captured.pixels[index] !== null && color !== captured.pixels[index]).length;
}

for (const direction of engine.DIRS) for (let frame = 0; frame < 2; frame++) {
  const delegated = suiteFrames.get(['idle', direction, frame].join('/'));
  const approved = captureEnemyExpansionFrame(EN_E03_REED_CHARMER_IDLE_REGISTRY, spec, direction, 'idle', frame);
  check(pixelsEqual(delegated, approved) && delegated.digest === approved.digest, direction + '/Idle F' + (frame + 1) + ' must delegate the exact approved Reed Charmer Idle pixels');
}

for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = suiteFrames.get([animation.id, 'left', frame].join('/'));
  const right = suiteFrames.get([animation.id, 'right', frame].join('/'));
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels, engine.SIZE)), animation.id + '/' + (frame + 1) + ' Left must be the exact mirror of Right');
  const down = suiteFrames.get([animation.id, 'down', frame].join('/'));
  const up = suiteFrames.get([animation.id, 'up', frame].join('/'));
  check(down.alphaDigest !== up.alphaDigest, animation.id + '/' + (frame + 1) + ' Down and Up must retain distinct depth silhouettes');
}

for (const direction of engine.DIRS) {
  const walk = [0, 1, 2, 3].map((frame) => suiteFrames.get(['walk', direction, frame].join('/')));
  check(walk[0].alphaDigest !== walk[1].alphaDigest && walk[2].alphaDigest !== walk[1].alphaDigest, direction + ' Walk weight poses must differ from the passing pose');
  check(walk[0].alphaDigest !== walk[2].alphaDigest, direction + ' Walk W1/W3 must retain opposite diagonal hoof silhouettes');
  check(walk[1].digest === walk[3].digest, direction + ' Walk W2/W4 must retain the deliberate shared passing pose');
  check(new Set(walk.map(groundSignature)).size === 3, direction + ' Walk must retain three hoof-contact cycles with only W2/W4 shared');
  check(regionSignature(walk[0], 5, 20, 9, 17) !== regionSignature(walk[1], 5, 20, 9, 17), direction + ' Walk must visibly move the torso, pipe, and vest as well as the legs');

  const attack = [0, 1, 2, 3].map((frame) => suiteFrames.get(['attack', direction, frame].join('/')));
  check(new Set(attack.map((captured) => captured.digest)).size === 4, direction + ' Attack must retain four distinct full-body pipe-playing phases');
  check(new Set(attack.map((captured) => regionSignature(captured, 3, 21, 8, 19))).size >= 3, direction + ' Attack must move the Satyr body, pipe, and hands through at least three phases');

  const hurt = [0, 1].map((frame) => suiteFrames.get(['hurt', direction, frame].join('/')));
  check(hurt[0].alphaDigest !== hurt[1].alphaDigest, direction + ' Hurt must use two distinct full-body silhouettes');
  check(groundSignature(hurt[0]) === groundSignature(hurt[1]), direction + ' Hurt must retain fixed planted split-hoof anchors across H1-H2');

  for (let frame = 0; frame < 4; frame++) {
    const cast = suiteFrames.get(['cast', direction, frame].join('/'));
    check(pixelsEqual(cast, attack[frame]), direction + '/Cast C' + (frame + 1) + ' must alias Reed Charmer Attack A' + (frame + 1) + ' exactly');
    const death = suiteFrames.get(['death', direction, frame].join('/'));
    const sourceFrame = EN_E03_REED_CHARMER_DEATH_SOURCE_FRAMES[frame];
    check(pixelsEqual(death, hurt[sourceFrame]), direction + '/Death D' + (frame + 1) + ' must alias Reed Charmer Hurt H' + (sourceFrame + 1) + ' exactly');
  }
}

const candidateDigest = digestRecords(suiteRecords);
if (EN_E03_REED_CHARMER_MOTION_GATE.candidateFrameDigest) check(candidateDigest === EN_E03_REED_CHARMER_MOTION_GATE.candidateFrameDigest, 'the frozen 80-frame Reed Charmer suite digest drifted');
if (EN_E03_REED_CHARMER_MOTION_GATE.artifactSha256) check(await sha256File(EN_E03_REED_CHARMER_MOTION_GATE.artifact) === EN_E03_REED_CHARMER_MOTION_GATE.artifactSha256, 'the raw grouped review board drifted');
if (EN_E03_REED_CHARMER_MOTION_GATE.assembledArtifactSha256) check(await sha256File(EN_E03_REED_CHARMER_MOTION_GATE.assembledArtifact) === EN_E03_REED_CHARMER_MOTION_GATE.assembledArtifactSha256, 'the Complete B + Form grouped review board drifted');
for (const animation of Object.values(EN_E03_REED_CHARMER_MOTION_GATE.reviewAnimations)) {
  if (animation.sha256) check(await sha256File(animation.artifact) === animation.sha256, animation.artifact + ' drifted from its frozen hash');
  check(animation.width === 640 && animation.height === 672 && animation.frames === 4 && animation.durationMs === 720, 'each grouped review GIF must retain the 640x672 four-phase 720 ms contract');
}

try {
  EN_E03_REED_CHARMER_MOTION_RENDERER.render({ family: { id: 'centaur' }, variant: { id: 'reed-charmer' } });
  errors.push('the grouped renderer must reject a non-Satyr family');
} catch (error) {
  check(error instanceof TypeError && error.message.includes('restricted to Satyr'), 'the grouped renderer rejected a non-Satyr family with an unexpected error');
}

if (errors.length) {
  console.error('EN-E03 Reed Charmer grouped motion validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E03 Reed Charmer grouped motion validation passed.');
console.log('- Approved Reed Charmer Idle frames preserved: 8 / 8');
console.log('- Approved Briar motion sources preserved: Walk 16 / Attack 16 / Hurt 8');
console.log('- Reed Charmer suite frames: ' + suiteRecords.length + ' / 80');
console.log('- Connected hard-alpha specialist silhouettes: ' + connectedFrames + ' / 80');
console.log('- Exact side mirrors: 20 / 20');
console.log('- Cast-to-Attack aliases: 16 / 16');
console.log('- Death-to-Hurt aliases: 16 / 16');
console.log('- Reed-pipe pixels across colored frames: ' + reedPixels);
console.log('- Teal-wrap pixels across colored frames: ' + wrapPixels);
console.log('- Gold-sash/reed pixels across colored frames: ' + sashPixels);
console.log('- Complete B added pixels: ' + completeOutlinePixels);
console.log('- Form-shaded source pixels: ' + formChangedPixels);
console.log('- Public EN-E03 families: ' + EN_E03_REED_CHARMER_MOTION_REGISTRY.publicFamilies.length);
console.log('- Candidate frame digest: ' + candidateDigest);
