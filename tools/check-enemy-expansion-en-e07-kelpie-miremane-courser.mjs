import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { EN_E03_COMMON_ALIAS_REGISTRY } from '../engine/enemy-expansion-en-e03-common-aliases.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import {
  EN_E07_MANYFOLD_USURPER_GATE,
} from '../engine/enemy-expansion-en-e07-changeling-manyfold-usurper.js';
import {
  EN_E07_KELPIE_CONTRACT_CARD,
  EN_E07_MIREMANE_COURSER_CONTRACT,
  EN_E07_MIREMANE_COURSER_DATA,
  EN_E07_MIREMANE_COURSER_DEATH_SOURCE_FRAMES,
  EN_E07_MIREMANE_COURSER_FAMILY,
  EN_E07_MIREMANE_COURSER_GATE,
  EN_E07_MIREMANE_COURSER_REGISTRY,
} from '../engine/enemy-expansion-en-e07-kelpie-miremane-courser.js';
import { buildEnemyExpansionCandidatePresentation } from './enemy-expansion-candidate-presentation.mjs';
import {
  alphaDigest,
  captureEnemyExpansionFrame,
  mirrorPixels,
  pixelDigest,
} from './enemy-expansion-review-pixels.mjs';

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
const candidateSpec = { kind: 'enemy', family: 'kelpie', variant: 'miremane-courser' };
const steppeHunterSpec = { kind: 'enemy', family: 'centaur', variant: 'steppe-hunter' };
const direWolfSpec = { kind: 'enemy', family: 'wolf', variant: 'dire' };
const marshCrocodileSpec = { kind: 'enemy', family: 'crocodile', variant: 'marsh' };

function check(condition, message) {
  if (!condition) errors.push(message);
}

function hashJson(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function frameRecord(captured, spec, direction, animation, frame, candidateFamily = true) {
  return {
    family: spec.family,
    variant: spec.variant,
    ...(candidateFamily ? { candidateFamily: spec.family } : {}),
    direction,
    animation,
    frame,
    digest: captured.digest,
    alphaDigest: captured.alphaDigest,
    opaquePixels: captured.opaquePixels,
    bounds: captured.bounds,
  };
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
    minX: Math.min(...occupied.map(({ x }) => x),),
    minY: Math.min(...occupied.map(({ y }) => y),),
    maxX: Math.max(...occupied.map(({ x }) => x),),
    maxY: Math.max(...occupied.map(({ y }) => y),),
  } : null;
  return Object.freeze({
    pixels: Object.freeze(pixels),
    opaquePixels: occupied.length,
    bounds: bounds && Object.freeze(bounds),
    outOfBoundsWrites: Object.freeze(outOfBoundsWrites),
    digest: pixelDigest(pixels),
    alphaDigest: alphaDigest(pixels),
  });
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
      const x = index % 24;
      const y = Math.floor(index / 24);
      for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
        const next = (ny * 24) + nx;
        if (nx >= 0 && ny >= 0 && nx < 24 && ny < 24 && occupied.delete(next)) queue.push(next);
      }
    }
  }
  return components;
}

function countColors(pixels, colors) {
  return pixels.reduce((count, color) => count + (colors.has(color) ? 1 : 0), 0);
}

function rowRuns(pixels, y) {
  let runs = 0;
  let occupied = false;
  for (const color of pixels.slice(y * 24, (y + 1) * 24)) {
    if (color && !occupied) runs++;
    occupied = Boolean(color);
  }
  return runs;
}

async function fileHash(relativePath) {
  return createHash('sha256').update(await readFile(path.join(root, relativePath))).digest('hex');
}

function rejects(action, label, expected = 'is not implemented') {
  try {
    action();
    errors.push(label + ' must reject');
  } catch (error) {
    check(String(error.message).includes(expected), label + ' rejected unexpectedly: ' + error.message);
  }
}

check(
  EN_E07_MIREMANE_COURSER_GATE.status === 'approved'
    && EN_E07_MIREMANE_COURSER_GATE.approvedOn === '2026-08-11'
    && EN_E07_MIREMANE_COURSER_GATE.approvedImplementation === '74463a2b1944b7d3a6d412923c205a0c9cc648f1'
    && EN_E07_MIREMANE_COURSER_GATE.publishedImplementation === null
    && EN_E07_MIREMANE_COURSER_GATE.publishedApprovalRecord === null
    && EN_E07_MIREMANE_COURSER_GATE.initialPublishedHandoff === null
    && EN_E07_MIREMANE_COURSER_GATE.publicationState === 'authorized-pending-bounded-publication',
  'Miremane Courser bounded publication state drifted',
);
check(
  EN_E07_MIREMANE_COURSER_GATE.approvalEvidence.includes('designer replied: approved')
    && EN_E07_MIREMANE_COURSER_GATE.approvalEvidence.includes('IDs 7, 11, and 15')
    && EN_E07_MIREMANE_COURSER_GATE.approvalEvidence.includes('6efd596731a468be7647ee37f048046072bad289f209926e4db862cb63b01f32')
    && EN_E07_MIREMANE_COURSER_GATE.publicationAuthorizationEvidence.includes('commit and push everything i approve'),
  'approval evidence or bounded publication authorization drifted',
);
check(
  EN_E07_MIREMANE_COURSER_GATE.baseCheckpoint === '6ddef83e03e983672bee39b6b484dd1c1bfcba01'
    && EN_E07_MIREMANE_COURSER_GATE.authorizationEvidence.includes('designer replied: approved lets do next')
    && EN_E07_MIREMANE_COURSER_GATE.authorizationEvidence.includes('only one private common Kelpie Miremane Courser'),
  'authorization evidence or bounded interpretation drifted',
);
check(
  EN_E07_MIREMANE_COURSER_GATE.precedingApproval.gateId === EN_E07_MANYFOLD_USURPER_GATE.id
    && EN_E07_MIREMANE_COURSER_GATE.precedingApproval.candidateFrameDigest === EN_E07_MANYFOLD_USURPER_GATE.candidateFrameDigest
    && EN_E07_MIREMANE_COURSER_GATE.precedingApproval.publishedImplementation === EN_E07_MANYFOLD_USURPER_GATE.publishedImplementation
    && EN_E07_MIREMANE_COURSER_GATE.precedingApproval.publishedApprovalRecord === EN_E07_MANYFOLD_USURPER_GATE.publishedApprovalRecord
    && EN_E07_MIREMANE_COURSER_GATE.precedingApproval.initialPublishedHandoff === EN_E07_MANYFOLD_USURPER_GATE.initialPublishedHandoff
    && EN_E07_MIREMANE_COURSER_GATE.precedingApproval.currentReconciliation === '6ddef83e03e983672bee39b6b484dd1c1bfcba01',
  'approved Manyfold Usurper predecessor drifted',
);
check(
  EN_E07_MIREMANE_COURSER_GATE.scope.includes('complete 80-frame Miremane Courser common Kelpie')
    && EN_E07_MIREMANE_COURSER_GATE.animationContract.includes('four true alternating hoof phases')
    && EN_E07_MIREMANE_COURSER_GATE.animationContract.includes('connected head-and-shoulder lunge')
    && EN_E07_MIREMANE_COURSER_GATE.animationContract.includes('Cast aliases Attack exactly'),
  'full-suite or motion contract drifted',
);
check(
  EN_E07_MIREMANE_COURSER_GATE.exclusions.includes('Centaur humanoid torso or rider')
    && EN_E07_MIREMANE_COURSER_GATE.exclusions.includes('Unicorn horn or crown')
    && EN_E07_MIREMANE_COURSER_GATE.exclusions.includes('canine Wolf head or raised tail')
    && EN_E07_MIREMANE_COURSER_GATE.exclusions.includes('public Kelpie registration')
    && EN_E07_MIREMANE_COURSER_GATE.exclusions.includes('Kelpie specialist or elite')
    && EN_E07_MIREMANE_COURSER_GATE.exclusions.includes('EN-E08 and later work'),
  'scope exclusions drifted',
);
check(
  EN_E07_MIREMANE_COURSER_GATE.nextGate.includes('visually approved')
    && EN_E07_MIREMANE_COURSER_GATE.nextGate.includes('implementation 74463a2b1944b7d3a6d412923c205a0c9cc648f1')
    && EN_E07_MIREMANE_COURSER_GATE.nextGate.includes('approval record 8fb53e961247da875814593feb132182648f9e48')
    && EN_E07_MIREMANE_COURSER_GATE.nextGate.includes('remote verified')
    && EN_E07_MIREMANE_COURSER_GATE.nextGate.includes('No next Kelpie role is authorized')
    && EN_E07_MIREMANE_COURSER_GATE.nextGate.includes('remain closed')
    && EN_E07_MIREMANE_COURSER_GATE.nextGate.includes('separate lets do next'),
  'bounded publication or next-role stop gate drifted',
);
check(
  JSON.stringify(EN_E07_KELPIE_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E07_KELPIE_CONTRACT_CARD.precedingFamily.variant === 'manyfold-usurper'
    && EN_E07_KELPIE_CONTRACT_CARD.activeVariant.id === 'miremane-courser'
    && EN_E07_KELPIE_CONTRACT_CARD.activeVariant.role === 'common'
    && EN_E07_KELPIE_CONTRACT_CARD.activeVariant.status === 'implemented-full-approved'
    && JSON.stringify(EN_E07_KELPIE_CONTRACT_CARD.deferredRoles) === JSON.stringify(['specialist', 'elite']),
  'Kelpie role order or common-only boundary drifted',
);
check(
  EN_E07_MIREMANE_COURSER_CONTRACT.silhouette.includes('low lean grounded waterlogged horse')
    && EN_E07_MIREMANE_COURSER_CONTRACT.silhouette.includes('four separated legs')
    && EN_E07_MIREMANE_COURSER_CONTRACT.identity.includes('pale marsh-light profile eye')
    && EN_E07_MIREMANE_COURSER_CONTRACT.identity.includes('all water effects remain external')
    && EN_E07_MIREMANE_COURSER_DATA.bakedEffects.length === 0,
  'Miremane authored-equine identity or effect firewall drifted',
);
check(
  Object.isFrozen(EN_E07_MIREMANE_COURSER_GATE)
    && Object.isFrozen(EN_E07_MIREMANE_COURSER_DATA)
    && Object.isFrozen(EN_E07_MIREMANE_COURSER_CONTRACT)
    && Object.isFrozen(EN_E07_KELPIE_CONTRACT_CARD),
  'gate, data, and contracts must be deeply immutable',
);
check(
  EN_E07_MIREMANE_COURSER_REGISTRY.families.length === 1
    && EN_E07_MIREMANE_COURSER_REGISTRY.publicFamilies.length === 0
    && EN_E07_MIREMANE_COURSER_FAMILY.variants.length === 1,
  'candidate registry boundary drifted',
);

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(
  engine.ENEMIES.length === 57
    && engine.PUBLIC_ENEMIES.length === 80
    && publicVariantCount === 259
    && !engine.PUBLIC_ENEMIES.some(({ id }) => id === 'kelpie'),
  'candidate must preserve public 80/259 and keep Kelpie private',
);
check(engine.EN_E07_MIREMANE_COURSER_REGISTRY === undefined, 'candidate must not leak through the facade');

const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
check(!publicSource.includes('kelpie'), 'public expansion registry must not mention Kelpie');
check(!manifestSource.includes('kelpie'), 'asset manifest must not mention Kelpie');

const captures = new Map();
const candidateRecords = [];
const steppeHunterRecords = [];
const direWolfRecords = [];
const marshCrocodileRecords = [];
const palettes = [
  ['body', new Set(EN_E07_MIREMANE_COURSER_DATA.miremaneCourser.body)],
  ['mane', new Set(EN_E07_MIREMANE_COURSER_DATA.miremaneCourser.mane)],
  ['belly', new Set(EN_E07_MIREMANE_COURSER_DATA.miremaneCourser.belly)],
  ['reed', new Set(EN_E07_MIREMANE_COURSER_DATA.miremaneCourser.reed)],
];
let connected = 0;
let bounded = 0;
let grounded = 0;
let fourHoofRows = 0;
let equineSpanFrames = 0;
let colored = 0;
let flashes = 0;
let eyeViews = 0;
let readableMuzzleViews = 0;
let minOpaque = Infinity;
let maxOpaque = -Infinity;
let steppeHunterDifferences = 0;
let steppeHunterAlphaDifferences = 0;
let direWolfDifferences = 0;
let direWolfAlphaDifferences = 0;
let marshCrocodileDifferences = 0;
let marshCrocodileAlphaDifferences = 0;
let completeB = 0;
let formChanges = 0;

for (const animation of animations) for (const direction of directions) {
  const animationDigests = [];
  for (let frame = 0; frame < animation.frames; frame++) {
    const key = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E07_MIREMANE_COURSER_REGISTRY, candidateSpec, direction, animation.id, frame);
    const steppeHunter = captureEnemyExpansionFrame(EN_E03_COMMON_ALIAS_REGISTRY, steppeHunterSpec, direction, animation.id, frame);
    const direWolf = captureLegacyFrame(direWolfSpec, direction, animation.id, frame);
    const marshCrocodile = captureLegacyFrame(marshCrocodileSpec, direction, animation.id, frame);
    captures.set(key, candidate);
    animationDigests.push(candidate.digest);
    candidateRecords.push(frameRecord(candidate, candidateSpec, direction, animation.id, frame));
    steppeHunterRecords.push(frameRecord(steppeHunter, steppeHunterSpec, direction, animation.id, frame));
    direWolfRecords.push(frameRecord(direWolf, direWolfSpec, direction, animation.id, frame, false));
    marshCrocodileRecords.push(frameRecord(marshCrocodile, marshCrocodileSpec, direction, animation.id, frame, false));

    check(candidate.outOfBoundsWrites.length === 0, key + ' wrote outside the cell');
    check(candidate.alpha.every((value) => value === 0 || value === 255), key + ' lost hard alpha');
    if (componentCount(candidate.pixels) === 1) connected++;
    else check(false, key + ' must remain one connected actor');
    const isBounded = candidate.bounds
      && candidate.bounds.minX >= 1 && candidate.bounds.minY >= 1
      && candidate.bounds.maxX <= 22 && candidate.bounds.maxY <= 22;
    if (isBounded) bounded++;
    else check(false, key + ' lost the one-cell margin');
    const isGrounded = candidate.bounds && candidate.bounds.maxY === 22;
    if (isGrounded) grounded++;
    else check(false, key + ' lost dark-hoof ground contact');
    check(candidate.opaquePixels >= 100 && candidate.opaquePixels <= 280, key + ' density is implausible for the low lean common Kelpie');
    minOpaque = Math.min(minOpaque, candidate.opaquePixels);
    maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    const hoofRuns = rowRuns(candidate.pixels, 22);
    if (hoofRuns >= 4) fourHoofRows++;
    else check(false, key + ' lost four separated grounded hoof runs');
    const width = candidate.bounds.maxX - candidate.bounds.minX + 1;
    const height = candidate.bounds.maxY - candidate.bounds.minY + 1;
    const equineSpan = (direction === 'left' || direction === 'right') ? width >= 20 : height >= 18;
    if (equineSpan) equineSpanFrames++;
    else check(false, key + ' lost the long equine span');

    if (candidate.digest !== steppeHunter.digest) steppeHunterDifferences++;
    if (candidate.alphaDigest !== steppeHunter.alphaDigest) steppeHunterAlphaDifferences++;
    if (candidate.digest !== direWolf.digest) direWolfDifferences++;
    if (candidate.alphaDigest !== direWolf.alphaDigest) direWolfAlphaDifferences++;
    if (candidate.digest !== marshCrocodile.digest) marshCrocodileDifferences++;
    if (candidate.alphaDigest !== marshCrocodile.alphaDigest) marshCrocodileAlphaDifferences++;

    const flash = (animation.id === 'hurt' || animation.id === 'death') && frame === 0;
    if (flash) {
      const colors = new Set(candidate.pixels.filter(Boolean));
      check(colors.size === 1 && colors.has('#f4f4f4'), key + ' must be an exact whole-silhouette white flash');
      flashes++;
    } else {
      for (const [name, colors] of palettes) check(countColors(candidate.pixels, colors) > 0, key + ' lost ' + name + ' palette identity');
      check(countColors(candidate.pixels, new Set([EN_E07_MIREMANE_COURSER_DATA.miremaneCourser.hoof])) >= 4, key + ' lost the dark-hoof identity');
      const eyeCount = countColors(candidate.pixels, new Set([EN_E07_MIREMANE_COURSER_DATA.miremaneCourser.eye]));
      const featureCount = countColors(candidate.pixels, new Set([EN_E07_MIREMANE_COURSER_DATA.miremaneCourser.feature]));
      if (direction === 'up') {
        check(eyeCount === 0 && featureCount === 0, key + ' rear view must not expose face pixels');
      } else if (direction === 'down') {
        check(eyeCount === 2, key + ' front view must preserve a paired marsh-light gaze');
        check(featureCount >= 4, key + ' front view must preserve paired nostrils and mouth detail');
        eyeViews++;
        readableMuzzleViews++;
      } else {
        check(eyeCount === 1, key + ' side view must preserve one profile marsh-light eye');
        check(featureCount >= 1, key + ' side view must preserve a dark nostril');
        eyeViews++;
        readableMuzzleViews++;
      }
      colored++;
    }

    check(
      candidate.renderResult.miremaneCourserGate === EN_E07_MIREMANE_COURSER_GATE.id
        && candidate.renderResult.approvedPrecedingGate === EN_E07_MANYFOLD_USURPER_GATE.id,
      key + ' gate metadata drifted',
    );
    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E07_MIREMANE_COURSER_DATA);
    completeB += presentation.formComplete.reduce((sum, color, index) => sum + (color && !candidate.pixels[index] ? 1 : 0), 0);
    formChanges += presentation.form.reduce((sum, color, index) => sum + (candidate.pixels[index] && color !== candidate.pixels[index] ? 1 : 0), 0);
  }
  const uniqueMotion = new Set(animationDigests).size;
  if (animation.id === 'idle' || animation.id === 'hurt' || animation.id === 'death') check(uniqueMotion === 2, direction + ' ' + animation.id + ' must preserve both authored alias phases');
  else check(uniqueMotion >= 3, direction + ' ' + animation.id + ' must preserve distinct motion phases');
}

for (const direction of directions) {
  for (let frame = 0; frame < 4; frame++) {
    const attack = captures.get(direction + '/attack/' + frame);
    const cast = captures.get(direction + '/cast/' + frame);
    check(cast.digest === attack.digest, direction + ' Cast C' + (frame + 1) + ' must alias Attack exactly');
    const death = captures.get(direction + '/death/' + frame);
    const hurt = captures.get(direction + '/hurt/' + EN_E07_MIREMANE_COURSER_DEATH_SOURCE_FRAMES[frame]);
    check(death.digest === hurt.digest, direction + ' Death D' + (frame + 1) + ' must alias Hurt exactly');
  }
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = captures.get('left/' + animation.id + '/' + frame);
  const right = captures.get('right/' + animation.id + '/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels)), 'side mirror contract drifted for ' + animation.id + '/' + frame);
}

const candidateDigest = hashJson(candidateRecords);
const steppeHunterDigest = hashJson(steppeHunterRecords);
const direWolfDigest = hashJson(direWolfRecords);
const marshCrocodileDigest = hashJson(marshCrocodileRecords);
if (EN_E07_MIREMANE_COURSER_GATE.candidateFrameDigest) check(candidateDigest === EN_E07_MIREMANE_COURSER_GATE.candidateFrameDigest, 'candidate digest drifted');
if (EN_E07_MIREMANE_COURSER_GATE.steppeHunterComparisonDigest) check(steppeHunterDigest === EN_E07_MIREMANE_COURSER_GATE.steppeHunterComparisonDigest, 'Steppe Hunter comparison digest drifted');
if (EN_E07_MIREMANE_COURSER_GATE.direWolfComparisonDigest) check(direWolfDigest === EN_E07_MIREMANE_COURSER_GATE.direWolfComparisonDigest, 'Dire Wolf comparison digest drifted');
if (EN_E07_MIREMANE_COURSER_GATE.marshCrocodileComparisonDigest) check(marshCrocodileDigest === EN_E07_MIREMANE_COURSER_GATE.marshCrocodileComparisonDigest, 'Marsh Crocodile comparison digest drifted');

check(connected === 80 && bounded === 80 && grounded === 80, 'all 80 Miremane Courser frames must be connected, bounded, and grounded');
check(fourHoofRows === 80 && equineSpanFrames === 80, 'all 80 frames must preserve four separated hoof runs and the long equine span');
check(colored === 72 && flashes === 8 && eyeViews === 54 && readableMuzzleViews === 54, 'colored, flash, eye-view, or readable-muzzle totals drifted');
check(steppeHunterDifferences === 80 && steppeHunterAlphaDifferences === 80, 'Miremane Courser must differ from Steppe Hunter in all 80 pixel and alpha frames');
check(direWolfDifferences === 80 && direWolfAlphaDifferences === 80, 'Miremane Courser must differ from Dire Wolf in all 80 pixel and alpha frames');
check(marshCrocodileDifferences === 80 && marshCrocodileAlphaDifferences === 80, 'Miremane Courser must differ from Marsh Crocodile in all 80 pixel and alpha frames');
check(completeB > 0 && formChanges > 0, 'Complete B + Form presentation must visibly change the candidate');

if (EN_E07_MIREMANE_COURSER_GATE.artifactSha256) check(await fileHash(EN_E07_MIREMANE_COURSER_GATE.artifact) === EN_E07_MIREMANE_COURSER_GATE.artifactSha256, 'raw review artifact drifted');
if (EN_E07_MIREMANE_COURSER_GATE.assembledArtifactSha256) check(await fileHash(EN_E07_MIREMANE_COURSER_GATE.assembledArtifact) === EN_E07_MIREMANE_COURSER_GATE.assembledArtifactSha256, 'Complete B + Form artifact drifted');
if (EN_E07_MIREMANE_COURSER_GATE.comparisonArtifactSha256) check(await fileHash(EN_E07_MIREMANE_COURSER_GATE.comparisonArtifact) === EN_E07_MIREMANE_COURSER_GATE.comparisonArtifactSha256, 'comparison artifact drifted');
if (EN_E07_MIREMANE_COURSER_GATE.reviewAnimations.raw.sha256) check(await fileHash(EN_E07_MIREMANE_COURSER_GATE.reviewAnimations.raw.artifact) === EN_E07_MIREMANE_COURSER_GATE.reviewAnimations.raw.sha256, 'raw GIF drifted');
if (EN_E07_MIREMANE_COURSER_GATE.reviewAnimations.completeBForm.sha256) check(await fileHash(EN_E07_MIREMANE_COURSER_GATE.reviewAnimations.completeBForm.artifact) === EN_E07_MIREMANE_COURSER_GATE.reviewAnimations.completeBForm.sha256, 'Complete B + Form GIF drifted');

rejects(() => captureEnemyExpansionFrame(EN_E07_MIREMANE_COURSER_REGISTRY, candidateSpec, 'down', 'idle', 2), 'out-of-range Idle', 'invalid for idle');
rejects(() => captureEnemyExpansionFrame(EN_E07_MIREMANE_COURSER_REGISTRY, { ...candidateSpec, family: 'centaur' }, 'down', 'idle', 0), 'wrong family');
rejects(() => captureEnemyExpansionFrame(EN_E07_MIREMANE_COURSER_REGISTRY, { ...candidateSpec, variant: 'horned-courser' }, 'down', 'idle', 0), 'wrong variant');

if (errors.length) {
  console.error('EN-E07 Kelpie Miremane Courser focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E07 Kelpie Miremane Courser focused gate passed.');
  console.log('- Steppe Hunter distinction: ' + steppeHunterDifferences + '/80 pixel frames and ' + steppeHunterAlphaDifferences + '/80 alpha silhouettes differ');
  console.log('- Dire Wolf distinction: ' + direWolfDifferences + '/80 pixel frames and ' + direWolfAlphaDifferences + '/80 alpha silhouettes differ');
  console.log('- Marsh Crocodile distinction: ' + marshCrocodileDifferences + '/80 pixel frames and ' + marshCrocodileAlphaDifferences + '/80 alpha silhouettes differ');
  console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; opaque range ' + minOpaque + '-' + maxOpaque);
  console.log('- Style identity: ' + fourHoofRows + '/80 four-hoof rows; ' + equineSpanFrames + '/80 long equine spans; ' + colored + '/72 colored palette frames; ' + flashes + '/8 exact white flashes; ' + eyeViews + '/54 expected eye-bearing views; ' + readableMuzzleViews + '/54 readable muzzle views');
  console.log('- Presentation: Complete B +' + completeB + '; Form changes ' + formChanges);
  console.log('- Protected: approved Steppe Hunter and public Dire Wolf and Marsh Crocodile exact; public 80/259; fixtures unchanged');
  console.log('- Candidate digest: ' + candidateDigest);
  console.log('- Approved Steppe Hunter frame digest: ' + steppeHunterDigest);
  console.log('- Public Dire Wolf frame digest: ' + direWolfDigest);
  console.log('- Public Marsh Crocodile frame digest: ' + marshCrocodileDigest);
}
