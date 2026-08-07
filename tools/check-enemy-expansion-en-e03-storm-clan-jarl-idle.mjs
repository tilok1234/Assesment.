import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { EN_E03_GIANT_IDLE_GATE, EN_E03_GIANT_IDLE_REGISTRY } from '../engine/enemy-expansion-en-e03-giant-idle.js';
import {
  EN_E03_BOULDER_HURLER_IDLE_GATE,
  EN_E03_BOULDER_HURLER_IDLE_REGISTRY,
} from '../engine/enemy-expansion-en-e03-giant-specialist-idle.js';
import {
  EN_E03_STORM_CLAN_JARL_IDLE_DATA,
  EN_E03_STORM_CLAN_JARL_IDLE_FAMILY,
  EN_E03_STORM_CLAN_JARL_IDLE_GATE,
  EN_E03_STORM_CLAN_JARL_IDLE_REGISTRY,
} from '../engine/enemy-expansion-en-e03-giant-elite-idle.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import { captureEnemyExpansionFrame } from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors = [];
const check = (condition, message) => {
  if (!condition) errors.push(message);
};

function rejects(callback, messagePart, label) {
  try {
    callback();
    errors.push(label + ' must reject.');
  } catch (error) {
    check(error instanceof TypeError && error.message.includes(messagePart), label + ' rejected with an unexpected error: ' + error.message);
  }
}

async function sha256File(relativePath) {
  return createHash('sha256').update(await readFile(path.resolve(root, relativePath))).digest('hex');
}

function frameRecord(captured, variant, direction, frame) {
  return {
    family: 'giant',
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

function connectedComponents(pixels) {
  const size = engine.SIZE;
  const visited = new Set();
  let components = 0;
  for (let index = 0; index < pixels.length; index++) {
    if (pixels[index] === null || visited.has(index)) continue;
    components++;
    const queue = [index];
    visited.add(index);
    while (queue.length) {
      const current = queue.pop();
      const x = current % size;
      const y = Math.floor(current / size);
      for (const [nextX, nextY] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
        if (nextX < 0 || nextY < 0 || nextX >= size || nextY >= size) continue;
        const next = (nextY * size) + nextX;
        if (pixels[next] !== null && !visited.has(next)) {
          visited.add(next);
          queue.push(next);
        }
      }
    }
  }
  return components;
}

function mirrorPixels(pixels) {
  const mirrored = Array(pixels.length).fill(null);
  for (let y = 0; y < engine.SIZE; y++) for (let x = 0; x < engine.SIZE; x++) {
    mirrored[(y * engine.SIZE) + (engine.SIZE - 1 - x)] = pixels[(y * engine.SIZE) + x];
  }
  return mirrored;
}

function captureApprovedRecords(registry, variant) {
  const records = [];
  for (const direction of engine.DIRS) for (let frame = 0; frame < 2; frame++) {
    records.push(frameRecord(captureEnemyExpansionFrame(
      registry,
      { kind: 'enemy', family: 'giant', variant },
      direction,
      'idle',
      frame,
    ), variant, direction, frame));
  }
  return records;
}

check(EN_E03_BOULDER_HURLER_IDLE_GATE.status === 'approved', 'the preceding Boulder Hurler Idle gate must remain approved');
check(EN_E03_STORM_CLAN_JARL_IDLE_GATE.status === 'approved', 'the Storm-Clan Jarl Idle gate must retain exact visual approval');
check(EN_E03_STORM_CLAN_JARL_IDLE_GATE.authorizedOn === '2026-08-07', 'the Storm-Clan Jarl Idle gate must retain its authorization date');
check(EN_E03_STORM_CLAN_JARL_IDLE_GATE.authorizationEvidence.includes('awesome lets do next in plan') && EN_E03_STORM_CLAN_JARL_IDLE_GATE.authorizationEvidence.includes('Idle F1-F2 across four directions'), 'the gate must retain the exact bounded continuation evidence');
check(EN_E03_STORM_CLAN_JARL_IDLE_GATE.revisionEvidence.includes('shoulder is kind of in wrong place in the side frames') && EN_E03_STORM_CLAN_JARL_IDLE_GATE.revisionEvidence.includes('one row down and one pixel back'), 'the candidate must retain the exact side-pauldron revision evidence');
check(EN_E03_STORM_CLAN_JARL_IDLE_GATE.approvedOn === '2026-08-07', 'the Storm-Clan Jarl Idle gate must retain its visual approval date');
check(EN_E03_STORM_CLAN_JARL_IDLE_GATE.approvalEvidence === 'Designer reviewed both exact corrected labeled all-four-direction raw and Complete B + Form Storm-Clan Jarl Idle GIFs together after the requested side-shoulder placement repair and said: approved.', 'the gate must retain the exact corrected paired-GIF approval evidence');
check(EN_E03_STORM_CLAN_JARL_IDLE_GATE.precedingApproval.gateId === EN_E03_BOULDER_HURLER_IDLE_GATE.id, 'the gate must identify the approved Boulder Hurler predecessor');
check(EN_E03_STORM_CLAN_JARL_IDLE_GATE.precedingApproval.artifactSha256 === EN_E03_BOULDER_HURLER_IDLE_GATE.artifactSha256, 'the preceding raw Boulder Hurler board hash must remain frozen');
check(EN_E03_STORM_CLAN_JARL_IDLE_GATE.precedingApproval.assembledArtifactSha256 === EN_E03_BOULDER_HURLER_IDLE_GATE.assembledArtifactSha256, 'the preceding Complete B + Form Boulder Hurler board hash must remain frozen');
check(EN_E03_STORM_CLAN_JARL_IDLE_GATE.precedingApproval.rawAnimationSha256 === EN_E03_BOULDER_HURLER_IDLE_GATE.reviewAnimations.raw.sha256, 'the preceding raw Boulder Hurler GIF hash must remain frozen');
check(EN_E03_STORM_CLAN_JARL_IDLE_GATE.precedingApproval.completeBFormAnimationSha256 === EN_E03_BOULDER_HURLER_IDLE_GATE.reviewAnimations.completeBForm.sha256, 'the preceding Complete B + Form Boulder Hurler GIF hash must remain frozen');
check(EN_E03_STORM_CLAN_JARL_IDLE_GATE.precedingApproval.candidateFrameDigest === EN_E03_BOULDER_HURLER_IDLE_GATE.candidateFrameDigest, 'the preceding Boulder Hurler frame digest must remain frozen');
check(EN_E03_STORM_CLAN_JARL_IDLE_GATE.scope.includes('Idle F1-F2 only') && EN_E03_STORM_CLAN_JARL_IDLE_GATE.scope.includes('Down, Left, Right, and Up'), 'the gate must remain bounded to two Idle frames across four directions');
check(EN_E03_STORM_CLAN_JARL_IDLE_GATE.identityContract.includes('bright-cyan clan sash') && EN_E03_STORM_CLAN_JARL_IDLE_GATE.identityContract.includes('not baked into actor pixels'), 'the elite identity and external-effect boundary must remain explicit');
check(EN_E03_STORM_CLAN_JARL_IDLE_GATE.animationContract.includes('slow 480 ms grounded command-stance cycle') && EN_E03_STORM_CLAN_JARL_IDLE_GATE.animationContract.includes('hands close inward'), 'the bounded two-frame elite motion contract must remain explicit');
check(EN_E03_STORM_CLAN_JARL_IDLE_GATE.exclusions.includes('baked lightning pixels') && EN_E03_STORM_CLAN_JARL_IDLE_GATE.exclusions.includes('baked storm arc pixels') && EN_E03_STORM_CLAN_JARL_IDLE_GATE.exclusions.includes('baked impact crack pixels') && EN_E03_STORM_CLAN_JARL_IDLE_GATE.exclusions.includes('Walk') && EN_E03_STORM_CLAN_JARL_IDLE_GATE.exclusions.includes('registration') && EN_E03_STORM_CLAN_JARL_IDLE_GATE.exclusions.includes('release'), 'the gate must exclude baked effects, later motion, integration, and release');
check(EN_E03_STORM_CLAN_JARL_IDLE_GATE.nextGate.includes('Visual approval is complete') && EN_E03_STORM_CLAN_JARL_IDLE_GATE.nextGate.includes('No later animation, variant, registration, integration, effect, release, or EN-E03 work is authorized'), 'the approved gate must stop before later work');

check(EN_E03_STORM_CLAN_JARL_IDLE_DATA.actor.outfit === 'plate' && EN_E03_STORM_CLAN_JARL_IDLE_DATA.actor.outfitTier === 'tier2', 'Storm-Clan Jarl must retain the armored plate actor base');
check(EN_E03_STORM_CLAN_JARL_IDLE_DATA.actor.weapon === 'none', 'the bounded Idle candidate must not add an unrelated held weapon');
check(EN_E03_STORM_CLAN_JARL_IDLE_DATA.effectBoundary === 'external-storm-arc-and-impact-crack' && EN_E03_STORM_CLAN_JARL_IDLE_DATA.bakedEffects.length === 0, 'storm arcs and impact cracks must remain external with zero baked effects');
check(JSON.stringify(EN_E03_STORM_CLAN_JARL_IDLE_DATA.clanBand) === JSON.stringify(['#71e3ef', '#178eac', '#b9fbff']), 'the bright cyan clan-band palette must remain frozen');
check(EN_E03_STORM_CLAN_JARL_IDLE_REGISTRY.families.length === 1, 'the elite candidate registry must contain exactly one family');
check(EN_E03_STORM_CLAN_JARL_IDLE_REGISTRY.publicFamilies.length === 0, 'the elite candidate registry must expose zero public families');
check(EN_E03_STORM_CLAN_JARL_IDLE_FAMILY.variants.length === 1 && EN_E03_STORM_CLAN_JARL_IDLE_FAMILY.variants[0].id === 'storm-clan-jarl', 'the candidate registry must contain only Storm-Clan Jarl');
check(engine.EN_E03_STORM_CLAN_JARL_IDLE_REGISTRY === undefined && engine.EN_E03_STORM_CLAN_JARL_IDLE_GATE === undefined, 'the elite candidate must not leak through the public engine facade');

check(await sha256File(EN_E03_STORM_CLAN_JARL_IDLE_GATE.artifact) === EN_E03_STORM_CLAN_JARL_IDLE_GATE.artifactSha256, 'the raw Storm-Clan Jarl review board must match its frozen candidate hash');
check(await sha256File(EN_E03_STORM_CLAN_JARL_IDLE_GATE.assembledArtifact) === EN_E03_STORM_CLAN_JARL_IDLE_GATE.assembledArtifactSha256, 'the Complete B + Form Storm-Clan Jarl review board must match its frozen candidate hash');
check(await sha256File(EN_E03_STORM_CLAN_JARL_IDLE_GATE.reviewAnimations.raw.artifact) === EN_E03_STORM_CLAN_JARL_IDLE_GATE.reviewAnimations.raw.sha256, 'the raw labeled Storm-Clan Jarl GIF must match its frozen candidate hash');
check(await sha256File(EN_E03_STORM_CLAN_JARL_IDLE_GATE.reviewAnimations.completeBForm.artifact) === EN_E03_STORM_CLAN_JARL_IDLE_GATE.reviewAnimations.completeBForm.sha256, 'the Complete B + Form labeled Storm-Clan Jarl GIF must match its frozen candidate hash');
for (const animation of Object.values(EN_E03_STORM_CLAN_JARL_IDLE_GATE.reviewAnimations)) {
  check(animation.width === 192 && animation.height === 224 && animation.frames === 2 && animation.durationMs === 480, 'each Storm-Clan Jarl GIF must retain the 192x224 two-frame 480 ms contract');
}

const hillRecords = captureApprovedRecords(EN_E03_GIANT_IDLE_REGISTRY, 'hill-breaker');
const hillDigest = createHash('sha256').update(JSON.stringify(hillRecords)).digest('hex');
check(hillDigest === EN_E03_GIANT_IDLE_GATE.candidateFrameDigest, 'all eight approved Hill Breaker Idle frames must remain byte-exact');

const boulderRecords = captureApprovedRecords(EN_E03_BOULDER_HURLER_IDLE_REGISTRY, 'boulder-hurler');
const boulderDigest = createHash('sha256').update(JSON.stringify(boulderRecords)).digest('hex');
check(boulderDigest === EN_E03_BOULDER_HURLER_IDLE_GATE.candidateFrameDigest, 'all eight approved Boulder Hurler Idle frames must remain byte-exact');

const candidateRecords = [];
const candidateFrames = new Map();
const clanColors = new Set(EN_E03_STORM_CLAN_JARL_IDLE_DATA.clanBand);
let clanBandPixels = 0;
let completeOutlinePixels = 0;
let formChangedPixels = 0;
for (const direction of engine.DIRS) for (let frame = 0; frame < 2; frame++) {
  const captured = captureEnemyExpansionFrame(
    EN_E03_STORM_CLAN_JARL_IDLE_REGISTRY,
    { kind: 'enemy', family: 'giant', variant: 'storm-clan-jarl' },
    direction,
    'idle',
    frame,
  );
  const hill = captureEnemyExpansionFrame(
    EN_E03_GIANT_IDLE_REGISTRY,
    { kind: 'enemy', family: 'giant', variant: 'hill-breaker' },
    direction,
    'idle',
    frame,
  );
  const boulder = captureEnemyExpansionFrame(
    EN_E03_BOULDER_HURLER_IDLE_REGISTRY,
    { kind: 'enemy', family: 'giant', variant: 'boulder-hurler' },
    direction,
    'idle',
    frame,
  );
  candidateRecords.push(frameRecord(captured, 'storm-clan-jarl', direction, frame));
  candidateFrames.set(direction + '/' + frame, captured);
  check(captured.outOfBoundsWrites.length === 0, direction + '/F' + (frame + 1) + ' must not write out of bounds');
  check(captured.alpha.every((value) => value === 0 || value === 255), direction + '/F' + (frame + 1) + ' must retain hard alpha');
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22, direction + '/F' + (frame + 1) + ' must retain a one-cell margin');
  check(connectedComponents(captured.pixels) === 1, direction + '/F' + (frame + 1) + ' must remain one connected silhouette');
  check(captured.opaquePixels >= 170 && captured.opaquePixels <= 220, direction + '/F' + (frame + 1) + ' must retain bounded Giant visual weight');
  check(captured.digest !== hill.digest, direction + '/F' + (frame + 1) + ' must remain visually distinct from Hill Breaker');
  check(captured.digest !== boulder.digest, direction + '/F' + (frame + 1) + ' must remain visually distinct from Boulder Hurler');
  check(captured.renderResult.stormClanJarlIdleGate === EN_E03_STORM_CLAN_JARL_IDLE_GATE.id, direction + '/F' + (frame + 1) + ' must report the elite gate');
  check(captured.renderResult.approvedPrecedingGate === EN_E03_BOULDER_HURLER_IDLE_GATE.id, direction + '/F' + (frame + 1) + ' must report the approved predecessor');
  check(captured.renderResult.effectBoundary === 'external-storm-arc-and-impact-crack', direction + '/F' + (frame + 1) + ' must report the external effect boundary');
  const frameClanBandPixels = captured.pixels.filter((color) => clanColors.has(color)).length;
  clanBandPixels += frameClanBandPixels;
  check(frameClanBandPixels >= 12, direction + '/F' + (frame + 1) + ' must retain a broad bright clan sash rather than a one-pixel effect mark');
  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E03_STORM_CLAN_JARL_IDLE_DATA);
  completeOutlinePixels += presentation.complete.filter((color, index) => color !== null && captured.pixels[index] === null).length;
  formChangedPixels += presentation.form.filter((color, index) => captured.pixels[index] !== null && color !== captured.pixels[index]).length;
}

for (const direction of engine.DIRS) {
  check(candidateFrames.get(direction + '/0').digest !== candidateFrames.get(direction + '/1').digest, direction + ' Idle F1 and F2 must remain distinct');
}
for (let frame = 0; frame < 2; frame++) {
  check(JSON.stringify(candidateFrames.get('left/' + frame).pixels) === JSON.stringify(mirrorPixels(candidateFrames.get('right/' + frame).pixels)), 'left/right F' + (frame + 1) + ' must remain exact mirrors');
  check(candidateFrames.get('down/' + frame).digest !== candidateFrames.get('up/' + frame).digest, 'Down/Up F' + (frame + 1) + ' must remain distinct');
}

const candidateDigest = createHash('sha256').update(JSON.stringify(candidateRecords)).digest('hex');
check(candidateDigest === EN_E03_STORM_CLAN_JARL_IDLE_GATE.candidateFrameDigest, 'the eight Storm-Clan Jarl Idle frames drifted from the review candidate');
check(completeOutlinePixels > 0, 'Complete B must add exterior outline pixels across the Storm-Clan Jarl review set');
check(formChangedPixels > 0, 'Form must shade source pixels across the Storm-Clan Jarl review set');

rejects(() => engine.renderEnemyExpansionFrame(EN_E03_STORM_CLAN_JARL_IDLE_REGISTRY, { kind: 'enemy', family: 'giant', variant: 'storm-clan-jarl' }, 'down', 'walk', 0, {}), 'authorizes only two Idle frames', 'Storm-Clan Jarl Walk rendering');
rejects(() => engine.renderEnemyExpansionFrame(EN_E03_STORM_CLAN_JARL_IDLE_REGISTRY, { kind: 'enemy', family: 'giant', variant: 'storm-clan-jarl' }, 'down', 'idle', 2, {}), 'Expansion frame 2 is invalid for idle', 'Storm-Clan Jarl Idle frame 3 rendering');
rejects(() => engine.renderEnemyExpansionFrame(EN_E03_STORM_CLAN_JARL_IDLE_REGISTRY, { kind: 'enemy', family: 'giant', variant: 'boulder-hurler' }, 'down', 'idle', 0, {}), 'is not implemented', 'Boulder Hurler rendering from the elite registry');
rejects(() => engine.renderEnemyExpansionFrame(EN_E03_STORM_CLAN_JARL_IDLE_REGISTRY, { kind: 'enemy', family: 'giant', variant: 'hill-breaker' }, 'down', 'idle', 0, {}), 'is not implemented', 'Hill Breaker rendering from the elite registry');
rejects(() => engine.renderEnemyExpansionFrame(EN_E03_STORM_CLAN_JARL_IDLE_REGISTRY, { kind: 'enemy', family: 'centaur', variant: 'sun-lancer' }, 'down', 'idle', 0, {}), 'is not implemented', 'Sun Lancer rendering from the elite registry');

if (errors.length) {
  console.error('EN-E03 Storm-Clan Jarl Idle validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E03 Storm-Clan Jarl Idle validation passed.');
console.log('- Approved Hill Breaker Idle frames preserved: ' + hillRecords.length + ' / 8');
console.log('- Approved Boulder Hurler Idle frames preserved: ' + boulderRecords.length + ' / 8');
console.log('- Storm-Clan Jarl Idle frames: ' + candidateRecords.length + ' / 8');
console.log('- Connected hard-alpha silhouettes: 8 / 8');
console.log('- Exact side mirrors: 4 / 4');
console.log('- Bright clan-sash pixels: ' + clanBandPixels);
console.log('- Complete B added pixels: ' + completeOutlinePixels);
console.log('- Form-shaded source pixels: ' + formChangedPixels);
console.log('- Baked storm/lightning/impact pixels: 0');
console.log('- Public EN-E03 families: 0');
console.log('- Candidate frame digest: ' + candidateDigest);
