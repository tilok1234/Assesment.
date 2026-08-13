import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import { EN_E10_MAMMOTH_TOPOLOGY_DECISION, EN_E10_TUNDRAHIDE_GRAZER_GATE, EN_E10_TUNDRAHIDE_GRAZER_REGISTRY } from '../engine/enemy-expansion-en-e10-mammoth-tundrahide-grazer.js';
import { EN_E10_FROSTVEIN_WAYFINDER_GATE, EN_E10_FROSTVEIN_WAYFINDER_REGISTRY } from '../engine/enemy-expansion-en-e10-mammoth-frostvein-wayfinder.js';
import {
  EN_E10_MAMMOTH_ELITE_CONTRACT_CARD,
  EN_E10_RIMEVAULT_MATRIARCH_CONTRACT,
  EN_E10_RIMEVAULT_MATRIARCH_DATA,
  EN_E10_RIMEVAULT_MATRIARCH_DEATH_SOURCE_FRAMES,
  EN_E10_RIMEVAULT_MATRIARCH_FAMILY,
  EN_E10_RIMEVAULT_MATRIARCH_GATE,
  EN_E10_RIMEVAULT_MATRIARCH_REGISTRY,
} from '../engine/enemy-expansion-en-e10-mammoth-rimevault-matriarch.js';
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
  candidate: { kind: 'enemy', family: 'mammoth', variant: 'rimevault-matriarch' },
  frostvein: { kind: 'enemy', family: 'mammoth', variant: 'frostvein-wayfinder' },
  tundrahide: { kind: 'enemy', family: 'mammoth', variant: 'tundrahide-grazer' },
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
  return Object.freeze({ pixels: Object.freeze(pixels), opaquePixels: occupied.length, bounds: bounds && Object.freeze(bounds), outOfBoundsWrites: Object.freeze(outOfBoundsWrites), digest: pixelDigest(pixels), alphaDigest: alphaDigest(pixels), alpha: Object.freeze(pixels.map((color) => color ? 255 : 0)) });
}

function componentCount(pixels) {
  const occupied = new Set(pixels.flatMap((color, index) => color ? [index] : []));
  let components = 0;
  while (occupied.size) {
    components++;
    const first = occupied.values().next().value;
    const stack = [first];
    occupied.delete(first);
    while (stack.length) {
      const index = stack.pop();
      const x = index % 24, y = Math.floor(index / 24);
      for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
        const next = (ny * 24) + nx;
        if (nx >= 0 && ny >= 0 && nx < 24 && ny < 24 && occupied.delete(next)) stack.push(next);
      }
    }
  }
  return components;
}

function countColors(pixels, colors) { return pixels.reduce((sum, color) => sum + (colors.has(color) ? 1 : 0), 0); }
function rowRuns(pixels, row) {
  let runs = 0, occupied = false;
  for (let x = 0; x < 24; x++) {
    const color = pixels[(row * 24) + x];
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
  EN_E10_FROSTVEIN_WAYFINDER_GATE.status === 'approved'
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.candidateFrameDigest === '2fbcd71017d4acacb9e8cfee31d984ad9f039634af79cb656180b11a08f1250e'
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.publishedImplementation === '03618d6ca98ad1a93596bdbe501edcf1cedd466a'
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.publishedApprovalRecord === '36c43772911aa0ab81d4a417fc1ad2a29531aa30'
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.initialPublishedHandoff === 'c03f2fb05746398e530ff80e2ebacbe261cc5422'
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.publicationState === 'published'
    && EN_E10_FROSTVEIN_WAYFINDER_GATE.nextGate.includes('private elite Mammoth full 80-frame candidate'),
  'published Frostvein predecessor drifted',
);
check(
  EN_E10_MAMMOTH_TOPOLOGY_DECISION.status === 'selected'
    && EN_E10_MAMMOTH_TOPOLOGY_DECISION.selected === 'baked-single-actor-tusked-heavy-grounded-quadruped'
    && EN_E10_MAMMOTH_TOPOLOGY_DECISION.childAssets.length === 0,
  'approved Mammoth topology decision drifted',
);
check(
  EN_E10_RIMEVAULT_MATRIARCH_GATE.status === 'awaiting-visual-approval'
    && EN_E10_RIMEVAULT_MATRIARCH_GATE.baseCheckpoint === 'd93dc918e379212743433c5a505029c42dfa0182'
    && EN_E10_RIMEVAULT_MATRIARCH_GATE.authorizedOn === '2026-08-13'
    && EN_E10_RIMEVAULT_MATRIARCH_GATE.authorizationEvidence.includes('designer reply approved lets do next')
    && EN_E10_RIMEVAULT_MATRIARCH_GATE.authorizationEvidence.includes('exactly one private elite Mammoth full 80-frame candidate')
    && EN_E10_RIMEVAULT_MATRIARCH_GATE.architectureDecision === EN_E10_MAMMOTH_TOPOLOGY_DECISION.id
    && EN_E10_RIMEVAULT_MATRIARCH_GATE.precedingApproval.gateId === EN_E10_FROSTVEIN_WAYFINDER_GATE.id
    && EN_E10_RIMEVAULT_MATRIARCH_GATE.precedingApproval.candidateFrameDigest === EN_E10_FROSTVEIN_WAYFINDER_GATE.candidateFrameDigest
    && EN_E10_RIMEVAULT_MATRIARCH_GATE.precedingApproval.publishedImplementation === EN_E10_FROSTVEIN_WAYFINDER_GATE.publishedImplementation
    && EN_E10_RIMEVAULT_MATRIARCH_GATE.precedingApproval.publishedApprovalRecord === EN_E10_FROSTVEIN_WAYFINDER_GATE.publishedApprovalRecord
    && EN_E10_RIMEVAULT_MATRIARCH_GATE.precedingApproval.initialPublishedHandoff === EN_E10_FROSTVEIN_WAYFINDER_GATE.initialPublishedHandoff
    && EN_E10_RIMEVAULT_MATRIARCH_GATE.precedingApproval.currentReconciliation === EN_E10_RIMEVAULT_MATRIARCH_GATE.baseCheckpoint,
  'elite Mammoth authorization or predecessor tuple drifted',
);
check(
  JSON.stringify(EN_E10_MAMMOTH_ELITE_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E10_MAMMOTH_ELITE_CONTRACT_CARD.precedingVariant.id === 'frostvein-wayfinder'
    && EN_E10_MAMMOTH_ELITE_CONTRACT_CARD.activeVariant.id === 'rimevault-matriarch'
    && EN_E10_MAMMOTH_ELITE_CONTRACT_CARD.activeVariant.role === 'elite'
    && EN_E10_MAMMOTH_ELITE_CONTRACT_CARD.deferredRoles.length === 0
    && EN_E10_RIMEVAULT_MATRIARCH_CONTRACT.state === 'implemented-complete-motion-awaiting-visual-approval',
  'Mammoth elite role or candidate contract drifted',
);
check(
  EN_E10_RIMEVAULT_MATRIARCH_DATA.actorTopology === EN_E10_MAMMOTH_TOPOLOGY_DECISION.selected
    && EN_E10_RIMEVAULT_MATRIARCH_DATA.childAssets.length === 0
    && EN_E10_RIMEVAULT_MATRIARCH_DATA.bakedEffects.length === 0
    && EN_E10_RIMEVAULT_MATRIARCH_GATE.animationContract.includes('connected trunk')
    && EN_E10_RIMEVAULT_MATRIARCH_GATE.animationContract.includes('double-tusk press')
    && EN_E10_RIMEVAULT_MATRIARCH_GATE.animationContract.includes('Cast aliases Attack exactly')
    && EN_E10_RIMEVAULT_MATRIARCH_GATE.exclusions.includes('public Mammoth registration or outline registration')
    && EN_E10_RIMEVAULT_MATRIARCH_GATE.nextGate.includes('Do not commit, push, register, or publish'),
  'elite Mammoth anatomy, effect firewall, motion, or stop boundary drifted',
);
check(
  Object.isFrozen(EN_E10_MAMMOTH_ELITE_CONTRACT_CARD)
    && Object.isFrozen(EN_E10_RIMEVAULT_MATRIARCH_CONTRACT)
    && Object.isFrozen(EN_E10_RIMEVAULT_MATRIARCH_DATA)
    && Object.isFrozen(EN_E10_RIMEVAULT_MATRIARCH_GATE),
  'elite Mammoth contracts, data, and gate must be deeply immutable',
);
check(
  EN_E10_RIMEVAULT_MATRIARCH_REGISTRY.families.length === 1
    && EN_E10_RIMEVAULT_MATRIARCH_REGISTRY.publicFamilies.length === 0
    && EN_E10_RIMEVAULT_MATRIARCH_FAMILY.variants.length === 1,
  'private elite Mammoth registry boundary drifted',
);

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && engine.PUBLIC_ENEMIES.length === 92 && publicVariantCount === 294 && !engine.PUBLIC_ENEMIES.some(({ id }) => id === 'mammoth'), 'candidate must preserve public 92/294 and keep Mammoth private');
check(engine.EN_E10_RIMEVAULT_MATRIARCH_REGISTRY === undefined, 'candidate must not leak through the public facade');
const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
const outlineSource = await readFile(path.join(root, 'engine', 'outline-renderer.js'), 'utf8');
check(!publicSource.includes('rimevault-matriarch'), 'public expansion registry must not mention Rimevault Matriarch');
check(!manifestSource.includes('rimevault-matriarch'), 'asset manifest must not mention Rimevault Matriarch');
check(!outlineSource.includes('rimevault-matriarch'), 'outline registry must not mention Rimevault Matriarch');
check(JSON.stringify(EN_E10_RIMEVAULT_MATRIARCH_DEATH_SOURCE_FRAMES) === JSON.stringify([0, 1, 1, 1]), 'Death alias mapping drifted');

const captures = new Map();
const records = { candidate: [], frostvein: [], tundrahide: [], direWolf: [] };
const colors = EN_E10_RIMEVAULT_MATRIARCH_DATA.rimevaultMatriarch;
const palettes = [
  ['wool', new Set(colors.wool)], ['face', new Set(colors.face)], ['mantle', new Set(colors.mantle)],
  ['mark', new Set(colors.mark)], ['ear', new Set(colors.ear)],
];
let connected = 0, bounded = 0, grounded = 0, fourFootRows = 0, eliteSpans = 0;
let tuskViews = 0, colored = 0, flashes = 0, eyeViews = 0, trunkViews = 0;
let minOpaque = Infinity, maxOpaque = -Infinity, outlinedPixels = 0, formChanges = 0;
const differences = { frostvein: 0, tundrahide: 0, direWolf: 0 };
const alphaDifferences = { frostvein: 0, tundrahide: 0, direWolf: 0 };

for (const animation of animations) for (const direction of directions) {
  const animationDigests = [];
  for (let frame = 0; frame < animation.frames; frame++) {
    const captureKey = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E10_RIMEVAULT_MATRIARCH_REGISTRY, specs.candidate, direction, animation.id, frame);
    const frostvein = captureEnemyExpansionFrame(EN_E10_FROSTVEIN_WAYFINDER_REGISTRY, specs.frostvein, direction, animation.id, frame);
    const tundrahide = captureEnemyExpansionFrame(EN_E10_TUNDRAHIDE_GRAZER_REGISTRY, specs.tundrahide, direction, animation.id, frame);
    const direWolf = captureLegacyFrame(specs.direWolf, direction, animation.id, frame);
    const compared = { frostvein, tundrahide, direWolf };
    captures.set(captureKey, candidate);
    animationDigests.push(candidate.digest);
    records.candidate.push(frameRecord(candidate, specs.candidate, direction, animation.id, frame));
    records.frostvein.push(frameRecord(frostvein, specs.frostvein, direction, animation.id, frame));
    records.tundrahide.push(frameRecord(tundrahide, specs.tundrahide, direction, animation.id, frame));
    records.direWolf.push(frameRecord(direWolf, specs.direWolf, direction, animation.id, frame, false));

    check(candidate.outOfBoundsWrites.length === 0, captureKey + ' wrote outside the cell');
    check(candidate.alpha.every((value) => value === 0 || value === 255), captureKey + ' lost hard alpha');
    if (componentCount(candidate.pixels) === 1) connected++; else check(false, captureKey + ' must remain one connected actor');
    const isBounded = candidate.bounds && candidate.bounds.minX >= 1 && candidate.bounds.minY >= 1 && candidate.bounds.maxX <= 22 && candidate.bounds.maxY <= 22;
    if (isBounded) bounded++; else check(false, captureKey + ' lost the one-cell margin');
    if (candidate.bounds && candidate.bounds.maxY === 22) grounded++; else check(false, captureKey + ' lost broad-foot ground contact');
    check(candidate.opaquePixels >= 200 && candidate.opaquePixels <= 380, captureKey + ' density is implausible for an elite Mammoth');
    minOpaque = Math.min(minOpaque, candidate.opaquePixels);
    maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    const footRuns = rowRuns(candidate.pixels, 22);
    if (footRuns >= 4) fourFootRows++; else check(false, captureKey + ' lost four separated grounded broad-foot runs');
    const width = candidate.bounds.maxX - candidate.bounds.minX + 1;
    const height = candidate.bounds.maxY - candidate.bounds.minY + 1;
    const eliteSpan = (direction === 'left' || direction === 'right') ? width >= 22 : height >= 20;
    if (eliteSpan) eliteSpans++; else check(false, captureKey + ' lost the crescent-tusk vaulted elite span');

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
        check(eyeCount === 2, captureKey + ' front view must preserve paired gold eyes');
        check(featureCount >= 2, captureKey + ' front view must preserve trunk-face features');
        check(tuskCount >= 20, captureKey + ' front view must preserve paired enormous age-banded tusks');
        eyeViews++; trunkViews++; tuskViews++;
      } else {
        check(eyeCount === 1, captureKey + ' side view must preserve one gold profile eye');
        check(featureCount >= 1, captureKey + ' side view must preserve the trunk-face feature');
        check(tuskCount >= 12, captureKey + ' side view must preserve the enormous crescent profile tusk');
        eyeViews++; trunkViews++; tuskViews++;
      }
      colored++;
    }

    check(
      candidate.renderResult.rimevaultMatriarchGate === EN_E10_RIMEVAULT_MATRIARCH_GATE.id
        && candidate.renderResult.architectureDecision === EN_E10_MAMMOTH_TOPOLOGY_DECISION.id
        && candidate.renderResult.approvedPrecedingGate === EN_E10_FROSTVEIN_WAYFINDER_GATE.id
        && candidate.renderResult.childAssetCount === 0,
      captureKey + ' renderer gate or child boundary drifted',
    );
    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E10_RIMEVAULT_MATRIARCH_DATA);
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
  const hurt = captures.get(direction + '/hurt/' + EN_E10_RIMEVAULT_MATRIARCH_DEATH_SOURCE_FRAMES[frame]);
  check(death.digest === hurt.digest, direction + ' Death D' + (frame + 1) + ' must alias Hurt exactly');
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = captures.get('left/' + animation.id + '/' + frame);
  const right = captures.get('right/' + animation.id + '/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels)), 'side mirror contract drifted for ' + animation.id + '/' + frame);
}

const digests = Object.fromEntries(Object.keys(records).map((name) => [name, hashJson(records[name])]));
if (EN_E10_RIMEVAULT_MATRIARCH_GATE.candidateFrameDigest) check(digests.candidate === EN_E10_RIMEVAULT_MATRIARCH_GATE.candidateFrameDigest, 'candidate digest drifted');
if (EN_E10_RIMEVAULT_MATRIARCH_GATE.frostveinComparisonDigest) check(digests.frostvein === EN_E10_RIMEVAULT_MATRIARCH_GATE.frostveinComparisonDigest, 'Frostvein comparison digest drifted');
if (EN_E10_RIMEVAULT_MATRIARCH_GATE.tundrahideComparisonDigest) check(digests.tundrahide === EN_E10_RIMEVAULT_MATRIARCH_GATE.tundrahideComparisonDigest, 'Tundrahide comparison digest drifted');
if (EN_E10_RIMEVAULT_MATRIARCH_GATE.direWolfComparisonDigest) check(digests.direWolf === EN_E10_RIMEVAULT_MATRIARCH_GATE.direWolfComparisonDigest, 'Dire Wolf comparison digest drifted');
check(digests.frostvein === EN_E10_FROSTVEIN_WAYFINDER_GATE.candidateFrameDigest, 'approved Frostvein comparison source drifted');
check(digests.tundrahide === EN_E10_TUNDRAHIDE_GRAZER_GATE.candidateFrameDigest, 'approved Tundrahide comparison source drifted');
check(connected === 80 && bounded === 80 && grounded === 80, 'all 80 Rimevault frames must be connected, bounded, and grounded');
check(fourFootRows === 80 && eliteSpans === 80, 'all 80 frames must preserve four broad feet and the crescent-tusk vaulted elite span');
check(colored === 72 && flashes === 8 && eyeViews === 54 && trunkViews === 54 && tuskViews === 54, 'colored, flash, eye, trunk, or tusk view totals drifted');
for (const name of Object.keys(differences)) check(differences[name] === 80 && alphaDifferences[name] === 80, 'Rimevault Matriarch must differ from ' + name + ' in all 80 pixel and alpha frames');
check(outlinedPixels > 0 && formChanges > 0, 'Complete B outline and Form presentations must visibly change the candidate');

for (const [field, relative] of [
  ['artifactSha256', EN_E10_RIMEVAULT_MATRIARCH_GATE.artifact],
  ['outlinedArtifactSha256', EN_E10_RIMEVAULT_MATRIARCH_GATE.outlinedArtifact],
  ['assembledArtifactSha256', EN_E10_RIMEVAULT_MATRIARCH_GATE.assembledArtifact],
  ['comparisonArtifactSha256', EN_E10_RIMEVAULT_MATRIARCH_GATE.comparisonArtifact],
]) if (EN_E10_RIMEVAULT_MATRIARCH_GATE[field]) check(await fileHash(relative) === EN_E10_RIMEVAULT_MATRIARCH_GATE[field], field + ' drifted');
for (const review of Object.values(EN_E10_RIMEVAULT_MATRIARCH_GATE.reviewAnimations)) if (review.sha256) check(await fileHash(review.artifact) === review.sha256, review.artifact + ' drifted');

rejects(() => captureEnemyExpansionFrame(EN_E10_RIMEVAULT_MATRIARCH_REGISTRY, specs.candidate, 'down', 'idle', 2), 'out-of-range Idle', 'invalid for idle');
rejects(() => captureEnemyExpansionFrame(EN_E10_RIMEVAULT_MATRIARCH_REGISTRY, { ...specs.candidate, family: 'wolf' }, 'down', 'idle', 0), 'wrong family');
rejects(() => captureEnemyExpansionFrame(EN_E10_RIMEVAULT_MATRIARCH_REGISTRY, { ...specs.candidate, variant: 'frostvein-wayfinder' }, 'down', 'idle', 0), 'wrong variant');

if (errors.length) {
  console.error('EN-E10 Mammoth Rimevault Matriarch focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E10 Mammoth Rimevault Matriarch private elite candidate passes focused validation.');
  console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; opaque range ' + minOpaque + '-' + maxOpaque);
  console.log('- Mammoth identity: ' + fourFootRows + '/80 four-foot rows; ' + eliteSpans + '/80 crescent-tusk vaulted elite spans; ' + tuskViews + '/54 tusk views; ' + flashes + '/8 white flashes; ' + eyeViews + '/54 eye-bearing views; ' + trunkViews + '/54 trunk-face views');
  console.log('- Distinction: Frostvein ' + differences.frostvein + '/80; Tundrahide ' + differences.tundrahide + '/80; Dire Wolf ' + differences.direWolf + '/80 pixel and alpha frames differ');
  console.log('- Presentation: Complete B outline +' + outlinedPixels + ' pixels; Form changes ' + formChanges);
  console.log('- Protected: approved Frostvein and Tundrahide exact; public 92/294; zero child assets/effects; no outline registration; fixtures unchanged');
  console.log('- Candidate frame digest: ' + digests.candidate);
  console.log('- Approved Frostvein frame digest: ' + digests.frostvein);
  console.log('- Approved Tundrahide frame digest: ' + digests.tundrahide);
  console.log('- Public Dire Wolf frame digest: ' + digests.direWolf);
}
