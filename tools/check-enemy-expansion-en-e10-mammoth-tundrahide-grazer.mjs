import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import {
  EN_E10_GLOAMCROWN_SOVEREIGN_GATE,
  EN_E10_GLOAMCROWN_SOVEREIGN_REGISTRY,
} from '../engine/enemy-expansion-en-e10-stag-gloamcrown-sovereign.js';
import {
  EN_E10_CRAGCROWN_PATRIARCH_GATE,
  EN_E10_CRAGCROWN_PATRIARCH_REGISTRY,
} from '../engine/enemy-expansion-en-e10-ram-cragcrown-patriarch.js';
import {
  EN_E10_MAMMOTH_TOPOLOGY_DECISION,
  EN_E10_MAMMOTH_CONTRACT_CARD,
  EN_E10_TUNDRAHIDE_GRAZER_CONTRACT,
  EN_E10_TUNDRAHIDE_GRAZER_DATA,
  EN_E10_TUNDRAHIDE_GRAZER_DEATH_SOURCE_FRAMES,
  EN_E10_TUNDRAHIDE_GRAZER_FAMILY,
  EN_E10_TUNDRAHIDE_GRAZER_GATE,
  EN_E10_TUNDRAHIDE_GRAZER_REGISTRY,
} from '../engine/enemy-expansion-en-e10-mammoth-tundrahide-grazer.js';
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
  candidate: { kind: 'enemy', family: 'mammoth', variant: 'tundrahide-grazer' },
  gloamcrown: { kind: 'enemy', family: 'stag', variant: 'gloamcrown-sovereign' },
  cragcrown: { kind: 'enemy', family: 'ram', variant: 'cragcrown-patriarch' },
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
      const x = index % 24;
      const y = Math.floor(index / 24);
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
  let runs = 0;
  let occupied = false;
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
  EN_E10_GLOAMCROWN_SOVEREIGN_GATE.status === 'approved'
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.candidateFrameDigest === '5a80240ca6bfb16eb6a53b0b95b5214323a9dde25814b48fb39e9caaf11e4855'
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.publishedImplementation === '0ece468efeaf4b50351358020075b4bf91dc7cff'
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.publishedApprovalRecord === '378ec3d107b43e6b354cadcad16f64e0a8cf838b'
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.initialPublishedHandoff === 'be5d7c7316e035021ef805b0f1f6843b10df9c32'
    && EN_E10_GLOAMCROWN_SOVEREIGN_GATE.publicationState === 'published',
  'published Gloamcrown predecessor drifted',
);
check(
  EN_E10_MAMMOTH_TOPOLOGY_DECISION.status === 'selected'
    && EN_E10_MAMMOTH_TOPOLOGY_DECISION.selected === 'baked-single-actor-tusked-heavy-grounded-quadruped'
    && EN_E10_MAMMOTH_TOPOLOGY_DECISION.childAssets.length === 0
    && EN_E10_MAMMOTH_TOPOLOGY_DECISION.approvalEvidence.includes('The designer replied: approved.')
    && EN_E10_MAMMOTH_TOPOLOGY_DECISION.approvalEvidence.includes('exactly one private common Mammoth full 80-frame candidate'),
  'approved Mammoth topology decision drifted',
);
check(
  EN_E10_TUNDRAHIDE_GRAZER_GATE.status === 'approved'
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.baseCheckpoint === 'c371e7ffeb3dd9196c29b9236d62585d96a52585'
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.architectureDecision === EN_E10_MAMMOTH_TOPOLOGY_DECISION.id
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.approvedOn === '2026-08-13'
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.approvalEvidence.includes('raw sprite 155')
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.approvalEvidence.includes('outlined sprite 159')
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.approvalEvidence.includes('Complete B + Form sprite 163')
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.approvalEvidence.includes('active comparison sprite 167')
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.approvalEvidence.includes('740960848a5a45941a908b8f32d53a6426de789f7ca002817309e7506dcd3e08')
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.approvalEvidence.includes('designer replied: awesome klets do next')
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.approvedImplementation === 'f0ced3c777c478a4077fb439ccd8b4b363ea52ac'
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.publicationAuthorizedOn === '2026-08-13'
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.publicationAuthorizationEvidence.includes('commit and push everything i approve')
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.publishedImplementation === 'f0ced3c777c478a4077fb439ccd8b4b363ea52ac'
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.publishedApprovalRecord === '2387ec0a584f77b3473827ef0568823bf86b4fd2'
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.initialPublishedHandoff === ''
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.publicationState === 'published-awaiting-handoff-reconciliation'
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.precedingApproval.gateId === EN_E10_GLOAMCROWN_SOVEREIGN_GATE.id
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.precedingApproval.candidateFrameDigest === EN_E10_GLOAMCROWN_SOVEREIGN_GATE.candidateFrameDigest
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.precedingApproval.publishedImplementation === EN_E10_GLOAMCROWN_SOVEREIGN_GATE.publishedImplementation
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.precedingApproval.publishedApprovalRecord === EN_E10_GLOAMCROWN_SOVEREIGN_GATE.publishedApprovalRecord
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.precedingApproval.initialPublishedHandoff === EN_E10_GLOAMCROWN_SOVEREIGN_GATE.initialPublishedHandoff
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.precedingApproval.currentReconciliation === EN_E10_TUNDRAHIDE_GRAZER_GATE.baseCheckpoint,
  'Mammoth candidate authorization or predecessor tuple drifted',
);
check(
  JSON.stringify(EN_E10_MAMMOTH_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E10_MAMMOTH_CONTRACT_CARD.activeVariant.id === 'tundrahide-grazer'
    && EN_E10_MAMMOTH_CONTRACT_CARD.activeVariant.role === 'common'
    && EN_E10_MAMMOTH_CONTRACT_CARD.activeVariant.status === 'implemented-full-approved'
    && EN_E10_MAMMOTH_CONTRACT_CARD.deferredRoles.join(',') === 'specialist,elite'
    && EN_E10_TUNDRAHIDE_GRAZER_CONTRACT.state === 'implemented-complete-motion-approved',
  'Mammoth role or candidate contract drifted',
);
check(
  EN_E10_TUNDRAHIDE_GRAZER_DATA.actorTopology === EN_E10_MAMMOTH_TOPOLOGY_DECISION.selected
    && EN_E10_TUNDRAHIDE_GRAZER_DATA.childAssets.length === 0
    && EN_E10_TUNDRAHIDE_GRAZER_DATA.bakedEffects.length === 0
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.animationContract.includes('body-owned tusk shove')
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.animationContract.includes('Cast aliases Attack exactly')
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.exclusions.includes('public Mammoth registration or outline registration')
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.nextGate.includes('implementation f0ced3c777c478a4077fb439ccd8b4b363ea52ac')
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.nextGate.includes('approval record 2387ec0a584f77b3473827ef0568823bf86b4fd2')
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.nextGate.includes('initial published handoff and final reconciliation remain open')
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.nextGate.includes('private specialist Mammoth')
    && EN_E10_TUNDRAHIDE_GRAZER_GATE.nextGate.includes('review evidence only'),
  'Mammoth anatomy, effect firewall, motion, or stop boundary drifted',
);
check(
  Object.isFrozen(EN_E10_MAMMOTH_TOPOLOGY_DECISION)
    && Object.isFrozen(EN_E10_MAMMOTH_CONTRACT_CARD)
    && Object.isFrozen(EN_E10_TUNDRAHIDE_GRAZER_CONTRACT)
    && Object.isFrozen(EN_E10_TUNDRAHIDE_GRAZER_DATA)
    && Object.isFrozen(EN_E10_TUNDRAHIDE_GRAZER_GATE),
  'Mammoth contracts, data, and gate must be deeply immutable',
);
check(
  EN_E10_TUNDRAHIDE_GRAZER_REGISTRY.families.length === 1
    && EN_E10_TUNDRAHIDE_GRAZER_REGISTRY.publicFamilies.length === 0
    && EN_E10_TUNDRAHIDE_GRAZER_FAMILY.variants.length === 1,
  'private common Mammoth registry boundary drifted',
);

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && engine.PUBLIC_ENEMIES.length === 92 && publicVariantCount === 294 && !engine.PUBLIC_ENEMIES.some(({ id }) => id === 'mammoth'), 'candidate must preserve public 92/294 and keep Mammoth private');
check(engine.EN_E10_TUNDRAHIDE_GRAZER_REGISTRY === undefined, 'candidate must not leak through the public facade');
const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
const outlineSource = await readFile(path.join(root, 'engine', 'outline-renderer.js'), 'utf8');
check(!publicSource.includes('tundrahide-grazer'), 'public expansion registry must not mention Tundrahide Grazer');
check(!manifestSource.includes('tundrahide-grazer'), 'asset manifest must not mention Tundrahide Grazer');
check(!outlineSource.includes('tundrahide-grazer'), 'outline registry must not mention Tundrahide Grazer');
check(JSON.stringify(EN_E10_TUNDRAHIDE_GRAZER_DEATH_SOURCE_FRAMES) === JSON.stringify([0, 1, 1, 1]), 'Death alias mapping drifted');

const captures = new Map();
const records = { candidate: [], gloamcrown: [], cragcrown: [], direWolf: [] };
const colors = EN_E10_TUNDRAHIDE_GRAZER_DATA.tundrahideGrazer;
const palettes = [
  ['wool', new Set(colors.wool)], ['face', new Set(colors.face)], ['belly', new Set(colors.belly)],
  ['frost', new Set(colors.frost)], ['ear', new Set(colors.ear)],
];
let connected = 0;
let bounded = 0;
let grounded = 0;
let fourFootRows = 0;
let mammothSpans = 0;
let tuskViews = 0;
let colored = 0;
let flashes = 0;
let eyeViews = 0;
let trunkViews = 0;
let minOpaque = Infinity;
let maxOpaque = -Infinity;
let outlinedPixels = 0;
let formChanges = 0;
const differences = { gloamcrown: 0, cragcrown: 0, direWolf: 0 };
const alphaDifferences = { gloamcrown: 0, cragcrown: 0, direWolf: 0 };

for (const animation of animations) for (const direction of directions) {
  const animationDigests = [];
  for (let frame = 0; frame < animation.frames; frame++) {
    const captureKey = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E10_TUNDRAHIDE_GRAZER_REGISTRY, specs.candidate, direction, animation.id, frame);
    const gloamcrown = captureEnemyExpansionFrame(EN_E10_GLOAMCROWN_SOVEREIGN_REGISTRY, specs.gloamcrown, direction, animation.id, frame);
    const cragcrown = captureEnemyExpansionFrame(EN_E10_CRAGCROWN_PATRIARCH_REGISTRY, specs.cragcrown, direction, animation.id, frame);
    const direWolf = captureLegacyFrame(specs.direWolf, direction, animation.id, frame);
    const compared = { gloamcrown, cragcrown, direWolf };
    captures.set(captureKey, candidate);
    animationDigests.push(candidate.digest);
    records.candidate.push(frameRecord(candidate, specs.candidate, direction, animation.id, frame));
    records.gloamcrown.push(frameRecord(gloamcrown, specs.gloamcrown, direction, animation.id, frame));
    records.cragcrown.push(frameRecord(cragcrown, specs.cragcrown, direction, animation.id, frame));
    records.direWolf.push(frameRecord(direWolf, specs.direWolf, direction, animation.id, frame, false));

    check(candidate.outOfBoundsWrites.length === 0, captureKey + ' wrote outside the cell');
    check(candidate.alpha.every((value) => value === 0 || value === 255), captureKey + ' lost hard alpha');
    if (componentCount(candidate.pixels) === 1) connected++; else check(false, captureKey + ' must remain one connected actor');
    const isBounded = candidate.bounds && candidate.bounds.minX >= 1 && candidate.bounds.minY >= 1 && candidate.bounds.maxX <= 22 && candidate.bounds.maxY <= 22;
    if (isBounded) bounded++; else check(false, captureKey + ' lost the one-cell margin');
    if (candidate.bounds && candidate.bounds.maxY === 22) grounded++; else check(false, captureKey + ' lost broad-foot ground contact');
    check(candidate.opaquePixels >= 155 && candidate.opaquePixels <= 355, captureKey + ' density is implausible for a common Mammoth');
    minOpaque = Math.min(minOpaque, candidate.opaquePixels);
    maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    const footRuns = rowRuns(candidate.pixels, 22);
    if (footRuns >= 4) fourFootRows++; else check(false, captureKey + ' lost four separated grounded broad-foot runs');
    const width = candidate.bounds.maxX - candidate.bounds.minX + 1;
    const height = candidate.bounds.maxY - candidate.bounds.minY + 1;
    const mammothSpan = (direction === 'left' || direction === 'right') ? width >= 20 : height >= 18;
    if (mammothSpan) mammothSpans++; else check(false, captureKey + ' lost the heavy domed Mammoth span');

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
      check(countColors(candidate.pixels, new Set([colors.foot])) >= 8, captureKey + ' lost four dark broad-foot contacts');
      const eyeCount = countColors(candidate.pixels, new Set([colors.eye]));
      const featureCount = countColors(candidate.pixels, new Set([colors.feature]));
      const tuskCount = countColors(candidate.pixels, new Set(colors.tusk));
      if (direction === 'up') {
        check(eyeCount === 0 && featureCount === 0 && tuskCount === 0, captureKey + ' rear view must not expose face or tusk pixels');
      } else if (direction === 'down') {
        check(eyeCount === 2, captureKey + ' front view must preserve paired amber eyes');
        check(featureCount >= 2, captureKey + ' front view must preserve trunk-face features');
        check(tuskCount >= 10, captureKey + ' front view must preserve paired ivory tusks');
        eyeViews++; trunkViews++; tuskViews++;
      } else {
        check(eyeCount === 1, captureKey + ' side view must preserve one amber profile eye');
        check(featureCount >= 1, captureKey + ' side view must preserve the trunk-face feature');
        check(tuskCount >= 5, captureKey + ' side view must preserve the readable profile tusk');
        eyeViews++; trunkViews++; tuskViews++;
      }
      colored++;
    }

    check(
      candidate.renderResult.tundrahideGrazerGate === EN_E10_TUNDRAHIDE_GRAZER_GATE.id
        && candidate.renderResult.architectureDecision === EN_E10_MAMMOTH_TOPOLOGY_DECISION.id
        && candidate.renderResult.approvedPrecedingGate === EN_E10_GLOAMCROWN_SOVEREIGN_GATE.id
        && candidate.renderResult.childAssetCount === 0,
      captureKey + ' renderer gate or child boundary drifted',
    );
    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E10_TUNDRAHIDE_GRAZER_DATA);
    outlinedPixels += presentation.complete.reduce((sum, color, index) => sum + (color && !candidate.pixels[index] ? 1 : 0), 0);
    formChanges += presentation.form.reduce((sum, color, index) => sum + (candidate.pixels[index] && color !== candidate.pixels[index] ? 1 : 0), 0);
  }
  const uniqueMotion = new Set(animationDigests).size;
  if (animation.id === 'idle' || animation.id === 'hurt' || animation.id === 'death') check(uniqueMotion === 2, direction + ' ' + animation.id + ' must preserve both authored alias phases');
  else check(uniqueMotion >= 3, direction + ' ' + animation.id + ' must preserve distinct motion phases');
}

for (const direction of directions) for (let frame = 0; frame < 4; frame++) {
  const attack = captures.get(direction + '/attack/' + frame);
  const cast = captures.get(direction + '/cast/' + frame);
  check(cast.digest === attack.digest, direction + ' Cast C' + (frame + 1) + ' must alias Attack exactly');
  const death = captures.get(direction + '/death/' + frame);
  const hurt = captures.get(direction + '/hurt/' + EN_E10_TUNDRAHIDE_GRAZER_DEATH_SOURCE_FRAMES[frame]);
  check(death.digest === hurt.digest, direction + ' Death D' + (frame + 1) + ' must alias Hurt exactly');
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = captures.get('left/' + animation.id + '/' + frame);
  const right = captures.get('right/' + animation.id + '/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels)), 'side mirror contract drifted for ' + animation.id + '/' + frame);
}

const digests = Object.fromEntries(Object.keys(records).map((name) => [name, hashJson(records[name])]));
if (EN_E10_TUNDRAHIDE_GRAZER_GATE.candidateFrameDigest) check(digests.candidate === EN_E10_TUNDRAHIDE_GRAZER_GATE.candidateFrameDigest, 'candidate digest drifted');
if (EN_E10_TUNDRAHIDE_GRAZER_GATE.gloamcrownComparisonDigest) check(digests.gloamcrown === EN_E10_TUNDRAHIDE_GRAZER_GATE.gloamcrownComparisonDigest, 'Gloamcrown comparison digest drifted');
if (EN_E10_TUNDRAHIDE_GRAZER_GATE.cragcrownComparisonDigest) check(digests.cragcrown === EN_E10_TUNDRAHIDE_GRAZER_GATE.cragcrownComparisonDigest, 'Cragcrown comparison digest drifted');
if (EN_E10_TUNDRAHIDE_GRAZER_GATE.direWolfComparisonDigest) check(digests.direWolf === EN_E10_TUNDRAHIDE_GRAZER_GATE.direWolfComparisonDigest, 'Dire Wolf comparison digest drifted');
check(digests.gloamcrown === EN_E10_GLOAMCROWN_SOVEREIGN_GATE.candidateFrameDigest, 'approved Gloamcrown comparison source drifted');
check(digests.cragcrown === EN_E10_CRAGCROWN_PATRIARCH_GATE.candidateFrameDigest, 'approved Cragcrown comparison source drifted');
check(connected === 80 && bounded === 80 && grounded === 80, 'all 80 Tundrahide frames must be connected, bounded, and grounded');
check(fourFootRows === 80 && mammothSpans === 80, 'all 80 frames must preserve four broad feet and the heavy domed Mammoth span');
check(colored === 72 && flashes === 8 && eyeViews === 54 && trunkViews === 54 && tuskViews === 54, 'colored, flash, eye, trunk, or tusk view totals drifted');
for (const name of Object.keys(differences)) check(differences[name] === 80 && alphaDifferences[name] === 80, 'Tundrahide Grazer must differ from ' + name + ' in all 80 pixel and alpha frames');
check(outlinedPixels > 0 && formChanges > 0, 'Complete B outline and Form presentations must visibly change the candidate');

for (const [field, relative] of [
  ['artifactSha256', EN_E10_TUNDRAHIDE_GRAZER_GATE.artifact],
  ['outlinedArtifactSha256', EN_E10_TUNDRAHIDE_GRAZER_GATE.outlinedArtifact],
  ['assembledArtifactSha256', EN_E10_TUNDRAHIDE_GRAZER_GATE.assembledArtifact],
  ['comparisonArtifactSha256', EN_E10_TUNDRAHIDE_GRAZER_GATE.comparisonArtifact],
]) if (EN_E10_TUNDRAHIDE_GRAZER_GATE[field]) check(await fileHash(relative) === EN_E10_TUNDRAHIDE_GRAZER_GATE[field], field + ' drifted');
for (const review of Object.values(EN_E10_TUNDRAHIDE_GRAZER_GATE.reviewAnimations)) if (review.sha256) check(await fileHash(review.artifact) === review.sha256, review.artifact + ' drifted');

rejects(() => captureEnemyExpansionFrame(EN_E10_TUNDRAHIDE_GRAZER_REGISTRY, specs.candidate, 'down', 'idle', 2), 'out-of-range Idle', 'invalid for idle');
rejects(() => captureEnemyExpansionFrame(EN_E10_TUNDRAHIDE_GRAZER_REGISTRY, { ...specs.candidate, family: 'wolf' }, 'down', 'idle', 0), 'wrong family');
rejects(() => captureEnemyExpansionFrame(EN_E10_TUNDRAHIDE_GRAZER_REGISTRY, { ...specs.candidate, variant: 'gloamcrown-sovereign' }, 'down', 'idle', 0), 'wrong variant');

if (errors.length) {
  console.error('EN-E10 Mammoth Tundrahide Grazer focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E10 Mammoth Tundrahide Grazer private common candidate passes focused validation.');
  console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; opaque range ' + minOpaque + '-' + maxOpaque);
  console.log('- Mammoth identity: ' + fourFootRows + '/80 four-foot rows; ' + mammothSpans + '/80 heavy domed spans; ' + tuskViews + '/54 tusk views; ' + flashes + '/8 white flashes; ' + eyeViews + '/54 eye-bearing views; ' + trunkViews + '/54 trunk-face views');
  console.log('- Distinction: Gloamcrown ' + differences.gloamcrown + '/80; Cragcrown ' + differences.cragcrown + '/80; Dire Wolf ' + differences.direWolf + '/80 pixel and alpha frames differ');
  console.log('- Presentation: Complete B outline +' + outlinedPixels + ' pixels; Form changes ' + formChanges);
  console.log('- Protected: approved Gloamcrown and Cragcrown exact; public 92/294; zero child assets/effects; no outline registration; fixtures unchanged');
  console.log('- Candidate frame digest: ' + digests.candidate);
  console.log('- Approved Gloamcrown frame digest: ' + digests.gloamcrown);
  console.log('- Approved Cragcrown frame digest: ' + digests.cragcrown);
  console.log('- Public Dire Wolf frame digest: ' + digests.direWolf);
}
