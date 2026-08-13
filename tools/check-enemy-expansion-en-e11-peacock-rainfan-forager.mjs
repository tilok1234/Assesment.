import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import { drawSprite as drawLegacySprite } from '../engine/renderer.js';
import {
  EN_E04_BIRDFOLK_AERIE_SCOUT_GATE,
  EN_E04_BIRDFOLK_AERIE_SCOUT_REGISTRY,
} from '../engine/enemy-expansion-en-e04-birdfolk-aerie-scout.js';
import { EN_E10_STONEFERN_BASTION_GATE } from '../engine/enemy-expansion-en-e10-rhino-stonefern-bastion.js';
import {
  EN_E11_PEACOCK_COMMON_CONTRACT_CARD,
  EN_E11_PEACOCK_RAINFAN_FORAGER_CONTRACT,
  EN_E11_PEACOCK_RAINFAN_FORAGER_DATA,
  EN_E11_PEACOCK_RAINFAN_FORAGER_DEATH_SOURCE_FRAMES,
  EN_E11_PEACOCK_RAINFAN_FORAGER_FAMILY,
  EN_E11_PEACOCK_RAINFAN_FORAGER_GATE,
  EN_E11_PEACOCK_RAINFAN_FORAGER_REGISTRY,
  EN_E11_PEACOCK_TOPOLOGY_DECISION,
} from '../engine/enemy-expansion-en-e11-peacock-rainfan-forager.js';
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
  candidate: { kind: 'enemy', family: 'peacock', variant: 'rainfan-forager' },
  aerieScout: { kind: 'enemy', family: 'birdfolk', variant: 'aerie-scout' },
  harpy: { kind: 'enemy', family: 'harpy', variant: 'screech' },
  griffin: { kind: 'enemy', family: 'griffin', variant: 'royal' },
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
  EN_E10_STONEFERN_BASTION_GATE.status === 'approved'
    && EN_E10_STONEFERN_BASTION_GATE.publicationState === 'published'
    && EN_E10_STONEFERN_BASTION_GATE.candidateFrameDigest
    && EN_E10_STONEFERN_BASTION_GATE.publishedImplementation
    && EN_E10_STONEFERN_BASTION_GATE.publishedApprovalRecord
    && EN_E10_STONEFERN_BASTION_GATE.initialPublishedHandoff
    && EN_E10_STONEFERN_BASTION_GATE.nextGate.includes('no additional Rhino or other sprite lane is open'),
  'published Stonefern predecessor or closed continuation boundary drifted',
);
check(
  EN_E11_PEACOCK_TOPOLOGY_DECISION.status === 'selected'
    && EN_E11_PEACOCK_TOPOLOGY_DECISION.selected === 'baked-single-actor-grounded-fan-tailed-bird'
    && EN_E11_PEACOCK_TOPOLOGY_DECISION.approvalEvidence.includes('approved and letsd go')
    && EN_E11_PEACOCK_TOPOLOGY_DECISION.childAssets.length === 0,
  'approved Peacock topology decision drifted',
);
check(
  EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.status === 'candidate'
    && EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.baseCheckpoint === '51033b2385fe5e3eab64006b935a85c91140e86f'
    && EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.architectureDecision === EN_E11_PEACOCK_TOPOLOGY_DECISION.id
    && EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.authorizationEvidence.includes('approved and letsd go')
    && EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.authorizationEvidence.includes('exactly one private common Peacock full 80-frame candidate only')
    && EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.precedingApproval.gateId === EN_E10_STONEFERN_BASTION_GATE.id
    && EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.precedingApproval.candidateFrameDigest === EN_E10_STONEFERN_BASTION_GATE.candidateFrameDigest
    && EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.precedingApproval.publishedImplementation === EN_E10_STONEFERN_BASTION_GATE.publishedImplementation
    && EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.precedingApproval.publishedApprovalRecord === EN_E10_STONEFERN_BASTION_GATE.publishedApprovalRecord
    && EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.precedingApproval.initialPublishedHandoff === EN_E10_STONEFERN_BASTION_GATE.initialPublishedHandoff
    && EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.precedingApproval.currentReconciliation === EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.baseCheckpoint,
  'Peacock authorization or predecessor tuple drifted',
);
check(
  JSON.stringify(EN_E11_PEACOCK_COMMON_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E11_PEACOCK_COMMON_CONTRACT_CARD.activeVariant.id === 'rainfan-forager'
    && EN_E11_PEACOCK_COMMON_CONTRACT_CARD.activeVariant.role === 'common'
    && EN_E11_PEACOCK_COMMON_CONTRACT_CARD.activeVariant.status === 'implemented-full-candidate'
    && JSON.stringify(EN_E11_PEACOCK_COMMON_CONTRACT_CARD.deferredRoles) === JSON.stringify(['specialist', 'elite'])
    && EN_E11_PEACOCK_RAINFAN_FORAGER_CONTRACT.state === 'implemented-complete-motion-candidate',
  'Peacock common role or candidate contract drifted',
);
check(
  EN_E11_PEACOCK_RAINFAN_FORAGER_DATA.actorTopology === EN_E11_PEACOCK_TOPOLOGY_DECISION.selected
    && EN_E11_PEACOCK_RAINFAN_FORAGER_DATA.childAssets.length === 0
    && EN_E11_PEACOCK_RAINFAN_FORAGER_DATA.bakedEffects.length === 0
    && EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.animationContract.includes('opens the connected eyespot train into a partial fan')
    && EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.animationContract.includes('Cast aliases Attack exactly')
    && EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.exclusions.includes('registration')
    && EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.exclusions.includes('fixtures')
    && EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.exclusions.includes('Phoenix')
    && EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.nextGate.includes('Explicit designer visual approval is required'),
  'Peacock anatomy, motion, effect firewall, or stop boundary drifted',
);
check(
  Object.isFrozen(EN_E11_PEACOCK_TOPOLOGY_DECISION)
    && Object.isFrozen(EN_E11_PEACOCK_COMMON_CONTRACT_CARD)
    && Object.isFrozen(EN_E11_PEACOCK_RAINFAN_FORAGER_CONTRACT)
    && Object.isFrozen(EN_E11_PEACOCK_RAINFAN_FORAGER_DATA)
    && Object.isFrozen(EN_E11_PEACOCK_RAINFAN_FORAGER_GATE),
  'Peacock topology, contracts, data, and gate must be deeply immutable',
);
check(
  EN_E11_PEACOCK_RAINFAN_FORAGER_REGISTRY.families.length === 1
    && EN_E11_PEACOCK_RAINFAN_FORAGER_REGISTRY.publicFamilies.length === 0
    && EN_E11_PEACOCK_RAINFAN_FORAGER_FAMILY.variants.length === 1,
  'private Peacock registry boundary drifted',
);

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && engine.PUBLIC_ENEMIES.length === 92 && publicVariantCount === 294 && !engine.PUBLIC_ENEMIES.some(({ id }) => id === 'peacock'), 'candidate must preserve public 92/294 and keep Peacock private');
check(engine.EN_E11_PEACOCK_RAINFAN_FORAGER_REGISTRY === undefined, 'candidate must not leak through the public facade');
const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
const outlineSource = await readFile(path.join(root, 'engine', 'outline-renderer.js'), 'utf8');
for (const [source, label] of [[publicSource, 'public expansion registry'], [manifestSource, 'asset manifest'], [outlineSource, 'outline registry']]) check(!source.includes('rainfan-forager'), label + ' must not mention Rainfan Forager');
check(JSON.stringify(EN_E11_PEACOCK_RAINFAN_FORAGER_DEATH_SOURCE_FRAMES) === JSON.stringify([0, 1, 1, 1]), 'Death alias mapping drifted');

const captures = new Map();
const records = { candidate: [], aerieScout: [], harpy: [], griffin: [] };
const colors = EN_E11_PEACOCK_RAINFAN_FORAGER_DATA.peacock;
const palettes = [
  ['neck', new Set(colors.neck)], ['body', new Set(colors.body)], ['wing', new Set(colors.wing)],
  ['train', new Set(colors.train)], ['eyespot', new Set(colors.eyespot)], ['talon', new Set(colors.talon)],
];
let connected = 0, bounded = 0, grounded = 0, twoFootRows = 0, naturalSpans = 0, openFanViews = 0;
let colored = 0, flashes = 0, eyeViews = 0, beakViews = 0, crestViews = 0, trainViews = 0, wingViews = 0;
let minOpaque = Infinity, maxOpaque = -Infinity, outlinedPixels = 0, formChanges = 0;
const differences = { aerieScout: 0, harpy: 0, griffin: 0 };
const alphaDifferences = { aerieScout: 0, harpy: 0, griffin: 0 };

for (const animation of animations) for (const direction of directions) {
  const animationDigests = [];
  for (let frame = 0; frame < animation.frames; frame++) {
    const captureKey = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E11_PEACOCK_RAINFAN_FORAGER_REGISTRY, specs.candidate, direction, animation.id, frame);
    const aerieScout = captureEnemyExpansionFrame(EN_E04_BIRDFOLK_AERIE_SCOUT_REGISTRY, specs.aerieScout, direction, animation.id, frame);
    const harpy = captureLegacyFrame(specs.harpy, direction, animation.id, frame);
    const griffin = captureLegacyFrame(specs.griffin, direction, animation.id, frame);
    const compared = { aerieScout, harpy, griffin };
    captures.set(captureKey, candidate);
    animationDigests.push(candidate.digest);
    records.candidate.push(frameRecord(candidate, specs.candidate, direction, animation.id, frame));
    records.aerieScout.push(frameRecord(aerieScout, specs.aerieScout, direction, animation.id, frame, false));
    records.harpy.push(frameRecord(harpy, specs.harpy, direction, animation.id, frame, false));
    records.griffin.push(frameRecord(griffin, specs.griffin, direction, animation.id, frame, false));

    check(candidate.outOfBoundsWrites.length === 0, captureKey + ' wrote outside the cell');
    check(candidate.alpha.every((value) => value === 0 || value === 255), captureKey + ' lost hard alpha');
    if (componentCount(candidate.pixels) === 1) connected++; else check(false, captureKey + ' must remain one connected actor');
    const isBounded = candidate.bounds && candidate.bounds.minX >= 1 && candidate.bounds.minY >= 1 && candidate.bounds.maxX <= 22 && candidate.bounds.maxY <= 22;
    if (isBounded) bounded++; else check(false, captureKey + ' lost the one-cell margin');
    if (candidate.bounds && candidate.bounds.maxY === 22) grounded++; else check(false, captureKey + ' lost talon ground contact');
    check(candidate.opaquePixels >= 85 && candidate.opaquePixels <= 340, captureKey + ' density is implausible for a compact natural Peacock');
    minOpaque = Math.min(minOpaque, candidate.opaquePixels); maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    const footRuns = rowRuns(candidate.pixels, 22);
    if (footRuns === 2) twoFootRows++; else check(false, captureKey + ' lost exactly two separated grounded three-toed foot runs');
    const width = candidate.bounds.maxX - candidate.bounds.minX + 1, height = candidate.bounds.maxY - candidate.bounds.minY + 1;
    const naturalSpan = (direction === 'left' || direction === 'right') ? width >= 18 && height >= 21 : width >= 12 && height >= 21;
    if (naturalSpan) naturalSpans++; else check(false, captureKey + ' lost the long-necked grounded-bird span at ' + width + 'x' + height);

    for (const name of Object.keys(compared)) {
      if (candidate.digest !== compared[name].digest) differences[name]++;
      if (candidate.alphaDigest !== compared[name].alphaDigest) alphaDifferences[name]++;
    }

    const flash = (animation.id === 'hurt' || animation.id === 'death') && frame === 0;
    if (flash) {
      const frameColors = new Set(candidate.pixels.filter(Boolean));
      check(frameColors.size === 1 && frameColors.has('#f4f4f4'), captureKey + ' must be an exact whole-silhouette #f4f4f4 flash');
      flashes++;
    } else {
      for (const [name, palette] of palettes) check(countColors(candidate.pixels, palette) > 0, captureKey + ' lost ' + name + ' palette identity');
      check(countColors(candidate.pixels, new Set(colors.talon)) >= 8, captureKey + ' lost two broad talon contacts');
      const eyeCount = countColors(candidate.pixels, new Set([colors.eye]));
      const featureCount = countColors(candidate.pixels, new Set([colors.feature]));
      const beakCount = countColors(candidate.pixels, new Set(colors.beak));
      if (countColors(candidate.pixels, new Set(colors.neck)) >= 16) crestViews++;
      if (countColors(candidate.pixels, new Set(colors.train)) > 0) trainViews++;
      if (countColors(candidate.pixels, new Set(colors.wing)) > 0) wingViews++;
      if (direction === 'up') {
        check(eyeCount === 0 && featureCount === 0 && beakCount === 0, captureKey + ' rear view must not expose eye, face, or beak pixels');
      } else if (direction === 'down') {
        check(eyeCount === 2, captureKey + ' front view must preserve paired gold eyes');
        check(featureCount === 2, captureKey + ' front view must preserve paired compact face features');
        check(beakCount >= 7, captureKey + ' front view must preserve the old-ivory beak');
        eyeViews++; beakViews++;
      } else {
        check(eyeCount === 1, captureKey + ' side view must preserve one gold profile eye');
        check(featureCount === 1, captureKey + ' side view must preserve one compact profile feature');
        check(beakCount >= 6, captureKey + ' side view must preserve the old-ivory profile beak');
        eyeViews++; beakViews++;
      }
      const openFan = (animation.id === 'attack' || animation.id === 'cast') && (frame === 1 || frame === 2);
      if (openFan) {
        check(countColors(candidate.pixels, new Set(colors.eyespot)) >= 6, captureKey + ' open train must preserve readable eyespots');
        check(width >= 20, captureKey + ' open train must produce a broad partial-fan silhouette');
        openFanViews++;
      }
      colored++;
    }

    check(
      candidate.renderResult.peacockRainfanForagerGate === EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.id
        && candidate.renderResult.architectureDecision === EN_E11_PEACOCK_TOPOLOGY_DECISION.id
        && candidate.renderResult.approvedPrecedingGate === EN_E10_STONEFERN_BASTION_GATE.id
        && candidate.renderResult.childAssetCount === 0,
      captureKey + ' renderer gate or child boundary drifted',
    );
    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E11_PEACOCK_RAINFAN_FORAGER_DATA);
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
  const death = captures.get(direction + '/death/' + frame), hurt = captures.get(direction + '/hurt/' + EN_E11_PEACOCK_RAINFAN_FORAGER_DEATH_SOURCE_FRAMES[frame]);
  check(death.digest === hurt.digest, direction + ' Death D' + (frame + 1) + ' must alias Hurt exactly');
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = captures.get('left/' + animation.id + '/' + frame), right = captures.get('right/' + animation.id + '/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels)), 'side mirror contract drifted for ' + animation.id + '/' + frame);
}

const digests = Object.fromEntries(Object.keys(records).map((name) => [name, hashJson(records[name])]));
if (EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.candidateFrameDigest) check(digests.candidate === EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.candidateFrameDigest, 'candidate digest drifted');
if (EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.aerieScoutComparisonDigest) check(digests.aerieScout === EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.aerieScoutComparisonDigest, 'Aerie Scout comparison digest drifted');
if (EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.harpyComparisonDigest) check(digests.harpy === EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.harpyComparisonDigest, 'Harpy comparison digest drifted');
if (EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.griffinComparisonDigest) check(digests.griffin === EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.griffinComparisonDigest, 'Griffin comparison digest drifted');
check(digests.aerieScout === EN_E04_BIRDFOLK_AERIE_SCOUT_GATE.candidateFrameDigest, 'approved Aerie Scout comparison source drifted');
check(connected === 80 && bounded === 80 && grounded === 80, 'all 80 Rainfan frames must be connected, bounded, and grounded');
check(twoFootRows === 80 && naturalSpans === 80, 'all 80 frames must preserve two talon contacts and the natural long-necked ground-bird span');
check(colored === 72 && flashes === 8 && eyeViews === 54 && beakViews === 54 && crestViews === 72 && trainViews === 72 && wingViews === 72 && openFanViews === 16, 'colored, flash, eye, beak, crest, train, wing, or open-fan view totals drifted');
for (const name of Object.keys(differences)) check(differences[name] === 80 && alphaDifferences[name] === 80, 'Rainfan Forager must differ from ' + name + ' in all 80 pixel and alpha frames');
check(outlinedPixels > 0 && formChanges > 0, 'Complete B outline and Form presentations must visibly change the candidate');

for (const [field, relative] of [
  ['artifactSha256', EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.artifact],
  ['outlinedArtifactSha256', EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.outlinedArtifact],
  ['assembledArtifactSha256', EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.assembledArtifact],
  ['comparisonArtifactSha256', EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.comparisonArtifact],
]) if (EN_E11_PEACOCK_RAINFAN_FORAGER_GATE[field]) check(await fileHash(relative) === EN_E11_PEACOCK_RAINFAN_FORAGER_GATE[field], field + ' drifted');
for (const review of Object.values(EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.reviewAnimations)) if (review.sha256) check(await fileHash(review.artifact) === review.sha256, review.artifact + ' drifted');

rejects(() => captureEnemyExpansionFrame(EN_E11_PEACOCK_RAINFAN_FORAGER_REGISTRY, specs.candidate, 'down', 'idle', 2), 'out-of-range Idle', 'invalid for idle');
rejects(() => captureEnemyExpansionFrame(EN_E11_PEACOCK_RAINFAN_FORAGER_REGISTRY, { ...specs.candidate, family: 'birdfolk' }, 'down', 'idle', 0), 'wrong family');
rejects(() => captureEnemyExpansionFrame(EN_E11_PEACOCK_RAINFAN_FORAGER_REGISTRY, { ...specs.candidate, variant: 'phoenix' }, 'down', 'idle', 0), 'wrong variant');

if (errors.length) {
  console.error('EN-E11 Peacock Rainfan Forager focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E11 Peacock Rainfan Forager private common candidate passes focused validation.');
  console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; opaque range ' + minOpaque + '-' + maxOpaque);
  console.log('- Peacock identity: ' + twoFootRows + '/80 two three-toed talon rows; ' + naturalSpans + '/80 long-necked natural-bird spans; ' + openFanViews + '/16 broad open-fan views; ' + flashes + '/8 #f4f4f4 flashes; ' + eyeViews + '/54 eye-bearing views; ' + crestViews + '/72 crest views; ' + trainViews + '/72 train views; ' + wingViews + '/72 wing views');
  console.log('- Distinction: Aerie Scout ' + differences.aerieScout + '/80; Harpy ' + differences.harpy + '/80; Griffin ' + differences.griffin + '/80 pixel and alpha frames differ');
  console.log('- Presentation: Complete B outline +' + outlinedPixels + ' pixels; Form changes ' + formChanges);
  console.log('- Protected: approved Stonefern and Aerie Scout exact; public 92/294; zero child assets/effects; no registration, outline registration, or fixtures');
  console.log('- Candidate frame digest: ' + digests.candidate);
  console.log('- Approved Aerie Scout frame digest: ' + digests.aerieScout);
  console.log('- Public Harpy frame digest: ' + digests.harpy);
  console.log('- Public Griffin frame digest: ' + digests.griffin);
}
