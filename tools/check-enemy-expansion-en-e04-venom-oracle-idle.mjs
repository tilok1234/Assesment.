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
import { EN_E04_NAGA_MOTION_GATE } from '../engine/enemy-expansion-en-e04-naga-motion.js';
import {
  EN_E04_VENOM_ORACLE_CONTRACT,
  EN_E04_VENOM_ORACLE_IDLE_DATA,
  EN_E04_VENOM_ORACLE_IDLE_FAMILY,
  EN_E04_VENOM_ORACLE_IDLE_GATE,
  EN_E04_VENOM_ORACLE_IDLE_REGISTRY,
  EN_E04_VENOM_ORACLE_IDLE_RENDERER,
} from '../engine/enemy-expansion-en-e04-naga-specialist-idle.js';
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

function changedPixels(first, second) {
  let changed = 0;
  for (let index = 0; index < first.length; index++) if (first[index] !== second[index]) changed++;
  return changed;
}

function addedOpaquePixels(candidate, baseline) {
  let added = 0;
  for (let index = 0; index < candidate.length; index++) {
    if (candidate[index] !== null && baseline[index] === null) added++;
  }
  return added;
}

function lowerRegion(pixels, firstRow = 17) {
  return JSON.stringify(pixels.slice(firstRow * engine.SIZE));
}

function frameRecord(captured, direction, frame) {
  return {
    family: 'naga',
    variant: 'venom-oracle',
    direction,
    animation: 'idle',
    frame,
    digest: captured.digest,
    alphaDigest: captured.alphaDigest,
    opaquePixels: captured.opaquePixels,
    bounds: captured.bounds,
  };
}

check(EN_E04_NAGA_IDLE_GATE.status === 'approved', 'the approved Naga Coilguard anatomy gate must remain frozen');
check(EN_E04_NAGA_MOTION_GATE.status === 'approved', 'the preceding Coilguard complete-motion gate must remain approved');
check(EN_E04_NAGA_MOTION_GATE.approvedOn === '2026-08-08', 'the preceding Coilguard motion approval date must remain frozen');
check(EN_E04_VENOM_ORACLE_IDLE_GATE.status === 'approved', 'the Venom Oracle gate must retain explicit visual approval');
check(EN_E04_VENOM_ORACLE_IDLE_GATE.authorizedOn === '2026-08-08', 'the Venom Oracle authorization date must remain frozen');
check(EN_E04_VENOM_ORACLE_IDLE_GATE.authorizationEvidence.includes('designer said: lets do next') && EN_E04_VENOM_ORACLE_IDLE_GATE.authorizationEvidence.includes('Venom Oracle specialist Idle F1-F2 across four directions'), 'the gate must retain the exact continuation evidence and bounded specialist-Idle scope');
check(EN_E04_VENOM_ORACLE_IDLE_GATE.approvedOn === '2026-08-08', 'the Venom Oracle approval date must remain frozen');
check(EN_E04_VENOM_ORACLE_IDLE_GATE.approvalEvidence.includes('both exact labeled all-four-direction raw/no-outline and Complete B + Form') && EN_E04_VENOM_ORACLE_IDLE_GATE.approvalEvidence.includes('said: ye approved'), 'the Venom Oracle gate must retain the exact paired visual approval evidence');
check(EN_E04_VENOM_ORACLE_IDLE_GATE.precedingApproval.gateId === EN_E04_NAGA_MOTION_GATE.id, 'the Venom Oracle gate must identify the approved Coilguard motion predecessor');
check(EN_E04_VENOM_ORACLE_IDLE_GATE.precedingApproval.artifactSha256 === EN_E04_NAGA_MOTION_GATE.artifactSha256, 'the preceding raw Coilguard motion board hash must remain frozen');
check(EN_E04_VENOM_ORACLE_IDLE_GATE.precedingApproval.assembledArtifactSha256 === EN_E04_NAGA_MOTION_GATE.assembledArtifactSha256, 'the preceding Complete B + Form Coilguard motion board hash must remain frozen');
check(EN_E04_VENOM_ORACLE_IDLE_GATE.precedingApproval.rawAnimationSha256 === EN_E04_NAGA_MOTION_GATE.reviewAnimations.raw.sha256, 'the preceding raw Coilguard motion GIF hash must remain frozen');
check(EN_E04_VENOM_ORACLE_IDLE_GATE.precedingApproval.completeBFormAnimationSha256 === EN_E04_NAGA_MOTION_GATE.reviewAnimations.completeBForm.sha256, 'the preceding Complete B + Form Coilguard motion GIF hash must remain frozen');
check(EN_E04_VENOM_ORACLE_IDLE_GATE.precedingApproval.candidateFrameDigest === EN_E04_NAGA_MOTION_GATE.candidateFrameDigest, 'the preceding Coilguard motion frame digest must remain frozen');
check(EN_E04_VENOM_ORACLE_IDLE_GATE.precedingApproval.publishedCheckpoint === 'f47e1691208236f5d245a1f3b9b15355ad479790' && EN_E04_VENOM_ORACLE_IDLE_GATE.precedingApproval.publishedHandoff === 'eddc243e7711f357cb62e40920c83cf066dfc790', 'the gate must retain the exact preceding publication checkpoints');
check(EN_E04_VENOM_ORACLE_IDLE_GATE.approvedAnatomyBaseline.gateId === EN_E04_NAGA_IDLE_GATE.id, 'the gate must identify the approved Naga anatomy baseline');
check(EN_E04_VENOM_ORACLE_IDLE_GATE.approvedAnatomyBaseline.candidateFrameDigest === EN_E04_NAGA_IDLE_GATE.candidateFrameDigest, 'the approved Naga anatomy digest must remain frozen');
check(EN_E04_VENOM_ORACLE_IDLE_GATE.scope.includes('Venom Oracle specialist Naga Idle F1-F2 only') && EN_E04_VENOM_ORACLE_IDLE_GATE.scope.includes('Down, Left, Right, and Up'), 'the gate must remain bounded to specialist Idle across four directions');
check(EN_E04_VENOM_ORACLE_IDLE_GATE.identityContract.includes('Ritual violet veil and mantle') && EN_E04_VENOM_ORACLE_IDLE_GATE.identityContract.includes('remain external'), 'the gate must retain the ritual identity and external-effect boundary');
check(EN_E04_VENOM_ORACLE_IDLE_GATE.animationContract.includes('slow 480 ms planted oracle-breathing cycle') && EN_E04_VENOM_ORACLE_IDLE_GATE.animationContract.includes('No direction resolves into ordinary legs or paired feet'), 'the gate must retain the planted two-frame no-fake-feet motion contract');
check(EN_E04_VENOM_ORACLE_IDLE_GATE.exclusions.includes('approved Coilguard pixel changes') && EN_E04_VENOM_ORACLE_IDLE_GATE.exclusions.includes('Temple Rajah implementation') && EN_E04_VENOM_ORACLE_IDLE_GATE.exclusions.includes('Merfolk') && EN_E04_VENOM_ORACLE_IDLE_GATE.exclusions.includes('Birdfolk') && EN_E04_VENOM_ORACLE_IDLE_GATE.exclusions.includes('Venom Oracle Walk') && EN_E04_VENOM_ORACLE_IDLE_GATE.exclusions.includes('registration') && EN_E04_VENOM_ORACLE_IDLE_GATE.exclusions.includes('release'), 'the gate must exclude common changes, motion, later roles/families, integration, and release');
check(EN_E04_VENOM_ORACLE_IDLE_GATE.nextGate.includes('Visual approval is complete') && EN_E04_VENOM_ORACLE_IDLE_GATE.nextGate.includes('no motion, Temple Rajah work, other family, registration, integration, effect, release, or broader EN-E04 work'), 'the approved gate must retain the bounded publication and post-approval stop boundary');
check(Object.isFrozen(EN_E04_VENOM_ORACLE_IDLE_GATE) && Object.isFrozen(EN_E04_VENOM_ORACLE_IDLE_GATE.precedingApproval) && Object.isFrozen(EN_E04_VENOM_ORACLE_IDLE_GATE.exclusions), 'the Venom Oracle gate must be deeply immutable');

check(EN_E04_VENOM_ORACLE_CONTRACT.family === 'naga' && EN_E04_VENOM_ORACLE_CONTRACT.variant === 'venom-oracle', 'the specialist contract must remain attached to Naga/Venom Oracle');
check(EN_E04_VENOM_ORACLE_CONTRACT.role === 'specialist' && EN_E04_VENOM_ORACLE_CONTRACT.state === 'implemented-idle-candidate', 'Venom Oracle must remain a specialist Idle candidate only');
check(EN_E04_VENOM_ORACLE_CONTRACT.chassis === 'upright-serpentine-humanoid', 'Venom Oracle must retain the approved serpentine chassis');
check(Object.isFrozen(EN_E04_VENOM_ORACLE_CONTRACT), 'the Venom Oracle contract must be immutable');

check(EN_E04_VENOM_ORACLE_IDLE_DATA.actor.weapon === 'none' && EN_E04_VENOM_ORACLE_IDLE_DATA.actor.shield === 'none', 'the specialist seed must not smuggle in public weapon or shield geometry');
check(EN_E04_VENOM_ORACLE_IDLE_DATA.effectBoundary === 'external-venom-orbs-miasma-ritual-sigils-prophecy-motes-and-coil-impact' && EN_E04_VENOM_ORACLE_IDLE_DATA.bakedEffects.length === 0, 'all venom, miasma, ritual, prophecy, and impact effects must remain external');
check(EN_E04_VENOM_ORACLE_IDLE_REGISTRY.families.length === 1, 'the Venom Oracle registry must contain exactly one family');
check(EN_E04_VENOM_ORACLE_IDLE_REGISTRY.publicFamilies.length === 0 && EN_E04_VENOM_ORACLE_IDLE_REGISTRY.approvedFamilies.length === 0, 'the Venom Oracle candidate must remain internal and non-public');
check(EN_E04_VENOM_ORACLE_IDLE_FAMILY.variants.length === 1 && EN_E04_VENOM_ORACLE_IDLE_FAMILY.variants[0].id === 'venom-oracle', 'the candidate registry must implement only Venom Oracle');
check(EN_E04_VENOM_ORACLE_IDLE_REGISTRY.renderers[0].chassis === 'serpentine-humanoid-v1', 'the candidate must retain the serpentine humanoid chassis');
check(engine.EN_E04_VENOM_ORACLE_IDLE_REGISTRY === undefined && engine.EN_E04_VENOM_ORACLE_IDLE_GATE === undefined, 'the Venom Oracle candidate must not leak through the public engine facade');
check(engine.PUBLIC_ENEMIES.length === 67 && engine.ENEMIES.length === 57, 'the Venom Oracle candidate must not change public or legacy Enemy counts');
check(!engine.PUBLIC_ENEMIES.some((family) => family.id === 'naga'), 'Naga must remain absent from public consumers');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!facadeSource.includes('enemy-expansion-en-e04-naga-specialist-idle') && !facadeSource.includes('EN_E04_VENOM_ORACLE'), 'the public facade must not import or expose Venom Oracle symbols');

if (EN_E04_VENOM_ORACLE_IDLE_GATE.artifactSha256) check(await sha256File(EN_E04_VENOM_ORACLE_IDLE_GATE.artifact) === EN_E04_VENOM_ORACLE_IDLE_GATE.artifactSha256, 'the raw Venom Oracle review board must match its frozen candidate hash');
if (EN_E04_VENOM_ORACLE_IDLE_GATE.assembledArtifactSha256) check(await sha256File(EN_E04_VENOM_ORACLE_IDLE_GATE.assembledArtifact) === EN_E04_VENOM_ORACLE_IDLE_GATE.assembledArtifactSha256, 'the Complete B + Form Venom Oracle review board must match its frozen candidate hash');
for (const animation of Object.values(EN_E04_VENOM_ORACLE_IDLE_GATE.reviewAnimations)) {
  if (animation.sha256) check(await sha256File(animation.artifact) === animation.sha256, animation.artifact + ' must match its frozen candidate hash');
  check(animation.width === 192 && animation.height === 224 && animation.frames === 2 && animation.durationMs === 480, 'each Venom Oracle GIF must retain the 192x224 two-frame 480 ms contract');
}

const candidateRecords = [];
const candidateFrames = new Map();
const veilColors = new Set(EN_E04_VENOM_ORACLE_IDLE_DATA.oracle.veil);
const venomColors = new Set(EN_E04_VENOM_ORACLE_IDLE_DATA.oracle.venom);
const goldColors = new Set(EN_E04_VENOM_ORACLE_IDLE_DATA.oracle.gold);
const hoodColors = new Set(EN_E04_NAGA_IDLE_DATA.naga.hood);
const scaleColors = new Set(EN_E04_NAGA_IDLE_DATA.naga.scale);
let veilPixels = 0;
let venomPixels = 0;
let goldPixels = 0;
let hoodPixels = 0;
let scalePixels = 0;
let specialistChangedPixels = 0;
let specialistAddedPixels = 0;
let changedAlpha = 0;
let completeOutlinePixels = 0;
let formChangedPixels = 0;
let minimumOpaque = Number.POSITIVE_INFINITY;
let maximumOpaque = 0;

for (const direction of engine.DIRS) for (let frame = 0; frame < 2; frame++) {
  const captured = captureEnemyExpansionFrame(
    EN_E04_VENOM_ORACLE_IDLE_REGISTRY,
    { kind: 'enemy', family: 'naga', variant: 'venom-oracle' },
    direction,
    'idle',
    frame,
  );
  const baseline = captureEnemyExpansionFrame(
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
  const label = direction + '/F' + (frame + 1);
  check(captured.outOfBoundsWrites.length === 0, label + ' must not write out of bounds');
  check(captured.alpha.every((value) => value === 0 || value === 255), label + ' must retain hard alpha');
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22, label + ' must retain a one-cell margin');
  check(componentCount(captured.pixels) === 1, label + ' must remain one connected crown-hood-body-tail silhouette');
  for (let row = 15; row <= 22; row++) {
    check(opaqueRunsAtRow(captured.alpha, row) === 1, label + ' row ' + row + ' must contain one continuous lower-body run, never paired legs or feet');
  }
  const coilWidth = opaqueAtRow(captured.alpha, 21);
  const tipWidth = opaqueAtRow(captured.alpha, 22);
  check(coilWidth >= 12, label + ' must retain a broad readable ground coil');
  check(tipWidth >= 9 && tipWidth < coilWidth, label + ' must taper one continuous tail tip inside the broad coil');
  check(captured.opaquePixels >= 180 && captured.opaquePixels <= 225, label + ' must retain bounded specialist Naga visual weight');
  check(captured.renderResult.venomOracleIdleGate === EN_E04_VENOM_ORACLE_IDLE_GATE.id, label + ' must report the Venom Oracle gate');
  check(captured.renderResult.approvedPrecedingGate === EN_E04_NAGA_MOTION_GATE.id, label + ' must report the approved Coilguard motion predecessor');
  check(captured.renderResult.approvedNagaAnatomyGate === EN_E04_NAGA_IDLE_GATE.id, label + ' must report the approved Naga anatomy baseline');
  check(captured.renderResult.role === 'specialist' && captured.renderResult.anatomy === 'upright-serpentine-humanoid', label + ' must report specialist serpentine anatomy');
  check(captured.renderResult.lowerBody === 'continuous-direction-aware-serpent-coil', label + ' must report the continuous-coil lower body');
  check(captured.renderResult.effectBoundary === EN_E04_VENOM_ORACLE_IDLE_DATA.effectBoundary, label + ' must report the external effect boundary');
  const frameVeilPixels = captured.pixels.filter((color) => veilColors.has(color)).length;
  const frameVenomPixels = captured.pixels.filter((color) => venomColors.has(color)).length;
  const frameGoldPixels = captured.pixels.filter((color) => goldColors.has(color)).length;
  const frameHoodPixels = captured.pixels.filter((color) => hoodColors.has(color)).length;
  const frameScalePixels = captured.pixels.filter((color) => scaleColors.has(color)).length;
  check(frameVeilPixels >= 25, label + ' must retain a readable violet ritual veil and mantle');
  check(frameVenomPixels >= 4, label + ' must retain the luminous venom jewel, eye, and sigil marks');
  check(frameGoldPixels >= 5, label + ' must retain the gold crown and oracle sigil');
  check(frameHoodPixels >= (direction === 'left' || direction === 'right' ? 10 : 20), label + ' must retain the approved broad cobra hood beneath the specialist crown');
  check(frameScalePixels >= 30, label + ' must retain readable scaled head and tail masses');
  veilPixels += frameVeilPixels;
  venomPixels += frameVenomPixels;
  goldPixels += frameGoldPixels;
  hoodPixels += frameHoodPixels;
  scalePixels += frameScalePixels;
  const changed = changedPixels(captured.pixels, baseline.pixels);
  const added = addedOpaquePixels(captured.pixels, baseline.pixels);
  check(changed >= 35, label + ' must be materially distinct from Coilguard rather than a token recolor');
  check(added >= 5, label + ' must add a readable connected ritual-crown silhouette above Coilguard');
  check(lowerRegion(captured.pixels) === lowerRegion(baseline.pixels), label + ' rows 17-23 must preserve the approved Coilguard tail and ground coil byte-for-byte');
  specialistChangedPixels += changed;
  specialistAddedPixels += added;
  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E04_VENOM_ORACLE_IDLE_DATA);
  completeOutlinePixels += presentation.complete.filter((color, index) => color !== null && captured.pixels[index] === null).length;
  formChangedPixels += presentation.form.filter((color, index) => captured.pixels[index] !== null && color !== captured.pixels[index]).length;
}

for (const direction of engine.DIRS) {
  const first = candidateFrames.get(direction + '/0');
  const second = candidateFrames.get(direction + '/1');
  check(first.digest !== second.digest, direction + ' Idle F1 and F2 must remain distinct');
  const changed = changedPixels(first.alpha, second.alpha);
  check(changed >= 18, direction + ' Idle F2 must visibly settle the crown, hood, mantle, and coil');
  changedAlpha += changed;
}
for (let frame = 0; frame < 2; frame++) {
  check(JSON.stringify(candidateFrames.get('left/' + frame).pixels) === JSON.stringify(mirrorPixels(candidateFrames.get('right/' + frame).pixels, engine.SIZE)), 'left/right F' + (frame + 1) + ' must remain exact mirrors');
  check(candidateFrames.get('down/' + frame).digest !== candidateFrames.get('up/' + frame).digest, 'Down/Up F' + (frame + 1) + ' must remain distinct');
}

const candidateDigest = createHash('sha256').update(JSON.stringify(candidateRecords)).digest('hex');
if (EN_E04_VENOM_ORACLE_IDLE_GATE.candidateFrameDigest) check(candidateDigest === EN_E04_VENOM_ORACLE_IDLE_GATE.candidateFrameDigest, 'the eight Venom Oracle Idle frames drifted from the frozen candidate');
check(completeOutlinePixels > 0, 'Complete B must add exterior outline pixels across the Venom Oracle review set');
check(formChangedPixels > 0, 'Form must shade source pixels across the Venom Oracle review set');

rejects(() => engine.renderEnemyExpansionFrame(EN_E04_VENOM_ORACLE_IDLE_REGISTRY, { kind: 'enemy', family: 'naga', variant: 'venom-oracle' }, 'down', 'walk', 0, {}), 'authorizes only two Idle frames', 'Venom Oracle Walk rendering');
rejects(() => engine.renderEnemyExpansionFrame(EN_E04_VENOM_ORACLE_IDLE_REGISTRY, { kind: 'enemy', family: 'naga', variant: 'venom-oracle' }, 'down', 'idle', 2, {}), 'Expansion frame 2 is invalid for idle', 'Venom Oracle Idle frame 3 rendering');
rejects(() => engine.renderEnemyExpansionFrame(EN_E04_VENOM_ORACLE_IDLE_REGISTRY, { kind: 'enemy', family: 'naga', variant: 'coilguard' }, 'down', 'idle', 0, {}), 'is not implemented', 'Coilguard rendering from the specialist registry');
rejects(() => engine.renderEnemyExpansionFrame(EN_E04_VENOM_ORACLE_IDLE_REGISTRY, { kind: 'enemy', family: 'naga', variant: 'temple-rajah' }, 'down', 'idle', 0, {}), 'is not implemented', 'Temple Rajah rendering');

try {
  EN_E04_VENOM_ORACLE_IDLE_RENDERER.render({ family: { id: 'merfolk' }, variant: { id: 'venom-oracle' } });
  errors.push('the Venom Oracle renderer must reject a non-Naga family');
} catch (error) {
  check(error instanceof TypeError && error.message.includes('restricted to Naga'), 'the Venom Oracle renderer rejected a non-Naga family with an unexpected error');
}

if (errors.length) {
  console.error('EN-E04 Venom Oracle Idle validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E04 Venom Oracle Idle validation passed.');
console.log('- Venom Oracle Idle frames: ' + candidateRecords.length + ' / 8');
console.log('- Connected hard-alpha crown-hood-body-tail silhouettes: 8 / 8');
console.log('- One continuous lower-body run at rows 15-22: 64 / 64');
console.log('- Approved Coilguard tail rows preserved: 8 / 8');
console.log('- Exact side mirrors: 4 / 4');
console.log('- F1/F2 changed alpha pixels: ' + changedAlpha);
console.log('- Specialist-changed pixels vs Coilguard: ' + specialistChangedPixels);
console.log('- Connected crown additions vs Coilguard: ' + specialistAddedPixels);
console.log('- Violet veil pixels: ' + veilPixels);
console.log('- Venom-jewel pixels: ' + venomPixels);
console.log('- Gold oracle pixels: ' + goldPixels);
console.log('- Preserved cobra-hood pixels: ' + hoodPixels);
console.log('- Preserved scale pixels: ' + scalePixels);
console.log('- Opaque pixel range: ' + minimumOpaque + ' to ' + maximumOpaque);
console.log('- Complete B added pixels: ' + completeOutlinePixels);
console.log('- Form-shaded source pixels: ' + formChangedPixels);
console.log('- Baked venom/miasma/ritual/prophecy/impact pixels: ' + EN_E04_VENOM_ORACLE_IDLE_DATA.bakedEffects.length);
console.log('- Public EN-E04 families: ' + EN_E04_VENOM_ORACLE_IDLE_REGISTRY.publicFamilies.length);
console.log('- Candidate frame digest: ' + candidateDigest);
