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
import {
  EN_E06_FAIRY_GATE,
  EN_E06_FAIRY_REGISTRY,
} from '../engine/enemy-expansion-en-e06-fairy.js';
import {
  EN_E06_THISTLE_HEXER_CONTRACT,
  EN_E06_THISTLE_HEXER_DATA,
  EN_E06_THISTLE_HEXER_DEATH_SOURCE_FRAMES,
  EN_E06_THISTLE_HEXER_FAMILY,
  EN_E06_THISTLE_HEXER_GATE,
  EN_E06_THISTLE_HEXER_REGISTRY,
} from '../engine/enemy-expansion-en-e06-fairy-thistle-hexer.js';
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

const directions = Object.freeze(['down', 'left', 'right', 'up']);
const animations = Object.freeze([
  { id: 'idle', frames: 2 },
  { id: 'walk', frames: 4 },
  { id: 'attack', frames: 4 },
  { id: 'cast', frames: 4 },
  { id: 'hurt', frames: 2 },
  { id: 'death', frames: 4 },
]);
const candidateSpec = Object.freeze({ kind: 'enemy', family: 'fairy', variant: 'thistle-hexer' });
const precedingSpec = Object.freeze({ kind: 'enemy', family: 'fairy', variant: 'bramblewing-scout' });

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

check(EN_E05_CONSUMER_INTEGRATION_GATE.id === 'en-e05-assembler-consumers-v1', 'the Thistle Hexer lane must retain the exact EN-E05 consumer predecessor');
check(EN_E05_CONSUMER_INTEGRATION_GATE.consumerFrameDigest === '947cec4df921761cd5eba378991d7a35b3d773d7e5c0e7c80526ecc6a846a46f', 'the approved EN-E05 public digest drifted');
check(ENEMY_EXPANSION_LEDGER.find((entry) => entry.id === 'EN-E06')?.gate === 'eight-enemy-registration-authorized-2026-08-09', 'the EN-E06 ledger must preserve Thistle while recording the eight-enemy registration');

check(EN_E06_FAIRY_GATE.status === 'approved', 'the Bramblewing Scout predecessor must retain exact approval');
check(EN_E06_FAIRY_GATE.publishedImplementation === 'cc92ca9bb14f9fa7937a7e1e746d55fb754d9653', 'the published Bramblewing implementation drifted');
check(EN_E06_THISTLE_HEXER_GATE.id === 'en-e06-fairy-thistle-hexer-full-v1', 'the Thistle Hexer gate id drifted');
check(EN_E06_THISTLE_HEXER_GATE.status === 'approved', 'Thistle Hexer must retain exact designer approval');
check(EN_E06_THISTLE_HEXER_GATE.authorizedOn === '2026-08-09', 'the Thistle Hexer authorization date drifted');
check(EN_E06_THISTLE_HEXER_GATE.approvedOn === '2026-08-09', 'the Thistle Hexer approval date drifted');
check(EN_E06_THISTLE_HEXER_GATE.approvalEvidence.includes('designer replied: awesome! approved') && EN_E06_THISTLE_HEXER_GATE.approvalEvidence.includes('frozen 80-frame Thistle Hexer candidate') && EN_E06_THISTLE_HEXER_GATE.approvalEvidence.includes('bounded commit and branch publication'), 'the gate must retain the exact designer approval and bounded publication evidence');
check(EN_E06_THISTLE_HEXER_GATE.publishedImplementation === '3dc68cbae16acd2564d81607ac5a1ca1d569fbee', 'the exact published Thistle Hexer implementation checkpoint drifted');
check(EN_E06_THISTLE_HEXER_GATE.authorizationEvidence.includes('lets do next') && EN_E06_THISTLE_HEXER_GATE.authorizationEvidence.includes('one complete 80-frame variant pass'), 'the gate must retain the explicit next-variant authorization and one-sprite cadence');
check(EN_E06_THISTLE_HEXER_GATE.precedingApproval.gateId === EN_E06_FAIRY_GATE.id, 'the gate must identify Bramblewing Scout as its approved predecessor');
check(EN_E06_THISTLE_HEXER_GATE.precedingApproval.candidateFrameDigest === EN_E06_FAIRY_GATE.candidateFrameDigest, 'the gate must retain the approved Bramblewing digest');
check(EN_E06_THISTLE_HEXER_GATE.precedingApproval.publishedImplementation === EN_E06_FAIRY_GATE.publishedImplementation && EN_E06_THISTLE_HEXER_GATE.precedingApproval.publishedHandoff === 'c1165df', 'the gate must retain the exact published Bramblewing implementation and handoff');
check(EN_E06_THISTLE_HEXER_GATE.scope.includes('complete 80-frame Thistle Hexer') && EN_E06_THISTLE_HEXER_GATE.scope.includes('Cast-to-Attack') && EN_E06_THISTLE_HEXER_GATE.scope.includes('Death-to-Hurt'), 'the gate must retain the complete suite and alias scope');
check(EN_E06_THISTLE_HEXER_GATE.animationContract.includes('folded-wing hover') && EN_E06_THISTLE_HEXER_GATE.animationContract.includes('attached hex-point release'), 'the specialist motion contract must retain folded wings and the attached attack tell');
check(EN_E06_THISTLE_HEXER_GATE.exclusions.includes('changes to approved Bramblewing Scout source or pixels') && EN_E06_THISTLE_HEXER_GATE.exclusions.includes('Petalcrown Duelist implementation') && EN_E06_THISTLE_HEXER_GATE.exclusions.includes('Hag implementation') && EN_E06_THISTLE_HEXER_GATE.exclusions.includes('asset-pack fixture generation or regeneration'), 'the gate must protect Bramblewing and exclude later sprites and fixtures');
check(EN_E06_THISTLE_HEXER_GATE.nextGate.includes('published at 3dc68cbae16acd2564d81607ac5a1ca1d569fbee') && EN_E06_THISTLE_HEXER_GATE.nextGate.includes('Stop for a separate continuation') && EN_E06_THISTLE_HEXER_GATE.nextGate.includes('add Petalcrown Duelist') && EN_E06_THISTLE_HEXER_GATE.nextGate.includes('begin Hag'), 'the published Thistle Hexer lane must stop before another sprite');
check(Object.isFrozen(EN_E06_THISTLE_HEXER_GATE) && Object.isFrozen(EN_E06_THISTLE_HEXER_GATE.precedingApproval) && Object.isFrozen(EN_E06_THISTLE_HEXER_GATE.exclusions), 'the Thistle Hexer gate must be deeply immutable');

check(EN_E06_THISTLE_HEXER_CONTRACT.family === 'fairy' && EN_E06_THISTLE_HEXER_CONTRACT.variant === 'thistle-hexer', 'the candidate contract must remain one Fairy/Thistle Hexer');
check(EN_E06_THISTLE_HEXER_CONTRACT.role === 'specialist' && EN_E06_THISTLE_HEXER_CONTRACT.chassis === 'small-winged-fey-v1', 'Thistle Hexer must retain the specialist small-winged-fey contract');
check(EN_E06_THISTLE_HEXER_CONTRACT.effectBoundary.includes('remain external'), 'the specialist contract must keep curse effects external');
check(Object.isFrozen(EN_E06_THISTLE_HEXER_CONTRACT) && Object.isFrozen(EN_E06_THISTLE_HEXER_DATA), 'the contract and renderer data must remain immutable');

check(EN_E06_CONTRACT_CARDS.length === 5, 'EN-E06 must retain all five family contract cards');
check(EN_E06_FAIRY_CONTRACT_CARD.variants[0].status === 'implemented-full-approved', 'Bramblewing Scout must retain its approved full-suite status');
check(EN_E06_FAIRY_CONTRACT_CARD.variants[1].id === 'thistle-hexer' && EN_E06_FAIRY_CONTRACT_CARD.variants[1].status === 'implemented-full-approved', 'Thistle Hexer must be the approved specialist Fairy');
check(EN_E06_FAIRY_CONTRACT_CARD.variants[2].id === 'petalcrown-duelist' && EN_E06_FAIRY_CONTRACT_CARD.variants[2].status === 'implemented-full-approved', 'Petalcrown Duelist must retain its separately approved full-suite status');
check(EN_E06_CONTRACT_CARDS[1].variants[0].status === 'implemented-full-approved', 'the later approved Mire Crone lane must remain visible without changing the approved Thistle gate');
check(EN_E06_CONTRACT_CARDS[1].variants[1].status === 'implemented-full-approved', 'the later approved Cauldron Hexer must remain visible without changing the approved Thistle gate');
check(EN_E06_CONTRACT_CARDS[1].variants[2].status === 'implemented-full-approved', 'Blackthorn Matron must retain its full approval');
check(EN_E06_CONTRACT_CARDS[2].variants.map(({ status }) => status).join('/') === 'implemented-full-approved/implemented-full-approved/implemented-full-approved', 'Dryad role-order status drifted');
  check(EN_E06_CONTRACT_CARDS[3].variants.every(({ status }) => status === 'implemented-full-approved'), 'all Redcap role-order statuses must remain approved');
check(EN_E06_CONTRACT_CARDS[4].variants.map(({ status }) => status).join('/') === 'implemented-full-approved/implemented-full-approved/planned', 'Nymph role-order status drifted');

check(EN_E06_THISTLE_HEXER_DATA.alphaPolicy === 'binary-folded-petal-negative-space', 'the specialist renderer data must retain its hard-alpha folded-wing policy');
check(EN_E06_THISTLE_HEXER_DATA.effectBoundary.includes('external-curse-motes') && EN_E06_THISTLE_HEXER_DATA.bakedEffects.length === 0, 'curse motes and later effects must remain external');
check(EN_E06_THISTLE_HEXER_REGISTRY.families.length === 1 && EN_E06_THISTLE_HEXER_REGISTRY.publicFamilies.length === 0, 'the candidate registry must contain one internal family and expose none publicly');
check(EN_E06_THISTLE_HEXER_FAMILY.variants.length === 1 && EN_E06_THISTLE_HEXER_FAMILY.variants[0].id === 'thistle-hexer', 'the candidate registry must contain only Thistle Hexer');

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && engine.PUBLIC_ENEMIES.length === 80 && publicVariantCount === 259, 'the specialist source must retain the 57/202 legacy and current 80/259 public boundaries');
check(engine.PUBLIC_ENEMIES.some((family) => family.id === 'fairy'), 'the later approved registration must expose Fairy in the public catalog');
check(engine.EN_E06_THISTLE_HEXER_REGISTRY === undefined && engine.EN_E06_THISTLE_HEXER_GATE === undefined, 'Thistle Hexer must not leak through the public engine facade');
const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!publicSource.includes('enemy-expansion-en-e06-fairy-thistle-hexer') && !facadeSource.includes('enemy-expansion-en-e06-fairy-thistle-hexer'), 'public engine modules must not import the private specialist lane');
const assetManifest = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
check(!assetManifest.includes('thistle-hexer'), 'the frozen asset-pack manifest must not contain Thistle Hexer');

const captures = new Map();
const precedingCaptures = new Map();
const candidateRecords = [];
const precedingRecords = [];
const skinColors = new Set(EN_E06_THISTLE_HEXER_DATA.thistleHexer.skin);
const hairColors = new Set(EN_E06_THISTLE_HEXER_DATA.thistleHexer.hair);
const robeColors = new Set(EN_E06_THISTLE_HEXER_DATA.thistleHexer.robe);
const wingColors = new Set(EN_E06_THISTLE_HEXER_DATA.thistleHexer.wing);
const thornColors = new Set(EN_E06_THISTLE_HEXER_DATA.thistleHexer.thorn);
const bronzeColors = new Set(EN_E06_THISTLE_HEXER_DATA.thistleHexer.bronze);
let connectedFrames = 0;
let boundedFrames = 0;
let groundClearFrames = 0;
let coloredIdentityFrames = 0;
let flashFrames = 0;
let foldedWindowFrames = 0;
let candidateDifferences = 0;
let candidateAlphaDifferences = 0;
let completeBAddedPixels = 0;
let formChangedPixels = 0;
let minOpaquePixels = Number.POSITIVE_INFINITY;
let maxOpaquePixels = 0;

for (const animation of animations) for (const direction of directions) for (let frame = 0; frame < animation.frames; frame++) {
  const key = frameKey(direction, animation.id, frame);
  const captured = captureEnemyExpansionFrame(EN_E06_THISTLE_HEXER_REGISTRY, candidateSpec, direction, animation.id, frame);
  const preceding = captureEnemyExpansionFrame(EN_E06_FAIRY_REGISTRY, precedingSpec, direction, animation.id, frame);
  captures.set(key, captured);
  precedingCaptures.set(key, preceding);
  candidateRecords.push(frameRecord(captured, 'thistle-hexer', direction, animation.id, frame));
  precedingRecords.push(frameRecord(preceding, 'bramblewing-scout', direction, animation.id, frame));

  check(captured.outOfBoundsWrites.length === 0, `${key} wrote outside the 24x24 cell`);
  check(captured.alpha.every((value) => value === 0 || value === 255), `${key} must retain hard alpha`);
  const bounded = captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22;
  check(bounded, `${key} must preserve a one-cell margin`);
  if (bounded) boundedFrames++;
  const groundClear = captured.bounds && captured.bounds.maxY <= 20;
  check(groundClear, `${key} must retain at least three clear rows below the hover`);
  if (groundClear) groundClearFrames++;
  const components = componentCount(captured.pixels);
  check(components === 1, `${key} must remain one connected crown-wing-body-focus silhouette, found ${components}`);
  if (components === 1) connectedFrames++;
  check(captured.opaquePixels >= 120 && captured.opaquePixels <= 240, `${key} has implausible specialist-Fairy density ${captured.opaquePixels}`);
  minOpaquePixels = Math.min(minOpaquePixels, captured.opaquePixels);
  maxOpaquePixels = Math.max(maxOpaquePixels, captured.opaquePixels);

  if (JSON.stringify(captured.pixels) !== JSON.stringify(preceding.pixels)) candidateDifferences++;
  else check(false, `${key} must differ from approved Bramblewing Scout`);
  if (captured.alphaDigest !== preceding.alphaDigest) candidateAlphaDifferences++;

  if (isWhiteFlash(animation.id, frame)) {
    const colors = new Set(captured.pixels.filter((color) => color !== null));
    check(colors.size === 1 && colors.has('#f4f4f4'), `${key} must be a complete white recoil flash`);
    flashFrames++;
  } else {
    check(countColors(captured.pixels, skinColors) >= (direction === 'up' ? 8 : 12), `${key} must retain direction-appropriate warm skin planes`);
    check(countColors(captured.pixels, hairColors) >= 18, `${key} must retain deep plum hair planes`);
    check(countColors(captured.pixels, robeColors) >= 34, `${key} must retain the violet specialist robe`);
    check(countColors(captured.pixels, wingColors) >= 34, `${key} must retain folded thistle-wing planes`);
    check(countColors(captured.pixels, thornColors) >= 7, `${key} must retain the green-and-lilac thorn crown or focus`);
    check(countColors(captured.pixels, bronzeColors) >= 3, `${key} must retain bronze clasps or focus fittings`);
    const windows = enclosedTransparentPixels(captured.pixels);
    check(windows >= 1, `${key} must retain at least one hard-alpha folded-wing negative-space slit`);
    if (windows >= 1) foldedWindowFrames++;
    coloredIdentityFrames++;
  }

  check(captured.renderResult.thistleHexerGate === EN_E06_THISTLE_HEXER_GATE.id, `${key} must report the Thistle Hexer gate`);
  check(captured.renderResult.approvedPrecedingGate === EN_E06_FAIRY_GATE.id, `${key} must report approved Bramblewing Scout as its predecessor`);
  check(captured.renderResult.alphaPolicy === 'binary-folded-petal-negative-space', `${key} must report the folded-wing alpha policy`);
  check(captured.renderResult.effectBoundary === EN_E06_THISTLE_HEXER_DATA.effectBoundary, `${key} must report the external-effect boundary`);

  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E06_THISTLE_HEXER_DATA);
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
    const sourceFrame = EN_E06_THISTLE_HEXER_DEATH_SOURCE_FRAMES[frame];
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
const precedingFrameDigest = hashJson(precedingRecords);
check(candidateRecords.length === 80 && precedingRecords.length === 80, 'the focused gate must exhaust 80 candidate and 80 approved Bramblewing frames');
check(candidateFrameDigest === EN_E06_THISTLE_HEXER_GATE.candidateFrameDigest, 'the frozen 80-frame Thistle Hexer digest drifted');
check(precedingFrameDigest === EN_E06_THISTLE_HEXER_GATE.bramblewingComparisonDigest && precedingFrameDigest === EN_E06_FAIRY_GATE.candidateFrameDigest, 'the approved Bramblewing comparison digest drifted');
check(candidateDifferences === 80 && candidateAlphaDifferences === 80, 'all 80 Thistle Hexer frames and alpha silhouettes must differ from Bramblewing Scout');
check(connectedFrames === 80 && boundedFrames === 80 && groundClearFrames === 80, 'all 80 frames must remain connected, bounded, and ground-clear');
check(coloredIdentityFrames === 72 && flashFrames === 8 && foldedWindowFrames === 72, 'the suite must retain 72 colored folded-wing frames and eight exact white alias flashes');
check(completeBAddedPixels > 0 && formChangedPixels > 0, 'the full specialist suite must support Complete B and Form presentation');

const artifactEntries = [
  [EN_E06_THISTLE_HEXER_GATE.artifact, EN_E06_THISTLE_HEXER_GATE.artifactSha256],
  [EN_E06_THISTLE_HEXER_GATE.assembledArtifact, EN_E06_THISTLE_HEXER_GATE.assembledArtifactSha256],
  [EN_E06_THISTLE_HEXER_GATE.comparisonArtifact, EN_E06_THISTLE_HEXER_GATE.comparisonArtifactSha256],
  [EN_E06_THISTLE_HEXER_GATE.reviewAnimations.raw.artifact, EN_E06_THISTLE_HEXER_GATE.reviewAnimations.raw.sha256],
  [EN_E06_THISTLE_HEXER_GATE.reviewAnimations.completeBForm.artifact, EN_E06_THISTLE_HEXER_GATE.reviewAnimations.completeBForm.sha256],
];
for (const [artifact, expectedHash] of artifactEntries) check(await sha256File(artifact) === expectedHash, `${artifact} drifted from its frozen hash`);
for (const animation of Object.values(EN_E06_THISTLE_HEXER_GATE.reviewAnimations)) {
  check(animation.width === 640 && animation.height === 672 && animation.frames === 4 && animation.durationMs === 720, 'each full-suite GIF must retain the 640x672 four-phase 720 ms contract');
}

rejects(() => engine.renderEnemyExpansionFrame(EN_E06_THISTLE_HEXER_REGISTRY, { kind: 'enemy', family: 'fairy', variant: 'bramblewing-scout' }, 'down', 'idle', 0, {}), 'is not implemented', 'Bramblewing rendering through the specialist registry');
rejects(() => engine.renderEnemyExpansionFrame(EN_E06_THISTLE_HEXER_REGISTRY, { kind: 'enemy', family: 'fairy', variant: 'petalcrown-duelist' }, 'down', 'idle', 0, {}), 'is not implemented', 'Petalcrown Duelist rendering');
for (const familyId of ['hag', 'dryad', 'redcap', 'nymph']) {
  rejects(() => engine.renderEnemyExpansionFrame(EN_E06_THISTLE_HEXER_REGISTRY, { kind: 'enemy', family: familyId, variant: 'planned' }, 'down', 'idle', 0, {}), 'is not implemented', `${familyId} rendering`);
}

if (errors.length) {
  console.error('EN-E06 Fairy Thistle Hexer focused validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('EN-E06 Fairy Thistle Hexer focused gate passed.');
console.log('- Exact scope: one internal Fairy/Thistle Hexer / 80 frames / 4 directions / 6 animation rows');
console.log(`- Bramblewing distinction: ${candidateDifferences}/80 pixel frames and ${candidateAlphaDifferences}/80 alpha silhouettes differ`);
console.log(`- Structure: ${connectedFrames}/80 connected; ${boundedFrames}/80 one-cell margins; ${groundClearFrames}/80 ground-clear; opaque range ${minOpaquePixels}-${maxOpaquePixels}`);
console.log(`- Identity: ${coloredIdentityFrames}/72 colored folded-wing frames; ${flashFrames}/8 exact white alias flashes`);
console.log('- Motion: 2 Idle, 4 Walk, 4 Attack, 2 Hurt frames distinct per direction; Cast/Death aliases exact');
console.log(`- Presentation: Complete B +${completeBAddedPixels} outline pixels; Form changes ${formChangedPixels} source pixels`);
console.log('- Protected boundaries: approved Fairy sources exact; public catalog 80/259; fixtures unchanged');
console.log('- Review artifacts: 5/5 present and hash-verified');
console.log(`- Candidate digest: ${candidateFrameDigest}`);
console.log(`- Approved Bramblewing digest: ${precedingFrameDigest}`);
