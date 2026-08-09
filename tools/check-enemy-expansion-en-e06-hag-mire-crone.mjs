import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { EN_E01_PUBLIC_REGISTRY } from '../engine/enemy-expansion-en-e01.js';
import { ENEMY_EXPANSION_LEDGER } from '../engine/enemy-expansion.js';
import { EN_E06_CONTRACT_CARDS } from '../engine/enemy-expansion-en-e06-fairy-idle.js';
import { EN_E06_FAIRY_GATE, EN_E06_FAIRY_REGISTRY } from '../engine/enemy-expansion-en-e06-fairy.js';
import { EN_E06_THISTLE_HEXER_GATE, EN_E06_THISTLE_HEXER_REGISTRY } from '../engine/enemy-expansion-en-e06-fairy-thistle-hexer.js';
import { EN_E06_PETALCROWN_DUELIST_GATE, EN_E06_PETALCROWN_DUELIST_REGISTRY } from '../engine/enemy-expansion-en-e06-fairy-petalcrown-duelist.js';
import {
  EN_E06_MIRE_CRONE_CONTRACT,
  EN_E06_MIRE_CRONE_DATA,
  EN_E06_MIRE_CRONE_DEATH_SOURCE_FRAMES,
  EN_E06_MIRE_CRONE_FAMILY,
  EN_E06_MIRE_CRONE_GATE,
  EN_E06_MIRE_CRONE_REGISTRY,
} from '../engine/enemy-expansion-en-e06-hag-mire-crone.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import { captureEnemyExpansionFrame } from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const directions = Object.freeze(['down', 'left', 'right', 'up']);
const animations = Object.freeze([
  { id: 'idle', frames: 2 }, { id: 'walk', frames: 4 }, { id: 'attack', frames: 4 },
  { id: 'cast', frames: 4 }, { id: 'hurt', frames: 2 }, { id: 'death', frames: 4 },
]);
const candidateSpec = Object.freeze({ kind: 'enemy', family: 'hag', variant: 'mire-crone' });
const witchSpec = Object.freeze({ kind: 'enemy', family: 'witch', variant: 'hexer' });
const fairySpecs = Object.freeze([
  { registry: EN_E06_FAIRY_REGISTRY, spec: { kind: 'enemy', family: 'fairy', variant: 'bramblewing-scout' }, gate: EN_E06_FAIRY_GATE },
  { registry: EN_E06_THISTLE_HEXER_REGISTRY, spec: { kind: 'enemy', family: 'fairy', variant: 'thistle-hexer' }, gate: EN_E06_THISTLE_HEXER_GATE },
  { registry: EN_E06_PETALCROWN_DUELIST_REGISTRY, spec: { kind: 'enemy', family: 'fairy', variant: 'petalcrown-duelist' }, gate: EN_E06_PETALCROWN_DUELIST_GATE },
]);

function frameKey(direction, animation, frame) { return [direction, animation, frame].join('/'); }
function hashJson(value) { return createHash('sha256').update(JSON.stringify(value)).digest('hex'); }
function frameRecord(captured, spec, direction, animation, frame) {
  return { family: spec.family, variant: spec.variant, direction, animation, frame, digest: captured.digest, alphaDigest: captured.alphaDigest, opaquePixels: captured.opaquePixels, bounds: captured.bounds };
}
function fairyFrameRecord(captured, variant, direction, animation, frame) {
  return { family: 'fairy', variant, candidateFamily: 'fairy', direction, animation, frame, digest: captured.digest, alphaDigest: captured.alphaDigest, opaquePixels: captured.opaquePixels, bounds: captured.bounds };
}
function mirrorPixels(pixels) {
  const mirrored = new Array(24 * 24).fill(null);
  for (let y = 0; y < 24; y++) for (let x = 0; x < 24; x++) mirrored[(y * 24) + (23 - x)] = pixels[(y * 24) + x];
  return mirrored;
}
function componentCount(pixels) {
  const seen = new Set();
  let components = 0;
  for (let index = 0; index < pixels.length; index++) {
    if (pixels[index] === null || seen.has(index)) continue;
    components++;
    const queue = [index];
    seen.add(index);
    while (queue.length) {
      const current = queue.pop();
      const x = current % 24;
      const neighbors = [current - 24, current + 24, x > 0 ? current - 1 : -1, x < 23 ? current + 1 : -1];
      for (const neighbor of neighbors) if (neighbor >= 0 && neighbor < pixels.length && pixels[neighbor] !== null && !seen.has(neighbor)) {
        seen.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return components;
}
function countColors(pixels, colors) { return pixels.reduce((sum, color) => sum + (colors.has(color) ? 1 : 0), 0); }
async function sha256File(relativePath) {
  return createHash('sha256').update(await readFile(path.join(root, relativePath))).digest('hex');
}
function rejects(action, expected, label) {
  try { action(); errors.push(`${label} must reject`); }
  catch (error) { check(String(error.message).includes(expected), `${label} rejected with unexpected message: ${error.message}`); }
}

check(EN_E06_MIRE_CRONE_GATE.status === 'approved', 'Mire Crone must retain its explicit visual approval');
check(ENEMY_EXPANSION_LEDGER.find((entry) => entry.id === 'EN-E06')?.gate === 'eight-enemy-registration-authorized-2026-08-09', 'EN-E06 ledger must preserve Mire Crone while recording the eight-enemy registration');
check(EN_E06_MIRE_CRONE_GATE.approvedOn === '2026-08-09', 'Mire Crone approval date drifted');
check(EN_E06_MIRE_CRONE_GATE.approvalEvidence.includes('designer replied: approved') && EN_E06_MIRE_CRONE_GATE.approvalEvidence.includes('three exact PNGs were opened directly in Aseprite') && EN_E06_MIRE_CRONE_GATE.approvalEvidence.includes('bounded commit and branch publication'), 'Mire Crone gate must retain the exact visual approval evidence');
check(EN_E06_MIRE_CRONE_GATE.publishedImplementation === '25f67d4014437841f855ace2055de32abfeeaeeb', 'exact published Mire Crone implementation checkpoint drifted');
check(EN_E06_MIRE_CRONE_GATE.authorizationEvidence.includes('lets do nextr') && EN_E06_MIRE_CRONE_GATE.authorizationEvidence.includes('only one complete common Mire Crone 80-frame variant pass'), 'authorization evidence must retain the exact continuation and one-sprite scope');
check(EN_E06_MIRE_CRONE_GATE.precedingApproval.gateId === EN_E06_PETALCROWN_DUELIST_GATE.id, 'Mire Crone must retain Petalcrown as its approved predecessor');
check(EN_E06_MIRE_CRONE_GATE.precedingApproval.candidateFrameDigest === EN_E06_PETALCROWN_DUELIST_GATE.candidateFrameDigest, 'approved Petalcrown digest drifted at the Mire Crone gate');
check(EN_E06_MIRE_CRONE_GATE.scope.includes('complete 80-frame Mire Crone') && EN_E06_MIRE_CRONE_GATE.scope.includes('Cast-to-Attack') && EN_E06_MIRE_CRONE_GATE.scope.includes('Death-to-Hurt'), 'candidate gate must retain the full suite and alias scope');
check(EN_E06_MIRE_CRONE_GATE.animationContract.includes('leading arm') && EN_E06_MIRE_CRONE_GATE.animationContract.includes('broad connected claw rake'), 'candidate attack contract must retain coil and connected rake phases');
check(EN_E06_MIRE_CRONE_GATE.exclusions.includes('public Hag registration') && EN_E06_MIRE_CRONE_GATE.exclusions.includes('asset-pack fixture generation or regeneration') && EN_E06_MIRE_CRONE_GATE.exclusions.includes('Cauldron Hexer implementation'), 'candidate exclusions must protect registration, fixtures, and the next Hag');
check(EN_E06_MIRE_CRONE_GATE.nextGate.includes('published at 25f67d4014437841f855ace2055de32abfeeaeeb') && EN_E06_MIRE_CRONE_GATE.nextGate.includes('Stop for a separate continuation'), 'approved gate must retain the exact publication checkpoint and stop before another lane');
check(Object.isFrozen(EN_E06_MIRE_CRONE_GATE) && Object.isFrozen(EN_E06_MIRE_CRONE_GATE.exclusions), 'Mire Crone gate must be deeply immutable');

check(EN_E06_MIRE_CRONE_CONTRACT.family === 'hag' && EN_E06_MIRE_CRONE_CONTRACT.variant === 'mire-crone', 'candidate contract must remain Hag/Mire Crone');
check(EN_E06_MIRE_CRONE_CONTRACT.role === 'common' && EN_E06_MIRE_CRONE_CONTRACT.chassis === 'stooped-feral-fey-humanoid-v1', 'candidate must retain the common stooped feral-fey chassis');
check(EN_E06_MIRE_CRONE_CONTRACT.identity.includes('without a staff, hat, robe, familiar, or cauldron'), 'Hag identity must retain explicit equipped-Witch separation');
check(EN_E06_MIRE_CRONE_CONTRACT.effectBoundary.includes('remain external'), 'candidate effects must remain external');
check(Object.isFrozen(EN_E06_MIRE_CRONE_CONTRACT) && Object.isFrozen(EN_E06_MIRE_CRONE_DATA), 'candidate contract and renderer data must remain immutable');

check(EN_E06_CONTRACT_CARDS.length === 5, 'EN-E06 must retain all five family contract cards');
check(EN_E06_CONTRACT_CARDS[0].variants.every((variant) => variant.status === 'implemented-full-approved'), 'all three Fairy variants must remain approved');
check(EN_E06_CONTRACT_CARDS[1].id === 'hag' && EN_E06_CONTRACT_CARDS[1].variants[0].status === 'implemented-full-approved', 'Mire Crone must retain its approved full-suite status');
check(EN_E06_CONTRACT_CARDS[1].variants[1].status === 'implemented-full-approved', 'the separately approved Cauldron Hexer must remain visible without changing Mire Crone approval');
check(EN_E06_CONTRACT_CARDS[1].variants[2].status === 'implemented-full-approved', 'Blackthorn Matron must retain its full approval');
check(EN_E06_CONTRACT_CARDS[2].variants.map(({ status }) => status).join('/') === 'implemented-full-approved/implemented-full-approved/implemented-full-approved', 'Dryad role-order status drifted');
for (const card of EN_E06_CONTRACT_CARDS.slice(3)) check(card.variants.every((variant) => variant.status === 'planned'), `${card.id} must remain contract-only`);

check(EN_E06_MIRE_CRONE_DATA.alphaPolicy === 'binary-connected-feral-hag', 'candidate must retain its hard-alpha connected-silhouette policy');
check(EN_E06_MIRE_CRONE_DATA.bakedEffects.length === 0 && EN_E06_MIRE_CRONE_DATA.effectBoundary.includes('external-hex-bursts'), 'all Hag effect work must remain external');
check(EN_E06_MIRE_CRONE_REGISTRY.families.length === 1 && EN_E06_MIRE_CRONE_REGISTRY.publicFamilies.length === 0, 'candidate registry must contain one internal family and expose none publicly');
check(EN_E06_MIRE_CRONE_FAMILY.variants.length === 1 && EN_E06_MIRE_CRONE_FAMILY.variants[0].id === 'mire-crone', 'candidate registry must contain only Mire Crone');

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && engine.PUBLIC_ENEMIES.length === 80 && publicVariantCount === 259, 'the Hag source must retain the 57/202 legacy and current 80/259 public boundaries');
check(engine.PUBLIC_ENEMIES.some((family) => family.id === 'hag'), 'the later approved registration must expose Hag in the public catalog');
check(engine.EN_E06_MIRE_CRONE_REGISTRY === undefined && engine.EN_E06_MIRE_CRONE_GATE === undefined, 'Mire Crone must not leak through the public engine facade');
const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const facadeSource = await readFile(path.join(root, 'sprite-engine.js'), 'utf8');
check(!publicSource.includes('enemy-expansion-en-e06-hag-mire-crone') && !facadeSource.includes('enemy-expansion-en-e06-hag-mire-crone'), 'public modules must not import the private Hag lane');
const assetManifest = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
check(!assetManifest.includes('mire-crone'), 'frozen asset-pack manifest must not contain Mire Crone');

const captures = new Map();
const candidateRecords = [];
const witchRecords = [];
const paletteGroups = ['skin', 'hair', 'shawl', 'dress', 'claw'].map((name) => [name, new Set(EN_E06_MIRE_CRONE_DATA.mireCrone[name])]);
let connectedFrames = 0;
let boundedFrames = 0;
let groundedFrames = 0;
let coloredFrames = 0;
let flashFrames = 0;
let witchDifferences = 0;
let witchAlphaDifferences = 0;
let completeBAddedPixels = 0;
let formChangedPixels = 0;
let minOpaquePixels = Number.POSITIVE_INFINITY;
let maxOpaquePixels = 0;

for (const animation of animations) for (const direction of directions) for (let frame = 0; frame < animation.frames; frame++) {
  const key = frameKey(direction, animation.id, frame);
  const captured = captureEnemyExpansionFrame(EN_E06_MIRE_CRONE_REGISTRY, candidateSpec, direction, animation.id, frame);
  const witch = captureEnemyExpansionFrame(EN_E01_PUBLIC_REGISTRY, witchSpec, direction, animation.id, frame);
  captures.set(key, captured);
  candidateRecords.push(frameRecord(captured, candidateSpec, direction, animation.id, frame));
  witchRecords.push(frameRecord(witch, witchSpec, direction, animation.id, frame));

  check(captured.outOfBoundsWrites.length === 0, `${key} wrote outside the 24x24 cell`);
  check(captured.alpha.every((value) => value === 0 || value === 255), `${key} must retain hard alpha`);
  const bounded = captured.bounds && captured.bounds.minX >= 1 && captured.bounds.minY >= 1 && captured.bounds.maxX <= 22 && captured.bounds.maxY <= 22;
  check(bounded, `${key} must preserve a one-cell margin`);
  if (bounded) boundedFrames++;
  const grounded = captured.bounds && captured.bounds.maxY >= 20 && captured.bounds.maxY <= 22;
  check(grounded, `${key} must retain planted ground contact`);
  if (grounded) groundedFrames++;
  const components = componentCount(captured.pixels);
  check(components === 1, `${key} must remain one connected Hag silhouette, found ${components}`);
  if (components === 1) connectedFrames++;
  check(captured.opaquePixels >= 210 && captured.opaquePixels <= 265, `${key} has implausible Mire Crone density ${captured.opaquePixels}`);
  minOpaquePixels = Math.min(minOpaquePixels, captured.opaquePixels);
  maxOpaquePixels = Math.max(maxOpaquePixels, captured.opaquePixels);

  if (JSON.stringify(captured.pixels) !== JSON.stringify(witch.pixels)) witchDifferences++;
  else check(false, `${key} must differ from public Witch/Hexer`);
  if (captured.alphaDigest !== witch.alphaDigest) witchAlphaDifferences++;

  const whiteFlash = (animation.id === 'hurt' && frame === 0) || (animation.id === 'death' && frame === 0);
  if (whiteFlash) {
    const colors = new Set(captured.pixels.filter((color) => color !== null));
    check(colors.size === 1 && colors.has('#f4f4f4'), `${key} must be a complete white recoil flash`);
    flashFrames++;
  } else {
    for (const [name, colors] of paletteGroups) check(countColors(captured.pixels, colors) > 0, `${key} must retain ${name} identity pixels`);
    coloredFrames++;
  }
  check(captured.renderResult.mireCroneGate === EN_E06_MIRE_CRONE_GATE.id, `${key} must report the Mire Crone gate`);
  check(captured.renderResult.approvedPrecedingGate === EN_E06_PETALCROWN_DUELIST_GATE.id, `${key} must report approved Petalcrown as predecessor`);
  check(captured.renderResult.alphaPolicy === EN_E06_MIRE_CRONE_DATA.alphaPolicy, `${key} must report the candidate alpha policy`);
  check(captured.renderResult.effectBoundary === EN_E06_MIRE_CRONE_DATA.effectBoundary, `${key} must report the external-effect boundary`);

  const presentation = buildEnemyExpansionCandidatePresentation(captured.pixels, EN_E06_MIRE_CRONE_DATA);
  completeBAddedPixels += presentation.formComplete.reduce((sum, color, index) => sum + (color && !captured.pixels[index] ? 1 : 0), 0);
  formChangedPixels += presentation.form.reduce((sum, color, index) => sum + (captured.pixels[index] && color !== captured.pixels[index] ? 1 : 0), 0);
}

for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  check(JSON.stringify(captures.get(frameKey('left', animation.id, frame)).pixels) === JSON.stringify(mirrorPixels(captures.get(frameKey('right', animation.id, frame)).pixels)), `left/right mirror drifted for ${animation.id} frame ${frame + 1}`);
  check(captures.get(frameKey('down', animation.id, frame)).digest !== captures.get(frameKey('up', animation.id, frame)).digest, `Down/Up must remain distinct for ${animation.id} frame ${frame + 1}`);
}

for (const direction of directions) {
  for (let frame = 0; frame < 4; frame++) {
    check(JSON.stringify(captures.get(frameKey(direction, 'cast', frame)).pixels) === JSON.stringify(captures.get(frameKey(direction, 'attack', frame)).pixels), `${direction} Cast C${frame + 1} must alias Attack A${frame + 1}`);
    const sourceFrame = EN_E06_MIRE_CRONE_DEATH_SOURCE_FRAMES[frame];
    check(JSON.stringify(captures.get(frameKey(direction, 'death', frame)).pixels) === JSON.stringify(captures.get(frameKey(direction, 'hurt', sourceFrame)).pixels), `${direction} Death D${frame + 1} must alias Hurt H${sourceFrame + 1}`);
  }
  check(new Set([0, 1].map((frame) => captures.get(frameKey(direction, 'idle', frame)).digest)).size === 2, `${direction} Idle must contain two distinct frames`);
  check(new Set([0, 1, 2, 3].map((frame) => captures.get(frameKey(direction, 'walk', frame)).digest)).size === 4, `${direction} Walk must contain four distinct frames`);
  check(new Set([0, 1, 2, 3].map((frame) => captures.get(frameKey(direction, 'attack', frame)).digest)).size === 4, `${direction} Attack must contain four distinct frames`);
  check(new Set([0, 1].map((frame) => captures.get(frameKey(direction, 'hurt', frame)).digest)).size === 2, `${direction} Hurt must contain two distinct frames`);
}

const candidateFrameDigest = hashJson(candidateRecords);
const witchFrameDigest = hashJson(witchRecords);
check(candidateRecords.length === 80 && witchRecords.length === 80, 'focused gate must exhaust 80 candidate and 80 Witch comparison frames');
check(candidateFrameDigest === EN_E06_MIRE_CRONE_GATE.candidateFrameDigest, 'frozen 80-frame Mire Crone digest drifted');
check(witchFrameDigest === EN_E06_MIRE_CRONE_GATE.witchComparisonDigest, 'frozen public Witch comparison digest drifted');
check(witchDifferences === 80 && witchAlphaDifferences === 80, 'all 80 Hag frames and alpha silhouettes must differ from Witch');
check(connectedFrames === 80 && boundedFrames === 80 && groundedFrames === 80, 'all 80 frames must remain connected, bounded, and grounded');
check(coloredFrames === 72 && flashFrames === 8, 'suite must retain 72 colored frames and eight exact white alias flashes');
check(completeBAddedPixels > 0 && formChangedPixels > 0, 'full suite must support Complete B and Form presentation');

for (const approved of fairySpecs) {
  const records = [];
  for (const animation of animations) for (const direction of directions) for (let frame = 0; frame < animation.frames; frame++) {
    const captured = captureEnemyExpansionFrame(approved.registry, approved.spec, direction, animation.id, frame);
    records.push(fairyFrameRecord(captured, approved.spec.variant, direction, animation.id, frame));
  }
  check(hashJson(records) === approved.gate.candidateFrameDigest, `approved ${approved.spec.variant} 80-frame digest drifted`);
}

const artifactEntries = [
  [EN_E06_MIRE_CRONE_GATE.artifact, EN_E06_MIRE_CRONE_GATE.artifactSha256],
  [EN_E06_MIRE_CRONE_GATE.assembledArtifact, EN_E06_MIRE_CRONE_GATE.assembledArtifactSha256],
  [EN_E06_MIRE_CRONE_GATE.comparisonArtifact, EN_E06_MIRE_CRONE_GATE.comparisonArtifactSha256],
  [EN_E06_MIRE_CRONE_GATE.reviewAnimations.raw.artifact, EN_E06_MIRE_CRONE_GATE.reviewAnimations.raw.sha256],
  [EN_E06_MIRE_CRONE_GATE.reviewAnimations.completeBForm.artifact, EN_E06_MIRE_CRONE_GATE.reviewAnimations.completeBForm.sha256],
];
for (const [artifact, expectedHash] of artifactEntries) check(expectedHash && await sha256File(artifact) === expectedHash, `${artifact} is missing its frozen hash or drifted from it`);
for (const animation of Object.values(EN_E06_MIRE_CRONE_GATE.reviewAnimations)) check(animation.width === 640 && animation.height === 672 && animation.frames === 4 && animation.durationMs === 720, 'each full-suite GIF must retain the 640x672 four-phase 720 ms contract');

rejects(() => engine.renderEnemyExpansionFrame(EN_E06_MIRE_CRONE_REGISTRY, { kind: 'enemy', family: 'hag', variant: 'cauldron-hexer' }, 'down', 'idle', 0, {}), 'is not implemented', 'Cauldron Hexer rendering');
rejects(() => engine.renderEnemyExpansionFrame(EN_E06_MIRE_CRONE_REGISTRY, { kind: 'enemy', family: 'hag', variant: 'blackthorn-matron' }, 'down', 'idle', 0, {}), 'is not implemented', 'Blackthorn Matron rendering');
for (const familyId of ['fairy', 'dryad', 'redcap', 'nymph']) rejects(() => engine.renderEnemyExpansionFrame(EN_E06_MIRE_CRONE_REGISTRY, { kind: 'enemy', family: familyId, variant: 'planned' }, 'down', 'idle', 0, {}), 'is not implemented', `${familyId} rendering`);

if (errors.length) {
  console.error('EN-E06 Hag Mire Crone focused validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('EN-E06 Hag Mire Crone focused gate passed.');
console.log('- Exact scope: one internal Hag/Mire Crone / 80 frames / 4 directions / 6 animation rows');
console.log(`- Witch distinction: ${witchDifferences}/80 pixel frames and ${witchAlphaDifferences}/80 alpha silhouettes differ`);
console.log(`- Structure: ${connectedFrames}/80 connected; ${boundedFrames}/80 one-cell margins; ${groundedFrames}/80 grounded; opaque range ${minOpaquePixels}-${maxOpaquePixels}`);
console.log(`- Identity: ${coloredFrames}/72 colored feral-Hag frames; ${flashFrames}/8 exact white alias flashes`);
console.log('- Motion: 2 Idle, 4 Walk, 4 Attack, 2 Hurt frames distinct per direction; Cast/Death aliases exact');
console.log(`- Presentation: Complete B +${completeBAddedPixels} outline pixels; Form changes ${formChangedPixels} source pixels`);
console.log('- Protected boundaries: approved Fairy and Hag sources exact; public catalog 80/259; fixtures unchanged');
console.log('- Review artifacts: 5/5 present and hash-verified');
console.log(`- Candidate digest: ${candidateFrameDigest}`);
