import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import {
  EN_E10_FROSTVEIN_WAYFINDER_GATE,
  EN_E10_FROSTVEIN_WAYFINDER_REGISTRY,
} from '../engine/enemy-expansion-en-e10-mammoth-frostvein-wayfinder.js';
import {
  EN_E10_MUDPLATE_GRAZER_GATE,
  EN_E10_MUDPLATE_GRAZER_REGISTRY,
  EN_E10_RHINO_TOPOLOGY_DECISION,
} from '../engine/enemy-expansion-en-e10-rhino-mudplate-grazer.js';
import {
  EN_E10_REEDCREST_SKIRMISHER_CONTRACT,
  EN_E10_REEDCREST_SKIRMISHER_DATA,
  EN_E10_REEDCREST_SKIRMISHER_DEATH_SOURCE_FRAMES,
  EN_E10_REEDCREST_SKIRMISHER_FAMILY,
  EN_E10_REEDCREST_SKIRMISHER_GATE,
  EN_E10_REEDCREST_SKIRMISHER_REGISTRY,
  EN_E10_RHINO_SPECIALIST_CONTRACT_CARD,
} from '../engine/enemy-expansion-en-e10-rhino-reedcrest-skirmisher.js';
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
  candidate: { kind: 'enemy', family: 'rhino', variant: 'reedcrest-skirmisher' },
  mudplate: { kind: 'enemy', family: 'rhino', variant: 'mudplate-grazer' },
  frostvein: { kind: 'enemy', family: 'mammoth', variant: 'frostvein-wayfinder' },
  direWolf: { kind: 'enemy', family: 'wolf', variant: 'dire' },
};

function check(condition, message) { if (!condition) errors.push(message); }
function hashJson(value) { return createHash('sha256').update(JSON.stringify(value)).digest('hex'); }
function frameRecord(captured, spec, direction, animation, frame, candidateFamily = true) {
  return { family: spec.family, variant: spec.variant, ...(candidateFamily ? { candidateFamily: spec.family } : {}), direction, animation, frame, digest: captured.digest, alphaDigest: captured.alphaDigest, opaquePixels: captured.opaquePixels, bounds: captured.bounds };
}

function captureLegacyFrame(spec, direction, animation, frame) {
  const pixels = new Array(576).fill(null), outOfBoundsWrites = [];
  let fillStyle = '#000000';
  const context = {
    get fillStyle() { return fillStyle; }, set fillStyle(value) { fillStyle = value; },
    clearRect(x, y, width, height) { for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) { if (px < 0 || py < 0 || px >= 24 || py >= 24) outOfBoundsWrites.push({ x: px, y: py }); else pixels[(py * 24) + px] = null; } },
    fillRect(x, y, width, height) { for (let py = y; py < y + height; py++) for (let px = x; px < x + width; px++) { if (px < 0 || py < 0 || px >= 24 || py >= 24) outOfBoundsWrites.push({ x: px, y: py }); else pixels[(py * 24) + px] = fillStyle; } },
  };
  drawLegacySprite(context, spec, direction, animation, frame, { shadow: false });
  const occupied = pixels.flatMap((color, index) => color === null ? [] : [{ x: index % 24, y: Math.floor(index / 24) }]);
  const bounds = occupied.length ? { minX: Math.min(...occupied.map(({ x }) => x)), minY: Math.min(...occupied.map(({ y }) => y)), maxX: Math.max(...occupied.map(({ x }) => x)), maxY: Math.max(...occupied.map(({ y }) => y)) } : null;
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
      const index = queue.shift(), x = index % 24, y = Math.floor(index / 24);
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
  EN_E10_MUDPLATE_GRAZER_GATE.status === 'approved'
    && EN_E10_MUDPLATE_GRAZER_GATE.candidateFrameDigest === 'ba84ed03d4985b979974ab23d547fb7f687d6e2b948d80c9ccc84bb9cd911848'
    && EN_E10_MUDPLATE_GRAZER_GATE.publishedImplementation === '1e685159e6ddc09a20d853a511c9cfb448b502fe'
    && EN_E10_MUDPLATE_GRAZER_GATE.publishedApprovalRecord === '9d2b801f5e02c851e746571880d5465e65e3b1a6'
    && EN_E10_MUDPLATE_GRAZER_GATE.initialPublishedHandoff === 'fcb5296dba2c9960609d6dd5ed326ad97c093ac1'
    && EN_E10_MUDPLATE_GRAZER_GATE.publicationState === 'published'
    && EN_E10_MUDPLATE_GRAZER_GATE.nextGate.includes('opens exactly one private specialist Rhino full 80-frame candidate'),
  'published Mudplate predecessor or specialist continuation drifted',
);
check(
  EN_E10_RHINO_TOPOLOGY_DECISION.status === 'selected'
    && EN_E10_RHINO_TOPOLOGY_DECISION.selected === 'baked-single-actor-natural-plated-low-grounded-quadruped'
    && EN_E10_RHINO_TOPOLOGY_DECISION.childAssets.length === 0,
  'approved Rhino topology decision drifted',
);
check(
  EN_E10_REEDCREST_SKIRMISHER_GATE.status === 'approved'
    && EN_E10_REEDCREST_SKIRMISHER_GATE.baseCheckpoint === 'fb99996abd98ae369dc6d1fdb436e8f97d54bc95'
    && EN_E10_REEDCREST_SKIRMISHER_GATE.architectureDecision === EN_E10_RHINO_TOPOLOGY_DECISION.id
    && EN_E10_REEDCREST_SKIRMISHER_GATE.authorizationEvidence.includes('approved and lets do next')
    && EN_E10_REEDCREST_SKIRMISHER_GATE.authorizationEvidence.includes('exactly one private specialist Rhino full 80-frame candidate')
    && EN_E10_REEDCREST_SKIRMISHER_GATE.approvedOn === '2026-08-13'
    && EN_E10_REEDCREST_SKIRMISHER_GATE.approvalEvidence.includes('The designer replied: approved')
    && EN_E10_REEDCREST_SKIRMISHER_GATE.approvalEvidence.includes('It does not open elite Rhino')
    && EN_E10_REEDCREST_SKIRMISHER_GATE.approvedImplementation === '2f02388f941088f0fdadff809c3b048ba2e93734'
    && EN_E10_REEDCREST_SKIRMISHER_GATE.publicationAuthorizedOn === '2026-08-13'
    && EN_E10_REEDCREST_SKIRMISHER_GATE.publicationAuthorizationEvidence.includes('commit and push everything i approve')
    && EN_E10_REEDCREST_SKIRMISHER_GATE.publishedImplementation === '2f02388f941088f0fdadff809c3b048ba2e93734'
    && EN_E10_REEDCREST_SKIRMISHER_GATE.publishedApprovalRecord === 'c0ab513f576f0e66cafcc0b36a3467b13e790936'
    && EN_E10_REEDCREST_SKIRMISHER_GATE.initialPublishedHandoff === 'bbe25e76653622c93b99068268f10791a35a9dc2'
    && EN_E10_REEDCREST_SKIRMISHER_GATE.publicationState === 'published'
    && EN_E10_REEDCREST_SKIRMISHER_GATE.precedingApproval.gateId === EN_E10_MUDPLATE_GRAZER_GATE.id
    && EN_E10_REEDCREST_SKIRMISHER_GATE.precedingApproval.candidateFrameDigest === EN_E10_MUDPLATE_GRAZER_GATE.candidateFrameDigest
    && EN_E10_REEDCREST_SKIRMISHER_GATE.precedingApproval.publishedImplementation === EN_E10_MUDPLATE_GRAZER_GATE.publishedImplementation
    && EN_E10_REEDCREST_SKIRMISHER_GATE.precedingApproval.publishedApprovalRecord === EN_E10_MUDPLATE_GRAZER_GATE.publishedApprovalRecord
    && EN_E10_REEDCREST_SKIRMISHER_GATE.precedingApproval.initialPublishedHandoff === EN_E10_MUDPLATE_GRAZER_GATE.initialPublishedHandoff
    && EN_E10_REEDCREST_SKIRMISHER_GATE.precedingApproval.currentReconciliation === EN_E10_REEDCREST_SKIRMISHER_GATE.baseCheckpoint,
  'specialist Rhino authorization or predecessor tuple drifted',
);
check(
  JSON.stringify(EN_E10_RHINO_SPECIALIST_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E10_RHINO_SPECIALIST_CONTRACT_CARD.activeVariant.id === 'reedcrest-skirmisher'
    && EN_E10_RHINO_SPECIALIST_CONTRACT_CARD.activeVariant.role === 'specialist'
    && EN_E10_RHINO_SPECIALIST_CONTRACT_CARD.activeVariant.status === 'implemented-full-approved'
    && EN_E10_RHINO_SPECIALIST_CONTRACT_CARD.deferredRoles.join(',') === 'elite'
    && EN_E10_REEDCREST_SKIRMISHER_CONTRACT.state === 'implemented-complete-motion-approved',
  'specialist Rhino role or candidate contract drifted',
);
check(
  EN_E10_REEDCREST_SKIRMISHER_DATA.actorTopology === EN_E10_RHINO_TOPOLOGY_DECISION.selected
    && EN_E10_REEDCREST_SKIRMISHER_DATA.childAssets.length === 0
    && EN_E10_REEDCREST_SKIRMISHER_DATA.bakedEffects.length === 0
    && EN_E10_REEDCREST_SKIRMISHER_GATE.animationContract.includes('controlled body-owned rising horn sweep')
    && EN_E10_REEDCREST_SKIRMISHER_GATE.animationContract.includes('Cast aliases Attack exactly')
    && EN_E10_REEDCREST_SKIRMISHER_GATE.exclusions.includes('public Rhino registration or outline registration')
    && EN_E10_REEDCREST_SKIRMISHER_GATE.exclusions.includes('any Furious Depraved Rhino Boss source, catalog, roster, or asset change')
    && EN_E10_REEDCREST_SKIRMISHER_GATE.nextGate.includes('implementation 2f02388f941088f0fdadff809c3b048ba2e93734, approval record c0ab513f576f0e66cafcc0b36a3467b13e790936, and initial published handoff bbe25e76653622c93b99068268f10791a35a9dc2 are remote verified')
    && EN_E10_REEDCREST_SKIRMISHER_GATE.nextGate.includes('completes the bounded publication tuple')
    && EN_E10_REEDCREST_SKIRMISHER_GATE.nextGate.includes('no private elite Rhino candidate or other Rhino work is open')
    && EN_E10_REEDCREST_SKIRMISHER_GATE.nextGate.includes('review evidence only'),
  'specialist Rhino anatomy, effect firewall, motion, or stop boundary drifted',
);
check(
  Object.isFrozen(EN_E10_RHINO_SPECIALIST_CONTRACT_CARD)
    && Object.isFrozen(EN_E10_REEDCREST_SKIRMISHER_CONTRACT)
    && Object.isFrozen(EN_E10_REEDCREST_SKIRMISHER_DATA)
    && Object.isFrozen(EN_E10_REEDCREST_SKIRMISHER_GATE),
  'specialist Rhino contracts, data, and gate must be deeply immutable',
);
check(
  EN_E10_REEDCREST_SKIRMISHER_REGISTRY.families.length === 1
    && EN_E10_REEDCREST_SKIRMISHER_REGISTRY.publicFamilies.length === 0
    && EN_E10_REEDCREST_SKIRMISHER_FAMILY.variants.length === 1,
  'private specialist Rhino registry boundary drifted',
);

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && engine.PUBLIC_ENEMIES.length === 92 && publicVariantCount === 294 && !engine.PUBLIC_ENEMIES.some(({ id }) => id === 'rhino'), 'candidate must preserve public 92/294 and keep Rhino private');
check(engine.EN_E10_REEDCREST_SKIRMISHER_REGISTRY === undefined, 'candidate must not leak through the public facade');
const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
const outlineSource = await readFile(path.join(root, 'engine', 'outline-renderer.js'), 'utf8');
for (const [source, label] of [[publicSource, 'public expansion registry'], [manifestSource, 'asset manifest'], [outlineSource, 'outline registry']]) check(!source.includes('reedcrest-skirmisher'), label + ' must not mention Reedcrest Skirmisher');
check(JSON.stringify(EN_E10_REEDCREST_SKIRMISHER_DEATH_SOURCE_FRAMES) === JSON.stringify([0, 1, 1, 1]), 'Death alias mapping drifted');
const bossDirection = engine.BOSS_DIRECTION_PILOTS.find(({ id }) => id === 'furious-depraved-rhino');
const bossAnimation = engine.BOSS_ANIMATION_PILOTS.find(({ id }) => id === 'furious-depraved-rhino');
check(
  bossDirection?.status === 'candidate'
    && bossDirection.sheet === './engine/assets/bosses/furious-depraved-rhino-directions-v1.png'
    && bossAnimation?.reviewStatus === 'candidate'
    && bossAnimation.fullSheet === './engine/assets/bosses/furious-depraved-rhino-animation-v1-full.png',
  'protected Furious Depraved Rhino Boss candidate catalog state drifted',
);
check(
  await fileHash(EN_E10_REEDCREST_SKIRMISHER_GATE.bossDistinction.directionAsset) === EN_E10_REEDCREST_SKIRMISHER_GATE.bossDistinction.directionSha256
    && await fileHash(EN_E10_REEDCREST_SKIRMISHER_GATE.bossDistinction.animationAsset) === EN_E10_REEDCREST_SKIRMISHER_GATE.bossDistinction.animationSha256
    && EN_E10_REEDCREST_SKIRMISHER_GATE.bossDistinction.status === 'candidate-read-only',
  'protected Furious Depraved Rhino Boss assets drifted',
);

const captures = new Map();
const records = { candidate: [], mudplate: [], frostvein: [], direWolf: [] };
const colors = EN_E10_REEDCREST_SKIRMISHER_DATA.reedcrestSkirmisher;
const palettes = [
  ['hide', new Set(colors.hide)], ['plate', new Set(colors.plate)], ['muzzle', new Set(colors.muzzle)],
  ['belly', new Set(colors.belly)], ['reed', new Set(colors.reed)], ['ear', new Set(colors.ear)],
];
let connected = 0, bounded = 0, grounded = 0, fourFootRows = 0, rhinoSpans = 0;
let hornViews = 0, colored = 0, flashes = 0, eyeViews = 0, wedgeFaceViews = 0, ridgeViews = 0, blazeViews = 0;
let minOpaque = Infinity, maxOpaque = -Infinity, outlinedPixels = 0, formChanges = 0;
const differences = { mudplate: 0, frostvein: 0, direWolf: 0 };
const alphaDifferences = { mudplate: 0, frostvein: 0, direWolf: 0 };
const forbiddenBossColors = new Set(['#66706a', '#384440', '#9aa39b', '#d9cfab', '#8f8569', '#fff4cf', '#8f493b', '#b53040', '#713f86', '#a35cbd']);

for (const animation of animations) for (const direction of directions) {
  const animationDigests = [];
  for (let frame = 0; frame < animation.frames; frame++) {
    const captureKey = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E10_REEDCREST_SKIRMISHER_REGISTRY, specs.candidate, direction, animation.id, frame);
    const mudplate = captureEnemyExpansionFrame(EN_E10_MUDPLATE_GRAZER_REGISTRY, specs.mudplate, direction, animation.id, frame);
    const frostvein = captureEnemyExpansionFrame(EN_E10_FROSTVEIN_WAYFINDER_REGISTRY, specs.frostvein, direction, animation.id, frame);
    const direWolf = captureLegacyFrame(specs.direWolf, direction, animation.id, frame);
    const compared = { mudplate, frostvein, direWolf };
    captures.set(captureKey, candidate);
    animationDigests.push(candidate.digest);
    records.candidate.push(frameRecord(candidate, specs.candidate, direction, animation.id, frame));
    records.mudplate.push(frameRecord(mudplate, specs.mudplate, direction, animation.id, frame));
    records.frostvein.push(frameRecord(frostvein, specs.frostvein, direction, animation.id, frame));
    records.direWolf.push(frameRecord(direWolf, specs.direWolf, direction, animation.id, frame, false));

    check(candidate.outOfBoundsWrites.length === 0, captureKey + ' wrote outside the cell');
    check(candidate.alpha.every((value) => value === 0 || value === 255), captureKey + ' lost hard alpha');
    if (componentCount(candidate.pixels) === 1) connected++; else check(false, captureKey + ' must remain one connected actor');
    const isBounded = candidate.bounds && candidate.bounds.minX >= 1 && candidate.bounds.minY >= 1 && candidate.bounds.maxX <= 22 && candidate.bounds.maxY <= 22;
    if (isBounded) bounded++; else check(false, captureKey + ' lost the one-cell margin');
    if (candidate.bounds && candidate.bounds.maxY === 22) grounded++; else check(false, captureKey + ' lost broad-foot ground contact');
    check(candidate.opaquePixels >= 130 && candidate.opaquePixels <= 330, captureKey + ' density is implausible for a lean specialist Rhino');
    minOpaque = Math.min(minOpaque, candidate.opaquePixels); maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    const footRuns = rowRuns(candidate.pixels, 22);
    if (footRuns === 4) fourFootRows++; else check(false, captureKey + ' lost exactly four separated grounded three-toed foot runs');
    const width = candidate.bounds.maxX - candidate.bounds.minX + 1, height = candidate.bounds.maxY - candidate.bounds.minY + 1;
    const rhinoSpan = (direction === 'left' || direction === 'right') ? width >= 21 && height <= 20 : width >= 20 && height >= 16;
    if (rhinoSpan) rhinoSpans++; else check(false, captureKey + ' lost the lean low specialist-Rhino span at ' + width + 'x' + height);

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
      check(countColors(candidate.pixels, new Set([colors.foot])) >= 12, captureKey + ' lost four broad three-toed foot contacts');
      check(countColors(candidate.pixels, forbiddenBossColors) === 0, captureKey + ' copied a protected Boss palette color');
      const eyeCount = countColors(candidate.pixels, new Set([colors.eye]));
      const featureCount = countColors(candidate.pixels, new Set([colors.feature]));
      const hornCount = countColors(candidate.pixels, new Set(colors.horn));
      if (countColors(candidate.pixels, new Set(colors.plate)) > 0) ridgeViews++;
      if (countColors(candidate.pixels, new Set(colors.reed)) > 0) blazeViews++;
      if (direction === 'up') {
        check(eyeCount === 0 && featureCount === 0 && hornCount === 0, captureKey + ' rear view must not expose face or horn pixels');
      } else if (direction === 'down') {
        check(eyeCount === 2, captureKey + ' front view must preserve paired amber eyes');
        check(featureCount >= 2, captureKey + ' front view must preserve compact wedge-muzzle features');
        check(hornCount >= 7 && hornCount <= 18, captureKey + ' front view must preserve one medium upswept horn and tiny nub without Boss-scale horn mass');
        eyeViews++; wedgeFaceViews++; hornViews++;
      } else {
        check(eyeCount === 1, captureKey + ' side view must preserve one amber profile eye');
        check(featureCount >= 1, captureKey + ' side view must preserve the compact wedge-muzzle feature');
        check(hornCount >= 8 && hornCount <= 20, captureKey + ' side view must preserve one medium upswept horn and tiny nub without Boss-scale horn mass');
        eyeViews++; wedgeFaceViews++; hornViews++;
      }
      colored++;
    }

    check(
      candidate.renderResult.reedcrestSkirmisherGate === EN_E10_REEDCREST_SKIRMISHER_GATE.id
        && candidate.renderResult.architectureDecision === EN_E10_RHINO_TOPOLOGY_DECISION.id
        && candidate.renderResult.approvedPrecedingGate === EN_E10_MUDPLATE_GRAZER_GATE.id
        && candidate.renderResult.childAssetCount === 0,
      captureKey + ' renderer gate or child boundary drifted',
    );
    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E10_REEDCREST_SKIRMISHER_DATA);
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
  const death = captures.get(direction + '/death/' + frame), hurt = captures.get(direction + '/hurt/' + EN_E10_REEDCREST_SKIRMISHER_DEATH_SOURCE_FRAMES[frame]);
  check(death.digest === hurt.digest, direction + ' Death D' + (frame + 1) + ' must alias Hurt exactly');
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = captures.get('left/' + animation.id + '/' + frame), right = captures.get('right/' + animation.id + '/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels)), 'side mirror contract drifted for ' + animation.id + '/' + frame);
}

const digests = Object.fromEntries(Object.keys(records).map((name) => [name, hashJson(records[name])]));
check(digests.candidate === EN_E10_REEDCREST_SKIRMISHER_GATE.candidateFrameDigest, 'candidate digest drifted');
check(digests.mudplate === EN_E10_REEDCREST_SKIRMISHER_GATE.mudplateComparisonDigest, 'Mudplate comparison digest drifted');
check(digests.frostvein === EN_E10_REEDCREST_SKIRMISHER_GATE.frostveinComparisonDigest, 'Frostvein comparison digest drifted');
check(digests.direWolf === EN_E10_REEDCREST_SKIRMISHER_GATE.direWolfComparisonDigest, 'Dire Wolf comparison digest drifted');
check(digests.mudplate === EN_E10_MUDPLATE_GRAZER_GATE.candidateFrameDigest, 'approved Mudplate comparison source drifted');
check(digests.frostvein === EN_E10_FROSTVEIN_WAYFINDER_GATE.candidateFrameDigest, 'approved Frostvein comparison source drifted');
check(connected === 80 && bounded === 80 && grounded === 80, 'all 80 Reedcrest frames must be connected, bounded, and grounded');
check(fourFootRows === 80 && rhinoSpans === 80, 'all 80 frames must preserve four three-toed feet and the lean low specialist-Rhino span');
check(colored === 72 && flashes === 8 && eyeViews === 54 && wedgeFaceViews === 54 && hornViews === 54 && ridgeViews === 72 && blazeViews === 72, 'colored, flash, eye, wedge-face, horn, ridge, or blaze view totals drifted');
for (const name of Object.keys(differences)) check(differences[name] === 80 && alphaDifferences[name] === 80, 'Reedcrest Skirmisher must differ from ' + name + ' in all 80 pixel and alpha frames');
check(outlinedPixels > 0 && formChanges > 0, 'Complete B outline and Form presentations must visibly change the candidate');

for (const [field, relative] of [
  ['artifactSha256', EN_E10_REEDCREST_SKIRMISHER_GATE.artifact],
  ['outlinedArtifactSha256', EN_E10_REEDCREST_SKIRMISHER_GATE.outlinedArtifact],
  ['assembledArtifactSha256', EN_E10_REEDCREST_SKIRMISHER_GATE.assembledArtifact],
  ['comparisonArtifactSha256', EN_E10_REEDCREST_SKIRMISHER_GATE.comparisonArtifact],
]) check(await fileHash(relative) === EN_E10_REEDCREST_SKIRMISHER_GATE[field], field + ' drifted');
for (const review of Object.values(EN_E10_REEDCREST_SKIRMISHER_GATE.reviewAnimations)) check(await fileHash(review.artifact) === review.sha256, review.artifact + ' drifted');

rejects(() => captureEnemyExpansionFrame(EN_E10_REEDCREST_SKIRMISHER_REGISTRY, specs.candidate, 'down', 'idle', 2), 'out-of-range Idle', 'invalid for idle');
rejects(() => captureEnemyExpansionFrame(EN_E10_REEDCREST_SKIRMISHER_REGISTRY, { ...specs.candidate, family: 'wolf' }, 'down', 'idle', 0), 'wrong family');
rejects(() => captureEnemyExpansionFrame(EN_E10_REEDCREST_SKIRMISHER_REGISTRY, { ...specs.candidate, variant: 'furious-depraved-rhino' }, 'down', 'idle', 0), 'wrong variant');

if (errors.length) {
  console.error('EN-E10 Rhino Reedcrest Skirmisher focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E10 Rhino Reedcrest Skirmisher private specialist candidate passes focused validation.');
  console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; opaque range ' + minOpaque + '-' + maxOpaque);
  console.log('- Rhino identity: ' + fourFootRows + '/80 four three-toed foot rows; ' + rhinoSpans + '/80 lean low ridged spans; ' + hornViews + '/54 upswept-horn views; ' + flashes + '/8 white flashes; ' + eyeViews + '/54 eye-bearing views; ' + wedgeFaceViews + '/54 wedge-face views; ' + ridgeViews + '/72 ridge views; ' + blazeViews + '/72 reed-mark views');
  console.log('- Distinction: Mudplate ' + differences.mudplate + '/80; Frostvein ' + differences.frostvein + '/80; Dire Wolf ' + differences.direWolf + '/80 pixel and alpha frames differ; protected Boss palette and assets exact');
  console.log('- Presentation: Complete B outline +' + outlinedPixels + ' pixels; Form changes ' + formChanges);
  console.log('- Protected: approved Mudplate and Frostvein exact; Furious Depraved Rhino Boss assets exact; public 92/294; zero child assets/effects; no outline registration; fixtures unchanged');
  console.log('- Candidate frame digest: ' + digests.candidate);
  console.log('- Approved Mudplate frame digest: ' + digests.mudplate);
  console.log('- Approved Frostvein frame digest: ' + digests.frostvein);
  console.log('- Public Dire Wolf frame digest: ' + digests.direWolf);
}
