import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as engine from '../sprite-engine.js';
import {
  EN_E04_BIRDFOLK_AERIE_SCOUT_GATE,
  EN_E04_BIRDFOLK_AERIE_SCOUT_REGISTRY,
} from '../engine/enemy-expansion-en-e04-birdfolk-aerie-scout.js';
import {
  EN_E11_PEACOCK_RAINFAN_FORAGER_GATE,
  EN_E11_PEACOCK_RAINFAN_FORAGER_REGISTRY,
  EN_E11_PEACOCK_TOPOLOGY_DECISION,
} from '../engine/enemy-expansion-en-e11-peacock-rainfan-forager.js';
import {
  EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_GATE,
  EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_REGISTRY,
} from '../engine/enemy-expansion-en-e11-peacock-mirrorfan-ambusher.js';
import {
  EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_CONTRACT,
  EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_DATA,
  EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_DEATH_SOURCE_FRAMES,
  EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_FAMILY,
  EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE,
  EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_REGISTRY,
  EN_E11_PEACOCK_ELITE_CONTRACT_CARD,
} from '../engine/enemy-expansion-en-e11-peacock-crownveil-sovereign.js';
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
  candidate: { kind: 'enemy', family: 'peacock', variant: 'crownveil-sovereign' },
  mirrorfan: { kind: 'enemy', family: 'peacock', variant: 'mirrorfan-ambusher' },
  rainfan: { kind: 'enemy', family: 'peacock', variant: 'rainfan-forager' },
  aerieScout: { kind: 'enemy', family: 'birdfolk', variant: 'aerie-scout' },
};

function check(condition, message) { if (!condition) errors.push(message); }
function hashJson(value) { return createHash('sha256').update(JSON.stringify(value)).digest('hex'); }
function frameRecord(captured, spec, direction, animation, frame, candidateFamily = true) {
  return { family: spec.family, variant: spec.variant, ...(candidateFamily ? { candidateFamily: spec.family } : {}), direction, animation, frame, digest: captured.digest, alphaDigest: captured.alphaDigest, opaquePixels: captured.opaquePixels, bounds: captured.bounds };
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
  EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_GATE.status === 'approved'
    && EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_GATE.publicationState === 'published'
    && EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_GATE.publishedImplementation === 'dcbb69ca92f8ba8be1a40c79d1ef84b56ac29216'
    && EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_GATE.publishedApprovalRecord === 'a39a0ef3d5054e040c75f6c9203efa194d987429'
    && EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_GATE.initialPublishedHandoff === '790c82ff0ae33f4777f2628c51af100a9fbc6f52',
  'published Mirrorfan predecessor tuple drifted',
);
check(
  EN_E11_PEACOCK_TOPOLOGY_DECISION.status === 'selected'
    && EN_E11_PEACOCK_TOPOLOGY_DECISION.selected === 'baked-single-actor-grounded-fan-tailed-bird'
    && EN_E11_PEACOCK_TOPOLOGY_DECISION.childAssets.length === 0,
  'approved Peacock topology decision drifted',
);
check(
  EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.status === 'approved'
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.baseCheckpoint === '6df83e5e642dbec5b68b856d436aa9db810678eb'
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.architectureDecision === EN_E11_PEACOCK_TOPOLOGY_DECISION.id
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.authorizationEvidence.includes('approved lets do next')
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.authorizationEvidence.includes('exactly one private elite Peacock full 80-frame candidate only')
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.approvedOn === '2026-08-13'
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.approvalEvidence.includes('The designer replied: approved')
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.approvalEvidence.includes('no continuation request')
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.approvedImplementation === '13ceea22b163ae87fe2b6acd9dcf0e45c6e800bc'
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.publicationAuthorizedOn === '2026-08-13'
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.publicationAuthorizationEvidence.includes('commit and push everything i approve')
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.publishedImplementation === '13ceea22b163ae87fe2b6acd9dcf0e45c6e800bc'
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.publishedApprovalRecord === '15d55e973e5b0d1566e2d3dec39981d37edf24b8'
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.initialPublishedHandoff === ''
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.publicationState === 'published-awaiting-handoff-reconciliation'
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.precedingApproval.gateId === EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_GATE.id
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.precedingApproval.candidateFrameDigest === EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_GATE.candidateFrameDigest
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.precedingApproval.currentReconciliation === EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.baseCheckpoint,
  'Crownveil authorization or predecessor tuple drifted',
);
check(
  JSON.stringify(EN_E11_PEACOCK_ELITE_CONTRACT_CARD.roleOrder) === JSON.stringify(['common', 'specialist', 'elite'])
    && EN_E11_PEACOCK_ELITE_CONTRACT_CARD.precedingVariant.id === 'mirrorfan-ambusher'
    && EN_E11_PEACOCK_ELITE_CONTRACT_CARD.activeVariant.id === 'crownveil-sovereign'
    && EN_E11_PEACOCK_ELITE_CONTRACT_CARD.activeVariant.role === 'elite'
    && EN_E11_PEACOCK_ELITE_CONTRACT_CARD.activeVariant.status === 'implemented-full-approved'
    && JSON.stringify(EN_E11_PEACOCK_ELITE_CONTRACT_CARD.deferredRoles) === JSON.stringify([])
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_CONTRACT.state === 'implemented-complete-motion-approved',
  'Peacock elite role contract drifted',
);
check(
  EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_DATA.actorTopology === EN_E11_PEACOCK_TOPOLOGY_DECISION.selected
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_DATA.childAssets.length === 0
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_DATA.bakedEffects.length === 0
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.animationContract.includes('full crowned shield')
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.animationContract.includes('Cast aliases Attack exactly')
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.exclusions.includes('registration')
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.exclusions.includes('fixtures')
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.exclusions.includes('approved Mirrorfan Ambusher pixel changes')
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.nextGate.includes('approval record 15d55e973e5b0d1566e2d3dec39981d37edf24b8')
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.nextGate.includes('no continuation request')
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.nextGate.includes('review evidence only'),
  'Crownveil anatomy, motion, effect firewall, or stop boundary drifted',
);
check(
  Object.isFrozen(EN_E11_PEACOCK_ELITE_CONTRACT_CARD)
    && Object.isFrozen(EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_CONTRACT)
    && Object.isFrozen(EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_DATA)
    && Object.isFrozen(EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE),
  'Crownveil contracts, data, and gate must be deeply immutable',
);
check(
  EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_REGISTRY.families.length === 1
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_REGISTRY.publicFamilies.length === 0
    && EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_FAMILY.variants.length === 1,
  'private elite Peacock registry boundary drifted',
);

const publicVariantCount = engine.PUBLIC_ENEMIES.reduce((sum, family) => sum + family.variants.length, 0);
check(engine.ENEMIES.length === 57 && engine.PUBLIC_ENEMIES.length === 92 && publicVariantCount === 294 && !engine.PUBLIC_ENEMIES.some(({ id }) => id === 'peacock'), 'candidate must preserve public 92/294 and keep Peacock private');
check(engine.EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_REGISTRY === undefined, 'candidate must not leak through the public facade');
const publicSource = await readFile(path.join(root, 'engine', 'enemy-expansion-public.js'), 'utf8');
const manifestSource = await readFile(path.join(root, 'asset-pack', 'manifest.json'), 'utf8');
const outlineSource = await readFile(path.join(root, 'engine', 'outline-renderer.js'), 'utf8');
for (const [source, label] of [[publicSource, 'public expansion registry'], [manifestSource, 'asset manifest'], [outlineSource, 'outline registry']]) check(!source.includes('crownveil-sovereign'), label + ' must not mention Crownveil Sovereign');
check(JSON.stringify(EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_DEATH_SOURCE_FRAMES) === JSON.stringify([0, 1, 1, 1]), 'Death alias mapping drifted');

const captures = new Map();
const records = { candidate: [], mirrorfan: [], rainfan: [], aerieScout: [] };
const colors = EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_DATA.peacock;
const palettes = [
  ['neck', new Set(colors.neck)], ['body', new Set(colors.body)], ['wing', new Set(colors.wing)],
  ['train', new Set(colors.train)], ['eyespot', new Set(colors.eyespot)], ['talon', new Set(colors.talon)],
];
let connected = 0, bounded = 0, grounded = 0, twoFootRows = 0, naturalSpans = 0, openFanViews = 0;
let colored = 0, flashes = 0, eyeViews = 0, beakViews = 0, crestViews = 0, trainViews = 0, wingViews = 0;
let minOpaque = Infinity, maxOpaque = -Infinity, outlinedPixels = 0, formChanges = 0;
const differences = { mirrorfan: 0, rainfan: 0, aerieScout: 0 };
const alphaDifferences = { mirrorfan: 0, rainfan: 0, aerieScout: 0 };

for (const animation of animations) for (const direction of directions) {
  const animationDigests = [];
  for (let frame = 0; frame < animation.frames; frame++) {
    const captureKey = direction + '/' + animation.id + '/' + frame;
    const candidate = captureEnemyExpansionFrame(EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_REGISTRY, specs.candidate, direction, animation.id, frame);
    const mirrorfan = captureEnemyExpansionFrame(EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_REGISTRY, specs.mirrorfan, direction, animation.id, frame);
    const rainfan = captureEnemyExpansionFrame(EN_E11_PEACOCK_RAINFAN_FORAGER_REGISTRY, specs.rainfan, direction, animation.id, frame);
    const aerieScout = captureEnemyExpansionFrame(EN_E04_BIRDFOLK_AERIE_SCOUT_REGISTRY, specs.aerieScout, direction, animation.id, frame);
    const compared = { mirrorfan, rainfan, aerieScout };
    captures.set(captureKey, candidate);
    animationDigests.push(candidate.digest);
    records.candidate.push(frameRecord(candidate, specs.candidate, direction, animation.id, frame));
    records.mirrorfan.push(frameRecord(mirrorfan, specs.mirrorfan, direction, animation.id, frame));
    records.rainfan.push(frameRecord(rainfan, specs.rainfan, direction, animation.id, frame));
    records.aerieScout.push(frameRecord(aerieScout, specs.aerieScout, direction, animation.id, frame, false));

    check(candidate.outOfBoundsWrites.length === 0, captureKey + ' wrote outside the cell');
    check(candidate.alpha.every((value) => value === 0 || value === 255), captureKey + ' lost hard alpha');
    if (componentCount(candidate.pixels) === 1) connected++; else check(false, captureKey + ' must remain one connected actor');
    const isBounded = candidate.bounds && candidate.bounds.minX >= 1 && candidate.bounds.minY >= 1 && candidate.bounds.maxX <= 22 && candidate.bounds.maxY <= 22;
    if (isBounded) bounded++; else check(false, captureKey + ' lost the one-cell margin');
    if (candidate.bounds && candidate.bounds.maxY === 22) grounded++; else check(false, captureKey + ' lost talon ground contact');
    check(candidate.opaquePixels >= 140 && candidate.opaquePixels <= 390, captureKey + ' density is implausible for a broad elite Peacock');
    minOpaque = Math.min(minOpaque, candidate.opaquePixels); maxOpaque = Math.max(maxOpaque, candidate.opaquePixels);

    const footRuns = rowRuns(candidate.pixels, 22);
    if (footRuns === 2) twoFootRows++; else check(false, captureKey + ' lost exactly two separated grounded three-toed foot runs');
    const width = candidate.bounds.maxX - candidate.bounds.minX + 1, height = candidate.bounds.maxY - candidate.bounds.minY + 1;
    const naturalSpan = (direction === 'left' || direction === 'right') ? width >= 19 && height >= 21 : width >= 14 && height >= 21;
    if (naturalSpan) naturalSpans++; else check(false, captureKey + ' lost the broad crowned ground-bird span at ' + width + 'x' + height);

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
        check(beakCount >= 8, captureKey + ' front view must preserve the old-ivory beak');
        eyeViews++; beakViews++;
      } else {
        check(eyeCount === 1, captureKey + ' side view must preserve one gold profile eye');
        check(featureCount === 1, captureKey + ' side view must preserve one compact profile feature');
        check(beakCount >= 9, captureKey + ' side view must preserve the old-ivory profile beak');
        eyeViews++; beakViews++;
      }
      const openFan = (animation.id === 'attack' || animation.id === 'cast') && (frame === 1 || frame === 2);
      if (openFan) {
        check(countColors(candidate.pixels, new Set(colors.eyespot)) >= 10, captureKey + ' open train must preserve readable crown eyes');
        check(width >= 20, captureKey + ' open train must produce a full crowned-shield silhouette');
        openFanViews++;
      }
      colored++;
    }

    check(
      candidate.renderResult.peacockCrownveilSovereignGate === EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.id
        && candidate.renderResult.architectureDecision === EN_E11_PEACOCK_TOPOLOGY_DECISION.id
        && candidate.renderResult.approvedPrecedingGate === EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_GATE.id
        && candidate.renderResult.childAssetCount === 0,
      captureKey + ' renderer gate or child boundary drifted',
    );
    const presentation = buildEnemyExpansionCandidatePresentation(candidate.pixels, EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_DATA);
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
  const death = captures.get(direction + '/death/' + frame), hurt = captures.get(direction + '/hurt/' + EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_DEATH_SOURCE_FRAMES[frame]);
  check(death.digest === hurt.digest, direction + ' Death D' + (frame + 1) + ' must alias Hurt exactly');
}
for (const animation of animations) for (let frame = 0; frame < animation.frames; frame++) {
  const left = captures.get('left/' + animation.id + '/' + frame), right = captures.get('right/' + animation.id + '/' + frame);
  check(JSON.stringify(left.pixels) === JSON.stringify(mirrorPixels(right.pixels)), 'side mirror contract drifted for ' + animation.id + '/' + frame);
}

const digests = Object.fromEntries(Object.keys(records).map((name) => [name, hashJson(records[name])]));
if (EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.candidateFrameDigest) check(digests.candidate === EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.candidateFrameDigest, 'candidate digest drifted');
if (EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.mirrorfanComparisonDigest) check(digests.mirrorfan === EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.mirrorfanComparisonDigest, 'Mirrorfan comparison digest drifted');
if (EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.rainfanComparisonDigest) check(digests.rainfan === EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.rainfanComparisonDigest, 'Rainfan comparison digest drifted');
if (EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.aerieScoutComparisonDigest) check(digests.aerieScout === EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.aerieScoutComparisonDigest, 'Aerie Scout comparison digest drifted');
check(digests.mirrorfan === EN_E11_PEACOCK_MIRRORFAN_AMBUSHER_GATE.candidateFrameDigest, 'approved Mirrorfan comparison source drifted');
check(digests.rainfan === EN_E11_PEACOCK_RAINFAN_FORAGER_GATE.candidateFrameDigest, 'approved Rainfan comparison source drifted');
check(digests.aerieScout === EN_E04_BIRDFOLK_AERIE_SCOUT_GATE.candidateFrameDigest, 'approved Aerie Scout comparison source drifted');
check(connected === 80 && bounded === 80 && grounded === 80, 'all 80 Crownveil frames must be connected, bounded, and grounded');
check(twoFootRows === 80 && naturalSpans === 80, 'all 80 frames must preserve two talon contacts and the broad crowned ground-bird span');
check(colored === 72 && flashes === 8 && eyeViews === 54 && beakViews === 54 && crestViews === 72 && trainViews === 72 && wingViews === 72 && openFanViews === 16, 'colored, flash, eye, beak, crest, train, wing, or open-fan view totals drifted');
for (const name of Object.keys(differences)) check(differences[name] === 80 && alphaDifferences[name] === 80, 'Crownveil Sovereign must differ from ' + name + ' in all 80 pixel and alpha frames');
check(outlinedPixels > 0 && formChanges > 0, 'Complete B outline and Form presentations must visibly change the candidate');

for (const [field, relative] of [
  ['artifactSha256', EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.artifact],
  ['outlinedArtifactSha256', EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.outlinedArtifact],
  ['assembledArtifactSha256', EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.assembledArtifact],
  ['comparisonArtifactSha256', EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.comparisonArtifact],
]) if (EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE[field]) check(await fileHash(relative) === EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE[field], field + ' drifted');
for (const review of Object.values(EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_GATE.reviewAnimations)) if (review.sha256) check(await fileHash(review.artifact) === review.sha256, review.artifact + ' drifted');

rejects(() => captureEnemyExpansionFrame(EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_REGISTRY, specs.candidate, 'down', 'idle', 2), 'out-of-range Idle', 'invalid for idle');
rejects(() => captureEnemyExpansionFrame(EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_REGISTRY, { ...specs.candidate, family: 'birdfolk' }, 'down', 'idle', 0), 'wrong family');
rejects(() => captureEnemyExpansionFrame(EN_E11_PEACOCK_CROWNVEIL_SOVEREIGN_REGISTRY, { ...specs.candidate, variant: 'phoenix' }, 'down', 'idle', 0), 'wrong variant');

if (errors.length) {
  console.error('EN-E11 Peacock Crownveil Sovereign focused gate failed:');
  for (const error of errors) console.error('- ' + error);
  process.exitCode = 1;
} else {
  console.log('EN-E11 Peacock Crownveil Sovereign approved private elite packet passes focused validation.');
  console.log('- Structure: ' + connected + '/80 connected; ' + bounded + '/80 bounded; ' + grounded + '/80 grounded; opaque range ' + minOpaque + '-' + maxOpaque);
  console.log('- Peacock identity: ' + twoFootRows + '/80 two three-toed talon rows; ' + naturalSpans + '/80 broad crowned bird spans; ' + openFanViews + '/16 full crown-shield views; ' + flashes + '/8 #f4f4f4 flashes; ' + eyeViews + '/54 eye-bearing views; ' + crestViews + '/72 crest views; ' + trainViews + '/72 train views; ' + wingViews + '/72 wing views');
  console.log('- Distinction: Mirrorfan ' + differences.mirrorfan + '/80; Rainfan ' + differences.rainfan + '/80; Aerie Scout ' + differences.aerieScout + '/80 pixel and alpha frames differ');
  console.log('- Presentation: Complete B outline +' + outlinedPixels + ' pixels; Form changes ' + formChanges);
  console.log('- Protected: approved Mirrorfan, Rainfan, and Aerie Scout exact; public 92/294; zero child assets/effects; no registration, outline registration, or fixtures');
  console.log('- Candidate frame digest: ' + digests.candidate);
  console.log('- Approved Mirrorfan frame digest: ' + digests.mirrorfan);
  console.log('- Approved Rainfan frame digest: ' + digests.rainfan);
  console.log('- Approved Aerie Scout frame digest: ' + digests.aerieScout);
}
