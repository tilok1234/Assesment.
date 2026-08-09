import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import {
  EN_E04_NAGA_IDLE_GATE,
} from '../engine/enemy-expansion-en-e04-naga-idle.js';
import {
  EN_E04_NAGA_DEATH_SOURCE_FRAMES,
  EN_E04_NAGA_MOTION_GATE,
  EN_E04_NAGA_MOTION_REGISTRY,
} from '../engine/enemy-expansion-en-e04-naga-motion.js';
import {
  EN_E04_NAGA_EXPANDED_SLICE_GATE,
  EN_E04_NAGA_EXPANDED_SLICE_REGISTRY,
  EN_E04_TEMPLE_RAJAH_IDLE_DATA,
} from '../engine/enemy-expansion-en-e04-venom-motion-rajah-idle.js';
import {
  EN_E04_TEMPLE_RAJAH_MOTION_CONTRACT,
  EN_E04_TEMPLE_RAJAH_MOTION_FAMILY,
  EN_E04_TEMPLE_RAJAH_MOTION_GATE,
  EN_E04_TEMPLE_RAJAH_MOTION_REGISTRY,
  EN_E04_TEMPLE_RAJAH_MOTION_RENDERER,
} from '../engine/enemy-expansion-en-e04-rajah-motion.js';
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

function frameRecord(captured, direction, animation, frame) {
  return {
    family: 'naga',
    variant: 'temple-rajah',
    direction,
    animation,
    frame,
    digest: captured.digest,
    alphaDigest: captured.alphaDigest,
    opaquePixels: captured.opaquePixels,
    bounds: captured.bounds,
  };
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

function opaqueAtRow(alpha, row) {
  let count = 0;
  for (let x = 0; x < engine.SIZE; x++) if (alpha[(row * engine.SIZE) + x] !== 0) count++;
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

function changedPixelCount(first, second) {
  let changed = 0;
  for (let index = 0; index < first.pixels.length; index++) {
    if (first.pixels[index] !== second.pixels[index]) changed++;
  }
  return changed;
}

function countColors(pixels, colors) {
  return pixels.filter((color) => colors.has(color)).length;
}

check(EN_E04_NAGA_IDLE_GATE.status === 'approved', 'the approved Naga anatomy gate must remain frozen');
check(EN_E04_NAGA_MOTION_GATE.status === 'approved', 'the approved Coilguard motion gate must remain frozen');
check(EN_E04_NAGA_EXPANDED_SLICE_GATE.status === 'approved', 'the approved Rajah Idle predecessor must remain frozen');
check(EN_E04_TEMPLE_RAJAH_MOTION_GATE.status === 'approved', 'the Rajah motion gate must retain explicit paired visual approval');
check(EN_E04_TEMPLE_RAJAH_MOTION_GATE.authorizedOn === '2026-08-08', 'the Rajah motion authorization date must remain frozen');
check(EN_E04_TEMPLE_RAJAH_MOTION_GATE.authorizationEvidence.includes('very good lets do another similar sized slice') && EN_E04_TEMPLE_RAJAH_MOTION_GATE.authorizationEvidence.includes('80-frame Temple Rajah complete-motion suite only'), 'the gate must retain the exact continuation evidence and bounded interpretation');
check(EN_E04_TEMPLE_RAJAH_MOTION_GATE.approvedOn === '2026-08-08', 'the Rajah motion approval date must remain frozen');
check(EN_E04_TEMPLE_RAJAH_MOTION_GATE.approvalEvidence.includes('both exact labeled all-four-direction raw/no-outline and Complete B + Form Temple Rajah motion-suite GIFs together') && EN_E04_TEMPLE_RAJAH_MOTION_GATE.approvalEvidence.includes('said: approved, lets keep going with slices like this,, maybe a full enemy with all its animations is a good spot'), 'the gate must retain the exact paired approval and full-enemy continuation evidence');
check(EN_E04_TEMPLE_RAJAH_MOTION_GATE.precedingApproval.gateId === EN_E04_NAGA_EXPANDED_SLICE_GATE.id, 'the Rajah motion gate must identify the approved Rajah Idle predecessor');
check(EN_E04_TEMPLE_RAJAH_MOTION_GATE.precedingApproval.artifactSha256 === EN_E04_NAGA_EXPANDED_SLICE_GATE.artifactSha256, 'the approved predecessor raw board hash must remain frozen');
check(EN_E04_TEMPLE_RAJAH_MOTION_GATE.precedingApproval.assembledArtifactSha256 === EN_E04_NAGA_EXPANDED_SLICE_GATE.assembledArtifactSha256, 'the approved predecessor Complete B + Form board hash must remain frozen');
check(EN_E04_TEMPLE_RAJAH_MOTION_GATE.precedingApproval.rawAnimationSha256 === EN_E04_NAGA_EXPANDED_SLICE_GATE.reviewAnimations.raw.sha256, 'the approved predecessor raw GIF hash must remain frozen');
check(EN_E04_TEMPLE_RAJAH_MOTION_GATE.precedingApproval.completeBFormAnimationSha256 === EN_E04_NAGA_EXPANDED_SLICE_GATE.reviewAnimations.completeBForm.sha256, 'the approved predecessor Complete B + Form GIF hash must remain frozen');
check(EN_E04_TEMPLE_RAJAH_MOTION_GATE.precedingApproval.candidateFrameDigest === EN_E04_NAGA_EXPANDED_SLICE_GATE.candidateFrameDigest, 'the approved predecessor frame digest must remain frozen');
check(EN_E04_TEMPLE_RAJAH_MOTION_GATE.precedingApproval.publishedCheckpoint === '4fd887f0a174169d47f9f3bee3f98d92c2ffaf30' && EN_E04_TEMPLE_RAJAH_MOTION_GATE.precedingApproval.publishedHandoff === 'c92ee12339f38fd99e8fa87e202b50f69b89c187', 'the gate must retain the exact preceding publication checkpoints');
check(EN_E04_TEMPLE_RAJAH_MOTION_GATE.approvedMotionBaseline.gateId === EN_E04_NAGA_MOTION_GATE.id && EN_E04_TEMPLE_RAJAH_MOTION_GATE.approvedMotionBaseline.candidateFrameDigest === EN_E04_NAGA_MOTION_GATE.candidateFrameDigest, 'the approved Coilguard motion source must remain frozen');
check(EN_E04_TEMPLE_RAJAH_MOTION_GATE.approvedAnatomyBaseline.gateId === EN_E04_NAGA_IDLE_GATE.id && EN_E04_TEMPLE_RAJAH_MOTION_GATE.approvedAnatomyBaseline.candidateFrameDigest === EN_E04_NAGA_IDLE_GATE.candidateFrameDigest, 'the approved Naga anatomy source must remain frozen');
check(EN_E04_TEMPLE_RAJAH_MOTION_GATE.scope.includes('80-frame Temple Rajah elite suite') && EN_E04_TEMPLE_RAJAH_MOTION_GATE.scope.includes('eight approved Idle F1-F2 frames delegated byte-for-byte') && EN_E04_TEMPLE_RAJAH_MOTION_GATE.scope.includes('exact Cast-to-Attack aliases'), 'the gate must retain the exact 80-frame elite scope');
check(EN_E04_TEMPLE_RAJAH_MOTION_GATE.motionContract.includes('Cast aliases Attack exactly') && EN_E04_TEMPLE_RAJAH_MOTION_GATE.motionContract.includes('Death aliases Hurt H1,H2,H2,H2') && EN_E04_TEMPLE_RAJAH_MOTION_GATE.motionContract.includes('one-cell ceiling'), 'the gate must retain exact aliases and the crown ceiling contract');
check(EN_E04_TEMPLE_RAJAH_MOTION_GATE.exclusions.includes('approved Temple Rajah Idle pixel changes') && EN_E04_TEMPLE_RAJAH_MOTION_GATE.exclusions.includes('Merfolk') && EN_E04_TEMPLE_RAJAH_MOTION_GATE.exclusions.includes('Birdfolk') && EN_E04_TEMPLE_RAJAH_MOTION_GATE.exclusions.includes('registration') && EN_E04_TEMPLE_RAJAH_MOTION_GATE.exclusions.includes('release'), 'the Rajah motion gate must protect approved pixels and exclude later families/publication surfaces');
check(EN_E04_TEMPLE_RAJAH_MOTION_GATE.nextGate.includes('Visual approval is complete') && EN_E04_TEMPLE_RAJAH_MOTION_GATE.nextGate.includes('bounded publication is authorized') && EN_E04_TEMPLE_RAJAH_MOTION_GATE.nextGate.includes('one full-enemy all-animation slice'), 'the approved gate must retain the publication boundary and separately authorized next slice');
check(Object.isFrozen(EN_E04_TEMPLE_RAJAH_MOTION_GATE) && Object.isFrozen(EN_E04_TEMPLE_RAJAH_MOTION_GATE.precedingApproval) && Object.isFrozen(EN_E04_TEMPLE_RAJAH_MOTION_GATE.exclusions), 'the Rajah motion gate must be deeply immutable');

check(EN_E04_TEMPLE_RAJAH_MOTION_CONTRACT.family === 'naga' && EN_E04_TEMPLE_RAJAH_MOTION_CONTRACT.variant === 'temple-rajah' && EN_E04_TEMPLE_RAJAH_MOTION_CONTRACT.role === 'elite', 'Temple Rajah must remain the elite Naga role');
check(EN_E04_TEMPLE_RAJAH_MOTION_CONTRACT.state === 'implemented-motion-candidate' && EN_E04_TEMPLE_RAJAH_MOTION_CONTRACT.chassis === 'upright-serpentine-humanoid', 'Temple Rajah must remain a motion-candidate serpentine elite');
check(Object.isFrozen(EN_E04_TEMPLE_RAJAH_MOTION_CONTRACT), 'the Temple Rajah motion contract must be immutable');
check(EN_E04_TEMPLE_RAJAH_MOTION_REGISTRY.families.length === 1, 'the Rajah motion registry must contain exactly one family');
check(JSON.stringify(EN_E04_TEMPLE_RAJAH_MOTION_FAMILY.variants.map((variant) => variant.id)) === JSON.stringify(['temple-rajah']), 'the Rajah motion registry must contain only Temple Rajah');
check(EN_E04_TEMPLE_RAJAH_MOTION_REGISTRY.publicFamilies.length === 0 && EN_E04_TEMPLE_RAJAH_MOTION_REGISTRY.approvedFamilies.length === 0, 'the Rajah motion candidate must remain internal and non-public');
check(EN_E04_TEMPLE_RAJAH_IDLE_DATA.bakedEffects.length === 0, 'Temple Rajah must keep all command/ward effects external');
check(engine.EN_E04_TEMPLE_RAJAH_MOTION_REGISTRY === undefined && engine.EN_E04_TEMPLE_RAJAH_MOTION_GATE === undefined, 'the Rajah motion candidate must not leak through the public engine facade');
check(engine.PUBLIC_ENEMIES.length === 74 && engine.ENEMIES.length === 57, 'the Rajah motion candidate must retain current public and legacy Enemy counts');
check(engine.PUBLIC_ENEMIES.some((family) => family.id === 'naga'), 'the later approved registry/consumer gates must expose Naga generically');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!facadeSource.includes('enemy-expansion-en-e04-rajah-motion') && !facadeSource.includes('EN_E04_TEMPLE_RAJAH_MOTION'), 'the public facade must not import or expose the Rajah motion candidate');

const rajahSpec = Object.freeze({ kind: 'enemy', family: 'naga', variant: 'temple-rajah' });
const coilguardSpec = Object.freeze({ kind: 'enemy', family: 'naga', variant: 'coilguard' });
const animations = Object.freeze([
  { id: 'idle', frames: 2 },
  { id: 'walk', frames: 4 },
  { id: 'attack', frames: 4 },
  { id: 'cast', frames: 4 },
  { id: 'hurt', frames: 2 },
  { id: 'death', frames: 4 },
]);
const frames = new Map();
const candidateRecords = [];
const crimsonColors = new Set(EN_E04_TEMPLE_RAJAH_IDLE_DATA.rajah.crimson);
const goldColors = new Set(EN_E04_TEMPLE_RAJAH_IDLE_DATA.rajah.gold);
const ivoryColors = new Set(EN_E04_TEMPLE_RAJAH_IDLE_DATA.rajah.ivory);
let connectedFrames = 0;
let hardAlphaFrames = 0;
let continuousLowerRows = 0;
let exactIdleFrames = 0;
let sideMirrors = 0;
let castAliases = 0;
let deathAliases = 0;
let crimsonPixels = 0;
let goldPixels = 0;
let ivoryPixels = 0;
let changedFromCoilguard = 0;
let completeOutlinePixels = 0;
let formChangedPixels = 0;
let minOpaquePixels = Number.POSITIVE_INFINITY;
let maxOpaquePixels = 0;

for (const animation of animations) for (const direction of engine.DIRS) for (let frame = 0; frame < animation.frames; frame++) {
  const captured = captureEnemyExpansionFrame(
    EN_E04_TEMPLE_RAJAH_MOTION_REGISTRY,
    rajahSpec,
    direction,
    animation.id,
    frame,
  );
  frames.set([animation.id, direction, frame].join('/'), captured);
  candidateRecords.push(frameRecord(captured, direction, animation.id, frame));
  const label = 'Rajah/' + direction + '/' + animation.id + '/' + (frame + 1);
  check(captured.outOfBoundsWrites.length === 0, label + ' must not write outside the 24x24 cell');
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22, label + ' must retain a one-cell margin');
  const hardAlpha = captured.alpha.every((value) => value === 0 || value === 255);
  check(hardAlpha, label + ' must retain hard alpha');
  if (hardAlpha) hardAlphaFrames++;
  const components = componentCount(captured.pixels);
  check(components === 1, label + ' must retain one connected crown-armor-hood-tail silhouette');
  if (components === 1) connectedFrames++;
  for (let row = 15; row <= 22; row++) {
    const continuous = opaqueRunsAtRow(captured.alpha, row) === 1;
    check(continuous, label + ' row ' + row + ' must contain one continuous lower-body run');
    if (continuous) continuousLowerRows++;
  }
  check(opaqueAtRow(captured.alpha, 21) >= 12, label + ' must retain a broad planted coil');
  check(captured.opaquePixels >= 175 && captured.opaquePixels <= 285, label + ' must retain bounded elite visual weight');
  minOpaquePixels = Math.min(minOpaquePixels, captured.opaquePixels);
  maxOpaquePixels = Math.max(maxOpaquePixels, captured.opaquePixels);
  check(captured.renderResult.templeRajahMotionGate === EN_E04_TEMPLE_RAJAH_MOTION_GATE.id && captured.renderResult.role === 'elite', label + ' must report the Rajah motion gate and elite role');
  check(captured.renderResult.effectBoundary === EN_E04_TEMPLE_RAJAH_IDLE_DATA.effectBoundary, label + ' must report the royal external-effect boundary');
  const isWhiteFlash = (animation.id === 'hurt' && frame === 0) || (animation.id === 'death' && frame === 0);
  if (isWhiteFlash) {
    check(captured.pixels.every((color) => color === null || color === '#ffffff'), label + ' must flash the complete connected elite silhouette white');
  } else {
    const frameCrimson = countColors(captured.pixels, crimsonColors);
    const frameGold = countColors(captured.pixels, goldColors);
    const frameIvory = countColors(captured.pixels, ivoryColors);
    check(frameCrimson >= 12, label + ' must retain the crimson royal armor/sash');
    check(frameGold >= 12, label + ' must retain the gilded crown and pauldrons');
    check(frameIvory >= 4, label + ' must retain the ivory chest plate and crown tips');
    crimsonPixels += frameCrimson;
    goldPixels += frameGold;
    ivoryPixels += frameIvory;
  }

  const sourceAnimation = animation.id === 'cast' ? 'attack' : animation.id === 'death' ? 'hurt' : animation.id;
  const sourceFrame = animation.id === 'death' ? EN_E04_NAGA_DEATH_SOURCE_FRAMES[frame] : frame;
  const coilguard = captureEnemyExpansionFrame(
    EN_E04_NAGA_MOTION_REGISTRY,
    coilguardSpec,
    direction,
    sourceAnimation,
    sourceFrame,
  );
  const frameChanges = changedPixelCount(captured, coilguard);
  if (!isWhiteFlash) {
    check(frameChanges >= 30, label + ' must remain visibly distinct from Coilguard; changed pixels: ' + frameChanges);
  }
  check(regionSignature(captured, 0, 23, 17, 23) === regionSignature(coilguard, 0, 23, 17, 23), label + ' must preserve approved Naga motion tail rows 17-23 byte-for-byte');
  changedFromCoilguard += frameChanges;
  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E04_TEMPLE_RAJAH_IDLE_DATA);
  completeOutlinePixels += presentation.complete.filter((color, index) => color !== null && captured.pixels[index] === null).length;
  formChangedPixels += presentation.form.filter((color, index) => captured.pixels[index] !== null && color !== captured.pixels[index]).length;
}

for (const direction of engine.DIRS) for (let frame = 0; frame < 2; frame++) {
  const delegated = frames.get(['idle', direction, frame].join('/'));
  const approved = captureEnemyExpansionFrame(
    EN_E04_NAGA_EXPANDED_SLICE_REGISTRY,
    rajahSpec,
    direction,
    'idle',
    frame,
  );
  const exact = pixelsEqual(delegated, approved) && delegated.digest === approved.digest;
  check(exact, direction + '/Rajah Idle F' + (frame + 1) + ' must delegate the exact approved elite Idle pixels');
  if (exact) exactIdleFrames++;
}

for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = frames.get([animation.id, 'left', frame].join('/'));
  const right = frames.get([animation.id, 'right', frame].join('/'));
  const exactMirror = JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels, engine.SIZE));
  check(exactMirror, 'Rajah ' + animation.id + '/' + (frame + 1) + ' Left must be the exact mirror of Right');
  if (exactMirror) sideMirrors++;
  const down = frames.get([animation.id, 'down', frame].join('/'));
  const up = frames.get([animation.id, 'up', frame].join('/'));
  check(down.digest !== up.digest, 'Rajah ' + animation.id + '/' + (frame + 1) + ' Down and Up must remain directionally distinct');
}

for (const direction of engine.DIRS) {
  const walk = [0, 1, 2, 3].map((frame) => frames.get(['walk', direction, frame].join('/')));
  check(new Set(walk.map((captured) => captured.digest)).size === 4, direction + ' Rajah Walk must retain four distinct royal-slither phases');
  check(new Set(walk.map(groundSignature)).size === 4, direction + ' Rajah Walk must visibly travel the coil through four phases');
  const attack = [0, 1, 2, 3].map((frame) => frames.get(['attack', direction, frame].join('/')));
  check(new Set(attack.map((captured) => captured.digest)).size === 4, direction + ' Rajah Attack must retain four distinct full-body phases');
  check(new Set(attack.map((captured) => regionSignature(captured, 1, 22, 1, 19))).size >= 3, direction + ' Rajah Attack must move crown, armor, torso, and tail through at least three phases');
  const hurt = [0, 1].map((frame) => frames.get(['hurt', direction, frame].join('/')));
  check(hurt[0].alphaDigest !== hurt[1].alphaDigest, direction + ' Rajah Hurt must use two distinct full-body silhouettes');
  check(groundSignature(hurt[0]) === groundSignature(hurt[1]), direction + ' Rajah Hurt must retain the same planted anchor across H1-H2');
  for (let frame = 0; frame < 4; frame++) {
    const cast = frames.get(['cast', direction, frame].join('/'));
    const castExact = pixelsEqual(cast, attack[frame]);
    check(castExact, direction + '/Rajah Cast C' + (frame + 1) + ' must alias Attack A' + (frame + 1) + ' exactly');
    if (castExact) castAliases++;
    const death = frames.get(['death', direction, frame].join('/'));
    const sourceFrame = EN_E04_NAGA_DEATH_SOURCE_FRAMES[frame];
    const deathExact = pixelsEqual(death, hurt[sourceFrame]);
    check(deathExact, direction + '/Rajah Death D' + (frame + 1) + ' must alias Hurt H' + (sourceFrame + 1) + ' exactly');
    if (deathExact) deathAliases++;
  }
}

const candidateDigest = digestRecords(candidateRecords);
if (EN_E04_TEMPLE_RAJAH_MOTION_GATE.candidateFrameDigest) check(candidateDigest === EN_E04_TEMPLE_RAJAH_MOTION_GATE.candidateFrameDigest, 'the frozen 80-frame Rajah motion digest drifted');
if (EN_E04_TEMPLE_RAJAH_MOTION_GATE.artifactSha256) check(await sha256File(EN_E04_TEMPLE_RAJAH_MOTION_GATE.artifact) === EN_E04_TEMPLE_RAJAH_MOTION_GATE.artifactSha256, 'the raw Rajah motion review board drifted');
if (EN_E04_TEMPLE_RAJAH_MOTION_GATE.assembledArtifactSha256) check(await sha256File(EN_E04_TEMPLE_RAJAH_MOTION_GATE.assembledArtifact) === EN_E04_TEMPLE_RAJAH_MOTION_GATE.assembledArtifactSha256, 'the Complete B + Form Rajah motion review board drifted');
for (const animation of Object.values(EN_E04_TEMPLE_RAJAH_MOTION_GATE.reviewAnimations)) {
  if (animation.sha256) check(await sha256File(animation.artifact) === animation.sha256, animation.artifact + ' drifted from its frozen hash');
  check(animation.width === 640 && animation.height === 672 && animation.frames === 4 && animation.durationMs === 720, 'each Rajah review GIF must retain the 640x672 four-phase 720 ms contract');
}
check(candidateRecords.length === 80, 'the Rajah motion review must contain exactly 80 records');
check(changedFromCoilguard >= 3000, 'Temple Rajah must remain visibly distinct from Coilguard across the complete suite');
check(completeOutlinePixels > 0, 'Complete B must add exterior outline pixels across the Rajah suite');
check(formChangedPixels > 0, 'Form must shade source pixels across the Rajah suite');

try {
  EN_E04_TEMPLE_RAJAH_MOTION_RENDERER.render({ family: { id: 'naga' }, variant: { id: 'venom-oracle' } });
  errors.push('the Rajah motion renderer must reject Venom Oracle');
} catch (error) {
  check(error instanceof TypeError && error.message.includes('restricted to Temple Rajah'), 'the Rajah motion renderer rejected Venom Oracle with an unexpected error');
}

if (errors.length) {
  console.error('EN-E04 Temple Rajah motion validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E04 Temple Rajah motion validation passed.');
console.log('- Approved Temple Rajah Idle frames preserved: ' + exactIdleFrames + ' / 8');
console.log('- Temple Rajah suite frames: ' + frames.size + ' / 80');
console.log('- Connected silhouettes: ' + connectedFrames + ' / 80');
console.log('- Hard-alpha frames: ' + hardAlphaFrames + ' / 80');
console.log('- Continuous no-feet lower-body rows: ' + continuousLowerRows + ' / 640');
console.log('- Exact side mirrors: ' + sideMirrors + ' / 20');
console.log('- Rajah Cast-to-Attack aliases: ' + castAliases + ' / 16');
console.log('- Rajah Death-to-Hurt aliases: ' + deathAliases + ' / 16');
console.log('- Opaque pixel range: ' + minOpaquePixels + ' to ' + maxOpaquePixels);
console.log('- Temple Rajah crimson pixels across colored suite frames: ' + crimsonPixels);
console.log('- Temple Rajah gold pixels across colored suite frames: ' + goldPixels);
console.log('- Temple Rajah ivory pixels across colored suite frames: ' + ivoryPixels);
console.log('- Rajah changed pixels vs Coilguard suite: ' + changedFromCoilguard);
console.log('- Complete B added pixels: ' + completeOutlinePixels);
console.log('- Form-shaded source pixels: ' + formChangedPixels);
console.log('- Public EN-E04 families: ' + EN_E04_TEMPLE_RAJAH_MOTION_REGISTRY.publicFamilies.length);
console.log('- Candidate frame digest: ' + candidateDigest);
