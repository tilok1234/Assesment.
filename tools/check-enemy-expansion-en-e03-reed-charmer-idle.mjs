import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { EN_E03_BANNER_KHAN_MOTION_GATE } from '../engine/enemy-expansion-en-e03-centaur-elite-motion.js';
import {
  EN_E03_BRIAR_REVELER_CALIBRATION_DATA,
} from '../engine/enemy-expansion-en-e03-satyr-calibration.js';
import {
  EN_E03_SATYR_IDLE_GATE,
  EN_E03_SATYR_IDLE_REGISTRY,
} from '../engine/enemy-expansion-en-e03-satyr-idle.js';
import {
  EN_E03_REED_CHARMER_IDLE_DATA,
  EN_E03_REED_CHARMER_IDLE_FAMILY,
  EN_E03_REED_CHARMER_IDLE_GATE,
  EN_E03_REED_CHARMER_IDLE_REGISTRY,
} from '../engine/enemy-expansion-en-e03-satyr-specialist-idle.js';
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

check(EN_E03_BANNER_KHAN_MOTION_GATE.status === 'approved', 'the preceding Banner Khan grouped-motion gate must remain approved');
check(EN_E03_BANNER_KHAN_MOTION_GATE.approvedOn === '2026-08-08', 'the preceding Banner Khan approval date must remain frozen');
check(EN_E03_SATYR_IDLE_GATE.status === 'approved', 'the Briar Reveler Satyr Idle baseline must remain approved');
check(EN_E03_REED_CHARMER_IDLE_GATE.status === 'approved', 'the Reed Charmer Idle gate must retain exact paired visual approval');
check(EN_E03_REED_CHARMER_IDLE_GATE.authorizedOn === '2026-08-08', 'the Reed Charmer authorization date must remain frozen');
check(EN_E03_REED_CHARMER_IDLE_GATE.authorizationEvidence.includes('cool lets do next') && EN_E03_REED_CHARMER_IDLE_GATE.authorizationEvidence.includes('Reed Charmer specialist Idle F1-F2 across four directions'), 'the gate must retain the exact continuation evidence and bounded role-order scope');
check(EN_E03_REED_CHARMER_IDLE_GATE.approvedOn === '2026-08-08', 'the Reed Charmer approval date must remain frozen');
check(EN_E03_REED_CHARMER_IDLE_GATE.approvalEvidence === 'Designer reviewed both exact labeled all-four-direction raw and Complete B + Form Reed Charmer Idle GIFs together and said: Approved.', 'the Reed Charmer gate must retain the exact paired-GIF approval evidence');
check(EN_E03_REED_CHARMER_IDLE_GATE.precedingApproval.gateId === EN_E03_BANNER_KHAN_MOTION_GATE.id, 'the Reed Charmer gate must identify the approved Banner Khan predecessor');
check(EN_E03_REED_CHARMER_IDLE_GATE.precedingApproval.artifactSha256 === EN_E03_BANNER_KHAN_MOTION_GATE.artifactSha256, 'the preceding raw Banner Khan board hash must remain frozen');
check(EN_E03_REED_CHARMER_IDLE_GATE.precedingApproval.assembledArtifactSha256 === EN_E03_BANNER_KHAN_MOTION_GATE.assembledArtifactSha256, 'the preceding Complete B + Form Banner Khan board hash must remain frozen');
check(EN_E03_REED_CHARMER_IDLE_GATE.precedingApproval.rawAnimationSha256 === EN_E03_BANNER_KHAN_MOTION_GATE.reviewAnimations.raw.sha256, 'the preceding raw Banner Khan GIF hash must remain frozen');
check(EN_E03_REED_CHARMER_IDLE_GATE.precedingApproval.completeBFormAnimationSha256 === EN_E03_BANNER_KHAN_MOTION_GATE.reviewAnimations.completeBForm.sha256, 'the preceding Complete B + Form Banner Khan GIF hash must remain frozen');
check(EN_E03_REED_CHARMER_IDLE_GATE.precedingApproval.candidateFrameDigest === EN_E03_BANNER_KHAN_MOTION_GATE.candidateFrameDigest, 'the preceding Banner Khan frame digest must remain frozen');
check(EN_E03_REED_CHARMER_IDLE_GATE.approvedSatyrBaseline.gateId === EN_E03_SATYR_IDLE_GATE.id, 'the Reed Charmer gate must identify the approved Briar Reveler baseline');
check(EN_E03_REED_CHARMER_IDLE_GATE.approvedSatyrBaseline.artifactSha256 === EN_E03_SATYR_IDLE_GATE.artifactSha256, 'the approved raw Briar Reveler board hash must remain frozen');
check(EN_E03_REED_CHARMER_IDLE_GATE.approvedSatyrBaseline.assembledArtifactSha256 === EN_E03_SATYR_IDLE_GATE.assembledArtifactSha256, 'the approved Complete B + Form Briar Reveler board hash must remain frozen');
check(EN_E03_REED_CHARMER_IDLE_GATE.approvedSatyrBaseline.candidateFrameDigest === EN_E03_SATYR_IDLE_GATE.candidateFrameDigest, 'the approved Briar Reveler frame digest must remain frozen');
check(EN_E03_REED_CHARMER_IDLE_GATE.scope.includes('Idle F1-F2 only') && EN_E03_REED_CHARMER_IDLE_GATE.scope.includes('Down, Left, Right, and Up'), 'the gate must remain bounded to two Idle frames across four directions');
check(EN_E03_REED_CHARMER_IDLE_GATE.identityContract.includes('compact direction-aware panpipe') && EN_E03_REED_CHARMER_IDLE_GATE.identityContract.includes('not baked into actor pixels'), 'the pipe-playing identity and external-effect boundary must remain explicit');
check(EN_E03_REED_CHARMER_IDLE_GATE.animationContract.includes('slow 480 ms planted pipe-playing Idle cycle') && EN_E03_REED_CHARMER_IDLE_GATE.animationContract.includes('split-hoof contacts remain grounded'), 'the planted two-frame playing motion contract must remain explicit');
check(EN_E03_REED_CHARMER_IDLE_GATE.exclusions.includes('Wildwood Hornlord') && EN_E03_REED_CHARMER_IDLE_GATE.exclusions.includes('baked music-note pixels') && EN_E03_REED_CHARMER_IDLE_GATE.exclusions.includes('baked charm-ring pixels') && EN_E03_REED_CHARMER_IDLE_GATE.exclusions.includes('Walk') && EN_E03_REED_CHARMER_IDLE_GATE.exclusions.includes('registration') && EN_E03_REED_CHARMER_IDLE_GATE.exclusions.includes('release'), 'the gate must exclude the elite, baked effects, later motion, integration, and release');
check(EN_E03_REED_CHARMER_IDLE_GATE.nextGate.includes('Visual approval and bounded publication are complete') && EN_E03_REED_CHARMER_IDLE_GATE.nextGate.includes('No later animation, variant, registration, integration, effect, release, or EN-E03 work is authorized'), 'the approved Reed Charmer gate must stop before later work without a separate continuation');
check(Object.isFrozen(EN_E03_REED_CHARMER_IDLE_GATE) && Object.isFrozen(EN_E03_REED_CHARMER_IDLE_GATE.precedingApproval) && Object.isFrozen(EN_E03_REED_CHARMER_IDLE_GATE.exclusions), 'the Reed Charmer gate must be deeply immutable');

check(EN_E03_REED_CHARMER_IDLE_DATA.actor.outfit === EN_E03_BRIAR_REVELER_CALIBRATION_DATA.actor.outfit, 'Reed Charmer must retain the approved Satyr torso geometry');
check(EN_E03_REED_CHARMER_IDLE_DATA.actor.weapon === 'none', 'the panpipe must remain a specialist identity overlay rather than a public weapon');
check(EN_E03_REED_CHARMER_IDLE_DATA.effectBoundary === 'external-music-notes-pollen-and-charm-ring' && EN_E03_REED_CHARMER_IDLE_DATA.bakedEffects.length === 0, 'music notes, pollen, and charm rings must remain external with zero baked effects');
check(EN_E03_REED_CHARMER_IDLE_REGISTRY.families.length === 1, 'the specialist candidate registry must contain exactly one family');
check(EN_E03_REED_CHARMER_IDLE_REGISTRY.publicFamilies.length === 0, 'the specialist candidate registry must expose zero public families');
check(EN_E03_REED_CHARMER_IDLE_FAMILY.variants.length === 1 && EN_E03_REED_CHARMER_IDLE_FAMILY.variants[0].id === 'reed-charmer', 'the candidate registry must contain only Reed Charmer');
check(EN_E03_REED_CHARMER_IDLE_REGISTRY.renderers[0].chassis === 'humanoid-v1', 'the specialist must retain the approved humanoid Satyr chassis');
check(engine.EN_E03_REED_CHARMER_IDLE_REGISTRY === undefined && engine.EN_E03_REED_CHARMER_IDLE_GATE === undefined, 'the specialist candidate must not leak through the public engine facade');
check(engine.PUBLIC_ENEMIES.length === 74 && engine.ENEMIES.length === 57, 'the candidate must retain current public and legacy Enemy counts');
check(!engine.PUBLIC_ENEMIES.some((family) => family.id === 'satyr'), 'Satyr must remain absent from public consumers');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!facadeSource.includes('enemy-expansion-en-e03-satyr-specialist-idle') && !facadeSource.includes('EN_E03_REED_CHARMER_IDLE'), 'the public facade must not import or expose Reed Charmer symbols');

check(await sha256File(EN_E03_REED_CHARMER_IDLE_GATE.artifact) === EN_E03_REED_CHARMER_IDLE_GATE.artifactSha256, 'the raw Reed Charmer review board must match its frozen candidate hash');
check(await sha256File(EN_E03_REED_CHARMER_IDLE_GATE.assembledArtifact) === EN_E03_REED_CHARMER_IDLE_GATE.assembledArtifactSha256, 'the Complete B + Form Reed Charmer review board must match its frozen candidate hash');
check(await sha256File(EN_E03_REED_CHARMER_IDLE_GATE.reviewAnimations.raw.artifact) === EN_E03_REED_CHARMER_IDLE_GATE.reviewAnimations.raw.sha256, 'the raw labeled Reed Charmer GIF must match its frozen candidate hash');
check(await sha256File(EN_E03_REED_CHARMER_IDLE_GATE.reviewAnimations.completeBForm.artifact) === EN_E03_REED_CHARMER_IDLE_GATE.reviewAnimations.completeBForm.sha256, 'the Complete B + Form labeled Reed Charmer GIF must match its frozen candidate hash');
for (const animation of Object.values(EN_E03_REED_CHARMER_IDLE_GATE.reviewAnimations)) {
  check(animation.width === 192 && animation.height === 224 && animation.frames === 2 && animation.durationMs === 480, 'each Reed Charmer GIF must retain the 192x224 two-frame 480 ms contract');
}

const briarRecords = captureRecords(EN_E03_SATYR_IDLE_REGISTRY, 'satyr', 'briar-reveler');
const briarDigest = createHash('sha256').update(JSON.stringify(briarRecords)).digest('hex');
check(briarDigest === EN_E03_SATYR_IDLE_GATE.candidateFrameDigest, 'all eight approved Briar Reveler Idle frames must remain byte-exact');

const candidateRecords = [];
const candidateFrames = new Map();
const reedColors = new Set(EN_E03_REED_CHARMER_IDLE_DATA.specialist.reed);
const tunicColors = new Set(EN_E03_REED_CHARMER_IDLE_DATA.actor.palette.outfit.slice(0, 2));
const forbiddenStaffColors = new Set(EN_E03_BRIAR_REVELER_CALIBRATION_DATA.satyr.wood);
let reedPixels = 0;
let tunicPixels = 0;
let changedAlpha = 0;
let completeOutlinePixels = 0;
let formChangedPixels = 0;
for (const direction of engine.DIRS) for (let frame = 0; frame < 2; frame++) {
  const captured = captureEnemyExpansionFrame(
    EN_E03_REED_CHARMER_IDLE_REGISTRY,
    { kind: 'enemy', family: 'satyr', variant: 'reed-charmer' },
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
  candidateRecords.push(frameRecord(captured, 'satyr', 'reed-charmer', direction, frame));
  candidateFrames.set(direction + '/' + frame, captured);
  check(captured.outOfBoundsWrites.length === 0, direction + '/F' + (frame + 1) + ' must not write out of bounds');
  check(captured.alpha.every((value) => value === 0 || value === 255), direction + '/F' + (frame + 1) + ' must retain hard alpha');
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22, direction + '/F' + (frame + 1) + ' must retain a one-cell margin');
  check(componentCount(captured.pixels) === 1, direction + '/F' + (frame + 1) + ' must remain one connected horned-body-tail-pipe silhouette');
  check(opaqueRunsAtRow(captured.alpha, 22) === 4, direction + '/F' + (frame + 1) + ' must retain four separated cloven-hoof tips');
  check(JSON.stringify(captured.pixels.slice(22 * engine.SIZE)) === JSON.stringify(briar.pixels.slice(22 * engine.SIZE)), direction + '/F' + (frame + 1) + ' must preserve the exact approved split-hoof contact row');
  check(captured.digest !== briar.digest, direction + '/F' + (frame + 1) + ' must remain visually distinct from Briar Reveler');
  check(!captured.colors.some((color) => forbiddenStaffColors.has(color)), direction + '/F' + (frame + 1) + ' must remove the Briar Reveler crooked staff');
  for (const color of EN_E03_BRIAR_REVELER_CALIBRATION_DATA.satyr.hoof) check(captured.colors.includes(color), direction + '/F' + (frame + 1) + ' must retain approved hoof color ' + color);
  for (const color of EN_E03_BRIAR_REVELER_CALIBRATION_DATA.satyr.horn) check(captured.colors.includes(color), direction + '/F' + (frame + 1) + ' must retain approved horn color ' + color);
  check(captured.renderResult.reedCharmerIdleGate === EN_E03_REED_CHARMER_IDLE_GATE.id, direction + '/F' + (frame + 1) + ' must report the specialist gate');
  check(captured.renderResult.approvedPrecedingGate === EN_E03_BANNER_KHAN_MOTION_GATE.id, direction + '/F' + (frame + 1) + ' must report the approved predecessor');
  check(captured.renderResult.approvedSatyrBaselineGate === EN_E03_SATYR_IDLE_GATE.id, direction + '/F' + (frame + 1) + ' must report the approved Satyr baseline');
  check(captured.renderResult.effectBoundary === 'external-music-notes-pollen-and-charm-ring', direction + '/F' + (frame + 1) + ' must report the external effect boundary');
  const frameReedPixels = captured.pixels.filter((color) => reedColors.has(color)).length;
  const frameTunicPixels = captured.pixels.filter((color) => tunicColors.has(color)).length;
  reedPixels += frameReedPixels;
  tunicPixels += frameTunicPixels;
  check(frameReedPixels >= 10, direction + '/F' + (frame + 1) + ' must retain a readable compact panpipe and woven sash');
  check(frameTunicPixels >= 4, direction + '/F' + (frame + 1) + ' must retain the teal specialist tunic (found ' + frameTunicPixels + ')');
  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E03_REED_CHARMER_IDLE_DATA);
  completeOutlinePixels += presentation.complete.filter((color, index) => color !== null && captured.pixels[index] === null).length;
  formChangedPixels += presentation.form.filter((color, index) => captured.pixels[index] !== null && color !== captured.pixels[index]).length;
}

for (const direction of engine.DIRS) {
  const first = candidateFrames.get(direction + '/0');
  const second = candidateFrames.get(direction + '/1');
  check(first.digest !== second.digest, direction + ' Idle F1 and F2 must remain distinct');
  const changed = changedAlphaPixels(first.alpha, second.alpha);
  check(changed >= 8, direction + ' Idle F2 must create a visible playing/settle pose change');
  changedAlpha += changed;
}
for (let frame = 0; frame < 2; frame++) {
  check(JSON.stringify(candidateFrames.get('left/' + frame).pixels) === JSON.stringify(mirrorPixels(candidateFrames.get('right/' + frame).pixels, engine.SIZE)), 'left/right F' + (frame + 1) + ' must remain exact mirrors');
  check(candidateFrames.get('down/' + frame).digest !== candidateFrames.get('up/' + frame).digest, 'Down/Up F' + (frame + 1) + ' must remain distinct');
}

const candidateDigest = createHash('sha256').update(JSON.stringify(candidateRecords)).digest('hex');
check(candidateDigest === EN_E03_REED_CHARMER_IDLE_GATE.candidateFrameDigest, 'the eight Reed Charmer Idle frames drifted from the review candidate');
check(completeOutlinePixels > 0, 'Complete B must add exterior outline pixels across the Reed Charmer review set');
check(formChangedPixels > 0, 'Form must shade source pixels across the Reed Charmer review set');

rejects(() => engine.renderEnemyExpansionFrame(EN_E03_REED_CHARMER_IDLE_REGISTRY, { kind: 'enemy', family: 'satyr', variant: 'reed-charmer' }, 'down', 'walk', 0, {}), 'authorizes only two Idle frames', 'Reed Charmer Walk rendering');
rejects(() => engine.renderEnemyExpansionFrame(EN_E03_REED_CHARMER_IDLE_REGISTRY, { kind: 'enemy', family: 'satyr', variant: 'reed-charmer' }, 'down', 'idle', 2, {}), 'Expansion frame 2 is invalid for idle', 'Reed Charmer Idle frame 3 rendering');
rejects(() => engine.renderEnemyExpansionFrame(EN_E03_REED_CHARMER_IDLE_REGISTRY, { kind: 'enemy', family: 'satyr', variant: 'briar-reveler' }, 'down', 'idle', 0, {}), 'is not implemented', 'Briar Reveler rendering from the specialist registry');
rejects(() => engine.renderEnemyExpansionFrame(EN_E03_REED_CHARMER_IDLE_REGISTRY, { kind: 'enemy', family: 'satyr', variant: 'wildwood-hornlord' }, 'down', 'idle', 0, {}), 'is not implemented', 'Wildwood Hornlord rendering');
rejects(() => engine.renderEnemyExpansionFrame(EN_E03_REED_CHARMER_IDLE_REGISTRY, { kind: 'enemy', family: 'centaur', variant: 'banner-khan' }, 'down', 'idle', 0, {}), 'is not implemented', 'Centaur rendering from the specialist registry');

if (errors.length) {
  console.error('EN-E03 Reed Charmer Idle validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E03 Reed Charmer Idle validation passed.');
console.log('- Approved Briar Reveler Idle frames preserved: ' + briarRecords.length + ' / 8');
console.log('- Reed Charmer Idle frames: ' + candidateRecords.length + ' / 8');
console.log('- Connected hard-alpha Satyr silhouettes: 8 / 8');
console.log('- Four split-hoof contact rows: 8 / 8');
console.log('- Exact side mirrors: 4 / 4');
console.log('- F1/F2 changed alpha pixels: ' + changedAlpha);
console.log('- Reed-pipe and sash pixels: ' + reedPixels);
console.log('- Teal tunic pixels: ' + tunicPixels);
console.log('- Complete B added pixels: ' + completeOutlinePixels);
console.log('- Form-shaded source pixels: ' + formChangedPixels);
console.log('- Baked music/pollen/charm pixels: 0');
console.log('- Public EN-E03 families: 0');
console.log('- Candidate frame digest: ' + candidateDigest);
