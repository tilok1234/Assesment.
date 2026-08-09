import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { EN_E03_WILDWOOD_HORNLORD_MOTION_GATE } from '../engine/enemy-expansion-en-e03-satyr-elite-motion.js';
import {
  EN_E04_NAGA_CONTRACT_CARD,
  EN_E04_NAGA_IDLE_DATA,
  EN_E04_NAGA_IDLE_FAMILY,
  EN_E04_NAGA_IDLE_GATE,
  EN_E04_NAGA_IDLE_REGISTRY,
} from '../engine/enemy-expansion-en-e04-naga-idle.js';
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

async function sha256File(relativePath) {
  return createHash('sha256').update(await readFile(path.resolve(root, relativePath))).digest('hex');
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

function opaqueAtRow(alpha, row) {
  let count = 0;
  for (let x = 0; x < engine.SIZE; x++) if (alpha[(row * engine.SIZE) + x] !== 0) count++;
  return count;
}

function changedAlphaPixels(first, second) {
  let changed = 0;
  for (let index = 0; index < first.length; index++) if (first[index] !== second[index]) changed++;
  return changed;
}

function frameRecord(captured, direction, frame) {
  return {
    family: 'naga',
    variant: 'coilguard',
    direction,
    animation: 'idle',
    frame,
    digest: captured.digest,
    alphaDigest: captured.alphaDigest,
    opaquePixels: captured.opaquePixels,
    bounds: captured.bounds,
  };
}

check(EN_E03_WILDWOOD_HORNLORD_MOTION_GATE.status === 'approved', 'the preceding Wildwood Hornlord complete-motion gate must remain approved');
check(EN_E03_WILDWOOD_HORNLORD_MOTION_GATE.approvedOn === '2026-08-08', 'the preceding Wildwood Hornlord motion approval date must remain frozen');
check(EN_E04_NAGA_IDLE_GATE.status === 'approved', 'the Naga Idle gate must retain explicit visual approval');
check(EN_E04_NAGA_IDLE_GATE.authorizedOn === '2026-08-08', 'the Naga authorization date must remain frozen');
check(EN_E04_NAGA_IDLE_GATE.authorizationEvidence.includes('designer said: Let\'s do next') && EN_E04_NAGA_IDLE_GATE.authorizationEvidence.includes('one common Naga Coilguard Idle F1-F2 pair across four directions'), 'the gate must retain the exact continuation evidence and bounded common-Naga scope');
check(EN_E04_NAGA_IDLE_GATE.approvedOn === '2026-08-08', 'the Naga approval date must remain frozen');
check(EN_E04_NAGA_IDLE_GATE.approvalEvidence.includes('both exact labeled all-four-direction raw/no-outline and Complete B + Form') && EN_E04_NAGA_IDLE_GATE.approvalEvidence.includes('said: Approved'), 'the Naga gate must retain the exact paired visual approval evidence');
check(EN_E04_NAGA_IDLE_GATE.precedingApproval.gateId === EN_E03_WILDWOOD_HORNLORD_MOTION_GATE.id, 'the Naga gate must identify the approved Wildwood motion predecessor');
check(EN_E04_NAGA_IDLE_GATE.precedingApproval.artifactSha256 === EN_E03_WILDWOOD_HORNLORD_MOTION_GATE.artifactSha256, 'the preceding raw Wildwood motion board hash must remain frozen');
check(EN_E04_NAGA_IDLE_GATE.precedingApproval.assembledArtifactSha256 === EN_E03_WILDWOOD_HORNLORD_MOTION_GATE.assembledArtifactSha256, 'the preceding Complete B + Form Wildwood motion board hash must remain frozen');
check(EN_E04_NAGA_IDLE_GATE.precedingApproval.rawAnimationSha256 === EN_E03_WILDWOOD_HORNLORD_MOTION_GATE.reviewAnimations.raw.sha256, 'the preceding raw Wildwood motion GIF hash must remain frozen');
check(EN_E04_NAGA_IDLE_GATE.precedingApproval.completeBFormAnimationSha256 === EN_E03_WILDWOOD_HORNLORD_MOTION_GATE.reviewAnimations.completeBForm.sha256, 'the preceding Complete B + Form Wildwood motion GIF hash must remain frozen');
check(EN_E04_NAGA_IDLE_GATE.precedingApproval.candidateFrameDigest === EN_E03_WILDWOOD_HORNLORD_MOTION_GATE.candidateFrameDigest, 'the preceding Wildwood motion frame digest must remain frozen');
check(EN_E04_NAGA_IDLE_GATE.precedingApproval.publishedCheckpoint === 'd9cb0faa3dff204106598876fe38db5f4ee3237a' && EN_E04_NAGA_IDLE_GATE.precedingApproval.publishedHandoff === '8c4edba3fa9460d1afdd4409239f35c6078a7534', 'the Naga gate must retain the exact preceding publication checkpoints');
check(EN_E04_NAGA_IDLE_GATE.scope.includes('Coilguard common Naga Idle F1-F2 only') && EN_E04_NAGA_IDLE_GATE.scope.includes('Down, Left, Right, and Up'), 'the Naga gate must remain bounded to two Idle frames across four directions');
check(EN_E04_NAGA_IDLE_GATE.identityContract.includes('one continuous direction-aware ground coil') && EN_E04_NAGA_IDLE_GATE.identityContract.includes('effects remain external'), 'the Naga identity and external-effect boundary must remain explicit');
check(EN_E04_NAGA_IDLE_GATE.animationContract.includes('slow 480 ms planted breathing cycle') && EN_E04_NAGA_IDLE_GATE.animationContract.includes('never resolves into ordinary legs or paired feet'), 'the planted two-frame no-fake-feet motion contract must remain explicit');
check(EN_E04_NAGA_IDLE_GATE.exclusions.includes('Venom Oracle implementation') && EN_E04_NAGA_IDLE_GATE.exclusions.includes('Temple Rajah implementation') && EN_E04_NAGA_IDLE_GATE.exclusions.includes('Merfolk') && EN_E04_NAGA_IDLE_GATE.exclusions.includes('Birdfolk') && EN_E04_NAGA_IDLE_GATE.exclusions.includes('Walk') && EN_E04_NAGA_IDLE_GATE.exclusions.includes('registration') && EN_E04_NAGA_IDLE_GATE.exclusions.includes('release'), 'the gate must exclude later roles, families, motion, integration, and release');
check(EN_E04_NAGA_IDLE_GATE.nextGate.includes('Visual approval and bounded publication are complete') && EN_E04_NAGA_IDLE_GATE.nextGate.includes('No later Naga role or motion') && EN_E04_NAGA_IDLE_GATE.nextGate.includes('without a separate explicit continuation'), 'the approved gate must close publication without opening later EN-E04 work');
check(Object.isFrozen(EN_E04_NAGA_IDLE_GATE) && Object.isFrozen(EN_E04_NAGA_IDLE_GATE.precedingApproval) && Object.isFrozen(EN_E04_NAGA_IDLE_GATE.exclusions), 'the Naga gate must be deeply immutable');

check(EN_E04_NAGA_CONTRACT_CARD.id === 'naga' && EN_E04_NAGA_CONTRACT_CARD.sliceId === 'EN-E04', 'the Naga contract card must remain attached to EN-E04');
check(EN_E04_NAGA_CONTRACT_CARD.anatomy === 'upright-serpentine-humanoid', 'the Naga contract card must retain the serpentine humanoid anatomy');
check(EN_E04_NAGA_CONTRACT_CARD.silhouetteContract.includes('No direction may contain ordinary legs, paired feet, or detached foot-like islands'), 'the contract card must explicitly ban fake humanoid feet');
check(JSON.stringify(EN_E04_NAGA_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite']), 'the Naga role order must remain common, specialist, elite');
check(EN_E04_NAGA_CONTRACT_CARD.variants.length === 3, 'the Naga contract card must contain exactly three planned roles');
check(EN_E04_NAGA_CONTRACT_CARD.variants[0].id === 'coilguard' && EN_E04_NAGA_CONTRACT_CARD.variants[0].status === 'implemented-idle-candidate', 'Coilguard must remain the only active common role');
check(EN_E04_NAGA_CONTRACT_CARD.variants[1].id === 'venom-oracle' && EN_E04_NAGA_CONTRACT_CARD.variants[1].status === 'planned', 'Venom Oracle must remain planned only');
check(EN_E04_NAGA_CONTRACT_CARD.variants[2].id === 'temple-rajah' && EN_E04_NAGA_CONTRACT_CARD.variants[2].status === 'planned', 'Temple Rajah must remain planned only');
check(Object.isFrozen(EN_E04_NAGA_CONTRACT_CARD) && Object.isFrozen(EN_E04_NAGA_CONTRACT_CARD.variants), 'the Naga contract card must be deeply immutable');

check(EN_E04_NAGA_IDLE_DATA.actor.weapon === 'none' && EN_E04_NAGA_IDLE_DATA.actor.shield === 'none', 'the anatomy seed must not smuggle in public weapon or shield geometry');
check(EN_E04_NAGA_IDLE_DATA.effectBoundary === 'external-venom-spit-miasma-and-coil-impact' && EN_E04_NAGA_IDLE_DATA.bakedEffects.length === 0, 'venom, miasma, and coil-impact effects must remain external with zero baked effects');
check(EN_E04_NAGA_IDLE_REGISTRY.families.length === 1, 'the Naga candidate registry must contain exactly one family');
check(EN_E04_NAGA_IDLE_REGISTRY.publicFamilies.length === 0, 'the Naga candidate registry must expose zero public families');
check(EN_E04_NAGA_IDLE_FAMILY.variants.length === 1 && EN_E04_NAGA_IDLE_FAMILY.variants[0].id === 'coilguard', 'the candidate registry must implement only Coilguard');
check(EN_E04_NAGA_IDLE_REGISTRY.renderers[0].chassis === 'serpentine-humanoid-v1', 'the candidate must use the explicit serpentine humanoid chassis');
check(engine.EN_E04_NAGA_IDLE_REGISTRY === undefined && engine.EN_E04_NAGA_IDLE_GATE === undefined, 'the Naga candidate must not leak through the public engine facade');
check(engine.PUBLIC_ENEMIES.length === 70 && engine.ENEMIES.length === 57, 'the Naga candidate must retain current public and legacy Enemy counts');
check(engine.PUBLIC_ENEMIES.some((family) => family.id === 'naga'), 'the later approved registry/consumer gates must expose Naga generically');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!facadeSource.includes('enemy-expansion-en-e04-naga-idle') && !facadeSource.includes('EN_E04_NAGA_IDLE'), 'the public facade must not import or expose Naga candidate symbols');

check(await sha256File(EN_E04_NAGA_IDLE_GATE.artifact) === EN_E04_NAGA_IDLE_GATE.artifactSha256, 'the raw Naga review board must match its frozen candidate hash');
check(await sha256File(EN_E04_NAGA_IDLE_GATE.assembledArtifact) === EN_E04_NAGA_IDLE_GATE.assembledArtifactSha256, 'the Complete B + Form Naga review board must match its frozen candidate hash');
check(await sha256File(EN_E04_NAGA_IDLE_GATE.reviewAnimations.raw.artifact) === EN_E04_NAGA_IDLE_GATE.reviewAnimations.raw.sha256, 'the raw labeled Naga GIF must match its frozen candidate hash');
check(await sha256File(EN_E04_NAGA_IDLE_GATE.reviewAnimations.completeBForm.artifact) === EN_E04_NAGA_IDLE_GATE.reviewAnimations.completeBForm.sha256, 'the Complete B + Form labeled Naga GIF must match its frozen candidate hash');
for (const animation of Object.values(EN_E04_NAGA_IDLE_GATE.reviewAnimations)) {
  check(animation.width === 192 && animation.height === 224 && animation.frames === 2 && animation.durationMs === 480, 'each Naga GIF must retain the 192x224 two-frame 480 ms contract');
}

const candidateRecords = [];
const candidateFrames = new Map();
const hoodColors = new Set(EN_E04_NAGA_IDLE_DATA.naga.hood);
const scaleColors = new Set(EN_E04_NAGA_IDLE_DATA.naga.scale);
const bellyColors = new Set(EN_E04_NAGA_IDLE_DATA.naga.belly);
const eyeColors = new Set(EN_E04_NAGA_IDLE_DATA.naga.eye);
const bronzeColors = new Set(EN_E04_NAGA_IDLE_DATA.naga.bronze);
let hoodPixels = 0;
let scalePixels = 0;
let bellyPixels = 0;
let bronzePixels = 0;
let changedAlpha = 0;
let completeOutlinePixels = 0;
let formChangedPixels = 0;
let minimumOpaque = Number.POSITIVE_INFINITY;
let maximumOpaque = 0;
for (const direction of engine.DIRS) for (let frame = 0; frame < 2; frame++) {
  const captured = captureEnemyExpansionFrame(
    EN_E04_NAGA_IDLE_REGISTRY,
    { kind: 'enemy', family: 'naga', variant: 'coilguard' },
    direction,
    'idle',
    frame,
  );
  candidateRecords.push(frameRecord(captured, direction, frame));
  candidateFrames.set(direction + '/' + frame, captured);
  minimumOpaque = Math.min(minimumOpaque, captured.opaquePixels);
  maximumOpaque = Math.max(maximumOpaque, captured.opaquePixels);
  check(captured.outOfBoundsWrites.length === 0, direction + '/F' + (frame + 1) + ' must not write out of bounds');
  check(captured.alpha.every((value) => value === 0 || value === 255), direction + '/F' + (frame + 1) + ' must retain hard alpha');
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22, direction + '/F' + (frame + 1) + ' must retain a one-cell margin');
  check(componentCount(captured.pixels) === 1, direction + '/F' + (frame + 1) + ' must remain one connected hood-body-tail silhouette');
  for (let row = 15; row <= 22; row++) {
    check(opaqueRunsAtRow(captured.alpha, row) === 1, direction + '/F' + (frame + 1) + ' row ' + row + ' must contain one continuous lower-body run, never paired legs or feet');
  }
  const coilWidth = opaqueAtRow(captured.alpha, 21);
  const tipWidth = opaqueAtRow(captured.alpha, 22);
  check(coilWidth >= 12, direction + '/F' + (frame + 1) + ' must retain a broad readable ground coil');
  check(tipWidth >= 9 && tipWidth < coilWidth, direction + '/F' + (frame + 1) + ' must taper one continuous tail tip inside the broad coil');
  check(captured.renderResult.nagaIdleGate === EN_E04_NAGA_IDLE_GATE.id, direction + '/F' + (frame + 1) + ' must report the Naga gate');
  check(captured.renderResult.approvedPrecedingGate === EN_E03_WILDWOOD_HORNLORD_MOTION_GATE.id, direction + '/F' + (frame + 1) + ' must report the approved predecessor');
  check(captured.renderResult.anatomy === 'upright-serpentine-humanoid' && captured.renderResult.lowerBody === 'continuous-direction-aware-serpent-coil', direction + '/F' + (frame + 1) + ' must report the serpentine anatomy contract');
  check(captured.renderResult.effectBoundary === 'external-venom-spit-miasma-and-coil-impact', direction + '/F' + (frame + 1) + ' must report the external effect boundary');
  const frameHoodPixels = captured.pixels.filter((color) => hoodColors.has(color)).length;
  const frameScalePixels = captured.pixels.filter((color) => scaleColors.has(color)).length;
  const frameBellyPixels = captured.pixels.filter((color) => bellyColors.has(color)).length;
  const frameEyePixels = captured.pixels.filter((color) => eyeColors.has(color)).length;
  const frameBronzePixels = captured.pixels.filter((color) => bronzeColors.has(color)).length;
  hoodPixels += frameHoodPixels;
  scalePixels += frameScalePixels;
  bellyPixels += frameBellyPixels;
  bronzePixels += frameBronzePixels;
  const minimumHoodPixels = direction === 'left' || direction === 'right' ? 12 : 25;
  check(frameHoodPixels >= minimumHoodPixels, direction + '/F' + (frame + 1) + ' must retain a direction-appropriate broad cobra hood');
  check(frameScalePixels >= 30, direction + '/F' + (frame + 1) + ' must retain readable scaled head and tail masses');
  check(frameBronzePixels >= 3, direction + '/F' + (frame + 1) + ' must retain the common bronze torque and belt marks');
  if (direction === 'down') check(frameBellyPixels >= 12, direction + '/F' + (frame + 1) + ' must retain broad front belly plates rather than a leg-like stripe');
  if (direction === 'left' || direction === 'right') check(frameBellyPixels >= 3, direction + '/F' + (frame + 1) + ' must retain a side belly edge along the tail curve');
  if (direction !== 'up') check(frameEyePixels >= 2, direction + '/F' + (frame + 1) + ' must retain readable amber eye marks');
  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E04_NAGA_IDLE_DATA);
  completeOutlinePixels += presentation.complete.filter((color, index) => color !== null && captured.pixels[index] === null).length;
  formChangedPixels += presentation.form.filter((color, index) => captured.pixels[index] !== null && color !== captured.pixels[index]).length;
}

for (const direction of engine.DIRS) {
  const first = candidateFrames.get(direction + '/0');
  const second = candidateFrames.get(direction + '/1');
  check(first.digest !== second.digest, direction + ' Idle F1 and F2 must remain distinct');
  const changed = changedAlphaPixels(first.alpha, second.alpha);
  check(changed >= 18, direction + ' Idle F2 must visibly settle the hood and compress the coil');
  changedAlpha += changed;
}
for (let frame = 0; frame < 2; frame++) {
  check(JSON.stringify(candidateFrames.get('left/' + frame).pixels) === JSON.stringify(mirrorPixels(candidateFrames.get('right/' + frame).pixels, engine.SIZE)), 'left/right F' + (frame + 1) + ' must remain exact mirrors');
  check(candidateFrames.get('down/' + frame).digest !== candidateFrames.get('up/' + frame).digest, 'Down/Up F' + (frame + 1) + ' must remain distinct');
}

const candidateDigest = createHash('sha256').update(JSON.stringify(candidateRecords)).digest('hex');
check(candidateDigest === EN_E04_NAGA_IDLE_GATE.candidateFrameDigest, 'the eight Naga Coilguard Idle frames drifted from the review candidate');
check(completeOutlinePixels > 0, 'Complete B must add exterior outline pixels across the Naga review set');
check(formChangedPixels > 0, 'Form must shade source pixels across the Naga review set');

rejects(() => engine.renderEnemyExpansionFrame(EN_E04_NAGA_IDLE_REGISTRY, { kind: 'enemy', family: 'naga', variant: 'coilguard' }, 'down', 'walk', 0, {}), 'authorizes only two Idle frames', 'Naga Walk rendering');
rejects(() => engine.renderEnemyExpansionFrame(EN_E04_NAGA_IDLE_REGISTRY, { kind: 'enemy', family: 'naga', variant: 'coilguard' }, 'down', 'idle', 2, {}), 'Expansion frame 2 is invalid for idle', 'Naga Idle frame 3 rendering');
rejects(() => engine.renderEnemyExpansionFrame(EN_E04_NAGA_IDLE_REGISTRY, { kind: 'enemy', family: 'naga', variant: 'venom-oracle' }, 'down', 'idle', 0, {}), 'is not implemented', 'Venom Oracle rendering');
rejects(() => engine.renderEnemyExpansionFrame(EN_E04_NAGA_IDLE_REGISTRY, { kind: 'enemy', family: 'naga', variant: 'temple-rajah' }, 'down', 'idle', 0, {}), 'is not implemented', 'Temple Rajah rendering');
rejects(() => engine.renderEnemyExpansionFrame(EN_E04_NAGA_IDLE_REGISTRY, { kind: 'enemy', family: 'merfolk', variant: 'tide-scout' }, 'down', 'idle', 0, {}), 'is not implemented', 'Merfolk rendering from the Naga registry');

if (errors.length) {
  console.error('EN-E04 Naga Idle validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E04 Naga Idle validation passed.');
console.log('- Coilguard Idle frames: ' + candidateRecords.length + ' / 8');
console.log('- Connected hard-alpha hood-body-tail silhouettes: 8 / 8');
console.log('- One continuous lower-body run at rows 15-22: 64 / 64');
console.log('- Broad single-coil contact rows: 8 / 8');
console.log('- Exact side mirrors: 4 / 4');
console.log('- F1/F2 changed alpha pixels: ' + changedAlpha);
console.log('- Cobra-hood pixels: ' + hoodPixels);
console.log('- Scale pixels: ' + scalePixels);
console.log('- Belly-plate pixels: ' + bellyPixels);
console.log('- Bronze-regalia pixels: ' + bronzePixels);
console.log('- Opaque pixel range: ' + minimumOpaque + ' to ' + maximumOpaque);
console.log('- Complete B added pixels: ' + completeOutlinePixels);
console.log('- Form-shaded source pixels: ' + formChangedPixels);
console.log('- Baked venom/miasma/coil-impact pixels: 0');
console.log('- Public EN-E04 families: 0');
console.log('- Candidate frame digest: ' + candidateDigest);
