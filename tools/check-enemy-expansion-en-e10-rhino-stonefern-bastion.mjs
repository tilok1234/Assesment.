import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import {
  EN_E10_MUDPLATE_GRAZER_GATE,
  EN_E10_MUDPLATE_GRAZER_REGISTRY,
  EN_E10_RHINO_TOPOLOGY_DECISION,
} from '../engine/enemy-expansion-en-e10-rhino-mudplate-grazer.js';
import {
  EN_E10_REEDCREST_SKIRMISHER_GATE,
  EN_E10_REEDCREST_SKIRMISHER_REGISTRY,
} from '../engine/enemy-expansion-en-e10-rhino-reedcrest-skirmisher.js';
import {
  EN_E10_STONEFERN_BASTION_CONTRACT,
  EN_E10_STONEFERN_BASTION_DATA,
  EN_E10_STONEFERN_BASTION_DEATH_SOURCE_FRAMES,
  EN_E10_STONEFERN_BASTION_FAMILY,
  EN_E10_STONEFERN_BASTION_GATE,
  EN_E10_STONEFERN_BASTION_REGISTRY,
  EN_E10_RHINO_ELITE_CONTRACT_CARD,
} from '../engine/enemy-expansion-en-e10-rhino-stonefern-bastion.js';
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
  candidate: { kind: 'enemy', family: 'rhino', variant: 'stonefern-bastion' },
  mudplate: { kind: 'enemy', family: 'rhino', variant: 'mudplate-grazer' },
  reedcrest: { kind: 'enemy', family: 'rhino', variant: 'reedcrest-skirmisher' },
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
  EN_E10_REEDCREST_SKIRMISHER_GATE.status === 'approved'
    && EN_E10_REEDCREST_SKIRMISHER_GATE.candidateFrameDigest === '3125fe122e54f7a2d08c3f28cd179f2a8409a771001e9021217238a488348f8e'
    && EN_E10_REEDCREST_SKIRMISHER_GATE.publishedImplementation === '2f02388f941088f0fdadff809c3b048ba2e93734'
    && EN_E10_REEDCREST_SKIRMISHER_GATE.publishedApprovalRecord === 'c0ab513f576f0e66cafcc0b36a3467b13e790936'
    && EN_E10_REEDCREST_SKIRMISHER_GATE.initialPublishedHandoff === 'bbe25e76653622c93b99068268f10791a35a9dc2'
    && EN_E10_REEDCREST_SKIRMISHER_GATE.publicationState === 'published'
    && EN_E10_REEDCREST_SKIRMISHER_GATE.nextGate.includes('no private elite Rhino candidate or other Rhino work is open'),
  'published Reedcrest predecessor or closed elite boundary drifted',
);
check(
  EN_E10_RHINO_TOPOLOGY_DECISION.status === 'selected'
    && EN_E10_RHINO_TOPOLOGY_DECISION.selected === 'baked-single-actor-natural-plated-low-grounded-quadruped'
    && EN_E10_RHINO_TOPOLOGY_DECISION.childAssets.length === 0,
  'approved Rhino topology decision drifted',
);
check(
  EN_E10_STONEFERN_BASTION_GATE.status === 'approved'
    && EN_E10_STONEFERN_BASTION_GATE.baseCheckpoint === 'b0313abeeaadea7e14b62339e280469b08b37653'
    && EN_E10_STONEFERN_BASTION_GATE.architectureDecision === EN_E10_RHINO_TOPOLOGY_DECISION.id
    && EN_E10_STONEFERN_BASTION_GATE.authorizationEvidence.includes('Codex asked whether that meant lets do next')
    && EN_E10_STONEFERN_BASTION_GATE.authorizationEvidence.includes('the designer replied approved')
    && EN_E10_STONEFERN_BASTION_GATE.authorizationEvidence.includes('exactly one private elite Rhino full 80-frame candidate')
    && EN_E10_STONEFERN_BASTION_GATE.approvedOn === '2026-08-13'
    && EN_E10_STONEFERN_BASTION_GATE.approvalEvidence.includes('The designer replied: approved')
    && EN_E10_STONEFERN_BASTION_GATE.approvalEvidence.includes('another sprite lane')
    && EN_E10_STONEFERN_BASTION_GATE.approvedImplementation === 'e527031e0d29444bf17a1cf79229bac7150d1786'
    && EN_E10_STONEFERN_BASTION_GATE.publicationAuthorizedOn === '2026-08-13'
    && EN_E10_STONEFERN_BASTION_GATE.publicationAuthorizationEvidence.includes('commit and push everything i approve')
    && EN_E10_STONEFERN_BASTION_GATE.publishedImplementation === 'e527031e0d29444bf17a1cf79229bac7150d1786'
    && EN_E10_STONEFERN_BASTION_GATE.publishedApprovalRecord === '154a12fc8e208f64cfb48f0d3dee71b1bff62d50'
    && EN_E10_STONEFERN_BASTION_GATE.initialPublishedHandoff === 'b3703b4c2c60b53c29e8f1941c9c8ffb158703f9'
    && EN_E10_STONEFERN_BASTION_GATE.publicationState === 'published'
    && EN_E10_STONEFERN_BASTION_GATE.precedingApproval.gateId === EN_E10_REEDCREST_SKIRMISHER_GATE.id
    && EN_E10_STONEFERN_BASTION_GATE.precedingApproval.candidateFrameDigest === EN_E10_REEDCREST_SKIRMISHER_GATE.candidateFrameDigest
    && EN_E10_STONEFERN_BASTION_GATE.precedingApproval.publishedImplementation === EN_E10_REEDCREST_SKIRMISHER_GATE.publishedImplementation
    && EN_E10_STONEFERN_BASTION_GATE.precedingApproval.publishedApprovalRecord === EN_E10_REEDCREST_SKIRMISHER_GATE.publishedApprovalRecord
    && EN_E10_STONEFERN_BASTION_GATE.precedingApproval.initialPublishedHandoff === EN_E10_REEDCREST_SKIRMISHER_GATE.initialPublishedHandoff
    && EN_E10_STONEFERN_BASTION_GATE.precedingApproval.currentReconciliation === EN_E10_STONEFERN_BASTION_GATE.baseCheckpoint,
  'elite Rhino authorization or predecessor tuple drifted',
);
check(
  JSON.stringify(EN_E10_RHINO_ELITE_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E10_RHINO_ELITE_CONTRACT_CARD.precedingVariant.id === 'reedcrest-skirmisher'
    && EN_E10_RHINO_ELITE_CONTRACT_CARD.activeVariant.id === 'stonefern-bastion'
    && EN_E10_RHINO_ELITE_CONTRACT_CARD.activeVariant.role === 'elite'
    && EN_E10_RHINO_ELITE_CONTRACT_CARD.activeVariant.status === 'implemented-full-approved'
    && EN_E10_RHINO_ELITE_CONTRACT_CARD.deferredRoles.length === 0
    && EN_E10_STONEFERN_BASTION_CONTRACT.state === 'implemented-complete-motion-approved',
  'elite Rhino role or candidate contract drifted',
);
check(
  EN_E10_STONEFERN_BASTION_DATA.actorTopology === EN_E10_RHINO_TOPOLOGY_DECISION.selected
    && EN_E10_STONEFERN_BASTION_DATA.childAssets.length === 0
    && EN_E10_STONEFERN_BASTION_DATA.bakedEffects.length === 0
    && EN_E10_STONEFERN_BASTION_GATE.animationContract.includes('short rising horn hook')
    && EN_E10_STONEFERN_BASTION_GATE.animationContract.includes('Cast aliases Attack exactly')
    && EN_E10_STONEFERN_BASTION_GATE.exclusions.includes('public Rhino registration or outline registration')
    && EN_E10_STONEFERN_BASTION_GATE.exclusions.includes('any Furious Depraved Rhino Boss source, catalog, roster, or asset change')
    && EN_E10_STONEFERN_BASTION_GATE.nextGate.includes('implementation e527031e0d29444bf17a1cf79229bac7150d1786, approval record 154a12fc8e208f64cfb48f0d3dee71b1bff62d50, and initial published handoff b3703b4c2c60b53c29e8f1941c9c8ffb158703f9 are remote verified')
    && EN_E10_STONEFERN_BASTION_GATE.nextGate.includes('completes the bounded publication tuple')
    && EN_E10_STONEFERN_BASTION_GATE.nextGate.includes('no additional Rhino or other sprite lane is open')
    && EN_E10_STONEFERN_BASTION_GATE.nextGate.includes('review evidence only'),
  'elite Rhino anatomy, effect firewall, motion, or stop boundary drifted',
);
check(
  Object.isFrozen(EN_E10_RHINO_ELITE_CONTRACT_CARD)
    && Object.isFrozen(EN_E10_STONEFERN_BASTION_CONTRACT)
    && Object.isFrozen(EN_E10_STONEFERN_BASTION_DATA)
    && Object.isFrozen(EN_E10_STONEFERN_BASTION_GATE),
  'elite Rhino contracts, data, and gate must be deeply immutable',
);
check(
  EN_E10_STONEFERN_BASTION_REGISTRY.families.length === 1
    && EN_E10_STONEFERN_BASTION_REGISTRY.publicFamilies.length === 0
    && EN_E10_STONEFERN_BASTION_FAMILY.variants.length === 1,
  'private elite Rhino registry boundary drifted',
);

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && engine.PUBLIC_ENEMIES.length === 92 && publicVariantCount === 294 && !engine.PUBLIC_ENEMIES.some(({ id }) => id === 'rhino'), 'candidate must preserve public 92/294 and keep Rhino private');
check(engine.EN_E10_STONEFERN_BASTION_REGISTRY === undefined, 'candidate must not leak through the public facade');
const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
const outlineSource = await readFile(path.join(root, 'engine', 'outline-renderer.js'), 'utf8');
for (const [source, label] of [[publicSource, 'public expansion registry'], [manifestSource, 'asset manifest'], [outlineSource, 'outline registry']]) check(!source.includes('stonefern-bastion'), label + ' must not mention Stonefern Bastion');
check(JSON.stringify(EN_E10_STONEFERN_BASTION_DEATH_SOURCE_FRAMES) === JSON.stringify([0, 1, 1, 1]), 'Death alias mapping drifted');
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
  await fileHash(EN_E10_STONEFERN_BASTION_GATE.bossDistinction.directionAsset) === EN_E10_STONEFERN_BASTION_GATE.bossDistinction.directionSha256
    && await fileHash(EN_E10_STONEFERN_BASTION_GATE.bossDistinction.animationAsset) === EN_E10_STONEFERN_BASTION_GATE.bossDistinction.animationSha256
    && EN_E10_STONEFERN_BASTION_GATE.bossDistinction.status === 'candidate-read-only',
  'protected Furious Depraved Rhino Boss assets drifted',
);

const captures = new Map();
const records = { candidate: [], mudplate: [], reedcrest: [], direWolf: [] };
const colors = EN_E10_STONEFERN_BASTION_DATA.stonefernBastion;
const palettes = [
  ['hide', new Set(colors.hide)], ['plate', new Set(colors.plate)], ['muzzle', new Set(colors.muzzle)],
  ['belly', new Set(colors.belly)], ['fern', new Set(colors.fern)], ['ear', new Set(colors.ear)],
];
let connected = 0, bounded = 0, grounded = 0, fourFootRows = 0, rhinoSpans = 0;
let hornViews = 0, colored = 0, flashes = 0, eyeViews = 0, wedgeFaceViews = 0, ridgeViews = 0, fernViews = 0;
let minOpaque = Infinity, maxOpaque = -Infinity, outlinedPixels = 0, formChanges = 0;
const differences = { mudplate: 0, reedcrest: 0, direWolf: 0 };
const alphaDifferences = { mudplate: 0, reedcrest: 0, direWolf: 0 };
const forbiddenBossColors = new Set(['#66706a', '#384440', '#9aa39b', '#d9cfab', '#8f8569', '#fff4cf', '#8f493b', '#b53040', '#713f86', '#a35cbd']);

for (const animation of animations) for (const direction of directions) {
  const animationDigests = [];
  for (let frame = 0; frame < animation.frames; frame++) {
    const captureKey = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E10_STONEFERN_BASTION_REGISTRY, specs.candidate, direction, animation.id, frame);
    const mudplate = captureEnemyExpansionFrame(EN_E10_MUDPLATE_GRAZER_REGISTRY, specs.mudplate, direction, animation.id, frame);
    const reedcrest = captureEnemyExpansionFrame(EN_E10_REEDCREST_SKIRMISHER_REGISTRY, specs.reedcrest, direction, animation.id, frame);
    const direWolf = captureLegacyFrame(specs.direWolf, direction, animation.id, frame);
    const compared = { mudplate, reedcrest, direWolf };
    captures.set(captureKey, candidate);
    animationDigests.push(candidate.digest);
    records.candidate.push(frameRecord(candidate, specs.candidate, direction, animation.id, frame));
    records.mudplate.push(frameRecord(mudplate, specs.mudplate, direction, animation.id, frame));
    records.reedcrest.push(frameRecord(reedcrest, specs.reedcrest, direction, animation.id, frame));
    records.direWolf.push(frameRecord(direWolf, specs.direWolf, direction, animation.id, frame, false));

    check(candidate.outOfBoundsWrites.length === 0, captureKey + ' wrote outside the cell');
    check(candidate.alpha.every((value) => value === 0 || value === 255), captureKey + ' lost hard alpha');
    if (componentCount(candidate.pixels) === 1) connected++; else check(false, captureKey + ' must remain one connected actor');
    const isBounded = candidate.bounds && candidate.bounds.minX >= 1 && candidate.bounds.minY >= 1 && candidate.bounds.maxX <= 22 && candidate.bounds.maxY <= 22;
    if (isBounded) bounded++; else check(false, captureKey + ' lost the one-cell margin');
    if (candidate.bounds && candidate.bounds.maxY === 22) grounded++; else check(false, captureKey + ' lost broad-foot ground contact');
    check(candidate.opaquePixels >= 150 && candidate.opaquePixels <= 360, captureKey + ' density is implausible for a broad elite Rhino');
    minOpaque = Math.min(minOpaque, candidate.opaquePixels); maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    const footRuns = rowRuns(candidate.pixels, 22);
    if (footRuns === 4) fourFootRows++; else check(false, captureKey + ' lost exactly four separated grounded three-toed foot runs');
    const width = candidate.bounds.maxX - candidate.bounds.minX + 1, height = candidate.bounds.maxY - candidate.bounds.minY + 1;
    const rhinoSpan = (direction === 'left' || direction === 'right') ? width >= 21 && height <= 21 : width >= 20 && height >= 17;
    if (rhinoSpan) rhinoSpans++; else check(false, captureKey + ' lost the broad low elite-Rhino span at ' + width + 'x' + height);

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
      if (countColors(candidate.pixels, new Set(colors.fern)) > 0) fernViews++;
      if (direction === 'up') {
        check(eyeCount === 0 && featureCount === 0 && hornCount === 0, captureKey + ' rear view must not expose face or horn pixels');
      } else if (direction === 'down') {
        check(eyeCount === 2, captureKey + ' front view must preserve paired copper-gold eyes');
        check(featureCount >= 2, captureKey + ' front view must preserve compact wedge-muzzle features');
        check(hornCount >= 10 && hornCount <= 26, captureKey + ' front view must preserve one heavy limestone horn and tiny nub without Boss-scale horn mass');
        eyeViews++; wedgeFaceViews++; hornViews++;
      } else {
        check(eyeCount === 1, captureKey + ' side view must preserve one copper-gold profile eye');
        check(featureCount >= 1, captureKey + ' side view must preserve the compact wedge-muzzle feature');
        check(hornCount >= 12 && hornCount <= 28, captureKey + ' side view must preserve one heavy limestone horn and tiny nub without Boss-scale horn mass');
        eyeViews++; wedgeFaceViews++; hornViews++;
      }
      colored++;
    }

    check(
      candidate.renderResult.stonefernBastionGate === EN_E10_STONEFERN_BASTION_GATE.id
        && candidate.renderResult.architectureDecision === EN_E10_RHINO_TOPOLOGY_DECISION.id
        && candidate.renderResult.approvedPrecedingGate === EN_E10_REEDCREST_SKIRMISHER_GATE.id
        && candidate.renderResult.childAssetCount === 0,
      captureKey + ' renderer gate or child boundary drifted',
    );
    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E10_STONEFERN_BASTION_DATA);
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
  const death = captures.get(direction + '/death/' + frame), hurt = captures.get(direction + '/hurt/' + EN_E10_STONEFERN_BASTION_DEATH_SOURCE_FRAMES[frame]);
  check(death.digest === hurt.digest, direction + ' Death D' + (frame + 1) + ' must alias Hurt exactly');
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = captures.get('left/' + animation.id + '/' + frame), right = captures.get('right/' + animation.id + '/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels)), 'side mirror contract drifted for ' + animation.id + '/' + frame);
}

const digests = Object.fromEntries(Object.keys(records).map((name) => [name, hashJson(records[name])]));
if (EN_E10_STONEFERN_BASTION_GATE.candidateFrameDigest) check(digests.candidate === EN_E10_STONEFERN_BASTION_GATE.candidateFrameDigest, 'candidate digest drifted');
check(digests.mudplate === EN_E10_STONEFERN_BASTION_GATE.mudplateComparisonDigest, 'Mudplate comparison digest drifted');
check(digests.reedcrest === EN_E10_STONEFERN_BASTION_GATE.reedcrestComparisonDigest, 'Reedcrest comparison digest drifted');
check(digests.direWolf === EN_E10_STONEFERN_BASTION_GATE.direWolfComparisonDigest, 'Dire Wolf comparison digest drifted');
check(digests.mudplate === EN_E10_MUDPLATE_GRAZER_GATE.candidateFrameDigest, 'approved Mudplate comparison source drifted');
check(digests.reedcrest === EN_E10_REEDCREST_SKIRMISHER_GATE.candidateFrameDigest, 'approved Reedcrest comparison source drifted');
check(connected === 80 && bounded === 80 && grounded === 80, 'all 80 Stonefern frames must be connected, bounded, and grounded');
check(fourFootRows === 80 && rhinoSpans === 80, 'all 80 frames must preserve four three-toed feet and the broad low elite-Rhino span');
check(colored === 72 && flashes === 8 && eyeViews === 54 && wedgeFaceViews === 54 && hornViews === 54 && ridgeViews === 72 && fernViews === 72, 'colored, flash, eye, wedge-face, horn, ridge, or fern-mark view totals drifted');
for (const name of Object.keys(differences)) check(differences[name] === 80 && alphaDifferences[name] === 80, 'Stonefern Bastion must differ from ' + name + ' in all 80 pixel and alpha frames');
check(outlinedPixels > 0 && formChanges > 0, 'Complete B outline and Form presentations must visibly change the candidate');

for (const [field, relative] of [
  ['artifactSha256', EN_E10_STONEFERN_BASTION_GATE.artifact],
  ['outlinedArtifactSha256', EN_E10_STONEFERN_BASTION_GATE.outlinedArtifact],
  ['assembledArtifactSha256', EN_E10_STONEFERN_BASTION_GATE.assembledArtifact],
  ['comparisonArtifactSha256', EN_E10_STONEFERN_BASTION_GATE.comparisonArtifact],
]) if (EN_E10_STONEFERN_BASTION_GATE[field]) check(await fileHash(relative) === EN_E10_STONEFERN_BASTION_GATE[field], field + ' drifted');
for (const review of Object.values(EN_E10_STONEFERN_BASTION_GATE.reviewAnimations)) if (review.sha256) check(await fileHash(review.artifact) === review.sha256, review.artifact + ' drifted');

rejects(() => captureEnemyExpansionFrame(EN_E10_STONEFERN_BASTION_REGISTRY, specs.candidate, 'down', 'idle', 2), 'out-of-range Idle', 'invalid for idle');
rejects(() => captureEnemyExpansionFrame(EN_E10_STONEFERN_BASTION_REGISTRY, { ...specs.candidate, family: 'wolf' }, 'down', 'idle', 0), 'wrong family');
rejects(() => captureEnemyExpansionFrame(EN_E10_STONEFERN_BASTION_REGISTRY, { ...specs.candidate, variant: 'furious-depraved-rhino' }, 'down', 'idle', 0), 'wrong variant');

if (errors.length) {
  console.error('EN-E10 Rhino Stonefern Bastion focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E10 Rhino Stonefern Bastion private elite candidate passes focused validation.');
  console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; opaque range ' + minOpaque + '-' + maxOpaque);
  console.log('- Rhino identity: ' + fourFootRows + '/80 four three-toed foot rows; ' + rhinoSpans + '/80 broad low ridged spans; ' + hornViews + '/54 heavy-horn views; ' + flashes + '/8 white flashes; ' + eyeViews + '/54 eye-bearing views; ' + wedgeFaceViews + '/54 wedge-face views; ' + ridgeViews + '/72 ridge views; ' + fernViews + '/72 fern-mark views');
  console.log('- Distinction: Mudplate ' + differences.mudplate + '/80; Reedcrest ' + differences.reedcrest + '/80; Dire Wolf ' + differences.direWolf + '/80 pixel and alpha frames differ; protected Boss palette and assets exact');
  console.log('- Presentation: Complete B outline +' + outlinedPixels + ' pixels; Form changes ' + formChanges);
  console.log('- Protected: approved Mudplate and Reedcrest exact; Furious Depraved Rhino Boss assets exact; public 92/294; zero child assets/effects; no outline registration; fixtures unchanged');
  console.log('- Candidate frame digest: ' + digests.candidate);
  console.log('- Approved Mudplate frame digest: ' + digests.mudplate);
  console.log('- Approved Reedcrest frame digest: ' + digests.reedcrest);
  console.log('- Public Dire Wolf frame digest: ' + digests.direWolf);
}
