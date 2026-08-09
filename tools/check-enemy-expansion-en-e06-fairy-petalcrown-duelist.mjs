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
} from '../engine/enemy-expansion-en-e06-fairy-idle.js';
import { EN_E06_FAIRY_GATE, EN_E06_FAIRY_REGISTRY } from '../engine/enemy-expansion-en-e06-fairy.js';
import {
  EN_E06_THISTLE_HEXER_GATE,
  EN_E06_THISTLE_HEXER_REGISTRY,
} from '../engine/enemy-expansion-en-e06-fairy-thistle-hexer.js';
import {
  EN_E06_PETALCROWN_DUELIST_CONTRACT,
  EN_E06_PETALCROWN_DUELIST_DATA,
  EN_E06_PETALCROWN_DUELIST_DEATH_SOURCE_FRAMES,
  EN_E06_PETALCROWN_DUELIST_FAMILY,
  EN_E06_PETALCROWN_DUELIST_GATE,
  EN_E06_PETALCROWN_DUELIST_REGISTRY,
} from '../engine/enemy-expansion-en-e06-fairy-petalcrown-duelist.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import { captureEnemyExpansionFrame, mirrorPixels } from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors = [];
const check = (condition, message) => {
  if (!condition) errors.push(message);
};

const directions = Object.freeze(['down', 'left', 'right', 'up']);
const animations = Object.freeze([
  { id: 'idle', frames: 2 },
  { id: 'walk', frames: 4 },
  { id: 'attack', frames: 4 },
  { id: 'cast', frames: 4 },
  { id: 'hurt', frames: 2 },
  { id: 'death', frames: 4 },
]);
const candidateSpec = Object.freeze({ kind: 'enemy', family: 'fairy', variant: 'petalcrown-duelist' });
const thistleSpec = Object.freeze({ kind: 'enemy', family: 'fairy', variant: 'thistle-hexer' });
const brambleSpec = Object.freeze({ kind: 'enemy', family: 'fairy', variant: 'bramblewing-scout' });

function hashJson(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
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

function countColors(pixels, colors) {
  return pixels.filter((color) => colors.has(color)).length;
}

function enclosedTransparentPixels(pixels) {
  let count = 0;
  for (let y = 1; y < engine.SIZE - 1; y++) for (let x = 1; x < engine.SIZE - 1; x++) {
    const index = (y * engine.SIZE) + x;
    if (pixels[index] !== null) continue;
    if (
      pixels[index - 1] !== null
      && pixels[index + 1] !== null
      && pixels[index - engine.SIZE] !== null
      && pixels[index + engine.SIZE] !== null
    ) count++;
  }
  return count;
}

function frameKey(direction, animation, frame) {
  return `${direction}/${animation}/${frame}`;
}

function frameRecord(captured, variant, direction, animation, frame) {
  return {
    family: 'fairy',
    variant,
    candidateFamily: 'fairy',
    direction,
    animation,
    frame,
    digest: captured.digest,
    alphaDigest: captured.alphaDigest,
    opaquePixels: captured.opaquePixels,
    bounds: captured.bounds,
  };
}

function isWhiteFlash(animation, frame) {
  return (animation === 'hurt' && frame === 0) || (animation === 'death' && frame === 0);
}

function rejects(run, messageFragment, label) {
  try {
    run();
    errors.push(`${label} was not rejected.`);
  } catch (error) {
    check(String(error.message).includes(messageFragment), `${label} returned the wrong error: ${error.message}`);
  }
}

check(EN_E05_CONSUMER_INTEGRATION_GATE.id === 'en-e05-assembler-consumers-v1', 'the Petalcrown lane must retain the exact EN-E05 consumer predecessor');
check(EN_E05_CONSUMER_INTEGRATION_GATE.consumerFrameDigest === '947cec4df921761cd5eba378991d7a35b3d773d7e5c0e7c80526ecc6a846a46f', 'the approved EN-E05 public digest drifted');
check(ENEMY_EXPANSION_LEDGER.find((entry) => entry.id === 'EN-E06')?.gate === 'hag-mire-crone-full-candidate-2026-08-09', 'the EN-E06 ledger must preserve published Petalcrown while identifying the later Mire Crone candidate gate');

check(EN_E06_FAIRY_GATE.status === 'approved' && EN_E06_FAIRY_GATE.publishedImplementation === 'cc92ca9bb14f9fa7937a7e1e746d55fb754d9653', 'the published Bramblewing predecessor drifted');
check(EN_E06_THISTLE_HEXER_GATE.status === 'approved', 'the Thistle Hexer predecessor must retain exact approval');
check(EN_E06_THISTLE_HEXER_GATE.publishedImplementation === '3dc68cbae16acd2564d81607ac5a1ca1d569fbee', 'the published Thistle implementation drifted');
check(EN_E06_THISTLE_HEXER_GATE.candidateFrameDigest === '675b5a8957efdc81c07ae53c4b013ad8229847fc84d9b1c0c8da4ad09e6a4534', 'the approved Thistle digest drifted');

check(EN_E06_PETALCROWN_DUELIST_GATE.id === 'en-e06-fairy-petalcrown-duelist-full-v1', 'the Petalcrown gate id drifted');
check(EN_E06_PETALCROWN_DUELIST_GATE.status === 'approved', 'Petalcrown Duelist must retain exact designer approval');
check(EN_E06_PETALCROWN_DUELIST_GATE.authorizedOn === '2026-08-09', 'the Petalcrown authorization date drifted');
check(EN_E06_PETALCROWN_DUELIST_GATE.authorizationEvidence.includes('designer said: lets do next') && EN_E06_PETALCROWN_DUELIST_GATE.authorizationEvidence.includes('one complete 80-frame variant pass'), 'the gate must retain the explicit next-variant authorization and one-sprite cadence');
check(EN_E06_PETALCROWN_DUELIST_GATE.approvedOn === '2026-08-09', 'the Petalcrown approval date drifted');
check(EN_E06_PETALCROWN_DUELIST_GATE.approvalEvidence.includes('designer replied: approved') && EN_E06_PETALCROWN_DUELIST_GATE.approvalEvidence.includes('frozen 80-frame Petalcrown Duelist candidate') && EN_E06_PETALCROWN_DUELIST_GATE.approvalEvidence.includes('bounded commit and branch publication'), 'the gate must retain the exact designer approval and bounded publication evidence');
check(EN_E06_PETALCROWN_DUELIST_GATE.publishedImplementation === 'b265e972e719d6b697c99085503a1f2ea341da61', 'the exact published Petalcrown Duelist implementation checkpoint drifted');
check(EN_E06_PETALCROWN_DUELIST_GATE.precedingApproval.gateId === EN_E06_THISTLE_HEXER_GATE.id, 'the gate must identify Thistle Hexer as its approved predecessor');
check(EN_E06_PETALCROWN_DUELIST_GATE.precedingApproval.candidateFrameDigest === EN_E06_THISTLE_HEXER_GATE.candidateFrameDigest, 'the gate must retain the approved Thistle digest');
check(EN_E06_PETALCROWN_DUELIST_GATE.precedingApproval.publishedImplementation === EN_E06_THISTLE_HEXER_GATE.publishedImplementation && EN_E06_PETALCROWN_DUELIST_GATE.precedingApproval.publishedHandoff === '581bff9', 'the gate must retain the exact published Thistle implementation and handoff');
check(EN_E06_PETALCROWN_DUELIST_GATE.bramblewingApproval.candidateFrameDigest === EN_E06_FAIRY_GATE.candidateFrameDigest, 'the gate must retain the approved Bramblewing digest');
check(EN_E06_PETALCROWN_DUELIST_GATE.scope.includes('complete 80-frame Petalcrown Duelist') && EN_E06_PETALCROWN_DUELIST_GATE.scope.includes('Cast-to-Attack') && EN_E06_PETALCROWN_DUELIST_GATE.scope.includes('Death-to-Hurt'), 'the gate must retain the complete suite and alias scope');
check(EN_E06_PETALCROWN_DUELIST_GATE.animationContract.includes('wide crown-wing guard') && EN_E06_PETALCROWN_DUELIST_GATE.animationContract.includes('attached lunge'), 'the elite motion contract must retain the crown-wing guard and attached lunge');
check(EN_E06_PETALCROWN_DUELIST_GATE.exclusions.includes('changes to approved Bramblewing Scout source or pixels') && EN_E06_PETALCROWN_DUELIST_GATE.exclusions.includes('changes to approved Thistle Hexer source or pixels') && EN_E06_PETALCROWN_DUELIST_GATE.exclusions.includes('Hag implementation') && EN_E06_PETALCROWN_DUELIST_GATE.exclusions.includes('asset-pack fixture generation or regeneration'), 'the gate must protect earlier Fairies and exclude Hag and fixtures');
check(EN_E06_PETALCROWN_DUELIST_GATE.nextGate.includes('published at b265e972e719d6b697c99085503a1f2ea341da61') && EN_E06_PETALCROWN_DUELIST_GATE.nextGate.includes('Stop for a separate continuation'), 'the published Petalcrown lane must retain its exact checkpoint and stop before Hag');
check(Object.isFrozen(EN_E06_PETALCROWN_DUELIST_GATE) && Object.isFrozen(EN_E06_PETALCROWN_DUELIST_GATE.precedingApproval) && Object.isFrozen(EN_E06_PETALCROWN_DUELIST_GATE.exclusions), 'the Petalcrown gate must be deeply immutable');

check(EN_E06_PETALCROWN_DUELIST_CONTRACT.family === 'fairy' && EN_E06_PETALCROWN_DUELIST_CONTRACT.variant === 'petalcrown-duelist', 'the candidate contract must remain one Fairy/Petalcrown Duelist');
check(EN_E06_PETALCROWN_DUELIST_CONTRACT.role === 'elite' && EN_E06_PETALCROWN_DUELIST_CONTRACT.chassis === 'small-winged-fey-v1', 'Petalcrown must retain the elite small-winged-fey contract');
check(EN_E06_PETALCROWN_DUELIST_CONTRACT.effectBoundary.includes('remain external'), 'the elite contract must keep dash and impact effects external');
check(Object.isFrozen(EN_E06_PETALCROWN_DUELIST_CONTRACT) && Object.isFrozen(EN_E06_PETALCROWN_DUELIST_DATA), 'the contract and renderer data must remain immutable');

check(EN_E06_CONTRACT_CARDS.length === 5, 'EN-E06 must retain all five family contract cards');
check(EN_E06_FAIRY_CONTRACT_CARD.variants[0].status === 'implemented-full-approved', 'Bramblewing Scout must retain its approved full-suite status');
check(EN_E06_FAIRY_CONTRACT_CARD.variants[1].status === 'implemented-full-approved', 'Thistle Hexer must retain its approved full-suite status');
check(EN_E06_FAIRY_CONTRACT_CARD.variants[2].id === 'petalcrown-duelist' && EN_E06_FAIRY_CONTRACT_CARD.variants[2].status === 'implemented-full-approved', 'Petalcrown Duelist must retain its separately approved full-suite status');
check(EN_E06_CONTRACT_CARDS[1].variants[0].status === 'implemented-full-candidate', 'the separately authorized Mire Crone lane must remain visible without changing the approved Petalcrown gate');
check(EN_E06_CONTRACT_CARDS[1].variants.slice(1).every((variant) => variant.status === 'planned'), 'later Hag variants must remain planned');
for (const card of EN_E06_CONTRACT_CARDS.slice(2)) check(card.variants.every((variant) => variant.status === 'planned'), `${card.id} must remain contract-only`);

check(EN_E06_PETALCROWN_DUELIST_DATA.alphaPolicy === 'binary-crown-wing-negative-space', 'the elite renderer data must retain its hard-alpha crown-wing policy');
check(EN_E06_PETALCROWN_DUELIST_DATA.effectBoundary.includes('external-dash-trails') && EN_E06_PETALCROWN_DUELIST_DATA.bakedEffects.length === 0, 'dash trails and later effects must remain external');
check(EN_E06_PETALCROWN_DUELIST_REGISTRY.families.length === 1 && EN_E06_PETALCROWN_DUELIST_REGISTRY.publicFamilies.length === 0, 'the candidate registry must contain one internal family and expose none publicly');
check(EN_E06_PETALCROWN_DUELIST_FAMILY.variants.length === 1 && EN_E06_PETALCROWN_DUELIST_FAMILY.variants[0].id === 'petalcrown-duelist', 'the candidate registry must contain only Petalcrown Duelist');

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && engine.PUBLIC_ENEMIES.length === 74 && publicVariantCount === 245, 'the private elite must retain the 57 legacy and 74/245 public boundaries');
check(!engine.PUBLIC_ENEMIES.some((family) => family.id === 'fairy'), 'Fairy must remain absent from the public catalog');
check(engine.EN_E06_PETALCROWN_DUELIST_REGISTRY === undefined && engine.EN_E06_PETALCROWN_DUELIST_GATE === undefined, 'Petalcrown must not leak through the public engine facade');
const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!publicSource.includes('enemy-expansion-en-e06-fairy-petalcrown-duelist') && !facadeSource.includes('enemy-expansion-en-e06-fairy-petalcrown-duelist'), 'public engine modules must not import the private elite lane');
const assetManifest = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
check(!assetManifest.includes('petalcrown-duelist'), 'the frozen asset-pack manifest must not contain Petalcrown Duelist');

const captures = new Map();
const thistleCaptures = new Map();
const brambleCaptures = new Map();
const candidateRecords = [];
const thistleRecords = [];
const brambleRecords = [];
const skinColors = new Set(EN_E06_PETALCROWN_DUELIST_DATA.petalcrownDuelist.skin);
const hairColors = new Set(EN_E06_PETALCROWN_DUELIST_DATA.petalcrownDuelist.hair);
const armorColors = new Set(EN_E06_PETALCROWN_DUELIST_DATA.petalcrownDuelist.armor);
const wingColors = new Set(EN_E06_PETALCROWN_DUELIST_DATA.petalcrownDuelist.wing);
const leafColors = new Set(EN_E06_PETALCROWN_DUELIST_DATA.petalcrownDuelist.leaf);
const goldColors = new Set(EN_E06_PETALCROWN_DUELIST_DATA.petalcrownDuelist.gold);
const bladeColors = new Set(EN_E06_PETALCROWN_DUELIST_DATA.petalcrownDuelist.blade);
let connectedFrames = 0;
let boundedFrames = 0;
let groundClearFrames = 0;
let coloredIdentityFrames = 0;
let flashFrames = 0;
let crownWindowFrames = 0;
let thistleDifferences = 0;
let thistleAlphaDifferences = 0;
let brambleDifferences = 0;
let brambleAlphaDifferences = 0;
let completeBAddedPixels = 0;
let formChangedPixels = 0;
let minOpaquePixels = Number.POSITIVE_INFINITY;
let maxOpaquePixels = 0;

for (const animation of animations) for (const direction of directions) for (let frame = 0; frame < animation.frames; frame++) {
  const key = frameKey(direction, animation.id, frame);
  const captured = captureEnemyExpansionFrame(EN_E06_PETALCROWN_DUELIST_REGISTRY, candidateSpec, direction, animation.id, frame);
  const thistle = captureEnemyExpansionFrame(EN_E06_THISTLE_HEXER_REGISTRY, thistleSpec, direction, animation.id, frame);
  const bramble = captureEnemyExpansionFrame(EN_E06_FAIRY_REGISTRY, brambleSpec, direction, animation.id, frame);
  captures.set(key, captured);
  thistleCaptures.set(key, thistle);
  brambleCaptures.set(key, bramble);
  candidateRecords.push(frameRecord(captured, 'petalcrown-duelist', direction, animation.id, frame));
  thistleRecords.push(frameRecord(thistle, 'thistle-hexer', direction, animation.id, frame));
  brambleRecords.push(frameRecord(bramble, 'bramblewing-scout', direction, animation.id, frame));

  check(captured.outOfBoundsWrites.length === 0, `${key} wrote outside the 24x24 cell`);
  check(captured.alpha.every((value) => value === 0 || value === 255), `${key} must retain hard alpha`);
  const bounded = captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22;
  check(bounded, `${key} must preserve a one-cell margin`);
  if (bounded) boundedFrames++;
  const groundClear = captured.bounds && captured.bounds.maxY <= 20;
  check(groundClear, `${key} must retain at least three clear rows below the hover`);
  if (groundClear) groundClearFrames++;
  const components = componentCount(captured.pixels);
  check(components === 1, `${key} must remain one connected crown-wing-body-rapier silhouette, found ${components}`);
  if (components === 1) connectedFrames++;
  check(captured.opaquePixels >= 130 && captured.opaquePixels <= 280, `${key} has implausible elite-Fairy density ${captured.opaquePixels}`);
  minOpaquePixels = Math.min(minOpaquePixels, captured.opaquePixels);
  maxOpaquePixels = Math.max(maxOpaquePixels, captured.opaquePixels);

  if (JSON.stringify(captured.pixels) !== JSON.stringify(thistle.pixels)) thistleDifferences++;
  else check(false, `${key} must differ from approved Thistle Hexer`);
  if (captured.alphaDigest !== thistle.alphaDigest) thistleAlphaDifferences++;
  if (JSON.stringify(captured.pixels) !== JSON.stringify(bramble.pixels)) brambleDifferences++;
  else check(false, `${key} must differ from approved Bramblewing Scout`);
  if (captured.alphaDigest !== bramble.alphaDigest) brambleAlphaDifferences++;

  if (isWhiteFlash(animation.id, frame)) {
    const colors = new Set(captured.pixels.filter((color) => color !== null));
    check(colors.size === 1 && colors.has('#f4f4f4'), `${key} must be a complete white recoil flash`);
    flashFrames++;
  } else {
    check(countColors(captured.pixels, skinColors) >= (direction === 'up' ? 8 : 12), `${key} must retain direction-appropriate warm skin planes`);
    check(countColors(captured.pixels, hairColors) >= 18, `${key} must retain dark teal hair planes`);
    check(countColors(captured.pixels, armorColors) >= 40, `${key} must retain rose petal armor`);
    check(countColors(captured.pixels, wingColors) >= 45, `${key} must retain the wide crown-wing mantle`);
    check(countColors(captured.pixels, leafColors) >= 4, `${key} must retain green leaf joints`);
    check(countColors(captured.pixels, goldColors) >= 3, `${key} must retain gold crown or rapier fittings`);
    if (animation.id === 'attack' || animation.id === 'cast') check(countColors(captured.pixels, bladeColors) >= 2, `${key} must retain the attached silver-blue rapier`);
    const windows = enclosedTransparentPixels(captured.pixels);
    check(windows >= 1, `${key} must retain at least one hard-alpha crown-wing negative-space window`);
    if (windows >= 1) crownWindowFrames++;
    coloredIdentityFrames++;
  }

  check(captured.renderResult.petalcrownDuelistGate === EN_E06_PETALCROWN_DUELIST_GATE.id, `${key} must report the Petalcrown gate`);
  check(captured.renderResult.approvedPrecedingGate === EN_E06_THISTLE_HEXER_GATE.id, `${key} must report approved Thistle Hexer as its predecessor`);
  check(captured.renderResult.alphaPolicy === 'binary-crown-wing-negative-space', `${key} must report the crown-wing alpha policy`);
  check(captured.renderResult.effectBoundary === EN_E06_PETALCROWN_DUELIST_DATA.effectBoundary, `${key} must report the external-effect boundary`);

  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E06_PETALCROWN_DUELIST_DATA);
  const additions = presentation.formComplete.reduce((sum, color, index) => sum + (color && !captured.pixels[index] ? 1 : 0), 0);
  const formChanges = presentation.form.reduce((sum, color, index) => sum + (captured.pixels[index] && color !== captured.pixels[index] ? 1 : 0), 0);
  check(additions > 0, `${key} must receive Complete B outline pixels`);
  completeBAddedPixels += additions;
  formChangedPixels += formChanges;
}

for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = captures.get(frameKey('left', animation.id, frame));
  const right = captures.get(frameKey('right', animation.id, frame));
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels)), `left/right mirror drifted for ${animation.id} frame ${frame + 1}`);
  check(captures.get(frameKey('down', animation.id, frame)).digest !== captures.get(frameKey('up', animation.id, frame)).digest, `Down/Up must remain distinct for ${animation.id} frame ${frame + 1}`);
}

for (const direction of directions) {
  for (let frame = 0; frame < 4; frame++) {
    check(
      JSON.stringify(captures.get(frameKey(direction, 'cast', frame)).pixels) === JSON.stringify(captures.get(frameKey(direction, 'attack', frame)).pixels),
      `${direction} Cast C${frame + 1} must alias Attack A${frame + 1}`,
    );
    const sourceFrame = EN_E06_PETALCROWN_DUELIST_DEATH_SOURCE_FRAMES[frame];
    check(
      JSON.stringify(captures.get(frameKey(direction, 'death', frame)).pixels) === JSON.stringify(captures.get(frameKey(direction, 'hurt', sourceFrame)).pixels),
      `${direction} Death D${frame + 1} must alias Hurt H${sourceFrame + 1}`,
    );
  }
  check(new Set([0, 1].map((frame) => captures.get(frameKey(direction, 'idle', frame)).digest)).size === 2, `${direction} Idle must contain two distinct frames`);
  check(new Set([0, 1, 2, 3].map((frame) => captures.get(frameKey(direction, 'walk', frame)).digest)).size === 4, `${direction} Walk must contain four distinct frames`);
  check(new Set([0, 1, 2, 3].map((frame) => captures.get(frameKey(direction, 'attack', frame)).digest)).size === 4, `${direction} Attack must contain four distinct frames`);
  check(new Set([0, 1].map((frame) => captures.get(frameKey(direction, 'hurt', frame)).digest)).size === 2, `${direction} Hurt must contain two distinct frames`);
}

const candidateFrameDigest = hashJson(candidateRecords);
const thistleFrameDigest = hashJson(thistleRecords);
const brambleFrameDigest = hashJson(brambleRecords);
check(candidateRecords.length === 80 && thistleRecords.length === 80 && brambleRecords.length === 80, 'the focused gate must exhaust 80 candidate and both 80-frame approved comparison suites');
if (EN_E06_PETALCROWN_DUELIST_GATE.candidateFrameDigest) check(candidateFrameDigest === EN_E06_PETALCROWN_DUELIST_GATE.candidateFrameDigest, 'the frozen 80-frame Petalcrown digest drifted');
check(thistleFrameDigest === EN_E06_PETALCROWN_DUELIST_GATE.thistleComparisonDigest && thistleFrameDigest === EN_E06_THISTLE_HEXER_GATE.candidateFrameDigest, 'the approved Thistle comparison digest drifted');
check(brambleFrameDigest === EN_E06_PETALCROWN_DUELIST_GATE.bramblewingComparisonDigest && brambleFrameDigest === EN_E06_FAIRY_GATE.candidateFrameDigest, 'the approved Bramblewing comparison digest drifted');
check(thistleDifferences === 80 && thistleAlphaDifferences === 80, 'all 80 Petalcrown frames and alpha silhouettes must differ from Thistle Hexer');
check(brambleDifferences === 80 && brambleAlphaDifferences === 80, 'all 80 Petalcrown frames and alpha silhouettes must differ from Bramblewing Scout');
check(connectedFrames === 80 && boundedFrames === 80 && groundClearFrames === 80, 'all 80 frames must remain connected, bounded, and ground-clear');
check(coloredIdentityFrames === 72 && flashFrames === 8 && crownWindowFrames === 72, 'the suite must retain 72 colored crown-wing frames and eight exact white alias flashes');
check(completeBAddedPixels > 0 && formChangedPixels > 0, 'the full elite suite must support Complete B and Form presentation');

const artifactEntries = [
  [EN_E06_PETALCROWN_DUELIST_GATE.artifact, EN_E06_PETALCROWN_DUELIST_GATE.artifactSha256],
  [EN_E06_PETALCROWN_DUELIST_GATE.assembledArtifact, EN_E06_PETALCROWN_DUELIST_GATE.assembledArtifactSha256],
  [EN_E06_PETALCROWN_DUELIST_GATE.comparisonArtifact, EN_E06_PETALCROWN_DUELIST_GATE.comparisonArtifactSha256],
  [EN_E06_PETALCROWN_DUELIST_GATE.reviewAnimations.raw.artifact, EN_E06_PETALCROWN_DUELIST_GATE.reviewAnimations.raw.sha256],
  [EN_E06_PETALCROWN_DUELIST_GATE.reviewAnimations.completeBForm.artifact, EN_E06_PETALCROWN_DUELIST_GATE.reviewAnimations.completeBForm.sha256],
];
for (const [artifact, expectedHash] of artifactEntries) {
  const actualHash = await sha256File(artifact);
  check(expectedHash && actualHash === expectedHash, `${artifact} is missing its frozen hash or drifted from it`);
}
for (const animation of Object.values(EN_E06_PETALCROWN_DUELIST_GATE.reviewAnimations)) {
  check(animation.width === 640 && animation.height === 672 && animation.frames === 4 && animation.durationMs === 720, 'each full-suite GIF must retain the 640x672 four-phase 720 ms contract');
}

rejects(() => engine.renderEnemyExpansionFrame(EN_E06_PETALCROWN_DUELIST_REGISTRY, brambleSpec, 'down', 'idle', 0, {}), 'is not implemented', 'Bramblewing rendering through the elite registry');
rejects(() => engine.renderEnemyExpansionFrame(EN_E06_PETALCROWN_DUELIST_REGISTRY, thistleSpec, 'down', 'idle', 0, {}), 'is not implemented', 'Thistle rendering through the elite registry');
for (const familyId of ['hag', 'dryad', 'redcap', 'nymph']) {
  rejects(() => engine.renderEnemyExpansionFrame(EN_E06_PETALCROWN_DUELIST_REGISTRY, { kind: 'enemy', family: familyId, variant: 'planned' }, 'down', 'idle', 0, {}), 'is not implemented', `${familyId} rendering`);
}

if (errors.length) {
  console.error('EN-E06 Fairy Petalcrown Duelist focused validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('EN-E06 Fairy Petalcrown Duelist focused gate passed.');
console.log('- Exact scope: one internal Fairy/Petalcrown Duelist / 80 frames / 4 directions / 6 animation rows');
console.log(`- Thistle distinction: ${thistleDifferences}/80 pixel frames and ${thistleAlphaDifferences}/80 alpha silhouettes differ`);
console.log(`- Bramblewing distinction: ${brambleDifferences}/80 pixel frames and ${brambleAlphaDifferences}/80 alpha silhouettes differ`);
console.log(`- Structure: ${connectedFrames}/80 connected; ${boundedFrames}/80 one-cell margins; ${groundClearFrames}/80 ground-clear; opaque range ${minOpaquePixels}-${maxOpaquePixels}`);
console.log(`- Identity: ${coloredIdentityFrames}/72 colored crown-wing frames; ${flashFrames}/8 exact white alias flashes`);
console.log('- Motion: 2 Idle, 4 Walk, 4 Attack, 2 Hurt frames distinct per direction; Cast/Death aliases exact');
console.log(`- Presentation: Complete B +${completeBAddedPixels} outline pixels; Form changes ${formChangedPixels} source pixels`);
console.log('- Protected boundaries: Bramblewing, Thistle, and approved Petalcrown exact; Mire Crone is a later private lane; public catalog 74/245; fixtures unchanged');
console.log('- Review artifacts: 5/5 present and hash-verified');
console.log(`- Candidate digest: ${candidateFrameDigest}`);
