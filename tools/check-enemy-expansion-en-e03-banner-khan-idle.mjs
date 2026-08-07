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
  EN_E03_SUN_LANCER_IDLE_GATE,
  EN_E03_SUN_LANCER_IDLE_REGISTRY,
} from '../engine/enemy-expansion-en-e03-centaur-specialist-idle.js';
import {
  EN_E03_BANNER_KHAN_IDLE_DATA,
  EN_E03_BANNER_KHAN_IDLE_FAMILY,
  EN_E03_BANNER_KHAN_IDLE_GATE,
  EN_E03_BANNER_KHAN_IDLE_REGISTRY,
} from '../engine/enemy-expansion-en-e03-centaur-elite-idle.js';
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
  const visited = new Set();
  let components = 0;
  for (let index = 0; index < pixels.length; index++) {
    if (pixels[index] === null || visited.has(index)) continue;
    components++;
    const queue = [index];
    visited.add(index);
    while (queue.length) {
      const current = queue.pop();
      const x = current % engine.SIZE;
      const y = Math.floor(current / engine.SIZE);
      for (const [nextX, nextY] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
        if (nextX < 0 || nextY < 0 || nextX >= engine.SIZE || nextY >= engine.SIZE) continue;
        const next = (nextY * engine.SIZE) + nextX;
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

check(EN_E03_CENTAUR_IDLE_GATE.status === 'approved', 'the Steppe Hunter Centaur Idle baseline must remain approved');
check(EN_E03_SUN_LANCER_IDLE_GATE.status === 'approved', 'the preceding Sun Lancer Idle gate must remain approved');
check(EN_E03_BANNER_KHAN_IDLE_GATE.status === 'approved', 'the Banner Khan Idle gate must retain exact visual approval');
check(EN_E03_BANNER_KHAN_IDLE_GATE.authorizedOn === '2026-08-07', 'the Banner Khan Idle gate must retain its authorization date');
check(EN_E03_BANNER_KHAN_IDLE_GATE.authorizationEvidence.includes('lets do next') && EN_E03_BANNER_KHAN_IDLE_GATE.authorizationEvidence.includes('Banner Khan elite Idle F1-F2 across four directions'), 'the gate must retain the exact bounded continuation evidence');
check(EN_E03_BANNER_KHAN_IDLE_GATE.approvedOn === '2026-08-07', 'the Banner Khan Idle gate must retain its visual approval date');
check(EN_E03_BANNER_KHAN_IDLE_GATE.approvalEvidence === 'Designer reviewed both exact labeled all-four-direction raw and Complete B + Form Banner Khan Idle r3 GIFs together and said: approved.', 'the gate must retain the exact paired-GIF r3 approval evidence');
check(EN_E03_BANNER_KHAN_IDLE_GATE.revisionEvidence.includes('targeted repair still had too much wrong') && EN_E03_BANNER_KHAN_IDLE_GATE.revisionEvidence.includes('from-scratch rebuild') && EN_E03_BANNER_KHAN_IDLE_GATE.revisionEvidence.includes('delegates only the approved Steppe Hunter chassis'), 'the gate must retain both rejected attempts and the from-scratch rebuild evidence');
check(EN_E03_BANNER_KHAN_IDLE_GATE.revisionEvidence.includes('side-frame face was bad because it was just straight lines') && EN_E03_BANNER_KHAN_IDLE_GATE.revisionEvidence.includes('stepped forehead, protruding nose, visible eye, cheek, and tapered jaw'), 'the gate must retain the exact side-face critique and bounded profile repair evidence');
check(EN_E03_BANNER_KHAN_IDLE_GATE.revisionEvidence.includes('mouth was too long in the side frames') && EN_E03_BANNER_KHAN_IDLE_GATE.revisionEvidence.includes('reduces the mouth to one front pixel'), 'the gate must retain the exact side-mouth critique and one-pixel repair evidence');
check(EN_E03_BANNER_KHAN_IDLE_GATE.revisionEvidence.includes('pale horizontal side-profile streak') && EN_E03_BANNER_KHAN_IDLE_GATE.revisionEvidence.includes('compact stepped two-tone collar'), 'the gate must retain the exact pale-streak critique and bounded side-collar repair evidence');
check(EN_E03_BANNER_KHAN_IDLE_GATE.revisionEvidence.includes('requested horse-body motion') && EN_E03_BANNER_KHAN_IDLE_GATE.revisionEvidence.includes('planted torso weight shift') && EN_E03_BANNER_KHAN_IDLE_GATE.revisionEvidence.includes('every leg and hoof pixel remains delegated byte-exact'), 'the gate must retain the exact horse-body-motion request and planted lower-chassis preservation evidence');
check(EN_E03_BANNER_KHAN_IDLE_GATE.precedingApproval.gateId === EN_E03_SUN_LANCER_IDLE_GATE.id, 'the gate must identify the approved Sun Lancer predecessor');
check(EN_E03_BANNER_KHAN_IDLE_GATE.precedingApproval.artifactSha256 === EN_E03_SUN_LANCER_IDLE_GATE.artifactSha256, 'the preceding raw Sun Lancer board hash must remain frozen');
check(EN_E03_BANNER_KHAN_IDLE_GATE.precedingApproval.assembledArtifactSha256 === EN_E03_SUN_LANCER_IDLE_GATE.assembledArtifactSha256, 'the preceding Complete B + Form Sun Lancer board hash must remain frozen');
check(EN_E03_BANNER_KHAN_IDLE_GATE.precedingApproval.rawAnimationSha256 === EN_E03_SUN_LANCER_IDLE_GATE.reviewAnimations.raw.sha256, 'the preceding raw Sun Lancer GIF hash must remain frozen');
check(EN_E03_BANNER_KHAN_IDLE_GATE.precedingApproval.completeBFormAnimationSha256 === EN_E03_SUN_LANCER_IDLE_GATE.reviewAnimations.completeBForm.sha256, 'the preceding Complete B + Form Sun Lancer GIF hash must remain frozen');
check(EN_E03_BANNER_KHAN_IDLE_GATE.precedingApproval.candidateFrameDigest === EN_E03_SUN_LANCER_IDLE_GATE.candidateFrameDigest, 'the preceding Sun Lancer frame digest must remain frozen');
check(EN_E03_BANNER_KHAN_IDLE_GATE.approvedCentaurBaseline.gateId === EN_E03_CENTAUR_IDLE_GATE.id, 'the gate must identify the approved Steppe Hunter baseline');
check(EN_E03_BANNER_KHAN_IDLE_GATE.approvedCentaurBaseline.artifactSha256 === EN_E03_CENTAUR_IDLE_GATE.artifactSha256, 'the approved raw Steppe Hunter board hash must remain frozen');
check(EN_E03_BANNER_KHAN_IDLE_GATE.approvedCentaurBaseline.assembledArtifactSha256 === EN_E03_CENTAUR_IDLE_GATE.assembledArtifactSha256, 'the approved Complete B + Form Steppe Hunter board hash must remain frozen');
check(EN_E03_BANNER_KHAN_IDLE_GATE.approvedCentaurBaseline.candidateFrameDigest === EN_E03_CENTAUR_IDLE_GATE.candidateFrameDigest, 'the approved Steppe Hunter frame digest must remain frozen');
check(EN_E03_BANNER_KHAN_IDLE_GATE.scope.includes('Idle F1-F2 only') && EN_E03_BANNER_KHAN_IDLE_GATE.scope.includes('Down, Left, Right, and Up'), 'the gate must remain bounded to two Idle frames across four directions');
check(EN_E03_BANNER_KHAN_IDLE_GATE.identityContract.includes('compact conical steel helm') && EN_E03_BANNER_KHAN_IDLE_GATE.identityContract.includes('segmented blue-steel lamellar armor') && EN_E03_BANNER_KHAN_IDLE_GATE.identityContract.includes('separated direction-aware tapered war standard') && EN_E03_BANNER_KHAN_IDLE_GATE.identityContract.includes('not baked into actor pixels'), 'the rebuilt elite identity and external-effect boundary must remain explicit');
check(EN_E03_BANNER_KHAN_IDLE_GATE.animationContract.includes('slow 480 ms planted warlord Idle cycle') && EN_E03_BANNER_KHAN_IDLE_GATE.animationContract.includes('horse-torso weight shift') && EN_E03_BANNER_KHAN_IDLE_GATE.animationContract.includes('every leg and all four hoof contacts remain fixed'), 'the bounded planted two-frame horse-motion contract must remain explicit');
check(EN_E03_BANNER_KHAN_IDLE_GATE.exclusions.includes('Sun Lancer changes') && EN_E03_BANNER_KHAN_IDLE_GATE.exclusions.includes('baked command aura pixels') && EN_E03_BANNER_KHAN_IDLE_GATE.exclusions.includes('baked banner flare pixels') && EN_E03_BANNER_KHAN_IDLE_GATE.exclusions.includes('Walk') && EN_E03_BANNER_KHAN_IDLE_GATE.exclusions.includes('registration') && EN_E03_BANNER_KHAN_IDLE_GATE.exclusions.includes('release'), 'the gate must exclude approved-baseline changes, baked effects, later motion, integration, and release');
check(EN_E03_BANNER_KHAN_IDLE_GATE.nextGate.includes('Visual approval is complete') && EN_E03_BANNER_KHAN_IDLE_GATE.nextGate.includes('No later animation, variant, registration, integration, effect, release, or EN-E03 work is authorized'), 'the approved gate must stop before later work');

check(EN_E03_BANNER_KHAN_IDLE_DATA.actor.outfit === 'plate' && EN_E03_BANNER_KHAN_IDLE_DATA.actor.outfitTier === 'tier2', 'Banner Khan must retain the command-armored rider data');
check(EN_E03_BANNER_KHAN_IDLE_DATA.actor.weapon === 'none', 'the inherited upright lance and banner must remain chassis equipment rather than a second player weapon');
check(EN_E03_BANNER_KHAN_IDLE_DATA.effectBoundary === 'external-command-aura-banner-flare-and-hoof-shock-ring' && EN_E03_BANNER_KHAN_IDLE_DATA.bakedEffects.length === 0, 'command aura, banner flare, and hoof shock rings must remain external with zero baked effects');
check(EN_E03_BANNER_KHAN_IDLE_REGISTRY.families.length === 1, 'the elite candidate registry must contain exactly one family');
check(EN_E03_BANNER_KHAN_IDLE_REGISTRY.publicFamilies.length === 0, 'the elite candidate registry must expose zero public families');
check(EN_E03_BANNER_KHAN_IDLE_FAMILY.variants.length === 1 && EN_E03_BANNER_KHAN_IDLE_FAMILY.variants[0].id === 'banner-khan', 'the candidate registry must contain only Banner Khan');
check(engine.EN_E03_BANNER_KHAN_IDLE_REGISTRY === undefined && engine.EN_E03_BANNER_KHAN_IDLE_GATE === undefined, 'the elite candidate must not leak through the public engine facade');

check(await sha256File(EN_E03_BANNER_KHAN_IDLE_GATE.artifact) === EN_E03_BANNER_KHAN_IDLE_GATE.artifactSha256, 'the raw Banner Khan review board must match its frozen candidate hash');
check(await sha256File(EN_E03_BANNER_KHAN_IDLE_GATE.assembledArtifact) === EN_E03_BANNER_KHAN_IDLE_GATE.assembledArtifactSha256, 'the Complete B + Form Banner Khan review board must match its frozen candidate hash');
check(await sha256File(EN_E03_BANNER_KHAN_IDLE_GATE.reviewAnimations.raw.artifact) === EN_E03_BANNER_KHAN_IDLE_GATE.reviewAnimations.raw.sha256, 'the raw labeled Banner Khan GIF must match its frozen candidate hash');
check(await sha256File(EN_E03_BANNER_KHAN_IDLE_GATE.reviewAnimations.completeBForm.artifact) === EN_E03_BANNER_KHAN_IDLE_GATE.reviewAnimations.completeBForm.sha256, 'the Complete B + Form labeled Banner Khan GIF must match its frozen candidate hash');
for (const animation of Object.values(EN_E03_BANNER_KHAN_IDLE_GATE.reviewAnimations)) {
  check(animation.width === 192 && animation.height === 224 && animation.frames === 2 && animation.durationMs === 480, 'each Banner Khan GIF must retain the 192x224 two-frame 480 ms contract');
}

const steppeRecords = captureRecords(EN_E03_CENTAUR_IDLE_REGISTRY, 'centaur', 'steppe-hunter');
const steppeDigest = createHash('sha256').update(JSON.stringify(steppeRecords)).digest('hex');
check(steppeDigest === EN_E03_CENTAUR_IDLE_GATE.candidateFrameDigest, 'all eight approved Steppe Hunter Idle frames must remain byte-exact');

const sunRecords = captureRecords(EN_E03_SUN_LANCER_IDLE_REGISTRY, 'centaur', 'sun-lancer');
const sunDigest = createHash('sha256').update(JSON.stringify(sunRecords)).digest('hex');
check(sunDigest === EN_E03_SUN_LANCER_IDLE_GATE.candidateFrameDigest, 'all eight approved Sun Lancer Idle frames must remain byte-exact');

const candidateRecords = [];
const candidateFrames = new Map();
const bannerColors = new Set(EN_E03_BANNER_KHAN_IDLE_DATA.elite.banner);
const armorColors = new Set(EN_E03_BANNER_KHAN_IDLE_DATA.elite.armor);
const clothColors = new Set(EN_E03_BANNER_KHAN_IDLE_DATA.elite.cloth);
const trimColors = new Set(EN_E03_BANNER_KHAN_IDLE_DATA.elite.trim);
const furColors = new Set(EN_E03_BANNER_KHAN_IDLE_DATA.elite.fur);
let bannerPixels = 0;
let armorPixels = 0;
let clothPixels = 0;
let trimPixels = 0;
let furPixels = 0;
let completeOutlinePixels = 0;
let formChangedPixels = 0;
for (const direction of engine.DIRS) for (let frame = 0; frame < 2; frame++) {
  const captured = captureEnemyExpansionFrame(
    EN_E03_BANNER_KHAN_IDLE_REGISTRY,
    { kind: 'enemy', family: 'centaur', variant: 'banner-khan' },
    direction,
    'idle',
    frame,
  );
  const sun = captureEnemyExpansionFrame(
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
  candidateRecords.push(frameRecord(captured, 'centaur', 'banner-khan', direction, frame));
  candidateFrames.set(direction + '/' + frame, captured);
  check(captured.outOfBoundsWrites.length === 0, direction + '/F' + (frame + 1) + ' must not write out of bounds');
  check(captured.alpha.every((value) => value === 0 || value === 255), direction + '/F' + (frame + 1) + ' must retain hard alpha');
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22, direction + '/F' + (frame + 1) + ' must retain a one-cell margin');
  check(connectedComponents(captured.pixels) === 1, direction + '/F' + (frame + 1) + ' must remain one connected rider-horse-banner silhouette');
  check(captured.opaquePixels >= 205 && captured.opaquePixels <= 285, direction + '/F' + (frame + 1) + ' must retain bounded elite Centaur visual weight without rebuilding the rejected blocky mass');
  check(opaqueRunsAtRow(captured.alpha, 22) === 4, direction + '/F' + (frame + 1) + ' must retain four separated hoof contacts');
  check(captured.digest !== sun.digest && captured.digest !== steppe.digest, direction + '/F' + (frame + 1) + ' must remain visually distinct from both approved Centaur baselines');
  check(JSON.stringify(captured.pixels.slice(17 * engine.SIZE)) === JSON.stringify(steppe.pixels.slice(17 * engine.SIZE)), direction + '/F' + (frame + 1) + ' must preserve the approved lower horse and all four hoof contacts byte-exact');
  check(captured.renderResult.bannerKhanIdleGate === EN_E03_BANNER_KHAN_IDLE_GATE.id, direction + '/F' + (frame + 1) + ' must report the elite gate');
  check(captured.renderResult.sunLancerIdleGate === undefined, direction + '/F' + (frame + 1) + ' must not inherit the discarded Sun Lancer overlay renderer');
  check(captured.renderResult.approvedPrecedingGate === EN_E03_SUN_LANCER_IDLE_GATE.id, direction + '/F' + (frame + 1) + ' must report the approved predecessor');
  check(captured.renderResult.approvedCentaurBaselineGate === EN_E03_CENTAUR_IDLE_GATE.id, direction + '/F' + (frame + 1) + ' must report the approved Centaur baseline');
  check(captured.renderResult.horseMotion === 'banner-khan-planted-torso-weight-shift', direction + '/F' + (frame + 1) + ' must report the bounded planted horse-torso motion contract');
  check(captured.renderResult.effectBoundary === 'external-command-aura-banner-flare-and-hoof-shock-ring', direction + '/F' + (frame + 1) + ' must report the external effect boundary');
  const frameBannerPixels = captured.pixels.filter((color) => bannerColors.has(color)).length;
  const frameArmorPixels = captured.pixels.filter((color) => armorColors.has(color)).length;
  const frameClothPixels = captured.pixels.filter((color) => clothColors.has(color)).length;
  const frameTrimPixels = captured.pixels.filter((color) => trimColors.has(color)).length;
  const frameFurPixels = captured.pixels.filter((color) => furColors.has(color)).length;
  bannerPixels += frameBannerPixels;
  armorPixels += frameArmorPixels;
  clothPixels += frameClothPixels;
  trimPixels += frameTrimPixels;
  furPixels += frameFurPixels;
  check(frameBannerPixels >= 8, direction + '/F' + (frame + 1) + ' must retain a readable tapered crimson war standard');
  check(frameArmorPixels >= 25, direction + '/F' + (frame + 1) + ' must retain the segmented blue-steel lamellar identity');
  check(frameClothPixels >= 12, direction + '/F' + (frame + 1) + ' must retain the limited crimson sash and saddle-drape identity');
  check(frameTrimPixels >= 4, direction + '/F' + (frame + 1) + ' must retain controlled bronze command trim');
  check(frameFurPixels >= 4, direction + '/F' + (frame + 1) + ' must retain the compact collar separation');
  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E03_BANNER_KHAN_IDLE_DATA);
  completeOutlinePixels += presentation.complete.filter((color, index) => color !== null && captured.pixels[index] === null).length;
  formChangedPixels += presentation.form.filter((color, index) => captured.pixels[index] !== null && color !== captured.pixels[index]).length;
}

for (const direction of engine.DIRS) {
  check(candidateFrames.get(direction + '/0').digest !== candidateFrames.get(direction + '/1').digest, direction + ' Idle F1 and F2 must remain distinct');
}
for (let frame = 0; frame < 2; frame++) {
  check(JSON.stringify(candidateFrames.get('left/' + frame).pixels) === JSON.stringify(mirrorPixels(candidateFrames.get('right/' + frame).pixels)), 'left/right F' + (frame + 1) + ' must remain exact mirrors');
  check(candidateFrames.get('down/' + frame).digest !== candidateFrames.get('up/' + frame).digest, 'Down/Up F' + (frame + 1) + ' must remain distinct');
  const sidePixels = candidateFrames.get('right/' + frame).pixels;
  const sideRow = 6 + frame;
  const pixelAt = (x, y) => sidePixels[(y * engine.SIZE) + x];
  check(pixelAt(17, sideRow) === EN_E03_BANNER_KHAN_IDLE_DATA.actor.palette.skin[0], 'right/F' + (frame + 1) + ' must retain the protruding profile nose');
  check(pixelAt(17, sideRow - 1) === null && pixelAt(17, sideRow + 1) === null, 'right/F' + (frame + 1) + ' nose must break the former straight facial band');
  check(pixelAt(16, sideRow) === EN_E03_BANNER_KHAN_IDLE_DATA.actor.palette.hair[1], 'right/F' + (frame + 1) + ' must retain a visible profile eye');
  check(pixelAt(14, sideRow + 1) === EN_E03_BANNER_KHAN_IDLE_DATA.actor.palette.skin[1] && pixelAt(15, sideRow + 1) === EN_E03_BANNER_KHAN_IDLE_DATA.actor.palette.skin[0], 'right/F' + (frame + 1) + ' must retain the separated shaded cheek and tapered jaw');
  check(pixelAt(16, sideRow + 1) === EN_E03_BANNER_KHAN_IDLE_DATA.actor.palette.hair[1], 'right/F' + (frame + 1) + ' must retain exactly one front mouth pixel');
  check(pixelAt(12, sideRow + 2) === EN_E03_BANNER_KHAN_IDLE_DATA.elite.fur[1] && pixelAt(13, sideRow + 2) === EN_E03_BANNER_KHAN_IDLE_DATA.elite.fur[0] && pixelAt(14, sideRow + 2) === EN_E03_BANNER_KHAN_IDLE_DATA.elite.fur[0] && pixelAt(15, sideRow + 2) === EN_E03_BANNER_KHAN_IDLE_DATA.elite.fur[1], 'right/F' + (frame + 1) + ' must replace the pale horizontal streak with a two-tone four-pixel collar crown');
  check(pixelAt(11, sideRow + 3) === EN_E03_BANNER_KHAN_IDLE_DATA.elite.fur[1] && pixelAt(16, sideRow + 3) === EN_E03_BANNER_KHAN_IDLE_DATA.elite.fur[1], 'right/F' + (frame + 1) + ' must retain the stepped dark collar shoulders');
}
for (const direction of ['down', 'up']) {
  const torso = candidateFrames.get(direction + '/1').pixels;
  const pixelAt = (x, y) => torso[(y * engine.SIZE) + x];
  check(pixelAt(6, 15) === EN_E03_BANNER_KHAN_IDLE_DATA.horse.hide[0] && pixelAt(17, 15) === EN_E03_BANNER_KHAN_IDLE_DATA.horse.hide[0], direction + '/F2 must lift both planted horse flanks one row');
  check(pixelAt(6, 16) === null && pixelAt(17, 16) === null, direction + '/F2 must contract the lower torso without moving either leg');
  check(pixelAt(7, 15) === EN_E03_BANNER_KHAN_IDLE_DATA.horse.hideHighlight && pixelAt(16, 15) === EN_E03_BANNER_KHAN_IDLE_DATA.horse.hideHighlight, direction + '/F2 must shift the paired torso highlights with the lifted flanks');
}
{
  const torso = candidateFrames.get('right/1').pixels;
  const pixelAt = (x, y) => torso[(y * engine.SIZE) + x];
  check(pixelAt(6, 12) === EN_E03_BANNER_KHAN_IDLE_DATA.horse.hide[0] && pixelAt(7, 12) === EN_E03_BANNER_KHAN_IDLE_DATA.horse.hideHighlight && pixelAt(8, 12) === EN_E03_BANNER_KHAN_IDLE_DATA.horse.hide[0], 'right/F2 must visibly raise the rear horse torso');
  check(pixelAt(19, 13) === null && pixelAt(19, 15) === EN_E03_BANNER_KHAN_IDLE_DATA.horse.hideHighlight, 'right/F2 must visibly settle the chest while preserving the planted lower body');
}

const candidateDigest = createHash('sha256').update(JSON.stringify(candidateRecords)).digest('hex');
check(candidateDigest === EN_E03_BANNER_KHAN_IDLE_GATE.candidateFrameDigest, 'the eight Banner Khan Idle frames drifted from the review candidate');
check(completeOutlinePixels > 0, 'Complete B must add exterior outline pixels across the Banner Khan review set');
check(formChangedPixels > 0, 'Form must shade source pixels across the Banner Khan review set');

rejects(() => engine.renderEnemyExpansionFrame(EN_E03_BANNER_KHAN_IDLE_REGISTRY, { kind: 'enemy', family: 'centaur', variant: 'banner-khan' }, 'down', 'walk', 0, {}), 'authorizes only two Idle frames', 'Banner Khan Walk rendering');
rejects(() => engine.renderEnemyExpansionFrame(EN_E03_BANNER_KHAN_IDLE_REGISTRY, { kind: 'enemy', family: 'centaur', variant: 'banner-khan' }, 'down', 'idle', 2, {}), 'Expansion frame 2 is invalid for idle', 'Banner Khan Idle frame 3 rendering');
rejects(() => engine.renderEnemyExpansionFrame(EN_E03_BANNER_KHAN_IDLE_REGISTRY, { kind: 'enemy', family: 'centaur', variant: 'steppe-hunter' }, 'down', 'idle', 0, {}), 'is not implemented', 'Steppe Hunter rendering from the elite registry');
rejects(() => engine.renderEnemyExpansionFrame(EN_E03_BANNER_KHAN_IDLE_REGISTRY, { kind: 'enemy', family: 'centaur', variant: 'sun-lancer' }, 'down', 'idle', 0, {}), 'is not implemented', 'Sun Lancer rendering from the elite registry');
rejects(() => engine.renderEnemyExpansionFrame(EN_E03_BANNER_KHAN_IDLE_REGISTRY, { kind: 'enemy', family: 'giant', variant: 'storm-clan-jarl' }, 'down', 'idle', 0, {}), 'is not implemented', 'Storm-Clan Jarl rendering from the elite registry');

if (errors.length) {
  console.error('EN-E03 Banner Khan Idle validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E03 Banner Khan Idle validation passed.');
console.log('- Approved Steppe Hunter Idle frames preserved: ' + steppeRecords.length + ' / 8');
console.log('- Approved Sun Lancer Idle frames preserved: ' + sunRecords.length + ' / 8');
console.log('- Banner Khan Idle frames: ' + candidateRecords.length + ' / 8');
console.log('- Connected hard-alpha Centaur silhouettes: 8 / 8');
console.log('- Four-hoof contact rows: 8 / 8');
console.log('- Exact side mirrors: 4 / 4');
console.log('- Red war-banner pixels: ' + bannerPixels);
console.log('- Blue-steel lamellar pixels: ' + armorPixels);
console.log('- Crimson cloth pixels: ' + clothPixels);
console.log('- Bronze trim pixels: ' + trimPixels);
console.log('- Fur-collar pixels: ' + furPixels);
console.log('- Complete B added pixels: ' + completeOutlinePixels);
console.log('- Form-shaded source pixels: ' + formChangedPixels);
console.log('- Baked command-aura/banner-flare/shock pixels: 0');
console.log('- Public EN-E03 families: 0');
console.log('- Candidate frame digest: ' + candidateDigest);
