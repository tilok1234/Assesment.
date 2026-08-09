import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import {
  EN_E04_NAGA_IDLE_GATE,
  EN_E04_NAGA_IDLE_REGISTRY,
} from '../engine/enemy-expansion-en-e04-naga-idle.js';
import {
  EN_E04_NAGA_DEATH_SOURCE_FRAMES,
  EN_E04_NAGA_MOTION_GATE,
  EN_E04_NAGA_MOTION_REGISTRY,
} from '../engine/enemy-expansion-en-e04-naga-motion.js';
import {
  EN_E04_VENOM_ORACLE_IDLE_DATA,
  EN_E04_VENOM_ORACLE_IDLE_GATE,
  EN_E04_VENOM_ORACLE_IDLE_REGISTRY,
} from '../engine/enemy-expansion-en-e04-naga-specialist-idle.js';
import {
  EN_E04_NAGA_EXPANDED_SLICE_FAMILY,
  EN_E04_NAGA_EXPANDED_SLICE_GATE,
  EN_E04_NAGA_EXPANDED_SLICE_REGISTRY,
  EN_E04_NAGA_EXPANDED_SLICE_RENDERER,
  EN_E04_TEMPLE_RAJAH_CONTRACT,
  EN_E04_TEMPLE_RAJAH_IDLE_DATA,
} from '../engine/enemy-expansion-en-e04-venom-motion-rajah-idle.js';
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
    family: 'naga',
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
check(EN_E04_VENOM_ORACLE_IDLE_GATE.status === 'approved', 'the approved Venom Oracle Idle gate must remain frozen');
check(EN_E04_NAGA_EXPANDED_SLICE_GATE.status === 'approved', 'the expanded Naga gate must retain explicit paired visual approval');
check(EN_E04_NAGA_EXPANDED_SLICE_GATE.authorizedOn === '2026-08-08', 'the expanded Naga authorization date must remain frozen');
check(EN_E04_NAGA_EXPANDED_SLICE_GATE.authorizationEvidence.includes('try bigger slices') && EN_E04_NAGA_EXPANDED_SLICE_GATE.authorizationEvidence.includes('combined 88-frame review boundary') && EN_E04_NAGA_EXPANDED_SLICE_GATE.authorizationEvidence.includes('designer said: sure lets do that'), 'the gate must retain the exact larger-slice proposal and authorization');
check(EN_E04_NAGA_EXPANDED_SLICE_GATE.approvedOn === '2026-08-08', 'the expanded Naga approval date must remain frozen');
check(EN_E04_NAGA_EXPANDED_SLICE_GATE.approvalEvidence.includes('both exact combined labeled all-four-direction raw/no-outline and Complete B + Form GIFs') && EN_E04_NAGA_EXPANDED_SLICE_GATE.approvalEvidence.includes('bottom R IDLE row') && EN_E04_NAGA_EXPANDED_SLICE_GATE.approvalEvidence.includes('said: oh right sorry i had to scroll down approved'), 'the gate must retain the exact combined visual approval evidence');
check(EN_E04_NAGA_EXPANDED_SLICE_GATE.precedingApproval.gateId === EN_E04_VENOM_ORACLE_IDLE_GATE.id, 'the expanded gate must identify the approved Venom Oracle Idle predecessor');
check(EN_E04_NAGA_EXPANDED_SLICE_GATE.precedingApproval.artifactSha256 === EN_E04_VENOM_ORACLE_IDLE_GATE.artifactSha256, 'the approved raw Venom Idle board hash must remain frozen');
check(EN_E04_NAGA_EXPANDED_SLICE_GATE.precedingApproval.assembledArtifactSha256 === EN_E04_VENOM_ORACLE_IDLE_GATE.assembledArtifactSha256, 'the approved Complete B + Form Venom Idle board hash must remain frozen');
check(EN_E04_NAGA_EXPANDED_SLICE_GATE.precedingApproval.rawAnimationSha256 === EN_E04_VENOM_ORACLE_IDLE_GATE.reviewAnimations.raw.sha256, 'the approved raw Venom Idle GIF hash must remain frozen');
check(EN_E04_NAGA_EXPANDED_SLICE_GATE.precedingApproval.completeBFormAnimationSha256 === EN_E04_VENOM_ORACLE_IDLE_GATE.reviewAnimations.completeBForm.sha256, 'the approved Complete B + Form Venom Idle GIF hash must remain frozen');
check(EN_E04_NAGA_EXPANDED_SLICE_GATE.precedingApproval.candidateFrameDigest === EN_E04_VENOM_ORACLE_IDLE_GATE.candidateFrameDigest, 'the approved Venom Idle digest must remain frozen');
check(EN_E04_NAGA_EXPANDED_SLICE_GATE.precedingApproval.publishedCheckpoint === '3365d9915ed0ac1e506470604ed1e83c84606181' && EN_E04_NAGA_EXPANDED_SLICE_GATE.precedingApproval.publishedHandoff === '2e14485', 'the expanded gate must retain the exact preceding publication checkpoints');
check(EN_E04_NAGA_EXPANDED_SLICE_GATE.approvedMotionBaseline.gateId === EN_E04_NAGA_MOTION_GATE.id && EN_E04_NAGA_EXPANDED_SLICE_GATE.approvedMotionBaseline.candidateFrameDigest === EN_E04_NAGA_MOTION_GATE.candidateFrameDigest, 'the approved Coilguard motion source must remain frozen');
check(EN_E04_NAGA_EXPANDED_SLICE_GATE.approvedAnatomyBaseline.gateId === EN_E04_NAGA_IDLE_GATE.id && EN_E04_NAGA_EXPANDED_SLICE_GATE.approvedAnatomyBaseline.candidateFrameDigest === EN_E04_NAGA_IDLE_GATE.candidateFrameDigest, 'the approved Naga anatomy source must remain frozen');
check(EN_E04_NAGA_EXPANDED_SLICE_GATE.scope.includes('combined 88-frame review slice') && EN_E04_NAGA_EXPANDED_SLICE_GATE.scope.includes('Venom Oracle Walk W1-W4') && EN_E04_NAGA_EXPANDED_SLICE_GATE.scope.includes('Temple Rajah Idle F1-F2'), 'the gate must retain the exact two-role 88-frame scope');
check(EN_E04_NAGA_EXPANDED_SLICE_GATE.motionContract.includes('Cast aliases Attack exactly') && EN_E04_NAGA_EXPANDED_SLICE_GATE.motionContract.includes('Death aliases Hurt H1,H2,H2,H2') && EN_E04_NAGA_EXPANDED_SLICE_GATE.motionContract.includes('Temple Rajah receives only'), 'the gate must retain exact aliases and the Rajah Idle-only boundary');
check(EN_E04_NAGA_EXPANDED_SLICE_GATE.exclusions.includes('approved Venom Oracle Idle pixel changes') && EN_E04_NAGA_EXPANDED_SLICE_GATE.exclusions.includes('Temple Rajah Walk') && EN_E04_NAGA_EXPANDED_SLICE_GATE.exclusions.includes('Merfolk') && EN_E04_NAGA_EXPANDED_SLICE_GATE.exclusions.includes('Birdfolk') && EN_E04_NAGA_EXPANDED_SLICE_GATE.exclusions.includes('registration') && EN_E04_NAGA_EXPANDED_SLICE_GATE.exclusions.includes('release'), 'the expanded gate must protect approved pixels and exclude later motion/families/publication surfaces');
check(EN_E04_NAGA_EXPANDED_SLICE_GATE.nextGate.includes('Visual approval is complete') && EN_E04_NAGA_EXPANDED_SLICE_GATE.nextGate.includes('bounded publication is authorized') && EN_E04_NAGA_EXPANDED_SLICE_GATE.nextGate.includes('no Temple Rajah motion, other family, registration, integration, effect, release, or broader EN-E04 work'), 'the approved gate must retain the bounded publication and post-approval stop boundary');
check(Object.isFrozen(EN_E04_NAGA_EXPANDED_SLICE_GATE) && Object.isFrozen(EN_E04_NAGA_EXPANDED_SLICE_GATE.precedingApproval) && Object.isFrozen(EN_E04_NAGA_EXPANDED_SLICE_GATE.exclusions), 'the expanded gate must be deeply immutable');

check(EN_E04_TEMPLE_RAJAH_CONTRACT.family === 'naga' && EN_E04_TEMPLE_RAJAH_CONTRACT.variant === 'temple-rajah' && EN_E04_TEMPLE_RAJAH_CONTRACT.role === 'elite', 'Temple Rajah must remain the elite Naga role');
check(EN_E04_TEMPLE_RAJAH_CONTRACT.state === 'implemented-idle-candidate' && EN_E04_TEMPLE_RAJAH_CONTRACT.chassis === 'upright-serpentine-humanoid', 'Temple Rajah must remain an Idle-only serpentine candidate');
check(Object.isFrozen(EN_E04_TEMPLE_RAJAH_CONTRACT), 'the Temple Rajah contract must be immutable');
check(EN_E04_NAGA_EXPANDED_SLICE_REGISTRY.families.length === 1, 'the expanded registry must contain exactly one family');
check(JSON.stringify(EN_E04_NAGA_EXPANDED_SLICE_FAMILY.variants.map((variant) => variant.id)) === JSON.stringify(['venom-oracle', 'temple-rajah']), 'the expanded registry must contain exactly Venom Oracle then Temple Rajah');
check(EN_E04_NAGA_EXPANDED_SLICE_REGISTRY.publicFamilies.length === 0 && EN_E04_NAGA_EXPANDED_SLICE_REGISTRY.approvedFamilies.length === 0, 'the expanded candidate must remain internal and non-public');
check(EN_E04_VENOM_ORACLE_IDLE_DATA.bakedEffects.length === 0 && EN_E04_TEMPLE_RAJAH_IDLE_DATA.bakedEffects.length === 0, 'both roles must keep all effects external');
check(engine.EN_E04_NAGA_EXPANDED_SLICE_REGISTRY === undefined && engine.EN_E04_NAGA_EXPANDED_SLICE_GATE === undefined, 'the expanded candidate must not leak through the public engine facade');
check(engine.PUBLIC_ENEMIES.length === 74 && engine.ENEMIES.length === 57, 'the expanded candidate must retain current public and legacy Enemy counts');
check(engine.PUBLIC_ENEMIES.some((family) => family.id === 'naga'), 'the later approved registry/consumer gates must expose Naga generically');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!facadeSource.includes('enemy-expansion-en-e04-venom-motion-rajah-idle') && !facadeSource.includes('EN_E04_NAGA_EXPANDED_SLICE'), 'the public facade must not import or expose the expanded slice');

const venomSpec = Object.freeze({ kind: 'enemy', family: 'naga', variant: 'venom-oracle' });
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
const venomFrames = new Map();
const rajahFrames = new Map();
const candidateRecords = [];
const veilColors = new Set(EN_E04_VENOM_ORACLE_IDLE_DATA.oracle.veil);
const venomColors = new Set(EN_E04_VENOM_ORACLE_IDLE_DATA.oracle.venom);
const oracleGoldColors = new Set(EN_E04_VENOM_ORACLE_IDLE_DATA.oracle.gold);
const crimsonColors = new Set(EN_E04_TEMPLE_RAJAH_IDLE_DATA.rajah.crimson);
const rajahGoldColors = new Set(EN_E04_TEMPLE_RAJAH_IDLE_DATA.rajah.gold);
const ivoryColors = new Set(EN_E04_TEMPLE_RAJAH_IDLE_DATA.rajah.ivory);
let connectedFrames = 0;
let hardAlphaFrames = 0;
let continuousLowerRows = 0;
let exactIdleFrames = 0;
let sideMirrors = 0;
let castAliases = 0;
let deathAliases = 0;
let oracleVeilPixels = 0;
let oracleVenomPixels = 0;
let oracleGoldPixels = 0;
let rajahCrimsonPixels = 0;
let rajahGoldPixels = 0;
let rajahIvoryPixels = 0;
let oracleChangedFromCoilguard = 0;
let rajahChangedFromCoilguard = 0;
let rajahChangedFromOracle = 0;
let completeOutlinePixels = 0;
let formChangedPixels = 0;
let minOpaquePixels = Number.POSITIVE_INFINITY;
let maxOpaquePixels = 0;

for (const animation of animations) for (const direction of engine.DIRS) for (let frame = 0; frame < animation.frames; frame++) {
  const captured = captureEnemyExpansionFrame(
    EN_E04_NAGA_EXPANDED_SLICE_REGISTRY,
    venomSpec,
    direction,
    animation.id,
    frame,
  );
  venomFrames.set([animation.id, direction, frame].join('/'), captured);
  candidateRecords.push(frameRecord(captured, 'venom-oracle', direction, animation.id, frame));
  const label = 'Venom/' + direction + '/' + animation.id + '/' + (frame + 1);
  check(captured.outOfBoundsWrites.length === 0, label + ' must not write outside the 24x24 cell');
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22, label + ' must retain a one-cell margin');
  const hardAlpha = captured.alpha.every((value) => value === 0 || value === 255);
  check(hardAlpha, label + ' must retain hard alpha');
  if (hardAlpha) hardAlphaFrames++;
  const components = componentCount(captured.pixels);
  check(components === 1, label + ' must retain one connected crown-hood-body-tail silhouette');
  if (components === 1) connectedFrames++;
  for (let row = 15; row <= 22; row++) {
    const continuous = opaqueRunsAtRow(captured.alpha, row) === 1;
    check(continuous, label + ' row ' + row + ' must contain one continuous lower-body run');
    if (continuous) continuousLowerRows++;
  }
  check(opaqueAtRow(captured.alpha, 21) >= 12, label + ' must retain a broad planted coil');
  check(captured.opaquePixels >= 175 && captured.opaquePixels <= 275, label + ' must retain bounded specialist visual weight');
  minOpaquePixels = Math.min(minOpaquePixels, captured.opaquePixels);
  maxOpaquePixels = Math.max(maxOpaquePixels, captured.opaquePixels);
  check(captured.renderResult.expandedSliceGate === EN_E04_NAGA_EXPANDED_SLICE_GATE.id, label + ' must report the expanded slice gate');
  check(captured.renderResult.effectBoundary === EN_E04_VENOM_ORACLE_IDLE_DATA.effectBoundary, label + ' must report the Venom external-effect boundary');
  const isWhiteFlash = (animation.id === 'hurt' && frame === 0) || (animation.id === 'death' && frame === 0);
  if (isWhiteFlash) {
    check(captured.pixels.every((color) => color === null || color === '#ffffff'), label + ' must flash the complete connected specialist silhouette white');
  } else {
    const frameVeil = countColors(captured.pixels, veilColors);
    const frameVenom = countColors(captured.pixels, venomColors);
    const frameGold = countColors(captured.pixels, oracleGoldColors);
    check(frameVeil >= 18, label + ' must retain the violet ritual mantle');
    check(frameVenom >= 2, label + ' must retain venom-bright crown/eye/sigil marks');
    check(frameGold >= 4, label + ' must retain the gold oracle identity');
    oracleVeilPixels += frameVeil;
    oracleVenomPixels += frameVenom;
    oracleGoldPixels += frameGold;
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
  oracleChangedFromCoilguard += changedPixelCount(captured, coilguard);
  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E04_VENOM_ORACLE_IDLE_DATA);
  completeOutlinePixels += presentation.complete.filter((color, index) => color !== null && captured.pixels[index] === null).length;
  formChangedPixels += presentation.form.filter((color, index) => captured.pixels[index] !== null && color !== captured.pixels[index]).length;
}

for (const direction of engine.DIRS) for (let frame = 0; frame < 2; frame++) {
  const delegated = venomFrames.get(['idle', direction, frame].join('/'));
  const approved = captureEnemyExpansionFrame(EN_E04_VENOM_ORACLE_IDLE_REGISTRY, venomSpec, direction, 'idle', frame);
  const exact = pixelsEqual(delegated, approved) && delegated.digest === approved.digest;
  check(exact, direction + '/Venom Idle F' + (frame + 1) + ' must delegate the exact approved specialist Idle pixels');
  if (exact) exactIdleFrames++;
}

for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = venomFrames.get([animation.id, 'left', frame].join('/'));
  const right = venomFrames.get([animation.id, 'right', frame].join('/'));
  const exactMirror = JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels, engine.SIZE));
  check(exactMirror, 'Venom ' + animation.id + '/' + (frame + 1) + ' Left must be the exact mirror of Right');
  if (exactMirror) sideMirrors++;
  const down = venomFrames.get([animation.id, 'down', frame].join('/'));
  const up = venomFrames.get([animation.id, 'up', frame].join('/'));
  check(down.digest !== up.digest, 'Venom ' + animation.id + '/' + (frame + 1) + ' Down and Up must remain directionally distinct');
}

for (const direction of engine.DIRS) {
  const walk = [0, 1, 2, 3].map((frame) => venomFrames.get(['walk', direction, frame].join('/')));
  check(new Set(walk.map((captured) => captured.digest)).size === 4, direction + ' Venom Walk must retain four distinct slither phases');
  check(new Set(walk.map(groundSignature)).size === 4, direction + ' Venom Walk must visibly travel the coil through four phases');
  const attack = [0, 1, 2, 3].map((frame) => venomFrames.get(['attack', direction, frame].join('/')));
  check(new Set(attack.map((captured) => captured.digest)).size === 4, direction + ' Venom Attack must retain four distinct full-body phases');
  check(new Set(attack.map((captured) => regionSignature(captured, 1, 22, 1, 19))).size >= 3, direction + ' Venom Attack must move crown, hood, torso, and tail through at least three phases');
  const hurt = [0, 1].map((frame) => venomFrames.get(['hurt', direction, frame].join('/')));
  check(hurt[0].alphaDigest !== hurt[1].alphaDigest, direction + ' Venom Hurt must use two distinct full-body silhouettes');
  check(groundSignature(hurt[0]) === groundSignature(hurt[1]), direction + ' Venom Hurt must retain the same planted anchor across H1-H2');
  for (let frame = 0; frame < 4; frame++) {
    const cast = venomFrames.get(['cast', direction, frame].join('/'));
    const castExact = pixelsEqual(cast, attack[frame]);
    check(castExact, direction + '/Venom Cast C' + (frame + 1) + ' must alias Attack A' + (frame + 1) + ' exactly');
    if (castExact) castAliases++;
    const death = venomFrames.get(['death', direction, frame].join('/'));
    const sourceFrame = EN_E04_NAGA_DEATH_SOURCE_FRAMES[frame];
    const deathExact = pixelsEqual(death, hurt[sourceFrame]);
    check(deathExact, direction + '/Venom Death D' + (frame + 1) + ' must alias Hurt H' + (sourceFrame + 1) + ' exactly');
    if (deathExact) deathAliases++;
  }
}

for (const direction of engine.DIRS) for (let frame = 0; frame < 2; frame++) {
  const captured = captureEnemyExpansionFrame(
    EN_E04_NAGA_EXPANDED_SLICE_REGISTRY,
    rajahSpec,
    direction,
    'idle',
    frame,
  );
  rajahFrames.set(['idle', direction, frame].join('/'), captured);
  candidateRecords.push(frameRecord(captured, 'temple-rajah', direction, 'idle', frame));
  const label = 'Rajah/' + direction + '/idle/' + (frame + 1);
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
  check(captured.opaquePixels >= 185 && captured.opaquePixels <= 245, label + ' must retain bounded elite visual weight');
  minOpaquePixels = Math.min(minOpaquePixels, captured.opaquePixels);
  maxOpaquePixels = Math.max(maxOpaquePixels, captured.opaquePixels);
  check(captured.renderResult.expandedSliceGate === EN_E04_NAGA_EXPANDED_SLICE_GATE.id && captured.renderResult.role === 'elite', label + ' must report the expanded gate and elite role');
  check(captured.renderResult.effectBoundary === EN_E04_TEMPLE_RAJAH_IDLE_DATA.effectBoundary, label + ' must report the royal external-effect boundary');
  const frameCrimson = countColors(captured.pixels, crimsonColors);
  const frameGold = countColors(captured.pixels, rajahGoldColors);
  const frameIvory = countColors(captured.pixels, ivoryColors);
  check(frameCrimson >= 12, label + ' must retain the crimson royal armor/sash');
  check(frameGold >= 12, label + ' must retain the gilded crown and pauldrons');
  check(frameIvory >= 4, label + ' must retain the ivory chest plate and crown tips');
  rajahCrimsonPixels += frameCrimson;
  rajahGoldPixels += frameGold;
  rajahIvoryPixels += frameIvory;
  const coilguard = captureEnemyExpansionFrame(EN_E04_NAGA_IDLE_REGISTRY, coilguardSpec, direction, 'idle', frame);
  const oracle = captureEnemyExpansionFrame(EN_E04_VENOM_ORACLE_IDLE_REGISTRY, venomSpec, direction, 'idle', frame);
  const changedFromCoilguard = changedPixelCount(captured, coilguard);
  const changedFromOracle = changedPixelCount(captured, oracle);
  check(changedFromCoilguard >= 35, label + ' must be visibly distinct from Coilguard');
  check(changedFromOracle >= 30, label + ' must be visibly distinct from Venom Oracle');
  check(regionSignature(captured, 0, 23, 17, 23) === regionSignature(coilguard, 0, 23, 17, 23), label + ' must preserve the approved Coilguard tail rows 17-23 byte-for-byte');
  rajahChangedFromCoilguard += changedFromCoilguard;
  rajahChangedFromOracle += changedFromOracle;
  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E04_TEMPLE_RAJAH_IDLE_DATA);
  completeOutlinePixels += presentation.complete.filter((color, index) => color !== null && captured.pixels[index] === null).length;
  formChangedPixels += presentation.form.filter((color, index) => captured.pixels[index] !== null && color !== captured.pixels[index]).length;
}

for (let frame = 0; frame < 2; frame++) {
  const left = rajahFrames.get(['idle', 'left', frame].join('/'));
  const right = rajahFrames.get(['idle', 'right', frame].join('/'));
  const exactMirror = JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels, engine.SIZE));
  check(exactMirror, 'Rajah Idle F' + (frame + 1) + ' Left must be the exact mirror of Right');
  if (exactMirror) sideMirrors++;
  const down = rajahFrames.get(['idle', 'down', frame].join('/'));
  const up = rajahFrames.get(['idle', 'up', frame].join('/'));
  check(down.digest !== up.digest, 'Rajah Idle F' + (frame + 1) + ' Down and Up must remain directionally distinct');
}
for (const direction of engine.DIRS) {
  const first = rajahFrames.get(['idle', direction, 0].join('/'));
  const second = rajahFrames.get(['idle', direction, 1].join('/'));
  check(first.alphaDigest !== second.alphaDigest, direction + ' Rajah Idle F1/F2 must visibly settle the crown, armor, and torso');
}

const candidateDigest = digestRecords(candidateRecords);
if (EN_E04_NAGA_EXPANDED_SLICE_GATE.candidateFrameDigest) check(candidateDigest === EN_E04_NAGA_EXPANDED_SLICE_GATE.candidateFrameDigest, 'the frozen 88-frame expanded-slice digest drifted');
if (EN_E04_NAGA_EXPANDED_SLICE_GATE.artifactSha256) check(await sha256File(EN_E04_NAGA_EXPANDED_SLICE_GATE.artifact) === EN_E04_NAGA_EXPANDED_SLICE_GATE.artifactSha256, 'the raw expanded-slice review board drifted');
if (EN_E04_NAGA_EXPANDED_SLICE_GATE.assembledArtifactSha256) check(await sha256File(EN_E04_NAGA_EXPANDED_SLICE_GATE.assembledArtifact) === EN_E04_NAGA_EXPANDED_SLICE_GATE.assembledArtifactSha256, 'the Complete B + Form expanded-slice review board drifted');
for (const animation of Object.values(EN_E04_NAGA_EXPANDED_SLICE_GATE.reviewAnimations)) {
  if (animation.sha256) check(await sha256File(animation.artifact) === animation.sha256, animation.artifact + ' drifted from its frozen hash');
  check(animation.width === 640 && animation.height === 776 && animation.frames === 4 && animation.durationMs === 720, 'each combined review GIF must retain the 640x776 four-phase 720 ms contract');
}
check(candidateRecords.length === 88, 'the combined review must contain exactly 88 records');
check(oracleChangedFromCoilguard >= 2000, 'Venom Oracle must remain visibly distinct from Coilguard across the complete suite');
check(rajahChangedFromCoilguard >= 300, 'Temple Rajah must remain visibly distinct from Coilguard across all Idle frames');
check(rajahChangedFromOracle >= 250, 'Temple Rajah must remain visibly distinct from Venom Oracle across all Idle frames');
check(completeOutlinePixels > 0, 'Complete B must add exterior outline pixels across the combined slice');
check(formChangedPixels > 0, 'Form must shade source pixels across the combined slice');

try {
  captureEnemyExpansionFrame(EN_E04_NAGA_EXPANDED_SLICE_REGISTRY, rajahSpec, 'down', 'walk', 0);
  errors.push('Temple Rajah Walk must remain rejected by the Idle-only gate');
} catch (error) {
  check(error instanceof TypeError && error.message.includes('Temple Rajah authorizes only Idle F1-F2'), 'Temple Rajah motion was rejected with an unexpected error');
}
try {
  EN_E04_NAGA_EXPANDED_SLICE_RENDERER.render({ family: { id: 'naga' }, variant: { id: 'coilguard' } });
  errors.push('the expanded renderer must reject Coilguard');
} catch (error) {
  check(error instanceof TypeError && error.message.includes('implements only Venom Oracle and Temple Rajah'), 'the expanded renderer rejected Coilguard with an unexpected error');
}

if (errors.length) {
  console.error('EN-E04 combined Venom-motion and Rajah-Idle validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E04 combined Venom-motion and Rajah-Idle validation passed.');
console.log('- Approved Venom Oracle Idle frames preserved: ' + exactIdleFrames + ' / 8');
console.log('- Venom Oracle suite frames: ' + venomFrames.size + ' / 80');
console.log('- Temple Rajah Idle frames: ' + rajahFrames.size + ' / 8');
console.log('- Connected hard-alpha silhouettes: ' + connectedFrames + ' / 88');
console.log('- Continuous no-feet lower-body rows: ' + continuousLowerRows + ' / 704');
console.log('- Exact side mirrors: ' + sideMirrors + ' / 22');
console.log('- Venom Cast-to-Attack aliases: ' + castAliases + ' / 16');
console.log('- Venom Death-to-Hurt aliases: ' + deathAliases + ' / 16');
console.log('- Opaque pixel range: ' + minOpaquePixels + ' to ' + maxOpaquePixels);
console.log('- Oracle violet veil pixels across colored suite frames: ' + oracleVeilPixels);
console.log('- Oracle venom-jewel pixels across colored suite frames: ' + oracleVenomPixels);
console.log('- Oracle gold identity pixels across colored suite frames: ' + oracleGoldPixels);
console.log('- Temple Rajah crimson pixels: ' + rajahCrimsonPixels);
console.log('- Temple Rajah gold pixels: ' + rajahGoldPixels);
console.log('- Temple Rajah ivory pixels: ' + rajahIvoryPixels);
console.log('- Venom changed pixels vs Coilguard suite: ' + oracleChangedFromCoilguard);
console.log('- Rajah changed pixels vs Coilguard Idle: ' + rajahChangedFromCoilguard);
console.log('- Rajah changed pixels vs Venom Idle: ' + rajahChangedFromOracle);
console.log('- Complete B added pixels: ' + completeOutlinePixels);
console.log('- Form-shaded source pixels: ' + formChangedPixels);
console.log('- Public EN-E04 families: ' + EN_E04_NAGA_EXPANDED_SLICE_REGISTRY.publicFamilies.length);
console.log('- Candidate frame digest: ' + candidateDigest);
