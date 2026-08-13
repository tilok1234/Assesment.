import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import {
  EN_E07_MIREMANE_COURSER_GATE,
  EN_E07_MIREMANE_COURSER_REGISTRY,
} from '../engine/enemy-expansion-en-e07-kelpie-miremane-courser.js';
import {
  EN_E10_RAM_TOPOLOGY_DECISION,
  EN_E10_STONECURL_GRAZER_GATE,
  EN_E10_STONECURL_GRAZER_REGISTRY,
} from '../engine/enemy-expansion-en-e10-ram-stonecurl-grazer.js';
import {
  EN_E10_RAM_SPECIALIST_CONTRACT_CARD,
  EN_E10_CLIFFCOIL_STRIDER_CONTRACT,
  EN_E10_CLIFFCOIL_STRIDER_DATA,
  EN_E10_CLIFFCOIL_STRIDER_DEATH_SOURCE_FRAMES,
  EN_E10_CLIFFCOIL_STRIDER_FAMILY,
  EN_E10_CLIFFCOIL_STRIDER_GATE,
  EN_E10_CLIFFCOIL_STRIDER_REGISTRY,
} from '../engine/enemy-expansion-en-e10-ram-cliffcoil-strider.js';
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
  candidate: { kind: 'enemy', family: 'ram', variant: 'cliffcoil-strider' },
  stonecurl: { kind: 'enemy', family: 'ram', variant: 'stonecurl-grazer' },
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
  EN_E10_RAM_TOPOLOGY_DECISION.status === 'selected'
    && EN_E10_RAM_TOPOLOGY_DECISION.selected === 'baked-single-actor-horned-grounded-quadruped'
    && EN_E10_RAM_TOPOLOGY_DECISION.childAssets.length === 0,
  'approved Ram topology decision drifted',
);
check(
  EN_E10_STONECURL_GRAZER_GATE.status === 'approved'
    && EN_E10_STONECURL_GRAZER_GATE.candidateFrameDigest === '79b440290b1c6f503834d44b13d2c9508b34ad48a4ae495c6e957e329095942f'
    && EN_E10_STONECURL_GRAZER_GATE.publishedImplementation === '195c6ddf4c2f8d5345d18b3e1657bfab3f7a41b8'
    && EN_E10_STONECURL_GRAZER_GATE.publishedApprovalRecord === 'c7757c1293bae90840735555e2670d7661bc9873'
    && EN_E10_STONECURL_GRAZER_GATE.initialPublishedHandoff === 'c278919b2830d7e8654bcb1bbd38f07db344d285'
    && EN_E10_STONECURL_GRAZER_GATE.publicationState === 'published',
  'published Stonecurl predecessor drifted',
);
check(
  EN_E10_CLIFFCOIL_STRIDER_GATE.status === 'approved'
    && EN_E10_CLIFFCOIL_STRIDER_GATE.baseCheckpoint === '67ba19086669b9135286784b6c9c39f682ca3032'
    && EN_E10_CLIFFCOIL_STRIDER_GATE.authorizedOn === '2026-08-13'
    && EN_E10_CLIFFCOIL_STRIDER_GATE.authorizationEvidence.includes('designer then separately said: lets do nex t')
    && EN_E10_CLIFFCOIL_STRIDER_GATE.authorizationEvidence.includes('exactly one private specialist Ram full 80-frame candidate')
    && EN_E10_CLIFFCOIL_STRIDER_GATE.authorizationEvidence.includes('distinct Complete B outlined PNG')
    && EN_E10_CLIFFCOIL_STRIDER_GATE.architectureDecision === EN_E10_RAM_TOPOLOGY_DECISION.id
    && EN_E10_CLIFFCOIL_STRIDER_GATE.approvedOn === '2026-08-13'
    && EN_E10_CLIFFCOIL_STRIDER_GATE.approvalEvidence.includes('designer replied: approved')
    && EN_E10_CLIFFCOIL_STRIDER_GATE.approvalEvidence.includes('raw sprite 67')
    && EN_E10_CLIFFCOIL_STRIDER_GATE.approvalEvidence.includes('outlined sprite 71')
    && EN_E10_CLIFFCOIL_STRIDER_GATE.approvalEvidence.includes('Complete B + Form sprite 75')
    && EN_E10_CLIFFCOIL_STRIDER_GATE.approvalEvidence.includes('active comparison sprite 79')
    && EN_E10_CLIFFCOIL_STRIDER_GATE.approvalEvidence.includes('1ca2ce85dc6bd4b291e6ede4754f58c2a5bd4278b50acfb699926f9626dd9b29')
    && EN_E10_CLIFFCOIL_STRIDER_GATE.approvedImplementation === 'cb6c58440297b76f62776d8c11a6232d05bb1467'
    && EN_E10_CLIFFCOIL_STRIDER_GATE.publishedImplementation === ''
    && EN_E10_CLIFFCOIL_STRIDER_GATE.publishedApprovalRecord === ''
    && EN_E10_CLIFFCOIL_STRIDER_GATE.initialPublishedHandoff === ''
    && EN_E10_CLIFFCOIL_STRIDER_GATE.publicationState === 'approved-not-published',
  'specialist Ram authorization or outlined-review boundary drifted',
);
check(
  EN_E10_CLIFFCOIL_STRIDER_GATE.precedingApproval.gateId === EN_E10_STONECURL_GRAZER_GATE.id
    && EN_E10_CLIFFCOIL_STRIDER_GATE.precedingApproval.candidateFrameDigest === EN_E10_STONECURL_GRAZER_GATE.candidateFrameDigest
    && EN_E10_CLIFFCOIL_STRIDER_GATE.precedingApproval.outlinedArtifactSha256 === EN_E10_STONECURL_GRAZER_GATE.outlinedArtifactSha256
    && EN_E10_CLIFFCOIL_STRIDER_GATE.precedingApproval.publishedImplementation === EN_E10_STONECURL_GRAZER_GATE.publishedImplementation
    && EN_E10_CLIFFCOIL_STRIDER_GATE.precedingApproval.publishedApprovalRecord === EN_E10_STONECURL_GRAZER_GATE.publishedApprovalRecord
    && EN_E10_CLIFFCOIL_STRIDER_GATE.precedingApproval.initialPublishedHandoff === EN_E10_STONECURL_GRAZER_GATE.initialPublishedHandoff
    && EN_E10_CLIFFCOIL_STRIDER_GATE.precedingApproval.currentReconciliation === EN_E10_CLIFFCOIL_STRIDER_GATE.baseCheckpoint,
  'bounded Stonecurl publication tuple drifted',
);
check(
  JSON.stringify(EN_E10_RAM_SPECIALIST_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E10_RAM_SPECIALIST_CONTRACT_CARD.precedingVariant.id === 'stonecurl-grazer'
    && EN_E10_RAM_SPECIALIST_CONTRACT_CARD.activeVariant.id === 'cliffcoil-strider'
    && EN_E10_RAM_SPECIALIST_CONTRACT_CARD.activeVariant.role === 'specialist'
    && EN_E10_RAM_SPECIALIST_CONTRACT_CARD.activeVariant.status === 'implemented-full-approved'
    && JSON.stringify(EN_E10_RAM_SPECIALIST_CONTRACT_CARD.deferredRoles) === JSON.stringify(['elite']),
  'Ram specialist role boundary drifted',
);
check(
  EN_E10_CLIFFCOIL_STRIDER_CONTRACT.state === 'implemented-complete-motion-approved'
    && EN_E10_CLIFFCOIL_STRIDER_CONTRACT.silhouette.includes('long connected swept-back coil horns')
    && EN_E10_CLIFFCOIL_STRIDER_CONTRACT.visualIdentity.includes('sea-glass sure-foot chevrons')
    && EN_E10_CLIFFCOIL_STRIDER_DATA.actorTopology === EN_E10_RAM_TOPOLOGY_DECISION.selected
    && EN_E10_CLIFFCOIL_STRIDER_DATA.childAssets.length === 0
    && EN_E10_CLIFFCOIL_STRIDER_DATA.bakedEffects.length === 0,
  'authored specialist Ram identity or zero-child effect firewall drifted',
);
check(
  EN_E10_CLIFFCOIL_STRIDER_GATE.scope.includes('complete 80-frame Cliffcoil Strider specialist Ram')
    && EN_E10_CLIFFCOIL_STRIDER_GATE.animationContract.includes('body-owned sidestep horn charge')
    && EN_E10_CLIFFCOIL_STRIDER_GATE.animationContract.includes('Cast aliases Attack exactly')
    && EN_E10_CLIFFCOIL_STRIDER_GATE.reviewPresentation.includes('distinct Complete B outlined')
    && EN_E10_CLIFFCOIL_STRIDER_GATE.exclusions.includes('Ram elite')
    && EN_E10_CLIFFCOIL_STRIDER_GATE.nextGate.includes('visually approved at implementation cb6c58440297b76f62776d8c11a6232d05bb1467')
    && EN_E10_CLIFFCOIL_STRIDER_GATE.nextGate.includes('No next Ram art gate is open')
    && EN_E10_CLIFFCOIL_STRIDER_GATE.nextGate.includes('review evidence only')
    && EN_E10_CLIFFCOIL_STRIDER_GATE.nextGate.includes('does not authorize outline registration'),
  'full-suite motion, review, or stop boundary drifted',
);
check(
  Object.isFrozen(EN_E10_RAM_SPECIALIST_CONTRACT_CARD)
    && Object.isFrozen(EN_E10_CLIFFCOIL_STRIDER_CONTRACT)
    && Object.isFrozen(EN_E10_CLIFFCOIL_STRIDER_DATA)
    && Object.isFrozen(EN_E10_CLIFFCOIL_STRIDER_GATE),
  'specialist Ram contracts, data, and gate must be deeply immutable',
);
check(
  EN_E10_CLIFFCOIL_STRIDER_REGISTRY.families.length === 1
    && EN_E10_CLIFFCOIL_STRIDER_REGISTRY.publicFamilies.length === 0
    && EN_E10_CLIFFCOIL_STRIDER_FAMILY.variants.length === 1,
  'private specialist Ram registry boundary drifted',
);

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && engine.PUBLIC_ENEMIES.length === 92 && publicVariantCount === 294 && !engine.PUBLIC_ENEMIES.some(({ id }) => id === 'ram'), 'candidate must preserve public 92/294 and keep Ram private');
check(engine.EN_E10_CLIFFCOIL_STRIDER_REGISTRY === undefined, 'candidate must not leak through the public facade');
const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
const outlineSource = await readFile(path.join(root, 'engine', 'outline-renderer.js'), 'utf8');
check(!publicSource.includes('cliffcoil-strider'), 'public expansion registry must not mention Cliffcoil Strider');
check(!manifestSource.includes('cliffcoil-strider'), 'asset manifest must not mention Cliffcoil Strider');
check(!outlineSource.includes('cliffcoil-strider'), 'outline registry must not mention Cliffcoil Strider');
check(JSON.stringify(EN_E10_CLIFFCOIL_STRIDER_DEATH_SOURCE_FRAMES) === JSON.stringify([0, 1, 1, 1]), 'Death alias mapping drifted');

const captures = new Map();
const records = { candidate: [], stonecurl: [], miremane: [], direWolf: [] };
const colors = EN_E10_CLIFFCOIL_STRIDER_DATA.cliffcoilStrider;
const palettes = [
  ['wool', new Set(colors.wool)], ['face', new Set(colors.face)], ['horn', new Set(colors.horn)],
  ['belly', new Set(colors.belly)], ['mark', new Set(colors.mark)], ['ear', new Set(colors.ear)],
];
let connected = 0, bounded = 0, grounded = 0, fourHoofRows = 0, quadrupedSpanFrames = 0;
let hornFrames = 0, colored = 0, flashes = 0, eyeViews = 0, muzzleViews = 0;
let minOpaque = Infinity, maxOpaque = -Infinity, outlinedPixels = 0, formChanges = 0;
const differences = { stonecurl: 0, miremane: 0, direWolf: 0 };
const alphaDifferences = { stonecurl: 0, miremane: 0, direWolf: 0 };

for (const animation of animations) for (const direction of directions) {
  const animationDigests = [];
  for (let frame = 0; frame < animation.frames; frame++) {
    const captureKey = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E10_CLIFFCOIL_STRIDER_REGISTRY, specs.candidate, direction, animation.id, frame);
    const stonecurl = captureEnemyExpansionFrame(EN_E10_STONECURL_GRAZER_REGISTRY, specs.stonecurl, direction, animation.id, frame);
    const miremane = captureEnemyExpansionFrame(EN_E07_MIREMANE_COURSER_REGISTRY, specs.miremane, direction, animation.id, frame);
    const direWolf = captureLegacyFrame(specs.direWolf, direction, animation.id, frame);
    const compared = { stonecurl, miremane, direWolf };
    captures.set(captureKey, candidate);
    animationDigests.push(candidate.digest);
    records.candidate.push(frameRecord(candidate, specs.candidate, direction, animation.id, frame));
    records.stonecurl.push(frameRecord(stonecurl, specs.stonecurl, direction, animation.id, frame));
    records.miremane.push(frameRecord(miremane, specs.miremane, direction, animation.id, frame));
    records.direWolf.push(frameRecord(direWolf, specs.direWolf, direction, animation.id, frame, false));

    check(candidate.outOfBoundsWrites.length === 0, captureKey + ' wrote outside the cell');
    check(candidate.alpha.every((value) => value === 0 || value === 255), captureKey + ' lost hard alpha');
    if (componentCount(candidate.pixels) === 1) connected++; else check(false, captureKey + ' must remain one connected actor');
    const isBounded = candidate.bounds && candidate.bounds.minX >= 1 && candidate.bounds.minY >= 1 && candidate.bounds.maxX <= 22 && candidate.bounds.maxY <= 22;
    if (isBounded) bounded++; else check(false, captureKey + ' lost the one-cell margin');
    if (candidate.bounds && candidate.bounds.maxY === 22) grounded++; else check(false, captureKey + ' lost hoof ground contact');
    check(candidate.opaquePixels >= 180 && candidate.opaquePixels <= 330, captureKey + ' density is implausible for the specialist Ram');
    minOpaque = Math.min(minOpaque, candidate.opaquePixels); maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    const hoofRuns = rowRuns(candidate.pixels, 22);
    if (hoofRuns >= 4) fourHoofRows++; else check(false, captureKey + ' lost four separated grounded hoof runs');
    const width = candidate.bounds.maxX - candidate.bounds.minX + 1, height = candidate.bounds.maxY - candidate.bounds.minY + 1;
    const quadrupedSpan = (direction === 'left' || direction === 'right') ? width >= 20 : height >= 19;
    if (quadrupedSpan) quadrupedSpanFrames++; else check(false, captureKey + ' lost the lean horned quadruped span');

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
      if (countColors(candidate.pixels, new Set(colors.horn)) >= 16) hornFrames++; else check(false, captureKey + ' lost readable long connected coil horns');
      check(countColors(candidate.pixels, new Set([colors.hoof])) >= 8, captureKey + ' lost four dark two-pixel hooves');
      const eyeCount = countColors(candidate.pixels, new Set([colors.eye]));
      const featureCount = countColors(candidate.pixels, new Set([colors.feature]));
      if (direction === 'up') check(eyeCount === 0 && featureCount === 0, captureKey + ' rear view must not expose face pixels');
      else if (direction === 'down') {
        check(eyeCount === 2, captureKey + ' front view must preserve paired cyan eyes');
        check(featureCount >= 3, captureKey + ' front view must preserve nostrils and mouth');
        eyeViews++; muzzleViews++;
      } else {
        check(eyeCount === 1, captureKey + ' side view must preserve one cyan profile eye');
        check(featureCount >= 2, captureKey + ' side view must preserve nose and mouth line');
        eyeViews++; muzzleViews++;
      }
      colored++;
    }

    check(candidate.renderResult.cliffcoilStriderGate === EN_E10_CLIFFCOIL_STRIDER_GATE.id
      && candidate.renderResult.architectureDecision === EN_E10_RAM_TOPOLOGY_DECISION.id
      && candidate.renderResult.approvedPrecedingGate === EN_E10_STONECURL_GRAZER_GATE.id
      && candidate.renderResult.childAssetCount === 0,
    captureKey + ' renderer gate or child boundary drifted');
    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E10_CLIFFCOIL_STRIDER_DATA);
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
  const death = captures.get(direction + '/death/' + frame), hurt = captures.get(direction + '/hurt/' + EN_E10_CLIFFCOIL_STRIDER_DEATH_SOURCE_FRAMES[frame]);
  check(death.digest === hurt.digest, direction + ' Death D' + (frame + 1) + ' must alias Hurt exactly');
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = captures.get('left/' + animation.id + '/' + frame), right = captures.get('right/' + animation.id + '/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels)), 'side mirror contract drifted for ' + animation.id + '/' + frame);
}

const digests = Object.fromEntries(Object.keys(records).map((name) => [name, hashJson(records[name])]));
if (EN_E10_CLIFFCOIL_STRIDER_GATE.candidateFrameDigest) check(digests.candidate === EN_E10_CLIFFCOIL_STRIDER_GATE.candidateFrameDigest, 'candidate digest drifted');
if (EN_E10_CLIFFCOIL_STRIDER_GATE.stonecurlComparisonDigest) check(digests.stonecurl === EN_E10_CLIFFCOIL_STRIDER_GATE.stonecurlComparisonDigest, 'Stonecurl comparison digest drifted');
if (EN_E10_CLIFFCOIL_STRIDER_GATE.miremaneComparisonDigest) check(digests.miremane === EN_E10_CLIFFCOIL_STRIDER_GATE.miremaneComparisonDigest, 'Miremane comparison digest drifted');
if (EN_E10_CLIFFCOIL_STRIDER_GATE.direWolfComparisonDigest) check(digests.direWolf === EN_E10_CLIFFCOIL_STRIDER_GATE.direWolfComparisonDigest, 'Dire Wolf comparison digest drifted');
check(digests.stonecurl === EN_E10_STONECURL_GRAZER_GATE.candidateFrameDigest, 'approved Stonecurl comparison source drifted');
check(digests.miremane === EN_E07_MIREMANE_COURSER_GATE.candidateFrameDigest, 'approved Miremane comparison source drifted');
check(connected === 80 && bounded === 80 && grounded === 80, 'all 80 Cliffcoil frames must be connected, bounded, and grounded');
check(fourHoofRows === 80 && quadrupedSpanFrames === 80, 'all 80 frames must preserve four hoof runs and the lean quadruped span');
check(hornFrames === 72 && colored === 72 && flashes === 8 && eyeViews === 54 && muzzleViews === 54, 'horn, colored, flash, eye-view, or muzzle-view totals drifted');
for (const name of Object.keys(differences)) check(differences[name] === 80 && alphaDifferences[name] === 80, 'Cliffcoil Strider must differ from ' + name + ' in all 80 pixel and alpha frames');
check(outlinedPixels > 0 && formChanges > 0, 'Complete B outline and Form presentations must visibly change the candidate');

for (const [field, relative] of [
  ['artifactSha256', EN_E10_CLIFFCOIL_STRIDER_GATE.artifact],
  ['outlinedArtifactSha256', EN_E10_CLIFFCOIL_STRIDER_GATE.outlinedArtifact],
  ['assembledArtifactSha256', EN_E10_CLIFFCOIL_STRIDER_GATE.assembledArtifact],
  ['comparisonArtifactSha256', EN_E10_CLIFFCOIL_STRIDER_GATE.comparisonArtifact],
]) if (EN_E10_CLIFFCOIL_STRIDER_GATE[field]) check(await fileHash(relative) === EN_E10_CLIFFCOIL_STRIDER_GATE[field], field + ' drifted');
for (const review of Object.values(EN_E10_CLIFFCOIL_STRIDER_GATE.reviewAnimations)) if (review.sha256) check(await fileHash(review.artifact) === review.sha256, review.artifact + ' drifted');

rejects(() => captureEnemyExpansionFrame(EN_E10_CLIFFCOIL_STRIDER_REGISTRY, specs.candidate, 'down', 'idle', 2), 'out-of-range Idle', 'invalid for idle');
rejects(() => captureEnemyExpansionFrame(EN_E10_CLIFFCOIL_STRIDER_REGISTRY, { ...specs.candidate, family: 'wolf' }, 'down', 'idle', 0), 'wrong family');
rejects(() => captureEnemyExpansionFrame(EN_E10_CLIFFCOIL_STRIDER_REGISTRY, { ...specs.candidate, variant: 'stonecurl-grazer' }, 'down', 'idle', 0), 'wrong variant');

if (errors.length) {
  console.error('EN-E10 Ram Cliffcoil Strider focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E10 Ram Cliffcoil Strider private specialist candidate passes focused validation.');
  console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; opaque range ' + minOpaque + '-' + maxOpaque);
  console.log('- Ram identity: ' + fourHoofRows + '/80 four-hoof rows; ' + quadrupedSpanFrames + '/80 quadruped spans; ' + hornFrames + '/72 horn-bearing colored frames; ' + flashes + '/8 white flashes; ' + eyeViews + '/54 eye-bearing views; ' + muzzleViews + '/54 readable muzzles');
  console.log('- Distinction: Stonecurl ' + differences.stonecurl + '/80; Miremane ' + differences.miremane + '/80; Dire Wolf ' + differences.direWolf + '/80 pixel and alpha frames differ');
  console.log('- Presentation: Complete B outline +' + outlinedPixels + ' pixels; Form changes ' + formChanges);
  console.log('- Protected: approved Stonecurl and Miremane exact; public 92/294; zero child assets/effects; no outline registration; fixtures unchanged');
  console.log('- Candidate frame digest: ' + digests.candidate);
  console.log('- Approved Stonecurl frame digest: ' + digests.stonecurl);
  console.log('- Approved Miremane frame digest: ' + digests.miremane);
  console.log('- Public Dire Wolf frame digest: ' + digests.direWolf);
}
