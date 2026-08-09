import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import {
  EN_E04_MERFOLK_REEFCALLER_GATE,
  EN_E04_MERFOLK_REEFCALLER_REGISTRY,
} from '../engine/enemy-expansion-en-e04-merfolk-reefcaller.js';
import {
  EN_E04_MERFOLK_PEARL_REGENT_CONTRACT,
  EN_E04_MERFOLK_PEARL_REGENT_DATA,
  EN_E04_MERFOLK_PEARL_REGENT_FAMILY,
  EN_E04_MERFOLK_PEARL_REGENT_GATE,
  EN_E04_MERFOLK_PEARL_REGENT_REGISTRY,
} from '../engine/enemy-expansion-en-e04-merfolk-pearl-regent.js';
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
    variant: 'pearl-regent',
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

const EYE_PHASES = Object.freeze({
  idle: [
    { forward: 0, lift: 0, identityPhase: 0 },
    { forward: 0, lift: 0, identityPhase: 1 },
  ],
  walk: [
    { forward: 0, lift: 0, identityPhase: 0 },
    { forward: 0, lift: 0, identityPhase: 1 },
    { forward: 0, lift: 0, identityPhase: 0 },
    { forward: 0, lift: 0, identityPhase: 1 },
  ],
  attack: [
    { forward: -1, lift: 0, identityPhase: 0 },
    { forward: -1, lift: -1, identityPhase: 0 },
    { forward: 1, lift: 0, identityPhase: 0 },
    { forward: 0, lift: 0, identityPhase: 1 },
  ],
  hurt: [
    { forward: -1, lift: -1, identityPhase: 0 },
    { forward: 0, lift: 0, identityPhase: 1 },
  ],
});

function sideEyeCoordinates(direction, animation, frame) {
  const sourceAnimation = animation === 'cast' ? 'attack' : animation === 'death' ? 'hurt' : animation;
  const sourceFrame = animation === 'death' ? [0, 1, 1, 1][frame] : frame;
  const phase = EYE_PHASES[sourceAnimation][sourceFrame];
  const coordinate = (sourceX) => ({
    x: direction === 'right' ? sourceX + phase.forward : 23 - sourceX - phase.forward,
    y: 8 + phase.identityPhase + Math.max(-1, phase.lift),
  });
  return [coordinate(14), coordinate(16)];
}

check(EN_E04_MERFOLK_REEFCALLER_GATE.status === 'approved', 'the approved Reefcaller predecessor must remain frozen');
check(EN_E04_MERFOLK_PEARL_REGENT_GATE.id === 'en-e04-merfolk-pearl-regent-full-v1', 'the Pearl Regent full-enemy gate id must remain frozen');
check(EN_E04_MERFOLK_PEARL_REGENT_GATE.status === 'approved', 'the Pearl Regent candidate must retain exact paired visual approval');
check(EN_E04_MERFOLK_PEARL_REGENT_GATE.authorizedOn === '2026-08-09', 'the Pearl Regent authorization date must remain frozen');
check(EN_E04_MERFOLK_PEARL_REGENT_GATE.authorizationEvidence.includes('lets do next') && EN_E04_MERFOLK_PEARL_REGENT_GATE.authorizationEvidence.includes('common to specialist to elite before Birdfolk') && EN_E04_MERFOLK_PEARL_REGENT_GATE.authorizationEvidence.includes('one complete 80-frame Merfolk Pearl Regent elite enemy only'), 'the gate must preserve the exact continuation evidence and bounded interpretation');
check(EN_E04_MERFOLK_PEARL_REGENT_GATE.approvedOn === '2026-08-09' && EN_E04_MERFOLK_PEARL_REGENT_GATE.approvalEvidence.includes('both coral-red side-eye pixels') && EN_E04_MERFOLK_PEARL_REGENT_GATE.approvalEvidence.includes('said: approved'), 'the gate must preserve the exact paired approval evidence');
check(EN_E04_MERFOLK_PEARL_REGENT_GATE.precedingApproval.gateId === EN_E04_MERFOLK_REEFCALLER_GATE.id, 'the gate must identify Reefcaller as its approved predecessor');
check(EN_E04_MERFOLK_PEARL_REGENT_GATE.precedingApproval.artifactSha256 === EN_E04_MERFOLK_REEFCALLER_GATE.artifactSha256, 'the Reefcaller raw board hash must remain frozen');
check(EN_E04_MERFOLK_PEARL_REGENT_GATE.precedingApproval.assembledArtifactSha256 === EN_E04_MERFOLK_REEFCALLER_GATE.assembledArtifactSha256, 'the Reefcaller assembled board hash must remain frozen');
check(EN_E04_MERFOLK_PEARL_REGENT_GATE.precedingApproval.rawAnimationSha256 === EN_E04_MERFOLK_REEFCALLER_GATE.reviewAnimations.raw.sha256, 'the Reefcaller raw GIF hash must remain frozen');
check(EN_E04_MERFOLK_PEARL_REGENT_GATE.precedingApproval.completeBFormAnimationSha256 === EN_E04_MERFOLK_REEFCALLER_GATE.reviewAnimations.completeBForm.sha256, 'the Reefcaller assembled GIF hash must remain frozen');
check(EN_E04_MERFOLK_PEARL_REGENT_GATE.precedingApproval.candidateFrameDigest === EN_E04_MERFOLK_REEFCALLER_GATE.candidateFrameDigest, 'the Reefcaller frame digest must remain frozen');
check(EN_E04_MERFOLK_PEARL_REGENT_GATE.precedingApproval.publishedCheckpoint === 'b315a32aa48d8881efe23e9d5b8553e6c0fb6b79' && EN_E04_MERFOLK_PEARL_REGENT_GATE.precedingApproval.publishedHandoff === 'e54807be33020d23ab0ff5b32938804bd83fcbb5', 'the gate must retain the exact Reefcaller publication checkpoints');
check(EN_E04_MERFOLK_PEARL_REGENT_GATE.scope.includes('complete 80-frame Merfolk Pearl Regent elite enemy') && EN_E04_MERFOLK_PEARL_REGENT_GATE.scope.includes('exact Cast-to-Attack aliases') && EN_E04_MERFOLK_PEARL_REGENT_GATE.scope.includes('exact Death-to-Hurt aliases'), 'the gate must retain the full 80-frame elite and alias contract');
check(EN_E04_MERFOLK_PEARL_REGENT_GATE.anatomyContract.includes('approved Reefcaller') && EN_E04_MERFOLK_PEARL_REGENT_GATE.anatomyContract.includes('pearl-and-gold diadem') && EN_E04_MERFOLK_PEARL_REGENT_GATE.anatomyContract.includes('without introducing ordinary legs'), 'the gate must retain the approved anatomy and connected elite identity contract');
check(EN_E04_MERFOLK_PEARL_REGENT_GATE.exclusions.includes('approved Reefcaller pixel changes') && EN_E04_MERFOLK_PEARL_REGENT_GATE.exclusions.includes('additional Merfolk variants') && EN_E04_MERFOLK_PEARL_REGENT_GATE.exclusions.includes('Birdfolk') && EN_E04_MERFOLK_PEARL_REGENT_GATE.exclusions.includes('registration') && EN_E04_MERFOLK_PEARL_REGENT_GATE.exclusions.includes('release'), 'the candidate must exclude source changes, later roles/families, integration, and release');
check(EN_E04_MERFOLK_PEARL_REGENT_GATE.nextGate.includes('Bounded commit, push, and publication of this exact ten-file Pearl Regent lane are authorized') && EN_E04_MERFOLK_PEARL_REGENT_GATE.nextGate.includes('No Birdfolk, additional Merfolk variants'), 'the approved gate must authorize only bounded Pearl Regent publication');
check(Object.isFrozen(EN_E04_MERFOLK_PEARL_REGENT_GATE) && Object.isFrozen(EN_E04_MERFOLK_PEARL_REGENT_GATE.precedingApproval) && Object.isFrozen(EN_E04_MERFOLK_PEARL_REGENT_GATE.reviewAnimations) && Object.isFrozen(EN_E04_MERFOLK_PEARL_REGENT_GATE.exclusions), 'the Pearl Regent gate must be deeply immutable');

check(EN_E04_MERFOLK_PEARL_REGENT_CONTRACT.family === 'merfolk' && EN_E04_MERFOLK_PEARL_REGENT_CONTRACT.variant === 'pearl-regent' && EN_E04_MERFOLK_PEARL_REGENT_CONTRACT.role === 'elite', 'Pearl Regent must remain the elite Merfolk role');
check(EN_E04_MERFOLK_PEARL_REGENT_CONTRACT.state === 'implemented-complete-motion-candidate' && EN_E04_MERFOLK_PEARL_REGENT_CONTRACT.chassis === 'approved-upright-piscine-humanoid', 'Pearl Regent must remain a complete-motion approved-anatomy candidate');
check(Object.isFrozen(EN_E04_MERFOLK_PEARL_REGENT_CONTRACT), 'the Pearl Regent contract must be immutable');
check(EN_E04_MERFOLK_PEARL_REGENT_REGISTRY.families.length === 1, 'the lane registry must contain exactly one family');
check(JSON.stringify(EN_E04_MERFOLK_PEARL_REGENT_FAMILY.variants.map((variant) => variant.id)) === JSON.stringify(['pearl-regent']), 'the lane registry must contain only Pearl Regent');
check(EN_E04_MERFOLK_PEARL_REGENT_REGISTRY.publicFamilies.length === 0 && EN_E04_MERFOLK_PEARL_REGENT_REGISTRY.approvedFamilies.length === 0, 'the Pearl Regent candidate must remain internal and non-public');
check(EN_E04_MERFOLK_PEARL_REGENT_DATA.bakedEffects.length === 0, 'all Pearl Regent royal tide effects must remain external');
check(engine.EN_E04_MERFOLK_PEARL_REGENT_REGISTRY === undefined && engine.EN_E04_MERFOLK_PEARL_REGENT_GATE === undefined, 'the Pearl Regent candidate must not leak through the public engine facade');
check(engine.PUBLIC_ENEMIES.length === 80 && engine.ENEMIES.length === 57, 'the Pearl Regent source must retain current public and legacy Enemy counts');
check(engine.PUBLIC_ENEMIES.some((family) => family.id === 'merfolk'), 'the later approved registry/consumer gates must expose Merfolk generically');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!facadeSource.includes('enemy-expansion-en-e04-merfolk-pearl-regent') && !facadeSource.includes('EN_E04_MERFOLK_PEARL_REGENT'), 'the public facade must not import or expose the PearlRegent candidate');

const directions = Object.freeze(['down', 'left', 'right', 'up']);
const animations = Object.freeze([
  { id: 'idle', frames: 2 },
  { id: 'walk', frames: 4 },
  { id: 'attack', frames: 4 },
  { id: 'cast', frames: 4 },
  { id: 'hurt', frames: 2 },
  { id: 'death', frames: 4 },
]);
const pearlRegentSpec = Object.freeze({ kind: 'enemy', family: 'merfolk', variant: 'pearl-regent' });
const reefcallerSpec = Object.freeze({ kind: 'enemy', family: 'merfolk', variant: 'reefcaller' });
const frames = new Map();
const records = [];
const mantleColors = new Set(EN_E04_MERFOLK_PEARL_REGENT_DATA.pearlRegent.mantle);
const coralColors = new Set(EN_E04_MERFOLK_PEARL_REGENT_DATA.pearlRegent.coral);
const pearlColors = new Set(EN_E04_MERFOLK_PEARL_REGENT_DATA.pearlRegent.pearl);
const shellGoldColors = new Set(EN_E04_MERFOLK_PEARL_REGENT_DATA.pearlRegent.shellGold);
const glowColors = new Set(EN_E04_MERFOLK_PEARL_REGENT_DATA.pearlRegent.glow);
let connectedFrames = 0;
let hardAlphaFrames = 0;
let continuousTailRows = 0;
let broadFlukes = 0;
let approvedTailLocks = 0;
let sideMirrors = 0;
let castAliases = 0;
let deathAliases = 0;
let changedFromReefcaller = 0;
let mantlePixels = 0;
let coralPixels = 0;
let pearlPixels = 0;
let shellGoldPixels = 0;
let glowPixels = 0;
let pairedSideEyeFrames = 0;
let coloredSideEyePixels = 0;
let completeOutlinePixels = 0;
let formChangedPixels = 0;
let minOpaquePixels = Number.POSITIVE_INFINITY;
let maxOpaquePixels = 0;

for (const animation of animations) for (const direction of directions) for (let frame = 0; frame < animation.frames; frame++) {
  const captured = captureEnemyExpansionFrame(
    EN_E04_MERFOLK_PEARL_REGENT_REGISTRY,
    pearlRegentSpec,
    direction,
    animation.id,
    frame,
  );
  const source = captureEnemyExpansionFrame(
    EN_E04_MERFOLK_REEFCALLER_REGISTRY,
    reefcallerSpec,
    direction,
    animation.id,
    frame,
  );
  const label = 'Pearl Regent/' + direction + '/' + animation.id + '/' + (frame + 1);
  frames.set([animation.id, direction, frame].join('/'), captured);
  records.push(frameRecord(captured, direction, animation.id, frame));
  check(captured.outOfBoundsWrites.length === 0, label + ' must not write outside the 24x24 cell');
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22, label + ' must retain a one-cell margin');
  const hardAlpha = captured.alpha.every((value) => value === 0 || value === 255);
  check(hardAlpha, label + ' must retain hard alpha');
  if (hardAlpha) hardAlphaFrames++;
  const components = componentCount(captured.pixels);
  check(components === 1, label + ' must retain one connected crown-mantle-body-tail-fluke silhouette; found ' + components + ' components');
  if (components === 1) connectedFrames++;
  for (let row = 15; row <= 22; row++) {
    const continuous = opaqueRunsAtRow(captured.alpha, row) === 1;
    check(continuous, label + ' row ' + row + ' must contain one continuous fused-tail run');
    if (continuous) continuousTailRows++;
  }
  const flukeWidth = opaqueAtRow(captured.alpha, 22);
  check(flukeWidth >= 9, label + ' must retain one broad connected fluke; row-22 width was ' + flukeWidth);
  if (flukeWidth >= 9) broadFlukes++;
  const tailLocked = regionSignature(captured, 0, 23, 16, 23) === regionSignature(source, 0, 23, 16, 23);
  check(tailLocked, label + ' must preserve approved Reefcaller tail rows 16-23 byte-for-byte');
  if (tailLocked) approvedTailLocks++;
  check(captured.opaquePixels >= 120 && captured.opaquePixels <= 280, label + ' must retain bounded elite visual weight; found ' + captured.opaquePixels);
  minOpaquePixels = Math.min(minOpaquePixels, captured.opaquePixels);
  maxOpaquePixels = Math.max(maxOpaquePixels, captured.opaquePixels);
  check(captured.renderResult.merfolkPearlRegentGate === EN_E04_MERFOLK_PEARL_REGENT_GATE.id && captured.renderResult.role === 'elite', label + ' must report the Pearl Regent gate and elite role');
  check(captured.renderResult.lowerBody === 'approved-single-fused-fishtail-with-connected-fluke', label + ' must report the approved single fused-tail lower body');
  check(captured.renderResult.effectBoundary === EN_E04_MERFOLK_PEARL_REGENT_DATA.effectBoundary, label + ' must report the external royal-tide-effect boundary');
  const isWhiteFlash = (animation.id === 'hurt' && frame === 0) || (animation.id === 'death' && frame === 0);
  const changed = changedPixelCount(captured, source);
  check(changed >= (isWhiteFlash ? 8 : 30), label + ' must remain visibly distinct from Reefcaller; changed pixels: ' + changed);
  changedFromReefcaller += changed;
  if (isWhiteFlash) {
    check(captured.pixels.every((color) => color === null || color === '#ffffff'), label + ' must flash the complete connected elite silhouette white');
  } else {
    const frameMantle = countColors(captured.pixels, mantleColors);
    const frameCoral = countColors(captured.pixels, coralColors);
    const framePearl = countColors(captured.pixels, pearlColors);
    const frameShellGold = countColors(captured.pixels, shellGoldColors);
    const frameGlow = countColors(captured.pixels, glowColors);
    check(frameMantle >= 20, label + ' must retain the deep-crimson royal mantle');
    check(frameCoral >= 2, label + ' must retain the coral-red eye/regalia accents');
    check(framePearl >= 5, label + ' must retain the nacre breastplate and diadem pearl');
    check(frameShellGold >= 8, label + ' must retain the gold diadem and shell regalia');
    check(frameGlow >= 2, label + ' must retain luminous aqua fin/regalia marks');
    if (direction === 'left' || direction === 'right') {
      const eyeColors = sideEyeCoordinates(direction, animation.id, frame).map((eye) => {
        const eyeColor = captured.pixels[(eye.y * engine.SIZE) + eye.x];
        check(eyeColor === EN_E04_MERFOLK_PEARL_REGENT_DATA.pearlRegent.coral[2], label + ' must retain both visible coral-red side eyes; eye at ' + eye.x + ',' + eye.y + ' was ' + eyeColor);
        if (eyeColor === EN_E04_MERFOLK_PEARL_REGENT_DATA.pearlRegent.coral[2]) coloredSideEyePixels++;
        return eyeColor;
      });
      if (eyeColors.every((color) => color === EN_E04_MERFOLK_PEARL_REGENT_DATA.pearlRegent.coral[2])) pairedSideEyeFrames++;
    }
    mantlePixels += frameMantle;
    coralPixels += frameCoral;
    pearlPixels += framePearl;
    shellGoldPixels += frameShellGold;
    glowPixels += frameGlow;
  }
  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E04_MERFOLK_PEARL_REGENT_DATA);
  completeOutlinePixels += presentation.complete.filter((color, index) => color !== null && captured.pixels[index] === null).length;
  formChangedPixels += presentation.form.filter((color, index) => captured.pixels[index] !== null && color !== captured.pixels[index]).length;
}

check(records.length === 80, 'the full Pearl Regent suite must contain exactly 80 frames');
check(connectedFrames === 80, 'all 80 Pearl Regent frames must be one connected silhouette');
check(hardAlphaFrames === 80, 'all 80 Pearl Regent frames must retain hard alpha');
check(continuousTailRows === 640, 'all eight lower-body rows across all 80 frames must remain continuous');
check(broadFlukes === 80, 'all 80 Pearl Regent frames must retain one broad connected fluke');
check(approvedTailLocks === 80, 'all 80 Pearl Regent frames must preserve Reefcaller tail rows 16-23 exactly');
check(changedFromReefcaller > 2500, 'the full Pearl Regent suite must remain materially distinct from Reefcaller');
check(mantlePixels > 1400 && coralPixels > 140 && pearlPixels > 350 && shellGoldPixels > 500 && glowPixels > 140, 'the 72 colored frames must retain the complete Pearl Regent color identity');
check(pairedSideEyeFrames === 36 && coloredSideEyePixels === 72, 'all 36 colored side-view frames must retain both visible coral-red eyes');
check(completeOutlinePixels > 0 && formChangedPixels > 0, 'Complete B and Form must both materially change the presentation');

for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = frames.get([animation.id, 'left', frame].join('/'));
  const right = frames.get([animation.id, 'right', frame].join('/'));
  const exactMirror = JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels, engine.SIZE));
  check(exactMirror, 'PearlRegent ' + animation.id + '/' + (frame + 1) + ' Left must be the exact mirror of Right');
  if (exactMirror) sideMirrors++;
  const down = frames.get([animation.id, 'down', frame].join('/'));
  const up = frames.get([animation.id, 'up', frame].join('/'));
  check(down.digest !== up.digest, 'PearlRegent ' + animation.id + '/' + (frame + 1) + ' Down and Up must remain directionally distinct');
}

for (const direction of directions) {
  const walk = [0, 1, 2, 3].map((frame) => frames.get(['walk', direction, frame].join('/')));
  check(new Set(walk.map((captured) => captured.digest)).size === 4, direction + ' PearlRegent Walk must contain four visually distinct frames');
  check(new Set(walk.map(groundSignature)).size === 4, direction + ' PearlRegent Walk must preserve four distinct grounded tail/fluke phases');
  const attack = [0, 1, 2, 3].map((frame) => frames.get(['attack', direction, frame].join('/')));
  check(new Set(attack.map((captured) => captured.digest)).size === 4, direction + ' PearlRegent Attack must contain four distinct full-body phases');
  const hurt = [0, 1].map((frame) => frames.get(['hurt', direction, frame].join('/')));
  check(hurt[0].alphaDigest !== hurt[1].alphaDigest, direction + ' PearlRegent Hurt must contain distinct recoil and recovery silhouettes');
  check(groundSignature(hurt[0]) === groundSignature(hurt[1]), direction + ' PearlRegent Hurt must keep the same planted fluke through both phases');
  for (let frame = 0; frame < 4; frame++) {
    const attackFrame = frames.get(['attack', direction, frame].join('/'));
    const castFrame = frames.get(['cast', direction, frame].join('/'));
    const exact = pixelsEqual(attackFrame, castFrame) && attackFrame.digest === castFrame.digest;
    check(exact, direction + ' Cast C' + (frame + 1) + ' must alias Attack A' + (frame + 1) + ' exactly');
    if (exact) castAliases++;
    const sourceFrame = [0, 1, 1, 1][frame];
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

const candidateDigest = digestRecords(records);
if (EN_E04_MERFOLK_PEARL_REGENT_GATE.candidateFrameDigest) {
  check(candidateDigest === EN_E04_MERFOLK_PEARL_REGENT_GATE.candidateFrameDigest, 'the 80-frame candidate digest must match the frozen review evidence');
}
if (EN_E04_MERFOLK_PEARL_REGENT_GATE.artifactSha256) {
  check(await sha256File(EN_E04_MERFOLK_PEARL_REGENT_GATE.artifact) === EN_E04_MERFOLK_PEARL_REGENT_GATE.artifactSha256, 'the exact raw board hash must match the frozen gate');
  check(await sha256File(EN_E04_MERFOLK_PEARL_REGENT_GATE.assembledArtifact) === EN_E04_MERFOLK_PEARL_REGENT_GATE.assembledArtifactSha256, 'the exact Complete B + Form board hash must match the frozen gate');
  check(await sha256File(EN_E04_MERFOLK_PEARL_REGENT_GATE.reviewAnimations.raw.artifact) === EN_E04_MERFOLK_PEARL_REGENT_GATE.reviewAnimations.raw.sha256, 'the exact raw GIF hash must match the frozen gate');
  check(await sha256File(EN_E04_MERFOLK_PEARL_REGENT_GATE.reviewAnimations.completeBForm.artifact) === EN_E04_MERFOLK_PEARL_REGENT_GATE.reviewAnimations.completeBForm.sha256, 'the exact Complete B + Form GIF hash must match the frozen gate');
}

let rejectedWrongVariant = false;
try {
  captureEnemyExpansionFrame(
    EN_E04_MERFOLK_PEARL_REGENT_REGISTRY,
    { kind: 'enemy', family: 'merfolk', variant: 'elite' },
    'down',
    'idle',
    0,
  );
} catch {
  rejectedWrongVariant = true;
}
check(rejectedWrongVariant, 'the isolated registry must reject later Merfolk variants');

if (errors.length) {
  console.error('EN-E04 Merfolk Pearl Regent focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E04 Merfolk Pearl Regent focused gate passed.');
  console.log('- Exact scope: 1 family / 1 elite / 80 frames / 4 directions / 6 animation rows');
  console.log('- Anatomy: 80/80 connected, 640/640 continuous tail rows, 80/80 broad flukes');
  console.log('- Source lock: 80/80 approved Reefcaller tail regions preserved');
  console.log('- Motion: 20/20 side mirrors, 16/16 Cast aliases, 16/16 Death aliases');
  console.log('- Alpha and bounds: 80/80 hard-alpha frames; opaque range ' + minOpaquePixels + '-' + maxOpaquePixels);
  console.log('- Elite distinction: ' + changedFromReefcaller + ' changed pixels vs Reefcaller');
  console.log('- Side-eye repair: ' + pairedSideEyeFrames + '/36 colored side frames retain both coral-red eyes (' + coloredSideEyePixels + '/72 eye pixels)');
  console.log('- Presentation: Complete B +' + completeOutlinePixels + ' outline pixels; Form changes ' + formChangedPixels + ' pixels');
  console.log('- Candidate digest: ' + candidateDigest + (EN_E04_MERFOLK_PEARL_REGENT_GATE.candidateFrameDigest ? ' (frozen)' : ' (not yet frozen)'));
  console.log('- Public exposure: 0 families; effects remain external; exact paired visual approval is frozen for bounded publication');
}
