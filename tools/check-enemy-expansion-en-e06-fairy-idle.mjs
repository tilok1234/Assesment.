import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { ENEMY_EXPANSION_LEDGER } from '../engine/enemy-expansion.js';
import { EN_E05_CONSUMER_INTEGRATION_GATE } from '../engine/enemy-expansion-en-e05.js';
import {
  EN_E06_CONTRACT_CARDS,
  EN_E06_FAIRY_CONTRACT_CARD,
  EN_E06_FAIRY_IDLE_DATA,
  EN_E06_FAIRY_IDLE_FAMILY,
  EN_E06_FAIRY_IDLE_GATE,
  EN_E06_FAIRY_IDLE_REGISTRY,
} from '../engine/enemy-expansion-en-e06-fairy-idle.js';
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

function changedAlphaPixels(first, second) {
  let changed = 0;
  for (let index = 0; index < first.length; index++) if (first[index] !== second[index]) changed++;
  return changed;
}

function horizontalWingWindows(pixels, wingColors) {
  let windows = 0;
  for (let y = 0; y < engine.SIZE; y++) {
    for (let x = 1; x < engine.SIZE - 1; x++) {
      const index = (y * engine.SIZE) + x;
      if (pixels[index] !== null) continue;
      let leftWing = false;
      let rightWing = false;
      for (let probe = x - 1; probe >= 0; probe--) {
        const color = pixels[(y * engine.SIZE) + probe];
        if (wingColors.has(color)) {
          leftWing = true;
          break;
        }
      }
      for (let probe = x + 1; probe < engine.SIZE; probe++) {
        const color = pixels[(y * engine.SIZE) + probe];
        if (wingColors.has(color)) {
          rightWing = true;
          break;
        }
      }
      if (leftWing && rightWing) windows++;
    }
  }
  return windows;
}

function frameRecord(captured, direction, frame) {
  return {
    family: 'fairy',
    variant: 'bramblewing-scout',
    direction,
    animation: 'idle',
    frame,
    digest: captured.digest,
    alphaDigest: captured.alphaDigest,
    opaquePixels: captured.opaquePixels,
    bounds: captured.bounds,
  };
}

check(EN_E05_CONSUMER_INTEGRATION_GATE.id === 'en-e05-assembler-consumers-v1', 'the Wave 2 predecessor must remain the exact EN-E05 consumer gate');
check(EN_E05_CONSUMER_INTEGRATION_GATE.consumerFrameDigest === '947cec4df921761cd5eba378991d7a35b3d773d7e5c0e7c80526ecc6a846a46f', 'the approved EN-E05 public frame digest must remain frozen');
check(ENEMY_EXPANSION_LEDGER.find((entry) => entry.id === 'EN-E06')?.gate === 'dryad-grove-tender-full-published-2026-08-09', 'the expansion ledger must preserve the approved Idle baseline while identifying published Grove Tender');
check(EN_E06_FAIRY_IDLE_GATE.status === 'approved', 'the Fairy Idle gate must retain exact designer approval');
check(EN_E06_FAIRY_IDLE_GATE.authorizedOn === '2026-08-09', 'the Wave 2 authorization date must remain frozen');
check(EN_E06_FAIRY_IDLE_GATE.authorizationEvidence.includes('designer said: very good. wave 2') && EN_E06_FAIRY_IDLE_GATE.authorizationEvidence.includes('baseline Fairy four-direction Idle gate'), 'the gate must retain the explicit Wave 2 authorization and bounded first gate');
check(EN_E06_FAIRY_IDLE_GATE.approvedOn === '2026-08-09' && EN_E06_FAIRY_IDLE_GATE.approvalEvidence.includes('very good,. but lately we been doing all animations for 1 sprite each pass'), 'the Idle gate must retain the exact designer approval and cadence correction');
check(EN_E06_FAIRY_IDLE_GATE.precedingApproval.gateId === EN_E05_CONSUMER_INTEGRATION_GATE.id, 'the Fairy gate must identify the EN-E05 consumer predecessor');
check(EN_E06_FAIRY_IDLE_GATE.precedingApproval.consumerFrameDigest === EN_E05_CONSUMER_INTEGRATION_GATE.consumerFrameDigest, 'the Fairy gate must retain the EN-E05 public digest');
check(EN_E06_FAIRY_IDLE_GATE.precedingApproval.publishedCheckpoint === '773cfad1c550db8e5b43cc9360e55fe03ddc0ae2' && EN_E06_FAIRY_IDLE_GATE.precedingApproval.publishedHandoff === '7ffbb0464f766f7ed29d64cd59f3613a3cfd1834', 'the Fairy gate must retain the published EN-E05 implementation and handoff');
check(EN_E06_FAIRY_IDLE_GATE.precedingApproval.documentationAudit === '4ba29e2a3fbe9ec584107994c0a324364d8f9240' && EN_E06_FAIRY_IDLE_GATE.precedingApproval.documentationHandoff === '4b2f49dfb80c3c39b6e49672a2c594746f6c030a', 'the Fairy gate must retain the exact documentation-audit starting point');
check(EN_E06_FAIRY_IDLE_GATE.scope.includes('all five EN-E06 family contract cards') && EN_E06_FAIRY_IDLE_GATE.scope.includes('only Bramblewing Scout common Fairy Idle F1-F2'), 'the first Wave 2 gate must remain bounded to contract cards and one common Fairy Idle pair');
check(EN_E06_FAIRY_IDLE_GATE.identityContract.includes('open-lattice wings') && EN_E06_FAIRY_IDLE_GATE.identityContract.includes('effects remain external'), 'the Fairy identity and external-effect boundary must remain explicit');
check(EN_E06_FAIRY_IDLE_GATE.transparencyPolicy.includes('hard-alpha contract') && EN_E06_FAIRY_IDLE_GATE.transparencyPolicy.includes('transparent negative-space windows') && EN_E06_FAIRY_IDLE_GATE.transparencyPolicy.includes('no partial-alpha'), 'the Fairy gate must document the binary-alpha wing transparency policy');
check(EN_E06_FAIRY_IDLE_GATE.animationContract.includes('two-frame 480 ms hover') && EN_E06_FAIRY_IDLE_GATE.animationContract.includes('ground separation'), 'the Fairy Idle hover contract must remain explicit');
check(EN_E06_FAIRY_IDLE_GATE.exclusions.includes('Fairy Walk') && EN_E06_FAIRY_IDLE_GATE.exclusions.includes('Hag implementation') && EN_E06_FAIRY_IDLE_GATE.exclusions.includes('fixture generation or regeneration') && EN_E06_FAIRY_IDLE_GATE.exclusions.includes('registration') && EN_E06_FAIRY_IDLE_GATE.exclusions.includes('release'), 'the gate must exclude later motion, families, fixtures, registration, and release');
check(EN_E06_FAIRY_IDLE_GATE.nextGate.includes('remaining Bramblewing Scout Walk, Attack, Cast aliases, Hurt, and Death aliases') && EN_E06_FAIRY_IDLE_GATE.nextGate.includes('Do not publish'), 'the approved Idle gate must authorize only the rest of Bramblewing Scout before publication or later Wave 2 work');
check(Object.isFrozen(EN_E06_FAIRY_IDLE_GATE) && Object.isFrozen(EN_E06_FAIRY_IDLE_GATE.precedingApproval) && Object.isFrozen(EN_E06_FAIRY_IDLE_GATE.exclusions), 'the Fairy gate must be deeply immutable');

const expectedFamilies = ['fairy', 'hag', 'dryad', 'redcap', 'nymph'];
check(EN_E06_CONTRACT_CARDS.length === 5, 'EN-E06 must contain exactly five family contract cards');
check(JSON.stringify(EN_E06_CONTRACT_CARDS.map((card) => card.id)) === JSON.stringify(expectedFamilies), 'EN-E06 contract cards must retain the planned Fairy, Hag, Dryad, Redcap, and Nymph order');
for (const card of EN_E06_CONTRACT_CARDS) {
  check(card.sliceId === 'EN-E06', card.id + ' contract card must remain attached to EN-E06');
  check(typeof card.intendedScale === 'string' && card.intendedScale.length > 30, card.id + ' contract card needs an intended-scale ruling');
  check(typeof card.locomotion === 'string' && card.locomotion.length > 30, card.id + ' contract card needs a locomotion ruling');
  check(typeof card.attackTell === 'string' && card.attackTell.length > 30, card.id + ' contract card needs an attack-tell ruling');
  check(Array.isArray(card.externalEffects) && card.externalEffects.length >= 4, card.id + ' contract card must name its external effects or mechanics');
  check(JSON.stringify(card.roleOrder) === JSON.stringify(['common', 'specialist', 'elite']), card.id + ' contract card must retain common, specialist, elite order');
  check(card.variants.length === 3, card.id + ' contract card must contain exactly three initial variant briefs');
  check(JSON.stringify(card.variants.map((variant) => variant.role)) === JSON.stringify(card.roleOrder), card.id + ' variants must follow common, specialist, elite order');
  check(new Set(card.variants.map((variant) => variant.id)).size === 3, card.id + ' variant ids must remain unique');
  check(Object.isFrozen(card) && Object.isFrozen(card.variants), card.id + ' contract card must be deeply immutable');
}
check(EN_E06_FAIRY_CONTRACT_CARD === EN_E06_CONTRACT_CARDS[0], 'the exported Fairy card must be the first EN-E06 contract card');
check(EN_E06_FAIRY_CONTRACT_CARD.anatomy === 'small-winged-fey-humanoid', 'the Fairy contract card must retain its small winged fey anatomy');
check(EN_E06_FAIRY_CONTRACT_CARD.variants[0].id === 'bramblewing-scout' && EN_E06_FAIRY_CONTRACT_CARD.variants[0].status === 'implemented-full-approved', 'Bramblewing Scout must remain the approved common role and retain its approved full-suite status');
check(EN_E06_FAIRY_CONTRACT_CARD.variants[1].id === 'thistle-hexer' && EN_E06_FAIRY_CONTRACT_CARD.variants[1].status === 'implemented-full-approved', 'Thistle Hexer must retain its separately approved full-suite status');
check(EN_E06_FAIRY_CONTRACT_CARD.variants[2].id === 'petalcrown-duelist' && EN_E06_FAIRY_CONTRACT_CARD.variants[2].status === 'implemented-full-approved', 'Petalcrown Duelist must retain its separately approved full-suite status');
check(EN_E06_CONTRACT_CARDS[1].variants[0].status === 'implemented-full-approved', 'the later approved Mire Crone lane must remain visible without changing this historical Idle gate');
check(EN_E06_CONTRACT_CARDS[1].variants[1].status === 'implemented-full-approved', 'the later approved Cauldron Hexer must remain visible without changing this historical Idle gate');
check(EN_E06_CONTRACT_CARDS[1].variants[2].status === 'implemented-full-approved', 'Blackthorn Matron must retain its full approval');
check(EN_E06_CONTRACT_CARDS[2].variants.map(({ status }) => status).join('/') === 'implemented-full-approved/planned/planned', 'Dryad role-order status drifted');
for (const card of EN_E06_CONTRACT_CARDS.slice(3)) check(card.variants.every((variant) => variant.status === 'planned'), card.id + ' must remain contract-only');

check(EN_E06_FAIRY_IDLE_DATA.alphaPolicy === 'binary-open-lattice-negative-space', 'the Fairy renderer data must retain the hard-alpha open-lattice policy');
check(EN_E06_FAIRY_IDLE_DATA.effectBoundary === 'external-glow-pollen-sparkles-trails-and-impact-light' && EN_E06_FAIRY_IDLE_DATA.bakedEffects.length === 0, 'Fairy glow, pollen, sparkles, trails, and impact light must remain external');
check(EN_E06_FAIRY_IDLE_REGISTRY.families.length === 1, 'the Fairy candidate registry must contain exactly one implemented family');
check(EN_E06_FAIRY_IDLE_REGISTRY.publicFamilies.length === 0, 'the Fairy candidate registry must expose zero public families');
check(EN_E06_FAIRY_IDLE_FAMILY.variants.length === 1 && EN_E06_FAIRY_IDLE_FAMILY.variants[0].id === 'bramblewing-scout', 'the candidate registry must implement only Bramblewing Scout');
check(EN_E06_FAIRY_IDLE_REGISTRY.renderers[0].chassis === 'small-winged-fey-v1', 'the candidate must use the explicit small winged fey chassis');
check(engine.EN_E06_FAIRY_IDLE_REGISTRY === undefined && engine.EN_E06_FAIRY_IDLE_GATE === undefined, 'the Fairy candidate must not leak through the public engine facade');
check(engine.PUBLIC_ENEMIES.length === 74 && engine.ENEMIES.length === 57, 'the Fairy candidate must retain current public and legacy Enemy counts');
check(!engine.PUBLIC_ENEMIES.some((family) => family.id === 'fairy'), 'Fairy must remain absent from the public catalog before registration');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!facadeSource.includes('enemy-expansion-en-e06-fairy-idle') && !facadeSource.includes('EN_E06_FAIRY_IDLE'), 'the public facade must not import or expose Fairy candidate symbols');
const assetManifest = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
check(!assetManifest.includes('fairy') && !assetManifest.includes('bramblewing-scout'), 'the frozen asset-pack manifest must not contain the internal Fairy candidate');

check(await sha256File(EN_E06_FAIRY_IDLE_GATE.artifact) === EN_E06_FAIRY_IDLE_GATE.artifactSha256, 'the raw Fairy review board must match its frozen candidate hash');
check(await sha256File(EN_E06_FAIRY_IDLE_GATE.assembledArtifact) === EN_E06_FAIRY_IDLE_GATE.assembledArtifactSha256, 'the Complete B + Form Fairy review board must match its frozen candidate hash');
check(await sha256File(EN_E06_FAIRY_IDLE_GATE.reviewAnimations.raw.artifact) === EN_E06_FAIRY_IDLE_GATE.reviewAnimations.raw.sha256, 'the raw labeled Fairy GIF must match its frozen candidate hash');
check(await sha256File(EN_E06_FAIRY_IDLE_GATE.reviewAnimations.completeBForm.artifact) === EN_E06_FAIRY_IDLE_GATE.reviewAnimations.completeBForm.sha256, 'the Complete B + Form labeled Fairy GIF must match its frozen candidate hash');
for (const animation of Object.values(EN_E06_FAIRY_IDLE_GATE.reviewAnimations)) {
  check(animation.width === 192 && animation.height === 224 && animation.frames === 2 && animation.durationMs === 480, 'each Fairy GIF must retain the 192x224 two-frame 480 ms contract');
}

const candidateRecords = [];
const candidateFrames = new Map();
const skinColors = new Set(EN_E06_FAIRY_IDLE_DATA.fairy.skin);
const hairColors = new Set(EN_E06_FAIRY_IDLE_DATA.fairy.hair);
const wingColors = new Set(EN_E06_FAIRY_IDLE_DATA.fairy.wing);
const goldColors = new Set(EN_E06_FAIRY_IDLE_DATA.fairy.gold);
let skinPixels = 0;
let hairPixels = 0;
let wingAndLeafPixels = 0;
let goldPixels = 0;
let wingWindows = 0;
let changedAlpha = 0;
let completeOutlinePixels = 0;
let formChangedPixels = 0;
let minimumOpaque = Number.POSITIVE_INFINITY;
let maximumOpaque = 0;
for (const direction of engine.DIRS) for (let frame = 0; frame < 2; frame++) {
  const captured = captureEnemyExpansionFrame(
    EN_E06_FAIRY_IDLE_REGISTRY,
    { kind: 'enemy', family: 'fairy', variant: 'bramblewing-scout' },
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
  check(captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 20, direction + '/F' + (frame + 1) + ' must retain a one-cell outer margin plus at least three clear rows below the hover');
  check(componentCount(captured.pixels) === 1, direction + '/F' + (frame + 1) + ' must remain one connected wing-body silhouette');
  check(captured.opaquePixels >= 100 && captured.opaquePixels <= 210, direction + '/F' + (frame + 1) + ' must retain a compact small-fey pixel mass');
  const frameSkinPixels = captured.pixels.filter((color) => skinColors.has(color)).length;
  const frameHairPixels = captured.pixels.filter((color) => hairColors.has(color)).length;
  const frameWingPixels = captured.pixels.filter((color) => wingColors.has(color)).length;
  const frameGoldPixels = captured.pixels.filter((color) => goldColors.has(color)).length;
  const frameWingWindows = horizontalWingWindows(captured.pixels, wingColors);
  skinPixels += frameSkinPixels;
  hairPixels += frameHairPixels;
  wingAndLeafPixels += frameWingPixels;
  goldPixels += frameGoldPixels;
  wingWindows += frameWingWindows;
  const minimumSkinPixels = direction === 'up' ? 10 : 20;
  check(frameSkinPixels >= minimumSkinPixels, direction + '/F' + (frame + 1) + ' must retain direction-appropriate face or rear ears, arms, and hovering legs');
  check(frameHairPixels >= 30, direction + '/F' + (frame + 1) + ' must retain the plum hair and fitted bodice identity');
  check(frameWingPixels >= 45, direction + '/F' + (frame + 1) + ' must retain paired wing and leaf-dress planes');
  check(frameGoldPixels >= 3, direction + '/F' + (frame + 1) + ' must retain the small gold fastener accents');
  check(frameWingWindows >= 2, direction + '/F' + (frame + 1) + ' must retain visible negative-space windows inside the open-lattice wing read');
  check(captured.renderResult.fairyIdleGate === EN_E06_FAIRY_IDLE_GATE.id, direction + '/F' + (frame + 1) + ' must report the Fairy gate');
  check(captured.renderResult.approvedPrecedingGate === EN_E05_CONSUMER_INTEGRATION_GATE.id, direction + '/F' + (frame + 1) + ' must report the approved predecessor');
  check(captured.renderResult.anatomy === 'small-winged-fey-humanoid' && captured.renderResult.locomotion === 'ground-clear-connected-wing-hover', direction + '/F' + (frame + 1) + ' must report the Fairy anatomy and hover contract');
  check(captured.renderResult.alphaPolicy === 'binary-open-lattice-negative-space', direction + '/F' + (frame + 1) + ' must report the hard-alpha wing policy');
  check(captured.renderResult.effectBoundary === 'external-glow-pollen-sparkles-trails-and-impact-light', direction + '/F' + (frame + 1) + ' must report the external effect boundary');
  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E06_FAIRY_IDLE_DATA);
  completeOutlinePixels += presentation.complete.filter((color, index) => color !== null && captured.pixels[index] === null).length;
  formChangedPixels += presentation.form.filter((color, index) => captured.pixels[index] !== null && color !== captured.pixels[index]).length;
}

for (const direction of engine.DIRS) {
  const first = candidateFrames.get(direction + '/0');
  const second = candidateFrames.get(direction + '/1');
  check(first.digest !== second.digest, direction + ' Idle F1 and F2 must remain distinct');
  const changed = changedAlphaPixels(first.alpha, second.alpha);
  check(changed >= 35, direction + ' Idle F2 must visibly lower the body and change the wing angle');
  changedAlpha += changed;
}
for (let frame = 0; frame < 2; frame++) {
  check(JSON.stringify(candidateFrames.get('left/' + frame).pixels) === JSON.stringify(mirrorPixels(candidateFrames.get('right/' + frame).pixels, engine.SIZE)), 'left/right F' + (frame + 1) + ' must remain exact mirrors');
  check(candidateFrames.get('down/' + frame).digest !== candidateFrames.get('up/' + frame).digest, 'Down/Up F' + (frame + 1) + ' must remain distinct');
}

const candidateDigest = createHash('sha256').update(JSON.stringify(candidateRecords)).digest('hex');
check(candidateDigest === EN_E06_FAIRY_IDLE_GATE.candidateFrameDigest, 'the eight Fairy Bramblewing Scout Idle frames drifted from the review candidate');
check(completeOutlinePixels > 0, 'Complete B must add exterior outline pixels across the Fairy review set');
check(formChangedPixels > 0, 'Form must shade source pixels across the Fairy review set');

rejects(() => engine.renderEnemyExpansionFrame(EN_E06_FAIRY_IDLE_REGISTRY, { kind: 'enemy', family: 'fairy', variant: 'bramblewing-scout' }, 'down', 'walk', 0, {}), 'authorizes only two Idle frames', 'Fairy Walk rendering');
rejects(() => engine.renderEnemyExpansionFrame(EN_E06_FAIRY_IDLE_REGISTRY, { kind: 'enemy', family: 'fairy', variant: 'bramblewing-scout' }, 'down', 'idle', 2, {}), 'Expansion frame 2 is invalid for idle', 'Fairy Idle frame 3 rendering');
rejects(() => engine.renderEnemyExpansionFrame(EN_E06_FAIRY_IDLE_REGISTRY, { kind: 'enemy', family: 'fairy', variant: 'thistle-hexer' }, 'down', 'idle', 0, {}), 'is not implemented', 'Thistle Hexer rendering');
rejects(() => engine.renderEnemyExpansionFrame(EN_E06_FAIRY_IDLE_REGISTRY, { kind: 'enemy', family: 'fairy', variant: 'petalcrown-duelist' }, 'down', 'idle', 0, {}), 'is not implemented', 'Petalcrown Duelist rendering');
for (const familyId of ['hag', 'dryad', 'redcap', 'nymph']) {
  rejects(() => engine.renderEnemyExpansionFrame(EN_E06_FAIRY_IDLE_REGISTRY, { kind: 'enemy', family: familyId, variant: 'planned' }, 'down', 'idle', 0, {}), 'is not implemented', familyId + ' rendering');
}

if (errors.length) {
  console.error('EN-E06 Fairy Idle validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('EN-E06 Fairy Idle validation passed.');
console.log('- EN-E06 contract cards: ' + EN_E06_CONTRACT_CARDS.length + ' / 5');
console.log('- Bramblewing Scout Idle frames: ' + candidateRecords.length + ' / 8');
console.log('- Connected hard-alpha wing-body silhouettes: 8 / 8');
console.log('- Ground-clear hover frames: 8 / 8');
console.log('- Exact side mirrors: 4 / 4');
console.log('- F1/F2 changed alpha pixels: ' + changedAlpha);
console.log('- Negative-space wing-window cells: ' + wingWindows);
console.log('- Skin pixels: ' + skinPixels);
console.log('- Plum hair/bodice pixels: ' + hairPixels);
console.log('- Wing/leaf material pixels: ' + wingAndLeafPixels);
console.log('- Gold accent pixels: ' + goldPixels);
console.log('- Opaque pixel range: ' + minimumOpaque + ' to ' + maximumOpaque);
console.log('- Complete B added pixels: ' + completeOutlinePixels);
console.log('- Form-shaded source pixels: ' + formChangedPixels);
console.log('- Baked glow/pollen/sparkle/trail/impact pixels: 0');
console.log('- Public EN-E06 families: 0');
console.log('- Candidate frame digest: ' + candidateDigest);
