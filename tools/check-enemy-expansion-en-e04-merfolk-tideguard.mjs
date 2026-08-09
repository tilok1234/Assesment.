import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import {
  EN_E04_TEMPLE_RAJAH_MOTION_GATE,
} from '../engine/enemy-expansion-en-e04-rajah-motion.js';
import {
  EN_E04_MERFOLK_DEATH_SOURCE_FRAMES,
  EN_E04_MERFOLK_TIDEGUARD_CONTRACT,
  EN_E04_MERFOLK_TIDEGUARD_DATA,
  EN_E04_MERFOLK_TIDEGUARD_FAMILY,
  EN_E04_MERFOLK_TIDEGUARD_GATE,
  EN_E04_MERFOLK_TIDEGUARD_REGISTRY,
} from '../engine/enemy-expansion-en-e04-merfolk-tideguard.js';
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
    family: 'merfolk',
    variant: 'tideguard',
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
  for (let x = 0; x < engine.SIZE; x++) {
    if (alpha[(row * engine.SIZE) + x] !== 0) count++;
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

function countColors(pixels, colors) {
  return pixels.filter((color) => colors.has(color)).length;
}

function pixelsEqual(first, second) {
  return JSON.stringify(first.pixels) === JSON.stringify(second.pixels);
}

check(EN_E04_TEMPLE_RAJAH_MOTION_GATE.status === 'approved', 'the approved Temple Rajah predecessor must remain frozen');
check(EN_E04_MERFOLK_TIDEGUARD_GATE.id === 'en-e04-merfolk-tideguard-full-v1', 'the Merfolk full-enemy gate id must remain frozen');
check(EN_E04_MERFOLK_TIDEGUARD_GATE.status === 'approved', 'the Merfolk candidate must retain explicit paired visual approval');
check(EN_E04_MERFOLK_TIDEGUARD_GATE.authorizedOn === '2026-08-08', 'the authorization date must remain frozen');
check(EN_E04_MERFOLK_TIDEGUARD_GATE.authorizationEvidence.includes('While approving') && EN_E04_MERFOLK_TIDEGUARD_GATE.authorizationEvidence.includes('full enemy with all its animations') && EN_E04_MERFOLK_TIDEGUARD_GATE.authorizationEvidence.includes('one complete 80-frame Merfolk Tideguard common enemy only'), 'the gate must preserve the exact approval and bounded interpretation');
check(EN_E04_MERFOLK_TIDEGUARD_GATE.approvedOn === '2026-08-09', 'the paired visual approval date must remain frozen');
check(EN_E04_MERFOLK_TIDEGUARD_GATE.approvalEvidence.includes('both exact labeled all-four-direction raw/no-outline and Complete B + Form Merfolk Tideguard full-suite GIFs together') && EN_E04_MERFOLK_TIDEGUARD_GATE.approvalEvidence.includes('said: approved'), 'the gate must retain the exact paired visual approval evidence');
check(EN_E04_MERFOLK_TIDEGUARD_GATE.precedingApproval.gateId === EN_E04_TEMPLE_RAJAH_MOTION_GATE.id, 'the gate must identify Temple Rajah as its approved predecessor');
check(EN_E04_MERFOLK_TIDEGUARD_GATE.precedingApproval.artifactSha256 === EN_E04_TEMPLE_RAJAH_MOTION_GATE.artifactSha256, 'the Rajah raw board hash must remain frozen');
check(EN_E04_MERFOLK_TIDEGUARD_GATE.precedingApproval.assembledArtifactSha256 === EN_E04_TEMPLE_RAJAH_MOTION_GATE.assembledArtifactSha256, 'the Rajah assembled board hash must remain frozen');
check(EN_E04_MERFOLK_TIDEGUARD_GATE.precedingApproval.rawAnimationSha256 === EN_E04_TEMPLE_RAJAH_MOTION_GATE.reviewAnimations.raw.sha256, 'the Rajah raw GIF hash must remain frozen');
check(EN_E04_MERFOLK_TIDEGUARD_GATE.precedingApproval.completeBFormAnimationSha256 === EN_E04_TEMPLE_RAJAH_MOTION_GATE.reviewAnimations.completeBForm.sha256, 'the Rajah assembled GIF hash must remain frozen');
check(EN_E04_MERFOLK_TIDEGUARD_GATE.precedingApproval.candidateFrameDigest === EN_E04_TEMPLE_RAJAH_MOTION_GATE.candidateFrameDigest, 'the Rajah frame digest must remain frozen');
check(EN_E04_MERFOLK_TIDEGUARD_GATE.precedingApproval.publishedCheckpoint === '38b56f316a3fa12443b5b9fb003e74dc7e8059aa' && EN_E04_MERFOLK_TIDEGUARD_GATE.precedingApproval.publishedHandoff === 'b9e597fa53b0da32633cec8cdc3c46348b92562f', 'the gate must retain the exact Rajah publication checkpoints');
check(EN_E04_MERFOLK_TIDEGUARD_GATE.scope.includes('complete 80-frame Merfolk Tideguard common enemy') && EN_E04_MERFOLK_TIDEGUARD_GATE.scope.includes('exact Cast-to-Attack aliases') && EN_E04_MERFOLK_TIDEGUARD_GATE.scope.includes('exact Death-to-Hurt aliases'), 'the gate must retain the full 80-frame suite and alias contract');
check(EN_E04_MERFOLK_TIDEGUARD_GATE.anatomyContract.includes('one fused scaled fish tail') && EN_E04_MERFOLK_TIDEGUARD_GATE.anatomyContract.includes('No direction contains ordinary legs'), 'the gate must retain the fused-tail anatomy contract');
check(EN_E04_MERFOLK_TIDEGUARD_GATE.exclusions.includes('Merfolk specialist') && EN_E04_MERFOLK_TIDEGUARD_GATE.exclusions.includes('Merfolk elite') && EN_E04_MERFOLK_TIDEGUARD_GATE.exclusions.includes('Birdfolk') && EN_E04_MERFOLK_TIDEGUARD_GATE.exclusions.includes('registration') && EN_E04_MERFOLK_TIDEGUARD_GATE.exclusions.includes('release'), 'the candidate must exclude later roles, families, integration, and release');
check(EN_E04_MERFOLK_TIDEGUARD_GATE.nextGate.includes('Visual approval is complete') && EN_E04_MERFOLK_TIDEGUARD_GATE.nextGate.includes('exact ten-file Tideguard lane') && EN_E04_MERFOLK_TIDEGUARD_GATE.nextGate.includes('No later Merfolk role'), 'the approved gate must retain bounded publication and later-work boundaries');
check(Object.isFrozen(EN_E04_MERFOLK_TIDEGUARD_GATE) && Object.isFrozen(EN_E04_MERFOLK_TIDEGUARD_GATE.precedingApproval) && Object.isFrozen(EN_E04_MERFOLK_TIDEGUARD_GATE.reviewAnimations) && Object.isFrozen(EN_E04_MERFOLK_TIDEGUARD_GATE.exclusions), 'the Merfolk gate must be deeply immutable');

check(EN_E04_MERFOLK_TIDEGUARD_CONTRACT.family === 'merfolk' && EN_E04_MERFOLK_TIDEGUARD_CONTRACT.variant === 'tideguard' && EN_E04_MERFOLK_TIDEGUARD_CONTRACT.role === 'common', 'Tideguard must remain the common Merfolk role');
check(EN_E04_MERFOLK_TIDEGUARD_CONTRACT.state === 'implemented-complete-motion-candidate' && EN_E04_MERFOLK_TIDEGUARD_CONTRACT.chassis === 'upright-piscine-humanoid', 'Tideguard must remain a complete-motion piscine-humanoid candidate');
check(Object.isFrozen(EN_E04_MERFOLK_TIDEGUARD_CONTRACT), 'the Merfolk contract must be immutable');
check(EN_E04_MERFOLK_TIDEGUARD_REGISTRY.families.length === 1, 'the lane registry must contain exactly one family');
check(JSON.stringify(EN_E04_MERFOLK_TIDEGUARD_FAMILY.variants.map((variant) => variant.id)) === JSON.stringify(['tideguard']), 'the lane registry must contain only Tideguard');
check(EN_E04_MERFOLK_TIDEGUARD_REGISTRY.publicFamilies.length === 0 && EN_E04_MERFOLK_TIDEGUARD_REGISTRY.approvedFamilies.length === 0, 'the Merfolk candidate must remain internal and non-public');
check(EN_E04_MERFOLK_TIDEGUARD_DATA.bakedEffects.length === 0, 'all Tideguard water effects must remain external');
check(engine.EN_E04_MERFOLK_TIDEGUARD_REGISTRY === undefined && engine.EN_E04_MERFOLK_TIDEGUARD_GATE === undefined, 'the Merfolk candidate must not leak through the public engine facade');
check(engine.PUBLIC_ENEMIES.length === 74 && engine.ENEMIES.length === 57, 'the Merfolk candidate must retain current public and legacy Enemy counts');
check(engine.PUBLIC_ENEMIES.some((family) => family.id === 'merfolk'), 'the later approved registry/consumer gates must expose Merfolk generically');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!facadeSource.includes('enemy-expansion-en-e04-merfolk-tideguard') && !facadeSource.includes('EN_E04_MERFOLK_TIDEGUARD'), 'the public facade must not import or expose the Merfolk candidate');

const directions = Object.freeze(['down', 'left', 'right', 'up']);
const animations = Object.freeze([
  { id: 'idle', frames: 2 },
  { id: 'walk', frames: 4 },
  { id: 'attack', frames: 4 },
  { id: 'cast', frames: 4 },
  { id: 'hurt', frames: 2 },
  { id: 'death', frames: 4 },
]);
const spec = Object.freeze({ kind: 'enemy', family: 'merfolk', variant: 'tideguard' });
const frames = new Map();
const records = [];
const scaleColors = new Set(EN_E04_MERFOLK_TIDEGUARD_DATA.merfolk.scale);
const finColors = new Set(EN_E04_MERFOLK_TIDEGUARD_DATA.merfolk.fin);
const bellyColors = new Set(EN_E04_MERFOLK_TIDEGUARD_DATA.merfolk.belly);
const bronzeColors = new Set(EN_E04_MERFOLK_TIDEGUARD_DATA.merfolk.bronze);
const coralColors = new Set(EN_E04_MERFOLK_TIDEGUARD_DATA.merfolk.coral);
const pearlColors = new Set(EN_E04_MERFOLK_TIDEGUARD_DATA.merfolk.pearl);
let connectedFrames = 0;
let hardAlphaFrames = 0;
let continuousTailRows = 0;
let broadFlukes = 0;
let sideMirrors = 0;
let castAliases = 0;
let deathAliases = 0;
let scalePixels = 0;
let finPixels = 0;
let bellyPixels = 0;
let bronzePixels = 0;
let coralPixels = 0;
let pearlPixels = 0;
let completeOutlinePixels = 0;
let formChangedPixels = 0;
let minOpaquePixels = Number.POSITIVE_INFINITY;
let maxOpaquePixels = 0;

for (const animation of animations) for (const direction of directions) for (let frame = 0; frame < animation.frames; frame++) {
  const captured = captureEnemyExpansionFrame(
    EN_E04_MERFOLK_TIDEGUARD_REGISTRY,
    spec,
    direction,
    animation.id,
    frame,
  );
  const label = 'Tideguard/' + direction + '/' + animation.id + '/' + (frame + 1);
  frames.set([animation.id, direction, frame].join('/'), captured);
  records.push(frameRecord(captured, direction, animation.id, frame));
  check(captured.outOfBoundsWrites.length === 0, label + ' must not write outside the 24x24 cell');
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22, label + ' must retain a one-cell margin');
  const hardAlpha = captured.alpha.every((value) => value === 0 || value === 255);
  check(hardAlpha, label + ' must retain hard alpha');
  if (hardAlpha) hardAlphaFrames++;
  const components = componentCount(captured.pixels);
  check(components === 1, label + ' must retain one connected head-armour-body-tail-fluke silhouette; found ' + components + ' components');
  if (components === 1) connectedFrames++;
  for (let row = 15; row <= 22; row++) {
    const continuous = opaqueRunsAtRow(captured.alpha, row) === 1;
    check(continuous, label + ' row ' + row + ' must contain one continuous fused-tail run');
    if (continuous) continuousTailRows++;
  }
  const flukeWidth = opaqueAtRow(captured.alpha, 22);
  check(flukeWidth >= 9, label + ' must retain one broad connected fluke; row-22 width was ' + flukeWidth);
  if (flukeWidth >= 9) broadFlukes++;
  check(captured.opaquePixels >= 100 && captured.opaquePixels <= 260, label + ' must retain bounded common-enemy visual weight; found ' + captured.opaquePixels);
  minOpaquePixels = Math.min(minOpaquePixels, captured.opaquePixels);
  maxOpaquePixels = Math.max(maxOpaquePixels, captured.opaquePixels);
  check(captured.renderResult.merfolkTideguardGate === EN_E04_MERFOLK_TIDEGUARD_GATE.id && captured.renderResult.role === 'common', label + ' must report the Tideguard gate and common role');
  check(captured.renderResult.lowerBody === 'single-fused-fishtail-with-connected-fluke', label + ' must report the single fused-tail lower body');
  check(captured.renderResult.effectBoundary === EN_E04_MERFOLK_TIDEGUARD_DATA.effectBoundary, label + ' must report the external water-effect boundary');
  const isWhiteFlash = (animation.id === 'hurt' && frame === 0) || (animation.id === 'death' && frame === 0);
  if (isWhiteFlash) {
    check(captured.pixels.every((color) => color === null || color === '#ffffff'), label + ' must flash the complete connected silhouette white');
  } else {
    const frameScale = countColors(captured.pixels, scaleColors);
    const frameFin = countColors(captured.pixels, finColors);
    const frameBronze = countColors(captured.pixels, bronzeColors);
    const frameCoral = countColors(captured.pixels, coralColors);
    const framePearl = countColors(captured.pixels, pearlColors);
    check(frameScale >= 4, label + ' must retain the sea-green scaled tail beneath any front belly plates');
    check(frameFin >= 14, label + ' must retain blue tide armour and fins');
    check(frameBronze >= 2, label + ' must retain bronze shell fittings');
    check(frameCoral >= 1, label + ' must retain a coral knot accent');
    check(framePearl >= 1, label + ' must retain a pale pearl highlight');
    scalePixels += frameScale;
    finPixels += frameFin;
    bellyPixels += countColors(captured.pixels, bellyColors);
    bronzePixels += frameBronze;
    coralPixels += frameCoral;
    pearlPixels += framePearl;
  }
  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E04_MERFOLK_TIDEGUARD_DATA);
  completeOutlinePixels += presentation.complete.filter((color, index) => color !== null && captured.pixels[index] === null).length;
  formChangedPixels += presentation.form.filter((color, index) => captured.pixels[index] !== null && color !== captured.pixels[index]).length;
}

check(records.length === 80, 'the full Tideguard suite must contain exactly 80 frames');
check(connectedFrames === 80, 'all 80 Tideguard frames must be one connected silhouette');
check(hardAlphaFrames === 80, 'all 80 Tideguard frames must retain hard alpha');
check(continuousTailRows === 640, 'all eight lower-body rows across all 80 frames must remain continuous');
check(broadFlukes === 80, 'all 80 Tideguard frames must retain one broad connected fluke');
check(scalePixels > 1000 && finPixels > 1000 && bellyPixels > 100 && bronzePixels > 100 && coralPixels > 100 && pearlPixels > 50, 'the 72 colored frames must retain the full Tideguard color identity');
check(completeOutlinePixels > 0 && formChangedPixels > 0, 'Complete B and Form must both materially change the presentation');

for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = frames.get([animation.id, 'left', frame].join('/'));
  const right = frames.get([animation.id, 'right', frame].join('/'));
  const exactMirror = JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels, engine.SIZE));
  check(exactMirror, 'Tideguard ' + animation.id + '/' + (frame + 1) + ' Left must be the exact mirror of Right');
  if (exactMirror) sideMirrors++;
  const down = frames.get([animation.id, 'down', frame].join('/'));
  const up = frames.get([animation.id, 'up', frame].join('/'));
  check(down.digest !== up.digest, 'Tideguard ' + animation.id + '/' + (frame + 1) + ' Down and Up must remain directionally distinct');
}

for (const direction of directions) {
  const walk = [0, 1, 2, 3].map((frame) => frames.get(['walk', direction, frame].join('/')));
  check(new Set(walk.map((captured) => captured.digest)).size === 4, direction + ' Tideguard Walk must contain four visually distinct frames');
  check(new Set(walk.map(groundSignature)).size === 4, direction + ' Tideguard Walk must contain four distinct grounded tail/fluke phases');
  const attack = [0, 1, 2, 3].map((frame) => frames.get(['attack', direction, frame].join('/')));
  check(new Set(attack.map((captured) => captured.digest)).size === 4, direction + ' Tideguard Attack must contain four distinct full-body phases');
  const hurt = [0, 1].map((frame) => frames.get(['hurt', direction, frame].join('/')));
  check(hurt[0].alphaDigest !== hurt[1].alphaDigest, direction + ' Tideguard Hurt must contain distinct recoil and recovery silhouettes');
  check(groundSignature(hurt[0]) === groundSignature(hurt[1]), direction + ' Tideguard Hurt must keep the same planted fluke through both phases');
  for (let frame = 0; frame < 4; frame++) {
    const attackFrame = frames.get(['attack', direction, frame].join('/'));
    const castFrame = frames.get(['cast', direction, frame].join('/'));
    const exact = pixelsEqual(attackFrame, castFrame) && attackFrame.digest === castFrame.digest;
    check(exact, direction + ' Cast C' + (frame + 1) + ' must alias Attack A' + (frame + 1) + ' exactly');
    if (exact) castAliases++;
    const sourceFrame = EN_E04_MERFOLK_DEATH_SOURCE_FRAMES[frame];
    const hurtFrame = frames.get(['hurt', direction, sourceFrame].join('/'));
    const deathFrame = frames.get(['death', direction, frame].join('/'));
    const deathExact = pixelsEqual(hurtFrame, deathFrame) && hurtFrame.digest === deathFrame.digest;
    check(deathExact, direction + ' Death D' + (frame + 1) + ' must alias Hurt H' + (sourceFrame + 1) + ' exactly');
    if (deathExact) deathAliases++;
  }
}

check(sideMirrors === 20, 'all 20 Left/Right animation phases must be exact mirrors');
check(castAliases === 16, 'all 16 Cast frames must be exact Attack aliases');
check(deathAliases === 16, 'all 16 Death frames must be exact Hurt aliases');
check(JSON.stringify(EN_E04_MERFOLK_DEATH_SOURCE_FRAMES) === JSON.stringify([0, 1, 1, 1]), 'Death must retain the exact H1,H2,H2,H2 source contract');

const candidateDigest = digestRecords(records);
check(candidateDigest === EN_E04_MERFOLK_TIDEGUARD_GATE.candidateFrameDigest, 'the 80-frame candidate digest must match the frozen review evidence');
check(await sha256File(EN_E04_MERFOLK_TIDEGUARD_GATE.artifact) === EN_E04_MERFOLK_TIDEGUARD_GATE.artifactSha256, 'the exact raw board hash must match the frozen gate');
check(await sha256File(EN_E04_MERFOLK_TIDEGUARD_GATE.assembledArtifact) === EN_E04_MERFOLK_TIDEGUARD_GATE.assembledArtifactSha256, 'the exact Complete B + Form board hash must match the frozen gate');
check(await sha256File(EN_E04_MERFOLK_TIDEGUARD_GATE.reviewAnimations.raw.artifact) === EN_E04_MERFOLK_TIDEGUARD_GATE.reviewAnimations.raw.sha256, 'the exact raw GIF hash must match the frozen gate');
check(await sha256File(EN_E04_MERFOLK_TIDEGUARD_GATE.reviewAnimations.completeBForm.artifact) === EN_E04_MERFOLK_TIDEGUARD_GATE.reviewAnimations.completeBForm.sha256, 'the exact Complete B + Form GIF hash must match the frozen gate');

let rejectedWrongFamily = false;
try {
  captureEnemyExpansionFrame(
    EN_E04_MERFOLK_TIDEGUARD_REGISTRY,
    { kind: 'enemy', family: 'naga', variant: 'tideguard' },
    'down',
    'idle',
    0,
  );
} catch {
  rejectedWrongFamily = true;
}
check(rejectedWrongFamily, 'the isolated registry must reject non-Merfolk family requests');

let rejectedWrongVariant = false;
try {
  captureEnemyExpansionFrame(
    EN_E04_MERFOLK_TIDEGUARD_REGISTRY,
    { kind: 'enemy', family: 'merfolk', variant: 'specialist' },
    'down',
    'idle',
    0,
  );
} catch {
  rejectedWrongVariant = true;
}
check(rejectedWrongVariant, 'the isolated registry must reject later Merfolk variants');

if (errors.length) {
  console.error('EN-E04 Merfolk Tideguard focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E04 Merfolk Tideguard focused gate passed.');
  console.log('- Exact scope: 1 family / 1 common variant / 80 frames / 4 directions / 6 animation rows');
  console.log('- Anatomy: 80/80 connected, 640/640 continuous tail rows, 80/80 broad flukes');
  console.log('- Motion: 20/20 side mirrors, 16/16 Cast aliases, 16/16 Death aliases');
  console.log('- Alpha and bounds: 80/80 hard-alpha frames; opaque range ' + minOpaquePixels + '-' + maxOpaquePixels);
  console.log('- Presentation: Complete B +' + completeOutlinePixels + ' outline pixels; Form changes ' + formChangedPixels + ' pixels');
  console.log('- Frozen candidate digest: ' + candidateDigest);
  console.log('- Public exposure: 0 families; effects remain external; exact paired visual approval is frozen');
}
