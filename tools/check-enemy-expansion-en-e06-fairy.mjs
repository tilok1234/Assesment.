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
  EN_E06_FAIRY_IDLE_GATE,
  EN_E06_FAIRY_IDLE_REGISTRY,
} from '../engine/enemy-expansion-en-e06-fairy-idle.js';
import {
  EN_E06_FAIRY_CONTRACT,
  EN_E06_FAIRY_DEATH_SOURCE_FRAMES,
  EN_E06_FAIRY_FAMILY,
  EN_E06_FAIRY_GATE,
  EN_E06_FAIRY_REGISTRY,
} from '../engine/enemy-expansion-en-e06-fairy.js';
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
const candidateSpec = Object.freeze({ kind: 'enemy', family: 'fairy', variant: 'bramblewing-scout' });

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

function horizontalWingWindows(pixels, wingColors) {
  let windows = 0;
  for (let y = 0; y < engine.SIZE; y++) for (let x = 1; x < engine.SIZE - 1; x++) {
    const index = (y * engine.SIZE) + x;
    if (pixels[index] !== null) continue;
    let leftWing = false;
    let rightWing = false;
    for (let probe = x - 1; probe >= 0; probe--) {
      if (wingColors.has(pixels[(y * engine.SIZE) + probe])) {
        leftWing = true;
        break;
      }
    }
    for (let probe = x + 1; probe < engine.SIZE; probe++) {
      if (wingColors.has(pixels[(y * engine.SIZE) + probe])) {
        rightWing = true;
        break;
      }
    }
    if (leftWing && rightWing) windows++;
  }
  return windows;
}

function frameKey(direction, animation, frame) {
  return `${direction}/${animation}/${frame}`;
}

function frameRecord(captured, direction, animation, frame) {
  return {
    family: 'fairy',
    variant: 'bramblewing-scout',
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

check(EN_E05_CONSUMER_INTEGRATION_GATE.id === 'en-e05-assembler-consumers-v1', 'the Fairy suite must retain the exact EN-E05 consumer predecessor');
check(EN_E05_CONSUMER_INTEGRATION_GATE.consumerFrameDigest === '947cec4df921761cd5eba378991d7a35b3d773d7e5c0e7c80526ecc6a846a46f', 'the approved EN-E05 public frame digest drifted');
check(ENEMY_EXPANSION_LEDGER.find((entry) => entry.id === 'EN-E06')?.gate === 'eight-enemy-registration-authorized-2026-08-09', 'the EN-E06 ledger must preserve Bramblewing while recording the eight-enemy registration');

check(EN_E06_FAIRY_IDLE_GATE.status === 'approved', 'the Fairy Idle predecessor must retain exact designer approval');
check(EN_E06_FAIRY_IDLE_GATE.approvedOn === '2026-08-09', 'the Fairy Idle approval date drifted');
check(EN_E06_FAIRY_IDLE_GATE.approvalEvidence.includes('very good,. but lately we been doing all animations for 1 sprite each pass'), 'the Idle gate must retain the exact designer approval and cadence correction');
check(EN_E06_FAIRY_IDLE_GATE.nextGate.includes('remaining Bramblewing Scout Walk, Attack, Cast aliases, Hurt, and Death aliases'), 'the approved Idle gate must authorize only the rest of this sprite');

check(EN_E06_FAIRY_GATE.id === 'en-e06-fairy-bramblewing-scout-full-v1', 'the Fairy full-suite gate id drifted');
check(EN_E06_FAIRY_GATE.status === 'approved', 'the complete Fairy must retain exact designer approval');
check(EN_E06_FAIRY_GATE.authorizedOn === '2026-08-09', 'the Fairy full-suite authorization date drifted');
check(EN_E06_FAIRY_GATE.authorizationEvidence.includes('all animations for 1 sprite each pass'), 'the full gate must retain the corrected one-complete-sprite cadence');
check(EN_E06_FAIRY_GATE.approvedOn === '2026-08-09', 'the Fairy full-suite approval date drifted');
check(EN_E06_FAIRY_GATE.approvalEvidence.includes('the designer replied: approved') && EN_E06_FAIRY_GATE.approvalEvidence.includes('frozen 80-frame candidate'), 'the full gate must retain the exact designer approval and bounded publication evidence');
check(EN_E06_FAIRY_GATE.publishedImplementation === 'cc92ca9bb14f9fa7937a7e1e746d55fb754d9653', 'the exact published Fairy implementation checkpoint drifted');
check(EN_E06_FAIRY_GATE.precedingApproval.gateId === EN_E06_FAIRY_IDLE_GATE.id, 'the full gate must identify the approved Idle predecessor');
check(EN_E06_FAIRY_GATE.precedingApproval.candidateFrameDigest === EN_E06_FAIRY_IDLE_GATE.candidateFrameDigest, 'the full gate must freeze the approved Idle digest');
check(EN_E06_FAIRY_GATE.scope.includes('complete 80-frame Bramblewing Scout') && EN_E06_FAIRY_GATE.scope.includes('Cast-to-Attack') && EN_E06_FAIRY_GATE.scope.includes('Death-to-Hurt'), 'the full gate must retain the complete suite and exact alias scope');
check(EN_E06_FAIRY_GATE.animationContract.includes('byte-identical') && EN_E06_FAIRY_GATE.animationContract.includes('attached thorn-needle thrust'), 'the animation contract must preserve Idle and the body-held attack tell');
check(EN_E06_FAIRY_GATE.exclusions.includes('Thistle Hexer implementation') && EN_E06_FAIRY_GATE.exclusions.includes('Hag implementation') && EN_E06_FAIRY_GATE.exclusions.includes('asset-pack fixture generation or regeneration') && EN_E06_FAIRY_GATE.exclusions.includes('public Fairy registration'), 'the full gate must exclude other sprites, fixtures, and registration');
check(EN_E06_FAIRY_GATE.nextGate.includes('published at cc92ca9bb14f9fa7937a7e1e746d55fb754d9653') && EN_E06_FAIRY_GATE.nextGate.includes('Stop for a separate continuation'), 'the approved full gate must retain the published checkpoint and stop before another sprite');
check(Object.isFrozen(EN_E06_FAIRY_GATE) && Object.isFrozen(EN_E06_FAIRY_GATE.precedingApproval) && Object.isFrozen(EN_E06_FAIRY_GATE.exclusions), 'the Fairy full gate must be deeply immutable');

check(EN_E06_FAIRY_CONTRACT.family === 'fairy' && EN_E06_FAIRY_CONTRACT.variant === 'bramblewing-scout', 'the full contract must remain one Fairy/Bramblewing Scout');
check(EN_E06_FAIRY_CONTRACT.chassis === 'small-winged-fey-v1', 'the approved small-winged-fey chassis drifted');
check(EN_E06_FAIRY_CONTRACT.effectBoundary.includes('remain external'), 'the full contract must keep effects external');
check(Object.isFrozen(EN_E06_FAIRY_CONTRACT) && Object.isFrozen(EN_E06_FAIRY_IDLE_DATA), 'the contract and renderer data must remain immutable');

const expectedFamilies = ['fairy', 'hag', 'dryad', 'redcap', 'nymph'];
check(EN_E06_CONTRACT_CARDS.length === 5, 'EN-E06 must retain exactly five family contract cards');
check(JSON.stringify(EN_E06_CONTRACT_CARDS.map((card) => card.id)) === JSON.stringify(expectedFamilies), 'the EN-E06 contract-card order drifted');
check(EN_E06_FAIRY_CONTRACT_CARD.variants[0].status === 'implemented-full-approved', 'Bramblewing Scout must retain the approved full-suite status in the shared contract card');
check(EN_E06_FAIRY_CONTRACT_CARD.variants[1].status === 'implemented-full-approved', 'Thistle Hexer must retain its separately approved full-suite status');
check(EN_E06_FAIRY_CONTRACT_CARD.variants[2].status === 'implemented-full-approved', 'Petalcrown Duelist must retain its separately approved full-suite status');
check(EN_E06_CONTRACT_CARDS[1].variants[0].status === 'implemented-full-approved', 'the later approved Mire Crone lane must remain visible without changing the approved Bramblewing gate');
check(EN_E06_CONTRACT_CARDS[1].variants[1].status === 'implemented-full-approved', 'the later approved Cauldron Hexer must remain visible without changing the approved Bramblewing gate');
check(EN_E06_CONTRACT_CARDS[1].variants[2].status === 'implemented-full-approved', 'Blackthorn Matron must retain its full approval');
check(EN_E06_CONTRACT_CARDS[2].variants.map(({ status }) => status).join('/') === 'implemented-full-approved/implemented-full-approved/implemented-full-approved', 'Dryad role-order status drifted');
  check(EN_E06_CONTRACT_CARDS[3].variants.every(({ status }) => status === 'implemented-full-approved'), 'all Redcap role-order statuses must remain approved');
check(EN_E06_CONTRACT_CARDS[4].variants.map(({ status }) => status).join('/') === 'implemented-full-approved/implemented-full-approved/implemented-full-candidate', 'Nymph role-order status drifted');

check(EN_E06_FAIRY_REGISTRY.families.length === 1, 'the full candidate registry must contain exactly one family');
check(EN_E06_FAIRY_REGISTRY.publicFamilies.length === 0, 'the full candidate registry must expose zero public families');
check(EN_E06_FAIRY_FAMILY.variants.length === 1 && EN_E06_FAIRY_FAMILY.variants[0].id === 'bramblewing-scout', 'the full candidate must contain only Bramblewing Scout');
check(EN_E06_FAIRY_REGISTRY.renderers[0].chassis === 'small-winged-fey-v1', 'the full registry chassis drifted');
check(EN_E06_FAIRY_IDLE_DATA.bakedEffects.length === 0, 'the Fairy source must retain zero baked effects');

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && engine.PUBLIC_ENEMIES.length === 80 && publicVariantCount === 259, 'the Fairy source suite must retain the 57/202 legacy and current 80/259 public catalog boundaries');
check(engine.PUBLIC_ENEMIES.some((family) => family.id === 'fairy'), 'the later approved registration must expose Fairy in the public catalog');
check(engine.EN_E06_FAIRY_REGISTRY === undefined && engine.EN_E06_FAIRY_GATE === undefined, 'the full Fairy candidate must not leak through the public engine facade');
const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!publicSource.includes('enemy-expansion-en-e06-fairy') && !facadeSource.includes('enemy-expansion-en-e06-fairy'), 'public engine modules must not import the private Fairy lane');
const assetManifest = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
check(!assetManifest.includes('bramblewing-scout'), 'the frozen asset-pack manifest must not contain Bramblewing Scout');

const captures = new Map();
const candidateRecords = [];
const skinColors = new Set(EN_E06_FAIRY_IDLE_DATA.fairy.skin);
const hairColors = new Set(EN_E06_FAIRY_IDLE_DATA.fairy.hair);
const wingColors = new Set(EN_E06_FAIRY_IDLE_DATA.fairy.wing);
const goldColors = new Set(EN_E06_FAIRY_IDLE_DATA.fairy.gold);
let connectedFrames = 0;
let boundedFrames = 0;
let groundClearFrames = 0;
let coloredIdentityFrames = 0;
let flashFrames = 0;
let wingWindowFrames = 0;
let completeBAddedPixels = 0;
let formChangedPixels = 0;
let minOpaquePixels = Number.POSITIVE_INFINITY;
let maxOpaquePixels = 0;

for (const animation of animations) for (const direction of directions) for (let frame = 0; frame < animation.frames; frame++) {
  const key = frameKey(direction, animation.id, frame);
  const captured = captureEnemyExpansionFrame(EN_E06_FAIRY_REGISTRY, candidateSpec, direction, animation.id, frame);
  captures.set(key, captured);
  candidateRecords.push(frameRecord(captured, direction, animation.id, frame));

  check(captured.outOfBoundsWrites.length === 0, `${key} wrote outside the 24x24 cell`);
  check(captured.alpha.every((value) => value === 0 || value === 255), `${key} must retain hard alpha`);
  const bounded = captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22;
  check(bounded, `${key} must preserve a one-cell margin`);
  if (bounded) boundedFrames++;
  const groundClear = captured.bounds && captured.bounds.maxY <= 20;
  check(groundClear, `${key} must retain at least three clear rows below the hover`);
  if (groundClear) groundClearFrames++;
  const components = componentCount(captured.pixels);
  check(components === 1, `${key} must remain one connected wing-body-weapon silhouette, found ${components}`);
  if (components === 1) connectedFrames++;
  check(captured.opaquePixels >= 100 && captured.opaquePixels <= 220, `${key} has implausible compact-Fairy density ${captured.opaquePixels}`);
  minOpaquePixels = Math.min(minOpaquePixels, captured.opaquePixels);
  maxOpaquePixels = Math.max(maxOpaquePixels, captured.opaquePixels);

  if (isWhiteFlash(animation.id, frame)) {
    const colors = new Set(captured.pixels.filter((color) => color !== null));
    check(colors.size === 1 && colors.has('#f4f4f4'), `${key} must be a complete white recoil flash`);
    flashFrames++;
  } else {
    check(countColors(captured.pixels, skinColors) >= (direction === 'up' ? 8 : 18), `${key} must retain direction-appropriate warm skin planes`);
    check(countColors(captured.pixels, hairColors) >= 28, `${key} must retain the plum hair and bodice identity`);
    check(countColors(captured.pixels, wingColors) >= 44, `${key} must retain connected leaf and wing planes`);
    check(countColors(captured.pixels, goldColors) >= 3, `${key} must retain gold fasteners or attached needle fittings`);
    const windows = horizontalWingWindows(captured.pixels, wingColors);
    check(windows >= 2, `${key} must retain visible hard-alpha wing-window negative space`);
    if (windows >= 2) wingWindowFrames++;
    coloredIdentityFrames++;
  }

  check(captured.renderResult.fairyGate === EN_E06_FAIRY_GATE.id, `${key} must report the full Fairy gate`);
  check(captured.renderResult.approvedIdleGate === EN_E06_FAIRY_IDLE_GATE.id && captured.renderResult.idlePixelsPreserved === true, `${key} must report the approved Idle predecessor`);
  check(captured.renderResult.alphaPolicy === 'binary-open-lattice-negative-space', `${key} must report the hard-alpha wing policy`);
  check(captured.renderResult.effectBoundary === 'external-glow-pollen-sparkles-trails-and-impact-light', `${key} must report the external-effect boundary`);

  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E06_FAIRY_IDLE_DATA);
  const additions = presentation.formComplete.reduce((sum, color, index) => sum + (color && !captured.pixels[index] ? 1 : 0), 0);
  const formChanges = presentation.form.reduce((sum, color, index) => sum + (captured.pixels[index] && color !== captured.pixels[index] ? 1 : 0), 0);
  check(additions > 0, `${key} must receive Complete B outline pixels`);
  completeBAddedPixels += additions;
  formChangedPixels += formChanges;
}

let approvedIdleFrames = 0;
for (const direction of directions) for (let frame = 0; frame < 2; frame++) {
  const approved = captureEnemyExpansionFrame(EN_E06_FAIRY_IDLE_REGISTRY, candidateSpec, direction, 'idle', frame);
  const full = captures.get(frameKey(direction, 'idle', frame));
  check(JSON.stringify(full.pixels) === JSON.stringify(approved.pixels), `${direction} Idle F${frame + 1} drifted from the approved baseline`);
  check(full.digest === approved.digest && full.alphaDigest === approved.alphaDigest, `${direction} Idle F${frame + 1} digest drifted from the approved baseline`);
  if (full.digest === approved.digest) approvedIdleFrames++;
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
    const sourceFrame = EN_E06_FAIRY_DEATH_SOURCE_FRAMES[frame];
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
check(candidateRecords.length === 80, 'the focused gate must exhaust all 80 Bramblewing Scout frames');
check(candidateFrameDigest === EN_E06_FAIRY_GATE.candidateFrameDigest, 'the frozen 80-frame Fairy digest drifted');
check(approvedIdleFrames === 8, 'all eight approved Idle frames must remain byte-identical');
check(connectedFrames === 80 && boundedFrames === 80 && groundClearFrames === 80, 'all 80 frames must remain connected, bounded, and ground-clear');
check(coloredIdentityFrames === 72 && flashFrames === 8 && wingWindowFrames === 72, 'the suite must retain 72 colored wing-window frames and eight exact white alias flashes');
check(completeBAddedPixels > 0 && formChangedPixels > 0, 'the full suite must support Complete B and Form presentation');

const artifactEntries = [
  [EN_E06_FAIRY_GATE.artifact, EN_E06_FAIRY_GATE.artifactSha256],
  [EN_E06_FAIRY_GATE.assembledArtifact, EN_E06_FAIRY_GATE.assembledArtifactSha256],
  [EN_E06_FAIRY_GATE.reviewAnimations.raw.artifact, EN_E06_FAIRY_GATE.reviewAnimations.raw.sha256],
  [EN_E06_FAIRY_GATE.reviewAnimations.completeBForm.artifact, EN_E06_FAIRY_GATE.reviewAnimations.completeBForm.sha256],
];
for (const [artifact, expectedHash] of artifactEntries) check(await sha256File(artifact) === expectedHash, `${artifact} drifted from its frozen hash`);
for (const animation of Object.values(EN_E06_FAIRY_GATE.reviewAnimations)) {
  check(animation.width === 640 && animation.height === 672 && animation.frames === 4 && animation.durationMs === 720, 'each full-suite GIF must retain the 640x672 four-phase 720 ms contract');
}

rejects(() => engine.renderEnemyExpansionFrame(EN_E06_FAIRY_REGISTRY, { kind: 'enemy', family: 'fairy', variant: 'thistle-hexer' }, 'down', 'idle', 0, {}), 'is not implemented', 'Thistle Hexer rendering');
rejects(() => engine.renderEnemyExpansionFrame(EN_E06_FAIRY_REGISTRY, { kind: 'enemy', family: 'fairy', variant: 'petalcrown-duelist' }, 'down', 'idle', 0, {}), 'is not implemented', 'Petalcrown Duelist rendering');
for (const familyId of ['hag', 'dryad', 'redcap', 'nymph']) {
  rejects(() => engine.renderEnemyExpansionFrame(EN_E06_FAIRY_REGISTRY, { kind: 'enemy', family: familyId, variant: 'planned' }, 'down', 'idle', 0, {}), 'is not implemented', `${familyId} rendering`);
}

if (errors.length) {
  console.error('EN-E06 Fairy Bramblewing Scout focused validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('EN-E06 Fairy Bramblewing Scout focused gate passed.');
console.log('- Exact scope: one internal Fairy/Bramblewing Scout / 80 frames / 4 directions / 6 animation rows');
console.log(`- Approved Idle preservation: ${approvedIdleFrames}/8 byte-identical frames`);
console.log(`- Structure: ${connectedFrames}/80 connected; ${boundedFrames}/80 one-cell margins; ${groundClearFrames}/80 ground-clear; opaque range ${minOpaquePixels}-${maxOpaquePixels}`);
console.log(`- Identity: ${coloredIdentityFrames}/72 colored frames with hard-alpha wing windows; ${flashFrames}/8 exact white alias flashes`);
console.log('- Motion: 2 Idle, 4 Walk, 4 Attack, 2 Hurt frames distinct per direction; Cast/Death aliases exact');
console.log(`- Presentation: Complete B +${completeBAddedPixels} outline pixels; Form changes ${formChangedPixels} source pixels`);
console.log('- Protected boundaries: source pixels exact; public catalog 80/259; fixtures unchanged');
console.log('- Review artifacts: 4/4 present and hash-verified');
console.log(`- Candidate digest: ${candidateFrameDigest}`);
