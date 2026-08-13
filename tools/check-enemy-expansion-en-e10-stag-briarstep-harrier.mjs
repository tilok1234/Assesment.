import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import {
  EN_E10_STAG_TOPOLOGY_DECISION,
  EN_E10_STAG_CONTRACT_CARD,
  EN_E10_MOSSRACK_FORAGER_GATE,
  EN_E10_MOSSRACK_FORAGER_REGISTRY,
} from '../engine/enemy-expansion-en-e10-stag-mossrack-forager.js';
import {
  EN_E07_MIREMANE_COURSER_GATE,
  EN_E07_MIREMANE_COURSER_REGISTRY,
} from '../engine/enemy-expansion-en-e07-kelpie-miremane-courser.js';
import {
  EN_E10_BRIARSTEP_HARRIER_CONTRACT,
  EN_E10_BRIARSTEP_HARRIER_DATA,
  EN_E10_BRIARSTEP_HARRIER_DEATH_SOURCE_FRAMES,
  EN_E10_BRIARSTEP_HARRIER_FAMILY,
  EN_E10_BRIARSTEP_HARRIER_GATE,
  EN_E10_BRIARSTEP_HARRIER_REGISTRY,
} from '../engine/enemy-expansion-en-e10-stag-briarstep-harrier.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import { alphaDigest, captureEnemyExpansionFrame, mirrorPixels, pixelDigest } from './enemy-expansion-review-pixels.mjs';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const errors = [];
const directions = ['down', 'left', 'right', 'up'];
const animations = [
  { id: 'idle', frames: 2 },
  { id: 'walk', frames: 4 },
  { id: 'attack', frames: 4 },
  { id: 'cast', frames: 4 },
  { id: 'hurt', frames: 2 },
  { id: 'death', frames: 4 },
];
const specs = {
  candidate: { kind: 'enemy', family: 'stag', variant: 'briarstep-harrier' },
  mossrack: { kind: 'enemy', family: 'stag', variant: 'mossrack-forager' },
  miremane: { kind: 'enemy', family: 'kelpie', variant: 'miremane-courser' },
  direWolf: { kind: 'enemy', family: 'wolf', variant: 'dire' },
};

function check(condition, message) { if (!condition) errors.push(message); }
function hashJson(value) { return createHash('sha256').update(JSON.stringify(value)).digest('hex'); }
function frameRecord(captured, spec, direction, animation, frame, candidateFamily = true) {
  return { family: spec.family, variant: spec.variant, ...(candidateFamily ? { candidateFamily: spec.family } : {}), direction, animation, frame, digest: captured.digest, alphaDigest: captured.alphaDigest, opaquePixels: captured.opaquePixels, bounds: captured.bounds };
}

function captureLegacyFrame(spec, direction, animation, frame) {
  const pixels = new Array(576).fill(null);
  const outOfBoundsWrites = [];
  let fillStyle = '#000000';
  const context = {
    get fillStyle() { return fillStyle; },
    set fillStyle(value) { fillStyle = value; },
    clearRect(x, y, width, height) {
      for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
        if (px < 0 || py < 0 || px >= 24 || py >= 24) outOfBoundsWrites.push({ x: px, y: py });
        else pixels[(py * 24) + px] = null;
      }
    },
    fillRect(x, y, width, height) {
      for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) {
        if (px < 0 || py < 0 || px >= 24 || py >= 24) outOfBoundsWrites.push({ x: px, y: py });
        else pixels[(py * 24) + px] = fillStyle;
      }
    },
  };
  drawLegacySprite(context, spec, direction, animation, frame, { shadow: false });
  const occupied = pixels.flatMap((color, index) => color === null ? [] : [{ x: index % 24, y: Math.floor(index / 24) }]);
  const bounds = occupied.length ? {
    minX: Math.min(...occupied.map(({ x }) => x)), minY: Math.min(...occupied.map(({ y }) => y)),
    maxX: Math.max(...occupied.map(({ x }) => x)), maxY: Math.max(...occupied.map(({ y }) => y)),
  } : null;
  return Object.freeze({ pixels: Object.freeze(pixels), opaquePixels: occupied.length, bounds: bounds && Object.freeze(bounds), outOfBoundsWrites: Object.freeze(outOfBoundsWrites), digest: pixelDigest(pixels), alphaDigest: alphaDigest(pixels) });
}

function componentCount(pixels) {
  const occupied = new Set(pixels.flatMap((color, index) => color ? [index] : []));
  let components = 0;
  while (occupied.size) {
    components++;
    const queue = [occupied.values().next().value];
    occupied.delete(queue[0]);
    while (queue.length) {
      const index = queue.shift();
      const x = index % 24, y = Math.floor(index / 24);
      for (const [nextX, nextY] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
        const next = (nextY * 24) + nextX;
        if (nextX >= 0 && nextY >= 0 && nextX < 24 && nextY < 24 && occupied.delete(next)) queue.push(next);
      }
    }
  }
  return components;
}

function countColors(pixels, colors) { return pixels.reduce((count, color) => count + (colors.has(color) ? 1 : 0), 0); }
function rowRuns(pixels, y) {
  let runs = 0, occupied = false;
  for (const color of pixels.slice(y * 24, (y + 1) * 24)) {
    if (color && !occupied) runs++;
    occupied = Boolean(color);
  }
  return runs;
}
async function fileHash(relativePath) { return createHash('sha256').update(await readFile(path.join(root, relativePath))).digest('hex'); }
function rejects(action, label, expected = 'is not implemented') {
  try { action(); errors.push(label + ' must reject'); }
  catch (error) { check(String(error.message).includes(expected), label + ' rejected unexpectedly: ' + error.message); }
}

check(
  EN_E10_STAG_TOPOLOGY_DECISION.status === 'selected'
    && EN_E10_STAG_TOPOLOGY_DECISION.selected === 'baked-single-actor-antlered-grounded-quadruped'
    && EN_E10_STAG_TOPOLOGY_DECISION.selectedOn === '2026-08-13'
    && EN_E10_STAG_TOPOLOGY_DECISION.approvalEvidence.includes('designer replied: approved')
    && EN_E10_STAG_TOPOLOGY_DECISION.childAssets.length === 0,
  'approved Stag topology decision drifted',
);
check(
  EN_E10_MOSSRACK_FORAGER_GATE.status === 'approved'
    && EN_E10_MOSSRACK_FORAGER_GATE.candidateFrameDigest === 'c3383941492c1976bc03786f73fee20744d0a2af9e8846f44cbf9d59b7384d36'
    && EN_E10_MOSSRACK_FORAGER_GATE.publishedImplementation === '4c5d80901d12063b21c0d6303fc24260bd700209'
    && EN_E10_MOSSRACK_FORAGER_GATE.publishedApprovalRecord === '328a9b188ddd6e5db6144f2fdb253f8d9599e12d'
    && EN_E10_MOSSRACK_FORAGER_GATE.initialPublishedHandoff === 'b8e67f2ddc12a71e3b25c33997a1ffed0329b7f4'
    && EN_E10_MOSSRACK_FORAGER_GATE.publicationState === 'published',
  'published Mossrack predecessor drifted',
);
check(
  EN_E10_BRIARSTEP_HARRIER_GATE.status === 'awaiting-visual-approval'
    && EN_E10_BRIARSTEP_HARRIER_GATE.baseCheckpoint === '67331ed1a160c8e62df0c9941b7c051ab5d0b228'
    && EN_E10_BRIARSTEP_HARRIER_GATE.authorizedOn === '2026-08-13'
    && EN_E10_BRIARSTEP_HARRIER_GATE.authorizationEvidence.includes('approved lets do next')
    && EN_E10_BRIARSTEP_HARRIER_GATE.authorizationEvidence.includes('exactly one private specialist Stag full 80-frame candidate')
    && EN_E10_BRIARSTEP_HARRIER_GATE.authorizationEvidence.includes('distinct Complete B outlined PNG')
    && EN_E10_BRIARSTEP_HARRIER_GATE.architectureDecision === EN_E10_STAG_TOPOLOGY_DECISION.id
    && EN_E10_BRIARSTEP_HARRIER_GATE.approvedOn === ''
    && EN_E10_BRIARSTEP_HARRIER_GATE.approvalEvidence === ''
    && EN_E10_BRIARSTEP_HARRIER_GATE.approvedImplementation === ''
    && EN_E10_BRIARSTEP_HARRIER_GATE.publishedImplementation === ''
    && EN_E10_BRIARSTEP_HARRIER_GATE.publishedApprovalRecord === ''
    && EN_E10_BRIARSTEP_HARRIER_GATE.initialPublishedHandoff === ''
    && EN_E10_BRIARSTEP_HARRIER_GATE.publicationState === 'unpublished-private',
  'specialist Stag authorization or visual stop boundary drifted',
);
check(
  EN_E10_BRIARSTEP_HARRIER_GATE.precedingApproval.gateId === EN_E10_MOSSRACK_FORAGER_GATE.id
    && EN_E10_BRIARSTEP_HARRIER_GATE.precedingApproval.candidateFrameDigest === EN_E10_MOSSRACK_FORAGER_GATE.candidateFrameDigest
    && EN_E10_BRIARSTEP_HARRIER_GATE.precedingApproval.outlinedArtifactSha256 === EN_E10_MOSSRACK_FORAGER_GATE.outlinedArtifactSha256
    && EN_E10_BRIARSTEP_HARRIER_GATE.precedingApproval.publishedImplementation === EN_E10_MOSSRACK_FORAGER_GATE.publishedImplementation
    && EN_E10_BRIARSTEP_HARRIER_GATE.precedingApproval.publishedApprovalRecord === EN_E10_MOSSRACK_FORAGER_GATE.publishedApprovalRecord
    && EN_E10_BRIARSTEP_HARRIER_GATE.precedingApproval.initialPublishedHandoff === EN_E10_MOSSRACK_FORAGER_GATE.initialPublishedHandoff
    && EN_E10_BRIARSTEP_HARRIER_GATE.precedingApproval.currentReconciliation === EN_E10_BRIARSTEP_HARRIER_GATE.baseCheckpoint,
  'bounded Mossrack publication tuple drifted',
);
check(
  JSON.stringify(EN_E10_STAG_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E10_STAG_CONTRACT_CARD.activeVariant.id === 'mossrack-forager'
    && EN_E10_STAG_CONTRACT_CARD.activeVariant.role === 'common'
    && EN_E10_STAG_CONTRACT_CARD.activeVariant.status === 'implemented-full-approved'
    && JSON.stringify(EN_E10_STAG_CONTRACT_CARD.deferredRoles) === JSON.stringify(['specialist', 'elite']),
  'approved Stag role order or common predecessor boundary drifted',
);
check(
  EN_E10_BRIARSTEP_HARRIER_CONTRACT.role === 'specialist'
    && EN_E10_BRIARSTEP_HARRIER_CONTRACT.state === 'implemented-complete-motion-awaiting-visual-approval'
    && EN_E10_BRIARSTEP_HARRIER_CONTRACT.silhouette.includes('swept-back branching antlers')
    && EN_E10_BRIARSTEP_HARRIER_CONTRACT.visualIdentity.includes('dusk-violet bramble bands')
    && EN_E10_BRIARSTEP_HARRIER_DATA.actorTopology === EN_E10_STAG_TOPOLOGY_DECISION.selected
    && EN_E10_BRIARSTEP_HARRIER_DATA.childAssets.length === 0
    && EN_E10_BRIARSTEP_HARRIER_DATA.bakedEffects.length === 0,
  'authored specialist Stag identity or zero-child effect firewall drifted',
);
check(
  EN_E10_BRIARSTEP_HARRIER_GATE.scope.includes('complete 80-frame Briarstep Harrier specialist Stag')
    && EN_E10_BRIARSTEP_HARRIER_GATE.animationContract.includes('body-owned lateral feint')
    && EN_E10_BRIARSTEP_HARRIER_GATE.animationContract.includes('low antler rake')
    && EN_E10_BRIARSTEP_HARRIER_GATE.animationContract.includes('Cast aliases Attack exactly')
    && EN_E10_BRIARSTEP_HARRIER_GATE.reviewPresentation.includes('distinct Complete B outlined')
    && EN_E10_BRIARSTEP_HARRIER_GATE.exclusions.includes('elite Stag variants')
    && EN_E10_BRIARSTEP_HARRIER_GATE.nextGate.includes('explicit designer visual approval')
    && EN_E10_BRIARSTEP_HARRIER_GATE.nextGate.includes('Do not commit or push')
    && EN_E10_BRIARSTEP_HARRIER_GATE.nextGate.includes('review evidence only')
    && EN_E10_BRIARSTEP_HARRIER_GATE.nextGate.includes('does not authorize outline registration'),
  'full-suite motion, review, or stop boundary drifted',
);
check(
  Object.isFrozen(EN_E10_STAG_TOPOLOGY_DECISION)
    && Object.isFrozen(EN_E10_STAG_CONTRACT_CARD)
    && Object.isFrozen(EN_E10_BRIARSTEP_HARRIER_CONTRACT)
    && Object.isFrozen(EN_E10_BRIARSTEP_HARRIER_DATA)
    && Object.isFrozen(EN_E10_BRIARSTEP_HARRIER_GATE),
  'Stag topology, contracts, data, and gate must be deeply immutable',
);
check(
  EN_E10_BRIARSTEP_HARRIER_REGISTRY.families.length === 1
    && EN_E10_BRIARSTEP_HARRIER_REGISTRY.publicFamilies.length === 0
    && EN_E10_BRIARSTEP_HARRIER_FAMILY.variants.length === 1,
  'private specialist Stag registry boundary drifted',
);

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && engine.PUBLIC_ENEMIES.length === 92 && publicVariantCount === 294 && !engine.PUBLIC_ENEMIES.some(({ id }) => id === 'stag'), 'candidate must preserve public 92/294 and keep Stag private');
check(engine.EN_E10_BRIARSTEP_HARRIER_REGISTRY === undefined, 'candidate must not leak through the public facade');
const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
const outlineSource = await readFile(path.join(root, 'engine', 'outline-renderer.js'), 'utf8');
check(!publicSource.includes('briarstep-harrier'), 'public expansion registry must not mention Briarstep Harrier');
check(!manifestSource.includes('briarstep-harrier'), 'asset manifest must not mention Briarstep Harrier');
check(!outlineSource.includes('briarstep-harrier'), 'outline registry must not mention Briarstep Harrier');
check(JSON.stringify(EN_E10_BRIARSTEP_HARRIER_DEATH_SOURCE_FRAMES) === JSON.stringify([0, 1, 1, 1]), 'Death alias mapping drifted');

const captures = new Map();
const records = { candidate: [], mossrack: [], miremane: [], direWolf: [] };
const colors = EN_E10_BRIARSTEP_HARRIER_DATA.briarstepHarrier;
const palettes = [
  ['fur', new Set(colors.fur)], ['face', new Set(colors.face)], ['antler', new Set(colors.antler)],
  ['belly', new Set(colors.belly)], ['bramble', new Set(colors.bramble)], ['ear', new Set(colors.ear)],
];
let connected = 0, bounded = 0, grounded = 0, splitHoofRows = 0, cervidSpanFrames = 0;
let antlerFrames = 0, colored = 0, flashes = 0, eyeViews = 0, muzzleViews = 0;
let minOpaque = Infinity, maxOpaque = -Infinity, outlinedPixels = 0, formChanges = 0;
const differences = { mossrack: 0, miremane: 0, direWolf: 0 };
const alphaDifferences = { mossrack: 0, miremane: 0, direWolf: 0 };

for (const animation of animations) for (const direction of directions) {
  const animationDigests = [];
  for (let frame = 0; frame < animation.frames; frame++) {
    const captureKey = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E10_BRIARSTEP_HARRIER_REGISTRY, specs.candidate, direction, animation.id, frame);
    const mossrack = captureEnemyExpansionFrame(EN_E10_MOSSRACK_FORAGER_REGISTRY, specs.mossrack, direction, animation.id, frame);
    const miremane = captureEnemyExpansionFrame(EN_E07_MIREMANE_COURSER_REGISTRY, specs.miremane, direction, animation.id, frame);
    const direWolf = captureLegacyFrame(specs.direWolf, direction, animation.id, frame);
    const compared = { mossrack, miremane, direWolf };
    captures.set(captureKey, candidate);
    animationDigests.push(candidate.digest);
    records.candidate.push(frameRecord(candidate, specs.candidate, direction, animation.id, frame));
    records.mossrack.push(frameRecord(mossrack, specs.mossrack, direction, animation.id, frame));
    records.miremane.push(frameRecord(miremane, specs.miremane, direction, animation.id, frame));
    records.direWolf.push(frameRecord(direWolf, specs.direWolf, direction, animation.id, frame, false));

    check(candidate.outOfBoundsWrites.length === 0, captureKey + ' wrote outside the cell');
    check(candidate.alpha.every((value) => value === 0 || value === 255), captureKey + ' lost hard alpha');
    if (componentCount(candidate.pixels) === 1) connected++; else check(false, captureKey + ' must remain one connected actor');
    const isBounded = candidate.bounds && candidate.bounds.minX >= 1 && candidate.bounds.minY >= 1 && candidate.bounds.maxX <= 22 && candidate.bounds.maxY <= 22;
    if (isBounded) bounded++; else check(false, captureKey + ' lost the one-cell margin');
    if (candidate.bounds && candidate.bounds.maxY === 22) grounded++; else check(false, captureKey + ' lost split-hoof ground contact');
    check(candidate.opaquePixels >= 170 && candidate.opaquePixels <= 245, captureKey + ' density is implausible for the sleek specialist Stag');
    minOpaque = Math.min(minOpaque, candidate.opaquePixels); maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    const hoofRuns = rowRuns(candidate.pixels, 22);
    if (hoofRuns === 8) splitHoofRows++; else check(false, captureKey + ' lost four visibly cleft grounded hooves');
    const width = candidate.bounds.maxX - candidate.bounds.minX + 1, height = candidate.bounds.maxY - candidate.bounds.minY + 1;
    const cervidSpan = (direction === 'left' || direction === 'right') ? width >= 20 : height >= 18;
    if (cervidSpan) cervidSpanFrames++; else check(false, captureKey + ' lost the long-necked branching-rack cervid span');

    for (const name of Object.keys(compared)) {
      if (candidate.digest !== compared[name].digest) differences[name]++;
      if (candidate.alphaDigest !== compared[name].alphaDigest) alphaDifferences[name]++;
    }

    const flash = (animation.id === 'hurt' || animation.id === 'death') && frame === 0;
    if (flash) {
      const frameColors = new Set(candidate.pixels.filter(Boolean));
      check(frameColors.size === 1 && frameColors.has('#f4f4f4'), captureKey + ' must be an exact whole-silhouette white flash');
      flashes++;
    } else {
      for (const [name, palette] of palettes) check(countColors(candidate.pixels, palette) > 0, captureKey + ' lost ' + name + ' palette identity');
      if (countColors(candidate.pixels, new Set(colors.antler)) >= 18) antlerFrames++; else check(false, captureKey + ' lost readable connected branching antlers');
      check(countColors(candidate.pixels, new Set([colors.hoof])) === 20, captureKey + ' lost four five-pixel split hooves');
      const eyeCount = countColors(candidate.pixels, new Set([colors.eye]));
      const featureCount = countColors(candidate.pixels, new Set([colors.feature]));
      if (direction === 'up') check(eyeCount === 0 && featureCount === 0, captureKey + ' rear view must not expose face pixels');
      else if (direction === 'down') {
        check(eyeCount === 2, captureKey + ' front view must preserve paired cyan eyes');
        check(featureCount >= 5, captureKey + ' front view must preserve nostrils and mouth');
        eyeViews++; muzzleViews++;
      } else {
        check(eyeCount === 1, captureKey + ' side view must preserve one cyan profile eye');
        check(featureCount >= 4, captureKey + ' side view must preserve nose and mouth line');
        eyeViews++; muzzleViews++;
      }
      colored++;
    }

    check(candidate.renderResult.briarstepHarrierGate === EN_E10_BRIARSTEP_HARRIER_GATE.id
      && candidate.renderResult.architectureDecision === EN_E10_STAG_TOPOLOGY_DECISION.id
      && candidate.renderResult.approvedPrecedingGate === EN_E10_MOSSRACK_FORAGER_GATE.id
      && candidate.renderResult.childAssetCount === 0,
    captureKey + ' renderer gate or child boundary drifted');
    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E10_BRIARSTEP_HARRIER_DATA);
    outlinedPixels += presentation.complete.reduce((sum, color, index) => sum + (color && !candidate.pixels[index] ? 1 : 0), 0);
    formChanges += presentation.form.reduce((sum, color, index) => sum + (candidate.pixels[index] && color !== candidate.pixels[index] ? 1 : 0), 0);
  }
  const uniqueMotion = new Set(animationDigests).size;
  if (animation.id === 'idle' || animation.id === 'hurt' || animation.id === 'death') check(uniqueMotion === 2, direction + ' ' + animation.id + ' must preserve both authored alias phases');
  else check(uniqueMotion >= 3, direction + ' ' + animation.id + ' must preserve distinct motion phases');
}

for (const direction of directions) for (let frame = 0; frame < 4; frame++) {
  const attack = captures.get(direction + '/attack/' + frame), cast = captures.get(direction + '/cast/' + frame);
  check(cast.digest === attack.digest, direction + ' Cast C' + (frame + 1) + ' must alias Attack exactly');
  const death = captures.get(direction + '/death/' + frame), hurt = captures.get(direction + '/hurt/' + EN_E10_BRIARSTEP_HARRIER_DEATH_SOURCE_FRAMES[frame]);
  check(death.digest === hurt.digest, direction + ' Death D' + (frame + 1) + ' must alias Hurt exactly');
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = captures.get('left/' + animation.id + '/' + frame), right = captures.get('right/' + animation.id + '/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels)), 'side mirror contract drifted for ' + animation.id + '/' + frame);
}

const digests = Object.fromEntries(Object.keys(records).map((name) => [name, hashJson(records[name])]));
if (EN_E10_BRIARSTEP_HARRIER_GATE.candidateFrameDigest) check(digests.candidate === EN_E10_BRIARSTEP_HARRIER_GATE.candidateFrameDigest, 'candidate digest drifted');
if (EN_E10_BRIARSTEP_HARRIER_GATE.mossrackComparisonDigest) check(digests.mossrack === EN_E10_BRIARSTEP_HARRIER_GATE.mossrackComparisonDigest, 'Mossrack comparison digest drifted');
if (EN_E10_BRIARSTEP_HARRIER_GATE.miremaneComparisonDigest) check(digests.miremane === EN_E10_BRIARSTEP_HARRIER_GATE.miremaneComparisonDigest, 'Miremane comparison digest drifted');
if (EN_E10_BRIARSTEP_HARRIER_GATE.direWolfComparisonDigest) check(digests.direWolf === EN_E10_BRIARSTEP_HARRIER_GATE.direWolfComparisonDigest, 'Dire Wolf comparison digest drifted');
check(digests.mossrack === EN_E10_MOSSRACK_FORAGER_GATE.candidateFrameDigest, 'approved Mossrack comparison source drifted');
check(digests.miremane === EN_E07_MIREMANE_COURSER_GATE.candidateFrameDigest, 'approved Miremane comparison source drifted');
check(connected === 80 && bounded === 80 && grounded === 80, 'all 80 Briarstep frames must be connected, bounded, and grounded');
check(splitHoofRows === 80 && cervidSpanFrames === 80, 'all 80 frames must preserve four split hooves and the cervid span');
check(antlerFrames === 72 && colored === 72 && flashes === 8 && eyeViews === 54 && muzzleViews === 54, 'antler, colored, flash, eye-view, or muzzle-view totals drifted');
for (const name of Object.keys(differences)) check(differences[name] === 80 && alphaDifferences[name] === 80, 'Briarstep Harrier must differ from ' + name + ' in all 80 pixel and alpha frames');
check(outlinedPixels > 0 && formChanges > 0, 'Complete B outline and Form presentations must visibly change the candidate');

for (const [field, relative] of [
  ['artifactSha256', EN_E10_BRIARSTEP_HARRIER_GATE.artifact],
  ['outlinedArtifactSha256', EN_E10_BRIARSTEP_HARRIER_GATE.outlinedArtifact],
  ['assembledArtifactSha256', EN_E10_BRIARSTEP_HARRIER_GATE.assembledArtifact],
  ['comparisonArtifactSha256', EN_E10_BRIARSTEP_HARRIER_GATE.comparisonArtifact],
]) if (EN_E10_BRIARSTEP_HARRIER_GATE[field]) check(await fileHash(relative) === EN_E10_BRIARSTEP_HARRIER_GATE[field], field + ' drifted');
for (const review of Object.values(EN_E10_BRIARSTEP_HARRIER_GATE.reviewAnimations)) if (review.sha256) check(await fileHash(review.artifact) === review.sha256, review.artifact + ' drifted');

rejects(() => captureEnemyExpansionFrame(EN_E10_BRIARSTEP_HARRIER_REGISTRY, specs.candidate, 'down', 'idle', 2), 'out-of-range Idle', 'invalid for idle');
rejects(() => captureEnemyExpansionFrame(EN_E10_BRIARSTEP_HARRIER_REGISTRY, { ...specs.candidate, family: 'wolf' }, 'down', 'idle', 0), 'wrong family');
rejects(() => captureEnemyExpansionFrame(EN_E10_BRIARSTEP_HARRIER_REGISTRY, { ...specs.candidate, variant: 'mossrack-forager' }, 'down', 'idle', 0), 'wrong variant');

if (errors.length) {
  console.error('EN-E10 Stag Briarstep Harrier focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E10 Stag Briarstep Harrier private specialist candidate passes focused validation.');
  console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; opaque range ' + minOpaque + '-' + maxOpaque);
  console.log('- Stag identity: ' + splitHoofRows + '/80 split-hoof rows; ' + cervidSpanFrames + '/80 cervid spans; ' + antlerFrames + '/72 antler-bearing colored frames; ' + flashes + '/8 white flashes; ' + eyeViews + '/54 eye-bearing views; ' + muzzleViews + '/54 readable muzzles');
  console.log('- Distinction: Mossrack ' + differences.mossrack + '/80; Miremane ' + differences.miremane + '/80; Dire Wolf ' + differences.direWolf + '/80 pixel and alpha frames differ');
  console.log('- Presentation: Complete B outline +' + outlinedPixels + ' pixels; Form changes ' + formChanges);
  console.log('- Protected: approved Mossrack and Miremane exact; public 92/294; zero child assets/effects; no outline registration; fixtures unchanged');
  console.log('- Candidate frame digest: ' + digests.candidate);
  console.log('- Approved Mossrack frame digest: ' + digests.mossrack);
  console.log('- Approved Miremane frame digest: ' + digests.miremane);
  console.log('- Public Dire Wolf frame digest: ' + digests.direWolf);
}
