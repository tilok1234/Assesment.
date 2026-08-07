import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import {
  EN_E03_CENTAUR_IDLE_GATE,
  EN_E03_CENTAUR_IDLE_REGISTRY,
} from '../engine/enemy-expansion-en-e03-centaur-idle.js';
import {
  EN_E03_STORM_CLAN_JARL_IDLE_GATE,
  EN_E03_STORM_CLAN_JARL_IDLE_REGISTRY,
} from '../engine/enemy-expansion-en-e03-giant-elite-idle.js';
import {
  EN_E03_SUN_LANCER_IDLE_DATA,
  EN_E03_SUN_LANCER_IDLE_FAMILY,
  EN_E03_SUN_LANCER_IDLE_GATE,
  EN_E03_SUN_LANCER_IDLE_REGISTRY,
} from '../engine/enemy-expansion-en-e03-centaur-specialist-idle.js';
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

function opaqueRunsAtRow(alpha, row) {
  let runs = 0;
  let inside = false;
  for (let x = 0; x < engine.SIZE; x++) {
    const opaque = alpha[(row * engine.SIZE) + x] === 255;
    if (opaque && !inside) runs++;
    inside = opaque;
  }
  return runs;
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

check(EN_E03_STORM_CLAN_JARL_IDLE_GATE.status === 'approved', 'the preceding Storm-Clan Jarl Idle gate must remain approved');
check(EN_E03_CENTAUR_IDLE_GATE.status === 'approved', 'the Steppe Hunter Centaur Idle baseline must remain approved');
check(EN_E03_SUN_LANCER_IDLE_GATE.status === 'approved', 'the Sun Lancer Idle gate must retain exact visual approval');
check(EN_E03_SUN_LANCER_IDLE_GATE.authorizedOn === '2026-08-07', 'the Sun Lancer Idle gate must retain its authorization date');
check(EN_E03_SUN_LANCER_IDLE_GATE.authorizationEvidence.includes('lets do next') && EN_E03_SUN_LANCER_IDLE_GATE.authorizationEvidence.includes('Sun Lancer specialist Idle F1-F2 across four directions'), 'the gate must retain the exact bounded continuation evidence');
check(EN_E03_SUN_LANCER_IDLE_GATE.approvedOn === '2026-08-07', 'the Sun Lancer Idle gate must retain its visual approval date');
check(EN_E03_SUN_LANCER_IDLE_GATE.approvalEvidence === 'Designer reviewed both exact labeled all-four-direction raw and Complete B + Form Sun Lancer Idle GIFs together and said: approved.', 'the gate must retain the exact paired-GIF approval evidence');
check(EN_E03_SUN_LANCER_IDLE_GATE.precedingApproval.gateId === EN_E03_STORM_CLAN_JARL_IDLE_GATE.id, 'the gate must identify the approved Storm-Clan Jarl predecessor');
check(EN_E03_SUN_LANCER_IDLE_GATE.precedingApproval.artifactSha256 === EN_E03_STORM_CLAN_JARL_IDLE_GATE.artifactSha256, 'the preceding raw Storm-Clan Jarl board hash must remain frozen');
check(EN_E03_SUN_LANCER_IDLE_GATE.precedingApproval.assembledArtifactSha256 === EN_E03_STORM_CLAN_JARL_IDLE_GATE.assembledArtifactSha256, 'the preceding Complete B + Form Storm-Clan Jarl board hash must remain frozen');
check(EN_E03_SUN_LANCER_IDLE_GATE.precedingApproval.rawAnimationSha256 === EN_E03_STORM_CLAN_JARL_IDLE_GATE.reviewAnimations.raw.sha256, 'the preceding raw Storm-Clan Jarl GIF hash must remain frozen');
check(EN_E03_SUN_LANCER_IDLE_GATE.precedingApproval.completeBFormAnimationSha256 === EN_E03_STORM_CLAN_JARL_IDLE_GATE.reviewAnimations.completeBForm.sha256, 'the preceding Complete B + Form Storm-Clan Jarl GIF hash must remain frozen');
check(EN_E03_SUN_LANCER_IDLE_GATE.precedingApproval.candidateFrameDigest === EN_E03_STORM_CLAN_JARL_IDLE_GATE.candidateFrameDigest, 'the preceding Storm-Clan Jarl frame digest must remain frozen');
check(EN_E03_SUN_LANCER_IDLE_GATE.approvedCentaurBaseline.gateId === EN_E03_CENTAUR_IDLE_GATE.id, 'the gate must identify the approved Steppe Hunter baseline');
check(EN_E03_SUN_LANCER_IDLE_GATE.approvedCentaurBaseline.artifactSha256 === EN_E03_CENTAUR_IDLE_GATE.artifactSha256, 'the approved raw Steppe Hunter board hash must remain frozen');
check(EN_E03_SUN_LANCER_IDLE_GATE.approvedCentaurBaseline.assembledArtifactSha256 === EN_E03_CENTAUR_IDLE_GATE.assembledArtifactSha256, 'the approved Complete B + Form Steppe Hunter board hash must remain frozen');
check(EN_E03_SUN_LANCER_IDLE_GATE.approvedCentaurBaseline.candidateFrameDigest === EN_E03_CENTAUR_IDLE_GATE.candidateFrameDigest, 'the approved Steppe Hunter frame digest must remain frozen');
check(EN_E03_SUN_LANCER_IDLE_GATE.scope.includes('Idle F1-F2 only') && EN_E03_SUN_LANCER_IDLE_GATE.scope.includes('Down, Left, Right, and Up'), 'the gate must remain bounded to two Idle frames across four directions');
check(EN_E03_SUN_LANCER_IDLE_GATE.identityContract.includes('bright direction-aware lance pennant') && EN_E03_SUN_LANCER_IDLE_GATE.identityContract.includes('not baked into actor pixels'), 'the specialist identity and external-effect boundary must remain explicit');
check(EN_E03_SUN_LANCER_IDLE_GATE.animationContract.includes('slow 480 ms planted cavalry Idle cycle') && EN_E03_SUN_LANCER_IDLE_GATE.animationContract.includes('four hoof contacts remain fixed'), 'the bounded planted two-frame motion contract must remain explicit');
check(EN_E03_SUN_LANCER_IDLE_GATE.exclusions.includes('Banner Khan') && EN_E03_SUN_LANCER_IDLE_GATE.exclusions.includes('baked charge dust pixels') && EN_E03_SUN_LANCER_IDLE_GATE.exclusions.includes('baked spear trail pixels') && EN_E03_SUN_LANCER_IDLE_GATE.exclusions.includes('Walk') && EN_E03_SUN_LANCER_IDLE_GATE.exclusions.includes('registration') && EN_E03_SUN_LANCER_IDLE_GATE.exclusions.includes('release'), 'the gate must exclude other variants, baked effects, later motion, integration, and release');
check(EN_E03_SUN_LANCER_IDLE_GATE.nextGate.includes('Visual approval is complete') && EN_E03_SUN_LANCER_IDLE_GATE.nextGate.includes('No later animation, variant, registration, integration, effect, release, or EN-E03 work is authorized'), 'the approved gate must stop before later work');

check(EN_E03_SUN_LANCER_IDLE_DATA.actor.outfit === 'plate' && EN_E03_SUN_LANCER_IDLE_DATA.actor.outfitTier === 'tier2', 'Sun Lancer must retain the sun-armored rider data');
check(EN_E03_SUN_LANCER_IDLE_DATA.actor.weapon === 'none', 'the inherited upright lance must remain chassis equipment rather than a second player weapon');
check(EN_E03_SUN_LANCER_IDLE_DATA.effectBoundary === 'external-charge-dust-spear-trail-and-hoof-shock-ring' && EN_E03_SUN_LANCER_IDLE_DATA.bakedEffects.length === 0, 'charge dust, spear trails, and hoof shock rings must remain external with zero baked effects');
check(EN_E03_SUN_LANCER_IDLE_REGISTRY.families.length === 1, 'the specialist candidate registry must contain exactly one family');
check(EN_E03_SUN_LANCER_IDLE_REGISTRY.publicFamilies.length === 0, 'the specialist candidate registry must expose zero public families');
check(EN_E03_SUN_LANCER_IDLE_FAMILY.variants.length === 1 && EN_E03_SUN_LANCER_IDLE_FAMILY.variants[0].id === 'sun-lancer', 'the candidate registry must contain only Sun Lancer');
check(engine.EN_E03_SUN_LANCER_IDLE_REGISTRY === undefined && engine.EN_E03_SUN_LANCER_IDLE_GATE === undefined, 'the specialist candidate must not leak through the public engine facade');

check(await sha256File(EN_E03_SUN_LANCER_IDLE_GATE.artifact) === EN_E03_SUN_LANCER_IDLE_GATE.artifactSha256, 'the raw Sun Lancer review board must match its frozen candidate hash');
check(await sha256File(EN_E03_SUN_LANCER_IDLE_GATE.assembledArtifact) === EN_E03_SUN_LANCER_IDLE_GATE.assembledArtifactSha256, 'the Complete B + Form Sun Lancer review board must match its frozen candidate hash');
check(await sha256File(EN_E03_SUN_LANCER_IDLE_GATE.reviewAnimations.raw.artifact) === EN_E03_SUN_LANCER_IDLE_GATE.reviewAnimations.raw.sha256, 'the raw labeled Sun Lancer GIF must match its frozen candidate hash');
check(await sha256File(EN_E03_SUN_LANCER_IDLE_GATE.reviewAnimations.completeBForm.artifact) === EN_E03_SUN_LANCER_IDLE_GATE.reviewAnimations.completeBForm.sha256, 'the Complete B + Form labeled Sun Lancer GIF must match its frozen candidate hash');
for (const animation of Object.values(EN_E03_SUN_LANCER_IDLE_GATE.reviewAnimations)) {
  check(animation.width === 192 && animation.height === 224 && animation.frames === 2 && animation.durationMs === 480, 'each Sun Lancer GIF must retain the 192x224 two-frame 480 ms contract');
}

const steppeRecords = captureRecords(EN_E03_CENTAUR_IDLE_REGISTRY, 'centaur', 'steppe-hunter');
const steppeDigest = createHash('sha256').update(JSON.stringify(steppeRecords)).digest('hex');
check(steppeDigest === EN_E03_CENTAUR_IDLE_GATE.candidateFrameDigest, 'all eight approved Steppe Hunter Idle frames must remain byte-exact');

const stormRecords = captureRecords(EN_E03_STORM_CLAN_JARL_IDLE_REGISTRY, 'giant', 'storm-clan-jarl');
const stormDigest = createHash('sha256').update(JSON.stringify(stormRecords)).digest('hex');
check(stormDigest === EN_E03_STORM_CLAN_JARL_IDLE_GATE.candidateFrameDigest, 'all eight approved Storm-Clan Jarl Idle frames must remain byte-exact');

const candidateRecords = [];
const candidateFrames = new Map();
const pennantColors = new Set(EN_E03_SUN_LANCER_IDLE_DATA.specialist.pennant);
const armorColors = new Set(EN_E03_SUN_LANCER_IDLE_DATA.specialist.armor);
const clothColors = new Set(EN_E03_SUN_LANCER_IDLE_DATA.specialist.cloth);
let pennantPixels = 0;
let armorPixels = 0;
let clothPixels = 0;
let completeOutlinePixels = 0;
let formChangedPixels = 0;
for (const direction of engine.DIRS) for (let frame = 0; frame < 2; frame++) {
  const captured = captureEnemyExpansionFrame(
    EN_E03_SUN_LANCER_IDLE_REGISTRY,
    { kind: 'enemy', family: 'centaur', variant: 'sun-lancer' },
    direction,
    'idle',
    frame,
  );
  const steppe = captureEnemyExpansionFrame(
    EN_E03_CENTAUR_IDLE_REGISTRY,
    { kind: 'enemy', family: 'centaur', variant: 'steppe-hunter' },
    direction,
    'idle',
    frame,
  );
  candidateRecords.push(frameRecord(captured, 'centaur', 'sun-lancer', direction, frame));
  candidateFrames.set(direction + '/' + frame, captured);
  check(captured.outOfBoundsWrites.length === 0, direction + '/F' + (frame + 1) + ' must not write out of bounds');
  check(captured.alpha.every((value) => value === 0 || value === 255), direction + '/F' + (frame + 1) + ' must retain hard alpha');
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22, direction + '/F' + (frame + 1) + ' must retain a one-cell margin');
  check(connectedComponents(captured.pixels) === 1, direction + '/F' + (frame + 1) + ' must remain one connected rider-horse-lance silhouette');
  check(captured.opaquePixels >= 200 && captured.opaquePixels <= 260, direction + '/F' + (frame + 1) + ' must retain bounded Centaur visual weight');
  check(opaqueRunsAtRow(captured.alpha, 22) === 4, direction + '/F' + (frame + 1) + ' must retain four separated hoof contacts');
  check(captured.digest !== steppe.digest, direction + '/F' + (frame + 1) + ' must remain visually distinct from Steppe Hunter');
  check(JSON.stringify(captured.pixels.slice(17 * engine.SIZE)) === JSON.stringify(steppe.pixels.slice(17 * engine.SIZE)), direction + '/F' + (frame + 1) + ' must preserve the approved lower horse and all four hoof contacts byte-exact');
  check(captured.renderResult.sunLancerIdleGate === EN_E03_SUN_LANCER_IDLE_GATE.id, direction + '/F' + (frame + 1) + ' must report the specialist gate');
  check(captured.renderResult.approvedPrecedingGate === EN_E03_STORM_CLAN_JARL_IDLE_GATE.id, direction + '/F' + (frame + 1) + ' must report the approved predecessor');
  check(captured.renderResult.approvedCentaurBaselineGate === EN_E03_CENTAUR_IDLE_GATE.id, direction + '/F' + (frame + 1) + ' must report the approved Centaur baseline');
  check(captured.renderResult.effectBoundary === 'external-charge-dust-spear-trail-and-hoof-shock-ring', direction + '/F' + (frame + 1) + ' must report the external effect boundary');
  const framePennantPixels = captured.pixels.filter((color) => pennantColors.has(color)).length;
  const frameArmorPixels = captured.pixels.filter((color) => armorColors.has(color)).length;
  const frameClothPixels = captured.pixels.filter((color) => clothColors.has(color)).length;
  pennantPixels += framePennantPixels;
  armorPixels += frameArmorPixels;
  clothPixels += frameClothPixels;
  check(framePennantPixels >= 4, direction + '/F' + (frame + 1) + ' must retain a readable bright lance pennant');
  check(frameArmorPixels >= 25, direction + '/F' + (frame + 1) + ' must retain the sun-gold armored rider identity');
  check(frameClothPixels >= 12, direction + '/F' + (frame + 1) + ' must retain the red-gold saddle-cloth identity');
  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E03_SUN_LANCER_IDLE_DATA);
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
check(candidateDigest === EN_E03_SUN_LANCER_IDLE_GATE.candidateFrameDigest, 'the eight Sun Lancer Idle frames drifted from the review candidate');
check(completeOutlinePixels > 0, 'Complete B must add exterior outline pixels across the Sun Lancer review set');
check(formChangedPixels > 0, 'Form must shade source pixels across the Sun Lancer review set');

rejects(() => engine.renderEnemyExpansionFrame(EN_E03_SUN_LANCER_IDLE_REGISTRY, { kind: 'enemy', family: 'centaur', variant: 'sun-lancer' }, 'down', 'walk', 0, {}), 'authorizes only two Idle frames', 'Sun Lancer Walk rendering');
rejects(() => engine.renderEnemyExpansionFrame(EN_E03_SUN_LANCER_IDLE_REGISTRY, { kind: 'enemy', family: 'centaur', variant: 'sun-lancer' }, 'down', 'idle', 2, {}), 'Expansion frame 2 is invalid for idle', 'Sun Lancer Idle frame 3 rendering');
rejects(() => engine.renderEnemyExpansionFrame(EN_E03_SUN_LANCER_IDLE_REGISTRY, { kind: 'enemy', family: 'centaur', variant: 'steppe-hunter' }, 'down', 'idle', 0, {}), 'is not implemented', 'Steppe Hunter rendering from the specialist registry');
rejects(() => engine.renderEnemyExpansionFrame(EN_E03_SUN_LANCER_IDLE_REGISTRY, { kind: 'enemy', family: 'centaur', variant: 'banner-khan' }, 'down', 'idle', 0, {}), 'is not implemented', 'Banner Khan rendering');
rejects(() => engine.renderEnemyExpansionFrame(EN_E03_SUN_LANCER_IDLE_REGISTRY, { kind: 'enemy', family: 'giant', variant: 'storm-clan-jarl' }, 'down', 'idle', 0, {}), 'is not implemented', 'Storm-Clan Jarl rendering from the specialist registry');

if (errors.length) {
  console.error('EN-E03 Sun Lancer Idle validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E03 Sun Lancer Idle validation passed.');
console.log('- Approved Steppe Hunter Idle frames preserved: ' + steppeRecords.length + ' / 8');
console.log('- Approved Storm-Clan Jarl Idle frames preserved: ' + stormRecords.length + ' / 8');
console.log('- Sun Lancer Idle frames: ' + candidateRecords.length + ' / 8');
console.log('- Connected hard-alpha Centaur silhouettes: 8 / 8');
console.log('- Four-hoof contact rows: 8 / 8');
console.log('- Exact side mirrors: 4 / 4');
console.log('- Bright pennant pixels: ' + pennantPixels);
console.log('- Sun-gold armor pixels: ' + armorPixels);
console.log('- Red-gold cloth pixels: ' + clothPixels);
console.log('- Complete B added pixels: ' + completeOutlinePixels);
console.log('- Form-shaded source pixels: ' + formChangedPixels);
console.log('- Baked charge/trail/shock pixels: 0');
console.log('- Public EN-E03 families: 0');
console.log('- Candidate frame digest: ' + candidateDigest);
