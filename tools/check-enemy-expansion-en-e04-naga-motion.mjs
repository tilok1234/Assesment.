import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import {
  EN_E04_NAGA_IDLE_DATA,
  EN_E04_NAGA_IDLE_GATE,
  EN_E04_NAGA_IDLE_REGISTRY,
} from '../engine/enemy-expansion-en-e04-naga-idle.js';
import {
  EN_E04_NAGA_ATTACK_PHASES,
  EN_E04_NAGA_DEATH_SOURCE_FRAMES,
  EN_E04_NAGA_HURT_PHASES,
  EN_E04_NAGA_MOTION_FAMILY,
  EN_E04_NAGA_MOTION_GATE,
  EN_E04_NAGA_MOTION_REGISTRY,
  EN_E04_NAGA_MOTION_RENDERER,
  EN_E04_NAGA_WALK_PHASES,
} from '../engine/enemy-expansion-en-e04-naga-motion.js';
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
    variant: 'coilguard',
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

check(EN_E04_NAGA_IDLE_GATE.status === 'approved', 'the approved Naga Coilguard Idle gate must remain frozen');
check(EN_E04_NAGA_MOTION_GATE.status === 'approved', 'the Naga motion gate must retain explicit visual approval');
check(EN_E04_NAGA_MOTION_GATE.authorizedOn === '2026-08-08', 'the Naga motion gate must retain its authorization date');
check(EN_E04_NAGA_MOTION_GATE.authorizationEvidence.includes('check out codex/en-e04-naga-idle and continue the enemy-expansion lane') && EN_E04_NAGA_MOTION_GATE.authorizationEvidence.includes('current v2 repository') && EN_E04_NAGA_MOTION_GATE.authorizationEvidence.includes('one complete Naga Coilguard motion suite only'), 'the gate must retain the exact continuation, v2-repository, and one-variant boundary');
check(EN_E04_NAGA_MOTION_GATE.approvedOn === '2026-08-08', 'the Naga motion gate must retain its approval date');
check(EN_E04_NAGA_MOTION_GATE.approvalEvidence.includes('both exact labeled all-four-direction raw/no-outline and Complete B + Form') && EN_E04_NAGA_MOTION_GATE.approvalEvidence.includes('said: approved'), 'the gate must retain the exact paired visual approval evidence');
check(EN_E04_NAGA_MOTION_GATE.approvedIdle.gateId === EN_E04_NAGA_IDLE_GATE.id, 'the motion gate must identify the approved Naga Idle baseline');
check(EN_E04_NAGA_MOTION_GATE.approvedIdle.artifactSha256 === EN_E04_NAGA_IDLE_GATE.artifactSha256, 'the motion gate must freeze the approved raw Naga Idle board hash');
check(EN_E04_NAGA_MOTION_GATE.approvedIdle.assembledArtifactSha256 === EN_E04_NAGA_IDLE_GATE.assembledArtifactSha256, 'the motion gate must freeze the approved Complete B + Form Naga Idle board hash');
check(EN_E04_NAGA_MOTION_GATE.approvedIdle.rawAnimationSha256 === EN_E04_NAGA_IDLE_GATE.reviewAnimations.raw.sha256, 'the motion gate must freeze the approved raw Naga Idle GIF hash');
check(EN_E04_NAGA_MOTION_GATE.approvedIdle.completeBFormAnimationSha256 === EN_E04_NAGA_IDLE_GATE.reviewAnimations.completeBForm.sha256, 'the motion gate must freeze the approved Complete B + Form Naga Idle GIF hash');
check(EN_E04_NAGA_MOTION_GATE.approvedIdle.frameDigest === EN_E04_NAGA_IDLE_GATE.candidateFrameDigest, 'the motion gate must freeze the approved eight-frame Naga Idle digest');
check(EN_E04_NAGA_MOTION_GATE.approvedIdle.publishedCheckpoint === '26151e1' && EN_E04_NAGA_MOTION_GATE.approvedIdle.v2WorkflowIntegrationCheckpoint === 'a81d324', 'the gate must retain the approved Idle source and v2 workflow-integration checkpoints');
check(EN_E04_NAGA_MOTION_GATE.scope.includes('Walk W1-W4') && EN_E04_NAGA_MOTION_GATE.scope.includes('Death D1-D4') && EN_E04_NAGA_MOTION_GATE.scope.includes('Idle F1-F2 delegated byte-for-byte'), 'the gate must state the exact complete-motion scope and protected Idle context');
check(EN_E04_NAGA_MOTION_GATE.animationContract.includes('four distinct planted slither phases') && EN_E04_NAGA_MOTION_GATE.animationContract.includes('Cast aliases Coilguard Attack frame-for-frame') && EN_E04_NAGA_MOTION_GATE.animationContract.includes('Death aliases Coilguard Hurt H1,H2,H2,H2'), 'the gate must retain the slither and exact alias contracts');
check(EN_E04_NAGA_MOTION_GATE.exclusions.includes('approved Coilguard Idle pixel changes') && EN_E04_NAGA_MOTION_GATE.exclusions.includes('Venom Oracle implementation') && EN_E04_NAGA_MOTION_GATE.exclusions.includes('Temple Rajah implementation') && EN_E04_NAGA_MOTION_GATE.exclusions.includes('new Cast pixels') && EN_E04_NAGA_MOTION_GATE.exclusions.includes('new Death pixels') && EN_E04_NAGA_MOTION_GATE.exclusions.includes('registration') && EN_E04_NAGA_MOTION_GATE.exclusions.includes('release'), 'the gate must exclude approved-pixel changes, other roles, new alias pixels, integration, and release');
check(EN_E04_NAGA_MOTION_GATE.nextGate.includes('Visual approval and bounded publication are complete') && EN_E04_NAGA_MOTION_GATE.nextGate.includes('No later Naga role or family') && EN_E04_NAGA_MOTION_GATE.nextGate.includes('without a separate explicit continuation'), 'the approved gate must close publication without opening later EN-E04 work');
check(Object.isFrozen(EN_E04_NAGA_MOTION_GATE) && Object.isFrozen(EN_E04_NAGA_MOTION_GATE.approvedIdle) && Object.isFrozen(EN_E04_NAGA_MOTION_GATE.exclusions), 'the Naga motion gate must be deeply immutable');

check(EN_E04_NAGA_WALK_PHASES.length === 4 && new Set(EN_E04_NAGA_WALK_PHASES.map((phase) => phase.name)).size === 4, 'Walk must retain four named slither phases');
check(JSON.stringify(EN_E04_NAGA_ATTACK_PHASES.map((phase) => phase.name)) === JSON.stringify(['coil-brace', 'cobra-rise', 'forward-strike', 'coil-recover']), 'Attack must retain the four authored full-body phases');
check(EN_E04_NAGA_HURT_PHASES[0].flash === true && EN_E04_NAGA_HURT_PHASES[1].flash === false, 'Hurt must retain white recoil then colored recovery');
check(JSON.stringify(EN_E04_NAGA_DEATH_SOURCE_FRAMES) === JSON.stringify([0, 1, 1, 1]), 'Death must retain the H1,H2,H2,H2 source sequence');

check(EN_E04_NAGA_MOTION_REGISTRY.families.length === 1, 'the Naga motion registry must contain exactly one family');
check(EN_E04_NAGA_MOTION_FAMILY.variants.length === 1 && EN_E04_NAGA_MOTION_FAMILY.variants[0].id === 'coilguard', 'the Naga motion registry must contain only Coilguard');
check(EN_E04_NAGA_MOTION_REGISTRY.publicFamilies.length === 0 && EN_E04_NAGA_MOTION_REGISTRY.approvedFamilies.length === 0, 'the Naga motion candidate must remain internal and non-public');
check(EN_E04_NAGA_IDLE_DATA.bakedEffects.length === 0 && EN_E04_NAGA_IDLE_DATA.effectBoundary === 'external-venom-spit-miasma-and-coil-impact', 'all venom, miasma, and coil-impact effects must remain external');
check(engine.EN_E04_NAGA_MOTION_REGISTRY === undefined && engine.EN_E04_NAGA_MOTION_GATE === undefined, 'the Naga motion candidate must not leak through the public engine facade');
check(engine.PUBLIC_ENEMIES.length === 67 && engine.ENEMIES.length === 57, 'the Naga motion candidate must not change public or legacy Enemy counts');
check(!engine.PUBLIC_ENEMIES.some((family) => family.id === 'naga'), 'Naga must remain absent from public consumers');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!facadeSource.includes('enemy-expansion-en-e04-naga-motion') && !facadeSource.includes('EN_E04_NAGA_MOTION'), 'the public facade must not import or expose Naga motion symbols');

const spec = Object.freeze({ kind: 'enemy', family: 'naga', variant: 'coilguard' });
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
const hoodColors = new Set(EN_E04_NAGA_IDLE_DATA.naga.hood);
const scaleColors = new Set(EN_E04_NAGA_IDLE_DATA.naga.scale);
const bellyColors = new Set(EN_E04_NAGA_IDLE_DATA.naga.belly);
const bronzeColors = new Set(EN_E04_NAGA_IDLE_DATA.naga.bronze);
let hoodPixels = 0;
let scalePixels = 0;
let bellyPixels = 0;
let bronzePixels = 0;
let completeOutlinePixels = 0;
let formChangedPixels = 0;
let connectedFrames = 0;
let hardAlphaFrames = 0;
let continuousLowerRows = 0;
let minOpaquePixels = Number.POSITIVE_INFINITY;
let maxOpaquePixels = 0;

for (const animation of animations) for (const direction of engine.DIRS) for (let frame = 0; frame < animation.frames; frame++) {
  const captured = captureEnemyExpansionFrame(
    EN_E04_NAGA_MOTION_REGISTRY,
    spec,
    direction,
    animation.id,
    frame,
  );
  suiteFrames.set([animation.id, direction, frame].join('/'), captured);
  suiteRecords.push(frameRecord(captured, direction, animation.id, frame));
  const label = direction + '/' + animation.id + '/' + (frame + 1);
  check(captured.outOfBoundsWrites.length === 0, label + ' must not write outside the 24x24 cell');
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22, label + ' must retain a one-cell margin');
  const hardAlpha = captured.alpha.every((value) => value === 0 || value === 255);
  check(hardAlpha, label + ' must retain hard alpha');
  if (hardAlpha) hardAlphaFrames++;
  const components = componentCount(captured.pixels);
  check(components === 1, label + ' must retain one connected hood-body-tail silhouette');
  if (components === 1) connectedFrames++;
  for (let row = 15; row <= 22; row++) {
    const continuous = opaqueRunsAtRow(captured.alpha, row) === 1;
    check(continuous, label + ' row ' + row + ' must contain one continuous lower-body run, never paired legs or feet');
    if (continuous) continuousLowerRows++;
  }
  check(opaqueAtRow(captured.alpha, 21) >= 12, label + ' must retain a broad readable planted coil');
  check(captured.opaquePixels >= 170 && captured.opaquePixels <= 260, label + ' must retain bounded common-Naga visual weight');
  minOpaquePixels = Math.min(minOpaquePixels, captured.opaquePixels);
  maxOpaquePixels = Math.max(maxOpaquePixels, captured.opaquePixels);
  check(captured.renderResult.nagaMotionGate === EN_E04_NAGA_MOTION_GATE.id, label + ' must report the Naga motion gate');
  check(captured.renderResult.approvedNagaIdleGate === EN_E04_NAGA_IDLE_GATE.id, label + ' must report the approved Naga Idle gate');
  check(captured.renderResult.anatomy === 'upright-serpentine-humanoid' && captured.renderResult.lowerBody === 'continuous-planted-serpent-coil', label + ' must report the serpentine anatomy and planted-coil contract');
  check(captured.renderResult.effectBoundary === EN_E04_NAGA_IDLE_DATA.effectBoundary, label + ' must report the external effect boundary');
  const isWhiteFlash = (animation.id === 'hurt' && frame === 0) || (animation.id === 'death' && frame === 0);
  if (isWhiteFlash) {
    check(captured.pixels.every((color) => color === null || color === '#ffffff'), label + ' must flash the complete connected Naga silhouette white');
  } else {
    const frameHoodPixels = captured.pixels.filter((color) => hoodColors.has(color)).length;
    const frameScalePixels = captured.pixels.filter((color) => scaleColors.has(color)).length;
    const frameBellyPixels = captured.pixels.filter((color) => bellyColors.has(color)).length;
    const frameBronzePixels = captured.pixels.filter((color) => bronzeColors.has(color)).length;
    check(frameHoodPixels >= (direction === 'left' || direction === 'right' ? 12 : 25), label + ' must retain a direction-appropriate broad cobra hood');
    check(frameScalePixels >= 45, label + ' must retain readable scaled head and continuous tail masses');
    check(frameBronzePixels >= 4, label + ' must retain the common bronze torque and belt marks');
    if (direction === 'down') check(frameBellyPixels >= 12, label + ' must retain broad front belly plates rather than a leg-like stripe');
    if (direction === 'left' || direction === 'right') check(frameBellyPixels >= 4, label + ' must retain a side belly edge along the tail curve');
    hoodPixels += frameHoodPixels;
    scalePixels += frameScalePixels;
    bellyPixels += frameBellyPixels;
    bronzePixels += frameBronzePixels;
  }
  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E04_NAGA_IDLE_DATA);
  completeOutlinePixels += presentation.complete.filter((color, index) => color !== null && captured.pixels[index] === null).length;
  formChangedPixels += presentation.form.filter((color, index) => captured.pixels[index] !== null && color !== captured.pixels[index]).length;
}

for (const direction of engine.DIRS) for (let frame = 0; frame < 2; frame++) {
  const delegated = suiteFrames.get(['idle', direction, frame].join('/'));
  const approved = captureEnemyExpansionFrame(EN_E04_NAGA_IDLE_REGISTRY, spec, direction, 'idle', frame);
  check(pixelsEqual(delegated, approved) && delegated.digest === approved.digest, direction + '/Idle F' + (frame + 1) + ' must delegate the exact approved Naga Coilguard Idle pixels');
}

for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = suiteFrames.get([animation.id, 'left', frame].join('/'));
  const right = suiteFrames.get([animation.id, 'right', frame].join('/'));
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels, engine.SIZE)), animation.id + '/' + (frame + 1) + ' Left must be the exact mirror of Right');
  const down = suiteFrames.get([animation.id, 'down', frame].join('/'));
  const up = suiteFrames.get([animation.id, 'up', frame].join('/'));
  check(down.digest !== up.digest, animation.id + '/' + (frame + 1) + ' Down and Up must remain directionally distinct');
}

for (const direction of engine.DIRS) {
  const walk = [0, 1, 2, 3].map((frame) => suiteFrames.get(['walk', direction, frame].join('/')));
  check(new Set(walk.map((captured) => captured.digest)).size === 4, direction + ' Walk must retain four distinct slither phases');
  check(new Set(walk.map(groundSignature)).size === 4, direction + ' Walk must visibly travel the ground coil through four phases');
  check(new Set(walk.map((captured) => regionSignature(captured, 2, 21, 1, 17))).size >= 2, direction + ' Walk must settle the hood and upper body as well as the coil');

  const attack = [0, 1, 2, 3].map((frame) => suiteFrames.get(['attack', direction, frame].join('/')));
  check(new Set(attack.map((captured) => captured.digest)).size === 4, direction + ' Attack must retain four distinct full-body coil-strike phases');
  check(new Set(attack.map((captured) => regionSignature(captured, 1, 22, 1, 19))).size >= 3, direction + ' Attack must move the hood, torso, and rising tail through at least three phases');
  check(new Set(attack.map(groundSignature)).size >= 3, direction + ' Attack must brace, compress, and release the planted coil');

  const hurt = [0, 1].map((frame) => suiteFrames.get(['hurt', direction, frame].join('/')));
  check(hurt[0].alphaDigest !== hurt[1].alphaDigest, direction + ' Hurt must use two distinct full-body silhouettes');
  check(groundSignature(hurt[0]) === groundSignature(hurt[1]), direction + ' Hurt must retain the same planted coil anchor across H1-H2');

  for (let frame = 0; frame < 4; frame++) {
    const cast = suiteFrames.get(['cast', direction, frame].join('/'));
    check(pixelsEqual(cast, attack[frame]), direction + '/Cast C' + (frame + 1) + ' must alias Coilguard Attack A' + (frame + 1) + ' exactly');
    const death = suiteFrames.get(['death', direction, frame].join('/'));
    const sourceFrame = EN_E04_NAGA_DEATH_SOURCE_FRAMES[frame];
    check(pixelsEqual(death, hurt[sourceFrame]), direction + '/Death D' + (frame + 1) + ' must alias Coilguard Hurt H' + (sourceFrame + 1) + ' exactly');
  }
}

const candidateDigest = digestRecords(suiteRecords);
if (EN_E04_NAGA_MOTION_GATE.candidateFrameDigest) check(candidateDigest === EN_E04_NAGA_MOTION_GATE.candidateFrameDigest, 'the frozen 80-frame Naga Coilguard suite digest drifted');
if (EN_E04_NAGA_MOTION_GATE.artifactSha256) check(await sha256File(EN_E04_NAGA_MOTION_GATE.artifact) === EN_E04_NAGA_MOTION_GATE.artifactSha256, 'the raw grouped Naga review board drifted');
if (EN_E04_NAGA_MOTION_GATE.assembledArtifactSha256) check(await sha256File(EN_E04_NAGA_MOTION_GATE.assembledArtifact) === EN_E04_NAGA_MOTION_GATE.assembledArtifactSha256, 'the Complete B + Form grouped Naga review board drifted');
for (const animation of Object.values(EN_E04_NAGA_MOTION_GATE.reviewAnimations)) {
  if (animation.sha256) check(await sha256File(animation.artifact) === animation.sha256, animation.artifact + ' drifted from its frozen hash');
  check(animation.width === 640 && animation.height === 672 && animation.frames === 4 && animation.durationMs === 720, 'each grouped review GIF must retain the 640x672 four-phase 720 ms contract');
}
check(completeOutlinePixels > 0, 'Complete B must add exterior outline pixels across the Naga motion suite');
check(formChangedPixels > 0, 'Form must shade source pixels across the Naga motion suite');

try {
  EN_E04_NAGA_MOTION_RENDERER.render({ family: { id: 'merfolk' }, variant: { id: 'coilguard' } });
  errors.push('the Naga motion renderer must reject a non-Naga family');
} catch (error) {
  check(error instanceof TypeError && error.message.includes('restricted to Naga'), 'the Naga motion renderer rejected a non-Naga family with an unexpected error');
}

if (errors.length) {
  console.error('EN-E04 Naga Coilguard grouped motion validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E04 Naga Coilguard grouped motion validation passed.');
console.log('- Approved Coilguard Idle frames preserved: 8 / 8');
console.log('- Coilguard suite frames: ' + suiteRecords.length + ' / 80');
console.log('- Connected hard-alpha serpentine silhouettes: ' + connectedFrames + ' / 80');
console.log('- Continuous no-feet lower-body rows: ' + continuousLowerRows + ' / 640');
console.log('- Exact side mirrors: 20 / 20');
console.log('- Cast-to-Attack aliases: 16 / 16');
console.log('- Death-to-Hurt aliases: 16 / 16');
console.log('- Opaque pixel range: ' + minOpaquePixels + ' to ' + maxOpaquePixels);
console.log('- Cobra-hood pixels across colored frames: ' + hoodPixels);
console.log('- Scale pixels across colored frames: ' + scalePixels);
console.log('- Belly-plate pixels across colored frames: ' + bellyPixels);
console.log('- Bronze identity pixels across colored frames: ' + bronzePixels);
console.log('- Complete B added pixels: ' + completeOutlinePixels);
console.log('- Form-shaded source pixels: ' + formChangedPixels);
console.log('- Public EN-E04 families: ' + EN_E04_NAGA_MOTION_REGISTRY.publicFamilies.length);
console.log('- Candidate frame digest: ' + candidateDigest);
