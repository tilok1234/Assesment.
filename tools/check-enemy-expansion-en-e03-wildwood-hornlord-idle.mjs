import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import {
  EN_E03_BRIAR_REVELER_CALIBRATION_DATA,
} from '../engine/enemy-expansion-en-e03-satyr-calibration.js';
import {
  EN_E03_SATYR_IDLE_GATE,
  EN_E03_SATYR_IDLE_REGISTRY,
} from '../engine/enemy-expansion-en-e03-satyr-idle.js';
import { EN_E03_REED_CHARMER_MOTION_GATE } from '../engine/enemy-expansion-en-e03-satyr-specialist-motion.js';
import {
  EN_E03_WILDWOOD_HORNLORD_IDLE_DATA,
  EN_E03_WILDWOOD_HORNLORD_IDLE_FAMILY,
  EN_E03_WILDWOOD_HORNLORD_IDLE_GATE,
  EN_E03_WILDWOOD_HORNLORD_IDLE_REGISTRY,
} from '../engine/enemy-expansion-en-e03-satyr-elite-idle.js';
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

function changedAlphaPixels(first, second) {
  let changed = 0;
  for (let index = 0; index < first.length; index++) if (first[index] !== second[index]) changed++;
  return changed;
}

function frameRecord(captured, family, variant, direction, frame) {
  return {
    family,
    variant,
    direction,
    animation: 'idle',
    frame,
    digest: captured.digest,
    alphaDigest: captured.alphaDigest,
    opaquePixels: captured.opaquePixels,
    bounds: captured.bounds,
  };
}

function captureRecords(registry, family, variant) {
  const records = [];
  for (const direction of engine.DIRS) for (let frame = 0; frame < 2; frame++) {
    records.push(frameRecord(captureEnemyExpansionFrame(
      registry,
      { kind: 'enemy', family, variant },
      direction,
      'idle',
      frame,
    ), family, variant, direction, frame));
  }
  return records;
}

check(EN_E03_REED_CHARMER_MOTION_GATE.status === 'approved', 'the preceding Reed Charmer complete-motion gate must remain approved');
check(EN_E03_REED_CHARMER_MOTION_GATE.approvedOn === '2026-08-08', 'the preceding Reed Charmer motion approval date must remain frozen');
check(EN_E03_SATYR_IDLE_GATE.status === 'approved', 'the Briar Reveler Satyr Idle baseline must remain approved');
check(EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.status === 'approved', 'the Wildwood Hornlord Idle gate must retain explicit paired visual approval');
check(EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.authorizedOn === '2026-08-08', 'the Wildwood Hornlord authorization date must remain frozen');
check(EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.authorizationEvidence.includes('Awesome let\'s do next') && EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.authorizationEvidence.includes('Wildwood Hornlord elite Idle F1-F2 across four directions'), 'the gate must retain the exact continuation evidence and bounded Satyr role-order scope');
check(EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.approvedOn === '2026-08-08', 'the Wildwood Hornlord approval date must remain frozen');
check(EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.approvalEvidence.includes('both exact labeled all-four-direction raw and Complete B + Form') && EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.approvalEvidence.includes('Approved lets do next'), 'the Wildwood gate must retain the exact paired approval evidence');
check(EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.precedingApproval.gateId === EN_E03_REED_CHARMER_MOTION_GATE.id, 'the Wildwood gate must identify the approved Reed motion predecessor');
check(EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.precedingApproval.artifactSha256 === EN_E03_REED_CHARMER_MOTION_GATE.artifactSha256, 'the preceding raw Reed motion board hash must remain frozen');
check(EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.precedingApproval.assembledArtifactSha256 === EN_E03_REED_CHARMER_MOTION_GATE.assembledArtifactSha256, 'the preceding Complete B + Form Reed motion board hash must remain frozen');
check(EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.precedingApproval.rawAnimationSha256 === EN_E03_REED_CHARMER_MOTION_GATE.reviewAnimations.raw.sha256, 'the preceding raw Reed motion GIF hash must remain frozen');
check(EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.precedingApproval.completeBFormAnimationSha256 === EN_E03_REED_CHARMER_MOTION_GATE.reviewAnimations.completeBForm.sha256, 'the preceding Complete B + Form Reed motion GIF hash must remain frozen');
check(EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.precedingApproval.candidateFrameDigest === EN_E03_REED_CHARMER_MOTION_GATE.candidateFrameDigest, 'the preceding Reed motion frame digest must remain frozen');
check(EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.precedingApproval.publishedCheckpoint === 'f77c8a88b25cb59f5bdbe82708a620e5cae3fe9d' && EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.precedingApproval.publishedHandoff === '629bccd1fefe5e98731dcfbf87049e7517dbca2e', 'the Wildwood gate must retain the exact Reed publication checkpoints');
check(EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.approvedSatyrBaseline.gateId === EN_E03_SATYR_IDLE_GATE.id, 'the Wildwood gate must identify the approved Briar Reveler baseline');
check(EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.approvedSatyrBaseline.artifactSha256 === EN_E03_SATYR_IDLE_GATE.artifactSha256, 'the approved raw Briar Reveler board hash must remain frozen');
check(EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.approvedSatyrBaseline.assembledArtifactSha256 === EN_E03_SATYR_IDLE_GATE.assembledArtifactSha256, 'the approved Complete B + Form Briar Reveler board hash must remain frozen');
check(EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.approvedSatyrBaseline.candidateFrameDigest === EN_E03_SATYR_IDLE_GATE.candidateFrameDigest, 'the approved Briar Reveler frame digest must remain frozen');
check(EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.scope.includes('Idle F1-F2 only') && EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.scope.includes('Down, Left, Right, and Up'), 'the Wildwood gate must remain bounded to two Idle frames across four directions');
check(EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.identityContract.includes('oversized branching antler crown') && EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.identityContract.includes('not baked into actor pixels'), 'the elite crown identity and external-effect boundary must remain explicit');
check(EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.animationContract.includes('slow 480 ms planted hornlord Idle cycle') && EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.animationContract.includes('split-hoof contacts remain grounded'), 'the planted two-frame elite motion contract must remain explicit');
check(EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.exclusions.includes('Briar Reveler changes') && EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.exclusions.includes('Reed Charmer changes') && EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.exclusions.includes('Walk') && EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.exclusions.includes('registration') && EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.exclusions.includes('release'), 'the gate must exclude approved variants, later motion, integration, and release');
check(EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.nextGate.includes('Visual approval and bounded publication are complete') && EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.nextGate.includes('next documented Wildwood art gate') && EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.nextGate.includes('does not authorize registration'), 'the approved Idle gate must preserve the narrow next-gate and integration boundaries');
check(Object.isFrozen(EN_E03_WILDWOOD_HORNLORD_IDLE_GATE) && Object.isFrozen(EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.precedingApproval) && Object.isFrozen(EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.exclusions), 'the Wildwood Hornlord gate must be deeply immutable');

check(EN_E03_WILDWOOD_HORNLORD_IDLE_DATA.actor.outfit === EN_E03_BRIAR_REVELER_CALIBRATION_DATA.actor.outfit, 'Wildwood Hornlord must retain the approved Satyr torso geometry');
check(EN_E03_WILDWOOD_HORNLORD_IDLE_DATA.actor.weapon === 'none', 'the crown-and-mantle elite identity must remain an internal overlay rather than a public weapon');
check(EN_E03_WILDWOOD_HORNLORD_IDLE_DATA.effectBoundary === 'external-thorn-aura-leaf-swirl-and-root-burst' && EN_E03_WILDWOOD_HORNLORD_IDLE_DATA.bakedEffects.length === 0, 'thorn, leaf, and root effects must remain external with zero baked effects');
check(EN_E03_WILDWOOD_HORNLORD_IDLE_REGISTRY.families.length === 1, 'the elite candidate registry must contain exactly one family');
check(EN_E03_WILDWOOD_HORNLORD_IDLE_REGISTRY.publicFamilies.length === 0, 'the elite candidate registry must expose zero public families');
check(EN_E03_WILDWOOD_HORNLORD_IDLE_FAMILY.variants.length === 1 && EN_E03_WILDWOOD_HORNLORD_IDLE_FAMILY.variants[0].id === 'wildwood-hornlord', 'the candidate registry must contain only Wildwood Hornlord');
check(EN_E03_WILDWOOD_HORNLORD_IDLE_REGISTRY.renderers[0].chassis === 'humanoid-v1', 'the elite must retain the approved humanoid Satyr chassis');
check(engine.EN_E03_WILDWOOD_HORNLORD_IDLE_REGISTRY === undefined && engine.EN_E03_WILDWOOD_HORNLORD_IDLE_GATE === undefined, 'the elite candidate must not leak through the public engine facade');
check(engine.PUBLIC_ENEMIES.length === 80 && engine.ENEMIES.length === 57, 'the source must retain current public and legacy Enemy counts');
check(engine.PUBLIC_ENEMIES.some((family) => family.id === 'satyr'), 'the later approved adoption must expose Satyr in public consumers');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!facadeSource.includes('enemy-expansion-en-e03-satyr-elite-idle') && !facadeSource.includes('EN_E03_WILDWOOD_HORNLORD_IDLE'), 'the public facade must not import or expose Wildwood Hornlord symbols');

check(await sha256File(EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.artifact) === EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.artifactSha256, 'the raw Wildwood Hornlord review board must match its frozen candidate hash');
check(await sha256File(EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.assembledArtifact) === EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.assembledArtifactSha256, 'the Complete B + Form Wildwood Hornlord review board must match its frozen candidate hash');
check(await sha256File(EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.reviewAnimations.raw.artifact) === EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.reviewAnimations.raw.sha256, 'the raw labeled Wildwood Hornlord GIF must match its frozen candidate hash');
check(await sha256File(EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.reviewAnimations.completeBForm.artifact) === EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.reviewAnimations.completeBForm.sha256, 'the Complete B + Form labeled Wildwood Hornlord GIF must match its frozen candidate hash');
for (const animation of Object.values(EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.reviewAnimations)) {
  check(animation.width === 192 && animation.height === 224 && animation.frames === 2 && animation.durationMs === 480, 'each Wildwood Hornlord GIF must retain the 192x224 two-frame 480 ms contract');
}

const briarRecords = captureRecords(EN_E03_SATYR_IDLE_REGISTRY, 'satyr', 'briar-reveler');
const briarDigest = createHash('sha256').update(JSON.stringify(briarRecords)).digest('hex');
check(briarDigest === EN_E03_SATYR_IDLE_GATE.candidateFrameDigest, 'all eight approved Briar Reveler Idle frames must remain byte-exact');

const candidateRecords = [];
const candidateFrames = new Map();
const antlerColors = new Set(EN_E03_WILDWOOD_HORNLORD_IDLE_DATA.elite.antler);
const mossColors = new Set(EN_E03_WILDWOOD_HORNLORD_IDLE_DATA.elite.moss);
const regaliaColors = new Set([
  ...EN_E03_WILDWOOD_HORNLORD_IDLE_DATA.elite.bark,
  ...EN_E03_WILDWOOD_HORNLORD_IDLE_DATA.elite.torque,
]);
const forbiddenStaffColors = new Set(EN_E03_BRIAR_REVELER_CALIBRATION_DATA.satyr.wood);
let antlerPixels = 0;
let mossPixels = 0;
let regaliaPixels = 0;
let changedAlpha = 0;
let completeOutlinePixels = 0;
let formChangedPixels = 0;
let minimumOpaque = Number.POSITIVE_INFINITY;
let maximumOpaque = 0;
for (const direction of engine.DIRS) for (let frame = 0; frame < 2; frame++) {
  const captured = captureEnemyExpansionFrame(
    EN_E03_WILDWOOD_HORNLORD_IDLE_REGISTRY,
    { kind: 'enemy', family: 'satyr', variant: 'wildwood-hornlord' },
    direction,
    'idle',
    frame,
  );
  const briar = captureEnemyExpansionFrame(
    EN_E03_SATYR_IDLE_REGISTRY,
    { kind: 'enemy', family: 'satyr', variant: 'briar-reveler' },
    direction,
    'idle',
    frame,
  );
  candidateRecords.push(frameRecord(captured, 'satyr', 'wildwood-hornlord', direction, frame));
  candidateFrames.set(direction + '/' + frame, captured);
  minimumOpaque = Math.min(minimumOpaque, captured.opaquePixels);
  maximumOpaque = Math.max(maximumOpaque, captured.opaquePixels);
  check(captured.outOfBoundsWrites.length === 0, direction + '/F' + (frame + 1) + ' must not write out of bounds');
  check(captured.alpha.every((value) => value === 0 || value === 255), direction + '/F' + (frame + 1) + ' must retain hard alpha');
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22, direction + '/F' + (frame + 1) + ' must retain a one-cell margin');
  check(componentCount(captured.pixels) === 1, direction + '/F' + (frame + 1) + ' must remain one connected crown-body-tail silhouette');
  check(opaqueRunsAtRow(captured.alpha, 22) === 4, direction + '/F' + (frame + 1) + ' must retain four separated cloven-hoof tips');
  check(JSON.stringify(captured.pixels.slice(22 * engine.SIZE)) === JSON.stringify(briar.pixels.slice(22 * engine.SIZE)), direction + '/F' + (frame + 1) + ' must preserve the exact approved split-hoof contact row');
  check(captured.digest !== briar.digest, direction + '/F' + (frame + 1) + ' must remain visually distinct from Briar Reveler');
  check(!captured.colors.some((color) => forbiddenStaffColors.has(color)), direction + '/F' + (frame + 1) + ' must remove the Briar Reveler crooked staff');
  for (const color of EN_E03_BRIAR_REVELER_CALIBRATION_DATA.satyr.hoof) check(captured.colors.includes(color), direction + '/F' + (frame + 1) + ' must retain approved hoof color ' + color);
  for (const color of EN_E03_BRIAR_REVELER_CALIBRATION_DATA.satyr.horn) check(captured.colors.includes(color), direction + '/F' + (frame + 1) + ' must retain approved horn-root color ' + color);
  check(captured.renderResult.wildwoodHornlordIdleGate === EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.id, direction + '/F' + (frame + 1) + ' must report the elite gate');
  check(captured.renderResult.approvedPrecedingGate === EN_E03_REED_CHARMER_MOTION_GATE.id, direction + '/F' + (frame + 1) + ' must report the approved predecessor');
  check(captured.renderResult.approvedSatyrBaselineGate === EN_E03_SATYR_IDLE_GATE.id, direction + '/F' + (frame + 1) + ' must report the approved Satyr baseline');
  check(captured.renderResult.effectBoundary === 'external-thorn-aura-leaf-swirl-and-root-burst', direction + '/F' + (frame + 1) + ' must report the external effect boundary');
  const frameAntlerPixels = captured.pixels.filter((color) => antlerColors.has(color)).length;
  const frameMossPixels = captured.pixels.filter((color) => mossColors.has(color)).length;
  const frameRegaliaPixels = captured.pixels.filter((color) => regaliaColors.has(color)).length;
  antlerPixels += frameAntlerPixels;
  mossPixels += frameMossPixels;
  regaliaPixels += frameRegaliaPixels;
  check(frameAntlerPixels >= 10, direction + '/F' + (frame + 1) + ' must retain a readable branching antler crown');
  check(frameMossPixels >= 8, direction + '/F' + (frame + 1) + ' must retain a readable moss mantle');
  check(frameRegaliaPixels >= 12, direction + '/F' + (frame + 1) + ' must retain bark armor and amber torque details');
  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E03_WILDWOOD_HORNLORD_IDLE_DATA);
  completeOutlinePixels += presentation.complete.filter((color, index) => color !== null && captured.pixels[index] === null).length;
  formChangedPixels += presentation.form.filter((color, index) => captured.pixels[index] !== null && color !== captured.pixels[index]).length;
}

for (const direction of engine.DIRS) {
  const first = candidateFrames.get(direction + '/0');
  const second = candidateFrames.get(direction + '/1');
  check(first.digest !== second.digest, direction + ' Idle F1 and F2 must remain distinct');
  const changed = changedAlphaPixels(first.alpha, second.alpha);
  check(changed >= 12, direction + ' Idle F2 must create a visible crown/mantle/leg settle');
  changedAlpha += changed;
}
for (let frame = 0; frame < 2; frame++) {
  check(JSON.stringify(candidateFrames.get('left/' + frame).pixels) === JSON.stringify(mirrorPixels(candidateFrames.get('right/' + frame).pixels, engine.SIZE)), 'left/right F' + (frame + 1) + ' must remain exact mirrors');
  check(candidateFrames.get('down/' + frame).digest !== candidateFrames.get('up/' + frame).digest, 'Down/Up F' + (frame + 1) + ' must remain distinct');
}

const candidateDigest = createHash('sha256').update(JSON.stringify(candidateRecords)).digest('hex');
check(candidateDigest === EN_E03_WILDWOOD_HORNLORD_IDLE_GATE.candidateFrameDigest, 'the eight Wildwood Hornlord Idle frames drifted from the review candidate');
check(completeOutlinePixels > 0, 'Complete B must add exterior outline pixels across the Wildwood Hornlord review set');
check(formChangedPixels > 0, 'Form must shade source pixels across the Wildwood Hornlord review set');

rejects(() => engine.renderEnemyExpansionFrame(EN_E03_WILDWOOD_HORNLORD_IDLE_REGISTRY, { kind: 'enemy', family: 'satyr', variant: 'wildwood-hornlord' }, 'down', 'walk', 0, {}), 'authorizes only two Idle frames', 'Wildwood Hornlord Walk rendering');
rejects(() => engine.renderEnemyExpansionFrame(EN_E03_WILDWOOD_HORNLORD_IDLE_REGISTRY, { kind: 'enemy', family: 'satyr', variant: 'wildwood-hornlord' }, 'down', 'idle', 2, {}), 'Expansion frame 2 is invalid for idle', 'Wildwood Hornlord Idle frame 3 rendering');
rejects(() => engine.renderEnemyExpansionFrame(EN_E03_WILDWOOD_HORNLORD_IDLE_REGISTRY, { kind: 'enemy', family: 'satyr', variant: 'briar-reveler' }, 'down', 'idle', 0, {}), 'is not implemented', 'Briar Reveler rendering from the elite registry');
rejects(() => engine.renderEnemyExpansionFrame(EN_E03_WILDWOOD_HORNLORD_IDLE_REGISTRY, { kind: 'enemy', family: 'satyr', variant: 'reed-charmer' }, 'down', 'idle', 0, {}), 'is not implemented', 'Reed Charmer rendering from the elite registry');
rejects(() => engine.renderEnemyExpansionFrame(EN_E03_WILDWOOD_HORNLORD_IDLE_REGISTRY, { kind: 'enemy', family: 'centaur', variant: 'banner-khan' }, 'down', 'idle', 0, {}), 'is not implemented', 'Centaur rendering from the elite registry');

if (errors.length) {
  console.error('EN-E03 Wildwood Hornlord Idle validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E03 Wildwood Hornlord Idle validation passed.');
console.log('- Approved Briar Reveler Idle frames preserved: ' + briarRecords.length + ' / 8');
console.log('- Wildwood Hornlord Idle frames: ' + candidateRecords.length + ' / 8');
console.log('- Connected hard-alpha crown-body-tail silhouettes: 8 / 8');
console.log('- Four split-hoof contact rows: 8 / 8');
console.log('- Exact side mirrors: 4 / 4');
console.log('- F1/F2 changed alpha pixels: ' + changedAlpha);
console.log('- Branching-antler pixels: ' + antlerPixels);
console.log('- Moss-mantle pixels: ' + mossPixels);
console.log('- Bark-and-torque pixels: ' + regaliaPixels);
console.log('- Opaque pixel range: ' + minimumOpaque + ' to ' + maximumOpaque);
console.log('- Complete B added pixels: ' + completeOutlinePixels);
console.log('- Form-shaded source pixels: ' + formChangedPixels);
console.log('- Baked thorn/leaf/root pixels: 0');
console.log('- Public EN-E03 families: 0');
console.log('- Candidate frame digest: ' + candidateDigest);
